# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-04-24 15:50
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reminders', '0002_auto_20160417_1901'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='todo',
            name='name',
        ),
    ]
