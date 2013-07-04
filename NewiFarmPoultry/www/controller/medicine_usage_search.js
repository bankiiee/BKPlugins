var clickAlias = "click";

$("#medicine_usage_search").bind("pageinit", function (event) {
    var captionHeader = $.Ctx.GetPageParam('medicine_usage_search', 'captionHeader');
    $("#medicine_usage_search #captionHeader").text($.Ctx.Lcl('medicine_usage_search', captionHeader, 'Usage Information'));


    $('#medicine_usage_search #btnNew').click(function (e) {
        var model;
        if ($.Ctx.Bu == "FARM_PIG")
            model = new HH_FR_MS_SWINE_MATERIAL();
        else
            model = new HH_FR_MS_MATERIAL_STOCK(); 

        model.ORG_CODE = $.Ctx.SubOp;
        model.FARM_ORG = $.Ctx.Warehouse;
        $.Ctx.PageParam['medicine_usage_detail'] = null;
        $.Ctx.SetPageParam('medicine_usage_detail', 'ScrollingTo', null);
        $.Ctx.SetPageParam('medicine_usage_detail', 'mode', 'new');
        $.Ctx.SetPageParam('medicine_usage_detail', 'model', model);
        $.Ctx.SetPageParam('medicine_usage_detail', 'FeedUsageInput', null);
        $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput1', null);
        $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput2', null);
        $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput3', null);
        $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput4', null);

        $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock1', null);
        $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock2', null);
        $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock3', null);
        $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock4', null);
        $.Ctx.SetPageParam('medicine_usage_detail', 'Previous', 'medicine_usage_search');
        $.Ctx.NavigatePage('medicine_usage_detail', null, { transition: 'slide', action: 'reverse' });
    });

    $('#medicine_usage_search a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('medicine_usage_search', 'Previous'), null, { transition: 'slide', action: 'reverse' });
    });
});

$('#medicine_usage_search').bind("pagebeforecreate", function (e) {
    var PageParam = $.Ctx.GetPageParam('medicine_usage_search','param');
    $.Ctx.SetPageParam('medicine_usage_search', 'product_stock_type',PageParam['product_stock_type']);
    $.Ctx.SetPageParam('medicine_usage_search', 'document_type',PageParam['document_type']);
    $.Ctx.SetPageParam('medicine_usage_search', 'transaction_type', PageParam['transaction_type']);
    $.Ctx.SetPageParam('medicine_usage_search', 'transaction_code',PageParam['transaction_code']);
    $.Ctx.SetPageParam('medicine_usage_search', 'cal_type',PageParam['cal_type']);
    $.Ctx.SetPageParam('medicine_usage_search', 'captionHeader',PageParam['captionHeader'])

    $.Util.RenderUiLang('medicine_usage_search');
    $.Ctx.RenderFooter('medicine_usage_search');
});

$("#medicine_usage_search").bind("pagebeforeshow", function (event) {
    console.log("pagebeforeshow");
    BindDataFarmOrgLoc();
});

function BindDataFarmOrgLoc(SuccessCB){

    $('#medicine_usage_search #totalSearch').html('');
    $("#medicine_usage_search #collaps-content").empty();
    SearchFarmOrgLoc(function(farms){
        if (farms==null) return false;
        $('#collaps-content').empty();
        var  lblQty = $.Ctx.Lcl('medicine_usage_search','msgQty','QTY'),
            lblWgh = $.Ctx.Lcl('medicine_usage_search','msgWgh','WGH');
        $.each(farms, function(i,obj){
            var s ='<div data-role="collapsible" data-theme="c" data-content-theme="c" id="Farm'+ obj.FARM_ORG_LOC + '">';
            s +='<h4>';
            s +='<div class="ui-grid-a" style="font-size:small;">';
            s +='	<div class="ui-block-a" style="text-align:left;width:30%">{0} {1}</div>'.format([obj.FARM_ORG_LOC,obj.FARM_NAME]);
            s +='	<div class="ui-block-b" style="float:right;text-align:right;">';
            s +='		{0}:{1}, {2}:{3} '.format([lblQty, accounting.formatNumber(obj.S_QTY,0,",") , lblWgh, accounting.formatNumber(obj.S_WGH,2,",") ]);
            s +='	</div>' ;
            s +='</div>' ;
            s +='</h4>';
            s +='<ul id="Farm'+ obj.FARM_ORG_LOC + '-content"  data-role="listview" data-inset="true" data-filter="true"> </ul>';
            s += '</div>';
            $('#collaps-content').append(s);
        });
        $("div[data-role='collapsible']").collapsible({refresh:true});

        $("div[id^='Farm']").bind( "expand", function(event, ui) {
            var id = $(this).attr('id');
            var content = id + '-content';
            var farmOrgLoc = id.replace('Farm','');
            BindListDetailProduct(content, farmOrgLoc);
            return false;
        });
        if (typeof SuccessCB=='function') SuccessCB(true);
    });
}

