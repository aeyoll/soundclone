from django.db import models
from django_extensions.db.fields import AutoSlugField
from django_extensions.db.models import TimeStampedModel
from ordered_model.models import OrderedModel


class Playlist(TimeStampedModel, models.Model):
    """The model for a Playlist."""

    name = models.CharField('Name', max_length=128)
    slug = AutoSlugField(populate_from=['name'])


class Song(TimeStampedModel, OrderedModel):
    """The model for a song."""

    name = models.CharField('Name', max_length=128)
    playlist = models.ForeignKey(
        Playlist,
        related_name='songs',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    file = models.FileField(upload_to='songs/original/%Y/%m/%d')
    slug = AutoSlugField(populate_from=['name'])
    order_with_respect_to = 'playlist'

    class Meta:
        ordering = ('playlist', 'order')


class Version(TimeStampedModel, models.Model):
    """The model for a version."""

    name = models.CharField('Name', max_length=128)
    song = models.ForeignKey(Song, related_name='versions', on_delete=models.CASCADE)
    file = models.FileField(upload_to='songs/versions/%Y/%m/%d')
    slug = AutoSlugField(populate_from=['name'])
