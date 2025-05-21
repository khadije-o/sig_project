


from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from devisglobal.models import DevisGlobal
from devisglobal.serializer import DevisGlobalSerializer, DevisGlobalCreateSerializer

class DevisGlobalViewSet(viewsets.ModelViewSet):
    queryset = DevisGlobal.objects.all().order_by('-id')
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Si admin (is_staff), retourner seulement ses devis
        if user.is_staff:
            return DevisGlobal.objects.filter(created_by=user).order_by('-id')
        # Sinon, ne rien retourner ou gérer selon le besoin
        return DevisGlobal.objects.none()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DevisGlobalCreateSerializer
        elif self.request.method in ['PUT', 'PATCH']:
            return DevisGlobalSerializer
        return DevisGlobalSerializer  # ou DevisGlobalReadSerializer si tu veux un serializer de lecture séparé

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