function BindListDetailProduct(parentId, farmOrgLoc){
    $('#medicine_usage_search #'+ parentId).empty();
    SearchProduct(farmOrgLoc, function (farms) {

        var lblQty = $.Ctx.Lcl('medicine_usage_search', 'lblQty', 'QTY'),
            lblWgh = $.Ctx.Lcl('medicine_usage_search', 'lblWt', 'WGH');
        if (farms == null) return false;

        for (var i = 0; i < farms.length; i++) {
            var key = farms[i].FARM_ORG + '|' + farms[i].FARM_ORG_LOC + '|' + farms[i].PRODUCT_STOCK_TYPE + '|' + farms[i].TRANSACTION_DATE;
            key += '|' + farms[i].DOCUMENT_TYPE + '|' + farms[i].DOCUMENT_NO + '|' + farms[i].DOCUMENT_EXT + '|' + farms[i].PRODUCT_CODE;
            key += '|' + farms[i].QTY + '|' + farms[i].WGH;
            var noSd = (farms[i].NUMBER_OF_SENDING_DATA == null ? 0 : farms[i].NUMBER_OF_SENDING_DATA);

            var html = '<li code="' + key + '" data-swipeurl="#" noSd="' + noSd + '">';
            html += '<a href="#">';
            html += '<h4>' + farms[i].PRODUCT_SHORT_NAME + '</h4>';
            var qty = (farms[i].QTY == null ? 0 : farms[i].QTY);
            var wgh = (farms[i].WGH == null ? 0 : farms[i].WGH);
            html += '<p><strong>{0}{1} {2}{3} </strong></p>'.format([lblQty, accounting.formatNumber(qty, 0, ","), lblWgh, accounting.formatNumber(wgh, 2, ",")]);
            html += '<div class="ui-li-count">' + parseDbDateStr(farms[i].TRANSACTION_DATE).toUIShortDateStr() + '</div>';
            html += '</a>';
            html += '</li>';
            $("#medicine_usage_search #" + parentId).append(html);
        }
        $("#medicine_usage_search #" + parentId).listview();
        $("#medicine_usage_search #" + parentId).listview('refresh');

        $("#medicine_usage_search #" + parentId + ' li').swipeDelete({
            btnTheme: 'r',
            btnLabel: 'Delete',
            btnClass: 'aSwipeButton',
            click: function (e) {
                e.stopPropagation();
                e.preventDefault();
                var noSend = $(this).parents('li').attr('noSd');
                if (noSend == "0") {
                    var keyCode = $(this).parents('li').attr('code');
                    var keys = keyCode.split('|');
                    if (keys.length == 10) {
                        DeleteUsage(keys[0], keys[1], keys[2], keys[3], keys[4], keys[5], keys[6], keys[7], keys[8], keys[9], function (succ) {
                            if (succ == true) {
                                //$.Ctx.MsgBox('Delete Success');
                                BindDataFarmOrgLoc(function (succ) {
                                    var coll = parentId.replace('-content', '');
                                    $("#medicine_usage_search #" + coll).trigger("expand");
                                });
                            }
                        });
                    }
                } else {
                    $.Ctx.MsgBox($.Ctx.Lcl('medicine_usage_search', 'msgCannotDeleteItem', 'Cannot delete this item'));
                }
            }
        });

        $("#medicine_usage_search #" + parentId + ' li').bind(clickAlias, function () {
            ClearParamPage();
            var noSend = $(this).attr("noSd");
            var keyCode = $(this).attr("code");
            var keys = keyCode.split('|');



            var cmdFarmOrg = $.Ctx.DbConn.createSelectCommand();
            cmdFarmOrg.sqlText = " SELECT A.*, B.PRODUCT_NAME, B.PRODUCT_SHORT_NAME, B.STOCK_KEEPING_UNIT, B.UNIT_PACK, B.PRODUCT_STOCK_TYPE FROM    {0} A LEFT OUTER JOIN HH_PRODUCT_BU B ON A.PRODUCT_CODE = B.PRODUCT_CODE AND B.BUSINESS_UNIT = ? WHERE     A.ORG_CODE = ? AND A.FARM_ORG = ? AND A.FARM_ORG_LOC = ? AND A.PRODUCT_STOCK_TYPE = ? AND A.TRANSACTION_DATE = ? AND A.DOCUMENT_TYPE = ? AND A.DOCUMENT_NO = ? AND A.DOCUMENT_EXT = ? ORDER BY A.FARM_ORG_LOC ".format([$.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
            cmdFarmOrg.parameters.push($.Ctx.Bu);
            cmdFarmOrg.parameters.push($.Ctx.SubOp);
            cmdFarmOrg.parameters.push(keys[0]);
            cmdFarmOrg.parameters.push(keys[1]);
            cmdFarmOrg.parameters.push(keys[2]);
            cmdFarmOrg.parameters.push(keys[3]);
            cmdFarmOrg.parameters.push(keys[4]);
            cmdFarmOrg.parameters.push(keys[5]);
            cmdFarmOrg.parameters.push(keys[6]);


            cmdFarmOrg.executeReader(function (tx, res) {
                if (res.rows.length != 0) {
                    var m  ;
                    if ($.Ctx.Bu == "FARM_PIG") 
                        m = new HH_FR_MS_SWINE_MATERIAL();
                    else
                        m = new HH_FR_MS_MATERIAL_STOCK(); 
                    
                    m.retrieveRdr(res.rows.item(0));
                    m.PRODUCT_NAME = res.rows.item(0).PRODUCT_NAME;
                    m.UNIT_PACK = res.rows.item(0).UNIT_PACK;
                    m.PRODUCT_STOCK_TYPE = res.rows.item(0).PRODUCT_STOCK_TYPE;
                    m.STOCK_KEEPING_UNIT = res.rows.item(0).STOCK_KEEPING_UNIT;
                    if (res.rows.item(0).PRODUCT_SHORT_NAME == null)
                        m.PRODUCT_SHORT_NAME = res.rows.item(0).PRODUCT_NAME + " (" + res.rows.item(0).STOCK_KEEPING_UNIT + " )";
                    else
                        m.PRODUCT_SHORT_NAME = res.rows.item(0).PRODUCT_SHORT_NAME + " (" + res.rows.item(0).STOCK_KEEPING_UNIT + " )";

                    DirectDetailPage(m);
                }
            }, function (err) {
                $.Ctx.MsgBox(err.message);
            });


        });
    });
}

function DirectDetailPage(m){

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = " SELECT LOCATION FROM FR_FARM_ORG {0} ".format([' WHERE ORG_CODE = "' + $.Ctx.SubOp + '" AND FARM_ORG = "' + m.FARM_ORG_LOC +    '"  ']);
    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            var cmd2 = $.Ctx.DbConn.createSelectCommand();
            var cmdUsage = $.Ctx.DbConn.createSelectCommand();

            if (res.rows.item(0).LOCATION != null)
                m.LOCATION = res.rows.item(0).LOCATION.toString();


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
            cmdMaxDoc.sqlText = "SELECT MAX (MAT.DOCUMENT_NO +0) AS MAX_DOCUMENT_NO FROM {0} MAT WHERE MAT.ORG_CODE = ?".format([$.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
            cmdMaxDoc.parameters.push($.Ctx.SubOp);

            var cmdTotal = $.Ctx.DbConn.createSelectCommand();
            cmdTotal.sqlText = "SELECT SUM (WGH) AS TOTAL_WT, SUM (QTY) AS TOTAL_QTY FROM {0} WHERE ORG_CODE = ? AND FARM_ORG =? and FARM_ORG_LOC = ? AND PRODUCT_STOCK_TYPE = ? AND DOCUMENT_TYPE = ? AND DOCUMENT_NO <> ? AND TRANSACTION_DATE = ?".format([$.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
            cmdTotal.parameters.push($.Ctx.SubOp);
            cmdTotal.parameters.push($.Ctx.Warehouse);
            cmdTotal.parameters.push(m.FARM_ORG_LOC);
            cmdTotal.parameters.push($.Ctx.GetPageParam('medicine_usage_search', 'product_stock_type'));
            cmdTotal.parameters.push(m.DOCUMENT_TYPE);
            cmdTotal.parameters.push(m.DOCUMENT_NO);
            cmdTotal.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
            console.log(cmd2.sqlText);
            console.log(cmd2.parameters);
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

                        cmdTotal.executeReader(function (tx, res) {
                            if (res.rows.item(0).TOTAL_WT != null)
                                m.TOTAL_WT = Number(res.rows.item(0).TOTAL_WT);
                            if (res.rows.item(0).TOTAL_QTY != null)
                                m.TOTAL_QTY = Number(res.rows.item(0).TOTAL_QTY);


                            cmdMaxDoc.executeReader(function (tx, res) {
                                if (res.rows.item(0).MAX_DOCUMENT_NO != null)
                                    m.MAX_DOCUMENT_NO = Number(res.rows.item(0).MAX_DOCUMENT_NO);



                                var str3 = " SELECT STOCK.*, BAL.QUANTITY AS QUOTA_QTY, BAL.WEIGHT AS QUOTA_WT FROM S1_ST_STOCK_TRN STOCK LEFT OUTER JOIN    S1_ST_STOCK_BALANCE BAL ON BAL.SUB_OPERATION = STOCK.SUB_OPERATION AND BAL.OPERATION = STOCK.OPERATION AND BAL.COMPANY = STOCK.COMPANY AND BAL.PRODUCT_CODE = STOCK.PRODUCT_CODE AND STOCK.BUSINESS_UNIT = BAL.BUSINESS_UNIT  WHERE STOCK.COMPANY = ? AND STOCK.OPERATION = ? AND STOCK.SUB_OPERATION = ? AND STOCK.BUSINESS_UNIT = ? AND STOCK.DOC_TYPE = ? AND STOCK.DOC_NUMBER = ? "
                                var cmd3 = $.Ctx.DbConn.createSelectCommand();
                                cmd3.parameters.push($.Ctx.ComCode);
                                cmd3.parameters.push($.Ctx.Op);
                                cmd3.parameters.push($.Ctx.SubOp);
                                cmd3.parameters.push($.Ctx.Bu);
                                cmd3.parameters.push(m.DOCUMENT_TYPE);
                                cmd3.parameters.push(m.DOCUMENT_NO);
                                cmd3.sqlText = str3;
                                cmd3.executeReader(function (tx, res) {
                                    if (res.rows.length != 0) {
                                        var modelStock1 = new S1_ST_STOCK_TRN();
                                        modelStock1.retrieveRdr(res.rows.item(0));
                                        modelStock1.PRODUCT_CODE = m.PRODUCT_CODE;
                                        modelStock1.PRODUCT_NAME = m.PRODUCT_NAME;
                                        modelStock1.UNIT_PACK = m.UNIT_PACK;
                                        modelStock1.STOCK_KEEPING_UNIT = m.STOCK_KEEPING_UNIT;
                                        modelStock1.PRODUCT_STOCK_TYPE = m.PRODUCT_STOCK_TYPE;
                                        modelStock1.QTY_OLD = m.QTY;
                                        modelStock1.WGH_OLD = m.WGH;
                                        modelStock1.QUOTA_QTY = res.rows.item(0).QUOTA_QTY;
                                        modelStock1.QUOTA_WT = res.rows.item(0).QUOTA_WT;
                                        modelStock1.PRODUCT_SHORT_NAME = m.PRODUCT_SHORT_NAME;
                                        $.Ctx.PageParam['medicine_usage_detail'] = null;
                                        $.Ctx.SetPageParam('medicine_usage_detail', 'mode', 'edit');
                                        $.Ctx.SetPageParam('medicine_usage_detail', 'model', m);
                                        $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock1', modelStock1);
                                        $.Ctx.SetPageParam('medicine_usage_detail', 'Previous', 'medicine_usage_search');
                                        $.Ctx.NavigatePage('medicine_usage_detail', null, { transition: 'slide' });
                                    }
                                    else {
                                        $.Ctx.MsgBox($.Ctx.Lcl('medicine_usage_search', 'msgStockTranNotFound', "Stock Tran product of farm is not found in database"));
                                    }
                                }, function (err) {
                                    $.Ctx.MsgBox(err.message);
                                });
                            }, function (err) {
                                $.Ctx.MsgBox("Error find total Qty and Wt " + err.message);
                            });
                        }, function (err) {
                            $.Ctx.MsgBox("Error calculate max doc " + err.message);
                        });
                    }, function (err) {
                        $.Ctx.MsgBox("Error standard usage " + err.message);
                    });

                }
                else {
                    $.Ctx.MsgBox($.Ctx.Lcl('medicine_usage_search', 'msgProductNotFound', "Standard product of farm is not found in database"));
                }
            }, function (err) {
                $.Ctx.MsgBox("Error product " + err.message);
            });
        } else {
            $.Ctx.MsgBox($.Ctx.Lcl('medicine_usage_search', 'msgCannotFindFarm', 'Cannot find farm {0} {1} {2} ').format([m.ORG_CODE, m.FARM_ORG, m.FARM_ORG_LOC]));
        }

    }, function (err) {
        $.Ctx.MsgBox(err.message);
    }
    );
}


