var clickAlias = "click";
//$.mobile.defaultPageTransition = 'slide';

$("#sales_list").bind("pageinit", function (event) {
	$('#sales_list #btnNew').bind(clickAlias,function(){
		ClearParamPage();
		$.Ctx.NavigatePage("sales_trans", 
			{Previous: 'sales_list', Mode:'Create', Data:null}, 
			{transition: 'slide'});
	});
	
	$('#sales_list #btnBack').bind('click',function(){
		 $.Ctx.NavigatePage($.Ctx.GetPageParam('sales_list', 'Previous'), 
			null, 
		  { transition: 'slide', reverse: true });
	});
});

$('#sales_list').bind("pagebeforecreate", function (e) {
    $.Util.RenderUiLang('sales_list');
    $.Ctx.RenderFooter('sales_list');
});
 
$("#sales_list").bind("pagebeforeshow", function (event) {
	SearchBindDataSales();
});

$("#sales_list").bind("pageshow", function (event) {
	
});

function SearchBindDataSales(){
	$('#sales_list #lv-Sales').empty();
	$('#sales_list #totalSearch').html('');
	SearchSalesTran(function(sales){
        //console.log(sales)
		var lblQty = $.Ctx.Lcl('sales_list','msgQty','QTY'),
			lblWgh = $.Ctx.Lcl('sales_list','msgWgh','WGH'),
			lblAmt = $.Ctx.Lcl('sales_list','msgAmt','AMT');
		var qtyAll = wghAll = amtAll = 0;
		for (var i=0;i<sales.length;i++){
			var key = sales[i].FARM_ORG_LOC+ '|' +sales[i].TRANSACTION_DATE+ '|' + sales[i].DOCUMENT_TYPE + '|' + sales[i].DOCUMENT_EXT;
			var noSd = (sales[i].NUMBER_OF_SENDING_DATA==null?0:sales[i].NUMBER_OF_SENDING_DATA);
			var html = '<li code="'+ key + '" data-swipeurl="#" noSd="'+ noSd + '">'; 
			html += '<a href="#">';
			html+='<h3>'+ sales[i].FARM_ORG_LOC +'</h3>';
			var sumqty = (sales[i].MALE_QTY==null ? 0:sales[i].MALE_QTY) + (sales[i].FEMALE_QTY==null ? 0:sales[i].FEMALE_QTY);
			var sumwgt = (sales[i].MALE_WGH==null ? 0:sales[i].MALE_WGH) + (sales[i].FEMALE_WGH==null ? 0:sales[i].FEMALE_WGH);
			var sumamt = (sales[i].MALE_AMT==null ? 0:sales[i].MALE_AMT) + (sales[i].FEMALE_AMT==null ? 0:sales[i].FEMALE_AMT);
			qtyAll+=sumqty;
			wghAll+=sumwgt;
			amtAll+=sumamt;
			html+='<p><strong>{0}, {1} - {2}, {3} - {4}, {5} - {6}</strong></p>'.format([sales[i].PRODUCT_NAME, lblQty, accounting.formatNumber(sumqty,0,","), lblWgh ,accounting.formatNumber(sumwgt,2,","), lblAmt, accounting.formatNumber(sumamt,2,",")]);
			html+='<div class="ui-li-count">'+ parseDbDateStr(sales[i].TRANSACTION_DATE).toUIShortDateStr() +'</div>';
			html+='</a>';
			html+='</li>';
			$("#sales_list #lv-Sales").append(html);
		}
		$('#sales_list #lv-Sales').listview('refresh');
		
		if (qtyAll>0||wghAll>0||amtAll>0) {
            $('#sales_list #totalSearch').html(
				$.Ctx.Lcl('iFarm', 'msgTotalSearch99', 'Total Qty:{0}, Total Wgh:{1}, Total Amt:{2}').format([accounting.formatNumber(qtyAll,0,","),accounting.formatNumber(wghAll,2,","),accounting.formatNumber(amtAll,2,",")]));
        }	
		
		$('#sales_list #lv-Sales li').swipeDelete({
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
						DeleteSale(keys[0], parseUIDateStr(keys[1]), keys[2], keys[3],function(succ){
							if (succ==true){
								//$.Ctx.MsgBox('Delete Success');
								SearchBindDataSales();
							}
						});
					}
				}else{
					//$.Ctx.MsgBox('Data Sent, Cannot Delete.');
					$.Ctx.MsgBox($.Ctx.Lcl('sales_list', 'msgCannotDeleteItem', 'Cannot delete this item'));
				}
			}
		});
		
		$('#sales_list #lv-Sales li').bind(clickAlias, function(){
			ClearParamPage();
			var noSend = $(this).attr("noSd");
			var keyCode = $(this).attr("code");
			var keys = keyCode.split('|');
			//===========TRANSACTION_DATE must be string cause is in ParamPage!!!!!
			$.Ctx.SetPageParam('sales_trans', 'Key',{'FARM_ORG_LOC':keys[0],'TRANSACTION_DATE':keys[1],'DOCUMENT_TYPE':keys[2], 'DOCUMENT_EXT': Number(keys[3]) } );
			//console.log($.Ctx.GetPageParam('sales_trans', 'Key'));
			var md = 'Update';
			if (noSend!=="0") md = 'Display';

			$.Ctx.NavigatePage("sales_trans", 
				{ Previous: 'sales_list', Mode:md}, 
				{ transition: 'slide' });
		});
		

    });
}

