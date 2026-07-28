// ==========================================================================
// FFXIV Interview Card Generator - Application Logic
// ==========================================================================

// 1. Localized Interview Data (Traditional Chinese)
const interviewData = [
    {
        isCover: true,
        title: "2026 歐洲粉絲節吉田直樹媒體聯訪",
        subtitle: "FINAL FANTASY XIV: SAILS OF SEABREEZE",
        topics: [
            "房屋系統大更新 (8.x)",
            "新人 300 小時主線體驗簡化",
            "全新野外 Raid (由中川誠貴負責)",
            "角色自定義放寬與吉田開發心態"
        ]
    },
    {
        title: "一、 新地圖設計與靈感",
        question: "在確立《銀海之天舟》的視覺特徵時，為了讓它能讓人感到與同為冰雪背景的伊修加德或加雷馬有著明顯不同，最大的挑戰是什麼？",
        answer: "吉田直樹：\n大家看到主題可能會聯想到冰雪，但其實我們並沒有去開發任何冰雪主題的地圖。每當我們著手開發新資料片、思考新地圖時，我們都希望創造出玩家們從未體驗過、甚至是完全想像不到的區域。我們想設計連自己以前都沒見過的地方。因此在這個過程中，我們會深入思考那裡有著什麼樣的景色、文化，以及可以體驗到怎樣的、真正讓人感到新鮮的日常生活。在確立了方向後，就開始製作原畫。\n\n這一次，我們將北歐神話和北歐文化作為靈感來源，努力探尋有哪些可以借鑑的古老神話，並將它們與幻想美學融合在一起，還請多多期待。\n\n關於與加雷馬做出區隔，提到加雷馬大家大概會聯想到冷峻、黑沉的景象。在製作新地圖時，有時我們確實會得出相似的美學風格，所以有時候也會自我檢視：「嗯，這看著確實有點像加雷馬，也許我們需要換一個稍微不同的方向。」"
    },
    {
        title: "二、 房屋系統革新（與 WOW 的競爭）",
        question: "未來有計劃讓《FF14》的房屋系統現代化嗎？",
        answer: "吉田直樹：\n（笑）我想這個問題可能被潤飾過，稍微有點模糊了。我覺得你真正想問的是：「你看，WOW（魔獸世界）出了這麼棒的房屋系統，那《FF14》呢？」\n\n我們對 WOW 團隊懷有巨大的尊重。當看到他們公佈了新資料片和這個新房屋系統、並且還特別提到參考了《FF14》並融入了想要超越我們的東西時，對我們來說是一種極大的榮幸。當然，我自己也親自體驗了 WOW 的房屋系統，我真的很喜歡，太棒了。這也成為了很好的研究素材。雖然還不能具體地說會在什麼時候推出，但我能說的是，我們正計劃在 8.x 版本中對房屋系統進行兩項非常大的革新。\n\n其中一項革新涉及房屋 UI。目前《FF14》的房屋 UI 相當偏複雜，並且不太容易上手。我們想對它進行重大革新，讓休閒玩家更容易上手、輕鬆地佈置出精美的房屋。\n\n至於另一項重大革新，不幸的是，我現在還不能透露細節，但我覺得相比 UI 更新，大家聽到它時應該會開心得多。目前它還處於規劃階段，但更有可能比 UI 更新要更早推出。等我們對時間更有把握時會公佈細節。它大概會是很多人願望單上的第一名。"
    },
    {
        title: "三、 新職業「堅城衛」與戰鬥系統",
        question: "堅城衛的靈感是否來自 FF 系列前作中的某些職業？技能組中包含了遠程攻擊，能否解釋一下它的整體概念以及與其他防護職業的差異？",
        answer: "吉田直樹：\n每當我們想在《FF14》中增加新職業時，最重要的是確保其遊玩體驗是有趣且吸引人的。雖然堅城衛（Bastion）與 FF 前作無關，但它的優點之一是可以射擊，確實很好地結合了近身攻擊與可以從遠距離發起的攻擊，這在某些特定的戰鬥中會很有用。\n\n此外，堅城衛的核心吸引力之一是，技能組擁有良好的回復和輔助援護能力。作為主坦（MT），你可以立刻將這些技能用給隊友，但對於堅城衛，關鍵在於可以根據自己判斷的時機去用。你可以觀察 Boss 接下來要做什麼、根據時間軸決定對隊友使用回復或援護能力的最佳時機，我覺得這是一個關鍵。\n\n關於《銀海之天舟》中將防護職業明確劃分為主坦（MT）和副坦（ST），在「重生模式」（Reborn Mode）下，MT 和 ST 之間沒有明確的區分。那種明確的區分只適用於「進化模式」（Evolved Mode）。\n我們也收到過一些關於坦克分工的回饋。MT 和 ST 真正有差別的情況，只有在更高難度的終局內容裡（如零式或絕境戰）才有。所以如果大家能在那些高難本中去體驗新的戰鬥就太好了。"
    },
    {
        title: "四、 聯動任務（EVA/FF7R）與全新「野外 Raid」",
        question: "對於你們目前正在開發的內容，您覺得在哪個方面你們做得最大膽？「彼岸的星命」聯動任務是哪一方的團隊先提出來的？",
        answer: "吉田直樹：\n在內容上，有我們正在製作的兩個大型任務系列。首先是目前正在開發的《新世紀福音戰士》（EVA）聯動任務「慾望的幽影」，然後還有另一項與《FF7 重製版》（FF7 Remake）系列的聯動任務——「彼岸的星命」。（彼岸的星命是我先提的）\n\n對於這兩個大型任務，我們都著重強調了劇情的重要性，同時也對 Boss 戰投入了大量的關注與精力。尤其是對於 EVA，因為 EVA 是一個非常不同的世界，我們非常認真地探討了該如何將這兩個截然不同的世界融合在一起，並以此構造出一個有力結合的故事。\n\n今天我們還公佈了另一種類型的內容，在開發團隊內部暫時稱之為「野外 Raid」（World/Field Raid），這是一種能在野外地圖遊玩的新型內容。這也是我們正在迎接的一個非常巨大的挑戰。湊巧的是，負責推進該內容開發的人正是奧茲瑪先生（中川誠貴），也就是製作了魔獸使（獸王）與「尤雷卡」（Eureka）的那個人。我覺得他確實在將他豐富的經驗充分利用於開發這項能在野外地圖遊玩的新內容。它不會在 8.0 就上線，但我想 8.0 上線後也不需要再等很久了。"
    },
    {
        title: "五、 新人主線體驗放寬",
        question: "我們如何確保新玩家從《重生之境》的開頭一直到《銀海之天舟》都能擁有很好的體驗？會有加快或改變新玩家體驗的改動嗎？光是過完主線很可能就需要 300 個小時。",
        answer: "吉田直樹：\n這是我們長期以來一直收到的問題。我們正在考慮兩種措施來因應。\n\n第一種措施將會在《銀海之天舟》上線時或在那之前實施。第二種措施則涉及到一種系統，但我們目前還在評估它的可能性。也就是我們現在正在考慮它的可行性，並探討我們是否能夠引入這一系統的問題。\n\n我正在談論的這一系統，能在 8.0 就實現的可能性並不為零，也就是說是有可能做進 8.0 的。我承認，在 2.0 時期我確實說過希望玩家去享受故事，所以希望他們從 2.0 起從頭開始體驗。但今時也確實不同於往日，我們已經開始考慮順應這類需求。我想我在這裡暗示的兩種措施中，至少其中一件大家能在東京粉絲節上了解更多……但我認為各位可以想得積極一些。我正以非常積極的態度思考加入某些東西並順應那些需求的可能性。"
    },
    {
        title: "六、 夥伴陸行鳥更新與系統演進",
        question: "在當前這個時間點對夥伴陸行鳥系統進行這麼大的更新，能告訴我們背後的原因和目的嗎？",
        answer: "吉田直樹：\n我已經宣布，不單單是針對夥伴陸行鳥，在《銀海之天舟》中我們也在尋求對許多系統做出更新。說實話，我們並不是為了製作 8.0 才做這個夥伴陸行鳥更新的，順序其實是反過來的。7.0 上線後，在我們完成了 7.1 版本的開發、已經開始開發 7.2 版本時，我當時在思考面向 8.0 要加入怎樣的遊戲設計。\n\n那時候，我主要做了三件事：\n第一，我作為《FF14》製作人兼導演，全面審視了這款遊戲，列出我個人認為絕對需要改變的清單。\n第二，我拉上《FF14》團隊的核心成員（包括助理導演橫澤、戰鬥導演佐藤、奧茲瑪先生等），坐在一起進行了長達許多個小時的討論。\n第三，我們詢問了開發團隊、營運、行銷、公關所有團隊，問他們想對《FF14》做哪些改變，然後我得到了超級長的清單。\n\n把所有的清單整合在一起後，我們決定了優先順序，在這個過程中決定了應該更早地去做夥伴陸行鳥的改動。我們真正想做的是將《FF14》作為一個整體來對待，考慮我們可以將怎樣的進化融入《FF14》中。這包含了 8.x 版本的一些將在 8.1 和 8.2 中到來的重大更新，但我們更希望的是在未來也持續讓這款遊戲得到進化。這將一直持續到 9.0 之前，且不會到那裡就停下腳步。"
    },
    {
        title: "七、 角色自定義放寬（去面紋）與吉田的開發心態",
        question: "今天你公佈了更多的角色自定義選項，包括移除某些面紋的可選項以及可更換的角。是什麼導致你們改變了對此事的態度？是否想過退休？",
        answer: "吉田直樹：\n以前我也曾說過，不會去掉貓魅族的面紋。因為這是種族背後的世界觀設定。但對於現在這個特定的世界觀設定的問題，我對自己說，這也可以被視為角色扮演的一部分，而在這個層面，我也算是升級了我個人的心態與方法。\n在 8.1 版本中將會有移除面紋的選項。我們想做的是把選擇權交給玩家，不想強迫玩家接受特定的路線。這只是為玩家提供一個選項，以便他們可以對自己想進行怎樣的角色扮演更加講究。\n\n至於玩家社群對喬爾特（Jolt，7.5 副本滾動 Boss）的反應，老實說，我真的不知道為什麼它會紅。（笑）但我很興奮看到玩家在社群媒體上創作的各種迷因，臉上也會露出會心的微笑。\n\n我還壓根沒想過退休。如果 Square Enix 不需要我了，那我可能就走了。但只要《FF14》的玩家們不對我說：「喂，吉田，你該走人了。」我就打算繼續開發這款遊戲。FF14 真的就是我畢生的事業。能減輕並克服我們懷有的焦慮感的唯一途徑，就是繼續投入辛勤的工作，付出努力，這就是驅動我們前進的動力。"
    }
];

