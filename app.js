// ==========================================================================
// FFXIV Submersible Timer - Application Logic
// ==========================================================================

// 1. Data Structure & Seeding Initial Data (from User Image 2)
let workshops = [];
let activeAlarms = [];
let alarmIntervalId = null;
let currentAudio = null;
let expandedMapPanels = {}; // Key: wsIdx, Value: boolean

const CHART_CONFIGS = {
    "drowned_city": {
        name: "溺沒海",
        isVisual: true,
        startsUnlocked: ["A", "B"],
        startNode: { x: 420, y: 660, targets: ["A", "B"] },
        sites: [
            { id: "A",  x: 457, y: 600, connections: ["C"] },
            { id: "B",  x: 405, y: 518, connections: ["D", "E"] },
            { id: "C",  x: 522, y: 474, connections: ["A", "F"] },
            { id: "D",  x: 283, y: 574, connections: ["B", "G"] },
            { id: "E",  x: 457, y: 426, connections: ["B", "I", "J"] },
            { id: "F",  x: 600, y: 592, connections: ["C"] },
            { id: "G",  x: 196, y: 531, connections: ["D", "H"] },
            { id: "H",  x: 91,  y: 566, connections: ["G", "L", "M"] },
            { id: "I",  x: 274, y: 452, connections: ["E", "K"] },
            { id: "J",  x: 622, y: 426, connections: ["E", "N"], unlocks: "解鎖第二艘潛水艇欄位" },
            { id: "K",  x: 361, y: 383, connections: ["I", "P"] },
            { id: "L",  x: 187, y: 396, connections: ["H", "R"] },
            { id: "M",  x: 78,  y: 439, connections: ["H"] },
            { id: "N",  x: 561, y: 378, connections: ["J", "W", "O"] },
            { id: "O",  x: 448, y: 344, connections: ["N", "S"], unlocks: "解鎖第三艘潛水艇欄位" },
            { id: "P",  x: 200, y: 244, connections: ["K", "Q"] },
            { id: "Q",  x: 87,  y: 248, connections: ["P"] },
            { id: "R",  x: 131, y: 370, connections: ["L"] },
            { id: "S",  x: 235, y: 165, connections: ["O", "T", "U"] },
            { id: "T",  x: 91,  y: 139, connections: ["S", "Y"], unlocks: "解鎖第四艘潛水艇欄位" },
            { id: "U",  x: 335, y: 204, connections: ["S", "V"] },
            { id: "V",  x: 392, y: 165, connections: ["U"] },
            { id: "W",  x: 505, y: 261, connections: ["N", "X"] },
            { id: "X",  x: 626, y: 235, connections: ["W"] },
            { id: "Y",  x: 161, y: 65,  connections: ["T", "Z"] },
            { id: "Z",  x: 305, y: 78,  connections: ["Y", "AA"] },
            { id: "AA", x: 579, y: 135, connections: ["Z", "AB", "AC"] },
            { id: "AB", x: 535, y: 52,  connections: ["AA", "AD"] },
            { id: "AC", x: 626, y: 70,  connections: ["AA"] },
            { id: "AD", x: 435, y: 57,  connections: ["AB"], unlocks: "解鎖灰海地圖" }
        ]
    },
    "jade_sea": {
        name: "灰海",
        isVisual: true,
        startsUnlocked: ["A"],
        startNode: { x: 216, y: 580, targets: ["A"] },
        sites: [
            { id: "A", x: 216, y: 514, connections: ["B"] },
            { id: "B", x: 99,  y: 561, connections: ["A", "C"] },
            { id: "C", x: 204, y: 394, connections: ["B", "D", "F"] },
            { id: "D", x: 307, y: 479, connections: ["C", "E"] },
            { id: "E", x: 417, y: 528, connections: ["D", "Q"] },
            { id: "Q", x: 494, y: 586, connections: ["E"] },
            { id: "F", x: 152, y: 285, connections: ["C", "G"] },
            { id: "G", x: 250, y: 325, connections: ["F", "I", "H"] },
            { id: "I", x: 349, y: 411, connections: ["G", "M", "J"] },
            { id: "M", x: 470, y: 410, connections: ["I"] },
            { id: "H", x: 241, y: 229, connections: ["G", "K"] },
            { id: "K", x: 85,  y: 187, connections: ["H", "T", "L"] },
            { id: "T", x: 118, y: 99,  connections: ["K"] },
            { id: "J", x: 326, y: 301, connections: ["I", "N"] },
            { id: "N", x: 573, y: 308, connections: ["J", "O", "S"] },
            { id: "O", x: 526, y: 470, connections: ["N"] },
            { id: "S", x: 472, y: 199, connections: ["N"] },
            { id: "L", x: 312, y: 142, connections: ["K", "P"] },
            { id: "P", x: 401, y: 148, connections: ["L", "R"] },
            { id: "R", x: 562, y: 89,  connections: ["P"], unlocks: "解鎖翠浪海地圖" }
        ]
    }
};

const LEVEL_BONUS = {
  51: [2,1,0,0,0],   52: [2,3,0,1,0],   53: [2,3,1,2,1],   54: [3,4,1,3,1],
  55: [3,7,3,3,1],   56: [4,7,3,5,1],   57: [4,7,3,7,2],   58: [4,8,3,8,3],
  59: [5,8,4,9,3],   60: [5,10,5,10,5], 61: [7,10,6,10,6], 62: [7,10,8,12,7],
  63: [8,11,8,12,9], 64: [8,12,10,14,9],65: [10,15,10,15,10],66:[13,17,11,15,10],
  67: [13,19,13,17,12],68:[16,19,15,17,12],69:[16,23,15,19,13],70:[20,25,15,20,13],
  71: [23,29,15,20,15],72:[26,29,15,20,15],73:[26,33,17,22,17],74:[26,35,18,23,19],
  75: [30,40,20,23,20],76:[30,45,20,23,24],77:[34,45,23,29,25],78:[36,45,23,29,27],
  79: [38,45,25,33,28],80:[40,50,25,35,28],81:[40,50,25,35,30],82:[42,50,32,40,34],
  83: [43,53,32,40,35],84:[44,53,32,49,38],85:[48,58,33,49,39],86:[50,58,36,49,43],
  87: [50,60,36,49,43],88:[50,64,36,56,48],89:[50,64,40,60,49],90:[55,70,40,60,50],
  91: [57,70,41,62,52],92:[57,70,43,64,53],93:[58,72,43,66,54],94:[58,74,45,68,54],
  95: [60,80,45,70,55]
};

