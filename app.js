require('dotenv').config();

// app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const {exec} = require('child_process')

// リクエストボディをパースするためのミドルウェア
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const {getChatGPTAnswer}  = require('./openai.js')

app.post('/execute', async (req, res)=>{
    const command = req.body.command;
    console.log(command)

    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.json({
                output:JSON.stringify(error)
            })
        }else if(stderr){
            res.json({
                output:JSON.stringify(stderr)
            })
        }else{
            res.json({
                output:JSON.stringify(stdout)
            })
        }
    });
})

// /chatgpt というルートに POST メソッドでアクセスしたときの処理
app.post('/chatgpt', async (req, res) => {
    // リクエストボディからパラメータを取得
    const messages = req.body.messages;

    try{
        const answer = await getChatGPTAnswer(messages)

        res.json({
            message: answer,
        })
    }catch(error){
        res.json({
            message: "ChatGPT 呼び出しに失敗しました:"+error,
        })
    }

});

// / というルートに GET メソッドでアクセスしたときの処理
app.get('/', (req, res) => {
    // index.html を送信する
    res.sendFile(path.join(__dirname, 'index.html'));
});

// サーバーを起動する
app.listen(3000, () => {
    console.log('Listening on port 3000');
});