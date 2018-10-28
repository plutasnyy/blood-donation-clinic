from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models

alphanumeric = RegexValidator(r'^[0-9]*$', 'Only numbers characters are allowed.')


class Worker(models.Model):
    pesel = models.CharField(max_length=11, primary_key=True, validators=[MinLengthValidator(11), alphanumeric])
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    position = models.CharField(max_length=30)
