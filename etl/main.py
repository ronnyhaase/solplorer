from __future__ import annotations

import json
import logging
import os
import subprocess

from apscheduler.schedulers.blocking import BlockingScheduler


def log(message, level=logging.INFO, error=None):
    output = {
        "level": logging.getLevelName(level),
        "message": message,
    }
    if error:
        output["error"] = error
    logger.log(level=level, msg=json.dumps(output, ensure_ascii=False))


def log_error(message, error):
    log(level=logging.ERROR, message=message, error=error)


def log_warning(message):
    log(level=logging.WARNING, message=message)


def run_node_job(job_name):
    result = subprocess.run(
        ["node", os.getcwd() + "/jobs/src/" + job_name],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        encoding="utf-8",
    )
    if result.returncode == 0:
        log('Job "{0}" completed.'.format(job_name))
    else:
        log_error('Job "{0}" failed.'.format(job_name), result.stdout)


def build_node_job(job_name):
    return lambda: run_node_job(job_name)


def main():
    logging.basicConfig(format="%(message)s", level=logging.INFO)
    logging.getLogger("apscheduler").setLevel(logging.WARN)
    global logger
    logger = logging.getLogger(__name__)

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
        log("Scheduler initialized and started")
    except (KeyboardInterrupt, SystemExit):
        log_warning("Process interrupted")
        pass


if __name__ == "__main__":
    main()
