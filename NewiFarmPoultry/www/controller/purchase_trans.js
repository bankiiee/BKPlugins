var clickAlias = "click";
//var docTypePur = "41";
var docTypePur = $.Ctx.GetPageParam('purchase_list', 'param').DOCUMENT_TYPE;
var transactionType = $.Ctx.GetPageParam('purchase_list', 'param').TRANSACTION_TYPE;
$("#purchase_trans").bind("pageinit", function (event) {
    /* $('#txtProduceDatePur', this).mobipick({
     intlStdDate: true,
     maxDate: $.Ctx.GetBusinessDate().toUIShortDateStr()
     });*/
    //$('#purchase_trans #txtProduceDate').val($.Ctx.GetBusinessDate().toUIShortDateStr());

    $('#purchase_trans #btnSave').bind(clickAlias, function () {
        SavePurTrans(function (ret) {
            if (ret == true) {
                $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'MsgSaveComplete', 'Save Completed.'));
                //ClearAfterSave();

                if ($.Ctx.GetPageParam('purchase_trans', 'Mode') == "Create")
                    ClearAfterSave();
                /*$.Ctx.NavigatePage($.Ctx.GetPageParam('purchase_trans', 'Previous'), null, { transition: 'slide', reverse: false });*/
            }
        });
        return false;
    });

    $('#purchase_trans #lpVendor').bind(clickAlias, function () {
        $.Ctx.SetPageParam('purchase_trans', 'ScrollingTo', $(window).scrollTop());
        SearchVendor(function (vens) {
            if (vens !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('purchase_trans', 'MsgVendor', 'Vendor');
                p.calledPage = 'purchase_trans';
                p.calledResult = 'selectedVendor';
                p.codeField = 'VENDOR_CODE';
                p.nameField = 'VENDOR_NAME';
                p.showCode = true;
                p.dataSource = vens;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgVendorNoFod', 'Vender not found.'));
            }
        });
    });

    $('#purchase_trans #lpProduct').bind(clickAlias, function () {
        $.Ctx.SetPageParam('purchase_trans', 'ScrollingTo', $(window).scrollTop());
        var pParam = $.Ctx.GetPageParam('purchase_list', 'param');
        var stkType = null;
        try {	//{"STK_TYPE":"50|51|52"}
            stkType = pParam['STK_TYPE'];
        } catch (e) {//Set Default
            stkType = "50|51|52";
        }
        var stkT = stkType.split('|');
        Poultry_SearchProduct(stkT, function (prods) {
            if (prods !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('purchase_trans', 'MsgProducts', 'Products');
                p.calledPage = 'purchase_trans';
                p.calledResult = 'selectedProduct';
                p.codeField = 'PRODUCT_CODE';
                p.nameField = 'PRODUCT_NAME';
                p.showCode = true;
                p.dataSource = prods;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            }
        });
    });

    $('#purchase_trans #lpRefDoc').bind(clickAlias, function () {
        $.Ctx.SetPageParam('purchase_trans', 'ScrollingTo', $(window).scrollTop());
        SearchIssued(function (ret) {
            if (ret == null) {
                $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgRefDocNotFound', 'No Ref. Doc. found.'));
                $("#lpRefDoc").button('disable');
            } else {
                //var p = new LookupParam();
                //p.title = $.Ctx.Lcl('purchase_trans', 'MsgRefDoc', 'Ref. Document No.');
                //p.calledPage = 'purchase_trans';
                //p.calledResult = 'selectedRefDoc';
                //p.codeField = 'DOCUMENT_NO';
                //p.nameField = 'DOCUMENT_NO';
                //p.showCode = false;
                //p.dataSource = ret;

                //$.Ctx.SetPageParam('lookup', 'param', p);
              
                    var p = new LookupParam();
                    p.title = $.Ctx.Lcl('purchase_trans', 'MsgRefDoc', 'Ref. Document No.');
                    p.calledPage = 'purchase_trans';
                    p.calledResult = 'selectedRefDoc';
                    p.codeField = 'DOCUMENT_NO';
                    p.nameField = 'DOCUMENT_NO';
                    p.showCode = false;
                    p.dataSource = ret;

                    $.Ctx.SetPageParam('lookup_mat_issued', 'param', p);
                    $.Ctx.SetPageParam('lookup_mat_issued', 'dataSource', ret);
                    $.Ctx.NavigatePage('lookup_mat_issued', null, { transition: 'slide' });
               
               
            }
        });
    });

    $('#purchase_trans #lpFarmOrg').bind(clickAlias, function () {
        $.Ctx.SetPageParam('purchase_trans', 'ScrollingTo', $(window).scrollTop());
        //SearchFarmOrg(function (orgs) {
        //    if (orgs !== null) {
        //        var p = new LookupParam();
        //        p.title = $.Ctx.Lcl('purchase_trans', 'MsgFarmOrg', 'Farm Organization');
        //        p.calledPage = 'purchase_trans';
        //        p.calledResult = 'selectedFarmOrg';
        //        p.codeField = 'CODE';
        //        p.nameField = 'NAME';
        //        p.showCode = true;
        //        p.dataSource = orgs;

        //        $.Ctx.SetPageParam('lookup', 'param', p);
        //        $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
        //    }
        //});

        $.FarmCtx.SearchFarmOrgUsingMapMobile(function (orgs) {
            if (orgs !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('purchase_trans', 'MsgFarmOrg', 'Farm Organization');
                p.calledPage = 'purchase_trans';
                p.calledResult = 'selectedFarmOrg';
                p.codeField = 'CODE';
                p.nameField = 'NAME';
                p.showCode = true;
                p.dataSource = orgs;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            }
        });


    });

    $('#purchase_trans #lpBreederCode').bind(clickAlias, function () {
        $.Ctx.SetPageParam('purchase_trans', 'ScrollingTo', $(window).scrollTop());
        SearchG3Breeder(function (breeds) {
            if (breeds !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('purchase_trans', 'MsgBreeders', 'Breeders');
                p.calledPage = 'purchase_trans';
                p.calledResult = 'selectedBreeder';
                p.codeField = 'BREEDER';
                p.nameField = 'BREEDER_NAME';
                p.showCode = true;
                p.dataSource = breeds;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgBreederNoFod', 'Breeder not found.'));
            }
        });
    });
    $('#purchase_trans #lpBirthWeek').bind(clickAlias, function () {
        $.Ctx.SetPageParam('purchase_trans', 'ScrollingTo', $(window).scrollTop());
        SearchBirthWeekInf(function (birthw) {
            if (birthw !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('purchase_trans', 'MsgBirthWeek', 'Birth Week');
                p.calledPage = 'purchase_trans';
                p.calledResult = 'selectedBirthweek';
                p.codeField = 'BIRTH_WEEK';
                p.nameField = '';
                p.showCode = true;
                p.dataSource = birthw;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgBrdWeekNotFound', 'Birthweek not found.'));
            }
        });
    });

    $('#purchase_trans #btnBack').bind('click', function () {
        //Check Dirty
        var dirty = false;
        var mode = $.Ctx.GetPageParam('purchase_trans', 'Mode');
        var model = $.Ctx.GetPageParam('purchase_trans', 'Data');
        if (mode == 'Create' && model !== null && Object.keys(model).length > 0) {
            dirty = true;
        }
        var isExit = true;
        /*if (dirty==true){
         isExit = confirm($.Ctx.Lcl('purchase_trans', 'msgConfirmExit', 'Data is Dirty, Exit?'));
         }else{
         isExit=true;
         }*/
        if (isExit == true) {
            $.Ctx.NavigatePage($.Ctx.GetPageParam('purchase_trans', 'Previous'),
                null,
                { transition: 'slide', reverse: true });
        }
        return false;
    });