function ClearParamPage(){
    $.Ctx.PageParam['medicine_usage_detail'] = null;
    $.Ctx.SetPageParam('medicine_usage_detail', 'ScrollingTo', null);
    $.Ctx.SetPageParam('medicine_usage_detail', 'mode', null);
    $.Ctx.SetPageParam('medicine_usage_detail', 'model', null);
    $.Ctx.SetPageParam('medicine_usage_detail', 'FeedUsageInput', null);
    $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput1', null);
    $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput2', null);
    $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput3', null);
    $.Ctx.SetPageParam('medicine_usage_detail', 'ProductInput4', null);

    $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock1', null);
    $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock2', null);
    $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock3', null);
    $.Ctx.SetPageParam('medicine_usage_detail', 'modelStock4', null);
    $.Ctx.SetPageParam('medicine_usage_detail', 'Previous', 'medicine_usage_search');
}

function SearchFarmOrgLoc(SuccessCB){
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var sqlStr = '';
    if ($.Ctx.Bu == "FARM_PIG") {
        sqlStr = " SELECT A.ORG_CODE, A.FARM_ORG, A.FARM_ORG_LOC, FMORG.NAME_LOC, FMORG.NAME_ENG, SUM (A.QTY) AS S_QTY, SUM (A.WGH) AS S_WGH FROM    HH_FR_MS_SWINE_MATERIAL A LEFT OUTER JOIN FR_FARM_ORG FMORG ON FMORG.ORG_CODE = A.ORG_CODE AND FMORG.FARM_ORG = A.FARM_ORG_LOC WHERE     A.ORG_CODE = ? AND A.FARM_ORG = ? AND A.PRODUCT_STOCK_TYPE = ? AND A.TRANSACTION_DATE = ? GROUP BY A.ORG_CODE, A.FARM_ORG, A.FARM_ORG_LOC, FMORG.NAME_LOC, FMORG.NAME_ENG ORDER BY A.FARM_ORG_LOC ";
    }
    else {
        sqlStr = " SELECT A.ORG_CODE, A.FARM_ORG, A.FARM_ORG_LOC, FMORG.NAME_LOC, FMORG.NAME_ENG, SUM (A.QTY) AS S_QTY, SUM (A.WGH) AS S_WGH FROM    HH_FR_MS_MATERIAL_STOCK A LEFT OUTER JOIN FR_FARM_ORG FMORG ON FMORG.ORG_CODE = A.ORG_CODE AND FMORG.FARM_ORG = A.FARM_ORG_LOC WHERE     A.ORG_CODE = ? AND A.FARM_ORG = ? AND A.PRODUCT_STOCK_TYPE = ? AND A.TRANSACTION_DATE = ? GROUP BY A.ORG_CODE, A.FARM_ORG, A.FARM_ORG_LOC, FMORG.NAME_LOC, FMORG.NAME_ENG ORDER BY A.FARM_ORG_LOC ";
    }
    cmd.sqlText = sqlStr ; 
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push($.Ctx.GetPageParam('medicine_usage_search', 'product_stock_type'));
    cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());

    cmd.executeReader(function (tx, res) {
        if (res.rows.length !== 0) {
            var dSrc = new Array();
            var qtyTotal = 0;
            var wghTotal = 0;
            for (var i = 0; i < res.rows.length; i++) {
                var m;
                if ($.Ctx.Bu == "FARM_PIG")
                    m = new HH_FR_MS_SWINE_MATERIAL();
                else
                    m = new HH_FR_MS_MATERIAL_STOCK(); 

                m = res.rows.item(i);
                m.S_QTY = res.rows.item(i).S_QTY;
                m.S_WGH = res.rows.item(i).S_WGH;
                qtyTotal = qtyTotal + m.S_QTY;
                wghTotal = wghTotal + m.S_WGH;
                if ($.Ctx.Lang == "en-US") {
                    m.FARM_NAME = res.rows.item(i).NAME_ENG;
                } else {
                    m.FARM_NAME = res.rows.item(i).NAME_LOC;
                }
                dSrc.push(m);
            }
            var TotalSum = "";
            if (qtyTotal != 0) {
                var lblQty = $.Ctx.Lcl('medicine_usage_search', 'lblQty', 'Qty:{0}').format([accounting.formatNumber(Number(qtyTotal), 0, ",")]);
                TotalSum = lblQty + "  ";
            }
            if (wghTotal != 0) {
                var lblWgh = $.Ctx.Lcl('medicine_usage_search', 'lblWt', 'Wt:{0}').format([accounting.formatNumber(Number(wghTotal), 2, ",")]);
                TotalSum = TotalSum + lblWgh;
            }
            if (!_.isEmpty(TotalSum)) {
                $('#medicine_usage_search #totalSearch').html($.Ctx.Lcl('iFarm', 'msgTotalPetong', 'Total : {0}').format([TotalSum]));
            }
            SuccessCB(dSrc);
        }
    }, function (err) {
        console.log(err.message);
    });
}

