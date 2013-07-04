var clickAlias = "click";
var docTypeMat = "DCTYP65";
var DEF_STK_LOC = "CENTER", DEF_ENTRY_TYP = "1";
var PM_STK_TYPE_KEY = "product_stock_type",
	PM_DOC_TYPE_KEY = "document_type",
	PM_STK_LOC_KEY = "stock_location",
	PM_STK_CAL_TYPE_KEY = "cal_type",
	PM_TRAN_TYPE_KEY = "transaction_type",
	PM_TRAN_COD_KEY = "transaction_code";
var PM_TO_FARM_TRAN_TYPE_KEY = "to_farm_transaction_type";
//var docTypeMat = $.Ctx.GetPageParam('transfer_feed_trans', 'param')[PM_DOC_TYPE_KEY];

          $.Ctx.SetPageParam('transfer_feed_list', 'param', { "product_stock_type": "10", "transaction_type": "2", "transaction_code": "42", "document_type": "63", "cal_type": "1", "stock_location": "FARM", "captionHeader": "HeaderFeedTransfer" ,"to_farm_transaction_type":"1"});
//           $.Ctx.SetPageParam('transfer_feed_trans', 'Mode' , 'Create');

$("#transfer_feed_trans").bind("pageinit", function (event) {

    var pParam = $.Ctx.GetPageParam('transfer_feed_list', 'param');
    try {
        $("#transfer_feed_trans #captionHeader").text($.Ctx.Lcl('transfer_feed_trans', pParam['captionHeader'], 'Transfer Feed'));
    } catch (e) {
        $("#transfer_feed_trans #captionHeader").text($.Ctx.Lcl('transfer_feed_trans', 'captionHeader', 'Transfer Feed'));
    }

    $('#transfer_feed_trans #btnSave').bind(clickAlias, function () {
        SaveMatMove(function (ret) {
            if (ret == true) {
                if ($.Ctx.GetPageParam('transfer_feed_trans', 'Mode') == "Create")
                    ClearAfterSave();
                $.Ctx.MsgBox($.Ctx.Lcl('transfer_feed_trans', 'MsgSaveComplete', 'Save Completed.'));

            }
        });
        return false;
    });



    $('#transfer_feed_trans #lpFarmOrg').bind(clickAlias, function () {
        $.Ctx.SetPageParam('transfer_feed_trans', 'ScrollingTo', $(window).scrollTop());
        var pParam = $.Ctx.GetPageParam('transfer_feed_list', 'param');
        var stkLoc = null;
        try {
            stkLoc = pParam[PM_STK_LOC_KEY];
        } catch (e) {//Set Default
            stkLoc = DEF_STK_LOC;
        }
        $.FarmCtx.SearchFarmOrgUsingMapMobile(function (orgs) {
            if (orgs !== null) {
                var p = new LookupParam();
                p.title = stkLoc == 'FARM' ? $.Ctx.Lcl('transfer_feed_trans', 'MsgFarmMng', 'Farm Manage') : $.Ctx.Lcl('transfer_feed_trans', 'MsgFarmCnt', 'Farm Center');
                p.calledPage = 'transfer_feed_trans';
                p.calledResult = 'selectedFarmOrg';
                p.codeField = 'CODE';
                p.nameField = 'NAME';
                p.showCode = true;
                p.dataSource = orgs;

                $.Ctx.SetPageParam('transfer_feed_trans', 'FarmOrgListInHusbandry', orgs); 

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('transfer_feed_trans', 'msgFarmOrgNoFod', 'Farm org not found.'));
            }
        });
    });

    $('#transfer_feed_trans #lpProduct').bind(clickAlias, function () {
        $.Ctx.SetPageParam('transfer_feed_trans', 'ScrollingTo', $(window).scrollTop());
        var pParam = $.Ctx.GetPageParam('purchase_mat_list', 'param');

        var selectFarmOrg = $.Ctx.GetPageParam('transfer_feed_trans', 'selectedFarmOrg')
        if (selectFarmOrg == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('transfer_feed_trans', 'pleaseSelectFarmOrg', 'Please select Farmorg'));
            return false;
        }

        var stkType = null;
        try {	//{"STK_TYPE":"10"}
            stkType = pParam[PM_STK_TYPE_KEY];
        } catch (e) {//Set Default
            stkType = "10";
        }
        var stkT = stkType.split('|');
        SearchProduct(stkT, function (prods) {
            if (prods !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('transfer_feed_trans', 'MsgProducts', 'Products');
                p.calledPage = 'transfer_feed_trans';
                p.calledResult = 'selectedProduct';
                p.codeField = 'PRODUCT_CODE';
                p.nameField = 'PRODUCT_NAME';
                p.showCode = true;
                p.dataSource = prods;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('transfer_feed_trans', 'msgProductNoFod', 'Product not found.'));
            }
        });
    });

    $('#transfer_feed_trans #lpToFarmOrg').bind(clickAlias, function () {
        $.Ctx.SetPageParam('transfer_feed_trans', 'ScrollingTo', $(window).scrollTop());
        var pParam = $.Ctx.GetPageParam('transfer_feed_list', 'param');
        var stkLoc = null;
        try {
            stkLoc = pParam[PM_STK_LOC_KEY];
        } catch (e) {//Set Default
            stkLoc = DEF_STK_LOC;
        }
        //See All Farm
        findFarmOrg(function (orgs) {
            if (orgs !== null) {
                var p = new LookupParam();
                p.title = stkLoc == 'FARM' ? $.Ctx.Lcl('transfer_feed_trans', 'MsgFarmMng', 'Farm Manage') : $.Ctx.Lcl('transfer_feed_trans', 'MsgFarmCnt', 'Farm Center');
                p.calledPage = 'transfer_feed_trans';
                p.calledResult = 'selectedToFarmOrg';
                p.codeField = 'CODE';
                p.nameField = 'NAME';
                p.showCode = true;
                p.dataSource = orgs;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('transfer_feed_trans', 'msgFarmOrgNoFod', 'Farm org not found.'));
            }
        });
    });
    $('#transfer_feed_trans #btnBack').bind('click', function () {
        //Check Dirty
        var dirty = false;
        var mode = $.Ctx.GetPageParam('transfer_feed_trans', 'Mode');
        var model = $.Ctx.GetPageParam('transfer_feed_trans', 'Data');
        if (mode == 'Create' && model !== null && Object.keys(model).length > 0) {
            dirty = true;
        }
        var isExit = true;
        /*if (dirty==true){
        isExit = confirm($.Ctx.Lcl('transfer_feed_trans', 'msgConfirmExit', 'Data is Dirty, Exit?'));
        }else{
        isExit=true;
        }*/
        if (isExit == true) {
            $.Ctx.NavigatePage($.Ctx.GetPageParam('transfer_feed_trans', 'Previous'),
			null,
			{ transition: 'slide', reverse: true });
        }
        return false;
    });

    $('#transfer_feed_trans input[type="number"]').focusout(function () {
        var qtyStr = $(this).val();
        //$(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
    });

    $('#transfer_feed_trans #txtqty').focusout(function () {
        var qtyStr = $(this).val();
        $(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
        var model = $.Ctx.GetPageParam('transfer_feed_trans', 'Data');
        if (model == null || typeof model.STOCK_KEEPING_UNIT == 'undefined' || model.STOCK_KEEPING_UNIT == null) return false;
        FocusoutCal();
    });

    $('#transfer_feed_trans #txtWeight').focusout(function () {
        var model = $.Ctx.GetPageParam('transfer_feed_trans', 'Data');
        if (model == null || typeof model.STOCK_KEEPING_UNIT == 'undefined' || model.STOCK_KEEPING_UNIT == null) return false;
        FocusoutCal();
    });

});

