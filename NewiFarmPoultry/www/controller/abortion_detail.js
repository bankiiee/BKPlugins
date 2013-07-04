$('#abortion_detail').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('abortion_detail');
    $.Ctx.RenderFooter('abortion_detail');
});

$('#abortion_detail').bind('pagebeforehide', function (e) {
    retrieveFromInput();
    $.Ctx.PersistPageParam();
});

$('#abortion_detail').bind('pageinit', function (e) {
	lkSelectTxt = $.Ctx.Lcl('abortion_detail', 'msgSelect', 'Select');
    $('#abortion_detail a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('abortion_detail', 'Previous'), null, { transition:'slide', action:'reverse' });
    });

    $('#abortion_detail #lkSowId').click(function (e) {
        var p = new LookupParam();
        p.calledPage = 'abortion_detail';
        p.calledResult = 'sowInput'
        $.Ctx.SetPageParam('lookup_swine', 'param', p);
        $.Ctx.SetPageParam('lookup_swine', 'Previous', 'abortion_detail');
        $.Ctx.SetPageParam('lookup_swine', 'sowId', "A");
        $.Ctx.NavigatePage('lookup_swine', null, { transition:'slide'},false);
    });

    $('#abortion_detail #lkAbtType').click(function (e) {
        var p = new LookupParam();
        p.calledPage = 'abortion_detail';
        p.calledResult = 'abtInput'
        $.Ctx.SetPageParam('lookup_abttype', 'param', p);
        $.Ctx.SetPageParam('lookup_abttype', 'Previous', 'abortion_detail');
        $.Ctx.NavigatePage('lookup_abttype', null, { transition:'slide' },false);
    });


    $('#abortion_detail #lkReason').click(function (e) {

        if (IsNullOrEmpty(model2.ABORT_CODE)) {
            $.Ctx.MsgBox($.Ctx.Lcl('abortion_detail', 'msgPlzSelectAbt', 'Please select ABT Type first.'));
        }
        else {
            console.log(model2);
            var p = new LookupParam();
            p.calledPage = 'abortion_detail';
            p.calledResult = 'reasonInput'
            $.Ctx.SetPageParam('lookup_reason', 'param', p);
            $.Ctx.SetPageParam('lookup_reason', 'Previous', 'abortion_detail');
            //$.Ctx.SetPageParam('lookup_reason', 'abtType', model2);
            $.Ctx.SetPageParam('lookup_reason', 'statement', "WHERE GD_TYPE = 'ABC' AND CONDITION_01 = '{0}'".format([model2.ABORT_CODE]));
            // $.Ctx.SetPageParam('lookup_reason', 'abtCode', model2.ABORT_CODE);
            $.Ctx.NavigatePage('lookup_reason', null, { transition:'slide' },false);
        }
    });

    $('#abortion_detail #btnSave').click(function (e) {
        retrieveFromInput();
        'Validate input if error show alert and return'
        var err = "";
        if (IsNullOrEmpty(model.SWINE_TRACK)) {
            var s = $.Ctx.Lcl('abortion_detail', 'MsgIsRequire', '{0} is required. ').format([$('#abortion_detail #lblSowId').text()]);
            err += s;
        }
        if (IsNullOrEmpty(model2.ABORT_CODE) && IsNullOrEmpty(model2.ABORT_CODE_NAME)) {
            var s = $.Ctx.Lcl('abortion_detail', 'MsgIsRequire', '{0} is required.').format([$('#abortion_detail #lblAbtType').text()]);
            err += s;
        }
        if (IsNullOrEmpty(model2.SUB_ABORT_CODE) && IsNullOrEmpty(model2.SUB_ABORT_CODE_NAME)) {
            var s = $.Ctx.Lcl('abortion_detail', 'MsgIsRequire', '{0} is required.').format([$('#abortion_detail #lblReason').text()]);
            err += s;
        }
        if (err.length != 0) {
            $.Ctx.MsgBox(err);
            return;
        }

        var bmodel = model;
        var bmodel2 = model2;
        var m3 = new FR_MS_SWINE_ABORT();

        model.ACTIVITY_TYPE = "A"


        if(mode == "new"){
            $.FarmCtx.SwineActivityAdd(model, function (cmds) {

                    m3.ORG_CODE	 		    = $.Ctx.SubOp;
                    m3.FARM_ORG			    = $.Ctx.Warehouse;
                    m3.SWINE_ID			    = bmodel.SWINE_ID;
                    m3.SWINE_TRACK			= bmodel.SWINE_TRACK;
                    m3.SWINE_DATE_IN		= bmodel.SWINE_DATE_IN;
                    m3.TRANSACTION_DATE	    = $.Ctx.GetBusinessDate().toDbDateStr();
                    m3.ACTIVITY_TYPE		= 'A'
                    m3.ABORT_CODE	 		= bmodel2.ABORT_CODE;
                    m3.SUB_ABORT_CODE		= bmodel2.SUB_ABORT_CODE;
                    m3.LITNO1				= null;
                    m3.LITNO2				= null;
                    m3.FARROW_GROUP		    = null;
                    m3.MATE_GROUP			= null;
                    m3.LAST_ACTIVITY_TYPE	= null;
                    m3.LAST_ACTIVITY_DATE	= null;
                    m3.LAST_LITNO1			= null;
                    m3.LAST_LITNO2			= null;
                    m3.LAST_MATE_GROUP		= null;
                    m3.CANCEL_FLAG			= null;
                    m3.CANCEL_DATE			= null;
                    m3.USER_CREATE			= $.Ctx.UserId;
                    m3.CREATE_DATE			= $.Ctx.GetLocalDateTime().toDbDateStr();
                    m3.LAST_USER_ID		    = null;
                    m3.LAST_UPDATE_DATE	    = null;
                    m3.LAST_FUNCTION		= 'A';
                    m3.NUMBER_OF_SENDING_DATA = 0;



                    var iCmd3 = m3.insertCommand($.Ctx.DbConn);
                    cmds.push(iCmd3);


                    var tran = new DbTran($.Ctx.DbConn);
                    tran.executeNonQuery(cmds,
                        function (tx, res) {
                            $.Ctx.MsgBox($.Ctx.Lcl('abortion_detail', 'MsgSaveComplete', 'Save completed.'));
                            $.Ctx.SetPageParam('abortion_detail', 'model', null);
                            $.Ctx.SetPageParam('abortion_detail', 'model2', null);
                            $.Ctx.SetPageParam('abortion_detail', 'sowInput', null);
                            $.Ctx.SetPageParam('abortion_detail', 'abtInput', null);
                            $.Ctx.SetPageParam('abortion_detail', 'reasonInput', null);
                            $('#abortion_detail #lblLastAct').html('');
                            $('#abortion_detail #lblLastDate').html('');

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

        else if(mode == "edit"){

            $.FarmCtx.SwineActivityUpdate(model, function (cmds) {
                    var uCmd1 = $.Ctx.DbConn.createSelectCommand();
                    uCmd1.sqlText = "UPDATE FR_MS_SWINE_ABORT SET TRANSACTION_DATE = '{0}' , ACTIVITY_TYPE = 'A' , ABORT_CODE = '{1}' , SUB_ABORT_CODE = '{2}' , LAST_USER_ID = '{3}' AND LAST_UPDATE_DATE = '{4}' , FUNCTION = 'C' WHERE ORG_CODE = '{5}' AND FARM_ORG = '{6}' AND SWINE_ID = '{7}' AND SWINE_TRACK = '{8}' AND SWINE_DATE_IN = '{9}'".format([$.Ctx.GetBusinessDate().toDbDateStr() ,  bmodel2.ABORT_CODE  , bmodel2.SUB_ABORT_CODE , $.Ctx.UserId , $.Ctx.GetLocalDateTime().toDbDateStr()  , $.Ctx.SubOp , $.Ctx.Warehouse , bmodel.SWINE_ID , bmodel.SWINE_TRACK , bmodel.SWINE_DATE_IN ]);
                    cmds.push(uCmd1);

                    var tran = new DbTran($.Ctx.DbConn);
                    tran.executeNonQuery(cmds,
                        function (tx, res) {
                            $.Ctx.MsgBox($.Ctx.Lcl('abortion_detail', 'MsgSaveComplete', 'Save completed.'));
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
});

$('#abortion_detail').bind('pagebeforeshow', function (e) {

    initPage();
    //end init lookup
    persistToInput();
    //register click event



});


//declare global pageinit variable
var lkSelectTxt = null;

var mode = $.Ctx.GetPageParam('abortion_detail', 'mode');

// for lookup sow id
var model = new HH_FR_MS_SWINE_ACTIVITY();
// for lookup abttype and reason
var model2 = new FR_MS_SWINE_ABORT();
//from lkSowId
var sowInput = new HH_FR_MS_SWINE_ACTIVITY();
//from lkAbtType
var abtInput = new HH_GD2_FR_MAS_TYPE_FARM();
//from lkReason
var reasonInput = new HH_GD2_FR_MAS_TYPE_FARM();




function initPage() {
    mode = $.Ctx.GetPageParam('abortion_detail', 'mode');
    //initialize;
    if (mode == 'new') {
        $('#abortion_detail #lkSowId').removeClass('ui-disabled');
        //$('#abortion_detail #lkSowId').attr('disabled', '');
    } else if (mode == 'edit') {
        $('#abortion_detail #lkSowId').addClass('ui-disabled');
        //$('#abortion_detail #lkSowId').attr('disabled', 'disabled');
    }

}

//persist model to input
function persistToInput() {
    model = $.Ctx.GetPageParam('abortion_detail', 'model');
    if (model == null) {
        model = new HH_FR_MS_SWINE_ACTIVITY();
        model.ORG_CODE = $.Ctx.SubOp;
        model.FARM_ORG = $.Ctx.Warehouse;
    }

    if (model.NUMBER_OF_SENDING_DATA != null)
        if (model.NUMBER_OF_SENDING_DATA > 0 )
            $('#abortion_detail #btnSave').hide();

    model2 = $.Ctx.GetPageParam('abortion_detail', 'model2');
    if (model2 == null) {
        model2 = new FR_MS_SWINE_ABORT();
        model2.ORG_CODE = $.Ctx.SubOp;
        model2.FARM_ORG = $.Ctx.Warehouse;
        model2.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
    }

    //init lookup;
    sowInput = $.Ctx.GetPageParam('abortion_detail', 'sowInput');
    if (sowInput != null) {
        model.SWINE_ID = sowInput.SWINE_ID;
        model.SWINE_TRACK = sowInput.SWINE_TRACK;
        model.SWINE_DATE_IN = sowInput.SWINE_DATE_IN;
        model.ACTIVITY_DATE = sowInput.ACTIVITY_DATE;
        model.PREVIOUS_ACTIVITY_TYPE = sowInput.ACTIVITY_TYPE;
        model.SOW_ACTIVITY_TYPE = sowInput.ACTIVITY_TYPE;
        model.SOW_ACTIVITY_DATE = sowInput.ACTIVITY_DATE;
    }
    abtInput = $.Ctx.GetPageParam('abortion_detail', 'abtInput');
    if (abtInput != null) {
        var desc = abtInput.DESC_ENG;
        if ($.Ctx.Lang != 'en-US'){
            desc = abtInput.DESC_LOC;
        }

        if(model2.ABORT_CODE != abtInput.GD_CODE && abtInput.GD_CODE == "1"){
            $('#abortion_detail #lkAbtType span').text(lkSelectTxt)
            model2.SUB_ABORT_CODE = null;
            model2.SUB_ABORT_CODE_NAME = null;
            reasonInput = $.Ctx.SetPageParam('abortion_detail', 'reasonInput',null);
        }

        model2.ABORT_CODE = abtInput.GD_CODE;
        model2.ABORT_CODE_NAME = desc;

      /*  if(model2.ABORT_CODE != "1" ){
            findReason();
        }else{
            conPersist();
        }*/

        //model2.CONDITION_01 = abtInput.CONDITION_01;
        //model2.BOAR_DATE_IN = abtInput.SWINE_DATE_IN;
    }


    conPersist();
}

//retrieve input to model
function retrieveFromInput() {
    var txt;
    txt = $('#abortion_detail #lkSowId span').text();
    if (txt != lkSelectTxt && sowInput != null) {
        model.SWINE_ID = sowInput.SWINE_ID;
        model.SWINE_TRACK = txt;
        model.SWINE_DATE_IN = sowInput.SWINE_DATE_IN;
        //model.ACTIVITY_DATE = sowInput.ACTIVITY_DATE;

    }
    txt = $('#abortion_detail #lkAbtType span').text();
    if (txt != lkSelectTxt && abtInput != null) {
        model2.ABORT_CODE = abtInput.GD_CODE;
        model2.ABORT_CODE_NAME = txt;
        //model2.BOAR_DATE_IN = boarInput.SWINE_DATE_IN;
    }
    txt = $('#abortion_detail #lkReason span').text();
    if (txt != lkSelectTxt && reasonInput != null) {
        model2.SUB_ABORT_CODE = reasonInput.GD_CODE;
        model2.SUB_ABORT_CODE_NAME = txt;
        //model2.BOAR_DATE_IN = reasonInput.SWINE_DATE_IN;
    }

    $.Ctx.SetPageParam('abortion_detail', 'model',model);
    $.Ctx.SetPageParam('abortion_detail', 'model2',model2);

}


function findReason(){
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT * FROM HH_GD2_FR_MAS_TYPE_FARM WHERE GD_TYPE = 'ABC' AND CONDITION_01 = '{0}'".format([model2.ABORT_CODE]);

    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            var r = new HH_GD2_FR_MAS_TYPE_FARM();
            r.retrieveRdr(res.rows.item(0));
            $.Ctx.SetPageParam('abortion_detail', 'reasonInput',r);
            conPersist();

        }
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });
}

function conPersist(){
    reasonInput = $.Ctx.GetPageParam('abortion_detail', 'reasonInput');
    if (reasonInput != null) {
        var desc = reasonInput.DESC_ENG;
        if ($.Ctx.Lang != 'en-US'){
            desc = reasonInput.DESC_LOC;
        }
        model2.SUB_ABORT_CODE = reasonInput.GD_CODE;
        model2.SUB_ABORT_CODE_NAME = desc;
        //model2.BOAR_DATE_IN = reasonInput.SWINE_DATE_IN;
    }

    if (!IsNullOrEmpty(model.SWINE_TRACK)) {
        $('#abortion_detail #lkSowId span').text(model.SWINE_TRACK);
    } else {
        $('#abortion_detail #lkSowId span').text(lkSelectTxt);
    }

    if (!IsNullOrEmpty(model.SOW_ACTIVITY_TYPE) || !IsNullOrEmpty(model.SOW_ACTIVITY_DATE)) {

        $('#abortion_detail #lblLastAct').html($.Ctx.Lcl('abortion_detail' , 'msgLastActDate' , 'Last Activity : {0}').format([model.SOW_ACTIVITY_TYPE]));
        $('#abortion_detail #lblLastDate').html( model.SOW_ACTIVITY_DATE);
    } else {
        $('#abortion_detail #lblLastActDate').text('');
    }


    if (!IsNullOrEmpty(model.SWINE_TRACK)) {
        $('#abortion_detail #lkSowId span').text(model.SWINE_TRACK);
    } else {
        $('#abortion_detail #lkSowId span').text(lkSelectTxt);
    }


    if (!IsNullOrEmpty(model2.ABORT_CODE)) {
        $('#abortion_detail #lkAbtType span').text(model2.ABORT_CODE_NAME);

    } else {
        $('#abortion_detail #lkAbtType span').text(lkSelectTxt);
    }

    if (!IsNullOrEmpty(model2.SUB_ABORT_CODE)) {
        $('#abortion_detail #lkReason span').text(model2.SUB_ABORT_CODE_NAME);
    } else {
        $('#abortion_detail #lkReason span').text(lkSelectTxt);
    }
}