//Only for Farm module
function FarmVar() {
    //B=Barcode ,N=NFC
    this.sDevice = null;
    this.reportDateFormat = 'dd/MM/yy';
}


FarmVar.prototype.RenderWebUiLang = function (pageName, doNext) {
    //call ajax
    var dat = localStorage['uilang-' + pageName];
    if ((dat != null) && (dat != undefined)) {
        $.Util.UiLangs[pageName] = $.parseJSON(dat);
        $.FarmCtx.ReplaceWebUiLang(pageName,$.Util.UiLangs[pageName],doNext);
    }

    var dat2 = localStorage['uilang-' + 'iFarm_Report'];
    if ((dat2 != null) && (dat2 != undefined)) {
        $.Util.UiLangs['iFarm_Report'] = $.parseJSON(dat2);
    }
     
     var reportPage = $.Ctx.GetPageParam('online_report', 'ReportDesc');

                    var jData = {};
                    jData.pageName = reportPage;
                    jData.lang = $.Ctx.Lang;

                    var jsonText = JSON.stringify(jData);
                    $.ajax({
                        type: "Post",
                        url: $.Ctx.ReportUrl + "/GetReportName",
                        data: jsonText,
                        contentType: "application/json; charset=utf-8",
                        success: function (data) {
                            $('#' + pageName + ' div h1').html(data.d);
                        },
                        error: function (data) {
                            $('#' + pageName + ' div h1').html(reportPage);
                        }
                    });

}

function GetQStrs() {
    var assoc = {};
    var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');

    for (var i in keyValues) {
        var key = keyValues[i].split('=');
        if (key.length > 1) {
            assoc[decode(key[0])] = decode(key[1]);
        }
    }
    return assoc;
}

