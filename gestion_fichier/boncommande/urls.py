from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BonCommandeViewSet, boncommande_pdf

router = DefaultRouter()
router.register(r'boncommande', BonCommandeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('boncommande/<int:pk>/pdf/', boncommande_pdf, name='boncommande-pdf'),
]