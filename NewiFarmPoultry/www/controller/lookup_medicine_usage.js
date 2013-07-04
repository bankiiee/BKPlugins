$('#lookup_medicine_usage').bind('pagebeforecreate', function (e) {
//    var ProductStockType = $.Ctx.GetPageParam('lookup_medicine_usage', 'product_stock_type');
//    var DocumentType = $.Ctx.GetPageParam('lookup_medicine_usage', 'document_type');
//    if(ProductStockType == "20"){
//        $("#lookup_medicine_usage #captionHeader").attr("data-lang","headerMedicineUsage");
//    }else if(ProductStockType == "56"){
//        if (DocumentType == "DCTYP75" ){
//            $("#lookup_medicine_usage #captionHeader").attr("data-lang","headerSemenUsage");
//        }else if(DocumentType == "DCTYP61" ){
//            $("#lookup_medicine_usage #captionHeader").attr("data-lang","headerProduceSemen");
//        }
//    }
    $.Util.RenderUiLang('lookup_medicine_usage');
});

var dSource = null;
$('#lookup_medicine_usage').bind('pageinit', function (e) {
    var captionHeader =  $.Ctx.GetPageParam('lookup_medicine_usage', 'captionHeader');
    $("#lookup_medicine_usage #captionHeader").text($.Ctx.Lcl('lookup_medicine_usage', captionHeader, 'Usage Information'));
    $('#lookup_medicine_usage a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('lookup_medicine_usage', 'Previous'), null, { transition: 'slide', reverse:true });
    });

    $('#lookup_medicine_usage #lstView').listview('option', 'filterCallback',
        function (text, searchString) {
            var lText = text.toLowerCase();
            if (lText.indexOf('*') !== -1) { return false };
            if (lText.indexOf(searchString) !== -1) { return false };
            return true;
        });

    $('#lookup_medicine_usage #lstView').bind('listviewbeforefilter',
        function (e, data) {
            var $input = $(data.input);
            var filterText = $input.val();
            populateListView(dSource, filterText, false);
        });

    $('#lookup_medicine_usage #div-showall').click(function (e) {
        var $input = $('#lookup_boar input[data-type="search"]');
        var filterText = $input.val();
        populateListView(dSource, filterText, true);
    });
});

