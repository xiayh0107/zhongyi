// Variant A — F05 白纸召回 · 三态
// F05-1 进入前 · F05-2 进行中 · F05-3 提交后反馈

function RecallShell({ children, variant = 'A', screenLabel }) {
  const T = TOKENS[variant];
  return (
    <div data-screen-label={screenLabel} style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.ink,
      fontFamily: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

function RecallTopBar({ variant, title, timer, right }) {
  const T = TOKENS[variant];
  const titleFont = '"Noto Serif SC", serif';
  return (
    <div style={{
      height: 56, padding: '0 56px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: `1px solid ${T.line}`, background: T.bg,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <span style={{ fontFamily: titleFont, fontSize: 15, fontWeight: 500, letterSpacing: '0.04em', color: T.ink2 }}>
          Fast Memory
        </span>
        <span style={{ color: T.ink3, fontSize: 11 }}>·</span>
        <span style={{ fontFamily: titleFont, fontSize: 15, color: T.ink }}>{title}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {timer != null && (
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: T.ink,
            letterSpacing: '0.06em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            <span style={{ color: T.ink3, marginRight: 6 }}>⏱</span>
            {timer}
          </span>
        )}
        {right}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// F05-1 · 进入前
// ─────────────────────────────────────────────────────────────

function RecallIntro({ variant = 'A' }) {
  const T = TOKENS[variant];
  const titleFont = '"Noto Serif SC", serif';

  return (
    <RecallShell screenLabel="28 A · 白纸召回 · 进入前" variant={variant}>
      <RecallTopBar variant={variant} title="白纸召回 · 肝" />

      <div style={{
        flex: 1, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-start',
        padding: '72px 32px 64px',
      }}>
        <div style={{ width: '100%', maxWidth: 640 }}>

          {/* eyebrow */}
          <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.28em', marginBottom: 16 }}>
            F05 · BLANK-PAGE RECALL · 主动检索
          </div>

          <h1 style={{
            fontFamily: titleFont, fontSize: 40, fontWeight: 500, margin: 0,
            letterSpacing: '0.04em', lineHeight: 1.15,
          }}>
            给你空白
          </h1>

          <div style={{
            marginTop: 22, fontSize: 16, color: T.ink2, lineHeight: 1.85,
            fontFamily: titleFont, fontStyle: 'italic',
          }}>
            写出所有能想起来的、关于 <span style={{ color: T.ink, fontStyle: 'normal', fontWeight: 500 }}>「肝」</span> 的知识点。
          </div>

          <div style={{
            marginTop: 12,
            display: 'flex', flexWrap: 'wrap', gap: 8,
            fontSize: 12, color: T.ink3,
            fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em',
          }}>
            <span>功能</span><span>·</span>
            <span>属性</span><span>·</span>
            <span>关系</span><span>·</span>
            <span>相关证候</span><span>·</span>
            <span>用药</span>
          </div>

          <div style={{
            marginTop: 36, padding: '28px 32px',
            background: T.paper, border: `1px solid ${T.line}`,
            position: 'relative',
          }}>
            {/* corner mark, decorative tick */}
            <span style={{
              position: 'absolute', top: -1, left: -1, width: 10, height: 10,
              borderTop: `2px solid ${T.s_mastered}`, borderLeft: `2px solid ${T.s_mastered}`,
            }} />
            <div style={{ fontFamily: titleFont, fontSize: 17, lineHeight: 1.8, color: T.ink, marginBottom: 10 }}>
              这是最强的检索练习。
            </div>
            <div style={{ fontSize: 13, color: T.ink2, lineHeight: 1.8 }}>
              做完后会告诉你哪些命中、哪些遗漏。<br/>
              <span style={{ color: T.ink3 }}>不必担心顺序或完整性 · 想到什么写什么。</span>
            </div>
          </div>

          <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 18 }}>
            <button style={{
              background: T.ink, color: T.paper, border: 'none', borderRadius: 0,
              padding: '14px 32px', fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
              letterSpacing: '0.2em', cursor: 'pointer',
            }}>开 始</button>
            <a style={{
              fontSize: 12, color: T.ink3, letterSpacing: '0.14em',
              cursor: 'pointer',
            }}>稍后再说</a>
          </div>

          {/* meta */}
          <div style={{
            marginTop: 48, paddingTop: 22,
            borderTop: `1px solid ${T.line}`,
            display: 'flex', gap: 32,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.ink3,
            letterSpacing: '0.12em',
          }}>
            <div>当前节点强度 · <span style={{ color: T.ink }}>72</span></div>
            <div>历史召回次数 · <span style={{ color: T.ink }}>2</span></div>
            <div>最近一次 · 12 天前</div>
          </div>
        </div>
      </div>
    </RecallShell>
  );
}

// ─────────────────────────────────────────────────────────────
// F05-2 · 进行中
// ─────────────────────────────────────────────────────────────

function RecallActive({ variant = 'A' }) {
  const T = TOKENS[variant];
  const titleFont = '"Noto Serif SC", serif';

  const lines = [
    '五行属木',
    '在志为怒',
    '主疏泄',
    '主藏血',
    '与胆相表里',
    '开窍于目',
    '肝郁气滞证',
  ];

  return (
    <RecallShell screenLabel="29 A · 白纸召回 · 进行中" variant={variant}>
      <RecallTopBar variant={variant} title="白纸召回 · 肝" timer="02:34" />

      <div style={{
        flex: 1, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 32px 32px',
      }}>
        <div style={{
          width: '100%', maxWidth: 760, flex: 1,
          display: 'flex', flexDirection: 'column',
        }}>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em' }}>
              你的纸 · AUTO-SAVED · 5s
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.ink3,
              letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums',
            }}>
              字数 <span style={{ color: T.ink }}>87</span> · 行数 <span style={{ color: T.ink }}>7</span>
            </div>
          </div>

          <div style={{
            flex: 1,
            background: T.sheet,
            border: `1px solid ${T.line}`,
            padding: '28px 36px',
            fontFamily: titleFont,
            fontSize: 17,
            lineHeight: 2,
            color: T.ink,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {lines.map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: 14 }}>
                <span style={{
                  width: 16, color: T.ink3, fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11, paddingTop: 6,
                }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ flex: 1 }}>· {line}</span>
              </div>
            ))}
            {/* caret line */}
            <div style={{ display: 'flex', gap: 14 }}>
              <span style={{
                width: 16, color: T.ink3, fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11, paddingTop: 6,
              }}>08</span>
              <span style={{ flex: 1 }}>
                <span style={{
                  display: 'inline-block', width: 1, height: 22, background: T.ink,
                  verticalAlign: 'middle', animation: 'fm-caret 1s steps(2) infinite',
                }} />
                <style>{`@keyframes fm-caret { 50% { opacity: 0; } }`}</style>
              </span>
            </div>

            {/* faint paper rule lines, decorative */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 33px, ${T.line} 33px, ${T.line} 34px)`,
              opacity: 0.35,
              pointerEvents: 'none',
              zIndex: 0,
            }} />
          </div>

          <div style={{
            marginTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          }}>
            <div style={{ fontSize: 11, color: T.ink3, fontFamily: titleFont, fontStyle: 'italic' }}>
              不必担心顺序 · 想到什么写什么
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <a style={{ fontSize: 12, color: T.ink3, letterSpacing: '0.12em', cursor: 'pointer' }}>放弃</a>
              <button style={{
                background: T.ink, color: T.paper, border: 'none', borderRadius: 0,
                padding: '12px 26px', fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
                letterSpacing: '0.2em', cursor: 'pointer',
              }}>我写完了</button>
            </div>
          </div>
        </div>
      </div>
    </RecallShell>
  );
}

// ─────────────────────────────────────────────────────────────
// F05-3 · 提交后反馈
// ─────────────────────────────────────────────────────────────

function RecallResult({ variant = 'A' }) {
  const T = TOKENS[variant];
  const titleFont = '"Noto Serif SC", serif';

  const hits = [
    '五行属木', '在志为怒', '主疏泄', '主藏血',
    '与胆相表里', '开窍于目', '肝郁气滞证',
    '在液为泪', '在体合筋', '其华在爪',
    '通应春季', '罢极之本',
  ];
  const misses = [
    '调畅情志', '助脾胃运化', '肝阳上亢证',
    '肝风内动', '肝肾同源', '将军之官',
  ];
  const fuzzy = [
    { user: '肝主筋脉', map: '在体合筋', note: '表达不精确' },
  ];

  return (
    <RecallShell screenLabel="30 A · 白纸召回 · 反馈" variant={variant}>
      <RecallTopBar variant={variant} title="白纸召回 · 肝 · 完成" />

      <div style={{
        flex: 1, overflow: 'auto',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        padding: '36px 32px 48px',
      }}>
        <div style={{ width: '100%', maxWidth: 820 }}>

          {/* summary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}` }}>
            <SummaryStat T={T} label="写出" value="12" suffix="个知识点" />
            <SummaryStat T={T} label="用时" value="04:21" mono />
            <SummaryStat T={T} label="覆盖率" value="67%" extra="12 / 18" emphasis last />
          </div>

          {/* hits */}
          <Group T={T} tier="mastered" title="命中" count={hits.length} subtitle="" >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
              {hits.map(h => (
                <span key={h} style={{
                  fontFamily: titleFont, fontSize: 15, color: T.ink,
                  borderBottom: `1.5px solid ${T.s_mastered}`,
                  paddingBottom: 1,
                }}>{h}</span>
              ))}
            </div>
          </Group>

          {/* misses */}
          <Group T={T} tier="untouched" title="你没写出" count={misses.length} subtitle="" mark="✗">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px 24px' }}>
              {misses.map(m => (
                <div key={m} style={{ fontSize: 14, color: T.ink2, padding: '3px 0', display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ color: T.ink3, fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>·</span>
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </Group>

          {/* fuzzy */}
          <Group T={T} tier="learned" title="待评估" count={fuzzy.length} subtitle="判分有边界 · 由你决定">
            {fuzzy.map(f => (
              <div key={f.user} style={{ fontSize: 14, color: T.ink, lineHeight: 1.7 }}>
                <div style={{ fontFamily: titleFont, fontSize: 15 }}>· {f.user}</div>
                <div style={{ marginTop: 4, marginLeft: 14, fontSize: 12, color: T.ink3 }}>
                  → 接近 <span style={{ color: T.ink2, fontFamily: titleFont }}>「{f.map}」</span> · {f.note}
                </div>
                <div style={{ marginTop: 8, marginLeft: 14, display: 'flex', gap: 10 }}>
                  <SmallBtn T={T}>算我对</SmallBtn>
                  <SmallBtn T={T} ghost>不算</SmallBtn>
                </div>
              </div>
            ))}
          </Group>

          {/* self-eval */}
          <div style={{
            marginTop: 36, padding: '22px 28px',
            background: T.paper, border: `1px solid ${T.line}`,
          }}>
            <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 14 }}>
              自评这次质量
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['不太行', '还可以', '不错'].map(label => (
                <button key={label} style={{
                  flex: '1 1 0', minWidth: 120,
                  background: T.sheet, color: T.ink,
                  border: `1px solid ${T.line2}`, borderRadius: 0,
                  padding: '14px 18px',
                  fontFamily: titleFont, fontSize: 15, letterSpacing: '0.08em',
                  cursor: 'pointer',
                }}>{label}</button>
              ))}
            </div>
          </div>

          {/* strength change */}
          <div style={{
            marginTop: 26, padding: '18px 24px',
            background: T.sheet, border: `1px solid ${T.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontFamily: titleFont, fontSize: 18, color: T.ink }}>肝</span>
              <span style={{ fontSize: 11, color: T.ink3, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.16em' }}>强度变化</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <StatusBar tier="learned" strength={72} width={90} variant={variant} showValue />
              <span style={{ color: T.ink3, fontFamily: 'JetBrains Mono, monospace', fontSize: 14 }}>→</span>
              <StatusBar tier="learned" strength={79} width={90} variant={variant} showValue />
              <span style={{
                color: T.s_mastered, fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                letterSpacing: '0.06em',
              }}>+7 ↑</span>
            </div>
          </div>

          {/* actions */}
          <div style={{
            marginTop: 30, display: 'flex', justifyContent: 'space-between', gap: 12,
            flexWrap: 'wrap',
          }}>
            <button style={{
              background: 'transparent', color: T.ink, border: `1px solid ${T.ink}`,
              padding: '13px 24px', fontFamily: 'inherit', fontSize: 13,
              letterSpacing: '0.18em', cursor: 'pointer',
            }}>回到节点</button>
            <button style={{
              background: T.ink, color: T.paper, border: 'none',
              padding: '13px 24px', fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
              letterSpacing: '0.18em', cursor: 'pointer',
            }}>再来一次</button>
          </div>
        </div>
      </div>
    </RecallShell>
  );
}

function SummaryStat({ T, label, value, suffix, extra, mono, emphasis, last }) {
  return (
    <div style={{
      padding: '22px 24px',
      borderRight: last ? 'none' : `1px solid ${T.line}`,
    }}>
      <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 10 }}>{label}</div>
      <div style={{
        fontFamily: mono ? 'JetBrains Mono, monospace' : '"Noto Serif SC", serif',
        fontSize: emphasis ? 34 : 30,
        color: T.ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
        display: 'flex', alignItems: 'baseline', gap: 10,
      }}>
        {value}
        {suffix && <span style={{ fontSize: 12, color: T.ink3, fontFamily: '"Noto Sans SC", sans-serif', letterSpacing: '0.08em' }}>{suffix}</span>}
      </div>
      {extra && (
        <div style={{
          marginTop: 6, fontSize: 11, color: T.ink3,
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em',
        }}>{extra}</div>
      )}
    </div>
  );
}

function Group({ T, tier, title, count, subtitle, children, mark }) {
  const color = T[TIERS[tier].key];
  const titleFont = '"Noto Serif SC", serif';
  return (
    <div style={{ marginTop: 36 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 16,
        paddingBottom: 10, borderBottom: `1px solid ${T.line}`,
      }}>
        <span style={{
          width: 6, height: 18, background: color, display: 'inline-block',
          marginRight: 2, transform: 'translateY(3px)',
        }} />
        <span style={{ fontFamily: titleFont, fontSize: 18, color: T.ink, letterSpacing: '0.04em' }}>{title}</span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.ink3,
          letterSpacing: '0.08em',
        }}>{count}</span>
        {subtitle && <span style={{ fontSize: 11, color: T.ink3, fontStyle: 'italic' }}>· {subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function SmallBtn({ T, ghost, children }) {
  return (
    <button style={{
      background: ghost ? 'transparent' : T.ink,
      color: ghost ? T.ink2 : T.paper,
      border: ghost ? `1px solid ${T.line2}` : 'none',
      padding: '6px 14px',
      fontFamily: 'inherit', fontSize: 12,
      letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 0,
    }}>{children}</button>
  );
}

function A_Recall_Intro_Desktop()  { return <RecallIntro  variant="A" />; }
function A_Recall_Active_Desktop() { return <RecallActive variant="A" />; }
function A_Recall_Result_Desktop() { return <RecallResult variant="A" />; }

Object.assign(window, {
  A_Recall_Intro_Desktop, A_Recall_Active_Desktop, A_Recall_Result_Desktop,
});
