from rest_framework import viewsets
from .models import InvitationFicheBesoin
from .serializers import InvitationFicheBesoinSerializer

class InvitationFicheBesoinViewSet(viewsets.ModelViewSet):
    queryset = InvitationFicheBesoin.objects.all()
    serializer_class = InvitationFicheBesoinSerializer





from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, Image, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from io import BytesIO
from .models import InvitationFicheBesoin
from invitations_offre.models import Invitation
from django.conf import settings
import os

def pdf_invitation_offre(request, invitation_id=None):
    if not invitation_id:
        return HttpResponse("ID de l'invitation manquant", status=400)

    try:
        invitation = Invitation.objects.get(id=invitation_id)
    except Invitation.DoesNotExist:
        return HttpResponse("Invitation introuvable", status=404)

    # Récupérer toutes les fiches associées à cette invitation
    associations = InvitationFicheBesoin.objects.filter(invitation=invitation).select_related('fiche_besoin')

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
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

    # Logo
    logo_path = os.path.join(settings.BASE_DIR, 'fiches_besoin', 'static', 'fiches_besoin', 'images', 'logo1.jpg')
    if os.path.exists(logo_path):
        logo = Image(logo_path, width=130, height=130)
    else:
        logo = Paragraph("Logo manquant", style_right)

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

    elements.append(Paragraph(f"INVITATION N°: {invitation.id}", style_left))
    elements.append(Paragraph(f"Date de création : {invitation.created_at.strftime('%d/%m/%Y')}", style_right))
    elements.append(Spacer(1, 24))

    # Tableau global
    data = [["Quantité", "Désignation des article", "Spésifications"]]

    for assoc in associations:
        fiche = assoc.fiche_besoin
        for besoin in fiche.besoins.all():
            data.append([
                str(besoin.quantite),
                besoin.designation.nom if besoin.designation else "N/A",
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

    elements.append(Spacer(1, 20))
    elements.append(Paragraph(f"<b>Valeur de l'offre :</b> {invitation.val_offre} DA", style_left))
    elements.append(Paragraph(f"<b>Délai de livraison :</b> {invitation.delai_offre} jours", style_left))

    doc.build(elements)
    pdf = buffer.getvalue()
    buffer.close()

    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="invitation_{invitation.id}.pdf"'
    return response
