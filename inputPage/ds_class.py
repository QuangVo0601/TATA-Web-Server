import csv
#import scipy
#import numpy as np
import pandas as pd
#import matplotlib.pyplot as plt
#from matplotlib import style
from io import StringIO
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# Jon's algorithm for sorting purpose
def check(x):
   if x == 'X':
       return 24
   if x == 'Y':
       return 25
   if x == 'MT':
       return 23 
   else:
       return int(x)

# ds = data set to be used in views.py
class ds:
    def __init__(self, job_code, df = None):
        self.job_code = job_code
        self.df = df if df is not None else None

    def df_from_csv_name(csv_name):
        self.df = read_csv(csv_name)

    # from Matthew to make a list of dataframes
    def make_groups(self, group_lists):
        temp_df_list = []
        for group in group_lists:
            temp_df = self.df.iloc[:,0].to_frame()
            temp_df.rename(columns={temp_df.columns[0]: group[0]}, inplace=True)
            for sample_name in group[1:]:
                temp_df[sample_name] = self.df[sample_name]
            temp_df_list.append(temp_df)	
                    
        return temp_df_list

     # graphs avg tpm per chromosome (avg over all n of patients)
     # Don't graph this
    def g1(self):

        df1 = pd.read_csv('ENS Ids By Chromosome.csv') # change to this when run locally
        #df1 = pd.read_csv('/var/www/html/webtool/ENS Ids By Chromosome.csv') # change to this when run on mason server

        df3 = self.df.join(df1.set_index('ENS ID'), on='ENS ID')
        del df3['Transcript length (including UTRs and CDS)']
        look1 = df3.groupby(['Chromosome']).mean()
        look1['meanp'] = look1.mean(axis=1)
        # Looks like ([chromosome x, avg TPM over all patients], ... [chromosome j, avg tpm])
        #L = [[look1.iloc[i].name, look1['meanp'][i]] for i in range(len(look1.index))]

        # supposed to be ([chromosome x,..., chromosome j], [avg x,...,avg y])
        L1 = [check(look1.iloc[i].name) for i in range(len(look1.index))]
        L2 = [look1['meanp'][i] for i in range(len(look1.index))]

        S = sorted(range(len(L1)), key=lambda k: L1[k])

        L1s = [L1[i] for i in S]
        L2s = [L2[i] for i in S]
        L = (L1s, L2s)
        return L
       
    # graphs avg tpm for each chromosome for each patient
    # Graph 2: TPM per Chromosome (TPC)
    def tpc_graph(self): 

       df1 = pd.read_csv('ENS Ids By Chromosome.csv') # change to this when run locally
       #df1 = pd.read_csv('/var/www/html/webtool/ENS Ids By Chromosome.csv') # change to this when run on mason server

       df3 = self.df.join(df1.set_index('ENS ID'), on='ENS ID') # SHOULD I COPY SELF.DF!?
       del df3['Transcript length (including UTRs and CDS)']
       look1 = df3.groupby(['Chromosome']).mean()
       #looks like ([chromosome 1, [patient1 avg, patient2 avg]], ... all the remaining chromosomes)
       #L = [[check(look1.iloc[i].name), list(look1.iloc[i])] for i in range(len(look1.index))]

       L1 = [check(look1.iloc[i].name) for i in range(len(look1.index))]
       L2 = [list(look1.iloc[i]) for i in range(len(look1.index))]
       S = sorted(range(len(L1)), key=lambda k: L1[k])
       chromosomeList = [L1[i] for i in S]
       L2s = [L2[i] for i in S]

      
       L = (chromosomeList, L2s)

       patientAvgsTpmList = []

       for i in range(len(L[1][0])):
          M = []
          for j in range(len(L[0])):
             M.append(L[1][j][i])
          patientAvgsTpmList.append(M)

       ''' coordinates looks like ([chromosome 1,..., chromosome n], 
          [[tpm avgs of patient 1],[tpm avgs of patient2],...[tpm avgs of patient n]]) '''
       # chromosomeList 1d array
       # patientAvgsTpmList 2d array
       coordinates = (chromosomeList, patientAvgsTpmList)

       return coordinates 

    # Graph 1 in validation page: Distribution of Gene Expression
    # top 100 ens ids by avg tpm over all patients 
    def dge_graph(self): 
        df1 = self.df.copy()
        df1['avg'] = df1.mean(axis = 1)
        df1 = df1.sort_values(by = ['avg']).iloc[-100:]
        df1 = df1.reset_index()
        df1['index'] = df1.index
                
        '''coordinates looks like ([ENS ID 1,...,ENS ID n], [avg TPM 1,...,avg TPM n]) '''
        # Both of them are 1d arrays
        ensID_list = [df1.iloc[i][1] for i in range(len(df1.index))]
        avgTPM_list = [df1.iloc[i][9] for i in range(len(df1.index))]
        coordinates = (ensID_list, avgTPM_list)
        return coordinates

    # Jon's algorithm
    def write_to_csv(self,file_name): # writes self.df to a csv named 'name'
        #  Example usage:        x.write_to_csv('test1.csv') where x is the ds instance(?)
        self.df.to_csv(file_name, index = False)
    
    # given a string resembling a CSV, constructs self's dataframe from it
    def dataframe_from_string(self,s): 
        self.df = pd.read_csv(StringIO(s), sep=",")

    # This is graph 3: Principal Component Analysis (PCA)
    # Graph PCA1 vs PCA2
    def pca_graph(self):
        df = self.df
        # NB next two lines do the transposing in particular the set index() gets rid of the unnamed row
        df = df.set_index(df.columns.values[0]).transpose()
        x = df.loc[:,list(df.columns[1:])]
        y = list(df.index.values)
        x = StandardScaler().fit_transform(x)
        pca = PCA(n_components=2)

        principalComponents = pca.fit_transform(x)

        principalDf = pd.DataFrame(data = principalComponents, columns = ['principal component 1', 'principal component 2'])
        df.reset_index(inplace = True)
        finalDf = pd.concat([principalDf, df.iloc[:,0]], axis = 1)
        finalDf = finalDf.rename(columns = {finalDf.columns[2]: 'Patients'})
        '''coordinates looks like ([pca1_1,...,pca1_n],[pca2_1,...,pca2_n])'''
        pca1_list = list(finalDf.iloc[:,0])
        pca2_list = list(finalDf.iloc[:,1])
        # Both of them are 1d arrays
        coordinates = (pca1_list, pca2_list)
        return coordinates

    # Below is Jon's stuff
    '''
    fig = plt.figure(figsize = (8,8))
    ax = fig.add_subplot(1,1,1) 
    ax.set_xlabel('Principal Component 1', fontsize = 15)
    ax.set_ylabel('Principal Component 2', fontsize = 15)
    ax.set_title('2 component PCA', fontsize = 20)
    #targets = []
    colors = ['b', 'g', 'r', 'c', 'm', 'y', 'k']
    for target, color in zip(targets,colors):
        indicesToKeep = finalDf['Patients'] == target
        ax.scatter(finalDf.loc[indicesToKeep, 'principal component 1']
                , finalDf.loc[indicesToKeep, 'principal component 2']
                , c = color
                , s = 50)
    ax.legend(targets)
    ax.grid()
    fig.show()
    plt.show()
    

    #print(PCAgraph(self))



#x = ds(5, pd.read_csv('patientlist.csv'))
#print(x.df)
#x.write_to_csv('test1.csv')
#print(x.df['ENS ID'][1])
#x.g3()

#df = pd.read_csv(s, sep=",")
#print(df)
#x = ds(5)
#x.dataframe_from_string(s)
#print(x.df) '''