function FocusoutCal() {
    var model = $.Ctx.GetPageParam('transfer_feed_trans', 'Data');
    model.QTY = Number($('#transfer_feed_trans #txtqty').val());
    model.WGH = Number($('#transfer_feed_trans #txtWeight').val());

    var unitPackStr = (typeof model.UNIT_PACK == 'undefined' || model.UNIT_PACK == null ? 1 : model.UNIT_PACK);

    if (model.QTY > 0 && Number(unitPackStr) > 0) {
        if (model.STOCK_KEEPING_UNIT == "Q") {
            model.WGH = model.QTY * Number(unitPackStr);
        } else {
            model.QTY = 0;
        }
    }
    else if (model.QTY == '') {
        model.WGH = 0;
    }

    Model2ControlPur();
}

$("#transfer_feed_trans").bind("pagebeforehide", function (event, ui) {
    var model = $.Ctx.GetPageParam('transfer_feed_trans', 'Data');
    if (model == null) {
        model = {};
        $.Ctx.SetPageParam('transfer_feed_trans', 'Data', model);
    }
    
    model.QTY = Number($('#transfer_feed_trans #txtqty').val());
    model.WGH = Number($('#transfer_feed_trans #txtWeight').val());
});

$('#transfer_feed_trans').bind("pagebeforecreate", function (e) {
    $.Util.RenderUiLang('transfer_feed_trans');
    $.Ctx.RenderFooter('transfer_feed_trans');
});

$("#transfer_feed_trans").bind("pagebeforeshow", function (event, ui) {

    var pParam = $.Ctx.GetPageParam('transfer_feed_list', 'param');

    try {
        docTypeMat = pParam[PM_DOC_TYPE_KEY];
    } catch (e) {//Set Default
        docTypeMat = "P64";
    }
    var model = $.Ctx.GetPageParam('transfer_feed_trans', 'Data');

    var prevPage = (typeof ui.prevPage[0] == 'undefined' ? "" : ui.prevPage[0].id);
    if (prevPage.indexOf("lookup") > -1) {//From Lookup		
        //===== Farm Org ==== 
        var farmOrg = $.Ctx.GetPageParam('transfer_feed_trans', 'selectedFarmOrg');
        if (farmOrg !== null) {
            model.FARM_ORG = farmOrg.CODE;
            model.FARM_ORG_NAME = farmOrg.NAME;
        }
        //===== Product ==== 
        var product = $.Ctx.GetPageParam('transfer_feed_trans', 'selectedProduct');
        if (product !== null) {
            model.PRODUCT_CODE = product.PRODUCT_CODE;
            model.PRODUCT_NAME = product.PRODUCT_NAME;
            model.STOCK_KEEPING_UNIT = product.STOCK_KEEPING_UNIT;
            model.UNIT_PACK = product.UNIT_PACK;
        }

        //=====To Farm Org ==== 
        var toFarmOrg = $.Ctx.GetPageParam('transfer_feed_trans', 'selectedToFarmOrg');
        if (toFarmOrg !== null) {
            model.TO_FARM_ORG = toFarmOrg.CODE;
            model.TO_FARM_ORG_NAME = toFarmOrg.NAME;
        }

    } else {
        var mode = $.Ctx.GetPageParam('transfer_feed_trans', 'Mode');
        if (mode !== 'Create') {
            var key = $.Ctx.GetPageParam('transfer_feed_trans', 'Key');
            /*    DOCUMENT_EXT: 2
            DOCUMENT_TYPE: "63"
            FARM_ORG: "053521411-0000-0000"
            FARM_ORG_LOC: "AI168103-01-001"
            ORG_CODE: "053521411"
            PRODUCT_CODE: "1510N0000140"
            QTY: "23"
            TRANSACTION_DATE: "2013-06-26"
            WGH: "920"
            */
            FindTransferMat(key.ORG_CODE, key.FARM_ORG, key.FARM_ORG_LOC, key.TRANSACTION_DATE, key.DOCUMENT_TYPE, key.DOCUMENT_EXT, function (ret) {
                //Set Selected FarmOrgLoc
                $.Ctx.SetPageParam('transfer_feed_trans', 'selectedFarmOrg', { 'CODE': ret.FARM_ORG_LOC, 'NAME': ret.FARM_ORG_LOC_NAME });

                model.ORG_CODE = ret.ORG_CODE;
                model.FARM_ORG = ret.FARM_ORG_LOC;
                model.FARM_ORG_NAME = ret.FARM_ORG_LOC_NAME;
                model.QTY = ret.QTY;
                model.WGH = ret.WGH;
                model.LAST_QTY = ret.QTY;
                model.LAST_WGH = ret.WGH;
                model.PRODUCT_CODE = ret.PRODUCT_CODE;
                model.PRODUCT_NAME = ret.PRODUCT_NAME;
                model.STOCK_KEEPING_UNIT = ret.STOCK_KEEPING_UNIT;
                model.UNIT_PACK = ret.UNIT_PACK;
                model.TO_FARM_ORG = ret.TO_FARM_ORG_LOC;
                model.TO_FARM_ORG_NAME = ret.TO_FARM_ORG_LOC_NAME;
                model.NUMBER_OF_SENDING_DATA = ret.NUMBER_OF_SENDING_DATA;

                $.FarmCtx.SearchFarmOrgUsingMapMobile(function (orgs) {
                    if (orgs !== null) {
                        $.Ctx.SetPageParam('transfer_feed_trans', 'FarmOrgListInHusbandry', orgs);
                    }
                    else {
                        $.Ctx.SetPageParam('transfer_feed_trans', 'FarmOrgListInHusbandry', null);
                    }
                });
                Model2ControlPur();
            });
        } else {//Mode Create =>Set Default
            var pParam = $.Ctx.GetPageParam('transfer_feed_trans', 'param');
            var stkLoc = null;
            try {
                stkLoc = pParam[PM_STK_LOC_KEY];
            } catch (e) {//Set Default
                stkLoc = DEF_STK_LOC;
            }


        }
    }
    console.log($.Ctx.GetPageParam('transfer_feed_trans', 'Data'));


});

$("#transfer_feed_trans").bind("pageshow", function (event) {
    var mode = $.Ctx.GetPageParam('transfer_feed_trans', 'Mode');
    if (mode == 'Update') {
        //Disable key 
        $('#transfer_feed_trans #lpFarmOrg').button('disable');
        $('#transfer_feed_trans #lpToFarmOrg').button('enable');
        $('#transfer_feed_trans #lpProduct').button('enable');
        
    } else if (mode == 'Create') {
        $('#transfer_feed_trans #lpFarmOrg').button('enable');
        $('#transfer_feed_trans #lpToFarmOrg').button('enable');
        $('#transfer_feed_trans #lpProduct').button('enable');
       

    } else {
        $('#transfer_feed_trans #lpFarmOrg').button('disable');
        $('#transfer_feed_trans #btnSave').hide();
    }

    console.log('page show')
    Model2ControlPur();
    if ($.Ctx.GetPageParam('transfer_feed_trans', 'ScrollingTo') != null) {
        //scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
        $('html, body').animate({
            scrollTop: $.Ctx.GetPageParam('transfer_feed_trans', 'ScrollingTo')
        }, 0);
    }
});

