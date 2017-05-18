"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var http = require("http");
var route = function (name, fixedBegin, fixedEnd) {
    if (fixedBegin === void 0) { fixedBegin = true; }
    if (fixedEnd === void 0) { fixedEnd = true; }
    return function (_a) {
        var url = _a.req.url;
        var nameStep1 = fixedBegin ? "^" + name : name;
        var preparedName = fixedEnd ? nameStep1 + "$" : nameStep1;
        var routeRexex = new RegExp(preparedName, 'i');
        if (url !== undefined) {
            return url.match(routeRexex) !== null;
        }
        else {
            return false;
        }
    };
};
var requests_ = new rxjs_1.Subject();
var routeSinks = [
    requests_
        .filter(route('/foo'))["do"](function (e) {
        e.res.writeHead(200, { 'Content-Type': 'text/plain' });
        e.res.end('FOOBAR\n');
    }),
    requests_["do"](function (e) { return console.log('request to', e.req.url); })
];
rxjs_1.Observable
    .merge.apply(rxjs_1.Observable, routeSinks).subscribe(function (e) {
    if (!e.res.finished) {
        e.res.writeHead(404, { 'Content-Type': 'text/plain' });
        e.res.end('You found an unhandled route\n');
    }
});
var hostname = '127.0.0.1';
var port = 1337;
http.createServer(function (req, res) {
    requests_.next({ req: req, res: res });
})
    .listen(port, hostname, function () {
    console.log("Server running at http://" + hostname + ":" + port + "/");
});
