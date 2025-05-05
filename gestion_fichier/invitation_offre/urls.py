from rest_framework.routers import DefaultRouter
from .views import InvitationOffreViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'', InvitationOffreViewSet, basename='invitation')

urlpatterns = [
    path('', include(router.urls)),
]
