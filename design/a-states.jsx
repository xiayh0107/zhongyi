// Variant A — Empty / Loading / Error states
// 新用户主页空状态 · 节点无题 · Skeleton (节点页/题目流) · 404 / 500 / Offline

// ─────────────────────────────────────────────────────────────
// Frame helpers
// ─────────────────────────────────────────────────────────────

function StateShell({ children, variant = 'A', screenLabel, narrow = false, mobile = false }) {
  const T = TOKENS[variant];
  return (
    <div data-screen-label={screenLabel} style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.ink,
      fontFamily: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <StateTopBar variant={variant} mobile={mobile} />
      <div style={{
        flex: 1, overflow: 'hidden',
        display: 'flex', alignItems: narrow ? 'flex-start' : 'stretch',
        justifyContent: 'center',
        padding: mobile ? '24px 20px' : narrow ? '88px 32px 64px' : '40px 56px 56px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: narrow ? 520 : 820,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function StateTopBar({ variant, mobile, dim = false }) {
  const T = TOKENS[variant];
  return (
    <div style={{
      height: mobile ? 52 : 56,
      padding: mobile ? '0 20px' : '0 56px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: `1px solid ${T.line}`, background: T.bg,
      opacity: dim ? 0.55 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 16, fontWeight: 500, letterSpacing: '0.04em' }}>
          Fast Memory
        </span>
        <span style={{ color: T.ink3, fontSize: 11 }}>·</span>
        <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 14, color: T.ink2 }}>中医</span>
      </div>
      {!mobile && (
        <div style={{
          width: 280, height: 30, background: T.paper, border: `1px solid ${T.line}`,
          display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8,
        }}>
          <span style={{ color: T.ink3, fontSize: 12 }}>⌕</span>
          <span style={{ color: T.ink3, fontSize: 11 }}>搜索</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3, padding: '1px 6px', border: `1px solid ${T.line}` }}>⌘K</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 1 · 新用户首次进入主页 (Empty home)
// ─────────────────────────────────────────────────────────────

function NewUserHome({ variant = 'A', mobile = false }) {
  const T = TOKENS[variant];
  const titleFont = '"Noto Serif SC", serif';
  const totalNodes = 206;  // demonstrating it's read from graph.json

  return (
    <div>
      <div style={{ fontSize: 12, color: T.ink3, letterSpacing: '0.2em' }}>欢 · 迎</div>
      <h1 style={{
        fontFamily: titleFont, fontSize: mobile ? 30 : 38, fontWeight: 500,
        margin: '8px 0 0', letterSpacing: '0.02em', lineHeight: 1.2,
      }}>你好</h1>

      <div style={{ marginTop: 18, fontSize: 15, color: T.ink2, lineHeight: 1.8 }}>
        欢迎来到 <span style={{ fontFamily: titleFont, color: T.ink }}>Fast Memory · 中医卷</span>。
      </div>

      <div style={{
        marginTop: 26, paddingTop: 22,
        borderTop: `1px solid ${T.line}`,
        fontSize: 16, color: T.ink2, lineHeight: 1.9,
      }}>
        这里有 <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 17, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{totalNodes}</span> 个知识节点等你打开。
        <div style={{ fontFamily: titleFont, fontSize: mobile ? 17 : 19, color: T.ink, marginTop: 8, letterSpacing: '0.04em' }}>
          没有任务 · 没有连续打卡 · 按你自己的节奏。
        </div>
      </div>

      {/* recommended start */}
      <div style={{ marginTop: 40 }}>
        <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.24em', marginBottom: 12 }}>
          推荐起点
        </div>

        <RecommendedNode variant={variant} mobile={mobile} />
      </div>

      <div style={{
        marginTop: 28, display: 'flex', gap: 20, alignItems: 'center',
        flexDirection: mobile ? 'column' : 'row',
      }}>
        <a style={{
          fontSize: 13, color: T.ink2,
          letterSpacing: '0.12em',
          borderBottom: `1px solid ${T.line2}`,
          paddingBottom: 2, cursor: 'pointer',
        }}>或浏览完整知识地图 →</a>
      </div>
    </div>
  );
}

function RecommendedNode({ variant, mobile }) {
  const T = TOKENS[variant];
  const titleFont = '"Noto Serif SC", serif';
  return (
    <div style={{
      background: T.paper, border: `1px solid ${T.line}`,
      borderLeft: `3px solid ${T.s_untouched}`,
      padding: mobile ? '20px 22px' : '24px 28px',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 style={{
          fontFamily: titleFont, fontSize: mobile ? 22 : 26, fontWeight: 500, margin: 0,
          letterSpacing: '0.04em',
        }}>阴阳学说</h2>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.ink3, letterSpacing: '0.1em' }}>
          L1 · 中医基础理论
        </span>
      </div>

      <div style={{ fontSize: 14, color: T.ink2, lineHeight: 1.6, fontFamily: titleFont, fontStyle: 'italic' }}>
        中医的「操作系统」 · 一切证型、用药、调理的底层逻辑都从这里展开
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 12, borderTop: `1px solid ${T.line}`,
      }}>
        <StatusBar tier="untouched" strength={0} width={80} variant={variant} showValue />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3, letterSpacing: '0.16em' }}>未学</span>
      </div>

      <button style={{
        marginTop: 4,
        background: T.ink, color: T.paper, border: 'none', borderRadius: 0,
        padding: '12px 24px', fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
        letterSpacing: '0.18em', cursor: 'pointer', alignSelf: 'flex-start',
      }}>打 开</button>
    </div>
  );
}

