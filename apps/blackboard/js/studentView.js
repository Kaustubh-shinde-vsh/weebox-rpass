var access;
var loginConstants = mpaasConstants.loginType;
var lmsTypeContants = mpaasConstants.lmsType;
var loginState = mpaasConstants.loginState;
var chromeMessage = mpaasConstants.chromeSendMessage;
var statusCode = mpaasConstants.checkStatus;
function init() {
  let parentElement = $(".locationPane");
  if (
    $(".placeholder")
      .find("span")
      .text()
      .trim("")
      .includes("Test previously taken")
  ) {
    return;
  }
  chrome.storage.local.set({ lmsApp: lmsTypeContants.BLACKBOARD });
  chrome.storage.local.set({
    loginType: loginConstants.BLACKBOARD_STUDENT_VIEW,
  });
  chrome.runtime.sendMessage({
    type: "action",
    action: chromeMessage.STOP_PROCTORING,
  });
  $("#stepcontent1").hide();
  $("#taskbuttondiv_wrapper").hide();
  $(".submitStepBottom").hide();
  parentElement.prepend(bbTemplate.bbCheckSystem());
  parentElement.prepend(bbTemplate.bbStartProctor());
  parentElement.prepend(sharedTemplate.loaderPopup());
  parentElement.prepend(sharedTemplate.pluginloader());
  parentElement.prepend(sharedTemplate.otherPluginsPopup());
  studentLogin();
  clickEvents();
}
function clickEvents() {
  $("#closeModal")
    .add("#close")
    .on("click", function () {
      $("#myModal").hide();
    });
  $("#retryDisablePlugin").on("click", studentViewService.retrying);
  $("#begin").on("click", function () {
    if (navigator.onLine) {
      studentViewService.checkPluginsOn();
    } else {
      $("#loaderPopup").hide();
      toast.error(
        "Internet Connection not available. Please reconnect the internet and relaunch your browser and resume the test."
      );
    }
  });
}
function studentLogin() {
  $("#loaderPopup").show();
  if (navigator.onLine) {
    loginServiceStart();
  } else {
    $("#loaderPopup").hide();
    toast.error(
      "Internet Connection not available. Please reconnect the internet and relaunch your browser and resume the test."
    );
  }
}
function loginServiceStart() {
  loginService.login().then(
    function (a) {
      $("#loaderPopup").hide();
      handleLoginSuccess(a);
    },
    function (a) {
      $("#loaderPopup").hide();
      if (a.statusText === statusCode.ERROR) {
        toast.error(
          "Internet Connection not available. Please reconnect the internet and relaunch your browser and resume the test."
        );
      } else {
        toast.error(a);
      }
    }
  );
}
function handleLoginSuccess(a) {
  if (!a) {
    console.log("Invalid Response failed to login");
    return;
  }
  var b = JSON.parse($(a).find("#i18TextsValues").html());
  if ($(a).find("#userInfo").length === 1) {
    let user = JSON.parse($(a).find("#userInfo").html());
    console.log("user- ", user);
    let finalPayload = {
      token: $(a).find("#token").html(),
      ltiurl: $(a).find("#ltiUrl").html(),
      startQuizPayload: {
        course: encodeURIComponent($(a).find("#courseName").text()),
        quiz: encodeURIComponent(
          $(".placeholder")
            .find("span")
            .html()
            .trim("")
            .replace("Enter Password: ", "")
        ),
        userId: user.userid,
        emailID: user.userid,
      },
    };
    chrome.storage.local.set({ state: loginState.STUDENT_LOGIN_SUCCESS });
    apiService.openDiagonostic(finalPayload).then(
      function (c) {
        onDiagonosticSuccess(c);
        window.LanguageMap = b;
        localStorage.setItem("i18Texts", JSON.stringify(b));
        var d = $("body").find("._i18");
        d.each(function () {
          var f = $(this);
          var e = f.attr("data-i18");
          f.html(window.LanguageMap[e]);
        });
      },
      function (c) {
        $("#loaderPopup").hide();
        toast.error(c);
      }
    );
  } else {
    $("#loaderPopup").hide();
    chrome.storage.local.set({ state: loginState.LTI_CHECK_FAILED });
    toast.error("Error in lti keys verification. Please contact Admin");
  }
}
function onDiagonosticSuccess(a) {
  if (!a) {
    console.log("Invalid Response");
    return;
  }
  if (a.proctoringEnabled) {
    $("#stepcontent1").hide();
    $("#taskbuttondiv_wrapper").hide();
    $(".submitStepBottom").hide();
    studentViewService.openProctoringWindow(a);
  } else {
    $("#stepcontent1").show();
    $(".submitStepBottom").show();
    $("#taskbuttondiv_wrapper").show();
  }
}
$(document).ready(function () {
  init();
});