//    $('#purchase_trans #male-qty').focusout(function () {
//        var qtyStr = $(this).val();
//        $(this).val(Math.floor(Number(qtyStr)));
//        if (Number($(this).val()) <= 0) {
//            $(this).val('');
//        }
//    });
    $('#purchase_trans #female-qty').focusout(function () {
        var qtyStr = $(this).val();
        $(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
        $('#purchase_trans #txtExtraFQuantity').val(Math.ceil(($(this).val() * $("#purchase_trans #txtExtraGrower").val() / 100.00)));
    });
    $('#purchase_trans #total-wt').focusout(function () {
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
    });
    $('#purchase_trans #total-amt').focusout(function () {
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
    });
    $('#purchase_trans #txtExtraGrower').focusout(function () {
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
        // alert($(this).val());
       // alert($("#purchase_trans #female-qty").val())
        $('#purchase_trans #txtExtraFQuantity').val($("#purchase_trans #female-qty").val() * ($(this).val()/ 100.00));
    });
    /*$('input').live('focus', function () {
     var $this = $(this);
     $this.select();
     // Work around Chrome's little problem
     $this.mouseup(function () {
     // Prevent further mouseup intervention
     $this.unbind("mouseup");
     return false;
     });
     });*/
});

$("#purchase_trans").bind("pagebeforehide", function (event, ui) {
    var model = $.Ctx.GetPageParam('purchase_trans', 'Data');
    if (model == null) {
        model = {};
        $.Ctx.SetPageParam('purchase_trans', 'Data', model);
    }
    model.REF_DOCUMENT_NO = $('#purchase_trans #txtRefDoc').val();
    model.MALE_QTY = Number($('#purchase_trans #male-qty').val());
    model.FEMALE_QTY = Number($('#purchase_trans #female-qty').val());

    if ($.trim($('#txtProduceDatePur').val()) !== '')
        model.PRODUCTION_DATE = parseUIDateStr($('#txtProduceDatePur').val());
    else
       // model.PRODUCTION_DATE = null;

    var totalW = Number($('#purchase_trans #total-wt').val());
    model.MALE_WGH = Number((totalW * model.MALE_QTY / (model.MALE_QTY + model.FEMALE_QTY)).toFixed(2));
    model.FEMALE_WGH = totalW - model.MALE_WGH;

    var totalAmt = Number($('#purchase_trans #total-amt').val());
    model.MALE_AMT = Number((totalAmt * model.MALE_QTY / (model.MALE_QTY + model.FEMALE_QTY)).toFixed(2));
    model.FEMALE_AMT = totalAmt - model.MALE_AMT;
});

$('#purchase_trans').bind("pagebeforecreate", function (e) {
    $.Util.RenderUiLang('purchase_trans');
    $.Ctx.RenderFooter('purchase_trans');
});

$("#purchase_trans").bind("pagebeforeshow", function (event, ui) {
    //console.log( $.Ctx.GetPageParam('purchase_trans', 'Data'));
    var model = $.Ctx.GetPageParam('purchase_trans', 'Data');
    if (model == null) {
        model = {};
        $.Ctx.SetPageParam('purchase_trans', 'Data', model);
    }

    var prevPage = (typeof ui.prevPage[0] == 'undefined' ? "" : ui.prevPage[0].id);
    if (prevPage == "lookup") {//From Lookup
        //====== CUSTOMER =======
        var venSel = $.Ctx.GetPageParam('purchase_trans', 'selectedVendor');
        if (venSel !== null) {
            model.VENDOR_CODE = venSel.VENDOR_CODE;
            model.VENDOR_NAME = venSel.VENDOR_NAME;
        }

        //===== Farm Org ====
        var farmOrg = $.Ctx.GetPageParam('purchase_trans', 'selectedFarmOrg');
        if (farmOrg !== null) {
            //if (model.FARM_ORG_LOC !== farmOrg.CODE) {//clear Breeder
            //    $.Ctx.SetPageParam('purchase_trans', 'selectedBreeder', null);
            //    $.Ctx.SetPageParam('purchase_trans', 'selectedBirthweek', null);
            //    model.BREEDER = null;
            //    model.BREEDER_NAME = null;
            //    model.BIRTH_WEEK = null;
            //}
            model.FARM_ORG_LOC = farmOrg.CODE;
            model.FARM_ORG_NAME = farmOrg.NAME;
        }

        //====== PRODUCT =======
        var prodSel = $.Ctx.GetPageParam('purchase_trans', 'selectedProduct');
        if (prodSel !== null) {
            model.PRODUCT_CODE = prodSel.PRODUCT_CODE;
            model.PRODUCT_NAME = prodSel.PRODUCT_NAME;
        }

        //======= Breeder ======
        var breed = $.Ctx.GetPageParam('purchase_trans', 'selectedBreeder');
        if (breed !== null) {
            model.BREEDER = breed.BREEDER;
            model.BREEDER_NAME = breed.BREEDER_NAME;
        }

        //======= Birth Week =====
        var birthWeek = $.Ctx.GetPageParam('purchase_trans', 'selectedBirthweek');
        if (birthWeek !== null) {
            model.BIRTH_WEEK = birthWeek.BIRTH_WEEK;
        }
    } else {
        var mode = $.Ctx.GetPageParam('purchase_trans', 'Mode');
        if (mode !== 'Create') {
            //Disable key
            var selectedPur = $.Ctx.GetPageParam('purchase_trans', 'Key');
         //   alert(JSON.stringify(key))
            FindPurchase(selectedPur.FARM_ORG_LOC, selectedPur.TRANSACTION_DATE, selectedPur.DOCUMENT_TYPE, selectedPur.DOCUMENT_EXT, function (ret) {
                console.log(ret);
                //ret.ORG_CODE;
                //ret.FARM_ORG;
                model.FARM_ORG_LOC = ret.FARM_ORG_LOC;
                model.FARM_ORG_NAME = ret.FARM_ORG_LOC_NAME;
                model.DOCUMENT_EXT = ret.DOCUMENT_EXT;
                model.TRANSACTION_DATE = ret.TRANSACTION_DATE;
                //ret.DOCUMENT_TYPE=docType;
                model.REF_DOCUMENT_NO = ret.REF_DOCUMENT_NO;
                model.VENDOR_CODE = ret.VENDOR_CODE;
                model.VENDOR_NAME = ret.VENDOR_NAME;
                model.PRODUCT_CODE = ret.PRODUCT_CODE;
                model.PRODUCT_NAME = ret.PRODUCT_NAME;
                model.BREEDER = ret.BREEDER;
                model.BREEDER_NAME = ret.BREEDER_NAME;
                model.BIRTH_WEEK = ret.BIRTH_WEEK;
                model.GRADE_CODE = ret.GRADE;
                model.MALE_QTY = ret.MALE_QTY;
                model.MALE_WGH = ret.MALE_WGH;
                model.MALE_AMT = ret.MALE_AMT;
                model.FEMALE_QTY = ret.FEMALE_QTY;
                model.FEMALE_WGH = ret.FEMALE_WGH;
                model.FEMALE_AMT = ret.FEMALE_AMT;
                model.EXTRA_PER = ret.EXTRA_PER;
                model.EXTRA_MALE_QTY = ret.EXTRA_MALE_QTY;
                model.EXTRA_FEMALE_QTY = ret.EXTRA_FEMALE_QTY;
                //model.MALE_QTY = ret.NUMBER_OF_SENDING_DATA;
                Model2Control();
            });
        } else
        {
            
           
        }
    }
    console.log($.Ctx.GetPageParam('purchase_trans', 'Data'));
});

