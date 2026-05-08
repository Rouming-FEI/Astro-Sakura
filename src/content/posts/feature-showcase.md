---
title: "博客功能全景展示 — 从排版到代码高亮的一切"
date: "2024-03-01"
updated: "2024-05-01"
category: "Tech"
tags: ["astro", "blog", "showcase", "markdown"]
excerpt: "一篇覆盖所有博客功能的完整展示文章，包括代码块、表格、引用、排版、TOC、标签、分类等。"
pinned: true
---

## 引言

这篇文章旨在**全面展示**本博客的各项功能与排版能力。无论你是读者还是潜在的使用者，都可以通过本文了解博客支持哪些 Markdown 特性以及它们的实际渲染效果。

博客基于 **Astro** 静态站点生成器构建，使用 Shiki 进行代码语法高亮，支持 GFM（GitHub Flavored Markdown）扩展语法。

---

## 文本排版基础

Markdown 的核心理念是**易读易写**——纯文本格式既能被人类直接阅读，也能被程序解析为结构化文档。本段包含一些**加粗文字**、*斜体文字*以及 ~~删除线~~（使用 `~~` 包裹），还有 `行内代码` 和 [超链接](https://astro.build)。

当我们需要同时使用多种样式时，比如 **_粗斜体_** 或者 `code` 中的 **加粗**（注意行内代码内不支持嵌套样式），Markdown 都能很好地处理。你还可以使用上标如 E = mc² 和下标如 H₂O（如果渲染器支持 HTML 标签的话，如 `E = mc<sup>2</sup>` 和 `H<sub>2</sub>O`）。

### 段落与换行

段落之间由一个空行分隔。在 Markdown 中，单个换行符不会产生新段落——它会被忽略。这是为了让作者在编辑器中自由换行而不影响最终排版。

如果你想在同一段落内强制换行，  
可以在行尾加两个空格，或者像上面这样使用 `<br>` 标签。

---

## 标题层级

本博客支持 **h2 到 h4** 的标题层级，h1 保留给文章标题。目录（TOC）会自动从这些标题生成，显示在桌面端侧边栏。

### 三级标题

三级标题适用于主要章节下的子话题。

#### 四级标题

四级标题用于更细粒度的内容划分。值得注意的是，TOC 默认只显示 h2 和 h3——如果文章非常长，h4 也可以加入。

---

## 代码块

代码块是技术博客的核心功能。本博客使用 **Shiki** 进行语法高亮，并配备了**一键复制按钮**——鼠标悬停在代码块上即可看到右上角的复制按钮。

### JavaScript 示例

```js
// QuickSort implementation
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

const data = [3, 6, 8, 10, 1, 2, 1];
console.log(quickSort(data)); // [1, 1, 2, 3, 6, 8, 10]
```

### TypeScript 示例

```ts
interface BlogPost {
  title: string;
  date: string;
  tags: string[];
  category?: string;
  draft: boolean;
}

async function getPosts(): Promise<BlogPost[]> {
  const response = await fetch('/api/posts');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// 使用泛型约束
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {} as Pick<T, K>);
}
```

### Python 示例

```python
import asyncio
from dataclasses import dataclass
from typing import Optional

@dataclass
class Article:
    title: str
    content: str
    views: int = 0

    def summary(self, max_len: int = 120) -> str:
        return self.content[:max_len] + "..." if len(self.content) > max_len else self.content

async def fetch_articles(urls: list[str]) -> list[Article]:
    """并发获取多篇文章"""
    async def fetch_one(url: str) -> Optional[Article]:
        try:
            # 模拟网络请求
            await asyncio.sleep(0.5)
            return Article(title=url, content=f"Content from {url}")
        except Exception as e:
            print(f"Failed to fetch {url}: {e}")
            return None

    tasks = [fetch_one(url) for url in urls]
    results = await asyncio.gather(*tasks)
    return [r for r in results if r is not None]
```

### CSS 示例

```css
/* 响应式网格布局 */
.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding: 20px;
}

.post-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

@media (prefers-reduced-motion: reduce) {
  .post-card {
    transition: none;
  }
}
```

### Shell 命令

```bash
# 构建并部署 Astro 站点
npx astro build && rsync -avz --delete dist/ user@server:/var/www/blog/

# 查看构建日志中的错误
cat dist/_astro/*.log 2>/dev/null | grep -i "error" | sort | uniq -c

# Git 工作流
git add src/content/posts/new-post.md
git commit -m "feat: add feature showcase post"
git push origin main
```

### JSON 配置

```json
{
  "site": {
    "title": "My Blog",
    "description": "A personal blog built with Astro",
    "features": {
      "steam": false,
      "bangumi": true,
      "bilibili": true
    }
  },
  "theme": {
    "primary": "#7595e8",
    "font": {
      "serif": "Noto Serif SC",
      "sans": "Noto Sans SC",
      "mono": "Fira Code"
    }
  }
}
```

### Shiki 支持的语言

本博客使用 **Shiki 4.x** 进行代码语法高亮，内置支持 **200+** 种语言。以下是完整列表：

| 分类 | 语言 |
| :--- | :--- |
| **Web / 标记** | `html` `css` `scss` `sass` `less` `stylus` `postcss` `xml` `xsl` `svg` `markdown` `mdx` `md` `mdc` `astro` `pug` `jade` `haml` `slim` `mjml` `blade` `twig` `jinja` `liquid` `mustache` `handlebars` `hbs` `ejs` `erb` `soy` `edge` `jsx` `tsx` `vue` `vue-html` `vue-vine` `svelte` `angular-html` `angular-ts` `glimmer-js` `glimmer-ts` `razor` `templ` `asciidoc` `adoc` `mediawiki` `wikitext` |
| **JavaScript 生态** | `javascript` `js` `typescript` `ts` `mjs` `cjs` `cts` `mts` `gjs` `gts` `node` `flow` `coffeescript` `coffee` `livescript` `actionscript-3` `qs` `qsharp` |
| **系统 / 底层** | `c` `cpp` `c++` `c#` `csharp` `cs` `rust` `rs` `go` `golang` `zig` `odin` `nim` `d` `v` `vala` `swift` `objective-c` `objc` `objective-cpp` `haxe` `c3` `carbon` `moonbit` `mojo` `cadence` `cairo` `move` `circom` |
| **JVM 生态** | `java` `kotlin` `kt` `kts` `scala` `groovy` `clojure` `clj` `closure-templates` |
| **脚本 / 动态** | `python` `py` `ruby` `rb` `perl` `php` `lua` `luau` `racket` `scheme` `tcl` `elixir` `erl` `erlang` `gleam` `julia` `jl` `r` `matlab` `octave` `stata` `hack` |
| **函数式** | `haskell` `hs` `ocaml` `f#` `fsharp` `fs` `elm` `purescript` `idris` `agda` `coq` `lean` `lean4` `reason` `rescript` `common-lisp` `lisp` `emacs-lisp` `elisp` `clarity` |
| **Shell / 脚本** | `bash` `sh` `shell` `shellscript` `zsh` `fish` `powershell` `ps1` `bat` `batch` `cmd` `awk` `sed` `make` `makefile` `just` `nu` `nushell` `shellsession` `console` |
| **数据 / 配置** | `json` `jsonc` `json5` `jsonl` `yaml` `yml` `toml` `csv` `tsv` `xml` `ini` `properties` `dotenv` `hjson` `hcl` `cue` `jsonnet` `kdl` `pkl` `ron` `edn` |
| **查询语言** | `sql` `plsql` `graphql` `gql` `sparql` `cypher` `cql` `kql` `kusto` `splunk` `spl` `soql` `sosl` `prisma` `surql` `surrealql` `hiveql` `ql` |
| **样式 / 着色器** | `css` `scss` `sass` `less` `stylus` `postcss` `glsl` `hlsl` `wgsl` `shader` `shaderlab` `gdshader` `qmldir` `qss` `tss` |
| **DevOps / Infrastructure** | `docker` `dockerfile` `nginx` `terraform` `tf` `tfvars` `puppet` `ansible` `salt` `hcl` `packer` `vagrant` `cloudformation` `bicep` `cdc` `systemd` `ssh-config` |
| **区块链 / Web3** | `solidity` `vyper` `move` `cadence` `cairo` `tact` `func` `fift` |
| **领域特定 (DSL)** | `regex` `regexp` `latex` `tex` `bibtex` `typst` `typ` `mermaid` `graphviz` `dot` `gnuplot` `matlab` `dax` `mdx` `turtle` `sparql` `owl` `prolog` `jison` `nearley` `tla` `alloy` `promela` `spin` |
| **其他** | `proto` `protobuf` `thrift` `avro` `capnp` `gherkin` `cucumber` `jsonata` `json-e` `jq` `xpath` `xquery` `wasm` `wat` `llvm` `ir` `asm` `mips` `mipsasm` `riscv` `vhdl` `verilog` `system-verilog` `bluespec` `bsv` `apl` `j` `k` `q` `forth` `factor` `io` `smalltalk` `self` `supercollider` `max` `puredata` `csound` `faust` `chuck` |

> **说明**：以上列表从 Shiki 4.x 的 `bundledLanguages` 导出。实际使用时直接指定语言别名即可，例如 ` ```ts ` 启用 TypeScript 高亮。部分语言支持子语言切换（如 `vue-html`、`angular-ts`），可在同一文件中嵌入多种语法。

---

## 表格

表格使用 GFM 扩展语法，支持列对齐。

### 功能对比表

| 功能 | 状态 | 数据来源 | 说明 |
| :--- | :---: | :--- | :--- |
| 文章列表 | ✅ 完成 | 本地 Markdown | 支持分页、置顶 |
| 分类 / 标签 | ✅ 完成 | Frontmatter | 支持交叉筛选 |
| 代码高亮 | ✅ 完成 | Shiki | 200+ 语言支持 |
| 一键复制 | ✅ 完成 | Clipboard API | 悬停显示按钮 |
| 目录导航 | ✅ 完成 | 标题解析 | 桌面端侧边栏 |
| 评论系统 | ✅ 完成 | Giscus | GitHub Discussions |
| 搜索 | ✅ 完成 | 本地索引 | 全文 + 标签搜索 |
| RSS | ✅ 完成 | Astro RSS | 标准 RSS 2.0 |
| OG 图像 | ✅ 完成 | Sharp | 自动生成 PNG |
| 追番页面 | ✅ 完成 | Bilibili API | 追番进度展示 |
| B站收藏 | ✅ 完成 | Bilibili API | 收藏夹浏览 |
| Steam 库 | ⏳ 待配置 | Steam API | 需要 API Key |
| 浅色/深色 | ✅ 完成 | CSS 变量 | 自动 / 手动切换 |

### 性能指标

| 指标 | 数值 | 目标 |
| :--- | ---: | ---: |
| Lighthouse Performance | 99 | ≥ 95 |
| First Contentful Paint | 0.6s | < 1.0s |
| Time to Interactive | 0.8s | < 1.5s |
| 构建时间 (100 篇) | 2.1s | < 5s |
| 单页 JS 体积 | 3.2 KB | < 10 KB |

---

## 列表与嵌套

### 无序列表

- **前端框架**
  - React 19
    - Server Components
    - Suspense & Streaming
  - Vue 3
  - Svelte 5
- **构建工具**
  - Astro
  - Vite
  - Turbopack
- **样式方案**
  - CSS Variables（本站使用）
  - Tailwind CSS
  - Vanilla Extract

### 有序列表

1. 创建 Astro 项目：`npx create astro@latest`
2. 配置内容集合
   1. 定义 schema
   2. 设置 glob loader
   3. 编写第一篇 Markdown
3. 自定义布局组件
4. 添加交互功能
5. 构建并部署

### 任务列表

- [x] 搭建 Astro 项目骨架
- [x] 配置 Content Collections
- [x] 实现浅色 / 深色主题切换
- [x] 添加分类页（类目 / 标签 / 时间线）
- [x] 实现一键复制代码功能
- [ ] 配置 Steam API 代理
- [ ] 接入 Webmention
- [ ] 添加多语言支持（低优先级）

---

## 引用块

> **知识就是力量** — 弗朗西斯·培根
>
> 这段引用跨越多行。在 Markdown 中，你可以使用 `>` 前缀来创建引用块。引用块内可以包含其他 Markdown 元素。

> ### 引用中的标题
>
> 引用块可以嵌套其他 Markdown 元素，包括标题、列表甚至是另一个引用。
>
> - 这是引用中的列表项
> - 这是另一个列表项
>
>> 这是嵌套引用。你可以在引用中再引用其他内容。
>>
>> 嵌套引用常用于学术讨论中的引文追溯。

> 💡 **提示**：本博客的引用块使用左边框 + 浅色背景的样式，左侧边框颜色使用主题色 `var(--primary)`。

---

## 数学公式（LaTeX）

本博客已集成 **KaTeX** 渲染引擎，支持行内公式 `$...$` 和块级公式 `$$...$$`。

### 行内公式

勾股定理：$a^2 + b^2 = c^2$；欧拉恒等式：$e^{i\pi} + 1 = 0$；质能方程：$E = mc^2$。

行内公式可以和普通文字混排，比如讨论时间复杂度 $O(n \log n)$ 或提到集合 $\{x \in \mathbb{R} \mid x > 0\}$。

### 块级公式

二次求根公式：

$$ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$

傅里叶变换：

$$ \hat{f}(\xi) = \int_{-\infty}^{\infty} f(x)\ e^{-i 2\pi \xi x}\ dx $$

柯西-施瓦茨不等式：

$$ \left( \sum_{k=1}^{n} a_k b_k \right)^2 \leq \left( \sum_{k=1}^{n} a_k^2 \right) \left( \sum_{k=1}^{n} b_k^2 \right) $$

矩阵行列式：

$$
\det(A) = \begin{vmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{vmatrix}
$$

贝叶斯定理：

$$ P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{P(B)} $$

### 常用符号

| 类别 | 示例 |
| :--- | :--- |
| 希腊字母 | $\alpha, \beta, \gamma, \delta, \epsilon, \theta, \lambda, \mu, \pi, \sigma, \phi, \omega$ |
| 大写希腊 | $\Gamma, \Delta, \Theta, \Lambda, \Pi, \Sigma, \Phi, \Omega$ |
| 集合 | $\mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{R}, \mathbb{C}$ |
| 运算符 | $\pm, \times, \div, \cdot, \circ, \oplus, \otimes$ |
| 关系 | $\leq, \geq, \neq, \approx, \equiv, \propto, \in, \subset$ |
| 箭头 | $\to, \implies, \iff, \mapsto, \uparrow, \downarrow$ |
| 括号 | $(x), [x], \{x\}, \lfloor x \rfloor, \lceil x \rceil$ |

---

## 水平分割线

上面的分割线（`---`）在视觉上将内容分隔为独立的部分。这在长篇技术文章中非常有用，可以帮助读者在视觉上区分不同的主题板块。

---

## 图片展示

Markdown 支持通过 `![alt](url)` 语法插入图片。以下是一些示例（你需要替换为实际存在的图片 URL）：

> 如果你在 `public/images/` 目录下放置了图片，可以通过 `/images/filename.png` 路径引用它们。图片会自动适配容器宽度，并带有圆角边框。

---

## 链接卡片

当段落中**仅包含一个链接**时，会自动渲染为链接卡片样式：

https://astro.build

普通段落中的链接保持默认样式，但鼠标悬停时会弹出网址预览工具提示。

---

## 总结

本文展示了本博客支持的以下功能：

| 分类 | 涵盖特性 |
| :--- | :--- |
| **文本排版** | 加粗、斜体、删除线、行内代码、超链接、换行 |
| **标题层级** | H2 ~ H4，自动生成目录 |
| **代码块** | 200+ 种语言高亮 + 一键复制按钮 |
| **表格** | GFM 表格、列对齐 |
| **列表** | 无序、有序、嵌套、任务列表 |
| **引用** | 块引用、嵌套引用、带标题引用 |
| **分割线** | 视觉内容分隔 |
| **其他** | OG 图片生成、RSS、评论、搜索 |

这份展示文档本身也是博客功能的一部分——你可以将其作为模板来编写自己的文章。只需复制本文的 Markdown 源码，替换内容和 frontmatter，即可快速上手。
