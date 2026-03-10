//brew services restart mongodb-community

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcrypt');
const crypto = require('crypto');

//notes on bcrypt:

// Hashing
// const hashed = await bcrypt.hash("mypassword", 10);
// Comparing
// const match = await bcrypt.compare("mypassword", hashed);

const uri = "mongodb://localhost:27017/career"; 

mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB with Mongoose!"))
    .catch(err => console.error("Could not connect to MongoDB:", err));

// Define the schema for a day shift
const shifts = new mongoose.Schema({
   day:String,
   shift:[
    [String,String]
   ]
});

const hours=new mongoose.Schema({
    hours:[String]
});

const task1 = new mongoose.Schema({
  To:String,
  to_email:String,
  From:String,
  from_email:String,
  posted_date: Date,
  task_desc:String,
  links:[String],
  due_by:Date,
  show:Boolean
});


const user = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  netid: String,
  role: String,
  password: String
})

user.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


const advanced_shift = new mongoose.Schema({
  date: { type: Date, required: true },
  shifts: {
    type: Map,
    of: [String]  // key = shift name, value = array of names
  }
})

const invite_token_schema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  email: String,
  first_name: String,
  last_name: String,
  netid: String,
  role: String,
  created_at: { type: Date, default: Date.now, expires: 86400 } // expires after 24h
})

// Create a model
const dayshifts = mongoose.model('shifts', shifts, 'dayshifts'); // Explicitly specify the collection name
const shift_hours =mongoose.model('shift_hours', hours, 'Hours');

const task1_model= mongoose.model('task1_model',task1,'task1');

const user_model = mongoose.model('user_model',user,'users');

const advanced_shift_model = mongoose.model('advanced_shift_model',advanced_shift,'advanced_shift');

const invite_model = mongoose.model('invite_model', invite_token_schema, 'invites');




const fetch_adv_shifts = async () => {
  try{
    const data = await advanced_shift_model.find({});
    // console.log(data);
    data.forEach((d)=>{
      console.log(d.date);
    })
  }catch(err){
    console.error("Error fetching day shifts:", err.message);
  }
}

const fetch_adv_shifts_day = async (date) => {
  const d = new Date(date);
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
  try{
    const res = await advanced_shift_model.findOne({
      date: {$gte:start, $lte:end}
    });
    // console.log(res);
    return res;
    
  }catch(err){
    console.error("Error fetching day shifts:", err.message);
  }
}

const fetch_adv_shifts_week = async (date) => {

  week_object = {};

  const Sunday = new Date(date);
  const day = Sunday.getDay();
  Sunday.setDate(Sunday.getDate()-day);

  days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  for (let i=0; i<7;i++){
    const curr_date = new Date(Sunday);
    curr_date.setDate(curr_date.getDate()+i);

    const start = new Date(Date.UTC(curr_date.getUTCFullYear(), curr_date.getUTCMonth(), curr_date.getUTCDate(), 0, 0, 0, 0));
    const end = new Date(Date.UTC(curr_date.getUTCFullYear(), curr_date.getUTCMonth(), curr_date.getUTCDate(), 23, 59, 59, 999));
    try{
      const res = await advanced_shift_model.findOne({
        date: {$gte:start, $lte:end}
      });
      week_object[days[i]]=res;
      // console.log(res);
    }catch(err){
      console.error("Error fetching day shifts:", err.message);
    }
  }
  return week_object;

}

// fetch_adv_shifts_week("2025-08-28");

const fetch_adv_shifts_month = async (date) => {
  const d = new Date(date);
  const year  = d.getUTCFullYear();
  const month = d.getUTCMonth();

  const start = new Date(Date.UTC(year, month, 1,  0,  0,  0,   0));
  const end   = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)); // last day of month

  try {
    const docs = await advanced_shift_model.find({
      date: { $gte: start, $lte: end }
    });

    // Return a plain object: "YYYY-MM-DD" -> shift document
    const month_map = {};
    docs.forEach(doc => {
      const key = doc.date.toISOString().split('T')[0];
      month_map[key] = doc;
    });
    return month_map;
  } catch (err) {
    console.error("Error fetching month shifts:", err.message);
    return {};
  }
};



