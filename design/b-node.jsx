// Variant B — Node page (F01)
// Classical book-page treatment: vertical edge label, asymmetric grid, 朱砂 accents.

function B_Node_Desktop() {
  const variant = 'B';
  const T = TOKENS[variant];
  const N = NODE_LIVER;
  const serif = '"Noto Serif SC", serif';

  return (
    <div data-screen-label="08 B · Node (Desktop)" style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.ink,
      fontFamily: serif,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <BTopBar variant={variant} />

      {/* breadcrumb */}
      <div style={{ padding: '14px 56px 0', display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: T.ink3, letterSpacing: '0.16em' }}>
        <span style={{ color: T.ink2 }}>← 返</span>
        <span style={{ color: T.line2 }}>·</span>
        <span>{N.category}</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', display: 'grid', gridTemplateColumns: '36px 1fr 36px', position: 'relative' }}>

        {/* far-left vertical label */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 60 }}>
          <VerticalLabel variant={variant} fontSize={11} color={T.ink3}>五 脏 · 肝 卷</VerticalLabel>
        </div>

        {/* Main */}
        <div style={{ padding: '36px 16px 64px 12px' }}>
          {/* Title block */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'flex-end', paddingBottom: 24, borderBottom: `0.5px solid ${T.line2}`, position: 'relative' }}>
            <div>
              <div style={{ fontFamily: serif, fontSize: 13, color: T.accent, letterSpacing: '0.4em', marginBottom: 6 }}>肝 · GĀN</div>
              <h1 style={{
                fontFamily: serif, fontSize: 96, fontWeight: 500,
                margin: 0, lineHeight: 1, letterSpacing: '0.06em',
                color: T.ink,
              }}>肝</h1>
              <div style={{ fontFamily: serif, fontSize: 18, color: T.ink2, marginTop: 16, fontStyle: 'normal', letterSpacing: '0.14em' }}>
                主 疏 泄 ， 主 藏 血
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: T.ink3, letterSpacing: '0.22em', marginBottom: 8 }}>当 前 强 度</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: serif, fontSize: 48, fontWeight: 500, color: T.ink, lineHeight: 1 }}>88</span>
                <span style={{ fontFamily: serif, fontSize: 13, color: T.s_mastered, letterSpacing: '0.16em' }}>熟练</span>
              </div>
              <StatusBar tier="mastered" strength={88} width={150} size="lg" variant={variant} />
              <div style={{ fontSize: 11, color: T.ink3, marginTop: 10, letterSpacing: '0.12em' }}>
                访 十二 次 · 上 次 二日 前
              </div>
              <button style={{
                marginTop: 14, background: T.accent, color: T.paper, border: 'none',
                padding: '12px 22px', fontFamily: serif, fontSize: 15, letterSpacing: '0.16em', cursor: 'pointer',
              }}>测试自己 · 一二题</button>
            </div>
          </div>

          {/* Two-column reading: template + body */}
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 56, paddingTop: 36 }}>
            {/* Template — inline rows like a 表 */}
            <div>
              <div style={{ fontFamily: serif, fontSize: 14, color: T.accent, letterSpacing: '0.3em', marginBottom: 14, paddingBottom: 6, borderBottom: `0.5px solid ${T.line2}` }}>
                壹 · 系统联系
              </div>
              {N.template.map((row, i) => (
                <div key={row.k} style={{
                  display: 'grid', gridTemplateColumns: '70px 1fr',
                  padding: '11px 0',
                  borderBottom: `0.5px dotted ${T.line}`,
                  alignItems: 'baseline',
                }}>
                  <span style={{ fontFamily: serif, fontSize: 12, color: T.ink3, letterSpacing: '0.3em' }}>{row.k}</span>
                  <span style={{ fontFamily: serif, fontSize: 17, color: T.ink, fontWeight: 500, letterSpacing: '0.12em' }}>{row.v}</span>
                </div>
              ))}
              <div style={{ marginTop: 32, fontFamily: serif, fontSize: 14, color: T.accent, letterSpacing: '0.3em', marginBottom: 14, paddingBottom: 6, borderBottom: `0.5px solid ${T.line2}` }}>
                贰 · 临床要点
              </div>
              <div style={{ fontFamily: serif, fontSize: 14, color: T.ink2, lineHeight: 2, letterSpacing: '0.06em' }}>
                <div style={{ fontSize: 11, color: T.ink3, marginBottom: 4 }}>常 见 证 型</div>
                {N.clinical.map((c, i) => {
                  const ct = i === 0 ? 'mastered' : i === 1 ? 'learned' : 'untouched';
                  return (
                    <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 7, height: 7, background: T[TIERS[ct].key], borderRadius: ct === 'untouched' ? '50%' : 0, border: ct === 'untouched' ? `0.5px solid ${T.line2}` : 'none', boxSizing: 'border-box' }} />
                      <span style={{ color: T.ink, borderBottom: `1px solid ${T[TIERS[ct].key]}`, paddingBottom: 1 }}>{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Body */}
            <div style={{ maxWidth: 640 }}>
              <div style={{ fontFamily: serif, fontSize: 14, color: T.accent, letterSpacing: '0.3em', marginBottom: 18, paddingBottom: 6, borderBottom: `0.5px solid ${T.line2}` }}>
                叁 · 主要功能
              </div>
              {N.body.map((sec, i) => (
                <div key={sec.h} style={{ marginBottom: 36 }}>
                  <h2 style={{ fontFamily: serif, fontSize: 26, fontWeight: 500, margin: '0 0 14px', letterSpacing: '0.18em', color: T.ink, display: 'flex', alignItems: 'baseline', gap: 14 }}>
                    <span style={{ color: T.accent, fontSize: 16, letterSpacing: 0 }}>{cnNum(i + 1)}</span>
                    {sec.h}
                  </h2>
                  <div style={{ fontFamily: serif, fontSize: 15.5, lineHeight: 2, color: T.ink2, letterSpacing: '0.04em' }}>
                    {sec.lines.map((l, j) => (
                      <div key={j} style={{
                        textIndent: l.startsWith('·') ? 0 : '2em',
                        marginBottom: 2,
                      }}>{l}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related */}
          <BRelated related={N.related} variant={variant} />
        </div>

        {/* far-right margin */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 36 }}>
          <span style={{ fontFamily: serif, fontSize: 11, color: T.ink3, letterSpacing: '0.3em', writingMode: 'vertical-rl' }}>—— 一 八 ——</span>
        </div>
      </div>
    </div>
  );
}

function BRelated({ related, variant = 'B' }) {
  const T = TOKENS[variant];
  const serif = '"Noto Serif SC", serif';
  const groups = [
    { num: '甲', label: '前 置',   items: related.prereq },
    { num: '乙', label: '并 列',   items: related.siblings },
    { num: '丙', label: '关 系',   items: related.relations.map(x => ({ id: x.target, title: x.target, tier: x.tier, s: x.s, rel: x.rel })) },
    { num: '丁', label: '延 伸',   items: related.extend },
  ];
  return (
    <div style={{ marginTop: 56, paddingTop: 28, borderTop: `0.5px solid ${T.line2}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 22 }}>
        <span style={{ fontFamily: serif, fontSize: 14, color: T.accent, letterSpacing: '0.3em' }}>肆</span>
        <span style={{ fontFamily: serif, fontSize: 19, fontWeight: 500, letterSpacing: '0.2em' }}>相 关</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
        {groups.map(g => (
          <div key={g.label}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10, paddingBottom: 6, borderBottom: `0.5px solid ${T.line2}` }}>
              <span style={{ color: T.accent, fontFamily: serif, fontSize: 12 }}>{g.num}</span>
              <span style={{ fontFamily: serif, fontSize: 15, fontWeight: 500, letterSpacing: '0.18em' }}>{g.label}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {g.items.map((it, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '12px 1fr 46px', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                  <span style={{ width: 8, height: 8, background: T[TIERS[it.tier].key], borderRadius: it.tier === 'untouched' ? '50%' : 0, border: it.tier === 'untouched' ? `0.5px solid ${T.line2}` : 'none', boxSizing: 'border-box' }} />
                  <div style={{ fontSize: 14 }}>
                    {it.rel && <span style={{ fontSize: 11, color: T.ink3, marginRight: 6 }}>{it.rel} →</span>}
                    <span style={{ color: T.ink, borderBottom: `1px solid ${T[TIERS[it.tier].key]}` }}>{it.title}</span>
                  </div>
                  <StatusBar tier={it.tier} strength={it.s} width={36} size="sm" variant={variant} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mobile B node ──────────────────────────────────────

function B_Node_Mobile() {
  const variant = 'B';
  const T = TOKENS[variant];
  const N = NODE_LIVER;
  const serif = '"Noto Serif SC", serif';

  return (
    <div data-screen-label="11 B · Node (Mobile)" style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.ink,
      fontFamily: serif,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', fontSize: 13 }}>
        <span>9:41</span><span style={{ fontSize: 11 }}>● ●● 5G ●●●</span>
      </div>
      <div style={{ padding: '6px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `0.5px solid ${T.line2}`, fontSize: 12 }}>
        <span style={{ color: T.ink2, letterSpacing: '0.12em' }}>← 五脏</span>
        <span style={{ color: T.ink3, fontSize: 10 }}>⌕</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px 110px' }}>
        <div style={{ fontFamily: serif, fontSize: 11, color: T.accent, letterSpacing: '0.4em' }}>肝 · GĀN</div>
        <h1 style={{ fontFamily: serif, fontSize: 72, fontWeight: 500, margin: '4px 0 6px', lineHeight: 0.95 }}>肝</h1>
        <div style={{ fontFamily: serif, fontSize: 15, color: T.ink2, letterSpacing: '0.16em' }}>主 疏 泄 ， 主 藏 血</div>

        <div style={{ marginTop: 18, paddingTop: 14, paddingBottom: 14, borderTop: `0.5px solid ${T.line2}`, borderBottom: `0.5px solid ${T.line2}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em' }}>强 度</div>
            <div style={{ fontFamily: serif, fontSize: 30, fontWeight: 500, lineHeight: 1 }}>88 <span style={{ fontSize: 12, color: T.s_mastered, letterSpacing: '0.2em' }}>熟练</span></div>
          </div>
          <StatusBar tier="mastered" strength={88} width={90} size="lg" variant={variant} />
        </div>

        <div style={{ marginTop: 20, fontFamily: serif, fontSize: 13, color: T.accent, letterSpacing: '0.3em', paddingBottom: 6, borderBottom: `0.5px solid ${T.line2}` }}>壹 · 系统联系</div>
        <div style={{ marginBottom: 24 }}>
          {N.template.map(row => (
            <div key={row.k} style={{ display: 'grid', gridTemplateColumns: '70px 1fr', padding: '8px 0', borderBottom: `0.5px dotted ${T.line}` }}>
              <span style={{ fontSize: 12, color: T.ink3, letterSpacing: '0.3em' }}>{row.k}</span>
              <span style={{ fontSize: 15, color: T.ink, letterSpacing: '0.1em' }}>{row.v}</span>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: serif, fontSize: 13, color: T.accent, letterSpacing: '0.3em', paddingBottom: 6, borderBottom: `0.5px solid ${T.line2}` }}>贰 · 主要功能</div>
        {N.body.map((sec, i) => (
          <div key={sec.h} style={{ marginTop: 18, marginBottom: 18 }}>
            <h2 style={{ fontFamily: serif, fontSize: 21, fontWeight: 500, letterSpacing: '0.18em', margin: '0 0 10px', display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ color: T.accent, fontSize: 13, letterSpacing: 0 }}>{cnNum(i + 1)}</span>
              {sec.h}
            </h2>
            <div style={{ fontSize: 13.5, lineHeight: 2, color: T.ink2 }}>
              {sec.lines.map((l, j) => (
                <div key={j} style={{ textIndent: l.startsWith('·') ? 0 : '2em' }}>{l}</div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ fontFamily: serif, fontSize: 13, color: T.accent, letterSpacing: '0.3em', paddingBottom: 6, borderBottom: `0.5px solid ${T.line2}`, marginTop: 24 }}>叁 · 相关</div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: '前置', items: N.related.prereq },
            { label: '并列', items: N.related.siblings },
            { label: '延伸', items: N.related.extend },
          ].map(g => (
            <div key={g.label}>
              <div style={{ fontSize: 12, color: T.ink3, letterSpacing: '0.22em', marginBottom: 6 }}>{g.label}</div>
              {g.items.map((it, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 7, height: 7, background: T[TIERS[it.tier].key], borderRadius: it.tier === 'untouched' ? '50%' : 0, border: it.tier === 'untouched' ? `0.5px solid ${T.line2}` : 'none', boxSizing: 'border-box' }} />
                    <span style={{ fontSize: 14 }}>{it.title}</span>
                  </div>
                  <StatusBar tier={it.tier} strength={it.s} width={42} size="sm" variant={variant} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: T.bg, borderTop: `0.5px solid ${T.line2}`,
        padding: '14px 20px 26px', display: 'flex', gap: 10,
      }}>
        <button style={{ flex: 1, background: T.accent, color: T.paper, border: 'none', padding: '14px', fontFamily: serif, fontSize: 15, letterSpacing: '0.18em' }}>测 试 自 己 · 一二题</button>
        <button style={{ background: 'transparent', color: T.ink, border: `0.5px solid ${T.line2}`, padding: '14px 14px', fontFamily: serif, fontSize: 13, letterSpacing: '0.16em' }}>白纸</button>
      </div>
    </div>
  );
}

Object.assign(window, { B_Node_Desktop, B_Node_Mobile });
