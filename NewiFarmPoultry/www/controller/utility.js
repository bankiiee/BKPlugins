
$('#utility').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('utility');
    $.Ctx.RenderFooter('utility');

    if ($.Ctx.UserType == 'Admin') {
        var s = '<li><a class="utility-menu" data-id="ini" >INI</a></li>';
        s += '<li><a class="utility-menu" data-id="sqlutil" >SQL Utility</a></li>';
        $('#utility #lstView').append(s);

    }

    $('#utility a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('utility', 'Previous'), null, { transition: 'slide', reverse: 'true' });
    });

    $('#utility .utility-menu').click(function (e) {
        $.Ctx.NavigatePage($(this).attr("data-id"), { Previous: 'utility' }, { transition: 'slide' });
    });
});

$('#utility').bind('pagebeforeshow', function (e) {
  

});

 