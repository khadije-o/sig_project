from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import DevisGlobalViewSet

router = DefaultRouter()
router.register(r'devis-globals', DevisGlobalViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
