// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require bootstrap-sprockets
//= require jquery_ujs
//= require turbolinks

//= require_tree .

$( document).ready( function () {
	console.log("ready!");

	var items = [];


	$("#generate-button").click( function() {
		console.log("menu button clicked");

		// Get the badges JSON database from the Team Treehouse web site.
		$.getJSON( "http://teamtreehouse.com/gaylenmiller2.json", function( data ) {
			profileShow( data['name'], data['badges'], data['points']);
  			// var items = [];
			// $.each( data, function( key, val ) { 
			// 	items.push( "<li id='" + key + "'>" + val + "</li>" );
  			// });
 
  			// $( "<ul/>", { "class": "my-new-list", html: items.join( "" ) }).appendTo( "body" );
		});
		console.log("ajax profile request sent");
	});

	// Function for doing the sort comparison for the badges sort.
	function compareCourseEarnedDate( item1, item2) {
		var result;
		if (item1.course.toLowerCase() < item2.course.toLowerCase() ) {
			result = -1; // negative is lower
		} else if (item1.course.toLowerCase() > item2.course.toLowerCase() ){
			result = 1; // positive is higher
		} else {
			return item1.earnedDate - item2.earnedDate;
		}
		return result;
	}

	function profileShow( name, badges, points) {
		console.log("ajax profile request received");

		// Show the profile name
		newText = name + ', ' + badges.length;
		$("#badges-info").text(newText);

		// Go through the badges and get a flat list with course name.
		$.each( badges, function( index, badge ) { 

			// Only record badges associated with courses.
			courses = badge['courses'];
			if (courses.length > 0) {
				var one = {};
				one.id = badge['id'];
				one.name = badge['name'];
				one.earnedDate = new Date(badge['earned_date']);
				one.course =  courses[0]['title'];
				items.push( one );
			}
  		});

  		// Sort the list by course and earned date.
  		items.sort( compareCourseEarnedDate);

  		var itemHtml = "";
		$.each( items, function( index, item ) { 
			// itemHtml += "<li id='" + item.id + "'>" + item.name + " &ndash; " + item.course + " " 
			//+ item.earnedDate + "</li>";
			itemHtml += "<tr id='" + item.id + "'><td>" + item.name + "</td><td>" + item.course + "</td><td>" 
			+ item.earnedDate.toLocaleDateString() + "</td></tr>";
		});
 
 		// Create an unordered list with class and html specified. Then append that to the body.
  		// $( "<ul/>", { "class": "my-new-list", html: itemHtml }).appendTo( "body" );
  		$( "<table>", { "class": "my-new-list", html: itemHtml }).appendTo( "body" );
	};

});