$("#purchase_trans").bind("pageshow", function (event) {
    $('#purchase_trans #liProduceDate').hide();
    var mode = $.Ctx.GetPageParam('purchase_trans', 'Mode');
    //var self = $('#purchase_trans');
    if (mode == 'Update') {
        //Disable key
        //self.find('#lpFarmOrg').button('disable');
        //$('#purchase_trans #lpVendor').button('disable');
        //$('#purchase_trans #lpProduct').button('disable');
        //$('#purchase_trans #lpBreederCode').button('disable');
        $('#purchase_trans #lpFarmOrg').button('disable');
        $('#purchase_trans #txtRefDoc').addClass('ui-disabled')
        $('#purchase_trans #lpRefDoc').button('disable');
    } else if (mode == 'Create') {
        $('#purchase_trans #lpFarmOrg').button('enable');
        $('#purchase_trans #txtRefDoc').removeClass('ui-disabled')
        $('#purchase_trans #lpRefDoc').button('enable');
    } else {
        $('#purchase_trans #lpFarmOrg').button('disable');
        $('#purchase_trans #btnSave').hide();
    }
    if ($.Ctx.Bu == "02" || $.Ctx.Bu == "FARM_PIG") {
        $('#purchase_trans #liProduceDate').hide();
        $('#purchase_trans #liBirthWeek').show();
    } else {
        $('#purchase_trans #liProduceDate').hide();
        $('#purchase_trans #liBirthWeek').hide();
    }
    //$('#purchase_trans #lblMode').html("Mode: " + mode);
    Model2Control();
    if ($.Ctx.GetPageParam('purchase_trans', 'ScrollingTo') != null) {
        //scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
        $('html, body').animate({
            scrollTop: $.Ctx.GetPageParam('purchase_trans', 'ScrollingTo')
        }, 0);
    }
});

function ClearAfterSave() {
    var model = $.Ctx.GetPageParam('purchase_trans', 'Data');
    if (model !== null) {
        model.BIRTH_WEEK = null;
        $.Ctx.SetPageParam('purchase_trans', 'selectedBirthweek', null);
        $.Ctx.SetPageParam('purchase_trans', 'selectedRefDoc', null);
        $.Ctx.SetPageParam('purchase_trans', 'selectedVendor', null);
        $.Ctx.SetPageParam('purchase_trans', 'selectedProduct', null);

        model.PRODUCTION_DATE = null;

        model.MALE_QTY = 0;
        model.MALE_WGH = 0;
        model.MALE_AMT = 0;
        model.FEMALE_QTY = 0;
        model.FEMALE_WGH = 0;
        model.FEMALE_AMT = 0;
        model.REF_DOCUMENT_NO = null;
        model.FARM_ORG_LOC = null;
        model.VENDOR_CODE = null;
        model.PRODUCT_CODE = null;
        $("#purchase_trans #txtRefDoc").val("");
        $('#purchase_trans #lpVendor').val($.Ctx.Lcl('purchase_trans', 'msgSelect', 'Select'));
        $('#purchase_trans #lpProduct').val($.Ctx.Lcl('purchase_trans', 'msgSelect', 'Select'));
        $('#purchase_trans #lpFarmOrg').val($.Ctx.Lcl('purchase_trans', 'msgSelect', 'Select'));
        $('#purchase_trans #lpBirthWeek').val($.Ctx.Lcl('purchase_trans', 'msgSelect', 'Select'));
        //$('#purchase_trans #btnRefDoc').text($.Ctx.GetPageParam('purchase_trans', 'selectedRefDoc').DOCUMENT_NO);
        $('#purchase_trans #lpBreederCode').val($.Ctx.Lcl('purchase_trans', 'msgSelect', 'Select'));
        $('#purchase_trans #txtRefDoc').val("");
        $('#purchase_trans #male-qty').val("");
        $('#purchase_trans #female-qty').val("");
        $('#purchase_trans #total-wt').val("");
        $('#purchase_trans #total-amt').val("");
        $('#purchase_trans #txtExtraMQuantity').val("");
        $('#purchase_trans #txtExtraFQuantity').val("");
        $('#purchase_trans #txtExtraGrower').val("");
        
        $.Ctx.SetPageParam('purchase_trans', 'Data', {});
        Model2Control();
    }
}

