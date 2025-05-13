


from django.db import models

from fournisseur.models import Fournisseur
from django.contrib.auth import get_user_model

User = get_user_model()


class DevisGlobal(models.Model):
    numero = models.CharField(max_length=100, unique=True)
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)

    total_ht = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tva = models.DecimalField(max_digits=5, decimal_places=2, default=16.0)
    montant_tva = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_ttc = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='devis_crees')

    def calculer_totaux(self):
        lignes = self.lignes.all()
        self.total_ht = sum(ligne.prix_total for ligne in lignes)
        self.montant_tva = self.total_ht * self.tva / 100
        self.total_ttc = self.total_ht + self.montant_tva
        self.save()

    class Meta:
        db_table = 'devisglobal'

    def __str__(self):
        return f"Devis {self.numero}"
