var clickAlias = "click";
//var docTypeMat = "DCTYP41";
var DEF_STK_LOC = "CENTER", DEF_ENTRY_TYP = "1";
var PM_STK_TYPE_KEY = "product_stock_type",
	PM_DOC_TYPE_KEY = "document_type",
	PM_STK_LOC_KEY = "stock_location",
	PM_STK_CAL_TYPE_KEY = "cal_type",
	PM_TRAN_TYPE_KEY = "transaction_type",
	PM_TRAN_COD_KEY = "transaction_code";
var docTypeMat = $.Ctx.GetPageParam('purchase_mat_list', 'param')[PM_DOC_TYPE_KEY];


$("#purchase_mat_trans").bind("pageinit", function (event) {

    var pParam = $.Ctx.GetPageParam('purchase_mat_list', 'param');
    try {
        $("#purchase_mat_trans #captionHeader").text($.Ctx.Lcl('purchase_mat_trans', pParam['captionHeader'], 'Purchase Material'));
    } catch (e) {
        $("#purchase_mat_trans #captionHeader").text($.Ctx.Lcl('purchase_mat_trans', 'captionHeader', 'Purchase Material'));
    }

    $('#purchase_mat_trans #btnSave').bind(clickAlias, function () {
        SavePurTrans(function (ret) {
            if (ret == true) {
                if ($.Ctx.GetPageParam('purchase_mat_trans', 'Mode') == "Create")
                    ClearAfterSave();
                $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'MsgSaveComplete', 'Save Completed.'));

            }
        });
        return false;
    });

    $('#purchase_mat_trans #lpVendor').bind(clickAlias, function () {
        $.Ctx.SetPageParam('purchase_mat_trans', 'ScrollingTo', $(window).scrollTop());
        SearchVendor(function (vens) {
            if (vens !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('purchase_mat_trans', 'MsgVendor', 'Vendor');
                p.calledPage = 'purchase_mat_trans';
                p.calledResult = 'selectedVendor';
                p.codeField = 'VENDOR_CODE';
                p.nameField = 'VENDOR_NAME';
                p.showCode = true;
                p.dataSource = vens;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgVendorNoFod', 'Vender not found.'));
            }
        });
    });

    /*	$('#purchase_mat_trans #lpCustomer').bind(clickAlias,function(){
    $.Ctx.SetPageParam('purchase_mat_trans', 'ScrollingTo',  $(window).scrollTop());
    SearchCustomerPig(function(cust){
    if (cust!==null){
    var p = new LookupParam();
    p.title = $.Ctx.Lcl('purchase_mat_trans', 'MsgCustomer', 'Customer');
    p.calledPage = 'purchase_mat_trans';
    p.calledResult = 'selectedCustomer';
    p.codeField = 'CUSTOMER_CODE';
    p.nameField = 'CUSTOMER_NAME';
    p.showCode = true;
    p.dataSource = cust;
				
    $.Ctx.SetPageParam('lookup', 'param', p);
    $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
    }else{
    $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgCustomerNoFod', 'Customer not found.'));
    }
    });
    }); */

    $('#purchase_mat_trans #lpProduct').bind(clickAlias, function () {
        $.Ctx.SetPageParam('purchase_mat_trans', 'ScrollingTo', $(window).scrollTop());
        var pParam = $.Ctx.GetPageParam('purchase_mat_list', 'param');
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
                p.title = $.Ctx.Lcl('purchase_mat_trans', 'MsgProducts', 'Products');
                p.calledPage = 'purchase_mat_trans';
                p.calledResult = 'selectedProduct';
                p.codeField = 'PRODUCT_CODE';
                p.nameField = 'PRODUCT_NAME';
                p.showCode = true;
                p.dataSource = prods;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgProductNoFod', 'Product not found.'));
            }
        });
    });

    $('#purchase_mat_trans #lpFarmOrg').bind(clickAlias, function () {
        $.Ctx.SetPageParam('purchase_mat_trans', 'ScrollingTo', $(window).scrollTop());
        var pParam = $.Ctx.GetPageParam('purchase_mat_list', 'param');
        var stkLoc = null;
        try {
            stkLoc = pParam[PM_STK_LOC_KEY];
        } catch (e) {//Set Default
            stkLoc = DEF_STK_LOC;
        }
        //SearchFarmOrg(stkLoc, function (orgs) {
        //    if (orgs !== null) {
        //        var p = new LookupParam();
        //        p.title = stkLoc == 'FARM' ? $.Ctx.Lcl('purchase_mat_trans', 'MsgFarmMng', 'Farm Manage') : $.Ctx.Lcl('purchase_mat_trans', 'MsgFarmCnt', 'Farm Center');
        //        p.calledPage = 'purchase_mat_trans';
        //        p.calledResult = 'selectedFarmOrg';
        //        p.codeField = 'CODE';
        //        p.nameField = 'NAME';
        //        p.showCode = true;
        //        p.dataSource = orgs;

        //        $.Ctx.SetPageParam('lookup', 'param', p);
        //        $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
        //    } else {
        //        $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgFarmOrgNoFod', 'Farm org not found.'));
        //    }
        //});
        $.FarmCtx.SearchFarmOrgUsingMapMobile(function (orgs) {
            if (orgs !== null) {
                var p = new LookupParam();
                p.title = stkLoc == 'FARM' ? $.Ctx.Lcl('purchase_mat_trans', 'MsgFarmMng', 'Farm Manage') : $.Ctx.Lcl('purchase_mat_trans', 'MsgFarmCnt', 'Farm Center');
                p.calledPage = 'purchase_mat_trans';
                p.calledResult = 'selectedFarmOrg';
                p.codeField = 'CODE';
                p.nameField = 'NAME';
                p.showCode = true;
                p.dataSource = orgs;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgFarmOrgNoFod', 'Farm org not found.'));
            }
        });

    });

    $('#purchase_mat_trans #lpEntryType').bind(clickAlias, function () {
        $.Ctx.SetPageParam('purchase_mat_trans', 'ScrollingTo', $(window).scrollTop());
        FindGd2FRMasTypeTran('ET', null, function (gds) {
            if (gds !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('purchase_mat_trans', 'MsgEntryType', 'Entry Type');
                p.calledPage = 'purchase_mat_trans';
                p.calledResult = 'selectedEntryType';
                p.codeField = 'CODE';
                p.nameField = 'NAME';
                p.showCode = true;
                p.dataSource = gds;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgEntypeNoFod', 'Entry type not found.'));
            }
        });
    });
    $("#purchase_mat_trans #lpRefDoc").bind('click', function () {
        $.Ctx.SetPageParam('purchase_mat_trans', 'ScrollingTo', $(window).scrollTop());
        ClearAfterSave();
        SearchIssued($.Ctx.GetPageParam('purchase_mat_list', 'param').product_stock_type, function (ret) {
            if (ret != null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('purchase_mat_trans', 'MsgSelectRedDoc', 'Select Ref. Doc');
                p.calledPage = 'purchase_mat_trans';
                p.calledResult = 'selectedRefDoc';
                p.codeField = 'DOCUMENT_NO';
                p.nameField = 'DOCUMENT_NO';
                p.showCode = false;
                p.dataSource = ret;

                $.Ctx.SetPageParam('lookup_mat_issued', 'dataSource', ret);
                $.Ctx.SetPageParam('lookup_mat_issued', 'param', p);
                $.Ctx.NavigatePage('lookup_mat_issued', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgRefDocNotFound', 'Cannot Find Ref Document.'));
            }
        });
    });



    $('#purchase_mat_trans #btnBack').bind('click', function () {
        //Check Dirty
        var dirty = false;
        var mode = $.Ctx.GetPageParam('purchase_mat_trans', 'Mode');
        var model = $.Ctx.GetPageParam('purchase_mat_trans', 'Data');
        if (mode == 'Create' && model !== null && Object.keys(model).length > 0) {
            dirty = true;
        }
        var isExit = true;
        /*if (dirty==true){
        isExit = confirm($.Ctx.Lcl('purchase_mat_trans', 'msgConfirmExit', 'Data is Dirty, Exit?'));
        }else{
        isExit=true;
        }*/
        if (isExit == true) {
            $.Ctx.NavigatePage($.Ctx.GetPageParam('purchase_mat_trans', 'Previous'),
			null,
			{ transition: 'slide', reverse: true });
        }
        return false;
    });

    $('#purchase_mat_trans input[type="number"]').focusout(function () {
        var qtyStr = $(this).val();
        //$(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
    });
    $('#purchase_mat_trans #txtRefDoc').focusout(function () {
        var model = $.Ctx.GetPageParam('purchase_mat_trans', 'Data');
        if (model == null) return false;
        model.REF_DOCUMENT_NO = $.trim($(this).val());
    });

    $('#purchase_mat_trans #txtqty').focusout(function () {
        var qtyStr = $(this).val();
        $(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
        var model = $.Ctx.GetPageParam('purchase_mat_trans', 'Data');
        if (model == null || typeof model.STOCK_KEEPING_UNIT == 'undefined' || model.STOCK_KEEPING_UNIT == null) return false;
        FocusoutCal();
    });
    $('#purchase_mat_trans #txtUnit').focusout(function () {
        var model = $.Ctx.GetPageParam('purchase_mat_trans', 'Data');
        if (model == null || typeof model.STOCK_KEEPING_UNIT == 'undefined' || model.STOCK_KEEPING_UNIT == null) return false;
        FocusoutCal();
    });
    $('#purchase_mat_trans #txtWeight').focusout(function () {
        var model = $.Ctx.GetPageParam('purchase_mat_trans', 'Data');
        if (model == null || typeof model.STOCK_KEEPING_UNIT == 'undefined' || model.STOCK_KEEPING_UNIT == null) return false;
        FocusoutCal();
    });
    $('#purchase_mat_trans #total-amt').focusout(function () {
        var model = $.Ctx.GetPageParam('purchase_mat_trans', 'Data');
        if (model == null || typeof model.ENTRY_TYPE == 'undefined') return false;
        if (model.ENTRY_TYPE == '2') {
            model.NET_AMT = 0;
            model.UNIT = 0;
            $(this).val('');
            $('#purchase_mat_trans #txtUnit').val('');
        }
        //FocusoutCal();
    });
});

