var clickAlias = "click";
//var docTypeSale = "51";

var docTypeSale = $.Ctx.GetPageParam('sales_list','param').DOCUMENT_TYPE;
var transactionType = $.Ctx.GetPageParam('sales_list','param').TRANSACTION_TYPE;



$("#sales_trans").bind("pageinit", function (event) {
    $('#sales_trans #btnSave').bind(clickAlias, function () {
        SaveSaleTrans(function (ret) {
            if (ret == true) {
                $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'MsgSaveComplete', 'Save Completed.'));
                if ($.Ctx.GetPageParam('sales_trans', 'Mode') == "Create")
                    ClearAfterSave();
                /*$.Ctx.NavigatePage($.Ctx.GetPageParam('sales_trans', 'Previous'), null, { transition: 'slide', reverse: false });*/
            }
        });
    });

    $('#sales_trans #lpCustomer').bind(clickAlias, function () {
        $.Ctx.SetPageParam('sales_trans', 'ScrollingTo', $(window).scrollTop());
        SearchCustomerPoultry(function (custs) {
            if (custs !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('sales_trans', 'msgCustomer', 'Customer');
                p.calledPage = 'sales_trans';
                p.calledResult = 'selectedCustomer';
                p.codeField = 'CUSTOMER_CODE';
                p.nameField = 'CUSTOMER_NAME';
                p.showCode = true;
                p.dataSource = custs;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgCusNotFound', 'Customer not found'));
            }
        });
    });

    $('#sales_trans #lpProduct').bind(clickAlias, function () {
        console.log('select product.')
        $.Ctx.SetPageParam('sales_trans', 'ScrollingTo', $(window).scrollTop());
        var pParam = $.Ctx.GetPageParam('sales_list', 'param');
        var stkType = null;
        try {//{"STK_TYPE":"50|51|52"}
            stkType = pParam['STK_TYPE'];
        } catch (e) {//Set Default
            stkType = "50|51|52";
        }
        var stkT = stkType.split('|');
        //assume that stock type is 20
        //        stkT = 20;
        //selectedFarmOrg = $.Ctx.GetPageParam('sales_trans', 'Data').FARM_ORG_LOC;
        ///////
        var model = $.Ctx.GetPageParam('sales_trans', 'Data');
        // if (model == null || model.BREEDER == null) return false;
        console.log('before Poultry_SearchProduct')
        Poultry_SearchProduct(stkT, model.FARM_ORG_LOC, function (prods) {
            if (prods !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('sales_trans', 'msgProdLookup', 'Products');
                p.calledPage = 'sales_trans';
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
    $('#sales_trans #lpFarmOrg').bind(clickAlias, function () {
        $.Ctx.SetPageParam('sales_trans', 'ScrollingTo', $(window).scrollTop());
        //$.FarmCtx.SearchStockFarmOrgFrom('grower', function (orgs) {
        //    if (orgs !== null) {
        //        var p = new LookupParam();
        //        p.title = $.Ctx.Lcl('sales_trans', 'msgFarmLookup', 'Farm Organization');
        //        p.calledPage = 'sales_trans';
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
                p.title = $.Ctx.Lcl('sales_trans', 'msgFarmLookup', 'Farm Organization');
                p.calledPage = 'sales_trans';
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

    $('#sales_trans #lpBreederCode').bind(clickAlias, function () {
        var model = $.Ctx.GetPageParam('sales_trans', 'Data');
        if (model == null || model.FARM_ORG_LOC == null) return false;

        $.Ctx.SetPageParam('sales_trans', 'ScrollingTo', $(window).scrollTop());
        var p = new LookupParam();
        p.calledPage = 'sales_trans';
        p.calledResult = 'BreederSelected';
        $.Ctx.SetPageParam('lookup_grower_stock', 'param', p);
        $.Ctx.SetPageParam('lookup_grower_stock', 'farmOrgLoc', model.FARM_ORG_LOC);
        $.Ctx.NavigatePage('lookup_grower_stock', null, { transition: 'slide' }, false);
        /*$.FarmCtx.SearchStockGrowerBreeder(model.FARM_ORG_LOC ,function(breeds){
        if (breeds!==null){
        var p = new LookupParam();
        p.title = "Breeders";
        p.calledPage = 'sales_trans';
        p.calledResult = 'selectedBreeder';
        p.codeField = 'BREEDER';
        p.nameField = 'BREEDER_NAME';
        p.showCode = true;
        p.dataSource = breeds;

        $.Ctx.SetPageParam('lookup', 'param', p);
        $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
        }else{
        $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgBreedernotfound', 'Breeder not found.'));
        }
        });*/
    });
    /*$('#sales_trans #lpBirthWeek').bind(clickAlias,function(){
    var model = $.Ctx.GetPageParam('sales_trans', 'Data');
    if (model==null || model.FARM_ORG_LOC==null || model.BREEDER==null) return false;

    $.Ctx.SetPageParam('sales_trans', 'ScrollingTo',  $(window).scrollTop());
    $.FarmCtx.SearchStockGrowerBirthWeek(model.FARM_ORG_LOC,model.BREEDER ,function(birthw){
    if (birthw!==null){
    var p = new LookupParam();
    p.title = "Birth Week";
    p.calledPage = 'sales_trans';
    p.calledResult = 'selectedBirthweek';
    p.codeField = 'BIRTH_WEEK';
    p.nameField = '';
    p.showCode = true;
    p.dataSource = birthw;

    $.Ctx.SetPageParam('lookup', 'param', p);
    $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
    }else{
    $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgBirthWeeknotfound', 'Birthweek not found.'));
    }
    });
    });*/

    $('#sales_trans #lpGrade').bind(clickAlias, function () {
        SearchGrade(function (grades) {
            if (grades !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('sales_trans', 'msgGradeLookup', 'Grade');
                p.calledPage = 'sales_trans';
                p.calledResult = 'selectedGrade';
                p.codeField = 'GRADE_CODE';
                p.nameField = 'GRADE_NAME';
                p.showCode = true;
                p.dataSource = grades;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgGradenotfound', 'Grade not found.'));
            }
        });
    });

    $('#sales_trans #lpReason').bind(clickAlias, function () {
        var model = $.Ctx.GetPageParam('sales_trans', 'Data');
        if (model == null || model.FARM_ORG_LOC == null) return false;

        $.Ctx.SetPageParam('sales_trans', 'ScrollingTo', $(window).scrollTop());
        SearchSaleReasonCode(model.FARM_ORG_LOC, function (reasons) {
            if (reasons !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('sales_trans', 'msgReasonLookup', 'Reason');
                p.calledPage = 'sales_trans';
                p.calledResult = 'selectedReason';
                p.codeField = 'REASON_CODE';
                p.nameField = 'REASON_NAME';
                p.showCode = true;
                p.dataSource = reasons;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgResonNoFod', 'Reason not found.'));
            }
        });
    });

    $('#sales_trans #btnBack').bind('click', function () {
        //Check Dirty
        var dirty = false;
        var mode = $.Ctx.GetPageParam('sales_trans', 'Mode');
        var model = $.Ctx.GetPageParam('sales_trans', 'Data');
        if (mode == 'Create' && model !== null && Object.keys(model).length > 0) {
            dirty = true;
        }
        var isExit = true;
        /*if (dirty==true){
        isExit = confirm($.Ctx.Lcl('sales_trans', 'msgConfirmExit', 'Data is Dirty, Exit?'));
        }else{
        isExit=true;
        }*/
        if (isExit == true) {
            $.Ctx.NavigatePage($.Ctx.GetPageParam('sales_trans', 'Previous'),
                null,
                { transition: 'slide', reverse: true });
        }
        return false;
    });

    $('#sales_trans #male-qty').focusout(function () {
        var qtyStr = $(this).val();
        $(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
    });
    $('#sales_trans #female-qty').focusout(function () {
        var qtyStr = $(this).val();
        $(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
    });
    $('#sales_trans #total-amt').focusout(function () {
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
    });
    $('#sales_trans #total-wt').focusout(function () {
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
    });

});

$("#sales_trans").bind("pagebeforehide", function (event, ui) {
    var model = $.Ctx.GetPageParam('sales_trans', 'Data');
    if (model == null) {
        model = {};
        $.Ctx.SetPageParam('sales_trans', 'Data', model);
    }
    model.REF_DOCUMENT_NO = $('#sales_trans #txtRefDoc').val();
    model.MALE_QTY = Number($('#sales_trans #male-qty').val());
    model.FEMALE_QTY = Number($('#sales_trans #female-qty').val());

    var totalW = Number($('#sales_trans #total-wt').val());
    model.MALE_WGH = Number((totalW * model.MALE_QTY / (model.MALE_QTY + model.FEMALE_QTY)).toFixed(2));
    model.FEMALE_WGH = totalW - model.MALE_WGH;

    var totalAmt = Number($('#sales_trans #total-amt').val());
    model.MALE_AMT = Number((totalAmt * model.MALE_QTY / (model.MALE_QTY + model.FEMALE_QTY)).toFixed(2));
    model.FEMALE_AMT = totalAmt - model.MALE_AMT;
});

$('#sales_trans').bind("pagebeforecreate", function (e) {
    if ($.Ctx.Nvl($.Ctx.GetPageParam('sales_list', 'param').IS_BROILER, 'N') == 'Y') {
        $('#sales_trans #liQtyRow2').remove();
        $('#sales_trans #qtyRow1').empty();

        var html = ' <div class="ui-block-a"> ';
        html += ' <div data-role="fieldcontain"> ';
        html += '	<fieldset data-role="controlgroup">';
        html += '	<legend><span  data-lang="lblFQuantity">Female Quantity:</span></legend>';
        html += '	<input type="number" id="female-qty" value="0"/>';
        html += ' </fieldset>';
        html += ' </div>		';
        html += ' </div>';
        html += ' <div class="ui-block-b">';
        html += ' <div data-role="fieldcontain"> ';
        html += ' <fieldset data-role="controlgroup"> ';
        html += '	<legend><span   data-lang="lblTotalWeight">Total Weight:</span></legend> ';
        html += '	<input type="number" id="total-wt" value="0"/> ';
        html += ' </fieldset> ';
        html += ' </div> ';
        html += ' </div>';

        $('#sales_trans #qtyRow1').html(html);



    }
    $.Util.RenderUiLang('sales_trans');
    $.Ctx.RenderFooter('sales_trans');
});

$("#sales_trans").bind("pagebeforeshow", function (event, ui) {
    //console.log( $.Ctx.GetPageParam('sales_trans', 'Data'));
    var model = $.Ctx.GetPageParam('sales_trans', 'Data');
    if (model == null) {
        model = {};
        $.Ctx.SetPageParam('sales_trans', 'Data', model);
    }

    var prevPage = (typeof ui.prevPage[0] == 'undefined' ? "" : ui.prevPage[0].id);
    if (prevPage.indexOf("lookup") > -1) {//From Lookup
        //====== CUSTOMER =======
        var custSel = $.Ctx.GetPageParam('sales_trans', 'selectedCustomer');
        if (custSel !== null) {
            //if (model.CUSTOMER_CODE!==custSel.CUSTOMER_CODE){
            //}
            model.CUSTOMER_CODE = custSel.CUSTOMER_CODE;
            model.CUSTOMER_NAME = custSel.CUSTOMER_NAME;
        }

        //===== Farm Org ====
        var farmOrg = $.Ctx.GetPageParam('sales_trans', 'selectedFarmOrg');
        if (farmOrg !== null) {
            if (model.FARM_ORG_LOC !== farmOrg.CODE) {//clear Breeder
                model.BREEDER = null;
                model.BREEDER_NAME = null;
                model.BIRTH_WEEK = null;

                model.A_MALE_QTY = 0;
                model.A_FEMALE_QTY = 0;
                $.Ctx.SetPageParam('sales_trans', 'BreederSelected', null);

                model.REASON_CODE = null;
                model.REASON_NAME = null;
                $.Ctx.SetPageParam('sales_trans', 'selectedReason', null);

                model.PRODUCT_CODE = null;
                model.PRODUCT_NAME = null;
                $.Ctx.SetPageParam('sales_trans', 'selectedProduct', null);
            }
            model.FARM_ORG_LOC = farmOrg.CODE;
            model.FARM_ORG_NAME = farmOrg.NAME;
        }

        //====== PRODUCT =======
        var prodSel = $.Ctx.GetPageParam('sales_trans', 'selectedProduct');
        if (prodSel !== null) {
            model.PRODUCT_CODE = prodSel.PRODUCT_CODE;
            model.PRODUCT_NAME = prodSel.PRODUCT_NAME;
        }

        //======= Breeder ======
        var breed = $.Ctx.GetPageParam('sales_trans', 'BreederSelected');
        if (breed !== null) {
            //{BREEDER: "04", BREEDER_NAME: "2X", BIRTH_WEEK: "1251", SUM_MALE: 0, SUM_FEMALE: 0}
            if (model.BREEDER !== breed.BREEDER || model.BIRTH_WEEK !== breed.BIRTH_WEEK) {
                //model.MALE_QTY = breed.SUM_MALE;
                //model.FEMALE_QTY = breed.SUM_FEMALE;
                $.Ctx.SetPageParam('sales_trans', 'selectedProduct', null);
                model.PRODUCT_CODE = null;
                model.PRODUCT_NAME = null;
            } else {
                /*if (typeof model.MALE_QTY =='undefined' || model.MALE_QTY==0)
                 model.MALE_QTY = breed.SUM_MALE;
                 if (typeof model.FEMALE_QTY == 'undefined' || model.FEMALE_QTY==0)
                 model.FEMALE_QTY = breed.SUM_FEMALE;*/
            }
            model.BIRTH_WEEK = breed.BIRTH_WEEK;
            model.BREEDER = breed.BREEDER;
            model.BREEDER_NAME = breed.BREEDER_NAME;
            model.A_MALE_QTY = (breed == null? 0 : breeder.SUM_MALE);
            model.A_FEMALE_QTY = breed.SUM_FEMALE;
        }
        //======= Birth Week =====
        var birthWeek = $.Ctx.GetPageParam('sales_trans', 'selectedBirthweek');
        if (birthWeek !== null) {
            model.BIRTH_WEEK = birthWeek.BIRTH_WEEK;
        }

        //======= ReaSON =====
        var reason = $.Ctx.GetPageParam('sales_trans', 'selectedReason');
        if (reason !== null) {
            model.REASON_CODE = reason.REASON_CODE;
            model.REASON_NAME = reason.REASON_NAME;
        }

        //======= Grade ======
        var grade = $.Ctx.GetPageParam('sales_trans', 'selectedGrade');
        if (grade !== null) {
            model.GRADE = grade.GRADE_CODE;
            model.GRADE_NAME = grade.GRADE_NAME;
        }
    } else {
        var mode = $.Ctx.GetPageParam('sales_trans', 'Mode');
        if (mode !== 'Create') {
            //Disable key
            var key = $.Ctx.GetPageParam('sales_trans', 'Key');
            //alert(JSON.stringify(key))
            FindGrowerSale(key.FARM_ORG_LOC, key.TRANSACTION_DATE, key.DOCUMENT_TYPE, key.DOCUMENT_EXT, function (ret) {
                //console.log(ret);
                //ret.ORG_CODE;
                //ret.FARM_ORG;
                //                console.log("this is return frok search", ret);
                model.FARM_ORG_LOC = ret.FARM_ORG_LOC;
                model.FARM_ORG_NAME = ret.FARM_ORG_LOC_NAME;
                model.DOCUMENT_EXT = ret.DOCUMENT_EXT;
                model.TRANSACTION_DATE = ret.TRANSACTION_DATE;
                //ret.DOCUMENT_TYPE=docType;
                model.REF_DOCUMENT_NO = ret.REF_DOCUMENT_NO;
                model.CUSTOMER_CODE = ret.CUSTOMER_CODE;
                model.CUSTOMER_NAME = ret.CUSTOMER_NAME;
                model.PRODUCT_CODE = ret.PRODUCT_CODE;
                model.PRODUCT_NAME = ret.PRODUCT_NAME;
                model.BREEDER = ret.BREEDER;
                model.BREEDER_NAME = ret.BREEDER_NAME;
                model.BIRTH_WEEK = ret.BIRTH_WEEK;
                model.GRADE = ret.GRADE;
                model.GRADE_NAME = ret.GRADE_NAME;
                model.MALE_QTY = ret.MALE_QTY;
                model.MALE_WGH = ret.MALE_WGH;
                model.MALE_AMT = ret.MALE_AMT;
                model.FEMALE_QTY = ret.FEMALE_QTY;
                model.FEMALE_WGH = ret.FEMALE_WGH;
                model.FEMALE_AMT = ret.FEMALE_AMT;
                model.REASON_CODE = ret.REASON_CODE;
                model.REASON_NAME = ret.REASON_NAME;
                //console.log("display model", model);
                //model.MALE_QTY = ret.NUMBER_OF_SENDING_DATA;
                $.FarmCtx.FindAvaliableGrowerStock(model.FARM_ORG_LOC, model.BREEDER, model.BIRTH_WEEK, function (ret) {
                    if (ret !== null) {
                        model.A_MALE_QTY = ret.A_MALE_QTY;
                        model.A_FEMALE_QTY = ret.A_FEMALE_QTY;
                    }
                    //$.Ctx.SetPageParam("sales_trans", 'Data', model);

                    Model2Control();
                });
            });
        }
    }
    //console.log($.Ctx.GetPageParam('sales_trans', 'Data'));
});

$("#sales_trans").bind("pageshow", function (event) {
    var mode = $.Ctx.GetPageParam('sales_trans', 'Mode');
    //var self = $('#sales_trans');

    if (mode == 'Update') {
        //Disable key
        //self.find('#lpFarmOrg').button('disable');
        $('#sales_trans #lpFarmOrg').button('disable');
    } else if (mode == 'Create') {
        $('#sales_trans #lpFarmOrg').button('enable');
    } else {
        $('#sales_trans #lpFarmOrg').button('disable');
        $('#sales_trans #btnSave').hide();
    }
    //setup by BU

    if ($.Ctx.Bu == "FARM_PIG") {
        $('#sales_trans #liGrade').hide();
        $('#sales_trans #liBirthWeek').show();
    } else if ($.Ctx.Bu == "FARM_POULTRY") {
        $('#sales_trans #liBreederCode').hide();
        $('#sales_trans #liReason').hide();
    } else {
        $('#sales_trans #liGrade').show();
        $('#sales_trans #liBirthWeek').hide();
    }
    /////
    //$('#sales_trans #lblMode').html($.Ctx.Lcl('sales_trans', 'lblMode', 'Mode:')  + mode);
    Model2Control();

    //$('#sales_trans #txtRefDoc').addClass( "ui-disabled" );
    //$('#sales_trans #lpProduct').addClass( "ui-disabled" );
    //$('#sales_trans #txtRefDoc').textinput({ mini: true });
    if ($.Ctx.GetPageParam('sales_trans', 'ScrollingTo') != null) {
        //scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
        $('html, body').animate({
            scrollTop: $.Ctx.GetPageParam('sales_trans', 'ScrollingTo')
        }, 0);
    }
});

function ClearAfterSave() {
    var model = $.Ctx.GetPageParam('sales_trans', 'Data');
    if (model !== null) {
        model.BIRTH_WEEK = null;
        model.GRADE = null;
        model.GRADE_NAME = null;
        model.REASON_CODE = null;
        model.BREEDER = null;
        $.Ctx.SetPageParam('sales_trans', 'BreederSelected', null);

        model.A_MALE_QTY = 0;
        model.A_FEMALE_QTY = 0;

        model.MALE_QTY = model.MALE_WGH = model.MALE_AMT = model.FEMALE_QTY = model.FEMALE_WGH = model.FEMALE_AMT = 0;

        model.PRODUCT_CODE = null;
        model.PRODUCT_NAME = null;
        $.Ctx.SetPageParam('sales_trans', 'selectedProduct', null);

        Model2Control();
    }
}

function Model2Control() {
    var model = $.Ctx.GetPageParam('sales_trans', 'Data');
    // alert(model)
    if (model !== null) {
        if (model.CUSTOMER_CODE == null)
            $('#sales_trans #lpCustomer').text($.Ctx.Lcl('sales_trans', 'msgSelect', 'Select'));
        else
            $('#sales_trans #lpCustomer').text(model.CUSTOMER_CODE + ' ' + model.CUSTOMER_NAME);
        $('#sales_trans #lpCustomer').button('refresh');

        if (model.PRODUCT_CODE == null)
            $('#sales_trans #lpProduct').text($.Ctx.Lcl('sales_trans', 'msgSelect', 'Select'));
        else
            $('#sales_trans #lpProduct').text(model.PRODUCT_CODE + ' ' + model.PRODUCT_NAME);
        $('#sales_trans #lpProduct').button('refresh');

        if (model.FARM_ORG_LOC == null)
            $('#sales_trans #lpFarmOrg').text($.Ctx.Lcl('sales_trans', 'msgSelect', 'Select'));
        else
            $('#sales_trans #lpFarmOrg').text(model.FARM_ORG_LOC+"("+model.FARM_ORG_NAME+")");
        $('#sales_trans #lpFarmOrg').button('refresh');

        if (model.BREEDER == null)
            $('#sales_trans #lpBreederCode').text($.Ctx.Lcl('sales_trans', 'msgSelect', 'Select'));
        else
            $('#sales_trans #lpBreederCode').text(model.BREEDER_NAME);
        $('#sales_trans #lpBreederCode').button('refresh');

        /*if(model.BIRTH_WEEK==null)
         $('#sales_trans #lpBirthWeek').text($.Ctx.Lcl('sales_trans','msgSelect','Select'));
         else
         $('#sales_trans #lpBirthWeek').text(model.BIRTH_WEEK);
         $('#sales_trans #lpBirthWeek').button('refresh');*/

        if (model.REASON_CODE == null)
            $('#sales_trans #lpReason').text($.Ctx.Lcl('sales_trans', 'msgSelect', 'Select'));
        else
            $('#sales_trans #lpReason').text(model.REASON_NAME);
        $('#sales_trans #lpReason').button('refresh');

        if (model.GRADE == null)
            $('#sales_trans #lpGrade').text($.Ctx.Lcl('sales_trans', 'msgSelect', 'Select'));
        else
            $('#sales_trans #lpGrade').text(model.GRADE_NAME);
        $('#sales_trans #lpGrade').button('refresh');

        //======== Ref Doc ======
        if (typeof model.REF_DOCUMENT_NO !== 'undefined')
            $('#sales_trans #txtRefDoc').val(model.REF_DOCUMENT_NO);
        else
            $('#sales_trans #txtRefDoc').val('');
        $('#sales_trans #male-qty').val(model.MALE_QTY == 0 ? '' : model.MALE_QTY);
        $('#sales_trans #female-qty').val(model.FEMALE_QTY == 0 ? '' : model.FEMALE_QTY);

        var totalW = (model.MALE_WGH == null ? 0 : model.MALE_WGH) + (model.FEMALE_WGH == null ? 0 : model.FEMALE_WGH);
        $('#sales_trans #total-wt').val(totalW == 0 ? '' : totalW);

        var totalAmt = (model.MALE_AMT == null ? 0 : model.MALE_AMT) + (model.FEMALE_AMT == null ? 0 : model.FEMALE_AMT);
        $('#sales_trans #total-amt').val(totalAmt == 0 ? '' : totalAmt);

        $('#sales_trans #lblBirthWeek').html(model.BIRTH_WEEK == undefined ? '' : model.BIRTH_WEEK);
        $('#sales_trans #lblAvMale').html(model.A_MALE_QTY == undefined ? '' : model.A_MALE_QTY);
        $('#sales_trans #lblAvFMale').html(model.A_FEMALE_QTY == undefined ? '' : model.A_FEMALE_QTY);

        $("#sales_trans").trigger("create")
    }
    if ($.Ctx.Nvl($.Ctx.GetPageParam('sales_list', 'param').KEY_TOTAL_AMOUNT, 'N') == 'Y') {
        $('#sales_trans #total-amt').removeClass('ui-disabled');
    }
    else {
        $('#sales_trans #total-amt').addClass('ui-disabled');
        $('#sales_trans #total-amt').val('0');
    }

    if ($.Ctx.Nvl($.Ctx.GetPageParam('sales_list', 'param').IS_BROILER, 'N') == 'Y') {
        $('#sales_trans #male-qty').addClass('ui-disabled');
    }
    else {
        $('#sales_trans #male-qty').removeClass('ui-disabled');
    }

}

function SaveSaleTrans(SuccessCB) {
    var qtyM = Number($.Ctx.Nvl( $('#sales_trans #male-qty').val() , 0)),
        qtyF = Number($.Ctx.Nvl($('#sales_trans #female-qty').val() , 0 )),
        totalAmt = Number($.Ctx.Nvl($('#sales_trans #total-amt').val() , 0 )),
        totalW = Number($.Ctx.Nvl($('#sales_trans #total-wt').val(), 0 ));
        isCloseFarm = $("#sales_trans #switchCloseFarm").val();
    var model = $.Ctx.GetPageParam('sales_trans', 'Data');
    model.REF_DOCUMENT_NO = $.trim($('#sales_trans #txtRefDoc').val());

    if ($.Ctx.Bu == "FARM_PIG") {
        if (model.CUSTOMER_CODE == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqCust', 'Customer is Required.'));
            SuccessCB(false);
            return false;
        }
        if (model.PRODUCT_CODE == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqProd', 'Product is Required.'));
            SuccessCB(false);
            return false;
        }
        if (model.FARM_ORG_LOC == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqFarm', 'Farm Org is Required.'));
            SuccessCB(false);
            return false;
        }
        if (model.BREEDER == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqBreeder', 'Breeder is Required.'));
            SuccessCB(false);
            return false;
        }
        if (model.BIRTH_WEEK == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqBirthWeek', 'Birth week is Required.'));
            SuccessCB(false);
            return false;
        }
        if (qtyM + qtyF == 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqQty', 'Quantity is Required.'));
            SuccessCB(false);
            return false;
        }
        if (totalW == 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqWgh', 'Total Weight is Required.'));
            SuccessCB(false);
            return false;
        }
        if ($.Ctx.Nvl($.Ctx.GetPageParam('sales_list', 'param').KEY_TOTAL_AMOUNT, 'N') == 'Y') {
            if (totalAmt == 0) {
                $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqAmt', 'Total Amount is Required.'));
                SuccessCB(false);
                return false;
            }
        }
        /*if (model.CUSTOMER_CODE==null||model.PRODUCT_CODE==null||model.FARM_ORG_LOC==null||
         model.BREEDER==null||model.BIRTH_WEEK==null||(qtyM+qtyF==0)){
         $.Ctx.MsgBox('กรอกข้อมูลให้ครบ');
         SuccessCB(false);
         return false;
         }*/
    } else {
        /*if (model.CUSTOMER_CODE==null||model.PRODUCT_CODE==null||model.FARM_ORG_LOC==null||
         model.BREEDER==null||model.GRADE==null||(qtyM+qtyF==0)){
         $.Ctx.MsgBox('กรอกข้อมูลให้ครบ');
         SuccessCB(false);
         return false;
         }*/
        if (model.CUSTOMER_CODE == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqCust', 'Customer is Required.'));
            SuccessCB(false);
            return false;
        }
        if ($.Ctx.Nvl(model.REF_DOCUMENT_NO, '') == '') {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqRefDoc', 'Refdocument No is Required.'));
            SuccessCB(false);
            return false;
        }
        if (model.FARM_ORG_LOC == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqFarm', 'Farm Org is Required.'));
            SuccessCB(false);
            return false;
        }
        if (model.PRODUCT_CODE == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqProd', 'Product is Required.'));
            SuccessCB(false);
            return false;
        }
   
        //        if (model.BREEDER == null) {
        //            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqBreeder', 'Breeder is Required.'));
        //            SuccessCB(false);
        //            return false;
        //        }
        if (model.GRADE == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqGrade', 'Grade is Required.'));
            SuccessCB(false);
            return false;
        }
        if (qtyM + qtyF == 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqQty', 'Quantity is Required.'));
            SuccessCB(false);
            return false;
        }
        if (totalW == 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqWgh', 'Total Weight is Required.'));
            SuccessCB(false);
            return false;
        }
        if ($.Ctx.Nvl($.Ctx.GetPageParam('sales_list', 'param').KEY_TOTAL_AMOUNT, 'N') == 'Y') {
            if (totalAmt == 0) {
                $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgReqAmt', 'Total Amount is Required.'));
                SuccessCB(false);
                return false;
            }
        }
        if ($.Ctx.GetPageParam("sales_trans", "ProductSumCount") != null && qtyM > $.Ctx.GetPageParam("sales_trans", "ProductSumCount").SUM_MALE) {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgExceedMale', 'Male Qty is prohibited.'));
            SuccessCB(false);
            return false;
        }
        if ($.Ctx.GetPageParam("sales_trans", "ProductSumCount") != null && qtyM > $.Ctx.GetPageParam("sales_trans", "ProductSumCount").SUM_FEMALE) {
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgExceedFemale', 'Female Qty is prohibited.'));
            SuccessCB(false);
            return false;
        }

        model.FLAG_CLOSE = 'N';
        if (isCloseFarm.toLowerCase() == 'on') {
            model.FLAG_CLOSE = 'Y';
        }
    }

    var mode = $.Ctx.GetPageParam('sales_trans', 'Mode');

    if (mode == 'Update') {
        ValidateStock(qtyM, qtyF, model.FARM_ORG_LOC, $.Ctx.GetBusinessDate(), model.BREEDER, model.BIRTH_WEEK, model.GRADE, model.DOCUMENT_EXT, function (isSucc) {
            if (isSucc == true) {
                $.FarmCtx.DeleteGrowerStockByKey(model.FARM_ORG_LOC, $.Ctx.GetBusinessDate(), '2', docTypeSale, model.DOCUMENT_EXT,
                    function (succ) {
                        if (succ == true)
                            SaveWithDocExt(model.DOCUMENT_EXT);
                    });
            }
        });
    } else {//Add , Create
        model.BREEDER = null;model.BIRTH_WEEK=null;
        ValidateStock(qtyM, qtyF, model.FARM_ORG_LOC, $.Ctx.GetBusinessDate(), model.BREEDER, model.BIRTH_WEEK, model.GRADE, -1, function (isSucc) {
            if (isSucc == true) {
                GetDocExt(SaveWithDocExt);
            }
        });
    }

    function SaveWithDocExt(ext) {
        //$.Ctx.MsgBox('save number ' + ext);
        var stockType = $.Ctx.GetPageParam("sales_list", "param").STK_TYPE;
        var dataM = $.Ctx.GetPageParam('sales_trans', 'Data');
        var qtyM = Number( $.Ctx.Nvl( $('#sales_trans #male-qty').val() , 0 )),
            qtyF = Number( $.Ctx.Nvl($('#sales_trans #female-qty').val() , 0 )),
            totalW = Number( $.Ctx.Nvl($('#sales_trans #total-wt').val() , 0 )),
            totalAmt = Number($.Ctx.Nvl($('#sales_trans #total-amt').val(), 0));

        var gSale = new HH_FR_MS_GROWER_SALE();
        gSale.ORG_CODE = $.Ctx.SubOp;
        gSale.FARM_ORG = $.Ctx.Warehouse;
        gSale.FARM_ORG_LOC = dataM.FARM_ORG_LOC;
        gSale.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
        gSale.DOCUMENT_TYPE = docTypeSale;
        gSale.DOCUMENT_EXT = ext;
        gSale.CUSTOMER_CODE = dataM.CUSTOMER_CODE;
        gSale.PRODUCT_CODE = dataM.PRODUCT_CODE;
        gSale.REF_DOCUMENT_NO = dataM.REF_DOCUMENT_NO;
        gSale.BREEDER = dataM.BREEDER;
        if ($.Ctx.Bu == "FARM_PIG") {
            gSale.BIRTH_WEEK = dataM.BIRTH_WEEK;
        } else {
            gSale.GRADE = dataM.GRADE;
        }
        gSale.TRUCK_NO = null;
        gSale.MALE_QTY = qtyM;
        gSale.MALE_WGH = Number((totalW * qtyM / (qtyM + qtyF)).toFixed(2));
        gSale.MALE_AMT = Number((totalAmt * qtyM / (qtyM + qtyF)).toFixed(2));
        gSale.FEMALE_QTY = qtyF;
        gSale.FEMALE_WGH = totalW - gSale.MALE_WGH;
        gSale.FEMALE_AMT = totalAmt - gSale.MALE_AMT;
        gSale.REASON_CODE = dataM.REASON_CODE;
        gSale.NUMBER_OF_SENDING_DATA = 0;
        gSale.OWNER = $.Ctx.UserId;
        gSale.CREATE_DATE = (new XDate()).toDbDateStr();
        gSale.LAST_UPDATE_DATE = (mode == 'Update' ? (new XDate()).toDbDateStr() : null);
        gSale.FUNCTION = (mode == 'Update' ? 'C' : 'A');
        gSale.FLAG_CLOSE = dataM.FLAG_CLOSE; 

        var gStock = new HH_FR_MS_GROWER_STOCK();
        gStock.ORG_CODE = $.Ctx.SubOp;
        gStock.FARM_ORG = $.Ctx.Warehouse;
        gStock.FARM_ORG_LOC = gSale.FARM_ORG_LOC;
        gStock.TRANSACTION_DATE = gSale.TRANSACTION_DATE;
        gStock.TRANSACTION_TYPE = transactionType;
        gStock.DOCUMENT_TYPE = docTypeSale;
        gStock.DOCUMENT_EXT = ext;
        gStock.BREEDER = gSale.BREEDER;
        gStock.BIRTH_WEEK = gSale.BIRTH_WEEK;
        gStock.MALE_QTY = gSale.MALE_QTY;
        gStock.MALE_WGH = gSale.MALE_WGH;
        gStock.MALE_AMT = gSale.MALE_AMT;
        gStock.FEMALE_QTY = gSale.FEMALE_QTY;
        gStock.FEMALE_WGH = gSale.FEMALE_WGH;
        gStock.FEMALE_AMT = gSale.FEMALE_AMT;
        gStock.OWNER = $.Ctx.UserId;
        gStock.CREATE_DATE = gSale.CREATE_DATE;
        gStock.LAST_UPDATE_DATE = gSale.LAST_UPDATE_DATE;
        gStock.FUNCTION = gSale.FUNCTION;
        gStock.NUMBER_OF_SENDING_DATA = 0;

        var paramCmd = [];
        var cmd, cmd2;
        if (mode == 'Update') {
            cmd = gSale.updateCommand($.Ctx.DbConn);
        } else {
            cmd = gSale.insertCommand($.Ctx.DbConn);
        }
        cmd2 = gStock.insertCommand($.Ctx.DbConn);
        paramCmd.push(cmd);
        paramCmd.push(cmd2);

        var trn = new DbTran($.Ctx.DbConn);
        trn.executeNonQuery(paramCmd, function () {
            if (typeof (SuccessCB) == "function")
                SuccessCB(true);
        }, function (errors) {
            alert(errors);
            SuccessCB(false);
            console.log(errors);
        });
    }
}

function SearchCustomerPoultry(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT CUSTOMER_CODE, CUSTOMER_NAME,BUSINESS_UNIT FROM HH_FR_CUSTOMER_PIG WHERE BUSINESS_UNIT = ? AND SUB_OPERATION  = ?";
    cmd.parameters.push($.Ctx.Bu);
    cmd.parameters.push($.Ctx.SubOp);
    cmd.executeReader(function (tx, res) {
        var dSrc = null;
        if (res.rows.length !== 0) {
            dSrc = [];
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_FR_CUSTOMER_PIG();
                m.retrieveRdr(res.rows.item(i));
                dSrc.push(m);
            }
        }
        SuccessCB(dSrc);
    }, function (err) {
        console.log(err.message);
    });
}

function GetStatementProduct(breeder, stkTyp) {
    var ret = nameField = '';
    if ($.Ctx.Lang == "en-US")
        nameField = "ifnull(DESC_ENG, DESC_LOC)";
    else
        nameField = "ifnull(DESC_LOC, DESC_ENG)";

    var strStk = $.FarmCtx.ExtractParam(stkTyp);
    ret = "SELECT PRODUCT_CODE, {0} AS PRODUCT_NAME FROM HH_FR_PRODUCT_GROWER ".format([nameField]);
    ret += "WHERE 1=1 ";
    if (breeder !== null) {
        ret += " AND BREEDER='{0}' ".format([breeder]);
    }
    if (strStk !== '') {
        ret += " AND STOCK_TYPE IN ({0}) ".format([strStk]);
    }
    ret += "ORDER BY PRODUCT_CODE ";
    return ret;
}
//function Poultry_SearchCustomer(){
//    var cmd = $.Ctx.DbConn.createSelectCommand();
//    cmd.sqlText = "SELECT DISTINCT FARM_ORG_LOC, F.NAME_ENG, F.NAME_LOC "
//    cmd.sqlText += "FROM HH_FR_MS_GROWER_STOCK S JOIN FR_FARM_ORG F "
//    cmd.sqlText += "ON (S.ORG_CODE=F.ORG_CODE AND S.FARM_ORG_LOC=F.FARM_ORG)"
//    cmd.sqlText += "WHERE S.ORG_CODE={0} AND S.FARM_ORG={1}"
//    cmd.sqlText += "ORDER BY S.FARM_ORG_LOC"
//    cmd.sqlText.format([$.Ctx.SubOp, $.Ctx.Warehouse])
//    var ret = [];
//    cmd.executeReader(function(t, res){
//        if(res.rows.length!=0){
//            for (var i =0; i<res.rows.length;i++){
//                if(res.rows.item(i).PRODUCT_NAME != null){
//                    ret.push({'PRODUCT_CODE':res.rows.item(i).PRODUCT_CODE, 'PRODUCT_NAME':res.rows.item(i).PRODUCT_NAME});
//                }
//            }
//            //do count product
//            var cmd2 = $.Ctx.DbConn.createSelectCommand();
//            cmd.sqlText = "SELECT SUM(CASE TRANSACTION_TYPE WHEN '1' THEN MALE_QTY ELSE MALE_QTY * -1 END) SUM_MALE, "
//            cmd.sqlText +="SUM(CASE TRANSACTION_TYPE WHEN '1' THEN FEMALE_QTY ELSE FEMALE_QTY * -1 END) SUM_FEMALE "
//            cmd.sqlText +="FROM HH_FR_MS_GROWER_STOCK "
//            cmd.sqlText +="WHERE ORG_CODE={0} AND FARM_ORG= {1}  AND FARM_ORG_LOC=2.FARM_ORG_LOC"
//            /////
//            if(typeof SuccessCB=='function') SuccessCB(ret);
//        }
//        else{
//
//        }
//    });
//}

function Poultry_SearchProduct(stockType, selectedFarmOrg, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT PRODUCT_NAME, PRODUCT_CODE FROM HH_PRODUCT_BU WHERE BUSINESS_UNIT = '{0}' AND PRODUCT_STOCK_TYPE = {1}".format([$.Ctx.Bu, stockType]);
    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                if (res.rows.item(i).PRODUCT_NAME != null) {
                    ret.push({'PRODUCT_CODE': res.rows.item(i).PRODUCT_CODE, 'PRODUCT_NAME': res.rows.item(i).PRODUCT_NAME});
                }
            }
            //do count product
            var cmd2 = $.Ctx.DbConn.createSelectCommand();
            cmd2.sqlText = "SELECT SUM(CASE TRANSACTION_TYPE WHEN '1' THEN MALE_QTY ELSE MALE_QTY * -1 END) SUM_MALE, "
            cmd2.sqlText += "SUM(CASE TRANSACTION_TYPE WHEN '1' THEN FEMALE_QTY ELSE FEMALE_QTY * -1 END) SUM_FEMALE "
            cmd2.sqlText += "FROM HH_FR_MS_GROWER_STOCK "
            cmd2.sqlText += "WHERE ORG_CODE == ? AND FARM_ORG == ?  AND FARM_ORG_LOC == ?"
            /////

            cmd2.parameters.push($.Ctx.SubOp);
            cmd2.parameters.push($.Ctx.Warehouse);
            cmd2.parameters.push(selectedFarmOrg);
            var ret_count = [];
            cmd2.executeReader(function (t, res) {

                if (res.rows.length != 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        console.log(res.rows.item(i));
                        $.Ctx.SetPageParam("sales_trans", 'ProductSumCount', res.rows.item(i));
                    }
                    if (typeof SuccessCB == 'function') SuccessCB(ret);
                }


            });

        }
        else {

        }
    });
}

function SearchProduct(breeder, stkTyp, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = GetStatementProduct(breeder, stkTyp);
    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length !== 0) {
            for (var i = 0; i < res.rows.length; i++) {
                if (res.rows.item(i).PRODUCT_NAME !== null)
                    ret.push({'PRODUCT_CODE': res.rows.item(i).PRODUCT_CODE, 'PRODUCT_NAME': res.rows.item(i).PRODUCT_NAME});
            }
            if (typeof SuccessCB == 'function') SuccessCB(ret);
        } else {
            var cmd2 = $.Ctx.DbConn.createSelectCommand();
            cmd2.sqlText = GetStatementProduct(null, stkTyp);
            cmd2.executeReader(function (t, res2) {
                if (res2.rows.length !== 0) {
                    for (var i = 0; i < res2.rows.length; i++) {
                        if (res2.rows.item(i).PRODUCT_NAME !== null)
                            ret.push({'PRODUCT_CODE': res2.rows.item(i).PRODUCT_CODE, 'PRODUCT_NAME': res2.rows.item(i).PRODUCT_NAME});
                    }
                    if (typeof SuccessCB == 'function') SuccessCB(ret);
                }
            });
        }
    });
}

