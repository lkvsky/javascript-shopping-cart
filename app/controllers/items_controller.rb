class ItemsController < ApplicationController
  def index
    @items = Item.all

    @order = Order.new

    respond_to do |format|
      format.html
      format.json { render :json => @items }
    end
  end

  def show
    @item = Item.find(params[:id])

    @order = Order.new

    respond_to do |format|
      format.html
      format.json { render :json => @item }
    end
  end
end
