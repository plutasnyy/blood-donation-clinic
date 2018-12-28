import json

from django.db import connection
from django.http import JsonResponse, HttpResponse

from core.models import BloodType


def resources(request):
    response = list()
    with connection.cursor() as cursor:
        cursor.callproc('getavailableblood')
        result = cursor.fetchall()
        for (quantity, id) in result:
            blood = BloodType.objects.get(pk=id)
            blood_name = '{} Rh{}'.format(blood.blood, blood.rh)
            response.append(dict({
                'id': id,
                'quantity': quantity,
                'blood_name': blood_name
            }))
    return HttpResponse(json.dumps(response))
