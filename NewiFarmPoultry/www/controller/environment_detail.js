//declare global pageinit variable
var lkSelectTxt = null;

var mode = $.Ctx.GetPageParam('environment_detail', 'mode');
var model = new HH_FR_MS_ENVIRONMENT();

var farmOrgInput = new FR_FARM_ORG();
var inTempMinInput = new HH_FR_MS_ENVIRONMENT();
var inTempMaxInput = new HH_FR_MS_ENVIRONMENT();
var outTempMinInput = new HH_FR_MS_ENVIRONMENT();
var outTempMaxInput = new HH_FR_MS_ENVIRONMENT();
var humidMinInput = new HH_FR_MS_ENVIRONMENT();
var humidMaxInput = new HH_FR_MS_ENVIRONMENT();
var stPressMinInput = new HH_FR_MS_ENVIRONMENT();
var stPressMaxInput = new HH_FR_MS_ENVIRONMENT();
var lightInput = new HH_FR_MS_ENVIRONMENT();
var waterInput = new HH_FR_MS_ENVIRONMENT();


$('#environment_detail').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('environment_detail');
    $.Ctx.RenderFooter('environment_detail');
});

$('#environment_detail').bind('pagebeforehide', function (e) {
    retrieveFromInput();
    $.Ctx.PersistPageParam();
});

