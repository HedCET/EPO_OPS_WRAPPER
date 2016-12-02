# EPO OPS WRAPPER
wrapper for EPO [OPS version 3.1](https://developers.epo.org) request.

## FEATURE
* http SYNC request using fibers/future
* AUTO token expiry handler
* PROXY based request randomization

# install
with [npm](https://www.npmjs.com/) do:

```
npm install EPO_OPS_WRAPPER
```

# usage
basic example

```js
var ops = require('EPO_OPS_WRAPPER')();
console.log(ops.request('rest-services/published-data/search?q=IC%3DA'));
```

## require('EPO_OPS_WRAPPER')(opt)
constructor opt

| opt | type | description |
| --- | --- | --- |
| proxy_list | <code>Array</code> | format http://ip:port OR http://usename:password@ip:port |
| timeout | <code>Number</code> | http request timeout [default => 1000 * 60] |

example for random IP request

```js
var ops = require('EPO_OPS_WRAPPER')({
  proxy_list: ['http://ip:port', 'http://usename:password@ip:port'],
});
```

## .config(opt)
for access_token from EPO OPS

| opt | type | description |
| --- | --- | --- |
| consumer_key | <code>String</code> | for registered user |
| consumer_secret | <code>String</code> | for registered user |

example for registered user

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
EPO OPS service request

| opt | type | description |
| --- | --- | --- |
| relative_url | <code>String</code> | https://ops.epo.org/3.1/[relative_url] |
| method | <code>String</code> | default => GET |
| form | <code>Object</code> | for POST data |
