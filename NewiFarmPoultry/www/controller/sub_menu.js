var clickAlias = "click";

$("#sub_menu").bind("pageinit", function (event) {
    $('#sub_menu #btnBack').bind(clickAlias, function (e) {
        var curMenu = $.Ctx.GetPageParam('sub_menu', 'Data');

        if (curMenu.PAGE_LEVEL_TYPE == '1') {
            $.Ctx.NavigatePage($.Ctx.GetPageParam('sub_menu', 'Previous'),
			null,
			{ transition: 'slide', reverse: true });
        } else {
            FindMenu(curMenu.PARENT_ID, function (menu) {
                $.Ctx.SetPageParam('sub_menu', 'Data', menu);

                $('#sub_menu #captionHeader').html(GetDesc(menu));

                SearchMenuByParent(curMenu.PARENT_ID, ResultSubMenu);
            });
            return false;
        }
    });
});

$('#sub_menu').bind("pagechangefailed", function (event, data) {

	$.Ctx.MsgBox($.Ctx.Lcl('sub_menu' , 'msgPageChangeFail','pagechangefailed'), null, $.Ctx.Lcl('iFarm', 'MsgAlert', "Alert"), $.Ctx.Lcl('iFarm', 'MsgOk', "OK"));
});

$('#sub_menu').bind("pagebeforecreate", function (e) {
    $.Util.RenderUiLang('sub_menu');
});

$("#sub_menu").bind("pageshow", function (event) {

});

$("#sub_menu").bind("pagebeforeshow", function (event) {
    var parent = $.Ctx.GetPageParam('sub_menu', 'Data');
    if (parent == null) return false;

    $('#sub_menu #captionHeader').html(GetDesc(parent));


    SearchMenuByParent(parent.MENU_ID, ResultSubMenu);
});


function ResultSubMenu(ret) {
    if (ret !== null) {
        $('#sub_menu #lstMenu').empty();
        for (var i = 0; i < ret.length; i++) {
            var html = '<li class="submenu">';
            html += '<a data-id="' + ret[i].OPEN_PATH + '" mId="' + ret[i].MENU_ID + '">';
            if (ret[i].PICTURE !== null) {
                html += '	<div class="ui-grid-a">';
                html += '		<div class="ui-block-a" style="width:10%">';
                html += '			<img src="' + ret[i].PICTURE + '"/>';
                html += '		</div>';
                html += '		<div class="ui-block-b" style="width:90%;margin-top:8px"><strong>&nbsp;&nbsp;';
                html += GetDesc(ret[i]);
                html += '		</strong></div>';
                html += '</div>';
            } else {
                html += GetDesc(ret[i]);
            }
            html += '</a>';
            html += '</li>';
            $('#sub_menu #lstMenu').append(html);
        }
        $('#sub_menu #lstMenu').listview('refresh');

        $('#sub_menu .submenu a').bind(clickAlias, function (e) {
            var menuId = $(this).attr("mId");
            FindMenu(menuId, function (menu) {
                $.Ctx.SetPageParam('sub_menu', 'Data', menu);
                var curMenu = $.Ctx.GetPageParam('sub_menu', 'Data');
                var gotoPath = curMenu.OPEN_PATH;
                if (gotoPath.indexOf("#reporturl") !== -1) {
                    //do$('#sub_menu #captionHeader').html(GetDesc(menu));not set the header because of report will popup
                } else if (gotoPath.indexOf("#browserurl") !== -1) {
                    // For One Page open in childPage
                }
                else {
                    $('#sub_menu #captionHeader').html(GetDesc(menu));
                }
                
                SearchMenuByParent(menu.MENU_ID, ResultSubMenu);
            });
        });
    } else {
        //No Child
        var curMenu = $.Ctx.GetPageParam('sub_menu', 'Data');
        if (curMenu !== null) {
            var curParam = null;
            try {
                curParam = $.parseJSON(curMenu.PARAMETERS);
            } catch (ex) {
                curParam = null;
            }
            var gotoPath = curMenu.OPEN_PATH;

            if (gotoPath.indexOf("#reporturl") !== -1) {
                var reportUrl = $.Ctx.RootUrl + "Report";
                var pageName = gotoPath.replace("#reporturl/", "").toUpperCase();
                var mParam = "";

                try {
                    mParam = curParam.ReportType;
                } catch (ex) {

                }

                var url = reportUrl + "/online_report.html?ReportCode={0}&ReportDesc={1}&ReportPage={2}&ReportParam={3}&UserId={4}&Lang={5}&ComCode={6}&SubOp={7}&Warehouse={8}".format([pageName, curMenu.PROGRAM_ID, pageName, mParam, $.Ctx.UserId, $.Ctx.Lang, $.Ctx.ComCode, $.Ctx.SubOp, $.Ctx.Warehouse]);
                $.Ctx.WindowOpen(url, pageName, { Previous: $.Ctx.AppPath + 'sub_menu.html', 'param': curParam });


            } else if (gotoPath.indexOf("#browserurl") !== -1) {
                var urlPath = gotoPath.replace("#browserurl/", "");
                if ($.Ctx.Nvl(curParam, '') != '') {
                    urlPath += "?param=" + curParam;
                }
                openChildBrowser(urlPath);

              //  var url = reportUrl + "/online_report.html?ReportCode={0}&ReportDesc={1}&ReportPage={2}&ReportParam={3}&UserId={4}&Lang={5}&ComCode={6}&SubOp={7}&Warehouse={8}".format([pageName, curMenu.PROGRAM_ID, pageName, mParam, $.Ctx.UserId, $.Ctx.Lang, $.Ctx.ComCode, $.Ctx.SubOp, $.Ctx.Warehouse]);
             //   $.Ctx.WindowOpen(url, pageName, { Previous: $.Ctx.AppPath + 'sub_menu.html', 'param': curParam });
            } else {
                CheckFileExists(gotoPath, function (isExists) {
                    if (isExists == true && gotoPath !== 'sub_menu') {//No Transfer to same page name.
                        FindMenu(curMenu.PARENT_ID, function (menu) {
                            if (gotoPath != 'sub_menu') {
                                $.Ctx.ClearPageParam(gotoPath);
                            }
                            $.Ctx.SetPageParam('sub_menu', 'Data', menu); //Update Current Menu
                            $.Ctx.NavigatePage(gotoPath, { Previous: 'sub_menu', 'param': curParam }, { transition: 'slide' });
                        });
                    }
                });
            }

        }
    }
}

