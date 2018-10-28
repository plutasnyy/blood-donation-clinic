from rest_framework import serializers

from backend.BloodDonationClinic.core.models import Worker


class WorkerSerialier(serializers.ModelSerializer):
    class Meta:
        model = Worker
        fields = '__all__'
