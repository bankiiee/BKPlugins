$('#setting').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('setting');
});




$('#setting').bind('pageinit', function (e) {
    $('#setting a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('setting', 'Previous'), null, { transition: 'slide', action: 'reverse' });
        // $.Ctx.NavigatePage('abortion_detail', null, { transition:'slide'  });
    });
//                   
//                   $('#setting #btnFontBig').click(function (e) {
//                                                   
//                                                   console.log("FONT CHANGE NA");
//                                                   //console.log($.mobile.metaViewportContent);
//                                                   //$.mobile.metaViewportContent = "width=device-width, minimum-scale=1.0, maximum-scale=2.0, minimum-scale=1.0, user-scalable=no";
//                                                   var meta = $("meta[name=viewport]");
//                                                   meta.attr("content","width=device-width, minimum-scale=1.0, maximum-scale=2.0, initial-scale=1.5, user-scalable=no");
//
//                                                });


    $('#setting #btnChangePass').click(function(e){
        $.Ctx.SetPageParam('change_password', 'Previous', 'setting');
        $.Ctx.NavigatePage('change_password', null, { transition: 'slide' });
    });

    $('#setting #btnDone').click(function (e) {
        var d = $('#setting #datefrom-text').val();
        $.Ctx.BusinessDate = parseUIDateStr(d).toDbDateOnlyStr();
        if ($('#SliderTimeout').val() != null )
        {
            $.Ctx.ServiceTimeout = Number($('#SliderTimeout').val()) * 1000;
        }



        var txt = $('#setting #rdtChina').attr('checked');
        if (txt=="checked"){
            $.Ctx.Lang = "zh-CN";
        }
        else{
            $.Ctx.Lang = "en-US";
        }

        var cmds = new Array();
        var dCmd1 = $.Ctx.DbConn.createSelectCommand();
        dCmd1.sqlText = "DELETE FROM HH_USER_PREFERENCE_BU WHERE BUSINESS_UNIT = '{0}' AND USER_ID = '{1}' AND PROGRAM_ID = '{2}' ".format([$.Ctx.Bu , $.Ctx.UserId , $.Ctx.ProgramId ]);
        cmds.push(dCmd1);

        var iCmd1 = $.Ctx.DbConn.createSelectCommand();
        iCmd1.sqlText = "INSERT INTO HH_USER_PREFERENCE_BU (BUSINESS_UNIT , USER_ID , PROGRAM_ID , KEY , ENG_DESC , LOCAL_DESC , DATA_TYPE , VAL , CREATE_DATE , OWNER , LAST_UPDATE_DATE , FUNCTION , NUMBER_OF_SENDING_DATA) VALUES ('{0}' , '{1}' , '{2}' , '{3}' , '{4}' , '{5}' , '{6}' , '{7}' , '{8}' , '{9}' , '{10}' , '{11}' , '{12}')".format([$.Ctx.Bu , $.Ctx.UserId , $.Ctx.ProgramId , "Lang" , $.Ctx.Lang , $.Ctx.Lang , "String" , $.Ctx.Lang , $.Ctx.GetLocalDateTime().toDbDateStr() , $.Ctx.UserId , $.Ctx.GetLocalDateTime().toDbDateStr() , "A" , 0]);
        cmds.push(iCmd1);


        var iCmd1 = $.Ctx.DbConn.createSelectCommand();
        iCmd1.sqlText = "INSERT INTO HH_USER_PREFERENCE_BU (BUSINESS_UNIT , USER_ID , PROGRAM_ID , KEY , ENG_DESC , LOCAL_DESC , DATA_TYPE , VAL , CREATE_DATE , OWNER , LAST_UPDATE_DATE , FUNCTION , NUMBER_OF_SENDING_DATA) VALUES ('{0}' , '{1}' , '{2}' , '{3}' , '{4}' , '{5}' , '{6}' , '{7}' , '{8}' , '{9}' , '{10}' , '{11}' , '{12}')".format([$.Ctx.Bu , $.Ctx.UserId , $.Ctx.ProgramId , "ServiceTimeout" , $.Ctx.Lang , $.Ctx.Lang , "Number" , $.Ctx.ServiceTimeout , $.Ctx.GetLocalDateTime().toDbDateStr() , $.Ctx.UserId , $.Ctx.GetLocalDateTime().toDbDateStr() , "A" , 0]);
        cmds.push(iCmd1);

        var tran = new DbTran($.Ctx.DbConn);
        tran.executeNonQuery(cmds,
            function (tx, res) {
                $.Ctx.MsgBox($.Ctx.Lcl('setting' , 'MsgSaveComplete' , 'Save completed.'));
                $.Ctx.NavigatePage($.Ctx.GetPageParam('setting', 'Previous'), null, { transition: 'slide', action: 'reverse' });
            }, function (err) {
                $.Ctx.MsgBox("Err :" + err.message);
            });

    });

} );

$('#setting').bind('pagebeforeshow', function (e) {
    $('#setting #lblshowSubOper').html($.Ctx.SubOp);
    $('#setting #lblshowWarehouse').html($.Ctx.Warehouse);
    $('#setting #txtVersion').html($.Ctx.ClientVersion);
    $('#setting #txtServerVersion').html($.Ctx.AppVersion);
    farmSetting_persistToInput();
    persistToInput();

    function farmSetting_persistToInput() {

        $('#setting #datefrom-text').val($.Ctx.GetBusinessDate().toUIShortDateStr());

    }

});

//persist model to input
function persistToInput() {
    if ($.Ctx.Lang == "en-US"){
        $('#setting #rdtChina').removeAttr('checked').checkboxradio("refresh");
        $('#setting #rdtEng').attr('checked', 'checked').checkboxradio("refresh");
    }else{
        $('#setting #rdtChina').attr('checked', 'checked').checkboxradio("refresh");
        $('#setting #rdtEng').removeAttr('checked').checkboxradio("refresh");
    }
    if ($.Ctx.ServiceTimeout != null){
        $('#setting #SliderTimeout').attr('value',$.Ctx.ServiceTimeout/1000);
    }else{
        $('#setting #SliderTimeout').attr('value',3);
    }
    $('#setting #SliderTimeout').slider('refresh')

    $('#setting #txtDeviceId').html($.Ctx.DeviceId);

}

//retrieve input to model
function retrieveFromInput() {

}



