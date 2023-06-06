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
    ["Bestellungen/Retouren", "Allgemeine Hilfe/FAQ"]
    //LOG INFO
  );
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
  // create chatbox
  const template = `<div class="gpt-chat-box">
      <div class="sub-chat-box">
        <div class="chat-icon">
          <img class="chatgpt-icon" src="images/gpt-icon.png" />
        </div>
        <div class="chat-txt">
          ${message}
          <div class="chat-options d-flex mt-3">
            ${pillsTemplate}
          </div>
        </div>
      </div>
    </div>`;

  chatContentArea.insertAdjacentHTML("beforeend", template);
  chatContentArea.lastChild.scrollIntoView({ block: "center" });

  document.querySelectorAll(".option-btn").forEach((pill) => {
    pill.addEventListener("click", () => {
      const pillType = pill.getAttribute("data-type");
      createUserChatbox(pillType);
      pill.parentElement.remove();
      if (pillType == "Retouren" || pillType == "Bestellstatus überprüfen") {
        createSupportChatbox("Bitte gebe deine Bestellnummer ein.", []);
        currentPill = pillType;
      }
    });
  });
}

function formatDate(date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}
