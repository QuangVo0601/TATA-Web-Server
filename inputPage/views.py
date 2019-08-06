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
    

# for groupingPage.js, saved in urls.py
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


        return JsonResponse({}, status=201)

# for algorithmPage.js, saved in urls.py
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
        '''data = JSONParser().parse(request) # Receive data from front end

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

        # Retrieve everything saved from list2
        group_lists = request.session['group_lists']
        gtex_groups_queries = request.session['gtex_groups_queries']
        group_names_list = request.session['group_names_list']
        tf_ens_ids = request.session['tf_ens_ids']

        # Retrieve the 'dataString' saved in database
        dataString = request.session['dataString']
        # import and use def from ds_class.py (from Math Team)
        dataSet= ds(5)
        # build the dataframe from 'dataString' 
        dataSet.dataframe_from_string(dataString)

        # pass in list of groups, return list of associated dataframes  
        CListDfs = dataSet.make_groups(group_lists) 
        # pass in list of GTEx groups, return list of associated dataframes          
        gtex_groups_dataframes = process_group_query(gtex_groups_queries)   
        # append GTEx dataframes to group dataframes
        CListDfs.extend(gtex_groups_dataframes)
        #print(CListDfs)        

        # Create an analyzer object from imported GTEXDataAnalyzer.py
        analyzer = GTEXDataAnalyzer(CListDfs, group_names_list, tf_ens_ids) 
        # 'dataframes' is a list of dataframes, and each dataframe
        # has 8 columns(for now): overlapping ensIDs, fold change, t-values, p-values, log(p-values),
        # control group mean, group? mean, mean of Control group and group? averages (mean TPM)

        dataframes_for_graph = analyzer.do_statistical_analysis(test_mode)  

        print(dataframes_for_graph[0].iloc[:,1])
        print(dataframes_for_graph[0].iloc[:,4])
        print(dataframes_for_graph[0].iloc[:,7])        

        #---------------for Graph 1 (Volcano Plot)-------------#       
        # only use 'fold change' col for x_axis, 'log(p-values)' for y_axis
        # [[x_df1...], [x_df2...], [x_df3...],...]
        x_volcano = [list(dataframes_for_graph[i].iloc[:,1]) for i in range(len(dataframes_for_graph))] 
        # [[y_df1...], [y_df2...], [y_df3...],...]
        y_volcano = [list(dataframes_for_graph[i].iloc[:,4]) for i in range(len(dataframes_for_graph))]
        #---------------------Graph 1 ends---------------------#

        print(len(x_volcano))
        print(len(y_volcano))
        #print(x_volcano[0])
        #print(y_volcano[0])

       

        #---------------for Graph 2 (Differential Expression TPM Plot)-------------#
        # only use 'mean TPM' col for x_axis, 'fold change' for y_axis
        x_differential = [list(dataframes_for_graph[i].iloc[:,7]) for i in range(len(dataframes_for_graph))]
        y_differential = [list(dataframes_for_graph[i].iloc[:,1]) for i in range(len(dataframes_for_graph))]
        #---------------------Graph 2 ends---------------------#

        test_list = [x_volcano[0],y_volcano[0]]
        test_list2 = [x_differential[0],y_differential[0]]

        '''
        # working on the copy version

    return JsonResponse({}, status=201)

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
        # [[],['F'],['20-29', '30-39'],['Ventilator'],[],['Skin','Blood']] = 192 samples
        # [[], ['M'], ['70-79'], ['Ill Chronic'], [], []] = 38 samples
        # [[], ['M', 'F'], ['50-59'], ['Ill Unexpected', 'Fast Natural'], [], ['Breast', 'Salivary Gland', 'Vagina']] = 43 samples
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

'''@csrf_exempt
def input_detail(request, pk):
    """
    Retrieve, update or delete a code input.
    """
    try:
        input = Input.objects.get(pk=pk)
    except Input.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET': # retrieve data
        serializer = InputSerializer(input)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT': # update data
        data = JSONParser().parse(request)
        serializer = InputSerializer(input, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE': 
        input.delete()
        return HttpResponse(status=204)'''


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
        pc = pd.read_csv('/Users/phuongtran/Desktop/TATA-Web-Server/webtoolFE/src/csvDatabase/'+jobcode+'/progress.csv')
        percent=int(pc.iloc[0,0])
        return JsonResponse({'progress':percent}, status=201)