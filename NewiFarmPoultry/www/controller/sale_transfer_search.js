$('#sale_transfer_search').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('sale_transfer_search');
    $.Ctx.RenderFooter('sale_transfer_search');
});

$('#sale_transfer_search').bind('pageinit', function (e) {
    $('#sale_transfer_search a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('sale_transfer_search', 'Previous'), null, { transition:'slide', reverse:'true' });
    });

    $('#sale_transfer_search #btnNew').click(function (e) {
        $.Ctx.SetPageParam('sale_transfer_detail', 'mode', 'new');
        var model = new HH_FR_MS_SWINE_ACTIVITY();
        model.ORG_CODE = $.Ctx.SubOp;
        model.FARM_ORG = $.Ctx.Warehouse;
        $.Ctx.PageParam['sale_transfer_detail'] = null;
        $.Ctx.SetPageParam('sale_transfer_detail', 'mode', 'new');
        $.Ctx.SetPageParam('sale_transfer_detail', 'model', model);
        $.Ctx.SetPageParam('sale_transfer_detail', 'Previous', 'sale_transfer_search');
        $.Ctx.NavigatePage('sale_transfer_detail', null, { transition:'slide'  });
    });
});

$('#sale_transfer_search').bind('pagebeforeshow', function (e) {
    var dSource = new Array();

    findData();
    function findData(){
        $('#sale_transfer_search #totalSearch').html("");
        $('#sale_transfer_search #lstView').empty();

        var cmd = $.Ctx.DbConn.createSelectCommand();
        cmd.sqlText = "SELECT * FROM HH_FR_MS_SWINE_ACTIVITY WHERE  ORG_CODE IS ? AND FARM_ORG IS ? AND  ACTIVITY_TYPE IS 'S' AND ACTIVITY_DATE IS ? ORDER BY CREATE_DATE"
        cmd.parameters.push($.Ctx.SubOp);
        cmd.parameters.push($.Ctx.Warehouse);
        cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
        cmd.executeReader(function (tx, res) {
            if (res.rows.length != 0) {
                dSource = new Array();
                for (var i = 0; i < res.rows.length; i++) {
                    var m = new HH_FR_MS_SWINE_ACTIVITY();
                    m.retrieveRdr(res.rows.item(i));
                    dSource.push(m);
                }

                var cmdSum = $.Ctx.DbConn.createSelectCommand();
                cmdSum.sqlText = " SELECT SUM (WEIGHT) AS SUM_WEIGHT, SUM (AMOUNT) AS SUM_AMOUNT FROM HH_FR_MS_SWINE_SALE WHERE     ORG_CODE = ? AND FARM_ORG = ? AND ACTIVITY_DATE = ? "
                cmdSum.parameters.push($.Ctx.SubOp);
                cmdSum.parameters.push($.Ctx.Warehouse);
                cmdSum.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
                cmdSum.executeReader(function (tx, res) {
                    $('#sale_transfer_search #totalSearch').html("");
                    if (res.rows.length != 0) {
                        var totalSumAmount = $.Ctx.Lcl('sale_transfer_search', 'lblAmount', 'Amount:{0}').format([accounting.formatNumber(Number(res.rows.item(0).SUM_AMOUNT),0,",")]);

                        var totalSumWGH = $.Ctx.Lcl('sale_transfer_search', 'lblWeight', 'Weight:{0}').format([accounting.formatNumber(Number(res.rows.item(0).SUM_WEIGHT),2,",")]);
                        var totalNa = totalSumAmount + "  " + totalSumWGH;
                        $('#sale_transfer_search #totalSearch').html($.Ctx.Lcl('iFarm', 'msgTotalPetong', 'Total : {0}').format([totalNa]));
                    }

                });
                populateListView(dSource);
            }
        }, function (err) {
            $.Ctx.MsgBox(err.message);
        });
    }

    function populateListView(p) {
        for (var i = 0; i < p.length; i++) {
            var m = new HH_FR_MS_SWINE_ACTIVITY();
            m = p[i];
            var code ="Farm-" + m.FARM_ORG;
            var name = $.Ctx.Lcl('sale_transfer_search', 'msgSwineId', 'Swine ID:{0}').format([m.SWINE_TRACK]);
            if (name == null || name == undefined) {
                name = ''
            }

            var s = '<li  data-swipeurl="#" data-icon="false"><a id="{0}" data-tag="lst_item" {1}  >'.format(['lki-' + i, "data-id='" + i + "'"]);

            s += '<p class="lki_code"><h3>{0}</h3></p>'.format([code]);

            s += '<p><strong class="lki_name">{0}</strong></p>'.format([name]);
            if (m.ACTIVITY_DATE != undefined){
                s += '<span class="ui-li-count">{0}</span>'.format([parseDbDateStr(m.ACTIVITY_DATE).toUIShortDateStr()]);
            }

            s += '</a></li>';

            $('#sale_transfer_search #lstView').append(s);
        }

        $('#sale_transfer_search #lstView').listview('refresh');

        $('#sale_transfer_search #lstView li').swipeDelete({
            btnTheme:'r',
            btnLabel:'Delete',
            btnClass:'aSwipeButton',
            click:function (e) {
                e.stopPropagation();
                e.preventDefault();

                var dataId = $(this).parents('li').find('a[data-tag="lst_item"]').attr('data-id');


                var m2 = new HH_FR_MS_SWINE_SALE();
                var uCmd = $.Ctx.DbConn.createSelectCommand();
                m = dSource[dataId];
                if (m.NUMBER_OF_SENDING_DATA ==0){
                    m.ACTIVITY_TYPE = 'S';
                    $.FarmCtx.SwineActivityDelete(m, function (cmds) {
                            m2.ORG_CODE	= $.Ctx.SubOp;
                            m2.FARM_ORG	= $.Ctx.Warehouse;
                            m2.SWINE_ID	= m.SWINE_ID
                            m2.SWINE_TRACK = m.SWINE_TRACK
                            m2.SWINE_DATE_IN = m.SWINE_DATE_IN
                            m2.ACTIVITY_DATE = $.Ctx.GetBusinessDate().toDbDateStr();

                            var dCmd2 = m2.deleteCommand($.Ctx.DbConn);
                            cmds.push(dCmd2);

                            var tran = new DbTran($.Ctx.DbConn);
                            tran.executeNonQuery(cmds,
                                function (tx, res) {
                                    var li = $("#sale_transfer_search ul").children()[dataId];
                                    //$(li).slideUp();
                                    //$(li).remove();
                                    //$('#sale_transfer_search #lstView').listview('refresh');

                                    findData();
                                }, function (err) {
                                    $.Ctx.MsgBox("Err :" + err.message);
                                });
                        },
                        function (err) {
                            $.Ctx.MsgBox(err);
                        });
                }else{
                    $.Ctx.MsgBox($.Ctx.Lcl('sale_transfer_search', 'msgCannotDeleteItem', "Cannot Delete this item"));
                }
            }
        });



        $('#sale_transfer_search a[data-tag="lst_item"]').click(function (e) {
            var dataId = $(this).attr('data-id');
            var m = dSource[dataId];
            var cmd = $.Ctx.DbConn.createSelectCommand();
            cmd.sqlText = " SELECT A.*, B.DESC_LOC, B.DESC_ENG, D.DESC_LOC AS REASON_DESC_LOC, D.DESC_ENG AS REASON_DESC_ENG, C.CUSTOMER_NAME FROM HH_FR_MS_SWINE_SALE A LEFT OUTER JOIN HH_FR_PRODUCT_SWINE B ON A.PRODUCT_CODE = B.PRODUCT_CODE AND B.SEX = '{6}' LEFT OUTER JOIN HH_FR_CUSTOMER_PIG C ON     A.CUSTOMER_CODE = C.CUSTOMER_CODE AND C.SUB_OPERATION = '{0}' AND C.BUSINESS_UNIT = '{7}' AND C.WAREHOUSE_CODE = '{1}' LEFT OUTER JOIN HH_GD2_FR_MAS_TYPE_FARM D ON     A.REASON_CODE = D.GD_CODE AND D.GD_TYPE = 'RSC' AND D.CONDITION_06 LIKE '%M%F%' WHERE     A.ORG_CODE = '{0}' AND A.FARM_ORG = '{1}' AND A.SWINE_ID = '{2}' AND A.SWINE_TRACK = '{3}' AND A.SWINE_DATE_IN = '{4}' AND A.ACTIVITY_DATE = '{5}' ".format([$.Ctx.SubOp, $.Ctx.Warehouse, m.SWINE_ID, m.SWINE_TRACK, m.SWINE_DATE_IN, m.ACTIVITY_DATE, m.SEX, $.Ctx.Bu ]);
            console.log(cmd.sqlText);
            cmd.executeReader(function(tx,res){
                    if(res.rows.length !=0){
                        var m2 = new HH_FR_MS_SWINE_SALE();
                        m2.retrieveRdr(res.rows.item(0));
                        var desc = res.rows.item(0).DESC_ENG;
                        var ReasonDesc = res.rows.item(0).REASON_DESC_ENG;
                        if ($.Ctx.Lang != 'en-US'){
                            desc = res.rows.item(0).DESC_LOC;
                            ReasonDesc = res.rows.item(0).REASON_DESC_LOC;
                        }
                        m2.CUSTOMER_NAME = res.rows.item(0).CUSTOMER_NAME;
                        m2.DESCRIPTION = desc;
                        m2.REASON_DESCRIPTION = ReasonDesc;
                        console.log(m2.REASON_DESCRIPTION)    ;
                        $.Ctx.PageParam['sale_transfer_detail'] = null;
                        $.Ctx.SetPageParam('sale_transfer_detail', 'mode', 'edit');
                        $.Ctx.SetPageParam('sale_transfer_detail', 'model', m);
                        $.Ctx.SetPageParam('sale_transfer_detail', 'model2', m2);
                        $.Ctx.SetPageParam('sale_transfer_detail', 'Previous', 'sale_transfer_search');
                        $.Ctx.NavigatePage('sale_transfer_detail', null, { transition:'slide' });

                    }else{
                        $.Ctx.MsgBox($.Ctx.Lcl('sale_transfer_search', 'msgCannotFindSale', 'Cannot find Sale for swine {0} {1} {2} {3} '.format([m.SWINE_ID , m.SWINE_TRACK, m.SWINE_DATE_IN, m.ACTIVITY_DATE])));

                    }

                },function(err){
                    $.Ctx.MsgBox(err.message);
                }
            );

        });

    }
});


