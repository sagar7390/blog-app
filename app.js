var express=require("express"),
	mongoose=require("mongoose"),
	bodyParser=require("body-parser"),
	methodOverride=require("method-override");
	app=express();


var port = process.env.PORT || 8080

//mongoose.connect("mongodb://localhost/restful_blog_app");// connecting to mongodb locally	

mongoose.connect("mongodb://sagarjha:sagarjha@ds249737.mlab.com:49737/newblogapp");// connecting through heroku and mongolab



app.set("view engine","ejs");

app.use(express.static("public"));


app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG 
var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);


//RESTful ROUTES
app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	//res.render("index");
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}else{
			res.render("index",{blogs:blogs});
		}

	});
});


//NEW
app.get("/blogs/new",function(req,res){
	res.render("new");
});



app.post("/blogs",function(req,res){
	Blog.create(req.body.blog,function(err,newblog){
		if(err){
			res.render("new");
		} else{
			res.redirect("/blogs");
		}
	});
});


//SHOW
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundblog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundblog});
		}
	});
});

//EDIT
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundblog){
		if(err){
			res.render("/blogs");
		}else{
			res.render("edit",{blog:foundblog});
		}
	});
	
});

//UPDATE
app.put("/blogs/:id",function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETE ROUTE

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});

//app.listen(3000,function(){
//	console.log("SERVER is running!!");
//});

app.listen(port,function(){
	console.log("SERVER is running!!");
});


