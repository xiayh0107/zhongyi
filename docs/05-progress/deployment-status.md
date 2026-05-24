---
id: PROGRESS-003
type: progress
status: in-progress
version: 0.1
created: 2026-05-23
updated: 2026-05-23
related:
  - changelog.md
  - milestones.md
  - ../01-architecture/tech-stack.md
  - ../04-decisions/ADR-004-email-magic-link-auth.md
depends_on: []
supersedes: []
---

# 部署状态

> 生产环境的当前事实源：服务器、域名、运行方式、证书、数据库、验证结果与已知风险。

## 当前状态

🟩 **Production 已上线**：`https://zhongyi.xiayh17.top`

最后确认时间：2026-05-23（America/New_York）/ 2026-05-24（服务器 CST）

### 验证结果

- `https://zhongyi.xiayh17.top/login` 返回 `200 OK`
- `http://zhongyi.xiayh17.top/login` 返回 `301`，跳转到 HTTPS
- `zhongyi.service` 状态：`active`
- `nginx` 状态：`active`
- Resend 登录邮件已成功发送过生产邮件
- 登录邮件 callback 修复已部署：新邮件验证成功后跳 `/`，不再跳 `/login/check-email`

## 生产入口

| 项 | 值 |
|---|---|
| 域名 | `zhongyi.xiayh17.top` |
| 服务器 IP | `47.120.23.41` |
| SSH 用户 | `root` |
| OS | Ubuntu 24.04.4 LTS |
| Node.js | 22.22.2 |
| pnpm | 10.24.0 |
| 应用目录 | `/opt/zhongyi/app` |
| 环境变量 | `/etc/zhongyi/zhongyi.env` |
| SQLite 数据库 | `/var/lib/zhongyi/prod.db` |
| systemd 服务 | `zhongyi.service` |
| nginx 配置 | `/etc/nginx/sites-available/zhongyi.xiayh17.top` |
| HTTPS 证书 | `/etc/letsencrypt/live/zhongyi.xiayh17.top/` |

## 运行方式

应用由 systemd 运行，进程用户为 `zhongyi`：

```text
ExecStart=/usr/bin/node /opt/zhongyi/app/node_modules/next/dist/bin/next start -H 127.0.0.1 -p 3000
```

nginx 负责公网入口：

- `80`：Certbot 管理，重定向到 HTTPS
- `443`：反代到 `http://127.0.0.1:3000`

数据库不放在代码目录中，避免部署覆盖：

```text
DATABASE_URL="file:/var/lib/zhongyi/prod.db"
```

## 部署步骤摘要

当前部署不是从 GitHub 远端拉取，而是把本机 `app/` 当前工作区同步到服务器：

```bash
rsync -az --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .env.local \
  --exclude prisma/dev.db \
  --exclude prisma/dev.db-journal \
  app/ root@47.120.23.41:/opt/zhongyi/app/
```

服务器侧发布流程：

```bash
cd /opt/zhongyi/app
pnpm install --frozen-lockfile
. /etc/zhongyi/zhongyi.env
pnpm exec prisma generate
pnpm run build
systemctl restart zhongyi
```

如有 schema migration，需在 `build` 前执行：

```bash
pnpm exec prisma migrate deploy
```

## 最近修复

### 邮件链接点击后回到“邮件已发送”

原因：登录表单把 `redirectTo` 设为 `/login/check-email`，Auth.js 会把它写入 magic link 的 `callbackUrl`。用户点击邮件完成验证后，就被带回检查邮箱页。

修复：

- 邮件 magic link 的 callback 改为 `/`
- 发送邮件成功后的检查邮箱页改为应用层手动 `redirect`
- 删除检查邮箱页上的“开发期间”提示

注意：旧邮件里的 callback 已固化，仍会回到旧页面；必须重新发送登录邮件验证新行为。

### Google Fonts 构建依赖

生产构建不再使用 `next/font/google` 拉取 Google Fonts，改为系统字体栈，避免服务器构建依赖外部字体网络。

### STRICT_CONTENT

生产环境暂设：

```text
STRICT_CONTENT=0
```

原因：内容中仍有若干 wiki-link 指向尚未实现节点。`STRICT_CONTENT=1` 会让首页运行时抛错。内容补齐或死链策略调整后再打开。

## 已知风险 / 待处理

- [ ] 本地工作区存在未提交改动，生产服务器已部署这些改动；需要 commit + push，避免服务器状态与 GitHub 不一致
- [ ] root 密码曾经出现在聊天中；需要轮换 root 密码，改成 SSH key 登录
- [ ] Resend API key 曾经出现在聊天和服务器环境中；需要轮换 key
- [ ] 生产仍使用 SQLite；MVP 可接受，用户量上来后切 PostgreSQL
- [ ] `STRICT_CONTENT=0` 是发布兜底；需要补齐或降级处理缺失 wiki-link
- [ ] 当前发布是手工 rsync；后续应整理成 `deploy.sh` 或 CI/CD

## 运维命令

```bash
# 服务状态
systemctl status zhongyi --no-pager
systemctl status nginx --no-pager

# 应用日志
journalctl -u zhongyi -n 120 --no-pager
journalctl -u zhongyi -f

# 重启应用
systemctl restart zhongyi

# 检查 nginx
nginx -t
systemctl reload nginx

# 证书状态
certbot certificates
systemctl list-timers certbot.timer --no-pager

# 本机健康检查
curl -I http://127.0.0.1:3000/login
curl -I https://zhongyi.xiayh17.top/login
```

## Changelog

| 版本 | 日期 | 变更 | 作者 |
|---|---|---|---|
| 0.1 | 2026-05-23 | 记录首次生产部署状态 | Codex |
