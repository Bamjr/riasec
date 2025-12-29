// result.js
(() => {
  const scores = safeParse(localStorage.getItem("ria_scores"));
  const mainEl = document.getElementById("mainResult");
  const scoreEl = document.getElementById("scoreList");
  const restartBtn = document.getElementById("restartBtn");

  if (!scores) {
    mainEl.textContent = "ไม่พบผลลัพธ์ (อาจเข้าหน้านี้ตรง ๆ หรือข้อมูลถูกล้างไปแล้ว)";
    scoreEl.textContent = "";
    return;
  }

  const LABELS = {
    dolphin: "🐬 Dolphin",
    jellyfish: "🪼 Jellyfish",
    shark: "🦈 Shark",
    orca: "🐋 Orca",
    fish: "🐠 Fish",
    squid: "🦑 Squid",
  };

  const entries = Object.entries(scores)
    .filter(([, v]) => Number.isFinite(v))
    .sort((a, b) => b[1] - a[1]);

  const topScore = entries[0]?.[1] ?? 0;
  const winners = entries.filter(([, s]) => s === topScore).map(([k]) => k);

  if (winners.length === 1) {
    mainEl.textContent = `วิญญาณแห่งท้องทะเลในตัวคุณคือ ${LABELS[winners[0]] || winners[0]} ✨`;
  } else {
    const names = winners.map((k) => LABELS[k] || k).join(" + ");
    mainEl.textContent = `คุณมีหลายคลื่นในใจ: ${names} (คะแนนเท่ากัน ${topScore}) 🌊`;
  }

  scoreEl.textContent = entries
    .map(([k, s]) => `${LABELS[k] || k} = ${s}`)
    .join("\n");

  restartBtn?.addEventListener("click", () => {
    localStorage.removeItem("ria_scores");
    localStorage.removeItem("ria_answers");
    window.location.href = "index.html"; // เปลี่ยนเป็นชื่อไฟล์หน้า choicepage ของแบม
  });

  function safeParse(str) {
    try { return JSON.parse(str); } catch { return null; }
  }
})();
