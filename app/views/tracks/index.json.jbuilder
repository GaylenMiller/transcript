json.array!(@tracks) do |track|
  json.extract! track, :id, :track_name, :course_count
  json.url track_url(track, format: :json)
end
