// When the user hits return, send the "text-entered"
// message to main.js.
// The message payload is the contents of the edit box.
var goHome = document.getElementById("go-home");
goHome.addEventListener('mouseup', function onmouseup(event) {
    console.log('Going home...');
  // if (event.keyCode == 13) {
  //   // Remove the newline.
  //   text = textArea.value.replace(/(\r\n|\n|\r)/gm,"");
  //   self.port.emit("text-entered", text);
  //   textArea.value = '';
  // }
}, false);

// Listen for the "show" event being sent from the
// main add-on code. It means that the panel's about
// to be shown.
//
// Set the focus to the text area so the user can
// just start typing.
// self.port.on("show", function onShow() {
//   textArea.focus();
// });
