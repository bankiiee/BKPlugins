var clickAlias = "click";
var tableInput = new HH_SYNC_CONFIG_BU();
var selectFieldInput = "";
var whereFieldInput = "";
var whereOperInput = "";
var whereConstantInput = "";
var statementInput = "";
var model = new HH_SYNC_CONFIG_BU();

$('#sqlutil').bind('pagebeforecreate', function (e) {


    $('#sqlutil a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('sqlutil', 'Previous'), null, { transition: 'slide', reverse: 'true' });
    });

    $('#sqlutil #cboTable').bind(clickAlias,function(){

        var tableName = [];
        var cm = $.Ctx.DbConn.createSelectCommand();
        cm.sqlText = 'SELECT TABLE_NAME FROM HH_SYNC_CONFIG_BU WHERE IS_CREATE_TABLE="Y" ORDER BY TABLE_NAME';
        cm.executeReader(function (t, res) {
            for (var i = 0; i < res.rows.length; i++) {

                tableName.push({'CODE':res.rows.item(i).TABLE_NAME});
            }
            if (tableName!==null){
                var p = new LookupParam();
                p.title = "Table";
                p.calledPage = 'sqlutil';
                p.calledResult = 'selectedTable';
                p.codeField = 'CODE';
                p.nameField = 'NAME';
                p.showCode = true;
                p.dataSource = tableName;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            }
        });
    });

    $('#sqlutil #cboSelectField').bind(clickAlias,function(){

        var selectField = [];
        if (!IsNullOrEmpty(model.TABLE_NAME)) {
            var m = eval('new ' + model.TABLE_NAME + '()');
            for (var i = 0; i < m.getFields(0).length; i++) {
                selectField.push({'CODE':m.getFields(0)[i].key});
            }
        }
        if (selectField!==null){
            var p = new LookupParam();
            p.title = "Table";
            p.calledPage = 'sqlutil';
            p.calledResult = 'selectedField';
            p.codeField = 'CODE';
            p.nameField = 'NAME';
            p.showCode = true;
            p.dataSource = selectField;

            $.Ctx.SetPageParam('lookup', 'param', p);
            $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
        }
    });

    $('#sqlutil #btnFieldCancel').on('click', function () {
        ClearSelectCriteria();
    });

    $('#sqlutil #btnFieldOk').on('click', function () {

        if(model.SELECTED_FIELD != null){
            var $txtQuery = $('#sqlutil #txtQuery');
            var str = $txtQuery.val();
            var s = "";
            if (str.indexOf("*") == 7) {
                s = str.replace("*" , model.SELECTED_FIELD);
            }else{
                s = str.replace(" FROM" , " , " +model.SELECTED_FIELD + " FROM");
            }
            $('#sqlutil #txtQuery').val(s);
            model.STATEMENT = s;
            ClearFieldCriteria()
        }else {
            $.Ctx.MsgBox($.Ctx.Lcl('sqlutil', 'MSG01', "Criteria not complete."));
        }
    });


    $('#sqlutil #cboWhereField').bind(clickAlias,function(){

        var whereField = [];
        if (!IsNullOrEmpty(model.TABLE_NAME)) {
            var m = eval('new ' + model.TABLE_NAME + '()');
            for (var i = 0; i < m.getFields(0).length; i++) {
                whereField.push({'CODE':m.getFields(0)[i].key});
            }
        }
        if (whereField!==null){
            var p = new LookupParam();
            p.title = "Table";
            p.calledPage = 'sqlutil';
            p.calledResult = 'selectedWhereField';
            p.codeField = 'CODE';
            p.nameField = 'NAME';
            p.showCode = true;
            p.dataSource = whereField;

            $.Ctx.SetPageParam('lookup', 'param', p);
            $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
        }
    });

    $('#sqlutil #cboWhereOper').bind(clickAlias,function(){

        var whereOper = [];

        whereOper.push({'CODE':'='});
        whereOper.push({'CODE':'<>'});
        whereOper.push({'CODE':'<<'});
        whereOper.push({'CODE':'<='});
        whereOper.push({'CODE':'>'});
        whereOper.push({'CODE':'>='});
        whereOper.push({'CODE':'LIKE'});

        if (whereOper!==null){
            var p = new LookupParam();
            p.title = "Table";
            p.calledPage = 'sqlutil';
            p.calledResult = 'selectedWhereOper';
            p.codeField = 'CODE';
            p.nameField = 'NAME';
            p.showCode = true;
            p.dataSource = whereOper;

            $.Ctx.SetPageParam('lookup', 'param', p);
            $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
        }
    });

    $('#sqlutil #btnWhereCancel').on('click', function () {
        ClearWhereCriteria()
    });

    $('#sqlutil #txtWhereConstant').change(function () {
        var s = $('#sqlutil #txtWhereConstant').val();
        $.Ctx.SetPageParam('sqlutil', 'selectedWhereConstant' , s);
        model.WHERE_CONSTANT = s;
    });


    $('#sqlutil #btnWhereOk').on('click', function () {

        if(model.WHERE_FIELD != null && model.WHERE_OPER != null && typeof(model.WHERE_CONSTANT) != 'undefined' ){
            var $txtQuery = $('#sqlutil #txtQuery');
            var str = $txtQuery.val();
            var where = ' ';
            if (str.indexOf("WHERE") == -1) { where = ' WHERE ' }
            //$txtQuery.val(str + where + model.WHERE_FIELD + ' ' + model.WHERE_OPER + ' ' + model.WHERE_CONSTANT);
            var s = str + where + model.WHERE_FIELD + ' ' + model.WHERE_OPER + ' ' + model.WHERE_CONSTANT;
            $('#sqlutil #txtQuery').val(s);
            model.STATEMENT = s;
            ClearWhereCriteria()
        }else {
            $.Ctx.MsgBox($.Ctx.Lcl('sqlutil', 'MSG01', "Criteria not complete."));
        }
    });

    $('#sqlutil #btnWhereAnd').on('click', function () {
        var $txtQuery = $('#txtQuery');
        var str = $txtQuery.val();
        $txtQuery.val(str + ' AND');
        model.STATEMENT = str + ' AND';
    });

    $('#sqlutil #btnWhereOr').on('click', function () {
        var $txtQuery = $('#txtQuery');
        var str = $txtQuery.val();
        $txtQuery.val(str + ' OR');
        model.STATEMENT = str + ' OR';
    });

    $('#sqlutil #btnExecute').on('click', function () {
        var sql = $('#txtQuery').val();
        if (sql != '') {
            console.log("yyyyy");
            $.Ctx.NavigatePage('sqlresult', { Previous: 'sqlutil', TableName: model.TABLE_NAME, SqlText: sql }, { transition: 'slide' });

        }
        else {
            $.Ctx.MsgBox($.Ctx.Lcl('sqlutil', 'MSG02', "Sql statement not complete."));

        }
    });
});


