# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('speed_reading', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='passage',
            name='passage_title',
            field=models.CharField(default=b'', max_length=200),
            preserve_default=True,
        ),
    ]
