from django.db import models
from designation.models import Designation
from decimal import Decimal
from devisglobal.models import DevisGlobal

class DevisLigne(models.Model):
    devis = models.ForeignKey(DevisGlobal, related_name='lignes', on_delete=models.CASCADE)
    designation = models.ForeignKey(Designation, on_delete=models.CASCADE)
    quantite = models.PositiveIntegerField()
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)
    prix_total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

    def save(self, *args, **kwargs):
        # Calcul automatique du prix total de la ligne
        self.prix_total = Decimal(self.quantite) * Decimal(self.prix_unitaire)
        super().save(*args, **kwargs)
        
        # Mise à jour des totaux du devis global
        if self.devis:
            self.devis.calculer_totaux()

    class Meta:
        db_table = 'devisligne'

    def __str__(self):
        return f"{self.designation} x {self.quantite}"