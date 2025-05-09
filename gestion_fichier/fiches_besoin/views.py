




# # views.py
# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from .models import FicheBesoin
# from .serializers import FicheBesoinSerializer
# from besoins.models import Besoin
# from designation.models import Designation
# from django.contrib.auth import get_user_model
# from datetime import date

# User = get_user_model()

# class FicheBesoinViewSet(viewsets.ModelViewSet):
#     queryset = FicheBesoin.objects.all().order_by('-date_fiche')
#     serializer_class = FicheBesoinSerializer
    

#     def create(self, request, *args, **kwargs):
#         try:
#             user = User.objects.get(id=request.data.get('user_id'))
#             besoins_data = request.data.get('besoins', [])

#             if not besoins_data:
#                 return Response({'error': 'Aucun besoin fourni.'}, status=status.HTTP_400_BAD_REQUEST)

#             fiche = FicheBesoin.objects.create(
#                 numero=FicheBesoin.objects.count() + 1,
#                 date_fiche=date.today(),
#                 user=user
#             )

#             for besoin in besoins_data:
#                 designation = Designation.objects.get(id=besoin['designation'])
#                 Besoin.objects.create(
#                     fiche_besoin=fiche,
#                     designation=designation,
#                     quantite=besoin['quantité'],
#                     observation=besoin.get('observation', '')
#                 )

#             return Response({'message': 'Fiche et besoins créés avec succès'}, status=status.HTTP_201_CREATED)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



from rest_framework import viewsets, status
from rest_framework.response import Response

from invitations_offre.models import User
from .models import FicheBesoin
from .serializers import FicheBesoinSerializer
from besoins.models import Besoin
from designation.models import Designation
from django.contrib.auth import get_user_model
from datetime import date

User = get_user_model()

class FicheBesoinViewSet(viewsets.ModelViewSet):
    queryset = FicheBesoin.objects.all().order_by('-date_fiche')
    serializer_class = FicheBesoinSerializer
    
    def create(self, request, *args, **kwargs):
        try:
            user = User.objects.get(id=request.data.get('user_id'))
            besoins_data = request.data.get('besoins', [])

            if not besoins_data:
                return Response({'error': 'Aucun besoin fourni.'}, status=status.HTTP_400_BAD_REQUEST)

            fiche = FicheBesoin.objects.create(
                numero=FicheBesoin.objects.count() + 1,
                date_fiche=date.today(),
                user=user
            )

            for besoin in besoins_data:
                designation = Designation.objects.get(id=besoin['designation'])
                Besoin.objects.create(
                    fiche_besoin=fiche,
                    designation=designation,
                    quantite=besoin['quantité'],
                    observation=besoin.get('observation', '')
                )

            # Retournez la fiche complète avec ses besoins
            serializer = self.get_serializer(fiche)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)