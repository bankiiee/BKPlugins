		 //   $.Ctx.SetPageParam('transfer_feed_list', 'param', { "product_stock_type": "10", "transaction_type": "2", "transaction_code": "42", "document_type": "63", "cal_type": "1", "stock_location": "FARM", "captionHeader": "HeaderFeedTransfer" });
		    var clickAlias = "click";
		    //$.mobile.defaultPageTransition = 'slide';
		    var docTypeMat = "DCTYP41", DEF_STK_LOC = "CENTER", DEF_ENTRY_TYP = "1";
		    var PM_STK_TYPE_KEY = "product_stock_type",
	PM_DOC_TYPE_KEY = "document_type",
	PM_STK_LOC_KEY = "stock_location",
	PM_STK_CAL_TYPE_KEY = "cal_type",
	PM_TRAN_TYPE_KEY = "transaction_type",
	PM_TRAN_COD_KEY = "transaction_code";
		    var PM_TO_FARM_TRAN_TYPE_KEY = "to_farm_transaction_type";
		    $("#transfer_feed_list").bind("pageinit", function (event) {
		        var pParam = $.Ctx.GetPageParam('transfer_feed_list', 'param');
		        try {
		            $("#transfer_feed_list #captionHeader").text($.Ctx.Lcl('transfer_feed_list', pParam['captionHeader'], 'Transfer Feed'));
		        } catch (e) {
		            alert(e)
		            $("#transfer_feed_list #captionHeader").text($.Ctx.Lcl('transfer_feed_list', 'captionHeader', 'Transfer Feed'));
		        }

		        $('#transfer_feed_list #btnNew').bind(clickAlias, function () {
		            ClearParamPage();
		            $.Ctx.SetPageParam('transfer_feed_trans', 'Data', null);
		            $.Ctx.SetPageParam('transfer_feed_trans', 'Key', null);
		            
		            $.Ctx.NavigatePage("transfer_feed_trans",
			{ Previous: 'transfer_feed_list', Mode: 'Create', Data: null },
			{ transition: 'slide' });
		        });

		        $('#transfer_feed_list #btnManual').bind(clickAlias, function () {
		            ClearParamPage();
		            $.Ctx.NavigatePage("transfer_feed_trans",
			{ Previous: 'transfer_feed_list', Mode: 'Create', Data: null },
			{ transition: 'slide' });
		        });

		        $('#transfer_feed_list #btnBack').bind('click', function () {
		            $.Ctx.NavigatePage($.Ctx.GetPageParam('transfer_feed_list', 'Previous'),
			null,
		 { transition: 'slide', reverse: true });
		        });
		    });

		    $('#transfer_feed_list').bind("pagebeforecreate", function (e) {
		        $.Util.RenderUiLang('transfer_feed_list');
		        $.Ctx.RenderFooter('transfer_feed_list');
		    });

		    $("#transfer_feed_list").bind("pagebeforeshow", function (event) {
		        BindDataMatMoveGrp();
		    });

		    function BindDataMatMoveGrp(SuccessCB) {
		        $("#transfer_feed_list #collaps-content").empty();
		        $('#transfer_feed_list #totalSearch').html('');
		        SearchFeedMoveTranGroup(function (farms) {
		            if (farms == null) return false;
		            $('#collaps-content').empty();
		            var lblFarm = $.Ctx.Lcl('transfer_feed_list', 'msgFarm', 'Farm'),
		    lblQty = $.Ctx.Lcl('transfer_feed_list', 'msgQty', 'QTY'),
			lblWgh = $.Ctx.Lcl('transfer_feed_list', 'msgWgh', 'WGH');
		            var qtyAll = wghAll = amtAll = 0;
		            $.each(farms, function (i, obj) {
		                var s = '<div data-role="collapsible" data-theme="c" data-content-theme="c" id="farmOrg' + obj.FARM_ORG_LOC + '">';
		                s += '<h4>';
		                s += '<div class="ui-grid-a" style="font-size:small;">';
		                s += '	<div class="ui-block-a" style="text-align:left;width:30%">{0} {1}</div>'.format([obj.FARM_ORG_LOC, obj.FARM_ORG_NAME]);
		                s += '	<div class="ui-block-b" style="float:right;text-align:right;">';
		                s += '		{0}:{1}, {2}:{3}'.format([lblQty, accounting.formatNumber(obj.S_QTY, 0, ","), lblWgh, accounting.formatNumber(obj.S_WGH, 2, ",")]);
		                s += '	</div>';
		                s += '</div>';
		                s += '</h4>';
		                s += '<ul id="farmOrg' + obj.FARM_ORG_LOC + '-content"  data-role="listview" data-inset="true" data-filter="true"> </ul>';
		                s += '</div>';
		                $('#collaps-content').append(s);
		                qtyAll += obj.S_QTY;
		                wghAll += obj.S_WGH;
		            });
		            $("div[data-role='collapsible']").collapsible({ refresh: true });

		            if (qtyAll > 0 || wghAll > 0 || amtAll > 0) {
		                $('#transfer_feed_list #totalSearch').html(
				$.Ctx.Lcl('iFarm', 'msgTotalSearch99', 'Total Qty:{0}, Total Wgh:{1}, Total Amt:{2}').format([accounting.formatNumber(qtyAll, 0, ","), accounting.formatNumber(wghAll, 2, ","), accounting.formatNumber(amtAll, 2, ",")]));
		            }

		            $("div[id^='farmOrg']").bind("expand", function (event, ui) {
		                var id = $(this).attr('id');
		                var content = id + '-content';
		                var farmOrg = id.replace('farmOrg', '');
		                BindListDetailMatMove(content, farmOrg);
                         $.FarmCtx.SearchFarmOrgUsingMapMobile(function (orgs) {
                             if (orgs !== null) {
                                 $.Ctx.SetPageParam('transfer_feed_list', 'FarmOrgListInHusbandry', orgs);
                             }
                             else {
                                 $.Ctx.SetPageParam('transfer_feed_list', 'FarmOrgListInHusbandry', null);
                             }
                });
		                return false;
		            });
		            if (typeof SuccessCB == 'function') SuccessCB(true);
		        });
		    }

		    function BindListDetailMatMove(parentId, farmOrg) {
		        $('#transfer_feed_list #' + parentId).empty();
		        SearchMatMoveTranByfarmOrg(farmOrg, function (ret) {
		            var lblQty = $.Ctx.Lcl('transfer_feed_list', 'msgQty', 'QTY'),
			lblWgh = $.Ctx.Lcl('transfer_feed_list', 'msgWgh', 'WGH');

		            if (ret == null) return false;

		            for (var i = 0; i < ret.length; i++) {
		                var key = ret[i].ORG_CODE + '|' + ret[i].FARM_ORG + '|' + ret[i].FARM_ORG_LOC + '|' + ret[i].TRANSACTION_DATE + '|' + ret[i].DOCUMENT_TYPE + '|' + ret[i].DOCUMENT_EXT;
		                key += '|' + ret[i].PRODUCT_CODE + '|' + ret[i].QTY + '|' + ret[i].WGH + '|' + ret[i].PRODUCT_CODE +'|' + ret[i].TO_FARM_ORG_LOC ;
		                var noSd = (ret[i].NUMBER_OF_SENDING_DATA == null ? 0 : ret[i].NUMBER_OF_SENDING_DATA);

		                var html = '<li code="' + key + '" data-swipeurl="#" noSd="' + noSd + '">';
		                html += '<a href="#">';
		                html += '<h4>' + ret[i].TO_FARM_ORG_LOC + ' ' + ret[i].TO_FARM_ORG_LOC_NAME + ' - ' + ret[i].PRODUCT_CODE + ' ' + ret[i].PRODUCT_NAME + '</h4>';
		                var sumqty = (ret[i].QTY == null ? 0 : ret[i].QTY);
		                var sumwgt = (ret[i].WGH == null ? 0 : ret[i].WGH);
		                html += '<p><strong>{0} - {1}, {2} - {3}</strong></p>'.format([lblQty, accounting.formatNumber(sumqty, 0, ","), lblWgh, accounting.formatNumber(sumwgt, 2, ",")]);
		                html += '<div class="ui-li-count">' + parseDbDateStr(ret[i].TRANSACTION_DATE).toUIShortDateStr() + '</div>';
		                html += '</a>';
		                html += '</li>';
		                $("#transfer_feed_list #" + parentId).append(html);
		            }
		            $("#transfer_feed_list #" + parentId).listview();
		            $("#transfer_feed_list #" + parentId).listview('refresh');

		            $("#transfer_feed_list #" + parentId + ' li').swipeDelete({
		                btnTheme: 'r',
		                btnLabel: 'Delete',
		                btnClass: 'aSwipeButton',
		                click: function (e) {
		                    e.stopPropagation();
		                    e.preventDefault();
		                    var noSend = $(this).parents('li').attr('noSd');
		                    if (noSend == "0") {
		                        var keyCode = $(this).parents('li').attr('code');

		                        var keys = keyCode.split('|');
		                        if (keys.length == 11) {
		                            DeleteMatMove(keys[0], keys[1], keys[2], keys[3], keys[4], keys[5], keys[6], keys[7], keys[8], keys[9] , keys[10], function (succ) {
		                                if (succ == true) {
		                                    //$.Ctx.MsgBox('Delete Success');
		                                    BindDataMatMoveGrp(function (succ) {
		                                        var coll = parentId.replace('-content', '');
		                                        $("#transfer_feed_list #" + coll).trigger("expand");
		                                    });
		                                }
		                            });
		                        }
		                    } else {
		                        $.Ctx.MsgBox($.Ctx.Lcl('transfer_feed_list', 'msgCannotDeleteItem', 'Cannot delete this item'));
		                    }
		                }
		            });

		            $("#transfer_feed_list #" + parentId + ' li').bind(clickAlias, function () {
		                ClearParamPage();
		                var noSend = $(this).attr("noSd");
		                var keyCode = $(this).attr("code");
		                var keys = keyCode.split('|');
		                //===========TRANSACTION_DATE must be string cause is in ParamPage!!!!!

		                // var key = ret[i].ORG_CODE + '|' + ret[i].FARM_ORG + '|' + ret[i].FARM_ORG_LOC + '|' + ret[i].TRANSACTION_DATE + '|' + ret[i].DOCUMENT_TYPE + '|' + ret[i].DOCUMENT_EXT;
		                //key += '|' + ret[i].PRODUCT_CODE + '|' + ret[i].QTY + '|' + ret[i].WGH;
		                $.Ctx.SetPageParam('transfer_feed_trans', 'Key',
                        {
                            'ORG_CODE': keys[0],
                            'FARM_ORG': keys[1],
                            'FARM_ORG_LOC': keys[2],
                            'TRANSACTION_DATE': keys[3],
                            'DOCUMENT_TYPE': keys[4],
                            'DOCUMENT_EXT': Number(keys[5]),
                            'PRODUCT_CODE': keys[6],
                            'QTY': keys[7],
                            'WGH': keys[8]
                        });
		               
		                var md = 'Update';
		                if (noSend !== "0") md = 'Display';

		                $.Ctx.NavigatePage("transfer_feed_trans",
				{ Previous: 'transfer_feed_list', Mode: md },
				{ transition: 'slide' });
		            });
		        });
		    }

		    function ClearParamPage() {
		        $.Ctx.SetPageParam('transfer_feed_trans', 'Data', {});
		        $.Ctx.SetPageParam('transfer_feed_trans', 'selectedProduct', null);
		        $.Ctx.SetPageParam('transfer_feed_trans', 'selectedToFarmOrg', null);
		        $.Ctx.SetPageParam('transfer_feed_trans', 'selectedFarmOrg', null);
                $.Ctx.SetPageParam('transfer_feed_trans' , 'FarmOrgListInHusbandry' , null);
		    }

		    function SearchFeedMoveTranGroup(SuccessCB) {
		        var pParam = $.Ctx.GetPageParam('transfer_feed_list', 'param');
		        var stkType = null;
		        var tranType = ''; 
		        try {
		            docTypeMat = pParam[PM_DOC_TYPE_KEY];
		            stkType = pParam[PM_STK_TYPE_KEY];
		            tranType = pParam[PM_TRAN_TYPE_KEY];
		        } catch (e) {//Set Default
		            docTypeMat = "DCTYP41";
		            stkType = "10";
		            tranType = "2"
		        }

		        var cmd = $.Ctx.DbConn.createSelectCommand();
		        var nameField = $.Ctx.Lang == "en-US" ? "ifnull(farmOrg.NAME_ENG, farmOrg.NAME_LOC)" : "ifnull(farmOrg.NAME_LOC, farmOrg.NAME_ENG)";
		        
              cmd.sqlText = " select matMove.* , {0} as FARM_ORG_NAME  from ( ".format([nameField]) ;
              cmd.sqlText += " select FARM_ORG_LOC , transaction_date ,  ";
              cmd.sqlText += " sum(qty  ) as S_QTY , sum(wgh) as S_WGH ";
              cmd.sqlText += " from hh_fr_ms_material_move ";
              cmd.sqlText += " where transaction_date = ? ";
              cmd.sqlText += " and transaction_type = ? ";
              cmd.sqlText += " group by ";
              cmd.sqlText += " farm_org_loc , transaction_date ";
              cmd.sqlText += " ) matMove , ";
              cmd.sqlText += " fr_farm_org farmOrg  ";
              cmd.sqlText += " where ";
              cmd.sqlText += " matMove.farm_org_loc  = farmOrg.farm_org ";

              cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
		        cmd.parameters.push(tranType);
		        
		        cmd.executeReader(function (tx, res) {
		            if (res.rows.length !== 0) {
		                var dSrc = new Array();
		                for (var i = 0; i < res.rows.length; i++) {
		                    dSrc.push({ 'FARM_ORG_LOC': res.rows.item(i).FARM_ORG_LOC,
                                'FARM_ORG_NAME' : res.rows.item(i).FARM_ORG_NAME ,
		                        'S_QTY': res.rows.item(i).S_QTY,
		                        'S_WGH': res.rows.item(i).S_WGH
		                    });
		                }
		                SuccessCB(dSrc);
		            }
		        }, function (err) {
		            console.log(err.message);
		        });
		    }

		    function SearchMatMoveTranByfarmOrg(farmOrg, SuccessCB) {
		        var pParam = $.Ctx.GetPageParam('transfer_feed_list', 'param');
		        var stkType = null;
		        var tranType = ''; 
		        try {
		            docTypeMat = pParam[PM_DOC_TYPE_KEY];
		            stkType = pParam[PM_STK_TYPE_KEY];
		            tranType = pParam[PM_TRAN_TYPE_KEY]; 
		        } catch (e) {//Set Default

		        }
		        var cmd = $.Ctx.DbConn.createSelectCommand();
		        var farmOrgNameField = $.Ctx.Lang == "en-US" ? "ifnull(farmOrg.NAME_ENG, farmOrg.NAME_LOC)" : "ifnull(farmOrg.NAME_LOC, farmOrg.NAME_ENG)";
		        var toFarmOrgNameField = $.Ctx.Lang == "en-US" ? "ifnull(toFarmOrg.NAME_ENG, toFarmOrg.NAME_LOC)" : "ifnull(toFarmOrg.NAME_LOC, toFarmOrg.NAME_ENG)";
		cmd.sqlText = " select matmove.org_code , matMove.farm_org ,  matMove.farm_org_loc  , ";
		cmd.sqlText += " {0} as FARM_ORG_LOC_NAME  , matMove.transaction_date , ".format([farmOrgNameField]);
cmd.sqlText += " matMove.document_type , matMove.qty   ,  matMove.wgh , matMove.DOCUMENT_EXT , ";
cmd.sqlText += " matMove.PRODUCT_CODE , product.PRODUCT_NAME  , matMove.NUMBER_OF_SENDING_DATA ";
 cmd.sqlText += " , matMove.TO_FARM_ORG_LOC ";
 cmd.sqlText += " , {0} as TO_FARM_ORG_LOC_NAME ".format([toFarmOrgNameField]);
  cmd.sqlText += " from hh_fr_ms_material_move  matMove, ";
cmd.sqlText += " fr_farm_org farmOrg  ,  ";
cmd.sqlText += " hh_product_bu product ,  ";
cmd.sqlText += " fr_farm_org toFarmOrg ";
cmd.sqlText += " where matMove.transaction_date = ? ";
cmd.sqlText += " and matMove.transaction_type = ?  ";
cmd.sqlText += " and matMove.farm_org_loc  = ? ";
cmd.sqlText += " and matMove.farm_org_loc  = farmOrg.farm_org ";
 cmd.sqlText += " and matmove.product_code = product.product_code ";
cmd.sqlText += " and matMove.to_farm_org_loc  = toFarmOrg.farm_org ";
cmd.sqlText += " order by matMove.document_ext "


		        
		        cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
		        cmd.parameters.push(tranType);
		        cmd.parameters.push(farmOrg);

		        cmd.executeReader(function (tx, res) {
		            if (res.rows.length !== 0) {
		                var dSrc = new Array();
		                for (var i = 0; i < res.rows.length; i++) {
		                    var t = new HH_FR_MS_MATERIAL_MOVE();
		                    t.retrieveRdr(res.rows.item(i));
		                    t.PRODUCT_NAME = res.rows.item(i).PRODUCT_NAME;
		                    t.FARM_ORG_LOC_NAME = res.rows.item(i).FARM_ORG_LOC_NAME;
		                    t.TO_FARM_ORG_LOC_NAME = res.rows.item(i).TO_FARM_ORG_LOC_NAME;
		                    dSrc.push(t);
		                }
		                if (typeof SuccessCB == 'function') SuccessCB(dSrc);
		            }
		        }, function (err) {
		            console.log(err.message);
		        });
		    }

		    function DeleteMatMove(orgCode, farmOrg, farmOrgLoc, txDate, docType, docExt, prdCod, qty, wgh, productCode, toFarmOrgLoc, SuccessCB) {
		        //var key = ret[i].ORG_CODE + '|' + ret[i].FARM_ORG + '|' + ret[i].FARM_ORG_LOC + '|' + ret[i].TRANSACTION_DATE + '|' + ret[i].DOCUMENT_TYPE + '|' + ret[i].DOCUMENT_EXT;
		        //key += '|' + ret[i].PRODUCT_CODE + '|' + ret[i].QTY + '|' + ret[i].WGH + '|' + ret.PRODUCT_CODE;

		        var pParam = $.Ctx.GetPageParam('transfer_feed_list', 'param');
		        var caltyp = 1, trantyp = null, tranCod = null, stkType = null;
		        try {
		            caltyp = Number(pParam[PM_STK_CAL_TYPE_KEY]);
		            trantyp = pParam[PM_TRAN_TYPE_KEY];
		            tranCod = pParam[PM_TRAN_COD_KEY];
		            stkType = pParam[PM_STK_TYPE_KEY];
		            toFarmTranType = pParam[PM_TO_FARM_TRAN_TYPE_KEY];
		        } catch (e) {//Set Default
		            caltyp = 1;
		            trantyp = '2';
		            tranCod = '00';
		            stkType = "10";
		            toFarmTranType = '1';
		        }

                var matMove = new HH_FR_MS_MATERIAL_MOVE();
		        var stkTran = new S1_ST_STOCK_TRN(); 
		        var sb = new S1_ST_STOCK_BALANCE();
                
		        matMove.ORG_CODE = orgCode; 
		        matMove.FARM_ORG = farmOrg;
		        matMove.FARM_ORG_LOC = farmOrgLoc;
		        matMove.TRANSACTION_DATE = txDate;
		        matMove.DOCUMENT_TYPE = docType;
		        matMove.DOCUMENT_EXT = docExt;
                /*
		        var s = new XDate(txDate);
		        var y = ('' + s.getFullYear()), m = ('' + (s.getMonth() + 1)).lpad("0", 2), d = ('' + s.getDate()).length == 2 ? ('' + s.getDate()) : ('' + s.getDate()).lpad("0", 2);
		       
		        stkTran.COMPANY = $.Ctx.ComCode;
		        stkTran.OPERATION = $.Ctx.Op;
		        stkTran.SUB_OPERATION = $.Ctx.SubOp;
		        stkTran.BUSINESS_UNIT = $.Ctx.Bu;
		        stkTran.DOC_TYPE = docType;
		        stkTran.DOC_NUMBER = y + m + d;
		        stkTran.EXT_NUMBER = docExt;
                */
		        var cmdArr = [matMove.deleteCommand($.Ctx.DbConn)];  //, stkTran.deleteCommand($.Ctx.DbConn)];

                 
                  var FarmOrgListInHusbandry = $.Ctx.GetPageParam('transfer_feed_list', 'FarmOrgListInHusbandry');
                    var checkTransToFarmSameHusbandry = _.where(FarmOrgListInHusbandry, { CODE: toFarmOrgLoc });

                    if (checkTransToFarmSameHusbandry.length != 0)
                    {
                     matMove.ORG_CODE = orgCode;
		        matMove.FARM_ORG = farmOrg;
		        matMove.FARM_ORG_LOC = toFarmOrgLoc;
		        matMove.TRANSACTION_DATE = txDate;
		        matMove.DOCUMENT_TYPE = docType;
		        matMove.DOCUMENT_EXT = docExt; //( typeof docExt == "string"?Number(docExt) : docExt ) +1;

                cmdArr.push(matMove.deleteCommand($.Ctx.DbConn) ) ; 
/*
                stkTran.COMPANY = $.Ctx.ComCode;
		        stkTran.OPERATION = $.Ctx.Op;
		        stkTran.SUB_OPERATION = $.Ctx.SubOp;
		        stkTran.BUSINESS_UNIT = $.Ctx.Bu;
		        stkTran.DOC_TYPE = docType;
		        stkTran.DOC_NUMBER = y + m + d;
		        stkTran.EXT_NUMBER = matMove.DOCUMENT_EXT ;
                cmdArr.push(stkTran.deleteCommand($.Ctx.DbConn) ) ; 
                */
                    }
		       


		        $.FarmCtx.setS1StockCommand(toFarmOrgLoc , '', productCode, '', 'Delete', 0, 0, wgh, qty,
                 cmdArr, toFarmTranType, function (cmdArr) {
                     $.FarmCtx.setS1StockCommand(farmOrgLoc , '', productCode, '', 'Delete', 0, 0, wgh, qty,
                 cmdArr, trantyp, function (cmdArr) {
                     var trn = new DbTran($.Ctx.DbConn);
                     trn.executeNonQuery(cmdArr, function () {
                         if (typeof (SuccessCB) == "function")

                             SuccessCB(true);
                     }, function (errors) {
                         SuccessCB(false);
                         console.log(errors);
                     });
                 }, function () {
                     console.log('Set Stock Command Error');
                 });
             }, function () {
                 console.log('Set Stock Command Error Type 1');
                 });

		      

                
		    }