require 'test_helper'

class ProfileRequestsControllerTest < ActionController::TestCase
  setup do
    @profile_request = profile_requests(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:profile_requests)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create profile_request" do
    assert_difference('ProfileRequest.count') do
      post :create, profile_request: { badges_finished: @profile_request.badges_finished, courses_finished: @profile_request.courses_finished, courses_started: @profile_request.courses_started, points_json: @profile_request.points_json, process_notes: @profile_request.process_notes, profile_id: @profile_request.profile_id, request_date: @profile_request.request_date, total_points: @profile_request.total_points, tracks_finished: @profile_request.tracks_finished, tracks_started: @profile_request.tracks_started }
    end

    assert_redirected_to profile_request_path(assigns(:profile_request))
  end

  test "should show profile_request" do
    get :show, id: @profile_request
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @profile_request
    assert_response :success
  end

  test "should update profile_request" do
    patch :update, id: @profile_request, profile_request: { badges_finished: @profile_request.badges_finished, courses_finished: @profile_request.courses_finished, courses_started: @profile_request.courses_started, points_json: @profile_request.points_json, process_notes: @profile_request.process_notes, profile_id: @profile_request.profile_id, request_date: @profile_request.request_date, total_points: @profile_request.total_points, tracks_finished: @profile_request.tracks_finished, tracks_started: @profile_request.tracks_started }
    assert_redirected_to profile_request_path(assigns(:profile_request))
  end

  test "should destroy profile_request" do
    assert_difference('ProfileRequest.count', -1) do
      delete :destroy, id: @profile_request
    end

    assert_redirected_to profile_requests_path
  end
end
