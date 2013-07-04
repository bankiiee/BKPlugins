$('#lookup_grower_stock').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('lookup_grower_stock');
});

$('#lookup_grower_stock').bind('pageinit', function (e) {
	
    $('#lookup_grower_stock a[data-back="true"]').click(function (e) {
		var param = $.Ctx.GetPageParam('lookup_grower_stock', 'param');
        $.Ctx.NavigatePage(param.calledPage, null, { transition:'slide', reverse:'true' });
    });

    $('#lookup_grower_stock #lstView').listview('option', 'filterCallback',
        function (text, searchString) {
            var lText = text.toLowerCase();
            if(lText.indexOf('*') !== -1) {return false};
            if (lText.indexOf(searchString) !== -1){return false} ;
            return true;
    });
	
    $('#lookup_grower_stock #lstView').bind('listviewbeforefilter',
        function (e, data) {
            var $input = $(data.input);
            var filterText = $input.val();
            populateListView(dSource, filterText, false);
    });
    
	$('#lookup_grower_stock #div-showall').click(function (e) {
        var $input = $('#lookup_boar input[data-type="search"]');
        var filterText = $input.val();
        populateListView(dSource, filterText, true);
    });
});

var dSource=null;

$('#lookup_grower_stock').bind('pagebeforeshow', function (e) {
    var farmOrgLoc = $.Ctx.GetPageParam('lookup_grower_stock','farmOrgLoc');
    var cmd = $.Ctx.DbConn.createSelectCommand();
	var nameField='';
	if ($.Ctx.Lang=="en-US")
		nameField = "ifnull(G.DESC_ENG, G.DESC_LOC)";
	else
		nameField = "ifnull(G.DESC_LOC, G.DESC_ENG)";
	
	//Receive
	cmd.sqlText =  "SELECT S.BREEDER,{0} AS BREEDER_NAME ,S.BIRTH_WEEK, SUM(S.MALE_QTY) AS SUM_MALE, SUM(S.FEMALE_QTY) AS SUM_FEMALE ".format([nameField]); 
	cmd.sqlText += "FROM HH_FR_MS_GROWER_STOCK S ";
	cmd.sqlText += "JOIN GD3_FR_BREEDER G ON (S.ORG_CODE=G.ORG_CODE AND S.BREEDER=G.BREEDER) ";
	cmd.sqlText += "WHERE S.ORG_CODE=? AND S.FARM_ORG=? AND S.FARM_ORG_LOC=? AND S.TRANSACTION_TYPE='1' ";
	cmd.sqlText += "GROUP BY S.BREEDER,S.BIRTH_WEEK ";
	cmd.sqlText += "ORDER BY S.BREEDER,S.BIRTH_WEEK ";
	//cmd.parameters.push('550222001');
	//cmd.parameters.push('642001-0-02-3-002');
	//cmd.parameters.push('3');
	cmd.parameters.push($.Ctx.SubOp);
	cmd.parameters.push($.Ctx.Warehouse);
	cmd.parameters.push(farmOrgLoc);
   
    cmd.executeReader(function (tx, res) {
		dSource=[];
        if (res.rows.length>0) {//Pay
			for (var i = 0; i<res.rows.length; i++) {
				var m = {'BREEDER':res.rows.item(i).BREEDER, 
						 'BREEDER_NAME':res.rows.item(i).BREEDER_NAME,
						 'BIRTH_WEEK':res.rows.item(i).BIRTH_WEEK,
						 'SUM_MALE': res.rows.item(i).SUM_MALE==null?0:res.rows.item(i).SUM_MALE , 
						 'SUM_FEMALE':res.rows.item(i).SUM_FEMALE==null?0:res.rows.item(i).SUM_FEMALE};
				dSource.push(m);
			}
			var cmd2 = $.Ctx.DbConn.createSelectCommand();
			cmd2.sqlText =  "SELECT BREEDER, BIRTH_WEEK, SUM(MALE_QTY) AS SUM_MALE, SUM(FEMALE_QTY) AS SUM_FEMALE ";
			cmd2.sqlText += "FROM HH_FR_MS_GROWER_STOCK ";
			cmd2.sqlText += "WHERE ORG_CODE=? AND FARM_ORG=? AND FARM_ORG_LOC=? and TRANSACTION_TYPE='2' ";
			cmd2.sqlText += "GROUP BY BREEDER,BIRTH_WEEK ";
			cmd2.sqlText += "ORDER BY BREEDER,BIRTH_WEEK ";
			//cmd2.parameters.push('550222001');
			//cmd2.parameters.push('642001-0-02-3-002');
			//cmd2.parameters.push('3');
			cmd2.parameters.push($.Ctx.SubOp);
			cmd2.parameters.push($.Ctx.Warehouse);
			cmd2.parameters.push(farmOrgLoc);
			cmd2.executeReader(function (tx, res2) {
				for (var i=0;i<res2.rows.length;i++) {
					var stock = _.where(dSource, {'BREEDER':res2.rows.item(i).BREEDER ,'BIRTH_WEEK':res2.rows.item(i).BIRTH_WEEK});
					if (stock.length>0){
						stock[0].SUM_MALE -= res2.rows.item(i).SUM_MALE;
						stock[0].SUM_FEMALE -= res2.rows.item(i).SUM_FEMALE;
					}
				}
				populateListView(dSource, null, false);
			},function (err){
				alert(err.message);
			});
        }// End if (res.rows.length > 0) {//Pay
	
    }, function (err) {
        alert(err.message);
    });
});