$('#sqlutil').bind('pagebeforeshow', function (e) {
    persistToInput();
});

function SetTable(tableName) {
    if (tableName != '' && tableName != null) {
        $('#sqlutil #txtQuery').val('SELECT * FROM ' + tableName);
        model.STATEMENT = 'SELECT * FROM ' + tableName;
    }
    else {
        $('#sqlutil #txtQuery').val('');
        model.STATEMENT = null;
    }
}

function ClearSelectCriteria(){
    model.SELECTED_FIELD = null;
    $.Ctx.SetPageParam('sqlutil', 'selectedField' ,null);
    persistToInput();
}

function ClearWhereCriteria() {
    model.WHERE_FIELD = null;
    model.WHERE_OPER = null;
    model.WHERE_CONSTANT = null;

    $.Ctx.SetPageParam('sqlutil', 'selectedWhereField' ,null);
    $.Ctx.SetPageParam('sqlutil', 'selectedWhereOper' ,null);
    $.Ctx.SetPageParam('sqlutil', 'selectedWhereConstant' , null);
    persistToInput();
}

function ClearFieldCriteria() {
    model.SELECTED_FIELD = null;

    $.Ctx.SetPageParam('sqlutil', 'selectedField' ,null);
    persistToInput();
}



//persist model to input
function persistToInput() {
    //init lookup;
    tableInput = $.Ctx.GetPageParam('sqlutil', 'selectedTable');
    if (tableInput != null) {
        if(model.TABLE_NAME != tableInput.CODE){
            model.WHERE_FIELD = null;
            whereFieldInput = $.Ctx.SetPageParam('sqlutil', 'selectedWhereField' , null);
            SetTable(tableInput.CODE);
        }
        model.TABLE_NAME = tableInput.CODE;
    }else{
        SetTable(model.TABLE_NAME);
    }


    selectFieldInput = $.Ctx.GetPageParam('sqlutil', 'selectedField');
    if (selectFieldInput != null) {
        model.SELECTED_FIELD = selectFieldInput.CODE;
    }

    <!-- Where Statement-->
    whereFieldInput = $.Ctx.GetPageParam('sqlutil', 'selectedWhereField');
    if (whereFieldInput != null) {
        model.WHERE_FIELD = whereFieldInput.CODE;
        var type = '';
        var $txtWhereConstant = $('#sqlutil #txtWhereConstant');
        var m = eval('new ' + model.TABLE_NAME + '()');
        for (var i = 0; i < m.getFields(0).length; i++) {
            if (m.getFields(0)[i].key == model.WHERE_FIELD) {
                type = m.getFields(0)[i].val;
                break;
            }
        }
        if (type == 'date') {
            $txtWhereConstant.val('date("yyyy-mm-dd")');
        }
        else {
            $txtWhereConstant.val('');
        }
    }

    whereOperInput = $.Ctx.GetPageParam('sqlutil', 'selectedWhereOper');
    if (whereOperInput != null) {
        model.WHERE_OPER = whereOperInput.CODE;
    }

    whereConstantInput = $.Ctx.GetPageParam('sqlutil', 'selectedWhereConstant');
    if (whereConstantInput != null) {
        model.WHERE_CONSTANT = whereConstantInput;
    }

    <!--End Of Where -->

    statementInput = $.Ctx.GetPageParam('sqlutil', 'selectStatement');
    if (statementInput != null) {
        model.STATEMENT = statementInput;
    }

    if (!IsNullOrEmpty(model.TABLE_NAME)) {
        $('#sqlutil #cboTable #spanTxt').text(model.TABLE_NAME);
        $('#sqlutil #cboTable').button('refresh');
        //SetTable(model.TABLE_NAME);
    } else {
        $('#sqlutil #cboTable #spanTxt').text("Select Table");
        $('#sqlutil #cboTable').button('refresh');
        //SetTable(model.TABLE_NAME);
    }

    if (!IsNullOrEmpty(model.SELECTED_FIELD)) {
        $('#sqlutil #cboSelectField #spanTxt').text(model.SELECTED_FIELD);
        $('#sqlutil #cboSelectField').button('refresh');
        //SetTable(model.TABLE_NAME);
    } else {
        $('#sqlutil #cboSelectField #spanTxt').text("Select Field");
        $('#sqlutil #cboSelectField').button('refresh');
        //SetTable(model.TABLE_NAME);
    }

    if (!IsNullOrEmpty(model.WHERE_FIELD)) {
        $('#sqlutil #cboWhereField #spanTxt').text(model.WHERE_FIELD);
        $('#sqlutil #cboWhereField').button('refresh');
    } else {
        $('#sqlutil #cboWhereField #spanTxt').text("Select Field");
        $('#sqlutil #cboWhereField').button('refresh');
    }

    if (!IsNullOrEmpty(model.WHERE_OPER)) {
        $('#sqlutil #cboWhereOper #spanTxt').text(model.WHERE_OPER);
        $('#sqlutil #cboWhereOper').button('refresh');
    } else {
        $('#sqlutil #cboWhereOper #spanTxt').text("Select Operation");
        $('#sqlutil #cboWhereOper').button('refresh');
    }

    if (!IsNullOrEmpty(model.WHERE_CONSTANT)) {
        $('#sqlutil #txtWhereConstant').val(model.WHERE_CONSTANT);
        //$('#sqlutil #cboWhereOper').button('refresh');
    } else {
        $('#sqlutil #txtWhereConstant').val('');
        //$('#sqlutil #cboWhereOper').button('refresh');
    }

    if (!IsNullOrEmpty(model.STATEMENT)) {
        $('#sqlutil #txtQuery').val(model.STATEMENT);
        //$('#sqlutil #cboWhereOper').button('refresh');
    } else {
        $('#sqlutil #txtQuery').val('');
        //$('#sqlutil #cboWhereOper').button('refresh');
    }
}


function retrieveFromInput() {
    var txt;

    txt = $('#sqlutil #txtWhereConstant').val();
    if (txt != '') {
        model.WHERE_CONSTANT = txt;
    }

    txt = $('#sqlutil #txtQuery').val();
    if (txt != '') {
        model.STATEMENT = txt;
    }
}

