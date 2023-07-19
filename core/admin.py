from django.contrib import admin

from core.models import Playlist, Song, Version

admin.register(Playlist)
admin.register(Version)
admin.register(Song)
