from rest_framework import serializers
from .models import InvitationFicheBesoin

class InvitationFicheBesoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvitationFicheBesoin
        fields = '__all__'
