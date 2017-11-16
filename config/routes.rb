Rails.application.routes.draw do
  resources :movies do
    collection do
      get :autocomplete
    end
  end
  resources :users
  root to: 'movies#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