function SearchGrade(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = '';
    if ($.Ctx.Lang == "en-US")
        nameField = "ifnull(DESC_ENG, DESC_LOC)";
    else
        nameField = "ifnull(DESC_LOC, DESC_ENG)";
    cmd.sqlText = "SELECT GRADE_CODE,{0} AS GRADE_NAME FROM GD2_FR_GRADE WHERE 1=1 ".format([nameField]);
    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                if (res.rows.item(i).GRADE_NAME !== null)
                    ret.push({'GRADE_CODE': res.rows.item(i).GRADE_CODE, 'GRADE_NAME': res.rows.item(i).GRADE_NAME });
            }
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    });
}

function GetDocExt(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT MAX(DOCUMENT_EXT) AS RUN_EXT FROM HH_FR_MS_GROWER_SALE WHERE ORG_CODE=? AND FARM_ORG=? AND TRANSACTION_DATE=? ";
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

function ValidateStock(qtyM, qtyF, farmLoc, txDate, breeder, birWeek, grade, docExt, FuncCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT TRANSACTION_TYPE, SUM(MALE_QTY) AS SUM_MALE,SUM(FEMALE_QTY) AS SUM_FEMALE ";
    cmd.sqlText += "FROM HH_FR_MS_GROWER_STOCK ";
    cmd.sqlText += "WHERE ORG_CODE=? AND FARM_ORG=? AND FARM_ORG_LOC=? ";
    //    if ($.Ctx.Bu == "02" || $.Ctx.Bu == "FARM_PIG")
    //        cmd.sqlText += "AND BIRTH_WEEK=? ";           //this is for swine business
    //    else
    //        cmd.sqlText += "AND BIRTH_WEEK IS NULL ";

    cmd.sqlText += "GROUP BY TRANSACTION_TYPE ";   // this is customized for Poultry Farm.
    var ret = [];
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push(farmLoc);
    //    cmd.parameters.push(breeder);
    //    if ($.Ctx.Bu == "02" || $.Ctx.Bu == "FARM_PIG") {  //this is ignored for Poultry Farm
    //        cmd.parameters.push(birWeek);
    //    }
    //        cmd.parameters.push(breeder);
    ////////////

    if (docExt != -1) {
        //farmOrgLoc,txDateStr,docType,docExt,breeder,birthW,grade
        FindQtyOldFromSales(farmLoc, txDate.toDbDateStr(), docTypeSale, docExt, breeder, birWeek, grade, function (ret) {
            var qtyMOld = 0, qtyFOld = 0;
            qtyMOld = ret.MALE_QTY;
            qtyFOld = ret.FEMALE_QTY;
            console.log(cmd)
            cmd.executeReader(function (t, res) {
                console.log(res)
                if (res.rows.length > 0) {
                    Reader(res, qtyMOld, qtyFOld);
                } else {
                    $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgNotFoundStk', 'Stock Not found.'));
                    FuncCB(false);
                }
            });
        });
    } else {
        cmd.executeReader(function (t, res) {
            //alert('else' + res.rows.length)
            if (res.rows.length > 0) {
                Reader(res, 0, 0);
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgNotFoundStk', 'Stock Not found.'));
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
            $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgMaleRem', 'Male remain ') + (receiveM - spendM + qtyMOld));
        } else {
            succ = true;
        }
        if (succ == true) {
            if ((qtyF + spendF - qtyFOld) > receiveF) {
                //key Female เกิน
                succ = false;
                $.Ctx.MsgBox($.Ctx.Lcl('sales_trans', 'msgFeMaleRem', 'Female remain ') + (receiveF - spendF + qtyFOld));
            }
        }
        FuncCB(succ);
    }
}

function FindGrowerSale(farmOrg, txDateStr, docType, docExt, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nPro = '', nLoc = '', nGrad = '', nBree = '', nRea = '';
    if ($.Ctx.Lang == "en-US") {
        nRea = "ifnull(R.DESC_ENG, R.DESC_LOC)";
        nPro = "ifnull(P.PRODUCT_NAME, P.PRODUCT_SHORT_NAME)";
        nLoc = "ifnull(F.NAME_ENG, F.NAME_LOC)";
        nGrad = "ifnull(G.DESC_ENG, G.DESC_LOC)";
        nBree = "ifnull(BR.DESC_ENG, BR.DESC_LOC)";
    } else {
        nRea = "ifnull(R.DESC_LOC, R.DESC_ENG)";
        nPro = "ifnull(P.PRODUCT_NAME, P.PRODUCT_SHORT_NAME)";
        nLoc = "ifnull(F.NAME_LOC, F.NAME_ENG)";
        nGrad = "ifnull(G.DESC_LOC, G.DESC_ENG)";
        nBree = "ifnull(BR.DESC_LOC, BR.DESC_ENG)";
    }
    cmd.sqlText = "SELECT C.CUSTOMER_CODE,C.CUSTOMER_NAME,P.PRODUCT_CODE, {0} AS PRODUCT_NAME, S.REASON_CODE, {1} AS REASON_NAME, ".format([nPro, nRea]);
    cmd.sqlText += "S.FARM_ORG_LOC ,{0} AS FARM_ORG_LOC_NAME, {1} AS GRADE_NAME,{2} AS BREEDER_NAME, ".format([nLoc, nGrad, nBree]);
    cmd.sqlText += "S.REF_DOCUMENT_NO,S.BREEDER,S.BIRTH_WEEK,S.GRADE,S.MALE_QTY,S.MALE_WGH,S.MALE_AMT,S.FEMALE_QTY,S.FEMALE_WGH,S.FEMALE_AMT,S.NUMBER_OF_SENDING_DATA ";
    cmd.sqlText += "FROM HH_FR_MS_GROWER_SALE S ";
    cmd.sqlText += "JOIN HH_FR_CUSTOMER_PIG C ON S.CUSTOMER_CODE=C.CUSTOMER_CODE ";
    cmd.sqlText += "JOIN HH_PRODUCT_BU P ON S.PRODUCT_CODE=P.PRODUCT_CODE ";
    cmd.sqlText += "JOIN FR_FARM_ORG F ON S.FARM_ORG_LOC=F.FARM_ORG ";
    cmd.sqlText += "LEFT JOIN HH_GD2_FR_MAS_TYPE_FARM R ON (S.REASON_CODE=R.GD_CODE AND R.GD_TYPE='RSC') ";
    cmd.sqlText += "LEFT JOIN GD2_FR_GRADE G ON S.GRADE=G.GRADE_CODE ";
    cmd.sqlText += "LEFT JOIN GD3_FR_BREEDER BR ON (S.ORG_CODE=BR.ORG_CODE AND S.BREEDER=BR.BREEDER) ";
    cmd.sqlText += "WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND S.FARM_ORG_LOC=? AND S.TRANSACTION_DATE=? ";
    cmd.sqlText += " AND S.DOCUMENT_TYPE=? AND S.DOCUMENT_EXT=? ";
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push(farmOrg);
    cmd.parameters.push(txDateStr);
    cmd.parameters.push(docType);
    cmd.parameters.push(docExt);
    //console.log(cmd.sqlText)
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
            ret.CUSTOMER_CODE = res.rows.item(0).CUSTOMER_CODE;
            ret.CUSTOMER_NAME = res.rows.item(0).CUSTOMER_NAME;
            ret.PRODUCT_CODE = res.rows.item(0).PRODUCT_CODE;
            ret.PRODUCT_NAME = res.rows.item(0).PRODUCT_NAME;
            ret.FARM_ORG_LOC_NAME = res.rows.item(0).FARM_ORG_LOC_NAME;
            ret.BREEDER = res.rows.item(0).BREEDER;
            ret.BREEDER_NAME = res.rows.item(0).BREEDER_NAME;
            ret.BIRTH_WEEK = res.rows.item(0).BIRTH_WEEK;
            ret.GRADE = res.rows.item(0).GRADE;
            ret.GRADE_NAME = res.rows.item(0).GRADE_NAME;
            ret.MALE_QTY = res.rows.item(0).MALE_QTY;
            ret.MALE_WGH = res.rows.item(0).MALE_WGH;
            ret.MALE_AMT = res.rows.item(0).MALE_AMT;
            ret.FEMALE_QTY = res.rows.item(0).FEMALE_QTY;
            ret.FEMALE_WGH = res.rows.item(0).FEMALE_WGH;
            ret.FEMALE_AMT = res.rows.item(0).FEMALE_AMT;
            ret.NUMBER_OF_SENDING_DATA = res.rows.item(0).NUMBER_OF_SENDING_DATA;
            ret.REASON_CODE = res.rows.item(0).REASON_CODE;
            ret.REASON_NAME = res.rows.item(0).REASON_NAME;
            // alert(JSON.stringify(ret))
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    }, function (error) {
        // alert('error')
        console.log(error);
    });

}

function FindQtyOldFromSales(farmOrgLoc, txDateStr, docType, docExt, breeder, birthW, grade, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT S.BREEDER,S.BIRTH_WEEK,S.GRADE,S.MALE_QTY,S.MALE_WGH,S.MALE_AMT,S.FEMALE_QTY,S.FEMALE_WGH,S.FEMALE_AMT ";
    cmd.sqlText += "FROM HH_FR_MS_GROWER_SALE S ";
    cmd.sqlText += "WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND S.FARM_ORG_LOC=? AND S.TRANSACTION_DATE=? ";
    cmd.sqlText += " AND S.DOCUMENT_TYPE=? AND S.DOCUMENT_EXT=? AND S.BREEDER=? ";
    if ($.Ctx.Bu == "02" || $.Ctx.Bu == "FARM_PIG") {
        cmd.sqlText += "AND S.BIRTH_WEEK=? ";
    } else {
        cmd.sqlText += "AND S.GRADE=? ";
    }
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push(farmOrgLoc);
    cmd.parameters.push(txDateStr);
    cmd.parameters.push(docType);
    cmd.parameters.push(docExt);
    cmd.parameters.push(breeder);
    if ($.Ctx.Bu == "02" || $.Ctx.Bu == "FARM_PIG") {
        cmd.parameters.push(birthW);
    } else {
        cmd.parameters.push(grade);
    }
    var ret = {};
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            ret.BREEDER = res.rows.item(0).BREEDER;
            ret.BIRTH_WEEK = res.rows.item(0).BIRTH_WEEK;
            ret.GRADE = res.rows.item(0).GRADE;
            ret.MALE_QTY = res.rows.item(0).MALE_QTY;
            ret.MALE_WGH = res.rows.item(0).MALE_WGH;
            ret.MALE_AMT = res.rows.item(0).MALE_AMT;
            ret.FEMALE_QTY = res.rows.item(0).FEMALE_QTY;
            ret.FEMALE_WGH = res.rows.item(0).FEMALE_WGH;
            ret.FEMALE_AMT = res.rows.item(0).FEMALE_AMT;
        } else {
            ret.BREEDER = breeder;
            ret.BIRTH_WEEK = birthW;
            ret.GRADE = grade;
            ret.MALE_QTY = 0;
            ret.MALE_WGH = 0;
            ret.MALE_AMT = 0;
            ret.FEMALE_QTY = 0;
            ret.FEMALE_WGH = 0;
            ret.FEMALE_AMT = 0;
        }
        SuccessCB(ret);
    }, function (error) {
        console.log(error);
    });
}

