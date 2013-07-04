var clickAlias = "click";
var docTypeMat = $.Ctx.GetPageParam('sales_mat_list', 'param');
var DEF_STK_LOC = "FARM", DEF_ENTRY_TYP = "1";
var PM_STK_TYPE_KEY = "product_stock_type",
	PM_DOC_TYPE_KEY = "document_type",
	PM_STK_LOC_KEY = "stock_location",
	PM_STK_CAL_TYPE_KEY = "cal_type",
	PM_TRAN_TYPE_KEY = "transaction_type",
	PM_TRAN_COD_KEY = "transaction_code";

$("#sales_mat_trans").bind("pageinit", function (event) {	
	var pParam  = $.Ctx.GetPageParam('sales_mat_list', 'param');
	try{
		$("#sales_mat_trans #captionHeader").text($.Ctx.Lcl('sales_mat_trans', pParam['captionHeader'], 'Sale Material'));
	}catch(e){
		$("#sales_mat_trans #captionHeader").text($.Ctx.Lcl('sales_mat_trans', 'captionHeader', 'Sale Material'));
	}
   
	$('#sales_mat_trans #btnSave').bind(clickAlias, function(){
		SavePurTrans(function (ret){
			if (ret==true){
				$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'MsgSaveComplete', 'Save Completed.'));
				if ($.Ctx.GetPageParam('sales_mat_trans', 'Mode')=="Create")
					ClearAfterSave();	
			}
		});
		return false;
	});
	
	$('#sales_mat_trans #lpCustomer').bind(clickAlias, function(){
		$.Ctx.SetPageParam('sales_mat_trans', 'ScrollingTo', $(window).scrollTop());
		SearchCustomerPig(function(cust){
			if (cust!==null){
				var p = new LookupParam();
				p.title = $.Ctx.Lcl('sales_mat_trans', 'MsgCustomer', 'Customer');
				p.calledPage = 'sales_mat_trans';
				p.calledResult = 'selectedCustomer';
				p.codeField = 'CUSTOMER_CODE';
				p.nameField = 'CUSTOMER_NAME';
				p.showCode = true;
				p.dataSource = cust;
				
				$.Ctx.SetPageParam('lookup', 'param', p);
				$.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
			}else{
				$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgCustomerNoFod', 'Customer not found.'));
			}
		});
	}); 
	
	$('#sales_mat_trans #lpProduct').bind(clickAlias,function(){
		var model = $.Ctx.GetPageParam('sales_mat_trans', 'Data');
		if (model==null || model.FARM_ORG==null) {
			$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'MsgFarmReq', 'Farm Org is Require.'));
			return false;
		}
		
		$.Ctx.SetPageParam('sales_mat_trans', 'ScrollingTo',  $(window).scrollTop());
		var pParam = $.Ctx.GetPageParam('sales_mat_list','param');
		var stkType = null;
		try{	//{"STK_TYPE":"10"}
			stkType = pParam[PM_STK_TYPE_KEY];
		}catch(e){//Set Default
			stkType = "10";
		}
		var stkT = stkType.split('|');
		
		var p = new LookupParam();
		p.calledPage = 'sales_mat_trans';
		p.calledResult = 'ProductSelected';
		$.Ctx.SetPageParam('lookup_mat_stock', 'param', p);
		$.Ctx.SetPageParam('lookup_mat_stock', 'farmOrg', model.FARM_ORG);
		$.Ctx.SetPageParam('lookup_mat_stock', 'stkType', stkT);
		$.Ctx.NavigatePage('lookup_mat_stock', null, { transition:'slide'}, false);
	});
	
	$('#sales_mat_trans #lpFarmOrg').bind(clickAlias,function(){
		$.Ctx.SetPageParam('sales_mat_trans', 'ScrollingTo',  $(window).scrollTop());
		var pParam = $.Ctx.GetPageParam('sales_mat_list','param');
		var stkLoc = null;
		try{	
			stkLoc = pParam[PM_STK_LOC_KEY];
		}catch(e){//Set Default
			stkLoc = DEF_STK_LOC;
		}
		//SearchFarmOrg(stkLoc, function (orgs){
		//	if (orgs!==null){
		//		var p = new LookupParam();
		//		p.title =  stkLoc=='FARM'? $.Ctx.Lcl('sales_mat_trans','MsgFarmMng','Farm Manage') : $.Ctx.Lcl('sales_mat_trans', 'MsgFarmCnt', 'Farm Center');
		//		p.calledPage = 'sales_mat_trans';
		//		p.calledResult = 'selectedFarmOrg';
		//		p.codeField = 'CODE';
		//		p.nameField = 'NAME';
		//		p.showCode = true;
		//		p.dataSource = orgs;
				
		//		$.Ctx.SetPageParam('lookup', 'param', p);
		//		$.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
		//	}else{
		//		$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgFarmOrgNoFod', 'Farm org not found.'));
		//	}
	    //});

		$.FarmCtx.SearchFarmOrgUsingMapMobile( function (orgs) {
		    if (orgs !== null) {
		        var p = new LookupParam();
		        p.title = stkLoc == 'FARM' ? $.Ctx.Lcl('sales_mat_trans', 'MsgFarmMng', 'Farm Manage') : $.Ctx.Lcl('sales_mat_trans', 'MsgFarmCnt', 'Farm Center');
		        p.calledPage = 'sales_mat_trans';
		        p.calledResult = 'selectedFarmOrg';
		        p.codeField = 'CODE';
		        p.nameField = 'NAME';
		        p.showCode = true;
		        p.dataSource = orgs;

		        $.Ctx.SetPageParam('lookup', 'param', p);
		        $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
		    } else {
		        $.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgFarmOrgNoFod', 'Farm org not found.'));
		    }
		});
	});
	
	$('#sales_mat_trans #lpEntryType').bind(clickAlias,function(){
		$.Ctx.SetPageParam('sales_mat_trans', 'ScrollingTo',  $(window).scrollTop());
		FindGd2FRMasTypeTranSal('ET', null, function (gds){
			if (gds!==null){
				var p = new LookupParam();
				p.title =  $.Ctx.Lcl('sales_mat_trans','MsgEntryType','Entry Type');
				p.calledPage = 'sales_mat_trans';
				p.calledResult = 'selectedEntryType';
				p.codeField = 'CODE';
				p.nameField = 'NAME';
				p.showCode = true;
				p.dataSource = gds;
				
				$.Ctx.SetPageParam('lookup', 'param', p);
				$.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
			}else{
				$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgEntypeNoFod', 'Entry type not found.'));
			}
		});
	});
	
	$('#sales_mat_trans #btnBack').bind('click',function(){
		//Check Dirty
		var dirty = false;
		var mode = $.Ctx.GetPageParam('sales_mat_trans', 'Mode');
		var model = $.Ctx.GetPageParam('sales_mat_trans', 'Data');
		if (mode=='Create' && model!==null && Object.keys(model).length>0){
			dirty=true;
		}
		var isExit=true;
		/*if (dirty==true){
			isExit = confirm($.Ctx.Lcl('sales_mat_trans', 'msgConfirmExit', 'Data is Dirty, Exit?'));
		}else{
			isExit=true;
		}*/
		if (isExit==true){
			$.Ctx.NavigatePage($.Ctx.GetPageParam('sales_mat_trans', 'Previous'), 
			null, 
			{ transition: 'slide', reverse: true });
		}
		return false;
	});

	$('#sales_mat_trans input[type="number"]').focusout(function() {
		var qtyStr=$(this).val();
		//$(this).val(Math.floor(Number(qtyStr)));
		if (Number($(this).val())<=0){
			$(this).val('');
		}
	});
	$('#sales_mat_trans #txtRefDoc').focusout(function() {
		var model = $.Ctx.GetPageParam('sales_mat_trans', 'Data');
		if (model==null) return false;
		model.REF_DOCUMENT_NO = $.trim($(this).val());
	});
	
	$('#sales_mat_trans #txtqty').focusout(function() {
		var qtyStr=$(this).val();
		$(this).val(Math.floor(Number(qtyStr)));
		if (Number($(this).val())<=0){
			$(this).val('');
		}
		var model = $.Ctx.GetPageParam('sales_mat_trans', 'Data');
		if (model==null || typeof model.STOCK_KEEPING_UNIT=='undefined'||model.STOCK_KEEPING_UNIT==null) return false;
		FocusoutCal();
	});
	$('#sales_mat_trans #txtUnit').focusout(function() {
		var model = $.Ctx.GetPageParam('sales_mat_trans', 'Data');
		if (model==null || typeof model.STOCK_KEEPING_UNIT=='undefined'||model.STOCK_KEEPING_UNIT==null) return false;
		FocusoutCal();
	});
	$('#sales_mat_trans #txtWeight').focusout(function() {
		var model = $.Ctx.GetPageParam('sales_mat_trans', 'Data');
		if (model==null || typeof model.STOCK_KEEPING_UNIT=='undefined'||model.STOCK_KEEPING_UNIT==null) return false;
		FocusoutCal();
	});
	$('#sales_mat_trans #total-amt').focusout(function() {
		var model = $.Ctx.GetPageParam('sales_mat_trans', 'Data');
		if (model==null || typeof model.ENTRY_TYPE=='undefined' ) return false;
		if (model.ENTRY_TYPE=='2'){
			model.NET_AMT=0;
			model.UNIT=0;
			$(this).val('');
			$('#sales_mat_trans #txtUnit').val('');
		}
		//FocusoutCal();
	});
});

