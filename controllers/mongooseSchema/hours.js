const mongoose = require("mongoose");
const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/career"; // Replace with your database name

mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB with Mongoose!"))
    .catch(err => console.error("Could not connect to MongoDB:", err));

// Define Schema for 'dayShifts' (data for each weekday)
const dayShiftSchema = new mongoose.Schema({
    hours: {
            type: [String],
            required: true,
        }
});

// Create the 'hours' model
const DayShifts = mongoose.model('DayShifts', dayShiftSchema, 'hours');

// Fetch all documents from the 'hours' collection
const fetchDayShifts = async () => {
    try {
        const data = await DayShifts.find({});
        console.log("All documents in 'hours' collection:", data);
    } catch (error) {
        console.error("Error fetching day shifts:", error.message);
    }
};

fetchDayShifts();
// Define the schema for a day shift
const testSchema = new mongoose.Schema({
    day: String,
    shifts: [
        [String, String]
    ]
});
exports.testSchema = testSchema;