FarmVar.prototype.ReplaceWebUiLang = function (pageName, uiLangs,doNext) {  
  

        if ((uiLangs != null) && (uiLangs != undefined)) {
            for (var i = 0; i < uiLangs.length; i++) {
                var m = uiLangs[i];
                var p = $('#' + pageName);
                if (p != undefined && p != null) {
                    var x = p.find('[data-lang="' + m.OBJECT_ID + '"]');
                    if (x != undefined && x != null) {
                        for (j=0;j< x.length;j++){
                            var o = $(x[j]);
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
    

//    //retrieve original UI lang data;
//    var ele = $('#' + pageName + ' [data-lang]');

//    if ($.Ctx.UiLangExport == true) {
//        for (var i = 0; i < ele.length; i++) {
//            try {
//                //console.log($(ele[i]).html());
//                var m = new HH_UI_LANG_EXPORT();
//                m.FORM_ID = pageName;
//                m.LAST_UPDATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
//                m.NUMBER_OF_SENDING_DATA = 0;
//                m.OBJECT_ID = $(ele[i]).attr('data-lang');
//                m.OWNER = $.Ctx.UserId;
//                m.PROGRAM_ID = $.Ctx.ProgramId;
//                m.TEXT_ORIGINAL = $(ele[i]).html();
//                var iCmd = m.insertCommand($.Ctx.DbConn);
//                iCmd.executeNonQuery();
//            } catch (err) {
//                //do nothing
//            }

//        }

//    }

}
FarmVar.prototype.LoadReport = function (previous, rptName, programId, formId, rParams) {
    $.Ctx.SetPageParam('WebReport', 'Previous', previous);
    $.Ctx.PersistPageParam();
    var tmpl = "&P={0}&T=C&V={1}";
    var tmpld = "&P={0}&T=D&V={1}";
    var url = "WebReport.aspx?Report={0}&Program={1}&Form={2}&Conn=PPConnection&Lang=en-US&LocalLang=zh-CN".format([rptName, programId, formId]);
    for (key in rParams) {
        var p = ""
        if (rParams[key].toDbDateStr == undefined) {
            p = tmpl.format([key, rParams[key]]);

        } else {
            p = tmpld.format([key, rParams[key].toDbDateStr()]);
        }

        url += p;
    }
    //$.mobile.loadPage(url);
    window.location = url;
    $('#'+programId+' #btnPrint').removeClass("ui-disabled");
    //WebReport.aspx?R=FRSWMSFERA118&U=PPConnection&Lang=en-US&LocalLang=zh-CN&P=org_code&T=C&V=550222001&P=farm_org&T=C&V=642001-0-10-4-002&P=par_date&T=C&V=22/03/2013&P=par_date_th&T=C&V=22/03/2013&P=Param_Format&T=C&V=dd/mm/yyyy&P=para_lang&T=C&V=CHN&P=project&T=C&V=SW&P=ParInt_Type&T=C&V=XXX
}


//success(result),error(message)
//return object with fields =  SWINE_ID,SWINE_TRACK,SWINE_DATE_IN
FarmVar.prototype.FindSwineCode = function (orgCode, swineCode, success, error) {

    var cmd = $.Ctx.DbConn.createSelectCommand($.Ctx.DbConn);
    cmd.sqlText = "SELECT * FROM FR_MAS_SWINE_CODE WHERE ORG_CODE = '{0}' AND SWINE_CODE = '{1}' ".format([orgCode, swineCode]);
    cmd.executeReader(function (tx, res) {
        if (res.rows.length == 0) {
            alert($.Ctx.Lcl("FarmCtx", "MSG01", "No Mapping SwineID"));
            success(null);
        } else {
            var m = new FR_MAS_SWINE_CODE();
            m.retrieveRdr(res.rows.item(0));
            success(m);
        }

    }, function (err) {
        alert(err.message);
        error(err);
    });

}

//success(),error(message)
//return object with fields = SWINE_ID,SWINE_TRACK,SWINE_DATE_IN,LAST_ACTIVITY_TYPE,LAST_ACTIVITY_DATE,SEX,LOCATION
FarmVar.prototype.SowAvailableID = function (orgCode, farmOrg, transactionDate, swineId, swineTrack, swineDateIn, activityType, success, error) {
    var cmd = $.Ctx.DbConn.createSelectCommand($.Ctx.DbConn);
    cmd.sqlText = "SELECT A.* , F.LOCATION FROM HH_FR_MS_SWINE_ACTIVITY A, FR_FARM_ORG F WHERE A.ORG_CODE = '{0}' AND A.FARM_ORG = '{1}' FarmOrg AND A.ACTIVITY_DATE <=  '{2}' AND A.SWINE_ID = '{3}' AND A.SWINE_TRACK = '{4}' AND A.SWINE_DATE_IN = '{5}' AND A.SEX = 'F' AND A.NEXT_ACTIVITY_TYPE IS NULL AND A.NUMBER_OF_SENDING_DATA IS NOT 1 AND A.ORG_CODE = F.ORG_CODE AND A.RELEASE_FARM_ORG_LOC = F.FARM_ORG AND F.LOCATION IN ( '1' ,'6') AND A.ACTIVITY_TYPE IN ( SELECT FROM_STATE FROM FR_MAS_STATE_INFORMATION WHERE STATE_RULE_FIELD='ACTIVITY' AND TO_STATE= '{6}' ) ORDER BY A.ORG_CODE , A.FARM_ORG , A.SWINE_ID , A.SWINE_TRACK , A.SWINE_DATE_IN , A.ACTIVITY_TYPE ".format([orgCode, farmOrg, transactionDate, swineId, swineTrack, swineDateIn, activityType]);
    cmd.executeReader(function (tx, res) {
        if (res.rows.length > 0) {
            var m = new HH_FR_MS_SWINE_ACTIVITY();
            m.retrieveRdr(res.rows.item(0));
            m.LOCATION = res.rows.item(0).LOCATION;
            success(m);
        } else {
            success(null);
        }
    }, function (err) {
        error(err);
    });
}

//success(resultList),error(message)
//return object with fields = SWINE_ID,SWINE_TRACK,SWINE_DATE_IN,LAST_ACTIVITY_TYPE,LITNO1,LITNO2,SEX
FarmVar.prototype.SowAvailableList = function (orgCode, farmOrg, transactionDate, activityType, success, error) {
    var cmd = $.Ctx.DbConn.createSelectCommand($.Ctx.DbConn);
    cmd.sqlText = "SELECT A.* , F.LOCATION FROM HH_FR_MS_SWINE_ACTIVITY A, FR_FARM_ORG F WHERE A.ORG_CODE = '{0}'  AND A.FARM_ORG = '{1}' AND A.ACTIVITY_DATE <= '{2}' AND A.SEX = 'F' AND A.NEXT_ACTIVITY_TYPE IS NULL AND A.NUMBER_OF_SENDING_DATA IS NOT 1 AND A.ORG_CODE = F.ORG_CODE AND A.RELEASE_FARM_ORG_LOC = F.FARM_ORG AND F.LOCATION IN ( '1' ,'6') AND A.ACTIVITY_TYPE IN ( SELECT FROM_STATE FROM FR_MAS_STATE_INFORMATION WHERE STATE_RULE_FIELD='ACTIVITY' AND TO_STATE= '{3}' ) ORDER BY A.ACTIVITY_DATE, A.ACTIVITY_TYPE".format([orgCode, farmOrg, transactionDate, activityType]);
    cmd.executeReader(function (tx, res) {
        var resultList = new Array();
        for (var i = 0; i < res.rows.length; i++) {
            var m = new HH_FR_MS_SWINE_ACTIVITY();
            m.retrieveRdr(res.rows.item(i));
            m.LOCATION = res.rows.item(i).LOCATION;
            resultList.push(m);
        }
        success(resultList);
    }, function (err) {
        error(err);
    });
}

FarmVar.prototype.BoarAvailableList = function (orgCode, farmOrg, transactionDate, activityType, success, error) {
    var cmd = $.Ctx.DbConn.createSelectCommand($.Ctx.DbConn);
    cmd.sqlText = "SELECT * FROM HH_FR_MS_SWINE_ACTIVITY WHERE ORG_CODE = '{0}' AND FARM_ORG = '{1}' AND NEXT_ACTIVITY_TYPE IS NULL AND ACTIVITY_DATE <= '[2}' AND SEX = 'M' AND ACTIVITY_TYPE IN ( SELECT FROM_STATE FROM FR_MAS_STATE_INFORMATION WHERE STATE_RULE_FIELD='ACTIVITY' AND TO_STATE= '{3}' )".format([orgCode, farmOrg, transactionDate, activityType]);
    cmd.executeReader(function (tx, res) {
        var resultList = new Array();
        for (var i = 0; i < res.rows.length; i++) {
            var m = new HH_FR_MS_SWINE_ACTIVITY();
            m.retrieveRdr(res.rows.item(i));
            resultList.push(m);
        }
        success(resultList);
    }, function (err) {
        error(err);
    });
}

//model = HH_FR_SWINE_ACTIVITY
//success([updatePreviousActivityCommand,insertCurrentActivityCommand];
FarmVar.prototype.SwineActivityAdd = function (model, success, error) {
    var ret = new Array();
    $.FarmCtx.SwineActivitySelectPrevious(model, model.ACTIVITY_DATE, model.PREVIOUS_ACTIVITY_TYPE,
        function (previous) {
            var sDate = $.Ctx.GetLocalDateTime().toDbDateStr();
            if (previous != null) {
                previous.NEXT_ACTIVITY_TYPE = model.ACTIVITY_TYPE
                previous.NEXT_ACTIVITY_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
                previous.LAST_UPDATE_DATE = sDate;
                previous.OWNER = $.Ctx.UserId;
                previous.FUNCTION = "C";
                previous.NUMBER_OF_SENDING_DATA = 0;
                var uCmd = previous.updateCommand($.Ctx.DbConn);
                ret.push(uCmd);
                model.LAST_ACTIVITY_DATE = previous.ACTIVITY_DATE;
                model.LAST_ACTIVITY_TYPE = previous.ACTIVITY_TYPE;
                model.RELEASE_FARM_ORG_LOC = previous.RELEASE_FARM_ORG_LOC;
                model.BREEDER = previous.BREEDER;
                model.SEX = previous.SEX;
                model.ACTIVITY_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
                model.ACTIVITY_TYPE = model.ACTIVITY_TYPE
                model.NEXT_ACTIVITY_DATE = null;
                model.NEXT_ACTIVITY_TYPE = null;
                model.LAST_UPDATE_DATE = sDate;
                model.CREATE_DATE = sDate;
                model.OWNER = $.Ctx.UserId;
                model.FUNCTION = "A";
                model.NUMBER_OF_SENDING_DATA = 0;
                var iCmd = model.insertCommand($.Ctx.DbConn);
                ret.push(iCmd);
                success(ret);
            } else {
                error('Cannot find previous activity');
            }
        }, error);
}

//model = HH_FR_SWINE_ACTIVITY
//success([updatePreviousActivityCommand,updateCurrentActivityCommand];
FarmVar.prototype.SwineActivityUpdate = function (model, success, error) {
    var ret = new Array();
    $.FarmCtx.SwineActivitySelectPrevious(model, model.LAST_ACTIVITY_DATE, model.LAST_ACTIVITY_TYPE,
        function (previous) {
            var sDate = $.Ctx.GetLocalDateTime().toDbDateStr();
            if (previous != null) {
                //previous.NEXT_ACTIVITY_TYPE = model.ACTIVITY_TYPE;
                previous.NEXT_ACTIVITY_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
                previous.LAST_UPDATE_DATE = sDate;
                previous.OWNER = $.Ctx.UserId;
                previous.FUNCTION = "C";
                previous.NUMBER_OF_SENDING_DATA = 0;
                var uCmd = previous.updateCommand($.Ctx.DbConn);
                ret.push(uCmd);
                //model.LAST_ACTIVITY_DATE = previous.ACTIVITY_DATE;
                //model.LAST_ACTIVITY_TYPE = previous.ACTIVITY_TYPE;
                model.LAST_UPDATE_DATE = sDate;
                model.OWNER = $.Ctx.UserId;
                model.FUNCTION = "C";
                model.NUMBER_OF_SENDING_DATA = 0;
                var uCmd2 = model.updateCommand($.Ctx.DbConn);
                ret.push(uCmd2);
                success(ret);
            } else {
                error('Cannot find previous activity');
            }
        }, error);
}

//model = HH_FR_SWINE_ACTIVITY
//success ([updatePreviousActivity,deleteCurrentActivity];
FarmVar.prototype.SwineActivityDelete = function (model, success, error) {
    var ret = new Array();
    $.FarmCtx.SwineActivitySelectPrevious(model, model.LAST_ACTIVITY_DATE, model.LAST_ACTIVITY_TYPE,
        function (previous) {
            var sDate = $.Ctx.GetLocalDateTime().toDbDateStr();
            if (previous != null) {
                previous.NEXT_ACTIVITY_TYPE = null;
                previous.NEXT_ACTIVITY_DATE = null;
                previous.LAST_UPDATE_DATE = sDate;
                previous.OWNER = $.Ctx.UserId;
                previous.FUNCTION = "C";
                previous.NUMBER_OF_SENDING_DATA = 0;
                var uCmd = previous.updateCommand($.Ctx.DbConn);
                ret.push(uCmd);
                var dCmd = model.deleteCommand($.Ctx.DbConn);
                ret.push(dCmd);
                success(ret);
            } else {
                error('Cannot find previous activity');
            }
        }, error);
}

FarmVar.prototype.SwineActivitySelectPrevious = function (model, date, type, success, error) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT * FROM HH_FR_MS_SWINE_ACTIVITY WHERE ORG_CODE = '{0}' AND FARM_ORG = '{1}' AND SWINE_TRACK = '{2}' AND ACTIVITY_DATE = '{3}' AND ACTIVITY_TYPE = '{4}'".format([$.Ctx.SubOp, $.Ctx.Warehouse, model.SWINE_TRACK, date, type]);
    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            var m = new HH_FR_MS_SWINE_ACTIVITY();
            m.retrieveRdr(res.rows.item(0));
            success(m);
        } else {
            success(null);
        }

    }, function (err) {
        alert(err.message);
    });

}

//This func By Boy
FarmVar.prototype.SearchStockFarmOrgFrom = function (apptype, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = "ifnull(F.NAME_LOC, F.NAME_ENG)";
    if ($.Ctx.Lang == "en-US") {
        nameField = "ifnull(F.NAME_ENG, F.NAME_LOC)";
    }
    if ($.Ctx.Bu == "FARM_PIG") {
        cmd.sqlText = "SELECT DISTINCT FARM_ORG_LOC AS CODE,{0} AS NAME ".format([nameField]);
        cmd.sqlText += "FROM HH_FR_MS_GROWER_STOCK S JOIN ";
        cmd.sqlText += "FR_FARM_ORG F ON (S.ORG_CODE=F.ORG_CODE AND S.FARM_ORG_LOC=F.FARM_ORG) ";
        cmd.sqlText += "WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND F.LOCATION<>'6' ";
        if (apptype == "swine") cmd.sqlText += "AND F.LOCATION IN ('3','4','5') ";
        cmd.sqlText += "ORDER BY S.FARM_ORG_LOC ";
    }
    else if ($.Ctx.Bu == "FARM_POULTRY") {
        cmd.sqlText = "SELECT DISTINCT FARM_ORG_LOC as CODE , {0} as NAME ".format([nameField]);
        cmd.sqlText += " FROM HH_FR_MS_GROWER_STOCK S JOIN FR_FARM_ORG F ";
        cmd.sqlText += " ON (S.ORG_CODE=F.ORG_CODE AND S.FARM_ORG_LOC=F.FARM_ORG) ";
        cmd.sqlText += " WHERE S.ORG_CODE= ? ";
        cmd.sqlText += " AND S.FARM_ORG= ? ";
        cmd.sqlText += " ORDER BY S.FARM_ORG_LOC ";
    }

    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                ret.push({ 'CODE': res.rows.item(i).CODE, 'NAME': res.rows.item(i).NAME });
            }
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    });
}
//This func By Boy
FarmVar.prototype.SearchFarmGrowerTO = function (location, farmOrgFrom, apptype, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = "ifnull(NAME_LOC, NAME_ENG)";
    if ($.Ctx.Lang == "en-US") {
        nameField = "ifnull(NAME_ENG, NAME_LOC)";
    }
    cmd.sqlText = "SELECT FARM_ORG AS CODE,{0} AS NAME FROM FR_FARM_ORG ".format([nameField]);
    cmd.sqlText += "WHERE ORG_CODE=? AND PARENT_FARM_ORG=? AND LOCATION>=? AND FARM_ORG<>? ";
    if (apptype == "grower") {
        cmd.sqlText += "AND LOCATION<>'6'";
    }
    cmd.sqlText += "ORDER BY FARM_ORG ";
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push(location);
    cmd.parameters.push(farmOrgFrom);

    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                ret.push({ 'CODE': res.rows.item(i).CODE, 'NAME': res.rows.item(i).NAME });
            }
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    });
}
//This func By Boy
FarmVar.prototype.SearchStockGrowerBreeder = function (farmOrg, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = '';
    if ($.Ctx.Lang == "en-US")
        nameField = "ifnull(G.DESC_ENG, G.DESC_LOC)";
    else
        nameField = "ifnull(G.DESC_LOC, G.DESC_ENG)";

    cmd.sqlText = "SELECT DISTINCT S.BREEDER, {0} AS BREEDER_NAME ".format([nameField]);
    cmd.sqlText += "FROM HH_FR_MS_GROWER_STOCK S ";
    cmd.sqlText += "JOIN GD3_FR_BREEDER G ON (S.ORG_CODE=G.ORG_CODE AND S.BREEDER=G.BREEDER) ";
    cmd.sqlText += "WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND S.FARM_ORG_LOC=? ";
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push(farmOrg);
    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                if (res.rows.item(i).BREEDER !== null)
                    ret.push({ 'BREEDER': res.rows.item(i).BREEDER, 'BREEDER_NAME': res.rows.item(i).BREEDER_NAME });
            }
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    });
}
//This func By Boy
FarmVar.prototype.FindStockGrowerBreeder = function (farmOrg, breeder, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = '';
    if ($.Ctx.Lang == "en-US")
        nameField = "ifnull(G.DESC_ENG, G.DESC_LOC)";
    else
        nameField = "ifnull(G.DESC_LOC, G.DESC_ENG)";
    cmd.sqlText = "SELECT DISTINCT S.BREEDER, {0} AS BREEDER_NAME ".format([nameField]);
    cmd.sqlText += "FROM HH_FR_MS_GROWER_STOCK S ";
    cmd.sqlText += "JOIN GD3_FR_BREEDER G ON (S.ORG_CODE=G.ORG_CODE AND S.BREEDER=G.BREEDER) ";
    cmd.sqlText += "WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND S.FARM_ORG_LOC=? AND S.BREEDER=? ";
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push(farmOrg);
    cmd.parameters.push(breeder);
    var ret = {};
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            if (res.rows.item(0).BREEDER !== null) {
                ret.BREEDER = res.rows.item(0).BREEDER;
                ret.BREEDER_NAME = res.rows.item(0).BREEDER_NAME;
            }
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    });
}
//This func By Boy
FarmVar.prototype.SearchStockGrowerBirthWeek = function (farmOrg, breeder, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT DISTINCT BIRTH_WEEK FROM HH_FR_MS_GROWER_STOCK WHERE ORG_CODE=? AND FARM_ORG=? AND FARM_ORG_LOC=? AND BREEDER=? ";
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push(farmOrg);
    cmd.parameters.push(breeder);

    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                if (res.rows.item(i).BIRTH_WEEK !== null)
                    ret.push({ 'BIRTH_WEEK': res.rows.item(i).BIRTH_WEEK });
            }
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    });
}
//This func By Boy
FarmVar.prototype.DeleteGrowerStockByKey = function (farmOrgLoc, txDate, tranType, docType, docExt, SuccessCB) {
    var stock = new HH_FR_MS_GROWER_STOCK();
    stock.ORG_CODE = $.Ctx.SubOp;
    stock.FARM_ORG = $.Ctx.Warehouse;
    stock.FARM_ORG_LOC = farmOrgLoc;
    stock.TRANSACTION_DATE = txDate.toDbDateStr();
    stock.TRANSACTION_TYPE = tranType;
    stock.DOCUMENT_TYPE = docType;
    stock.DOCUMENT_EXT = docExt;
    var cmd = stock.deleteCommand($.Ctx.DbConn);
    cmd.executeNonQuery(function () {
        if (typeof (SuccessCB) == "function")
            SuccessCB(true);
    }, function (errors) {
        SuccessCB(false);
        console.log(errors);
    });
}
//This func By Boy
FarmVar.prototype.GetMaxDocExtGrowerMove = function (fromLoc, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT MAX(DOCUMENT_EXT) AS RUN_EXT FROM HH_FR_MS_GROWER_MOVE ";
    cmd.sqlText += "WHERE ORG_CODE=? AND FARM_ORG=? AND TRANSACTION_DATE=? ";
    //cmd.sqlText+="AND FARM_ORG_LOC=? "; for Duplicate 
    var ret = [];
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    //cmd.parameters.push(fromLoc);
    cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            SuccessCB(res.rows.item(0).RUN_EXT == null ? 1 : res.rows.item(0).RUN_EXT + 1);
        } else {
            SuccessCB(1);
        }
    });
}