function FocusoutCal() {
    var model = $.Ctx.GetPageParam('purchase_mat_trans', 'Data');
    model.QTY = Number($('#purchase_mat_trans #txtqty').val());
    model.UNIT = Number($('#purchase_mat_trans #txtUnit').val());
    model.NET_AMT = Number($('#purchase_mat_trans #total-amt').val());
    model.WGH = Number($('#purchase_mat_trans #txtWeight').val());

    //var unitPackStr = (typeof model.UNIT_PACK == 'undefined' || model.UNIT_PACK == null ? 1 : model.UNIT_PACK);
    var unitPackStr = model.UNIT_PACK;
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

$("#purchase_mat_trans").bind("pagebeforehide", function (event, ui) {
    var model = $.Ctx.GetPageParam('purchase_mat_trans', 'Data');
    if (model == null) {
        model = {};
        $.Ctx.SetPageParam('purchase_mat_trans', 'Data', model);
    }
    model.REF_DOCUMENT_NO = $('#purchase_mat_trans #txtRefDoc').val();
    model.QTY = Number($('#purchase_mat_trans #txtqty').val());
    model.WGH = Number($('#purchase_mat_trans #txtWeight').val());
    model.UNIT = Number($('#purchase_mat_trans #txtUnit').val());
    model.NET_AMT = Number($('#purchase_mat_trans #total-amt').val());

    //model.LOT_NUMBER = $('#purchase_mat_trans #txtLotNo').val();
});

$('#purchase_mat_trans').bind("pagebeforecreate", function (e) {
    $.Util.RenderUiLang('purchase_mat_trans');
    $.Ctx.RenderFooter('purchase_mat_trans');
});

$("#purchase_mat_trans").bind("pagebeforeshow", function (event, ui) {

    var pParam = $.Ctx.GetPageParam('purchase_mat_list', 'param');

    try {
        docTypeMat = pParam[PM_DOC_TYPE_KEY];
    } catch (e) {//Set Default
        docTypeMat = "P41";
    }
    var model = $.Ctx.GetPageParam('purchase_mat_trans', 'Data');
    //if (model == null) {
    //    model = {};
    //    $.Ctx.SetPageParam('purchase_mat_trans', 'Data', model);
    //}

    var prevPage = (typeof ui.prevPage[0] == 'undefined' ? "" : ui.prevPage[0].id);
    if (prevPage.indexOf("lookup") > -1) {//From Lookup		
        //====== vendor =======
        var venSel = $.Ctx.GetPageParam('purchase_mat_trans', 'selectedVendor');
        if (venSel !== null) {
            model.VENDOR_CODE = venSel.VENDOR_CODE;
            model.VENDOR_NAME = venSel.VENDOR_NAME;
        }

        //===== Farm Org ====
        var farmOrg = $.Ctx.GetPageParam('purchase_mat_trans', 'selectedFarmOrg');
        if (farmOrg !== null) {
            if (model.FARM_ORG !== farmOrg.CODE) {//clear Breeder	
            }
            model.FARM_ORG = farmOrg.CODE;
            model.FARM_ORG_NAME = farmOrg.NAME;
        }

        //====== PRODUCT =======
        var prodSel = $.Ctx.GetPageParam('purchase_mat_trans', 'selectedProduct');
        if (prodSel !== null) {
            model.PRODUCT_CODE = prodSel.PRODUCT_CODE;
            model.PRODUCT_NAME = prodSel.PRODUCT_NAME;
            //Make 
            //model.STOCK_KEEPING_UNIT = 'Q' ;
            model.STOCK_KEEPING_UNIT = prodSel.STOCK_KEEPING_UNIT;
            model.UNIT_PACK = prodSel.UNIT_PACK;
            model.PRODUCT_STOCK_TYPE = prodSel.PRODUCT_STOCK_TYPE;
            if (model.STOCK_KEEPING_UNIT == "W") {
                model.QTY = 0;
            }
        }

        //======= ENTRY_TYPE ======
        var et = $.Ctx.GetPageParam('purchase_mat_trans', 'selectedEntryType');
        if (et !== null) {
            model.ENTRY_TYPE = et.CODE;
            model.ENTRY_TYPE_NAME = et.NAME;
            if (model.ENTRY_TYPE_NAME == null) model.ENTRY_TYPE_NAME = model.ENTRY_TYPE;

            if (model.ENTRY_TYPE == '2') {
                model.NET_AMT = 0;
                model.UNIT = 0;
            }
        }

        // ===========select ref doc===============
        var selectedRefDoc = $.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc');
        if (selectedRefDoc != null) {
            model.REF_DOCUMENT_NO = selectedRefDoc.DOCUMENT_NO;
            model.PO_DOCUMENT_EXT = selectedRefDoc.PO_DOCUMENT_EXT;
            //var savedData = $.Ctx.GetPageParam("purchase_mat_trans", "Data");
            //savedData.REF_DOCUMENT_NO = model.REF_DOCUMENT_NO;
            //$.Ctx.SetPageParam("purchase_mat_trans", "Data", savedData);
            model.FARM_ORG = selectedRefDoc.FARM_ORG;
            model.QTY = selectedRefDoc.QTY;
            model.WGH = selectedRefDoc.WGH;
            model.NET_AMT = selectedRefDoc.NET_AMT;
            //model.UNIT_PACK = selectedRefDoc.UNIT;
            model.VENDOR_CODE = selectedRefDoc.VENDOR_CODE;
            model.PRODUCT_CODE = selectedRefDoc.PRODUCT_CODE;
            model.PO_DOCUMENT_NO = selectedRefDoc.PO_DOCUMENT_NO;
            model.PO_DOCUMENT_EXT = selectedRefDoc.PO_DOCUMENT_EXT;
            //$("#purchase_mat_trans #lpRefDoc").text(savedData.REF_DOCUMENT_NO);

        } else {
            $("#purchase_mat_trans #txtRefDoc").val("");
        }
    } else {
        var mode = $.Ctx.GetPageParam('purchase_mat_trans', 'Mode');
        var param = $.Ctx.GetPageParam('purchase_mat_list', 'param');
        if (mode !== 'Create') {
            var key = $.Ctx.GetPageParam('purchase_mat_trans', 'Key');
            FindPurchaseMat(key.FARM_ORG, key.TRANSACTION_DATE, key.DOCUMENT_TYPE, key.DOCUMENT_EXT, key.REF_DOCUMENT_NO, function (ret) {
                //alert('find purchase');
                console.log(ret);
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
                model.PO_DOCUMENT_NO = ret.PO_DOCUMENT_NO; model.PO_DOCUMENT_EXT = ret.PO_DOCUMENT_EXT;

                $("txtRefDoc").show();
                $("#lpRefDoc").addClass("ui-disabled");
                //$.FarmCtx.Poultry_CalculateAmountOfQuantityByRefDocWithExt(model.FARM_ORG, model.PRODUCT_CODE, param.product_stock_type, model.REF_DOCUMENT_NO, model.DOCUMENT_EXT, model.REF_DOCUMENT_NO, function (ret) {
                //    // $.Ctx.MsgBox(ret[0].QTY_SUM);
                //    if (ret != null) {
                //        console.log(ret)
                //        model.QTY_ISSUED = Number(ret[0].QTY_ISSUED);
                //        model.QTY_PURCHASE = Number(ret[0].QTY_PURCHASE);

                //        model.QTY_SUM = Number(ret[0].QTY_ISSUED) - Number(ret[0].QTY_PURCHASE)
              
//                Poultry_CalculateQtyTotal(model.PRODUCT_CODE, $.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').PO_DOCUMENT_NO, function (ret) {
//                    console.log('qty total', ret[0]);
//                    model.QTY_SUM = ret[0].QTY_SUM;
//                    // //alert(ret)
//                    Poultry_CalculateQtyUsed(model.FARM_ORG, model.PRODUCT_CODE, param.product_stock_type, model.REF_DOCUMENT_NO, model.DOCUMENT_EXT, $.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').PO_DOCUMENT_NO, function (ret) {
//                        console.log('qty used', ret[0]);
//                        model.QTY_PURCHASE = ret[0].QTY;
//                        ////alert(ret)
//                        $('#purchase_mat_trans #totalQty').text((model.QTY_PURCHASE != null ? model.QTY_SUM - model.QTY_PURCHASE + model.QTY : model.QTY_SUM + model.QTY));


//                    });
                //                });
                console.log('data', model);
                //alert\('PO NUMBER '+ model.PO_DOCUMENT_NO);
                Poultry_CalculateQtyTotal(model.PRODUCT_CODE, model.PO_DOCUMENT_NO, function (ret) {
                    console.log('qty total', ret[0]);
                    model.QTY_SUM = ret[0].QTY_SUM;
                    // //alert\(ret)
                    Poultry_CalculateQtyUsed(model.FARM_ORG, model.PRODUCT_CODE, param.product_stock_type, model.REF_DOCUMENT_NO, model.DOCUMENT_EXT, model.PO_DOCUMENT_NO, function (ret) {
                        console.log('qty used', ret[0]);
                        model.QTY_PURCHASE = ret[0].QTY;
                        ////alert\(ret)

                        $.Ctx.SetPageParam('purchase_mat_trans', 'Data', model);
                        //shit

                        Model2ControlPur()

                    });
                });



               
                //    }

                //});
            });
        } else {//Mode Create =>Set Default
            var pParam = $.Ctx.GetPageParam('purchase_mat_list', 'param');
            var stkLoc = null;
            try {
                stkLoc = pParam[PM_STK_LOC_KEY];
            } catch (e) {//Set Default
                stkLoc = DEF_STK_LOC;
            }

            // Model2ControlPur();
            //model.LOT_NUMBER = '00';
            //SearchFarmOrg(stkLoc, function (orgs) {
            //    if (orgs !== null && orgs.length > 0) {
            //        if (stkLoc.toUpperCase() == "CENTER") {
            //            model.FARM_ORG = orgs[0].CODE;
            //            model.FARM_ORG_NAME = orgs[0].NAME;
            //        } else {
            //            var x = _.where(orgs, { 'CODE': $.Ctx.Warehouse });
            //            if (!_.isEmpty(x)) {
            //                model.FARM_ORG = x[0].CODE;
            //                model.FARM_ORG_NAME = x[0].NAME;
            //            }
            //        }
            //    }
            //    FindGd2FRMasTypeTran('ET', DEF_ENTRY_TYP, function (ret) {
            //        if (ret !== null && ret.length > 0) {
            //            model.ENTRY_TYPE = ret[0].CODE;
            //            model.ENTRY_TYPE_NAME = ret[0].NAME;
            //        }
            //        Model2ControlPur();
            //    });
            //});
            Model2ControlPur()
        }
    }
    console.log($.Ctx.GetPageParam('purchase_mat_trans', 'Data'));

    ////check if the product code and vendor code are existing
    //if (model.VENDOR_CODE != null && model.PRODUCT_CODE != null) {
    //    console.log('query ref doc no.');
    //    // model.REF_DOCUMENT_NO = "";
    //    SearchIssuedByProductCodeAndVendorCode(model.PRODUCT_CODE, model.VENDOR_CODE, model.PRODUCT_STOCK_TYPE, function (ret) {
    //        console.log(ret);

    //        if (ret != null && ret.length == 1) {
    //            $("#txtRefDoc").val(ret[0].DOCUMENT_NO).trigger('create');
    //            model.QTY = ret[0].QTY;
    //            model.WGH = ret[0].WGH;
    //            model.UNIT = ret[0].UNIT;
    //            model.NET_AMT = ret[0].NET_AMT;
    //            model.REF_DOCUMENT_NO = ret[0].DOCUMENT_NO;
    //            model.FARM_ORG = ret[0].FARM_ORG;
    //            $("#refDocField").hide();
    //        } else if (ret != null && ret.length > 1) {

    //            $("#txtRefDoc").hide();
    //            $("#refDocField").show();


    //        } if (ret == null) {
    //            model.qty = 0;
    //            model.wgh = 0;
    //            model.unit = 0;
    //            model.net_amt = 0;
    //            model.REF_DOCUMENT_NO = null;

    //            $("#txtRefDoc").show();
    //            $("#txtRefDoc").text("");
    //            $("#refDocField").hide();
    //        }

    //        $.Ctx.SetPageParam('purchase_mat_trans', 'Data', model);
    //    });
    //} else if ($.Ctx.GetPageParam('purchase_mat_trans', 'Data').VENDOR_CODE != null && $.Ctx.GetPageParam('purchase_mat_trans', 'Data').PRODUCT_CODE != null) {
    //    console.log('query ref doc no.2');
    //    SearchIssuedByProductCodeAndVendorCode($.Ctx.GetPageParam('purchase_mat_trans', 'Data').PRODUCT_CODE, $.Ctx.GetPageParam('purchase_mat_trans', 'Data').VENDOR_CODE, $.Ctx.GetPageParam('purchase_mat_trans', 'Data').PRODUCT_STOCK_TYPE, function (ret) {
    //        console.log(ret);
    //        //model.REF_DOCUMENT_NO = "";
    //        if (ret != null && ret.length == 1) {
    //            $("#txtRefDoc").val(ret[0].DOCUMENT_NO).trigger('create');
    //            model.QTY = ret[0].QTY;
    //            model.WGH = ret[0].WGH;
    //            model.UNIT = ret[0].UNIT;
    //            model.NET_AMT = ret[0].NET_AMT;
    //            model.REF_DOCUMENT_NO = ret[0].DOCUMENT_NO;
    //            model.FARM_ORG = ret[0].FARM_ORG;
    //            $("#refDccField").hide();
    //        } else if (ret != null && ret.length > 1) {
    //            $("#txtRefDoc").val("");
    //            $("#txtRefDoc").hide();
    //            $("#refDocField").show();


    //        } if (ret == null) {
    //            $("#txtRefDoc").show();
    //            $("#refDocField").hide();
    //            //model.REF_DOCUMENT_NO = "";
    //            //                $("#txtRefDoc").val("")
    //            model.QTY = 0;
    //            model.WGH = 0;
    //            model.UNIT = 0;
    //            model.NET_AMT = 0;
    //        }
    //        $.Ctx.SetPageParam('purchase_mat_trans', 'Data', model);

    //    });
    //} else {
    //    console.log('one parameter is selected;')
    //    model.REF_DOCUMENT_NO = null;
    //    $("#txtRefDoc").val("");
    //    $("#refDocField").hide();
    //}
});

$("#purchase_mat_trans").bind("pageshow", function (event) {
    var mode = $.Ctx.GetPageParam('purchase_mat_trans', 'Mode');
    if (mode != 'Create') {
        //Disable key 
        $('#purchase_mat_trans #lpFarmOrg').button('disable');
        $('#purchase_mat_trans #lpVendor').button('disable');
        $('#purchase_mat_trans #lpProduct').button('disable');
        $('#purchase_mat_trans #lpEntryType').button('disable');
        $('#purchase_mat_trans #txtRefDoc').show();
        $('#purchase_mat_trans #txtRefDoc').addClass('ui-disabled');
        $('#purchase_mat_trans #txtLotNo').addClass('ui-disabled');
        $('#purchase_mat_trans #btnSave').show();

    } else if (mode == 'Create') {
        $('#purchase_mat_trans #lpFarmOrg').button('disable');
        $('#purchase_mat_trans #lpVendor').button('disable');
        $('#purchase_mat_trans #lpProduct').button('disable');
        $('#purchase_mat_trans #lpEntryType').button('disable');
        $('#purchase_mat_trans #txtRefDoc').addClass('ui-disabled');
        $('#purchase_mat_trans #txtLotNo').addClass('ui-disabled');
        $('#purchase_mat_trans #blockUnitAndAmt').hide();

    } else {
        $('#purchase_mat_trans #lpFarmOrg').button('disable');
        $('#purchase_mat_trans #btnSave').hide();
    }
    //var model = $.Ctx.GetPageParam('purchase_mat_trans', 'Data');

    console.log('page show')
    Model2ControlPur();
    if ($.Ctx.GetPageParam('purchase_mat_trans', 'ScrollingTo') != null) {
        //scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
        $('html, body').animate({
            scrollTop: $.Ctx.GetPageParam('purchase_mat_trans', 'ScrollingTo')
        }, 0);
    }
});

//function ClearAfterSave() {
//    var model = $.Ctx.GetPageParam('purchase_mat_trans', 'Data');
//    if (model !== null) {
//        model.QTY = model.WGH = model.UNIT = model.NET_AMT = 0;

//        //model.PRODUCT_CODE = null;
//        //model.PRODUCT_NAME = null;
//        //model.STOCK_KEEPING_UNIT = null;
//        //model.UNIT_PACK = null;
//        //$.Ctx.SetPageParam('purchase_mat_trans', 'selectedProduct',null);
//        Model2ControlPur();
//    }
//}

function Model2ControlPur() {
    var model = $.Ctx.GetPageParam('purchase_mat_trans', 'Data');
    var mode = $.Ctx.GetPageParam('purchase_mat_trans', 'Mode');
    var param = $.Ctx.GetPageParam('purchase_mat_list', 'param');
    var key = $.Ctx.GetPageParam('purchase_mat_trans', 'Keys')
    //  //alert\(mode)
    if (model !== null) {
        if ($.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc') != null) {
            $('#purchase_mat_trans #btnRefDoc').text($.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').DOCUMENT_NO);
            model.REF_DOCUMENT_NO = $.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').DOCUMENT_NO;
            $("#txtRefDoc").text(model.REF_DOCUMENT_NO);
            model.MALE_QTY = 0;
            model.MALE_WGH = 0;
            model.UNIT = $.Ctx.Nvl($.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').UNIT, 0);
            model.FEMALE_QTY = $.Ctx.Nvl($.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').QTY, 0);
            model.FEMALE_WGH = $.Ctx.Nvl($.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').WGH, 0);
            model.VENDOR_CODE = $.Ctx.Nvl($.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').VENDOR_CODE, null);
            model.PRODUCT_CODE = $.Ctx.Nvl($.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').PRODUCT_CODE, null);
            model.FARM_ORG = $.Ctx.Nvl($.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').FARM_ORG, null);
            model.ENTRY_TYPE = '1';
            model.ENTRY_TYPE_NAME;
            model.UNIT_PACK;
            model.QTY_SUM, model.QTY_ISSUED, model.QTY_PURCHASE;

            // model.BREEDER = $.Ctx.GetPageParam('purchase_mat_trans', 'selectedBreeder').BREEDER;
            if (model.PRODUCT_NAME == null && model.PRODUCT_CODE != null)
                Poultry_SearchProductByCode(model.PRODUCT_CODE, $.Ctx.GetPageParam('purchase_mat_list', 'param').product_stock_type, function (ret) {
                    console.log(ret);
                    model.PRODUCT_CODE = ret[0].PRODUCT_CODE;
                    model.PRODUCT_NAME = ret[0].PRODUCT_NAME;
                    model.STOCK_KEEPING_UNIT = ret[0].STOCK_KEEPING_UNIT;
                });
            if (model.VENDOR_NAME == null && model.VENDOR_CODE != null)
                Poultry_SearchVendorByCode(model.VENDOR_CODE, function (ret) {
                    console.log(ret);
                    model.VENDOR_CODE = ret[0].VENDOR_CODE;
                    model.VENDOR_NAME = ret[0].VENDOR_NAME;
                });
            if (model.FARM_ORG_NAME == null)
                Poultry_SearchFarmOrgByCode(model.FARM_ORG, $.Ctx.GetPageParam('purchase_mat_list', 'param').product_stock_type, function (ret) {
                    if (ret != null) {
                        console.log(ret);
                        model.FARM_ORG_NAME = ret[0].NAME;

                       

                    }
                });
            //calculate stock remain
            Poultry_CalculateQtyTotal(model.PRODUCT_CODE, $.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').PO_DOCUMENT_NO, function (ret) {
                console.log('qty total', ret[0]);
                model.QTY_SUM = ret[0].QTY_SUM;
                // //alert\(ret)
                Poultry_CalculateQtyUsed(model.FARM_ORG, model.PRODUCT_CODE, param.product_stock_type, model.REF_DOCUMENT_NO, model.DOCUMENT_EXT, $.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').PO_DOCUMENT_NO, function (ret) {
                    console.log('qty used', ret[0]);
                    model.QTY_PURCHASE = ret[0].QTY;
                    ////alert\(ret)
                    $('#purchase_mat_trans #totalQty').text((model.QTY_PURCHASE != null ? model.QTY_SUM - model.QTY_PURCHASE : model.QTY_SUM));


                });
            });


            if (model.UNIT_PACK == null) {
                $.FarmCtx.Poultry_SearchUnitPackFromProduct(model.PRODUCT_CODE, function (ret) {
                    if (ret != null)
                        model.UNIT_PACK = ret[0].UNIT_PACK;
                    ////alert\(model.UNIT_PACK)
                });

                if (model.ENTRY_TYPE_NAME == null) {
                    $.FarmCtx.Poultry_SearchEntryTypeByCode(model.ENTRY_TYPE, function (ret) {
                        if (ret != null)
                            model.ENTRY_TYPE_NAME = ($.Ctx.Lang == 'en-US' ? ret[0].NAME_ENG : ret[0].NAME_LOC);

                    });
                }
                if (mode == "Create") {
                    console.log('create get qty')
                    Poultry_CalculateQtyTotal(model.PRODUCT_CODE, $.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').PO_DOCUMENT_NO, function (ret) {
                        console.log('qty total', ret[0]);
                        model.QTY_SUM = ret[0].QTY_SUM;
                        // //alert\(ret)
                        Poultry_CalculateQtyUsed(model.FARM_ORG, model.PRODUCT_CODE, param.product_stock_type, model.REF_DOCUMENT_NO, model.DOCUMENT_EXT, $.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').PO_DOCUMENT_NO, function (ret) {
                            console.log('qty used', ret[0]);
                            model.QTY_PURCHASE = ret[0].QTY;
                            ////alert\(ret)
                        });
                    });

                    //                    $.FarmCtx.Poultry_CalculateAmountOfQuantityByRefDoc(model.PRODUCT_CODE, $.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').PO_DOCUMENT_NO, function (ret) {
                    //                        // $.Ctx.MsgBox(ret[0].QTY_SUM);
                    //                        if (ret != null) {
                    //                            $.Ctx.SetPageParam('purchase_mat_trans', 'QTY', ret[0]);
                    //                            model.QTY_SUM = ret[0].QTY_SUM;
                    //                            console.log("QTY_SUM", ret[0].QTY_SUM)

                    //                            $.FarmCtx.Poultry_CalculateAmountOfQuantityByRefDocWithExt(model.FARM_ORG, model.PRODUCT_CODE, param.product_stock_type, model.REF_DOCUMENT_NO, model.DOCUMENT_EXT, $.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').PO_DOCUMENT_NO, function (ret) {
                    //                                // $.Ctx.MsgBox(ret[0].QTY_SUM);
                    //                                // //alert\("UPDATE" + $.Ctx.GetPageParam('purchase_mat_trans', 'matIssued').PO_DOCUMENT_NO)
                    //                                if (ret != null) {
                    //                                    model.QTY_PURCHASE = ret[0].QTY
                    //                                    console.log("QTY_PURCHASE", ret[0].QTY)
                    //                                    //model.QTY_SUM = model.QTY_SUM - model.QTY_PURCHASE;
                    //                                    Model2ControlPur();
                    //                                }
                    //                            });
                    //                            //                            console.log(ret, model.QTY_SUM + " " + model.QTY_ISSUED + " " + model.QTY_PURCHASE)
                    //                            //                            model.QTY_SUM = Number(ret[0].QTY_ISSUED) - Number(ret[0].QTY_PURCHASE);
                    //                            //                            model.QTY_ISSUED = Number(ret[0].QTY_ISSUED);
                    //                            //                            model.QTY_PURCHASE = Number(ret[0].QTY_PURCHASE);
                    //                            //  //alert\(model.QTY_SUM+" "+model.QTY_ISSUED+" "+model.QTY_PURCHASE)
                    //                            //  Model2ControlPur()
                    //                        }

                    //                    });
                }
                //            } else {

                //                else if (mode != "Create" && model.FARM_ORG != null && model.PRODUCT_CODE != null ) { // update, qty must subtracted from total with current qty of ref doc.
                //                    $.FarmCtx.Poultry_CalculateAmountOfQuantityByRefDocWithExt(model.FARM_ORG, model.PRODUCT_CODE, param.product_stock_type, model.REF_DOCUMENT_NO, model.DOCUMENT_EXT, $.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').PO_DOCUMENT_NO, function (ret) {
                //                        // $.Ctx.MsgBox(ret[0].QTY_SUM);
                //                        // //alert\("UPDATE" + $.Ctx.GetPageParam('purchase_mat_trans', 'matIssued').PO_DOCUMENT_NO)
                //                        if (ret != null) {
                //                            console.log(ret)
                //                            $.Ctx.SetPageParam('purchase_mat_trans', 'QTY', ret[0]);
                //                            model.QTY_ISSUED = Number(ret[0].QTY_ISSUED);
                //                            model.QTY_PURCHASE = Number(ret[0].QTY_PURCHASE);
                //                            model.QTY_SUM = 0;
                //                            model.QTY_SUM = Number(ret[0].QTY_ISSUED) - (Number(model.QTY_PURCHASE) == 0 ? Number(model.QTY_PURCHASE) + model.QTY : 0);
                //                            // $("#purchase_mat_trans #totalQty").text(model.QTY_SUM);
                //                            //  //alert\(model.QTY_SUM)
                //                            //Model2ControlPur()
                //                        }

                //                    });
                //                }

                //            }

                if (mode != "Create") {
                    console.log('update get qty')
                    //alert\('update')
                    Poultry_CalculateQtyTotal(model.PRODUCT_CODE, model.PO_DOCUMENT_NO, function (ret) {
                        console.log('qty total', ret);
                    });
                    Poultry_CalculateQtyUsed(model.FARM_ORG, model.PRODUCT_CODE, param.product_stock_type, model.REF_DOCUMENT_NO, model.DOCUMENT_EXT, model.PO_DOCUMENT_NO, function (ret) {
                        console.log('qty used', ret);
                    });
                    //                    $.FarmCtx.Poultry_CalculateAmountOfQuantityByRefDoc(model.PRODUCT_CODE, $.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').PO_DOCUMENT_NO, function (ret) {
                    //                        // $.Ctx.MsgBox(ret[0].QTY_SUM);
                    //                        if (ret != null) {
                    //                            $.Ctx.SetPageParam('purchase_mat_trans', 'QTY', ret[0]);
                    //                            model.QTY_SUM = ret[0].QTY_SUM;
                    //                            console.log("QTY_SUM", ret[0].QTY_SUM)

                    //                            $.FarmCtx.Poultry_CalculateAmountOfQuantityByRefDocWithExt(model.FARM_ORG, model.PRODUCT_CODE, param.product_stock_type, model.REF_DOCUMENT_NO, model.DOCUMENT_EXT, $.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').PO_DOCUMENT_NO, function (ret) {
                    //                                // $.Ctx.MsgBox(ret[0].QTY_SUM);
                    //                                // //alert\("UPDATE" + $.Ctx.GetPageParam('purchase_mat_trans', 'matIssued').PO_DOCUMENT_NO)
                    //                                if (ret != null) {
                    //                                    model.QTY_PURCHASE = ret[0].QTY
                    //                                    //alert\(model.QTY_PURCHASE)
                    //                                  //  model.QTY_SUM = model.QTY_SUM - model.QTY_PURCHASE;
                    //                                }
                    //                            });
                    //                            //                            console.log(ret, model.QTY_SUM + " " + model.QTY_ISSUED + " " + model.QTY_PURCHASE)
                    //                            //                            model.QTY_SUM = Number(ret[0].QTY_ISSUED) - Number(ret[0].QTY_PURCHASE);
                    //                            //                            model.QTY_ISSUED = Number(ret[0].QTY_ISSUED);
                    //                            //                            model.QTY_PURCHASE = Number(ret[0].QTY_PURCHASE);
                    //                            //  //alert\(model.QTY_SUM+" "+model.QTY_ISSUED+" "+model.QTY_PURCHASE)
                    //                              Model2ControlPur()
                    //                        }

                    //                    });
                }

            }
        }
        
        if (model.VENDOR_CODE == null || model.VENDOR_NAME == null)
            $('#purchase_mat_trans #lpVendor').text($.Ctx.Lcl('purchase_mat_trans', 'msgSelect', 'Select'));
        else
            $('#purchase_mat_trans #lpVendor').text(model.VENDOR_CODE + "(" + model.VENDOR_NAME + ")");
        $('#purchase_mat_trans #lpVendor').button('refresh');

        if (model.PRODUCT_CODE == null || model.PRODUCT_NAME == null)
            $('#purchase_mat_trans #lpProduct').text($.Ctx.Lcl('purchase_mat_trans', 'msgSelect', 'Select'));
        else
            $('#purchase_mat_trans #lpProduct').text(model.PRODUCT_CODE+"("+model.PRODUCT_NAME + ' (' + model.STOCK_KEEPING_UNIT + ')'+")");
        $('#purchase_mat_trans #lpProduct').button('refresh');

        if (model.FARM_ORG == null || model.FARM_ORG_NAME == null) {
            $('#purchase_mat_trans #lpFarmOrg').text($.Ctx.Lcl('purchase_mat_trans', 'msgSelect', 'Select'));
        } else
            $('#purchase_mat_trans #lpFarmOrg').text(model.FARM_ORG + ' ' + model.FARM_ORG_NAME);
        $('#purchase_mat_trans #lpFarmOrg').button('refresh');

        if (model.ENTRY_TYPE == null)
            $('#purchase_mat_trans #lpEntryType').text($.Ctx.Lcl('purchase_mat_trans', 'msgSelect', 'Select'));
        else
            $('#purchase_mat_trans #lpEntryType').text(model.ENTRY_TYPE_NAME);
        $('#purchase_mat_trans #lpEntryType').button('refresh');
        if (model.QTY_SUM != null) {
            if (mode == 'Create')
                $('#purchase_mat_trans #totalQty').text((model.QTY_PURCHASE != null ? model.QTY_SUM - model.QTY_PURCHASE : model.QTY_SUM));
            else
                $('#purchase_mat_trans #totalQty').text((model.QTY_PURCHASE != 0 ? model.QTY_SUM -model.QTY_PURCHASE: model.QTY_SUM));

        }

        else {
            //$('#purchase_mat_trans #totalQty').text('Data Not Bind');
            $('#purchase_mat_trans #totalQty').text('0');
        }
        //===========REF DOC NO===========================
        if (model.REF_DOCUMENT_NO == null) {
            $("#txtRefDoc span").val("");
        } else {
            $("#txtRefDoc").val(model.REF_DOCUMENT_NO);
            ////console.log(model.REF_DOCUMENT_NO);
            ////console.log($.Ctx.GetPageParam("purchase_mat_trans", "selectedRefDoc").DOCUMENT_NO);

            //if ($.Ctx.GetPageParam('purchase_mat_trans', 'Mode') == "Create") {
            //    // $('#purchase_mat_trans #txtRefDoc').val($.Ctx.GetPageParam('purchase_mat_trans', 'Data').REF_DOCUMENT_NO);
            //    // $('#purchase_mat_trans #txtRefDoc').show();
            //    $("#lpRefDoc span").text(model.REF_DOCUMENT_NO);
            //    $("#lpRefDoc").button('refresh');
            //    if ($.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc') != null)
            //        $('#purchase_mat_trans #txtRefDoc').text(model.DOCUMENT_NO);
            //    else
            //        $('#purchase_mat_trans #txtRefDoc').text("Select");

            //} else {


            //    $("#lpRefDoc span").text(model.REF_DOCUMENT_NO);
            //    $("#lpRefDoc").button('refresh');

            //    $('#purchase_mat_trans #txtRefDoc').text(model.DOCUMENT_NO);

            //// ////alert\('1');
            // if ($.Ctx.GetPageParam("purchase_mat_trans", "selectedRefDoc")!= null && $.Ctx.GetPageParam("purchase_mat_trans", "selectedRefDoc").length > 1) {
            //     $('#purchase_mat_trans #refDocField').text(model.REF_DOCUMENT_NO);
            // } else {
            //     $('#purchase_mat_trans #txtRefDoc').val(model.REF_DOCUMENT_NO);
            //}
            ////		    $('#purchase_mat_trans #lpRefDoc').text(model.REF_DOCUMENT_NO);
            ////		    $('#purchase_mat_trans #lpRefDoc').button('refresh');
            ////		}
            ////======== Ref Doc ======
            //if (typeof model.REF_DOCUMENT_NO !== 'undefined' && model.REF_DOCUMENT_NO != "") {
            //    $('#purchase_mat_trans #txtRefDoc').val(model.REF_DOCUMENT_NO);
            //    // $("#refDocField").hide();
            //} else if ($.Ctx.GetPageParam("purchase_mat_trans", "selectedRefDoc") != null) {
            //    $('#purchase_mat_trans #lpRefDoc').text($.Ctx.GetPageParam("purchase_mat_trans", "selectedRefDoc").REF_DOCUMENT_NO)
            //} else {
            //    $('#purchase_mat_trans #txtRefDoc').val('');
            //    $('#purchase_mat_trans #refDocField').text($.Ctx.Lcl('purchase_mat_trans', 'msgSelect', 'Select'));
            //    $('#purchase_mat_trans #lpRefDoc').button('refresh')
            //    // $("#refDocField").hide();
            //}
        }
        /*//======== Lot No ======
        if (typeof model.LOT_NUMBER !=='undefined')
        $('#purchase_mat_trans #txtLotNo').val(model.LOT_NUMBER);
        else
        $('#purchase_mat_trans #txtLotNo').val('');*/

        $('#purchase_mat_trans #txtqty').val(model.QTY == 0 ? '' : model.QTY);
        $('#purchase_mat_trans #txtWeight').val(model.WGH == 0 ? '' : model.WGH);
        $('#purchase_mat_trans #txtUnit').val(model.UNIT == 0 ? '' : model.UNIT);
        $('#purchase_mat_trans #total-amt').val(model.NET_AMT == 0 ? '' : model.NET_AMT);

        if (model.STOCK_KEEPING_UNIT == 'W') {
            $('#purchase_mat_trans #txtqty').addClass('ui-disabled');
            $('#purchase_mat_trans #txtqty').attr('readonly', 'true');

            $('#purchase_mat_trans #txtWeight').removeClass('ui-disabled');
            $('#purchase_mat_trans #txtWeight').removeAttr('readonly');
        } else {
            $('#purchase_mat_trans #txtqty').removeClass('ui-disabled');
            $('#purchase_mat_trans #txtqty').removeAttr('readonly');

            $('#purchase_mat_trans #txtWeight').addClass('ui-disabled');
            $('#purchase_mat_trans #txtWeight').attr('readonly', 'true');
        }
        if (model.ENTRY_TYPE == '2') {
            $('#purchase_mat_trans #txtUnit').addClass('ui-disabled');
            $('#purchase_mat_trans #total-amt').addClass('ui-disabled');
            $('#purchase_mat_trans #txtUnit').attr('readonly', 'true');
            $('#purchase_mat_trans #total-amt').attr('readonly', 'true');
        } else {
            $('#purchase_mat_trans #txtUnit').removeClass('ui-disabled');
            $('#purchase_mat_trans #total-amt').removeClass('ui-disabled');
            $('#purchase_mat_trans #txtUnit').removeAttr('readonly');
            $('#purchase_mat_trans #total-amt').removeAttr('readonly');
        }
    }
}

function SavePurTrans(SuccessCB) {
    var qty = Number($('#purchase_mat_trans #txtqty').val()),
		wgh = Number($('#purchase_mat_trans #txtWeight').val()),
		unit = Number($('#purchase_mat_trans #txtUnit').val()),
		amt = Number($('#purchase_mat_trans #total-amt').val());
    stockKeepingUnit = $.Ctx.GetPageParam('purchase_mat_trans', 'Data').STOCK_KEEPING_UNIT;
    var model = $.Ctx.GetPageParam('purchase_mat_trans', 'Data');
    //alert(qty);
    if ($.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc') == null)
        model.REF_DOCUMENT_NO = $.trim($('#purchase_mat_trans #txtRefDoc').val());

    //model.LOT_NUMBER = $.trim($('#purchase_mat_trans #txtLotNo').val());

    if (_.isEmpty(model.VENDOR_CODE)) {
        $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgReqVendor', 'Vendor is Required.'));
        SuccessCB(false); return false;
    }
    if (_.isEmpty(model.PRODUCT_CODE)) {
        $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgReqProduct', 'Product is Required.'));
        SuccessCB(false); return false;
    }
    /*if (model.LOT_NUMBER==null){
    $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgReqLotNo', 'Lot number is Required.'));
    SuccessCB(false); return false;
    }*/
    if (_.isEmpty(model.REF_DOCUMENT_NO)) {
        $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgReqRefDoc', 'Ref Doc is Required.'));
        SuccessCB(false); return false;
    }
    if (_.isEmpty(model.FARM_ORG)) {
        $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgReqFarmOrg', 'Farm Org is Required.'));
        SuccessCB(false); return false;
    }
    if (_.isEmpty(model.ENTRY_TYPE)) {
        $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgReqEntryType', 'Entry type is Required.'));
        SuccessCB(false); return false;
    }
    if (model.STOCK_KEEPING_UNIT == "Q") {
        if (qty <= 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgReqQty', 'Quantity is Required.'));
            SuccessCB(false); return false;
        }
    }
    if (wgh == 0 && stockKeepingUnit != 'Q') {
        $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgReqWgh', 'Weight is Required.'));
        SuccessCB(false); return false;
    }
    if (model.ENTRY_TYPE == '1') {
        if (unit == 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgReqUnit', 'Unit is Required.'));
            SuccessCB(false); return false;
        }
        //if (amt == 0) {
        //    $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgReqAmt', 'Amount is Required.'));
        //    SuccessCB(false); return false;
        //}
    }
    if (qty > model.QTY_SUM) {
        $.Ctx.MsgBox($.Ctx.Lcl('purchase_mat_trans', 'msgQtyInvalid', 'Qty is beyond quota.'));
        SuccessCB(false); return false;
    }
    var mode = $.Ctx.GetPageParam('purchase_mat_trans', 'Mode');
    if (mode == 'Update') {
        SaveWithDocExt(model.DOCUMENT_EXT);
    } else {//Add
        // GetDocExtPur(SaveWithDocExt);
        SaveWithDocExt($.Ctx.GetPageParam('purchase_mat_trans', 'selectedRefDoc').PO_DOCUMENT_EXT);
    }

    function SaveWithDocExt(ext) {
        var pParam = $.Ctx.GetPageParam('purchase_mat_list', 'param');
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
            stkType = "10";
        }
        var paramCmd = [];
        var dataM = $.Ctx.GetPageParam('purchase_mat_trans', 'Data');
        var qty = Number($('#purchase_mat_trans #txtqty').val()),
		wgh = Number($('#purchase_mat_trans #txtWeight').val()),
		unit = Number($('#purchase_mat_trans #txtUnit').val()),
		amt = Number($('#purchase_mat_trans #total-amt').val());

        var pur = new HH_FR_MS_MATERIAL_PURCHASE();
        pur.ORG_CODE = $.Ctx.SubOp;
        pur.FARM_ORG = dataM.FARM_ORG;
        pur.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
        pur.DOCUMENT_TYPE = docTypeMat;
        pur.DOCUMENT_EXT = ext;
        pur.VENDOR_CODE = dataM.VENDOR_CODE;
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
        pur.LAST_UPDATE_DATE = (mode == 'Update' ? (new XDate()).toDbDateStr() : null);
        pur.FUNCTION = (mode == 'Update' ? 'C' : 'A');

        //var s = $.Ctx.GetBusinessDate();
        //var y = ('' + s.getFullYear()), m = ('' + (s.getMonth() + 1)).lpad("0", 2), d = ('' + s.getDate()).length == 2 ? ('' + s.getDate()) : ('' + s.getDate()).lpad("0", 2);

        var st = new S1_ST_STOCK_TRN();
        st.COMPANY = $.Ctx.ComCode;
        st.OPERATION = $.Ctx.Op;
        st.SUB_OPERATION = $.Ctx.SubOp;
        st.BUSINESS_UNIT = $.Ctx.Bu;
        st.DOCUMENT_DATE = pur.TRANSACTION_DATE;
        //st.DOC_TYPE = pur.DOCUMENT_TYPE.indexOf('DCTYP')==-1 ? 'DCTYP' + pur.DOCUMENT_TYPE : pur.DOCUMENT_TYPE ;
        st.DOC_TYPE = pur.DOCUMENT_TYPE;
        var s = $.Ctx.GetBusinessDate();
        var y = ('' + s.getFullYear()), m = ('' + (s.getMonth() + 1)).lpad("0", 2), d = ('' + s.getDate()).length == 2 ? ('' + s.getDate()) : ('' + s.getDate()).lpad("0", 2);
        var farmOrgDocNo = pur.FARM_ORG.split('-');
//        st.DOC_NUMBER = y.substr(2, 3) + m + d + farmOrgDocNo[0] + farmOrgDocNo[1];
        st.DOC_NUMBER = pur.REF_DOCUMENT_NO;
        st.EXT_NUMBER = pur.DOCUMENT_EXT;
        //st.REF_EXT_NUMBER = 0;
        st.TRN_TYPE = trantyp;
        st.TRN_CODE = tranCod;
        st.CAL_TYPE = caltyp;
        st.UNIT_LEVEL = pur.FARM_ORG;
        st.CV_CODE = pur.VENDOR_CODE;
        st.ENTRY_TYPE = pur.ENTRY_TYPE;
        st.PRODUCT_STOCK_TYPE = dataM.PRODUCT_STOCK_TYPE;
        st.PRODUCT_CODE = pur.PRODUCT_CODE;
        st.PRODUCT_SPEC = pur.PRODUCT_SPEC;
        st.LOT_NUMBER = pur.LOT_NUMBER;
        //st.TAX_RATE = 0;
        st.STOCK_KEEPING_UNIT = dataM.STOCK_KEEPING_UNIT;
        st.QUANTITY = qty;
        //st.FREE_QTY = st.FEMALE_QTY = st.MALE_QTY= 0;
        st.WEIGHT = wgh;
        //st.UM_WEIGHT =0;
        //st.FREE_WGH=0;
        st.UNIT_PRICE = unit;
        st.AMOUNT = amt;
        //st.UNIT_COST=0;
        //st.COST=0;
        //st.STD_SALES_UNIT_PRICE=0;
        //st.STD_COST_UNIT_PRICE=0;
        //st.PRINT_NO = 0;
        //st.STATUS_DATE = null;
        st.OWNER = pur.OWNER;
        st.CREATE_DATE = pur.CREATE_DATE;
        st.FUNCTION = pur.FUNCTION;
        //st.OLD_RETAIL_PRICE=0;
        //st.NEW_RETAIL_PRICE=0;
        //st.PRICE_CHANGE_QTY=0;
        //st.RETAIL_IN_VAT=0;
        //st.RETAIL_EX_VAT=0;
        //st.RECEIVED_DATE=0;
        st.WAREHOUSE_CODE = $.Ctx.Warehouse;
        st.NUMBER_OF_SENDING_DATA = 0;
        //st.SetDefaultNA();

        //var mat = new HH_FR_MS_MATERIAL_STOCK();
        //mat.DOCUMENT_NO = model.DOCUMENT_NO;
        //mat.


        var cmd, cmd2;
        if (mode == 'Update') {
            cmd = pur.updateCommand($.Ctx.DbConn);
            cmd2 = st.updateCommand($.Ctx.DbConn);
        } else {
            cmd = pur.insertCommand($.Ctx.DbConn);
            cmd2 = st.insertCommand($.Ctx.DbConn);



        }
        paramCmd.push(cmd);
        paramCmd.push(cmd2);

        var oqty = owgh = 0;
        if (mode == 'Update') {
            var key = $.Ctx.GetPageParam('purchase_mat_trans', 'Key');
            oqty = Number(key.QTY);
            owgh = Number(key.WGH);
        }
        var sb = new S1_ST_STOCK_BALANCE();
        sb.WAREHOUSE_CODE = pur.FARM_ORG;
        sb.PRODUCT_CODE = pur.PRODUCT_CODE;
        sb.QUANTITY = (qty * caltyp) + (oqty * -1 * caltyp);
        sb.WEIGHT = (wgh * caltyp) + (owgh * -1 * caltyp);

        $.FarmCtx.SetStockBalance(sb, paramCmd, function () {

            var trn = new DbTran($.Ctx.DbConn);
            trn.executeNonQuery(paramCmd, function () {
                if (typeof (SuccessCB) == "function") { UpdateMatIssued(); ClearAfterSave(); SuccessCB(true); }

                //var sqlUpdateIssued = "Update HH_FR_MS_MATERIAL_ISSUED SET USED = 1 WHERE DOCUMENT_NO = ?";
                //var cmdUpdateIssued = $.Ctx.DbConn.createSelectCommand();
                //cmdUpdateIssued.sqlText = sqlUpdateIssued;
                //cmdUpdateIssued.parameters.push(dataM.DOCUMENT_NO);
                //cmd.executeNonQuery(function (d) { console.log("update success"); }, function (e) { console.log("Update Error") });


            }, function (errors) {
                SuccessCB(false);
                console.log(errors);
            });

        }, function (err) {
            console.log(err);
        });
    }
}

function SearchVendor(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT A.VENDOR_CODE ,A.VENDOR_NAME ";
    cmd.sqlText += "FROM HH_VENDOR A JOIN HH_VENDOR_WH_BU B ON A.VENDOR_CODE=B.VENDOR_CODE ";
    cmd.sqlText += "WHERE B.BUSINESS_UNIT = ? ";
    cmd.sqlText += "AND B.SUB_OPERATION = ? ";
    //cmd.sqlText +="AND B.WAREHOUSE_CODE = ? ";

    cmd.parameters.push($.Ctx.Bu);
    cmd.parameters.push($.Ctx.SubOp);
    //cmd.parameters.push($.Ctx.Warehouse);
    cmd.executeReader(function (tx, res) {
        var dSrc = null;
        if (res.rows.length !== 0) {
            dSrc = new Array();
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_VENDOR();
                m.retrieveRdr(res.rows.item(i));
                dSrc.push(m);
            }
        }
        SuccessCB(dSrc);
    }, function (err) {
        console.log(err.message);
    });
}

function Poultry_SearchVendorByCode(vendorCode, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT A.VENDOR_CODE ,A.VENDOR_NAME ";
    cmd.sqlText += "FROM HH_VENDOR A JOIN HH_VENDOR_WH_BU B ON A.VENDOR_CODE=B.VENDOR_CODE ";
    cmd.sqlText += "WHERE B.BUSINESS_UNIT = ? ";
    cmd.sqlText += "AND B.SUB_OPERATION = ?  AND A.VENDOR_CODE = ?";
    //cmd.sqlText +="AND B.WAREHOUSE_CODE = ? ";

    cmd.parameters.push($.Ctx.Bu);
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push(vendorCode);
    cmd.executeReader(function (tx, res) {
        var dSrc = null;
        if (res.rows.length !== 0) {
            dSrc = new Array();
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_VENDOR();
                m.retrieveRdr(res.rows.item(i));
                dSrc.push(m);
            }
        }
        SuccessCB(dSrc);
    }, function (err) {
        console.log(err.message);
    });
}

function SearchCustomerPig(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT CUSTOMER_CODE, CUSTOMER_NAME,BUSINESS_UNIT FROM HH_FR_CUSTOMER_PIG WHERE BUSINESS_UNIT=? AND SUB_OPERATION =? ";
    cmd.parameters.push($.Ctx.Bu);
    cmd.parameters.push($.Ctx.SubOp);
    cmd.executeReader(function (tx, res) {
        var dSrc = null;
        if (res.rows.length !== 0) {
            dSrc = [];
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_FR_CUSTOMER_PIG();
                m.retrieveRdr(res.rows.item(i));
                if (m.CUSTOMER_CODE !== null && m.CUSTOMER_NAME !== null) dSrc.push(m);
            }
        }
        SuccessCB(dSrc);
    }, function (err) {
        console.log(err.message);
    });
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

function Poultry_SearchFarmOrgByCode(farmOrgCode, stkLoc, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = "ifnull(NAME_LOC, NAME_ENG)";
    if ($.Ctx.Lang == "en-US") {
        nameField = "ifnull(NAME_ENG, NAME_LOC)";
    }
    cmd.sqlText = "SELECT FARM_ORG AS CODE,{0} AS NAME FROM FR_FARM_ORG WHERE 1=1 ".format([nameField]);
    cmd.sqlText += " AND ORG_CODE=?  AND FARM_ORG = ?";
    if (stkLoc.toUpperCase() == "CENTER")
        cmd.sqlText += " AND PROJECT='0000' ";
    //else
    //cmd.sqlText += " AND MANAGEMENT_FLG='M'";
    cmd.sqlText += " ORDER BY FARM_ORG ";

    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push(farmOrgCode);
    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
                ret.push({ 'CODE': res.rows.item(i).CODE, 'NAME': res.rows.item(i).NAME });
            }
            if (typeof SuccessCB == 'function') Model2ControlPur(); SuccessCB(ret);
        } else {
            if (typeof SuccessCB == 'function') SuccessCB(null);
        }
    });
}

