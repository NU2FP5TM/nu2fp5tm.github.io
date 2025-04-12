// 背景图自适应绘制函数（类似 CSS 的 background-size: cover）
function drawCoverImage(ctx, img, canvasWidth, canvasHeight) {
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

    if (imgRatio > canvasRatio) {
        drawHeight = canvasHeight;
        drawWidth = img.width * (canvasHeight / img.height);
        offsetX = (canvasWidth - drawWidth) / 2;
    } else {
        drawWidth = canvasWidth;
        drawHeight = img.height * (canvasWidth / img.width);
        offsetY = (canvasHeight - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

async function generateImage() {
    const canvas = document.getElementById("outputCanvas");
    const ctx = canvas.getContext("2d");

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 加载背景图
    const bgImage = new Image();
    bgImage.crossOrigin = "Anonymous";
    await new Promise((resolve) => {
        bgImage.onload = resolve;
        bgImage.onerror = () => {
            console.error("背景图加载失败！");
            ctx.fillStyle = "#f0f0f0";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            resolve();
        };
        bgImage.src = "xhxh.jpg"; // 替换为你的图片路径
    });

    // 画背景图
    drawCoverImage(ctx, bgImage, canvas.width, canvas.height);

    // 获取 IP 信息
    let ip = "未知", country = "未知", province = "未知", city = "未知";
    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        ip = data.ip || "未知";
        country = data.country_name || "未知";
        province = data.region || "未知";
        city = data.city || "未知";
    } catch (e) {
        console.error("IP 获取失败", e);
    }

    // UA 信息
    const parser = new UAParser();
    const uaResult = parser.getResult();
    const os = uaResult.os.name || "未知";
    const browser = `${uaResult.browser.name} ${uaResult.browser.version}` || "未知";

    // 日期
    const weekArray = ["日", "一", "二", "三", "四", "五", "六"];
    const today = new Date();
    const dateStr = `今天是 ${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 星期${weekArray[today.getDay()]}`;

    // 设置字体样式
    ctx.fillStyle = "black";
    ctx.font = "18px 'Kosefont-JP'"; // 使用自定义字体

    // 绘制文本
    ctx.fillText(`欢迎您来自 ${country}-${province}-${city} 的朋友`, 10, 40);
    ctx.fillText(dateStr, 10, 72);
    ctx.fillText(`您的IP是: ${ip}`, 10, 104);
    ctx.fillText(`您使用的是 ${os} 操作系统`, 10, 140);
    ctx.fillText(`您使用的是 ${browser}`, 10, 175);

    // 解析 GET 参数
    const urlParams = new URLSearchParams(window.location.search);
    const getParam = urlParams.get("s");
    if (getParam) {
        const decodedText = atob(getParam.replace(/ /g, "+"));
        ctx.font = "15px 'MyFont'";
        ctx.fillText(decodedText, 10, 210);
    }

    const dataURL = canvas.toDataURL("image/jpeg");
    console.log("图片生成成功:", dataURL);
}

// 等字体加载完再执行
document.fonts.ready.then(() => {
    generateImage();
});
