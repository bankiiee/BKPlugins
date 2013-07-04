$('#about').bind('pagebeforecreate', function (e) {
    $.Util.RenderUiLang('about');
});

$('#about').bind('pageinit', function (e) {
    $('#about a[data-back="true"]').click(function (e) {
        $.Ctx.NavigatePage($.Ctx.GetPageParam('about', 'Previous'), null, { transition: 'slide', action: 'reverse' });
    });   
} );