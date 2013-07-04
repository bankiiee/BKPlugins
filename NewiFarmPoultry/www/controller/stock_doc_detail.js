
$('#stock_doc_detail').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('stock_doc_detail');
});

$('#stock_doc_detail').bind('pageinit', function (e) {
    console.log('stock_doc_detail:pageinit');
    var self = $('#stock_doc_detail');

    //register back button click event
    self.find('a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('stock_doc_detail', 'Previous'), null, { transition: 'slide', reverse: 'true' });
    });

    //register add button click event
    self.find('#btnAdd').click(function (e) {
        //สร้าง StockDetail จาก StockHeader และ หาค่า EXT_NUMBER

        $.each($.StockCtx.NewStocks, function (i, stock) {
            $.StockCtx.getExtNumber(stock.DOC_TYPE, stock.TRN_CODE, stock.DOCUMENT_DATE, stock.DOC_NUMBER, function (extNumber) {
                console.log('DOC_NO:' + stock.DOC_NUMBER + ',EXT_NUMBER:' + extNumber);
                stock.EXT_NUMBER = extNumber;

                stock.PRODUCT_CODE = null;
                stock.PRODUCT_NAME = null;
                stock.LOT_NUMBER = null;
                stock.LOT_DESC = null;
                stock.SUB_LOT_NUMBER = null;
                stock.SUBLOT_DESC = null;

                stock.PRODUCTION_DATE = null;
                stock.EXPIRE_DATE = null;
                stock.RECEIVED_DATE = null;

                stock.QUANTITY = 0;
                stock.WEIGHT = 0;
            });

        });
        console.log($.StockCtx.NewStocks);
        //clear ค่า criteria ของหน้า stock_doc_detail_check ก่อนจะได้ไม่แสดงค่าที่เก่า
        var stockCriteria = new S1_ST_STOCK_TRN();

        //ถ้า stock_type =2
        var trnCtl = $.StockCtx.StockTranControl;
        if (Number(trnCtl[0].STOCK_TYPE) == 1) //STOCK TYPE:1 =รับ,2 =จ่าย
        {
        //ถ้าเป็น ขารับ ให้ไปหน้ากรอกรายละเอียดการรับ
            $.Ctx.SetPageParam('stock_doc_detail_receive', 'stockCriteria', stockCriteria);
            $.Ctx.NavigatePage('stock_doc_detail_receive', { Previous: self.attr('id'), Action: 'Add' }, { transition: 'slide' });
        }
        else {
            //ถ้าเป็น ขาจ่าย ให้ไป check stock avaliable
            $.Ctx.SetPageParam('stock_doc_detail_check', 'stockCriteria', stockCriteria);
            $.Ctx.NavigatePage('stock_doc_detail_check', { Previous: self.attr('id'), Action: 'Add' }, { transition: 'slide' });
        }
    });

    self.find('#save-footer-btn').click(function (e) {
        console.log('begin save');

        var newStockFromRef = new Array();
        var trnCtl = $.StockCtx.StockTranControl;
        if (trnCtl[0].CONF_REF_DOC == 'Y') {
            var refStockTran = $.Ctx.GetPageParam('stock_doc_detail', 'refStockTran');
            if (!_.isNull(refStockTran)) {
                $.each($.StockCtx.NewStocks, function (j, stock) {
                    $.each(refStockTran, function (i, refdoc) {
                        var s = new S1_ST_STOCK_TRN();
                        s = _.clone(stock);
                        s.EXT_NUMBER = refdoc.EXT_NUMBER;
                        s.WEIGHT = refdoc.WEIGHT;
                        s.QUANTITY = refdoc.QUANTITY;

                        newStockFromRef.push(s);
                    });
                });
            }
        }
        console.log(newStockFromRef);

        $.StockCtx.saveStockTran(newStockFromRef, null, function (result) {
            console.log('Save all success');
            $.Ctx.NavigatePage('stock_main', { Previous: $.Ctx.GetPageParam('stock_main', 'Previous'), Action: 'Add' }, { transition: 'slide' });
        });


        //get stock balance เพื่อส่งให้ save method ตัด stock
        //set ค่าให้ model เพื่อนำไป save

        //Get Max Document No
        /*
        $.StockCtx.getMaxDocumentNo($.Ctx.DocType, $.Ctx.TrnCode, $.Ctx.DocDate,function(docNumber){

        var calType = null;
        var trnCtl = $.StockCtx.StockTranControl;
        if (Number(trnCtl[0].STOCK_TYPE) == 1)
        calType = 1;
        else
        calType = -1;

        var stock = new S1_ST_STOCK_TRN();
        stock = $.Ctx.NewStockHeader;
        stock.DOCUMENT_DATE = $.Ctx.DocDate;
        stock.DOC_TYPE = $.Ctx.DocType;
        stock.DOC_NUMBER =docNumber;
        stock.EXT_NUMBER=1;
        stock.TRN_CODE = $.Ctx.TrnCode;
        stock.TRN_TYPE = trnCtl[0].STOCK_TYPE;
        stock.CAL_TYPE = calType;

        //console.log(stock);
        var stockTrans = new Array();
        stockTrans.push(stock);

        var refStockTran = $.Ctx.GetPageParam('stock_doc_detail', 'refStockTran');
        console.log('refStockTran');
        console.log(refStockTran);

        $.StockCtx.saveStockTran( stockTrans, refStockTran, function (result) {
        console.log('Save all success');
        $.Ctx.NavigatePage('stock_doc_detail', { Previous:$.Ctx.GetPageParam('stock_doc_detail','Previous'), Action: 'Add' }, { transition: 'slide' });
        });
        });
        */
    });

    self.find('#menu-footer-btn').click(function (e) {
        console.log('menu click.');
        $.Ctx.SetPageParam('stock_doc_detail', 'stockDetail', null);
        $.Ctx.NavigatePage('stock_main', { Previous: $.Ctx.GetPageParam('stock_main', 'Previous'), Action: 'Add' }, { transition: 'slide' });
    });

    self.find('#trash-footer-btn').click(function (e) {
        var stockTrans = new Array();
        $.each($('#stock-doc-detail-list .ui-checkbox-on'), function (i, item) {
            /*
            var idx = $(item).attr('data-idx');
            var stockDetail =$.Ctx.GetPageParam('stock_doc_detail', 'stockDetail');
            console.log(stockDetail[idx]);
            //add stock detail for delete.
            stockTrans.push(stockDetail[idx]);
            */

            var extNumber = Number($(item).attr('data-idx'));
            $.each($.StockCtx.param, function (i, p) {
                var selectedDoc = _.where($.StockCtx.StockTranSelected, { DOC_TYPE: p.DOC_TYPE, EXT_NUMBER: extNumber });
                $.each(selectedDoc, function (i, doc) {
                    stockTrans.push(doc);
                });

            });


        });
        if (stockTrans.length == 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_detail', 'msgPlzSelectData', 'Please choose data before delete.'));
            return false;
        }
        $.StockCtx.deleteStockTran(stockTrans, function (result) {


            var docType = stockTrans[0].DOC_TYPE;
            var tnCode = stockTrans[0].TRN_CODE;
            var docDate = stockTrans[0].DOCUMENT_DATE;
            var docNumber = stockTrans[0].DOC_NUMBER;

            $.Ctx.SetPageParam('stock_doc_detail', 'stockDetail', null); //clear local page data.
            $.StockCtx.getStockDetail(docType, docDate, docNumber, function (stockDetails) {
                if (stockDetails.length == 0) {
                    console.log('0 record!!');
                    $.Ctx.NavigatePage('stock_main', { Previous: $.Ctx.GetPageParam('stock_main', 'Previous'), Action: 'View' }, { transition: 'slide' });
                }
                else {
                    populateListView4Delete(stockDetails);
                    $.Ctx.SetPageParam('stock_doc_detail', 'stockDetail', stockDetails);
                }

            });
        });
    });
    //get panel config for show or hide
});

