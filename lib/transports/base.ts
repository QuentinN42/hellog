import { Formatter } from '../entities/formatters';
import { PreparedMessage } from '../entities/prepared-messages';
import { addLevel } from '../formats/add-level';
import { colorize } from '../formats/colorize';
import { addTimestamp } from '../formats/timestamp';

export interface BaseOptions {
  formatters?: Formatter[];
}

export abstract class BaseTransport<
  T extends PreparedMessage = PreparedMessage
> {
  formatters: Formatter[] = [addLevel(), addTimestamp, colorize];

  constructor(opts?: BaseOptions) {
    if (opts && opts.formatters) {
      this.formatters = opts.formatters;
    }
  }

  prepareTransport(log: T): T[] {
    return [log];
  }

  format(preparedLine: T): string {
    let formattedMessage = preparedLine.message;
    for (const formatter of this.formatters) {
      formattedMessage = formatter(formattedMessage, preparedLine);
    }
    return formattedMessage;
  }

  transport(log: string): void {
    console.log(log);
  }

  log(log: T) {
    const messages = this.prepareTransport(log);
    const fMessages = messages.map((message) => this.format(message));
    fMessages.forEach((fMessage) => this.transport(fMessage));
  }
}