//FarmMove By Boy
FarmVar.prototype.FindQtyOldFromMove = function (farmLoc, txDate, docType, docExt, breeder, birWeek, prodDate, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT S.BREEDER,S.BIRTH_WEEK,S.MALE_QTY,S.MALE_WGH,S.FEMALE_QTY,S.FEMALE_WGH ";
    cmd.sqlText += "FROM HH_FR_MS_GROWER_MOVE S ";
    cmd.sqlText += "WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND S.FARM_ORG_LOC=? AND S.TRANSACTION_DATE=? ";
    cmd.sqlText += "AND S.DOCUMENT_TYPE=? AND S.DOCUMENT_EXT=? ";
    if ($.Ctx.Bu == "FARM_PIG") {
        cmd.sqlText += "AND S.BREEDER=? AND S.BIRTH_WEEK=? ";
    } else {
        if (typeof prodDate !== 'undefined' && prodDate !== null)
            cmd.sqlText += "AND S.PRODUCTION_DATE=? ";
        else
            cmd.sqlText += "AND S.PRODUCTION_DATE IS NULL ";
    }
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push(farmLoc);
    cmd.parameters.push(txDate.toDbDateStr());
    cmd.parameters.push(docType);
    cmd.parameters.push(docExt);
    if ($.Ctx.Bu == "FARM_PIG") {
        cmd.parameters.push(breeder);
        cmd.parameters.push(birWeek);
    } else {
        if (typeof prodDate !== 'undefined' && prodDate !== null)
            cmd.parameters.push(prodDate.toDbDateStr());
    }
    var ret = {};
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            ret.BREEDER = res.rows.item(0).BREEDER;
            ret.BIRTH_WEEK = res.rows.item(0).BIRTH_WEEK;
            ret.MALE_QTY = res.rows.item(0).MALE_QTY;
            ret.MALE_WGH = res.rows.item(0).MALE_WGH;
            ret.MALE_AMT = 0;
            ret.FEMALE_QTY = res.rows.item(0).FEMALE_QTY;
            ret.FEMALE_WGH = res.rows.item(0).FEMALE_WGH;
            ret.FEMALE_AMT = 0;
        } else {
            ret.BREEDER = breeder;
            ret.BIRTH_WEEK = birWeek;
            ret.MALE_QTY = 0;
            ret.MALE_WGH = 0;
            ret.MALE_AMT = 0;
            ret.FEMALE_QTY = 0;
            ret.FEMALE_WGH = 0;
            ret.FEMALE_AMT = 0;
        }
        SuccessCB(ret);
    }, function (error) {
        console.log(error);
    });
}

