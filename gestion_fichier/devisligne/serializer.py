# from rest_framework import serializers

# from .models import DevisLigne
# from designation.models import Designation

# class DevisLigneSerializer(serializers.ModelSerializer):
#     designation_nom = serializers.CharField(source='designation.nom', read_only=True)

#     class Meta:
#         model = DevisLigne
#         fields = ['designation', 'quantite', 'prix_unitaire', 'prix_total']
#         read_only_fields = ['prix_total']


# class DevisLigneCreateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = DevisLigne
#         fields = ['designation', 'quantite', 'prix_unitaire']


# class DevisLigneUpdateSerializer(serializers.ModelSerializer):
#     id = serializers.IntegerField()  # important pour identifier la ligne existante

#     class Meta:
#         model = DevisLigne
#         fields = ['id', 'designation', 'quantite', 'prix_unitaire']



from rest_framework import serializers

from .models import DevisLigne
from designation.models import Designation

# class DevisLigneSerializer(serializers.ModelSerializer):
#     designation_nom = serializers.CharField(source='designation.nom', read_only=True)

#     class Meta:
#         model = DevisLigne
#         fields = ['designation', 'quantite', 'prix_unitaire']
#         read_only_fields = ['prix_total']


class DevisLigneSerializer(serializers.ModelSerializer):
    designation = serializers.SerializerMethodField()
    prix_total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = DevisLigne
        fields = ['id', 'designation', 'quantite', 'prix_unitaire', 'prix_total']
        read_only_fields = ['prix_total']

    def get_designation(self, obj):
        return {
            "id": obj.designation.id,
            "nom": obj.designation.nom
        }



class DevisLigneCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevisLigne
        fields = ['designation', 'quantite', 'prix_unitaire']


class DevisLigneUpdateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()  # important pour identifier la ligne existante

    class Meta:
        model = DevisLigne
        fields = ['id', 'designation', 'quantite', 'prix_unitaire']