$('#stock_doc_detail').bind('pagebeforehide', function (e) {
    $.StockCtx.PersistPageParam();
});

$('#stock_doc_detail').bind('pagebeforeshow', function (e) {
    console.log('stock_doc_detail:pagebeforeshow');
    console.log($.StockCtx.NewStocks);



    var docType ,tnCode,docDate,docNumber;
    switch ($.StockCtx.StockMode) {
        case 'NEW':
            var trnCtl = $.StockCtx.StockTranControl;
            if (trnCtl[0].CONF_REF_DOC == 'Y') {
                var refStockTran = $.Ctx.GetPageParam('stock_doc_detail', 'refStockTran');
                //ใช้ค่าของ Array ตัวแรกในการหา Detail
                docType = refStockTran[0].DOC_TYPE;
                tnCode = refStockTran[0].TRN_CODE;
                docDate = refStockTran[0].DOCUMENT_DATE;
                docNumber = refStockTran[0].DOC_NUMBER;
            }
            else{
                if (trnCtl[0].CONF_HEADER == 'Y') {
                    //ใช้ค่าของ Array ตัวแรกในการหา Detail
                    docType = $.StockCtx.NewStocks[0].DOC_TYPE;
                    tnCode = $.StockCtx.NewStocks[0].TRN_CODE;
                    docDate = $.StockCtx.NewStocks[0].DOCUMENT_DATE;
                    docNumber = $.StockCtx.NewStocks[0].DOC_NUMBER;
                }
            }
            $.StockCtx.getStockDetail(docType,docDate, docNumber, function (results) {
                populateListView(results);
                $.Ctx.SetPageParam('stock_doc_detail', 'stockDetail', results);
            });
            break;
        case 'EDIT':
            //ต้องใช้ ขาเบิกเป็นตัวตั้งต้น
            var issueDoc = _.where($.StockCtx.StockTranSelected,{DOC_TYPE:$.StockCtx.param[0].DOC_TYPE});
            docType = issueDoc[0].DOC_TYPE;
            tnCode = issueDoc[0].TRN_CODE;
            docDate = issueDoc[0].DOCUMENT_DATE;
            docNumber = issueDoc[0].DOC_NUMBER;

            $.StockCtx.getStockDetail(docType, docDate, docNumber, function (stockDetails) {
                populateListView4Delete(stockDetails);
                $.Ctx.SetPageParam('stock_doc_detail', 'stockDetail', stockDetails);
            });
            break;
    }

    function populateListView(stockTrns) {
        var lst = $('#stock_doc_detail #stock-doc-detail-list');
        lst.empty();

        var tpl = '<li><h3><span>{0}</span></h3><p>{1}</p>' +
                    '<p><span>Quantity: {2}</span><span>Weight: {3}</span></p>' +
                    '</li>';
        $.each(stockTrns, function (i, item) {
            lst.append(tpl.format([ item.PRODUCT_NAME,item.PRODUCT_CODE, item.QUANTITY, item.WEIGHT]));
        });
        lst.listview('refresh');
        /*
        $('#stock_doc_detail #stock-doc-detail-list li a').live('click', function (e) {
            //var stockTrns = $.Ctx.GetPageParam(self.attr('id'), 'stock_trn_list');
            //หา list ที่เลือกจาก Element Attribute
            var idx = $(this).attr('id');
            var stockDetail =$.Ctx.GetPageParam('stock_doc_detail', 'stockDetail');
            //console.log(stockDetail[idx]);
            //console.log($.StockCtx.NewStocks);

            $.Ctx.SetPageParam('stock_doc_detail_maintain','stockDetail',stockDetail[idx]);

            $.Ctx.NavigatePage('stock_doc_detail_maintain', { Previous: 'stock_doc_detail', Action: 'Edit' }, { transition: 'slide' });
        });
        */
    }

});

