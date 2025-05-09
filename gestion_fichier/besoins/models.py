from django.db import models
from fiches_besoin.models import FicheBesoin  # importe le modèle parent
from designation.models import Designation  # Assurez-vous que ce chemin est correct selon la structure de votre projet

class Besoin(models.Model):
    fiche_besoin = models.ForeignKey(FicheBesoin, on_delete=models.CASCADE, related_name='besoins')
    designation = models.ForeignKey(Designation, on_delete=models.CASCADE)  # Clé étrangère ajoutée
    quantite = models.IntegerField()
    observation = models.TextField(blank=True)

    class Meta:
        db_table = 'besoin'

    def __str__(self):
        return f"{self.designation} - Qte: {self.quantite}"
