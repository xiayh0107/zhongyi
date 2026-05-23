// Variant A — 含蓄典籍 / 现代专业
// Home (主页 · F04) — desktop + mobile

// ─── Sample data ─────────────────────────────────────────
const STATUS = [
  { tier: 'mastered',  n: 12  },
  { tier: 'learned',   n: 20  },
  { tier: 'fading',    n: 6   },
  { tier: 'untouched', n: 168 },
];
const TOTAL_NODES = STATUS.reduce((a, b) => a + b.n, 0);

// Outline tree data — 知识地图
const OUTLINE = [
  { id: 'jcll', title: '中医基础理论', expanded: true, total: 10, done: 5, children: [
    { id: 'yyxx', title: '阴阳五行', expanded: true, total: 5, done: 4, children: [
      { id: 'yy',   title: '阴阳学说',       tier: 'mastered',  s: 92 },
      { id: 'wx',   title: '五行学说',       tier: 'mastered',  s: 88 },
      { id: 'yyhg', title: '阴阳互根',       tier: 'mastered',  s: 90 },
      { id: 'wxxs', title: '五行相生相克',   tier: 'learned',   s: 74 },
      { id: 'wxcw', title: '五行相乘相侮',   tier: 'untouched', s: 0  },
    ] },
    { id: 'zhg', title: '整体观念', expanded: false, total: 5, done: 1, children: [
      { id: 'zhg1', title: '整体观',     tier: 'learned',   s: 68 },
      { id: 'rzy',  title: '人与自然',    tier: 'untouched', s: 0 },
    ] },
  ] },
  { id: 'zfxs', title: '脏腑学说',       total: 11, done: 3, children: [] },
  { id: 'qxjy', title: '气血津液',       total: 7,  done: 0, children: [] },
  { id: 'lyqq', title: '六淫七情',       total: 9,  done: 2, children: [] },
  { id: 'zy',   title: '中药',           total: 36, done: 4, children: [] },
  { id: 'fj',   title: '方剂',           total: 28, done: 0, children: [] },
  { id: 'jl',   title: '经络穴位',       total: 64, done: 8, children: [] },
  { id: 'bzh',  title: '辨证',           total: 41, done: 0, children: [] },
];

