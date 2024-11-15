// 加密后的 API Key
const encryptedKey = "U2FsdGVkX186HiIbMmnoR1pLRjt5LCkqG4in3IPavBeDto+Ai4iETJk+rYaMi/VbcB1+wFHf4K1DElw6ejy2t9YEEqiyJpaw8nnUYiEuegI="; // 替换为你的加密密文

document.getElementById("loginButton").addEventListener("click", () => {
    const password = document.getElementById("password").value;

    try {
        // 解密 API Key
        const bytes = CryptoJS.AES.decrypt(encryptedKey, password);
        const apiKey = bytes.toString(CryptoJS.enc.Utf8);

        if (!apiKey) {
            throw new Error("密码错误或解密失败");
        }

        // 存储解密后的 API Key
        sessionStorage.setItem("apiKey", apiKey);

        // 显示聊天部分，隐藏登录部分
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("chatSection").style.display = "block";

        console.log("解密成功，API Key 已存储！");
    } catch (error) {
        alert("解密失败，请检查密码！");
        console.error("Error during decryption:", error);
    }
});

// 提问逻辑
document.getElementById("askButton").addEventListener("click", async () => {
    const apiKey = sessionStorage.getItem("apiKey");
    const userInput = document.getElementById("userInput").value;

    if (!apiKey) {
        alert("API Key 未解密，请重新登录！");
        return;
    }

    if (!userInput) {
        alert("请输入问题！");
        return;
    }

    try {
        // 调用 OpenAI API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    {
                        role: "user",
                        content: userInput,
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const answer = data.choices[0].message.content;

        // 显示回答
        document.getElementById("result").innerText = `回答：\n${answer}`;
    } catch (error) {
        console.error("Error during API call:", error);
        document.getElementById("result").innerText = "无法获取回答，请稍后再试。";
    }
});