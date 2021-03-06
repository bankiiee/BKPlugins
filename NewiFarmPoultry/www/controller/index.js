﻿$.Ctx.InitFirstPage();

document.addEventListener("deviceready", onDeviceReady, false);


var _currDevice = new HH_DEVICES();
_currDevice.DEVICE_UID = "00000";
_currDevice.TAG = "Chrome" + "xxx";
_currDevice.DEVICE_TYPE = "xxx";

var TimeoutExtent = 0;

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


function onDeviceReady() {
    var platformStr = device.platform;
    console.log(platformStr);
    if (platformStr == "Android"){
        RegisterMobile(device.uuid);
    }
    else{
        var secureDeviceIdentifier = window.plugins.secureDeviceIdentifier;
        secureDeviceIdentifier.get({
            domain: 'com.example.myapp',
            key: 'difficult-to-guess-key'
        }, function(udid) {
            RegisterMobile(udid);
        });
        
         console.log((window.plugins.BKDataBaseDiagnosis == 'undefined'?'FAILED':'SUCCESS'));
        //console.log(window.plugins.BKDataBaseDiagnosis)
       // var databaseDiag = window.plugins.BKDataBaseDiagnosis;
        //console.log(databaseDiag.toString());
       // databaseDiag.testAlert([], function(ret){console.log('BKDataBaseDiagnosis called');});
        
    }
   
}
function RegisterMobile(udid){
    //alert("SecureUDID=" + udid);
    console.log("=========>SecureUDID=" + udid);
    _currDevice.DEVICE_UID = udid;
    _currDevice.TAG = device.platform + device.version;
    _currDevice.DEVICE_TYPE = device.version;
    if ($.Ctx.IsDevice == true) {
        $('#index #divSignIn').addClass("ui-disabled");
        var networkState = navigator.connection.type;

        if (Connection.CELL_2G == networkState){
            TimeoutExtent = 5000;
        }
        registerDevice(function () {
            $.Ctx.ReadConfig(function (ret) {
                $.Ctx.PersistConfig(ret);
                $.Ctx.RetrieveConfig();
                $.Ctx.ReadLang($.Ctx.AppName, function() {
                    var dat = localStorage['uilang-' + $.Ctx.AppName ];
                    if ((dat != null) && (dat != undefined)) {
                        $.Util.UiLangs[$.Ctx.AppName] = $.parseJSON(dat);
                    }
                });
                $.Ctx.ReadLang('index', function () {
                    $.Util.RenderUiLang('index');
                });
                $('#index #divSignIn').removeClass("ui-disabled");
            });
        });
    }//end if
};

$('#index').bind('pagebeforeshow', function (e) {
    $('#index #user-password').val('');
    $('#index #user-name').val('');
    $.Ctx.ReadLang('index', function () {
        $.Util.RenderUiLang('index');
    });
});

$('#index').bind('pagebeforecreate', function (e) {
    //    $.ajax({
    //        type: "POST",
    //        url: $.Ctx.SvcUrl + "/testpost",       
    //        contentType: "application/json; charset=utf-8",
    //        success: function (data) {
    //            $.Ctx.MsgBox(data.d);
    //        },
    //        error: function (err) {
    //          $.Ctx.MsgBox(err);
    //        }
    //    });

    if ($.Ctx.IsDevice == false) {
            //getClientName
            $.ajax({
                type: "POST", // CHANGED
                contentType: "application/json; charset=utf-8",
                url: $.Ctx.SvcUrl + "/getClientName",
                timeout: $.Ctx.ServiceTimeout + 1500,
                success: function (data) {
                    _currDevice.DEVICE_UID = data.d;
                    $('#index #divSignIn').addClass("ui-disabled");
                    registerDevice(function () {
                        $.Ctx.ReadConfig(function (ret) {
                            $.Ctx.PersistConfig(ret);
                            $.Ctx.RetrieveConfig();
                            $.Ctx.ReadLang($.Ctx.AppName, function () {
                                var dat = localStorage['uilang-' + $.Ctx.AppName];
                                if ((dat != null) && (dat != undefined)) {
                                    $.Util.UiLangs[$.Ctx.AppName] = $.parseJSON(dat);
                                }
                            });
                            $.Ctx.ReadLang('index', function () {
                                $.Util.RenderUiLang('index');
                            });

                            $('#index #divSignIn').removeClass("ui-disabled");
                        });
                    });
                    /*installTable(function () {
                        $.Ctx.ReadLang($.Ctx.AppName);
                        $.Ctx.ReadLang('index');
                        $.Util.RenderUiLang('index');
                    });*/
                }
            });




       
    }

});


