var dbPromise = idb.open('fav', 1, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains('team')) {
      var teamOS = upgradeDb.createObjectStore('team', {keyPath: 'id', unique: true});
    }
  });

  var msg=`<p>Added to favorite</p>`;
  function setData(id, hT, aT, c, d) {
    dbPromise.then(function(db) {
        var tx = db.transaction('team', 'readwrite');
        var store = tx.objectStore('team');
        var item = {
          id: id,
          homeTeam: hT,
          awayTeam: aT,
          competition: c,
          date: d
        };
        store.put(item);
        return tx.complete;
      }).then(function() {
        console.log('added item to the store os!');
      })
      .catch(error => {
        msg = `<p>Failed added to favorite</p>`;
        console.log(error);

      });
  }
  var del=`<p>Deleted from favorite</p>`;
  function delData(key){
    dbPromise.then(function(db) {
        var tx = db.transaction('team', 'readwrite');
        var store = tx.objectStore('team');
        store.delete(key);
        return tx.complete;
      }).then(function() {
        console.log('Item deleted');
      });
  }

  function showData() {
    var html = "";
    dbPromise.then(function(db) {
        var tx = db.transaction('team', 'readonly');
        var store = tx.objectStore('team');
        return store.openCursor();
      }).then(function logItems(cursor) {
        if (!cursor) {
          return;
        }
        
            html += `
            <tr>
            <td>${cursor.value.homeTeam}</td>
            <td>${cursor.value.awayTeam}</td>
            <td>${cursor.value.date}</td>
            <td>${cursor.value.competition}</td>
            <td><button onclick = "delData(${cursor.key});showData();M.toast({html: del, displayLength: 1500})" href=""><i class="fa fa-trash" aria-hidden="true"></i></button></td>
            </tr>
            `;
        
        return cursor.continue().then(logItems);
      }).then(function() {
        if (html === "") {
          html = `<p>Anda belum menandai jadwal pertandingan yang akan datang</p>`
        }

        var closedTagTable = `</table></br></br>`;
        var headStandingTable = `
        <table>
          <tr>
            <th>Home Team</th>
            <th>Away Team</th>
            <th>Held at</th>
            <th>Competition</th>
            <th></th>
          </tr>`;
        document.getElementById("articles").innerHTML = headStandingTable + html + closedTagTable;
      });
  }

