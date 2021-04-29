var express = require('express');
var router = express.Router();

var axios = require('axios');
const schedule = require('node-schedule');

const upbitApi = require('../src/api/upbit');
const slackApi = require('../src/api/slack');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const { data } = await axios.get('https://project-team.upbit.com/api/v1/disclosure?region=kr&per_page=20')
  console.log('--------------------------')
  console.log(data.data.posts);
  console.log('--------------------------')
  res.render('index', { title: 'Express' });
});

router.get('/coin', async function(req, res, next) {
  // const blocks = [
  //   {
  //     "type": "header",
  //     "text": {
  //       "type": "plain_text",
  //       "text": "New request"
  //     }
  //   },
  //   {
  //     "type": "section",
  //     "fields": [
  //       {
  //         "type": "mrkdwn",
  //         "text": "*Type:*\nPaid Time Off"
  //       },
  //       {
  //         "type": "mrkdwn",
  //         "text": "*Created by:*\n<example.com|Fred Enriquez>"
  //       }
  //     ]
  //   },
  //   {
  //     "type": "section",
  //     "fields": [
  //       {
  //         "type": "mrkdwn",
  //         "text": "*When:*\nAug 10 - Aug 13"
  //       }
  //     ]
  //   },
  //   {
  //     "type": "section",
  //     "text": {
  //       "type": "mrkdwn",
  //       "text": "<https://example.com|View request>"
  //     }
  //   }
  // ]
  //
  // const { data } = await upbitApi.get('/v1/accounts');
  //
  // console.log(data)

  // const job = schedule.scheduleJob('*/5 * * * * *', async function(){
  //   await axios.post(process.env.SLACK_WEBHOOK_URL, { "text": "Hello, World!", blocks })
  //   console.log('The answer to life, the universe, and everything!');
  // });
  await axios.post(process.env.SLACK_WEBHOOK_URL, { "text": "공부해라 옹박!!!!" })
  res.send('ok');
});

router.get('/my/accounts', async function(req, res, next) {
  try {
    const { data } = await upbitApi.get('/v1/accounts');

    const assets = await Promise.all(data.map(async asset => {
      if (!Number(asset.avg_buy_price)) {
        return null;
      }

      const pricesRes = await upbitApi.get('/v1/trades/ticks', {
        params: {
          count: 1,
          market: `KRW-${asset.currency}`
        }
      });

      const currentPrice = pricesRes.data[0].trade_price.toLocaleString();

      return {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": `*종목:* ${asset.currency}`
          },
          {
            "type": "mrkdwn",
            "text": `*현재가:* ${currentPrice}원`
          },
        ]
      }
    }))

    console.log(assets[1].fields)

    const blocks = [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "종목 현황"
        }
      },
      ...assets.filter(asset => asset)
    ]

    // const job = schedule.scheduleJob('*/5 * * * * *', async function(){
    //   await axios.post(process.env.SLACK_WEBHOOK_URL, { "text": "Hello, World!", blocks })
    //   console.log('The answer to life, the universe, and everything!');
    // });

    await axios.post(process.env.SLACK_WEBHOOK_URL, { blocks })

    res.send('ok');
  } catch (e) {
    // console.log(e.request)
    next(e);
  }

});

module.exports = router;
