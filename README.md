# EPO OPS WRAPPER
wrapper for EPO [OPS version 3.1](https://developers.epo.org) request.

# install
with [npm](https://www.npmjs.com/) do:

```
npm install --save EPO_OPS_WRAPPER
```

# usage
basic use

```js
var ops = require('EPO_OPS_WRAPPER')();
console.log(ops.request('GET', 'rest-services/published-data/search', { q: 'IC=A' }));
```

## require('EPO_OPS_WRAPPER')(opt)
| opt | type | description |
| --- | --- | --- |
| timeout | <code>Number</code> | http request timeout [default => 60000] |

## .config(opt)
| opt | type | description |
| --- | --- | --- |
| consumer_key | <code>String</code> | for registered user |
| consumer_secret | <code>String</code> | for registered user |

## .requesttmethod, relative_path, parameters)
| opt | type | description |
| --- | --- | --- |
| method | <code>String</code> | like GET, POST, etc |
| relative_path | <code>String</code> | https://ops.epo.org/3.1/[relative_path] like rest-services/published-data/search |
| parameters | <code>Object</code> | http request parameters |
