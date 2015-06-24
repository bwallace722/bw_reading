import json

from django.contrib.auth import (
    authenticate, login as auth_login, logout as auth_logout)
from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt


from .models import Passage, Attempt


@login_required
def index(request):
    """
    This function handles a homepage-ish view.
    """
    passage_list = Passage.objects.all()
    context = {'passage_list': passage_list}
    return render(request, 'speed_reading/index.html', context)

def login(request, context={}):
    return render(request, 'speed_reading/login.html', context)

def logout(request):
    auth_logout(request)
    return login(
        request, context={"error_message" : "You have been logged out."})


def login_attempt(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            auth_login(request, user)
            return HttpResponseRedirect(reverse('speed_reading:index'))
        else:
            return login(
                request, context={"error_message" : "Inactive account."})
    else:
        return login(
            request, context={"error_message" : "Invalid account."})


@login_required
def practice(request, passage_id):
    """
    This handles the app/widget view.
    """
    passage = get_object_or_404(Passage, pk=passage_id)
    context = {'passage' : passage}
    return render(request, 'speed_reading/practice.html', context)


@login_required
@csrf_exempt
def save_attempt(request):
    """
    Handles the ajax call to save an attempt.
    """
    passage_id = int(request.POST.get("passage_id"))
    passage = get_object_or_404(Passage, pk=passage_id)
    user = request.user
    duration = int(request.POST.get("duration"))

    new_attempt = Attempt(passage=passage,
                          user=user,
                          duration_in_milliseconds=duration)
    new_attempt.save()
    return HttpResponse("thanks")

@login_required
@csrf_exempt
def attempt_history(request):
    user = request.user
    passage_id = request.POST.get("passage_id")
    attempts = Attempt.objects.filter(user=user);
    print(attempts)
    data = [[a.words_per_minute for a in attempts], 
            [a.passage.id for a in attempts]];
    print(data)
    return HttpResponse(json.dumps(data));

def lost(request, err):
    return login(
        request, context={
        "error_message" : "That url doesn't exist.  Try logging in?"})