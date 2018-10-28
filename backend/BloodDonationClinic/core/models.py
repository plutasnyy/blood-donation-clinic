from django.db import models


class Worker(models.model):
    pesel = models.CharField(max_length=11, min_length=11, primary_key=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    position = models.CharField(max_length = 30)
