

$('#download').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('download');
    $.Ctx.RenderFooter('download');

    if ($.Ctx.UserType == 'Admin'){
        var s = '<button id="btnShowDownloadLog" data-theme="b"><span id="labShowLog">Show details</span></button>'
        $('#download #divBtns').append(s);
        $('#download #btnShowDownloadLog').click(function (e) {
            RenderdownloadResult();
        });
    }
    $('#download a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage('utility', null, { transition: 'slide', reverse: 'true' });
    });



    $('#download #btndownloadAllTable').bind('click', function (e) {
        $('#download #divBtns').addClass('ui-disabled');

        $.ajax({
            url: $.Ctx.SvcUrl,
            success: function(result){

                $.mobile.loading('show', { text: "Checking for updates..", textVisible: true });

                $.Sync.CheckDownloadable (function(data){

                    if (data[0] == "Y" ){
                        $.mobile.loading('show', { text: "Downloading..", textVisible: true });
                        $.Sync.DownloadAll(function () {
                            $('#download #divBtns').removeClass('ui-disabled');
                            $.mobile.loading('hide');
                            $.Ctx.MsgBox($.Ctx.Lcl('download', 'MSG01', "download success"));

                        }, function (err) {
                            $.mobile.loading('show', { text: "Retry Downloading..", textVisible: true });
                            $.Sync.DownloadAll(function () {
                                $('#download #divBtns').removeClass('ui-disabled');
                                $.mobile.loading('hide');
                                $.Ctx.MsgBox($.Ctx.Lcl('download', 'MSG01', "download success"));

                            }, function (err) {
                                $('#download #divBtns').removeClass('ui-disabled');
                                $.mobile.loading('hide');
                                $.Ctx.MsgBox($.Ctx.Lcl('download', 'msgDlNotComplete', 'Download not complete.Please try again./n Error detail {0}'.format([JSON.stringify(err)])));
                            }, function (i, t) {
                                if ($.Ctx.UserType == 'Admin') {
                                    $.mobile.loading('show', { text: "Retry Downloading {0}/{1}".format([i, t]), textVisible: true });
                                } else {
                                    var cur = 100;
                                    if (t != 0) {
                                        cur = Math.ceil((i * 100) / t);
                                    }
                                    $.mobile.loading('show', { text: "Retry Downloading {0}%".format([cur]), textVisible: true });
                                }
                            });
                        }, function (i, t) {
                            if ($.Ctx.UserType == 'Admin') {
                                $.mobile.loading('show', { text: "Downloading {0}/{1}".format([i, t]), textVisible: true });
                            } else {
                                var cur = 100;
                                if (t != 0) {
                                    cur = Math.ceil((i * 100) / t);
                                }
                                $.mobile.loading('show', { text: "Downloading {0}%".format([cur]), textVisible: true });
                            }
                        });


                    }} , function (err) {
                    $('#index #divSignIn').removeClass('ui-disabled');
                    $.mobile.loading('hide');
                    $.Ctx.MsgBox($.Ctx.Lcl('index', 'msgCannotDownloadNow', 'You cannot download for now.Please try again later.'));
                });
            },
            timeout:$.Ctx.ServiceTimeout  ,
            error: function(result){
                $('#download #divBtns').removeClass('ui-disabled');
                $.Ctx.MsgBox($.Ctx.Lcl('download', 'msgCannotreachServer', 'Server cannot be reach.'));
            }
        });
    });
});


function RenderdownloadResult() {
    $('#download #lstTables').html('');
    var sCmd = $.Ctx.DbConn.createSelectCommand();
    sCmd.sqlText = "SELECT TABLE_NAME FROM HH_SYNC_CONFIG_BU WHERE IS_CREATE_TABLE=? AND IS_DOWNLOAD = ?";
    sCmd.parameters.push('Y');
    sCmd.parameters.push('Y');
    sCmd.executeReader(function (t, res) {
        var tables = [];
        for (x = 0; x < res.rows.length; x++) {
            var t = res.rows.item(x);
            tables.push(t.TABLE_NAME);
        }
        var cm = $.Ctx.DbConn.createSelectCommand();
        cm.sqlText =
            'SELECT   TABLE_NAME, LAST_DATA_TIMESTAMP, NO_ROW_RECEIVED, TOTAL_ROW_COUNT, LAST_PK_DATA ' +
                'FROM     HH_CLIENT_USER_RECEIVED_BU ' +
                'WHERE    DEVICE_ID = ? AND PROGRAM_ID = ? AND TABLE_NAME IN ("' + tables.toString().replace(/,/g, '","') + '") ' +
                'ORDER BY TABLE_NAME';
        cm.parameters = [$.Ctx.DeviceId, $.Ctx.ProgramId];
        cm.executeReader(function (t, res) {
            var details = [];
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_CLIENT_USER_RECEIVED_BU();
                m.retrieveRdr(res.rows.item(i));
                details.push(m);
            }
            SetdownloadResult(tables, details);
        });
    }, function (err) {
        console.log(err);
    });
}


function SetdownloadResult(tables, details) {
    var $lstTables = $('#download #lstTables');
    var s = '';
    var lastTS = '';
    for (var i = 0; i < tables.length; i++) {
        s = '<li style="height: 100px"><a>' + tables[i] + '</a>';
        for (var j = 0; j < details.length; j++) {
            var item = details[j];
            if (tables[i] == item.TABLE_NAME) {
                if (item.LAST_DATA_TIMESTAMP != null) {
                    lastTS = item.LAST_DATA_TIMESTAMP.substring(8, 10) + '/' + item.LAST_DATA_TIMESTAMP.substring(5, 7) + '/' + item.LAST_DATA_TIMESTAMP.substring(0, 4);
                }
                else {
                    lastTS = '';
                }
                s += '<p style="margin-left: 50px">';
                s += '    Last: ' + lastTS + '<br />';
                s += '    Row: ' + item.NO_ROW_RECEIVED + '/' + item.TOTAL_ROW_COUNT + '<br />';
                s += '    PK: ' + (item.LAST_PK_DATA != null ? item.LAST_PK_DATA : '');
                s += '</p>';


                break;
            }
        }
        s += '</li>';
        $lstTables.append(s);
    }
    $lstTables.listview('refresh');

    $('#download #lstTables').find('li').on('click', function () {
        $.Ctx.NavigatePage('sqlutil', { Previous: 'download', TableName: $(this).find('a')[0].innerText }, { transition: 'slide' });
    });
}
  