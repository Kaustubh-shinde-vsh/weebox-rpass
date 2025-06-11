var inputAccessCode;
var switchBox;
var saveBtn;
var saveAndPublishBtn;
var loginState = mpaasConstants.loginState;
var mpassTextCheck = false;
function init() {
  displayMpaasTemplate();
  inputAccessCode = $("input[name=password]");
  switchBox = $("#switch");
  $("input:radio[name=descriptionIsDisplayed]:nth(0)").prop("checked", true);
  saveBtn = $("#z_a");
  saveAndPublishBtn = $("#z_b");
  bindEvents();
  savePwd();
}
function displayMpaasTemplate() {
  let url = window.location.href;
  let quizMode = url.includes("properties");
  if (quizMode) {
    var a = sharedTemplate.mpaasOption();
    $(".d_tabs_tabcontent").find("table:nth(0)").append(a);
    $("#mpaas").hide();
    if ($("#z_j").val().length > 0) {
      localStorage.removeItem("RpassValues");
      let editQuiz = {
        course: encodeURIComponent(localStorage.getItem("courseName")),
        quiz: encodeURIComponent($("#z_j").val()),
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
}
function mpassOptionsSuccess(a) {
  if (!a) {
    console.log("Invalid Response failed to get the Quiz");
    return;
  }
  if (a.proctoringEnabled) {
    let quizResponse = a.proctoringSettings;
    $("#mpaas").show();
    $("#switch").prop("checked", true);
    $("#z_a").hide();
    $("#z_b").hide();
    let saveMpaasOptions =
      "<button type='button' class='d2l-button' id='mpaasSave' style='float: left'>Save RPaaS Settings</button><h2 id='mpaassaveText' class='clearfixs'>Please Save RPaaS settings and then create a password from the Restrictions tab before saving the Quiz</h2>";
    $("d2l-floating-buttons").append(saveMpaasOptions);
    let SaveMpaasNote =
      '<span class="mpaas-txt info-notetxt"><img src=' +
      chrome.runtime.getURL("assets/info.png") +
      ' alt="info"><div>Note: Please do not change the name and code of the Course and Quiz after saving the settings. If you do so, RPaaS will get reset.</div></span>';
    $("d2l-floating-buttons").append(SaveMpaasNote);
    let notSupportChar =
      '<span class="mpaas-txt warning-notetxt"><img src=' +
      chrome.runtime.getURL("assets/info.png") +
      ' alt="info"><div>Warning: Please make sure your Course and Quiz name do not have the following special characters: <b> & * % ; , &apos; < > " &#92; &#47; </b></div></span>';
    $(".mpass-options").append(notSupportChar);
    $("#mpaasSave").prop("disabled", false);
    saveMpaasValues();
    teacherViewService.bindMpassValues(quizResponse);
  }
}
function savePwd() {
  if (!localStorage.getItem("RpassValues")) {
    return;
  }
  if (localStorage.getItem("RpassValues").length > 0) {
    if ($("input[name=password]").length == 0) {
      disableSaveBtn();
      let disabledNote =
        "<div class='col-sm-12 note-section text-center my-2'><h5 class='note-txt text-black text-center'>Please Save RPaaS settings and then create a password from the Restrictions tab before saving the Quiz</h5></div>";
      $("d2l-floating-buttons").append(disabledNote);
      return;
    }
    let disabledNote =
      "<div class='col-sm-12 note-section text-center my-2'><h5 class='note-txt text-black text-center'>Note: Please set a password for submit quiz</h5></div><div class='mpaas-txt text-black text-center'><h5>RPaaS Chrome Extension link has been added in the Quiz Description.</h5></div>";
    $("d2l-floating-buttons").append(disabledNote);
    if (inputAccessCode.val().length > 0) {
      enableSaveBtn();
    } else {
      disableSaveBtn();
    }
    inputAccessCode.keyup(function () {
      let trimValue = inputAccessCode.val().trim();
      inputAccessCode.val(trimValue);
      inputAccessCode.val() != null && $.trim(inputAccessCode.val()) != ""
        ? enableSaveBtn()
        : disableSaveBtn();
    });
  }
}
function saveMpaasValues() {
  $("#mpaasSave").on("click", function () {
    let StoreMpaasOtions = {
      course: localStorage.getItem("courseName"),
      quiz: $("#z_j").val(),
      mPassPayload: {
        proctoringEnabled: $("#switch").is(":checked"),
        proctoringSettings: teacherViewService.proctoringSettings(),
      },
    };
    localStorage.setItem("RpassValues", JSON.stringify(StoreMpaasOtions));
    toast.success(
      "RPaaS Options Saved. <br/>Please set a Password for the Quiz before saving the settings"
    );
    $("#mpaasSave").prop("disabled", true);
    if ($("#navigation").is(":checked")) {
      if (!$("input[name='disableRightClick']").is(":checked")) {
        $("input[name='disableRightClick']").click();
      }
    } else {
      if ($("input[name='disableRightClick']").is(":checked")) {
        $("input[name='disableRightClick']").click();
      }
    }
  });
}
function prepareSaveQuizData() {
  let quizData = JSON.parse(localStorage.getItem("RpassValues"));
  console.log("quizData- ", quizData);
  return {
    course: encodeURIComponent(quizData.course),
    quiz: encodeURIComponent(quizData.quiz),
    token: localStorage.getItem("loginToken"),
    url: localStorage.getItem("loginltiUrl"),
    mPassPayload: {
      course: encodeURIComponent(quizData.course),
      quiz: encodeURIComponent(quizData.quiz),
      url: localStorage.getItem("loginltiUrl"),
      proctoringEnabled: quizData.mPassPayload.proctoringEnabled,
      accessCode: encodeURIComponent($("input[name=password]").val()),
      proctoringSettings: quizData.mPassPayload.proctoringSettings,
    },
  };
}
function checkCourseSpecialChar(c) {
  var a = "&*%;,<>\"'/";
  var b = function (d) {
    for (i = 0; i < a.length; i++) {
      if (d.indexOf(a[i]) > -1) {
        return true;
      }
    }
    return false;
  };
  if (b(c) == false) {
    let quizData = JSON.parse(localStorage.getItem("RpassValues"));
    checkQuizSpecialChar(quizData.quiz);
  } else {
    let error =
      "Please remove the special characters from the name of your Course";
    $("#d_content").append(sharedTemplate.mpaaSErrorPopup(error));
    $("#mPaaSErrorPopup").show();
  }
}
function checkQuizSpecialChar(c) {
  var b = "&*%;,<>\"'/";
  var a = function (d) {
    for (i = 0; i < b.length; i++) {
      if (d.indexOf(b[i]) > -1) {
        return true;
      }
    }
    return false;
  };
  if (a(c) == false) {
    $("#d_content").append(sharedTemplate.mpaaSSavePopup());
    $("#mPaaSSettingSavePopup").show();
  } else {
    let error =
      "Please remove the special characters from the name of your Quiz";
    $("#d_content").append(sharedTemplate.mpaaSErrorPopup(error));
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
    if ($("input[name=password]").val().length <= 0) {
      toast.error("Access Code is Required");
      return;
    }
  }
  apiService.saveQuiz(a).then(
    function (b) {
      if (b.status === "SUCCESS") {
        let quizData = JSON.parse(localStorage.getItem("RpassValues"));
        if (quizData.mPassPayload.proctoringEnabled) {
          checkCourseSpecialChar(localStorage.getItem("courseName"));
          localStorage.removeItem("RpassValues");
        } else {
          console.log("Quiz created Successfully");
        }
      }
    },
    function (b) {
      let quizData = JSON.parse(localStorage.getItem("RpassValues"));
      if (quizData.mPassPayload.proctoringEnabled) {
        $("#d_content").append(sharedTemplate.mpaaSErrorPopup(b));
        $("#mPaaSErrorPopup").show();
      } else {
        console.log("Error in Quiz creation");
      }
    }
  );
}
function enableSaveBtn() {
  $("#z_a").removeAttr("disabled");
  $("#z_b").removeAttr("disabled");
  $(".note-txt").hide();
}
function disableSaveBtn() {
  $("#z_a").prop("disabled", true);
  $("#z_b").prop("disabled", true);
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
  switchBox.change(function () {
    if (
      $("#descriptionMessage").find("iframe").contents().find("#tinymce")
        .length == 0
    ) {
      var a = document.querySelector("#descriptionMessage");
      var c = a.shadowRoot;
      var b = c.querySelector("iframe");
    }
    if (switchBox.is(":checked")) {
      if (mpassTextCheck) {
        return;
      }
      let chromeExt_text =
        '<div id="mpaas_text"> To start the  <pre class="' +
        $("#z_j").val() +
        '" style="display:inline !important;font-family:inherit !important;font-size: 16px">' +
        $("#z_j").val() +
        '</pre>  Quiz, kindly download the RPaaS Chrome Extension from here:</br><a href="#" target="_blank">Wheebox</a></div>';
      if (
        $("#descriptionMessage").find("iframe").contents().find("#tinymce")
          .length == 0
      ) {
        $(b).contents().find("#tinymce").append(chromeExt_text);
        $(b).contents().find("#tinymce").focus();
      } else {
        $("#descriptionMessage")
          .find("iframe")
          .contents()
          .find("#tinymce")
          .append(chromeExt_text);
      }
      $("#mpaas").show();
      $("#z_a").hide();
      $("#z_b").hide();
      let saveMpaasOptions =
        "<button type='button' class='d2l-button' id='mpaasSave' style='float: left'>Save RPaaS Settings</button><h2 id='mpaassaveText' class='clearfixs'>Please Save RPaaS settings and then create a password from the Restrictions tab before saving the Quiz</h2>";
      $("d2l-floating-buttons").append(saveMpaasOptions);
      let SaveMpaasNote =
        '<span class="mpaas-txt info-notetxt"><img src=' +
        chrome.runtime.getURL("assets/info.png") +
        ' alt="info"><div>Note: Please do not change the name and code of the Course and Quiz after saving the settings. If you do so, RPaaS will get reset.</div></span>';
      $("d2l-floating-buttons").append(SaveMpaasNote);
      let notSupportChar =
        '<span class="mpaas-txt warning-notetxt"><img src=' +
        chrome.runtime.getURL("assets/info.png") +
        ' alt="info"><div>Warning: Please make sure your Course and Quiz name do not have the following special characters: <b> & * % ; , &apos; < > " &#92; &#47; </b></div></span>';
      $(".mpass-options").append(notSupportChar);
      $("#mpaasSave").prop("disabled", false);
      mpassTextCheck = true;
      saveMpaasValues();
    } else {
      $("#z_a").show();
      $("#z_b").show();
      $("#mpaasSave").prop("disabled", false);
      $("#mpaasSave").remove();
      $("#mpaassaveText").remove();
      if (
        $("#descriptionMessage").find("iframe").contents().find("#tinymce")
          .length == 0
      ) {
        $(b).contents().find("#tinymce").find("#mpaas_text").remove();
        $(b).contents().find("#tinymce").focus();
      } else {
        $("#descriptionMessage")
          .find("iframe")
          .contents()
          .find("#tinymce")
          .remove();
      }
      $("#mpaas").hide();
      enableSaveBtn();
      mpassTextCheck = false;
      $(".mpaas-txt").remove();
      $(".note-section").remove();
    }
  });
  bindSaveClickEvent();
}
function unBindEvents() {
  $(saveBtn).unbind("click");
}
$(document).ready(function () {
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
});