function ClearParamPage(){
	$.Ctx.SetPageParam('sales_trans', 'Data', null);
	$.Ctx.SetPageParam('sales_trans', 'selectedFarmOrg', null);
	$.Ctx.SetPageParam('cust_pig', 'Data', null);
	$.Ctx.SetPageParam('sales_trans', 'selectedProduct', null);
	$.Ctx.SetPageParam('sales_trans', 'selectedBreeder', null);
	$.Ctx.SetPageParam('sales_trans', 'selectedBirthweek', null);
	$.Ctx.SetPageParam('sales_trans', 'selectedGrade', null);
}

function SearchSalesTran(SuccessCB){
	var cmd = $.Ctx.DbConn.createSelectCommand();
	var nameField ="";
	if ($.Ctx.Lang=="en-US")
		nameField = "ifnull(P.PRODUCT_NAME, P.PRODUCT_SHORT_NAME)";
	else
		nameField = "ifnull(P.PRODUCT_NAME, P.PRODUCT_SHORT_NAME    )";

    cmd.sqlText = "SELECT T.FARM_ORG_LOC,T.TRANSACTION_DATE,DOCUMENT_TYPE,DOCUMENT_EXT,";
	cmd.sqlText += " T.MALE_QTY, T.MALE_WGH, T.FEMALE_QTY, T.FEMALE_WGH, T.FEMALE_AMT, T.MALE_AMT "
    cmd.sqlText += ", {0} AS PRODUCT_NAME, T.NUMBER_OF_SENDING_DATA ".format([nameField]);
	cmd.sqlText += " FROM HH_FR_MS_GROWER_SALE T JOIN HH_PRODUCT_BU P ";
	cmd.sqlText += " ON T.PRODUCT_CODE = P.PRODUCT_CODE ";
	cmd.sqlText += " WHERE T.ORG_CODE=? AND T.FARM_ORG=? AND T.TRANSACTION_DATE=?";
	
    cmd.parameters.push($.Ctx.SubOp);
	cmd.parameters.push($.Ctx.Warehouse);
	//cmd.parameters.push('2012-12-01');
	cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
	console.log(cmd)
    cmd.executeReader(function (tx, res) {
        if (res.rows.length !== 0) {
            var dSrc = new Array();
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_FR_MS_GROWER_SALE();
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

function DeleteSale(farmOrgLoc, txDate, docType, docExt,SuccessCB){
	var sale = new HH_FR_MS_GROWER_SALE();
	var stock = new HH_FR_MS_GROWER_STOCK();
	
	sale.ORG_CODE = $.Ctx.SubOp;
	sale.FARM_ORG = $.Ctx.Warehouse;
	sale.FARM_ORG_LOC = farmOrgLoc;
	sale.TRANSACTION_DATE = txDate.toDbDateStr();
	sale.DOCUMENT_TYPE=docType;
	sale.DOCUMENT_EXT = docExt;
	
	stock.ORG_CODE = $.Ctx.SubOp;
	stock.FARM_ORG = $.Ctx.Warehouse;
	stock.FARM_ORG_LOC = farmOrgLoc;
	stock.TRANSACTION_DATE = txDate.toDbDateStr();
	stock.TRANSACTION_TYPE = '2';
	stock.DOCUMENT_TYPE=docType;
	stock.DOCUMENT_EXT = docExt;
	
	var paramCmd = [sale.deleteCommand($.Ctx.DbConn), stock.deleteCommand($.Ctx.DbConn)];
	var trn = new DbTran($.Ctx.DbConn);
	trn.executeNonQuery(paramCmd, function(){
		if (typeof(SuccessCB)=="function")
			SuccessCB(true);
	}, function(errors){
		SuccessCB(false);
		console.log(errors);
	});
}
