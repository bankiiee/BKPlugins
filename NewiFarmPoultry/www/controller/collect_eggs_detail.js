//var farmOrgInput = new FR_FARM_ORG();

$('#collect_eggs_detail').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('collect_eggs_detail');
    $.Ctx.RenderFooter('collect_eggs_detail');
});

$('#collect_eggs_detail').bind('pagebeforehide', function (e) {
    $.Ctx.PersistPageParam();
});

$('#collect_eggs_detail').bind('pagebeforecreate', function (e) {

});

var farmOrgInput=null;

$('#collect_eggs_detail').bind('pagebeforeshow', function (e) {

    initPage();
    persistToInput();
});

$('#collect_eggs_detail').bind('pageinit', function (e) {

    $('#collect_eggs_detail a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('collect_eggs_detail', 'Previous'), null, { transition:'slide', reverse:'true' });
    });

    $('#collect_eggs_detail #lkFarmOrg').click(function (e) {
        var p = new LookupParam();
        p.calledPage = 'collect_eggs_detail';
        p.calledResult = 'farmOrgInput';
        $.Ctx.SetPageParam('lookup_farm_org', 'param', p);
        $.Ctx.SetPageParam('lookup_farm_org', 'Previous', 'collect_eggs_detail');
        $.Ctx.NavigatePage('lookup_farm_org', null, { transition:'slide' },false );
    });

    $('#collect_eggs_detail #btnSave').bind('click',function(){
        SaveData(function (ret){
            if (ret==true){
                alert($.Ctx.Lcl('collect_eggs_detail', 'MsgSaveComplete', 'Save Completed.'));

                var lkSelectTxt1 = $.Ctx.Lcl('collect_eggs_detail', 'msgSelect', 'Select')
                $('#collect_eggs_detail #lkFarmOrg #lblFarmOrg').text(lkSelectTxt1);
                $('#collect_eggs_detail #lkFarmOrg').addClass('ui-disabled');

                //clearTxtQty
                $( "input[type='number']" ).each(function( i ){
                    Number($('#collect_eggs_detail #G1_txt').val(0));

                    $('#collect_eggs_detail input[id^="G2"]' ).each(function( i ){
                        Number($('#collect_eggs_detail input[id^="G2"]').val(0));
                    });
                    Number($('#collect_eggs_detail #G3_txt').val(0));
                });

                $.Ctx.NavigatePage($.Ctx.GetPageParam('collect_eggs_detail', 'Previous'), null, { transition: 'slide', reverse: false });
            }
        });
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


});


//declare global pageinit variable
var lkSelectTxt = $.Ctx.Lcl('collect_eggs_detail', 'msgSelect', 'Select');
var mode = $.Ctx.GetPageParam('collect_eggs_detail', 'mode');

function initPage() {

    mode = $.Ctx.GetPageParam('collect_eggs_detail', 'mode');
    var model = $.Ctx.GetPageParam('collect_eggs_detail', 'model');

    if (model == null) {
        model = [];
       $.Ctx.SetPageParam('collect_eggs_detail', 'model', model);
    }

    showDataDamageType(function(succ){
        if (succ==true){
            RegisterTextbox();
            if (mode == 'edit') {
                //var model = $.Ctx.GetPageParam('collect_eggs_detail', 'model');
                var txDate = $.Ctx.GetPageParam('collect_eggs_detail', 'txDate');
                var FarmOrg = $.Ctx.GetPageParam('collect_eggs_detail','farmOrg');
                $('#collect_eggs_detail #lkFarmOrg #lblFarmOrg').text(FarmOrg);

                readDataEggPrd(txDate,FarmOrg,function(dt){

                    for (var i=0;i<dt.length;i++){
                         var ePrd = dt[i].EGG_PRODUCT_CODE;
                         var eQty = Number(dt[i].EGG_QTY);

                       $( "input[type='number']" ).each(function( i ){
                            var $prod = $(this).parent();
                            var id = $(this).attr('id');
                            if ($prod.attr('prod')== ePrd){
                                $('#collect_eggs_detail #' + id).val(eQty);
                            }
                        });
                        model.push(dt[i]);
                    }

                });
            }
        }
    });



    $('#collect_eggs_detail #lkFarmOrg').addClass('ui-disabled');
    if (mode == 'new') {
        $('#collect_eggs_detail #lkFarmOrg').removeClass('ui-disabled');
    } else if (mode == 'edit') {
        $('#collect_eggs_detail #lkFarmOrg').addClass('ui-disabled');
    }
}

//persist model to input
function persistToInput() {

   var lkSelectTxt = $.Ctx.Lcl('collect_eggs_detail', 'msgSelect', 'Select');
   var model = $.Ctx.GetPageParam('collect_eggs_detail', 'model');

    if (model == null) {
        model = [];
    }

    //init lookup;
        //model = $.Ctx.GetPageParam('collect_eggs_detail', 'model');
        farmOrgInput = $.Ctx.GetPageParam('collect_eggs_detail', 'farmOrgInput');
        if (farmOrgInput != null) {
            var desc = farmOrgInput.NAME_ENG;
            if ($.Ctx.Lang != 'en-US'){
                desc = farmOrgInput.NAME_LOC;
            }
            model.FARM_ORG_LOC = farmOrgInput.FARM_ORG; ////
            model.FARM_ORG_LOC_NAME = desc;

        }

        if (!IsNullOrEmpty(model.FARM_ORG_LOC)) {
            $('#collect_eggs_detail #lkFarmOrg #lblFarmOrg').text(model.FARM_ORG_LOC);
        } else {
            $('#collect_eggs_detail #lkFarmOrg #lblFarmOrg').text(lkSelectTxt);
        }
}


function checkDuplicate(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();

    cmd.sqlText = "SELECT * ";
    cmd.sqlText += " FROM HH_FR_MS_PRODUCTION_EGG ";
    cmd.sqlText += " WHERE ORG_CODE = ? ";
    cmd.sqlText += " AND FARM_ORG_LOC = ? ";
    cmd.sqlText += " AND TRANSACTION_DATE = ? ";
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push(farmOrgInput.FARM_ORG);
    cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
    var dt = [];
    cmd.executeReader(function (tx, res) {
        if (res.rows.length == 0) {
            SuccessCB(true);
        }else{
            alert($.Ctx.Lcl('collect_eggs_detail', 'msgCannotSave', 'Cannot save this item'));
        }
    }, function (err) {
        alert(err.message);
    });
}
function readNumberOfSendingData(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var txDate = $.Ctx.GetPageParam('collect_eggs_detail', 'txDate');
    var FarmOrg = $.Ctx.GetPageParam('collect_eggs_detail','farmOrg');

    cmd.sqlText = "SELECT DISTINCT FARM_ORG_LOC, TRANSACTION_DATE ,NUMBER_OF_SENDING_DATA ";
    cmd.sqlText += " FROM HH_FR_MS_PRODUCTION_EGG ";
    cmd.sqlText += " WHERE ORG_CODE = ? ";
    cmd.sqlText += " AND FARM_ORG_LOC = ? ";
    cmd.sqlText += " AND TRANSACTION_DATE = ? ";
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push(FarmOrg);
    cmd.parameters.push(txDate);

    var dt = [];
    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            numberOfSending =res.rows.item(0).NUMBER_OF_SENDING_DATA;
            SuccessCB(numberOfSending);

        }else{
            SuccessCB(numberOfSending);
        }
    }, function (err) {
        alert(err.message);
    });
}

