var clickAlias = "click";
var docTypeDead = "61";
var picShow = null;
//var picData1 = picData2 = null;

$("#grower_dead_trans_poultry").bind("pageinit", function (event) {
    $('#grower_dead_trans_poultry #btnSave').bind(clickAlias, function () {
        SaveSaleTrans(function (ret) {
            if (ret == true) {
                $.Ctx.MsgBox($.Ctx.Lcl('grower_dead_trans_poultry', 'MsgSaveComplete', 'Save Completed.'));
                if ($.Ctx.GetPageParam('grower_dead_trans_poultry', 'Mode') == "Create")
                    ClearAfterSave();
                else {
                   
                    Model2Control();
                    $('#grower_dead_trans_poultry #female-qty').val("");
                    //$('#grower_dead_trans_poultry #female-qty').val($.Ctx.GetPageParam('grower_dead_trans_poultry', 'Data').);
                    
                }
                    
                /*$.Ctx.NavigatePage($.Ctx.GetPageParam('grower_dead_trans_poultry', 'Previous'), null, { transition: 'slide', reverse: false });*/
            }
        });
        return false;
    });

    $('#grower_dead_trans_poultry #lpFarmOrg').bind(clickAlias, function () {
        $.Ctx.SetPageParam('grower_dead_trans_poultry', 'ScrollingTo', $(window).scrollTop());
        $.FarmCtx.SearchFarmOrgUsingMapMobile(function (orgs) {
            if (orgs !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('grower_dead_trans_poultry', 'msgFarmOrg', 'Farm Organization');
                p.calledPage = 'grower_dead_trans_poultry';
                p.calledResult = 'selectedFarmOrg';
                p.codeField = 'CODE';
                p.nameField = 'NAME';
                p.showCode = true;
                p.dataSource = orgs;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            }
        });
    });

    $('#grower_dead_trans_poultry #lpReason').bind(clickAlias, function () {
        $.Ctx.SetPageParam('grower_dead_trans_poultry', 'ScrollingTo', $(window).scrollTop());
        SearchReasonCode(function (reasons) {
            if (reasons !== null) {
                var p = new LookupParam();
                p.title = $.Ctx.Lcl('grower_dead_trans_poultry', 'msgDeadReason', 'Dead Reason');
                p.calledPage = 'grower_dead_trans_poultry';
                p.calledResult = 'selectedReason';
                p.codeField = 'REASON_CODE';
                p.nameField = 'REASON_NAME';
                p.showCode = true;
                p.dataSource = reasons;

                $.Ctx.SetPageParam('lookup', 'param', p);
                $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('grower_dead_trans_poultry', 'msgResonNoFod', 'Reason for Dead not found.'));
            }
        });
    });

    $('#grower_dead_trans_poultry #btnBack').bind('click', function () {
        //Check Dirty
        var dirty = false;
        var mode = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Mode');
        var model = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Data');
        if (mode == 'Create' && model !== null && Object.keys(model).length > 0) {
            dirty = true;
        }
        var isExit = true;
        /*if (dirty==true){
			isExit = confirm($.Ctx.Lcl('grower_dead_trans_poultry', 'msgConfirmExit', 'Data is Dirty, Exit?'));
		}else{
			isExit=true;
		}*/
        if (isExit == true) {
            $.Ctx.NavigatePage($.Ctx.GetPageParam('grower_dead_trans_poultry', 'Previous'),
			null,
			{ transition: 'slide', reverse: true });
        }
        return false;
    });

    $('#grower_dead_trans_poultry img[id^="takePic"]').bind(clickAlias, function () {
        var id = $(this).attr('id');
        var picShow = id.replace('take', ''); //Pic1,Pic2
        takePicture('#' + picShow);
    });

    $('#grower_dead_trans_poultry #male-qty').focusout(function () {
        var qtyStr = $(this).val();
        $(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
    });
    $('#grower_dead_trans_poultry #female-qty').focusout(function () {
        var qtyStr = $(this).val();
        $(this).val(Math.floor(Number(qtyStr)));
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
    });
    $('#grower_dead_trans_poultry #total-wt').focusout(function () {
        if (Number($(this).val()) <= 0) {
            $(this).val('');
        }
    });
});

$("#grower_dead_trans_poultry").bind("pagebeforehide", function (event, ui) {
    var model = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Data');
    if (model == null) {
        model = {};
        $.Ctx.SetPageParam('grower_dead_trans_poultry', 'Data', model);
    }
    

    model.MALE_QTY = Number($.Ctx.Nvl($('#grower_dead_trans_poultry #male-qty').val(),0));
    model.FEMALE_QTY = Number($.Ctx.Nvl($('#grower_dead_trans_poultry #female-qty').val(),0));

    var totalW = Number($.Ctx.Nvl($('#grower_dead_trans_poultry #total-wt').val() , 0));
    model.MALE_WGH = Number((totalW * model.MALE_QTY / (model.MALE_QTY + model.FEMALE_QTY)).toFixed(2));
    model.FEMALE_WGH = totalW - model.MALE_WGH;

    var dead = $('#grower_dead_trans_poultry #rbtDestroyDead').attr('checked');
    if (dead == "checked")
        model.DEAD_TYPE = "1";
    else
        model.DEAD_TYPE = "2";
});

