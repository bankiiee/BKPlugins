$('#lookup_customer_pig').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('lookup_customer_pig');
});

$('#lookup_customer_pig').bind('pageinit', function (e) {
    $('#lookup_customer_pig a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('lookup_customer_pig', 'Previous'), null, { transition: 'slide', reverse: 'true' });
    });

    $('#lookup_customer_pig #lstView').listview('option', 'filterCallback',
        function (text, searchString) {
            var lText = text.toLowerCase();
            if(lText.indexOf('*') !== -1) {return false};
            if (lText.indexOf(searchString) !== -1){return false} ;
            return true;
        }
    );
	$('#lookup_customer_pig #lstView').bind('listviewbeforefilter',
        function (e, data) {
            var $input = $(data.input);
            var filterText = $input.val();
            populateListView(dSource, filterText, false);
    });
	$('#lookup_customer_pig #div-showall').click(function (e) {
        var $input = $('#lookup_customer_pig input[data-type="search"]');
        var filterText = $input.val();
        populateListView(dSource, filterText, true);
    });
});
 var dSource=null;
$('#lookup_customer_pig').bind('pagebeforeshow', function (e) {
    //console.log($.Ctx.PageParam);
    // s is where statement
    var s = $.Ctx.GetPageParam('lookup_customer_pig','statement')
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var str = "SELECT * FROM HH_FR_CUSTOMER_PIG {0}".format([s]);
    cmd.sqlText = str;
    cmd.executeReader(function (tx, res) {
		dSource = new Array();
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_FR_CUSTOMER_PIG();
                m.retrieveRdr(res.rows.item(i));
                dSource.push(m);
            }
        }
		populateListView(dSource,null, false);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
});

function populateListView(p, filterText, isShowAll) {
	$('#lookup_customer_pig #lstView').empty();
	var s = ' <li data-icon="false" data-filtertext="*">';
	s += '        <div class="ui-grid-b">';
	s += '            <div class="ui-block-a">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_customer_pig', 'colCustomer', 'Customer')]);
	s += '            </div>';
	s += '            <div class="ui-block-b">';
	s += '                <center>';
	s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_customer_pig', 'colName', 'Name')]);
	s += '            </div>';
	s += '        </div>';
	s += '    </li>';
	$('#lookup_customer_pig #lstView').append(s);
	
	var showCount = filterCount = 0;
	var maxShowCount = isShowAll==true?p.length:$.Ctx.CustomPageSize;
	
	for (var i = 0; i < p.length; i++) {
		var m = p[i];
		var txt1 = $.Ctx.Nvl(m.CUSTOMER_CODE, "");
        var txt2 = $.Ctx.Nvl(m.CUSTOMER_NAME, "");
		var s = '<li data-icon="false"><a id="{0}" data-tag="lst_item" {1}  >'.format(['lki-' + i, "data-id='" + i + "'"]);
		s += '<div class="ui-grid-b"  data-role="fieldcontain">';
		s += '<div class="ui-block-a"> <center>{0}</center></div>'.format([m.CUSTOMER_CODE]);
		s += '<div class="ui-block-b"><center>{0}</center></div>'.format([m.CUSTOMER_NAME]);
		s += '</div>';
		s += '</a></li>';
		
		if (!IsNullOrEmpty(filterText)) {
			if (txt1.contains(filterText) || txt2.contains(filterText)) {
				filterCount += 1;
				if (showCount <= maxShowCount) {
					$('#lookup_customer_pig #lstView').append(s);
					showCount += 1;
				}
			}
		} else {
			filterCount += 1;
			if (showCount <= maxShowCount) {
				$('#lookup_customer_pig #lstView').append(s);
				showCount += 1;
			}
		}
	}//end for
	$('#lookup_customer_pig #lstView').listview('refresh');
	$('#lookup_customer_pig a[data-tag="lst_item"]').click(function (e) {
		var ind = $(this).attr('data-id');
		var param = new LookupParam();
		param = $.Ctx.GetPageParam('lookup_customer_pig', 'param');
		$.Ctx.SetPageParam(param.calledPage, param.calledResult, dSource[ind]);
		$.Ctx.NavigatePage(param.calledPage, null, { transition: 'slide'});
	});
	
	if (!IsNullOrEmpty(filterText)) 
		$('#lookup_customer_pig #captionHeader').html($.Ctx.Lcl('lookup_customer_pig', 'headerCustomerInfoFilter', '({0}/{1})Customer Information').format([filterCount, p.length]));
	 else 
		$('#lookup_customer_pig #captionHeader').html($.Ctx.Lcl('lookup_customer_pig', 'headerCustomerInfo', '({0})Customer Information').format([p.length]));
	
	if (filterCount==showCount)
		$('#lookup_customer_pig #div-showall').hide();
	else 
		$('#lookup_customer_pig #div-showall').show();
}


