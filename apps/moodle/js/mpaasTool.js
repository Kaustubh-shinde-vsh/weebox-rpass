console.log("moodle/mpassTool");
var loginConstants = mpaasConstants.loginType;
var loginState = mpaasConstants.loginState;
function init() {
  $("#contentframe").hide();
  $("#page-content").append(sharedTemplate.loaderPopup());
  $("#loaderPopup").show();
  chrome.storage.local.set({ loginType: loginConstants.MOODLE_PROFESSOR_VIEW });
  loginService.login().then(
    function (a) {
      handleLoginSuccess(a);
    },
    function (a) {
      toast.error(a);
      $("#loaderPopup").hide();
      $("#region-main").append(sharedTemplate.errorPage(a));
    }
  );
}
function handleLoginSuccess(a) {
  $("#loaderPopup").hide();
  if (!a) {
    console.log("login Failed...");
    return;
  }
  console.log("#userinfo-------------", $(a).find("#userInfo").html());
  if ($(a).find("#userInfo").length === 1) {
    let user = JSON.parse($(a).find("#userInfo").html());
    if (user.name) {
      chrome.storage.local.set({
        userfullname: user.name,
      });
    }
    dataStorageService.storeLoginData(a);
    if (user.userType === "admin") {
      chrome.storage.local.set({ state: loginState.PROFESSOR_LOGIN_SUCCESS });
      goToReportsView();
    } else {
      chrome.storage.local.set({ state: loginState.STUDENT_LOGIN_SUCCESS });
      $("#region-main").append(sharedTemplate.student());
    }
  } else {
    chrome.storage.local.set({ state: loginState.LTI_CHECK_FAILED });
    toast.error("Error in lti keys verification. Please contact Admin");
    $("#region-main").append(
      sharedTemplate.errorPage(
        "Error in lti keys verification. Please contact Admin"
      )
    );
  }
}
function goToReportsView() {
  $("#region-main").append(sharedTemplate.reportView());
  let courseName = encodeURIComponent(localStorage.getItem("courseName"));
  dataStorageService.setCourseName(courseName);
  teacherViewService.getQuizzes();
  teacherViewService.getQuizIndex(0, 100, 10, "NEXT");
}
$(document).ready(function () {
  init();
});
