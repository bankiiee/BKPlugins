$('#lookup_mat_stock').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('lookup_mat_stock');
});

$('#lookup_mat_stock').bind('pageinit', function (e) {
	
    $('#lookup_mat_stock a[data-back="true"]').click(function (e) {
		var param = $.Ctx.GetPageParam('lookup_mat_stock', 'param');
        $.Ctx.NavigatePage(param.calledPage, null, { transition:'slide', reverse:'true' });
    });

    $('#lookup_mat_stock #lstView').listview('option', 'filterCallback',
        function (text, searchString) {
            var lText = text.toLowerCase();
            if(lText.indexOf('*') !== -1) {return false};
            if (lText.indexOf(searchString) !== -1){return false} ;
            return true;
    });
	
    $('#lookup_mat_stock #lstView').bind('listviewbeforefilter',
        function (e, data) {
            var $input = $(data.input);
            var filterText = $input.val();
            populateListView(dSource, filterText, false);
    });
    
	$('#lookup_mat_stock #div-showall').click(function (e) {
        var $input = $('#lookup_boar input[data-type="search"]');
        var filterText = $input.val();
        populateListView(dSource, filterText, true);
    });
});

var dSource=null;

$('#lookup_mat_stock').bind('pagebeforeshow', function (e) {
    var farmOrg = $.Ctx.GetPageParam('lookup_mat_stock','farmOrg');
	var stkTyp = $.Ctx.GetPageParam('lookup_mat_stock','stkType');
	
	var cmd = $.Ctx.DbConn.createSelectCommand();
	cmd.sqlText = "SELECT A.PRODUCT_CODE , B.PRODUCT_NAME, B.STOCK_KEEPING_UNIT,B.UNIT_PACK, B.PRODUCT_STOCK_TYPE, A.LOT_NUMBER,";
	//cmd.sqlText +="SUM (CASE B.STOCK_KEEPING_UNIT WHEN 'Q' THEN A.QUANTITY ELSE 0 END) QTY,";
	//cmd.sqlText +="SUM (CASE B.STOCK_KEEPING_UNIT WHEN 'W' THEN A.WEIGHT ELSE 0 END) WGH ";
	cmd.sqlText +="SUM(A.QUANTITY) QTY,";
	cmd.sqlText +="SUM(A.WEIGHT) WGH ";
	cmd.sqlText +="FROM S1_ST_STOCK_BALANCE A ";
	cmd.sqlText +="JOIN HH_PRODUCT_BU B ON (A.BUSINESS_UNIT=B.BUSINESS_UNIT AND A.PRODUCT_CODE=B.PRODUCT_CODE) ";
	cmd.sqlText +="WHERE A.BUSINESS_UNIT=? ";
    cmd.sqlText +=" AND A.COMPANY=? ";
    cmd.sqlText +=" AND A.OPERATION=? ";
    cmd.sqlText +=" AND A.SUB_OPERATION=? ";
	cmd.sqlText +=" AND A.WAREHOUSE_CODE=? ";
	var strStk=	$.FarmCtx.ExtractParam(stkTyp);
	if (strStk!=='')
		cmd.sqlText += " AND PRODUCT_STOCK_TYPE IN ({0}) ".format([strStk]);
	cmd.sqlText +="GROUP BY A.PRODUCT_CODE, B.PRODUCT_NAME, A.LOT_NUMBER, ";
	cmd.sqlText +="B.STOCK_KEEPING_UNIT, B.STOCK_KEEPING_UNIT,B.UNIT_PACK, B.PRODUCT_STOCK_TYPE ";
	cmd.sqlText +="ORDER BY B.PRODUCT_NAME ";
	cmd.parameters.push($.Ctx.Bu);
	cmd.parameters.push($.Ctx.ComCode);
	cmd.parameters.push($.Ctx.Op);
	cmd.parameters.push($.Ctx.SubOp);
	cmd.parameters.push(farmOrg);
	dSource = [];
	cmd.executeReader(function (t, res) {
		if (res.rows.length != 0) {
			for (var i=0;i<res.rows.length;i++){
				if (res.rows.item(i).PRODUCT_CODE!==null && res.rows.item(i).PRODUCT_NAME!==null){
					dSource.push({'PRODUCT_CODE':res.rows.item(i).PRODUCT_CODE,
						   'PRODUCT_NAME':res.rows.item(i).PRODUCT_NAME,
						   'STOCK_KEEPING_UNIT': res.rows.item(i).STOCK_KEEPING_UNIT,
						   'UNIT_PACK':res.rows.item(i).UNIT_PACK, 
						   'PRODUCT_STOCK_TYPE':res.rows.item(i).PRODUCT_STOCK_TYPE,
						   'LOT_NUMBER': res.rows.item(i).LOT_NUMBER,
						   'QTY':res.rows.item(i).QTY, 
						   'WGH':res.rows.item(i).WGH});
				}
			}
//            alert(JSON.stringify(dSource))
			populateListView(dSource, null, false);
			if (typeof SuccessCB=='function') SuccessCB(ret);
		}else{
			if (typeof SuccessCB=='function') SuccessCB(null);
		}
	},function(err){ 
		console.log(err); 
	});
});

