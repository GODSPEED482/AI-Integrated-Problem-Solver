// Save the original send method
let p = window.location.href;
const originalSend = XMLHttpRequest.prototype.send;

// Use a MutationObserver to detect route changes or DOM updates
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === "childList" || mutation.type === "subtree") {
      p = window.location.href;
    }
  }
});

// Start observing the body for changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Override the send method
XMLHttpRequest.prototype.send = function (body) {
  // Check if the request URL matches
  if (
    p.startsWith("https://maang.in/problems/") &&
    this._url.startsWith("https://api2.maang.in/problems/user/")
  ) {
    console.log("Request matched:", this._url);

    // Add an event listener to log the response
    this.addEventListener("load", function () {
      console.log("Response for specific URL:", this.responseText);
    });
  }

  // Call the original send method
  return originalSend.apply(this, [body]);
};

// Save the original open method
const originalOpen = XMLHttpRequest.prototype.open;

// Override the open method to capture the request URL
XMLHttpRequest.prototype.open = function (method, url, ...rest) {
  this._url = url; // Store the URL for use in send
  return originalOpen.apply(this, [method, url, ...rest]);
};
