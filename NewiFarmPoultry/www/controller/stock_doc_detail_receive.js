
$('#stock_doc_detail_receive').bind('pagebeforecreate', function (e) {

    $.Util.RenderUiLang('stock_doc_detail_receive');
});

$('#stock_doc_detail_receive').bind('pagebeforehide', function (e, ui) {
    $.StockCtx.PersistPageParam();

    switch ($.StockCtx.StockMode) {
        case 'NEW':
            var lot,subLot,productSpec,serialNo,productionDate,expireDate,receivedDate,quantity,weight;
            lot=$('#stock_doc_detail_receive #lot-txt').val();
            subLot=$('#stock_doc_detail_receive #sublot-txt').val();
            productSpec=$('#stock_doc_detail_receive #productspec-txt').val();
            serialNo=$('#stock_doc_detail_receive #serialno-txt').val();

            productionDate=$('#stock_doc_detail_receive #production-date').val();
            expireDate=$('#stock_doc_detail_receive #expire-date').val();
            receivedDate=$('#stock_doc_detail_receive #received-date').val();
            quantity=$('#stock_doc_detail_receive #quantity-number').val();
            weight=$('#stock_doc_detail_receive #weight-number').val();


            var stockCriteria= $.Ctx.GetPageParam('stock_doc_detail_receive','stockCriteria');
            stockCriteria.LOT_NUMBER = lot;
            stockCriteria.SUB_LOT_NUMBER = subLot;
            stockCriteria.PRODUCT_SPEC = productSpec;
            stockCriteria.SERIAL_NO = serialNo;

            stockCriteria.PRODUCTION_DATE = productionDate;
            stockCriteria.EXPIRE_DATE = expireDate;
            stockCriteria.RECEIVED_DATE = receivedDate;

            stockCriteria.QUANTITY = quantity;
            stockCriteria.WEIGHT = weight;
            $.Ctx.SetPageParam('stock_doc_detail_receive','stockCriteria',stockCriteria);
            console.log(stockCriteria);
            break;
    }


});

