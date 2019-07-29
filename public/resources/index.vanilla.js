let $chatWindow = document.getElementById('messages');

let chatClient;
let generalChannel;
let username;

function print(infoMessage, asHtml) {
  let $msg = document.querySelector('div.info');
  if(asHtml) $msg.innerHTML = infoMessage;
  else $msg.innerText = infoMessage;
  $chatWindow.appendChild($msg);
}

function printMessage(fromUser, message) {
  let user =
}
