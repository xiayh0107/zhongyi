// Shared tokens + StatusBar component used across all screens.
// Two variant palettes (A: 专业含蓄, B: 典籍感) sharing the same tier semantics.

const TOKENS = {
  A: {
    bg:        '#f6f2e9',      // canvas / page bg (subtle warm)
    paper:     '#fbf8f1',      // card / surface
    sheet:     '#ffffff',      // crisp inner sheet
    ink:       '#1f1c17',
    ink2:      '#534f47',
    ink3:      '#8a847a',
    line:      '#e0d9c8',
    line2:     '#cdc4af',
    accent:    '#365240',      // deep pine — used for CTA / focused state
    rule:      '#cbc1aa',
    // 4 status tiers (color + tier)
    s_untouched: '#aea798',
    s_learned:   '#436b80',    // 黛青
    s_mastered:  '#5f7c4d',    // 松绿
    s_fading:    '#a06d2e',    // 赭石
    chartTrack:  '#ece5d3',
  },
  B: {
    bg:        '#ece2c9',      // 宣纸
    paper:     '#f5ecd5',
    sheet:     '#faf3df',
    ink:       '#241d12',
    ink2:      '#4c4232',
    ink3:      '#867a60',
    line:      '#cdbf99',
    line2:     '#b2a079',
    accent:    '#8c2e1f',      // 朱砂 — only for accents/page numbers
    rule:      '#a08758',
    s_untouched: '#9a917a',
    s_learned:   '#3d5c6e',
    s_mastered:  '#566f3a',
    s_fading:    '#9a5c20',
    chartTrack:  '#dfd1aa',
  },
};

// 4 tier definitions
const TIERS = {
  untouched: { label: '未学',   key: 's_untouched', glyph: '○' },
  learned:   { label: '学过',   key: 's_learned',   glyph: '─' },
  mastered:  { label: '熟练',   key: 's_mastered',  glyph: '═' },
  fading:    { label: '衰减中', key: 's_fading',    glyph: '▼' },
};

function tierFromStrength(s, everReached) {
  if (s == null) return 'untouched';
  if (s >= 85) return 'mastered';
  if (s >= 60) return 'learned';
  if (everReached) return 'fading';
  return 'untouched';
}

// ─────────────────────────────────────────────────────────────
// StatusBar — the canonical status indicator.
// Horizontal strength bar (length = strength) with tier color.
// Fading tier carries a ▼ glyph for non-color encoding.
// width: total px; size: 'sm' | 'md' | 'lg'
// ─────────────────────────────────────────────────────────────
function StatusBar({ tier = 'untouched', strength = 0, width = 56, size = 'md', variant = 'A', showValue = false, style = {} }) {
  const T = TOKENS[variant];
  const tDef = TIERS[tier];
  const color = T[tDef.key];
  const h = size === 'sm' ? 4 : size === 'lg' ? 8 : 5;
  const w = width;
  const fillW = tier === 'untouched' ? 0 : Math.max(6, Math.round(w * Math.min(1, Math.max(0.08, strength / 100))));
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', ...style }}>
      <span style={{ position: 'relative', display: 'inline-block', width: w, height: h, background: tier === 'untouched' ? 'transparent' : T.chartTrack, border: tier === 'untouched' ? `1px dashed ${T.line2}` : 'none', borderRadius: 0 }}>
        {tier !== 'untouched' && (
          <span style={{ position: 'absolute', left: 0, top: 0, width: fillW, height: h, background: color }} />
        )}
        {tier === 'mastered' && (
          <span style={{ position: 'absolute', right: -7, top: -1, fontSize: 9, color, lineHeight: 1, letterSpacing: 0 }}>›</span>
        )}
      </span>
      {tier === 'fading' && (
        <span style={{ fontSize: 9, color, lineHeight: 1, transform: 'translateY(0px)' }}>▼</span>
      )}
      {showValue && (
        <span style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: size === 'sm' ? 10 : 11, color: T.ink2, letterSpacing: 0, fontVariantNumeric: 'tabular-nums' }}>
          {tier === 'untouched' ? '--' : strength}
        </span>
      )}
    </span>
  );
}

// Inline tier glyph (when bar is overkill, e.g. inside flowing text)
function TierDot({ tier = 'untouched', variant = 'A', size = 10 }) {
  const T = TOKENS[variant];
  const tDef = TIERS[tier];
  const color = T[tDef.key];
  if (tier === 'untouched') {
    return <span style={{ display: 'inline-block', width: size, height: size, border: `1px solid ${T.line2}`, borderRadius: '50%' }} />;
  }
  return <span style={{ display: 'inline-block', width: size, height: size, background: color, borderRadius: '50%', position: 'relative' }}>
    {tier === 'fading' && <span style={{ position: 'absolute', top: -1, right: -5, fontSize: 8, color }}>▼</span>}
  </span>;
}

// Compact strength row for use inside cards: text label + bar + numeric.
function StrengthRow({ tier, strength, variant = 'A' }) {
  const T = TOKENS[variant];
  const tDef = TIERS[tier];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, color: T.ink2, letterSpacing: '0.08em' }}>
      <span style={{ textTransform: 'none' }}>{tDef.label}</span>
      <StatusBar tier={tier} strength={strength} width={48} variant={variant} />
      <span style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 11, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>
        {tier === 'untouched' ? '—' : strength}
      </span>
    </span>
  );
}

Object.assign(window, { TOKENS, TIERS, tierFromStrength, StatusBar, TierDot, StrengthRow });