function SearchProduct(stkTyp, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    /*var nameField='';
    if ($.Ctx.Lang=="en-US")
    nameField = "ifnull(DESC_ENG, DESC_LOC)";
    else
    nameField = "ifnull(DESC_LOC, DESC_ENG)";*/
    cmd.sqlText = "SELECT * FROM HH_PRODUCT_BU WHERE BUSINESS_UNIT=?";
    var strStk = $.FarmCtx.ExtractParam(stkTyp);
    if (strStk !== '') {
        cmd.sqlText += " AND PRODUCT_STOCK_TYPE IN ({0}) ".format([strStk]);
    }
    cmd.sqlText += "ORDER BY PRODUCT_CODE ";
    cmd.parameters.push($.Ctx.Bu);
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

function Poultry_SearchProductByCode(productCode, stkTyp, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    /*var nameField='';
    if ($.Ctx.Lang=="en-US")
    nameField = "ifnull(DESC_ENG, DESC_LOC)";
    else
    nameField = "ifnull(DESC_LOC, DESC_ENG)";*/
    cmd.sqlText = "SELECT * FROM HH_PRODUCT_BU WHERE BUSINESS_UNIT=? AND PRODUCT_CODE = ? ";
    var strStk = $.FarmCtx.ExtractParam(stkTyp);
    if (strStk !== '') {
        cmd.sqlText += " AND PRODUCT_STOCK_TYPE IN ({0}) ".format([strStk]);
    }
    cmd.sqlText += "ORDER BY PRODUCT_CODE ";
    cmd.parameters.push($.Ctx.Bu);
    cmd.parameters.push(productCode);

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
            Model2ControlPur();
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    });
}


