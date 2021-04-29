import express from 'express';
import { createEventAdapter } from '@slack/events-api';
import { createServer } from 'http';
import CONFIG from '../config/bot';
import indexRouter from './routes/index';

const app = express();
const slackEvents = createEventAdapter(CONFIG.SLACK_SIGNING_SECRET);

// 메시지 이벤트 구독하기
slackEvents.on('message', async (event) => {
  console.log(event);
});

// 메지지 이벤트 엔드포인트를 express 에 등록하기
app.use('/slack/events', slackEvents.requestListener());

app.use('/', indexRouter);

//
// app.get('/slack/message', async function(req, res, next) {
//   await axios.post(process.env.SLACK_WEBHOOK_URL, { "text": "월봉 마감이니 관망 유지 혹은 단타로 접근해보자!" })
//   res.send('ok');
// });

// express 웹 서버 실행
createServer(app).listen(4000, () => {
  console.log('run slack bot');
});
