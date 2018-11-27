1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');
 
//start mysql connection
var connection = mysql.createConnection({
  host     : 'localhost', //mysql database host name
  user     : 'root', //mysql database user name
  password : '', //mysql database password
  database : 'dummy_db' //mysql database name
});
 
connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
})
//end mysql connection
 
//start body-parser configuration
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//end body-parser configuration
 
//create app server
var server = app.listen(3000,  "127.0.0.1", function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("Example app listening at http://%s:%s", host, port)
 
});
 
//rest api to get all results
app.get('/employees', function (req, res) {
   connection.query('select * from employee', function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});
 
//rest api to get a single employee data
app.get('/employees/:id', function (req, res) {
   console.log(req);
   connection.query('select * from employee where id=?', [req.params.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});
 
//rest api to create a new record into mysql database
app.post('/employees', function (req, res) {
   var postData  = req.body;
   connection.query('INSERT INTO employee SET ?', postData, function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});
 
//rest api to update record into mysql database
app.put('/employees', function (req, res) {
   connection.query('UPDATE `employee` SET `employee_name`=?,`employee_salary`=?,`employee_age`=? where `id`=?', [req.body.employee_name,req.body.employee_salary, req.body.employee_age, req.body.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});
 
//rest api to delete record from mysql database
app.delete('/employees', function (req, res) {
   console.log(req.body);
   connection.query('DELETE FROM `employee` WHERE `id`=?', [req.body.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end('Record has been deleted!');
	});
});