function GetDocExtPur(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT MAX(DOCUMENT_EXT) AS RUN_EXT FROM HH_FR_MS_MATERIAL_PURCHASE ";
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

function FindPurchaseMat(farmOrg, txDateStr, docType, docExt,docno, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nPro = nLoc = bName = '';
    if ($.Ctx.Lang == "en-US") {
        //nPro = "ifnull(P.DESC_ENG, P.DESC_LOC)";
        bName = "ifnull(G.DESC_ENG, G.DESC_LOC)";
        nLoc = "ifnull(F.NAME_ENG, F.NAME_LOC)";
    } else {
        //nPro = "ifnull(P.DESC_LOC, P.DESC_ENG)";
        bName = "ifnull(G.DESC_LOC, G.DESC_ENG)";
        nLoc = "ifnull(F.NAME_LOC, F.NAME_ENG)";
    }
    cmd.sqlText = "SELECT V.VENDOR_CODE, V.VENDOR_NAME, P.PRODUCT_CODE, P.PRODUCT_NAME,P.STOCK_KEEPING_UNIT,P.UNIT_PACK,P.PRODUCT_STOCK_TYPE, ";
    cmd.sqlText += "S.FARM_ORG ,{0} AS FARM_ORG_NAME, ".format([nLoc]);
    cmd.sqlText += "S.REF_DOCUMENT_NO, S.LOT_NUMBER, S.QTY, S.WGH, S.NET_AMT, S.NUMBER_OF_SENDING_DATA, ";
    cmd.sqlText += "S.ENTRY_TYPE , {0} AS ENTRY_TYPE_NAME, S.UNIT ".format([bName]);
    cmd.sqlText += ", (select PO_DOCUMENT_NO from HH_FR_MS_MATERIAL_ISSUED I WHERE I.DOCUMENT_NO = S.REF_DOCUMENT_NO and I.PO_DOCUMENT_EXT = S.DOCUMENT_EXT and I.PRODUCT_CODE = S.PRODUCT_CODE ) AS PO_DOCUMENT_NO  ";
    cmd.sqlText += "FROM HH_FR_MS_MATERIAL_PURCHASE S ";
    cmd.sqlText += "JOIN HH_VENDOR V ON S.VENDOR_CODE=V.VENDOR_CODE ";
    cmd.sqlText += "JOIN HH_PRODUCT_BU P ON S.PRODUCT_CODE=P.PRODUCT_CODE ";
    cmd.sqlText += "JOIN FR_FARM_ORG F ON (S.ORG_CODE=F.ORG_CODE AND S.FARM_ORG=F.FARM_ORG) ";
    cmd.sqlText += "JOIN HH_GD2_FR_MAS_TYPE_FARM G ON (G.GD_TYPE='ET' AND G.GD_CODE=S.ENTRY_TYPE)";
    cmd.sqlText += " WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND S.TRANSACTION_DATE=? ";
    cmd.sqlText += " AND S.DOCUMENT_TYPE=? AND S.DOCUMENT_EXT=? and S.REF_DOCUMENT_NO = ?";
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push(farmOrg);
    cmd.parameters.push(txDateStr);
    cmd.parameters.push(docType);
    cmd.parameters.push(docExt);
    cmd.parameters.push(docno);

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
            ret.PO_DOCUMENT_NO = res.rows.item(0).PO_DOCUMENT_NO;

            if (typeof SuccessCB == 'function') SuccessCB(ret);
        } else {
            if (typeof SuccessCB == 'function') SuccessCB(null);
        }
    }, function (error) {
        console.log(error);
    });
}

