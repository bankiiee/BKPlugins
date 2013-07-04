
var pParam = $.Ctx.GetPageParam('medicine_usage_search','param');
var locationParam = "1=1";
if (pParam != null){
    if(pParam['location'] != null  )
        locationParam = " B.LOCATION IN ('" + pParam['location'].replace(/\|/g,"','") + "') ";
}




$('#medicine_usage_detail').bind('pagebeforecreate', function (e) {

//    var ProductStockType = $.Ctx.GetPageParam('medicine_usage_search', 'product_stock_type');
//    var DocumentType = $.Ctx.GetPageParam('medicine_usage_search', 'document_type');
//    if(ProductStockType == "20"){
//        $("#medicine_usage_detail #captionHeader").attr("data-lang","headerMedicineUsage");
//    }else if(ProductStockType == "56"){
//        if (DocumentType == "DCTYP75" ){
//            $("#medicine_usage_detail #captionHeader").attr("data-lang","headerSemenUsage");
//        }else if(DocumentType == "DCTYP61" ){
//            $("#medicine_usage_detail #captionHeader").attr("data-lang","headerProduceSemen");
//        }
//    }

    $.Util.RenderUiLang('medicine_usage_detail');
    $.Ctx.RenderFooter('medicine_usage_detail');
});

$('#medicine_usage_detail').bind('pagebeforehide', function (e) {
    retrieveFromInput();
    $.Ctx.PersistPageParam();
});

$('#medicine_usage_detail a[data-role="button"]').click(function (e) {
//    $.Ctx.SetPageParam(page, 'ScrollingTo',  $(this).attr('id'));
    $.Ctx.SetPageParam('medicine_usage_detail', 'ScrollingTo',  $(window).scrollTop());
});


$('#medicine_usage_detail').bind('pageshow', function (e) {
    if ($.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo') != null ){
//        scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
        $('html, body').animate({
            scrollTop: $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')
        }, 0);
    }
});

$('input').live('focus', function () {
    var $this = $(this);
    $this.select();
    // Work around Chrome's little problem
    $this.mouseup(function () {
        // Prevent further mouseup intervention
        $this.unbind("mouseup");
        return false;
    });
});


function IsNanOrNullOrEmpty(str) {
    if (str == undefined) { return true };
    if (str == null) { return true };
    if (str === '') { return true };
    if (isNaN(str)) { return true };
    if (typeof(str) == 'String'){
        if (str.trim() === '') { return true };
    }
    return false;
}


function TotalQty(){
    var totalQty = 0;
    if (! IsNanOrNullOrEmpty(model.TOTAL_QTY )){
        totalQty = Number(model.TOTAL_QTY);
    }
    if ( typeof($('#medicine_usage_detail #txtProQty1').val()) != 'undefined'  ){
        totalQty = totalQty + Number($('#medicine_usage_detail #txtProQty1').val());
    }
    if ( typeof($('#medicine_usage_detail #txtProQty2').val()) != 'undefined'  ){
        totalQty = totalQty + Number($('#medicine_usage_detail #txtProQty2').val());
    }
    if ( typeof($('#medicine_usage_detail #txtProQty3').val()) != 'undefined'  ){
        totalQty = totalQty + Number($('#medicine_usage_detail #txtProQty3').val());
    }
    if ( typeof($('#medicine_usage_detail #txtProQty4').val()) != 'undefined'  ){
        totalQty = totalQty + Number($('#medicine_usage_detail #txtProQty4').val());
    }
    return totalQty;
}


function TotalWt(){
    var totalWt = 0;
    if (! IsNanOrNullOrEmpty(model.TOTAL_WT)){
        totalWt = Number(model.TOTAL_WT);
    }
    if ( typeof($('#medicine_usage_detail #txtProWt1').val()) != 'undefined'  ){
        totalWt = totalWt + Number($('#medicine_usage_detail #txtProWt1').val());
    }
    if ( typeof($('#medicine_usage_detail #txtProWt2').val()) != 'undefined'  ){
        totalWt = totalWt + Number($('#medicine_usage_detail #txtProWt2').val());
    }
    if ( typeof($('#medicine_usage_detail #txtProWt3').val()) != 'undefined'  ){
        totalWt = totalWt + Number($('#medicine_usage_detail #txtProWt3').val());
    }
    if ( typeof($('#medicine_usage_detail #txtProWt4').val()) != 'undefined'  ){
        totalWt = totalWt + Number($('#medicine_usage_detail #txtProWt4').val());
    }
    return totalWt;
}


