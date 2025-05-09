from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InvitationFicheBesoinViewSet

router = DefaultRouter()
router.register(r'invitation_fiche_besoin', InvitationFicheBesoinViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
