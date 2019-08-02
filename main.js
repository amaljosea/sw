// var worker = new Worker('worker.js');
// worker.addEventListener('message', function(e) {
//   console.log(e.data);
// })
// worker.postMessage('Happy Birthday');
// console.log("this main", this);


var request = this.indexedDB.open('EXAMPLE_DB', 1);

request.onupgradeneeded = function(event) {
  var db = event.target.result;
  var store = db.createObjectStore('products', {keyPath: 'id'});
// create unique index on keyPath === 'id'
  store.createIndex('products_id_unqiue', 'id', {unique: true});
};

request.onsuccess = function(event) {
    // some sample products data
    var products = [
        {id: 1, name: 'Red Men T-Shirt', price: '$3.99'},
        {id: 2, name: 'Pink Women Shorts', price: '$5.99'},
        {id: 3, name: 'Nike white Shoes', price: '$300'}
    ];
// get database from event
    var db = event.target.result;
// create transaction from database
    var transaction = db.transaction('products', 'readwrite');
// add success event handleer for transaction
    // you should also add onerror, onabort event handlers
    transaction.onsuccess = function(event) {
        console.log('[Transaction] ALL DONE!');
    };
// get store from transaction
    // returns IDBObjectStore instance
    var productsStore = transaction.objectStore('products');
// put products data in productsStore
    products.forEach(function(product){
        var db_op_req = productsStore.add(product); // IDBRequest
        db_op_req.onsuccess = function(event) {
          console.log(event.target.result == product.id); // true
        };
        db_op_req.onerror = function(event) {
            // handle error
        };
    });
    productsStore.count().onsuccess = function(event) {
      console.log('[Transaction - COUNT] number of products in store', event.target.result);
  };

      // get product with id 1
      productsStore.get(1).onsuccess = function(event) {
        console.log('[Transaction - GET] product with id 1', event.target.result);
    };

    // update product with id 1
    products[0].name = 'Blue Men T-shirt';
    productsStore.put(products[0]).onsuccess = function(event) {
        console.log('[Transaction - PUT] product with id 1', event.target.result);
    };

    // delete product with id 2
    productsStore.delete(2).onsuccess = function(event) {
        console.log('[Transaction - DELETE] deleted with id 2');
    };
    
};