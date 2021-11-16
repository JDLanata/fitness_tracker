const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require('path');

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });



app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/stats.html"))
});
app.get('/exercise', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/exercise.html"))
});



app.put("/api/workouts/:id", (req, res) => {
    db.Workout.findByIdAndUpdate({_id: req.params.id},{$push: {exercises: req.body}})
    .then(dbWork => {
        res.json(dbWork);
    })
    .catch(err => {
        res.json(err);
    });
})


app.post("/api/workouts", (req, res) => {
    db.Workout.create({})
    .then(dbWork => {
        res.json(dbWork);
    })
    .catch(err => {
        res.json(err);
    });
});

app.get("/api/workouts", (req, res) => {
    db.Workout.aggregate([
        {
            $addFields: {
                totalDuration: { 
                    $sum: "$exercises.duration" 
                } 
            }
        }
    ])
    .then(data=>{
        res.json(data)
    }).catch(err=>{
        console.log(err)
        res.json(err)
    })
    
});

app.get("/api/workouts/range", (req, res) =>{
    db.Workout.aggregate([
        {
            $addFields: {
                totalDuration: { 
                    $sum: "$exercises.duration" 
                } 
            }
        }
    ])
    .sort({_id:-1})
    .limit(7)
    .then(data=>{
        res.json(data)
    }).catch(err=>{
        console.log(err)
        res.json(err)
    })
    
    
})









app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});