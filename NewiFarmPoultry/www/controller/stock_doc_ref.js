$('#stock_doc_ref').bind('pageinit', function (e) {
    console.log('stock_doc_ref:pageinit')
    var self = $('#stock_doc_ref');

    //register click event
    self.find('a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('stock_doc_ref', 'Previous'), null, { transition: 'slide', reverse: 'true' });
    });

    //register doctype lookup button click event
    self.find('#doctype-btn').click(function (e) {
        searchRefDocType(function (docTypes) {
            if (docTypes !== null) {
                var p = new LookupParam();
                p.title = "Document Type";
                p.calledPage = 'stock_doc_ref';
                p.calledResult = 'selectedDocType';
                p.codeField = 'GDCODE';
                p.nameField = 'DOCNAME';
                p.showCode = true;
                p.dataSource = docTypes;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_ref' , 'msgDocTypeNotFound' ,'Document Type not found'));
            }
        });
    });
});

$('#stock_doc_ref').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('stock_doc_ref');
});

$('#stock_doc_ref').bind('pagebeforehide', function (e) {
    $.StockCtx.PersistPageParam();
});

$('#stock_doc_ref').bind('pagebeforeshow', function (e, ui) {
    console.log('stock_doc_ref:pagebeforeshow')
    var self = $('#stock_doc_ref');

    var prevPage = (typeof ui.prevPage[0] == 'undefined' ? "" : ui.prevPage[0].id);     //ตรวจสอบ page ก่อนหน้า
    if (prevPage == "lookup") {                                                         //ถ้าเป็น lookup ให้รับค่ามาแสดงใน control
        var docType = $.Ctx.GetPageParam('stock_doc_ref', 'selectedDocType');           //ดึงค่าจาก localStorage ของหน้าตัวเอง จาก object selectedDocType
        if (docType.GDCODE == null)
            $('#doctype-btn').text('Choose item');
        else {
            $('#doctype-btn').text(docType.DOCNAME);
            $.StockCtx.getStockTranGroupBy(docType.GDCODE, $.StockCtx.param[0].TRN_CODE, $.StockCtx.DocDate, function (results) {
                populateListView(results);
            });
            //getStockTranByDocTypeGroupBy(docType.GDCODE)
            //getStockTrnByRefDocType(docType.GDCODE);
        }
        $('#doctype-btn').button('refresh');  //refresh ค่าที่ใส่ให้ control
    }

    function populateListView(stockTrns) {
        var lst = $('#stock_doc_ref #stock-doc-list');
        lst.empty();
        var tpl = '<li><a data-doc-number="{0}"><h3>Document No. {1}</h3><p><strong>Update: {2}</strong></p></a></li>';
        $.each(stockTrns, function (i, item) {
            lst.append(tpl.format([item.DOC_NUMBER, item.DOC_NUMBER, item.LAST_UPDATE_DATE]));
        });
        lst.listview('refresh');

        //register click event
        $('#stock_doc_ref #stock-doc-list li a').live('click', function (e) {
            //เลือก list item เพื่อใช้เป็นค่าตั้งต้นของ Doc Header
            console.log('list item click!');

            //var selectedStockDoc = _.where($.Ctx.StockTranList, { DOC_TYPE: selectedDocType.GDCODE, DOC_NUMBER: selectedDocNumber, DOCUMENT_DATE: $.StockCtx.DocDate });

            $.StockCtx.StockMode = 'NEW';
            var trnCtl = $.StockCtx.StockTranControl;
            if (trnCtl[0].CONF_REF_DOC == 'Y') {
                var selectedDocType = $.Ctx.GetPageParam(self.attr('id'), 'selectedDocType');           //ดึงค่าจาก localStorage ของหน้าตัวเอง จาก object selectedDocType
                var selectedDocNumber = $(this).attr('data-doc-number');

                $.StockCtx.NewStocks = new Array();
                $.StockCtx.getMaxDocumentNo($.StockCtx.param[0].DOC_TYPE, $.StockCtx.param[0].TRN_CODE, $.StockCtx.DocDate, function (docNumber) {
                    $.each($.StockCtx.param,function(j,p){
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
                        if (Number(trnCtl[j].STOCK_TYPE) == 1)
                            calType = 1;
                        else
                            calType = -1;

                        stock.TRN_TYPE = trnCtl[j].STOCK_TYPE;
                        stock.CAL_TYPE = calType;



                        $.StockCtx.NewStocks.push(stock);
                    });
                });
                var nextPage ='stock_doc_header';
                //Clear ค่าจาก Lookup ของหน้าที่จะ Naviagate
                $.Ctx.SetPageParam(nextPage, 'selectedWarehouse', null);
                $.Ctx.SetPageParam(nextPage, 'selectedToWarehouse',null);
                $.Ctx.SetPageParam(nextPage, 'selectedCV', null);
                $.Ctx.SetPageParam(nextPage, 'selectedReason', null);
                $.Ctx.SetPageParam(nextPage, 'selectedJob', null);
                $.Ctx.SetPageParam(nextPage, 'selectedShift', null);

                $.StockCtx.getStockDetail(selectedDocType.GDCODE,$.StockCtx.DocDate,selectedDocNumber,function (refDocs) {
                    console.log($.StockCtx.NewStocks);
                    var refStockTran  = _.clone(refDocs);

                    //Set data from Ref Doc to New Stock
                    $.each($.StockCtx.NewStocks,function(i,stock){
                        stock.WAREHOUSE_CODE = refStockTran[0].WAREHOUSE_CODE;
                        stock.SUB_WAREHOUSE_CODE = refStockTran[0].SUB_WAREHOUSE_CODE;
                        stock.WAREHOUSE_DESC = refStockTran[0].WAREHOUSE_DESC;

                        stock.PRODUCT_CODE = refStockTran[0].PRODUCT_CODE;
                        stock.PRODUCT_NAME = refStockTran[0].PRODUCT_NAME;
                        stock.LOT_NUMBER = refStockTran[0].LOT_NUMBER;
                        stock.LOT_DESC = refStockTran[0].LOT_DESC;
                        stock.SUB_LOT_NUMBER = refStockTran[0].SUB_LOT_NUMBER;
                        stock.SUBLOT_DESC = refStockTran[0].SUBLOT_DESC;
                        stock.PRODUCTION_DATE = refStockTran[0].PRODUCTION_DATE;
                        stock.EXPIRE_DATE = refStockTran[0].EXPIRE_DATE;
                        stock.RECEIVED_DATE = refStockTran[0].RECEIVED_DATE;
                        stock.PRODUCT_SPEC = refStockTran[0].PRODUCT_SPEC;
                        stock.SERIAL_NO = refStockTran[0].SERIAL_NO;
                        stock.LABOR_CODE = refStockTran[0].LABOR_CODE;

                        stock.REF_COMPANY =refStockTran[0].COMPANY;
                        stock.REF_OPERATION_CODE =refStockTran[0].OPERATION;
                        stock.REF_SUB_OPERATION =refStockTran[0].SUB_OPERATION;
                        stock.REF_DOC_DATE =refStockTran[0].DOCUMENT_DATE;
                        stock.REF_DOC_TYPE =refStockTran[0].DOC_TYPE;
                        stock.REF_DOC_NO =Number(refStockTran[0].DOC_NUMBER);
                    });

                    $.Ctx.SetPageParam(nextPage, 'refStockTran',refStockTran);
                    $.Ctx.NavigatePage(nextPage, { Previous: 'stock_doc_ref', Action: 'Add' }, { transition: 'slide' });

                });


            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('stock_doc_ref' , 'msgWrongProcess' ,'Wrong process'));
            }
        });
    }

});

//---------------Function ---------------------//
//------------- Lookup Function --------------//
function searchRefDocType(successCB) {
    var nameField = "";
    var cmd = $.Ctx.DbConn.createSelectCommand();
    if ($.Ctx.Lang == "en-US")
        nameField = "ifnull(DESC2, DESC1)";
    else
        nameField = "ifnull(DESC1, DESC2)";
    cmd.sqlText = "SELECT GDCODE,GDTYPE,{0} AS DOCNAME FROM GENERAL_DESC WHERE GDTYPE = 'DCTYP'".format([nameField]);
    cmd.executeReader(function (tx, res) {
        var doctypes = new Array(); //ตัวแปรที่เก็บ model เพื่อไปใช้ในการ show listview
        if (res.rows.length != 0) {

            for (var i = 0; i < res.rows.length; i++) {
                var m = new GENERAL_DESC();
                m.retrieveRdr(res.rows.item(i));
                m.DOCNAME = res.rows.item(i).DOCNAME;
                doctypes.push(m);
            }
        }
        successCB(doctypes);
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
}
