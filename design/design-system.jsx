// Design System overview artboard.
// Layouts the foundations for both variants A and B side by side.

function DesignSystemSheet({ variant = 'A' }) {
  const T = TOKENS[variant];
  const isB = variant === 'B';
  const titleFont = isB ? '"Noto Serif SC", "Songti SC", serif' : '"Noto Serif SC", "Songti SC", serif';
  const bodyFont  = isB ? '"Noto Serif SC", "Songti SC", serif' : '"Noto Sans SC", "PingFang SC", system-ui, sans-serif';

  // Sample status tier data
  const tierSamples = [
    { tier: 'untouched', s: 0,  example: '人与自然' },
    { tier: 'learned',   s: 72, example: '心'       },
    { tier: 'mastered',  s: 88, example: '肝'       },
    { tier: 'fading',    s: 42, example: '脾'       },
  ];

  return (
    <div style={{
      width: '100%', height: '100%',
      background: T.bg,
      color: T.ink,
      fontFamily: bodyFont,
      padding: '56px 64px',
      boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 36,
      lineHeight: 1.55,
    }}>
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid ${T.line}`, paddingBottom: 14 }}>
        <div>
          <div style={{ fontFamily: titleFont, fontSize: 32, fontWeight: 500, letterSpacing: '0.04em' }}>
            设计系统 · 变体 {variant}
          </div>
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 6, letterSpacing: '0.16em' }}>
            {isB ? 'DESIGN SYSTEM · TYPOGRAPHIC / CLASSICAL' : 'DESIGN SYSTEM · QUIET / PROFESSIONAL'}
          </div>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 10, color: T.ink3, letterSpacing: '0.1em' }}>
          FM-DS / v0.1 · 2026-05-23
        </div>
      </div>

      {/* main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.1fr 1fr', gap: 40 }}>

        {/* ── Typography ── */}
        <section>
          <SectionLabel variant={variant}>Typography · 中文字组</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ fontFamily: titleFont, fontSize: 44, lineHeight: 1.15, color: T.ink, fontWeight: 500 }}>肝主疏泄</div>
              <RowMeta variant={variant}>思源宋体 · 44 / 1.15 · Display</RowMeta>
            </div>
            <div>
              <div style={{ fontFamily: titleFont, fontSize: 26, lineHeight: 1.25, color: T.ink, fontWeight: 500 }}>主要功能</div>
              <RowMeta variant={variant}>思源宋体 · 26 / 1.25 · H2</RowMeta>
            </div>
            <div>
              <div style={{ fontFamily: bodyFont, fontSize: 16, lineHeight: 1.7, color: T.ink2 }}>
                肝具有疏通、畅达全身气机，进而促使精血津液的运行输布、脾胃之气的升降、胆汁的分泌排泄。
              </div>
              <RowMeta variant={variant}>{isB ? '思源宋体' : '思源黑体'} · 16 / 1.7 · Body</RowMeta>
            </div>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 12, color: T.ink2, letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums' }}>
                强度&nbsp;&nbsp;88 ── 访问&nbsp;&nbsp;12 ── 题目&nbsp;&nbsp;42/56
              </div>
              <RowMeta variant={variant}>JetBrains Mono · 12 · Numeric / Meta</RowMeta>
            </div>
          </div>
        </section>

        {/* ── Color ── */}
        <section>
          <SectionLabel variant={variant}>Color · 色板</SectionLabel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
            <SwatchRow label="Page"   hex={T.bg}    variant={variant} />
            <SwatchRow label="Paper"  hex={T.paper} variant={variant} />
            <SwatchRow label="Sheet"  hex={T.sheet} variant={variant} />
            <SwatchRow label="Line"   hex={T.line}  variant={variant} />
            <SwatchRow label="Ink·1"  hex={T.ink}   variant={variant} dark />
            <SwatchRow label="Ink·2"  hex={T.ink2}  variant={variant} dark />
            <SwatchRow label="Ink·3"  hex={T.ink3}  variant={variant} dark />
            <SwatchRow label="Accent" hex={T.accent} variant={variant} dark />
          </div>

          <SectionLabel variant={variant} sub>四档状态</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {tierSamples.map(({ tier, s, example }) => {
              const tDef = TIERS[tier];
              return (
                <div key={tier} style={{ display: 'grid', gridTemplateColumns: '14px 56px 60px 1fr', gap: 10, alignItems: 'center', fontSize: 12, padding: '4px 0', borderBottom: `1px dotted ${T.line}` }}>
                  <span style={{ width: 14, height: 14, background: T[tDef.key], display: 'inline-block' }} />
                  <span style={{ color: T.ink, fontFamily: titleFont, fontSize: 13 }}>{tDef.label}</span>
                  <StatusBar tier={tier} strength={s} width={56} variant={variant} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3, letterSpacing: '0.06em' }}>{T[tDef.key].toUpperCase()}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Status indicator system ── */}
        <section>
          <SectionLabel variant={variant}>Status · 强度可视化</SectionLabel>

          <div style={{ marginBottom: 22, padding: '14px 16px', background: T.paper, border: `1px solid ${T.line}` }}>
            <div style={{ fontSize: 11, color: T.ink3, marginBottom: 10, letterSpacing: '0.12em' }}>横向强度条 · 长度即强度</div>
            {tierSamples.map(({ tier, s, example }) => {
              const tDef = TIERS[tier];
              return (
                <div key={tier} style={{ display: 'grid', gridTemplateColumns: '60px 80px 36px 1fr', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: `1px solid ${T.line}` }}>
                  <span style={{ fontFamily: titleFont, fontSize: 14, color: T.ink }}>{example}</span>
                  <StatusBar tier={tier} strength={s} width={72} variant={variant} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.ink2, fontVariantNumeric: 'tabular-nums' }}>
                    {tier === 'untouched' ? '--' : s}
                  </span>
                  <span style={{ fontSize: 11, color: T.ink3 }}>{tDef.label}</span>
                </div>
              );
            })}
          </div>

          <SectionLabel variant={variant} sub>状态概览条形</SectionLabel>
          <DistributionBar variant={variant} />

          <div style={{ fontSize: 11, color: T.ink3, marginTop: 14, lineHeight: 1.7 }}>
            状态符号在所有节点引用处保持一致 —
            标题旁、列表前、链接 hover 中均使用同一条形。色 + ▼ 标记构成双重编码，色盲友好。
          </div>
        </section>

      </div>

      {/* primitives row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: 40, paddingTop: 28, borderTop: `1px solid ${T.line}` }}>
        <section>
          <SectionLabel variant={variant}>Buttons</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <PrimaryBtn variant={variant}>测试自己 · 12 题</PrimaryBtn>
              <GhostBtn variant={variant}>跳过</GhostBtn>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <SecondaryBtn variant={variant}>看讲解</SecondaryBtn>
              <SecondaryBtn variant={variant}>下一题</SecondaryBtn>
              <LinkBtn variant={variant}>Why ?</LinkBtn>
            </div>
          </div>
        </section>

        <section>
          <SectionLabel variant={variant}>Node Card · 节点卡</SectionLabel>
          <NodeCard variant={variant} />
        </section>

        <section>
          <SectionLabel variant={variant}>Wiki-link · 双向链接</SectionLabel>
          <div style={{ fontFamily: bodyFont, fontSize: 15, lineHeight: 1.9, color: T.ink2 }}>
            常见证型：
            <WikiLink variant={variant} tier="mastered">肝郁气滞</WikiLink>{' · '}
            <WikiLink variant={variant} tier="learned">肝阳上亢</WikiLink>{' · '}
            <WikiLink variant={variant} tier="untouched">肝风内动</WikiLink>
          </div>
          <div style={{ fontSize: 11, color: T.ink3, marginTop: 16, lineHeight: 1.7 }}>
            链接下划线的色调随目标节点状态同步，扫读时即可识别已学/未学。
          </div>
        </section>
      </div>

    </div>
  );
}

// ── Small DS helpers ───────────────────────────────────────

function SectionLabel({ children, variant = 'A', sub }) {
  const T = TOKENS[variant];
  return (
    <div style={{
      fontSize: sub ? 10 : 10,
      letterSpacing: '0.2em',
      color: T.ink3,
      textTransform: 'uppercase',
      marginBottom: sub ? 8 : 16,
      marginTop: sub ? 14 : 0,
      paddingBottom: sub ? 0 : 6,
      borderBottom: sub ? 'none' : `1px solid ${T.line}`,
    }}>
      {children}
    </div>
  );
}

function RowMeta({ children, variant = 'A' }) {
  const T = TOKENS[variant];
  return (
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3, letterSpacing: '0.06em', marginTop: 4 }}>
      {children}
    </div>
  );
}

function SwatchRow({ label, hex, variant = 'A', dark = false }) {
  const T = TOKENS[variant];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '20px 60px 1fr', alignItems: 'center', gap: 12, padding: '3px 0' }}>
      <span style={{ width: 20, height: 20, background: hex, border: `1px solid ${T.line}` }} />
      <span style={{ fontSize: 11, color: T.ink2, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' }}>{label}</span>
      <span style={{ fontSize: 10, color: T.ink3, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em' }}>{hex.toUpperCase()}</span>
    </div>
  );
}

function DistributionBar({ variant = 'A' }) {
  const T = TOKENS[variant];
  const parts = [
    { tier: 'mastered',  n: 12 },
    { tier: 'learned',   n: 20 },
    { tier: 'fading',    n: 6 },
    { tier: 'untouched', n: 168 },
  ];
  const total = parts.reduce((a, b) => a + b.n, 0);
  return (
    <div>
      <div style={{ display: 'flex', width: '100%', height: 10, border: `1px solid ${T.line}`, background: T.sheet }}>
        {parts.map(p => (
          <div key={p.tier} style={{ width: `${p.n / total * 100}%`, background: T[TIERS[p.tier].key] }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: T.ink3, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em' }}>
        {parts.map(p => (
          <span key={p.tier}>
            <span style={{ display: 'inline-block', width: 8, height: 8, background: T[TIERS[p.tier].key], marginRight: 6, verticalAlign: 'middle' }} />
            {TIERS[p.tier].label} {p.n}
          </span>
        ))}
        <span>共 {total}</span>
      </div>
    </div>
  );
}

function PrimaryBtn({ children, variant = 'A' }) {
  const T = TOKENS[variant];
  return (
    <button style={{
      background: T.ink, color: T.paper, border: 'none', padding: '10px 18px',
      fontFamily: 'inherit', fontSize: 13, letterSpacing: '0.08em', cursor: 'pointer', borderRadius: 0,
    }}>{children}</button>
  );
}
function SecondaryBtn({ children, variant = 'A' }) {
  const T = TOKENS[variant];
  return (
    <button style={{
      background: 'transparent', color: T.ink, border: `1px solid ${T.ink}`, padding: '9px 16px',
      fontFamily: 'inherit', fontSize: 13, letterSpacing: '0.08em', cursor: 'pointer', borderRadius: 0,
    }}>{children}</button>
  );
}
function GhostBtn({ children, variant = 'A' }) {
  const T = TOKENS[variant];
  return (
    <button style={{
      background: 'transparent', color: T.ink3, border: 'none', padding: '9px 4px',
      fontFamily: 'inherit', fontSize: 12, letterSpacing: '0.12em', cursor: 'pointer', borderRadius: 0,
    }}>{children}</button>
  );
}
function LinkBtn({ children, variant = 'A' }) {
  const T = TOKENS[variant];
  return (
    <button style={{
      background: 'transparent', color: T.accent, border: 'none', padding: '0', textDecoration: 'underline', textUnderlineOffset: '3px',
      fontFamily: 'inherit', fontSize: 13, letterSpacing: '0.04em', cursor: 'pointer',
    }}>{children}</button>
  );
}

function NodeCard({ variant = 'A' }) {
  const T = TOKENS[variant];
  const isB = variant === 'B';
  const titleFont = '"Noto Serif SC", serif';
  return (
    <div style={{ background: T.paper, border: `1px solid ${T.line}`, padding: '18px 20px 20px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontFamily: titleFont, fontSize: 22, fontWeight: 500, color: T.ink }}>肝</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.ink3, letterSpacing: '0.08em' }}>L2 · 五脏</div>
      </div>
      <div style={{ fontSize: 13, color: T.ink2, marginTop: 4 }}>主疏泄, 主藏血</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 10, borderTop: `1px solid ${T.line}` }}>
        <StatusBar tier="mastered" strength={88} width={64} variant={variant} showValue />
        <span style={{ fontSize: 10, color: T.ink3, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em' }}>熟练</span>
      </div>
    </div>
  );
}

function WikiLink({ children, variant = 'A', tier = 'learned' }) {
  const T = TOKENS[variant];
  const color = T[TIERS[tier].key];
  return (
    <span style={{
      color: T.ink,
      borderBottom: `1.5px solid ${color}`,
      paddingBottom: 1,
      cursor: 'pointer',
    }}>{children}</span>
  );
}

Object.assign(window, { DesignSystemSheet, SectionLabel, RowMeta, SwatchRow, DistributionBar, PrimaryBtn, SecondaryBtn, GhostBtn, LinkBtn, NodeCard, WikiLink });
