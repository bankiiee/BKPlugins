$('#dead_detail').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('dead_detail');
    $.Ctx.RenderFooter('dead_detail');
});

$('#dead_detail').bind('pagebeforehide', function (e) {
    retrieveFromInput();
    $.Ctx.PersistPageParam();
});
$('#dead_detail').bind('pageinit', function (e) {
	lkSelectTxt = $.Ctx.Lcl('dead_detail', 'msgSelect', 'Select');

    $('#dead_detail a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('dead_detail', 'Previous'), null, { transition: 'slide', action: 'reverse' }, false);
    });

    $('#dead_detail #lkSwineId').click(function (e) {
        var p = new LookupParam();
        p.calledPage = 'dead_detail';
        p.calledResult = 'SwineInput'
        $.Ctx.SetPageParam('lookup_swine', 'param', p);
        $.Ctx.SetPageParam('lookup_swine', 'sowId', "D");
        $.Ctx.SetPageParam('lookup_swine', 'Previous', 'dead_detail');
        $.Ctx.NavigatePage('lookup_swine', null, { transition: 'slide', action: 'reverse' }, false);
    });

    $('#dead_detail #lkReasonId').click(function (e) {

        if (IsNullOrEmpty(model.SWINE_TRACK)) {
            $.Ctx.MsgBox($.Ctx.Lcl('dead_detail', 'msgPlzSelectSwine', 'Please select Swine ID first.'));
        }
        else {
            var p = new LookupParam();
            p.calledPage = 'dead_detail';
            p.calledResult = 'ReasonInput'
            $.Ctx.SetPageParam('lookup_reason', 'param', p);
            $.Ctx.SetPageParam('lookup_reason', 'Previous', 'dead_detail');
            $.Ctx.SetPageParam('lookup_reason', 'statement', ' WHERE GD_TYPE = "RSC" AND  CONDITION_06 like "%' + model.SEX + '%"');
            $.Ctx.SetPageParam('lookup_reason', 'SwineId', model);
            $.Ctx.NavigatePage('lookup_reason', null, { transition: 'slide', action: 'reverse' }, false);
        }
    });

    $('#dead_detail #btnSave').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        retrieveFromInput();
        'Validate input if error show alert and return'
        var err = "";
        if (IsNullOrEmpty(model.SWINE_TRACK)) {
            var s = $.Ctx.Lcl('dead_detail', 'MsgIsRequire', '{0} is required.').format([$('#dead_detail #lblSwineId').text()]);
            err += s;
        }
        if (IsNullOrEmpty(model2.REASON)) {
            var s = $.Ctx.Lcl('dead_detail', 'MsgIsRequire', '{0} is required.').format([$('#dead_detail #lblReasonId').text()]);
            err += s;
        }
        if (err.length != 0) {
            $.Ctx.MsgBox(err);
            return;
        }
        var bmodel = model;
        var bmodel2 = model2;
        var m3 = new HH_FR_MS_SWINE_DEAD();

        if (mode == "new") {

            $.FarmCtx.SwineActivityAdd(model, function (cmds) {
                    m3.ORG_CODE = $.Ctx.SubOp;
                    m3.FARM_ORG = $.Ctx.Warehouse;
                    m3.SWINE_ID = bmodel.SWINE_ID;
                    m3.SWINE_TRACK = bmodel.SWINE_TRACK;
                    m3.SWINE_DATE_IN = bmodel.SWINE_DATE_IN;
                    m3.REASON = bmodel2.REASON ;
                    m3.ACTIVITY_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
                    m3.OWNER = $.Ctx.UserId;
                    m3.CREATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
                    m3.FUNCTION = "A"
                    m3.LAST_UPDATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
                    m3.NUMBER_OF_SENDING_DATA = 0;


                    var iCmd3 = m3.insertCommand($.Ctx.DbConn);
                    cmds.push(iCmd3);

                    if (modelImage1.IMAGE != null && typeof (modelImage1.IMAGE) != 'undefined') {
                        modelImage1.SWINE_ID = bmodel.SWINE_ID;
                        modelImage1.SWINE_DATE_IN = bmodel.SWINE_DATE_IN;
                        modelImage1.SWINE_TRACK = bmodel.SWINE_TRACK;
                        modelImage1.ACTIVITY_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
                        modelImage1.ACTIVITY_TYPE = bmodel.ACTIVITY_TYPE;
                        var iCmdImage = modelImage1.insertCommand($.Ctx.DbConn);
                        cmds.push(iCmdImage);  
                    }
                    if (modelImage2.IMAGE != null && typeof (modelImage2.IMAGE) != 'undefined') {
                        modelImage2.SWINE_ID = bmodel.SWINE_ID;
                        modelImage2.SWINE_DATE_IN = bmodel.SWINE_DATE_IN;
                        modelImage2.SWINE_TRACK = bmodel.SWINE_TRACK;
                        modelImage2.ACTIVITY_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
                        modelImage2.ACTIVITY_TYPE = bmodel.ACTIVITY_TYPE;
                        var iCmdImage = modelImage2.insertCommand($.Ctx.DbConn);
                        cmds.push(iCmdImage);
                    }


                    var tran = new DbTran($.Ctx.DbConn);
                    tran.executeNonQuery(cmds,
                        function (tx, res) {
                            $.Ctx.MsgBox($.Ctx.Lcl('dead_detail', 'MsgSaveComplete', 'Save completed.'));
                            $.Ctx.SetPageParam('dead_detail', 'mode', 'new');
                            $.Ctx.SetPageParam('dead_detail', 'model', null);
                            $.Ctx.SetPageParam('dead_detail', 'model2', null);
                            $.Ctx.SetPageParam('dead_detail', 'SwineInput', null);
                            $.Ctx.SetPageParam('dead_detail', 'ReasonInput', null);
                            $.Ctx.SetPageParam('dead_detail', 'modelImage1', null);
                            $.Ctx.SetPageParam('dead_detail', 'modelImage2', null);
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
                    uCmd1.sqlText = "UPDATE HH_FR_MS_SWINE_DEAD SET ORG_CODE = '{0}' ,FARM_ORG  = '{1}' ,SWINE_ID  = '{2}' ,SWINE_TRACK  = '{3}' ,SWINE_DATE_IN  = '{4}' ,ACTIVITY_DATE  = '{5}' ,REASON  = '{6}' ,OWNER = '{7}' ,CREATE_DATE  = '{8}' ,LAST_UPDATE_DATE = '{9}' ,FUNCTION  = 'C'  WHERE ORG_CODE   = '{0}' AND FARM_ORG = '{1}' AND SWINE_ID = '{2}' AND SWINE_TRACK  = '{3}' AND SWINE_DATE_IN  = '{4}' AND ACTIVITY_DATE  = '{5}' ".format([bmodel2.ORG_CODE, bmodel2.FARM_ORG, bmodel2.SWINE_ID, bmodel2.SWINE_TRACK, bmodel2.SWINE_DATE_IN, $.Ctx.GetBusinessDate().toDbDateStr(), bmodel2.REASON, $.Ctx.UserId, bmodel2.CREATE_DATE, $.Ctx.GetLocalDateTime().toDbDateStr()]);
                    cmds.push(uCmd1);

                    if (modelImage1.IMAGE != null ) {
                        modelImage1.SWINE_ID = bmodel.SWINE_ID;
                        modelImage1.SWINE_DATE_IN = bmodel.SWINE_DATE_IN;
                        modelImage1.SWINE_TRACK = bmodel.SWINE_TRACK;
                        modelImage1.ACTIVITY_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
                        modelImage1.ACTIVITY_TYPE = bmodel.ACTIVITY_TYPE;
                        var iCmdImage1 
                        if (modelImage1.isNewImage == true ) iCmdImage1 = modelImage1.insertCommand($.Ctx.DbConn);
                        else iCmdImage1 = modelImage1.updateCommand($.Ctx.DbConn);
                        cmds.push(iCmdImage1);
                    }
                    if (modelImage2.IMAGE != null ) {
                        modelImage2.SWINE_ID = bmodel.SWINE_ID;
                        modelImage2.SWINE_DATE_IN = bmodel.SWINE_DATE_IN;
                        modelImage2.SWINE_TRACK = bmodel.SWINE_TRACK;
                        modelImage2.ACTIVITY_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
                        modelImage2.ACTIVITY_TYPE = bmodel.ACTIVITY_TYPE;
                        var iCmdImage2 ; 
                        if (modelImage2.isNewImage  == true ) iCmdImage2= modelImage2.insertCommand($.Ctx.DbConn);
                        else  iCmdImage2= modelImage2.updateCommand($.Ctx.DbConn);
                        cmds.push(iCmdImage2);
                    }

                    var tran = new DbTran($.Ctx.DbConn);
                    tran.executeNonQuery(cmds,
                        function (tx, res) {
                            $.Ctx.MsgBox($.Ctx.Lcl('dead_detail', 'MsgSaveComplete', "Save completed."));

                            if (modelImage1.IMAGE != null ) {
                                modelImage1.isNewImage = false;
                            }
                            if (modelImage2.IMAGE != null ) {
                                modelImage2.isNewImage = false;
                            }
                            
                        }, function (err) {
                            $.Ctx.MsgBox("Err :" + err.message);
                        });
                },
                function (err) {
                    $.Ctx.MsgBox(err);
                });


        }

    });
});

    $('#dead_detail').bind('pagebeforeshow', function (e) {
    initPage();
    //end init lookup
    persistToInput();
    //register click event
    //end register click event

});