$('#grower_dead_trans_poultry').bind("pagebeforecreate", function (e) {
    $.Util.RenderUiLang('grower_dead_trans_poultry');
    $.Ctx.RenderFooter('grower_dead_trans_poultry');
});

$("#grower_dead_trans_poultry").bind("pagebeforeshow", function (event, ui) {
    //console.log( $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Data'));
    var model = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Data');
    if (model == null) {
        model = {};
        $.Ctx.SetPageParam('grower_dead_trans_poultry', 'Data', model);
    }

    var prevPage = (typeof ui.prevPage[0] == 'undefined' ? "" : ui.prevPage[0].id);
    if (prevPage.indexOf("lookup") > -1) {//From Lookup	
        //===== Farm Org ====
        var farmOrg = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'selectedFarmOrg');
        if (farmOrg !== null) {
            if (model.FARM_ORG_LOC !== farmOrg.CODE) {
                $.Ctx.SetPageParam('grower_dead_trans_poultry', 'BreederSelected', null);
                model.BREEDER = null;
                model.BREEDER_NAME = null;
                model.BIRTH_WEEK = null;
                model.A_MALE_QTY = 0;
                model.A_FEMALE_QTY = 0;
            }
            model.FARM_ORG_LOC = farmOrg.CODE;
            model.FARM_ORG_NAME = farmOrg.NAME;
        }
        //======= REASON ======
        var reason = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'selectedReason');
        if (reason !== null) {
            model.REASON_CODE = reason.REASON_CODE;
            model.REASON_NAME = reason.REASON_NAME;
        }
    } else {
        var mode = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Mode');
        if (mode !== 'Create') {
            //Disable key
            var key = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Key');
            FindGrowerDead(key.FARM_ORG_LOC, key.TRANSACTION_DATE, key.DOCUMENT_TYPE, key.DOCUMENT_EXT, function (ret) {
                //console.log(ret);
                //ret.ORG_CODE;
                //ret.FARM_ORG;
                //console.log(ret);
                if (ret !== null) {
                    model.FARM_ORG_LOC = ret.FARM_ORG_LOC;
                    model.FARM_ORG_NAME = ret.FARM_ORG_LOC_NAME;
                    model.DOCUMENT_EXT = ret.DOCUMENT_EXT;
                    model.TRANSACTION_DATE = ret.TRANSACTION_DATE;
                    //ret.DOCUMENT_TYPE=docType;
                    model.DEAD_TYPE = ret.DEAD_TYPE;
                    model.BREEDER = ret.BREEDER;
                    model.BREEDER_NAME = ret.BREEDER_NAME;
                    model.BIRTH_WEEK = ret.BIRTH_WEEK;
                    model.REASON_CODE = ret.REASON_CODE;
                    model.REASON_NAME = ret.REASON_NAME;
                    model.MALE_QTY = ret.MALE_QTY;
                    model.MALE_WGH = ret.MALE_WGH;
                    model.FEMALE_QTY = ret.FEMALE_QTY;
                    model.FEMALE_WGH = ret.FEMALE_WGH;
                    model.IMAGE1 = ret.IMAGE1;
                    model.IMAGE2 = ret.IMAGE2;
                    model.ORIGINAL_MALE_QTY = ret.MALE_QTY;
                    model.ORIGINAL_FEMALE_QTY = ret.FEMALE_QTY; 
                    //model.MALE_QTY = ret.NUMBER_OF_SENDING_DATA;
                    $.FarmCtx.FindAvaliableGrowerStock(model.FARM_ORG_LOC, model.BREEDER, model.BIRTH_WEEK, function (ret) {
                        if (ret !== null) {
                            model.A_MALE_QTY = ret.A_MALE_QTY;
                            model.A_FEMALE_QTY = ret.A_FEMALE_QTY;
                        }
                        Model2Control();
                    });
                } else {
                    console.log('Find not found');
                }
            });
        }
    }
    console.log($.Ctx.GetPageParam('grower_dead_trans_poultry', 'Data'));
});

