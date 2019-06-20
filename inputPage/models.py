from django.db import models

# Create your models here. Field = what do you want it to hold 
class Input(models.Model):
    unit = models.TextField()
    inputFile = models.TextField()



