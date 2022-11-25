import logging

from apscheduler.schedulers.blocking import BlockingScheduler

from .jobs.epoch import update_epoch
from .jobs.markets import update_markets
from .jobs.news import update_news
from .jobs.stats import update_stats
from .jobs.supply import update_supply
from .jobs.tokens import update_tokens
from .jobs.tvl import update_tvl


class Runner:
    def __init__(self, loglevel=logging.WARN):
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(loglevel)

        self.scheduler = BlockingScheduler(
            {
                "apscheduler.timezone": "UTC",
                "apscheduler.job_defaults.max_instances": "1",
            }
        )

    @staticmethod
    def create(*args, **kwargs):
        return Runner(*args, **kwargs)

    def run(self):
        self.scheduler.add_job(update_stats, "interval", seconds=15)
        self.scheduler.add_job(update_epoch, "interval", minutes=10)
        self.scheduler.add_job(update_markets, "interval", minutes=15)
        self.scheduler.add_job(update_news, "interval", minutes=60)
        self.scheduler.add_job(update_supply, "cron", hour=1, minute=0)
        self.scheduler.add_job(update_tokens, "cron", hour=1, minute=5)
        self.scheduler.add_job(update_tvl, "cron", hour=1, minute=10)

        try:
            self.scheduler.start()
        except (KeyboardInterrupt, SystemExit):
            self.logger.warn("Received exit signal, terminating.")
