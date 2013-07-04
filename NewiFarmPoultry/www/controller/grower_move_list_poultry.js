var clickAlias = "click";
//$.mobile.defaultPageTransition = 'slide';
var fromLoc = toLoc = null;

$("#grower_move_list_poultry").bind("pageinit", function (event) {
    var PageParam = $.Ctx.GetPageParam('grower_move_list_poultry','param');
    $("#grower_move_list_poultry #captionHeader").text($.Ctx.Lcl('grower_move_list_poultry', PageParam['captionHeader'], 'Move to Other House'));
	$('#grower_move_list_poultry #btnNew').bind(clickAlias,function(){
		ClearParamPage();
		$.Ctx.NavigatePage("grower_move_trans_poultry", 
			{Previous: 'grower_move_list_poultry', Mode:'Create', Data:null}, 
			{transition: 'slide'});
	});
	
	$('#grower_move_list_poultry #btnBack').bind('click',function(){
		$.Ctx.NavigatePage($.Ctx.GetPageParam('grower_move_list_poultry', 'Previous'), 
			null, 
		  { transition: 'slide', reverse: true });
	});
});

$('#grower_move_list_poultry').bind("pagebeforecreate", function (e) {
    $.Util.RenderUiLang('grower_move_list_poultry');
    $.Ctx.RenderFooter('grower_move_list_poultry');
});
 
$("#grower_move_list_poultry").bind("pagebeforeshow", function (event) {
	SearchBindDataMove();
});

$("#grower_move_list_poultry").bind("pageshow", function (event) {
	
});

function SearchBindDataMove(){
	$('#grower_move_list_poultry #lv-move').empty();
    $('#grower_move_list_poultry #totalSearch').html('');
	SearchGrowerMove(function(moves){
		var lblFrom = $.Ctx.Lcl('grower_move_list_poultry','msgFrom','From ');
		if (moves.length != 0) {
            $('#grower_move_list_poultry #totalSearch').html($.Ctx.Lcl('iFarm', 'msgTotalSearch', 'Total : {0}').format([moves.length]));
        }
		for (var i=0;i<moves.length;i++){
			var key = moves[i].FARM_ORG_LOC+'|'+moves[i].TRANSACTION_DATE+'|'+moves[i].DOCUMENT_TYPE +'|'+ moves[i].DOCUMENT_EXT+'|'+moves[i].TO_FARM_ORG_LOC;
			var noSd = (moves[i].NUMBER_OF_SENDING_DATA==null?0:moves[i].NUMBER_OF_SENDING_DATA);
			var html = '<li code="'+ key + '" data-swipeurl="#" noSd="'+ noSd + '">'; 
			html += '<a href="#">';
			html+='<h3>' + lblFrom + moves[i].FARM_ORG_LOC +'</h3>';
			var sumqty = (moves[i].MALE_QTY==null ? 0:moves[i].MALE_QTY) + (moves[i].FEMALE_QTY==null ? 0:moves[i].FEMALE_QTY);
			var sumwgt = (moves[i].MALE_WGH==null ? 0:moves[i].MALE_WGH) + (moves[i].FEMALE_WGH==null ? 0:moves[i].FEMALE_WGH);
			html+='<p><strong><span id="lblTo" data-lang="lblTo">To</span> '+ moves[i].TO_FARM_ORG_LOC + ' , <span id="lblQty" data-lang="lblQty">QTY</span> - ' +accounting.formatNumber(sumqty,0,",")+ ', <span id="lblWt" data-lang="lblWt">WT</span> - '+accounting.formatNumber(sumwgt,2,",")+'</strong></p>';
			html+='<div class="ui-li-count">'+ parseDbDateStr(moves[i].TRANSACTION_DATE).toUIShortDateStr() +'</div>';
			html+='</a>';
			html+='</li>';
			$("#grower_move_list_poultry #lv-move").append(html);
		}
		$('#grower_move_list_poultry #lv-move').listview('refresh');
		
		$('#grower_move_list_poultry #lv-move li').swipeDelete({
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
					if (keys.length==5){
						DeleteGrowerMove(keys[0], parseUIDateStr(keys[1]), keys[2], keys[3] ,keys[4] ,function(succ){
							if (succ==true){
								//$.Ctx.MsgBox('Delete Success');
								SearchBindDataMove();
							}
						});
					}
				}else{
					$.Ctx.MsgBox($.Ctx.Lcl('grower_move_list_poultry', 'msgCannotDeleteItem', 'Cannot delete this item'));
				}
			}
		});
		
		$('#grower_move_list_poultry #lv-move li').bind(clickAlias, function(){
			ClearParamPage();
			var noSend = $(this).attr("noSd");
			var keyCode = $(this).attr("code");
			var keys = keyCode.split('|');
			//===========TRANSACTION_DATE must be string cause is in ParamPage!!!!!
			$.Ctx.SetPageParam('grower_move_trans_poultry', 'Key',{'FARM_ORG_LOC':keys[0],'TRANSACTION_DATE':keys[1],'DOCUMENT_TYPE':keys[2], 'DOCUMENT_EXT': Number(keys[3]) } );
			//console.log($.Ctx.GetPageParam('grower_move_trans', 'Key'));
			var md = 'Update';
			if (noSend!=="0") md = 'Display';

			$.Ctx.NavigatePage("grower_move_trans_poultry", 
				{ Previous: 'grower_move_list_poultry', Mode:md}, 
				{ transition: 'slide' });
		});
		
	});
}

