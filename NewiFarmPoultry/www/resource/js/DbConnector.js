


//util
String.prototype.trim = function () { return this.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };

String.prototype.contains = function (txt) {    
        if (!IsNullOrEmpty(this) && !IsNullOrEmpty(txt)) {
            var lSrc = this.toLowerCase();
            var lTxt = txt.toLowerCase();
            if (lSrc.indexOf(lTxt) !== -1) {
                return true;
            }
        }
        return false;    
};

String.prototype.containsExact = function (txt) {
    if (!IsNullOrEmpty(this) && !IsNullOrEmpty(txt)) {       
        if (this.indexOf(txt) !== -1) {
            return true;
        }
    }
    return false;   
};

String.prototype.format = function (args) {
    var str = this;
    return str.replace(String.prototype.format.regex, function (item) {
        var intVal = parseInt(item.substring(1, item.length - 1));
        var replace;
        if (intVal >= 0) {
            replace = args[intVal];
        } else if (intVal === -1) {
            replace = "{";
        } else if (intVal === -2) {
            replace = "}";
        } else {
            replace = "";
        }
        return replace;
    });
};

String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");

//pads left
String.prototype.lpad = function (padString, length) {
    var str = this;
    while (str.length < length)
    { str = padString + str; }
    return str;
}

//pads right
String.prototype.rpad = function (padString, length) {
    var str = this;
    while (str.length < length)
    { str = str + padString; }
    return str;
}

Number.prototype.toCurrency = function ($O) { // extending Number prototype

    String.prototype.separate_thousands = function () { // Thousands separation
        $val = this;
        var rx = new RegExp('(-?[0-9]+)([0-9]{3})');
        while (rx.test($val)) { $val = $val.replace(rx, '$1' + $O.thousands_separator + '$2'); }
        return $val;
    }

    /*Number.prototype.toFixed = function () { // Rounding
        var m = Math.pow(10, $O.use_fractions.fractions);
        return Math.round(this * m, 0) / m;
    }*/

    String.prototype.times = function (by) { // String multiplication
        by = (by >> 0);
        var t = (by > 1 ? this.times(by / 2) : '');
        return t + (by % 2 ? t + this : t);
    }

    var $A = this;

    /* I like to keep all options, as the name would sugesst, **optional** :) so, let me make tham as such */
    $O ? null : $O = new Object;
    /* If no thousands_separator is present default to "," */
    $O.thousands_separator ? null : $O.thousands_separator = ",";
    /* If no currency_symbol is present default to "$" */
    $O.currency_symbol ? null : $O.currency_symbol = "";

    // Fractions use is separated, just in case you don't want them
    if ($O.use_fractions) {
        $O.use_fractions.fractions ? null : $O.use_fractions.fractions = 2;
        $O.use_fractions.fraction_separator ? null : $O.use_fractions.fraction_separator = ".";
    } else {
        $O.use_fractions = new Object;
        $O.use_fractions.fractions = 0;
        $O.use_fractions.fraction_separator = " ";
    }
    // We round this number
    $A.round = $A.toFixed();

    // We convert rounded Number to String and split it to integrer and fractions
    $A.arr = ($A.round + "").split(".");
    // First part is an integrer
    $A._int = $A.arr[0].separate_thousands();
    // Second part, if exists, are rounded decimals
    $A.arr[1] == undefined ? $A._dec = $O.use_fractions.fraction_separator + "0".times($O.use_fractions.fractions) : $A._dec = $O.use_fractions.fraction_separator + $A.arr[1];

    /* If no symbol_position is present, default to "front" */
    $O.symbol_position ? null : $O.symbol_position = "front";
    $O.symbol_position == "front" ? $A.ret = $O.currency_symbol + $A._int + $A._dec : $A.ret = $A._int + $A._dec + " " + $O.currency_symbol;
    return $A.ret;
}

