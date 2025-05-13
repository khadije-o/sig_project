

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Fournisseur(models.Model):
    nom_entreprise = models.CharField(max_length=255)
    telephone = models.CharField(max_length=20)
    email = models.EmailField()
    nif = models.CharField(max_length=100)
    rc = models.CharField(max_length=100)
    compte_bancaire = models.CharField(max_length=100)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='fournisseurs_crees')

    class Meta:
        db_table = 'fournisseurs'

    def __str__(self):
        return self.nom_entreprise
