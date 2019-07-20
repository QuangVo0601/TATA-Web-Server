from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .models import Input
from .serializers import InputSerializer
from django.shortcuts import render
from .ds_class import ds # import from ds_class.py for validationPage.js
from .GTEXDataAnalyzer import GTEXDataAnalyzer # import from GTEXDataAnalyzer.py for batchPage.js
from .query import get_sample_names, process_group_query # import from query.py for gtexModal.js

# Create your views here.
def index_page(request):
    return HttpResponse("<h1>Server is running correctly</h1>") # Provide initial route 

# for csvReader.js, saved in urls.py
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

        # Graph 1: Distribution of Gene Expression
        x_dge, y_dge = dataSet.dge_graph()

        # Graph 2: TPM per Chromosome (TPC)
        x_tpc, y_tpc = dataSet.tpc_graph()

        # Graph 3: Principal Component Analysis (PCA)
        x_pca, y_pca = dataSet.pca_graph()

        # to get the header line from col 1 to col n
        pca_text = dataString.split('\n')[0:1][0].split(',')[1:] 

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

        # 'group_lists' is the list of lists of groups sent from groupingPage.js
        group_lists = data['groupsList'] # syntax: data[key], key = package's name being sent
        # 'gtex_groups_queries' is the list of gtex group queries sent from groupingPage.js
        #gtex_groups_queries = data['gtexQueries']

        #print(group_lists)
        #print(gtex_groups_queries)
        
        # Retrieve the 'dataString' saved in database
        dataString = request.session['dataString']

        # import and use def from ds_class.py (from Math Team)
        dataSet= ds(5)
        # build the dataframe from 'dataString' 
        dataSet.dataframe_from_string(dataString)

        '''# dummy data to send to Math team, delete later
        group_lists = [['control group','#Patient1 (Gene Score)','#Patient3','#Patient5'],
                  ['group1','#Patient2','#Patient4'],
                  ['group2','#Patient6','#Patient7']]'''

        # what Jon wants:
        # dont use Skin, Blood, Brain, Muscle for now (files are too big)  
        gtex_groups_queries = [[[],[],['20-29', '30-39'],[],[], ['Kidney','Bladder'], 'gtex group 1'],
		                    [[],['M'],['20-29', '30-39', '40-49', '50-59'],[],[], ['Liver', 'Kidney'], 'gtex group 2'],
                            [[], ['F'], ['50-59'], ['Ventilator', 'Fast Natural'], [], ['Liver','Ovary', 'Salivary Gland',], 'gtex group 3']]

        #           
        #gtex_groups_dataframes = process_group_query(gtex_groups_queries)    

        # python -w ignore

        #print(gtex_groups_dataframes)     
        # then append to CListDfs

        # pass in list of groups, return list of dataframes associated with list of groups
        CListDfs = dataSet.make_groups(group_lists) 
        #print(CListDfs)

        #CListDfs.extend(gtex_groups_dataframes)

        #print(len(gtex_groups_dataframes))
        #print(len(CListDfs))
        #print(CListDfs)

        # get list of all group names (1st item in each list of group_lists)
        group_names_list = [group_lists[i][0] for i in range(len(group_lists))]
        # get list of all gtex group names (7th item in each list of gtex_groups_queries)
        #gtex_groups_names = [gtex_groups_queries[i][6] for i in range(len(gtex_groups_queries))]
        # combine two lists above
        #group_names_list.extend(gtex_groups_names)

        #print(group_names_list)

        # Create an analyzer object from imported GTEXDataAnalyzer.py
        analyzer = GTEXDataAnalyzer(CListDfs, group_names_list) 

        # for uncorrected pca graph in batchPage.js
        x_uncorrected_pca = [] # list of lists of x-axis of all dataframes
        y_uncorrected_pca = [] # list of lists of y-axis of all dataframes
        for df in analyzer.get_uncorrected_dataframes():
            print(df)
            data_set_object = ds(5,df) 
            x, y = data_set_object.pca_graph() # call pca_graph func from ds_class.py
            x_uncorrected_pca.append(x)
            y_uncorrected_pca.append(y)
        #print(x_uncorrected_pca)
        #print(y_uncorrected_pca)

        # for corrected pca graph in batchPage.js
        x_corrected_pca = [] # list of lists of x-axis of all dataframes
        y_corrected_pca = [] # list of lists of y-axis of all dataframes
        for df in analyzer.get_batch_corrected_dataframes():
            data_set_object = ds(5,df) 
            x, y = data_set_object.pca_graph() # call pca_graph func from ds_class.py
            x_corrected_pca.append(x)
            y_corrected_pca.append(y)
        #print(x_corrected_pca)
        #print(y_corrected_pca)

        return JsonResponse({'x_uncorrected_pca':x_uncorrected_pca,'y_uncorrected_pca':y_uncorrected_pca,
                             'x_corrected_pca':x_corrected_pca,'y_corrected_pca':y_corrected_pca,
                             'group_names_list':group_names_list }, status=201)


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



