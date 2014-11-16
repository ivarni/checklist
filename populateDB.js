var PouchDB = require('pouchdb');
var async = require('async');

var remoteCouch = 'https://couch-ivarni-2786861178.iriscouch.com/checklist';
var db = new PouchDB('checklist');

async.series([destroyDB, populateDB, syncDB], function() {
    console.log('Done');
});

function destroyDB(callback) {
    db.allDocs({ include_docs: true, descending: true }, function readCallBack(err, doc) {
        async.map(doc.rows, deleteItem, function() {
            callback();
        })
    });
}

function deleteItem(item, callback) {
    db.remove(item.doc, function(err, doc) {
        console.log('Removed: ', doc.id);
        callback();
    });
}

function populateDB(callback) {
    var items = [
        {
            _id: 'question_1',
            type: 'check_item',
            text: 'Vil informasjonssikkerheten ved Skatteetaten kunne bli truet?'
        },
        {
            _id: 'question_2',
            type: 'check_item',
            text: 'Vil situasjonen kunne var over tid - 24/48 timer eller mer?'
        },
        {
            _id: 'question_3',
            type: 'check_item',
            text: 'Vil situasjonen kunne treffe mange brukere (interne/eksterne)?'
        },
        {
            _id: 'question_4',
            type: 'check_item',
            text: 'Vil situasjonen kunne gi negativ omtale for Skatteetaten eller SITS?'
        },
        {
            _id: 'question_5',
            type: 'check_item',
            text: 'Vil situasjonen kunne medføre store økonomiske konsekvenser?'
        },
        {
            _id: 'question_6',
            type: 'call_to_action',
            text: 'Bør Beredskapsorganisasjonen settes?'
        }
    ];

    async.map(items, saveItem, function(err, results) {
        callback();
    });
}

function syncDB(callback) {
    PouchDB.replicate('checklist', remoteCouch).on('complete', function() {
        console.log('Sync complete');
        callback();
    });
}

function saveItem(item, callback) {
    db.put(item, function addCallback(err, result) {
        console.log('Saved: ', item._id);
        callback(err || result);
    });
}