function Model2Control() {
    //$("#purchase_trans #refDocField").hide();
    var model = $.Ctx.GetPageParam('purchase_trans', 'Data');
    //console.log('do this everytime', model);
    var param = $.Ctx.GetPageParam("purchase_list", "param");
    if (model !== null) {
        //SearchIssuedByProductCodeAndVendorCode(model.PRODUCT_CODE, model.VENDOR_CODE, param.STK_TYPE, function (ret) {

        //    if (ret != null) {
        //        if (ret.length == 1 && $.Ctx.GetPageParam('purchase_list', 'param').STK_TYPE == "30") {
        //            model.REF_DOCUMENT_NO = ret[0].DOCUMENT_NO;
        //            model.MALE_QTY = 0;
        //            model.MALE_WGH = 0;
        //            model.FEMALE_QTY = ret[0].QTY;
        //            model.FEMALE_WGH = ret[0].WGH;
        //            ///apply to control
        //            $("#purchase_trans #refDocField").hide();
        //            $("#purchase_trans #txtRefDoc").show();
        //            $('#purchase_trans #txtRefDoc').val(model.REF_DOCUMENT_NO);
        //            $('#purchase_trans #male-qty').val(model.MALE_QTY == 0 ? '' : model.MALE_QTY);
        //            $('#purchase_trans #female-qty').val(model.FEMALE_QTY == 0 ? '' : model.FEMALE_QTY);
        //            $('#purchase_trans #total-wt').val(model.MALE_WGH + model.FEMALE_WGH);
        //            $('#purchase_trans #total-amt').val(ret[0].NET_AMT);

        //            //////end apply to control
        //        } else if ($.Ctx.GetPageParam('purchase_list', 'param').STK_TYPE == "30" && ret.length > 1) {
        //            console.log(ret);
        //            $.Ctx.SetPageParam('purchase_trans', 'refDocList', ret);
        //            $("#purchase_trans #refDocField").show();
        //            $("#purchase_trans #txtRefDoc").hide();

        //        }
        //    } else {
        //        console.log('Record not found');
        //        $("#purchase_trans #refDocField").hide();
        //        $("#purchase_trans #txtRefDoc").show();
        //    }

        //});

        if (model.VENDOR_CODE == null)
            $('#purchase_trans #lpVendor').text($.Ctx.Lcl('purchase_trans', 'msgSelect', 'Select'));
        else
            $('#purchase_trans #lpVendor').text(model.VENDOR_CODE+"("+model.VENDOR_NAME+")");
        $('#purchase_trans #lpVendor').button('refresh');

        if (model.PRODUCT_CODE == null)
            $('#purchase_trans #lpProduct').text($.Ctx.Lcl('purchase_trans', 'msgSelect', 'Select'));
        else
            $('#purchase_trans #lpProduct').text(model.PRODUCT_CODE+"("+model.PRODUCT_NAME+")");
        $('#purchase_trans #lpProduct').button('refresh');

        if (model.FARM_ORG_LOC == null)
            $('#purchase_trans #lpFarmOrg').text($.Ctx.Lcl('purchase_trans', 'msgSelect', 'Select'));
        else
            $('#purchase_trans #lpFarmOrg').text(model.FARM_ORG_LOC+"("+model.FARM_ORG_NAME+")");
        $('#purchase_trans #lpFarmOrg').button('refresh');



        if (model.BIRTH_WEEK == null)
            $('#purchase_trans #lpBirthWeek').text($.Ctx.Lcl('purchase_trans', 'msgSelect', 'Select'));
        else
            $('#purchase_trans #lpBirthWeek').text(model.BIRTH_WEEK);
        $('#purchase_trans #lpBirthWeek').button('refresh');

        if (model.QTY_SUM != null)
            $('#purchase_trans #qtySum').text(model.QTY_SUM);

        if ($.Ctx.GetPageParam('purchase_trans', 'selectedRefDoc') != null ) {
            $('#purchase_trans #btnRefDoc').text($.Ctx.GetPageParam('purchase_trans', 'selectedRefDoc').DOCUMENT_NO);
            model.REF_DOCUMENT_NO = $.Ctx.GetPageParam('purchase_trans', 'selectedRefDoc').DOCUMENT_NO;
            model.MALE_QTY = 0;
            model.MALE_WGH = 0;
            model.FEMALE_QTY = Number($.Ctx.GetPageParam('purchase_trans', 'selectedRefDoc').QTY);
            model.FEMALE_WGH = Number($.Ctx.GetPageParam('purchase_trans', 'selectedRefDoc').WGH);
            model.VENDOR_CODE = $.Ctx.GetPageParam('purchase_trans', 'selectedRefDoc').VENDOR_CODE;
            model.PRODUCT_CODE = $.Ctx.GetPageParam('purchase_trans', 'selectedRefDoc').PRODUCT_CODE;
            model.VENDOR_NAME;
            model.FARM_ORG_LOC=  $.Ctx.GetPageParam('purchase_trans', 'selectedRefDoc').FARM_ORG;
            model.FARM_ORG_NAME;
            model.BREEDER;
            model.BREEDER_NAME;
            model.QTY_SUM = 0;
            model.EXTRA_PER = $.Ctx.GetPageParam('purchase_trans', 'selectedRefDoc').EXTRA_PER;
            model.EXTRA_FEMALE_QTY = Math.ceil((Number(model.FEMALE_QTY) / 100));
           // alert(model.EXTRA_FEMALE_QTY);
            //model.EXTRA_MALE_QTY = $.Ctx.GetPageParam('purchase_trans', 'selectedRefDoc').EXTRA_MALE_QTY;
            //model.UNIT_PACK;
            //model.FARM_ORG_LOC = $.Ctx.GetPageParam('purchase_trans', 'selectedRefDoc').FARM_ORG_LOC;
            // model.BREEDER = $.Ctx.GetPageParam('purchase_trans', 'selectedBreeder').BREEDER;
            if (model.PRODUCT_NAME == null && model.PRODUCT_CODE != null)
                Poultry_SearchProductByCode(model.PRODUCT_CODE, $.Ctx.GetPageParam('purchase_list', 'param').STK_TYPE, function (ret) {
                    console.log(ret);
                    if(ret != null)
                    model.PRODUCT_NAME = ret[0].PRODUCT_NAME;
                });
            //|| typeof model.VENDOR_NAME == 'undefined'
            if ((model.VENDOR_NAME == null ) && model.VENDOR_CODE != null)
                Poultry_SearchVendorByCode(model.VENDOR_CODE, function (ret) {
                    if(ret != null)
                    model.VENDOR_NAME = ret[0].VENDOR_NAME;
                });
            if (model.FARM_ORG_NAME == null && model.FARM_ORG_LOC != null)
            {
                Poultry_SearchFarmOrgByCode(model.FARM_ORG_LOC, function (ret) {
                    if(ret != null)
                        model.FARM_ORG_NAME = ($.Ctx.Lang != 'en-US'? ret[0].NAME_LOC : ret[0].NAME_ENG);
                });
            }
            if(model.UNIT_PACK == null || typeof model.UNIT_PACK  == 'undefined')
                $.FarmCtx.Poultry_SearchUnitPackFromProduct()

            //query qty sum from mat issue 
            var mode = $.Ctx.GetPageParam('purchase_trans', 'Mode');
            if (mode == "Create" && model.FARM_ORG_LOC != null && model.PRODUCT_CODE != null) {

                $.FarmCtx.Poultry_CalculateAmountOfQuantityByRefDoc(model.FARM_ORG_LOC,model.PRODUCT_CODE, param.STK_TYPE, function (ret) {
                  // $.Ctx.MsgBox(ret[0].QTY_SUM);
                   if (ret != null)
                       model.QTY_SUM = ret[0].QTY_SUM;
                  // Model2Control();
                });
            } else { // update, qty must subtracted from total with current qty of ref doc.

            }


        }


        if (model.BREEDER == null)
            $('#purchase_trans #lpBreederCode').text($.Ctx.Lcl('purchase_trans', 'msgSelect', 'Select'));
        else
            $('#purchase_trans #lpBreederCode').text(model.BREEDER_NAME);
        $('#purchase_trans #lpBreederCode').button('refresh');
        //======== Ref Doc ======
        if (typeof model.REF_DOCUMENT_NO !== 'undefined') {

            $('#purchase_trans #txtRefDoc').val(model.REF_DOCUMENT_NO);

        } else {
            $('#purchase_trans #txtRefDoc').val('');
        }
        if (model.REF_DOCUMENT_NO == null) {

            $('#purchase_trans #txtRefDoc').val("");

        }

        ///enable MALE_QTY if STK_TYP = 35 ELSE disable
        $('#purchase_trans #male-qty').addClass('ui-disabled');
        if ($.Ctx.GetPageParam('purchase_list', 'param').STK_TYPE == "35") {
            $('#purchase_trans #male-qty').removeClass('ui-disabled');
        }

        /////////////////////////////



        if (model.PRODUCTION_DATE == null)
            $('#txtProduceDatePur').val($.Ctx.GetBusinessDate().toDbDateStr());
        else
            $('#txtProduceDatePur').val((new XDate(model.PRODUCTION_DATE)).toDbDateStr());
        /*if (typeof model.PRODUCTION_DATE !=='undefined' && model.PRODUCTION_DATE !==null)
         $('#txtProduceDatePur').val(model.PRODUCTION_DATE.toUIShortDateStr());
         else
         $('#txtProduceDatePur').val('');
         */
        $('#purchase_trans #male-qty').val(model.MALE_QTY == 0 ? '' : model.MALE_QTY);
        $('#purchase_trans #female-qty').val(model.FEMALE_QTY == 0 ? '' : model.FEMALE_QTY);

        var totalW = (model.MALE_WGH == null ? 0 : model.MALE_WGH) + (model.FEMALE_WGH == null ? 0 : model.FEMALE_WGH);
        $('#purchase_trans #total-wt').val(totalW == 0 ? '' : totalW);

        var totalAmt = (model.MALE_AMT == null ? 0 : model.MALE_AMT) + (model.FEMALE_AMT == null ? 0 : model.FEMALE_AMT);
        $('#purchase_trans #total-amt').val(totalAmt == 0 ? '' : totalAmt);

        if (model.EXTRA_PER != null)
            $('#purchase_trans #txtExtraGrower').val(Number(model.EXTRA_PER));
        else
            $('#purchase_trans #txtExtraGrower').val(Number(0));

        if (model.EXTRA_MALE_QTY != null)
            $('#purchase_trans #txtExtraMQuantity').val(Number(model.EXTRA_MALE_QTY));
        else
            $('#purchase_trans #txtExtraMQuantity').val(Number(0));

        if (model.EXTRA_FEMALE_QTY != null)
            $('#purchase_trans #txtExtraFQuantity').val(Number(model.FEMALE_QTY)*Number(model.EXTRA_PER)/100.00);
        else
            $('#purchase_trans #txtExtraFQuantity').val(Number(0));

    } else {
        $('#purchase_trans #lpVendor').text($.Ctx.Lcl('purchase_trans', 'msgSelect', 'Select'));
        $('#purchase_trans #lpProduct').text($.Ctx.Lcl('purchase_trans', 'msgSelect', 'Select'));
        $('#purchase_trans #lpFarmOrg').text($.Ctx.Lcl('purchase_trans', 'msgSelect', 'Select'));
        $('#purchase_trans #lpBirthWeek').text($.Ctx.Lcl('purchase_trans', 'msgSelect', 'Select'));
        //$('#purchase_trans #btnRefDoc').text($.Ctx.GetPageParam('purchase_trans', 'selectedRefDoc').DOCUMENT_NO);
        $('#purchase_trans #lpBreederCode').text($.Ctx.Lcl('purchase_trans', 'msgSelect', 'Select'));
        $('#purchase_trans #txtRefDoc').val("");

    }
}

