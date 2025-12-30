// script/result.js
(() => {
  const scores = safeParse(localStorage.getItem("ria_scores"));

  const titleEl = document.getElementById("resultTitle");
  const imgEl = document.getElementById("resultImg");
  const scoreEl = document.getElementById("scoreList");
  const restartBtn = document.getElementById("restartBtn");
  const shareBtn = document.getElementById("shareBtn");
  const shareHint = document.getElementById("shareHint");

  if (!scores || typeof scores !== "object") {
    titleEl.textContent = "ไม่พบผลลัพธ์ (อาจเข้าหน้านี้ตรง ๆ หรือข้อมูลถูกล้างไปแล้ว)";
    if (imgEl) imgEl.removeAttribute("src");
    if (scoreEl) scoreEl.textContent = "";
    if (shareBtn) shareBtn.disabled = true;
    return;
  }

  const ORDER = ["dolphin", "jellyfish", "shark", "fish", "squid", "orca", "turtle"]; // ปรับได้ตามต้องการ

  const entries = Object.entries(scores)
    .filter(([, v]) => Number.isFinite(v))
    .sort((a, b) => {
      const diff = (b[1] ?? 0) - (a[1] ?? 0);
      if (diff !== 0) return diff;
      
      return ORDER.indexOf(a[0]) - ORDER.indexOf(b[0]);
    });

  const topScore = entries[0]?.[1] ?? 0;
  const winners = entries.filter(([, s]) => s === topScore).map(([k]) => k);

  const picked =
    winners.length >= 4 ? "turtle" :
    winners.length >= 2 ? winners[0] :
    winners[0] || "turtle";

  
  const RESULT = {
    shark: {
      title: "ฉลามนักล่าผู้มั่นคงแห่งสายน้ำ",
      displayImg: "pic/result/reShark.png",
      shareImg: "pic/share/shareShark.png",
    },
    dolphin: {
      title: "โลมาผู้เปี่ยมไมตรีท้องทะเล",
      displayImg: "pic/result/reDolphin.png",
      shareImg: "pic/share/shareDolphin.png",
    },
    jellyfish: {
      title: "แมงกะพรุนผู้ร่ายระบำแห่งฝันและแสง",
      displayImg: "pic/result/reJellyfish.png",
      shareImg: "pic/share/shareJellyfish.png",
    },
    fish: {
      title: "ปลาการ์ตูนผู้พิทักษ์แห่งระเบียบ",
      displayImg: "pic/result/reFish.png",
      shareImg: "pic/share/shareFish.png",
    },
    squid: {
      title: "หมึกนักปราชญ์แห่งเงามืด",
      displayImg: "pic/result/reSquid.png",
      shareImg: "pic/share/shareSquid.png",
    },
    orca: {
      title: "วาฬเพชรฆาตผู้นำแห่งท้องน้ำลึก",
      displayImg: "pic/result/reOrca.png",
      shareImg: "pic/share/shareOrca.png",
    },
    turtle: {
      title: "เต่าทะเลผู้ประสานคลื่นทั้งหก",
      displayImg: "pic/result/reTurtle.png",
      shareImg: "pic/share/shareTurtle.png",
    },
  };

  const data = RESULT[picked] || RESULT.orca;

  
  titleEl.textContent = `คลื่นของคุณคือ: ${data.title}`;
  imgEl.src = data.displayImg;
  imgEl.alt = data.title;

  
  if (scoreEl) {
    scoreEl.textContent = entries.map(([k, s]) => `${k} = ${s}`).join("\n");
  }

  restartBtn?.addEventListener("click", () => {
    localStorage.removeItem("ria_scores");
    localStorage.removeItem("ria_answers");
    window.location.href = "index.html";
  });

  // แชร์เป็น "รูปแชร์" (shareImg)
  shareBtn?.addEventListener("click", async () => {
    try {
      shareHint.textContent = "";

      const file = await fetchAsFile(data.shareImg, `BD-RIASEC-${picked}.png`);

      
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "BD RIASEC",
          text: `ผลของฉันคือ: ${data.title}`,
          files: [file],
        });
        shareHint.textContent = "ขอบคุณที่เข้ามาร่วมเล่นนะคะ 🙏✅";
        
        return;
      }

     
      downloadFile(file);
      shareHint.textContent = "อุปกรณ์นี้แชร์ไฟล์ตรง ๆ ไม่ได้ เลยดาวน์โหลดรูปให้แทน ✅";
    } catch (err) {
      console.error(err);
      shareHint.textContent = "แชร์ไม่สำเร็จ ลองใหม่อีกครั้ง หรือเช็กว่าไฟล์รูปอยู่ถูก path ไหม";
    }
  });

  function safeParse(str) {
    try { return JSON.parse(str); } catch { return null; }
  }

  async function fetchAsFile(url, filename) {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`โหลดรูปไม่สำเร็จ: ${url}`);
    const blob = await res.blob();
    const type = blob.type || "image/png";
    return new File([blob], filename, { type });
  }

  function downloadFile(file) {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
})();
