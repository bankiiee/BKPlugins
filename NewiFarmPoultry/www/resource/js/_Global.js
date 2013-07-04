//    According to format configured
XDate.prototype.toUIDateStr = function () {
    //In reality the DbStr must come from toJSON()
    var strFormat = $.Ctx.FormatDate;
    return strFormat.format([this.getFullYear(), (this.getMonth() + 1).toString().lpad("0", 2), this.getDate().toString().lpad("0", 2), this.getHours().toString().lpad("0", 2), this.getMinutes().toString().lpad("0", 2), this.getSeconds().toString().lpad("0", 2), this.getMilliseconds().toString().lpad("0", 3)]);
}

//    According to format configured
XDate.prototype.toUIShortDateStr = function () {
    //In reality the DbStr must come from toJSON()
    var strFormat = $.Ctx.ShorFormatDate;
    var s = strFormat.format([this.getFullYear(), (this.getMonth() + 1).toString().lpad("0", 2), this.getDate().toString().lpad("0", 2)]);
    return s.trim();
}

function IsNullOrEmpty(str) {
    if (str == undefined) {
        return true
    }
    ;
    if (str == null) {
        return true
    }
    ;
    if (str === '') {
        return true
    }
    ;
    if (str.trim() === '') {
        return true
    }
    ;
    return false;
}

function IsObjNullOrEmpty(obj) {
    if (obj == undefined) {
        return true
    }
    ;
    if (obj == null) {
        return true
    }
    ;
    if (obj === '') {
        return true
    }
    ;
    if ( typeof(obj) == 'string' ){
        if (obj.trim() === '') {
            return true
        }
    }
    ;
    return false;
}


//    According to format configured
function parseUIDateStr(dbDateStr) {
    if (dbDateStr.length > 10) {
        return new XDate(dbDateStr);
    } else {
        return new XDate(dbDateStr + " 00:00:00.000");
    }
}

GlobalVar.prototype.RegisterContext = function (contextList) {
    $.Ctx.CtxList = contextList;
}
function GlobalVar() {
    this.IsDevice = false;
    this.firstTimeDevice = false;
    this.CtxList = new Array;
    this.ClientVersion = '1.0.0.0';
    this.IndividualMode = false;
    this.ServiceTimeout = 20000;
    //override at logon
    this.AppVersion = null;
    this.AppName = "iFarm Poultry";
    this.DbName = "HH_FA_PT";
    this.ProgramId = "FRPTMBM";
    this.Bu = "FARM_POULTRY";
    this.UserId = "a";
    this.UserPassword = "a";
    this.UserType = "Admin";
    this.UserFullName = "Developer";
    this.DeviceId = 351;
    this.SalesMan = "a";
    //Constants
    this.FormatDate = "{0}-{1}-{2} {3}:{4}:{5}.{6}";
    this.ShorFormatDate = "{0}-{1}-{2}";
    this.RowsCommitLot = 2000;
    this.PageParam = new Object();
    this.Lang = "en-US"
    this.ImageQuality = 5;
    this.CustomPageSize = 50;
    this.TransitionOn = false;
    this.UiLangExport = false;
    this.DbConn;
    //this.DbConn = new DbConnector(this.AppName, 1, this.AppName, 5 * 1024 * 1024);

//    this.RootUrl = "https://wservice.cpchina.cn:9090/";
//    this.SvcUrl = "https://wservice.cpchina.cn:9090/SsIFarmDeviceService.svc";
//    this.ReportUrl = "https://wservice.cpchina.cn:9090/SsIFarmReportService.svc";
//    this.AppPath = "//SsiFarm.app/www/";

//    this.RootUrl = "http://vm-cpt-devslweb.cpf.co.th/SsISwineDeviceWeb/";
//    this.SvcUrl = "http://vm-cpt-devslweb.cpf.co.th/SsISwineDeviceWeb/SsIFarmDeviceService.svc";
//    this.ReportUrl = "http://vm-cpt-devslweb.cpf.co.th/SsISwineDeviceWeb/SsIFarmReportService.svc";
//    this.AppPath = "http://vm-cpt-devslweb.cpf.co.th/SsISwineDeviceWeb/client/assets/www/";

    //this.RootUrl = "http://vm-cpt-devslweb.cpf.co.th/SsIFarmDeviceWeb/";
    //this.SvcUrl = "http://vm-cpt-devslweb.cpf.co.th/SsIFarmDeviceWeb/SsIFarmDeviceService.svc";

    this.RootUrl = "https://10.109.67.56:9092/";
    this.SvcUrl = "https://10.109.67.56:9092/SsIPoultryDeviceService.svc";
        this.ReportUrl = "https://10.109.67.56:9092/SsIFarmReportService.svc";
        this.AppPath = "https://10.109.67.56:9092/client/assets/www/";

    this.ImagePath = this.RootUrl + "Temp/";
    //Business Context
    this.ComCode = null;
    this.ComName = null;
    this.Op = null;
    this.OpName = null;
    //OrgCode
    this.SubOp = null;  //org_code
    this.SubOpName = null;
    this.Warehouse = null;    //farm_org
    this.WarehouseName = null;
    this.SubWarehouse = null;
    this.SubWarehouseName = null;
    this.BusinessDate = (new XDate()).toDbDateOnlyStr();
    this.BusinessType = null;

}

GlobalVar.prototype.GetBusinessDate = function () {
    return $.Ctx.GetDateNTZ(new XDate($.Ctx.BusinessDate));
}

GlobalVar.prototype.RetrieveLocalStorage = function () {
    var s = localStorage.gbv;
    var buf = $.parseJSON(s);
    for (key in buf) {
        if (key == 'DbConn') {
            continue;
        }
        if (key == 'PageParam') {
            var pp = buf[key];
            var oR = new Object();
            for (k in pp) {
                oR[k] = new Object();
                for (i in pp[k]) {
                    if ((pp[k][i] != undefined) && (pp[k][i] != null) && (pp[k][i].typeName != undefined) && (pp[k][i].instance != undefined)) {
                        oR[k][i] = eval("new " + pp[k][i].typeName + "()");
                        for (x in pp[k][i].instance) {
                            oR[k][i][x] = pp[k][i].instance[x];
                        }
                    } else {
                        oR[k][i] = pp[k][i]
                    }
                }
            }

            $.Ctx[key] = oR;

        } else {
            if ((buf[key] != undefined) && (buf[key] != null) && (buf[key].typeName != undefined) && (buf[key].instance != undefined)) {
                $.Ctx[key] = eval("new " + buf[key].typeName + "()");
                for (k in buf[key].instance) {
                    $.Ctx[key][k] = buf[key].instance[k];
                }
            } else {
                $.Ctx[key] = buf[key];
            }

        }
    }
}



GlobalVar.prototype.RetrieveContextLocalStorage = function () {
    for (var iii =0; iii <  $.Ctx.CtxList.length ; iii++){
        var s = eval("localStorage" + $.Ctx.CtxList[iii].AppName);
        var buf = $.parseJSON(s);
        for (key in buf) {
            if (key == 'DbConn') {
                continue;
            }
            if (key == 'PageParam') {
                var pp = buf[key];
                var oR = new Object();
                for (k in pp) {
                    oR[k] = new Object();
                    for (i in pp[k]) {
                        if ((pp[k][i] != undefined) && (pp[k][i] != null) && (pp[k][i].typeName != undefined) && (pp[k][i].instance != undefined)) {
                            oR[k][i] = eval("new " + pp[k][i].typeName + "()");
                            for (x in pp[k][i].instance) {
                                oR[k][i][x] = pp[k][i].instance[x];
                            }
                        } else {
                            oR[k][i] = pp[k][i]
                        }
                    }
                }
                eval ($.Ctx.CtxList[iii].ContextVar + "[key] = oR");
//                $.Ctx[key] = oR;

            } else {
                if ((buf[key] != undefined) && (buf[key] != null) && (buf[key].typeName != undefined) && (buf[key].instance != undefined)) {
                    eval($.Ctx.CtxList[iii].ContextVar + "[key] = new " + buf[key].typeName + "()");
                    for (k in buf[key].instance) {
                        eval($.Ctx.CtxList[iii].ContextVar + "[key][k] =  buf[key].instance[k] ");
                    }
                } else {
                    eval($.Ctx.CtxList[iii].ContextVar + "[key] = buf[key]");
//                    $.Ctx[key] = buf[key];
                }

            }
        }
    }
}

