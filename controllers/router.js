const shifts = require('./mongooseSchema/shifts.js');
//const updater = require('./mongooseSchema/update.js');

const require_login = (req,res,next)=>{
    if(!req.session.user){
        return res.redirect('/login');
    }
    next();
}

module.exports = (app)=>{
    
    app.get('/login',(req,res)=>{
        res.render('login');
    })

    app.post('/login',async (req,res)=>{
        const { email, password } = req.body;
        const authenticated = await shifts.auth_user(email, password);

        if (!authenticated) {
            return res.redirect('/login');
        }

        const user = await shifts.find_user(email);
        req.session.user = user;

        return res.redirect('/');
    })

    // Home page — advanced shifts
    app.get('/', require_login, async (req, res) => {
        const date = req.query.date ? new Date(req.query.date) : new Date();
        const view = req.query.view || "daily";
        const [day_shift, week_shift, month_shift] = await Promise.all([
            shifts.fetch_adv_shifts_day(date),
            shifts.fetch_adv_shifts_week(date),
            shifts.fetch_adv_shifts_month(date)
        ]);
        res.render('ashifts_tab', { shift: day_shift, selected_date: date, req, week_shift, month_shift, view });
    });



    // /tasks leads to page where all the tasks get posted
    app.get('/tasks', require_login, async (req,res)=>{
       try{
            //
            let task_1_list = await (shifts.fetchtask1());
            // task_1_list.forEach((t)=>{
                // console.log(t);
            // });
            res.render('admin_tasks_tab',{task:task_1_list,req:req});
        }
        catch{

        }
    });

    // addes the task to the data base when submitted
    app.post('/task1', async (req, res) => {
        const addable_task = req.body;

        // Object.entries(addable_task).forEach(([key, value]) => {
            // console.log(`${key}:`, value);
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

    app.post("/edit_task", async (req,res)=>{

        try {
            // do update logic here...
            let edditable_object = req.body;
            // console.log(edditable_object);

            const updated = await shifts.edit_task(edditable_object);

            if (updated){
                console.log("Successfully edited task!");
            }else{
                console.log("Failed to edit task!")
            }
            res.json({ success: true, message: "Task updated" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: "Server error" });
        }
        
    })

    app.get('/user', require_login, async (req,res)=>{

        const all_users = await shifts.get_all_users();
        res.render('admin_user_tab',{req:req, user : all_users});
    })

    app.post('/user/add_role',async (req,res)=>{

        const user_info = req.body;
        try{
            shifts.add_user(user_info);
            // console.log(user_info); 
            res.json({success:true})
        }catch(err){
            console.error(err);
            res.status(500).json({ success: false, error: "Server error" });
        }
    })

    app.get("/user/:id", require_login,async (req,res) => {
        const user = await shifts.find_user(req.params.id);
        res.render('user_info',{user:user, req:req});
        // res.json(user);
    })

    app.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/login');
    });

    app.post('/user/remove', async (req, res) => {
        const { email } = req.body;
        try {
            const removed = await shifts.remove_user(email);
            if (removed) {
                res.json({ success: true });
            } else {
                res.status(404).json({ success: false, error: "User not found" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, error: "Server error" });
        }
    });

    app.post("/user/update", async (req,res)=>{
        const editted_user_info = req.body;
        // console.log(editted_user_info);

        shifts.change_role(editted_user_info);
        res.json({success:true})
    })

    app.get("/users/search", require_login,async (req, res) => {
        const query = req.query.q;
        if (!query) {
            return res.json([]);
        }
        try {
            const users = await shifts.search_user(query);
            // console.log(users);
            res.json(users);
        } catch (err) {
            console.error("❌ Mongo search failed:", err);
            res.status(500).json({ error: "Search failed" });
        }
    });

    // Legacy redirect — keep old /ashift URLs working
    app.get("/ashift", require_login, (req, res) => {
        const query = new URLSearchParams(req.query).toString();
        res.redirect(query ? `/?${query}` : '/');
    });

    app.post("/adding_employee_shift",(req,res)=>{
        const shift_personel = req.body;
        // console.log(shift_personel);
        shifts.add_person_to_shift(shift_personel);
        res.json({success:true})
    })

    app.post("/remove_employee",(req,res)=>{
        const user_data = req.body;

        // console.log(user_data);

        const removed = shifts.remove_employee(user_data);

        if(!removed){
            console.log("Sorry dod not remove");
        }else{
            console.log("Removed Successfully");
        }

        res.json({success:true});
    });

}