//This func By Boy
//noppol.von Modify Move BREEDER to if FARM_PIG
FarmVar.prototype.ValidateStockOfMove = function (qtyM, qtyF, farmLoc, txDate, breeder, birWeek, docExt, prodDate, FuncCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT TRANSACTION_TYPE, SUM(MALE_QTY) AS SUM_MALE,SUM(FEMALE_QTY) AS SUM_FEMALE ";
    cmd.sqlText += "FROM HH_FR_MS_GROWER_STOCK ";
    cmd.sqlText += "WHERE ORG_CODE=? AND FARM_ORG=? AND FARM_ORG_LOC=?  ";
    if ($.Ctx.Bu == "FARM_PIG") {
        cmd.sqlText += " AND BREEDER=? AND BIRTH_WEEK=? ";
    } else {
      //  cmd.sqlText += " AND BIRTH_WEEK IS NULL OR BIRTH_WEEK = 'NA' ";
    }
    cmd.sqlText += "GROUP BY TRANSACTION_TYPE ";
    var ret = [];
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push(farmLoc);


    if ($.Ctx.Bu == "FARM_PIG") {
        cmd.parameters.push(breeder);
        cmd.parameters.push(birWeek);
    }
    if (docExt != -1) {
        $.FarmCtx.FindQtyOldFromMove(farmLoc, txDate, docTypeMove, docExt, breeder, birWeek, prodDate, function (ret) {
            var qtyMOld = ret.MALE_QTY,
				qtyFOld = ret.FEMALE_QTY;
            cmd.executeReader(function (t, res) {
                if (res.rows.length > 0) {
                    Reader(res, qtyMOld, qtyFOld);
                } else {
                    alert($.Ctx.Lcl('grower_move_trans', 'msgStockNoFod', 'Stock Not found.'));
                    FuncCB(false, -1, -1);
                }
            });
        });
    } else {
        cmd.executeReader(function (t, res) {
            if (res.rows.length > 0) {
                Reader(res, 0, 0);
            } else {
                alert($.Ctx.Lcl('grower_move_trans', 'msgStockNoFod', 'Stock Not found.'));
                FuncCB(false, -1, -1);
            }
        });
    }

    function Reader(res, qtyMOld, qtyFOld) {
        var receiveM = 0, spendM = 0, receiveF = 0, spendF = 0;
        for (var i = 0; i < res.rows.length; i++) {
            if (res.rows.item(i).TRANSACTION_TYPE == '2') {
                spendM += (res.rows.item(i).SUM_MALE == null ? 0 : res.rows.item(i).SUM_MALE);
                spendF += (res.rows.item(i).SUM_FEMALE == null ? 0 : res.rows.item(i).SUM_FEMALE);
            } else if (res.rows.item(i).TRANSACTION_TYPE == '1') {
                receiveM += (res.rows.item(i).SUM_MALE == null ? 0 : res.rows.item(i).SUM_MALE);
                receiveF += (res.rows.item(i).SUM_FEMALE == null ? 0 : res.rows.item(i).SUM_FEMALE);
            }
        }
        var succ = false;
        var maleRem = receiveM - spendM + qtyMOld,
			femaleRem = receiveF - spendF + qtyFOld;
        if ((qtyM + spendM - qtyMOld) > receiveM) {
            //key Male เกิน
            alert($.Ctx.Lcl('grower_move_trans', 'msgMaleRem', 'Male remain ') + maleRem);
        } else {
            succ = true;
        }
        if (succ == true) {
            if ((qtyF + spendF - qtyFOld) > receiveF) {
                //key Female เกิน
                succ = false;
                alert($.Ctx.Lcl('grower_move_trans', 'msgFeMaleRem', 'Female remain ') + femaleRem);
            }
        }
        FuncCB(succ, maleRem, femaleRem);
    }
}
//This func By Boy
FarmVar.prototype.GetSwineNowDateIn = function () {
    var now = new XDate();
    var month = now.getMonth() + 1;
    return ('' + now.getDate()).lpad('0', 2) + '/' + ('' + month).lpad('0', 2) + '/' + now.getFullYear()
			+ ' ' + ('' + now.getHours()).lpad('0', 2) + ('' + now.getMinutes()).lpad('0', 2) + ('' + now.getSeconds()).lpad('0', 2);
}
//This func By Boy
FarmVar.prototype.FindGrowerMove = function (farmOrg, txDateStr, docType, docExt, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nRea = '', nLoc = '', nTo = '', nBree = '', nBree2 = '';
    if ($.Ctx.Lang == "en-US") {
        nRea = "ifnull(R.DESC_ENG, R.DESC_LOC)";
        nLoc = "ifnull(F.NAME_ENG, F.NAME_LOC)";
        nTo = "ifnull(F1.NAME_ENG, F1.NAME_LOC)";
        nBree = "ifnull(BR.DESC_ENG, BR.DESC_LOC)";
        nBree2 = "ifnull(BR2.DESC_ENG, BR2.DESC_LOC)";
    } else {
        nRea = "ifnull(R.DESC_LOC, R.DESC_ENG)";
        nLoc = "ifnull(F.NAME_LOC, F.NAME_ENG)";
        nTo = "ifnull(F1.NAME_LOC, F1.NAME_ENG)";
        nBree = "ifnull(BR.DESC_LOC, BR.DESC_ENG)";
        nBree2 = "ifnull(BR2.DESC_LOC, BR2.DESC_ENG)";
    }
    cmd.sqlText = "SELECT S.TRANSACTION_DATE,S.DOCUMENT_TYPE,S.DOCUMENT_EXT, ";
    cmd.sqlText += "S.FARM_ORG_LOC ,{0} AS FARM_ORG_LOC_NAME, S.TO_FARM_ORG_LOC, {1} AS TO_FARM_ORG_LOC_NAME, {2} AS BREEDER_NAME, ".format([nLoc, nTo, nBree]);
    cmd.sqlText += "S.BREEDER, S.BIRTH_WEEK,S.MALE_QTY,S.MALE_WGH,S.FEMALE_QTY,S.FEMALE_WGH,";
    cmd.sqlText += "S.PRODUCTION_DATE, S.NUMBER_OF_SENDING_DATA,S.TO_BREEDER,{0} AS TO_BREEDER_NAME ,S.TO_SWINE_ID, S.TO_SWINE_TRACK, S.TO_SWINE_DATE_IN ".format([nBree2]);
    cmd.sqlText += "FROM HH_FR_MS_GROWER_MOVE S ";
    cmd.sqlText += "JOIN FR_FARM_ORG F ON S.FARM_ORG_LOC=F.FARM_ORG ";
    cmd.sqlText += "JOIN FR_FARM_ORG F1 ON S.TO_FARM_ORG_LOC=F1.FARM_ORG ";
    cmd.sqlText += "LEFT JOIN GD3_FR_BREEDER BR ON (S.ORG_CODE=BR.ORG_CODE AND S.BREEDER=BR.BREEDER) ";
    cmd.sqlText += "LEFT JOIN GD3_FR_BREEDER BR2 ON (S.ORG_CODE=BR2.ORG_CODE AND S.TO_BREEDER=BR2.BREEDER) ";
    cmd.sqlText += "WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND S.FARM_ORG_LOC=? AND S.TRANSACTION_DATE=? ";
    cmd.sqlText += " AND S.DOCUMENT_TYPE=? AND S.DOCUMENT_EXT=? ";
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push(farmOrg);
    cmd.parameters.push(txDateStr);
    cmd.parameters.push(docType);
    cmd.parameters.push(docExt);
    var ret = {};
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            ret.ORG_CODE = $.Ctx.SubOp;
            ret.FARM_ORG = $.Ctx.Warehouse;
            ret.FARM_ORG_LOC = farmOrg;
            ret.TRANSACTION_DATE = parseDbDateStr(txDateStr);
            ret.DOCUMENT_TYPE = docType;
            ret.DOCUMENT_EXT = docExt;
            ret.FARM_ORG_LOC_NAME = res.rows.item(0).FARM_ORG_LOC_NAME;
            ret.TO_FARM_ORG_LOC = res.rows.item(0).TO_FARM_ORG_LOC;
            ret.TO_FARM_ORG_LOC_NAME = res.rows.item(0).TO_FARM_ORG_LOC_NAME;
            ret.PRODUCTION_DATE = res.rows.item(0).PRODUCTION_DATE;
            ret.BREEDER = res.rows.item(0).BREEDER;
            ret.BREEDER_NAME = res.rows.item(0).BREEDER_NAME;
            ret.BIRTH_WEEK = res.rows.item(0).BIRTH_WEEK;
            ret.MALE_QTY = res.rows.item(0).MALE_QTY;
            ret.MALE_WGH = res.rows.item(0).MALE_WGH;
            ret.FEMALE_QTY = res.rows.item(0).FEMALE_QTY;
            ret.FEMALE_WGH = res.rows.item(0).FEMALE_WGH;
            ret.NUMBER_OF_SENDING_DATA = res.rows.item(0).NUMBER_OF_SENDING_DATA;
            ret.TO_BREEDER = res.rows.item(0).TO_BREEDER;
            ret.TO_BREEDER_NAME = res.rows.item(0).TO_BREEDER_NAME;
            ret.TO_SWINE_ID = res.rows.item(0).TO_SWINE_ID;
            ret.TO_SWINE_TRACK = res.rows.item(0).TO_SWINE_TRACK;
            ret.TO_SWINE_DATE_IN = res.rows.item(0).TO_SWINE_DATE_IN;
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    }, function (error) {
        console.log(error);
    });

}
//This func By Boy
FarmVar.prototype.DeleteSwineActivityFirstStatus = function (swineId, swineDateIn, actDateStr, actType, SuccessCB) {
    var act = new HH_FR_MS_SWINE_ACTIVITY();
    act.ORG_CODE = $.Ctx.SubOp;
    act.FARM_ORG = $.Ctx.Warehouse;
    act.SWINE_ID = swineId;
    act.SWINE_DATE_IN = swineDateIn;
    act.ACTIVITY_DATE = actDateStr;
    act.ACTIVITY_TYPE = actType;
    var cmd = act.deleteCommand($.Ctx.DbConn);
    cmd.executeNonQuery(function () {
        if (typeof (SuccessCB) == "function")
            SuccessCB(true);
    }, function (errors) {
        SuccessCB(false);
        console.log(errors);
    });
}