$('#environment_detail').bind('pageinit', function (e) {
    lkSelectTxt = $.Ctx.Lcl('environment_detail', 'msgSelect', 'Select');
    //Select All Text when focus
    /* $('input').live('focus', function () {
         var $this = $(this);
         $this.select();
         // Work around Chrome's little problem
         $this.mouseup(function () {
             // Prevent further mouseup intervention
             $this.unbind("mouseup");
             return false;
         });
     });*/

    $('#environment_detail #txtInsideTempMin').change(function () {
        var qtyStr = $(this).val();
        $(this).val(Number(qtyStr).toFixed(2));
        if (Number($(this).val()) < 0) {
            $(this).val('');
        }

    });

    $('#environment_detail #txtInsideTempMax').change(function () {
        var qtyStr = $(this).val();
        $(this).val(Number(qtyStr).toFixed(2));
        if (Number($(this).val()) < 0) {
            $(this).val('');
        }

    });

    $('#environment_detail #txtOutsideTempMin').change(function () {
        var qtyStr = $(this).val();
        $(this).val(Number(qtyStr).toFixed(2));
        if (Number($(this).val()) < 0) {
            $(this).val('');
        }

    });

    $('#environment_detail #txtOutsideTempMax').change(function () {
        var qtyStr = $(this).val();
        $(this).val(Number(qtyStr).toFixed(2));
        if (Number($(this).val()) < 0) {
            $(this).val('');
        }

    });

    $('#environment_detail #txtHumidityMin').change(function () {
        var qtyStr = $(this).val();
        $(this).val(Number(qtyStr).toFixed(2));
        if (Number($(this).val()) < 0) {
            $(this).val('');
        }

    });

    $('#environment_detail #txtHumidityMax').change(function () {
        var qtyStr = $(this).val();
        $(this).val(Number(qtyStr).toFixed(2));
        if (Number($(this).val()) < 0) {
            $(this).val('');
        }

    });

    $('#environment_detail #txtStaticPressureMin').change(function () {
        var qtyStr = $(this).val();
        $(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val()) < 0) {
            $(this).val('');
        }

    });

    $('#environment_detail #txtStaticPressureMax').change(function () {
        var qtyStr = $(this).val();
        $(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val()) < 0) {
            $(this).val('');
        }

    });

    $('#environment_detail #txtLight').change(function () {
        var qtyStr = $(this).val();
        $(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val()) < 0) {
            $(this).val('');
        }

    });

    $('#environment_detail #txtWaterUse').change(function () {
        var qtyStr = $(this).val();
        $(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val()) < 0) {
            $(this).val('');
        }

    });

    $('#environment_detail a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('environment_detail', 'Previous'), null, { transition: 'slide', reverse: 'true' });
    });

    $('#environment_detail #lkFarmOrg').click(function (e) {

        //SELECT DISTINCT  A.FARM_ORG , A.NAME_LOC , A.NAME_ENG FROM FR_FARM_ORG A  WHERE  A.ORG_CODE = '{0}' AND A.FARM_ORG NOT IN (SELECT B.FARM_ORG_LOC FROM HH_FR_MS_ENVIRONMENT B WHERE B.ORG_CODE = A.ORG_CODE AND B.TRANSACTION_DATE = '{1}')".format([$.Ctx.SubOp , $.Ctx.GetBusinessDate().toDbDateStr()]);

        var p = new LookupParam();
        p.calledPage = 'environment_detail';
        p.calledResult = 'farmOrgInput'
        $.Ctx.SetPageParam('lookup_farm_org', 'param', p);
        //                $.Ctx.SetPageParam('lookup_farm_org', 'whereStatement', "FARM_ORG NOT IN (SELECT FARM_ORG_LOC FROM HH_FR_MS_ENVIRONMENT WHERE ORG_CODE = '{0}' AND TRANSACTION_DATE = '{1}')".format([$.Ctx.SubOp,$.Ctx.GetBusinessDate().toDbDateStr()]));
        var selectStatement = "SELECT DISTINCT FARM_ORG_LOC AS FARM_ORG, F.NAME_LOC, F.NAME_ENG "
        selectStatement += " FROM HH_FR_MS_GROWER_STOCK S JOIN FR_FARM_ORG F "
        selectStatement += " ON (S.ORG_CODE=F.ORG_CODE AND S.FARM_ORG_LOC=F.FARM_ORG) "
        selectStatement += " WHERE S.ORG_CODE='{0}' "
        selectStatement += " AND F.FARM='{1}' AND S.FARM_ORG_LOC NOT IN (SELECT FARM_ORG_LOC FROM HH_FR_MS_ENVIRONMENT WHERE ORG_CODE ='{2}' AND TRANSACTION_DATE = '{3}')  "
        selectStatement = selectStatement.format([$.Ctx.SubOp, $.Ctx.SubWarehouse, $.Ctx.SubOp, $.Ctx.GetBusinessDate().toDbDateStr()])


        $.FarmCtx.SearchFarmOrgUsingMapMobile(function (ret) {
            //dataSource = ret;
            $.Ctx.SetPageParam('lookup_farm_org', "dataSource", ret);
            $.Ctx.SetPageParam('lookup_farm_org', 'selectStatement', selectStatement);
            $.Ctx.SetPageParam('lookup_farm_org', 'Previous', 'environment_detail');
            $.Ctx.NavigatePage('lookup_farm_org', null, { transition: 'slide' }, false);
        });
    });


    $('#environment_detail #btnSave').click(function (e) {
        retrieveFromInput();
        'Validate input if error show alert and return'
        var err = "";
        if (IsNullOrEmpty(model.FARM_ORG_LOC)) {
            var s = $.Ctx.Lcl('environment_detail', 'MsgIsRequire', '{0} is required.').format([$('#environment_detail #lblFarmOrg').text()]);
            err += s;
        }
        //if (model.TEMP_MIN != null || model.TEMP_MAX != null) {
        //    if (model.TEMP_MIN == null) {
        //        var s = $.Ctx.Lcl('environment_detail', 'MsgIsRequire', '{0} is required.').format([$('#environment_detail #lblInsideTemp').text() + " Min"]);
        //        err += s;
        //    }
        //    if (model.TEMP_MAX == null) {
        //        var s = $.Ctx.Lcl('environment_detail', 'MsgIsRequire', '{0} is required.').format([$('#environment_detail #lblInsideTemp').text() + " Max"]);
        //        err += s;
        //    }

        //    if (model.TEMP_MIN != null && model.TEMP_MAX != null && model.TEMP_MIN > model.TEMP_MAX) {
        //        var s = $.Ctx.Lcl('environment_detail', 'MsgMustLowerThan', '{0} must lower than {1}.').format([$('#environment_detail #lblInsideTemp').text() + " Min", $('#environment_detail #lblInsideTemp').text() + " Max"]);
        //        err += s;
        //    }


        //}

        //if (model.OUTSIDE_TEMP_LOW != null || model.OUTSIDE_TEMP_HIGH != null) {
        //    if (model.OUTSIDE_TEMP_LOW == null) {
        //        var s = $.Ctx.Lcl('environment_detail', 'MsgIsRequire', '{0} is required.').format([$('#environment_detail #lblOutsideTemp').text() + " Min"]);
        //        err += s;
        //    }
        //    if (model.OUTSIDE_TEMP_HIGH == null) {
        //        var s = $.Ctx.Lcl('environment_detail', 'MsgIsRequire', '{0} is required.').format([$('#environment_detail #lblOutsideTemp').text() + " Max"]);
        //        err += s;
        //    }

        //    if (model.OUTSIDE_TEMP_LOW != null && model.OUTSIDE_TEMP_HIGH != null && model.OUTSIDE_TEMP_LOW > model.OUTSIDE_TEMP_HIGH) {
        //        var s = $.Ctx.Lcl('environment_detail', 'MsgMustLowerThan', '{0} must lower than {1}.').format([$('#environment_detail #lblOutsideTemp').text() + " Min", $('#environment_detail #lblOutsideTemp').text() + " Max"]);
        //        err += s;
        //    }


        //}

        //if (model.HUMIDITY_MIN != null || model.HUMIDITY_MAX != null) {
        //    if (model.HUMIDITY_MIN == null) {
        //        var s = $.Ctx.Lcl('environment_detail', 'MsgIsRequire', '{0} is required.').format([$('#environment_detail #lblHumidity').text() + " Min"]);
        //        err += s;
        //    }
        //    if (model.HUMIDITY_MAX == null) {
        //        var s = $.Ctx.Lcl('environment_detail', 'MsgIsRequire', '{0} is required.').format([$('#environment_detail #lblHumidity').text() + " Max"]);
        //        err += s;
        //    }

        //    if (model.HUMIDITY_MIN != null && model.HUMIDITY_MAX != null && model.HUMIDITY_MIN > model.HUMIDITY_MAX) {
        //        var s = $.Ctx.Lcl('environment_detail', 'MsgMustLowerThan', '{0} must lower than {1}.').format([$('#environment_detail #lblHumidity').text() + " Min", $('#environment_detail #lblHumidity').text() + " Max"]);
        //        err += s;
        //    }


        //}

        //if (model.PRESSURE_MIN != null || model.PRESSURE_MAX != null) {
        //    if (model.PRESSURE_MIN == null) {
        //        var s = $.Ctx.Lcl('environment_detail', 'MsgIsRequire', '{0} is required.').format([$('#environment_detail #lblStaticPressure').text() + " Min"]);
        //        err += s;
        //    }
        //    if (model.PRESSURE_MAX == null) {
        //        var s = $.Ctx.Lcl('environment_detail', 'MsgIsRequire', '{0} is required.').format([$('#environment_detail #lblStaticPressure').text() + " Max"]);
        //        err += s;
        //    }

        //    if (model.PRESSURE_MIN != null && model.PRESSURE_MAX != null && model.PRESSURE_MIN > model.PRESSURE_MAX) {
        //        var s = $.Ctx.Lcl('environment_detail', 'MsgMustLowerThan', '{0} must lower than {1}.').format([$('#environment_detail #lblStaticPressure').text() + " Min", $('#environment_detail #lblStaticPressure').text() + " Max"]);
        //        err += s;
        //    }


        //}

        //if ((model.TEMP_MIN == null) && (model.TEMP_MAX == null) && (model.OUTSIDE_TEMP_LOW == null) && (model.OUTSIDE_TEMP_HIGH == null) && (model.HUMIDITY_MIN == null) && (model.HUMIDITY_MAX == null) && (model.PRESSURE_MIN == null) && (model.PRESSURE_MAX == null) && (model.LIGHT == null) && (model.WATER_USE == null)) {
        //    var s = $.Ctx.Lcl('environment_detail', 'MsgIsRequire', '{0} is required.').format(["Data"]);
        //    err += s;
        //}
        //if (err.length != 0) {
        //    $.Ctx.MsgBox(err);
        //    return;
        //}

        var m = new HH_FR_MS_ENVIRONMENT();
        var bmodel = model;

        if (mode == "new") {

            m.ORG_CODE = $.Ctx.SubOp;
            m.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            m.FARM_ORG_LOC = bmodel.FARM_ORG_LOC;
            m.TEMP_MIN = bmodel.TEMP_MIN;
            m.TEMP_MAX = bmodel.TEMP_MAX;
            m.OUTSIDE_TEMP_LOW = bmodel.OUTSIDE_TEMP_LOW;
            m.OUTSIDE_TEMP_HIGH = bmodel.OUTSIDE_TEMP_HIGH;
            m.LIGHT = bmodel.LIGHT;
            m.HUMIDITY_MIN = bmodel.HUMIDITY_MIN;
            m.HUMIDITY_MAX = bmodel.HUMIDITY_MAX;
            m.PRESSURE_MIN = bmodel.PRESSURE_MIN;
            m.PRESSURE_MAX = bmodel.PRESSURE_MAX;
            m.WATER_USE = bmodel.WATER_USE;
            m.OWNER = $.Ctx.UserId;
            m.CREATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
            m.LAST_UPDATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
            m.FUNCTION = 'A';
            m.NUMBER_OF_SENDING_DATA = 0;


            var iCmd = m.insertCommand($.Ctx.DbConn);
            iCmd.executeNonQuery(
                function (tx, res) {
                    $.Ctx.MsgBox($.Ctx.Lcl('environment_detail', 'MsgSaveComplete', "Save completed"));
                    $.Ctx.SetPageParam('environment_detail', 'model', null);
                    $.Ctx.SetPageParam('environment_detail', 'farmOrgInput', null);

                    initPage();
                    persistToInput();
                }, function (err) {
                    $.Ctx.MsgBox("Err :" + err.message);
                });


        } else if (mode == "edit") {

            var uCmd = $.Ctx.DbConn.createSelectCommand();
            uCmd.sqlText = "UPDATE HH_FR_MS_ENVIRONMENT SET TEMP_MIN = {0} , TEMP_MAX = {1} , OUTSIDE_TEMP_LOW = {2} , OUTSIDE_TEMP_HIGH = {3} , LIGHT = {4} , HUMIDITY_MIN = {5} , HUMIDITY_MAX = {6} , PRESSURE_MIN = {7} , PRESSURE_MAX = {8} , WATER_USE = {9} , OWNER = '{10}' , LAST_UPDATE_DATE = '{11}' , FUNCTION = 'U'  WHERE  ORG_CODE = '{12}' AND FARM_ORG_LOC = '{13}' AND TRANSACTION_DATE = '{14}'".format([bmodel.TEMP_MIN, bmodel.TEMP_MAX, bmodel.OUTSIDE_TEMP_LOW, bmodel.OUTSIDE_TEMP_HIGH, bmodel.LIGHT, bmodel.HUMIDITY_MIN, bmodel.HUMIDITY_MAX, bmodel.PRESSURE_MIN, bmodel.PRESSURE_MAX, bmodel.WATER_USE, $.Ctx.UserId, $.Ctx.GetLocalDateTime().toDbDateStr(), $.Ctx.SubOp, bmodel.FARM_ORG_LOC, bmodel.TRANSACTION_DATE]);

            uCmd.executeNonQuery(
                function (tx, res) {
                    $.Ctx.MsgBox($.Ctx.Lcl('environment_detail', 'MsgSaveComplete', "Save completed"));
                }, function (err) {
                    $.Ctx.MsgBox("Err :" + err.message);
                });

        }
    });
    //end register click event
});

