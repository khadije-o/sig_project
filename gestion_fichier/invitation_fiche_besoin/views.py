from rest_framework import viewsets
from .models import InvitationFicheBesoin
from .serializers import InvitationFicheBesoinSerializer

class InvitationFicheBesoinViewSet(viewsets.ModelViewSet):
    queryset = InvitationFicheBesoin.objects.all()
    serializer_class = InvitationFicheBesoinSerializer
