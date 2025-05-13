from rest_framework import viewsets

from devisglobal.serializer import DevisGlobalSerializer
from .models import Fournisseur, DevisGlobal, DevisLigne, Designation

class DevisGlobalViewSet(viewsets.ModelViewSet):
    queryset = DevisGlobal.objects.all()
    serializer_class = DevisGlobalSerializer