const add_person_to_shift = async (addable)=>{

  const d = new Date(addable.date);
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));

  try{
    const existing = await advanced_shift_model.findOne({
      date: {$gte:start, $lte:end}
    })
    


    if (existing){
      console.log();

      if (existing.shifts.has(addable.shift_time)){
        const people = existing.shifts.get(addable.shift_time);
        people.push(addable.name);
        // console.log(existing);
      }else{
        existing.shifts.set(addable.shift_time,[addable.name]);
      }
      await existing.save();
      return existing;
    }else{
      const new_shift = advanced_shift_model.create({
        date:d,
        shifts: {
          [addable.shift_time]: [addable.name]
        }
      })

      return new_shift;
    }

  }catch(err){
    console.error("Error fetching day shifts:", err.message);
  }
}

const addable = {
  name: 'Mola',
  shift_time: '11am',
  date: '2025-08-31T05:32:46.031Z'
}

// add_person_to_shift(addable);
// fetch_adv_shifts_day("2025-08-26");

adv_data = {
  date: new Date(),
  shifts:{
    "6am":["js","ruby on rails"],
    "7am":["oracle","aws"],
    "8am":["word"],
    "9am":["power"],
    "10am":["this fool"],
    "11am":["mac"],
    "12pm":["windows"],
    "1pm":["prime"],
    "2pm":["Kafka"],
    "3pm":["Nika"],
    "4pm":["Sun god"],
    "5pm":["CS"],
    "6pm":["pm"],
    "7pm":["to"],
    "8pm":["am"]
  }
}

const add_to_shifts = async (data) =>{
  const day = new Date(data.date);
  day.setHours(0, 0, 0, 0); // Normalize to midnight
  data.date = day;

  const existing = await advanced_shift_model.findOne({ date: day });
  try{
    if (existing) {
      const updated = await advanced_shift_model.updateOne(
        {date:existing.date},
        {$set:{shifts: data.shifts}}

      )
      console.log("Document for this date already exists, shifts were updated!");
      return existing; // or return some message
    }

    const inserted = await advanced_shift_model.create(data);
    console.log("Inserted:", inserted);
    return inserted;
  } catch (err) {
    console.error("Error adding shifts:", err.message);
    throw err;
  }
}

// add_to_shifts(adv_data);


//we have user name, time and date
// user_data = {
//             name:"Mola Tolo",
//             hour:"12am",
//             date: new Date('2025-09-02T03:07:57.006Z')
//            }
const remove_employee = async (user_data)=>{
  try{
    const day_info = await fetch_adv_shifts_day(user_data.date);

    if (!day_info){
      console.log("No shift found for that date");
      return null;
    }

    const shift_list = day_info.shifts.get(user_data.hour) || [];

    const updated_list = shift_list.filter(emp => emp !== user_data.name);

    day_info.shifts.set(user_data.hour, updated_list);

    await day_info.save();

    return day_info;

  } catch (err) {
    console.error("Error removing employee:", err.message);
  }
}

// remove_employee(user_data);




























// Example function to fetch all documents
const fetchDayShifts = async () => {
    try {
        const data = await dayshifts.find({});
        //console.log("Test data:", data[0]);
        return data;
    } catch (err) {
        console.error("Error fetching day shifts:", err.message);
    }
};

const fetchHours = async () => {
    try {
        let shift_Hours = await shift_hours.find({});
        shift_Hours = shift_Hours[0].hours;
        
        return shift_Hours;
    } catch (err) {
        console.error("Error fetching day shifts:", err.message);
    }
};




