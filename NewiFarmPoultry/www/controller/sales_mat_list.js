var clickAlias = "click";
//$.mobile.defaultPageTransition = 'slide';
var docTypeMat = "DCTYP51", DEF_STK_LOC="FARM", DEF_ENTRY_TYP="1";
var PM_STK_TYPE_KEY = "product_stock_type",
	PM_DOC_TYPE_KEY = "document_type",
	PM_STK_LOC_KEY = "stock_location",
	PM_STK_CAL_TYPE_KEY = "cal_type",
	PM_TRAN_TYPE_KEY = "transaction_type",
	PM_TRAN_COD_KEY = "transaction_code";
	
$("#sales_mat_list").bind("pageinit", function (event) {
	var pParam  = $.Ctx.GetPageParam('sales_mat_list','param');
	try{
		$("#sales_mat_list #captionHeader").text($.Ctx.Lcl('sales_mat_list', pParam['captionHeader'], 'Sales Material'));
	}catch(e){
		$("#sales_mat_list #captionHeader").text($.Ctx.Lcl('sales_mat_list', 'captionHeader', 'Sales Material'));
	}
	
	$('#sales_mat_list #btnNew').bind(clickAlias, function(){
		/*var gdCode = $.Ctx.SubOp + '-' + $.Ctx.Warehouse;
		FindGd2FRMasType('MBDC', gdCode, function(device){
			if (device == null){
				$('#sales_mat_list #btnManual').click();
			}else if (device=='B'||device=='Q'){
				
			}
			$('#sales_mat_list #popupBarcode').popup( "open",  null);
		});*/
		ClearParamPage();
		$.Ctx.NavigatePage("sales_mat_trans", 
			{Previous: 'sales_mat_list', Mode:'Create', Data:null}, 
			{transition: 'slide'});
	});
	
	$('#sales_mat_list #btnManual').bind(clickAlias, function(){
		ClearParamPage();
		$.Ctx.NavigatePage("sales_mat_trans", 
			{Previous: 'sales_mat_list', Mode:'Create', Data:null}, 
			{transition: 'slide'});
	});
	
	$('#sales_mat_list #btnBack').bind('click',function(){
		 $.Ctx.NavigatePage($.Ctx.GetPageParam('sales_mat_list', 'Previous'), 
			null, 
		 { transition: 'slide', reverse: true });
	});
});

$('#sales_mat_list').bind("pagebeforecreate", function (e) {
    $.Util.RenderUiLang('sales_mat_list');
    $.Ctx.RenderFooter('sales_mat_list');
});
 
$("#sales_mat_list").bind("pagebeforeshow", function (event) {
	BindDataSalesGrp();
});

function BindDataSalesGrp(SuccessCB){
	$("#sales_mat_list #collaps-content").empty();
	$('#sales_mat_list #totalSearch').html('');
	SearchSalesMatTranGroup(function(farms){
		if (farms==null) return false;
		$('#collaps-content').empty();
		var lblFarm = $.Ctx.Lcl('sales_mat_list','msgFarm','Farm'),
		    lblQty = $.Ctx.Lcl('sales_mat_list','msgQty','QTY'),
			lblWgh = $.Ctx.Lcl('sales_mat_list','msgWgh','WGH'),
			lblAmt = $.Ctx.Lcl('sales_mat_list','msgAmt','AMT');
		var qtyAll = wghAll = amtAll = 0;
		$.each(farms, function(i,obj){
			var s ='<div data-role="collapsible" data-theme="c" data-content-theme="c" id="Farm'+ obj.FARM_ORG + '">';
			s +='<h4>';
			s +='<div class="ui-grid-a" style="font-size:small;">';
			s +='	<div class="ui-block-a" style="text-align:left;width:30%">{0} {1}</div>'.format([obj.FARM_ORG,obj.FARM_ORG_NAME]);
			//s +='	<div class="ui-block-b" style="text-align:left;width:30%">{0}</div>'.format([]);
			s +='	<div class="ui-block-b" style="float:right;text-align:right;">';
			s +='		{0}:{1}, {2}:{3}, {4}:{5}'.format([lblQty, accounting.formatNumber(obj.S_QTY,0,",") , lblWgh, accounting.formatNumber(obj.S_WGH,2,","), lblAmt, accounting.formatNumber(obj.S_AMT,2,",")]);
			s +='	</div>' ;
			s +='</div>' ;
			s +='</h4>';
			s +='<ul id="Farm'+ obj.FARM_ORG + '-content"  data-role="listview" data-inset="true" data-filter="true"> </ul>';
			s += '</div>';
			$('#collaps-content').append(s);
			qtyAll+=obj.S_QTY;
			wghAll+=obj.S_WGH;
			amtAll+=obj.S_AMT;
        });
        $("div[data-role='collapsible']" ).collapsible( {refresh:true} );
		
		if (qtyAll>0||wghAll>0||amtAll>0) {
            $('#sales_mat_list #totalSearch').html(
				$.Ctx.Lcl('iFarm', 'msgTotalSearch99', 'Total Qty:{0}, Total Wgh:{1}, Total Amt:{2}').format([accounting.formatNumber(qtyAll,0,","),accounting.formatNumber(wghAll,2,","),accounting.formatNumber(amtAll,2,",")]));
        }
		
		$("div[id^='Farm']").bind( "expand", function(event, ui) {
			var id = $(this).attr('id');
			var content = id + '-content';
			var farmOrg = id.replace('Farm','');
			BindListDetailSales(content, farmOrg);
			return false;
		});
		 
		if (typeof SuccessCB !=='undefined') SuccessCB(true);
	});
}

