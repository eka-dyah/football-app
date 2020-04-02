document.addEventListener("DOMContentLoaded", function() {
    // Load page content
    let page = window.location.hash.substr(1);
    if (page == "") page = "home";
    loadPage(page);
   
    function loadPage(page) {
      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", "pages/" + page + ".html", true);
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
    xhttp.send();
  }
  
});
  