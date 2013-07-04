$('#sale_transfer_detail').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('sale_transfer_detail');
    $.Ctx.RenderFooter('sale_transfer_detail');
});

$('input').live('focus', function () {
    var $this = $(this);
    $this.select();
    // Work around Chrome's little problem
    $this.mouseup(function () {
        // Prevent further mouseup intervention
        $this.unbind("mouseup");
        return false;
    });
});
//Scrolling Page
$('#sale_transfer_detail a[data-role="button"]').live('click',function (e) {
//    $.Ctx.SetPageParam(page, 'ScrollingTo',  $(this).attr('id'));
    $.Ctx.SetPageParam('sale_transfer_detail', 'ScrollingTo',  $(window).scrollTop());
});

//Calling Method
$('#sale_transfer_detail').bind('pageshow', function (e) {
    if ($.Ctx.GetPageParam('sale_transfer_detail', 'ScrollingTo') != null ){
//        scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
        $('html, body').animate({
            scrollTop: $.Ctx.GetPageParam('sale_transfer_detail', 'ScrollingTo')
        }, 0);
    }
});

$('#sale_transfer_detail').bind('pagebeforehide', function (e) {
    retrieveFromInput();
    $.Ctx.PersistPageParam();
});

function IsNanOrNullOrEmpty(str) {
    if (str == undefined) { return true };
    if (str == null) { return true };
    if (str === '') { return true };
    if (isNaN(str)) { return true };
    if (typeof(str) == 'String'){
        if (str.trim() === '') { return true };
    }
    return false;
}

