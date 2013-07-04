var clickAlias = "click";
var docTypeMat = "DCTYP65";
var DEF_STK_LOC = "CENTER", DEF_ENTRY_TYP = "1";
var PM_STK_TYPE_KEY = "product_stock_type",
	PM_DOC_TYPE_KEY = "document_type",
	PM_STK_LOC_KEY = "stock_location",
	PM_STK_CAL_TYPE_KEY = "cal_type",
	PM_TRAN_TYPE_KEY = "transaction_type",
	PM_TRAN_COD_KEY = "transaction_code";
//var docTypeMat = $.Ctx.GetPageParam('receive_medical_trans', 'param')[PM_DOC_TYPE_KEY];

//$.Ctx.SetPageParam('receive_medical_list', 'param', { "product_stock_type": "20", "transaction_type": "1", "transaction_code": "21", "document_type": "65", "cal_type": "1", "stock_location": "FARM", "captionHeader": "HeaderPurMed" });
//$.Ctx.SetPageParam('receive_medical_trans', 'Mode' , 'Create');

$("#receive_medical_trans").bind("pageinit", function (event) {

    var pParam = $.Ctx.GetPageParam('receive_medical_list', 'param');
    try {
        $("#receive_medical_trans #captionHeader").text($.Ctx.Lcl('receive_medical_trans', pParam['captionHeader'], 'Receive Medical'));
    } catch (e) {
        $("#receive_medical_trans #captionHeader").text($.Ctx.Lcl('receive_medical_trans', 'captionHeader', 'Receive Medical'));
    }

    $('#receive_medical_trans #btnSave').bind(clickAlias, function () {
        SavePurTrans(function (ret) {
            if (ret == true) {
                if ($.Ctx.GetPageParam('receive_medical_trans', 'Mode') == "Create")
                    ClearAfterSave();
                $.Ctx.MsgBox($.Ctx.Lcl('receive_medical_trans', 'MsgSaveComplete', 'Save Completed.'));
                
            }
        });
        return false;
    });



    $('#receive_medical_trans #lpFarmOrg').bind(clickAlias, function () {
        $.Ctx.SetPageParam('receive_medical_trans', 'ScrollingTo', $(window).scrollTop());
        var pParam = $.Ctx.GetPageParam('receive_medical_list', 'param');
        var stkLoc = null;
        try {
            stkLoc = pParam[PM_STK_LOC_KEY];
        } catch (e) {//Set Default
            stkLoc = DEF_STK_LOC;
        }
        $.FarmCtx.SearchFarmOrgUsingMapMobile( function (orgs) {
            if (orgs !== null) {
                var p = new LookupParam();
                p.title = stkLoc == 'FARM' ? $.Ctx.Lcl('receive_medical_trans', 'MsgFarmMng', 'Farm Manage') : $.Ctx.Lcl('receive_medical_trans', 'MsgFarmCnt', 'Farm Center');
                p.calledPage = 'receive_medical_trans';
                p.calledResult = 'selectedFarmOrg';
                p.codeField = 'CODE';
                p.nameField = 'NAME';
                p.showCode = true;
                p.dataSource = orgs;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('receive_medical_trans', 'msgFarmOrgNoFod', 'Farm org not found.'));
            }
        });
    });

    $("#receive_medical_trans #lpRefDoc").bind('click', function () {
        $.Ctx.SetPageParam('receive_medical_trans', 'ScrollingTo', $(window).scrollTop());
        SearchIssued($.Ctx.GetPageParam('receive_medical_list', 'param').product_stock_type, function (ret) {
            if (ret != null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('receive_medical_trans', 'MsgSelectRedDoc', 'Select Ref. Doc');
                p.calledPage = 'receive_medical_trans';
                p.calledResult = 'selectedRefDoc';
                p.codeField = 'DOCUMENT_NO';
                p.nameField = 'NAME';
                p.showCode = false;
                p.dataSource = ret;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('receive_medical_trans', 'msgRefDocNotFound', 'Cannot Find Ref Document.'));
            }
        });
    });



    $('#receive_medical_trans #btnBack').bind('click', function () {
        //Check Dirty
        var dirty = false;
        var mode = $.Ctx.GetPageParam('receive_medical_trans', 'Mode');
        var model = $.Ctx.GetPageParam('receive_medical_trans', 'Data');
        if (mode == 'Create' && model !== null && Object.keys(model).length > 0) {
            dirty = true;
        }
        var isExit = true;
        /*if (dirty==true){
        isExit = confirm($.Ctx.Lcl('receive_medical_trans', 'msgConfirmExit', 'Data is Dirty, Exit?'));
        }else{
        isExit=true;
        }*/
        if (isExit == true) {
            $.Ctx.NavigatePage($.Ctx.GetPageParam('receive_medical_trans', 'Previous'),
			null,
			{ transition: 'slide', reverse: true });
        }
        return false;
    });

    $('#receive_medical_trans input[type="number"]').focusout(function () {
        var qtyStr = $(this).val();
        //$(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
    });
    $('#receive_medical_trans #txtRefDoc').focusout(function () {
        var model = $.Ctx.GetPageParam('receive_medical_trans', 'Data');
        if (model == null) return false;
        model.REF_DOCUMENT_NO = $.trim($(this).val());
    });

    $('#receive_medical_trans #txtqty').focusout(function () {
        var qtyStr = $(this).val();
        $(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
        var model = $.Ctx.GetPageParam('receive_medical_trans', 'Data');
        if (model == null || typeof model.STOCK_KEEPING_UNIT == 'undefined' || model.STOCK_KEEPING_UNIT == null) return false;
        FocusoutCal();
    });
    $('#receive_medical_trans #txtUnit').focusout(function () {
        var model = $.Ctx.GetPageParam('receive_medical_trans', 'Data');
        if (model == null || typeof model.STOCK_KEEPING_UNIT == 'undefined' || model.STOCK_KEEPING_UNIT == null) return false;
        FocusoutCal();
    });
    $('#receive_medical_trans #txtWeight').focusout(function () {
        var model = $.Ctx.GetPageParam('receive_medical_trans', 'Data');
        if (model == null || typeof model.STOCK_KEEPING_UNIT == 'undefined' || model.STOCK_KEEPING_UNIT == null) return false;
        FocusoutCal();
    });
    $('#receive_medical_trans #total-amt').focusout(function () {
        var model = $.Ctx.GetPageParam('receive_medical_trans', 'Data');
        if (model == null || typeof model.ENTRY_TYPE == 'undefined') return false;
        if (model.ENTRY_TYPE == '2') {
            model.NET_AMT = 0;
            model.UNIT = 0;
            $(this).val('');
            $('#receive_medical_trans #txtUnit').val('');
        }
        //FocusoutCal();
    });
});

