
$('#sqlresult').bind('pageinit', function (e) {

    $('#sqlresult a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('sqlresult', 'Previous'), null, { transition: 'slide', reverse: 'true' });
    });

    SetResult();

});


function SetResult() {
    var tableName = $.Ctx.GetPageParam('sqlresult', 'TableName');
    var sql = $.Ctx.GetPageParam('sqlresult', 'SqlText');
    if (sql == null) {
        tableName = 'HH_CLIENT_RECEIVED_BU';
        sql = 'SELECT * FROM HH_CLIENT_RECEIVED_BU';
    }
    $('#sqlresult #txtQuery2').val(sql);

    var s = "";
    var field = "";
    if(sql.indexOf("*") != 7){

        var indSelect = sql.indexOf("SELECT")
        var indFrom = sql.indexOf("FROM")
        s = sql.substring(indSelect , indFrom);
        s = s.replace("SELECT " ,"");
        field = s.split(",");
    }

    CreateColumns(tableName,field);
    CreateRows(tableName, sql,field);
}

function CreateColumns(tableName, field) {
    var m = eval('new ' + tableName + '()');
    var s="";
    var allFields = m.getFields();
    var $grdResult = $('#sqlresult #grdResult');
    s = '<tr>';
    if(field == ""){
        for (var i = 0; i < allFields.length; i++) {
            s += '<td style="border-style: solid; border-width: 1px; font-weight: normal;">' + allFields[i].key + '</td>';        }
    }else{
            for(var j = 0 ; j <field.length ; j++){
                    s += '<td style="border-style: solid; border-width: 1px; font-weight: normal;">' + field[j] + '</td>';
            }
    }
    s += '</tr>';
    $grdResult.append(s);
}

function CreateRows(tableName, sql,field) {
    var m = eval('new ' + tableName + '()');
    var allFields = m.getFields();
    var $grdResult = $('#sqlresult #grdResult');
    var cm = $.Ctx.DbConn.createSelectCommand();
    cm.sqlText = sql;
    cm.executeReader(function (t, res) {
        var s = '';

        if(field == ""){
            for (var i = 0; i < res.rows.length; i++) {
                s += '<tr>';
                for (var j = 0; j < allFields.length; j++) {
                    s += '<td style="border-style: solid; border-width: 1px; font-weight: normal;">' + eval('res.rows.item(' + i + ').' + allFields[j].key) + '</td>';
                }
                s += '</tr>';
            }
        }else{
            for (var i = 0; i < res.rows.length; i++) {
                s += '<tr>';
                for (var j = 0; j < field.length; j++) {
                    s += '<td style="border-style: solid; border-width: 1px; font-weight: normal;">' + eval('res.rows.item(' + i + ').' + field[j]) + '</td>';
                }
                s += '</tr>';
            }
        }



        $grdResult.append(s);
    });
}
     