GlobalVar.prototype.ResetProcess = function () {

    $.Ctx.PageParam = new Object();


}

GlobalVar.prototype.InitIndiviualPage = function () {
    $.Ctx.DbConn = new DbConnector($.Ctx.DbName, 1, $.Ctx.DbName, 50 * 1024 * 1024);
    $.Ctx.InitGlobal();
    $.Ctx.RetrieveConfig();
    $.Ctx.RetrievePreference();
    $.Ctx.RetrieveLocalStorage();
    $.Ctx.RetrieveContextLocalStorage();

}

GlobalVar.prototype.InitFirstPage = function () {
    $.Ctx.DbConn = new DbConnector($.Ctx.DbName, 1, $.Ctx.DbName, 50 * 1024 * 1024);
    $.Ctx.InitGlobal();

}

GlobalVar.prototype.ReadConfig = function (success) {
    var sCmd = $.Ctx.DbConn.createSelectCommand();
    sCmd.sqlText = "SELECT * FROM HH_INIT";
    sCmd.executeReader(function (t, res) {
        var buf = [];
        if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
                buf.push(res.rows.item(i));
            }
        }
        if (success != undefined) {
            success(buf);
        }
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
}

GlobalVar.prototype.ReadPreference = function (success, userId) {
    var sCmd = $.Ctx.DbConn.createSelectCommand();
    sCmd.sqlText = "SELECT * FROM HH_USER_PREFERENCE_BU WHERE USER_ID = '{0}'".format([userId]);
    sCmd.executeReader(function (t, res) {
        var buf = [];
        if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
                buf.push(res.rows.item(i));
            }
        }
        if (success != undefined) {
            success(buf);
        }

    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
}
GlobalVar.prototype.RetrievePreference = function () {
    var res = $.parseJSON(localStorage.pref);
    if (res != null) {
        for (var i = 0; i < res.length; i++) {
            var m = res[i];
            for (var key in $.Ctx) {
                if (key == m.KEY) {
                    if (m.INPUT_TYPES == 'NUMBER' || m.INPUT_TYPES == 'SLIDER') {
                        $.Ctx[key] = Number(m.VAL);
                    } else {
                        $.Ctx[key] = m.VAL;
                    }
                }
            }
        }
    }
}

GlobalVar.prototype.PersistPreference = function (res) {
    localStorage.pref = JSON.stringify(res);
}

GlobalVar.prototype.ReadLang = function (pageName, success) {
    var sCmd = $.Ctx.DbConn.createSelectCommand();
    sCmd.sqlText = "SELECT OBJECT_ID,ATTR_ID,TEXT_ENG,TEXT_LOCAL FROM HH_UI_LANG WHERE PROGRAM_ID=? AND FORM_ID = ?";
    sCmd.parameters.push($.Ctx.ProgramId);
    sCmd.parameters.push(pageName);
    sCmd.executeReader(function (t, res) {
        var buf = [];
        if (res.rows.length > 0) {
            for (i = 0; i < res.rows.length; i++) {
                buf.push(res.rows.item(i));
            }
            localStorage['uilang-' + pageName] = JSON.stringify(buf);
        }
        if (success != undefined) {
            success(buf);
        }
    }, function (err) {
        console.log(err + " (this error can be ignored)");
        success([]);
    });
}



GlobalVar.prototype.Lcl = function (pageName, objectId, defaultText) {
    var ret = null;
    var uiLangs = $.Util.UiLangs[pageName];
    if ((uiLangs != null) && (uiLangs != undefined)) {
        for (i = 0; i < uiLangs.length; i++) {
            var m = uiLangs[i];
            if (m.OBJECT_ID == objectId) {
                if ($.Ctx.Lang == "en-US") {
                    ret = m.TEXT_ENG;
                } else {
                    ret = m.TEXT_LOCAL;
                }
            }
        }
    }
    if (!IsNullOrEmpty(ret)) {
        return ret;
    }
    uiLangs = $.Util.UiLangs[$.Ctx.AppName];
    if ((uiLangs != null) && (uiLangs != undefined)) {
        for (i = 0; i < uiLangs.length; i++) {
            var m = uiLangs[i];
            if (m.OBJECT_ID == objectId) {
                if ($.Ctx.Lang == "en-US") {
                    ret = m.TEXT_ENG;
                } else {
                    ret = m.TEXT_LOCAL;
                }
            }
        }
    }
    if (!IsNullOrEmpty(ret)) {
        return ret;
    } else {
        return defaultText;
    }
}

GlobalVar.prototype.PersistConfig = function (res) {
    localStorage.cfg = JSON.stringify(res);
}

GlobalVar.prototype.RetrieveConfig = function () {
    var res = $.parseJSON(localStorage.cfg);
    if (res != null) {
        for (var i = 0; i < res.length; i++) {
            var m = res[i];
            for (var key in $.Ctx) {
                if (key == m.KEY) {
                    if (m.INPUT_TYPES == 'NUMBER' || m.INPUT_TYPES == 'SLIDER') {
                        $.Ctx[key] = Number(m.VALUE);
                    } else {
                        $.Ctx[key] = m.VALUE;
                    }
                }
            }
        }
    }
}


GlobalVar.prototype.InitGlobal = function (doNext) {
    $.xlog.turnOff('FW');
    $.xlog.turnOff('GB');
    $.mobile.selectmenu.prototype.options.nativeMenu = false;
    if ($.Ctx.TransitionOn != true) {
        $.mobile.defaultDialogTransition = 'none';
        $.mobile.defaultPageTransition = 'none';
    }

}

GlobalVar.prototype.GetLocalDateTime = function () {
    return new XDate();
}

GlobalVar.prototype.GetLocalDate = function () {
    var cdt = new XDate();
    return new XDate(cdt.getFullYear() + '-' + (cdt.getMonth() + 1).toString().lpad("0", 2) + '-' + cdt.getDate().toString().lpad("0", 2) + ' 00:00:00');
}

GlobalVar.prototype.GetDateNTZ = function (d) {
    var cdt = d;
    return new XDate(cdt.getFullYear() + '-' + (cdt.getMonth() + 1).toString().lpad("0", 2) + '-' + cdt.getDate().toString().lpad("0", 2) + ' 00:00:00');
}


GlobalVar.prototype.Nvl = function (OriginalValue, ReturnWhenNull) {
    if (OriginalValue == null || OriginalValue == undefined) {
        return ReturnWhenNull;
    }
    return OriginalValue;
}

GlobalVar.prototype.GetGUID = function (prefix) {
    return $.Util.GetGUID();
}

GlobalVar.prototype.GetPageParam = function (pageName, key) {
    var p = this.PageParam[pageName];
    if (p != undefined) {
        var r = p[key];
        if ((r != undefined) && (r != '')) {
            return r;
        }
    }
    return null;
}

GlobalVar.prototype.SetPageParam = function (pageName, key, val) {
    var p = this.PageParam[pageName];
    if (p == undefined) {
        this.PageParam[pageName] = new Object();
        p = this.PageParam[pageName];
    }
    p[key] = val;
}

GlobalVar.prototype.ClearPageParam = function (pageName) {
    this.PageParam[pageName] = new Object();
}

