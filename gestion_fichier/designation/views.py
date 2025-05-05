from rest_framework import viewsets
from .models import Designation
from .serializers import DesignationSerializer

class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.all()
    serializer_class = DesignationSerializer