$('#index').bind('pageinit', function (e) {
    // $.Ctx.MsgBox('mobileinit');
    //  $.mobile.metaViewportContent = "width=device-width, minimum-scale=10, maximum-scale=20";
    $('#index #login-form').submit(function (e) {
        e.preventDefault();
        return false;
    });

    $('#index #btnSignin').click(function (e) {
        $('#index #divSignIn').addClass("ui-disabled");
        e.preventDefault();
        $.ajax({
            url: $.Ctx.SvcUrl,
            dataType: 'html',
            cache: false,
            timeout: $.Ctx.ServiceTimeout + TimeoutExtent,
            success: onlineAuthen,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $('#index #divSignIn').removeClass('ui-disabled');
                $.Ctx.MsgBox($.Ctx.Lcl('index', 'msgCannotreachServ', 'Server cannot be reach,application will work offline.'));
                OfflineAuthen();
            }
        });
        return false;
    });
});

function earlyDownload(success) {
    $.mobile.loading('show', { text: "Configuring..", textVisible: true });
    var jdata = {};
    jdata.programId = $.Ctx.ProgramId;
    jdata.bu = $.Ctx.Bu;
    $.ajax({
        type: "POST",
        url: $.Ctx.SvcUrl + "/EarlyDownload",
        data: JSON.stringify(jdata),
        timeout: 50000,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var nSuccess = success;
            var res = data.d;
            var inits = res.Init;
            var cmds = new Array();
            for (var i = 0; i < inits.length; i++) {
                var x = inits[i];
                var m = new HH_INIT();
                m.retrieveJson(x);
                cmds.push(m.deleteCommand($.Ctx.DbConn));
                cmds.push(m.insertCommand($.Ctx.DbConn));
            }
            var ll = res.LoginLang;
            for (var i = 0; i < ll.length; i++) {
                var x = ll[i];
                var m = new HH_UI_LANG();
                m.retrieveJson(x);
                cmds.push(m.deleteCommand($.Ctx.DbConn));
                cmds.push(m.insertCommand($.Ctx.DbConn));
            }
//            var UserCom = res.UserCompany ;
//            for (var i = 0; i < UserCom.length; i++) {
//                var x = UserCom[i];
//                var m = new HH_COMPANY_BU();
//                m.retrieveJson(x);
//                cmds.push(m.deleteCommand($.Ctx.DbConn));
//                cmds.push(m.insertCommand($.Ctx.DbConn));
//            }
//            var UserOper = res.UserOperation;
//            for (var i = 0; i < UserOper.length; i++) {
//                var x = UserOper[i];
//                var m = new HH_USER_OPERATION_BU();
//                m.retrieveJson(x);
//                cmds.push(m.deleteCommand($.Ctx.DbConn));
//                cmds.push(m.insertCommand($.Ctx.DbConn));
//            }
            var trn = new DbTran($.Ctx.DbConn);
            trn.executeNonQuery(cmds, function () {
                $('#index #divSignIn').removeClass('ui-disabled');
                $.mobile.loading('hide');
                nSuccess();
            });
        },
        error: function (err) {
            $('#index #divSignIn').removeClass('ui-disabled');
            $.mobile.loading('hide');
        }
    });
}

