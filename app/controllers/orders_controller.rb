class OrdersController < ApplicationController
  def create
    @order = Order.new(params[:order])

    if @order.save
      render :nothing => true, :status => 200
    else
      render :nothing => true, :status => 500
    end
  end
end
