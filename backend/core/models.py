from django.core.validators import MinLengthValidator, RegexValidator, MaxValueValidator
from django.db import models
from django.utils.datetime_safe import datetime
from django.utils.translation import gettext as _

alphanumeric = RegexValidator(r'^[0-9]*$', 'Only numbers characters are allowed.')


class Worker(models.Model):
    pesel = models.CharField(max_length=11, primary_key=True, validators=[MinLengthValidator(11), alphanumeric])
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    position = models.CharField(max_length=30)
    salary = models.PositiveIntegerField(default=1000)

    def __str__(self):
        return "{} {}".format(self.first_name, self.last_name)


class BloodType(models.Model):
    BLOOD_TYPE_CHOICES = ((x, x) for x in ["0", "A", "B", "AB"])
    RH_TYPE_CHOICES = ((x, x) for x in ["+", "-"])

    id = models.AutoField(primary_key=True)
    blood = models.CharField(choices=BLOOD_TYPE_CHOICES, max_length=2)
    rh = models.CharField(choices=RH_TYPE_CHOICES, max_length=1)

    def __str__(self):
        return "{} Rh{}".format(self.blood, self.rh)

    class Meta:
        unique_together = (("blood", "rh"),)


class Patient(models.Model):
    pesel = models.CharField(max_length=11, primary_key=True, validators=[MinLengthValidator(11), alphanumeric])
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    blood = models.ForeignKey(BloodType, on_delete=models.PROTECT)

    def __str__(self):
        return "{} {}".format(self.first_name, self.last_name)


class Departure(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField(_("Date"), default=datetime.today)
    place = models.CharField(max_length=30)

    def __str__(self):
        return "{} {}".format(self.place, self.date)


class Presence(models.Model):
    id = models.AutoField(primary_key=True)
    worker = models.ForeignKey(Worker, on_delete=models.PROTECT)
    departure = models.ForeignKey(Departure, on_delete=models.PROTECT)

    def __str__(self):
        return "{} {}".format(self.worker, self.departure)


class DonateBlood(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(default=datetime.now)
    patient = models.ForeignKey(Patient, on_delete=models.PROTECT)
    presence = models.ForeignKey(Presence, null=True, blank=True, on_delete=models.PROTECT)
    worker = models.ForeignKey(Worker, null=True, blank=True, on_delete=models.PROTECT)

    def __str__(self):
        worker = self.worker
        if self.worker is None:
            worker = self.presence.worker
        return "{} by {}".format(self.patient, worker)


class Sample(models.Model):
    id = models.AutoField(primary_key=True)
    donate_blood = models.ForeignKey(DonateBlood, on_delete=models.PROTECT)
    size = models.PositiveIntegerField(validators=[MaxValueValidator(500)])
    blood = models.ForeignKey(BloodType, on_delete=models.PROTECT)

    def __str__(self):
        return "{} {}ml {}".format(self.blood, self.size, self.donate_blood)


class Transfusion(models.Model):
    id = models.AutoField(primary_key=True)
    sample = models.OneToOneField(Sample, on_delete=models.PROTECT)
    worker = models.ForeignKey(Worker, on_delete=models.PROTECT)
    patient = models.ForeignKey(Patient, on_delete=models.PROTECT)
    date = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return "{} to {}".format(self.sample, self.patient)
