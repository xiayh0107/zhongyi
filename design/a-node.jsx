// Variant A — Node page (F01 · 肝)

const NODE_LIVER = {
  id: 'liver', title: '肝', layer: 'L2 · 五脏',
  summary: '主疏泄, 主藏血',
  category: '中医基础 / 脏腑学说 / 五脏',
  strength: 88, tier: 'mastered', visits: 12, lastVisit: '2 天前',
  questionCount: 12, questionDone: 7,
  template: [
    { k: '五行', v: '木',   ref: 'wood' },
    { k: '在志', v: '怒',   ref: 'anger' },
    { k: '在液', v: '泪',   ref: 'tears' },
    { k: '在体', v: '筋',   ref: 'tendon' },
    { k: '其华', v: '爪',   ref: 'nail' },
    { k: '开窍', v: '目',   ref: 'eye' },
    { k: '表里', v: '胆',   ref: 'gallbladder' },
    { k: '通应', v: '春',   ref: 'spring' },
  ],
  body: [
    { h: '主疏泄', lines: [
      '指肝具有疏通、畅达全身气机，进而促使精血津液的运行输布、脾胃之气的升降、胆汁的分泌排泄。',
      '· 调畅气机',
      '· 维持血液和津液运行',
      '· 助脾升胃降',
      '· 调畅情志',
      '· 促进胆汁分泌排泄',
    ] },
    { h: '主藏血', lines: [
      '指肝有贮藏血液、调节血量和防止出血的功能。',
      '· 涵养肝气',
      '· 调节血量（人动则血运于诸经，人静则血归于肝）',
      '· 濡养筋目',
      '· 化生和濡养肝气',
      '· 防止出血',
    ] },
  ],
  related: {
    prereq:    [{ id: 'wuxing', title: '五行',   tier: 'mastered',  s: 88 }, { id: 'yinyang', title: '阴阳', tier: 'mastered', s: 92 }],
    siblings:  [{ id: 'xin', title: '心', tier: 'learned', s: 72 }, { id: 'pi', title: '脾', tier: 'fading', s: 42 }, { id: 'fei', title: '肺', tier: 'untouched', s: 0 }, { id: 'shen', title: '肾', tier: 'untouched', s: 0 }],
    relations: [
      { rel: '相表里', target: '胆', tier: 'learned',   s: 64 },
      { rel: '精血同源', target: '肾', tier: 'untouched', s: 0  },
      { rel: '木克土',   target: '脾', tier: 'fading',    s: 42 },
    ],
    extend:    [{ id: 'ganyu', title: '肝郁气滞', tier: 'mastered', s: 86 }, { id: 'ganyang', title: '肝阳上亢', tier: 'learned', s: 70 }, { id: 'chaihu', title: '柴胡', tier: 'untouched', s: 0 }],
  },
  clinical: ['肝郁气滞', '肝阳上亢', '肝风内动'],
};

