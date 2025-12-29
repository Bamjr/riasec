document.addEventListener("DOMContentLoaded", () => {
    const tapArea = document.getElementById("tapArea");
    const line1 = document.getElementById("storyLine1");
    const line2 = document.getElementById("storyLine2");
    const hint = document.getElementById("continueHint");

    // เนื้อเรื่อง
    const scene1 =
        `ในคืนหนึ่งที่สายลมพัดผ่านหน้าต่างแผ่วเบา คุณพลัดตกสู่ความฝันที่ไม่เหมือนคืนใดมาก่อน—
โลกที่ไร้ขอบฟ้า กลับเต็มไปด้วยเสียงหัวใจของคุณสะท้อนก้องผสานกับคลื่นใต้ท้องทะเล`;

    const scene2 =
        `ที่นี่… ไม่มีสิ่งใดซ่อนเร้นได้
และสัญชาตญาณคือภาษาที่แท้จริงเพียงหนึ่งเดียว`;

    // ตั้งค่าความเร็วพิมพ์ (ms ต่อ 1 ตัวอักษร)
    const TYPE_SPEED = 50;

    // state machine: 0=กำลังพิมพ์1, 1=รอกดไปฉาก2, 2=กำลังพิมพ์2, 3=ไฮไลท์+รอกดไปต่อ
    let state = 0;

    function showHint() {
        hint.hidden = false;
        // ถ้าอยากให้ค่อย ๆ โผล่ด้วย animation เดิม ก็เติม class/animation ได้
    }

    function hideHint() {
        hint.hidden = true;
    }

    function setTapEnabled(enabled) {
        tapArea.dataset.tapEnabled = enabled ? "1" : "0";
    }

    // กันการกดตอนยังพิมพ์ไม่เสร็จ
    function canTap() {
        return tapArea.dataset.tapEnabled === "1";
    }

    // typewriter แบบรองรับขึ้นบรรทัดใหม่
    function typeText(el, text, speed) {
        return new Promise((resolve) => {
            el.textContent = "";
            // ใส่ cursor
            const cursor = document.createElement("span");
            cursor.className = "cursor";
            cursor.textContent = "|";
            el.appendChild(cursor);

            let i = 0;
            const timer = setInterval(() => {
                // ใส่ตัวอักษรก่อน cursor
                cursor.insertAdjacentText("beforebegin", text[i]);
                i++;

                if (i >= text.length) {
                    clearInterval(timer);
                    cursor.remove();
                    resolve();
                }
            }, speed);
        });
    }

    function turnPhraseGold() {
        const phrase = "ภาษาที่แท้จริงเพียงหนึ่งเดียว";
        const raw = line2.textContent;

        if (!raw.includes(phrase)) return;

        const parts = raw.split(phrase);

        line2.innerHTML =
            `${escapeHtml(parts[0])}` +
            `<span class="gold-glow">${escapeHtml(phrase)}</span>` +
            `${escapeHtml(parts[1] ?? "")}`;
    }



    function escapeHtml(s) {
        return s
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    async function start() {
        hideHint();
        setTapEnabled(false);

        state = 0;
        await typeText(line1, scene1, TYPE_SPEED);

        // พิมพ์เสร็จฉาก1 → ค่อยโชว์ “กดเพื่อไปต่อ” แล้วค่อยเปิดให้กด
        showHint();
        setTapEnabled(true);
        state = 1;
    }

    async function goScene2() {
        hideHint();
        setTapEnabled(false);

        state = 2;
        line2.hidden = false;
        await typeText(line2, scene2, TYPE_SPEED);

        // หลังพิมพ์เสร็จ → ไฮไลท์คำทอง
        setTimeout(() => {
            turnPhraseGold();

            // แล้วค่อยโชว์ hint + อนุญาตให้กด
            showHint();
            setTapEnabled(true);
            state = 3;
        }, 600);
    }

    
    document.addEventListener("click", (e) => {
       
        const blocked = e.target.closest("a, button, input, textarea, select, label, iframe");
        if (blocked) return;

        if (!canTap()) return;

        if (state === 1) {
            goScene2();
        } else if (state === 3) {
            
            window.location.href = "choicepage.html"; 
        }
    });

    start();
});
