from rest_framework import serializers
from .models import InvitationOffre

class InvitationOffreSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvitationOffre
        fields = ['id', 'admin', 'delai', 'valeur_offre']
        read_only_fields = ['id', 'admin']
