var access;
var loginConstants = mpaasConstants.loginType;
var lmsTypeContants = mpaasConstants.lmsType;
var loginState = mpaasConstants.loginState;
var chromeMessage = mpaasConstants.chromeSendMessage;
function init() {
  console.log("starting student view");
  let parentElement = $(".d2l-page-main");
  console.log("parentElement1- ", parentElement);
  if ($("input[name='password']").length == 0) {
    return;
  }
  console.log("parentElement2- ", parentElement);
  chrome.storage.local.set({ lmsApp: lmsTypeContants.D2L });
  // takeQuizService.submitQuizAttempt();
  chrome.runtime.sendMessage({
    type: "action",
    action: chromeMessage.STOP_PROCTORING,
  });
  console.log("lmsTypeContants- ", lmsTypeContants);
  $(".submitStepBottom").hide();
  parentElement.prepend(d2lTemplate.d2lCheckSystem());
  parentElement.prepend(d2lTemplate.d2lStartProctor());
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
  let user = JSON.parse(localStorage.getItem("loginUser"));
  let finalPayload = {
    token: localStorage.getItem("loginToken"),
    ltiurl: localStorage.getItem("loginltiUrl"),
    startQuizPayload: {
      course: encodeURIComponent(localStorage.getItem("courseName")),
      quiz: encodeURIComponent(
        $(".d2l-htmlblock, .d2l-htmlblock-untrusted, d2l-htmlblock-inline")
          .find("pre")
          .attr("class")
      ),
      emailID: user.userId,
    },
  };
  var a = JSON.parse(localStorage.getItem("i18Texts"));
  chrome.storage.local.set({ state: loginState.STUDENT_LOGIN_SUCCESS });
  apiService.openDiagonostic(finalPayload).then(
    function (b) {
      onDiagonosticSuccess(b);
      $("#loaderPopup").hide();
      window.LanguageMap = a;
      var c = $("body").find("._i18");
      c.each(function () {
        var e = $(this);
        var d = e.attr("data-i18");
        e.html(window.LanguageMap[d]);
      });
    },
    function (b) {
      $("#loaderPopup").hide();
      toast.error(b);
    }
  );
}
function onDiagonosticSuccess(a) {
  if (!a) {
    console.log("Invalid Response");
    return;
  }
  console.log("a- ", a);
  if (a.proctoringEnabled) {
    $(".dlay_l").hide();
    $("d2l-floating-buttons").find("button").hide();
    let checkSystemBtn =
      "<button id='startQuiz' class='d2l-button'>Start Quiz</button>";
    $("#d2l_form").append(checkSystemBtn);
    $("#startQuiz").on("click", function () {
      studentViewService.openProctoringWindow(a);
    });
  } else {
    $(".dlay_l").show();
    $("d2l-floating-buttons").find("button").show();
  }
}
$(document).ready(function () {
  $(".dlay_l").hide();
  $("d2l-floating-buttons").find("button").hide();
  chrome.storage.local.get(["state"], function (b) {
    var a = mpaasConstants.loginState;
    if (b.state === a.STUDENT_LOGIN_SUCCESS) {
      setTimeout(function () {
        init();
      }, 3500);
    } else {
      toast.error("Something went wrong. Please click on RPaaS Tool");
    }
  });
});
