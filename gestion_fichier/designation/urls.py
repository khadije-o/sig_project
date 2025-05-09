from rest_framework.routers import DefaultRouter
from .views import DesignationViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'designation', DesignationViewSet)

urlpatterns = [
    path('', include(router.urls)), 
]