function FocusoutCal(){
	var model = $.Ctx.GetPageParam('sales_mat_trans', 'Data');
	model.QTY = Number($('#sales_mat_trans #txtqty').val());
	model.UNIT = Number($('#sales_mat_trans #txtUnit').val());
	model.NET_AMT = Number($('#sales_mat_trans #total-amt').val());
	model.WGH = Number($('#sales_mat_trans #txtWeight').val());
	
	var unitPackStr = (typeof model.UNIT_PACK=='undefined'||model.UNIT_PACK==null?1:model.UNIT_PACK);
	model.UNIT = Number(model.UNIT.toFixed(4));
	if (model.QTY>0 && Number(unitPackStr)>0){
		if(model.STOCK_KEEPING_UNIT == "Q"){
			model.WGH = model.QTY * Number(unitPackStr);
		}else{
			model.QTY=0;
		}
	}
	if(model.STOCK_KEEPING_UNIT == "Q"){
		model.NET_AMT = model.QTY * model.UNIT;
	}else{
		model.NET_AMT = model.WGH * model.UNIT;
	}
	if (model.ENTRY_TYPE=='1') {
		if(model.STOCK_KEEPING_UNIT == "Q"){
			model.NET_AMT = model.QTY * model.UNIT;
		}else{
			model.NET_AMT = model.WGH * model.UNIT;
		}
		model.NET_AMT = Number(model.NET_AMT.toFixed(2));
	}else if (model.ENTRY_TYPE=='2'){
		model.NET_AMT =0;
		model.UNIT=0;
	}
	Model2ControlSal();
}

$("#sales_mat_trans").bind("pagebeforehide", function (event,ui) {
	var model = $.Ctx.GetPageParam('sales_mat_trans', 'Data');
	if (model==null){
		model = {};
		$.Ctx.SetPageParam('sales_mat_trans', 'Data', model);
	}
	model.REF_DOCUMENT_NO = $('#sales_mat_trans #txtRefDoc').val();
	model.QTY = Number($('#sales_mat_trans #txtqty').val());
	model.WGH = Number($('#sales_mat_trans #txtWeight').val());
	model.UNIT=  Number($('#sales_mat_trans #txtUnit').val());
	model.NET_AMT = Number($('#sales_mat_trans #total-amt').val());
	
	model.LOT_NUMBER = $('#sales_mat_trans #txtLotNo').val();
});

