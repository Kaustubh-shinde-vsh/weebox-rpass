var loginConstants = mpaasConstants.loginType;
var loginState = mpaasConstants.loginState;
function init() {
  $("#globalNavPageContentArea").append(sharedTemplate.loaderPopup());
  $("#loaderPopup").show();
  $("#contentFrame").hide();
  $(window).resize(function () {
    $("#contentFrame").hide();
  });
  chrome.storage.local.set({
    loginType: loginConstants.BLACKBOARD_PROFESSOR_VIEW,
  });
  loginService.login().then(
    function (a) {
      handleLoginSuccess(a);
    },
    function (a) {
      $("#loaderPopup").hide();
      alert(a);
      $("#globalNavPageContentArea").append(sharedTemplate.errorPage(a));
    }
  );
}
function handleLoginSuccess(a) {
  $("#loaderPopup").hide();
  if (!a) {
    console.log("login Failed...");
    return;
  }
  if ($(a).find("#userInfo").length === 1) {
    let user = JSON.parse($(a).find("#userInfo").html());
    if (user.name) {
      chrome.storage.local.set({
        userfullname: user.name,
      });
    }
    dataStorageService.storeLoginData(a);
    if (user.userType === "admin") {
      chrome.storage.local.set({
        state: loginState.PROFESSOR_LOGIN_SUCCESS,
      });
      goToReportsView();
    } else {
      chrome.storage.local.set({
        state: loginState.STUDENT_LOGIN_SUCCESS,
      });
      $("#globalNavPageContentArea").append(sharedTemplate.student());
    }
  } else {
    chrome.storage.local.set({
      state: loginState.LTI_CHECK_FAILED,
    });
    alert("Error in lti keys verification. Please contact Admin");
    $("#globalNavPageContentArea").append(
      sharedTemplate.errorPage(
        "Error in lti keys verification. Please contact Admin"
      )
    );
  }
}
function goToReportsView() {
  $("#globalNavPageContentArea").append(sharedTemplate.reportView());
  let courseName = encodeURIComponent(localStorage.getItem("courseName"));
  dataStorageService.setCourseName(courseName);
  teacherViewService.getQuizzes();
  teacherViewService.getQuizIndex(0, 100, 10, "NEXT");
}
$(document).ready(function () {
  setTimeout(function () {
    init();
  }, 1500);
});
