$('#lookup_boar').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('lookup_boar');
});

$('#lookup_boar').bind('pageinit', function (e) {
    $('#lookup_boar a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('lookup_boar', 'Previous'), null, { transition:'slide', reverse:'true' });
    });

    $('#lookup_boar #lstView').listview('option', 'filterCallback',
        function (text, searchString) {
            var lText = text.toLowerCase();
            if(lText.indexOf('*') !== -1) {return false};
            if (lText.indexOf(searchString) !== -1){return false} ;
            return true;
    });
	
    $('#lookup_boar #lstView').bind('listviewbeforefilter',
        function (e, data) {
            var $input = $(data.input);
            var filterText = $input.val();
            populateListView(dSource, filterText, false);
    });
    
	$('#lookup_boar #div-showall').click(function (e) {
        var $input = $('#lookup_boar input[data-type="search"]');
        var filterText = $input.val();
        populateListView(dSource, filterText, true);
    });
});

var dSource=null;

$('#lookup_boar').bind('pagebeforeshow', function (e) {
    var sow = new HH_FR_MS_SWINE_ACTIVITY();
    sow =  $.Ctx.GetPageParam('lookup_boar','sowId');
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var s = "SELECT * " ;
    s += "FROM FR_MAS_SWINE_INFORMATION " ;
    s += " WHERE SEX ='M'  " ;
    s += " AND ORG_CODE='{0}'".format([$.Ctx.SubOp]) ;
    s += " AND ACTIVITY_TYPE NOT IN (  'TOU','CH','C','D','DS')  " ;
    s += " AND BREEDER IN (  " ;
    s += " SELECT FATHER FROM GD3_FR_SWINE_GENETIC_BREEDER " ;
    s += " WHERE ORG_CODE= '{0}'  AND  MOTHER= ( ".format([$.Ctx.SubOp]) ;
    s += " SELECT BREEDER  " ;
    s += " FROM FR_MAS_SWINE_INFORMATION  " ;
    s += " WHERE SWINE_ID= '{0}'".format([sow.SWINE_ID]) ;
    s += " AND SWINE_TRACK='{0}'".format([sow.SWINE_TRACK]) ;
    s += " AND SWINE_DATE_IN='{0}'".format([sow.SWINE_DATE_IN]) ;
    s += " AND ORG_CODE='{0}'".format([$.Ctx.SubOp]) ;
    s += " AND FARM_ORG='{0}'".format([$.Ctx.Warehouse]) ;
    s += ") " ;
    s += " ) ";
    cmd.sqlText = s;
    cmd.executeReader(function (tx, res) {
		dSource=[];
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new FR_MAS_SWINE_INFORMATION();
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
	$('#lookup_boar #lstView').empty();
	var s = ' <li data-icon="false" data-filtertext="*">';
	s += '        <div class="ui-grid-b">';
	s += '            <div class="ui-block-a">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_boar', 'colSwineTrack', 'Swine Track')]);
	s += '            </div>';
	s += '            <div class="ui-block-b">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_boar', 'colActivity', 'Activity')]);
	s += '            </div>';
	s += '        </div>';
	s += '    </li>';
	$('#lookup_boar #lstView').append(s);
	
	var showCount = filterCount = 0;
	var maxShowCount = isShowAll==true?p.length:$.Ctx.CustomPageSize;

	for (var i = 0; i < p.length; i++) {
		var m = p[i];
		var txt1 = $.Ctx.Nvl(m.SWINE_TRACK, "");
        var txt2 = $.Ctx.Nvl(m.ACTIVITY_TYPE, "");
		var s = '<li data-icon="false"><a id="{0}" data-tag="lst_item" {1}  >'.format(['lki-' + i, "data-id='" + i + "'"]);
		s += '<div class="ui-grid-b">';
		s += '<div class="ui-block-a"> <center>{0}</center></div>'.format([m.SWINE_TRACK]);
		s += '<div class="ui-block-b"><center>{0}</center></div>'.format([m.ACTIVITY_TYPE]);
		s += '</div>';
		s += '</a></li>';
		
		if (!IsNullOrEmpty(filterText)) {
			if (txt1.contains(filterText) || txt2.contains(filterText)) {
				filterCount += 1;
				if (showCount <= maxShowCount) {
					$('#lookup_boar #lstView').append(s);
					showCount += 1;
				}
			}
		} else {
			filterCount += 1;
			if (showCount <= maxShowCount) {
				$('#lookup_boar #lstView').append(s);
				showCount += 1;
			}
		}
	}// end for
	$('#lookup_boar #lstView').listview('refresh');
	$('#lookup_boar a[data-tag="lst_item"]').click(function (e) {
		var ind = $(this).attr('data-id');
		var param = new LookupParam();
		param = $.Ctx.GetPageParam('lookup_boar', 'param');
		$.Ctx.SetPageParam(param.calledPage, param.calledResult, dSource[ind]);
		$.Ctx.NavigatePage(param.calledPage, null, { transition: 'slide', reverse: 'false' });
	});
	
	if (!IsNullOrEmpty(filterText)) 
		$('#lookup_boar #captionHeader').html($.Ctx.Lcl('lookup_boar', 'headerAbtTypeFilter', '({0}/{1})Abortion Type').format([filterCount, p.length]));
	else 
		$('#lookup_boar #captionHeader').html($.Ctx.Lcl('lookup_boar', 'headerAbtType', '({0})Abortion Type').format([p.length]));
	
	if (filterCount==showCount)
		$('#lookup_boar #div-showall').hide();
	else 
		$('#lookup_boar #div-showall').show();
}


