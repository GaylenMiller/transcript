class CreateProfileRequests < ActiveRecord::Migration
  def change
    create_table :profile_requests do |t|
      t.string :profile_id
      t.date :request_date
      t.integer :badges_finished
      t.integer :total_points
      t.integer :courses_started
      t.integer :courses_finished
      t.integer :tracks_started
      t.integer :tracks_finished
      t.string :points_json
      t.string :process_notes

      t.timestamps
    end
  end
end
