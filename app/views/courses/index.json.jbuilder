json.array!(@courses) do |course|
  json.extract! course, :course_name, :stage_count
  # json.url course_url(course, format: :json)
end
