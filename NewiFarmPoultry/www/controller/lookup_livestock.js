$('#lookup_livestock').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('lookup_livestock');
});

$('#lookup_livestock').bind('pageinit', function (e) {
    $('#lookup_livestock a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('lookup_livestock', 'Previous'), null, { transition:'slide', reverse:'true' });
    });

    $('#lookup_livestock #lstView').listview('option', 'filterCallback',
        function (text, searchString) {
            var lText = text.toLowerCase();
            if (lText.indexOf('*') !== -1) {
                return false
            }
            ;
            if (lText.indexOf(searchString) !== -1) {
                return false
            }
            ;
            return true;
        }
    );
});

$('#lookup_livestock').bind('pagebeforeshow', function (e) {

    var dSource = new Array();

    $('#lookup_livestock #lstView').empty();

    var cmd = $.Ctx.DbConn.createSelectCommand();

    cmd.sqlText = "SELECT A.LIVESTOCK_CODE, B.DESC_LOC , B.DESC_ENG FROM  (SELECT DISTINCT LIVESTOCK_CODE FROM   HH_FR_STD_FEED) A, GD2_FR_LIVESTOCK B";
    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            dSource = new Array();
            for (var i = 0; i < res.rows.length; i++) {
                var m = new HH_FR_STD_FEED();
                m.retrieveRdr(res.rows.item(i));
                m.DESC_LOC = res.rows.item(i).DESC_LOC;
                m.DESC_ENG = res.rows.item(i).DESC_ENG;
                dSource.push(m);
            }
            populateListView(dSource);
        }
    }, function (err) {
        $.Ctx.MsgBox(err.message);
    });

    function populateListView(p) {
        var s = ' <li data-icon="false" data-filtertext="*"><a>';
        s += '        <div class="ui-grid-b">';
        s += '            <div class="ui-block-a">';
        s += '                <center>';
        s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_livestock', 'colLivestock', 'Livestock')]);
        s += '            </div>';
        s += '            <div class="ui-block-b">';
        s += '                <center>';
        s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_livestock', 'colDescription', 'Description')]);
        s += '            </div>';
        s += '        </div>';
        s += '    </a></li>';
        $('#lookup_livestock #lstView').append(s);

        for (var i = 0; i < p.length; i++) {


            var desc = p[i].DESC_ENG;
            if ($.Ctx.Lang != 'en-US') {
                desc = p[i].DESC_LOC;
            }

            var s = '<li data-icon="false"><a id="{0}" data-tag="lst_item" {1}  >'.format(['lki-' + i, "data-id='" + i + "'"]);
            s += '<div class="ui-grid-b">';
            s += '<div class="ui-block-a"> <center>{0}</center></div>'.format([p[i].LIVESTOCK_CODE]);
            s += '<div class="ui-block-b"><center>{0}</center></div>'.format([desc]);
            s += '</div>';
            s += '</a></li>';

            $('#lookup_livestock #lstView').append(s);
        }

        $('#lookup_livestock #lstView').listview('refresh');

        $('#lookup_livestock a[data-tag="lst_item"]').click(function (e) {
            var ind = $(this).attr('data-id');
            var param = new LookupParam();
            param = $.Ctx.GetPageParam('lookup_livestock', 'param');
            $.Ctx.SetPageParam(param.calledPage, param.calledResult, dSource[ind]);
            $.Ctx.NavigatePage(param.calledPage, null, { transition:'slide', reverse:'true' });
        });

    }
});