$('#sales_mat_trans').bind("pagebeforecreate", function (e) {
    $.Util.RenderUiLang('sales_mat_trans');
    $.Ctx.RenderFooter('sales_mat_trans');
});

$("#sales_mat_trans").bind("pagebeforeshow", function (event,ui) {
	var pParam = $.Ctx.GetPageParam('sales_mat_list','param');
	try{
		docTypeMat = pParam[PM_DOC_TYPE_KEY];
	}catch(e){//Set Default
		docTypeMat = "DCTYP51";
	}
	var model = $.Ctx.GetPageParam('sales_mat_trans', 'Data');
	if (model==null){
		model = {};
		$.Ctx.SetPageParam('sales_mat_trans', 'Data', model);
	}
	
	var prevPage= (typeof ui.prevPage[0]=='undefined' ? "": ui.prevPage[0].id);
	if (prevPage.indexOf("lookup")>-1){//From Lookup		
		//====== customer =======
		var cusSel=$.Ctx.GetPageParam('sales_mat_trans', 'selectedCustomer');
		if (cusSel!==null) { 
			model.CUSTOMER_CODE = cusSel.CUSTOMER_CODE;
			model.CUSTOMER_NAME = cusSel.CUSTOMER_NAME;
		}
		
		//===== Farm Org ====
		var farmOrg=$.Ctx.GetPageParam('sales_mat_trans', 'selectedFarmOrg');
		if (farmOrg!==null) { 
			if (model.FARM_ORG!==farmOrg.CODE){//clear pRODUCT
				$.Ctx.SetPageParam('sales_mat_trans', 'ProductSelected',null);
				model.PRODUCT_CODE =null;
				model.PRODUCT_NAME = null;
				model.A_QTY = null;
				model.A_WGH = null;
				model.LOT_NUMBER = null;
				model.STOCK_KEEPING_UNIT = null;
				model.UNIT_PACK = null;
				model.PRODUCT_STOCK_TYPE = null;
			}
			model.FARM_ORG = farmOrg.CODE;
			model.FARM_ORG_NAME = farmOrg.NAME;
		}
		
		//====== PRODUCT =======
		var prodSel=$.Ctx.GetPageParam('sales_mat_trans', 'ProductSelected');
		if (prodSel!==null) { 
			model.PRODUCT_CODE = prodSel.PRODUCT_CODE;
			model.PRODUCT_NAME = prodSel.PRODUCT_NAME;
			//Make 
			//model.STOCK_KEEPING_UNIT = 'Q' ;
            model.STOCK_KEEPING_UNIT = prodSel.STOCK_KEEPING_UNIT;
			model.A_QTY = prodSel.QTY;
			model.A_WGH = prodSel.WGH;
			model.LOT_NUMBER = prodSel.LOT_NUMBER;
			//model.STOCK_KEEPING_UNIT = prodSel.STOCK_KEEPING_UNIT;
			model.UNIT_PACK = prodSel.UNIT_PACK;
			model.PRODUCT_STOCK_TYPE = prodSel.PRODUCT_STOCK_TYPE;
			if (model.STOCK_KEEPING_UNIT=="W"){
				model.QTY=0;
			}
		}
		
		//======= ENTRY_TYPE ======
		var et=$.Ctx.GetPageParam('sales_mat_trans', 'selectedEntryType');
		if (et!==null) {
			model.ENTRY_TYPE = et.CODE;
			model.ENTRY_TYPE_NAME = et.NAME;
			if (model.ENTRY_TYPE=='2') {
				model.NET_AMT = 0;
				model.UNIT = 0;
			}
		}
	}else{
		var mode = $.Ctx.GetPageParam('sales_mat_trans', 'Mode');
		if (mode!=='Create'){
			var key = $.Ctx.GetPageParam('sales_mat_trans', 'Key');
			FindSalesMat(key.FARM_ORG, key.TRANSACTION_DATE ,key.DOCUMENT_TYPE,key.DOCUMENT_EXT,function(ret){
			//console.log(ret);
				model.FARM_ORG = ret.FARM_ORG;
				model.FARM_ORG_NAME = ret.FARM_ORG_NAME;
				model.DOCUMENT_EXT = ret.DOCUMENT_EXT;
				model.TRANSACTION_DATE = ret.TRANSACTION_DATE;
				model.REF_DOCUMENT_NO = ret.REF_DOCUMENT_NO;
				model.CUSTOMER_CODE = ret.CUSTOMER_CODE;
				model.CUSTOMER_NAME = ret.CUSTOMER_NAME;
				model.PRODUCT_CODE = ret.PRODUCT_CODE;
				model.PRODUCT_NAME = ret.PRODUCT_NAME;
				model.STOCK_KEEPING_UNIT = ret.STOCK_KEEPING_UNIT;
				model.UNIT_PACK = ret.UNIT_PACK;
				model.PRODUCT_STOCK_TYPE = ret.PRODUCT_STOCK_TYPE;
				model.ENTRY_TYPE = ret.ENTRY_TYPE;
				model.ENTRY_TYPE_NAME = ret.ENTRY_TYPE_NAME;
				model.LOT_NUMBER = ret.LOT_NUMBER;
				model.QTY = ret.QTY;
				model.WGH = ret.WGH;
				model.O_QTY = ret.QTY;
				model.O_WGH = ret.WGH;
				model.UNIT = ret.UNIT;
				model.NET_AMT = ret.NET_AMT;
				//Find Stock
				$.FarmCtx.FindStockMatProductBalance(model.PRODUCT_STOCK_TYPE, model.FARM_ORG, model.PRODUCT_CODE, function(ret){
					if (! _.isEmpty(ret)){
						model.A_QTY = ret.QTY;
						model.A_WGH = ret.WGH;
					}
					Model2ControlSal();
				});
			});
		}else{//Mode Create =>Set Default
			var pParam = $.Ctx.GetPageParam('sales_mat_list','param');
			var stkLoc = null;
			try{	
				stkLoc = pParam[PM_STK_LOC_KEY];
			}catch(e){//Set Default
				stkLoc = DEF_STK_LOC;
			}
			//stkLoc = 'FARM';
			SearchFarmOrg(stkLoc ,function(orgs){
				if (orgs!==null && orgs.length>0){
					if (stkLoc.toUpperCase()=="CENTER"){
						model.FARM_ORG = orgs[0].CODE;
						model.FARM_ORG_NAME = orgs[0].NAME;
					}else{
						var x = _.where(orgs, {'CODE':$.Ctx.Warehouse});
						if (! _.isEmpty(x)){
							model.FARM_ORG = x[0].CODE;
							model.FARM_ORG_NAME = x[0].NAME;
						}
					}
				}
				FindGd2FRMasTypeTranSal('ET', DEF_ENTRY_TYP, function(ret){
					if (ret!==null && ret.length>0){
						model.ENTRY_TYPE = ret[0].CODE;
						model.ENTRY_TYPE_NAME = ret[0].NAME;
					}
					Model2ControlSal();
				});
			});
		}
	}
	console.log( $.Ctx.GetPageParam('sales_mat_trans', 'Data'));
});

