# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('speed_reading', '0004_passage_passage_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='attempt',
            name='time_of_occurrence',
            field=models.DateTimeField(default=datetime.datetime(2015, 6, 16, 18, 9, 28, 937774, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
    ]
