var historyData = JSON.parse(localStorage.getItem('TA_history')) || [];
var selectedHistoryIds = new Set();

const TA_INPUT_IDS = [
    "character_type",
    "attack",
    "defense",
    "hp",
    "special_attack",
    "special_defense",
    "crit_chance",
    "crit_damage",
    "back_attack_dmg",
    "hp_recovery",
    "mp_recovery",

    "all_skill_dmg",
    "boss_dmg",
    "polarize",
    "normal_skill_dmg",
    "awk_skill_dmg",
    "mp1_dmg",
    "mp2_dmg",
    "mp3_dmg",
    "mp4_dmg",
    
    "mp_cost",
    "mp1_cost",
    "mp2_cost", 
    "mp3_cost",
    "mp4_cost",
    "general_cd",
    "mp1_cd",
    "mp2_cd",
    "mp3_cd",
    "mp4_cd",

    "hell_spear_chance",
    "hell_spear_dmg",
    "crit_dmg_red",
];

const TA_LABELS = {
    "character_type": "Personagem",
    "attack": "Ataque",
    "defense": "Defesa",
    "hp": "HP",
    "special_attack": "Ataque Especial",
    "special_defense": "Defesa Especial",
    "crit_chance": "Chance de Crítico (%)",
    "crit_damage": "Dano Crítico (%)", 
    "back_attack_dmg": "Dano Ataque Costas (%)",
    "hp_recovery": "Recuperação de HP (%)", 
    "mp_recovery": "Recuperação de MP / AP (%)",
    
    "all_skill_dmg": "Dano Todas as Habilidades (%)",
    "boss_dmg": "Dano Causado a Chefes (%)",
    "polarize": "Atacar / Ser Atacado (%)",
    "normal_skill_dmg": "Dano Hab. Normal (%)",
    "awk_skill_dmg": "Dano Hab. Despertar (%)",
    "mp1_dmg": "Dano MP1 (%)",
    "mp2_dmg": "Dano MP2 (%)",
    "mp3_dmg": "Dano MP3 (%)",
    "mp4_dmg": "Dano MP4 (%)",

    "mp_cost": "Red. Custo de MP (%)",
    "mp1_cost": "Red. Custo MP1 (%)",
    "mp2_cost": "Red. Custo MP2 (%)",
    "mp3_cost": "Red. Custo MP3 (%)",
    "mp4_cost": "Red. Custo MP4 (%)",
    "general_cd": "Red. Cooldown Geral (%)",
    "mp1_cd": "Red. Cooldown MP1 (%)",
    "mp2_cd": "Red. Cooldown MP2 (%)",
    "mp3_cd": "Red. Cooldown MP3 (%)",
    "mp4_cd": "Red. Cooldown MP4 (%)",

    "hell_spear_chance": "Chance Lança Infernal (%)",
    "hell_spear_dmg": "Dano Lança Infernal",
    "crit_dmg_red": "Red. Dano Crítico (%)",
};

function saveHistory() {
    localStorage.setItem('TA_history', JSON.stringify(historyData));
}

function formatStatValue(id, val) {
    if (val === undefined || val === null || val === "") return val;
    if (isNaN(val)) return val;
    
    let num = parseFloat(val);
    let displayVal = num.toString();
    
    if (num % 1 !== 0) {
        displayVal = num.toFixed(2);
    }
    
    const label = TA_LABELS[id] || "";
    if (label.includes("(%)")) {
        displayVal = `${displayVal}%`;
    }
    
    return displayVal;
}

