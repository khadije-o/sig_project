# from rest_framework import viewsets
# from rest_framework.permissions import IsAuthenticated
# from .models import BonCommande
# from .serializers import BonCommandeSerializer

# class BonCommandeViewSet(viewsets.ModelViewSet):
#     queryset = BonCommande.objects.all().order_by('-date_bon')
#     serializer_class = BonCommandeSerializer
    


from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db import IntegrityError
from .models import BonCommande
from .serializers import BonCommandeSerializer
from rest_framework.permissions import IsAuthenticated

class BonCommandeViewSet(viewsets.ModelViewSet):
    queryset = BonCommande.objects.all().order_by('-date_bon')
    serializer_class = BonCommandeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # filtre les bons de commande dont le devis a été créé par cet utilisateur
        return BonCommande.objects.filter(devis__created_by=user)


    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"detail": "Un bon de commande existe déjà pour ce devis."},
                status=status.HTTP_400_BAD_REQUEST
            )





# from django.http import HttpResponse
# from reportlab.lib.pagesizes import A4
# from reportlab.pdfgen import canvas
# from reportlab.platypus import Table, TableStyle, Paragraph
# from reportlab.lib import colors
# from reportlab.lib.units import cm
# from reportlab.lib.styles import ParagraphStyle
# from .models import BonCommande

# def boncommande_pdf(request, pk):
#     bon = BonCommande.objects.select_related('devis__fournisseur').get(pk=pk)
#     devis = bon.devis
#     fournisseur = devis.fournisseur

#     response = HttpResponse(content_type='application/pdf')
#     response['Content-Disposition'] = f'attachment; filename="boncommande_{bon.numero_bon}.pdf"'

#     p = canvas.Canvas(response, pagesize=A4)
#     width, height = A4

#     x_left = 50
#     y = height - 50

#     # Titre
#     p.setFont("Helvetica-Bold", 18)
#     p.drawString(x_left, y, "BON DE COMMANDE")
#     y -= 30

#     # Numéro et Date
#     p.setFont("Helvetica", 12)
#     p.drawString(x_left, y, f"N° : {bon.numero_bon}")
#     p.drawRightString(width - x_left, y, f"Date : {bon.date_bon.strftime('%d/%m/%Y')}")
#     y -= 40

#     # Coordonnées fournisseur
#     p.setFont("Helvetica-Bold", 14)
#     p.drawString(x_left, y, "Coordonnées du fournisseur :")
#     y -= 20

#     p.setFont("Helvetica", 12)
#     p.drawString(x_left, y, f"Nom de l’entreprise : {fournisseur.nom_entreprise}")
#     y -= 18
#     adresse = getattr(fournisseur, "adresse", "N/A")
#     p.drawString(x_left, y, f"Adresse : {adresse}")
#     y -= 18
#     p.drawString(x_left, y, f"NIF : {fournisseur.nif}")
#     y -= 18
#     p.drawString(x_left, y, f"Téléphone : {fournisseur.telephone}")
#     y -= 18
#     p.drawString(x_left, y, f"Email : {fournisseur.email}")
#     y -= 30

#     # Détails commande
#     p.setFont("Helvetica-Bold", 14)
#     p.drawString(x_left, y, "Détails de la commande :")
#     y -= 20

#     # Style pour les paragraphes (description)
#     style_description = ParagraphStyle(
#         name='WrapStyle',
#         fontName='Helvetica',
#         fontSize=10,
#         leading=12,
#     )

#     # Préparer les données du tableau
#     data = [["Items", "Description du produit service", "Quantité", "Prix unitaire HT (MRU)", "Total HT (MRU)"]]
#     lignes = devis.lignes.all()
#     for idx, ligne in enumerate(lignes, start=1):
#         description = Paragraph(ligne.designation.nom, style_description)
#         data.append([
#             str(idx),
#             description,
#             str(ligne.quantite),
#             f"{ligne.prix_unitaire:,.0f}".replace(",", " "),
#             f"{ligne.prix_total:,.0f}".replace(",", " "),
#         ])

#     # Largeurs des colonnes
#     col_widths = [2*cm, 7*cm, 2*cm, 4*cm, 4*cm]

#     table = Table(data, colWidths=col_widths)
#     table.setStyle(TableStyle([
#         ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#67AE6E")),
#         ('TEXTCOLOR', (0,0), (-1,0), colors.white),
#         ('ALIGN', (0,0), (-1,-1), 'CENTER'),
#         ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
#         ('FONTSIZE', (0,0), (-1,0), 10),
#         ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
#         ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
#         ('ALIGN', (1,1), (1,-1), 'LEFT'),  # Align description à gauche
#     ]))

#     # Calculer position verticale pour la table
#     table_height = 20 * len(data)
#     y_table = y - table_height
#     table.wrapOn(p, width, height)
#     table.drawOn(p, x_left, y_table)

