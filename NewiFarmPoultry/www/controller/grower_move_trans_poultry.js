var clickAlias = "click";
var docTypeMove = "63";
var fromLoc = toLoc = null;

$("#grower_move_trans_poultry").bind("pageinit", function (event) {
    var PageParam = $.Ctx.GetPageParam('grower_move_list_poultry','param');
    $("#grower_move_trans_poultry #captionHeader").text($.Ctx.Lcl('grower_move_trans_poultry', PageParam['captionHeader'], 'Move to Other House'));
	/*$('#txtProductionDateMove', this).mobipick({
		intlStdDate: true,
		maxDate: $.Ctx.GetBusinessDate().toUIShortDateStr()
	});	*/
	//$('#grower_move_trans_poultry #txtProductionDateMove').val($.Ctx.GetBusinessDate().toUIShortDateStr());
	//======== get param from grower_move_list page ==========
	$('#grower_move_trans_poultry #btnSave').bind(clickAlias,function(){
		SaveMoveTrans(function (ret){
			if (ret==true){
				$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry', 'MsgSaveComplete', 'Save Completed.'));
				if ($.Ctx.GetPageParam('grower_move_trans_poultry', 'Mode')=="Create")
					ClearAfterSave();
				/*$.Ctx.NavigatePage($.Ctx.GetPageParam('grower_move_trans_poultry', 'Previous'), null, { transition: 'slide', reverse: false });*/				
			}
		});
		return false;
	});

	$('#grower_move_trans_poultry #lpFarmOrgFrom').bind(clickAlias,function(){
		$.Ctx.SetPageParam('grower_move_trans_poultry', 'ScrollingTo',  $(window).scrollTop());
//		if (fromLoc==null) {
//			alert('Parameter "FROMLOC" not set.');
//			return false;
//		}
		SearchStockFarmOrgByLoc(fromLoc,function(orgs){
			if (orgs!==null){
				var p = new LookupParam();
				p.title = $.Ctx.Lcl('grower_move_trans_poultry', 'msgFarmOrg', 'Farm Organization');
				p.calledPage = 'grower_move_trans_poultry';
				p.calledResult = 'selectedFarmOrgFrom';
				p.codeField = 'CODE';
				p.nameField = 'NAME';
				p.showCode = true;
				p.dataSource = orgs;
				
				$.Ctx.SetPageParam('lookup', 'param', p);
				$.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
			}else{
				
				$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry', 'msgFarmOrgNotFound','Farm org Location {0} not found.').format([fromLoc]));
			}
		});
	});
	
//	$('#grower_move_trans_poultry #lpFarmMng').bind(clickAlias,function(){
//		$.Ctx.SetPageParam('grower_move_trans_poultry', 'ScrollingTo',  $(window).scrollTop());
//		$.FarmCtx.SearchFarmManage(function (orgs){
//			if (orgs!==null){
//				var p = new LookupParam();
//				p.title = $.Ctx.Lcl('grower_move_trans_poultry', 'msgFarmManage', 'Farm Manage');
//				p.calledPage = 'grower_move_trans_poultry';
//				p.calledResult = 'selectedFarmManage';
//				p.codeField = 'CODE';
//				p.nameField = 'NAME';
//				p.showCode = true;
//				p.dataSource = orgs;
//				
//				$.Ctx.SetPageParam('lookup', 'param', p);
//				$.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
//			}
//		});
//	});
	
	$('#grower_move_trans_poultry #lpFarmOrgTo').bind(clickAlias,function(){
		$.Ctx.SetPageParam('grower_move_trans_poultry', 'ScrollingTo', $(window).scrollTop());
		var model = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Data');
		if (model==null || model.FARM_ORG_LOC==null) {
			$.Ctx.MsgBox('Farm Org From is Required.');
			return false;
		}
//		if (model==null || model.TO_FARM_ORG==null) {
//			$.Ctx.MsgBox('Farm Manage is Required.');
//			return false;
//		}
//		if (toLoc==null) {
//			$.Ctx.MsgBox('Parameter "TOLOC" not set.');
//			return false;
//		}
		SearchStockFarmOrgTOByLoc(model.TO_FARM_ORG, toLoc, model.FARM_ORG_LOC, function(orgs){
			if (orgs!==null){
				var p = new LookupParam();
				p.title = $.Ctx.Lcl('grower_move_trans_poultry', 'msgFarmOrg', 'Farm Organization');
				p.calledPage = 'grower_move_trans_poultry';
				p.calledResult = 'selectedFarmOrgTo';
				p.codeField = 'CODE';
				p.nameField = 'NAME';
				p.showCode = true;
				p.dataSource = orgs;
				
				$.Ctx.SetPageParam('lookup', 'param', p);
				$.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
			}else{
				$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry', 'msgFarmOrgNotFound','Farm org Location {0} not found.').format([toLoc]));
				
			}
		});
		//var model = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Data');
		//if (model==null || model.FARM_ORG_LOC==null) return false;
		/*$.FarmCtx.FindLocation(model.FARM_ORG_LOC, function(loc){
			if (loc==null&&loc.LOCATION!==undefined) return false;
			$.FarmCtx.SearchFarmGrowerTO(loc.LOCATION, model.FARM_ORG_LOC, 'grower', function(orgs){
				if (orgs!==null){
					var p = new LookupParam();
					p.title = "Farm Organization";
					p.calledPage = 'grower_move_trans_poultry';
					p.calledResult = 'selectedFarmOrgTo';
					p.codeField = 'CODE';
					p.nameField = 'NAME';
					p.showCode = true;
					p.dataSource = orgs;
					
					$.Ctx.SetPageParam('lookup', 'param', p);
					$.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
				}
			});
		});*/	
	});
	
	$('#grower_move_trans_poultry #lpBreederCode').bind(clickAlias,function(){
		var model = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Data');
		if (model==null || model.FARM_ORG_LOC==null){
            $.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry', 'msgReqFarmOrg', 'Farm Org is Required.'));
			return false;
		}	
		$.Ctx.SetPageParam('grower_move_trans_poultry', 'ScrollingTo',  $(window).scrollTop());
		
		var p = new LookupParam();
		p.calledPage = 'grower_move_trans_poultry';
		p.calledResult = 'BreederSelected';
		$.Ctx.SetPageParam('lookup_grower_stock', 'param', p);
		$.Ctx.SetPageParam('lookup_grower_stock', 'farmOrgLoc', model.FARM_ORG_LOC);
		$.Ctx.NavigatePage('lookup_grower_stock', null, { transition:'slide'}, false);
		/*$.FarmCtx.SearchStockGrowerBreeder(model.FARM_ORG_LOC ,function(breeds){
			if (breeds!==null){
				var p = new LookupParam();
				p.title = "Breeders";
				p.calledPage = 'grower_move_trans_poultry';
				p.calledResult = 'selectedBreeder';
				p.codeField = 'BREEDER';
				p.nameField = 'BREEDER_NAME';
				p.showCode = true;
				p.dataSource = breeds;
				
				$.Ctx.SetPageParam('lookup', 'param', p);
				$.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
			}else{
				$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry', 'msgBreed', 'Breeder not found.'));
			}
		});*/
	});
	/*
	$('#grower_move_trans_poultry #lpBirthWeek').bind(clickAlias,function(){
		var model = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Data');
		if (model==null || model.FARM_ORG_LOC==null || model.BREEDER==null) return false;
		
		$.Ctx.SetPageParam('grower_move_trans_poultry', 'ScrollingTo',  $(window).scrollTop());
		$.FarmCtx.SearchStockGrowerBirthWeek(model.FARM_ORG_LOC,model.BREEDER ,function(birthw){
			if (birthw!==null){
				var p = new LookupParam();
				p.title = "Birth Week";
				p.calledPage = 'grower_move_trans_poultry';
				p.calledResult = 'selectedBirthweek';
				p.codeField = 'BIRTH_WEEK';
				p.nameField = '';
				p.showCode = true;
				p.dataSource = birthw;
				
				$.Ctx.SetPageParam('lookup', 'param', p);
				$.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
			}else{
				$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry', 'msgBrdWeekNotFod', 'Birthweek not found.'));
			}
		});
	});*/
	
	$('#grower_move_trans_poultry #btnBack').bind('click',function(){
		//Check Dirty
		var dirty = false;
		var mode = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Mode');
		var model = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Data');
		if (mode=='Create' && model!==null && Object.keys(model).length>0){
			dirty=true;
		}
		var isExit=true;
		/*if (dirty==true){
			isExit = confirm($.Ctx.Lcl('grower_move_trans_poultry', 'msgConfirmExit', 'Data is Dirty, Exit?'));
		}else{
			isExit=true;
		}*/
		if (isExit==true){
			$.Ctx.NavigatePage($.Ctx.GetPageParam('grower_move_trans_poultry', 'Previous'), 
			null, 
			{ transition: 'slide', reverse: true });
		}
		return false;
	});

	$('#grower_move_trans_poultry #male-qty').focusout(function() {
		var qtyStr=$(this).val();
		$(this).val(Math.floor(Number(qtyStr)));
		if (Number($(this).val())<=0){
			$(this).val('');
		}
	});
	$('#grower_move_trans_poultry #female-qty').focusout(function() {
		var qtyStr=$(this).val();
		$(this).val(Math.floor(Number(qtyStr)));
		if (Number($(this).val())<=0){
			$(this).val('');
		}
	});
	$('#grower_move_trans_poultry #total-wt').focusout(function() {
		if (Number($(this).val())<0){
			$(this).val('');
		}
	});
});