GlobalVar.prototype.NavigatePage = function (pageName, parameters, options, persistLocalStorage) {

    for (key in parameters) {
        this.SetPageParam(pageName, key, parameters[key]);
    }

    if (persistLocalStorage == false) {

    } else {
        this.PersistPageParam();
//        this.PersistContextParam();
    }

    if (($.Util.UiLangs[pageName] != null) && ($.Util.UiLangs[pageName] != undefined)) {
        if (this.IndividualMode == true) {
            window.location = pageName + ".html";
        } else {
            if (this.TransitionOn == true) {
                $.mobile.changePage(pageName + ".html", options);
            } else {
                $.mobile.changePage(pageName + ".html", null);
            }
        }
    } else {
        $.Ctx.ReadLang(pageName, function (res) {
            if ($.Ctx.IndividualMode == true) {
                window.location = pageName + ".html";
            } else {
                if ($.Ctx.TransitionOn == true) {
                    $.mobile.changePage(pageName + ".html", options);
                } else {
                    $.mobile.changePage(pageName + ".html", null);
                }
            }
        });
    }
}


GlobalVar.prototype.LoadPage = function (pageName, parameters, options) {
    for (key in parameters) {
        this.SetPageParam(pageName, key, parameters[key]);
    }
    this.PersistPageParam();

    if (($.Util.UiLangs[pageName] != null) && ($.Util.UiLangs[pageName] != undefined)) {
        window.location = pageName + ".html";
    } else {
        $.Ctx.ReadLang(pageName, function (res) {
            window.location = pageName + ".html";
        });
    }
}


GlobalVar.prototype.WindowOpen = function (url,pageName, parameters, options) {
    for (key in parameters) {
        this.SetPageParam(pageName, key, parameters[key]);
    }
    this.PersistPageParam();

    if (($.Util.UiLangs[pageName] != null) && ($.Util.UiLangs[pageName] != undefined)) {
        //$.mobile.loadPage(url);
        //window.location = url;
        //window.open(url, '_blank', 'location=no');
        window.open(url, '_system', 'location=no');

    } else {
        $.Ctx.ReadLang(pageName, function (res) {
            //$.mobile.loadPage(url);
            //window.location = url;
            //window.open(url, '_blank', 'location=no');
            window.open(url, '_system', 'location=no');

        });
    }
}

GlobalVar.prototype.WindowLocation = function (url,pageName, parameters, options) {
    for (key in parameters) {
        this.SetPageParam(pageName, key, parameters[key]);
    }
    this.PersistPageParam();

    if (($.Util.UiLangs[pageName] != null) && ($.Util.UiLangs[pageName] != undefined)) {
        window.location = url;
    } else {
        $.Ctx.ReadLang(pageName, function (res) {
            window.location = url;
        });
    }
}

GlobalVar.prototype.PersistPageParam = function () {
    //write to localstorage
    var buf = new Object();
    for (key in $.Ctx) {
        if (key == 'PageParam') {
            var pp = $.Ctx[key];
            var oR = new Object();
            for (k in pp) {
                oR[k] = new Object();
                for (i in pp[k]) {
                    var iR = new Object();
                    if ((pp[k][i] != undefined) && (pp[k][i] != null) && (pp[k][i] instanceof BaseBo)) {
                        iR.typeName = pp[k][i].getTableName();
                        iR.instance = pp[k][i];
                    } else {
                        iR = pp[k][i];
                    }
                    oR[k][i] = iR;
                }
            }
            buf[key] = oR;
        } else if ($.Ctx[key] instanceof BaseBo) {
            var o = new Object();
            o.typeName = $.Ctx[key].getTableName();
            o.instance = $.Ctx[key];
            buf[key] = o;
        } else {
            buf[key] = $.Ctx[key];
        }
    }
    var s = JSON.stringify(buf);
    localStorage.gbv = s;
}

GlobalVar.prototype.PersistContextParam = function () {
    //write to localstorage
    var CountList= 0;
    for (var iii =0; iii <  $.Ctx.CtxList.length ; iii++){
        var buf = new Object();
        for (key in $.Ctx.CtxList[iii]) {
            if (key == 'PageParam') {
                var pp = $.Ctx[key];
                var oR = new Object();
                for (k in pp) {
                    oR[k] = new Object();
                    for (i in pp[k]) {
                        var iR = new Object();
                        if ((pp[k][i] != undefined) && (pp[k][i] != null) && (pp[k][i] instanceof BaseBo)) {
                            iR.typeName = pp[k][i].getTableName();
                            iR.instance = pp[k][i];
                        } else {
                            iR = pp[k][i];
                        }
                        oR[k][i] = iR;
                    }
                }
                buf[key] = oR;
            } else if ($.Ctx[key] instanceof BaseBo) {
                var o = new Object();
                o.typeName = $.Ctx[key].getTableName();
                o.instance = $.Ctx[key];
                buf[key] = o;
            } else {
                if (!IsObjNullOrEmpty($.Ctx[key]))
                    buf[key] = $.Ctx[key];
                else
                    buf[key] =  $.Ctx.CtxList[iii][key] ;

            }
        }
        var s = JSON.stringify(buf);
        var localStorageName = "";
        if (IsNullOrEmpty($.Ctx.CtxList[iii].AppName)){
            localStorageName = "Context_" + CountList + "";
            CountList = CountList+1;
        }else{
            localStorageName = $.Ctx.CtxList[iii].AppName;
        }
        eval("localStorage." + localStorageName + " = '{0}';".format([s]));
    }
}

GlobalVar.prototype.GetDefaultHeader = function () {
    return { ProgramId: $.Ctx.ProgramId, Bu: $.Ctx.Bu, DeviceId: $.Ctx.DeviceId, SalemansCode: $.Ctx.SalesMan, UserId: $.Ctx.UserId, Pass: $.Ctx.UserPassword, TableName: null, StartRow: 0, EndRow: 0, LastTimeStamp: null, OrgCode: $.Ctx.SubOp, FarmOrg: $.Ctx.Warehouse, SubWarehouse: $.Ctx.SubWarehouse };
}

GlobalVar.prototype.RenderFooter = function (pageName, footerId) {
    var s = '<table style="padding: 0px; border-spacing: 0px">';
    //s += '  <style>.ui-btn { margin:0px; }</style>';
    s += '       <tr>';
    s += '            <td style="width: 100%; padding: 0px">';
    s += '                <p style="margin-left: 5px; margin-right: 5px; margin-top: 0px;margin-bottom: 0px;  ">{0}</p>'.format([$.Ctx.UserFullName]);
    s += '            </td>';
    s += '<td style="padding:0px"><table style="padding: 0px; border-spacing: 0px"><tr><td style="padding: 0px"><a style="float:left;padding: 0px;margin:0px" data-tag="footerbutton"  data-role="button" data-inline="true"  data-icon="gear" style="padding: 0px;margin-left: 0px; margin-right: 0px;margin-top: 0px; margin-bottom: 0px;" onclick="$.Ctx.NavigateSetting({0})">'.format(["'{0}'".format([pageName])]);
    s += '<span id="lblFooterSetting"   style="padding:0px">Setting</span></a></td><td  style="padding: 0px"><a  data-inline="true"  data-role="button"  data-tag="footerbutton"  data-icon="home" style="padding: 0px;margin-left: 0px; margin-right: 0px;margin-top: 0px; margin-bottom: 0px;" onclick="$.Ctx.NavigateHome()">';
    s += '<span id="lblFooterHome"  style="padding:0px">Home</span></a></td></tr></table';
    s += '  </td></tr></table>';

    if ((footerId != undefined) && (footerId != null)) {
        $('#' + pageName + ' #' + footerId).html(s);
    } else {
        $('#' + pageName + ' div[data-role="footer"]').html(s);
    }

}

GlobalVar.prototype.NavigateHome = function () {
    $.Ctx.NavigatePage('home', null, null);
}

