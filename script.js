
function readSaved(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
  
  }
}

const visitCount = Number(readSaved("tinyInternetVisits", 0)) + 1;

save("tinyInternetVisits", visitCount);

document.getElementById("visitor-count").textContent =
  String(visitCount).padStart(4, "0");


const defaultAlmosts = [
  "I wanted to tell you that I missed you.",
  "I wish we had taken one more photograph.",
  "I knew the answer, but I was afraid to say it.",
  "I hope you remember that afternoon, too.",
  "I almost asked you to stay a little longer.",
  "I wanted to say thank you, but the moment passed.",
  "I was happier than I knew how to explain.",
  "I wish I had listened for a little longer.",
  "I almost told you how much that meant to me.",
  "I had something to say, and then you smiled."
];

let contributedAlmosts = readSaved("tinyAlmosts", []);
if (!Array.isArray(contributedAlmosts)) contributedAlmosts = [];

let almostIndex = 0;
const almostText = document.getElementById("almost-text");
const exhibitNumber = document.querySelector(".exhibit-label");

function showAlmost() {
  const allAlmosts = [...defaultAlmosts, ...contributedAlmosts];

  almostIndex = Math.floor(Math.random() * allAlmosts.length);

  almostText.textContent = allAlmosts[almostIndex];
  exhibitNumber.textContent =
    "EXHIBIT NO. " + String(almostIndex + 1).padStart(3, "0");
}

document.getElementById("next-almost").addEventListener("click", () => {
  showAlmost();
});

document.getElementById("add-almost").addEventListener("click", () => {
  const input = document.getElementById("almost-input");
  const feedback = document.getElementById("museum-feedback");
  const sentence = input.value.trim();

  if (!sentence) {
    feedback.textContent = "Every exhibit needs a sentence.";
    return;
  }

  if (sentence.length < 4) {
    feedback.textContent = "Give your almost a few more words.";
    return;
  }

  if (contributedAlmosts.length >= 100) {
    feedback.textContent = "The museum is full for now.";
    return;
  }

  contributedAlmosts.push(sentence);
  save("tinyAlmosts", contributedAlmosts);

  almostText.textContent = sentence;
  exhibitNumber.textContent =
    "EXHIBIT NO. " +
    String(defaultAlmosts.length + contributedAlmosts.length)
      .padStart(3, "0");

  input.value = "";
  feedback.textContent = "Your exhibit has found a home.";
});

let leaves = Math.max(
  0,
  Math.min(100, Math.floor(Number(readSaved("tinyPlantLeaves", 0)) || 0))
);

const plant = document.getElementById("plant");
const leafCount = document.getElementById("leaf-count");
const plantMessage = document.getElementById("plant-message");

function renderPlant() {
  const leafElements = plant.querySelectorAll(".leaf");
  const flower = plant.querySelector(".plant-flower");

 
  leafElements.forEach((leaf, index) => {
    leaf.style.display = index < Math.min(leaves, 6) ? "block" : "none";
  });

  
  flower.style.display = leaves >= 7 ? "block" : "none";

 
  if (leaves === 0) {
    plantMessage.textContent = "A small beginning.";
  } else if (leaves < 3) {
    plantMessage.textContent = "Look. Something is happening.";
  } else if (leaves < 7) {
    plantMessage.textContent = "It likes having you around.";
  } else if (leaves < 20) {
    plantMessage.textContent = "A little garden of its own.";
  } else {
    plantMessage.textContent = "An unreasonable amount of growth.";
  }

  leafCount.textContent = leaves;
}

function growPlant() {
  if (leaves >= 100) {
    plantMessage.textContent = "This little plant has reached its limit.";
    return;
  }

  leaves++;
  save("tinyPlantLeaves", leaves);
  renderPlant();
}

document.getElementById("grow-plant").addEventListener("click", growPlant);


const gardenLink = document.querySelector('a[href="#garden"]');

gardenLink.addEventListener("click", () => {
  growPlant();
});


if (window.location.hash === "#garden") {
  growPlant();
}

renderPlant();


const complaints = {
  rain: {
    mood: "Currently: a little too damp.",
    response: "We acknowledge the excessive rain. Unfortunately, the sky has declined to cooperate."
  },
  heat: {
    mood: "Currently: sweating in several dimensions.",
    response: "Your sunshine complaint has been forwarded to the Sun. The Sun has marked it as read."
  },
  wind: {
    mood: "Currently: blowing things out of proportion.",
    response: "The wind denies all allegations. It was apparently somewhere else at the time."
  },
  monday: {
    mood: "Currently: emotionally overcast.",
    response: "We regret to inform you that Monday is a recurring event. Your disappointment has been documented."
  },
  existence: {
    mood: "Currently: existentially cloudy.",
    response: "We understand. Unfortunately, the universe has no customer service phone number."
  }
};

document.getElementById("file-complaint").addEventListener("click", () => {
  const type = document.getElementById("complaint-type").value;
  const complaint = complaints[type];

  document.getElementById("cloud-mood").textContent = complaint.mood;
  document.querySelector(".complaint-response > p").textContent =
    complaint.response;
});

let purchases = [];

const receiptItems = document.getElementById("receipt-items");
const receipt = document.getElementById("receipt");

function renderReceipt() {
  if (purchases.length === 0) {
    receiptItems.textContent = "You have acquired nothing.";
  } else {
    receiptItems.textContent =
      purchases.map((item, index) => `${index + 1}. ${item}`).join("\n");
  }

 
  receipt.querySelector(".receipt-total").textContent = "TOTAL: ₹0.00";
}

document.querySelectorAll(".buy-button").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.product;

    purchases.push(product);
    renderReceipt();

    button.textContent = "ACQUIRED ✓";

   
    window.setTimeout(() => {
      button.textContent = "ACQUIRE";
    }, 1000);
  });
});

document.getElementById("clear-cart").addEventListener("click", () => {
  purchases = [];
  renderReceipt();

  document.querySelectorAll(".buy-button").forEach((button) => {
    button.textContent = "ACQUIRE";
  });
});

renderReceipt();


const secretMessages = [
  "You pressed it. The button is now aware of you.",
  "Congratulations. Somewhere, a very small cloud blinked.",
  "Nothing happened. But you did it very confidently.",
  "You have been promoted to Assistant Vice President of Nothing.",
  "The universe has received your request and misplaced it.",
  "A tiny internet somewhere has just become slightly less tiny.",
  "You could have done anything. You chose this. Respect."
];

let secretPresses = 0;

document.getElementById("secret-button").addEventListener("click", () => {
  secretPresses++;

  const response = document.getElementById("secret-response");

  if (secretPresses >= 5) {
    response.textContent =
      "You have pressed the button five times. You may now return to your life.";
  } else {
    const message =
      secretMessages[Math.floor(Math.random() * secretMessages.length)];

    response.textContent = message;
  }
});

document.getElementById("secret-reset").addEventListener("click", () => {
  secretPresses = 0;
  document.getElementById("secret-response").textContent =
    "Everything has been un-undone. Nothing is back to normal.";
});
