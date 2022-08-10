var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var path = require('path');
var csvModel = require('./models/medicineModel');
var csv = require('csvtojson');
var bodyParser = require('body-parser');
const orderController = require("./controller/orderController");
const uuid = require("uuid");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
var uploads = multer({ storage: storage });

mongoose.connect('mongodb+srv://user007:alwaysme@cluster0.itp2v.mongodb.net/kore-ai?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(() => console.log('connected to db'))
  .catch((err) => console.log(err));

var app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});
// "add" api to add new order with reqired fields
app.post('/add', orderController.addOrder);
// "update/:id" update order details
app.post('/update/:id', orderController.updateOrder);
// "updateStatus/:id" update the route from packed,placed, dispactched,delivered
app.post('/updateStatus/:id', orderController.updateStatus);
// "delete/:id" to delete the order
app.post('/delete/:id', orderController.deleteOrder);
// "checkCapacity/:date" return the left milk as per orders of the day
app.post('/checkCapacity/:date', orderController.checkCapacity);

//assign port  
var port = process.env.PORT || 3000;
app.listen(port, () => console.log('server run at port ' + port));  