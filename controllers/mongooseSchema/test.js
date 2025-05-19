const shifts = require('./shifts.js');

 shifts.fetchDayShifts().then((shifts)=>{
        console.log(shifts);
    }).catch((err)=>{
        console.log("Sorry No luck")
    }) 