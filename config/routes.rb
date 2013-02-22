Store::Application.routes.draw do
  resources :items
  resources :orders, :only => :create
end
