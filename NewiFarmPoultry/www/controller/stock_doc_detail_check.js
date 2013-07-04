

$('#stock_doc_detail_check').bind('pagebeforecreate', function (e) {

    $.Util.RenderUiLang('stock_doc_detail_check');
});


$('#stock_doc_detail_check').bind('pagebeforehide', function (e, ui) {
    $.StockCtx.PersistPageParam();
    switch ($.StockCtx.StockMode) {
        case 'NEW':
            var productionDate,expireDate,receivedDate;
            productionDate=$('#stock_doc_detail_check #production-date').val();
            expireDate=$('#stock_doc_detail_check #expire-date').val();
            receivedDate=$('#stock_doc_detail_check #received-date').val();

           var stockCriteria= $.Ctx.GetPageParam('stock_doc_detail_check','stockCriteria');

            stockCriteria.PRODUCTION_DATE = productionDate;
            stockCriteria.EXPIRE_DATE = expireDate;
            stockCriteria.RECEIVED_DATE = receivedDate;
            $.Ctx.SetPageParam('stock_doc_detail_check','stockCriteria',stockCriteria);
            console.log(stockCriteria);
            break;
    }

});


$('#stock_doc_detail_check').bind('pagebeforeshow', function (e, ui) {
    var self = $('#stock_doc_detail_check');
    console.log($.StockCtx.StockMode);

    //ดึงค่าจาก HH_CATAGORY_CONFIG ถ้ามีค่าให้เอามาแสดง
    //hide grid block
    $('#stock-detail-criteria #product-grid').hide();
    $('#stock-detail-criteria #lot-grid').hide();
    $('#stock-detail-criteria #sublot-grid').hide();
    $('#stock-detail-criteria #productiondate-grid').hide();
    $('#stock-detail-criteria #expiredate-grid').hide();
    $('#stock-detail-criteria #receiveddate-grid').hide();

    //show grid block by category config
    $.each($.StockCtx.CatagoryConfig,function(i,cat){
        switch(cat.COLUMN_NAME){
            case 'PRODUCT_CODE':
                $('#stock-detail-criteria #product-grid').show();
                break;
            case 'LOT_NUMBER':
                $('#stock-detail-criteria #lot-grid').show();
                break;
            case 'SUB_LOT_NUMBER':
                $('#stock-detail-criteria #sublot-grid').show();
                break;
            case 'PRODUCTION_DATE':
                $('#stock-detail-criteria #productiondate-grid').show();
                break;
            case 'EXPIRE_DATE':
                $('#stock-detail-criteria #expiredate-grid').show();
                break;
            case 'RECEIVED_DATE':
                $('#stock-detail-criteria #receiveddate-grid').show();
                break;

        }
    });


    var prevPage = (typeof ui.prevPage[0] == 'undefined' ? "" : ui.prevPage[0].id);     //ตรวจสอบ page ก่อนหน้า
    if (prevPage == "lookup") {                                                         //ถ้าเป็น lookup ให้รับค่ามาแสดงใน control

        var stockCriteria= $.Ctx.GetPageParam('stock_doc_detail_check','stockCriteria');
        //----------PRODUCT-----------------------------------------------
        var obj = $.Ctx.GetPageParam('stock_doc_detail_check', 'selectedProduct');
        if (obj != null) {
            stockCriteria.PRODUCT_CODE = obj.PRODUCT_CODE;
            stockCriteria.PRODUCT_NAME = obj.PRODUCT_NAME;
            /*
            $.each($.StockCtx.NewStocks,function(i,stock){
                stock.PRODUCT_CODE = obj.PRODUCT_CODE;
                stock.PRODUCT_NAME = obj.PRODUCT_NAME;
            });
            */
            $.Ctx.SetPageParam('stock_doc_detail_check', 'selectedProduct', null)
        }
        //----------LOT-----------------------------------------------
        var obj = $.Ctx.GetPageParam('stock_doc_detail_check', 'selectedLot');
        if (obj != null) {
            stockCriteria.LOT_NUMBER = obj.LOT;
            stockCriteria.LOT_DESC = obj.DESCRIPTION;
            /*
            $.each($.StockCtx.NewStocks,function(i,stock){
                stock.LOT_NUMBER = obj.LOT;
                stock.LOT_DESC = obj.DESCRIPTION;
            });
            */
            $.Ctx.SetPageParam('stock_doc_detail_check', 'selectedLot', null)
        }
        //----------SUBLOT-----------------------------------------------
        var obj = $.Ctx.GetPageParam('stock_doc_detail_check', 'selectedSubLot');
        if (obj != null) {
            stockCriteria.SUB_LOT_NUMBER = obj.SUBLOT;
            stockCriteria.SUBLOT_DESC = obj.DESCRIPTION;
            /*
            $.each($.StockCtx.NewStocks,function(i,stock){
                stock.SUB_LOT_NUMBER = obj.SUBLOT;
                stock.SUBLOT_DESC = obj.DESCRIPTION;
            });
            */
            $.Ctx.SetPageParam('stock_doc_detail_check', 'selectedSubLot', null)
        }
        $.Ctx.SetPageParam('stock_doc_detail_check','stockCriteria',stockCriteria);
        populate2model();

    }else{

        var lst = self.find('#available-stock-list');
        lst.empty();                                        // clear ค่าใน Listview
        switch ($.StockCtx.StockMode) {
            case 'NEW':
                //console.log($.StockCtx.NewStocks);
                //var stockCriteria = new S1_ST_STOCK_TRN();
                //$.Ctx.SetPageParam('stock_doc_detail_check','stockCriteria',stockCriteria);
                populate2model();
                break;
            case 'EDIT':
        }
    }

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

    function populate2model() {
        var stockCriteria =$.Ctx.GetPageParam('stock_doc_detail_check','stockCriteria');// $.StockCtx.NewStocks[0];

        var btn = self.find('#product-btn');
        btn.text(isEmpty_Null_Undefied(stockCriteria.PRODUCT_CODE) ? 'Choose item' : stockCriteria.PRODUCT_NAME);
        refreshButton(btn)

        var btn = self.find('#lot-btn');
        btn.text(isEmpty_Null_Undefied(stockCriteria.LOT_NUMBER) ? 'Choose item' : stockCriteria.LOT_DESC);
        refreshButton(btn)

        var btn = self.find('#sublot-btn');
        btn.text(isEmpty_Null_Undefied(stockCriteria.SUB_LOT_NUMBER) ? 'Choose item' : stockCriteria.SUBLOT_DESC);
        refreshButton(btn)

        self.find('#production-date').val(stockCriteria.PRODUCTION_DATE);
        self.find('#expire-date').val(stockCriteria.EXPIRE_DATE);
        self.find('#received-date').val(stockCriteria.RECEIVED_DATE);
    }

});

