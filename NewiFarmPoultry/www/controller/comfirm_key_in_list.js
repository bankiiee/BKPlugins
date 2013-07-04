

            var clickAlias = "click";


            $("#comfirm_key_in_list").bind("pageinit", function (event) {
                $.Ctx.SetPageParam('comfirm_key_in_list', 'currentListData', null); 
                var pParam = $.Ctx.GetPageParam('comfirm_key_in_list', 'param');
                try {
                    $("#comfirm_key_in_list #captionHeader").text($.Ctx.Lcl('comfirm_key_in_list', pParam['captionHeader'], 'Close Period List'));
                } catch (e) {
                    $("#comfirm_key_in_list #captionHeader").text($.Ctx.Lcl('comfirm_key_in_list', 'captionHeader', 'Close Period List'));
                }

                $('#comfirm_key_in_list #btnNew').bind(clickAlias, function () {
                    ClearParamPage();
                    $.Ctx.NavigatePage("comfirm_key_in_trans",
			{ Previous: 'comfirm_key_in_list', Mode: 'Create', Data: null },
			{ transition: 'slide' });
                });

                $('#comfirm_key_in_list #btnManual').bind(clickAlias, function () {
                    ClearParamPage();
                    $.Ctx.NavigatePage("comfirm_key_in_trans",
			{ Previous: 'comfirm_key_in_list', Mode: 'Create', Data: null },
			{ transition: 'slide' });
                });

                $('#comfirm_key_in_list #btnBack').bind('click', function () {
                    $.Ctx.NavigatePage($.Ctx.GetPageParam('comfirm_key_in_list', 'Previous'),
			null,
		 { transition: 'slide', reverse: true });
                });
            });

            $('#comfirm_key_in_list').bind("pagebeforecreate", function (e) {
                $.Util.RenderUiLang('comfirm_key_in_list');
                $.Ctx.RenderFooter('comfirm_key_in_list');
            });

            $("#comfirm_key_in_list").bind("pagebeforeshow", function (event) {
                loadExistData();

            });

            function loadExistData() {
                $.Ctx.SetPageParam('comfirm_key_in_list', 'currentListData', null);
                $('#comfirm_key_in_list #comfirm_key_in_list-content').empty();
                var nameField = "ifnull(FO.NAME_LOC, FO.NAME_ENG)";
                if ($.Ctx.Lang == "en-US") {
                    nameField = "ifnull(FO.NAME_ENG, FO.NAME_LOC)";
                }
                var sqlStr = "SELECT FO.FARM_ORG||'('||{0}  ||')' AS NAME, C.PERIOD , ".format([nameField]);
                sqlStr += "  C.FARM_ORG , C.ORG_CODE, C.PERIOD,C.PROJECT_CODE, C.CLOSE_TYPE , C.OPERATION_CLOSE_FLAG ";
                sqlStr += " FROM HH_FR_MAS_CLOSE_PERIOD C, FR_FARM_ORG FO ";
                sqlStr += " WHERE C.OPERATION_CLOSE_FLAG = 'Y' ";
                sqlStr += " AND C.ORG_CODE = FO.ORG_CODE AND C.FARM_ORG = FO.FARM_ORG AND C.NUMBER_OF_SENDING_DATA = 0 ";

                var cmdClosePeriod = $.Ctx.DbConn.createSelectCommand();
                cmdClosePeriod.sqlText = sqlStr;
                cmdClosePeriod.executeReader(function (tx, res) {
                    if (res.rows.length != 0) {
                        $.Ctx.SetPageParam('comfirm_key_in_list', 'currentListData', res.rows);
                        var html = '';
                        html += '<ul data-role="listview" data-inset="true" id="lv-KeyList" data-filter="false"> ';
                        for (var idx = 0; idx < res.rows.length; idx++) {
                            html += '<li id="liPeriod-{0}" data-pk="{1}|{2}|{3}|{4}|{5}"> '.format([idx, res.rows.item(idx).FARM_ORG, res.rows.item(idx).ORG_CODE, res.rows.item(idx).PERIOD, res.rows.item(idx).PROJECT_CODE, res.rows.item(idx).CLOSE_TYPE]);
                            html += '<a data-rowID = "{0}"><p> '.format([idx]);
                            html += '<div class="ui-grid-a" style="font-weight:normal"> ';
                            html += '<div class="ui-block-a"> ';
                            html += '<div style="float:left"> ';
                            html += '<span id="lblFarm-{0}" data-lang="lblFarm">{1}:</span> '.format([idx, $.Ctx.Lcl('confirm_key_in_list', 'lblFarm', 'Farm')]);
                            html += '</div> ';
                            html += '<output  style="float:left">{0}</output> '.format([res.rows.item(idx).NAME]);
                            html += '</div> ';
                            html += '<div class="ui-block-b"> ';
                            html += '<div style="float:left"> ';
                            html += '<span id="lblPeriod-{0}" data-lang="lblPeriod">{1}:</span> '.format([idx, $.Ctx.Lcl('confirm_key_in_list', 'lblPeriod', 'Period')]);
                            html += '</div> ';
                            html += '<output style="float:left">{0}</output> '.format([res.rows.item(idx).PERIOD]);
                            html += '</div> ';
                            html += '</div> ';
                            html += '</p></a> ';
                            html += '</li> ';
                        }
                        html += '</ul> ';
                        $('#comfirm_key_in_list #comfirm_key_in_list-content').html(html);
                        $('#comfirm_key_in_list #comfirm_key_in_list-content').trigger('create');

                        $("#comfirm_key_in_list #lv-KeyList li a").bind('click', function () {
                            //console.log($(this).attr('data-rowID')); 
                            var currentData = $.Ctx.GetPageParam('comfirm_key_in_list', 'currentListData');
                            var rowID = Number($(this).attr('data-rowID'));

                            var curFarmOrg = { 'CODE': currentData.item(rowID).FARM_ORG, 'NAME': currentData.item(rowID).NAME,
                                'PERIOD': currentData.item(rowID).PERIOD, 'OPERATION_CLOSE_FLAG': currentData.item(rowID).OPERATION_CLOSE_FLAG
                            };

                            $.Ctx.NavigatePage("comfirm_key_in_trans",
			{ Previous: 'comfirm_key_in_list', Mode: 'Edit', selectedFarmOrg: curFarmOrg },
			{ transition: 'slide' ,param :'noppol.von' }); // navPage

                           
                        }); // click

                        $("#comfirm_key_in_list #lv-KeyList li").swipeDelete({
                            btnTheme: 'r',
                            btnLabel: 'Delete',
                            btnClass: 'aSwipeButton',
                            click: function (e) {
                                e.stopPropagation();
                                e.preventDefault();
                                var dataPK = $(this).attr('data-pk').split('|');

                                var cmd = $.Ctx.DbConn.createSelectCommand();
                                cmd.sqlText = "select * from HH_FR_MAS_CLOSE_PERIOD ";
                                cmd.sqlText += "WHERE ";
                                cmd.sqlText += "FARM_ORG = ? AND ORG_CODE = ? AND PERIOD = ? AND PROJECT_CODE = ? AND CLOSE_TYPE = ? ";
                                cmd.parameters.push(dataPK[0]);
                                cmd.parameters.push(dataPK[1]);
                                cmd.parameters.push(dataPK[2]);
                                cmd.parameters.push(dataPK[3]);
                                cmd.parameters.push(dataPK[4]);

                                cmd.executeReader(function (tx, res) {
                                    if (res.rows.length != 0) {
                                        var masClosePeriod = new HH_FR_MAS_CLOSE_PERIOD();
                                        masClosePeriod.retrieveRdr(res.rows.item(0));
                                        var delCmd = masClosePeriod.deleteCommand($.Ctx.DbConn);
                                        delCmd.executeNonQuery(function () {
                                            loadExistData();
                                        }, function (err) {
                                            $.Ctx.MsgBox($.Ctx.Lcl('comfirm_key_in_list', 'DEL_NOT_COMPLETE', 'Delete incomplete'));
                                        })
                                    }
                                    else {
                                        console.log('Not Found Data to Delete');
                                    }
                                }, function (err) {
                                    console.log('Select data to delete error : ' + err);
                                });

                            }
                        }); //swipe delete


                    } // row != 0
                }, function (err) {
                    console.log('Error Exe Reader : ' + err);
                });
            }
           
            function ClearParamPage() {
                $.Ctx.SetPageParam('comfirm_key_in_trans', 'selectedFarmOrg', null);
                
            }



        