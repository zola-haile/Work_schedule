//brew services restart mongodb-community
const mongoose = require("mongoose");

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

// Create a model
const dayshifts = mongoose.model('shifts', shifts, 'dayshifts'); // Explicitly specify the collection name
const shift_hours =mongoose.model('shift_hours', hours, 'Hours');

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
module.exports = {fetchDayShifts,fetchHours,edit_dayshifts};