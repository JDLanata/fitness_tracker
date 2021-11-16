const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/custommethoddb", { useNewUrlParser: true });

app.post("/workout", ({ body }, res) => {
    db.Workout.create(body)
})

app.get("/stats", (req, res) => {
    db.Workout.find({})
    .then(dbWork => {
        res.json(dbWork);
    })
    .catch(err =>{
        res.json(err);
    })


})
app.get("/exercise")














app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});