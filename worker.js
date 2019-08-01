self.addEventListener('message', function(e) {
  console.log("this worker",this)
  var message = e.data + 'to myself!';
  self.postMessage(message);
  self.close();
})