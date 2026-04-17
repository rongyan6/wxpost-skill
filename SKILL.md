---
name: wxpost-skill
description: 基于用户提供的素材优化微信公众号内容，先核实时效信息，再生成符合 wxpost-cli 要求的 Markdown 与 front matter，并执行或建议 add_draft、list_draft、publish 等操作。
---

# wxpost 技能

## 概述

当用户不是从零写作，而是已经提供了提纲、草稿、原始素材、链接、截图或本地文件，希望你帮助其优化公众号内容并完成后续运营动作时，使用这个技能。它会把素材整理成更清晰的图文消息或图片消息，保持文字简洁自然，生成符合 `@rongyan/wxpost-cli` 要求的 Markdown，并执行或建议下一步操作。

本技能不编造报道、案例、数据、引言或个人经历。只要文章依赖近期事实、政策、价格、产品更新或其他时效信息，就要先核实，再写作。

## 兼容性

这个技能需要同时兼容 Codex 和 Claude Code 一类运行环境。

- 不依赖 `/skill-name` 这类斜杠命令语法。
- 优先使用显式技能名调用方式，例如 `$wxpost-skill`，或者在请求里直接点名技能。
- 技能安装目录因运行环境而异，但整体工作流应保持一致。
- 如果辅助技能不可用，不要让整个 wxpost 流程中断，应退回到该技能的文档规则手工处理。

## 依赖安装

使用本技能前，至少要确认下面三个外部依赖：

