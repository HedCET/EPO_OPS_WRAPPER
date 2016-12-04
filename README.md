# EPO OPS WRAPPER
wrapper for EPO [OPS version 3.1](https://developers.epo.org) request.

### FEATURE
* http SYNC requesting using fibers/future
* proxy based request randomization
* automatic token expiry handler

# install
with [npm](https://www.npmjs.com/package/EPO_OPS_WRAPPER) do:

```
npm install EPO_OPS_WRAPPER
```

# usage
for checking ```IPC=A[q=IC%3DA]``` details

```js
var ops = require('EPO_OPS_WRAPPER')();
console.log(ops.request('rest-services/published-data/search?q=IC%3DA'));
```

### require('EPO_OPS_WRAPPER')(opt)
@return APP[Object]

| opt | type | description |
| --- | --- | --- |
| proxy_list | <code>Array of String</code> | [optional] format http://ip:port OR http://usename:password@ip:port |
| timeout | <code>Number</code> | [optional] timeout for http request [default => 1000 * 60] |

```js
var ops = require('EPO_OPS_WRAPPER')({
  proxy_list: ['http://ip:port', 'http://usename:password@ip:port'],
  timeout: 1000 * 30,
});
```

### .signIn(opt)
for consumer_key & consumer_secret based signIn, all ```.request()``` call after this use access_token if it success

| opt | type | description |
| --- | --- | --- |
| consumer_key | <code>String</code> | for registered user |
| consumer_secret | <code>String</code> | for registered user |

@return true if it success, otherwise null with console.log(error)

```js
{
,,,
  access_token: [String],
  application_name: [String],
  client_id: [String],
  'developer.email': 'linto.cet@gmail.com',
  expires_in: '1200',
  issued_at: moment().format('x'),
  status: 'approved',
  token_type: 'BearerToken',
,,,
}
```

this package automatically handle access_token expiry

```js
var ops = require('EPO_OPS_WRAPPER')({
  proxy_list: ['http://ip:port', 'http://usename:password@ip:port'],
});

console.log(ops.signIn({
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
