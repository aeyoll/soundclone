from ordered_model.serializers import OrderedModelSerializer
from rest_framework import serializers

from core.models import Playlist, Song, Version


class VersionSerializer(serializers.ModelSerializer):
    """The serializer for a Version."""

    class Meta:
        model = Version
        fields = ['id', 'name', 'file', 'slug', 'song', 'created', 'modified']


class SongSerializer(OrderedModelSerializer, serializers.ModelSerializer):
    """The serializer for a Song."""

    versions = VersionSerializer(many=True, read_only=True)

    class Meta:
        model = Song
        fields = ['id', 'name', 'file', 'slug', 'waveform', 'playlist', 'versions', 'created', 'modified']


class PlaylistSerializer(serializers.ModelSerializer):
    """The serializer for a Playlist."""

    songs = SongSerializer(many=True, read_only=True)

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'songs', 'created', 'modified']
