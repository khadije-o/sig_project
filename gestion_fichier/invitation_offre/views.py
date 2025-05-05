from rest_framework import viewsets
from .models import InvitationOffre
from .serializers import InvitationOffreSerializer
from rest_framework.permissions import IsAuthenticated

class InvitationOffreViewSet(viewsets.ModelViewSet):
    queryset = InvitationOffre.objects.all()
    serializer_class = InvitationOffreSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Enregistre automatiquement le créateur comme admin
        serializer.save(admin=self.request.user)
