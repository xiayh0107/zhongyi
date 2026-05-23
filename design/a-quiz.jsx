// Variant A — Quiz flow (F03 · 题目流)
// Shows mid-flow state with feedback shown for an answered question.

const QUIZ_LIVER = {
  node: '肝',
  total: 5,
  current: 3,        // currently on question 3
  questions: [
    // q1, q2 done; q3 current (single_choice with feedback shown)
    { type: 'single_choice', stem: '下列哪一项是肝主疏泄的功能？',
      options: [
        { id: 'a', text: '统血',        correct: false, picked: false },
        { id: 'b', text: '调畅气机',    correct: true,  picked: true  },
        { id: 'c', text: '主水',         correct: false, picked: false },
        { id: 'd', text: '主运化',      correct: false, picked: false },
      ],
      why: '肝主疏泄的核心是「调畅气机」——气机畅则血、津、情志、脾胃升降、胆汁排泄皆顺。「统血」是脾的功能，「主水」是肾的功能，「主运化」也是脾的功能。',
      refs: ['肝', '主疏泄', '脾'],
    },
  ],
  // up next preview (fill-in-blank)
  preview: { type: 'fill_in_blank', stem: '肝在五行属 ___ ，在志为 ___，开窍于 ___。' },
};

function A_Quiz_Desktop() {
  const variant = 'A';
  const T = TOKENS[variant];
  const Q = QUIZ_LIVER.questions[0];
  const serif = '"Noto Serif SC", serif';

  return (
    <div data-screen-label="03 A · Quiz (Desktop)" style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.ink,
      fontFamily: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Top thin bar — just exit + node context. NO timer, NO score. */}
      <div style={{ height: 52, padding: '0 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${T.line}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, fontSize: 12 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: T.ink3, letterSpacing: '0.12em' }}>✕ 退出</span>
          <span style={{ color: T.line2 }}>·</span>
          <span style={{ color: T.ink3 }}>测试自己</span>
          <span style={{ color: T.line2 }}>·</span>
          <span style={{ fontFamily: serif, fontSize: 15, color: T.ink, borderBottom: `1.5px solid ${T.s_mastered}`, paddingBottom: 1 }}>{QUIZ_LIVER.node}</span>
        </div>

        {/* Progress dots — NOT % NOT timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.ink3, letterSpacing: '0.1em' }}>第 {QUIZ_LIVER.current} / {QUIZ_LIVER.total} 题</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {[...Array(QUIZ_LIVER.total)].map((_, i) => {
              const state = i < QUIZ_LIVER.current - 1 ? 'done' : i === QUIZ_LIVER.current - 1 ? 'current' : 'pending';
              return (
                <span key={i} style={{
                  width: 18, height: 4,
                  background: state === 'done' ? T.s_mastered : state === 'current' ? T.ink : T.line,
                }} />
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', display: 'grid', gridTemplateColumns: '1fr 380px' }}>

        {/* ── Center: Q + options + feedback ── */}
        <div style={{ padding: '56px 80px 56px 80px', maxWidth: 820 }}>
          <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 14 }}>
            题型 · SINGLE CHOICE · 单选
          </div>
          <div style={{ fontFamily: serif, fontSize: 28, fontWeight: 500, lineHeight: 1.5, marginBottom: 36, color: T.ink }}>
            {Q.stem}
          </div>

          {/* Options — shown post-answer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {Q.options.map(opt => {
              const isCorrect = opt.correct;
              const isPicked = opt.picked;
              let border = T.line, bg = T.paper, ink = T.ink, badge = null;
              if (isCorrect) {
                border = T.s_mastered; bg = T.paper;
                badge = <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.s_mastered, letterSpacing: '0.12em' }}>✓ 正确</span>;
              }
              if (isPicked && isCorrect) {
                bg = '#eef1e6';
                badge = <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.s_mastered, letterSpacing: '0.12em' }}>✓ 你的答案 · 正确</span>;
              }
              return (
                <div key={opt.id} style={{
                  background: bg, border: `1px solid ${border}`,
                  padding: '16px 20px', display: 'grid', gridTemplateColumns: '32px 1fr auto', alignItems: 'center', gap: 14,
                  cursor: 'pointer',
                }}>
                  <span style={{
                    fontFamily: serif, fontSize: 15, color: isCorrect ? T.s_mastered : T.ink3,
                    width: 26, height: 26, border: `1px solid ${isCorrect ? T.s_mastered : T.line2}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 500,
                  }}>{opt.id.toUpperCase()}</span>
                  <span style={{ fontFamily: serif, fontSize: 17, color: ink, lineHeight: 1.4 }}>{opt.text}</span>
                  {badge}
                </div>
              );
            })}
          </div>

          {/* Feedback / Why */}
          <div style={{ marginTop: 16, padding: '22px 24px', background: T.paper, border: `1px solid ${T.line}`, borderLeft: `3px solid ${T.s_mastered}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontFamily: serif, fontSize: 16, color: T.s_mastered, fontWeight: 500 }}>✓ 答对</span>
                <span style={{ fontSize: 11, color: T.ink3, letterSpacing: '0.16em' }}>WHY ?</span>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.ink3 }}>
                肝.强度 <span style={{ color: T.s_mastered }}>88 → 91</span>
                <span style={{ color: T.s_mastered, marginLeft: 4 }}>↑</span>
              </span>
            </div>
            <div style={{ fontFamily: serif, fontSize: 15, lineHeight: 1.85, color: T.ink2 }}>
              {Q.why}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 12, color: T.ink3 }}>
              <span style={{ letterSpacing: '0.12em' }}>引用</span>
              {Q.refs.map(r => (
                <span key={r} style={{ fontFamily: serif, color: T.ink, borderBottom: `1.5px solid ${T.s_learned}`, paddingBottom: 1, cursor: 'pointer' }}>{r}</span>
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
            <button style={{ background: 'transparent', border: 'none', color: T.ink3, fontFamily: 'inherit', fontSize: 12, letterSpacing: '0.12em', cursor: 'pointer' }}>
              ⚑ 标记复习
            </button>
            <button style={{
              background: T.ink, color: T.paper, border: 'none', padding: '14px 28px',
              fontFamily: serif, fontSize: 15, letterSpacing: '0.08em', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              下一题 <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, opacity: 0.65 }}>↵</span>
            </button>
          </div>
        </div>

        {/* ── Right: side rail. Context only, no leaderboard. ── */}
        <div style={{ background: T.paper, borderLeft: `1px solid ${T.line}`, padding: '56px 32px' }}>
          <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 14 }}>本轮节奏</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { i: 1, t: 'single_choice', label: '气机', state: 'done', ok: true },
              { i: 2, t: 'match',         label: '五脏 ↔ 在液', state: 'done', ok: true },
              { i: 3, t: 'single_choice', label: '本题', state: 'current' },
              { i: 4, t: 'fill_in_blank', label: '五行属性',       state: 'pending' },
              { i: 5, t: 'derive',        label: '推导 · 木克土', state: 'pending' },
            ].map(q => (
              <div key={q.i} style={{
                padding: '10px 12px',
                background: q.state === 'current' ? T.sheet : 'transparent',
                border: q.state === 'current' ? `1px solid ${T.line2}` : `1px solid transparent`,
                display: 'grid', gridTemplateColumns: '20px 1fr 60px', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.ink3 }}>{String(q.i).padStart(2, '0')}</span>
                <div>
                  <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 14, color: q.state === 'pending' ? T.ink3 : T.ink }}>{q.label}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3, letterSpacing: '0.08em', marginTop: 2 }}>{q.t}</div>
                </div>
                {q.state === 'done' && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.s_mastered, textAlign: 'right' }}>✓</span>}
                {q.state === 'current' && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink, letterSpacing: '0.12em', textAlign: 'right' }}>当前</span>}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 36, paddingTop: 22, borderTop: `1px solid ${T.line}` }}>
            <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 10 }}>节点状态</div>
            <div style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 24, color: T.ink, marginBottom: 8 }}>肝</div>
            <StatusBar tier="mastered" strength={88} width={120} size="lg" variant={variant} showValue />
            <div style={{ fontSize: 11, color: T.ink3, marginTop: 12, lineHeight: 1.6 }}>
              本轮结束后强度将更新 · 不显示得分
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile quiz ─────────────────────────────────────────
function A_Quiz_Mobile() {
  const variant = 'A';
  const T = TOKENS[variant];
  const Q = QUIZ_LIVER.questions[0];
  const serif = '"Noto Serif SC", serif';

  return (
    <div data-screen-label="06 A · Quiz (Mobile)" style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.ink,
      fontFamily: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>
        <span>9:41</span><span style={{ fontSize: 11 }}>● ●● 5G ●●●</span>
      </div>

      {/* nav bar */}
      <div style={{ padding: '6px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${T.line}` }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.ink3, letterSpacing: '0.12em' }}>✕</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3 }}>{QUIZ_LIVER.current} / {QUIZ_LIVER.total}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[...Array(QUIZ_LIVER.total)].map((_, i) => {
              const state = i < QUIZ_LIVER.current - 1 ? 'done' : i === QUIZ_LIVER.current - 1 ? 'current' : 'pending';
              return <span key={i} style={{ width: 14, height: 3, background: state === 'done' ? T.s_mastered : state === 'current' ? T.ink : T.line }} />;
            })}
          </div>
        </div>
        <span style={{ fontFamily: serif, fontSize: 13, color: T.ink, borderBottom: `1.5px solid ${T.s_mastered}` }}>{QUIZ_LIVER.node}</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '24px 20px 24px' }}>
        <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 10 }}>单选 · SINGLE</div>
        <div style={{ fontFamily: serif, fontSize: 21, lineHeight: 1.5, marginBottom: 22 }}>{Q.stem}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {Q.options.map(opt => {
            const isCorrect = opt.correct, isPicked = opt.picked;
            const bg = (isPicked && isCorrect) ? '#eef1e6' : T.paper;
            const border = isCorrect ? T.s_mastered : T.line;
            return (
              <div key={opt.id} style={{ background: bg, border: `1px solid ${border}`, padding: '13px 14px', display: 'grid', gridTemplateColumns: '26px 1fr auto', gap: 10, alignItems: 'center' }}>
                <span style={{ width: 22, height: 22, border: `1px solid ${isCorrect ? T.s_mastered : T.line2}`, color: isCorrect ? T.s_mastered : T.ink3, fontFamily: serif, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{opt.id.toUpperCase()}</span>
                <span style={{ fontFamily: serif, fontSize: 15 }}>{opt.text}</span>
                {isPicked && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.s_mastered }}>✓</span>}
              </div>
            );
          })}
        </div>

        <div style={{ padding: '16px 14px', background: T.paper, border: `1px solid ${T.line}`, borderLeft: `3px solid ${T.s_mastered}` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: serif, fontSize: 14, color: T.s_mastered }}>✓ 答对 · Why</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.s_mastered }}>88 → 91 ↑</span>
          </div>
          <div style={{ fontFamily: serif, fontSize: 13.5, lineHeight: 1.8, color: T.ink2 }}>{Q.why}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, fontSize: 11, color: T.ink3 }}>
            <span>引用</span>
            {Q.refs.map(r => <span key={r} style={{ fontFamily: serif, color: T.ink, borderBottom: `1.5px solid ${T.s_learned}` }}>{r}</span>)}
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={{ borderTop: `1px solid ${T.line}`, padding: '14px 20px 26px', background: T.bg, display: 'flex', gap: 10 }}>
        <button style={{ background: 'transparent', border: `1px solid ${T.line2}`, color: T.ink2, padding: '12px 14px', fontFamily: 'inherit', fontSize: 12, letterSpacing: '0.12em' }}>⚑</button>
        <button style={{ flex: 1, background: T.ink, color: T.paper, border: 'none', padding: '14px', fontFamily: serif, fontSize: 15, letterSpacing: '0.06em' }}>下一题 ↵</button>
      </div>
    </div>
  );
}

Object.assign(window, { A_Quiz_Desktop, A_Quiz_Mobile });
