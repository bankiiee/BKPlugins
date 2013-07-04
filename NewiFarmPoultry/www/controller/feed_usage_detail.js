$('#feed_usage_detail').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('feed_usage_detail');
    $.Ctx.RenderFooter('feed_usage_detail');
});

$('input').live('focus', function () {
    var $this = $(this);
    $this.select();
    // Work around Chrome's little problem
    $this.mouseup(function () {
        // Prevent further mouseup intervention
        $this.unbind("mouseup");
        return false;
    });
});

$('#feed_usage_detail').bind('pagebeforehide', function (e) {
    retrieveFromInput();
    $.Ctx.PersistPageParam();
});

function IsNanOrNullOrEmpty(str) {
    if (str == undefined) { return true };
    if (str == null) { return true };
    if (str === '') { return true };
    if (isNaN(str)) { return true };
    if (typeof (str) == 'String') {
        if (str.trim() === '') { return true };
    }
    return false;
}


function TotalQty() {
    var totalQty = 0;
    if (typeof ($('#feed_usage_detail #txtProQty1').val()) != 'undefined') {
        totalQty = totalQty + Number($('#feed_usage_detail #txtProQty1').val());
    }
    if (typeof ($('#feed_usage_detail #txtProQty2').val()) != 'undefined') {
        totalQty = totalQty + Number($('#feed_usage_detail #txtProQty2').val());
    }
    if (typeof ($('#feed_usage_detail #txtProQty3').val()) != 'undefined') {
        totalQty = totalQty + Number($('#feed_usage_detail #txtProQty3').val());
    }
    if (totalQty == 0) {
        totalQty = "";
    }
    return totalQty;
}


function TotalWt() {
    var totalWt = 0;
    if (typeof ($('#feed_usage_detail #txtProWt1').val()) != 'undefined') {
        totalWt = totalWt + Number($('#feed_usage_detail #txtProWt1').val());
    }
    if (typeof ($('#feed_usage_detail #txtProWt2').val()) != 'undefined') {
        totalWt = totalWt + Number($('#feed_usage_detail #txtProWt2').val());
    }
    if (typeof ($('#feed_usage_detail #txtProWt3').val()) != 'undefined') {
        totalWt = totalWt + Number($('#feed_usage_detail #txtProWt3').val());
    }
    if (totalWt == 0) {
        totalWt = "";
    }
    return totalWt;
}


//Scrolling Page
$('#feed_usage_detail a[data-role="button"]').live('click', function (e) {
    //    $.Ctx.SetPageParam(page, 'ScrollingTo',  $(this).attr('id'));
    $.Ctx.SetPageParam('feed_usage_detail', 'ScrollingTo', $(window).scrollTop());
});

//Calling Method
$('#feed_usage_detail').bind('pageshow', function (e) {
    if ($.Ctx.GetPageParam('feed_usage_detail', 'ScrollingTo') != null) {
        //        scrollTop: $( "#" + $.Ctx.GetPageParam('feed_usage_detail', 'ScrollingTo')).offset().top
        $('html, body').animate({
            scrollTop: $.Ctx.GetPageParam('feed_usage_detail', 'ScrollingTo')
        }, 0);
    }
});



