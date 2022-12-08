format:
	poetry run isort .
	poetry run black .
lint:
	poetry run flake8 .
start:
	poetry run python -m etl
run-jobs:
	poetry run python etl/jobs/epoch.py
	poetry run python etl/jobs/markets.py
	poetry run python etl/jobs/news.py
	poetry run python etl/jobs/nfts.py
	poetry run python etl/jobs/stats.py
	poetry run python etl/jobs/supply.py
	poetry run python etl/jobs/tokens.py
	poetry run python etl/jobs/tvl.py
