var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/project281";

function generate(req,res){
var temp=Math.random();
var num=temp*10000;
num=Math.ceil(num);
console.log("UID IN JS: "+req.param("uid"));
var uid=req.param("uid");
mongo.connect(mongoURL, function(){
         console.log('Connected to mongo at: ' + mongoURL);
         var newfolder={cart_id:num,user_id:uid,status:"open",total:0};
         var coll = mongo.collection('cart_details');
         coll.insertOne(newfolder, function(err, restl) {
         if (err){
res.render('error.ejs');
                 console.log("Failed signup---");
 res.render('error.ejs');
           //throw err;
         }//if
         else{
           //res.render('home.ejs',{uid: uid});
           var cursor = coll.find();
           cursor.toArray(function(err,doc){
             console.log("UID"+ uid);
             console.log("cart"+doc[0]._id)
             res.render("home.ejs",{uid:uid ,carts:doc});
           });//each


         }//else

       console.log("HELLO");
  });//query


     });//mongo

}





exports.createcartid=generate;
