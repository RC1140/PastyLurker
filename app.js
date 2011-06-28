var urlScraper = require('./urlscraper');
var fileScraper = require('./fileScraper');

//Startup continuous scraping of files and urls
urlScraper.scrapeArchive();
fileScraper.delayedScraper();
