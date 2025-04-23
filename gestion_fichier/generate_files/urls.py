from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FicheBesoinsViewSet, pdf_fiche_besoin

# automatiquement générer des routes get, post
router = DefaultRouter()
router.register(r'fichebesoin', FicheBesoinsViewSet, basename='fichebesoin')

urlpatterns = [
    path('generatefiles/', include(router.urls)),
    path('generatefiles/pdf_fiche/', pdf_fiche_besoin, name='pdf_fiche'),
    path('generatefiles/fiche-du-jour/', FicheBesoinsViewSet.as_view({'get': 'fiche_du_jour'}), name='fiche-du-jour'),
]





