import json
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import secrets
from django.core.cache import cache


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

def data_view(request):
    if request.method == 'OPTIONS':
        return HttpResponse(status=200)

    if request.method == 'GET':
        try:
            token = request.GET.get('token')
            user_id = cache.get(token)
            if user_id is None:
                return JsonResponse({'error': 'Invalid token'}, status=400)
            return JsonResponse({'message': 'Data retrieved successfully', 'user_id': user_id})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)