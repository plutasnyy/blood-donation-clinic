from rest_framework import viewsets

from api.serializers import *
from core.models import *


class WorkerViewSet(viewsets.ModelViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class DepartureViewSet(viewsets.ModelViewSet):
    queryset = Departure.objects.all()
    serializer_class = DepartureSerializer


class PresenceViewSet(viewsets.ModelViewSet):
    queryset = Presence.objects.all()
    serializer_class = PresenceSerializer


def add_presence_data_to_request(request):
    presence_id = int(request.data.get('presence'))
    presence = Presence.objects.get(pk=presence_id)
    request.data['date'] = presence.departure.date
    request.data['worker'] = presence.worker.pesel


class DonateBloodViewSet(viewsets.ModelViewSet):
    queryset = DonateBlood.objects.all()
    serializer_class = DonateBloodSerializer

    def create(self, request, *args, **kwargs):
        if request.data.get('presence') != '':
            add_presence_data_to_request(request)
        return super(DonateBloodViewSet, self).create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.data.get('presence') != '':
            add_presence_data_to_request(request)
        return super(DonateBloodViewSet, self).update(request, *args, **kwargs)


class SampleViewSet(viewsets.ModelViewSet):
    queryset = Sample.objects.all()
    serializer_class = SampleSerializer


class TransfusionViewSet(viewsets.ModelViewSet):
    queryset = Transfusion.objects.all()
    serializer_class = TransfusionSerializer


class BloodTypeViewSet(viewsets.ModelViewSet):
    queryset = BloodType.objects.all()
    serializer_class = BloodTypeSerializer
