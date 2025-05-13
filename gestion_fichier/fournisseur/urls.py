from django.urls import path, include
from .views import FournisseurViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'fournisseurs', FournisseurViewSet)


urlpatterns = [
    path('', include(router.urls)),
]


