from rest_framework import viewsets

from devisligne.serializer import DevisLigneSerializer
from .models import Fournisseur, DevisGlobal, DevisLigne, Designation


class DevisLigneViewSet(viewsets.ModelViewSet):
    queryset = DevisLigne.objects.all()
    serializer_class = DevisLigneSerializer