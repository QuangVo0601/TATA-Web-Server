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
	def __init__(self, dfList, groupNames):
		#stores base data with no operations done, no touch
		self.dfList = dfList

		#must be in the same order as the grounps sent in;
		#format shuold be control group at index 0, 1 to n are the groups in the comparison list
		self.group_names = groupNames

		#each filter though matchENS changes this, used as filtered baseline dataframes
		#be careful of using data in the filtered dataframes, if any modifications was done, it will be not be reflected
		#most useful for getting the filtered ensIDs, data can be used as initial baseline after filtering
		self.batch_corrected_dfs = pd.DataFrame()

		#list of ens ids that are being used; first set is defaulted to using the ids in the control group
		self.ensIDs = self.dfList[0].iloc[:,0]

		#called as we will always want filtered dataframes
		self.filteredDfs = self.__find_overlapping_ENS()

		self.big_dataframes = self.get_pca_data()

	# big dataframe, don't use it now
	def get_big_dataframes(self):
		return self.big_dataframes

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
			# label = "Group" + str(idx+1)
			# label_list = [label] * len(fdf.columns)
			# print(label_list)

			temp_df = fdf.copy()
			temp_df.loc[-1] = ["Group" + str(idx+1)] * len(fdf.columns)
			temp_df.index = temp_df.index + 1
			temp_df = temp_df.sort_index()
			big_raw_data = pd.concat([big_raw_data, temp_df], axis = 1)

			temp_df = bdf.copy()
			temp_df.loc[-1] = ["Group" + str(idx+1)] * len(bdf.columns)
			temp_df.index = temp_df.index + 1
			temp_df = temp_df.sort_index()
			big_batch_data = pd.concat([big_batch_data, temp_df], axis = 1)

		return [big_raw_data, big_batch_data]
		

	#****************************************************************************************
	#**ONLY CALL AFTER CALLING get_pca_data												   **
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
		#ens_df_list = self.__filter_alpha_and_fold_change(.05, 2, results)
		#print(ens_df_list)

	def __do_batch_correction(self):
		meanDf = self.__compute_log_avg(self.filteredDfs)
		newData = self.__batch_correction(meanDf)
		return newData

	#	matchENS() operates on the given dataframes in self.dfList and finds the overlapping ensIDs from all groups
	#	After finding the intersection between the group's ensIDs, it returned the filtered dataframes in a list
	def __find_overlapping_ENS(self):
		print("\n\n\n FINDING OVERLAPPING ENS IDS \n\n\n")		
		#self.ensIDs starts out with the control group ensIDs, if the count is greater than another group's ensIDs, that will be stored in self.ensIDs
		for dataf in self.dfList:
			if self.ensIDs.count() > dataf.iloc[:,0].count():
				self.ensIDs = dataf.iloc[:,0]

		#get intersection of ensIDs between all groups
		for dataf in self.dfList:
			self.ensIDs = pd.Series(np.intersect1d(self.ensIDs.values,dataf.iloc[:,0].values))

		#filters through each dataframe while also sorting by ensIDs, the index is then reset to keep it consistent in the dataframes	
		tempFilteredList = []																		   
		for df in self.dfList:
			tempDf = df.loc[df.iloc[:,0].isin(self.ensIDs)]   		#get new dataframe with only wanted ensIDs
			tempDf.sort_values(tempDf.columns[0], inplace=True)		#sort by ensIDs, throws a warning, it says we are operating on a slice of another dataframe which is what we want so we are fine
			tempDf.reset_index(inplace=True, drop = True)
			tempFilteredList.append(tempDf)

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
		for idx,df in enumerate(some_df_list):
			tempDf = df.mean(axis = 1).to_frame()
			tempDf.rename(columns={tempDf.columns[0]: self.group_names[idx]}, inplace=True)
			meanCompareList.append(tempDf)

		#will hold log averages for all groups by column
		meanDf = pd.DataFrame()							
		for df in meanCompareList:
			meanDf = pd.concat([meanDf, df], axis=1)

		return meanDf

	#returns a single dataframe with all the groups concatenated, but modifies self.modDfList with dataframes corrected with the linear regression parameters using the first dataframe as control
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

		#print(tempList)
		#store batch corrected data
		self.batch_corrected_dfs = tempList

		#put all batch corrected dataframes into one single dataframe, groups are concatenated together
		allGroupDf = self.batch_corrected_dfs[0]							
		for df in self.batch_corrected_dfs[1:]:
			allGroupDf = pd.concat([allGroupDf, df.drop(df.columns[0], axis = 1)], axis=1)

		allGroupDf.rename(columns={tempDf.columns[0]: "ENS ID"}, inplace=True)

		return allGroupDf

		#self.getCSV(self.modDfList, "no log_10 corrected ")

	def __compute_fold_change(self, control_df, compare_df, dfMode):
		print("\n\n\n COMPUTING FOLD CHANGE \n\n\n")

		meanDf = self.__compute_mean([control_df, compare_df])
		
		#mode = 0 for non batch corrected data
		if dfMode == 0:
			meanDf = meanDf.applymap(lambda x: math.log(x,2) if x > 0 else 0)
		#mode = 1 for batch correted data	
		elif dfMode == 1:
			meanDf = meanDf.applymap(lambda x: math.pow(10, x))
			meanDf = meanDf.applymap(lambda x: math.log(x, 2) if x > 0 else 0)

		fold_change = meanDf[meanDf.columns[1]] - meanDf[meanDf.columns[0]]	
		return fold_change.tolist()

	def __equal_var_test(self, dfMode):
		print("\n\n\n DOING T TESTS \n\n\n")

		#use filtered raw data
		t_test_res_list = []
		logFilteredDfs = self.__compute_log(self.filteredDfs)

		#code in all if/elifs are essentially the same, only differences are usevar (either pooled or unequal) and what data is used (raw or batch corrected)
		if dfMode == 0:
			for dfNum, df in enumerate(logFilteredDfs[1:], 1):
				tempDf = self.ensIDs.copy().to_frame(name = self.group_names[0] + " vs. " + self.group_names[dfNum])
				t_values = []
				p_values = []
				for idx in range(len(self.ensIDs)):
					res = sm.stats.ttest_ind(logFilteredDfs[0].iloc[idx].tolist()[1:], df.iloc[idx].tolist()[1:], alternative = 'two-sided', usevar = 'pooled')
					t_values.append(res[0])
					p_values.append(res[1]) #list of t-statistic and p-value
				#dataframe has the ensids with the name of column being the two group names, rest of columns are indicated below		
				tempDf["fold change"] = self.__compute_fold_change(self.filteredDfs[0], self.filteredDfs[dfNum], 0)
				tempDf["t_values"] = t_values
				tempDf["p_values"] = p_values
				log_p_values = [-(math.log10(x)) if x > 0 else 0 for x in tempDf['p_values']]
				tempDf['log p values'] = log_p_values				
				t_test_res_list.append(tempDf)					
			# print(t_test_res_list)

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
				tempDf["fold change"] = self.__compute_fold_change(self.batch_corrected_dfs[0], df, 1)
				tempDf["t_values"] = t_values
				tempDf["p_values"] = p_values
				log_p_values = [-(math.log10(x)) if x > 0 else 0 for x in tempDf['p_values']]
				tempDf['log p values'] = log_p_values				
				t_test_res_list.append(tempDf)					
			# print(t_test_res_list)

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
				tempDf["fold change"] = self.__compute_fold_change(self.filteredDfs[0], self.filteredDfs[dfNum], 0)
				tempDf["t_values"] = t_values
				tempDf["p_values"] = p_values
				log_p_values = [-(math.log10(x)) if x > 0 else 0 for x in tempDf['p_values']]
				tempDf['log p values'] = log_p_values
				t_test_res_list.append(tempDf)					
			# print(t_test_res_list)

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
				tempDf["fold change"] = self.__compute_fold_change(self.batch_corrected_dfs[0], df, 1)
				tempDf["t_values"] = t_values
				tempDf["p_values"] = p_values
				log_p_values = [-(math.log10(x)) if x > 0 else 0 for x in tempDf['p_values']]
				tempDf['log p values'] = log_p_values
				t_test_res_list.append(tempDf)					
			# print(t_test_res_list)

		return t_test_res_list	