function FocusoutCal() {
    var model = $.Ctx.GetPageParam('receive_medical_trans', 'Data');
    model.QTY = Number($('#receive_medical_trans #txtqty').val());
    model.UNIT = Number($('#receive_medical_trans #txtUnit').val());
    model.NET_AMT = Number($('#receive_medical_trans #total-amt').val());
    model.WGH = Number($('#receive_medical_trans #txtWeight').val());

    var unitPackStr = (typeof model.UNIT_PACK == 'undefined' || model.UNIT_PACK == null ? 1 : model.UNIT_PACK);
    model.UNIT = Number(model.UNIT.toFixed(4));
    if (model.QTY > 0 && Number(unitPackStr) > 0) {
        if (model.STOCK_KEEPING_UNIT == "Q") {
            model.WGH = model.QTY * Number(unitPackStr);
        } else {
            model.QTY = 0;
        }
    }
    if (model.ENTRY_TYPE == '1') {
        if (model.STOCK_KEEPING_UNIT == "Q") {
            model.NET_AMT = model.QTY * model.UNIT;
        } else {
            model.NET_AMT = model.WGH * model.UNIT;
        }
        model.NET_AMT = Number(model.NET_AMT.toFixed(2));
    } else if (model.ENTRY_TYPE == '2') {
        model.NET_AMT = 0;
        model.UNIT = 0;
    }

    Model2ControlPur();
}

$("#receive_medical_trans").bind("pagebeforehide", function (event, ui) {
    var model = $.Ctx.GetPageParam('receive_medical_trans', 'Data');
    if (model == null) {
        model = {};
        $.Ctx.SetPageParam('receive_medical_trans', 'Data', model);
    }
    model.REF_DOCUMENT_NO = $("#receive_medical_trans #lpRefDoc").text(); //$('#receive_medical_trans #txtRefDoc').val();
    model.QTY = Number($('#receive_medical_trans #txtqty').val());
    model.WGH = Number($('#receive_medical_trans #txtWeight').val());
    model.UNIT = Number($('#receive_medical_trans #txtUnit').val());
    model.NET_AMT = Number($('#receive_medical_trans #total-amt').val());

    //model.LOT_NUMBER = $('#receive_medical_trans #txtLotNo').val();
});

$('#receive_medical_trans').bind("pagebeforecreate", function (e) {
    $.Util.RenderUiLang('receive_medical_trans');
    $.Ctx.RenderFooter('receive_medical_trans');
});