function ValidateData(SuccessCB){

   var qtyEggPrd = Number($('#collect_eggs_detail #G1_txt').val());
   var qtyEggDamage = Number($('#collect_eggs_detail #G3_txt').val());
   var txt;
   txt = $('#collect_eggs_detail #lkFarmOrg #lblFarmOrg').text();

    if (txt!==null ){    //if (txt!==null && farmOrgInput.FARM_ORG !== '')
        if (qtyEggPrd !== 0 ){
                if (qtyEggDamage > -1 ){
                        if (mode=='new'){
                                checkDuplicate(function(succ){
                                    SuccessCB(true);
                                 });
                        }else{
                            readNumberOfSendingData(function(a){
                                if(Number(a) == 0){
                                    SuccessCB(true);
                                }else{
                                    SuccessCB(false);
                                }
                            });

                        }
                }
        }
    }

}

function SaveData(SuccessCB){
    //validate
    ValidateData(function(Succ){
        if (Succ==true){
            if (mode=='new'){
                InsertCollectEgg(function(Succ){
                    SuccessCB(true);
                });
            }else{
                var txDate = $.Ctx.GetPageParam('collect_eggs_detail', 'txDate');
                var FarmOrg = $.Ctx.GetPageParam('collect_eggs_detail','farmOrg');
                $.FarmCtx.DeleteCollectEgg(FarmOrg,parseUIDateStr(txDate),function(succ){

                    InsertCollectEgg(function(Succ){
                        SuccessCB(true);
                    });
                } );
            }
            //readDataDamageType();
            //RegisterTextbox();

        }else{
            alert($.Ctx.Lcl('collect_eggs_detail', 'msgCannotSave', 'Cannot save this item'));
        }
    });
}

