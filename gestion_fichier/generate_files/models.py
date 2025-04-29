from django.db import models

class FicheBesoins(models.Model):
    quantité = models.PositiveIntegerField()
    designation = models.CharField(max_length=150 )
    observation = models.CharField(max_length=150, blank=True, null=True)
    date_creation = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'fichebesoins'


def __str__(self):
    return f"{self.id}"
