var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));

// Connecting to databse
db = mongoose.connect('mongodb://localhost/blogdb');

//checking db connection success
mongoose.connection.once('open', function() {

	console.log("database connection opened successfully");

});

//  db model file
var Blog = require('./blogmodel.js');
var blogModel = mongoose.model('Blog');


app.use(function(req,res,next){
	console.log("Time n Date Log ",new Date());
	console.log("Request url Log ",req.originalUrl);
	console.log("Request Method Log ",req.method);
	console.log("Request Ip address Log ",req.ip);
	next();
});




app.get('/', function (req, res) {

  res.send("This is a  Rest API for Blog App")

});

// route to GET all blogs
app.get('/blogs',function(req, res) {

  blogModel.find(function(err,result){
    if(err){
			res.send(err)
		}
		else{
			res.send(result)
		}
	});

});


app.get('/blogs/:id',function(req, res) {

	blogModel.findOne({'_id':req.params.id},function(err,result){
		if(err){
			console.log("something is not working");
			res.send(err);
		}
		else{
			res.send(result)
		}
	});

});
// end route to get a unique blog

//start route to create a blog
	app.post('/blog/create',function(req, res) {
		var newBlog = new blogModel({

			title 		: req.body.title,
			subTitle 	: req.body.subTitle,
			blogBody 	: req.body.blogBody

		}); // end newBlog

		//date
		var today = Date.now();
		newBlog.created = today;

		//tags
		var allTags = (req.body.allTags!=undefined && req.body.allTags!=null)?req.body.allTags.split(','):''
		newBlog.tags = allTags;

		// author
		var authorInfo = {fullName: req.body.authorFullName,email:req.body.authorEmail,website:req.body.authorWebsite};
		newBlog.authorInfo = authorInfo;

		newBlog.save(function(err){
			if(err){
				console.log(err, "something is not working");
				res.send(err);

			}
			else{
				res.send(newBlog);
			}

		});


	});

// end route to Create a blog

// blog edit
app.put('/blogs/:id/edit',function(req, res) {

	var update = req.body;

	blogModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){

		if(err){
			console.log("something is not working");
			res.send(err)
		}
		else{
			res.send(result)
		}


	});

});
// end blog edit


//  delete a blog
app.post('/blogs/:id/delete',function(req, res) {

	blogModel.remove({'_id':req.params.id},function(err,result){

		if(err){
			console.log("some error");
			res.send(err)
		}
		else{
			res.send(result)
		}


	});
});


app.listen(3000, function () {
  console.log('BlogApp  listening on port 3000!');
});