var urlScraper = require('./urlscraper');
var fileScraper = require('./fileScraper');
var dbMan = require('./dbManager');
var config = require('./settings');
var ircMan = require('./ircManager');

//Startup continuous scraping of files and urls
urlScraper.scrapeArchive(true,ircMan.client);
fileScraper.delayedScraper(true,ircMan.client);
