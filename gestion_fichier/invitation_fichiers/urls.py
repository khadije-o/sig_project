from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InvitationFicheViewSet

router = DefaultRouter()
router.register(r'invitation-fiche', InvitationFicheViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
