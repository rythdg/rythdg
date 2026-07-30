const LINK_LABELS = {
  blog: "Blog Post",
  publication: "Publication",
  github: "GitHub",
  project: "Project",
};

// Tags a link to a full post page with where it was clicked from, so the
// post's back link can return to the right listing page.
function withFrom(url, from) {
  if (!url || url === "#") return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}from=${from}`;
}

function renderBlocks(containerId, withLinks) {
  const container = document.getElementById(containerId);
  if (!container) return;

  projects.forEach((project) => {
    const isBlogLink = !withLinks && project.post;
    const block = document.createElement(isBlogLink ? "a" : "section");
    block.className = withLinks
      ? "research-block"
      : isBlogLink
        ? "blog-block blog-block-link"
        : "blog-block";
    if (isBlogLink) block.href = withFrom(project.post, "blog");

    const thumb = document.createElement("img");
    thumb.className = "block-thumb";
    thumb.src = project.thumbnail;
    thumb.alt = "";
    block.appendChild(thumb);

    const content = document.createElement("div");
    content.className = "block-content";
    content.innerHTML = `<h2>${project.title}</h2><p>${project.description}</p>`;
    block.appendChild(content);

    if (withLinks) {
      const links = document.createElement("div");
      links.className = "block-links";
      Object.entries(project.links || {})
        .filter(([, url]) => url)
        .forEach(([key, url]) => {
          const a = document.createElement("a");
          a.href = key === "blog" && url === project.post ? withFrom(url, "research") : url;
          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = LINK_LABELS[key] || key;
          links.appendChild(a);
        });
      block.appendChild(links);
    }

    container.appendChild(block);
  });
}

// Renders a project's `references` array as a numbered bibliography.
// Call from a post page, e.g. renderReferences("references", "posts/project-one.html")
// — the postPath must match that project's `post` value in projects.js exactly.
function renderReferences(containerId, postPath) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const project = projects.find((p) => p.post === postPath);
  if (!project || !project.references || !project.references.length) return;

  const list = document.createElement("ol");
  list.className = "references-list";
  project.references.forEach((ref) => {
    const li = document.createElement("li");
    if (ref.url) {
      const a = document.createElement("a");
      a.href = ref.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = ref.text;
      li.appendChild(a);
    } else {
      li.textContent = ref.text;
    }
    list.appendChild(li);
  });
  container.appendChild(list);
}
