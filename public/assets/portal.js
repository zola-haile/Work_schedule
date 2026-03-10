// ── Shared portal utilities ──────────────────────────────────

// ── Toast notifications ──────────────────────────────────────
(function () {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);

    window.showToast = function (message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span class="toast-msg">${message}</span>
        `;
        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => toast.classList.add('toast--show'));

        // Auto-dismiss
        setTimeout(() => {
            toast.classList.remove('toast--show');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, 3200);
    };
})();

// ── Highlight current hour row in daily calendar ─────────────
window.highlightCurrentHour = function () {
    const hours = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                   "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
    const now        = new Date();
    const hourLabel  = now.getHours() < 12
        ? (now.getHours() === 0 ? '12am' : now.getHours() + 'am')
        : (now.getHours() === 12 ? '12pm' : (now.getHours() - 12) + 'pm');

    const idx = hours.indexOf(hourLabel);
    if (idx === -1) return;

    // Daily calendar: second column's rows (index = row idx)
    const daily = document.getElementById('daily_calender_container');
    if (!daily) return;
    const cols = daily.querySelectorAll(':scope > div:not(#current_time_line)');
    if (cols.length < 2) return;
    const rows = cols[1].children;
    if (rows[idx]) rows[idx].classList.add('current-hour-row');
};
