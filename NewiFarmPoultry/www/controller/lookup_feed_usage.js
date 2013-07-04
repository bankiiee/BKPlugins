$('#lookup_feed_usage').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('lookup_feed_usage');
});

$('#lookup_feed_usage').bind('pageinit', function (e) {
    $('#lookup_feed_usage a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('lookup_feed_usage', 'Previous'), null, { transition: 'slide', action: 'reverse' });
    });

    $('#lookup_feed_usage #lstView').listview('option', 'filterCallback',
        function (text, searchString) {
            var lText = text.toLowerCase();
            if (lText.indexOf('*') !== -1) { return false };
            if (lText.indexOf(searchString) !== -1) { return false };
            return true;
        }
    );

    $('#lookup_feed_usage #lstView').bind('listviewbeforefilter',
        function (e, data) {
            var $input = $(data.input);
            var filterText = $input.val();
            populateListView(dSource, filterText, false);
        });

    $('#lookup_feed_usage #div-showall').click(function (e) {
        var $input = $('#lookup_feed_usage input[data-type="search"]');
        var filterText = $input.val();
        populateListView(dSource, filterText, true);
    });
});
var ProductStockType = $.Ctx.GetPageParam('lookup_feed_usage', 'product_stock_type');
var DocumentType   = $.Ctx.GetPageParam('lookup_feed_usage', 'document_type');

var dSource =null;
$('#lookup_feed_usage').bind('pagebeforeshow', function (e) {
    // s is where statement
    var location = $.Ctx.GetPageParam('lookup_feed_usage', 'location');
    var SqlWhere = $.Ctx.GetPageParam('lookup_feed_usage', 'SqlWhere');
    var cmd = $.Ctx.DbConn.createSelectCommand();
    if (location == null) {
        location = "";
    }
    if (SqlWhere == null) {
        SqlWhere = "";
    }
    var str = "";
    if ($.Ctx.Bu == "FARM_PIG") {
        str = " SELECT (SELECT SUM (QTY) FROM HH_FR_MS_SWINE_MATERIAL WHERE     ORG_CODE = ? AND FARM_ORG = ? AND FARM_ORG_LOC = B.FARM_ORG AND PRODUCT_STOCK_TYPE = ? AND TRANSACTION_DATE = ? AND DOCUMENT_TYPE = ?) AS TOTAL_QTY, (SELECT SUM (WGH) FROM HH_FR_MS_SWINE_MATERIAL WHERE     ORG_CODE = ? AND FARM_ORG = ? AND FARM_ORG_LOC = B.FARM_ORG AND PRODUCT_STOCK_TYPE = ? AND TRANSACTION_DATE = ? AND DOCUMENT_TYPE = ?) AS TOTAL_WT, B.FARM_ORG, B.LOCATION, B.NAME_ENG, B.NAME_LOC FROM    (SELECT DISTINCT FARM_ORG_LOC FROM HH_FR_MS_GROWER_STOCK WHERE ORG_CODE = ? AND FARM_ORG = ? UNION SELECT DISTINCT RELEASE_FARM_ORG_LOC AS FARM_ORG_LOC FROM HH_FR_MS_SWINE_ACTIVITY WHERE ORG_CODE = ? AND FARM_ORG = ?) A LEFT OUTER JOIN FR_FARM_ORG B ON A.FARM_ORG_LOC = B.FARM_ORG  " + SqlWhere + " ORDER BY FARM_ORG_LOC ";
    }
    else {
        str = " SELECT  ";
        str += " (SELECT SUM (QTY) FROM HH_FR_MS_MATERIAL_STOCK  ";
        str += " WHERE ORG_CODE = ? AND FARM_ORG = ? AND FARM_ORG_LOC = B.FARM_ORG AND PRODUCT_STOCK_TYPE = ? AND TRANSACTION_DATE = ? AND DOCUMENT_TYPE = ?) AS TOTAL_QTY,  ";
        str += " (SELECT SUM (WGH) FROM HH_FR_MS_MATERIAL_STOCK  ";
        str += " WHERE ORG_CODE = ? AND FARM_ORG = ? AND FARM_ORG_LOC = B.FARM_ORG AND PRODUCT_STOCK_TYPE = ? AND TRANSACTION_DATE = ? AND DOCUMENT_TYPE = ?) AS TOTAL_WT, ";
        str += " B.FARM_ORG, B.LOCATION, B.NAME_ENG, B.NAME_LOC  ";
        str += "FROM     ";
        str += " (SELECT DISTINCT FARM_ORG_LOC FROM HH_FR_MS_GROWER_STOCK WHERE ORG_CODE = ? AND FARM_ORG = ?) A LEFT OUTER JOIN FR_FARM_ORG B ";
        str += " ON A.FARM_ORG_LOC = B.FARM_ORG    ";
        str += " ORDER BY FARM_ORG_LOC ";
    }
    cmd.sqlText = str;
    console.log('feed usage');
    console.log(str); 

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
        dSource = new Array();
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new FR_FARM_ORG();
                m.retrieveRdr(res.rows.item(i));
                m.TOTAL_QTY = 0;
                m.TOTAL_WT = 0;
                if (res.rows.item(i).TOTAL_QTY != null)
                    m.TOTAL_QTY = Number(res.rows.item(i).TOTAL_QTY);

                if (res.rows.item(i).TOTAL_WT != null)
                    m.TOTAL_WT = Number(res.rows.item(i).TOTAL_WT);

                dSource.push(m);
            }
        }
        populateListView(dSource, null, false);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
});