function SearchProduct(farmOrgLoc, SuccessCB){

    var cmd = $.Ctx.DbConn.createSelectCommand();

    cmd.sqlText = "SELECT A.*, B.PRODUCT_NAME, B.PRODUCT_SHORT_NAME, B.STOCK_KEEPING_UNIT, B.UNIT_PACK, FMORG.NAME_LOC, FMORG.NAME_ENG FROM {0} A LEFT OUTER JOIN HH_PRODUCT_BU B ON A.PRODUCT_CODE = B.PRODUCT_CODE AND B.BUSINESS_UNIT = ? LEFT OUTER JOIN FR_FARM_ORG FMORG ON FMORG.ORG_CODE = A.ORG_CODE AND FMORG.FARM_ORG = A.FARM_ORG_LOC WHERE     A.ORG_CODE = ? AND A.FARM_ORG = ? AND A.PRODUCT_STOCK_TYPE = ? AND A.TRANSACTION_DATE = ? AND A.FARM_ORG_LOC = ?".format([$.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
    cmd.parameters.push($.Ctx.Bu);
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push($.Ctx.GetPageParam('medicine_usage_search', 'product_stock_type'));
    cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
    cmd.parameters.push(farmOrgLoc);

    cmd.executeReader(function (tx, res) {
        if (res.rows.length !== 0) {

            var dSrc = new Array();
            for (var i = 0; i < res.rows.length; i++) {
                var m; //
                if ($.Ctx.Bu == "FARM_PIG")
                    m = new HH_FR_MS_SWINE_MATERIAL();
                else
                    m = new HH_FR_MS_MATERIAL_STOCK(); 

                m.retrieveRdr(res.rows.item(i));
                m.PRODUCT_NAME = res.rows.item(i).PRODUCT_NAME;
                m.UNIT_PACK = res.rows.item(i).UNIT_PACK;
                m.PRODUCT_STOCK_TYPE = res.rows.item(i).PRODUCT_STOCK_TYPE;
                m.STOCK_KEEPING_UNIT = res.rows.item(i).STOCK_KEEPING_UNIT;
                if (res.rows.item(i).PRODUCT_SHORT_NAME == null)
                    m.PRODUCT_SHORT_NAME = res.rows.item(i).PRODUCT_NAME + " (" + res.rows.item(i).STOCK_KEEPING_UNIT + ")";
                else
                    m.PRODUCT_SHORT_NAME = res.rows.item(i).PRODUCT_SHORT_NAME + " (" + res.rows.item(i).STOCK_KEEPING_UNIT + ")";

                dSrc.push(m);
            }
            if (typeof SuccessCB == 'function') SuccessCB(dSrc);
        }
    }, function (err) {
        console.log(err.message);
    });
}

function DeleteUsage(FARM_ORG, FARM_ORG_LOC, PRODUCT_STOCK_TYPE, TRANSACTION_DATE, DOCUMENT_TYPE, DOCUMENT_NO, DOCUMENT_EXT,PRODUCT_CODE, QTY, WGH, SuccessCB){
    var mat  ;
    if ($.Ctx.Bu == "FARM_PIG")
        mat = new HH_FR_MS_SWINE_MATERIAL();
    else
        mat = new HH_FR_MS_MATERIAL_STOCK(); 

    var st = new S1_ST_STOCK_TRN();
    var sb = new S1_ST_STOCK_BALANCE();


    mat.ORG_CODE     = $.Ctx.SubOp;
    mat.FARM_ORG     = FARM_ORG;
    mat.FARM_ORG_LOC = FARM_ORG_LOC;
    mat.PRODUCT_STOCK_TYPE = PRODUCT_STOCK_TYPE;
    mat.TRANSACTION_DATE = TRANSACTION_DATE;
    mat.DOCUMENT_TYPE = DOCUMENT_TYPE;
    mat.DOCUMENT_NO = DOCUMENT_NO;
    mat.DOCUMENT_EXT = DOCUMENT_EXT;


    st.COMPANY = $.Ctx.ComCode;
    st.OPERATION = $.Ctx.Op;
    st.SUB_OPERATION = $.Ctx.SubOp;
    st.BUSINESS_UNIT = $.Ctx.Bu;
    st.DOC_TYPE = DOCUMENT_TYPE;
    st.DOC_NUMBER = DOCUMENT_NO
    st.EXT_NUMBER = DOCUMENT_EXT;

    var paramCmd = [mat.deleteCommand($.Ctx.DbConn), st.deleteCommand($.Ctx.DbConn)];
    var sb = new S1_ST_STOCK_BALANCE();
    sb.WAREHOUSE_CODE = FARM_ORG;
    sb.PRODUCT_CODE = PRODUCT_CODE;
    sb.QUANTITY = Number(QTY)*(-1);
    sb.WEIGHT = Number(WGH)*(-1);
    $.FarmCtx.SetStockBalance(sb, paramCmd, function(){

        var trn = new DbTran($.Ctx.DbConn);
        trn.executeNonQuery(paramCmd, function(){
            if (typeof(SuccessCB)=="function")
                SuccessCB(true);
        }, function(errors){
            SuccessCB(false);
            console.log(errors);
        });
    });
}