function registerDevice(success) {
    // $.Ctx.DbConn = new DbConnector("HH_SF", 1, this.AppName, 5 * 1024 * 1024);
    var sCmd = $.Ctx.DbConn.createSelectCommand();
    sCmd.sqlText = "SELECT * FROM HH_DEVICES";
    sCmd.executeReader(function (tx, res) {
            if (res.rows.length != 0) {
                console.log("already registered device");
                var m = new HH_DEVICES();
                m.retrieveRdr(res.rows.item(0));
                _currDevice = m;
//                $('#index #user-password').val(_currDevice.DEFAULT_LANG);
                $('#index #user-name').val(_currDevice.CURRENT_USER);
                $.Ctx.DeviceId = m.DEVICE_ID;
                $.Ctx.firstTimeDevice = false;
            }
            success();
        } ,
        function (err) {
            var nSuccess = success;
            console.log("un-registered device");
            $.Ctx.firstTimeDevice = true;
            //Register device;
            var jdata = {};
            jdata.user = $.Ctx.UserId;
            jdata.uid = _currDevice.DEVICE_UID;
            jdata.tag = _currDevice.TAG;
            jdata.type = _currDevice.DEVICE_TYPE;
            $.mobile.loading('show', { text: "Initializing..", textVisible: true });
            $.ajax({
                type: "POST",
                url: $.Ctx.SvcUrl + "/RegisterDevice",
                data: JSON.stringify(jdata),
                contentType: "application/json; charset=utf-8",
                timeout: $.Ctx.ServiceTimeout + TimeoutExtent,
                success: function (data) {
                    var m = new HH_DEVICES();
                    m.retrieveJson(data);
                    _currDevice = m;
                    $.Sync.InstallTable(function () {
                            var cmds = new Array();
                            var cCmd = _currDevice.createTableCommand($.Ctx.DbConn);
                            cmds.push(cCmd);
                            var iCmd = _currDevice.insertCommand($.Ctx.DbConn);
                            cmds.push(iCmd);
                            var ini = new HH_INIT();
                            ini.PROGRAM_ID = $.Ctx.ProgramId;
                            ini.KEY = "RootUrl"
                            ini.INPUT_TYPES = "Text";
                            ini.VALUE = $.Ctx.RootUrl;
                            ini.FOR_ADMIN = "Y";
                            ini.CAN_EDIT = "Y";
                            ini.LAST_UPDATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
                            ini.FUNCTION = "A";
                            cmds.push(ini.insertCommand($.Ctx.DbConn));
                            ini.KEY = "SvcUrl";
                            ini.VALUE = $.Ctx.SvcUrl;
                            cmds.push(ini.insertCommand($.Ctx.DbConn));

                            var tran = new DbTran($.Ctx.DbConn);
                            tran.executeNonQuery(cmds, function () {
                                $.Ctx.DeviceId = m.DEVICE_ID;
                                $.mobile.loading('hide');
                                earlyDownload(nSuccess);
                            }, function (err) {
                                $('#index #divSignIn').removeClass('ui-disabled');
                                $.mobile.loading('hide');
                                $.Ctx.MsgBox($.Ctx.Lcl('index', 'msgUnhandleExp', 'Unhandle exception: {0}'.format([err.toString()])));
                            });
                        },
                        function (err) {
                            $('#index #divSignIn').removeClass('ui-disabled');
                            $.mobile.loading('hide');
                            $.Ctx.MsgBox($.Ctx.Lcl('index', 'msgUnhandleExp', 'Unhandle exception: {0}'.format([err.toString()])));
                        });
                },
                error: function (err) {
                    $('#index #divSignIn').removeClass('ui-disabled');
                    $.mobile.loading('hide');
                    if (confirm($.Ctx.Lcl('index', 'msgCannotRegDevice', 'Cannot register device.\n Do you want to manually register device with another server?.'))) {
                        var serverUrl = prompt("Specify your server : ", "Server URL");

                        $.Ctx.RootUrl = serverUrl + "/";
                        $.Ctx.SvcUrl = serverUrl + "/SsIFarmDeviceService.svc";

                        registerDevice(success);
                    };
                }
            });
        });

}

function CheckUserOrgOper(sucess,fail){
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT * FROM HH_USER_OPERATION_BU O WHERE O.BUSINESS_UNIT = '{0}' AND O.USER_ID = '{1}' AND O.START_DATE <= DATE('NOW') AND O.END_DATE >= DATE('NOW')".format([$.Ctx.Bu, $.Ctx.UserId]);
    cmd.executeReader(function (tx, res) {
        if (res.rows.length == 0) {
            $.Ctx.MsgBox("User operation code is not found.");
            fail();
        } else if (res.rows.length == 1) {
            var m = new HH_USER_OPERATION_BU();
            m.retrieveRdr(res.rows.item(0));
            $.Ctx.SetOrganization(m.COMPANY_CODE, m.OPERATION_CODE, m.SUB_OPERATION, m.WAREHOUSE , function (found) {
                if (found){
                    sucess();
                }else{
                    //HH_USER_OPERATION_BU not found
                    $.Ctx.MsgBox("User operation code is not found.");
                    fail();
                }
            });
        } else {
            $('#index #divSignIn').removeClass('ui-disabled');
            $.Ctx.SetPageParam('choose_org', 'Previous', 'index');
            $.Ctx.NavigatePage('choose_org', null, { transition: 'slide' });
            fail();
        }
    }, function (err) {
        $.Ctx.MsgBox(err.message);
        fail();
    });
}

