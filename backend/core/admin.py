from django.contrib import admin

# Register your models here.
from core.models import *

admin.site.register(Worker)
admin.site.register(Patient)
admin.site.register(Departure)
admin.site.register(Presence)
admin.site.register(DonateBlood)
admin.site.register(Sample)
admin.site.register(Transfusion)
admin.site.register(BloodType)