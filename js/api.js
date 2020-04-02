const base_url = "https://api.football-data.org/v2";
const id_base = [2000,2002,2003,2013,2014,2015,2016,2017,2019,2021];
const img_list_color = [
  '/img/ball_color_1.png',
  '/img/ball_color_2.png',
  '/img/ball_color_3.png',
  '/img/ball_color_4.png',
  '/img/ball_color_5.png',
  '/img/ball_color_6.png'
];
const img_list_grey = [
  '../img/grey_1.png',
  '../img/grey_2.png',
  '../img/grey_3.png',
  '../img/grey_4.png',
  '../img/grey_5.png',
  '../img/grey_6.png',
  '../img/grey_7.png',
  '../img/grey_8.png',
  '../img/grey_9.png',
];
const loader = `<div class="loader"></div>`;

function fetchWithToken(url){
  return fetch(url, {
    url: url,
    crossOrigin: true,
    headers: {
      'X-Auth-Token': config.API_KEY
    },
    dataType: 'json',
    type: 'GET',
  }).then(status)
  .then(json)
}

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}
// Blok kode untuk melakukan request data json
function getCompetition() {
  const randomNumber = Math.floor(Math.random() * (img_list_grey.length-1));

  if ("caches" in window) {
    caches.match(base_url + "/competitions/").then(function(response) {
      if (response) {
        response.json().then(function(data) {
          document.getElementById("articles").innerHTML = loader;
          let articlesHTML = "";
          data.competitions.forEach(function(competitions) {
          for (let i = 0; i<id_base.length; i++) {
           if (competitions.id === id_base[i]) {
            articlesHTML += `
            <div class="col s12 m6 l4 card-panel z-depth-0">
              <a href="/info.html?id=${competitions.id}" class="modal-trigger">
              <div class="center-align hoverable  blue-grey lighten-4 z-depth-1">
                <div class="card-panel z-depth-0 grey lighten-4 center-align">
                  <b class="grey-text text-darken-3">${competitions.name}</b>
                </div>
                <div class="card-content  blue-grey lighten-4 center-align">
                  <b class="grey-text text-darken-3">${competitions.area.name}</b>
                </div>
              </div>
              </a>
            </div>
              `;
            } 
          }
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("icon-random").src = img_list_grey[randomNumber];
          document.getElementById("articles").innerHTML = articlesHTML;
      });
      }
    });
  }

  fetchWithToken(base_url + "/competitions/")
    .then(function(data) {
      // Menyusun komponen card artikel secara dinamis
      let articlesHTML = "";
      data.competitions.forEach(function(competitions) {
        for (let i = 0; i<id_base.length; i++) {
          if (competitions.id === id_base[i]) {
            document.getElementById("articles").innerHTML = loader;
            articlesHTML += `
            <div class="col s12 m6 l4 card-panel z-depth-0">
              <a href="/info.html?id=${competitions.id}" class="modal-trigger">
              <div class="center-align hoverable  blue-grey lighten-4 z-depth-1">
                <div class="card-panel z-depth-0 grey lighten-4 center-align">
                  <b class="grey-text text-darken-3">${competitions.name}</b>
                </div>
                <div class="card-content blue-grey lighten-4 center-align">
                  <b class="grey-text text-darken-3">${competitions.area.name}</b>
                </div>
              </div>
              </a>
            </div>
              `;
            } 
        }
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("icon-random").src = img_list_grey[randomNumber];
      document.getElementById("articles").innerHTML = articlesHTML;
    })
    .catch(error);
}

function getStandings() {
  // Ambil nilai query parameter (?id=)
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  const randomNumber = Math.floor(Math.random() * (img_list_color.length-1));
  document.getElementById("test-swipe-1").innerHTML = loader;
  document.getElementById("img-random").src = img_list_color[randomNumber];

  if ('caches' in window) {
    caches.match(base_url + "/competitions/" + idParam + "/standings" ).then(function(response) {
      if (response) {
        response.json().then(function (data) {
          const groupDataAll = [];
          const dataHTML = "";
          
          for (let i = 0; i<data.standings.length; i++) {
            if (data.standings[i].type === "TOTAL") {
              groupDataAll.push(data.standings[i].group);
            }
          }
          const groupData = groupDataAll.filter((value, index, self) => self.indexOf(value) === index);

          const groupDataHTML = [];
          for (let i=0; i<groupData.length; i++) {
            groupDataHTML[i] = dataHTML;
          }
          const nameTable=[];
          for (let i=0; i<groupData.length; i++) {
            for (let j=0; j<data.standings.length; j++) {
              if (groupData[i] === data.standings[j].group && data.standings[j].type === 'TOTAL') {
                if (groupData[i] !== null){
                  nameTable[i] = `<h5>${groupData[i]}</h5>
                  <table>`;
                } else {
                  nameTable[i] = `<table>`;
                }
                  for (let x=0; x<data.standings[j].table.length; x++) {
                    groupDataHTML[i] += `
                      <tr>
                        <td>${data.standings[j].table[x].team.name}</td>
                        <td>${data.standings[j].table[x].won}</td>
                        <td>${data.standings[j].table[x].draw}</td>
                        <td>${data.standings[j].table[x].lost}</td>
                        <td>${data.standings[j].table[x].points}</td>
                      </tr>
                    `;
                  }
                }
              }              
            }
          const closedTagTable = `</table></br>`;
          const headStandingTable = `
          <tr>
              <th>Team</th>
              <th>Won</th>
              <th>Draw</th>
              <th>Lost</th>
              <th>Points</th>
          </tr>`;

          for (let i=0; i<groupDataHTML.length; i++) {
              groupDataHTML[i] = nameTable[i] + headStandingTable + groupDataHTML[i] + closedTagTable;
          }

          let articlesHTML = "";
          for (let i=0; i<groupData.length; i++) {
              articlesHTML += groupDataHTML[i];
          }
          
          if(data.season.winner !== null) {
            const winner = `
            <div class="col s12 m10 offset-m1 l10 offset-l1">
              <div class="card-panel grey lighten-5 z-depth-1">
                <div class="row valign-wrapper">
                  <div class="col s3">
                    <img src="${data.season.winner.crestUrl}" alt="" class="circle responsive-img">
                  </div>
                  <div class="col s9"><h5>${data.season.winner.name}</h5>
                  <p>Winner in this competition</p>
                  </div>                 
                </div>
              </div>
            </div>
            `;
            document.getElementById("winner").innerHTML = winner;
          }
          const header = `${data.competition.name} ( ${data.competition.area.name} )`;
          document.getElementById("header").innerText = header;
          document.getElementById("test-swipe-1").innerHTML = articlesHTML;
        });
      }
    });
  }

  fetchWithToken(base_url + "/competitions/" + idParam + "/standings")
    .then(function(data) {
      // Menyusun komponen card artikel secara dinamis
      const groupDataAll = [];
      const dataHTML = "";
      
      for (let i = 0; i<data.standings.length; i++) {
        if (data.standings[i].type === "TOTAL") {
          groupDataAll.push(data.standings[i].group);
        }
      }
      const groupData = groupDataAll.filter((value, index, self) => self.indexOf(value) === index);

      const groupDataHTML = [];
      for (let i=0; i<groupData.length; i++) {
        groupDataHTML[i] = dataHTML;
      }
      const nameTable=[];
      for (let i=0; i<groupData.length; i++) {
        for (let j=0; j<data.standings.length; j++) {
          if (groupData[i] === data.standings[j].group && data.standings[j].type === 'TOTAL') {
            if (groupData[i] !== null){
              nameTable[i] = `<h5>${groupData[i]}</h5>
              <table>`;
            } else {
              nameTable[i] = `<table>`;
            }
              for (let x=0; x<data.standings[j].table.length; x++) {
                groupDataHTML[i] += `
                  <tr>
                    <td>${data.standings[j].table[x].team.name}</td>
                    <td>${data.standings[j].table[x].won}</td>
                    <td>${data.standings[j].table[x].draw}</td>
                    <td>${data.standings[j].table[x].lost}</td>
                    <td>${data.standings[j].table[x].points}</td>
                  </tr>
                `;
              }
            }
          }              
        }
      const closedTagTable = `</table></br>`;
      const headStandingTable = `
      <tr>
          <th>Team</th>
          <th>Won</th>
          <th>Draw</th>
          <th>Lost</th>
          <th>Points</th>
      </tr>`;

      for (let i=0; i<groupDataHTML.length; i++) {
          groupDataHTML[i] = nameTable[i] + headStandingTable + groupDataHTML[i] + closedTagTable;
      }

      let articlesHTML = "";
      for (let i=0; i<groupData.length; i++) {
          articlesHTML += groupDataHTML[i];
      }
      
      if(data.season.winner !== null) {
        const winner = `
        <div class="col s12 m10 offset-m1 l10 offset-l1">
          <div class="card-panel grey lighten-5 z-depth-1">
            <div class="row valign-wrapper">
              <div class="col s3">
                <img src="${data.season.winner.crestUrl}" alt="" class="circle responsive-img">
              </div>
              <div class="col s9"><h5>${data.season.winner.name}</h5>
              <p>Winner in this competition</p>
              </div>                 
            </div>
          </div>
        </div>
        `;
        document.getElementById("winner").innerHTML = winner;
      }
      const header = `${data.competition.name} ( ${data.competition.area.name} )`;
      document.getElementById("header").innerText = header;
      document.getElementById("test-swipe-1").innerHTML = articlesHTML;
    })
    .catch(error);
}

function getScorers() {
  // Ambil nilai query parameter (?id=)
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  document.getElementById("test-swipe-2").innerHTML = loader;

  if ('caches' in window) {
    caches.match(base_url + "/competitions/" + idParam + "/scorers" ).then(function(response) {
      if (response) {
        response.json().then(function (data) {
          let scorerHTML = "";
          data.scorers.forEach(scorers => {
            scorerHTML += `
            <tr>
              <td>${scorers.player.name}</td>
              <td>${scorers.team.name}</td>
              <td>${scorers.player.position}</td>
              <td>${scorers.numberOfGoals}</td>
            </tr>
            `;
          })

          const closedTagTable = `</table></br>`;
          const openTagTable = `<table>`;
          const headStandingTable = `
          <table>
          <tr>
              <th>Name</th>
              <th>Team</th>
              <th>Position</th>
              <th>Goals</th>
          </tr>`;

          const articlesHTML = openTagTable + headStandingTable + scorerHTML + closedTagTable; 

          document.getElementById("test-swipe-2").innerHTML = articlesHTML;
        });
      }
    });
  }

  fetchWithToken(base_url + "/competitions/" + idParam + "/scorers")
    .then(function(data) {
      // Objek JavaScript dari response.json() masuk lewat variabel data.
      // Menyusun komponen card artikel secara dinamis
      let scorerHTML = "";
          data.scorers.forEach(scorers => {
            scorerHTML += `
            <tr>
              <td>${scorers.player.name}</td>
              <td>${scorers.team.name}</td>
              <td>${scorers.player.position}</td>
              <td>${scorers.numberOfGoals}</td>
            </tr>
            `;
          })

          const closedTagTable = `</table></br>`;
          const openTagTable = `<table>`;
          const headStandingTable = `
          <table>
          <tr>
              <th>Name</th>
              <th>Team</th>
              <th>Position</th>
              <th>Goals</th>
          </tr>`;

          const articlesHTML = openTagTable + headStandingTable + scorerHTML + closedTagTable; 

          
          document.getElementById("test-swipe-2").innerHTML = articlesHTML;
    })
    .catch(error);
}

function getUpcoming() {
  // Ambil nilai query parameter (?id=)
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  document.getElementById("test-swipe-4").innerHTML = loader;

  if ('caches' in window) {
    caches.match(base_url + "/competitions/" + idParam +  "/matches?status=SCHEDULED").then(response => {
      if (response) {
        response.json().then(data => {
          const groupDataAll = [];

          for (let i = 0; i < data.matches.length; i++) {
            groupDataAll.push(data.matches[i].utcDate);
          }

          const dateMatches = groupDataAll.filter((value, index, self) => self.indexOf(value) === index);
          const scheduleMatches = [];

          for (let i = 0; i < dateMatches.length; i++) {
            scheduleMatches[i] = "";
          }
          const nameTable = [];

          for (let i=0; i<dateMatches.length; i++) {
              for (let j=0; j<data.matches.length; j++) {
                if (dateMatches[i] === data.matches[j].utcDate) {
                  const dateName = new Date (dateMatches[i]);

                  nameTable[i] = `<h6><b>${dateName.format("dddd, mmmm dS yyyy, h:MM:ss TT")}</b></h6><table>`;

                  scheduleMatches[i] += `
                  <tr>
                    <td>${data.matches[j].homeTeam.name}</td>
                    <td>${data.matches[j].awayTeam.name}</td>
                    <td>${data.matches[j].group}</td>
                    <td><button onclick = "setData(${data.matches[j].id}, '${data.matches[j].homeTeam.name}', '${data.matches[j].awayTeam.name}', '${data.competition.name}', '${dateName.format("dddd, mmmm dS yyyy, h:MM:ss TT")}');M.toast({html: msg, displayLength: 1500})"><i class="fa fa-heart" aria-hidden="true"></i></button></td>
                    <td><button onclick = "delData(${data.matches[j].id});M.toast({html: del, displayLength: 1500})"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
                  </tr>
                  `;
                }
              }
          }

          const closedTagTable = `</table></br></br>`;
          const headStandingTable = `
          <tr>
              <th>Home Team</th>
              <th>Away Team</th>
              <th>Group</th>
              <th></th>
          </tr>`;
          
          for (let i=0; i<scheduleMatches.length && i<nameTable.length; i++) {
            scheduleMatches[i] = nameTable[i] + headStandingTable + scheduleMatches[i] + closedTagTable;
          }

          let articlesHTML = "";
          if (data.matches !== []) {
            for (let i=0; i<dateMatches.length; i++) {
              articlesHTML += scheduleMatches[i];
            }
          } else {
            articlesHTML = `<h5>There are no upcoming match.</h5></br></br>`
          }

          document.getElementById("test-swipe-4").innerHTML = articlesHTML;
        });
      }
    });
  }

  fetchWithToken(base_url + "/competitions/" + idParam +  "/matches?status=SCHEDULED")
    .then(data => {
      // Menyusun komponen card artikel secara dinamis
      const groupDataAll = [];

          for (let i = 0; i < data.matches.length; i++) {
            groupDataAll.push(data.matches[i].utcDate);
          }

          const dateMatches = groupDataAll.filter((value, index, self) => self.indexOf(value) === index);
          const scheduleMatches = [];

          for (let i = 0; i < dateMatches.length; i++) {
            scheduleMatches[i] = "";
          }
          const nameTable = [];

          for (let i=0; i<dateMatches.length; i++) {
              for (let j=0; j<data.matches.length; j++) {
                if (dateMatches[i] === data.matches[j].utcDate) {
                  const dateName = new Date (dateMatches[i]);

                  nameTable[i] = `<h6><b>${dateName.format("dddd, mmmm dS yyyy, h:MM:ss TT")}</b></h6><table>`;

                  scheduleMatches[i] += `
                  <tr>
                    <td>${data.matches[j].homeTeam.name}</td>
                    <td>${data.matches[j].awayTeam.name}</td>
                    <td>${data.matches[j].group}</td>
                    <td><button onclick = "setData(${data.matches[j].id}, '${data.matches[j].homeTeam.name}', '${data.matches[j].awayTeam.name}', '${data.competition.name}', '${dateName.format("dddd, mmmm dS yyyy, h:MM:ss TT")}');M.toast({html: msg, displayLength: 1500})"><i class="fa fa-heart" aria-hidden="true"></i></button></td>
                    <td><button onclick = "delData(${data.matches[j].id});M.toast({html: del, displayLength: 1500})"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
                  </tr>
                  `;
                }
              }
          }

          const closedTagTable = `</table></br></br>`;
          const headStandingTable = `
          <tr>
              <th>Home Team</th>
              <th>Away Team</th>
              <th>Group</th>
              <th></th>
          </tr>`;
          
          for (let i=0; i<scheduleMatches.length && i<nameTable.length; i++) {
            scheduleMatches[i] = nameTable[i] + headStandingTable + scheduleMatches[i] + closedTagTable;
          }

          let articlesHTML = "";
          if (data.matches.length !== 0) {
            for (let i=0; i<dateMatches.length; i++) {
              articlesHTML += scheduleMatches[i];
            }
          } else {
            articlesHTML = `<h5>There are no upcoming match.</h5></br></br>`;
          }

          document.getElementById("test-swipe-4").innerHTML = articlesHTML;
    })
    .catch(error);
}

function getTodayMatches() {
  // Ambil nilai query parameter (?id=)
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  document.getElementById("test-swipe-3").innerHTML = loader;

  if ('caches' in window) {
    caches.match(base_url + "/competitions/" + idParam +  "/matches").then(function(response) {
      if (response) {
        response.json().then(function (data) {
          let articlesHTML = "";
          const now = new Date();
          const today = now.format("dddd, mmmm dS yyyy");      
          
          data.matches.forEach( data => {
            const dateMatches = new Date(data.utcDate);
            if (dateMatches.format("dddd, mmmm dS yyyy") === today) {
              articlesHTML += `
              <tr>
                <td>${data.homeTeam.name}</td>
                <td>${data.awayTeam.name}</td>
                <td>${dateMatches.format("h:MM:ss TT Z")}</td>
              `;
              if (data.status === "FINISHED") {
                const winner ="";
                if (data.score.winner === "HOME_TEAM") {
                  winner = data.homeTeam.name;
                } else {
                  winner = data.awayTeam.name;
                }
                articlesHTML += `
                <td>${data.score.fullTime.homeTeam} - ${data.score.fullTime.awayTeam}</td>
                <td>${winner}</td>
                </tr>
                `;
              } else {
                articlesHTML += `
                <td>- - -</td>
                <td>-</td>
                </tr>
                `;
              }
            }
          })
          const closedTagTable = `</table></br></br>`;
          const openTagTable = `<table>`;
          const headStandingTable = `
            <table>
              <tr>
                  <th>Home Team</th>
                  <th>Away Team</th>
                  <th>Held at</th>
                  <th>Score</th>
                  <th>Winner</th>
              </tr>`;
          const upcomingButton = `
            <h6>See the schedule of <a href="./upcoming.html?id=${data.competition.id}">Upcoming Matches</a></h6>      
          `;
    
          if (articlesHTML !== "") {
            articlesHTML = openTagTable + headStandingTable + articlesHTML + closedTagTable
          } else {
            articlesHTML = `<h5>There are no matches today.</h5></br></br>`
          }
          document.getElementById("test-swipe-3").innerHTML = articlesHTML;
        });
      }
    });
  }

  fetchWithToken(base_url + "/competitions/" + idParam +  "/matches")
    .then(function(data) {

      if (data.matches.status !== "FINISHED") {
      // Menyusun komponen card artikel secara dinamis
        let articlesHTML = "";
        const now = new Date();
        const today = now.format("dddd, mmmm dS yyyy");      
      
      data.matches.forEach( data => {
        const dateMatches = new Date(data.utcDate);
        if (dateMatches.format("dddd, mmmm dS yyyy") === today) {
          articlesHTML += `
          <tr>
            <td>${data.homeTeam.name}</td>
            <td>${data.awayTeam.name}</td>
            <td>${dateMatches.format("h:MM:ss TT Z")}</td>
          `;
          if (data.status === "FINISHED") {
            const winner ="";
            if (data.score.winner === "HOME_TEAM") {
              winner = data.homeTeam.name;
            } else {
              winner = data.awayTeam.name;
            }
            articlesHTML += `
            <td>${data.score.fullTime.homeTeam} - ${data.score.fullTime.awayTeam}</td>
            <td>${winner}</td>
            </tr>
            `;
          } else {
            articlesHTML += `
            <td>- - -</td>
            <td>-</td>
            </tr>
            `;
          }
        }
      })
      const closedTagTable = `</table></br></br>`;
      const openTagTable = `<table>`;
      const headStandingTable = `
        <table>
          <tr>
              <th>Home Team</th>
              <th>Away Team</th>
              <th>Held at</th>
              <th>Score</th>
              <th>Winner</th>
          </tr>`;

      if (articlesHTML !== "") {
        articlesHTML = openTagTable + headStandingTable + articlesHTML + closedTagTable
      } else {
        articlesHTML = `<h5>There are no matches today.</h5></br></br>`
      }

      document.getElementById("test-swipe-3").innerHTML = articlesHTML;
    }
    })
    .catch(error);
}

function getTeams() {
  // Ambil nilai query parameter (?id=)
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  document.getElementById("test-swipe-5").innerHTML = loader;

  if ('caches' in window) {
    caches.match(base_url + "/competitions/" + idParam +  "/teams").then(function(response) {
      if (response) {
        response.json().then(function (data) {
          let articlesHTML = "";     
      
          data.teams.forEach( teams => {
            articlesHTML += `
            <div class="col s6 m4 l3">
              <a onclick="getTeamsModal(${teams.id})" class="modal-trigger" href="#modal1">
              <div class="card-panel grey lighten-3 center-align hoverable">
                  <b class="grey-text text-darken-3">${teams.shortName.toUpperCase()}</b>
              </div>
              </a>
            </div>
            `;
          })
          const openTag = `</br><div class="row">`;
          const closeTag= `</div></br></br>`;

          document.getElementById("test-swipe-5").innerHTML = openTag + articlesHTML + closeTag;
        });
      }
    });
  }

  fetchWithToken(base_url + "/competitions/" + idParam +  "/teams")
    .then(function(data) {

      let articlesHTML = "";     
      
      data.teams.forEach( teams => {
          articlesHTML += `
            <div class="col s6 m4 l3">
              <a onclick="getTeamsModal(${teams.id})" class="modal-trigger" href="#modal1">
              <div class="card-panel grey lighten-3 center-align hoverable">
                  <b class="grey-text text-darken-3">${teams.shortName.toUpperCase()}</b>
              </div>
              </a>
            </div>
          `;
      })
      const openTag = `</br><div class="row">`;
      const closeTag= `</div></br></br>`;

      document.getElementById("test-swipe-5").innerHTML = openTag + articlesHTML + closeTag;
    })
    .catch(error);
}

function getTeamsModal(idTeam) {
  // Ambil nilai query parameter (?id=)
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");

  if ('caches' in window) {
    caches.match(base_url + "/competitions/" + idParam +  "/teams").then(function(response) {
      if (response) {
        response.json().then(function (data) {
          let articlesHTML = "";     
      
          data.teams.forEach( teams => {
            if (idTeam === teams.id) {
              articlesHTML += `
              <h5 class="center-align">${teams.name}</h5>
              <h6 class="center-align">${teams.clubColors}</h6>
              <p>Address: ${teams.address} </br>
              Venue: ${teams.venue} </br>
              Email: ${teams.email} </br>
              Phone: ${teams.phone} </br>
              Website: ${teams.website}
              </p>
              `;
              return;
            }
          })

          document.getElementById("content-modal").innerHTML = articlesHTML;
        });
      }
    });
  }

  fetchWithToken(base_url + "/competitions/" + idParam +  "/teams")
    .then(function(data) {
      // Objek JavaScript dari response.json() masuk lewat variabel data.

      let articlesHTML = "";     
      
      data.teams.forEach( teams => {
        if (idTeam === teams.id) {
          articlesHTML += `
          <h5 class="center-align">${teams.name}</h5>
          <h6 class="center-align">${teams.clubColors}</h6>
          <p>Address: ${teams.address} </br>
          Venue: ${teams.venue} </br>
          Email: ${teams.email} </br>
          Phone: ${teams.phone} </br>
          Website: ${teams.website}
          </p>
          `;
          return;
        }
      })
      
      document.getElementById("content-modal").innerHTML = articlesHTML;
    })
    .catch(error);
}

function getTodayAllMatches() {
  
  if ('caches' in window) {
    caches.match(base_url + "/matches/").then(function(response) {
      if (response) {
        response.json().then(function (data) {
          document.getElementById("articles").innerHTML = loader;
          const competitionNames = [];
          for (let i = 0; i < data.matches.length; i++) {
            competitionNames[i] = data.matches[i].competition.name;
          }
    
          const competitionName = competitionNames.filter((value, index, self) => self.indexOf(value) === index);
          
          const listTeams = [];
          for (let i = 0; i < competitionName.length; i++) {
            listTeams[i] = "";
          }
    
          const listDTM = [];
          for (let i = 0; i < competitionName.length; i++) {
            listDTM[i] = "";
          }
    
          let articlesHTML = "";
          let dawnToMorning = "";
          const now = new Date();
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const today = now.format("dddd, mmmm dS yyyy");
    
          const tomorrowMatches ="";
    
          data.matches.forEach( data => {
              const dateMatches = new Date(data.utcDate);
    
              if (dateMatches.format("dddd, mmmm dS yyyy") === today) {
    
                for (let i = 0; i < competitionName.length; i++) {
                  if (data.competition.name === competitionName[i]) {
                    
                    listTeams[i] += `
                    <tr>
                      <td>${data.homeTeam.name}</td>
                      <td>${data.awayTeam.name}</td>
                      <td>${dateMatches.format("h:MM:ss TT")}</td>
                    `;
                    if (data.status === "FINISHED") {
                      const winner ="";
                      if (data.score.winner === "HOME_TEAM") {
                        winner = data.homeTeam.name;
                      } else {
                        winner = data.awayTeam.name;
                      }
                      listTeams[i] += `
                      <td>${data.score.fullTime.homeTeam} - ${data.score.fullTime.awayTeam}</td>
                      <td>${winner}</td>
                      </tr>
                      `;
                    } else {
                      listTeams[i] += `
                      <td>- - -</td>
                      <td>-</td>
                      </tr>
                      `;
                    }
                  }
                }
                
              }
              else if (dateMatches.format("dddd, mmmm dS yyyy") === tomorrow.format("dddd, mmmm dS yyyy")){
                tomorrowMatches = dateMatches.format("dddd, mmmm dS yyyy");
                for (let i = 0; i < competitionName.length; i++) {
                  if (data.competition.name === competitionName[i]) {
                    
                    listDTM[i] += `
                    <tr>
                      <td>${data.homeTeam.name}</td>
                      <td>${data.awayTeam.name}</td>
                      <td>${dateMatches.format("h:MM:ss TT")}</td>
                    `;
                    if (data.status === "FINISHED") {
                      const winner ="";
                      if (data.score.winner === "HOME_TEAM") {
                        winner = data.homeTeam.name;
                      } else {
                        winner = data.awayTeam.name;
                      }
                      listDTM[i] += `
                      <td>${data.score.fullTime.homeTeam} - ${data.score.fullTime.awayTeam}</td>
                      <td>${winner}</td>
                      </tr>
                      `;
                    } else {
                      listDTM[i] += `
                      <td>- - -</td>
                      <td>-</td>
                      </tr>
                      `;
                    }
                  }
                }
              }
          })
    
          const closedTagTable = `</table></br></br>`;
          const openTagTable = `<table>`;
          const headStandingTable = `
              <table>
                <tr>
                <th>Home Team</th>
                <th>Away Team</th>
                <th>Held at</th>
                <th>Score</th>
                <th>Winner</th>
              </tr>
          `;
    
    
          for (let i = 0; i < competitionName.length; i++) {
            if (listTeams[i] !== "") {
              articlesHTML += openTagTable + `<center><h6><b><i>` + competitionName[i] + `</i></b></h6></center>` + headStandingTable + listTeams[i] + closedTagTable;
            }
          }
          for (let i = 0; i < competitionName.length; i++) {
            if (listDTM[i] !== "") {
              dawnToMorning += openTagTable + `<center><h6><b><i>` + competitionName[i] + `</i></b></h6></center>` + headStandingTable + listDTM[i] + closedTagTable;
            }
          }
    
          
          dawnToMorning = `</br><center><h6><b>Tomorrow Dawn to Morning</br>${tomorrowMatches}</b></h6></center></br></br>` + dawnToMorning;
          
          
          if (articlesHTML === "") {
            articlesHTML = `<h5>There are no matches today.</h5></br></br>`;
          }
          
            // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("articles").innerHTML = articlesHTML + dawnToMorning;
        });
      }
    });
  }

  fetchWithToken(base_url + "/matches/")
    .then(function(data) {
      // Objek JavaScript dari response.json() masuk lewat variabel data.
      console.log(data);
      document.getElementById("articles").innerHTML = loader;
      const competitionNames = [];
      for (let i = 0; i < data.matches.length; i++) {
        competitionNames[i] = data.matches[i].competition.name;
      }

      const competitionName = competitionNames.filter((value, index, self) => self.indexOf(value) === index);
      
      const listTeams = [];
      for (let i = 0; i < competitionName.length; i++) {
        listTeams[i] = "";
      }

      const listDTM = [];
      for (let i = 0; i < competitionName.length; i++) {
        listDTM[i] = "";
      }

      let articlesHTML = "";
      let dawnToMorning = "";
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const today = now.format("dddd, mmmm dS yyyy");

      const tomorrowMatches ="";

      data.matches.forEach( data => {
          const dateMatches = new Date(data.utcDate);

          if (dateMatches.format("dddd, mmmm dS yyyy") === today) {

            for (let i = 0; i < competitionName.length; i++) {
              if (data.competition.name === competitionName[i]) {
                
                listTeams[i] += `
                <tr>
                  <td>${data.homeTeam.name}</td>
                  <td>${data.awayTeam.name}</td>
                  <td>${dateMatches.format("h:MM:ss TT")}</td>
                `;
                if (data.status === "FINISHED") {
                  const winner ="";
                  if (data.score.winner === "HOME_TEAM") {
                    winner = data.homeTeam.name;
                  } else {
                    winner = data.awayTeam.name;
                  }
                  listTeams[i] += `
                  <td>${data.score.fullTime.homeTeam} - ${data.score.fullTime.awayTeam}</td>
                  <td>${winner}</td>
                  </tr>
                  `;
                } else {
                  listTeams[i] += `
                  <td>- - -</td>
                  <td>-</td>
                  </tr>
                  `;
                }
              }
            }
            
          }
          else if (dateMatches.format("dddd, mmmm dS yyyy") === tomorrow.format("dddd, mmmm dS yyyy")){
            tomorrowMatches = dateMatches.format("dddd, mmmm dS yyyy");
            for (let i = 0; i < competitionName.length; i++) {
              if (data.competition.name === competitionName[i]) {
                
                listDTM[i] += `
                <tr>
                  <td>${data.homeTeam.name}</td>
                  <td>${data.awayTeam.name}</td>
                  <td>${dateMatches.format("h:MM:ss TT")}</td>
                `;
                if (data.status === "FINISHED") {
                  const winner ="";
                  if (data.score.winner === "HOME_TEAM") {
                    winner = data.homeTeam.name;
                  } else {
                    winner = data.awayTeam.name;
                  }
                  listDTM[i] += `
                  <td>${data.score.fullTime.homeTeam} - ${data.score.fullTime.awayTeam}</td>
                  <td>${winner}</td>
                  </tr>
                  `;
                } else {
                  listDTM[i] += `
                  <td>- - -</td>
                  <td>-</td>
                  </tr>
                  `;
                }
              }
            }
          }
      })

      const closedTagTable = `</table></br></br>`;
      const openTagTable = `<table>`;
      const headStandingTable = `
        <table>
          <tr>
          <th>Home Team</th>
          <th>Away Team</th>
          <th>Held at</th>
          <th>Score</th>
          <th>Winner</th>
        </tr>
      `;


      for (let i = 0; i < competitionName.length; i++) {
        if (listTeams[i] !== "") {
          articlesHTML += openTagTable + `<center><h6><b><i>` + competitionName[i] + `</i></b></h6></center>` + headStandingTable + listTeams[i] + closedTagTable;
        }
      }
      for (let i = 0; i < competitionName.length; i++) {
        if (listDTM[i] !== "") {
          dawnToMorning += openTagTable + `<center><h6><b><i>` + competitionName[i] + `</i></b></h6></center>` + headStandingTable + listDTM[i] + closedTagTable;
        }
      }

      
      dawnToMorning = `</br><center><h6><b>Tomorrow Dawn to Morning</br>${tomorrowMatches}</b></h6></center></br></br>` + dawnToMorning;
      
      
      if (articlesHTML === "") {
        articlesHTML = `<h5>There are no matches today.</h5></br></br>`;
      }
      
        // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("articles").innerHTML = articlesHTML + dawnToMorning;        
    })
    .catch(error);
    
}

function btnOnTop() {
  const btn = document.createElement("div");
  btn.className = "fixed-action-btn";
  const funBtn = `
  <a class="btn-floating btn-large blue" href="#">
  <i class="fa fa-arrow-up" aria-hidden="true"></i>
  </a>
  `;
  btn.innerHTML = funBtn;
  document.body.appendChild(btn);
}

function getOnTop() {
  const elems = document.querySelectorAll('.fixed-action-btn');
  M.FloatingActionButton.init(elems, {hover: false});
}