function saveCurrentTA() {
    const resultSpan = document.querySelector("#result .yellow");
    
    if (!resultSpan || resultSpan.innerText === "-" || resultSpan.innerText === "0") {
        showAlert("Atenção", "Calcule um valor válido antes de salvar!", "warning");
        return;
    }

    askInput(
        "Salvar Resultado", 
        "", 
        (buildName) => {
            const mainAttackString = resultSpan.innerText.split("±")[0];
            const currentBuild = {
                id: Date.now(),
                count: historyData.length + 1,
                customName: buildName,
                totalAttack: resultSpan.innerText,
                rawTotalAttack: parseInt(mainAttackString.replace(/\D/g, '')),
                isFavorite: false,
                isCollapsed: false,
                inputs: {}
            };

            TA_INPUT_IDS.forEach(id => {
                const el = document.getElementById(id);
                if (el) currentBuild.inputs[id] = el.value || "0";
            });

            historyData.push(currentBuild);
            saveHistory();
            renderHistory();
            showToast("Resultado salvo!");
        }, 
        "ex: Build Dano Crítico"
    );
}

function renderHistory() {
    const resultList = document.getElementById("resultList"); 
    const historySection = document.getElementById("history-section");
    
    if (!resultList) return; 
    resultList.innerHTML = "";

    if (historyData.length === 0) {
        if (historySection) historySection.style.display = "none";
        return; 
    } else {
        if (historySection) historySection.style.display = "block";
    }

    const count = selectedHistoryIds.size;
    const isReady = count === 2;
    const compareDisabled = count !== 2 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : '';
    const compareText = count === 2 ? "Comparar Selecionados" : `Comparar (${count}/2)`;
    const tooltipAttr = !isReady ? 'title="Marque dois resultados para compará-los"' : '';

    resultList.innerHTML += `
        <div style="display: flex; flex-direction: column; margin-bottom: 20px;">
            <h2 style="text-align: center; color: white; margin: 0 0 15px 0; font-family: 'Montserrat', sans-serif;">
                Histórico
            </h2>
            <div style="display: flex; justify-content: center; align-items: center; gap: 15px; flex-wrap: wrap;">
                <div ${tooltipAttr}>
                    <button onclick="compareSelected()" class="compare-btn" ${compareDisabled} style="width: auto; min-width: 160px; padding: 8px 20px;">
                        ${compareText}
                    </button>
                </div>
                <button onclick="clearHistory()" class="clear-btn">
                    Limpar Tudo
                </button>
            </div>
        </div>
    `;

    [...historyData].reverse().forEach((item) => {
        const displayTitle = `<span class="yellow">#${item.count}:</span>&nbsp;${item.customName}`;
        const isChecked = selectedHistoryIds.has(item.id) ? "checked" : "";
        const isFav = item.isFavorite === true;
        const favColor = isFav ? "#FFD700" : "currentColor";
        const favFill = isFav ? "#FFD700" : "none";
        const wrapperId = `history-wrapper-${item.id}`;
        const iconId = `collapse-icon-${item.id}`;
        const wrapperClass = item.isCollapsed ? 'history-anim-wrapper collapsed' : 'history-anim-wrapper';
        const iconClass = item.isCollapsed ? 'collapse-icon-svg icon-rotated' : 'collapse-icon-svg';

        const getStatLine = (id) => {
            const val = item.inputs[id];
            if (val && val !== 0 && val !== "MP") {
                const displayVal = formatStatValue(id, val);
                return `<div class="response-list-item-value">${TA_LABELS[id] || id}: <span class='history-stat-value'>${displayVal}</span></div>`;
            }
            return "";
        };

        const htmlItem = `
          <div class="response-list-item">
            <div class="response-list-header">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" class="history-checkbox" onchange="toggleHistorySelection(${item.id}, this)" ${isChecked}>
                    <div class="response-list-item-title" style="text-align: left; margin:0;">
                        ${displayTitle}
                    </div>
                </div>

                <div class="action-buttons">
                    <button class="icon-btn fav-btn" onclick="toggleFavorite(${item.id})" title="Favoritar">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="${favColor}" stroke-width="2" fill="${favFill}" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </button>
                    <button class="icon-btn load-btn" onclick="loadHistoryItem(${item.id})" title="Carregar estes dados">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                            <path d="M12 12v9"></path>
                            <path d="m16 16-4-4-4 4"></path>
                        </svg>
                    </button>
                    <button class="icon-btn edit-btn" onclick="editHistoryItem(${item.id})" title="Renomear cálculo">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="icon-btn delete-btn" onclick="deleteHistoryItem(${item.id})" title="Excluir cálculo">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                    <button class="icon-btn collapse-btn" onclick="toggleItemCollapse(${item.id})" title="Expandir/Colapsar">
                        <svg id="${iconId}" class="${iconClass}" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

            <div id="${wrapperId}" class="${wrapperClass}">
                <div class="history-anim-inner">
                    <div class="response-list-item-content">
                        
                        <!-- Coluna 1: Status Base -->
                        <div class="stat-group">
                            <div class="response-list-item-title" style="color:#FFB347; font-weight:bold; border-bottom:1px solid rgba(255,255,255,0.1); margin-bottom:5px;">Status Base</div>
                            <div class="response-list-item-value">Tipo de Personagem: <span class='history-stat-value'>${item.inputs.character_type}</span></div>
                            ${getStatLine('attack')}
                            ${getStatLine('defense')}
                            ${getStatLine('hp')}
                            ${getStatLine('special_attack')}
                            ${getStatLine('special_defense')}
                            ${getStatLine('crit_chance')}
                            ${getStatLine('crit_damage')}
                            ${getStatLine('back_attack_dmg')}
                            ${getStatLine('hp_recovery')}
                            ${getStatLine('mp_recovery')}
                        </div>

                        <!-- Coluna 2: Buffs -->
                        <div class="stat-group">
                            <div class="response-list-item-title" style="color:#CE6363; font-weight:bold; border-bottom:1px solid rgba(255,255,255,0.1); margin-bottom:5px;">Buffs</div>
                            ${getStatLine('all_skill_dmg')}
                            ${getStatLine('boss_dmg')}
                            ${getStatLine('polarize')}
                            ${getStatLine('normal_skill_dmg')}
                            ${getStatLine('awk_skill_dmg')}
                            ${getStatLine('mp1_dmg')}
                            ${getStatLine('mp2_dmg')}
                            ${getStatLine('mp3_dmg')}
                            ${getStatLine('mp4_dmg')}
                        </div>

                        <!-- Coluna 3: Suporte -->
                        <div class="stat-group">
                            <div class="response-list-item-title" style="color:#2EFFA8; font-weight:bold; border-bottom:1px solid rgba(255,255,255,0.1); margin-bottom:5px;">Suporte</div>
                            ${getStatLine('mp_cost')}
                            ${getStatLine('mp1_cost')}
                            ${getStatLine('mp2_cost')}
                            ${getStatLine('mp3_cost')}
                            ${getStatLine('mp4_cost')}
                            ${getStatLine('general_cd')}
                            ${getStatLine('mp1_cd')}
                            ${getStatLine('mp2_cd')}
                            ${getStatLine('mp3_cd')}
                            ${getStatLine('mp4_cd')}
                        </div>

                        <!-- Coluna 4: Etc -->
                        <div class="stat-group">
                            <div class="response-list-item-title" style="color:#5DADE2; font-weight:bold; border-bottom:1px solid rgba(255,255,255,0.1); margin-bottom:5px;">Etc</div>
                            ${getStatLine('hell_spear_chance')}
                            ${getStatLine('hell_spear_dmg')}
                            ${getStatLine('crit_dmg_red')}
                        </div>

                    </div>
                    
                    <div class="stat-group result-group" style="margin-top: 15px;">
                        <div class="response-list-item-TA" style="font-size:1.2rem;">Ataque Total: <span class="yellow">${item.totalAttack}</span></div>
                    </div>
                </div>
            </div>
          </div>
        `;
        resultList.innerHTML += htmlItem;
    });
}

