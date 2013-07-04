//Only for Stock module
function StockVar() {
    this.param =
        [
            { DOC_TYPE: 'DCTYP66', TRN_CODE: '21'},{ DOC_TYPE: 'DCTYP61', TRN_CODE: '11'}
        ];
 //{ DOC_TYPE: 'DCTYP66', TRN_CODE: '21'}
//,{ DOC_TYPE: 'DCTYP61', TRN_CODE: '11'}
    this.StockMode = '';
    this.DocDate ='';
    this.StockTranSelected = new Array();
    this.NewStocks  = new Array();
    this.StockTranControl = new Array();
    this.CatagoryConfig = new Array();
}

StockVar.prototype.RetrieveLocalStorage = function () {
    var s = localStorage.stockgbv;
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

            $.StockCtx[key] = oR;

        } else {
            if ((buf[key] != undefined) && (buf[key] != null) && (buf[key].typeName != undefined) && (buf[key].instance != undefined)) {
                $.StockCtx[key] = eval("new " + buf[key].typeName + "()");
                for (k in buf[key].instance) {
                    $.StockCtx[key][k] = buf[key].instance[k];
                }
            } else {
                $.StockCtx[key] = buf[key];
            }

        }
    }
}

StockVar.prototype.PersistPageParam = function () {
    //write to localstorage
    var buf = new Object();
    for (key in $.StockCtx) {
        if (key == 'PageParam') {
            var pp = $.StockCtx[key];
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
        } else if ($.StockCtx[key] instanceof BaseBo) {
            var o = new Object();
            o.typeName = $.StockCtx[key].getTableName();
            o.instance = $.StockCtx[key];
            buf[key] = o;
        } else {
            buf[key] = $.StockCtx[key];
        }
    }
    var s = JSON.stringify(buf);
    localStorage.stockgbv = s;
}

StockVar.prototype.getCatagoryConfig = function (bu,docType,  successCB, errorCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT * FROM HH_CATAGORY_CONFIG WHERE DOC_TYPE IS ? AND BUSINESS_UNIT IS ?"
    cmd.parameters.push(docType);
    cmd.parameters.push(bu);
    cmd.executeReader(function (tx, res) {
        var cfg = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length !=0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_CATAGORY_CONFIG();
                m.retrieveRdr(res.rows.item(i));
                cfg.push(m);
            }
            successCB(cfg);
        } else {
            successCB(null);
        }
    }, function (err) {
        $.Ctx.MsgBox(err.message);
        errorCB(err);
    });

}

StockVar.prototype.getTranControl = function (docType, trnCode, successCB, errorCB) {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT * FROM TRN_CONTROL WHERE DOC_TYPE IS ? AND TRN_CODE IS ?"
    cmd.parameters.push(docType);
    cmd.parameters.push(trnCode);
    cmd.executeReader(function (tx, res) {
        var stockTrns = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length >0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new TRN_CONTROL();
                m.retrieveRdr(res.rows.item(i));
                stockTrns.push(m);
            }
            successCB(stockTrns);
        } else {
            successCB(null);
        }
    }, function (err) {
        $.Ctx.MsgBox(err.message);
        errorCB(err);
    });
}

