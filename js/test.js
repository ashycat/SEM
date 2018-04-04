/*
$('h1').addClass('headline');
*/
var xhr = new XMLHttpRequest();
xhr.open('GET', 'pages/gallery.html',true);
xhr.send();

xhr.onload = function() {
  if (xhr.status == 200 ) {
    console.log("success");
  }
}