function populateListView(p, filterText, isShowAll) {
	$('#lookup_grower_stock #lstView').empty();
	var s = '<li data-icon="false" data-filtertext="*">';
	s += '        <div class="ui-grid-c">';
	s += '            <div class="ui-block-a">';
	s += '               <div style="color:blue">{0}</div>'.format([$.Ctx.Lcl('lookup_grower_stock', 'colBreeder', 'Breeder')]);
	s += '            </div>';
	s += '            <div class="ui-block-b">';
	s += '               <div style="color:blue;text-align:center">{0}</div>'.format([$.Ctx.Lcl('lookup_grower_stock', 'colBw', 'Birthweek')]);
	s += '            </div>';
	s += '            <div class="ui-block-c">';
	s += '               <div style="color:blue;text-align:right">{0}</div>'.format([$.Ctx.Lcl('lookup_grower_stock', 'colMQty', 'Male Qty')]);
	s += '        	  </div>';
	s += '            <div class="ui-block-d">';
	s += '               <div style="color:blue;text-align:right">{0}</div>'.format([$.Ctx.Lcl('lookup_grower_stock', 'colFQty', 'Female Qty')]);
	s += '        	  </div>';
	s += '        </div>';
	s += '</li>';
	$('#lookup_grower_stock #lstView').append(s);
	var showCount = filterCount = 0;
	var maxShowCount = isShowAll==true?p.length:$.Ctx.CustomPageSize;
	var lenAll=0;
	for (var i=0;i<p.length; i++) {
		if (p[i].SUM_MALE==0&&p[i].SUM_FEMALE==0) continue;
		var txt1 = $.Ctx.Nvl(p[i].BREEDER_NAME, "");
        var txt2 = $.Ctx.Nvl(p[i].BIRTH_WEEK, "");
		
		var s = '<li data-icon="false"><a id="lki-{0}" data-tag="lst_item" data-id="{0}">'.format([i]);
		s += '<div class="ui-grid-c">';
		s += '		<div class="ui-block-a"><div style="">{0}</div></div>'.format([p[i].BREEDER_NAME]);
		s += '		<div class="ui-block-b"><div style="text-align:center">{0}</div></div>'.format([p[i].BIRTH_WEEK]);
		s += '		<div class="ui-block-c"><div style="text-align:right">{0}</div></div>'.format([p[i].SUM_MALE]);
		s += '		<div class="ui-block-b"><div style="text-align:right">{0}</div></div>'.format([p[i].SUM_FEMALE]);
		s += '</div>';
		s += '</a></li>';
		if (!IsNullOrEmpty(filterText)) {
			if (txt1.contains(filterText) || txt2.contains(filterText)) {
				filterCount += 1;
				if (showCount <= maxShowCount) {
					$('#lookup_grower_stock #lstView').append(s);
					showCount += 1;
				}
			}
		} else {
			filterCount += 1;
			if (showCount <= maxShowCount) {
				$('#lookup_grower_stock #lstView').append(s);
				showCount += 1;
			}
		}
		lenAll+=1;
	}// end for
	$('#lookup_grower_stock #lstView').listview('refresh');
	$('#lookup_grower_stock a[data-tag="lst_item"]').click(function (e) {
		var ind = $(this).attr('data-id');
		var param = $.Ctx.GetPageParam('lookup_grower_stock', 'param');
		$.Ctx.SetPageParam(param.calledPage, param.calledResult, dSource[ind]);
		$.Ctx.NavigatePage(param.calledPage, null, { transition: 'slide'});
	});
	
	if (!IsNullOrEmpty(filterText)) 
		$('#lookup_grower_stock #captionHeader').html('({0}/{1}) '.format([filterCount, lenAll]) + $.Ctx.Lcl('lookup_grower_stock', 'headGrowerStk','Grower Stock'));
	else 
		$('#lookup_grower_stock #captionHeader').html('({0}) '.format([lenAll]) + $.Ctx.Lcl('lookup_grower_stock', 'headGrowerStk', 'Grower Stock'));
	
	if (filterCount==showCount)
		$('#lookup_grower_stock #div-showall').hide();
	else 
		$('#lookup_grower_stock #div-showall').show();
}


