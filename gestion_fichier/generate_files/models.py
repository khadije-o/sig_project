


from django.db import models
from designation.models import Designation
from users.models import User

class FicheBesoins(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fiches')  
    quantité = models.PositiveIntegerField()
    designation = models.ForeignKey(Designation, on_delete=models.CASCADE,  unique=True, related_name='fiches')
    observation = models.CharField(max_length=150, blank=True, null=True)
    date_creation = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'fiche_besoin'

    def __str__(self):
        return f"Fiche #{self.id} - Utilisateur: {self.user.username}"
