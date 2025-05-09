from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InvitationViewSet

router = DefaultRouter()
router.register(r'invitations_offre', InvitationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

