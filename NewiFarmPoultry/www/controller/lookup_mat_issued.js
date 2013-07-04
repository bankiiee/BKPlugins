var dataSource = null;
$('#lookup_mat_issued').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('lookup_mat_issued');
    
});

$('#lookup_mat_issued').bind('pageinit', function (e) {
    $('#lookup_mat_issued a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('lookup_mat_issued', 'param').calledPage, null, { transition: 'slide', action: 'reverse' });
    });

    $('#lookup_mat_issued #lstView').listview('option', 'filterCallback',
        function (text, searchString) {
            var lText = text.toLowerCase();
            if (lText.indexOf('*') !== -1) { return false };
            if (lText.indexOf(searchString) !== -1) { return false };
            return true;
        }
    );
	$('#lookup_mat_issued #lstView').bind('listviewbeforefilter',
        function (e, data) {
            var $input = $(data.input);
            var filterText = $input.val();
            populateListView(dSource, filterText, false);
    });
	$('#lookup_mat_issued #div-showall').click(function (e) {
        var $input = $('#lookup_mat_issued input[data-type="search"]');
        var filterText = $input.val();
        populateListView(dSource, filterText, true);
    });
});
var dSource = null;
$('#lookup_mat_issued').bind('pagebeforeshow', function (e) {
    console.log($.Ctx.PageParam);
    $('#lookup_mat_issued #lstView').empty();
    // s is where statement
//    var s = $.Ctx.GetPageParam('lookup_mat_issued', 'selectStatement')
//    var cmd = $.Ctx.DbConn.createSelectCommand();
////    if(s != null){
////        var str = "SELECT DISTINCT  FARM_ORG , NAME_LOC , NAME_ENG FROM FR_FARM_ORG  WHERE  ORG_CODE = '{0}' AND ".format([$.Ctx.SubOp])+ s;
////    }else{
////        var str = "SELECT DISTINCT  FARM_ORG , NAME_LOC , NAME_ENG FROM FR_FARM_ORG  WHERE  ORG_CODE = '{0}'".format([$.Ctx.SubOp]);
////    }
//    cmd.sqlText = s;
//    cmd.executeReader(function (tx, res) {
//		dSource = new Array();
//        if (res.rows.length != 0) {
//            for (var i = 0; i < res.rows.length; i++) {
//                var m = new FR_FARM_ORG();
//                m.retrieveRdr(res.rows.item(i));
//                dSource.push(m);
//            }
//        }
//		populateListView(dSource, null, false);
//    }, function (err) {
//        $.Ctx.MsgBox(err.message);
    //    });
    dSource = $.Ctx.GetPageParam('lookup_mat_issued', 'dataSource');
    populateListView(dSource, null, false);
        $('#lookup_mat_issued #lstView').trigger('create');
        $('#lookup_mat_issued #lstView').listview('refresh');
   

});

function populateListView(p, filterText, isShowAll) {
	var s = ' <li data-icon="false" data-filtertext="*">';
	s += '        <div class="ui-grid-c">';
	s += '            <div class="ui-block-a">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_mat_issued', 'colDocNo', 'Document Number')]);
	s += '            </div>';
	s += '            <div class="ui-block-b">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_mat_issued', 'colDocExt', 'Ext.')]);
	s += '            </div>';
	s += '            <div class="ui-block-c">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_mat_issued', 'colFarmOrg', 'Farm Org')]);
	s += '            </div>';
	s += '            <div class="ui-block-d">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_mat_issued', 'colFarmmerName', 'Farmmer Name')]);
	s += '            </div>';
	s += '        </div>';
	s += '   </li>';
	$('#lookup_mat_issued #lstView').append(s);

	var showCount = filterCount = 0;
	var maxShowCount = isShowAll==true?p.length:$.Ctx.CustomPageSize;
	
	for (var i = 0; i < p.length; i++) {
		var m = p[i];
		var desc = m.NAME;
		if ($.Ctx.Lang != 'en-US') {
			desc = m.NAME;
		}
		var txt1 = $.Ctx.Nvl(m.FARM_ORG, "");
        var txt2 = $.Ctx.Nvl(desc, "");
		var s = '<li data-icon="false"><a id="{0}" data-tag="lst_item" {1}>'.format(['lki-' + i, "data-id='" + i + "'"]);
		s += '<div class="ui-grid-c">';
		s += '<div class="ui-block-a"> <center>{0}</center></div>'.format([m.DOCUMENT_NO]);
		s += '<div class="ui-block-b"> <center>{0}</center></div>'.format([m.PO_DOCUMENT_EXT]);
		s += '<div class="ui-block-c"><center>{0}</center></div>'.format([m.FARM_ORG]);
		s += '<div class="ui-block-d"><center>{0}</center></div>'.format([($.Ctx.Lang != 'en-US'?m.NAME_LOC : m.NAME_ENG)]);
		s += '</div>';
		s += '</a></li>';
		if (!IsNullOrEmpty(filterText)) {
			if (txt1.contains(filterText) || txt2.contains(filterText)) {
				filterCount += 1;
				if (showCount <= maxShowCount) {
					$('#lookup_mat_issued #lstView').append(s);
					showCount += 1;
				}
			}
		} else {
			filterCount += 1;
			if (showCount <= maxShowCount) {
				$('#lookup_mat_issued #lstView').append(s);
				showCount += 1;
			}
		}
	}
	$('#lookup_mat_issued #lstView').listview('refresh');

	$('#lookup_mat_issued a[data-tag="lst_item"]').click(function (e) {
		var ind = $(this).attr('data-id');
		var param = new LookupParam();
		param = $.Ctx.GetPageParam('lookup_mat_issued', 'param');
		$.Ctx.SetPageParam(param.calledPage, param.calledResult, dSource[ind]);
		$.Ctx.NavigatePage(param.calledPage, null, { transition: 'slide' });
	});
	if (!IsNullOrEmpty(filterText)) 
		$('#lookup_mat_issued #captionHeader').html($.Ctx.Lcl('lookup_mat_issued', 'headerRefDoc', '({0}/{1})Ref. Document No.').format([filterCount, p.length]));
	else 
		$('#lookup_mat_issued #captionHeader').html($.Ctx.Lcl('lookup_mat_issued', 'headerRefDoc', '({0})Ref. Document No.').format([p.length]));
	
	if (filterCount==showCount)
		$('#lookup_mat_issued #div-showall').hide();
	else 
		$('#lookup_mat_issued #div-showall').show();
}



