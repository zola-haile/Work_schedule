document.addEventListener('DOMContentLoaded',()=>{
    const add_user = document.querySelector('#add_user');

    add_user.addEventListener("click",(event)=>{
        event.preventDefault();
        document.querySelector("#add_form").reset();
        document.querySelector("#user_details").classList.add("hidden_task");
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
        const password = add_form.querySelector("#password").value;

        const user_object ={
            first_name:first_name,
            last_name:last_name,
            email:email,
            netid:netid,
            role:role,
            password:password
        }
        try{
            const response = await fetch(add_form.action, {
                method : add_form.method,
                headers : {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user_object)
            });

            if (!response.ok) throw new Error("Failed to send data");

            await response.json();
            if (window.showToast) window.showToast("User added successfully!", "success");
            document.querySelector("#user_details").classList.remove("hidden_task");
            document.querySelector("#adduser_form_container").classList.add("hidden_task");
            document.querySelector("#add_form").reset();
        }catch (error){
            console.error("❌ Error adding user:", error);
            if (window.showToast) window.showToast("Failed to add user. Try again.", "error");
        }
    })

    const show_all_users = document.querySelector("#show_all_users");

    show_all_users.addEventListener("click",(event)=>{
        event.preventDefault();

        document.querySelector("#user_details").classList.add("hidden_task");
        document.querySelector("#adduser_form_container").classList.add("hidden_task");
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
                    // redirect to that user's page
                    // console.log(user);
                    window.location.href = `/user/${user.email}`;
                    
                })
                result_box.appendChild(li);

            });
        }catch(error){
            console.error("❌ Error fetching users:", error);
        }
    }

    function debounce(fn, delay) {
        let timer; // stores timeout reference
        
        return (...args) => {
            clearTimeout(timer); // cancel any existing timer
            timer = setTimeout(() => fn(...args), delay); 
            // start a new timer that calls fn after `delay`
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
})