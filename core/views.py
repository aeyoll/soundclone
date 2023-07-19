from rest_framework import viewsets

from core.models import Playlist, Song, Version
from core.serializers import PlaylistSerializer, SongSerializer, VersionSerializer


class PlaylistViewSet(viewsets.ModelViewSet):
    """The viewset for playlists."""

    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer


class SongViewSet(viewsets.ModelViewSet):
    """The viewset for songs."""

    queryset = Song.objects.all()
    serializer_class = SongSerializer


class VersionViewSet(viewsets.ModelViewSet):
    """The viewset for versions."""

    queryset = Version.objects.all()
    serializer_class = VersionSerializer