$("#grower_dead_trans_poultry").bind("pageshow", function (event) {
    var mode = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Mode');
    if (mode == 'Update') {
        //Disable key
        //self.find('#lpFarmOrg').button('disable'); 
        $('#grower_dead_trans_poultry #lpFarmOrg').button('disable');
    } else if (mode == 'Create') {
        $('#grower_dead_trans_poultry #lpFarmOrg').button('enable');
    } else {
        $('#grower_dead_trans_poultry #lpFarmOrg').button('disable');
        $('#grower_dead_trans_poultry #btnSave').hide();
    }
    if ($.Ctx.Bu == "FARM_PIG") {
        $('#grower_dead_trans_poultry #liBirthWeek').show();

        //$('#rbtDestroyDead').prop("checked","true").checkboxradio("refresh")
        $('#rbtDestroyCulling').attr("disabled", "disabled");
    } else {
        $('#grower_dead_trans_poultry #liBirthWeek').hide();

        $('#rbtDestroyCulling').removeAttr("disabled");
    }
    //$('#grower_dead_trans_poultry #lblMode').html("Mode: " + mode);
    Model2Control();

    if ($.Ctx.GetPageParam('grower_dead_trans_poultry', 'ScrollingTo') != null) {
        //scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
        $('html, body').animate({
            scrollTop: $.Ctx.GetPageParam('grower_dead_trans_poultry', 'ScrollingTo')
        }, 0);
    }



});

function ClearAfterSave() {
    var model = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Data');
    if (model !== null) {
        model.BIRTH_WEEK = null;
        model.REASON_CODE = null;
        model.REASON_NAME = null;
        $.Ctx.SetPageParam('grower_dead_trans_poultry', 'selectedReason', null);

        model.BREEDER = null;
        $.Ctx.SetPageParam('grower_dead_trans_poultry', 'BreederSelected', null);
        model.A_MALE_QTY = 0;
        model.A_FEMALE_QTY = 0;

        model.MALE_QTY = 0;
        model.MALE_WGH = 0;
        model.FEMALE_QTY = 0;
        model.FEMALE_WGH = 0; 
        model.IMAGE1 = null;
        model.IMAGE2 = null;

        model.ORIGINAL_MALE_QTY = 0;
        model.ORIGINAL_FEMALE_QTY = 0;
        $.Ctx.SetPageParam('grower_dead_trans_poultry', 'Data', model);
        Model2Control();
    }
}

function Model2Control() {
    var model = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Data');
    if (model !== null) {
        if (model.FARM_ORG_LOC == null)
            $('#grower_dead_trans_poultry #lpFarmOrg').text($.Ctx.Lcl('grower_dead_trans_poultry', 'msgSelect', 'Select'));
        else
            $('#grower_dead_trans_poultry #lpFarmOrg').text(model.FARM_ORG_LOC+"("+model.FARM_ORG_NAME+")");
        $('#grower_dead_trans_poultry #lpFarmOrg').button('refresh');

        if (model.REASON_CODE == null)
            $('#grower_dead_trans_poultry #lpReason').text($.Ctx.Lcl('grower_dead_trans_poultry', 'msgSelect', 'Select'));
        else
            $('#grower_dead_trans_poultry #lpReason').text(model.REASON_NAME);
        $('#grower_dead_trans_poultry #lpReason').button('refresh');

        if (model.DEAD_TYPE == "2") {
            $('#grower_dead_trans_poultry #rbtDestroyDead').removeAttr('checked').checkboxradio("refresh");
            $('#grower_dead_trans_poultry #rbtDestroyCulling').attr('checked', 'checked').checkboxradio("refresh");
        } else {
            $('#grower_dead_trans_poultry #rbtDestroyDead').attr('checked', 'checked').checkboxradio("refresh");
            $('#grower_dead_trans_poultry #rbtDestroyCulling').removeAttr('checked').checkboxradio("refresh");
        }

        $('#grower_dead_trans_poultry #male-qty').val(model.MALE_QTY == 0 ? '' : model.MALE_QTY);
        $('#grower_dead_trans_poultry #female-qty').val(model.FEMALE_QTY == 0 ? '' : model.FEMALE_QTY);
        var totalW = ($.Ctx.Nvl( model.MALE_WGH , 0 )) + ($.Ctx.Nvl( model.FEMALE_WGH , 0 ));
        $('#grower_dead_trans_poultry #total-wt').val(totalW == 0 ? '' : totalW);

        $('#grower_dead_trans_poultry #lblAvMale').html($.Ctx.Nvl(model.A_MALE_QTY ,'' ));
        $('#grower_dead_trans_poultry #lblAvFMale').html($.Ctx.Nvl(model.A_FEMALE_QTY , '' ));

        BindPicture();

        ////show stock balance
        //var cmd = [];
        //var mStock = new S1_ST_STOCK_TRN();
        //mStock.COMPANY = $.Ctx.ComCode;
        //mStock.OPERATION = $.Ctx.Op;
        //mStock.SUB_OPERATION = $.Ctx.SubOp;
        //mStock.BUSINESS_UNIT = $.Ctx.Bu;
        //mStock.DOCUMENT_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
        ////mStock.DOC_TYPE = bmodel.DOCUMENT_TYPE;
        ////mStock.DOC_NUMBER = Number(bmodel.DOCUMENT_NO).toString();
        ////mStock.EXT_NUMBER = bmodel.DOCUMENT_EXT;
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
        //    console.log('111111111111111111');
        //    Success(cmds);
        //}, function (err) {
        //    $.Ctx.MsgBox("Err :" + err.message);
        //    Fail(err);
        //});
        //////

        findStockBalance(function (ret) {
            if (ret != null && ret[0].POULTRY_BALANCE != null) {
                var mode = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Mode');
                if (mode == 'Update') {
                var model = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Data');
                var stkBalance = $.Ctx.Nvl(ret[0].POULTRY_BALANCE , 0 ) + model.ORIGINAL_FEMALE_QTY + model.ORIGINAL_MALE_QTY ;

                $("#txtPoultryBal").val( stkBalance);
                }
                else {
                    $("#txtPoultryBal").val(ret[0].POULTRY_BALANCE);
                }
            }
        });

    }
}

