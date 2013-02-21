class Item < ActiveRecord::Base
  attr_accessible :name, :picture_url, :price

  has_many :order_items
end
