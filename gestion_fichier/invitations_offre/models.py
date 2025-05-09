from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Invitation(models.Model):
    val_offre = models.IntegerField()  # champ de type IntegerField au lieu de DateField
    delai_offre = models.IntegerField()  # champ de type IntegerField
    admin = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'is_staff': True},  # pour s'assurer que seul les utilisateurs avec is_staff=True sont sélectionnés
        related_name='invitations_envoyees'
    )

    class Meta:
        db_table = 'invitations_offres'

    def __str__(self):
        return f"Invitation {self.id} - Valeur Offre: {self.val_offre}, Délai: {self.delai_offre} jours"
