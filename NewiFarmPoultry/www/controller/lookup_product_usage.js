$('#lookup_product_usage').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('lookup_product_usage');
});

$('#lookup_product_usage').bind('pageinit', function (e) {
    $('#lookup_product_usage a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('lookup_product_usage', 'Previous'), null, { transition: 'slide', action: 'reverse' });
    });

    $('#lookup_product_usage #lstView').listview('option', 'filterCallback',
        function (text, searchString) {
            var lText = text.toLowerCase();
            if (lText.indexOf('*') !== -1) { return false };
            if (lText.indexOf(searchString) !== -1) { return false };
            return true;
        }
    );
	$('#lookup_product_usage #lstView').bind('listviewbeforefilter',
        function (e, data) {
            var $input = $(data.input);
            var filterText = $input.val();
            populateListView(dSource, filterText, false);
    });
    
	$('#lookup_product_usage #div-showall').click(function (e) {
        var $input = $('#lookup_product_usage input[data-type="search"]');
        var filterText = $input.val();
        populateListView(dSource, filterText, true);
    });

});
var dSource =null;
$('#lookup_product_usage').bind('pagebeforeshow', function (e) {
    console.log($.Ctx.PageParam);
    
    // s is where statement
    var s = $.Ctx.GetPageParam('lookup_product_usage', 'ProductCode');
    var ProductStockType = $.Ctx.GetPageParam('lookup_product_usage', 'product_stock_type');
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var str;

    if (IsNullOrEmpty(s))
    {
        str = " SELECT  A.* , B.QUANTITY, B.WEIGHT FROM HH_PRODUCT_BU A, S1_ST_STOCK_BALANCE B WHERE     A.BUSINESS_UNIT = ? AND A.PRODUCT_STOCK_TYPE = ? AND B.PRODUCT_CODE = A.PRODUCT_CODE AND B.COMPANY = ? AND B.OPERATION = ? AND B.SUB_OPERATION = ? AND B.BUSINESS_UNIT = ? AND B.WAREHOUSE_CODE = ? " ;
    }else{
        str = " SELECT  A.* , B.QUANTITY, B.WEIGHT FROM HH_PRODUCT_BU A, S1_ST_STOCK_BALANCE B WHERE     A.BUSINESS_UNIT = ? AND A.PRODUCT_STOCK_TYPE = ? AND B.PRODUCT_CODE = A.PRODUCT_CODE AND B.COMPANY = ? AND B.OPERATION = ? AND B.SUB_OPERATION = ? AND B.BUSINESS_UNIT = ? AND B.WAREHOUSE_CODE = ? AND A.PRODUCT_CODE NOT IN ( {0} ) ".format([s]);
    }
    cmd.sqlText = str;
    cmd.parameters.push($.Ctx.Bu);
    cmd.parameters.push(ProductStockType);
    cmd.parameters.push($.Ctx.ComCode);
    cmd.parameters.push($.Ctx.Op);
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Bu);
    if ($.Ctx.Bu == "FARM_PIG")
        cmd.parameters.push($.Ctx.Warehouse);
    else
        cmd.parameters.push($.Ctx.GetPageParam('lookup_product_usage' , 'selectedFarmOrgCode'));
    console.log(cmd.sqlText);
    console.log(cmd.parameters);
    cmd.executeReader(function (tx, res) {
		dSource = new Array();
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_PRODUCT_BU();
                m.retrieveRdr(res.rows.item(i));
                if (res.rows.item(i).UNIT_PACK != null)
                    m.UNIT_PACK = res.rows.item(i).UNIT_PACK
                else
                    m.UNIT_PACK = null;

                if (res.rows.item(i).STOCK_KEEPING_UNIT != null)
                    m.STOCK_KEEPING_UNIT = res.rows.item(i).STOCK_KEEPING_UNIT
                else
                    m.STOCK_KEEPING_UNIT = null;

                if (res.rows.item(i).WEIGHT != null)
                    m.WEIGHT = res.rows.item(i).WEIGHT.toString();
                else
                    m.WEIGHT = null;

                if (res.rows.item(i).QUANTITY != null)
                    m.QUANTITY = res.rows.item(i).QUANTITY.toString();
                else
                    m.QUANTITY = null;

                if(res.rows.item(i).STOCK_KEEPING_UNIT == "W" ){
                    m.QUANTITY = "1";
                }
                if (m.PRODUCT_SHORT_NAME == null){
                    m.PRODUCT_SHORT_NAME = m.PRODUCT_NAME + " (" + m.STOCK_KEEPING_UNIT + ") ";
                }
                dSource.push(m);
            }
            console.log(dSource);
        }
		populateListView(dSource, null, false);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
});

function populateListView(p, filterText, isShowAll) {
	$('#lookup_product_usage #lstView').empty();
	var showCount = filterCount = 0;
	var maxShowCount = isShowAll==true?p.length:$.Ctx.CustomPageSize;
	
	for (var i=0; i<p.length; i++) {
		var m = p[i];
//            var desc = m.NAME_ENG;
//            if ($.Ctx.Lang != 'en-US') {
//                desc = m.NAME_LOC;
//            }
		var txt1 = $.Ctx.Nvl(m.PRODUCT_CODE, "");
        var txt2 = $.Ctx.Nvl(m.PRODUCT_NAME, "");
		var s = '<li data-icon="false"><a id="{0}" data-tag="lst_item" {1}  >'.format(['lki-' + i, "data-id='" + i + "'"]);
			s += '<p class="lki_name"><h3>{0}</h3></p>'.format([m.PRODUCT_CODE]);
			s += '<p><strong class="lki_code">{0}</strong></p>'.format([m.PRODUCT_NAME]);
		var labelBalQtyWt = $.Ctx.Lcl('lookup_product_usage', 'labelBalQtyWt', 'Balance Stock Qty: {0} Wt: {1}').format([m.QUANTITY, m.WEIGHT])
			s += '<p class="lki_code">{0}</p>'.format([labelBalQtyWt]);
			s += '</a></li>';
		
		if (!IsNullOrEmpty(filterText)) {
			if (txt1.contains(filterText) || txt2.contains(filterText)) {
				filterCount += 1;
				if (showCount <= maxShowCount) {
					$('#lookup_product_usage #lstView').append(s);
					showCount += 1;
				}
			}
		}else{
			filterCount += 1;
			if (showCount <= maxShowCount) {
				$('#lookup_product_usage #lstView').append(s);
				showCount += 1;
			}
		}
	}//'end for

	$('#lookup_product_usage #lstView').listview('refresh');
	$('#lookup_product_usage a[data-tag="lst_item"]').click(function (e) {
		var ind = $(this).attr('data-id');
		var param = new LookupParam();
		param = $.Ctx.GetPageParam('lookup_product_usage', 'param');
		$.Ctx.SetPageParam(param.calledPage, param.calledResult, dSource[ind]);
		$.Ctx.NavigatePage(param.calledPage, null, { transition: 'slide' });
	});
	
	if (!IsNullOrEmpty(filterText))
	    $('#lookup_product_usage #captionHeader').html($.Ctx.Lcl('lookup_product_usage', 'headerProdInfFilter', '({0}/{1})Product Information').format([filterCount, p.length]));
	else 
		$('#lookup_product_usage #captionHeader').html($.Ctx.Lcl('lookup_product_usage', 'headerProdInf', '({0})Product Information').format([p.length]));
	
	if (filterCount==showCount)
		$('#lookup_product_usage #div-showall').hide();
	else 
		$('#lookup_product_usage #div-showall').show();
}
	