import Typewriter from 'typewriter-effect/dist/core';
import { faqText } from './constants';

const submitForm = document.querySelector("form");
const textInput = document.querySelector("textarea");
const chatContentArea = document.querySelector(".chat-content-area");
const orderKeywords = [
  "bestellungen",
  "retouren",
  "retoure",
  "bestellung",
  "zurückschicken",
];
const helpKeywords = ["hilfe", "kontakt", "anrufen"];
const menuKeywords = ["home", "menü", "anfang"];
let currentPill;


// create first chat message
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

submitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  createUserChatbox(textInput.value);
  checkInput(textInput.value);
  e.target.reset();
});

async function checkInput(input) {
  // check for order id
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

  createSupportChatbox(
    "Leider konnte deine Anfrange nicht bearbeitet werden! Bei welchem Thema kann ich dir weiterhelfen?",
    ["Bestellstatus überprüfen", "Allgemeine Hilfe/FAQ"]
  );
  fetch(`http://localhost:3000/failedconversations?msg=${input}`);
}

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

function createSupportChatbox(message, pills = []) {
  // hide pills
  document
    .querySelectorAll(".gpt-chat-box .chat-options")
    .forEach((box) => box.remove());

  let pillsTemplate = "";
  if (pills.length > 0) {
    for (const pill of pills) {
      pillsTemplate += `<button class="option-btn p-1 me-2 btn btn-light" data-type="${pill}">
        ${pill}
      </button>`;
    }
  }
  const timestamp = new Date().getMilliseconds();
  // create chatbox
  const template = `<div class="gpt-chat-box">
      <div class="sub-chat-box">
        <div class="chat-icon">
          <img class="chatgpt-icon" src="images/gpt-icon.png" />
        </div>
        <div class="chat-txt" id="typewriter-${timestamp}">

        </div>
      </div>
    </div>`;

  chatContentArea.insertAdjacentHTML("beforeend", template);
  chatContentArea.lastChild.scrollIntoView({ block: "center" });

  new Typewriter(`#typewriter-${timestamp}`, {
    strings: message,
    autoStart: true,
    delay: 5,
  }).callFunction(() => {
    document.querySelector(".Typewriter__cursor").remove();
    chatContentArea.lastChild.querySelector(".chat-txt").insertAdjacentHTML("beforeend", `<div class="chat-options d-flex mt-3">${pillsTemplate}</div>`);
    document.querySelectorAll(".option-btn").forEach((pill) => {
      pill.addEventListener("click", () => {
        const pillType = pill.getAttribute("data-type");
        createUserChatbox(pillType);
        pill.parentElement.remove();
        if (pillType == "Retouren" || pillType == "Bestellstatus überprüfen") {
          createSupportChatbox("Bitte gebe deine Bestellnummer ein.", []);
          currentPill = pillType;
        } else if (pillType === "FAQ") {
          createSupportChatbox(faqText);
        } else if (pillType === "Telefonservice") {
          createSupportChatbox("Du kannst uns telefonisch kontaktieren Mo-Fr von 8:00 bis 12:00 Uhr unter der folgenden Nummer:  <a href='tel:+499123456789'>09123 456789</a>");
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

function formatDate(date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}