$("#grower_move_trans_poultry").bind("pagebeforehide", function (event,ui) {
	var model = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Data');
	if (model==null){
		model = {};
		$.Ctx.SetPageParam('grower_move_trans_poultry', 'Data', model);
	}
	
	model.MALE_QTY = Number($('#grower_move_trans_poultry #male-qty').val());
	model.FEMALE_QTY = Number($('#grower_move_trans_poultry #female-qty').val());
	
	var totalW = Number($('#grower_move_trans_poultry #total-wt').val());
	model.MALE_WGH = Number( (totalW * model.MALE_QTY  / (model.MALE_QTY+model.FEMALE_QTY)).toFixed(2) );
	model.FEMALE_WGH = totalW-model.MALE_WGH;
	
	if ($.trim($('#txtProductionDateMove').val())!=='')
		model.PRODUCTION_DATE = parseUIDateStr($('#txtProductionDateMove').val());
	else
	    model.PRODUCTION_DATE = null;

	$.Ctx.SetPageParam('grower_move_trans_poultry', 'Data', model);
});

$('#grower_move_trans_poultry').bind("pagebeforecreate", function (e) {
    $.Util.RenderUiLang('grower_move_trans_poultry');
    $.Ctx.RenderFooter('grower_move_trans_poultry');
});

