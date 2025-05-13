from rest_framework import serializers
from devisligne.serializer import DevisLigneSerializer
from .models import DevisGlobal

class DevisGlobalSerializer(serializers.ModelSerializer):
    lignes = DevisLigneSerializer(many=True, read_only=True)

    class Meta:
        model = DevisGlobal
        fields = '__all__'
    