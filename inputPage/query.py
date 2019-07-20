import pandas as pd 


df = pd.read_csv('filtered_metadata.csv')

#lazy, just to get all gene names
genes = pd.read_csv('querying/GTEX Cervix Uteri.csv').iloc[:,0]

tissue_map = {'Stomach': 'querying/GTEX Stomach.csv', 'Muscle' : 'querying/GTEX Muscle.csv', 'Thyroid' : 'querying/GTEX Thyroid.csv', 'Ovary' : 'querying/GTEX Ovary.csv', 'Breast' : 'querying/GTEX Breast.csv', 'Blood Vessel' : 'querying/GTEX Blood Vessel.csv', 
'Small Intestine' : 'querying/GTEX Small Intestine.csv', 'Cervix Uteri': 'querying/GTEX Cervix Uteri.csv', 'Blood' : 'querying/GTEX Whole Blood.csv', 'Pituitary' : 'querying/GTEX Pituitary.csv', 'Skin' : 'querying/GTEX Skin.csv', 'Fallopian Tube': 'querying/GTEX Fallopian Tube.csv', 
'Heart' : 'querying/GTEX Heart.csv', 'Vagina' : 'querying/GTEX Vagina.csv', 'Nerve' : 'querying/GTEX Nerve.csv', 'Liver' : 'querying/GTEX Liver.csv', 'Prostate': 'querying/GTEX Prostate.csv', 'Salivary Gland' : 'querying/GTEX Salivary Gland.csv', 'Uterus' : 'querying/GTEX Uterus.csv', 'Adipose Tissue': 'querying/GTEX Adipose Tissue.csv', 
'Adrenal Gland':'querying/GTEX Adrenal Gland.csv', 'Testis' : 'querying/GTEX Testis.csv', 'Lung': 'querying/GTEX Lung.csv', 'Kidney': 'querying/GTEX Kidney.csv', 'Colon': 'querying/GTEX Colon.csv', 'Spleen': 'querying/GTEX Spleen.csv', 'Brain' :'querying/GTEX Brain.csv', 'Bladder': 'querying/GTEX Bladder.csv', 'Pancreas':'querying/GTEX Pancreas.csv', 'Esophagus':'querying/GTEX Esophagus.csv'}


## A QUERY SHOULD LOOK SOMETHING LIKE 
### [[NAMES (USUALLY EMPTY)], [GENDER], [AGE RANGE], [DEATH (NEED TO UPDATE THIS)], [SMRIN (USUALLY EMPTY)
### [TISSUE TYPE]]] AND FOR EACH SUBLIST THERE MAY BE MULTIPLE ENTRIES FOR EXAMPLE [20-29, 30-39,40-49]

### CURRENTLY GET_SAMPLES(QUERY) AND MAKE_GROUP(QUERY) ARE THE IMPORTANT ONES
### GIVEN A QUERY WITH ONLY ONE TISSUE TYPE, GET_SAMPLES(QUERY) WILL RETURN A 
### DATAFRAME CONTAINING SAMPLES AND THEIR DATA WHO SATISFY THE QUERY.

### FOR A QUERY WITH MULTIPLE DIFFERENT TISSUE TYPES (OR ONLY ONE) MAKE_GROUP(QUERY)
### WILL DO THE SAME THING, ONLY OVER ALL THE TISSUE TYPES OF INTEREST

### NEXT STEPS ARE TO TRY AND BREAK SOME OF THE LARGER FILES (BRAIN, MUSCLE, BLOOD) INTO MORE MANAGEABLE
## PIECES, PERHAPS BY AGE OR SOMETHING


strfy = lambda x: "'" + x + "'" if isinstance(x, str) else str(x) 


def make_subquery(columnname, values): # builds query st we get rows that have value from values in columnname
	#policy will be to handle empty queries higher up
	if not values:
		return ""
	querystring = ""
	for i in range(len(values) - 1):
		querystring = querystring + "(" + columnname + "==" + strfy(values[i]) + ") or "

	querystring = "(" + querystring + "(" + columnname + "==" + strfy(values[-1]) + ")" + ")"
	#print(querystring)
	return querystring;

#print(make_subquery('Name', []))
def conjunct_query(subqueries): # given a list of subqueries, 'ands' them together
	
	querystring = ''
	for i in range(len(subqueries)-1):
		#print(querystring)
		querystring = querystring + subqueries[i] + " and "
	querystring = querystring + subqueries[len(subqueries)-1]
	#print(querystring)
	return querystring;

