
            //$.Ctx.SetPageParam('receive_medical_list', 'param', { "product_stock_type": "20", "transaction_type": "1", "transaction_code": "21", "document_type": "65", "cal_type": "1", "stock_location": "FARM", "captionHeader": "HeaderPurMed" });
            var clickAlias = "click";
            //$.mobile.defaultPageTransition = 'slide';
            var docTypeMat = "DCTYP41", DEF_STK_LOC = "CENTER", DEF_ENTRY_TYP = "1";
            var PM_STK_TYPE_KEY = "product_stock_type",
	PM_DOC_TYPE_KEY = "document_type",
	PM_STK_LOC_KEY = "stock_location",
	PM_STK_CAL_TYPE_KEY = "cal_type",
	PM_TRAN_TYPE_KEY = "transaction_type",
	PM_TRAN_COD_KEY = "transaction_code";

            $("#receive_medical_list").bind("pageinit", function (event) {
                var pParam = $.Ctx.GetPageParam('receive_medical_list', 'param');
                try {
                    $("#receive_medical_list #captionHeader").text($.Ctx.Lcl('receive_medical_list', pParam['captionHeader'], 'Receive Medical'));
                } catch (e) {
                    alert(e)
                    $("#receive_medical_list #captionHeader").text($.Ctx.Lcl('receive_medical_list', 'captionHeader', 'Receive Medical'));
                }

                $('#receive_medical_list #btnNew').bind(clickAlias, function () {
                    ClearParamPage();
                    $.Ctx.SetPageParam('receive_medical_trans', 'Data', null);
                    $.Ctx.SetPageParam('receive_medical_trans', 'selectedRefDoc', null);
                    $.Ctx.SetPageParam('receive_medical_trans', 'Key', null);

                    $.Ctx.NavigatePage("receive_medical_trans",
			{ Previous: 'receive_medical_list', Mode: 'Create', Data: null },
			{ transition: 'slide' });
                });

                $('#receive_medical_list #btnManual').bind(clickAlias, function () {
                    ClearParamPage();
                    $.Ctx.NavigatePage("receive_medical_trans",
			{ Previous: 'receive_medical_list', Mode: 'Create', Data: null },
			{ transition: 'slide' });
                });

                $('#receive_medical_list #btnBack').bind('click', function () {
                    $.Ctx.NavigatePage($.Ctx.GetPageParam('receive_medical_list', 'Previous'),
			null,
		 { transition: 'slide', reverse: true });
                });
            });

            $('#receive_medical_list').bind("pagebeforecreate", function (e) {
                $.Util.RenderUiLang('receive_medical_list');
                $.Ctx.RenderFooter('receive_medical_list');
            });

            $("#receive_medical_list").bind("pagebeforeshow", function (event) {
                BindDataPurchaseGrp();
            });

            function BindDataPurchaseGrp(SuccessCB) {
                $("#receive_medical_list #collaps-content").empty();
                $('#receive_medical_list #totalSearch').html('');
                SearchPurchaseMatTranGroup(function (farms) {
                    if (farms == null) return false;
                    $('#collaps-content').empty();
                    var lblFarm = $.Ctx.Lcl('receive_medical_list', 'msgFarm', 'Farm'),
		    lblQty = $.Ctx.Lcl('receive_medical_list', 'msgQty', 'QTY'),
			lblWgh = $.Ctx.Lcl('receive_medical_list', 'msgWgh', 'WGH');
                    var qtyAll = wghAll = amtAll = 0;
                    $.each(farms, function (i, obj) {
                        var s = '<div data-role="collapsible" data-theme="c" data-content-theme="c" id="docNo' + obj.REF_DOCUMENT_NO + '">';
                        s += '<h4>';
                        s += '<div class="ui-grid-a" style="font-size:small;">';
                        s += '	<div class="ui-block-a" style="text-align:left;width:30%">{0}</div>'.format([obj.REF_DOCUMENT_NO]);
                        s += '	<div class="ui-block-b" style="float:right;text-align:right;">';
                        s += '		{0}:{1}, {2}:{3}'.format([lblQty, accounting.formatNumber(obj.S_QTY, 0, ","), lblWgh, accounting.formatNumber(obj.S_WGH, 2, ",")]);
                        s += '	</div>';
                        s += '</div>';
                        s += '</h4>';
                        s += '<ul id="docNo' + obj.REF_DOCUMENT_NO + '-content"  data-role="listview" data-inset="true" data-filter="true"> </ul>';
                        s += '</div>';
                        $('#collaps-content').append(s);
                        qtyAll += obj.S_QTY;
                        wghAll += obj.S_WGH;
                    });
                    $("div[data-role='collapsible']").collapsible({ refresh: true });

                    if (qtyAll > 0 || wghAll > 0 || amtAll > 0) {
                        $('#receive_medical_list #totalSearch').html(
				$.Ctx.Lcl('iFarm', 'msgTotalSearch99', 'Total Qty:{0}, Total Wgh:{1}, Total Amt:{2}').format([accounting.formatNumber(qtyAll, 0, ","), accounting.formatNumber(wghAll, 2, ","), accounting.formatNumber(amtAll, 2, ",")]));
                    }

                    $("div[id^='docNo']").bind("expand", function (event, ui) {
                        var id = $(this).attr('id');
                        var content = id + '-content';
                        var docNo = id.replace('docNo', '');
                        BindListDetailPur(content, docNo);
                        return false;
                    });
                    if (typeof SuccessCB == 'function') SuccessCB(true);
                });
            }

            function BindListDetailPur(parentId, docNo) {
                $('#receive_medical_list #' + parentId).empty();
                SearchPurchaseMatTranByDocNo(docNo, function (ret) {
                    var lblQty = $.Ctx.Lcl('receive_medical_list', 'msgQty', 'QTY'),
			lblWgh = $.Ctx.Lcl('receive_medical_list', 'msgWgh', 'WGH'),
			lblAmt = $.Ctx.Lcl('receive_medical_list', 'msgAmt', 'AMT');
                    if (ret == null) return false;

                    for (var i = 0; i < ret.length; i++) {
                        var key = ret[i].FARM_ORG + '|' + ret[i].TRANSACTION_DATE + '|' + ret[i].DOCUMENT_TYPE + '|' + ret[i].DOCUMENT_EXT;
                        key += '|' + ret[i].PRODUCT_CODE + '|' + ret[i].QTY + '|' + ret[i].WGH;
                        var noSd = (ret[i].NUMBER_OF_SENDING_DATA == null ? 0 : ret[i].NUMBER_OF_SENDING_DATA);

                        var html = '<li code="' + key + '" data-swipeurl="#" noSd="' + noSd + '">';
                        html += '<a href="#">';
                        html += '<h4>' + ret[i].FARM_ORG_NAME + ' - ' + ret[i].PRODUCT_NAME + '</h4>';
                        var sumqty = (ret[i].QTY == null ? 0 : ret[i].QTY);
                        var sumwgt = (ret[i].WGH == null ? 0 : ret[i].WGH);
                        var amt = (ret[i].NET_AMT == null ? 0 : ret[i].NET_AMT);
                        html += '<p><strong>{0} - {1}, {2} - {3}</strong></p>'.format([lblQty, accounting.formatNumber(sumqty, 0, ","), lblWgh, accounting.formatNumber(sumwgt, 2, ",")]);
                        html += '<div class="ui-li-count">' + parseDbDateStr(ret[i].TRANSACTION_DATE).toUIShortDateStr() + '</div>';
                        html += '</a>';
                        html += '</li>';
                        $("#receive_medical_list #" + parentId).append(html);
                    }
                    $("#receive_medical_list #" + parentId).listview();
                    $("#receive_medical_list #" + parentId).listview('refresh');

                    $("#receive_medical_list #" + parentId + ' li').swipeDelete({
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
                                if (keys.length == 7) {
                                    DeletePurchaseMat(keys[0], parseUIDateStr(keys[1]), keys[2], keys[3], keys[4], keys[5], keys[6], function (succ) {
                                        if (succ == true) {
                                            //$.Ctx.MsgBox('Delete Success');
                                            BindDataPurchaseGrp(function (succ) {
                                                var coll = parentId.replace('-content', '');
                                                $("#receive_medical_list #" + coll).trigger("expand");
                                            });
                                        }
                                    });
                                }
                            } else {
                                $.Ctx.MsgBox($.Ctx.Lcl('receive_medical_list', 'msgCannotDeleteItem', 'Cannot delete this item'));
                            }
                        }
                    });

                    $("#receive_medical_list #" + parentId + ' li').bind(clickAlias, function () {
                        ClearParamPage();
                        var noSend = $(this).attr("noSd");
                        var keyCode = $(this).attr("code");
                        var keys = keyCode.split('|');
                        //===========TRANSACTION_DATE must be string cause is in ParamPage!!!!!
                        
                        $.Ctx.SetPageParam('receive_medical_trans', 'Key', { 'FARM_ORG': keys[0],
                            'TRANSACTION_DATE': keys[1],
                            'DOCUMENT_TYPE': keys[2],
                            'DOCUMENT_EXT': Number(keys[3]),
                            'PRODUCT_CODE': keys[4],
                            'QTY': keys[5],
                            'WGH': keys[6]
                        });
                        var md = 'Update';
                        if (noSend !== "0") md = 'Display';

                        $.Ctx.NavigatePage("receive_medical_trans",
				{ Previous: 'receive_medical_list', Mode: md },
				{ transition: 'slide' });
                    });
                });
            }

            function ClearParamPage() {
                $.Ctx.SetPageParam('receive_medical_trans', 'Data', {});
                $.Ctx.SetPageParam('receive_medical_trans', 'selectedVendor', null);
                $.Ctx.SetPageParam('receive_medical_trans', 'selectedFarmOrg', null);
                $.Ctx.SetPageParam('receive_medical_trans', 'selectedProduct', null);
                $.Ctx.SetPageParam('receive_medical_trans', 'selectedEntryType', null);
            }

            function SearchPurchaseMatTranGroup(SuccessCB) {
                var pParam = $.Ctx.GetPageParam('receive_medical_list', 'param');
                var stkType = null;
                try {
                    docTypeMat = pParam[PM_DOC_TYPE_KEY];
                    stkType = pParam[PM_STK_TYPE_KEY];
                } catch (e) {//Set Default
                    docTypeMat = "DCTYP41";
                    stkType = "10";
                }

                var cmd = $.Ctx.DbConn.createSelectCommand();
              //  var nameField = $.Ctx.Lang == "en-US" ? "ifnull(F.NAME_ENG, F.NAME_LOC)" : "ifnull(F.NAME_LOC, F.NAME_ENG)";
                cmd.sqlText = "SELECT DISTINCT   T.REF_DOCUMENT_NO , ";
                cmd.sqlText += "SUM(T.QTY) AS S_QTY, SUM(T.WGH) AS S_WGH ";
                cmd.sqlText += "FROM HH_FR_MS_MATERIAL_PURCHASE T ";
                cmd.sqlText += "JOIN FR_FARM_ORG F ON T.FARM_ORG=F.FARM_ORG ";
                cmd.sqlText += "WHERE T.ORG_CODE=? AND T.TRANSACTION_DATE=? ";
                cmd.sqlText += "AND T.DOCUMENT_TYPE=? AND T.STOCK_TYPE=? ";
                cmd.sqlText += "GROUP BY T.REF_DOCUMENT_NO ";
                cmd.sqlText += "ORDER BY T.REF_DOCUMENT_NO ";

                cmd.parameters.push($.Ctx.SubOp);
                cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
                cmd.parameters.push(docTypeMat);
                cmd.parameters.push(stkType);
                cmd.executeReader(function (tx, res) {
                    if (res.rows.length !== 0) {
                        var dSrc = new Array();
                        for (var i = 0; i < res.rows.length; i++) {
                            dSrc.push({ 'REF_DOCUMENT_NO': res.rows.item(i).REF_DOCUMENT_NO,
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

            function SearchPurchaseMatTranByDocNo(docNo, SuccessCB) {
                var pParam = $.Ctx.GetPageParam('receive_medical_list', 'param');
                var stkType = null;
                try {
                    docTypeMat = pParam[PM_DOC_TYPE_KEY];
                    stkType = pParam[PM_STK_TYPE_KEY];
                } catch (e) {//Set Default
              
                }
                var cmd = $.Ctx.DbConn.createSelectCommand();
                var nameField = $.Ctx.Lang == "en-US" ? "ifnull(F.NAME_ENG, F.NAME_LOC)" : "ifnull(F.NAME_LOC, F.NAME_ENG)";

                cmd.sqlText = "SELECT T.FARM_ORG, T.TRANSACTION_DATE, T.DOCUMENT_TYPE, T.DOCUMENT_EXT, T.PRODUCT_CODE, P.PRODUCT_NAME , T.QTY, T.WGH, T.NET_AMT , {0} as FARM_ORG_NAME , T.NUMBER_OF_SENDING_DATA ".format([nameField]);
                cmd.sqlText += "FROM HH_FR_MS_MATERIAL_PURCHASE T ";
                cmd.sqlText += "JOIN HH_PRODUCT_BU P ON T.PRODUCT_CODE=P.PRODUCT_CODE ";
                cmd.sqlText += " join FR_FARM_ORG f on T.FARM_ORG = f.farm_org ";
                cmd.sqlText += "WHERE T.ORG_CODE=? AND T.TRANSACTION_DATE=? ";
                cmd.sqlText += "AND DOCUMENT_TYPE=? AND T.REF_DOCUMENT_NO =? AND T.STOCK_TYPE=? ";
                cmd.sqlText += "ORDER BY T.DOCUMENT_EXT ";

                cmd.parameters.push($.Ctx.SubOp);
                cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
                cmd.parameters.push(docTypeMat);
                cmd.parameters.push(docNo);
                cmd.parameters.push(stkType);

                cmd.executeReader(function (tx, res) {
                    if (res.rows.length !== 0) {
                        var dSrc = new Array();
                        for (var i = 0; i < res.rows.length; i++) {
                            var t = new HH_FR_MS_MATERIAL_PURCHASE();
                            t.retrieveRdr(res.rows.item(i));
                            t.PRODUCT_NAME = res.rows.item(i).PRODUCT_NAME;
                            t.FARM_ORG_NAME = res.rows.item(i).FARM_ORG_NAME;
                            dSrc.push(t);
                        }
                        if (typeof SuccessCB == 'function') SuccessCB(dSrc);
                    }
                }, function (err) {
                    console.log(err.message);
                });
            }

            function DeletePurchaseMat(farmOrg, txDate, docType, docExt, prdCod, qty, wgh, SuccessCB) {
                var pur = new HH_FR_MS_MATERIAL_PURCHASE();
                var st = new S1_ST_STOCK_TRN();
                var sb = new S1_ST_STOCK_BALANCE();

                pur.ORG_CODE = $.Ctx.SubOp;
                pur.FARM_ORG = farmOrg;
                pur.TRANSACTION_DATE = txDate.toDbDateStr();
                pur.DOCUMENT_TYPE = docType;
                pur.DOCUMENT_EXT = docExt;

                var s = txDate;
                var y = ('' + s.getFullYear()), m = ('' + (s.getMonth() + 1)).lpad("0", 2), d = ('' + s.getDate()).length == 2 ? ('' + s.getDate()) : ('' + s.getDate()).lpad("0", 2);

                st.COMPANY = $.Ctx.ComCode;
                st.OPERATION = $.Ctx.Op;
                st.SUB_OPERATION = $.Ctx.SubOp;
                st.BUSINESS_UNIT = $.Ctx.Bu;
                st.DOC_TYPE = docType;
                st.DOC_NUMBER = y + m + d;
                st.EXT_NUMBER = docExt;

                var paramCmd = [pur.deleteCommand($.Ctx.DbConn), st.deleteCommand($.Ctx.DbConn)];
                var sb = new S1_ST_STOCK_BALANCE();
                sb.WAREHOUSE_CODE = farmOrg;
                sb.PRODUCT_CODE = prdCod;
                sb.QUANTITY = Number(qty) * (-1);
                sb.WEIGHT = Number(wgh) * (-1);
                $.FarmCtx.SetStockBalance(sb, paramCmd, function () {

                    var trn = new DbTran($.Ctx.DbConn);
                    trn.executeNonQuery(paramCmd, function () {
                        if (typeof (SuccessCB) == "function")

                            UpdateMatIssued(farmOrg, docType, prdCod);
                        SuccessCB(true);
                    }, function (errors) {
                        SuccessCB(false);
                        console.log(errors);
                    });
                });
            }

            function FindGd2FRMasType(gdtype, gdCode, SuccessCB) {
                var cmd = $.Ctx.DbConn.createSelectCommand();
                cmd.sqlText = "SELECT CONDITION_01 AS DEVICE FROM HH_GD2_FR_MAS_TYPE_FARM ";
                cmd.sqlText += " WHERE GD_TYPE=? AND GD_CODE=? "
                cmd.parameters.push(gdtype);
                cmd.parameters.push(gdCode);
                cmd.executeReader(function (t, res) {
                    if (res.rows.length > 0) {
                        var ret = '';
                        ret = res.rows.item(0).DEVICE;
                        if (typeof SuccessCB == 'function') SuccessCB(ret);
                    } else {
                        if (typeof SuccessCB == 'function') SuccessCB(null);
                    }
                }, function (error) { console.log(error) });
            }
            function UpdateMatIssued(farm_org, doc_type, product_code) {

                var cmd = $.Ctx.DbConn.createSelectCommand();
                cmd.sqlText = "UPDATE HH_FR_MS_MATERIAL_ISSUED SET USED = 0 WHERE FARM_ORG = ? AND  PRODUCT_CODE = ?";
                cmd.parameters.push(farm_org);
                //cmd.parameters.push(doc_type);
                cmd.parameters.push(product_code);


                var tran = new DbTran($.Ctx.DbConn);
                tran.executeNonQuery([cmd],
                        function (tx, res) {
                            console.log("SAVE");
                        }, function (err) {

                            console.log(err);
                        });



            }


        