$('#collect_eggs_list').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('collect_eggs_list');
});

$('#collect_eggs_list').bind('pagebeforehide', function (e) {
    $.Ctx.PersistPageParam();
});

function IsNanOrNullOrEmpty(str) {
    if (str == undefined) { return true };
    if (str == null) { return true };
    if (str === '') { return true };
    if (isNaN(str)) { return true };
    if (typeof(str) == 'String'){
        if (str.trim() === '') { return true };
    }
    return false;
}


$('#collect_eggs_list').bind('pagebeforeshow', function (e,ui) {
    bindDataList();
});

$('#collect_eggs_list').bind('pageinit', function (e) {

    $('#collect_eggs_list a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('collect_eggs_list', 'Previous'), null, { transition: 'slide',reverse:true }, false);
    });

    $('#collect_eggs_list #btnNew').click(function (e) {
        $.Ctx.PageParam['collect_eggs_detail'] = null;
        $.Ctx.SetPageParam('collect_eggs_detail', 'mode', 'new');
        $.Ctx.SetPageParam('collect_eggs_detail', 'Previous', 'collect_eggs_list');
        $.Ctx.NavigatePage('collect_eggs_detail', null, { transition:'slide' });
    });

});


function bindDataList(){

    $('#collect_eggs_list #data-content').empty();
    var trn_date = '';

    date_populateList(function(results){
        $.each(results,function(i,obj){
            var s ='<div data-role="collapsible" data-inset="false" data-theme="c" data-content-theme="c" data-id="'+ i +'" id="transactionDate'+ i + '" loc="'+obj.trnDate+'">';
            s +='<h3>';
            s +='<div class="ui-grid-b">';
            s +='<div class="ui-block-a" style="text-align:left;"> {0}</div>'.format([obj.showDate]);
            s +='</div>' ;
            s +='</h3>';
            s +='<div><ul id="listview'+ i +'" data-role="listview" data-inset="true"></ul> </div>';
            s +='</div>';
            $('#collect_eggs_list #data-content').append(s);

            trn_date = obj.trnDate;
        });
        $("div[data-role='collapsible']" ).collapsible( {refresh:true} );

        $("div[id*='transactionDate']").bind( "expand", function(event, ui) {
            var rdLoc = '';
            rdLoc = $(this).attr('loc');
            detail_populateList(rdLoc, $(this).attr('id'), $(this).attr('data-id'));
            return false;
        });

        console.log(results);
    });

}

function date_populateList(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();

// cmd.sqlText = "DISTINCT MS.TRANSACTION_DATE   ";
    cmd.sqlText = "SELECT DISTINCT strftime('%d/%m/%Y',MS.TRANSACTION_DATE ) SHOW_TRN_DATE , MS.TRANSACTION_DATE TRANSACTION_DATE ";
    cmd.sqlText += " FROM HH_FR_MS_PRODUCTION_EGG MS,HH_FR_MS_DAMAGE_TYPE HD ";
    cmd.sqlText += " WHERE MS.ORG_CODE = HD.ORG_CODE ";
    cmd.sqlText += " AND MS.EGG_PRODUCT_CODE = HD.EGG_PRODUCT_CODE ";
    cmd.sqlText += " AND HD.CATEGORY='PRODUCTION' ";
    cmd.sqlText += " AND MS.ORG_CODE = ? ";
    cmd.parameters.push($.Ctx.SubOp);

    var dt = [];
    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                dt.push({showDate: res.rows.item(i).SHOW_TRN_DATE,
                         trnDate: res.rows.item(i).TRANSACTION_DATE});
            }
        }
        if(typeof SuccessCB == 'function') {
            SuccessCB(dt);
        }
        else {
        }
    }, function (err) {
        alert(err.message);
    });
}


