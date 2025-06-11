var loginConstants = mpaasConstants.loginType;
var loginState = mpaasConstants.loginState;
function init() {
  window.addEventListener("message", a);
  function a(c) {
    if (c.data.ltiUrl) {
      $("#rpaasReports").remove();
      $("#rpaasInfo").remove();
      var b = c.data;
      console.log("Mesage b- ", b);
      localStorage.setItem("loginUser", b.userInfo);
      localStorage.setItem("loginToken", b.token);
      localStorage.setItem("loginmpassUrl", b.mpaasUrl);
      localStorage.setItem("loginltiUrl", b.ltiUrl);
      localStorage.setItem("diagCheckUrl", b.diagCheckUrl);
      localStorage.setItem("i18Texts", b.i18Texts);
      localStorage.setItem("isCiOn", b.ci);
      localStorage.setItem("courseName", b.courseName);
      getUserInfo();
    }
  }
}
function getUserInfo() {
  let user = JSON.parse(localStorage.getItem("loginUser"));
  if (!user) {
    alert("Something went wrong please click on rpaas tool and try again");
    return;
  }
  console.log("user- ", user);
  console.log("loginState- ", loginState);
  $(".topic-display").hide();
  console.log("topic-display", $(".topic-display"));
  var appBanners = document.getElementsByClassName("topic-display");
  console.log("appBanners- ", appBanners);
  for (var i = 0; i < appBanners.length; i++) {
    appBanners[i].style.display = "none";
  }
  setTimeout(() => {
    $(".topic-display").hide();
    console.log("topic-display", $(".topic-display"));
    var appBanners = document.getElementsByClassName("topic-display");
    console.log("appBanners- ", appBanners);
    for (var i = 0; i < appBanners.length; i++) {
      appBanners[i].style.display = "none";
    }
  }, 1000);
  if (user.userType === "admin") {
    var a =
      "<div class='c-pointer text-center' id='rpaasReports'>RPaaS Reports</div>";
    $("#content-block").append(a);
    goToReportsView();
    chrome.storage.local.set({ state: loginState.PROFESSOR_LOGIN_SUCCESS });
    // $(".d2l-iframe").hide();
  } else {
    var a =
      "<div class='c-pointer text-center' id='rpaasInfo'>RPaaS Instructions</div>";
    $("#content-block").append(a);
    goToInstructions();
    // $(".d2l-iframe").hide();
    chrome.storage.local.set({ state: loginState.STUDENT_LOGIN_SUCCESS });
  }
}
function goToReportsView() {
  $("#rpaasReports").on("click", function () {
    if (navigator.onLine) {
      $("body").css("overflow", "auto");
      $(".d2l-iframe").hide();
      $(".d2l-fra-iframe").hide();
      $(".d2l-page-main-padding").hide();
      $(".closeBtn").remove();
      $(".teacher-section").remove();
      let closeBtn =
        "<div class='closeBtn text-center c-pointer'><span class='d2lbtn'>Close</span></div>";
      $(".d2l-page-main").append(closeBtn);
      $(".d2l-page-main").append(sharedTemplate.reportView());
      let courseName = encodeURIComponent(localStorage.getItem("courseName"));
      dataStorageService.setCourseName(courseName);
      teacherViewService.getQuizzes();
      teacherViewService.getQuizIndex(0, 100, 10, "NEXT");
      $(".closeBtn").on("click", function () {
        $(".d2l-fra-iframe").show();
        $(".d2l-page-main-padding").show();
        $(".closeBtn").remove();
        $(".teacher-section").remove();
      });
    } else {
      alert(
        "Internet connection lost or Timeout. Please reconnect and refresh the browser."
      );
    }
  });
}
function goToInstructions() {
  $("#rpaasInfo").on("click", function () {
    if (navigator.onLine) {
      $(".d2l-fra-iframe").hide();
      $(".d2l-page-main-padding").hide();
      $(".closeInfoBtn").remove();
      $(".student-section").remove();
      let closeBtn =
        "<div class='closeInfoBtn text-center c-pointer'><span class='d2lbtn'>Close</span></div>";
      $(".d2l-page-main").append(closeBtn);
      $(".d2l-page-main").append(sharedTemplate.student());
      $(".closeInfoBtn").on("click", function () {
        $(".d2l-fra-iframe").show();
        $(".d2l-page-main-padding").show();
        $(".closeInfoBtn").remove();
        $(".student-section").remove();
      });
    } else {
      alert(
        "Internet connection lost or Timeout. Please reconnect and refresh the browser."
      );
    }
  });
}
$(document).ready(function () {
  init();
});
