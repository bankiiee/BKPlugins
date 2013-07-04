var clickAlias = "click";
//$.mobile.defaultPageTransition = 'slide';

$("#purchase_list").bind("pageinit", function (event) {
    var pParam = $.Ctx.GetPageParam('purchase_list', 'param');
    try {
        $("#purchase_list #captionHeader").text($.Ctx.Lcl('purchase_list', pParam['captionHeader'], 'Purchase'));
    } catch (e) {
        alert(e)
        $("#purchase_list #captionHeader").text($.Ctx.Lcl('purchase_list', 'captionHeader', 'Purchase'));
    }


	$('#purchase_list #btnNew').bind(clickAlias,function(){
		ClearParamPage();
		$.Ctx.NavigatePage("purchase_trans", 
			{Previous: 'purchase_list', Mode:'Create', Data:null}, 
			{transition: 'slide'});
	});
	
	$('#purchase_list #btnBack').bind('click',function(){
		 $.Ctx.NavigatePage($.Ctx.GetPageParam('purchase_list', 'Previous'), 
			null, 
		 { transition: 'slide', reverse: true });
	});
	
});

$('#purchase_list').bind("pagebeforecreate", function (e) {
    $.Util.RenderUiLang('purchase_list');
    $.Ctx.RenderFooter('purchase_list');
});
 
$("#purchase_list").bind("pagebeforeshow", function (event) {
	SearchBindDataPurchase();
});

function SearchBindDataPurchase(){
	$('#purchase_list #lv-Purchase').empty();
    $('#purchase_list #totalSearch').html('');
	SearchPurchaseTran(function(sales){
        console.log("get purchase tran",+sales)
        var lblQty = $.Ctx.Lcl('purchase_list','msgQty','QTY'),
			lblWgh = $.Ctx.Lcl('purchase_list','msgWgh','WGH'),
			lblAmt = $.Ctx.Lcl('purchase_list','msgAmt','AMT');
		var qtyAll = wghAll = amtAll = 0;
		for (var i=0;i<sales.length;i++){
			var key = sales[i].FARM_ORG_LOC+'|'+sales[i].TRANSACTION_DATE+'|'+ sales[i].DOCUMENT_TYPE +'|'+ sales[i].DOCUMENT_EXT;
			var noSd = (sales[i].NUMBER_OF_SENDING_DATA==null?0:sales[i].NUMBER_OF_SENDING_DATA);
			
			var html = '<li code="'+key+'" data-swipeurl="#" noSd="'+noSd+'" docno = "'+sales[i].REF_DOCUMENT_NO+'">';
			html += '<a href="#">';
			html+='<h3>'+ sales[i].FARM_ORG_LOC +'</h3>';
			var sumqty = (sales[i].MALE_QTY==null ? 0:sales[i].MALE_QTY) + (sales[i].FEMALE_QTY==null ? 0:sales[i].FEMALE_QTY);
			var sumwgt = (sales[i].MALE_WGH==null ? 0:sales[i].MALE_WGH) + (sales[i].FEMALE_WGH==null ? 0:sales[i].FEMALE_WGH);
			var sumamt = (sales[i].MALE_AMT==null ? 0:sales[i].MALE_AMT) + (sales[i].FEMALE_AMT==null ? 0:sales[i].FEMALE_AMT);
			qtyAll+=sumqty;
			wghAll+=sumwgt;
			amtAll+=sumamt;
			html+='<p ><strong>{0}, {1} - {2}, {3} - {4}, {5} - {6}</strong></p>'.format([sales[i].PRODUCT_NAME, lblQty, accounting.formatNumber(sumqty,0,","),lblWgh, accounting.formatNumber(sumwgt,2,",") , lblAmt, accounting.formatNumber(sumamt,2,",")]);
			html+='<div class="ui-li-count">'+ parseDbDateStr(sales[i].TRANSACTION_DATE).toUIShortDateStr() +'</div>';
			html+='</a>';
			html+='</li>';
			$("#purchase_list #lv-Purchase").append(html);
		}
		$('#purchase_list #lv-Purchase').listview('refresh');
		
		if (qtyAll>0||wghAll>0||amtAll>0) {
            $('#purchase_list #totalSearch').html(
				$.Ctx.Lcl('iFarm', 'msgTotalSearch99', 'Total Qty:{0}, Total Wgh:{1}, Total Amt:{2}').format([accounting.formatNumber(qtyAll,0,","),accounting.formatNumber(wghAll,2,","),accounting.formatNumber(amtAll,2,",")]));
        }
		
		$('#purchase_list #lv-Purchase li').swipeDelete({
			btnTheme:'r',
			btnLabel:'Delete',
			btnClass:'aSwipeButton',
			click:function (e) {
				e.stopPropagation();
                e.preventDefault();
				var noSend = $(this).parents('li').attr('noSd');
				if (noSend=="0"){
				    var keyCode = $(this).parents('li').attr('code');
				    var docno = $(this).parents('li').attr('docno');
					var keys = keyCode.split('|');
					if (keys.length==4){
						DeletePurchase(keys[0], parseUIDateStr(keys[1]), keys[2], keys[3],docno,function(succ){
							if (succ==true){
								//$.Ctx.MsgBox('Delete Success');
								SearchBindDataPurchase();
							}
						});
					}
				}else{
					$.Ctx.MsgBox($.Ctx.Lcl('purchase_list', 'msgCannotDeleteItem', 'Cannot delete this item'));
				}
			}
		});
		
		$('#purchase_list #lv-Purchase li').bind(clickAlias, function(){
			ClearParamPage();
			var noSend = $(this).attr("noSd");
			var keyCode = $(this).attr("code");
			var keys = keyCode.split('|');
			//===========TRANSACTION_DATE must be string cause is in ParamPage!!!!!
			$.Ctx.SetPageParam('purchase_trans', 'Key',{'FARM_ORG_LOC':keys[0],'TRANSACTION_DATE':keys[1],'DOCUMENT_TYPE':keys[2], 'DOCUMENT_EXT': Number(keys[3]) } );
			//console.log($.Ctx.GetPageParam('sales_trans', 'Key'));
			var md = 'Update';
			if (noSend!=="0") md = 'Display';
			
			$.Ctx.NavigatePage("purchase_trans", 
				{ Previous: 'purchase_list', Mode:md}, 
				{ transition: 'slide' });
		});
	});
}

