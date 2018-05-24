/*
$('h1').addClass('headline');

var xhr = new XMLHttpRequest();
xhr.open('GET', 'pages/gallery.html',true);
xhr.send();

xhr.onload = function() {
  if (xhr.status == 200 ) {
    console.log("success");
  }
}
*/

$('nav ul li ul li a').on('click', function(e) {
	e.preventDefault();
	var url = this.href;
	console.log(url);
	$('#container').remove();
	$('#contents').load(url).hide().fadeIn('slow');
});



$("#demo").tabulator({
  columns:[
  {title:"Name", field:"name", width:200},
  {title:"Age", field:"age"},
  {title:"Gender", field:"gender"},
  {title:"Height", field:"height", width:80},
  {title:"Favourite Color", field:"col"},
  {title:"Date Of Birth", field:"dob"},
  {title:"Likes Cheese", field:"cheese"},
  ],
});
