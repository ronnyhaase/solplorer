FROM python:3.10.8-slim@sha256:14f47505ae036cc75cdefbfd4c734682c0411b4109bc0419db0f17f8a8624f66 as base
RUN apt-get update
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.2.2 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1 \
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/pysetup/.venv"
ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

FROM base as builder
RUN apt-get install --no-install-recommends -y \
    curl \
    build-essential
RUN curl -sSL https://install.python-poetry.org | python -
WORKDIR $PYSETUP_PATH
COPY poetry.lock pyproject.toml ./
RUN poetry install --no-dev

FROM base
RUN apt-get install --no-install-recommends dumb-init
RUN groupadd -g 999 python && \
    useradd -r -u 999 -g python python
RUN mkdir /usr/app && chown python:python /usr/app
WORKDIR /usr/app
COPY --chown=python:python --from=builder $PYSETUP_PATH $PYSETUP_PATH
COPY --chown=python:python ./ /usr/app
CMD ["dumb-init", "python", "-m", "etl"]