function SetDefault(){
    if (model.FARM_ORG_LOC == null){
        var ProductStockType = $.Ctx.GetPageParam('medicine_usage_search', 'product_stock_type');
        var DocumentType   = $.Ctx.GetPageParam('medicine_usage_search', 'document_type');
        var cmd = $.Ctx.DbConn.createSelectCommand();
        var str = '';

        if ($.Ctx.Bu == "FARM_PIG") {
            str =  " SELECT (SELECT SUM (QTY) FROM HH_FR_MS_SWINE_MATERIAL WHERE     ORG_CODE = ? AND FARM_ORG = ? AND FARM_ORG_LOC = B.FARM_ORG AND PRODUCT_STOCK_TYPE = ? AND TRANSACTION_DATE = ? AND DOCUMENT_TYPE = ?) AS TOTAL_QTY, (SELECT SUM (WGH) FROM HH_FR_MS_SWINE_MATERIAL WHERE     ORG_CODE = ? AND FARM_ORG = ? AND FARM_ORG_LOC = B.FARM_ORG AND PRODUCT_STOCK_TYPE = ? AND TRANSACTION_DATE = ? AND DOCUMENT_TYPE = ?) AS TOTAL_WT, B.FARM_ORG, B.LOCATION, B.NAME_ENG, B.NAME_LOC FROM    (SELECT DISTINCT FARM_ORG_LOC FROM HH_FR_MS_GROWER_STOCK WHERE ORG_CODE = ? AND FARM_ORG = ? UNION SELECT DISTINCT RELEASE_FARM_ORG_LOC AS FARM_ORG_LOC FROM HH_FR_MS_SWINE_ACTIVITY WHERE ORG_CODE = ? AND FARM_ORG = ?) A LEFT OUTER JOIN FR_FARM_ORG B ON A.FARM_ORG_LOC = B.FARM_ORG  WHERE " + locationParam + " ORDER BY FARM_ORG_LOC ";
        }
        else {
            str =   "SELECT (SELECT SUM (QTY) FROM HH_FR_MS_MATERIAL_STOCK "; 
            str += " WHERE ORG_CODE = ? AND FARM_ORG = ? AND FARM_ORG_LOC = B.FARM_ORG AND PRODUCT_STOCK_TYPE = ? " ; 
            str += " AND TRANSACTION_DATE = ? AND DOCUMENT_TYPE = ? ) AS TOTAL_QTY, " ; 
            str += " (SELECT SUM (WGH) FROM HH_FR_MS_MATERIAL_STOCK  " ; 
            str += " WHERE ORG_CODE = ? AND FARM_ORG = ? AND FARM_ORG_LOC = B.FARM_ORG AND PRODUCT_STOCK_TYPE = ? AND TRANSACTION_DATE = ? AND DOCUMENT_TYPE = ?) AS TOTAL_WT,  "; 
            str += " B.FARM_ORG, B.LOCATION, B.NAME_ENG, B.NAME_LOC FROM   ";
            str += " (SELECT DISTINCT FARM_ORG_LOC FROM HH_FR_MS_GROWER_STOCK WHERE ORG_CODE = ? AND FARM_ORG = ?) A LEFT OUTER JOIN FR_FARM_ORG B ";
            str += " ON A.FARM_ORG_LOC = B.FARM_ORG   ORDER BY FARM_ORG_LOC ";
        }

        cmd.sqlText = str;
        cmd.parameters.push($.Ctx.SubOp);
        cmd.parameters.push($.Ctx.Warehouse);
        cmd.parameters.push(ProductStockType);
        cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
        cmd.parameters.push(DocumentType);
        cmd.parameters.push($.Ctx.SubOp);
        cmd.parameters.push($.Ctx.Warehouse);
        cmd.parameters.push(ProductStockType);
        cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
        cmd.parameters.push(DocumentType);
        cmd.parameters.push($.Ctx.SubOp);
        cmd.parameters.push($.Ctx.Warehouse);
        if ($.Ctx.Bu == "FARM_PIG") {
            cmd.parameters.push($.Ctx.SubOp);
            cmd.parameters.push($.Ctx.Warehouse);
        }
        cmd.executeReader(function (tx, res) {
            if (res.rows.length == 1) {
                var m = new FR_FARM_ORG();
                m.retrieveRdr(res.rows.item(0));
                m.TOTAL_QTY = 0;
                m.TOTAL_WT = 0;
                if (res.rows.item(0).TOTAL_QTY != null)
                    m.TOTAL_QTY = Number(res.rows.item(0).TOTAL_QTY);

                if (res.rows.item(0).TOTAL_WT != null)
                    m.TOTAL_WT = Number(res.rows.item(0).TOTAL_WT);

                if (res.rows.item(0).LOCATION != null)
                    m.LOCATION = res.rows.item(0).LOCATION.toString();


                var cmd2 = $.Ctx.DbConn.createSelectCommand();
                var cmdUsage = $.Ctx.DbConn.createSelectCommand();
                if (m.LOCATION != "1") {
                    cmd2.sqlText = " SELECT SUM ( CASE WHEN GROWER.TRANSACTION_TYPE = '1' THEN (GROWER.MALE_QTY + GROWER.FEMALE_QTY) ELSE (GROWER.MALE_QTY + GROWER.FEMALE_QTY) * -1 END) AS PIG_BALANCE FROM HH_FR_MS_GROWER_STOCK GROWER WHERE     GROWER.ORG_CODE = ? AND GROWER.FARM_ORG = ? AND GROWER.FARM_ORG_LOC = ?"

                    cmd2.parameters.push($.Ctx.SubOp);
                    cmd2.parameters.push($.Ctx.Warehouse);
                    cmd2.parameters.push(m.FARM_ORG_LOC);

                    cmdUsage.sqlText = "SELECT SUM (A.STD_USAGE) AS STD_USAGE ,( SELECT CONDITION_01  FROM HH_GD2_FR_MAS_TYPE_FARM WHERE  GD_TYPE = 'SFD' AND GD_CODE =  ? ) AS STD_DIF_PER FROM (  SELECT (SUM ( CASE WHEN GROWER.TRANSACTION_TYPE = '1' THEN (GROWER.MALE_QTY + GROWER.FEMALE_QTY) ELSE (GROWER.MALE_QTY + GROWER.FEMALE_QTY) * -1 END) * SUM ( CASE WHEN STD.FEED_PER_HEAD IS NULL THEN 0 ELSE STD.FEED_PER_HEAD END)) AS STD_USAGE FROM    HH_FR_MS_GROWER_STOCK GROWER LEFT OUTER JOIN HH_FR_STD_FEED_BY_FARM STD ON     GROWER.ORG_CODE = STD.ORG_CODE AND STD.FARM_ORG_LOC = GROWER.FARM_ORG_LOC AND STD.LOT_NO = GROWER.BIRTH_WEEK AND STD.FEED_DATE = ? WHERE     GROWER.ORG_CODE = ? AND GROWER.FARM_ORG = ? AND GROWER.FARM_ORG_LOC = ? GROUP BY GROWER.BIRTH_WEEK) A"

                    cmdUsage.parameters.push($.Ctx.SubOp);
                    cmdUsage.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
                    cmdUsage.parameters.push($.Ctx.SubOp);
                    cmdUsage.parameters.push($.Ctx.Warehouse);
                    cmdUsage.parameters.push(m.FARM_ORG_LOC);



                } else {
                    cmd2.sqlText = " SELECT COUNT (*) AS PIG_BALANCE FROM HH_FR_MS_SWINE_ACTIVITY ACT WHERE     ACT.ORG_CODE = ? AND ACT.FARM_ORG = ? AND ACT.NEXT_ACTIVITY_TYPE IS NULL AND ACT.ACTIVITY_TYPE IN ('G', 'M', 'A', 'F', 'W') ";

                    cmd2.parameters.push($.Ctx.SubOp);
                    cmd2.parameters.push($.Ctx.Warehouse);

                    cmdUsage.sqlText = "SELECT( (CASE WHEN SUM (STD.FEED_PER_HEAD) IS NULL THEN 0 ELSE SUM (STD.FEED_PER_HEAD) END) * {0}) AS STD_USAGE, (SELECT CONDITION_01 FROM HH_GD2_FR_MAS_TYPE_FARM WHERE GD_TYPE = 'SFD' AND GD_CODE = ?) AS STD_DIF_PER FROM HH_FR_STD_FEED_BY_FARM STD WHERE     STD.ORG_CODE = ? AND STD.LOT_NO = 'NA' AND STD.FARM_ORG_LOC = ? AND STD.FEED_DATE = ?"

                    cmdUsage.parameters.push($.Ctx.SubOp);
                    cmdUsage.parameters.push($.Ctx.SubOp);
                    cmdUsage.parameters.push(m.FARM_ORG_LOC);
                    cmdUsage.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());

                }
                m.STD_USAGE = null;
                m.PIG_BALANCE = null;
                m.STD_DIF_PER = '20';
                m.MAX_DOCUMENT_NO = 0;


                var cmdMaxDoc = $.Ctx.DbConn.createSelectCommand();
                cmdMaxDoc.sqlText = "SELECT MAX ( MAT.DOCUMENT_NO +0 ) AS MAX_DOCUMENT_NO FROM {0} MAT WHERE MAT.ORG_CODE = ?".format([$.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
                cmdMaxDoc.parameters.push($.Ctx.SubOp);

                cmd2.executeReader(function (tx, res) {
                    if (res.rows.length != 0) {
                        if (res.rows.item(0).PIG_BALANCE != null)
                            m.PIG_BALANCE = res.rows.item(0).PIG_BALANCE.toString();

                        if (m.LOCATION == "1") {
                            cmdUsage.sqlText = cmdUsage.sqlText.format([Number(m.PIG_BALANCE)]);
                        }
                        cmdUsage.executeReader(function (tx, res) {
                            if (res.rows.item(0).STD_USAGE != null)
                                m.STD_USAGE = (res.rows.item(0).STD_USAGE / 1000).toString();
                            if (res.rows.item(0).STD_DIF_PER != null)
                                m.STD_DIF_PER = res.rows.item(0).STD_DIF_PER.toString();


                            cmdMaxDoc.executeReader(function (tx, res) {
                                if (res.rows.item(0).MAX_DOCUMENT_NO != null)
                                    m.MAX_DOCUMENT_NO = Number(res.rows.item(0).MAX_DOCUMENT_NO);



                                FeedUsageInput = m;
                                model.FARM_ORG_LOC = FeedUsageInput.FARM_ORG;
                                model.PIG_BALANCE = FeedUsageInput.PIG_BALANCE;
                                model.MAX_DOCUMENT_NO = FeedUsageInput.MAX_DOCUMENT_NO;
                                model.TOTAL_WT = FeedUsageInput.TOTAL_WT;
                                model.TOTAL_QTY = FeedUsageInput.TOTAL_QTY;
                                persistToInput();


                            }, function (err) {
                                $.Ctx.MsgBox("Error calculate max doc " + err.message);
                            });
                        }, function (err) {
                            $.Ctx.MsgBox("Error standard usage " + err.message);
                        });
                    }
                }, function (err) {
                    $.Ctx.MsgBox("Error product " + err.message);
                });
            };
        }, function (err) {
            $.Ctx.MsgBox(err.message);
        });
    }
}


$('#medicine_usage_detail').bind('pageinit', function (e) {
    var captionHeader = $.Ctx.GetPageParam('medicine_usage_search', 'captionHeader');
    $("#medicine_usage_detail #captionHeader").text($.Ctx.Lcl('medicine_usage_detail', captionHeader, 'Usage Information'));

    lkSelectTxt = $.Ctx.Lcl('medicine_usage_detail', 'msgSelect', 'Select');
    if (mode == "new") {
        SetDefault();
    }

    $('#medicine_usage_detail a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('medicine_usage_detail', 'Previous'), null, { transition: 'slide', action: 'reverse' }, false);
    });

    $('#medicine_usage_detail #lkFarmOrg').click(function (e) {
        retrieveFromInput();
        var p = new LookupParam();
        p.calledPage = 'medicine_usage_detail';
        p.calledResult = 'FeedUsageInput';
        $.Ctx.SetPageParam('lookup_feed_usage', 'param', p);
        $.Ctx.SetPageParam('lookup_feed_usage', 'Previous', 'medicine_usage_detail');
        $.Ctx.SetPageParam('lookup_feed_usage', 'SqlWhere', " WHERE " + locationParam);
        $.Ctx.SetPageParam('lookup_feed_usage', 'product_stock_type', $.Ctx.GetPageParam('medicine_usage_search', 'product_stock_type'));
        $.Ctx.SetPageParam('lookup_feed_usage', 'document_type', $.Ctx.GetPageParam('medicine_usage_search', 'document_type'));
        $.Ctx.NavigatePage('lookup_feed_usage', null, { transition: 'slide', action: 'reverse' }, false);
    });

    $('#medicine_usage_detail #lkProductId1').click(function (e) {

        var txt = $('#medicine_usage_detail #lkProductId2 span').text();
        var productCodeStr = "";
        if (txt != lkSelectTxt && ProductInput2 != null && modelStock2.PRODUCT_CODE != null) {
            productCodeStr = "'" + modelStock2.PRODUCT_CODE + "'";
        }
        txt = $('#medicine_usage_detail #lkProductId3 span').text();
        if (txt != lkSelectTxt && ProductInput3 != null && modelStock3.PRODUCT_CODE != null) {
            if (IsNullOrEmpty(productCodeStr))
                productCodeStr = productCodeStr + "'" + modelStock3.PRODUCT_CODE + "'";
            else
                productCodeStr = productCodeStr + ",'" + modelStock3.PRODUCT_CODE + "'";
        }
        txt = $('#medicine_usage_detail #lkProductId4 span').text();
        if (txt != lkSelectTxt && ProductInput4 != null && modelStock4.PRODUCT_CODE != null) {
            if (IsNullOrEmpty(productCodeStr))
                productCodeStr = productCodeStr + "'" + modelStock4.PRODUCT_CODE + "'";
            else
                productCodeStr = productCodeStr + ",'" + modelStock4.PRODUCT_CODE + "'";
        }
        if (IsNullOrEmpty(model.FARM_ORG_LOC)) {
            $.Ctx.MsgBox($.Ctx.Lcl('medicine_usage_detail', 'MsgIsRequire', '{0} is required.').format([$('#medicine_usage_detail #lblFarmOrgLoc').text()]));
        }
        else {
            navigateLookupPage('ProductInput1', productCodeStr); 
            /*
            var p = new LookupParam();
            p.calledPage = 'medicine_usage_detail';
            p.calledResult = 'ProductInput1';
            $.Ctx.SetPageParam('lookup_medicine_usage', 'param', p);
            $.Ctx.SetPageParam('lookup_medicine_usage', 'Previous', 'medicine_usage_detail');
            $.Ctx.SetPageParam('lookup_medicine_usage', 'transaction_type', $.Ctx.GetPageParam('medicine_usage_search', 'transaction_type'));
            $.Ctx.SetPageParam('lookup_medicine_usage', 'product_stock_type', $.Ctx.GetPageParam('medicine_usage_search', 'product_stock_type'));
            $.Ctx.SetPageParam('lookup_medicine_usage', 'ProductCode', productCodeStr);
            $.Ctx.NavigatePage('lookup_medicine_usage', null, { transition: 'slide', action: 'reverse' }, false);
            */
        }
    });
    $('#medicine_usage_detail #lkProductId2').click(function (e) {

        var txt = $('#medicine_usage_detail #lkProductId1 span').text();
        var productCodeStr = "";
        if (txt != lkSelectTxt && ProductInput1 != null && modelStock1.PRODUCT_CODE != null) {
            productCodeStr = "'" + modelStock1.PRODUCT_CODE + "'";
        }
        txt = $('#medicine_usage_detail #lkProductId3 span').text();
        if (txt != lkSelectTxt && ProductInput3 != null && modelStock3.PRODUCT_CODE != null) {
            if (IsNullOrEmpty(productCodeStr))
                productCodeStr = productCodeStr + "'" + modelStock3.PRODUCT_CODE + "'";
            else
                productCodeStr = productCodeStr + ",'" + modelStock3.PRODUCT_CODE + "'";
        }
        txt = $('#medicine_usage_detail #lkProductId4 span').text();
        if (txt != lkSelectTxt && ProductInput4 != null && modelStock4.PRODUCT_CODE != null) {
            if (IsNullOrEmpty(productCodeStr))
                productCodeStr = productCodeStr + "'" + modelStock4.PRODUCT_CODE + "'";
            else
                productCodeStr = productCodeStr + ",'" + modelStock4.PRODUCT_CODE + "'";
        }
        if (IsNullOrEmpty(model.FARM_ORG_LOC)) {
            $.Ctx.MsgBox($.Ctx.Lcl('medicine_usage_detail', 'MsgIsRequire', '{0} is required.').format([$('#medicine_usage_detail #lblFarmOrgLoc').text()]));
        }
        else {
            navigateLookupPage('ProductInput2', productCodeStr); 
            /*
            var p = new LookupParam();
            p.calledPage = 'medicine_usage_detail';
            p.calledResult = 'ProductInput2';
            $.Ctx.SetPageParam('lookup_medicine_usage', 'param', p);
            $.Ctx.SetPageParam('lookup_medicine_usage', 'Previous', 'medicine_usage_detail');
            $.Ctx.SetPageParam('lookup_medicine_usage', 'transaction_type', $.Ctx.GetPageParam('medicine_usage_search', 'transaction_type'));
            $.Ctx.SetPageParam('lookup_medicine_usage', 'product_stock_type', $.Ctx.GetPageParam('medicine_usage_search', 'product_stock_type'));
            $.Ctx.SetPageParam('lookup_medicine_usage', 'ProductCode', productCodeStr);
            $.Ctx.NavigatePage('lookup_medicine_usage', null, { transition: 'slide', action: 'reverse' }, false);
            */
        }
    });
    $('#medicine_usage_detail #lkProductId3').click(function (e) {

        var txt = $('#medicine_usage_detail #lkProductId1 span').text();
        var productCodeStr = "";
        if (txt != lkSelectTxt && ProductInput1 != null && modelStock1.PRODUCT_CODE != null) {
            productCodeStr = "'" + modelStock1.PRODUCT_CODE + "'";
        }
        txt = $('#medicine_usage_detail #lkProductId2 span').text();
        if (txt != lkSelectTxt && ProductInput2 != null && modelStock2.PRODUCT_CODE != null) {
            if (IsNullOrEmpty(productCodeStr))
                productCodeStr = productCodeStr + "'" + modelStock2.PRODUCT_CODE + "'";
            else
                productCodeStr = productCodeStr + ",'" + modelStock2.PRODUCT_CODE + "'";
        }
        txt = $('#medicine_usage_detail #lkProductId4 span').text();
        if (txt != lkSelectTxt && ProductInput4 != null && modelStock4.PRODUCT_CODE != null) {
            if (IsNullOrEmpty(productCodeStr))
                productCodeStr = productCodeStr + "'" + modelStock4.PRODUCT_CODE + "'";
            else
                productCodeStr = productCodeStr + ",'" + modelStock4.PRODUCT_CODE + "'";
        }
        if (IsNullOrEmpty(model.FARM_ORG_LOC)) {
            $.Ctx.MsgBox($.Ctx.Lcl('medicine_usage_detail', 'MsgIsRequire', '{0} is required.').format([$('#medicine_usage_detail #lblFarmOrgLoc').text()]));
        }
        else {
            navigateLookupPage('ProductInput3', productCodeStr); 
        /*
            var p = new LookupParam();
            p.calledPage = 'medicine_usage_detail';
            p.calledResult = 'ProductInput3';
            $.Ctx.SetPageParam('lookup_medicine_usage', 'param', p);
            $.Ctx.SetPageParam('lookup_medicine_usage', 'Previous', 'medicine_usage_detail');
            $.Ctx.SetPageParam('lookup_medicine_usage', 'transaction_type', $.Ctx.GetPageParam('medicine_usage_search', 'transaction_type'));
            $.Ctx.SetPageParam('lookup_medicine_usage', 'product_stock_type', $.Ctx.GetPageParam('medicine_usage_search', 'product_stock_type'));
            $.Ctx.SetPageParam('lookup_medicine_usage', 'ProductCode', productCodeStr);
            $.Ctx.NavigatePage('lookup_medicine_usage', null, { transition: 'slide', action: 'reverse' }, false);
            */
        }
    });
    $('#medicine_usage_detail #lkProductId4').click(function (e) {

        var txt = $('#medicine_usage_detail #lkProductId1 span').text();
        var productCodeStr = "";
        if (txt != lkSelectTxt && ProductInput1 != null && modelStock1.PRODUCT_CODE != null) {
            productCodeStr = "'" + modelStock1.PRODUCT_CODE + "'";
        }
        txt = $('#medicine_usage_detail #lkProductId2 span').text();
        if (txt != lkSelectTxt && ProductInput2 != null && modelStock2.PRODUCT_CODE != null) {
            if (IsNullOrEmpty(productCodeStr))
                productCodeStr = productCodeStr + "'" + modelStock2.PRODUCT_CODE + "'";
            else
                productCodeStr = productCodeStr + ",'" + modelStock2.PRODUCT_CODE + "'";
        }
        txt = $('#medicine_usage_detail #lkProductId3 span').text();
        if (txt != lkSelectTxt && ProductInput3 != null && modelStock3.PRODUCT_CODE != null) {
            if (IsNullOrEmpty(productCodeStr))
                productCodeStr = productCodeStr + "'" + modelStock3.PRODUCT_CODE + "'";
            else
                productCodeStr = productCodeStr + ",'" + modelStock3.PRODUCT_CODE + "'";
        }
        if (IsNullOrEmpty(model.FARM_ORG_LOC)) {
            $.Ctx.MsgBox($.Ctx.Lcl('medicine_usage_detail', 'MsgIsRequire', '{0} is required.').format([$('#medicine_usage_detail #lblFarmOrgLoc').text()]));
        }
        else {
            navigateLookupPage('ProductInput4', productCodeStr); 
            /*
            var p = new LookupParam();
            p.calledPage = 'medicine_usage_detail';
            p.calledResult = 'ProductInput4';
            $.Ctx.SetPageParam('lookup_medicine_usage', 'param', p);
            $.Ctx.SetPageParam('lookup_medicine_usage', 'Previous', 'medicine_usage_detail');
            $.Ctx.SetPageParam('lookup_medicine_usage', 'transaction_type', $.Ctx.GetPageParam('medicine_usage_search', 'transaction_type'));
            $.Ctx.SetPageParam('lookup_medicine_usage', 'product_stock_type', $.Ctx.GetPageParam('medicine_usage_search', 'product_stock_type'));
            $.Ctx.SetPageParam('lookup_medicine_usage', 'ProductCode', productCodeStr);
            $.Ctx.NavigatePage('lookup_medicine_usage', null, { transition: 'slide', action: 'reverse' }, false);
            */
        }
    });


    $('#medicine_usage_detail #txtProWt1').change(function () {
        $('#medicine_usage_detail #txtTotalWt').val(TotalWt());
    });

    $('#medicine_usage_detail #txtProWt2').change(function () {
        $('#medicine_usage_detail #txtTotalWt').val(TotalWt());
    });

    $('#medicine_usage_detail #txtProWt3').change(function () {
        $('#medicine_usage_detail #txtTotalWt').val(TotalWt());
    });

    $('#medicine_usage_detail #txtProWt4').change(function () {
        $('#medicine_usage_detail #txtTotalWt').val(TotalWt());
    });

    $('#medicine_usage_detail #txtProQty1').change(function () {
        if (!_.isNull(modelStock1)) {
            if (modelStock1.STOCK_KEEPING_UNIT == "Q" && !_.isNull(modelStock1.UNIT_PACK)) {
                if (typeof ($('#medicine_usage_detail #txtProQty1').val()) != 'undefined') {
                    $('#medicine_usage_detail #txtProWt1').val((Number($('#medicine_usage_detail #txtProQty1').val()) * Number(modelStock1.UNIT_PACK)).toString())
                }
            }
        }
        $('#medicine_usage_detail #txtTotalQty').val(TotalQty());
        $('#medicine_usage_detail #txtTotalWt').val(TotalWt());

    });

    $('#medicine_usage_detail #txtProQty2').change(function () {
        if (!_.isNull(modelStock2)) {
            if (modelStock2.STOCK_KEEPING_UNIT == "Q" && !_.isNull(modelStock2.UNIT_PACK)) {
                if (typeof ($('#medicine_usage_detail #txtProQty2').val()) != 'undefined') {
                    $('#medicine_usage_detail #txtProWt2').val((Number($('#medicine_usage_detail #txtProQty2').val()) * Number(modelStock2.UNIT_PACK)).toString());
                }
            }
        }
        $('#medicine_usage_detail #txtTotalQty').val(TotalQty());
        $('#medicine_usage_detail #txtTotalWt').val(TotalWt());

    });

    $('#medicine_usage_detail #txtProQty3').change(function () {
        if (!_.isNull(modelStock3)) {
            if (modelStock3.STOCK_KEEPING_UNIT == "Q" && !_.isNull(modelStock3.UNIT_PACK)) {
                if (typeof ($('#medicine_usage_detail #txtProQty3').val()) != 'undefined') {
                    $('#medicine_usage_detail #txtProWt3').val((Number($('#medicine_usage_detail #txtProQty3').val()) * Number(modelStock3.UNIT_PACK)).toString());
                }
            }
        }
        $('#medicine_usage_detail #txtTotalQty').val(TotalQty());
        $('#medicine_usage_detail #txtTotalWt').val(TotalWt());
    });

    $('#medicine_usage_detail #txtProQty4').change(function () {
        if (!_.isNull(modelStock4)) {
            if (modelStock4.STOCK_KEEPING_UNIT == "Q" && !_.isNull(modelStock4.UNIT_PACK)) {
                if (typeof ($('#medicine_usage_detail #txtProQty4').val()) != 'undefined') {
                    $('#medicine_usage_detail #txtProWt4').val((Number($('#medicine_usage_detail #txtProQty4').val()) * Number(modelStock4.UNIT_PACK)).toString());
                }
            }
        }
        $('#medicine_usage_detail #txtTotalQty').val(TotalQty());
        $('#medicine_usage_detail #txtTotalWt').val(TotalWt());
    });




    function MessageModel() {
        this.Warning = "";
        this.Error = "";
    }
    function CheckQtyWtQuota(ModelStock, Message) {
        var TransactionType = $.Ctx.GetPageParam('medicine_usage_search', 'transaction_type');
        if (!IsNullOrEmpty(ModelStock.PRODUCT_CODE) && !IsNanOrNullOrEmpty(ModelStock.WEIGHT)) {
            if (TransactionType != 1) {
                if (ModelStock.STOCK_KEEPING_UNIT == 'W') {
                    if (!IsNanOrNullOrEmpty(ModelStock.QUOTA_WT)) {
                        if (Number(ModelStock.WEIGHT) > Number(ModelStock.QUOTA_WT)) {
                            var s = $.Ctx.Lcl('medicine_usage_detail', 'msgWtMustLowerOrEqualThan', 'Weight of {0} must lower or equal than {1} Kg.').format([ModelStock.PRODUCT_SHORT_NAME, Number(ModelStock.QUOTA_WT)]);
                            Message.Error += s;
                        } else {
                            ProductList.push(ModelStock);
                        }
                    }
                    else {
                        var s = $.Ctx.Lcl('medicine_usage_detail', 'msgInvalidWt', ' {0} invalid in amount of weight.').format([ModelStock.PRODUCT_SHORT_NAME]);
                        Message.Error += s;
                    }
                }
                else {
                    if (!IsNanOrNullOrEmpty(ModelStock.QUANTITY)) {
                        if (!IsNanOrNullOrEmpty(ModelStock.QUOTA_QTY)) {
                            if (Number(ModelStock.QUANTITY) > Number(ModelStock.QUOTA_QTY)) {
                                var s = $.Ctx.Lcl('medicine_usage_detail', 'msgQtyMustLowerOrEqualThan', 'Quantity of {0} must lower or equal than {1} product(s).').format([ModelStock.PRODUCT_SHORT_NAME, Number(ModelStock.QUOTA_QTY)]);
                                Message.Error += s;
                            } else {
                                ProductList.push(ModelStock);
                            }
                        }
                        else {
                            var s = $.Ctx.Lcl('medicine_usage_detail', 'msgInvalidStockProduct', ' {0} invalid in stock of product.').format([ModelStock.PRODUCT_SHORT_NAME]);
                            Message.Error += s;
                        }
                    } else {
                        var s = $.Ctx.Lcl('medicine_usage_detail', 'msgQtyOrWghInvalid', 'Quantity or Weight is invalid.');
                        Message.Error += s;
                    }
                }
            } else {
                ProductList.push(ModelStock);
            }
        }
    }


    function isValid() {
        var msg = new MessageModel();
        if (!IsNullOrEmpty(model.FARM_ORG_LOC)) {
            ProductList = new Array();
            CheckQtyWtQuota(modelStock1, msg);
            CheckQtyWtQuota(modelStock2, msg);
            CheckQtyWtQuota(modelStock3, msg);
            CheckQtyWtQuota(modelStock4, msg);
        }
        else {
            var s = $.Ctx.Lcl('medicine_usage_detail', 'MsgIsRequire', '{0} is required.').format([$('#medicine_usage_detail #lblFarmOrgLoc').text()]);
            msg.Error += s;
        }
        if (!IsNullOrEmpty(msg.Error)) {
            $.Ctx.MsgBox(msg.Error);
            return false;
        }

        if (!IsNullOrEmpty(msg.Warning)) {
            /*var retConfirm=confirm($.Ctx.Lcl('medicine_usage_detail', 'msgConfirmSave', '{0} \nDo you want to Save ?').format([msg.Warning]));
            if (retConfirm == true)
            return true;
            else
            return false;*/

            $.Ctx.Confirm($.Ctx.Lcl('medicine_usage_detail', 'msgConfirmSave', '{0} \nDo you want to Save ?').format([msg.Warning]), function (btnIdx) {
                console.log(btnIdx);
                if (btnIdx == 1)
                    return true;
                else
                    return false;
            });
        }
        return true;
    }


    $('#medicine_usage_detail #btnSave').click(function (e) {
        retrieveFromInput();
        'Validate input if error show alert and return'
        if (isValid()) {
            var cmds = new Array();
            var DocNo = Number(model.MAX_DOCUMENT_NO);
            if (ProductList.length > 0) {
                SaveDB(DocNo, ProductList[0], cmds, function (cmds) {
                    if (ProductList.length > 1) {
                        SaveDB(DocNo, ProductList[1], cmds, function (cmds) {
                            if (ProductList.length > 2) {
                                SaveDB(DocNo, ProductList[2], cmds, function (cmds) {
                                    if (ProductList.length > 3) {
                                        SaveDB(DocNo, ProductList[3], cmds, function (cmds) {
                                            TransactionBD(cmds);
                                        });
                                    } else {
                                        TransactionBD(cmds);
                                    }
                                });
                            } else {
                                TransactionBD(cmds);
                            }
                        });
                    } else {
                        TransactionBD(cmds);
                    }
                });
            }
        }

    });

    function TransactionBD(cmds) {
        var tran = new DbTran($.Ctx.DbConn);
        if (mode == "new") {
            tran.executeNonQuery(cmds,
                function (tx, res) {
                    $.Ctx.MsgBox($.Ctx.Lcl('medicine_usage_detail', 'MsgSaveComplete', "Save completed."));
                    $.Ctx.SetPageParam('medicine_usage_detail', 'mode', 'new');
                    $.Ctx.SetPageParam('medicine_usage_detail', 'model', null);
                    $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock1', null);
                    $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock2', null);
                    $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock3', null);
                    $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock4', null);

                    $.Ctx.SetPageParam('medicine_usage_detail', 'FeedUsageInput', null);
                    $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput1', null);
                    $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput2', null);
                    $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput3', null);
                    $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput4', null);
                    initPage();
                    persistToInput();
                }, function (err) {
                    $.Ctx.MsgBox("Err :" + err.message);
                });

        } else if (mode == "edit") {
            tran.executeNonQuery(cmds,
                function (tx, res) {
                    $.Ctx.MsgBox($.Ctx.Lcl('medicine_usage_detail', 'MsgSaveComplete', "Save completed."));
                    modelStock1.QUOTA_QTY = modelStock1.QUOTA_QTY + (-1 * Number($.Ctx.GetPageParam('medicine_usage_search', 'cal_type')) * modelStock1.QTY_OLD) + (Number($.Ctx.GetPageParam('medicine_usage_search', 'cal_type')) * Number(modelStock1.QUANTITY));
                    modelStock1.QUOTA_WT = modelStock1.QUOTA_WT + (-1 * Number($.Ctx.GetPageParam('medicine_usage_search', 'cal_type')) * modelStock1.WGH_OLD) + (Number($.Ctx.GetPageParam('medicine_usage_search', 'cal_type')) * Number(modelStock1.WEIGHT));
                    modelStock1.QTY_OLD = modelStock1.QUANTITY;
                    modelStock1.WGH_OLD = modelStock1.WEIGHT;
                    $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock1', modelStock1);
                    initPage();
                    persistToInput();
                }, function (err) {
                    $.Ctx.MsgBox("Err :" + err.message);
                });
        }
    };

    function SaveDB(DocNo, ProductList, cmds, Success, Fail) {
        var bmodel;
        if ($.Ctx.Bu == "FARM_PIG")
            bmodel = new HH_FR_MS_SWINE_MATERIAL();
        else
            bmodel = new HH_FR_MS_MATERIAL_STOCK();

        var mStock = new S1_ST_STOCK_TRN();
        var mBalance = new S1_ST_STOCK_BALANCE();

        if (mode == "new") {
            bmodel.ORG_CODE = $.Ctx.SubOp;
            bmodel.FARM_ORG = $.Ctx.Warehouse;
            bmodel.FARM_ORG_LOC = model.FARM_ORG_LOC;
            bmodel.PRODUCT_STOCK_TYPE = $.Ctx.GetPageParam('medicine_usage_search', 'product_stock_type');
            bmodel.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            bmodel.DOCUMENT_TYPE = $.Ctx.GetPageParam('medicine_usage_search', 'document_type');
            DocNo = DocNo + 1;
            bmodel.DOCUMENT_NO = DocNo.toString();
            bmodel.DOCUMENT_EXT = 1;
            bmodel.PRODUCT_CODE = ProductList.PRODUCT_CODE;
            bmodel.QTY = Number(ProductList.QUANTITY);
            bmodel.WGH = Number(ProductList.WEIGHT);
            bmodel.OWNER = $.Ctx.UserId;
            bmodel.CREATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            bmodel.LAST_UPDATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            bmodel.FUNCTION = "A";
            bmodel.NUMBER_OF_SENDING_DATA = 0;
            var iCmdModel = bmodel.insertCommand($.Ctx.DbConn);
            cmds.push(iCmdModel);


            mStock.COMPANY = $.Ctx.ComCode;
            mStock.OPERATION = $.Ctx.Op;
            mStock.SUB_OPERATION = $.Ctx.SubOp;
            mStock.BUSINESS_UNIT = $.Ctx.Bu;
            mStock.DOCUMENT_DATE = bmodel.DOCUMENT_DATE;
            mStock.DOC_TYPE = bmodel.DOCUMENT_TYPE;
            mStock.DOC_NUMBER = Number(bmodel.DOCUMENT_NO).toString();
            mStock.EXT_NUMBER = bmodel.DOCUMENT_EXT;
            mStock.TRN_TYPE = $.Ctx.GetPageParam('medicine_usage_search', 'transaction_type');
            mStock.TRN_CODE = $.Ctx.GetPageParam('medicine_usage_search', 'transaction_code');
            mStock.CAL_TYPE = $.Ctx.GetPageParam('medicine_usage_search', 'cal_type');
            mStock.UNIT_LEVEL = model.FARM_ORG_LOC;
            mStock.STOCK_KEEPING_UNIT = ProductList.STOCK_KEEPING_UNIT;
            mStock.PRODUCT_STOCK_TYPE = ProductList.PRODUCT_STOCK_TYPE;
            mStock.PRODUCT_CODE = ProductList.PRODUCT_CODE;
            mStock.QUANTITY = Number(ProductList.QUANTITY);
            mStock.WEIGHT = Number(ProductList.WEIGHT);
            mStock.OWNER = $.Ctx.UserId;
            mStock.CREATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            mStock.LAST_UPDATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            mStock.FUNCTION = "A";
            mStock.NUMBER_OF_SENDING_DATA = 0;
            mStock.WAREHOUSE_CODE = model.FARM_ORG;
            var iCmdStock = mStock.insertCommand($.Ctx.DbConn);
            cmds.push(iCmdStock);

            mBalance.PRODUCT_CODE = ProductList.PRODUCT_CODE;
            if (ProductList.STOCK_KEEPING_UNIT != "W") {
                mBalance.QUANTITY = (Number(mStock.CAL_TYPE) * Number(ProductList.QUANTITY));
            } else {
                mBalance.QUANTITY = 0;
            }
            mBalance.WEIGHT = (Number(mStock.CAL_TYPE) * Number(ProductList.WEIGHT));
            mBalance.WAREHOUSE_CODE = $.Ctx.Warehouse;
            var iCmdBalance = mBalance.updateCommand($.Ctx.DbConn);
            cmds.push(iCmdBalance);

            $.FarmCtx.SetStockBalance(mBalance, cmds, function () {
                Success(cmds);
            }, function (err) {
                $.Ctx.MsgBox("Err :" + err.message);
                Fail(err);
            });
        } else if (mode == "edit") {
            bmodel.ORG_CODE = $.Ctx.SubOp;
            bmodel.FARM_ORG = $.Ctx.Warehouse;
            bmodel.FARM_ORG_LOC = model.FARM_ORG_LOC;
            bmodel.PRODUCT_STOCK_TYPE = $.Ctx.GetPageParam('medicine_usage_search', 'product_stock_type');
            bmodel.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            bmodel.DOCUMENT_TYPE = $.Ctx.GetPageParam('medicine_usage_search', 'document_type');
            bmodel.DOCUMENT_NO = ProductList.DOC_NUMBER;
            bmodel.DOCUMENT_EXT = 1;
            bmodel.PRODUCT_CODE = ProductList.PRODUCT_CODE;
            bmodel.QTY = Number(ProductList.QUANTITY);
            bmodel.WGH = Number(ProductList.WEIGHT);
            bmodel.OWNER = $.Ctx.UserId;
            bmodel.LAST_UPDATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            bmodel.FUNCTION = "U";
            bmodel.NUMBER_OF_SENDING_DATA = 0;
            var iCmdModel = bmodel.updateCommand($.Ctx.DbConn);
            cmds.push(iCmdModel);


            mStock.COMPANY = $.Ctx.ComCode;
            mStock.OPERATION = $.Ctx.Op;
            mStock.SUB_OPERATION = $.Ctx.SubOp;
            mStock.BUSINESS_UNIT = $.Ctx.Bu;
            mStock.DOCUMENT_DATE = bmodel.DOCUMENT_DATE;
            mStock.DOC_TYPE = bmodel.DOCUMENT_TYPE;
            mStock.DOC_NUMBER = Number(bmodel.DOCUMENT_NO).toString();
            mStock.EXT_NUMBER = 1;
            mStock.TRN_TYPE = $.Ctx.GetPageParam('medicine_usage_search', 'transaction_type');
            mStock.TRN_CODE = $.Ctx.GetPageParam('medicine_usage_search', 'transaction_code');
            mStock.CAL_TYPE = $.Ctx.GetPageParam('medicine_usage_search', 'cal_type');
            mStock.UNIT_LEVEL = model.FARM_ORG_LOC;
            mStock.STOCK_KEEPING_UNIT = ProductList.STOCK_KEEPING_UNIT;
            mStock.PRODUCT_STOCK_TYPE = bmodel.PRODUCT_STOCK_TYPE;
            mStock.PRODUCT_CODE = ProductList.PRODUCT_CODE;
            mStock.QUANTITY = Number(ProductList.QUANTITY);
            mStock.WEIGHT = Number(ProductList.WEIGHT);
            mStock.OWNER = $.Ctx.UserId;
            mStock.CREATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            mStock.LAST_UPDATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            mStock.FUNCTION = "U";
            mStock.WAREHOUSE_CODE = model.FARM_ORG;
            mStock.NUMBER_OF_SENDING_DATA = 0;
            var iCmdStock = mStock.updateCommand($.Ctx.DbConn);
            cmds.push(iCmdStock);

            mBalance.PRODUCT_CODE = ProductList.PRODUCT_CODE;
            if (ProductList.STOCK_KEEPING_UNIT != "W") {
                mBalance.QUANTITY = (-1 * Number(mStock.CAL_TYPE) * ProductList.QTY_OLD) + (Number(mStock.CAL_TYPE) * Number(ProductList.QUANTITY));
            } else {
                mBalance.QUANTITY = 0;
            }
            mBalance.WEIGHT = (-1 * Number(mStock.CAL_TYPE) * ProductList.WGH_OLD) + (Number(mStock.CAL_TYPE) * Number(ProductList.WEIGHT));
            mBalance.WAREHOUSE_CODE = $.Ctx.Warehouse;


            $.FarmCtx.SetStockBalance(mBalance, cmds, function () {
                Success(cmds);
            }, function (err) {
                $.Ctx.MsgBox("Err :" + err.message);
                Fail(err);
            });
        }

    };




});

