# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/


$(document).ready ->

	console.log "static pages document ready"

	# Hook the event handler to the "add courses button"
	$("#add-course-button").click( addCourseClick )

addCourseClick = ->
	addCourse $('#course-name').val()

addCourse = (courseName) -> 
	console.log "Add Course button clicked"
	if courseName != ""
		course = {course: { course_name: courseName, stage_count: 25 }}
		jQuery.post "/courses.json", course
	else
		console.log "Course name was blank - add not called"