var temp;

function populateListView(p, filterText, isShowAll) {
    $('#lookup_feed_usage #lstView').empty();
    var showCount = filterCount = 0;
    var maxShowCount = isShowAll==true?p.length:$.Ctx.CustomPageSize;

    for (var i = 0; i < p.length; i++) {
        var m = p[i];
        var desc = m.NAME_ENG==null?m.NAME_LOC:m.NAME_ENG;
        if ($.Ctx.Lang != 'en-US') {
            desc = m.NAME_LOC==null?m.NAME_ENG:m.NAME_LOC;
        }
        var txt1 = $.Ctx.Nvl(m.FARM_ORG, "");
        var txt2 = $.Ctx.Nvl(desc, "");
        m.DESCRIPTION = desc
        var s = '<li data-icon="false"><a id="{0}" data-tag="lst_item" {1}>'.format(['lki-' + i, "data-id='" + i + "'"]);
        s += '<p class="lki_name"><h3>{0}</h3></p>'.format([m.FARM_ORG]);
        s += '<p><strong class="lki_code">{0}</strong></p>'.format([desc]);
        s += '</a></li>';
        if (!IsNullOrEmpty(filterText)) {
            if (txt1.contains(filterText) || txt2.contains(filterText)) {
                filterCount += 1;
                if (showCount <= maxShowCount) {
                    $('#lookup_feed_usage #lstView').append(s);
                    showCount += 1;
                }
            }
        } else {
            filterCount += 1;
            if (showCount <= maxShowCount) {
                $('#lookup_feed_usage #lstView').append(s);
                showCount += 1;
            }
        }
    }//end for
    $('#lookup_feed_usage #lstView').listview('refresh');

    $('#lookup_feed_usage a[data-tag="lst_item"]').click(function (e) {
        var ind = $(this).attr('data-id');
        var param = new LookupParam();
        var m = dSource[ind];
        var cmdBal = $.Ctx.DbConn.createSelectCommand();
        var cmdUsage = $.Ctx.DbConn.createSelectCommand();
        if (m.LOCATION != "1") {
            cmdBal.sqlText = " SELECT SUM ( CASE WHEN GROWER.TRANSACTION_TYPE = '1' THEN (GROWER.MALE_QTY + GROWER.FEMALE_QTY) ELSE (GROWER.MALE_QTY + GROWER.FEMALE_QTY) * -1 END) AS PIG_BALANCE FROM HH_FR_MS_GROWER_STOCK GROWER WHERE     GROWER.ORG_CODE = ? AND GROWER.FARM_ORG = ? AND GROWER.FARM_ORG_LOC = ? "

            cmdBal.parameters.push($.Ctx.SubOp);
            cmdBal.parameters.push($.Ctx.Warehouse);
            cmdBal.parameters.push(m.FARM_ORG);

            var sqlStrUsage = '';
            if ($.Ctx.Bu == "FARM_PIG") {
                sqlStrUsage = "SELECT SUM (A.STD_USAGE) AS STD_USAGE ,( SELECT CONDITION_01  FROM HH_GD2_FR_MAS_TYPE_FARM WHERE  GD_TYPE = 'SFD' AND GD_CODE =  ? ) AS STD_DIF_PER FROM (  SELECT (SUM ( CASE WHEN GROWER.TRANSACTION_TYPE = '1' THEN (GROWER.MALE_QTY + GROWER.FEMALE_QTY) ELSE (GROWER.MALE_QTY + GROWER.FEMALE_QTY) * -1 END) * SUM ( CASE WHEN STD.FEED_PER_HEAD IS NULL THEN 0 ELSE STD.FEED_PER_HEAD END)) AS STD_USAGE FROM    HH_FR_MS_GROWER_STOCK GROWER LEFT OUTER JOIN HH_FR_STD_FEED_BY_FARM STD ON     GROWER.ORG_CODE = STD.ORG_CODE AND STD.FARM_ORG_LOC = GROWER.FARM_ORG_LOC AND STD.LOT_NO = GROWER.BIRTH_WEEK AND STD.FEED_DATE = ? WHERE     GROWER.ORG_CODE = ? AND GROWER.FARM_ORG = ? AND GROWER.FARM_ORG_LOC = ? GROUP BY GROWER.BIRTH_WEEK) A";
            }
            else {
                sqlStrUsage = " SELECT (A.STD_USAGE) AS STD_USAGE, ";
                sqlStrUsage += " (SELECT CONDITION_01  FROM HH_GD2_FR_MAS_TYPE_FARM WHERE GD_TYPE = 'SFD' AND GD_CODE = ? GROUP BY CONDITION_01) AS STD_DIF_PER ";
                sqlStrUsage += " FROM (SELECT ( CASE WHEN STD.FEED_PER_HEAD IS NULL THEN 0 ELSE STD.FEED_PER_HEAD END) AS STD_USAGE ";
                sqlStrUsage += " FROM  HH_FR_STD_FEED_BY_FARM STD ";
                sqlStrUsage += " WHERE STD.FEED_DATE = ? AND STD.ORG_CODE = ? AND STD.FARM_ORG_LOC = ?) A  ";

            }
            cmdUsage.sqlText = sqlStrUsage;

            cmdUsage.parameters.push($.Ctx.SubOp);
            cmdUsage.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
            cmdUsage.parameters.push($.Ctx.SubOp);
            if ($.Ctx.Bu == "FARM_PIG") {
                cmdUsage.parameters.push($.Ctx.Warehouse);
            }
            cmdUsage.parameters.push(m.FARM_ORG);

        } else {
            cmdBal.sqlText = " SELECT COUNT (*) AS PIG_BALANCE FROM HH_FR_MS_SWINE_ACTIVITY ACT WHERE     ACT.ORG_CODE = ? AND ACT.FARM_ORG = ? AND ACT.NEXT_ACTIVITY_TYPE IS NULL AND ACT.ACTIVITY_TYPE IN ('G', 'M', 'A', 'F', 'W') ";

            cmdBal.parameters.push($.Ctx.SubOp);
            cmdBal.parameters.push($.Ctx.Warehouse);

            cmdUsage.sqlText = "SELECT( (CASE WHEN SUM (STD.FEED_PER_HEAD) IS NULL THEN 0 ELSE SUM (STD.FEED_PER_HEAD) END) * {0}) AS STD_USAGE, (SELECT CONDITION_01 FROM HH_GD2_FR_MAS_TYPE_FARM WHERE GD_TYPE = 'SFD' AND GD_CODE = ?) AS STD_DIF_PER FROM HH_FR_STD_FEED_BY_FARM STD WHERE     STD.ORG_CODE = ? AND STD.LOT_NO = 'NA' AND STD.FARM_ORG_LOC = ? AND STD.FEED_DATE = ?"

            cmdUsage.parameters.push($.Ctx.SubOp);
            cmdUsage.parameters.push($.Ctx.SubOp);
            cmdUsage.parameters.push(m.FARM_ORG);
            cmdUsage.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());


            //	str = "SELECT COUNT (*) AS PIG_BALANCE, 'NA' AS BIRTH_WEEK, (SELECT MAX( DOCUMENT_NO)  FROM HH_FR_MS_SWINE_MATERIAL WHERE ORG_CODE = {2} ) AS MAX_DOCUMENT_NO ,( SELECT  CASE WHEN  CONDITION_01 IS NULL THEN  '20' ELSE CONDITION_01 END  FROM HH_GD2_FR_MAS_TYPE_FARM WHERE GD_TYPE = 'SFD' AND GD_CODE = {2} ) STD_DIF_PER,  (COUNT (*) * SUM (STD.FEED_PER_HEAD)) AS STD_USAGE FROM    HH_FR_MS_SWINE_ACTIVITY ACT LEFT OUTER JOIN HH_FR_STD_FEED_BY_FARM STD ON     ACT.ORG_CODE = STD.ORG_CODE AND STD.LOT_NO = 'NA' {0} {1}  ".format([' WHERE ACT.ORG_CODE = "' + $.Ctx.SubOp + '" AND ACT.FARM_ORG = "' + $.Ctx.Warehouse + '"', '  AND  ACT.NEXT_ACTIVITY_TYPE IS NULL AND ACT.ACTIVITY_TYPE IN ("G", "M", "A", "F", "W")    AND STD.FARM_ORG_LOC ="' + m.FARM_ORG  + '" AND  STD.FEED_DATE ="' + $.Ctx.GetBusinessDate().toDbDateStr() + '"','"' + $.Ctx.SubOp + '"' ]);
        }
        m.STD_USAGE = null;
        m.PIG_BALANCE = null;
        m.STD_DIF_PER = '20';
        m.MAX_DOCUMENT_NO = 0;

        var cmdMaxDoc = $.Ctx.DbConn.createSelectCommand();
        cmdMaxDoc.sqlText = "SELECT MAX ( MAT.DOCUMENT_NO +0 ) AS MAX_DOCUMENT_NO FROM {0} MAT WHERE MAT.ORG_CODE = ?".format([$.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
        cmdMaxDoc.parameters.push($.Ctx.SubOp);

        cmdBal.executeReader(function (tx, res) {
            if (res.rows.length != 0) {

                if (res.rows.item(0).PIG_BALANCE != null)
                    m.PIG_BALANCE = res.rows.item(0).PIG_BALANCE.toString();

                if (m.LOCATION == "1") {
                    cmdUsage.sqlText = cmdUsage.sqlText.format([Number(m.PIG_BALANCE)]);
                }
                cmdUsage.executeReader(function (tx, res) {
                    if (res.rows.length != 0) {
                        if (res.rows.item(0).STD_USAGE != null) {
                            if ($.Ctx.Bu == "FARM_PIG") {
                                m.STD_USAGE = (res.rows.item(0).STD_USAGE / 1000).toString();
                            }
                            else {
                                m.STD_USAGE = m.PIG_BALANCE * res.rows.item(0).STD_USAGE;
                            }
                        }
                        if (res.rows.item(0).STD_DIF_PER != null)
                            m.STD_DIF_PER = res.rows.item(0).STD_DIF_PER.toString();
                    }
                    cmdMaxDoc.executeReader(function (tx, res) {
                        if (res.rows.length != 0) {
                            if (res.rows.item(0).MAX_DOCUMENT_NO != null)
                                m.MAX_DOCUMENT_NO = Number(res.rows.item(0).MAX_DOCUMENT_NO);
                        }

                        param = $.Ctx.GetPageParam('lookup_feed_usage', 'param');
                        $.Ctx.SetPageParam(param.calledPage, param.calledResult, m);
                        $.Ctx.NavigatePage(param.calledPage, null, { transition: 'slide' });


                    }, function (err) {
                        $.Ctx.MsgBox(err.message);
                    });
                }, function (err) {
                    $.Ctx.MsgBox(err.message);
                });
            }
            else {
                $.Ctx.MsgBox($.Ctx.Lcl('lookup_feed_usage', 'msgProductNotFound', "Standard product of farm is not found in database"));
            }
        }, function (err) {
            $.Ctx.MsgBox(err.message);
        });
    });

    if (!IsNullOrEmpty(filterText))
        $('#lookup_feed_usage #captionHeader').html($.Ctx.Lcl('lookup_feed_usage', 'headerFeedUsageInfo', '({0}/{1})Feed Information').format([filterCount, p.length]));
    else
        $('#lookup_feed_usage #captionHeader').html($.Ctx.Lcl('lookup_feed_usage', 'headerFeedUsageInfo', '({0})Feed Information').format([p.length]));

    if (filterCount==showCount)
        $('#lookup_feed_usage #div-showall').hide();
    else
        $('#lookup_feed_usage #div-showall').show();
}
