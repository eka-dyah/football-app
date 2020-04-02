document.addEventListener("DOMContentLoaded", function() {
  // Activate sidebar nav
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  loadNav();
  // Load page content
  var page = window.location.hash.substr(1);
  if (page == "") page = "home";
  loadPage(page);
 
  function loadPage(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        const content = document.querySelector("#body-content");
        if (page === "home") {
          getCompetition();
        } else if (page === "favorite") {
          showData();
        } else if (page === "today") {
          getTodayAllMatches();
        }
        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
        } else if (this.status == 404) {
          content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
        } else {
          content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
        }
      }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
  }

  function loadNav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status != 200) return;

          // Muat daftar tautan menu
          document.querySelectorAll(".topnav, .sidenav-list").forEach(function(elm) {
            elm.innerHTML = xhttp.responseText;
          });
          
          // Daftarkan event listener untuk setiap tautan menu
          document.querySelectorAll(".sidenav-list a, .topnav a").forEach(function(elm) {
            elm.addEventListener("click", function(event) {
              // Tutup sidenav
              var sidenav = document.querySelector(".sidenav");
              M.Sidenav.getInstance(sidenav).close();
              page = event.target.getAttribute("href").substr(1);
              loadPage(page); 
            });
          });
      };
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }
});
