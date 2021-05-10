import WebSocket from 'ws';

const upbitWs = new WebSocket(process.env.UPBIT_WEBSOCKET_SERVRER_URL, {
    perMessageDeflate: false,
});

upbitWs.on('open', () => {
    console.log('open');
    const testMessage = [
        {
            ticket: 'TEST',
        },

        {
            type: 'ticker',

            codes: ['KRW-BTC'],
        },
    ];

    // upbitWs.send(JSON.stringify(testMessage));
});

upbitWs.on('message', (message) => {
    console.log('message', JSON.parse(message));
});
