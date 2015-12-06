var {
    ToggleButton
} = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var tabs = require("sdk/tabs");
var Request = require("sdk/request").Request;
var self = require("sdk/self");

var {
    Cc, Ci
} = require("chrome");

var cookieManager = Cc["@mozilla.org/cookiemanager;1"].getService(Ci.nsICookieManager2);

var data = require("sdk/self").data;
var contentScriptFile = data.url("get-action.js");

var baseUrl = 'http://www.leonieknox.com:3003'

var button = ToggleButton({
    id: "bookmarkly-button",
    label: "Bookmarkly",
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
    contentScriptFile: contentScriptFile,
    width: 270,
    height: 100
});

var noTokenPanel = panels.Panel({
    contentURL: self.data.url("no-token.html"),
    width: 300,
    height: 160
});

function handleChange(state) {
    if(state.checked) {
        panel.show({
            position: button
        });
    }
}

function handleHide() {
    button.state('window', {
        checked: false
    });
}

panel.port.on("goingHome", function () {
    tabs.open(baseUrl + '/');
    panel.hide();
});

panel.port.on("bookmarkPage", function () {

    panel.hide();

    var cookies = cookieManager.getCookiesFromHost("leonieknox.com");  // leonieknox.com
    // var cookies = cookieManager.enumerator
    var cookieFound = false;
    var token = '';

    while(cookies.hasMoreElements()) {
        var cookie = cookies.getNext().QueryInterface(Ci.nsICookie2);

        if(cookie.name === 'bookmarklyLogin') {
            dump(cookie.host + ";" + cookie.name + "=" + cookie.value + "\n");
            var cookieValue = JSON.parse(unescape(cookie.value));
            // console.log(JSON.stringify(cookieValue));
            // console.log('Screen name: ' + cookieValue['screenName']);
            console.log('Token: ' + cookieValue.token);
            cookieFound = true;
            token = cookieValue.token;
        }
    }

    if(cookieFound) {

        console.log('Will now bookmark ' + tabs.activeTab.url + '  -  ' + tabs.activeTab.title);

        var payload = {
            model: {
                title: tabs.activeTab.title,
                address: tabs.activeTab.url,
                rating: 1,
                starred: 0
            },
            groupNames: [],
            tagNames: []
        };

        var options = {
            url: baseUrl + '/bookmarks?token=' + token,
            contentType: 'application/json',
            content: JSON.stringify(payload),

            onComplete: function(response) {
                console.log('Page bookmarked');
            }
        };

        Request(options).post();
    }
    else {
        noTokenPanel.show({
            position: button
        });
    }

});
