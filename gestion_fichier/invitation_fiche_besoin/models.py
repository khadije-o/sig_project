from django.db import models
from invitations_offre.models import Invitation  # Import correct basé sur ton app
from fiches_besoin.models import FicheBesoin     # À adapter selon ton app fiche_besoin

class InvitationFicheBesoin(models.Model):
    invitation = models.ForeignKey(
        Invitation,
        on_delete=models.CASCADE,
        related_name='invitation_fiches'
    )
    fiche_besoin = models.ForeignKey(
        FicheBesoin,
        on_delete=models.CASCADE,
        related_name='fiche_invitations'
    )

    class Meta:
        db_table = 'invitation_fiche_besoin'
        unique_together = ('invitation', 'fiche_besoin')

    def __str__(self):
        return f"Invitation {self.invitation.id} - FicheBesoin {self.fiche_besoin.id}"
