json.array!(@profile_requests) do |profile_request|
  json.extract! profile_request, :id, :profile_id, :request_date, :badges_finished, :total_points, :courses_started, :courses_finished, :tracks_started, :tracks_finished, :points_json, :process_notes
  json.url profile_request_url(profile_request, format: :json)
end