function onlineAuthen(data) {
    console.log("onlineAuthen");

    var jdata = {};
    jdata.bu = $.Ctx.Bu;
    jdata.userName = $('#user-name').val();
    jdata.password = $.sha256($('#user-password').val());
    jdata.programId = $.Ctx.ProgramId;
    $.ajax({
        type: "POST",
        cache: false,
        url: $.Ctx.SvcUrl + "/Authenticate",
        data: JSON.stringify(jdata),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var u = data.d;
            if (u != undefined && u != null) {
                //Authenticated,update HH_USER_BU
                var m = new HH_USER_BU();
                m.retrieveJson(u.UserBu);
                $.Ctx.UserId = m.USER_ID;
                $.Ctx.UserPassword = m.USER_PASSWORD;
                $.Ctx.UserFullName = m.FIRST_NAME + ' ' + m.LAST_NAME;
                $.Ctx.UserType = m.USER_TYPE;
                $.Ctx.SalesMan = m.USER_ID;
                if (_currDevice.CURRENT_USER != $.Ctx.UserId) {
                    $.Ctx.firstTimeDevice = true;
                }


                var cmds = new Array();
                cmds.push(m.deleteCommand($.Ctx.DbConn));
                cmds.push(m.insertCommand($.Ctx.DbConn));


                var inits = u.Init;
                for (var i = 0; i < inits.length; i++) {
                    var x = inits[i];
                    var m = new HH_INIT();
                    m.retrieveJson(x);
                    cmds.push(m.deleteCommand($.Ctx.DbConn));
                    cmds.push(m.insertCommand($.Ctx.DbConn));
                }


                var UserCom = u.UserCompany ;
                for (var i = 0; i < UserCom.length; i++) {
                    var x = UserCom[i];
                    var m = new HH_COMPANY_BU();
                    m.retrieveJson(x);
                    cmds.push(m.deleteCommand($.Ctx.DbConn));
                    cmds.push(m.insertCommand($.Ctx.DbConn));
                }
                var UserOper = u.UserOperation;
                for (var i = 0; i < UserOper.length; i++) {
                    var x = UserOper[i];
                    var m = new HH_USER_OPERATION_BU();
                    m.retrieveJson(x);
                    cmds.push(m.deleteCommand($.Ctx.DbConn));
                    cmds.push(m.insertCommand($.Ctx.DbConn));
                }





                var tran = new DbTran($.Ctx.DbConn);
                tran.executeNonQuery(cmds, function (tx, res) {

                        $.Ctx.ReadConfig(function (ret) {
                            $.Ctx.PersistConfig(ret);
                            $.Ctx.RetrieveConfig();
                            $.Ctx.ReadPreference(function (ret) {
                                $.Ctx.PersistPreference(ret);
                                $.Ctx.RetrievePreference();
                            }, $.Ctx.UserId);
                        });
                        if ($.Ctx.firstTimeDevice) {
                            $.mobile.loading('show', { text: "Checking for updates..", textVisible: true });

                            $.Sync.CheckDownloadable (function(data){

                                if (data[0] == "Y" ){
                                    CheckUserOrgOper( function (){
                                        $.mobile.loading('show', { text: "Downloading..", textVisible: true });
                                        $.Sync.DownloadAll(function () {
                                            $.Ctx.firstTimeDevice = false;
                                            _currDevice.CURRENT_USER = $.Ctx.UserId;
                                            _currDevice.DEFAULT_LANG = $.Ctx.UserPassword;
                                            var uCmd = _currDevice.updateCommand($.Ctx.DbConn);
                                            uCmd.executeNonQuery();
                                            $('#index #divSignIn').removeClass('ui-disabled');
                                            $.mobile.loading('hide');
                                            NavigateNextPage();
                                        }, function (err) {
                                            //retry1
                                            $.mobile.loading('show', { text: "Re-Checking..", textVisible: true });
                                            $.Sync.DownloadAll(function () {
                                                $.Ctx.firstTimeDevice = false;
                                                _currDevice.CURRENT_USER = $.Ctx.UserId;
                                                _currDevice.DEFAULT_LANG = $.Ctx.UserPassword;
                                                var uCmd = _currDevice.updateCommand($.Ctx.DbConn);
                                                uCmd.executeNonQuery();
                                                $('#index #divSignIn').removeClass('ui-disabled');
                                                $.mobile.loading('hide');
                                                NavigateNextPage();
                                            }, function (err) {
                                                $('#index #divSignIn').removeClass('ui-disabled');
                                                $.mobile.loading('hide');
                                                $.Ctx.MsgBox($.Ctx.Lcl('index', 'msgDlNotComplete', 'Download not complete.Please try again./n Error detail {0}'.format([JSON.stringify(err)])));
                                                NavigateNextPage();
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
                                    }, function(){});
                                }
                            } , function (err) {
                                $('#index #divSignIn').removeClass('ui-disabled');
                                $.mobile.loading('hide');
                                $.Ctx.MsgBox($.Ctx.Lcl('index', 'msgCannotDownloadNow', 'You cannot download for now.Please try again later.'));
                            });

                        } else {
                            console.log("Alter Table");
                            databaseAlterObj.CheckingVersion(function(ret){
                                if(ret == true){
                                    databaseAlterObj.CreateBOStructure(function(){
                                        databaseAlterObj.ProcessStartCheckDatabase(function(){
                                                NavigateNextPage();
                                            },function(err){

                                            },function (i, t) {
                                                if ($.Ctx.UserType == 'Admin') {
                                                    $.mobile.loading('show', { text: "Checking Structure {0}/{1}".format([i, t]), textVisible: true });
                                                } else {
                                                    var cur = 100;
                                                    if (t != 0) {
                                                        cur = Math.ceil((i * 100) / t);
                                                    }
                                                    $.mobile.loading('show', { text: "Checking Structure {0}%".format([cur]), textVisible: true });
                                                }
                                            }
                                        );
                                    }, function(err){

                                    });
                                }else{
                                    NavigateNextPage();
                                }
                            },function(err){

                            })
//TODO XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                        }
                    },
                    function (err) {
                        $('#index #divSignIn').removeClass('ui-disabled');
                        $.Ctx.MsgBox($.Ctx.Lcl('index', 'msgUnhandleExp', 'Unhandle exception: {0}'.format([err.toString()])));
                    });
            } else {
                //Un-authenticated
                $('#index #divSignIn').removeClass('ui-disabled');
                $.Ctx.MsgBox($.Ctx.Lcl('index', 'msgUserPassIncorrect', 'User name or password incorrect'));
                $('#user-password').val('');
            }
        },
        error: function (err) {
            $('#index #divSignIn').removeClass('ui-disabled');
            $.Ctx.MsgBox($.Ctx.Lcl('index', 'msgCannotreachServ', 'Server cannot be reach,application will work offline.'));
            OfflineAuthen();
        }
    });
}

var databaseAlterObj = new databaseAlter;

function databaseAlter() {

}
databaseAlter.prototype.CheckingVersion= function (sucess,fail ){
    var ClientVersionBase = null;
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT VAL FROM HH_USER_PREFERENCE_BU WHERE BUSINESS_UNIT ==? AND USER_ID ==? AND PROGRAM_ID ==? AND KEY ==? ";
    cmd.parameters.push($.Ctx.Bu);
    cmd.parameters.push($.Ctx.DeviceId.toString());
    cmd.parameters.push($.Ctx.ProgramId);
    cmd.parameters.push("Version");
    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            ClientVersionBase = res.rows.item(0).VAL;
            console.log("ClientVersion :" + $.Ctx.ClientVersion);
            console.log("ClientVersionBase :" + ClientVersionBase);
            console.log("AppVersion :" + $.Ctx.AppVersion);
            if ($.Ctx.ClientVersion == $.Ctx.AppVersion){
                if (ClientVersionBase != $.Ctx.AppVersion){
                    sucess(true);
                }else{
                    sucess(false);
                }
            }else{
                console.log("Out of date Your Version :" + $.Ctx.ClientVersion  + " ||| Current Version :" + $.Ctx.AppVersion);
                sucess(false);
            }
        }else{
            sucess(false);
        }
    } , function (err) {
        sucess(true);
        console.log("Cannot checking client version :" + err);
    });
}

databaseAlter.prototype.InsertBOStructureData =  function (cmds,sucess,fail ){
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT * FROM SQLITE_MASTER  WHERE TYPE='table' AND NAME <> '__WebKitDatabaseInfoTable__' ";
    cmd.executeReader(function (tx, res) {
        for (var i=0; i< res.rows.length; i++ ){
            var bo = new HH_BO_STRUCTURE;
            bo.BUSINESS_UNIT = $.Ctx.Bu;
            bo.PROGRAM_ID = $.Ctx.ProgramId;
            bo.DEVICE_ID = $.Ctx.DeviceId;
            bo.BO_TYPE = res.rows.item(i).tbl_name;
            bo.BO_OBJECT = res.rows.item(i).sql;
            bo.AP_VERSION = $.Ctx.AppVersion;
            bo.LAST_UPDATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
            bo.CREATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
            bo.OWNER = $.Ctx.UserId;
            bo.FUNCTION = "A";
            bo.NUMBER_OF_SENDING_DATA = 0;
            cmds.push(bo.deleteCommand($.Ctx.DbConn));
            cmds.push(bo.insertCommand($.Ctx.DbConn));
            if (i== res.rows.length -1){
                sucess();
            }
        }
    } , function (err) {
        fail();
        $.Ctx.MsgBox("Cannot execute command Select tables:" + err)
    });
}



databaseAlter.prototype.CreateBOStructure= function (sucess,fail ){
    var cmds = new Array();
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT COUNT(*) as COUNT FROM SQLITE_MASTER  WHERE TYPE='table' AND NAME = 'HH_BO_STRUCTURE' ";
    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            if (res.rows.item(0).COUNT == 0) {
                var bo = new HH_BO_STRUCTURE;
                cmds.push(bo.createTableCommand($.Ctx.DbConn));
            };

            databaseAlterObj.InsertBOStructureData(cmds,function(){
                var dbTrn = new  DbTran($.Ctx.DbConn);
                dbTrn.executeNonQuery(cmds, function () {
                    if ((sucess != undefined) && (typeof (sucess) == "function")) {
                        sucess();
                    }
                }, function (err) {
                    fail();
                    $.Ctx.MsgBox("Cannot execute command Alter table:" + err)
                });

            }, fail)
        }
    } , function (err) {
        fail();
        $.Ctx.MsgBox("Cannot execute command Create table:" + err)
    });
}



