document.addEventListener('DOMContentLoaded',()=>{
    const daily_button = document.querySelector("#daily_button");
    
    daily_button.addEventListener("click",(event)=>{
        event.preventDefault();

        daily_button.classList.add("text-bg-secondary");
        document.querySelector("#weekly_button").classList.remove("text-bg-secondary");
        document.querySelector("#monthly_button").classList.remove("text-bg-secondary");

        document.querySelector("#daily_shift_container").classList.add("text-bg-secondary");
        document.querySelector("#weekly_shift_container").classList.remove("text-bg-secondary");
        document.querySelector("#monthly_shift_container").classList.remove("text-bg-secondary");

        document.querySelector("#weekly_shift_container").classList.add("hidden_task");
        document.querySelector("#daily_shift_container").classList.remove("hidden_task");
        document.querySelector("#monthly_shift_container").classList.add("hidden_task");
    })

    const weekly_button = document.querySelector("#weekly_button");
    
    weekly_button.addEventListener("click",(event)=>{
        event.preventDefault();

        weekly_button.classList.add("text-bg-secondary");
        document.querySelector("#daily_button").classList.remove("text-bg-secondary");
        document.querySelector("#monthly_button").classList.remove("text-bg-secondary");

        document.querySelector("#weekly_shift_container").classList.add("text-bg-secondary");
        document.querySelector("#daily_shift_container").classList.remove("text-bg-secondary");
        document.querySelector("#monthly_shift_container").classList.remove("text-bg-secondary");

        document.querySelector("#weekly_shift_container").classList.remove("hidden_task");
        document.querySelector("#daily_shift_container").classList.add("hidden_task");
        document.querySelector("#monthly_shift_container").classList.add("hidden_task");
    })

    monthly_button.addEventListener("click",(event)=>{
        event.preventDefault();

        monthly_button.classList.add("text-bg-secondary");
        document.querySelector("#daily_button").classList.remove("text-bg-secondary");
        document.querySelector("#weekly_button").classList.remove("text-bg-secondary");

        document.querySelector("#monthly_shift_container").classList.add("text-bg-secondary");
        document.querySelector("#daily_shift_container").classList.remove("text-bg-secondary");
        document.querySelector("#weekly_shift_container").classList.remove("text-bg-secondary");

        document.querySelector("#monthly_shift_container").classList.remove("hidden_task");
        document.querySelector("#daily_shift_container").classList.add("hidden_task");
        document.querySelector("#weekly_shift_container").classList.add("hidden_task");
    })

    const yesterday_button = document.querySelector("#yesterday_button");
    yesterday_button.addEventListener('click',(event)=>{
        event.preventDefault();
        curr_date = yesterday_button.getAttribute('cur_date'); 

        current_date = new Date(curr_date);

        current_date.setDate(current_date.getDate()-1);

        window.location.href=`/ashift?date=${current_date.toISOString().split("T")[0]}`;
    })

    const tomorrow_button = document.querySelector("#tomorrow_button");

    tomorrow_button.addEventListener('click',(event)=>{
        event.preventDefault();
        curr_date = tomorrow_button.getAttribute('cur_date'); 

        current_date = new Date(curr_date);
        console.log(curr_date);

        current_date.setDate(current_date.getDate()+1);

        window.location.href=`/ashift?date=${current_date.toISOString().split("T")[0]}`;
    })

    const today_date_input = document.querySelector("#today_date_input");

    today_date_input.addEventListener("change", (event)=>{
        event.preventDefault;

        const new_date = event.target.value;
        window.location.href = `/ashift?date=${new_date}`;
    })

    // today_date_input.addEventListener("click",(event)=>{
    //     event.preventDefault();

    //     const employee_edition = document.querySelector("#employee_edition");
    //     const daily_calender_container= document.querySelector("#daily_calender_container");

    //     daily_calender_container.style.display = "grid";

    //     employee_edition.classList.add("hidden_task");
    // })

    
    

    const search_users= async (query,hour,date,result_box)=>{
        
        try{
            const res = await fetch(`/users/search?q=${encodeURIComponent(query)}`);
            const users = await res.json();

            result_box.innerHTML = "";

            users.forEach(user => {
                const li = document.createElement("li");

                li.classList.add("list-group-item", "list-group-item-action");
                li.textContent = `${user.first_name} ${user.last_name}`;

                li.addEventListener("click", async ()=>{
                    const shift_personel = {
                        name : `${user.first_name} ${user.last_name}`,
                        shift_time: hour,
                        date:date 
                    }

                    try{
                        const response = await fetch("/adding_employee_shift",{
                            method: "POST",
                            headers: {
                                    "Content-Type": "application/json"
                                },
                            body: JSON.stringify(shift_personel)
                        });

                        if (!response.ok) throw new Error("Failed to send data");

                        const result = await response.json();
                    }catch(error){
                        console.error(error);
                    }

                    result_box.innerHTML = "";
                    
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


    const daily_shift_container= document.querySelector("#daily_shift_container");
    const weekly_calendar_container = document.querySelector("#weekly_calendar_container");
    const weekly_shift_container= document.querySelector("#weekly_shift_container");
    const daily_calender_container = document.querySelector("#daily_calender_container");

    

    const edit_daily_employee_shifts = document.querySelectorAll(".edit_daily_employee_shift");

    edit_daily_employee_shifts.forEach(shift=>{
        shift.addEventListener("click",(event)=>{
            event.preventDefault();

            const hour = shift.dataset.hour;
            const date =new Date(shift.dataset.date);

            const employees = shift.dataset.employees 
                ? JSON.parse(shift.dataset.employees) 
                : [];
            const timing = shift.dataset.timing;

            // console.log(hour);

            const employee_edition = document.querySelector("#daily_employee_edition");
            daily_calender_container.style.display = "none";

            // daily_shift_container.classList.add("hidden_task");
            weekly_shift_container.classList.add("hidden_task");

            employee_edition.classList.remove("hidden_task");

            shift_editor(timing,employees,hour,date);

        });
    })

    const return_to_shift_button = document.querySelector("#daily_return_to_shift_button");
    return_to_shift_button.addEventListener("click", (event)=>{
        event.preventDefault();
        const employee_edition = document.querySelector("#daily_employee_edition");
        // daily_shift_container.classList.remove("hidden_task");
        

        daily_calender_container.style.display = "grid";
        employee_edition.classList.add("hidden_task");
        weekly_shift_container.classList.add("hidden_task");

    })

    const edit_weekly_employee_shift = document.querySelectorAll(".edit_weekly_employee_shift");
    edit_weekly_employee_shift.forEach(bttn=>{
        bttn.addEventListener("click",(event)=>{
            event.preventDefault();

            const hour = bttn.dataset.hour;
            const date =new Date(bttn.dataset.date);
            const employees = bttn.dataset.employees ? JSON.parse(bttn.dataset.employees) : [];
            const timining = bttn.dataset.timing;

            
        })

    })










    // const weekly_return_to_shift_button = document.querySelector("#weekly_return_to_shift_button");
    // weekly_return_to_shift_button.addEventListener("click", (event)=>{
    //     event.preventDefault();
    //     const employee_edition = document.querySelector("#employee_edition");
    //     const weekly_calender_container= document.querySelector("#weekly_calendar_container");

    //     employee_edition.classList.add("hidden_task");

    // })

    function updateTimeLine() {
        const container = document.querySelector("#daily_calender_container");
        const line = document.querySelector("#current_time_line");

        if (!container || !line) return;

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        
        const containerHeight = container.offsetHeight;
        const hourHeight = containerHeight / 24;
        const top = (hours + minutes / 60) * hourHeight;

        line.style.top = `${top}px`;
    }

    // Run on load
    updateTimeLine();

    // Update every minute
    setInterval(updateTimeLine, 60000);


    function updateTimeLine() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours % 12 || 12}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;

        const line = document.getElementById("current_time_line");

        // Position line based on current time (you already have this logic)
        const container = document.getElementById("daily_calender_container");
        const containerHeight = container.offsetHeight;
        const percentOfDay = (hours * 60 + now.getMinutes()) / (24 * 60);
        line.style.top = `${percentOfDay * containerHeight}px`;

        // Update tooltip text
        line.setAttribute("data-time", timeString);
    }

    setInterval(updateTimeLine, 60000); // update every minute
    updateTimeLine();




    const shift_editor = function(timing,employees,hour,date){
        const current_employee_container = document.querySelector(`#${timing}_current_shift_employees`);
        current_employee_container.innerHTML = "";

        if(employees.length>0){
            const e_header_container = document.querySelector(`#${timing}_users_with_shifts_header`);
            if (employees.length>1){
                e_header_container.innerHTML = `Users assigned for the ${hour} shift are: `;
            }else{
                e_header_container.innerHTML = `User assigned for the ${hour} shift is: `;
            }
            

            const ol = document.createElement("ol");
            // ol.classList.add("")
            employees.forEach(emp=>{

                const li = document.createElement("li");
                
                // li.classList.add()
                
                const emp_span = document.createElement("span");
                emp_span.innerText = emp;
                li.appendChild(emp_span);

                const rmv_span = document.createElement("span");

                const remove_button = document.createElement("button");
                remove_button.innerText = "Remove";
                rmv_span.appendChild(remove_button);
                li.appendChild(rmv_span);

                ol.appendChild(li);

                //this works, used to remove user from database.
                remove_button.addEventListener("click",async (event)=>{
                    // console.log("Works!")
                    const user_data = {
                        name:emp,
                        hour:hour,
                        date:date
                    };
                    try{
                        const response = await fetch("/remove_employee",{
                            method:"POST",
                            headers : {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(user_data)
                        });
                        if (!response.ok) throw new Error("Failed to send data");
                        const result = await response.json();
                    }catch(error){
                        console.error("Error fetching: ", error);
                    }
                })
                
            })
            current_employee_container.appendChild(ol);

        }else{
            const e_header_container = document.querySelector(`#${timing}_current_shift_employees`);
            e_header_container.innerHTML = `No employees are assigned for the ${hour} shift`;
        }

        add_shift_inputs = document.querySelector(`#${timing}_add_shift`);
        add_shift_inputs.addEventListener("input",debounce(()=>{
            const query = add_shift_inputs.value.trim();
            const result_box = document.querySelector(`#${timing}_search_results`);
            if (query.length > 0) {
                search_users(query,hour,date,result_box);
            } else {
                result_box.innerHTML = "";
            }
        },300))
    }






})













