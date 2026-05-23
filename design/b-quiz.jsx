// Variant B — Quiz flow

function B_Quiz_Desktop() {
  const variant = 'B';
  const T = TOKENS[variant];
  const Q = QUIZ_LIVER.questions[0];
  const serif = '"Noto Serif SC", serif';

  return (
    <div data-screen-label="09 B · Quiz (Desktop)" style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.ink,
      fontFamily: serif,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Top bar — minimal, no timer */}
      <div style={{ height: 56, padding: '0 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `0.5px solid ${T.line2}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, fontSize: 13 }}>
          <span style={{ color: T.ink2, letterSpacing: '0.16em' }}>✕ 退</span>
          <span style={{ color: T.line2 }}>·</span>
          <span style={{ color: T.ink3, letterSpacing: '0.18em' }}>测 试 自 己</span>
          <span style={{ color: T.line2 }}>·</span>
          <span style={{ fontSize: 16, color: T.ink, borderBottom: `1px solid ${T.s_mastered}`, paddingBottom: 1 }}>{QUIZ_LIVER.node}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 12, color: T.ink3, letterSpacing: '0.18em' }}>第 {cnNum(QUIZ_LIVER.current)} 题 · 共 {cnNum(QUIZ_LIVER.total)}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {[...Array(QUIZ_LIVER.total)].map((_, i) => {
              const state = i < QUIZ_LIVER.current - 1 ? 'done' : i === QUIZ_LIVER.current - 1 ? 'current' : 'pending';
              return <span key={i} style={{ width: 22, height: 5, background: state === 'done' ? T.s_mastered : state === 'current' ? T.accent : T.line }} />;
            })}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', display: 'grid', gridTemplateColumns: '36px 1fr 360px' }}>

        {/* margin */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 56 }}>
          <VerticalLabel variant={variant} fontSize={11} color={T.ink3}>测 · 第 三 问</VerticalLabel>
        </div>

        {/* center */}
        <div style={{ padding: '56px 64px 64px 0', maxWidth: 820 }}>
          <div style={{ fontFamily: serif, fontSize: 13, color: T.accent, letterSpacing: '0.4em', marginBottom: 14 }}>
            单 选 · 三 / 五
          </div>

          <div style={{ fontFamily: serif, fontSize: 30, fontWeight: 500, lineHeight: 1.55, letterSpacing: '0.06em', marginBottom: 36, color: T.ink }}>
            {Q.stem}
          </div>

          {/* options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
            {Q.options.map(opt => {
              const isCorrect = opt.correct, isPicked = opt.picked;
              const border = isCorrect ? T.s_mastered : T.line2;
              const bg = (isPicked && isCorrect) ? '#ecf0db' : T.paper;
              return (
                <div key={opt.id} style={{
                  background: bg, border: `0.5px solid ${border}`,
                  padding: '18px 24px',
                  display: 'grid', gridTemplateColumns: '30px 1fr auto', alignItems: 'center', gap: 18,
                }}>
                  <span style={{
                    fontFamily: serif, fontSize: 14, color: isCorrect ? T.s_mastered : T.ink3,
                    width: 26, height: 26, border: `0.5px solid ${isCorrect ? T.s_mastered : T.line2}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 500,
                  }}>{cnNum(opt.id.charCodeAt(0) - 96)}</span>
                  <span style={{ fontFamily: serif, fontSize: 18, color: T.ink, letterSpacing: '0.08em', lineHeight: 1.4 }}>{opt.text}</span>
                  {isPicked && isCorrect && <span style={{ fontFamily: serif, fontSize: 11, color: T.s_mastered, letterSpacing: '0.2em' }}>你 选 · 正</span>}
                  {!isPicked && isCorrect && <span style={{ fontFamily: serif, fontSize: 11, color: T.s_mastered, letterSpacing: '0.2em' }}>正 解</span>}
                </div>
              );
            })}
          </div>

          {/* Why */}
          <div style={{ padding: '24px 28px', background: T.paper, border: `0.5px solid ${T.line2}`, position: 'relative' }}>
            <span style={{ position: 'absolute', top: 0, left: 0, width: 6, height: '100%', background: T.s_mastered }} />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <span style={{ fontFamily: serif, fontSize: 17, color: T.s_mastered, letterSpacing: '0.2em' }}>✓ 答 对</span>
                <span style={{ fontSize: 11, color: T.ink3, letterSpacing: '0.3em' }}>·  解</span>
              </div>
              <span style={{ fontFamily: serif, fontSize: 12, color: T.ink3 }}>
                肝 · 强 度 <span style={{ color: T.s_mastered, fontWeight: 500 }}>88 → 91</span> <span style={{ color: T.s_mastered }}>↑</span>
              </span>
            </div>
            <div style={{ fontFamily: serif, fontSize: 16, lineHeight: 2, color: T.ink2, letterSpacing: '0.04em' }}>{Q.why}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, paddingTop: 12, borderTop: `0.5px dotted ${T.line}`, fontSize: 12, color: T.ink3 }}>
              <span style={{ letterSpacing: '0.16em' }}>引</span>
              {Q.refs.map(r => <span key={r} style={{ color: T.ink, borderBottom: `1px solid ${T.s_learned}`, cursor: 'pointer' }}>{r}</span>)}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
            <button style={{ background: 'transparent', border: 'none', color: T.ink3, fontFamily: serif, fontSize: 13, letterSpacing: '0.16em', cursor: 'pointer' }}>⚑ 标 记 复 习</button>
            <button style={{ background: T.accent, color: T.paper, border: 'none', padding: '14px 32px', fontFamily: serif, fontSize: 16, letterSpacing: '0.2em', cursor: 'pointer' }}>下 一 题 · ↵</button>
          </div>
        </div>

        {/* right rail */}
        <div style={{ background: T.paper, borderLeft: `0.5px solid ${T.line2}`, padding: '56px 28px 56px 32px' }}>
          <div style={{ fontFamily: serif, fontSize: 14, color: T.accent, letterSpacing: '0.3em', paddingBottom: 8, borderBottom: `0.5px solid ${T.line2}`, marginBottom: 14 }}>
            本 轮 节 奏
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { i: 1, t: 'single_choice', label: '气机',         state: 'done' },
              { i: 2, t: 'match',         label: '五脏 ↔ 在液',  state: 'done' },
              { i: 3, t: 'single_choice', label: '本题',          state: 'current' },
              { i: 4, t: 'fill_in_blank', label: '五行属性',      state: 'pending' },
              { i: 5, t: 'derive',        label: '推 · 木克土',  state: 'pending' },
            ].map(q => (
              <div key={q.i} style={{
                padding: '10px 12px',
                background: q.state === 'current' ? T.sheet : 'transparent',
                borderLeft: q.state === 'current' ? `2px solid ${T.accent}` : `2px solid transparent`,
                display: 'grid', gridTemplateColumns: '24px 1fr 30px', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontFamily: serif, fontSize: 12, color: T.ink3 }}>{cnNum(q.i)}</span>
                <div>
                  <div style={{ fontFamily: serif, fontSize: 13.5, color: q.state === 'pending' ? T.ink3 : T.ink, letterSpacing: '0.1em' }}>{q.label}</div>
                  <div style={{ fontSize: 10, color: T.ink3, marginTop: 2, letterSpacing: '0.06em' }}>{q.t}</div>
                </div>
                {q.state === 'done' && <span style={{ fontFamily: serif, fontSize: 13, color: T.s_mastered, textAlign: 'right' }}>✓</span>}
                {q.state === 'current' && <span style={{ fontFamily: serif, fontSize: 11, color: T.accent, letterSpacing: '0.18em' }}>·</span>}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 36, paddingTop: 22, borderTop: `0.5px solid ${T.line2}` }}>
            <div style={{ fontSize: 11, color: T.ink3, letterSpacing: '0.3em', marginBottom: 10 }}>节 点</div>
            <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 500, color: T.ink, lineHeight: 1, marginBottom: 12 }}>肝</div>
            <StatusBar tier="mastered" strength={88} width={140} size="lg" variant={variant} showValue />
            <div style={{ fontSize: 11, color: T.ink3, marginTop: 12, lineHeight: 1.8, letterSpacing: '0.06em' }}>
              本卷结束 · 强度自更
              <br/>不计得分 · 不显速度
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile B quiz
function B_Quiz_Mobile() {
  const variant = 'B';
  const T = TOKENS[variant];
  const Q = QUIZ_LIVER.questions[0];
  const serif = '"Noto Serif SC", serif';

  return (
    <div data-screen-label="12 B · Quiz (Mobile)" style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.ink,
      fontFamily: serif,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', fontSize: 13 }}>
        <span>9:41</span><span style={{ fontSize: 11 }}>● ●● 5G ●●●</span>
      </div>

      <div style={{ padding: '6px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `0.5px solid ${T.line2}` }}>
        <span style={{ fontSize: 13, color: T.ink2, letterSpacing: '0.14em' }}>✕</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: T.ink3, letterSpacing: '0.2em' }}>三 / 五</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[...Array(QUIZ_LIVER.total)].map((_, i) => {
              const state = i < QUIZ_LIVER.current - 1 ? 'done' : i === QUIZ_LIVER.current - 1 ? 'current' : 'pending';
              return <span key={i} style={{ width: 18, height: 4, background: state === 'done' ? T.s_mastered : state === 'current' ? T.accent : T.line }} />;
            })}
          </div>
        </div>
        <span style={{ fontSize: 14, color: T.ink, borderBottom: `1px solid ${T.s_mastered}` }}>肝</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '24px 22px 22px' }}>
        <div style={{ fontSize: 11, color: T.accent, letterSpacing: '0.4em', marginBottom: 10 }}>单 选</div>
        <div style={{ fontFamily: serif, fontSize: 22, fontWeight: 500, lineHeight: 1.55, letterSpacing: '0.06em', marginBottom: 22 }}>{Q.stem}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 22 }}>
          {Q.options.map(opt => {
            const isCorrect = opt.correct, isPicked = opt.picked;
            const bg = (isPicked && isCorrect) ? '#ecf0db' : T.paper;
            return (
              <div key={opt.id} style={{ background: bg, border: `0.5px solid ${isCorrect ? T.s_mastered : T.line2}`, padding: '13px 16px', display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: 10, alignItems: 'center' }}>
                <span style={{ width: 22, height: 22, border: `0.5px solid ${isCorrect ? T.s_mastered : T.line2}`, color: isCorrect ? T.s_mastered : T.ink3, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cnNum(opt.id.charCodeAt(0) - 96)}</span>
                <span style={{ fontSize: 15, letterSpacing: '0.06em' }}>{opt.text}</span>
                {isPicked && <span style={{ fontSize: 10, color: T.s_mastered, letterSpacing: '0.2em' }}>正</span>}
              </div>
            );
          })}
        </div>

        <div style={{ padding: '16px 16px', background: T.paper, border: `0.5px solid ${T.line2}`, position: 'relative' }}>
          <span style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: T.s_mastered }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: T.s_mastered, letterSpacing: '0.2em' }}>✓ 答 对 · 解</span>
            <span style={{ fontSize: 11, color: T.s_mastered }}>88 → 91 ↑</span>
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.95, color: T.ink2, letterSpacing: '0.04em' }}>{Q.why}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 11, color: T.ink3 }}>
            <span style={{ letterSpacing: '0.16em' }}>引</span>
            {Q.refs.map(r => <span key={r} style={{ color: T.ink, borderBottom: `1px solid ${T.s_learned}` }}>{r}</span>)}
          </div>
        </div>
      </div>

      <div style={{ borderTop: `0.5px solid ${T.line2}`, padding: '14px 20px 26px', background: T.bg, display: 'flex', gap: 10 }}>
        <button style={{ background: 'transparent', border: `0.5px solid ${T.line2}`, color: T.ink2, padding: '12px 14px', fontFamily: serif, fontSize: 13 }}>⚑</button>
        <button style={{ flex: 1, background: T.accent, color: T.paper, border: 'none', padding: '14px', fontFamily: serif, fontSize: 15, letterSpacing: '0.2em' }}>下 一 题 ↵</button>
      </div>
    </div>
  );
}

Object.assign(window, { B_Quiz_Desktop, B_Quiz_Mobile });
