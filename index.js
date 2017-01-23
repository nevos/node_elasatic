var elasticsearch = require('elasticsearch');
var trim = require('trim');
var client = new elasticsearch.Client({
  host: '139.59.208.209:9200',
  log: 'trace'
});

client.ping({
  requestTimeout: 30000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

var index_name = "402demo11" ;
var index_type_data = "heb2" ;
//check_data() ;
init_tag_insert() ;
//init_category_insert() ;

function check_data() {
	client.search({
	  index: index_name,
	  type: index_type_data,
	  size: '2000',
	  body: {
		fields : 'tags'
	  }
	},getData) ;
}

function getData(err, resp, status) {
	// create a list of tags
	hits = resp.hits.hits;
	console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX") ;
	
	console.log(hits) ;
	
	console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY") ;
} ;


function init_tag_insert() {
	client.search({
	  index: index_name,
	  type: index_type_data,
	  size: '2000',
	  body: {
		fields : 'tags'
	  }
	},getTags) ;
}


function init_category_insert() {
	client.search({
	  index: index_name,
	  type: index_type_data,
	  size: '2000',
	  body: {
		fields : '_id'
	  }
	},getEntryID) ;
}




function getTags(err, resp, status) {
	// create a list of tags
	hits = resp.hits.hits;
	console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX") ;
	
	var data = hits;
    var tags ="" ; 
	for(var i in data)
	{
		 tags += "|" + data[i].fields.tags;
	}
	

	var split = tags.split("|");
	
	
	for(var i in split)
	{
		 split[i] = trim(split[i]);
	}
	
	var unique = Array.from(new Set(split))
	
	console.log(unique) ;
	
	console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY") ;
	// set tags in type tags
	addTagsToIndex(unique) ;
} ;

function addTagsToIndex(tags) {
   for(var i in tags)
	{
	client.index({  
	  index: index_name,
	  id: i  ,
	  type: 'tags',
	  body: {
		"value": tags[i],
	  }
	},function(err,resp,status) {
		console.log(resp);
	});
	}		

}



function init() {
	client.search({
	  index: index_name,
	  type: index_type_data,
	  size: '2000',
	  body: {
		fields : 'tags'
	  }
	},getTags) ;
}


function getEntryID(err, resp, status) {
	// create a list of tags
	hits = resp.hits.hits;
	console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX") ;
	var ids = [];
	var data = hits;
    
	for(var i in data)
	{
//		console.log (data[i]._id)	 ;
		ids[i] =   data[i];
	}
	

	
	
	
	console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY") ;
	// set tags in type tags
	random_add_categories(ids) ;
} ;


function random_add_categories(ids) {
var categories = ["מסעדה","בית קפה","סופרמרקט","בית תמחוי"] ;
	
   for(var i in ids)
	{
		var randi = Math.floor(Math.floor((Math.random() * 10) + 1) * 0.3) ;
//		console.log(categories[randi]) ;
//		console.log(ids[i]._id) ;
		
	client.update({  
	  index: index_name,
	  id: ids[i]._id ,
	  type: index_type_data,
	  body: {
		  doc: {
				"categories": categories[randi],
		  }
	  }
	},function(err,resp,status) {
		console.log(resp);
	});
	}		

}







