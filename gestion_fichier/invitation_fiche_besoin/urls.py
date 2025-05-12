from django.urls import path, include
from rest_framework.routers import DefaultRouter
from invitation_fiche_besoin import views
from .views import InvitationFicheBesoinViewSet


router = DefaultRouter()
router.register(r'invitation_fiche_besoin', InvitationFicheBesoinViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('invitation_fiche_besoin/pdf_invitation/<int:invitation_id>/', views.pdf_invitation_offre, name='pdf_invitation_offre'),
]
