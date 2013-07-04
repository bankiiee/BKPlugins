
//(function(cordova){

function BKPlugins() {}
var cordovaRef = window.PhoneGap || window.Cordova || window.cordova; // old to new fallbacks
    
BKPlugins.prototype.testAlert = function(options, callback) {
    if(!options) options = {};
    var scope = options.scope || null;
    delete options.scope;
    
    var service = 'BKPlugins',
    action = 'testAlert';
    //callbackId = service + (cordova.callbackId + 1);
    
    //var config = {
    //domain: options.domain || 'com.example.myapp',
    //key: options.key || 'difficult-to-guess-key'
    //};
    
    var _callback = function(result) {
        if(typeof callback == 'function') callback.apply(scope, arguments);
    };
    
    return cordova.exec(callback, callback, service, action, []);
    
};

BKPlugins.prototype.callExpertTools = function(options, callback) {
    if(!options) options = {};
    var scope = options.scope || null;
    delete options.scope;
    
    var service = 'BKPlugins',
    action = 'callExpertTools';
    //callbackId = service + (cordova.callbackId + 1);
    
    //var config = {
    //domain: options.domain || 'com.example.myapp',
    //key: options.key || 'difficult-to-guess-key'
    //};
    
    var _callback = function(result) {
        if(typeof callback == 'function') callback.apply(scope, arguments);
    };
    
    return cordova.exec(callback, callback, service, action, []);
    
};


cordova.addConstructor(function() {
//                       if (!window.Cordova) {
//                       window.Cordova = cordova;
//                       };
                       if(!window.plugins) window.plugins = {};
                       window.plugins.BKPlugins = new BKPlugins();
//window.BKPlugins  = new BKPlugins();
                       //window.BKPlugins = new BKPlugins();
//                       });
                       }

//})(cordova);
