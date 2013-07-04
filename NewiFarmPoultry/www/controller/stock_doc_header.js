
$('#stock_doc_header').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('stock_doc_header');
});

$('#stock_doc_header').bind('pagebeforehide', function (e, ui) {
    console.log('stock_doc_header:pagebeforehide');
    $.StockCtx.PersistPageParam();
    switch ($.StockCtx.StockMode) {
        case 'NEW':
            var produceItem =$('#stock_doc_header #productitem-txt').val();
            var machineNo =$('#stock_doc_header #machineno-txt').val();
            var formulaCode =$('#stock_doc_header #formula-txt').val();

            //set ค่าให้ model ก่อนที่จะเปลี่ยนหน้าเพื่อเก็บค่าไว้
            $.each($.StockCtx.NewStocks,function(i,stock){
                stock.PRODUCED_ITEM = produceItem;
                stock.MACHINE_NO =machineNo;
                stock.FORMULA_CODE =formulaCode;
            });
            break;
    }
});

$('#stock_doc_header').bind('pageshow', function (e, ui) {
    console.log('stock_doc_header:pageshow');
    switch ($.StockCtx.StockMode) {
        case 'NEW':

            $('#stock_doc_header #stock-header-add').show();
            $('#stock_doc_header #stock-header-view').hide();
            $('#stock_doc_header #delete-footer-btn').hide();

            var trnCtl = $.StockCtx.StockTranControl;
            if (trnCtl[0].CONF_REF_DOC == 'Y') {
                $('#stock_doc_header #btnSave').hide();
                $('#stock_doc_header #detail-footer-btn').show();
            }
            else{
                if (trnCtl[0].CONF_HEADER == 'Y') {
                    $('#stock_doc_header #btnSave').hide();
                    $('#stock_doc_header #detail-footer-btn').show();
                }
                else {
                    $('#stock_doc_header #btnSave').show();
                    $('#stock_doc_header #detail-footer-btn').hide();
                }
            }

            var refStockTran = $.Ctx.GetPageParam('stock_doc_header', 'refStockTran');
            if(!_.isNull(refStockTran)){
                if(refStockTran[0].WAREHOUSE_CODE!=null){
                    var btn = $('#stock_doc_header #warehouse-btn');
                    btn.attr('disabled','disabled');
                    refreshButton(btn);
                }
            }
            break;
        case 'EDIT':
            $('#stock_doc_header #stock-header-add').hide();
            $('#stock_doc_header #stock-header-view').show();
            $('#stock_doc_header #stock-header-view input').attr('disabled', 'disabled');
            $('#stock_doc_header #btnSave').hide();
            $('#stock_doc_header #delete-footer-btn').show();
            var trnCtl = $.StockCtx.StockTranControl;
            if (trnCtl[0].CONF_DETAIL == 'Y') {
                $('#stock_doc_header #detail-footer-btn').show();
            }
            else {
                $('#stock_doc_header #detail-footer-btn').hide();
            }

            break;
    }
});

