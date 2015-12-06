var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var tabs = require("sdk/tabs");
var self = require("sdk/self");

var {Cc, Ci} = require("chrome");
// var cookieSvc = Cc["@mozilla.org/cookieService;1"].getService(Ci.nsICookieService);

var cookieManager = Cc["@mozilla.org/cookiemanager;1"].getService(Ci.nsICookieManager2);

var data = require("sdk/self").data;
var contentScriptFile = data.url("get-action.js");

var button = ToggleButton({
  id: "my-button",
  label: "my button",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: handleChange
});

var panel = panels.Panel({
  contentURL: self.data.url("panel.html"),
  onHide: handleHide,
  contentScriptFile: contentScriptFile
});

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}

panel.port.on("goingHome", function() {
  console.log('In index.js - going home');
  panel.hide();
});

panel.port.on("bookmarkPage", function() {

  var cookies = cookieManager.getCookiesFromHost("leonieknox.com");
  // var cookies = cookieManager.enumerator

  while (cookies.hasMoreElements()) {
    var cookie = cookies.getNext().QueryInterface(Ci.nsICookie2);

    if (cookie.name === 'bookmarklyLogin') {
        dump(cookie.host + ";" + cookie.name + "=" + cookie.value + "\n");
        var cookieValue = JSON.parse(unescape(cookie.value));
        // console.log(JSON.stringify(cookieValue));
        // console.log('Screen name: ' + cookieValue['screenName']);
        console.log('Token: ' + cookieValue.token);
    }
  }

  panel.hide();
});