function FindGd2FRMasTypeTran(gdtype, gdCode, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = '';
    if ($.Ctx.Lang == "en-US")
        nameField = "ifnull(DESC_ENG, DESC_LOC)";
    else
        nameField = "ifnull(DESC_LOC, DESC_ENG)";

    cmd.sqlText = "SELECT GD_CODE AS CODE, {0} AS NAME FROM HH_GD2_FR_MAS_TYPE_FARM ".format([nameField]);
    cmd.sqlText += " WHERE GD_TYPE=? ";
    if (gdCode !== null) cmd.sqlText += " AND GD_CODE=? "
    cmd.parameters.push(gdtype);
    if (gdCode !== null) cmd.parameters.push(gdCode);
    //	cmd.sqlText +=" AND BUSINESS_UNIT = ? AND ORG_CODE = ? ORDER BY GD_CODE ";
    //    cmd.parameters.push($.Ctx.Bu)
    //    cmd.parameters.push($.Ctx.SubOp)
    cmd.sqlText += " ORDER BY GD_CODE";
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
    }, function (error) { console.log(error) });
}

function SearchIssuedByProductCodeAndVendorCode(product_code, vendor_code, stock_type, SuccessCB) {
    ////alert(product_code + " " + vendor_code);
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "select * from HH_FR_MS_MATERIAL_ISSUED WHERE PRODUCT_CODE = ? AND VENDOR_CODE = ? AND STOCK_TYPE = ? AND USED is not 1;";
    cmd.parameters.push(product_code);
    cmd.parameters.push(vendor_code);
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

function SearchIssued(stock_type, SuccessCB) {
    ////alert(product_code + " " + vendor_code);
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText += "select distinct mat.[DOCUMENT_NO], mat.PO_DOCUMENT_EXT, mat.PO_DOCUMENT_NO , mat.[ORG_CODE], mat.[FARM_ORG], "
    cmd.sqlText += " fo.[NAME_ENG], fo.[NAME_LOC], mat.[PRODUCT_CODE], mat.[VENDOR_CODE],  mat.[NET_AMT], mat.[QTY], mat.[UNIT], mat.[WGH], mat.REF_DOCUMENT_NO "
    cmd.sqlText += " from HH_FR_MS_MATERIAL_ISSUED mat  join fr_farm_org fo on "
    cmd.sqlText += " mat.[FARM_ORG] = fo.[FARM_ORG] and mat.[ORG_CODE] = fo.[ORG_CODE]  and mat.farm_org = fo.farm_org where mat.[STOCK_TYPE] = ? AND USED is not 1 ";

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
    var model = $.Ctx.GetPageParam('purchase_mat_trans', 'Data');

    if (model !== null) {
        // model.BIRTH_WEEK = null;
        //$.Ctx.SetPageParam('purchase_trans', 'selectedBirthweek', null);
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
        model.QTY_PURCHASE = null; ;
        model.QTY_SUM = null;
        // model = null;
        $("#purchase_mat_trans #txtRefDoc").val("");
        $("#purchase_mat_trans #totalQty").val("");

        $.Ctx.SetPageParam('purchase_mat_trans', 'Data', model);
       // $.Ctx.SetPageParam('purchase_mat_trans', 'selectedRefDoc', {});
        $("#purchase_mat_trans #txtRefDoc").val("");
        Model2ControlPur();
    }
}


function UpdateMatIssued() {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "UPDATE HH_FR_MS_MATERIAL_ISSUED SET USED = 1 WHERE DOCUMENT_NO = ? AND PO_DOCUMENT_EXT = ?";
    cmd.parameters.push($.Ctx.GetPageParam('purchase_mat_trans', 'Data').REF_DOCUMENT_NO);
    cmd.parameters.push($.Ctx.GetPageParam('purchase_mat_trans', 'Data').PO_DOCUMENT_EXT);
    var tran = new DbTran($.Ctx.DbConn);
    tran.executeNonQuery([cmd],
                        function (tx, res) {
                            console.log("SAVE");
                        }, function (err) {
                            console.log(err);
                        });




    //var matIssued = new HH_FR_MS_MATERIAL_ISSUED();
    //matIssued.USED = 1;
    //matIssued.DOCUMENT_NO = $.Ctx.GetPageParam('purchase_mat_trans', 'Data').REF_DOCUMENT_NO;
    //matIssued.ORG_CODE = $.Ctx.SubOp;
    //matIssued.FARM_ORG = $.Ctx.Warehouse;
    //matIssued.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
    //matIssued.DOCUMENT_TYPE = $.Ctx.GetPageParam('purchase_mat_list', 'param').document_type;
    //matIssued.DOCUMENT_EXT = 1;
    //matIssued.PRODUCT_CODE = $.Ctx.GetPageParam('purchase_mat_trans', 'Data').PRODUCT_CODE;

    //var cmd = matIssued.updateCommand($.Ctx.DbConn);
    //var trn = new DbTran($.Ctx.DbConn);
    //trn.executeNonQuery([cmd], function () {
    //    console.log('success');
    //},
    //    function () { console.log('error'); });
}

function Poultry_CalculateQtyTotal(productcode, refdoc, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "select ifnull(sum(case when p.stock_keeping_unit = 'Q' then d.qty else d.wgh end),0) AS QTY_SUM from hh_fr_ms_material_issued d, hh_product_bu p where d.product_code = p.product_code and   d.org_code = ? and d.product_code = ? and d.po_document_no = ?  and   p.business_unit = ?";

    cmd.parameters.push($.Ctx.SubOp)
    cmd.parameters.push(productcode)
    cmd.parameters.push(refdoc);
    cmd.parameters.push($.Ctx.Bu);

    console.log('calculate', cmd);

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

function Poultry_CalculateQtyUsed(farmorg, productcode, stocktype, docno, docext, refdoc, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = " select ifnull(sum(case when p.stock_keeping_unit = 'Q' then m.qty else m.wgh end),0) AS QTY from hh_fr_ms_material_purchase m, hh_fr_ms_material_issued d, hh_product_bu p  where d.product_code = p.product_code  and   p.business_unit = 'FARM_POULTRY'  and   m.ref_document_no = d.document_no and m.product_code = d.product_code  and   d.po_document_no = ? and   m.ref_document_no <> ?  and d.product_code = ? and m.stock_type = ?";

    //and m.document_ext = d.po_document_ext 

    cmd.parameters.push(refdoc);
    cmd.parameters.push(docno);
    cmd.parameters.push(productcode);
    cmd.parameters.push(stocktype);
    console.log('update calculate', cmd);
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
