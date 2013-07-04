$('#lookup_breeder_sex').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('lookup_breeder_sex');
});

$('#lookup_breeder_sex').bind('pageinit', function (e) {
    $('#lookup_breeder_sex a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('lookup_breeder_sex', 'Previous'), null, { transition:'slide', reverse:'true' });
    });

    $('#lookup_breeder_sex #lstView').listview('option', 'filterCallback',
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
    $('#lookup_breeder_sex #lstView').bind('listviewbeforefilter',
        function (e, data) {
            var $input = $(data.input);
            var filterText = $input.val();
            populateListView(dSource, filterText, false);
    });
	$('#lookup_breeder_sex #div-showall').click(function (e) {
        var $input = $('#lookup_breeder_sex input[data-type="search"]');
        var filterText = $input.val();
        populateListView(dSource, filterText, true);
    });
});

var dSource = null;
$('#lookup_breeder_sex').bind('pagebeforeshow', function (e) {
    var lstk = $.Ctx.GetPageParam('lookup_breeder_sex','livestock');
    var cmd = $.Ctx.DbConn.createSelectCommand();

    var desc = "B.DESC_LOC";
    if($.Ctx.Lang == "en-US"){
        desc = "B.DESC_ENG";
    }

    cmd.sqlText = "SELECT DISTINCT A.BREEDER_SEX , (SELECT "+desc+" FROM  GD3_FR_BREEDER B  WHERE  A.LIVESTOCK_CODE = '{0}' AND B.ORG_CODE = '{1}' AND A.BREEDER_SEX = B.BREEDER) AS NAME FROM HH_FR_STD_FEED A ".format([lstk , $.Ctx.SubOp]);
    cmd.executeReader(function (tx, res) {
		dSource = new Array();
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_FR_STD_FEED();
                m.retrieveRdr(res.rows.item(i));
                m.NAME = res.rows.item(i).NAME;
                dSource.push(m);
            }
        }
		populateListView(dSource, null, false);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
});

function populateListView(p, filterText, isShowAll) {
	$('#lookup_breeder_sex #lstView').empty();
	var s = ' <li data-icon="false" data-filtertext="*">';
	s += '        <div class="ui-grid-b">';
	s += '            <div class="ui-block-a">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_breeder_sex', 'colBreederSex', 'Breeder/Sex')]);
	s += '            </div>';
	s += '            <div class="ui-block-b">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_breeder_sex', 'colDescription', 'Description')]);
	s += '            </div>';
	s += '        </div>';
	s += '    </li>';
	$('#lookup_breeder_sex #lstView').append(s);

	var showCount = filterCount = 0;
	var maxShowCount = isShowAll==true?p.length:$.Ctx.CustomPageSize;
	
	for (var i = 0; i < p.length; i++) {
		//var desc = p[i].DESC_ENG;
		//if ($.Ctx.Lang != 'en-US') {
		//	desc = p[i].DESC_LOC;
		//}
		var txt1 = $.Ctx.Nvl(p[i].BREEDER_SEX, "");
        if(p[i].NAME == null || p[i].NAME  == ""){
            if(p[i].BREEDER_SEX == "F"){
                p[i].NAME = $.Ctx.Lcl('lookup_breeder_sex' , 'msgFemale' , 'Female');
            }else if(p[i].BREEDER_SEX == "M"){
                p[i].NAME = $.Ctx.Lcl('lookup_breeder_sex' , 'msgMale' , 'Male');
            }else{
                p[i].NAME = $.Ctx.Lcl('lookup_breeder_sex' , 'msgForM' , 'Female or Male');
            }
        }
        //var txt2 = $.Ctx.Nvl(desc, "");
		var s = '<li data-icon="false"><a id="{0}" data-tag="lst_item" {1}  >'.format(['lki-' + i, "data-id='" + i + "'"]);
		s += '<div class="ui-grid-b">';
		s += '<div class="ui-block-a"> <center>{0}</center></div>'.format([p[i].BREEDER_SEX]);
		s += '<div class="ui-block-b"><center>{0}</center></div>'.format([p[i].NAME]);
		s += '</div>';
		s += '</a></li>';
		
		if (!IsNullOrEmpty(filterText)) {
			if (txt1.contains(filterText) || txt2.contains(filterText)) {
				filterCount += 1;
				if (showCount <= maxShowCount) {
					$('#lookup_breeder_sex #lstView').append(s);
					showCount += 1;
				}
			}
		} else {
			filterCount += 1;
			if (showCount <= maxShowCount) {
				$('#lookup_breeder_sex #lstView').append(s);
				showCount += 1;
			}
		}
	}//end for

	$('#lookup_breeder_sex #lstView').listview('refresh');
	$('#lookup_breeder_sex a[data-tag="lst_item"]').click(function (e) {
		var ind = $(this).attr('data-id');
		var param = new LookupParam();
		param = $.Ctx.GetPageParam('lookup_breeder_sex', 'param');
		$.Ctx.SetPageParam(param.calledPage, param.calledResult, dSource[ind]);
		$.Ctx.NavigatePage(param.calledPage, null, { transition:'slide' });
	});
	
	if (!IsNullOrEmpty(filterText)) 
		$('#lookup_breeder_sex #captionHeader').html($.Ctx.Lcl('lookup_breeder_sex', 'headerBreederSexFilter', '({0}/{1})Breeder/Sex').format([filterCount, p.length]));
	else 
		$('#lookup_breeder_sex #captionHeader').html($.Ctx.Lcl('lookup_breeder_sex', 'headerBreederSex', '({0})Breeder/Sex').format([p.length]));
	
	if (filterCount==showCount)
		$('#lookup_breeder_sex #div-showall').hide();
	else 
		$('#lookup_breeder_sex #div-showall').show();
}

