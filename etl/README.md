# ETL

## Initialisation / Development

```sh
# Init
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements-dev.txt

# Activate VENV
source .venv/bin/activate

# Leave VENV
deactivate
```

## Helper (with `make`)

```sh
make run      # Run
make lint     # Lint code
make format   # Format code (incl. import sorting)
make tests    # Run tests
make coverage # Print test coverage
```