$("#receive_medical_trans").bind("pagebeforeshow", function (event, ui) {

    var pParam = $.Ctx.GetPageParam('receive_medical_list', 'param');

    try {
        docTypeMat = pParam[PM_DOC_TYPE_KEY];
    } catch (e) {//Set Default
        docTypeMat = "P64";
    }
    var model = $.Ctx.GetPageParam('receive_medical_trans', 'Data');

    var prevPage = (typeof ui.prevPage[0] == 'undefined' ? "" : ui.prevPage[0].id);
    if (prevPage.indexOf("lookup") > -1) {//From Lookup		
        // ===========select ref doc===============
        var selectedRefDoc = $.Ctx.GetPageParam('receive_medical_trans', 'selectedRefDoc');
        if (selectedRefDoc != null) {
            model.REF_DOCUMENT_NO = selectedRefDoc.DOCUMENT_NO;

            model.FARM_ORG = selectedRefDoc.FARM_ORG;
            model.FARM_ORG_NAME = selectedRefDoc.FARM_ORG_NAME;
            model.QTY = selectedRefDoc.QTY;
            model.WGH = selectedRefDoc.WGH;
            model.NET_AMT = selectedRefDoc.NET_AMT;
            model.UNIT_PACK = selectedRefDoc.UNIT;
            model.PRODUCT_CODE = selectedRefDoc.PRODUCT_CODE;
            model.PRODUCT_NAME = selectedRefDoc.PRODUCT_NAME;
            model.TRANSACTION_DATE = selectedRefDoc.TRANSACTION_DATE;
        }
        //===== Farm Org ==== 
        var farmOrg = $.Ctx.GetPageParam('receive_medical_trans', 'selectedFarmOrg');
        if (farmOrg !== null) {
            model.FARM_ORG = farmOrg.CODE;
            model.FARM_ORG_NAME = farmOrg.NAME;
        }
    } else {
        var mode = $.Ctx.GetPageParam('receive_medical_trans', 'Mode');
        if (mode !== 'Create') {
            var key = $.Ctx.GetPageParam('receive_medical_trans', 'Key');
            FindPurchaseMat(key.FARM_ORG, key.TRANSACTION_DATE, key.DOCUMENT_TYPE, key.DOCUMENT_EXT, function (ret) {
                //console.log(ret);
                model.FARM_ORG = ret.FARM_ORG;
                model.FARM_ORG_NAME = ret.FARM_ORG_NAME;
                model.DOCUMENT_EXT = ret.DOCUMENT_EXT;
                model.TRANSACTION_DATE = ret.TRANSACTION_DATE;
                model.REF_DOCUMENT_NO = ret.REF_DOCUMENT_NO;
                model.VENDOR_CODE = ret.VENDOR_CODE;
                model.VENDOR_NAME = ret.VENDOR_NAME;
                model.PRODUCT_CODE = ret.PRODUCT_CODE;
                model.PRODUCT_NAME = ret.PRODUCT_NAME;
                model.STOCK_KEEPING_UNIT = ret.STOCK_KEEPING_UNIT;
                model.UNIT_PACK = ret.UNIT_PACK;
                model.PRODUCT_STOCK_TYPE = ret.PRODUCT_STOCK_TYPE;
                model.ENTRY_TYPE = ret.ENTRY_TYPE;
                model.ENTRY_TYPE_NAME = ret.ENTRY_TYPE_NAME;
                model.LOT_NUMBER = ret.LOT_NUMBER;
                model.QTY = ret.QTY;
                model.WGH = ret.WGH;
                model.UNIT = ret.UNIT;
                model.NET_AMT = ret.NET_AMT;

                Model2ControlPur();
            });
        } else {//Mode Create =>Set Default
            var pParam = $.Ctx.GetPageParam('receive_medical_trans', 'param');
            var stkLoc = null;
            try {
                stkLoc = pParam[PM_STK_LOC_KEY];
            } catch (e) {//Set Default
                stkLoc = DEF_STK_LOC;
            }


        }
    }
    console.log($.Ctx.GetPageParam('receive_medical_trans', 'Data'));


});

$("#receive_medical_trans").bind("pageshow", function (event) {
    var mode = $.Ctx.GetPageParam('receive_medical_trans', 'Mode');
    if (mode == 'Update') {
        //Disable key 
        $('#receive_medical_trans #lpFarmOrg').button('disable');
        $('#receive_medical_trans #lpProduct').button('disable');
        $('#receive_medical_trans #lpRefDoc').button('disable');
    } else if (mode == 'Create') {
        $('#receive_medical_trans #lpFarmOrg').button('enable');
        $('#receive_medical_trans #lpProduct').button('enable');
        $('#receive_medical_trans #blockUnitAndAmt').hide();

    } else {
        $('#receive_medical_trans #lpFarmOrg').button('disable');
        $('#receive_medical_trans #btnSave').hide();
    }

    console.log('page show')
    Model2ControlPur();
    if ($.Ctx.GetPageParam('receive_medical_trans', 'ScrollingTo') != null) {
        //scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
        $('html, body').animate({
            scrollTop: $.Ctx.GetPageParam('receive_medical_trans', 'ScrollingTo')
        }, 0);
    }
});