// 2. Application State Variables
let currentMode = 'card'; // 'card' or 'long'
let currentSlideIndex = 0;
const defaultStyles = {
    fontSize: 17,
    lineHeight: 1.6,
    padding: 40
};

// DOM Elements
const exportTarget = document.getElementById('export-target');
const navIndicators = document.getElementById('nav-indicators');
const cardNavigator = document.getElementById('card-navigator');
const btnModeCard = document.getElementById('btn-mode-card');
const btnModeLong = document.getElementById('btn-mode-long');
const btnDownloadSingle = document.getElementById('btn-download-single');
const btnDownloadAll = document.getElementById('btn-download-all');

// 3. Initialize App
window.addEventListener('DOMContentLoaded', () => {
    renderIndicators();
    renderContent();
    setupDownloadListeners();
});

// 4. Render Layout & Content
function renderIndicators() {
    navIndicators.innerHTML = '';
    interviewData.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `indicator-dot ${index === currentSlideIndex ? 'active' : ''}`;
        dot.textContent = index === 0 ? 'H' : index; // 'H' for Header/Cover
        dot.addEventListener('click', () => {
            if (currentMode === 'card') {
                currentSlideIndex = index;
                renderContent();
                updateIndicatorsState();
            }
        });
        navIndicators.appendChild(dot);
    });
}

