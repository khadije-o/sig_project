# from rest_framework import serializers
# from .models import Besoin

# class BesoinSerializer(serializers.ModelSerializer):
#     designation = serializers.StringRelatedField() 
    
#     class Meta:
#         model = Besoin
#         fields = '__all__'


from rest_framework import serializers

from designation.serializers import DesignationSerializer
from designation.models import Designation
from .models import Besoin

class BesoinSerializer(serializers.ModelSerializer):
    designation = DesignationSerializer(read_only=True)
    designation_id = serializers.PrimaryKeyRelatedField(
        queryset=Designation.objects.all(), source='designation', write_only=True
    )

    class Meta:
        model = Besoin
        fields = ['id', 'quantite', 'observation', 'designation', 'designation_id']