function SavePurTrans(SuccessCB) {
    var qtyM = Number($('#purchase_trans #male-qty').val()),
        qtyF = Number($('#purchase_trans #female-qty').val()),
        totalAmt = Number($('#purchase_trans #total-amt').val()),
        totalW = Number($('#purchase_trans #total-wt').val());
    
    var extraF = Number($('#purchase_trans #txtExtraFQuantity').val());
    var extraM = Number($('#purchase_trans #txtExtraMQuantity').val());

    var model = $.Ctx.GetPageParam('purchase_trans', 'Data');

    if ($.trim($('#txtProduceDatePur').val()) !== '')
        model.PRODUCTION_DATE = parseUIDateStr($('#txtProduceDatePur').val());
    else
        model.PRODUCTION_DATE = null;
    model.REF_DOCUMENT_NO = $.trim($('#purchase_trans #txtRefDoc').val());

    if ($.Ctx.Bu == "FARM_PIG") {
        if (model.VENDOR_CODE == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqVendor', 'Vendor is Required.'));
            SuccessCB(false);
            return false;
        }
        if (model.PRODUCT_CODE == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqProduct', 'Product is Required.'));
            SuccessCB(false);
            return false;
        }
        if (model.FARM_ORG_LOC == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqFarmOrg', 'Farm Org is Required.'));
            SuccessCB(false);
            return false;
        }
        if (model.BREEDER == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqBreeder', 'Breeder is Required.'));
            SuccessCB(false);
            return false;
        }
        if (model.BIRTH_WEEK == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqBirthWeek', 'Birth week is Required.'));
            SuccessCB(false);
            return false;
        }
        if ((qtyM + qtyF) <= 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqQty', 'Quantity is Required.'));
            SuccessCB(false);
            return false;
        }
        //if (totalW == 0) {
        //    $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqWgh', 'Total Weight is Required.'));
        //    SuccessCB(false);
        //    return false;
        //}
        //if (totalAmt == 0) {
        //    $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqAmt', 'Total Amount is Required.'));
        //    SuccessCB(false);
        //    return false;
        //}
        /*if (model.VENDOR_CODE==null||model.PRODUCT_CODE==null||model.FARM_ORG_LOC==null||
         model.BREEDER==null||model.BIRTH_WEEK==null|| (qtyM+qtyF)<=0 ){
         $.Ctx.MsgBox('กรอกข้อมูลให้ครบ และ Qty > 0');
         SuccessCB(false);
         return false;
         }*/
    }
    else {
        if (model.VENDOR_CODE == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqVendor', 'Vendor is Required.'));
            SuccessCB(false);
            return false;
        }
        if (model.PRODUCT_CODE == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqProduct', 'Product is Required.'));
            SuccessCB(false);
            return false;
        }
        if (model.FARM_ORG_LOC == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqFarmOrg', 'Farm Org is Required.'));
            SuccessCB(false);
            return false;
        }
        if (model.PRODUCTION_DATE == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqProdDate', 'Production date is Required.'));
            SuccessCB(false);
            return false;
        }
        if ((qtyM + qtyF) <= 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqQty', 'Quantity is Required.'));
            SuccessCB(false);
            return false;
        }
        if (model.BREEDER == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqBreeder', 'Breeder is Required.'));
            SuccessCB(false);
            return false;
        }
        //		if (totalW==0){
        //			$.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqWgh', 'Total Weight is Required.'));
        //			SuccessCB(false); return false;
        //		}
        //if (totalAmt == 0) {
        //    $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgReqAmt', 'Total Amount is Required.'));
        //    SuccessCB(false);
        //    return false;
        //}
    }

    var mode = $.Ctx.GetPageParam('purchase_trans', 'Mode');
    if (mode == 'Update') {
        SaveWithDocExt(model.DOCUMENT_EXT);
        /*ValidateStock(qtyM,qtyF,model.FARM_ORG_LOC,$.Ctx.GetBusinessDate(),model.BREEDER,model.BIRTH_WEEK,model.DOCUMENT_EXT, function(isSucc){
         if (isSucc==true){
         //GetDocExt(SaveWithDocExt);
         }
         });*/
    } else {//Add
        GetDocExtPur(SaveWithDocExt);
        /*ValidateStock(qtyM,qtyF,model.FARM_ORG_LOC,$.Ctx.GetBusinessDate(),model.BREEDER,model.BIRTH_WEEK, -1, function(isSucc){
         if (isSucc==true){
         }
         });*/
    }

    function SaveWithDocExt(ext) {
        //$.Ctx.MsgBox('save number ' + ext);
        var dataM = $.Ctx.GetPageParam('purchase_trans', 'Data');
        var qtyM = Number($('#purchase_trans #male-qty').val()),
            qtyF = Number($('#purchase_trans #female-qty').val()),
            totalW = Number($('#purchase_trans #total-wt').val()),
            totalAmt = Number($('#purchase_trans #total-amt').val());

        var extraF = Number(($('#purchase_trans #txtExtraFQuantity').val()==null?0:$('#purchase_trans #txtExtraFQuantity').val() ));
        var extraM = Number(($('#purchase_trans #txtExtraMQuantity').val() == null ? 0 : $('#purchase_trans #txtExtraMQuantity').val()));
        var extraPercent = Number(($('#purchase_trans #txtExtraGrower').val() == null ? 0 : $('#purchase_trans #txtExtraGrower').val()));

        var pur = new HH_FR_MS_GROWER_PURCHASE();
        pur.ORG_CODE = $.Ctx.SubOp;
        pur.FARM_ORG = $.Ctx.Warehouse;
        pur.FARM_ORG_LOC = dataM.FARM_ORG_LOC;
        pur.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
        pur.DOCUMENT_TYPE = docTypePur;
        pur.DOCUMENT_EXT = ext;
        pur.VENDOR_CODE = dataM.VENDOR_CODE;
        pur.PRODUCT_CODE = dataM.PRODUCT_CODE;
        pur.REF_DOCUMENT_NO = model.REF_DOCUMENT_NO;
        pur.BREEDER = dataM.BREEDER;
        if ($.Ctx.Bu == "FARM_PIG" || $.Ctx.Bu == "02") {
            pur.BIRTH_WEEK = dataM.BIRTH_WEEK;
        } else {
            pur.PRODUCTION_DATE = dataM.PRODUCTION_DATE.toDbDateStr();
        }
        pur.MALE_QTY = qtyM + extraM;
        pur.MALE_WGH = Number((totalW * qtyM / (qtyM + qtyF)).toFixed(2));
        pur.MALE_AMT = Number((totalAmt * qtyM / (qtyM + qtyF)).toFixed(2));
        pur.FEMALE_QTY = qtyF;
        pur.FEMALE_WGH = totalW - pur.MALE_WGH;
        pur.FEMALE_AMT = totalAmt - pur.MALE_AMT;
        //add extra//
        pur.EXTRA_MALE_QTY = extraM;
        pur.EXTRA_FEMALE_QTY = extraF;
        pur.EXTRA_PER = extraPercent;   
        ////
        pur.NUMBER_OF_SENDING_DATA = 0;
        pur.OWNER = $.Ctx.UserId;
        pur.CREATE_DATE = (new XDate()).toDbDateStr();
        pur.LAST_UPDATE_DATE = (mode == 'Update' ? (new XDate()).toDbDateStr() : null);
        pur.FUNCTION = (mode == 'Update' ? 'C' : 'A');

        var gStock = new HH_FR_MS_GROWER_STOCK();
        gStock.ORG_CODE = $.Ctx.SubOp;
        gStock.FARM_ORG = $.Ctx.Warehouse;
        gStock.FARM_ORG_LOC = pur.FARM_ORG_LOC;
        gStock.TRANSACTION_DATE = pur.TRANSACTION_DATE;
        gStock.TRANSACTION_TYPE = transactionType;
        gStock.DOCUMENT_TYPE = docTypePur;
        gStock.DOCUMENT_EXT = ext;
        gStock.BREEDER = pur.BREEDER;
        gStock.BIRTH_WEEK = pur.BIRTH_WEEK;
        gStock.MALE_QTY = pur.MALE_QTY;
        gStock.MALE_WGH = pur.MALE_WGH;
        gStock.MALE_AMT = pur.MALE_AMT;
        gStock.FEMALE_QTY = pur.FEMALE_QTY + pur.EXTRA_FEMALE_QTY;
        gStock.FEMALE_WGH = pur.FEMALE_WGH;
        gStock.FEMALE_AMT = pur.FEMALE_AMT;
        gStock.OWNER = $.Ctx.UserId;
        gStock.CREATE_DATE = pur.CREATE_DATE;
        gStock.LAST_UPDATE_DATE = pur.LAST_UPDATE_DATE;
        gStock.FUNCTION = pur.FUNCTION;
        gStock.NUMBER_OF_SENDING_DATA = 0;

        var paramCmd = [];
        var cmd, cmd2;
        if (mode == 'Update') {
            cmd = pur.updateCommand($.Ctx.DbConn);
            cmd2 = gStock.updateCommand($.Ctx.DbConn);
        } else {
            cmd = pur.insertCommand($.Ctx.DbConn);
            cmd2 = gStock.insertCommand($.Ctx.DbConn);
        }
        paramCmd.push(cmd);
        paramCmd.push(cmd2);

        var trn = new DbTran($.Ctx.DbConn);
        trn.executeNonQuery(paramCmd, function () {
            if (typeof (SuccessCB) == "function") {
                $.Ctx.SetPageParam('purchase_trans', 'singleRefDoc', pur.REF_DOCUMENT_NO); UpdateMatIssued(); ClearAfterSave(); SuccessCB(true);
            }
        }, function (errors) {
            SuccessCB(false);
            console.log(errors);
        });
    }
}

