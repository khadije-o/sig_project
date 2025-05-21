from bidi import get_display
from rest_framework import viewsets
from .models import InvitationFicheBesoin
from .serializers import InvitationFicheBesoinSerializer

class InvitationFicheBesoinViewSet(viewsets.ModelViewSet):
    queryset = InvitationFicheBesoin.objects.all()
    serializer_class = InvitationFicheBesoinSerializer






from bidi import get_display
from rest_framework import viewsets
from .models import InvitationFicheBesoin
from .serializers import InvitationFicheBesoinSerializer

class InvitationFicheBesoinViewSet(viewsets.ModelViewSet):
    queryset = InvitationFicheBesoin.objects.all()
    serializer_class = InvitationFicheBesoinSerializer





from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from arabic_reshaper import reshape
from bidi.algorithm import get_display
from .models import InvitationFicheBesoin
from invitations_offre.models import Invitation
from django.conf import settings
import os


def format_arabic(text):
    try:
        lines = text.split('\n')
        processed_lines = []
        for line in lines:
            if any('\u0600' <= char <= '\u06FF' for char in line):
                reshaped_text = reshape(line)
                processed_lines.append(get_display(reshaped_text))
            else:
                processed_lines.append(line)
        return '\n'.join(processed_lines)
    except Exception:
        return text


def pdf_invitation_offre(request, invitation_id=None):
    if not invitation_id:
        return HttpResponse("ID de l'invitation manquant", status=400)
    try:
        invitation = Invitation.objects.get(id=invitation_id)
    except Invitation.DoesNotExist:
        return HttpResponse("Invitation introuvable", status=404)

    associations = InvitationFicheBesoin.objects.filter(invitation=invitation).select_related('fiche_besoin')

    header_pdf_path = os.path.join(settings.BASE_DIR, 'invitation_fiche_besoin', 'static', 'pdf', 'Entête DG.pdf')
    if not os.path.exists(header_pdf_path):
        return HttpResponse("Fichier d'en-tête introuvable", status=500)

    header_pdf = PdfReader(header_pdf_path)
    header_page = header_pdf.pages[0]

    # Création du PDF dynamique avec platypus (titre + tableau + texte)
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=250)  # topMargin pour laisser place à l'entête PDF

    french_style = ParagraphStyle(
        name="FrenchStyle",
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=14,
        alignment=TA_LEFT,
        spaceAfter=6
    )

    elements = []

    # Titres
    elements.append(Paragraph(
        f"<b>INVITATION N°: {invitation.id}  Date de création : {invitation.created_at.strftime('%d/%m/%Y')}</b>",
        ParagraphStyle(name="TitleStyle", fontName="Helvetica-Bold", fontSize=12, alignment=TA_CENTER, spaceAfter=12)))
    elements.append(Paragraph(
        "<b>Invitation à Proposer une Offre</b>",
        ParagraphStyle(name="TitleStyle", fontName="Helvetica-Bold", fontSize=11, alignment=TA_CENTER, spaceAfter=24)))

    # Tableau des besoins
    data = [["Quantité", "Désignation des articles", "Spécifications"]]
    for assoc in associations:
        fiche = assoc.fiche_besoin
        for besoin in fiche.besoins.all():
            data.append([
                str(besoin.quantite),
                besoin.designation.nom if besoin.designation else "N/A",
                ""
            ])

    table = Table(data, colWidths=[60, 300, 120], repeatRows=1)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#67AE6E")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),  # Quantité centrée
        ('ALIGN', (1, 1), (1, -1), 'LEFT'),    # Désignation alignée à gauche
        ('ALIGN', (2, 0), (2, -1), 'LEFT'),  # Spécifications LEFT
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 20))

    # Détails supplémentaires
    elements.append(Paragraph(f"<b>Valeur de l'offre :</b> {invitation.val_offre} DA", french_style))
    elements.append(Paragraph(f"<b>Délai de livraison :</b> {invitation.delai_offre} jours", french_style))
    elements.append(Spacer(1, 30))
    elements.append(Paragraph("Le directeur", french_style))

    doc.build(elements)
    pdf_dynamic = buffer.getvalue()
    buffer.close()

    # Fusionner page dynamique sur page header
    dynamic_pdf = PdfReader(BytesIO(pdf_dynamic))
    dynamic_page = dynamic_pdf.pages[0]

    header_page.merge_page(dynamic_page)

    writer = PdfWriter()
    writer.add_page(header_page)
    final_buffer = BytesIO()
    writer.write(final_buffer)
    final_buffer.seek(0)

    response = HttpResponse(final_buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="invitation_{invitation.id}.pdf"'
    return response
