from rest_framework import serializers
from .models import InvitationFiche

class InvitationFicheSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvitationFiche
        fields = '__all__'
