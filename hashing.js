const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require('mongoose-encryption');
const md5 = require('md5');

const app = express();

//console.log(md5("12345"));

app.use(express.static("public"));
app.use(bodyparser.urlencoded({
    extended:true
}));

app.set("view engine", "ejs");



mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

const secret="this is my secret";

//userSchema.plugin(encrypt, { secret: secret , encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/submit",(req,res)=>{
    res.render("submit");
});

app.post("/register",(req,res)=>{
    const newUser = new User({
        email : req.body.username,
        password : md5(req.body.password)
    });

    newUser.save()
        .then(() => {
           // console.log('Document saved successfully:', newUser);
            res.render("secrets");
          })
          .catch((error) => {
            console.error('Error saving document:', error);
          });
    });


    app.post("/login", async (req, res) => {
        const username = req.body.username;
        const password = md5(req.body.password);
      
        try {
          const foundUser = await User.findOne({ email: username }).exec();
      
          if (foundUser) {
            if (foundUser.password === password) {
              res.render("secrets");
            } else {
              res.send("Incorrect password");
            }
          } else {
            res.send("User not found");
          }
        } catch (err) {
          console.error(err);
          res.send("An error occurred");
        }
      });
      

app.listen(3000,()=>{
    console.log("port connected successfully");
})

