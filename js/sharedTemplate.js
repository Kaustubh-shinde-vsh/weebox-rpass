console.log("sharedTemplate");
var sharedTemplate = new (function () {
  function i() {
    return (
      '<div class="teacher-section bg-white text-center"><div class="title-logo text-center"><span class="reports_text v-align-top inline-block">Proctoring Reports</span></div><span class="info-notetxt" style="margin: 10px 15%;"><img src=' +
      chrome.runtime.getURL("assets/info.png") +
      ' alt="info"><div>Facing trouble?</div></span><div class="header-section text-left"><div class="course-title text-bold"></div><div class="quiz-text" id="course-subtext">Below is the list of Quizzes mapped to this course.</div></div><div class="main-search" id="main-search"></div><div class="main-pagination" id="main-pagination"></div><div class="clearfixs"></div><div class="back hide text-left c-pointer" id="back"><--- Back</div><div class="filter-sort-div hide text-left"></div><div class="main-section" id="main-section"><div class="warning-section hide"><span class="warning-icon">!</span></div><div class="no-record text-bold hide">No Record Found</div><p class="no-record-text hide">Please wait while we Login to your Account</p><div><div>'
    );
  }
  function f() {
    return (
      '<div class="student-section bg-white"><div class="instruction-block"><h3>General Instructions:</h3><ol><li class="instruction-txt mb-10">Wheebox RPaaS as a Service (RPaaS) will monitor your session for review.</li><li class="instruction-txt mb-10">RPaaS will close all running tabs on your system. Please save your work before proceeding for the test/quiz.</li>' +
      "</ol></div></div>"
    );
  }
  function b() {
    return (
      '<div id="testNavigateAwayPopup" class="modal-wrapper"><div class="modal-contents"><div class="text-center mt-0"><img src=' +
      chrome.runtime.getURL("assets/window.png") +
      ' alt="window alert image" /></div><div class="title-heading text-center mettl-text text-danger _i18" data-i18="NAV_AWAY_MSG_1"></div><div class="data-section text-center"><div class="text-section"><p class="mettl-text _i18" data-i18="NAV_AWAY_MSG_2"></p><p class="mettl-text _i18" data-i18="NAV_AWAY_MSG_3"></p><p class="mettl-text _i18" data-i18="NAV_AWAY_MSG_4"></p></div></div><div class="action-section text-center"><button class="btn btn-primary continue-btn _i18" id="closeNavigateAwayPopup" data-i18="TEXT_CLOSE_WINDOW"></button></div></div> </div>'
    );
  }
  function g() {
    return (
      '<div class="open-chat"><div class="message-imagesection rounded-circle c-pointer"><img src=' +
      chrome.runtime.getURL("assets/message.png") +
      ' alt="message-icon" id="imageMessage"/></div></div><div class="chat-block"><div class="title-section"><div class="chat-heading"><span class="chat-heading-inner"></span> <div class="proctor-active"><div class="text-white text-bold">Proctor</div> <div class="active text-white text-bold">Active Now</div></div></div></div><div class="chat-body"></div><div class="chat-action text-center"><div class="message-input-section"><input type="text" class="form-control chat-input" placeholder="Write a message…" autocomplete="off" id="chatMsg" name="chat-msg"><button class="send-btn" id="sendMessage"><img src=' +
      chrome.runtime.getURL("assets/send.png") +
      ' alt="send-icon"/></button></div><div class="hide-chatwindow rounded-circle inline-block text-white c-pointer" id="hideChat">X</div><audio id="myAudio" class="hide"><source src=' +
      chrome.runtime.getURL("assets/message.mp3") +
      ' type="audio/mpeg"></audio></div></div>'
    );
  }
  function d(l) {
    return (
      '<div class="error-section bg-white text-center"><div class="main-section"><div class="warning-section"><span class="warning-icon">!</span></div><div class="text-bold"><h3>' +
      l +
      "</h3></div><div><div>"
    );
  }
  function a() {
    // return '<div class="mpass-options"><div class="mpaas-switch"><div class="Setting-text"><span class="mpass-text text-bold">RPaaS Setting</span> <span title="Enable RPaaS" class="info-text text-white text-white rounded-circle text-bold">i</span></div><label class="switchs"><input type="checkbox" id="switch"><span class="sliders round"></span></label></div><br><div class="main-section" id="mpaas"><div class="additional-text"><span class="text-black text-bold">Additional Options</span></div><div class="custom-controls custom-checkboxs"><input type="checkbox" class="custom-control-inputs" id="screenCapture" value="Enable_Screen_Capture" name="screenCapture"><label class="custom-control-labels" for="screenCapture">Enable Screen Capture</label></div><div class="custom-controls custom-checkboxs"><input type="checkbox" class="custom-control-inputs" id="record" value="Enable_Recording" name="record"> <label class="custom-control-labels" for="record">Enable Recording</label></div><div class="custom-controls custom-checkboxs"><input type="checkbox" class="custom-control-inputs" value="Is_Authorisation_On" id="auth" name="auth"><label class="custom-control-labels" for="auth">Manual  Approval </label></div><div class="custom-controls custom-checkboxs"><input type="checkbox" class="custom-control-inputs" value="Full_Screen_Mode" id="fullScreen" name="fullScreen" checked><label class="custom-control-labels" for="fullScreen">Full Screen Mode</label></div><div class="custom-controls custom-checkboxs"><input type="checkbox" class="custom-control-inputs" value="Enable_Navigation_Control" id="navigation" name="navigation" checked><label class="custom-control-labels" for="navigation">Enable Navigation Control</label></div><div class="custom-controls custom-checkboxs"><input type="checkbox" class="custom-control-inputs" id="plugin" value="Restrict_Plugins" name="plugin"> <label class="custom-control-labels" for="plugin">Disable other Chrome Extensions</label></div></div></div>';
    return '<div class="mpass-options"><div class="mpaas-switch"><div class="Setting-text"><span class="mpass-text text-bold">RPaaS Setting</span><span title="Enable RPaaS" class="info-text text-white text-white rounded-circle text-bold">i</span></div><label class="switchs"><input type="checkbox" id="switch"><span class="sliders round"></span></label></div><br><div class="main-section" id="mpaas"><div class="additional-text"><span class="text-black text-bold">Additional Options</span></div><div class="custom-controls custom-checkboxs"><input type="checkbox" class="custom-control-inputs" value="Is_Authorisation_On" id="auth" name="auth"><label class="custom-control-labels" for="auth">Manual  Approval </label></div><div class="custom-controls custom-checkboxs"><input type="checkbox" class="custom-control-inputs" id="plugin" value="Restrict_Plugins" name="plugin"> <label class="custom-control-labels" for="plugin">Disable other Chrome Extensions</label></div><div class="custom-controls custom-checkboxs"><input type="checkbox" class="custom-control-inputs" id="signlepagequiz" value="SignlePageQuiz" name="signlepagequiz" onclick="doFunction();"> <label class="custom-control-labels" for="signlepagequiz">Single page quiz</label></div><div class="custom-controls custom-checkboxs"><input type="checkbox" class="custom-control-inputs" id="screenCapture" value="Enable_Screen_Capture" name="screenCapture"><label class="custom-control-labels" for="screenCapture">Enable Screen Sharing</label></div><div class="custom-controls custom-checkboxs"><input type="checkbox" class="custom-control-inputs" id="hardMapping" value="Enable_Screen_Capture" name="hardMapping"><label class="custom-control-labels" for="hardMapping">Hard Mapping</label></div><div class="custom-controls custom-checkboxs"><input type="checkbox" class="custom-control-inputs" id="displaywarning" value="displaywarning" name="displaywarning"> <label class="custom-control-labels" for="displaywarning">Candidate Side Warnings</label></div><div class="custom-controls custom-checkboxs"><input type="checkbox" class="custom-control-inputs" value="Enable_Navigation_Control" id="navigation" name="navigation" checked><label class="custom-control-labels" for="navigation">Enable Navigation Control</label></div><div class="custom-controls custom-text" id="id_lostfocusallowed"><label class="custom-control-inpit-labels" for="lostfocusallowed">Navigation limit</label><input style="float: right;margin-right: -40%;width: 100px;" type="number" min="5" class="custom-control-text" value="20" id="lostfocusallowed" name="lostfocusallowed"></div></div></div><script>function doFunction(){ if(($("#signlepagequiz").prop("checked"))==true){ $("#screenCapture").prop("checked",false); $("#screenCapture").prop("disabled",true); }else{ $("#screenCapture").prop("disabled",false); } }</script>';
  }
  function k() {
    return (
      '<div id="loaderPopup" class="modal-wrapper"><div class="modal-contents" style="width: 350px;height: 370px;"><div class="title-logo text-center mt-0"><img src=' +
      chrome.runtime.getURL("assets/pluginLoader.gif") +
      ' alt="logo"/></div></div> </div>'
    );
  }
  function e() {
    return (
      '<div id="pluginLoader" class="modal-wrapper"><div class="modal-contents bg-white student-modal-content p-3"><div class="chat-section text-center"><div class="chat-img"><img src=' +
      chrome.runtime.getURL("assets/pluginLoader.gif") +
      ' alt="loader" id="chat-image"/></div><p class="_i18">Loading Quiz</p></div></div></div>'
    );
  }
  function c() {
    return (
      '<div id="otherPluginsPopup" class="modal-wrapper"><div class="modal-contents"><div class="text-center mt-0"><img src=' +
      chrome.runtime.getURL("assets/window.png") +
      ' alt="window alert image" /></div><div class="title-heading text-center text-danger mettl-text _i18" data-i18="RESTRICT_PLUGIN_1"></div><div class="text-section"><p class="mettl-text text-center _i18" data-i18="RESTRICT_PLUGIN_2"></p><div class="duplicatedata-section text-danger text-center">Please remove Mettl duplicate plugins</div><div class="plugindata-section"></div><div class="action-section text-center"><button class="btn btn-primary continue-btn _i18" data-i18="RESTRICT_PLUGIN_3" id="retryDisablePlugin"></button></div><div class="text-center"><p class="mettl-text _i18" data-i18="RESTRICT_PLUGIN_4"></p></div> </div>'
    );
  }
  function j() {
    return (
      '<div id="mPaaSSettingSavePopup" class="modal-wrapper"><div class="modal-contents"><div class="text-center mt-0"><img src=' +
      chrome.runtime.getURL("assets/Success.png") +
      ' alt="alert image" /></div><div class="data-section text-center mt-10"><div class="text-section"><b class="mettl-text mb-10">RPaaS Settings have been saved successfully</b><p class="mettl-text mt-10 mb-10">Note: Please do not change the name and code of the Course and Quiz. If you do so, RPaaS will get reset.</p></div></div></div></div>'
    );
  }
  function h(l) {
    return (
      '<div id="mPaaSErrorPopup" class="modal-wrapper"><div class="modal-contents"><div class="text-center mt-0"><img src=' +
      chrome.runtime.getURL("assets/Cancel.png") +
      ' alt="alert image" /></div><div class="data-section text-center mt-10"><div class="text-section"><b class="mettl-text mb-10">RPaaS Settings failed to saved</b><p class="mettl-text mt-10 mb-10">Note: ' +
      l +
      ".</p></div></div></div></div>"
    );
  }
  function simpleWarning(icon, heading, body, closable = false) {
    $popupdesign =
      '<div id="RPaaSProctorErrorPopup' +
      icon +
      '" class="modal-wrapper errorpopup"><div class="modal-contents"><div class="text-center mt-0"><img src="' +
      chrome.runtime.getURL("assets/" + icon + ".png") +
      '" alt="alert image" /></div><br/><div class="title-heading text-center mettl-text text-danger"><b class="mettl-text mb-10">WARNING!<br/>' +
      heading +
      '</b></b></div><div class="data-section text-center mt-10"><div class="text-section"><p class="mettl-text">' +
      body +
      "</p></div></div>";
    if (closable) {
      $popupdesign +=
        '<div class="action-section text-center"><button class="btn btn-primary continue-btn" id="closeProctorErrorPopup" data-i18="TEXT_CLOSE_WINDOW">Close this Window</button></div>';
    }
    $popupdesign += "</div></div>";
    return $popupdesign;
  }
  function pauseQuiz(message) {
    $popupdesign =
      '<div id="RPaaSProctorPausePopup" class="errormodal-wrapper pauseerrorpopup"><div class="modal-contents"><H2 class="text-center">' +
      message +
      "</H2></div></div>";
    return $popupdesign;
  }
  return {
    student: f,
    reportView: i,
    testNavigateAwayPopup: b,
    chatView: g,
    errorPage: d,
    mpaasOption: a,
    loaderPopup: k,
    pluginloader: e,
    otherPluginsPopup: c,
    mpaaSSavePopup: j,
    mpaaSErrorPopup: h,
    simpleWarning: simpleWarning,
    pauseQuiz: pauseQuiz,
  };
})();
