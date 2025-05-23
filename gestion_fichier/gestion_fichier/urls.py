"""
URL configuration for gestion_fichier project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # path('', include('generate_files.urls')),
    path('admin/', admin.site.urls),
    path('users/', include("users.urls")),             
    path('fiches_besoin/', include('fiches_besoin.urls')),  # Inclus les routes définies dans fiches/urls.py
    path('besoins/', include('besoins.urls')), 
    path('fournisseurs/', include('fournisseur.urls')), 
    path('devisligne/', include('devisligne.urls')), 
    path('devisglobal/', include('devisglobal.urls')), 
    path('invitations_offre/', include('invitations_offre.urls')),
    path('invitation_fiche_besoin/', include('invitation_fiche_besoin.urls')), 
    path('designation/', include('designation.urls')),  
    path('fiches_besoin/fiches_besoin/', include('besoins.urls')),
    path('api/users/', include('users.urls')),
    path('boncommande/', include('boncommande.urls')), 


    
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
