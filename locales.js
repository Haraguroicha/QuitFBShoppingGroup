function setLocaleString(page) {
	//chrome.i18n.getMessage("");
	var objLocalization=pageObject();
	for(var k in objLocalization) {
		var o=objLocalization[k];
		try {
			o.innerHTML=getLocaleString(o.id);
			if (o.value) {
				if (o.value.indexOf("__MSG_")!=-1) {
					o.value=getLocaleString(o.id);
				}
			}
		} catch(e) {
			o.value=getLocaleString(o.id);
		}
	}
	return 0;
}
function getLocaleString(msg) {
	if(msg == undefined)
		return;
	var i18n = chrome.i18n.getMessage(msg);
	for(var i = 1; i < arguments.length; i++) {
		var arg = arguments[i];
		i18n = i18n.replace("%s", unescape(arg));
	}
	return i18n;
}
function pageObject() {
	return document.getElementsByClassName("locale");
}
function loadLocaleString() {
	return setLocaleString(location.href.replace("chrome-extension://", "").split(".")[0]);
}