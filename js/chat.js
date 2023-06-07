// Import Typewriter and constants
import Typewriter from "typewriter-effect/dist/core";
import { faqText } from "./constants";

// Get DOM elements
const submitForm = document.querySelector("form");
const textInput = document.querySelector("textarea");
const chatContentArea = document.querySelector(".chat-content-area");

// Keywords for different chat options
const orderKeywords = [
  "bestellungen",
  "retouren",
  "retoure",
  "bestellung",
  "zurückschicken",
];
const helpKeywords = ["hilfe", "kontakt", "anrufen"];
const menuKeywords = ["home", "menü", "anfang"];

// Current selected pill
let currentPill;

// Create first chat message
function showWelcomeMessage() {
  new Typewriter(`.chat-txt`, {
    strings: `Herzlich willkommen zum Solutions IT Support! Ich bin dein
    persönlicher Service-Assistent in Sachen Bestellungen, Retouren und allgemeine Serviceanfragen.
    <br />
    <br />
    Wie kann ich dir behilflich sein?`,
    autoStart: true,
    delay: 5,
  }).callFunction(() => {
    document.querySelector(".Typewriter__cursor").remove();
  });
}

// Show welcome message on page load
showWelcomeMessage();

// Handle form submission
submitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  createUserChatbox(textInput.value);
  checkInput(textInput.value);
  e.target.reset();
});

// Check user input and create appropriate chatbox
async function checkInput(input) {
  // Check for order ID
  const regex = /^DE\d{5}$/;
  if (input.match(regex)) {
    const request = await fetch(
      `http://localhost:3000/orders?orderId=${input}`
    );
    let response = await request.json();
    if (response.result.length > 0) {
      response = response.result[0];
      if (currentPill === "Bestellstatus überprüfen") {
        createSupportChatbox(
          `Bestellnummer: ${response.orderId} <br> Bestellt am: ${formatDate(
            response.createdAt
          )} <br> Versendet am: ${formatDate(response.sentAt)} <br> Status: ${
            response.orderState
          } <br> Returniert: ${response.isReturned ? "Ja" : "Nein"}`
        );
        return;
      } else if (currentPill === "Retouren") {
        fetch(`http://localhost:3000/returnorders?orderId=${input}`);
        createSupportChatbox(
          `Die Bestellung mit der Bestellnummer: ${input} wurde erfolgreich storniert!`
        );
        return;
      }
    } else {
      createSupportChatbox(
        `Leider konnten wir die Bestellnummer ${input} nicht finden.`
      );
    }
  }

  // Check for keywords
  const keywords = [...orderKeywords, ...helpKeywords, ...menuKeywords];
  for (const keyword of keywords) {
    if (input.toLowerCase().includes(keyword)) {
      if (orderKeywords.includes(keyword)) {
        createSupportChatbox(
          "Dir gehts also um Bestellungen, ja? Wähle eine der folgenden Themen",
          ["Bestellstatus überprüfen", "Retouren"]
        );
        currentPill = "";
        return;
      } else if (helpKeywords.includes(keyword)) {
        createSupportChatbox("Wie können wir dir helfen?", [
          "FAQ",
          "Telefonservice",
        ]);
        currentPill = "";
        return;
      } else if (menuKeywords.includes(keyword)) {
        createSupportChatbox("Wie kann ich dir behilflich sein?", [
          "Bestellungen",
          "Hilfe",
        ]);
        currentPill = "";
        return "menu";
      }
    }
  }

  // Default response
  createSupportChatbox(
    "Leider konnte deine Anfrange nicht bearbeitet werden! Bei welchem Thema kann ich dir weiterhelfen?",
    ["Bestellstatus überprüfen", "Allgemeine Hilfe/FAQ"]
  );
  fetch(`http://localhost:3000/failedconversations?msg=${input}`);
}

// Create chatbox for user message
function createUserChatbox(message) {
  const template = `<div class="user-chat-box">
    <div class="sub-chat-box">
      <div class="chat-icon">
        <img class="chatgpt-icon" src="images/user-icon.png" />
      </div>
      <div class="chat-txt">${message}</div>
    </div>
  </div>`;

  chatContentArea.insertAdjacentHTML("beforeend", template);
  chatContentArea.lastChild.scrollIntoView({ block: "center" });
}

// Create chatbox for support message
function createSupportChatbox(message, pills = []) {
  // Hide pills
  document
    .querySelectorAll(".gpt-chat-box .chat-options")
    .forEach((box) => box.remove());

  // Create pills template
  let pillsTemplate = "";
  if (pills.length > 0) {
    for (const pill of pills) {
      pillsTemplate += `<button class="option-btn p-1 me-2 btn btn-light" data-type="${pill}">
        ${pill}
      </button>`;
    }
  }

  // Create chatbox template
  const timestamp = new Date().getMilliseconds();
  const template = `<div class="gpt-chat-box">
      <div class="sub-chat-box">
        <div class="chat-icon">
          <img class="chatgpt-icon" src="images/gpt-icon.png" />
        </div>
        <div class="chat-txt" id="typewriter-${timestamp}">

        </div>
      </div>
    </div>`;

  // Insert chatbox into DOM
  chatContentArea.insertAdjacentHTML("beforeend", template);
  chatContentArea.lastChild.scrollIntoView({ block: "center" });

  // Add message to chatbox using Typewriter
  new Typewriter(`#typewriter-${timestamp}`, {
    strings: message,
    autoStart: true,
    delay: 5,
  }).callFunction(() => {
    document.querySelector(".Typewriter__cursor").remove();
    // Add pills to chatbox
    chatContentArea.lastChild
      .querySelector(".chat-txt")
      .insertAdjacentHTML(
        "beforeend",
        `<div class="chat-options d-flex mt-3">${pillsTemplate}</div>`
      );
    // Add event listeners to pills
    document.querySelectorAll(".option-btn").forEach((pill) => {
      pill.addEventListener("click", () => {
        const pillType = pill.getAttribute("data-type");
        createUserChatbox(pillType);
        pill.parentElement.remove();
        // check selected pill and give fitting response
        if (pillType == "Retouren" || pillType == "Bestellstatus überprüfen") {
          createSupportChatbox("Bitte gebe deine Bestellnummer ein.", []);
          currentPill = pillType;
        } else if (pillType === "FAQ") {
          createSupportChatbox(faqText);
        } else if (pillType === "Telefonservice") {
          createSupportChatbox(
            "Du kannst uns telefonisch kontaktieren Mo-Fr von 8:00 bis 12:00 Uhr unter der folgenden Nummer:  <a href='tel:+499123456789'>09123 456789</a>"
          );
        } else if (pillType === "Allgemeine Hilfe/FAQ") {
          createSupportChatbox("Wie können wir dir helfen?", [
            "FAQ",
            "Telefonservice",
          ]);
        }
      });
    });
  });
}

// Reload page on reset button click
document
  .querySelector(".reset-btn")
  .addEventListener("click", () => window.location.reload());

// Format date for display
function formatDate(date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}
