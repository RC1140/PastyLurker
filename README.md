# PastyLurker

PastyLurker is still in ALPHA at the moment , expect alot
of changes to come.

PastyLurker is a smallish bot that will monitor pastebin
for newposts. As it sees them it will record it to a DB
and then run a bunch of watches that you can setup and
notify you if anything in the watch triggers.

## Requirements:
* * *

1) node
2) npm
3) mongo

Setup:

1) npm install
2) Extract node-nofio-1.1.tgz to node_modules/
3) Update the settings file and fill in all blank options

Note : The twitterTokenGenerator.js has its own requirements.
run the following commands if you want to use the twitter intergration.

     npm install oauth
     npm install colors
     npm install step

Finally start the app by calling node app.js 