function toggleHistorySelection(id, checkbox) {
    if (checkbox.checked) {
        if (selectedHistoryIds.size >= 2) {
            checkbox.checked = false;
            showAlert('Limite atingido', 'Você só pode selecionar 2 itens para comparar.', 'warning');
            return;
        }
        selectedHistoryIds.add(id);
    } else {
        selectedHistoryIds.delete(id);
    }
    renderHistory();
}

function compareSelected() {
    if (selectedHistoryIds.size !== 2) return;

    const ids = Array.from(selectedHistoryIds);
    const itemA = historyData.find(i => i.id === ids[0]);
    const itemB = historyData.find(i => i.id === ids[1]);

    if (!itemA || !itemB) return;

    const generateCells = (valA, valB) => {
        const format = (v) => v.toLocaleString('pt-BR');
        if (valA > valB) {
            const diff = valB !== 0 ? ((valA / valB) - 1) * 100 : 100;
            return {
                htmlA: `<span class="winner-val">${format(valA)}</span> <span class="diff-badge">▲ ${diff.toFixed(2)}%</span>`,
                htmlB: `<span class="compare-val">${format(valB)}</span>`
            };
        } else if (valB > valA) {
            const diff = valA !== 0 ? ((valB / valA) - 1) * 100 : 100;
            return {
                htmlA: `<span class="compare-val">${format(valA)}</span>`,
                htmlB: `<span class="winner-val">${format(valB)}</span> <span class="diff-badge">▲ ${diff.toFixed(2)}%</span>`
            };
        } else {
            return {
                htmlA: `<span class="compare-val">${format(valA)}</span>`,
                htmlB: `<span class="compare-val">${format(valB)}</span>`
            };
        }
    };

    const getStatRow = (id, suffix = '') => {
        const baseA = parseFloat(itemA.inputs[id]) || 0;
        const baseB = parseFloat(itemB.inputs[id]) || 0;

        let iconA = '', iconB = '';
        const symUp = '<span style="color: #7ffa4e; margin-left: 5px; font-size: 0.9em;">▲</span>';
        const symDown = '<span style="color: #ff5252; margin-left: 5px; font-size: 0.9em;">▼</span>';

        if (baseA > baseB) { iconA = symUp; iconB = symDown; } 
        else if (baseB > baseA) { iconA = symDown; iconB = symUp; }

        
        const displayA = formatStatValue(id, baseA);
        const displayB = formatStatValue(id, baseB);

        return `
            <tr class="compare-extra-row">
                <td>${TA_LABELS[id] || id}</td>
                <td>${displayA}${suffix}${iconA}</td>
                <td>${displayB}${suffix}${iconB}</td>
            </tr>
        `;
    };

    const rowTA = generateCells(itemA.rawTotalAttack, itemB.rawTotalAttack);
    const getName = (item) => `Build #${item.count}<br><span style="font-size:0.75em; color:#aaa; font-weight:normal">${item.customName}</span>`;
    const detailsHtml = TA_INPUT_IDS.filter(id => id !== "character_type").map(id => getStatRow(id)).join('');

    const modalText = document.getElementById('modalText');
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');
    const overlay = document.getElementById('overlay');

    modalText.innerHTML = `
        <div class="modal-header">
            <div class="modal-name">Comparativo de Ataque Total</div>
        </div>
        <div class="modal-body">
            <table class="compare-table" style="table-layout: fixed; width: 100%;">
                <thead>
                    <tr>
                        <th style="width: 45%;">STATUS</th>
                        <th style="width: 27.5%; line-height: 1em;">${getName(itemA)}</th>
                        <th style="width: 27.5%; line-height: 1em;">${getName(itemB)}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="compare-row-label">Ataque Total</td>
                        <td>${rowTA.htmlA}</td>
                        <td>${rowTA.htmlB}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="padding: 0; border: none;">
                            <button class="toggle-details-btn" onclick="toggleCompareDetails(this)">
                                ▼ Mostrar Status ▼
                            </button>
                        </td>
                    </tr>
                    ${detailsHtml}
                </tbody>
            </table>
            <div style="margin: 15px; text-align: center; font-size: 0.9em; color: #aaa;">
                <span class="diff-badge" style="font-size: 12px;">▲ X%</span> Indica a porcentagem de diferença que a build com maior TA tem em relação à menor.
            </div>
        </div>
    `;

    overlay.classList.add('show');
    modal.style.display = 'block';
    document.body.classList.add('no-scroll');
    setTimeout(() => modalContent.classList.add('show'), 10);
}