$('#environment_detail').bind('pagebeforeshow', function (e, ui) {
    initPage();
    //end init lookup
    persistToInput();
    //register click event
});

function initPage() {
    mode = $.Ctx.GetPageParam('environment_detail', 'mode');
    //initialize;
    if (mode == 'new') {
        $('#environment_detail #lkFarmOrg').removeClass('ui-disabled');
        //$('#environment_detail #lkSowId').attr('disabled', '');
    } else if (mode == 'edit') {
        $('#environment_detail #lkFarmOrg').addClass('ui-disabled');
        //$('#environment_detail #lkSowId').attr('disabled', 'disabled');
    }
}

//persist model to input
function persistToInput() {
    model = $.Ctx.GetPageParam('environment_detail', 'model');
    if (model == null) {
        model = new HH_FR_MS_ENVIRONMENT();
        model.ORG_CODE = $.Ctx.SubOp;
        model.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
    }
    if (model.NUMBER_OF_SENDING_DATA != null)
        if (model.NUMBER_OF_SENDING_DATA > 0)
            $('#environment_detail #btnSave').hide();



    //init lookup;
    farmOrgInput = $.Ctx.GetPageParam('environment_detail', 'farmOrgInput');
   
    //farmOrgInput.FARM_ORG = farmOrgInput.CODE;

    if (farmOrgInput != null) {
        var desc = farmOrgInput.NAME_ENG;
        farmOrgInput.NAME_ENG = farmOrgInput.NAME_LOC = farmOrgInput.NAME;
        if ($.Ctx.Lang != 'en-US') {
            desc = farmOrgInput.NAME_LOC;
            farmOrgInput.NAME_ENG = farmOrgInput.NAME_LOC = farmOrgInput.NAME;
        }
        if (farmOrgInput.CODE != null)
         farmOrgInput.FARM_ORG = farmOrgInput.CODE;

        if (farmOrgInput.CODE != null || typeof farmOrgInput.CODE != 'undefined')
            farmOrgInput.FARM_ORG = farmOrgInput.CODE;

        if (farmOrgInput.NAME != null || typeof farmOrgInput.NAME != 'undefined')
            farmOrgInput.NAME_ENG = farmOrgInput.NAME_LOC = desc = farmOrgInput.NAME;

        model.FARM_ORG_LOC = farmOrgInput.FARM_ORG;
        model.FARM_ORG_LOC_NAME = desc;
    }

    inTempMinInput = $.Ctx.GetPageParam('environment_detail', 'inTempMinInput');
    if (inTempMinInput != null) {
        model.TEMP_MIN = Number(inTempMinInput);
    }
    inTempMaxInput = $.Ctx.GetPageParam('environment_detail', 'inTempMaxInput');
    if (inTempMaxInput != null) {
        model.TEMP_MAX = Number(inTempMaxInput);
    }
    outTempMinInput = $.Ctx.GetPageParam('environment_detail', 'outTempMinInput');
    if (outTempMinInput != null) {
        model.OUTSIDE_TEMP_LOW = Number(outTempMinInput);
    }
    outTempMaxInput = $.Ctx.GetPageParam('environment_detail', 'outTempMaxInput');
    if (outTempMaxInput != null) {
        model.OUTSIDE_TEMP_HIGH = Number(outTempMaxInput);
    }
    humidMinInput = $.Ctx.GetPageParam('environment_detail', 'humidMinInput');
    if (humidMinInput != null) {
        model.HUMIDITY_MIN = Number(humidMinInput);
    }
    humidMaxInput = $.Ctx.GetPageParam('environment_detail', 'humidMaxInput');
    if (humidMaxInput != null) {
        model.HUMIDITY_MAX = Number(humidMaxInput);
    }
    stPressMinInput = $.Ctx.GetPageParam('environment_detail', 'stPressMinInput');
    if (stPressMinInput != null) {
        model.PRESSURE_MIN = Number(stPressMinInput);
    }
    stPressMaxInput = $.Ctx.GetPageParam('environment_detail', 'stPressMaxInput');
    if (stPressMaxInput != null) {
        model.PRESSURE_MAX = Number(stPressMaxInput);
    }
    lightInput = $.Ctx.GetPageParam('environment_detail', 'lightInput');
    if (lightInput != null) {
        model.LIGHT = Number(lightInput);
    }
    waterInput = $.Ctx.GetPageParam('environment_detail', 'waterInput');
    if (waterInput != null) {
        model.WATER_USE = Number(waterInput);
    }


    if (!IsNullOrEmpty(model.FARM_ORG_LOC)) {
        $('#environment_detail #lkFarmOrg span').text(model.FARM_ORG_LOC + "("+model.FARM_ORG_LOC_NAME+")");
    } else {
        $('#environment_detail #lkFarmOrg span').text(lkSelectTxt);
    }

    if (typeof (model.TEMP_MIN) != 'undefined') {
        Number($('#environment_detail #txtInsideTempMin').val(model.TEMP_MIN));
    } else {
        Number($('#environment_detail #txtInsideTempMin').val(''));
    }
    if (typeof (model.TEMP_MAX) != 'undefined') {
        Number($('#environment_detail #txtInsideTempMax').val(model.TEMP_MAX));
    } else {
        Number($('#environment_detail #txtInsideTempMax').val(''));
    }
    if (typeof (model.OUTSIDE_TEMP_LOW) != 'undefined') {
        Number($('#environment_detail #txtOutsideTempMin').val(model.OUTSIDE_TEMP_LOW));
    } else {
        Number($('#environment_detail #txtOutsideTempMin').val(''));
    }
    if (typeof (model.OUTSIDE_TEMP_HIGH) != 'undefined') {
        Number($('#environment_detail #txtOutsideTempMax').val(model.OUTSIDE_TEMP_HIGH));
    } else {
        Number($('#environment_detail #txtOutsideTempMax').val(''));
    }
    if (typeof (model.HUMIDITY_MIN) != 'undefined') {
        Number($('#environment_detail #txtHumidityMin').val(model.HUMIDITY_MIN));
    } else {
        Number($('#environment_detail #txtHumidityMin').val(''));
    }
    if (typeof (model.HUMIDITY_MAX) != 'undefined') {
        Number($('#environment_detail #txtHumidityMax').val(model.HUMIDITY_MAX));
    } else {
        Number($('#environment_detail #txtHumidityMax').val(''));
    }
    if (typeof (model.PRESSURE_MIN) != 'undefined') {
        Number($('#environment_detail #txtStaticPressureMin').val(model.PRESSURE_MIN));
    } else {
        Number($('#environment_detail #txtStaticPressureMin').val(''));
    }
    if (typeof (model.PRESSURE_MAX) != 'undefined') {
        Number($('#environment_detail #txtStaticPressureMax').val(model.PRESSURE_MAX));
    } else {
        Number($('#environment_detail #txtStaticPressureMax').val(''));
    }
    if (typeof (model.LIGHT) != 'undefined') {
        Number($('#environment_detail #txtLight').val(model.LIGHT));
    } else {
        Number($('#environment_detail #txtLight').val(''));
    }
    if (typeof (model.WATER_USE) != 'undefined') {
        Number($('#environment_detail #txtWaterUse').val(model.WATER_USE));
    } else {
        Number($('#environment_detail #txtWaterUse').val(''));
    }

}

