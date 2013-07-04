 
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

       $("#feed_use_depletion_report").bind("pageinit", function (event) {

           $('#feed_use_depletion_report #lpView').bind(clickAlias, function () {

               var farmOrg = $.Ctx.GetPageParam('feed_use_depletion_report', 'selectedFarmOrg');
               if (farmOrg == null) {
                   $.Ctx.MsgBox($.Ctx.Lcl('feed_use_depletion_report', 'pleaseSelectFarmOrg', 'Please select Farm Org.'));
                   return false;
               }
               getReportData();
           });


           $('#feed_use_depletion_report #lpFarmOrg').bind(clickAlias, function () {
               $.Ctx.SetPageParam('feed_use_depletion_report', 'ScrollingTo', $(window).scrollTop());
               $.FarmCtx.SearchFarmOrgUsingMapMobile(function (orgs) {
                   if (orgs !== null) {
                       var p = new LookupParam();
                       p.title = $.Ctx.Lcl('feed_use_depletion_report', 'msgFarmOrg', 'Farm Organization');
                       p.calledPage = 'feed_use_depletion_report';
                       p.calledResult = 'selectedFarmOrg';
                       p.codeField = 'CODE';
                       p.nameField = 'NAME';
                       p.showCode = true;
                       p.dataSource = orgs;

                       var farmOrg = $.Ctx.GetPageParam('feed_use_depletion_report', 'selectedFarmOrg');
                       var prevCode = '';
                       if (farmOrg != null)
                           prevCode = farmOrg.CODE;
                       $.Ctx.SetPageParam('feed_use_depletion_report', 'prev_farm_org_code', prevCode);
                       $.Ctx.SetPageParam('lookup', 'param', p);
                       $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
                   }
               });
           });

           $('#feed_use_depletion_report #btnBack').bind(clickAlias, function () {
               $.Ctx.NavigatePage($.Ctx.GetPageParam('feed_use_depletion_report', 'Previous'),
			                            null,
		                                { transition: 'slide', reverse: true });
               //$.Ctx.ClearPageParam('feed_use_depletion_report');
           });

       });


       $('#feed_use_depletion_report').bind("pagebeforecreate", function (e) {
           $.Util.RenderUiLang('feed_use_depletion_report');
           $.Ctx.RenderFooter('feed_use_depletion_report');
       });

       $("#feed_use_depletion_report").bind("pageshow", function (event) {
           if ($.Ctx.GetPageParam('feed_use_depletion_report', 'ScrollingTo') != null) {
               //scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
               $('html, body').animate({
                   scrollTop: $.Ctx.GetPageParam('feed_use_depletion_report', 'ScrollingTo')
               }, 0);
           }
           setLookupToControl();
       });

       function setLookupToControl() {
           var farmOrg = $.Ctx.GetPageParam('feed_use_depletion_report', 'selectedFarmOrg');
           var prevFarmOrg = $.Ctx.GetPageParam('feed_use_depletion_report', 'prev_farm_org_code');
           if (farmOrg !== null) {
               $('#feed_use_depletion_report #lpFarmOrg').text(farmOrg.CODE + ' ' + farmOrg.NAME);
               if (prevFarmOrg != farmOrg.CODE) {
                   $('#feed_use_depletion_report #divReport').empty();
               }
           }
           else {
               $('#feed_use_depletion_report #lpFarmOrg').text($.Ctx.Lcl('feed_use_depletion_report', 'msgSelect', 'Select'));
               $('#feed_use_depletion_report #divReport').empty();
           }
           $('#feed_use_depletion_report #lpFarmOrg').button('refresh');
       }

       function getReportData() {
           var farmOrg = $.Ctx.GetPageParam('feed_use_depletion_report', 'selectedFarmOrg');
           if (farmOrg == null) {
               $.Ctx.MsgBox($.Ctx.Lcl('feed_use_depletion_report', 'pleaseSelectFarmOrg', 'Please select Farm Org.'));
               return false;
           }
           var getTranDateSql = "";
          getTranDateSql += " SELECT TRANSACTION_DATE FROM HH_FR_MS_GROWER_STOCK "; 
          getTranDateSql += " WHERE ORG_CODE = ? AND FARM_ORG_LOC = ? " ;
          getTranDateSql += " AND DOCUMENT_TYPE IN ('41','71','65','63') ";
          getTranDateSql += " ORDER BY TRANSACTION_DATE limit 0,1  ";
          var cmdGetTranDate = $.Ctx.DbConn.createSelectCommand();
          cmdGetTranDate.sqlText = getTranDateSql;
          cmdGetTranDate.parameters.push($.Ctx.SubOp);
          cmdGetTranDate.parameters.push(farmOrg.CODE);

          cmdGetTranDate.executeReader(function (tx, res) {
              if (res.rows.length != 0) {
                  var transactionDate = res.rows.item(0).TRANSACTION_DATE;

                  var reportDataSql = "";

                  reportDataSql += " select allData.TRANSACTION_DATE as TRANSACTION_DATE ,  ";
                  reportDataSql += " allData.AGE as AGE , sum(allData.WGH)  as WGH , ";
                  reportDataSql += " sum(allData.DEAD_CHICK)  as DEAD_CHICK , ";
                  reportDataSql += " sum(allData.CULL_CHICK)  as CULL_CHICK from ( ";
                  reportDataSql += " select * from ( ";
                  reportDataSql += " select finalData.TRANSACTION_DATE  as TRANSACTION_DATE, finalData.AGE as AGE , ";
                  reportDataSql += " SUM(finalData.WGH) as WGH , 0 as DEAD_CHICK , 0 as CULL_CHICK from ( ";
                  reportDataSql += " SELECT TRANSACTION_DATE, ";
                  reportDataSql += " round(((julianday ( julianday (TRANSACTION_DATE)) - julianday (?))  ) +1  ) ";
                  reportDataSql += " as  AGE , WGH FROM HH_FR_MS_MATERIAL_STOCK ";
                  reportDataSql += " WHERE ORG_CODE = ? AND FARM_ORG_LOC = ? AND DOCUMENT_TYPE IN ";
                  reportDataSql += " ('70') AND PRODUCT_STOCK_TYPE = '10' ";
                  reportDataSql += " ) finalData ";
                  reportDataSql += " GROUP BY finalData.TRANSACTION_DATE, finalData.AGE ";
                  reportDataSql += " ORDER BY finalData.TRANSACTION_DATE, finalData.AGE ) ";
                  reportDataSql += " union all ";
                  reportDataSql += " select * from ( ";


                  reportDataSql += " select finalData.TRANSACTION_DATE as TRANSACTION_DATE  ,  ";
                  reportDataSql += " finalData.AGE  as AGE , 0 as WGH , sum(finalData.DEAD_CHICK)  as DEAD_CHICK , ";
                  reportDataSql += " sum(finalData.CULL_CHICK)  as CULL_CHICK  from ( ";
                  reportDataSql += " SELECT TRANSACTION_DATE,  ";
                  reportDataSql += " round(((julianday ( julianday (TRANSACTION_DATE)) - julianday (?))  ) +1  ) as AGE, ";
                  reportDataSql += " CASE WHEN REASON_CODE IN ('70','81') THEN IFNULL (FEMALE_QTY , 0 ) ELSE 0 END DEAD_CHICK, ";
                  reportDataSql += " CASE WHEN REASON_CODE IN ('71') THEN IFNULL (FEMALE_QTY , 0 ) ELSE 0 END CULL_CHICK ";
                  reportDataSql += " FROM HH_FR_MS_GROWER_DEAD ";
                  reportDataSql += " WHERE ORG_CODE = ? AND FARM_ORG_LOC = ? AND DOCUMENT_TYPE IN ('61') ";
                  reportDataSql += " )finalData ";
                  reportDataSql += " GROUP BY finalData.TRANSACTION_DATE, finalData.AGE ";
                  reportDataSql += " ORDER BY finalData.TRANSACTION_DATE, finalData.AGE) ";
                  reportDataSql += " )allData ";
                  reportDataSql += " GROUP BY allData.TRANSACTION_DATE, allData.AGE ";
                  reportDataSql += " ORDER BY allData.TRANSACTION_DATE, allData.AGE ";



                  var cmdReportDataCmd = $.Ctx.DbConn.createSelectCommand();
                  cmdReportDataCmd.sqlText = reportDataSql;
                  cmdReportDataCmd.parameters.push(transactionDate);
                  cmdReportDataCmd.parameters.push($.Ctx.SubOp);
                  cmdReportDataCmd.parameters.push(farmOrg.CODE);
                  cmdReportDataCmd.parameters.push(transactionDate);
                  cmdReportDataCmd.parameters.push($.Ctx.SubOp);
                  cmdReportDataCmd.parameters.push(farmOrg.CODE);

                  cmdReportDataCmd.executeReader(function (tx, resReport) {

                      if (resReport.rows.length != 0) {
                          //                          if (resReport.rows.length = 1 && $.Ctx.Nvl(resReport.rows.item(0).TRANSACTION_DATE, '') == '') {
                          //                              $.Ctx.MsgBox($.Ctx.Lcl('feed_use_depletion_report', 'dataNotFound', 'Data not found'));
                          //                              return false;
                          //                          }
                          //                          else {
                          var allData = new Array();

                          for (var idx = 0; idx < resReport.rows.length; idx++) {
                              allData.push(resReport.rows.item(idx));

                              /* tmpData = resReport.rows.item(idx);
                              sumPerRow = $.Ctx.Nvl(tmpData.DEAD_CHICK, 0) + $.Ctx.Nvl(tmpData.CULL_CHICK, 0);
                              sumCullAll += $.Ctx.Nvl(tmpData.CULL_CHICK, 0);
                              sumDeadAll += $.Ctx.Nvl(tmpData.DEAD_CHICK, 0);
                              sumWghAll += $.Ctx.Nvl(tmpData.WGH, 0); */
                          }
                          var dateForPrint = new XDate(transactionDate);

                          var tmpData = new Object();
                          var htmlTable = '';
                          var sumWghAll = 0;
                          var sumDeadAll = 0;
                          var sumCullAll = 0;
                          var sumCumAll = 0;

                          var sumPerRow = 0;
                          var wghPerRow = 0;
                          var deadPerRow = 0;
                          var cullPerRow = 0;
                          // Table Gen From Start 
                          // First Loop is Week 
                          for (var idxWeek = 1; idxWeek <= 6; idxWeek++) {
                              //When Change Week GenNew Header Grid
                              //Gen Header
                              htmlTable += ' <table class = "reportTableStyle"> ';
                              htmlTable += ' <tr> ';
                              htmlTable += ' <td colspan="6" class = "headerStyle" >';
                              htmlTable += ' {0} {1}'.format([$.Ctx.Lcl('feed_use_depletion_report', 'weekCaption', 'Week'), idxWeek]);
                              htmlTable += ' </td>';
                              htmlTable += ' </tr>';
                              htmlTable += ' <tr>';
                              htmlTable += ' <td rowspan="2" class = "headerStyle width25">';
                              htmlTable += ' {0}'.format([$.Ctx.Lcl('feed_use_depletion_report', 'dateCaption', 'D/M/Y')]);
                              htmlTable += ' </td>';
                              htmlTable += ' <td rowspan="2" class = "headerStyle width15">';
                              htmlTable += ' {0}'.format([$.Ctx.Lcl('feed_use_depletion_report', 'ageCaption', 'Age')]);
                              htmlTable += ' </td>';
                              htmlTable += ' <td class = "headerStyle">';
                              htmlTable += ' {0}'.format([$.Ctx.Lcl('feed_use_depletion_report', 'feedCaption', 'Feed')]);
                              htmlTable += ' </td>';
                              htmlTable += ' <td  colspan="3" class = "headerStyle">';
                              htmlTable += ' {0}'.format([$.Ctx.Lcl('feed_use_depletion_report', 'percentDeptCaption', '% DEPLETION')]);
                              htmlTable += ' </td>';
                              htmlTable += ' </tr>';
                              htmlTable += ' <tr>';
                              htmlTable += ' <td class = "headerStyle width15">{0}</td>'.format([$.Ctx.Lcl('feed_use_depletion_report', 'kgCaption', 'Kg.')]);
                              htmlTable += ' <td class = "headerStyle width15">{0}</td>'.format([$.Ctx.Lcl('feed_use_depletion_report', 'deadCaption', 'Dead')]);
                              htmlTable += ' <td class = "headerStyle width15">{0}</td>'.format([$.Ctx.Lcl('feed_use_depletion_report', 'cullCaption', 'Culling')]);
                              htmlTable += ' <td class = "headerStyle width15">{0}</td>'.format([$.Ctx.Lcl('feed_use_depletion_report', 'cumCaption', 'CUM.')]);
                              htmlTable += ' </tr>';

                              //second is day in week 
                              for (var idxDay = 1; idxDay <= 7; idxDay++) {
                                  sumPerRow = 0;
                                  wghPerRow = 0;
                                  deadPerRow = 0;
                                  cullPerRow = 0;

                                  var findInAllData = _.where(allData, { TRANSACTION_DATE: dateForPrint.toDbDateOnlyStr() });
                                  console.log('Look in Data Count : ' + findInAllData.length + ' data : ');
                                  console.log(findInAllData);
                                  if (findInAllData.length != 0) {
                                      wghPerRow = findInAllData[0].WGH;
                                      deadPerRow = findInAllData[0].DEAD_CHICK;
                                      cullPerRow = findInAllData[0].CULL_CHICK;
                                      sumPerRow = deadPerRow + cullPerRow; 
                                  }
                                  sumWghAll += wghPerRow;
                                  sumDeadAll += deadPerRow;
                                  sumCullAll += cullPerRow;
                                  sumCumAll += sumPerRow;
                                  //Gen Data
                                  htmlTable += ' <tr> ';
                                  htmlTable += ' <td class= "cellCenter">{0}</td>'.format([dateForPrint.showDateByFormat($.FarmCtx.reportDateFormat)]);
                                  htmlTable += ' <td class= "cellCenter">{0}</td>'.format([(7 * (idxWeek - 1)) + idxDay]);
                                  htmlTable += ' <td class ="cellRight">{0}</td>'.format([accounting.formatNumber(wghPerRow, 0, ',', 0)]);
                                  htmlTable += ' <td class ="cellRight">{0}</td>'.format([accounting.formatNumber(deadPerRow, 0, ',', 0)]);
                                  htmlTable += ' <td class ="cellRight">{0}</td>'.format([accounting.formatNumber(cullPerRow, 0, ',', 0)]);
                                  htmlTable += ' <td class ="cellRight">{0}</td>'.format([accounting.formatNumber(sumCumAll, 0, ',', 0)]);
                                  htmlTable += ' </tr>';

                                  
                                  dateForPrint.addDays(1);
                              }

                              //Gen Footer
                              htmlTable += ' <tr> ';
                              htmlTable += ' <td colspan="2"  class= "cellCenter boldFont">{0}</td> '.format([$.Ctx.Lcl('feed_use_depletion_report', 'totalCaption', 'Total')]);
                              htmlTable += ' <td class ="cellRight boldFont">{0}</td> '.format([accounting.formatNumber(sumWghAll, 0, ',', 0)]);
                              htmlTable += ' <td class ="cellRight boldFont">{0}</td> '.format([accounting.formatNumber(sumDeadAll, 0, ',', 0)]);
                              htmlTable += ' <td class ="cellRight boldFont">{0}</td> '.format([accounting.formatNumber(sumCullAll, 0, ',', 0)]);
                              htmlTable += ' <td class ="cellRight boldFont">{0}</td> '.format([accounting.formatNumber(sumCumAll, 0, ',', 0)]);
                              htmlTable += ' </tr> ';
                          }


                          htmlTable += ' </table> ';
                          $('#feed_use_depletion_report #divReport').html(htmlTable);
                          $('#feed_use_depletion_report #divReport').trigger('create');
                          //   }
                      }

                      else {
                          $.Ctx.MsgBox($.Ctx.Lcl('feed_use_depletion_report', 'dataNotFound', 'Data not found'));
                      }
                  }, function (err) {
                      console.log('Error Get Report Data');
                  });
              }
              else {
                  $.Ctx.MsgBox($.Ctx.Lcl('feed_use_depletion_report', 'dataNotFound', 'Data not found'));
              }

          }, function (err) {
              console.log('Error from getReportData.GetTranDate : ' + err);
          });

       }
   