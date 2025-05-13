from django.urls import path, include
from rest_framework.routers import DefaultRouter

from devisligne.views import DevisLigneViewSet


router = DefaultRouter()
router.register(r'devis-lignes', DevisLigneViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