function Model2ControlPur() {
    var model = $.Ctx.GetPageParam('transfer_feed_trans', 'Data');
    var mode = $.Ctx.GetPageParam('transfer_feed_trans', 'Mode');
    if (model !== null ) {
        
        if (model.PRODUCT_CODE == null || model.PRODUCT_NAME == null)
            $('#transfer_feed_trans #lpProduct').text($.Ctx.Lcl('transfer_feed_trans', 'msgSelect', 'Select'));
        else
            $('#transfer_feed_trans #lpProduct').text(model.PRODUCT_CODE + ' ' + model.PRODUCT_NAME + ' (' + model.STOCK_KEEPING_UNIT + ')');
        $('#transfer_feed_trans #lpProduct').button('refresh');

        if (model.FARM_ORG == null || model.FARM_ORG_NAME == null) {
            $('#transfer_feed_trans #lpFarmOrg').text($.Ctx.Lcl('transfer_feed_trans', 'msgSelect', 'Select'));
        } else
            $('#transfer_feed_trans #lpFarmOrg').text(model.FARM_ORG + ' ' + model.FARM_ORG_NAME);
        $('#transfer_feed_trans #lpFarmOrg').button('refresh');

        if (model.TO_FARM_ORG == null || model.TO_FARM_ORG_NAME == null) {
            $('#transfer_feed_trans #lpToFarmOrg').text($.Ctx.Lcl('transfer_feed_trans', 'msgSelect', 'Select'));
        } else
            $('#transfer_feed_trans #lpToFarmOrg').text(model.TO_FARM_ORG + ' ' + model.TO_FARM_ORG_NAME);
        $('#transfer_feed_trans #lpToFarmOrg').button('refresh');


        $('#transfer_feed_trans #txtqty').val(model.QTY == 0 ? '' : model.QTY);
        $('#transfer_feed_trans #txtWeight').val(model.WGH == 0 ? '' : model.WGH);
       

        if (model.STOCK_KEEPING_UNIT == 'W') {
            $('#transfer_feed_trans #txtqty').addClass('ui-disabled');
            $('#transfer_feed_trans #txtqty').attr('readonly', 'true');

            $('#transfer_feed_trans #txtWeight').removeClass('ui-disabled');
            $('#transfer_feed_trans #txtWeight').removeAttr('readonly');
        } else {
            $('#transfer_feed_trans #txtqty').removeClass('ui-disabled');
            $('#transfer_feed_trans #txtqty').removeAttr('readonly');

            $('#transfer_feed_trans #txtWeight').addClass('ui-disabled');
            $('#transfer_feed_trans #txtWeight').attr('readonly', 'true');
        }

        getAvailableUsage(model, function (ret) {
            //'maxQty': maxQty, 'maxWgh': maxWgh, 'usageQty': usageQty, 'usageWgh': usageWgh });
            $('#transfer_feed_trans #availableQty').text(ret.maxQty);
            $('#transfer_feed_trans #availableWgh').text(ret.maxWgh);
        });
    }
}

