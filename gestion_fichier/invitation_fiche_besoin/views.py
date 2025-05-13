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
# from reportlab.lib.enums import TA_LEFT
# from io import BytesIO
# from .models import InvitationFicheBesoin
# from invitations_offre.models import Invitation
# from django.conf import settings
# import os

# def pdf_invitation_offre(request, invitation_id=None):
#     if not invitation_id:
#         return HttpResponse("ID de l'invitation manquant", status=400)

#     try:
#         invitation = Invitation.objects.get(id=invitation_id)
#     except Invitation.DoesNotExist:
#         return HttpResponse("Invitation introuvable", status=404)

#     # Récupérer toutes les fiches associées à cette invitation
#     associations = InvitationFicheBesoin.objects.filter(invitation=invitation).select_related('fiche_besoin')

#     buffer = BytesIO()
#     doc = SimpleDocTemplate(buffer, pagesize=A4)
#     elements = []
#     styles = getSampleStyleSheet()

#     style_left = styles['Title']
#     style_left.alignment = 0
#     style_left.fontSize = 12

#     style_right = styles['Normal']
#     style_right.alignment = 2
#     style_right.fontSize = 10

#     style_titles = ParagraphStyle(
#         name="StyleTitles",
#         fontSize=11,
#         leading=14,
#         alignment=TA_LEFT,
#         spaceAfter=0,
#         spaceBefore=0
#     )

#     # Logo
#     logo_path = os.path.join(settings.BASE_DIR, 'fiches_besoin', 'static', 'fiches_besoin', 'images', 'logo1.jpg')
#     if os.path.exists(logo_path):
#         logo = Image(logo_path, width=130, height=130)
#     else:
#         logo = Paragraph("Logo manquant", style_right)

    
#     titles_paragraph = Paragraph(
#         "Marché au poisson de Nouakchott (MPN)<br/>Département Administratif et Financier",
#         style_titles
#     )

#     header_table = Table(
#         data=[[titles_paragraph, logo]],
#         colWidths=[400, 100]
#     )
#     header_table.setStyle(TableStyle([
#         ('VALIGN', (0, 0), (1, 0), 'MIDDLE'),
#         ('ALIGN', (0, 0), (0, 0), 'LEFT'),
#         ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
#         ('LEFTPADDING', (0, 0), (-1, -1), 0),
#         ('RIGHTPADDING', (0, 0), (-1, -1), 0),
#         ('TOPPADDING', (0, 0), (-1, -1), 0),
#         ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
#     ]))

#     elements.append(header_table)
#     elements.append(Spacer(1, 10))

#     elements.append(Paragraph(f"INVITATION N°: {invitation.id}", style_left))
#     elements.append(Paragraph(f"Date de création : {invitation.created_at.strftime('%d/%m/%Y')}", style_right))
#     elements.append(Spacer(1, 24))

#     # Tableau global
#     data = [["Quantité", "Désignation des article", "Spésifications"]]

#     for assoc in associations:
#         fiche = assoc.fiche_besoin
#         for besoin in fiche.besoins.all():
#             data.append([
#                 str(besoin.quantite),
#                 besoin.designation.nom if besoin.designation else "N/A",
#                 besoin.observation or "-"
#             ])

#     table = Table(data, colWidths=[80, 300, 100])
#     table.setStyle(TableStyle([
#         ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#3498db")),
#         ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
#         ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
#         ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
#         ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
#     ]))
#     elements.append(table)

#     elements.append(Spacer(1, 20))
#     elements.append(Paragraph(f"<b>Valeur de l'offre :</b> {invitation.val_offre} DA", style_left))
#     elements.append(Paragraph(f"<b>Délai de livraison :</b> {invitation.delai_offre} jours", style_left))

#     doc.build(elements)
#     pdf = buffer.getvalue()
#     buffer.close()

#     response = HttpResponse(pdf, content_type='application/pdf')
#     response['Content-Disposition'] = f'attachment; filename="invitation_{invitation.id}.pdf"'
#     return response






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

# def create_mixed_paragraph(french_text, arabic_text, style):
#     """Crée un paragraphe avec texte français et arabe correctement alignés"""
#     # Crée une table avec deux cellules pour séparer les langues
#     mixed_table = Table([
#         [Paragraph(french_text, style), Paragraph(format_arabic(arabic_text), style)]
#     ], colWidths=[150, 150])
    
#     mixed_table.setStyle(TableStyle([
#         ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
#         ('ALIGN', (0, 0), (0, 0), 'LEFT'),
#         ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
#         ('LEFTPADDING', (0, 0), (-1, -1), 0),
#         ('RIGHTPADDING', (0, 0), (-1, -1), 0),
#         ('TOPPADDING', (0, 0), (-1, -1), 0),
#         ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
#         ('GRID', (0, 0), (-1, -1), 0, colors.white)  # Bordure invisible
#     ]))
    
