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








# from django.http import HttpResponse
# from reportlab.lib.pagesizes import A4
# from reportlab.lib import colors
# from reportlab.platypus import SimpleDocTemplate, Table, Image, TableStyle, Paragraph, Spacer
# from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
# from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
# from reportlab.pdfbase.ttfonts import TTFont
# from reportlab.pdfbase import pdfmetrics
# from io import BytesIO
# from .models import InvitationFicheBesoin
# from invitations_offre.models import Invitation
# from django.conf import settings
# import os
# from arabic_reshaper import reshape
# from bidi.algorithm import get_display

# def format_arabic(text):
#     """Formate le texte arabe pour un affichage correct"""
#     try:
#         # Séparer les lignes et traiter uniquement celles contenant de l'arabe
#         lines = text.split('\n')
#         processed_lines = []
#         for line in lines:
#             if any('\u0600' <= char <= '\u06FF' for char in line):
#                 reshaped_text = reshape(line)
#                 processed_lines.append(get_display(reshaped_text))
#             else:
#                 processed_lines.append(line)
#         return '\n'.join(processed_lines)
#     except Exception as e:
#         print(f"Erreur de formatage arabe: {e}")
#         return text

# def pdf_invitation_offre(request, invitation_id=None):
#     if not invitation_id:
#         return HttpResponse("ID de l'invitation manquant", status=400)

#     try:
#         invitation = Invitation.objects.get(id=invitation_id)
#     except Invitation.DoesNotExist:
#         return HttpResponse("Invitation introuvable", status=404)

#     # Récupérer les fiches associées
#     associations = InvitationFicheBesoin.objects.filter(invitation=invitation).select_related('fiche_besoin')

#     buffer = BytesIO()
#     doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=40, leftMargin=40)
#     elements = []
    
#     # Configuration des polices
#     arabic_font_path = os.path.join(settings.BASE_DIR, 'invitation_fiche_besoin', 'static', 'fonts', 'Amiri-Regular.ttf')
#     if os.path.exists(arabic_font_path):
#         pdfmetrics.registerFont(TTFont('Amiri', arabic_font_path))
#     else:
#         pdfmetrics.registerFont(TTFont('ArialUnicode', 'Arial Unicode MS'))

#     # Styles
#     arabic_style = ParagraphStyle(
#         name="ArabicStyle",
#         fontName="Amiri",
#         fontSize=9,
#         leading=14,
#         alignment=TA_RIGHT,
#         spaceAfter=6,
#         allowWidows=1,
#         allowOrphans=1
#     )

#     arabic_bold_style = ParagraphStyle(
#         name="ArabicBold",
#         fontName="Amiri-Bold", 
#         fontSize=11,
#         leading=14,
#         alignment=TA_CENTER
#     )

#     french_style = ParagraphStyle(
#         name="FrenchStyle",
#         fontName="Helvetica-Bold",
#         fontSize=9,
#         leading=14,
#         alignment=TA_LEFT,
#         spaceAfter=6
#     )

#     centered_style = ParagraphStyle(
#         name="CenteredStyle",
#         fontName="Helvetica-Bold",
#         fontSize=8,
#         leading=14,
#         alignment=TA_CENTER,
#         spaceAfter=6
#     )

#     mixed_style = ParagraphStyle(
#         name="MixedStyle",
#         fontName="Amiri",
#         fontSize=9,
#         leading=14,
#         alignment=TA_RIGHT,
#         spaceAfter=6
#     )

#     # Logo plus petit (100x100 au lieu de 130x130)
#     logo_path = os.path.join(settings.BASE_DIR, 'invitation_fiche_besoin', 'static', 'images', 'logo1.jpg')
#     if os.path.exists(logo_path):
#         logo = Image(logo_path, width=100, height=100, hAlign='CENTER')
#     else:
#         logo = Paragraph("Logo manquant", french_style)

#     # Bloc de droite - Format amélioré avec texte centré et en gras
#     right_content = [
#     Paragraph(format_arabic("<b>الجمهورية الإسلامية الموريتانية</b>"), 
#               ParagraphStyle(name="RightArabic1", parent=arabic_style, alignment=TA_CENTER, spaceAfter=0, spaceBefore=0, leading=11)),
#     Paragraph(format_arabic("<b>شرف - إخاء - عدل</b>"), 
#               ParagraphStyle(name="RightArabic2", parent=arabic_style, alignment=TA_CENTER, spaceAfter=2, spaceBefore=0, leading=11)),
#     Paragraph("<b>République Islamique de Mauritanie</b>", 
#               ParagraphStyle(name="RightFrench1", parent=centered_style, spaceAfter=1)),
#     Paragraph("<b>Honneur - Fraternité - Justice</b>", 
#               ParagraphStyle(name="RightFrench2", parent=centered_style, spaceAfter=3)),


