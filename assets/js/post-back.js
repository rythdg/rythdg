(function () {
  const params = new URLSearchParams(window.location.search);
  const from = params.get("from");
  const link = document.getElementById("post-back");
  if (!link) return;

  if (from === "research") {
    link.href = "../research.html";
    link.textContent = "← Back to Research";
  } else {
    link.href = "../blog.html";
    link.textContent = "← Back to Blog";
  }
})();