#     return mixed_table

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
#         fontSize=9,
#         leading=14,
#         alignment=TA_CENTER,
#         spaceAfter=6
#     )

#     # Logo plus petit (100x100)
#     logo_path = os.path.join(settings.BASE_DIR, 'invitation_fiche_besoin', 'static', 'images', 'logo1.jpg')
#     if os.path.exists(logo_path):
#         logo = Image(logo_path, width=100, height=100, hAlign='CENTER')
#     else:
#         logo = Paragraph("Logo manquant", french_style)

#     # Bloc de droite
#     # Création d'un nouveau style pour la première phrase
#     first_paragraph_style = ParagraphStyle(
#         name="FirstParagraphStyle",
#         fontName="Helvetica-Bold",  # Change ici pour la police de ton choix
#         fontSize=14,
#         leading=16,
#         alignment=TA_CENTER,
#         spaceAfter=6
#     )

#     # Contenu des paragraphes avec une police différente pour la première phrase
#     right_content = [
#         Paragraph(format_arabic("<b>الجمهورية الإسلامية الموريتانية</b>"), 
#                 ParagraphStyle(name="RightArabic", parent=arabic_style, alignment=TA_CENTER)),  # Style arabe
#         Paragraph(format_arabic("<b>شرف - إخاء - عدل</b>"), 
#                 ParagraphStyle(name="RightArabic", parent=arabic_style, alignment=TA_CENTER)),  # Style arabe
#         Paragraph("<b>République Islamique de Mauritanie</b>", 
#                 ParagraphStyle(name="RightFrench", parent=centered_style)),  # Style français
#         Paragraph("<b>Honneur - Fraternité - Justice</b>", 
#                 ParagraphStyle(name="RightFrench", parent=centered_style)),  # Style français

#         # Première phrase avec un style différent
#         Paragraph("<b>الجمهورية الإسلامية الموريتانية</b>", 
#                 first_paragraph_style)  # Style différent pour la première phrase
#     ]

#     # Bloc de gauche
#     left_content = [
#         Paragraph(format_arabic("<b>وزارة الصيد والبنى التحتية البحرية والمينائية</b>"), 
#                  ParagraphStyle(name="LeftArabic", parent=arabic_style, alignment=TA_CENTER)),
#         Paragraph("<b>Ministère de la Pêche, des Infrastructures Maritimes et Portuaires</b>", 
#                  ParagraphStyle(name="LeftFrench", parent=centered_style)),
#         Spacer(1, 6),
#         Paragraph(format_arabic("<b>سوق السمك بانواكشوط</b>"), 
#                  ParagraphStyle(name="LeftArabic", parent=arabic_style, alignment=TA_CENTER)),
#         Paragraph("<b>Marché au Poisson de Nouakchott</b>", 
#                  ParagraphStyle(name="LeftFrench", parent=centered_style)),
#         Spacer(1, 12),
#         create_mixed_paragraph(
#             "<b>Chef de Département __________</b>",
#             "<b>رئيس القطاع</b>",
#             french_style
#         ),
#         create_mixed_paragraph(
#             "<b>Administratif et Financier__________</b>",
#             "<b>الإداري والمالي</b>",
#             french_style
#         ),
#     ]

#     # Disposition des éléments sur la même ligne
#     header_table = Table([
#         [
#              Table([[item] for item in left_content], colWidths=[250]),
#             logo,
#             Table([[item] for item in right_content], colWidths=[250])
#         ]
#     ], colWidths=[250, 100])  # Ajuste les colonnes pour l'espace nécessaire

#     header_table.setStyle(TableStyle([
#         ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
#         ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
#         ('LEFTPADDING', (0, 0), (-1, -1), 0),
#         ('RIGHTPADDING', (0, 0), (-1, -1), 0),
#         ('TOPPADDING', (0, 0), (-1, -1), 0),
#         ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
#     ]))

#     elements.append(header_table)
#     elements.append(Spacer(1, 24))

#     # Titre de l'invitation
#     elements.append(Paragraph(
#         f"<b>INVITATION N°: {invitation.id}  Date de création : {invitation.created_at.strftime('%d/%m/%Y')}</b>", 
#         ParagraphStyle(name="TitleStyle", parent=french_style, alignment=TA_CENTER, fontSize=10)
#     ))
#     elements.append(Paragraph(
#         "<b>Invitation à Proposer une Offre</b>", 
#         ParagraphStyle(name="SubtitleStyle", parent=french_style, alignment=TA_CENTER, fontSize=10)
#     ))
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
#         ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#3498db")),
#         ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
#         ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
#         ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
#         ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
#         ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
#         ('FONTSIZE', (0, 0), (-1, -1), 9),
#     ]))

