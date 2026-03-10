document.addEventListener("DOMContentLoaded",()=>{
    const task1 = document.querySelector(".task_cat1");

    task1.addEventListener("click",(event)=>{
        event.preventDefault();
        document.querySelector("#cont_1").classList.remove('hidden_task');
        document.querySelector("#task_form_1").classList.add('hidden_task');
        document.querySelector("#edit_task_container").classList.add('hidden_task');

        
    });

    const add_task1 = document.querySelector("#task1_add_button");
    add_task1.addEventListener("click",(event)=>{
        event.preventDefault();

        document.querySelector("#cont_1").classList.add('hidden_task');
        document.querySelector("#task_form_1").classList.remove('hidden_task');
        document.querySelector("#edit_task_container").classList.add('hidden_task');
        document.querySelector("#task_form_1").reset();

       
    });


    const sub_task1 = document.querySelector("#sub_task1");

    sub_task1.addEventListener("click", async (event)=>{
        event.preventDefault();
        const task1_form = document.querySelector("#task1_form");
        const task1_to_name = task1_form.querySelector(".task1_to_name").value
        const task1_to_email = task1_form.querySelector(".task1_to_email").value
        const task1_by_name = task1_form.querySelector(".task1_by_name").value
        const task1_by_email = task1_form.querySelector(".task1_by_email").value
        const task1_post_date = task1_form.querySelector(".task1_post_date").value
        const task1_desc = task1_form.querySelector(".task1_desc").value
        

        const task1_links_inputs = task1_form.querySelectorAll(".task1_links");
        const task1_links = Array.from(task1_links_inputs)
                         .map(input => input.value.trim());
                         
        // console.log(task1_links.length);

        const task1_due = task1_form.querySelector(".task1_due").value

        const addable_task1 = {
            To: task1_to_name,
            to_email: task1_to_email,
            From: task1_by_name,
            from_email: task1_by_email,
            posted_date:task1_post_date,
            task_desc: task1_desc,
            links: task1_links,
            due_by: task1_due,
            show: true
        }

        // addable_task1.links.forEach((t)=>{
        //     console.log(t);
        // })

        // console.log(addable_task1.links)
        
        try{
            // console.log(task1_form.action);
            // console.log(task1_form.method);
            // console.log(JSON.stringify(addable_task1));
            const response = await fetch(task1_form.action,{
                method: task1_form.method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(addable_task1)
            });

            if (!response.ok) throw new Error("Failed to send data");

            await response.json();
            if (window.showToast) window.showToast("Task added successfully!", "success");
            setTimeout(() => window.location.reload(), 700);
            return;
        }catch (error){
            console.error("❌ Error adding task:", error);
            if (window.showToast) window.showToast("Something went wrong: " + error.message, "error");
        }

    });

    function add_link_input() {
        const container = document.getElementById("links_container");
        const input = document.createElement("input");
        input.type = "url";
        input.name = "info_links[]";
        input.placeholder = "https://example.com";
        // container.appendChild(document.createElement("br"));
        input.classList.add("task1_links");
        container.appendChild(input);
    }

    const add_links_button = document.querySelector("#add_another_link");

    add_links_button.addEventListener("click",add_link_input);



    const cancel_adding_task1 = document.querySelector("#cancel_adding_task1")

    cancel_adding_task1.addEventListener("click",(event)=>{
        event.preventDefault();
        document.querySelector("#task1_form").reset();

        const linksContainer = document.getElementById("links_container");
        const linkInputs = linksContainer.querySelectorAll(".task1_links");

        linkInputs.forEach((input, index) => {
            if (index > 0) { // keep only the first one
                input.remove();
            }
        });


        document.querySelector("#cont_1").classList.remove('hidden_task');
        document.querySelector("#task_form_1").classList.add('hidden_task');

    });

    done_buttons = document.querySelectorAll(".task_finished_button");

    done_buttons.forEach(buttn=>{

        buttn.addEventListener('click', async ()=>{
            if (!confirm("Mark this task as done? It will be removed from the list.")) return;
            const taskID = buttn.getAttribute('data_id');
            const card = buttn.closest('.task_card');
            buttn.disabled = true;
            buttn.textContent = "Saving…";
            try{
                const response = await fetch("/task/done",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({id:taskID})

                });
                if (response.ok){
                    if (window.showToast) window.showToast("Task marked as complete!", "success");
                    if (card) {
                        card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
                        card.style.opacity = "0";
                        card.style.transform = "scale(0.95)";
                        setTimeout(() => card.remove(), 320);
                    }
                }else{
                    if (window.showToast) window.showToast("Failed to update task.", "error");
                    buttn.disabled = false;
                    buttn.textContent = "Done";
                }
            }
            catch (err) {
                console.error("Error:", err);
                if (window.showToast) window.showToast("An error occurred.", "error");
                buttn.disabled = false;
                buttn.textContent = "Done";
            }
        });
    });


    const task_cards = document.querySelectorAll(".task_card");

    task_cards.forEach(card =>{
        let duration = parseFloat(card.getAttribute('date_diff'));
        // console.log(duration);
        if (duration >= 15){
            card.classList.add("green_task_card");
            card.classList.remove("red_task_card");
            card.classList.remove("yellow_task_card");

        }else if(duration < 15 && duration >= 5){
            card.classList.add("yellow_task_card");
            card.classList.remove("green_task_card");
            card.classList.remove("red_task_card");
        }else if(duration < 5 ){
            card.classList.add("red_task_card");
            card.classList.remove("green_task_card");
            card.classList.remove("yellow_task_card");
        }
    })

    const edit_task_buttons = document.querySelectorAll(".edit_task_button");

    let task_id = 0;

    edit_task_buttons.forEach(edit_button=>{
        edit_button.addEventListener('click',async ()=>{
            const editable_data = JSON.parse(edit_button.getAttribute("task_data"));
            // console.log(editable_data.links);
            task_id = editable_data._id;
            // console.log(task_id)
            document.querySelector("#assignee").value = editable_data.To;
            
            document.querySelector("#assignee_email").value = editable_data.to_email;
            document.querySelector("#assigner").value = editable_data.From;
            document.querySelector("#assigner_email").value = editable_data.from_email;
            document.querySelector("#task_details").value = editable_data.task_desc;
            let p_date = new Date(editable_data.posted_date);
            document.querySelector("#edit_post_date").value = p_date.toISOString().split("T")[0];
            let due_date = new Date(editable_data.due_by);
            document.querySelector("#edit_due_date").value = due_date.toISOString().split("T")[0];
            // document.querySelector("#assignee").value = editable_data;

            const add_link = (link_container,val)=>{
                const f_input = document.createElement('input');
                f_input.type = "links";
                f_input.name = "edit_info_links";
                if (val===null){
                    f_input.placeholder = "https://example.com";
                }else{
                    f_input.value = val;
                }
                f_input.classList.add("edit_info_links");
                link_container.appendChild(f_input);
            }

            const edit_links_container = document.querySelector("#edit_links_container");
            edit_links_container.innerHTML = "";
            const f_label = document.createElement('label');
            f_label.for = "edit_info_links[]";
            f_label.textContent = "Related links: ";
            edit_links_container.appendChild(f_label);

            if (editable_data.links.length ==0){
                add_link(edit_links_container,null);

            }else{
                for (let i=0; i<editable_data.links.length; i++){
                    add_link(edit_links_container,editable_data.links[i]);
                }
            }

            const add_link_butn = document.createElement('button');
            add_link_butn.type = "button";
            add_link_butn.id = "add_more_links";
            add_link_butn.textContent = "Add another link";
            edit_links_container.appendChild(add_link_butn);

            document.querySelector("#edit_task_container").classList.remove('hidden_task');
            document.querySelector("#cont_1").classList.add('hidden_task');
            document.querySelector("#task_form_1").classList.add('hidden_task');

            add_link_butn.addEventListener("click",()=>{
                add_link(edit_links_container,null);
            })
        })
    })

    const confirm_edit_button = document.querySelector("#edit_confirm");

    confirm_edit_button.addEventListener('click', async (event)=>{
        event.preventDefault();

        const assignee_name = document.querySelector("#assignee").value;
        const assignee_email=document.querySelector("#assignee_email").value;
        const assigner_name = document.querySelector("#assigner").value;
        const assigner_email = document.querySelector("#assigner_email").value;
        const task_details = document.querySelector("#task_details").value;
        const edit_post_date = document.querySelector("#edit_post_date").value;
        const edit_due_date = document.querySelector("#edit_due_date").value;
        // console.log(task_id);

        const edit_links_inputs = document.querySelectorAll(".edit_info_links");
        const edit_links = Array.from(edit_links_inputs)
                         .map(input => input.value.trim());
        // console.log(edit_links);


        const editted_object = {
            _id : task_id,
            To: assignee_name,
            to_email: assignee_email,
            From: assigner_name,
            from_email: assigner_email,
            posted_date:edit_post_date,
            task_desc: task_details,
            links: edit_links,
            due_by: edit_due_date,
            show: true
        }

        try{
            const response = await fetch("/edit_task",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editted_object)
            })

            if (!response.ok) throw new Error("Failed to send data");

            await response.json();
            if (window.showToast) window.showToast("Task updated successfully.", "success");
            setTimeout(() => window.location.reload(), 700);
        }catch (error){
            console.error("❌ Error sending shift data:", error);
            if (window.showToast) window.showToast("Something went wrong: " + error.message, "error");
        }

    })


    const cancel_edit = document.querySelector("#edit_cancel");

    cancel_edit.addEventListener('click',(event)=>{
        event.preventDefault();

        document.querySelector("#edit_task_container").classList.add('hidden_task');
        document.querySelector("#cont_1").classList.remove('hidden_task');
        document.querySelector("#task_form_1").classList.add('hidden_task');

    })
});
