function $(v){
    return document.getElementById(v);
}
var user;

window.onload =function(){
	if(window.location.href=="http://localhost/test/login.html"){
		return null;
	}
	else if(document.cookie == null || document.cookie == ''){
			// Simulate an HTTP redirect:
			window.location.replace("http://localhost/test/login.html");
	}
	if(document.cookie!= null && window.location.href=="http://localhost/test/login.html" ){
		$('logged').innerHTML='<h4 style="text-align:right; class=inline"> Logged in</h3>';
	}
};

var clicks=0;

const RAPIDAPI_API_URL = 'http://localhost:8080/rest/';
const RAPIDAPI_REQUEST_HEADERS = {
'Content-Type': 'application/json',
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': "GET, PUT, POST, DELETE, HEAD, OPTIONS"
};

	function submit(){ //used for search all page.
		var location=document.querySelector('input[name="q"]:checked').value;
		var url=RAPIDAPI_API_URL+location;


		console.log(url);

		//document.getElementById("text").innerHTML ='' ;

		axios.get(url, { headers: RAPIDAPI_REQUEST_HEADERS })
		.then(response => {
          console.log(response.data);

		  if(clicks >=1){
			  var countRows= $("res").rows.length
			  for(i=0;i< countRows;++i){
				  console.log(countRows+ " "+i)
					$("res").deleteRow(0);
			  }
			  countRows=0;
		  }

		  if(location=='transaction'){
			for(i=0;i<response.data.result.length;i++){
				var name =response.data.result[i].Ref;
				//$("text").innerHTML +=name;
				var table=$("res");
				var row = table.insertRow(-1);
				var cell = row.insertCell(0);
				var cell2 =row.insertCell(1)
				cell.innerHTML = name;
				cell2.innerHTML= response.data.result[i].Gross;
				clicks++;
			}
		  }
		  if(location=='person'){
			for(i=0;i<response.data.result.length;i++){
				
				var name =response.data.result[i].first_name+",\n";
				//$("text").innerHTML +=name;

				var table=$("res");
				var row = table.insertRow(-1);
				var cell = row.insertCell(0);
				var cell2 =row.insertCell(1)
				cell.innerHTML = name;
				cell2.innerHTML= response.data.result[i].last_name;
				clicks++;
			}
		}
		})
		.catch(error => {
			console.error('', error);
			alert("An error Ocurred! Please try again"+" "+error.status);
		});
	}


	function login(){ //Login
		var url=RAPIDAPI_API_URL+"login";

		var p=$("pass").value;
		var u=$("user").value;

		if (u == "" || p=="" ||u == undefined || p==undefined ){
			alert("Invalid username or password");
			return null;
		}

		axios.post(url,{user:u,password:p} ,{ headers: RAPIDAPI_REQUEST_HEADERS })
		.then(response => {
			if(response.status != 200){
				throw err
			}
          console.log(response);
		  alert("Logged in sucessfully");
		  var cookie=response.data.token.login_token;
		  console.log(cookie);
		  document.cookie="login-token="+cookie+"; site=localhost";

		// Simulate an HTTP redirect:
		window.location.replace("http://localhost/test/index.html");
		var user=u;
		//$('logged').innerHTML='<h3 style="text-align:right; class=inline"> Logged in as: '+user+'</h3>';

		})
		.catch(error => {
			console.error('', error);
			alert("An error Ocurred! Please try again");
		});

}	

function search(){ //Search person


	var u=$("user").value;
	var url=RAPIDAPI_API_URL+"person/"+u;

	if (u == "" || u == undefined ){
		alert("invalid  name");
		return null;
	}

	axios.get(url,{name:u} ,{ headers: RAPIDAPI_REQUEST_HEADERS })
	.then(response => {
	  console.log(response);
	  //alert(response.status);
	  document.cookie="login-token="+response.data.token+"; site=localhost";

	  if(clicks >=1){
		var countRows= $("res").rows.length
		for(i=0;i< countRows;++i){
			console.log(countRows+ " "+i)
			  $("res").deleteRow(0);
		}
		countRows=0;
	}
	if(response.data.result.length==0){
		var table=$("res");
		var row = table.insertRow(-1);
		var cell = row.insertCell(0);
		cell.innerHTML = "<p>No Users Found</p>";
		clicks++;
	}

	for(i=0;i<response.data.result.length;i++){
				
		var name =response.data.result[i].first_name+",\n";

		var table=$("res");
		var row = table.insertRow(-1);
		var cell = row.insertCell(0);
		var cell2 =row.insertCell(1);
		var cell3 =row.insertCell(2)
		var cell4 =row.insertCell(3)
		var cell5 =row.insertCell(4)
		var cell6 =row.insertCell(5)
		var cell7 =row.insertCell(6)


		cell.innerHTML = "<p>Name:</p>";
		cell2.innerHTML= response.data.result[i].first_name;
		cell3.innerHTML= response.data.result[i].last_name;
		cell4.innerHTML="<p>| ID:</p>";
		cell5.innerHTML=response.data.result[i].id;
		cell6.innerHTML="<p>| Email:</p>";
		cell7.innerHTML=response.data.result[i].email;

		clicks++;
	}
})
	.catch(error => {
		console.error('', error);
		alert("An error Ocurred! Please try again"+" "+error.status);
	});

}	

function createP(){ //Create new person
	url=RAPIDAPI_API_URL+"create";

	var id,fname, lname,email,dob;
	id=$("id").value
	fname=$("fname").value;
	lname=$("lname").value;
	email=$("email").value;
	dob=$("dob").value;

	data={
		"id":id,
		"fname":fname,
		"lname":lname,
		"email":email,
		"dob":dob
}

	axios.post(url,data ,{ headers: RAPIDAPI_REQUEST_HEADERS })
		.then(response => {
          console.log(response);
		  //alert(response.status);
		  alert("Success!")
		})
		.catch(error => {
			console.error('', error);
			alert("An error Ocurred! Please try again"+" "+error.status);
		});
}