databaseAlter.prototype.GetTableDownloadable = function (success,fail){
    var jData = {};
    jData.header = $.Ctx.GetDefaultHeader();
    console.log(jData.header);
    $.ajax({
        type: "POST",
        url: $.Ctx.SvcUrl + "/GetDownloadTable",
        data: JSON.stringify(jData),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var items = $.parseJSON(data.d);
            success(items);
        },
        fail: function(error){
            fail(error);
        }
    });
}

databaseAlter.prototype.ProcessStartCheckDatabase = function(sucess,fail,progess){
    databaseAlterObj.CheckDatabaseChange(function(cmds){
        var dbTrn = new DbTran($.Ctx.DbConn);
        dbTrn.executeNonQuery(cmds, function () {
            if ((sucess != undefined) && (typeof (sucess) == "function")) {
                sucess();
            }
        }, function (err) { $.Ctx.MsgBox("Cannot execute command Alter table:" + err) });
    },fail,progess, function (errorTableLog){
        console.log(errorTableLog);
    });
}

databaseAlter.prototype.CheckDatabaseChange = function (sucess,fail,progess,tableFail){
    var cmds = new Array();
    //Notice that Sqlite support >>It is not possible to rename a column, remove a column, or add or remove constraints from a table
    var tablesList = new Array();
    databaseAlterObj.GetTableDownloadable(function(item){
        tablesList =item;
        var count = 0;
        for (var i = 0; i < tablesList.length ; i++) {
            var cmd = $.Ctx.DbConn.createSelectCommand();
            cmd.sqlText = "SELECT * FROM    (SELECT DISTINCT ? AS TABLE_BO FROM HH_BO_STRUCTURE WHERE BUSINESS_UNIT = ? AND PROGRAM_ID = ? AND DEVICE_ID = ?) A LEFT OUTER JOIN (SELECT * FROM HH_BO_STRUCTURE WHERE     BUSINESS_UNIT = ? AND PROGRAM_ID = ? AND DEVICE_ID = ? AND BO_TYPE = ?) B";
            cmd.parameters.push(tablesList[i]);
            cmd.parameters.push($.Ctx.Bu);
            cmd.parameters.push($.Ctx.ProgramId);
            cmd.parameters.push($.Ctx.DeviceId);
            cmd.parameters.push($.Ctx.Bu);
            cmd.parameters.push($.Ctx.ProgramId);
            cmd.parameters.push($.Ctx.DeviceId);
            cmd.parameters.push(tablesList[i]);
            cmd.executeReader(function (tx, res) {
                count = count+1;
                progess(count,tablesList.length);
                var bo;
                try
                {
                    eval("bo = new {0}();".format([res.rows.item(0).TABLE_BO]));
                    if (res.rows.length != 0 && res.rows.item(0).BO_OBJECT != null) {
                        // Compare and alter table na
                        var SqlCreate = res.rows.item(0).BO_OBJECT;
                        var colObjArray = SqlCreate.substring(SqlCreate.indexOf('(')+1,SqlCreate.lastIndexOf(',primary key')).split(',');
                        var primaryKey = SqlCreate.substring(SqlCreate.indexOf(',primary key')+1,SqlCreate.lastIndexOf(')'));
                        var primaryKeyArray =  primaryKey.substring(primaryKey.indexOf('(')+1,primaryKey.lastIndexOf(')')).split(',');

                        var OldTableList = new Array();
                        for (var i=0;i < colObjArray.length; i++ ){
                            var tempTable = {};
                            tempTable.key = colObjArray[i].trim().split(' ')[0];
                            tempTable.val = colObjArray[i].trim().split(' ')[1];
//                        for(var ii=0; ii<primaryKeyArray. )
                            if (_.contains(primaryKeyArray,tempTable.key)){
                                tempTable.remark = "Pk";
                            }
                            OldTableList.push(tempTable);
                        }

                        //pk checking
                        var pkNew = _.where(bo.getFields(),{remark:"Pk"});
                        var pkOld = _.where(OldTableList,{remark:"Pk"});
                        var isValidPk = true;
                        if(pkNew.length == pkOld.length ){
                            for (var i=0; i< pkNew.length; i++){
                                if (IsObjNullOrEmpty(_.findWhere(pkOld,{key:pkNew[i].key , val:pkNew[i].val}))){
                                    //pk NewBO is not match with old BO
                                    if ((tableFail != undefined) && (typeof (tableFail) == "function")) {
                                        tableFail( "[" + res.rows.item(0).BO_TYPE + "] pk NewBO is not match with old BO");
                                    }
                                    isValidPk = false;
                                    break;
                                }
                            }
                        }else{
                            //pk NewBO is not match with old BO
                            if ((tableFail != undefined) && (typeof (tableFail) == "function")) {
                                tableFail( "[" + res.rows.item(0).BO_TYPE + "] pk NewBO is not match with old BO");
                            }
                            isValidPk = false;
                        }

                        if (isValidPk == true){
                            if (bo.getFields().length == OldTableList.length){
                                for (var i=0; i< OldTableList.length; i++){
                                    if (IsObjNullOrEmpty(_.findWhere(bo.getFields(),{key:OldTableList[i].key , val:OldTableList[i].val}))){
                                        //NewBO is not match with old BO
                                        if ((tableFail != undefined) && (typeof (tableFail) == "function")) {
                                            tableFail( "[" + res.rows.item(0).BO_TYPE + "]" + "[" + OldTableList[i].key +" " + OldTableList[i].val +"]  is not match with oldBO");
                                        }
                                    }
                                }
                            }else if (bo.getFields().length > OldTableList.length){
                                var isValid = true;
                                for (var i=0; i< OldTableList.length; i++){
                                    if (IsObjNullOrEmpty(_.findWhere(bo.getFields(),{key:OldTableList[i].key , val:OldTableList[i].val}))){
                                        //NewBO is not match with old BO
                                        isValid = false;
                                        if ((tableFail != undefined) && (typeof (tableFail) == "function")) {
                                            tableFail( "[" + res.rows.item(0).BO_TYPE + "]" + "[" + OldTableList[i].key +" " + OldTableList[i].val +"]  is not match with oldBO");
                                        }
                                    }
                                }
                                if (isValid == true){
                                    for (var i=0; i< bo.getFields().length; i++){
                                        if (IsObjNullOrEmpty(_.findWhere(OldTableList,{key:bo.getFields()[i].key , val:bo.getFields()[i].val}))){

                                            var cmdAlter = new DbCommand(bo);
                                            cmdAlter.Conn = $.Ctx.DbConn;
                                            cmdAlter.sqlText = "ALTER TABLE " + res.rows.item(0).BO_TYPE + "  ADD COLUMN " + bo.getFields()[i].key + " " + bo.getFields()[i].val;
                                            cmds.push(cmdAlter);
                                        }
                                    }
                                }
                            }else{
                                // remove some column in new table Invalid
                                if ((tableFail != undefined) && (typeof (tableFail) == "function")) {
                                    tableFail( "[" + res.rows.item(0).BO_TYPE + "] is not match with oldBO");
                                }
                            }
                        }
                    }else{
                        // Create table na
                        var cmdCreate = bo.createTableCommand($.Ctx.DbConn);
                        cmds.push(cmdCreate);
                    }
                    if (count== tablesList.length ){
                        sucess(cmds);
                    }
                }
                catch(err)
                {
                    console.log("BO not found" + res.rows.item(0).TABLE_BO);
                    $.Ctx.MsgBox(err.message);
                    fail();
                }

            }, function (err) {
                $.Ctx.MsgBox(err.message);
                fail();
            });
        };
    },fail)
}




