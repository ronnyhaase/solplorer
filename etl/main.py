from __future__ import annotations

import os
import subprocess

from apscheduler.schedulers.blocking import BlockingScheduler


def build_node_job(job_name):
    return lambda: subprocess.run(["node", os.getcwd() + "/jobs/src/" + job_name])


def main():
    """
    main
    """
    scheduler = BlockingScheduler(
        {
            "apscheduler.timezone": "UTC",
            "apscheduler.job_defaults.max_instances": "1",
        }
    )

    scheduler.add_job(build_node_job("stats"), "interval", seconds=15)
    scheduler.add_job(build_node_job("epoch"), "interval", minutes=10)
    scheduler.add_job(build_node_job("markets"), "interval", minutes=15)
    scheduler.add_job(build_node_job("news"), "interval", hours=1)
    scheduler.add_job(build_node_job("supply"), "interval", days=1)
    scheduler.add_job(build_node_job("tokens"), "interval", days=1, minutes=5)
    scheduler.add_job(build_node_job("tvl"), "interval", days=1, minutes=10)
    scheduler.add_job(build_node_job("validators"), "interval", days=1, minutes=30)

    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        pass


if __name__ == "__main__":
    main()
