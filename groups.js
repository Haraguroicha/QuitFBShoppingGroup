// ref: http://brianmayer.com/2012/12/defeating-chromes-content-security-policy-header-via-a-chrome-extension/
chrome.webRequest.onHeadersReceived.addListener(function (details) {
	for (i = 0; i < details.responseHeaders.length; i++) {
		if (details.responseHeaders[i].name.toLowerCase() == "x-webkit-csp") {
			details.responseHeaders[i].value = "default-src *;script-src chrome-extension://* http://spamgroup.tonyq.org https://spamgroup.tonyq.org https://*.facebook.com http://*.facebook.com https://*.fbcdn.net http://*.fbcdn.net *.facebook.net *.google-analytics.com *.virtualearth.net *.google.com 127.0.0.1:* *.spotilocal.com:* chrome-extension://lifbcibllhkdhoafpjfnlhfpfgnpldfl 'unsafe-inline' 'unsafe-eval' https://*.akamaihd.net http://*.akamaihd.net;style-src * 'unsafe-inline';connect-src https://*.facebook.com http://*.facebook.com https://*.fbcdn.net http://*.fbcdn.net *.facebook.net *.spotilocal.com:* https://*.akamaihd.net ws://*.facebook.com:* http://*.akamaihd.net";
		}
	}
	return { responseHeaders : details.responseHeaders };
}, {
	urls : ["*://*.facebook.com/*"],
	types : ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
}, ["blocking", "responseHeaders"]);
//
chrome.browserAction.onClicked.addListener(function(tab) {
	_tabid = tab.id;
	if(tab.url.toLowerCase().indexOf('/bookmarks/groups') == -1) {
		chrome.tabs.executeScript(_tabid, { code: "location.href='https://www.facebook.com/bookmarks/groups';" });
		_clicked = true;
	} else {
		chrome.tabs.executeScript(tab.id, { code: "_lc();" });
	}
});
chrome.extension.onConnect.addListener(
	function(port) {
		if(port.name == "fbG") {
			port.onMessage.addListener(
				function(msg) {
					if (msg.message == "fbGExtEvent_ck" && _tabid != undefined) {
						chrome.tabs.executeScript(_tabid, { code: "_lc();" });
						_clicked = false;
					}
					if (msg.message == "fbGExtEvent_gd")
						loadData(port);
					if(msg.message == "fbGExtEvent_jqp")
						port.postMessage({ path: jqp, qg_data: qg, msg_data: message, clicked: _clicked });
					if(msg.message == "fbGExtEvent_qg")
						qg = msg.data;
					if(msg.message == "fbGExtEvent_lv")
						message.push(msg.messages);
					if(msg.message == "fbGExtEvent_lvl")
						message = [];
				}
			);
		}
	}
);
var _tabid;
var _clicked = false;
var message = [];
var qg = [];
var jqp = 'chrome-extension://' + location.host + '/jquery-1.8.0.min.js';
var jsonData = 'http://spamgroup.tonyq.org/groups/json';
var gd = {};
function loadData(port) {
	$.get(jsonData).complete(function(data) {
		var j = JSON.parse(data.responseText);
		gd = {};
		$(j).each(function() {
			var obj = this;
			gd[obj.GID] = obj;
		});
		port.postMessage({ ans: gd });
	});
}