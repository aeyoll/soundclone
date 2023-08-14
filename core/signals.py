import json
import os
from os.path import splitext

import magic
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from pydub import AudioSegment

from core.models import Song, Version
from core.utils import run_command

# Map mime types to extensions
mime_extension_map = {
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/midi': 'mid',
    'audio/ogg': 'ogg',
    'audio/x-ms-wma': 'wma',
    'audio/x-flac': 'flac',
    'audio/aac': 'aac',
    'audio/x-aiff': 'aif',
}


def scale_json(file_content):
    json_content = json.loads(file_content)
    data = json_content["data"]
    channels = json_content["channels"]
    digits = 2

    max_val = float(max(data))
    new_data = []

    for x in data:
        new_data.append(round(x / max_val, digits))

    # audiowaveform is generating interleaved peak data when using the
    # --split-channels flag, so we have to deinterleave it
    if channels > 1:
        deinterleaved_data = deinterleave(new_data, channels)
        json_content["data"] = deinterleaved_data
    else:
        json_content["data"] = new_data

    return json_content


def deinterleave(data, channel_count):
    # first step is to separate the values for each audio channel and min/max
    # value pair, hence we get an array with channel_count * 2 arrays
    deinterleaved = [data[idx::channel_count * 2] for idx in range(channel_count * 2)]
    new_data = []

    # this second step combines each min and max value again in one array,
    # so we have one array for each channel
    for ch in range(channel_count):
        idx1 = 2 * ch
        idx2 = 2 * ch + 1
        ch_data = [None] * (len(deinterleaved[idx1]) + len(deinterleaved[idx2]))
        ch_data[::2] = deinterleaved[idx1]
        ch_data[1::2] = deinterleaved[idx2]
        new_data.append(ch_data)
    return new_data


def generate_mp3(instance: Version | Song):
    """
    Generate a mp3 from a file.

    :param instance: either a version or a song
    """
    original_path = instance.file.path
    preview_file_name = f'{os.path.basename(original_path)}.mp3'

    audio = AudioSegment.from_file(original_path)

    with NamedTemporaryFile() as f:
        audio.export(f, format='mp3', bitrate='320k')
        file = File(f)
        instance.preview_file.save(preview_file_name, file, save=True)


@receiver(pre_save, sender=Version)
@receiver(pre_save, sender=Song)
def add_missing_extension(sender, instance, **kwargs):
    if not instance.file:
        return

    # Get the mimetype using python-magic
    mime = magic.Magic(mime=True)
    mime_type = mime.from_buffer(instance.file.read())

    # Extract extension from mimetype or default to 'txt'
    extension = mime_extension_map.get(mime_type, 'txt')

    # Move the file pointer back to the start of the file
    instance.file.seek(0)

    # Get the original file name without extension
    filename, _ = splitext(instance.file.name)

    # Create a new file name with the determined extension if needed
    if not filename.endswith(f'.{extension}'):
        new_filename = f'{filename}.{extension}'

        # Set the new file name
        instance.file.name = new_filename


@receiver(post_save, sender=Version)
@receiver(post_save, sender=Song)
def generate_waveform(sender, instance, created, **kwargs):
    if instance.file and not instance.preview_file:
        generate_mp3(instance)

    if created:
        command_to_run = f'/usr/local/bin/audiowaveform -i {instance.preview_file.path} --pixels-per-second 5 --bits 8 --output-format=json -q'
        output = run_command(command_to_run)
        instance.waveform = scale_json(output)
        instance.save()