$('#medicine_usage_detail').bind('pagebeforeshow', function (e) {
//    $.Ctx.SetPageParam('medicine_usage_search', 'product_stock_type','20');
//    $.Ctx.SetPageParam('medicine_usage_search', 'document_type','DCTYP75');
//    $.Ctx.SetPageParam('medicine_usage_search', 'transaction_type','2');
//    $.Ctx.SetPageParam('medicine_usage_search', 'transaction_code','25');
//    $.Ctx.SetPageParam('medicine_usage_search', 'cal_type','-1');

    initPage();
    persistToInput();
});


//declare global pageinit variable
var lkSelectTxt = null;

var mode = $.Ctx.GetPageParam('medicine_usage_detail', 'mode');

var model  ;
if ($.Ctx.Bu == "FARM_PIG")
    model = new HH_FR_MS_SWINE_MATERIAL();
else
    model = new HH_FR_MS_MATERIAL_STOCK(); 

var modelStock1 = new S1_ST_STOCK_TRN();
var modelStock2 = new S1_ST_STOCK_TRN();
var modelStock3 = new S1_ST_STOCK_TRN();
var modelStock4 = new S1_ST_STOCK_TRN();

var FeedUsageInput = new FR_FARM_ORG();
var ProductInput1 = new HH_PRODUCT_BU();
var ProductInput2 = new HH_PRODUCT_BU();
var ProductInput3 = new HH_PRODUCT_BU();
var ProductInput4 = new HH_PRODUCT_BU();