GlobalVar.prototype.NavigateSetting = function (previousPage) {
    $.Ctx.SetPageParam('setting', 'Previous', previousPage);
    $.Ctx.NavigatePage('setting', null, null);
}
//doNext(boolean);
GlobalVar.prototype.SetOrganization = function (comCode, opCode, subOp, warehouse, doNext) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = " SELECT O.*, C.COMPANY_NAME AS COMPANY_NAME FROM    HH_USER_OPERATION_BU O LEFT OUTER JOIN HH_COMPANY_BU C ON O.COMPANY_CODE = C.COMPANY_CODE WHERE     O.BUSINESS_UNIT = '{0}' AND O.USER_ID = '{1}' AND O.COMPANY_CODE = '{2}' AND O.OPERATION_CODE = '{3}' AND O.SUB_OPERATION = '{4}' AND O.WAREHOUSE = '{5}' AND O.START_DATE <= DATE ('NOW') AND O.END_DATE >= DATE ('NOW') ORDER BY O.EXT_NUMBER ".format([$.Ctx.Bu, $.Ctx.UserId, comCode, opCode, subOp, warehouse]);
    cmd.executeReader(function (tx, res) {
        var found = false;
        if (res.rows.length > 0) {
            var m = new HH_USER_OPERATION_BU();
            m.retrieveRdr(res.rows.item(0));
            $.Ctx.ComCode = comCode;
            $.Ctx.ComName = res.rows.item(0).COMPANY_NAME;
            $.Ctx.Op = opCode;
            $.Ctx.OpName = m.OPERATION_NAME;
            $.Ctx.SubOp = subOp;
            $.Ctx.SubOpName = m.SUB_OPERATION_NAME;
            $.Ctx.Warehouse = m.WAREHOUSE;
            $.Ctx.WarehouseName = m.WAREHOUSE_NAME;
            $.Ctx.SubWarehouse = m.SUB_WAREHOUSE;
            $.Ctx.SubWarehouseName = m.SUB_WAREHOUSE_NAME;
            $.Ctx.BusinessType = m.BUSINESS_TYPE;
            found = true;

        }

        var cmd = new Array();
        //save to preference key SubOp
        var m = new HH_USER_PREFERENCE_BU();
        m.BUSINESS_UNIT = $.Ctx.Bu;
        m.CREATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
        m.DATA_TYPE = "String";
        m.ENG_DESC = 'OrgCode';
        m.FUNCTION = "C";
        m.KEY = "SubOp";
        m.LAST_UPDATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
        m.LOCAL_DESC = "OrgCode";
        m.NUMBER_OF_SENDING_DATA = 0;
        m.OWNER = $.Ctx.UserId;
        m.PROGRAM_ID = $.Ctx.ProgramId;
        m.USER_ID = $.Ctx.UserId;
        m.VAL = $.Ctx.SubOp;
        var dCmd = m.deleteCommand($.Ctx.DbConn);
        var iCmd = m.insertCommand($.Ctx.DbConn);
        cmd.push(dCmd);
        cmd.push(iCmd);


        //save to preference key Version
        var m = new HH_USER_PREFERENCE_BU();
        m.BUSINESS_UNIT = $.Ctx.Bu;
        m.CREATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
        m.DATA_TYPE = "String";
        m.ENG_DESC = 'Version';
        m.FUNCTION = "C";
        m.KEY = "Version";
        m.LAST_UPDATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
        m.LOCAL_DESC = "Version";
        m.NUMBER_OF_SENDING_DATA = 0;
        m.OWNER = $.Ctx.UserId;
        m.PROGRAM_ID = $.Ctx.ProgramId;
        m.USER_ID = $.Ctx.DeviceId.toString();
        m.VAL = $.Ctx.ClientVersion;
        dCmd = m.deleteCommand($.Ctx.DbConn);
        iCmd = m.insertCommand($.Ctx.DbConn);

        cmd.push(dCmd);
        cmd.push(iCmd);



        var dbTrn = new DbTran($.Ctx.DbConn);
        dbTrn.executeNonQuery(cmd, function () {
            if ((doNext != undefined) && (typeof (doNext) == "function")) {
                doNext(found);
            }
        }, function (err) { $.Ctx.MsgBox("Cannot save preference" + err) });



    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });

}

GlobalVar.prototype.runtimePopup = function (message, popupafterclose) {
    var btnCapt = $.Ctx.Lcl('iFarm', 'MsgOk', "OK");
    var template = '<div data-role="popup" id="popupDialog" data-overlay-theme="a" data-dismissible="false" class="ui-corner-all messagePopup" style="min-width:300px;max-width:400px;">'
		+ '	<div data-role="header" data-theme="a" class="ui-corner-top">'
		//+ '		<h1>Dialog</h1>'
		+ '	</div>'
		+ '	<div data-role="content" data-theme="d" class="ui-corner-bottom ui-content">'
		+ '		<h3 class="ui-title" style="text-align:center;word-wrap:break-word;">' + message + '</h3>'
		//+ '		<p>This action cannot be undone.</p>'
		+ '  <a href="#" data-role="button" data-inline="false" data-rel="back" data-transition="flow" data-theme="b" class="closePopup">' + btnCapt + '</a>'
		+ '	</div>'
		+ '</div>';

    popupafterclose = popupafterclose ? popupafterclose : function () { };

    $.mobile.activePage.append(template).trigger("create");

    $.mobile.activePage.find(".closePopup").bind("tap", function (e) {
        $.mobile.activePage.find(".messagePopup").popup("close");
    });
    var pop = $.mobile.activePage.find(".messagePopup");
    pop.popup({ theme: "d" });
    pop.popup("option", "dismissible", false);

    $.mobile.activePage.find(".messagePopup").popup().popup("open").bind({
        popupafterclose: function () {
            $(this).unbind("popupafterclose").remove();
            popupafterclose();
        }
    });
}

GlobalVar.prototype.MsgBox = function (message, alertCallback, title, buttonName) {
    title = title == undefined ? $.Ctx.Lcl('iFarm', 'MsgAlert', "Alert") : title;
    buttonName = buttonName == undefined ? $.Ctx.Lcl('iFarm', 'MsgOk', "OK") : buttonName;
    if ($.Ctx.IsDevice == true) {
        if (message.indexOf('are not unique') > -1) {
            message = $.Ctx.Lcl('iFarm', 'msgAlready', "Data is already added.");
        }
        navigator.notification.alert(message, alertCallback, title, buttonName);
    } else {
        //alert(message);
        $.Ctx.runtimePopup(message);
    }
}


GlobalVar.prototype.Confirm = function (message, confirmCallback, title, buttonName) {
    title = title == undefined ? $.Ctx.Lcl('iFarm', 'MsgAlert', "Alert") : title;
    buttonName = buttonName == undefined ? $.Ctx.Lcl('iFarm', 'MsgOkCancel', "OK,Cancel") : buttonName;
    if ($.Ctx.IsDevice == true) {
        navigator.notification.confirm(message, confirmCallback, title, buttonName);
    } else {
        var ret = confirm(message);
        confirmCallback(ret == true ? 1 : 2);
    }
}






$.Ctx = new GlobalVar();


function SyncUtil() {

}


SyncUtil.prototype.InstallTable = function (success, fail) {
    var jData = {};
    jData.bu = $.Ctx.Bu;
    jData.programId = $.Ctx.ProgramId;
    $.ajax({
        type: "POST",
        url: $.Ctx.SvcUrl + "/GetCreateTable",
        data: JSON.stringify(jData),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var items = $.parseJSON(data.d);
            var validTables = new Array();
            for (var i = 0; i <= items.length - 1; i++) {
                if ($.Sync.IsBoDownloadable(items[i])) {
                    var bo;
                    eval("bo = new {0}();".format([items[i]]));
                    var cmds = new Array();
                    var dCmd = bo.dropTableCommand($.Ctx.DbConn);
                    var cCmd = bo.createTableCommand($.Ctx.DbConn);
                    cmds.push(dCmd);
                    cmds.push(cCmd);
                    var trn = new DbTran($.Ctx.DbConn);
                    trn.executeNonQuery(cmds);
                }
            }
            success();
        },
        error: function (err) {
            $.xlog.log('GB', err);
            fail(err);
        }
    });
}