function SaveMatMove(SuccessCB) {
    var qty = Number($('#transfer_feed_trans #txtqty').val()),
		wgh = Number($('#transfer_feed_trans #txtWeight').val()),
		
    stockKeepingUnit = $.Ctx.GetPageParam('transfer_feed_trans', 'Data').STOCK_KEEPING_UNIT;
    var model = $.Ctx.GetPageParam('transfer_feed_trans', 'Data');

    if (_.isEmpty(model.FARM_ORG)) {
        $.Ctx.MsgBox($.Ctx.Lcl('transfer_feed_trans', 'msgReqFarmOrg', 'Farm Org is Required.'));
        SuccessCB(false); return false;
    }

    if (_.isEmpty(model.PRODUCT_CODE)) {
        $.Ctx.MsgBox($.Ctx.Lcl('transfer_feed_trans', 'msgReqProduct', 'Product is Required.'));
        SuccessCB(false); return false;
    }

    if (_.isEmpty(model.TO_FARM_ORG)) {
        $.Ctx.MsgBox($.Ctx.Lcl('transfer_feed_trans', 'msgReqToFarmOrg', 'To Farm Org is Required.'));
        SuccessCB(false); return false;
    }
   
    if (model.STOCK_KEEPING_UNIT == "Q") {
        if (qty <= 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('transfer_feed_trans', 'msgReqQty', 'Quantity is Required.'));
            SuccessCB(false); return false;
        }
    }

    checkFeedAvailable(model, function (ret) {
        if (ret) {
            var mode = $.Ctx.GetPageParam('transfer_feed_trans', 'Mode');
             if (mode == 'Update') {
            SaveWithDocExt(model.DOCUMENT_EXT);
               } else {//Add
             GetDocExtPur(SaveWithDocExt);
             }
        }
        else {
            $.Ctx.MsgBox($.Ctx.Lcl('transfer_feed_trans', 'productExceedAvailable', 'Wgh./Qty. over than available.'));
            SuccessCB(false); return false;
        }

    });

    

    function SaveWithDocExt(ext) {
        var pParam = $.Ctx.GetPageParam('transfer_feed_list', 'param');
        var caltyp = 1, trantyp = null, tranCod = null, stkType = null;
        try {
            caltyp = Number(pParam[PM_STK_CAL_TYPE_KEY]);
            trantyp = pParam[PM_TRAN_TYPE_KEY];
            tranCod = pParam[PM_TRAN_COD_KEY];
            stkType = pParam[PM_STK_TYPE_KEY];
            toFarmTranType = pParam[PM_TO_FARM_TRAN_TYPE_KEY]; 
        } catch (e) {//Set Default
            caltyp = 1;
            trantyp = '2';
            tranCod = '00';
            stkType = "10";
            toFarmTranType = '1';
        }
        var paramCmd = [];
        var dataM = $.Ctx.GetPageParam('transfer_feed_trans', 'Data');
        var qty = Number($('#transfer_feed_trans #txtqty').val()),
		wgh = Number($('#transfer_feed_trans #txtWeight').val());
		
         var cmdArr = new Array();
         var mat = new HH_FR_MS_MATERIAL_MOVE();
         var stkTran = new S1_ST_STOCK_TRN();
         var mode = $.Ctx.GetPageParam('transfer_feed_trans', 'Mode');
         var toFarmMat = new HH_FR_MS_MATERIAL_MOVE();
         var toFarmStkTran = new S1_ST_STOCK_TRN();
        if (mode == 'Create') {
            mat.ORG_CODE = $.Ctx.SubOp;
            mat.FARM_ORG = $.Ctx.SubWarehouse ;
            mat.FARM_ORG_LOC = dataM.FARM_ORG;
            mat.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            mat.DOCUMENT_TYPE = docTypeMat;
            mat.DOCUMENT_EXT = ext;
            mat.TO_FARM_ORG_LOC = dataM.TO_FARM_ORG;
            mat.TRANSACTION_TYPE = trantyp;
            mat.TRANSACTION_CODE = tranCod;
            mat.REF_DOCUMENT_NO = '';
            mat.PRODUCT_CODE = dataM.PRODUCT_CODE;
            mat.PRODUCT_SPEC = '0000-0000-0000';
            mat.QTY = qty;
            mat.WGH = wgh;
            mat.VAL = 0;
            mat.COST = 0;
            mat.STOCK_TYPE = stkType;
            mat.LOT_NO = '00'; 
            mat.NUMBER_OF_SENDING_DATA = 0;
            mat.OWNER = $.Ctx.UserId;
            mat.CREATE_DATE = (new XDate()).toDbDateStr();
            mat.LAST_UPDATE_DATE = null;
            mat.FUNCTION = 'A';
            cmdArr.push( mat.insertCommand($.Ctx.DbConn));

            /*
            stkTran.COMPANY = $.Ctx.ComCode;
            stkTran.OPERATION = $.Ctx.Op;
            stkTran.SUB_OPERATION = $.Ctx.SubOp;
            stkTran.BUSINESS_UNIT = $.Ctx.Bu;
            stkTran.DOCUMENT_DATE = mat.TRANSACTION_DATE;
            stkTran.DOC_TYPE = mat.DOCUMENT_TYPE;
            var s = $.Ctx.GetBusinessDate();
            var y = ('' + s.getFullYear()), m = ('' + (s.getMonth() + 1)).lpad("0", 2), d = ('' + s.getDate()).length == 2 ? ('' + s.getDate()) : ('' + s.getDate()).lpad("0", 2);
            stkTran.DOC_NUMBER = y + m + d;
            stkTran.EXT_NUMBER = mat.DOCUMENT_EXT;
            stkTran.WAREHOUSE_CODE = $.Ctx.Warehouse;
            stkTran.TRN_TYPE = trantyp;
            stkTran.TRN_CODE = tranCod;
            stkTran.CAL_TYPE = caltyp;
            stkTran.UNIT_LEVEL = mat.FARM_ORG_LOC;
            stkTran.ENTRY_TYPE = mat.ENTRY_TYPE;
            stkTran.PRODUCT_STOCK_TYPE = stkType;
            stkTran.PRODUCT_CODE = mat.PRODUCT_CODE;
            stkTran.PRODUCT_SPEC = mat.PRODUCT_SPEC;
            stkTran.LOT_NUMBER = mat.LOT_NO;
            stkTran.STOCK_KEEPING_UNIT = dataM.STOCK_KEEPING_UNIT;
            stkTran.QUANTITY = qty;
            stkTran.WEIGHT = wgh;
            stkTran.OWNER = mat.OWNER;
            stkTran.CREATE_DATE = mat.CREATE_DATE;
            stkTran.FUNCTION = mat.FUNCTION;
            stkTran.NUMBER_OF_SENDING_DATA = 0;

            cmdArr.push(stkTran.insertCommand($.Ctx.DbConn));
            */
           
            var FarmOrgListInHusbandry = $.Ctx.GetPageParam('transfer_feed_trans', 'FarmOrgListInHusbandry');
            var checkTransToFarmSameHusbandry = _.where(FarmOrgListInHusbandry, { CODE: mat.TO_FARM_ORG_LOC });
            console.log('Look in Data Count : ', checkTransToFarmSameHusbandry.length, ' data : ', checkTransToFarmSameHusbandry);
            console.log(checkTransToFarmSameHusbandry);

            if (checkTransToFarmSameHusbandry.length != 0) {
                //gen Receive when to_fram_org is in same husbandry
                // Diff only TRANSACTION_TYPE = 2  , FARM_ORG_LOC = to_Farm_org , TO_FARM_ORG = FARM_ORG
                toFarmMat.ORG_CODE = $.Ctx.SubOp;
                toFarmMat.FARM_ORG = $.Ctx.SubWarehouse;
                toFarmMat.FARM_ORG_LOC = dataM.TO_FARM_ORG;
                toFarmMat.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
                toFarmMat.DOCUMENT_TYPE = docTypeMat;
                toFarmMat.DOCUMENT_EXT = ext  ;
                toFarmMat.TO_FARM_ORG_LOC = dataM.FARM_ORG;
                toFarmMat.TRANSACTION_TYPE = toFarmTranType;
                toFarmMat.TRANSACTION_CODE = tranCod;
                toFarmMat.REF_DOCUMENT_NO = '';
                toFarmMat.PRODUCT_CODE = dataM.PRODUCT_CODE;
                toFarmMat.PRODUCT_SPEC = '0000-0000-0000';
                toFarmMat.QTY = qty;
                toFarmMat.WGH = wgh;
                toFarmMat.VAL = 0;
                toFarmMat.COST = 0;
                toFarmMat.STOCK_TYPE = stkType;
                toFarmMat.LOT_NO = '00';
                toFarmMat.NUMBER_OF_SENDING_DATA = 0;
                toFarmMat.OWNER = $.Ctx.UserId;
                toFarmMat.CREATE_DATE = (new XDate()).toDbDateStr();
                toFarmMat.LAST_UPDATE_DATE = null;
                toFarmMat.FUNCTION = 'A';
                cmdArr.push(toFarmMat.insertCommand($.Ctx.DbConn));

                /*
                toFarmStkTran.COMPANY = $.Ctx.ComCode;
                toFarmStkTran.OPERATION = $.Ctx.Op;
                toFarmStkTran.SUB_OPERATION = $.Ctx.SubOp;
                toFarmStkTran.BUSINESS_UNIT = $.Ctx.Bu;
                toFarmStkTran.DOCUMENT_DATE = toFarmMat.TRANSACTION_DATE;
                toFarmStkTran.DOC_TYPE = toFarmMat.DOCUMENT_TYPE;
                toFarmStkTran.DOC_NUMBER = stkTran.DOC_NUMBER;
                toFarmStkTran.EXT_NUMBER = toFarmMat.DOCUMENT_EXT;
                toFarmStkTran.WAREHOUSE_CODE = $.Ctx.Warehouse;
                toFarmStkTran.TRN_TYPE = toFarmTranType;
                toFarmStkTran.TRN_CODE = tranCod;
                toFarmStkTran.CAL_TYPE = caltyp;
                toFarmStkTran.UNIT_LEVEL = toFarmMat.FARM_ORG_LOC;
                toFarmStkTran.ENTRY_TYPE = toFarmMat.ENTRY_TYPE;
                toFarmStkTran.PRODUCT_STOCK_TYPE = stkType;
                toFarmStkTran.PRODUCT_CODE = toFarmMat.PRODUCT_CODE;
                toFarmStkTran.PRODUCT_SPEC = toFarmMat.PRODUCT_SPEC;
                toFarmStkTran.LOT_NUMBER = toFarmMat.LOT_NO;
                toFarmStkTran.STOCK_KEEPING_UNIT = dataM.STOCK_KEEPING_UNIT;
                toFarmStkTran.QUANTITY = qty;
                toFarmStkTran.WEIGHT = wgh;
                toFarmStkTran.OWNER = toFarmMat.OWNER;
                toFarmStkTran.CREATE_DATE = toFarmMat.CREATE_DATE;
                toFarmStkTran.FUNCTION = toFarmMat.FUNCTION;
                toFarmStkTran.NUMBER_OF_SENDING_DATA = 0;

                cmdArr.push(toFarmStkTran.insertCommand($.Ctx.DbConn));
                */
            }

            $.FarmCtx.setS1StockCommand(dataM.FARM_ORG ,'', dataM.PRODUCT_CODE, '', mode, wgh, qty, 0, 0, cmdArr , trantyp, function (cmdArr) {
                //gen tofarmorg
                    $.FarmCtx.setS1StockCommand(toFarmMat.FARM_ORG_LOC ,'', toFarmMat.PRODUCT_CODE, '', mode, wgh, qty, 0, 0, cmdArr , toFarmTranType, function (cmdArr) {
                    var tran = new DbTran($.Ctx.DbConn);
                    tran.executeNonQuery(cmdArr, function () {
                        ClearAfterSave();
                        $.Ctx.MsgBox($.Ctx.Lcl('transfer_feed_trans', 'MsgSaveComplete', 'Save Completed.'));
                    }, function () {
                        $.Ctx.MsgBox($.Ctx.Lcl('transfer_feed_trans', 'MsgSaveInComplete', 'Save Incompleted.'));
                    });
                }, function (err) {
                    console.log('Set Stock To farm org Command Error : ' + err);
                });
            }, function (err) {
                console.log('Set Stock Command Error : ' + err);
            });
        } 
        else {

         var key = $.Ctx.GetPageParam('transfer_feed_trans', 'Key');
         //   FindTransferMat(key.ORG_CODE, key.FARM_ORG, key.FARM_ORG_LOC,
         // key.TRANSACTION_DATE, key.DOCUMENT_TYPE, key.DOCUMENT_EXT, function (ret) {
                
            var cmdSelectToUpdate = $.Ctx.DbConn.createSelectCommand();
            cmdSelectToUpdate.sqlText = "select * from HH_FR_MS_MATERIAL_MOVE ";
            cmdSelectToUpdate.sqlText += " where ";
            cmdSelectToUpdate.sqlText += " ORG_CODE = ? ";
            cmdSelectToUpdate.sqlText += " AND FARM_ORG = ? ";
            cmdSelectToUpdate.sqlText += " AND FARM_ORG_LOC = ? ";
            cmdSelectToUpdate.sqlText += " AND TRANSACTION_DATE = ? ";
            cmdSelectToUpdate.sqlText += " AND DOCUMENT_TYPE = ? ";
            cmdSelectToUpdate.sqlText += " AND DOCUMENT_EXT = ? ";

            cmdSelectToUpdate.parameters.push(key.ORG_CODE);
            cmdSelectToUpdate.parameters.push(key.FARM_ORG);
            cmdSelectToUpdate.parameters.push(key.FARM_ORG_LOC);
            cmdSelectToUpdate.parameters.push(key.TRANSACTION_DATE);
            cmdSelectToUpdate.parameters.push(key.DOCUMENT_TYPE);
            cmdSelectToUpdate.parameters.push(key.DOCUMENT_EXT);

            cmdSelectToUpdate.executeReader(function (tx, res) {
                if (res.rows.length != 0) {
                    var mat = new HH_FR_MS_MATERIAL_MOVE();
                    mat.retrieveRdr(res.rows.item(0));
                    var lastTofarmOrg = dataM.TO_FARM_ORG;
                    var isDeleteOldData = false;
                    if (mat.TO_FARM_ORG_LOC != dataM.TO_FARM_ORG) {
                        lastTofarmOrg = mat.TO_FARM_ORG_LOC;
                        isDeleteOldData = true;
                    }
                    //Set new FarmOrg
                    mat.TO_FARM_ORG_LOC = dataM.TO_FARM_ORG;
                    mat.TRANSACTION_TYPE = trantyp;
                    mat.PRODUCT_CODE = dataM.PRODUCT_CODE;
                    mat.STOCK_TYPE = stkType;
                    mat.QTY = qty;
                    mat.WGH = wgh;
                    mat.NUMBER_OF_SENDING_DATA = 0;
                    mat.LAST_UPDATE_DATE = (new XDate()).toDbDateStr();
                    mat.FUNCTION = 'C';
                    mat.PRODUCT_SPEC = '0000-0000-0000';
                    cmdArr.push(mat.updateCommand($.Ctx.DbConn));

                    /*
                    stkTran.COMPANY = $.Ctx.ComCode;
                    stkTran.OPERATION = $.Ctx.Op;
                    stkTran.SUB_OPERATION = $.Ctx.SubOp;
                    stkTran.BUSINESS_UNIT = $.Ctx.Bu;
                    stkTran.DOCUMENT_DATE = mat.TRANSACTION_DATE;
                    stkTran.DOC_TYPE = mat.DOCUMENT_TYPE;
                    var s = $.Ctx.GetBusinessDate();
                    var y = ('' + s.getFullYear()), m = ('' + (s.getMonth() + 1)).lpad("0", 2), d = ('' + s.getDate()).length == 2 ? ('' + s.getDate()) : ('' + s.getDate()).lpad("0", 2);
                    stkTran.DOC_NUMBER = y + m + d;
                    stkTran.EXT_NUMBER = mat.DOCUMENT_EXT;
                    stkTran.WAREHOUSE_CODE = $.Ctx.Warehouse;
                    stkTran.TRN_TYPE = trantyp;
                    stkTran.TRN_CODE = tranCod;
                    stkTran.CAL_TYPE = caltyp;
                    stkTran.UNIT_LEVEL = mat.FARM_ORG_LOC;
                    stkTran.ENTRY_TYPE = mat.ENTRY_TYPE;
                    stkTran.PRODUCT_STOCK_TYPE = stkType;
                    stkTran.PRODUCT_CODE = mat.PRODUCT_CODE;
                    stkTran.PRODUCT_SPEC = mat.PRODUCT_SPEC;
                    stkTran.LOT_NUMBER = mat.LOT_NO;
                    stkTran.STOCK_KEEPING_UNIT = dataM.STOCK_KEEPING_UNIT;
                    stkTran.QUANTITY = qty;
                    stkTran.WEIGHT = wgh;
                    //stkTran.UNIT_PRICE = unit;
                    // stkTran.AMOUNT = amt;
                    stkTran.OWNER = mat.OWNER;
                    stkTran.CREATE_DATE = mat.CREATE_DATE;
                    stkTran.FUNCTION = mat.FUNCTION;
                    stkTran.NUMBER_OF_SENDING_DATA = 0;
                    stkTran.LAST_UPDATE_DATE = (new XDate()).toDbDateStr();

                    cmdArr.push(stkTran.updateCommand($.Ctx.DbConn));
                    */
                    var FarmOrgListInHusbandry = $.Ctx.GetPageParam('transfer_feed_trans', 'FarmOrgListInHusbandry');
                    var checkTransToFarmSameHusbandry = _.where(FarmOrgListInHusbandry, { CODE: mat.TO_FARM_ORG_LOC });
                    console.log('Look in Data Count Update : ', checkTransToFarmSameHusbandry.length, ' data : ', checkTransToFarmSameHusbandry);
                    console.log(checkTransToFarmSameHusbandry);


                    toFarmMat.ORG_CODE = $.Ctx.SubOp;
                    toFarmMat.FARM_ORG = $.Ctx.SubWarehouse;
                    toFarmMat.TRANSACTION_DATE = mat.TRANSACTION_DATE; // $.Ctx.GetBusinessDate().toDbDateStr();
                    toFarmMat.DOCUMENT_TYPE = docTypeMat;
                    toFarmMat.DOCUMENT_EXT = mat.DOCUMENT_EXT; //(typeof mat.DOCUMENT_EXT == 'string' ? Number(mat.DOCUMENT_EXT) : mat.DOCUMENT_EXT);
                    toFarmMat.TO_FARM_ORG_LOC = mat.FARM_ORG_LOC;
                    toFarmMat.TRANSACTION_TYPE = toFarmTranType;
                    toFarmMat.TRANSACTION_CODE = tranCod;
                    toFarmMat.REF_DOCUMENT_NO = '';
                    toFarmMat.PRODUCT_CODE = mat.PRODUCT_CODE;
                    toFarmMat.PRODUCT_SPEC = '0000-0000-0000';
                    toFarmMat.QTY = qty;
                    toFarmMat.WGH = wgh;
                    toFarmMat.VAL = 0;
                    toFarmMat.COST = 0;
                    toFarmMat.STOCK_TYPE = stkType;
                    toFarmMat.LOT_NO = '00';
                    toFarmMat.NUMBER_OF_SENDING_DATA = 0;
                    toFarmMat.LAST_UPDATE_DATE = (new XDate()).toDbDateStr();
                    toFarmMat.FUNCTION = 'C';
                    toFarmMat.CREATE_DATE = mat.CREATE_DATE;
                    toFarmMat.OWNER = mat.OWNER;
                    toFarmMat.FARM_ORG_LOC = mat.TO_FARM_ORG_LOC;
                    /*
                    toFarmStkTran.COMPANY = $.Ctx.ComCode;
                    toFarmStkTran.OPERATION = $.Ctx.Op;
                    toFarmStkTran.SUB_OPERATION = $.Ctx.SubOp;
                    toFarmStkTran.BUSINESS_UNIT = $.Ctx.Bu;
                    toFarmStkTran.DOCUMENT_DATE = toFarmMat.TRANSACTION_DATE;
                    toFarmStkTran.DOC_TYPE = toFarmMat.DOCUMENT_TYPE;
                    toFarmStkTran.DOC_NUMBER = stkTran.DOC_NUMBER;
                    toFarmStkTran.EXT_NUMBER = toFarmMat.DOCUMENT_EXT;
                    toFarmStkTran.WAREHOUSE_CODE = $.Ctx.Warehouse;
                    toFarmStkTran.TRN_TYPE = toFarmTranType;
                    toFarmStkTran.TRN_CODE = tranCod;
                    toFarmStkTran.CAL_TYPE = caltyp;
                    toFarmStkTran.UNIT_LEVEL = toFarmMat.FARM_ORG_LOC;
                    toFarmStkTran.ENTRY_TYPE = toFarmMat.ENTRY_TYPE;
                    toFarmStkTran.PRODUCT_STOCK_TYPE = stkType;
                    toFarmStkTran.PRODUCT_CODE = toFarmMat.PRODUCT_CODE;
                    toFarmStkTran.PRODUCT_SPEC = toFarmMat.PRODUCT_SPEC;
                    toFarmStkTran.LOT_NUMBER = toFarmMat.LOT_NO;
                    toFarmStkTran.STOCK_KEEPING_UNIT = dataM.STOCK_KEEPING_UNIT;
                    toFarmStkTran.QUANTITY = qty;
                    toFarmStkTran.WEIGHT = wgh;
                    toFarmStkTran.OWNER = toFarmMat.OWNER;
                    toFarmStkTran.LAST_UPDATE_DATE = toFarmMat.LAST_UPDATE_DATE;
                    toFarmStkTran.FUNCTION = toFarmMat.FUNCTION;
                    toFarmStkTran.NUMBER_OF_SENDING_DATA = 0;
                    toFarmStkTran.CREATE_DATE = toFarmMat.CREATE_DATE;
                    toFarmStkTran.OWNER = toFarmMat.OWNER;
                    */
                    key = $.Ctx.GetPageParam('transfer_feed_trans', 'Key');

                    if (checkTransToFarmSameHusbandry.length != 0) {
                        //gen Receive when to_fram_org is in same husbandry
                        // Diff only TRANSACTION_TYPE = 2  , FARM_ORG_LOC = to_Farm_org , TO_FARM_ORG = FARM_ORG
                        if (isDeleteOldData) {
                            toFarmMat.FARM_ORG_LOC = lastTofarmOrg;
                            cmdArr.push(toFarmMat.deleteCommand($.Ctx.DbConn))
                        }
                        toFarmMat.FARM_ORG_LOC = mat.TO_FARM_ORG_LOC;
                        cmdArr.push(toFarmMat.insertCommand($.Ctx.DbConn));
                        //  cmdArr.push(toFarmStkTran.deleteCommand($.Ctx.DbConn));
                        //  cmdArr.push(toFarmStkTran.insertCommand($.Ctx.DbConn));

                    }
                    else {
                        // not in list if must delete delete them 
                        if (isDeleteOldData) {
                            toFarmMat.FARM_ORG_LOC = lastTofarmOrg;
                            cmdArr.push(toFarmMat.deleteCommand($.Ctx.DbConn));
                            //  cmdArr.push(toFarmStkTran.deleteCommand($.Ctx.DbConn));
                        }
                        // cmdArr.push(toFarmMat.updateCommand($.Ctx.DbConn))
                        //   cmdArr.push(toFarmStkTran.updateCommand($.Ctx.DbConn));

                    }
                    //Set To current TO_FARM_ORG_LOC
                    toFarmMat.FARM_ORG_LOC = mat.TO_FARM_ORG_LOC;
                    //Delete Old to tranType
                    $.FarmCtx.setS1StockCommand(lastTofarmOrg, lastTofarmOrg, toFarmMat.PRODUCT_CODE, key.PRODUCT_CODE, 'Delete', wgh, qty, key.WGH, key.QTY, cmdArr, toFarmTranType, function (cmdArr) {

                        $.FarmCtx.setS1StockCommand(dataM.FARM_ORG, lastTofarmOrg, dataM.PRODUCT_CODE, key.PRODUCT_CODE, mode, wgh, qty, key.WGH, key.QTY, cmdArr, trantyp, function (cmdArr) {
                            $.FarmCtx.setS1StockCommand(toFarmMat.FARM_ORG_LOC, lastTofarmOrg, toFarmMat.PRODUCT_CODE, key.PRODUCT_CODE, mode, wgh, qty, key.WGH, key.QTY, cmdArr, toFarmTranType, function (cmdArr) {
                                var tran = new DbTran($.Ctx.DbConn);
                                tran.executeNonQuery(cmdArr, function () {
                                    $.Ctx.NavigatePage($.Ctx.GetPageParam('transfer_feed_trans', 'Previous'),
			null,
			{ transition: 'slide', reverse: true });
                                }, function () {
                                    $.Ctx.MsgBox($.Ctx.Lcl('transfer_feed_trans', 'MsgUpdateInComplete', 'Update Incompleted.'));
                                });
                            }, function (err) {
                                console.log('Set Stock To Farm org Command Error : ' + err);
                            });
                        }, function (err) {
                            console.log('Set Stock Command Error : ' + err);
                        });
                    }, function (err) {
                        console.log('Delete Stock Command Error : ' + err);
                    });

                }
            }, function (err) {
                console.log('error from select to update : ' + err);
            });
       
        }
    }
}



