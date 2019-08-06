import pandas as pd
import numpy as np
import statsmodels.api as sm
import statsmodels.formula.api as smf
import matplotlib.pyplot as plt
import math
import seaborn as sns
from scipy import stats
from datetime import datetime
import subprocess
from subprocess import Popen, PIPE
import random
import string
import os
from io import StringIO
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
#import plotly.graph_objects as go
#import networkx as nx

class GTEXDataAnalyzer:
	#dfList should be of a certain format
	#the first entry should ALWAYS be the control group
	#the rest should be comparing groups
	#groupNames should ALWAYS be in the same order as dfList
	def __init__(self, dfList, groupNames, tf_ens_ids, base_storage_path):
		#*******************************Job code managing*******************
		self.b_str_path = base_storage_path

		self.job_code_mgr = self.JobCodeManager(8, self.b_str_path)

		#*******************************data set up************************
		#stores base data with no operations done, do not nodify
		self.dfList = dfList

		#must be in the same order as the groups sent in;
		#format shuold be control group at index 0, 1 to n are the groups in the comparison list
		self.group_names = groupNames

		#list of ens ids that are being used; first set is defaulted to using the ids in the control group
		self.ensIDs = self.dfList[0].iloc[:,0]

		#called as we will always want filtered dataframes
		self.filteredDfs = self.__find_overlapping_ENS()

		# for df in self.filteredDfs:
		# 	df.to_csv("./" + df.columns[0] + ".csv")
		#used for batch correction, sent through R code to get batch corrected data
		self.r_input_data = self.get_pca_data()

		#holds a list of dataframes but the data is now batch corrected
		self.batch_corrected_dfs = self.__get_batch_corrected(len(dfList)) 

		#large dataframe with data from all groups concatenated
		#second row indicates which group the sample is a part of
		self.get_large_dataframes_csv()

		#*******************************rif calculations************************
		#full list of transcription factors used
		#all may not be used in calculations due to bad data or not being actually found in the data files
		self.transcription_ens_list = tf_ens_ids

		#will hold pearson r coefficients for each group comparisons; list of dataframes
		self.r_values = []



	# prepares a large dataframe with all groups in order to be batch corrected
	def get_pca_data(self):
		big_raw_data = pd.DataFrame()
		for idx, fdf in enumerate(self.filteredDfs):
			temp_df = fdf.copy()
			temp_df.loc[-1] = ["G" + str(idx+1)] * len(fdf.columns)
			temp_df.index = temp_df.index + 1
			temp_df = temp_df.sort_index()
			if idx > 0:
				big_raw_data = pd.concat([big_raw_data, temp_df.drop(temp_df.columns[0], axis = 1)], axis = 1)
			else:
				big_raw_data = pd.concat([big_raw_data, temp_df], axis = 1)
		big_raw_data.rename(columns = {big_raw_data.columns[0]: self.job_code_mgr.get_job_code()}, inplace = True)
		return big_raw_data
	
	#call at the end of init to get data into jobcode folder
	def get_job_code_data(self):
		big_raw_data = pd.DataFrame()
		big_batch_data = pd.DataFrame()
		for idx, (fdf, bdf) in enumerate(zip(self.filteredDfs, self.batch_corrected_dfs)):
			# label = "Group" + str(idx+1)
			# label_list = [label] * len(fdf.columns)
			# print(label_list)

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

	#creates the csv needed for batch correction	
	def get_big_nobatch_data_csv(self):
		self.r_input_data.to_csv(self.b_str_path + "/" + self.job_code_mgr.get_job_code() + "/" + "no_batch_big_df.csv", index = False)

	def get_large_dataframes_csv(self):
		big_dataframes = self.get_job_code_data()
		big_dataframes[0].to_csv(self.b_str_path + "/" + self.job_code_mgr.get_job_code() + "/results/filtered_raw_data.csv", index = False)
		big_dataframes[1].to_csv(self.b_str_path + "/" + self.job_code_mgr.get_job_code() + "/results/filtered_batch_corrected_data.csv", index = False)


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
		self.job_code_mgr.update_stage(3)	
		return results

	#does all batch correction operations
	def __get_batch_corrected(self, num_of_dfs):
		#write large dataframe to csv so R code can use it
		self.get_big_nobatch_data_csv()
		self.__run_batch_correction_from_R(num_of_dfs)

		print("\n\n\n DONE WITH BATCH CORRECTION \n\n\n")

		r_data = pd.read_csv(self.b_str_path + "/" + self.job_code_mgr.get_job_code() +  '/' + 'R Corrected Input.csv')
		ens = pd.read_csv(self.b_str_path + "/" + self.job_code_mgr.get_job_code() +  '/' + 'ENS IDs.csv',index_col = 0)
		ens.reset_index(drop=True,inplace=True)
		samples = pd.read_csv(self.b_str_path + "/" + self.job_code_mgr.get_job_code() +  '/' + 'Sample IDs.csv',index_col = 0)

		batch_corrected_df = self.__batchcorrected_to_wanted_data(r_data, ens, samples)
		batch_corrected_df = self.__rename_bc_df(batch_corrected_df)
		return batch_corrected_df

	#renames batch corrected dataframes for consistency
	def __rename_bc_df(self, df_list):
		temp_list = []
		for idx, df in enumerate(df_list):
			temp_df = df.rename(columns = {df.columns[0]: self.group_names[idx]})
			temp_list.append(temp_df)
		return temp_list

	#runs the R script to do the batch correction
	def __run_batch_correction_from_R(self, df_num):
		#command = '/usr/bin/Rscript'																#THIS NEEDS TO CHANGE DEPENDING ON COMPUTER
		#command = '/usr/bin/Rscript' # for mason server
		command = '/usr/local/bin/Rscript' # Quang's computer, need to do the same for mason server
		arg = '--vanilla'
		#path2script = "/home/jjh/oscar2019/mystuff/Batch_Correction_" + str(df_num) +".R"			#THIS NEEDS TO CHANGE DEPENDING ON COMPUTER
		# path2script = "/var/www/html/webtool/inputPage/R_batch_correction_scripts/Batch_Correction_" + str(df_num) +".R" # for mason server
		path2script = "inputPage/R_batch_correction_scripts/Batch_Correction_" + str(df_num) +".R" # Quang's computer
		command_line_args = self.b_str_path + "/" + self.job_code_mgr.get_job_code()
		result = subprocess.run([command, arg, path2script, command_line_args], stdout=subprocess.PIPE)

	#takes the output generated by the R script and puts it into the form 
	def __batch_corrected_to_dataframe_list(self, df):
		genes = df.iloc[:,0]
		genes.drop(genes.index[0],inplace=True)
		df.drop(df.columns[0],axis = 1,inplace=True)
		df_list = []
		r = df.iloc[0]
		for G_i in r.unique():
			sampids = list(r.index[r== G_i])
			groupframe = df.loc[:,sampids]
			groupframe.drop(groupframe.index[0],inplace = True)
			groupframe = pd.concat([genes,groupframe], axis = 1)
			groupframe.reset_index(drop=True, inplace=True)
			df_list.append(groupframe)
		temp_list = []
		for df in df_list:
			tempdf = df.set_index(df.columns[0]).apply(pd.to_numeric)
			# print("\n\n\n NOW RESETTING INDEX COLUMN \n\n\n")
			tempdf = tempdf.reset_index()
			temp_list.append(tempdf)
		df_list = temp_list
		return df_list

	## TAKES R OUTPUT, TURNS IT INTO A LIST OF DATAFRAMES CORRESPONDING TO EACH GROUP
	#CALL THIS ONE NOT THE ABOVE
	def __batchcorrected_to_wanted_data(self, r_data, ens, samples):
		r_data.drop([r_data.columns[0],r_data.columns[-1]],axis = 1,inplace=True)
		r_data = r_data.transpose()
		r_data.reset_index(drop=True,inplace=True)

		r_data = pd.concat([ens,r_data],axis=1)
		r_data.set_axis(samples.columns.values, axis = 1, inplace = True)
		r_data = pd.concat([samples,r_data],axis=0)
		r_data.reset_index(drop=True,inplace=True)
		return self.__batch_corrected_to_dataframe_list(r_data)

	def __clean_data(self, df_list):
		#remove all columns that are all zero
		clean_data = [df.set_index(df.columns[0]).loc[~(df.set_index(df.columns[0])==0).all(axis=1)].reset_index() for df in df_list]

		#	Both blocks of code are equivalent to the one liners in this function
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
		return tempFilteredList	
		




	#PROBABLY DEPRECIATED, NOT USED ANYMORE
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
	#returns the dataframes with the same format but numeric data is log 10 transformed
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
			tempDf = df.drop(df.columns[0], axis = 1)
			tempDf = tempDf.mean(axis = 1, numeric_only = True).to_frame()
			tempDf.rename(columns={tempDf.columns[0]: df.columns[0]}, inplace=True)
			meanCompareList.append(tempDf)	

		#will hold log averages for all groups by column
		#does NOT hold ens IDS, so some order must be enforced if this function is used
		meanDf = pd.DataFrame()							
		for df in meanCompareList:
			meanDf = pd.concat([meanDf, df], axis=1)
		return meanDf





	def make_result_csvs(self, df_list):
		for df in df_list:
			df.to_csv(self.b_str_path + "/" + self.job_code_mgr.get_job_code() +  '/results/' + df.columns[0] + " DE results.csv")


	def __equal_var_test(self, dfMode):
		print("\n\n\n DOING T TESTS \n\n\n")

		t_test_res_list = []

		#use filtered raw data
		if dfMode == 0:
			logFilteredDfs = self.__compute_log(self.filteredDfs)
			
			#iterate over data groups
			for dfNum, df in enumerate(logFilteredDfs[1:], 1):
				tempDf = self.ensIDs.copy().to_frame(name = self.group_names[0] + " vs. " + self.group_names[dfNum])
				t_values = []
				p_values = []
				#possible to maybe speed up things here as well; parallel programming or somehow vectorize it
				for idx in range(len(self.ensIDs)):
					#actual t test being done here
					res = sm.stats.ttest_ind(logFilteredDfs[0].iloc[idx].tolist()[1:], df.iloc[idx].tolist()[1:], alternative = 'two-sided', usevar = 'pooled')
					t_values.append(res[0])
					p_values.append(res[1]) #list of t-statistic and p-value
				self.job_code_mgr.update_stage(1)	
				#calculate other values like fold change and means of raw data	
				mean_tempDf = self.__compute_mean([self.filteredDfs[0], self.filteredDfs[dfNum]])
				tempDf["fold change"] = self.__compute_fold_change(mean_tempDf, 0)
				self.job_code_mgr.update_stage(2)	


				tempDf["t_values"] = t_values
				tempDf["p_values"] = p_values
				
				log_p_values = [-(math.log10(x)) for x in tempDf['p_values']]
				tempDf['log p values'] = log_p_values

				tempDf[mean_tempDf.columns[0] + " mean"] = mean_tempDf[mean_tempDf.columns[0]]
				tempDf[mean_tempDf.columns[1] + " mean"] = mean_tempDf[mean_tempDf.columns[1]]

				tempDf["mean of " + mean_tempDf.columns[0] + " and " + mean_tempDf.columns[1] + " averages"] = tempDf[[mean_tempDf.columns[0] + " mean",mean_tempDf.columns[1] + " mean"]].mean(axis = 1)

				tempDf.sort_values("p_values", inplace = True, ascending = False)
				tempDf.reset_index(inplace = True, drop = True)
				tempDf.columns = [tempDf.columns[0], "Fold Change", "T values", "P values", "Negative log 10 P values", raw_mean_data.columns[0] + " raw mean", raw_mean_data.columns[1] + " raw mean", "Mean Expression"]
				t_test_res_list.append(tempDf)					

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
				self.job_code_mgr.update_stage(1)	

				raw_mean_data = self.__compute_mean([self.filteredDfs[0], self.filteredDfs[dfNum]])				

				mean_tempDf = self.__compute_mean([self.batch_corrected_dfs[0], df])
				tempDf["fold change"] = self.__compute_fold_change(mean_tempDf, 1)
				self.job_code_mgr.update_stage(2)	
				
				tempDf["t_values"] = t_values
				tempDf["p_values"] = p_values
			
				log_p_values = [-(math.log10(x)) for x in tempDf['p_values']]
				tempDf['log p values'] = log_p_values

				tempDf[raw_mean_data.columns[0] + " raw mean"] = raw_mean_data[raw_mean_data.columns[0]]
				tempDf[raw_mean_data.columns[1] + " raw mean"] = raw_mean_data[raw_mean_data.columns[1]]

				tempDf["mean of " + raw_mean_data.columns[0] + " and " + raw_mean_data.columns[1] + " averages"] = tempDf[[raw_mean_data.columns[0] + " raw mean",raw_mean_data.columns[1] + " raw mean"]].mean(axis = 1)

				tempDf.sort_values("p_values", inplace = True, ascending = False)
				tempDf.reset_index(inplace = True, drop = True)
				tempDf.columns = [tempDf.columns[0], "Fold Change", "T values", "P values", "Negative log 10 P values", raw_mean_data.columns[0] + " raw mean", raw_mean_data.columns[1] + " raw mean", "Mean Expression"]
				t_test_res_list.append(tempDf)
		self.make_result_csvs(t_test_res_list)	
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
				self.job_code_mgr.update_stage(1)	
				mean_tempDf = self.__compute_mean([self.filteredDfs[0], self.filteredDfs[dfNum]])
				tempDf["fold change"] = self.__compute_fold_change(mean_tempDf, 0)
				self.job_code_mgr.update_stage(2)	
				tempDf["t_values"] = t_values
				tempDf["p_values"] = p_values

				log_p_values = [-(math.log10(x)) for x in tempDf['p_values']]
				tempDf['log p values'] = log_p_values

				tempDf[mean_tempDf.columns[0] + " mean"] = mean_tempDf[mean_tempDf.columns[0]]
				tempDf[mean_tempDf.columns[1] + " mean"] = mean_tempDf[mean_tempDf.columns[1]]

				tempDf["mean of " + mean_tempDf.columns[0] + " and " + mean_tempDf.columns[1] + " averages"] = tempDf[[mean_tempDf.columns[0] + " mean",mean_tempDf.columns[1] + " mean"]].mean(axis = 1)

				tempDf.sort_values("p_values", inplace = True, ascending = False)
				tempDf.reset_index(inplace = True, drop = True)

				tempDf.columns = [tempDf.columns[0], "Fold Change", "T values", "P values", "Negative log 10 P values", raw_mean_data.columns[0] + " raw mean", raw_mean_data.columns[1] + " raw mean", "Mean Expression"]

				t_test_res_list.append(tempDf)					
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
				self.job_code_mgr.update_stage(1)		
				#dataframe has the ensids with the name of column being the two group names, rest of columns are indicated below
				#ADD NEW MEANS  BASED ON RAW DATA
				raw_mean_data = self.__compute_mean([self.filteredDfs[0], self.filteredDfs[dfNum]])

				mean_tempDf = self.__compute_mean([self.batch_corrected_dfs[0], df])

				tempDf["fold change"] = self.__compute_fold_change(mean_tempDf, 1)
				self.job_code_mgr.update_stage(2)	
				tempDf["t_values"] = t_values
				tempDf["p_values"] = p_values

				log_p_values = [-(math.log10(x)) if x != 0 else 0 for x in tempDf['p_values'] ]
				tempDf['negative log 10 p values'] = log_p_values


				tempDf[raw_mean_data.columns[0] + " raw mean"] = raw_mean_data[raw_mean_data.columns[0]]
				tempDf[raw_mean_data.columns[1] + " raw mean"] = raw_mean_data[raw_mean_data.columns[1]]

				tempDf["mean of raw " + raw_mean_data.columns[0] + " and raw " + raw_mean_data.columns[1] + " averages"] = tempDf[[raw_mean_data.columns[0] + " raw mean",raw_mean_data.columns[1] + " raw mean"]].mean(axis = 1)

				tempDf.sort_values("p_values", inplace = True, ascending = False)
				tempDf.reset_index(inplace = True, drop = True)

				tempDf.columns = [tempDf.columns[0], "Fold Change", "T values", "P values", "Negative log 10 P values", raw_mean_data.columns[0] + " raw mean", raw_mean_data.columns[1] + " raw mean", "Mean Expression"]

				t_test_res_list.append(tempDf)
		self.make_result_csvs(t_test_res_list)			
		return t_test_res_list	


	def __compute_fold_change(self, mean_df, dfMode):
		print("\n\n\n COMPUTING FOLD CHANGE \n\n\n")

		meanDf = mean_df
		
		#the below if else could be removed without much problem, meaning we always do a log10 transformation on the mean dataframe 
		#only kept due to a situation where other operations maybe wanted on the batch corrected data

		#mode = 0 for non batch corrected data
		if dfMode == 0:
			meanDf = meanDf.applymap(lambda x: math.log(x,2) if x > 0 else 0)
		#mode = 1 for batch correted data	
		elif dfMode == 1:
			# meanDf = meanDf.applymap(lambda x: math.pow(10, x))
			meanDf = meanDf.applymap(lambda x: math.log(x, 2) if x > 0 else 0)

		fold_change = meanDf.iloc[:,1] - meanDf.iloc[:,0]
		return fold_change.tolist()

	#******************************************************************************************
	#																						  *
	#																						  *
	#																						  *
	#							RIF calculations below                                        *							
	#																						  *
	#																						  *
	#																						  *
	#*******************************************************************************************
	
	#calculates impact factor values for each transciprtion factor
	#returns a list of dataframes that holds data
	def do_RIF_calculations(self, alpha, fc, stat_results):
		new_ens_ids = self.__filter_alpha_and_fold_change(alpha, fc, stat_results)
		RIF_vals = self.__calculate_RIF(new_ens_ids)								#dataframe with transcription factors, rif values, dictionary of greatest sig ens ids contributors
		top_rifs = self.__get_top_RIF_values(RIF_vals, 10)

		print("\n\nGETTING RIF RESULTS\n\n")
		list_of_tf_lists = {}	#dictionary; keys are group names, values are lists of data frames for top 10 transcription factors for a comparison group
		for top_rif_df, r_values, t_test_res in zip(top_rifs, self.r_values, stat_results): #iterate through comparison groups
			ens_rif_list = list(top_rif_df.index.values)									#list of top x rif ens ids for a comparison group
			tf_df_list = []
			for ens_id in ens_rif_list:														#iterate through the transcription factors
				tf_data = list(top_rif_df.loc[ens_id])
				largest_contributor_genes_dict = tf_data[1]									#get dictionary of largest significant gene contributors
				sig_ens_ids, diff_vals = zip(*largest_contributor_genes_dict.items()) 		#get sig ens id and its value
				tf_df = pd.DataFrame(index = sig_ens_ids)
				
				tf_df["diff values"] = diff_vals
				
				tf_df = tf_df.sort_index()													#sort by ens id
				wanted_sr = t_test_res.loc[t_test_res.iloc[:,0].isin(sig_ens_ids)] 			#get results from t test results
				
				fc_list = list(wanted_sr[wanted_sr.columns[1]]) 							#get fold change for significant ens ids
				tf_df["sig gene fc values"] = fc_list

				tf_fc = t_test_res.loc[t_test_res.iloc[:,0] == ens_id]

				tf_df[ens_id] = list(tf_fc[tf_fc.columns[1]])*10 							#transcription factor ens id, repeated 10 times for formatting, all the same value

				tf_df_list.append(tf_df)
			list_of_tf_lists[t_test_res.columns[0]] = tf_df_list

		return list_of_tf_lists

	#returns a list of series that hold significant ens ids for each 2 sample t test
	def __filter_alpha_and_fold_change(self, alpha, fc_value, test_results):
		print("\n\n\n FILTERING ALPHA AND FOLD CHANGE \n\n\n")

		temp_list = []
		for df in test_results:
			temp_df = df[(df[df.columns[1]].abs() > fc_value) & (df[df.columns[3]] < alpha)]
			temp_df.reset_index(inplace = True, drop = True)
			ens_list = temp_df.iloc[:,0]
			temp_list.append(ens_list)	#should not include any ens ids with NaN values after this point from test results
		return temp_list

	#ens_df_list is a list of lists, the element lists hold the significant ens ids for each comparison
	def __calculate_RIF(self, sig_ens_id_list):
		print("\n\nCALCULATING RIF VALUES\n\n")
		tpm_values = self.__calculate_TPM_RIF(self.filteredDfs, sig_ens_id_list)

		r_values = self.__calculate_r_values(self.filteredDfs, sig_ens_id_list, self.transcription_ens_list)
		self.r_values = r_values

		print("\n\nDONE WITH R VALUES\n\n")

		#n-1 groups, number of comparison groups
		all_comparisons = 0
		failed_comparisons = 0
		rif_dfs = []
		for tpm_vals, r_val_set in zip(tpm_values, r_values):
			control_r_vals = r_val_set[0]
			interest_r_vals = r_val_set[1]

			#get transciprt factors from control group we care about for the group we are examining
			transcript_ens = r_val_set[0].index.tolist()
			
			#empty dataframe to fill
			rif_vals_df = pd.DataFrame(index = transcript_ens)

			sig_ens = tpm_vals[tpm_vals.columns[0]]			#group significant ens
			interest_tpm = tpm_vals[tpm_vals.columns[1]]	#tpm values from interest group data
			control_tpm = tpm_vals[tpm_vals.columns[2]] 	#tpm values from control group data

			control_r_vals = r_val_set[0]
			interest_r_vals = r_val_set[1]

			#get transciprt factors from control group we care about for the group we are examining
			transcript_ens = r_val_set[0].index.tolist()

			tf_rif_vals_df = pd.DataFrame(index = transcript_ens)

			rif_vals = []
			largest_sig_genes_list = []
			for tf in transcript_ens:
				#set up a dataframe to do all calculations for one transcription factor
				rif_vals_df = pd.DataFrame()
				rif_vals_df["sig ens"] = tpm_vals[tpm_vals.columns[0]]
				rif_vals_df["i tpm sq"] = tpm_vals[tpm_vals.columns[1]] ** 2
				rif_vals_df["c tpm sq"] = tpm_vals[tpm_vals.columns[2]] ** 2
				rif_vals_df = rif_vals_df.set_index("sig ens", drop = True)

				rif_vals_df["interest r vals sq"] = interest_r_vals.loc[tf] **2
				rif_vals_df["control r vals sq"] = control_r_vals.loc[tf] **2

				#make one column and do calculations all at once
				rif_vals_df["partial_rif_vals"] = (rif_vals_df["i tpm sq"] * rif_vals_df["interest r vals sq"]) - (rif_vals_df["c tpm sq"] * rif_vals_df["control r vals sq"])

				#sum up to get RIF value for a transcription factor
				rif_value = rif_vals_df["partial_rif_vals"].sum()

				rif_vals.append(rif_value)

				#find the most contributing significant genes by ens id
				sorted_rif_vals_df = rif_vals_df
				sorted_rif_vals_df["partial_rif_vals_abs"] = sorted_rif_vals_df["partial_rif_vals"].abs()
				sorted_rif_vals_df = sorted_rif_vals_df.sort_values("partial_rif_vals_abs", ascending = False)
				
				#create a dictionary with significant ens id as key, contributing rif value as value
				largest_sig_genes_dict = dict(zip(sorted_rif_vals_df.index, sorted_rif_vals_df["partial_rif_vals"][:10]))
				largest_sig_genes_list.append(largest_sig_genes_dict)
	
			tf_rif_vals_df["RIF values"] = rif_vals
			tf_rif_vals_df["Largest sig genes values"] = largest_sig_genes_list
			rif_dfs.append(tf_rif_vals_df)
		return rif_dfs

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

			#get all tf ens ids that are found in the original data
			tf_control_ids = [x for x in dfList[0].iloc[:,0] if x in transcript_ens_ids]

			tf_interest_ids = [x for x in df.iloc[:,0] if x in transcript_ens_ids]


			shared_tf = [tf_id for tf_id in tf_control_ids if tf_id in tf_interest_ids]

			#get data of overlapping tf ens ids
			tf_control_data = dfList[0]
			tf_control_data = tf_control_data.loc[tf_control_data.iloc[:,0].isin(shared_tf)]
			tf_control_data.reset_index(inplace = True, drop = True)

			tf_interest_data = df.loc[df.iloc[:,0].isin(shared_tf)]
			tf_interest_data.reset_index(inplace = True, drop = True)

			#get data of significant ens ids
			control_data = dfList[0]
			control_data = control_data.loc[control_data.iloc[:,0].isin(ens_ids)] 				#filtered by significant ens ids
			control_data.reset_index(inplace = True, drop = True)

			interest_data = df.loc[df.iloc[:,0].isin(ens_ids)]
			interest_data.reset_index(inplace = True, drop = True)

			print(len(ens_ids))

			#concatenate significant ens id data and tf ens id data for both groups
			corr_matrix_control = pd.concat([tf_control_data, control_data])
			corr_matrix_interest = pd.concat([tf_interest_data, interest_data])

			corr_matrix_control = corr_matrix_control.set_index(corr_matrix_control.columns[0])
			corr_matrix_interest = corr_matrix_interest.set_index(corr_matrix_interest.columns[0])

			corr_matrix_control_index_name = corr_matrix_control.index.name
			corr_matrix_interest_index_name = corr_matrix_interest.index.name

			#getting rid of index name as having the index name will result in unwanted formatting of results
			del corr_matrix_control.index.name
			del corr_matrix_interest.index.name

			#filter out any duplicate ens ids (transcription factors that are also significant will duplicate but we are now removing those)
			corr_matrix_control = corr_matrix_control[~corr_matrix_control.index.duplicated(keep='first')]
			corr_matrix_interest = corr_matrix_interest[~corr_matrix_interest.index.duplicated(keep='first')]

			#calculate r coefficient values for all possible pairs of transcription factors and significant ens ids
			#may seem redundant, but this is really fast compared to trying to iteratively do this
			print("\n\n\n FILLING CONTROL MATRIX \n\n\n")	
			corr_matrix_control = corr_matrix_control.transpose().corr(method = "pearson")

			print("\n\n\n FILLING INTEREST MATRIX \n\n\n")
			corr_matrix_interest = corr_matrix_interest.transpose().corr(method = "pearson")

			#filter out the resulting matrix so that index is transcription factors and columns are significant ens ids
			corr_matrix_control = corr_matrix_control[ens_ids].loc[shared_tf]
			corr_matrix_interest = corr_matrix_interest[ens_ids].loc[shared_tf]

			corr_matrix_control.index.name = corr_matrix_control_index_name
			corr_matrix_interest.index.name = corr_matrix_interest_index_name

			r_values.append(corr_matrix_control)
			r_values.append(corr_matrix_interest)

			r_values_df_list.append(r_values)

			print("\n\n\nGroup " + str(i) + " is done \n\n\n")
			i+=1
		return r_values_df_list

	#get top n transcription factors based of impact factor values where n is threshold
	def __get_top_RIF_values(self, RIF_list, threshold):
		print("\n\nGETTING TOP RIF VALUES\n\n")
		top_rif_df_list = []
		for df in RIF_list:
			temp_df = df
			temp_df[temp_df.columns[0]] = temp_df[temp_df.columns[0]].abs()
			temp_df[temp_df.columns[0]] = temp_df[temp_df.columns[0]].apply(lambda x: math.log10(x) if x > 0 else 0)
			sorted_df = temp_df.sort_values(temp_df.columns[0], ascending = False)
			sorted_df = sorted_df.head(threshold)
			top_rif_df_list.append(sorted_df)

		return top_rif_df_list
		
	#####################################################################################################################
	#																													#
	#																													#
	#																													#
	#										graping utilities															#
	#																													#
	#																													#
	#																													#
	#####################################################################################################################

	#create cluster heat maps for each group
	#data is based off of raw data even if batch correction is used
	#converts heatmaps into pngs and puts it in the same folder as this python class; change path as needed
	def cluster_graphs(self, alpha, fc_cut, t_test_results):
		sig_ens_lists = self.__filter_alpha_and_fold_change(alpha, fc_cut, t_test_results)
		heatmaps = self.__get_cluster_heatmap(sig_ens_lists, self.filteredDfs)
		for idx, hmap in enumerate(heatmaps, start = 1):
			hmap.savefig(self.b_str_path + "/" + self.job_code_mgr.get_job_code() + "/results/" + self.filteredDfs[0].columns[0] + " vs. " + self.filteredDfs[idx].columns[0] +" heatmap.png")
		self.job_code_mgr.update_stage(4)

	#helper function for above
	def __get_cluster_heatmap(self, sig_ens_list_of_lists, df_list):
		df_groups = [[df_list[0], df] for df in df_list[1:]]		#make list of pairs, n-1 where n is the number of dataframes
		
		cluster_heatmaps = []
		for sig_ens_list, df_list in zip(sig_ens_list_of_lists, df_groups):
			control_data_df = df_list[0].loc[df_list[0].iloc[:,0].isin(sig_ens_list)] 		#dataframe that holds control group data 
			# control_data_df.to_csv("/home/jjh/oscar2019" + "/" + self.job_code_mgr.get_job_code() + "/" +"control_heatmap_data.csv")
			interest_data_df = df_list[1].loc[df_list[1].iloc[:,0].isin(sig_ens_list)]		#dataframe that holds interest group data
			# interest_data_df.to_csv("/home/jjh/oscar2019" + "/" + self.job_code_mgr.get_job_code() + "/" +"interest_heatmap_data.csv")
			cluster_dataframe = pd.concat([control_data_df, interest_data_df.drop(interest_data_df.columns[0], axis = 1)], axis = 1)
			# cluster_dataframe.to_csv("/home/jjh/oscar2019" + "/" + self.job_code_mgr.get_job_code() + "/" +"control_and_interest_heatmap_data.csv")
			cluster_dataframe = cluster_dataframe.set_index(cluster_dataframe.columns[0])
			# print(cluster_dataframe)

			cluster_heatmaps.append(sns.clustermap(cluster_dataframe, z_score = 0, cmap = "RdBu_r", robust = True, method  = "median"))

		print(len(cluster_heatmaps))
		return cluster_heatmaps	



	#####################################################################################################################
	#																													#
	#																													#
	#																													#
	#										differential wiring															#
	#																													#
	#																													#
	#																													#
	#####################################################################################################################
	def do_differential_wiring(self, r_values_list):
		sig_dw_dfs = []
		for r_values in r_values_list:
			delta_frame = r_values[1] - r_values[0]
			# print("\n\n\n DELTA FRAME \n\n\n")			
			# print(delta_frame)
			# dw_values = self.__differential_wiring(delta_frame, 2)
			dw_values = self.__significant_rs(delta_frame, 5, 95)
			sig_dw_dfs.append(dw_values)
		print(sig_dw_dfs)	
		return sig_dw_dfs

	# def __differential_wiring(self, delta_frame, tolerance):
	# 	mean = delta_frame.mean().mean() 		# mean of deltaframe
	# 	sd = delta_frame.values.std(ddof=1) 	# sd of elements of deltaframe
	# 	# is degrees of freedom = 1 bad?
	# 	pairs = []
	# 	# loop through and check each element
	# 	for i in range(len(delta_frame.index.values)):
	# 		for j in range(len(delta_frame.columns.values)):
	# 			if abs(mean - delta_frame.iloc[i,j]) < abs(tolerance*sd):
	# 				delta_frame.iloc[i,j]=0
	# 	return delta_frame;

	def __significant_rs(self, delta_frame, lower_lim, upper_lim):
	    lower = np.percentile(delta_frame.values, lower_lim)
	    upper = np.percentile(delta_frame.values, upper_lim)
	    delta_frame = delta_frame.applymap(lambda x: x if (x >= upper) or (x <= lower) else 0 )
	    return delta_frame;

	#####################################################################################################################
	#																													#
	#																													#
	#																													#
	#										PCA stuff																	#
	#																													#
	#																													#
	#																													#
	#####################################################################################################################
	# PCA should takd a dataframe where rows are samples columns are their attributes
	# indexed by numbers 
	def __r_data_pca_graph(self, df):
		x = StandardScaler().fit_transform(df)
		pca = PCA(n_components=2)
		principalComponents = pca.fit_transform(x)
		principalDf = pd.DataFrame(data = principalComponents, columns = ['principal component 1', 'principal component 2'])
		principalDf.plot(kind='scatter',x='principal component 1',y='principal component 2',color='red')
		# plt.show()
		return principalDf

	def __r_data_PCA_wrapper(self, r_data, ens, samples):
		header = ['name'] + list(ens.transpose().iloc[0,:]) + ['condition']
		r_data.set_axis(header, axis = 1, inplace = True)
		#
		df1 = pd.concat([self.__r_data_pca_graph(r_data.loc[:,list(set(r_data.columns) - set(['name','condition']))]),
	 	r_data.loc[:,['name', 'condition']],samples], axis = 1)
		#df1.to_csv('Rdata_wrapper.csv', index = False)
		#coords = [list(df1.loc[df1['condition'] == group].iloc[:,0]) for group in df1.condition.unique()]
		coordsx = []
		coordsy = []
		for group in df1.condition.unique(): # for each group
			#print(group)
			# take all 'x' (principal component 1) coordinates for each group
			# looks like [[x,x,x,x,],[x,x,x,x,]....] where each sublist is the x's for group 1,2,3 so on
			coordsx += [list(df1.loc[df1['condition'] == group].iloc[:,0])]
			# take all 'y' coordinates
			coordsy += [list(df1.loc[df1['condition'] == group].iloc[:,1])]
		coords = [coordsx] + [coordsy]
		#print(coords[0]) this is a list of list of x coordinates [[x coords of group 1], [x coord of group 2],...]
		#print(coords[1]) this is a list of lists of y coordinates, similar to coords[0]
		# coords looks like [list of lists of x coordinates list of lists of y coordinates
		#[[[x1 x2 x3][x1 x2 x3][x1 x2 x3]][y1 y2 y3][y1 y2 y3][y1 y2 y3]]
		## where coords[0][0] is the set of x coordinates for group 1
		## coords[1][0] is the set of y coordinates for group 1
		## I'll return
		return  coords

	def __uncorrected_pca(self, uncorrected_data):
		uncorrected_data = uncorrected_data.set_index(uncorrected_data.columns[0]).transpose()
		groups = uncorrected_data.iloc[:,0]
		uncorrected_data.drop(uncorrected_data.columns[0], axis=1, inplace=True)
		groups.reset_index(drop=True, inplace = True)
		x = StandardScaler().fit_transform(uncorrected_data)
		pca = PCA(n_components=2)
		principalComponents = pca.fit_transform(x)
		principalDf = pd.DataFrame(data = principalComponents, columns = ['principal component 1', 'principal component 2'])
		grouped_data = pd.concat([groups, principalDf],axis=1)
		coordsx = []
		coordsy = []
		index = grouped_data.columns[0]
		for group in grouped_data.iloc[:,0].unique():
			coordsx += [list(grouped_data.loc[grouped_data[index] == group].iloc[:,1])]
			# print(coordsx)
			coordsy += [list(grouped_data.loc[grouped_data[index] == group].iloc[:,2])]
		coords = [coordsx] + [coordsy] 
		return coords

	def get_pca_batch_coordinates(self):
		r_data = pd.read_csv(self.b_str_path + "/" + self.job_code_mgr.get_job_code() +  '/' + 'R Corrected Input.csv')
		ens = pd.read_csv(self.b_str_path + "/" + self.job_code_mgr.get_job_code() +  '/' + 'ENS IDs.csv',index_col = 0)
		ens.reset_index(drop=True,inplace=True)
		samples = pd.read_csv(self.b_str_path + "/" + self.job_code_mgr.get_job_code() +  '/' + 'Sample IDs.csv',index_col = 0)
		return self.__r_data_PCA_wrapper(r_data, ens, samples)

	def get_pca_uncorrected_coordinates(self):
		uncorrected_data = pd.read_csv(self.b_str_path + "/" + self.job_code_mgr.get_job_code() +  '/' + "no_batch_big_df.csv")
		return self.__uncorrected_pca(uncorrected_data)


	#####################################################################################################################
	#																													#
	#																													#
	#																													#
	#										job code managing															#
	#																													#
	#																													#
	#																													#
	#####################################################################################################################
	class JobCodeManager:
		# DIFFERENTIAL_EXPRESSION_STAGES = 4 #counts from start of do_statistical_analysis

		def __init__(self, jcode_length, storage_path):
			self.job_code = datetime.now().strftime('%Y%m%d') + "-" +''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(jcode_length))
			self.storage_path = storage_path
			while True:	
				try:
					os.mkdir(self.storage_path + "/" + self.job_code)
					os.mkdir(self.storage_path + "/" + self.job_code + "/results")
					break
				except FileExistsError:
					print("Had a collision, getting new job code")
					self.job_code = datetime.now().strftime('%Y%m%d') + "-" +''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(jcode_length)) #generate new job code; clashes can happen but should astronomially never

			initial_stage = pd.DataFrame(data = {"progress percent": [0]})
			initial_stage.to_csv(self.storage_path + "/" + self.job_code + "/progress.csv", index = False)

		def create_folders(self):
			os.mkdir(self.storage_path + "/" + self.job_code)
			os.mkdir(self.storage_path + "/" + self.job_code + "/results")

		def update_stage(self, stage_num):
			progress_df = pd.read_csv(self.storage_path + "/" + self.job_code + "/progress.csv")
			progress_df.at[0, "progress percent"] = math.floor((stage_num / 4) * 100)
			progress_df.to_csv(self.storage_path + "/" + self.job_code + "/progress.csv", index = False)

		def get_job_code(self):
			return self.job_code

		def get_progress(self):
			progress_df = pd.read_csv(self.storage_path + "/" + self.job_code + "/progress.csv")
			return progress_df.at[0, "progress percent"]