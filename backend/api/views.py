from rest_framework import viewsets

from api.serializers import *
from core.models import *


class WorkerViewSet(viewsets.ModelViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = Patient


class DepartureViewSet(viewsets.ModelViewSet):
    queryset = Departure.objects.all()
    serializer_class = DepartureSerializer


class PresenceViewSet(viewsets.ModelViewSet):
    queryset = Presence.objects.all()
    serializer_class = PresenceSerializer


class DonateBloodViewSet(viewsets.ModelViewSet):
    queryset = DonateBlood.objects.all()
    serializer_class = DonateBloodSerializer


class WorkerViewSet(viewsets.ModelViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer


class SampleViewSet(viewsets.ModelViewSet):
    queryset = Sample.objects.all()
    serializer_class = SampleSerializer


class TransfusionViewSet(viewsets.ModelViewSet):
    queryset = Transfusion.objects.all()
    serializer_class = TransfusionSerializer


class BloodTypeViewSet(viewsets.ModelViewSet):
    queryset = BloodType.objects.all()
    serializer_class = BloodTypeSerializer