window.toggleCompareDetails = function(btn) {
    const rows = document.querySelectorAll('.compare-extra-row');
    const isClosed = rows.length > 0 && !rows[0].classList.contains('open');

    rows.forEach(row => isClosed ? row.classList.add('open') : row.classList.remove('open'));

    if (isClosed) {
        btn.innerHTML = '▲ Ocultar Status ▲';
        btn.style.color = '#fff';
        btn.style.borderColor = '#666';
    } else {
        btn.innerHTML = '▼ Mostrar Status ▼';
        btn.style.color = '#aaa';
        btn.style.borderColor = '#444';
    }
}

function loadHistoryItem(id) {
    const item = historyData.find(entry => entry.id === id);
    if (!item) {
        showAlert("Erro", "Item não encontrado no histórico.", "error");
        return;
    }

    askConfirm(
        'Carregar Cálculo?',
        'Os dados atuais da tela serão substituídos pelas informações deste salvo. Continuar?',
        () => {
            TA_INPUT_IDS.forEach(inputId => {
                const el = document.getElementById(inputId);
                if (el && item.inputs[inputId] !== undefined) {
                    el.value = item.inputs[inputId];
                }
            });

            TA();

            const targetSection = document.getElementById('data_enter');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetSection.classList.remove('data-loaded-highlight');
                setTimeout(() => targetSection.classList.add('data-loaded-highlight'), 50);
                setTimeout(() => targetSection.classList.remove('data-loaded-highlight'), 1500);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            showToast("Cálculo carregado com sucesso!");
        }
    );
}

