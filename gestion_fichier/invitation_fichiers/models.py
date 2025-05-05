from django.db import models
from generate_files.models import FicheBesoins
from invitation_offre.models import InvitationOffre


class InvitationFiche(models.Model):
    invitation = models.ForeignKey(InvitationOffre, on_delete=models.CASCADE)
    fiche_de_besoin = models.ForeignKey(FicheBesoins, on_delete=models.CASCADE)

    class Meta:
        db_table = 'invitation_fichiers'  # 👈 Nom explicite de la table

    def __str__(self):
        return f"Invitation #{self.invitation.id} - Fiche #{self.fiche_de_besoin.id}"
