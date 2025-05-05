from django.db import models
from django.conf import settings  # ✅ nécessaire pour AUTH_USER_MODEL

class InvitationOffre(models.Model):
    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={'is_staff': True}
    )
    delai = models.DateTimeField()
    valeur_offre = models.FloatField()

    def __str__(self):
        return f"Invitation #{self.id} par {self.admin.first_name} {self.admin.last_name}"
    
    
    class Meta:
        db_table = "invitation_offre"

     