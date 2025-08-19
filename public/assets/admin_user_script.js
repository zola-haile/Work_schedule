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

            const result = await response.json();

        }catch (error){
            console.error("❌ Error sending shift data:", error);
        }

        document.querySelector("#user_details").classList.remove("hidden_task");
        document.querySelector("#adduser_form_container").classList.add("hidden_task");
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
        .addEventListener("click",(event)=>{
            const row = event.target.closest(".user_info_row");
            if (!row) return;

            const user_email = row.dataset.userEmail;
            window.location.href = `/user/${user_email}`;
        }); 





})