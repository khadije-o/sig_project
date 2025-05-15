# # devisglobal/views.py
# from rest_framework import viewsets
# from devisglobal.models import DevisGlobal
# from devisglobal.serializer import DevisGlobalSerializer, DevisGlobalCreateSerializer

# class DevisGlobalViewSet(viewsets.ModelViewSet):
#     queryset = DevisGlobal.objects.all().order_by('-id')

#     def get_serializer_class(self):
#         if self.request.method == 'POST':
#             return DevisGlobalCreateSerializer
#         return DevisGlobalSerializer

#     def perform_create(self, serializer):
#         serializer.save(created_by=self.request.user)
    
    


from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from devisglobal.models import DevisGlobal
from devisglobal.serializer import DevisGlobalSerializer, DevisGlobalCreateSerializer

class DevisGlobalViewSet(viewsets.ModelViewSet):
    queryset = DevisGlobal.objects.all().order_by('-id')
    # permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DevisGlobalCreateSerializer
        return DevisGlobalSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