function InsertCollectEgg(SuccessCB){
    var paramCmd = [];
    //farmOrgLoc = $('#collect_eggs_detail #lkFarmOrg #lblFarmOrg').text();

    $( "input[type='number']" ).each(function( i ){
        var $prod = $(this).parent();
        var cmd ; //= sPrdEgg.insertCommand($.Ctx.DbConn);

        if (Number($(this).val()) > 0){
            var sPrdEgg = new HH_FR_MS_PRODUCTION_EGG();
            sPrdEgg.ORG_CODE = $.Ctx.SubOp;
            //sPrdEgg.FARM_ORG_LOC =  farmOrgInput.FARM_ORG;
            //sPrdEgg.TRANSACTION_DATE =  $.Ctx.GetBusinessDate().toDbDateStr();
            sPrdEgg.EGG_PRODUCT_CODE = $prod.attr('prod');
            sPrdEgg.EGG_QTY = Number($(this).val());
            if (mode=='new'){
                sPrdEgg.FARM_ORG_LOC =  farmOrgInput.FARM_ORG;
                sPrdEgg.TRANSACTION_DATE =  $.Ctx.GetBusinessDate().toDbDateStr();
                sPrdEgg.OWNER = $.Ctx.UserId;
                sPrdEgg.CREATE_DATE = (new XDate()).toDbDateStr();
                sPrdEgg.LAST_UPDATE_DATE = (new XDate()).toDbDateStr();
                sPrdEgg.NUMBER_OF_SENDING_DATA = 0;
            }else{
                var txDate = $.Ctx.GetPageParam('collect_eggs_detail', 'txDate');
                var farmOrg = $.Ctx.GetPageParam('collect_eggs_detail','farmOrg');
                sPrdEgg.FARM_ORG_LOC =  farmOrg;
                sPrdEgg.TRANSACTION_DATE = txDate;
                sPrdEgg.OWNER = $.Ctx.UserId;
                sPrdEgg.CREATE_DATE = txDate;
                sPrdEgg.LAST_UPDATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
                sPrdEgg.NUMBER_OF_SENDING_DATA = 0;
            }
            paramCmd.push(sPrdEgg.insertCommand($.Ctx.DbConn));
        }
    });
    var trn = new DbTran($.Ctx.DbConn);
    trn.executeNonQuery(paramCmd, function(){
        if (typeof(SuccessCB)=="function")
            SuccessCB(true);

        //alert($.Ctx.Lcl('collect_eggs_detail', 'MsgSaveComplete', 'Save Completed.'));
    }, function(errors){
        SuccessCB(false);
        console.log(errors);
    });
}


