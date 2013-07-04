$('#lookup_breeder').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('lookup_breeder');
});

$('#lookup_breeder').bind('pageinit', function (e) {
    $('#lookup_breeder a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('lookup_breeder', 'Previous'), null, { transition:'slide', reverse:'true' });
    });

    $('#lookup_breeder #lstView').listview('option', 'filterCallback',
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

$('#lookup_breeder').bind('pagebeforeshow', function (e) {

    var dSource = new Array();

    $('#lookup_breeder #lstView').empty();

    var cmd = $.Ctx.DbConn.createSelectCommand();

    cmd.sqlText = "SELECT * FROM GD3_FR_BREEDER WHERE ORG_CODE = '" + $.Ctx.SubOp + "'";
    cmd.executeReader(function (tx, res) {
        if (res.rows.length != 0) {
            dSource = new Array();
            for (var i = 0; i < res.rows.length; i++) {
                var m = new GD3_FR_BREEDER();
                m.retrieveRdr(res.rows.item(i));
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
        s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_breeder', 'colBreederCode', 'Breeder Code')]);
        s += '            </div>';
        s += '            <div class="ui-block-b">';
        s += '                <center>';
        s += '                    <font size="3" color="blue">{0}</font></center>'.format([$.Ctx.Lcl('lookup_breeder', 'colDescription', 'Description')]);
        s += '            </div>';
        s += '        </div>';
        s += '    </a></li>';
        $('#lookup_breeder #lstView').append(s);

        for (var i = 0; i < p.length; i++) {
            var m = new GD3_FR_BREEDER();

            m = p[i];

            var desc = m.DESC_ENG;
            if ($.Ctx.Lang != 'en-US') {
                desc = m.DESC_LOC;
            }

            var s = '<li data-icon="false"><a id="{0}" data-tag="lst_item" {1}  >'.format(['lki-' + i, "data-id='" + i + "'"]);
            s += '<div class="ui-grid-b">';
            s += '<div class="ui-block-a"> <center>{0}</center></div>'.format([m.BREEDER]);
            s += '<div class="ui-block-b"><center>{0}</center></div>'.format([desc]);
            s += '</div>';
            s += '</a></li>';

            $('#lookup_breeder #lstView').append(s);
        }

        $('#lookup_breeder #lstView').listview('refresh');

        $('#lookup_breeder a[data-tag="lst_item"]').click(function (e) {
            var ind = $(this).attr('data-id');
            var param = new LookupParam();
            param = $.Ctx.GetPageParam('lookup_breeder', 'param');
            $.Ctx.SetPageParam(param.calledPage, param.calledResult, dSource[ind]);
            $.Ctx.NavigatePage(param.calledPage, null, { transition:'slide', reverse:'true' });
        });

    }
});



