class TrackCourse < ActiveRecord::Migration
  	def change
    	create_table :track_courses do |t|
    		t.string :course_name
      		t.string :track_name
      		t.integer :course_order

      		t.timestamps
  		end
  	end
end