StockVar.prototype.getAllStockTran = function (docType, trnCode, documentDate,successCB, errorCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();

    cmd.sqlText = "SELECT TRN.*";
    cmd.sqlText += ",CV_NAME";
    cmd.sqlText += ",(SELECT DESC1 FROM GENERAL_DESC WHERE GDTYPE = 'REACD' AND GDCODE =REASON_CODE)AS REASON_NAME";
    cmd.sqlText += ",JOB_NAME";
    cmd.sqlText += ",WAREHOUSE_NAME";
    cmd.sqlText += ",SUB_WAREHOUSE_NAME";
    cmd.sqlText += ",PRODUCT_NAME";
    cmd.sqlText += ",L.DESCRIPTION AS LOT_DESC";
    cmd.sqlText += ",SBL.DESCRIPTION AS SUBLOT_DESC";
    cmd.sqlText += ",LB.DESCRIPTION AS LABOR_DESC";
    cmd.sqlText += ",(WAREHOUSE_NAME || '/' || SUB_WAREHOUSE_NAME) AS WAREHOUSE_DESC";

    cmd.sqlText += " FROM S1_ST_STOCK_TRN TRN";
    cmd.sqlText += " LEFT OUTER JOIN  HH_CV_OPER CV ON TRN.CV_CODE =CV.CV_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_JOB_OPER ON TRN.PRODUCTION_NO =JOB_NO";
    cmd.sqlText += " LEFT OUTER JOIN HH_WAREHOUSE_OPER WH ON TRN.WAREHOUSE_CODE  =WH.WAREHOUSE_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_SUB_WAREHOUSE_OPER SWH ON TRN.SUB_WAREHOUSE_CODE =SWH.SUB_WAREHOUSE_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_PRODUCT_BU PD ON TRN.PRODUCT_CODE = PD.PRODUCT_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_LOT_OPER L ON TRN.LOT_NUMBER = L.LOT";
    cmd.sqlText += " LEFT OUTER JOIN HH_SUB_LOT_OPER SBL ON TRN.SUB_LOT_NUMBER = SBL.SUBLOT";
    cmd.sqlText += " LEFT OUTER JOIN HH_LABOR_OPER LB ON TRN.LABOR_CODE = LB.LABOR_CODE";
    cmd.sqlText += " WHERE TRN.DOC_TYPE IS '" + docType + "'";
    cmd.sqlText += " AND  TRN.TRN_CODE IS '" + trnCode + "'";
    cmd.sqlText += " AND  TRN.DOCUMENT_DATE IS '" + documentDate + "'";
    cmd.sqlText += " ORDER BY TRN.DOC_TYPE ASC,DOC_NUMBER ASC,EXT_NUMBER ASC";

    //cmd.parameters.push(docType);
    //cmd.parameters.push(trnCode);
    //cmd.parameters.push(documentDate);

    cmd.executeReader(function (tx, res) {
        var stockTrns = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new S1_ST_STOCK_TRN();
                m.retrieveRdr(res.rows.item(i));
                m.WAREHOUSE_NAME = res.rows.item(i).WAREHOUSE_NAME;
                m.SUB_WAREHOUSE_NAME = res.rows.item(i).SUB_WAREHOUSE_NAME;
                m.WAREHOUSE_DESC = res.rows.item(i).WAREHOUSE_DESC;
                m.CV_NAME = res.rows.item(i).CV_NAME;
                m.REASON_NAME = res.rows.item(i).REASON_NAME;
                m.JOB_NAME = res.rows.item(i).JOB_NAME;
                m.PRODUCT_NAME = res.rows.item(i).PRODUCT_NAME;
                m.LOT_DESC = res.rows.item(i).LOT_DESC;
                m.SUBLOT_DESC = res.rows.item(i).SUBLOT_DESC;
                m.LABOR_DESC = res.rows.item(i).LABOR_DESC;
                stockTrns.push(m);
            }
        }
        successCB(stockTrns)

    }, function (err) {
        $.Ctx.MsgBox(err.message);
        errorCB(err);
    });
}

StockVar.prototype.getStockBalanceByStockTran = function (stockTran, successCB, errorCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT * FROM S1_ST_STOCK_BALANCE";
    cmd.sqlText += " WHERE COMPANY = '" + stockTran.COMPANY + "'";
    cmd.sqlText += " AND OPERATION = '" + stockTran.OPERATION + "'";
    cmd.sqlText += " AND SUB_OPERATION = '" + stockTran.SUB_OPERATION + "'";
    cmd.sqlText += " AND BUSINESS_UNIT = '" + stockTran.BUSINESS_UNIT + "'";
    cmd.sqlText += " AND WAREHOUSE_CODE = '" + stockTran.WAREHOUSE_CODE + "'";
    cmd.sqlText += " AND SUB_WAREHOUSE_CODE = '" + stockTran.SUB_WAREHOUSE_CODE + "'";
    cmd.sqlText += " AND PRODUCT_CODE = '" + stockTran.PRODUCT_CODE + "'";
    cmd.sqlText += " AND PRODUCT_SPEC = '" + stockTran.PRODUCT_SPEC + "'";
    cmd.sqlText += " AND LOT_NUMBER = '" + stockTran.LOT_NUMBER + "'";
    cmd.sqlText += " AND SUB_LOT_NUMBER = '" + stockTran.SUB_LOT_NUMBER + "'";
    cmd.sqlText += " AND SERIAL_NO = '" + stockTran.SERIAL_NO + "'";
    cmd.sqlText += " AND PRODUCTION_DATE = '" + stockTran.PRODUCTION_DATE + "'";
    cmd.sqlText += " AND EXPIRE_DATE = '" + stockTran.EXPIRE_DATE + "'";
    cmd.sqlText += " AND RECEIVED_DATE = '" + stockTran.RECEIVED_DATE + "'";

    cmd.executeReader(function (tx, res) {
        var stockBalance = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length == 1) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new S1_ST_STOCK_BALANCE();
                m.retrieveRdr(res.rows.item(i));
                stockBalance.push(m);
            }
            successCB(stockBalance)
        }
        else{
            errorCB('Stock Balance not equal 1 record!!!');
        }

    }, function (err) {
        $.Ctx.MsgBox(err.message);
        errorCB(err);
    });
}