function populateListView(p, filterText, isShowAll) {
	$('#lookup_mat_stock #lstView').empty();
	var s = '<li data-icon="false" data-filtertext="*">';
	s += '        <div class="ui-grid-b">';
	s += '            <div class="ui-block-a">';
	s += '               <div style="color:blue">{0}</div>'.format([$.Ctx.Lcl('lookup_mat_stock','colBreeder','Product')]);
	s += '            </div>';
	//s += '            <div class="ui-block-b">';
	//s += '               <div style="color:blue;text-align:right">{0}</div>'.format([$.Ctx.Lcl('lookup_mat_stock','colLot','Lot NO.')]);
	//s += '            </div>';
	s += '            <div class="ui-block-b">';
	s += '               <div style="color:blue;text-align:right">{0}</div>'.format([$.Ctx.Lcl('lookup_mat_stock', 'colQty', 'QTY')]);
	s += '        	  </div>';
	s += '            <div class="ui-block-c">';
	s += '               <div style="color:blue;text-align:right">{0}</div>'.format([$.Ctx.Lcl('lookup_mat_stock', 'colWgh', 'WGH')]);
	s += '        	  </div>';
	s += '        </div>';
	s += '</li>';
	$('#lookup_mat_stock #lstView').append(s);
	var showCount = filterCount = 0;
	var maxShowCount = isShowAll==true?p.length:$.Ctx.CustomPageSize;
	var lenAll=0;
	for (var i=0;i<p.length; i++) {
		if (p[i].QTY==0&&p[i].WGH==0) continue;
		
		var txt1 = $.Ctx.Nvl(p[i].PRODUCT_NAME, "");
        //var txt2 = $.Ctx.Nvl(p[i].LOT_NUMBER, "");
		
		var s = '<li data-icon="false"><a id="lki-{0}" data-tag="lst_item" data-id="{0}">'.format([i]);
		s += '<div class="ui-grid-b">';
		s += '		<div class="ui-block-a"><div style="">{0}</div></div>'.format([p[i].PRODUCT_NAME]);
		//s += '		<div class="ui-block-b"><div style="text-align:right">{0}</div></div>'.format([p[i].LOT_NUMBER]);
		s += '		<div class="ui-block-b"><div style="text-align:right">{0}</div></div>'.format([accounting.formatNumber(p[i].QTY,0,",")]);
		s += '		<div class="ui-block-c"><div style="text-align:right">{0}</div></div>'.format([accounting.formatNumber(p[i].WGH,2,",")]);
		s += '</div>';
		s += '</a></li>';
		if (!IsNullOrEmpty(filterText)) {
			if (txt1.contains(filterText)) {
				filterCount += 1;
				if (showCount <= maxShowCount) {
					$('#lookup_mat_stock #lstView').append(s);
					showCount += 1;
				}
			}
		} else {
			filterCount += 1;
			if (showCount <= maxShowCount) {
				$('#lookup_mat_stock #lstView').append(s);
				showCount += 1;
			}
		}
		lenAll+=1;
	}// end for
	$('#lookup_mat_stock #lstView').listview('refresh');
	$('#lookup_mat_stock a[data-tag="lst_item"]').click(function (e) {
		var ind = $(this).attr('data-id');
		var param = $.Ctx.GetPageParam('lookup_mat_stock', 'param');
		$.Ctx.SetPageParam(param.calledPage, param.calledResult, dSource[ind]);
		$.Ctx.NavigatePage(param.calledPage, null, { transition: 'slide'});
	});
	
	if (!IsNullOrEmpty(filterText)) 
		$('#lookup_mat_stock #captionHeader').html('({0}/{1}) '.format([filterCount, lenAll]) + $.Ctx.Lcl('lookup_mat_stock', 'headMatStk','Material Stock'));
	else 
		$('#lookup_mat_stock #captionHeader').html('({0}) '.format([lenAll]) + $.Ctx.Lcl('lookup_mat_stock', 'headMatStk', 'Material Stock'));
	
	if (filterCount==showCount)
		$('#lookup_mat_stock #div-showall').hide();
	else 
		$('#lookup_mat_stock #div-showall').show();
}