#     Paragraph(
#     format_arabic("<b>Nouakchott, le_________________    انواكشوط، في</b>"),
#     ParagraphStyle(name="RightLine1", parent=arabic_style, alignment=TA_CENTER, spaceAfter=1)
# ),
# Paragraph(
#     format_arabic("<b>N°_________________    الرقم</b>"),
#     ParagraphStyle(name="RightLine2", parent=arabic_style, alignment=TA_CENTER, spaceAfter=2)
# ),


# ]

#     left_content = [
#         Paragraph(format_arabic("<b>وزارة الصيد والبنى التحتية البحرية والمينائية</b>"), 
#                 ParagraphStyle(name="LeftArabic", parent=arabic_style, alignment=TA_CENTER, spaceAfter=0, spaceBefore=0, leading=11)),
#         Paragraph("<b>Ministère de la Pêche, des Infrastructures Maritimes et Portuaires</b>", 
#                 ParagraphStyle(name="LeftFrench", parent=centered_style, spaceAfter=2)),
#         Paragraph(format_arabic("<b>سوق السمك بانواكشوط</b>"), 
#                 ParagraphStyle(name="LeftArabic2", parent=arabic_style, alignment=TA_CENTER, spaceAfter=0, spaceBefore=0, leading=11)),
#         Paragraph("<b>Marché au Poisson de Nouakchott</b>", 
#                 ParagraphStyle(name="LeftFrench2", parent=centered_style, spaceAfter=2)),
#         Spacer(1, 12),

#         Paragraph(
#     format_arabic("<b>Chef de Département    رئيس القطاع</b>"),
#         ParagraphStyle(name="LeftLine1", parent=arabic_style, alignment=TA_CENTER, spaceAfter=0, spaceBefore=0, leading=11)
#             ),
#         Paragraph(
#             format_arabic("<b>Administratif et Financier    الإداري والمالي</b>"),
#             ParagraphStyle(name="LeftLine2", parent=arabic_style, alignment=TA_CENTER, spaceAfter=2, spaceBefore=0, leading=11)
#         ),

#     ]



#     # Construction du header avec logo au centre
#     header_table = Table([
#         [
#             Table([[item] for item in left_content], colWidths=[250]),
#             logo,
#             Table([[item] for item in right_content], colWidths=[250])
#         ]
#     ], colWidths=[250, 100, 250])

#     header_table.setStyle(TableStyle([
#         ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
#         ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
#         ('LEFTPADDING', (0, 0), (-1, -1), 0),
#         ('RIGHTPADDING', (0, 0), (-1, -1), 0),
#         ('TOPPADDING', (0, 0), (-1, -1), 0),
#         ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
#     ]))

#     elements.append(header_table)
#     elements.append(Spacer(1, 24))

#     # Titre de l'invitation
#     elements.append(Paragraph(f"<b>INVITATION N°: {invitation.id}  Date de création : {invitation.created_at.strftime('%d/%m/%Y')}</b>", 
#                             ParagraphStyle(name="TitleStyle", parent=french_style, alignment=TA_CENTER)))
#     elements.append(Paragraph(f"<b>Invitation à Proposer une Offre</b>", 
#                             ParagraphStyle(name="DateStyle", parent=french_style, alignment=TA_CENTER)))
#     elements.append(Spacer(1, 24))

#     # Tableau des besoins
#     data = [
#         ["Quantité", "Désignation des articles", "Spécifications"]
#     ]

#     for assoc in associations:
#         fiche = assoc.fiche_besoin
#         for besoin in fiche.besoins.all():
#             data.append([
#                 str(besoin.quantite),
#                 besoin.designation.nom if besoin.designation else "N/A",
#                 ""  # Spécification vide
#             ])

#     table = Table(data, colWidths=[60, 300, 120], repeatRows=1)
#     table.setStyle(TableStyle([
#     ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#3498db")),
#     ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
#     ('ALIGN', (0, 0), (0, -1), 'CENTER'),  # Quantité centrée
#     ('ALIGN', (1, 1), (1, -1), 'LEFT'),    # Désignation alignée à gauche
#     ('ALIGN', (2, 0), (2, -1), 'LEFT'),  # Spécifications LEFT
#     ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
#     ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
#     ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
#     ('FONTSIZE', (0, 0), (-1, -1), 10),
# ]))


#     elements.append(table)
#     elements.append(Spacer(1, 20))
    
#     # Informations supplémentaires
#     elements.append(Paragraph(f"<b>Valeur de l'offre :</b> {invitation.val_offre} DA", french_style))
#     elements.append(Paragraph(f"<b>Délai de livraison :</b> {invitation.delai_offre} jours", french_style))
#     elements.append(Spacer(1, 30))

#     signature_text = "Le directeur"
#     elements.append(Paragraph(signature_text, mixed_style))


#     # Construction du PDF
#     doc.build(elements)
#     pdf = buffer.getvalue()
#     buffer.close()

#     response = HttpResponse(pdf, content_type='application/pdf')
#     response['Content-Disposition'] = f'attachment; filename="invitation_{invitation.id}.pdf"'
#     return response





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
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#3498db")),
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
