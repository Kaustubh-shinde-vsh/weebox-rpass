console.log("moodle/studentView");
var access;
var loginConstants = mpaasConstants.loginType;
var lmsTypeContants = mpaasConstants.lmsType;
var loginState = mpaasConstants.loginState;
var chromeMessage = mpaasConstants.chromeSendMessage;
var statusCode = mpaasConstants.checkStatus;
function init() {
  let parentElement = $("#page-content");
  chrome.storage.local.set({ lmsApp: lmsTypeContants.MOODLE });
  chrome.storage.local.set({ loginType: loginConstants.MOODLE_STUDENT_VIEW });
  if (window.location.href.includes("view.php")) {
    chrome.runtime.sendMessage({
      type: "action",
      action: chromeMessage.STOP_PROCTORING,
    });
  }
  parentElement.prepend(moodleTemplate.moodleCheckSystem());
  parentElement.prepend(moodleTemplate.moodleStartProctor());
  parentElement.prepend(sharedTemplate.loaderPopup());
  parentElement.prepend(sharedTemplate.pluginloader());
  parentElement.prepend(sharedTemplate.otherPluginsPopup());
  initHandlers();
  $(document).keydown(function (a) {
    if (a.keyCode == 27) {
      return false;
    }
  });
}
function handleLoginSuccess(a) {
  console.log(
    "handleLoginSuccess-------------------------------------------------",
    a
  );
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

    // let mpaasUrl = $(a).find("#rpaasUrl").html();
    // if(mpaasUrl){ localStorage.setItem("loginmpassUrl", mpaasUrl); }

    // let ltiUrl = $(a).find("#ltiUrl").html();
    // if(ltiUrl){ localStorage.setItem("loginltiUrl", ltiUrl); }

    let user = JSON.parse($(a).find("#userInfo").html());
    // if(user){ localStorage.setItem("loginUser", user.userid); }

    // let isCiOn = $(a).find("#ci").html().trim();
    // if(isCiOn){ localStorage.setItem("isCiOn", isCiOn); }

    // let coursenameValue = $(a).find("#courseName").text();
    // if(coursenameValue){ localStorage.setItem("courseName", coursenameValue); }
    var quizname = encodeURIComponent(
      $("#region-main").find(".activity-information").data("activityname")
    );
    if (quizname == "undefined") {
      quizname = $('[title="Quiz"]').html();
    }
    let finalPayload = {
      token: $(a).find("#token").html(),
      ltiurl: $(a).find("#ltiUrl").html(),
      startQuizPayload: {
        course: encodeURIComponent($(a).find("#courseName").text()),
        quiz: quizname,
        emailID: user.userid,
      },
    };
    console.log("finalPayload- ", finalPayload);
    chrome.storage.local.set({ state: loginState.STUDENT_LOGIN_SUCCESS });
    console.log("calling apiService.openDiagonostic with - ", finalPayload);
    apiService.openDiagonostic(finalPayload).then(
      function (c) {
        console.log("openDiagonostic success");
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
        console.log("openDiagonostic failed");
        $("#loaderPopup").hide();
        toast.error(c);
      }
    );
  } else {
    console.log(
      "handleLoginSuccess loginState.LTI_CHECK_FAILED- ",
      loginState.LTI_CHECK_FAILED
    );
    $("#loaderPopup").hide();
    chrome.storage.local.set({ state: loginState.LTI_CHECK_FAILED });
    toast.error("Error in lti keys verification. Please contact Admin");
  }
}
function startQuiz() {
  $("#loaderPopup").show();
  setTimeout(function () {
    $("#closebutton").click();
    $("#id_cancel").click();
  }, 10);
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
  console.log("loginServiceStart");
  loginService.login().then(
    function (a) {
      console.log("loginServiceStart success- handleLoginSuccess");
      handleLoginSuccess(a);
    },
    function (a) {
      console.log("loginServiceStart failed- ", a);
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
function beginQuiz() {
  if (navigator.onLine) {
    studentViewService.checkPluginsOn();
  } else {
    $("#loaderPopup").hide();
    toast.error(
      "Internet Connection not available. Please reconnect the internet and relaunch your browser and resume the test."
    );
  }
}
function initHandlers() {
  if (
    $(".quizstartbuttondiv")
      .find("form")
      .attr("action")
      .includes("startattempt.php")
  ) {
    let quizStartBtn = $(".quizstartbuttondiv")
      .find("form")
      .find("[type|='submit']");
    $(quizStartBtn).on("click", startQuiz);
  }
  $("#closeModal")
    .add("#close")
    .on("click", function () {
      $("#myModal").hide();
    });
  $("#begin").on("click", beginQuiz);
  $("#retryDisablePlugin").on("click", studentViewService.retrying);
}
function onDiagonosticSuccess(a) {
  $("#loaderPopup").hide();
  if (!a) {
    console.log("Invalid Response");
    return;
  }
  if (a.proctoringEnabled) {
    studentViewService.openProctoringWindow(a);
  } else {
    $(".moodle-dialogue").show();
    $("#id_cancel")
      .add(".closebutton")
      .click(function () {
        $(".moodle-dialogue").hide();
      });
  }
}
$(document).ready(function () {
  init();
});