function A_NewUserHome_Desktop() { return <StateShell screenLabel="19 A · 新用户主页 (空状态)" variant="A" narrow><NewUserHome /></StateShell>; }
function A_NewUserHome_Mobile()  { return <StateShell screenLabel="20 A · 新用户主页 (Mobile)"  variant="A" narrow mobile><NewUserHome mobile /></StateShell>; }

// ─────────────────────────────────────────────────────────────
// 2 · Skeleton screens
// ─────────────────────────────────────────────────────────────

function SkeletonBar({ T, w = '100%', h = 12, mt = 0 }) {
  return (
    <div style={{
      width: typeof w === 'number' ? `${w}px` : w,
      height: h,
      marginTop: mt,
      background: T.line,
      animation: 'fm-skel 1.2s ease-in-out infinite',
    }} />
  );
}

function SkeletonStyles() {
  return (
    <style>{`
      @keyframes fm-skel {
        0%, 100% { opacity: 0.55; }
        50%      { opacity: 0.30; }
      }
    `}</style>
  );
}

function NodePageSkeleton({ variant = 'A' }) {
  const T = TOKENS[variant];
  return (
    <div>
      <SkeletonStyles />
      {/* breadcrumb */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <SkeletonBar T={T} w={60} h={9} />
        <span style={{ color: T.line2 }}>›</span>
        <SkeletonBar T={T} w={72} h={9} />
        <span style={{ color: T.line2 }}>›</span>
        <SkeletonBar T={T} w={40} h={9} />
      </div>

      {/* title */}
      <SkeletonBar T={T} w={'42%'} h={36} mt={28} />
      <SkeletonBar T={T} w={'68%'} h={14} mt={16} />

      {/* status meta */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 22 }}>
        <SkeletonBar T={T} w={80}  h={6} />
        <SkeletonBar T={T} w={40}  h={9} />
        <SkeletonBar T={T} w={60}  h={9} />
      </div>

      {/* template grid */}
      <div style={{ marginTop: 34, paddingTop: 22, borderTop: `1px solid ${T.line}` }}>
        <SkeletonBar T={T} w={72} h={9} />
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', columnGap: 24, rowGap: 14, marginTop: 18 }}>
          {[0,1,2,3,4,5,6,7].map(i => (
            <React.Fragment key={i}>
              <SkeletonBar T={T} w={'70%'} h={11} />
              <SkeletonBar T={T} w={`${50 + ((i * 17) % 40)}%`} h={11} />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* body */}
      <div style={{ marginTop: 34, paddingTop: 22, borderTop: `1px solid ${T.line}` }}>
        <SkeletonBar T={T} w={120} h={14} />
        <SkeletonBar T={T} w={'92%'} h={11} mt={16} />
        <SkeletonBar T={T} w={'88%'} h={11} mt={10} />
        <SkeletonBar T={T} w={'45%'} h={11} mt={10} />
      </div>
    </div>
  );
}

function QuizSkeleton({ variant = 'A' }) {
  const T = TOKENS[variant];
  return (
    <div>
      <SkeletonStyles />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SkeletonBar T={T} w={140} h={11} />
        <SkeletonBar T={T} w={60}  h={11} />
      </div>

      <SkeletonBar T={T} w={'76%'} h={22} mt={36} />
      <SkeletonBar T={T} w={'48%'} h={14} mt={14} />

      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', alignItems: 'center', gap: 14, padding: '14px 16px', border: `1px solid ${T.line}` }}>
            <SkeletonBar T={T} w={20} h={20} />
            <SkeletonBar T={T} w={`${48 + i * 8}%`} h={12} />
          </div>
        ))}
      </div>
    </div>
  );
}

