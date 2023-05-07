chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action == "sendComment") {
      (async () => {
        const payload = await updateText(request.comment, request.selectors);
        sendResponse({ status: payload });
      })();
      return true;
    }
  }
);

async function updateText(text, selectors) {
  document.querySelector(selectors.commentButton).click();

  //wait for text mode button to be displayed
  let textModeButton = await waitForElm(selectors.textModeButton);
  if(!textModeButton.getAttribute("class").includes("aui-nav-selected")) {
    textModeButton.click();
  }

  //wait for comment textarea to be displayed
  let commentField = await waitForElm(selectors.commentField);
  commentField.value = text;

  document.querySelector(selectors.visualModeButton).click();

  return "Text updated!";
}


async function waitForElm(selector) {
  return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
              resolve(document.querySelector(selector));
              observer.disconnect();
          }
      });

      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}