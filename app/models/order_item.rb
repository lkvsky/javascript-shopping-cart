class OrderItem < ActiveRecord::Base
  attr_accessible :item_id, :order_id, :quantity

  belongs_to :item
  belongs_to :order
end
