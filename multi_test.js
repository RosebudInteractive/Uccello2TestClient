var child_process = require('child_process');
var util = require('util');
var fs = require('fs');

var uccelloDir = 'Uccello';
var UccelloConfig = require('../' + uccelloDir + '/config/config');
UCCELLO_CONFIG = new UccelloConfig();
var logger = require('../' + uccelloDir + '/system/winstonLogger');

var NUM_INSTANCES = 20;

var URL = "127.0.0.1";
var USER = "u1"
var PWD = "p1";
var TESTNUM = 1;

var testModule = "./test.js";
var child_processes = {};
var nproc = 0;

var _url = URL;
var _user = USER
var _pwd = PWD;
var _num_proc = NUM_INSTANCES;
var _test_num = TESTNUM;
var _log_to_files = false;
var _ch_trace_flag = false;

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
                if (_arg.indexOf("-n") == 0) {
                    _num_proc = _arg.substring(2);
                    console.log("Child processes: " + _num_proc);
                }
                else
                    if (_arg.indexOf("-t") == 0) {
                        _test_num = Number(_arg.substring(2));
                        console.log("Test: #" + _test_num);
                    }
                    else
                        if (_arg.indexOf("-l") == 0) {
                            _log_to_files = true;
                            console.log("Log to files.");
                        }
                        else
                            if (_arg === "-chTrace") {
                                _ch_trace_flag = true;
                                console.log("Low-level channel tracing is enabled.");
                            }
};

function onChildError(pId) {
    return function (err) {
        logger.error("Erorr [" + pId + "]: " + JSON.stringify(err));
    };
};

function onChildExit(pId) {
    return function (code, signal) {
        logger.info("Exit [" + pId + "] code: " + code + ", signal: " + signal);
    };
};

function onChildStdOut(pId) {
    return function (data) {
        var str = String(data);
        logger.info("[" + pId + "]: " + str.substring(0, str.length - 1));
    };
};

function onChildStdErr(pId) {
    return function (data) {
        var str = String(data);
        logger.error("[" + pId + "]: " + str.substring(0, str.length - 1));
        //logger.error("STOP ON ERROR!!!");
        //process.exit(1);
        //throw new Error("STOP ON ERROR!!!");
    };
};

for (var i = 0; i < _num_proc; i++) {
    var opts = {
    //stdio: [process.stdin, process.stdout, process.stderr],
    cwd: "./"
    };
    
    var params = [
        testModule,
        "-a" + _url,
        "-u" + _user,
        "-p" + _pwd,
        "-t" + _test_num
    ];
    
    if (_ch_trace_flag)
        params.push("-chTrace");

    var child = child_process.spawn("node", params, opts);
    nproc++;
    
    var strPid = String(child.pid);
    var fstream = null;
    if (_log_to_files)
        fstream = fs.createWriteStream("log_" + strPid + ".log");

    child_processes[strPid] = { child: child, err: null, fstream: fstream };
    child.on("error", onChildError(strPid));
    child.on("exit", onChildExit(strPid));
    
    if (_log_to_files) {
        child.stdout.pipe(fstream);
        child.stderr.pipe(fstream);
    } else
        child.stdout.on("data", onChildStdOut(strPid));

    child.stderr.on("data", onChildStdErr(strPid));
};