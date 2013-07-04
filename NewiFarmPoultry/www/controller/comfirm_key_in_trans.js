
            var clickAlias = "click";


            $("#comfirm_key_in_trans").bind("pageinit", function (event) {
                var pParam = $.Ctx.GetPageParam('comfirm_key_in_list', 'param');
                try {
                    $("#comfirm_key_in_trans #captionHeader").text($.Ctx.Lcl('comfirm_key_in_trans', pParam['captionHeader'], 'Confirm Close Period'));
                } catch (e) {
                    $("#comfirm_key_in_trans #captionHeader").text($.Ctx.Lcl('comfirm_key_in_trans', 'captionHeader', 'Confirm Close Period'));
                }
                var mode = $.Ctx.GetPageParam('comfirm_key_in_trans', 'Mode');
                if (mode == 'Edit') {
                    $("#comfirm_key_in_trans #captionHeader").text($.Ctx.Lcl('comfirm_key_in_trans', 'revertClosePeriod', 'Revert Close Period'));
                }

                $('#comfirm_key_in_trans #btnSave').bind(clickAlias, function () {
                    var Mode = $.Ctx.GetPageParam('comfirm_key_in_trans', 'Mode');
                    var farmOrg = $.Ctx.GetPageParam('comfirm_key_in_trans', 'selectedFarmOrg');
                    if (farmOrg == null || farmOrg == undefined) {
                        $.Ctx.MsgBox($.Ctx.Lcl('comfirm_key_in_trans', 'pleaseSelectFarmOrg', 'Please select Farm Org.'));
                        return false;
                    }

                    if (Mode == 'Create') {

                        var cmdSelect = $.Ctx.DbConn.createSelectCommand();
                        cmdSelect.sqlText = "select * from HH_FR_MAS_CLOSE_PERIOD ";
                        cmdSelect.sqlText += " where ";
                        cmdSelect.sqlText += " ORG_CODE = ? "; // Global.SUB_OPERATION
                        cmdSelect.sqlText += " AND FARM_ORG = ? "; //  Farmer";
                        cmdSelect.sqlText += " AND OPERATION_CLOSE_FLAG = 'A' ";

                        cmdSelect.parameters.push($.Ctx.SubOp);
                        cmdSelect.parameters.push(farmOrg.CODE);

                        cmdSelect.executeReader(function (tx, res) {
                            if (res.rows.length != 0) {
                                var cmdArr = new Array();

                                var masClosePeriod = new HH_FR_MAS_CLOSE_PERIOD();
                                masClosePeriod.retrieveRdr(res.rows.item(0));

                                masClosePeriod.OPERATION_CLOSE_FLAG = 'Y';
                                masClosePeriod.LAST_UPDATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
                                masClosePeriod.LAST_USER_ID = $.Ctx.UserId;
                                masClosePeriod.NUMBER_OF_SENDING_DATA = 0;
                                masClosePeriod.FUNCTION = 'U';
                                cmdArr.push(masClosePeriod.updateCommand($.Ctx.DbConn));

                                var newClosePeriod = new HH_FR_MAS_CLOSE_PERIOD();
                                newClosePeriod.FARM_ORG = farmOrg.CODE;
                                newClosePeriod.ORG_CODE = $.Ctx.SubOp;
                                newClosePeriod.PROJECT_CODE = masClosePeriod.PROJECT_CODE;
                                newClosePeriod.CLOSE_TYPE = masClosePeriod.CLOSE_TYPE;
                                newClosePeriod.PERIOD = new XDate(farmOrg.PERIOD).addMonths(1).toDbDateStr();
                                newClosePeriod.OPERATION_CLOSE_FLAG = 'A';
                                newClosePeriod.CREATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
                                newClosePeriod.USER_CREATE = $.Ctx.UserId;
                                newClosePeriod.LAST_UPDATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
                                newClosePeriod.LAST_USER_ID = $.Ctx.UserId;
                                newClosePeriod.NUMBER_OF_SENDING_DATA = 0;
                                newClosePeriod.FUNCTION = 'A';

                                cmdArr.push(newClosePeriod.insertCommand($.Ctx.DbConn));

                                var tran = new DbTran($.Ctx.DbConn);
                                tran.executeNonQuery(cmdArr,
                        function (tx, res) {
                            $.Ctx.NavigatePage($.Ctx.GetPageParam('comfirm_key_in_trans', 'Previous'),
			                null,
			                { transition: 'slide', reverse: true }); // end Navigate
                            return false;

                        }, function (err) {
                            console.log(err);
                        }); // end tran
                            } // if row != 0

                        }, function (err) {

                            console.log('Error from select to update : ' + err);
                        });

                    }
                    else if (Mode == 'Edit') {
                        //EDIT

                        var cmdSelect = $.Ctx.DbConn.createSelectCommand();
                        cmdSelect.sqlText = 'select * from HH_FR_MAS_CLOSE_PERIOD ';
                        cmdSelect.sqlText += ' where ';
                        cmdSelect.sqlText += ' ORG_CODE = ? '; // Global.SUB_OPERATION
                        cmdSelect.sqlText += ' AND PERIOD = ? ';
                        cmdSelect.sqlText += ' AND OPERATION_CLOSE_FLAG = ? ';

                        cmdSelect.parameters.push($.Ctx.SubOp);
                        cmdSelect.parameters.push(new XDate(farmOrg.PERIOD).addMonths(1).toDbDateStr());
                        cmdSelect.parameters.push('A');

                        cmdSelect.executeReader(function (tx, res) {
                            if (res.rows.length != 0) {
                                var deleteClosePeriod = new HH_FR_MAS_CLOSE_PERIOD();
                                deleteClosePeriod.retrieveRdr(res.rows.item(0));
                                var cmdArr = new Array();
                                cmdArr.push(deleteClosePeriod.deleteCommand($.Ctx.DbConn));

                                //select to update 

                                var cmdSelecttoUpdate = $.Ctx.DbConn.createSelectCommand();
                                cmdSelecttoUpdate.sqlText = 'select * from HH_FR_MAS_CLOSE_PERIOD ';
                                cmdSelecttoUpdate.sqlText += ' where ';
                                cmdSelecttoUpdate.sqlText += ' ORG_CODE = ? '; // Global.SUB_OPERATION
                                cmdSelecttoUpdate.sqlText += ' AND FARM_ORG = ? ';
                                cmdSelecttoUpdate.sqlText += ' AND PERIOD = ?';

                                cmdSelecttoUpdate.parameters.push($.Ctx.SubOp);
                                cmdSelecttoUpdate.parameters.push(farmOrg.CODE);
                                cmdSelecttoUpdate.parameters.push(farmOrg.PERIOD);
                                cmdSelecttoUpdate.executeReader(function (tx, res) {
                                    if (res.rows.length != 0) {
                                        var updateClosePeriod = new HH_FR_MAS_CLOSE_PERIOD();
                                        updateClosePeriod.retrieveRdr(res.rows.item(0));
                                        updateClosePeriod.OPERATION_CLOSE_FLAG = 'A';
                                        updateClosePeriod.LAST_UPDATE_DATE = $.Ctx.GetLocalDateTime().toDbDateStr();
                                        updateClosePeriod.LAST_USER_ID = $.Ctx.UserId;
                                        updateClosePeriod.NUMBER_OF_SENDING_DATA = 0;
                                        updateClosePeriod.FUNCTION = 'U';
                                        cmdArr.push(updateClosePeriod.updateCommand($.Ctx.DbConn));

                                        var tran = new DbTran($.Ctx.DbConn);
                                        tran.executeNonQuery(cmdArr,
                        function (tx, res) {
                            $.Ctx.NavigatePage($.Ctx.GetPageParam('comfirm_key_in_trans', 'Previous'),
			                null,
			                { transition: 'slide', reverse: true }); // end Navigate
                            return false;

                        }, function (err) {
                            console.log(err);
                        }); // end tran
                                    }
                                    else {
                                        console.log('data to update not found');
                                    }
                                }, function (err) {
                                    console.log('select to update error : ' + err);
                                });
                            } //end if 
                            else {
                                console.log('select data to delete not found');
                            }
                        }, function (err) {
                            console.log('exe reader to delete err : ' + err);
                        }); // End Exe Reader
                    }
                    return false;
                });


            });



            $('#comfirm_key_in_trans #lpFarmOrg').bind(clickAlias, function () {
                $.Ctx.SetPageParam('comfirm_key_in_trans', 'ScrollingTo', $(window).scrollTop());
                var pParam = $.Ctx.GetPageParam('comfirm_key_in_list', 'param');

                var nameField = "ifnull(FO.NAME_LOC, FO.NAME_ENG)";
                if ($.Ctx.Lang == "en-US") {
                    nameField = "ifnull(FO.NAME_ENG, FO.NAME_LOC)";
                }

                var cmd = $.Ctx.DbConn.createSelectCommand();
                cmd.sqlText = " SELECT FO.FARM_ORG||'('|| {0} ||')' AS NAME ,FO.FARM_ORG as CODE, C.PERIOD , C.OPERATION_CLOSE_FLAG ".format([nameField]);
                cmd.sqlText += " FROM HH_FR_MAS_CLOSE_PERIOD C, FR_FARM_ORG FO, ";
                cmd.sqlText += " (SELECT distinct date ( transaction_date ,'start of month') as PERIOD, FARM_ORG_LOC ";
                cmd.sqlText += " FROM HH_FR_MS_GROWER_STOCK ";
                cmd.sqlText += " WHERE ORG_CODE  = ?) B ";
                cmd.sqlText += " WHERE C.OPERATION_CLOSE_FLAG = 'A' ";
                cmd.sqlText += " AND C.ORG_CODE = FO.ORG_CODE AND C.FARM_ORG = FO.FARM_ORG AND C.ORG_CODE  = ? ";
                cmd.sqlText += " AND C.PERIOD = B.PERIOD AND C.FARM_ORG = B.FARM_ORG_LOC ";

                cmd.parameters.push($.Ctx.SubOp);
                cmd.parameters.push($.Ctx.SubOp);

                cmd.executeReader(function (tx, res) {
                    if (res.rows.length != 0) {
                        var data = new Array();
                        for (var i = 0; i < res.rows.length; i++) {
                            data.push({ 'CODE': res.rows.item(i).CODE, 'NAME': res.rows.item(i).NAME, 'PERIOD': res.rows.item(i).PERIOD, 'OPERATION_CLOSE_FLAG': res.rows.item(i).OPERATION_CLOSE_FLAG });
                        }
                        var p = new LookupParam();
                        p.title = $.Ctx.Lcl('comfirm_key_in_trans', 'FARM_ORG', 'Farm Org.')
                        p.calledPage = 'comfirm_key_in_trans';
                        p.calledResult = 'selectedFarmOrg';
                        p.codeField = 'CODE';
                        p.nameField = 'NAME';
                        p.showCode = true;
                        p.dataSource = data;

                        $.Ctx.SetPageParam('lookup', 'param', p);
                        $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
                    }
                    else {
                        $.Ctx.MsgBox($.Ctx.Lcl('comfirm_key_in_trans', 'msgFarmOrgNoFod', 'Farm org not found.'));
                    }

                }, function (err) {
                    console.log('Error from select org Lookup : ' + err);
                });



            });



            $('#comfirm_key_in_trans #btnBack').bind('click', function () {

                $.Ctx.NavigatePage($.Ctx.GetPageParam('comfirm_key_in_trans', 'Previous'),
			null,
			{ transition: 'slide', reverse: true });

                return false;
            });




            //            $("#comfirm_key_in_trans").bind("pagebeforehide", function (event, ui) {
            //               
            //            });

            $('#comfirm_key_in_trans').bind("pagebeforecreate", function (e) {
                $.Util.RenderUiLang('comfirm_key_in_trans');
                $.Ctx.RenderFooter('comfirm_key_in_trans');
            });



            $("#comfirm_key_in_trans").bind("pageshow", function (event) {
                setLookupToControl();

                if ($.Ctx.GetPageParam('comfirm_key_in_trans', 'ScrollingTo') != null) {
                    //scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
                    $('html, body').animate({
                        scrollTop: $.Ctx.GetPageParam('comfirm_key_in_trans', 'ScrollingTo')
                    }, 0);
                }
            });

            function ClearAfterSave() {

            }

            function setLookupToControl() {
                var farmOrg = $.Ctx.GetPageParam('comfirm_key_in_trans', 'selectedFarmOrg');
                var htmlRdb = '';
                htmlRdb += ' <label for="rdbConfirmStatus" class="ui-hidden-accessible"></label> ';
                htmlRdb += ' <select name="rdbConfirmStatus" id="rdbConfirmStatus" data-role="slider" disabled="disabled" data-mini = "true">';

                htmlRdb += ' <option value="Y" selected>{0}</option> '.format([$.Ctx.Lcl('comfirm_key_in_trans', 'CLOSED', 'Closed')]);
                htmlRdb += ' <option value="A">{0}</option> '.format([$.Ctx.Lcl('comfirm_key_in_trans', 'ACTIVE', 'Active')]);
                htmlRdb += ' </select> ';

                if (farmOrg !== null) {
                    $('#comfirm_key_in_trans #lpFarmOrg').text(farmOrg.NAME);
                    $('#comfirm_key_in_trans #txtPeriod').val(farmOrg.PERIOD);
                    htmlRdb = '';
                    htmlRdb += ' <label for="rdbConfirmStatus" class="ui-hidden-accessible"></label> ';
                    htmlRdb += ' <select name="rdbConfirmStatus" id="rdbConfirmStatus" data-role="slider" disabled="disabled" data-mini = "true">';

                    if (farmOrg.OPERATION_CLOSE_FLAG == 'A')  //ON
                    {
                        htmlRdb += ' <option value="Y">{0}</option> '.format([$.Ctx.Lcl('comfirm_key_in_trans', 'CLOSED', 'Closed')]);
                        htmlRdb += ' <option value="A" selected>{0}</option> '.format([$.Ctx.Lcl('comfirm_key_in_trans', 'ACTIVE', 'Active')]);
                    }
                    else {
                        htmlRdb += ' <option value="Y" selected>{0}</option> '.format([$.Ctx.Lcl('comfirm_key_in_trans', 'CLOSED', 'Closed')]);
                        htmlRdb += ' <option value="A">{0}</option> '.format([$.Ctx.Lcl('comfirm_key_in_trans', 'ACTIVE', 'Active')]);
                    }
                    htmlRdb += ' </select> ';
                }
                else {
                    $('#comfirm_key_in_trans #lpFarmOrg').text($.Ctx.Lcl('comfirm_key_in_trans', 'msgSelect', 'Select'));
                }

                $('#divRdbConfirmClose').html(htmlRdb);
                $('#divRdbConfirmClose').trigger('create');
                $('#comfirm_key_in_trans #lpFarmOrg').button('refresh');

                if ($.Ctx.GetPageParam('comfirm_key_in_trans', 'Mode') == 'Edit') 
                    $('#comfirm_key_in_trans #lpFarmOrg').button('disable');
                else
                    $('#comfirm_key_in_trans #lpFarmOrg').button('enable');
                
            }
        