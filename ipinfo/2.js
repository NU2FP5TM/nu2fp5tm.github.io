(async function generateImage() {
    const canvas = document.getElementById("outputCanvas");
    const ctx = canvas.getContext("2d");
  
    // 1. 背景图处理
    const bgImage = new Image();
    bgImage.crossOrigin = "Anonymous"; // 处理跨域
  
    let bgLoaded = false;
    await new Promise((resolve) => {
      bgImage.onload = () => {
        bgLoaded = true;
        resolve();
      };
      bgImage.onerror = () => {
        console.warn("⚠ 背景图加载失败，将使用默认背景");
        resolve();
      };
      bgImage.src = "xhxh.jpg"; // 确保路径正确
    });
  
    if (bgLoaded) {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  
    
  
    // 3. 获取地理/IP信息
    let ip = "未知", country = "未知", province = "未知", city = "未知";
    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        ip = data.ip || "未知";
        country = data.country_name || "未知";
        province = data.region || "未知";
        city = data.city || "未知";
    } catch (e) {
        console.error("获取 IP 信息失败：", e);
    }
  
    // 4. 获取浏览器信息
    const parser = new UAParser();
    const uaResult = parser.getResult();
    const os = uaResult.os.name || "未知";
    const browser = `${uaResult.browser.name || "未知"} ${uaResult.browser.version || ""}`;
  
    // 5. 当前日期
    const weekArray = ["日","一","二","三","四","五","六"];
    const today = new Date();
    const dateStr = `今天是 ${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日 星期${weekArray[today.getDay()]}`;
  
    // 6. 绘制信息文本
    ctx.fillStyle = "#39c5bb";
    ctx.font = "14px Kosefont-JP.ttf";
    ctx.fillText(`欢迎您来自 ${country}-${province}-${city} 的朋友`, 10, 50);
    ctx.fillText(dateStr, 10, 80);
    ctx.fillText(`您的IP是: ${ip}`, 10, 110);
    ctx.fillText(`操作系统: ${os}`, 10, 140);
    ctx.fillText(`浏览器: ${browser}`, 10, 170);
  
    // 7. 解码 GET 参数
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get("s");
    if (param) {
      const decoded = atob(param.replace(/ /g, "+"));
      ctx.fillStyle = "#333";
      ctx.font = "13px Microsoft YaHei";
      ctx.fillText(decoded, 10, 200);
    }
  
    // 8. 导出为 dataURL
    const dataURL = canvas.toDataURL("image/jpeg");
    console.log("🎉 图片生成成功:", dataURL);
  })();
  