function SearchFarmOrg(stkLoc, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = "ifnull(NAME_LOC, NAME_ENG)";
    if ($.Ctx.Lang == "en-US") {
        nameField = "ifnull(NAME_ENG, NAME_LOC)";
    }
    cmd.sqlText = "SELECT FARM_ORG AS CODE,{0} AS NAME FROM FR_FARM_ORG WHERE 1=1 ".format([nameField]);
    cmd.sqlText += " AND ORG_CODE=? ";
    if (stkLoc.toUpperCase() == "CENTER")
        cmd.sqlText += " AND PROJECT='0000' ";
    //else
    //cmd.sqlText += " AND MANAGEMENT_FLG='M'";
    cmd.sqlText += " ORDER BY FARM_ORG ";

    cmd.parameters.push($.Ctx.SubOp);
    //cmd.parameters.push($.Ctx.Warehouse);
    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
                ret.push({ 'CODE': res.rows.item(i).CODE, 'NAME': res.rows.item(i).NAME });
            }
            if (typeof SuccessCB == 'function') SuccessCB(ret);
        } else {
            if (typeof SuccessCB == 'function') SuccessCB(null);
        }
    });
}



function GetDocExtPur(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT MAX(DOCUMENT_EXT) AS RUN_EXT FROM HH_FR_MS_MATERIAL_MOVE ";
    cmd.sqlText += "WHERE ORG_CODE=? AND TRANSACTION_DATE=? AND DOCUMENT_TYPE=? ";
    var ret = [];
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
    cmd.parameters.push(docTypeMat);
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            if (typeof SuccessCB == 'function') SuccessCB(res.rows.item(0).RUN_EXT == null ? 1 : res.rows.item(0).RUN_EXT + 1);
        } else {
            if (typeof SuccessCB == 'function') SuccessCB(1);
        }
    }, function (err) {
        console.log(err);
    });
}

