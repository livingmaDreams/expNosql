const express = require('express');
const router = express.Router();

const controller = require('../controllers/signup.js');
const downloadController = require('../controllers/download');
const userAuthenticate = require('../middleware/authenticate');

router.get('/',controller.getHomePage);
router.get('/daily/:page',userAuthenticate.authenticate,controller.getDailyExpenses);
router.post('/daily',userAuthenticate.authenticate,controller.postDailyExpenses);
router.post('/daily/edit',userAuthenticate.authenticate,controller.editExpenses);
 router.post('/daily/delete',userAuthenticate.authenticate,controller.delExpense);
router.get('/leadership',controller.getLeadershipRank);
 router.get('/monthly/:page',userAuthenticate.authenticate,controller.getMonthlyExpenses);
router.get('/yearly/:page',userAuthenticate.authenticate,controller.getYearlyExpenses);



module.exports = router;