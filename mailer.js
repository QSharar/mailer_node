var express = require("express");
var bp = require("body-parser");
var exphbs = require("express-handlebars");
var path = require("path");
var nodemailer = require("nodemailer");

var app = express();
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");



app.use( (req, res, next)=>{
    console.log(`${req.method} --> ${req.url}`);
    next();
} );


app.use("/public" , express.static(path.join(__dirname, "public")));

app.use(bp.urlencoded({extended: false}));
app.use(bp.json());

app.get("/add", (req, res) => {
    res.render('contact');

});

app.post("/add", (req, res) => {
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
        // host: 'smtp.ethereal.email',
        // port: 587,
         secure: false, // true for 465, false for other ports
        // auth: {
        //     user: account.user, // generated ethereal user
        //     pass: account.pass  // generated ethereal password
        // }
        service: 'gmail',
        auth: {
            user: 'enter the email you want to send from',
            pass: 'enter your actual password here'
        },
        tls: {
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
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));


    });
});

    res.render("contact", {msg: "Email Successfully Sent"});
    
    
});



app.listen(9000);


