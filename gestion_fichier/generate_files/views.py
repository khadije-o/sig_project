from datetime import date
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import FicheBesoins
from .serializers import FicheBesoinSerializer
from reportlab.platypus import Image


class FicheBesoinsViewSet(viewsets.ModelViewSet):
    queryset = FicheBesoins.objects.all()
    serializer_class = FicheBesoinSerializer

    # @action permet de définir des endpoints personnalisés dans un ViewSet
    @action(detail=False, methods=['get'])
    def fiche_du_jour(self, request):
        today = date.today()
        fiches = FicheBesoins.objects.filter(date_creation=today)
        serializer = self.get_serializer(fiches, many=True)
        return Response({'fiches': serializer.data})
    
    

    

from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, Image, TableStyle, Paragraph, Spacer
from datetime import date
from io import BytesIO
from .models import FicheBesoins
import os
from django.conf import settings
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.units import mm

def pdf_fiche_besoin(request):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()

    
    # Récupération des styles prédéfinis
    styles = getSampleStyleSheet()

    # Création des styles personnalisés
    style_left = styles['Title']
    style_left.alignment = 0
    style_left.fontSize = 12 

    style_right = styles['Normal']
    style_right.alignment = 2
    style_left.fontSize = 10

    style_small = styles['Normal']
    style_small.fontSize = 8

    style_titles = ParagraphStyle(
    name="StyleTitles",
    fontSize=11,
    leading=14,
    alignment=TA_LEFT,
    spaceAfter=0,
    spaceBefore=0
    )

    logo_path = os.path.join(settings.BASE_DIR, 'generate_files', 'static', 'generate_files', 'images', 'logo1.jpg')
    logo = Image(logo_path, width=130, height=130) 

    titles_paragraph = Paragraph(
        "Marché au poisson de Nouakchott (MPN)<br/>Département Administratif et Financier",
        style_titles
    )

    header_table = Table(
    data=[[titles_paragraph, logo]],
    colWidths=[400, 100]
)

    header_table.setStyle(TableStyle([
    ('VALIGN', (0, 0), (1, 0), 'MIDDLE'),
    ('ALIGN', (0, 0), (0, 0), 'LEFT'),
    ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
    ('LEFTPADDING', (0, 0), (-1, -1), 0),
    ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ('TOPPADDING', (0, 0), (-1, -1), 0),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))

    elements.append(header_table)
    elements.append(Spacer(1, 10))
        
    elements.append(Paragraph("FICHE DE BESOINS N°:", style_left))
    elements.append(Paragraph(f"Fait, Le : {date.today().strftime('%d/%m/%Y')}", style_right))
    elements.append(Spacer(1, 24))


    fiches = FicheBesoins.objects.filter(date_creation=date.today())
    data = [["Quantité", "Désignation", "Observation"]]
    for fiche in fiches:
        data.append([
            str(fiche.quantité),
            fiche.designation,
            fiche.observation or "-"  # Gère les valeurs nulles
        ])

    # Style du tableau
    table = Table(data, colWidths=[40, 60, 200, 150])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#3498db")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
    ]))
    elements.append(table)

    doc.build(elements)
    pdf = buffer.getvalue()
    buffer.close()

    # dit au navigateur ce fichier est un PDF
    response = HttpResponse(pdf, content_type='application/pdf')
    #  comment le navigateur doit traiter le fichier
    # attachment → Le navigateur télécharge le fichier.
    response['Content-Disposition'] = 'attachment; filename="fiches_besoins.pdf"'
    return response