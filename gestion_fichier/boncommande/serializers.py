
# from rest_framework import serializers


# from .models import BonCommande
# from devisglobal.models import DevisGlobal

# class BonCommandeSerializer(serializers.ModelSerializer):
#     devis_id = serializers.PrimaryKeyRelatedField(
#         queryset=DevisGlobal.objects.all(), source='devis', write_only=True
#     )
#     devis = serializers.SerializerMethodField(read_only=True)
   
#     def get_devis(self, obj):
#         return {
#             'id': obj.devis.id,
#             'numero': obj.devis.numero,
#             'total_ttc': obj.devis.total_ttc,
#         }
    

#     class Meta:
#         model = BonCommande
#         fields = ['id', 'numero_bon', 'date_bon', 'devis', 'devis_id']


from rest_framework import serializers
from .models import BonCommande
from devisglobal.models import DevisGlobal

class BonCommandeSerializer(serializers.ModelSerializer):
    devis_id = serializers.PrimaryKeyRelatedField(
        queryset=DevisGlobal.objects.all(),
        source='devis',
        write_only=True
    )
    devis = serializers.SerializerMethodField(read_only=True)

    def get_devis(self, obj):
        devis = obj.devis
        lignes = devis.lignes.all()

        return {
            'id': devis.id,
            'numero': devis.numero,
            'fournisseur': {
                'id': devis.fournisseur.id,
                'nom_entreprise': devis.fournisseur.nom_entreprise,
                'telephone': devis.fournisseur.telephone,
                'email': devis.fournisseur.email,
                'nif': devis.fournisseur.nif,
                'rc': devis.fournisseur.rc,
                'compte_bancaire': devis.fournisseur.compte_bancaire,
            },
            'date': devis.date,
            'total_ht': devis.total_ht,
            'tva': devis.tva,
            'montant_tva': devis.montant_tva,
            'total_ttc': devis.total_ttc,
            'lignes': [
                {
                    'id': ligne.id,
                    'designation': {
                        'id': ligne.designation.id,
                        'nom': ligne.designation.nom
                    },
                    'quantite': ligne.quantite,
                    'prix_unitaire': ligne.prix_unitaire,
                    'prix_total': ligne.prix_total
                }
                for ligne in lignes
            ]
        }

    class Meta:
        model = BonCommande
        fields = ['id', 'numero_bon', 'date_bon', 'devis', 'devis_id']