SyncUtil.prototype.CreateAllTables = function (success, fail) {
    var jData = {};
    jData.bu = $.Ctx.Bu;
    jData.programId = $.Ctx.ProgramId;
    $.ajax({
        type: "POST",
        url: $.Ctx.SvcUrl + "/GetCreateTable",
        data: JSON.stringify(jData),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var items = $.parseJSON(data.d);
            var validTables = new Array();
            for (var i = 0; i <= items.length - 1; i++) {
                if ($.Sync.IsBoDownloadable(items[i])) {
                    var bo;
                    eval("bo = new {0}();".format([items[i]]));
                    var cCmd = bo.createTableCommand($.Ctx.DbConn);
                    cCmd.executeNonQuery();
                }

            }
            success();
        },
        error: function (err) {
            $.xlog.log('GB', err);
            fail(err);
        }
    });
}

SyncUtil.prototype.DropAllTables = function (success, fail) {
    var jData = {};
    jData.header = $.Ctx.GetDefaultHeader();
    $.ajax({
        type: "POST",
        url: $.Ctx.SvcUrl + "/GetAllTable",
        data: JSON.stringify(jData),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var items = $.parseJSON(data.d);
            for (var i = 0; i <= items.length - 1; i++) {
                var tName = items[i];
                var fStr = "bo = new {0}();";
                var nStr = fStr.format([tName]);
                var bo;
                try {
                    eval(nStr);
                }
                catch (err) {
                    $.xlog.log('GB', err);
                }
                if (bo != undefined) {
                    var cCmd = bo.dropTableCommand($.Ctx.DbConn);
                    cCmd.executeNonQuery(success, fail);
                }
            }
        },
        error: function (err) {
            $.xlog.log('GB', err);
            fail(err)
        }
    });


}


//errsMsg = Array,success = function(),fail = function(array);
SyncUtil.prototype.GetData = function (tableName, success, fail) {
    /////Get LastTimeStamp
    var lastTimeStamp = null;
    var startRow = 1;
    var cm = $.Ctx.DbConn.createSelectCommand();
    cm.sqlText = "SELECT * FROM HH_CLIENT_USER_RECEIVED_BU WHERE USER_ID = ? AND DEVICE_ID = ? AND PROGRAM_ID = ? AND TABLE_NAME = ? AND ORG_CODE =?";
    cm.parameters = [$.Ctx.UserId, $.Ctx.DeviceId, $.Ctx.ProgramId, tableName, $.Ctx.SubOp];
    cm.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            var ex = res.rows.item(0);
            var m = new HH_CLIENT_USER_RECEIVED_BU();
            m.retrieveRdr(ex);
            if (m.LAST_DATA_TIMESTAMP != null) {
                lastTimeStamp = m.LAST_DATA_TIMESTAMP;
            }
            if (m.TOTAL_ROW_COUNT != m.NO_ROW_RECEIVED) {
                startRow = m.NO_ROW_RECEIVED;
            }
        }
        $.Sync.GetDataInternal(lastTimeStamp, startRow, tableName, new Array(),

            function (doNotifyServer) {
                if (doNotifyServer) {
                    $.Sync.NotifyServerSend(tableName);
                }
                success();

            }, function (errs) {

                fail(errs);

            });
    });
}

SyncUtil.prototype.GetDataHeader = function () {
    var header = { ProgramId: $.Ctx.ProgramId, Bu: $.Ctx.Bu, DeviceId: $.Ctx.DeviceId, SalemansCode: $.Ctx.SalesMan, UserId: $.Ctx.UserId, TableName: null, StartRow: null, EndRow: null, LastTimeStamp: null, OrgCode: $.Ctx.SubOp, FarmOrg: $.Ctx.Warehouse, SubWarehouse: $.Ctx.SubWarehouse };

    return header;
}

SyncUtil.prototype.GetDataInternal = function (lastTimeStamp, startRow, tableName, errs, success, fail) {
    var jData = {};
    var pDate = null;
    if (lastTimeStamp != null) {
        pDate = (new XDate(lastTimeStamp)).toJsonDateStr();
    }
    jData.header = { ProgramId: $.Ctx.ProgramId, Bu: $.Ctx.Bu, DeviceId: $.Ctx.DeviceId, SalemansCode: $.Ctx.SalesMan, UserId: $.Ctx.UserId, Pass: $.Ctx.UserPassword, TableName: tableName, StartRow: startRow, EndRow: $.Ctx.RowsCommitLot + startRow - 1, LastTimeStamp: pDate, OrgCode: $.Ctx.SubOp, FarmOrg: $.Ctx.Warehouse, SubWarehouse: $.Ctx.SubWarehouse };
    ///console.log ('call ' + tableName + JSON.stringify(jData));
    $.ajax({
        type: "POST",
        url: $.Ctx.SvcUrl + "/GetData",
        data: JSON.stringify(jData),
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            var items = $.parseJSON(data.d)
            var totalRow = items.Count;
            console.log('Got ' + items.Table + ":" + items.Data.length);
            if (totalRow == 0) {
                if ((success != undefined) && (typeof (success) == "function")) {
                    success(false);
                }
                return;
            }
            var modelList = items.Data;

            var maxTimeStamp;
            var allCmds = new Array();

            for (var i = 0; i <= modelList.length - 1; i++) {
                /////Insert to SqlLite
                var m = eval("new " + tableName + "()");
                m.retrieveJson(modelList[i]);
                var dCmd = m.deleteCommand($.Ctx.DbConn);
                allCmds.push(dCmd);
                if (m.FUNCTION != "D") {
                    var iCmd = m.insertCommand($.Ctx.DbConn);
                    allCmds.push(iCmd);
                }

                maxTimeStamp = m.LAST_UPDATE_DATE;
            }

            ///Insert to HH_CLIENT_RECEIVED
            var m = new HH_CLIENT_USER_RECEIVED_BU();
            m.BUSINESS_UNIT = $.Ctx.Bu;
            m.DEVICE_ID = $.Ctx.DeviceId;
            m.PROGRAM_ID = $.Ctx.ProgramId;
            m.ORG_CODE = $.Ctx.SubOp;
            m.USER_ID = $.Ctx.UserId;
            m.TABLE_NAME = tableName;
            m.LAST_PK_DATA = m.getPkConditionParam().toString();
            m.LAST_DATA_TIMESTAMP = maxTimeStamp;
            m.TOTAL_ROW_COUNT = totalRow;
            m.NO_ROW_RECEIVED = modelList.length + startRow - 1;
            m.LAST_UPDATE_DATE = (new XDate()).toDbDateStr();
            if (m.TOTAL_ROW_COUNT == m.NO_ROW_RECEIVED) {
                m.LAST_DATA_TIMESTAMP = maxTimeStamp;
            }
            var dCmd = m.deleteCommand($.Ctx.DbConn);
            var iCmd = m.insertCommand($.Ctx.DbConn);
            allCmds.push(dCmd);
            allCmds.push(iCmd);

            var bErrs = errs;
            var dbTran = new DbTran($.Ctx.DbConn);
            var lts = lastTimeStamp;
            console.log('beforeex ' + items.Table + ":" + items.Data.length);
            dbTran.executeNonQuery(allCmds, function () {
                    console.log('Finish ' + items.Table + ":" + items.Data.length);
                    if (m.TOTAL_ROW_COUNT > m.NO_ROW_RECEIVED) {
                        //Call next lot
                        $.Sync.GetDataInternal(lts, m.NO_ROW_RECEIVED + 1, tableName, bErrs, success, fail);
                    } else {
                        if ((success != undefined) && (typeof (success) == "function")) {
                            success(true);
                        }
                    }
                }, function (err) {
                    console.log('Error ' + items.Table + ":" + err);
                    bErrs.push(err.message);
                    if ((fail != undefined) && (typeof (fail) == "function")) {
                        fail(bErrs);
                    }
                }
            );
        },
        error: function (xmlhttprequest, textstatus, message) {
            var s = tableName + ":" + textstatus + message;
            errs.push(s);
            console.log('Download not complete' + s);
            if ((fail != undefined) && (typeof (fail) == "function")) {
                fail(errs);
            }
        }
    });
}

