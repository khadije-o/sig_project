
# from rest_framework import serializers
# from devisglobal.models import DevisGlobal
# from devisligne.models import DevisLigne
# from devisligne.serializer import DevisLigneSerializer, DevisLigneCreateSerializer, DevisLigneUpdateSerializer
# from fournisseur.serializers import FournisseurSerializer
# from fournisseur.models import Fournisseur


# class DevisGlobalCreateSerializer(serializers.ModelSerializer):
#     lignes = DevisLigneCreateSerializer(many=True, write_only=True)
#     piece_jointe = serializers.FileField(required=False, allow_null=True)

#     class Meta:
#         model = DevisGlobal
#         fields = '__all__'

#     def create(self, validated_data):
#         lignes_data = validated_data.pop('lignes', [])
#         piece_jointe = validated_data.pop('piece_jointe', None)
#         devis = DevisGlobal.objects.create(
#             **validated_data,
#             piece_jointe=piece_jointe
#         )

#         for ligne_data in lignes_data:
#             DevisLigne.objects.create(devis=devis, **ligne_data)

#         devis.calculer_totaux()
#         return devis


# class DevisGlobalSerializer(serializers.ModelSerializer):
#     fournisseur = FournisseurSerializer(read_only=True)  # On n'update pas le fournisseur ici
#     lignes = DevisLigneUpdateSerializer(many=True, required=False)

#     class Meta:
#         model = DevisGlobal
#         fields = '__all__'

#     def update(self, instance, validated_data):
#         # On récupère les données des lignes s'il y en a
#         lignes_data = validated_data.pop('lignes', None)

#         # Mise à jour des champs simples
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()

#         if lignes_data:
#             existing_ids = [l.id for l in instance.lignes.all()]
#             updated_ids = []

#             for ligne_data in lignes_data:
#                 ligne_id = ligne_data.get('id')
#                 if ligne_id in existing_ids:
#                     ligne = DevisLigne.objects.get(id=ligne_id, devis=instance)
#                     ligne.designation_id = ligne_data.get('designation', ligne.designation_id)
#                     ligne.quantite = ligne_data.get('quantite', ligne.quantite)
#                     ligne.prix_unitaire = ligne_data.get('prix_unitaire', ligne.prix_unitaire)
#                     ligne.prix_total = ligne_data.get('prix_total', ligne.prix_total)
#                     ligne.save()
#                     updated_ids.append(ligne_id)

#         return instance






from django.core.files.base import ContentFile
import base64
import uuid
from rest_framework import serializers
from devisglobal.models import DevisGlobal
from devisligne.models import DevisLigne
from devisligne.serializer import DevisLigneCreateSerializer, DevisLigneUpdateSerializer
from fournisseur.serializers import FournisseurSerializer

class DevisGlobalCreateSerializer(serializers.ModelSerializer):
    lignes = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=True
    )
    piece_jointe = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = DevisGlobal
        fields = '__all__'

    def validate_piece_jointe(self, value):
        if not value:
            return None
            
        try:
            format, imgstr = value.split(';base64,')
            ext = format.split('/')[-1]
            file_name = f"{uuid.uuid4()}.{ext}"
            return ContentFile(base64.b64decode(imgstr), name=file_name)
        except Exception:
            raise serializers.ValidationError("Format de pièce jointe invalide")

    def create(self, validated_data):
        lignes_data = validated_data.pop('lignes')
        piece_jointe = validated_data.pop('piece_jointe', None)

        # Création du devis sans la pièce jointe
        devis = DevisGlobal.objects.create(**validated_data)
        
        # Ajout de la pièce jointe après création si elle existe
        if piece_jointe:
            devis.piece_jointe = piece_jointe
            devis.save()

        # Création des lignes
        for ligne in lignes_data:
            DevisLigne.objects.create(
                devis=devis,
                designation_id=ligne['designation'],
                quantite=ligne['quantite'],
                prix_unitaire=ligne['prix_unitaire'],
            )

        devis.calculer_totaux()
        return devis

class DevisGlobalSerializer(serializers.ModelSerializer):
    fournisseur = FournisseurSerializer(read_only=True)  # On n'update pas le fournisseur ici
    lignes = DevisLigneUpdateSerializer(many=True, required=False)

    class Meta:
        model = DevisGlobal
        fields = '__all__'

    def update(self, instance, validated_data):
        # On récupère les données des lignes s'il y en a
        lignes_data = validated_data.pop('lignes', None)

        # Mise à jour des champs simples
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if lignes_data:
            existing_ids = [l.id for l in instance.lignes.all()]
            updated_ids = []

            for ligne_data in lignes_data:
                ligne_id = ligne_data.get('id')
                if ligne_id in existing_ids:
                    ligne = DevisLigne.objects.get(id=ligne_id, devis=instance)
                    ligne.designation_id = ligne_data.get('designation', ligne.designation_id)
                    ligne.quantite = ligne_data.get('quantite', ligne.quantite)
                    ligne.prix_unitaire = ligne_data.get('prix_unitaire', ligne.prix_unitaire)
                    ligne.prix_total = ligne_data.get('prix_total', ligne.prix_total)
                    ligne.save()
                    updated_ids.append(ligne_id)

        return instance


