let $chatWindow = document.getElementById('messages');
let chatClient;
let thisChannel;
let username;
let channelName;

function print(infoMessage, asHtml) {
  let $msg = document.createElement('div');
  $msg.setAttribute('class', 'info');
  if(asHtml) $msg.innerHTML = infoMessage;
  else $msg.innerText = infoMessage;
  $chatWindow.appendChild($msg);
}

function printMessage(fromUser, message) {
  let $user = document.createElement('span');
  $user.setAttribute('class', 'username');
  $user.innerText = `${fromUser} : `;
  if(fromUser === username) $user.setAttribute('class', 'me');
  let $message = document.createElement('span');
  $message.setAttribute('class', 'message');
  $message.innerText = message;
  let $container = document.createElement('div');
  $container.setAttribute('class', 'message-container');
  $container.appendChild($user).appendChild($message);
  $chatWindow.appendChild($container);
  $chatWindow.scrollTo(0, 0);
}

fetch('/token', { device: 'browser' })
.then( res => res.json())
.then( data => {
  Twilio.Chat.Client.create(data.token)
  .then(client => {
    console.log('Created chat client');
    chatClient = client;
    console.log('client', client);
    chatClient.getSubscribedChannels()
    .then(createOrJoinNewChannel)
    username = data.identity;
    channelName = `${username}-${(new Date()).getTime()}`;
  })
})

// might be bad to create a bunch of channels everytime it refreshes (should probably save the data and restore it (save data like username and channel name))
function createOrJoinNewChannel() {
  console.log('creating new channel');
  chatClient.getChannelByUniqueName(channelName)
  .then((channel) => {
    thisChannel = channel;
    console.log('Found user\'s unique channel:');
    console.log(generalChannel);
    setupChannel();
  })
  .catch(() => {
    // If it doesn't exist, let's create it
    console.log('Creating general channel');
    chatClient.createChannel({
      uniqueName: channelName,
      friendlyName: `${username} - unique channel for bot`
    })
    .then((channel) => {
      console.log('Created new unique channel');
      thisChannel = channel;
      setupChannel();
    })
    .catch((channel) => {
      console.log('Channel could not be created');
      console.log(channel);
    })
  });
}

// Set up channel after it has been found
function setupChannel() {
  thisChannel.join().then((channel) => {
    print('Joined channel as '
    + '<span class="me">' + username + '</span>.', true);
  });
  // Listen for new messages sent to the channel
  thisChannel.on('messageAdded', function(message) {
    printMessage(message.author, message.body);
  });
}

let input = document.getElementById('chat-input')
input.addEventListener('keydown', (event) =>{
  if(event.keyCode == 13) {
    if(thisChannel == undefined){
      print('The Chat Service is not configured. Please check your .env file.', false);
      return;
    }
    thisChannel.sendMessage(input.value);
    input.value = '';
  }
})