function ClearParamPage(){
	$.Ctx.SetPageParam('grower_move_trans_poultry', 'Data', null);
	$.Ctx.SetPageParam('grower_move_trans_poultry', 'selectedFarmOrgFrom', null);
	$.Ctx.SetPageParam('grower_move_trans_poultry', 'selectedFarmOrgTo', null);
	$.Ctx.SetPageParam('grower_move_trans_poultry', 'selectedBreeder', null);
	$.Ctx.SetPageParam('grower_move_trans_poultry', 'selectedBirthweek', null);
}

function SearchGrowerMove(SuccessCB){
	var pParam = $.Ctx.GetPageParam('grower_move_list_poultry','param');
	try{
		fromLoc = pParam['FROMLOC'];
		toLoc = pParam['TOLOC'];
	}catch(e){
		fromLoc = 2;
		toLoc = 3;
	}
	var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT T.FARM_ORG_LOC, T.TRANSACTION_DATE, T.DOCUMENT_TYPE, T.DOCUMENT_EXT, T.TO_FARM_ORG_LOC, ";
	cmd.sqlText += " T.MALE_QTY, T.MALE_WGH, T.FEMALE_QTY, T.FEMALE_WGH, T.NUMBER_OF_SENDING_DATA ";
	cmd.sqlText += " FROM HH_FR_MS_GROWER_MOVE T ";
//	cmd.sqlText += " JOIN HH_FR_FARM_GROWER F1 ON (T.ORG_CODE=F1.ORG_CODE AND T.FARM_ORG_LOC=F1.FARM_ORG) ";
	//cmd.sqlText += " JOIN HH_FR_FARM_GROWER F2 ON (T.ORG_CODE=F2.ORG_CODE AND T.TO_FARM_ORG_LOC=F2.FARM_ORG) ";
	cmd.sqlText += " WHERE T.ORG_CODE=? AND T.FARM_ORG=? AND T.TRANSACTION_DATE=? ";
//	cmd.sqlText += " AND F1.LOCATION=? AND F2.LOCATION=? ";
	cmd.sqlText += " ORDER BY T.FARM_ORG_LOC, T.DOCUMENT_EXT ";
    cmd.parameters.push($.Ctx.SubOp);
	cmd.parameters.push($.Ctx.Warehouse);
	cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
	//cmd.parameters.push(fromLoc);
	//cmd.parameters.push(toLoc);
	
    cmd.executeReader(function (tx, res) {
        if (res.rows.length !== 0) {
            var dSrc = new Array();
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_FR_MS_GROWER_MOVE();
                m.retrieveRdr(res.rows.item(i));
                dSrc.push(m);
            }
           SuccessCB(dSrc);
        }
    }, function (err) {
        console.log(err.message);
    });
}

function DeleteGrowerMove(farmOrgLoc, txDate, docType, docExt, tofarmLoc,SuccessCB){
	var move = new HH_FR_MS_GROWER_MOVE();
	var stockIn = new HH_FR_MS_GROWER_STOCK();
	var stockOut = new HH_FR_MS_GROWER_STOCK();
	
	move.ORG_CODE = $.Ctx.SubOp;
	move.FARM_ORG = $.Ctx.Warehouse;
	move.FARM_ORG_LOC = farmOrgLoc;
	move.TRANSACTION_DATE = txDate.toDbDateStr();
	move.DOCUMENT_TYPE=docType;
	move.DOCUMENT_EXT = docExt;
	
	stockIn.ORG_CODE = $.Ctx.SubOp;
	stockIn.FARM_ORG = $.Ctx.Warehouse;
	stockIn.FARM_ORG_LOC = tofarmLoc;
	stockIn.TRANSACTION_DATE = txDate.toDbDateStr();
	stockIn.TRANSACTION_TYPE = '1';
	stockIn.DOCUMENT_TYPE=docType;
	stockIn.DOCUMENT_EXT = docExt;
	
	stockOut.ORG_CODE = $.Ctx.SubOp;
	stockOut.FARM_ORG = $.Ctx.Warehouse;
	stockOut.FARM_ORG_LOC = farmOrgLoc;
	stockOut.TRANSACTION_DATE = txDate.toDbDateStr();
	stockOut.TRANSACTION_TYPE = '2';
	stockOut.DOCUMENT_TYPE=docType;
	stockOut.DOCUMENT_EXT = docExt;
	
	var paramCmd = [move.deleteCommand($.Ctx.DbConn), stockOut.deleteCommand($.Ctx.DbConn),stockIn.deleteCommand($.Ctx.DbConn) ];
	var trn = new DbTran($.Ctx.DbConn);
	trn.executeNonQuery(paramCmd, function(){
		if (typeof(SuccessCB)=="function")
			SuccessCB(true);
	}, function(errors){
		SuccessCB(false);
		console.log(errors);
	});
}
