import express from 'express';
import { createEventAdapter } from '@slack/events-api';
import { createServer } from 'http';
import CONFIG from '../config/bot';
import indexRouter from './routes/index';
import mongoose from 'mongoose';

const app = express();
const slackEvents = createEventAdapter(CONFIG.SLACK_SIGNING_SECRET);
const db = mongoose.connection;

mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

db.on('error', () => {
    console.log('db connection error');
});
db.once('open', () => {
    console.log('db connected');
});

// 메시지 이벤트 구독하기
slackEvents.on('message', async (event) => {
    console.log(event);
});

app.use('/', indexRouter);
// 메지지 이벤트 엔드포인트를 express 에 등록하기
app.use('/slack/events', slackEvents.requestListener());

//
// app.get('/slack/message', async function(req, res, next) {
//   await axios.post(process.env.SLACK_WEBHOOK_URL, { "text": "월봉 마감이니 관망 유지 혹은 단타로 접근해보자!" })
//   res.send('ok');
// });

// express 웹 서버 실행
<<<<<<< HEAD
createServer(app).listen(3000, () => {
  console.log('run slack bot');
});