function BindListDetailSales(parentId, farmOrg){
	$('#sales_mat_list #'+ parentId).empty();
	SearchSalesMatTranByFarm(farmOrg, function(farms){
//console.log('Items : ' + farms.length);
		var lblQty = $.Ctx.Lcl('sales_mat_list','msgQty','QTY'),
			lblWgh = $.Ctx.Lcl('sales_mat_list','msgWgh','WGH'),
			lblAmt = $.Ctx.Lcl('sales_mat_list','msgAmt','AMT');
		if (farms==null) return false;
		
		for (var i=0; i<farms.length; i++){
			var key = farms[i].FARM_ORG+'|'+farms[i].TRANSACTION_DATE+'|'+ farms[i].DOCUMENT_TYPE +'|'+ farms[i].DOCUMENT_EXT;
			key += '|' +  farms[i].PRODUCT_CODE + '|' + farms[i].QTY + '|' + farms[i].WGH ; 
			var noSd = (farms[i].NUMBER_OF_SENDING_DATA==null?0:farms[i].NUMBER_OF_SENDING_DATA);
			
			var html = '<li code="'+key+'" data-swipeurl="#" noSd="'+noSd+'">';
			html+= '<a href="#">';
			html+='<h4>'+ farms[i].PRODUCT_NAME +'</h4>';
			var sumqty = (farms[i].QTY==null ? 0:farms[i].QTY);
			var sumwgt = (farms[i].WGH==null ? 0:farms[i].WGH);
			var amt = (farms[i].NET_AMT==null ? 0:farms[i].NET_AMT);
			html+='<p><strong>{3} - {0}, {4} - {1}, {5} - {2}</strong></p>'.format([accounting.formatNumber(sumqty,0,","),accounting.formatNumber(sumwgt,2,","),accounting.formatNumber(amt,2,","),lblQty,lblWgh,lblAmt]);
			html+='<div class="ui-li-count">'+ parseDbDateStr(farms[i].TRANSACTION_DATE).toUIShortDateStr() +'</div>';
			html+='</a>';
			html+='</li>';
			$("#sales_mat_list #" + parentId).append(html);
//console.log("#sales_mat_list #" + parentId);				
		}
		$("#sales_mat_list #" + parentId).listview();
        $("#sales_mat_list #" + parentId).listview('refresh');
//console.log('refresh list');		
		$("#sales_mat_list #" + parentId + ' li').swipeDelete({
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
					if (keys.length==7){
						DeleteSalesMat(keys[0], parseUIDateStr(keys[1]), keys[2], keys[3] ,keys[4],keys[5],keys[6], function(succ){
							if (succ==true){
								//$.Ctx.MsgBox('Delete Success');
								var ul = $(this).parents('li').parents('ul').id;
								//-content 
								BindDataSalesGrp(function(succ){
									var coll = parentId.replace('-content','');
									$( "#sales_mat_list #" + coll ).trigger( "expand" );
								});
							}
						});
					}
				}else{
					$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_list', 'msgCannotDeleteItem', 'Cannot delete this item'));
				}
			}
		});
		
		$("#sales_mat_list #" + parentId + ' li').bind(clickAlias, function(){
			ClearParamPage();
			var noSend = $(this).attr("noSd");
			var keyCode = $(this).attr("code");
			var keys = keyCode.split('|');
			//===========TRANSACTION_DATE must be string cause is in ParamPage!!!!!
			$.Ctx.SetPageParam('sales_mat_trans', 'Key',{'FARM_ORG':keys[0],
													'TRANSACTION_DATE':keys[1],
													'DOCUMENT_TYPE':keys[2],
													'DOCUMENT_EXT': Number(keys[3]),
													'PRODUCT_CODE':keys[4],
													'QTY':keys[5],
													'WGH':keys[6]});
			var md = 'Update';
			if (noSend!=="0") md = 'Display';
			
			$.Ctx.NavigatePage("sales_mat_trans", 
				{ Previous: 'sales_mat_list', Mode:md}, 
				{ transition: 'slide' });
		});
	});
}

