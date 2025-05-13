from rest_framework import viewsets
from devisglobal.serializer import DevisGlobalSerializer
from .models import DevisGlobal
from rest_framework.exceptions import PermissionDenied

class DevisGlobalViewSet(viewsets.ModelViewSet):
    queryset = DevisGlobal.objects.all()
    serializer_class = DevisGlobalSerializer

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied("Seuls les administrateurs peuvent créer un devis.")
        serializer.save(created_by=self.request.user)
