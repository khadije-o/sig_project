from django.db import models

class Designation(models.Model):
    nom = models.CharField(max_length=150, unique=True)

    class Meta:
        db_table = 'designation'

    def __str__(self):
        return self.nom
