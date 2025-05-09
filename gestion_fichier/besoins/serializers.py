from rest_framework import serializers
from .models import Besoin

class BesoinSerializer(serializers.ModelSerializer):
    designation = serializers.StringRelatedField() 
    
    class Meta:
        model = Besoin
        fields = '__all__'