StockVar.prototype.getStockTranGroupBy = function (docType, trnCode,docDate, successCB, errorCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT DOC_TYPE,TRN_CODE,DOC_NUMBER,MAX(LAST_UPDATE_DATE) AS LAST_UPDATE_DATE"
    cmd.sqlText += " FROM S1_ST_STOCK_TRN"
    cmd.sqlText += " WHERE DOC_TYPE IS ?"
    //cmd.sqlText += " AND TRN_CODE IS ?"
    cmd.sqlText += " AND DOCUMENT_DATE IS ?"
    cmd.sqlText += " GROUP BY DOC_TYPE,TRN_CODE,DOC_NUMBER"
    cmd.sqlText += " ORDER BY LAST_UPDATE_DATE DESC"
    //cmd.sqlText = "SELECT * FROM S1_ST_STOCK_TRN WHERE DOC_TYPE IS ?"
    cmd.parameters.push(docType);
    //cmd.parameters.push(trnCode);
    cmd.parameters.push(docDate);
    cmd.executeReader(function (tx, res) {
        var stockTrns = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new S1_ST_STOCK_TRN();
                m.retrieveRdr(res.rows.item(i));
                stockTrns.push(m);
            }
        }
        successCB(stockTrns);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
        errorCB(err);
    });
}

/*
StockVar.prototype.getStockDetail4Ref = function (docType, docDate, docNumber, successCB, errorCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT TRN.*";
    cmd.sqlText += ",CV_NAME";
    cmd.sqlText += ",(SELECT DESC1 FROM GENERAL_DESC WHERE GDTYPE = 'REACD' AND GDCODE =REASON_CODE)AS REASON_NAME";
    cmd.sqlText += ",JOB_NAME";
    cmd.sqlText += ",WAREHOUSE_NAME";
    cmd.sqlText += ",SUB_WAREHOUSE_NAME";
    cmd.sqlText += ",PRODUCT_NAME";
    cmd.sqlText += ",L.DESCRIPTION AS LOT_DESC";
    cmd.sqlText += ",SBL.DESCRIPTION AS SUBLOT_DESC";
    cmd.sqlText += ",LB.DESCRIPTION AS LABOR_DESC";
    cmd.sqlText += ",(WAREHOUSE_NAME || '/' || SUB_WAREHOUSE_NAME) AS WAREHOUSE_DESC";

    cmd.sqlText += " FROM S1_ST_STOCK_TRN TRN";
    cmd.sqlText += " LEFT OUTER JOIN  HH_CV_OPER CV ON TRN.CV_CODE =CV.CV_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_JOB_OPER ON TRN.PRODUCTION_NO =JOB_NO";
    cmd.sqlText += " LEFT OUTER JOIN HH_WAREHOUSE_OPER WH ON TRN.WAREHOUSE_CODE  =WH.WAREHOUSE_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_SUB_WAREHOUSE_OPER SWH ON TRN.SUB_WAREHOUSE_CODE =SWH.SUB_WAREHOUSE_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_PRODUCT_BU PD ON TRN.PRODUCT_CODE = PD.PRODUCT_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_LOT_OPER L ON TRN.LOT_NUMBER = L.LOT";
    cmd.sqlText += " LEFT OUTER JOIN HH_SUB_LOT_OPER SBL ON TRN.SUB_LOT_NUMBER = SBL.SUBLOT";
    cmd.sqlText += " LEFT OUTER JOIN HH_LABOR_OPER LB ON TRN.LABOR_CODE = LB.LABOR_CODE";
    cmd.sqlText += " WHERE TRN.DOC_TYPE IS '" + docType + "'";
    cmd.sqlText += " AND  TRN.DOCUMENT_DATE IS '" + docDate + "'";
    cmd.sqlText += " AND  TRN.DOC_NUMBER IS '" + docNumber + "'";
    cmd.sqlText += " ORDER BY TRN.DOC_TYPE ASC,DOC_NUMBER ASC,EXT_NUMBER ASC";

    cmd.executeReader(function (tx, res) {
        var stockTrns = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new S1_ST_STOCK_TRN();
                m.retrieveRdr(res.rows.item(i));
                m.WAREHOUSE_NAME = res.rows.item(i).WAREHOUSE_NAME;
                m.SUB_WAREHOUSE_NAME = res.rows.item(i).SUB_WAREHOUSE_NAME;
                m.WAREHOUSE_DESC = res.rows.item(i).WAREHOUSE_DESC;
                m.CV_NAME = res.rows.item(i).CV_NAME;
                m.REASON_NAME = res.rows.item(i).REASON_NAME;
                m.JOB_NAME = res.rows.item(i).JOB_NAME;
                m.PRODUCT_NAME = res.rows.item(i).PRODUCT_NAME;
                m.LOT_DESC = res.rows.item(i).LOT_DESC;
                m.SUBLOT_DESC = res.rows.item(i).SUBLOT_DESC;
                m.LABOR_DESC = res.rows.item(i).LABOR_DESC;
                stockTrns.push(m);
            }
        }
        successCB(stockTrns)

    }, function (err) {
        $.Ctx.MsgBox(err.message);
        errorCB(err);
    });
}
*/

