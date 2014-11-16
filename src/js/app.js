var PouchDB = require('pouchdb');
var db = new PouchDB('checklist');
var remoteCouch = 'https://couch-ivarni-2786861178.iriscouch.com/checklist';

db.changes({
    since: 'now',
    live: true
}).on('change', getItems);

getItems();
sync();

function sync() {
    var opts = { live: true };
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
        var item = createListItem(text);
        ul.appendChild(item);
    });
    return ul;
}

function createListItem(text) {
    var label = document.createElement('label');
    label.setAttribute('class', 'topcoat-checkbox');

    var span = document.createElement('span');
    span.innerHTML = text;

    var input = document.createElement('input');
    input.setAttribute('type', 'checkbox');

    var div = document.createElement('div');
    div.setAttribute('class', 'topcoat-checkbox__checkmark');

    label.appendChild(input);
    label.appendChild(div);
    label.appendChild(span);

    var li = document.createElement('li');
    li.appendChild(label);

    return li;
}

function handleAddEvent(event) {
    return addItem(document.getElementsByTagName('input')[0].value);
}

