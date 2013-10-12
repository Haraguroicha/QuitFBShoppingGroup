// ref: http://brianmayer.com/2012/12/defeating-chromes-content-security-policy-header-via-a-chrome-extension/
chrome.webRequest.onHeadersReceived.addListener(function (details) {
	for (i = 0; i < details.responseHeaders.length; i++) {
		var h = details.responseHeaders[i].name.toLowerCase();
		if (h == "x-webkit-csp" || h == "content-security-policy") {
			details.responseHeaders[i].value = "default-src *;script-src chrome-extension://* *.tonyq.org *.facebook.com *.fbcdn.net *.facebook.net *.google-analytics.com *.virtualearth.net *.google.com 127.0.0.1:* *.spotilocal.com:* chrome-extension://lifbcibllhkdhoafpjfnlhfpfgnpldfl 'unsafe-inline' 'unsafe-eval' https://*.akamaihd.net http://*.akamaihd.net;style-src * 'unsafe-inline';connect-src *.facebook.com *.fbcdn.net *.facebook.net *.spotilocal.com:* *.akamaihd.net ws://*.facebook.com:*";
		}
	}
	return { responseHeaders : details.responseHeaders };
}, {
	urls : ["*://*.facebook.com/*"],
	types : ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
}, ["blocking", "responseHeaders"]);
//
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
	if(tab.url.toLowerCase().indexOf('facebook.com') != -1)
		chrome.pageAction.show(tabId);
	else
		chrome.pageAction.hide(tabId);
});
chrome.pageAction.onClicked.addListener(function(tab) {
	_tabid = tab.id;
	if(tab.url.toLowerCase().indexOf('/bookmarks/groups') == -1 && confirm(chrome.extension.getBackgroundPage().getLocaleString('leaveConfirm'))) {
		chrome.tabs.executeScript(_tabid, { code: "window.open('https://www.facebook.com/bookmarks/groups', 'fbGExtFanPage');" });
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
					if(msg.message == "fbGExtEvent_lvl") {
						alert(message.join('\n'));
						message = [];
					}
					if(msg.message == "fbGExtEvent_gp") {
						if(confirm(chrome.extension.getBackgroundPage().getLocaleString('noGroupsAndGotoFanPageConfirm')))
							port.postMessage({ goPage: 'http://fbspam.hhmr.biz' });
					}
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
var jsonData = 'http://antispam.tonyq.org/groups/json';
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