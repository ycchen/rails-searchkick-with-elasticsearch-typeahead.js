json.extract! movie, :id, :title, :year, :released, :runtime, :plot, :created_at, :updated_at
json.url movie_url(movie, format: :json)