function FindTransferMat(orgCode ,farmOrg , farmOrgLoc, txDateStr, docType, docExt, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nPro = nLoc = bName = '';
    var pageParam = $.Ctx.GetPageParam('transfer_feed_list', 'param');
    var tranType = pageParam[PM_TRAN_TYPE_KEY]; 
    var farmOrgNameField = $.Ctx.Lang == "en-US" ? "ifnull(farmOrg.NAME_ENG, farmOrg.NAME_LOC)" : "ifnull(farmOrg.NAME_LOC, farmOrg.NAME_ENG)";
    var toFarmOrgNameField = $.Ctx.Lang == "en-US" ? "ifnull(toFarmOrg.NAME_ENG, toFarmOrg.NAME_LOC)" : "ifnull(toFarmOrg.NAME_LOC, toFarmOrg.NAME_ENG)";
    
    cmd.sqlText = " select matmove.org_code , matMove.farm_org ,  matMove.farm_org_loc  , ";
    cmd.sqlText += " {0} as FARM_ORG_LOC_NAME  , matMove.transaction_date , ".format([farmOrgNameField]);
    cmd.sqlText += " matMove.document_type , matMove.qty   ,  matMove.wgh , matMove.DOCUMENT_EXT , ";
    cmd.sqlText += " matMove.PRODUCT_CODE , product.PRODUCT_NAME  , matMove.NUMBER_OF_SENDING_DATA , ";
    cmd.sqlText += " product.STOCK_KEEPING_UNIT , product.UNIT_PACK , matMove.TO_FARM_ORG_LOC ";
    cmd.sqlText += " , {0} as TO_FARM_ORG_LOC_NAME ".format([toFarmOrgNameField]);
    cmd.sqlText += " from hh_fr_ms_material_move  matMove, ";
    cmd.sqlText += " fr_farm_org farmOrg  ,  ";
    cmd.sqlText += " hh_product_bu product ,  ";
    cmd.sqlText += " fr_farm_org toFarmOrg ";
    cmd.sqlText += " where ";
    cmd.sqlText += " matMove.org_code = ? ";
    cmd.sqlText += " and matMove.farm_org = ? ";
    cmd.sqlText += " and matMove.farm_org_loc  = ? ";
    cmd.sqlText += " and matMove.transaction_date = ? ";
    cmd.sqlText += " and matMove.document_type = ? ";
    cmd.sqlText += " and matMove.document_ext = ? ";
    cmd.sqlText += " and matMove.transaction_type = ?  ";
    cmd.sqlText += " and matMove.farm_org_loc  = farmOrg.farm_org ";
    cmd.sqlText += " and matmove.product_code = product.product_code ";
    cmd.sqlText += " and matMove.to_farm_org_loc  = toFarmOrg.farm_org ";
    cmd.sqlText += " order by matMove.document_ext "

    cmd.parameters.push(orgCode);
    cmd.parameters.push(farmOrg);
    cmd.parameters.push(farmOrgLoc);
    cmd.parameters.push(txDateStr);
    cmd.parameters.push(docType);
    cmd.parameters.push(docExt);
    cmd.parameters.push(tranType); 

    var ret = {};
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            ret.ORG_CODE = res.rows.item(0).ORG_CODE;
            ret.FARM_ORG = res.rows.item(0).FARM_ORG;
            ret.FARM_ORG_LOC = res.rows.item(0).FARM_ORG_LOC; 
            ret.FARM_ORG_LOC_NAME = res.rows.item(0).FARM_ORG_LOC_NAME;
            ret.TRANSACTION_DATE = res.rows.item(0).TRANSACTION_DATE;
            ret.DOCUMENT_TYPE = res.rows.item(0).DOCUMENT_TYPE;
            ret.DOCUMENT_EXT = res.rows.item(0).DOCUMENT_EXT;
            ret.QTY = res.rows.item(0).QTY;
            ret.WGH = res.rows.item(0).WGH;
            ret.PRODUCT_CODE = res.rows.item(0).PRODUCT_CODE;
            ret.PRODUCT_NAME = res.rows.item(0).PRODUCT_NAME;
            ret.STOCK_KEEPING_UNIT = res.rows.item(0).STOCK_KEEPING_UNIT;
            ret.UNIT_PACK = res.rows.item(0).UNIT_PACK;
            ret.TO_FARM_ORG_LOC = res.rows.item(0).TO_FARM_ORG_LOC;
            ret.TO_FARM_ORG_LOC_NAME = res.rows.item(0).TO_FARM_ORG_LOC_NAME;
            ret.NUMBER_OF_SENDING_DATA = res.rows.item(0).NUMBER_OF_SENDING_DATA;

            if (typeof SuccessCB == 'function') SuccessCB(ret);
        } else {
            if (typeof SuccessCB == 'function') SuccessCB(null);
        }
    }, function (error) {
        console.log(error);
    });
}


