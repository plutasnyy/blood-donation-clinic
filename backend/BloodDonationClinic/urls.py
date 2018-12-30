"""BloodDonationClinic URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import include
from rest_framework import routers

from api.views import *
from core.views import resources

router = routers.DefaultRouter()
router.register(r'workers', WorkerViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'departures', DepartureViewSet)
router.register(r'presences', PresenceViewSet)
router.register(r'donates', DonateBloodViewSet)
router.register(r'samples', SampleViewSet)
router.register(r'transfusions', TransfusionViewSet)
router.register(r'blood', BloodTypeViewSet)

urlpatterns = [
    url(r'api/', include(router.urls)),
    url(r'api/resources', resources, name='resources'),
    url(r'admin/', admin.site.urls),
]

