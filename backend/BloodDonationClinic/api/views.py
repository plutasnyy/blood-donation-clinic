from rest_framework import viewsets

from backend.BloodDonationClinic.api.serializers import WorkerSerialier
from backend.BloodDonationClinic.core.models import Worker


class WorkerViewSet(viewsets.ModelViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerialier
