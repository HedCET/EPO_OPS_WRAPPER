var _ = require('underscore'),
  future = require('fibers/future'),
  moment = require('moment'),
  request = require('request');

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
 * @param [String] relative_url => https://ops.epo.org/3.1/[relative_url]
 * @param [String] method => npm:request.method
 * @param [Object] form => npm:request.form
 *
 * @return [Object]
 */

app.request = function(relative_url, method, form) {
  var f = new future,
    opt = {
      form: (form ? form : {}),
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0',
      },
      method: (method ? method : 'GET'),
      // proxy: '',
      timeout: config.timeout,
      url: 'https://ops.epo.org/3.1/' + (relative_url ? relative_url : ''),
    };

  if (config.consumer_key && config.consumer_secret && config.expires_in && config.issued_at && +moment(config.issued_at, ['x']).format('X') + (+config.expires_in) - 60 < +moment().format('X')) {
    this.config();
  }

  if (config.access_token) {
    opt.headers.Authorization = 'Bearer ' + config.access_token;
  } else {
    if (config.consumer_key && config.consumer_secret) {
      opt.headers.Authorization = 'Basic ' + base64_encode(config.consumer_key + ':' + config.consumer_secret);
    }
  }

  request(opt, function(error, res, body) {
    if (error) {
      f.return({ error: error });
    } else {
      try {
        if (res.statusCode == 200) {
          f.return(JSON.parse(body));
        } else {
          f.return({ error: body });
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

  if (config.consumer_key && config.consumer_secret) {
    var res = this.request('auth/accesstoken', 'POST', { grant_type: 'client_credentials' })

    if (res.error) {
      console.log('[EPO_OPS_WRAPPER]', res.error);

      return null;
    } else {
      config = _.extend(config, res);

      return config;
    }
  } else {
    console.log('[EPO_OPS_WRAPPER]', 'required consumer_key & consumer_secret');

    return null;
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
