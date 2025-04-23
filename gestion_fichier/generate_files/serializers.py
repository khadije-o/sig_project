from rest_framework import serializers
from .models import FicheBesoins

class FicheBesoinSerializer(serializers.ModelSerializer):
    class Meta:
        model=FicheBesoins
        fields='__all__'
        extra_kwargs = {
            'observation': {'required': False, 'allow_blank': True}
        }