$("#sales_mat_trans").bind("pageshow", function (event) {
	var mode = $.Ctx.GetPageParam('sales_mat_trans', 'Mode');
	if (mode=='Update'){
		//Disable key 
		$('#sales_mat_trans #lpFarmOrg').button('disable'); 
		$('#sales_mat_trans #lpCustomer').button('disable'); 
		$('#sales_mat_trans #lpProduct').button('disable'); 
		$('#sales_mat_trans #lpEntryType').button('disable'); 
		$('#sales_mat_trans #txtRefDoc').addClass('ui-disabled');
		$('#sales_mat_trans #txtLotNo').addClass('ui-disabled');
	}else if (mode=='Create'){
		$('#sales_mat_trans #lpFarmOrg').button('enable'); 
		$('#sales_mat_trans #lpCustomer').button('enable'); 
		$('#sales_mat_trans #lpProduct').button('enable'); 
		$('#sales_mat_trans #lpEntryType').button('enable'); 
		$('#sales_mat_trans #txtRefDoc').removeClass('ui-disabled');
		$('#sales_mat_trans #txtLotNo').removeClass('ui-disabled');
	}else{
		$('#sales_mat_trans #lpFarmOrg').button('disable'); 
		$('#sales_mat_trans #btnSave').hide();
	}
	//var model = $.Ctx.GetPageParam('sales_mat_trans', 'Data');

	Model2ControlSal();
	if ($.Ctx.GetPageParam('sales_mat_trans', 'ScrollingTo') != null ){
		//scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
        $('html, body').animate({
            scrollTop: $.Ctx.GetPageParam('sales_mat_trans', 'ScrollingTo')
        }, 0);
    }
});

function ClearAfterSave(){
	var model = $.Ctx.GetPageParam('sales_mat_trans', 'Data');
	if (model!==null){
		model.QTY = model.WGH = model.UNIT = model.NET_AMT = model.A_QTY = model.A_WGH = 0;

		model.PRODUCT_CODE = null;
		model.PRODUCT_NAME = null;
		model.STOCK_KEEPING_UNIT = null;
		model.UNIT_PACK = null;
		$.Ctx.SetPageParam('sales_mat_trans', 'ProductSelected',null);
		Model2ControlSal();
	}
}

