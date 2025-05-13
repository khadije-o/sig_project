from django.db import models

from devisglobal.models import DevisGlobal
from designation.models import Designation

class DevisLigne(models.Model):
    devis = models.ForeignKey(DevisGlobal, related_name="lignes", on_delete=models.CASCADE)
    designation = models.ForeignKey(Designation, on_delete=models.CASCADE)
    quantite = models.PositiveIntegerField()
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)
    prix_total = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.prix_total = self.quantite * self.prix_unitaire
        super().save(*args, **kwargs)
        self.devis.calculer_totaux()  # recalculer totaux après chaque ligne

    
    class Meta:
        db_table = 'devisligne'


    def __str__(self):
        return f"{self.designation} - {self.devis.numero}"