/*var casper = require('casper').create({
    verbose: true,
    logLevel: "debug"
});*/

var casper = require('casper').create();
casper.options.clientScripts="jquery.min.js";


casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
})
casper.on( 'page.error', function (msg, trace) {
    this.echo( 'Error: ' + msg, 'ERROR' );
});
var fs = require('fs');
var numTimes = 91;
var count = 1;

function nextPage() {
	casper.evaluate(function(count) {
		alapage(count);
	},count);
	casper.waitForSelector("table",
		function pass () {
			 //this.capture("after"+count+".png");
			 this.page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js');
			 var results = this.evaluate(function(){
				var tables = jQuery('table');
				var table = tables[7];
				var row = "";
				jQuery(table).find('tr').each(function() {
					row = row + ($(this).find('td').map(function(i, element){return $(element).text()}).get().join("|")) +'\n';
				});
				return row;
			 });
			fs.write("output.txt", results, 'a');
			this.echo("OUTPUT:"+count);
			count = count + 1;
		},
		function fail () {
			test.fail("Did not load element table");
		}
	);
}


casper.start('http://www.sisfrance.net/Antilles/donnees_dates.asp', function() {
	this.page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js');
	var results = this.evaluate(function(){
		var tables = jQuery('table');
		var table = tables[7];
		return jQuery(table).find('th').map(function(i, element){return $(element).text().trim()}).get().join("|") +'\n';
		});
	fs.write("output.txt", results, 'w');
});

casper.then(nextPage);

casper.repeat(numTimes,function() {this.then(nextPage);});

casper.run();
