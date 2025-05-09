from django.db import models
from django.conf import settings  # <- à la place de django.contrib.auth.models

class FicheBesoin(models.Model):
    STATUS_CHOICES = [
        ('En attente', 'En attente'),
        ('Acceptée', 'Acceptée'),
        ('Rejetée', 'Rejetée'),
        ('Historique', 'Historique'),
    ]

    numero = models.IntegerField()  # tu avais demandé que ce soit int
    date_fiche = models.DateField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # <- ici
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='En attente')

    class Meta:
        db_table = 'fiche_besoin'

    def __str__(self):
        return f"{self.numero} - {self.status}"