function SearchIssued(stock_type, SuccessCB) {
   
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "select matiss.* , matiss.[DOCUMENT_NO] || '-' || product.product_name || '-' || ";
    cmd.sqlText += " ifnull (farmOrg.name_loc ,farmorg.name_eng)   as NAME , ";
    cmd.sqlText += " product.product_name , product.STOCK_KEEPING_UNIT , ";
    cmd.sqlText += " ifnull (farmOrg.name_loc ,farmorg.name_eng)   as FARM_ORG_NAME  ";
    cmd.sqlText += " from HH_FR_MS_MATERIAL_ISSUED matiss , hh_product_bu  product ,  " ;
    cmd.sqlText += " fr_farm_org farmOrg ";
    cmd.sqlText += " WHERE matiss.STOCK_TYPE = ? AND matiss.USED is not 1 ";
    cmd.sqlText += " and matiss.PRODUCT_CODE = product.product_code ";
    cmd.sqlText += " and matiss.FARM_ORG = farmOrg.farm_org ";

    
    
    cmd.parameters.push(stock_type);
    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
                ret.push(res.rows.item(i));
            }
            if (typeof SuccessCB == 'function') SuccessCB(ret);
        } else {
            if (typeof SuccessCB == 'function') SuccessCB(null);
        }
    }, function (error) { console.log(error) });
}