function updateIndicatorsState() {
    const dots = navIndicators.querySelectorAll('.indicator-dot');
    dots.forEach((dot, index) => {
        if (index === currentSlideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function renderContent() {
    exportTarget.innerHTML = '';
    
    if (currentMode === 'card') {
        // Render only the current card
        const slideData = interviewData[currentSlideIndex];
        const cardHTML = createCardHTML(slideData, currentSlideIndex);
        exportTarget.appendChild(cardHTML);
    } else {
        // Render all cards stacked
        interviewData.forEach((slideData, index) => {
            const cardHTML = createCardHTML(slideData, index);
            exportTarget.appendChild(cardHTML);
        });
    }
    
    // Apply current styling variables
    applyStylesToDOM();
}

function createCardHTML(data, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'ff-card';
    cardDiv.dataset.index = index;

    // FFXIV Gold Borders & Corners
    const borderFrame = document.createElement('div');
    borderFrame.className = 'card-border-frame';
    const corners = ['tl', 'tr', 'bl', 'br'];
    corners.forEach(c => {
        const corner = document.createElement('div');
        corner.className = `ff-corner ff-corner-${c}`;
        borderFrame.appendChild(corner);
    });
    cardDiv.appendChild(borderFrame);

    // Cover Page vs normal QA page
    if (data.isCover) {
        cardDiv.classList.add('cover-card');
        cardDiv.innerHTML += `
            <div class="card-header-badge">★ Media Interview ★</div>
            <div class="card-body" style="justify-content: center; align-items: center; text-align: center;">
                <h1 class="card-title" contenteditable="true" style="font-size: 32px; line-height: 1.3; margin-bottom: 20px; font-weight: 700; width: 100%;">${data.title}</h1>
                <p class="subtitle" contenteditable="true" style="font-size: 14px; letter-spacing: 3px; color: var(--accent-gold); margin-bottom: 40px; font-weight: 700; font-family: 'Montserrat', sans-serif;">${data.subtitle}</p>
                <div class="topics-box" style="background: rgba(229,193,125,0.05); padding: 24px 40px; border-radius: 8px; border: 1px solid rgba(229,193,125,0.2); width: 85%;">
                    <h3 style="font-size: 15px; margin-bottom: 15px; color: var(--accent-gold); letter-spacing: 1px;">💡 本期訪談亮點概要</h3>
                    <ul style="list-style: none; text-align: left; font-size: 14px; line-height: 2.0; font-weight: 400;">
                        ${data.topics.map(t => `<li contenteditable="true"><i class="fa-solid fa-square-caret-right" style="color: var(--accent-gold); margin-right: 10px;"></i>${t}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="card-footer">
                <span>2026 EUROPEAN FAN FESTIVAL</span>
                <span class="card-footer-right">吉田直樹 媒體聯訪</span>
            </div>
        `;
    } else {
        cardDiv.innerHTML += `
            <div class="card-header-badge">Final Fantasy XIV / 8.0 Sails of Seabreeze</div>
            <h2 class="card-title" contenteditable="true">${data.title}</h2>
            <div class="card-body">
                <div class="question-box">
                    <span class="question-prefix">QUESTION / 媒體提問</span>
                    <p contenteditable="true">${data.question}</p>
                </div>
                <div class="answer-box">
                    <span class="answer-prefix">PRODUCER / 吉田直樹</span>
                    <p contenteditable="true">${data.answer}</p>
                </div>
            </div>
            <div class="card-footer">
                <span>FFXIV 2026 歐洲粉絲節 媒體聯訪</span>
                <span class="card-footer-right">第 ${index} / ${interviewData.length - 1} 單元</span>
            </div>
        `;
    }

    return cardDiv;
}

// 5. App Mode & Style Switchers
function switchMode(mode) {
    if (currentMode === mode) return;
    
    currentMode = mode;
    if (mode === 'card') {
        btnModeCard.classList.add('active');
        btnModeLong.classList.remove('active');
        cardNavigator.style.display = 'flex';
        exportTarget.className = exportTarget.className.replace('app-mode-long', 'app-mode-card');
        btnDownloadSingle.innerHTML = '<i class="fa-solid fa-file-image"></i> 下載當前單張卡片';
        btnDownloadAll.style.display = 'block';
    } else {
        btnModeCard.classList.remove('active');
        btnModeLong.classList.add('active');
        cardNavigator.style.display = 'none';
        exportTarget.className = exportTarget.className.replace('app-mode-card', 'app-mode-long');
        exportTarget.classList.add('app-mode-long');
        btnDownloadSingle.innerHTML = '<i class="fa-solid fa-arrows-up-down"></i> 下載完整一條龍長圖';
        btnDownloadAll.style.display = 'none';
    }
    renderContent();
}

function prevCard() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderContent();
        updateIndicatorsState();
    }
}

function nextCard() {
    if (currentSlideIndex < interviewData.length - 1) {
        currentSlideIndex++;
        renderContent();
        updateIndicatorsState();
    }
}

function updateTheme(themeClass) {
    // Keep decoration classes like show-border / show-quote
    const currentDecorations = Array.from(exportTarget.classList)
        .filter(c => c.startsWith('show-'));
    
    exportTarget.className = `${themeClass} ${currentDecorations.join(' ')}`;
    if (currentMode === 'long') {
        exportTarget.classList.add('app-mode-long');
    }
}

function changeStyle(property, value) {
    defaultStyles[property] = value;
    document.getElementById(`${property}-val`).textContent = 
        property === 'lineHeight' ? value : `${value}px`;
    applyStylesToDOM();
}

function applyStylesToDOM() {
    const cards = exportTarget.querySelectorAll('.ff-card');
    cards.forEach(card => {
        // Set body elements styling
        const qBox = card.querySelector('.question-box');
        const aBox = card.querySelector('.answer-box');
        const cardTitle = card.querySelector('.card-title');
        
        card.style.padding = `${defaultStyles.padding}px ${defaultStyles.padding + 15}px`;
        
        if (qBox) qBox.style.fontSize = `${defaultStyles.fontSize}px`;
        if (aBox) {
            aBox.style.fontSize = `${defaultStyles.fontSize}px`;
            aBox.style.lineHeight = defaultStyles.lineHeight;
        }
    });
}

function toggleDecoration(type, isEnabled) {
    if (isEnabled) {
        exportTarget.classList.add(`show-${type}`);
    } else {
        exportTarget.classList.remove(`show-${type}`);
    }
}

// 6. Image Exporter Functions (html2canvas)
function setupDownloadListeners() {
    btnDownloadSingle.addEventListener('click', () => {
        if (currentMode === 'card') {
            const currentCard = exportTarget.querySelector('.ff-card');
            downloadElementAsPNG(currentCard, `FFXIV_Interview_Card_${currentSlideIndex}.png`);
        } else {
            // Long strip mode exports the whole target container
            downloadElementAsPNG(exportTarget, `FFXIV_Interview_LongStrip.png`);
        }
    });

    btnDownloadAll.addEventListener('click', async () => {
        btnDownloadAll.disabled = true;
        btnDownloadAll.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 正在生成中...';
        
        // Save current state
        const originalSlideIndex = currentSlideIndex;
        
        try {
            for (let i = 0; i < interviewData.length; i++) {
                currentSlideIndex = i;
                renderContent();
                // Wait for DOM render update
                await new Promise(resolve => setTimeout(resolve, 300));
                
                const currentCard = exportTarget.querySelector('.ff-card');
                const label = i === 0 ? 'Cover' : `Part_${i}`;
                await downloadElementAsPNGAsync(currentCard, `FFXIV_Interview_Card_${label}.png`);
            }
        } catch (err) {
            console.error("Batch download failed: ", err);
        } finally {
            // Restore state
            currentSlideIndex = originalSlideIndex;
            renderContent();
            updateIndicatorsState();
            btnDownloadAll.disabled = false;
            btnDownloadAll.innerHTML = '<i class="fa-solid fa-file-zipper"></i> 批次導出所有分頁卡片';
        }
    });
}

// Helper to trigger browser downloads of canvas
function downloadElementAsPNG(element, filename) {
    // Show spinner or feedback
    const originalBtnHTML = btnDownloadSingle.innerHTML;
    btnDownloadSingle.disabled = true;
    btnDownloadSingle.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 正在轉換圖片...';

    // Prepare html2canvas options
    const options = {
        scale: 2, // Double resolution for ultra-sharp text rendering
        useCORS: true,
        allowTaint: true,
        backgroundColor: null // Transparent background if themed
    };

    html2canvas(element, options).then(canvas => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Restore button state
        btnDownloadSingle.disabled = false;
        btnDownloadSingle.innerHTML = originalBtnHTML;
    }).catch(err => {
        console.error("html2canvas failed: ", err);
        btnDownloadSingle.disabled = false;
        btnDownloadSingle.innerHTML = originalBtnHTML;
        alert("圖片導出失敗，請檢查瀏覽器控制台日誌。");
    });
}

// Async version for batch download loop
function downloadElementAsPNGAsync(element, filename) {
    return new Promise((resolve, reject) => {
        const options = {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null
        };

        html2canvas(element, options).then(canvas => {
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}
