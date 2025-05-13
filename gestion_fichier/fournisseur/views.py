from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Fournisseur
from .serializers import FournisseurSerializer

class FournisseurViewSet(viewsets.ModelViewSet):
    queryset = Fournisseur.objects.all()
    serializer_class = FournisseurSerializer

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied("Seuls les administrateurs peuvent créer un fournisseur.")
        serializer.save(created_by=self.request.user)
