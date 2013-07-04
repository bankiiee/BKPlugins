 
       var clickAlias = "click";

       function findFarmOrg(success) {
           var cmd = $.Ctx.DbConn.createSelectCommand();
           cmd.sqlText = $.FarmCtx.GetLookupFarmOrgSqlText(); 
         
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

       $("#vaccine_and_medicine_detail_report").bind("pageinit", function (event) {

           $('#vaccine_and_medicine_detail_report #lpView').bind(clickAlias, function () {

               var farmOrg = $.Ctx.GetPageParam('vaccine_and_medicine_detail_report', 'selectedFarmOrg');
               if (farmOrg == null) {
                   $.Ctx.MsgBox($.Ctx.Lcl('vaccine_and_medicine_detail_report', 'pleaseSelectFarmOrg', 'Please select Farm Org.'));
                   return false;
               }

               var msGrowerSale = new HH_FR_MS_GROWER_SALE();

               var cmd = $.Ctx.DbConn.createSelectCommand();
               cmd.sqlText = " SELECT S.TRANSACTION_DATE, S.REF_DOCUMENT_NO, P.PRODUCT_NAME, CASE WHEN P.STOCK_KEEPING_UNIT = 'Q' THEN QTY ELSE WGH END VOLUME ";
               cmd.sqlText += " FROM HH_FR_MS_MATERIAL_PURCHASE S, HH_PRODUCT_BU P ";
               cmd.sqlText += " WHERE S.PRODUCT_CODE = P.PRODUCT_CODE  ";
               cmd.sqlText += " AND S.ORG_CODE = ? AND S.FARM_ORG = ? AND S.STOCK_TYPE = '20' ";
               cmd.sqlText += " ORDER BY S.TRANSACTION_DATE, S.REF_DOCUMENT_NO ";


               var farmOrg = $.Ctx.GetPageParam('vaccine_and_medicine_detail_report', 'selectedFarmOrg');
               if (farmOrg == null) {
                   $.Ctx.MsgBox($.Ctx.Lcl('vaccine_and_medicine_detail_report', 'pleaseSelectFarmOrg', 'Please select Farm Org.'));
                   return false;
               }
               cmd.parameters.push($.Ctx.SubOp);
               cmd.parameters.push(farmOrg.CODE);

               cmd.executeReader(function (tx, res) {
                   if (res.rows.length != 0) {
                       var tableHtml = '';

                       tableHtml += ' <table class = "reportTableStyle"> ';
                       tableHtml += ' <tr> ';
                       tableHtml += ' <td colspan="4" class = "headerStyle" >';
                       tableHtml += ' Vaccine & Medicine Detail';
                       tableHtml += ' </td>';
                       tableHtml += ' </tr>';
                       tableHtml += ' <tr>';
                       tableHtml += ' <td  class = "headerStyle width15">';
                       tableHtml += ' D/M/Y';
                       tableHtml += ' </td>';
                       tableHtml += ' <td  class = "headerStyle width25">';
                       tableHtml += ' Doc No';
                       tableHtml += ' </td>';
                       tableHtml += ' <td  class = "headerStyle width45">';
                       tableHtml += ' Name';
                       tableHtml += ' </td>';
                       tableHtml += ' <td  class = "headerStyle width15">';
                       tableHtml += ' Volume';
                       tableHtml += ' </td>';

                       tableHtml += ' </tr>';

                      
                       //Gen Data 
                       for (var idx = 0; idx < res.rows.length; idx++) {
                           var vol = $.Ctx.Nvl(res.rows.item(idx).VOLUME, '') == '' ? '' : accounting.formatNumber(res.rows.item(idx).VOLUME, 0, ',', 0);                    

                           tableHtml += ' <tr> ';
                           tableHtml += ' <td class= "cellCenter">{0}</td> '.format([new XDate(res.rows.item(idx).TRANSACTION_DATE).showDateByFormat($.FarmCtx.reportDateFormat)]);
                           tableHtml += ' <td class ="cellCenter">{0}</td> '.format([res.rows.item(idx).REF_DOCUMENT_NO]);
                           tableHtml += ' <td class ="cellLeft">{0}</td> '.format([res.rows.item(idx).PRODUCT_NAME]);
                           tableHtml += ' <td class ="cellRight">{0}</td> '.format([vol]);
                           tableHtml += ' </tr> ';
                       }
                       

                      
                       tableHtml += ' </table> ';

                       $('#vaccine_and_medicine_detail_report #divReport').html(tableHtml);
                       $('#vaccine_and_medicine_detail_report #divReport').trigger('create');
                   } else {
                       $.Ctx.MsgBox($.Ctx.Lcl('vaccine_and_medicine_detail_report', 'dataNotFound', 'Data not found'));
                   }

               }, function (err) {
                   console.log('Report Execute Reader Error.' + err);
               });



           });


           $('#vaccine_and_medicine_detail_report #lpFarmOrg').bind(clickAlias, function () {
               $.Ctx.SetPageParam('vaccine_and_medicine_detail_report', 'ScrollingTo', $(window).scrollTop());
               $.FarmCtx.SearchFarmOrgUsingMapMobile(function (orgs) {
                   if (orgs !== null) {
                       var p = new LookupParam();
                       p.title = $.Ctx.Lcl('vaccine_and_medicine_detail_report', 'msgFarmOrg', 'Farm Organization');
                       p.calledPage = 'vaccine_and_medicine_detail_report';
                       p.calledResult = 'selectedFarmOrg';
                       p.codeField = 'CODE';
                       p.nameField = 'NAME';
                       p.showCode = true;
                       p.dataSource = orgs;

                       var farmOrg = $.Ctx.GetPageParam('vaccine_and_medicine_detail_report', 'selectedFarmOrg');
                       var prevCode = '';
                       if (farmOrg != null)
                           prevCode = farmOrg.CODE;
                       $.Ctx.SetPageParam('vaccine_and_medicine_detail_report', 'prev_farm_org_code', prevCode);
                       $.Ctx.SetPageParam('lookup', 'param', p);
                       $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
                   }
               });
           });

           $('#vaccine_and_medicine_detail_report #btnBack').bind(clickAlias, function () {
               $.Ctx.NavigatePage($.Ctx.GetPageParam('vaccine_and_medicine_detail_report', 'Previous'),
			                            null,
		                                { transition: 'slide', reverse: true });
               //$.Ctx.ClearPageParam('vaccine_and_medicine_detail_report');
           });

       });


       $('#vaccine_and_medicine_detail_report').bind("pagebeforecreate", function (e) {
           $.Util.RenderUiLang('vaccine_and_medicine_detail_report');
           $.Ctx.RenderFooter('vaccine_and_medicine_detail_report');
       });

       $("#vaccine_and_medicine_detail_report").bind("pageshow", function (event) {
           if ($.Ctx.GetPageParam('vaccine_and_medicine_detail_report', 'ScrollingTo') != null) {
               //scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
               $('html, body').animate({
                   scrollTop: $.Ctx.GetPageParam('vaccine_and_medicine_detail_report', 'ScrollingTo')
               }, 0);
           }
           setLookupToControl();
       });

       function setLookupToControl() {
           var farmOrg = $.Ctx.GetPageParam('vaccine_and_medicine_detail_report', 'selectedFarmOrg');
           var prevFarmOrg = $.Ctx.GetPageParam('vaccine_and_medicine_detail_report', 'prev_farm_org_code');
           if (farmOrg !== null) {
               $('#vaccine_and_medicine_detail_report #lpFarmOrg').text(farmOrg.CODE + ' ' + farmOrg.NAME);
               if (prevFarmOrg != farmOrg.CODE) {
                   $('#vaccine_and_medicine_detail_report #divReport').empty();
               }
           }
           else {
               $('#vaccine_and_medicine_detail_report #lpFarmOrg').text($.Ctx.Lcl('vaccine_and_medicine_detail_report', 'msgSelect', 'Select'));
               $('#vaccine_and_medicine_detail_report #divReport').empty();
           }
           $('#vaccine_and_medicine_detail_report #lpFarmOrg').button('refresh');


       }
             
        
    
   