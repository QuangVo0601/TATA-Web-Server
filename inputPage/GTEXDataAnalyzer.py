import pandas as pd
import numpy as np
import statsmodels.api as sm
import statsmodels.formula.api as smf
import matplotlib.pyplot as plt
import math
from scipy import stats
from datetime import datetime

class GTEXDataAnalyzer:
	#dfList should be of a certain format
	#the first entry should ALWAYS be the control group
	#the rest should be comparing groups
	#groupNames should ALWAYS be in the same order as dfList
	def __init__(self, dfList, groupNames, tf_ens_ids):
		#stores base data with no operations done, no touch
		self.dfList = dfList

		#must be in the same order as the grounps sent in;
		#format shuold be control group at index 0, 1 to n are the groups in the comparison list
		self.group_names = groupNames

		#list of ens ids that are being used; first set is defaulted to using the ids in the control group
		self.ensIDs = self.dfList[0].iloc[:,0]

		#called as we will always want filtered dataframes
		self.filteredDfs = self.__find_overlapping_ENS()

		#each filter though matchENS changes this, used as filtered baseline dataframes
		#be careful of using data in the filtered dataframes, if any modifications was done, it will be not be reflected
		#most useful for getting the filtered ensIDs, data can be used as initial baseline after filtering
		self.batch_corrected_dfs = self.__do_batch_correction()

		self.big_dataframes = self.get_pca_data()