function ClearAfterSave() {
    var model = $.Ctx.GetPageParam('transfer_feed_trans', 'Data');
   
    if (model !== null) {
        model.AMOUNT = 0;
        model.ENTRY_TYPE = 1;
        model.FARM_ORG = null;
        model.FARM_ORG_NAME = null;
        model.FEMALE_QTY = 0;
        model.FEMALE_WGH = 0;
        model.MALE_QTY = 0;
        model.MALE_WGH = 0;
        model.PRODUCTION_DATE = null;
        model.PRODUCT_CODE = null;
        model.PRODUCT_NAME = null;
        model.QTY = 0;
        model.REF_DOCUMENT_NO = null;
        model.STOCK_KEEPING_UNIT = null;
        model.TO_FARM_ORG=null;
        model.TO_FARM_ORG_NAME=null;
        model.UNIT = 0;
        model.UNIT_PACK = 0;
        model.VENDOR_CODE = null;
        model.VENDOR_NAME = null;
        model.WGH = 0;
        $.Ctx.SetPageParam('transfer_feed_trans', 'Data', model);
        $.Ctx.SetPageParam('transfer_feed_trans', 'selectedProduct', null);
        $.Ctx.SetPageParam('transfer_feed_trans', 'selectedToFarmOrg', null);
        $.Ctx.SetPageParam('transfer_feed_trans', 'selectedFarmOrg', null);
         
        Model2ControlPur();
    }
}




function checkFeedAvailable(model ,successCB) {

    getAvailableUsage(model, function (ret) {
        var qty = Number($('#transfer_feed_trans #txtqty').val()),
		        wgh = Number($('#transfer_feed_trans #txtWeight').val());

        if (model.STOCK_KEEPING_UNIT == 'Q') {
          if (qty > ret.maxQty)
                successCB(false);
            else
                successCB(true);
        } else {
            if (wgh > ret.maxWgh)
                successCB(false);
            else
                successCB(true);
        }
    });

}



function SearchProduct(stkTyp, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();

    cmd.sqlText = "SELECT distinct product.* FROM HH_PRODUCT_BU  product ,  ";
 cmd.sqlText  += " s1_st_stock_balance stkBal WHERE product.BUSINESS_UNIT=?";
    var strStk = $.FarmCtx.ExtractParam(stkTyp);
    if (strStk !== '') {
        cmd.sqlText += " AND product.PRODUCT_STOCK_TYPE IN ({0}) ".format([strStk]);
    }
    
 
cmd.sqlText += " and stkBal.warehouse_code = ?  " ;
cmd.sqlText += " and product.product_code = stkBal.product_code ";
cmd.sqlText += "ORDER BY product.PRODUCT_CODE ";

    cmd.parameters.push($.Ctx.Bu);
    cmd.parameters.push( $.Ctx.GetPageParam('transfer_feed_trans' , 'selectedFarmOrg').CODE );

    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                if (res.rows.item(i).PRODUCT_NAME !== null) {
                    var m = new HH_PRODUCT_BU();
                    m.retrieveRdr(res.rows.item(i));
                    ret.push(m);
                }
            }
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    });
}

function findFarmOrg(success) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = $.FarmCtx.GetLookupFarmOrgSqlText();
    cmd.parameters.push($.Ctx.SubOp);
    var ret = [];
    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                ret.push({ 'CODE': res.rows.item(i).CODE, 'NAME': res.rows.item(i).NAME });
            }
            success(ret);
        }
        else {
            success(null);
        }

    }, function (err) {
        console.log('Error @ findFarmOrg ' + err);
    });
}

function getAvailableUsage(model, successCB) {
    var stkBalcObj = new S1_ST_STOCK_BALANCE();
    var cmdS1Stock = $.Ctx.DbConn.createSelectCommand();

    cmdS1Stock.sqlText = " SELECT * FROM S1_ST_STOCK_BALANCE BAL WHERE BAL.COMPANY =? AND BAL.OPERATION =?  AND BAL.SUB_OPERATION =? AND BAL.BUSINESS_UNIT =?  AND BAL.WAREHOUSE_CODE =?  AND BAL.SUB_WAREHOUSE_CODE =? AND BAL.PRODUCT_CODE =? AND BAL.PRODUCT_SPEC =? AND BAL.LOT_NUMBER =? AND BAL.SUB_LOT_NUMBER =? AND BAL.SERIAL_NO =? AND BAL.PRODUCTION_DATE =? AND BAL.EXPIRE_DATE =? AND BAL.RECEIVED_DATE =? ";
    stkBalcObj.COMPANY = $.Ctx.ComCode;
    stkBalcObj.OPERATION = $.Ctx.Op;
    stkBalcObj.SUB_OPERATION = $.Ctx.SubOp;
    stkBalcObj.BUSINESS_UNIT = $.Ctx.Bu;
    stkBalcObj.SUB_WAREHOUSE_CODE = 'NA';
    stkBalcObj.PRODUCT_SPEC = '0000-0000-0000';
    stkBalcObj.LOT_NUMBER = '00';
    stkBalcObj.SUB_LOT_NUMBER = 'NA';
    stkBalcObj.SERIAL_NO = 'NA';
    stkBalcObj.PRODUCTION_DATE = 'NA';
    stkBalcObj.EXPIRE_DATE = 'NA';
    stkBalcObj.RECEIVED_DATE = 'NA';
    stkBalcObj.NUMBER_OF_SENDING_DATA = 0;
    stkBalcObj.LAST_UPDATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
    stkBalcObj.WAREHOUSE_CODE = model.FARM_ORG;
    stkBalcObj.PRODUCT_CODE = model.PRODUCT_CODE;

    cmdS1Stock.parameters.push(stkBalcObj.COMPANY);
    cmdS1Stock.parameters.push(stkBalcObj.OPERATION);
    cmdS1Stock.parameters.push(stkBalcObj.SUB_OPERATION);
    cmdS1Stock.parameters.push(stkBalcObj.BUSINESS_UNIT);
    cmdS1Stock.parameters.push(stkBalcObj.WAREHOUSE_CODE);
    cmdS1Stock.parameters.push(stkBalcObj.SUB_WAREHOUSE_CODE);
    cmdS1Stock.parameters.push(stkBalcObj.PRODUCT_CODE);
    cmdS1Stock.parameters.push(stkBalcObj.PRODUCT_SPEC);
    cmdS1Stock.parameters.push(stkBalcObj.LOT_NUMBER);
    cmdS1Stock.parameters.push(stkBalcObj.SUB_LOT_NUMBER);
    cmdS1Stock.parameters.push(stkBalcObj.SERIAL_NO);
    cmdS1Stock.parameters.push(stkBalcObj.PRODUCTION_DATE);
    cmdS1Stock.parameters.push(stkBalcObj.EXPIRE_DATE);
    cmdS1Stock.parameters.push(stkBalcObj.RECEIVED_DATE);


    cmdS1Stock.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            var maxQty = res.rows.item(0).QUANTITY;
            var maxWgh = res.rows.item(0).WEIGHT;
            var lastQty = $.Ctx.Nvl(model.LAST_QTY, 0);
            var lastWgh = $.Ctx.Nvl(model.LAST_WGH, 0);

            maxQty += lastQty;
            maxWgh += lastWgh;
            successCB({ 'maxQty': maxQty, 'maxWgh': maxWgh });
        }
        else {
            successCB({ 'maxQty': 0, 'maxWgh': 0 });
        }
    }, function (err) {
        console.log('Error get available stock : ' + err);
    });
}
