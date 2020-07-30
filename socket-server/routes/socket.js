var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/getWaitingList', function (req, res, next) {
  console.log('req',req.app.get('waitingList'));
  let body = {
    code: 1,
    data:{
      waitingList: req.app.get('waitingList'),
    },
    message:'请求成功'
  }
	res.send(body)
});

module.exports = router;
