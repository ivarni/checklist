var PouchDB = require('pouchdb');
var db = new PouchDB('checklist');
var remoteCouch = 'https://couch-ivarni-2786861178.iriscouch.com/checklist';

db.changes({
    since: 'now',
    live: true
}).on('change', getItems);

sync();

function sync() {
    var opts = { live: true };
    db.replicate.to(remoteCouch, opts, syncError);
    db.replicate.from(remoteCouch, opts, syncError);
}

function syncError() {
    console.log(arguments);
}

function getItems() {
    db.allDocs({ include_docs: true, descending: true }, function readCallBack(err, doc) {
        redraw(doc.rows);
    });
}

function redraw(items) {
    document.getElementById('app').innerHTML = '';
    var list = createList(items);
    document.getElementById('app').appendChild(list);
}

function createList(items) {
    var ul = document.createElement('ul');
    items.forEach(function(item) {
        var text = item.doc.text;
        var li = document.createElement('li');
        li.innerHTML = text;
        ul.appendChild(li);
    });
    return ul;
}

function handleAddEvent(event) {
    return addItem(document.getElementsByTagName('input')[0].value);
}