$('#stock_doc_detail_receive').bind('pagebeforeshow', function (e, ui) {
    var self = $('#stock_doc_detail_receive');
    console.log('stock_doc_detail_receive:pagebeforeshow')

    //hide grid block
    $('#stock-detail-receive #product-grid').hide();
    $('#stock-detail-receive #lot-grid').hide();
    $('#stock-detail-receive #sublot-grid').hide();
    $('#stock-detail-receive #productspec-grid').hide();
    $('#stock-detail-receive #serialno-grid').hide();
    $('#stock-detail-receive #productiondate-grid').hide();
    $('#stock-detail-receive #expiredate-grid').hide();
    $('#stock-detail-receive #receiveddate-grid').hide();
    $('#stock-detail-receive #labor-grid').hide();
    $('#stock-detail-receive #quantity-grid').hide();
    $('#stock-detail-receive #weight-grid').hide();

    //show grid block by category config
    $.each($.StockCtx.CatagoryConfig,function(i,cat){
        switch(cat.COLUMN_NAME){
            case 'PRODUCT_CODE':
                $('#stock-detail-receive #product-grid').show();
                break;
            case 'LOT_NUMBER':
                $('#stock-detail-receive #lot-grid').show();
                break;
            case 'SUB_LOT_NUMBER':
                $('#stock-detail-receive #sublot-grid').show();
                break;
            case 'PRODUCT_SPEC':
                $('#stock-detail-receive #productspec-grid').show();
                break;
            case 'SERIAL_NO':
                $('#stock-detail-receive #serialno-grid').show();
                break;
            case 'PRODUCTION_DATE':
                $('#stock-detail-receive #productiondate-grid').show();
                break;
            case 'EXPIRE_DATE':
                $('#stock-detail-receive #expiredate-grid').show();
                break;
            case 'RECEIVED_DATE':
                $('#stock-detail-receive #receiveddate-grid').show();
                break;
            case 'LABOR_CODE':
                $('#stock-detail-receive #labor-grid').show();
                break;
            case 'QUANTITY':
                $('#stock-detail-receive #quantity-grid').show();
                break;
            case 'WEIGHT':
                $('#stock-detail-receive #weight-grid').show();
                break;
        }
    });

    var prevPage = (typeof ui.prevPage[0] == 'undefined' ? "" : ui.prevPage[0].id);     //ตรวจสอบ page ก่อนหน้า
    if (prevPage == "lookup") {                                                         //ถ้าเป็น lookup ให้รับค่ามาแสดงใน control
        var stockCriteria= $.Ctx.GetPageParam('stock_doc_detail_receive','stockCriteria');
        //----------PRODUCT-----------------------------------------------
        var obj = $.Ctx.GetPageParam('stock_doc_detail_receive', 'selectedProduct');
        if (obj != null) {
            stockCriteria.PRODUCT_CODE = obj.PRODUCT_CODE;
            stockCriteria.PRODUCT_NAME = obj.PRODUCT_NAME;
            $.Ctx.SetPageParam('stock_doc_detail_receive', 'selectedProduct', null)
        }
        var obj = $.Ctx.GetPageParam('stock_doc_detail_receive', 'selectedLabor');
        if (obj != null) {
            stockCriteria.LABOR_CODE = obj.LABOR_CODE;
            stockCriteria.LABOR_DESC = obj.DESCRIPTION;
            $.Ctx.SetPageParam('stock_doc_detail_receive', 'selectedLabor', null)
        }
        stock_receive_populate2model();
        //$('#quantity-number').val($.Ctx.GetPageParam(self.attr('id'), 'inputQuantity'));
        //$('#weight-number').val($.Ctx.GetPageParam(self.attr('id'), 'inputWeight'));

    }else{
        switch ($.StockCtx.StockMode) {
            case 'NEW':
                //var newStockDetail = $.Ctx.GetPageParam('stock_doc_detail_receive', 'newStockDetail');
                //set ค่าจากตัวแปรให้ control
                var action =$.Ctx.GetPageParam('stock_doc_detail_receive','Action');
                switch (action){
                    case 'Add':
                        stock_receive_populate2model();
                        break;
                    case 'Edit':
                        //model2Control4Edit();
                        break;
                }

                break;
            case 'EDIT':
                model2Control4Edit();
                break;
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

    function stock_receive_populate2model() {
        var stockCriteria =$.Ctx.GetPageParam('stock_doc_detail_receive','stockCriteria');// $.StockCtx.NewStocks[0];
        var btn = self.find('#product-btn');
        btn.text(isEmpty_Null_Undefied(stockCriteria.PRODUCT_CODE) ? 'Choose item' : stockCriteria.PRODUCT_NAME);
        refreshButton(btn)

        /*
        var btn = self.find('#lot-btn');
        btn.text(isEmpty_Null_Undefied(stockCriteria.LOT_NUMBER) ? 'Choose item' : stockCriteria.LOT_DESC);
        refreshButton(btn)

        var btn = self.find('#sublot-btn');
        btn.text(isEmpty_Null_Undefied(stockCriteria.SUB_LOT_NUMBER) ? 'Choose item' : stockCriteria.SUBLOT_DESC);
        refreshButton(btn)
        */

        self.find('#lot-txt').val(stockCriteria.LOT_NUMBER);
        self.find('#sublot-txt').val(stockCriteria.SUB_LOT_NUMBER);

        self.find('#productspec-txt').val(stockCriteria.PRODUCT_SPEC);
        self.find('#serialno-txt').val(stockCriteria.SERIAL_NO);
        self.find('#production-date').val(stockCriteria.PRODUCTION_DATE);
        self.find('#expire-date').val(stockCriteria.EXPIRE_DATE);
        self.find('#received-date').val(stockCriteria.RECEIVED_DATE);

        var btn = self.find('#labor-btn');
        btn.text(isEmpty_Null_Undefied(stockCriteria.LABOR_CODE) ? 'Choose item' : stockCriteria.LABOR_DESC);
        refreshButton(btn)

        /*
        var stock = $.StockCtx.NewStocks[0];
        self.find('#product-txt').val(stock.PRODUCT_CODE == null ? stock.PRODUCT_CODE : stock.PRODUCT_NAME);
        self.find('#lot-txt').val(stock.LOT_NUMBER == null ? '' : stock.LOT_NUMBER);
        self.find('#sublot-txt').val(stock.SUB_LOT_NUMBER == null ? '' : stock.SUB_LOT_NUMBER);

        self.find('#productiondate-txt').val(stock.PRODUCTION_DATE == null ? '' : stock.PRODUCTION_DATE);
        self.find('#expiredate-txt').val(stock.EXPIRE_DATE == null ? '' : stock.EXPIRE_DATE);
        self.find('#receiveddate-txt').val(stock.RECEIVED_DATE == null ? '' : stock.RECEIVED_DATE);

        var btnLabor = self.find('#labor-btn');
        btnLabor.text(stock.LABOR_CODE != null ? stock.LABOR_DESC : 'Choose item');
        btnLabor.button('refresh');  //refresh ค่าที่ใส่ให้ control
*/

        /*
        var stockBalances = $.Ctx.GetPageParam('stock_doc_detail_receive', 'stockBalances');
        self.find('#maxquantity-number').val(stockBalances.QUANTITY);
        self.find('#quantity-number').val(stock.QUANTITY);

        self.find('#maxweight-number').val(stockBalances.WEIGHT);
        self.find('#weight-number').val(stock.WEIGHT);
        */
    }

    function model2Control4Edit(){
        var stock =$.Ctx.GetPageParam('stock_doc_detail_receive', 'stockDetail');
        if(!_.isNull(stock)){
        var self = $('#stock_doc_detail_receive');
            /*
        self.find('#product-selected-lab').text(stock[0].PRODUCT_CODE == null ? stock[0].PRODUCT_CODE : stock[0].PRODUCT_NAME);
        self.find('#lot-selected-lab').text(stock[0].LOT_NUMBER == null ? '' : stock[0].LOT_NUMBER);
        self.find('#sublot-selected-lab').text(stock[0].SUB_LOT_NUMBER == null ? '' : stock[0].SUB_LOT_NUMBER);

        self.find('#productiondate-selected-lab').text(stock[0].PRODUCTION_DATE == null ? '' : stock[0].PRODUCTION_DATE);
        self.find('#expiredate-selected-lab').text(stock[0].EXPIRE_DATE == null ? '' : stock[0].EXPIRE_DATE);
        self.find('#receiveddate-selected-lab').text(stock[0].RECEIVED_DATE == null ? '' : stock[0].RECEIVED_DATE);
        self.find('#labor-selected-lab').text(stock[0].LABOR_CODE == null ? '' : stock[0].LABOR_DESC);
        self.find('#quantity-selected-lab').text(stock[0].QUANTITY == null ? 0 : stock[0].QUANTITY);
        self.find('#weight-selected-lab').text(stock[0].WEIGHT == null ? 0 : stock[0].WEIGHT);
*/
        }
    }
});

$('#stock_doc_detail_receive').bind('pageinit', function (e) {
    var self = $('#stock_doc_detail_receive');

    switch ($.StockCtx.StockMode) {
        case 'NEW':
            var trnCtl = $.StockCtx.StockTranControl;
            if (trnCtl[0].CONF_REF_DOC == 'Y') {
                $('#stock_doc_detail_receive #stock-detail-add').hide();
                $('#stock_doc_detail_receive #delete-footer-btn').hide();
                $('#stock_doc_detail_receive #confirm-footer-btn').hide();
            }
            else {
                $('#stock_doc_detail_receive #stock-detail-add').show();
                $('#stock_doc_detail_receive #delete-footer-btn').hide();
                $('#stock_doc_detail_receive #confirm-footer-btn').show();
            }


            break;
        case 'EDIT':
            $('#stock_doc_detail_receive #delete-footer-btn').show();
            $('#stock_doc_detail_receive #confirm-footer-btn').hide();
            $('#stock_doc_detail_receive #stock-detail-add').hide();
            $('#stock_doc_detail_receive #stock-detail-view').show();
            break;
    }
    //register back button click event
    self.find('a[data-back="true"]').click(function (e) {
        //clear lookup in local storage
        //$.Ctx.SetPageParam(self.attr('id'), 'selectedLabor', null);
        //$.Ctx.SetPageParam(self.attr('id'), 'selectedQuantity', 0);
        //$.Ctx.SetPageParam(self.attr('id'), 'selectedWeight', 0);

        $.Ctx.NavigatePage($.Ctx.GetPageParam('stock_doc_detail_receive', 'Previous'), null, { transition: 'slide', reverse: 'true' });
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
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_receive' , 'msgProductNotFound' , 'Product not found'));
            }
        });
    });
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
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_receive' , 'msgLaborNotFound' , 'Labor not found'));
            }
        });
    });

    //----------FOCUSOUT
    /*
    self.find('#quantity-number').focusout(function (e) {
        var value = Number(self.find('#quantity-number').val());
        var maxvalue = Number(self.find('#maxquantity-number').val());
        if (value > maxvalue) {
            $.Ctx.MsgBox('Quantity can not more than {0}'.format([maxvalue]));
            self.find('#quantity-number').val(0);
        } else {
            $.each($.Ctx.StockTranDetailSelected, function (i, s) {
                s.QUANTITY = value;
            });
        }
    });

    self.find('#weight-number').focusout(function (e) {
        var value = Number(self.find('#weight-number').val());
        var maxvalue = Number(self.find('#maxweight-number').val());
        if (value > maxvalue) {
            $.Ctx.MsgBox('Weight can not more than {0}'.format([maxvalue]));
            self.find('#weight-number').val(0);
        } else {

            $.each($.Ctx.StockTranDetailSelected, function (i, s) {
                s.WEIGHT = value;
            });
        }
    });
    */

    self.find('#confirm-footer-btn').click(function (e) {
        console.log('confirm');

        var qty =0;
        var weight =0;
        /*  check quantity
        ----------------------------*/
        var $qty_input =self.find('#quantity-number');
        var $wgh_input =self.find('#weight-number');

        qty = Number($qty_input.val());
        if($('#stock-detail-receive #quantity-grid').is(':visible')){
            if (qty <= 0) {
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_receive' , 'msgQtyShouldMoreThan' ,'Quantity should more than 0 !!!'));
                $qty_input.focus();
                return false;
            }
        }

        /*  check weight
         ----------------------------*/
        weight = Number($wgh_input.val());
        if($('#stock-detail-receive #quantity-grid').is(':visible')){
            if (weight <= 0) {
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_receive' , 'msgWghShouldMoreThan' , 'Weight should more than 0 !!!'));
                $wgh_input.focus();
                return false;
            }
        }

        var productCode,lot,subLot,productSpec,serialNo,productionDate,expireDate,receivedDate,laborCode;
        var stockCriteria= $.Ctx.GetPageParam('stock_doc_detail_receive','stockCriteria');

        //check visibled
        if($('#stock-detail-receive #product-grid').is(':hidden'))
            productCode ='NA';
        else{
            productCode =stockCriteria.PRODUCT_CODE;
            if(_.isNull(productCode) || _.isEmpty(productCode)){
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_receive' , 'msgProudctRequired' , 'Product required !!!'));
                return false;
            }
        }

        if($('#stock-detail-receive #lot-grid').is(':hidden'))
            lot ='NA';
        else{
            lot=$('#stock_doc_detail_receive #lot-txt').val();
            if(_.isNull(lot) || _.isEmpty(lot)){
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_receive' , 'msgLotRequired' , 'Lot required !!!'));
                return false;
            }
        }

        if($('#stock-detail-receive #sublot-grid').is(':hidden'))
            subLot ='NA';
        else{
            subLot=$('#stock_doc_detail_receive #sublot-txt').val();
            if(_.isNull(subLot) || _.isEmpty(subLot)){
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_receive' , 'msgSubLotRequired' , 'SubLot required !!!'));
                return false;
            }
        }

        if($('#stock-detail-receive #productspec-grid').is(':hidden'))
            productSpec ='NA';
        else{
            productSpec=$('#stock_doc_detail_receive #productspec-txt').val();
            if(_.isNull(productSpec) || _.isEmpty(productSpec)){
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_receive' , 'msgProductSpecRequired' , 'Product Spec required !!!'));
                return false;
            }
        }

        if($('#stock-detail-receive #serialno-grid').is(':hidden'))
            serialNo ='NA';
        else{
            serialNo=$('#stock_doc_detail_receive #serialno-txt').val();
            if(_.isNull(serialNo) || _.isEmpty(serialNo)){
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_receive' , 'msgSerialNoRequired' , 'Serail No required !!!'));
                return false;
            }
        }

        if($('#stock-detail-receive #productiondate-grid').is(':hidden'))
            productionDate ='NA';
        else{
            productionDate=$('#stock_doc_detail_receive #production-date').val();
                if(_.isNull(productionDate) || _.isEmpty(productionDate)){
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_receive' , 'msgProductionDateRequired' , 'Production Date required !!!'));
                return false;
            }
        }

        if($('#stock-detail-receive #expiredate-grid').is(':hidden'))
            expireDate ='NA';
        else{
            expireDate=$('#stock_doc_detail_receive #expire-date').val();
            if(_.isNull(expireDate) || _.isEmpty(expireDate)){

                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_receive' , 'msgExpiredDateRequired' , 'Expired Date required !!!'));
                return false;
            }
        }

        if($('#stock-detail-receive #receiveddate-grid').is(':hidden'))
            receivedDate ='NA';
        else{
            receivedDate=$('#stock_doc_detail_receive #received-date').val();
            if(_.isNull(receivedDate) || _.isEmpty(receivedDate)){
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_receive' , 'msgREceivedDateRequired' , 'Received Date required !!!'));
                return false;
            }
        }

        if($('#stock-detail-receive #labor-grid').is(':hidden'))
            laborCode ='NA';
        else{
            laborCode=stockCriteria.LABOR_CODE;
            /*
            if(isEmpty_Null_Undefied(laborCode)){
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_receive' , 'msgLaborRequired' , 'Labor required !!!'));
                return false;
            }
            */
        }
        $.each($.StockCtx.NewStocks,function(i,stock){
            //get ExtNumber
            /*
            $.StockCtx.getExtNumber(stock.DOC_TYPE, stock.TRN_CODE, stock.DOCUMENT_DATE, stock.DOC_NUMBER, function (extNumber) {
                stock.EXT_NUMBER =extNumber;
                stock.QUANTITY =qty;
                stock.WEIGHT=weight;
            });
             */
            stock.PRODUCT_CODE =productCode;
            stock.LOT_NUMBER =lot;
            stock.SUB_LOT_NUMBER =subLot;
            stock.PRODUCT_SPEC =productSpec;
            stock.SERIAL_NO =serialNo;
            stock.PRODUCTION_DATE =productionDate;
            stock.EXPIRE_DATE =expireDate;
            stock.RECEIVED_DATE =receivedDate;
            stock.LABOR_CODE =laborCode;
            stock.QUANTITY =qty;
            stock.WEIGHT =weight;
        });

        console.log($.StockCtx.NewStocks);
        $.StockCtx.saveStockTran($.StockCtx.NewStocks, null, function (result) {
            console.log('Save all success');

            $.Ctx.NavigatePage('stock_doc_detail', { Previous: 'stock_doc_header', Action: 'Add' }, { transition: 'slide' });
        });
    });

    self.find('#delete-footer-btn').click(function (e) {
        var stockDetails =$.Ctx.GetPageParam('stock_doc_detail_receive', 'stockDetail');
        $.StockCtx.deleteStockTran(stockDetails,function(result){

            var docType = stockDetails[0].DOC_TYPE;
            var tnCode = stockDetails[0].TRN_CODE;
            var docDate = stockDetails[0].DOCUMENT_DATE;
            var docNumber = stockDetails[0].DOC_NUMBER;

            $.Ctx.SetPageParam('stock_doc_detail', 'stockDetail', null); //clear local page data.
            $.StockCtx.getStockDetail(docType, docDate, docNumber, function (results) {
                if(results.length==0){
                    console.log('0 record!!');
                    $.Ctx.NavigatePage('stock_main', { Previous:$.Ctx.GetPageParam('stock_main','Previous'), Action: 'View' }, { transition: 'slide' });
                }
                else{
                    $.Ctx.NavigatePage('stock_doc_detail', { Previous:$.Ctx.GetPageParam('stock_doc_detail','Previous'), Action: 'View' }, { transition: 'slide' });
                }

            });
        });
    });


    //Select All Text when focus
    $('input[type="number"]').live('focus', function () {
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

function searchLabor(successCB) {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT LABOR_CODE,DESCRIPTION FROM HH_LABOR_OPER ORDER BY LABOR_CODE ASC";
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