function Model2ControlSal(){
	var model = $.Ctx.GetPageParam('sales_mat_trans', 'Data');
	if (model !== null){
		if (model.CUSTOMER_CODE==null)
			$('#sales_mat_trans #lpCustomer').text($.Ctx.Lcl('sales_mat_trans','msgSelect','Select'));
		else
			$('#sales_mat_trans #lpCustomer').text(model.CUSTOMER_NAME);
		$('#sales_mat_trans #lpCustomer').button('refresh');
		
		if (model.PRODUCT_CODE==null)
			$('#sales_mat_trans #lpProduct').text($.Ctx.Lcl('sales_mat_trans','msgSelect','Select'));
		else
			$('#sales_mat_trans #lpProduct').text(model.PRODUCT_NAME + ' (' + model.STOCK_KEEPING_UNIT + ')');
		$('#sales_mat_trans #lpProduct').button('refresh');
		
		if (model.FARM_ORG==null){
			$('#sales_mat_trans #lpFarmOrg').text($.Ctx.Lcl('sales_mat_trans','msgSelect','Select'));
		}else
			$('#sales_mat_trans #lpFarmOrg').text(model.FARM_ORG + ' ' + model.FARM_ORG_NAME); 
		$('#sales_mat_trans #lpFarmOrg').button('refresh');
	
		if (model.ENTRY_TYPE==null)
			$('#sales_mat_trans #lpEntryType').text($.Ctx.Lcl('sales_mat_trans','msgSelect','Select'));
		else
			$('#sales_mat_trans #lpEntryType').text(model.ENTRY_TYPE_NAME);
		$('#sales_mat_trans #lpEntryType').button('refresh');
		
		//======== Ref Doc ======
		if (typeof model.REF_DOCUMENT_NO !=='undefined')
			$('#sales_mat_trans #txtRefDoc').val(model.REF_DOCUMENT_NO);
		else
			$('#sales_mat_trans #txtRefDoc').val('');
		
		$('#sales_mat_trans #txtqty').val(model.QTY==0?'':model.QTY);
		$('#sales_mat_trans #txtWeight').val(model.WGH==0?'':model.WGH);	
		$('#sales_mat_trans #txtUnit').val(model.UNIT==0?'':model.UNIT);
		$('#sales_mat_trans #total-amt').val(model.NET_AMT==0?'':model.NET_AMT);
		
		$('#sales_mat_trans #lblLotTxt').html(model.LOT_NUMBER==undefined?'':model.LOT_NUMBER);
		$('#sales_mat_trans #lblQtyTxt').html(model.A_QTY==undefined?'': accounting.formatNumber(model.A_QTY,0,","));
		$('#sales_mat_trans #lblWghTxt').html(model.A_WGH==undefined?'': accounting.formatNumber(model.A_WGH,2,","));
//		alert(model.STOCK_KEEPING_UNIT)
		if (model.STOCK_KEEPING_UNIT=='W'){
			$('#sales_mat_trans #txtqty').addClass('ui-disabled');
			$('#sales_mat_trans #txtqty').attr('readonly','true');
			
			$('#sales_mat_trans #txtWeight').removeClass('ui-disabled');
			$('#sales_mat_trans #txtWeight').removeAttr('readonly');
		}else if (model.STOCK_KEEPING_UNIT=='Q'){//====== Q =========
			$('#sales_mat_trans #txtqty').removeClass('ui-disabled');
			$('#sales_mat_trans #txtqty').removeAttr('readonly');
			
			$('#sales_mat_trans #txtWeight').addClass('ui-disabled');
			$('#sales_mat_trans #txtWeight').attr('readonly','true');
		}else{
			$('#sales_mat_trans #txtqty').removeClass('ui-disabled');
			$('#sales_mat_trans #txtqty').removeAttr('readonly');
			$('#sales_mat_trans #txtWeight').removeClass('ui-disabled');
			$('#sales_mat_trans #txtWeight').removeAttr('readonly');
		}
		if (model.ENTRY_TYPE=='2'){
			$('#sales_mat_trans #txtUnit').addClass('ui-disabled');
			$('#sales_mat_trans #total-amt').addClass('ui-disabled');
			$('#sales_mat_trans #txtUnit').attr('readonly','true');
			$('#sales_mat_trans #total-amt').attr('readonly','true');
		}else{
			$('#sales_mat_trans #txtUnit').removeClass('ui-disabled');
			$('#sales_mat_trans #total-amt').removeClass('ui-disabled');
			$('#sales_mat_trans #txtUnit').removeAttr('readonly');
			$('#sales_mat_trans #total-amt').removeAttr('readonly');
		}
	}   
}

