from django.conf.urls import include, url
from django.contrib import admin
import speed_reading

urlpatterns = [
    # Examples:
    # url(r'^$', 'bw_reading.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^speed_reading/',
        include('speed_reading.urls',namespace='speed_reading')),
    url(r'(.*?)', 'speed_reading.views.lost', name='speed_reading_lost')
]