$('#stock_doc_header').bind('pagebeforeshow', function (e, ui) {
    var self = $('#stock_doc_header');
    console.log('stock_doc_header:pagebeforeshow');
    console.log($.StockCtx.StockMode);

    //hide grid block
    $('#stock-header-add #warhouse-grid').hide();
    $('#stock-header-add #customer-grid').hide();
    $('#stock-header-add #reason-grid').hide();
    $('#stock-header-add #job-grid').hide();
    $('#stock-header-add #productitem-grid').hide();
    $('#stock-header-add #machineno-grid').hide();
    $('#stock-header-add #formula-grid').hide();
    $('#stock-header-add #shift-grid').hide();

    $('#stock-header-view #warhouse-grid-view').hide();
    $('#stock-header-view #customer-grid-view').hide();
    $('#stock-header-view #reason-grid-view').hide();
    $('#stock-header-view #job-grid-view').hide();
    $('#stock-header-view #productitem-grid-view').hide();
    $('#stock-header-view #machineno-grid-view').hide();
    $('#stock-header-view #formula-grid-view').hide();
    $('#stock-header-view #shift-grid-view').hide();


    //show grid block by category config
    $.each($.StockCtx.CatagoryConfig,function(i,cat){
        switch(cat.COLUMN_NAME){
            case 'WAREHOUSE_CODE':
                $('#stock-header-add #warhouse-grid').show();
                $('#stock-header-view #warhouse-grid-view').show();
                break;
            case 'CV_CODE':
                $('#stock-header-add #customer-grid').show();
                $('#stock-header-view #customer-grid-view').show();
                break;
            case 'REASON_CODE':
                $('#stock-header-add #reason-grid').show();
                $('#stock-header-view #reason-grid-view').show();
                break;
            case 'PRODUCTION_NO':
                $('#stock-header-add #job-grid').show();
                $('#stock-header-view #job-grid-view').show();
                break;
            case 'PRODUCED_ITEM':
                $('#stock-header-add #productitem-grid').show();
                $('#stock-header-view #productitem-grid-view').show();
                break;
            case 'MACHINE_NO':
                $('#stock-header-add #machineno-grid').show();
                $('#stock-header-view #machineno-grid-view').show();
                break;
            case 'FORMULA_CODE':
                $('#stock-header-add #formula-grid').show();
                $('#stock-header-view #formula-grid-view').show();
                break;
            case 'SHIFT_NO':
                $('#stock-header-add #shift-grid').show();
                $('#stock-header-view #shift-grid-view').show();
                break;
        }
    });


    var prevPage = (typeof ui.prevPage[0] == 'undefined' ? "" : ui.prevPage[0].id);     //ตรวจสอบ page ก่อนหน้า
    if (prevPage == "lookup") {
        var obj = $.Ctx.GetPageParam('stock_doc_header', 'selectedWarehouse');
        if (obj != null) {
            if($.StockCtx.NewStocks.length==1){
                $.each($.StockCtx.NewStocks,function(i,stock){
                    stock.WAREHOUSE_CODE = obj.WAREHOUSE_CODE;
                    stock.SUB_WAREHOUSE_CODE = obj.SUB_WAREHOUSE_CODE;
                    stock.WAREHOUSE_DESC = obj.WAREHOUSE_DESC;
                });

            }else{
                //Transfer Doc
                //Doc ตัวแรกให้เก็บค่า From Warehouse
                //Doc ตัวที่สองเก็บค่า To Warehouse
                $.StockCtx.NewStocks[0].WAREHOUSE_CODE = obj.WAREHOUSE_CODE;
                $.StockCtx.NewStocks[0].SUB_WAREHOUSE_CODE = obj.SUB_WAREHOUSE_CODE;
                $.StockCtx.NewStocks[0].WAREHOUSE_DESC = obj.WAREHOUSE_DESC;
            }
            $.Ctx.SetPageParam('stock_doc_header', 'selectedWarehouse',null);
        }

        //To Warehouse transfer stock case.
        var obj = $.Ctx.GetPageParam('stock_doc_header', 'selectedToWarehouse');
        if (obj != null) {
            $.StockCtx.NewStocks[1].WAREHOUSE_CODE = obj.WAREHOUSE_CODE;
            $.StockCtx.NewStocks[1].SUB_WAREHOUSE_CODE = obj.SUB_WAREHOUSE_CODE;
            $.StockCtx.NewStocks[1].WAREHOUSE_DESC = obj.WAREHOUSE_DESC;
            $.Ctx.SetPageParam('stock_doc_header', 'selectedToWarehouse',null);
        }


        var obj = $.Ctx.GetPageParam('stock_doc_header', 'selectedCV');
        if (obj != null) {
            $.each($.StockCtx.NewStocks,function(i,stock){
                stock.CV_CODE = obj.CV_CODE;
                stock.CV_NAME = obj.CV_NAME;
            });
            $.Ctx.SetPageParam('stock_doc_header', 'selectedCV',null);
        }

        var obj = $.Ctx.GetPageParam('stock_doc_header', 'selectedReason');
        if (obj != null) {
            $.each($.StockCtx.NewStocks,function(i,stock){
                stock.REASON_CODE  =obj.GDCODE;
                stock.REASON_NAME = obj.GENERAL_NAME;
            });
            $.Ctx.SetPageParam('stock_doc_header', 'selectedReason',null);
        }

        var obj = $.Ctx.GetPageParam('stock_doc_header', 'selectedJob');
        if (obj != null) {
            $.each($.StockCtx.NewStocks,function(i,stock){
                stock.PRODUCTION_NO =obj.JOB_NO;
                stock.JOB_NAME = obj.JOB_NAME;
            });
            $.Ctx.SetPageParam('stock_doc_header', 'selectedJob',null);
        }

        var obj = $.Ctx.GetPageParam('stock_doc_header', 'selectedShift');
        if (obj != null) {
            $.each($.StockCtx.NewStocks,function(i,stock){
                stock.SHIFT_NO = obj.SHIFT_NO;
            });

            $.Ctx.SetPageParam('stock_doc_header', 'selectedShift',null);
        }
        populate2Control();
    }else{


        switch ($.StockCtx.StockMode) {
            case 'NEW':
                populate2Control();
                break;
            case 'EDIT':
                populate2Control4View();
                break;
        }
    }

    function populate2Control4View(){

        if($.StockCtx.param.length==1){
            var stock =$.StockCtx.StockTranSelected[0];
            $('#stock_doc_header #warehouse-txt-view').val(stock.WAREHOUSE_DESC);
            $('#stock_doc_header #customer-txt-view').val(stock.CV_NAME);
            $('#stock_doc_header #reason-txt-view').val(stock.REASON_NAME);
            $('#stock_doc_header #job-txt-view').val(stock.JOB_NAME);
            $('#stock_doc_header #productitem-txt-view').val(stock.PRODUCED_ITEM);
            $('#stock_doc_header #machineno-txt-view').val(stock.MACHINE_NO);
            $('#stock_doc_header #formula-txt-view').val(stock.FORMULA_CODE);
            $('#stock_doc_header #shift-txt-view').val(stock.SHIFT_NO);
            $('#stock_doc_header #towarhouse-grid-view').hide();
        }
        else{

            //$.StockCtx.param[0].DOC_TYPE =66 ขาเบิก
            //$.StockCtx.param[0].DOC_TYPE =61 ขารับ
            var issueDoc = _.where($.StockCtx.StockTranSelected,{DOC_TYPE:$.StockCtx.param[0].DOC_TYPE});
            var reciveDoc = _.where($.StockCtx.StockTranSelected,{DOC_TYPE:$.StockCtx.param[1].DOC_TYPE});
            $('#stock_doc_header #warehouse-txt-view').val(issueDoc[0].WAREHOUSE_DESC);
            $('#stock_doc_header #towarehouse-txt-view').val(reciveDoc[0].WAREHOUSE_DESC);
            $('#stock_doc_header #customer-txt-view').val(issueDoc[0].CV_NAME);
            $('#stock_doc_header #reason-txt-view').val(issueDoc[0].REASON_NAME);
            $('#stock_doc_header #job-txt-view').val(issueDoc[0].JOB_NAME);
            $('#stock_doc_header #productitem-txt-view').val(issueDoc[0].PRODUCED_ITEM);
            $('#stock_doc_header #machineno-txt-view').val(issueDoc[0].MACHINE_NO);
            $('#stock_doc_header #formula-txt-view').val(issueDoc[0].FORMULA_CODE);
            $('#stock_doc_header #shift-txt-view').val(issueDoc[0].SHIFT_NO);
            $('#stock_doc_header #towarhouse-grid-view').show();
        }
    }

    function populate2Control(){
        var stock =$.StockCtx.NewStocks[0];
        var btn = self.find('#warehouse-btn');
        btn.text(isEmpty_Null_Undefied(stock.WAREHOUSE_CODE) ? 'Choose item' : stock.WAREHOUSE_DESC );
        refreshButton(btn)

        //ถ้า doctype จากเมนูมีแค่ 1 ไม่ต้องแสดง ToWarehouse grid.
        if($.StockCtx.param.length==1){
            $('#stock_doc_header #towarehouse-grid').hide();
        }else{
            var btn = self.find('#towarehouse-btn');
            btn.text(isEmpty_Null_Undefied($.StockCtx.NewStocks[1].WAREHOUSE_CODE) ? 'Choose item' : $.StockCtx.NewStocks[1].WAREHOUSE_DESC );
            refreshButton(btn)
        }

        var btn = self.find('#customer-btn');
        btn.text(isEmpty_Null_Undefied(stock.CV_CODE) ? 'Choose item' : stock.CV_NAME);
        refreshButton(btn)

        var btn = self.find('#reason-btn');
        btn.text(isEmpty_Null_Undefied(stock.REASON_CODE) ? 'Choose item' : stock.REASON_NAME);
        refreshButton(btn);

        var btn = self.find('#job-btn');
        btn.text(isEmpty_Null_Undefied(stock.PRODUCTION_NO) ? 'Choose item' : stock.JOB_NAME);
        refreshButton(btn);

        var btn = self.find('#shift-btn');
        btn.text(isEmpty_Null_Undefied(stock.SHIFT_NO) ? 'Choose item' : stock.SHIFT_NO);
        refreshButton(btn);

        var txt = self.find('#productitem-txt');
        txt.val(isEmpty_Null_Undefied(stock.PRODUCED_ITEM) ? 0 : stock.PRODUCED_ITEM);

        var txt = self.find('#machineno-txt');
        txt.val(isEmpty_Null_Undefied(stock.MACHINE_NO) ? 0 : stock.MACHINE_NO);

        var txt = self.find('#formula-txt');
        txt.val(isEmpty_Null_Undefied(stock.FORMULA_CODE) ? '' : stock.FORMULA_CODE);


    }
});

