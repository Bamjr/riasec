document.addEventListener("DOMContentLoaded", () => {
  const NEXT_PAGE = "story1.html";
  const tapArea = document.getElementById("tapArea");

  tapArea.addEventListener("click", (e) => {
    const blocked = e.target.closest(
      "iframe, a, button, input, textarea, select, label"
    );
    if (blocked) return;

    window.location.href = NEXT_PAGE;
  });
});
