'use strict';

const STORAGE_KEY = 'game-session-tracker';
const DEFAULT_STATE = {
  resetTarget: 50,
  totalGames: 0,
  players: [],
};

const resetTargetSelect = document.getElementById('reset-target');
const playerForm = document.getElementById('player-form');
const playerNameInput = document.getElementById('player-name');
const roundForm = document.getElementById('round-form');
const roundInputs = document.getElementById('round-inputs');
const winnerSelect = document.getElementById('winner-select');
const asafSelect = document.getElementById('asaf-select');
const playersList = document.getElementById('players-list');
const resetSessionButton = document.getElementById('reset-session');
const totalGamesElement = document.getElementById('total-games');
const playersCountElement = document.getElementById('players-count');
const targetSummaryElement = document.getElementById('target-summary');
const roundHelpElement = document.getElementById('round-help');
const feedbackElement = document.getElementById('feedback');

let state = loadState();

function createDefaultState() {
  return {
    resetTarget: DEFAULT_STATE.resetTarget,
    totalGames: DEFAULT_STATE.totalGames,
    players: [],
  };
}

function generateId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  return `player-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[character];
  });
}

function createPlayer(name) {
  return {
    id: generateId(),
    name,
    score: 0,
    gamesPlayed: 0,
    wins: 0,
    asafim: 0,
  };
}

function loadState() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (!savedState) {
      return createDefaultState();
    }

    const parsedState = JSON.parse(savedState);

    if (!Array.isArray(parsedState.players)) {
      return createDefaultState();
    }

    return {
      resetTarget:
        parsedState.resetTarget === 100 || parsedState.resetTarget === 50
          ? parsedState.resetTarget
          : DEFAULT_STATE.resetTarget,
      totalGames: Number.isInteger(parsedState.totalGames)
        ? parsedState.totalGames
        : DEFAULT_STATE.totalGames,
      players: parsedState.players
        .filter(player => player && typeof player.name === 'string')
        .map(player => ({
          id:
            typeof player.id === 'string' && /^[a-zA-Z0-9-]+$/.test(player.id)
              ? player.id
              : generateId(),
          name: player.name.trim(),
          score: Number.isFinite(player.score) ? player.score : 0,
          gamesPlayed: Number.isFinite(player.gamesPlayed) ? player.gamesPlayed : 0,
          wins: Number.isFinite(player.wins) ? player.wins : 0,
          asafim: Number.isFinite(player.asafim) ? player.asafim : 0,
        }))
        .filter(player => player.name !== ''),
    };
  } catch (error) {
    return createDefaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setFeedback(message, isError = false) {
  feedbackElement.textContent = message;
  feedbackElement.classList.toggle('error', isError);
}

function getPlayerOptions(includeEmptyOption = false) {
  const options = [];

  if (includeEmptyOption) {
    options.push('<option value="">ללא</option>');
  }

  state.players.forEach(player => {
    options.push(
      `<option value="${player.id}">${escapeHtml(player.name)}</option>`
    );
  });

  return options.join('');
}

function renderSummary() {
  resetTargetSelect.value = String(state.resetTarget);
  targetSummaryElement.textContent = String(state.resetTarget);
  totalGamesElement.textContent = String(state.totalGames);
  playersCountElement.textContent = String(state.players.length);
}

function renderRoundForm() {
  if (state.players.length === 0) {
    roundInputs.innerHTML = '';
    winnerSelect.innerHTML = '<option value="">יש להוסיף שחקנים</option>';
    asafSelect.innerHTML = '<option value="">ללא</option>';
    roundHelpElement.textContent = 'יש להוסיף לפחות שחקן אחד כדי להתחיל לתעד נתונים.';
    roundForm.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  roundInputs.innerHTML = state.players
    .map(
      player => `
        <label class="round-row" for="score-${player.id}">
          <span class="round-player-name">${escapeHtml(player.name)}</span>
          <input
            id="score-${player.id}"
            class="field-control"
            type="number"
            inputmode="numeric"
            min="0"
            name="score-${player.id}"
            data-score-input="${player.id}"
            value="0"
            required
          />
        </label>
      `
    )
    .join('');

  winnerSelect.innerHTML = getPlayerOptions();
  asafSelect.innerHTML = getPlayerOptions(true);
  roundHelpElement.textContent =
    'כל שמירת סיבוב מעדכנת ניקוד, משחקים, ניצחונות, אאספים וסך משחקי הסשן.';
  roundForm.querySelector('button[type="submit"]').disabled = false;
}

function renderPlayers() {
  if (state.players.length === 0) {
    playersList.innerHTML = `
      <div class="empty-state">
        עדיין אין שחקנים בסשן. הוסף שחקן כדי להתחיל לעקוב אחרי המשחק.
      </div>
    `;
    return;
  }

  playersList.innerHTML = state.players
    .map(player => {
      const isOverTarget = player.score > state.resetTarget;

      return `
        <article class="player-card${isOverTarget ? ' over-target' : ''}">
          <div class="player-card-header">
            <div>
              <div class="player-name">${escapeHtml(player.name)}</div>
              <div class="player-score${isOverTarget ? ' over-target' : ''}">
                ${player.score}
              </div>
            </div>
            <button
              class="remove-button"
              type="button"
              data-remove-player="${player.id}"
              aria-label="מחיקת ${escapeHtml(player.name)} מהסשן"
            >
              מחיקה
            </button>
          </div>
          <div class="player-stats">
            <div class="player-stat">
              <span>משחקים</span>
              <strong>${player.gamesPlayed}</strong>
            </div>
            <div class="player-stat">
              <span>ניצחונות</span>
              <strong>${player.wins}</strong>
            </div>
            <div class="player-stat">
              <span>אאספים</span>
              <strong>${player.asafim}</strong>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

