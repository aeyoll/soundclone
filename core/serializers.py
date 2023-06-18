from ordered_model.serializers import OrderedModelSerializer
from rest_framework import serializers

from core.models import Album, Song, Version


class VersionSerializer(serializers.ModelSerializer):
    """The serializer for a Version."""

    class Meta:
        model = Version
        fields = ['id', 'name', 'song']


class SongSerializer(OrderedModelSerializer, serializers.ModelSerializer):
    """The serializer for a Song."""

    versions = VersionSerializer(many=True, read_only=True)

    class Meta:
        model = Song
        fields = ['id', 'name', 'order', 'versions']


class AlbumSerializer(serializers.ModelSerializer):
    """The serializer for an Album."""

    songs = SongSerializer(many=True, read_only=True)

    class Meta:
        model = Album
        fields = ['id', 'name', 'songs']