FarmVar.prototype.GenNumberSwineFindLastID = function (sex, breeder, configOp, success, error) {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT MAX(LAST_ID) AS LAST_ID FROM FR_MS_FARROW_ORG_LAST_ID WHERE ORG_CODE = '{0}' AND FARM_ORG = '{1}' AND SEX = '{2}' AND BREEDER = '{3}'".format([$.Ctx.SubOp, $.Ctx.Warehouse, sex, breeder]);
    cmd.executeReader(function (tx, res) {
        if (res.rows.length == 0 || res.rows.item(0).LAST_ID == null) {
            if ((configOp == '1') || (configOp == '3')) {
                success(1);
            } else if (configOp == '2') {
                success(2);
            } else {
                var tranDate = $.Ctx.GetBusinessDate().toDbDateStr();
                var getYear = parseDbDateStr(tranDate).getFullYear();
                var cmd1 = $.Ctx.DbConn.createSelectCommand();
                cmd1.sqlText = "SELECT FARROW_GROUP FROM FR_MAS_WEEK_INFORMATION WHERE PROJECT_CODE = 'SW' AND  WEEK_YEAR =  '{0}' AND '{1}'  BETWEEN WEEK_START_DATE AND WEEK_END_DATE".format([getYear, $.Ctx.GetBusinessDate().toDbDateStr()]);
                cmd1.executeReader(function (tx, res) {
                    if (res.rows.length != 0) {
                        var m = new FR_MAS_WEEK_INFORMATION();
                        m.retrieveRdr(res.rows.item(0))
                        success(m.FARROW_GROUP);
                    } else {
                        alert("cannot find Last Id")
                    }
                }, function (err) {
                    alert(err.message);
                });
            }
        } else {
            var m = new FR_MS_FARROW_ORG_LAST_ID();
            m = res.rows.item(0);
            success(m);
        }
    }, function (err) {
        alert(err.message);
    });
}

FarmVar.prototype.GenNumberSwineStartLastID = function (sex, breeder, configOp, success, error) {
    $.FarmCtx.GenNumberSwineFindLastID(sex, breeder, configOp,
        function (lastId) {
            if (lastId != null) {
                var startId = lastId;
                if ((configOp == '1') || (configOp == '2')) {
                    startId += 2;
                    success(startId);
                } else if (configOp == '3') {
                    startId += 1;
                    success(startId);
                } else if (configOp == '4') {
                    success(startId);
                }
            } else {
                alert("Cannot find Last Id");
            }
        }, error);
}

FarmVar.prototype.GenNumberSwineEndLastID = function (sex, breeder, qty, configOp, success, error) {
    $.FarmCtx.GenNumberSwineFindLastID(sex, breeder, configOp,
        function (startId) {
            if (startId != null) {
                var endId = startId;
                if ((configOp == '1') || (configOp == '2')) {
                    endId = ((2 * qty) + (startId) - 2);
                    success(endId);
                } else if (configOp == '3') {
                    endId = (startId) + qty - 1
                    success(endId);
                } else if (configOp == '4') {
                    success(endId);
                }

            } else {
                alert("Cannot find Start Id");
            }
        }, error);
}

FarmVar.prototype.FindLocation = function (farmOrg, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT LOCATION FROM FR_FARM_ORG WHERE ORG_CODE=? AND FARM_ORG=? "
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push(farmOrg);
    var ret = {};
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            ret.LOCATION = res.rows.item(0).LOCATION;
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    });
}

FarmVar.prototype.HusbandryAvailableList = function (success, error) {
    var nRea = '';
    if ($.Ctx.Lang == "en-US") {
        nRea = "ifnull(A.DESC_ENG, A.DESC_LOC)";
    } else {
        nRea = "ifnull(A.DESC_LOC, A.DESC_ENG)";
    }
    var cmd = $.Ctx.DbConn.createSelectCommand($.Ctx.DbConn);
    cmd.sqlText = "SELECT A.HUSBANDRY,{0} AS HUSBANDRY_NAME FROM GD3_FR_HUSBANDRY A WHERE A.ORG_CODE='{1}'".format([nRea, $.Ctx.SubOp]);
    cmd.executeReader(function (tx, res) {
        var resultList = [];
        for (var i = 0; i < res.rows.length; i++) {
            resultList.push({ 'HUSBANDRY': res.rows.item(i).HUSBANDRY, 'HUSBANDRY_NAME': res.rows.item(i).HUSBANDRY_NAME });
        }
        if (typeof success == 'function') success(resultList);
    }, function (err) {
        if (typeof error == 'function')
            error(err);
        else
            console.log(err);
    });
}
//This func By Boy
//Noppol.von Modify split FARM_PIG
FarmVar.prototype.FindAvaliableGrowerStock = function (farmLoc, breeder, birWeek, success, error) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT TRANSACTION_TYPE, SUM(MALE_QTY) AS SUM_MALE,SUM(FEMALE_QTY) AS SUM_FEMALE ";
    cmd.sqlText += "FROM HH_FR_MS_GROWER_STOCK ";
    cmd.sqlText += "WHERE ORG_CODE=? AND FARM_ORG=? AND FARM_ORG_LOC=? ";
    if ($.Ctx.Bu == "FARM_PIG") {
        cmd.sqlText += " AND BREEDER=? AND BIRTH_WEEK=? ";
    }

    cmd.sqlText += "GROUP BY TRANSACTION_TYPE ";
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push(farmLoc);
    if ($.Ctx.Bu == "FARM_PIG") {
        cmd.parameters.push(breeder);
        cmd.parameters.push(birWeek);
    }
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            var receiveM = 0, spendM = 0, receiveF = 0, spendF = 0;
            for (var i = 0; i < res.rows.length; i++) {
                if (res.rows.item(i).TRANSACTION_TYPE == '2') {
                    spendM += (res.rows.item(i).SUM_MALE == null ? 0 : res.rows.item(i).SUM_MALE);
                    spendF += (res.rows.item(i).SUM_FEMALE == null ? 0 : res.rows.item(i).SUM_FEMALE);
                } else if (res.rows.item(i).TRANSACTION_TYPE == '1') {
                    receiveM += (res.rows.item(i).SUM_MALE == null ? 0 : res.rows.item(i).SUM_MALE);
                    receiveF += (res.rows.item(i).SUM_FEMALE == null ? 0 : res.rows.item(i).SUM_FEMALE);
                }
            }
            if (typeof success == 'function')
                success({ 'FARM_ORG_LOC': farmLoc, 'BREEDER': breeder, 'BIRTH_WEEK': birWeek, 'A_MALE_QTY': (receiveM - spendM), 'A_FEMALE_QTY': (receiveF - spendF) });
        }
    });
}
//This func By Boy
FarmVar.prototype.SearchFarmManage = function (SuccessCB){
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = "ifnull(F.NAME_LOC, F.NAME_ENG)";
    if ($.Ctx.Lang == "en-US") {
        nameField = "ifnull(F.NAME_ENG, F.NAME_LOC)";
    }
    cmd.sqlText = "SELECT F.FARM_ORG AS CODE,{0} AS NAME ".format([nameField]);
    cmd.sqlText += "FROM FR_FARM_ORG F ";
    cmd.sqlText += "WHERE F.ORG_CODE=? AND F.MANAGEMENT_FLG='M' ";
    cmd.sqlText += "ORDER BY F.FARM_ORG ";
    cmd.parameters.push($.Ctx.SubOp);
    var ret=[];
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            for (var i=0;i<res.rows.length;i++){
                ret.push({'CODE':res.rows.item(i).CODE, 'NAME':res.rows.item(i).NAME});
            }
            SuccessCB(ret);
        }else{
            SuccessCB(null);
        }
    },function(err){
        console.log(err);
    });
}
// This func By Boy , From array['4','5','6'] to "'4','5','6'"
FarmVar.prototype.ExtractParam = function(p){
    var locStr='';
    if (typeof p=="object"){
        if (p!==null && p!==undefined){
            for (var i=0;i<p.length;i++){
                locStr += "'" + $.trim(p[i]) + "'";
                if (i<p.length-1) locStr+=",";
            }
        }
    }else if (typeof p=="string"){
        locStr=p;
    }
    return locStr;
}

