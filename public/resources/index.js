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

function printMessage(fromUser, message) {;
  let $message = document.createElement('span');
  $message.classList.add('message');
  $message.innerText = message;
  let $container = document.createElement('div');
  if(fromUser === username) $container.classList.add( 'me');
  $container.classList.add('message-container');
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
      chatClient = client;
      chatClient.getSubscribedChannels()
      .then(createOrJoinNewChannel)
      username = data.identity;
      channelName = `${username}-${(new Date()).getTime()}`;
    })
  })
}

// might be bad to create a bunch of channels everytime it refreshes (should probably save the data and restore it (save data like username and channel name))
function createOrJoinNewChannel() {
  chatClient.getChannelByUniqueName(channelName)
  .then((channel) => {
    thisChannel = channel;
    setupChannel();
  })
  .catch(() => {
    // If it doesn't exist, let's create it
    chatClient.createChannel({
      uniqueName: channelName,
      friendlyName: `${username} - unique channel for bot`
    })
    .then((channel) => {
      thisChannel = channel;
      setupChannel();
    })
    .catch((channel) => {
      print('Channel could not be created')
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
    // add a delay for responce so it seems more genuine
    setTimeout(() => {
      chatBotResponce(message.body);
    }, Math.random() * 1200);
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
const responces = {
  "scoops ahoy": "Scoops ahoy!",
  "where are you located/found?": "Starcourt mall, Hawkins Indiana",
  "what do you think about kids?": [
    "Turns out I'm a pretty damn good babysitter.",
    "Man, kids are the worst! Who needs 'em, anyway?"
  ]
}

function formatVenues(venuesList) {
  if(venuesList.length === 0){
    return 'Did not find any. Try another zip code.'
  }
  let output = `Found ${venuesList.length} results:\n\n`;
  venuesList.forEach((venue) => {
    output += `${venue.name}\n${venue.location.address} ${venue.location.crossStreet || ''}\n\n`;
  });
  return output;
}

function chatBotResponce(message) {
  message = message.toLowerCase();
  let res = responces[message];
  if(res) {
    if(typeof res === 'object')  return printMessage('bot', res[Math.floor(Math.random() * res.length)]);
    return printMessage('bot', res);
  }
  let question = message.toLowerCase().split('is there ice cream in ');
  // if it match then it should have 2 results in the array
  if(question.length > 1) {
    let zipcode = question[1];
    fetch(`/foursquare?zipcode=${zipcode}`)
    .then((data) => data.json())
    .then((results) => {
      return printMessage('bot', formatVenues(results.venues));
    })
    .catch((e) => {
      return printMessage('bot', "Yeah, that's a no.")
    })
  }
  else return printMessage('bot', "Yeah, that's a no.")
}

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

// show chat
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
    changeImage(i);
  });
})
