FbGraphSample::Application.routes.draw do
  # Canvas App
  resource :canvas, :only => [:show, :create]
  resource :credit, :only => :create
  resources :achievements, :only => [:index, :show, :new, :create]

  # Connect Site
  resource :facebook, :except => :create do
    get :callback, :to => :create
  end
  get :update_location, :to => 'profiles#update_location'
  get :friends, :to => 'profiles#friends'
  resource :dashboard, :only => :show
  resource :profile, :only => :show
  resource :timeline, :only => [:show, :create]
  resources :subscriptions, :only => [:index, :show, :create]
  post 'subscriptions/:id', :to => 'subscriptions#update'

  root :to => 'top#index'
end
