import { JsonAStringPipe } from './json-a-string.pipe';

describe('JsonAStringPipe', () => {
    it('create an instance', () => {
        const pipe = new JsonAStringPipe();
        expect(pipe).toBeTruthy();
    });
});