// ─── Desktop F04 ─────────────────────────────────────────
function A_Home_Desktop() {
  const variant = 'A';
  const T = TOKENS[variant];

  return (
    <div data-screen-label="01 A · Home (Desktop)" style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.ink,
      fontFamily: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>
      <TopBarA variant={variant} />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 0, overflow: 'hidden' }}>
        {/* ─── LEFT : main column ─── */}
        <div style={{ padding: '40px 56px 56px', overflow: 'hidden' }}>
          {/* Greeting */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 12, color: T.ink3, letterSpacing: '0.2em' }}>2026 · 五月廿三 · 晴</div>
              <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 32, fontWeight: 500, marginTop: 6 }}>
                你好
              </div>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.ink3, letterSpacing: '0.1em' }}>
              上次访问 · 06:42
            </div>
          </div>

          {/* Status overview */}
          <Section variant={variant} label="状态概览" right={<span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.ink3 }}>共 {TOTAL_NODES} 节点</span>}>
            <div style={{ background: T.paper, border: `1px solid ${T.line}`, padding: '20px 24px' }}>
              {STATUS.map(p => (
                <StatusRowA key={p.tier} tier={p.tier} n={p.n} total={TOTAL_NODES} variant={variant} />
              ))}
            </div>
          </Section>

          {/* 想做点什么 */}
          <Section variant={variant} label="想做点什么 ?" hint="四个入口由你选 · 不是任务">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <EntryCardA variant={variant} kind="restore" />
              <EntryCardA variant={variant} kind="new" />
              <EntryCardA variant={variant} kind="resume" />
              <EntryCardA variant={variant} kind="browse" />
            </div>
          </Section>

        </div>

        {/* ─── RIGHT : map ─── */}
        <div style={{
          background: T.paper,
          borderLeft: `1px solid ${T.line}`,
          padding: '40px 32px 56px',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${T.line}` }}>
            <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 18, fontWeight: 500 }}>你的知识地图</div>
            <span style={{ fontSize: 10, color: T.ink3, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em' }}>OUTLINE</span>
          </div>
          <div style={{ fontSize: 11, color: T.ink3, marginBottom: 16, lineHeight: 1.6 }}>
            点击任意节点直接进入 · 折叠的分类可展开
          </div>
          <OutlineTreeA variant={variant} />
        </div>
      </div>
    </div>
  );
}

// ─── Mobile F04 ──────────────────────────────────────────
function A_Home_Mobile() {
  const variant = 'A';
  const T = TOKENS[variant];

  return (
    <div data-screen-label="04 A · Home (Mobile)" style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.ink,
      fontFamily: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* status bar */}
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', color: T.ink, fontWeight: 500 }}>
        <span>9:41</span>
        <span style={{ fontSize: 11, letterSpacing: '0.08em' }}>● ●● 5G ●●●</span>
      </div>
      {/* nav */}
      <div style={{ padding: '6px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${T.line}` }}>
        <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 16, fontWeight: 500, letterSpacing: '0.02em' }}>Fast Memory · 中医</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3, letterSpacing: '0.1em' }}>⌕</span>
      </div>

      <div style={{ flex: 1, padding: '22px 20px 28px', overflow: 'auto' }}>
        <div style={{ fontSize: 11, color: T.ink3, letterSpacing: '0.18em' }}>2026·05·23</div>
        <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 24, marginTop: 4, marginBottom: 22 }}>你好</div>

        {/* compact status */}
        <div style={{ background: T.paper, border: `1px solid ${T.line}`, padding: '14px 16px', marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 10 }}>状态概览</div>
          <div style={{ display: 'flex', width: '100%', height: 8, marginBottom: 10 }}>
            {STATUS.map(p => (
              <div key={p.tier} style={{ width: `${p.n / TOTAL_NODES * 100}%`, background: T[TIERS[p.tier].key] }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11 }}>
            {STATUS.map(p => (
              <div key={p.tier} style={{ display: 'flex', justifyContent: 'space-between', color: T.ink2 }}>
                <span><span style={{ display: 'inline-block', width: 7, height: 7, background: T[TIERS[p.tier].key], marginRight: 6, verticalAlign: 'middle' }} />{TIERS[p.tier].label}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: T.ink }}>{p.n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Entries — stacked */}
        <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 10 }}>想做点什么 ?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          <EntryCardA variant={variant} kind="restore" compact />
          <EntryCardA variant={variant} kind="new"     compact />
          <EntryCardA variant={variant} kind="resume"  compact />
          <EntryCardA variant={variant} kind="browse"  compact />
        </div>

        <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 10 }}>知识地图</div>
        <div style={{ background: T.paper, border: `1px solid ${T.line}`, padding: '10px 14px' }}>
          <OutlineTreeA variant={variant} compact />
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────

function TopBarA({ variant }) {
  const T = TOKENS[variant];
  return (
    <div style={{
      height: 56, padding: '0 56px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: `1px solid ${T.line}`, background: T.bg,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 18, fontWeight: 500, letterSpacing: '0.04em' }}>
          Fast Memory
        </span>
        <span style={{ color: T.ink3, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.16em' }}>·</span>
        <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 15, color: T.ink2 }}>中医</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 380 }}>
        <div style={{
          flex: 1, height: 32, background: T.paper, border: `1px solid ${T.line}`,
          display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8,
        }}>
          <span style={{ color: T.ink3, fontSize: 12 }}>⌕</span>
          <span style={{ color: T.ink3, fontSize: 12 }}>搜索节点、题目、模板字段</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3, padding: '2px 6px', border: `1px solid ${T.line}` }}>⌘K</span>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: T.ink, color: T.paper,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Noto Serif SC", serif', fontSize: 13,
        }}>沂</div>
      </div>
    </div>
  );
}

