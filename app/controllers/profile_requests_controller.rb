class ProfileRequestsController < ApplicationController
  before_action :set_profile_request, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @profile_requests = ProfileRequest.all
    respond_with(@profile_requests)
  end

  def show
    respond_with(@profile_request)
  end

  def new
    @profile_request = ProfileRequest.new
    respond_with(@profile_request)
  end

  def edit
  end

  def create
    @profile_request = ProfileRequest.new(profile_request_params)
    @profile_request.save
    respond_with(@profile_request)
  end

  def update
    @profile_request.update(profile_request_params)
    respond_with(@profile_request)
  end

  def destroy
    @profile_request.destroy
    respond_with(@profile_request)
  end

  private
    def set_profile_request
      @profile_request = ProfileRequest.find(params[:id])
    end

    def profile_request_params
      params.require(:profile_request).permit(:profile_id, :request_date, :badges_finished, :total_points, :courses_started, :courses_finished, :tracks_started, :tracks_finished, :points_json, :process_notes)
    end
end