SyncUtil.prototype.NotifyServerSend = function (tableName) {
    var cm = $.Ctx.DbConn.createSelectCommand();
    cm.sqlText = "SELECT * FROM HH_CLIENT_USER_RECEIVED_BU WHERE USER_ID = ? AND DEVICE_ID = ? AND PROGRAM_ID = ? AND TABLE_NAME = ?";
    cm.parameters = [$.Ctx.UserId, $.Ctx.DeviceId, $.Ctx.ProgramId, tableName];
    cm.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            var ex = res.rows.item(0);
            var m = new HH_CLIENT_USER_RECEIVED_BU();
            m.retrieveRdr(ex);
            /////Update HH_SERVER_SEND_BU
            var jData = {};
            jData.header = { ProgramId: $.Ctx.ProgramId, Bu: $.Ctx.Bu, DeviceId: $.Ctx.DeviceId, SalemansCode: $.Ctx.SalesMan, UserId: $.Ctx.UserId, Pass: $.Ctx.UserPassword, TableName: tableName, StartRow: 0, EndRow: 0, LastTimeStamp: null, OrgCode: $.Ctx.SubOp, FarmOrg: $.Ctx.Warehouse, SubWarehouse: $.Ctx.SubWarehouse };
            jData.RowsReceived = m.NO_ROW_RECEIVED;
            $.ajax({
                type: "POST",
                url: $.Ctx.SvcUrl + "/UpdateHHServerSend",
                data: JSON.stringify(jData),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    $.xlog.log('GB', "Notify HH_SERVER_SEND_BU Success");
                },
                error: function (err) {
                    $.xlog.log('GB', "Fail to notify HH_SERVER_SEND_BU");
                    $.xlog.log('GB', err);
                }
            });
        }
    });
}

SyncUtil.prototype.IsBoDownloadable = function (tableName) {
    var bo;
    try {
        eval("var bo = new {0}();".format([tableName]));
    }
    catch (err) {
        $.xlog.log('GB', err);
    }
    if (bo != undefined && bo != null) {
        var fs = bo.getFields();
        var pk = new Array();
        for (var i = 0; i < fs.length; i++) {
            if (fs[i].remark == 'Pk') {
                return true;
            }
        }
    }
    return false;
}

SyncUtil.prototype.IsBoUploadable = function (tableName) {
    var bo;
    try {
        eval("var bo = new {0}();".format([tableName]));
    }
    catch (err) {
        $.xlog.log('GB', err);
    }
    var hasPk = false;
    var hasFlag = false;
    if (bo != undefined && bo != null) {
        var fs = bo.getFields();
        var pk = new Array();
        for (var i = 0; i < fs.length; i++) {
            if (fs[i].remark == 'Pk') {
                hasPk = true;
            }
            if (fs[i].key == 'NUMBER_OF_SENDING_DATA') {
                hasFlag = true;
            }
        }
    }
    return hasPk && hasFlag;
}

SyncUtil.prototype.CheckDownloadable = function (success, fail) {
    var jData = {};
    jData.header = $.Ctx.GetDefaultHeader();
    $.ajax({
        type: "POST",
        url: $.Ctx.SvcUrl + "/GetDownloadable",
        data: JSON.stringify(jData),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var items = $.parseJSON(data.d);
            success(items);
        },
        error: function (error) {
            if ((fail != undefined) && (typeof (fail) == "function")) {
                fail(error);
            }
        }
    });
}
//tables = Array of String,errose = Array,success = function(),fail=function(errs)
SyncUtil.prototype.DownloadTables = function (tables, success, fail, progress) {
    var count = 0;
    var validTables = new Array();
    var errs = new Array();
    for (var i = 0; i <= tables.length - 1; i++) {
        if ($.Sync.IsBoDownloadable(tables[i])) {
            validTables.push(tables[i]);
        }
    }


    for (var i = 0; i <= validTables.length - 1; i++) {
        $.Sync.GetData(validTables[i], function () {
                count += 1;
                progress(count, validTables.length);
                if (count == validTables.length) {
                    var jData = {};
                    jData.header = $.Ctx.GetDefaultHeader();
                    $.ajax({
                        type: "POST",
                        url: $.Ctx.SvcUrl + "/SetDownloadUserDevice",
                        data: JSON.stringify(jData),
                        contentType: "application/json; charset=utf-8"
                    });


                    if (errs.length == 0) {
                        console.log('success' + validTables[i]);
                        success();
                    } else {
                        console.log('err' + validTables[i]);
                        console.log(errs);
                        fail(errs.toString());
                    }
                }
            },
            function (err) {

                errs.push(err);
                count += 1;
                if (count == validTables.length) {
                    if (errs.length == 0) {
                        console.log('success' + validTables[i]);
                        success();
                    } else {

                        fail(errs);
                    }
                }
            });


    }
}

SyncUtil.prototype.DownloadAll = function (success, fail, progress) {
    var jData = {};
    jData.header = $.Ctx.GetDefaultHeader();
    console.log(jData.header);
    $.ajax({
        type: "POST",
        url: $.Ctx.SvcUrl + "/GetDownloadTable",
        data : JSON.stringify(jData),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var items = $.parseJSON(data.d);
            $.Sync.DownloadTables(items, function () {
                success();
                $.Sync.PurgeDownloadTable();
            }, fail, progress);
        }
    });
}

var successTable = new Array();
var failTable = new Array();
SyncUtil.prototype.UploadAll = function (success, fail, progress) {
    successTable = new Array();
    failTable = new Array();
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
            $.Sync.UploadTables(items,uploadCompleteLog, success, fail, progress);
        }
    });

}
//tables = Array of String,error = Array,success = function(),fail=function(errs)
SyncUtil.prototype.UploadTables = function (tables,uploadCompleteLog, success, fail, progress) {
    var count = 0;
    var errs = new Array();
    var validTables = new Array();
    for (var i = 0; i <= tables.length - 1; i++) {
        if ($.Sync.IsBoUploadable(tables[i].TABLE_NAME)) {
            validTables.push(tables[i]);
        }
    }

    for (var i = 0; i <= validTables.length - 1; i++) {
        $.Sync.SendData(validTables[i].TABLE_NAME,validTables[i].UPLOAD_CONNECTION,validTables[i].CLIENT_UPLOAD_STATEMENT, function () {
                count += 1;
                progress(count, validTables.length);
                if (count == validTables.length){
                    var jDat = {};
                    jDat.header = $.Ctx.GetDefaultHeader();
                    jDat.SuccessTable = JSON.stringify(successTable);
                    jDat.uploadCompleteLog =uploadCompleteLog.UPLOAD_CONNECTION;
                    if (failTable.length !=0){
                        jDat.FailTable = JSON.stringify(failTable);
                    }
                    $.ajax({
                        type: "POST",
                        url: $.Ctx.SvcUrl + "/UploadComplete",
                        data: JSON.stringify(jDat),
                        contentType: "application/json; charset=utf-8"
                    });
                    if (errs.length == 0) {
                        console.log('success');
                        success(uploadCompleteLog.UPLOAD_CONNECTION);
                    } else {
                        console.log('err');
                        console.log(errs);
                        fail(errs.toString());
                    }
                }
            },
            function (err) {
                errs.push(err);
                count += 1;
                if (count == validTables.length) {
                    var jDat = {};
                    jDat.header = $.Ctx.GetDefaultHeader();
                    jDat.SuccessTable = JSON.stringify(successTable);
                    jDat.FailTable = JSON.stringify(failTable);

                    $.ajax({
                        type: "POST",
                        url: $.Ctx.SvcUrl + "/UploadComplete",
                        data: JSON.stringify(jDat),
                        contentType: "application/json; charset=utf-8"
                    });
                    if (errs.length == 0) {
                        console.log('success' + validTables[i].TABLE_NAME);
                        success(uploadCompleteLog.UPLOAD_CONNECTION);
                    } else {
                        fail(errs);
                    }
                }
            });
    }
}

