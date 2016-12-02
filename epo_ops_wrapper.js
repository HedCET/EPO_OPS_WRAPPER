var _ = require('underscore'),
  future = require('fibers/future'),
  httpreq = require('httpreq'),
  moment = require('moment');

var app = {},
  config = {
    timeout: 1000 * 60,
  };

/**
 * base64_encode(input) => Base64 encoding
 *
 * @param [String] input
 *
 * @return [String]
 */

function base64_encode(input) {
  return new Buffer(input, 'utf8').toString('base64');
}

/**
 * request(method, relative_path, parameters) => http requesting
 *
 * @param [String] method
 * @param [String] relative_path => https://ops.epo.org/3.1[relative_path]
 * @param [Object] parameters
 *
 * @return [Object]
 */

app.request = function(method, relative_path, parameters) {
  var f = new future,
    opt = {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0',
      },
      method: method,
      timeout: config.timeout,
      parameters: parameters,
      url: 'https://ops.epo.org/3.1' + relative_path,
    };

  if (config.consumer_key && config.consumer_secret && config.expires_in && config.issued_at && +moment(config.issued_at, ['x']).format('X') + (+config.expires_in) - 120 < +moment().format('X')) {
    this.config();
  }

  if (config.access_token) {
    opt.headers.Authorization = 'Bearer ' + config.access_token;
  } else {
    if (config.consumer_key && config.consumer_secret) {
      opt.headers.Authorization = 'Basic ' + base64_encode(config.consumer_key + ':' + config.consumer_secret);
    }
  }

  httpreq.doRequest(opt, function(error, res) {
    if (error) {
      f.return({ error: error });
    } else {
      try {
        if (res.statusCode == 200) {
          f.return(JSON.parse(res.body));
        } else {
          f.return({ error: res.body });
        }
      } catch (error) {
        f.return({ error: error });
      }
    }
  });

  return f.wait();
}

/**
 * config() => configuring
 *
 * @param [Object] opt => {consumer_key: [String], consumer_secret: [String]}
 *
 * @return [Object]
 */

app.config = function(opt) {
  if (opt) {
    config = _.extend(config, opt);
  }

  var res = this.request('POST', '/auth/accesstoken', { grant_type: 'client_credentials' })

  if (res.error) {
    console.log('[ClayIP_OPS]', res.error);

    return null;
  } else {
    config = _.extend(config, res);

    return config;
  }
};

/** 
 * {consumer_key: [String], consumer_secret: [String]}
 */

module.exports = function(opt) {
  if (opt) {
    config = _.extend(config, opt);
  }

  return app;
};