function BindPicture() {
    console.log('bind data');
    var model = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Data');
    if (model !== null) {
        $('#grower_dead_trans_poultry #divPic2').empty();
        $('#grower_dead_trans_poultry #divPic1').empty();
        if (typeof model.IMAGE1 == 'undefined' || model.IMAGE1 == null) {

        } else {
            $('#grower_dead_trans_poultry #divPic1').append('<img style="width:100%" src="data:image/jpeg;base64,' + model.IMAGE1 + '" />');
        }
        if (typeof model.IMAGE2 == 'undefined' || model.IMAGE2 == null) {

        } else {
            $('#grower_dead_trans_poultry #divPic2').append('<img style="width:100%" src="data:image/jpeg;base64,' + model.IMAGE2 + '" />');
        }
        //console.log('m1 ' + model.IMAGE1);
        //console.log('m2 ' + model.IMAGE2);
    }
}
function SaveSaleTrans(SuccessCB) {
    var qtyM = Number($.Ctx.Nvl($('#grower_dead_trans_poultry #male-qty').val() , 0)),
		qtyF = Number($.Ctx.Nvl($('#grower_dead_trans_poultry #female-qty').val(),0)),
		totalW = Number($.Ctx.Nvl($('#grower_dead_trans_poultry #total-wt').val(),0));
    var model = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Data');
    if ($.Ctx.Bu == "FARM_PIG") {
        if (model.FARM_ORG_LOC == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('grower_dead_trans_poultry', 'msgReqFarmOrg', 'Farm Org is Required.'));
            SuccessCB(false); return false;
        }
        if (model.REASON_CODE == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('grower_dead_trans_poultry', 'msgReqReason', 'Reason is Required.'));
            SuccessCB(false); return false;
        }
        if (model.BREEDER == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('grower_dead_trans_poultry', 'msgReqBreeder', 'Breeder is Required.'));
            SuccessCB(false); return false;
        }
        if (model.BIRTH_WEEK == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('grower_dead_trans_poultry', 'msgReqBirthWeek', 'Birth week is Required.'));
            SuccessCB(false); return false;
        }
        if (qtyM + qtyF == 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('grower_dead_trans_poultry', 'msgReqQty', 'Quantity is Required.'));
            SuccessCB(false); return false;
        }
        if (totalW == 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('grower_dead_trans_poultry', 'msgReqWeight', 'Total Weight is Required.'));
            SuccessCB(false); return false;
        }
    } else {
        if (model.FARM_ORG_LOC == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('grower_dead_trans_poultry', 'msgReqFarmOrg', 'Farm Org is Required.'));
            SuccessCB(false); return false;
        }

        if (model.REASON_CODE == null) {
            $.Ctx.MsgBox($.Ctx.Lcl('grower_dead_trans_poultry', 'msgReqReason', 'Reason is Required.'));
            SuccessCB(false); return false;
        }

        if (qtyM + qtyF == 0) {
            $.Ctx.MsgBox($.Ctx.Lcl('grower_dead_trans_poultry', 'msgReqQty', 'Quantity is Required.'));
            SuccessCB(false); return false;
        }

    }

    var dead = $('#grower_dead_trans_poultry #rbtDestroyDead').attr('checked');
    if (dead == "checked")
        model.DEAD_TYPE = "1";
    else
        model.DEAD_TYPE = "2";

    var mode = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Mode');
    if (mode == 'Update') {
        ValidateStock(qtyM, qtyF, model.FARM_ORG_LOC, $.Ctx.GetBusinessDate(), model.BREEDER, model.BIRTH_WEEK, model.DOCUMENT_EXT, function (isSucc) {
            if (isSucc == true) {
                $.FarmCtx.DeleteGrowerStockByKey(model.FARM_ORG_LOC, $.Ctx.GetBusinessDate(), '2', docTypeDead, model.DOCUMENT_EXT,
					function (succ) {
					    if (succ == true)
					        SaveWithDocExt(model.DOCUMENT_EXT);
					});
            }
        });
    } else {//Add
        ValidateStock(qtyM, qtyF, model.FARM_ORG_LOC, $.Ctx.GetBusinessDate(), model.BREEDER, model.BIRTH_WEEK, -1, function (isSucc) {
            if (isSucc == true) {
                GetDocExt(SaveWithDocExt);
            }
        });
    }

    function SaveWithDocExt(ext) {
        //$.Ctx.MsgBox('save number ' + ext);
        var dataM = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Data');
        var qtyM = Number($.Ctx.Nvl( $('#grower_dead_trans_poultry #male-qty').val(),0)),
			qtyF = Number($.Ctx.Nvl($('#grower_dead_trans_poultry #female-qty').val(),0)),
			totalW = Number($.Ctx.Nvl($('#grower_dead_trans_poultry #total-wt').val(),0));

        var gDead = new HH_FR_MS_GROWER_DEAD();
        gDead.ORG_CODE = $.Ctx.SubOp;
        gDead.FARM_ORG = $.Ctx.Warehouse;
        gDead.FARM_ORG_LOC = dataM.FARM_ORG_LOC;
        gDead.TRANSACTION_DATE = $.Ctx.GetBusinessDate().toDbDateStr();
        gDead.DOCUMENT_TYPE = docTypeDead;
        gDead.DOCUMENT_EXT = ext;
        gDead.BREEDER = dataM.BREEDER;
        if ($.Ctx.Bu == "FARM_PIG") {
            gDead.BIRTH_WEEK = dataM.BIRTH_WEEK;
        }
        gDead.DEAD_TYPE = dataM.DEAD_TYPE;
        gDead.REASON_CODE = dataM.REASON_CODE;
        gDead.MALE_QTY = (isNaN(qtyM) ? 0 : qtyM);
        gDead.MALE_WGH = Number((totalW * qtyM / (qtyM + qtyF)).toFixed(2));
        gDead.MALE_AMT = 0;
        gDead.FEMALE_QTY = (isNaN(qtyF) ? 0 : qtyF);
        gDead.FEMALE_WGH = totalW - gDead.MALE_WGH;
        gDead.FEMALE_AMT = 0;
        gDead.NUMBER_OF_SENDING_DATA = 0;
        gDead.OWNER = $.Ctx.UserId;
        gDead.CREATE_DATE = (new XDate()).toDbDateStr();
        gDead.LAST_UPDATE_DATE = (mode == 'Update' ? (new XDate()).toDbDateStr() : null);
        gDead.FUNCTION = (mode == 'Update' ? 'C' : 'A');
        gDead.IMAGE1 = dataM.IMAGE1;
        gDead.IMAGE2 = dataM.IMAGE2;

        var gStock = new HH_FR_MS_GROWER_STOCK();
        gStock.ORG_CODE = $.Ctx.SubOp;
        gStock.FARM_ORG = $.Ctx.Warehouse;
        gStock.FARM_ORG_LOC = gDead.FARM_ORG_LOC;
        gStock.TRANSACTION_DATE = gDead.TRANSACTION_DATE;
        gStock.TRANSACTION_TYPE = '2';
        gStock.DOCUMENT_TYPE = docTypeDead;
        gStock.DOCUMENT_EXT = ext;
        gStock.BREEDER = gDead.BREEDER;
        gStock.BIRTH_WEEK = gDead.BIRTH_WEEK;
        gStock.MALE_QTY = (isNaN(gDead.MALE_QTY)? 0 : gDead.MALE_QTY);
        gStock.MALE_WGH = gDead.MALE_WGH;
        gStock.MALE_AMT = gDead.MALE_AMT;
        gStock.FEMALE_QTY = (isNaN(gDead.FEMALE_QTY) ? 0 : gDead.FEMALE_QTY);
        gStock.FEMALE_WGH = gDead.FEMALE_WGH;
        gStock.FEMALE_AMT = gDead.FEMALE_AMT;
        gStock.OWNER = $.Ctx.UserId;
        gStock.CREATE_DATE = gDead.CREATE_DATE;
        gStock.LAST_UPDATE_DATE = gDead.LAST_UPDATE_DATE;
        gStock.FUNCTION = gDead.FUNCTION;
        gStock.NUMBER_OF_SENDING_DATA = 0;

        var paramCmd = [];
        var cmd, cmd2;
        if (mode == 'Update')
            cmd = gDead.updateCommand($.Ctx.DbConn);
        else
            cmd = gDead.insertCommand($.Ctx.DbConn);

        cmd2 = gStock.insertCommand($.Ctx.DbConn);
        paramCmd.push(cmd);
        paramCmd.push(cmd2);

        var trn = new DbTran($.Ctx.DbConn);
        trn.executeNonQuery(paramCmd, function () {
            if (typeof (SuccessCB) == "function")
                SuccessCB(true);
        }, function (errors) {
            SuccessCB(false);
            console.log(errors);
        });
    }
}

