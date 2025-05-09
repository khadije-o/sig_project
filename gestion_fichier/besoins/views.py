from rest_framework import viewsets
from .models import Besoin
from .serializers import BesoinSerializer

class BesoinViewSet(viewsets.ModelViewSet):
    queryset = Besoin.objects.all()
    serializer_class = BesoinSerializer
    
