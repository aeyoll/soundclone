import json
import subprocess

from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import Song


def run_command(command):
    try:
        # Run the command and capture its output
        result = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            shell=True
        )

        # Check if the command was successful (exit code 0)
        if result.returncode == 0:
            # Captured output will be in result.stdout
            return result.stdout
        else:
            # If there was an error, captured error messages will be in result.stderr
            return f"Error occurred: {result.stderr}"
    except FileNotFoundError:
        return "Command not found or executable not in the system path."


def scale_json(file_content):
    json_content = json.loads(file_content)
    data = json_content["data"]
    channels = json_content["channels"]
    digits = 2

    max_val = float(max(data))
    new_data = []
    for x in data:
        new_data.append(round(x / max_val, digits))
    # audiowaveform is generating interleaved peak data when using the --split-channels flag, so we have to deinterleave it
    if channels > 1:
        deinterleaved_data = deinterleave(new_data, channels)
        json_content["data"] = deinterleaved_data
    else:
        json_content["data"] = new_data

    return json_content


def deinterleave(data, channelCount):
    # first step is to separate the values for each audio channel and min/max value pair, hence we get an array with channelCount * 2 arrays
    deinterleaved = [data[idx::channelCount * 2] for idx in range(channelCount * 2)]
    new_data = []

    # this second step combines each min and max value again in one array so we have one array for each channel
    for ch in range(channelCount):
        idx1 = 2 * ch
        idx2 = 2 * ch + 1
        ch_data = [None] * (len(deinterleaved[idx1]) + len(deinterleaved[idx2]))
        ch_data[::2] = deinterleaved[idx1]
        ch_data[1::2] = deinterleaved[idx2]
        new_data.append(ch_data)
    return new_data


@receiver(post_save, sender=Song)
def generate_waveform(sender, instance, created, **kwargs):
    if created:
        command_to_run = f'/usr/local/bin/audiowaveform -i {instance.file.path} --pixels-per-second 5 --bits 8 --output-format=json -q'
        output = run_command(command_to_run)
        instance.waveform = scale_json(output)
        instance.save()
