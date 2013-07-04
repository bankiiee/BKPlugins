            var clickAlias = "click";

            function findFarmOrg(success) {
                var cmd = $.Ctx.DbConn.createSelectCommand();
                cmd.sqlText = $.FarmCtx.GetLookupFarmOrgSqlText();
                // = "SELECT FARM_ORG AS CODE,ifnull(NAME_ENG, NAME_LOC) AS NAME  ";
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

            $("#chicken_detail_report").bind("pageinit", function (event) {

                $('#chicken_detail_report #lpView').bind(clickAlias, function () {

                    var msGrowerSale = new HH_FR_MS_GROWER_SALE();

                    var cmd = $.Ctx.DbConn.createSelectCommand();
                    cmd.sqlText = " SELECT TRANSACTION_DATE, REF_DOCUMENT_NO, FEMALE_QTY, FEMALE_WGH, ROUND(FEMALE_WGH / FEMALE_QTY, 2) as AVG ";
                    cmd.sqlText += " FROM HH_FR_MS_GROWER_SALE ";
                    cmd.sqlText += " WHERE ORG_CODE = ? AND FARM_ORG_LOC = ? ";
                    cmd.sqlText += " ORDER BY TRANSACTION_DATE ";


                    var farmOrg = $.Ctx.GetPageParam('chicken_detail_report', 'selectedFarmOrg');
                    if (farmOrg == null) {
                        $.Ctx.MsgBox($.Ctx.Lcl('chicken_detail_report', 'pleaseSelectFarmOrg', 'Please select Farm Org.'));
                        return false;
                    }
                    cmd.parameters.push($.Ctx.SubOp);
                    cmd.parameters.push(farmOrg.CODE);

                    cmd.executeReader(function (tx, res) {
                        if (res.rows.length != 0) {
                            var tableHtml = '';

                            tableHtml += ' <table class = "reportTableStyle">';
                            tableHtml += ' <tr>';
                            tableHtml += ' <td colspan="5" class = "headerStyle" > ';
                            tableHtml += ' {0} '.format([$.Ctx.Lcl('chicken_detail_report', 'ChickRptCaption', 'Chicken Detail')]);
                            tableHtml += ' </tr> ';

                            tableHtml += ' <tr> ';
                            tableHtml += ' <td rowspan="2" class = "headerStyle"> ';
                            tableHtml += '{0}'.format([$.Ctx.Lcl('chicken_detail_report', 'dateCaption', 'D/M/Y')]);
                            tableHtml += ' </td> ';
                            tableHtml += ' <td rowspan="2" class = "headerStyle"> ';
                            tableHtml += '{0}'.format([$.Ctx.Lcl('chicken_detail_report', 'docNoCaption', 'Doc No')]);
                            tableHtml += ' </td> ';
                            tableHtml += ' <td colspan="3" class = "headerStyle"> ';
                            tableHtml += '{0}'.format([$.Ctx.Lcl('chicken_detail_report', 'volumeCaption', 'Volume')]);
                            tableHtml += ' </td> ';
                            tableHtml += ' </tr> ';

                            tableHtml += ' <tr> ';

                            tableHtml += ' <td class = "headerStyle"> ';
                            tableHtml += '{0}'.format([$.Ctx.Lcl('chicken_detail_report', 'QtyCaption', 'Quantity')]);
                            tableHtml += ' </td> ';
                            tableHtml += ' <td class = "headerStyle"> ';
                            tableHtml += '{0}'.format([$.Ctx.Lcl('chicken_detail_report', 'wghCaption', 'Weight')]);
                            tableHtml += ' </td> ';
                            tableHtml += ' <td class = "headerStyle"> ';
                            tableHtml += '{0}'.format([$, Ctx.Lcl('chicken_detail_report', 'perUnitCaption', '@')]);
                            tableHtml += ' </td> ';
                            tableHtml += ' </tr> ';
                            var sumQty = 0;
                            var sumWgh = 0;

                            //Gen Data 
                            for (var idx = 0; idx < res.rows.length; idx++) {
                                tableHtml += ' <tr> ';
                                tableHtml += ' <td class= "cellCenter">{0}</td> '.format([new XDate(res.rows.item(idx).TRANSACTION_DATE).showDateByFormat($.FarmCtx.reportDateFormat)]);
                                tableHtml += ' <td class ="cellCenter">{0}</td> '.format([res.rows.item(idx).REF_DOCUMENT_NO]);
                                tableHtml += ' <td class ="cellRight">{0}</td> '.format([res.rows.item(idx).FEMALE_QTY]);
                                tableHtml += ' <td class ="cellRight">{0}</td> '.format([accounting.formatMoney(res.rows.item(idx).FEMALE_WGH)]);
                                tableHtml += ' <td class ="cellRight">{0}</td> '.format([accounting.formatMoney(res.rows.item(idx).AVG)]);
                                tableHtml += ' </tr> ';
                                sumQty += res.rows.item(idx).FEMALE_QTY;
                                sumWgh += res.rows.item(idx).FEMALE_WGH;
                            }
                            tableHtml += ' <tr> ';
                            tableHtml += ' <td class= "cellCenter boldFont" colspan = "2" >{0}</td> '.format([$.Ctx.Lcl('chicken_detail_report', 'totalCaption', 'Total')]);
                            tableHtml += ' <td class ="cellRight boldFont">{0}</td> '.format([sumQty]);
                            tableHtml += ' <td class ="cellRight boldFont">{0}</td> '.format([accounting.formatMoney(sumWgh)]);
                            tableHtml += ' <td class ="cellRight boldFont">{0}</td> '.format([accounting.formatMoney((sumWgh / sumQty))]);
                            tableHtml += ' </tr> ';
                            tableHtml += ' </table> ';

                            $('#chicken_detail_report #divReport').html(tableHtml);
                            $('#chicken_detail_report #divReport').trigger('create');
                        } else {
                            $.Ctx.MsgBox($.Ctx.Lcl('chicken_detail_report', 'dataNotFound', 'Data not found'));
                        }

                    }, function (err) {
                        console.log('Report Execute Reader Error.' + err);
                    });



                });


                $('#chicken_detail_report #lpFarmOrg').bind(clickAlias, function () {
                    $.Ctx.SetPageParam('chicken_detail_report', 'ScrollingTo', $(window).scrollTop());
                    $.FarmCtx.SearchFarmOrgUsingMapMobile(function (orgs) {
                        if (orgs !== null) {
                            var p = new LookupParam();
                            p.title = $.Ctx.Lcl('chicken_detail_report', 'msgFarmOrg', 'Farm Organization');
                            p.calledPage = 'chicken_detail_report';
                            p.calledResult = 'selectedFarmOrg';
                            p.codeField = 'CODE';
                            p.nameField = 'NAME';
                            p.showCode = true;
                            p.dataSource = orgs;

                            var farmOrg = $.Ctx.GetPageParam('chicken_detail_report', 'selectedFarmOrg');
                            var prevCode = '';
                            if (farmOrg != null)
                                prevCode = farmOrg.CODE;
                            $.Ctx.SetPageParam('chicken_detail_report', 'prev_farm_org_code', prevCode);
                            $.Ctx.SetPageParam('lookup', 'param', p);
                            $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
                        }
                    });
                });

                $('#chicken_detail_report #btnBack').bind(clickAlias, function () {
                    $.Ctx.NavigatePage($.Ctx.GetPageParam('chicken_detail_report', 'Previous'),
			                            null,
		                                { transition: 'slide', reverse: true });
                    //$.Ctx.ClearPageParam('chicken_detail_report');
                });

            });      


            $('#chicken_detail_report').bind("pagebeforecreate", function (e) {
                $.Util.RenderUiLang('chicken_detail_report');
                $.Ctx.RenderFooter('chicken_detail_report');
            });

//            $("#chicken_detail_report").bind("pagebeforeshow", function (event, ui) {
//                var prevPage = (typeof ui.prevPage[0] == 'undefined' ? "" : ui.prevPage[0].id);
//                if (prevPage.indexOf("lookup") > -1) {//From Lookup	
//                    setLookupToControl();
//                }
//            });


            $("#chicken_detail_report").bind("pageshow", function (event) {
                if ($.Ctx.GetPageParam('chicken_detail_report', 'ScrollingTo') != null) {
                    //scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
                    $('html, body').animate({
                        scrollTop: $.Ctx.GetPageParam('chicken_detail_report', 'ScrollingTo')
                    }, 0);
                }
                setLookupToControl(); 
            });

        function setLookupToControl() {
            var farmOrg = $.Ctx.GetPageParam('chicken_detail_report', 'selectedFarmOrg');
            var prevFarmOrg = $.Ctx.GetPageParam('chicken_detail_report', 'prev_farm_org_code');
            if (farmOrg !== null) {
                $('#chicken_detail_report #lpFarmOrg').text(farmOrg.CODE + ' ' + farmOrg.NAME);
                if (prevFarmOrg != farmOrg.CODE) {
                    $('#chicken_detail_report #divReport').empty();
                }
            }
            else {
                $('#chicken_detail_report #lpFarmOrg').text($.Ctx.Lcl('chicken_detail_report', 'msgSelect', 'Select'));
                $('#chicken_detail_report #divReport').empty();
            }
            $('#chicken_detail_report #lpFarmOrg').button('refresh');

          
        }
             
        