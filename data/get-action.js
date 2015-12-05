var goHome = document.getElementById("go-home");
goHome.addEventListener('mouseup', function onmouseup(event) {
    self.port.emit("goingHome");
}, false);

var bookmarkPage = document.getElementById("bookmark-page");
bookmarkPage.addEventListener('mouseup', function onmouseup(event) {
    self.port.emit("bookmarkPage");
}, false);
