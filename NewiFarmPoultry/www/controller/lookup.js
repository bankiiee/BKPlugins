
var _LookupItems_ = new Array();
$('#lookup').bind('pageinit', function (e) {
    $('#lookup a[data-back="true"]').click(function (e) {
        console.log('click back button');
        var p = $.Ctx.GetPageParam('lookup', 'param');
        $.Ctx.NavigatePage(p.calledPage, null, { transition: 'slide', reverse: 'true' });
    });

    $('#lookup #lookup-listview').listview('option', 'filterCallback',
        function (text, searchString) {
            var lText = text.toLowerCase();
            if (lText.indexOf('*') !== -1) { return false };
            if (lText.indexOf(searchString) !== -1) { return false };
            return true;
        });
    $('#lookup #lookup-listview').bind('listviewbeforefilter',
        function (e, data) {
            var $input = $(data.input);
            var filterText = $input.val();
            var p = $.Ctx.GetPageParam('lookup', 'param');
            populatelookup(p, filterText, false);
        });

    $('#lookup #div-showall').click(function (e) {
        var $input = $('#lookup_reason input[data-type="search"]');
        var filterText = $input.val();
        var p = $.Ctx.GetPageParam('lookup', 'param');
        populatelookup(p, filterText, true);
    });
});

$('#lookup').bind('pagebeforecreate', function (e) {
    console.log('lookup pagebeforecreate');
    $.Util.RenderUiLang('lookup');
}); //End PageInit

$('#lookup').bind('pagebeforeshow', function (e) {
    console.log('lookup pagecreate');

    _LookupItems_ = new Array();

    var p = new LookupParam();
    p = $.Ctx.GetPageParam('lookup', 'param');
    var err = '';
    if (p.dataSource == null) { err += 'lookup param:datasource cannot null'; }
    if (p.codeField == null) { err += 'lookup param:codeField cannot null'; }
    if (p.calledPage == null) { err += 'lookup param:calledPage cannot null'; }
    if (p.calledResult == null) { err += 'lookup param:calledResult cannot null'; }

    if (err.length > 0) { $.Ctx.MsgBox($.Ctx.Lcl('lookup', 'MSG01', err)); }

    $('#lookup #captionHeader').html(p.title);
    populatelookup(p, null, false);
});

function populatelookup(p, filterText, isShowAll) {


    $('#lookup #lookup-listview').empty();
    var showCount = filterCount = 0;
    var maxShowCount = isShowAll==true?p.dataSource.length:$.Ctx.CustomPageSize;

    for (i = 0; i < p.dataSource.length; i++) {
        var item = p.dataSource[i];
        var code = item[p.codeField];
        var name = item[p.nameField];
        if (name == null || name == undefined) { name = '' }

        var txt1 = $.Ctx.Nvl(code, "");
        var txt2 = $.Ctx.Nvl(name, "");

        var s = '<li data-icon="false"><a id="{0}" class="lookup_item" >'.format(['lki-' + i]);
        if (p.showName) {
            s += '<p class="lki_name"><h3>{0}</h3></p>'.format([name]);
        }
        if (p.showCode) {
            s += '<p><strong class="lki_code">{0}</strong></p>'.format([code]);
        }
        s += '</a></li>';
        if (!IsNullOrEmpty(filterText)) {

            if (p.showCode && p.showName) {
                if (txt1.contains(filterText) || txt2.contains(filterText)) {
                    filterCount += 1;
                    if (showCount <= maxShowCount) {
                        $('#lookup #lookup-listview').append(s);
                        showCount += 1;
                    }
                }
            }else if (p.showCode){
                if (txt1.contains(filterText)) {
                    filterCount += 1;
                    if (showCount <= maxShowCount) {
                        $('#lookup #lookup-listview').append(s);
                        showCount += 1;
                    }
                }
            }else if (p.showName){
                if (txt2.contains(filterText)) {
                    filterCount += 1;
                    if (showCount <= maxShowCount) {
                        $('#lookup #lookup-listview').append(s);
                        showCount += 1;
                    }
                }
            }
        } else {
            filterCount += 1;
            if (showCount <= maxShowCount) {
                $('#lookup #lookup-listview').append(s);
                showCount += 1;
            }
        }

    }

    $('#lookup .lookup_item').click(function (e) {
        //var selectCode = $(this).parent().parent().parent().attr('lookup-code');
        //set selected item
        //                    var name = $(this).children('h3 span').html();
        //                    var code = $(this).children('p').html();
        var s = $(this).attr('id').split('-');
        var i = s[1];

        $.Ctx.SetPageParam(p.calledPage, p.calledResult, p.dataSource[i]);
        if(p.calledPage == "farrow_detail" && (p.calledResult == "mMethodInput" || p.calledResult == "fMethodInput")){
            $.Ctx.SetPageParam('farrow_detail', 'defaultMethod' , 'F');
        }


        $.Ctx.NavigatePage(p.calledPage, null, {transition: 'slide', reverse: 'false' });
    });

    $('#lookup #lookup-listview').listview('refresh');

    if (!IsNullOrEmpty(filterText))
        $('#lookup #captionHeader').html(('({0}/{1}) ' + p.title).format([filterCount, p.dataSource.length]));
    else
        $('#lookup #captionHeader').html(('({0}) ' + p.title).format([ p.dataSource.length]));

    if (filterCount==showCount)
        $('#lookup #div-showall').hide();
    else
        $('#lookup #div-showall').show();
}

  