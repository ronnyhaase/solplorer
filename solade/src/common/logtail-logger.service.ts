import { LogLevel, Context } from '@logtail/types'
import { Logtail } from '@logtail/node'
import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { isString } from 'lodash';

@Injectable({ scope: Scope.TRANSIENT })
class LogtailLogger implements LoggerService
{
  logger: Logtail;

  constructor() {
    this.logger = new Logtail(process.env.LOGTAIL_TOKEN);
  }

  _log(level: LogLevel, ...params: any[]) {
    let message: string = '<Empty>';
    let context: string = '';
    let extra: Array<any> = [];

    if (params.length < 1) return;

    if (isString(params[0])) message = params[0];
    if (params.length === 2 && isString(params[1])) context = `[${params[1]}] `;

    if (params.length > 2) {
      params.slice(1).map((param, n) => {
        if (n === params.length-2){
          context = isString(param) ? `[${param}] ` : context
        } else {
          extra.push(param);
        }
      })
    }

    if (extra.length) {
      this.logger.log(context + message, level, { extra: extra as unknown as Context })
    } else {
      this.logger.log(context + message, level);
    }
  }

  log(...params: any[]) {
    this._log(LogLevel.Info, ...params);
  }

  debug(...params: any[]): void {
    this._log(LogLevel.Debug, ...params);
  }

  info(...params: any[]): void {
    this._log(LogLevel.Info, ...params);
  }

  warn(...params: any[]): void {
    this._log(LogLevel.Warn, ...params);
  }

  error(...params: any[]): void {
    this._log(LogLevel.Error, ...params);
  }
}

export {
  LogtailLogger,
};
