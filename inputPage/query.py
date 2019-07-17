import pandas as pd 


#df = pd.DataFrame({"AB": [1, 2, 3], "BC": [1, 5, 6], "CD" :['a', 'b', 'c']})
df = pd.read_csv('GTEx_Metadata.csv')


strfy = lambda x: "'" + x + "'" if isinstance(x, str) else str(x) 
#print(l(1))

# I should do some stuff for empty queries


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

print(make_subquery('Name', []))
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






#L = [[],['M'],['20-29'],[],[],['Heart', 'Blood', 'Skin']]
q = [[],['F'],['20-29', '30-39'],['Ventilator'],[],[ 'Skin', 'Blood']]

def seperate_by_tissue(query):

	return [query[:-1] + [[query[5][i]]] for i in range(len(query[5]))]

#print(seperate_by_tissue(q))


#print(df.query(make_query(q)))

def get_sample_size(query):
	return len(df.query(make_query(query)).index)



#print(get_sample_size(q))


def query_by_tissue_type(q): # given a query with multiple tissue types
# query the metadata file to get a smaller df
# then get organize a list of gtex ids based on tissue type 
	subdf = df.query(make_query(q))
	#j = [[],['M'],['20-29', '30-39'],['Ventilator'],[],['Heart']]
	#print(subdf.query(make_query(j)))
	query_list = seperate_by_tissue(q)
	#print(queries)
	M = [[query[5],list(subdf.query(make_query(query)).iloc[:,0])] for query in query_list]
	print(M)
	return M
#M = query_by_tissue_type(L)


#print(L[:-1])

##print(df.query(make_query(q)))


## Number of samples

'''print(get_sample_size(q))
j = get_sample_size(q) # j is the number of samples in that group'''



#print(get_sample_ids(q))













