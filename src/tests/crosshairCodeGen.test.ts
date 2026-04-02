// src/tests/crosshairCodeGen.test.ts
import { crosshairCodeGen } from '@/lib/crosshairCodeGen';
import { DEFAULT_CROSSHAIR } from '@/stores/crosshairStore';

// CS2 share code format: CSGO-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
// Each segment is 5 characters from the csgo-sharecode base-57 alphabet
const SHARE_CODE_PATTERN = /^CSGO-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}-[A-Za-z0-9]{5}$/;

describe('crosshairCodeGen', () => {
  it('produces a valid CS2 share code format from defaults', () => {
    const code = crosshairCodeGen(DEFAULT_CROSSHAIR);
    expect(code).toMatch(SHARE_CODE_PATTERN);
  });

  it('produces a valid share code for classic dynamic style (style 3)', () => {
    const code = crosshairCodeGen({ ...DEFAULT_CROSSHAIR, style: 3 });
    expect(code).toMatch(SHARE_CODE_PATTERN);
  });

  it('produces a valid share code for tee style (style 5)', () => {
    const code = crosshairCodeGen({ ...DEFAULT_CROSSHAIR, style: 5 });
    expect(code).toMatch(SHARE_CODE_PATTERN);
  });

  it('produces a valid share code with dot enabled', () => {
    const code = crosshairCodeGen({
      ...DEFAULT_CROSSHAIR,
      dot: { enabled: true },
    });
    expect(code).toMatch(SHARE_CODE_PATTERN);
  });

  it('produces a valid share code with outline enabled', () => {
    const code = crosshairCodeGen({
      ...DEFAULT_CROSSHAIR,
      outline: { enabled: true, thickness: 1 },
    });
    expect(code).toMatch(SHARE_CODE_PATTERN);
  });

  it('returns a string (not undefined or null)', () => {
    const code = crosshairCodeGen(DEFAULT_CROSSHAIR);
    expect(typeof code).toBe('string');
    expect(code.length).toBeGreaterThan(0);
  });
});