//success = function(),fail = function(array);
SyncUtil.prototype.SendData = function (tableName,ConnectionStr,ClientUploadStatement, success, fail) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var tableBo = eval('new {0}()'.format([tableName]));
    var IsFailTable = true;
    var IsFailParameter ;

    if (_.where(tableBo.getFields(),{key:"NUMBER_OF_SENDING_DATA"}).length >0){
        var sqlText = "SELECT * FROM {0} WHERE NUMBER_OF_SENDING_DATA IS 0 ".format([tableName]);
        var WhereArray = new Array();
        if (! IsObjNullOrEmpty(ClientUploadStatement) ) {
            WhereArray = ClientUploadStatement.match(/@\w*/g);
            sqlText = sqlText + " AND " + ClientUploadStatement;
        }
        cmd.sqlText =sqlText;
        for (var i =0; i < WhereArray.length; i =i+1){
            var paramVal = $.Ctx[WhereArray[i].replace("@","")];
            if (paramVal != undefined){
                cmd.parameters.push(paramVal);
            }else{
                IsFailParameter = WhereArray[i];
                IsFailTable =false;
                break;
            }
        }
        if (IsFailTable == true){
            cmd.executeReader(function (tx, res) {
                var dataLst = new Array();
                var isTableHaveDataUpdate = false;
                for (var i = 0; i < res.rows.length; i++) {
                    var m = eval('new {0}()'.format([tableName]));
                    m.retrieveRdr(res.rows.item(i));
                    dataLst.push(m);
                }
                if (res.rows.length !=0){
                    $.Sync.SendDataInternal(dataLst, tableName,ConnectionStr, new Array(), function(){
                        successTable.push(tableName);
                        success();
                    }, function(err){
                        failTable.push(tableName);
                        fail(err)
                    });
                }
                else{
                    success();
                }
//        $.Sync.SendDataInternal(dataLst, tableName,ConnectionStr, new Array(), success, fail);
            }, function (err) {
                fail(err);
            });
        }else{
            console.log(tableName + " does not parameter exsist in global :: " + IsFailParameter);
            failTable.push(tableName);
            fail(tableName + " does not parameter exsist in global :: " + IsFailParameter);

        }

    }else{
        console.log(tableName + " does not have NUMBER_OF_SENDING_DATA ");
        failTable.push(tableName);
        fail(tableName + " does not have NUMBER_OF_SENDING_DATA ");
    }
}

SyncUtil.prototype.SendDataInternal = function (dataList, tableName, ConnectionStr, errs, success, fail) {
    var jData = {};
    var h = $.Ctx.GetDefaultHeader();
    h.TableName = tableName;
    var a = new Array();
    for (var i = 0; i < dataList.length; i++) {
        dataList[i].NUMBER_OF_SENDING_DATA = 1;
        a.push(JSON.stringify(dataList[i]));
    }
    jData.header = h;
    jData.dat = a;
    jData.ConnectionStr = ConnectionStr;
    $.ajax({
        type: "POST",
        url: $.Ctx.SvcUrl + "/SendData",
        data: JSON.stringify(jData),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var items = (data.d);
            var uCmds = new Array();
            var serverErr = new Array();
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var m = dataList[item.Inx];
                if (item.ErrStr == null) {
                    var uCmd = m.updateCommand($.Ctx.DbConn);
                    uCmds.push(uCmd);
                } else {
                    serverErr.push("Table {0}, record {1} error :{2}".format([jData.header.TableName, item.Inx, item.ErrStr]));
                }
            }
            var bErrs = errs;
            var trn = new DbTran($.Ctx.DbConn);
            var tableName = jData.header.TableName;
            trn.executeNonQuery(uCmds, function (tx, res) {
                if (serverErr.length == 0) {
                    if ((success != undefined) && (typeof (success) == "function")) {
                        success();
                    }
                } else {
                    bErrs = bErrs.concat(serverErr);
                    if ((fail != undefined) && (typeof (fail) == "function")) {
                        fail(bErrs);
                    }
                }

            }, function (err) {
                bErrs.push(err.message);
                if ((fail != undefined) && (typeof (fail) == "function")) {
                    fail(bErrs);
                }
            });

        },
        error: function (xmlhttprequest, textstatus, message) {
            var s = "upload error:" + tableName + ":" + textstatus + message;
            errs.push(s);
            console.log(s);
            if ((fail != undefined) && (typeof (fail) == "function")) {
                fail(errs);
            }
        }
    });

}


SyncUtil.prototype.PurgeDownloadTable = function (success, fail, progress) {
    var jData = {};
    jData.bu = $.Ctx.Bu;
    jData.programId = $.Ctx.ProgramId;
    $.ajax({
        type: "POST",
        url: $.Ctx.SvcUrl + "/GetPurgeDownloadTable",
        data: JSON.stringify(jData),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var items = data.d;
            if (items != null) {
                if (items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        var ob = items[i];
                        var statement = "";
                        try {
                            if (!IsNullOrEmpty(ob.Value)) {
                                var cmd = $.Ctx.DbConn.createSelectCommand();
                                cmd.sqlText = "DELETE FROM {0} WHERE {1}".format([ob.Key, ob.Value]);
                                statement = cmd.sqlText;
                                cmd.executeNonQuery(function (tx, res) {

                                }, function (err) {
                                    console.log("error purging data: {0}".format([statement]));
                                    console.log(err.message);
                                });
                            }
                        }
                        catch (err) {
                            console.log("error purging statement: {0}".format([statement]));
                        }
                    }
                }
            }

        }
    });
}


SyncUtil.prototype.PurgeUploadTable = function (UploadConnection,success, fail, progress) {
    var jData = {};
    jData.bu = $.Ctx.Bu;
    jData.programId = $.Ctx.ProgramId;
    jData.UploadConnection = UploadConnection;
    $.ajax({
        type: "POST",
        url: $.Ctx.SvcUrl + "/GetPurgeUploadTable",
        data: JSON.stringify(jData),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var items = data.d;
            if (items != null) {
                if (items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        var ob = items[i];
                        var statement = "";
                        try {
                            if (!IsNullOrEmpty(ob.Value)) {
                                var cmd = $.Ctx.DbConn.createSelectCommand();
                                cmd.sqlText = "DELETE FROM {0} WHERE {1}".format([ob.Key, ob.Value]);
                                statement = cmd.sqlText;
                                cmd.executeNonQuery(function (tx, res) {

                                }, function (err) {
                                    console.log("error purging data: {0}".format([statement]));
                                    console.log(err.message);
                                });
                            }
                        }
                        catch (err) {
                            console.log("error purging statement: {0}".format([statement]));
                        }
                    }
                }
            }

        }
    });
}


$.Sync = new SyncUtil();


function Utilities() {
    this.UiLangs = new Object();
    this.buffer = 0;
}

Utilities.prototype.GetGUID = function () {
    var fStr = "{0}-{1}";
    var d = new XDate();
    var dStr = d.getFullYear().toString().substr(2, 2) + (d.getMonth() + 1).toString().lpad("0", 2) + d.getDate().toString().lpad("0", 2) + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString() + d.getMilliseconds().toString().lpad("0", 4);
    this.buffer += 1;
    if (this.buffer >= 999) {
        this.buffer = 0;
    }
    dStr += this.buffer.toString().lpad("0", 3);
    return fStr.format([$.Ctx.DeviceId.toString().lpad("0", 4), dStr]);
}

Utilities.prototype.PingServer = function (success, fail) {

}

Utilities.prototype.PingGoogle = function (success, fail) {

}

Utilities.prototype.Ping = function (url, returnType, success, fail) {

}


