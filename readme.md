# Dioma

## Python Setup (macOS)

This project uses a local virtual environment so package installs do not fail with Homebrew's `externally-managed-environment` error.

### 1) Create virtual environment

```bash
python3 -m venv .venv
```

### 2) Activate virtual environment

```bash
source .venv/bin/activate
```

### 3) Upgrade pip

```bash
python -m pip install --upgrade pip
```

### 4) Install dependencies

```bash
python -m pip install langgraph langgraph-supervisor langchain-openai fastapi uvicorn python-dotenv
```

### 5) Install any new package later

```bash
python -m pip install <package-name>
```

## Notes

- Always activate `.venv` before running install commands.
- Use `python -m pip ...` instead of `pip` to ensure packages go into the active environment.
