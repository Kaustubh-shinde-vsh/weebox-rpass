var access;
var examData;
var loginConstants = mpaasConstants.loginType;
var lmsTypeContants = mpaasConstants.lmsType;
var loginState = mpaasConstants.loginState;
var chromeMessage = mpaasConstants.chromeSendMessage;
function init() {
  var b = document
    .querySelector("d2l-sequence-viewer")
    .shadowRoot.querySelector("#view-container")
    .querySelector("#viewframe")
    .querySelector("d2l-sequences-content-router")
    .shadowRoot.querySelector("d2l-sequences-content-link")
    .shadowRoot.querySelector(".d2l-sequences-scroll-container")
    .querySelector("iframe");
  if (b == null) {
    console.log("ShadowDom value not found");
    return;
  }
  if ($(b).contents().find("body").find("#z_d").text().length > 0) {
    $("#loaderPopup").hide();
    $("#mpaasInfo").remove();
    var a =
      "<div class='c-pointer text-center' id='mpaasInfo'> <span id='mpaasInstructions' style='color: #006fbf;'>RPaaS Instructions</span> <button id='startQuiz' style='display:block;margin:auto;background-color: #096A9A;color: #FFF;' class='text-center d2l-button btn btn-primary' onClick='window.location.reload();'>Reload</button><p style='color:red'>Are you ready to start the Quiz? Go to the Quiz you want to attempt and click on Reload to continue.</p></div>";
    $("body").prepend(a);
    goToInstructions();
    return;
  }
  chrome.storage.local.set({ lmsApp: lmsTypeContants.D2lSL });
  // takeQuizService.submitQuizAttempt();
  // console.log("submitQuizAttempt2- ");

  chrome.runtime.sendMessage({
    type: "action",
    action: chromeMessage.STOP_PROCTORING,
  });
  $(b).contents().find("body").find(".submitStepBottom").hide();
  studentLogin();
  clickEvents();
}
function goToInstructions() {
  $("#mpaasInstructions").on("click", function () {
    if (navigator.onLine) {
      $(".closeInfoBtn").remove();
      $(".student-section").remove();
      let closeBtn =
        '<div class="closeInfoBtn text-center c-pointer"><span class="d2lbtn"><img src="' +
        chrome.runtime.getURL("assets/close.svg") +
        '" style="height: 45px;float: right;margin-right: 35px;" alt="close"/></span></div>';
      $("body").append(closeBtn);
      $("body").append(sharedTemplate.student());
      $("d2l-sequence-viewer").hide();
      $("#loaderPopup").hide();
      $(".closeInfoBtn").on("click", function () {
        $("d2l-sequence-viewer").show();
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
function clickEvents() {
  $("#closeModal")
    .add("#close")
    .on("click", function () {
      $("#myModal").hide();
      $("#mpaasInfo").remove();
      $("body").prepend(sharedTemplate.examStartInfo());
      $(".startExam_section").css({
        "text-align": "center",
        "border-top": "0",
      });
      let url =
        "https://" +
        window.location.host +
        window.location.pathname +
        "/backToContent";
      let closebtn =
        "<a href=" +
        url +
        '><img src="' +
        chrome.runtime.getURL("assets/close.svg") +
        '" style="height: 45px;float: right;margin-right: 35px;" alt="close"/></a>';
      $(".startExam_section").prepend(closebtn);
      $("#startBtnExam").on("click", function () {
        $(".startExam_section").remove();
        studentViewService.openProctoringWindow(examData);
      });
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
  var b = document
    .querySelector("d2l-sequence-viewer")
    .shadowRoot.querySelector("#view-container")
    .querySelector("#viewframe")
    .querySelector("d2l-sequences-content-router")
    .shadowRoot.querySelector("d2l-sequences-content-link")
    .shadowRoot.querySelector(".d2l-sequences-scroll-container")
    .querySelector("iframe").contentWindow.document;
  if (b == null) {
    console.log("ShadowDom value not found");
    return;
  }
  console.log("studentLogin() b- ", b);
  let user = JSON.parse(localStorage.getItem("loginUser"));
  let quizName = b
    .querySelector("body")
    .querySelector("d2l-html-block")
    .shadowRoot.querySelector("pre");
  let finalPayload = {
    token: localStorage.getItem("loginToken"),
    ltiurl: localStorage.getItem("loginltiUrl"),
    startQuizPayload: {
      course: encodeURIComponent(localStorage.getItem("courseName")),
      quiz: encodeURIComponent($(quizName).attr("class")),
      userId: user.userId,
    },
  };
  var a = JSON.parse(localStorage.getItem("i18Texts"));
  chrome.storage.local.set({ state: loginState.STUDENT_LOGIN_SUCCESS });
  apiService.openDiagonostic(finalPayload).then(
    function (c) {
      onDiagonosticSuccess(c);
      $("#loaderPopup").hide();
      window.LanguageMap = a;
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
}
function onDiagonosticSuccess(b) {
  if (!b) {
    console.log("Invalid Response");
    return;
  }
  var c = document
    .querySelector("d2l-sequence-viewer")
    .shadowRoot.querySelector("#view-container")
    .querySelector("#viewframe")
    .querySelector("d2l-sequences-content-router")
    .shadowRoot.querySelector("d2l-sequences-content-link")
    .shadowRoot.querySelector(".d2l-sequences-scroll-container")
    .querySelector("iframe");
  if (c == null) {
    console.log("ShadowDom value not found");
    return;
  }
  if (b.proctoringEnabled) {
    examData = b;
    $(c).contents().find("body").find(".dlay_l").hide();
    $(c)
      .contents()
      .find("body")
      .find("d2l-floating-buttons")
      .find("button")
      .hide();
    studentViewService.openProctoringWindow(b);
    let d2lHeader = document
      .querySelector("d2l-sequence-viewer")
      .shadowRoot.querySelector("d2l-sequence-viewer-header");
    $(d2lHeader).hide();
  } else {
    sessionStorage.removeItem("proctor");
    $(c).contents().find("body").find(".dlay_l").show();
    $(c)
      .contents()
      .find("body")
      .find("d2l-floating-buttons")
      .find("button")
      .show();
    $("#loaderPopup").hide();
    $("#mpaasInfo").remove();
    var a =
      "<div class='c-pointer text-center' id='mpaasInfo'> <span id='mpaasInstructions' style='color: #006fbf;'>RPaaS Instructions</span> <button id='startQuiz' style='display:block;margin:auto;background-color: #096A9A;color: #FFF;' class='text-center d2l-button btn btn-primary' onClick='window.location.reload();'>Reload</button><p style='color:red'>Are you ready to start the Quiz? Go to the Quiz you want to attempt and click on Reload to continue.</p></div>";
    $("body").prepend(a);
    toast.info(
      "This is a Non Proctored Quiz, please click on the below Start button to start your Quiz."
    );
    $(".jq-toast-wrap").css({ top: "230px" });
    goToInstructions();
  }
}
$(document).ready(function () {
  chrome.runtime.sendMessage({
    type: "action",
    action: chromeMessage.STOP_PROCTORING,
  });
  window.history.pushState(null, null, window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };
  chrome.storage.local.get(["state"], function (b) {
    var a = mpaasConstants.loginState;
    if (b.state === a.STUDENT_LOGIN_SUCCESS) {
      let parentElement = $("body");
      parentElement.prepend(sharedTemplate.checkSystem());
      parentElement.prepend(sharedTemplate.startProctor());
      parentElement.prepend(sharedTemplate.loaderPopup());
      parentElement.prepend(sharedTemplate.pluginloader());
      parentElement.prepend(sharedTemplate.otherPluginsPopup());
      $("#loaderPopup").show();
      $("#continue").css({ "background-color": "#2765dae3" });
      $("#closeModal").css({
        color: "rgb(170, 170, 170)",
        float: "right",
        display: "block",
      });
      setTimeout(function () {
        $("#loaderPopup").hide();
        var c = document
          .querySelector("d2l-sequence-viewer")
          .shadowRoot.querySelector("#view-container")
          .querySelector("#viewframe")
          .querySelector("d2l-sequences-content-router")
          .shadowRoot.querySelector("d2l-sequences-content-link")
          .shadowRoot.querySelector(".d2l-sequences-scroll-container")
          .querySelector("iframe");
        if (c == null) {
          console.log("ShadowDom value not found");
          return;
        }
        $(c).contents().find("body").find(".dlay_l").hide();
        $(c)
          .contents()
          .find("body")
          .find("d2l-floating-buttons")
          .find("button")
          .hide();
        if ($(c).attr("src").includes("quiz_summary.d2l")) {
          $("body").css("overflow", "auto");
          init();
        }
      }, 5000);
    } else {
      console.log("Something went wrong. Please click on RPaaS Tool");
    }
  });
});
