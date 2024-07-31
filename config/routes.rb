Rails.application.routes.draw do
  root "tops#index"
  get 'login', to: 'user_sessions#new'
  get 'reservations/confirm', to: 'reservations#confirm'
  get 'reservations/create', to: 'reservations#create_preview' # demo
  post 'login', to: 'user_sessions#create'
  delete 'logout', to: 'sessions#destroy'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  resources :users, only: %i[new create]
  resources :reservations do
    collection do
      post 'confirm'
    end
  end
  # Defines the root path route ("/")
  # root "articles#index"
end
