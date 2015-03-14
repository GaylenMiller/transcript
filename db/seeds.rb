# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

print "Courses "
Course.delete_all
open("db/seed/courses.csv") do |courses|
	courses.read.each_line do |course|
		course_name, stage_count = course.split(',')
		Course.create!( course_name: course_name, stage_count: stage_count)
		print "."
	end
end
puts ""

print "Tracks "
Track.delete_all
open("db/seed/tracks.csv") do |tracks|
	tracks.read.each_line do |track|
		track_name, course_count = track.split(',')
		Track.create!( track_name: track_name, course_count: course_count)
		print "."
	end
end
puts ""

print "Tracks Courses"
TrackCourse.delete_all
open("db/seed/track_courses.csv") do |tcs|
	tcs.read.each_line do |tc|
		track_name, course_name, course_order = tc.split(',')
		TrackCourse.create!( track_name: track_name, course_name: course_name, course_order: course_order)
		print "."
	end
end
puts ""