function SavePurTrans(SuccessCB){
	var qty = Number($('#sales_mat_trans #txtqty').val()), 
		wgh = Number($('#sales_mat_trans #txtWeight').val()),
		unit = Number($('#sales_mat_trans #txtUnit').val()),
		amt = Number($('#sales_mat_trans #total-amt').val());
		
	var model = $.Ctx.GetPageParam('sales_mat_trans', 'Data');
	
	model.REF_DOCUMENT_NO = $.trim($('#sales_mat_trans #txtRefDoc').val());
	//model.LOT_NUMBER = $.trim($('#sales_mat_trans #txtLotNo').val());

	if (_.isEmpty(model.CUSTOMER_CODE)){
		$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgReqCust', 'Customer is Required.'));
		SuccessCB(false); return false;
	}
	if (_.isEmpty(model.PRODUCT_CODE)){
		$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgReqProduct', 'Product is Required.'));
		SuccessCB(false); return false;
	}
	/*if (model.LOT_NUMBER==null){
		$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgReqLotNo', 'Lot number is Required.'));
		SuccessCB(false); return false;
	}*/
	if (_.isEmpty(model.REF_DOCUMENT_NO)){
		$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgReqRefDoc', 'Ref Doc is Required.'));
		SuccessCB(false); return false;
	}
	if (_.isEmpty(model.FARM_ORG)){
		$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgReqFarmOrg', 'Farm Org is Required.'));
		SuccessCB(false); return false;
	}
	if (_.isEmpty(model.ENTRY_TYPE)){
		$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgReqEntryType', 'Entry type is Required.'));
		SuccessCB(false); return false;
	}
	if (model.STOCK_KEEPING_UNIT=="Q"){
		if (qty<=0){
			$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgReqQty', 'Quantity is Required.'));
			SuccessCB(false); return false;
		}
	}
	if (wgh==0 ){
        if(model.STOCK_KEEPING_UNIT !='Q'  && model.UNIT_PACK != 0){
		$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgReqWgh', 'Weight is Required.'));
		SuccessCB(false); return false;
        }
	}
	if (model.ENTRY_TYPE=='1'){
		if (unit==0){
			$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgReqUnit', 'Unit is Required.'));
			SuccessCB(false); return false;
		}
		if (amt==0){
			$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgReqAmt', 'Amount is Required.'));
			SuccessCB(false); return false;
		}
	}
	var mode = $.Ctx.GetPageParam('sales_mat_trans', 'Mode');
	
	var curQty = mode=='Update'?model.O_QTY:0,
		curWgh = mode=='Update'?model.O_WGH:0;
		
	if (model.STOCK_KEEPING_UNIT=="Q"){
		if ((model.A_QTY+curQty) < model.QTY ){
			$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgAvQty', 'Quantity remain ' + (model.A_QTY+curQty) ));
			SuccessCB(false); return false;
		}
	}else if (model.STOCK_KEEPING_UNIT=="W"){
		if ((model.A_WGH+curWgh) < model.WGH){
			$.Ctx.MsgBox($.Ctx.Lcl('sales_mat_trans', 'msgAvWgh', 'Weight remain ' + (model.A_WGH+curWgh) ));
			SuccessCB(false); return false;
		}
	}
	
	if (mode=='Update'){
		SaveWithDocExt(model.DOCUMENT_EXT);
	}else{//Add
		GetDocExtSale(SaveWithDocExt);
	}

	function SaveWithDocExt(ext){
		var pParam = $.Ctx.GetPageParam('sales_mat_list','param');
		var caltyp = -1, trantyp = null,tranCod=null, stkType = null ;
		try{	
			caltyp = Number(pParam[PM_STK_CAL_TYPE_KEY]);
			trantyp = pParam[PM_TRAN_TYPE_KEY];
			tranCod = pParam[PM_TRAN_COD_KEY];
			stkType = pParam[PM_STK_TYPE_KEY];
		}catch(e){//Set Default
			caltyp = -1;
			trantyp = '2';
			tranCod = '00';
			stkType = "10";
		}
		var paramCmd = [];
		var dataM = $.Ctx.GetPageParam('sales_mat_trans', 'Data');
		var qty = Number($('#sales_mat_trans #txtqty').val()), 
		wgh = Number($('#sales_mat_trans #txtWeight').val()),
		unit = Number($('#sales_mat_trans #txtUnit').val()),
		amt = Number($('#sales_mat_trans #total-amt').val());
	
		var	sale = new HH_FR_MS_MATERIAL_SALE();
		sale.ORG_CODE = $.Ctx.SubOp;
		sale.FARM_ORG = dataM.FARM_ORG;
		sale.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
	    //change to Doc Type from Page Parameter
        sale.DOCUMENT_TYPE = docTypeMat;
		sale.DOCUMENT_EXT = ext;
		sale.CUSTOMER_CODE = dataM.CUSTOMER_CODE;
		sale.REF_DOCUMENT_NO = dataM.REF_DOCUMENT_NO;
		sale.PRODUCT_CODE = dataM.PRODUCT_CODE;
		sale.PRODUCT_SPEC = '0000-0000-0000';
		sale.LOT_NUMBER = _.isEmpty(dataM.LOT_NUMBER)==true?'00':dataM.LOT_NUMBER;
		sale.PRODUCTION_DATE = dataM.PRODUCTION_DATE==undefined?null:dataM.PRODUCTION_DATE;
		sale.EXPIRE_DATE = dataM.EXPIRE_DATE==undefined?null:dataM.EXPIRE_DATE;
		sale.QTY = qty;
		sale.WGH = wgh;
		sale.UNIT = unit;
		sale.NET_AMT = amt;
		sale.STOCK_TYPE = stkType;
		sale.ENTRY_TYPE = dataM.ENTRY_TYPE;
		sale.NUMBER_OF_SENDING_DATA = 0;
		sale.OWNER = $.Ctx.UserId;
		sale.CREATE_DATE = (new XDate()).toDbDateStr();
		sale.LAST_UPDATE_DATE = (mode=='Update'? (new XDate()).toDbDateStr() : null);
		sale.FUNCTION = (mode=='Update'?'C':'A');

		var st = new S1_ST_STOCK_TRN();
		st.COMPANY = $.Ctx.ComCode;
		st.OPERATION = $.Ctx.Op;
		st.SUB_OPERATION =  $.Ctx.SubOp;
		st.BUSINESS_UNIT = $.Ctx.Bu;
		st.DOCUMENT_DATE = sale.TRANSACTION_DATE;
		st.DOC_TYPE = sale.DOCUMENT_TYPE.indexOf('DCTYP')==-1 ? 'DCTYP' + sale.DOCUMENT_TYPE : sale.DOCUMENT_TYPE ;
		var s=$.Ctx.GetBusinessDate();
		var y = (''+ s.getFullYear()), m=(''+(s.getMonth()+1)).lpad("0",2), d = (''+s.getDate()).length==2?(''+s.getDate()):(''+s.getDate()).lpad("0",2);
		st.DOC_NUMBER =  y+m+d;
		st.EXT_NUMBER = sale.DOCUMENT_EXT;
		//st.REF_EXT_NUMBER = 0;
		st.TRN_TYPE = trantyp;
		st.TRN_CODE = tranCod;
		st.CAL_TYPE = caltyp;
		st.UNIT_LEVEL = sale.FARM_ORG;
		st.CV_CODE = sale.CUSTOMER_CODE;
		st.ENTRY_TYPE = sale.ENTRY_TYPE;
		st.PRODUCT_STOCK_TYPE = dataM.PRODUCT_STOCK_TYPE;
		st.PRODUCT_CODE = sale.PRODUCT_CODE;
		st.PRODUCT_SPEC = sale.PRODUCT_SPEC;
		st.LOT_NUMBER = sale.LOT_NUMBER;
		//st.TAX_RATE = 0;
		st.STOCK_KEEPING_UNIT = dataM.STOCK_KEEPING_UNIT;
		st.QUANTITY = qty;
		//st.FREE_QTY = st.FEMALE_QTY = st.MALE_QTY= 0;
		st.WEIGHT = wgh;
		//st.UM_WEIGHT =0;
		//st.FREE_WGH=0;
		st.UNIT_PRICE=unit;
		st.AMOUNT=amt;
		//st.UNIT_COST=0;
		//st.COST=0;
		//st.STD_SALES_UNIT_PRICE=0;
		//st.STD_COST_UNIT_PRICE=0;
		//st.PRINT_NO = 0;
		//st.STATUS_DATE = null;
		st.OWNER=sale.OWNER;
		st.CREATE_DATE = sale.CREATE_DATE;
		st.FUNCTION=sale.FUNCTION;
		//st.OLD_RETAIL_PRICE=0;
		//st.NEW_RETAIL_PRICE=0;
		//st.PRICE_CHANGE_QTY=0;
		//st.RETAIL_IN_VAT=0;
		//st.RETAIL_EX_VAT=0;
		//st.RECEIVED_DATE=0;
		st.WAREHOUSE_CODE=$.Ctx.Warehouse;
		st.NUMBER_OF_SENDING_DATA=0;
		//st.SetDefaultNA();

		var cmd,cmd2;
		if (mode=='Update'){
			cmd = sale.updateCommand($.Ctx.DbConn);
			cmd2 = st.updateCommand($.Ctx.DbConn);
		}else{
			 cmd = sale.insertCommand($.Ctx.DbConn);
			 cmd2 = st.insertCommand($.Ctx.DbConn);
		}
		paramCmd.push(cmd);
		paramCmd.push(cmd2);
		
		var oqty = owgh = 0;
		if (mode=='Update'){
			var key = $.Ctx.GetPageParam('sales_mat_trans', 'Key');
			oqty = Number(key.QTY);
			owgh = Number(key.WGH);
		}
		var sb = new S1_ST_STOCK_BALANCE();
		sb.WAREHOUSE_CODE = sale.FARM_ORG;
		sb.PRODUCT_CODE = sale.PRODUCT_CODE;
		sb.QUANTITY = (qty *caltyp) + (oqty * -1 * caltyp);
		sb.WEIGHT = (wgh *caltyp) + (owgh * -1 * caltyp);

		$.FarmCtx.SetStockBalance(sb, paramCmd, function(){
	
			var trn = new DbTran($.Ctx.DbConn);
			trn.executeNonQuery(paramCmd, function(){
				if (typeof(SuccessCB)=="function")
					SuccessCB(true);
			}, function(errors){
				SuccessCB(false);
				console.log(errors);
			});
			
		},function(err){
			console.log(err);
		});
	}
}