//retrieve input to model
function retrieveFromInput() {
    var txt;
    txt = $('#environment_detail #lkFarmOrg span').text();
    if (txt != lkSelectTxt && farmOrgInput != null) {
        model.FARM_ORG_LOC = farmOrgInput.FARM_ORG;
        model.FARM_ORG_LOC_NAME = txt;
    }
    txt = $('#environment_detail #txtInsideTempMin').val();
    if (txt != '') {
        model.TEMP_MIN = Number(txt);
    }
    txt = $('#environment_detail #txtInsideTempMax').val();
    if (txt != '') {
        model.TEMP_MAX = Number(txt);
    }
    txt = $('#environment_detail #txtOutsideTempMin').val();
    if (txt != '') {
        model.OUTSIDE_TEMP_LOW = Number(txt);
    }
    txt = $('#environment_detail #txtOutsideTempMax').val();
    if (txt != '') {
        model.OUTSIDE_TEMP_HIGH = Number(txt);
    }
    txt = $('#environment_detail #txtHumidityMin').val();
    if (txt != '') {
        model.HUMIDITY_MIN = Number(txt);
    }
    txt = $('#environment_detail #txtHumidityMax').val();
    if (txt != '') {
        model.HUMIDITY_MAX = Number(txt);
    }
    txt = $('#environment_detail #txtStaticPressureMin').val();
    if (txt != '') {
        model.PRESSURE_MIN = Number(txt);
    }
    txt = $('#environment_detail #txtStaticPressureMax').val();
    if (txt != '') {
        model.PRESSURE_MAX = Number(txt);
    }
    txt = $('#environment_detail #txtLight').val();
    if (txt != '') {
        model.LIGHT = Number(txt);
    }
    txt = $('#environment_detail #txtWaterUse').val();
    if (txt != '') {
        model.WATER_USE = Number(txt);
    }

    $.Ctx.SetPageParam('environment_detail', 'model', model);

}


