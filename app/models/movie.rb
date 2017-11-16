class Movie < ApplicationRecord
  # searchkick word_middle: [:title, :polt] #word_middle does not work
  # searchkick word_start: [:title, :plot]
  # searchkick default_fields: [:title, :plot]
  searchkick
  def search_data
    {
      title: title,
      year: year,
      plot: plot
    }
  end
end