def make_query(ql): # where ql looks like [['blood',], ['20-29', '30-39'], ['chronic illness', immediate]]
	# for each different tissue type I should make one query

	column_list = ['Name', 'SEX', 'AGE', 'DTHHRDY', 'SMRIN', 'SMTS']
	subqueries = []
	# in this case suppose ql looks like [[1],[5,6],['a','b']]
	# or [[1], [], ['a','b']] maybe this won't ever happen...

	for i in range(len(ql)):
		if ql[i]:
			subqueries.append(make_subquery(column_list[i], ql[i]))

	return conjunct_query(subqueries);


#obsolete 
def query_for_tissue(ql): #given [[blood, whole blood, heart]... etc ...]
 # return [[[blood], ...], [[whole blood], ...], [[heart],....]]
 	print(ql[0:4].extend([1]))
 	queries = []
 	for i in range(len(ql[5])):
 		L = ql[0:4]
 		L.extend([[ql[5][i]]])
 		queries.append(L)

 	return queries;


def get_sample_ids(queries): # given list of queries return list of list 
	samp_ids = []
	for query in queries:
		samp_ids.append((query[5],list(df.query(make_query(query)).iloc[:,0])))
	return samp_ids;

## When a query has multiple tissue types included, it might be useful to split it into
## multiple tissue types each querying one type of tissue
def seperate_by_tissue(query):

	return [query[:-1] + [[query[5][i]]] for i in range(len(query[5]))]

def get_sample_size(query):
	return len(df.query(make_query(query)).index)



def query_by_tissue_type(q): # given a query with multiple tissue types
# query the metadata file to get a smaller df
# then get organize a list of gtex ids based on tissue type 
	subdf = df.query(make_query(q))
	query_list = seperate_by_tissue(q)
	M = [[query[5],list(subdf.query(make_query(query)).iloc[:,0])] for query in query_list]
	return M


# q 'Name', 'Sex', 'Age', 'Death', 'SMRIN', 'Tissue'
# in general 'Name' and 'SMRIN' will be left empty '[]'
## creates a dataframe whose columns are samples satisfying query q
def get_samples(q): # where q is a query
	#print(make_query(q))
	sample_ids = list(df.query(make_query(q)).iloc[:,1])
	#print(sample_ids)
	tissue_frame = pd.read_csv(tissue_map[q[5][0]])
	#print(tissue_frame)
	samples = tissue_frame.loc[:,sample_ids]
	return samples; 





#I like the idea of splitting larger tissue files by age e.g. young heart, middle heart, old heart
# for a given query, I should be able to know which of these I have to open based on the age component of the query
def age_split(ages): # ['20-29', '30-39', '40-49'] 
	# 1, denotes young
	# 2 middle and so on
	selection = []
	if not ages:
		return [1,2,3]

	if ('20-29' in ages) or ('30-39' in ages):
		selection = selection + [1]
	if ('40-49' in ages) or ('50-59' in ages):
		selection = selection + [2]
	if ('60-69' in ages) or ('70-79' in ages):
		selection = selection + [3]
	return selection;



# Given a group query for example [[],[],['40-49','50-59'],[],[],[ 'Bladder', 'Liver']]
# will return the concatenated result of querying the bladder and liver files for people 4049 and 5059
# makes use of get_samples() where get samples queries individual files 
# as of right now will not 
def make_group(q):
	
	group = genes
	queries = seperate_by_tissue(q)
	for query in queries:
		tempdf = get_samples(query)
		group = pd.concat([group, tempdf], axis=1)
	#group.set_index(group.columns.values[0],inplace = True)
	return group;


#print(make_group([[],['1'],['40-49','50-59'],[],[],[  'Liver']]))

#gtex_groups_queries =[[[],[],['20-29', '30-39'],[],[], ['Kidney','Bladder'], ['gtex group 1']],
#		[[],['M'],['20-29', '30-39', '40-49', '50-59'],[],[], ['Liver', 'Kidney'], ['gtex group 1']],
#        [[], ['F'], ['50-59'], ['Ventilator', 'Fast Natural'], [], ['Liver','Ovary', 'Salivary Gland',], ['gtex group 3']]]

def process_group_query(group_query):

	group_array = []
	for group in group_query:

		group_id = group[6]
		query = group[:-1]
		M = [[group_id], make_group(query)]
		#M = [make_group(query)]
		#group_array = group_array + M
		group_array.append(M)
		#print(M)
	return group_array
#process_group_query(gtex_groups_queries)

def get_sample_names(query): #given a query, q , returns list of sample names satisfying q
	return list(df.query(make_query(query)).iloc[:,0])









