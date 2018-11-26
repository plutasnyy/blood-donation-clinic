from django.core.validators import MinLengthValidator, RegexValidator, MaxValueValidator
from django.db import models
from django.utils.datetime_safe import datetime

alphanumeric = RegexValidator(r'^[0-9]*$', 'Only numbers characters are allowed.')
BLOOD_TYPE_CHOICES = ((x, x) for x in ["ARh+", "ARh-", "BRh+", "BRh-", "ABRh+", "ABRh-", "0R+", "ORH-"])
BLOOD_TYPE_CHOICES2 = ((x, x) for x in ["ARh+", "ARh-", "BRh+", "BRh-", "ABRh+", "ABRh-", "0R+", "ORH-"])
# IT WONT WORK WITHOUT THIS STAFF I DONT KNOW WHY 


class Worker(models.Model):
    pesel = models.CharField(max_length=11, primary_key=True, validators=[MinLengthValidator(11), alphanumeric])
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    position = models.CharField(max_length=30)


class Patient(models.Model):
    pesel = models.CharField(max_length=11, primary_key=True, validators=[MinLengthValidator(11), alphanumeric])
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    blood = models.CharField(choices=BLOOD_TYPE_CHOICES, max_length=4)


class Departure(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(default=datetime.now)
    place = models.CharField(max_length=30)


class Presence(models.Model):
    id = models.AutoField(primary_key=True)
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE)
    departure = models.ForeignKey(Departure, on_delete=models.CASCADE)


class DonateBlood(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(default=datetime.now)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    presence = models.ForeignKey(Presence, null=True, blank=True, on_delete=models.CASCADE)
    worker = models.ForeignKey(Worker, null=True, blank=True, on_delete=models.CASCADE)


class Sample(models.Model):
    id = models.AutoField(primary_key=True)
    donate_blood = models.ForeignKey(DonateBlood, on_delete=models.CASCADE)
    size = models.PositiveIntegerField(validators=[MaxValueValidator(500)])
    blood = models.CharField(choices=BLOOD_TYPE_CHOICES2, max_length=4)


class Transfusion(models.Model):
    id = models.AutoField(primary_key=True)
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    sample = models.ForeignKey(Sample, on_delete=models.CASCADE)