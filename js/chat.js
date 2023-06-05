let submitForm = document.querySelector('form')
let textInput = document.querySelector('textarea')
submitForm.addEventListener('submit', (e) => {
  e.preventDefault()
  console.log(textInput.value)
  createChatbox(true, textInput.value)
  createChatbox(false, "hello world")
  e.target.reset()
})

function createChatbox(isUser, message) {
  const chatBoxType = isUser ? 'user' : 'gpt'
  let answerTemplate = `<div class="${chatBoxType}-chat-box">
  <div class="sub-chat-box">
  <div class="chat-icon">
    <img class="chatgpt-icon" src="images/${chatBoxType}-icon.png" />
  </div>
  <div class="chat-txt">${message}</div>
</div>
</div>`

  document.querySelector('.chat-content-area').insertAdjacentHTML("beforeend", answerTemplate)
  console.log(document.querySelector('.chat-content-area'));

  let lastChild = document.querySelector('.chat-content-area').lastChild
  lastChild.scrollIntoView({block:"center"});
}
