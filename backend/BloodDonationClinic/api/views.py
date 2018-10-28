from rest_framework import viewsets

from api.serializers import WorkerSerialier
from core.models import Worker


class WorkerViewSet(viewsets.ModelViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerialier
