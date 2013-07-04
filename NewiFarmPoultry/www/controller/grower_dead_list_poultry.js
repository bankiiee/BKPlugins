var clickAlias = "click";
//$.mobile.defaultPageTransition = 'slide';

$("#grower_dead_list_poultry").bind("pageinit", function (event) {
    var pParam = $.Ctx.GetPageParam('grower_dead_list_poultry', 'param');
    try {
        $("#grower_dead_list_poultry #captionHeader").text($.Ctx.Lcl('grower_dead_list_poultry', pParam['captionHeader'], 'Dead'));
    } catch (e) {
        alert(e)
        $("#grower_dead_list_poultry #captionHeader").text($.Ctx.Lcl('grower_dead_list_poultry', 'captionHeader', 'Dead'));
    }

	$('#grower_dead_list_poultry #btnNew').bind(clickAlias,function(){
		ClearParamPage();
		$.Ctx.NavigatePage("grower_dead_trans_poultry", 
			{Previous: 'grower_dead_list_poultry', Mode:'Create', Data:null}, 
			{transition: 'slide'});
	});
	
	$('#grower_dead_list_poultry #btnBack').bind('click',function(){
		$.Ctx.NavigatePage($.Ctx.GetPageParam('grower_dead_list_poultry', 'Previous'), 
			null, 
		  { transition:'slide', reverse:true });
	});
});

$('#grower_dead_list_poultry').bind("pagebeforecreate", function (e) {
    $.Util.RenderUiLang('grower_dead_list_poultry');
    $.Ctx.RenderFooter('grower_dead_list_poultry');
});
 
$("#grower_dead_list_poultry").bind("pagebeforeshow", function (event) {
	SearchBindDataDestroy();
});

$("#grower_dead_list_poultry").bind("pageshow", function (event) {
	
});

function SearchBindDataDestroy(){
	$('#grower_dead_list_poultry #lv-deads').empty();
    $('#grower_dead_list_poultry #totalSearch').html('');
	SearchGrowerDead(function(deads){
		var lblDead = $.Ctx.Lcl('grower_dead_list_poultry','msgDead','Dead'),
		    lblQty = $.Ctx.Lcl('grower_dead_list_poultry','msgQty','QTY'),
			lblWgh = $.Ctx.Lcl('grower_dead_list_poultry','msgWgh','WGH'),
			lblAmt = $.Ctx.Lcl('grower_dead_list_poultry','msgAmt','AMT'),
			lblCul = $.Ctx.Lcl('grower_dead_list_poultry','msgCull','Culling');
		var qtyAll = wghAll = amtAll = 0;
		for (var i=0;i<deads.length;i++){
			var key = deads[i].FARM_ORG_LOC+'|'+deads[i].TRANSACTION_DATE+'|'+deads[i].DOCUMENT_TYPE +'|'+ deads[i].DOCUMENT_EXT;
			var noSd = (deads[i].NUMBER_OF_SENDING_DATA==null?0:deads[i].NUMBER_OF_SENDING_DATA);
			var html = '<li code="'+ key + '" data-swipeurl="#" noSd="'+ noSd + '">';
			html += '<a href="#">';
			html += '<h3>' + deads[i].FARM_ORG_LOC + ' ' + deads[i].FARM_ORG_LOC_NAME  + '</h3>';
			var sumqty = (deads[i].MALE_QTY==null ? 0:deads[i].MALE_QTY) + (deads[i].FEMALE_QTY==null ? 0:deads[i].FEMALE_QTY);
			var sumwgt = (deads[i].MALE_WGH==null ? 0:deads[i].MALE_WGH) + (deads[i].FEMALE_WGH==null ? 0:deads[i].FEMALE_WGH);
			qtyAll+=sumqty;
			wghAll+=sumwgt;
		    //html+='<p><strong>{0}, {1} - {2}, {3} - {4} </strong></p>'.format([(deads[i].DEAD_TYPE=="1"?lblDead:lblCul), lblQty, accounting.formatNumber(sumqty,0,","), lblWgh, accounting.formatNumber(sumwgt,2,",")]);

			html += '<p><strong>{0} - {1}, {2}</strong></p>'.format([lblQty, accounting.formatNumber(sumqty, 0, ","), ($.Ctx.Lang == 'en-US' ? deads[i].REASON_NAME_ENG : deads[i].REASON_NAME_LOC)]);

			html+='<div class="ui-li-count">'+ parseDbDateStr(deads[i].TRANSACTION_DATE).toUIShortDateStr() +'</div>';
			html+='</a>';
			html+='</li>';
			$("#grower_dead_list_poultry #lv-deads").append(html);
		}
		$('#grower_dead_list_poultry #lv-deads').listview('refresh');
		
		if (qtyAll>0||wghAll>0) {
            $('#grower_dead_list_poultry #totalSearch').html(
				$.Ctx.Lcl('iFarm', 'msgTotalSearch98', 'Total Qty:{0}, Total Wgh:{1}').format([accounting.formatNumber(qtyAll,0,","),accounting.formatNumber(wghAll,2,",")]));
        }
		$('#grower_dead_list_poultry #lv-deads li').swipeDelete({
			btnTheme:'r',
			btnLabel:'Delete',
			btnClass:'aSwipeButton',
			click:function (e) {
				e.stopPropagation();
                e.preventDefault();
				var noSend = $(this).parents('li').attr('noSd');
				if (noSend=="0"){
					var keyCode = $(this).parents('li').attr('code');
					var keys = keyCode.split('|');
					if (keys.length==4){
						DeleteGrowerDead(keys[0], parseUIDateStr(keys[1]), keys[2], keys[3],function(succ){
							if (succ==true){
								//$.Ctx.MsgBox('Delete Success');
								SearchBindDataDestroy();
							}
						});
					}
				}else{
					$.Ctx.MsgBox($.Ctx.Lcl('grower_dead_list_poultry', 'msgCannotDeleteItem', 'Cannot delete this item'));
				}
			}
		});
		
		$('#grower_dead_list_poultry #lv-deads li').bind(clickAlias, function(){
			ClearParamPage();
			var noSend = $(this).attr("noSd");
			var keyCode = $(this).attr("code");
			var keys = keyCode.split('|');
			//===========TRANSACTION_DATE must be string cause is in ParamPage!!!!!
			$.Ctx.SetPageParam('grower_dead_trans_poultry', 'Key',{'FARM_ORG_LOC':keys[0],'TRANSACTION_DATE':keys[1],'DOCUMENT_TYPE':keys[2], 'DOCUMENT_EXT': Number(keys[3]) } );
			//console.log($.Ctx.GetPageParam('grower_dead_trans', 'Key'));
			var md = 'Update';
			if (noSend!=="0") md = 'Display';

			$.Ctx.NavigatePage("grower_dead_trans_poultry", 
				{ Previous: 'grower_dead_list_poultry', Mode:md}, 
				{ transition: 'slide' });
		});
	});
}

function ClearParamPage(){
    $.Ctx.SetPageParam('grower_dead_trans_poultry', 'Data', null);
    $.Ctx.SetPageParam('grower_dead_trans_poultry', 'selectedFarmOrg', null);
    $.Ctx.SetPageParam('grower_dead_trans_poultry', 'selectedBreeder', null);
    $.Ctx.SetPageParam('grower_dead_trans_poultry', 'selectedBirthweek', null);
    $.Ctx.SetPageParam('grower_dead_trans_poultry', 'selectedReason', null);
}

function SearchGrowerDead(SuccessCB){
	var cmd = $.Ctx.DbConn.createSelectCommand();
	var nameField ="";
	if ($.Ctx.Lang=="en-US") 
		nameField = "ifnull(F.NAME_ENG, F.NAME_LOC)";
	else
	    nameField = "ifnull(F.NAME_LOC, F.NAME_ENG)";
    cmd.sqlText = "SELECT T.FARM_ORG_LOC, {0} as FARM_ORG_LOC_NAME , T.TRANSACTION_DATE, T.DOCUMENT_TYPE, T.DOCUMENT_EXT, T.DEAD_TYPE, ".format([nameField]);
    cmd.sqlText += " T.MALE_QTY, T.MALE_WGH, T.FEMALE_QTY, T.FEMALE_WGH, T.NUMBER_OF_SENDING_DATA, ";
    cmd.sqlText += " (SELECT DESC_LOC AS REASON_CODE FROM HH_GD2_FR_MAS_TYPE_FARM WHERE GD_TYPE='RSC' and GD_CODE = T.REASON_CODE) AS REASON_NAME_LOC,"
    cmd.sqlText += "    (SELECT DESC_ENG AS REASON_CODE FROM HH_GD2_FR_MAS_TYPE_FARM WHERE GD_TYPE='RSC' and GD_CODE = T.REASON_CODE) AS REASON_NAME_ENG "
    cmd.sqlText += " FROM HH_FR_MS_GROWER_DEAD T , ";
    cmd.sqlText += " FR_FARM_ORG F ";
    cmd.sqlText += " WHERE T.ORG_CODE=? AND T.FARM_ORG=? AND T.TRANSACTION_DATE=?";
    cmd.sqlText += " AND T.ORG_CODE= F.ORG_CODE AND T.FARM_ORG_LOC= F.FARM_ORG ";
	cmd.sqlText += " ORDER BY T.FARM_ORG_LOC, T.DOCUMENT_EXT ";
	
    cmd.parameters.push($.Ctx.SubOp);
	cmd.parameters.push($.Ctx.Warehouse);
	cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());

	cmd.executeReader(function (tx, res) {
	    if (res.rows.length !== 0) {
	        var dSrc = new Array();
	        for (var i = 0; i < res.rows.length; i++) {
	            var m = new HH_FR_MS_GROWER_DEAD();

	            m.retrieveRdr(res.rows.item(i));
	            m.REASON_NAME_ENG = res.rows.item(i).REASON_NAME_ENG;
	            m.REASON_NAME_LOC = res.rows.item(i).REASON_NAME_LOC;
	            m.FARM_ORG_LOC_NAME = res.rows.item(i).FARM_ORG_LOC_NAME; 
	            dSrc.push(m);
	        }
	        SuccessCB(dSrc);
	    }
	}, function (err) {
	    console.log(err.message);
	});
}

function DeleteGrowerDead(farmOrgLoc, txDate, docType, docExt, SuccessCB){
	var dead = new HH_FR_MS_GROWER_DEAD();
	var stock = new HH_FR_MS_GROWER_STOCK();
	
	dead.ORG_CODE = $.Ctx.SubOp;
	dead.FARM_ORG = $.Ctx.Warehouse;
	dead.FARM_ORG_LOC = farmOrgLoc;
	dead.TRANSACTION_DATE = txDate.toDbDateStr();
	dead.DOCUMENT_TYPE=docType;
	dead.DOCUMENT_EXT = docExt;
	
	stock.ORG_CODE = $.Ctx.SubOp;
	stock.FARM_ORG = $.Ctx.Warehouse;
	stock.FARM_ORG_LOC = farmOrgLoc;
	stock.TRANSACTION_DATE = txDate.toDbDateStr();
	stock.TRANSACTION_TYPE = '2';
	stock.DOCUMENT_TYPE=docType;
	stock.DOCUMENT_EXT = docExt;
	
	var paramCmd = [dead.deleteCommand($.Ctx.DbConn), stock.deleteCommand($.Ctx.DbConn)];
	var trn = new DbTran($.Ctx.DbConn);
	trn.executeNonQuery(paramCmd, function(){
		if (typeof(SuccessCB)=="function")
			SuccessCB(true);
	}, function(errors){
		SuccessCB(false);
		console.log(errors);
	});
}
