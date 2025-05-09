from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FicheBesoinViewSet

router = DefaultRouter()
router.register(r'fiches_besoin', FicheBesoinViewSet)  # Enregistre le viewset avec le router

urlpatterns = [
    path('', include(router.urls)),  # Inclut toutes les routes générées par le router
    
]