#****************************************************************used for rif calculations
		#full list of transcription factors used
		#all may not be used in calculations due to bad data or not being actually found in the data files
		self.transcription_ens_list = tf_ens_ids

		#will hold pearson r coefficients for each group comparisons
		self.r_values = []

	# big dataframe, don't use it now
	def get_big_dataframes(self):
		return self.big_dataframes
		#get the 1st element of this, pass it to Matthew

	# list of dfs for raw (uncorrected) pca graph
	def get_uncorrected_dataframes(self):
		return self.filteredDfs

	# list of dfs for corrected pca graph
	def get_batch_corrected_dataframes(self):
		return self.batch_corrected_dfs

	def get_pca_data(self):
		self.__do_batch_correction()
		big_raw_data = pd.DataFrame()
		big_batch_data = pd.DataFrame()
		for idx, (fdf, bdf) in enumerate(zip(self.filteredDfs, self.batch_corrected_dfs)):

			temp_df = fdf.copy()
			temp_df.loc[-1] = ["G" + str(idx+1)] * len(fdf.columns)
			temp_df.index = temp_df.index + 1
			temp_df = temp_df.sort_index()
			if idx > 0:
				big_raw_data = pd.concat([big_raw_data, temp_df.drop(temp_df.columns[0], axis = 1)], axis = 1)
			else:
				big_raw_data = pd.concat([big_raw_data, temp_df], axis = 1)

			temp_df = bdf.copy()
			temp_df.loc[-1] = ["G" + str(idx+1)] * len(bdf.columns)
			temp_df.index = temp_df.index + 1
			temp_df = temp_df.sort_index()

			big_batch_data = pd.concat([big_batch_data, temp_df], axis = 1)

		# big_raw_data.to_csv("/home/jjh/oscar2019/sampletestdata/no_batch_big_df.csv", index = False)
		return [big_raw_data, big_batch_data]
		

	def get_big_nobatch_data_csv(self):
		self.filteredDfs[0].to_csv("/home/jjh/oscar2019/sampletestdata/no_batch_big_df.csv")


	#****************************************************************************************
	#**																					   **
	#**parameter to pass in is test_mode 												   **
	#**test_mode = 0; use raw data AND equal variance t test   							   **
	#**test_mode = 1; use batch corrected data AND equal variance t test  				   **
	#**test_mode = 2; use raw data AND unequal variance t test 							   **
	#**test_mode = 3; use batch corrected data AND unequal variance t t test 			   **
	#**																					   **	
	#**this return a dataframe with overlapping ensIDs, fold change, t-values, and p-values**
	#**use is:																			   **
	#**analyzer = GTEXDataAnalyzer(data_groups, data_group_names)						   **
	#**results = analyzer.do_statistical_analysis(test_mode)																					   **
	#****************************************************************************************
	def do_statistical_analysis(self, test_mode):
		if test_mode == 0:
			results = self.__equal_var_test(0)
		elif test_mode == 1:
			results =  self.__equal_var_test(1)
		elif test_mode == 2:
			results =  self.__unequal_var_test(0)
		elif test_mode == 3:
			results = self.__unequal_var_test(1)
		return results	

	def __do_batch_correction(self):
		meanDf = self.__compute_log_avg(self.filteredDfs)
		newData = self.__batch_correction(meanDf)
		return newData

	def __clean_data(self, df_list):
		clean_data = [df.set_index(df.columns[0]).loc[~(df.set_index(df.columns[0])==0).all(axis=1)].reset_index() for df in df_list]

		# clean_data = []
		# for df in df_list:
		# 	temp_df = df.set_index(df.columns[0]) #dataframe with ensids as index
		# 	temp_df = temp_df.loc[~(temp_df==0).all(axis=1)] #filter out rows with all zero
		# 	temp_df = temp_df.reset_index()
		# 	clean_data.append(temp_df)

		#remove rows that have a percentage of zeros greater than cut_off
		cut_off = 0.6
		temp_df_list = [df.drop(df.index[[idx for idx, perc in enumerate(df.eq(0).sum(axis=1).apply(lambda x: x / len(df.columns))) if perc >= cut_off]]) for df in clean_data]
		
		# temp_df_list = []
		# remove_index_lists = []
		# for df in clean_data:
		# 	samples_size = len(df.columns)
		# 	num_of_zeros = df.eq(0).sum(axis=1)
		# 	percent_of_zeros = num_of_zeros.apply(lambda x: x / samples_size)
		# 	remove_indicies = []
		# 	for idx, perc in enumerate(percent_of_zeros):
		# 		if perc >= cut_off:
		# 			remove_indicies.append(idx)
		# 	filtered_df = df.drop(df.index[remove_indicies])
		# 	temp_df_list.append(filtered_df)		

		clean_data = temp_df_list

		print(clean_data)
		print("\n\n")

		return clean_data

	#	matchENS() operates on the given dataframes in self.dfList and finds the overlapping ensIDs from all groups
	#	After finding the intersection between the group's ensIDs, it returned the filtered dataframes in a list
	def __find_overlapping_ENS(self):
		print("\n\n\n FINDING OVERLAPPING ENS IDS \n\n\n")

		cleaned_dataframes_list = self.__clean_data(self.dfList)
		# cleaned_dataframes_list = self.dfList #if data is not cleaned, then about 300 more failed operations

		#self.ensIDs starts out with the control group ensIDs, if the count is greater than another group's ensIDs, that will be stored in self.ensIDs
		for dataf in cleaned_dataframes_list:
			if self.ensIDs.count() > dataf.iloc[:,0].count():
				self.ensIDs = dataf.iloc[:,0]

		#get intersection of ensIDs between all groups
		for dataf in cleaned_dataframes_list:
			self.ensIDs = pd.Series(np.intersect1d(self.ensIDs.values,dataf.iloc[:,0].values))

		# filters through each dataframe while also sorting by ensIDs, the index is then reset to keep it consistent in the dataframes	
		tempFilteredList = []																		   
		for idx, df in enumerate(cleaned_dataframes_list):
			tempDf = df.loc[df.iloc[:,0].isin(self.ensIDs)]   		#get new dataframe with only wanted ensIDs
			tempDf.sort_values(tempDf.columns[0], inplace=True)		#sort by ensIDs, throws a warning, it says we are operating on a slice of another dataframe which is what we want so we are fine
			tempDf.reset_index(inplace=True, drop = True)
			tempDf = tempDf.rename(columns={ tempDf.columns[0]: self.group_names[idx] })
			tempFilteredList.append(tempDf)

		# print(self.ensIDs)
		print(tempFilteredList)
		return tempFilteredList			

	#computes log avg for each dataframe, also takes the log10 of each cell in each dataframe, if a cell negative or 0, it becomes 0
	#input is either the filtered dataframe or the batch corrected dataframes
	#return meanDf which holds ensIDs and then the following columns are the averages for each ensID from each dataframe
	def __compute_log_avg(self, some_df_list):
		#compute log of each element, faster than below
		#drops the ensID column then reattaches after computing, replaces name of first column with name given in group_name list
		#uses modDfList as its basis, does NOT use filteredDfs; called after matchENS() or after batch correction
		tempList = []
		for idx,df in enumerate(some_df_list):
			tempDf = df.drop(df.columns[0], axis = 1).applymap(lambda x: math.log10(x) if x > 0 else  0)
			tempDf.insert(loc = 0, column = self.group_names[idx], value = self.ensIDs)
			tempList.append(tempDf)

		#get avgs of each dataframe with corresponding ensIDs
		meanCompareList = []
		for idx,df in enumerate(tempList):
			tempDf = df.mean(axis = 1).to_frame()
			tempDf.rename(columns={tempDf.columns[0]: self.group_names[idx]}, inplace=True)
			meanCompareList.append(tempDf)

		#will hold log averages for all groups by column
		meanDf = pd.DataFrame()							
		for df in meanCompareList:
			meanDf = pd.concat([meanDf, df], axis=1)

		return meanDf

	#operates on list of dataframes
	def __compute_log(self, some_df_list):
		tempList = []
		for idx,df in enumerate(some_df_list):
			tempDf = df.drop(df.columns[0], axis = 1).applymap(lambda x: math.log10(x) if x > 0 else  0)
			tempDf.insert(loc = 0, column = self.group_names[idx], value = self.ensIDs)
			tempList.append(tempDf)

		return tempList

	#operates on list of dataframes
	def __compute_mean(self, some_df_list):
		#get avgs of each dataframe with corresponding ensIDs
		meanCompareList = []

		for df in some_df_list:
			tempDf = df.mean(axis = 1).to_frame()
			# tempDf.rename(columns={tempDf.columns[0]: self.group_names[idx]}, inplace=True)
			tempDf.rename(columns={tempDf.columns[0]: df.columns[0]}, inplace=True)
			meanCompareList.append(tempDf)	

		#will hold log averages for all groups by column
		meanDf = pd.DataFrame()							
		for df in meanCompareList:
			meanDf = pd.concat([meanDf, df], axis=1)

		return meanDf

	# returns a concatenated dataframe, and modifies self.batch_corrected_dfs as a list of dataframes;
	# both sets are corrected with the linear regression parameters using the first dataframe as control
	def __batch_correction(self, meanDf):
		print("\n\n\n DOING BATCH CORRECTION \n\n\n")		
		#form is
		#controlgroup = a_n * group_n + c_n 

		#find a_n and c_n to do batch correction
		controlVar = meanDf.iloc[:,0]

		#linear regression
		results = []
		for idx in range(len(meanDf.columns)-1):
			otherVar = meanDf.iloc[:,idx+1]
			otherVar = sm.add_constant(otherVar)
			tempModel = sm.OLS(controlVar, otherVar).fit()
			results.append(tempModel)

		#each entry is const, coeff
		model_params = []
		for models in results:
			#print(models.summary())
			model_params.append(models.params.tolist())

		#log normalized data
		logFilteredDfs = self.__compute_log(self.filteredDfs)

		#do actual correction to data
		tempList = []
		for idx,df in enumerate(logFilteredDfs):
			tempDf = df
			if idx > 0:
				tempDf = df.drop(df.columns[0], axis = 1).applymap(lambda x: model_params[idx-1][1] * x + model_params[idx-1][0]) #do batch correction
				tempDf = tempDf.applymap(lambda x: x if x > 0 else 0)															  #any negative values turn to zero
				tempDf.insert(loc = 0, column = df.columns[0], value = self.ensIDs)	
			tempList.append(tempDf)

		return tempList

	def __compute_fold_change(self, mean_df, dfMode):
		print("\n\n\n COMPUTING FOLD CHANGE \n\n\n")

		meanDf = mean_df
		# print(mean_df)
		
		#mode = 0 for non batch corrected data
		if dfMode == 0:
			meanDf = meanDf.applymap(lambda x: math.log(x,2) if x > 0 else 0)
		#mode = 1 for batch correted data	
		elif dfMode == 1:
			meanDf = meanDf.applymap(lambda x: math.pow(10, x))
			meanDf = meanDf.applymap(lambda x: math.log(x, 2) if x > 0 else 0)

		fold_change = meanDf.iloc[:,1] - meanDf.iloc[:,0]
		return fold_change.tolist()

	def __equal_var_test(self, dfMode):
		print("\n\n\n DOING T TESTS \n\n\n")

		t_test_res_list = []

		#use filtered raw data
		if dfMode == 0:
			logFilteredDfs = self.__compute_log(self.filteredDfs)
			for dfNum, df in enumerate(logFilteredDfs[1:], 1):
				tempDf = self.ensIDs.copy().to_frame(name = self.group_names[0] + " vs. " + self.group_names[dfNum])
				t_values = []
				p_values = []
				for idx in range(len(self.ensIDs)):
					res = sm.stats.ttest_ind(logFilteredDfs[0].iloc[idx].tolist()[1:], df.iloc[idx].tolist()[1:], alternative = 'two-sided', usevar = 'pooled')
					t_values.append(res[0])
					p_values.append(res[1]) #list of t-statistic and p-value
				mean_tempDf = self.__compute_mean([self.filteredDfs[0], self.filteredDfs[dfNum]])
				tempDf["fold change"] = self.__compute_fold_change(mean_tempDf, 0)
				tempDf["t_values"] = t_values
				tempDf["p_values"] = p_values
				log_p_values = [-(math.log10(x)) for x in tempDf['p_values']]
				tempDf['log p values'] = log_p_values

				tempDf[mean_tempDf.columns[0] + " mean"] = mean_tempDf[mean_tempDf.columns[0]]
				tempDf[mean_tempDf.columns[1] + " mean"] = mean_tempDf[mean_tempDf.columns[1]]

				tempDf["mean of " + mean_tempDf.columns[0] + " and " + mean_tempDf.columns[1] + " averages"] = tempDf[[mean_tempDf.columns[0] + " mean",mean_tempDf.columns[1] + " mean"]].mean(axis = 1)

				t_test_res_list.append(tempDf)					
			print(t_test_res_list)

		#use filtered batch corrected data
		elif dfMode == 1:
			for dfNum, df in enumerate(self.batch_corrected_dfs[1:], 1):
				tempDf = self.ensIDs.copy().to_frame(name = self.group_names[0] + " vs. " + self.group_names[dfNum])
				t_values = []
				p_values = []
				for idx in range(len(self.ensIDs)):
					res = sm.stats.ttest_ind(self.batch_corrected_dfs[0].iloc[idx].tolist()[1:], df.iloc[idx].tolist()[1:], alternative = 'two-sided', usevar = 'pooled')
					t_values.append(res[0])
					p_values.append(res[1]) #list of t-statistic and p-value
				#dataframe has the ensids with the name of column being the two group names, rest of columns are indicated below
				mean_tempDf = self.__compute_mean([self.batch_corrected_dfs[0], df])
				tempDf["fold change"] = self.__compute_fold_change(mean_tempDf, 1)
				tempDf["t_values"] = t_values
				tempDf["p_values"] = p_values
				log_p_values = [-(math.log10(x)) for x in tempDf['p_values']]
				tempDf['log p values'] = log_p_values

				tempDf[mean_tempDf.columns[0] + " mean"] = mean_tempDf[mean_tempDf.columns[0]]
				tempDf[mean_tempDf.columns[1] + " mean"] = mean_tempDf[mean_tempDf.columns[1]]

				tempDf["mean of " + mean_tempDf.columns[0] + " and " + mean_tempDf.columns[1] + " averages"] = tempDf[[mean_tempDf.columns[0] + " mean",mean_tempDf.columns[1] + " mean"]].mean(axis = 1)

				t_test_res_list.append(tempDf)	
			print(t_test_res_list)

		return t_test_res_list	

	def __unequal_var_test(self, dfMode):
		print("\n\n\n DOING T TESTS \n\n\n")

		t_test_res_list = []

		#use filtered raw data
		if dfMode == 0:
			logFilteredDfs = self.__compute_log(self.filteredDfs)
			for dfNum, df in enumerate(logFilteredDfs[1:], 1):
				tempDf = self.ensIDs.copy().to_frame(name = self.group_names[0] + " vs. " + self.group_names[dfNum])
				t_values = []
				p_values = []
				for idx in range(len(self.ensIDs)):
					res = sm.stats.ttest_ind(logFilteredDfs[0].iloc[idx].tolist()[1:], df.iloc[idx].tolist()[1:], alternative = 'two-sided', usevar = 'unequal')
					t_values.append(res[0])
					p_values.append(res[1]) #list of t-statistic and p-value
				mean_tempDf = self.__compute_mean([self.filteredDfs[0], self.filteredDfs[dfNum]])
				tempDf["fold change"] = self.__compute_fold_change(mean_tempDf, 0)
				tempDf["t_values"] = t_values
				tempDf["p_values"] = p_values
				log_p_values = [-(math.log10(x)) for x in tempDf['p_values']]
				tempDf['log p values'] = log_p_values

				tempDf[mean_tempDf.columns[0] + " mean"] = mean_tempDf[mean_tempDf.columns[0]]
				tempDf[mean_tempDf.columns[1] + " mean"] = mean_tempDf[mean_tempDf.columns[1]]

				tempDf["mean of " + mean_tempDf.columns[0] + " and " + mean_tempDf.columns[1] + " averages"] = tempDf[[mean_tempDf.columns[0] + " mean",mean_tempDf.columns[1] + " mean"]].mean(axis = 1)


				t_test_res_list.append(tempDf)					
			print(t_test_res_list)

		#use filtered batch corrected data
		elif dfMode == 1:
			for dfNum, df in enumerate(self.batch_corrected_dfs[1:], 1):
				tempDf = self.ensIDs.copy().to_frame(name = self.group_names[0] + " vs. " + self.group_names[dfNum])
				t_values = []
				p_values = []
				for idx in range(len(self.ensIDs)):
					res = sm.stats.ttest_ind(self.batch_corrected_dfs[0].iloc[idx].tolist()[1:], df.iloc[idx].tolist()[1:], alternative = 'two-sided', usevar = 'unequal')
					t_values.append(res[0])
					p_values.append(res[1]) #list of t-statistic and p-value
				#dataframe has the ensids with the name of column being the two group names, rest of columns are indicated below
				# print(df.columns)
				mean_tempDf = self.__compute_mean([self.batch_corrected_dfs[0], df])
				tempDf["fold change"] = self.__compute_fold_change(mean_tempDf, 1)
				# tempDf["fold change"] = self.__compute_fold_change(self.filteredDfs[0], self.filteredDfs[dfNum], 0)
				tempDf["t_values"] = t_values
				tempDf["p_values"] = p_values
				log_p_values = [-(math.log10(x)) for x in tempDf['p_values']]
				tempDf['negative log 10 p values'] = log_p_values

				tempDf[mean_tempDf.columns[0] + " mean"] = mean_tempDf[mean_tempDf.columns[0]]
				tempDf[mean_tempDf.columns[1] + " mean"] = mean_tempDf[mean_tempDf.columns[1]]

				tempDf["mean of " + mean_tempDf.columns[0] + " and " + mean_tempDf.columns[1] + " averages"] = tempDf[[mean_tempDf.columns[0] + " mean",mean_tempDf.columns[1] + " mean"]].mean(axis = 1)

				tempDf.sort_values("p_values", inplace = True, ascending = False)
				tempDf.reset_index(inplace = True, drop = True)

				t_test_res_list.append(tempDf)
	
			print(t_test_res_list)

		return t_test_res_list	


 
	#******************************************************************************************
	#																						  *
	#																						  *
	#																						  *
	#							RIF calculations below                                        *							
	#																						  *
	#																						  *
	#																						  *
	#*******************************************************************************************

	def do_RIF_calculations(self, alpha, fc, stat_results):
		new_ens_ids = self.__filter_alpha_and_fold_change(alpha, fc, stat_results)
		RIF_vals = self.__calculate_RIF(new_ens_ids)
		top_rifs = self.__get_top_RIF_values(RIF_vals, 10)

		list_of_tf_lists = {}
		for top_rif_df, r_values, t_test_res in zip(top_rifs, self.r_values, stat_results): #iterate through comparison groups
			ens_rif_list = list(top_rif_df.index.values)	#list of top x rif ens ids for a comparison group
			tf_df_list = []
			for ens_id in ens_rif_list:	#iterate through the transcription factors
				tf_data = list(top_rif_df.loc[ens_id])
				largest_contributor_genes_dict = tf_data[1]
				sig_ens_ids, diff_vals = zip(*largest_contributor_genes_dict.items())
				
				tf_df = pd.DataFrame(index = sig_ens_ids)
				
				tf_df["diff values"] = diff_vals
				
				tf_df = tf_df.sort_index()
				wanted_sr = t_test_res.loc[t_test_res.iloc[:,0].isin(sig_ens_ids)]
				
				fc_list = list(wanted_sr["fold change"])
				tf_df["sig gene fc values"] = fc_list

				tf_fc = t_test_res.loc[t_test_res.iloc[:,0] == ens_id]

				tf_df[ens_id] = list(tf_fc["fold change"])*10

				tf_df_list.append(tf_df)
			list_of_tf_lists[t_test_res.columns[0]] = tf_df_list

		return list_of_tf_lists

	#returns a list of series that hold significant ens ids for each 2 sample t test
	def __filter_alpha_and_fold_change(self, alpha, fc_value, test_results):
		print("\n\n\n FILTERING ALPHA AND FOLD CHANGE \n\n\n")

		temp_list = []
		for df in test_results:
			temp_df = df[(df['fold change'].abs() > fc_value) & (df['p_values'] < alpha)]
			temp_df.reset_index(inplace = True, drop = True)
			ens_list = temp_df.iloc[:,0]
			temp_list.append(ens_list)	#should not include any ens ids with NaN values after this point from test results


		return temp_list

	#input: a df list with actual data and a list of significant ens ids
	#output: a single dataframe for each comparison group, n-1;
	#first column is ens ids
	#second column is control group tpm values
	#thrid column is interest group tpm values
	def __calculate_TPM_RIF(self, dfList, sig_ens_id_list):
		print("\n\n\n CALCULATING TPM VALUES \n\n\n")

		temp_list = []
		for idx, sig_ens_ids in enumerate(sig_ens_id_list, 1):
			#raw control group data, filtered by significant ens ids
			control_df = dfList[0]
			control_df = control_df.loc[control_df.iloc[:,0].isin(sig_ens_ids)]
			control_df.sort_values(control_df.columns[0], inplace = True)
			control_df.reset_index(inplace = True, drop = True)

			#raw data from interest group data, filtered by significant ens ids
			interest_df = dfList[idx]
			interest_df = interest_df.loc[interest_df.iloc[:,0].isin(sig_ens_ids)]
			interest_df.sort_values(interest_df.columns[0], inplace = True)
			interest_df.reset_index(inplace = True, drop = True)

			#get the means of each row for interest then control
			tpm_df = pd.DataFrame(sig_ens_ids)
			interest_mean = interest_df.mean(axis = 1)
			tpm_df = pd.concat([tpm_df, interest_mean], axis = 1)

			control_mean = control_df.mean(axis = 1)
			tpm_df = pd.concat([tpm_df, control_mean], axis = 1)

			tpm_df.columns = ["ens ids", "interest tpm", "control tpm"]

			temp_list.append(tpm_df)

		return temp_list	

	def __calculate_r_values(self, dfList,  sig_ens_id_list, transcript_ens_ids):
		print("\n\n\n CALCULATING R VALUES \n\n\n")

		i = 1;
		r_values_df_list = []
		for df, ens_ids in zip(dfList[1:], sig_ens_id_list):
			r_values = []

			#tf ens ids that are found in the original data
			tf_control_ids = [x for x in dfList[0].iloc[:,0] if x in transcript_ens_ids]
			#print(tf_control_ids)
			tf_interest_ids = [x for x in df.iloc[:,0] if x in transcript_ens_ids]
			#print(tf_interest_ids)

			shared_tf = [tf_id for tf_id in tf_control_ids if tf_id in tf_interest_ids]

			#get data of overlapping tf ens ids
			tf_control_data = dfList[0]
			tf_control_data = tf_control_data.loc[tf_control_data.iloc[:,0].isin(shared_tf)]
			tf_control_data.reset_index(inplace = True, drop = True)

			tf_interest_data = df.loc[df.iloc[:,0].isin(shared_tf)]
			tf_interest_data.reset_index(inplace = True, drop = True)

			#get data of significant ens ids
			control_data = dfList[0]
			control_data = control_data.loc[control_data.iloc[:,0].isin(ens_ids)] #filtered by significant ens ids
			control_data.reset_index(inplace = True, drop = True)

			interest_data = df.loc[df.iloc[:,0].isin(ens_ids)]
			interest_data.reset_index(inplace = True, drop = True)

			print(len(ens_ids))

			#base dataframes with index being overlapping tf ens ids with columns being significant ens ids
			corr_matrix_control = pd.DataFrame(index = shared_tf, columns = ens_ids)
			corr_matrix_interest = pd.DataFrame(index = shared_tf, columns = ens_ids)
			
			print("\n\n\n FILLING CONTROL MATRIX \n\n\n")	
			for TF_name in shared_tf:			
				self.__fill_corr_matrix(corr_matrix_control, TF_name, tf_control_data, control_data)				


			print("\n\n\n FILLING INTEREST MATRIX \n\n\n")
			for TF_name in 	shared_tf:	
				self.__fill_corr_matrix(corr_matrix_interest, TF_name, tf_interest_data, interest_data)

			r_values.append(corr_matrix_control)
			r_values.append(corr_matrix_interest)

			r_values_df_list.append(r_values)

			print("\n\n\nGroup " + str(i) + " is done \n\n\n")
			i+=1
		return r_values_df_list	


	def __fill_corr_matrix(self, corr_matrix, TF_name, tfs, sgs):
		# print("\n\n\n FILLING A CORRELATION MATRIX \n\n\n")
		#print(TF_name)
		width = len(sgs.index)
		for i in range(width):
			gene_name = sgs.iloc[i,:].iloc[0]
			tfs_data = tfs.loc[tfs.iloc[:,0] == TF_name].squeeze()
			tfs_data = list(tfs_data)[1:]
			sgs_data = sgs.iloc[i,:]
			sgs_data = list(sgs_data)[1:]
			t = stats.pearsonr(tfs_data, sgs_data)	
			corr_matrix.loc[TF_name][gene_name] = t

	#ens_df_list is a list of lists, the element lists hold the significant ens ids for each comparison
	def __calculate_RIF(self, sig_ens_id_list):
		tpm_values = self.__calculate_TPM_RIF(self.filteredDfs, sig_ens_id_list)

		r_values = self.__calculate_r_values(self.filteredDfs, sig_ens_id_list, self.transcription_ens_list)
		self.r_values = r_values

		#n-1 groups, number of comparison groups
		all_comparisons = 0
		failed_comparisons = 0
		rif_dfs = []
		for tpm_vals, r_val_set in zip(tpm_values, r_values):
			sig_ens = tpm_vals[tpm_vals.columns[0]]			#group significant ens
			interest_tpm = tpm_vals[tpm_vals.columns[1]]	#tpm values from interest group data
			control_tpm = tpm_vals[tpm_vals.columns[2]] 	#tpm values from control group data

			control_r_vals = r_val_set[0]
			interest_r_vals = r_val_set[1]

			#get transciprt factors from control group we care about for the group we are examining
			transcript_ens = r_val_set[0].index.tolist()
			
			#empty dataframe to fill
			rif_vals_df = pd.DataFrame(index = transcript_ens)


			rif_vals = []
			largest_sig_genes_list = []
			for tf in transcript_ens:
				temp_rif_sum = 0
				largest_sig_genes_dict = {}
				for sig_gene, i_tpm, c_tpm in zip(sig_ens, interest_tpm, control_tpm):
					if not(math.isnan(control_r_vals.loc[tf].at[sig_gene][0])) and not(math.isnan(interest_r_vals.loc[tf].at[sig_gene][0])):
						i_tpm_sq = i_tpm**2
						r_interest_r_val_sq = interest_r_vals.loc[tf].at[sig_gene][0] ** 2 
						c_tpm_sq = c_tpm **2
						r_control_r_val_sq = control_r_vals.loc[tf].at[sig_gene][0]**2
						diff = i_tpm * r_interest_r_val_sq - c_tpm_sq * r_control_r_val_sq
						if len(largest_sig_genes_dict) < 10:
							largest_sig_genes_dict[sig_gene] = diff
						else:
							smallest_val = min(largest_sig_genes_dict.items(), key=lambda x: x[1])
							if smallest_val[1] < diff:
								del largest_sig_genes_dict[smallest_val[0]]
								largest_sig_genes_dict[sig_gene] = diff 
					else:
						failed_comparisons += 1
					all_comparisons += 1
					temp_rif_sum += diff

				rif_vals.append(temp_rif_sum)
				largest_sig_genes_list.append(largest_sig_genes_dict)
			rif_vals_df["RIF values"] = rif_vals
			rif_vals_df["Largest sig genes values"] = largest_sig_genes_list
			rif_dfs.append(rif_vals_df)
		return rif_dfs

	def __get_top_RIF_values(self, RIF_list, threshold):
		top_rif_df_list = []
		for df in RIF_list:
			temp_df = df
			temp_df[temp_df.columns[0]] = temp_df[temp_df.columns[0]].abs()
			temp_df[temp_df.columns[0]] = temp_df[temp_df.columns[0]].apply(lambda x: math.log10(x) if x > 0 else 0)
			sorted_df = temp_df.sort_values(temp_df.columns[0], ascending = False)
			sorted_df = sorted_df.head(threshold)
			top_rif_df_list.append(sorted_df)

		return top_rif_df_list