// This func By Boy 
FarmVar.prototype.SearchG3Breeder = function(SuccessCB){
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = "ifnull(DESC_LOC, DESC_ENG)";
    if ($.Ctx.Lang == "en-US") {
        nameField = "ifnull(DESC_ENG, DESC_LOC)";
    }
    cmd.sqlText = "SELECT BREEDER,{0} AS BREEDER_NAME FROM GD3_FR_BREEDER WHERE ORG_CODE = ? ".format([nameField]);
    cmd.parameters.push($.Ctx.SubOp);
    var ret=[];
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            for (var i=0;i<res.rows.length;i++){
                if (res.rows.item(i).BREEDER_NAME!==null)
                    ret.push({'BREEDER':res.rows.item(i).BREEDER, 'BREEDER_NAME':res.rows.item(i).BREEDER_NAME });
            }
            if (typeof SuccessCB=='function') SuccessCB(ret);
        }else{
            if (typeof SuccessCB=='function') SuccessCB(null);
        }
    });
}
// This func By Boy 
FarmVar.prototype.MakeSwineTrack = function(toBreeder , sex, birthweek, swineId){
    //BD-SEX-BW-TO_SWINE_ID
    return toBreeder + '-' + (sex=='M'?'1':'2') + '-' + birthweek + '-' + swineId;
}
// This func By Boy 
FarmVar.prototype.FindStockMatProductBalance = function(stkType , farmOrg , Prod, SuccessCB){
	var cmd = $.Ctx.DbConn.createSelectCommand();
	cmd.sqlText = "SELECT A.PRODUCT_CODE , B.PRODUCT_NAME, B.STOCK_KEEPING_UNIT,B.UNIT_PACK, B.PRODUCT_STOCK_TYPE, A.LOT_NUMBER,";
	cmd.sqlText +="SUM (CASE B.STOCK_KEEPING_UNIT WHEN 'Q' THEN A.QUANTITY ELSE 0 END) QTY,";
	cmd.sqlText +="SUM (CASE B.STOCK_KEEPING_UNIT WHEN 'W' THEN A.WEIGHT ELSE 0 END) WGH ";
	cmd.sqlText +="FROM S1_ST_STOCK_BALANCE A ";
	cmd.sqlText +="JOIN HH_PRODUCT_BU B ON (A.BUSINESS_UNIT=B.BUSINESS_UNIT AND A.PRODUCT_CODE=B.PRODUCT_CODE) ";
	cmd.sqlText +="WHERE A.BUSINESS_UNIT=? ";
    cmd.sqlText +=" AND A.COMPANY=? ";
    cmd.sqlText +=" AND A.OPERATION=? ";
    cmd.sqlText +=" AND A.SUB_OPERATION=? ";
	cmd.sqlText +=" AND A.WAREHOUSE_CODE=? ";
	cmd.sqlText +=" AND B.PRODUCT_STOCK_TYPE=? ";
	cmd.sqlText +=" AND A.PRODUCT_CODE=? ";
	cmd.sqlText +="GROUP BY A.PRODUCT_CODE, B.PRODUCT_NAME, A.LOT_NUMBER, ";
	cmd.sqlText +="B.STOCK_KEEPING_UNIT, B.STOCK_KEEPING_UNIT,B.UNIT_PACK, B.PRODUCT_STOCK_TYPE ";
	cmd.sqlText +="ORDER BY B.PRODUCT_NAME ";
	cmd.parameters.push($.Ctx.Bu);
	cmd.parameters.push($.Ctx.ComCode);
	cmd.parameters.push($.Ctx.Op);
	cmd.parameters.push($.Ctx.SubOp);
	cmd.parameters.push(farmOrg);
	cmd.parameters.push(stkType);
	cmd.parameters.push(Prod);
	var ret=null;
	cmd.executeReader(function (t, res) {
		if (res.rows.length > 0) {
			if (res.rows.item(0).PRODUCT_CODE!==null && res.rows.item(0).PRODUCT_NAME!==null){
				ret = {'PRODUCT_CODE':res.rows.item(0).PRODUCT_CODE,
					   'PRODUCT_NAME':res.rows.item(0).PRODUCT_NAME,
					   'STOCK_KEEPING_UNIT': res.rows.item(0).STOCK_KEEPING_UNIT,
					   'UNIT_PACK':res.rows.item(0).UNIT_PACK, 
					   'PRODUCT_STOCK_TYPE':res.rows.item(0).PRODUCT_STOCK_TYPE,
					   'LOT_NUMBER': res.rows.item(0).LOT_NUMBER,
					   'QTY':res.rows.item(0).QTY, 
					   'WGH':res.rows.item(0).WGH};
			}
		}
		if (typeof SuccessCB=='function') SuccessCB(ret);
	},function(err){ 
		console.log(err); 
	});
}



FarmVar.prototype.SetStockBalance = function(stkBalcObj,cmds,SuccessCB,FailCB){
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = " SELECT * FROM S1_ST_STOCK_BALANCE BAL WHERE BAL.COMPANY =? AND BAL.OPERATION =?  AND BAL.SUB_OPERATION =? AND BAL.BUSINESS_UNIT =?  AND BAL.WAREHOUSE_CODE =?  AND BAL.SUB_WAREHOUSE_CODE =? AND BAL.PRODUCT_CODE =? AND BAL.PRODUCT_SPEC =? AND BAL.LOT_NUMBER =? AND BAL.SUB_LOT_NUMBER =? AND BAL.SERIAL_NO =? AND BAL.PRODUCTION_DATE =? AND BAL.EXPIRE_DATE =? AND BAL.RECEIVED_DATE =? ";
    stkBalcObj.COMPANY  = $.Ctx.ComCode;
    stkBalcObj.OPERATION = $.Ctx.Op;
    stkBalcObj.SUB_OPERATION = $.Ctx.SubOp;
    stkBalcObj.BUSINESS_UNIT = $.Ctx.Bu;
    //stkBalcObj.WAREHOUSE_CODE = $.Ctx.Warehouse;
    stkBalcObj.SUB_WAREHOUSE_CODE = 'NA';
    stkBalcObj.PRODUCT_SPEC = '0000-0000-0000';
    stkBalcObj.LOT_NUMBER = _.isEmpty(stkBalcObj.LOT_NUMBER)==true? '00':stkBalcObj.LOT_NUMBER;
    stkBalcObj.SUB_LOT_NUMBER = 'NA';
    stkBalcObj.SERIAL_NO =  'NA';
    stkBalcObj.PRODUCTION_DATE = 'NA';
    stkBalcObj.EXPIRE_DATE =  'NA';
    stkBalcObj.RECEIVED_DATE =  'NA';
    stkBalcObj.NUMBER_OF_SENDING_DATA = 0;
    stkBalcObj.LAST_UPDATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
    cmd.parameters.push(stkBalcObj.COMPANY);
    cmd.parameters.push(stkBalcObj.OPERATION);
    cmd.parameters.push(stkBalcObj.SUB_OPERATION);
    cmd.parameters.push(stkBalcObj.BUSINESS_UNIT);
    cmd.parameters.push(stkBalcObj.WAREHOUSE_CODE);
    cmd.parameters.push(stkBalcObj.SUB_WAREHOUSE_CODE);
    cmd.parameters.push(stkBalcObj.PRODUCT_CODE);
    cmd.parameters.push(stkBalcObj.PRODUCT_SPEC);
    cmd.parameters.push(stkBalcObj.LOT_NUMBER);
    cmd.parameters.push(stkBalcObj.SUB_LOT_NUMBER);
    cmd.parameters.push(stkBalcObj.SERIAL_NO);
    cmd.parameters.push(stkBalcObj.PRODUCTION_DATE);
    cmd.parameters.push(stkBalcObj.EXPIRE_DATE);
    cmd.parameters.push(stkBalcObj.RECEIVED_DATE);
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            stkBalcObj.QUANTITY = res.rows.item(0).QUANTITY + stkBalcObj.QUANTITY;
            stkBalcObj.WEIGHT = res.rows.item(0).WEIGHT + stkBalcObj.WEIGHT;
            var iCmdBalance = stkBalcObj.updateCommand($.Ctx.DbConn);
            cmds.push(iCmdBalance);
            if (typeof SuccessCB=='function') SuccessCB();
        }else{
            var iCmdBalance = stkBalcObj.insertCommand($.Ctx.DbConn);
            cmds.push(iCmdBalance);
            if (typeof SuccessCB=='function') SuccessCB();
        }
    },function(error){
        FailCB(error);
    });
}
//Retrieve from db data reader
BaseBo.prototype.SetDefaultNA = function () {
    var fields = this.getFields();
    for (var i = 0; i < fields.length; i++) {
        var key = fields[i].key;
        var val = fields[i].val;
        try {
            if (val == "numeric"){
                this[key] = _.isNull(this[key])==true? 0 :this[key];
            }else if(val == "date") {
                this[key] = _.isNull(this[key])==true? null :this[key];
            }else if(val == "text"){
                this[key] = _.isEmpty(this[key])==true? 'NA' :this[key];
            }
        }
        catch (err) {
        }
    }
}


var stkTrnObj = new S1_ST_STOCK_TRN
FarmVar.prototype.SetStockTrn = function(TrnObj,cmds,mode){
    stkTrnObj = TrnObj;
    stkTrnObj.SetDefaultNA();
    stkTrnObj.COMPANY  = $.Ctx.ComCode;
    stkTrnObj.OPERATION = $.Ctx.Op;
    stkTrnObj.SUB_OPERATION = $.Ctx.SubOp;
    stkTrnObj.BUSINESS_UNIT = $.Ctx.Bu;
    stkTrnObj.LAST_UPDATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
    stkTrnObj.WAREHOUSE_CODE = $.Ctx.Warehouse;
    stkTrnObj.NUMBER_OF_SENDING_DATA=0;
    if (mode == "new"){
        var iCmd = stkTrnObj.insertCommand($.Ctx.DbConn);
        cmds.push(iCmd);
    }else if(mode == "edit"){
        var iCmd = stkTrnObj.updateCommand($.Ctx.DbConn);
        cmds.push(iCmd);
    }
    //if (typeof SuccessCB=='function') SuccessCB();
}

//collect_egg Page
FarmVar.prototype.DeleteCollectEgg = function (farmOrgLoc, txDate, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var sql = "Delete from HH_FR_MS_PRODUCTION_EGG where ORG_CODE=? and FARM_ORG_LOC=? and TRANSACTION_DATE=? ";
    cmd.sqlText = sql;
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push(farmOrgLoc);
    cmd.parameters.push(txDate.toDbDateStr());

    cmd.executeNonQuery(function () {
        if (typeof (SuccessCB) == "function")
            SuccessCB(true);
    }, function (errors) {
        SuccessCB(false);
        console.log(errors);
    });
}
//17/06/2013 Function By noppol.von
XDate.prototype.showDateByFormat = function (format) {
    var d = this;
    return d.toString(format);

}

