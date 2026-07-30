// Single source of truth for research/blog entries.
// Add a new project by adding an object here — it will
// automatically appear on both research.html and blog.html.
//
// links is optional per-key: only keys with a non-empty value
// will render a link on the research page.
//
// post (optional): path to a full write-up page (see posts/project-one.html
// for an example with inline figures). When set, the blog card links to it,
// and it's a natural target for links.blog on the research card too.
//
// references (optional): a bibliography for the project's full post page.
// Each entry is { text, url }; url is optional. Not shown on the cards —
// call renderReferences() from the post page itself (see
// posts/project-one.html for a working example).
const projects = [
  {
    title: "Research Project One",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    thumbnail: "assets/img/thumb-1.svg",
    post: "posts/project-one.html",
    links: {
      blog: "posts/project-one.html",
      publication: "#",
      github: "#",
    },
    references: [
      {
        text: "Smith, J. & Doe, A. (2024). A Made-Up Paper Title for Demonstration Purposes. Journal of Placeholder Studies, 12(3), 45–67.",
        url: "#",
      },
      {
        text: "Lorem, I. (2023). Ipsum Dolor: Sit Amet Consectetur. Proceedings of Example Conference.",
        url: "#",
      },
      {
        text: "Reference with no link — just plain citation text, e.g. a book or unpublished note.",
      },
    ],
  },
  {
    title: "Research Project Two",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt.",
    thumbnail: "assets/img/thumb-2.svg",
    links: {
      blog: "#",
      github: "#",
    },
  },
  {
    title: "Research Project Three",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.",
    thumbnail: "assets/img/thumb-3.svg",
    links: {
      publication: "#",
      github: "#",
    },
  },
  {
    title: "Research Project Four",
    description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt, neque porro quisquam est.",
    thumbnail: "assets/img/thumb-4.svg",
    links: {
      blog: "#",
    },
  },
];
