from rest_framework import serializers
from .models import Fournisseur

class FournisseurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fournisseur
        fields = '__all__'
        read_only_fields = ['created_by']