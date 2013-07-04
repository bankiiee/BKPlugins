
var destination_div = "#ini-listview";
var preid = 'config-';


$('#ini').bind('pagebeforecreate', function (e) {
 
    $.Util.RenderUiLang('ini');
    $.Ctx.RenderFooter('ini');
    

    $('#ini a[data-back="true"]').click(function (e) {
        //Save to HH_INIT
        $.Ctx.RootUrl = $('#txtRootUrl').val();

        $('#ini [id^=config-]').each(function () {
            var id = $(this).attr('id');
            var s = id.split("-");
            var key = s[1];
            for (gbvKey in $.Ctx) {
                if (gbvKey == key) {
                    $.Ctx[key] = $('#config-' + key).val();
                }
            }

            var sCmd = $.Ctx.DbConn.createSelectCommand();
            sCmd.sqlText = "SELET * FROM HH_INIT WHERE KEY = ?";
            sCmd.parameters.push($('#config-' + key).val());
            sCmd.executeReader(function (t, res) {
                if (res.rows.length > 0) {
                    var m = new HH_INIT();
                    m.retrieveRdr(res.rows.item(0));
                    m.VALUE = $('#config-' + key).val();
                    var cmd = m.updateCommand($.Ctx.DbConn);
                    cmd.executeNonQuery();
                }
            });
        });


        $.Ctx.NavigatePage($.Ctx.GetPageParam('ini', 'Previous'), null, { transition: 'slide' });
    });

});

$("#ini").bind("pagecreate", function () {
    getCurrentConfig(function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            data[i].id = preid + data[i].KEY;
            data[i].target = destination_div;

            createObjectByType(data[i].INPUT_TYPES, data[i]);

        }
        $("#ini-listview").listview('refresh');
        $("#ini .ui-page").trigger("create");
    });
});

$("#ini").bind('pageshow', function (e) {
    if ($.Ctx.UserType == 'Admin') {
        $('#ini #div-txtRootUrl').show();
        $('#ini #txtRootUrl').val($.Ctx.RootUrl);

    } else {
        $('#ini #div-txtRootUrl').hide();
    }
    console.log('page show')
    $("#ini input[type='date']").mobipick();
});

function getCurrentConfig(success) {
    var collection = [];
    var sql = "SELECT * from HH_INIT WHERE FOR_ADMIN != 'Y' ";
    if ($.Ctx.UserType == 'Admin') {
        sql = "SELECT * from HH_INIT ";
    }

    var init_bu = new HH_INIT();
    var cmd = $.Ctx.DbConn.createSelectCommand()
    //console.log(cmd);
    cmd.sqlText = sql;
    cmd.executeReader(function (t, result) {
        for (var i = 0; i < result.rows.length; i++) {
            // console.log(result.rows.item(i));
            collection.push(result.rows.item(i));
        }
        success(collection);
    });
}


function createObjectByType(type, options) {
    switch (type) {
        case ("NUMBER"):
            console.log('this is a NUMBER input')
            createNumberInput(options)
            $(destination_div).listview('refresh');
            break;
        case ("TEXT"):
            console.log('this is a TEXT input')
            createTextInput(options)
            break;
        case ("SWITCH"):
            console.log('this is a SWITCH input')
            createSwitchInput(options)
            break;
        case ("SLIDER"):
            console.log('this is a SLIDER input')
            createSliderInput(options)
            break;
        case ("RADIO"):
            console.log('this is a RADIO input')
            createRadioInput(options)
            break;
        case ("COMBOBOX"):
            console.log('this is a SELECT input')
            createComboboxInput(options);
            break;
        case ("TEXTAREA"):
            console.log('this is a TEXTAREA input')
            break;
        case ("DATE"):
            console.log('this is a DATE input')
            createDateInput(options);
            break;
        case ("TIME"):
            console.log('this is a TIME input')
            break;
        case ("FILE"):
            console.log('this is a FILE input')
            break;
        default:
            console.log('invalid input type');
            break;

    }
}
function createTextInput(options) {
    //                options.isEditable = false;
    //                options.value = 'you have mails.'
    console.log(options.isEditable == false);

    if (options.CAN_EDIT == 'N' || typeof (options.CAN_EDIT) == 'undefined') {
        var elem = "<li data-role='fieldcontain' ><label for='" + options.id + "'>" + options.DESCRIPTION + "</label><input type='text' id='" + options.id + "' class='ui-disabled' /></li>"
    } else {
        var elem = "<li data-role='fieldcontain' ><label for='" + options.id + "'>" + options.DESCRIPTION + "</label><input type='text' id='" + options.id + "' class='' /></li>"
    }
    $(options.target).append(elem);
    $("#" + options.id).val(options.VALUE);
}