function OfflineAuthen() {
    var userid = $('#index #user-name').val().toUpperCase();
    var userpwd = $.sha256($('#index #user-password').val());  //$('#index #user-password').val();
    if (userid != '' && userpwd != '') {

        var userBo = new HH_USER_BU();
        var cmd = $.Ctx.DbConn.createSelectCommand();
        var sqlQuery = "select * from {0} where USER_ID = '{1}' COLLATE NOCASE ";

        cmd.sqlText = sqlQuery.format(["HH_USER_BU", userid]);
        cmd.executeReader(function (t, res) {

            if (res.rows.length != 0) {
                var found = false;
                for (var idxRow = 0; idxRow < res.rows.length; idxRow++) {
                    if (res.rows.item(idxRow).USER_PASSWORD == userpwd) {
                        var m = new HH_USER_BU();
                        m.retrieveRdr(res.rows.item(idxRow));
                        $.Ctx.UserId = m.USER_ID;
                        $.Ctx.UserPassword =   m.USER_PASSWORD ;
                        $.Ctx.UserFullName = m.FIRST_NAME + ' ' + m.LAST_NAME;
                        $.Ctx.UserType = m.USER_TYPE;
                        $.Ctx.SalesMan = m.USER_ID;

                        $.Ctx.ReadConfig(function (ret) {
                            $.Ctx.PersistConfig(ret);
                            $.Ctx.RetrieveConfig();
                            $.Ctx.ReadPreference(function (ret) {
                                $.Ctx.PersistPreference(ret);
                                $.Ctx.RetrievePreference();
                            }, $.Ctx.UserId);
                        });

                        found = true;
                        break;
                    } //End If
                } //End For
                if (found) {
                    $('#index #user-name').val('');
                    $('#index #user-password').val('');
                    NavigateNextPage();

                }
                else {
                    $.Ctx.MsgBox($.Ctx.Lcl('index', 'msgUserPassIncorrect', "User name or password incorrect"));

                    $('#index #user-password').val('');
                }

            } // End If rowLength
            else {
                $.Ctx.MsgBox($.Ctx.Lcl('index', 'msgUserNotFound', "User not found"));

                $('#index #user-password').val('');
            }
        });
    }
}

