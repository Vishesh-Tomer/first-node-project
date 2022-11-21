require('dotenv').config();
const express = require("express");
const path =  require("path");
const app = express();
require("./db/conn");
const hbs = require("hbs")
const Register = require("./models/registers")
// require("../public/css/style.css")
const { json } = require("express");
const bcrypt = require("bcryptjs")




const port = process.env.PORT || 5000;

const static_path = path.join(__dirname, "../public/css/style.css")
console.log(static_path)
const template_path = path.join(__dirname, "../template/views")
const partials_path = path.join(__dirname, "../template/partials")

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path)

// console.log(path.join(__dirname, "../public"))

// console.log(process.env.SECRET_KEY);






app.get("/", (req,res) => {
    res.render("index");
})


app.get("/register", (req, res) => {
    res.render("register");
})

app.get("/login", (req,res) => {
    res.render("login");
})


app.post("/register", async(req,res) => {
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password === cpassword){
            const registerEmploy = new Register({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                phone : req.body.phone,
                age : req.body.age,
                password : password,
                confirmpassword: cpassword
            })
            console.log("the sucess part", registerEmploy)
            const token = await registerEmploy.generateAuthToken();
            console.log("the token part", token)

            const register = await registerEmploy.save();
            console.log("the page part", register);

            res.status(201).render("index")

        }else{
            res.send("password are not matching")
        }
    }catch(e){
        res.status(400).send(e);
    }
})


app.post("/login", async(req, res) => {
    try{

        const email = req.body.email;
        const password = req.body.password;

        const userEmail = await Register.findOne({email:email})

        const isMatch = await bcrypt.compare(password, userEmail.password)

        const token = await userEmail.generateAuthToken();
        console.log("the token part", token)
        
        if(isMatch){
            res.status(201).render("index");
        }else {
            res.send("invalid login details")
        }
    }catch(e){
        res.status(400).send("invalid login details")
    }
})


// const jwt = require("jsonwebtoken");

// const createToken = async () => {
//     const token = await jwt.sign({ _id:"6379e2922e9c29b31fc401a6"}, "jhgdayw674sgahywtrs54768absg56sgdarst56", {
//         expiresIn: "2 minutes"
//     })
    
//     console.log(token)

//     const userVerify = await jwt.verify(token, "jhgdayw674sgahywtrs54768absg56sgdarst56")
//     console.log(userVerify)
// }

// createToken();

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})