function readDataEggPrd(tDate,frmOrg,SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();

    var nameField='';
    if ($.Ctx.Lang=="en-US")
        nameField = "ifnull(HD.DESC_ENG, HD.DESC_LOC)";
    else
        nameField = "ifnull(HD.DESC_LOC, HD.DESC_ENG)";

    cmd.sqlText = "SELECT MS.FARM_ORG_LOC,MS.TRANSACTION_DATE,MS.EGG_PRODUCT_CODE,HD.DAMAGE_TYPE, {0} AS TYPE_NAME ,MS.EGG_QTY,MS.NUMBER_OF_SENDING_DATA".format([nameField]);
    cmd.sqlText += " FROM HH_FR_MS_PRODUCTION_EGG MS,HH_FR_MS_DAMAGE_TYPE HD ";
    cmd.sqlText += " WHERE MS.ORG_CODE = HD.ORG_CODE ";
    cmd.sqlText += " AND MS.EGG_PRODUCT_CODE = HD.EGG_PRODUCT_CODE ";
    cmd.sqlText += " AND MS.ORG_CODE = ? ";
    cmd.sqlText += " AND MS.FARM_ORG_LOC = ? ";
    cmd.sqlText += " AND MS.TRANSACTION_DATE = ? ";
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push(frmOrg);
    cmd.parameters.push(tDate);

    cmd.executeReader(function (tx, res) {
        if (res.rows.length !== 0) {
            var ds = new Array();
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_FR_MS_PRODUCTION_EGG();
                m.retrieveRdr(res.rows.item(i));
                m.TYPE_NAME = res.rows.item(i).TYPE_NAME;
                ds.push(m);
            }
            SuccessCB(ds);
        }
    }, function (err) {
        console.log(err.message);
    });
}


function readDamageType1(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();

    cmd.sqlText = "SELECT ORG_CODE , CATEGORY , EGG_PRODUCT_CODE , DAMAGE_TYPE";
    cmd.sqlText += " FROM HH_FR_MS_DAMAGE_TYPE ";
    cmd.sqlText += " WHERE ORG_CODE = ? ";
    cmd.sqlText += " AND CATEGORY = 'PRODUCTION' ";
    cmd.sqlText += " ORDER BY  DAMAGE_TYPE ";
    cmd.parameters.push($.Ctx.SubOp);

    var dt = [];
    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_FR_MS_DAMAGE_TYPE();
                m.retrieveRdr(res.rows.item(i));
                m.TYPE_NAME = res.rows.item(i).TYPE_NAME;
                dt.push(m);
            }
        }
        if(typeof SuccessCB == 'function') {
            SuccessCB(dt);
        }
        else {
        }
    }, function (err) {
        alert(err.message);
    });
}

