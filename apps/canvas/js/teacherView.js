var inputAccessCode;
var switchBox;
var navigationswitchBox;
var saveBtn;
var saveAndPublishBtn;
var loginState = mpaasConstants.loginState;
var mpassTextCheck = false;
function init() {
  displayMpaasTemplate();
  inputAccessCode = $(".option-group").find("input#quiz_access_code");
  accessCodeCheckbox = $("#enable_quiz_access_code");
  switchBox = $("#switch");
  navigationswitchBox = $("#navigation");
  saveBtn = $(".save_quiz_button").prop("id", "save_quiz");
  saveAndPublishBtn = $(".save_and_publish").prop("id", "save_quiz_publish");
  bindEvents();
}
function displayMpaasTemplate() {
  var a = sharedTemplate.mpaasOption();
  $("fieldset").prop("id", "fieldsetId").prepend(a);
  $("#mpaas").hide();
  let newQuiz = $("#breadcrumbs").find("ul li:nth-child(4) a span").text();
  if (newQuiz != "Unnamed Quiz") {
    let editQuiz = {
      course: encodeURIComponent(localStorage.getItem("courseName")),
      quiz: encodeURIComponent($("#quiz_title").val()),
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
  if (!a) {
    console.log("Invalid Response failed to get the Quiz");
    return;
  }
  console.log("a- ", a);
  if (a.proctoringEnabled) {
    let quizResponse = a.proctoringSettings;
    let access = a;
    let SaveMpaasNote =
      '<span class="mpaas-txt info-notetxt"><img src=' +
      chrome.runtime.getURL("assets/info.png") +
      ' alt="info"><div>Note: Please do not change the name and code of the Course and Quiz after saving the settings. If you do so, RPaaS will get reset.</div></span>';
    $("#quiz_edit_actions").prepend(SaveMpaasNote);
    let notSupportChar =
      '<span class="mpaas-txt warning-notetxt"><img src=' +
      chrome.runtime.getURL("assets/info.png") +
      ' alt="info"><div>Warning: Please make sure your Course and Quiz name do not have the following special characters: <b> % ; < > " &#92; &#47; </b></div></span>';
    $(".mpass-options").append(notSupportChar);
    let disabledNote =
      "<h5 class='note-txt text-black text-center'>Note: Please Add Access Code for Enable Save & Publish Button and Save Button</h5><div class='mpaas-txt text-black text-center'><h5>RPaaS Chrome Extension link has been added in the Quiz Description.</h5></div>";
    $("#quiz_edit_actions").prepend(disabledNote);
    inputAccessCode.val().length > 0 ? enableSaveBtn() : disableSaveBtn();
    $(".mpaas-txt").show();
    $("input#quiz_access_code").val(decodeURIComponent(access.accessCode));
    $("#mpaas").show();
    $("#switch").prop("checked", true);
    teacherViewService.bindMpassValues(quizResponse);
  }
}
function prepareSaveQuizData() {
  return {
    course: encodeURIComponent(localStorage.getItem("courseName")),
    quiz: encodeURIComponent($("#quiz_title").val()),
    token: localStorage.getItem("loginToken"),
    url: localStorage.getItem("loginltiUrl"),
    mPassPayload: {
      course: encodeURIComponent(localStorage.getItem("courseName")),
      quiz: encodeURIComponent($("#quiz_title").val()),
      url: localStorage.getItem("loginltiUrl"),
      proctoringEnabled: $("#switch").is(":checked"),
      accessCode: encodeURIComponent(
        $(".option-group").find("input#quiz_access_code").val()
      ),
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
    checkQuizSpecialChar($("#quiz_title").val());
  } else {
    let error =
      "Please remove the special characters from the name of your Course";
    $("#content-wrapper").append(sharedTemplate.mpaaSErrorPopup(error));
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
    $("#content-wrapper").append(sharedTemplate.mpaaSSavePopup());
    $("#mPaaSSettingSavePopup").show();
  } else {
    let error =
      "Please remove the special characters from the name of your Quiz";
    $("#content-wrapper").append(sharedTemplate.mpaaSErrorPopup(error));
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
    if ($(".option-group").find("input#quiz_access_code").val().length <= 0) {
      toast.error("Access Code is Required");
      return;
    }
  }
  console.log("actual data- ", a);
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
        $("#content-wrapper").append(sharedTemplate.mpaaSErrorPopup(b));
        $("#mPaaSErrorPopup").show();
        toast.error(b);
      } else {
        console.log("Error in Quiz creation");
      }
    }
  );
}
function enableSaveBtn() {
  $(".save_and_publish").removeAttr("disabled");
  $(".save_quiz_button").removeAttr("disabled");
  $(".note-txt").hide();
}
function disableSaveBtn() {
  $(".save_and_publish").prop("disabled", true);
  $(".save_quiz_button").prop("disabled", true);
  $(".note-txt").show();
}
function bindSaveClickEvent() {
  saveBtn.add(saveAndPublishBtn).on("click", function () {
    chrome.storage.local.get(["state"], function (a) {
      if (a.state == loginState.PROFESSOR_LOGIN_SUCCESS) {
        if (navigator.onLine) {
          saveQuizData();
        } else {
          toast.error(
            "Internet Connection not available. Please reconnect the internet"
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
  accessCodeCheckbox.change(function () {
    if (switchBox.is(":checked")) {
      if (accessCodeCheckbox.is(":checked")) {
        inputAccessCode.val().length === 0 ? disableSaveBtn() : enableSaveBtn();
      } else {
        disableSaveBtn();
      }
    }
  });
  switchBox.change(function () {
    if (switchBox.is(":checked")) {
      if (mpassTextCheck) {
        return;
      }
      let chromeExt_text =
        '<div id="mpaas_text">To start the Quiz, kindly download the RPaaS Chrome Extension from Chrome WebStore</br><a href="https://chrome.google.com/webstore/detail/wheebox-rpaas/ddmgdlhnpkmkppobaalgnjbgogaabhlh" target="_blank">Wheebox RPaaS Extension</a><br/><br/>*Kindly Note this is a Proctored Test and Quiz can only be started once extension is downloaded. </div>';
      var chromeExt_textdata = $("#quiz_description_ifr")
        .contents()
        .find("#tinymce")
        .html();
      console.log("chromeExt_textdata- ", chromeExt_textdata);
      $("#quiz_description_ifr")
        .contents()
        .find("#tinymce")
        .append(chromeExt_text);
      $("#mpaas").show();
      let SaveMpaasNote =
        '<span class="mpaas-txt info-notetxt"><img src=' +
        chrome.runtime.getURL("assets/info.png") +
        ' alt="info"><div>Note: Please do not change the name and code of the Course and Quiz after saving the settings. If you do so, RPaaS will get reset.</div></span>';
      $("#quiz_edit_actions").prepend(SaveMpaasNote);
      let notSupportChar =
        '<span class="mpaas-txt warning-notetxt"><img src=' +
        chrome.runtime.getURL("assets/info.png") +
        ' alt="info"><div>Warning: Please make sure your Course and Quiz name do not have the following special characters: <b> % ; < > " &#92; &#47; </b></div></span>';
      $(".mpass-options").append(notSupportChar);
      let disabledNote =
        "<h5 class='note-txt text-black text-center'>Note: Please Add Access Code for Enable Save & Publish Button and Save Button</h5><div class='mpaas-txt text-black text-center'><h5>RPaaS Chrome Extension link has been added in the Quiz Description.</h5></div>";
      $("#quiz_edit_actions").prepend(disabledNote);
      mpassTextCheck = true;
      inputAccessCode.val().length > 0 ? enableSaveBtn() : disableSaveBtn();
      navigationswitchBox.trigger("change");
    } else {
      $("#quiz_description_ifr")
        .contents()
        .find("#tinymce")
        .find("#mpaas_text")
        .remove();
      $("#mpaas").hide();
      enableSaveBtn();
      mpassTextCheck = false;
      $(".mpaas-txt").remove();
      $(".note-txt").remove();
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
  if ($("#left-side").find("a:contains('Rpaas')").attr("href")) {
    chrome.storage.local.get(["state"], function (a) {
      if (a.state == loginState.PROFESSOR_LOGIN_SUCCESS) {
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
  } else {
    console.log("Rpaas tool is not present for this course");
  }
});
