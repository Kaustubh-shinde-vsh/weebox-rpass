console.log("dWindowCheck");
$(document).ready(function () {
  var a = mpaasConstants.loginState;
  setInterval(function () {
    DiagonosticSubmit();
    checkError();
  }, 100);
  chrome.storage.local.get(function (b) {
    if (!b.navigationControl && b.state === a.STUDENT_LOGIN_SUCCESS) {
      if (sessionStorage.getItem("DStatus") === "Complete") {
        window.close();
      }
    }
  });
  chrome.storage.local.get(function (b) {
    if (b.navigationControl && b.state === a.STUDENT_LOGIN_SUCCESS) {
      setTimeout(function () {
        if (sessionStorage.getItem("DStatus") === "Complete") {
          window.close();
        }
      }, 3500);
    }
  });
});
function checkError() {
  if ($("button").attr("data-name") === "CLOSE") {
    window.close();
    console.log("error occured");
  }
}
function DiagonosticSubmit() {
  $("button").on("click", function () {
    if ($("#next").text().search("Start Test") === 0) {
      sessionStorage.setItem("DStatus", "Complete");
    }
  });
}