function SearchCustomerPig(SuccessCB){
	var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT CUSTOMER_CODE, CUSTOMER_NAME,BUSINESS_UNIT FROM HH_FR_CUSTOMER_PIG WHERE BUSINESS_UNIT=? AND SUB_OPERATION =? ";
	cmd.parameters.push($.Ctx.Bu);
    cmd.parameters.push($.Ctx.SubOp);
    cmd.executeReader(function (tx, res) {
		var dSrc = null;
        if (res.rows.length !== 0) {
			dSrc=[];
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_FR_CUSTOMER_PIG();
                m.retrieveRdr(res.rows.item(i));
				if(m.CUSTOMER_CODE!==null && m.CUSTOMER_NAME!==null)  dSrc.push(m);
            }
        }
		SuccessCB(dSrc);
    }, function (err) {
        console.log(err.message);
    });
}

function SearchFarmOrg(stkLoc, SuccessCB){	  
	var cmd = $.Ctx.DbConn.createSelectCommand();
	var nameField = "ifnull(NAME_LOC, NAME_ENG)";
	if ($.Ctx.Lang == "en-US") { 
		nameField = "ifnull(NAME_ENG, NAME_LOC)";
	}
	cmd.sqlText = "SELECT FARM_ORG AS CODE,{0} AS NAME FROM FR_FARM_ORG WHERE 1=1 ".format([nameField]);
	cmd.sqlText += " AND ORG_CODE=? ";
//	if (stkLoc.toUpperCase()=="CENTER")
//		cmd.sqlText += " AND PROJECT='0000' ";
//	else
//		cmd.sqlText += " AND MANAGEMENT_FLG='M'";
	cmd.sqlText += " ORDER BY FARM_ORG ";
	
	cmd.parameters.push($.Ctx.SubOp);
	//cmd.parameters.push($.Ctx.Warehouse);
	var ret = [];
	cmd.executeReader(function (t, res) {
		if (res.rows.length > 0) {
			for (var i=0;i<res.rows.length;i++){
				ret.push({'CODE':res.rows.item(i).CODE, 'NAME':res.rows.item(i).NAME});
			}
			if (typeof SuccessCB=='function') SuccessCB(ret);
		}else{
			if (typeof SuccessCB=='function') SuccessCB(null);
		}
	});
}

function GetDocExtSale(SuccessCB){
	var cmd = $.Ctx.DbConn.createSelectCommand();
	cmd.sqlText = "SELECT MAX(DOCUMENT_EXT) AS RUN_EXT FROM HH_FR_MS_MATERIAL_SALE ";
	cmd.sqlText += "WHERE ORG_CODE=? AND TRANSACTION_DATE=? AND DOCUMENT_TYPE=? ";
	var ret=[];
	cmd.parameters.push($.Ctx.SubOp);
	cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
	cmd.parameters.push(docTypeMat);
	cmd.executeReader(function (t, res) {
		if (res.rows.length > 0) {
			if (typeof SuccessCB=='function') SuccessCB(res.rows.item(0).RUN_EXT==null?1:res.rows.item(0).RUN_EXT+1);
		}else{
			if (typeof SuccessCB=='function') SuccessCB(1);
		}
	},function(err){
		console.log(err);
	});
}

