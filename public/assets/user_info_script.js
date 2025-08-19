document.addEventListener('DOMContentLoaded',()=>{
    const edit_user_buttom = document.querySelector("#edit_user_buttom");

    edit_user_buttom.addEventListener("click", async (event)=>{
        event.preventDefault();

        //add user info into the form inputs


        document.querySelector("#individual_user_container").classList.add("hidden_task");
        document.querySelector("#edit_user_info").classList.remove("hidden_task");
    })

    const cancel_edit = document.querySelector("#cancel_edit");

    cancel_edit.addEventListener("click", async (event)=>{
        event.preventDefault();

        document.querySelector("#individual_user_container").classList.remove("hidden_task");
        document.querySelector("#edit_user_info").classList.add("hidden_task");
    })

    const update_user_info = document.querySelector("#update_user_info");

    update_user_info.addEventListener("click", async (event)=>{
        event.preventDefault();

        const edit_user_table = document.querySelector("#edit_user_table");

        const user_id = document.querySelector("#user_id").value;
        const first_name = document.querySelector("#first_name").value;
        const last_name = document.querySelector("#last_name").value;
        const email = document.querySelector("#email").value;
        const netid = document.querySelector("#netid").value;
        const role = document.querySelector("#role").value;
        

        const editted_user={
            first_name:first_name,
            last_name:last_name,
            email:email,
            netid:netid,
            role:role,
            _id:user_id
        };

        // console.log(JSON.stringify(editted_user))

        try{
            const response = await fetch(edit_user_table.action,{
                method:edit_user_table.method,
                headers : {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editted_user)
            })

            if (!response.ok) throw new Error("Failed to send data");

            const result = await response.json();

        }catch (error){
            console.error("❌ Error sending shift data:", error);
        }

        document.querySelector("#individual_user_container").classList.remove("hidden_task");
        document.querySelector("#edit_user_info").classList.add("hidden_task");
        
        // console.log(first_name);
    })
})