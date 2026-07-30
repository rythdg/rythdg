# rythdg.github.io

Ryth Dasgupta's personal website. Plain HTML/CSS/JS, no build step, no framework,
served directly by GitHub Pages from the `main` branch.

This README is written for two audiences at once: a human who wants to add a
blog post, and an AI coding agent (e.g. Claude Code) asked to do the same thing
on the human's behalf. If you're an agent: read this whole file before editing
anything — it documents conventions that aren't obvious from any single file in
isolation (the `?from=` query param trick, the `post`/`references` linkage
between `projects.js` and files under `posts/`, etc).

---

## 1. How the site is put together

```
index.html          Home page
about.html           About page
research.html        Research listing — auto-renders cards from projects.js
blog.html             Blog listing — auto-renders cards from projects.js
contact.html          Contact info (email, GitHub, CV download)

css/
  style.css           The one stylesheet, used by every page

assets/
  js/
    projects.js         DATA: the single source of truth for every research/blog entry
    render-blocks.js     Renders projects.js into cards on research.html / blog.html,
                          and renders a project's references list on its post page
    post-back.js          Makes a post page's "back" link context-aware (§5)
  img/
    thumb-1.svg ... thumb-4.svg   Placeholder thumbnails — swap for real images

posts/
  project-one.html    A full write-up page (the only one that exists so far).
                       Copy this file as the template for every new post.

files/
  Ryth-Dasgupta-CV.pdf   Linked from contact.html

README.md              This file
```

Every page shares the same `<head>`/`<nav>`/`<footer>` shell and the same
`css/style.css`. There is no templating engine — each `.html` file is a
complete, standalone document. When you change shared chrome (e.g. add a nav
link), you currently have to edit it in every `.html` file; there are 6 of
them plus `posts/*.html`.