function ClearParamPage() {
    var model = $.Ctx.GetPageParam('purchase_trans', 'Data');
    $.Ctx.SetPageParam('purchase_trans', 'Data', {});
    $.Ctx.SetPageParam('purchase_trans', 'selectedFarmOrg', {});
    $.Ctx.SetPageParam('purchase_trans', 'selectedProduct', {});
    $.Ctx.SetPageParam('purchase_trans', 'selectedBreeder', {});
    $.Ctx.SetPageParam('purchase_trans', 'selectedBirthweek', {});
    $.Ctx.SetPageParam('purchase_trans', 'selectedGrade', {});
    
    $.Ctx.SetPageParam('purchase_trans', 'selectedBirthweek', null);
    $.Ctx.SetPageParam('purchase_trans', 'selectedRefDoc', null);
    $.Ctx.SetPageParam('purchase_trans', 'selectedVendor', null);
    $.Ctx.SetPageParam('purchase_trans', 'selectedProduct', null);

    //model.PRODUCTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();

    //model.MALE_QTY = 0;
    //model.MALE_WGH = 0;
    //model.MALE_AMT = 0;
    //model.FEMALE_QTY = 0;
    //model.FEMALE_WGH = 0;
    //model.FEMALE_AMT = 0;
    //model.REF_DOCUMENT_NO = null;
    //model.FARM_ORG_LOC = null;
    //model.VENDOR_CODE = null;
    //model.PRODUCT_CODE = null;
     //$.Ctx.SetPageParam('purchase_trans', 'Data', model);

}

