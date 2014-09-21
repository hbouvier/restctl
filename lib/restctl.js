module.exports = function () {

    function exitWithHttpCode(res) {
        var code;

        // 201 Created, 202 Accepted, 204 No Content, ...
        if (res.statusCode >= 200 && res.statusCode <= 299)
            code = 0;
        // 302 Found, 304 Not modifed, ...
        else if (res.statusCode >= 300 && res.statusCode <= 399)
            code = 0;
        // 400 Bad request, 404 Not found, 405 Method Not Allowed, ...
        else if (res.statusCode >= 400 && res.statusCode <= 499)
            code = 1;
        // 500 Internal Server Error, 501 Not implemented, ...
        else if (res.statusCode >= 500 && res.statusCode <= 599)
            code = -1;
        else
            code = -2;
        process.exit(code);
    }
    function usage(msg) {
        if (msg)
            console.log(msg);
        console.log("USAGE: restctl [get <path> | delete <path> | put <path> <value> | post <path> <value> {<value x} <value ...>}");
        process.exit(-10)
    }


    function RestCtl(config) {
        var $this = this;
        this.config  = config;
        this.meta    = config.meta;
        this.version = config.version;
        this.logger  = config.logger;
        this.rest    = require('./rest').create(config);
    }

    RestCtl.prototype.exec = function (options) {
        var $this = this,
            args  = options.args;

        switch (options.args[0]) {
            case "version":
                console.log('Version ', $this.version);
                process.exit(0);
                break;
            case "get":
                if (options.args.length !== 2)
                    usage();
                $this.get(options.args[1]);
                break;
            case "post":
                if (options.args.length < 3)
                    usage();
                $this.post(options.args[1], options.args.slice(2));
                break;
            case "put":
                if (options.args.length !== 3)
                    usage();
                $this.put(options.args[1], options.args[2]);
                break;
            case "delete":
                if (options.args.length !== 2)
                    usage();
                $this.del(options.args[1]);
                break;
            case "help":
                usage();
                break;
            default:
                usage("Unknow command '" + options.args[0] +"'");
                break;
        }
    };

    RestCtl.prototype.get = function (path) {
        var $this = this;
        $this.rest.get(path, function (err, results) {
            if (err) {
                $this.logger.log('error', 'restctl::get|path=%s', path, $this.meta);
            } else {
                console.log(results.data);
            }
            exitWithHttpCode(results.res);
        });
    };

    RestCtl.prototype.post = function (path, values) {
        var $this  = this;
        values.forEach(function (value) {
            $this.rest.post(path, value, function (err, results) {
                if (err) {
                    $this.logger.log('error', 'restctl::post|path=%s|value=%j', path, value, $this.meta);
                } else {
                    var uuid = results.res.headers['x-tomahawk-key'];
                    if (typeof(uuid) === 'undefined')
                        console.log(results.data);
                    else
                        console.log(uuid);
                }
                exitWithHttpCode(results.res);
            });
        });
    };

    RestCtl.prototype.put = function (path, value) {
        var $this  = this;
        $this.rest.put(path, value, function (err, results) {
            if (err) {
                $this.logger.log('error', 'restctl::put|path=%s|value=%j', path, value, $this.meta);
            } else {
                console.log(results.data);
            }
            exitWithHttpCode(results.res);
        });
    };

    RestCtl.prototype.del = function (path) {
        var $this = this;
        $this.rest.delete(path, function (err, results) {
            if (err) {
                $this.logger.log('error', 'restctl::delete|path=%s', path, $this.meta);
            } else {
                console.log(results.data);
            }
            exitWithHttpCode(results.res);
        });
    };

    function create(config) {
        return new RestCtl(config);
    }

    return {
        create : create
    };
}();
