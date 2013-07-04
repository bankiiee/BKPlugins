        var clickAlias = "click";

        function findFarmOrg(success) {
            var cmd = $.Ctx.DbConn.createSelectCommand();
            cmd.sqlText = $.FarmCtx.GetLookupFarmOrgSqlText();
            //= "SELECT FARM_ORG AS CODE,ifnull(NAME_ENG, NAME_LOC) AS NAME  ";
            //cmd.sqlText += " FROM FR_FARM_ORG WHERE ORG_CODE= ? ORDER BY FARM_ORG ";
            cmd.parameters.push($.Ctx.SubOp);
            var ret = [];
            cmd.executeReader(function (tx, res) {
                if (res.rows.length != 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        ret.push({ 'CODE': res.rows.item(i).CODE, 'NAME': res.rows.item(i).NAME });
                    }
                    success(ret);
                }
                else {
                    success(null);
                }

            }, function (err) {
                console.log('Error @ findFarmOrg ' + err);
            });
        }

        $("#feed_receive_detail_report").bind("pageinit", function (event) {

            $('#feed_receive_detail_report #lpView').bind(clickAlias, function () {

                var farmOrg = $.Ctx.GetPageParam('feed_receive_detail_report', 'selectedFarmOrg');
                if (farmOrg == null) {
                    $.Ctx.MsgBox($.Ctx.Lcl('feed_receive_detail_report', 'pleaseSelectFarmOrg', 'Please select Farm Org.'));
                    return false;
                }

                var msGrowerSale = new HH_FR_MS_GROWER_SALE();

                var cmd = $.Ctx.DbConn.createSelectCommand();
                cmd.sqlText = " SELECT P.TRANSACTION_DATE, P.REF_DOCUMENT_NO, ";
                cmd.sqlText += " CASE WHEN FEEDING_NO = '1' THEN WGH END AS WGH_1, ";
                cmd.sqlText += " CASE WHEN FEEDING_NO = '2' THEN WGH END AS WGH_2, ";
                cmd.sqlText += " CASE WHEN FEEDING_NO = '3' THEN WGH END AS WGH_3, ";
                cmd.sqlText += " CASE WHEN FEEDING_NO = '4' THEN WGH END AS WGH_4, P.PRODUCT_CODE ";
                cmd.sqlText += " FROM HH_FR_MS_MATERIAL_PURCHASE P, HH_FR_MS_FEED_PHASE F ";
                cmd.sqlText += " WHERE P.ORG_CODE = F.ORG_CODE AND P.PRODUCT_CODE = F.PRODUCT_CODE ";
                cmd.sqlText += " AND P.ORG_CODE = ? AND FARM_ORG = ? ";
                cmd.sqlText += " ORDER BY TRANSACTION_DATE ";


                var farmOrg = $.Ctx.GetPageParam('feed_receive_detail_report', 'selectedFarmOrg');
                if (farmOrg == null) {
                    $.Ctx.MsgBox($.Ctx.Lcl('feed_receive_detail_report', 'pleaseSelectFarmOrg', 'Please select Farm Org.'));
                    return false;
                }
                cmd.parameters.push($.Ctx.SubOp);
                cmd.parameters.push(farmOrg.CODE);

                cmd.executeReader(function (tx, res) {
                    if (res.rows.length != 0) {

                        var tableHtml = '';

                        tableHtml += ' <table class = "reportTableStyle"> ';
                        tableHtml += ' <tr> ';
                        tableHtml += ' <td colspan="6" class = "headerStyle" >';
                        tableHtml += ' {0}'.format([$.Ctx.Lcl('feed_receive_detail_report', 'feedRecRptCaption', 'Feed Receive Detail')]);
                        tableHtml += ' </td>';
                        tableHtml += ' </tr>';
                        tableHtml += ' <tr>';
                        tableHtml += ' <td rowspan="2" class = "headerStyle width15">';
                        tableHtml += ' {0}'.format([$.Ctx.Lcl('feed_receive_detail_report', 'dateCaption', 'D/M/Y')]);
                        tableHtml += ' </td>';
                        tableHtml += ' <td rowspan="2" class = "headerStyle width25">';
                        tableHtml += ' {0}'.format([$.Ctx.Lcl('feed_receive_detail_report', 'docNoCaption', 'Doc No')]);
                        tableHtml += ' </td>';
                        //                        tableHtml += ' <td rowspan="2" class = "headerStyle">';
                        //                        tableHtml += ' Name';
                        //                        tableHtml += ' </td>';
                        tableHtml += ' <td colspan="4" class = "headerStyle">';
                        tableHtml += ' {0}'.format([$.Ctx.Lcl('feed_receive_detail_report', 'volumeCaption', 'Volume')]);
                        tableHtml += ' </td>';
                        tableHtml += ' </tr>';

                        tableHtml += ' <tr>';
                        tableHtml += ' <td class = "headerStyle width15">';
                        tableHtml += ' {0}'.format([$.Ctx.Lcl('feed_receive_detail_report', 'lblProduct1', 'X10')]);
                        tableHtml += ' </td>';
                        tableHtml += ' <td class = "headerStyle width15">';
                        tableHtml += ' {0}'.format([$.Ctx.Lcl('feed_receive_detail_report', 'lblProduct2', 'X11')]);
                        tableHtml += ' </td>';
                        tableHtml += ' <td class = "headerStyle width15">';
                        tableHtml += ' {0}'.format([$.Ctx.Lcl('feed_receive_detail_report', 'lblProduct3', 'X13')]);
                        tableHtml += ' </td>';
                        tableHtml += ' <td class = "headerStyle width15">';
                        tableHtml += ' {0}'.format([$.Ctx.Lcl('feed_receive_detail_report', 'lblProduct4', 'X14')]);
                        tableHtml += ' </td>';
                        tableHtml += ' </tr>';

                        var sumWgh1 = 0;
                        var sumWgh2 = 0;
                        var sumWgh3 = 0;
                        var sumWgh4 = 0;
                        //Gen Data 
                        var productCode = res.rows.item(0).PRODUCT_CODE;
                        var cmdProduct = $.Ctx.DbConn.createSelectCommand();
                        cmdProduct.sqlText = 'select UNIT_PACK from hh_product_bu where product_code = ?'
                        cmdProduct.parameters.push(productCode);
                        cmdProduct.executeReader(function (tx, resProduct) {
                            var productUnitPack = resProduct.rows.item(0).UNIT_PACK;
                            for (var idx = 0; idx < res.rows.length; idx++) {
                                var wgh1 = $.Ctx.Nvl(res.rows.item(idx).WGH_1, '') == '' ? '' : accounting.formatNumber(res.rows.item(idx).WGH_1, 0, ',', 0);
                                var wgh2 = $.Ctx.Nvl(res.rows.item(idx).WGH_2, '') == '' ? '' : accounting.formatNumber(res.rows.item(idx).WGH_2, 0, ',', 0);
                                var wgh3 = $.Ctx.Nvl(res.rows.item(idx).WGH_3, '') == '' ? '' : accounting.formatNumber(res.rows.item(idx).WGH_3, 0, ',', 0);
                                var wgh4 = $.Ctx.Nvl(res.rows.item(idx).WGH_4, '') == '' ? '' : accounting.formatNumber(res.rows.item(idx).WGH_4, 0, ',', 0);

                                sumWgh1 += $.Ctx.Nvl(res.rows.item(idx).WGH_1, '') == '' ? 0 : res.rows.item(idx).WGH_1;
                                sumWgh2 += $.Ctx.Nvl(res.rows.item(idx).WGH_2, '') == '' ? 0 : res.rows.item(idx).WGH_2;
                                sumWgh3 += $.Ctx.Nvl(res.rows.item(idx).WGH_3, '') == '' ? 0 : res.rows.item(idx).WGH_3;
                                sumWgh4 += $.Ctx.Nvl(res.rows.item(idx).WGH_4, '') == '' ? 0 : res.rows.item(idx).WGH_4;

                                tableHtml += ' <tr> ';
                                tableHtml += ' <td class= "cellCenter">{0}</td> '.format([new XDate(res.rows.item(idx).TRANSACTION_DATE).showDateByFormat($.FarmCtx.reportDateFormat)]);
                                tableHtml += ' <td class ="cellCenter">{0}</td> '.format([res.rows.item(idx).REF_DOCUMENT_NO]);
                                //                            tableHtml += ' <td class ="cellLeft">{0}</td> '.format(['']);
                                tableHtml += ' <td class ="cellRight">{0}</td> '.format([wgh1]);
                                tableHtml += ' <td class ="cellRight">{0}</td> '.format([wgh2]);
                                tableHtml += ' <td class ="cellRight">{0}</td> '.format([wgh3]);
                                tableHtml += ' <td class ="cellRight">{0}</td> '.format([wgh4]);
                                tableHtml += ' </tr> ';
                            }
                            tableHtml += ' <tr> ';
                            tableHtml += ' <td class= "cellCenter boldFont" colspan ="2">{0}</td> '.format(['Total']);
                            //                        tableHtml += ' <td class ="cellLeft boldFont">{0}</td> '.format(['']);
                            tableHtml += ' <td class ="cellRight boldFont">{0}</td> '.format([sumWgh1 == 0 ? '' : accounting.formatNumber(sumWgh1, 0, ',', 0)]);
                            tableHtml += ' <td class ="cellRight boldFont">{0}</td> '.format([sumWgh2 == 0 ? '' : accounting.formatNumber(sumWgh2, 0, ',', 0)]);
                            tableHtml += ' <td class ="cellRight boldFont">{0}</td> '.format([sumWgh3 == 0 ? '' : accounting.formatNumber(sumWgh3, 0, ',', 0)]);
                            tableHtml += ' <td class ="cellRight boldFont">{0}</td> '.format([sumWgh4 == 0 ? '' : accounting.formatNumber(sumWgh4, 0, ',', 0)]);
                            tableHtml += ' </tr> ';

                          //  var constDevide = 50;
                            tableHtml += ' <tr> ';
                            tableHtml += ' <td class= "cellCenter boldFont" colspan ="2">{0}</td> '.format(['Total # ' + productUnitPack + ' kg.']);
                            //                        tableHtml += ' <td class ="cellLeft boldFont">{0}</td> '.format(['']);
                            tableHtml += ' <td class ="cellRight boldFont">{0}</td> '.format([sumWgh1 == 0 ? '' : accounting.formatNumber(sumWgh1 / productUnitPack, 0, ',', 0)]);
                            tableHtml += ' <td class ="cellRight boldFont">{0}</td> '.format([sumWgh2 == 0 ? '' : accounting.formatNumber(sumWgh2 / productUnitPack, 0, ',', 0)]);
                            tableHtml += ' <td class ="cellRight boldFont">{0}</td> '.format([sumWgh3 == 0 ? '' : accounting.formatNumber(sumWgh3 / productUnitPack, 0, ',', 0)]);
                            tableHtml += ' <td class ="cellRight boldFont">{0}</td> '.format([sumWgh4 == 0 ? '' : accounting.formatNumber(sumWgh4 / productUnitPack, 0, ',', 0)]);
                            tableHtml += ' </tr> ';
                            tableHtml += ' </table> ';

                            $('#feed_receive_detail_report #divReport').html(tableHtml);
                            $('#feed_receive_detail_report #divReport').trigger('create');

                        });
                        
                    } else {
                        $.Ctx.MsgBox($.Ctx.Lcl('feed_receive_detail_report', 'dataNotFound', 'Data not found'));
                    }

                }, function (err) {
                    console.log('Report Execute Reader Error.' + err);
                });



            });


            $('#feed_receive_detail_report #lpFarmOrg').bind(clickAlias, function () {
                $.Ctx.SetPageParam('feed_receive_detail_report', 'ScrollingTo', $(window).scrollTop());
                $.FarmCtx.SearchFarmOrgUsingMapMobile(function (orgs) {
                    if (orgs !== null) {
                        var p = new LookupParam();
                        p.title = $.Ctx.Lcl('feed_receive_detail_report', 'msgFarmOrg', 'Farm Organization');
                        p.calledPage = 'feed_receive_detail_report';
                        p.calledResult = 'selectedFarmOrg';
                        p.codeField = 'CODE';
                        p.nameField = 'NAME';
                        p.showCode = true;
                        p.dataSource = orgs;

                        var farmOrg = $.Ctx.GetPageParam('feed_receive_detail_report', 'selectedFarmOrg');
                        var prevCode = '';
                        if (farmOrg != null)
                            prevCode = farmOrg.CODE;
                        $.Ctx.SetPageParam('feed_receive_detail_report', 'prev_farm_org_code', prevCode);
                        $.Ctx.SetPageParam('lookup', 'param', p);
                        $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
                    }
                });
            });

            $('#feed_receive_detail_report #btnBack').bind(clickAlias, function () {
                $.Ctx.NavigatePage($.Ctx.GetPageParam('feed_receive_detail_report', 'Previous'),
			                            null,
		                                { transition: 'slide', reverse: true });
                //$.Ctx.ClearPageParam('feed_receive_detail_report');
            });

        });


        $('#feed_receive_detail_report').bind("pagebeforecreate", function (e) {
            $.Util.RenderUiLang('feed_receive_detail_report');
            $.Ctx.RenderFooter('feed_receive_detail_report');
        });

        $("#feed_receive_detail_report").bind("pageshow", function (event) {
            if ($.Ctx.GetPageParam('feed_receive_detail_report', 'ScrollingTo') != null) {
                //scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
                $('html, body').animate({
                    scrollTop: $.Ctx.GetPageParam('feed_receive_detail_report', 'ScrollingTo')
                }, 0);
            }
            setLookupToControl();
        });

        function setLookupToControl() {
            var farmOrg = $.Ctx.GetPageParam('feed_receive_detail_report', 'selectedFarmOrg');
            var prevFarmOrg = $.Ctx.GetPageParam('feed_receive_detail_report', 'prev_farm_org_code');
            if (farmOrg !== null) {
                $('#feed_receive_detail_report #lpFarmOrg').text(farmOrg.CODE + ' ' + farmOrg.NAME);
                if (prevFarmOrg != farmOrg.CODE) {
                    $('#feed_receive_detail_report #divReport').empty();
                }
            }
            else {
                $('#feed_receive_detail_report #lpFarmOrg').text($.Ctx.Lcl('feed_receive_detail_report', 'msgSelect', 'Select'));
                $('#feed_receive_detail_report #divReport').empty();
            }
            $('#feed_receive_detail_report #lpFarmOrg').button('refresh');


        }
             
        
    