function createNumberInput(options) {
    if (options.CAN_EDIT == 'N' || typeof (options.CAN_EDIT) == 'undefined') {
        var elem = "<li data-role='fieldcontain' ><label for='" + options.id + "'>" + options.DESCRIPTION + "</label><input type='number' id='" + options.id + "' class='ui-disabled' /></li>"
    } else {
        var elem = "<li data-role='fieldcontain' ><label for='" + options.id + "'>" + options.DESCRIPTION + "</label><input type='number' id='" + options.id + "' class='' /></li>"
    }
    $(options.target).append(elem);
    $("#" + options.id).val(options.VALUE);
}
function createSwitchInput(options) {
    var elem = "<li data-role='fieldcontain'><label for='" + options.id + "'>" + options.DESCRIPTION + "</label><select id='" + options.id + "'  data-role='slider' >"

    if (options.VALUE.toLowerCase() == 'on') {
        var elem2 = "<option value='off'>Off</option><option value='on' selected='selected'>On</option>"
    } else {
        var elem2 = "<option value='off' selected='selected'>Off</option><option value='on' >On</option>"
    }
    var elem3 = "</select></li>";
    console.log(elem + elem2 + elem3);
    $(options.target).append(elem + elem2 + elem3);
    if (options.CAN_EDIT == 'N' || typeof (options.CAN_EDIT) == 'undefined') {
        $("#ini #" + options.id).slider({ disabled: true });
    } else {
        $("#ini #" + options.id).slider({ disabled: false });
    }
}
function createSliderInput(options) {
    var elem = "<li data-role='fieldcontain'><label for='" + options.id + "'>" + options.DESCRIPTION + "</label><input type='range' id='" + options.id + "'  min='0' max='100' value='" + options.VALUE + "'/>"
    var elem2 = "<label id='slider-label-" + options.id + "'>0</label>";
    var elem3 = "</li>";

    //                console.log($("#" + options.id));
    if (options.isEditable == 'N' || typeof (options.isEditable) == 'undefined') {
        //                    $("#" + options.id).slider({ disabled: true });
        $(options.target).append(elem + elem3);
        //                    $("#" + options.id).slider({ disabled: true }).slider('refresh');
    } else {
        //                    $("#" + options.id).slider({ disabled: false });
        $(options.target).append(elem + elem3);
    }

}
function createRadioInput(options) {
    var elem = "<li data-role='fieldcontain'><fieldset data-role='controlgroup' ><legend>" + options.DESCRIPTION + "</legend><span id='radio-" + options.id + "'>";
    var collections = options.DOMAIN_VALUES.split(',');
    console.log(collections);
    var elem2 = '';
    for (var i = 0; i < collections.length; i++) {
        console.log(collections[i]);
        elem2 += "<label for='" + options.id + "-" + i + "'>" + collections[i] + "</label><input type='radio' name='radio1' id='" + options.id + "-" + i + "' value='" + options.VALUE + "'/>";
    }
    var elem3 = "</span></fieldset></li>"
    console.log(elem2);
    $(options.target).append(elem + elem2 + elem3);

    if (options.CAN_EDIT == 'N' || typeof (options.CAN_EDIT) == 'undefined') {
        console.log('disable radio');
        $("#radio-" + options.id).addClass('ui-disabled');
    } else {
        $("#" + options.id).checkboxradio('enable');
    }

}

function createComboboxInput(options) {
    var elem = "<li data-role='fieldcontain'><fieldset data-role='controlgroup'><legend>" + options.DESCRIPTION + "</legend><select name='combo-" + options.id + "-" + i + "'>";
    var collections = options.DOMAIN_VALUES.split(',');
    console.log(collections);
    var elem2 = '';
    for (var i = 0; i < collections.length; i++) {
        console.log(collections[i]);
        elem2 += "<option value='" + collections[i] + "'>" + collections[i] + "</option>";
    }
    var elem3 = "</fieldset></li>"
    console.log(elem2);
    $(options.target).append(elem + elem2 + elem3);
    if (options.CAN_EDIT == 'N' || typeof (options.CAN_EDIT) == 'undefined') {
        $("#ini #" + options.id).addClass('ui-disabled');
    } else {
        $("#ini #" + options.id).removeClass('ui-disabled');
    }

}
function createDateInput(options) {

    //$('#dateto-text', this).mobipick();
    if (options.CAN_EDIT == 'N' || typeof (options.CAN_EDIT) == 'undefined') {
        var elem = "<li data-role='fieldcontain' ><label for='" + options.id + "'>" + options.DESCRIPTION + "</label><input type='date' id='" + options.id + "' class='ui-disabled' /></li>"
    } else {
        var elem = "<li data-role='fieldcontain' ><label for='" + options.id + "'>" + options.DESCRIPTION + "</label><input type='date' id='" + options.id + "' class='' /></li>"
    }
    $(options.target).append(elem);
    //$("#" + options.id).val(options.VALUE); 
}

 