function Model2ControlPur() {
    var model = $.Ctx.GetPageParam('receive_medical_trans', 'Data');
    var mode = $.Ctx.GetPageParam('receive_medical_trans', 'Mode');
    if (model !== null ) {
        if ($.Ctx.GetPageParam('receive_medical_trans', 'selectedRefDoc') != null) {
            var lookupVal = $.Ctx.GetPageParam('receive_medical_trans', 'selectedRefDoc');


            model.REF_DOCUMENT_NO = lookupVal.DOCUMENT_NO;
            model.MALE_QTY = 0;
            model.MALE_WGH = 0;
            model.UNIT = lookupVal.UNIT
            model.FEMALE_QTY = lookupVal.QTY;
            model.FEMALE_WGH = lookupVal.WGH;
            model.PRODUCT_CODE = lookupVal.PRODUCT_CODE;
            
            model.ENTRY_TYPE = lookupVal.ENTRY_TYPE; 

            
                model.PRODUCT_CODE = lookupVal.PRODUCT_CODE;
                model.PRODUCT_NAME = lookupVal.PRODUCT_NAME;
                model.STOCK_KEEPING_UNIT = lookupVal.STOCK_KEEPING_UNIT;
         
            if (model.FARM_ORG_NAME == null && model.FARM_ORG == null) {
                model.FARM_ORG = lookupVal.FARM_ORG;
                model.FARM_ORG_NAME = lookupVal.FARM_ORG_NAME;
            }
            model.DOCUMENT_EXT = lookupVal.DOCUMENT_EXT; 
        }


        if (model.PRODUCT_CODE == null || model.PRODUCT_NAME == null)
            $('#receive_medical_trans #lpProduct').text($.Ctx.Lcl('receive_medical_trans', 'msgSelect', 'Select'));
        else
            $('#receive_medical_trans #lpProduct').text(model.PRODUCT_CODE + ' ' + model.PRODUCT_NAME + ' (' + model.STOCK_KEEPING_UNIT + ')');
        $('#receive_medical_trans #lpProduct').button('refresh');

        if (model.FARM_ORG == null || model.FARM_ORG_NAME == null) {
            $('#receive_medical_trans #lpFarmOrg').text($.Ctx.Lcl('receive_medical_trans', 'msgSelect', 'Select'));
        } else
            $('#receive_medical_trans #lpFarmOrg').text(model.FARM_ORG + ' ' + model.FARM_ORG_NAME);
        $('#receive_medical_trans #lpFarmOrg').button('refresh');

        //===========REF DOC NO===========================
        if (model.REF_DOCUMENT_NO == null)
            $('#receive_medical_trans #lpRefDoc').text($.Ctx.Lcl('receive_medical_trans', 'msgSelect', 'Select'));
        else
            $("#receive_medical_trans #lpRefDoc").text(model.REF_DOCUMENT_NO + '-' + model.DOCUMENT_EXT);
        $('#receive_medical_trans #lpRefDoc').button('refresh');

        $('#receive_medical_trans #txtqty').val(model.QTY == 0 ? '' : model.QTY);
        $('#receive_medical_trans #txtWeight').val(model.WGH == 0 ? '' : model.WGH);
        $('#receive_medical_trans #txtUnit').val(model.UNIT == 0 ? '' : model.UNIT);
        $('#receive_medical_trans #total-amt').val(model.NET_AMT == 0 ? '' : model.NET_AMT);

        if (model.STOCK_KEEPING_UNIT == 'W') {
            $('#receive_medical_trans #txtqty').addClass('ui-disabled');
            $('#receive_medical_trans #txtqty').attr('readonly', 'true');

            $('#receive_medical_trans #txtWeight').removeClass('ui-disabled');
            $('#receive_medical_trans #txtWeight').removeAttr('readonly');
        } else {
            $('#receive_medical_trans #txtqty').removeClass('ui-disabled');
            $('#receive_medical_trans #txtqty').removeAttr('readonly');

            $('#receive_medical_trans #txtWeight').addClass('ui-disabled');
            $('#receive_medical_trans #txtWeight').attr('readonly', 'true');
        }

        getAvailableUsage(model, function (ret) {
            //'maxQty': maxQty, 'maxWgh': maxWgh, 'usageQty': usageQty, 'usageWgh': usageWgh });
            $('#receive_medical_trans #availableQty').text(ret.maxQty - ret.usageQty);
            $('#receive_medical_trans #availableWgh').text(ret.maxWgh - ret.usageWgh);
        });
    }
}

function SavePurTrans(SuccessCB) {
    var qty = Number($('#receive_medical_trans #txtqty').val()),
		wgh = Number($('#receive_medical_trans #txtWeight').val()),
		unit = Number($('#receive_medical_trans #txtUnit').val()),
		amt = Number($('#receive_medical_trans #total-amt').val());
    stockKeepingUnit = $.Ctx.GetPageParam('receive_medical_trans', 'Data').STOCK_KEEPING_UNIT;
    var model = $.Ctx.GetPageParam('receive_medical_trans', 'Data');

    if($.Ctx.GetPageParam('receive_medical_trans', 'selectedRefDoc') == null)
        model.REF_DOCUMENT_NO = $.trim($('#receive_medical_trans #lpRefDoc').text());

    if (_.isEmpty(model.PRODUCT_CODE)) {
        $.Ctx.MsgBox($.Ctx.Lcl('receive_medical_trans', 'msgReqProduct', 'Product is Required.'));
        SuccessCB(false); return false;
    }

    if (_.isEmpty(model.REF_DOCUMENT_NO)) {
        $.Ctx.MsgBox($.Ctx.Lcl('receive_medical_trans', 'msgReqRefDoc', 'Ref Doc is Required.'));
        SuccessCB(false); return false;
    }
    if (_.isEmpty(model.FARM_ORG)) {
        $.Ctx.MsgBox($.Ctx.Lcl('receive_medical_trans', 'msgReqFarmOrg', 'Farm Org is Required.'));
        SuccessCB(false); return false;
    }
   
    if (model.STOCK_KEEPING_UNIT == "Q") {
        if (qty <= 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('receive_medical_trans', 'msgReqQty', 'Quantity is Required.'));
            SuccessCB(false); return false;
        }
    }
