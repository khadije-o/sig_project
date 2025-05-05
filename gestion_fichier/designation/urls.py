from rest_framework.routers import DefaultRouter
from .views import DesignationViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'', DesignationViewSet, basename='designation')

urlpatterns = [
    path('', include(router.urls)), 
]
