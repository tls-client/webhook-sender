function sendWebhook(event) {
  event.preventDefault();
  
  const webhookUrl = document.getElementById("webhookUrl").value;
  const username = document.getElementById("username").value;
  const avatarUrl = document.getElementById("avatar-url").value;
  const interval = document.getElementById("interval").value || 1000;
  const times = document.getElementById("times").value || 1;
  const message = document.getElementById("message").value;
  const fileInput = document.getElementById("file");
  const option = document.getElementById("option").value;

  if (!webhookUrl || !interval || !times) {
    alert("Missing parameters.");
    return;
  }

  if (!message && fileInput.files.length == 0) {
    alert("Missing parameters.");
    return;
  }

// Log container
const logsContainer = document.getElementById('logs');

// Function to append log messages
function logMessage(message) {
    const timestamp = new Date().toLocaleTimeString();
    logsContainer.textContent += `[${timestamp}] ${message}\n`;
    logsContainer.scrollTop = logsContainer.scrollHeight; // Scroll to the bottom
}

  for (let i = 0; i < times; i++) {
    const modifiedMessage = applyOption(message, option);
    const payload = {
      content: modifiedMessage,
      username: username || "Default Bot",
      avatar_url: avatarUrl || "",
    };
    const formData = new FormData();
    formData.append("payload_json", JSON.stringify(payload));
    if (fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);
    }
    
    setTimeout(() => {
      fetch(webhookUrl, {
        method: "POST",
        body: formData
      }).then(response => {
        logMessage("Message sent successfully!");
      }).catch(error => {
        logMessage("Error sending message:", error);
      });
    }, interval);
  }
  alert(`Sent ${times} messages by ${webhookUrl}!`);
}

function applyOption(message, option) {
  switch (option) {
    case "Add random string at the top":
      return addRandomStringAtTop(message);
    case "Add random string at the end":
      return addRandomStringAtEnd(message);
    default:
      return message;
  }
}

function addRandomStringAtTop(message) {
  const randomString = generateRandomString();
  return `${randomString}\n\n${message}`;
}

function addRandomStringAtEnd(message) {
  const randomString = generateRandomString();
  return `${message}\n\n${randomString}`;
}

function generateRandomString() {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";
  for (let i = 0; i < 15; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

function clearFile() {
  const fileInput = document.getElementById("file");
  fileInput.value = null;
}
