from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .models import Input
from .serializers import InputSerializer
from django.shortcuts import render
from .ds_class import ds # import from Math team's file

# Create your views here.
def index_page(request):
    return HttpResponse("<h1>Server is running correctly</h1>") # Provide initial route 

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

        dataArray = dataString.split(',') # change the string to an array
        dataArray[0] = "ENS ID" # change the header to "ENS ID" to be used by ds_class.py
        dataString = ','.join(dataArray) # change the array back to string for later use

        # Import and use def from ds_class.py (from Math Team)
        dataSet= ds(5)
        dataSet.dataframe_from_string(dataString)

        # Graph 1: Distribution of Gene Expression
        x_dge, y_dge = dataSet.dge_graph()

        # Graph 2: TPM per Chromosome (TPC)
        x_tpc, y_tpc = dataSet.tpc_graph()

        # Graph 3: Principal Component Analysis (PCA)
        x_pca, y_pca = dataSet.pca_graph()
        pca_text = dataString.split('\n')[0:1][0].split(',')[1:] # to get the header line from col 1 to col n

        # Send as dictionary type 
        # After data processing, send it back to front end 
        return JsonResponse({'x_dge':x_dge,'y_dge':y_dge,'x_tpc':x_tpc,'y_tpc':y_tpc, 'x_pca': x_pca, 'y_pca': y_pca, 'pca_text': pca_text}, status=201) 
    

@csrf_exempt
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
        return HttpResponse(status=204)



