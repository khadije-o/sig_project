from rest_framework import serializers

from besoins.serializers import BesoinSerializer
from users.serializer import UserSerializer
from .models import FicheBesoin

class FicheBesoinSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    besoins = BesoinSerializer(many=True)
    
    class Meta:
        model = FicheBesoin
        fields = '__all__'
