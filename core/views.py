from rest_framework import viewsets

from core.models import Album, Song, Version
from core.serializers import AlbumSerializer, SongSerializer, VersionSerializer


class AlbumViewSet(viewsets.ModelViewSet):
    """The viewset for albums."""

    queryset = Album.objects.all()
    serializer_class = AlbumSerializer


class SongViewSet(viewsets.ModelViewSet):
    """The viewset for songs."""

    queryset = Song.objects.all()
    serializer_class = SongSerializer


class VersionViewSet(viewsets.ModelViewSet):
    """The viewset for versions."""

    queryset = Version.objects.all()
    serializer_class = VersionSerializer
