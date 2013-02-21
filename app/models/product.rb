class Product < ActiveRecord::Base
  attr_accessible :name, :picture_url, :price
end