$('#stock_doc_detail').bind('pageshow', function (e) {

    switch ($.StockCtx.StockMode) {
        case 'NEW':
            var trnCtl = $.StockCtx.StockTranControl;
            if (trnCtl[0].CONF_REF_DOC == 'Y') {

                $('#stock_doc_detail #btnAdd').hide();
                $('#stock_doc_detail #menu-footer-btn').show();
                $('#stock_doc_detail #save-footer-btn').show();
                $('#stock_doc_detail #trash-footer-btn').hide();
            }
            else{
                if (trnCtl[0].CONF_HEADER == 'Y') {
                    $('#stock_doc_detail #btnAdd').show();
                    $('#stock_doc_detail #menu-footer-btn').show();
                    $('#stock_doc_detail #save-footer-btn').hide();
                    $('#stock_doc_detail #trash-footer-btn').hide();
                }
            }
            break;

        case 'EDIT':
            $('#stock_doc_detail #btnAdd').hide();
            $('#stock_doc_detail #menu-footer-btn').show();
            $('#stock_doc_detail #save-footer-btn').hide();
            $('#stock_doc_detail #trash-footer-btn').show();
            break;
    }
});

//--------------- FUCNTION
function populateListView4Delete(stockDetails){

    var lst = $('#stock_doc_detail #stock-doc-detail-list');
    lst.empty();

    var tpl = '<li><div class="clickable" id="{0}" style="cursor: pointer"><h3><span>{1}</span></h3><p>{2}</p>' +
        '<p><span>Ext : {3}/{4}</span><span>Quantity: {5}</span>&nbsp;&nbsp;&nbsp;<span>Weight: {6}</span></p></div>' +
        '<div style="float:right;margin-top: -1em; width:10%; " >'+
        '<fieldset data-role="controlgroup" data-type="horizontal" style="float: right;margin: -0.5em;margin-top: -1.7em;">'+
        '<label for="chk{7}"  data-idx="{8}">Select</label>'+
        '<input type="checkbox" id="chk{9}" data-mini="true"/>'+
        '</fieldset></div>'+
        '</li>';
    $.each(stockDetails, function (i, item) {
        lst.append(tpl.format([item.EXT_NUMBER, item.PRODUCT_NAME, item.PRODUCT_CODE,item.DOC_TYPE,item.EXT_NUMBER , item.QUANTITY, item.WEIGHT,i,item.EXT_NUMBER,i]));
    });
    lst.listview('refresh');
    lst.trigger('create');

    $('div.clickable').bind('click',function(e){
        var extNumber =Number($(this).attr('id'));
        var stockDetails = new Array();
        $.each($.StockCtx.param,function(i,p){
            var selectedDoc = _.where($.StockCtx.StockTranSelected,{DOC_TYPE:p.DOC_TYPE,EXT_NUMBER:extNumber});
            console.log(selectedDoc);
            $.each(selectedDoc,function(i,doc){
                stockDetails.push(doc);
            });

        });

        $.Ctx.SetPageParam('stock_doc_detail_maintain', 'stockDetail',stockDetails);
        $.Ctx.NavigatePage('stock_doc_detail_maintain', { Previous: 'stock_doc_detail', Action: 'View' }, { transition: 'slide' });

        /*
        var stockDetail =$.Ctx.GetPageParam('stock_doc_detail', 'stockDetail');
        console.log('stockDetail');
        console.log(stockDetail);
        console.log('stockDetail[idx]');
        console.log(stockDetail[idx]);
        $.Ctx.SetPageParam('stock_doc_detail_maintain', 'stockDetail',stockDetail[idx]);
        $.Ctx.NavigatePage('stock_doc_detail_maintain', { Previous: 'stock_doc_detail', Action: 'View' }, { transition: 'slide' });
        */
    });


}