function SearchReasonCode(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nameField = "ifnull(DESC_LOC, DESC_ENG)";
    if ($.Ctx.Lang == "en-US") {
        nameField = "ifnull(DESC_ENG, DESC_LOC)";
    }
    if ($.Ctx.Bu == "FARM_PIG") {
        cmd.sqlText = "SELECT GD_CODE AS REASON_CODE,{0} AS REASON_NAME FROM HH_GD2_FR_MAS_TYPE_FARM WHERE GD_TYPE='RSC'  ORDER BY 1".format([nameField]);
    }
    else if ($.Ctx.Bu == "FARM_POULTRY") {
        cmd.sqlText = " SELECT GD_CODE AS REASON_CODE,{0} AS REASON_NAME ".format([nameField]);
        cmd.sqlText += " FROM HH_GD2_FR_MAS_TYPE_FARM  ";
        cmd.sqlText += " WHERE GD_TYPE='RSC' ";
    }
    var ret = [];
    cmd.executeReader(function (t, res) {
        if (res.rows.length != 0) {
            for (var i = 0; i < res.rows.length; i++) {
                if (res.rows.item(i).REASON_NAME !== null)
                    ret.push({ 'REASON_CODE': res.rows.item(i).REASON_CODE, 'REASON_NAME': res.rows.item(i).REASON_NAME });
            }
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    });
}

function GetDocExt(SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT MAX(DOCUMENT_EXT) AS RUN_EXT FROM HH_FR_MS_GROWER_DEAD WHERE ORG_CODE=? AND FARM_ORG=? AND TRANSACTION_DATE=? ";
    var ret = [];
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push($.Ctx.GetBusinessDate().toDbDateStr());
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            SuccessCB(res.rows.item(0).RUN_EXT == null ? 1 : res.rows.item(0).RUN_EXT + 1);
        } else {
            SuccessCB(1);
        }
    });
}