#     elements.append(table)
#     elements.append(Spacer(1, 20))
    
#     # Informations supplémentaires
#     elements.append(Paragraph(
#         f"<b>Valeur de l'offre :</b> {invitation.val_offre} DA", 
#         ParagraphStyle(name="InfoStyle", parent=french_style, fontSize=9)
#     ))
#     elements.append(Paragraph(
#         f"<b>Délai de livraison :</b> {invitation.delai_offre} jours", 
#         ParagraphStyle(name="InfoStyle", parent=french_style, fontSize=9)
#     ))
#     elements.append(Spacer(1, 30))

#     # Signature
#     signature_table = Table([
#         [Paragraph("<b>Le Directeur</b>", french_style), ""],
#     ], colWidths=[400, 100])

#     elements.append(signature_table)

#     # Construction du PDF
#     doc.build(elements)
#     pdf = buffer.getvalue()
#     buffer.close()

#     response = HttpResponse(pdf, content_type='application/pdf')
#     response['Content-Disposition'] = f'attachment; filename="invitation_{invitation.id}.pdf"'
#     return response







from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, Image, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from io import BytesIO
from .models import InvitationFicheBesoin
from invitations_offre.models import Invitation
from django.conf import settings
import os
from arabic_reshaper import reshape
from bidi.algorithm import get_display

def format_arabic(text):
    """Formate le texte arabe pour un affichage correct"""
    try:
        # Séparer les lignes et traiter uniquement celles contenant de l'arabe
        lines = text.split('\n')
        processed_lines = []
        for line in lines:
            if any('\u0600' <= char <= '\u06FF' for char in line):
                reshaped_text = reshape(line)
                processed_lines.append(get_display(reshaped_text))
            else:
                processed_lines.append(line)
        return '\n'.join(processed_lines)
    except Exception as e:
        print(f"Erreur de formatage arabe: {e}")
        return text

