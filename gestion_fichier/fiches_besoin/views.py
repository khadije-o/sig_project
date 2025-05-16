



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
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from django.conf import settings
import os


def pdf_fiche_besoin(request, fiche_id=None):
    try:
        if not fiche_id:
            return HttpResponse("ID de la fiche manquant", status=400)

        fiche = FicheBesoin.objects.get(id=fiche_id)
        besoins = fiche.besoins.all()

        header_pdf_path = os.path.join(settings.BASE_DIR, 'fiches_besoin', 'static', 'pdf', 'Entête DG.pdf')
        if not os.path.exists(header_pdf_path):
            return HttpResponse("Fichier d'en-tête introuvable", status=500)
        
        header_pdf = PdfReader(header_pdf_path)
        header_page = header_pdf.pages[0]

        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=250)

        styles = getSampleStyleSheet()
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

        elements = []

        elements.append(Paragraph(f"FICHE DE BESOINS N°: {fiche.numero}", style_left))
        elements.append(Paragraph(f"Fait, Le : {fiche.date_fiche.strftime('%d/%m/%Y')}", style_right))
        elements.append(Spacer(1, 24))

        data = [["Quantité", "Désignation", "Observation"]]
        for besoin in besoins:
            data.append([
                str(besoin.quantite),
                besoin.designation.nom if besoin.designation else "N/A",
                besoin.observation or "-"
            ])

        table = Table(data, colWidths=[80, 300, 100])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#67AE6E")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ]))
        elements.append(table)

        doc.build(elements)
        pdf_dynamic = buffer.getvalue()
        buffer.close()

        dynamic_pdf = PdfReader(BytesIO(pdf_dynamic))
        dynamic_page = dynamic_pdf.pages[0]

        header_page.merge_page(dynamic_page)

        writer = PdfWriter()
        writer.add_page(header_page)
        final_buffer = BytesIO()
        writer.write(final_buffer)
        final_buffer.seek(0)

        response = HttpResponse(final_buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="fiche_besoin_{fiche_id}.pdf"'
        return response

    except Exception as e:
        # retourne l'erreur pour debug rapide dans le navigateur
        return HttpResponse(f"Erreur interne : {str(e)}", status=500)