var ProductList = new Array();

function initPage() {
    mode = $.Ctx.GetPageParam('medicine_usage_detail', 'mode');

    model = $.Ctx.GetPageParam('medicine_usage_detail', 'model');
    if (model == null) {
        if ($.Ctx.Bu == "FARM_PIG")
            model = new HH_FR_MS_SWINE_MATERIAL();
        else
            model = new HH_FR_MS_MATERIAL_STOCK(); 

        model.ORG_CODE = $.Ctx.SubOp;
        model.FARM_ORG = $.Ctx.Warehouse;
        model.PRODUCT_STOCK_TYPE =  $.Ctx.GetPageParam('medicine_usage_search', 'product_stock_type');
        model.TOTAL_WT = 0;
        model.TOTAL_QTY =0;
    }

    modelStock1 = $.Ctx.GetPageParam('medicine_usage_detail', 'modelStock1');
    if (modelStock1 == null) {
        modelStock1 = new S1_ST_STOCK_TRN();
        modelStock1.ORG_CODE = $.Ctx.SubOp;
        modelStock1.FARM_ORG = $.Ctx.Warehouse;
    }
    modelStock2 = $.Ctx.GetPageParam('medicine_usage_detail', 'modelStock2');
    if (modelStock2 == null) {
        modelStock2 = new S1_ST_STOCK_TRN();
        modelStock2.ORG_CODE = $.Ctx.SubOp;
        modelStock2.FARM_ORG = $.Ctx.Warehouse;
    }
    modelStock3 = $.Ctx.GetPageParam('medicine_usage_detail', 'modelStock3');
    if (modelStock3 == null) {
        modelStock3 = new S1_ST_STOCK_TRN();
        modelStock3.ORG_CODE = $.Ctx.SubOp;
        modelStock3.FARM_ORG = $.Ctx.Warehouse;
    }
    modelStock4 = $.Ctx.GetPageParam('medicine_usage_detail', 'modelStock4');
    if (modelStock4 == null) {
        modelStock4 = new S1_ST_STOCK_TRN();
        modelStock4.ORG_CODE = $.Ctx.SubOp;
        modelStock4.FARM_ORG = $.Ctx.Warehouse;
    }

    //initialize;
    if (mode == 'new') {
        $('#medicine_usage_detail #lkFarmOrg').removeClass('ui-disabled');
        $('#medicine_usage_detail #lkProductId1').removeClass('ui-disabled');
        $('#medicine_usage_detail #Pro2').show();
        $('#medicine_usage_detail #Pro3').show();
        $('#medicine_usage_detail #Pro4').show();
        //$('#medicine_usage_detail #lkSwineId').attr('disabled', '');
    } else if (mode == 'edit') {
        $('#medicine_usage_detail #lkFarmOrg').addClass('ui-disabled');
        $('#medicine_usage_detail #lkProductId1').addClass('ui-disabled');
        $('#medicine_usage_detail #Pro2').hide();
        $('#medicine_usage_detail #Pro3').hide();
        $('#medicine_usage_detail #Pro4').hide();
        //$('#medicine_usage_detail #lkSwineId').attr('disabled', 'disabled');
    }
    //init lookup;
    FeedUsageInput = $.Ctx.GetPageParam('medicine_usage_detail', 'FeedUsageInput');
    if (FeedUsageInput != null) {
        model.FARM_ORG_LOC = FeedUsageInput.FARM_ORG;
        model.PIG_BALANCE = FeedUsageInput.PIG_BALANCE;
        model.MAX_DOCUMENT_NO = FeedUsageInput.MAX_DOCUMENT_NO;
        model.TOTAL_WT =FeedUsageInput.TOTAL_WT;
        model.TOTAL_QTY =FeedUsageInput.TOTAL_QTY;
    }
    ProductInput1 = $.Ctx.GetPageParam('medicine_usage_detail', 'ProductInput1');
    if (ProductInput1 != null) {
        modelStock1.PRODUCT_CODE = ProductInput1.PRODUCT_CODE ;
        modelStock1.QUOTA_WT = ProductInput1.WEIGHT ;
        modelStock1.QUOTA_QTY = ProductInput1.QUANTITY ;
        modelStock1.STOCK_KEEPING_UNIT = ProductInput1.STOCK_KEEPING_UNIT ;
        modelStock1.UNIT_PACK = ProductInput1.UNIT_PACK ;
        modelStock1.PRODUCT_SHORT_NAME = ProductInput1.PRODUCT_SHORT_NAME ;
    }
    ProductInput2 = $.Ctx.GetPageParam('medicine_usage_detail', 'ProductInput2');
    if (ProductInput2 != null) {
        modelStock2.PRODUCT_CODE = ProductInput2.PRODUCT_CODE ;
        modelStock2.QUOTA_WT = ProductInput2.WEIGHT ;
        modelStock2.QUOTA_QTY = ProductInput2.QUANTITY ;
        modelStock2.STOCK_KEEPING_UNIT = ProductInput2.STOCK_KEEPING_UNIT ;
        modelStock2.UNIT_PACK = ProductInput2.UNIT_PACK ;
        modelStock2.PRODUCT_SHORT_NAME = ProductInput2.PRODUCT_SHORT_NAME ;
    }
    ProductInput3 = $.Ctx.GetPageParam('medicine_usage_detail', 'ProductInput3');
    if (ProductInput3 != null) {
        modelStock3.PRODUCT_CODE = ProductInput3.PRODUCT_CODE
        modelStock3.QUOTA_WT = ProductInput3.WEIGHT ;
        modelStock3.QUOTA_QTY = ProductInput3.QUANTITY ;
        modelStock3.STOCK_KEEPING_UNIT = ProductInput3.STOCK_KEEPING_UNIT ;
        modelStock3.UNIT_PACK = ProductInput3.UNIT_PACK ;
        modelStock3.PRODUCT_SHORT_NAME = ProductInput3.PRODUCT_SHORT_NAME ;
    }
    ProductInput4 = $.Ctx.GetPageParam('medicine_usage_detail', 'ProductInput4');
    if (ProductInput4 != null) {
        modelStock4.PRODUCT_CODE = ProductInput4.PRODUCT_CODE
        modelStock4.QUOTA_WT = ProductInput4.WEIGHT ;
        modelStock4.QUOTA_QTY = ProductInput4.QUANTITY ;
        modelStock4.STOCK_KEEPING_UNIT = ProductInput4.STOCK_KEEPING_UNIT ;
        modelStock4.UNIT_PACK = ProductInput4.UNIT_PACK ;
        modelStock4.PRODUCT_SHORT_NAME = ProductInput4.PRODUCT_SHORT_NAME ;
    }


    if(modelStock1.STOCK_KEEPING_UNIT == "W" ){
        modelStock1.QUANTITY = null;
        modelStock1.QUOTA_QTY = null;
        $('#medicine_usage_detail #txtProQty1').addClass('ui-disabled');
        $('#medicine_usage_detail #txtProQty1').val("");
    }else{
        $('#medicine_usage_detail #txtProQty1').removeClass('ui-disabled');

    }

    if(modelStock2.STOCK_KEEPING_UNIT == "W" ){
        modelStock2.QUANTITY = null;
        modelStock2.QUOTA_QTY = null;
        $('#medicine_usage_detail #txtProQty2').addClass('ui-disabled');
        $('#medicine_usage_detail #txtProQty2').val("");
    }else{
        $('#medicine_usage_detail #txtProQty2').removeClass('ui-disabled');
    }

    if(modelStock3.STOCK_KEEPING_UNIT == "W" ){
        modelStock3.QUANTITY = null;
        modelStock3.QUOTA_QTY = null;
        $('#medicine_usage_detail #txtProQty3').addClass('ui-disabled');
        $('#medicine_usage_detail #txtProQty3').val("");
    }else {
        $('#medicine_usage_detail #txtProQty3').removeClass('ui-disabled');
    }

    if(modelStock4.STOCK_KEEPING_UNIT == "W" ){
        modelStock4.QUANTITY = null;
        modelStock4.QUOTA_QTY = null;
        $('#medicine_usage_detail #txtProQty4').addClass('ui-disabled');
        $('#medicine_usage_detail #txtProQty4').val("");
    }else{
        $('#medicine_usage_detail #txtProQty4').removeClass('ui-disabled');
    }


}
var temp;
//persist model to input
function persistToInput() {
    if (!IsNullOrEmpty(model.FARM_ORG_LOC)) {
        $('#medicine_usage_detail #lkFarmOrg span span:first').text(model.FARM_ORG_LOC);
    } else {
        $('#medicine_usage_detail #lkFarmOrg span span:first').text(lkSelectTxt);
    }
    if (!IsNanOrNullOrEmpty(model.PIG_BALANCE)) {
        $('#medicine_usage_detail #txtPigBal').val(model.PIG_BALANCE);
    } else {
        $('#medicine_usage_detail #txtPigBal').val("");
    }
    if (!IsNanOrNullOrEmpty(model.TOTAL_QTY)) {
        $('#medicine_usage_detail #txtTotalQty').val(model.TOTAL_QTY);
    } else {
        $('#medicine_usage_detail #txtTotalQty').val(0);
    }
    if (!IsNanOrNullOrEmpty(model.TOTAL_WT)) {
        $('#medicine_usage_detail #txtTotalWt').val(model.TOTAL_WT);
    } else {
        $('#medicine_usage_detail #txtTotalWt').val(0);
    }

    if (!IsNullOrEmpty(modelStock1.PRODUCT_SHORT_NAME)) {
        $('#medicine_usage_detail #lkProductId1 span span:first').text(modelStock1.PRODUCT_SHORT_NAME);
    } else {
        $('#medicine_usage_detail #lkProductId1 span span:first').text(lkSelectTxt);
    }
    if (!IsNanOrNullOrEmpty(modelStock1.QUANTITY)) {
        $('#medicine_usage_detail #txtProQty1').val(modelStock1.QUANTITY);
    } else {
        $('#medicine_usage_detail #txtProQty1').val("");
    }
    if (!IsNanOrNullOrEmpty(modelStock1.WEIGHT)) {
        $('#medicine_usage_detail #txtProWt1').val(modelStock1.WEIGHT);
    } else {
        $('#medicine_usage_detail #txtProWt1').val("");
    }
    if (!IsNanOrNullOrEmpty(modelStock1.QUOTA_QTY)) {
        $('#medicine_usage_detail #lblQtyBal1').text(modelStock1.QUOTA_QTY);
    } else {
        $('#medicine_usage_detail #lblQtyBal1').text("");
    }
    if (!IsNanOrNullOrEmpty(modelStock1.QUOTA_WT)) {
        $('#medicine_usage_detail #lblWtBal1').text(modelStock1.QUOTA_WT);
    } else {
        $('#medicine_usage_detail #lblWtBal1').text("");
    }



    if (!IsNullOrEmpty(modelStock2.PRODUCT_SHORT_NAME)) {
        $('#medicine_usage_detail #lkProductId2 span span:first').text(modelStock2.PRODUCT_SHORT_NAME);
    } else {
        $('#medicine_usage_detail #lkProductId2 span span:first').text(lkSelectTxt);
    }
    if (!IsNanOrNullOrEmpty(modelStock2.QUANTITY)) {
        $('#medicine_usage_detail #txtProQty2').val(modelStock2.QUANTITY);
    } else {
        $('#medicine_usage_detail #txtProQty2').val("");
    }
    if (!IsNanOrNullOrEmpty(modelStock2.WEIGHT)) {
        $('#medicine_usage_detail #txtProWt2').val(modelStock2.WEIGHT);
    } else {
        $('#medicine_usage_detail #txtProWt2').val("");
    }
    if (!IsNanOrNullOrEmpty(modelStock2.QUOTA_QTY)) {
        $('#medicine_usage_detail #lblQtyBal2').text(modelStock2.QUOTA_QTY);
    } else {
        $('#medicine_usage_detail #lblQtyBal2').text("");
    }
    if (!IsNanOrNullOrEmpty(modelStock2.QUOTA_WT)) {
        $('#medicine_usage_detail #lblWtBal2').text(modelStock2.QUOTA_WT);
    } else {
        $('#medicine_usage_detail #lblWtBal2').text("");
    }



    if (!IsNullOrEmpty(modelStock3.PRODUCT_SHORT_NAME)) {
        $('#medicine_usage_detail #lkProductId3 span span:first').text(modelStock3.PRODUCT_SHORT_NAME);
    } else {
        $('#medicine_usage_detail #lkProductId3 span span:first').text(lkSelectTxt);
    }
    if (!IsNanOrNullOrEmpty(modelStock3.QUANTITY)) {
        $('#medicine_usage_detail #txtProQty3').val(modelStock3.QUANTITY);
    } else {
        $('#medicine_usage_detail #txtProQty3').val("");
    }
    if (!IsNanOrNullOrEmpty(modelStock3.WEIGHT)) {
        $('#medicine_usage_detail #txtProWt3').val(modelStock3.WEIGHT);
    } else {
        $('#medicine_usage_detail #txtProWt3').val("");
    }
    if (!IsNanOrNullOrEmpty(modelStock3.QUOTA_QTY)) {
        $('#medicine_usage_detail #lblQtyBal3').text(modelStock3.QUOTA_QTY);
    } else {
        $('#medicine_usage_detail #lblQtyBal3').text("");
    }
    if (!IsNanOrNullOrEmpty(modelStock3.QUOTA_WT)) {
        $('#medicine_usage_detail #lblWtBal3').text(modelStock3.QUOTA_WT);
    } else {
        $('#medicine_usage_detail #lblWtBal3').text("");
    }

    if (!IsNullOrEmpty(modelStock4.PRODUCT_SHORT_NAME)) {
        $('#medicine_usage_detail #lkProductId4 span span:first').text(modelStock4.PRODUCT_SHORT_NAME);
    } else {
        $('#medicine_usage_detail #lkProductId4 span span:first').text(lkSelectTxt);
    }
    if (!IsNanOrNullOrEmpty(modelStock4.QUANTITY)) {
        $('#medicine_usage_detail #txtProQty4').val(modelStock4.QUANTITY);
    } else {
        $('#medicine_usage_detail #txtProQty4').val("");
    }
    if (!IsNanOrNullOrEmpty(modelStock4.WEIGHT)) {
        $('#medicine_usage_detail #txtProWt4').val(modelStock4.WEIGHT);
    } else {
        $('#medicine_usage_detail #txtProWt4').val("");
    }
    if (!IsNanOrNullOrEmpty(modelStock4.QUOTA_QTY)) {
        $('#medicine_usage_detail #lblQtyBal4').text(modelStock4.QUOTA_QTY);
    } else {
        $('#medicine_usage_detail #lblQtyBal4').text("");
    }
    if (!IsNanOrNullOrEmpty(modelStock4.QUOTA_WT)) {
        $('#medicine_usage_detail #lblWtBal4').text(modelStock4.QUOTA_WT);
    } else {
        $('#medicine_usage_detail #lblWtBal4').text("");
    }

    $('#medicine_usage_detail #txtTotalQty').val(TotalQty());
    $('#medicine_usage_detail #txtTotalWt').val(TotalWt());

}