function readDamageType2(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField='';
    if ($.Ctx.Lang=="en-US")
        nameField = "ifnull(DESC_ENG, DESC_LOC)";
    else
        nameField = "ifnull(DESC_LOC, DESC_ENG)";

    cmd.sqlText = "SELECT ORG_CODE , CATEGORY , EGG_PRODUCT_CODE , DAMAGE_TYPE, {0} AS TYPE_NAME".format([nameField]);
    cmd.sqlText += " FROM HH_FR_MS_DAMAGE_TYPE ";
    cmd.sqlText += " WHERE ORG_CODE = ? ";
    cmd.sqlText += " AND CATEGORY NOT IN ('PRODUCTION','DAMAGE') ";
    cmd.sqlText += " ORDER BY  DAMAGE_TYPE ";
    cmd.parameters.push($.Ctx.SubOp);

    var dt = [];
    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_FR_MS_DAMAGE_TYPE();
                m.retrieveRdr(res.rows.item(i));
                m.TYPE_NAME = res.rows.item(i).TYPE_NAME;
                dt.push(m);
            }
        }
        if(typeof SuccessCB == 'function') {
            SuccessCB(dt);
        }
        else {
        }
    }, function (err) {
        alert(err.message);
    });
}
function readDamageType3(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();

    cmd.sqlText = "SELECT ORG_CODE , CATEGORY , EGG_PRODUCT_CODE , DAMAGE_TYPE";
    cmd.sqlText += " FROM HH_FR_MS_DAMAGE_TYPE ";
    cmd.sqlText += " WHERE ORG_CODE = ? ";
    cmd.sqlText += " AND CATEGORY  = 'DAMAGE' ";
    cmd.sqlText += " ORDER BY  DAMAGE_TYPE ";
    cmd.parameters.push($.Ctx.SubOp);

    var dt = [];
    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_FR_MS_DAMAGE_TYPE();
                m.retrieveRdr(res.rows.item(i));
                dt.push(m);
            }
        }
        if(typeof SuccessCB == 'function') {
            SuccessCB(dt);
        }
        else {
        }
    }, function (err) {
        alert(err.message);
    });
}
function showDataDamageType(SuccessCB){
    $('#collect_eggs_detail #data-content1').empty();
    $('#collect_eggs_detail #data-content2').empty();
    $('#collect_eggs_detail #data-content3').empty();

    readDamageType1(function(results){
        $.each(results,function(i,obj){
            var s = '';
            s +='<div class="ui-grid-a" style="margin-top: 10px;" >';
            s +='<div class="ui-block-a" style="font-weight: bold;" >Egg Production</div>';
            s +='<div class="ui-block-b" >';
            s +='     <div class="cell-wrapper" prod="'+ obj.EGG_PRODUCT_CODE +'" cat="'+ obj.CATEGORY +'" >';
            s +='          <input type="number" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset"';
            s +='               id ="G1_txt" value="0"> </div>';  //s +='               id ="t1'+ i + '"> </div>';
            s +='</div>';
            s +='</div>';

            $('#collect_eggs_detail #data-content1').append(s);
        });
        readDamageType2(function(results){
            $.each(results,function(i,obj){
                var s = '';
                s +='<div class="ui-grid-a" style="margin-top: 10px;" >';
                s +='<div class="ui-block-a" style="font-weight: bold;" >{0}</div>'.format([obj.TYPE_NAME]);
                s +='<div class="ui-block-b" >';
                s +='     <div class="cell-wrapper" prod="'+ obj.EGG_PRODUCT_CODE +'" cat="'+ obj.CATEGORY +'" >';
                s +='          <input type="number" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset"';
                s +='               id="G2_txt_'+ i + '" value="0"> </div>';
                s +='</div>';
                s +='</div>';

                $('#collect_eggs_detail #data-content2').append(s);
            });

            readDamageType3(function(results){
                $.each(results,function(i,obj){
                    var s = '';
                    s +='<div class="ui-grid-a" style="margin-top: 10px;" >';
                    s +='<div class="ui-block-a" style="font-weight: bold;" >Damage</div>';
                    s +='<div class="ui-block-b" >';
                    s +='     <div class="cell-wrapper" prod="'+ obj.EGG_PRODUCT_CODE +'" cat="'+ obj.CATEGORY +'">';
                    s +='          <input type="number" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset"';
                    s +='               id ="G3_txt" readonly="readonly" value="0"> </div>';  //s +='               id ="t3'+ i + '" readonly="readonly" > </div>';
                    s +='</div>';
                    s +='</div>';

                    $('#collect_eggs_detail #data-content3').append(s);
                });
                //SuccessCB(true);
                if(typeof SuccessCB == 'function') {
                   SuccessCB(true);
                }

            });
        });
        //console.log(results);
    });
}

function RegisterTextbox(){

    $('#collect_eggs_detail input[type="number"] ').focusout(function() {
        var qtyStr=$(this).val();
        $(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val())<0){
            $(this).val(0);
        }

        var qtyEggPrd = 0;
        qtyEggPrd = Number($('#collect_eggs_detail #G1_txt').val());

        var sumTotal = 0;
        var sumG2 = 0;

        $('#collect_eggs_detail input[id^="G2"]' ).each(function( i ){
            sumG2 += Number(this.value);
        });
        sumTotal = qtyEggPrd - sumG2


        $('#collect_eggs_detail #G3_txt').val(sumTotal);

         //sum = qtyEggPrd - qtyEgg1 - qtyEgg2 - qtyEgg3 - qtyEgg4 - qtyEgg5 - qtyEgg6 - qtyEgg7;

    });
}

