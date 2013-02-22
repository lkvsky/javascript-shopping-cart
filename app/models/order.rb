class Order < ActiveRecord::Base
  attr_accessible :address, :city, :email, :name, :state, :zip, :order_items_attributes

  has_many :order_items
  has_many :items, :through => :order_items

  accepts_nested_attributes_for :order_items
end
