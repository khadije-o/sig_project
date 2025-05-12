




# # views.py
# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from .models import FicheBesoin
# from .serializers import FicheBesoinSerializer
# from besoins.models import Besoin
# from designation.models import Designation
# from django.contrib.auth import get_user_model
# from datetime import date

# User = get_user_model()

# class FicheBesoinViewSet(viewsets.ModelViewSet):
#     queryset = FicheBesoin.objects.all().order_by('-date_fiche')
#     serializer_class = FicheBesoinSerializer
    

#     def create(self, request, *args, **kwargs):
#         try:
#             user = User.objects.get(id=request.data.get('user_id'))
#             besoins_data = request.data.get('besoins', [])

#             if not besoins_data:
#                 return Response({'error': 'Aucun besoin fourni.'}, status=status.HTTP_400_BAD_REQUEST)

#             fiche = FicheBesoin.objects.create(
#                 numero=FicheBesoin.objects.count() + 1,
#                 date_fiche=date.today(),
#                 user=user
#             )

#             for besoin in besoins_data:
#                 designation = Designation.objects.get(id=besoin['designation'])
#                 Besoin.objects.create(
#                     fiche_besoin=fiche,
#                     designation=designation,
#                     quantite=besoin['quantité'],
#                     observation=besoin.get('observation', '')
#                 )

#             return Response({'message': 'Fiche et besoins créés avec succès'}, status=status.HTTP_201_CREATED)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



from rest_framework import viewsets, status
from rest_framework.response import Response

from invitations_offre.models import User
from .models import FicheBesoin
from .serializers import FicheBesoinSerializer
from besoins.models import Besoin
from designation.models import Designation
from django.contrib.auth import get_user_model
from datetime import date

User = get_user_model()

class FicheBesoinViewSet(viewsets.ModelViewSet):
    queryset = FicheBesoin.objects.all().order_by('-date_fiche')
    serializer_class = FicheBesoinSerializer
    
    def create(self, request, *args, **kwargs):
        try:
            user = User.objects.get(id=request.data.get('user_id'))
            besoins_data = request.data.get('besoins', [])

            if not besoins_data:
                return Response({'error': 'Aucun besoin fourni.'}, status=status.HTTP_400_BAD_REQUEST)

            fiche = FicheBesoin.objects.create(
                numero=FicheBesoin.objects.count() + 1,
                date_fiche=date.today(),
                user=user
            )

            for besoin in besoins_data:
                designation = Designation.objects.get(id=besoin['designation'])
                Besoin.objects.create(
                    fiche_besoin=fiche,
                    designation=designation,
                    quantite=besoin['quantité'],
                    observation=besoin.get('observation', '')
                )

            # Retournez la fiche complète avec ses besoins
            serializer = self.get_serializer(fiche)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        


from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, Image, TableStyle, Paragraph, Spacer
from datetime import date
from io import BytesIO
from .models import FicheBesoin
from django.conf import settings
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
import os

def pdf_fiche_besoin(request, fiche_id=None):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()

    # Vérifier que fiche_id est fourni
    if not fiche_id:
        return HttpResponse("ID de la fiche manquant", status=400)

    # Récupération de la fiche
    try:
        fiche = FicheBesoin.objects.get(id=fiche_id)
    except FicheBesoin.DoesNotExist:
        return HttpResponse("Fiche introuvable", status=404)

    # Récupérer les besoins associés à la fiche
    besoins = fiche.besoins.all()  

    # Préparation styles
    style_left = styles['Title']
    style_left.alignment = 0
    style_left.fontSize = 12

    style_right = styles['Normal']
    style_right.alignment = 2
    style_right.fontSize = 10

    style_titles = ParagraphStyle(
        name="StyleTitles",
        fontSize=11,
        leading=14,
        alignment=TA_LEFT,
        spaceAfter=0,
        spaceBefore=0
    )

    # Logo
    logo_path = os.path.join(settings.BASE_DIR, 'fiches_besoin', 'static', 'fiches_besoin', 'images', 'logo1.jpg')
    if os.path.exists(logo_path):
        logo = Image(logo_path, width=130, height=130)
    else:
        logo = Paragraph("Logo manquant", style_right)

    # En-tête
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
    elements.append(Paragraph(f"FICHE DE BESOINS N°: {fiche.numero}", style_left))
    elements.append(Paragraph(f"Fait, Le : {fiche.date_fiche.strftime('%d/%m/%Y')}", style_right))
    elements.append(Spacer(1, 24))

    # Tableau des besoins
    data = [["Quantité", "Désignation", "Observation"]]
    for besoin in besoins:
        data.append([
            str(besoin.quantite),
            besoin.designation,
            besoin.observation or "-"
        ])

    table = Table(data, colWidths=[80, 300, 100])

    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#3498db")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ]))
    elements.append(table)

    doc.build(elements)
    pdf = buffer.getvalue()
    buffer.close()

    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="fiche_besoin_{fiche_id}.pdf"'
    return response
