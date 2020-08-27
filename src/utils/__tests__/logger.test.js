import { Logger } from '../logger';

describe('Logger util class', () => {
  it('logs `title` and `message` to console', () => {
    const consoleLogSpy = spyOn(console, 'log');

    Logger.log('message', 'title');

    expect(consoleLogSpy).toBeCalledWith('title', 'message');
  });
});
