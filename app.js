var express= require('express');
var http=require('http');
var bodyParser=require('body-parser');
require('dotenv').config();
var multer= require('multer');
var cors= require('cors');
var fs= require('fs');
var db=require('./config/database');

const app=express();

//To set the storage for File upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
	const dir = './public';
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
      cb(null, './public')
    },
    filename: async (req, file, cb)=> {
       
      var arr=file.originalname.split('.');
      var ext=arr[arr.length-1];
      
      var name = new Date().getTime().toString();
      req.file=file;
      req.filesName = name + '.' + ext;
      cb(null, name + '.' + ext);
    }
})
var upload = multer({ 
  storage: storage,
  limits: {
        fileSize: 100 * 1024 * 1024, // 100MB in bytes
    },
  fileFilter: (req, file, cb) => {
	cb(null, true);
  }
 });

global.upload = upload;


//Middleware to handle to Request Body
app.use(cors({
    origin: true, 
    credentials: true,
    methods: 'POST,GET,PUT,OPTIONS,DELETE' 
}));  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/',function(req,res){
    return res.send('Tab & Relax API Connected')
});

// var table=require('./modals/share_contact');

// table.sync({force:true})
//   .then(() => {
//     console.log('Database & tables created!');
//   });


//Importing Routes files
app.use('/api/account',require('./routes/accountRoutes'));
app.use('/api/master',require('./routes/masterRoutes'));
app.use('/api/customer',require('./routes/customerRoutes'));

var server=http.createServer(app);

var port=process.env.PORT;
server.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})