function ValidateStock(qtyM, qtyF, farmLoc, txDate, breeder, birWeek, docExt, FuncCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT TRANSACTION_TYPE, SUM(MALE_QTY) AS SUM_MALE,SUM(FEMALE_QTY) AS SUM_FEMALE ";
    cmd.sqlText += "FROM HH_FR_MS_GROWER_STOCK ";
    cmd.sqlText += "WHERE ORG_CODE=? AND FARM_ORG=? AND FARM_ORG_LOC=? ";
    if ($.Ctx.Bu == "02" || $.Ctx.Bu == "FARM_PIG")
        cmd.sqlText += " AND BREEDER=? AND BIRTH_WEEK=? ";


    cmd.sqlText += "GROUP BY TRANSACTION_TYPE ";
    var ret = [];
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push(farmLoc);

    if ($.Ctx.Bu == "02" || $.Ctx.Bu == "FARM_PIG") {
        cmd.parameters.push(breeder);
        cmd.parameters.push(birWeek);
    }
    if (docExt != -1) {
        FindQtyOldFromDestroy(farmLoc, txDate.toDbDateStr(), docTypeDead, docExt, breeder, birWeek, function (ret) {
            var qtyMOld = 0, qtyFOld = 0;
            qtyMOld = ret.MALE_QTY;
            qtyFOld = ret.FEMALE_QTY;
            cmd.executeReader(function (t, res) {
                if (res.rows.length > 0) {
                    Reader(res, qtyMOld, qtyFOld);
                } else {
                    $.Ctx.MsgBox($.Ctx.Lcl('grower_dead_trans_poultry', 'msgDeadNotFod', 'Grower dead not found.'));
                    FuncCB(false, -1, -1);
                }
            });
        });
    } else {
        cmd.executeReader(function (t, res) {
            if (res.rows.length > 0) {
                Reader(res, 0, 0);
            } else {
                $.Ctx.MsgBox($.Ctx.Lcl('grower_dead_trans_poultry', 'msgDeadNotFod', 'Grower dead not found.'));
                FuncCB(false, -1, -1);
            }
        });
    }

    function Reader(res, qtyMOld, qtyFOld) {
        var receiveM = 0, spendM = 0, receiveF = 0, spendF = 0;
        for (var i = 0; i < res.rows.length; i++) {
            if (res.rows.item(i).TRANSACTION_TYPE == '2') {
                spendM += (res.rows.item(i).SUM_MALE == null ? 0 : res.rows.item(i).SUM_MALE);
                spendF += (res.rows.item(i).SUM_FEMALE == null ? 0 : res.rows.item(i).SUM_FEMALE);
            } else if (res.rows.item(i).TRANSACTION_TYPE == '1') {
                receiveM += (res.rows.item(i).SUM_MALE == null ? 0 : res.rows.item(i).SUM_MALE);
                receiveF += (res.rows.item(i).SUM_FEMALE == null ? 0 : res.rows.item(i).SUM_FEMALE);
            }
        }
        var succ = false;
        var maleRem = receiveM - spendM + qtyMOld,
			femaleRem = receiveF - spendF + qtyFOld;
        if ((qtyM + spendM - qtyMOld) > receiveM) {
            //key Male เกิน
            $.Ctx.MsgBox($.Ctx.Lcl('grower_dead_trans_poultry', 'msgMaleRem', 'Male remain ') + maleRem);
        } else {
            succ = true;
        }
        if (succ == true) {
            if ((qtyF + spendF - qtyFOld) > receiveF) {
                //key Female เกิน
                succ = false;
                $.Ctx.MsgBox($.Ctx.Lcl('grower_dead_trans_poultry', 'msgFeMaleRem', 'Female remain ') + femaleRem);
            }
        }
        FuncCB(succ, maleRem, femaleRem);
    }
}