$("#grower_move_trans_poultry").bind("pagebeforeshow", function (event, ui) {
    //console.log( $.Ctx.GetPageParam('grower_move_trans_poultry', 'Data'));
    var pParam = $.Ctx.GetPageParam('grower_move_list_poultry', 'param');
    try {
        fromLoc = pParam['FROMLOC'];
        toLoc = pParam['TOLOC'];
    } catch (e) {
        fromLoc = 2;
        toLoc = 3;
    }
    var model = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Data');
    if (model == null) {
        model = {};
        $.Ctx.SetPageParam('grower_move_trans_poultry', 'Data', model);
    }

    var prevPage = (typeof ui.prevPage[0] == 'undefined' ? "" : ui.prevPage[0].id);
    if (prevPage.indexOf("lookup") > -1) {//From Lookup	
        //===== Farm Org From ====
        var farmOrgFrm = $.Ctx.GetPageParam('grower_move_trans_poultry', 'selectedFarmOrgFrom');
        if (farmOrgFrm !== null) {
            if (model.FARM_ORG_LOC !== farmOrgFrm.CODE) {
                //				model.BREEDER = null;
                //				model.BREEDER_NAME = null;
                model.BIRTH_WEEK = null;

                model.A_MALE_QTY = 0;
                model.A_FEMALE_QTY = 0;
                $.Ctx.SetPageParam('grower_move_trans_poultry', 'BreederSelected', null);
            }
            model.FARM_ORG_LOC = farmOrgFrm.CODE;
            model.FARM_ORG_NAME = farmOrgFrm.NAME;
        }

        //		var farmMng=$.Ctx.GetPageParam('grower_move_trans_poultry', 'selectedFarmManage');
        //		if (farmMng!==null) { 
        //			if (model.TO_FARM_ORG!==farmMng.CODE){
        //				$.Ctx.SetPageParam('grower_move_trans_poultry', 'selectedFarmOrgTo',null);
        //				model.TO_FARM_ORG_LOC=null;
        //				model.TO_FARM_ORG_LOC_NAME=null;
        //			}
        //			model.TO_FARM_ORG = farmMng.CODE;
        //			model.TO_FARM_ORG_NAME = farmMng.NAME;
        //		}

        var farmOrgTo = $.Ctx.GetPageParam('grower_move_trans_poultry', 'selectedFarmOrgTo');
        if (farmOrgTo !== null) {
            model.TO_FARM_ORG_LOC = farmOrgTo.CODE;
            model.TO_FARM_ORG_LOC_NAME = farmOrgTo.NAME;
        }

        //		//======= Breeder ======
        //		var breed=$.Ctx.GetPageParam('grower_move_trans_poultry', 'BreederSelected');
        //		if (breed!==null) {
        //			/*if (model.BREEDER!==breed.BREEDER || model.BIRTH_WEEK!==breed.BIRTH_WEEK){
        //				//Auto Fill
        //				model.MALE_QTY = breed.SUM_MALE;
        //				model.FEMALE_QTY = breed.SUM_FEMALE;
        //			}else{
        //				if (typeof model.MALE_QTY =='undefined'|| model.MALE_QTY==0)
        //					model.MALE_QTY = breed.SUM_MALE;
        //				if (typeof model.FEMALE_QTY=='undefined'|| model.FEMALE_QTY==0)
        //					model.FEMALE_QTY = breed.SUM_FEMALE;
        //			}*/
        //			model.BIRTH_WEEK = breed.BIRTH_WEEK;
        //			model.BREEDER=breed.BREEDER;
        //			model.BREEDER_NAME = breed.BREEDER_NAME;
        //			model.A_MALE_QTY = breed.SUM_MALE;
        //			model.A_FEMALE_QTY = breed.SUM_FEMALE;
        //		}
        $.Ctx.SetPageParam('grower_move_trans_poultry', 'Data', model);
    } else {
        var mode = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Mode');
        if (mode !== 'Create') {
            //Disable key
            var key = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Key');
            console.log('Key');
            console.log(key);

            FindGrowerMove(key.FARM_ORG_LOC, key.TRANSACTION_DATE, key.DOCUMENT_TYPE, key.DOCUMENT_EXT, function (ret) {
                console.log('From FindGrower');
                console.log(ret);
                if (ret !== null) {
                    model.FARM_ORG_LOC = ret.FARM_ORG_LOC;
                    model.FARM_ORG_NAME = ret.FARM_ORG_LOC_NAME;
                    model.DOCUMENT_EXT = ret.DOCUMENT_EXT;
                    model.TRANSACTION_DATE = ret.TRANSACTION_DATE;
                    model.FARM_ORG_LOC_NAME = ret.FARM_ORG_LOC_NAME;
                    model.TO_FARM_ORG = ret.TO_FARM_ORG;
                    model.TO_FARM_ORG_NAME = ret.TO_FARM_ORG_NAME;
                    model.TO_FARM_ORG_LOC = ret.TO_FARM_ORG_LOC;
                    model.TO_FARM_ORG_LOC_NAME = ret.TO_FARM_ORG_LOC_NAME;
                    model.PRODUCTION_DATE = ret.PRODUCTION_DATE;
                    //ret.DOCUMENT_TYPE=docType;
                    model.BREEDER = ret.BREEDER;
                    model.BREEDER_NAME = ret.BREEDER_NAME;
                    model.BIRTH_WEEK = ret.BIRTH_WEEK;

                    model.MALE_QTY = ret.MALE_QTY;
                    model.MALE_WGH = ret.MALE_WGH;
                    model.FEMALE_QTY = ret.FEMALE_QTY;
                    model.FEMALE_WGH = ret.FEMALE_WGH;
                    //model.MALE_QTY = ret.NUMBER_OF_SENDING_DATA;
                    $.FarmCtx.FindAvaliableGrowerStock(model.FARM_ORG_LOC, model.BREEDER, model.BIRTH_WEEK, function (ret) {
                   
                        if (ret !== null) {
                            model.A_MALE_QTY = ret.A_MALE_QTY;
                            model.A_FEMALE_QTY = ret.A_FEMALE_QTY;
                        }
                        Model2Control();
                    });
                }
            });
        } else {
            //Mode : Create 
            $.Ctx.SetPageParam('grower_move_trans_poultry', 'selectedFarmManage', null);
        }
    }
    console.log($.Ctx.GetPageParam('grower_move_trans_poultry', 'Data'));
});