FarmVar.prototype.GetLookupFarmOrgSqlText = function () {
    var sqlStr = '';
    var nameField = "ifnull(NAME_LOC, NAME_ENG)";
    if ($.Ctx.Lang == "en-US") {
        nameField = "ifnull(NAME_ENG, NAME_LOC)";
    }
    sqlStr = "SELECT FARM_ORG AS CODE, {0} AS NAME  ".format([nameField]);

    sqlStr += " FROM FR_FARM_ORG WHERE ORG_CODE= ? ORDER BY FARM_ORG ";
    return sqlStr;
}
//Update Farm Org Lookup For Poultry
FarmVar.prototype.SearchFarmOrgUsingMapMobile = function (SuccessCB) {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = "ifnull(FO.NAME_LOC, FO.NAME_ENG)";
    if ($.Ctx.Lang == "en-US") {
        nameField = "ifnull(FO.NAME_ENG, FO.NAME_LOC)";
    }

    //	cmd.sqlText = "SELECT FARM_ORG AS CODE,{0} AS NAME FROM HH_FR_FARM_GROWER WHERE ORG_CODE=? AND PARENT_FARM_ORG=? ORDER BY FARM_ORG ".format([nameField]);
    cmd.sqlText = " SELECT DISTINCT "
    cmd.sqlText += "       fo.farm_org AS CODE, {0} as NAME ".format([nameField]);
    cmd.sqlText += " ,fo.*  FROM fr_farm_org fo, hh_user_bu u, HH_FR_MAS_MAP_MOBILE map "
    cmd.sqlText += " WHERE     fo.org_code = u.sub_operation "
    cmd.sqlText += "       AND FO.PARENT_FARM_ORG = U.WAREHOUSE "
    cmd.sqlText += "       AND U.USER_ID = map.user_mobile "
    cmd.sqlText += "       AND U.SUB_OPERATION = fo.org_code "
    cmd.sqlText += "       AND MAP.ORG_CODE = fo.org_code "
    cmd.sqlText += "       AND FO.org_code =  ? "
    cmd.sqlText += "       AND FO.FARM = MAP.CUSTOMER_CODE "
    cmd.sqlText += "       AND U.USER_ID = ? ;"


    cmd.parameters.push($.Ctx.SubOp);
    //cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push($.Ctx.UserId);
    var ret = [];
    //alert(cmd.sqlText);
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                ret.push({ 'CODE': res.rows.item(i).CODE, 'NAME': res.rows.item(i).NAME });
            }
            //return ret;
            SuccessCB(ret);
        } else {
           // return null;
            SuccessCB(null);
        }
    });

};
 // Query Unit Pack From Product ID
FarmVar.prototype.Poultry_SearchUnitPackFromProduct = function(productid, SuccessCB) {


    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText += "select P.UNIT_PACK from HH_PRODUCT_BU P WHERE P.PRODUCT_CODE = ? ";
    cmd.parameters.push(productid);
    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
                ret.push(res.rows.item(i));
            }
            if (typeof SuccessCB == 'function') SuccessCB(ret);
        } else {
            if (typeof SuccessCB == 'function') SuccessCB(null);
        }
    }, function (error) { console.log(error) });

}
FarmVar.prototype.Poultry_SearchEntryTypeByCode = function (entrycode, SuccessCB) {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText += "SELECT GD_CODE AS CODE, DESC_ENG AS NAME_ENG, DESC_LOC AS NAME_LOC FROM HH_GD2_FR_MAS_TYPE_FARM "
  cmd.sqlText += "WHERE GD_TYPE= 'ET' AND GD_CODE = ? ORDER BY GD_CODE ";
    cmd.parameters.push(entrycode);
    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
                ret.push(res.rows.item(i));
            }
            if (typeof SuccessCB == 'function') SuccessCB(ret);
        } else {
            if (typeof SuccessCB == 'function') SuccessCB(null);
        }
    }, function (error) { console.log(error) });

}
FarmVar.prototype.Poultry_CalculateAmountOfQuantityByRefDoc = function(farmorg, productcode, stocktype,refdoc,docno, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "select ifnull(sum(ifnull(m.qty, 0)),0) AS QTY_ISSUED, ifnull((select sum(ifnull(p.[qty],0)) from HH_fr_ms_material_purchase p where p.stock_type = m.stock_type and p.product_code =m.product_code and p.org_code = m.org_Code and p.ref_document_no <> ?),0) AS QTY_PURCHASE from hh_fr_ms_material_issued m where M.STOCK_TYPE = ? and M.PRODUCT_CODE = ? and m.ORG_CODE = ? and m.po_document_no = ?";
    cmd.parameters.push(docno);
    cmd.parameters.push(stocktype);
    cmd.parameters.push(productcode)
    //cmd.parameters.push(farmorg);
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push(refdoc);


    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
                ret.push(res.rows.item(i));
            }
            if (typeof SuccessCB == 'function')  SuccessCB(ret);
        } else {
            if (typeof SuccessCB == 'function') SuccessCB(null);
        }
    }, function (error) { console.log(error) });

}

