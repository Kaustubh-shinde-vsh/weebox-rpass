var bbTemplate = new (function () {
  function b() {
    return (
      '<div id="myModal" class="student-modal"><div class="modal-contents bg-white student-modal-content p-3"><span class="closeModal" id="closeModal">&times;</span><div id="title-logo" class="title-logo text-center mt-0"><img src=' +
      chrome.runtime.getURL("assets/logo.png") +
      ' alt="logo" /></div><div class="title-heading text-center mettl-text _i18" data-i18="CHECK_SYS_MSG_1"></div><div class="data-info"><div class="w-85"><p class="mettl-text _i18" data-i18="CHECK_SYS_MSG_2"></p><p class="mettl-text _i18" data-i18="CHECK_SYS_MSG_3"></p><p class="mettl-text _i18" data-i18="CHECK_SYS_MSG_4"></p></div><div class="w-15 text-center cam-icon"><img src=' +
      chrome.runtime.getURL("assets/camera.PNG") +
      ' alt="camera image" /></div></div><div class="info-section mettl-text"><b class="_i18" data-i18="TEXT_NOTE"></b>: <span class="_i18" data-i18="CHECK_SYS_INST_MSG_1"></span></div><div class="action-section text-center"><button class="btn cancel _i18" data-i18="TEXT_CANCEL" id="close"></button><button class="btn btn-primary continue-btn _i18" data-i18="TEXT_CONTINUE" id="continue"></button></div></div></div>'
    );
  }
  function a() {
    return (
      '<div id="testModal" class="student-modal"><div class="modal-contents bg-white student-modal-content p-3"><div class="title-logo text-center"><img src=' +
      chrome.runtime.getURL("assets/logo.png") +
      ' alt="logo" /></div><div class="title-heading text-center mettl-text _i18" data-i18="START_QUIZ_MSG_1"></div><div class="chat-section text-center"><div class="chat-img"><img src=' +
      chrome.runtime.getURL("assets/chat2.png") +
      ' alt="chat-image" id="chat-image" /></div><p class="mettl-text _i18" data-i18="START_QUIZ_MSG_2"></p></div><div class="action-section text-center"><button class="btn btn-primary continue-btn _i18" id="begin" data-i18="TEXT_BEGIN_QUIZ"></button></div></div></div>'
    );
  }
  return {
    bbCheckSystem: b,
    bbStartProctor: a,
  };
})();
