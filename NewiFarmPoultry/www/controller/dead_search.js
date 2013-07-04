$('#dead_search').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('dead_search');
    $.Ctx.RenderFooter('dead_search');
});

$('#dead_search').bind('pageshow', function (e) {
    var dSource = new Array();
    $('#dead_search a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('dead_search', 'Previous'), null, { transition:'slide' });
    });

    $('#dead_search #btnNew').click(function (e) {
        var model = new HH_FR_MS_SWINE_ACTIVITY();
        model.ORG_CODE = $.Ctx.SubOp;
        model.FARM_ORG = $.Ctx.Warehouse;
        $.Ctx.PageParam['dead_detail'] = null;
        $.Ctx.SetPageParam('dead_detail', 'mode', 'new');
        $.Ctx.SetPageParam('dead_detail', 'model', model);
        $.Ctx.SetPageParam('dead_detail', 'Previous', 'dead_search');
        $.Ctx.NavigatePage('dead_detail', null, { transition:'slide' });
    });

    findData();
    function findData(){
        $('#dead_search #lstView').empty();
        $('#dead_search #totalSearch').html('');
        var cmd = $.Ctx.DbConn.createSelectCommand();
        cmd.sqlText = "SELECT ACT.*, GD.DESC_ENG, GD.DESC_LOC FROM HH_FR_MS_SWINE_ACTIVITY ACT LEFT OUTER JOIN HH_FR_MS_SWINE_DEAD DEAD ON     ACT.ORG_CODE = DEAD.ORG_CODE AND ACT.FARM_ORG = DEAD.FARM_ORG AND ACT.SWINE_ID = DEAD.SWINE_ID AND ACT.SWINE_TRACK = DEAD.SWINE_TRACK AND ACT.SWINE_DATE_IN = DEAD.SWINE_DATE_IN AND ACT.ACTIVITY_DATE = DEAD.ACTIVITY_DATE LEFT OUTER JOIN HH_GD2_FR_MAS_TYPE_FARM GD ON GD.GD_TYPE = 'RSC' AND DEAD.REASON = GD.GD_CODE WHERE ACT.ORG_CODE IS ? AND ACT.FARM_ORG IS ? AND  ACT.ACTIVITY_TYPE IS 'D' AND ACT.ACTIVITY_DATE IS ? ORDER BY ACT.CREATE_DATE"
        cmd.parameters.push($.Ctx.SubOp);
        cmd.parameters.push($.Ctx.Warehouse);
        cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
        cmd.executeReader(function (tx, res) {
            if (res.rows.length != 0) {
                dSource = new Array();
                for (var i = 0; i < res.rows.length; i++) {
                    var m = new HH_FR_MS_SWINE_ACTIVITY();
                    m.retrieveRdr(res.rows.item(i));
                    if (res.rows.item(i).DESC_LOC != null)
                        m.DESC_LOC = res.rows.item(i).DESC_LOC;

                    if (res.rows.item(i).DESC_ENG != null)
                        m.DESC_ENG = res.rows.item(i).DESC_ENG;

                    console.log(m);
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
            $('#dead_search #totalSearch').html($.Ctx.Lcl('iFarm', 'msgTotalSearch', 'Total : {0}').format([p.length]));
        }
        for (var i = 0; i < p.length; i++) {
            var m = new HH_FR_MS_SWINE_ACTIVITY();
            m = p[i];

            var desc = m.DESC_ENG==null?m.DESC_LOC:m.DESC_ENG;
            if ($.Ctx.Lang != 'en-US') {
                desc = m.DESC_LOC==null?m.DESC_ENG:m.DESC_LOC;
            }


            var code = m.SWINE_TRACK;
//            var name = $.Ctx.Lcl('dead_search', 'MSG01', 'LastStatus:{0}').format([m.LAST_ACTIVITY_TYPE]);
//            if (name == null || name == undefined) {
//                name = ''
//            }

            var s = '<li  data-swipeurl="#" data-icon="false"><a id="{0}" data-tag="lst_item" {1}  >'.format(['lki-' + i, "data-id='" + i + "'"]);

            s += '<p class="lki_code"><h3>{0}</h3></p>'.format([code]);
            s += '<p><strong class="lki_name">{0}</strong></p>'.format([desc]);

            s += '<span class="ui-li-count">{0}</span>'.format([parseDbDateStr(m.ACTIVITY_DATE).toUIShortDateStr()]);


//            s += '<p><strong class="lki_name">{0}</strong></p>'.format([name]);

            s += '</a></li>';

            $('#dead_search #lstView').append(s);
        }

        $('#dead_search #lstView').listview('refresh');

        $('#dead_search #lstView li').swipeDelete({
            btnTheme:'r',
            btnLabel:'Delete',
            btnClass:'aSwipeButton',
            click:function (e) {
                e.stopPropagation();
                e.preventDefault();

                var dataId = $(this).parents('li').find('a[data-tag="lst_item"]').attr('data-id');


                var m2 = new HH_FR_MS_SWINE_DEAD();
                var img1 = new HH_FR_MS_SWINE_ACTIVITY_IMAGE();
                var img2 = new HH_FR_MS_SWINE_ACTIVITY_IMAGE();
                var uCmd = $.Ctx.DbConn.createSelectCommand();
                m = dSource[dataId];
                if (m.NUMBER_OF_SENDING_DATA ==0){
                    $.FarmCtx.SwineActivityDelete(m, function (cmds) {
                            m2.ORG_CODE	= $.Ctx.SubOp;
                            m2.FARM_ORG	= $.Ctx.Warehouse;
                            m2.SWINE_ID	= m.SWINE_ID
                            m2.SWINE_TRACK = m.SWINE_TRACK
                            m2.SWINE_DATE_IN = m.SWINE_DATE_IN
                            m2.ACTIVITY_DATE = $.Ctx.GetBusinessDate().toDbDateStr();

                            img1.ORG_CODE = $.Ctx.SubOp;
                            img1.FARM_ORG = $.Ctx.Warehouse;
                            img1.SWINE_ID = m.SWINE_ID
                            img1.SWINE_TRACK = m.SWINE_TRACK
                            img1.SWINE_DATE_IN = m.SWINE_DATE_IN
                            img1.ACTIVITY_DATE = m.ACTIVITY_DATE
                            img1.ACTIVITY_TYPE = m.ACTIVITY_TYPE
                            img1.EXTEND_NUMBER = 1

                            img2.ORG_CODE = $.Ctx.SubOp;
                            img2.FARM_ORG = $.Ctx.Warehouse;
                            img2.SWINE_ID = m.SWINE_ID
                            img2.SWINE_TRACK = m.SWINE_TRACK
                            img2.SWINE_DATE_IN = m.SWINE_DATE_IN
                            img2.ACTIVITY_DATE = m.ACTIVITY_DATE
                            img2.ACTIVITY_TYPE = m.ACTIVITY_TYPE
                            img2.EXTEND_NUMBER = 2


                            var dCmd2 = m2.deleteCommand($.Ctx.DbConn);
                            cmds.push(dCmd2);
                            var dCmd3 = img1.deleteCommand($.Ctx.DbConn);
                            cmds.push(dCmd3);
                            var dCmd4 = img2.deleteCommand($.Ctx.DbConn);
                            cmds.push(dCmd4);

                            var tran = new DbTran($.Ctx.DbConn);
                            tran.executeNonQuery(cmds,
                                function (tx, res) {
                                    var li = $("#dead_search ul").children()[dataId];
                                    //$(li).slideUp();
                                    //$(li).remove();
                                    //$('#dead_search #lstView').listview('refresh');
                                    findData();
                                }, function (err) {
                                    $.Ctx.MsgBox("Err :" + err.message);
                                });
                        },
                        function (err) {
                            $.Ctx.MsgBox(err);
                        });

                }else{
                    $.Ctx.MsgBox($.Ctx.Lcl('dead_search', 'msgCannotDeleteItem', 'Cannot delete this item'));
                }
            }
        });



        $('#dead_search a[data-tag="lst_item"]').click(function (e) {
            var dataId = $(this).attr('data-id');
            var m = dSource[dataId];
            var cmd = $.Ctx.DbConn.createSelectCommand();
            cmd.sqlText = "SELECT A.*,B.DESC_ENG, B.DESC_LOC FROM HH_FR_MS_SWINE_DEAD A LEFT OUTER JOIN HH_GD2_FR_MAS_TYPE_FARM B ON A.REASON = B.GD_CODE AND B.GD_TYPE = 'RSC' AND  B.CONDITION_06 like '%{6}%'  WHERE ORG_CODE = '{0}' AND FARM_ORG = '{1}' AND SWINE_ID = '{2}' AND SWINE_TRACK = '{3}' AND SWINE_DATE_IN = '{4}' AND ACTIVITY_DATE = '{5}'".format([$.Ctx.SubOp, $.Ctx.Warehouse, m.SWINE_ID, m.SWINE_TRACK, m.SWINE_DATE_IN, m.ACTIVITY_DATE, m.SEX ]);

            cmd.executeReader(function(tx,res){
                    if(res.rows.length !=0){
                        var m2 = new HH_FR_MS_SWINE_DEAD();
                        var img1 = new HH_FR_MS_SWINE_ACTIVITY_IMAGE();
                        img1.ORG_CODE = m.ORG_CODE
                        img1.FARM_ORG = m.FARM_ORG
                        img1.EXTEND_NUMBER = 1
                        img1.SWINE_TRACK = m.SWINE_TRACK
                        img1.isNewImage = true;
                        


                        var img2 = new HH_FR_MS_SWINE_ACTIVITY_IMAGE();
                        img2.ORG_CODE = m.ORG_CODE
                        img2.FARM_ORG = m.FARM_ORG
                        img2.EXTEND_NUMBER = 2
                        img2.SWINE_TRACK = m.SWINE_TRACK
                        img2.isNewImage = true;

                        m2.retrieveRdr(res.rows.item(0));
                        var desc = res.rows.item(0).DESC_ENG;
                        if ($.Ctx.Lang != 'en-US') {
                            desc = res.rows.item(0).DESC_LOC;
                        }
                        m2.DESCRIPTION = desc
                        $.Ctx.PageParam['dead_detail'] = null;

                        var cmd2 = $.Ctx.DbConn.createSelectCommand();
                        cmd2.sqlText = "SELECT * FROM HH_FR_MS_SWINE_ACTIVITY_IMAGE  WHERE ORG_CODE = '{0}' AND FARM_ORG = '{1}' AND SWINE_ID = '{2}'  AND SWINE_DATE_IN = '{3}' AND ACTIVITY_DATE = '{4}' AND ACTIVITY_TYPE = '{5}' AND EXTEND_NUMBER =1 ".format([$.Ctx.SubOp, $.Ctx.Warehouse, m.SWINE_ID, m.SWINE_DATE_IN, m.ACTIVITY_DATE, m.ACTIVITY_TYPE ]);
                        cmd2.executeReader(function(tx,res){
                                if(res.rows.length !=0){
                                    img1.retrieveRdr(res.rows.item(0));
                                    img1.isNewImage = false; 
                                }

                                var cmd3 = $.Ctx.DbConn.createSelectCommand();
                                cmd3.sqlText = "SELECT * FROM HH_FR_MS_SWINE_ACTIVITY_IMAGE  WHERE ORG_CODE = '{0}' AND FARM_ORG = '{1}' AND SWINE_ID = '{2}'   AND SWINE_DATE_IN = '{3}' AND ACTIVITY_DATE = '{4}' AND ACTIVITY_TYPE = '{5}' AND EXTEND_NUMBER =2 ".format([$.Ctx.SubOp, $.Ctx.Warehouse, m.SWINE_ID, m.SWINE_DATE_IN, m.ACTIVITY_DATE, m.ACTIVITY_TYPE ]);
                                cmd3.executeReader(function(tx,res){
                                        if(res.rows.length !=0){
                                            img2.retrieveRdr(res.rows.item(0));
                                            img2.isNewImage = false;
                                        }


                                        $.Ctx.SetPageParam('dead_detail', 'mode', 'edit');
                                        $.Ctx.SetPageParam('dead_detail', 'model', m);
                                        $.Ctx.SetPageParam('dead_detail', 'model2', m2);
                                        $.Ctx.SetPageParam('dead_detail', 'modelImage1', img1);
                                        $.Ctx.SetPageParam('dead_detail', 'modelImage2', img2);
                                        $.Ctx.SetPageParam('dead_detail', 'Previous', 'dead_search');
                                        $.Ctx.NavigatePage('dead_detail', null, { transition:'slide' });
                                    },function(err){
                                        $.Ctx.MsgBox(err.message);
                                    }
                                );
                            },function(err){
                                $.Ctx.MsgBox(err.message);
                            }
                        );

                    }else{
                        $.Ctx.MsgBox($.Ctx.Lcl('dead_search', 'msgCannotFindDead', 'Cannot find Dead for swine {0} {1} {2} {3} '.format([m.SWINE_ID , m.SWINE_TRACK, m.SWINE_DATE_IN, m.ACTIVITY_DATE])));

                    }


                },function(err){
                    $.Ctx.MsgBox(err.message);
                }
            );

        });

    }
});