const PART_STATS = {
  hull: { // 船體
    "鯊魚級":      { minLevel: 1,  stats: [-10, 30, 20, 40, 20] },
    "甲鱟級":      { minLevel: 15, stats: [15, 10, 0, 60, 15] },
    "鬚鯨級":      { minLevel: 25, stats: [-15, 55, 35, 15, 20] },
    "腔棘魚級":    { minLevel: 35, stats: [40, -10, 25, 40, 25] },
    "希爾德拉級":  { minLevel: 45, stats: [10, 75, 30, -15, 5] },
    "鯊魚改級":    { minLevel: 50, stats: [-5, 40, 25, 45, 35] },
    "甲鱟改級":    { minLevel: 50, stats: [20, 15, 5, 65, 25] },
    "鬚鯨改級":    { minLevel: 50, stats: [-10, 55, 40, 20, 30] },
    "腔棘魚改級":  { minLevel: 50, stats: [40, -5, 30, 40, 30] },
    "希爾德拉改級":{ minLevel: 50, stats: [10, 80, 30, -15, 10] }
  },
  stern: { // 船尾
    "鯊魚級":      { minLevel: 1,  stats: [-30, 20, 60, 30, 15] },
    "甲鱟級":      { minLevel: 15, stats: [15, 0, 30, 40, 25] },
    "鬚鯨級":      { minLevel: 25, stats: [15, 20, 0, 55, 15] },
    "腔棘魚級":    { minLevel: 35, stats: [10, 25, 35, 25, 25] },
    "希爾德拉級":  { minLevel: 45, stats: [20, 60, 35, -15, 5] },
    "鯊魚改級":    { minLevel: 50, stats: [-25, 25, 70, 35, 25] },
    "甲鱟改級":    { minLevel: 50, stats: [20, 5, 35, 45, 35] },
    "鬚鯨改級":    { minLevel: 50, stats: [20, 20, 5, 60, 20] },
    "腔棘魚改級":  { minLevel: 50, stats: [10, 25, 40, 30, 30] },
    "希爾德拉改級":{ minLevel: 50, stats: [20, 60, 35, -10, 10] }
  },
  bow: { // 船首
    "鯊魚級":      { minLevel: 1,  stats: [50, 40, 10, -20, 15] },
    "甲鱟級":      { minLevel: 15, stats: [60, 20, 20, -15, 10] },
    "鬚鯨級":      { minLevel: 25, stats: [25, 60, -15, 20, 15] },
    "腔棘魚級":    { minLevel: 35, stats: [60, 10, -10, 30, 0] },
    "希爾德拉級":  { minLevel: 45, stats: [45, 30, -15, 40, 40] },
    "鯊魚改級":    { minLevel: 50, stats: [55, 50, 15, -15, 25] },
    "甲鱟改級":    { minLevel: 50, stats: [65, 25, 25, -10, 20] },
    "鬚鯨改級":    { minLevel: 50, stats: [25, 65, -10, 25, 25] },
    "腔棘魚改級":  { minLevel: 50, stats: [70, 15, -10, 30, 5] },
    "希爾德拉改級":{ minLevel: 50, stats: [45, 30, -10, 40, 40] }
  },
  bridge: { // 艦橋
    "鯊魚級":      { minLevel: 1,  stats: [20, 20, 20, 20, 20] },
    "甲鱟級":      { minLevel: 15, stats: [25, 5, 25, 30, 30] },
    "鬚鯨級":      { minLevel: 25, stats: [0, 25, 20, 45, 40] },
    "腔棘魚級":    { minLevel: 35, stats: [55, 20, 35, -15, 50] },
    "希爾德拉級":  { minLevel: 45, stats: [55, 20, -5, 30, 60] },
    "鯊魚改級":    { minLevel: 50, stats: [25, 25, 30, 25, 35] },
    "甲鱟改級":    { minLevel: 50, stats: [30, 10, 30, 35, 40] },
    "鬚鯨改級":    { minLevel: 50, stats: [0, 30, 25, 50, 45] },
    "腔棘魚改級":  { minLevel: 50, stats: [60, 20, 35, -10, 55] },
    "希爾德拉改級":{ minLevel: 50, stats: [60, 20, -5, 30, 60] }
  }
};

const DEFAULT_WORKSHOPS = [
    {
        name: "空想秘錄",
        submersibles: [
            {
                name: "潛水艇-1",
                level: 64,
                type: "潜水艇",
                status: "探索中",
                targetTimestamp: Date.now() + (19 * 60 * 60 * 1000) + (57 * 60 * 1000), // 19h 57m
                totalDurationMs: (19 * 60 * 60 * 1000) + (57 * 60 * 1000),
                alarmPlayed: false
            },
            {
                name: "潛水艇-2",
                level: 59,
                type: "潜水艇",
                status: "探索中",
                targetTimestamp: Date.now() + (12 * 60 * 60 * 1000) + (4 * 60 * 1000), // 12h 04m
                totalDurationMs: (12 * 60 * 60 * 1000) + (4 * 60 * 1000),
                alarmPlayed: false
            },
            {
                name: "潛水艇-3",
                level: 54,
                type: "潜水艇",
                status: "探索中",
                targetTimestamp: Date.now() + (8 * 60 * 60 * 1000) + (28 * 60 * 1000), // 8h 28m
                totalDurationMs: (8 * 60 * 60 * 1000) + (28 * 60 * 1000),
                alarmPlayed: false
            },
            {
                name: "潛水艇-4",
                level: 46,
                type: "潜水艇",
                status: "探索中",
                targetTimestamp: Date.now() + (32 * 60 * 60 * 1000) + (58 * 60 * 1000), // 1d 8h 58m = 32h 58m
                totalDurationMs: (32 * 60 * 60 * 1000) + (58 * 60 * 1000),
                alarmPlayed: false
            }
        ]
    },
    {
        name: "材料探索",
        submersibles: [
            {
                name: "飛空艇-1",
                level: 50,
                type: "飞空艇",
                status: "待命中",
                targetTimestamp: null,
                totalDurationMs: null,
                alarmPlayed: false
            }
        ]
    }
];

