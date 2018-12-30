import json

from django.db import connection
from django.http import HttpResponse
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


def add_donate_blood_data_to_request(request):
    blood_donate_id = request.data.get('donate_blood')
    blood_donate = DonateBlood.objects.get(pk=blood_donate_id)
    request.data['blood'] = blood_donate.patient.blood.id


class SampleViewSet(viewsets.ModelViewSet):
    queryset = Sample.objects.all()
    serializer_class = SampleSerializer

    def create(self, request, *args, **kwargs):
        if request.data.get('donate_blood') != '':
            add_donate_blood_data_to_request(request)
        return super(SampleViewSet, self).create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.data.get('donate_blood') != '':
            add_donate_blood_data_to_request(request)
        return super(SampleViewSet, self).update(request, *args, **kwargs)


def set_is_avaible_in_sample(sample_id, value):
    sample = Sample.objects.get(pk=sample_id)
    sample.is_available = value
    sample.save(update_fields=['is_available'])


class TransfusionViewSet(viewsets.ModelViewSet):
    queryset = Transfusion.objects.all()
    serializer_class = TransfusionSerializer

    def create(self, request, *args, **kwargs):
        set_is_avaible_in_sample(request.data.get('sample'), False)
        with connection.cursor() as cursor:
            pid, sid, wid, date = request.data.get('patient'), request.data.get('sample'), request.data.get(
                'worker'), request.data.get('date')
            cursor.callproc('performtransfusion', [pid, sid, wid, date])
        transfusion = Transfusion.objects.latest('id')
        response = {
            'id':transfusion.id,
            'date':transfusion.date.strftime('%Y-%m-%d'),
            'patient':transfusion.patient.pesel,
            'worker':transfusion.worker.pesel,
            'sample':transfusion.sample.id
        }
        return HttpResponse(json.dumps(response))

    def destroy(self, request, *args, **kwargs):
        transufsion_id = int(request.path.split('/')[-2])
        transufsion = Transfusion.objects.get(pk=transufsion_id)
        set_is_avaible_in_sample(transufsion.sample.id, True)
        return super(TransfusionViewSet, self).destroy(request, *args, **kwargs)


class BloodTypeViewSet(viewsets.ModelViewSet):
    queryset = BloodType.objects.all()
    serializer_class = BloodTypeSerializer
