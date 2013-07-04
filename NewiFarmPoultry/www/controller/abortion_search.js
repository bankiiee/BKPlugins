$('#abortion_search').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('abortion_search');
    $.Ctx.RenderFooter('abortion_search');
});

$('#abortion_search').bind('pageinit', function (e) {
    $('#abortion_search a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('abortion_search', 'Previous'), null, { transition: 'slide', reverse: 'true' });
    });

    $('#abortion_search #btnNew').click(function (e) {
        $.Ctx.SetPageParam('abortion_detail', 'mode', 'new');
        var model = new HH_FR_MS_SWINE_ACTIVITY();
        model.ORG_CODE = $.Ctx.SubOp;
        model.FARM_ORG = $.Ctx.Warehouse;
        $.Ctx.PageParam['abortion_detail'] = null;
        $.Ctx.SetPageParam('abortion_detail', 'mode', 'new');
        $.Ctx.SetPageParam('abortion_detail', 'model', model);
        $.Ctx.SetPageParam('abortion_detail', 'Previous', 'abortion_search');
        $.Ctx.NavigatePage('abortion_detail', null, { transition: 'slide' });
    });
});

$('#abortion_search').bind('pagebeforeshow', function (e) {
    var dSource = new Array();

    findData();
    function findData() {
        $('#abortion_search #lstView').empty();
        $('#abortion_search #totalSearch').html('');
        var cmd = $.Ctx.DbConn.createSelectCommand();
        var str = "";
        if ($.Ctx.Lang == "en-US") {
            str = "SELECT A.*,B.ABORT_CODE ,(SELECT DESC_ENG FROM HH_GD2_FR_MAS_TYPE_FARM WHERE GD_CODE = B.ABORT_CODE AND GD_TYPE = 'ABT') AS ABORT_CODE_NAME FROM HH_FR_MS_SWINE_ACTIVITY A , FR_MS_SWINE_ABORT B WHERE  A.ORG_CODE IS '{0}' AND A.FARM_ORG IS '{1}' AND A.ACTIVITY_TYPE = 'A' AND A.ACTIVITY_DATE IS '{2}' AND A.ORG_CODE = B.ORG_CODE AND A.FARM_ORG = B.FARM_ORG AND A.SWINE_ID = B.SWINE_ID AND A.SWINE_TRACK = B.SWINE_TRACK AND A.SWINE_DATE_IN = B.SWINE_DATE_IN AND B.TRANSACTION_DATE = '{2}' AND A.ACTIVITY_TYPE = B.ACTIVITY_TYPE ORDER BY CREATE_DATE".format(([$.Ctx.SubOp, $.Ctx.Warehouse, $.Ctx.GetBusinessDate().toDbDateStr()]));
        } else {
            str = "SELECT A.*,B.ABORT_CODE ,(SELECT DESC_LOC FROM HH_GD2_FR_MAS_TYPE_FARM WHERE GD_CODE = B.ABORT_CODE AND GD_TYPE = 'ABT') AS ABORT_CODE_NAME FROM HH_FR_MS_SWINE_ACTIVITY A , FR_MS_SWINE_ABORT B WHERE  A.ORG_CODE IS '{0}' AND A.FARM_ORG IS '{1}' AND A.ACTIVITY_TYPE = 'A' AND A.ACTIVITY_DATE IS '{2}' AND A.ORG_CODE = B.ORG_CODE AND A.FARM_ORG = B.FARM_ORG AND A.SWINE_ID = B.SWINE_ID AND A.SWINE_TRACK = B.SWINE_TRACK AND A.SWINE_DATE_IN = B.SWINE_DATE_IN AND B.TRANSACTION_DATE = '{2}' AND A.ACTIVITY_TYPE = B.ACTIVITY_TYPE ORDER BY CREATE_DATE".format(([$.Ctx.SubOp, $.Ctx.Warehouse, $.Ctx.GetBusinessDate().toDbDateStr()]));
        }

        cmd.sqlText = str;
        cmd.executeReader(function (tx, res) {
            if (res.rows.length != 0) {
                dSource = new Array();
                for (var i = 0; i < res.rows.length; i++) {
                    var m = new HH_FR_MS_SWINE_ACTIVITY();
                    m.retrieveRdr(res.rows.item(i));
                    m.ABORT_CODE_NAME = res.rows.item(i).ABORT_CODE_NAME;
                    dSource.push(m);
                }
                populateListView(dSource);
            }
        }, function (err) {
            $.Ctx.MsgBox(err.message);
        });
    }

    function populateListView(p) {
        if (p.length != 0) {
            $('#abortion_search #totalSearch').html($.Ctx.Lcl('iFarm', 'msgTotalSearch', 'Total : {0}').format([p.length]));
        }

        for (var i = 0; i < p.length; i++) {
            var m = new HH_FR_MS_SWINE_ACTIVITY();
            m = p[i];
            var code = m.SWINE_TRACK;
            var activityType = $.Ctx.Lcl('abortion_search', 'msgActivityType', 'Activity Type: {0} ').format([m.ACTIVITY_TYPE]);
            if (activityType == null || m.ACTIVITY_TYPE == undefined) {
                activityType = ''
            }

            var abtType = $.Ctx.Lcl('abortion_search', 'msgAbtCode', 'Abortion Code: {0} ').format([m.ABORT_CODE_NAME]);
            if (abtType == null || m.ABORT_CODE_NAME == undefined) {
                abtType = ''
            } else {
                if (activityType != null || m.ACTIVITY_TYPE != undefined) {
                    abtType = " , " + abtType;
                }
            }

            var x = new XDate(m.ACTIVITY_DATE);

            var s = '<li  data-swipeurl="#" data-icon="false"><a id="{0}" data-tag="lst_item" {1}  >'.format(['lki-' + i, "data-id='" + i + "'"]);

            s += '<p class="lki_code"><h3>{0}</h3></p>'.format([code]);

            s += '<p><strong class="lki_name">{0}</strong></p>'.format([activityType + abtType]);

            s += '<span class="ui-li-count">{0}</span>'.format([x.toUIShortDateStr()]);

            s += '</a></li>';

            $('#abortion_search #lstView').append(s);
        }

        $('#abortion_search #lstView').listview('refresh');

        $('#abortion_search #lstView li').swipeDelete({
            btnTheme: 'r',
            btnLabel: 'Delete',
            btnClass: 'aSwipeButton',
            click: function (e) {
                e.stopPropagation();
                e.preventDefault();

                var dataId = $(this).parents('li').find('a[data-tag="lst_item"]').attr('data-id');


                var m2 = new FR_MS_SWINE_ABORT();
                var uCmd = $.Ctx.DbConn.createSelectCommand();
                m = dSource[dataId];
                if (m.NUMBER_OF_SENDING_DATA == 0) {
                    $.FarmCtx.SwineActivityDelete(m, function (cmds) {
                        m2.ORG_CODE = $.Ctx.SubOp;
                        m2.FARM_ORG = $.Ctx.Warehouse;
                        m2.SWINE_ID = m.SWINE_ID;
                        m2.SWINE_TRACK = m.SWINE_TRACK;
                        m2.SWINE_DATE_IN = m.SWINE_DATE_IN;
                        m2.TRANSACTION_DATE = m.ACTIVITY_DATE;
                        m2.ACTIVITY_TYPE = m.ACTIVITY_TYPE;


                        var dCmd2 = m2.deleteCommand($.Ctx.DbConn);
                        cmds.push(dCmd2);


                        var tran = new DbTran($.Ctx.DbConn);
                        tran.executeNonQuery(cmds,
                            function (tx, res) {
                                var li = $("#abortion_search ul").children()[dataId];
                                //$(li).slideUp();
                                // $(li).remove();
                                // $('#abortion_search #lstView').listview('refresh');
                                findData();
                            }, function (err) {
                                $.Ctx.MsgBox("Err :" + err.message);
                            });

                    },
                    function (err) {
                        $.Ctx.MsgBox(err);
                    });
                } else {
                    $.Ctx.MsgBox($.Ctx.Lcl('abortion_search', 'msgCannotDeleteItem', "Cannot Delete this item"));
                }

            }
        });



        $('#abortion_search a[data-tag="lst_item"]').click(function (e) {
            var dataId = $(this).attr('data-id');
            var m = dSource[dataId];
            m.SOW_ACTIVITY_TYPE = m.LAST_ACTIVITY_TYPE;
            m.SOW_ACTIVITY_DATE = m.LAST_ACTIVITY_DATE;
            var cmd = $.Ctx.DbConn.createSelectCommand();
            var s;
            if ($.Ctx.Lang == "en-US") {
                s = "SELECT ORG_CODE , FARM_ORG , SWINE_ID , SWINE_TRACK , SWINE_DATE_IN , TRANSACTION_DATE ,  ACTIVITY_TYPE , ABORT_CODE ,(SELECT DESC_ENG FROM HH_GD2_FR_MAS_TYPE_FARM WHERE GD_CODE = ABORT_CODE AND GD_TYPE = 'ABT') AS ABORT_CODE_NAME , SUB_ABORT_CODE , (SELECT DESC_ENG FROM HH_GD2_FR_MAS_TYPE WHERE GD_CODE = SUB_ABORT_CODE AND GD_TYPE = 'ABC') AS SUB_ABORT_CODE_NAME FROM FR_MS_SWINE_ABORT WHERE ORG_CODE = '{0}' AND FARM_ORG = '{1}' AND SWINE_ID = '{2}' AND SWINE_TRACK = '{3}' AND SWINE_DATE_IN = '{4}' AND TRANSACTION_DATE = '{5}' AND ACTIVITY_TYPE = '{6}'".format([$.Ctx.SubOp, $.Ctx.Warehouse, m.SWINE_ID, m.SWINE_TRACK, m.SWINE_DATE_IN, m.ACTIVITY_DATE, m.ACTIVITY_TYPE]);
            } else {
                s = "SELECT ORG_CODE , FARM_ORG , SWINE_ID , SWINE_TRACK , SWINE_DATE_IN , TRANSACTION_DATE ,  ACTIVITY_TYPE , ABORT_CODE ,(SELECT DESC_LOC FROM HH_GD2_FR_MAS_TYPE_FARM WHERE GD_CODE = ABORT_CODE AND GD_TYPE = 'ABT') AS ABORT_CODE_NAME , SUB_ABORT_CODE , (SELECT DESC_LOC FROM HH_GD2_FR_MAS_TYPE WHERE GD_CODE = SUB_ABORT_CODE AND GD_TYPE = 'ABC') AS SUB_ABORT_CODE_NAME FROM FR_MS_SWINE_ABORT WHERE ORG_CODE = '{0}' AND FARM_ORG = '{1}' AND SWINE_ID = '{2}' AND SWINE_TRACK = '{3}' AND SWINE_DATE_IN = '{4}' AND TRANSACTION_DATE = '{5}' AND ACTIVITY_TYPE = '{6}'".format([$.Ctx.SubOp, $.Ctx.Warehouse, m.SWINE_ID, m.SWINE_TRACK, m.SWINE_DATE_IN, m.ACTIVITY_DATE, m.ACTIVITY_TYPE]);
            }
            cmd.sqlText = s;
            cmd.executeReader(function (tx, res) {
                if (res.rows.length != 0) {
                    var m2 = new FR_MS_SWINE_ABORT();
                    m2.retrieveRdr(res.rows.item(0));
                    m2.ABORT_CODE_NAME = res.rows.item(0).ABORT_CODE_NAME;
                    m2.SUB_ABORT_CODE_NAME = res.rows.item(0).SUB_ABORT_CODE_NAME;
                    $.Ctx.PageParam['abortion_detail'] = null;
                    $.Ctx.SetPageParam('abortion_detail', 'mode', 'edit');
                    $.Ctx.SetPageParam('abortion_detail', 'model', m);
                    $.Ctx.SetPageParam('abortion_detail', 'model2', m2);
                    $.Ctx.SetPageParam('abortion_detail', 'Previous', 'abortion_search');
                    $.Ctx.NavigatePage('abortion_detail', null, { transition: 'slide' });

                } else {
                    $.Ctx.MsgBox($.Ctx.Lcl('abortion_search', 'msgCannotFindAbortion', 'Cannot find Abortion for swine {0} {1} {2} {3} {4} '.format([m.SWINE_ID, m.SWINE_TRACK, m.SWINE_DATE_IN, m.TRANSACTION_DATE, m.ACTIVITY_TYPE])));
                }


            }, function (err) {
                $.Ctx.MsgBox(err.message);
            }
            );

        });

    }
});


