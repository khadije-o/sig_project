from django.db import models

class Fournisseur(models.Model):
    nom_entreprise = models.CharField(max_length=255)
    telephone = models.CharField(max_length=20)
    email = models.EmailField()
    nif = models.CharField(max_length=100)
    rc = models.CharField(max_length=100)
    compte_bancaire = models.CharField(max_length=100)

    class Meta:
        db_table = 'fournisseurs'

    def __str__(self):
        return self.nom_entreprise