function ClearParamPage(){
	$.Ctx.SetPageParam('sales_mat_trans', 'Data', null);
	$.Ctx.SetPageParam('sales_mat_trans', 'selectedCustomer',null);
	$.Ctx.SetPageParam('sales_mat_trans', 'selectedFarmOrg',null);
	$.Ctx.SetPageParam('sales_mat_trans', 'ProductSelected',null);
	$.Ctx.SetPageParam('sales_mat_trans', 'selectedEntryType',null);
}

function SearchSalesMatTranGroup(SuccessCB){
	var pParam = $.Ctx.GetPageParam('sales_mat_list','param');
	var stkType = null;
	try{
		docTypeMat = pParam[PM_DOC_TYPE_KEY];
		stkType = pParam[PM_STK_TYPE_KEY];
	}catch(e){//Set Default
		docTypeMat = "DCTYP51";
		stkType = "10";
	}
	
	var cmd = $.Ctx.DbConn.createSelectCommand();
	var	nameField = $.Ctx.Lang=="en-US"?"ifnull(F.NAME_ENG, F.NAME_LOC)":"ifnull(F.NAME_LOC, F.NAME_ENG)";
	cmd.sqlText = "SELECT DISTINCT T.FARM_ORG, {0} AS FARM_ORG_NAME , SUM(T.QTY) AS S_QTY, SUM(T.WGH) AS S_WGH,SUM(T.NET_AMT) AS S_AMT ".format([nameField]) ;
	cmd.sqlText += "FROM HH_FR_MS_MATERIAL_SALE T ";
	cmd.sqlText += "JOIN FR_FARM_ORG F ON T.FARM_ORG=F.FARM_ORG ";
	cmd.sqlText += "WHERE T.ORG_CODE=? AND T.TRANSACTION_DATE=? ";
	cmd.sqlText += "AND T.DOCUMENT_TYPE=? AND T.STOCK_TYPE=? ";
	cmd.sqlText += "GROUP BY T.FARM_ORG , FARM_ORG_NAME ";
	cmd.sqlText += "ORDER BY T.FARM_ORG ";
	
    cmd.parameters.push($.Ctx.SubOp);
	cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
	cmd.parameters.push(docTypeMat);
	cmd.parameters.push(stkType);
    cmd.executeReader(function (tx, res) {
        if (res.rows.length !== 0) {
            var dSrc = new Array();
            for (var i = 0; i < res.rows.length; i++) {
                dSrc.push({'FARM_ORG':res.rows.item(i).FARM_ORG, 
							'FARM_ORG_NAME':res.rows.item(i).FARM_ORG_NAME,
							'S_QTY':res.rows.item(i).S_QTY, 
							'S_WGH':res.rows.item(i).S_WGH,
							'S_AMT':res.rows.item(i).S_AMT});
            }
           SuccessCB(dSrc);
        }
    }, function (err) {
        console.log(err.message);
    });
}

