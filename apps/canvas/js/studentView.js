var access;
var loginConstants = mpaasConstants.loginType;
var lmsTypeContants = mpaasConstants.lmsType;
var loginState = mpaasConstants.loginState;
var chromeMessage = mpaasConstants.chromeSendMessage;
var statusCode = mpaasConstants.checkStatus;
function init() {
  let parentElement = $("#content-wrapper");
  chrome.storage.local.set({ lmsApp: lmsTypeContants.CANVAS });
  chrome.storage.local.set({ loginType: loginConstants.CANVAS_STUDENT_VIEW });
  chrome.runtime.sendMessage({
    type: "action",
    action: chromeMessage.STOP_PROCTORING,
  });
  $(".access_code_form").hide();
  parentElement.prepend(canvasTemplate.checkSystem());
  parentElement.prepend(canvasTemplate.startProctor());
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
  $("#otherPluginsPopup").hide();
  $("#pluginLoader").hide();
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
    let diagCheckUrl = $(a).find("#diagCheckUrl").html();
    if (diagCheckUrl) {
      localStorage.setItem("diagCheckUrl", diagCheckUrl);
    }

    let token = $(a).find("#token").html();
    if (token) {
      localStorage.setItem("loginToken", token);
    }

    let user = JSON.parse($(a).find("#userInfo").html());
    let finalPayload = {
      token: $(a).find("#token").html(),
      ltiurl: $(a).find("#ltiUrl").html(),
      startQuizPayload: {
        course: encodeURIComponent($(a).find("#courseName").text()),
        quiz: encodeURIComponent(
          $("#breadcrumbs").find("ul li:nth-child(4) a span").text()
        ),
        userId: user.userId,
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
    $(".access_code_form").hide();
    studentViewService.openProctoringWindow(a);
  } else {
    $(".access_code_form").show();
  }
}
$(document).ready(function () {
  if ($("#left-side").find("a:contains('Rpaas')").attr("href")) {
    init();
  } else {
    console.log("RPaaS Tool not found for this course");
  }
});
