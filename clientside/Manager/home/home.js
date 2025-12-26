function goTo(type) {
  switch (type) {
    case "users":
      window.location.href = "../users/users.html";
      break;
    case "pins":
      window.location.href = "../pins/pins.html";
      break;
    case "tags":
      window.location.href = "../tags/tags.html";
      break;
  }
}
