'use strict';
// дирректория где лежит Uccello
var uccelloDir = 'Uccello2';
console.log('Using folder: ' + uccelloDir);

// GLOBAL DEFINITIONS to simulate browser environment
//
////////////////////////////////////////////////////
global.$ = { cookie: function () { } };
global.url = function () {
    return _url;
};
global.navigator = { userAgent: "test" };
global.io = require('socket.io-client');
global.window = global;
////////////////////////////////////////////////////

var config = {
    controls: [
        //{ className: 'RootTstCompany', component: '../DataControls/rootTstCompany', guid: 'c4d626bf-1639-2d27-16df-da3ec0ee364e' },
        //{ className: 'RootTstContact', component: '../DataControls/rootTstContact', guid: 'de984440-10bd-f1fd-2d50-9af312e1cd4f' },
        //{ className: 'RootAddress', component: '../DataControls/rootAddress', guid: '07e64ce0-4a6c-978e-077d-8f6810bf9386' },
        //{ className: 'RootCompany', component: '../DataControls/rootCompany', guid: '0c2f3ec8-ad4a-c311-a6fa-511609647747' },
        //{ className: 'RootContact', component: '../DataControls/rootContact', guid: 'ad17cab2-f41a-36ef-37da-aac967bbe356' },
        //{ className: 'RootContract', component: '../DataControls/rootContract', guid: '4f7d9441-8fcc-ba71-2a1d-39c1a284fc9b' },
        //{ className: 'RootIncomeplan', component: '../DataControls/rootIncomeplan', guid: '194fbf71-2f84-b763-eb9c-177bf9ac565d' },
        //{ className: 'RootLead', component: '../DataControls/rootLead', guid: '31c99003-c0fc-fbe6-55eb-72479c255556' },
        //{ className: 'DataTstContact', component: '../DataControls/dataTstContact', guid: '27ce7537-7295-1a45-472c-a422e63035c7' },
        //{ className: 'DataContact', component: '../DataControls/dataContact', guid: '73596fd8-6901-2f90-12d7-d1ba12bae8f4' },
        //{ className: 'DataContract', component: '../DataControls/dataContract', guid: '08a0fad1-d788-3604-9a16-3544a6f97721' },
        //{ className: 'DataTstCompany', component: '../DataControls/dataTstCompany', guid: '34c6f03d-f6ba-2203-b32b-c7d54cd0185a' },
        //{ className: 'DataCompany', component: '../DataControls/dataCompany', guid: '59583572-20fa-1f58-8d3f-5114af0f2c51' },
        //{ className: 'DataAddress', component: '../DataControls/dataAddress', guid: '16ec0891-1144-4577-f437-f98699464948' },
        //{ className: 'DataLead', component: '../DataControls/dataLead', guid: '86c611ee-ed58-10be-66f0-dfbb60ab8907' },
        //{ className: 'DataIncomeplan', component: '../DataControls/dataIncomeplan', guid: '56cc264c-5489-d367-1783-2673fde2edaf' },
        //{ className: 'DbNavigator', component: 'dbNavigator', viewset: true, guid: '38aec981-30ae-ec1d-8f8f-5004958b4cfa' },
        //{ className: 'MatrixGrid', component: 'matrixGrid', viewset: true, guid: '827a5cb3-e934-e28c-ec11-689be18dae97' },
        //{ className: 'PropEditor', component: 'propEditor', viewset: true, guid: 'a0e02c45-1600-6258-b17a-30a56301d7f1' },
        //{ className: 'Container', viewset: true },
        //{ className: 'CContainer', viewset: true },
        //{ className: 'HContainer', viewset: true },
        //{ className: 'VContainer', viewset: true },
        //{ className: 'GContainer', viewset: true },
        //{ className: 'FContainer', viewset: true },
        //{ className: 'Form', viewset: true },
        //{ className: 'Button', viewset: true },
        //{ className: 'DataGrid', viewset: true },
        //{ className: 'DataEdit', viewset: true },
        //{ className: 'Edit', viewset: true },
        //{ className: 'Label', viewset: true }
    ],
    viewSet: { name: 'simpleview', path: '/../ProtoOne/public/ProtoControls/simpleview/' },
    controlsPath: __dirname + '/../ProtoOne/public/ProtoControls/',
    dataPath: __dirname + '/../ProtoOne/data/',
    uccelloPath: __dirname + '/../' + uccelloDir + '/'
};

// модуль настроек
var UccelloConfig = require('../' + uccelloDir + '/config/config');
global.UCCELLO_CONFIG = new UccelloConfig(config);
global.DEBUG = false;

var URL = "127.0.0.1";
var USER = "u1"
var PWD = "p1";
var TESTNUM = 1;
var opt_load = "fast";

var testFormGuid = "88b9280f-7cce-7739-1e65-a883371cd498";

var _url = URL;
var _user = USER
var _pwd = PWD;
var _test_num = TESTNUM;
var _ch_trace_flag = false;

function getTestNameAndSetOptions(num) {
    var tname = "Unknown";
    switch (num) {
        case 1:
            tname = "MoveCursor";
            break;
        case 2:
            opt_load = "fast"
            tname = "LoadNewRoots+fast";
            break;
        case 3:
            opt_load = "slow"
            tname = "LoadNewRoots+slow";
            break;
    };
    return tname;
}

for (var _cnt = 0; _cnt < process.argv.length; _cnt++) {
    var _arg = process.argv[_cnt];
    if (_arg.indexOf("-a") == 0) {
        _url = _arg.substring(2);
        console.log("Server address: " + _url);
    } else
        if (_arg.indexOf("-u") == 0) {
            _user = _arg.substring(2);
            console.log("USER: " + _user);
        }
        else
            if (_arg.indexOf("-p") == 0) {
                _pwd = _arg.substring(2);
                console.log("Password: " + _pwd);
            }
            else
                if (_arg.indexOf("-t") == 0) {
                    _test_num = Number(_arg.substring(2));
                    console.log("Test: " + getTestNameAndSetOptions(_test_num));
                }
                else
                    if (_arg === "-chTrace") {
                        _ch_trace_flag = true;
                        console.log("Low-level channel tracing is enabled.");
                        break;
                    };
};

var CommunicationClient = require("../" + uccelloDir + "/connection/comm-client");
var UccelloClt = require("../" + uccelloDir + "/uccello-clt");

UCCELLO_CONFIG.webSocketClient = UCCELLO_CONFIG.webSocketClient ? UCCELLO_CONFIG.webSocketClient : {};
UCCELLO_CONFIG.webSocketClient.io_log_flag = _ch_trace_flag;

// Тесты
var UnitTests = require('../' + uccelloDir + '/connection/unit-tests/lib/test-client-side');

var commClient = new CommunicationClient.Client(UCCELLO_CONFIG.webSocketClient);
var uccelloClt = new UccelloClt({
    commClient: commClient,
    unitTests: UnitTests
});
