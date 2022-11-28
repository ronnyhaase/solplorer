import logging

from dotenv import load_dotenv

from .runner import Runner


def main():
    logging.basicConfig(format="%(message)s", level=logging.INFO)
    Runner.create(loglevel=logging.INFO).run()


if __name__ == "__main__":
    load_dotenv()
    main()
