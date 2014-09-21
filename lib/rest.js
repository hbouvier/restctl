module.exports = function () {

    function REST(config) {
        var $this = this;
        config.logger.log('debug', 'restctl::config=', config, config.meta);
            
        this.http    = require('http');
        this.config  = config;
        this.meta    = config.meta;
        this.version = config.version;
        this.logger  = config.logger;
        this.context = config.context;
        this.url     = config.rest_url.split(',').map(function (url) {
          var tuple = url.split(':');
          return {
              proto : tuple[0],           // http
              host  : tuple[1].substr(2), // 127.0.0.1
              port  : tuple[2]            // 8053
          };
        })[0];
        this.logger.log('debug', 'restctl::url=', this.url, this.meta);
    }

    REST.prototype.get = function (path, next) {
      var $this = this,
          options = {
          'method'  : 'GET',
          'host'    : $this.url.host,
          'port'    : $this.url.port,
          'path'    : $this.context + path,
          'headers' : {
                        'User-Agent'     : 'restctl-' + $this.version
          }
        };

      $this.logger.log('debug', 'REST:GET|options=%j', options, $this.meta);
      var req = $this.http.request(options, function(res) {
        var data = '';
        $this.logger.log('debug', 'REST:GET|options=%j|code=%s', options, res.statusCode, $this.meta);
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
          data += chunk;
        });
        res.on('end', function() {
          if (next)
            next(null, {res:res, data:data});
        });
      });

      req.on('error', function(err) {
        $this.logger.log('error', 'REST:GET|options=%j|error=%s|err=%j', options, err, err, $this.meta);
        if (next)
          next(err, {res:{statusCode:500,headers:{}},data:null});
        });
        req.end();
    };

    REST.prototype.put = function (path, body, next) {
      var $this = this,
          options = {
          'method'  : 'PUT',
          'host'    : $this.url.host,
          'port'    : $this.url.port,
          'path'    : $this.context + path,
          'headers' : {
                        'User-Agent'     : 'restctl-' + $this.version,
                        'Content-Type'   : $this.config['content-type'],
                        'Content-Length' : Buffer.byteLength(body),
          }
        };
      var req = $this.http.request(options, function(res) {
        var data = '';
        $this.logger.log('debug', 'REST:PUT|options=%j|body=%j|code=%s', options, body, res.statusCode, $this.meta);
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
          data += chunk;
        });
        res.on('end', function() {
          if (next)
            next(null, {res:res, data:data});
        });
      });

      req.on('error', function(err) {
        $this.logger.log('error', 'REST:PUT|options=%j|body=%j|error=%s|err=%j', options, body,err, err, $this.meta);
        if (next)
          next(err, {res:{statusCode:500,headers:{}},data:null});
      });
      req.end(body);
    };

    REST.prototype.post = function (path, body, next) {
      var $this = this,
          options = {
          'method'  : 'POST',
          'host'    : $this.url.host,
          'port'    : $this.url.port,
          'path'    : $this.context + path,
          'headers' : {
                        'User-Agent'     : 'restctl-' + $this.version,
                        'Content-Type'   : $this.config['content-type'],
                        'Content-Length' : Buffer.byteLength(body),
          }
        };
      var req = $this.http.request(options, function(res) {
        var data = '';
        $this.logger.log('debug', 'REST:POST|options=%j|body=%j|code=%s', options, body, res.statusCode, $this.meta);
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
          data += chunk;
        });
        res.on('end', function() {
          if (next)
            next(null, {res:res, data:data});
        });
      });

      req.on('error', function(err) {
        $this.logger.log('error', 'REST:POST|options=%j|body=%j|error=%s|err=%j', options, body,err, err, $this.meta);
        if (next)
          next(err, {res:{statusCode:500,headers:{}},data:null});
      });
      req.end(body);
    };

    REST.prototype.delete = function (path, next) {
      var $this = this,
          options = {
          'method'  : 'DELETE',
          'host'    : $this.url.host,
          'port'    : $this.url.port,
          'path'    : $this.context + path,
          'headers' : {
                        'User-Agent'     : 'restctl-' + $this.version
          }
        };

      $this.logger.log('debug', 'REST:DELETE|options=%j', options, $this.meta);
      var req = $this.http.request(options, function(res) {
        var data = '';
        $this.logger.log('debug', 'REST:DELETE|options=%j|code=%s', options, res.statusCode, $this.meta);
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
          data += chunk;
        });
        res.on('end', function() {
          if (next)
            next(null, {res:res, data:data});
        });
      });

      req.on('error', function(err) {
        $this.logger.log('error', 'REST:DELETE|options=%j|error=%s|err=%j', options, err, err, $this.meta);
        if (next)
          next(err, {res:{statusCode:500,headers:{}},data:null});
        });
        req.end();
    };

    function create(config) {
        return new REST(config);
    }

    return {
        create : create
    };
}();