$("#grower_move_trans_poultry").bind("pageshow", function (event) {
	var mode = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Mode');
	//var self = $('#grower_move_trans_poultry');
	if (mode=='Update'){
		//Disable key
		//self.find('#lpFarmOrg').button('disable'); 
		$('#grower_move_trans_poultry #lpFarmOrgFrom').button('disable'); 
		$('#grower_move_trans_poultry #lpFarmOrgTo').button('disable'); 
		$('#grower_move_trans_poultry #lpFarmMng').button('disable'); 
	}else if (mode=='Create'){
		$('#grower_move_trans_poultry #lpFarmOrgFrom').button('enable'); 
		$('#grower_move_trans_poultry #lpFarmOrgTo').button('enable'); 
		$('#grower_move_trans_poultry #lpFarmMng').button('enable'); 
	}else{
		$('#grower_move_trans_poultry #lpFarmOrgFrom').button('disable');
		$('#grower_move_trans_poultry #lpFarmOrgTo').button('disable');
		$('#grower_move_trans_poultry #lpFarmMng').button('disable'); 
		$('#grower_move_trans_poultry #btnSave').hide();
	}
	if ( $.Ctx.Bu=="FARM_PIG"){
		$('#grower_move_trans_poultry #liBirthWeek').show();
		$('#grower_move_trans_poultry #liProductionDate').hide();
	}else{
		$('#grower_move_trans_poultry #liBirthWeek').hide();
		$('#grower_move_trans_poultry #liProductionDate').show();
	}
	//$('#grower_move_trans_poultry #lblMode').html("Mode: " + mode);
	Model2Control();
	
	if ($.Ctx.GetPageParam('grower_move_trans_poultry', 'ScrollingTo') != null ){
		//scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
        $('html, body').animate({
            scrollTop: $.Ctx.GetPageParam('grower_move_trans_poultry', 'ScrollingTo')
        }, 0);
    }
});

function ClearAfterSave(){
	var model = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Data');
	if (model!==null){
		model.BIRTH_WEEK = null;
		//$.Ctx.SetPageParam('grower_move_trans_poultry', 'selectedBirthweek',null);
		model.BREEDER = null;
		$.Ctx.SetPageParam('grower_move_trans_poultry', 'BreederSelected',null);
		
		model.A_MALE_QTY = 0;
		model.A_FEMALE_QTY = 0;
		
		model.MALE_QTY = 0;
		model.MALE_WGH = 0;
		model.FEMALE_QTY = 0;
		model.FEMALE_WGH = 0;
		Model2Control();
	}
}