Utilities.prototype.RenderUiLang = function (pageName, doNext) {

    var dat = localStorage['uilang-' + pageName];
    if ((dat != null) && (dat != undefined)) {
        $.Util.UiLangs[pageName] = $.parseJSON(dat);
        var uiLangs = $.Util.UiLangs[pageName];

        if ((uiLangs != null) && (uiLangs != undefined)) {
            for (i = 0; i < uiLangs.length; i++) {
                var m = uiLangs[i];
                var p = $('#' + pageName);
                if (p != undefined && p != null) {
                    var o = p.find('[data-lang="' + m.OBJECT_ID + '"]');

                    if (o != undefined && o != null) {

                        if (o.length != undefined) {
                            for (j = 0; j < o.length; j++) {
                                var x = $(o[j]);
                                if (x.attr != undefined) {
                                    if (m.ATTR_ID == 'html') {
                                        if ($.Ctx.Lang == "en-US") {
                                            x.html(m.TEXT_ENG);
                                        } else {
                                            x.html(m.TEXT_LOCAL);
                                        }
                                    } else {
                                        if ($.Ctx.Lang == "en-US") {
                                            x.attr(m.ATTR_ID, m.TEXT_ENG);
                                        } else {
                                            x.attr(m.ATTR_ID, m.TEXT_LOCAL);
                                        }
                                    }
                                }
                            }
                        } else {
                            if (o.attr != undefined) {
                                if (m.ATTR_ID == 'html') {
                                    if ($.Ctx.Lang == "en-US") {
                                        o.html(m.TEXT_ENG);
                                    } else {
                                        o.html(m.TEXT_LOCAL);
                                    }
                                } else {
                                    if ($.Ctx.Lang == "en-US") {
                                        o.attr(m.ATTR_ID, m.TEXT_ENG);
                                    } else {
                                        o.attr(m.ATTR_ID, m.TEXT_LOCAL);
                                    }
                                }
                            }
                        }

                    }

                }
            }
        }



    }


    //retrieve original UI lang data;
    var ele = $('#' + pageName + ' [data-lang]');

    if ($.Ctx.UiLangExport == true) {
        for (var i = 0; i < ele.length; i++) {
            try {
                //console.log($(ele[i]).html());
                var m = new HH_UI_LANG_EXPORT();
                m.FORM_ID = pageName;
                m.LAST_UPDATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
                m.NUMBER_OF_SENDING_DATA = 0;
                m.OBJECT_ID = $(ele[i]).attr('data-lang');
                m.OWNER = $.Ctx.UserId;
                m.PROGRAM_ID = $.Ctx.ProgramId;
                m.TEXT_ORIGINAL = $(ele[i]).html();
                var iCmd = m.insertCommand($.Ctx.DbConn);
                iCmd.executeNonQuery();
            } catch (err) {
                //do nothing
            }

        }

    }

}

$.Util = new Utilities();

function LookupParam() {
    this.title = null;
    this.dataSource = null;
    this.codeField = null;
    this.nameField = null;
    this.calledPage = null;
    this.calledResult = null;
    this.showCode = true;
    this.showName = true;
}


accounting.settings = {
    currency: {
        symbol: "", // default currency symbol is '$'
        format: "%s%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
        decimal: ".", // decimal point separator
        thousand: ",", // thousands separator
        precision: 2   // decimal places
    },
    number: {
        precision: 0, // default precision on numbers is 0
        thousand: ",",
        decimal: "."
    }
}
// These can be changed externally to edit the library's defaults:
accounting.settings.currency.format = "%s %v";

// Format can be an object, with `pos`, `neg` and `zero`:
accounting.settings.currency.format = {
    pos: "%s %v", // for positive values, eg. "$ 1.00" (required)
    neg: "%s (%v)", // for negative values, eg. "$ (1.00)" [optional]
    zero: "%s  0 "  // for zero values, eg. "$  --" [optional]
};

// Example using underscore.js - extend default settings (also works with $.extend in jQuery):
accounting.settings.number = _.defaults({
    precision: 2,
    thousand: " "
}, accounting.settings.number);


//$(document).bind("mobileinit", function(){
//                 console.log('mobileinit');
//                 $.mobile.metaViewportContent = "width=device-width, minimum-scale=1, maximum-scale=2";
//                 });

//$(window).bind('orientationchange',function(e){
//    console.log('orientationchange');
//    if(e.orientation=='portrait'){
//        // $.Ctx.MsgBox('portrait');
//        var meta = $("meta[name=viewport]");
//        meta.attr("content","width=device-width, minimum-scale=1.0, maximum-scale=2.0, initial-scale=1.0, user-scalable=no");
//    }else if(e.orientation=='landscape'){
//        var meta = $("meta[name=viewport]");
//        meta.attr("content","width=device-width, minimum-scale=1.0, maximum-scale=2.0, initial-scale=1.2, user-scalable=no");
//        // $.Ctx.MsgBox('landscape');
//    }
//});





$(document).bind('pageinit', function () {
    $('input').live('focus', function () {
        var $this = $(this);
        this.setSelectionRange(0, 9999);
        // Work around Chrome's little problem
        $this.mouseup(function () {
            // Prevent further mouseup intervention
            $this.unbind("mouseup");
            return false;
        });
    });
    $('.keynum').bind('keypress', function (e) {
        return (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) ? false : true;
    });
    //    if($.Ctx.IsDevice == true ){
    //        document.addEventListener("deviceready", function (){
    //            document.addEventListener("resume",onResume,false);
    //        }, false);
    //        function onResume (){
    //            $.Ctx.LoadPage('index',[],null);
    //        }
    //    }
    jQuery.extend(jQuery.mobile.datebox.prototype.options, {
        //'overrideDateFieldOrder': ["y", "m","d"],
        useLang: $.Ctx.Lang
    });
    //    var BoxDate = $("#datefrom-text");
    //    if ((BoxDate != null) && (BoxDate != undefined)) {
    //        BoxDate.datebox();
    //    }

    var uiFooter = $.Util.UiLangs["iFarm"];
    if ((uiFooter != null) && (uiFooter != undefined)) {
        for (i = 0; i < uiFooter.length; i++) {
            var m = uiFooter[i];
            var p = document;
            if (p != undefined && p != null) {
                var o = $('[id="' + m.OBJECT_ID + '"]');
                if (m.OBJECT_ID == "SearchFilter") {
                    o = $(".ui-listview-filter input:jqmData(type='search')");
                }

                if (o != undefined && o != null) {
                    if (o.attr != undefined) {
                        if (m.ATTR_ID == 'html') {
                            if ($.Ctx.Lang == "en-US") {
                                o.html(m.TEXT_ENG);
                            } else {
                                o.html(m.TEXT_LOCAL);
                            }
                        } else {
                            if ($.Ctx.Lang == "en-US") {
                                o.attr(m.ATTR_ID, m.TEXT_ENG);
                            } else {
                                o.attr(m.ATTR_ID, m.TEXT_LOCAL);
                            }
                        }
                    }
                }

            }

        }

    }
});


GENERIC_LOOKUP.prototype = new BaseBo();
function GENERIC_LOOKUP() {
    this.CODE = null;
    this.NAME = null;
    this.DESC1 = null;
    this.DESC2 = null;
    this.DESC3 = null;
    this.DATE1 = null;
    this.DATE2 = null;
}

GENERIC_LOOKUP.prototype.getTableName = function () {
    return "GENERIC_LOOKUP";
}

GENERIC_LOOKUP.prototype.getFields = function () {
    var ret = new Array;
    ret.push({ key: 'CODE', remark: 'Pk', val: 'text' });

    ret.push({ key: 'NAME', val: 'numeric' });

    ret.push({ key: 'DESC1', val: 'text' });

    ret.push({ key: 'DESC2', val: 'text' });

    ret.push({ key: 'DESC3', val: 'text' });

    ret.push({ key: 'DATE1', val: 'date' });

    ret.push({ key: 'DATE2', val: 'date' });

    return ret;
}