StockVar.prototype.getStockDetail = function (docType, docDate, docNumber, successCB, errorCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT TRN.*";
    cmd.sqlText += ",CV_NAME";
    cmd.sqlText += ",(SELECT DESC1 FROM GENERAL_DESC WHERE GDTYPE = 'REACD' AND GDCODE =REASON_CODE)AS REASON_NAME";
    cmd.sqlText += ",JOB_NAME";
    cmd.sqlText += ",WAREHOUSE_NAME";
    cmd.sqlText += ",SUB_WAREHOUSE_NAME";
    cmd.sqlText += ",PRODUCT_NAME";
    cmd.sqlText += ",L.DESCRIPTION AS LOT_DESC";
    cmd.sqlText += ",SBL.DESCRIPTION AS SUBLOT_DESC";
    cmd.sqlText += ",LB.DESCRIPTION AS LABOR_DESC";
    cmd.sqlText += ",(WAREHOUSE_NAME || '/' || SUB_WAREHOUSE_NAME) AS WAREHOUSE_DESC";

    cmd.sqlText += " FROM S1_ST_STOCK_TRN TRN";
    cmd.sqlText += " LEFT OUTER JOIN  HH_CV_OPER CV ON TRN.CV_CODE =CV.CV_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_JOB_OPER ON TRN.PRODUCTION_NO =JOB_NO";
    cmd.sqlText += " LEFT OUTER JOIN HH_WAREHOUSE_OPER WH ON TRN.WAREHOUSE_CODE  =WH.WAREHOUSE_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_SUB_WAREHOUSE_OPER SWH ON TRN.SUB_WAREHOUSE_CODE =SWH.SUB_WAREHOUSE_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_PRODUCT_BU PD ON TRN.PRODUCT_CODE = PD.PRODUCT_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_LOT_OPER L ON TRN.LOT_NUMBER = L.LOT";
    cmd.sqlText += " LEFT OUTER JOIN HH_SUB_LOT_OPER SBL ON TRN.SUB_LOT_NUMBER = SBL.SUBLOT";
    cmd.sqlText += " LEFT OUTER JOIN HH_LABOR_OPER LB ON TRN.LABOR_CODE = LB.LABOR_CODE";
    cmd.sqlText += " WHERE TRN.DOC_TYPE IS '" + docType + "'";
    //cmd.sqlText += " AND  TRN.TRN_CODE IS '" + trnCode + "'";
    cmd.sqlText += " AND  TRN.DOCUMENT_DATE IS '" + docDate + "'";
    cmd.sqlText += " AND  TRN.DOC_NUMBER IS '" + docNumber + "'";
    cmd.sqlText += " ORDER BY TRN.DOC_TYPE ASC,DOC_NUMBER ASC,EXT_NUMBER ASC";

    //    cmd.parameters.push(docType);
    //    cmd.parameters.push(trnCode);
    //    cmd.parameters.push(docDate);
    //    cmd.parameters.push(docNumber);
    cmd.executeReader(function (tx, res) {
        var stockTrns = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new S1_ST_STOCK_TRN();
                m.retrieveRdr(res.rows.item(i));
                m.WAREHOUSE_NAME = res.rows.item(i).WAREHOUSE_NAME;
                m.SUB_WAREHOUSE_NAME = res.rows.item(i).SUB_WAREHOUSE_NAME;
                m.WAREHOUSE_DESC = res.rows.item(i).WAREHOUSE_DESC;
                m.CV_NAME = res.rows.item(i).CV_NAME;
                m.REASON_NAME = res.rows.item(i).REASON_NAME;
                m.JOB_NAME = res.rows.item(i).JOB_NAME;
                m.PRODUCT_NAME = res.rows.item(i).PRODUCT_NAME;
                m.LOT_DESC = res.rows.item(i).LOT_DESC;
                m.SUBLOT_DESC = res.rows.item(i).SUBLOT_DESC;
                m.LABOR_DESC = res.rows.item(i).LABOR_DESC;
                stockTrns.push(m);
            }
        }
        successCB(stockTrns)

    }, function (err) {
        $.Ctx.MsgBox(err.message);
        errorCB(err);
    });
}

