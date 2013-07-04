$('#lookup_husbandry').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('lookup_husbandry');
});

$('#lookup_husbandry').bind('pageinit', function (e) {
    $('#lookup_husbandry a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('lookup_husbandry', 'Previous'), null, { transition: 'slide', reverse: true });
    });
    $('#lookup_husbandry #lstView').listview('option', 'filterCallback',
        function (text, searchString) {
            var lText = text.toLowerCase();
            if (lText.indexOf('*') !== -1) { return false };
            if (lText.indexOf(searchString) !== -1) { return false };
            return true;
        }
    );
	$('#lookup_husbandry #btnClear').click(function (e) {
		var param = $.Ctx.GetPageParam('lookup_husbandry', 'param');
		$.Ctx.SetPageParam(param.calledPage, param.calledResult, null); 
        $.Ctx.NavigatePage($.Ctx.GetPageParam('lookup_husbandry', 'Previous'), null, { transition: 'slide', reverse: true });
    });
	
	$('#lookup_husbandry #lstView').bind('listviewbeforefilter',
        function (e, data) {
            var $input = $(data.input);
            var filterText = $input.val();
            populateListView(dSource, filterText, false);
        }
    );

    $('#lookup_husbandry #div-showall').click(function (e) {
        var $input = $('#lookup_husbandry input[data-type="search"]');
        var filterText = $input.val();
        populateListView(dSource, filterText, true);
    });
});

var dSource=null;
$('#lookup_husbandry').bind('pagebeforeshow', function (e) {
    $.FarmCtx.HusbandryAvailableList(
        function (res) {
           dSource = res;
		   if (dSource==null){dSource=[];}
           populateListView(dSource, null, false);
        },
        function (message) {
           $.Ctx.MsgBox(message)
    });
});

function populateListView(p, filterText, isShowAll) {
	$('#lookup_husbandry #lstView').empty();
	
	var s = ' <li data-icon="false" data-filtertext="*">';
	s += '        <div class="ui-grid-a">';
	s += '            <div class="ui-block-a" style="text-align:center">';
	s += '                <div style="color:blue">{0}</div>'.format([$.Ctx.Lcl('lookup_husbandry', 'colHusbCode', 'Code')]);
	s += '            </div>';
	s += '            <div class="ui-block-b" style="text-align:center">';
        s += '                <div style="color:blue">{0}</div>'.format([$.Ctx.Lcl('lookup_husbandry', 'colHusbName', 'Husbandry')]);
	s += '            </div>';
	s += '        </div>';
	s += '    </li>';
	$('#lookup_husbandry #lstView').append(s);

	var showCount = filterCount = 0;
	var maxShowCount = isShowAll==true?p.length:$.Ctx.CustomPageSize;
	for (var i=0; i < p.length; i++) {
		var txt1 = $.Ctx.Nvl(p[i].HUSBANDRY, "");
        var txt2 = $.Ctx.Nvl(p[i].HUSBANDRY_NAME, "");
		var s = '<li data-icon="false"><a id="{0}" data-tag="lst_item" {1}>'.format(['lki-' + i, "data-id='" + i + "'"]);
		s += '<div class="ui-grid-a">';
		s += '<div class="ui-block-a" style="text-align:center">{0}</div>'.format([p[i].HUSBANDRY]);
		s += '<div class="ui-block-b" style="text-align:center">{0}</div>'.format([p[i].HUSBANDRY_NAME]);
		s += '</div>';
		s += '</a></li>';
		if (!IsNullOrEmpty(filterText)) {
			if (txt1.contains(filterText) || txt2.contains(filterText)) {
				filterCount += 1;
				if (showCount <= maxShowCount) {
					$('#lookup_husbandry #lstView').append(s);
					showCount += 1;
				}
			}
		}else{
			filterCount += 1;
			if (showCount <= maxShowCount) {
				$('#lookup_husbandry #lstView').append(s);
				showCount += 1;
			}
		}
	}
	$('#lookup_husbandry #lstView').listview('refresh');

	$('#lookup_husbandry a[data-tag="lst_item"]').click(function (e) {
		var ind = $(this).attr('data-id');
		var param = $.Ctx.GetPageParam('lookup_husbandry', 'param');
		$.Ctx.SetPageParam(param.calledPage, param.calledResult, dSource[ind]); 
		$.Ctx.NavigatePage(param.calledPage, null, { transition: 'slide' });
	});
	
	if (!IsNullOrEmpty(filterText)) 
		$('#lookup_husbandry #captionHeader').html($.Ctx.Lcl('lookup_husbandry', 'headerHusbInfoFilter', '({0}/{1})Husbandry Information').format([filterCount, p.length]));
	 else 
		$('#lookup_husbandry #captionHeader').html($.Ctx.Lcl('lookup_husbandry', 'headerHusbInfo', '({0})Husbandry Information').format([p.length]));
	
	if (filterCount == showCount)
		$('#lookup_husbandry #div-showall').hide();
	else 
		$('#lookup_husbandry #div-showall').show();
}