function Model2Control(){
	var model = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Data');
	if (model !== null){
		if (model.FARM_ORG_LOC==null)
			$('#grower_move_trans_poultry #lpFarmOrgFrom').text($.Ctx.Lcl('grower_move_trans_poultry','msgSelect','Select'));
		else
			$('#grower_move_trans_poultry #lpFarmOrgFrom').text(model.FARM_ORG_NAME); 
		$('#grower_move_trans_poultry #lpFarmOrgFrom').button('refresh');
		
		if (model.TO_FARM_ORG==null)
			$('#grower_move_trans_poultry #lpFarmMng').text($.Ctx.Lcl('grower_move_trans_poultry','msgSelect','Select')); 
		else
			$('#grower_move_trans_poultry #lpFarmMng').text(model.TO_FARM_ORG_NAME);
		$('#grower_move_trans_poultry #lpFarmMng').button('refresh');
		
		if (model.TO_FARM_ORG_LOC==null)
			$('#grower_move_trans_poultry #lpFarmOrgTo').text($.Ctx.Lcl('grower_move_trans_poultry','msgSelect','Select'));
		else
			$('#grower_move_trans_poultry #lpFarmOrgTo').text(model.TO_FARM_ORG_LOC_NAME); 
		$('#grower_move_trans_poultry #lpFarmOrgTo').button('refresh');
		
		if (model.BREEDER==null)
			$('#grower_move_trans_poultry #lpBreederCode').text($.Ctx.Lcl('grower_move_trans_poultry','msgSelect','Select')); 
		else
			$('#grower_move_trans_poultry #lpBreederCode').text(model.BREEDER_NAME);
		$('#grower_move_trans_poultry #lpBreederCode').button('refresh');
		
		/*if(model.BIRTH_WEEK==null)
			$('#grower_move_trans_poultry #lpBirthWeek').text($.Ctx.Lcl('grower_move_trans_poultry','msgSelect','Select'));
		else
			$('#grower_move_trans_poultry #lpBirthWeek').text(model.BIRTH_WEEK);
		$('#grower_move_trans_poultry #lpBirthWeek').button('refresh');*/
	
		$('#grower_move_trans_poultry #male-qty').val( model.MALE_QTY==0?'':model.MALE_QTY );
		$('#grower_move_trans_poultry #female-qty').val( model.FEMALE_QTY==0?'':model.FEMALE_QTY );
		var totalW = (model.MALE_WGH==null?0:model.MALE_WGH) + (model.FEMALE_WGH==null?0:model.FEMALE_WGH);
		$('#grower_move_trans_poultry #total-wt').val( totalW==0?'':totalW );
		
		$('#grower_move_trans_poultry #lblBirthWeek').html( model.BIRTH_WEEK==undefined?'':model.BIRTH_WEEK );
		$('#grower_move_trans_poultry #lblAvMale').html( model.A_MALE_QTY==undefined?'':model.A_MALE_QTY );
		$('#grower_move_trans_poultry #lblAvFMale').html( model.A_FEMALE_QTY==undefined?'':model.A_FEMALE_QTY );
	}
}