/*
    if (model.ENTRY_TYPE == '1') {
        if (unit == 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('receive_medical_trans', 'msgReqUnit', 'Unit is Required.'));
            SuccessCB(false); return false;
        }
        if (amt == 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('receive_medical_trans', 'msgReqAmt', 'Amount is Required.'));
            SuccessCB(false); return false;
        }
    }
    */
    checkMedAvailable(model, function (ret) {
        if (ret) {
            var mode = $.Ctx.GetPageParam('receive_medical_trans', 'Mode');
             if (mode == 'Update') {
            SaveWithDocExt(model.DOCUMENT_EXT);
               } else {//Add
            GetDocExtPur(model , SaveWithDocExt);
             }
        }
        else {
            $.Ctx.MsgBox($.Ctx.Lcl('receive_medical_trans', 'productExceedAvailable', 'Wgh./Qty. over than available.'));
            SuccessCB(false); return false;
        }

    });

    

    function SaveWithDocExt(ext) {
        var pParam = $.Ctx.GetPageParam('receive_medical_list', 'param');
        var caltyp = 1, trantyp = null, tranCod = null, stkType = null;
        try {
            caltyp = Number(pParam[PM_STK_CAL_TYPE_KEY]);
            trantyp = pParam[PM_TRAN_TYPE_KEY];
            tranCod = pParam[PM_TRAN_COD_KEY];
            stkType = pParam[PM_STK_TYPE_KEY];
        } catch (e) {//Set Default
            caltyp = 1;
            trantyp = '1';
            tranCod = '00';
            stkType = "20";
        }
        var paramCmd = [];
        var dataM = $.Ctx.GetPageParam('receive_medical_trans', 'Data');
        var qty = Number($('#receive_medical_trans #txtqty').val()),
		wgh = Number($('#receive_medical_trans #txtWeight').val()),
		unit = Number($('#receive_medical_trans #txtUnit').val()),
		amt = Number($('#receive_medical_trans #total-amt').val());
         var cmd;
         var pur = new HH_FR_MS_MATERIAL_PURCHASE();
         var mode = $.Ctx.GetPageParam('receive_medical_trans', 'Mode');
        if (mode == 'Create') {
            pur.ORG_CODE = $.Ctx.SubOp;
            pur.FARM_ORG = dataM.FARM_ORG;
            pur.TRANSACTION_DATE = dataM.TRANSACTION_DATE;   // $.Ctx.GetBusinessDate().toDbDateStr();
            pur.DOCUMENT_TYPE = docTypeMat;
            pur.DOCUMENT_EXT = ext;
            //   pur.VENDOR_CODE = dataM.VENDOR_CODE;
            pur.REF_DOCUMENT_NO = dataM.REF_DOCUMENT_NO;
            pur.PRODUCT_CODE = dataM.PRODUCT_CODE;
            pur.PRODUCT_SPEC = '0000-0000-0000';
            pur.LOT_NUMBER = '00'; //_.isEmpty(dataM.LOT_NUMBER)==true?'00':dataM.LOT_NUMBER;
            pur.PRODUCTION_DATE = dataM.PRODUCTION_DATE == undefined ? null : dataM.PRODUCTION_DATE;
            pur.EXPIRE_DATE = dataM.EXPIRE_DATE == undefined ? null : dataM.EXPIRE_DATE;
            pur.QTY = qty;
            pur.WGH = wgh;
            pur.UNIT = unit;
            pur.NET_AMT = amt;
            pur.STOCK_TYPE = stkType;
            pur.ENTRY_TYPE = dataM.ENTRY_TYPE;
            pur.NUMBER_OF_SENDING_DATA = 0;
            pur.OWNER = $.Ctx.UserId;
            pur.CREATE_DATE = (new XDate()).toDbDateStr();
            pur.LAST_UPDATE_DATE = null; 
            pur.FUNCTION = 'A';
            cmd = pur.insertCommand($.Ctx.DbConn);
            cmd.executeNonQuery(function () {
                    ClearAfterSave();
                    $.Ctx.MsgBox($.Ctx.Lcl('receive_medical_trans', 'MsgSaveComplete', 'Save Completed.'));
                }, function () {
                    $.Ctx.MsgBox($.Ctx.Lcl('receive_medical_trans', 'MsgSaveInComplete', 'Save Incompleted.'));
            });

        } 
        else {

            var cmdSelectToUpdate = $.Ctx.DbConn.createSelectCommand();
            cmdSelectToUpdate.sqlText = "select * from HH_FR_MS_MATERIAL_PURCHASE ";
            cmdSelectToUpdate.sqlText += " where ";
            cmdSelectToUpdate.sqlText += " DOCUMENT_EXT = ? ";
            cmdSelectToUpdate.sqlText += " AND ORG_CODE = ? ";
            cmdSelectToUpdate.sqlText += " AND FARM_ORG = ? ";
            cmdSelectToUpdate.sqlText += " AND DOCUMENT_TYPE = ? ";

            cmdSelectToUpdate.parameters.push(ext);
            cmdSelectToUpdate.parameters.push($.Ctx.SubOp);
            cmdSelectToUpdate.parameters.push(dataM.FARM_ORG);
            cmdSelectToUpdate.parameters.push(docTypeMat);
            cmdSelectToUpdate.executeReader(function (tx, res) {
                if (res.rows.length != 0) {
                    var pur = new HH_FR_MS_MATERIAL_PURCHASE();
                    pur.retrieveRdr(res.rows.item(0));
                    pur.FARM_ORG = dataM.FARM_ORG;
                    pur.QTY = qty;
                    pur.WGH = wgh;
                    pur.NUMBER_OF_SENDING_DATA = 0;
                    pur.LAST_UPDATE_DATE = (new XDate()).toDbDateStr();
                    pur.FUNCTION = 'C';
                    cmd = pur.updateCommand($.Ctx.DbConn);
                    cmd.executeNonQuery(function () {

                        $.Ctx.NavigatePage($.Ctx.GetPageParam('receive_medical_trans', 'Previous'),
			null,
			{ transition: 'slide', reverse: true });
                    }, function () {
                        $.Ctx.MsgBox($.Ctx.Lcl('receive_medical_trans', 'MsgUpdateInComplete', 'Update Incompleted.'));
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



function GetDocExtPur(model ,SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT MAX(DOCUMENT_EXT) AS RUN_EXT FROM HH_FR_MS_MATERIAL_PURCHASE ";
    cmd.sqlText += "WHERE ORG_CODE=? AND TRANSACTION_DATE=? AND DOCUMENT_TYPE=? ";
    var ret = [];
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push(model.TRANSACTION_DATE);  //($.Ctx.GetBusinessDate().toDbDateStr());
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

function FindPurchaseMat(farmOrg, txDateStr, docType, docExt, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nPro = nLoc = bName = '';
    if ($.Ctx.Lang == "en-US") {
        nLoc = "ifnull(F.NAME_ENG, F.NAME_LOC)";
    } else {
        nLoc = "ifnull(F.NAME_LOC, F.NAME_ENG)";
    }
    cmd.sqlText = "SELECT  P.PRODUCT_CODE, P.PRODUCT_NAME,P.STOCK_KEEPING_UNIT,P.UNIT_PACK,P.PRODUCT_STOCK_TYPE, ";
    cmd.sqlText += "S.FARM_ORG ,{0} AS FARM_ORG_NAME, ".format([nLoc]);
    cmd.sqlText += "S.REF_DOCUMENT_NO, S.LOT_NUMBER, S.QTY, S.WGH, S.NET_AMT, S.NUMBER_OF_SENDING_DATA, ";
    cmd.sqlText += "S.ENTRY_TYPE ,  S.UNIT ";
    cmd.sqlText += "FROM HH_FR_MS_MATERIAL_PURCHASE S ";
    cmd.sqlText += "JOIN HH_PRODUCT_BU P ON S.PRODUCT_CODE=P.PRODUCT_CODE ";
    cmd.sqlText += "JOIN FR_FARM_ORG F ON (S.ORG_CODE=F.ORG_CODE AND S.FARM_ORG=F.FARM_ORG) ";
    cmd.sqlText += " WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND S.TRANSACTION_DATE=? ";
    cmd.sqlText += " AND S.DOCUMENT_TYPE=? AND S.DOCUMENT_EXT=? ";
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push(farmOrg);
    cmd.parameters.push(txDateStr);
    cmd.parameters.push(docType);
    cmd.parameters.push(docExt);
    var ret = {};
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            ret.ORG_CODE = $.Ctx.SubOp;
            ret.FARM_ORG = res.rows.item(0).FARM_ORG;
            ret.FARM_ORG_NAME = res.rows.item(0).FARM_ORG_NAME;
            ret.TRANSACTION_DATE = parseDbDateStr(txDateStr);
            ret.DOCUMENT_TYPE = docType;
            ret.DOCUMENT_EXT = docExt;
            ret.REF_DOCUMENT_NO = res.rows.item(0).REF_DOCUMENT_NO;
            ret.VENDOR_CODE = res.rows.item(0).VENDOR_CODE;
            ret.VENDOR_NAME = res.rows.item(0).VENDOR_NAME;
            ret.PRODUCT_CODE = res.rows.item(0).PRODUCT_CODE;
            ret.PRODUCT_NAME = res.rows.item(0).PRODUCT_NAME;
            ret.STOCK_KEEPING_UNIT = res.rows.item(0).STOCK_KEEPING_UNIT;
            ret.UNIT_PACK = res.rows.item(0).UNIT_PACK;
            ret.PRODUCT_STOCK_TYPE = res.rows.item(0).PRODUCT_STOCK_TYPE;
            ret.ENTRY_TYPE = res.rows.item(0).ENTRY_TYPE;
            ret.ENTRY_TYPE_NAME = res.rows.item(0).ENTRY_TYPE_NAME;
            ret.LOT_NUMBER = res.rows.item(0).LOT_NUMBER;
            ret.QTY = res.rows.item(0).QTY;
            ret.WGH = res.rows.item(0).WGH;
            ret.UNIT = res.rows.item(0).UNIT;
            ret.NET_AMT = res.rows.item(0).NET_AMT;
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
    /*
    select * from (
select matiss.* , matiss.[DOCUMENT_NO] || '-' || matiss.DOCUMENT_EXT || ' ' ||
  product.product_code || ' ' || product.product_name || '-' ||  matiss.FARM_ORG || ' ' 
  || ifnull (farmOrg.name_loc ,farmorg.name_eng)   as NAME ,  product.product_name ,
   product.STOCK_KEEPING_UNIT ,  ifnull (farmOrg.name_loc ,farmorg.name_eng)  
    as FARM_ORG_NAME  ,
    case when product.stock_keeping_unit = 'W' then 
 (select   sum (iss.WGH) 
    from HH_FR_MS_MATERIAL_ISSUED iss
   where 
  document_no = matiss.document_no
   and stock_type = matiss.stock_type
and product_code = matiss.product_code)

 when product.stock_keeping_unit = 'Q' then
 (select   sum (iss.qty)  
    from HH_FR_MS_MATERIAL_ISSUED iss
   where 
  document_no = matiss.document_no
   and stock_type = matiss.stock_type
and product_code = matiss.product_code)

end  as MAX_ISS , 
ifnull (
case when product.stock_keeping_unit = 'W' then 
(select sum (WGH) 
             from HH_FR_MS_MATERIAL_PURCHASE 
             where 
             ref_document_no = matiss.document_no
             and product_code = matiss.product_code
)
when product.stock_keeping_unit = 'Q' then 
(select sum (QTY) 
             from HH_FR_MS_MATERIAL_PURCHASE 
             where 
             ref_document_no = matiss.document_no
             and product_code = matiss.product_code
)
end ,0)as CURRENT_USE
     from HH_FR_MS_MATERIAL_ISSUED matiss
     , hh_product_bu  product ,   fr_farm_org farmOrg    
       

      
     WHERE matiss.STOCK_TYPE = ?
      AND matiss.USED is not 1  
      and matiss.PRODUCT_CODE = product.product_code
        and matiss.FARM_ORG = farmOrg.farm_org  
        order by matiss.DOCUMENT_NO asc , 
        matiss.DOCUMENT_EXT asc        
 
) 
where max_iss - current_use >0
*/


    cmd.sqlText = " select * from ( select matiss.* , matiss.[DOCUMENT_NO] || '-' || matiss.DOCUMENT_EXT || ' ' || ";
    cmd.sqlText += " product.product_code || ' ' || product.product_name || '-' || ";
    cmd.sqlText += " matiss.FARM_ORG || ' ' || ifnull (farmOrg.name_loc ,farmorg.name_eng)   as NAME , ";
    cmd.sqlText += " product.PRODUCT_NAME , product.STOCK_KEEPING_UNIT , ";
    cmd.sqlText += " ifnull (farmOrg.name_loc ,farmorg.name_eng)   as FARM_ORG_NAME  ";

    cmd.sqlText += " ,case when product.stock_keeping_unit = 'W' then (select   sum (iss.WGH)  ";
    cmd.sqlText += " from HH_FR_MS_MATERIAL_ISSUED iss where document_no = matiss.document_no ";
   cmd.sqlText += " and stock_type = matiss.stock_type and product_code = matiss.product_code) ";
   cmd.sqlText += " when product.stock_keeping_unit = 'Q' then ";
 cmd.sqlText += " (select   sum (iss.qty)  from HH_FR_MS_MATERIAL_ISSUED iss where  ";
  cmd.sqlText += " document_no = matiss.document_no and stock_type = matiss.stock_type ";
cmd.sqlText += " and product_code = matiss.product_code) end  as MAX_ISS ,  ";
cmd.sqlText += " ifnull ( case when product.stock_keeping_unit = 'W' then  ";
cmd.sqlText += " (select sum (WGH) from HH_FR_MS_MATERIAL_PURCHASE  where  ";
             cmd.sqlText += " ref_document_no = matiss.document_no and product_code = matiss.product_code ";
cmd.sqlText += " ) when product.stock_keeping_unit = 'Q' then " ;
cmd.sqlText += " (select sum (QTY)  from HH_FR_MS_MATERIAL_PURCHASE  where ";
             cmd.sqlText += " ref_document_no = matiss.document_no and product_code = matiss.product_code ";
             cmd.sqlText += " ) end ,0)as CURRENT_USE ";

    cmd.sqlText += " from HH_FR_MS_MATERIAL_ISSUED matiss , hh_product_bu  product ,  " ;
    cmd.sqlText += " fr_farm_org farmOrg ";
    cmd.sqlText += " WHERE matiss.STOCK_TYPE = ? AND matiss.USED is not 1 ";
    cmd.sqlText += " and matiss.PRODUCT_CODE = product.product_code ";
    cmd.sqlText += " and matiss.FARM_ORG = farmOrg.farm_org ";
    cmd.sqlText += " order by matiss.DOCUMENT_NO asc , matiss.DOCUMENT_EXT asc  ";
    cmd.sqlText += " ) where max_iss - current_use >0 ";
    
    
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
    var model = $.Ctx.GetPageParam('receive_medical_trans', 'Data');
   
    if (model !== null) {
        model.PRODUCTION_DATE = null;
        model.REF_DOCUMENT_NO = null;
        model.QTY = 0;
        model.WGH = 0;
        model.UNIT = 0;
        model.AMOUNT = 0;
        model.FARM_ORG = null;
        model.FARM_ORG_NAME = null;
        model.VENDOR_CODE = null;
        model.VENDOR_NAME = null;
        model.PRODUCT_CODE = null;
        model.PRODUCT_NAME = null;
            model.MALE_QTY = 0;
            model.MALE_WGH = 0;
            model.UNIT = 0
            model.FEMALE_QTY = 0;
            model.FEMALE_WGH = 0;
            model.ENTRY_TYPE = 1;
            model.STOCK_KEEPING_UNIT = null;
        $.Ctx.SetPageParam('receive_medical_trans', 'Data', model);
        $.Ctx.SetPageParam('receive_medical_trans', 'selectedRefDoc', null); 
        Model2ControlPur();
    }
}




function checkMedAvailable(model ,successCB) {

    getAvailableUsage(model, function (ret) {
        var qty = Number($('#receive_medical_trans #txtqty').val()),
		        wgh = Number($('#receive_medical_trans #txtWeight').val());

        if (model.STOCK_KEEPING_UNIT == 'Q') {
          qty +=   ret.usageQty ;
          if (qty > ret.maxQty)
                successCB(false);
            else
                successCB(true);
        } else {
            wgh += ret.usageWgh;
            if (wgh > ret.maxWgh)
                successCB(false);
            else
                successCB(true);
        }
    });

}

function getAvailableUsage(model , successCB) {
    var cmdSumMatIssued = $.Ctx.DbConn.createSelectCommand();
    cmdSumMatIssued.sqlText = "select sum (WGH) as WGH , sum (qty) as QTY ";
    cmdSumMatIssued.sqlText += " from HH_FR_MS_MATERIAL_ISSUED ";
    cmdSumMatIssued.sqlText += " where ";
    cmdSumMatIssued.sqlText += " document_no = ? ";
    cmdSumMatIssued.sqlText += " and stock_type =? ";
    cmdSumMatIssued.sqlText += " and product_code = ?";

    cmdSumMatIssued.parameters.push(model.REF_DOCUMENT_NO);
    cmdSumMatIssued.parameters.push($.Ctx.GetPageParam('receive_medical_list', 'param').product_stock_type);
    cmdSumMatIssued.parameters.push(model.PRODUCT_CODE);

    cmdSumMatIssued.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            var maxQty = res.rows.item(0).QTY;
            var maxWgh = res.rows.item(0).WGH;

            var cmdFindUsegeMed = $.Ctx.DbConn.createSelectCommand();
            cmdFindUsegeMed.sqlText = "select sum (WGH) as WGH , sum (qty) as QTY ";
            cmdFindUsegeMed.sqlText += " from HH_FR_MS_MATERIAL_PURCHASE ";
            cmdFindUsegeMed.sqlText += " where ";
            cmdFindUsegeMed.sqlText += " ref_document_no =? ";
            cmdFindUsegeMed.sqlText += " and product_code = ?";

            cmdFindUsegeMed.parameters.push(model.REF_DOCUMENT_NO);
            cmdFindUsegeMed.parameters.push(model.PRODUCT_CODE);

            cmdFindUsegeMed.executeReader(function (tx, resUsage) {
                if (resUsage.rows.length != 0) {
                    var usageQty = resUsage.rows.item(0).QTY;
                    var usageWgh = resUsage.rows.item(0).WGH;

                    successCB({ 'maxQty': maxQty, 'maxWgh': maxWgh, 'usageQty': usageQty, 'usageWgh': usageWgh });

                }
            }, function (err) {
                console.log('error from find Usage med : ' + err);
            });
        }
    }, function (err) {
        console.log('Error get sum issued : ' + err);
    });
}

