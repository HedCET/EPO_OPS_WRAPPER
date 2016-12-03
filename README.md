# EPO OPS WRAPPER
wrapper for EPO [OPS version 3.1](https://developers.epo.org) request.

### FEATURE
* http SYNC request using fibers/future
* AUTO token expiry handler
* PROXY based request randomization

# install
with [npm](https://www.npmjs.com/package/EPO_OPS_WRAPPER) do:

```
npm install EPO_OPS_WRAPPER
```

# usage
minimum example

```js
var ops = require('EPO_OPS_WRAPPER')();
console.log(ops.request('rest-services/published-data/search?q=IC%3DA'));
```

### require('EPO_OPS_WRAPPER')(opt)
@return APP[Object] with config[function] & request[function]

| opt | type | description |
| --- | --- | --- |
| proxy_list | <code>Array</code> | [optional] format http://ip:port OR http://usename:password@ip:port |
| timeout | <code>Number</code> | [optional] timeout for http request [default => 1000 * 60] |


example for random IP request, we r using ```_.sample()``` for randomizing


```js
var ops = require('EPO_OPS_WRAPPER')({
  proxy_list: ['http://ip:port', 'http://usename:password@ip:port'],
});
```

### .config(opt)
for registering consumer_key & consumer_secret, all ```request()``` after this use consumer access_token if it success

| opt | type | description |
| --- | --- | --- |
| consumer_key | <code>String</code> | for registered user |
| consumer_secret | <code>String</code> | for registered user |
| proxy_list | <code>Array</code> | [optional] format http://ip:port OR http://usename:password@ip:port |
| timeout | <code>Number</code> | [optional] timeout for http request [default => 1000 * 60] |


@return config[Object] if it success, otherwise null with console.log(error)


```js
{ timeout: 60000,
  proxy_list: ['http://ip:port'],
  consumer_key: '12345',
  consumer_secret: '123',
  'developer.email': 'linto.cet@gmail.com',
  token_type: 'BearerToken',
  issued_at: moment().format('x'),
  client_id: [String],
  access_token: [String],
  application_name: [String],
  expires_in: '1200',
  status: 'approved' }
```


this package automatically handle access_token expiry based on ```issued_at``` & ```expires_in```


```js
var ops = require('EPO_OPS_WRAPPER')({
  proxy_list: ['http://ip:port', 'http://usename:password@ip:port'],
});

console.log(ops.config({
  consumer_key: '12345',
  consumer_secret: '123',
}));
console.log(ops.request('rest-services/published-data/search?q=IC%3DA'));
```

## .request(relative_url, method, form)
EPO OPS service SYNC http request, @return [Object]

| opt | type | description |
| --- | --- | --- |
| relative_url | <code>String</code> | https://ops.epo.org/3.1/[relative_url] |
| method | <code>String</code> | default => GET |
| form | <code>Object</code> | for POST data |