$('#sale_transfer_detail').bind('pageinit', function (e) {
	lkSelectTxt = $.Ctx.Lcl('sale_transfer_detail', 'msgSelect', 'Select');

    //register click event
    console.log("Register");

    $('#sale_transfer_detail a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('sale_transfer_detail', 'Previous'), null, { transition: 'slide', action: 'reverse' }, false);
    });

    $('#sale_transfer_detail #lkSwineId').click(function (e) {
        var p = new LookupParam();
        p.calledPage = 'sale_transfer_detail';
        p.calledResult = 'SwineInput'
        $.Ctx.SetPageParam('lookup_swine', 'param', p);
        $.Ctx.SetPageParam('lookup_swine', 'sowId', "S");
        $.Ctx.SetPageParam('lookup_swine', 'Previous', 'sale_transfer_detail');
        $.Ctx.NavigatePage('lookup_swine', null, { transition: 'slide', action: 'reverse' }, false);
    });

    $('#sale_transfer_detail #lkCustomerId').click(function (e) {

        var p = new LookupParam();
        p.calledPage = 'sale_transfer_detail';
        p.calledResult = 'CustomerInput'
        $.Ctx.SetPageParam('lookup_customer_pig', 'param', p);
        $.Ctx.SetPageParam('lookup_customer_pig', 'Previous', 'sale_transfer_detail');
        $.Ctx.SetPageParam('lookup_customer_pig', 'statement', ' WHERE SUB_OPERATION = "' + $.Ctx.SubOp + '"');
        $.Ctx.NavigatePage('lookup_customer_pig', null, { transition: 'slide', action: 'reverse' }, false);
    });

    $('#sale_transfer_detail #lkProductId').click(function (e) {
        if (IsNullOrEmpty(model.SWINE_TRACK)) {
            $.Ctx.MsgBox($.Ctx.Lcl('sale_transfer_detail', 'msgPlzSelectSwine', 'Please select Swine ID first.'));
        }
        else {
            var pParam = $.Ctx.GetPageParam('sale_transfer_search','param');
            var stkType = "";
            if (pParam != null){
                if(pParam['STK_TYPE'] != null  )
                    stkType = "'" + pParam['STK_TYPE'].replace(/\|/g,"','") + "'";
                else
                    stkType = "'50','53'";
            }
            var p = new LookupParam();
            p.calledPage = 'sale_transfer_detail';
            p.calledResult = 'ProductInput'
            $.Ctx.SetPageParam('lookup_product_swine', 'param', p);
            $.Ctx.SetPageParam('lookup_product_swine', 'Previous', 'sale_transfer_detail');
			$.Ctx.SetPageParam('lookup_product_swine', 'Breeder', model.BREEDER);
            $.Ctx.SetPageParam('lookup_product_swine', 'statement', "SEX = '" + model.SEX + "' AND STOCK_TYPE IN ("+ stkType + ") " );
            $.Ctx.NavigatePage('lookup_product_swine', null, { transition: 'slide', action: 'reverse' }, false);
        }
    });


    $('#sale_transfer_detail #lkReasonId').click(function (e) {

        if (IsNullOrEmpty(model.SWINE_TRACK)) {
            $.Ctx.MsgBox($.Ctx.Lcl('sale_transfer_detail', 'msgPlzSelectSwine', 'Please select Swine ID first.'));
        }
        else {
            var p = new LookupParam();
            p.calledPage = 'sale_transfer_detail';
            p.calledResult = 'ReasonInput'
            $.Ctx.SetPageParam('lookup_reason', 'param', p);
            $.Ctx.SetPageParam('lookup_reason', 'Previous', 'sale_transfer_detail');
            $.Ctx.SetPageParam('lookup_reason', 'statement', ' WHERE GD_TYPE = "RSC" AND  CONDITION_06 like "%M%F%"');
            $.Ctx.SetPageParam('lookup_reason', 'SwineId', model);
            $.Ctx.NavigatePage('lookup_reason', null, { transition: 'slide', action: 'reverse' }, false);
        }
    });





    $('#sale_transfer_detail #btnSave').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        retrieveFromInput();
        'Validate input if error show alert and return'
        var err = "";
        if (IsNullOrEmpty(model.SWINE_TRACK)) {
            var s = $.Ctx.Lcl('sale_transfer_detail', 'MsgIsRequire', '{0} is required.').format([$('#sale_transfer_detail #lblSwineId').text()]);
            if (IsNullOrEmpty(err))
                err += s;
            else
                err += "\n" + s;
        }
        if (IsNullOrEmpty(model2.PRODUCT_CODE)) {
            var s = $.Ctx.Lcl('sale_transfer_detail', 'MsgIsRequire', '{0} is required.').format([$('#sale_transfer_detail #lblProductId').text()]);
            if (IsNullOrEmpty(err))
                err += s;
            else
                err += "\n" + s;
        }
        if (IsNullOrEmpty(model2.CUSTOMER_CODE)) {
            var s = $.Ctx.Lcl('sale_transfer_detail', 'MsgIsRequire', '{0} is required.').format([$('#sale_transfer_detail #lblCustomerId').text()]);
            if (IsNullOrEmpty(err))
                err += s;
            else
                err += "\n" + s;
        }
        if (IsNanOrNullOrEmpty(model2.WEIGHT)  || model2.WEIGHT <=0 ){
            var s = $.Ctx.Lcl('sale_transfer_detail', 'MsgMustGreaterThan', '{0} must greater then {1}.').format([$('#sale_transfer_detail #lblWeight').text(), "0" ]);
            if (IsNullOrEmpty(err))
                err += s;
            else
                err += "\n" + s;
        }
        if (IsNanOrNullOrEmpty(model2.AMOUNT)  || model2.AMOUNT <=0 ){
            var s = $.Ctx.Lcl('sale_transfer_detail', 'MsgMustGreaterThan', '{0} must greater then {1}.').format([$('#sale_transfer_detail #lblAmount').text(), "0" ]);
            if (IsNullOrEmpty(err))
                err += s;
            else
                err += "\n" + s;
        }
        if (err.length != 0) {
            $.Ctx.MsgBox(err);
            return;
        }
        var bmodel = model;
        var bmodel2 = model2;
        var m3 = new HH_FR_MS_SWINE_SALE();

        if (mode == "new") {

            $.FarmCtx.SwineActivityAdd(model, function (cmds) {
                    m3.ORG_CODE = $.Ctx.SubOp;
                    m3.FARM_ORG = $.Ctx.Warehouse;
                    m3.SWINE_ID = bmodel.SWINE_ID;
                    m3.SWINE_TRACK = bmodel.SWINE_TRACK;
                    m3.SWINE_DATE_IN = bmodel.SWINE_DATE_IN;
                    m3.CUSTOMER_CODE = bmodel2.CUSTOMER_CODE;
                    m3.PRODUCT_CODE = bmodel2.PRODUCT_CODE;
                    m3.REASON_CODE = bmodel2.REASON_CODE ;
                    m3.REF_DOC_NO = bmodel2.REF_DOC_NO;
                    m3.WEIGHT = bmodel2.WEIGHT;
                    m3.AMOUNT = bmodel2.AMOUNT;
                    m3.ACTIVITY_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
                    m3.OWNER = $.Ctx.UserId;
                    m3.CREATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
                    m3.FUNCTION = "A";
                    m3.LAST_UPDATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
                    m3.NUMBER_OF_SENDING_DATA = 0;


                    var iCmd3 = m3.insertCommand($.Ctx.DbConn);
                    cmds.push(iCmd3);



                    var tran = new DbTran($.Ctx.DbConn);
                    tran.executeNonQuery(cmds,
                        function (tx, res) {
                            $.Ctx.MsgBox($.Ctx.Lcl('sale_transfer_detail', 'MsgSaveComplete', "Save completed."));
                            $.Ctx.SetPageParam('sale_transfer_detail', 'mode', 'new');
                            $.Ctx.SetPageParam('sale_transfer_detail', 'model', null);
                            $.Ctx.SetPageParam('sale_transfer_detail', 'model2', null);
                            $.Ctx.SetPageParam('sale_transfer_detail', 'SwineInput', null);
                            $.Ctx.SetPageParam('sale_transfer_detail', 'ReasonInput', null);
                            $.Ctx.SetPageParam('sale_transfer_detail', 'ProductInput', ProductInput);
                            $.Ctx.SetPageParam('sale_transfer_detail', 'CustomerInput', CustomerInput);
                            initPage();
                            persistToInput();
                        }, function (err) {
                            $.Ctx.MsgBox("Err :" + err.message);
                        });

                },
                function (err) {
                    $.Ctx.MsgBox(err);
                });
        }
        else if (mode == "edit") {

            $.FarmCtx.SwineActivityUpdate(model, function (cmds) {
                    var uCmd1 = $.Ctx.DbConn.createSelectCommand();
                    uCmd1.sqlText = "UPDATE HH_FR_MS_SWINE_SALE SET ORG_CODE = '{0}' ,FARM_ORG  = '{1}' ,SWINE_ID  = '{2}' ,SWINE_TRACK  = '{3}' ,SWINE_DATE_IN  = '{4}' ,ACTIVITY_DATE  = '{5}' ,CUSTOMER_CODE  = '{6}' ,OWNER = '{7}' ,CREATE_DATE  = '{8}' ,LAST_UPDATE_DATE = '{9}' ,FUNCTION  = 'C' ,PRODUCT_CODE = '{10}',REF_DOC_NO = '{11}',WEIGHT = {12},AMOUNT = {13}, REASON_CODE = '{14}' WHERE ORG_CODE   = '{0}' AND FARM_ORG = '{1}' AND SWINE_ID = '{2}' AND SWINE_TRACK  = '{3}' AND SWINE_DATE_IN  = '{4}' AND ACTIVITY_DATE  = '{5}'".format([bmodel2.ORG_CODE, bmodel2.FARM_ORG, bmodel2.SWINE_ID, bmodel2.SWINE_TRACK, bmodel2.SWINE_DATE_IN, $.Ctx.GetBusinessDate().toDbDateStr(), bmodel2.CUSTOMER_CODE, $.Ctx.UserId, bmodel2.CREATE_DATE, $.Ctx.GetLocalDateTime().toDbDateStr(), bmodel2.PRODUCT_CODE, bmodel2.REF_DOC_NO, bmodel2.WEIGHT, bmodel2.AMOUNT, bmodel2.REASON_CODE  ]);
                    cmds.push(uCmd1);
                    var tran = new DbTran($.Ctx.DbConn);
                    tran.executeNonQuery(cmds,
                        function (tx, res) {
                            $.Ctx.MsgBox($.Ctx.Lcl('sale_transfer_detail', 'MsgSaveComplete', "Save completed."));
                        }, function (err) {
                            $.Ctx.MsgBox("Err :" + err.message);
                        });
                },
                function (err) {
                    $.Ctx.MsgBox(err);
                });
        }

    });
    //end register click event
    console.log("End Register");
});

