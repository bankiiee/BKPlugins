
$('#stock_main').bind('pageinit', function (e,ui) {
    var self = $('#stock_main');
    console.log('stock_main pageinit');

    //mockup for debug
    //var docType ={DOC_TYPE1:'DCTYP66',TRN_CODE1:'21'}
    //var docType ={DOC_TYPE2:'DCTYP61',TRN_CODE2:'11'}
    //var docType ={DOC_TYPE1:'DCTYP66',TRN_CODE1:'21',DOC_TYPE2:'DCTYP61',TRN_CODE2:'11'}
    //$.Ctx.SetPageParam('stock_main','param',docType);

    var docParam = $.Ctx.GetPageParam('stock_main','param');
    var docType1 = docParam['DOC_TYPE1'];
    var trnCode1 = docParam['TRN_CODE1'];
    var docType2 = docParam['DOC_TYPE2'];
    var trnCode2 = docParam['TRN_CODE2'];

    $.StockCtx.param =new Array();
    if(!_.isUndefined(docType1)){
        $.StockCtx.param.push({DOC_TYPE:docType1,TRN_CODE:trnCode1});
        //$.Ctx.MsgBox('docType1: ' + docType1);
    }
    if(!_.isUndefined(docType2)){
        $.StockCtx.param.push({DOC_TYPE:docType2,TRN_CODE:trnCode2});
    }

    //$.Ctx.DocType= $.StockCtx.param[0].DOC_TYPE;
    //$.Ctx.TrnCode= $.StockCtx.param[0].TRN_CODE;
    //console.log('$.Ctx.DocType:' + $.Ctx.DocType);
    if ($.StockCtx.DocDate == '')
        $.StockCtx.DocDate = $.Ctx.GetLocalDate().toUIShortDateStr(); //set default date


    $('#document-date-fillter').val($.StockCtx.DocDate);
    //register data picker
    /*$('#document-date-fillter', this).mobipick({
        intlStdDate: true
        //, minDate: new XDate($.Ctx.ScheduleDate)   // (new XDate())
    });*/


    //register click event
    $('#stock_main #lnkStockMainBack').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('stock_main', 'Previous'), null, { transition: 'slide', reverse: 'true' });
    });

    self.find('#btnNew').click(function (e) {
        $.StockCtx.StockMode = 'NEW';

        var trnCtl = $.StockCtx.StockTranControl;

        if($.StockCtx.param.length != $.StockCtx.StockTranControl.length){
            var msg ='';
            $.each($.StockCtx.param,function(i,p){
                msg +=' DOC_TYPE: ' + p.DOC_TYPE;
                msg +=' TRN_CODE: ' + p.TRN_CODE + '\n';
            })
            //$.Ctx.MsgBox('Please check Menu parameter with TRN_CONTROL data!!!\n' + msg);
			$.Ctx.MsgBox($.Ctx.Lcl('stock_main', 'msgCheckParam', 'Please check Menu parameter with TRN_CONTROL data!!!\n {0}').format([msg]), null, $.Ctx.Lcl('iFarm', 'MsgAlert', "Alert"), $.Ctx.Lcl('iFarm', 'MsgOk', "OK"));
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

                        if (Number(trnCtl[i].STOCK_TYPE) == 1) //STOCK TYPE:1 =รับ,2 =จ่าย
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



$('#stock_main').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('stock_main');
    $.Ctx.RenderFooter('stock_main');
});

$('#stock_main').bind('pagebeforehide', function (e) {
    $.StockCtx.PersistPageParam();
});

$('#stock_main').bind('pagebeforeshow', function (e) {
    var self = $('#stock_main');

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
    var lst = $('#stock_main #stock-doc-list');
    lst.empty();
    lst.append('<li data-role="list-divider"><span data-lang="lblWaiting">Waiting Sync</span> <span class="ui-li-count">' + stockTrns.length + '</span></li>')
    var tpl = '<li><a id="{0}"><h3>Document No. {1}</h3><p><strong>Update: {2}</strong></p></a></li>';
    $.each(stockTrns, function (i, item) {
        lst.append(tpl.format([i,item.DOC_NUMBER, item.LAST_UPDATE_DATE]));
    });

    $.Ctx.SetPageParam('stock_main','stockTrans',stockTrns);
    lst.listview('refresh');

    //register click event
    $('#stock_main #stock-doc-list li a').bind('click', function (e) {
        e.preventDefault();

        $.StockCtx.StockMode = 'EDIT';
        var idx =$(this).attr('id');
        var stockTrans =$.Ctx.GetPageParam('stock_main','stockTrans');

        //กรณีที่มี DocType แค่ตัวเดียว
        if($.StockCtx.param.length ==1){
            $.StockCtx.getStockDetail($.StockCtx.param[0].DOC_TYPE,$.StockCtx.DocDate,stockTrans[idx].DOC_NUMBER,function (stock) {
                $.StockCtx.StockTranSelected = new Array();
                $.StockCtx.StockTranSelected =stock;

                console.log($.StockCtx.StockTranSelected);
                var trnCtl = $.StockCtx.StockTranControl;
                if (trnCtl[0].CONF_HEADER == 'Y') {
                    $.Ctx.NavigatePage('stock_doc_header', { Previous: 'stock_main', Action: 'View' }, { transition: 'slide' });
                }
                else {
                    if (trnCtl[0].CONF_DETAIL == 'Y') {
                        $.Ctx.NavigatePage('stock_doc_detail', { Previous:'stock_main', Action: 'View' }, { transition: 'slide' });
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
                    $.Ctx.NavigatePage('stock_doc_header', { Previous: 'stock_main', Action: 'View' }, { transition: 'slide' });
                }
                else {
                    if (trnCtl[0].CONF_DETAIL == 'Y') {
                        $.Ctx.NavigatePage('stock_doc_detail', { Previous:'stock_main', Action: 'View' }, { transition: 'slide' });
                    }
                }
            });
        }

    });
}



