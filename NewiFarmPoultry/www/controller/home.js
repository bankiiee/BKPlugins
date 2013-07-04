var clickAlias = "click";

$('#home').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('home');
});

$('#home').bind('pageinit', function (e) {
    $('#home #btnsignout').click(function (e) {
        $.Ctx.LoadPage("index", null, { transition: 'slide', reverse: 'true' });

    });
});


$('#home').bind('pagebeforeshow', function (e) {
    $.Ctx.ResetProcess();

    $('#pageContent').empty();
    var modelList = $.Ctx.GetPageParam('home', 'Data');
    if (modelList == null) {
        modelList = [];
        $.Ctx.SetPageParam('home', 'Data', modelList);
    }
    SearchMenu('1', function (ret) {
        if (ret !== null) {
            modelList = ret;
            var html = '';
            for (var i = 0; i < ret.length; i++) {
                html += '<div class="home-icon" >';
                html += '   <a data-id="' + ret[i].OPEN_PATH + '" class="ui-link" mId="' + ret[i].MENU_ID + '">';
                html += '	   <img src="' + ret[i].PICTURE + '"  />';
                html += '   </a> ';
                html += '   <span id="' + ret[i].PROGRAM_ID + '" data-lang="' + ret[i].PROGRAM_ID + '">' + GetDesc(ret[i]) + '</span>';
                html += '</div>';
//                style="width:114px;height:114px;"
            }
            $('#pageContent').append(html);

            $('#home .home-icon a').bind(clickAlias, function (e) {
                var dataId = $(this).attr("data-id");
                FindMenu($(this).attr("mId"), function (menu) {
                    if (menu !== null) {
                        switch (dataId) {
                            default:
                                $.Ctx.NavigatePage(dataId, { Previous: 'home', 'Data': menu, 'Param': menu.PARAMETERS }, { transition: 'slide' });
                                break;
                        }
                    }
                });

            });
        }
    });

});

function SearchMenu(level, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText += "SELECT M.MENU_ID,M.PARENT_ID,M.ORDER_IDX,M.DESCR,M.DESCR_ENG,M.PROGRAM_ID,M.OPEN_PATH,M.PARAMETERS,M.PICTURE,M.PAGE_LEVEL_TYPE,P.USE_FLAG ";
    cmd.sqlText += "FROM HH_USER_MENU_BU M ";
    cmd.sqlText += "JOIN HH_USER_PROGRAM_BU P ON (M.BUSINESS_UNIT=P.BUSINESS_UNIT AND M.PROGRAM=P.PROGRAM AND M.PROGRAM_ID=P.PROGRAM_ID) ";
    cmd.sqlText += "WHERE P.PROGRAM=? AND P.USER_ID=? AND M.PAGE_LEVEL_TYPE=? AND P.USE_FLAG='Y' ";
    cmd.sqlText += "ORDER BY M.ORDER_IDX ";

    cmd.parameters.push($.Ctx.ProgramId);
    cmd.parameters.push($.Ctx.UserId);
    cmd.parameters.push(level);
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

