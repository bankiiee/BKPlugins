var model = new Object();
var dSource = new Array();
var showingDetail = false;

$('#upload').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('upload');
    $.Ctx.RenderFooter('upload');
    if ($.Ctx.UserType == 'Admin') {
        var s = '<button id="btnShowuploadLog" data-theme="b"><span id="labShowLog">Show details</span></button>';
        $('#upload #divBtns').append(s);
        $('#upload #btnShowuploadLog').click(function (e) {
            showingDetail = true;
            countOnline();
        });
    }
    $('#upload #btnuploadAllTable').removeClass("ui-disabled");
});

$('#upload').bind('pagebeforehide', function (e) {
    $.Ctx.SetPageParam('upload', 'showingDetail', showingDetail);
    $.Ctx.PersistPageParam();
});

$('#upload').bind('pageinit', function (e) {
    $('#upload a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('upload', 'Previous'), null, { transition: 'slide', reverse: 'true' });
    });


    $('#upload #btnuploadAllTable').click(function (e) {
        $('#upload #btnuploadAllTable').button('disable');
        if (recordCount == 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('upload', 'MSG02', "No data to upload"));
            return;
        }
        $.Sync.UploadAll(function (UploadConnection) {
            $('#upload #btnuploadAllTable').button('enable');
            $.mobile.loading('hide');
            $.Ctx.MsgBox($.Ctx.Lcl('upload', 'MSG01', "Upload success"), null, $.Ctx.Lcl('iFarm', 'MsgAlert', "Alert"), $.Ctx.Lcl('iFarm', 'MsgOk', "OK"));
            $.Sync.PurgeUploadTable(UploadConnection);
            countOnline();

        }, function (err) {
            $('#upload #btnuploadAllTable').button('enable');
            $.mobile.loading('hide');
            $.Ctx.MsgBox("Upload error:" + err.toString());
            countOnline();

        }, function (i, t) {
            if ($.Ctx.UserType == 'Admin') {
                $.mobile.loading('show', { text: "Uploading {0}/{1}".format([i, t]), textVisible: true });
            } else {
                var cur = 100;
                if (t != 0) {
                    cur = Math.ceil((i * 100) / t);
                }
                $.mobile.loading('show', { text: "Uploading {0}%".format([cur]), textVisible: true });
            }

        });
    });

});

$('#upload').bind('pagebeforeshow', function (e) {
    showingDetail = $.Ctx.GetPageParam('upload', 'showingDetail');

    $('#upload #lblBusDate').text($.Ctx.GetLocalDateTime().toUIShortDateStr());
    $('#upload #lstView').empty();

    if (showingDetail == true) {
        $('#upload #lstViewContainer').show();
        countOnline();

    } else {
        $('#upload #lstViewContainer').hide();
        countOffline(countEachTable);
    }
});

var recordCount = 0;
var tableCount = 0;

function countOnline() {
    var jData = {};
    jData.header = $.Ctx.GetDefaultHeader();
    $.ajax({
        type: "POST",
        url: $.Ctx.SvcUrl + "/GetUploadTable",
        data: JSON.stringify(jData),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var items = data.d.HhSyncConfigBu;
            var uploadCompleteLog = data.d.UploadCompleteLog;
            countEachTable(items, true);
        }
    });

}

function countOffline(doNext) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT * FROM HH_SYNC_CONFIG_BU WHERE BUSINESS_UNIT = '{0}' AND IS_CREATE_TABLE IS 'Y' AND IS_UPLOAD IS 'Y'".format([$.Ctx.Bu]);
    cmd.executeReader(function (tx, res) {
            if (res.rows.length > 0) {
                var tables = new Array();
                for (var i = 0; i < res.rows.length; i++) {
                    var m = new HH_SYNC_CONFIG_BU();
                    m.retrieveRdr(res.rows.item(i));
                    tables.push(m);
                }
                doNext(tables, false);
            }
        },
        function (err) {
            $.Ctx.MsgBox(err.message);
        });

}

var x1;
function countEachTable(tables, isRenderDetail) {
    recordCount = 0;
    tableCount = 0;
    var IsFailTable = true;
    var IsFailParameter ;

    if  ($.Ctx.UserType == 'Admin' && isRenderDetail == true) {

        $('#upload #lstViewContainer').show();
        $('#upload #lstView').show();
        $('#upload #lstView').empty();

    } else {
        $('#upload #lstViewContainer').hide();
        $('#upload #lstView').hide();

    }

    for (var i = 0; i < tables.length; i++) {
        var tableName = tables[i].TABLE_NAME;
        var cmdI = $.Ctx.DbConn.createSelectCommand();
        var sqlText = "SELECT '{0}' AS TABLENAME, COUNT(*) AS COUNT FROM {0} WHERE NUMBER_OF_SENDING_DATA IS 0 ".format([tableName]);
        var WhereArray = new Array();
        if (!IsObjNullOrEmpty(tables[i].CLIENT_UPLOAD_STATEMENT) ) {
            WhereArray = tables[i].CLIENT_UPLOAD_STATEMENT.match(/@\w*/g);
            sqlText = sqlText + " AND " + tables[i].CLIENT_UPLOAD_STATEMENT;
        }
        cmdI.sqlText =sqlText;
        for (var ii =0; ii < WhereArray.length; ii ++){
            var paramVal = $.Ctx[WhereArray[ii].replace("@","")];
            if (paramVal != undefined){
                cmdI.parameters.push(paramVal);
            }else{
                IsFailParameter = WhereArray[ii];
                IsFailTable =false;
                break;
            }
        }
        if (IsFailTable == true){
            cmdI.executeReader(function (tx, res) {
                    if (res.rows.length > 0) {
                        recordCount += res.rows.item(0).COUNT;
                        if (isRenderDetail == true) {
                            var s = "<li><a data-tag='lst_item' data-id='{2}'>{0}<span class='ui-li-count'> <font color='red'>{1}</font> </span></a></li>".format([res.rows.item(0).TABLENAME, res.rows.item(0).COUNT, i]);
                            $('#upload #lstView').append(s);
                        }
                    }
                    tableCount += 1;
                    if (tableCount == tables.length) {
                        $('#upload #lblCount').html("<font color='red'>{0}</font>".format([recordCount]));
                        if (isRenderDetail == true) {
                            $('#upload #lstView').attr('data-filter', true);
                            $('#upload #lstView').listview('refresh');
                        }
                    }
                },
                function (err) {
                    tableCount += 1;
                    if (tableCount == tables.length) {
                        $('#upload #lblCount').html("<font color='red'>{0}</font>".format([recordCount]));
                        if (isRenderDetail == true) {
                            $('#upload #lstView').attr('data-filter', true);
                            $('#upload #lstView').listview('refresh');
                        }
                    }
                });

        }else{
            console.log(tableName + " does not parameter exsist in global :: " + IsFailParameter);
        }

    }





}



