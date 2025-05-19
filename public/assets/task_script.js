document.addEventListener("DOMContentLoaded",()=>{
    const task1 = document.querySelector(".task_cat1");

    task1.addEventListener("click",(event)=>{
        event.preventDefault();
        document.querySelector("#cont_1").classList.remove('hidden_task');
        document.querySelector("#cont_2").classList.add('hidden_task')
    });


    const task2 = document.querySelector(".task_cat2");

    task2.addEventListener("click",(event)=>{
        event.preventDefault();

        document.querySelector("#cont_1").classList.add('hidden_task');
        document.querySelector("#cont_2").classList.remove('hidden_task');
    })
});
