$('#feed_usage_search').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('feed_usage_search');
    $.Ctx.RenderFooter('feed_usage_search');
});
var cmds = new Array();

$('#feed_usage_search').bind('pageshow', function (e) {
    var PageParam = $.Ctx.GetPageParam('feed_usage_search', 'param');
    $.Ctx.SetPageParam('feed_usage_search', 'product_stock_type', PageParam['product_stock_type']);
    $.Ctx.SetPageParam('feed_usage_search', 'document_type', PageParam['document_type']);
    $.Ctx.SetPageParam('feed_usage_search', 'transaction_type', PageParam['transaction_type']);
    $.Ctx.SetPageParam('feed_usage_search', 'transaction_code', PageParam['transaction_code']);
    $.Ctx.SetPageParam('feed_usage_search', 'cal_type', PageParam['cal_type']);

    //    $.Ctx.SetPageParam('feed_usage_search', 'product_stock_type','10');
    //    $.Ctx.SetPageParam('feelppokd_usage_search', 'document_type','DCTYP75');
    //    $.Ctx.SetPageParam('feed_usage_search', 'transaction_type','2');
    //    $.Ctx.SetPageParam('feed_usage_search', 'transaction_code','25');
    //    $.Ctx.SetPageParam('feed_usage_search', 'cal_type','-1');

    var dSource = new Array();
    $('#feed_usage_search a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('feed_usage_search', 'Previous'), null, { transition: 'slide', action: 'reverse' });
    });

    $('#feed_usage_search #btnNew').click(function (e) {
        $.Ctx.SetPageParam('feed_usage_search', 'mode', 'new');
        var model;
        if ($.Ctx.Bu == "FARM_PIG")
            model = new HH_FR_MS_SWINE_MATERIAL();
        else
            model = new HH_FR_MS_MATERIAL_STOCK();

        model.ORG_CODE = $.Ctx.SubOp;
        model.FARM_ORG = $.Ctx.Warehouse;
        model.PRODUCT_STOCK_TYPE = $.Ctx.GetPageParam('feed_usage_search', 'product_stock_type');
        $.Ctx.PageParam['feed_usage_detail'] = null;
        $.Ctx.SetPageParam('feed_usage_detail', 'mode', 'new');
        $.Ctx.SetPageParam('feed_usage_detail', 'model', model);
        $.Ctx.SetPageParam('feed_usage_detail', 'Previous', 'feed_usage_search');
        $.Ctx.NavigatePage('feed_usage_detail', null, { transition: 'slide', action: 'reverse' });
    });

    findData();
    function findData() {
        $('#feed_usage_search #totalSearch').html("");
        $('#feed_usage_search #lstView').empty();

        var cmd = $.Ctx.DbConn.createSelectCommand();
        var sqlStr = '';
        if ($.Ctx.Bu == "FARM_PIG") {
            sqlStr = "SELECT MAT.ORG_CODE, MAT.FARM_ORG, MAT.FARM_ORG_LOC, MAT.TRANSACTION_DATE, MAT.DOCUMENT_TYPE, MAT.DOCUMENT_NO, SUM (MAT.QTY) AS QTY, SUM (MAT.WGH) AS WGH, MAT.PRODUCT_STOCK_TYPE, MAT.NUMBER_OF_SENDING_DATA, GROUP_CONCAT (IFNULL (PRO.PRODUCT_NAME, ''), '|') AS PRODUCT_NAME, GROUP_CONCAT (IFNULL (MAT.QTY, ' '), '|') AS PRODUCT_QTY, GROUP_CONCAT (IFNULL (MAT.WGH, ' '), '|') AS PRODUCT_WGH, GROUP_CONCAT (IFNULL (PRO.STOCK_KEEPING_UNIT, 'Q'), '|') AS STOCK_KEEPING_UNIT, FMORG.NAME_LOC, FMORG.NAME_ENG FROM HH_FR_MS_SWINE_MATERIAL MAT LEFT OUTER JOIN HH_PRODUCT_BU PRO ON PRO.PRODUCT_CODE = MAT.PRODUCT_CODE AND PRO.BUSINESS_UNIT = ? LEFT OUTER JOIN FR_FARM_ORG FMORG ON FMORG.ORG_CODE = MAT.ORG_CODE AND FMORG.FARM_ORG = MAT.FARM_ORG_LOC WHERE     MAT.ORG_CODE = ? AND MAT.FARM_ORG = ? AND MAT.TRANSACTION_DATE = ? AND MAT.PRODUCT_STOCK_TYPE = ? GROUP BY MAT.ORG_CODE, MAT.FARM_ORG, MAT.FARM_ORG_LOC, MAT.TRANSACTION_DATE, MAT.DOCUMENT_TYPE, MAT.DOCUMENT_NO, MAT.PRODUCT_STOCK_TYPE, MAT.NUMBER_OF_SENDING_DATA, FMORG.NAME_LOC, FMORG.NAME_ENG ORDER BY MAT.FARM_ORG, MAT.TRANSACTION_DATE DESC"
        }
        else {
            //Poultry User HH_FR_MS_MATERIAL_STOCK
            sqlStr = " SELECT ORG_CODE, FARM_ORG, FARM_ORG_LOC, TRANSACTION_DATE, DOCUMENT_TYPE, DOCUMENT_NO,  SUM(QTY) AS QTY , SUM(WGH) AS WGH, ";
            sqlStr += " PRODUCT_STOCK_TYPE,NUMBER_OF_SENDING_DATA ";
            sqlStr += " FROM HH_FR_MS_MATERIAL_STOCK ";
            sqlStr += " WHERE  ORG_CODE = ? AND FARM_ORG = ? AND TRANSACTION_DATE  = ? AND PRODUCT_STOCK_TYPE = ? ";
            sqlStr += " GROUP BY ORG_CODE, FARM_ORG, FARM_ORG_LOC, TRANSACTION_DATE, DOCUMENT_TYPE, DOCUMENT_NO, PRODUCT_STOCK_TYPE, NUMBER_OF_SENDING_DATA ";
            sqlStr += " ORDER BY FARM_ORG ";
        }

        cmd.sqlText = sqlStr;
        if ($.Ctx.Bu == "FARM_PIG")
            cmd.parameters.push($.Ctx.Bu);
        cmd.parameters.push($.Ctx.SubOp);
        cmd.parameters.push($.Ctx.Warehouse);
        cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
        cmd.parameters.push($.Ctx.GetPageParam('feed_usage_search', 'product_stock_type'));
        cmd.executeReader(function (tx, res) {
            if (res.rows.length != 0) {
                dSource = new Array();
                for (var i = 0; i < res.rows.length; i++) {
                    var m;
                    if ($.Ctx.Bu == "FARM_PIG")
                        m = new HH_FR_MS_SWINE_MATERIAL();
                    else
                        m = new HH_FR_MS_MATERIAL_STOCK();

                    m.retrieveRdr(res.rows.item(i));
                    if ($.Ctx.Bu == "FARM_PIG") {
                        m.PRODUCT_NAME = res.rows.item(i).PRODUCT_NAME;
                        m.NAME_ENG = res.rows.item(i).NAME_ENG;
                        m.NAME_LOC = res.rows.item(i).NAME_LOC;
                        m.PRODUCT_QTY = res.rows.item(i).PRODUCT_QTY;
                        m.PRODUCT_WGH = res.rows.item(i).PRODUCT_WGH;
                        m.STOCK_KEEPING_UNIT = res.rows.item(i).STOCK_KEEPING_UNIT;
                    }
                    dSource.push(m);
                }
                populateListView(dSource);
            }
        }, function (err) {
            $.Ctx.MsgBox(err.message);
        });
    }

    function populateListView(p) {

        var SumQty = 0;
        var SumWt = 0;
        var isKeepingUnitAllQ = false;
        for (var i = 0; i < p.length; i++) {
            var m;
            if ($.Ctx.Bu == "FARM_PIG")
                m = new HH_FR_MS_SWINE_MATERIAL();
            else
                m = HH_FR_MS_MATERIAL_STOCK();

            m = p[i];


            SumQty = SumQty + Number(m.QTY);
            SumWt = SumWt + Number(m.WGH);

            var code = '';

            if ($.Ctx.Bu == "FARM_PIG") {
                code = m.FARM_ORG;
                if (m.PRODUCT_NAME == null) {
                    m.PRODUCT_NAME = "";
                }
                var productNameList = m.PRODUCT_NAME.split('|');
                var productQty = m.PRODUCT_QTY.split('|');
                var productWgh = m.PRODUCT_WGH.split('|');
                var productKeepingUnit = m.STOCK_KEEPING_UNIT.split('|');
                //            var productName = m.PRODUCT_NAME.replace('|','\n');

                if ($.Ctx.lang == "en-US") {
                    code = code + " " + m.NAME_ENG;
                } else {
                    code = code + " " + m.NAME_LOC;
                }

                var totalQTY = $.Ctx.Lcl('feed_usage_search', 'msgQty', 'Qty: {0}').format([m.QTY]);
                var totalWGH = $.Ctx.Lcl('feed_usage_search', 'msgWt', 'Wt: {0}').format([m.WGH]);
                if (totalQTY == null || totalQTY == undefined) {
                    totalQTY = ''
                }
                if (totalWGH == null || totalWGH == undefined) {
                    totalWGH = ''
                }
            }
            else {
                code = m.FARM_ORG_LOC;
            }



            var s = '<li  data-swipeurl="#" data-icon="false"><a id="{0}" data-tag="lst_item" {1}  >'.format(['lki-' + i, "data-id='" + i + "'"]);

            if ($.Ctx.Bu == "FARM_PIG")
                s += '<p class="lki_code"><h3>{0}</h3></p>'.format([code]);
            else
                s += '<p class="lki_code"><h3>Farm {0}</h3></p>'.format([code]);

            s += '<span class="ui-li-count">{0}</span>'.format([parseDbDateStr(m.TRANSACTION_DATE).toUIShortDateStr()]);

            if ($.Ctx.Bu == "FARM_PIG") {
                var ShowProduct = new Array();
                var isKeepingUnitQ = false;
                for (var ii = 0; ii < productNameList.length; ii++) {
                    ShowProduct[ii] = productNameList[ii];
                    if (productQty.length > ii) {
                        if (productKeepingUnit[ii] == 'Q') {
                            ShowProduct[ii] = ShowProduct[ii] + " " + $.Ctx.Lcl('feed_usage_search', 'msgQty', 'Qty: {0}').format([productQty[ii]]);
                            isKeepingUnitQ = true;
                            isKeepingUnitAllQ = true;
                        }

                        if (productWgh.length > ii) {
                            ShowProduct[ii] = ShowProduct[ii] + " " + $.Ctx.Lcl('feed_usage_search', 'msgWt', 'Wt: {0}').format([productWgh[ii]]);
                        }
                    }
                }
                var TotalSum = "";
                if (isKeepingUnitQ == true) {
                    TotalSum = totalQTY + " " + totalWGH;
                } else {
                    TotalSum = totalWGH;
                }


                if (ShowProduct.length > 0)
                    s += '<p><strong class="lki_name">{0}</strong></p>'.format([ShowProduct[0]]);
                if (ShowProduct.length > 1)
                    s += '<p><strong class="lki_name">{0}</strong></p>'.format([ShowProduct[1]]);
                if (ShowProduct.length > 2)
                    s += '<p><strong class="lki_name">{0}</strong></p>'.format([ShowProduct[2]]);

                s += '<p><strong class="lki_name">{0}</strong></p>'.format([TotalSum]);
            }
            else {
                //Poultry show only QTY , WGH
                s += '<p><strong class="lki_name">Qty: {0} Wt: {1}</strong></p>'.format([m.QTY, m.WGH]);
            }
            s += '</a></li>';

            $('#feed_usage_search #lstView').append(s);
        }
        $('#feed_usage_search #lstView').listview('refresh');



        var totalSumQTY = $.Ctx.Lcl('feed_usage_search', 'msgQty', 'Qty:{0}').format([accounting.formatNumber(Number(SumQty), 0, ",")]);
        var totalSumWGH = $.Ctx.Lcl('feed_usage_search', 'msgWt', 'Wt:{0}').format([accounting.formatNumber(Number(SumWt), 2, ",")]);

        var TotalSumAll = "";
        if (isKeepingUnitAllQ == true) {
            TotalSumAll = totalSumQTY + " " + totalSumWGH;
        } else {
            TotalSumAll = totalSumWGH;
        }

        if (!_.isEmpty(TotalSumAll)) {
            $('#feed_usage_search #totalSearch').html($.Ctx.Lcl('iFarm', 'msgTotalPetong', 'Total : {0}').format([TotalSumAll]));
        }


        $('#feed_usage_search #lstView li').swipeDelete({
            btnTheme: 'r',
            btnLabel: 'Delete',
            btnClass: 'aSwipeButton',
            click: function (e) {
                e.stopPropagation();
                e.preventDefault();

                var dataId = $(this).parents('li').find('a[data-tag="lst_item"]').attr('data-id');

                cmds = new Array();
                var m;
                if ($.Ctx.Bu == "FARM_PIG")
                    m = new HH_FR_MS_SWINE_MATERIAL();
                else
                    m = new HH_FR_MS_MATERIAL_STOCK();

                var uCmd = $.Ctx.DbConn.createSelectCommand();
                m = dSource[dataId];
                if (m.NUMBER_OF_SENDING_DATA == 0) {
                    var strFeedUse = '';

                    strFeedUse = "DELETE FROM {0} WHERE  ORG_CODE = ? AND FARM_ORG = ? AND FARM_ORG_LOC = ? AND TRANSACTION_DATE = ? AND DOCUMENT_TYPE = ? AND DOCUMENT_NO = ? AND PRODUCT_STOCK_TYPE = ? ".format([$.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK'])

                    var cmdFeedUse = $.Ctx.DbConn.createSelectCommand();
                    cmdFeedUse.parameters.push(m.ORG_CODE);
                    cmdFeedUse.parameters.push(m.FARM_ORG);
                    cmdFeedUse.parameters.push(m.FARM_ORG_LOC);
                    cmdFeedUse.parameters.push(m.TRANSACTION_DATE);
                    cmdFeedUse.parameters.push(m.DOCUMENT_TYPE);
                    cmdFeedUse.parameters.push(m.DOCUMENT_NO);
                    cmdFeedUse.parameters.push($.Ctx.GetPageParam('feed_usage_search', 'product_stock_type'));
                    cmdFeedUse.sqlText = strFeedUse;
                    cmds.push(cmdFeedUse);


                    var strStock = "DELETE FROM S1_ST_STOCK_TRN  WHERE COMPANY = ? AND OPERATION = ? AND SUB_OPERATION = ? AND BUSINESS_UNIT = ? AND DOC_TYPE = ? AND DOC_NUMBER = ?"
                    var cmdStock = $.Ctx.DbConn.createSelectCommand();
                    cmdStock.parameters.push($.Ctx.ComCode);
                    cmdStock.parameters.push($.Ctx.Op);
                    cmdStock.parameters.push($.Ctx.SubOp);
                    cmdStock.parameters.push($.Ctx.Bu);
                    cmdStock.parameters.push(m.DOCUMENT_TYPE);
                    cmdStock.parameters.push(m.DOCUMENT_NO);
                    cmdStock.sqlText = strStock;
                    cmds.push(cmdStock);

                    var strBal = "SELECT STOCK.STOCK_KEEPING_UNIT, STOCK.QUANTITY AS STOCK_QTY, STOCK.WEIGHT AS STOCK_WT, BAL.* FROM    S1_ST_STOCK_TRN STOCK LEFT OUTER JOIN S1_ST_STOCK_BALANCE BAL ON STOCK.COMPANY = BAL.COMPANY AND STOCK.OPERATION = BAL.OPERATION AND STOCK.SUB_OPERATION = BAL.SUB_OPERATION AND STOCK.BUSINESS_UNIT = BAL.BUSINESS_UNIT AND BAL.WAREHOUSE_CODE = ? AND BAL.SUB_WAREHOUSE_CODE = 'NA' AND BAL.PRODUCT_CODE = STOCK.PRODUCT_CODE AND BAL.PRODUCT_SPEC = '0000-0000-0000' AND BAL.LOT_NUMBER = '00' AND BAL.SUB_LOT_NUMBER = 'NA' AND BAL.SERIAL_NO = 'NA' AND BAL.PRODUCTION_DATE = 'NA' AND BAL.EXPIRE_DATE = 'NA' AND BAL.RECEIVED_DATE = 'NA' WHERE     STOCK.COMPANY = ? AND STOCK.OPERATION = ? AND STOCK.SUB_OPERATION = ? AND STOCK.BUSINESS_UNIT = ? AND STOCK.DOC_TYPE = ? AND STOCK.DOC_NUMBER = ?";

                    var cmdBal = $.Ctx.DbConn.createSelectCommand();
                    cmdBal.sqlText = strBal;
                    cmdBal.parameters.push($.Ctx.Warehouse);
                    cmdBal.parameters.push($.Ctx.ComCode);
                    cmdBal.parameters.push($.Ctx.Op);
                    cmdBal.parameters.push($.Ctx.SubOp);
                    cmdBal.parameters.push($.Ctx.Bu);
                    cmdBal.parameters.push(m.DOCUMENT_TYPE);
                    cmdBal.parameters.push(m.DOCUMENT_NO);
                    cmdBal.executeReader(function (tx, res) {
                        for (var i = 0; i < res.rows.length; i++) {
                            if (res.rows.length != 0) {
                                var modelBal = new S1_ST_STOCK_BALANCE();
                                modelBal.retrieveRdr(res.rows.item(i));
                                modelBal.STOCK_QTY = res.rows.item(i).STOCK_QTY
                                modelBal.STOCK_WT = res.rows.item(i).STOCK_WT
                                modelBal.STOCK_KEEPING_UNIT = res.rows.item(i).STOCK_KEEPING_UNIT
                                if (modelBal.STOCK_KEEPING_UNIT != "W") {
                                    modelBal.QUANTITY = Number(modelBal.QUANTITY) + Number(modelBal.STOCK_QTY);
                                }
                                modelBal.WEIGHT = Number(modelBal.WEIGHT) + Number(modelBal.STOCK_WT);

                                var dCmdBal = modelBal.updateCommand($.Ctx.DbConn);
                                cmds.push(dCmdBal);
                            }

                        }

                        var tran = new DbTran($.Ctx.DbConn);
                        tran.executeNonQuery(cmds,
                            function (tx, res) {
                                var li = $("#feed_usage_search ul").children()[dataId];
                                //$(li).slideUp();
                                //$(li).remove();
                                //$('#feed_usage_search #lstView').listview('refresh');
                                findData();
                            }, function (err) {
                                $.Ctx.MsgBox("Err :" + err.message);
                            });
                    }, function (err) {
                        $.Ctx.MsgBox("Error " + err.message);
                    });
                } else {
                    $.Ctx.MsgBox($.Ctx.Lcl('feed_usage_search', 'msgCannotDeleteItem', "Cannot Delete this item"));
                }


            }
        });



        $('#feed_usage_search a[data-tag="lst_item"]').click(function (e) {
            var dataId = $(this).attr('data-id');
            var m = dSource[dataId];
            var cmd = $.Ctx.DbConn.createSelectCommand();
            var str = " SELECT LOCATION FROM FR_FARM_ORG {0} ".format([' WHERE ORG_CODE = "' + $.Ctx.SubOp + '" AND FARM_ORG = "' + $.Ctx.Warehouse + '"  ']);
            cmd.sqlText = str;
            cmd.executeReader(function (tx, res) {
                if (res.rows.length != 0) {
                    var cmd2 = $.Ctx.DbConn.createSelectCommand();
                    var cmdUsage = $.Ctx.DbConn.createSelectCommand();
                    m.LOCATION = res.rows.item(0).LOCATION;
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
                    cmdMaxDoc.sqlText = "SELECT MAX(MAT.DOCUMENT_NO+0) AS MAX_DOCUMENT_NO FROM {0} MAT WHERE     MAT.ORG_CODE = ? AND MAT.FARM_ORG = ? AND MAT.FARM_ORG_LOC = ? AND MAT.PRODUCT_STOCK_TYPE = ? AND MAT.DOCUMENT_TYPE = ?".format([$.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
                    cmdMaxDoc.parameters.push($.Ctx.SubOp);
                    cmdMaxDoc.parameters.push($.Ctx.Warehouse);
                    cmdMaxDoc.parameters.push(m.FARM_ORG_LOC);
                    cmdMaxDoc.parameters.push($.Ctx.GetPageParam('feed_usage_search', 'product_stock_type'));
                    cmdMaxDoc.parameters.push($.Ctx.GetPageParam('feed_usage_search', 'document_type'));

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



                                    var cmd3 = $.Ctx.DbConn.createSelectCommand();
                                    cmd3.sqlText = "SELECT A.*, B.PRODUCT_SHORT_NAME, B.PRODUCT_NAME, BAL.QUANTITY AS QUOTA_QTY, BAL.WEIGHT AS QUOTA_WT FROM S1_ST_STOCK_TRN A LEFT OUTER JOIN HH_PRODUCT_BU B ON B.BUSINESS_UNIT = ? AND A.PRODUCT_CODE = B.PRODUCT_CODE LEFT OUTER JOIN S1_ST_STOCK_BALANCE BAL ON     B.PRODUCT_CODE = BAL.PRODUCT_CODE AND A.COMPANY = BAL.COMPANY AND A.OPERATION = BAL.OPERATION AND A.SUB_OPERATION = BAL.SUB_OPERATION AND A.BUSINESS_UNIT = BAL.BUSINESS_UNIT AND BAL.WAREHOUSE_CODE = ? WHERE     A.COMPANY = ? AND A.OPERATION = ? AND A.SUB_OPERATION = ? AND A.BUSINESS_UNIT = ? AND A.DOC_TYPE = ? AND A.DOC_NUMBER = ?"
                                    cmd3.parameters.push($.Ctx.Bu);
                                    cmd3.parameters.push($.Ctx.Warehouse)
                                    cmd3.parameters.push($.Ctx.ComCode);
                                    cmd3.parameters.push($.Ctx.Op);
                                    cmd3.parameters.push($.Ctx.SubOp);
                                    cmd3.parameters.push($.Ctx.Bu);
                                    cmd3.parameters.push(m.DOCUMENT_TYPE);
                                    cmd3.parameters.push(m.DOCUMENT_NO);
                                    cmd3.executeReader(function (tx, res) {
                                        if (res.rows.length != 0) {
                                            var modelStock1 = new S1_ST_STOCK_TRN();
                                            var modelStock2 = new S1_ST_STOCK_TRN();
                                            var modelStock3 = new S1_ST_STOCK_TRN();
                                            modelStock1.retrieveRdr(res.rows.item(0));
                                            modelStock1.PRODUCT_SHORT_NAME = res.rows.item(0).PRODUCT_SHORT_NAME;
                                            modelStock1.PRODUCT_NAME = res.rows.item(0).PRODUCT_NAME;
                                            modelStock1.QUOTA_QTY = res.rows.item(0).QUOTA_QTY;
                                            modelStock1.QUOTA_WT = res.rows.item(0).QUOTA_WT;

                                            if (res.rows.item(0).PRODUCT_SHORT_NAME == null)
                                                modelStock1.PRODUCT_SHORT_NAME = modelStock1.PRODUCT_NAME

                                            modelStock1.PRODUCT_SHORT_NAME = modelStock1.PRODUCT_SHORT_NAME + " (" + modelStock1.STOCK_KEEPING_UNIT + ") ";
                                            if (res.rows.length >= 2) {
                                                modelStock2.retrieveRdr(res.rows.item(1));
                                                modelStock2.PRODUCT_SHORT_NAME = res.rows.item(1).PRODUCT_SHORT_NAME;
                                                modelStock2.PRODUCT_NAME = res.rows.item(1).PRODUCT_NAME;
                                                modelStock2.QUOTA_QTY = res.rows.item(1).QUOTA_QTY;
                                                modelStock2.QUOTA_WT = res.rows.item(1).QUOTA_WT;

                                                if (res.rows.item(1).PRODUCT_SHORT_NAME == null)
                                                    modelStock2.PRODUCT_SHORT_NAME = modelStock2.PRODUCT_NAME

                                                modelStock2.PRODUCT_SHORT_NAME = modelStock2.PRODUCT_SHORT_NAME + " (" + modelStock2.STOCK_KEEPING_UNIT + ") ";

                                                if (res.rows.length >= 3) {
                                                    modelStock3.retrieveRdr(res.rows.item(2));
                                                    modelStock3.PRODUCT_SHORT_NAME = res.rows.item(2).PRODUCT_SHORT_NAME;
                                                    modelStock3.PRODUCT_NAME = res.rows.item(2).PRODUCT_NAME;
                                                    modelStock3.QUOTA_QTY = res.rows.item(2).QUOTA_QTY;
                                                    modelStock3.QUOTA_WT = res.rows.item(2).QUOTA_WT;

                                                    if (res.rows.item(2).PRODUCT_SHORT_NAME == null)
                                                        modelStock3.PRODUCT_SHORT_NAME = modelStock3.PRODUCT_NAME

                                                    modelStock3.PRODUCT_SHORT_NAME = modelStock3.PRODUCT_SHORT_NAME + " (" + modelStock3.STOCK_KEEPING_UNIT + ") ";
                                                }
                                            }
                                            $.Ctx.PageParam['feed_usage_detail'] = null;
                                            $.Ctx.SetPageParam('feed_usage_detail', 'mode', 'edit');
                                            $.Ctx.SetPageParam('feed_usage_detail', 'model', m);
                                            $.Ctx.SetPageParam('feed_usage_detail', 'modelStock1', modelStock1);
                                            $.Ctx.SetPageParam('feed_usage_detail', 'modelStock2', modelStock2);
                                            $.Ctx.SetPageParam('feed_usage_detail', 'modelStock3', modelStock3);
                                            $.Ctx.SetPageParam('feed_usage_detail', 'Previous', 'feed_usage_search');
                                            $.FarmCtx.Poultry_SearchFarmOrgByCode(m.FARM_ORG_LOC, function (ret) {
                                                $.Ctx.SetPageParam('feed_usage_detail', 'presetFarmOrg', ret[0]);
                                                $.Ctx.NavigatePage('feed_usage_detail', null, { transition: 'slide' });
                                            });

                                        }
                                        else {
                                            $.Ctx.MsgBox($.Ctx.Lcl('feed_usage_search', 'msgStockTranNotFound', "Stock Tran product of farm is not found in database"));
                                        }
                                    }, function (err) {
                                        $.Ctx.MsgBox("Error stock tran.  " + err.message);
                                    });
                                }, function (err) {
                                    $.Ctx.MsgBox("Error calculate max doc " + err.message);
                                });
                            }, function (err) {
                                $.Ctx.MsgBox("Error standard usage " + err.message);
                            });
                        }
                        else {
                            $.Ctx.MsgBox($.Ctx.Lcl('feed_usage_search', 'msgProductNotFound', "Standard product of farm is not found in database"));
                        }
                    }, function (err) {
                        $.Ctx.MsgBox("Error product " + err.message);
                    });

                } else {
                    $.Ctx.MsgBox($.Ctx.Lcl('feed_usage_search', 'msgCannotFindFarm', 'Cannot find farm {0} {1} {2} ').format([m.ORG_CODE, m.FARM_ORG, m.FARM_ORG_LOC]));
                }

            }, function (err) {
                $.Ctx.MsgBox("Error find farm " + err.message);
            }
            );

        });

    }
});


