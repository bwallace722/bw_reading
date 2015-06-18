# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('speed_reading', '0002_passage_passage_title'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='passage',
            name='passage_title',
        ),
    ]
