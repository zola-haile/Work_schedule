const shifts = require('./mongooseSchema/shifts.js');
//const updater = require('./mongooseSchema/update.js');



module.exports=(app)=>{
    //displays the given page from the get go
    app.get('/',async(req,res)=>{
        try{
            let [name,hours] = await Promise.all(
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

    app.get('/tasks',(req,res)=>{
        res.render('tasks');
    });





    
};