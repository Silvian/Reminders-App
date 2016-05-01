from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.utils import timezone
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from models import Todo
from forms import TodoForm
import json

success_response = {'success': True}


def display_login(request):
    response = {}
    if request.GET.get('logout', False):
        response['logout'] = True
        response['msg'] = "You've been logged out successfully"

    return render(request, "reminders/login.html", response)


def authenticate_user(request):
    if request.method == 'POST':
        user = authenticate(username=request.POST['username'], password=request.POST['password'])
        response = {}
        if user is not None:
            # the password verified for the user
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect('/')
            else:
                response['msg'] = "This account has been disabled"
                return render(request, "reminders/login.html", response)
        else:
            # the authentication system was unable to verify the username and password
            response['msg'] = "The username or password are incorrect"
            return render(request, "reminders/login.html", response)


@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect('/login?logout=true')


@login_required
def display_index(request):
    return render(request, "reminders/index.html")


@login_required
def get_reminders(request):
    if request.is_ajax:
        tasks = Todo.objects.filter(
            created_date__lte=timezone.now()
        ).order_by('-created_date')
    data = serializers.serialize("json", tasks)
    return HttpResponse(data, content_type='application/json')


@login_required
def add_reminder(request):
    if request.method == 'POST':
        form = TodoForm(request.POST)
        form.save()
        return HttpResponse(json.dumps(success_response), content_type='application/json')


@login_required
def remove_reminder(request):
    if request.method == 'POST':
        Todo.objects.get(pk=request.POST['id']).delete()
        return HttpResponse(json.dumps(success_response), content_type='application/json')