#     y = y_table - 40

#     # Totaux
#     p.setFont("Helvetica-Bold", 12)
#     p.drawRightString(width - x_left, y, f"Sous-total HT : {devis.total_ht:,.0f} MRU")
#     y -= 18
#     p.drawRightString(width - x_left, y, f"TVA ({devis.tva}%)     : {devis.montant_tva:,.0f} MRU")
#     y -= 18
#     p.drawRightString(width - x_left, y, f"Total TTC     : {devis.total_ttc:,.0f} MRU")
#     y -= 50

#     # Signature
#     p.setFont("Helvetica", 12)
#     p.drawString(x_left, y, "Signature du Directeur Général")

#     p.showPage()
#     p.save()
#     return response



from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.platypus import Table, TableStyle, Paragraph
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from .models import BonCommande

def boncommande_pdf(request, pk):
    bon = BonCommande.objects.select_related('devis__fournisseur').get(pk=pk)
    devis = bon.devis
    fournisseur = devis.fournisseur

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="boncommande_{bon.numero_bon}.pdf"'

    p = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    x_left = 50
    top_margin = height - 100  # plus de marge en haut
    y = top_margin

    # Titre centré
    p.setFont("Helvetica-Bold", 20)
    title = "BON DE COMMANDE"
    title_width = p.stringWidth(title, "Helvetica-Bold", 20)
    p.drawString((width - title_width) / 2, y, title)
    y -= 50  # espace après le titre

    # Numéro (à droite)
    p.setFont("Helvetica", 12)
    p.drawRightString(width - x_left, y, f"N° : {bon.numero_bon}")
    y -= 18  # petit espace entre le numéro et la date

    # Date (juste en dessous)
    p.drawRightString(width - x_left, y, f"Date : {bon.date_bon.strftime('%d/%m/%Y')}")
    y -= 40  # espace après date



    # Coordonnées du fournisseur
    p.setFont("Helvetica-Bold", 14)
    p.drawString(x_left, y, "Coordonnées du fournisseur :")
    y -= 20

    p.setFont("Helvetica", 12)

    # Définir un décalage fixe pour la valeur (ex: 160 points plus loin)
    label_x = x_left
    value_x = x_left + 250

    coordonnees = [
        ("Nom de l’entreprise :", fournisseur.nom_entreprise),
        ("Adresse :", getattr(fournisseur, "adresse", "N/A")),
        ("NIF :", fournisseur.nif),
        ("Téléphone :", fournisseur.telephone),
        ("Email :", fournisseur.email),
    ]

    for label, value in coordonnees:
        p.drawString(label_x, y, label)
        p.drawString(value_x, y, str(value))
        y -= 10

        y -= 10

    y -= 40

    # Détails de la commande
    p.setFont("Helvetica-Bold", 14)
    p.drawString(x_left, y, "Détails de la commande :")
    y -= 40

    # Style de description avec retour à la ligne
    style_description = ParagraphStyle(
        name='WrapStyle',
        fontName='Helvetica',
        fontSize=10,
        leading=12,
    )

    # Préparer les données
    data = [["Items", "Description du produit service", "Quantité", "Prix unitaire\n HT (MRU)", "Total HT \n(MRU)"]]
    lignes = devis.lignes.all()
    for idx, ligne in enumerate(lignes, start=1):
        description = Paragraph(ligne.designation.nom, style_description)
        data.append([
            str(idx),
            description,
            str(ligne.quantite),
            f"{ligne.prix_unitaire:,.0f}".replace(",", " "),
            f"{ligne.prix_total:,.0f}".replace(",", " "),
        ])

    col_widths = [2*cm, 7*cm, 2*cm, 4*cm, 4*cm]
    total_table_width = sum(col_widths)
    x_table = (width - total_table_width) / 2

    table = Table(data, colWidths=col_widths)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#67AE6E")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 10),
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (1,1), (1,-1), 'LEFT'),
    ]))

    table_height = 20 * len(data)
    y_table = y - table_height
    table.wrapOn(p, width, height)
    table.drawOn(p, x_table, y_table)


    y = y_table - 40

    # Totaux à gauche
    p.setFont("Helvetica-Bold", 12)
    totaux_x = x_left  # position à gauche
    p.drawString(totaux_x, y, f"Sous-total HT : {devis.total_ht:,.0f} MRU")
    y -= 18
    p.drawString(totaux_x, y, f"TVA ({devis.tva}%)     : {devis.montant_tva:,.0f} MRU")
    y -= 18
    p.drawString(totaux_x, y, f"Total TTC     : {devis.total_ttc:,.0f} MRU")
    y -= 50


    # Signature
    p.setFont("Helvetica", 12)
    p.drawRightString(width - x_left, y, "Signature du Directeur Général")

    p.showPage()
    p.save()
    return response
