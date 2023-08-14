from os.path import splitext

import magic
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from core.audio import generate_preview, mime_extension_map, scale_json
from core.models import Song, Version
from core.utils import run_command


@receiver(pre_save, sender=Version)
@receiver(pre_save, sender=Song)
def add_missing_extension(sender, instance, **kwargs):
    """Add an extension to a file if it's missing."""
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
def post_process_audio(sender, instance, created, **kwargs):
    """Generate a preview file and a waveform."""
    if instance.file and not instance.preview_file:
        generate_preview(instance)

    if created:
        command_to_run = f'/usr/local/bin/audiowaveform -i {instance.preview_file.path} --pixels-per-second 5 --bits 8 --output-format=json -q'
        output = run_command(command_to_run)
        instance.waveform = scale_json(output)
        instance.save()
