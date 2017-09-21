var express = require("express");
var bp = require("body-parser");
var exphbs = require("express-handlebars");
var path = require("path");
var nodemailer = require("nodemailer");

var app = express(); //create the express app
app.engine("handlebars", exphbs()); //registering the templating engine
app.set("view engine", "handlebars"); //set the engine as the default view engine



app.use( (req, res, next)=>{
    console.log(`${req.method} --> ${req.url}`);
    next();
} );  //log the url and request for every transaction 


app.use("/public" , express.static(path.join(__dirname, "public"))); //set the public directory 

app.use(bp.urlencoded({extended: false})); //middleware for URL encoding/decoding and JSON formating 
app.use(bp.json());

app.get("/add", (req, res) => { //GET Route and render the view
    res.render('contact');

});

app.post("/add", (req, res) => { //on post, call nodemailer and pass HTML variable with values.
    console.log(req.body);
    const output = `
        New Signup!
        Contact Details
        <ul>
            <li>Contact Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
    `;

    nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        
        service: 'gmail',
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'enter the email you want to send from',
            pass: 'enter your actual password here'
        },
        tls: { //for access from non local host 
            rejectUnauthorized: false
        }

    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Mailer Contact" <enter email adress here>', // sender address
        to: 'enter emails here', // list of receivers
        subject: 'Hello, New Contact Added ✔', // Subject line
        text: 'New Mail', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
      
    });
});

    res.render("contact", {msg: "Email Successfully Sent"});
    
    
});



app.listen(9000);


