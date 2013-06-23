function _ls() {
	$('.itemLabel').filter('.fcb').each(function() {
		var gt = $(this).parents('a');
		var gp = { node: gt.attr('title'), id: JSON.parse(gt.attr('data-gt')).bmid };
		if(gd[gp.id] != undefined)
			qg.push(gp);
	});
	if(qg.length > 0) {
		port.postMessage({ message: "fbGExtEvent_qg", data: qg });
		_qg();
	} else {
		alert('恭喜！您目前沒有已知的煩人社團！');
	}
}
var qg = [];
var gd;
var port = chrome.extension.connect({ name: "fbG" });
port.onMessage.addListener(function(msg) {
	if (typeof(msg.ans) == "object") {
		gd = msg.ans;
		_ls();
	}
	/*
	if(typeof(msg.path) == "string")
		$('<script/>').attr('src', msg.path).appendTo(document);
	*/
	if(typeof(msg.qg_data) == "object") {
		qg = msg.qg_data;
		if(qg.length > 0) {
			console.log('has something to do');
			_qg();
		} else {
			console.log('nothing to do');
			if(msg.msg_data.length > 0) {
				alert(msg.msg_data.join('\n'));
				port.postMessage({ message: "fbGExtEvent_lvl" });
			}
		}
	}
	if(msg.clicked === true)
		port.postMessage({ message: "fbGExtEvent_ck" });
});
port.postMessage({ message: "fbGExtEvent_jqp" });
function _lc() {
	port.postMessage({ message: "fbGExtEvent_gd" });
}
var _currentTitle = "";
function _qg() {
	var g = qg.pop();
	_currentTitle = g.node;
	port.postMessage({ message: "fbGExtEvent_qg", data: qg });
	var gt = $('a[title="' + g.node + '"][data-gt]');
	if(gt.length > 0) {
		var gq = gt.parent().find('[role="menu"] [href*="leave"]')[0].click();
		setTimeout(_pr, 100);
	}
}
function _pr() {
	var pr = $('[name="prevent_readd"]');
	if(pr.length > 0) {
		pr[0].checked=0;
		setTimeout(_lg, 100);
	} else {
		setTimeout(_pr, 100);
	}
}
function _lg() {
	var lg = $('[name="confirmed"]');
	if(lg.length > 0) {
		port.postMessage({ message: "fbGExtEvent_lv", messages: '您已經從這個社團離開: ' + _currentTitle });
		lg[0].click();
	} else
		setTimeout(_lg, 100);
}