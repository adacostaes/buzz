var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/test";
var myobj = { name: "Company Inc", address: "Highway 37" };

var mybigobj = [
    { name: 'John', address: 'Highway 71'},
      { name: 'Peter', address: 'Lowstreet 4'},
    { name: 'Amy',   address: 'Apple st 652'},
    { name: 'Hannah', address:   'Mountain 21'},
    { name: 'Michael', address: 'Valley 345'},
    { name: 'Sandy', address: 'Ocean blvd 2'},
      { name: 'Betty', address: 'Green Grass 1'},
    { name:   'Richard', address: 'Sky st 331'},
    { name: 'Susan',   address: 'One way 98'},
    { name: 'Vicky', address:   'Yellow Garden 2'},
    { name: 'Ben', address: 'Park Lane 38'},
    { name: 'William', address: 'Central st 954'},
      { name: 'Chuck', address: 'Main Road 989'},
    { name:   'Viola', address: 'Sideway 1633'}
  ];
  

function addTable(tableName,collectionName) {	
    var dbo = db.db(tableName);
	    dbo.createCollection(collectionName,   function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
}

  function insertObject(objet,db) {
	 var dbo = db.db("test");
	 dbo.collection("customers").insertOne(myobj, function(err, res) {
     if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });

  }
  
  function insertManyObject(mybigobj,db) {
	 var dbo = db.db("test");
	 dbo.collection("customers").insertMany(mybigobj, function(err, res) {
     if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });

  }  
  
  function findFirstCustomer (db) {
	  	 var dbo = db.db("test");
	  dbo.collection("customers").findOne({}, function(err, result) {
    if (err) throw err;
    console.log(result.name);
    db.close();
    });
  }
  
    function findAllCustomers (db) {
	  	 var dbo = db.db("test");
	  dbo.collection("customers").find({},{ projection: { _id: 0   } }).sort({ name: 1 }).limit(5).toArray(function(err, result) {
    if (err) throw err;
	console.log(result);
    db.close();
    });
  }
  
  function deleteObjectByAddress(myquery,db) {
	  	  	 var dbo = db.db("test");
	  dbo.collection("customers").deleteOne({ address: myquery}, function(err, obj) {
      if (err) throw err;
    console.log("1 document deleted");
    db.close();
  });
  }
    function deleteManyObjectByAddress(myquery,db) {
	  	  	 var dbo = db.db("test");
	  dbo.collection("customers").deleteMany({ address: myquery}, function(err, obj) {
      if (err) throw err;
    console.log("Documents deleted");
    db.close();
  });
  }
    function updateObjectByAddress(myquery,newvalues,db) {
	 var dbo = db.db("test");
		dbo.collection("customers").updateOne(myquery,   newvalues, function(err, res) {
    if (err) throw err;
      console.log("1 document updated");
      db.close();
		
  });
      function updateManyObjectByAddress(myquery,newvalues,db) {
	 var dbo = db.db("test");
		dbo.collection("customers").updateMany(myquery, newvalues, function(err, res) {
    if (err) throw err;
      console.log("1 document updated");
      db.close();
		
  });
	  }
	}
	function dropCollection(collectionName,db) {
			 var dbo = db.db("test");
	dbo.collection(collectionName).drop(function(err, delOK) {
      if (err) throw err;
    if (delOK) console.log("Collection deleted");
    db.close();
  });
	}
  
MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
  
if (err) throw err;

// addTable("","");
//insertObject(myobj,db);
//	insertManyObject(mybigobj,db);
// findFirstCustomer(db);

// findAllCustomers(db);
//deleteObjectByAddress("Park Lane 38",db);
//deleteManyObjectByAddress({ address: /^O/ },db);

//updateObjectByAddress({ address: "Valley 345" },{$set: {name:   "Mickey", address: "Canyon 123" } },db);
//dropCollection("customers",db);
});

