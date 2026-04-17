# @rongyan/wxpost-skill

微信公众号一键智能化运营技能，面向基于素材加工的发文流程，兼容 Codex 与 Claude Code 风格运行环境。

它主要解决两类事情：

- 把用户提供的提纲、草稿、资料、链接或图片素材，整理成更适合公众号发布的内容
- 配合 `@rongyan/wxpost-cli` 完成内容排版、草稿创建、草稿查询、草稿发布等动作

## 一键安装到 Claude Code

推荐直接使用：

```bash
npx @rongyan/wxpost-skill@latest install --target claude
```

这条命令会自动把技能复制到：

```bash
~/.claude/skills/wxpost-skill
```

安装完成后，Claude Code 就可以发现这个技能。

## 一键安装到 Codex

如果你使用默认技能目录，推荐直接使用：

```bash
npx @rongyan/wxpost-skill@latest install --target codex
```

这条命令会自动安装到：

- 如果设置了 `CODEX_HOME`，安装到 `$CODEX_HOME/skills/wxpost-skill`
- 否则安装到 `~/.codex/skills/wxpost-skill`

如果你希望指定自定义目录，也可以：

```bash
npx @rongyan/wxpost-skill install --target codex --dir /your/custom/skills
```

## 作为 npm 包安装

如果你希望先把它装到本地，再执行安装命令，也可以：

```bash
npm install @rongyan/wxpost-skill
```

或全局安装：

```bash
npm install -g @rongyan/wxpost-skill
```

如果只是想快速查看包内容，也可以直接运行：

```bash
npx @rongyan/wxpost-skill
```

这个 `npx` 入口会输出包目录、`SKILL.md` 路径和下一步提示，方便你把技能接到 Claude Code 或 Codex 的技能目录中。

更推荐直接用上面的 `install` 子命令完成一键安装。

## 在 Claude Code 和 Codex 中怎么使用

安装完成后，这个技能适合在你已经有素材时调用，而不是从零空写。

它最适合做这些事情：

- 把采访提纲、草稿、资料整理成 `news` 图文消息
- 把相册、活动图片整理成 `newspic` 图片消息
- 生成符合 `wxpost-cli` 要求的 Markdown
- 补齐 `digest`、封面提示词、封面图生成、去 AI 化步骤
- 给出或执行 `add_draft`、`list_draft`、`publish` 的下一步动作

推荐调用方式：

- 直接点名技能，例如：`使用 wxpost-skill 帮我整理这份公众号素材`
- 在支持显式技能名的环境里，用：`$wxpost-skill`

典型示例：

```text
使用 wxpost-skill，把我下面这份采访提纲整理成一篇公众号图文消息。
要求保留原观点，语言更简洁，生成 digest，并给出封面图提示词。
```

```text
使用 wxpost-skill，把这个活动相册整理成 newspic 图片消息。
正文只保留两句话，并提炼几个 #标签。
```

```text
使用 wxpost-skill，基于这个 article.md 检查 front matter 是否完整，
然后给出 add_draft 和 publish 的下一步命令。
```

## 配合 wxpost-cli 执行实际发文

如果是 `news` 图文消息，`cover` 支持两种输入方式：

- 图片路径：直接使用，不重复生成，除非用户明确要求重做封面
- 一段提示词：这是推荐默认方式。先根据摘要生成封面提示词填入 `cover`，在发布前或建草稿前，再调用 `npx @rongyan/image-gen-cli@latest` 生成封面图，并把 `cover` 替换成最终图片路径

需要注意的是：微信公众号图文消息封面建议裁剪为 `2.35:1`。由于 `@rongyan/image-gen-cli` 当前不直接支持这个宽高比，推荐先生成 `16:9` 宽图，再裁成最终封面。

示例：

```bash
npx @rongyan/image-gen-cli@latest "扁平简洁的公众号封面插画，几何构图，大留白" --output ./images/cover-raw.jpg --aspect-ratio 16:9
```

如果用户想手动生成封面，也可以只让技能输出提示词和目标裁剪规格。

图文消息草稿：

```bash
npx @rongyan/wxpost-cli@latest add_draft article.md
```

查看草稿：

```bash
npx @rongyan/wxpost-cli@latest list_draft
```

发布草稿：

```bash
npx @rongyan/wxpost-cli@latest publish <media_id>
```

## 支持的内容模式

### `news` 图文消息

适用于有完整正文的公众号文章。技能会重点处理：

- 素材整理与润色
- 时效信息核实
- `digest` 摘要生成
- 基于摘要生成封面图提示词
- 去 AI 化处理
- 生成符合 `wxpost-cli` 要求的 Markdown

`digest` 默认建议控制在 120 个中文字符以内。

### `newspic` 图片消息

适用于一组本地图片作为主体内容的消息。技能会重点处理：

- 提炼一两句纯文本说明
- 从内容中提取关键词，整理成 `#标签`
- 生成符合 `newspic` 模式要求的 Markdown

## 包内文件说明

- [SKILL.md](./SKILL.md)：主技能说明
- [references/wxpost-cli-cheatsheet.md](./references/wxpost-cli-cheatsheet.md)：`wxpost-cli` 速查
- [references/writing-rules.md](./references/writing-rules.md)：写作规则
- [agents/openai.yaml](./agents/openai.yaml)：技能元数据

## 建议安装的外部依赖

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

建议实际发文时优先使用 `npx @rongyan/wxpost-cli@latest`，这样可以尽量拿到最新版本的 CLI。

### 2. `humanizer-zh`

用途：对 `news` 正文做最后一轮去 AI 化

仓库： [op7418/Humanizer-zh](https://github.com/op7418/Humanizer-zh/tree/main)

推荐安装：

```bash
npx skills add https://github.com/op7418/Humanizer-zh.git
```

备用方式：手动安装到对应技能目录。它不是强依赖，但在 `news` 图文消息模式下建议安装。

### 3. `@rongyan/image-gen-cli`

用途：当 `cover` 是提示词时生成封面图

仓库： [rongyan6/image-gen-cli](https://github.com/rongyan6/image-gen-cli)

推荐安装：

```bash
npm install -g @rongyan/image-gen-cli@latest
```

备用方式：

```bash
npx @rongyan/image-gen-cli@latest "扁平简洁的公众号封面插画" --output ./images/cover-raw.jpg --aspect-ratio 16:9
```

生成后再裁成公众号封面所需的 `2.35:1`。

### 4. `wxpost-server`

用途：为 `wxpost-cli` 提供上传图片、建草稿、发布草稿的服务端能力

仓库： [rongyan6/wxpost-server](https://github.com/rongyan6/wxpost-server)

`@rongyan/wxpost-cli` 在真正上传图片、创建草稿和发布草稿时，依赖一个可用的 `wxpost-server` 实例。若只做内容加工而不执行运营命令，可以暂时不安装。