function FindGrowerDead(farmOrg, txDateStr, docType, docExt, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    var nRea = '', nLoc = '', nBree = '';
    if ($.Ctx.Lang == "en-US") {
        nRea = "ifnull(R.DESC_ENG, R.DESC_LOC)";
        nLoc = "ifnull(F.NAME_ENG, F.NAME_LOC)";
        nBree = "''";
    } else {
        nRea = "ifnull(R.DESC_LOC, R.DESC_ENG)";
        nLoc = "ifnull(F.NAME_LOC, F.NAME_ENG)";
        nBree = "''";
    }
    cmd.sqlText = "SELECT S.TRANSACTION_DATE,S.DOCUMENT_TYPE,S.DOCUMENT_EXT, S.IMAGE1, S.IMAGE2, ";
    cmd.sqlText += "S.FARM_ORG_LOC ,{0} AS FARM_ORG_LOC_NAME, {1} AS BREEDER_NAME, ".format([nLoc, nBree]);
    cmd.sqlText += " S.BREEDER,S.BIRTH_WEEK,S.DEAD_TYPE,S.REASON_CODE,{0} AS REASON_NAME, S.MALE_QTY,S.MALE_WGH,S.MALE_AMT,S.FEMALE_QTY,S.FEMALE_WGH,S.FEMALE_AMT,S.NUMBER_OF_SENDING_DATA ".format([nRea]);
    cmd.sqlText += "FROM HH_FR_MS_GROWER_DEAD S ";
    cmd.sqlText += "JOIN FR_FARM_ORG F ON S.FARM_ORG_LOC=F.FARM_ORG ";
    cmd.sqlText += "JOIN HH_GD2_FR_MAS_TYPE_FARM R ON (S.REASON_CODE=R.GD_CODE AND R.GD_TYPE='RSC') ";
    cmd.sqlText += "WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND S.FARM_ORG_LOC=? AND S.TRANSACTION_DATE=? ";
    cmd.sqlText += " AND S.DOCUMENT_TYPE=? AND S.DOCUMENT_EXT=? ";
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push(farmOrg);
    cmd.parameters.push(txDateStr);
    cmd.parameters.push(docType);
    cmd.parameters.push(docExt);
    var ret = {};
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            ret.ORG_CODE = $.Ctx.SubOp;
            ret.FARM_ORG = $.Ctx.Warehouse;
            ret.FARM_ORG_LOC = farmOrg;
            ret.TRANSACTION_DATE = parseDbDateStr(txDateStr);
            ret.DOCUMENT_TYPE = docType;
            ret.DOCUMENT_EXT = docExt;
            ret.REASON_CODE = res.rows.item(0).REASON_CODE;
            ret.REASON_NAME = res.rows.item(0).REASON_NAME;
            ret.DEAD_TYPE = res.rows.item(0).DEAD_TYPE;
            ret.FARM_ORG_LOC_NAME = res.rows.item(0).FARM_ORG_LOC_NAME;
            ret.BREEDER = res.rows.item(0).BREEDER;
            ret.BREEDER_NAME = res.rows.item(0).BREEDER_NAME;
            ret.BIRTH_WEEK = res.rows.item(0).BIRTH_WEEK;
            ret.MALE_QTY = res.rows.item(0).MALE_QTY;
            ret.MALE_WGH = res.rows.item(0).MALE_WGH;
            ret.MALE_AMT = res.rows.item(0).MALE_AMT;
            ret.FEMALE_QTY = res.rows.item(0).FEMALE_QTY;
            ret.FEMALE_WGH = res.rows.item(0).FEMALE_WGH;
            ret.FEMALE_AMT = res.rows.item(0).FEMALE_AMT;
            ret.NUMBER_OF_SENDING_DATA = res.rows.item(0).NUMBER_OF_SENDING_DATA;
            ret.IMAGE1 = res.rows.item(0).IMAGE1;
            ret.IMAGE2 = res.rows.item(0).IMAGE2;
            SuccessCB(ret);
        } else {
            SuccessCB(null);
        }
    }, function (error) {
        console.log(error);
    });
}

