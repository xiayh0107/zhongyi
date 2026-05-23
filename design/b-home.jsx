// Variant B — 典籍感 / 古典书页
// Stronger Songti, 宣纸 ground, 朱砂 sparing accents, asymmetric classical grid.

// ─── Helpers shared by all B screens ───

const CN_NUM = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
function cnNum(n) {
  if (n <= 10) return CN_NUM[n];
  if (n < 20) return '十' + CN_NUM[n - 10];
  if (n < 100) return CN_NUM[Math.floor(n / 10)] + '十' + (n % 10 ? CN_NUM[n % 10] : '');
  return String(n);
}

function VerticalLabel({ children, color, fontSize = 12, variant = 'B' }) {
  const T = TOKENS[variant];
  return (
    <div style={{
      writingMode: 'vertical-rl',
      textOrientation: 'upright',
      fontFamily: '"Noto Serif SC", serif',
      fontSize, color: color || T.ink3,
      letterSpacing: '0.5em',
      lineHeight: 1,
    }}>{children}</div>
  );
}

// Page chrome — title strip + a vermilion rule used as page header
function BPageHeader({ variant = 'B', kana, title, sub, right }) {
  const T = TOKENS[variant];
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      paddingBottom: 14, marginBottom: 28,
      borderBottom: `0.5px solid ${T.line2}`,
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22 }}>
        <div style={{
          fontFamily: '"Noto Serif SC", serif', fontWeight: 500,
          color: T.accent, fontSize: 14, letterSpacing: '0.3em',
          paddingBottom: 4,
        }}>
          {kana}
        </div>
        <div>
          <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 38, fontWeight: 500, color: T.ink, letterSpacing: '0.04em', lineHeight: 1.1 }}>
            {title}
          </div>
          {sub && <div style={{ fontSize: 12, color: T.ink3, marginTop: 4, letterSpacing: '0.16em' }}>{sub}</div>}
        </div>
      </div>
      {right}
      <span style={{ position: 'absolute', right: 0, bottom: -3.5, height: 7, width: 80, background: T.accent }} />
    </div>
  );
}

