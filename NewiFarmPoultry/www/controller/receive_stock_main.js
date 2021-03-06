﻿
$('#receive_stock_main').bind('pageinit', function (e,ui) {
    var self = $('#receive_stock_main');
    console.log('receive_stock_main pageinit');

    //mockup for debug
    var docType ={DOC_TYPE1:'DCTYP92',TRN_CODE1:'21'}
    $.Ctx.SetPageParam('receive_stock_main','param',docType);


    var docParam = $.Ctx.GetPageParam('receive_stock_main','param');
    var docType1 = docParam['DOC_TYPE1'];
    var trnCode1 = docParam['TRN_CODE1'];

    $.StockCtx.param =new Array();
    if(!_.isUndefined(docType1)){
        $.StockCtx.param.push({DOC_TYPE:docType1,TRN_CODE:trnCode1});
        $.Ctx.MsgBox('docType1: ' + docType1);
    }

    //$.Ctx.DocType= $.StockCtx.param[0].DOC_TYPE;
    //$.Ctx.TrnCode= $.StockCtx.param[0].TRN_CODE;
    //console.log('$.Ctx.DocType:' + $.Ctx.DocType);
    if ($.StockCtx.DocDate == '')
        $.StockCtx.DocDate = $.Ctx.GetLocalDate().toUIShortDateStr(); //set default date


    $('#document-date-fillter').val($.StockCtx.DocDate);
    //register data picker
    $('#document-date-fillter', this).mobipick({
        intlStdDate: true
        //, minDate: new XDate($.Ctx.ScheduleDate)   // (new XDate())
    });


    //register click event
    $('#receive_stock_main #lnkStockMainBack').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('receive_stock_main', 'Previous'), null, { transition: 'slide', reverse: 'true' });
    });

    self.find('#btnNew').click(function (e) {
        $.StockCtx.StockMode = 'NEW';

        var trnCtl = $.StockCtx.StockTranControl;
        if(_.isNull(trnCtl)){
            $.Ctx.MsgBox('Not found data in TRN_CONTROL table.\n DOC_TYPE: ' + $.StockCtx.param[0].DOC_TYPE);
            return false;
        }
        if(_.isNull(trnCtl[0].CONF_REF_DOC)){
            $.Ctx.MsgBox('CONF_REF_DOC value can not null');
            return  false;
        }
        if(_.isNull(trnCtl[0].CONF_HEADER)){
            $.Ctx.MsgBox('CONF_HEADER value can not null');
            return  false;
        }
        if(_.isNull(trnCtl[0].CONF_DETAIL)){
            $.Ctx.MsgBox('CONF_HEADER value can not null');
            return  false;
        }

        if (trnCtl[0].CONF_REF_DOC == 'Y') {
            $.Ctx.NavigatePage('stock_doc_ref', { Previous: self.attr('id'), Action: 'View' }, { transition: 'slide' });
        }
        else {
            if (trnCtl[0].CONF_HEADER == 'Y') {
                $.StockCtx.NewStocks = new Array();
                $.StockCtx.DocDate = parseUIDateStr($('#document-date-fillter').val()).toDbDateStr();
                var nextPage ='stock_doc_header';

                $.StockCtx.getMaxDocumentNo($.StockCtx.param[0].DOC_TYPE, $.StockCtx.param[0].TRN_CODE, $.StockCtx.DocDate, function (docNumber) {
                    //create stock doc ตาม จำนวน doc ที่มาจาก menu
                    $.each($.StockCtx.param,function(i,p){
                        var stock  = new S1_ST_STOCK_TRN();
                        stock.COMPANY = $.Ctx.ComCode;
                        stock.OPERATION = $.Ctx.Op;
                        stock.SUB_OPERATION = $.Ctx.SubOp;
                        stock.BUSINESS_UNIT = $.Ctx.Bu;
                        stock.DOC_TYPE = p.DOC_TYPE;
                        stock.TRN_CODE =  p.TRN_CODE;
                        stock.DOC_NUMBER =docNumber;
                        stock.DOCUMENT_DATE = $.StockCtx.DocDate;

                        var calType = null;
                        var trnCtl = $.StockCtx.StockTranControl;
                        if (Number(trnCtl[i].STOCK_TYPE) == 1)
                            calType = 1;
                        else
                            calType = -1;

                        stock.TRN_TYPE = trnCtl[i].STOCK_TYPE;
                        stock.CAL_TYPE = calType;
                        $.StockCtx.NewStocks.push(stock);
                    });

                    //clear Lookup data in next page.
                    $.Ctx.SetPageParam(nextPage, 'refStockTran',null);
                    $.Ctx.SetPageParam(nextPage, 'selectedWarehouse', null);
                    $.Ctx.SetPageParam(nextPage, 'selectedToWarehouse',null);
                    $.Ctx.SetPageParam(nextPage, 'selectedCV', null);
                    $.Ctx.SetPageParam(nextPage, 'selectedReason', null);
                    $.Ctx.SetPageParam(nextPage, 'selectedJob', null);
                    $.Ctx.SetPageParam(nextPage, 'selectedShift', null);
                    $.Ctx.NavigatePage(nextPage, { Previous: self.attr('id'), Action: 'Add' }, { transition: 'slide' });
                });
            }
            else {
                if (trnCtl[0].CONF_DETAIL == 'Y') {
                    $.Ctx.NavigatePage('stock_doc_detail', { Previous: self.attr('id'), Action: 'View' }, { transition: 'slide' });
                }
            }
        }
    });

    //ดึงค่าตาม document date เปลี่ยน
    self.find('#document-date-fillter').change(function () {
        getStockTranByDate();
    });
});



