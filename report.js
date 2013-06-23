var _rg = '';
if(location.hash.length > 0)
	_rg = location.hash.substr(1).replace(/_rg=/g, '');
if(_rg.length > 0) {
	document.body.scrollTop = $('#group').val(_rg).parents('div.well')[0].offsetTop - 10;
}