$('#stock_doc_detail_check').bind('pageinit', function (e) {
    var self = $('#stock_doc_detail_check');


    //self.find('#product-grid').hide();
    //self.find('#sublot-grid').hide();

    //register data picker
    $('#production-date', this).mobipick({
        intlStdDate: true
    });

    $('#expire-date', this).mobipick({
        intlStdDate: true
    });

    $('#received-date', this).mobipick({
        intlStdDate: true
    });

    //$('#production-date').val($.Ctx.GetLocalDate().toUIShortDateStr()); //set default date
    //$('#expire-date').val($.Ctx.GetLocalDate().toUIShortDateStr()); //set default date
    //$('#received-date').val($.Ctx.GetLocalDate().toUIShortDateStr()); //set default date

    //register back button click event
    self.find('a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('stock_doc_detail_check', 'Previous'), null, { transition: 'slide', reverse: 'true' });

    });

    //CHECK STOCK BUTTON
    self.find('#checkstock-btn').click(function (e) {
        //ต้อง fillter ด้วย Product ก่อน
        var stockCriteria= $.Ctx.GetPageParam('stock_doc_detail_check','stockCriteria');

        if(stockCriteria.PRODUCT_CODE==null){
            $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_check' , 'msgProductIsReq' ,'PRODUCT is required!!!'));
            return false;
        }
        var lst = self.find('#available-stock-list');
        lst.empty();

        //search S1_ST_STOCK_BALANCE ตาม control ที่มีค่าอยู่ที่หน้าจอ
        var productValue = null;
        var lotValue = null;
        var sublotValue = null;
        var productionDateValue = null;
        var expireDateValue = null;
        var receivedDateValue = null;

        if (self.find('#product-grid').css('display') != 'none') {
            productValue = stockCriteria.PRODUCT_CODE; //$.Ctx.GetPageParam(self.attr('id'), 'selectedProduct');
            productValue = (_.isEmpty(productValue) ? null : productValue);
        }

        /*
        if (_.isEmpty(productValue)) {
        $.Ctx.MsgBox('กรุณาเลือก สินค้า');
        return false;
        }
        */

        if (self.find('#lot-grid').css('display') != 'none') {
            lotValue = stockCriteria.LOT_NUMBER; //$.Ctx.GetPageParam(self.attr('id'), 'selectedLot');
            lotValue = (_.isEmpty(lotValue) ? null : lotValue);
        }

        if (self.find('#sublot-grid').css('display') != 'none') {
            sublotValue = stockCriteria.SUBLOT_NUMBER; //$.Ctx.GetPageParam(self.attr('id'), 'selectedSubLot');
            sublotValue = (_.isEmpty(sublotValue) ? null : sublotValue);
        }

        if (self.find('#productiondate-grid').css('display') != 'none') {
            productionDateValue = self.find('#production-date').val();
            productionDateValue = (_.isEmpty(productionDateValue) ? null : productionDateValue);
        }


        if (self.find('#expiredate-grid').css('display') != 'none') {
            expireDateValue = self.find('#expire-date').val();
            expireDateValue = (_.isEmpty(expireDateValue) ? null : expireDateValue);
        }

        if (self.find('#receiveddate-grid').css('display') != 'none') {
            receivedDateValue = self.find('#received-date').val();
            receivedDateValue = (_.isEmpty(receivedDateValue) ? null : receivedDateValue);
        }

        var cmd = $.Ctx.DbConn.createSelectCommand();
        //cmd.sqlText = "SELECT * FROM S1_ST_STOCK_BALANCE"

        cmd.sqlText = "SELECT BL.*";
        cmd.sqlText += ",WAREHOUSE_NAME";
        cmd.sqlText += ",SUB_WAREHOUSE_NAME";
        cmd.sqlText += ",PRODUCT_NAME";
        cmd.sqlText += ",L.DESCRIPTION AS LOT_DESC";
        cmd.sqlText += ",SBL.DESCRIPTION AS SUBLOT_DESC";
        cmd.sqlText += ",(WAREHOUSE_NAME || '/' || SUB_WAREHOUSE_NAME) AS WAREHOUSE_DESC";
        cmd.sqlText += " FROM S1_ST_STOCK_BALANCE BL";
        cmd.sqlText += " LEFT OUTER JOIN HH_WAREHOUSE_OPER WH ON BL.WAREHOUSE_CODE  =WH.WAREHOUSE_CODE";
        cmd.sqlText += " LEFT OUTER JOIN HH_SUB_WAREHOUSE_OPER SWH ON BL.SUB_WAREHOUSE_CODE =SWH.SUB_WAREHOUSE_CODE";
        cmd.sqlText += " LEFT OUTER JOIN HH_PRODUCT_BU PD ON BL.PRODUCT_CODE = PD.PRODUCT_CODE";
        cmd.sqlText += " LEFT OUTER JOIN HH_LOT_OPER L ON BL.LOT_NUMBER = L.LOT";
        cmd.sqlText += " LEFT OUTER JOIN HH_SUB_LOT_OPER SBL ON BL.SUB_LOT_NUMBER = SBL.SUBLOT";
        //cmd.sqlText += " WHERE BL.BIN_LOCATION IS '" + $. + "'";
        //cmd.sqlText += " AND BL.SUB_BIN_LOCATION IS '" + productValue + "'";

        var whereCmd = [];
        //check location จากหน้า header ด้วย

        //comment for test if deploy remove this comment
        if (!_.isNull($.StockCtx.NewStocks[0].WAREHOUSE_CODE)) {
            whereCmd.push("BL.WAREHOUSE_CODE IS '" + $.StockCtx.NewStocks[0].WAREHOUSE_CODE + "'")
        }
        if (!_.isNull($.StockCtx.NewStocks[0].SUB_WAREHOUSE_CODE)) {
            whereCmd.push("BL.SUB_WAREHOUSE_CODE IS '" + $.StockCtx.NewStocks[0].SUB_WAREHOUSE_CODE + "'")
        }
        //--------------------------

        if (!_.isNull(productValue)) {
            whereCmd.push("BL.PRODUCT_CODE IS '" + productValue + "'")
        }
        if (!_.isNull(lotValue)) {
            whereCmd.push("BL.LOT_NUMBER IS '" + lotValue + "'")
        }
        if (!_.isNull(sublotValue)) {
            whereCmd.push("BL.SUB_LOT_NUMBER IS '" + sublotValue + "'")
        }
        if (!_.isNull(productionDateValue)) {
            whereCmd.push("PRODUCTION_DATE IS '" + productionDateValue + "'")
        }
        if (!_.isNull(expireDateValue)) {
            whereCmd.push("EXPIRE_DATE IS '" + expireDateValue + "'")
        }
        if (!_.isNull(receivedDateValue)) {
            whereCmd.push("RECEIVED_DATE IS '" + receivedDateValue + "'")
        }

        $.each(whereCmd, function (i, s) {
            if (i == 0)
                cmd.sqlText += " WHERE ";
            else
                cmd.sqlText += " AND ";
            cmd.sqlText += s;
        });

        console.log(cmd.sqlText);
        cmd.executeReader(function (tx, res) {
            var stockBalances = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
            if (res.rows.length != 0) {
                for (var i = 0; i < res.rows.length; i++) {
                    var m = new S1_ST_STOCK_BALANCE();
                    m.retrieveRdr(res.rows.item(i));
                    m.WAREHOUSE_NAME = res.rows.item(i).WAREHOUSE_NAME;
                    m.SUB_WAREHOUSE_NAME = res.rows.item(i).SUB_WAREHOUSE_NAME;
                    m.WAREHOUSE_DESC = res.rows.item(i).WAREHOUSE_DESC;
                    m.PRODUCT_NAME = res.rows.item(i).PRODUCT_NAME;
                    m.LOT_DESC = res.rows.item(i).LOT_DESC;
                    m.SUBLOT_DESC = res.rows.item(i).SUBLOT_DESC;

                    stockBalances.push(m);
                }
                populateListView(stockBalances);
                $.Ctx.SetPageParam('stock_doc_detail_check', 'stockBalances', stockBalances);
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_check' , 'msgNotFoundStock' ,'Not found available stock!!!'));
            }
        }, function (err) {
            $.Ctx.MsgBox(err.message);
        });
    });



    function populateListView(results) {
        var lst = $('#stock_doc_detail_check #available-stock-list');
        lst.empty();
        var tpl = '<li><a id="{0}"><h3><span>{1}</span><span>{2}</span></h3>' +
                    '<p><span>QTY: {3}</span><span>WGH: {4}</span></p>' +
                    '</a></li>';

        $.each(results, function (i, item) {
            lst.append(tpl.format([i, item.WAREHOUSE_NAME, item.SUB_WAREHOUSE_NAME, item.QUANTITY, item.WEIGHT]));
        });
        lst.listview('refresh');

        $('#stock_doc_detail_check #available-stock-list li a').live('click', function (e) {
            //clear ค่า qunatity และ weight ก่อนจะเปลี่ยนหน้า
            switch ($.StockCtx.StockMode) {
                case 'NEW':
                    var idx = $(this).attr('id');
                    var stockBalances = $.Ctx.GetPageParam('stock_doc_detail_check', 'stockBalances');
                    console.log('stockBalances');
                    console.log(stockBalances);

                    var stockCriteria =$.Ctx.GetPageParam('stock_doc_detail_check','stockCriteria');

                    $.Ctx.SetPageParam('stock_doc_detail_maintain', 'stockBalances', stockBalances[idx]);
                    console.log(stockBalances[idx]);

                    $.each($.StockCtx.NewStocks,function(i,stock){

                        stock.PRODUCT_CODE = stockBalances[idx].PRODUCT_CODE;
                        stock.PRODUCT_NAME = stockBalances[idx].PRODUCT_NAME;
                        stock.LOT_NUMBER = stockBalances[idx].LOT_NUMBER;
                        stock.LOT_DESC = stockBalances[idx].LOT_DESC;
                        stock.SUB_LOT_NUMBER = stockBalances[idx].SUB_LOT_NUMBER;
                        stock.SUBLOT_DESC = stockBalances[idx].SUBLOT_DESC;
                        stock.PRODUCTION_DATE = stockBalances[idx].PRODUCTION_DATE;
                        stock.EXPIRE_DATE = stockBalances[idx].EXPIRE_DATE;
                        stock.RECEIVED_DATE = stockBalances[idx].RECEIVED_DATE;
                        stock.PRODUCT_SPEC = stockBalances[idx].PRODUCT_SPEC;
                        stock.SERIAL_NO = stockBalances[idx].SERIAL_NO;
                        stock.LABOR_CODE = null;
                        stock.LABOR_DESC = null;

                        stock.QUANTITY = 0;
                        stock.WEIGHT = 0;

                    });

                    $.Ctx.NavigatePage('stock_doc_detail_maintain', { Previous: 'stock_doc_detail_check', Action: 'Add' }, { transition: 'slide' });
                    break;
            }
        });

    }





    //---------------- CLEAR DATE DATA
    self.find('#clear-productiondate-btn').click(function (e) {
        self.find('#production-date').val('');
    });

    self.find('#clear-expiredate-btn').click(function (e) {
        self.find('#expire-date').val('');
    });

    self.find('#clear-receiveddate-btn').click(function (e) {
        self.find('#received-date').val('');
    });

    //register lookup button click event
    self.find('#product-btn').click(function (e) {
        searchProduct(function (results) {
            if (results !== null) {
                var p = new LookupParam();
                p.title = "Product";
                p.calledPage = self.attr('id');
                p.calledResult = 'selectedProduct';
                p.codeField = 'PRODUCT_CODE';
                p.nameField = 'PRODUCT_NAME';
                p.showCode = true;
                p.dataSource = results;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_check' , 'msgProductNotFound' , 'Product not found'));
            }
        });
    });

    self.find('#lot-btn').click(function (e) {
        searchLot(function (results) {
            if (results !== null) {
                var p = new LookupParam();
                p.title = "Lot";
                p.calledPage = self.attr('id');
                p.calledResult = 'selectedLot';
                p.codeField = 'LOT';
                p.nameField = 'DESCRIPTION';
                p.showCode = false;
                p.dataSource = results;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_check' , 'msgLotNotFound' , 'Lot not found'));
            }
        });
    });

    self.find('#sublot-btn').click(function (e) {
        searchSubLot(function (results) {
            if (results !== null) {
                var p = new LookupParam();
                p.title = "Sub Lot";
                p.calledPage = self.attr('id');
                p.calledResult = 'selectedSubLot';
                p.codeField = 'SUBLOT';
                p.nameField = 'DESCRIPTION';
                p.showCode = false;
                p.dataSource = results;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_check' , 'msgSubLotNotFound' , 'SubLot not found'));
            }
        });
    });

    /*
    self.find('#labor-btn').click(function (e) {
    searchLabor(function (results) {
    if (results !== null) {
    var p = new LookupParam();
    p.title = "Labor";
    p.calledPage = self.attr('id');
    p.calledResult = 'selectedLabor';
    p.codeField = 'LABOR_CODE';
    p.nameField = 'DESCRIPTION';
    p.showCode = true;
    p.dataSource = results;

    $.Ctx.SetPageParam('lookup', 'param', p);
    $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
    } else {
    $.Ctx.MsgBox('Labor not found');
    }
    });
    });
    */


    //get panel config for show or hide




});


