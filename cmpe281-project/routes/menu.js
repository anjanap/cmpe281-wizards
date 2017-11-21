
var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/project281";
var ObjectId = require('mongodb').ObjectID;
var cartItems=[];
var cart = require("./cart");
var menu1=[], menu2=[], menu3=[], menu4=[], menuFinal=[], total=0.00,cid=0,uid=0;


function menus(req,res){
	console.log("HELLO");
	cid=req.param("cartid");
	uid=req.param("uid");
	console.log("UID: "+uid+" CID: "+cid);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('product_catalog');
		menu1=[], menu2=[], menu3=[], menu4=[], menuFinal=[], cartItems=[], total=0.00
		coll.find().toArray(function(err, menu){
			if (menu) {
				//console.log("USER: "+user.name+" College:"+user.college);

				menuFinal=menu;

				menu.forEach(function(item) {
					if(item.category_id==1){
						menu1.push(item);
					}
					if(item.category_id==2){
						menu2.push(item);
					}
					if(item.category_id==3){
						menu3.push(item);
					}
					if(item.category_id==4){
						menu4.push(item);
					}

				});
				console.log("CID: "+cid);
				res.render('menu.ejs', {menu1:menu1,menu2:menu2,menu3:menu3,menu4:menu4, cartItems:cartItems,total:total });
			} else {
				res.render('error.ejs');
			}
		});
	});
}

function addToCart(req,res){

	var product_id = req.query.product_id;

	menuFinal.forEach(function(item) {
		if(item.product_id==product_id){
			console.log(item.product_id+"item.product_id");
			if(item.quantity===undefined||item.quantity==0){
				item.quantity=1;
				cartItems.push(item);
			}else{
				item.quantity=item.quantity+1;
			}
			//category.check(item.product_id)
			total=total+item.price;
		}

	});
	console.log("CID: "+cid);
	res.render('menu.ejs', {menu1:menu1,menu2:menu2,menu3:menu3,menu4:menu4, cartItems:cartItems, total:total });

}

function deleteFromCart(req,res){

	var product_id = req.query.product_id;

	for(var i=0;i<cartItems.length;i++){
		 if (cartItems[i].product_id == product_id) {
			 total=total-cartItems[i].price*cartItems[i].quantity;
			 cartItems[i].quantity=0;
	          cartItems.splice(i, 1);

	        }
	}
	console.log("CID: "+cid);
	res.render('menu.ejs', {menu1:menu1,menu2:menu2,menu3:menu3,menu4:menu4, cartItems:cartItems, total:total });

}


function confirmOrder(req,res){
  cart.cart(cartItems,uid,cid);
  var usercol = mongo.collection('user_details');
	var ty='';
	usercol.findOne({ _id: ObjectId(uid) }, function(err,user){
		if (user) {
			ty=user.flag;
			console.log("FLAG CHECK: "+ty);
			if(ty==0)
			res.render('payment.ejs',{uid:uid,cid:cid,total: 500});
			else
			res.render('cart.ejs');
		}
	});

	//console.log("AFTER INSERT RES:-------"+r);
	/*if(r==0){
res.render('cart.ejs');
}
	else {
		res.render();
	}*/
	//render Pooja's Page
	//res.render('menu.ejs', {menu1:menu1,menu2:menu2,menu3:menu3,menu4:menu4, cartItems:cartItems, total:total });

}

exports.menus=menus;
exports.addToCart=addToCart;
exports.deleteFromCart=deleteFromCart;
exports.confirmOrder=confirmOrder;