function SaveMoveTrans(SuccessCB){
	var qtyM = Number($('#grower_move_trans_poultry #male-qty').val()), 
		qtyF = Number($('#grower_move_trans_poultry #female-qty').val()),
		totalW = Number($('#grower_move_trans_poultry #total-wt').val());
		
	var model = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Data');
	
	if ($.trim($('#txtProductionDateMove').val())!=='')
		model.PRODUCTION_DATE = parseUIDateStr($('#txtProductionDateMove').val());
	else
		model.PRODUCTION_DATE = null;
		
	if ($.Ctx.Bu=="FARM_PIG"){
		if (model.FARM_ORG_LOC==null){
			$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry', 'msgReqFarmOrg', 'Farm Org is Required.'));
			SuccessCB(false); return false;
		}
		if (model.TO_FARM_ORG==null){
			$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry','msgReqFarmMng','To Farm Org is Required.'));
			SuccessCB(false); return false;
		}
		if (model.TO_FARM_ORG_LOC==null){
			$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry','msgReqFarmOrgLoc','To Farm Org Location is Required.'));
			SuccessCB(false); return false;
		}
		if (model.BREEDER==null){
			$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry','msgReqBreeder','Breeder is Required.'));
			SuccessCB(false); return false;
		}
		if (model.BIRTH_WEEK==null){
			$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry','msgReqBirthWeek','Birth week is Required.'));
			SuccessCB(false); return false;
		}
		if (qtyM+qtyF==0){
			$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry','msgReqQuantity','Quantity is Required.'));
			SuccessCB(false); return false;
		}
		if (totalW==0){
			$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry', 'msgReqWeight', 'Total Weight is Required.'));
			SuccessCB(false);return false;
		}
	}else{
		if (model.FARM_ORG_LOC==null){
			$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry', 'msgReqFarmOrg', 'From Farm Org is Required.'));
			SuccessCB(false); return false;
		}

		if (model.TO_FARM_ORG_LOC==null){
			$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry','msgReqFarmOrg','To Farm Org is Required.'));
			SuccessCB(false); return false;
		}
		
		if (model.PRODUCTION_DATE==null){
			$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry','msgReqProddate','Production date is Required.'));
			SuccessCB(false); return false;
		}
		if (qtyM+qtyF==0){
			$.Ctx.MsgBox($.Ctx.Lcl('grower_move_trans_poultry','msgReqQuantity','Quantity is Required.'));
			SuccessCB(false); return false;
		}
		
	}
	
	var mode = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Mode');
	if (mode=='Update'){
		$.FarmCtx.ValidateStockOfMove(qtyM,qtyF,model.FARM_ORG_LOC,$.Ctx.GetBusinessDate(),model.BREEDER,model.BIRTH_WEEK,model.DOCUMENT_EXT, model.PRODUCTION_DATE,function(isSucc){
			if (isSucc==true){
				//	Delete Stock Pay
				$.FarmCtx.DeleteGrowerStockByKey(model.FARM_ORG_LOC,$.Ctx.GetBusinessDate(),'2',docTypeMove, model.DOCUMENT_EXT,
				function(succ){
					if (succ==true){
						//	Delete Stock Receive
						$.FarmCtx.DeleteGrowerStockByKey(model.TO_FARM_ORG_LOC,$.Ctx.GetBusinessDate(),'1',docTypeMove, model.DOCUMENT_EXT,
						function(succ2){
							if (succ2==true) SaveWithDocExt(model.DOCUMENT_EXT);
						});
					}
				});
			}
		});
	}else{//Add
		$.FarmCtx.ValidateStockOfMove(qtyM,qtyF,model.FARM_ORG_LOC,$.Ctx.GetBusinessDate(),model.BREEDER,model.BIRTH_WEEK, -1, model.PRODUCTION_DATE,function(isSucc){
			if (isSucc==true){
				$.FarmCtx.GetMaxDocExtGrowerMove(model.FARM_ORG_LOC, SaveWithDocExt)
				//GetDocExt(model.FARM_ORG_LOC, SaveWithDocExt);
			}
		});
	}
	
	function SaveWithDocExt(ext){
		//$.Ctx.MsgBox('save number ' + ext);
		var dataM = $.Ctx.GetPageParam('grower_move_trans_poultry', 'Data');
		var qtyM = Number($('#grower_move_trans_poultry #male-qty').val()), 
			qtyF = Number($('#grower_move_trans_poultry #female-qty').val()),
			totalW = Number($('#grower_move_trans_poultry #total-wt').val());
		
		var move = new HH_FR_MS_GROWER_MOVE();
		move.ORG_CODE = $.Ctx.SubOp;
		move.FARM_ORG = $.Ctx.Warehouse;
		move.FARM_ORG_LOC = dataM.FARM_ORG_LOC;
		move.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
		move.DOCUMENT_TYPE = docTypeMove;
		move.DOCUMENT_EXT = ext;
		move.TO_FARM_ORG = dataM.TO_FARM_ORG;
		move.TO_FARM_ORG_LOC = dataM.TO_FARM_ORG_LOC;
		move.BREEDER = dataM.BREEDER;
		move.BIRTH_WEEK = dataM.BIRTH_WEEK;
		if (dataM.PRODUCTION_DATE!==null)
			move.PRODUCTION_DATE = dataM.PRODUCTION_DATE.toDbDateStr();
		else
			move.PRODUCTION_DATE = null;
		move.MALE_QTY = qtyM;
		move.MALE_WGH = Number( (totalW * qtyM  / (qtyM+qtyF)).toFixed(2) );
		move.FEMALE_QTY = qtyF;
		move.FEMALE_WGH = totalW-move.MALE_WGH;
		move.TO_BREEDER = null;
		move.TO_SWINE_ID = null;
		move.TO_SWINE_TRACK = null;
		move.TO_SWINE_DATE_IN = null;
		move.NUMBER_OF_SENDING_DATA = 0;
		move.OWNER = $.Ctx.UserId;
		move.CREATE_DATE = (new XDate()).toDbDateStr();
		move.LAST_UPDATE_DATE = (mode=='Update'? (new XDate()).toDbDateStr() : null);
		move.FUNCTION = (mode=='Update'?'C':'A');
		
		var stkOut = new HH_FR_MS_GROWER_STOCK();
		stkOut.ORG_CODE = $.Ctx.SubOp;
		stkOut.FARM_ORG = $.Ctx.Warehouse;
		stkOut.FARM_ORG_LOC = dataM.FARM_ORG_LOC;
		stkOut.TRANSACTION_DATE = move.TRANSACTION_DATE;
		stkOut.TRANSACTION_TYPE = '2';
		stkOut.DOCUMENT_TYPE = docTypeMove;
		stkOut.DOCUMENT_EXT = ext;
		stkOut.BREEDER = move.BREEDER;
		stkOut.BIRTH_WEEK = move.BIRTH_WEEK;
		stkOut.MALE_QTY = move.MALE_QTY;
		stkOut.MALE_WGH = move.MALE_WGH;
		stkOut.MALE_AMT = 0;
		stkOut.FEMALE_QTY = move.FEMALE_QTY;
		stkOut.FEMALE_WGH = move.FEMALE_WGH;
		stkOut.FEMALE_AMT = 0;
		stkOut.OWNER = $.Ctx.UserId;
		stkOut.CREATE_DATE = move.CREATE_DATE;
		stkOut.LAST_UPDATE_DATE = move.LAST_UPDATE_DATE ;
		stkOut.FUNCTION = move.FUNCTION;
		stkOut.NUMBER_OF_SENDING_DATA = 0;
		
		var stkIn = new HH_FR_MS_GROWER_STOCK();
		stkIn.ORG_CODE = $.Ctx.SubOp;
		stkIn.FARM_ORG = $.Ctx.Warehouse;
		stkIn.FARM_ORG_LOC = dataM.TO_FARM_ORG_LOC;
		stkIn.TRANSACTION_DATE = move.TRANSACTION_DATE;
		stkIn.TRANSACTION_TYPE = '1';
		stkIn.DOCUMENT_TYPE = docTypeMove;
		stkIn.DOCUMENT_EXT = ext;
		stkIn.BREEDER = move.BREEDER;
		stkIn.BIRTH_WEEK = move.BIRTH_WEEK;
		stkIn.MALE_QTY = move.MALE_QTY;
		stkIn.MALE_WGH = move.MALE_WGH;
		stkIn.MALE_AMT = 0;
		stkIn.FEMALE_QTY = move.FEMALE_QTY;
		stkIn.FEMALE_WGH = move.FEMALE_WGH;
		stkIn.FEMALE_AMT = 0;
		stkIn.OWNER = $.Ctx.UserId;
		stkIn.CREATE_DATE = move.CREATE_DATE;
		stkIn.LAST_UPDATE_DATE = move.LAST_UPDATE_DATE ;
		stkIn.FUNCTION = move.FUNCTION;
		stkIn.NUMBER_OF_SENDING_DATA = 0;
		
		var paramCmd=[];
		var cmd,cmd2,cmd3;
		if (mode=='Update')
			cmd = move.updateCommand($.Ctx.DbConn);
		else
			cmd = move.insertCommand($.Ctx.DbConn);
		
		cmd2 = stkIn.insertCommand($.Ctx.DbConn);
		cmd3 = stkOut.insertCommand($.Ctx.DbConn);
		paramCmd.push(cmd);
		paramCmd.push(cmd2);
		paramCmd.push(cmd3);
		
		var trn = new DbTran($.Ctx.DbConn);
		trn.executeNonQuery(paramCmd, function(){
			if (typeof(SuccessCB)=="function")
				SuccessCB(true);
		}, function(errors){
			SuccessCB(false);
			console.log(errors);
		});
	}
}

