// ==========================================================================
// FFXIV Submersible Timer - Application Logic
// ==========================================================================

// 1. Data Structure & Seeding Initial Data (from User Image 2)
let workshops = [];
let activeAlarms = [];
let alarmIntervalId = null;
let currentAudio = null;

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
                <button class="icon-action-btn" onclick="openEditWorkshopName(${wsIdx})" title="重新命名部隊"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="icon-action-btn delete" onclick="confirmDeleteWorkshop(${wsIdx})" title="刪除部隊工坊"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        card.appendChild(header);

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
        workshops.push({
            name: nameInput,
            submersibles: []
        });
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
