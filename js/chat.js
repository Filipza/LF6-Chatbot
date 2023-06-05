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

submitForm.addEventListener("submit", (e) => {
  e.preventDefault();
  createUserChatbox(textInput.value);
  checkInput(textInput.value);
  e.target.reset();
});

function checkInput(input) {
  const keywords = [...orderKeywords, ...helpKeywords, ...menuKeywords];
  for (const keyword of keywords) {
    console.log(input.toLowerCase().includes(keyword));
    if (input.toLowerCase().includes(keyword)) {
      if (orderKeywords.includes(keyword)) {
        createSupportChatbox(
          "Dir gehts also um Bestellungen, ja? Wähle eine der folgenden Themen",
          ["Bestellstatus überprüfen", "Retouren"]
        );
        return;
      } else if (helpKeywords.includes(keyword)) {
        createSupportChatbox("Wie können wir dir helfen?", [
          "FAQ",
          "Telefonservice",
        ]);
        return;
      } else if (menuKeywords.includes(keyword)) {
        createSupportChatbox("Wie kann ich dir behilflich sein?", [
          "Bestellungen",
          "Hilfe",
        ]);
        return "menu";
      }
    }
  }

  createSupportChatbox(
    "Leider konnte deine Anfrange nicht bearbeitet werden! Bei welchem Thema kann ich dir weiterhelfen?",
    ["Bestellungen/Retouren", "Allgemeine Hilfe/FAQ"]
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

function createSupportChatbox(message, pills) {
  // hide pills
  const supportChatBoxes = document.querySelectorAll(
    ".gpt-chat-box .chat-options"
  );
  supportChatBoxes.forEach((box) => {
    box.remove();
  });

  let pillsTemplate = "";
  if (pills.length > 0) {
    for (const pill of pills) {
      pillsTemplate += `<button class="option-btn p-1 me-2 btn btn-light">
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
}
