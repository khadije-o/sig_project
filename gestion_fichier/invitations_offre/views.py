# from rest_framework import viewsets
# from .models import Invitation
# from .serializers import InvitationSerializer

# class InvitationViewSet(viewsets.ModelViewSet):
#     queryset = Invitation.objects.all()
#     serializer_class = InvitationSerializer


from rest_framework import viewsets, permissions
from .models import Invitation
from .serializers import InvitationSerializer

class InvitationViewSet(viewsets.ModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            # L'admin voit seulement ses propres invitations
            return Invitation.objects.filter(admin=user)
        else:
            # Un utilisateur non-admin ne voit rien
            return Invitation.objects.none()

    def perform_create(self, serializer):
        # Lors de la création, l'admin connecté est automatiquement assigné
        serializer.save(admin=self.request.user)
