//declare global pageinit variable
var lkSelectTxt = null;

var mode = $.Ctx.GetPageParam('efficiency_detail', 'mode');
var model = new HH_FR_MS_PRODUCTION();

var farmOrgInput = new FR_FARM_ORG();
var fWghInput = new HH_FR_MS_PRODUCTION();
var mWghInput = new HH_FR_MS_PRODUCTION();
var eWghInput = new HH_FR_MS_PRODUCTION();
var uniInput = new HH_FR_MS_PRODUCTION();


$('#efficiency_detail').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('efficiency_detail');
    $.Ctx.RenderFooter('efficiency_detail');
});

$('#efficiency_detail').bind('pagebeforehide', function (e) {
    retrieveFromInput();
    $.Ctx.PersistPageParam();
});

$('#efficiency_detail').bind('pageinit', function (e) {
    lkSelectTxt = $.Ctx.Lcl('efficiency_detail', 'msgSelect', 'Select');
    //Select All Text when focus
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

    $('#efficiency_detail #txtFemaleWgh').change(function () {
        var qtyStr = $(this).val();
        $(this).val(Number(qtyStr).toFixed(2));
        if (Number($(this).val()) < 0) {
            $(this).val('');
        }

    });

    $('#efficiency_detail #txtMaleWgh').change(function () {
        var qtyStr = $(this).val();
        $(this).val(Number(qtyStr).toFixed(2));
        if (Number($(this).val()) < 0) {
            $(this).val('');
        }

    });

    $('#efficiency_detail #txtEggWgh').change(function () {
        var qtyStr = $(this).val();
        $(this).val(Number(qtyStr).toFixed(2));
        if (Number($(this).val()) < 0) {
            $(this).val('');
        }

    });

    $('#efficiency_detail #txtUniform').change(function () {
        var qtyStr = $(this).val();
        $(this).val(Number(qtyStr).toFixed(2));
        if (Number($(this).val()) < 0) {
            $(this).val('');
        }

    });

    $('#efficiency_detail a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('efficiency_detail', 'Previous'), null, { transition: 'slide', reverse: 'true' });
    });

    $('#efficiency_detail #lkFarmOrg').click(function (e) {
        var p = new LookupParam();
        p.calledPage = 'efficiency_detail';
        p.calledResult = 'farmOrgInput'
        $.Ctx.SetPageParam('lookup_farm_org', 'param', p);
        var selectStatement = "SELECT DISTINCT S.FARM_ORG_LOC AS FARM_ORG, F.NAME_LOC, F.NAME_ENG " +
            "FROM HH_FR_MS_GROWER_STOCK S JOIN FR_FARM_ORG F  " +
            "ON (S.ORG_CODE=F.ORG_CODE AND S.FARM_ORG_LOC=F.FARM_ORG)" +
            " WHERE S.ORG_CODE= '{0}' " +
            "  AND F.FARM= '{1}' AND S.FARM_ORG_LOC NOT IN (SELECT FARM_ORG_LOC FROM HH_FR_MS_PRODUCTION WHERE ORG_CODE = '{2}' AND TRANSACTION_DATE = '{3}' )"
        selectStatement = selectStatement.format([$.Ctx.SubOp, $.Ctx.SubWarehouse, $.Ctx.SubOp, $.Ctx.GetBusinessDate().toDbDateStr()]);
        //                $.Ctx.SetPageParam('lookup_farm_org', 'whereStatement', "FARM_ORG NOT IN (SELECT FARM_ORG_LOC FROM HH_FR_MS_PRODUCTION WHERE ORG_CODE = '{0}' AND TRANSACTION_DATE = '{1}')".format([$.Ctx.SubOp,$.Ctx.GetBusinessDate().toDbDateStr()]));

        $.FarmCtx.SearchFarmOrgUsingMapMobile(function (ret) {
            //dataSource = ret;
            $.Ctx.SetPageParam('lookup_farm_org', "dataSource", ret);
            $.Ctx.SetPageParam('lookup_farm_org', "selectStatement", selectStatement);
            $.Ctx.SetPageParam('lookup_farm_org', 'Previous', 'efficiency_detail');
            $.Ctx.NavigatePage('lookup_farm_org', null, { transition: 'slide' }, false);
        });

    });


    $('#efficiency_detail #btnSave').click(function (e) {
        retrieveFromInput();
        'Validate input if error show alert and return'
        var err = "";
        if (IsNullOrEmpty(model.FARM_ORG_LOC)) {
            txtUniform
            var s = $.Ctx.Lcl('efficiency_detail', 'MsgIsRequire', '{0} is required.').format([$('#efficiency_detail #lblFarmOrg').text()]);
            err += s;
        }

        if ((model.LIVESTOCK_WGH_FEMALE == null) && (model.LIVESTOCK_WGH_MALE == null) && (model.EGG_WGH == null) && (model.UNIFORM == null)) {
            var s = $.Ctx.Lcl('efficiency_detail', 'MsgIsRequire', '{0} is required.').format(["Data"]);
            err += s;
        }
        if (err.length != 0) {
            $.Ctx.MsgBox(err);
            return;
        }

        var m = new HH_FR_MS_PRODUCTION();
        var bmodel = model;

        if (mode == "new") {
            m.ORG_CODE = $.Ctx.SubOp;
            m.FARM_ORG_LOC = bmodel.FARM_ORG_LOC;
            m.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            m.EGG_WGH = bmodel.EGG_WGH
            m.LIVESTOCK_WGH_FEMALE = bmodel.LIVESTOCK_WGH_FEMALE
            m.LIVESTOCK_WGH_MALE = bmodel.LIVESTOCK_WGH_MALE
            m.UNIFORM = bmodel.UNIFORM
            m.OWNER = $.Ctx.UserId;
            m.CREATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
            m.LAST_UPDATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
            m.FUNCTION = 'A';
            m.NUMBER_OF_SENDING_DATA = 0;

            var iCmd = m.insertCommand($.Ctx.DbConn);
            iCmd.executeNonQuery(
                function (tx, res) {
                    $.Ctx.MsgBox($.Ctx.Lcl('efficiency_detail', 'MsgSaveComplete', "Save completed"));
                    $.Ctx.SetPageParam('efficiency_detail', 'model', null);
                    $.Ctx.SetPageParam('efficiency_detail', 'farmOrgInput', null);

                    initPage();
                    persistToInput();
                }, function (err) {
                    $.Ctx.MsgBox("Err :" + err.message);
                });


        } else if (mode == "edit") {

            var uCmd = $.Ctx.DbConn.createSelectCommand();
            uCmd.sqlText = "UPDATE HH_FR_MS_PRODUCTION SET EGG_WGH = {0} , LIVESTOCK_WGH_FEMALE = {1} , LIVESTOCK_WGH_MALE = {2} , UNIFORM = {3} , OWNER = '{4}' , LAST_UPDATE_DATE = '{5}' , FUNCTION = 'U'  WHERE  ORG_CODE = '{6}' AND FARM_ORG_LOC = '{7}' AND TRANSACTION_DATE = '{8}'".format([bmodel.EGG_WGH, bmodel.LIVESTOCK_WGH_FEMALE, bmodel.LIVESTOCK_WGH_MALE, bmodel.UNIFORM, $.Ctx.UserId, $.Ctx.GetLocalDateTime().toDbDateStr(), $.Ctx.SubOp, bmodel.FARM_ORG_LOC, bmodel.TRANSACTION_DATE]);

            uCmd.executeNonQuery(
                function (tx, res) {
                    $.Ctx.MsgBox($.Ctx.Lcl('efficiency_detail', 'MsgSaveComplete', "Save completed"));
                }, function (err) {
                    $.Ctx.MsgBox("Err :" + err.message);
                });

        }
    });
    //end register click event
});

