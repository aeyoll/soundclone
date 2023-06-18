from django.db import models
from django_extensions.db.fields import AutoSlugField
from django_extensions.db.models import TimeStampedModel
from ordered_model.models import OrderedModel


class Album(TimeStampedModel, models.Model):
    """The model for an Album."""

    name = models.CharField('Name', max_length=128)
    slug = AutoSlugField(populate_from=['name'])


class Song(TimeStampedModel, OrderedModel):
    """The model for a song."""

    name = models.CharField('Name', max_length=128)
    album = models.ForeignKey(
        Album,
        related_name='songs',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    slug = AutoSlugField(populate_from=['name'])
    order_with_respect_to = 'album'

    class Meta:
        ordering = ('album', 'order')


class Version(TimeStampedModel, models.Model):
    """The model for a version."""

    name = models.CharField('Name', max_length=128)
    song = models.ForeignKey(Song, related_name='versions', on_delete=models.CASCADE)
    file = models.FileField(upload_to='songs/%Y/%m/%d')
    slug = AutoSlugField(populate_from=['name'])