StockVar.prototype.getMultiStockByDocType = function (docTypes, docDate, docNumber, successCB, errorCB) {

    var doctype='';
    $.each(docTypes,function(i,p){
        doctype +="'" + p.DOC_TYPE +"',"
    });
    doctype =doctype.substr(0,doctype.length -1);
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT TRN.*";
    cmd.sqlText += ",CV_NAME";
    cmd.sqlText += ",(SELECT DESC1 FROM GENERAL_DESC WHERE GDTYPE = 'REACD' AND GDCODE =REASON_CODE)AS REASON_NAME";
    cmd.sqlText += ",JOB_NAME";
    cmd.sqlText += ",WAREHOUSE_NAME";
    cmd.sqlText += ",SUB_WAREHOUSE_NAME";
    cmd.sqlText += ",PRODUCT_NAME";
    cmd.sqlText += ",L.DESCRIPTION AS LOT_DESC";
    cmd.sqlText += ",SBL.DESCRIPTION AS SUBLOT_DESC";
    cmd.sqlText += ",LB.DESCRIPTION AS LABOR_DESC";
    cmd.sqlText += ",(WAREHOUSE_NAME || '/' || SUB_WAREHOUSE_NAME) AS WAREHOUSE_DESC";

    cmd.sqlText += " FROM S1_ST_STOCK_TRN TRN";
    cmd.sqlText += " LEFT OUTER JOIN  HH_CV_OPER CV ON TRN.CV_CODE =CV.CV_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_JOB_OPER ON TRN.PRODUCTION_NO =JOB_NO";
    cmd.sqlText += " LEFT OUTER JOIN HH_WAREHOUSE_OPER WH ON TRN.WAREHOUSE_CODE  =WH.WAREHOUSE_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_SUB_WAREHOUSE_OPER SWH ON TRN.SUB_WAREHOUSE_CODE =SWH.SUB_WAREHOUSE_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_PRODUCT_BU PD ON TRN.PRODUCT_CODE = PD.PRODUCT_CODE";
    cmd.sqlText += " LEFT OUTER JOIN HH_LOT_OPER L ON TRN.LOT_NUMBER = L.LOT";
    cmd.sqlText += " LEFT OUTER JOIN HH_SUB_LOT_OPER SBL ON TRN.SUB_LOT_NUMBER = SBL.SUBLOT";
    cmd.sqlText += " LEFT OUTER JOIN HH_LABOR_OPER LB ON TRN.LABOR_CODE = LB.LABOR_CODE";
    cmd.sqlText += " WHERE TRN.DOC_TYPE IN (" + doctype + ")";
    //cmd.sqlText += " AND  TRN.TRN_CODE IS '" + trnCode + "'";
    cmd.sqlText += " AND  TRN.DOCUMENT_DATE IS '" + docDate + "'";
    cmd.sqlText += " AND  TRN.DOC_NUMBER IS '" + docNumber + "'";
    cmd.sqlText += " ORDER BY TRN.DOC_TYPE ASC,DOC_NUMBER ASC,EXT_NUMBER ASC";

    //    cmd.parameters.push(docType);
    //    cmd.parameters.push(trnCode);
    //    cmd.parameters.push(docDate);
    //    cmd.parameters.push(docNumber);
    cmd.executeReader(function (tx, res) {
        var stockTrns = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new S1_ST_STOCK_TRN();
                m.retrieveRdr(res.rows.item(i));
                m.WAREHOUSE_NAME = res.rows.item(i).WAREHOUSE_NAME;
                m.SUB_WAREHOUSE_NAME = res.rows.item(i).SUB_WAREHOUSE_NAME;
                m.WAREHOUSE_DESC = res.rows.item(i).WAREHOUSE_DESC;
                m.CV_NAME = res.rows.item(i).CV_NAME;
                m.REASON_NAME = res.rows.item(i).REASON_NAME;
                m.JOB_NAME = res.rows.item(i).JOB_NAME;
                m.PRODUCT_NAME = res.rows.item(i).PRODUCT_NAME;
                m.LOT_DESC = res.rows.item(i).LOT_DESC;
                m.SUBLOT_DESC = res.rows.item(i).SUBLOT_DESC;
                m.LABOR_DESC = res.rows.item(i).LABOR_DESC;
                stockTrns.push(m);
            }
        }
        successCB(stockTrns)

    }, function (err) {
        $.Ctx.MsgBox(err.message);
        errorCB(err);
    });
}