function A_NodeSkeleton_Desktop() { return <StateShell screenLabel="21 A · 节点页 Skeleton" variant="A"><NodePageSkeleton /></StateShell>; }
function A_QuizSkeleton_Desktop() { return <StateShell screenLabel="22 A · 题目流 Skeleton" variant="A"><QuizSkeleton /></StateShell>; }

// ─────────────────────────────────────────────────────────────
// 3 · 节点页：无题目挂载 (兜底)
// ─────────────────────────────────────────────────────────────

function NodeNoQuestions({ variant = 'A' }) {
  const T = TOKENS[variant];
  const titleFont = '"Noto Serif SC", serif';
  return (
    <div>
      {/* breadcrumb */}
      <div style={{ fontSize: 11, color: T.ink3, letterSpacing: '0.14em', fontFamily: 'JetBrains Mono, monospace' }}>
        中医基础理论 › 脏腑学说 › <span style={{ color: T.ink2 }}>三焦</span>
      </div>

      <h1 style={{ fontFamily: titleFont, fontSize: 44, fontWeight: 500, margin: '14px 0 4px', letterSpacing: '0.04em', lineHeight: 1.1 }}>
        三焦
      </h1>
      <div style={{ fontSize: 14, color: T.ink2, fontFamily: titleFont, fontStyle: 'italic' }}>
        六腑之一 · 主决渎、通行元气与水液之通路
      </div>

      {/* status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
        <StatusBar tier="learned" strength={64} width={120} variant={variant} showValue />
        <span style={{ fontSize: 11, color: T.ink3, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.16em' }}>学过 · L2</span>
      </div>

      {/* template grid (compact) */}
      <div style={{ marginTop: 30, paddingTop: 22, borderTop: `1px solid ${T.line}` }}>
        <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 14 }}>结构化字段</div>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', columnGap: 24, rowGap: 12, fontSize: 14 }}>
          <div style={{ color: T.ink3 }}>类别</div>     <div style={{ color: T.ink }}>六腑</div>
          <div style={{ color: T.ink3 }}>五行</div>     <div style={{ color: T.ink }}>—</div>
          <div style={{ color: T.ink3 }}>主要功能</div> <div style={{ color: T.ink }}>通行水液 · 主持诸气</div>
          <div style={{ color: T.ink3 }}>开窍于</div>   <div style={{ color: T.ink }}>—</div>
        </div>
      </div>

      {/* disabled CTA + explanation */}
      <div style={{
        marginTop: 36, padding: '20px 22px',
        background: T.paper, border: `1px dashed ${T.line2}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24,
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontFamily: titleFont, fontSize: 16, color: T.ink, marginBottom: 4 }}>暂未配题</div>
          <div style={{ fontSize: 12, color: T.ink3, lineHeight: 1.6 }}>
            这个节点暂时没有题目挂载 · 你仍可以阅读它，等内容补全后再来测试自己
          </div>
        </div>
        <button disabled style={{
          background: 'transparent',
          color: T.ink3,
          border: `1px solid ${T.line2}`,
          padding: '12px 22px',
          fontFamily: 'inherit', fontSize: 13,
          letterSpacing: '0.16em', cursor: 'not-allowed',
        }}>测试自己</button>
      </div>
    </div>
  );
}

function A_NodeNoQuestions_Desktop() { return <StateShell screenLabel="23 A · 节点页 · 暂未配题" variant="A"><NodeNoQuestions /></StateShell>; }

// ─────────────────────────────────────────────────────────────
// 4 · 错误页：404 / 500 / Offline
// ─────────────────────────────────────────────────────────────

function ErrorPage({ variant = 'A', kind = '404', mobile = false }) {
  const T = TOKENS[variant];
  const titleFont = '"Noto Serif SC", serif';

  if (kind === '404') return (
    <div style={{ maxWidth: 520, marginLeft: mobile ? 0 : 'auto', marginRight: mobile ? 0 : 'auto', paddingTop: mobile ? 16 : 56 }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3,
        letterSpacing: '0.22em', marginBottom: 14,
      }}>HTTP · 404 · NOT FOUND</div>

      <h1 style={{ fontFamily: titleFont, fontSize: mobile ? 28 : 36, fontWeight: 500, margin: 0, letterSpacing: '0.02em', lineHeight: 1.2 }}>
        没有这个节点
      </h1>

      <div style={{
        marginTop: 18, padding: '10px 14px',
        background: T.paper, border: `1px solid ${T.line}`,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: T.ink2,
        letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>/nodes/san-jiao-bie-shuo-x9</div>

      <div style={{ fontSize: 14, color: T.ink2, lineHeight: 1.7, marginTop: 22 }}>
        可能链接错了 · 或这个节点暂未上线
      </div>

      <button style={{
        marginTop: 32,
        background: T.ink, color: T.paper, border: 'none',
        padding: '14px 26px', fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
        letterSpacing: '0.18em', cursor: 'pointer',
      }}>返回知识地图</button>

      <div style={{ marginTop: 36, paddingTop: 22, borderTop: `1px solid ${T.line}` }}>
        <div style={{ fontSize: 10, color: T.ink3, letterSpacing: '0.22em', marginBottom: 10 }}>或搜索其他节点</div>
        <div style={{
          height: 44, background: T.sheet, border: `1px solid ${T.line2}`,
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
        }}>
          <span style={{ color: T.ink3, fontSize: 14 }}>⌕</span>
          <span style={{ color: T.ink3, fontSize: 13 }}>搜索节点、模板字段、证型…</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3, padding: '2px 6px', border: `1px solid ${T.line}` }}>⌘K</span>
        </div>
      </div>
    </div>
  );

  if (kind === '500') return (
    <div style={{ maxWidth: 520, marginLeft: mobile ? 0 : 'auto', marginRight: mobile ? 0 : 'auto', paddingTop: mobile ? 16 : 56 }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.s_fading,
        letterSpacing: '0.22em', marginBottom: 14,
      }}>HTTP · 500 · INTERNAL SERVER ERROR</div>

      <h1 style={{ fontFamily: titleFont, fontSize: mobile ? 28 : 36, fontWeight: 500, margin: 0, letterSpacing: '0.02em', lineHeight: 1.2 }}>
        出错了
      </h1>

      <div style={{ fontSize: 14, color: T.ink2, lineHeight: 1.7, marginTop: 14 }}>
        服务器暂时无法响应 · 几分钟后多半就好
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
        <button style={{
          background: T.ink, color: T.paper, border: 'none',
          padding: '14px 26px', fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
          letterSpacing: '0.18em', cursor: 'pointer',
        }}>重 试</button>
        <button style={{
          background: 'transparent', color: T.ink2,
          border: `1px solid ${T.line2}`,
          padding: '14px 24px', fontFamily: 'inherit', fontSize: 13,
          letterSpacing: '0.16em', cursor: 'pointer',
        }}>回到主页</button>
      </div>

      <div style={{
        marginTop: 40, paddingTop: 22,
        borderTop: `1px solid ${T.line}`,
        fontSize: 12, color: T.ink3, lineHeight: 1.8,
      }}>
        反复出错 · 写信告诉我们：
        <a style={{ color: T.accent, fontFamily: 'JetBrains Mono, monospace', marginLeft: 4, textDecoration: 'underline', textUnderlineOffset: 3 }}>support@fast-memory.com</a>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>错误编号</span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: T.ink,
            background: T.paper, border: `1px solid ${T.line}`,
            padding: '4px 8px', letterSpacing: '0.04em',
          }}>FM-1716543210-a7f3</span>
          <span style={{ fontSize: 11, color: T.ink3 }}>· 截图给客服可加速排查</span>
        </div>
      </div>
    </div>
  );

  // offline
  return (
    <div style={{ maxWidth: 520, marginLeft: mobile ? 0 : 'auto', marginRight: mobile ? 0 : 'auto', paddingTop: mobile ? 16 : 56 }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3,
        letterSpacing: '0.22em', marginBottom: 14,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{
          display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
          background: T.s_fading,
        }} />
        OFFLINE · NO NETWORK
      </div>

      <h1 style={{ fontFamily: titleFont, fontSize: mobile ? 28 : 36, fontWeight: 500, margin: 0, letterSpacing: '0.02em', lineHeight: 1.2 }}>
        网络断开了
      </h1>

      <div style={{ fontSize: 14, color: T.ink2, lineHeight: 1.8, marginTop: 18 }}>
        你似乎离线了。
      </div>

      <div style={{
        marginTop: 22, padding: '18px 20px',
        background: T.paper, border: `1px solid ${T.line}`,
      }}>
        <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.8 }}>
          · 已学过的节点 <span style={{ color: T.ink3 }}>可以继续浏览</span>
        </div>
        <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.8, marginTop: 6 }}>
          · 答题进度 <span style={{ color: T.s_fading }}>暂时无法保存</span>
        </div>
      </div>

      <button style={{
        marginTop: 32,
        background: T.ink, color: T.paper, border: 'none',
        padding: '14px 26px', fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
        letterSpacing: '0.18em', cursor: 'pointer',
      }}>检查连接</button>
    </div>
  );
}

function A_404_Desktop()      { return <StateShell screenLabel="24 A · 404 节点不存在" variant="A" narrow><ErrorPage kind="404" /></StateShell>; }
function A_500_Desktop()      { return <StateShell screenLabel="25 A · 500 服务器错误" variant="A" narrow><ErrorPage kind="500" /></StateShell>; }
function A_Offline_Desktop()  { return <StateShell screenLabel="26 A · Offline" variant="A" narrow><ErrorPage kind="offline" /></StateShell>; }
function A_Offline_Mobile()   { return <StateShell screenLabel="27 A · Offline (Mobile)" variant="A" narrow mobile><ErrorPage kind="offline" mobile /></StateShell>; }

Object.assign(window, {
  A_NewUserHome_Desktop, A_NewUserHome_Mobile,
  A_NodeSkeleton_Desktop, A_QuizSkeleton_Desktop,
  A_NodeNoQuestions_Desktop,
  A_404_Desktop, A_500_Desktop, A_Offline_Desktop, A_Offline_Mobile,
});
