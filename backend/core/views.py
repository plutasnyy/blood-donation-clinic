from django.db import connection
from django.http import JsonResponse

from core.models import BloodType


def resources(request):
    response_data = dict()
    with connection.cursor() as cursor:
        cursor.callproc('getavailableblood')
        result = cursor.fetchall()
        for (quantity, id) in result:
            blood = BloodType.objects.get(pk=id)
            blood_name = '{} Rh{}'.format(blood.blood, blood.rh)
            response_data[id] = {
                'quantity': quantity,
                'blood_name': blood_name
            }
    return JsonResponse(response_data)