// Load Data from LocalStorage
function loadData() {
    const data = localStorage.getItem("ffxiv_sub_timers");
    if (data) {
        try {
            workshops = JSON.parse(data);
        } catch (e) {
            console.error("Error parsing localStorage data, resetting to default...", e);
            workshops = JSON.parse(JSON.stringify(DEFAULT_WORKSHOPS));
        }
    } else {
        workshops = JSON.parse(JSON.stringify(DEFAULT_WORKSHOPS));
        saveData();
    }

    // Ensure every workshop has the charts progress object for backward compatibility
    workshops.forEach(ws => {
        if (!ws.charts) {
            ws.charts = {};
        }
        for (const key in CHART_CONFIGS) {
            if (!ws.charts[key]) {
                if (CHART_CONFIGS[key].startsUnlocked) {
                    ws.charts[key] = [...CHART_CONFIGS[key].startsUnlocked];
                } else {
                    ws.charts[key] = [];
                }
            }
        }
    });
}

// Save Data to LocalStorage
function saveData() {
    localStorage.setItem("ffxiv_sub_timers", JSON.stringify(workshops));
}

// 2. Audio Chime Synthesizer (Simulating FFXIV crystal finish chime)
let audioCtx = null;

function playNotificationSound() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const now = audioCtx.currentTime;
        
        // FFXIV quest update style: crisp crystal arpeggio
        // Notes: G5 (784Hz) -> C6 (1047Hz) -> E6 (1318Hz) -> G6 (1568Hz)
        const notes = [783.99, 1046.50, 1318.51, 1567.98];
        const noteDurations = [0.12, 0.12, 0.12, 0.6];
        const startTimeOffsets = [0, 0.1, 0.2, 0.3];

        notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            // Triangle wave gives a soft flute/bell sound, sine wave is crystal clear
            osc.type = 'sine'; 
            osc.frequency.setValueAtTime(freq, now + startTimeOffsets[idx]);
            
            // Gain Envelope: rapid attack, linear decay
            gainNode.gain.setValueAtTime(0, now + startTimeOffsets[idx]);
            gainNode.gain.linearRampToValueAtTime(0.25, now + startTimeOffsets[idx] + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + startTimeOffsets[idx] + noteDurations[idx]);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start(now + startTimeOffsets[idx]);
            osc.stop(now + startTimeOffsets[idx] + noteDurations[idx]);
        });
    } catch (e) {
        console.error("Failed to play synthesized sound: ", e);
    }
}

function playTestSound() {
    const url = localStorage.getItem("ffxiv_sub_custom_audio_url") || "";
    if (url) {
        const testAudio = new Audio(url);
        testAudio.play().catch(e => {
            alert("自訂音效播放失敗！請確認網址是否正確，且該伺服器允許跨網域讀取(CORS)。\n詳細錯誤：" + e.message);
        });
    } else {
        playNotificationSound();
    }
}