1. `@rongyan/wxpost-cli`
   用途：创建草稿、查看草稿、发布草稿
   仓库： [rongyan6/wxpost-cli](https://github.com/rongyan6/wxpost-cli)
   推荐安装：

   ```bash
   npm install -g @rongyan/wxpost-cli
   ```

   备用方式：`npx @rongyan/wxpost-cli@latest ...`

2. `humanizer-zh`
   用途：对 `news` 正文做最后一轮去 AI 化
   仓库： [op7418/Humanizer-zh](https://github.com/op7418/Humanizer-zh/tree/main)
   推荐安装：

   ```bash
   npx skills add https://github.com/op7418/Humanizer-zh.git
   ```

   备用方式：手动安装到对应技能目录；若暂时未安装，可先按其文档规则手工处理。

3. `@rongyan/image-gen-cli`
   用途：当 `cover` 是提示词时生成封面图
   仓库： [rongyan6/image-gen-cli](https://github.com/rongyan6/image-gen-cli)
   推荐安装：

   ```bash
   npm install -g @rongyan/image-gen-cli@latest
   ```

   备用方式：`npx @rongyan/image-gen-cli@latest "提示词"`

## 适用场景

当用户提出以下需求时，使用本技能：

- 优化、润色公众号文章草稿、提纲或粗略笔记。
- 将已有素材整理成可发布的公众号内容。
- 为 `npx @rongyan/wxpost-cli@latest add_draft` 准备 Markdown 与 front matter。
- 通过 `wxpost-cli` 创建草稿、查看草稿或发布草稿。
- 处理公众号流程中的本地封面图与正文图片。
- 准备 `news` 图文消息或 `newspic` 图片消息。

如果用户要求从空白开始进行长篇创作，而没有提供任何素材，这不是本技能的重点。这个技能更适合做编辑、重组、核实、封装和运营执行。

## 核心原则

整个流程都要遵守这些原则：

- 语言简洁、直接、自然，去掉空话、套话、仪式化表达。
- 以短段和中短段为主，每段都要推进一个具体信息点、例子、解释或转折。
- 不编造案例、数字、引言、发布日期、政策细节或个人经历。
- 如果内容依赖时效信息，必须先核实；若核实不完整，要明确说明，并删除或降级不确定表述。
- 尽量保留用户原有观点、语气和信息边界，除非用户明确要求更强的改写。
- 任何会影响真实公众号的操作都要谨慎处理。编辑可以主动推进，发布必须明确。

## 工作流

### 1. 读懂用户素材

从用户提供的内容出发，常见输入包括：

- 粗略要点
- 半成品草稿
- 资料摘录
- 需要核实的链接
- 本地文件与图片路径


先提取出：

- 文章目标
- 目标读者
- 需要核实的关键说法
- 可以直接使用的事实和例子
- 缺失但不能靠编造补齐的部分


如果素材本身不足以支撑某个观点，就缩短文章，不要靠空泛表述硬撑。

### 2. 只核实真正重要的信息

写作前先识别内容里哪些部分具有时效性。典型情况包括：

- 产品功能与价格
- 政策变化
- 市场或行业数据
- 公司动态、融资、招聘、发布、合作消息
- 活动或事件时间


优先使用官方或一手来源核实。若某个点无法可靠核实，可以：

- 删除
- 改写为更窄、更稳妥的表述
- 明确标注为待确认，并提醒用户决定是否保留

### 3. 先确定消息类型

正式封装前，先判断本次内容属于哪一种：

- `news`：标准图文消息。适合有完整正文、标题、摘要、封面图的公众号文章。
- `newspic`：图片消息。适合核心内容是一组本地图片，文字只需一两句说明，再加少量标签。

两种模式的 front matter 不一样，不能混用。

### 4. 整理成可发布内容

#### `news` 模式

默认结构如下：

1. 开头直接点题，说明这篇内容讲什么、为什么值得看。
2. 中间 2 到 5 个小节，每节推进一个明确观点，不要硬编，一定要有论据或相关资料支撑。
3. 结尾落到一个清晰结论、判断或行动建议，但不宜过长。


改写时重点处理：

- 合并重复信息
- 把空泛表述改成具体表述
- 保证句子读起来顺
- 只在有助于阅读时使用小标题
- 避免连续堆叠反问句


如果需要更细的写作约束，读取 [writing-rules.md](./references/writing-rules.md)。

正文整理完成后，还要继续做三件事：

- 生成自定义 `digest`
- 默认基于 `digest` 生成封面图提示词，并写入工作稿的 `cover`。
- 在封装 Markdown 前对正文做一次去 AI 化处理


`digest` 默认按更稳妥的约束处理，尽量控制在 120 个中文字符以内。不要把摘要写成开头段落的简单截断，应提炼核心结论、对象或收益点。

推荐的封面提示词结构：

- 主体：从 `digest` 中提炼一个最核心概念
- 风格：扁平简洁的 editorial illustration
- 构图：单一焦点，居中或轻微不对称
- 色彩：少色、对比清晰、留白明显
- 文字：默认不在封面上放字，除非用户明确要求


封面生成执行规则：

- 封面规格（1200×512px）
- 判断 `cover` 是图片路径还是提示词的标准：值以 `./`、`/` 或 `http` 开头且以 `.jpg/.jpeg/.png/.bmp/.gif` 结尾 → 图片路径；否则一律视为提示词，必须生成。已经是图片路径不重复生成，除非用户明确重新生成。
- 若是提示词，必须立即执行命令生成图片，**不得只输出提示词了事**：

```bash
npx @rongyan/image-gen-cli@latest "你的封面提示词" --output ./images/cover.jpg --width 1200 --height 512
```

- 生成完成后，将 Markdown 中的 `cover` 替换为实际图片路径，再执行 `add_draft`
- 只有用户明确说"我自己出图"或"不用生成"，才可跳过自动生成，改为只输出提示词


如果当前环境可用 `humanizer-zh`，在事实核实完成后、写入最终 Markdown 前，用它对正文做去 AI 化处理。如果暂时无法安装，就按上游文档规则手工处理。去 AI 化只用于消除 AI 腔，不用于增加虚构细节。

#### `newspic` 模式

图片消息模式下：

- 正文必须是普通文本
- 最多一两句话
- 不使用 Markdown 结构化排版
- 从内容中提炼 2 到 5 个关键词，加成标签，例如 `#产品更新 #活动现场`

说明文字只需要帮助读者理解这组图片，不要展开成长文。

### 5. 封装成 wxpost Markdown

生成的 Markdown 必须能被 `wxpost-cli` 直接使用。

`news` 模式下建议区分工作稿和最终稿。

工作稿示例：

```markdown
---
title: 文章标题
author: 作者名
digest: 一句话摘要
cover: 扁平简洁的公众号封面插画，几何构图，大留白，主体聚焦摘要核心概念
---

正文内容
```

最终提交给 `wxpost-cli` 前，需要把 `cover` 替换成真实图片路径，例如：

```markdown
---
title: 文章标题
author: 作者名
digest: 一句话摘要
cover: ./images/cover-final.jpg
---

正文内容
```

`news` 模式要求：

- `title` 必填，且不超过 32 字
- 工作稿中的 `cover` 默认应为封面提示词
- 提交给 `wxpost-cli` 前，`cover` 必须替换为相对 Markdown 文件的真实本地图片路径
- `digest` 虽然可选，但通常应主动生成，而不是依赖自动摘要
- `digest` 默认控制在 120 个中文字符以内
- 正文中的本地图片会由 `wxpost-cli` 自动上传

`newspic` 模式示例：

```markdown
---
title: 相册标题
article_type: newspic
image_list:
  - ./photos/01.jpg
  - ./photos/02.jpg
---

一句或两句纯文本说明。#标签A #标签B
```

`newspic` 模式要求：

- `article_type` 必须是 `newspic`
- `image_list` 必填，且必须包含 1 到 20 个本地图片路径
- 正文必须保持普通文本，不要写成富文本 Markdown
- 第一张图会自动作为封面

### 6. 执行运营动作

根据用户需求选择对应命令：

- 创建草稿：`npx @rongyan/wxpost-cli@latest add_draft article.md`
- 查看草稿：`npx @rongyan/wxpost-cli@latest list_draft`
- 发布草稿：`npx @rongyan/wxpost-cli@latest publish <media_id>`

如果涉及多公众号账号，追加 `--account <appid>`。

命令细节、front matter 要求、图片限制等，参考 [wxpost-cli-cheatsheet.md](./references/wxpost-cli-cheatsheet.md)。

## 操作细则

### 创建草稿前检查

执行 `add_draft` 前，确认：

- Markdown 文件存在
- `title` 已填写
- `news` 模式下已填写 `cover`
- `newspic` 模式下已填写 `image_list`
- 正文不是空内容
- 所有本地图片路径都有效

对于 `newspic`，还要额外确认正文是普通文本，而不是结构化 Markdown。

创建成功后，要记录返回的 `media_id`，供后续查看或发布使用。

### 查看草稿

当用户需要找最近草稿，或找回 `media_id` 时，使用 `list_draft`。

### 发布草稿

发布应与编辑动作分开处理。如果用户没有明确要求发布，就停在建草稿阶段，或者只给出准确的发布命令。

## 默认输出

当用户主要是来做内容加工时，默认输出应包括：

- 优化后的正文
- 带 front matter 的最终 Markdown
- 哪些事实已核实、哪些内容被删除或降级
- 下一步 `wxpost-cli` 命令，或者实际执行结果


当用户主要是来做运营操作时，优先输出：

- 输入校验结果
- 实际执行的 `wxpost-cli` 命令
- `media_id`、`publish_id` 或可操作的报错信息

## 故障排查

- 如果 `wxpost-cli` 首次运行时只创建了配置模板并退出，提醒用户填写 `~/.@rongyan/env-cli.json` 后再运行。
- 如果服务不可达，检查 `server_url`、`api_key`，以及 `wxpost-server` 是否正常运行。
- 如果图片上传失败，检查文件是否存在、格式是否受支持、大小是否超限。
- 如果素材太薄或关键信息无法核实，就输出更短、更稳妥的版本，不要猜测补写。
