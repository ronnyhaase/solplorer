from apscheduler.schedulers.blocking import BlockingScheduler

from .jobs.epoch import update_epoch
from .jobs.markets import update_markets
from .jobs.stats import update_stats


class Runner:
    @staticmethod
    def run():
        scheduler = BlockingScheduler(
            {
                "apscheduler.timezone": "UTC",
                "apscheduler.job_defaults.max_instances": "1",
            }
        )
        scheduler.add_job(update_stats, "interval", seconds=15)
        scheduler.add_job(update_epoch, "interval", minutes=10)
        scheduler.add_job(update_markets, "interval", minutes=15)

        try:
            scheduler.start()
        except (KeyboardInterrupt, SystemExit):
            pass