$('#sale_transfer_detail').bind('pagebeforeshow', function (e) {
    initPage();
    console.log("LookUp");
    //end init lookup
    persistToInput();
});


//declare global pageinit variable
var lkSelectTxt = null;

var mode = $.Ctx.GetPageParam('sale_transfer_detail', 'mode');

var model = new HH_FR_MS_SWINE_ACTIVITY();
var model2 = new HH_FR_MS_SWINE_SALE();
//from lkSwineId
var SwineInput = new HH_FR_MS_SWINE_ACTIVITY();
var CustomerInput = new HH_FR_CUSTOMER_PIG();
var ProductInput = new HH_FR_PRODUCT_SWINE();

//from lkReasonId
var ReasonInput = new HH_GD2_FR_MAS_TYPE_FARM();


function initPage() {
    mode = $.Ctx.GetPageParam('sale_transfer_detail', 'mode');

    model = $.Ctx.GetPageParam('sale_transfer_detail', 'model');
    if (model == null) {
        model = new HH_FR_MS_SWINE_ACTIVITY();
        model.ORG_CODE = $.Ctx.SubOp;
        model.FARM_ORG = $.Ctx.Warehouse;
        model.NUMBER_OF_SENDING_DATA = 0;
    }
    model.ACTIVITY_TYPE = 'S';

    model2 = $.Ctx.GetPageParam('sale_transfer_detail', 'model2');
    if (model2 == null) {
        model2 = new HH_FR_MS_SWINE_SALE();
        model2.ORG_CODE = $.Ctx.SubOp;
        model2.FARM_ORG = $.Ctx.Warehouse;
        model2.ACTIVITY_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
        model2.NUMBER_OF_SENDING_DATA = 0;
    }
    if (model.NUMBER_OF_SENDING_DATA != null)
        if (model.NUMBER_OF_SENDING_DATA > 0 )
            $('#sale_transfer_detail #btnSave').hide();


    //initialize;
    if (mode == 'new') {
        $('#sale_transfer_detail #lkSwineId').removeClass('ui-disabled');
        //$('#sale_transfer_detail #lkSwineId').attr('disabled', '');
    } else if (mode == 'edit') {
        $('#sale_transfer_detail #lkSwineId').addClass('ui-disabled');
        //$('#sale_transfer_detail #lkSwineId').attr('disabled', 'disabled');
    }
    //init lookup;
    SwineInput = $.Ctx.GetPageParam('sale_transfer_detail', 'SwineInput');
    if (SwineInput != null) {
		if (SwineInput.SWINE_ID!==model.SWINE_ID){
			model2.PRODUCT_CODE=null;
			model2.DESCRIPTION=null;
			$.Ctx.SetPageParam('sale_transfer_detail', 'ProductInput', null);
		}
        model.SWINE_ID = SwineInput.SWINE_ID;
        model.SWINE_TRACK = SwineInput.SWINE_TRACK;
        model.SWINE_DATE_IN = SwineInput.SWINE_DATE_IN;
        model.ACTIVITY_DATE = SwineInput.ACTIVITY_DATE;
        model.PREVIOUS_ACTIVITY_TYPE = SwineInput.ACTIVITY_TYPE;
        model.SEX = SwineInput.SEX;
		model.BREEDER = SwineInput.BREEDER;
    }
    CustomerInput = $.Ctx.GetPageParam('sale_transfer_detail', 'CustomerInput');
    if (CustomerInput != null) {
        model2.CUSTOMER_CODE = CustomerInput.CUSTOMER_CODE;
        model2.CUSTOMER_NAME = CustomerInput.CUSTOMER_NAME;
    }
    ProductInput = $.Ctx.GetPageParam('sale_transfer_detail', 'ProductInput');
    if (ProductInput != null) {
        model2.PRODUCT_CODE = ProductInput.PRODUCT_CODE ;
        var desc = ProductInput.DESC_ENG;
        if ($.Ctx.Lang != 'en-US'){
            desc = ProductInput.DESC_LOC;
        }
        model2.DESCRIPTION = desc;
    }

    ReasonInput = $.Ctx.GetPageParam('sale_transfer_detail', 'ReasonInput');
    if (ReasonInput != null) {
        model2.REASON_CODE = ReasonInput.GD_CODE;
        var desc = ReasonInput.DESC_ENG;
        if ($.Ctx.Lang != 'en-US') {
            desc = ReasonInput.DESC_LOC;
        }
        model2.REASON_DESCRIPTION = desc
    }


    model.ACTIVITY_TYPE = 'S';

    if (!IsNullOrEmpty($('#sale_transfer_detail #txtRefDoc').val()) ){
        model2.REF_DOC_NO = $('#sale_transfer_detail #txtRefDoc').val();
    }
}
var temp;
//persist model to input
function persistToInput() {
    if (!IsNullOrEmpty(model.SWINE_TRACK)) {
        $('#sale_transfer_detail #lkSwineId span').text(model.SWINE_TRACK);
    } else {
        $('#sale_transfer_detail #lkSwineId span').text(lkSelectTxt);
    }
    if (!IsNullOrEmpty(model2.CUSTOMER_NAME)) {
        $('#sale_transfer_detail #lkCustomerId span').text(model2.CUSTOMER_NAME);
    } else {
        $('#sale_transfer_detail #lkCustomerId span').text(lkSelectTxt);
    }

    if (!IsNullOrEmpty(model2.REASON_DESCRIPTION)) {
        $('#sale_transfer_detail #lkReasonId span').text(model2.REASON_DESCRIPTION);
    } else {
        $('#sale_transfer_detail #lkReasonId span').text(lkSelectTxt);
    }

    if (!IsNullOrEmpty(model2.DESCRIPTION)) {
        $('#sale_transfer_detail #lkProductId span').text(model2.DESCRIPTION);
    } else {
        $('#sale_transfer_detail #lkProductId span').text(lkSelectTxt);
    }
    if (!IsNullOrEmpty(model2.REF_DOC_NO)) {
        $('#sale_transfer_detail #txtRefDoc').val(model2.REF_DOC_NO);
    } else {
        $('#sale_transfer_detail #txtRefDoc').val("");
    }
    if (!IsNanOrNullOrEmpty(model2.WEIGHT)) {
        $('#sale_transfer_detail #txtWeight').val(model2.WEIGHT);
    } else {
        $('#sale_transfer_detail #txtWeight').val("");
    }
    if (!IsNanOrNullOrEmpty(model2.AMOUNT)) {
        $('#sale_transfer_detail #txtAmount').val(model2.AMOUNT);
    } else {
        $('#sale_transfer_detail #txtAmount').val("");
    }
}