function SearchPurchaseTran(SuccessCB){
	var cmd = $.Ctx.DbConn.createSelectCommand();
	var nameField ="";
//	if ($.Ctx.Lang=="en-US")
//		nameField = "ifnull(P.DESC_ENG, P.DESC_LOC)";
//	else
//		nameField = "ifnull(P.DESC_LOC, P.DESC_ENG)";

    cmd.sqlText = "SELECT T.FARM_ORG_LOC,T.TRANSACTION_DATE,DOCUMENT_TYPE,DOCUMENT_EXT,REF_DOCUMENT_NO,";
	cmd.sqlText += " T.MALE_QTY, T.MALE_WGH, T.FEMALE_QTY, T.FEMALE_WGH,T.FEMALE_AMT, T.MALE_AMT, T.BREEDER, T.NUMBER_OF_SENDING_DATA, P.PRODUCT_CODE, P.PRODUCT_NAME"
//    cmd.sqlText +=     ",{0} AS PRODUCT_NAME, T.NUMBER_OF_SENDING_DATA ".format([nameField]);
	cmd.sqlText += "  FROM HH_FR_MS_GROWER_PURCHASE T JOIN HH_PRODUCT_BU P ";
	cmd.sqlText += " ON T.PRODUCT_CODE = P.PRODUCT_CODE ";
	cmd.sqlText += " WHERE T.ORG_CODE=? AND T.FARM_ORG=? AND T.TRANSACTION_DATE=? AND T.DOCUMENT_TYPE = ? ORDER BY 2,3,4";
	
    cmd.parameters.push($.Ctx.SubOp);
	cmd.parameters.push($.Ctx.Warehouse);
	cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
	cmd.parameters.push($.Ctx.GetPageParam('purchase_list', 'param').DOCUMENT_TYPE);
	
    cmd.executeReader(function (tx, res) {
        if (res.rows.length !== 0) {
            var dSrc = new Array();
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_FR_MS_GROWER_PURCHASE();
                m.retrieveRdr(res.rows.item(i));
				m.PRODUCT_NAME = res.rows.item(i).PRODUCT_NAME;
                dSrc.push(m);
            }
           SuccessCB(dSrc);
        }
    }, function (err) {
        console.log(err.message);
    });
}

function DeletePurchase(farmOrgLoc, txDate, docType, docExt,docno,SuccessCB){
	var pur = new HH_FR_MS_GROWER_PURCHASE();
	var stock = new HH_FR_MS_GROWER_STOCK();
	
	pur.ORG_CODE = $.Ctx.SubOp;
	pur.FARM_ORG = $.Ctx.Warehouse;
	pur.FARM_ORG_LOC = farmOrgLoc;
	pur.TRANSACTION_DATE = txDate.toDbDateStr();
	pur.DOCUMENT_TYPE=docType;
	pur.DOCUMENT_EXT = docExt;
	
	stock.ORG_CODE = $.Ctx.SubOp;
	stock.FARM_ORG = $.Ctx.Warehouse;
	stock.FARM_ORG_LOC = farmOrgLoc;
	stock.TRANSACTION_DATE = txDate.toDbDateStr();
	stock.TRANSACTION_TYPE = '1';	//1-Receive,2-Pay
	stock.DOCUMENT_TYPE=docType;
	stock.DOCUMENT_EXT = docExt;
	
	var paramCmd = [pur.deleteCommand($.Ctx.DbConn), stock.deleteCommand($.Ctx.DbConn)];
	var trn = new DbTran($.Ctx.DbConn);
	trn.executeNonQuery(paramCmd, function(){
		if (typeof(SuccessCB)=="function")
		    SuccessCB(true);
		UpdateMatIssued(docno)
	}, function(errors){
		SuccessCB(false);
		console.log(errors);
	});
}
function UpdateMatIssued(docno) {

    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "UPDATE HH_FR_MS_MATERIAL_ISSUED SET USED = 0 WHERE DOCUMENT_NO = ?";
    cmd.parameters.push(docno);
    //cmd.parameters.push(doc_type);
    //cmd.parameters.push(product_code);


    var tran = new DbTran($.Ctx.DbConn);
    tran.executeNonQuery([cmd],
                        function (tx, res) {
                            console.log("SAVE");
                        }, function (err) {
                            console.log(err);
                        });



}