function detail_populateList(transDate,collapsId,idx) {
    var cmd = $.Ctx.DbConn.createSelectCommand();

    cmd.sqlText = "SELECT MS.FARM_ORG_LOC,MS.TRANSACTION_DATE,MS.EGG_QTY,MS.NUMBER_OF_SENDING_DATA , HD.* ";
    cmd.sqlText += " FROM HH_FR_MS_PRODUCTION_EGG MS,HH_FR_MS_DAMAGE_TYPE HD ";
    cmd.sqlText += " WHERE MS.ORG_CODE = HD.ORG_CODE ";
    cmd.sqlText += " AND MS.EGG_PRODUCT_CODE = HD.EGG_PRODUCT_CODE ";
    cmd.sqlText += " AND HD.CATEGORY ='PRODUCTION' ";
    cmd.sqlText += " AND MS.ORG_CODE = ? ";
    cmd.sqlText += " AND MS.TRANSACTION_DATE = ? ";
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push(transDate);

    var dt = [];
    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_FR_MS_DAMAGE_TYPE();
                m.retrieveRdr(res.rows.item(i));
                m.FARM_ORG_LOC = res.rows.item(i).FARM_ORG_LOC;
                m.TRANSACTION_DATE = res.rows.item(i).TRANSACTION_DATE;
                m.EGG_QTY = res.rows.item(i).EGG_QTY;
                m.NUMBER_OF_SENDING_DATA = res.rows.item(i).NUMBER_OF_SENDING_DATA;
                dt.push(m);
            }

            console.log(dt);
            detail_renderList(dt,collapsId,idx);
        }
    }, function (err) {
    alert(err.message);
    });
}

function detail_renderList(p,collapsId,idx) {

    var targetId = '#collect_eggs_list #'+ collapsId ;
    var ulName = '#collect_eggs_list #listview' + idx;
    $(ulName).empty();

    var s = '';
    s += '<li data-role="list-divider">';
    s += '        <div class="ui-grid-a" style="color:blue;font-size:small;">';  //text-align:center;
    s += '            <div class="ui-block-a">';
    s += '                  <div style="text-align:left;">{0}</div>'.format([$.Ctx.Lcl('collect_eggs_list', 'colFarmOrg', 'FARM ORG LOC')]);
    s += '            </div>';
    s += '            <div class="ui-block-b">';
    s += '                  <div style="text-align:center;">{0}</div>'.format([$.Ctx.Lcl('collect_eggs_list', 'colEggQty', 'Egg Prd')]);
    s += '            </div>';
    s += '        </div>';
    s += '</li>';
   //$(targetId).append(s);
    for (var i = 0; i < p.length; i++) {
        var m = p[i];
       s += '<li  data-swipeurl="#"><a id="lk-{0}" data-tag="lst_item" txdate="{1}" farmorg="{2}" numOfSend ="{3}" >'.format([ i,m.TRANSACTION_DATE, m.FARM_ORG_LOC, m.NUMBER_OF_SENDING_DATA ]);
        s +='<div class="ui-grid-a" style="font-size:small;">';
        s +='<div class="ui-block-a"><strong>{0}</strong></div>'.format([m.FARM_ORG_LOC]);
        s +='<div class="ui-block-b" style="text-align:right;">{0}</div>'.format([accounting.formatNumber(m.EGG_QTY,0,',','')]);
        s +='</div>' ;
        s +='</a></li>' ;
    }
    $(ulName).append(s);
    $(ulName).listview();
    $(ulName).listview('refresh');

    $(ulName + ' li').swipeDelete({
        btnTheme:'r',
        btnLabel:'Delete',
        btnClass:'aSwipeButton',
        click:function (e) {
            e.stopPropagation();
            e.preventDefault();

            var numOfSendData = $(this).parents('li').children('div').children('div').children('a').attr('numOfSend');
            if (numOfSendData==0){
                var txdate = $(this).parents('li').children('div').children('div').children('a').attr('txdate');
                var farmOrg = $(this).parents('li').children('div').children('div').children('a').attr('farmorg');
                $.FarmCtx.DeleteCollectEgg(farmOrg, parseUIDateStr(txdate) ,function(succ){
                    if (succ == true){
                        bindDataList();
                    }
                } );
            }
            else{
               // alert('Data Sent, Cannot Delete.');
                alert($.Ctx.Lcl('collect_eggs_list', 'msgCannotDeleteItem', 'Cannot delete this item'));
            }
        }
    });

    $(ulName + ' a[id*="lk-"]').click(function(){
        var txdate = $(this).attr('txdate');
        var farmOrg = $(this).attr('farmorg');
        $.Ctx.SetPageParam('collect_eggs_detail', 'mode', 'edit');
        $.Ctx.SetPageParam('collect_eggs_detail', 'Previous', 'collect_eggs_list');
        $.Ctx.NavigatePage('collect_eggs_detail', {'farmOrg':farmOrg,'txDate': txdate}, { transition:'slide'  });

    });

}




