document.addEventListener("DOMContentLoaded",()=>{
    const task1 = document.querySelector(".task_cat1");

    task1.addEventListener("click",(event)=>{
        event.preventDefault();
        document.querySelector("#cont_1").classList.remove('hidden_task');
        document.querySelector("#cont_2").classList.add('hidden_task')
        document.querySelector("#task_form_1").classList.add('hidden_task');
        document.querySelector("#task_form_2").classList.add('hidden_task');
        document.querySelector("#task_form_2").classList.add('hidden_task');
        
    });


    const task2 = document.querySelector(".task_cat2");
    task2.addEventListener("click",(event)=>{
        event.preventDefault();
        document.querySelector("#cont_1").classList.add('hidden_task');
        document.querySelector("#cont_2").classList.remove('hidden_task');
        document.querySelector("#task_form_1").classList.add('hidden_task');
        document.querySelector("#task_form_2").classList.add('hidden_task');
    })


    const add_task1 = document.querySelector("#task1_add_button");
    add_task1.addEventListener("click",(event)=>{
        event.preventDefault();

        document.querySelector("#cont_2").classList.add('hidden_task');
        document.querySelector("#cont_1").classList.add('hidden_task');
        document.querySelector("#task_form_1").classList.remove('hidden_task');
        document.querySelector("#task_form_2").classList.add('hidden_task');



    });

    const add_task2 = document.querySelector("#task2_add_button");
    add_task2.addEventListener("click",(event)=>{
        event.preventDefault();

        document.querySelector("#cont_2").classList.add('hidden_task');
        document.querySelector("#cont_1").classList.add('hidden_task');
        document.querySelector("#task_form_1").classList.add('hidden_task');
        document.querySelector("#task_form_2").classList.remove('hidden_task');
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
                         
        console.log(task1_links.length);

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

        addable_task1.links.forEach((t)=>{
            console.log(t);
        })

        console.log(addable_task1.links)
        
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

            const result = await response.json();
        }catch (error){
            console.error("❌ Error sending shift data:", error);
            alert("Something went wrong: " + error.message);
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



    // const cancel_adding_task1 = document.querySelector("#cancel_adding_task1")

    // cancel_adding_task1.addEventListener("click",(event)=>{
    //     event.preventDefault();
    //     document.querySelector("#cont_1").classList.remove('hidden_task');
    //     document.querySelector("#cont_2").classList.add('hidden_task')
    //     document.querySelector("#task_form_1").classList.add('hidden_task');
    //     document.querySelector("#task_form_2").classList.add('hidden_task');

    // });

    done_buttons = document.querySelectorAll(".task_finished_button");

    done_buttons.forEach(buttn=>{

        buttn.addEventListener('click', async ()=>{
            const taskID = buttn.getAttribute('data_id');
        

            try{
                const response = await fetch("/task/done",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({id:taskID})

                });

                if (response.ok){
                    console.log("Task marked as complete!");
                }else{
                    alert("Failed to update task.");
                }

            }
            catch (err) {
                console.error("Error:", err);
                        alert("An error occurred.");
            }


        });

    });


    const task_cards = document.querySelectorAll(".task_card");

    task_cards.forEach(card =>{
        let duration = card.getAttribute('date_diff');
        console.log(duration);
        if (duration >= 15){
            card.classList.add("green_task_card");
            card.classList.remove("red_task_card");
            card.classList.remove("yellow_task_card");

        }else if(duration < 15 && duration >= 5){
            card.classList.add("yellow_task_card");
            card.classList.remove("green_task_card");
            card.classList.remove("red_task_card");
        }else {
            card.classList.add("red_task_card");
            card.classList.remove("green_task_card");
            card.classList.remove("yellow_task_card");
        }
    })




});