StockVar.prototype.saveStockTran = function (stockTrans,  stockBalance, successCB, errorCB) {
    var cmds = new Array();

    $.each(stockTrans, function (i, s) {
        var stock = new S1_ST_STOCK_TRN();
        stock.COMPANY = s.COMPANY;
        stock.OPERATION = s.OPERATION;
        stock.SUB_OPERATION = s.SUB_OPERATION;
        stock.BUSINESS_UNIT = s.BUSINESS_UNIT;
        stock.DOCUMENT_DATE = s.DOCUMENT_DATE;
        stock.DOC_TYPE = s.DOC_TYPE;
        stock.DOC_NUMBER =String(s.DOC_NUMBER);
        stock.EXT_NUMBER = s.EXT_NUMBER;
        stock.TRN_TYPE = s.TRN_TYPE;
        stock.TRN_CODE = s.TRN_CODE;
        stock.CAL_TYPE = s.CAL_TYPE;
        stock.LABOR_CODE = s.LABOR_CODE;
        stock.CV_CODE = s.CV_CODE;
        stock.REASON_CODE = s.REASON_CODE;
        stock.PRODUCTION_NO = s.PRODUCTION_NO;
        stock.FORMULA_CODE = s.FORMULA_CODE;
        stock.PRODUCED_ITEM = s.PRODUCED_ITEM;
        stock.MACHINE_NO = s.MACHINE_NO;
        stock.PRODUCT_STOCK_TYPE = s.PRODUCT_STOCK_TYPE;

        stock.PRODUCT_CODE = s.PRODUCT_CODE;
        stock.PRODUCT_SPEC = s.PRODUCT_SPEC;
        stock.LOT_NUMBER = s.LOT_NUMBER;
        stock.SUB_LOT_NUMBER = s.SUB_LOT_NUMBER;
        stock.PRODUCTION_DATE = s.PRODUCTION_DATE;
        stock.EXPIRE_DATE = s.EXPIRE_DATE;

        stock.QUANTITY = s.QUANTITY;
        stock.WEIGHT = s.WEIGHT;
        stock.STATUS = 'A';
        stock.STATUS_DATE =  (new XDate()).toDbDateStr();
        stock.SERIAL_NO = s.SERIAL_NO;

        stock.OWNER = $.Ctx.UserId;
        stock.CREATE_DATE = (new XDate()).toDbDateStr();
        stock.LAST_UPDATE_DATE = (new XDate()).toDbDateStr();
        stock.FUNCTION = 'A';


        stock.SHIFT_NO = s.SHIFT_NO;
        stock.WAREHOUSE_CODE = s.WAREHOUSE_CODE;
        stock.SUB_WAREHOUSE_CODE = s.SUB_WAREHOUSE_CODE;
        stock.RECEIVED_DATE = s.RECEIVED_DATE;

        stock.REF_COMPANY =s.COMPANY;
        stock.REF_OPERATION_CODE =s.OPERATION;
        stock.REF_SUB_OPERATION =s.SUB_OPERATION;
        stock.REF_DOC_DATE =s.DOCUMENT_DATE;
        stock.REF_DOC_TYPE = s.DOC_TYPE;
        stock.REF_DOC_NO =String(s.REF_DOC_NO);


        var cmd = stock.insertCommand($.Ctx.DbConn);
        //cmd.executeNonQuery();
        cmds.push(cmd);

        //STOCK BALANCE
        var cmd = $.Ctx.DbConn.createSelectCommand();
        cmd.sqlText = "UPDATE S1_ST_STOCK_BALANCE";

        if(s.CAL_TYPE ==1){
            cmd.sqlText += " SET QUANTITY = (QUANTITY+{0})".format([s.QUANTITY]);
            cmd.sqlText += " ,WEIGHT = (WEIGHT+{0})".format([ s.WEIGHT]);

        }else{
            if(s.CAL_TYPE==-1)
            {
                cmd.sqlText += " SET QUANTITY = (QUANTITY-{0})".format([s.QUANTITY]);
                cmd.sqlText += " ,WEIGHT = (WEIGHT-{0})".format([ s.WEIGHT]);
            }
        }

        cmd.sqlText += " ,LAST_UPDATE_DATE = '" + (new XDate()).toDbDateStr() + "'";
        cmd.sqlText += " WHERE COMPANY = '" + s.COMPANY + "'";
        cmd.sqlText += " AND OPERATION = '" + s.OPERATION + "'";
        cmd.sqlText += " AND SUB_OPERATION = '" + s.SUB_OPERATION + "'";
        cmd.sqlText += " AND BUSINESS_UNIT = '" + s.BUSINESS_UNIT + "'";
        cmd.sqlText += " AND WAREHOUSE_CODE = '" + s.WAREHOUSE_CODE + "'";
        cmd.sqlText += " AND SUB_WAREHOUSE_CODE = '" + s.SUB_WAREHOUSE_CODE + "'";
        cmd.sqlText += " AND PRODUCT_CODE = '" + s.PRODUCT_CODE + "'";
        cmd.sqlText += " AND PRODUCT_SPEC = '" + s.PRODUCT_SPEC + "'";
        cmd.sqlText += " AND LOT_NUMBER = '" + s.LOT_NUMBER + "'";
        cmd.sqlText += " AND SUB_LOT_NUMBER = '" + s.SUB_LOT_NUMBER + "'";
        cmd.sqlText += " AND SERIAL_NO = '" + s.SERIAL_NO + "'";
        cmd.sqlText += " AND PRODUCTION_DATE = '" + s.PRODUCTION_DATE + "'";
        cmd.sqlText += " AND EXPIRE_DATE = '" + s.EXPIRE_DATE + "'";
        cmd.sqlText += " AND RECEIVED_DATE = '" + s.RECEIVED_DATE + "'";

        cmds.push(cmd);

    });

    var trn = new DbTran($.Ctx.DbConn);
    trn.executeNonQuery(cmds, function () {
        if (typeof (successCB) == "function")
            successCB(true); ;
    }, function (errors) {
        successCB(false);
        console.log(errors);
    });

}

