let $chatWindow = document.getElementById('messages');
let chatClient;
let thisChannel;
let username;
let channelName;

function print(infoMessage, asHtml) {
  let $msg = document.createElement('div');
  $msg.classList.add('info');
  if(asHtml) $msg.innerHTML = infoMessage;
  else $msg.innerText = infoMessage;
  $chatWindow.appendChild($msg);
}

function printMessage(fromUser, message) {
  // let $user = document.createElement('span');
  // $user.classList.add('username');
  // $user.innerText = `${fromUser} : `;
  let $message = document.createElement('span');
  $message.classList.add('message');
  $message.innerText = message;
  let $container = document.createElement('div');
  if(fromUser === username) $container.classList.add( 'me');
  $container.classList.add('message-container');
  // $container.appendChild($user)
  $container.appendChild($message);
  $chatWindow.appendChild($container);
  $chatWindow.scrollTo(0, $chatWindow.scrollHeight);
}

function startChat() {
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
}

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
    + '<span class="my-name">' + username + '</span>.', true);
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

// hide chat
let $wholeChat = document.querySelector('section.chat-box-wrapper');
let isChatActive = false;
let isInit = true;
$wholeChat.addEventListener('click', (event) => {
  event.stopPropagation();
  if(event.target == $wholeChat && isChatActive) {
    $wholeChat.classList.remove('active');
    isChatActive = false;
    // totally remove the element so everything else can be clickable
    setTimeout(() => {
      $wholeChat.style.display = 'none';
    }, 360);
  }
})

let $chatButton = document.querySelector('div.chat-button');
$chatButton.addEventListener('click', (event) => {
  if(!isChatActive) {
    $wholeChat.style.display = 'flex';
    // delay a bit so it has a transition and not so instant
    setTimeout(() => {
      $wholeChat.classList.add('active');
      if(isInit) {
        startChat();
        isInit = false;
      }
    }, 1)
    isChatActive = true;
  }
})


// carousel scripts
let image_src = ['/images/image_5.jpg', '/images/image_6.jpg', '/images/image_10.jpg', '/images/image_11.png'];

let current = 0;
setInterval(()=> {
  changeImage(current);
  current = (current+1) % image_src.length;
}, 4000);

let $image_div = document.querySelector('div.image');

// TODO: need to add transitions
function changeImage(i) {
  let image = image_src[i];
  $image_div.style.backgroundImage = `url(${image})`;
  current = i;
}

let $dots = document.querySelectorAll('div.dot');
$dots.forEach((dot, i) => {
  dot.addEventListener('click', (event) => {
    // let image = image_src[i];
    changeImage(i);
  });
})
