//brew services restart mongodb-community
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

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

// Create a model
const dayshifts = mongoose.model('shifts', shifts, 'dayshifts'); // Explicitly specify the collection name
const shift_hours =mongoose.model('shift_hours', hours, 'Hours');

const task1_model= mongoose.model('task1_model',task1,'task1');

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




// const dt= fetchDayShifts();
// dt.then((just)=>{
//     just.forEach((day)=>{ 
//         day.shift.forEach((ea)=>{
//             console.log(ea[0]);
//             console.log(ea[1]);
//         })
//     })

// });

// Export the model (optional, if needed in other files)
module.exports = {fetchDayShifts,fetchHours,edit_dayshifts,fetchtask1,add_task1,done_button_task1};