import subprocess


def run_command(command):
    """
    Run a command in a subprocess.

    :param command:
    :return:
    """
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