def pdf_invitation_offre(request, invitation_id=None):
    if not invitation_id:
        return HttpResponse("ID de l'invitation manquant", status=400)

    try:
        invitation = Invitation.objects.get(id=invitation_id)
    except Invitation.DoesNotExist:
        return HttpResponse("Invitation introuvable", status=404)

    # Récupérer les fiches associées
    associations = InvitationFicheBesoin.objects.filter(invitation=invitation).select_related('fiche_besoin')

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=40, leftMargin=40)
    elements = []
    
    # Configuration des polices
    arabic_font_path = os.path.join(settings.BASE_DIR, 'invitation_fiche_besoin', 'static', 'fonts', 'Amiri-Regular.ttf')
    if os.path.exists(arabic_font_path):
        pdfmetrics.registerFont(TTFont('Amiri', arabic_font_path))
    else:
        pdfmetrics.registerFont(TTFont('ArialUnicode', 'Arial Unicode MS'))

    # Styles
    arabic_style = ParagraphStyle(
        name="ArabicStyle",
        fontName="Amiri",
        fontSize=9,
        leading=14,
        alignment=TA_RIGHT,
        spaceAfter=6,
        allowWidows=1,
        allowOrphans=1
    )

    arabic_bold_style = ParagraphStyle(
        name="ArabicBold",
        fontName="Amiri-Bold",  # <- Utilise la version en gras
        fontSize=11,
        leading=14,
        alignment=TA_CENTER
    )

    french_style = ParagraphStyle(
        name="FrenchStyle",
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=14,
        alignment=TA_LEFT,
        spaceAfter=6
    )

    centered_style = ParagraphStyle(
        name="CenteredStyle",
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=14,
        alignment=TA_CENTER,
        spaceAfter=6
    )

    mixed_style = ParagraphStyle(
        name="MixedStyle",
        fontName="Amiri",
        fontSize=9,
        leading=14,
        alignment=TA_RIGHT,
        spaceAfter=6
    )

    # Logo plus petit (100x100 au lieu de 130x130)
    logo_path = os.path.join(settings.BASE_DIR, 'invitation_fiche_besoin', 'static', 'images', 'logo1.jpg')
    if os.path.exists(logo_path):
        logo = Image(logo_path, width=100, height=100, hAlign='CENTER')
    else:
        logo = Paragraph("Logo manquant", french_style)

    # Bloc de droite - Format amélioré avec texte centré et en gras
    right_content = [
    Paragraph(format_arabic("<b>الجمهورية الإسلامية الموريتانية</b>"), 
              ParagraphStyle(name="RightArabic1", parent=arabic_style, alignment=TA_CENTER, spaceAfter=0)),
    Paragraph(format_arabic("<b>شرف - إخاء - عدل</b>"), 
              ParagraphStyle(name="RightArabic2", parent=arabic_style, alignment=TA_CENTER, spaceAfter=3)),
    Paragraph("<b>République Islamique de Mauritanie</b>", 
              ParagraphStyle(name="RightFrench1", parent=centered_style, spaceAfter=0)),
    Paragraph("<b>Honneur - Fraternité - Justice</b>", 
              ParagraphStyle(name="RightFrench2", parent=centered_style, spaceAfter=3)),

    Spacer(1, 6),  # Espace plus petit qu'avant

    format_arabic("Nouakchott, le_________________\n انواكشوط، في"),

    Paragraph(
        "<b>N°</b> _________" + format_arabic("<b>الرقم</b>"),
        ParagraphStyle(name="MixedLine2", parent=french_style, alignment=TA_CENTER, spaceAfter=0)
    ),
]


    # Texte mixte avec formatage correct de l'arabe
    chef_dept_text = format_arabic("Chef de Département \n    رئيس القطاع")
    admin_financier_text = format_arabic("Administratif et Financier \n    الإداري والمالي</b>")

    left_content = [
        Paragraph(format_arabic("<b>وزارة الصيد والبنى التحتية البحرية والمينائية</b>"), 
                ParagraphStyle(name="LeftArabic", parent=arabic_style, alignment=TA_CENTER)),
        Paragraph("<b>Ministère de la Pêche, des Infrastructures Maritimes et Portuaires</b>", 
                ParagraphStyle(name="LeftFrench", parent=centered_style)),
        Paragraph(format_arabic("<b>سوق السمك بانواكشوط</b>"), 
                ParagraphStyle(name="LeftArabic2", parent=arabic_style, alignment=TA_CENTER)),
        Paragraph("<b>Marché au Poisson de Nouakchott</b>", 
                ParagraphStyle(name="LeftFrench2", parent=centered_style)),
        Spacer(1, 12),
        
        # ✅ Paragraphs corrigés
        Paragraph(chef_dept_text, ParagraphStyle(name="MixedLineChef", parent=french_style, alignment=TA_CENTER)),
        Paragraph(admin_financier_text, ParagraphStyle(name="MixedLineAdmin", parent=french_style, alignment=TA_CENTER)),



    ]
    signature_text = format_arabic("Nouakchott, le_________________\n انواكشوط، في")
    elements.append(Paragraph(signature_text, mixed_style))

    # Construction du header avec logo au centre
    header_table = Table([
        [
            Table([[item] for item in left_content], colWidths=[250]),
            logo,
            Table([[item] for item in right_content], colWidths=[250])
        ]
    ], colWidths=[250, 100, 250])

    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))

    elements.append(header_table)
    elements.append(Spacer(1, 24))

    # Titre de l'invitation
    elements.append(Paragraph(f"<b>INVITATION N°: {invitation.id}  Date de création : {invitation.created_at.strftime('%d/%m/%Y')}</b>", 
                            ParagraphStyle(name="TitleStyle", parent=french_style, alignment=TA_CENTER)))
    elements.append(Paragraph(f"<b>Invitation à Proposer une Offre</b>", 
                            ParagraphStyle(name="DateStyle", parent=french_style, alignment=TA_CENTER)))
    elements.append(Spacer(1, 24))

    # Tableau des besoins
    data = [
        ["Quantité", "Désignation des articles", "Spécifications"]
    ]

    for assoc in associations:
        fiche = assoc.fiche_besoin
        for besoin in fiche.besoins.all():
            data.append([
                str(besoin.quantite),
                besoin.designation.nom if besoin.designation else "N/A",
                ""  # Spécification vide
            ])

    table = Table(data, colWidths=[60, 300, 120], repeatRows=1)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#3498db")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
    ]))

    elements.append(table)
    elements.append(Spacer(1, 20))
    
    # Informations supplémentaires
    elements.append(Paragraph(f"<b>Valeur de l'offre :</b> {invitation.val_offre} DA", french_style))
    elements.append(Paragraph(f"<b>Délai de livraison :</b> {invitation.delai_offre} jours", french_style))
    elements.append(Spacer(1, 30))

    signature_text = format_arabic("Nouakchott, le_________________\n انواكشوط، في")
    elements.append(Paragraph(signature_text, mixed_style))


    # Construction du PDF
    doc.build(elements)
    pdf = buffer.getvalue()
    buffer.close()

    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="invitation_{invitation.id}.pdf"'
    return response