$('#stock_doc_header').bind('pageinit', function (e) {
    console.log('stock_doc_header:pageinit');
    var self = $('#stock_doc_header');

    //register click event
    $('#stock_doc_header #lnkStockDocHeaderBack').click(function (e) {
        console.log('stock_doc_header:back');
        $.Ctx.NavigatePage($.Ctx.GetPageParam('stock_doc_header', 'Previous'), null, { transition: 'slide', reverse: 'true' });
    });

    //------------SAVE
    self.find('#btnSave').click(function (e) {

    });

    //------------DETAIL BUTTON
    self.find('#detail-footer-btn').click(function (e) {
        switch ($.StockCtx.StockMode) {
            case 'NEW':
                var refStockTran = $.Ctx.GetPageParam('stock_doc_header', 'refStockTran');
                $.Ctx.SetPageParam('stock_doc_detail', 'refStockTran',refStockTran);
                break;
            case 'EDIT':

                break;
        }
        $.Ctx.NavigatePage('stock_doc_detail', { Previous: 'stock_doc_header', Action: 'View' }, { transition: 'slide' });
    });

    //------------DELETE BUTTON
    self.find('#delete-footer-btn').click(function (e) {
        console.log('begin delete');
        console.log($.StockCtx.StockTranSelected);
        $.StockCtx.deleteStockTran($.StockCtx.StockTranSelected, function (result) {
            console.log('delete success');
            $.StockCtx.StockTranSelected = new Array();           //clear ค่าใน global
            $.Ctx.NavigatePage('stock_main', { Previous:$.Ctx.GetPageParam('stock_main','Previous'), Action: 'Add' }, { transition: 'slide' });
        })
        console.log('end delete');
    });

    //register lookup button click event
    self.find('#warehouse-btn').click(function (e) {
        searchWarehouse(function (results) {
            if (results !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('stock_doc_header' , 'msgWarehouse' , 'Warehouse');
                p.calledPage = 'stock_doc_header';
                p.calledResult = 'selectedWarehouse';
                p.codeField = 'WAREHOUSE_CODE';
                p.nameField = 'WAREHOUSE_DESC';
                p.showCode = false;
                p.dataSource = results;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_header' , 'msgWareHouseNotFound' ,'Warehouse not found'));
            }
        });
    });

    self.find('#towarehouse-btn').click(function (e) {
        searchToWarehouse(function (results) {
            if (results !== null) {
                var p = new LookupParam();
                p.title = "To Warehouse";
                p.calledPage = 'stock_doc_header';
                p.calledResult = 'selectedToWarehouse';
                p.codeField = 'WAREHOUSE_CODE';
                p.nameField = 'WAREHOUSE_DESC';
                p.showCode = false;
                p.dataSource = results;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_header' , 'msgToWareHouseNotFound' ,'To Warehouse not found'));
            }
        });
    });

    self.find('#customer-btn').click(function (e) {
        searchCVOper(function (results) {
            if (results !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('stock_doc_header' , 'msgCustomAndVendor', "Customer/Vendor");
                p.calledPage = 'stock_doc_header';
                p.calledResult = 'selectedCV';
                p.codeField = 'CV_CODE';
                p.nameField = 'CV_NAME';
                p.showCode = true;
                p.dataSource = results;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_header' , 'msgCVNotFound' ,'Customer/Vendor not found'));
            }
        });
    });

    self.find('#job-btn').click(function (e) {
        searchJob(function (results) {
            if (results !== null) {
                var p = new LookupParam();
                p.title = "Job";
                p.calledPage = 'stock_doc_header';
                p.calledResult = 'selectedJob';
                p.codeField = 'JOB_NO';
                p.nameField = 'JOB_NAME';
                p.showCode = false;
                p.dataSource = results;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_header' , 'msgJobNotFound' ,'Job not found'));
            }
        });
    });

    self.find('#reason-btn').click(function (e) {
        searchReason(function (results) {
            if (results !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('stock_doc_header' , 'msgReason' ,"Reason" );
                p.calledPage = 'stock_doc_header';
                p.calledResult = 'selectedReason';
                p.codeField = 'GDCODE';
                p.nameField = 'GENERAL_NAME';
                p.showCode = false;
                p.dataSource = results;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_header' , 'msgReasonNotFound' ,'Reason not found'));
            }
        });
    });

    self.find('#shift-btn').click(function (e) {
        searchShift(function (results) {
            if (results !== null) {
                var p = new LookupParam();
                p.title = "Shift";
                p.calledPage = 'stock_doc_header';
                p.calledResult = 'selectedShift';
                p.codeField = 'SHIFT_NO';
                p.nameField = 'SHIFT_NO';
                p.showCode = false;
                p.dataSource = results;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_header' , 'msgShiftNotFound' ,'Shift not found'));
            }
        });
    });

    //register lostfocus text control event
    //-----------------------FOCUSOUT
    /*
    self.find('#productitem-txt').focusout(function (e) {
    console.log('productitem-txt focusout');
    $.each($.StockCtx.StockTranSelected, function (i, s) {
    s.PRODUCED_ITEM = self.find('#productitem-txt').val();
    });
    });

    self.find('#machineno-txt').focusout(function (e) {
    console.log('machineno-txt focusout');
    $.each($.StockCtx.StockTranSelected, function (i, s) {
    s.MACHINE_NO = self.find('#machineno-txt').val();
    });
    });

    self.find('#formula-txt').focusout(function (e) {
    console.log('formula-txt focusout');
    $.each($.StockCtx.StockTranSelected, function (i, s) {
    s.FORMULA_CODE = self.find('#formula-txt').val();
    });
    });
    */

    //Select All Text when focus
    $('input').live('focus', function () {
        var $this = $(this);
        $this.select();
        // Work around Chrome's little problem
        $this.mouseup(function () {
            // Prevent further mouseup intervention
            $this.unbind("mouseup");
            return false;
        });
    });

    //get panel config for show or hide


});