$('#lookup_medicine_usage').bind('pagebeforeshow', function (e) {
    // s is where statement
    var s = $.Ctx.GetPageParam('lookup_medicine_usage', 'ProductCode');
    var TransactionType = $.Ctx.GetPageParam('lookup_medicine_usage', 'transaction_type');
    var ProductStockType = $.Ctx.GetPageParam('lookup_medicine_usage', 'product_stock_type');
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var str;
    if (TransactionType == null) {
        TransactionType = 2;
    }
    if (TransactionType != 1) {


        if (IsNullOrEmpty(s)) {
            str = " SELECT A.PRODUCT_CODE, A.PRODUCT_NAME, A.PRODUCT_SHORT_NAME,A.STOCK_KEEPING_UNIT,A.UNIT_PACK,B.QUANTITY,B.WEIGHT FROM HH_PRODUCT_BU A LEFT OUTER JOIN S1_ST_STOCK_BALANCE B ON B.PRODUCT_CODE = A.PRODUCT_CODE AND A.BUSINESS_UNIT = B.BUSINESS_UNIT  WHERE  A.BUSINESS_UNIT = ? AND A.PRODUCT_STOCK_TYPE = ? AND  B.COMPANY = ? AND B.OPERATION = ? AND B.SUB_OPERATION = ?  AND B.WAREHOUSE_CODE = ? AND A.PRODUCT_CODE IN ( SELECT  PRODUCT_CODE FROM {0} WHERE ORG_CODE = ? AND FARM_ORG = ?) ORDER BY A.PRODUCT_CODE ".format([$.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
        } else {
            str = " SELECT A.PRODUCT_CODE, A.PRODUCT_NAME, A.PRODUCT_SHORT_NAME,A.STOCK_KEEPING_UNIT,A.UNIT_PACK,B.QUANTITY,B.WEIGHT FROM HH_PRODUCT_BU A LEFT OUTER JOIN S1_ST_STOCK_BALANCE B ON B.PRODUCT_CODE = A.PRODUCT_CODE AND A.BUSINESS_UNIT = B.BUSINESS_UNIT   WHERE   A.BUSINESS_UNIT = ? AND A.PRODUCT_STOCK_TYPE = ? AND  B.COMPANY = ? AND B.OPERATION = ? AND B.SUB_OPERATION = ?   AND B.WAREHOUSE_CODE = ? AND A.PRODUCT_CODE IN ( SELECT  PRODUCT_CODE FROM {1} WHERE ORG_CODE = ? AND FARM_ORG = ?) AND A.PRODUCT_CODE NOT IN ( {0} ) ORDER BY A.PRODUCT_CODE ".format([s, $.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
        }

        cmd.parameters.push($.Ctx.Bu);
        cmd.parameters.push(ProductStockType);
        cmd.parameters.push($.Ctx.ComCode);
        cmd.parameters.push($.Ctx.Op);
        cmd.parameters.push($.Ctx.SubOp);
        if ($.Ctx.Bu == "FARM_PIG")
            cmd.parameters.push($.Ctx.Warehouse);
        else
            cmd.parameters.push($.Ctx.GetPageParam('lookup_medicine_usage','selectedFarmOrgCode'));
        cmd.parameters.push($.Ctx.SubOp);
        if ($.Ctx.Bu == "FARM_PIG")
            cmd.parameters.push($.Ctx.Warehouse);
        else
            cmd.parameters.push($.Ctx.GetPageParam('lookup_medicine_usage', 'selectedFarmOrgCode'));

    } else {

        if (IsNullOrEmpty(s)) {
            str = " SELECT A.PRODUCT_CODE, A.PRODUCT_NAME, (CASE WHEN A.PRODUCT_SHORT_NAME IS NULL THEN A.PRODUCT_NAME ELSE A.PRODUCT_SHORT_NAME END) AS PRODUCT_SHORT_NAME, A.STOCK_KEEPING_UNIT, A.UNIT_PACK, B.QUANTITY, B.WEIGHT FROM    HH_PRODUCT_BU A LEFT OUTER JOIN S1_ST_STOCK_BALANCE B ON     B.PRODUCT_CODE = A.PRODUCT_CODE AND A.BUSINESS_UNIT = B.BUSINESS_UNIT AND B.COMPANY = ? AND B.OPERATION = ? AND B.SUB_OPERATION = ? AND B.WAREHOUSE_CODE =? WHERE A.BUSINESS_UNIT = ? AND A.PRODUCT_STOCK_TYPE = ? AND A.PRODUCT_CODE IN (SELECT PRODUCT_CODE FROM {0} WHERE ORG_CODE = ? AND FARM_ORG = ?) ORDER BY A.PRODUCT_CODE  ".format([$.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
        } else {
            str = " SELECT A.PRODUCT_CODE, A.PRODUCT_NAME, (CASE WHEN A.PRODUCT_SHORT_NAME IS NULL THEN A.PRODUCT_NAME ELSE A.PRODUCT_SHORT_NAME END) AS PRODUCT_SHORT_NAME, A.STOCK_KEEPING_UNIT, A.UNIT_PACK, B.QUANTITY, B.WEIGHT FROM    HH_PRODUCT_BU A LEFT OUTER JOIN S1_ST_STOCK_BALANCE B ON     B.PRODUCT_CODE = A.PRODUCT_CODE AND A.BUSINESS_UNIT = B.BUSINESS_UNIT AND B.COMPANY = ? AND B.OPERATION = ? AND B.SUB_OPERATION = ? AND B.WAREHOUSE_CODE =? WHERE A.BUSINESS_UNIT = ? AND A.PRODUCT_STOCK_TYPE = ? AND A.PRODUCT_CODE IN (SELECT PRODUCT_CODE FROM {1} WHERE ORG_CODE = ? AND FARM_ORG = ?) AND A.PRODUCT_CODE NOT IN ({0}) ORDER BY A.PRODUCT_CODE ".format([s, $.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
        }

        cmd.parameters.push($.Ctx.ComCode);
        cmd.parameters.push($.Ctx.Op);
        cmd.parameters.push($.Ctx.SubOp);
        if ($.Ctx.Bu == "FARM_PIG")
            cmd.parameters.push($.Ctx.Warehouse);
        else
            cmd.parameters.push($.Ctx.GetPageParam('lookup_medicine_usage', 'selectedFarmOrgCode'));
        cmd.parameters.push($.Ctx.Bu);
        cmd.parameters.push(ProductStockType);
        cmd.parameters.push($.Ctx.SubOp);
        if ($.Ctx.Bu == "FARM_PIG")
            cmd.parameters.push($.Ctx.Warehouse);
        else
            cmd.parameters.push($.Ctx.GetPageParam('lookup_medicine_usage', 'selectedFarmOrgCode'));
    }

    cmd.sqlText = str;
    cmd.executeReader(function (tx, res) {
        dSource = new Array();
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_PRODUCT_BU();
                m.retrieveRdr(res.rows.item(i));
                m.QUANTITY = Number(res.rows.item(i).QUANTITY);
                m.WEIGHT = Number(res.rows.item(i).WEIGHT);
                if (m.PRODUCT_SHORT_NAME == null)
                    m.PRODUCT_SHORT_NAME = res.rows.item(i).PRODUCT_NAME + " (" + res.rows.item(i).STOCK_KEEPING_UNIT + " )";
                else
                    m.PRODUCT_SHORT_NAME = res.rows.item(i).PRODUCT_SHORT_NAME + " (" + res.rows.item(i).STOCK_KEEPING_UNIT + " )";

                dSource.push(m);
            }
        }
        var cmd2 = $.Ctx.DbConn.createSelectCommand();
        var str2;
        if (TransactionType != 1) {
            if (IsNullOrEmpty(s)) {
                str2 = " SELECT A.PRODUCT_CODE,  A.PRODUCT_NAME, (CASE WHEN  A.PRODUCT_SHORT_NAME IS NULL THEN A.PRODUCT_NAME ELSE A.PRODUCT_SHORT_NAME END ) AS PRODUCT_SHORT_NAME ,A.STOCK_KEEPING_UNIT,A.UNIT_PACK,B.QUANTITY,B.WEIGHT FROM HH_PRODUCT_BU A LEFT OUTER JOIN    S1_ST_STOCK_BALANCE B ON B.PRODUCT_CODE = A.PRODUCT_CODE AND A.BUSINESS_UNIT = B.BUSINESS_UNIT  WHERE A.BUSINESS_UNIT = ? AND A.PRODUCT_STOCK_TYPE = ? AND  B.COMPANY = ? AND B.OPERATION = ? AND B.SUB_OPERATION = ?  AND B.WAREHOUSE_CODE = ? AND A.PRODUCT_CODE NOT IN (SELECT  PRODUCT_CODE FROM {0} WHERE ORG_CODE = ? AND FARM_ORG = ? ) ORDER BY A.PRODUCT_CODE ".format([$.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
            } else {
                str2 = " SELECT A.PRODUCT_CODE, A.PRODUCT_NAME,  (CASE WHEN  A.PRODUCT_SHORT_NAME IS NULL THEN A.PRODUCT_NAME ELSE A.PRODUCT_SHORT_NAME END ) AS PRODUCT_SHORT_NAME ,A.STOCK_KEEPING_UNIT,A.UNIT_PACK,B.QUANTITY,B.WEIGHT FROM HH_PRODUCT_BU A LEFT OUTER JOIN    S1_ST_STOCK_BALANCE B ON B.PRODUCT_CODE = A.PRODUCT_CODE AND A.BUSINESS_UNIT = B.BUSINESS_UNIT  WHERE A.BUSINESS_UNIT = ? AND A.PRODUCT_STOCK_TYPE = ? AND  B.COMPANY = ? AND B.OPERATION = ? AND B.SUB_OPERATION = ?  AND B.WAREHOUSE_CODE = ? AND A.PRODUCT_CODE NOT IN (SELECT  PRODUCT_CODE FROM {1} WHERE ORG_CODE = ? AND FARM_ORG = ? ) AND A.PRODUCT_CODE NOT IN ( {0} )  ORDER BY A.PRODUCT_CODE ".format([s, $.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
            }
            cmd2.parameters.push($.Ctx.Bu);
            cmd2.parameters.push(ProductStockType);
            cmd2.parameters.push($.Ctx.ComCode);
            cmd2.parameters.push($.Ctx.Op);
            cmd2.parameters.push($.Ctx.SubOp);
            if ($.Ctx.Bu == "FARM_PIG")
                cmd2.parameters.push($.Ctx.Warehouse);
            else
                cmd2.parameters.push($.Ctx.GetPageParam('lookup_medicine_usage', 'selectedFarmOrgCode'));
            cmd2.parameters.push($.Ctx.SubOp);
            if ($.Ctx.Bu == "FARM_PIG")
                cmd2.parameters.push($.Ctx.Warehouse);
            else
                cmd2.parameters.push($.Ctx.GetPageParam('lookup_medicine_usage', 'selectedFarmOrgCode'));
        } else {
            if (IsNullOrEmpty(s)) {
                str2 = " SELECT A.PRODUCT_CODE, A.PRODUCT_NAME, (CASE WHEN A.PRODUCT_SHORT_NAME IS NULL THEN A.PRODUCT_NAME ELSE A.PRODUCT_SHORT_NAME END) AS PRODUCT_SHORT_NAME, A.STOCK_KEEPING_UNIT, A.UNIT_PACK, B.QUANTITY, B.WEIGHT FROM    HH_PRODUCT_BU A LEFT OUTER JOIN S1_ST_STOCK_BALANCE B ON     B.PRODUCT_CODE = A.PRODUCT_CODE AND A.BUSINESS_UNIT = B.BUSINESS_UNIT AND B.COMPANY = ? AND B.OPERATION = ? AND B.SUB_OPERATION = ? AND B.WAREHOUSE_CODE =? WHERE A.BUSINESS_UNIT = ? AND A.PRODUCT_STOCK_TYPE = ? AND A.PRODUCT_CODE NOT IN (SELECT PRODUCT_CODE FROM {0} WHERE ORG_CODE = ? AND FARM_ORG = ?) ORDER BY A.PRODUCT_CODE  ".format([$.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
            } else {
                str2 = " SELECT A.PRODUCT_CODE, A.PRODUCT_NAME, (CASE WHEN A.PRODUCT_SHORT_NAME IS NULL THEN A.PRODUCT_NAME ELSE A.PRODUCT_SHORT_NAME END) AS PRODUCT_SHORT_NAME, A.STOCK_KEEPING_UNIT, A.UNIT_PACK, B.QUANTITY, B.WEIGHT FROM    HH_PRODUCT_BU A LEFT OUTER JOIN S1_ST_STOCK_BALANCE B ON     B.PRODUCT_CODE = A.PRODUCT_CODE AND A.BUSINESS_UNIT = B.BUSINESS_UNIT AND B.COMPANY = ? AND B.OPERATION = ? AND B.SUB_OPERATION = ? AND B.WAREHOUSE_CODE =? WHERE A.BUSINESS_UNIT = ? AND A.PRODUCT_STOCK_TYPE = ? AND A.PRODUCT_CODE NOT IN (SELECT PRODUCT_CODE FROM {1} WHERE ORG_CODE = ? AND FARM_ORG = ?) AND A.PRODUCT_CODE NOT IN ({0}) ORDER BY A.PRODUCT_CODE ".format([s, $.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
            }
            cmd2.parameters.push($.Ctx.ComCode);
            cmd2.parameters.push($.Ctx.Op);
            cmd2.parameters.push($.Ctx.SubOp);
            if ($.Ctx.Bu == "FARM_PIG")
                cmd2.parameters.push($.Ctx.Warehouse);
            else
                cmd2.parameters.push($.Ctx.GetPageParam('lookup_medicine_usage', 'selectedFarmOrgCode'));
            cmd2.parameters.push($.Ctx.Bu);
            cmd2.parameters.push(ProductStockType);
            cmd2.parameters.push($.Ctx.SubOp);
            if ($.Ctx.Bu == "FARM_PIG")
                cmd2.parameters.push($.Ctx.Warehouse);
            else
                cmd2.parameters.push($.Ctx.GetPageParam('lookup_medicine_usage', 'selectedFarmOrgCode'));
        }
        cmd2.sqlText = str2;
        cmd2.executeReader(function (tx, res) {
            if (res.rows.length != 0) {
                for (var i = 0; i < res.rows.length; i++) {
                    var m = new HH_PRODUCT_BU();
                    m.retrieveRdr(res.rows.item(i));
                    m.QUANTITY = Number(res.rows.item(i).QUANTITY);
                    m.WEIGHT = Number(res.rows.item(i).WEIGHT);
                    if (m.PRODUCT_SHORT_NAME == null)
                        m.PRODUCT_SHORT_NAME = res.rows.item(i).PRODUCT_NAME + " (" + res.rows.item(i).STOCK_KEEPING_UNIT + " )";
                    else
                        m.PRODUCT_SHORT_NAME = res.rows.item(i).PRODUCT_SHORT_NAME + " (" + res.rows.item(i).STOCK_KEEPING_UNIT + " )";
                    dSource.push(m);
                }
            }
            populateListView(dSource, null, false);
        }, function (err) {
            $.Ctx.MsgBox(err.message);
        });
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
});

function populateListView(p, filterText, isShowAll) {
    $('#lookup_medicine_usage #lstView').empty();
    var showCount = filterCount = 0;
    var maxShowCount = isShowAll==true?p.length:$.Ctx.CustomPageSize;

    for (var i = 0; i < p.length; i++) {
        var m = p[i];
        //            var desc = m.NAME_ENG;
        //            if ($.Ctx.Lang != 'en-US') {
        //                desc = m.NAME_LOC;
        //            }
        var txt1 = $.Ctx.Nvl(m.PRODUCT_CODE, "");
        var txt2 = $.Ctx.Nvl(m.PRODUCT_SHORT_NAME, "");
        var s = '<li data-icon="false"><a id="{0}" data-tag="lst_item" {1}  >'.format(['lki-' + i, "data-id='" + i + "'"]);
        s += '<p class="lki_name"><h3>{0}</h3></p>'.format([m.PRODUCT_CODE]);
        s += '<p><strong class="lki_code">{0}</strong></p>'.format([m.PRODUCT_SHORT_NAME]);
        var labelBalQtyWt = $.Ctx.Lcl('lookup_medicine_usage', 'labelBalQtyWt', 'Balance Stock Qty: {0} Wt: {1}').format([m.QUANTITY, m.WEIGHT])
        s += '<p class="lki_code">{0}</p>'.format([labelBalQtyWt]);
        s += '</a></li>';
        if (!IsNullOrEmpty(filterText)) {
            if (txt1.contains(filterText) || txt2.contains(filterText)) {
                filterCount += 1;
                if (showCount <= maxShowCount) {
                    $('#lookup_medicine_usage #lstView').append(s);
                    showCount += 1;
                }
            }
        } else {
            filterCount += 1;
            if (showCount <= maxShowCount) {
                $('#lookup_medicine_usage #lstView').append(s);
                showCount += 1;
            }
        }
    }
    $('#lookup_medicine_usage #lstView').listview('refresh');

    $('#lookup_medicine_usage a[data-tag="lst_item"]').click(function (e) {
        var ind = $(this).attr('data-id');
        var param = new LookupParam();
        param = $.Ctx.GetPageParam('lookup_medicine_usage', 'param');
        $.Ctx.SetPageParam(param.calledPage, param.calledResult, dSource[ind]);
        $.Ctx.NavigatePage(param.calledPage, null, { transition:'slide' });
    });

    if (!IsNullOrEmpty(filterText))
        $('#lookup_medicine_usage #captionHeader').html($.Ctx.Lcl('lookup_medicine_usage', 'headMedicineInfoFilter', '({0}/{1})Medicine Information').format([filterCount, p.length]));
    else
        $('#lookup_medicine_usage #captionHeader').html($.Ctx.Lcl('lookup_medicine_usage', 'headMedicineInfo', '({0})Medicine Information').format([p.length]));

    if (filterCount==showCount)
        $('#lookup_medicine_usage #div-showall').hide();
    else
        $('#lookup_medicine_usage #div-showall').show();
}


