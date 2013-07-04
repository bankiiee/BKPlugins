$('#lookup_reason').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('lookup_reason');
});

$('#lookup_reason').bind('pageinit', function (e) {
    $('#lookup_reason a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('lookup_reason', 'Previous'), null, { transition: 'slide', action: 'reverse' });
    });

    $('#lookup_reason #lstView').listview('option', 'filterCallback',
        function (text, searchString) {
            var lText = text.toLowerCase();
            if (lText.indexOf('*') !== -1) { return false };
            if (lText.indexOf(searchString) !== -1) { return false };
            return true;
    });
    $('#lookup_reason #lstView').bind('listviewbeforefilter',
        function (e, data) {
            var $input = $(data.input);
            var filterText = $input.val();
            populateListView(dSource, filterText, false);
    });
    
	$('#lookup_reason #div-showall').click(function (e) {
        var $input = $('#lookup_reason input[data-type="search"]');
        var filterText = $input.val();
        populateListView(dSource, filterText, true);
    });
});

var dSource=null;

$('#lookup_reason').bind('pagebeforeshow', function (e) {
   // console.log($.Ctx.PageParam);
    
    // s is where statement
    var s = $.Ctx.GetPageParam('lookup_reason', 'statement')
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var str = "SELECT * FROM HH_GD2_FR_MAS_TYPE_FARM {0}".format([s]);
    cmd.sqlText = str;
    cmd.executeReader(function (tx, res) {
		dSource = new Array();
        if (res.rows.length != 0) { 
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_GD2_FR_MAS_TYPE_FARM();
                m.retrieveRdr(res.rows.item(i));
                dSource.push(m);
            }
        }
		populateListView(dSource, null, false);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
});

function populateListView(p, filterText, isShowAll) {
	$('#lookup_reason #lstView').empty();
	var s = ' <li data-icon="false" data-filtertext="*">';
	s += '        <div class="ui-grid-b">';
	s += '            <div class="ui-block-a">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_reason', 'colReason', 'Reason')]);
	s += '            </div>';
	s += '            <div class="ui-block-b">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_reason', 'colDescription', 'Description')]);
	s += '            </div>';
	s += '        </div>';
	s += '   </li>';
	$('#lookup_reason #lstView').append(s);
	
	var showCount = filterCount = 0;
	var maxShowCount = isShowAll==true?p.length:$.Ctx.CustomPageSize;
	
	for (var i = 0; i < p.length; i++) {
		var m = p[i];
		var desc = m.DESC_ENG==null?m.DESC_LOC:m.DESC_ENG;
		if ($.Ctx.Lang != 'en-US') {
			desc = m.DESC_LOC==null?m.DESC_ENG:m.DESC_LOC;
		}
		var txt1 = $.Ctx.Nvl(m.GD_CODE, "");
        var txt2 = $.Ctx.Nvl(desc, "");
		var s = '<li data-icon="false"><a id="{0}" data-tag="lst_item" {1}  >'.format(['lki-' + i, "data-id='" + i + "'"]);
		s += '<div class="ui-grid-b">';
		s += '<div class="ui-block-a"> <center>{0}</center></div>'.format([m.GD_CODE]);
		s += '<div class="ui-block-b"><center>{0}</center></div>'.format([desc]);
		s += '</div>';
		s += '</a></li>';
		if (!IsNullOrEmpty(filterText)) {
			if (txt1.contains(filterText) || txt2.contains(filterText)) {
				filterCount += 1;
				if (showCount <= maxShowCount) {
					$('#lookup_reason #lstView').append(s);
					showCount += 1;
				}
			}
		} else {
			filterCount += 1;
			if (showCount <= maxShowCount) {
				$('#lookup_reason #lstView').append(s);
				showCount += 1;
			}
		}
	}//end for 

	$('#lookup_reason #lstView').listview('refresh');
	$('#lookup_reason a[data-tag="lst_item"]').click(function (e) {
		var ind = $(this).attr('data-id');
		var param = new LookupParam();
		param = $.Ctx.GetPageParam('lookup_reason', 'param');
		$.Ctx.SetPageParam(param.calledPage, param.calledResult, dSource[ind]);
		$.Ctx.NavigatePage(param.calledPage, null, { transition: 'slide' });
	});
	
	if (!IsNullOrEmpty(filterText)) 
		$('#lookup_reason #captionHeader').html($.Ctx.Lcl('lookup_reason', 'headerReasonInfoFilter', '({0}/{1})Reason Information').format([filterCount, p.length]));
	 else 
		$('#lookup_reason #captionHeader').html($.Ctx.Lcl('lookup_reason', 'headerReasonInfo', '({0})Reason Information').format([p.length]));
	
	if (filterCount==showCount)
		$('#lookup_reason #div-showall').hide();
	else 
		$('#lookup_reason #div-showall').show();
}