//declare global pageinit variable
var lkSelectTxt = null;

var mode = $.Ctx.GetPageParam('dead_detail', 'mode');

var model = new HH_FR_MS_SWINE_ACTIVITY();
var model2 = new HH_FR_MS_SWINE_DEAD();
//from lkSwineId
var SwineInput = new HH_FR_MS_SWINE_ACTIVITY();

//from lkReasonId
var ReasonInput = new HH_GD2_FR_MAS_TYPE_FARM();

var modelImage1 = new HH_FR_MS_SWINE_ACTIVITY_IMAGE();
var modelImage2 = new HH_FR_MS_SWINE_ACTIVITY_IMAGE(); 



function initPage() { 
    mode = $.Ctx.GetPageParam('dead_detail', 'mode');

    model = $.Ctx.GetPageParam('dead_detail', 'model');
    if (model == null) {
        model = new HH_FR_MS_SWINE_ACTIVITY();
        model.ORG_CODE = $.Ctx.SubOp;
        model.FARM_ORG = $.Ctx.Warehouse;
        model.NUMBER_OF_SENDING_DATA = 0;
    }

    model2 = $.Ctx.GetPageParam('dead_detail', 'model2');
    if (model2 == null) {
        model2 = new HH_FR_MS_SWINE_DEAD();
        model2.ORG_CODE = $.Ctx.SubOp;
        model2.FARM_ORG = $.Ctx.Warehouse;
        model2.ACTIVITY_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
        model2.NUMBER_OF_SENDING_DATA = 0;
    }
    if (model.NUMBER_OF_SENDING_DATA != null)
        if (model.NUMBER_OF_SENDING_DATA > 0 )
            $('#dead_detail #btnSave').hide();


    modelImage1 = $.Ctx.GetPageParam('dead_detail', 'modelImage1');
    if (modelImage1 == null) { 
        modelImage1 = new HH_FR_MS_SWINE_ACTIVITY_IMAGE();
        modelImage1.isNewImage =true;
        modelImage1.ORG_CODE = model.ORG_CODE;
        modelImage1.FARM_ORG = model.FARM_ORG;
        modelImage1.SWINE_ID = model.SWINE_ID;
        modelImage1.SWINE_DATE_IN = model.SWINE_DATE_IN;
        modelImage1.ACTIVITY_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
        modelImage1.ACTIVITY_TYPE = model.ACTIVITY_TYPE;
        modelImage1.EXTEND_NUMBER = 1;
        modelImage1.SWINE_TRACK = model.SWINE_TRACK;
        modelImage1.NUMBER_OF_SENDING_DATA = 0;
    }
    modelImage2 = $.Ctx.GetPageParam('dead_detail', 'modelImage2');
    if (modelImage2 == null) {
        modelImage2 = new HH_FR_MS_SWINE_ACTIVITY_IMAGE();
        modelImage2.isNewImage =true;
        modelImage2.ORG_CODE = model.ORG_CODE
        modelImage2.FARM_ORG = model.FARM_ORG
        modelImage2.SWINE_ID = model.SWINE_ID
        modelImage2.SWINE_DATE_IN = model.SWINE_DATE_IN
        modelImage2.ACTIVITY_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
        modelImage2.ACTIVITY_TYPE = model.ACTIVITY_TYPE
        modelImage2.EXTEND_NUMBER = 2
        modelImage2.SWINE_TRACK = model.SWINE_TRACK
        modelImage2.NUMBER_OF_SENDING_DATA = 0;
    }
    
    //initialize;
    if (mode == 'new') {
        $('#dead_detail #lkSwineId').removeClass('ui-disabled');
        //$('#dead_detail #lkSwineId').attr('disabled', '');
    } else if (mode == 'edit') {
        $('#dead_detail #lkSwineId').addClass('ui-disabled');
        //$('#dead_detail #lkSwineId').attr('disabled', 'disabled');
    }
    //init lookup;
    SwineInput = $.Ctx.GetPageParam('dead_detail', 'SwineInput');
    if (SwineInput != null) {
        model.SWINE_ID = SwineInput.SWINE_ID;
        model.SWINE_TRACK = SwineInput.SWINE_TRACK;
        model.SWINE_DATE_IN = SwineInput.SWINE_DATE_IN;
        model.ACTIVITY_DATE = SwineInput.ACTIVITY_DATE;
        model.PREVIOUS_ACTIVITY_TYPE = SwineInput.ACTIVITY_TYPE;
        model.SEX = SwineInput.SEX;
    }
    ReasonInput = $.Ctx.GetPageParam('dead_detail', 'ReasonInput');
    if (ReasonInput != null) {
        model2.REASON = ReasonInput.GD_CODE;
        var desc = ReasonInput.DESC_ENG;
        if ($.Ctx.Lang != 'en-US') {
            desc = ReasonInput.DESC_LOC;
        }
        model2.DESCRIPTION = desc
    }
    model.ACTIVITY_TYPE = 'D';
 

}
var temp;
//persist model to input
function persistToInput() {
    if (!IsNullOrEmpty(model.SWINE_TRACK)) {
        $('#dead_detail #lkSwineId span').text(model.SWINE_TRACK);
    } else {
        $('#dead_detail #lkSwineId span').text(lkSelectTxt);
    }

    if (!IsNullOrEmpty(model2.DESCRIPTION)) {
        $('#dead_detail #lkReasonId span').text(model2.DESCRIPTION);
    } else {
        $('#dead_detail #lkReasonId span').text(lkSelectTxt);
    }
    if (!IsNullOrEmpty(modelImage1.IMAGE)) {
        $("#dead_detail #picture1").attr('src', 'data:image/jpeg;base64,' + modelImage1.IMAGE);
    } else {
        $("#dead_detail #picture1").attr('src', '');
        var parent=document.getElementById('divPic1');
        var child=document.getElementById('picture1');
        parent.removeChild(child);  
        parent.appendChild(child);
    }

    if (!IsNullOrEmpty(modelImage2.IMAGE)) {
        $("#dead_detail #picture2").attr('src', 'data:image/jpeg;base64,' + modelImage2.IMAGE);
    } else {
        $("#dead_detail #picture2").attr('src', '');
        var parent=document.getElementById('divPic2');
        var child=document.getElementById('picture2');
        parent.removeChild(child);  
        parent.appendChild(child);
    }
}

