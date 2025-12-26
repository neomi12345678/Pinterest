document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".admin-menu a");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }
  });
});
