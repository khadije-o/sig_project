from rest_framework import serializers

from devisligne.serializer import DevisLigneSerializer
from .models import Fournisseur, DevisGlobal, DevisLigne, Designation

class DevisGlobalSerializer(serializers.ModelSerializer):
    lignes = DevisLigneSerializer(many=True, read_only=True)

    class Meta:
        model = DevisGlobal
        fields = '__all__'