function Section({ label, hint, right, children, variant = 'A' }) {
  const T = TOKENS[variant];
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontSize: 11, color: T.ink3, letterSpacing: '0.22em', textTransform: 'uppercase' }}>{label}</span>
          {hint && <span style={{ fontSize: 11, color: T.ink3, fontStyle: 'italic' }}>{hint}</span>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function StatusRowA({ tier, n, total, variant }) {
  const T = TOKENS[variant];
  const tDef = TIERS[tier];
  const pct = n / total * 100;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 70px', alignItems: 'center', gap: 16, padding: '8px 0', borderBottom: `1px dotted ${T.line2}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 8, height: 8, background: T[tDef.key] }} />
        <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 14, color: T.ink }}>{tDef.label}</span>
      </div>
      <div style={{ height: 6, background: T.chartTrack, position: 'relative' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: T[tDef.key] }} />
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{n}</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3, marginLeft: 6 }}>{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

function EntryCardA({ kind, variant, compact = false }) {
  const T = TOKENS[variant];
  const data = {
    restore: { label: '补强',     hint: '衰减中的 6 个节点 · 强度 < 60', body: '脾 · 心包 · 阳明经 · ...' , tier: 'fading' },
    new:     { label: '探索新节点', hint: '推荐 [[肺]] · 与你刚学的 [[心]] 相邻', body: '与肺相关的 4 个并列节点', tier: 'untouched' },
    resume:  { label: '继续上次',   hint: '脾主运化 · 3 题进行中',           body: '答到第 3 / 5 题', tier: 'learned' },
    browse:  { label: '自由浏览',   hint: '打开完整知识地图',                 body: '206 节点 · 9 大类', tier: null },
  }[kind];
  const accentColor = data.tier ? T[TIERS[data.tier].key] : T.line2;
  return (
    <div style={{
      background: T.paper, border: `1px solid ${T.line}`,
      padding: compact ? '12px 14px' : '18px 18px 18px 22px',
      position: 'relative', cursor: 'pointer',
      borderLeft: `3px solid ${accentColor}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: compact ? 17 : 19, fontWeight: 500, color: T.ink }}>{data.label}</div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3, letterSpacing: '0.14em' }}>→</span>
      </div>
      <div style={{ fontSize: 12, color: T.ink2, marginTop: 4, lineHeight: 1.5 }}>{data.hint}</div>
      {!compact && <div style={{ fontSize: 11, color: T.ink3, marginTop: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' }}>{data.body}</div>}
    </div>
  );
}

function OutlineTreeA({ variant, compact = false }) {
  const T = TOKENS[variant];
  const fontSize = compact ? 12 : 13;
  return (
    <div style={{ fontSize, lineHeight: 1.7 }}>
      {OUTLINE.map(cat => <OutlineCategoryA key={cat.id} cat={cat} variant={variant} compact={compact} />)}
    </div>
  );
}

function OutlineCategoryA({ cat, variant, compact }) {
  const T = TOKENS[variant];
  const expanded = !!cat.expanded;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '14px 1fr auto', alignItems: 'center', gap: 6, padding: '5px 0' }}>
        <span style={{ color: T.ink3, fontSize: 10 }}>{expanded ? '▾' : '▸'}</span>
        <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: compact ? 13 : 14, color: T.ink, fontWeight: 500 }}>{cat.title}</span>
        <CategoryProgress cat={cat} variant={variant} />
      </div>
      {expanded && cat.children.map(child => {
        if (child.children) {
          return <div key={child.id} style={{ paddingLeft: 14 }}><OutlineCategoryA cat={child} variant={variant} compact={compact} /></div>;
        }
        return (
          <div key={child.id} style={{ display: 'grid', gridTemplateColumns: '14px 1fr 56px 28px', alignItems: 'center', gap: 6, padding: '4px 0 4px 28px', cursor: 'pointer' }}>
            <span style={{ width: 7, height: 7, background: T[TIERS[child.tier].key], borderRadius: child.tier === 'untouched' ? '50%' : 0, border: child.tier === 'untouched' ? `1px solid ${T.line2}` : 'none', boxSizing: 'border-box' }} />
            <span style={{ color: T.ink2 }}>{child.title}</span>
            <StatusBar tier={child.tier} strength={child.s} width={50} size="sm" variant={variant} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3, textAlign: 'right' }}>
              {child.tier === 'untouched' ? '—' : child.s}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function CategoryProgress({ cat, variant }) {
  const T = TOKENS[variant];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3 }}>
      <span style={{ display: 'inline-block', width: 40, height: 4, background: T.chartTrack, position: 'relative' }}>
        <span style={{ position: 'absolute', left: 0, top: 0, width: `${cat.done / cat.total * 100}%`, height: '100%', background: T.s_learned }} />
      </span>
      <span style={{ minWidth: 30, textAlign: 'right' }}>{cat.done}/{cat.total}</span>
    </div>
  );
}

Object.assign(window, { A_Home_Desktop, A_Home_Mobile });