**Design language** (already in `css/style.css`, don't fight it): PT Sans
font, pure white background, black text, headings left-aligned, body
paragraphs justified, nav centered, content column capped at `680px` and
centered on the page, mobile-responsive via a `max-width: 480px` /
`max-width: 600px` breakpoint.

---

## 2. Editing a static page (Home, About)

`index.html` and `about.html` have no data layer — they're just HTML you edit
directly. Structure to preserve:

```html
<main>
  <h1>Page Title</h1>
  <p>Intro paragraph.</p>

  <h2>A Section</h2>
  <p>...</p>
</main>
```

Rules that keep it consistent with the rest of the site:
- Every `<p>` inside `<main>` gets justified automatically — don't add
  inline styles.
- Use `<h2>` for subsections; it's left-aligned and gets spacing for free.
- Don't touch `<header>`/`<footer>` unless you're changing the nav sitewide
  (and if so, change it in **every** HTML file, including `posts/*.html` —
  those use `../` prefixed paths since they're one directory deeper).

## 3. Editing the Contact page

`contact.html` uses a simple `<ul class="contact-list">` of
`<span class="contact-label">Label</span> <a href="...">value</a>` pairs. To
add a new contact channel (e.g. LinkedIn), copy an existing `<li>` and change
the label/href. To update the CV, replace
`files/Ryth-Dasgupta-CV.pdf` with the new PDF **using the same filename** (or
update the `href` in `contact.html` if you rename it).

## 4. Adding a Research / Blog entry (the data-driven part)

This is the part that most differs from a normal static site, so read
carefully.

**`assets/js/projects.js` is the single source of truth.** It's a plain
JS array (`const projects = [...]`) — no build step, no JSON fetch (fetch
would break when the site is opened via `file://` instead of `http://`, so
we just declare a global via `<script>` tags instead). Both `research.html`
and `blog.html` include this file and then call `renderBlocks(...)`
(defined in `render-blocks.js`) to turn the array into the visible cards.
**You never hand-write a card's HTML** — you add an object to this array.

### 4.1 Anatomy of one project object

```js
{
  title: "Research Project One",
  description: "One or two sentences — this is the short blurb shown on the card.",
  thumbnail: "assets/img/thumb-1.svg",   // small square image for the card
  post: "posts/project-one.html",        // OPTIONAL: path to a full write-up (§5)
  links: {                                // OPTIONAL, all keys optional
    blog: "posts/project-one.html",       // usually == `post`
    publication: "https://doi.org/...",
    github: "https://github.com/...",
  },
  references: [                           // OPTIONAL: bibliography for the post page (§6)
    { text: "Author, A. (2024). Title. Journal.", url: "https://..." },
    { text: "A reference with no link at all." },
  ],
},
```

Field-by-field:

- **`title`** — required. Rendered as the card's `<h2>`.
- **`description`** — required. Rendered as one `<p>` on the card. Keep it
  short (1–3 sentences); it's a teaser, not the full post.
- **`thumbnail`** — required. Path to a square-ish image. Real images can be
  `.jpg`/`.png`/`.svg`, any size — CSS crops it to a `90×90` box
  (`object-fit: cover`) on desktop and a full-width `160px`-tall strip on
  mobile. Put new images in `assets/img/`.
- **`post`** — optional. If set, it's the path (relative to the site root,
  e.g. `posts/my-post.html`) to a full write-up page. Setting this has two
  effects: (a) on `blog.html`, the whole card becomes a clickable link to
  that page (blog cards otherwise show no links, by design — see §7 history
  below); (b) it's the value you'd normally also put in `links.blog` on the
  research card.
- **`links`** — optional object, used **only on `research.html`** (the
  right-hand column of the card). Recognized keys: `blog`, `publication`,
  `github` (there's also a generic `project` label available in
  `LINK_LABELS` in `render-blocks.js` if you need a 4th kind of link).
  **Only keys present with a truthy value render** — this is how you get
  "3–4 links depending on availability": a project with no publication yet
  just omits `links.publication`.
- **`references`** — optional array of `{ text, url? }`. Not shown on cards
  at all. See §6 for how to render it on a post page.

### 4.2 Adding a brand new project — step by step

Say you want to add a 5th project called "Project Five" with a real image,
a full write-up, a publication link, and no GitHub repo yet.

1. **Add the thumbnail.** Drop your image at e.g.
   `assets/img/project-five.jpg` (any reasonable size — it'll be cropped to
   a square by CSS).
2. **Add the entry to `assets/js/projects.js`**, inside the `projects`
   array:
   ```js
   {
     title: "Project Five",
     description: "A one-sentence summary of what this project is about.",
     thumbnail: "assets/img/project-five.jpg",
     post: "posts/project-five.html",
     links: {
       blog: "posts/project-five.html",
       publication: "https://doi.org/10.xxxx/xxxxx",
     },
   },
   ```
   Note there's no `github` key at all — that link simply won't appear on
   the card. No `references` yet either — that's fine, it's optional.
3. **Write the full post.** See §5.
4. **Preview.** Open `research.html` and `blog.html` directly in a browser
   (double-click, or `open research.html` on macOS) — no server needed,
   everything works over `file://`. Confirm the new card appears with the
   right thumbnail, description, and links.
5. **Commit and push** (§8) — GitHub Pages rebuilds automatically.

If you *don't* want a full write-up yet, just omit `post` and
`links.blog` — the card still renders fine with whatever links you do have.

## 5. Writing a full post page (with inline figures)

Full write-ups live in `posts/`, one HTML file per project, and are
**hand-authored** — they are not generated from `projects.js` (only the
teaser cards are). `posts/project-one.html` is the reference example; copy
it wholesale for a new post.

### 5.1 Template skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Five | Ryth Dasgupta</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <header>
    <nav>
      <a href="../index.html">Home</a>
      <a href="../about.html">About</a>
      <a href="../research.html">Research</a>
      <a href="../blog.html">Blog</a>
      <a href="../contact.html">Contact</a>
    </nav>
  </header>
  <main>
    <a class="post-back" id="post-back" href="../blog.html">&larr; Back to Blog</a>
    <h1>Project Five</h1>

    <p>Opening paragraph...</p>

    <!-- figures go here, see 5.2 -->

    <h2>References</h2>
    <div id="references"></div>
  </main>
  <footer>
    <p>&copy; 2026 Ryth Dasgupta</p>
  </footer>
  <script src="../assets/js/projects.js"></script>
  <script src="../assets/js/render-blocks.js"></script>
  <script src="../assets/js/post-back.js"></script>
  <script>renderReferences("references", "posts/project-five.html");</script>
</body>
</html>
```

**Important:** everything is prefixed `../` because `posts/` is one
directory below the site root (`../css/style.css`, `../index.html`, etc).
This is the single most common mistake when copying the template — don't
forget the `../`.

### 5.2 Adding an inline figure

Anywhere inside `<main>`, between paragraphs, drop:

```html
<figure class="post-figure">
  <img src="../assets/img/my-figure.png" alt="Describe the figure for accessibility">
  <figcaption>Figure 1. A caption describing what this shows.</figcaption>
</figure>
```

`.post-figure` (in `css/style.css`) handles everything: the image is capped
at the content column width and scales responsively, gets a thin border,
and the caption renders centered, smaller, and italic below it. Just add
more `<figure>` blocks for more figures — number them yourself in the
caption text (there's no auto-numbering).

### 5.3 The back-link mechanism (`?from=`)

The "← Back to ..." link at the top of a post page is **not hardcoded** —
it depends on which listing page you clicked in from, because a post can be
reached from either `research.html` (via the "Blog Post" link) or
`blog.html` (via the whole card).

How it works, so you don't accidentally break it:
- `render-blocks.js` appends `?from=research` or `?from=blog` to any link
  it generates that points at a project's `post` page (see `withFrom()` in
  that file).
- `assets/js/post-back.js` reads that query param on page load and rewrites
  whichever element has `id="post-back"` to point at the right listing page
  with the right label.
- **For this to work on a new post page**, you must: keep
  `id="post-back"` on the back-link `<a>`, and include
  `<script src="../assets/js/post-back.js"></script>` before `</body>`.
  The `href`/text you hardcode in the HTML is just a fallback in case
  JS is disabled — it's overwritten on load.

## 6. Adding references / a bibliography to a post

References live in `projects.js`, **not** hardcoded into the post's HTML —
this keeps citation data in one place if you ever want to reuse it (e.g. a
future "Publications" page).

1. Add a `references` array to the project's entry in `projects.js`:
   ```js
   references: [
     { text: "Author, A. (2024). Paper Title. Journal Name, 1(1), 1-10.", url: "https://doi.org/..." },
     { text: "A source with no link, e.g. a physical book." },
   ],
   ```
   `url` is optional per-entry — omit it and the reference renders as plain
   text instead of a link.
2. In the post page's `<main>`, add a mount point:
   ```html
   <h2>References</h2>
   <div id="references"></div>
   ```
3. Before `</body>`, after `projects.js` and `render-blocks.js` are loaded,
   call:
   ```html
   <script>renderReferences("references", "posts/project-five.html");</script>
   ```
   The second argument **must exactly match** the `post` path you set on
   that project in `projects.js` — that's how `renderReferences` finds the
   right project's bibliography. It renders as a numbered (`<ol>`) list.

If a project has no `references` array (or an empty one), the `<div>` just
stays empty — nothing breaks, no "References" heading needs to be
conditionally hidden by you, though you may want to omit the whole
`<h2>References</h2>` block by hand if you know upfront there won't be any.

## 7. Design conventions worth knowing before you improvise

- Centering + justification: page content is centered as a column via
  `main { max-width: 680px; margin: 0 auto; }`; text *within* that column is
  justified (`main p { text-align: justify }`) and headings are
  left-aligned. Don't reintroduce `text-align: center` on body text.
- Font is loaded via `@import` at the top of `css/style.css` (Google Fonts,
  PT Sans). Don't add a second font without updating that import.
- Card layout (`.research-block` / `.blog-block`) is a flexbox row
  (thumbnail, content, optional links column) that collapses to a stacked
  column under `600px` — see the media query at the bottom of
  `css/style.css` if you need to adjust mobile behavior.
- Blog cards intentionally have **no visible link column** (that was a
  deliberate design choice) — their only interactivity is the whole-card
  link to the full post, when one exists.

## 8. Previewing and publishing

**Preview locally:** just open the HTML file directly —
`open research.html` (macOS) or double-click it in Finder. No server, no
build step. Everything (including the `projects.js` data layer) works over
`file://`.

**Publish:** this repo *is* the live site. GitHub Pages serves whatever is
on the `main` branch of `rythdg/rythdg.github.io` at the repo root — commit
and push to `main` and the change is live at https://rythdg.github.io/
within a minute or two:

```bash
git add -A
git commit -m "Add Project Five write-up"
git push
```

There is no staging environment — pushing to `main` is publishing.

## 9. Future / optional: a GUI for non-technical edits

Everything above assumes editing files directly (by hand or via an AI
coding agent). If at some point a drag-and-drop editing experience is
wanted — especially for uploading images without touching Git — Decap CMS
(free, open-source) can be added on top of this exact repo structure
without changing anything documented above. Ask for it if/when it's
wanted; it hasn't been set up yet.
