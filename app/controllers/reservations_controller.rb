class ReservationsController < ApplicationController
  def index
    start_date = params[:start_date] ? Date.parse(params[:start_date]) : Date.today
    start_of_week = start_date.beginning_of_week
    end_of_week = start_of_week.end_of_week

    @reservations = Reservation.where(start_time: start_of_week..end_of_week)
    @week_range = start_of_week..end_of_week

    respond_to do |format|
      format.html
      format.json { render json: { reservations: @reservations, week_range: { begin: @week_range.begin, end: @week_range.end } } }
    end
  end

  def new
    start_date = params[:start_date] ? Date.parse(params[:start_date]) : Date.today
    start_of_week = start_date.beginning_of_week
    end_of_week = start_of_week.end_of_week

    @reservations = Reservation.where(start_time: start_of_week..end_of_week)
    @week_range = start_of_week..end_of_week
    @reservation = Reservation.new
  end

  def create
  end

  def create_preview
    # 必要に応じて@reservationオブジェクトを設定
    @reservation = Reservation.new
    render 'create'
  end

  def confirm
  end

  private

  def reservation_params
    params.require(:reservation).permit(:user_id, :ground_id, :start_time, :end_time, :status)
  end
end