function SearchSaleReasonCode(farmOrg, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = "ifnull(DESC_LOC, DESC_ENG)";
    if ($.Ctx.Lang == "en-US") {
        nameField = "ifnull(DESC_ENG, DESC_LOC)";
    }
    $.FarmCtx.FindLocation(farmOrg, function (loc) {
        if (loc == '1' || loc == '6') {
            cmd.sqlText = "SELECT GD_CODE AS REASON_CODE,{0} AS REASON_NAME FROM HH_GD2_FR_MAS_TYPE_FARM ".format([nameField]);
            cmd.sqlText += "WHERE GD_TYPE='RSC'  ORDER BY 1"; //AND (CONDITION_06 LIKE '%M%F%')
        } else {
            cmd.sqlText = "SELECT GD_CODE AS REASON_CODE,{0} AS REASON_NAME FROM HH_GD2_FR_MAS_TYPE_FARM ".format([nameField]);
            cmd.sqlText += "WHERE GD_TYPE='RSC'  ORDER BY 1"; //AND (CONDITION_07 LIKE '%M%F%')
        }
        var ret = [];
        cmd.executeReader(function (t, res) {
            if (res.rows.length != 0) {
                for (var i = 0; i < res.rows.length; i++) {
                    if (res.rows.item(i).REASON_NAME !== null)
                        ret.push({'REASON_CODE': res.rows.item(i).REASON_CODE, 'REASON_NAME': res.rows.item(i).REASON_NAME});
                }
                SuccessCB(ret);
            } else {
                SuccessCB(null);
            }
        });
    });
}