$('#feed_usage_detail').bind('pageinit', function (e) {
    lkSelectTxt = $.Ctx.Lcl('feed_usage_detail', 'msgSelect', 'Select');


    $('#feed_usage_detail a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('feed_usage_detail', 'Previous'), null, { transition: 'slide', action: 'reverse' }, false);
    });

    $('#feed_usage_detail #lkFarmOrg').click(function (e) {
        retrieveFromInput();
        var pParam = $.Ctx.GetPageParam('feed_usage_search', 'param');
        var locationParam = "";
        if (pParam != null) {
            if (pParam['location'] != null) {
                locationParam = " AND B.LOCATION IN ('" + pParam['location'].replace(/\|/g, "','") + "') ";
            }
        }
        //var p = new LookupParam();
        //p.calledPage = 'feed_usage_detail';
        //p.calledResult = 'FeedUsageInput';
        //$.Ctx.SetPageParam('lookup_feed_usage', 'param', p);
        //$.Ctx.SetPageParam('lookup_feed_usage', 'Previous', 'feed_usage_detail');
        ////$.Ctx.SetPageParam('lookup_feed_usage', 'SqlWhere', " WHERE (CASE WHEN B.MANAGEMENT_FLG IS NULL THEN 'N' ELSE B.MANAGEMENT_FLG END  <>  'M') " + locationParam);
        //$.Ctx.SetPageParam('lookup_feed_usage', 'product_stock_type', $.Ctx.GetPageParam('feed_usage_search', 'product_stock_type'));
        //$.Ctx.SetPageParam('lookup_feed_usage', 'document_type', $.Ctx.GetPageParam('feed_usage_search', 'document_type'));
        //$.Ctx.NavigatePage('lookup_feed_usage', null, { transition: 'slide', action: 'reverse' }, false);


        $.FarmCtx.SearchFarmOrgUsingMapMobile(function (orgs) {
            if (orgs !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('purchase_trans', 'MsgFarmOrg', 'Farm Organization');
                p.calledPage = 'feed_usage_detail';
                p.calledResult = 'FeedUsageInput';
                p.codeField = 'CODE';
                p.nameField = 'NAME';
                p.showCode = true;
                p.dataSource = orgs;

                $.Ctx.SetPageParam('lookup_farm_org', 'param', p);
                $.Ctx.SetPageParam('lookup_farm_org', 'dataSource', orgs);
                $.Ctx.SetPageParam('lookup_farm_org', 'Previous', p.calledPage);
                $.Ctx.NavigatePage('lookup_farm_org', null, { transition: 'slide' });
            }
        });

    });






    $('#feed_usage_detail #lkProductId1').click(function (e) {

        var txt = $('#feed_usage_detail #lkProductId2 span').text();
        var productCodeStr = "";
        if (txt != lkSelectTxt && ProductInput2 != null) {
            productCodeStr = "'" + ProductInput2.PRODUCT_CODE + "'";
        }
        txt = $('#feed_usage_detail #lkProductId3 span').text();
        if (txt != lkSelectTxt && ProductInput3 != null) {
            if (IsNullOrEmpty(productCodeStr))
                productCodeStr = productCodeStr + "'" + ProductInput3.PRODUCT_CODE + "'";
            else
                productCodeStr = productCodeStr + ",'" + ProductInput3.PRODUCT_CODE + "'";
        }
        if (IsNullOrEmpty(model.FARM_ORG_LOC)) {
            $.Ctx.MsgBox($.Ctx.Lcl('feed_usage_detail', 'msgPlzSelectFarm', 'Please select Farm Org first.'));
        }
        else {
            navigateProgductLookup('ProductInput1', productCodeStr);
            //            var p = new LookupParam();
            //            p.calledPage = 'feed_usage_detail';
            //            p.calledResult = 'ProductInput1';
            //            $.Ctx.SetPageParam('lookup_product_usage', 'param', p);
            //            $.Ctx.SetPageParam('lookup_product_usage', 'Previous', 'feed_usage_detail');
            //            $.Ctx.SetPageParam('lookup_product_usage', 'product_stock_type', $.Ctx.GetPageParam('feed_usage_search', 'product_stock_type'));
            //            $.Ctx.SetPageParam('lookup_product_usage', 'ProductCode', productCodeStr);
            //            $.Ctx.SetPageParam('lookup_product_usage', 'selectedFarmOrgCode', $.Ctx.GetPageParam('feed_usage_detail', 'FeedUsageInput').FARM_ORG);
            //            $.Ctx.NavigatePage('lookup_product_usage', null, { transition: 'slide', action: 'reverse' }, false);
        }
    });
    $('#feed_usage_detail #lkProductId2').click(function (e) {

        var txt = $('#feed_usage_detail #lkProductId1 span').text();
        var productCodeStr = "";
        if (txt != lkSelectTxt && ProductInput1 != null) {
            productCodeStr = "'" + ProductInput1.PRODUCT_CODE + "'";
        }
        txt = $('#feed_usage_detail #lkProductId3 span').text();
        if (txt != lkSelectTxt && ProductInput3 != null) {
            if (IsNullOrEmpty(productCodeStr))
                productCodeStr = productCodeStr + "'" + ProductInput3.PRODUCT_CODE + "'";
            else
                productCodeStr = productCodeStr + ",'" + ProductInput3.PRODUCT_CODE + "'";
        }
        if (IsNullOrEmpty(model.FARM_ORG_LOC)) {
            $.Ctx.MsgBox($.Ctx.Lcl('feed_usage_detail', 'msgPlzSelectFarm', 'Please select Farm Org first.'));
        }
        else {
            navigateProgductLookup('ProductInput2', productCodeStr);
            //            var p = new LookupParam();
            //            p.calledPage = 'feed_usage_detail';
            //            p.calledResult = 'ProductInput2';
            //            $.Ctx.SetPageParam('lookup_product_usage', 'param', p);
            //            $.Ctx.SetPageParam('lookup_product_usage', 'Previous', 'feed_usage_detail');
            //            $.Ctx.SetPageParam('lookup_product_usage', 'product_stock_type', $.Ctx.GetPageParam('feed_usage_search', 'product_stock_type'));
            //            $.Ctx.SetPageParam('lookup_product_usage', 'ProductCode', productCodeStr);
            //            $.Ctx.NavigatePage('lookup_product_usage', null, { transition: 'slide', action: 'reverse' }, false);
        }
    });
    $('#feed_usage_detail #lkProductId3').click(function (e) {

        var txt = $('#feed_usage_detail #lkProductId1 span').text();
        var productCodeStr = "";
        if (txt != lkSelectTxt && ProductInput1 != null) {
            productCodeStr = "'" + ProductInput1.PRODUCT_CODE + "'";
        }
        txt = $('#feed_usage_detail #lkProductId2 span').text();
        if (txt != lkSelectTxt && ProductInput2 != null) {
            if (IsNullOrEmpty(productCodeStr))
                productCodeStr = productCodeStr + "'" + ProductInput2.PRODUCT_CODE + "'";
            else
                productCodeStr = productCodeStr + ",'" + ProductInput2.PRODUCT_CODE + "'";
        }
        if (IsNullOrEmpty(model.FARM_ORG_LOC)) {
            $.Ctx.MsgBox($.Ctx.Lcl('feed_usage_detail', 'msgPlzSelectFarm', 'Please select Farm Org first.'));
        }
        else {
            navigateProgductLookup('ProductInput3', productCodeStr);
            //            var p = new LookupParam();
            //            p.calledPage = 'feed_usage_detail';
            //            p.calledResult = 'ProductInput3';
            //            $.Ctx.SetPageParam('lookup_product_usage', 'param', p);
            //            $.Ctx.SetPageParam('lookup_product_usage', 'Previous', 'feed_usage_detail');
            //            $.Ctx.SetPageParam('lookup_product_usage', 'product_stock_type', $.Ctx.GetPageParam('feed_usage_search', 'product_stock_type'));
            //            $.Ctx.SetPageParam('lookup_product_usage', 'ProductCode', productCodeStr);
            //            $.Ctx.NavigatePage('lookup_product_usage', null, { transition: 'slide', action: 'reverse' }, false);
        }
    });


    $('#feed_usage_detail #txtProWt1').change(function () {
        $('#feed_usage_detail #txtTotalWt').val(TotalWt());
    });

    $('#feed_usage_detail #txtProWt2').change(function () {
        $('#feed_usage_detail #txtTotalWt').val(TotalWt());
    });

    $('#feed_usage_detail #txtProWt3').change(function () {
        $('#feed_usage_detail #txtTotalWt').val(TotalWt());
    });

    $('#feed_usage_detail #txtProQty1').change(function () {
        if (!_.isNull(modelStock1)) {
            if (modelStock1.STOCK_KEEPING_UNIT == "Q" && !_.isNull(modelStock1.UNIT_PACK)) {
                if (typeof ($('#feed_usage_detail #txtProQty1').val()) != 'undefined') {
                    $('#feed_usage_detail #txtProWt1').val((Number($('#feed_usage_detail #txtProQty1').val()) * Number(modelStock1.UNIT_PACK)).toString())
                }
            }
        }
        $('#feed_usage_detail #txtTotalQty').val(TotalQty());
        $('#feed_usage_detail #txtTotalWt').val(TotalWt());

    });

    $('#feed_usage_detail #txtProQty2').change(function () {
        if (!_.isNull(modelStock2)) {
            if (modelStock2.STOCK_KEEPING_UNIT == "Q" && !_.isNull(modelStock2.UNIT_PACK)) {
                if (typeof ($('#feed_usage_detail #txtProQty2').val()) != 'undefined') {
                    $('#feed_usage_detail #txtProWt2').val((Number($('#feed_usage_detail #txtProQty2').val()) * Number(modelStock2.UNIT_PACK)).toString());
                }
            }
        }
        $('#feed_usage_detail #txtTotalQty').val(TotalQty());
        $('#feed_usage_detail #txtTotalWt').val(TotalWt());

    });

    $('#feed_usage_detail #txtProQty3').change(function () {
        if (!_.isNull(modelStock3)) {
            if (modelStock3.STOCK_KEEPING_UNIT == "Q" && !_.isNull(modelStock3.UNIT_PACK)) {
                if (typeof ($('#feed_usage_detail #txtProQty3').val()) != 'undefined') {
                    $('#feed_usage_detail #txtProWt3').val((Number($('#feed_usage_detail #txtProQty3').val()) * Number(modelStock3.UNIT_PACK)).toString());
                }
            }
        }
        $('#feed_usage_detail #txtTotalQty').val(TotalQty());
        $('#feed_usage_detail #txtTotalWt').val(TotalWt());
    });

    function InWtStd(objMessage) {
        var stdWtUpper = Number(model.STD_USAGE) + ((Number(model.STD_USAGE) * Number(model.STD_DIF_PER)) / 100)
        var stdWtLower = Number(model.STD_USAGE) - ((Number(model.STD_USAGE) * Number(model.STD_DIF_PER)) / 100)
        if (TotalWt() != 0) {
            if (TotalWt() >= stdWtLower && TotalWt() <= stdWtUpper) {
                objMessage.Warning += "";
                return true;
            }
            else {
                objMessage.Warning += $.Ctx.Lcl('feed_usage_detail', 'msgTotalWghMore', "Total Weight is more or less than Standard Diff. ({0})").format([Number($.Ctx.Nvl(model.STD_DIF_PER,0)) + '%']);
                return false;
            }
        }
        objMessage.Error += $.Ctx.Lcl('feed_usage_detail', 'msgTotalWghInvalid', "Total Weight is invalid");
        return false;
    }
    function MessageModel() {
        this.Warning = "";
        this.Error = "";
    }
    function CheckQtyWtQuota(ModelStock, Message) {
        if (!IsNullOrEmpty(ModelStock.PRODUCT_CODE) && !IsNanOrNullOrEmpty(ModelStock.WEIGHT)) {
            if (ModelStock.STOCK_KEEPING_UNIT == 'W') {
                if (!IsNanOrNullOrEmpty(ModelStock.QUOTA_WT)) {
                    if (Number(ModelStock.WEIGHT) > Number(ModelStock.QUOTA_WT)) {
                        var s = $.Ctx.Lcl('feed_usage_detail', 'msgWghMustLowerThan', 'Weight of {0} must lower or equal than {1} Kg.').format([ModelStock.PRODUCT_SHORT_NAME, Number(ModelStock.QUOTA_WT)]);
                        Message.Error += s;
                    } else {
                        ProductList.push(ModelStock);
                    }
                }
                else {
                    var s = $.Ctx.Lcl('feed_usage_detail', 'msgInvalidWgh', ' {0} invalid in amount of weight.').format([ModelStock.PRODUCT_SHORT_NAME]);
                    Message.Error += s;
                }
            }
            else {
                if (!IsNanOrNullOrEmpty(ModelStock.QUANTITY)) {
                    if (!IsNanOrNullOrEmpty(ModelStock.QUOTA_QTY)) {
                        if (Number(ModelStock.QUANTITY) > Number(ModelStock.QUOTA_QTY)) {
                            var s = $.Ctx.Lcl('feed_usage_detail', 'msgQtyMustLowerAndEqual', 'Quantity of {0} must lower or equal than {1} product(s).').format([ModelStock.PRODUCT_SHORT_NAME, Number(ModelStock.QUOTA_QTY)]);
                            console.log(s);
                            Message.Error += s;
                        } else {
                            ProductList.push(ModelStock);
                        }
                    }
                    else {
                        var s = $.Ctx.Lcl('feed_usage_detail', 'msgInvalidStockProduct', ' {0} invalid in stock of product.').format([ModelStock.PRODUCT_SHORT_NAME]);
                        Message.Error += s;
                    }
                } else {
                    var s = $.Ctx.Lcl('feed_usage_detail', 'msgQtyOrWghInvalid', 'Quantity or Weight is invalid.');
                    Message.Error += s;
                }

            }
        }
    }


    function isValid(Success) {
        var msg = new MessageModel();
        if (!IsNullOrEmpty(model.FARM_ORG_LOC)) {
            ProductList = new Array();
            CheckQtyWtQuota(modelStock1, msg);
            CheckQtyWtQuota(modelStock2, msg);
            CheckQtyWtQuota(modelStock3, msg);
            if (IsNullOrEmpty(msg.Error)) {
                if (!IsNullOrEmpty(modelStock1.PRODUCT_CODE) && !IsNanOrNullOrEmpty(modelStock1.WEIGHT)) {
                    InWtStd(msg);
                } else if (!IsNullOrEmpty(modelStock2.PRODUCT_CODE) && !IsNanOrNullOrEmpty(modelStock2.WEIGHT)) {
                    InWtStd(msg);
                } else if (!IsNullOrEmpty(modelStock3.PRODUCT_CODE) && !IsNanOrNullOrEmpty(modelStock3.WEIGHT)) {
                    InWtStd(msg);
                }
                else {
                    var s = $.Ctx.Lcl('feed_usage_detail', 'msgQtyOrWghInvalid', ' Quantity or Weight is invalid.');
                    msg.Error += s;
                }
            }
        }
        else {
            var s = $.Ctx.Lcl('feed_usage_detail', 'MsgIsRequire', '{0} is required.').format([$('#feed_usage_detail #lblFarmOrgLoc').text()]);
            msg.Error += s;
        }
        if (!IsNullOrEmpty(msg.Error)) {
            $.Ctx.MsgBox(msg.Error);
            return false;
        }

        if (!IsNullOrEmpty(msg.Warning)) {
            /*var retConfirm =confirm($.Ctx.Lcl('feed_usage_detail' , 'msgSaveWarning' , '{0} Do you want to Save ?').format([msg.Warning +"\n"]));
            if (retConfirm == true)
            return true;
            else
            return false;*/
            $.Ctx.Confirm($.Ctx.Lcl('feed_usage_detail', 'msgSaveWarning', '{0} Do you want to Save ?').format([msg.Warning + "\n"]), function (btnIdx) {
                console.log(btnIdx);
                if (btnIdx == 1) {
                    if (typeof Success == 'function')
                        Success(true);
                }
                else {
                    if (typeof Success == 'function')
                        Success(false);

                }
            });
        }
        else {
            if (typeof Success == 'function')
                Success(true);
        }
    }


    $('#feed_usage_detail #btnSave').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        retrieveFromInput();
        'Validate input if error show alert and return'
        isValid(function (isAccept) {
            if (isAccept == true) {
                if (mode == "new") {
                    var cmds = new Array();
                    if (ProductList.length > 0) {
                        SaveDB(0, ProductList[0], cmds, function (cmds) {
                            if (ProductList.length > 1) {
                                SaveDB(1, ProductList[1], cmds, function (cmds) {
                                    if (ProductList.length > 2) {
                                        SaveDB(2, ProductList[2], cmds, function (cmds) {
                                            TransactionBD(cmds);
                                        });
                                    } else {
                                        TransactionBD(cmds);
                                    }
                                });
                            } else {
                                TransactionBD(cmds);
                            }
                        });
                    }
                }
            }
        });

    });

    function TransactionBD(cmds) {
        var tran = new DbTran($.Ctx.DbConn);
        tran.executeNonQuery(cmds,
            function (tx, res) {

                $.Ctx.MsgBox($.Ctx.Lcl('feed_usage_detail', 'MsgSaveComplete', 'Save completed.'));
                $.Ctx.SetPageParam('feed_usage_detail', 'mode', 'new');
                $.Ctx.SetPageParam('feed_usage_detail', 'model', null);
                $.Ctx.SetPageParam('feed_usage_detail', 'modelStock1', null);
                $.Ctx.SetPageParam('feed_usage_detail', 'modelStock2', null);
                $.Ctx.SetPageParam('feed_usage_detail', 'modelStock3', null);

                $.Ctx.SetPageParam('feed_usage_detail', 'FeedUsageInput', null);
                $.Ctx.SetPageParam('feed_usage_detail', 'ProductInput1', null);
                $.Ctx.SetPageParam('feed_usage_detail', 'ProductInput2', null);
                $.Ctx.SetPageParam('feed_usage_detail', 'ProductInput3', null);
                initPage();
                persistToInput();

            }, function (err) {
                if (err != undefined && err != null)
                    $.Ctx.MsgBox("Err :" + err.message);
            });
    }

    function SaveDB(index, ProductList, cmds, Success, Fail) {
        var s = $.Ctx.GetBusinessDate();
        var y = ('' + s.getFullYear()), m = ('' + (s.getMonth() + 1)).lpad("0", 2), d = ('' + s.getDate()).length == 2 ? ('' + s.getDate()) : ('' + s.getDate()).lpad("0", 2);
        //stkTran.DOC_NUMBER = y + m + d;
        var bmodel; //= new  HH_FR_MS_SWINE_MATERIAL();
        var mStock = new S1_ST_STOCK_TRN();
        var mBalance = new S1_ST_STOCK_BALANCE();

        if ($.Ctx.Bu == "FARM_PIG") {
            //bmodel = new HH_FR_MS_SWINE_MATERIAL();
            //bmodel.ORG_CODE = $.Ctx.SubOp;
            //bmodel.FARM_ORG = $.Ctx.Warehouse;
            //bmodel.FARM_ORG_LOC = model.FARM_ORG_LOC;
            //bmodel.PRODUCT_STOCK_TYPE = $.Ctx.GetPageParam('feed_usage_search', 'product_stock_type');
            //bmodel.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            //bmodel.DOCUMENT_TYPE = $.Ctx.GetPageParam('feed_usage_search', 'document_type');
            //bmodel.DOCUMENT_NO = (Number(model.MAX_DOCUMENT_NO) + 1).toString();
            //bmodel.DOCUMENT_EXT = index + 1;
            //bmodel.PRODUCT_CODE = ProductList.PRODUCT_CODE;
            //bmodel.QTY = Number(ProductList.QUANTITY);
            //bmodel.WGH = Number(ProductList.WEIGHT);
            //bmodel.OWNER = $.Ctx.UserId;
            //bmodel.CREATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            //bmodel.LAST_UPDATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            //bmodel.FUNCTION = "A";
            //bmodel.NUMBER_OF_SENDING_DATA = 0;
            //var iCmdModel = bmodel.insertCommand($.Ctx.DbConn);
            //cmds.push(iCmdModel);

            //mStock.COMPANY = $.Ctx.ComCode;
            //mStock.OPERATION = $.Ctx.Op;
            //mStock.SUB_OPERATION = $.Ctx.SubOp;
            //mStock.BUSINESS_UNIT = $.Ctx.Bu;
            //mStock.DOCUMENT_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            //mStock.DOC_TYPE = bmodel.DOCUMENT_TYPE;
            //mStock.DOC_NUMBER = Number(bmodel.DOCUMENT_NO).toString();
            //mStock.EXT_NUMBER = bmodel.DOCUMENT_EXT;
            //mStock.TRN_TYPE = $.Ctx.GetPageParam('feed_usage_search', 'transaction_type');
            //mStock.TRN_CODE = $.Ctx.GetPageParam('feed_usage_search', 'transaction_code');
            //mStock.CAL_TYPE = $.Ctx.GetPageParam('feed_usage_search', 'cal_type');
            //mStock.UNIT_LEVEL = model.FARM_ORG_LOC;
            //mStock.STOCK_KEEPING_UNIT = ProductList.STOCK_KEEPING_UNIT;
            //mStock.PRODUCT_STOCK_TYPE = $.Ctx.GetPageParam('feed_usage_search', 'product_stock_type');
            //mStock.PRODUCT_CODE = ProductList.PRODUCT_CODE;
            //mStock.QUANTITY = Number(ProductList.QUANTITY);
            //mStock.WEIGHT = Number(ProductList.WEIGHT);
            //mStock.OWNER = $.Ctx.UserId;
            //mStock.CREATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            //mStock.LAST_UPDATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            //mStock.FUNCTION = "A";
            //mStock.NUMBER_OF_SENDING_DATA = 0;
            //mStock.WAREHOUSE_CODE = model.FARM_ORG;
            //var iCmdStock = mStock.insertCommand($.Ctx.DbConn);
            //cmds.push(iCmdStock);

            //mBalance.PRODUCT_CODE = ProductList.PRODUCT_CODE;
            //if (ProductList.STOCK_KEEPING_UNIT != "W") {
            //    mBalance.QUANTITY = (Number(mStock.CAL_TYPE) * Number(ProductList.QUANTITY));
            //} else {
            //    mBalance.QUANTITY = 0;
            //}
            //mBalance.WEIGHT = (Number(mStock.CAL_TYPE) * Number(ProductList.WEIGHT));
            //mBalance.WAREHOUSE_CODE = $.Ctx.Warehouse;

            //$.FarmCtx.SetStockBalance(mBalance, cmds, function () {
            //    Success(cmds);
            //}, function (err) {
            //    $.Ctx.MsgBox("Err :" + err.message);
            //    Fail(err);
            //});
        }
        else {
            bmodel = new HH_FR_MS_MATERIAL_STOCK();

            bmodel.ORG_CODE = $.Ctx.SubOp;
            bmodel.FARM_ORG = $.Ctx.Warehouse;
            bmodel.FARM_ORG_LOC = model.FARM_ORG_LOC;
            bmodel.PRODUCT_STOCK_TYPE = $.Ctx.GetPageParam('feed_usage_search', 'product_stock_type');
            bmodel.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            bmodel.DOCUMENT_TYPE = $.Ctx.GetPageParam('feed_usage_search', 'document_type');
            var farmOrgDocNo = model.FARM_ORG_LOC.split('-');

            bmodel.DOCUMENT_NO =(y.substr(2,3)+m+d).toString() + farmOrgDocNo[0] + farmOrgDocNo[1];
            bmodel.DOCUMENT_EXT = index + 1;
            bmodel.PRODUCT_CODE = ProductList.PRODUCT_CODE;
            bmodel.QTY = Number(ProductList.QUANTITY);
            bmodel.WGH = Number(ProductList.WEIGHT);
            bmodel.OWNER = $.Ctx.UserId;
            bmodel.CREATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            bmodel.LAST_UPDATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            bmodel.FUNCTION = "A";

            bmodel.MALE_WGH = 0;
            bmodel.MALE_QTY = 0;
            bmodel.FEMALE_WGH = 0;
            bmodel.FEMALE_QTY = 0;
            bmodel.NUMBER_OF_SENDING_DATA = 0;
            var iCmdModel = bmodel.insertCommand($.Ctx.DbConn);
            cmds.push(iCmdModel);

            mStock.COMPANY = $.Ctx.ComCode;
            mStock.OPERATION = $.Ctx.Op;
            mStock.SUB_OPERATION = $.Ctx.SubOp;
            mStock.BUSINESS_UNIT = $.Ctx.Bu;
            mStock.DOCUMENT_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            mStock.DOC_TYPE = bmodel.DOCUMENT_TYPE;
            mStock.DOC_NUMBER = bmodel.DOCUMENT_NO;
            mStock.EXT_NUMBER = bmodel.DOCUMENT_EXT;
            mStock.TRN_TYPE = $.Ctx.GetPageParam('feed_usage_search', 'transaction_type');
            mStock.TRN_CODE = $.Ctx.GetPageParam('feed_usage_search', 'transaction_code');
            mStock.CAL_TYPE = $.Ctx.GetPageParam('feed_usage_search', 'cal_type');
            mStock.UNIT_LEVEL = model.FARM_ORG_LOC;
            mStock.STOCK_KEEPING_UNIT = ProductList.STOCK_KEEPING_UNIT;
            mStock.PRODUCT_STOCK_TYPE = $.Ctx.GetPageParam('feed_usage_search', 'product_stock_type');
            mStock.PRODUCT_CODE = ProductList.PRODUCT_CODE;
            mStock.QUANTITY = Number(ProductList.QUANTITY);
            mStock.WEIGHT = Number(ProductList.WEIGHT);
            mStock.OWNER = $.Ctx.UserId;
            mStock.CREATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            mStock.LAST_UPDATE_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
            mStock.FUNCTION = "A";
            mStock.NUMBER_OF_SENDING_DATA = 0;
            mStock.WAREHOUSE_CODE = model.FARM_ORG_LOC;
            var iCmdStock = mStock.insertCommand($.Ctx.DbConn);
            cmds.push(iCmdStock);

            mBalance.PRODUCT_CODE = ProductList.PRODUCT_CODE;
            if (ProductList.STOCK_KEEPING_UNIT != "W") {
                mBalance.QUANTITY = (Number(mStock.CAL_TYPE) * Number(ProductList.QUANTITY));
            } else {
                mBalance.QUANTITY = 0;
            }
            mBalance.WEIGHT = (Number(mStock.CAL_TYPE) * Number(ProductList.WEIGHT));
            mBalance.WAREHOUSE_CODE = model.FARM_ORG_LOC;

            $.FarmCtx.SetStockBalance(mBalance, cmds, function () {
                Success(cmds);
            }, function (err) {
                $.Ctx.MsgBox("Err :" + err.message);
                Fail(err);
            });
        }



    }


});