//------------------FUCNTION --------------------//
function isEmpty_Null_Undefied(param) {
    if (_.isNull(param) || _.isEmpty(param) || _.isUndefined(param) || (param=='NA') )
        return true;
    else
        return false;
}

function refreshButton(obj) {
    obj.button('refresh');  //refresh ค่าที่ใส่ให้ control
}

//------------- Lookup Function --------------//
function searchWarehouse(successCB) {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT WH.WAREHOUSE_CODE AS WAREHOUSE_CODE"
    cmd.sqlText += ",SWH.SUB_WAREHOUSE_CODE AS SUB_WAREHOUSE_CODE"
    cmd.sqlText += ",(WH.WAREHOUSE_NAME || '/' || SWH.SUB_WAREHOUSE_NAME) AS WAREHOUSE_DESC"
    cmd.sqlText += " FROM HH_WAREHOUSE_OPER WH,HH_SUB_WAREHOUSE_OPER SWH"
    cmd.sqlText += " WHERE WH.WAREHOUSE_CODE =SWH.WAREHOUSE_CODE"
    cmd.sqlText += " ORDER BY WH.WAREHOUSE_CODE,SWH.SUB_WAREHOUSE_CODE ASC"

    //cmd.sqlText = "SELECT WAREHOUSE_CODE,WAREHOUSE_NAME FROM HH_WAREHOUSE_OPER";
    //cmd.sqlText = "SELECT WAREHOUSE_CODE,WAREHOUSE_NAME FROM HH_WAREHOUSE_OPER WHERE BUSINESS_UNIT = '{0}'".format([$.Ctx.Bu]);
    cmd.executeReader(function (tx, res) {
        var arr = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {

            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_SUB_WAREHOUSE_OPER();
                m.retrieveRdr(res.rows.item(i));
                m.WAREHOUSE_DESC = res.rows.item(i).WAREHOUSE_DESC;
                arr.push(m);
            }
        }
        successCB(arr);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
}

function searchToWarehouse(successCB) {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT WH.WAREHOUSE_CODE AS WAREHOUSE_CODE"
    cmd.sqlText += ",SWH.SUB_WAREHOUSE_CODE AS SUB_WAREHOUSE_CODE"
    cmd.sqlText += ",(WH.WAREHOUSE_NAME || '/' || SWH.SUB_WAREHOUSE_NAME) AS WAREHOUSE_DESC"
    cmd.sqlText += " FROM HH_WAREHOUSE_OPER WH,HH_SUB_WAREHOUSE_OPER SWH"
    cmd.sqlText += " WHERE WH.WAREHOUSE_CODE =SWH.WAREHOUSE_CODE"
    cmd.sqlText += " ORDER BY WH.WAREHOUSE_CODE,SWH.SUB_WAREHOUSE_CODE ASC"

    cmd.executeReader(function (tx, res) {
        var arr = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {

            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_SUB_WAREHOUSE_OPER();
                m.retrieveRdr(res.rows.item(i));
                m.WAREHOUSE_DESC = res.rows.item(i).WAREHOUSE_DESC;
                arr.push(m);
            }
        }
        successCB(arr);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
}

function searchCVOper(successCB) {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT CV_CODE,CV_NAME FROM HH_CV_OPER ORDER BY CV_CODE";
    //cmd.sqlText = "SELECT CV_CODE,CV_NAME FROM HH_CV_OPER WHERE BUSINESS_UNIT = '{0}'".format([$.Ctx.Bu]);
    cmd.executeReader(function (tx, res) {
        var arr = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {

            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_CV_OPER();
                m.retrieveRdr(res.rows.item(i));
                arr.push(m);
            }
        }
        successCB(arr);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
}

function searchReason(successCB) {
    var nameField = "";
    var cmd = $.Ctx.DbConn.createSelectCommand();

    if ($.Ctx.Lang == "en-US")
        nameField = "ifnull(DESC2, DESC1)";
    else
        nameField = "ifnull(DESC1, DESC2)";

    cmd.sqlText = "SELECT GDCODE,GDTYPE,{0} AS GENERAL_NAME FROM GENERAL_DESC WHERE GDTYPE = 'REACD'".format([nameField]);
    cmd.executeReader(function (tx, res) {
        var arr = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {

            for (var i = 0; i < res.rows.length; i++) {
                var m = new GENERAL_DESC();
                m.retrieveRdr(res.rows.item(i));
                m.GENERAL_NAME = res.rows.item(i).GENERAL_NAME;
                arr.push(m);
            }
        }
        successCB(arr);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
}

function searchJob(successCB) {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT JOB_NO,JOB_NAME FROM HH_JOB_OPER";
    //cmd.sqlText = "SELECT JOB_NO,JOB_NAME FROM HH_JOB_OPER WHERE BUSINESS_UNIT = '{0}'".format([$.Ctx.Bu]);
    cmd.executeReader(function (tx, res) {
        var arr = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {

            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_JOB_OPER();
                m.retrieveRdr(res.rows.item(i));
                arr.push(m);
            }
        }
        successCB(arr);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
}

function searchShift(successCB) {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT SHIFT_NO FROM HH_SHIFT_OPER ORDER BY SHIFT_NO ASC";
    //cmd.sqlText = "SELECT SHIFT_NO FROM HH_SHIFT_OPER WHERE BUSINESS_UNIT = '{0}'".format([$.Ctx.Bu]);
    cmd.executeReader(function (tx, res) {
        var arr = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {

            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_SHIFT_OPER();
                m.retrieveRdr(res.rows.item(i));
                arr.push(m);
            }
        }
        successCB(arr);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
}
