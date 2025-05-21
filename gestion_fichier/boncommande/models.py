from django.db import models
from devisglobal.models import DevisGlobal

class BonCommande(models.Model):
    numero_bon = models.CharField(max_length=100, unique=True)
    date_bon = models.DateField()
    devis = models.OneToOneField(DevisGlobal, on_delete=models.CASCADE, related_name='bon_commande')

    class Meta:
        db_table = 'boncommandes'

    def __str__(self):
        return f"Bon de commande {self.numero_bon} - {self.date_bon}"