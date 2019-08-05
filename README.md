# ScoopsAhoyChatBot
[![Build Status](https://travis-ci.com/josuerojasrojas/ScoopsAhoyChatBot.svg?branch=master)](https://travis-ci.com/josuerojasrojas/ScoopsAhoyChatBot)

Live Link: https://scoopsahoy.herokuapp.com

### Tech used
- Express
- Twilio Chat API
- FourSquare Places API
- SASS
- Heroku

### Installation
Clone this repo, then install all packages, and finally setup .env
```bash
git clone https://github.com/josuerojasrojas/ScoopsAhoyChatBot.git
cd ScoopsAhoyChatBot
npm install
cp .env.example .env
```

Open .env in your favorite text editor and configure the following values.

| Config Value  | Description |
| :-------------  |:------------- |
`TWILIO_ACCOUNT_SID` | Your primary Twilio account identifier - find this [in the console here](https://www.twilio.com/console).
`TWILIO_API_KEY` | Used to authenticate - [generate one here](https://www.twilio.com/console/dev-tools/api-keys).
`TWILIO_API_SECRET` | Used to authenticate - [just like the above, you'll get one here](https://www.twilio.com/console/dev-tools/api-keys).
`client_id` | FourSquare api id - [Places API](https://developer.foursquare.com/docs/api)
`client_secret` | FourSquare api secret - [Places API](https://developer.foursquare.com/docs/api)

## Run/Dev
To run in dev, this will build the sass and run nodemon with sass watcher
```bash
npm run start-dev
```

To just run without building just do npm start in the project folder
```bash
npm start
```
Note: this will not build sass, which is needed for the front end (you can run ```npm run sass-build``` before to prevent errors)
