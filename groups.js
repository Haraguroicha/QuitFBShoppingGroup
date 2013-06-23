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
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
	if(tab.url.toLowerCase().indexOf('facebook.com') != -1)
		chrome.pageAction.show(tabId);
	else
		chrome.pageAction.hide(tabId);
});
chrome.pageAction.onClicked.addListener(function(tab) {
	_tabid = tab.id;
	if(tab.url.toLowerCase().indexOf('/bookmarks/groups') == -1 && confirm(unescape('%u9019%u500B%u52D5%u4F5C%u5373%u5C07%u8981%u96E2%u958B%u60A8%u6240%u700F%u89BD%u7684%u9801%u9762%uFF0C%u8981%u7E7C%u7E8C%u55CE%uFF1F'))) {
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
					if(msg.message == "fbGExtEvent_lvl") {
						alert(message.join('\n'));
						message = [];
					}
					if(msg.message == "fbGExtEvent_gp") {
						if(confirm(unescape('%u606D%u559C%uFF01%u60A8%u76EE%u524D%u6C92%u6709%u5DF2%u77E5%u7684%u7169%u4EBA%u793E%u5718%uFF01%u8ACB%u8A18%u5F97%u5E38%u53BB%u7C89%u7D72%u5718%u5C08%u9801%u53D6%u5F97%u6700%u65B0%u8CC7%u8A0A%u5594%uFF5E%0A%0A%u6309%u4E0B%u78BA%u5B9A%u5F8C%u9032%u5165%u7C89%u7D72%u5718%u3002')))
							port.postMessage({ goPage: 'https://www.facebook.com/IWantQuitGroups' });
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