// Insert a document to create the collection (if it doesn't exist)
const edit_dayshifts = async (date_i, hour_j, first_name, second_name) => {
    let date_name='';
    if (date_i == 0){
          date_name='Sunday';
        }else if (date_i === 1){
          date_name='Monday';
        }
        else if (date_i === 2){
          date_name='Tuesday';
        }
        else if (date_i === 3){ 
          date_name='Wednesday';
        }
        else if (date_i === 4){
          date_name='Thursday';
        }
        else if (date_i === 5){
          date_name='Friday';
        }
  try {
  
    const result = await dayshifts.updateOne(
      { day: date_name}, 
      { $set: { [`shift.${hour_j}`]: [first_name, second_name] } } 
    );

    // console.log("Update result:", result);

  } catch (error) {
    console.error("Error editting day shift:", error);
  }
   //const data = await dayshifts.find({});
   //console.log("Test data:", data[0]);
};

//edit_dayshifts(0, 0, "Sam Meta", "Leka");


const fetchtask1 = async ()=>{
  try {
    let task_list = await task1_model.find({});
    return task_list;
  } catch (err) {
    console.error("Error fetching day shifts:", err.message);
  } 
};

// let d=fetchtask1();
// d.then((dt)=>{
//   console.log(dt);
// });

const addable_task={
  To: 'Mimi',
  to_email: 'zhaile@nd.edu',
  From: 'Do You Love me',
  from_email: 'zelalemaddisu94@gmail.com',
  posted_date: new Date('2025-05-22T00:38:08.272Z'),
  task_desc: 'Do that and this and then this',
  links: [ 'https://', 'https://' ],
  due_by: new Date('2025-12-31T10:00:00.000Z'),
  show: true
}

//console.log(addable_task);

const add_task1 = async (addable)=>{
  let is_inserted = await task1_model.create(addable);
  return is_inserted;
};

// let d = add_task1(addable_task);
// d.then((dt)=>{
//   console.log(dt);
// }); 



const done_button_task1 = async (id) => {
  return await task1_model.updateOne(
    { _id: new ObjectId(id) },
    { $set: { show: false } }
  );
};

// const id = '688a324990d19fd8efdc3b04';

// done_button_task1(id).then((res) => {
//   console.log(res); // { acknowledged: true, modifiedCount: 1, ... }
// });

// new_object = {
//   _id: '688fc075f7cdc6bd92725324',
//   To: 'Zeleke',
//   to_email: 'yetemeta@nd.edu',
//   From: 'Lekeke',
//   from_email: 'leka@me.edu',
//   posted_date: '2025-08-03',
//   task_desc: 'This is the third task to see how the mother links work!',
//   links: [
//     'https://www.geeksforgeeks.org/mongodb/mongoose-updateone-function/',
//     'https://www.figma.com/design/z3jqdwVAb6vNu9S6Nhh86I/career?node-id=1-12'
//   ],
//   due_by: '2025-08-06',
//   show: true
// }


const edit_task = async (new_object) => {
  new_object.due_by = new Date(new_object.due_by);
  new_object.posted_date = new Date(new_object.posted_date);

  return await task1_model.updateOne(
    {_id:new ObjectId(new_object._id)},
    {$set:{To:new_object.To, to_email:new_object.to_email, From:new_object.From, from_email:new_object.from_email, posted_date:new_object.posted_date, task_desc: new_object.task_desc, links: new_object.links, due_by: new_object.due_by}}
  )
}

// edit_task(new_object).then();




// const dt= fetchDayShifts();
// dt.then((just)=>{
//     just.forEach((day)=>{ 
//         day.shift.forEach((ea)=>{
//             console.log(ea[0]);
//             console.log(ea[1]);
//         })
//     })

// });



const get_all_users = async ()=>{
  try{
    let all_users = await user_model.find({});
    // console.log(all_users);
    return all_users;
  }catch (err){
    console.log(err)
  }
}

// get_all_users().then()


const find_user = async (email) => {
  try{
    let one_user = await user_model.findOne({email:email});
    return one_user;
    // console.log(one_user);
  }catch (err){
    console.log(err);
  }
}