$('#feed_usage_detail').bind('pagebeforeshow', function (e) {
    initPage();
    console.log("LookUp");
    //end init lookup
    persistToInput();
    //register click event
    console.log("Register");
    //end register click event
    console.log("End Register");
});


//declare global pageinit variable
var lkSelectTxt = null;

var mode = $.Ctx.GetPageParam('feed_usage_detail', 'mode');

var model; //
if ($.Ctx.Bu == "FARM_PIG")
    model = new HH_FR_MS_SWINE_MATERIAL();
else
    model = new HH_FR_MS_MATERIAL_STOCK();

var modelStock1 = new S1_ST_STOCK_TRN();
var modelStock2 = new S1_ST_STOCK_TRN();
var modelStock3 = new S1_ST_STOCK_TRN();

var FeedUsageInput = new FR_FARM_ORG();
var PoultryBalance = {};
var ProductInput1 = new HH_PRODUCT_BU();
var ProductInput2 = new HH_PRODUCT_BU();
var ProductInput3 = new HH_PRODUCT_BU();
var ProductList = new Array();

function initPage() {
    mode = $.Ctx.GetPageParam('feed_usage_detail', 'mode');

    model = $.Ctx.GetPageParam('feed_usage_detail', 'model');
    if (model == null) {
        if ($.Ctx.Bu == "FARM_PIG")
            model = new HH_FR_MS_SWINE_MATERIAL();
        else
            model = new HH_FR_MS_MATERIAL_STOCK();

        model.ORG_CODE = $.Ctx.SubOp;
        model.FARM_ORG = $.Ctx.Warehouse;
        model.PRODUCT_STOCK_TYPE = $.Ctx.GetPageParam('feed_usage_detail', 'product_stock_type');
        model.POULTRY_BALANCE;
    }

    modelStock1 = $.Ctx.GetPageParam('feed_usage_detail', 'modelStock1');
    if (modelStock1 == null) {
        modelStock1 = new S1_ST_STOCK_TRN();
        modelStock1.ORG_CODE = $.Ctx.SubOp;
        modelStock1.FARM_ORG = $.Ctx.Warehouse;
    }
    modelStock2 = $.Ctx.GetPageParam('feed_usage_detail', 'modelStock2');
    if (modelStock2 == null) {
        modelStock2 = new S1_ST_STOCK_TRN();
        modelStock2.ORG_CODE = $.Ctx.SubOp;
        modelStock2.FARM_ORG = $.Ctx.Warehouse;
    }
    modelStock3 = $.Ctx.GetPageParam('feed_usage_detail', 'modelStock3');
    if (modelStock3 == null) {
        modelStock3 = new S1_ST_STOCK_TRN();
        modelStock3.ORG_CODE = $.Ctx.SubOp;
        modelStock3.FARM_ORG = $.Ctx.Warehouse;
    }


    //initialize;
    if (mode == 'new') {
        $('#feed_usage_detail #btnSave').show();
        $('#feed_usage_detail #lkFarmOrg').removeClass('ui-disabled');
        $('#feed_usage_detail #txtProQty1').removeClass('ui-disabled');
        $('#feed_usage_detail #txtProQty2').removeClass('ui-disabled');
        $('#feed_usage_detail #txtProQty3').removeClass('ui-disabled');
        $('#feed_usage_detail #txtProWt1').removeClass('ui-disabled');
        $('#feed_usage_detail #txtProWt2').removeClass('ui-disabled');
        $('#feed_usage_detail #txtProWt3').removeClass('ui-disabled');

        $('#feed_usage_detail #lkProductId1').removeClass('ui-disabled');
        $('#feed_usage_detail #lkProductId2').removeClass('ui-disabled');
        $('#feed_usage_detail #lkProductId3').removeClass('ui-disabled');
        //$('#feed_usage_detail #lkSwineId').attr('disabled', '');
    } else if (mode == 'edit') {
        $('#feed_usage_detail #btnSave').hide();
        $('#feed_usage_detail #lkFarmOrg').addClass('ui-disabled');
        $('#feed_usage_detail #txtProQty1').addClass('ui-disabled');
        $('#feed_usage_detail #txtProQty2').addClass('ui-disabled');
        $('#feed_usage_detail #txtProQty3').addClass('ui-disabled');
        $('#feed_usage_detail #txtProWt1').addClass('ui-disabled');
        $('#feed_usage_detail #txtProWt2').addClass('ui-disabled');
        $('#feed_usage_detail #txtProWt3').addClass('ui-disabled');

        $('#feed_usage_detail #lkProductId1').addClass('ui-disabled');
        $('#feed_usage_detail #lkProductId2').addClass('ui-disabled');
        $('#feed_usage_detail #lkProductId3').addClass('ui-disabled');
        //$('#feed_usage_detail #lkSwineId').attr('disabled', 'disabled');
    }
    //init lookup;
    FeedUsageInput = $.Ctx.GetPageParam('feed_usage_detail', 'FeedUsageInput');
    PoultryBalance = $.Ctx.GetPageParam('feed_usage_detail', 'poultryBalance');
    if (FeedUsageInput != null) {
        model.FARM_ORG_LOC = FeedUsageInput.CODE;
        model.FARM_ORG_NAME = FeedUsageInput.NAME;
        //persistToInput()
        //find poultry balance
        //findStockBalance(function (ret) {
        //    if (ret != null) {
        //        //alert(ret.POULTRY_BALANCE);
        //        model.POULTRY_BALANCE = ret[0].POULTRY_BALANCE;
        //        $.Ctx.SetPageParam('feed_usage_detail', 'poultryBalance', ret[0].POULTRY_BALANCE);
        //        // $("#feed_usage_detail #txtPoultryBal").val(model.POULTRY_BALANCE);
        findStandardUsage(model.FARM_ORG_LOC, function (ret) {
            if (ret != null) {
                // model.STD_USAGE = ret[0].STD_USAGE;
                model.STD_USAGE = ret[0].FEED_TOTAL
                model.STD_DIF_PER = ret[0].STD_DIF_PER;
                findMaxDocumentNo(function (ret) {
                    model.MAX_DOCUMENT_NO = ret[0].MAX_DOCUMENT_NO;
                    //alert(model.MAX_DOCUMENT_NO);
                    $.Ctx.PersistPageParam();
                    persistToInput();
                });
                //persistToInput();
            }
        });
        //}

        //});
        findStockBalance(function (ret) {
            if (ret != null) {
                //alert(ret.POULTRY_BALANCE);
                model.POULTRY_BALANCE = ret[0].POULTRY_BALANCE;
                $.Ctx.SetPageParam('feed_usage_detail', 'poultryBalance', ret[0].POULTRY_BALANCE);
                $("#feed_usage_detail #txtPoultryBal").val(model.POULTRY_BALANCE);
            }
        });
        //find std usage
        //model.FARM_ORG_LOC = FeedUsageInput.FARM_ORG;
        //model.PIG_BALANCE = FeedUsageInput.PIG_BALANCE;
        //model.STD_USAGE = FeedUsageInput.STD_USAGE;
        //model.STD_DIF_PER = FeedUsageInput.STD_DIF_PER;
        //model.MAX_DOCUMENT_NO = FeedUsageInput.MAX_DOCUMENT_NO;
    }
    else {
        var presetFo = $.Ctx.GetPageParam('feed_usage_detail', 'presetFarmOrg');
        console.log(presetFo, 'presetFO')
        if (presetFo != null) {
            model.FARM_ORG_LOC = presetFo.CODE;
            model.FARM_ORG_NAME = presetFo.NAME;
            //alert(model.FARM_ORG_LOC)
            $('#feed_usage_detail #lkFarmOrg span').text(model.FARM_ORG_LOC + "(" + model.FARM_ORG_NAME + ")");
        }
    }
    if (PoultryBalance != null) {
        $("#feed_usage_detail #txtPoultryBal").val(model.POULTRY_BALANCE);
    } else {
        $("#feed_usage_detail #txtPoultryBal").val("");
    }



    ProductInput1 = $.Ctx.GetPageParam('feed_usage_detail', 'ProductInput1');
    if (ProductInput1 != null) {
        modelStock1.PRODUCT_CODE = ProductInput1.PRODUCT_CODE;
        modelStock1.PRODUCT_SHORT_NAME = ProductInput1.PRODUCT_SHORT_NAME;
        modelStock1.QUOTA_WT = ProductInput1.WEIGHT;
        modelStock1.QUOTA_QTY = ProductInput1.QUANTITY;
        modelStock1.STOCK_KEEPING_UNIT = ProductInput1.STOCK_KEEPING_UNIT;
        modelStock1.UNIT_PACK = ProductInput1.UNIT_PACK;
    }
    ProductInput2 = $.Ctx.GetPageParam('feed_usage_detail', 'ProductInput2');
    if (ProductInput2 != null) {
        modelStock2.PRODUCT_CODE = ProductInput2.PRODUCT_CODE;
        modelStock2.PRODUCT_SHORT_NAME = ProductInput2.PRODUCT_SHORT_NAME;
        modelStock2.QUOTA_WT = ProductInput2.WEIGHT;
        modelStock2.QUOTA_QTY = ProductInput2.QUANTITY;
        modelStock2.STOCK_KEEPING_UNIT = ProductInput2.STOCK_KEEPING_UNIT;
        modelStock2.UNIT_PACK = ProductInput2.UNIT_PACK;
    }
    ProductInput3 = $.Ctx.GetPageParam('feed_usage_detail', 'ProductInput3');
    if (ProductInput3 != null) {
        modelStock3.PRODUCT_CODE = ProductInput3.PRODUCT_CODE;
        modelStock3.PRODUCT_SHORT_NAME = ProductInput3.PRODUCT_SHORT_NAME;
        modelStock3.QUOTA_WT = ProductInput3.WEIGHT;
        modelStock3.QUOTA_QTY = ProductInput3.QUANTITY;
        modelStock3.STOCK_KEEPING_UNIT = ProductInput3.STOCK_KEEPING_UNIT;
        modelStock3.UNIT_PACK = ProductInput3.UNIT_PACK;
    }
    if (mode == 'new') {
        if (modelStock1.STOCK_KEEPING_UNIT == "W") {
            $('#feed_usage_detail #txtProQty1').addClass('ui-disabled');
        } else {
            $('#feed_usage_detail #txtProQty1').removeClass('ui-disabled');
        }
        if (modelStock2.STOCK_KEEPING_UNIT == "W") {
            $('#feed_usage_detail #txtProQty2').addClass('ui-disabled');
        } else {
            $('#feed_usage_detail #txtProQty2').removeClass('ui-disabled');
        }
        if (modelStock3.STOCK_KEEPING_UNIT == "W") {
            $('#feed_usage_detail #txtProQty3').addClass('ui-disabled');
        } else {
            $('#feed_usage_detail #txtProQty3').removeClass('ui-disabled');
        }
    }

    if (modelStock1.STOCK_KEEPING_UNIT == "W") {
        modelStock1.QUANTITY = null;
        modelStock1.QUOTA_QTY = null;
        $('#feed_usage_detail #txtProQty1').val("");
    }
    if (modelStock2.STOCK_KEEPING_UNIT == "W") {
        modelStock2.QUANTITY = null;
        modelStock2.QUOTA_QTY = null;
        $('#feed_usage_detail #txtProQty2').val("");
    }
    if (modelStock3.STOCK_KEEPING_UNIT == "W") {
        modelStock3.QUANTITY = null;
        modelStock3.QUOTA_QTY = null;
        $('#feed_usage_detail #txtProQty3').val("");
    }

}
var temp;
//persist model to input
function persistToInput() {
    if (!IsNullOrEmpty(model.FARM_ORG_LOC)) {
        if ($.Ctx.GetPageParam('feed_usage_detail', 'mode') != 'edit') {
            var farmOrg = $.Ctx.GetPageParam('feed_usage_detail', 'FeedUsageInput');
            //model.FARM_ORG_LOC_NAME = ($.Ctx.Lang == 'en-US' ? farmOrg.NAME_ENG : farmOrg.NAME_LOC);
            model.FARM_ORG_LOC_NAME = farmOrg.NAME;
            $('#feed_usage_detail #lkFarmOrg span').text(model.FARM_ORG_LOC + "(" + model.FARM_ORG_NAME + ")");
        } else {
            //   alert('update')
            //  alert(model.FARM_ORG_LOC);

            $.FarmCtx.Poultry_SearchFarmOrgByCode(model.FARM_ORG_LOC, function (ret) {

                $.Ctx.SetPageParam('feed_usage_detail', 'presetFarmOrg', ret[0]);
                $.Ctx.PersistPageParam();
                persistToInput();
            });
            //persistToInput();
        }


    } else {
        $('#feed_usage_detail #lkFarmOrg span').text(lkSelectTxt);
    }
    if (!IsNanOrNullOrEmpty(model.POULTRY_BALANCE)) {
        $('#feed_usage_detail #txtPoultryBal').val(model.POULTRY_BALANCE);
    } else {
        $('#feed_usage_detail #txtPoultryBal').val("");
    }
    if (!IsNanOrNullOrEmpty(model.STD_USAGE)) {
        $('#feed_usage_detail #txtStdWt').val(model.STD_USAGE);
    } else {
        $('#feed_usage_detail #txtStdWt').val("");
    }
    if (!IsNanOrNullOrEmpty(model.TOTAL_QTY)) {
        $('#feed_usage_detail #txtTotalQty').val(model.TOTAL_QTY);
    } else {
        $('#feed_usage_detail #txtTotalQty').val("");
    }
    if (!IsNanOrNullOrEmpty(model.TOTAL_WT)) {
        $('#feed_usage_detail #txtTotalWt').val(model.TOTAL_WT);
    } else {
        $('#feed_usage_detail #txtTotalWt').val("");
    }
    //if (!IsNanOrNullOrEmpty($.Ctx.GetPageParam('feed_usage_detail', 'poultryBalance'))) {
    if (!IsNanOrNullOrEmpty(model.POULTRY_BALANCE)) {
        $('#feed_usage_detail #txtPoultryBalance').val(model.POULTRY_BALANCE);
    } else {
        $('#feed_usage_detail #txtPoultryBalance').val('');

    }




    if (!IsNullOrEmpty(modelStock1.PRODUCT_SHORT_NAME)) {
        $('#feed_usage_detail #lkProductId1 span').text(modelStock1.PRODUCT_CODE + ' ' + modelStock1.PRODUCT_SHORT_NAME);
    } else {
        $('#feed_usage_detail #lkProductId1 span').text(lkSelectTxt);
    }
    if (!IsNullOrEmpty(modelStock1.STOCK_KEEPING_UNIT)) {
        $('#feed_usage_detail #lblStockType1').text(modelStock1.STOCK_KEEPING_UNIT);
    } else {
        $('#feed_usage_detail #lblStockType1').text("");
    }
    if (!IsNanOrNullOrEmpty(modelStock1.QUANTITY)) {
        $('#feed_usage_detail #txtProQty1').val(modelStock1.QUANTITY);
    } else {
        $('#feed_usage_detail #txtProQty1').val("");
    }
    if (!IsNanOrNullOrEmpty(modelStock1.WEIGHT)) {
        $('#feed_usage_detail #txtProWt1').val(modelStock1.WEIGHT);
    } else {
        $('#feed_usage_detail #txtProWt1').val("");
    }
    if (!IsNanOrNullOrEmpty(modelStock1.QUOTA_QTY)) {
        $('#feed_usage_detail #lblQtyBal1').text(modelStock1.QUOTA_QTY);
    } else {
        $('#feed_usage_detail #lblQtyBal1').text("");
    }
    if (!IsNanOrNullOrEmpty(modelStock1.QUOTA_WT)) {
        $('#feed_usage_detail #lblWtBal1').text(modelStock1.QUOTA_WT);
    } else {
        $('#feed_usage_detail #lblWtBal1').text("");
    }




    if (!IsNullOrEmpty(modelStock2.PRODUCT_SHORT_NAME)) {
        $('#feed_usage_detail #lkProductId2 span').text(modelStock2.PRODUCT_CODE + ' ' + modelStock2.PRODUCT_SHORT_NAME);
    } else {
        $('#feed_usage_detail #lkProductId2 span').text(lkSelectTxt);
    }
    if (!IsNullOrEmpty(modelStock2.STOCK_KEEPING_UNIT)) {
        $('#feed_usage_detail #lblStockType2').text(modelStock2.STOCK_KEEPING_UNIT);
    } else {
        $('#feed_usage_detail #lblStockType2').text("");
    }
    if (!IsNanOrNullOrEmpty(modelStock2.QUANTITY)) {
        $('#feed_usage_detail #txtProQty2').val(modelStock2.QUANTITY);
    } else {
        $('#feed_usage_detail #txtProQty2').val("");
    }
    if (!IsNanOrNullOrEmpty(modelStock2.WEIGHT)) {
        $('#feed_usage_detail #txtProWt2').val(modelStock2.WEIGHT);
    } else {
        $('#feed_usage_detail #txtProWt2').val("");
    }
    if (!IsNanOrNullOrEmpty(modelStock2.QUOTA_QTY)) {
        $('#feed_usage_detail #lblQtyBal2').text(modelStock2.QUOTA_QTY);
    } else {
        $('#feed_usage_detail #lblQtyBal2').text("");
    }
    if (!IsNanOrNullOrEmpty(modelStock2.QUOTA_WT)) {
        $('#feed_usage_detail #lblWtBal2').text(modelStock2.QUOTA_WT);
    } else {
        $('#feed_usage_detail #lblWtBal2').text("");
    }



    if (!IsNullOrEmpty(modelStock3.PRODUCT_SHORT_NAME)) {
        $('#feed_usage_detail #lkProductId3 span').text(modelStock3.PRODUCT_CODE + ' ' + modelStock3.PRODUCT_SHORT_NAME);
    } else {
        $('#feed_usage_detail #lkProductId3 span').text(lkSelectTxt);
    }
    if (!IsNullOrEmpty(modelStock3.STOCK_KEEPING_UNIT)) {
        $('#feed_usage_detail #lblStockType3').text(modelStock3.STOCK_KEEPING_UNIT);
    } else {
        $('#feed_usage_detail #lblStockType3').text("");
    }
    if (!IsNanOrNullOrEmpty(modelStock3.QUANTITY)) {
        $('#feed_usage_detail #txtProQty3').val(modelStock3.QUANTITY);
    } else {
        $('#feed_usage_detail #txtProQty3').val("");
    }
    if (!IsNanOrNullOrEmpty(modelStock3.WEIGHT)) {
        $('#feed_usage_detail #txtProWt3').val(modelStock3.WEIGHT);
    } else {
        $('#feed_usage_detail #txtProWt3').val("");
    }
    if (!IsNanOrNullOrEmpty(modelStock3.QUOTA_QTY)) {
        $('#feed_usage_detail #lblQtyBal3').text(modelStock3.QUOTA_QTY);
    } else {
        $('#feed_usage_detail #lblQtyBal3').text("");
    }
    if (!IsNanOrNullOrEmpty(modelStock3.QUOTA_WT)) {
        $('#feed_usage_detail #lblWtBal3').text(modelStock3.QUOTA_WT);
    } else {
        $('#feed_usage_detail #lblWtBal3').text("");
    }


    $('#feed_usage_detail #txtTotalQty').val(TotalQty());
    $('#feed_usage_detail #txtTotalWt').val(TotalWt());

}

