const AV = require('leanengine');
const qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = '';
qiniu.conf.SECRET_KEY = '';
/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request, response) {
  response.success('Hello world!');
});

AV.Cloud.define('genUpToken', function(req, res) {
  const bucket = req && req.params['bucket'] ? req.params['bucket'] : 'cloud-printer',
      putPolicy = new qiniu.rs.PutPolicy(bucket);
  //putPolicy.callbackUrl = callbackUrl;
  //putPolicy.callbackBody = callbackBody;
  //putPolicy.returnUrl = returnUrl;
  //putPolicy.returnBody = returnBody;
  //putPolicy.asyncOps = asyncOps;
  //putPolicy.expires = expires;
  const aToken = putPolicy.token();
  return res.success(aToken);
});

