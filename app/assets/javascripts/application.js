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

	// Activate the bootstrap tooltips.
  	$('[data-toggle="tooltip"]').tooltip();

  	// Variables for the data for the transcript.
	var profileName;
	var profilePoints;

	// The JSON badge data is parsed in badges[], it is sorted by course and then summarized in badgesWithProgress[]. 
	badges = [];
	coursesWithProgress = [];
	var badgesLoaded = false;

	// The JSON course data is loaded in courses[].
	var courses = [];
	var coursesLoaded = false;

	// The JSON course data is loaded in tracks[]
	var tracks = [];
	var tracksWithProgress = [];
	var tracksLoaded = false;



	$("#generate-button").click( function() {
		console.log("generate button clicked");

		var profileUrl = $("#profile-url").val();
		profileUrl = "http://teamtreehouse.com/" + profileUrl + ".json" 
		console.log( "requesting " + profileUrl)

		// Get the badges JSON database from the Team Treehouse web site.
		$.getJSON( profileUrl, function( data ) {
			badgesLoad( data['name'], data['badges'], data['points']);
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


  		// Go through the badges sorted by course and earned date.
		var stagesCompleted = 0;

		// go through the task courses
		for (var offset = 0; offset < badges.length; offset++) {

			// Count the badges in the course
			stagesCompleted++;

			// If the accumulated information needs to be saved, if the next course is different or this is the last badge.
			if ( (offset === badges.length - 1) || ( badges[offset+1].courseName !== badges[offset].courseName) ){

				// Insert a row into badges array with completed and course count.
				var one = {};
				one.courseName = badges[offset].courseName;
				one.stagesCompleted = stagesCompleted;
				one.earnedDate = badges[offset].earnedDate;
				one.stageCount = 0;
				coursesWithProgress.push( one);

				// Save the current track and reset the completed count to zero.
				stagesCompleted = 0;
			}
		}

		// Mark the badge load as complete.
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
		newText = profileName;
		$("#profile-header-name").text(newText);

		// Create a long string with the tracks in a table.
		tracksHtml = "<table class='table table-striped'>"
		+ "<tr><th>Track Name</th><th>Progress</th><th>Last Activity On</th></tr>";
		for( var offset = 0; offset < tracksWithProgress.length; offset++) {

			// If there are any stages completed, include the course.
			if ( tracksWithProgress[offset].coursesCompleted > 0) {
				tracksHtml += "<tr><td>" + tracksWithProgress[offset].trackName + "</td><td>" 
				+ tracksWithProgress[offset].coursesCompleted + " of " + tracksWithProgress[offset].coursesInTrack + "</td><td>" 
				+ tracksWithProgress[offset].earnedDate.toLocaleDateString() + "</td></tr>";
			}
		}
		$("#tracks-div").html( tracksHtml + "</table>");

		// Create a long string with the courses in table row html.
		coursesHtml = "<table class='table table-striped'>"
		+ "<tr><th>Course Name</th><th>Progress</th><th>Last Activity On</th></tr>";
		for( var offset = 0; offset < coursesWithProgress.length; offset++) {

			// If there are any stages completed, include the course.
			coursesHtml += "<tr><td>" + coursesWithProgress[offset].courseName + "</td><td>" 
			+ coursesWithProgress[offset].stagesCompleted + " of " + coursesWithProgress[offset].stageCount 
			+ "</td><td>" + coursesWithProgress[offset].earnedDate.toLocaleDateString() + "</td></tr>";
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
  		$( "<table>", { "class": "table table-striped", html: itemHtml }).appendTo( "#badges-div" );
	}
	// --------------------------------------------------------------------------------


	function coursesLoad( coursesJson) {
		console.log("ajax courses response received");

		// Get the needed columns and push that object on the array.
		$.each( coursesJson, function( index, course) {
			var one = {};
			one.courseName = course.course_name;
			one.stageCount = course.stage_count;
			// one.completed = 0;
			// one.earnedDate = new Date(1900,0,1);

			courses.push( one );
		});

		// Mark the course load as complete.
		coursesLoaded = true;

		// Call the function to display the status and trigger the transcript when ready.
		checkStatusShow();
	}
	// --------------------------------------------------------------------------------


	function courseProgressTally() {


		// Go through the course with progress array and find the number of stages in that course
		var courseOffset = 0;
		for (var offset = 0; offset < coursesWithProgress.length; offset++) {

			// If the course was found.
			var course = coursesWithProgress[offset];
			var index = courseFind( course.courseName );
			if (index >= 0) {

				// Set the stage count.
				coursesWithProgress[offset].stageCount = courses[index].stageCount;

			// If the course was not found.
			} else {

				// At this point, assume stage completed is the stage count.
				coursesWithProgress[offset].stageCount = course.stagesCompleted;

				// Add it to the database.
				console.log("Adding missing course - " + course.courseName);
				newCourse = {course: { course_name: course.courseName, stage_count: course.stagesCompleted }}
				jQuery.post("/courses.json", newCourse);

				// Add to the admin email that this happened.
				// adminEmailAddLine("Adding missing course - " + course.courseName);
			}
		}

		console.log("Course Progress Tally complete");
	}
	// --------------------------------------------------------------------------------


	function tracksLoad( tracksJson) {
		console.log("ajax tracks response received");

		// Get the needed columns and push that object on the array.
		$.each( tracksJson, function( index, track) {
			var one = {};
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


	// Return the index if a course is found.
	function courseFind( courseName ) {
		var looking = 0;
		while ((looking < courses.length) && (courses[looking].courseName !== courseName)) {
			looking++;
		}

		// if the course was found.
		if (looking < courses.length)
			return looking;
		else
			return -1;
	}
	// --------------------------------------------------------------------------------


	function coursesWithProgressFind( courseName ) {
		var looking = 0;
		while ((looking < coursesWithProgress.length) && (coursesWithProgress[looking].courseName !== courseName)) {
			looking++;
		}

		// if the course was found.
		if (looking < coursesWithProgress.length)
			return looking;
		else
			return -1;
	}
	// --------------------------------------------------------------------------------


	// Go through all the tracks and build a list of tracks started and how many courses are completed.
	function trackProgressTally() {

		var coursesInTrack = 0;
		var trackCoursesCompleted = 0;
		var lastEarnedDate = new Date(1900,0,1);

		// go through the task courses
		for (var offset = 0; offset < tracks.length; offset++) {

			// Count the courses in the track
			coursesInTrack++;

			// If this course is in the courses array, meaning the course been started or completed.
			var courseOffset = coursesWithProgressFind(tracks[offset].courseName);
			if ( courseOffset >= 0) {

				// If the current course for this track were completed. (completed equals the count)
				if ( coursesWithProgress[courseOffset].stagesCompleted ===  coursesWithProgress[courseOffset].stageCount) {

					// Add it to the total of courses complete in the track.
					trackCoursesCompleted++;

					// Save the latest earned date as the tracks earned date.
					if ( lastEarnedDate < coursesWithProgress[courseOffset].earnedDate) {
						lastEarnedDate = coursesWithProgress[courseOffset].earnedDate;
					}
				}
			}


			// If the accumulated information needs to be saved, if the next track is different or this is the last track.
			if ( (offset === tracks.length - 1) || ( tracks[offset+1].trackName !== tracks[offset].trackName) ){

				// Insert a row into tracks array with completed and course count.
				var one = {};
				one.trackName = tracks[offset].trackName;
				one.coursesCompleted = trackCoursesCompleted;
				one.coursesInTrack = coursesInTrack;
				one.earnedDate = lastEarnedDate;
				tracksWithProgress.push( one);

				// Save the current track and reset the completed count to zero.
				coursesInTrack = 0;
				trackCoursesCompleted = 0;
				lastEarnedDate = new Date(1900,0,1);
			}
		}

		console.log("Tracks Progress Tally Complete")
	}
	// --------------------------------------------------------------------------------
});