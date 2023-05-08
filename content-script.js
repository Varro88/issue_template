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
  if (document.querySelector(selectors.newIssuePopupTitle) != null || window.location.href.toLowerCase().includes("createissue")) {
    //new issue form
    let index = document.querySelectorAll(selectors.textModeButton).length - 1;
    let textModeButton = document.querySelectorAll(selectors.textModeButton)[index];
    let visualModeButton = document.querySelectorAll(selectors.visualModeButton)[index];
    if(textModeButton.getAttribute("aria-pressed") == "false") {
      textModeButton.click();
    }
    document.querySelector(selectors.descriptionField).value = text;
    visualModeButton.click();
  }
  else {
    //comment form
    if(document.querySelector(selectors.commentButton)) {
      document.querySelector(selectors.commentButton).click();
    }

    //wait for text mode button to be displayed
    let textModeButton = await waitForElm(selectors.textModeButton);
    if(textModeButton.getAttribute("aria-pressed") == "false") {
      textModeButton.click();
    }

    //wait for comment textarea to be displayed
    let commentField = await waitForElm(selectors.commentField);
    commentField.value = text;
    document.querySelector(selectors.visualModeButton).click();
  }
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

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
}