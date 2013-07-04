

//Wait for PhoneGap to load

document.addEventListener("deviceready", onDeviceReady, false);
//PhoneGap is ready

aContent.prototype.CreateDatabase = function () {
    var bo = new DIRECTORY_MANAGER();
    var cmds = new Array();
    var cCmd = bo.createTableCommand($.Ctx.DbConn);
    cmds.push(cCmd);
    var trn = new DbTran($.Ctx.DbConn);
    trn.executeNonQuery(cmds);
};
//aContent.prototype.CreateDatabase = function () {
//var bo = new DIRECTORY_MANAGER();
//var cmds = new Array();
//var cCmd = bo.createTableCommand($.Ctx.DbConn);
//cmds.push(cCmd);
//var trn = new DbTran($.Ctx.DbConn);
//trn.executeNonQuery(cmds);
//}
aContent.prototype.UpdateFileToBase = function () {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
};

function fail(error) {
    console.log("error : " + error.code);
    alert("error : " + error.code);
};

function gotFS(fileSystem) {
    window.FS = fileSystem;

    var printDirPath = function(entry){
        console.log("Dir path - " + entry.fullPath);
    };
    createDirectory("Library/ContentDownload/a/a/a/", printDirPath);
//	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);

};
function createDirectory(path, success){
    var dirs = path.split("/").reverse();
    var root = window.FS.root;

    var createDir = function(dir){
        console.log("create dir " + dir);
        root.getDirectory(dir, { create : true, exclusive : false }, successCB, failCB);
    };

    var successCB = function(entry){
        console.log("dir created " + entry.fullPath);
        root = entry;
        if(dirs.length > 0){
            createDir(dirs.pop());
        }else{
            console.log("all dir created");
            success(entry);
        }
    };

    var failCB = function(){
        console.log("failed to create dir " + dir);
    };

    createDir(dirs.pop());
};

aContent.prototype.CheckUpdateFile = function () {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        console.log("Root = " + fs.root.fullPath);
        var directoryReader = fs.root.createReader();
        directoryReader.readEntries(function(entries) {
            var i;
            for (i=0; i<entries.length; i++) {
                console.log(entries[i].name);
            }
        }, function (error) {
            alert(error.code);
        });
    }, function (error) {
        alert(error.code);
    });
};

$.aContent = new aContent();
function aContent() {

};
aContent.prototype.DownloadDirectory = function (success, fail) {
    var jData = {};
    $.ajax({
        type:"POST",
        url:$.Ctx.SvcUrl + "/GetDirectoryServer",
        data:JSON.stringify(jData),
        contentType:"application/json; charset=utf-8",
        success:function (data) {
            var items = $.parseJSON(data);
            success(items);
        },
        error:  function onError(data, status) {
            fail(status);
        }
    });
};


$('#DownloadContent').bind('pageinit', function (e) {
    $.aContent.CreateFileTable($.aContent.SearchFileChange(function(list){
        var data = list;
    }, function(err){
        console.log(err);
    } ),function(err){
        console.log(err);
    });
});


function onDeviceReady() {
    console.log("load");
//    $.aContent.CreateDatabase();
    $.aContent.UpdateFileToBase();
//	$.aContent.DownloadDirectory(function(result) {

//	} , function (data,status) { alert(data); alert(status);} )

//	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
};


aContent.prototype.SearchFileChange= function (sucess,fail){
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT * FROM DIRECTORY_MANAGER ";
    cmd.executeReader(function (tx, res) {
        var DirList = new Array();
        for (var i=0; i< res.rows.length; i++){
            var m = new DIRECTORY_MANAGER();
            m.retrieveRdr(res.rows.item(i));
            DirList.push(m);
        };
        $.aContent.DownloadDirectory(sucess,fail);
    } , function (err) {
        fail(err);
        $.Ctx.MsgBox("Cannot execute command Create table:" + err)
    });
}

aContent.prototype.CreateFileTable= function (sucess,fail ){
    var cmds = new Array();
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT COUNT(*) as COUNT FROM SQLITE_MASTER  WHERE TYPE='table' AND NAME = 'DIRECTORY_MANAGER' ";
    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            if (res.rows.item(0).COUNT == 0) {
                var bo = new DIRECTORY_MANAGER;
                cmds.push(bo.createTableCommand($.Ctx.DbConn));
                var dbTrn = new DbTran($.Ctx.DbConn);
                dbTrn.executeNonQuery(cmds, function () {
                    if ((sucess != undefined) && (typeof (sucess) == "function")) {
                        sucess();
                    }
                }, function (err) {
                    fail(err);
                });
            };

        }
    } , function (err) {
        fail(err);
        $.Ctx.MsgBox("Cannot execute command Create table:" + err)
    });
}

DIRECTORY_MANAGER.prototype = new BaseBo();
function DIRECTORY_MANAGER(){
    this.FileName = null ;
    this.FileType = null ;
    this.FilePath = null ;
    this.CreateDate = null ;
    this.ModifyDate = null ;
    this.FileStatus = null ;
    this.DirectoryPath = null ;

};

DIRECTORY_MANAGER.prototype.getTableName = function () {
    return "DIRECTORY_MANAGER";
};

DIRECTORY_MANAGER.prototype.getFields = function(){
    var ret = new Array;
    ret.push({key:'FileName',remark:'Pk',val:'text'});

    ret.push({key:'FilePath',remark:'Pk',val:'text'});

    ret.push({key:'CreateDate',val:'date'});

    ret.push({key:'ModifyDate',val:'date'});

    ret.push({key:'FileStatus',val:'text'});

    ret.push({key:'FileType',val:'text'});

    ret.push({key:'DirectoryPath',val:'text'});

    return ret;
};