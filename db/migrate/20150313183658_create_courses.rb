class CreateCourses < ActiveRecord::Migration
  def change
    create_table :courses do |t|
      t.string :course_name
      t.integer :stage_count

      t.timestamps
    end
  end
end
