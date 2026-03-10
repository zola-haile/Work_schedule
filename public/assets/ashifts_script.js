document.addEventListener('DOMContentLoaded', () => {

    // ── View toggle ────────────────────────────────────────────────
    const daily_button   = document.querySelector("#daily_button");
    const weekly_button  = document.querySelector("#weekly_button");
    const monthly_button = document.querySelector("#monthly_button");

    daily_button.addEventListener("click", (e) => {
        e.preventDefault();
        daily_button.classList.add("text-bg-secondary");
        weekly_button.classList.remove("text-bg-secondary");
        monthly_button.classList.remove("text-bg-secondary");

        document.querySelector("#daily_shift_container").classList.remove("hidden_task");
        document.querySelector("#weekly_shift_container").classList.add("hidden_task");
        document.querySelector("#monthly_shift_container").classList.add("hidden_task");
    });

    weekly_button.addEventListener("click", (e) => {
        e.preventDefault();
        weekly_button.classList.add("text-bg-secondary");
        daily_button.classList.remove("text-bg-secondary");
        monthly_button.classList.remove("text-bg-secondary");

        document.querySelector("#weekly_shift_container").classList.remove("hidden_task");
        document.querySelector("#daily_shift_container").classList.add("hidden_task");
        document.querySelector("#monthly_shift_container").classList.add("hidden_task");
    });

    monthly_button.addEventListener("click", (e) => {
        e.preventDefault();
        monthly_button.classList.add("text-bg-secondary");
        daily_button.classList.remove("text-bg-secondary");
        weekly_button.classList.remove("text-bg-secondary");

        document.querySelector("#monthly_shift_container").classList.remove("hidden_task");
        document.querySelector("#daily_shift_container").classList.add("hidden_task");
        document.querySelector("#weekly_shift_container").classList.add("hidden_task");
    });

    // ── Date navigation ─────────────────────────────────────────────
    const yesterday_button = document.querySelector("#yesterday_button");
    yesterday_button.addEventListener('click', (e) => {
        e.preventDefault();
        const d = new Date(yesterday_button.getAttribute('cur_date'));
        d.setDate(d.getDate() - 1);
        window.location.href = `/ashift?date=${d.toISOString().split("T")[0]}&view=daily`;
    });

    const tomorrow_button = document.querySelector("#tomorrow_button");
    tomorrow_button.addEventListener('click', (e) => {
        e.preventDefault();
        const d = new Date(tomorrow_button.getAttribute('cur_date'));
        d.setDate(d.getDate() + 1);
        window.location.href = `/ashift?date=${d.toISOString().split("T")[0]}&view=daily`;
    });

    document.querySelector("#today_date_input").addEventListener("change", (e) => {
        window.location.href = `/ashift?date=${e.target.value}&view=daily`;
    });

    const last_week_button = document.querySelector("#last_week_button");
    last_week_button.addEventListener("click", (e) => {
        e.preventDefault();
        const d = new Date(last_week_button.dataset.sunday);
        d.setDate(d.getDate() - 6);
        window.location.href = `/ashift?date=${d}&view=weekly`;
    });

    const next_week_button = document.querySelector("#next_week_button");
    next_week_button.addEventListener("click", (e) => {
        e.preventDefault();
        const d = new Date(next_week_button.dataset.sunday);
        d.setDate(d.getDate() + 8);
        window.location.href = `/ashift?date=${d}&view=weekly`;
    });

    document.querySelector("#this_week_input").addEventListener("change", (e) => {
        window.location.href = `/ashift?date=${e.target.value}&view=weekly`;
    });

    const last_month_button = document.querySelector("#last_month_button");
    last_month_button.addEventListener("click", (e) => {
        e.preventDefault();
        const year  = parseInt(last_month_button.dataset.year);
        const month = parseInt(last_month_button.dataset.month); // 0-indexed
        const prev  = new Date(Date.UTC(year, month - 1, 1));
        window.location.href = `/ashift?date=${prev.toISOString().split('T')[0]}&view=monthly`;
    });

    const next_month_button = document.querySelector("#next_month_button");
    next_month_button.addEventListener("click", (e) => {
        e.preventDefault();
        const year  = parseInt(next_month_button.dataset.year);
        const month = parseInt(next_month_button.dataset.month); // 0-indexed
        const next  = new Date(Date.UTC(year, month + 1, 1));
        window.location.href = `/ashift?date=${next.toISOString().split('T')[0]}&view=monthly`;
    });

    // ── Utility ─────────────────────────────────────────────────────
    function debounce(fn, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    }

    // ── References ───────────────────────────────────────────────────
    const daily_calender_container  = document.querySelector("#daily_calender_container");
    const weekly_calendar_container = document.querySelector("#weekly_calendar_container");
    const weekly_shift_container    = document.querySelector("#weekly_shift_container");
    const daily_employee_edition    = document.querySelector("#daily_employee_edition");
    const weekly_employee_edition   = document.querySelector("#weekly_employee_edition");

    // ── Daily edit buttons ───────────────────────────────────────────
    document.querySelectorAll(".edit_daily_employee_shift").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const hour      = btn.dataset.hour;
            const date      = new Date(btn.dataset.date);
            const employees = btn.dataset.employees ? JSON.parse(btn.dataset.employees) : [];

            daily_calender_container.style.display = "none";
            weekly_shift_container.classList.add("hidden_task");
            daily_employee_edition.classList.remove("hidden_task");

            shift_editor("daily", employees, hour, date);
        });
    });

    document.querySelector("#daily_return_to_shift_button").addEventListener("click", (e) => {
        e.preventDefault();
        daily_calender_container.style.display = "grid";
        daily_employee_edition.classList.add("hidden_task");
    });

    // ── Weekly edit buttons ──────────────────────────────────────────
    document.querySelectorAll(".edit_weekly_employee_shift").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const hour      = btn.dataset.hour;
            const date      = new Date(btn.dataset.date);
            const employees = btn.dataset.employees ? JSON.parse(btn.dataset.employees) : [];

            weekly_calendar_container.style.display = "none";
            daily_calender_container.style.display  = "none";
            daily_employee_edition.classList.add("hidden_task");
            weekly_employee_edition.classList.remove("hidden_task");

            shift_editor("weekly", employees, hour, date);
        });
    });

    document.querySelector("#weekly_return_to_shift_button").addEventListener("click", (e) => {
        e.preventDefault();
        weekly_calendar_container.style.display = "grid";
        weekly_employee_edition.classList.add("hidden_task");
    });

    // ── Current-time line ────────────────────────────────────────────
    function updateTimeLine() {
        const container = document.getElementById("daily_calender_container");
        const line      = document.getElementById("current_time_line");
        if (!container || !line) return;

        const now     = new Date();
        const hours   = now.getHours();
        const minutes = now.getMinutes();
        const minStr  = String(minutes).padStart(2, '0');
        const timeStr = `${hours % 12 || 12}:${minStr} ${hours >= 12 ? "PM" : "AM"}`;

        const pct = (hours * 60 + minutes) / (24 * 60);
        line.style.top = `${pct * container.offsetHeight}px`;
        line.setAttribute("data-time", timeStr);
    }

    updateTimeLine();
    setInterval(updateTimeLine, 60000);

    // ── Shift editor (staging flow) ──────────────────────────────────
    function shift_editor(timing, employees, hour, date) {

        // Header
        const header_el = document.querySelector(`#${timing}_users_with_shifts_header`);
        const dateLabel = date instanceof Date
            ? date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
            : "";
        header_el.innerHTML = `<span class="ee-hour">${hour}</span> shift · ${dateLabel}`;

        // ── Currently assigned employees ─────────────────────────────
        const assigned_container = document.querySelector(`#${timing}_current_shift_employees`);
        assigned_container.innerHTML = "";

        if (employees.length === 0) {
            assigned_container.innerHTML = `<p class="ee-empty">No one assigned yet.</p>`;
        } else {
            employees.forEach(emp => {
                const chip = makeChip(emp, "assigned");
                chip.querySelector(".chip-remove").addEventListener("click", async () => {
                    chip.classList.add("removing");
                    try {
                        const res = await fetch("/remove_employee", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ name: emp, hour, date })
                        });
                        if (!res.ok) throw new Error("Failed to remove");
                        setTimeout(() => chip.remove(), 200);
                    } catch (err) {
                        console.error("Error removing:", err);
                        chip.classList.remove("removing");
                    }
                });
                assigned_container.appendChild(chip);
            });
        }

        // ── Staged (to-be-added) employees ───────────────────────────
        let staged = [];
        const staged_container = document.querySelector(`#${timing}_staged_employees`);
        const submit_btn       = document.querySelector(`#${timing}_submit_shift`);

        staged_container.innerHTML = "";
        submit_btn.classList.add("hidden_task");
        submit_btn.disabled    = false;
        submit_btn.textContent = "Save Changes";

        function renderStaged() {
            staged_container.innerHTML = "";
            if (staged.length > 0) {
                submit_btn.classList.remove("hidden_task");
                staged.forEach(name => {
                    const chip = makeChip(name, "staged");
                    chip.querySelector(".chip-remove").addEventListener("click", () => {
                        staged = staged.filter(n => n !== name);
                        renderStaged();
                    });
                    staged_container.appendChild(chip);
                });
            } else {
                submit_btn.classList.add("hidden_task");
            }
        }

        // Submit
        submit_btn.onclick = async () => {
            if (staged.length === 0) return;
            submit_btn.disabled    = true;
            submit_btn.textContent = "Saving…";

            try {
                for (const name of staged) {
                    const res = await fetch("/adding_employee_shift", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, shift_time: hour, date })
                    });
                    if (!res.ok) throw new Error("Failed to add " + name);
                }
                window.location.reload();
            } catch (err) {
                console.error("Error saving:", err);
                submit_btn.disabled    = false;
                submit_btn.textContent = "Save Changes";
            }
        };

        // ── Search input ─────────────────────────────────────────────
        const old_input = document.querySelector(`#${timing}_add_shift`);
        const new_input = old_input.cloneNode(true); // removes old listeners
        old_input.parentNode.replaceChild(new_input, old_input);

        const result_box = document.querySelector(`#${timing}_search_results`);

        new_input.addEventListener("input", debounce(async () => {
            const query = new_input.value.trim();
            result_box.innerHTML = "";
            if (query.length < 1) return;

            try {
                const res   = await fetch(`/users/search?q=${encodeURIComponent(query)}`);
                const users = await res.json();

                users.forEach(user => {
                    const name = `${user.first_name} ${user.last_name}`;
                    if (staged.includes(name) || employees.includes(name)) return;

                    const li = document.createElement("li");
                    li.classList.add("ee-result-item");
                    li.innerHTML = `<span class="result-icon">+</span> ${name}`;
                    li.addEventListener("click", () => {
                        staged.push(name);
                        renderStaged();
                        new_input.value  = "";
                        result_box.innerHTML = "";
                    });
                    result_box.appendChild(li);
                });

                if (users.length === 0) {
                    const li = document.createElement("li");
                    li.classList.add("ee-result-empty");
                    li.textContent = "No users found";
                    result_box.appendChild(li);
                }
            } catch (err) {
                console.error("Search error:", err);
            }
        }, 300));

        // Close dropdown on outside click
        document.addEventListener("click", (e) => {
            if (!new_input.contains(e.target) && !result_box.contains(e.target)) {
                result_box.innerHTML = "";
            }
        }, { once: false });
    }

    // ── Chip helper ──────────────────────────────────────────────────
    function makeChip(name, type) {
        const chip = document.createElement("div");
        chip.classList.add("ee-chip", `ee-chip--${type}`);
        chip.innerHTML = `
            <span class="chip-name">${name}</span>
            <button class="chip-remove" title="Remove" type="button">×</button>
        `;
        return chip;
    }

});
