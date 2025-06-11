var canvasTemplate = new (function () {
  function b() {
    return (
      '<div id="myModal" class="modal-wrapper"><div class="modal-contents"><span class="close text-right inline-block text-bold" id="closeModal">&times;</span><div id="title-logo" class="title-logo text-center"><img src=' +
      chrome.runtime.getURL("assets/logo.png") +
      ' alt="logo" /></div><div class="title-heading text-center _i18" data-i18="CHECK_SYS_MSG_1"></div><div class="data-info"><div class="w-85"><p class="_i18" data-i18="CHECK_SYS_MSG_2"></p><p class="_i18" data-i18="CHECK_SYS_MSG_3"></p><p class="_i18" data-i18="CHECK_SYS_MSG_4"></p></div><div class="w-15 text-center cam-icon"><img src=' +
      chrome.runtime.getURL("assets/camera.png") +
      ' alt="camera-image" id="camera-image"/></div></div><div class="info-section"><b class="_i18" data-i18="TEXT_NOTE"></b>: <span class="_i18" data-i18="CHECK_SYS_INST_MSG_1"></span></div><div class="action-section text-center"><button class="btn cancel _i18" data-i18="TEXT_CANCEL" id="close"></button><button class="btn btn-primary continue-btn _i18" data-i18="TEXT_CONTINUE" id="continue"></button></div></div></div>'
    );
  }
  function c() {
    return (
      '<div id="testModal" class="modal-wrapper"><div class="modal-contents"><div class="title-logo text-center"><img src=' +
      chrome.runtime.getURL("assets/logo.png") +
      ' alt="logo" id="logo-quiz"/></div><div class="title-heading text-center _i18" data-i18="START_QUIZ_MSG_1"></div><div class="chat-section text-center"><div class="chat-img"><img src=' +
      chrome.runtime.getURL("assets/chat2.png") +
      ' alt="chat-image" id="chat-image"/></div><p class="_i18" data-i18="START_QUIZ_MSG_2"></p></div><div class="action-section text-center"><button class="btn btn-primary continue-btn _i18" id="begin" data-i18="TEXT_BEGIN_QUIZ"></button></div></div></div>'
    );
  }
  function a() {
    return (
      '<div class="teacher-section bg-white text-center"><div class="title-logo text-center"><img src=' +
      chrome.runtime.getURL("assets/logo.png") +
      ' alt="logo"/></div><div class="main-section" id="mainSection"><div class="text-bold"><h3>RPaaS Plugin Installed Successfully</h3></div><div><div>'
    );
  }
  return {
    checkSystem: b,
    startProctor: c,
    pluginFound: a,
  };
})();
