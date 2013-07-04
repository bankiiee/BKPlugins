$('#efficiency_list').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('efficiency_list');
    $.Ctx.RenderFooter('efficiency_list');
});

$('#efficiency_list').bind('pagebeforeshow', function (e) {
    $('#efficiency_list a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('efficiency_list', 'Previous'), null, { transition:'slide', reverse:'true' });
    });

    $('#efficiency_list #btnNew').click(function (e) {
        var model = new HH_FR_MS_PRODUCTION();
        model.ORG_CODE = $.Ctx.SubOp;
        model.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
        $.Ctx.PageParam['efficiency_detail'] = null;
        $.Ctx.SetPageParam('efficiency_detail', 'mode', 'new');
        $.Ctx.SetPageParam('efficiency_detail', 'model', model);
        $.Ctx.SetPageParam('efficiency_detail', 'Previous', 'efficiency_list');
        $.Ctx.NavigatePage('efficiency_detail', null, { transition:'slide'  });
    });
});

$('#efficiency_list').bind('pagebeforeshow', function (e) {
    var arrDetail = new Array();
    var arrTranDate = new Array();
    findData();
    function findData(){

        var name = "";

        var cmd = $.Ctx.DbConn.createSelectCommand();
        var cmd1 = $.Ctx.DbConn.createSelectCommand();
        $('#efficiency_list #data-content').empty();
        if($.Ctx.Lang == "en-US" ){
            name = "NAME_ENG";
        }else{
            name = "NAME_LOC";
        }

        cmd.sqlText = "SELECT * , (SELECT {0} FROM FR_FARM_ORG B WHERE B.ORG_CODE = A.ORG_CODE AND B.FARM_ORG = A.FARM_ORG_LOC) AS FARM_ORG_LOC_NAME FROM HH_FR_MS_PRODUCTION A WHERE ORG_CODE = '{1}'  ORDER BY A.TRANSACTION_DATE".format([name,$.Ctx.SubOp]);
        cmd.executeReader(function (tx, res) {
            if (res.rows.length != 0) {
                arrDetail = new Array();
                for (var i = 0; i < res.rows.length; i++) {
                    var m = new HH_FR_MS_PRODUCTION();
                    m.retrieveRdr(res.rows.item(i));
                    m.FARM_ORG_LOC_NAME = res.rows.item(i).FARM_ORG_LOC_NAME;
                    arrDetail.push(m);
                }

                cmd1.sqlText = "SELECT TRANSACTION_DATE FROM  HH_FR_MS_PRODUCTION WHERE ORG_CODE = '{0}' GROUP BY TRANSACTION_DATE   ORDER BY TRANSACTION_DATE".format([$.Ctx.SubOp]);
                cmd1.executeReader(function(tx,res1){
                    arrTranDate = new Array();
                    for (var i = 0; i < res1.rows.length; i++) {
                        var m1 = new HH_FR_MS_PRODUCTION();
                        m1.retrieveRdr(res1.rows.item(i));
                        arrTranDate.push(m1);
                    }

                    BindData_toList(arrTranDate,arrDetail);
                });


            }
        }, function (err) {
            $.Ctx.MsgBox(err.message);
        });
    }

    function BindData_toList(t,d){
        $('#efficiency_list #data-content').empty();

            $.each(t,function(i){
                var s ='<div data-role="collapsible" data-inset="false" data-theme="c" data-content-theme="c" id="TransactionDate'+ i + '" loc="'+t[i].TRANSACTION_DATE+'">';
                s +='<h3>';
                s +='<div class="ui-grid-b" >';
                s +='<div class="ui-block-a" style="text-align:left;"> {0}</div>'.format([t[i].TRANSACTION_DATE]);
                s +='</div>' ;
                s +='</h3>';
                s +='<ul id="TransactionDate'+ i + '-content"  data-role="listview" data-inset="true" data-filter="true"> </ul>';
                s += '</div>';
                $('#efficiency_list #data-content').append(s);
            });
            $("div[data-role='collapsible']" ).collapsible( {refresh:true} );
            $("div[id*='TransactionDate']").bind( "expand", function(event, ui) {
                var rTranLoc = '';
                rTranLoc = $(this).attr('loc');
                //detail_renderListView(rTranLoc, $(this).attr('id')); //rPeriod, collapsId
                detail_renderListView(arrTranDate,arrDetail,rTranLoc,$(this).attr('id'));
                return false;
            });
    }

    function detail_renderListView(t,d,headTran,collapsId) {
        $('#efficiency_list #' + collapsId + '-content').empty();
        var targetId = '#efficiency_list #' + collapsId + '-content';

        if(d.length > 0){


        for (var i = 0; i < d.length; i++) {
            for(var j = 0; j< t.length ; j++){

                if(d[i].TRANSACTION_DATE == t[j].TRANSACTION_DATE && d[i].TRANSACTION_DATE == headTran){
                    var m = new HH_FR_MS_PRODUCTION();
                    m = d[i];

                    var farmOrg = $.Ctx.Lcl('efficiency_list', 'msgFarmOrg', '{0}').format([m.FARM_ORG_LOC]);
                    if (farmOrg == null || m.FARM_ORG_LOC == undefined) {
                        farmOrg = '';
                    }

                    var farmOrgName = $.Ctx.Lcl('efficiency_list', 'msgFarmOrgName', '{0}').format([m.FARM_ORG_LOC_NAME]);
                    if (farmOrgName == null || m.FARM_ORG_LOC_NAME == undefined) {
                        farmOrgName = ''
                    }else{
                        if (farmOrg != null || m.FARM_ORG_LOC!= undefined) {
                            farmOrgName = " (" +farmOrgName +")";
                        }
                    }

                    //var s = '<li  data-swipeurl="#" data-icon="false"><a id="{0}" data-tag="lst_item" {1}  >'.format(['lki-' + i+'-'+collapsId, "data-id='" + i + "#"+ m.TRANSACTION_DATE + "'"]);
                    var s = '<li  data-swipeurl="#" data-icon="false"><a id="{0}" data-tag="lst_item" {1}  >'.format(['lki-' + i+'-'+collapsId, "data-id='" + i + "'"]);
                    s +='<div class="ui-grid-a" >';
                    s +='<div class="ui-block-a" >{0}</div>'.format([farmOrg]);
                    s +='<div class="ui-block-b" >{0}</div>'.format([farmOrgName]);
                    s +='</div>' ;
                    s +='</a></li>' ;

                    $(targetId).append(s);
                    }
                }
            }
        }
        $('#efficiency_list #' + collapsId + '-content').listview();
        $('#efficiency_list #' + collapsId + '-content').listview('refresh');
        $('#efficiency_list  #' + collapsId ).collapsible( {refresh:true} );

        $('#efficiency_list ul[data-role="listview"] li').swipeDelete({
            btnTheme:'r',
            btnLabel:'Delete',
            btnClass:'aSwipeButton',
            click:function (e) {
                e.stopPropagation();
                e.preventDefault();
                var dataId = $(this).parents('li').find('a[data-tag="lst_item"]').attr('data-id');
                var li = $(this).parents('li');

                var uCmd = $.Ctx.DbConn.createSelectCommand();
                m = arrDetail[dataId];


                if(m.NUMBER_OF_SENDING_DATA == 0){
                    var dCmd = $.Ctx.DbConn.createSelectCommand();
                    dCmd.sqlText = "DELETE FROM HH_FR_MS_PRODUCTION WHERE ORG_CODE = '{0}' AND FARM_ORG_LOC = '{1}' AND TRANSACTION_DATE = '{2}'".format([$.Ctx.SubOp , m.FARM_ORG_LOC , m.TRANSACTION_DATE]);

                    dCmd.executeNonQuery(
                        function (tx, res) {

                            $(li).remove();
                            //$('#efficiency_list ul[data-role="listview"]').listview();
                            //$('#efficiency_list ul[data-role="listview"]').listview('refresh');
                            //$("div[data-role='collapsible']" ).collapsible( {refresh:true} );
                            findData();
                        }, function (err) {
                            $.Ctx.MsgBox("Err :" + err.message);
                        });

                }else{
                    $.Ctx.MsgBox($.Ctx.Lcl('efficiency_list', 'msgCannotDeleteItem', "Cannot Delete this item") );
                }

            }
        });


        $('#efficiency_list a[data-tag="lst_item"]  ').click(function (e) {
            var dataId = $(this).attr('data-id');
            var m = arrDetail[dataId];
                    if(m.length !=0){
                        $.Ctx.PageParam['abortion_detail'] = null;
                        $.Ctx.SetPageParam('efficiency_detail', 'mode', 'edit');
                        $.Ctx.SetPageParam('efficiency_detail', 'model', m);
                        $.Ctx.SetPageParam('efficiency_detail', 'Previous', 'efficiency_list');
                        $.Ctx.NavigatePage('efficiency_detail', null, { transition:'slide' });

                    }else{
                        $.Ctx.MsgBox($.Ctx.Lcl('efficiency_list', 'msgCannotFindEffiList', 'Cannot find Efficiency Detail for Farm Org {0} '.format([m.FARM_ORG_LOC])) );
                    }

        });
    }

});


