import { TumblrService } from './TumblrService';

describe('TumblrService', () => {
  it('should auth user', async () => {
    const res: void = await TumblrService.requestToken();
    expect(res).toBeNull();
  });
});
