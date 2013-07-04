$('#lookup_abttype').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('lookup_abttype');
});

$('#lookup_abttype').bind('pageinit', function (e) {
    $('#lookup_abttype a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('lookup_abttype', 'Previous'), null, { transition:'slide', reverse:'true' });
    });

    $('#lookup_abttype #lstView').listview('option', 'filterCallback',
        function (text, searchString) {
            var lText = text.toLowerCase();
            if (lText.indexOf('*') !== -1) {
                return false
            }
            ;
            if (lText.indexOf(searchString) !== -1) {
                return false
            }
            ;
            return true;
    });
    $('#lookup_abttype #lstView').bind('listviewbeforefilter',
        function (e, data) {
            var $input = $(data.input);
            var filterText = $input.val();
            populateListView(dSource, filterText, false);
    });
	$('#lookup_abttype #div-showall').click(function (e) {
        var $input = $('#lookup_boar input[data-type="search"]');
        var filterText = $input.val();
        populateListView(dSource, filterText, true);
    });
});

var dSource = null;
$('#lookup_abttype').bind('pagebeforeshow', function (e) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT * FROM HH_GD2_FR_MAS_TYPE_FARM WHERE GD_TYPE = 'ABT' ORDER BY GD_CODE";
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
	$('#lookup_abttype #lstView').empty();
	var s = ' <li data-icon="false" data-filtertext="*">';
	s += '        <div class="ui-grid-b">';
	s += '            <div class="ui-block-a">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_abttype', 'colReason', 'Reason')]);
	s += '            </div>';
	s += '            <div class="ui-block-b">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_abttype', 'colDescription', 'Description')]);
	s += '            </div>';
	s += '        </div>';
	s += '    </li>';
	$('#lookup_abttype #lstView').append(s);
	
	var showCount = filterCount = 0;
	var maxShowCount = isShowAll==true?p.length:$.Ctx.CustomPageSize;
	
	for (var i = 0; i < p.length; i++) {
		var m = p[i];
		var desc = m.DESC_ENG;
		if ($.Ctx.Lang != 'en-US') {
			desc = m.DESC_LOC;
		}
		var txt1 = $.Ctx.Nvl(m.GD_CODE, "");
        var txt2 = $.Ctx.Nvl(desc, "");
		var s = '<li data-icon="false"><a id="{0}" data-tag="lst_item" {1}>'.format(['lki-' + i, "data-id='" + i + "'"]);
		s += '<div class="ui-grid-b">';
		s += '<div class="ui-block-a"> <center>{0}</center></div>'.format([m.GD_CODE]);
		s += '<div class="ui-block-b"><center>{0}</center></div>'.format([desc]);
		s += '</div>';
		s += '</a></li>';
		
		if (!IsNullOrEmpty(filterText)) {
			if (txt1.contains(filterText) || txt2.contains(filterText)) {
				filterCount += 1;
				if (showCount <= maxShowCount) {
					$('#lookup_abttype #lstView').append(s);
					showCount += 1;
				}
			}
		} else {
			filterCount += 1;
			if (showCount <= maxShowCount) {
				$('#lookup_abttype #lstView').append(s);
				showCount += 1;
			}
		}
	}//end for
	$('#lookup_abttype #lstView').listview('refresh');

	$('#lookup_abttype a[data-tag="lst_item"]').click(function (e) {
		var ind = $(this).attr('data-id');
		var param = new LookupParam();
		param = $.Ctx.GetPageParam('lookup_abttype', 'param');
		$.Ctx.SetPageParam(param.calledPage, param.calledResult, dSource[ind]);
        if(dSource[ind].GD_CODE != "1"){
            findReason(param,dSource[ind]);
        }else{
            $.Ctx.SetPageParam('abortion_detail', 'reasonInput',null);
            $.Ctx.NavigatePage(param.calledPage, null, { transition:'slide' });
        }


	});
	
	if (!IsNullOrEmpty(filterText)) 
		$('#lookup_abttype #captionHeader').html($.Ctx.Lcl('lookup_abttype', 'headerBoarInfoFilter', '({0}/{1})Abortion Type').format([filterCount, p.length]));
	 else 
		$('#lookup_abttype #captionHeader').html($.Ctx.Lcl('lookup_abttype', 'headerBoarInfo', '({0})Abortion Type').format([p.length]));
	
	if (filterCount == showCount)
		$('#lookup_abttype #div-showall').hide();
	else 
		$('#lookup_abttype #div-showall').show();
}

function findReason(param,d){
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT * FROM HH_GD2_FR_MAS_TYPE_FARM WHERE GD_TYPE = 'ABC' AND CONDITION_01 = '{0}'".format([d.GD_CODE]);

    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            var r = new HH_GD2_FR_MAS_TYPE_FARM();
            r.retrieveRdr(res.rows.item(0));
            $.Ctx.SetPageParam('abortion_detail', 'reasonInput',r);
            $.Ctx.NavigatePage(param.calledPage, null, { transition:'slide' });
        }
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
}