function BTopBar({ variant = 'B' }) {
  const T = TOKENS[variant];
  return (
    <div style={{
      height: 56,
      padding: '0 56px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: `0.5px solid ${T.line2}`,
      background: T.bg,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
        {/* 朱砂 seal */}
        <span style={{
          width: 28, height: 28, background: T.accent, color: T.paper,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Noto Serif SC", serif', fontSize: 15, fontWeight: 600,
          letterSpacing: 0,
        }}>记</span>
        <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 18, fontWeight: 500, letterSpacing: '0.2em' }}>速记</span>
        <span style={{ color: T.line2 }}>|</span>
        <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 14, color: T.ink2, letterSpacing: '0.3em' }}>中医卷</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, minWidth: 380 }}>
        <div style={{ flex: 1, height: 30, background: T.sheet, border: `0.5px solid ${T.line}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, fontFamily: '"Noto Serif SC", serif', fontSize: 12, color: T.ink3 }}>
          <span>⌕</span><span style={{ letterSpacing: '0.18em' }}>检 索 节 点 题 目</span>
        </div>
        <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 13, color: T.ink2, letterSpacing: '0.18em' }}>沂 ·</span>
      </div>
    </div>
  );
}

function BSectionTitle({ children, num, variant = 'B' }) {
  const T = TOKENS[variant];
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 18 }}>
      {num && <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 14, color: T.accent, letterSpacing: '0.2em' }}>{num}</span>}
      <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 19, color: T.ink, fontWeight: 500, letterSpacing: '0.18em' }}>{children}</span>
      <span style={{ flex: 1, height: 0.5, background: T.line2, marginBottom: 4 }} />
    </div>
  );
}

// ─── B Home Desktop ─────────────────────────────────────

function B_Home_Desktop() {
  const variant = 'B';
  const T = TOKENS[variant];
  const serif = '"Noto Serif SC", serif';

  return (
    <div data-screen-label="07 B · Home (Desktop)" style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.ink,
      fontFamily: serif,
      display: 'flex', flexDirection: 'column',
    }}>
      <BTopBar variant={variant} />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '40px 1fr 360px 40px', gap: 0, overflow: 'hidden' }}>

        {/* far-left margin: vertical label */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 64 }}>
          <VerticalLabel variant={variant} fontSize={11} color={T.ink3}>卷首 · 二〇二六</VerticalLabel>
        </div>

        {/* Main reading column */}
        <div style={{ padding: '52px 56px 64px 12px', overflow: 'hidden' }}>
          <BPageHeader
            variant={variant}
            kana="壹"
            title="你好"
            sub="STATE · 当前知识状态"
            right={<div style={{ fontFamily: serif, fontSize: 11, color: T.ink3, letterSpacing: '0.2em', paddingBottom: 4 }}>第 七 次 入 卷 · 上 次 寅 时</div>}
          />

          {/* Status overview */}
          <BSectionTitle num="壹" variant={variant}>状态概览</BSectionTitle>
          <BStatusOverview variant={variant} />

          {/* Want-to-do */}
          <div style={{ marginTop: 44 }}>
            <BSectionTitle num="貳" variant={variant}>欲何为？</BSectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, rowGap: 22 }}>
              <BEntry variant={variant} kind="restore" />
              <BEntry variant={variant} kind="new" />
              <BEntry variant={variant} kind="resume" />
              <BEntry variant={variant} kind="browse" />
            </div>
          </div>
        </div>

        {/* Right column: knowledge map */}
        <div style={{
          background: T.paper,
          borderLeft: `0.5px solid ${T.line2}`,
          padding: '52px 28px 56px 32px',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18, paddingBottom: 10, borderBottom: `0.5px solid ${T.line2}` }}>
            <span style={{ fontFamily: serif, fontSize: 18, fontWeight: 500, letterSpacing: '0.18em' }}>知识图</span>
            <span style={{ fontSize: 10, color: T.accent, fontFamily: serif, letterSpacing: '0.3em' }}>叁</span>
          </div>
          <div style={{ fontSize: 11, color: T.ink3, marginBottom: 16, lineHeight: 1.8, letterSpacing: '0.04em' }}>
            九大类 · 二〇六节点 · 任入。
          </div>
          <OutlineTreeB variant={variant} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 28 }}>
          <span style={{ fontFamily: serif, fontSize: 11, color: T.ink3, letterSpacing: '0.3em', writingMode: 'vertical-rl' }}>—— 之 一 ——</span>
        </div>
      </div>
    </div>
  );
}

// ─── B Home Mobile ──────────────────────────────────────

function B_Home_Mobile() {
  const variant = 'B';
  const T = TOKENS[variant];
  const serif = '"Noto Serif SC", serif';

  return (
    <div data-screen-label="10 B · Home (Mobile)" style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.ink,
      fontFamily: serif,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', fontSize: 13, fontFamily: serif, fontWeight: 500 }}>
        <span>9:41</span><span style={{ fontSize: 11, letterSpacing: '0.08em' }}>● ●● 5G ●●●</span>
      </div>
      <div style={{ padding: '6px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `0.5px solid ${T.line2}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 22, height: 22, background: T.accent, color: T.paper, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: serif, fontSize: 12 }}>记</span>
          <span style={{ fontSize: 14, letterSpacing: '0.2em' }}>速 记 · 中医</span>
        </div>
        <span style={{ fontSize: 12, color: T.ink3 }}>⌕</span>
      </div>

      <div style={{ flex: 1, padding: '24px 22px 28px', overflow: 'auto' }}>
        <div style={{ fontFamily: serif, fontSize: 11, color: T.accent, letterSpacing: '0.3em' }}>壹</div>
        <div style={{ fontSize: 30, fontWeight: 500, marginTop: 4, marginBottom: 6 }}>你好</div>
        <div style={{ fontSize: 11, color: T.ink3, letterSpacing: '0.2em', borderBottom: `0.5px solid ${T.line2}`, paddingBottom: 14, position: 'relative' }}>
          二〇二六年五月廿三 · 上次寅时
          <span style={{ position: 'absolute', right: 0, bottom: -3.5, height: 6, width: 40, background: T.accent }} />
        </div>

        <div style={{ marginTop: 22 }}>
          <BSectionTitle num="壹" variant={variant}>状态概览</BSectionTitle>
          <BStatusOverview variant={variant} compact />
        </div>

        <div style={{ marginTop: 28 }}>
          <BSectionTitle num="貳" variant={variant}>欲何为？</BSectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <BEntry variant={variant} kind="restore" compact />
            <BEntry variant={variant} kind="new" compact />
            <BEntry variant={variant} kind="resume" compact />
            <BEntry variant={variant} kind="browse" compact />
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <BSectionTitle num="叁" variant={variant}>知识图</BSectionTitle>
          <div style={{ background: T.paper, border: `0.5px solid ${T.line2}`, padding: '14px 16px' }}>
            <OutlineTreeB variant={variant} compact />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── B-specific Status overview ────────────────────────

