$('#change_password').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('change_password');
});

$('#change_password').bind('pageinit', function (e) {
    $('#change_password a[data-back="true"]').click(function (e) {
        //$.Ctx.NavigatePage($.Ctx.GetPageParam('setting', 'Previous'), null, { transition: 'slide', action: 'reverse' });
         $.Ctx.NavigatePage('setting', null, { transition:'slide'  });
    });


    $('#change_password #btnDone').click(function (e) {

        if($('#change_password #txtOldPass').val()!= "" && $('#change_password #txtNewPass').val() != "" && $('#change_password #txtConfirmPass').val() != ""){
            var jdata = {};
            jdata.bu = $.Ctx.Bu;
            jdata.userName = $.Ctx.UserId;
            jdata.password = $.sha256($('#change_password #txtOldPass').val());
            var jsonText = JSON.stringify(jdata);
            $.mobile.loading('show', { text: "loading data...", textVisible: true });
            $('#change_password div[data-role="content"]').addClass("ui-disabled");
            $.ajax({
                type:"Post",
                url:$.Ctx.SvcUrl + "/Authenticate",
                data:jsonText,
                //timeout: $.Ctx.ServiceTimeout,
                contentType:"application/json; charset=utf-8",
                success:function (data) {
                    $.mobile.loading('hide');
                    $('#change_password div[data-role="content"]').removeClass("ui-disabled");
                    var u = data.d;
                    if (u != undefined && u != null) {

                        if($('#change_password #txtNewPass').val() == $('#change_password #txtConfirmPass').val()){

                            var jdata1 = {};
                            jdata1.bu = $.Ctx.Bu;
                            jdata1.userName = $.Ctx.UserId;
                            jdata1.newPassword = $('#change_password #txtNewPass').val();
                            var jsonText1 = JSON.stringify(jdata1);
                            $.ajax({
                                type:"Post",
                                url:$.Ctx.SvcUrl + "/ChangePassword",
                                data:jsonText1,
                                //timeout: $.Ctx.ServiceTimeout,
                                contentType:"application/json; charset=utf-8",
                                success:function (data) {
                                    var uCmd1 = $.Ctx.DbConn.createSelectCommand();
                                    uCmd1.sqlText = "UPDATE HH_USER_BU SET USER_PASSWORD = '{0}' , LAST_UPDATE_DATE = 'NOW' , FUNCTION = 'C'  WHERE BUSINESS_UNIT = '{1}' AND UPPER(USER_ID) = UPPER('{2}')".format([$.sha256($('#change_password #txtNewPass').val()), $.Ctx.Bu, $.Ctx.UserId.toUpperCase() ]);
                                    //var tran = new DbTran($.Ctx.DbConn);
                                    uCmd1.executeNonQuery(
                                        function (tx, res) {
                                            $.Ctx.MsgBox($.Ctx.Lcl('change_password', 'msgChangeComplete', 'Change Password completed.'));
                                            $.mobile.loading('hide');
                                            $('#change_password div[data-role="content"]').removeClass("ui-disabled");
                                            $.Ctx.NavigatePage($.Ctx.GetPageParam('change_password', 'Previous'), null, { transition: 'slide', action: 'reverse' });
                                        }, function (err) {
                                            $.Ctx.MsgBox("Err Change Password Local:" + err.message);
                                            $.mobile.loading('hide');
                                            $('#change_password div[data-role="content"]').removeClass("ui-disabled");
                                        });
                                },
                                error:function (data) {

                                    $.mobile.loading('hide');
                                    $('#change_password div[data-role="content"]').removeClass("ui-disabled");
                                    $.Ctx.MsgBox($.Ctx.Lcl('change_password', 'msgCantChangePass', 'Cannot change Password'));
                                    $('#change_password #txtOldPass').val('');
                                    $('#change_password #txtNewPass').val('');
                                    $('#change_password #txtConfirmPass').val('');

                                }
                            });

                        }else{
                            $.mobile.loading('hide');
                            $('#change_password div[data-role="content"]').removeClass("ui-disabled");
                            $.Ctx.MsgBox($.Ctx.Lcl('change_password', 'msgPassNotMatch', 'Password and Confirm password do not match.'));
                            $('#change_password #txtOldPass').val('');
                            $('#change_password #txtNewPass').val('');
                            $('#change_password #txtConfirmPass').val('');
                        }
                    } else {
                        $.mobile.loading('hide');
                        $('#change_password div[data-role="content"]').removeClass("ui-disabled");
                        $.Ctx.MsgBox($.Ctx.Lcl('change_password', 'msgPassIncorrect', 'Password incorrect'));
                        $('#change_password #txtOldPass').val('');
                        $('#change_password #txtNewPass').val('');
                        $('#change_password #txtConfirmPass').val('');
                    }

                },
                error:function (data) {
                    $.mobile.loading('hide');
                    $('#change_password div[data-role="content"]').removeClass("ui-disabled");
                    $.Ctx.MsgBox($.Ctx.Lcl('change_password' , 'msgServiceFailed' , 'Service Failed'));

                }
            });
        }else{
            var err = "";
            if(IsNullOrEmpty($('#change_password #txtOldPass').val())){
                var s = $.Ctx.Lcl('change_password', 'MsgIsRequire', '{0} is required. ').format([$('#change_password #lblOldPass').text()]);
                err += s;
            }

            if(IsNullOrEmpty($('#change_password #txtNewPass').val())){
                var s = $.Ctx.Lcl('change_password', 'MsgIsRequire', '{0} is required. ').format([$('#change_password #lblNewPass').text()]);
                err += s;
            }

            if(IsNullOrEmpty($('#change_password #txtConfirmPass').val())){
                var s = $.Ctx.Lcl('change_password', 'MsgIsRequire', '{0} is required. ').format([$('#change_password #lblConfirmPass').text()]);
                err += s;
            }

            if (err.length != 0) {
                $.Ctx.MsgBox(err);
                return;
            }
        }
    });

} );