$('#receive_stock_main').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('receive_stock_main');
    $.Ctx.RenderFooter('receive_stock_main');
});

$('#receive_stock_main').bind('pagebeforehide', function (e) {
    $.StockCtx.PersistPageParam();
});

$('#receive_stock_main').bind('pagebeforeshow', function (e) {
    var self = $('#receive_stock_main');

    //ดึง Config จาก Table TRN_CONTROL
    $.StockCtx.StockTranControl =new Array()
    $.each($.StockCtx.param,function(i,p){
        $.StockCtx.getTranControl(p.DOC_TYPE, p.TRN_CODE, function (results) {
            if(!_.isNull(results))
                $.StockCtx.StockTranControl.push(results[0]);
        });
    });



    console.log('$.StockCtx.StockTranControl');
    console.log($.StockCtx.StockTranControl);


    //ดึงค่า Categories เพื่อไปใช้ในการ show /hide control ในส่วน Header และ Detail
    $.StockCtx.getCatagoryConfig($.Ctx.Bu, $.StockCtx.param[0].DOC_TYPE, function (results) {
        $.StockCtx.CatagoryConfig =new Array()
        $.StockCtx.CatagoryConfig = results;
        console.log('$.StockCtx.CatagoryConfig');
        console.log($.StockCtx.CatagoryConfig);

    });
    getStockTranByDate();
});

//---------------Function ---------------------//
function getStockTranByDate(){
    //ดึงค่า Stock Tran ที่ค้างอยู่ตาม default date
    $.StockCtx.DocDate = parseUIDateStr($('#document-date-fillter').val()).toDbDateStr(); //แปลงค่าวันที่จาก Text เพื่อให้อยู่ในรูปแบบ json
    console.log('Doc Date: ' +$.StockCtx.DocDate);
    $.StockCtx.getStockTranGroupBy($.StockCtx.param[0].DOC_TYPE,$.StockCtx.param[0].TRN_CODE,$.StockCtx.DocDate,function (results) {
        populateStockTranListView(results);
    });
    /*
    $.StockCtx.getAllStockTran($.StockCtx.param[0].DOC_TYPE,$.StockCtx.param[0].TRN_CODE,$.StockCtx.DocDate,function (results) {
        populateStockTranListView(results);
    });

    */

}

function populateStockTranListView(stockTrns) {
    var lst = $('#receive_stock_main #stock-doc-list');
    lst.empty();
    lst.append('<li data-role="list-divider">Waiting Sync <span class="ui-li-count">' + stockTrns.length + '</span></li>')
    var tpl = '<li><a id="{0}"><h3>Document No. {1}</h3><p><strong>Update: {2}</strong></p></a></li>';
    $.each(stockTrns, function (i, item) {
        lst.append(tpl.format([i,item.DOC_NUMBER, item.LAST_UPDATE_DATE]));
    });

    $.Ctx.SetPageParam('receive_stock_main','stockTrans',stockTrns);
    lst.listview('refresh');

    //register click event
    $('#receive_stock_main #stock-doc-list li a').bind('click', function (e) {
        e.preventDefault();

        $.StockCtx.StockMode = 'EDIT';
        var idx =$(this).attr('id');
        var stockTrans =$.Ctx.GetPageParam('receive_stock_main','stockTrans');

        //กรณีที่มี DocType แค่ตัวเดียว
        if($.StockCtx.param.length ==1){
            $.StockCtx.getStockDetail($.StockCtx.param[0].DOC_TYPE,$.StockCtx.DocDate,stockTrans[idx].DOC_NUMBER,function (stock) {
                $.StockCtx.StockTranSelected = new Array();
                $.StockCtx.StockTranSelected =stock;

                console.log($.StockCtx.StockTranSelected);
                var trnCtl = $.StockCtx.StockTranControl;
                if (trnCtl[0].CONF_HEADER == 'Y') {
                    $.Ctx.NavigatePage('stock_doc_header', { Previous: 'receive_stock_main', Action: 'View' }, { transition: 'slide' });
                }
                else {
                    if (trnCtl[0].CONF_DETAIL == 'Y') {
                        $.Ctx.NavigatePage('stock_doc_detail', { Previous:'receive_stock_main', Action: 'View' }, { transition: 'slide' });
                    }
                }
            });
        }else{
            $.StockCtx.getMultiStockByDocType($.StockCtx.param,$.StockCtx.DocDate,stockTrans[idx].DOC_NUMBER,function (stock) {
                $.StockCtx.StockTranSelected = new Array();
                $.StockCtx.StockTranSelected =stock;

                console.log('$.StockCtx.StockTranSelected');
                console.log($.StockCtx.StockTranSelected);
                var trnCtl = $.StockCtx.StockTranControl;
                if (trnCtl[0].CONF_HEADER == 'Y') {
                    $.Ctx.NavigatePage('stock_doc_header', { Previous: 'receive_stock_main', Action: 'View' }, { transition: 'slide' });
                }
                else {
                    if (trnCtl[0].CONF_DETAIL == 'Y') {
                        $.Ctx.NavigatePage('stock_doc_detail', { Previous:'receive_stock_main', Action: 'View' }, { transition: 'slide' });
                    }
                }
            });
        }

    });
}



