// Variant A — F00 Authentication trio
// F00-1 登录入口 · F00-2 检查邮箱 · F00-3 链接错误 (3 reasons)
// Desktop (max-width 480 centered) + Mobile

// ─── Shared chrome ─────────────────────────────────────────
function AuthShell({ children, variant = 'A', mobile = false, screenLabel }) {
  const T = TOKENS[variant];
  return (
    <div data-screen-label={screenLabel} style={{
      width: '100%', height: '100%',
      background: T.bg, color: T.ink,
      fontFamily: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <AuthTopBar variant={variant} mobile={mobile} />
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: mobile ? '40px 20px 32px' : '80px 32px 64px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: '100%',
          maxWidth: mobile ? '100%' : 480,
        }}>
          {children}
        </div>
      </div>
      <AuthFooter variant={variant} mobile={mobile} />
    </div>
  );
}

function AuthTopBar({ variant, mobile }) {
  const T = TOKENS[variant];
  return (
    <div style={{
      height: mobile ? 52 : 56,
      padding: mobile ? '0 20px' : '0 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: `1px solid ${T.line}`, background: T.bg,
    }}>
      <a style={{
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: 11, color: T.ink3, letterSpacing: '0.14em',
        textDecoration: 'none', cursor: 'pointer',
      }}>← 返回</a>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 16, fontWeight: 500, letterSpacing: '0.04em' }}>
          Fast Memory
        </span>
        {!mobile && (
          <React.Fragment>
            <span style={{ color: T.ink3, fontSize: 11 }}>·</span>
            <span style={{ fontFamily: '"Noto Serif SC", serif', fontSize: 14, color: T.ink2 }}>中医</span>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

function AuthFooter({ variant, mobile }) {
  const T = TOKENS[variant];
  return (
    <div style={{
      padding: mobile ? '14px 20px 18px' : '18px 32px 24px',
      borderTop: `1px solid ${T.line}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3,
      letterSpacing: '0.12em',
    }}>
      <span>FM · v0.1</span>
      <span>support@fast-memory.com</span>
    </div>
  );
}

// ─── F00-1 · 登录入口 ──────────────────────────────────────
// state: 'default' | 'typing' | 'invalid' | 'submitting' | 'ratelimit'

function LoginForm({ variant = 'A', state = 'default', mobile = false }) {
  const T = TOKENS[variant];
  const titleFont = '"Noto Serif SC", serif';

  const emailValue =
    state === 'typing' || state === 'submitting' ? 'wang.yufeng@gmail.com' :
    state === 'invalid' ? 'wang.yufeng@' :
    state === 'ratelimit' ? 'wang.yufeng@gmail.com' :
    '';

  const showError = state === 'invalid';
  const submitting = state === 'submitting';
  const ratelimited = state === 'ratelimit';
  const disabled = submitting || ratelimited;

  const btnLabel = submitting ? '发送中…' : ratelimited ? '60 秒后可重新发送' : '发送登录链接';

  return (
    <div>
      {/* heading */}
      <div style={{ marginBottom: mobile ? 28 : 36 }}>
        <h1 style={{
          fontFamily: titleFont,
          fontSize: mobile ? 28 : 34,
          fontWeight: 500,
          margin: 0,
          letterSpacing: '0.02em',
          lineHeight: 1.2,
        }}>登录 Fast Memory</h1>
        <div style={{ fontSize: 14, color: T.ink2, marginTop: 10, lineHeight: 1.6 }}>
          用邮箱获取一次性登录链接
        </div>
      </div>

      {/* input */}
      <div style={{ marginBottom: 8 }}>
        <label style={{
          display: 'block',
          fontSize: 10, color: T.ink3, letterSpacing: '0.22em',
          marginBottom: 8,
        }}>EMAIL</label>
        <div style={{
          height: 44,
          background: T.sheet,
          border: `1px solid ${showError ? T.s_fading : T.line2}`,
          display: 'flex', alignItems: 'center',
          padding: '0 14px',
          position: 'relative',
        }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 14,
            color: emailValue ? T.ink : T.ink3,
            letterSpacing: '0.02em',
            flex: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {emailValue || 'your@email.com'}
            {(state === 'typing' || state === 'invalid') && (
              <span style={{
                display: 'inline-block', width: 1, height: 16,
                background: T.ink, marginLeft: 1, verticalAlign: 'middle',
              }} />
            )}
          </span>
        </div>
        <div style={{
          minHeight: 18,
          marginTop: 6,
          fontSize: 11,
          color: showError ? T.s_fading : 'transparent',
          letterSpacing: '0.04em',
        }}>
          {showError ? '邮箱格式不正确' : '·'}
        </div>
      </div>

      {/* submit button */}
      <button disabled={disabled} style={{
        width: '100%', height: 48,
        background: disabled ? T.line2 : T.ink,
        color: disabled ? T.ink3 : T.paper,
        border: 'none', borderRadius: 0,
        fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
        letterSpacing: '0.16em', cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        {submitting && <Spinner T={T} />}
        {btnLabel}
      </button>

      {/* divider */}
      <div style={{
        position: 'relative',
        margin: '32px 0 16px',
        borderTop: `1px solid ${T.line}`,
      }} />

      {/* trust anchors */}
      <div style={{ fontSize: 13, color: T.ink2, lineHeight: 1.9, letterSpacing: '0.02em' }}>
        <div style={{ marginBottom: 4 }}>无需密码 · 无需注册</div>
        <div style={{ color: T.ink3, fontSize: 12 }}>首次输入即开通账户</div>
      </div>

      <div style={{
        marginTop: 22,
        padding: '12px 14px',
        background: T.paper,
        border: `1px solid ${T.line}`,
        fontSize: 11,
        color: T.ink3,
        lineHeight: 1.7,
      }}>
        我们仅使用邮箱识别你 · 不会发送任何营销邮件
      </div>
    </div>
  );
}

function Spinner({ T }) {
  // simple animated mark using a small bar — fits the typographic system
  return (
    <span style={{
      display: 'inline-block',
      width: 12, height: 12,
      border: `1.5px solid ${T.ink3}`,
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'fm-spin 0.9s linear infinite',
    }}>
      <style>{`@keyframes fm-spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}

function A_Login_Desktop()           { return <AuthShell screenLabel="07 A · 登录入口"     variant="A"><LoginForm state="default" /></AuthShell>; }
function A_Login_Typing_Desktop()    { return <AuthShell screenLabel="08 A · 登录入口 · 输入中" variant="A"><LoginForm state="typing"  /></AuthShell>; }
function A_Login_Invalid_Desktop()   { return <AuthShell screenLabel="09 A · 登录入口 · 格式错"  variant="A"><LoginForm state="invalid" /></AuthShell>; }
function A_Login_Submitting_Desktop(){ return <AuthShell screenLabel="10 A · 登录入口 · 提交中"  variant="A"><LoginForm state="submitting" /></AuthShell>; }

function A_Login_Mobile() {
  return <AuthShell screenLabel="11 A · 登录入口 (Mobile)" variant="A" mobile><LoginForm mobile state="default" /></AuthShell>;
}

// ─── F00-2 · 检查邮箱 ──────────────────────────────────────
function CheckEmailScreen({ variant = 'A', mobile = false, countdown = 42 }) {
  const T = TOKENS[variant];
  const titleFont = '"Noto Serif SC", serif';
  return (
    <div>
      <h1 style={{
        fontFamily: titleFont, fontSize: mobile ? 26 : 32, fontWeight: 500,
        margin: 0, letterSpacing: '0.02em', lineHeight: 1.2, marginBottom: 24,
      }}>邮件已发送</h1>

      <div style={{ fontSize: 14, color: T.ink2, marginBottom: 14, lineHeight: 1.7 }}>
        我们刚发了一封登录邮件到
      </div>

      <div style={{
        background: T.sheet, border: `1px solid ${T.line2}`,
        padding: '14px 16px',
        marginBottom: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: T.ink,
          letterSpacing: '0.02em',
        }}>wang.yufeng@gmail.com</span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: T.ink3,
          letterSpacing: '0.14em', borderLeft: `1px solid ${T.line}`,
          paddingLeft: 12,
        }}>{new Date().toTimeString().slice(0,5)}</span>
      </div>

      <div style={{ fontSize: 13, color: T.ink2, lineHeight: 1.8, marginBottom: 28 }}>
        点击邮件中的链接即可登录 · 链接 <span style={{ color: T.ink, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>15 分钟</span> 内有效
      </div>

      <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 22 }}>
        <div style={{
          fontSize: 10, color: T.ink3, letterSpacing: '0.22em',
          marginBottom: 14,
        }}>没收到邮件 ?</div>

        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <li style={{ fontSize: 13, color: T.ink2, display: 'flex', alignItems: 'baseline', gap: 12, lineHeight: 1.6 }}>
            <span style={{ color: T.ink3, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, minWidth: 18 }}>01</span>
            <span>请检查垃圾邮件 · 标记为「非垃圾邮件」可避免下次进入</span>
          </li>
          <li style={{ fontSize: 13, color: T.ink2, display: 'flex', alignItems: 'baseline', gap: 12, lineHeight: 1.6 }}>
            <span style={{ color: T.ink3, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, minWidth: 18 }}>02</span>
            <span>邮箱地址错了 ? <a style={{ color: T.accent, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>换邮箱</a></span>
          </li>
          <li style={{ fontSize: 13, color: T.ink2, display: 'flex', alignItems: 'baseline', gap: 12, lineHeight: 1.6 }}>
            <span style={{ color: T.ink3, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, minWidth: 18 }}>03</span>
            <span>
              {countdown > 0 ? (
                <React.Fragment>
                  <span style={{ color: T.ink3 }}>重新发送 ·</span>{' '}
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: T.ink, fontSize: 12 }}>
                    {String(Math.floor(countdown/60)).padStart(2,'0')}:{String(countdown%60).padStart(2,'0')}
                  </span> 后可点击
                </React.Fragment>
              ) : (
                <a style={{ color: T.accent, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>重新发送</a>
              )}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function A_CheckEmail_Desktop()       { return <AuthShell screenLabel="12 A · 检查邮箱 · 倒计时"  variant="A"><CheckEmailScreen countdown={42} /></AuthShell>; }
function A_CheckEmail_Ready_Desktop() { return <AuthShell screenLabel="13 A · 检查邮箱 · 可重发"  variant="A"><CheckEmailScreen countdown={0}  /></AuthShell>; }
function A_CheckEmail_Mobile()        { return <AuthShell screenLabel="14 A · 检查邮箱 (Mobile)"  variant="A" mobile><CheckEmailScreen mobile countdown={42} /></AuthShell>; }

// ─── F00-3 · 登录错误 ──────────────────────────────────────
function LoginErrorScreen({ variant = 'A', reason = 'expired', mobile = false }) {
  const T = TOKENS[variant];
  const titleFont = '"Noto Serif SC", serif';

  const copy = {
    expired: {
      tag: 'EXPIRED',
      head: '这个链接已过期',
      body: '链接只能使用一次 · 只有 15 分钟有效',
      hint: '你 17 分钟前请求过这封邮件',
    },
    invalid: {
      tag: 'INVALID',
      head: '这个链接无效',
      body: '可能是邮件客户端改写了链接，或链接已被使用',
      hint: '试着把邮件中链接整段复制后粘贴到浏览器',
    },
    used: {
      tag: 'USED',
      head: '这个链接已经用过了',
      body: '出于安全考虑·每个链接只能使用一次',
      hint: '请重新发送新链接',
    },
  }[reason];

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 18,
      }}>
        <span style={{
          width: 28, height: 28,
          border: `1.5px solid ${T.s_fading}`,
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.s_fading,
          fontFamily: '"Noto Serif SC", serif',
          fontSize: 18,
        }}>!</span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10, color: T.s_fading,
          letterSpacing: '0.22em',
        }}>LINK · {copy.tag}</span>
      </div>

      <h1 style={{
        fontFamily: titleFont, fontSize: mobile ? 26 : 32, fontWeight: 500,
        margin: 0, letterSpacing: '0.02em', lineHeight: 1.2,
      }}>{copy.head}</h1>

      <div style={{ fontSize: 14, color: T.ink2, lineHeight: 1.7, marginTop: 14, marginBottom: 8 }}>
        {copy.body}
      </div>

      <div style={{
        fontSize: 12, color: T.ink3, fontFamily: 'JetBrains Mono, monospace',
        letterSpacing: '0.02em', marginBottom: 30,
      }}>· {copy.hint}</div>

      <button style={{
        width: '100%', height: 48,
        background: T.ink, color: T.paper, border: 'none', borderRadius: 0,
        fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
        letterSpacing: '0.16em', cursor: 'pointer',
        marginBottom: 12,
      }}>重新发送登录链接</button>

      <button style={{
        width: '100%', height: 44,
        background: 'transparent', color: T.ink2,
        border: `1px solid ${T.line2}`, borderRadius: 0,
        fontFamily: 'inherit', fontSize: 13,
        letterSpacing: '0.12em', cursor: 'pointer',
      }}>换个邮箱</button>

      <div style={{
        marginTop: 28, paddingTop: 18,
        borderTop: `1px solid ${T.line}`,
        fontSize: 11, color: T.ink3, lineHeight: 1.7,
      }}>
        反复出错 ? 写信告诉我们：
        <a style={{ color: T.accent, textDecoration: 'underline', textUnderlineOffset: 3, marginLeft: 4, fontFamily: 'JetBrains Mono, monospace' }}>support@fast-memory.com</a>
      </div>
    </div>
  );
}

function A_LoginError_Expired_Desktop() { return <AuthShell screenLabel="15 A · 链接过期" variant="A"><LoginErrorScreen reason="expired" /></AuthShell>; }
function A_LoginError_Invalid_Desktop() { return <AuthShell screenLabel="16 A · 链接无效" variant="A"><LoginErrorScreen reason="invalid" /></AuthShell>; }
function A_LoginError_Used_Desktop()    { return <AuthShell screenLabel="17 A · 链接已用" variant="A"><LoginErrorScreen reason="used"    /></AuthShell>; }
function A_LoginError_Mobile()          { return <AuthShell screenLabel="18 A · 链接过期 (Mobile)" variant="A" mobile><LoginErrorScreen mobile reason="expired" /></AuthShell>; }

Object.assign(window, {
  A_Login_Desktop, A_Login_Typing_Desktop, A_Login_Invalid_Desktop, A_Login_Submitting_Desktop,
  A_Login_Mobile,
  A_CheckEmail_Desktop, A_CheckEmail_Ready_Desktop, A_CheckEmail_Mobile,
  A_LoginError_Expired_Desktop, A_LoginError_Invalid_Desktop, A_LoginError_Used_Desktop,
  A_LoginError_Mobile,
});