StockVar.prototype.deleteStockTran = function (stockTrans, successCB, errorCB) {
    var cmds = new Array();
    $.each(stockTrans, function (i, s) {
        var stock = new S1_ST_STOCK_TRN();
        stock.COMPANY = s.COMPANY;
        stock.OPERATION = s.OPERATION;
        stock.SUB_OPERATION = s.SUB_OPERATION;
        stock.BUSINESS_UNIT = s.BUSINESS_UNIT;
        stock.DOC_TYPE = s.DOC_TYPE;
        stock.DOC_NUMBER =String( s.DOC_NUMBER);
        stock.EXT_NUMBER = s.EXT_NUMBER;

        var cmd = stock.deleteCommand($.Ctx.DbConn);
        cmds.push(cmd);

        //STOCK BALANCE
        var cmd = $.Ctx.DbConn.createSelectCommand();
        cmd.sqlText = "UPDATE S1_ST_STOCK_BALANCE";

        if(s.CAL_TYPE ==1){
            cmd.sqlText += " SET QUANTITY = (QUANTITY-{0})".format([s.QUANTITY]);
            cmd.sqlText += " ,WEIGHT = (WEIGHT-{0})".format([ s.WEIGHT]);

        }else{
            if(s.CAL_TYPE==-1)
            {
                cmd.sqlText += " SET QUANTITY = (QUANTITY+{0})".format([s.QUANTITY]);
                cmd.sqlText += " ,WEIGHT = (WEIGHT+{0})".format([ s.WEIGHT]);
            }
        }

        //cmd.sqlText += " SET QUANTITY = (QUANTITY+{0})".format([s.QUANTITY]);
        //cmd.sqlText += " ,WEIGHT = (WEIGHT+{0})".format([ s.WEIGHT]);
        cmd.sqlText += " ,LAST_UPDATE_DATE = '" + (new XDate()).toDbDateStr() + "'";
        cmd.sqlText += " WHERE COMPANY = '" + s.COMPANY + "'";
        cmd.sqlText += " AND OPERATION = '" + s.OPERATION + "'";
        cmd.sqlText += " AND SUB_OPERATION = '" + s.SUB_OPERATION + "'";
        cmd.sqlText += " AND BUSINESS_UNIT = '" + s.BUSINESS_UNIT + "'";
        cmd.sqlText += " AND WAREHOUSE_CODE = '" + s.WAREHOUSE_CODE + "'";
        cmd.sqlText += " AND SUB_WAREHOUSE_CODE = '" + s.SUB_WAREHOUSE_CODE + "'";
        cmd.sqlText += " AND PRODUCT_CODE = '" + s.PRODUCT_CODE + "'";
        cmd.sqlText += " AND PRODUCT_SPEC = '" + s.PRODUCT_SPEC + "'";
        cmd.sqlText += " AND LOT_NUMBER = '" + s.LOT_NUMBER + "'";
        cmd.sqlText += " AND SUB_LOT_NUMBER = '" + s.SUB_LOT_NUMBER + "'";
        cmd.sqlText += " AND SERIAL_NO = '" + s.SERIAL_NO + "'";
        cmd.sqlText += " AND PRODUCTION_DATE = '" + s.PRODUCTION_DATE + "'";
        cmd.sqlText += " AND EXPIRE_DATE = '" + s.EXPIRE_DATE + "'";
        cmd.sqlText += " AND RECEIVED_DATE = '" + s.RECEIVED_DATE + "'";
        cmds.push(cmd);

    });

    var trn = new DbTran($.Ctx.DbConn);
    trn.executeNonQuery(cmds, function () {
        if (typeof (successCB) == "function")
            successCB(true); ;
    }, function (errors) {
        successCB(false);
        console.log(errors);
    });

}

