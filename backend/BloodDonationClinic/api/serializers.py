from rest_framework import serializers

from core.models import *


class WorkerSerialier(serializers.ModelSerializer):
    class Meta:
        model = Worker
        fields = '__all__'


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'


class DepartureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departure
        fields = '__all__'


class PresenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presence
        fields = '__all__'


class DonateBloodSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonateBlood
        fields = '__all__'


class SampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sample
        fields = '__all__'


class TransfusionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transfusion
        fields = '__all__'
