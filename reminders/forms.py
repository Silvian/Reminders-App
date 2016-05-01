from django import forms
from .models import Todo


class TodoForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(TodoForm, self).__init__(*args, **kwargs)

    class Meta:
        model = Todo
        fields = ('details', 'due_date',)
