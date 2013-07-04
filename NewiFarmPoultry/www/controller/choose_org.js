$('#choose_org').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('choose_org');
});




function NavigateDoNext(needDownload) {
    if (needDownload == false) {
        $.Ctx.SetPageParam('home', 'Previous', 'index');
        $.Ctx.NavigatePage('home', null, { transition: 'slide' });
    } else {

        $.mobile.loading('show', { text: "Checking for updates..", textVisible: true });
        $('#choose_org div[data-role="content"]').addClass('ui-disabled');
        $.Sync.CheckDownloadable(function (data) {

            if (data[0] == "Y") {
                $.mobile.loading('show', { text: "Downloading..", textVisible: true });
                $.Sync.DownloadAll(function () {
                    $.Ctx.firstTimeDevice = false;
                    $.mobile.loading('hide');
                    $('#choose_org div[data-role="content"]').removeClass('ui-disabled');
                    _currDevice.CURRENT_USER = $.Ctx.UserId;
                    var uCmd = _currDevice.updateCommand($.Ctx.DbConn);
                    uCmd.executeNonQuery();
                    $.Ctx.SetPageParam('home', 'Previous', 'index');
                    $.Ctx.NavigatePage('home', null, { transition: 'slide' });
                }, function (err) {
                    //redownload
                    $.mobile.loading('show', { text: "Re-Checking..", textVisible: true });
                    $.Sync.DownloadAll(function () {
                        $.mobile.loading('hide');
                        $('#choose_org div[data-role="content"]').removeClass('ui-disabled');
                        _currDevice.CURRENT_USER = $.Ctx.UserId;
                        var uCmd = _currDevice.updateCommand($.Ctx.DbConn);
                        uCmd.executeNonQuery();
                        $.Ctx.SetPageParam('home', 'Previous', 'index');
                        $.Ctx.NavigatePage('home', null, { transition: 'slide' });
                    }, function (err) {
                        $.mobile.loading('hide');
                        $('#choose_org div[data-role="content"]').removeClass('ui-disabled');
                        $.Ctx.MsgBox($.Ctx.Lcl('choose_org', 'msgDlNotComplete', 'Download not complete.Please try again./n Error detail {0}'.format([JSON.stringify(err)])));
                    }, function (i, t) {
                        if ($.Ctx.UserType == 'Admin') {
                            $.mobile.loading('show', { text: "Re-Checking {0}/{1}".format([i, t]), textVisible: true });
                        } else {
                            var cur = 100;
                            if (t != 0) {
                                cur = Math.ceil((i * 100) / t);
                            }
                            $.mobile.loading('show', { text: "Re-Checking {0}%".format([cur]), textVisible: true });
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

            } 
        }, function (err) {
            $.mobile.loading('hide');
            $.Ctx.MsgBox($.Ctx.Lcl('choose_org', 'msgCannotDownloadNow', 'You cannot download for now.Please try again later.'));
        });

    }

}


$('#choose_org').bind('pageinit', function (e) {
    $('#choose_org a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('choose_org', 'Previous'), null, { transition: 'slide', reverse: 'true' });
    });
});

$('#choose_org').bind('pagebeforeshow', function (e) {
    $("#choose_org #org_content").html('');
    populateCompany();


    function populateCompany() {
        var cmd = $.Ctx.DbConn.createSelectCommand();
        cmd.sqlText = "SELECT DISTINCT(O.COMPANY_CODE) AS COMPANY_CODE,C.COMPANY_NAME AS COMPANY_NAME FROM HH_USER_OPERATION_BU O LEFT OUTER JOIN HH_COMPANY_BU C ON O.COMPANY_CODE = C.COMPANY_CODE  WHERE O.BUSINESS_UNIT = '{0}' AND O.USER_ID = '{1}' AND O.START_DATE <= DATE('NOW') AND O.END_DATE >= DATE('NOW') ORDER BY O.COMPANY_CODE".format([$.Ctx.Bu, $.Ctx.UserId]);
        cmd.executeReader(function (tx, res) {
            var d = new Array();
            for (var i = 0; i < res.rows.length; i++) {
                d.push(res.rows.item(i));
            }
            renderCompany(d);
        }, function (err) {
            $.Ctx.MsgBox(err.message);
        });

    }

    function renderCompany(d) {
        for (var i = 0; i < d.length; i++) {
            var sCom = '<div  id="company{0}" data-id="{2}" data-created="false"  data-role="collapsible" data-collapsed="false" data-theme="a" data-content-theme="c">';
            sCom += '<h3>{1}</h3>';
            sCom += '</div>';
            $("#choose_org #org_content").append(sCom.format([d[i].COMPANY_CODE, d[i].COMPANY_NAME, d[i].COMPANY_CODE]));

            $("#choose_org #company" + d[i].COMPANY_CODE).collapsible({
                //            expand: function(event, ui) {
                //
                //            }
            });

            $("#choose_org #company" + d[i].COMPANY_CODE).bind("expand", function (event, ui) {
                var ele = $('#choose_org #' + this.id);
                var created = ele.attr('data-created');
                if (created == 'false') {
                    var comCode = ele.attr('data-id');
                    populateOperation(comCode);
                    ele.attr('data-created', 'true');
                }
            });


        }

        if (d.length == 1) {
            $("#choose_org #company" + d[0].COMPANY_CODE).trigger('expand');
        }
    }

    function populateOperation(comCode) {
        var cmd = $.Ctx.DbConn.createSelectCommand();
        cmd.sqlText = "SELECT DISTINCT(O.OPERATION_CODE) AS OPERATION_CODE,MAX(O.OPERATION_NAME) AS OPERATION_NAME FROM HH_USER_OPERATION_BU O WHERE O.BUSINESS_UNIT = '{0}' AND O.USER_ID = '{1}' AND COMPANY_CODE = '{2}' AND O.START_DATE <= DATE('NOW') AND O.END_DATE >= DATE('NOW') GROUP BY COMPANY_CODE,OPERATION_CODE ORDER BY O.OPERATION_CODE".format([$.Ctx.Bu, $.Ctx.UserId, comCode]);
        cmd.executeReader(function (tx, res) {
            var d = new Array();
            for (var i = 0; i < res.rows.length; i++) {
                d.push(res.rows.item(i));
            }
            renderOperation(comCode, d);
        }, function (err) {
            $.Ctx.MsgBox(err.message);
        });

    }

    function renderOperation(comCode, d) {
        for (var i = 0; i < d.length; i++) {
            var s = "";
            s += '<div id="operation{0}" data-created="false" data-id="{1}" data-role="collapsible" data-content-theme="c" data-theme="b">';
            s += '    <h3>{2}</h3>';
            s += '</div>';

            $("#choose_org #company{0} div[class='ui-collapsible-content ui-body-c ui-corner-bottom']".format([comCode])).append(s.format([d[i].OPERATION_CODE, d[i].OPERATION_CODE, d[i].OPERATION_NAME, d[i].OPERATION_CODE]));

            var divElement = $("#choose_org #company{0} #operation{1}".format([comCode, d[i].OPERATION_CODE]));

            divElement.collapsible({

            });

            divElement.bind("expand", function (event, ui) {
                var ele = $("#choose_org #company{0} #{1}".format([comCode, this.id]))
                var created = ele.attr('data-created');
                if (created == 'false') {

                    var opCode = $("#choose_org #company{0} #{1}".format([comCode, this.id])).attr('data-id');

                    populateSubOperation(comCode, opCode);
                    ele.attr('data-created', 'true')
                }

            });


        }
    }

    function populateSubOperation(comCode, opCode) {
        var cmd = $.Ctx.DbConn.createSelectCommand();
        cmd.sqlText = " SELECT  O.SUB_OPERATION AS SUB_OPERATION, O.SUB_OPERATION_NAME AS SUB_OPERATION_NAME, O.WAREHOUSE AS WAREHOUSE, O.WAREHOUSE_NAME AS WAREHOUSE_NAME FROM HH_USER_OPERATION_BU O WHERE     O.BUSINESS_UNIT = '{0}' AND O.USER_ID = '{1}' AND COMPANY_CODE = '{2}' AND OPERATION_CODE = '{3}' AND O.START_DATE <= DATE ('NOW') AND O.END_DATE >= DATE ('NOW') ORDER BY O.SUB_OPERATION ".format([$.Ctx.Bu, $.Ctx.UserId, comCode, opCode]);
        cmd.executeReader(function (tx, res) {
            var d = new Array();
            for (var i = 0; i < res.rows.length; i++) {
                d.push(res.rows.item(i));
            }
            renderSubOperation(comCode, opCode, d);
        }, function (err) {
            $.Ctx.MsgBox(err.message);
        });
    }

    function renderSubOperation(comCode, opCode, d) {
        var s = '<div id="divOperation{0}"><ul id="ulOperation{0}" data-role="listview" data-inset="true" data-theme="d">'.format([opCode]);
        for (var i = 0; i < d.length; i++) {
            var fStr = '<li><a onclick="{2}" >[{3}] {0} ({1})</a></li>';
            s += fStr.format([d[i].SUB_OPERATION_NAME, d[i].WAREHOUSE_NAME, "setOrganization('{0}','{1}','{2}','{3}')".format([comCode, opCode, d[i].SUB_OPERATION, d[i].WAREHOUSE]), d[i].SUB_OPERATION]);
        }
        s += '    </ul></div>';
        var ulElement = $("#choose_org #company{0} #operation{1} div[class='ui-collapsible-content ui-body-c ui-corner-bottom']".format([comCode, opCode]));
        ulElement.append(s);

        $("#choose_org #company{0} #divOperation{1}".format([comCode, opCode])).trigger('create');
        $("#choose_org #company{0} #ulOperation{1}".format([comCode, opCode])).listview('refresh');
    }


});

function setOrganization(comCode, opCode, subOp, warehouse) {
    var needDownload = false;
    console.log($.Ctx.SubOp);
    console.log(subOp);
    if ($.Ctx.SubOp != subOp) {
        needDownload = true;
    }
    $.Ctx.SetOrganization(comCode, opCode, subOp, warehouse, function doNext(found) {
        if (found == false) {
            $.Ctx.MsgBox('Error:No organization found');
        }
        NavigateDoNext(needDownload);
    });


}