//retrieve input to model
function retrieveFromInput() {
    var txt;
    txt = $('#sale_transfer_detail #lkSwineId span').text();
    if (txt != lkSelectTxt && SwineInput != null) {
        model.SWINE_ID = SwineInput.SWINE_ID;
        model.SWINE_TRACK = txt;
        model.SWINE_DATE_IN = SwineInput.SWINE_DATE_IN;
        model.ACTIVITY_DATE = SwineInput.ACTIVITY_DATE;
        model.PREVIOUS_ACTIVITY_TYPE = SwineInput.ACTIVITY_TYPE;
        model.SEX = SwineInput.SEX;
    }
    txt = $('#sale_transfer_detail #lkProductId span').text();
    if (txt != lkSelectTxt && ProductInput != null) {
        model2.PRODUCT_CODE = ProductInput.PRODUCT_CODE;
        var desc = ProductInput.DESC_ENG;
        if ($.Ctx.Lang != 'en-US'){
            desc = ProductInput.DESC_LOC;
        }
        model2.DESCRIPTION = desc;
    }
    txt = $('#sale_transfer_detail #lkCustomerId span').text();
    if (txt != lkSelectTxt && CustomerInput != null) {
        model2.CUSTOMER_CODE = CustomerInput.CUSTOMER_CODE;
        model2.CUSTOMER_NAME = CustomerInput.CUSTOMER_NAME;
    }
    txt = $('#sale_transfer_detail #lkReasonId span').text();
    if (txt != lkSelectTxt && ReasonInput != null) {
        model2.REASON_CODE  = ReasonInput.GD_CODE;
        var desc = ReasonInput.DESC_ENG;
        if ($.Ctx.Lang != 'en-US') {
            desc = ReasonInput.DESC_LOC;
        }
        model2.REASON_DESCRIPTION = desc
    }

    if (!IsNullOrEmpty($('#sale_transfer_detail #txtRefDoc').val()) ){
        model2.REF_DOC_NO = $('#sale_transfer_detail #txtRefDoc').val();
    }
    if (!IsNanOrNullOrEmpty($('#sale_transfer_detail #txtWeight').val()) ){
        model2.WEIGHT = $('#sale_transfer_detail #txtWeight').val();
    }
    if (!IsNanOrNullOrEmpty($('#sale_transfer_detail #txtAmount').val()) ){
        model2.AMOUNT = $('#sale_transfer_detail #txtAmount').val();
    }

    $.Ctx.SetPageParam('sale_transfer_detail', 'model', model);
    $.Ctx.SetPageParam('sale_transfer_detail', 'model2', model2);

    $.Ctx.SetPageParam('sale_transfer_detail', 'SwineInput', SwineInput);
    $.Ctx.SetPageParam('sale_transfer_detail', 'ReasonInput', ReasonInput);
    $.Ctx.SetPageParam('sale_transfer_detail', 'CustomerInput', CustomerInput);
    $.Ctx.SetPageParam('sale_transfer_detail', 'ProductInput', ProductInput);
}
