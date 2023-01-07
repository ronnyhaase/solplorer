import logging
import os

from dotenv import load_dotenv
from logtail import LogtailHandler

from .runner import Runner


def main():
    log_level = logging.DEBUG
    log_handler = logging.StreamHandler()
    if os.environ.get("PYTHON_ENV") == "production":
        log_level = logging.INFO
        log_handler = LogtailHandler(source_token=os.environ["LOGTAIL_TOKEN"])

        logger = logging.getLogger("solplorer.etl")
        logger.handlers = []
        logger.setLevel(log_level)
        logger.addHandler(log_handler)
    else:
        logging.basicConfig(
            format="%(asctime)s %(name)s.%(levelname)s - %(message)s", level=log_level
        )
    Runner.create(loglevel=logging.INFO, loghandler=log_handler).run()


if __name__ == "__main__":
    load_dotenv()
    main()