function deleteHistoryItem(id) {
    askConfirm(
        "Tem certeza?", 
        "Você não poderá reverter a exclusão deste cálculo.", 
        () => {
            historyData = historyData.filter(item => item.id !== id);
            selectedHistoryIds.delete(id);
            saveHistory();
            renderHistory();
            showToast("Cálculo excluído!");
        }
    );
}

function editHistoryItem(id) {
    const item = historyData.find(i => i.id === id);
    if (item) {
        askInput(
            "Renomear Cálculo",
            "", 
            (newName) => {
                item.customName = newName;
                saveHistory();
                renderHistory();
                showToast('Nome atualizado!');
            },
            "ex: Build de dano crítico"
        );
    }
}

function clearHistory() {
    askConfirm(
        "Limpar histórico?", 
        "Todos os cálculos (exceto Favoritos) serão excluídos permanentemente. Continuar?", 
        () => {
            historyData = historyData.filter(item => item.isFavorite === true);
            const remainingIds = new Set(historyData.map(i => i.id));
            selectedHistoryIds = new Set([...selectedHistoryIds].filter(id => remainingIds.has(id)));
            saveHistory();
            renderHistory();
            showToast("Histórico limpo!");
        }
    );
}

function toggleFavorite(id) {
    const item = historyData.find(i => i.id === id);
    if (item) {
        item.isFavorite = !item.isFavorite;
        saveHistory();
        renderHistory();
    }
}

function toggleItemCollapse(id) {
    const wrapper = document.getElementById(`history-wrapper-${id}`);
    const icon = document.getElementById(`collapse-icon-${id}`);
    
    if (wrapper) wrapper.classList.toggle('collapsed');
    if (icon) icon.classList.toggle('icon-rotated');
    
    const item = historyData.find(i => i.id === id);
    if (item) {
        item.isCollapsed = !item.isCollapsed;
        saveHistory();
    }
}

window.addEventListener('load', renderHistory);