function A_Node_Desktop() {
  const variant = 'A';
  const T = TOKENS[variant];
  const N = NODE_LIVER;
  const serif = '"Noto Serif SC", serif';
  return (
    <div data-screen-label="02 A · Node (Desktop)" style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.ink,
      fontFamily: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <TopBarA variant={variant} />

      {/* breadcrumb */}
      <div style={{ padding: '14px 56px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.ink3 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em' }}>← 返回</span>
        <span style={{ color: T.line2 }}>·</span>
        <span>{N.category.split(' / ').map((seg, i, arr) => (
          <span key={i}>
            <span style={{ color: i === arr.length - 1 ? T.ink2 : T.ink3, cursor: 'pointer' }}>{seg}</span>
            {i < arr.length - 1 && <span style={{ margin: '0 8px', color: T.line2 }}>/</span>}
          </span>
        ))}</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 56px 56px' }}>
        {/* Title row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'flex-start', paddingBottom: 24, borderBottom: `1px solid ${T.line}` }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
              <h1 style={{ fontFamily: serif, fontSize: 56, fontWeight: 500, margin: 0, letterSpacing: '0.04em', lineHeight: 1 }}>{N.title}</h1>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.ink3, letterSpacing: '0.14em' }}>{N.layer}</span>
            </div>
            <div style={{ fontFamily: serif, fontSize: 18, color: T.ink2, marginTop: 10, fontStyle: 'normal' }}>
              {N.summary}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18 }}>
              <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.18em' }}>强度</div>
              <StatusBar tier={N.tier} strength={N.strength} width={120} size="lg" variant={variant} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{N.strength}</span>
              <span style={{ fontFamily: serif, fontSize: 13, color: T[TIERS[N.tier].key], padding: '2px 10px', border: `1px solid ${T[TIERS[N.tier].key]}` }}>{TIERS[N.tier].label}</span>
              <span style={{ fontSize: 11, color: T.ink3 }}>· 访问 {N.visits} 次 · 上次 {N.lastVisit}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            <button style={{
              background: T.ink, color: T.paper, border: 'none', padding: '14px 22px',
              fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', letterSpacing: '0.06em',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontFamily: serif, fontWeight: 500 }}>测试自己</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, opacity: 0.65 }}>{N.questionCount} 题</span>
            </button>
            <div style={{ fontSize: 10, color: T.ink3, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em' }}>
              已答 {N.questionDone} / {N.questionCount} 题
            </div>
          </div>
        </div>

        {/* Body: two-column */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 56, paddingTop: 32 }}>
          {/* Template table */}
          <div>
            <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 10 }}>系统联系 · TEMPLATE</div>
            <div style={{ background: T.paper, border: `1px solid ${T.line}` }}>
              {N.template.map((row, i) => (
                <div key={row.k} style={{
                  display: 'grid', gridTemplateColumns: '52px 1fr',
                  padding: '11px 14px',
                  borderBottom: i === N.template.length - 1 ? 'none' : `1px solid ${T.line}`,
                  alignItems: 'center',
                }}>
                  <span style={{ fontFamily: serif, fontSize: 13, color: T.ink3, letterSpacing: '0.16em' }}>{row.k}</span>
                  <span style={{ fontFamily: serif, fontSize: 16, color: T.ink, fontWeight: 500 }}>{row.v}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 10 }}>临床要点 · CLINICAL</div>
            <div style={{ fontSize: 13, color: T.ink2, lineHeight: 2 }}>
              常见证型 ：
              <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {N.clinical.map((c, i) => {
                  const ct = i === 0 ? 'mastered' : i === 1 ? 'learned' : 'untouched';
                  return (
                    <span key={c} style={{ color: T.ink, borderBottom: `1.5px solid ${T[TIERS[ct].key]}` }}>{c}</span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ maxWidth: 680 }}>
            <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 18 }}>主要功能 · FUNCTIONS</div>
            {N.body.map((sec, i) => (
              <div key={sec.h} style={{ marginBottom: 36 }}>
                <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 500, margin: '0 0 12px', borderBottom: `1px solid ${T.line}`, paddingBottom: 8, color: T.ink }}>
                  <span style={{ color: T.ink3, fontFamily: 'JetBrains Mono, monospace', fontSize: 13, marginRight: 14, fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
                  {sec.h}
                </h2>
                <div style={{ fontFamily: '"Noto Sans SC", serif', fontSize: 15, lineHeight: 1.85, color: T.ink2 }}>
                  {sec.lines.map((l, j) => <div key={j} style={{ marginBottom: 4 }}>{l}</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        <RelatedSectionA related={N.related} variant={variant} />
      </div>
    </div>
  );
}

// safe lookup for TIERS by key (avoid crash when index doesn't exist)
function TIERS_safe(key) { return TIERS[key] || TIERS.untouched; }

function RelatedSectionA({ related, variant }) {
  const T = TOKENS[variant];
  const serif = '"Noto Serif SC", serif';
  const groups = [
    { label: '前置',   hint: '推荐先学', items: related.prereq.map(x => ({ ...x, prefix: '' })) },
    { label: '并列',   hint: '同类',     items: related.siblings.map(x => ({ ...x, prefix: '' })) },
    { label: '关系',   hint: '',         items: related.relations.map(x => ({ id: x.target, title: x.target, tier: x.tier, s: x.s, prefix: x.rel })) },
    { label: '延伸',   hint: '可继续探索', items: related.extend.map(x => ({ ...x, prefix: '' })) },
  ];
  return (
    <div style={{ marginTop: 48, paddingTop: 28, borderTop: `1px solid ${T.line}` }}>
      <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 16 }}>相关节点 · RELATED</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
        {groups.map(g => (
          <div key={g.label}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid ${T.line}` }}>
              <span style={{ fontFamily: serif, fontSize: 15, color: T.ink, fontWeight: 500 }}>{g.label}</span>
              {g.hint && <span style={{ fontSize: 11, color: T.ink3 }}>{g.hint}</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {g.items.map((it, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '12px 1fr 50px', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer' }}>
                  <span style={{ width: 8, height: 8, background: T[TIERS_safe(it.tier).key], borderRadius: it.tier === 'untouched' ? '50%' : 0, border: it.tier === 'untouched' ? `1px solid ${T.line2}` : 'none', boxSizing: 'border-box' }} />
                  <div>
                    {it.prefix && <span style={{ fontSize: 11, color: T.ink3, marginRight: 6 }}>{it.prefix} →</span>}
                    <span style={{ fontFamily: serif, fontSize: 15, color: T.ink, borderBottom: `1.5px solid ${T[TIERS_safe(it.tier).key]}`, paddingBottom: 1 }}>{it.title}</span>
                  </div>
                  <StatusBar tier={it.tier} strength={it.s} width={40} size="sm" variant={variant} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mobile node ─────────────────────────────────────────
function A_Node_Mobile() {
  const variant = 'A';
  const T = TOKENS[variant];
  const N = NODE_LIVER;
  const serif = '"Noto Serif SC", serif';

  return (
    <div data-screen-label="05 A · Node (Mobile)" style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.ink,
      fontFamily: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>
        <span>9:41</span><span style={{ fontSize: 11 }}>● ●● 5G ●●●</span>
      </div>
      <div style={{ padding: '6px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${T.line}`, fontSize: 12 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: T.ink3 }}>← 五脏</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: T.ink3, fontSize: 10 }}>⌕ · ⋯</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '22px 20px 110px' }}>
        <div style={{ fontSize: 11, color: T.ink3, letterSpacing: '0.18em' }}>{N.category}</div>
        <h1 style={{ fontFamily: serif, fontSize: 44, fontWeight: 500, margin: '6px 0 6px', lineHeight: 1 }}>{N.title}</h1>
        <div style={{ fontFamily: serif, fontSize: 16, color: T.ink2, marginBottom: 14 }}>{N.summary}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${T.line}` }}>
          <StatusBar tier={N.tier} strength={N.strength} width={80} size="lg" variant={variant} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14 }}>{N.strength}</span>
          <span style={{ fontFamily: serif, fontSize: 11, color: T[TIERS[N.tier].key], padding: '1px 7px', border: `1px solid ${T[TIERS[N.tier].key]}` }}>{TIERS[N.tier].label}</span>
        </div>

        <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 8 }}>系统联系</div>
        <div style={{ background: T.paper, border: `1px solid ${T.line}`, marginBottom: 28 }}>
          {N.template.map((row, i) => (
            <div key={row.k} style={{
              display: 'grid', gridTemplateColumns: '60px 1fr', padding: '9px 14px',
              borderBottom: i === N.template.length - 1 ? 'none' : `1px solid ${T.line}`,
            }}>
              <span style={{ fontFamily: serif, fontSize: 12, color: T.ink3, letterSpacing: '0.16em' }}>{row.k}</span>
              <span style={{ fontFamily: serif, fontSize: 15, color: T.ink }}>{row.v}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 8 }}>主要功能</div>
        {N.body.map((sec, i) => (
          <div key={sec.h} style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: serif, fontSize: 19, fontWeight: 500, margin: '0 0 8px', borderBottom: `1px solid ${T.line}`, paddingBottom: 5 }}>
              <span style={{ color: T.ink3, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, marginRight: 10 }}>{String(i + 1).padStart(2, '0')}</span>
              {sec.h}
            </h2>
            <div style={{ fontSize: 13.5, lineHeight: 1.8, color: T.ink2 }}>
              {sec.lines.map((l, j) => <div key={j} style={{ marginBottom: 3 }}>{l}</div>)}
            </div>
          </div>
        ))}

        <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', margin: '24px 0 10px' }}>相关节点</div>
        <div style={{ background: T.paper, border: `1px solid ${T.line}` }}>
          {[
            { label: '前置', items: N.related.prereq },
            { label: '并列', items: N.related.siblings },
            { label: '延伸', items: N.related.extend },
          ].map((g, gi) => (
            <div key={g.label} style={{ padding: '12px 14px', borderBottom: gi === 2 ? 'none' : `1px solid ${T.line}` }}>
              <div style={{ fontFamily: serif, fontSize: 12, color: T.ink3, marginBottom: 8, letterSpacing: '0.12em' }}>{g.label}</div>
              {g.items.map((it, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 7, height: 7, background: T[TIERS[it.tier].key], borderRadius: it.tier === 'untouched' ? '50%' : 0, border: it.tier === 'untouched' ? `1px solid ${T.line2}` : 'none', boxSizing: 'border-box' }} />
                    <span style={{ fontFamily: serif, fontSize: 14 }}>{it.title}</span>
                  </div>
                  <StatusBar tier={it.tier} strength={it.s} width={42} size="sm" variant={variant} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* fixed CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: T.bg, borderTop: `1px solid ${T.line}`,
        padding: '14px 20px 26px', display: 'flex', gap: 10,
      }}>
        <button style={{
          flex: 1, background: T.ink, color: T.paper, border: 'none', padding: '14px 18px',
          fontFamily: '"Noto Serif SC", serif', fontSize: 15, letterSpacing: '0.06em',
        }}>测试自己 · {N.questionCount} 题</button>
        <button style={{
          background: 'transparent', color: T.ink, border: `1px solid ${T.ink}`,
          padding: '14px 14px', fontFamily: 'inherit', fontSize: 13,
        }}>白纸召回</button>
      </div>
    </div>
  );
}

Object.assign(window, { A_Node_Desktop, A_Node_Mobile });