//retrieve input to model
function retrieveFromInput() {
    var txt;
    txt = $('#feed_usage_detail #lkFarmOrg span').text();
    if (txt != lkSelectTxt && FeedUsageInput != null) {
        model.FARM_ORG_LOC = FeedUsageInput.CODE;
        model.FARM_ORG_NAME = FeedUsageInput.NAME;
        model.POULTRY_BALANCE = $.Ctx.GetPageParam('feed_usage_detail', 'poultryBalance');
        model.STD_USAGE;

    }

    if (typeof ($('#feed_usage_detail #txtTotalQty').val()) != 'undefined') {
        model.TOTAL_QTY = $('#feed_usage_detail #txtTotalQty').val();
    }
    if (typeof ($('#feed_usage_detail #txtTotalWt').val()) != 'undefined') {
        model.TOTAL_WT = $('#feed_usage_detail #txtTotalWt').val();
    }




    txt = $('#feed_usage_detail #lkProductId1 span').text();
    if (txt != lkSelectTxt && ProductInput1 != null) {
        modelStock1.PRODUCT_CODE = ProductInput1.PRODUCT_CODE;
    }
    if (typeof ($('#feed_usage_detail #txtProQty1').val()) != 'undefined') {
        modelStock1.QUANTITY = $('#feed_usage_detail #txtProQty1').val();
    }
    if (typeof ($('#feed_usage_detail #txtProWt1').val()) != 'undefined') {
        modelStock1.WEIGHT = $('#feed_usage_detail #txtProWt1').val();
    }

    txt = $('#feed_usage_detail #lkProductId2 span').text();
    if (txt != lkSelectTxt && ProductInput2 != null) {
        modelStock2.PRODUCT_CODE = ProductInput2.PRODUCT_CODE;
    }
    if (typeof ($('#feed_usage_detail #txtProQty2').val()) != 'undefined') {
        modelStock2.QUANTITY = $('#feed_usage_detail #txtProQty2').val();
    }
    if (typeof ($('#feed_usage_detail #txtProWt2').val()) != 'undefined') {
        modelStock2.WEIGHT = $('#feed_usage_detail #txtProWt2').val();
    }

    txt = $('#feed_usage_detail #lkProductId3 span').text();
    if (txt != lkSelectTxt && ProductInput3 != null) {
        modelStock3.PRODUCT_CODE = ProductInput3.PRODUCT_CODE;
    }
    if (typeof ($('#feed_usage_detail #txtProQty3').val()) != 'undefined') {
        modelStock3.QUANTITY = $('#feed_usage_detail #txtProQty3').val();
    }
    if (typeof ($('#feed_usage_detail #txtProWt3').val()) != 'undefined') {
        modelStock3.WEIGHT = $('#feed_usage_detail #txtProWt3').val();
    }

    $.Ctx.SetPageParam('feed_usage_detail', 'model', model);
    $.Ctx.SetPageParam('feed_usage_detail', 'modelStock1', modelStock1);
    $.Ctx.SetPageParam('feed_usage_detail', 'modelStock2', modelStock2);
    $.Ctx.SetPageParam('feed_usage_detail', 'modelStock3', modelStock3);

    $.Ctx.SetPageParam('feed_usage_detail', 'ProductInput1', ProductInput1);
    $.Ctx.SetPageParam('feed_usage_detail', 'ProductInput2', ProductInput2);
    $.Ctx.SetPageParam('feed_usage_detail', 'ProductInput3', ProductInput3);


}
var scanCode = function () {
    window.plugins.barcodeScanner.scan(
        function (result) {
            $.Ctx.MsgBox("Scanned Code: " + result.text
                + ". Format: " + result.format
                + ". Cancelled: " + result.cancelled);
        }, function (error) {
            $.Ctx.MsgBox("Scan failed: " + error);
        });
}

