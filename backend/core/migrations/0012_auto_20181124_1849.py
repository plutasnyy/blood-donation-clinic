# Generated by Django 2.1.2 on 2018-11-24 18:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_auto_20181124_1846'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sample',
            name='blood',
            field=models.CharField(choices=[('ARh+', 'ARh+'), ('ARh-', 'ARh-'), ('BRh+', 'BRh+'), ('BRh-', 'BRh-'), ('ABRh+', 'ABRh+'), ('ABRh-', 'ABRh-'), ('0R+', '0R+'), ('ORH-', 'ORH-')], max_length=4),
        ),
    ]