from django.db import models
from django.utils import timezone


class Todo(models.Model):
    details = models.TextField()
    created_date = models.DateTimeField(default=timezone.now)
    due_date = models.DateTimeField()

    def publish(self):
        self.created_date = timezone.now()
        self.save()

    def __str__(self):
        return self.details
