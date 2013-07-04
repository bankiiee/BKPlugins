
$('#stock_doc_detail_maintain').bind('pagebeforecreate', function (e) {

    $.Util.RenderUiLang('stock_doc_detail_maintain');
});

$('#stock_doc_detail_maintain').bind('pagebeforehide', function (e, ui) {
    $.StockCtx.PersistPageParam();
    var quantity =$('#stock_doc_detail_maintain #quantity-number').val();
    var weight =$('#stock_doc_detail_maintain #weight-number').val()
    $.each($.StockCtx.NewStocks,function(i,stock){
        stock.QUANTITY =quantity;
        stock.WEIGHT =weight;
    });

    //$.Ctx.SetPageParam(self.attr('id'), 'inputQuantity', $('#quantity-number').val())
    //$.Ctx.SetPageParam(self.attr('id'), 'inputWeight', $('#weight-number').val())
});

$('#stock_doc_detail_maintain').bind('pagebeforeshow', function (e, ui) {
    var self = $('#stock_doc_detail_maintain');
    console.log('stock_doc_detail_maintain:pagebeforeshow')
    var prevPage = (typeof ui.prevPage[0] == 'undefined' ? "" : ui.prevPage[0].id);     //ตรวจสอบ page ก่อนหน้า

    if (prevPage == "lookup") {                                                         //ถ้าเป็น lookup ให้รับค่ามาแสดงใน control
        //----------LABOR-----------------------------------------------
        /*
        var btnLabor = self.find('#labor-btn');
        var obj = $.Ctx.GetPageParam(self.attr('id'), 'selectedLabor');
        if (obj == null)
        btnLabor.text('Choose item');
        else {
        btnLabor.text(obj.DESCRIPTION);
        }
        btnLabor.button('refresh');  //refresh ค่าที่ใส่ให้ control
        */
        var obj = $.Ctx.GetPageParam('stock_doc_detail_maintain', 'selectedLabor');
        if (obj != null) {
            $.each($.StockCtx.NewStocks,function(i,stock){
                stock.LABOR_CODE = obj.LABOR_CODE;
                stock.LABOR_DESC = obj.DESCRIPTION;
            });

            $.Ctx.SetPageParam('stock_doc_detail_maintain', 'selectedLabor', null)
        }
        model2Control();
        //$('#quantity-number').val($.Ctx.GetPageParam(self.attr('id'), 'inputQuantity'));
        //$('#weight-number').val($.Ctx.GetPageParam(self.attr('id'), 'inputWeight'));

    }else{
        switch ($.StockCtx.StockMode) {
            case 'NEW':
                //var newStockDetail = $.Ctx.GetPageParam('stock_doc_detail_maintain', 'newStockDetail');
                //set ค่าจากตัวแปรให้ control
                var action =$.Ctx.GetPageParam('stock_doc_detail_maintain','Action');
                switch (action){
                    case 'Add':
                        model2Control();
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

    function model2Control() {
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

        var stockBalances = $.Ctx.GetPageParam('stock_doc_detail_maintain', 'stockBalances');
        self.find('#maxquantity-number').val(stockBalances.QUANTITY);
        self.find('#quantity-number').val(stock.QUANTITY);

        self.find('#maxweight-number').val(stockBalances.WEIGHT);
        self.find('#weight-number').val(stock.WEIGHT);
    }

    function model2Control4Edit(){
        var stock =$.Ctx.GetPageParam('stock_doc_detail_maintain', 'stockDetail');
        if(!_.isNull(stock)){
        var self = $('#stock_doc_detail_maintain');
        self.find('#product-selected-lab').text(stock[0].PRODUCT_CODE == null ? stock[0].PRODUCT_CODE : stock[0].PRODUCT_NAME);
        self.find('#lot-selected-lab').text(stock[0].LOT_NUMBER == null ? '' : stock[0].LOT_NUMBER);
        self.find('#sublot-selected-lab').text(stock[0].SUB_LOT_NUMBER == null ? '' : stock[0].SUB_LOT_NUMBER);

        self.find('#productiondate-selected-lab').text(stock[0].PRODUCTION_DATE == null ? '' : stock[0].PRODUCTION_DATE);
        self.find('#expiredate-selected-lab').text(stock[0].EXPIRE_DATE == null ? '' : stock[0].EXPIRE_DATE);
        self.find('#receiveddate-selected-lab').text(stock[0].RECEIVED_DATE == null ? '' : stock[0].RECEIVED_DATE);
        self.find('#labor-selected-lab').text(stock[0].LABOR_DESC == null ? '' : stock[0].LABOR_DESC);
        self.find('#quantity-selected-lab').text(stock[0].QUANTITY == null ? 0 : stock[0].QUANTITY);
        self.find('#weight-selected-lab').text(stock[0].WEIGHT == null ? 0 : stock[0].WEIGHT);

        }
    }
});

$('#stock_doc_detail_maintain').bind('pageinit', function (e) {
    var self = $('#stock_doc_detail_maintain');

    switch ($.StockCtx.StockMode) {
        case 'NEW':
            var trnCtl = $.StockCtx.StockTranControl;
            if (trnCtl[0].CONF_REF_DOC == 'Y') {
                $('#stock_doc_detail_maintain #stock-detail-view').show();
                $('#stock_doc_detail_maintain #stock-detail-add').hide();
                $('#stock_doc_detail_maintain #delete-footer-btn').hide();
                $('#stock_doc_detail_maintain #confirm-footer-btn').hide();
            }
            else {
                $('#stock_doc_detail_maintain #stock-detail-view').hide();
                $('#stock_doc_detail_maintain #stock-detail-add').show();
                $('#stock_doc_detail_maintain #delete-footer-btn').hide();
                $('#stock_doc_detail_maintain #confirm-footer-btn').show();
            }

            $('#stock_doc_detail_maintain #product-txt').attr('disabled', 'disabled');
            $('#stock_doc_detail_maintain #lot-txt').attr('disabled', 'disabled');
            $('#stock_doc_detail_maintain #sublot-txt').attr('disabled', 'disabled');
            $('#stock_doc_detail_maintain #productiondate-txt').attr('disabled', 'disabled');
            $('#stock_doc_detail_maintain #expiredate-txt').attr('disabled', 'disabled');
            $('#stock_doc_detail_maintain #receiveddate-txt').attr('disabled', 'disabled');
            $('#stock_doc_detail_maintain #location-txt').attr('disabled', 'disabled');

            $('#stock_doc_detail_maintain #maxquantity-number').attr('disabled', 'disabled');
            $('#stock_doc_detail_maintain #maxweight-number').attr('disabled', 'disabled');
            break;
        case 'EDIT':
            $('#stock_doc_detail_maintain #delete-footer-btn').show();
            $('#stock_doc_detail_maintain #confirm-footer-btn').hide();
            $('#stock_doc_detail_maintain #stock-detail-add').hide();
            $('#stock_doc_detail_maintain #stock-detail-view').show();
            break;
    }
    //register back button click event
    self.find('a[data-back="true"]').click(function (e) {
        //clear lookup in local storage
        //$.Ctx.SetPageParam(self.attr('id'), 'selectedLabor', null);
        //$.Ctx.SetPageParam(self.attr('id'), 'selectedQuantity', 0);
        //$.Ctx.SetPageParam(self.attr('id'), 'selectedWeight', 0);

        $.Ctx.NavigatePage($.Ctx.GetPageParam('stock_doc_detail_maintain', 'Previous'), null, { transition: 'slide', reverse: 'true' });
    });

    //register lookup button click event
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
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_maintain' , 'msgLaborNotFound' , 'Labor not found'));
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

        var qty = Number(self.find('#quantity-number').val());
        var maxqty = Number(self.find('#maxquantity-number').val());
        if (qty > maxqty) {
            $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_maintain' , 'msgQtyNotMoreThan' ,'Quantity can not more than {0}  !!!'.format([maxqty])));
            return false;
        }
        if (qty <= 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_maintain' , 'msgQtyShouldMoreThan' ,'Quantity should more than 0 !!!'));
            return false;
        }

        var weight = Number(self.find('#weight-number').val());
        var maxweight = Number(self.find('#maxweight-number').val());
        if (weight > maxweight) {
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_maintain' , 'msgWghNotMoreThan' , 'Weight can not more than {0} !!!'.format([maxweight])));
            return false;
        }
        if (weight <= 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail_maintain' , 'msgWghShouldMoreThan' , 'Weight should more than 0 !!!'));
            return false;
        }

        //var stockBalances = $.Ctx.GetPageParam('stock_doc_detail_maintain', 'stockBalances');
        //console.log(stockBalances)
        //console.log('stock header before save');
        //console.log($.Ctx.NewStockHeader)
        //console.log('stock detail before save');
        //console.log($.Ctx.NewStockDetail)

        /*

        var stockTrans = new Array();
        //loop ตาม DocType ที่มาจาก Menu
        $.each($.StockCtx.param,function(i,p){
            //set ค่าให้ model เพื่อนำไป save
            var stock = new S1_ST_STOCK_TRN();
            stock = $.Ctx.NewStockHeader;

            stock.DOC_TYPE = p.DOC_TYPE;
            stock.TRN_CODE = p.TRN_CODE;
            var calType = null;
            var trnCtl = $.StockCtx.StockTranControl;
            if (Number(trnCtl[i].STOCK_TYPE) == 1)
                calType = 1;
            else
                calType = -1;

            stock.TRN_TYPE = trnCtl[i].STOCK_TYPE;
            stock.CAL_TYPE = calType;

            //set ค่าจากการเลือก StockBalance ให้ NewStock
            stock.PRODUCT_CODE = stockBalances.PRODUCT_CODE;
            stock.LOT_NUMBER = stockBalances.LOT_NUMBER;
            stock.SUB_LOT_NUMBER = stockBalances.SUB_LOT_NUMBER;
            stock.PRODUCTION_DATE = stockBalances.PRODUCTION_DATE;
            stock.EXPIRE_DATE = stockBalances.EXPIRE_DATE;
            stock.RECEIVED_DATE = stockBalances.RECEIVED_DATE;
            stock.LABOR_CODE = $.Ctx.NewStockDetail.LABOR_CODE;
            stock.PRODUCT_SPEC = stockBalances.PRODUCT_SPEC;
            stock.SERIAL_NO = stockBalances.SERIAL_NO;
            stock.QUANTITY = qty;
            stock.WEIGHT = weight;


            stockTrans.push(stock);
            console.log('stock data for save');
            console.log(stockTrans);

            //stockBalances.QUANTITY =qty;
            //stockBalances.WEIGHT =weight;

        });
        */
        $.each($.StockCtx.NewStocks,function(i,stock){
            //get ExtNumber
            /*
            $.StockCtx.getExtNumber(stock.DOC_TYPE, stock.TRN_CODE, stock.DOCUMENT_DATE, stock.DOC_NUMBER, function (extNumber) {
                stock.EXT_NUMBER =extNumber;
                stock.QUANTITY =qty;
                stock.WEIGHT=weight;
            });
             */
            stock.QUANTITY =qty;
            stock.WEIGHT=weight;

        });
        $.StockCtx.saveStockTran($.StockCtx.NewStocks, null, function (result) {
            console.log('Save all success');
            $.Ctx.SetPageParam('stock_doc_detail_maintain', 'stockBalances', null);  //clear ค่า StockBalance ที่เลือกมา
            $.Ctx.NavigatePage('stock_doc_detail', { Previous: 'stock_doc_header', Action: 'Add' }, { transition: 'slide' });
        });
    });

    self.find('#delete-footer-btn').click(function (e) {
        var stockDetails =$.Ctx.GetPageParam('stock_doc_detail_maintain', 'stockDetail');
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

//------------------FUCNTION --------------------//


//------------- Lookup Function --------------//
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


