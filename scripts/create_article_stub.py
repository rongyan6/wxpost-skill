#!/usr/bin/env python3
"""
生成兼容 wxpost-cli 的 Markdown 骨架文件。
"""

from __future__ import annotations

import argparse
from pathlib import Path


def build_stub(title: str, cover: str, author: str | None, digest: str | None) -> str:
    frontmatter = ["---", f"title: {title}"]
    if author:
        frontmatter.append(f"author: {author}")
    if digest:
        frontmatter.append(f"digest: {digest}")
    frontmatter.extend([f"cover: {cover}", "---", "", "请基于用户提供的素材继续完善正文。", ""])
    return "\n".join(frontmatter)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="生成兼容 wxpost-cli 的 Markdown 骨架文件。",
    )
    parser.add_argument("output", help="输出 Markdown 文件路径")
    parser.add_argument("--type", choices=["news", "newspic"], default="news", help="消息类型")
    parser.add_argument("--title", required=True, help="标题")
    parser.add_argument("--cover", help="news 模式下的相对封面图路径")
    parser.add_argument("--author", help="作者名")
    parser.add_argument("--digest", help="自定义摘要")
    parser.add_argument(
        "--image",
        action="append",
        dest="images",
        default=[],
        help="newspic 模式下的相对图片路径，可重复传入",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="如果输出文件已存在则覆盖",
    )
    args = parser.parse_args()

    output = Path(args.output).expanduser().resolve()
    if output.exists() and not args.force:
        raise SystemExit(f"输出文件已存在，拒绝覆盖：{output}")

    if args.type == "news" and not args.cover:
        raise SystemExit("news 模式下必须提供 --cover")
    if args.type == "newspic" and not args.images:
        raise SystemExit("newspic 模式下至少需要一个 --image")

    output.parent.mkdir(parents=True, exist_ok=True)
    if args.type == "news":
        content = build_stub(args.title.strip(), args.cover.strip(), args.author, args.digest)
    else:
        frontmatter = [
            "---",
            f"title: {args.title.strip()}",
            "article_type: newspic",
            "image_list:",
        ]
        frontmatter.extend([f"  - {image.strip()}" for image in args.images])
        frontmatter.extend(["---", "", "一句或两句纯文本说明。#标签A #标签B", ""])
        content = "\n".join(frontmatter)

    output.write_text(content, encoding="utf-8")
    print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