//retrieve input to model
function retrieveFromInput() {
    var txt;
    txt = $('#dead_detail #lkSwineId span').text();
    if (txt != lkSelectTxt && SwineInput != null) {
        model.SWINE_ID = SwineInput.SWINE_ID;
        model.SWINE_TRACK = txt;
        model.SWINE_DATE_IN = SwineInput.SWINE_DATE_IN;
    }
    txt = $('#dead_detail #lkReasonId span').text();
    if (txt != lkSelectTxt && ReasonInput != null) {
        model2.REASON = ReasonInput.GD_CODE;
        var desc = ReasonInput.DESC_ENG;
        if ($.Ctx.Lang != 'en-US') {
            desc = ReasonInput.DESC_LOC;
        }
        model2.DESCRIPTION = desc
    }

    $.Ctx.SetPageParam('dead_detail', 'modelImage1', modelImage1);
    $.Ctx.SetPageParam('dead_detail', 'modelImage2', modelImage2);
}



var onDeviceReady = function () {
    if ($.Ctx.IsDevice ){
        navigator.camera =  Camera(); // camera
    } else {
        console.log("Warning!!! No camera device Found");
    }
}

var PicLayout;
function takePicture(layoutPic) {
    if ($.Ctx.IsDevice ){
        PicLayout = layoutPic;
        var cameraOption = { quality:$.Ctx.ImageQuality,
                             destinationType: navigator.camera.DestinationType.DATA_URL,
                             sourceType: navigator.camera.PictureSourceType.CAMERA
                           };
        navigator.camera.getPicture(cameraSuccess, cameraError, cameraOption);
    }
}


function cameraSuccess(image_data) {
    if (PicLayout == '#picture1') {
        modelImage1.IMAGE = image_data;
        $("#dead_detail #picture1").attr('src', 'data:image/jpeg;base64,' + image_data);
    }
    else if (PicLayout == '#picture2') {
        modelImage2.IMAGE = image_data;
        $("#dead_detail #picture2").attr('src', 'data:image/jpeg;base64,' + image_data);
    }
    //1st method use jquery
    //2nd method
    /* var image = document.getElementById('my-photo');
     img.src = 'data:image/jpeg;base64,' + image_data;
     */
}

function cameraError(errorMessage) {
    console.log("Error Message" +errorMessage);
}