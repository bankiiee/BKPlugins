 
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

       $("#med_detail_report").bind("pageinit", function (event) {

           $('#med_detail_report #lpView').bind(clickAlias, function () {

               var farmOrg = $.Ctx.GetPageParam('med_detail_report', 'selectedFarmOrg');
               if (farmOrg == null) {
                   $.Ctx.MsgBox($.Ctx.Lcl('med_detail_report', 'pleaseSelectFarmOrg', 'Please select Farm Org.'));
                   return false;
               }

               var msGrowerSale = new HH_FR_MS_GROWER_SALE();

               var cmd = $.Ctx.DbConn.createSelectCommand();
               cmd.sqlText = " SELECT S.TRANSACTION_DATE, S.REF_DOCUMENT_NO, S.PRODUCT_CODE , P.PRODUCT_NAME, "; 
               cmd.sqlText += " case when P.STOCK_KEEPING_UNIT is null then  " ; 
               cmd.sqlText += " case when QTY = 0 then WGH else QTY end " ; 
               cmd.sqlText += "  else "  ;
               cmd.sqlText += "  CASE WHEN P.STOCK_KEEPING_UNIT = 'Q' THEN QTY ELSE WGH END ";
               cmd.sqlText += " end as  VOLUME ";
               cmd.sqlText += " FROM HH_FR_MS_MATERIAL_PURCHASE S "; 
               cmd.sqlText += " left join  HH_PRODUCT_BU P on S.PRODUCT_CODE = P.PRODUCT_CODE ";
               cmd.sqlText += " WHERE ";
               cmd.sqlText += " S.ORG_CODE = ? AND S.FARM_ORG = ? AND S.STOCK_TYPE = '20' ";
               cmd.sqlText += " ORDER BY S.TRANSACTION_DATE, S.REF_DOCUMENT_NO ";


               var farmOrg = $.Ctx.GetPageParam('med_detail_report', 'selectedFarmOrg');
               if (farmOrg == null) {
                   $.Ctx.MsgBox($.Ctx.Lcl('med_detail_report', 'pleaseSelectFarmOrg', 'Please select Farm Org.'));
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
                       tableHtml += ' {0}'.format([$.Ctx.Lcl('med_detail_report' , 'medRptCaption' , 'Vaccine & Medicine Detail')]);
                       tableHtml += ' </td>';
                       tableHtml += ' </tr>';
                       tableHtml += ' <tr>';
                       tableHtml += ' <td  class = "headerStyle width15">';
                       tableHtml += ' {0}'.format([$.Ctx.Lcl('med_detail_report' , 'dateCaption', 'D/M/Y')]);
                       tableHtml += ' </td>';
                       tableHtml += ' <td  class = "headerStyle width25">';
                       tableHtml += ' {0}'.format([$.Ctx.Lcl('med_detail_report', 'docNoCaption', 'Doc No')]);
                       tableHtml += ' </td>';
                       tableHtml += ' <td  class = "headerStyle width45">';
                       tableHtml += ' {0}'.format([$.Ctx.Lcl('med_detail_report', 'nameCaption', 'Name')]);
                       tableHtml += ' </td>';
                       tableHtml += ' <td  class = "headerStyle width15">';
                       tableHtml += ' {0}'.format([$.Ctx.Lcl('med_detail_report' , 'volumeCaption' ,'Volume')]);
                       tableHtml += ' </td>';

                       tableHtml += ' </tr>';

                      
                       //Gen Data 
                       for (var idx = 0; idx < res.rows.length; idx++) {
                           var vol = $.Ctx.Nvl(res.rows.item(idx).VOLUME, '') == '' ? '' : accounting.formatNumber(res.rows.item(idx).VOLUME, 0, ',', 0);                    

                           tableHtml += ' <tr> ';
                           tableHtml += ' <td class= "cellCenter">{0}</td> '.format([new XDate(res.rows.item(idx).TRANSACTION_DATE).showDateByFormat($.FarmCtx.reportDateFormat)]);
                           tableHtml += ' <td class ="cellCenter">{0}</td> '.format([res.rows.item(idx).REF_DOCUMENT_NO]);
                           tableHtml += ' <td class ="cellLeft">{0}</td> '.format([ res.rows.item(idx).PRODUCT_CODE + ' ' + $.Ctx.Nvl( res.rows.item(idx).PRODUCT_NAME , '' )]);
                           tableHtml += ' <td class ="cellRight">{0}</td> '.format([vol]);
                           tableHtml += ' </tr> ';
                       }
                       

                      
                       tableHtml += ' </table> ';

                       $('#med_detail_report #divReport').html(tableHtml);
                       $('#med_detail_report #divReport').trigger('create');
                   } else {
                       $.Ctx.MsgBox($.Ctx.Lcl('med_detail_report', 'dataNotFound', 'Data not found'));
                   }

               }, function (err) {
                   console.log('Report Execute Reader Error.' + err);
               });



           });


           $('#med_detail_report #lpFarmOrg').bind(clickAlias, function () {
               $.Ctx.SetPageParam('med_detail_report', 'ScrollingTo', $(window).scrollTop());
               $.FarmCtx.SearchFarmOrgUsingMapMobile(function (orgs) {
                   if (orgs !== null) {
                       var p = new LookupParam();
                       p.title = $.Ctx.Lcl('med_detail_report', 'msgFarmOrg', 'Farm Organization');
                       p.calledPage = 'med_detail_report';
                       p.calledResult = 'selectedFarmOrg';
                       p.codeField = 'CODE';
                       p.nameField = 'NAME';
                       p.showCode = true;
                       p.dataSource = orgs;

                       var farmOrg = $.Ctx.GetPageParam('med_detail_report', 'selectedFarmOrg');
                       var prevCode = '';
                       if (farmOrg != null)
                           prevCode = farmOrg.CODE;
                       $.Ctx.SetPageParam('med_detail_report', 'prev_farm_org_code', prevCode);
                       $.Ctx.SetPageParam('lookup', 'param', p);
                       $.Ctx.NavigatePage('lookup', null, { transition: 'slide' });
                   }
               });
           });

           $('#med_detail_report #btnBack').bind(clickAlias, function () {
               $.Ctx.NavigatePage($.Ctx.GetPageParam('med_detail_report', 'Previous'),
			                            null,
		                                { transition: 'slide', reverse: true });
               //$.Ctx.ClearPageParam('med_detail_report');
           });

       });


       $('#med_detail_report').bind("pagebeforecreate", function (e) {
           $.Util.RenderUiLang('med_detail_report');
           $.Ctx.RenderFooter('med_detail_report');
       });

       $("#med_detail_report").bind("pageshow", function (event) {
           if ($.Ctx.GetPageParam('med_detail_report', 'ScrollingTo') != null) {
               //scrollTop: $( "#" + $.Ctx.GetPageParam('medicine_usage_detail', 'ScrollingTo')).offset().top
               $('html, body').animate({
                   scrollTop: $.Ctx.GetPageParam('med_detail_report', 'ScrollingTo')
               }, 0);
           }
           setLookupToControl();
       });

       function setLookupToControl() {
           var farmOrg = $.Ctx.GetPageParam('med_detail_report', 'selectedFarmOrg');
           var prevFarmOrg = $.Ctx.GetPageParam('med_detail_report', 'prev_farm_org_code');
           if (farmOrg !== null) {
               $('#med_detail_report #lpFarmOrg').text(farmOrg.CODE + ' ' + farmOrg.NAME);
               if (prevFarmOrg != farmOrg.CODE) {
                   $('#med_detail_report #divReport').empty();
               }
           }
           else {
               $('#med_detail_report #lpFarmOrg').text($.Ctx.Lcl('med_detail_report', 'msgSelect', 'Select'));
               $('#med_detail_report #divReport').empty();
           }
           $('#med_detail_report #lpFarmOrg').button('refresh');


       }
             
        
    
   