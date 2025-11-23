from rest_framework import serializers
from .models import D202


#these bad boys can take a json request, validate the fields, data types and turn it into a model instance.
#they also turn model instances into json as a response.
class MeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = D202
        fields = ['id', 'date', 'start_time', 'end_time', 'usage', 'cost']
