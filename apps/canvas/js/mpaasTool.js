var loginConstants = mpaasConstants.loginType;
var loginState = mpaasConstants.loginState;
function init() {
  if (
    $(".tool_content_wrapper")
      .find("#tool_form")
      .attr("action")
      .includes("moodleverify.obj")
  ) {
    $("#content").prepend(sharedTemplate.loaderPopup());
    $("#loaderPopup").show();
    $("#tool_content").hide();
    chrome.storage.local.set({
      loginType: loginConstants.CANVAS_PROFESSOR_VIEW,
    });
    loginService.login().then(
      function (a) {
        handleLoginSuccess(a);
      },
      function (a) {
        $("#loaderPopup").hide();
        toast.error(a);
        $("#content").prepend(sharedTemplate.errorPage(a));
      }
    );
  } else {
    $("#tool_content").show();
  }
}
function handleLoginSuccess(a) {
  $("#loaderPopup").hide();
  if (!a) {
    console.log("login Failed...");
    return;
  }
  if ($(a).find("#userInfo").length === 1) {
    let user = JSON.parse($(a).find("#userInfo").html());
    if (user.userType === "admin") {
      chrome.storage.local.set({ state: loginState.PROFESSOR_LOGIN_SUCCESS });
      dataStorageService.storeLoginData(a);
      goToReportsView();
    } else {
      chrome.storage.local.set({ state: loginState.STUDENT_LOGIN_SUCCESS });
      $("#content").prepend(sharedTemplate.student());
    }
  } else {
    chrome.storage.local.set({ state: loginState.LTI_CHECK_FAILED });
    toast.error("Error in lti keys verification. Please contact Admin");
    $("#content").prepend(
      sharedTemplate.errorPage(
        "Error in lti keys verification. Please contact Admin"
      )
    );
  }
}
function goToReportsView() {
  $("#content").prepend(sharedTemplate.reportView());
  let courseName = encodeURIComponent(localStorage.getItem("courseName"));
  dataStorageService.setCourseName(courseName);
  teacherViewService.getQuizzes();
  teacherViewService.getQuizIndex(0, 100, 10, "NEXT");
}
$(document).ready(function () {
  init();
});
