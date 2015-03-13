class CreateTracks < ActiveRecord::Migration
  def change
    create_table :tracks do |t|
      t.string :track_name
      t.integer :course_count

      t.timestamps
    end
  end
end
