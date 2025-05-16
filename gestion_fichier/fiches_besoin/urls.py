from django.urls import path, include
from rest_framework.routers import DefaultRouter
from fiches_besoin import views

router = DefaultRouter()
router.register(r'fiches_besoin', views.FicheBesoinViewSet)  # Enregistre le viewset avec le router

urlpatterns = [
    path('', include(router.urls)),  # Inclut toutes les routes générées par le router
    path('fiches_besoin/pdf_fiche/<int:fiche_id>/', views.pdf_fiche_besoin, name='pdf_fiche_besoin'),
    
]

