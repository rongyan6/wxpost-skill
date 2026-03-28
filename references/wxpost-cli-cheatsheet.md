# wxpost-cli 速查

本文基于本地文档 [wxpost-cli/README.md](/Users/jsonzhou/code/@rongyan/wxpost-cli/README.md) 整理。

## 前置条件

- Node.js 18 及以上
- 已运行的 `wxpost-server`
- 已配置 `~/.@rongyan/env-cli.json`

## 外部依赖安装

### 1. `@rongyan/wxpost-cli`

用途：创建草稿、查看草稿、发布草稿

仓库： [rongyan6/wxpost-cli](https://github.com/rongyan6/wxpost-cli)

推荐安装：

```bash
npm install -g @rongyan/wxpost-cli
```

备用方式：

```bash
npx @rongyan/wxpost-cli@latest add_draft article.md
```

### 2. `humanizer-zh`

用途：对 `news` 正文做最后一轮去 AI 化

仓库： [op7418/Humanizer-zh](https://github.com/op7418/Humanizer-zh/tree/main)

推荐安装：

```bash
npx skills add https://github.com/op7418/Humanizer-zh.git
```

备用方式：手动安装到对应技能目录。

### 3. `@rongyan/image-gen-cli`

用途：当 `cover` 是提示词时生成封面图

仓库： [rongyan6/image-gen-cli](https://github.com/rongyan6/image-gen-cli)

推荐安装：

```bash
npm install -g @rongyan/image-gen-cli@latest
```

备用方式：

```bash
npx @rongyan/image-gen-cli@latest "扁平简洁的公众号封面插画"
```

## 首次运行行为

第一次运行 `wxpost-cli` 时，它会先创建 `~/.@rongyan/env-cli.json`，然后退出。配置文件应包含：

```json
{
  "server_url": "http://localhost:3000",
  "api_key": "your-api-key",
  "need_open_comment": 1,
  "only_fans_can_comment": 0,
  "mdflow": {
    "primary_color": null,
    "heading_2": null,
    "asset_dir": null
  }
}
```

## 常用命令

```bash
npx @rongyan/wxpost-cli@latest add_draft article.md
npx @rongyan/wxpost-cli@latest list_draft
npx @rongyan/wxpost-cli@latest publish <media_id>
```

如果目标账号不是默认账号，在任意命令后追加 `--account <appid>`。

## `news` 图文消息 front matter

```markdown
---
title: 文章标题
author: 作者名
digest: 摘要
cover: ./images/cover.jpg
---
```

- `title`：必填，最多 32 字
- `cover`：必填，本地路径，且相对 Markdown 文件解析
- `author`：可选
- `digest`：可选，不填则由 CLI 自动提取
- `digest`：作为本技能默认约束，建议不超过 120 个中文字符

结合本技能的推荐做法：

- 尽量主动生成 `digest`，不要依赖自动提取
- 将 `digest` 控制在 120 个中文字符以内
- 根据 `digest` 先生成封面提示词，再单独出图
- 如果 `cover` 是提示词，则在建草稿前先生成封面图，再把本地图片路径写入 `cover`
- 如果 `cover` 已经是本地图片路径，则不重复生成，除非用户明确要求
- 建草稿前如果可以，先用 `humanizer-zh` 对正文做去 AI 化

## `newspic` 图片消息 front matter

```markdown
---
title: 相册标题
article_type: newspic
image_list:
  - ./photos/01.jpg
  - ./photos/02.jpg
  - ./photos/03.png
---

一句或两句纯文本说明。#标签A #标签B
```

- `title`：必填，最多 32 字
- `article_type`：必须为 `newspic`
- `image_list`：必填，1 到 20 个本地图片路径
- 正文：可选，但只能是简短普通文本

结合本技能的推荐做法：

- 正文控制在一两句
- 从内容中提炼 2 到 5 个关键词，转成 `#标签`
- 不要在正文中使用标题、列表、引用块等 Markdown 结构

## 图片规则

- 封面图：JPG、PNG、BMP、GIF，10MB 以内
- `newspic` 图片：JPG、PNG、BMP、GIF，10MB 以内
- 正文图片：JPG 或 PNG，1MB 以内

CLI 会根据文件头校验图片格式，而不只看扩展名。对于 JPG 和 PNG，它会在必要时尝试压缩。

微信公众号图文封面建议按 `2.35:1` 裁剪。由于 `image-gen-cli` 当前不直接支持该比例，推荐先生成宽图，例如 `16:9`，再裁成最终封面。

示例：

```bash
npx @rongyan/image-gen-cli@latest "扁平简洁的公众号封面插画，几何构图，大留白" --output ./images/cover-raw.jpg --aspect-ratio 16:9
```

生成后再裁剪为 `2.35:1`，并把最终图片路径写入 Markdown 的 `cover` 字段。

## Humanizer-zh

`humanizer-zh` 可用于降低 `news` 正文中的 AI 写作痕迹。上游仓库提供的安装方式包括：

- `npx skills add https://github.com/op7418/Humanizer-zh.git`
- 将仓库克隆到本地技能目录

为了兼容不同运行环境：

- Claude Code 风格环境常见技能目录为 `~/.claude/skills/`
- Codex 风格环境常见技能目录为 `$CODEX_HOME/skills` 或 `~/.codex/skills`
- 优先使用显式技能名调用方式，不依赖斜杠命令
- 如果暂时无法安装，可先按其文档规则手工做去 AI 化处理

上游仓库： [op7418/Humanizer-zh](https://github.com/op7418/Humanizer-zh/tree/main)

## 成功输出时要记录的信息

执行 `add_draft` 后，重点记录：

```text
草稿创建成功
media_id: <media_id>
```

执行 `publish` 后，重点记录：

```text
发布成功
publish_id: <publish_id>
```

## 运行默认行为

- 不写 `article_type` 时，默认按 `news` 处理
- 正文中的本地图片会自动上传并替换 URL
- 首次运行时，CLI 可能只创建配置文件而不真正执行命令
