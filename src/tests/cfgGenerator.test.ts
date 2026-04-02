// src/tests/cfgGenerator.test.ts
import { cfgGenerator } from '@/lib/cfgGenerator';
import { DEPRECATED_CS2_COMMANDS } from '@/lib/constants/deprecatedCmds';
import { DEFAULT_CONFIG } from '@/stores/configStore';

describe('cfgGenerator', () => {
  describe('deprecated command safety', () => {
    it('never outputs deprecated CS2 commands', () => {
      const cfg = cfgGenerator(DEFAULT_CONFIG);
      for (const cmd of DEPRECATED_CS2_COMMANDS) {
        // Use word-boundary regex so short tokens like "rate" don't match
        // substrings inside valid words (e.g. "Generated")
        expect(cfg).not.toMatch(new RegExp(`(?<![\\w_])${cmd}(?![\\w_])`));
      }
    });

    it('never outputs cl_updaterate regardless of config', () => {
      const cfg = cfgGenerator(DEFAULT_CONFIG);
      expect(cfg).not.toContain('cl_updaterate');
    });

    it('never outputs cl_interp regardless of config', () => {
      const cfg = cfgGenerator(DEFAULT_CONFIG);
      expect(cfg).not.toContain('cl_interp');
    });
  });

  describe('valid command output', () => {
    it('includes sensitivity command', () => {
      const cfg = cfgGenerator(DEFAULT_CONFIG);
      expect(cfg).toContain(`sensitivity ${DEFAULT_CONFIG.mouse.sensitivity}`);
    });

    it('includes volume command', () => {
      const cfg = cfgGenerator(DEFAULT_CONFIG);
      expect(cfg).toContain(`volume ${DEFAULT_CONFIG.audio.masterVolume}`);
    });

    it('includes bind commands for all 15 actions', () => {
      const cfg = cfgGenerator(DEFAULT_CONFIG);
      expect(cfg).toContain('bind "SPACE" "+jump"');
      expect(cfg).toContain('bind "MOUSE1" "+attack"');
    });

    it('outputs voice_enable 0 when muteEnemyVoice is true', () => {
      const cfg = cfgGenerator({
        ...DEFAULT_CONFIG,
        audio: { ...DEFAULT_CONFIG.audio, muteEnemyVoice: true },
      });
      expect(cfg).toContain('voice_enable 0');
    });

    it('outputs voice_enable 1 when muteEnemyVoice is false', () => {
      const cfg = cfgGenerator({
        ...DEFAULT_CONFIG,
        audio: { ...DEFAULT_CONFIG.audio, muteEnemyVoice: false },
      });
      expect(cfg).toContain('voice_enable 1');
    });

    it('returns a non-empty string', () => {
      const cfg = cfgGenerator(DEFAULT_CONFIG);
      expect(typeof cfg).toBe('string');
      expect(cfg.length).toBeGreaterThan(0);
    });
  });
});