function SearchVendor(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT A.VENDOR_CODE ,A.VENDOR_NAME ";
    cmd.sqlText += "FROM HH_VENDOR A JOIN HH_VENDOR_WH_BU B ON A.VENDOR_CODE=B.VENDOR_CODE ";
    cmd.sqlText += "WHERE B.BUSINESS_UNIT = ? ";
    cmd.sqlText += "AND B.SUB_OPERATION = ? ";
    cmd.sqlText += "AND B.WAREHOUSE_CODE = ? ";

    cmd.parameters.push($.Ctx.Bu);
    //	cmd.parameters.push('FARM_PIG');
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
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
    cmd.sqlText += "AND B.SUB_OPERATION = ? ";
    cmd.sqlText += "AND B.WAREHOUSE_CODE = ?  AND A.VENDOR_CODE = ?";

    cmd.parameters.push($.Ctx.Bu);
    //	cmd.parameters.push('FARM_PIG');
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
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
            Model2Control();
        } else
        {
           // alert('null')
        }
     
        SuccessCB(dSrc);
    }, function (err) {
        console.log(err.message);
    });
}



function SearchFarmOrg(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = "ifnull(FO.NAME_LOC, FO.NAME_ENG)";
    if ($.Ctx.Lang == "en-US") {
        nameField = "ifnull(FO.NAME_ENG, FO.NAME_LOC)";
    }

    //	cmd.sqlText = "SELECT FARM_ORG AS CODE,{0} AS NAME FROM HH_FR_FARM_GROWER WHERE ORG_CODE=? AND PARENT_FARM_ORG=? ORDER BY FARM_ORG ".format([nameField]);
    cmd.sqlText = "SELECT FO.FARM_ORG AS CODE, {0} AS NAME ".format([nameField]);
    cmd.sqlText += " FROM FR_FARM_ORG FO, HH_USER_BU U  "
    cmd.sqlText += " WHERE FO.ORG_CODE = U.SUB_OPERATION AND FO.FARM_ORG = U.WAREHOUSE "
    cmd.sqlText += " AND FO.ORG_CODE = ? AND FO.PARENT_FARM_ORG = ? AND U.USER_ID = ?";

    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push($.Ctx.UserId);
    var ret = [];
    //alert(cmd.sqlText);
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                ret.push({ 'CODE': res.rows.item(i).CODE, 'NAME': res.rows.item(i).NAME });
            }
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    });
}

