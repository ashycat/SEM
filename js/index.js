
$('h1').addClass('headline');


var xhr = new XMLHttpRequest();
xhr.open('GET', 'pages/gallery.html',true);
xhr.send();

xhr.onload = function() {
  if (xhr.status == 200 ) {
    console.log("success");
  }
}


$('nav ul li a').on('click', function(e) {
	e.preventDefault();
	var url = this.href;
	console.log(url);
	$('#container').remove();
	$('#contents').load(url).hide().fadeIn('slow');
});

$('#loginBtn').on('click',function(e) {
  $.session.set('loginid', '8000011291');
  console.log($.session.get('loginid'));
  $('#c').hide();
  $('#d').hide();
  $('#e').hide();
});