function CheckFileExists(fileName, SuccessCB) {
    $.ajax({      
        url: fileName + '.html',
        type: 'HEAD',
        error: function () {
            SuccessCB(false); //file not exists
        },
        success: function () {
            SuccessCB(true); //file exists
        }
    });
}

function SearchMenuByParent(parentId, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText += "SELECT M.MENU_ID,M.PARENT_ID,M.ORDER_IDX,M.DESCR,M.DESCR_ENG,M.PROGRAM_ID,M.OPEN_PATH,M.PARAMETERS,M.PICTURE,M.PAGE_LEVEL_TYPE,P.USE_FLAG ";
    cmd.sqlText += "FROM HH_USER_MENU_BU M ";
    cmd.sqlText += "JOIN HH_USER_PROGRAM_BU P ON (M.BUSINESS_UNIT=P.BUSINESS_UNIT AND M.PROGRAM=P.PROGRAM AND M.PROGRAM_ID=P.PROGRAM_ID) ";
    cmd.sqlText += "WHERE P.PROGRAM=? AND P.USER_ID=? AND M.PARENT_ID=? AND P.USE_FLAG='Y' ";
    cmd.sqlText += "ORDER BY M.ORDER_IDX ";

    cmd.parameters.push($.Ctx.ProgramId);
    cmd.parameters.push($.Ctx.UserId);
    cmd.parameters.push(parentId);
    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var mn = new HH_USER_MENU_BU();
                mn.retrieveRdr(res.rows.item(i));
                ret.push(mn);
            }
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    }, function (error) {
        console.log(error);
    });
}

function FindMenu(menuId, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText += "SELECT * ";
    cmd.sqlText += "FROM HH_USER_MENU_BU M ";
    cmd.sqlText += "WHERE M.BUSINESS_UNIT=? AND M.PROGRAM=? AND M.MENU_ID=? ";
    cmd.sqlText += "ORDER BY M.ORDER_IDX ";
    cmd.parameters.push($.Ctx.Bu);
    cmd.parameters.push($.Ctx.ProgramId);
    cmd.parameters.push(menuId);
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            var mn = new HH_USER_MENU_BU();
            mn.retrieveRdr(res.rows.item(0));
            SuccessCB(mn);
        } else {
            SuccessCB(null);
        }
    }, function (error) {
        console.log(error);
    });
}

function GetDesc(m) {
    var ret = "";
    if ($.Ctx.Lang == 'en-US') {
        ret = m.DESCR_ENG;
        if (!IsNullOrEmpty(m.DESCR_ENG)) {
            return m.DESCR_ENG;
        }
    }
    if (!IsNullOrEmpty(m.DESCR)) {
        return m.DESCR;
    }

    return ret;
}

