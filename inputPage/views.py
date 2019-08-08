from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .models import Input
from .serializers import InputSerializer
from django.shortcuts import render
from .ds_class import ds # import from ds_class.py for validationPage.js
from .GTEXDataAnalyzer import GTEXDataAnalyzer # import from GTEXDataAnalyzer.py for grouping/batchPage.js & algorithm/resultPage.js
import pandas as pd
from .query import get_sample_names, process_group_query # import from query.py for gtexModal.js
import os, shutil, errno
import math
import fastcluster
import csv

# Create your views here.
def index_page(request):
    return HttpResponse("<h1>Server is running correctly</h1>") # Provide initial route 

'''  Each of the below def corresponding with a specific Front End Axios. If create another axios, copy and paste one of these def
    and change the def's name into another unquie name, make sure to add comment what axios route it is linked to. 
    Remember to add the def's name into urls.py (Open urls.py for more details). Axios POST/GET route should have the right path in urls.py
'''

# for csvReader.js axios, saved in urls.py
@csrf_exempt
def input_list(request):
    """
    List all code input, or create a new input obj.
    """
    if request.method == 'GET': # Back End send, Front End request
        inputs = Input.objects.all()
        serializer = InputSerializer(inputs, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST': # Back End request, Front End send
        data = JSONParser().parse(request) # Receive data from front end
        dataString = data['csvFile'] # syntax: data[key], key = package's name being sent
        selectedUnit = data['selectedUnit']

        print("Selected unit is: " + selectedUnit)

        #selected_unit = "FPKM" # for now, change later

        dataArray1 =  dataString.split('\n') # change the string to an array
        dataArray2 = [dataArray1[i].split(',') for i in range(len(dataArray1))] # change 1d array to 2d aray
        for i in dataArray2:
            i[0] = i[0][:15] # get only first 15 characters of ENS IDs. Ex: ENSG00000223972.4 will become ENSG00000223972 (no decimal)

        dataArray2[0][0] = "ENS ID" # change the header to "ENS ID" to be used by ds_class.py
        dataArray = [','.join(dataArray2[i]) for i in range(len(dataArray2))] # convert back to 1d array
        dataString = '\n'.join(dataArray) # convert the array back to string to be used in ds_class.py

        # Use Django session to save the 'dataString' in database for later use
        request.session['dataString'] = dataString

        # Import and use dataSet object from ds_class.py
        dataSet= ds(5)
        # build the dataframe from 'dataString'
        dataSet.dataframe_from_string(dataString)

        # if unit is FPKM or RPKM, call func to convert it to TPM dataframe
        if(selectedUnit == 'FPKM' or selectedUnit == 'RPKM'):
            dataSet.fpkm_to_tpm()

        # Graph 1: Distribution of Gene Expression
        x_dge, y_dge = dataSet.dge_graph()

        # Graph 2: TPM per Chromosome (TPC)
        x_tpc, y_tpc = dataSet.tpc_graph()

        # Graph 3: Principal Component Analysis (PCA)
        x_pca, y_pca = dataSet.pca_graph()

        # to get the header line from col 1 to col n
        pca_text = dataString.split('\n')[0:1][0].split(',')[1:] 

        # Use Django session to save the coordinates for 3 graphs in database for later use
        request.session['x_dge'] = x_dge
        request.session['y_dge'] = y_dge
        request.session['x_tpc'] = x_tpc
        request.session['y_tpc'] = y_tpc
        request.session['x_pca'] = x_pca
        request.session['y_pca'] = y_pca
        request.session['pca_text'] = pca_text    

        #print(pca_text)
 
        # Send as dictionary type 
        # After data processing, send it back to front end 
        return JsonResponse({'x_dge':x_dge,'y_dge':y_dge,'x_tpc':x_tpc,'y_tpc':y_tpc, 'x_pca': x_pca, 'y_pca': y_pca, 'pca_text': pca_text}, status=201) 
    

# for groupingPage.js => batchPage.js, saved in urls.py
@csrf_exempt
def input_list2(request):
    """
    List all code input, or create a new input obj.
    """
    if request.method == 'GET': # Back End send, Front End request
        inputs = Input.objects.all()
        serializer = InputSerializer(inputs, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST': # Back End request, Front End send
        data = JSONParser().parse(request) # Receive data from front end

        # 'group_lists' is the list of lists of groups sent from groupingPage.js
        group_lists = data['groupsList'] # syntax: data[key], key = package's name being sent
        # 'gtex_groups_queries' is the list of gtex group queries sent from groupingPage.js
        gtex_groups_queries = data['gtexQueries']

        print(group_lists)
        print(gtex_groups_queries)
        
        # Retrieve the 'dataString' saved in database
        dataString = request.session['dataString']

        # import and use def from ds_class.py (from Math Team)
        dataSet= ds(5)
        # build the dataframe from 'dataString' 
        dataSet.dataframe_from_string(dataString)

        '''group_lists = [['control group','Patient1','Patient2','Patient3'],
                  ['group1','Patient4','Patient5','Patient6'],
                  ['group2','Patient7','Patient8','Patient9'],
                  ['group3','Patient10','Patient11','Patient12'],
                  ['group4','Patient13','Patient14','Patient15']]'''

        # no of samples per each query: 8, 96, 58
        '''gtex_groups_queries = [[[],[],['20-29', '30-39'],[],[], ['Kidney'], 'gtex group 1'],
		                    [[],['M'],['20-29', '30-39', '40-49', '50-59'],[],[], ['Bladder'], 'gtex group 2'],
                            [[], ['F'], ['50-59'], ['Ventilator', 'Fast Natural'], [], ['Liver'], 'gtex group 3']]'''

        # pass in list of groups, return list of associated dataframes  
        CListDfs = dataSet.make_groups(group_lists) 
        # pass in list of GTEx groups, return list of associated dataframes          
        gtex_groups_dataframes = process_group_query(gtex_groups_queries)   
        # append GTEx dataframes to group dataframes
        CListDfs.extend(gtex_groups_dataframes)

        print(len(CListDfs))

        # get list of all group names (1st item in each list of group_lists)
        group_names_list = [group_lists[i][0] for i in range(len(group_lists))]
        # get list of all gtex group names (7th item in each list of gtex_groups_queries)
        gtex_groups_names = [gtex_groups_queries[i][6] for i in range(len(gtex_groups_queries))]
        # combine two lists above
        group_names_list.extend(gtex_groups_names)

        # For testing
        print('This is group list')
        print(group_names_list)

        # tf_ens_ids = pd.read_csv("/var/www/html/webtool/Transcription Factor List.csv") # for mason server
        tf_ens_ids = pd.read_csv("Transcription Factor List.csv") # for localhost
        tf_ens_ids = tf_ens_ids.squeeze().tolist()

        # Create an analyzer object from imported GTEXDataAnalyzer.py
        # need to be global because it is used in another function
        global analyzer
        # analyzer = GTEXDataAnalyzer(CListDfs, group_names_list, tf_ens_ids, '/var/www/html/webtool/webtoolFE/src/csvDatabase') # for mason server
        analyzer = GTEXDataAnalyzer(CListDfs, group_names_list, tf_ens_ids, 'webtoolFE/src/csvDatabase') # for localhost

        jobCode = analyzer.job_code_mgr.get_job_code()
        print(jobCode)
        x_corrected_pca, y_corrected_pca = analyzer.get_pca_batch_coordinates()
        print(len(x_corrected_pca))
        print(x_corrected_pca)
        print(len(y_corrected_pca))
        print(y_corrected_pca)

        x_uncorrected_pca, y_uncorrected_pca = analyzer.get_pca_uncorrected_coordinates()
        print(len(x_uncorrected_pca))
        print(x_uncorrected_pca)
        print(len(y_uncorrected_pca))
        print(y_uncorrected_pca)        

        # let's save dge, tpc, pca in jobCode folder for now, may move later
        # Retrieve them from session database
        x_dge = request.session['x_dge']
        y_dge = request.session['y_dge']
        x_tpc = request.session['x_tpc'] 
        y_tpc = request.session['y_tpc']  
        x_pca = request.session['x_pca']  
        y_pca = request.session['y_pca']  
        pca_text = request.session['pca_text']

        # create a subfolder inside jobcode folder for exploratory plots
        #csvDatabase_path = '/var/www/html/webtool/webtoolFE/src/csvDatabase/'+jobCode+'/exploratory/' # for mason server
        csvDatabase_path = 'webtoolFE/src/csvDatabase/'+jobCode+'/exploratory/' # for localhost
        csvDatabase_path2 = 'webtoolFE/src/csvDatabase/'+jobCode+'/batch/' # for localhost
        
        try:
            os.mkdir(csvDatabase_path) # create a subfolder here
            os.mkdir(csvDatabase_path2)
        except OSError as e:
            if e.errno != errno.EEXIST:
                #directory already exists
                pass
            else:
                print(e) 

        # save batch correction coordinates as CSVs in jobCode/batch subfolder
        x_uncorrected_pca_df = pd.DataFrame(x_uncorrected_pca)
        x_uncorrected_pca_df.to_csv(csvDatabase_path2 + 'x_uncorrected_pca.csv', index=False)
        y_uncorrected_pca_df = pd.DataFrame(y_uncorrected_pca)
        y_uncorrected_pca_df.to_csv(csvDatabase_path2 + 'y_uncorrected_pca.csv', index=False)
        x_corrected_pca_df = pd.DataFrame(x_corrected_pca)
        x_corrected_pca_df.to_csv(csvDatabase_path2 + 'x_corrected_pca.csv', index=False)
        y_corrected_pca_df = pd.DataFrame(y_corrected_pca)
        y_corrected_pca_df.to_csv(csvDatabase_path2 + 'y_corrected_pca.csv', index=False)   
        group_names_list_df = pd.DataFrame(group_names_list, columns = ['group_names_list'])
        group_names_list_df.to_csv(csvDatabase_path2 + 'group_names_list.csv', index=False)                             

        # save all the coordinates in that 'exploratory' folder  
        # save x_dge, y_dge as a csv in the jobCode/exploratory subfolder      
        dge_zippedList =  list(zip(x_dge, y_dge))
        dge_df = pd.DataFrame(dge_zippedList, columns = ['x_dge' , 'y_dge']) 
        dge_df.to_csv(csvDatabase_path + 'dge.csv')
        #print(dge_df)

        # save x_tpc, y_tpc as a csv in the jobCode/exploratory subfolder 
        x_tpc_df = pd.DataFrame(x_tpc, columns = ['x_tpc'])
        x_tpc_df.to_csv(csvDatabase_path + 'x_tpc.csv', index=False)
        y_tpc_df = pd.DataFrame(y_tpc)
        y_tpc_df.to_csv(csvDatabase_path + 'y_tpc.csv', index=False)

        # save x_pca, y_pca, pca_text as a csv in the jobCode/exploratory subfolder 
        pca_zippedList = list(zip(x_pca, y_pca, pca_text))
        pca_df = pd.DataFrame(pca_zippedList, columns = ['x_pca', 'y_pca', 'pca_text'])
        pca_df.to_csv(csvDatabase_path + 'pca.csv')
        #print(pca_df)

        return JsonResponse({'x_uncorrected_pca':x_uncorrected_pca,'y_uncorrected_pca':y_uncorrected_pca,
                             'x_corrected_pca':x_corrected_pca,'y_corrected_pca':y_corrected_pca,
                             'group_names_list':group_names_list}, status=201)

# for algorithmPage.js => resultPage.js, saved in urls.py
@csrf_exempt
def input_list3(request):
    """
    List all code input, or create a new input obj.
    """
    if request.method == 'GET': # Back End send, Front End request
        inputs = Input.objects.all()
        serializer = InputSerializer(inputs, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST': # Back End request, Front End send
        data = JSONParser().parse(request) # Receive data from front end

        # 'selections' is the selections sent from algorithmPage.js
        # batch correction (yes/no), algorithm, sample variance, false discovery rate, bonferroni alpha
        # Ex: ['Correction Applied', 'Differential Expression Analysis', 'Equal', 0.55, 0.276]
        selections = data['selections'] # syntax: data[key], key = package's name being sent
        print(selections)

        test_mode = None
        if(selections[0] == "No Correction" and selections[2] == "Equal"):
            test_mode = 0 # pass 0 for batch Uncorrected data AND equal variance t test
        elif(selections[0] == "Correction Applied" and selections[2] == "Equal"):
            test_mode = 1 # pass 1 for batch corrected data AND equal variance t test
        elif(selections[0] == "No Correction" and selections[2] == "Unequal"):
            test_mode = 2 # pass 2 for batch Uncorrected data AND Unequal variance t test
        elif(selections[0] == "Correction Applied" and selections[2] == "Unequal"):
            test_mode = 3 # pass 3 for batch corrected data AND Unequal variance t t test
        #print(test_mode)

        # 'dataframes' is a list of dataframes, and each dataframe
        # has 8 columns(for now): overlapping ensIDs, fold change, t-values, p-values, log(p-values),
        # control group mean, group? mean, mean of Control group and group? averages (mean TPM)
        ''' Looks like this: ['Control group vs. group1', 'fold change', 't_values', 'p_values',
                            'log p values', 'Control group mean', 'group1 mean',
                            'mean of Control group and group1 averages']'''
        # using the same global 'analyzer' object from list2
        print(analyzer.job_code_mgr.get_job_code())
        
        dataframes_for_graph = analyzer.do_statistical_analysis(test_mode)  

        jobCode = analyzer.job_code_mgr.get_job_code()

        #csvDatabase_path = '/var/www/html/webtool/webtoolFE/src/csvDatabase/'+jobCode+'/' # for mason server
        csvDatabase_path = 'webtoolFE/src/csvDatabase/'+jobCode+'/' # for localhost

        csv_names_list = []
        # convert dataframes to csv files, saved in csvDatabase 
        # for later use in resultPage.js & finalPlots.js & downloading
        for dataframe in dataframes_for_graph:
            csv_file_name = dataframe.columns.values[0] # get the 1st item of the header
            csv_names_list.append(csv_file_name) # add each csv name to the name list

        # create a dataframe for csv_names_list, then save as csv in database
        csv_names_list_df = pd.DataFrame(csv_names_list, columns=["csv_file_names"])
        csv_names_list_df.to_csv(csvDatabase_path+'csv_names_list.csv', index=False)

        # create a dataframe for the selections [batch correction (yes/no), algorithm, sample variance, false discovery rate, bonferroni alpha], 
        # then save as csv in database for later use
        selections_df = pd.DataFrame(selections, columns=["selections"])
        selections_df.to_csv(csvDatabase_path+'selections.csv', index=False)        

        # bonferroni alpha from algorithmPage.js
        alpha = selections[4] 
        # fold change, default is 2
        fc = 2 
        # caused the warning, then crash :(
        # create heatmaps png in 'jobCode' folder
        analyzer.cluster_graphs(alpha, fc, dataframes_for_graph)

        print(dataframes_for_graph[0].iloc[:,1])
        print(dataframes_for_graph[0].iloc[:,4])
        print(dataframes_for_graph[0].iloc[:,7])     
        print('Everything is done')  

    return JsonResponse({'jobCode': jobCode}, status=201)

# for gtexModal.js, saved in urls.py
@csrf_exempt
def input_detail(request):
    """
    Retrieve, update or delete a code input.
    """
    if request.method == 'GET': # Back End send, Front End request
        inputs = Input.objects.all()
        serializer = InputSerializer(inputs, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST': # Back End request, Front End send
        data = JSONParser().parse(request) # Receive data from front end
        gtexData = data['gtex'] # syntax: data[key], key = package's name being sent
        print(gtexData)
        
        # call function from query.py to get sample count, 
        # based on "gtexData" received from front end . Ex: 'gtexData'
        # [[],['F'],['20-29', '30-39'],['Ventilator'],[],['Skin','Blood']] = 80 samples
        # [[], ['M'], ['70-79'], ['Ill Chronic'], [], []] = 31 samples
        # [[], ['M', 'F'], ['50-59'], ['Ill Unexpected', 'Fast Natural'], [], ['Breast', 'Salivary Gland', 'Vagina']] = 38 samples
        for i in range(len(gtexData)):
            if (gtexData[i]): # if gtexData is not empty, call function
                sample_names = get_sample_names(gtexData) 
                sample_count = len(sample_names)
                break
            else: # if gtexData is empty [[], [], [], [], [], []], sample count will be max: 11688
                sample_names = [] # no sample names returned
                sample_count = 11688 # max sample count
        
        print(sample_names)
        print(sample_count)
        
        return JsonResponse({'sample_count': sample_count,'sample_array': sample_names}, status=201) 

# for resultPage.js, saved in urls.py
@csrf_exempt
def input_results(request):
    """
    List all code input, or create a new input obj.
    """
    if request.method == 'GET': # Back End send, Front End request
        inputs = Input.objects.all()
        serializer = InputSerializer(inputs, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST': # Back End request, Front End send
        data = JSONParser().parse(request) # Receive data from front end

        # for exploratory, batch, job code, csv_names_list for finalPlots & finalTables
        jobCode = data['jobCode'] # syntax: data[key], key = package's name being sent
        print('Job code is' + jobCode)

        #---------------for Exploratory Plots-------------#    
        # path to exploratory plots files
        #csvDatabase_path = '/var/www/html/webtool/webtoolFE/src/csvDatabase/'+jobCode+'/exploratory/' # for mason server
        csvDatabase_path = 'webtoolFE/src/csvDatabase/'+jobCode+'/exploratory/' # for localhost
        # get coordinates for dge graph
        dge_df = pd.read_csv(csvDatabase_path + 'dge.csv') 
        x_dge = list(dge_df.iloc[:,1]) # 
        y_dge = list(dge_df.iloc[:,2]) # 
        # get coordinates for tpc graph
        y_tpc_df = pd.read_csv(csvDatabase_path + 'y_tpc.csv') 
        y_tpc = y_tpc_df.values.tolist()
        print(y_tpc)
        x_tpc_df = pd.read_csv(csvDatabase_path + 'x_tpc.csv') 
        x_tpc = list(x_tpc_df.iloc[:,0])
        print(x_tpc)
        # get coordinates for pca graph
        pca_df = pd.read_csv(csvDatabase_path + 'pca.csv')
        x_pca = list(pca_df.iloc[:,1]) # need to change "dataframe to sth else"
        y_pca = list(pca_df.iloc[:,2]) # 
        pca_text = list(pca_df.iloc[:,3])
        #---------------Exploratory Plots ends------------#

        # path to batch correction plots files
        csvDatabase_path2 = 'webtoolFE/src/csvDatabase/'+jobCode+'/batch/' # may change
        # then do sth for corrected & uncorrected graphs'''
        #---------------for Batch Correction--------------#
        x_uncorrected_pca_df = pd.read_csv(csvDatabase_path2 + 'x_uncorrected_pca.csv') 
        x_uncorrected_pca = x_uncorrected_pca_df.stack().groupby(level=0).apply(list).tolist()
        y_uncorrected_pca_df = pd.read_csv(csvDatabase_path2 + 'y_uncorrected_pca.csv') 
        y_uncorrected_pca = y_uncorrected_pca_df.stack().groupby(level=0).apply(list).tolist()      
        x_corrected_pca_df = pd.read_csv(csvDatabase_path2 + 'x_corrected_pca.csv') 
        x_corrected_pca = x_corrected_pca_df.stack().groupby(level=0).apply(list).tolist()
        y_corrected_pca_df = pd.read_csv(csvDatabase_path2 + 'y_corrected_pca.csv') 
        y_corrected_pca = y_corrected_pca_df.stack().groupby(level=0).apply(list).tolist() 
        group_names_list_df = pd.read_csv(csvDatabase_path2 + 'group_names_list.csv') 
        group_names_list = list(group_names_list_df.iloc[:,0])
        print(group_names_list)        

        #----------------Batch Correction ends------------#

         # path to the csv_names_list file
        #csvDatabase_path = '/var/www/html/webtool/webtoolFE/src/csvDatabase/'+jobCode+'/'+'csv_names_list.csv' #for mason server
        csvDatabase_path = 'webtoolFE/src/csvDatabase/'+jobCode+'/'+'csv_names_list.csv' #for localhost
        # convert csv to a list of csv file names
        csv_names_list_df = pd.read_csv(csvDatabase_path)   
        csv_names_list = list(csv_names_list_df.iloc[:,0])
        print(csv_names_list)  
       
    return JsonResponse({'jobCode': jobCode, 'csv_names_list': csv_names_list,
                         'x_dge': x_dge, 'y_dge': y_dge,
                         'x_tpc': x_tpc, 'y_tpc': y_tpc,
                         'x_pca': x_pca, 'y_pca': y_pca, 'pca_text': pca_text,
                         'x_uncorrected_pca': x_uncorrected_pca, 'y_uncorrected_pca': y_uncorrected_pca,
                         'x_corrected_pca': x_corrected_pca, 'y_corrected_pca': y_corrected_pca,
                         'group_names_list': group_names_list}, status=201)


# for finalPlots.js, saved in urls.py
@csrf_exempt
def input_finalPlots(request):
    """
    List all code input, or create a new input obj.
    """
    if request.method == 'GET': # Back End send, Front End request
        inputs = Input.objects.all()
        serializer = InputSerializer(inputs, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST': # Back End request, Front End send
        data = JSONParser().parse(request) # Receive data from front end

        jobCode = data['jobCode'] # syntax: data[key], key = package's name being sent
        csvFileName = data['csvFileName']
        print(jobCode)
        print(csvFileName)
        # path to the requested csv
        #csvDatabase_path = '/var/www/html/webtool/webtoolFE/src/csvDatabase/'+jobCode+'/results/'+csvFileName+' DE results.csv' # for mason server
        csvDatabase_path = 'webtoolFE/src/csvDatabase/'+jobCode+'/results/'+csvFileName+' DE results.csv' # for localhost
        # convert csv to a dataframe used for graphing
        dataframe = pd.read_csv(csvDatabase_path)

        # path to selections.csv for selections chosen in algorithmPage
        #csvDatabase_path2 = '/var/www/html/webtool/webtoolFE/src/csvDatabase/'+jobCode+'/selections.csv' # for mason server
        csvDatabase_path2 = 'webtoolFE/src/csvDatabase/'+jobCode+'/selections.csv' # for localhost
        selections_df = pd.read_csv(csvDatabase_path2)   
        selections = list(selections_df.iloc[:,0])
        print(selections)  

        alpha = float(selections[4])
        print('alpha is ' + str(alpha))     

        #---------------for Graph 1 (Volcano Plot)-------------#       
        # only use 'fold change' col for x_axis, '-log(p-values)' for y_axis
        x_volcano = list(dataframe.iloc[:,2]) # fold change
        y_volcano = list(dataframe.iloc[:,5]) # -log(p-values)
        x_volcano_black = []
        x_volcano_red = []
        y_volcano_black = []
        y_volcano_red = []

        #---------------for Graph 2 (Differential Expression TPM Plot)-------------#
        # only use 'mean TPM' col for x_axis, 'fold change' for y_axis
        x_differential = list(dataframe.iloc[:,8]) # mean TPM
        y_differential = list(dataframe.iloc[:,2]) # fold change
        x_differential_black = []
        x_differential_red = []
        y_differential_black = []
        y_differential_red = []

        # if -log10(p_val) < -log10(alpha/numberOfRows)) => black else red
        # check for both graphs
        numberOfRows = len(x_volcano)
        temp = -math.log10(alpha/numberOfRows)
        
        for i in range(numberOfRows):
            if y_volcano[i] < temp:
                # volcano plot black
                x_volcano_black.append(x_volcano[i])
                y_volcano_black.append(y_volcano[i])
                # differential plot black
                x_differential_black.append(x_differential[i])
                y_differential_black.append(y_differential[i])
            else:
                # volcano plot red
                x_volcano_red.append(x_volcano[i])
                y_volcano_red.append(y_volcano[i])
                # differential plot red
                x_differential_red.append(x_differential[i])
                y_differential_red.append(y_differential[i])
        
        # delete later
        print(len(x_volcano))
        print(len(y_volcano))
        print(len(x_volcano_black))
        print(len(y_volcano_black))
        print(len(x_volcano_red))
        print(len(y_volcano_red))
        print(len(x_differential_black))
        print(len(y_differential_black))
        print(len(x_differential_red))
        print(len(y_differential_red))     

        # to be returned to front end
        x_volcano = [x_volcano_black,x_volcano_red]   
        y_volcano = [y_volcano_black,y_volcano_red]
        x_differential = [x_differential_black,x_differential_red]
        y_differential = [y_differential_black,y_differential_red]
        ensIDs = list(dataframe.iloc[:,1]) # ens ids column 

        # still doesn't work in front end
        #heatmap_png_path = '/var/www/html/webtool/webtoolFE/src/csvDatabase/'+jobCode+'/results/'+csvFileName+' heatmap.png' # for mason server
        #heatmap_png_path = jobCode+'/results/'+csvFileName+' heatmap.png' # for localhost
        heatmap_png_path = '' # doesn't work for localhost

    return JsonResponse({'x_volcano': x_volcano, 'y_volcano': y_volcano,
                         'x_differential': x_differential, 'y_differential': y_differential,
                         'ensIDs': ensIDs, 'heatmap_png_path': heatmap_png_path}, status=201)

# for finalTables.js, saved in urls.py
@csrf_exempt
def input_finalTables(request):
    """
    List all code input, or create a new input obj.
    """
    if request.method == 'GET': # Back End send, Front End request
        inputs = Input.objects.all()
        serializer = InputSerializer(inputs, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST': # Back End request, Front End send
        data = JSONParser().parse(request) # Receive data from front end

        jobCode = data['jobCode'] # syntax: data[key], key = package's name being sent
        csvFileName = data['csvFileName']

        print(jobCode)
        print(csvFileName)

        # path to the requested csv
        #csvDatabase_path = '/var/www/html/webtool/webtoolFE/src/csvDatabase/'+jobCode+'/results/'+csvFileName+' DE results.csv' #for mason server
        csvDatabase_path = 'webtoolFE/src/csvDatabase/'+jobCode+'/results/'+csvFileName+' DE results.csv' #for localhost
        # convert csv to a dataframe used for graphing
        dataframe = pd.read_csv(csvDatabase_path)
        # has 8 columns(for now): overlapping ensIDs, fold change, t-values, p-values, -log(p-values),
        # control group mean, group? mean, mean of Control group and group? averages (mean TPM)
        ''' Looks like this: ['Control group vs. group1', 'fold change', 't_values', 'p_values',
                            'log p values', 'Control group mean', 'group1 mean',
                            'mean of Control group and group1 averages']'''

        # get the header for the table
        header = list([dataframe.columns[i]] for i in range(len(dataframe.columns)))
        header[0][0] = "" # 1st column name should be ""
        print(header)

        # convert the dataframe to a list of lists, every list is a column
        all_columns = dataframe.transpose().values.tolist()
        print(len(all_columns))
    
    return JsonResponse({'all_columns': all_columns, 'header': header}, status=201)

# for homepage.js, saved in urls.py
@csrf_exempt
def input_jobcode(request):
    """
    List all code input, or create a new input obj.
    """
    if request.method == 'GET': # Back End send, Front End request
        inputs = Input.objects.all()
        serializer = InputSerializer(inputs, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST': # Back End request, Front End send
        data = JSONParser().parse(request)
        jobcode = data['jobcode']
        print(jobcode)

        file_found = True
        percent = 0

        # pc = pd.read_csv('/var/www/html/webtool/webtoolFE/src/csvDatabase/'+jobcode+'/progress.csv')
        try:
            pc = pd.read_csv('webtoolFE/src/csvDatabase/'+jobcode+'/progress.csv') # for localhost
        except FileNotFoundError:
            file_found = False
        else:
            percent=int(pc.iloc[0,0])
        return JsonResponse({'progress':percent, 'file_found':file_found}, status=201)

