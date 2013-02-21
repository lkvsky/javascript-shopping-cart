class Order < ActiveRecord::Base
  attr_accessible :address, :city, :email, :name, :state, :zip

  has_many :order_items
  has_many :items, :through => :order_item
end
