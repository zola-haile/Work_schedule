const mongoose = require('mongoose');

// MongoDB connection URI
const uri = "mongodb://localhost:27017/career";

// Connect to the MongoDB database
mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Connection error:", err));


// Define the schema for a day shift
const shifts = new mongoose.Schema({
   day:String,
   shift:[
    [String,String]
   ]
});

// Create a model

const dayshifts = mongoose.model('shifts', shifts, 'dayshifts'); // Explicitly specify the collection name

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

    console.log("Update result:", result);

  } catch (error) {
    console.error("Error editting day shift:", error);
  }
  const data = await dayshifts.find({});
  console.log("Test data:", data[date_i]);
};

edit_dayshifts(0, 5, "Kiki", "Alex");


//module.exports = { edit_dayshifts };