//retrieve input to model
function retrieveFromInput() {
    var txt;
    txt = $('#medicine_usage_detail #lkFarmOrg span').text();
    if (txt != lkSelectTxt && FeedUsageInput != null) {
        model.FARM_ORG_LOC = FeedUsageInput.FARM_ORG;
        model.PIG_BALANCE = FeedUsageInput.PIG_BALANCE;
        model.STD_USAGE = FeedUsageInput.STD_USAGE;
    }

    txt = $('#medicine_usage_detail #lkProductId1 span').text();
    if (txt != lkSelectTxt && ProductInput1 != null) {
        modelStock1.PRODUCT_CODE = ProductInput1.PRODUCT_CODE;
    }
    if ( typeof($('#medicine_usage_detail #txtProQty1').val()) != 'undefined'  ){
        modelStock1.QUANTITY = $('#medicine_usage_detail #txtProQty1').val();
    }
    if ( typeof($('#medicine_usage_detail #txtProWt1').val()) != 'undefined'  ){
        modelStock1.WEIGHT = $('#medicine_usage_detail #txtProWt1').val();
    }

    txt = $('#medicine_usage_detail #lkProductId2 span').text();
    if (txt != lkSelectTxt && ProductInput2 != null) {
        modelStock2.PRODUCT_CODE = ProductInput2.PRODUCT_CODE;
    }
    if ( typeof($('#medicine_usage_detail #txtProQty2').val()) != 'undefined'  ){
        modelStock2.QUANTITY = $('#medicine_usage_detail #txtProQty2').val();
    }
    if ( typeof($('#medicine_usage_detail #txtProWt2').val()) != 'undefined'  ){
        modelStock2.WEIGHT = $('#medicine_usage_detail #txtProWt2').val();
    }

    txt = $('#medicine_usage_detail #lkProductId3 span').text();
    if (txt != lkSelectTxt && ProductInput3 != null) {
        modelStock3.PRODUCT_CODE = ProductInput3.PRODUCT_CODE;
    }
    if ( typeof($('#medicine_usage_detail #txtProQty3').val()) != 'undefined'  ){
        modelStock3.QUANTITY = $('#medicine_usage_detail #txtProQty3').val();
    }
    if ( typeof($('#medicine_usage_detail #txtProWt3').val()) != 'undefined'  ){
        modelStock3.WEIGHT = $('#medicine_usage_detail #txtProWt3').val();
    }
    txt = $('#medicine_usage_detail #lkProductId4 span').text();
    if (txt != lkSelectTxt && ProductInput4 != null) {
        modelStock4.PRODUCT_CODE = ProductInput4.PRODUCT_CODE;
    }
    if ( typeof($('#medicine_usage_detail #txtProQty4').val()) != 'undefined'  ){
        modelStock4.QUANTITY = $('#medicine_usage_detail #txtProQty4').val();
    }
    if ( typeof($('#medicine_usage_detail #txtProWt4').val()) != 'undefined'  ){
        modelStock4.WEIGHT = $('#medicine_usage_detail #txtProWt4').val();
    }

    $.Ctx.SetPageParam('medicine_usage_detail', 'model', model);
    $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock1', modelStock1);
    $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock2', modelStock2);
    $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock3', modelStock3);
    $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock4', modelStock4);

    $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput1', ProductInput1);
    $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput2', ProductInput2);
    $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput3', ProductInput3);
    $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput4', ProductInput4);


}