StockVar.prototype.getMaxDocumentNo = function (docType, trnCode, documentDate, successCB, errorCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT MAX(DOC_NUMBER) AS DOC_NUMBER"
    cmd.sqlText += " FROM S1_ST_STOCK_TRN"
    //cmd.sqlText += " WHERE DOC_TYPE IS ?"
    //cmd.sqlText += " AND TRN_CODE IS ?"
    //cmd.sqlText += " AND DOCUMENT_DATE IS ?"
    //cmd.parameters.push(docType);
    //cmd.parameters.push(trnCode);
    //cmd.parameters.push(documentDate);
    cmd.executeReader(function (tx, res) {
        if (res.rows.length > 0) {
            if (res.rows.item(0).DOC_NUMBER != null) {
                successCB(Number(res.rows.item(0).DOC_NUMBER) + 1);
            }
            else {
                successCB(1);
            }
        } else
            successCB(1);

    }, function (err) {
        $.Ctx.MsgBox(err.message);
        errorCB(err);
    });
}

StockVar.prototype.getExtNumber = function (docType, trnCode, docDate, docNumber, successCB, errorCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT MAX(EXT_NUMBER) AS EXT_NUMBER";
    cmd.sqlText += " FROM S1_ST_STOCK_TRN";
    cmd.sqlText += " WHERE DOC_TYPE = '" + docType + "'";
    cmd.sqlText += " AND TRN_CODE = '" + trnCode + "'";
    cmd.sqlText += " AND DOCUMENT_DATE = '" + docDate + "'";
    cmd.sqlText += " AND DOC_NUMBER = '" + docNumber + "'";
//    cmd.parameters.push(docType);
//    cmd.parameters.push(trnCode);
//    cmd.parameters.push(docDate);
//    cmd.parameters.push(docNumber);
    cmd.executeReader(function (tx, res) {
        if (res.rows.length > 0) {
            if (res.rows.item(0).EXT_NUMBER != null) {
                successCB(Number(res.rows.item(0).EXT_NUMBER) + 1);
            }
            else {
                successCB(1);
            }
        } else
            successCB(1);

    }, function (err) {
        $.Ctx.MsgBox(err.message);
        errorCB(err);
    });
}


$.StockCtx = new StockVar();