function SearchSalesMatTranByFarm(farmOrg, SuccessCB){
	var pParam = $.Ctx.GetPageParam('sales_mat_list','param');
	var stkType = null;
	try{
		docTypeMat = pParam[PM_DOC_TYPE_KEY];
		stkType = pParam[PM_STK_TYPE_KEY];
	}catch(e){//Set Default
		docTypeMat = "DCTYP51";
		stkType = "10";
	}
	var cmd = $.Ctx.DbConn.createSelectCommand();
	var	nameField = $.Ctx.Lang=="en-US" ? "ifnull(F.NAME_ENG, F.NAME_LOC)" : "ifnull(F.NAME_LOC, F.NAME_ENG)";
	
	cmd.sqlText = "SELECT T.FARM_ORG, T.TRANSACTION_DATE, T.DOCUMENT_TYPE, T.DOCUMENT_EXT, T.PRODUCT_CODE, P.PRODUCT_NAME , T.QTY, T.WGH, T.NET_AMT ";
	cmd.sqlText += "FROM HH_FR_MS_MATERIAL_SALE T ";
	cmd.sqlText += "JOIN HH_FR_CUSTOMER_PIG C ON (T.ORG_CODE=C.SUB_OPERATION AND T.CUSTOMER_CODE=C.CUSTOMER_CODE) ";
	cmd.sqlText += "JOIN HH_PRODUCT_BU P ON T.PRODUCT_CODE=P.PRODUCT_CODE ";
	cmd.sqlText += "WHERE T.ORG_CODE=? AND T.TRANSACTION_DATE=? ";
	cmd.sqlText += "AND DOCUMENT_TYPE=? AND T.FARM_ORG=? AND T.STOCK_TYPE=? ";
	cmd.sqlText += "ORDER BY T.DOCUMENT_EXT ";
	 
    cmd.parameters.push($.Ctx.SubOp);
	cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
	cmd.parameters.push(docTypeMat);
	cmd.parameters.push(farmOrg);
	cmd.parameters.push(stkType);
	
    cmd.executeReader(function (tx, res) {
        if (res.rows.length !== 0) {
            var dSrc = new Array();
            for (var i = 0; i < res.rows.length; i++) {
				var t = new HH_FR_MS_MATERIAL_SALE();
				t.retrieveRdr(res.rows.item(i));
				t.PRODUCT_NAME = res.rows.item(i).PRODUCT_NAME;
				
                dSrc.push(t);
            }
           if (typeof SuccessCB=='function') SuccessCB(dSrc);
        }
    }, function (err) {
        console.log(err.message);
    });
}

function DeleteSalesMat(farmOrg, txDate, docType, docExt, prdCod, qty, wgh, SuccessCB){
	var sal = new HH_FR_MS_MATERIAL_SALE();
	var st = new S1_ST_STOCK_TRN();
	var sb = new S1_ST_STOCK_BALANCE();
	
	sal.ORG_CODE = $.Ctx.SubOp;
	sal.FARM_ORG = farmOrg;
	sal.TRANSACTION_DATE = txDate.toDbDateStr();
	sal.DOCUMENT_TYPE=docType;
	sal.DOCUMENT_EXT = docExt;
	
	var s=txDate;
	var y = (''+ s.getFullYear()), m=(''+(s.getMonth()+1)).lpad("0",2), d=(''+s.getDate()).length==2?(''+s.getDate()):(''+s.getDate()).lpad("0",2);
		
	st.COMPANY = $.Ctx.ComCode;
    st.OPERATION = $.Ctx.Op;
    st.SUB_OPERATION = $.Ctx.SubOp;
    st.BUSINESS_UNIT = $.Ctx.Bu;
	st.DOC_TYPE = docType;
	st.DOC_NUMBER = y+m+d;
	st.EXT_NUMBER = docExt;
	
	var paramCmd = [sal.deleteCommand($.Ctx.DbConn), st.deleteCommand($.Ctx.DbConn)];
	var sb = new S1_ST_STOCK_BALANCE();
	sb.WAREHOUSE_CODE = farmOrg;
	sb.PRODUCT_CODE = prdCod;
	sb.QUANTITY = Number(qty)*(1);
	sb.WEIGHT = Number(wgh)*(1);
	$.FarmCtx.SetStockBalance(sb, paramCmd, function(){
		
		var trn = new DbTran($.Ctx.DbConn);
		trn.executeNonQuery(paramCmd, function(){
			if (typeof(SuccessCB)=="function")
				SuccessCB(true);
		}, function(errors){
			SuccessCB(false);
			console.log(errors);
		});
	});
}

function FindGd2FRMasType(gdtype, gdCode, SuccessCB){
	var cmd = $.Ctx.DbConn.createSelectCommand();
	cmd.sqlText = "SELECT CONDITION_01 AS DEVICE FROM HH_GD2_FR_MAS_TYPE_FARM ";
	cmd.sqlText += " WHERE GD_TYPE=? AND GD_CODE=? "
	cmd.parameters.push(gdtype);
	cmd.parameters.push(gdCode);
	cmd.executeReader(function (t, res) {
		if (res.rows.length > 0) {
			var ret = '';
				ret= res.rows.item(0).DEVICE;
			if (typeof SuccessCB == 'function' ) SuccessCB(ret);
		}else{
			if (typeof SuccessCB == 'function' ) SuccessCB(null);
		}
	},function(error){console.log(error)});
}

