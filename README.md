# Soundclone

A self-hosted soundcloud clone.

Requirements
---

- poetry
- pnpm
- python 3.10+
- audiowaveform
- docker and docker compose (for easier development)

Installation
---

```shell
pnpm i
poetry install
```

Running
---

```shell
docker compose up
poetry run ./manage.py runserver
pnpm run dev  # Dev server available: http://127.0.0.1:5173/
```