var scanCode = function() {
    window.plugins.barcodeScanner.scan(
        function(result) {
            $.Ctx.MsgBox("Scanned Code: " + result.text
                + ". Format: " + result.format
                + ". Cancelled: " + result.cancelled);
        }, function(error) {
            $.Ctx.MsgBox("Scan failed: " + error);
        });
    }

    function navigateLookupPage(calledResult, productCodeStr) {
        var p = new LookupParam();
        p.calledPage = 'medicine_usage_detail';
        p.calledResult = calledResult; 
        $.Ctx.SetPageParam('lookup_medicine_usage', 'param', p);
        $.Ctx.SetPageParam('lookup_medicine_usage', 'Previous', 'medicine_usage_detail');
        $.Ctx.SetPageParam('lookup_medicine_usage', 'transaction_type', $.Ctx.GetPageParam('medicine_usage_search', 'transaction_type'));
        $.Ctx.SetPageParam('lookup_medicine_usage', 'product_stock_type', $.Ctx.GetPageParam('medicine_usage_search', 'product_stock_type'));
        $.Ctx.SetPageParam('lookup_medicine_usage', 'ProductCode', productCodeStr);
        $.Ctx.SetPageParam('lookup_medicine_usage', 'selectedFarmOrgCode', model.FARM_ORG_LOC);
        $.Ctx.NavigatePage('lookup_medicine_usage', null, { transition: 'slide', action: 'reverse' }, false);
    }