var express     = require('express');  
var mongoose    = require('mongoose');  
var multer      = require('multer');  
var path        = require('path');  
var csvModel    = require('./models/medicineModel');  
var csv         = require('csvtojson');  
var bodyParser  = require('body-parser');  
const uuid = require("uuid");
var storage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
      cb(null,'./public/uploads');  
    },  
    filename:(req,file,cb)=>{  
      cb(null,file.originalname);  
    }  
});  
var uploads = multer({storage:storage});  
//connect to db  
mongoose.connect('mongodb+srv://user007:alwaysme@cluster0.itp2v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useNewUrlParser:true})  
  .then(()=>console.log('connected to db'))  
  .catch((err)=>console.log(err));  
//init app  
var app = express();  
//set the template engine  
app.set('view engine','ejs');  
//fetch data from the request  
app.use(bodyParser.urlencoded({extended:false}));  
app.use(bodyParser.json());
//static folder  
app.use(express.static(path.resolve(__dirname,'public')));  
//default pageload  
app.get('/',(req,res)=>{  
  csvModel.find((err,data)=>{  
    if(err){  
      console.log(err);  
    }else{  
      if(data!=''){  
        res.render('index',{data:data});  
      }else{  
        res.render('index',{data:''});  
      }  
    }  
  });  
});  
app.post('/uploadCSV',uploads.single('csv'),(req,res)=>{  
//convert csvfile to jsonArray     
  csv()  
  .fromFile(req.file.path)  
  .then((jsonObj)=>{  
    console.log('json object created');
    csvModel.insertMany(jsonObj,(err,data)=>{  
    if(err){  
      console.log(err);  
    }else{  
      res.redirect('/');  
    }  
    });  
  });  
});  
app.get('/getMedicineDetails', (req,res)=>{
  let c_unique_id = req.body.c_unique_id;
  csvModel.find({'c_unique_code':c_unique_id},function(err,data){
    res.setHeader('Content-Type', 'application/json');
    if(err)
      res.send(err);
    else
      res.send({'data':data});
  });
  console.log(c_unique_id);
});

app.get('/searchMedicine',(req,res)=>{
  let name = req.body.name;
  csvModel.find({ "c_name": { $regex: '.*' + name + '.*' }},'c_name',function(err,data){
    res.setHeader('Content-Type', 'application/json');
    if(err)
      res.send(err);
    else
      res.send({'data':data});
  });
});

app.put('/placeorder',async (req,res)=> {
  let c_unique_id = req.body.c_unique_id;
  let quantity = req.body.quantity;
  let c_name = req.body.c_name;
  let data = await csvModel.findOne({ "c_name": c_name, "c_unique_code": c_unique_id});
  let orignal_quantity = data.n_balance_qty;
  let finalData;
  if(orignal_quantity>quantity){
    let temp = orignal_quantity-quantity;
    finalData = await csvModel.findOneAndUpdate({ "c_name": c_name, "c_unique_code": c_unique_id},{"n_balance_qty":temp});
    res.setHeader('Content-Type', 'application/json');
    finalData = await csvModel.findOne({ "c_name": c_name, "c_unique_code": c_unique_id});
    if(!finalData){
      res.send({"err": "didnt find any data"});
    }
    else
      res.send({"oder_id":uuid.v4()});
  }
  else{
    res.send({err:"error in quantity"});
  }

  
  
});
//assign port  
var port = process.env.PORT || 3000;  
app.listen(port,()=>console.log('server run at port '+port));  