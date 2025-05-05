from rest_framework import viewsets
from .models import InvitationFiche
from .serializers import InvitationFicheSerializer

class InvitationFicheViewSet(viewsets.ModelViewSet):
    queryset = InvitationFiche.objects.all()
    serializer_class = InvitationFicheSerializer
