const shifts = require('./mongooseSchema/shifts.js');
//const updater = require('./mongooseSchema/update.js');



module.exports=(app)=>{
    //displays the given page from the get go
    //currently, / is home page route
    app.get('/',async(req,res)=>{
        try{
            let [name,hours] = await Promise.all(
                //fetches name of people assigned to each day, along with day of the week + list of hours
                [shifts.fetchDayShifts(),shifts.fetchHours()]
            )
            res.render('index',{item:name,item2:hours});
        }catch(err){
            console.log("Sorry No luck");
            res.status(500).send("Internal Server Error");
        }

    });

    app.post('/', (req, res) => {
        //console.log("here");
        const { first, second, i, j } = req.body;

        // console.log("Received data:");
        // console.log("First Input:", first);
        // console.log("Second Input:", second);
        // console.log("i:", i);
        // console.log("j:", j);

        // Call the function to update the database
        shifts.edit_dayshifts(parseInt(i),parseInt(j),first,second)
            .then(() => {
                console.log("Database updated successfully");
            })
            .catch((error) => {
                console.error("Error updating database:", error);
            });

        // Respond with a message or process the data
        res.json({ message: "Shift successfully submitted!" });
    });



    // /tasks leads to page where all the tasks get posted
    app.get('/tasks',async (req,res)=>{
       try{
            //
            let task_1_list = await (shifts.fetchtask1());
            // task_1_list.forEach((t)=>{
            //     console.log(t);
            // });
            res.render('tasks',{task:task_1_list});
        }
        catch{

        }
    });

    // addes the task to the data base when submitted
    app.post('/task1', async (req, res) => {
        const addable_task = req.body;

        // Object.entries(addable_task).forEach(([key, value]) => {
        //     console.log(`${key}:`, value);
        // });
        let added = shifts.add_task1(addable_task);

        if (added){
            console.log("Succesfully added");
        }else{
            console.log("Failed to add");
        }
            
        res.json({ message: "Task received successfully!" });
    });

    app.post('/task/done', async (req,res)=>{
        task_id = req;
        // console.log(task_id.body.id);
        // console.log(task_id.id);


        shifts.done_button_task1(task_id.body.id);
        res.json();
    })

}