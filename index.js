const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const upload = require("./utils/multer");
const path=require('path');
const cloudinary = require("./utils/cloudinary");
const User = require('./models/user');




let app = express();

const port = process.env.PORT || 5000;
mongoose.connect('mongodb+srv://rekhav:rekhav123@cluster0.fj0hh.mongodb.net/experimenting?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true,
}).then(()=>{
    console.log('Database connected...');
})

app.set('views', 'views');
app.set('view-engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));

// cloudinary.config({
//     cloud_name: 'dxqt710fe',
//     api_key: '444586859851492',
//     api_secret: 'ZlNBXDRZQ_PHnXyZ5KK75ZQceKM'
// })

app.get('/',(req,res)=>{
    res.send('hiii');
})

app.get('/dashboard/:page', (req,res)=>{
    var perPage = 5
    var page = req.params.page || 1

    User
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, data) {
            User.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('show.ejs', {
                    products: data,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
})

var multipleUpload = upload.fields([{name:'image', maxCount:1},{name:'pdf',maxCount:1}]);

app.post('/post',multipleUpload, async(req,res)=>{
    const result = await cloudinary.uploader.upload(req.files['image'][0].path);
    const result2 = await cloudinary.uploader.upload(req.files['pdf'][0].path);
    let user = new User({
        name: req.body.name,
        image: result.secure_url,
        pdf: result2.secure_url,
        cloudinaryImage_id: result.public_id,
        cloudinaryPdf_id: result2.public_id
    });
    await user.save();
    res.send('done');
    
})

app.get('/show', (req,res)=>{
    User.find({}, (err,data)=>{
        if(err) throw err;
        else res.render('show.ejs', {book: data});
    });
})

app.post('/rating', (req,res)=>{
    res.send(req.rate);
})


app.listen(port, ()=> {console.log('server started')});