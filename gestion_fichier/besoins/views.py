# from rest_framework import viewsets
# from .models import Besoin
# from .serializers import BesoinSerializer

# class BesoinViewSet(viewsets.ModelViewSet):
#     queryset = Besoin.objects.all()
#     serializer_class = BesoinSerializer
    

from rest_framework import viewsets
from .models import Besoin
from .serializers import BesoinSerializer
from rest_framework.response import Response
from rest_framework import status

class BesoinViewSet(viewsets.ModelViewSet):
    queryset = Besoin.objects.all()
    serializer_class = BesoinSerializer