function render() {
  renderSummary();
  renderRoundForm();
  renderPlayers();
  saveState();
}

function addPlayer(name) {
  const normalizedName = name.trim();

  if (normalizedName === '') {
    setFeedback('יש להזין שם שחקן תקין.', true);
    return;
  }

  const duplicatePlayer = state.players.some(
    player => player.name.toLowerCase() === normalizedName.toLowerCase()
  );

  if (duplicatePlayer) {
    setFeedback('כבר קיים שחקן עם אותו שם.', true);
    return;
  }

  state.players.push(createPlayer(normalizedName));
  render();
  setFeedback(`השחקן ${normalizedName} נוסף לסשן.`);
}

function removePlayer(playerId) {
  const playerToRemove = state.players.find(player => player.id === playerId);

  if (!playerToRemove) {
    return;
  }

  state.players = state.players.filter(player => player.id !== playerId);
  render();
  setFeedback(`השחקן ${playerToRemove.name} הוסר מהסשן.`);
}

function resetSession() {
  state = createDefaultState();
  render();
  setFeedback('הסשן אופס ונשמר מחדש בדפדפן.');
}

function updateResetTarget(value) {
  state.resetTarget = Number(value) === 100 ? 100 : 50;
  render();
  setFeedback(`יעד האיפוס עודכן ל־${state.resetTarget} נקודות.`);
}

function submitRound(formData) {
  if (state.players.length === 0) {
    setFeedback('יש להוסיף שחקנים לפני שמירת סיבוב.', true);
    return;
  }

  const winnerId = formData.get('winner');
  const asafId = formData.get('asaf');

  if (!winnerId) {
    setFeedback('יש לבחור מנצח או מנצחת לסיבוב.', true);
    return;
  }

  const winnerExists = state.players.some(player => player.id === winnerId);

  if (!winnerExists) {
    setFeedback('המנצח שנבחר אינו קיים יותר בסשן.', true);
    return;
  }

  const asafExists = asafId
    ? state.players.some(player => player.id === asafId)
    : true;

  if (!asafExists) {
    setFeedback('ערך האאסף שנבחר אינו קיים יותר בסשן.', true);
    return;
  }

  if (asafId && asafId === winnerId) {
    setFeedback('אאסף לא יכול להיות גם מנצח הסיבוב.', true);
    return;
  }

  const scoresByPlayer = new Map();

  for (const player of state.players) {
    const rawValue = formData.get(`score-${player.id}`);
    const numericValue = Number(rawValue);

    if (
      !Number.isInteger(numericValue) ||
      numericValue < 0
    ) {
      setFeedback(`יש להזין ניקוד תקין עבור ${player.name}.`, true);
      return;
    }

    scoresByPlayer.set(player.id, numericValue);
  }

  state.players = state.players.map(player => {
    const updatedPlayer = {
      ...player,
      score: player.score + scoresByPlayer.get(player.id),
      gamesPlayed: player.gamesPlayed + 1,
      wins: player.wins + (player.id === winnerId ? 1 : 0),
      asafim: player.asafim + (player.id === asafId ? 1 : 0),
    };

    return updatedPlayer;
  });

  state.totalGames += 1;
  render();
  setFeedback('הסיבוב נשמר והנתונים עודכנו בהצלחה.');
}

playerForm.addEventListener('submit', event => {
  event.preventDefault();
  addPlayer(playerNameInput.value);
  playerForm.reset();
  playerNameInput.focus();
});

roundForm.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData();
  state.players.forEach(player => {
    const input = roundForm.querySelector(`[data-score-input="${player.id}"]`);
    formData.set(`score-${player.id}`, input ? input.value : '0');
  });
  formData.set('winner', winnerSelect.value);
  formData.set('asaf', asafSelect.value);

  submitRound(formData);
});

playersList.addEventListener('click', event => {
  const button = event.target.closest('[data-remove-player]');

  if (!button) {
    return;
  }

  removePlayer(button.dataset.removePlayer);
});

resetTargetSelect.addEventListener('change', event => {
  updateResetTarget(event.target.value);
});

resetSessionButton.addEventListener('click', resetSession);

render();
setFeedback('הנתונים נשמרים אוטומטית ב־LocalStorage של הדפדפן.');
