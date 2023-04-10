const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


async function getChatGPTAnswer(messages) {

    let chatgpt_messages = messages.map((obj)=>{
        const role = obj.by;
        const content = obj.message;
        return { role: role, content: content}
    })

    const system_prompt_ja=`あなたはIT運用プロフェッショナルとして、${process.env.YOUR_OS}のOSマシンを管理してます。
    もしOS側のコマンドを実行する必要があるときは、回答末尾に以下の形で**即実行可能**なコマンド候補を１つだけ返してください。
    CHATGPT_OS_COMMAND:コマンド
    **コマンドはクォーテーションやダブルクォーテーションで囲まないでください**
    **Windowsの場合、PowerShellは使えません、コマンドプロンプトだけでの作業となります**
    **コマンドを提示する場合は、回答の最後に、CHATGPT_OS_COMMANDを必ずつけてください**
    **コマンドを提示する必要がない場合は、CHATGPT_OS_COMMANDは絶対につけないでください。**
    `

    const system_prompt_en=`You manage ${process.env.YOUR_OS} machine as IT Ops professional.
    If you need to execute OS command to respond to user request, please return only one executable command.
    A command MUST BE below.
    CHATGPT_OS_COMMAND:**A command you recommend to execute**
    Constraints
     - You CANNOT mention about GUI operation.
     - **You CANNOT use Powershell Command like Get-xx if you manage Windows OS.**
     - **"CHATGPT_OS_COMMAND:A command" reccomendation MUSB BE the end of your reply if command needed.**
     - Your replay must be in Japanese.

    User) How about machine's memory?
    You) CHATGPT_OS_COMMAND:wmic ComputerSystem get TotalPhysicalMemory
    `

    const system_prompt = system_prompt_en

    chatgpt_messages.unshift({ role: "system", content: system_prompt})

    console.log(chatgpt_messages);

    // OpenAIのAPIに問い合わせる
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chatgpt_messages,
        temperature: 0.5,
    });
    const response = completion.data.choices[0].message.content
    return response
}

// モジュールとしてエクスポートする
module.exports = {getChatGPTAnswer};