"""webtoolBE URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include, re_path
from core.views import index
from inputPage.views import index_page, input_detail, input_list, input_list2, input_list3, input_jobcode,input_results,input_finalPlots,input_finalTables


urlpatterns = [
    path('backend', index_page),
    path('backend/list', input_list), # for csvReader.js
    path('backend/list2', input_list2), # for groupingPage.js
    path('backend/list3', input_list3), # for algorithmPage.js
    path('backend/detail', input_detail), # gtex route
    path('backend/jobcode', input_jobcode), # homepage jobcode input
    path('backend/results', input_results), # for resultPage.js
    path('backend/finalPlots', input_finalPlots), # for finalPlots.js
    path('backend/finalTables', input_finalTables), # for finalTables.js
    path('', index),
    re_path(r'^(?:.*)/?$',index)
]