$('#efficiency_detail').bind('pagebeforeshow', function (e, ui) {
    initPage();
    //end init lookup
    persistToInput();
    //register click event
});

function initPage() {
    mode = $.Ctx.GetPageParam('efficiency_detail', 'mode');
    //initialize;
    if (mode == 'new') {
        $('#efficiency_detail #lkFarmOrg').removeClass('ui-disabled');
        //$('#efficiency_detail #lkSowId').attr('disabled', '');
    } else if (mode == 'edit') {
        $('#efficiency_detail #lkFarmOrg').addClass('ui-disabled');
        //$('#efficiency_detail #lkSowId').attr('disabled', 'disabled');
    }
}

//persist model to input
function persistToInput() {
    model = $.Ctx.GetPageParam('efficiency_detail', 'model');
    if (model == null) {
        model = new HH_FR_MS_PRODUCTION();
        model.ORG_CODE = $.Ctx.SubOp;
        model.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
    }
    if (model.NUMBER_OF_SENDING_DATA != null)
        if (model.NUMBER_OF_SENDING_DATA > 0)
            $('#efficiency_detail #btnSave').hide();



    //init lookup;
    farmOrgInput = $.Ctx.GetPageParam('efficiency_detail', 'farmOrgInput');
    if (farmOrgInput != null) {
        var desc = farmOrgInput.NAME_ENG;
        if ($.Ctx.Lang != 'en-US') {
            desc = farmOrgInput.NAME_LOC;
        }
        if(farmOrgInput.CODE != null || typeof farmOrgInput.CODE != 'undefined')
            farmOrgInput.FARM_ORG = farmOrgInput.CODE;
        
        if (farmOrgInput.NAME != null || typeof farmOrgInput.NAME != 'undefined')
            farmOrgInput.NAME_ENG = farmOrgInput.NAME_LOC = desc = farmOrgInput.NAME;

            model.FARM_ORG_LOC = farmOrgInput.FARM_ORG;
        model.FARM_ORG_LOC_NAME = desc;
    }

    fWghInput = $.Ctx.GetPageParam('efficiency_detail', 'fWghInput');
    if (fWghInput != null) {
        model.LIVESTOCK_WGH_FEMALE = Number(fWghInput);
    }
    mWghInput = $.Ctx.GetPageParam('efficiency_detail', 'mWghInput');
    if (mWghInput != null) {
        model.LIVESTOCK_WGH_MALE = Number(mWghInput);
    }
    eWghInput = $.Ctx.GetPageParam('efficiency_detail', 'eWghInput');
    if (eWghInput != null) {
        model.EGG_WGH = Number(eWghInput);
    }
    uniInput = $.Ctx.GetPageParam('efficiency_detail', 'uniInput');
    if (uniInput != null) {
        model.UNIFORM = Number(uniInput);
    }



    if (!IsNullOrEmpty(model.FARM_ORG_LOC)) {
        $('#efficiency_detail #lkFarmOrg span').text(model.FARM_ORG_LOC+"("+model.FARM_ORG_LOC_NAME+")");
    } else {
        $('#efficiency_detail #lkFarmOrg span').text(lkSelectTxt);
    }

    if (typeof (model.LIVESTOCK_WGH_FEMALE) != 'undefined') {
        Number($('#efficiency_detail #txtFemaleWgh').val(model.LIVESTOCK_WGH_FEMALE));
    } else {
        Number($('#efficiency_detail #txtFemaleWgh').val(''));
    }
    if (typeof (model.LIVESTOCK_WGH_MALE) != 'undefined') {
        Number($('#efficiency_detail #txtMaleWgh').val(model.LIVESTOCK_WGH_MALE));
    } else {
        Number($('#efficiency_detail #txtMaleWgh').val(''));
    }
    if (typeof (model.EGG_WGH) != 'undefined') {
        Number($('#efficiency_detail #txtEggWgh').val(model.EGG_WGH));
    } else {
        Number($('#efficiency_detail #txtEggWgh').val(''));
    }
    if (typeof (model.UNIFORM) != 'undefined') {
        Number($('#efficiency_detail #txtUniform').val(model.UNIFORM));
    } else {
        Number($('#efficiency_detail #txtUniform').val(''));
    }
}

//retrieve input to model
function retrieveFromInput() {
    var txt;
    txt = $('#efficiency_detail #lkFarmOrg span').text();
    if (txt != lkSelectTxt && farmOrgInput != null) {
        model.FARM_ORG_LOC = farmOrgInput.FARM_ORG;
        model.FARM_ORG_LOC_NAME = txt;
    }
    txt = $('#efficiency_detail #txtFemaleWgh').val();
    if (txt != '') {
        model.LIVESTOCK_WGH_FEMALE = Number(txt);
    }
    txt = $('#efficiency_detail #txtMaleWgh').val();
    if (txt != '') {
        model.LIVESTOCK_WGH_MALE = Number(txt);
    }
    txt = $('#efficiency_detail #txtEggWgh').val();
    if (txt != '') {
        model.EGG_WGH = Number(txt);
    }
    txt = $('#efficiency_detail #txtUniform').val();
    if (txt != '') {
        model.UNIFORM = Number(txt);
    }

    $.Ctx.SetPageParam('efficiency_detail', 'model', model);

}