//------------------FUCNTION --------------------//
function populateControl(stockDetail) {

}

//------------- Lookup Function --------------//
function searchProduct(successCB) {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT PRODUCT_CODE,PRODUCT_NAME FROM HH_PRODUCT_BU";
    //cmd.sqlText = "SELECT PRODUCT_CODE,PRODUCT_NAME FROM HH_PRODUCT_BU WHERE BUSINESS_UNIT = '{0}'".format([$.Ctx.Bu]);
    cmd.executeReader(function (tx, res) {
        var arr = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {

            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_PRODUCT_BU();
                m.retrieveRdr(res.rows.item(i));
                arr.push(m);
            }
        }
        successCB(arr);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
}

function searchLot(successCB) {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT LOT,DESCRIPTION FROM HH_LOT_OPER";
    //cmd.sqlText = "SELECT LOT,DESCRIPTION FROM HH_LOT_OPER WHERE BUSINESS_UNIT = '{0}'".format([$.Ctx.Bu]);
    cmd.executeReader(function (tx, res) {
        var arr = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {

            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_LOT_OPER();
                m.retrieveRdr(res.rows.item(i));
                arr.push(m);
            }
        }
        successCB(arr);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
}

function searchSubLot(successCB) {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT SUBLOT,DESCRIPTION FROM HH_SUB_LOT_OPER";
    //cmd.sqlText = "SELECT SUBLOT,DESCRIPTION FROM HH_SUB_LOT_OPER WHERE BUSINESS_UNIT = '{0}'".format([$.Ctx.Bu]);
    cmd.executeReader(function (tx, res) {
        var arr = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {

            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_SUB_LOT_OPER();
                m.retrieveRdr(res.rows.item(i));
                arr.push(m);
            }
        }
        successCB(arr);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
}

function searchLabor(successCB) {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT LABOR_CODE,DESCRIPTION FROM HH_LABOR_OPER";
    //cmd.sqlText = "SELECT LABOR_CODE,DESCRIPTION FROM HH_LABOR_OPER WHERE BUSINESS_UNIT = '{0}'".format([$.Ctx.Bu]);
    cmd.executeReader(function (tx, res) {
        var arr = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {

            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_LABOR_OPER();
                m.retrieveRdr(res.rows.item(i));
                arr.push(m);
            }
        }
        successCB(arr);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
}