function FindQtyOldFromDestroy(farmLoc, txDateStr, docType, docExt, breeder, birWeek, SuccessCB) {
    var cmd = $.Ctx.DbConn.createSelectCommand();
    cmd.sqlText = "SELECT S.BREEDER,S.BIRTH_WEEK,S.MALE_QTY,S.MALE_WGH,S.MALE_AMT,S.FEMALE_QTY,S.FEMALE_WGH,S.FEMALE_AMT ";
    cmd.sqlText += "FROM HH_FR_MS_GROWER_DEAD S ";
    cmd.sqlText += "WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND S.FARM_ORG_LOC=? AND S.TRANSACTION_DATE=? ";
    cmd.sqlText += "AND S.DOCUMENT_TYPE=? AND S.DOCUMENT_EXT=? ";
    if ($.Ctx.Bu == "FARM_PIG") {
        cmd.sqlText += "AND S.BREEDER=? AND S.BIRTH_WEEK=? ";
    }
    cmd.parameters.push($.Ctx.SubOp);
    cmd.parameters.push($.Ctx.Warehouse);
    cmd.parameters.push(farmLoc);
    cmd.parameters.push(txDateStr);
    cmd.parameters.push(docType);
    cmd.parameters.push(docExt);
    if ($.Ctx.Bu == "FARM_PIG") {
        cmd.parameters.push(breeder);
        cmd.parameters.push(birWeek);
    }
    var ret = {};
    cmd.executeReader(function (t, res) {
        if (res.rows.length > 0) {
            ret.BREEDER = res.rows.item(0).BREEDER;
            ret.BIRTH_WEEK = res.rows.item(0).BIRTH_WEEK;
            ret.MALE_QTY = res.rows.item(0).MALE_QTY;
            ret.MALE_WGH = res.rows.item(0).MALE_WGH;
            ret.MALE_AMT = res.rows.item(0).MALE_AMT;
            ret.FEMALE_QTY = res.rows.item(0).FEMALE_QTY;
            ret.FEMALE_WGH = res.rows.item(0).FEMALE_WGH;
            ret.FEMALE_AMT = res.rows.item(0).FEMALE_AMT;
        } else {
            ret.BREEDER = breeder;
            ret.BIRTH_WEEK = birWeek;
            ret.MALE_QTY = 0;
            ret.MALE_WGH = 0;
            ret.MALE_AMT = 0;
            ret.FEMALE_QTY = 0;
            ret.FEMALE_WGH = 0;
            ret.FEMALE_AMT = 0;
        }
        SuccessCB(ret);
    }, function (error) {
        console.log(error);
    });
}

function findStockBalance(success) {
    var cmd2 = $.Ctx.DbConn.createSelectCommand();
    cmd2.sqlText = " SELECT SUM ( CASE WHEN GROWER.TRANSACTION_TYPE = '1' THEN (ifnull(GROWER.MALE_QTY,0) + ifnull(GROWER.FEMALE_QTY,0))  ELSE (ifnull(GROWER.MALE_QTY , 0 ) + ifnull(GROWER.FEMALE_QTY,0)) * -1 END) AS POULTRY_BALANCE FROM HH_FR_MS_GROWER_STOCK GROWER WHERE     GROWER.ORG_CODE = ? AND GROWER.FARM_ORG = ? AND GROWER.FARM_ORG_LOC = ?"

    cmd2.parameters.push($.Ctx.SubOp);
    cmd2.parameters.push($.Ctx.Warehouse);
    cmd2.parameters.push($.Ctx.GetPageParam('grower_dead_trans_poultry', 'Data').FARM_ORG_LOC);
    console.log(cmd2);
    var ret = [];
    cmd2.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            console.log(res.rows.item(0))
            ret.push(res.rows.item(0));
            success(ret);
        }
    });

}


var onDeviceReady = function () {
    if ($.Ctx.IsDevice) {
        navigator.camera = Camera(); // camera
    } else {
        console.log("Warning!!! No camera device found.");
    }
}

function takePicture(layoutPic) {
    if ($.Ctx.IsDevice == true) {
        picShow = layoutPic;
        console.log(picShow);
        var cameraOption = {
            quality: $.Ctx.ImageQuality,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            sourceType: navigator.camera.PictureSourceType.CAMERA
        };
        navigator.camera.getPicture(cameraSuccessGWDead, cameraErrorGWDead, cameraOption);
    }
}

function cameraSuccessGWDead(image_data) {
    var model = $.Ctx.GetPageParam('grower_dead_trans_poultry', 'Data');
    if (model == null) {
        model = {};
        $.Ctx.SetPageParam('grower_dead_trans_poultry', 'Data', model);
    }
    if (picShow == "#Pic1")
        model.IMAGE1 = image_data;
    else
        model.IMAGE2 = image_data;
    BindPicture();
}

function cameraErrorGWDead(errorMessage) {
    console.log("Error Message: " + errorMessage);
}