// 3. Render Workshops & Timers
function renderAllWorkshops() {
    const container = document.getElementById("workshops-container");
    container.innerHTML = "";

    workshops.forEach((ws, wsIdx) => {
        const card = document.createElement("div");
        card.className = "workshop-card";
        
        // Count active & submersibles
        const activeCount = ws.submersibles.filter(s => s.status === "探索中" || s.status === "已返航").length;
        const totalCount = ws.submersibles.length;

        // Card Border decoration
        const borderFrame = document.createElement("div");
        borderFrame.className = "card-border-frame";
        const corners = ['tl', 'tr', 'bl', 'br'];
        corners.forEach(c => {
            const corner = document.createElement('div');
            corner.className = `ff-corner ff-corner-${c}`;
            borderFrame.appendChild(corner);
        });
        card.appendChild(borderFrame);

        // Header
        const header = document.createElement("div");
        header.className = "workshop-card-header";
        header.innerHTML = `
            <h3>${ws.name} <span class="sub-level">(探索機體數：${activeCount}/${totalCount})</span></h3>
            <div class="workshop-actions">
                <button class="icon-action-btn" onclick="toggleMapPanel(${wsIdx})" title="海圖解鎖進度"><i class="fa-solid fa-map"></i></button>
                <button class="icon-action-btn" onclick="openEditWorkshopName(${wsIdx})" title="重新命名部隊"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="icon-action-btn delete" onclick="confirmDeleteWorkshop(${wsIdx})" title="刪除部隊工坊"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        card.appendChild(header);

        // Map progress panel (collapsible)
        const mapPanel = document.createElement("div");
        mapPanel.className = "workshop-map-panel";
        mapPanel.id = `map-panel-${wsIdx}`;
        mapPanel.style.display = expandedMapPanels[wsIdx] ? "block" : "none";
        
        let badgesHTML = '<div class="map-badges-grid">';
        for (const chartKey in CHART_CONFIGS) {
            const chartConf = CHART_CONFIGS[chartKey];
            const unlockedCount = ws.charts[chartKey] ? ws.charts[chartKey].length : 0;
            const totalSites = chartConf.sites.length;
            badgesHTML += `
                <div class="map-badge-item" onclick="openChartModal(${wsIdx}, '${chartKey}')">
                    <span class="map-badge-name">${chartConf.name}</span>
                    <span class="map-badge-count">${unlockedCount}/${totalSites}</span>
                </div>
            `;
        }
        badgesHTML += '</div>';
        mapPanel.innerHTML = badgesHTML;
        card.appendChild(mapPanel);

        // Submersibles list
        const subList = document.createElement("div");
        subList.className = "submersible-list";

        ws.submersibles.forEach((sub, subIdx) => {
            const item = document.createElement("div");
            item.className = "sub-item";
            item.id = `sub-item-${wsIdx}-${subIdx}`;
            item.onclick = () => openEditSubmersibleModal(wsIdx, subIdx);

            const iconClass = sub.type === "飞空艇" ? "fa-paper-plane" : "fa-ship";
            
            // Build left info block
            let leftHTML = `
                <div class="sub-info-left">
                    <i class="fa-solid ${iconClass} sub-icon"></i>
                    <span class="sub-name">${sub.name}</span>
                    <span class="sub-level">[${sub.level}級]</span>
                </div>
            `;

            // Build right status / countdown block
            let rightHTML = "";
            if (sub.status === "探索中") {
                const returnTimeStr = formatReturnTime(sub.targetTimestamp);
                rightHTML = `
                    <div class="sub-status-right status-running" id="countdown-${wsIdx}-${subIdx}">
                        [剩餘時間 <span class="time-val">計算中...</span> <span class="return-time">(${returnTimeStr} 返航)</span>]
                    </div>
                `;
            } else if (sub.status === "已返航") {
                rightHTML = `
                    <div class="sub-status-right status-returned">
                        [已返航：可進行結算]
                    </div>
                `;
            } else {
                rightHTML = `
                    <div class="sub-status-right status-standby">
                        [待命或維修中]
                    </div>
                `;
            }

            item.innerHTML = leftHTML + rightHTML;
            subList.appendChild(item);
        });

        // Placeholder for adding new submersible (max 4 per workshop in FFXIV)
        if (ws.submersibles.length < 4) {
            const placeholder = document.createElement("div");
            placeholder.className = "sub-placeholder";
            placeholder.innerHTML = `<i class="fa-solid fa-plus"></i> 新增機體註冊 (${ws.submersibles.length}/4)`;
            placeholder.onclick = () => openAddSubmersibleModal(wsIdx);
            subList.appendChild(placeholder);
        }

        card.appendChild(subList);
        container.appendChild(card);
    });

    // Run immediate countdown tick after rendering
    tickTimers();
}

// 4. Timer Thread loop (每秒更新剩餘時間)
function tickTimers() {
    let stateChanged = false;
    let newAlarmsTriggered = false;
    const now = Date.now();

    workshops.forEach((ws, wsIdx) => {
        ws.submersibles.forEach((sub, subIdx) => {
            const subItem = document.getElementById(`sub-item-${wsIdx}-${subIdx}`);
            
            if (sub.status === "探索中" && sub.targetTimestamp) {
                const diff = sub.targetTimestamp - now;
                const element = document.getElementById(`countdown-${wsIdx}-${subIdx}`);

                if (diff <= 0) {
                    // Exploration finished!
                    sub.status = "已返航";
                    sub.targetTimestamp = null;
                    sub.alarmPlayed = true;
                    saveData();
                    stateChanged = true;

                    if (!activeAlarms.includes(sub.name)) {
                        activeAlarms.push(sub.name);
                        newAlarmsTriggered = true;
                    }
                    triggerBrowserNotification(sub.name);
                } else {
                    // Update remaining text countdown
                    if (element) {
                        const timeValSpan = element.querySelector(".time-val");
                        if (timeValSpan) {
                            timeValSpan.textContent = formatRemainingTime(diff);
                        }
                    }
                    // Update progress gradient background
                    if (subItem) {
                        const totalDur = sub.totalDurationMs || (24 * 60 * 60 * 1000);
                        const elapsed = totalDur - diff;
                        const pct = Math.max(0, Math.min(100, (elapsed / totalDur) * 100));
                        const color = getProgressColor(pct);
                        subItem.style.background = `linear-gradient(90deg, ${color} ${pct}%, rgba(0, 0, 0, 0.25) ${pct}%)`;
                    }
                }
            } else if (sub.status === "已返航") {
                // Keep soft green for returned state
                if (subItem) {
                    subItem.style.background = "rgba(85, 199, 108, 0.12)";
                }
                
                if (!sub.alarmPlayed) {
                    sub.alarmPlayed = true;
                    saveData();
                    stateChanged = true;
                    
                    if (!activeAlarms.includes(sub.name)) {
                        activeAlarms.push(sub.name);
                        newAlarmsTriggered = true;
                    }
                }
            } else {
                // Standby state background
                if (subItem) {
                    subItem.style.background = "rgba(0, 0, 0, 0.25)";
                }
            }
        });
    });

    // If new alarm is triggered, start looping notification chime
    if (newAlarmsTriggered) {
        triggerAlarmLoop();
    }

    // If a timer state switched to finished, redraw list to update colors
    if (stateChanged) {
        renderAllWorkshops();
    }
}

// Blend FFXIV green to FFXIV gold to FFXIV soft red based on progress % (0% = green, 100% = red)
// Opacity is kept at 0.07 (7%) to ensure high text contrast and legibility.
function getProgressColor(pct) {
    if (pct < 50) {
        const ratio = pct / 50;
        const r = Math.round(85 + (226 - 85) * ratio);
        const g = Math.round(199 + (186 - 199) * ratio);
        const b = Math.round(108 + (125 - 108) * ratio);
        return `rgba(${r}, ${g}, ${b}, 0.08)`;
    } else {
        const ratio = (pct - 50) / 50;
        const r = Math.round(226 + (229 - 226) * ratio);
        const g = Math.round(186 + (115 - 186) * ratio);
        const b = Math.round(125 + (115 - 125) * ratio);
        return `rgba(${r}, ${g}, ${b}, 0.08)`;
    }
}

// 4.1 Alarm Loop management
function triggerAlarmLoop() {
    const listElement = document.getElementById("alarm-sub-list");
    if (!listElement) return;

    listElement.innerHTML = "";
    activeAlarms.forEach(name => {
        const item = document.createElement("div");
        item.style.padding = "6px 12px";
        item.style.color = "var(--ff-text-gold)";
        item.style.fontWeight = "bold";
        item.style.fontSize = "14px";
        item.style.textAlign = "left";
        item.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="margin-right: 8px;"></i> ${name}`;
        listElement.appendChild(item);
    });

    openModal("alarm-modal");

    const customUrl = localStorage.getItem("ffxiv_sub_custom_audio_url") || "";
    if (customUrl) {
        if (!currentAudio) {
            currentAudio = new Audio(customUrl);
            currentAudio.loop = true;
            currentAudio.play().catch(e => {
                console.error("Failed to play custom alarm audio: ", e);
                startSynthesizedLoop();
            });
        }
    } else {
        startSynthesizedLoop();
    }
}

function startSynthesizedLoop() {
    if (!alarmIntervalId) {
        playNotificationSound(); // Play first chime immediately
        alarmIntervalId = setInterval(() => {
            playNotificationSound();
        }, 2500); // Repeat every 2.5 seconds
    }
}

