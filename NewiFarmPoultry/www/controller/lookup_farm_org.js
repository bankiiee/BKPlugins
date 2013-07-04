var dataSource = null;
$('#lookup_farm_org').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('lookup_farm_org');
    
});

$('#lookup_farm_org').bind('pageinit', function (e) {
    $('#lookup_farm_org a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('lookup_farm_org', 'Previous'), null, { transition: 'slide', action: 'reverse' });
    });

    $('#lookup_farm_org #lstView').listview('option', 'filterCallback',
        function (text, searchString) {
            var lText = text.toLowerCase();
            if (lText.indexOf('*') !== -1) { return false };
            if (lText.indexOf(searchString) !== -1) { return false };
            return true;
        }
    );
	$('#lookup_farm_org #lstView').bind('listviewbeforefilter',
        function (e, data) {
            var $input = $(data.input);
            var filterText = $input.val();
            populateListView(dSource, filterText, false);
    });
	$('#lookup_farm_org #div-showall').click(function (e) {
        var $input = $('#lookup_farm_org input[data-type="search"]');
        var filterText = $input.val();
        populateListView(dSource, filterText, true);
    });
});
var dSource = null;
$('#lookup_farm_org').bind('pagebeforeshow', function (e) {
    console.log($.Ctx.PageParam);
    $('#lookup_farm_org #lstView').empty();
    // s is where statement
//    var s = $.Ctx.GetPageParam('lookup_farm_org', 'selectStatement')
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
    dSource = $.Ctx.GetPageParam('lookup_farm_org', 'dataSource');
    populateListView(dSource, null, false);
        $('#lookup_farm_org #lstView').trigger('create');
        $('#lookup_farm_org #lstView').listview('refresh');
   

});

function populateListView(p, filterText, isShowAll) {
	var s = ' <li data-icon="false" data-filtertext="*">';
	s += '        <div class="ui-grid-b">';
	s += '            <div class="ui-block-a">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_farm_org', 'colFarmOrg', 'Farm Org')]);
	s += '            </div>';
	s += '            <div class="ui-block-b">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_farm_org', 'colDescription', 'Description')]);
	s += '            </div>';
	s += '        </div>';
	s += '   </li>';
	$('#lookup_farm_org #lstView').append(s);

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
		s += '<div class="ui-grid-b">';
		s += '<div class="ui-block-a"> <center>{0}</center></div>'.format([m.CODE]);
		s += '<div class="ui-block-b"><center>{0}</center></div>'.format([desc]);
		s += '</div>';
		s += '</a></li>';
		if (!IsNullOrEmpty(filterText)) {
			if (txt1.contains(filterText) || txt2.contains(filterText)) {
				filterCount += 1;
				if (showCount <= maxShowCount) {
					$('#lookup_farm_org #lstView').append(s);
					showCount += 1;
				}
			}
		} else {
			filterCount += 1;
			if (showCount <= maxShowCount) {
				$('#lookup_farm_org #lstView').append(s);
				showCount += 1;
			}
		}
	}
	$('#lookup_farm_org #lstView').listview('refresh');

	$('#lookup_farm_org a[data-tag="lst_item"]').click(function (e) {
		var ind = $(this).attr('data-id');
		var param = new LookupParam();
		param = $.Ctx.GetPageParam('lookup_farm_org', 'param');
		$.Ctx.SetPageParam(param.calledPage, param.calledResult, dSource[ind]);
		$.Ctx.NavigatePage(param.calledPage, null, { transition: 'slide' });
	});
	if (!IsNullOrEmpty(filterText)) 
		$('#lookup_farm_org #captionHeader').html($.Ctx.Lcl('lookup_farm_org', 'headerFarmOrg', '({0}/{1})Farm Org').format([filterCount, p.length]));
	else 
		$('#lookup_farm_org #captionHeader').html($.Ctx.Lcl('lookup_farm_org', 'headerFarmOrg', '({0})Farm Org').format([p.length]));
	
	if (filterCount==showCount)
		$('#lookup_farm_org #div-showall').hide();
	else 
		$('#lookup_farm_org #div-showall').show();
}



