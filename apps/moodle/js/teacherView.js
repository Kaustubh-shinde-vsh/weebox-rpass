console.log("moodle/teacherView");
var inputAccessCode;
var switchBox;
var navigationswitchBox;
var saveBtn;
var saveAndPublishBtn;
var loginState = mpaasConstants.loginState;
var mpassTextCheck = false;
function init() {
  displayMpaasTemplate();
  inputAccessCode = $("input#id_quizpassword");
  switchBox = $("#switch");
  navigationswitchBox = $("#navigation");
  saveBtn = $("#id_submitbutton2");
  saveAndPublishBtn = $("#id_submitbutton");
  bindEvents();
}
function displayMpaasTemplate() {
  var a = sharedTemplate.mpaasOption();
  $("#id_general").append(a);
  $("#mpaas").hide();
  let url = window.location.href;
  let quizMode = url.includes("update");
  if (quizMode) {
    let editQuiz = {
      course: encodeURIComponent(localStorage.getItem("courseName")),
      quiz: encodeURIComponent($("#id_name").val()),
      token: localStorage.getItem("loginToken"),
      url: localStorage.getItem("loginltiUrl"),
    };
    apiService.bindMpassOptions(editQuiz).then(
      function (b) {
        mpassOptionsSuccess(b);
      },
      function (b) {
        toast.error(b);
      }
    );
  }
}
function mpassOptionsSuccess(a) {
  console.log("a- ", a);
  if (!a) {
    console.log("Invalid Response failed to get the Quiz");
    return;
  }
  if (a.proctoringEnabled) {
    let quizResponse = a.proctoringSettings;
    let access = a;
    let disabledNote =
      "<div class='col-sm-12 note-section text-center my-2'><h5 class='note-txt text-black text-center'>Note: Please set a password for save quiz</h5></div><div class='col-sm-12 mpaas-txt text-black text-center'><h5>RPaaS Chrome Extension link has been added in the Quiz Description.</h5></div>";
    $(".required").append(disabledNote);
    let SaveMpaasNote =
      '<span class="mpaas-txt info-notetxt"><img src=' +
      chrome.runtime.getURL("assets/info.png") +
      ' alt="info"><div>Note: Please do not change the name and code of the Course and Quiz after saving the settings. If you do so, RPaaS will get reset.</div></span>';
    $(".required").append(SaveMpaasNote);
    let notSupportChar =
      '<span class="mpaas-txt warning-notetxt"><img src=' +
      chrome.runtime.getURL("assets/info.png") +
      ' alt="info"><div>Warning: Please make sure your course and Quiz name do not have the following special characters: <b> % ; < > " &#92; &#47; </b></div></span>';
    $("#id_general").append(notSupportChar);
    inputAccessCode.val().length > 0 ? enableSaveBtn() : disableSaveBtn();
    $("#id_introeditoreditable").find("#mpaas_text").length == 1
      ? $(".mpaas-txt").show()
      : $(".mpaas-txt").hide();
    $("input#id_quizpassword").val(decodeURIComponent(access.accessCode));
    $("#mpaas").show();
    $("#switch").prop("checked", true);
    teacherViewService.bindMpassValues(quizResponse);
  }
}
function prepareSaveQuizData() {
  return {
    course: encodeURIComponent(localStorage.getItem("courseName")),
    quiz: encodeURIComponent($("#id_name").val()),
    token: localStorage.getItem("loginToken"),
    url: localStorage.getItem("loginltiUrl"),
    mPassPayload: {
      course: encodeURIComponent(localStorage.getItem("courseName")),
      quiz: encodeURIComponent($("#id_name").val()),
      url: localStorage.getItem("loginltiUrl"),
      proctoringEnabled: $("#switch").is(":checked"),
      accessCode: encodeURIComponent($("input#id_quizpassword").val()),
      proctoringSettings: teacherViewService.proctoringSettings(),
    },
  };
}
function checkCourseSpecialChar(c) {
  var a = '%;<>"\\/';
  var b = function (d) {
    for (i = 0; i < a.length; i++) {
      if (d.indexOf(a[i]) > -1) {
        return true;
      }
    }
    return false;
  };
  if (b(c) == false) {
    checkQuizSpecialChar($("#id_name").val());
  } else {
    let error =
      "Please remove the special characters from the name of your Course";
    $("#region-main").append(sharedTemplate.mpaaSErrorPopup(error));
    $("#mPaaSErrorPopup").show();
  }
}
function checkQuizSpecialChar(c) {
  var b = '%;<>"\\/';
  var a = function (d) {
    for (i = 0; i < b.length; i++) {
      if (d.indexOf(b[i]) > -1) {
        return true;
      }
    }
    return false;
  };
  if (a(c) == false) {
    $("#region-main").append(sharedTemplate.mpaaSSavePopup());
    $("#mPaaSSettingSavePopup").show();
  } else {
    let error =
      "Please remove the special characters from the name of your Quiz";
    $("#region-main").append(sharedTemplate.mpaaSErrorPopup(error));
    $("#mPaaSErrorPopup").show();
  }
}
function saveQuizData() {
  var a = prepareSaveQuizData();
  if (!a.quiz) {
    toast.error("Quiz Name is Required");
    return;
  }
  if (a.mPassPayload.proctoringEnabled) {
    if ($("input#id_quizpassword").val().length <= 0) {
      toast.error("Access Code is Required");
      return;
    }
  }
  apiService.saveQuiz(a).then(
    function (b) {
      if (b.status === "SUCCESS") {
        if (switchBox.is(":checked")) {
          checkCourseSpecialChar(localStorage.getItem("courseName"));
        } else {
          console.log("Quiz created Successfully");
        }
      }
    },
    function (b) {
      if (switchBox.is(":checked")) {
        $("#region-main").append(sharedTemplate.mpaaSErrorPopup(b));
        $("#mPaaSErrorPopup").show();
      } else {
        console.log("Error in Quiz creation");
      }
    }
  );
}
function enableSaveBtn() {
  $("#id_submitbutton2").removeAttr("disabled");
  $("#id_submitbutton").removeAttr("disabled");
  $(".note-txt").hide();
}
function disableSaveBtn() {
  $("#id_submitbutton2").prop("disabled", true);
  $("#id_submitbutton").prop("disabled", true);
  $(".note-txt").show();
}
function bindSaveClickEvent() {
  saveBtn.add(saveAndPublishBtn).on("click", function () {
    chrome.storage.local.get(["state"], function (a) {
      if (a.state == loginState.PROFESSOR_LOGIN_SUCCESS) {
        //loginState.PROFESSOR_LOGIN_SUCCESS
        if (navigator.onLine) {
          saveQuizData();
        } else {
          toast.error(
            "Internet Connection not available. Please reconnect the internet."
          );
        }
      } else {
        toast.error("You are not logged in RPaaS Chrome Extension.");
      }
    });
  });
}
function bindEvents() {
  inputAccessCode.keyup(function () {
    if (switchBox.is(":checked")) {
      let trimValue = inputAccessCode.val().trim();
      inputAccessCode.val(trimValue);
      inputAccessCode.val() != null && $.trim(inputAccessCode.val()) != ""
        ? enableSaveBtn()
        : disableSaveBtn();
    }
  });
  switchBox.change(function () {
    if (switchBox.is(":checked")) {
      if (mpassTextCheck) {
        return;
      }
      let chromeExt_text =
        '<div id="mpaas_text">To start the Quiz, kindly download the RPaaS Chrome Extension from Chrome WebStore</br><a href="https://chrome.google.com/webstore/detail/wheebox-rpaas/ddmgdlhnpkmkppobaalgnjbgogaabhlh" target="_blank">Wheebox RPaaS Extension</a><br/><br/>*Kindly Note this is a Proctored Test and Quiz can only be started once extension is downloaded. </div>';
      $("#id_introeditoreditable").append(chromeExt_text);
      $("#id_introeditoreditable").focus();
      $("#mpaas").show();
      let disabledNote =
        "<div class='col-sm-12 note-section text-center my-2'><h5 class='note-txt text-black text-center'>Note: Please set a password for save quiz</h5></div><div class='col-sm-12 mpaas-txt text-black text-center'><h5>RPaaS Chrome Extension link has been added in the Quiz Description.</h5></div>";
      $(".required").append(disabledNote);
      let SaveMpaasNote =
        '<span  class="mpaas-txt info-notetxt"><img src=' +
        chrome.runtime.getURL("assets/info.png") +
        ' alt="info"><div>Note: Please do not change the name and code of the Course and Quiz after saving the settings. If you do so, RPaaS will get reset.</div></span>';
      $(".required").append(SaveMpaasNote);
      let notSupportChar =
        '<span class="mpaas-txt warning-notetxt"><img src=' +
        chrome.runtime.getURL("assets/info.png") +
        ' alt="info"><div>Warning: Please make sure your Course and Quiz name do not have the following special characters: <b> % ; < > " &#92; &#47; </b></div></span>';
      $("#id_general").append(notSupportChar);
      mpassTextCheck = true;
      inputAccessCode.val().length > 0 ? enableSaveBtn() : disableSaveBtn();
    } else {
      $("#id_introeditoreditable").find("#mpaas_text").remove();
      $("#id_introeditoreditable").focus();
      $("#mpaas").hide();
      enableSaveBtn();
      mpassTextCheck = false;
      $(".mpaas-txt").remove();
      $(".note-section").remove();
    }
  });
  navigationswitchBox.change(function () {
    if (navigationswitchBox.is(":checked")) {
      $("#id_lostfocusallowed").show();
    } else {
      $("#id_lostfocusallowed").hide();
    }
  });
  bindSaveClickEvent();
}
function unBindEvents() {
  $(saveBtn).unbind("click");
  $(saveAndPublishBtn).unbind("click");
}
$(document).ready(function () {
  if ($("#id_typeid").length === 1) {
    return;
  }
  chrome.storage.local.get(["state"], function (a) {
    console.log("state:- ", a);
    if (a.state == loginState.PROFESSOR_LOGIN_SUCCESS) {
      //loginState.PROFESSOR_LOGIN_SUCCESS
      init();
    } else {
      if (a.state == loginState.TOKEN_EXPIRED) {
        toast.error(
          "Token Expired for RPaaS Chrome Extension, please login again."
        );
      } else {
        toast.error("You are not logged in RPaaS Chrome Extension.");
      }
    }
  });
});
