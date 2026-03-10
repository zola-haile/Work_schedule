document.addEventListener('DOMContentLoaded',()=>{
    const add_user = document.querySelector('#add_user');

    add_user.addEventListener("click",(event)=>{
        event.preventDefault();
        document.querySelector("#add_form").reset();
        document.querySelector("#invite_link_container").classList.add("hidden_task");
        document.querySelector("#user_details").classList.add("hidden_task");
        document.querySelector("#change_password_container").classList.add("hidden_task");
        document.querySelector("#adduser_form_container").classList.remove("hidden_task");
    })

    const cancel_adding_user = document.querySelector("#cancel_adding_user");

    cancel_adding_user.addEventListener('click',(event)=>{
        event.preventDefault();
        document.querySelector("#user_details").classList.remove("hidden_task");
        document.querySelector("#adduser_form_container").classList.add("hidden_task");
    })

    const submit_user = document.querySelector("#submit_user");

    submit_user.addEventListener('click', async (event)=>{
        event.preventDefault();

        const add_form = document.querySelector("#add_form");
        const first_name = add_form.querySelector("#first_name").value;
        const last_name = add_form.querySelector("#last_name").value;
        const email = add_form.querySelector("#email").value;
        const netid = add_form.querySelector("#netid").value;
        const role = add_form.querySelector("#role").value;

        const user_object = { first_name, last_name, email, netid, role };

        try{
            const response = await fetch('/user/invite', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user_object)
            });

            if (!response.ok) throw new Error("Failed to generate invite");

            const data = await response.json();
            if (!data.success) throw new Error(data.error);

            // Show the invite link
            const link_box = document.querySelector("#invite_link_box");
            link_box.textContent = data.link;
            document.querySelector("#invite_link_container").classList.remove("hidden_task");
            if (window.showToast) window.showToast("Invite link generated!", "success");
        }catch (error){
            console.error("❌ Error generating invite:", error);
            if (window.showToast) window.showToast("Failed to generate invite. Try again.", "error");
        }
    })

    document.querySelector("#copy_invite_link").addEventListener('click', () => {
        const link = document.querySelector("#invite_link_box").textContent;
        navigator.clipboard.writeText(link).then(() => {
            if (window.showToast) window.showToast("Link copied to clipboard!", "success");
        });
    });

    const show_all_users = document.querySelector("#show_all_users");

    show_all_users.addEventListener("click",(event)=>{
        event.preventDefault();

        document.querySelector("#user_details").classList.add("hidden_task");
        document.querySelector("#adduser_form_container").classList.add("hidden_task");
        document.querySelector("#change_password_container").classList.add("hidden_task");
        document.querySelector("#users_display_container").classList.remove("hidden_task");
    })

    const back_to_user_profile = document.querySelector("#back_to_user_profile");

    back_to_user_profile.addEventListener('click',(event)=>{
        document.querySelector("#user_details").classList.remove("hidden_task");
        document.querySelector("#adduser_form_container").classList.add("hidden_task");
        document.querySelector("#users_display_container").classList.add("hidden_task");
    })

    document.querySelector("#users_display_container")
        .addEventListener("click", async (event) => {
            // Remove button — handle separately, don't navigate
            const remove_btn = event.target.closest(".remove-user-btn");
            if (remove_btn) {
                const email = remove_btn.dataset.email;
                const name  = remove_btn.dataset.name;
                if (!confirm(`Remove ${name} from the system? This cannot be undone.`)) return;

                remove_btn.disabled = true;
                remove_btn.textContent = "Removing…";

                try {
                    const res = await fetch("/user/remove", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email })
                    });
                    if (!res.ok) throw new Error("Failed to remove user");

                    if (window.showToast) window.showToast(`${name} has been removed.`, "success");
                    const row = remove_btn.closest("tr");
                    if (row) {
                        row.style.transition = "opacity 0.3s ease";
                        row.style.opacity = "0";
                        setTimeout(() => row.remove(), 320);
                    }
                } catch (err) {
                    console.error("Error removing user:", err);
                    if (window.showToast) window.showToast("Failed to remove user. Try again.", "error");
                    remove_btn.disabled = false;
                    remove_btn.textContent = "Remove";
                }
                return;
            }

            // Row click — navigate to user profile
            const row = event.target.closest(".user_info_row");
            if (!row) return;
            const user_email = row.dataset.userEmail;
            window.location.href = `/user/${user_email}`;
        });

    const search_input= document.querySelector("#search_user");
    const result_box = document.querySelector("#search_results");


    const search_users= async (query)=>{
        try{
            const res = await fetch(`/users/search?q=${encodeURIComponent(query)}`);
            const users = await res.json();

            result_box.innerHTML = "";

            users.forEach(user => {
                const li = document.createElement("li");

                li.classList.add("list-group-item", "list-group-item-action");
                li.textContent = `${user.first_name} ${user.last_name}`;

                li.addEventListener("click", ()=>{
                    search_input.value = user.first_name;

                    result_box.innerHTML = "";
                    window.location.href = `/user/${user.email}`;

                })
                result_box.appendChild(li);

            });
        }catch(error){
            console.error("❌ Error fetching users:", error);
        }
    }

    function debounce(fn, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    }

    search_input.addEventListener("input",debounce(()=>{
        const query = search_input.value.trim();
        if (query.length > 0) {
            search_users(query);
            document.querySelector("#search_results").classList.remove("hidden_task");
            document.querySelector("#users_info_table").classList.add("hidden_task");
        } else {
            result_box.innerHTML = "";
            document.querySelector("#search_results").classList.add("hidden_task");
            document.querySelector("#users_info_table").classList.remove("hidden_task");
        }
    },300));

    // Change Password
    document.querySelector("#change_password_btn").addEventListener("click", () => {
        document.querySelector("#change_password_form").reset();
        document.querySelector("#user_details").classList.add("hidden_task");
        document.querySelector("#adduser_form_container").classList.add("hidden_task");
        document.querySelector("#users_display_container").classList.add("hidden_task");
        document.querySelector("#change_password_container").classList.remove("hidden_task");
    });

    document.querySelector("#cancel_change_password").addEventListener("click", () => {
        document.querySelector("#change_password_container").classList.add("hidden_task");
        document.querySelector("#user_details").classList.remove("hidden_task");
    });

    document.querySelector("#change_password_form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const current_password = document.querySelector("#current_password").value;
        const new_password = document.querySelector("#new_password").value;
        const confirm_password = document.querySelector("#confirm_password").value;

        try {
            const res = await fetch("/user/change_password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ current_password, new_password, confirm_password })
            });
            const data = await res.json();

            if (!data.success) {
                if (window.showToast) window.showToast(data.error, "error");
                return;
            }

            if (window.showToast) window.showToast("Password updated successfully!", "success");
            document.querySelector("#change_password_container").classList.add("hidden_task");
            document.querySelector("#user_details").classList.remove("hidden_task");
            document.querySelector("#change_password_form").reset();
        } catch (err) {
            console.error("❌ Error changing password:", err);
            if (window.showToast) window.showToast("Failed to update password. Try again.", "error");
        }
    });
})