function FindGrowerMove(farmOrg, txDateStr, docType, docExt, SuccessCB){
	var cmd = $.Ctx.DbConn.createSelectCommand();
	var nRea = nLoc = nTo = nBree = nToFarm = '';
	if ($.Ctx.Lang=="en-US"){
		nRea = "ifnull(R.DESC_ENG, R.DESC_LOC)";
		nLoc = "ifnull(F.NAME_ENG, F.NAME_LOC)";
		nTo = "ifnull(F1.NAME_ENG, F1.NAME_LOC)";
		nToFarm = "''"; 
		nBree = "''"; 
	}else{
		nRea = "ifnull(R.DESC_LOC, R.DESC_ENG)";
		nLoc = "ifnull(F.NAME_LOC, F.NAME_ENG)";
		nTo = "ifnull(F1.NAME_LOC, F1.NAME_ENG)";
		nToFarm = "''"; 
		nBree =  "''" ;
	}
	cmd.sqlText = "SELECT S.TRANSACTION_DATE,S.DOCUMENT_TYPE,S.DOCUMENT_EXT,S.TO_FARM_ORG, {0} AS TO_FARM_ORG_NAME, ".format([nToFarm]);
	cmd.sqlText += "S.FARM_ORG_LOC ,{0} AS FARM_ORG_LOC_NAME, S.TO_FARM_ORG_LOC, {1} AS TO_FARM_ORG_LOC_NAME, {2} AS BREEDER_NAME, ".format([nLoc,nTo,nBree]);
	cmd.sqlText += "S.BREEDER, S.BIRTH_WEEK,S.MALE_QTY,S.MALE_WGH,S.FEMALE_QTY,S.FEMALE_WGH,S.PRODUCTION_DATE, S.NUMBER_OF_SENDING_DATA ";
	cmd.sqlText += "FROM HH_FR_MS_GROWER_MOVE S ";
	cmd.sqlText += "JOIN HH_FR_FARM_GROWER F ON (S.ORG_CODE=F.ORG_CODE AND S.FARM_ORG_LOC=F.FARM_ORG) ";
	cmd.sqlText += "JOIN HH_FR_FARM_GROWER F1 ON (S.ORG_CODE=F1.ORG_CODE AND S.TO_FARM_ORG_LOC=F1.FARM_ORG) ";
	cmd.sqlText += "WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND S.FARM_ORG_LOC=? AND S.TRANSACTION_DATE=? ";
	cmd.sqlText += " AND S.DOCUMENT_TYPE=? AND S.DOCUMENT_EXT=? ";
	cmd.parameters.push($.Ctx.SubOp);
	cmd.parameters.push($.Ctx.Warehouse);
	cmd.parameters.push(farmOrg);
	cmd.parameters.push(txDateStr);
	cmd.parameters.push(docType);
	cmd.parameters.push(docExt);
	console.log(cmd.sqlText); 

	var ret={};
	cmd.executeReader(function (t, res) {
		if (res.rows.length > 0) {
			ret.ORG_CODE = $.Ctx.SubOp;
			ret.FARM_ORG = $.Ctx.Warehouse;
			ret.FARM_ORG_LOC = farmOrg;
			ret.TRANSACTION_DATE = parseDbDateStr(txDateStr);
			ret.DOCUMENT_TYPE=docType;
			ret.DOCUMENT_EXT = docExt;
			ret.FARM_ORG_LOC_NAME = res.rows.item(0).FARM_ORG_LOC_NAME;
			ret.TO_FARM_ORG = res.rows.item(0).TO_FARM_ORG;
			ret.TO_FARM_ORG_NAME = res.rows.item(0).TO_FARM_ORG_NAME;
			ret.TO_FARM_ORG_LOC = res.rows.item(0).TO_FARM_ORG_LOC;
			ret.TO_FARM_ORG_LOC_NAME = res.rows.item(0).TO_FARM_ORG_LOC_NAME;
			if (res.rows.item(0).PRODUCTION_DATE!==null)
				ret.PRODUCTION_DATE = parseDbDateStr(res.rows.item(0).PRODUCTION_DATE);
			ret.BREEDER = res.rows.item(0).BREEDER;
			ret.BREEDER_NAME = res.rows.item(0).BREEDER_NAME;
			ret.BIRTH_WEEK = res.rows.item(0).BIRTH_WEEK;
			ret.MALE_QTY = res.rows.item(0).MALE_QTY;
			ret.MALE_WGH = res.rows.item(0).MALE_WGH;
			ret.FEMALE_QTY = res.rows.item(0).FEMALE_QTY;
			ret.FEMALE_WGH = res.rows.item(0).FEMALE_WGH;
			ret.NUMBER_OF_SENDING_DATA = res.rows.item(0).NUMBER_OF_SENDING_DATA;
		
			SuccessCB(ret);
		}else{
			SuccessCB(null);
		}
	},function(error){
		console.log(error);
	});
}