function FindSalesMat( farmOrg, txDateStr, docType, docExt, SuccessCB){
	var cmd = $.Ctx.DbConn.createSelectCommand();
	var nPro='',nLoc='',bName='';
	if ($.Ctx.Lang=="en-US"){
		//nPro = "ifnull(P.DESC_ENG, P.DESC_LOC)";
		bName = "ifnull(G.DESC_ENG, G.DESC_LOC)";
		nLoc = "ifnull(F.NAME_ENG, F.NAME_LOC)";
	}else{
		//nPro = "ifnull(P.DESC_LOC, P.DESC_ENG)";
		bName = "ifnull(G.DESC_LOC, G.DESC_ENG)";
		nLoc = "ifnull(F.NAME_LOC, F.NAME_ENG)";
	}
	cmd.sqlText = "SELECT V.CUSTOMER_CODE, V.CUSTOMER_NAME, P.PRODUCT_CODE, P.PRODUCT_NAME,P.STOCK_KEEPING_UNIT,P.UNIT_PACK,P.PRODUCT_STOCK_TYPE, ";
	cmd.sqlText += "S.FARM_ORG ,{0} AS FARM_ORG_NAME, ".format([nLoc]);
	cmd.sqlText += "S.REF_DOCUMENT_NO, S.LOT_NUMBER, S.QTY, S.WGH, S.NET_AMT, S.NUMBER_OF_SENDING_DATA, ";
	cmd.sqlText += "S.ENTRY_TYPE , {0} AS ENTRY_TYPE_NAME, S.UNIT ".format([bName]);
	cmd.sqlText += "FROM HH_FR_MS_MATERIAL_SALE S ";
	cmd.sqlText += "JOIN HH_FR_CUSTOMER_PIG V ON (S.ORG_CODE=V.SUB_OPERATION AND S.CUSTOMER_CODE=V.CUSTOMER_CODE) ";
	cmd.sqlText += "JOIN HH_PRODUCT_BU P ON S.PRODUCT_CODE=P.PRODUCT_CODE ";
	cmd.sqlText += "JOIN FR_FARM_ORG F ON (S.ORG_CODE=F.ORG_CODE AND S.FARM_ORG=F.FARM_ORG) ";
	cmd.sqlText += "JOIN HH_GD2_FR_MAS_TYPE_FARM G ON (G.GD_TYPE='ET' AND G.GD_CODE=S.ENTRY_TYPE)";
	cmd.sqlText += "WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND S.TRANSACTION_DATE=? ";
	cmd.sqlText += " AND S.DOCUMENT_TYPE=? AND S.DOCUMENT_EXT=? ";
	cmd.parameters.push($.Ctx.SubOp);
	cmd.parameters.push(farmOrg);
	cmd.parameters.push(txDateStr);
	cmd.parameters.push(docType);
	cmd.parameters.push(docExt);
	var ret={};
	cmd.executeReader(function (t, res) {
		if (res.rows.length > 0) {
			ret.ORG_CODE = $.Ctx.SubOp;
			ret.FARM_ORG = res.rows.item(0).FARM_ORG;
			ret.FARM_ORG_NAME = res.rows.item(0).FARM_ORG_NAME;
			ret.TRANSACTION_DATE = parseDbDateStr(txDateStr);
			ret.DOCUMENT_TYPE=docType;
			ret.DOCUMENT_EXT = docExt;
			ret.REF_DOCUMENT_NO = res.rows.item(0).REF_DOCUMENT_NO;
			ret.CUSTOMER_CODE = res.rows.item(0).CUSTOMER_CODE;
			ret.CUSTOMER_NAME = res.rows.item(0).CUSTOMER_NAME;
			ret.PRODUCT_CODE = res.rows.item(0).PRODUCT_CODE;
			ret.PRODUCT_NAME = res.rows.item(0).PRODUCT_NAME;
			ret.STOCK_KEEPING_UNIT = res.rows.item(0).STOCK_KEEPING_UNIT;
			ret.UNIT_PACK = res.rows.item(0).UNIT_PACK;
			ret.PRODUCT_STOCK_TYPE = res.rows.item(0).PRODUCT_STOCK_TYPE;
			ret.ENTRY_TYPE = res.rows.item(0).ENTRY_TYPE;
			ret.ENTRY_TYPE_NAME = res.rows.item(0).ENTRY_TYPE_NAME;
			ret.LOT_NUMBER = res.rows.item(0).LOT_NUMBER;
			ret.QTY = res.rows.item(0).QTY;
			ret.WGH = res.rows.item(0).WGH;
			ret.UNIT = res.rows.item(0).UNIT;
			ret.NET_AMT = res.rows.item(0).NET_AMT;
			ret.NUMBER_OF_SENDING_DATA = res.rows.item(0).NUMBER_OF_SENDING_DATA;
		
			if (typeof SuccessCB=='function') SuccessCB(ret);
		}else{
			if (typeof SuccessCB=='function') SuccessCB(null);
		}
	},function(error){
		console.log(error);
	});
}

function FindGd2FRMasTypeTranSal(gdtype, gdCode, SuccessCB){
	var cmd = $.Ctx.DbConn.createSelectCommand();
	var nameField='';
	if ($.Ctx.Lang=="en-US")
		nameField = "ifnull(DESC_ENG, DESC_LOC)";
	else
		nameField = "ifnull(DESC_LOC, DESC_ENG)";
		
	cmd.sqlText = "SELECT GD_CODE AS CODE, {0} AS NAME FROM HH_GD2_FR_MAS_TYPE_FARM ".format([nameField]);
	cmd.sqlText += " WHERE GD_TYPE=? ";
	if (gdCode!==null) cmd.sqlText += " AND GD_CODE=? "
	cmd.parameters.push(gdtype);
	if (gdCode!==null) cmd.parameters.push(gdCode);
	cmd.sqlText +=" ORDER BY GD_CODE ";
	var ret = [];
	cmd.executeReader(function (t, res) {
		if (res.rows.length > 0) {
			for (var i = 0; i < res.rows.length; i++) {
				ret.push({'CODE':res.rows.item(i).CODE, 'NAME':res.rows.item(i).NAME});
			}
			if (typeof SuccessCB == 'function' ) SuccessCB(ret);
		}else{
			if (typeof SuccessCB == 'function' ) SuccessCB(null);
		}
	},function(error){console.log(error)});
}