function parseJsonDateStr(jsonDateStr) {
    var offset = new XDate().getTimezoneOffset() * 60000;
    var parts = /\/Date\((-?\d+)([+-]\d{2})?(\d{2})?.*/.exec(jsonDateStr);
    if (parts[2] == undefined) { parts[2] = 0; }
    if (parts[3] == undefined) { parts[3] = 0; }
    return new XDate(+parts[1] + offset + parts[2] * 3600000 + parts[3] * 60000);
}

XDate.prototype.toJsonDateStr = function () {
    var localTime = this.getTime();
    var localOffset = (this.getTimezoneOffset()) / 60;
    var strOffset;
    if (localOffset < 0) {
        strOffset = "+" + (-1 * localOffset).toString().lpad("0", 2) + "00";

    } else {
        strOffset = "-" + localOffset.toString().lpad("0", 2) + "00";

    }
    var strFormat = "/Date({0}{1})/";
    return strFormat.format([localTime.toString(), strOffset]);
}

//    YYYY-MM-DD HH:MM:SS.SSS
XDate.prototype.toDbDateStr = function () {
    //In reality the DbStr must come from toJSON()
    var date = "{0}-{1}-{2}".format([this.getFullYear(), (this.getMonth() + 1).toString().lpad("0", 2), this.getDate().toString().lpad("0", 2)]);
    var time = "{0}:{1}:{2}.{3}".format([this.getHours().toString().lpad("0", 2), this.getMinutes().toString().lpad("0", 2), this.getSeconds().toString().lpad("0", 2), this.getMilliseconds().toString().lpad("0", 3)]);
    if (time != "00:00:00.000") {
        return date + " " + time;
    } else {
        return date;
    }
}

XDate.prototype.toDbDateOnlyStr = function () {
    //In reality the DbStr must come from toJSON()
    var strFormat = "{0}-{1}-{2}";
    return strFormat.format([this.getFullYear(), (this.getMonth() + 1).toString().lpad("0", 2), this.getDate().toString().lpad("0", 2)]);
}

//    YYYY-MM-DD HH:MM:SS.SSS
function parseDbDateStr(dbDateStr) {
    if (dbDateStr.length > 10) {
        return new XDate(dbDateStr);
    } else {
        return new XDate(dbDateStr + " 00:00:00.000");
    }
    
}

function XLogWrapper() {
    this.LogTagOn = new Object();
    //    Console/Device/File
    this.LogMode = 'Console';
    this.LogFile = '';
    this.LogTagOn.FW = true;
    this.LogTagOn.GB = true;
}

XLogWrapper.prototype.log = function (tag, logObj) {
    if ((this.LogTagOn[tag] != undefined) && (this.LogTagOn[tag] == true)) {
        if (this.LogMode == 'Console') {
            console.log(logObj);
        } else if (this.LogMode = 'Device') {
            console.log(logObj);
        } else if (this.LogMode = 'File') {
            this.LogFile &= logObj.toString();
            this.LogFile &= "\n";
        }
    }
}

XLogWrapper.prototype.clearLogFile = function () {
    this.LogFile = '';
}

XLogWrapper.prototype.turnOn = function (tag) {
    this.LogTagOn[tag] = true;
}

XLogWrapper.prototype.turnOff = function (tag) {
    this.LogTagOn[tag] = false;
}

$.xlog = new XLogWrapper();

//Base Business Object
function BaseBo() {

}

BaseBo.prototype.insertCommand = function (dbConn) {
    var fields = this.getFields();
    var name = this.getTableName();
    var str = "INSERT INTO {0} ({1}) VALUES({2})";
    var colStr = "";
    var valStr = "";
    var parameters = [];
    for (i in fields) {
        var field = fields[i];
        //        if (field["remark"] == "Pk" && (field["val"] == "integer" || field["val"] == "numeric")) {
        //            continue;
        //        }
        if (colStr != "") {
            colStr += ",";
        }
        var key = field["key"]
        colStr += key;
        if (valStr != "") {
            valStr += ",";
        }
        valStr += "?";
        parameters.push(this[key]);
    }
    var sqlText = str.format([name, colStr, valStr]);
    var ret = new DbCommand(this);
    ret.Conn = dbConn;
    ret.sqlText = sqlText;
    ret.parameters = parameters;
    return ret;
}

BaseBo.prototype.getPkConditionStr = function () {
    var ret = "";
    var fStr = "{0} = ?";
    var fLst = this.getFields();
    for (i in fLst) {
        var field = fLst[i];
        if (field.remark == "Pk") {
            if (ret != "") {
                ret += " AND ";
            }
            ret += fStr.format([field.key]);
        }
    }
    return ret;
}

BaseBo.prototype.getPkConditionParam = function () {
    var ret = new Array;
    var fLst = this.getFields();
    for (i in fLst) {
        var field = fLst[i];
        if (field.remark == "Pk") {
            ret.push(this[field.key]);
        }
    }
    return ret;
}


BaseBo.prototype.updateCommand = function (dbConn) {
    var fields = this.getFields();
    var name = this.getTableName();
    var str = "UPDATE {0} SET {1} WHERE {2}";
    var colStr = "";
    var fStr = "{0} = ?"
    var parameters = [];
    for (i in fields) {
        var field = fields[i];
        if (colStr != "") {
            colStr += ",";
        }
        colStr += fStr.format([field.key]);
        parameters.push(this[field.key]);
    }
    var sqlText = str.format([name, colStr, this.getPkConditionStr()]);
    var pLst = this.getPkConditionParam();
    for (i in pLst) {
        var p = pLst[i];
        parameters.push(p);
    }
    var ret = new DbCommand(this);
    ret.Conn = dbConn;
    ret.sqlText = sqlText;
    ret.parameters = parameters;
    return ret;
}

BaseBo.prototype.deleteCommand = function (dbConn) {
    var fields = this.getFields();
    var name = this.getTableName();
    var str = "DELETE FROM {0} WHERE {1}";
    var sqlText = str.format([name, this.getPkConditionStr()]);
    var pLst = this.getPkConditionParam();

    var ret = new DbCommand(this);
    ret.Conn = dbConn;
    ret.sqlText = sqlText;
    ret.parameters = pLst;
    return ret;
}
BaseBo.prototype.createTableCommand = function (dbConn) {
    var fields = this.getFields();
    var name = this.getTableName();
    var str = "CREATE TABLE IF NOT EXISTS {0}({1} ,primary key ({2}))";
    var colStr = "";
    var pkFields = "";
    for (var i = 0; i < fields.length; i++) {
        if (colStr != "") {
            colStr += ",";
        }
        var fStr = "{0} {1} ";

        if (fields[i].remark == "Pk") {
            if (pkFields != "") {
                pkFields = pkFields + ",";
            }
            pkFields = pkFields + fields[i].key;
            //            primary key (Code,DomainVal)
        }
        colStr += fStr.format([fields[i].key, fields[i].val]);
    }
    var sqlText = str.format([name, colStr, pkFields]);
    var ret = new DbCommand(this);
    ret.Conn = dbConn;
    ret.sqlText = sqlText;
    return ret;
}
BaseBo.prototype.dropTableCommand = function (dbConn) {
    var fields = this.getFields();
    var name = this.getTableName();
    var str = ("DROP TABLE IF EXISTS {0}");
    var sqlText = str.format([name]);
    var ret = new DbCommand(this);
    ret.Conn = dbConn;
    ret.sqlText = sqlText;
    return ret;
}

//Retrieve from json wcf object
BaseBo.prototype.toJsonDateStr = function () {
    var fields = this.getFields();
    for (var i = 0; i < fields.length; i++) {
        var key = fields[i].key;
        var t = fields[i].val;
        if (this[key] != null) {
            if (t == 'date') {
                this[key] = parseDbDateStr(this[key]).toJsonDateStr();
            }
        }
      
    }
}

BaseBo.prototype.toDbDateStr = function () {
    var fields = this.getFields();
    for (var i = 0; i < fields.length; i++) {
        var key = fields[i].key;
        var t = fields[i].val;
        if (this[key] != null) {
            if (t == 'date') {
                this[key] = parseJsonDateStr(this[key]).toDbDateStr();
            }
        }

    }
}


//Retrieve from db data reader
BaseBo.prototype.retrieveRdr = function (sourceObj) {
    var fields = this.getFields();
    for (var i = 0; i < fields.length; i++) {
        var key = fields[i].key;
        $.xlog.log('FW',sourceObj[key]);
        try {
            this[key] = sourceObj[key];
        }
        catch (err) {
            //do nothing;
            $.xlog.log('FW',"Error key=" + key + "  ,Retrieving:" + this[key] + " from " + sourceObj[key] + "  ,Error:" + err);
        }
    }
}

//Retrieve from json wcf object
BaseBo.prototype.retrieveJson = function (sourceObj) {
    if (sourceObj != undefined) {
        if (sourceObj.hasOwnProperty('d')) {
            sourceObj = sourceObj.d;
        }
        var fields = this.getFields();
        for (var i = 0; i < fields.length; i++) {
            var key = fields[i].key;
            var typ = fields[i].val;
            try {
                if ((typ != undefined) && (typ == "date")) {
                    if (sourceObj[key] != undefined) {
                        this[key] = parseJsonDateStr(sourceObj[key]).toDbDateStr();
                    }
                } else {
                    this[key] = sourceObj[key];
                }
            }
            catch (err) {
                //do nothing;
                $.xlog.log('FW',"Error key=" + key + "  ,Retrieving:" + this[key] + " from " + sourceObj[key] + "  ,Error:" + err);
            }
        }
    }

}



//BaseBo.prototype.persist = function (sourceObj) {
//    var fields = this.getFields();
//    for (var i = 0; i < fields.length; i++) {
//        var key = fields[i].key;
//        try {
//            sourceObj[key] = this[key];
//        }
//        catch (err) {
//            //do nothing;
//            $.xlog.log('FW',"Error key=" + key + "  ,Persisting:" + this[key] + " to " + sourceObj[key] + "  ,Error:" + err);
//        }
//    }
//}


//Class DbConnector
function DbConnector(name, version, displayname, size) {
    //this.database =  window.openDatabase("DBName", "1.0", "description", 5*1024*1024);
    this.database = window.openDatabase(name, version, displayname, size);
    this.name = name;
    this.version = version;
    this.displayName = displayname;
    this.size = size;
}

DbConnector.prototype.createSelectCommand = function () {
    var ret = new DbCommand();
    ret.Conn = this;
    return ret;
}

DbConnector.prototype.createBoCommand = function (Bo) {
    var ret = new DbCommand(Bo);
    ret.Conn = this;
    return ret;
}


//Class DbCommand 
function DbCommand(Bo) {
    this.Conn = null;
    this.Bo = Bo;
    this.name = null;
    if (Bo != undefined) { Bo.getTableName(); }
    //fields = { key: 'DeviceId', remark:'Pk', val: 'text' }
    this.fields = null;
    if (Bo != undefined) { Bo.getFields(); }
    this.sqlText = "";
    this.parameters = new Array;
    this.asyncParams = new Array;
}


DbCommand.prototype.clear = function () {
    this.sqlText = "";
    this.parameters = new Array;
    return this;
}

DbCommand.prototype.executeReader = function (success, fail) {
    var trn = new DbTran(this.Conn);
    $.xlog.log('FW', "Executing :" + this.sqlText);
    $.xlog.log('FW', "Command Parameter:" + this.parameters);
    trn.executeReader(this.sqlText, this.parameters, success, fail);
    return this;
}

DbCommand.prototype.executeNonQuery = function (success, fail) {
    var trn = new DbTran(this.Conn);
    trn.executeNonQuery([this], success, fail);
    return this;
}

//Class DbTran 
function DbTran(dbConnector) {
    this.conn = dbConnector;
    this.database = dbConnector.database;
    this.name = dbConnector.name;
    this.version = dbConnector.version;
    this.displayName = dbConnector.displayname;
    this.size = dbConnector.size;
    this.errors = [];
}

DbTran.prototype.executeReader = function (sql, param, success, fail) {
    this.errors = [];
    this.database.transaction(
        function (tx) {           
            tx.executeSql(sql, param,
            function (t, result) {
                $.xlog.log('FW',"Read complete");
                if ((success != undefined) && (typeof (success) == "function")) {
                    success(t, result);
                }

            }
            , function (tx , error) {
                $.xlog.log('FW',"Read fail");
                if ((fail != undefined) && (typeof (fail) == "function")) {
                    fail(error);
                }

            });
        });

}


DbTran.prototype.executeNonQuery = function (dbCommandList, success, fail) {
    this.database.transaction(
        function (tx) {
            for (var i=0;i< dbCommandList.length;i++) {
                var cmd = dbCommandList[i];
                $.xlog.log('FW',"Executing Command:" + cmd.sqlText);
                $.xlog.log('FW',"Command Parameter:" + cmd.parameters);
                tx.executeSql(cmd.sqlText, cmd.parameters,
                    function (t, result) {
                        //                        tx_flag++;
                    }
                    , function (t,error) {
                        $.xlog.log('FW',"executeSql Error:");
                        $.xlog.log('FW',error);
                        if ((fail != undefined) && (typeof (fail) == "function")) {
                            fail(error);
                        }
                        return true; //For Rollback
                    });
            }
        }
    ,
        function (txError , error) {
            $.xlog.log('FW',"Transactions  Error");
            $.xlog.log('FW', error);
            if ((fail != undefined) && (typeof (fail) == "function")) {
                fail(error);
            }
        }
    ,
        function () {
            $.xlog.log('FW',"Transactions Finish");
            if ((success != undefined) && (typeof (success) == "function")) {
                success();
            }
        }
     );
}