function SearchStockFarmOrgByLoc(location, SuccessCB){
	var cmd = $.Ctx.DbConn.createSelectCommand();
	var nameField = "ifnull(F.NAME_LOC, F.NAME_ENG)";
	if ($.Ctx.Lang == "en-US") { 
		nameField = "ifnull(F.NAME_ENG, F.NAME_LOC)";
}

cmd.sqlText = "SELECT DISTINCT FARM_ORG_LOC AS CODE,{0} AS NAME ".format([nameField]);
cmd.sqlText += " FROM HH_FR_MS_GROWER_STOCK S JOIN FR_FARM_ORG F  ";
cmd.sqlText += " ON (S.ORG_CODE=F.ORG_CODE AND S.FARM_ORG_LOC=F.FARM_ORG)  ";
cmd.sqlText += " WHERE S.ORG_CODE= ?  AND S.FARM_ORG= ? ";
cmd.sqlText += " ORDER BY S.FARM_ORG_LOC ";
cmd.parameters.push($.Ctx.SubOp);
cmd.parameters.push($.Ctx.Warehouse);

/*
	cmd.sqlText = "SELECT DISTINCT FARM_ORG_LOC AS CODE,{0} AS NAME ".format([nameField]);
	cmd.sqlText += "FROM HH_FR_MS_GROWER_STOCK S JOIN ";
	cmd.sqlText += "HH_FR_FARM_GROWER F ON (S.ORG_CODE=F.ORG_CODE AND S.FARM_ORG_LOC=F.FARM_ORG) ";
	cmd.sqlText += "WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND F.LOCATION=? ";
	cmd.sqlText += "ORDER BY S.FARM_ORG_LOC ";
	cmd.parameters.push($.Ctx.SubOp);
	cmd.parameters.push($.Ctx.Warehouse);
	cmd.parameters.push(location);
	*/
	var ret=[];
	cmd.executeReader(function (t, res) {
		if (res.rows.length != 0) {
			for (var i=0;i<res.rows.length;i++){
				ret.push({'CODE':res.rows.item(i).CODE, 'NAME':res.rows.item(i).NAME});
			}
			SuccessCB(ret);
		}else{
			SuccessCB(null);
		}
	});
}

function SearchStockFarmOrgTOByLoc(farmMng, location, farmOrgFromLoc, SuccessCB){
	var cmd = $.Ctx.DbConn.createSelectCommand();
	var nameField = "ifnull(F.NAME_LOC, F.NAME_ENG)";
	if ($.Ctx.Lang == "en-US") { 
		nameField = "ifnull(F.NAME_ENG, F.NAME_LOC)";
}

cmd.sqlText = "SELECT F.FARM_ORG AS CODE,{0} AS NAME ".format([nameField]);
cmd.sqlText += " FROM FR_FARM_ORG F ";
cmd.sqlText += " WHERE F.ORG_CODE= ? AND FARM_ORG<> ?  ";
cmd.sqlText += " ORDER BY FARM_ORG ";
cmd.parameters.push($.Ctx.SubOp);
cmd.parameters.push(farmOrgFromLoc); //Check don't self
/*
	cmd.sqlText = "SELECT F.FARM_ORG AS CODE,{0} AS NAME ".format([nameField]);
	cmd.sqlText += "FROM HH_FR_FARM_GROWER F ";
	cmd.sqlText += "WHERE F.ORG_CODE=? AND F.PARENT_FARM_ORG=? AND F.LOCATION=? AND F.FARM_ORG<>? ";
	cmd.sqlText += "ORDER BY F.FARM_ORG ";
	cmd.parameters.push($.Ctx.SubOp);
	cmd.parameters.push(farmMng);
	cmd.parameters.push(location);
	cmd.parameters.push(farmOrgFromLoc);//Check don't self
    */
	var ret=[];
	cmd.executeReader(function (t, res) {
		if (res.rows.length != 0) {
			for (var i=0;i<res.rows.length;i++){
				ret.push({'CODE':res.rows.item(i).CODE, 'NAME':res.rows.item(i).NAME});
			}
			SuccessCB(ret);
		}else{
			SuccessCB(null);
		}
	},function(err){
		console.log(err);
	});
}


