from django.conf.urls import include, url

from . import views

urlpatterns = [
    # Examples:
    # url(r'^$', 'bw_reading.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^index/$', views.index, name="index"),
    url(r'^login/$', views.login, name="login"),
    url(r'^logout/$', views.logout, name="logout"),
    url(r'^login_attempt/$', views.login_attempt, name="login_attempt"),
    url(r'^(?P<passage_id>[0-9]+)/practice/$', views.practice, name="practice"),
    url(r'^save_attempt/$',
        views.save_attempt, name="save_attempt"),
    url(r'^attempt_history/$', views.attempt_history, name="attempt_history"),
]
