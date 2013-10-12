function _or(u) {
	var w = window.open('http://antispam.tonyq.org/report#_rg=' + u, 'fbG_report', 'width=1000,height=700');
}
function _rp() {
	var gt = $(this).parent().find('a[data-gt]');
	var gp = { node: gt.attr('title'), id: JSON.parse(gt.attr('data-gt')).bmid };
	var url = 'https://www.facebook.com/groups/' + gp.id;
	_or(url);
}
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
		port.postMessage({ message: "fbGExtEvent_gp" });
	}
}
function _rb() {
	$('.itemLabel').filter('.fcb').each(function() {
		var gt = $(this).parents('a').css('width', '520px');
		var rp = $('<button />').html('我就是要回報這個社團').on('click', _rp);
		gt.before(rp);
	});
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
	if(typeof(msg.goPage) == "string")
		location.href = msg.goPage;
	if(typeof(msg.qg_data) == "object") {
		qg = msg.qg_data;
		if(qg.length > 0) {
			console.log('has something to do');
			_qg();
		} else {
			console.log('nothing to do');
			if(msg.msg_data.length > 0) {
				port.postMessage({ message: "fbGExtEvent_lvl" });
			}
		}
	}
	if(msg.clicked === true)
		port.postMessage({ message: "fbGExtEvent_ck" });
});
port.postMessage({ message: "fbGExtEvent_jqp" });
_rb();
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
		port.postMessage({ message: "fbGExtEvent_lv", messages: unescape('%u60A8%u5DF2%u7D93%u5F9E%u9019%u500B%u793E%u5718%u96E2%u958B%3A%20') + _currentTitle });
		lg[0].click();
	} else
		setTimeout(_lg, 100);
}