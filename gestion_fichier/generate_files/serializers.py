# from rest_framework import serializers
# from .models import FicheBesoins

# class FicheBesoinSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=FicheBesoins
#         fields='__all__'
#         extra_kwargs = {
#             'observation': {'required': False, 'allow_blank': True}
#         }

# from rest_framework import serializers

# from users.models import User
# from .models import FicheBesoins

# class FicheBesoinSerializer(serializers.ModelSerializer):
#     user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  # sérialiser l'ID de l'utilisateur
    
#     class Meta:
#         model = FicheBesoins
#         fields = '__all__'
#         extra_kwargs = {
#             'observation': {'required': False, 'allow_blank': True}
#         }

from rest_framework import serializers
from users.models import User
from .models import FicheBesoins

class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']  # Tu peux ajouter email si nécessaire

class FicheBesoinSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)  # Renvoie les infos publiques du user

    class Meta:
        model = FicheBesoins
        fields = '__all__'
        extra_kwargs = {
            'observation': {'required': False, 'allow_blank': True}
        }