function dismissAlarm() {
    // Stop sound interval
    if (alarmIntervalId) {
        clearInterval(alarmIntervalId);
        alarmIntervalId = null;
    }

    // Stop custom audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    // Clear alert list
    activeAlarms = [];

    // Close alarm dialog
    closeModal("alarm-modal");
}

// Format target timestamp to return time string (e.g. "今日 15:53" or "明日 20:34")
function formatReturnTime(targetTimestamp) {
    if (!targetTimestamp) return "";
    const targetDate = new Date(targetTimestamp);
    const nowDate = new Date();
    
    const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const nowMidnight = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
    const dayDiff = Math.round((targetMidnight - nowMidnight) / (24 * 60 * 60 * 1000));
    
    const hours = targetDate.getHours().toString().padStart(2, '0');
    const mins = targetDate.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${mins}`;

    if (dayDiff === 0) {
        return `今日 ${timeStr}`;
    } else if (dayDiff === 1) {
        return `明日 ${timeStr}`;
    } else if (dayDiff === 2) {
        return `後日 ${timeStr}`;
    } else {
        const month = targetDate.getMonth() + 1;
        const date = targetDate.getDate();
        return `${month}/${date} ${timeStr}`;
    }
}

// Format millisecond difference to FFXIV format: "1天08小時58分" or "08:58:12"
function formatRemainingTime(diffMs) {
    const totalSecs = Math.floor(diffMs / 1000);
    const secs = totalSecs % 60;
    const totalMins = Math.floor(totalSecs / 60);
    const mins = totalMins % 60;
    const totalHours = Math.floor(totalMins / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);

    let secStr = secs < 10 ? `0${secs}` : secs;
    let minStr = mins < 10 ? `0${mins}` : mins;
    let hourStr = hours < 10 ? `0${hours}` : hours;

    if (days > 0) {
        return `${days}天${hourStr}小時${minStr}分`;
    } else {
        return `${hourStr}:${minStr}:${secStr}`;
    }
}

// 5. Browser Push Notifications API
function triggerBrowserNotification(subName) {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
        new Notification(`FFXIV 工坊通知`, {
            body: `機體【${subName}】已順利返回工坊，可以進行下次探索！`,
            icon: "https://ffxiv.gamerescape.com/w/images/8/87/Submersible_Icon.png" // Placeholder fallback
        });
    }
}

// Request Notification Permission on load
if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
}

// 6. Modal dialog controllers
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("active"), 10);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove("active");
    setTimeout(() => modal.style.display = "none", 250);
}

// Preset timer time appliers
function applyPreset(days, hours, mins) {
    document.getElementById("input-days").value = days;
    document.getElementById("input-hours").value = hours;
    document.getElementById("input-mins").value = mins;
}

// Workshop modal operations
let editingWorkshopIndex = null;

function openAddWorkshopModal() {
    editingWorkshopIndex = null;
    document.getElementById("workshop-modal-title").textContent = "新增部隊工坊";
    document.getElementById("workshop-name").value = "";
    openModal("workshop-modal");
}

function openEditWorkshopName(wsIdx) {
    editingWorkshopIndex = wsIdx;
    document.getElementById("workshop-modal-title").textContent = "重新命名部隊";
    document.getElementById("workshop-name").value = workshops[wsIdx].name;
    openModal("workshop-modal");
}

function saveWorkshop() {
    const nameInput = document.getElementById("workshop-name").value.trim();
    if (!nameInput) {
        alert("請輸入部隊工坊名稱！");
        return;
    }

    if (editingWorkshopIndex === null) {
        // Add new
        const newWs = {
            name: nameInput,
            submersibles: [],
            charts: {}
        };
        for (const key in CHART_CONFIGS) {
            if (CHART_CONFIGS[key].startsUnlocked) {
                newWs.charts[key] = [...CHART_CONFIGS[key].startsUnlocked];
            } else {
                newWs.charts[key] = [];
            }
        }
        workshops.push(newWs);
    } else {
        // Edit name
        workshops[editingWorkshopIndex].name = nameInput;
    }

    saveData();
    renderAllWorkshops();
    closeModal("workshop-modal");
}

function confirmDeleteWorkshop(wsIdx) {
    if (confirm(`您確定要刪除部隊工坊【${workshops[wsIdx].name}】以及其下所有潛水艇資料嗎？此操作不可逆。`)) {
        workshops.splice(wsIdx, 1);
        saveData();
        renderAllWorkshops();
    }
}

// Submersible modal operations
function openAddSubmersibleModal(wsIdx) {
    document.getElementById("sub-modal-title").textContent = `註冊新機體 - ${workshops[wsIdx].name}`;
    document.getElementById("current-workshop-idx").value = wsIdx;
    document.getElementById("current-sub-idx").value = -1; // -1 indicates new item
    
    // Default values
    document.getElementById("sub-name").value = `潛水艇-${workshops[wsIdx].submersibles.length + 1}`;
    document.getElementById("sub-level").value = "50";
    document.getElementById("sub-type").value = "潜水艇";
    
    applyPreset(0, 0, 0);

    // Hide actions that don't apply to new registers
    document.getElementById("btn-standby-sub").style.display = "none";
    document.getElementById("btn-delete-sub").style.display = "none";
    
    openModal("sub-modal");
}

function openEditSubmersibleModal(wsIdx, subIdx) {
    const sub = workshops[wsIdx].submersibles[subIdx];
    
    document.getElementById("sub-modal-title").textContent = `機體探索設定 - ${sub.name}`;
    document.getElementById("current-workshop-idx").value = wsIdx;
    document.getElementById("current-sub-idx").value = subIdx;
    
    document.getElementById("sub-name").value = sub.name;
    document.getElementById("sub-level").value = sub.level;
    document.getElementById("sub-type").value = sub.type;
    
    // If exploring, pre-fill custom inputs with remaining diff time (rounded to mins)
    if (sub.status === "探索中" && sub.targetTimestamp) {
        const diffMs = sub.targetTimestamp - Date.now();
        if (diffMs > 0) {
            const totalMins = Math.floor(diffMs / (60 * 1000));
            const mins = totalMins % 60;
            const totalHours = Math.floor(totalMins / 60);
            const hours = totalHours % 24;
            const days = Math.floor(totalHours / 24);
            applyPreset(days, hours, mins);
        } else {
            applyPreset(0, 0, 0);
        }
    } else {
        applyPreset(0, 0, 0);
    }

    // Show management actions
    document.getElementById("btn-standby-sub").style.display = "inline-flex";
    document.getElementById("btn-delete-sub").style.display = "inline-flex";
    
    openModal("sub-modal");
}

function saveSubmersible() {
    const wsIdx = parseInt(document.getElementById("current-workshop-idx").value);
    const subIdx = parseInt(document.getElementById("current-sub-idx").value);
    
    const name = document.getElementById("sub-name").value.trim();
    const level = parseInt(document.getElementById("sub-level").value) || 1;
    const type = document.getElementById("sub-type").value;
    
    if (!name) {
        alert("請輸入機體名稱！");
        return;
    }

    // Calculate duration offset
    const days = parseInt(document.getElementById("input-days").value) || 0;
    const hours = parseInt(document.getElementById("input-hours").value) || 0;
    const mins = parseInt(document.getElementById("input-mins").value) || 0;
    
    const durationMs = ((days * 24 + hours) * 60 + mins) * 60 * 1000;

    let targetTimestamp = null;
    let status = "待命中";
    
    if (durationMs > 0) {
        status = "探索中";
        targetTimestamp = Date.now() + durationMs;
    }

    const subData = {
        name,
        level,
        type,
        status,
        targetTimestamp,
        totalDurationMs: durationMs,
        alarmPlayed: false
    };

    if (subIdx === -1) {
        // Register new (Max 4 per workshop)
        if (workshops[wsIdx].submersibles.length >= 4) {
            alert("此工坊已滿（最多可註冊 4 艘艇）！");
            return;
        }
        workshops[wsIdx].submersibles.push(subData);
    } else {
        // Update existing
        const prevSub = workshops[wsIdx].submersibles[subIdx];
        if (prevSub.status === "探索中" && status === "探索中") {
            const prevTarget = prevSub.targetTimestamp;
            if (Math.abs(prevTarget - targetTimestamp) < 60000) {
                subData.targetTimestamp = prevTarget;
                subData.totalDurationMs = prevSub.totalDurationMs || durationMs;
                subData.alarmPlayed = prevSub.alarmPlayed;
            }
        }
        workshops[wsIdx].submersibles[subIdx] = subData;
    }

    saveData();
    renderAllWorkshops();
    closeModal("sub-modal");
}

function setSubStandby() {
    const wsIdx = parseInt(document.getElementById("current-workshop-idx").value);
    const subIdx = parseInt(document.getElementById("current-sub-idx").value);
    
    if (wsIdx >= 0 && subIdx >= 0) {
        workshops[wsIdx].submersibles[subIdx].status = "待命中";
        workshops[wsIdx].submersibles[subIdx].targetTimestamp = null;
        workshops[wsIdx].submersibles[subIdx].alarmPlayed = false;
        
        saveData();
        renderAllWorkshops();
    }
    closeModal("sub-modal");
}

function deleteSubmersible() {
    const wsIdx = parseInt(document.getElementById("current-workshop-idx").value);
    const subIdx = parseInt(document.getElementById("current-sub-idx").value);
    
    if (wsIdx >= 0 && subIdx >= 0) {
        const subName = workshops[wsIdx].submersibles[subIdx].name;
        if (confirm(`您確定要刪除機體【${subName}】的所有登錄資料嗎？`)) {
            workshops[wsIdx].submersibles.splice(subIdx, 1);
            saveData();
            renderAllWorkshops();
            closeModal("sub-modal");
        }
    }
}

// 7. Timer Event Loop execution
loadData();
renderAllWorkshops();
setInterval(tickTimers, 1000);

// 8. Settings Panel controllers
function toggleSettings() {
    const panel = document.getElementById("settings-panel");
    const input = document.getElementById("custom-audio-url");
    if (panel.style.display === "none") {
        input.value = localStorage.getItem("ffxiv_sub_custom_audio_url") || "";
        panel.style.display = "block";
    } else {
        panel.style.display = "none";
    }
}

function saveCustomAudioUrl(value) {
    localStorage.setItem("ffxiv_sub_custom_audio_url", value.trim());
}

// 9. FC Workshop Map Unlock Progress Tracker Logic
function toggleMapPanel(wsIdx) {
    const panel = document.getElementById(`map-panel-${wsIdx}`);
    if (panel) {
        if (panel.style.display === "none") {
            panel.style.display = "block";
            expandedMapPanels[wsIdx] = true;
        } else {
            panel.style.display = "none";
            expandedMapPanels[wsIdx] = false;
        }
    }
}

function openChartModal(wsIdx, chartKey) {
    const ws = workshops[wsIdx];
    const chartConf = CHART_CONFIGS[chartKey];
    if (!ws || !chartConf) return;

    // Set hidden identifiers
    document.getElementById("chart-modal-ws-idx").value = wsIdx;
    document.getElementById("chart-modal-chart-key").value = chartKey;

    // Render title and count
    updateChartModalTitle(wsIdx, chartKey);

    const container = document.getElementById("chart-sites-container");
    container.innerHTML = "";

    if (chartConf.isVisual) {
        renderVisualMap(wsIdx, chartKey, container);
    } else {
        renderButtonGrid(wsIdx, chartKey, container);
    }

    openModal("chart-modal");
}

function renderButtonGrid(wsIdx, chartKey, container) {
    const ws = workshops[wsIdx];
    const chartConf = CHART_CONFIGS[chartKey];
    container.innerHTML = ""; // Clear existing elements first
    container.className = "sites-grid"; // Restore standard button list grid class

    chartConf.sites.forEach(site => {
        const btn = document.createElement("div");
        btn.className = "site-toggle-btn";
        btn.textContent = site;
        btn.dataset.site = site;

        const isUnlocked = ws.charts[chartKey] && ws.charts[chartKey].includes(site);
        if (isUnlocked) {
            btn.classList.add("selected");
        }

        btn.onclick = () => toggleSite(wsIdx, chartKey, site, btn);
        container.appendChild(btn);
    });
}

function renderVisualMap(wsIdx, chartKey, container) {
    const ws = workshops[wsIdx];
    const chartConf = CHART_CONFIGS[chartKey];
    container.innerHTML = ""; // Clear existing SVG elements first to prevent duplication
    container.className = "map-visual-container"; // Set map visual container layout style

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 680 700");
    svg.setAttribute("class", "map-svg");

    // 1. Draw connection paths (Links)
    const drawn = new Set();
    chartConf.sites.forEach(site => {
        site.connections.forEach(targetId => {
            const target = chartConf.sites.find(s => s.id === targetId);
            if (target) {
                const pairId = [site.id, targetId].sort().join("-");
                if (!drawn.has(pairId)) {
                    drawn.add(pairId);

                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", site.x);
                    line.setAttribute("y1", site.y);
                    line.setAttribute("x2", target.x);
                    line.setAttribute("y2", target.y);
                    line.setAttribute("class", "map-link");

                    // Connection is active if both endpoints are unlocked
                    const isSourceUnlocked = ws.charts[chartKey] && ws.charts[chartKey].includes(site.id);
                    const isTargetUnlocked = ws.charts[chartKey] && ws.charts[chartKey].includes(target.id);
                    if (isSourceUnlocked && isTargetUnlocked) {
                        line.classList.add("unlocked");
                    }
                    svg.appendChild(line);
                }
            }
        });
    });

    // 1.1 Draw Starting Point connection lines dynamically from startNode config
    if (chartConf.startNode) {
        chartConf.startNode.targets.forEach(targetId => {
            const target = chartConf.sites.find(s => s.id === targetId);
            if (target) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", chartConf.startNode.x);
                line.setAttribute("y1", chartConf.startNode.y);
                line.setAttribute("x2", target.x);
                line.setAttribute("y2", target.y);
                line.setAttribute("class", "map-link");

                if (ws.charts[chartKey] && ws.charts[chartKey].includes(targetId)) {
                    line.classList.add("unlocked");
                }
                svg.appendChild(line);
            }
        });
    }

    // 2. Draw nodes (G containing Circle + Label + Tooltip)
    chartConf.sites.forEach(site => {
        const isUnlocked = ws.charts[chartKey] && ws.charts[chartKey].includes(site.id);

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "map-node-group");
        if (isUnlocked) {
            g.classList.add("unlocked");
        }
        if (site.unlocks) {
            g.classList.add("special-node");
        }

        // Handle toggle state immediately on node click
        g.onclick = () => {
            const index = ws.charts[chartKey].indexOf(site.id);
            if (index === -1) {
                ws.charts[chartKey].push(site.id);
            } else {
                ws.charts[chartKey].splice(index, 1);
            }
            saveData();
            updateChartModalTitle(wsIdx, chartKey);
            // Redraw visual map to update link lines
            renderVisualMap(wsIdx, chartKey, container);
        };

        // Circle element (Enlarged to r=17)
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", site.x);
        circle.setAttribute("cy", site.y);
        circle.setAttribute("r", "17");
        circle.setAttribute("class", "map-node");
        g.appendChild(circle);

        // Site name text
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", site.x);
        label.setAttribute("y", site.y + 5); // Centered offset for larger radius
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("class", "map-node-label");
        label.textContent = site.id;
        g.appendChild(label);

        // Custom Hover Tooltip for special unlock nodes
        if (site.unlocks) {
            const tooltip = document.createElementNS("http://www.w3.org/2000/svg", "text");
            tooltip.setAttribute("x", site.x);
            tooltip.setAttribute("y", site.y - 25); // Adjusted to match larger radius
            tooltip.setAttribute("text-anchor", "middle");
            tooltip.setAttribute("class", "map-node-tooltip");
            tooltip.textContent = getSpecialUnlockShortText(site.id, chartKey);
            g.appendChild(tooltip);

            // Native fallback title tooltip for accessibility
            const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title.textContent = `解鎖需求：${site.unlocks}`;
            g.appendChild(title);
        }

        svg.appendChild(g);
    });

    // 3. Draw Starting Point Node (Static, non-clickable, neutral color)
    if (chartConf.startNode) {
        const startG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        startG.setAttribute("class", "map-node-group-static");

        const startCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        startCircle.setAttribute("cx", chartConf.startNode.x);
        startCircle.setAttribute("cy", chartConf.startNode.y);
        startCircle.setAttribute("r", "17");
        startCircle.setAttribute("class", "map-start-node");
        startG.appendChild(startCircle);

        const startLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        startLabel.setAttribute("x", chartConf.startNode.x);
        startLabel.setAttribute("y", chartConf.startNode.y + 4);
        startLabel.setAttribute("text-anchor", "middle");
        startLabel.setAttribute("class", "map-start-label");
        startLabel.textContent = "起點";
        startG.appendChild(startLabel);

        svg.appendChild(startG);
    }

    container.appendChild(svg);
}

function getSpecialUnlockShortText(nodeId, chartKey) {
    if (chartKey === "drowned_city") {
        switch (nodeId) {
            case "J": return "解鎖第 2 艘潛水艇";
            case "O": return "解鎖第 3 艘潛水艇";
            case "T": return "解鎖第 4 艘潛水艇";
            case "AD": return "解鎖灰海地圖";
        }
    } else if (chartKey === "jade_sea") {
        switch (nodeId) {
            case "R": return "解鎖翠浪海地圖";
        }
    }
    return "";
}

function updateChartModalTitle(wsIdx, chartKey) {
    const ws = workshops[wsIdx];
    const chartConf = CHART_CONFIGS[chartKey];
    const unlockedCount = ws.charts[chartKey] ? ws.charts[chartKey].length : 0;
    
    // Total sites depends on structure type
    const totalCount = chartConf.sites.length;
    document.getElementById("chart-modal-title").textContent = `${chartConf.name} (${unlockedCount}/${totalCount})`;
}

function toggleSite(wsIdx, chartKey, site, btnElement) {
    const ws = workshops[wsIdx];
    if (!ws) return;

    if (!ws.charts[chartKey]) {
        ws.charts[chartKey] = [];
    }

    const index = ws.charts[chartKey].indexOf(site);
    if (index === -1) {
        ws.charts[chartKey].push(site);
        btnElement.classList.add("selected");
    } else {
        ws.charts[chartKey].splice(index, 1);
        btnElement.classList.remove("selected");
    }

    // Save IMMEDIATELY on every click
    saveData();
    updateChartModalTitle(wsIdx, chartKey);
}

function chartBulkAction(actionType) {
    const wsIdx = parseInt(document.getElementById("chart-modal-ws-idx").value);
    const chartKey = document.getElementById("chart-modal-chart-key").value;
    const ws = workshops[wsIdx];
    const chartConf = CHART_CONFIGS[chartKey];
    if (!ws || !chartConf) return;

    if (chartConf.isVisual) {
        if (actionType === "all") {
            ws.charts[chartKey] = chartConf.sites.map(s => s.id);
        } else if (actionType === "clear") {
            ws.charts[chartKey] = [];
        }
        
        saveData();
        updateChartModalTitle(wsIdx, chartKey);
        
        // Redraw SVG Visual map
        const container = document.getElementById("chart-sites-container");
        renderVisualMap(wsIdx, chartKey, container);
    } else {
        const btns = document.querySelectorAll("#chart-sites-container .site-toggle-btn");
        if (actionType === "all") {
            ws.charts[chartKey] = [...chartConf.sites];
            btns.forEach(btn => btn.classList.add("selected"));
        } else if (actionType === "clear") {
            ws.charts[chartKey] = [];
            btns.forEach(btn => btn.classList.remove("selected"));
        }
        
        saveData();
        updateChartModalTitle(wsIdx, chartKey);
    }
}

function closeChartModal() {
    closeModal("chart-modal");
    // Redraw list to reflect updated counts on the badges
    renderAllWorkshops();
}

// 10. Submersible Stats Calculator Logic
function openStatsCalculator() {
    // 1. Populate level options 1 to 95 if not already populated
    const lvlSelect = document.getElementById("calc-level");
    if (lvlSelect.options.length === 0) {
        for (let lvl = 1; lvl <= 95; lvl++) {
            const opt = document.createElement("option");
            opt.value = lvl;
            opt.textContent = `Lv. ${lvl}`;
            lvlSelect.appendChild(opt);
        }
        // Default to Lv. 50 to showcase some parts without bonus
        lvlSelect.value = "50";
    }

    // 2. Initialize or update part dropdowns
    updatePartDropdowns();

    // 3. Open Modal
    openModal("stats-modal");
}

function onCalcLevelChange() {
    // Re-filter and rebuild dropdowns, keeping selected items if still valid
    updatePartDropdowns();
}

function getPartPrefix(name) {
    switch (name) {
        case "鯊魚級": return "1. ";
        case "甲鱟級": return "2. ";
        case "鬚鯨級": return "3. ";
        case "腔棘魚級": return "4. ";
        case "希爾德拉級": return "5. ";
        case "鯊魚改級": return "1改. ";
        case "甲鱟改級": return "2改. ";
        case "鬚鯨改級": return "3改. ";
        case "腔棘魚改級": return "4改. ";
        case "希爾德拉改級": return "5改. ";
        default: return "";
    }
}

function updatePartDropdowns() {
    const level = parseInt(document.getElementById("calc-level").value) || 1;
    const parts = ["hull", "stern", "bow", "bridge"];

    parts.forEach(partKey => {
        const select = document.getElementById(`calc-${partKey}`);
        if (!select) return;
        const prevValue = select.value; // Try to keep previous selection if valid

        // Clear select
        select.innerHTML = "";

        // Fill options where minLevel <= level
        const partConfig = PART_STATS[partKey];
        for (const name in partConfig) {
            const item = partConfig[name];
            if (item.minLevel <= level) {
                const opt = document.createElement("option");
                opt.value = name;
                opt.textContent = `${getPartPrefix(name)}${name} (Lv. ${item.minLevel}+)`;
                select.appendChild(opt);
            }
        }

        // Restore selection if valid, otherwise it defaults to first valid option (鯊魚級)
        if (prevValue && partConfig[prevValue] && partConfig[prevValue].minLevel <= level) {
            select.value = prevValue;
        }
    });

    // Recalculate values immediately
    calculateSubStats();
}

function calculateSubStats() {
    const level = parseInt(document.getElementById("calc-level").value) || 1;
    
    // Get parts select elements
    const hullSelect = document.getElementById("calc-hull");
    const sternSelect = document.getElementById("calc-stern");
    const bowSelect = document.getElementById("calc-bow");
    const bridgeSelect = document.getElementById("calc-bridge");

    if (!hullSelect || !sternSelect || !bowSelect || !bridgeSelect) return;

    // Get parts values
    const hullName = hullSelect.value;
    const sternName = sternSelect.value;
    const bowName = bowSelect.value;
    const bridgeName = bridgeSelect.value;

    // Default arrays
    const defaultStats = [0, 0, 0, 0, 0];
    
    // Fetch stats
    const hullStats = (PART_STATS.hull[hullName] && PART_STATS.hull[hullName].stats) || defaultStats;
    const sternStats = (PART_STATS.stern[sternName] && PART_STATS.stern[sternName].stats) || defaultStats;
    const bowStats = (PART_STATS.bow[bowName] && PART_STATS.bow[bowName].stats) || defaultStats;
    const bridgeStats = (PART_STATS.bridge[bridgeName] && PART_STATS.bridge[bridgeName].stats) || defaultStats;

    // Fetch level bonus
    const lvlBonus = (level >= 51 && LEVEL_BONUS[level]) ? LEVEL_BONUS[level] : defaultStats;

    // Calculate sums
    const surveillance = hullStats[0] + sternStats[0] + bowStats[0] + bridgeStats[0] + lvlBonus[0];
    const retrieval = hullStats[1] + sternStats[1] + bowStats[1] + bridgeStats[1] + lvlBonus[1];
    const speed = hullStats[2] + sternStats[2] + bowStats[2] + bridgeStats[2] + lvlBonus[2];
    const range = hullStats[3] + sternStats[3] + bowStats[3] + bridgeStats[3] + lvlBonus[3];
    const favor = hullStats[4] + sternStats[4] + bowStats[4] + bridgeStats[4] + lvlBonus[4];

    // Update UI elements
    document.getElementById("stat-val-surveillance").textContent = surveillance;
    document.getElementById("stat-val-retrieval").textContent = retrieval;
    document.getElementById("stat-val-speed").textContent = speed;
    document.getElementById("stat-val-range").textContent = range;
    document.getElementById("stat-val-favor").textContent = favor;
}