function SearchProduct(stkTyp, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = '';
    if ($.Ctx.Lang == "en-US")
        nameField = "ifnull(DESC_ENG, DESC_LOC)";
    else
        nameField = "ifnull(DESC_LOC, DESC_ENG)";
    cmd.sqlText = "SELECT PRODUCT_CODE, {0} AS PRODUCT_NAME FROM HH_FR_PRODUCT_GROWER ".format([nameField]);
    cmd.sqlText += "WHERE 1=1 ";
    var strStk = $.FarmCtx.ExtractParam(stkTyp);
    if (strStk !== '') {
        cmd.sqlText += " AND STOCK_TYPE IN ({0}) ".format([strStk]);
    }
    cmd.sqlText += "ORDER BY PRODUCT_CODE ";
    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                if (res.rows.item(i).PRODUCT_NAME !== null)
                    ret.push({ 'PRODUCT_CODE': res.rows.item(i).PRODUCT_CODE, 'PRODUCT_NAME': res.rows.item(i).PRODUCT_NAME });
            }
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    });
}
function Poultry_SearchProduct(stkTyp, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = '';
    if ($.Ctx.Lang == "en-US")
        nameField = "ifnull(DESC_ENG, DESC_LOC)";
    else
        nameField = "ifnull(DESC_LOC, DESC_ENG)";

    cmd.sqlText = "SELECT * FROM HH_PRODUCT_BU  WHERE BUSINESS_UNIT = ? AND PRODUCT_STOCK_TYPE = ?"
    cmd.parameters.push($.Ctx.Bu);
    cmd.parameters.push($.Ctx.GetPageParam("purchase_list", "param").STK_TYPE)
    console.log(cmd);

    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                if (res.rows.item(i).PRODUCT_NAME !== null)
                    ret.push({ 'PRODUCT_CODE': res.rows.item(i).PRODUCT_CODE, 'PRODUCT_NAME': res.rows.item(i).PRODUCT_NAME });
            }
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    });
}
    function Poultry_SearchProductByCode(productCode,stkTyp, SuccessCB) {
        var cmd = $.Ctx.DbConn.createSelectCommand();
        var nameField = '';
        if ($.Ctx.Lang == "en-US")
            nameField = "ifnull(DESC_ENG, DESC_LOC)";
        else
            nameField = "ifnull(DESC_LOC, DESC_ENG)";

        cmd.sqlText = "SELECT * FROM HH_PRODUCT_BU  WHERE BUSINESS_UNIT = ? AND PRODUCT_STOCK_TYPE = ? AND PRODUCT_CODE = ?"
        cmd.parameters.push($.Ctx.Bu);
        cmd.parameters.push($.Ctx.GetPageParam("purchase_list", "param").STK_TYPE);
        cmd.parameters.push(productCode);
        console.log(cmd);

        var ret = [];
        cmd.executeReader(function (t, res) {
            if (res.rows.length != 0) {
                for (var i = 0; i < res.rows.length; i++) {
                    if (res.rows.item(i).PRODUCT_NAME !== null)
                        ret.push({ 'PRODUCT_CODE': res.rows.item(i).PRODUCT_CODE, 'PRODUCT_NAME': res.rows.item(i).PRODUCT_NAME });
                }
                SuccessCB(ret);
                Model2Control();
            } else {
                SuccessCB(null);
            }
        });
        
    }

    function SearchG3Breeder(SuccessCB) {
        var cmd = $.Ctx.DbConn.createSelectCommand();
        var nameField = "ifnull(DESC_LOC, DESC_ENG)";
        if ($.Ctx.Lang == "en-US") {
            nameField = "ifnull(DESC_ENG, DESC_LOC)";
        }
        cmd.sqlText = "SELECT BREEDER,{0} AS BREEDER_NAME FROM GD3_FR_BREEDER WHERE ORG_CODE = ? ".format([nameField]);
        cmd.parameters.push($.Ctx.SubOp);
        var ret = [];
        cmd.executeReader(function (t, res) {
            if (res.rows.length != 0) {
                for (var i = 0; i < res.rows.length; i++) {
                    if (res.rows.item(i).BREEDER_NAME !== null)
                        ret.push({ 'BREEDER': res.rows.item(i).BREEDER, 'BREEDER_NAME': res.rows.item(i).BREEDER_NAME });
                }
                SuccessCB(ret);
            } else {
                SuccessCB(null);
            }
        });
    }

    function SearchBirthWeekInf(SuccessCB) {
        var cmd = $.Ctx.DbConn.createSelectCommand();
        cmd.sqlText = "SELECT MATE_GROUP AS BIRTH_WEEK FROM FR_MAS_WEEK_INFORMATION WHERE 1=1 ORDER BY MATE_GROUP ";
        //cmd.parameters.push($.Ctx.SubOp);
        var ret = [];
        cmd.executeReader(function (t, res) {
            if (res.rows.length != 0) {
                for (var i = 0; i < res.rows.length; i++) {
                    if (res.rows.item(i).BIRTH_WEEK !== null)
                        ret.push({ 'BIRTH_WEEK': res.rows.item(i).BIRTH_WEEK });
                }
                SuccessCB(ret);
            } else {
                SuccessCB(null);
            }
        }, function (error) {
            console.log(error);
        });
    }

    function GetDocExtPur(SuccessCB) {
        var cmd = $.Ctx.DbConn.createSelectCommand();
        cmd.sqlText = "SELECT MAX(DOCUMENT_EXT) AS RUN_EXT FROM HH_FR_MS_GROWER_PURCHASE WHERE ORG_CODE=? AND FARM_ORG=? AND TRANSACTION_DATE=? ";
        var ret = [];
        cmd.parameters.push($.Ctx.SubOp);
        cmd.parameters.push($.Ctx.Warehouse);
        cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
        //cmd.parameters.push('2012-01-05');
        cmd.executeReader(function (t, res) {
            if (res.rows.length > 0) {
                SuccessCB(res.rows.item(0).RUN_EXT == null ? 1 : res.rows.item(0).RUN_EXT + 1);
            } else {
                SuccessCB(1);
            }
        });
    }

    function ValidateStock(qtyM, qtyF, farmLoc, txDate, breeder, birWeek, docExt, FuncCB) {
        var cmd = $.Ctx.DbConn.createSelectCommand();
        cmd.sqlText = "SELECT TRANSACTION_TYPE, SUM(MALE_QTY) AS SUM_MALE,SUM(FEMALE_QTY) AS SUM_FEMALE ";
        cmd.sqlText += "FROM HH_FR_MS_GROWER_STOCK ";
        cmd.sqlText += "WHERE ORG_CODE=? AND FARM_ORG=? AND FARM_ORG_LOC=? AND TRANSACTION_DATE=? ";
        cmd.sqlText += "AND BREEDER=? AND BIRTH_WEEK=? ";
        cmd.sqlText += "GROUP BY TRANSACTION_TYPE ";
        var ret = [];
        cmd.parameters.push($.Ctx.SubOp);
        cmd.parameters.push($.Ctx.Warehouse);
        cmd.parameters.push(farmLoc);
        cmd.parameters.push(txDate.toDbDateStr());
        cmd.parameters.push(breeder);
        cmd.parameters.push(birWeek);
        if (docExt != -1) {
            //farmOrg, txDateStr, docType, docExt, SuccessCB
            FindGrowerSale(farmLoc, txDate.toDbDateStr(), docTypePur, docExt, function (ret) {
                var qtyMOld = 0, qtyFOld = 0;
                qtyMOld = ret.MALE_QTY;
                qtyFOld = ret.FEMALE_QTY;
                cmd.executeReader(function (t, res) {
                    if (res.rows.length > 0) {
                        Reader(res, qtyMOld, qtyFOld);
                    } else {
                        $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgNoStk', 'Stock Not found.'));
                        FuncCB(false);
                    }
                });
            });
        } else {
            cmd.executeReader(function (t, res) {
                if (res.rows.length > 0) {
                    Reader(res, 0, 0);
                } else {
                    $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgNoStk', 'Stock Not found.'));
                    FuncCB(false);
                }
            });
        }

        function Reader(res, qtyMOld, qtyFOld) {
            var receiveM = 0, spendM = 0, receiveF = 0, spendF = 0;
            for (var i = 0; i < res.rows.length; i++) {
                if (res.rows.item(i).TRANSACTION_TYPE == '2') {
                    spendM += (res.rows.item(i).SUM_MALE == null ? 0 : res.rows.item(i).SUM_MALE);
                    spendF += (res.rows.item(i).SUM_FEMALE == null ? 0 : res.rows.item(i).SUM_FEMALE);
                } else if (res.rows.item(i).TRANSACTION_TYPE == '1') {
                    receiveM += (res.rows.item(i).SUM_MALE == null ? 0 : res.rows.item(i).SUM_MALE);
                    receiveF += (res.rows.item(i).SUM_FEMALE == null ? 0 : res.rows.item(i).SUM_FEMALE);
                }
            }
            var succ = false;
            if ((qtyM + spendM - qtyMOld) > receiveM) {
                //key Male เกิน
                $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgMaleRem', 'Male remain ') + (receiveM - spendM + qtyMOld));
            } else {
                succ = true;
            }
            if (succ == true) {
                if ((qtyF + spendF - qtyFOld) > receiveF) {
                    //key Female เกิน
                    succ = false;
                    $.Ctx.MsgBox($.Ctx.Lcl('purchase_trans', 'msgFeMaleRem', 'Female remain ') + (receiveF - spendF + qtyFOld));
                }
            }
            FuncCB(succ);
        }
    }

    function FindPurchase(farmOrg, txDateStr, docType, docExt, SuccessCB) {
        var cmd = $.Ctx.DbConn.createSelectCommand();
        var nPro = '', nLoc = '', bName = '';
        if ($.Ctx.Lang == "en-US") {
            nPro = "ifnull(P.PRODUCT_NAME, P.PRODUCT_SHORT_NAME)";
            bName = "ifnull(B.DESC_ENG, B.DESC_LOC)";
            nLoc = "ifnull(F.NAME_ENG, F.NAME_LOC)";
        } else {
            nPro = "ifnull(P.PRODUCT_NAME, P.PRODUCT_SHORT_NAME)";
            bName = "ifnull(B.DESC_LOC, B.DESC_ENG)";
            nLoc = "ifnull(F.NAME_LOC, F.NAME_ENG)";
        }
        cmd.sqlText = "SELECT V.VENDOR_CODE,V.VENDOR_NAME,P.PRODUCT_CODE, {0} AS PRODUCT_NAME , ".format([nPro]);
        cmd.sqlText += "S.FARM_ORG_LOC ,{0} AS FARM_ORG_LOC_NAME, {1} AS BREEDER_NAME, ".format([nLoc, bName]);
        cmd.sqlText += "S.REF_DOCUMENT_NO,S.BREEDER,S.BIRTH_WEEK,S.PRODUCTION_DATE,S.MALE_QTY,S.MALE_WGH,S.MALE_AMT,S.FEMALE_QTY,S.FEMALE_WGH,S.FEMALE_AMT,S.NUMBER_OF_SENDING_DATA , S.EXTRA_PER, S.EXTRA_FEMALE_QTY, S.EXTRA_MALE_QTY  ";
        cmd.sqlText += "FROM HH_FR_MS_GROWER_PURCHASE S ";
        cmd.sqlText += "JOIN HH_VENDOR V ON S.VENDOR_CODE=V.VENDOR_CODE ";
        cmd.sqlText += "JOIN HH_PRODUCT_BU P ON S.PRODUCT_CODE=P.PRODUCT_CODE ";
        cmd.sqlText += "JOIN FR_FARM_ORG F ON S.FARM_ORG_LOC=F.FARM_ORG ";
        cmd.sqlText += "JOIN GD3_FR_BREEDER B ON S.ORG_CODE=B.ORG_CODE AND S.BREEDER=B.BREEDER ";
        cmd.sqlText += "WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND S.FARM_ORG_LOC=? AND S.TRANSACTION_DATE=? ";
        cmd.sqlText += " AND S.DOCUMENT_TYPE=? AND S.DOCUMENT_EXT=? ";
        cmd.parameters.push($.Ctx.SubOp);
        cmd.parameters.push($.Ctx.Warehouse);
        cmd.parameters.push(farmOrg);
        cmd.parameters.push(txDateStr);
        cmd.parameters.push(docType);
        cmd.parameters.push(docExt);
        var ret = {};
        cmd.executeReader(function (t, res) {
            if (res.rows.length > 0) {
                ret.ORG_CODE = $.Ctx.SubOp;
                ret.FARM_ORG = $.Ctx.Warehouse;
                ret.FARM_ORG_LOC = farmOrg;
                ret.TRANSACTION_DATE = parseDbDateStr(txDateStr);
                ret.DOCUMENT_TYPE = docType;
                ret.DOCUMENT_EXT = docExt;
                ret.REF_DOCUMENT_NO = res.rows.item(0).REF_DOCUMENT_NO;
                ret.VENDOR_CODE = res.rows.item(0).VENDOR_CODE;
                ret.VENDOR_NAME = res.rows.item(0).VENDOR_NAME;
                ret.PRODUCT_CODE = res.rows.item(0).PRODUCT_CODE;
                ret.PRODUCT_NAME = res.rows.item(0).PRODUCT_NAME;
                ret.FARM_ORG_LOC_NAME = res.rows.item(0).FARM_ORG_LOC_NAME;
                ret.BREEDER = res.rows.item(0).BREEDER;
                ret.BREEDER_NAME = res.rows.item(0).BREEDER_NAME;
                ret.BIRTH_WEEK = res.rows.item(0).BIRTH_WEEK;
                if (res.rows.item(0).PRODUCTION_DATE !== null)
                    ret.PRODUCTION_DATE = parseDbDateStr(res.rows.item(0).PRODUCTION_DATE);
                ret.MALE_QTY = res.rows.item(0).MALE_QTY;
                ret.MALE_WGH = res.rows.item(0).MALE_WGH;
                ret.MALE_AMT = res.rows.item(0).MALE_AMT;
                ret.FEMALE_QTY = res.rows.item(0).FEMALE_QTY;
                ret.FEMALE_WGH = res.rows.item(0).FEMALE_WGH;
                ret.FEMALE_AMT = res.rows.item(0).FEMALE_AMT;
                ret.NUMBER_OF_SENDING_DATA = res.rows.item(0).NUMBER_OF_SENDING_DATA;
                ret.EXTRA_PER = res.rows.item(0).EXTRA_PER;
                ret.EXTRA_FEMALE_QTY = res.rows.item(0).EXTRA_FEMALE_QTY;
                ret.EXTRA_MALE_QTY = res.rows.item(0).EXTRA_MALE_QTY;
                //alert(ret);
                SuccessCB(ret);
            } else {
                SuccessCB(null);
            }
        }, function (error) {
            console.log(error);
        });

    }

    function SearchIssued(SuccessCB) {
        //  console.log(product_code + " " + vendor_code + " " + stock_type);
        var cmd = $.Ctx.DbConn.createSelectCommand();
        cmd.sqlText += "select distinct mat.[DOCUMENT_NO],mat.PO_DOCUMENT_EXT, mat.[ORG_CODE], mat.[FARM_ORG], "
        cmd.sqlText += " fo.[NAME_ENG], fo.[NAME_LOC], mat.[PRODUCT_CODE], mat.[VENDOR_CODE],  mat.[NET_AMT], mat.[QTY], mat.[UNIT], mat.[WGH],  mat.EXTRA_PER  "
        cmd.sqlText += " from HH_FR_MS_MATERIAL_ISSUED mat  join fr_farm_org fo on "
        cmd.sqlText += " mat.[FARM_ORG] = fo.[FARM_ORG] and mat.[ORG_CODE] = fo.[ORG_CODE]  where mat.[STOCK_TYPE] = ? AND USED is not 1 group by mat.[DOCUMENT_NO];";
        cmd.parameters.push($.Ctx.GetPageParam('purchase_list', 'param').STK_TYPE);
        
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

    } function UpdateMatIssued() {

        var cmd = $.Ctx.DbConn.createSelectCommand();
        cmd.sqlText = "UPDATE HH_FR_MS_MATERIAL_ISSUED SET USED = 1 WHERE DOCUMENT_NO = ?";
        // cmd.parameters.push($.Ctx.GetPageParam('purchase_mat_trans', 'Data').REF_DOCUMENT_NO);
        cmd.parameters.push($.Ctx.GetPageParam('purchase_trans', 'singleRefDoc'));
        var tran = new DbTran($.Ctx.DbConn);
        tran.executeNonQuery([cmd],
                            function (tx, res) {

                                console.log("SAVE");
                            }, function (err) {
                                console.log(err);
                            });

    }

    function Poultry_SearchFarmOrgByCode(farmorg, SuccessCB) {
        var cmd = $.Ctx.DbConn.createSelectCommand();
        cmd.sqlText = "select distinct * from fr_farm_org fo where FO.FARM_ORG = ?;"
       
        cmd.parameters.push(farmorg);

        var ret = [];
        cmd.executeReader(function (t, res) {
            if (res.rows.length > 0) {
                for (var i = 0; i < res.rows.length; i++) {
                    ret.push(res.rows.item(i));
                }
                if (typeof SuccessCB == 'function') Model2Control();SuccessCB(ret);
            } else {
                if (typeof SuccessCB == 'function') SuccessCB(null);
            }
        }, function (error) { console.log(error) });

    }
    

