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

	var profileName;
	var badges = [];
	var badgesLoaded = false;
	var courses = [];
	var coursesLoaded = false;
	var tracks = [];
	var tracksLoaded = false;
	var tracksWithProgress = [];
	var profilePoints;


	$("#generate-button").click( function() {
		console.log("generate button clicked");

		var profileUrl = $("#profile-url").val();
		profileUrl = "http://teamtreehouse.com/" + profileUrl + ".json" 
		console.log( "requesting " + profileUrl)

		// Get the badges JSON database from the Team Treehouse web site.
		$.getJSON( profileUrl, function( data ) {
			badgesLoad( data['name'], data['badges'], data['points']);
  			// var items = [];
			// $.each( data, function( key, val ) { 
			// 	items.push( "<li id='" + key + "'>" + val + "</li>" );
  			// });
 
  			// $( "<ul/>", { "class": "my-new-list", html: items.join( "" ) }).appendTo( "body" );
		});
		console.log("ajax profile request sent");

		// Get the courses from the web site.
		$.getJSON( "/courses.json", coursesLoad );
		console.log("ajax courses request sent");

		// Get the tracks from the web site.
		$.getJSON("/tracks.json", tracksLoad );
		console.log("ajax tracks request sent")
	});
	// --------------------------------------------------------------------------------


	// Function for doing the sort comparison for the badges sort.
	function compareCourseEarnedDate( item1, item2) {
		var result;
		if (item1.courseName.toLowerCase() < item2.courseName.toLowerCase() ) {
			result = -1; // negative is lower
		} else if (item1.courseName.toLowerCase() > item2.courseName.toLowerCase() ){
			result = 1; // positive is higher
		} else {
			return item1.earnedDate - item2.earnedDate;
		}
		return result;
	}
	// --------------------------------------------------------------------------------


	// Load the badges into the array.
	function badgesLoad( name, items, points) {
		console.log("ajax profile response received");
		profileName = name;
		profilePoints = points;

		// Go through the badges and get a flat list with course name.
		$.each( items, function( index, oneBadge ) { 

			// Only record badges associated with courses.
			badgeCourses = oneBadge['courses'];
			if (badgeCourses.length > 0) {
				var one = {};
				one.id = oneBadge['id'];
				one.name = oneBadge['name'];
				one.earnedDate = new Date(oneBadge['earned_date']);
				one.courseName =  badgeCourses[0]['title'];
				badges.push( one );
			}
  		});

  		// Sort the list by course and earned date.
  		badges.sort( compareCourseEarnedDate);
  		badgesLoaded = true;

		// Call the function to display the status and trigger the transcript when ready.
  		checkStatusShow();
	};
	// --------------------------------------------------------------------------------


	// Call the transcript show function once all the data loads are complete.
	function checkStatusShow() {

		// If all the json requests are complete.
		if ( badgesLoaded && coursesLoaded && tracksLoaded) {
			courseProgressTally();
			trackProgressTally();
			transcriptShow();
		}
	}
	// --------------------------------------------------------------------------------


	// Show the transcript.
	function transcriptShow() {

		// Show the profile name
		newText = profileName + ', ' + badges.length;
		$("#profile-header-name").text(newText);

		// Create a long string with the courses in table row html.
		coursesHtml = "<table class='table table-striped'>"
		+ "<tr><th>Course Name</th><th>Progress</th><th>Last Activity On</th></tr>";
		for( var offset = 0; offset < courses.length; offset++) {

			// If there are any stages completed, include the course.
			if (courses[offset].completed > 0) {
				coursesHtml += "<tr><td>" + courses[offset].courseName + "</td><td>" + courses[offset].completed + " of " 
				+ courses[offset].stageCount + "</td><td>" 
				+ courses[offset].earnedDate.toLocaleDateString() + "</td></tr>";
			}
		}
		$("#courses-div").html( coursesHtml + "</table>");
		// $( "<table>", { "class": "table table-striped", html: coursesHtml }).appendTo( "body" );

		// Load the badge information into table rows.
  		var itemHtml = "";
		$.each( badges, function( index, item ) { 
			itemHtml += "<tr id='" + item.id + "'><td>" + item.name + "</td><td>" + item.courseName + "</td><td>" 
			+ item.earnedDate.toLocaleDateString() + "</td></tr>";
		});
 
 		// Create an unordered list with class and html specified. Then append that to the body.
  		// $( "<ul/>", { "class": "my-new-list", html: itemHtml }).appendTo( "body" );

  		// Create a table and 
  		$( "<table>", { "class": "table table-striped", html: itemHtml }).appendTo( "body" );
	}
	// --------------------------------------------------------------------------------


	function coursesLoad( coursesJson) {
		console.log("ajax courses response received");

		// Get the needed columns and push that object on the array.
		$.each( coursesJson, function( index, course) {
			one = {};
			one.courseName = course.course_name;
			one.stageCount = course.stage_count;
			one.completed = 0;
			one.earnedDate = new Date(1900,0,1);

			courses.push( one );
		});

		// Mark the course load as complete.
		coursesLoaded = true;

		// Call the function to display the status and trigger the transcript when ready.
		checkStatusShow();
	}
	// --------------------------------------------------------------------------------


	function courseProgressTally() {

		// Go through the badges and record the number of stages completed.
		var courseOffset = 0;
		for (var offset = 0; offset < badges.length; offset++) {

			// If the current course if before the current badge course, roll forward.
			while ( courses[courseOffset].courseName.toLowerCase() < badges[offset].courseName.toLowerCase() ) {
				courseOffset++;
			}

			// If this badge is part of the current course increment the completed count.
			if ( courses[courseOffset].courseName == badges[offset].courseName) {
				courses[courseOffset].completed += 1;

				// Save the latest earned date as the courses earned date.
				if ( courses[courseOffset].earnedDate < badges[offset].earnedDate) {
					courses[courseOffset].earnedDate = badges[offset].earnedDate;
				}
			}
		}
		console.log("Course Progress Tally complete");
	}
	// --------------------------------------------------------------------------------


	function tracksLoad( tracksJson) {
		console.log("ajax tracks response received");

		// Get the needed columns and push that object on the array.
		$.each( tracksJson, function( index, track) {
			one = {};
			one.courseName = track.course_name;
			one.trackName = track.track_name;
			one.courseOrder = track.course_order;
			one.completed = 0;
			one.earnedDate = new Date(1900,0,1);

			tracks.push( one );
		});

		// Mark the course load as complete.
		tracksLoaded = true;

		// Call the function to display the status and trigger the transcript when ready.
		checkStatusShow();
	}
	// --------------------------------------------------------------------------------


	// Return true if a course is completed.
	function courseFind( courseName ) {
		return -1;
	}
	// --------------------------------------------------------------------------------


	// Go through all the tracks and build a list of tracks started and how many courses are completed.
	function trackProgressTally() {

		var coursesInTrack = 0;
		var currentTrack = "";

		// go through the task courses
		for (var offset = 0; offset < tracks.length; offset++) {

			// If this is a new track
			if ( tracks[offset].trackName !== currentTrack) {

				// If there was a previous task
				if (currentTrack !== "") {

					// Were any of the courses for this track completed?
					if ( trackCoursesCompleted > 0) {

						// Insert a row into tracks array with completed and course count.
						one = {};
						one.trackName = currentTrack;
						one.coursesCompleted = trackCoursesCompleted;
						one.courseInTrack = coursesInTrack;
						one.earnedDate = lastEarnedDate;
						tracksWithProgress.push( one);
					}
				}

				// Save the current track and reset the completed count to zero.
				currentTrack = tracks[offset].trackName;
				coursesInTrack = 0;
				trackCoursesCompleted = 0;
				lastEarnedDate = new Date(1900,0,1);
			}

			// If this course is in the courses array. (Has the course been started or completed?)
			var courseOffset = courseFind(tracks[offset].courseName);
			if ( courseOffset >= 0) {

				// If the current course for this track were completed. (complete equals the count)
				if ( courses[courseOffset].completed ===  courses[courseOffset].stageCount) {

					// Add it to the total of courses complete in the track.
					trackCoursesCompleted++;

					// Save the latest earned date as the tracks earned date.
					if ( lastEarnedDate < courses[courseOffset].earnedDate) {
						lastEarnedDate = courses[courseOffset].earnedDate;
					}
				}
			}

			// Count the courses in the track
			coursesInTrack++;
		}

		console.log("Tracks Progress Tally Complete")
	}
	// --------------------------------------------------------------------------------
});