import csv
import scipy
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import style
from io import StringIO
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

def PCAgraph():
#df = pd.read_csv('patientlist.csv')
# NB next two lines do the transposing in particular the set index() gets rid of the unnamed row
#df1 = df.set_index('ENS ID').transpose()
#df1 = df1.rename(columns = {df1.columns[0]: 'Patients'})
#df1.to_csv('patientlist_transposed.csv', index = True)

# Probably a bad to have to tranpose, I will work on this later. 
	df = pd.read_csv('patientlist_transposed.csv')
	df = df.rename(columns = {df.columns[0]: 'Patients'})
	features = list(df.columns[1:])
	#print(features)
	targets = list(df.iloc[:,0])
	#print(targets)

	target = 'Patients'
	x = df.loc[:, features].values
	y = df.loc[:,[target]].values
	x = StandardScaler().fit_transform(x)
	#print(x)
	pca = PCA(n_components=2)
	principalComponents = pca.fit_transform(x)
	principalDf = pd.DataFrame(data = principalComponents
             , columns = ['principal component 1', 'principal component 2'])
	finalDf = pd.concat([principalDf, df[[target]]], axis = 1)
	print(finalDf)
	return [list(finalDf.iloc[:,0]),list(finalDf.iloc[:,1])]
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
'''

print(PCAgraph())