var navigateProgductLookup = function (calledResult, productCodeStr) {
    var p = new LookupParam();
    p.calledPage = 'feed_usage_detail';
    p.calledResult = calledResult;  //'ProductInput1';
    $.Ctx.SetPageParam('lookup_product_usage', 'param', p);
    $.Ctx.SetPageParam('lookup_product_usage', 'Previous', 'feed_usage_detail');
    $.Ctx.SetPageParam('lookup_product_usage', 'product_stock_type', $.Ctx.GetPageParam('feed_usage_search', 'product_stock_type'));
    $.Ctx.SetPageParam('lookup_product_usage', 'ProductCode', productCodeStr);
    $.Ctx.SetPageParam('lookup_product_usage', 'selectedFarmOrgCode', $.Ctx.GetPageParam('feed_usage_detail', 'FeedUsageInput').CODE);
    $.Ctx.NavigatePage('lookup_product_usage', null, { transition: 'slide', action: 'reverse' }, false);
}

function findStockBalance(success) {
    var cmd2 = $.Ctx.DbConn.createSelectCommand();
    cmd2.sqlText = " SELECT SUM ( CASE WHEN GROWER.TRANSACTION_TYPE = '1' THEN (ifnull(GROWER.MALE_QTY,0) + ifnull(GROWER.FEMALE_QTY,0))  ELSE (ifnull(GROWER.MALE_QTY , 0 ) + ifnull(GROWER.FEMALE_QTY,0)) * -1 END) AS POULTRY_BALANCE FROM HH_FR_MS_GROWER_STOCK GROWER WHERE    GROWER.ORG_CODE = ? AND GROWER.FARM_ORG = ? AND GROWER.FARM_ORG_LOC = ?"

    cmd2.parameters.push($.Ctx.SubOp);
    cmd2.parameters.push($.Ctx.Warehouse);
    cmd2.parameters.push($.Ctx.GetPageParam('feed_usage_detail', 'FeedUsageInput').CODE);
    console.log(cmd2);
    var ret = [];
    cmd2.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            console.log(res.rows.item(0))
            ret.push(res.rows.item(0));
            $.Ctx.SetPageParam('feed_usage_detail', 'poultryBalance', res.rows.item(0).POULTRY_BALANCE);
            success(ret);
        }
    });

}
function findStandardUsage(farmorg, success) {
    var cmd2 = $.Ctx.DbConn.createSelectCommand();
    cmd2.sqlText = " SELECT (A.STD_USAGE) AS STD_USAGE, ";
    cmd2.sqlText += " (SELECT CONDITION_01  FROM HH_GD2_FR_MAS_TYPE_FARM WHERE GD_TYPE = 'SFD' AND GD_CODE = ? GROUP BY CONDITION_01) AS STD_DIF_PER, FEED_TOTAL ";
    cmd2.sqlText += " FROM (SELECT ( CASE WHEN STD.FEED_PER_HEAD IS NULL THEN 0 ELSE STD.FEED_PER_HEAD END) AS STD_USAGE, FEED_TOTAL ";
    cmd2.sqlText += " FROM  HH_FR_STD_FEED_BY_FARM STD ";
    cmd2.sqlText += " WHERE STD.FEED_DATE = ? AND STD.ORG_CODE = ? AND STD.FARM_ORG_LOC = ?) A  ";
    cmd2.parameters.push($.Ctx.SubOp);
    cmd2.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
    cmd2.parameters.push($.Ctx.SubOp);
    cmd2.parameters.push(farmorg);
    var ret = [];
    cmd2.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            console.log(res.rows.item(0))
            ret.push(res.rows.item(0));
            success(ret);
        }
    });

}

function findMaxDocumentNo(success) {

    var cmdMaxDoc = $.Ctx.DbConn.createSelectCommand();
    cmdMaxDoc.sqlText = "SELECT MAX ( MAT.DOCUMENT_NO +0 ) AS MAX_DOCUMENT_NO FROM {0} MAT WHERE MAT.ORG_CODE = ?".format([$.Ctx.Bu == "FARM_PIG" ? 'HH_FR_MS_SWINE_MATERIAL' : 'HH_FR_MS_MATERIAL_STOCK']);
    cmdMaxDoc.parameters.push($.Ctx.SubOp);
    var ret = [];
    cmdMaxDoc.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            console.log(res.rows.item(0))
            ret.push(res.rows.item(0));
            success(ret);
        }
    });

}