// find_user("azeleke@nd.edu")
// .then((exists)=>{
//   console.log(exists);
// }).catch((err)=>{
//   console.log(err)
// });


let user0_info = {
  first_name: "Zelalem",
  last_name: "Haile",
  email: "zhaile@nd.edu",
  netid: "zhaile",
  role: "sub_admin",
  password: "dontsuckem"
}

let user_info = {
  first_name: "Abebe",
  last_name: "Zeleke",
  email: "z@y.h",
  netid: "azeleke",
  role: "admin",
  password: "z"
}

let user2_info = {
  first_name: "Abebe",
  last_name: "Zeleke",
  email: "eke@nd.edu",
  netid: "azeleke",
  role: "ca",
  password: "dontsuckem"
}

//adding a user
const add_user = async (user_info)=>{
  //check if user exists, add is not there already
  let user = await find_user(user_info.email);

  if (!user){
    let added_user = await user_model.create(user_info);
    if (added_user) console.log("added successfully");
  }else{
    console.log("The email is already taken");
  }
  
}

// add_user(user_info);
//use: z@y.h and z as password to test as admin

const remove_user = async (email) => {
  try {
    const result = await user_model.deleteOne({ email });
    return result.deletedCount > 0;
  } catch (err) {
    console.error("Error removing user:", err.message);
    return false;
  }
};

//change role

const change_role = async (user) => {
  let changed = await user_model.updateOne(
    {_id:new ObjectId(user._id)},
    {$set: {role:user.role,first_name:user.first_name,last_name:user.last_name,email:user.email,netid:user.netid}});

  if (changed){
    console.log("Changed role successfully")
  }else{
    console.log("Failed to change role")
  }
}

const search_user = async (name)=>{
    let users = await user_model.find({
      $or:[
        {first_name: {$regex: name,$options: "i" }},
        {last_name: {$regex: name,$options: "i" }}
      ]
     
      // last_name: {$regex: last_name,$options:"i"}
    })
    // console.log(users)
    return users;
    
}

// search_user("Zelalem");



const changing={
  first_name: 'Zelalem',
  last_name: 'Haile',
  email: 'zhaile@nd.edu',
  netid: 'zhaile',
  role: 'admin',
  _id: '689cc08b3b979dc6ad2f2997'
}

// change_role(changing);

//authenticate career assistant
const auth_user = async (email,password) =>{
  const user = await find_user(email);

  if (!user){
    console.log("You are not authorized");
    return false;
  }

  const pass_matches = await bcrypt.compare(password,user.password);
  if (pass_matches){
    console.log("Authenticated");
    return true;
  }else{
    console.log("Wrong password!");
    return false;
  }
}

// auth_user("eke@nd.edu","dontsuckem");


const create_invite = async (user_info) => {
  const token = crypto.randomBytes(32).toString('hex');
  await invite_model.create({
    token,
    email: user_info.email,
    first_name: user_info.first_name,
    last_name: user_info.last_name,
    netid: user_info.netid,
    role: user_info.role
  });
  return token;
};

const find_invite = async (token) => {
  return await invite_model.findOne({ token });
};

const delete_invite = async (token) => {
  return await invite_model.deleteOne({ token });
};

const change_password = async (email, new_password) => {
  const hashed = await bcrypt.hash(new_password, 10);
  return await user_model.updateOne({ email }, { $set: { password: hashed } });
};

// Export the model (optional, if needed in other files)
module.exports = {
  fetchDayShifts,
  fetchHours,
  edit_dayshifts,
  fetchtask1,
  add_task1,
  done_button_task1,
  edit_task,
  auth_user,
  find_user,
  add_user,
  get_all_users,
  change_role,
  search_user,
  fetch_adv_shifts_day,
  add_person_to_shift,
  remove_employee,
  fetch_adv_shifts_week,
  fetch_adv_shifts_month,
  remove_user,
  create_invite,
  find_invite,
  delete_invite,
  change_password
};