function NavigateNextPage() {
    $('#index #divSignIn').removeClass('ui-disabled');
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT * FROM HH_USER_OPERATION_BU O  WHERE O.BUSINESS_UNIT = '{0}' AND O.USER_ID = '{1}' AND O.START_DATE <= DATE('NOW') AND O.END_DATE >= DATE('NOW')".format([$.Ctx.Bu, $.Ctx.UserId]);
    cmd.executeReader(function (tx, res) {
        if (res.rows.length == 0) {
            $.Ctx.SetPageParam('home', 'Previous', 'index');
            $.Ctx.NavigatePage('home', null, { transition: 'slide' });

        } else if (res.rows.length == 1) {
            var m = new HH_USER_OPERATION_BU();
            m.retrieveRdr(res.rows.item(0));
            $.Ctx.SetOrganization(m.COMPANY_CODE, m.OPERATION_CODE, m.SUB_OPERATION,m.WAREHOUSE, function (found) {
                $.Ctx.SetPageParam('home', 'Previous', 'index');
                $.Ctx.NavigatePage('home', null, { transition: 'slide' });
            });
        } else {
            $.Ctx.SetPageParam('choose_org', 'Previous', 'index');
            $.Ctx.NavigatePage('choose_org', null, { transition: 'slide' });
        }

    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });

}


