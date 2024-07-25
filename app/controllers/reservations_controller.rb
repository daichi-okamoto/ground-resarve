class ReservationsController < ApplicationController
  def index
    @reservations = Reservation.all
    respond_to do |format|
      format.html # 普通のHTMLリクエストに対しては通常のビューを表示
      format.json { render json: @reservations } # カレンダー用のJSONデータを提供
    end
  end

  def new
    @reservation = Reservation.new
  end

  def create
    @reservation = Reservation.new(reservation_params)
    if @reservation.save
      redirect_to reservations_path, notice: 'Reservation was successfully created.'
    else
      render :new
    end
  end

  private

  def reservation_params
    params.require(:reservation).permit(:user_id, :ground_id, :start_time, :end_time, :status)
  end
end
