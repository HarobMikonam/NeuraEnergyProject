import json
from django.contrib.auth import authenticate, login
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import secrets
from django.core.cache import cache
from rest_framework import generics
from .models import D202
from .serializers import MeasurementSerializer
from django.db.models.functions import Trim, Coalesce
from django.db.models import Value, CharField, F, DateField
from django.db.models.expressions import Func


# crsf exempt cause we dont have security token implementation, as far as i know, DRF handles this automatically.
@csrf_exempt
def login_view(request):
    if request.method == 'OPTIONS':
        return HttpResponse(status=200)

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)

                token = secrets.token_hex(32)

                cache.set(token, user.id, timeout=3600)  # valid 1 hour

                return JsonResponse({
                    'message': 'Login successful',
                    'user': username,
                    'token': token
                })
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)



# a manual approach would be to query the data with .all() and then pass it to the serializer. Afterwards return the data as a response.
# @api_view(['GET'])
# def get_measurements(request):

#     queryset = D202.objects.all()
#     serializer = MeasurementSerializer(queryset, many=True)
#     return Response(serializer.data, status=200)

# i wouldve used the manual functions with @api_view, but this seems like it automates most of the things for me.
# I suppose one would be better than the other due to more control over the process, but these do the job fine.

class MeasurementList(generics.ListCreateAPIView):
    serializer_class = MeasurementSerializer

    def get_queryset(self):
        qs = D202.objects.all()
        start = self.request.query_params.get('start_date')
        end   = self.request.query_params.get('end_date')

        if start and end:
            qs = qs.filter(date__range=[start, end])
        elif start:
            qs = qs.filter(date__gte=start)
        elif end:
            qs = qs.filter(date__lte=end)

        return qs.order_by('date', 'start_time')

class MeasurementDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = D202.objects.all()
    serializer_class = MeasurementSerializer