function BStatusOverview({ variant = 'B', compact = false }) {
  const T = TOKENS[variant];
  const serif = '"Noto Serif SC", serif';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '2fr 1fr', gap: compact ? 16 : 32, alignItems: 'flex-start' }}>
      {/* big rows */}
      <div>
        {STATUS.map(p => {
          const tDef = TIERS[p.tier];
          const pct = p.n / TOTAL_NODES;
          return (
            <div key={p.tier} style={{
              display: 'grid', gridTemplateColumns: '14px 60px 1fr 70px', gap: 14, alignItems: 'center',
              padding: '10px 0', borderBottom: `0.5px solid ${T.line}`,
            }}>
              <span style={{ width: 10, height: 10, background: T[tDef.key] }} />
              <span style={{ fontFamily: serif, fontSize: compact ? 14 : 15, letterSpacing: '0.2em', color: T.ink }}>{tDef.label}</span>
              <div style={{ height: compact ? 6 : 7, background: T.chartTrack, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct * 100}%`, background: T[tDef.key] }} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: serif, fontSize: compact ? 16 : 19, color: T.ink, fontWeight: 500 }}>{cnNum(p.n) || p.n}</span>
                <span style={{ fontFamily: serif, fontSize: 11, color: T.ink3, marginLeft: 6 }}>个</span>
              </div>
            </div>
          );
        })}
        <div style={{ textAlign: 'right', fontSize: 11, color: T.ink3, marginTop: 10, letterSpacing: '0.2em' }}>
          总 二 〇 六 节 点
        </div>
      </div>

      {!compact && (
        <div style={{ paddingLeft: 28, borderLeft: `0.5px solid ${T.line2}` }}>
          <div style={{ fontSize: 11, color: T.ink3, letterSpacing: '0.22em', marginBottom: 10 }}>近 七 日 变 化</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: serif, fontSize: 13, color: T.ink2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>新晋熟练</span><span style={{ color: T.s_mastered, fontWeight: 500 }}>+ 三</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>转衰减</span><span style={{ color: T.s_fading, fontWeight: 500 }}>+ 二</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>首入</span><span style={{ color: T.s_learned, fontWeight: 500 }}>+ 五</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: `0.5px dotted ${T.line2}`, color: T.ink3, fontStyle: 'italic', fontSize: 11 }}>
              <span>本卷无 streak · 无每日目标</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── B Entry card — bookplate look ─────────────────────

function BEntry({ kind, variant = 'B', compact = false }) {
  const T = TOKENS[variant];
  const serif = '"Noto Serif SC", serif';
  const data = {
    restore: { num: '甲', title: '补强',     hint: '衰减中 · 六节点强度低于 六十',  body: '脾 · 心包 · 阳明经 · 太阴 · ...', tier: 'fading' },
    new:     { num: '乙', title: '探新',     hint: '所推 · 肺 · 与 心 相邻',           body: '肺 → 与 大肠 相表里', tier: 'untouched' },
    resume:  { num: '丙', title: '续旧',     hint: '脾主运化 · 三题未竟',               body: '答至 第三 / 五', tier: 'learned' },
    browse:  { num: '丁', title: '览图',     hint: '展卷自取',                          body: '二〇六节点 · 九类', tier: null },
  }[kind];
  const accent = data.tier ? T[TIERS[data.tier].key] : T.line2;
  return (
    <div style={{
      background: T.paper, border: `0.5px solid ${T.line2}`,
      padding: compact ? '14px 16px' : '20px 22px 22px',
      position: 'relative', cursor: 'pointer',
    }}>
      {/* corner mark */}
      <span style={{
        position: 'absolute', top: 0, left: 0, width: 28, height: 28,
        background: accent, color: T.paper,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: serif, fontSize: 13, fontWeight: 500, letterSpacing: 0,
      }}>{data.num}</span>
      <div style={{ marginLeft: 38 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: serif, fontSize: compact ? 19 : 22, fontWeight: 500, letterSpacing: '0.2em', color: T.ink }}>{data.title}</span>
          <span style={{ fontFamily: serif, fontSize: 13, color: T.ink3, letterSpacing: '0.16em' }}>→</span>
        </div>
        <div style={{ fontSize: 12, color: T.ink2, marginTop: 4, lineHeight: 1.7, letterSpacing: '0.04em' }}>{data.hint}</div>
        {!compact && (
          <div style={{ fontSize: 11, color: T.ink3, marginTop: 10, letterSpacing: '0.08em', paddingTop: 8, borderTop: `0.5px dotted ${T.line2}` }}>{data.body}</div>
        )}
      </div>
    </div>
  );
}

// ─── B outline tree ───────────────────────────────────

function OutlineTreeB({ variant = 'B', compact = false }) {
  const T = TOKENS[variant];
  return (
    <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: compact ? 13 : 13.5, lineHeight: 1.8 }}>
      {OUTLINE.map((cat, i) => <OutlineCategoryB key={cat.id} cat={cat} variant={variant} idx={i} compact={compact} />)}
    </div>
  );
}

function OutlineCategoryB({ cat, variant, idx, compact }) {
  const T = TOKENS[variant];
  const serif = '"Noto Serif SC", serif';
  const expanded = !!cat.expanded;
  return (
    <div style={{ paddingBottom: 6 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '18px 1fr auto', alignItems: 'center', gap: 6, padding: '5px 0', borderBottom: expanded ? 'none' : `0.5px dotted ${T.line}` }}>
        <span style={{ fontFamily: serif, fontSize: 11, color: T.accent, letterSpacing: 0 }}>{cnNum(idx + 1)}</span>
        <span style={{ fontFamily: serif, fontSize: compact ? 14 : 14.5, color: T.ink, fontWeight: 500, letterSpacing: '0.14em' }}>{cat.title}</span>
        <span style={{ fontFamily: serif, fontSize: 11, color: T.ink3 }}>{cat.done}/{cat.total}</span>
      </div>
      {expanded && cat.children.map(child => {
        if (child.children) {
          return <div key={child.id} style={{ paddingLeft: 16 }}><OutlineCategoryB cat={child} variant={variant} idx={0} compact={compact} /></div>;
        }
        return (
          <div key={child.id} style={{ display: 'grid', gridTemplateColumns: '18px 1fr 50px 26px', alignItems: 'center', gap: 6, padding: '4px 0 4px 24px', cursor: 'pointer' }}>
            <span style={{ width: 7, height: 7, background: T[TIERS[child.tier].key], borderRadius: child.tier === 'untouched' ? '50%' : 0, border: child.tier === 'untouched' ? `0.5px solid ${T.line2}` : 'none', boxSizing: 'border-box' }} />
            <span style={{ color: T.ink2, fontSize: 12.5, letterSpacing: '0.06em' }}>{child.title}</span>
            <StatusBar tier={child.tier} strength={child.s} width={44} size="sm" variant={variant} />
            <span style={{ fontFamily: serif, fontSize: 11, color: T.ink3, textAlign: 'right' }}>{child.tier === 'untouched' ? '—' : child.s}</span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { B_Home_Desktop, B_Home_Mobile, BTopBar, BPageHeader, BSectionTitle, VerticalLabel, cnNum });
