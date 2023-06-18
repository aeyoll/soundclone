from django.contrib import admin

from core.models import Album, Song, Version

admin.register(Album)
admin.register(Version)
admin.register(Song)
