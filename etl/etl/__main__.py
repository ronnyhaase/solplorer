from dotenv import load_dotenv

from .runner import Runner


def main():
    Runner.run()


if __name__ == "__main__":
    load_dotenv()
    main()
