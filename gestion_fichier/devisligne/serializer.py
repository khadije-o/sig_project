from rest_framework import serializers
from .models import DevisLigne

class DevisLigneSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevisLigne
        fields = '__all__'