FarmVar.prototype.Poultry_CalculateAmountOfQuantityByRefDocWithExt = function (farmorg, productcode, stocktype,docno, docext,refdoc, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    //cmd.sqlText = "select sum(ifnull(m.qty, 0)) AS QTY_ISSUED, ifnull((select sum(ifnull(p.[qty],0)) from HH_fr_ms_material_purchase p where p.stock_type = m.stock_type and p.product_code =m.product_code and p.org_code = m.org_Code and p.ref_document_no =  ? and p.document_ext = ?),0) AS QTY_PURCHASE from hh_fr_ms_material_issued m where M.STOCK_TYPE = ? and M.PRODUCT_CODE = ? and m.ORG_CODE = ? and m.REF_DOCUMENT_NO = ?";

    cmd.sqlText = "select sum(ifnull(m.qty, 0)) AS QTY_ISSUED, ifnull((select sum(ifnull(p.[qty],0)) from HH_fr_ms_material_purchase p where p.stock_type = m.stock_type and p.product_code =m.product_code and p.org_code = m.org_Code and p.ref_document_no <> ?),0) AS QTY_PURCHASE from hh_fr_ms_material_issued m where M.STOCK_TYPE = ? and M.PRODUCT_CODE = ? and m.ORG_CODE = ? and m.po_document_no = ?";
    cmd.parameters.push(docno);

    //cmd.parameters.push(docno);
    //cmd.parameters.push(docext);
    cmd.parameters.push(stocktype);
    cmd.parameters.push(productcode)
    //cmd.parameters.push(farmorg);
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push(refdoc);

    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
                ret.push(res.rows.item(i));
            }
            if (typeof SuccessCB == 'function') SuccessCB(ret);
        } else {
            if (typeof SuccessCB == 'function') SuccessCB(null);
        }
    }, function (error) { console.log(error) });

}
//by noppol.von For Feed Transfer
FarmVar.prototype.setS1StockCommand = function (farmOrgLoc, newProductCode, oldProductCode, mode, newWgh, newQty, oldWgh, oldQty, cmds, SuccessCB, FailCB) {

    var stkBalcObj = new S1_ST_STOCK_BALANCE();
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = " SELECT * FROM S1_ST_STOCK_BALANCE BAL WHERE BAL.COMPANY =? AND BAL.OPERATION =?  AND BAL.SUB_OPERATION =? AND BAL.BUSINESS_UNIT =?  AND BAL.WAREHOUSE_CODE =?  AND BAL.SUB_WAREHOUSE_CODE =? AND BAL.PRODUCT_CODE =? AND BAL.PRODUCT_SPEC =? AND BAL.LOT_NUMBER =? AND BAL.SUB_LOT_NUMBER =? AND BAL.SERIAL_NO =? AND BAL.PRODUCTION_DATE =? AND BAL.EXPIRE_DATE =? AND BAL.RECEIVED_DATE =? ";
    stkBalcObj.COMPANY = $.Ctx.ComCode;
    stkBalcObj.OPERATION = $.Ctx.Op;
    stkBalcObj.SUB_OPERATION = $.Ctx.SubOp;
    stkBalcObj.BUSINESS_UNIT = $.Ctx.Bu;
    stkBalcObj.SUB_WAREHOUSE_CODE = 'NA';
    stkBalcObj.PRODUCT_SPEC = '0000-0000-0000';
    stkBalcObj.LOT_NUMBER = '00';
    stkBalcObj.SUB_LOT_NUMBER = 'NA';
    stkBalcObj.SERIAL_NO = 'NA';
    stkBalcObj.PRODUCTION_DATE = 'NA';
    stkBalcObj.EXPIRE_DATE = 'NA';
    stkBalcObj.RECEIVED_DATE = 'NA';
    stkBalcObj.NUMBER_OF_SENDING_DATA = 0;
    stkBalcObj.LAST_UPDATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
    stkBalcObj.WAREHOUSE_CODE = farmOrgLoc;
    stkBalcObj.PRODUCT_CODE = newProductCode;
    stkBalcObj.FUNCTION = 'C';
    cmd.parameters.push(stkBalcObj.COMPANY);
    cmd.parameters.push(stkBalcObj.OPERATION);
    cmd.parameters.push(stkBalcObj.SUB_OPERATION);
    cmd.parameters.push(stkBalcObj.BUSINESS_UNIT);
    cmd.parameters.push(stkBalcObj.WAREHOUSE_CODE);
    cmd.parameters.push(stkBalcObj.SUB_WAREHOUSE_CODE);
    cmd.parameters.push(stkBalcObj.PRODUCT_CODE);
    cmd.parameters.push(stkBalcObj.PRODUCT_SPEC);
    cmd.parameters.push(stkBalcObj.LOT_NUMBER);
    cmd.parameters.push(stkBalcObj.SUB_LOT_NUMBER);
    cmd.parameters.push(stkBalcObj.SERIAL_NO);
    cmd.parameters.push(stkBalcObj.PRODUCTION_DATE);
    cmd.parameters.push(stkBalcObj.EXPIRE_DATE);
    cmd.parameters.push(stkBalcObj.RECEIVED_DATE);
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            newQty = (typeof newQty == 'string') ? Number(newQty) : newQty;
            newWgh = (typeof newWgh == 'string') ? Number(newWgh) : newWgh;
            oldQty = (typeof oldQty == 'string') ? Number(oldQty) : oldQty;
            oldWgh = (typeof oldWgh == 'string') ? Number(oldWgh) : oldWgh;
            var callBackNow = true;

            // Mode Create reduce from stock
            if (mode == 'Create') {
                stkBalcObj.QUANTITY = res.rows.item(0).QUANTITY - newQty;
                stkBalcObj.WEIGHT = res.rows.item(0).WEIGHT - newWgh;
            }
            else if (mode == 'Update') {
                //Mode Update plus with last qty , wgh and reduce with new key
                if (oldProductCode != '' && oldProductCode != newProductCode) {

                    callBackNow = false;

                    stkBalcObj.QUANTITY = res.rows.item(0).QUANTITY - newQty;
                    stkBalcObj.WEIGHT = res.rows.item(0).WEIGHT - newWgh;
                    cmds.push(stkBalcObj.updateCommand($.Ctx.DbConn));

                    var oldStkBalcObj = new S1_ST_STOCK_BALANCE();
                    var cmdOldProduct = $.Ctx.DbConn.createSelectCommand();
                    cmdOldProduct.sqlText = " SELECT * FROM S1_ST_STOCK_BALANCE BAL WHERE BAL.COMPANY =? AND BAL.OPERATION =?  AND BAL.SUB_OPERATION =? AND BAL.BUSINESS_UNIT =?  AND BAL.WAREHOUSE_CODE =?  AND BAL.SUB_WAREHOUSE_CODE =? AND BAL.PRODUCT_CODE =? AND BAL.PRODUCT_SPEC =? AND BAL.LOT_NUMBER =? AND BAL.SUB_LOT_NUMBER =? AND BAL.SERIAL_NO =? AND BAL.PRODUCTION_DATE =? AND BAL.EXPIRE_DATE =? AND BAL.RECEIVED_DATE =? ";
                    oldStkBalcObj.COMPANY = $.Ctx.ComCode;
                    oldStkBalcObj.OPERATION = $.Ctx.Op;
                    oldStkBalcObj.SUB_OPERATION = $.Ctx.SubOp;
                    oldStkBalcObj.BUSINESS_UNIT = $.Ctx.Bu;
                    oldStkBalcObj.SUB_WAREHOUSE_CODE = 'NA';
                    oldStkBalcObj.PRODUCT_SPEC = '0000-0000-0000';
                    oldStkBalcObj.LOT_NUMBER = '00';
                    oldStkBalcObj.SUB_LOT_NUMBER = 'NA';
                    oldStkBalcObj.SERIAL_NO = 'NA';
                    oldStkBalcObj.PRODUCTION_DATE = 'NA';
                    oldStkBalcObj.EXPIRE_DATE = 'NA';
                    oldStkBalcObj.RECEIVED_DATE = 'NA';
                    oldStkBalcObj.NUMBER_OF_SENDING_DATA = 0;
                    oldStkBalcObj.LAST_UPDATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
                    oldStkBalcObj.WAREHOUSE_CODE = farmOrgLoc;
                    oldStkBalcObj.PRODUCT_CODE = oldProductCode;
                    oldStkBalcObj.FUNCTION = 'C';
                    cmdOldProduct.parameters.push(oldStkBalcObj.COMPANY);
                    cmdOldProduct.parameters.push(oldStkBalcObj.OPERATION);
                    cmdOldProduct.parameters.push(oldStkBalcObj.SUB_OPERATION);
                    cmdOldProduct.parameters.push(oldStkBalcObj.BUSINESS_UNIT);
                    cmdOldProduct.parameters.push(oldStkBalcObj.WAREHOUSE_CODE);
                    cmdOldProduct.parameters.push(oldStkBalcObj.SUB_WAREHOUSE_CODE);
                    cmdOldProduct.parameters.push(oldStkBalcObj.PRODUCT_CODE);
                    cmdOldProduct.parameters.push(oldStkBalcObj.PRODUCT_SPEC);
                    cmdOldProduct.parameters.push(oldStkBalcObj.LOT_NUMBER);
                    cmdOldProduct.parameters.push(oldStkBalcObj.SUB_LOT_NUMBER);
                    cmdOldProduct.parameters.push(oldStkBalcObj.SERIAL_NO);
                    cmdOldProduct.parameters.push(oldStkBalcObj.PRODUCTION_DATE);
                    cmdOldProduct.parameters.push(oldStkBalcObj.EXPIRE_DATE);
                    cmdOldProduct.parameters.push(oldStkBalcObj.RECEIVED_DATE);
                    cmdOldProduct.executeReader(function (t, resOld) {
                        if (resOld.rows.length != 0) {

                            oldStkBalcObj.QUANTITY = resOld.rows.item(0).QUANTITY + oldQty;
                            oldStkBalcObj.WEIGHT = resOld.rows.item(0).WEIGHT + oldWgh;
                            cmds.push(oldStkBalcObj.updateCommand($.Ctx.DbConn));
                            if (typeof SuccessCB == 'function') SuccessCB(cmds);
                        }
                    });
                }
                else {
                    stkBalcObj.QUANTITY = res.rows.item(0).QUANTITY - newQty + oldQty;
                    stkBalcObj.WEIGHT = res.rows.item(0).WEIGHT - newWgh + oldWgh;
                }
            }
            else if (mode == 'Delete') {
                stkBalcObj.QUANTITY = res.rows.item(0).QUANTITY + oldQty;
                stkBalcObj.WEIGHT = res.rows.item(0).WEIGHT + oldWgh;
            }
            if (callBackNow) {
                var iCmdBalance = stkBalcObj.updateCommand($.Ctx.DbConn);
                cmds.push(iCmdBalance);
                if (typeof SuccessCB == 'function') SuccessCB(cmds);
            }

        } else {

            if (typeof SuccessCB == 'function') SuccessCB(cmds);
        }
    }, function (error) {
        FailCB(error);
    });

}
///added by bankiiee ^__^

FarmVar.prototype.Poultry_SearchFarmOrgByCode = function (farmOrgCode, SuccessCB) {
  
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = "ifnull(FO.NAME_LOC, FO.NAME_ENG)";
    if ($.Ctx.Lang == "en-US") {
        nameField = "ifnull(FO.NAME_ENG, FO.NAME_LOC)";
    }

    //	cmd.sqlText = "SELECT FARM_ORG AS CODE,{0} AS NAME FROM HH_FR_FARM_GROWER WHERE ORG_CODE=? AND PARENT_FARM_ORG=? ORDER BY FARM_ORG ".format([nameField]);
    cmd.sqlText = " SELECT DISTINCT "
    cmd.sqlText += "       fo.farm_org AS CODE, {0} as NAME ".format([nameField]);
    cmd.sqlText += " ,fo.*  FROM fr_farm_org fo, hh_user_bu u, HH_FR_MAS_MAP_MOBILE map "
    cmd.sqlText += " WHERE     fo.org_code = u.sub_operation "
    cmd.sqlText += "       AND FO.PARENT_FARM_ORG = U.WAREHOUSE "
    cmd.sqlText += "       AND U.USER_ID = map.user_mobile "
    cmd.sqlText += "       AND U.SUB_OPERATION = fo.org_code "
    cmd.sqlText += "       AND MAP.ORG_CODE = fo.org_code "
    cmd.sqlText += "       AND FO.org_code =  ? "
    cmd.sqlText += "       AND FO.FARM = MAP.CUSTOMER_CODE "
    cmd.sqlText += "       AND U.USER_ID = ? AND FO.FARM_ORG = ? ;"


    cmd.parameters.push($.Ctx.SubOp);
    //cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push($.Ctx.UserId);
    cmd.parameters.push(farmOrgCode);
    var ret = [];
    //alert(cmd.sqlText);
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                ret.push({ 'CODE': res.rows.item(i).CODE, 'NAME': res.rows.item(i).NAME });
            }
            //return ret;
            SuccessCB(ret);
        } else {
           // return null;
            SuccessCB(null);
        }
    });
    

}
$.FarmCtx = new FarmVar();