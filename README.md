# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

* Add bootstrap-sass and simple_form gems to Gemfile

* Generate User model
```Ruby
rails g model user first_name:string{16} last_name:string email_address:string address_line_one address_line_two address_city address_state:string{2} address_zip:string
```
* Add activerecord-import gem to Gemfile

* Generate seed.rb to import 1_000_000_000 records for testing, we will use import method from activerecord-import gem
```ruby
  #/db/seeds.rb

```

* Run generate for simple_form and integrated with bootstrap

```Ruby
  rails g simple_form:install --bootstrap

  ===============================================================================

  Be sure to have a copy of the Bootstrap stylesheet available on your
  application, you can get it on http://getbootstrap.com/.

  Inside your views, use the 'simple_form_for' with one of the Bootstrap form
  classes, '.form-horizontal' or '.form-inline', as the following:

    = simple_form_for(@user, html: { class: 'form-horizontal' }) do |form|

===============================================================================
```

* Run generate scaffold for User

```ruby
rails g scaffold User first_name last_name email
```

* Generate Movie model

```ruby
rails g scaffold Movie title:string year:integer released:date runtime:integer plot:boolean
```

* install Elasticsearch

```ruby
# install elasticsearch use brew
brew install elasticseach

# start elasticsearch server
brew services start elasticsearch

```

* Add seeds.rb to create movies from http://www.omdbapi.com/

```ruby
# make sure to create apikey from omdbapi.com

require 'json'
require 'rest-client'
url = "http://www.omdbapi.com/"
movies = ["2 Fast 2 Furious","2012","22 Jump Street","A Christmas Carol","A Christmas Story","A Disney Christmas Gift","Ace Ventura Pet Detective","Ace Ventura When Nature Calls","Air Force One","Aladdin","Amazing Spider Man 2","Ant-Man","Awakenings","Bambi","Batman Forever","Batman vs Superman","Beauty and the Beast","Bicentennial Man","Big Hero 6","Blade II","Blade III","Brave","Bruce Almighty","Cadillac Man","Captain America","Captain America - Civil War","Captain America - The First Avenger","Captain America - The Winter Soldier","Cars 2","Cars","Central Intelligence","Cinderella","Dead Poets Society","Deadpool","Death Proof","Deepwater Horizon","Django Unchained","Doctor Strange","Dumb And Dumber","Dumb and Dumber To","Dumbo","Earth Girls Are Easy","Edward Scissorhands","Elektra","Elf","Eternal Sunshine of the Spotless Mind","Ex Machina","Fantastic 4 Rise of the Silver Surfer","Fantastic Four","Fast & Furious","Fast & Furious 6","Fast Five","Finding Dory","Finding Nemo","Flubber","Four Rooms","From Dusk Till Dawn","Frozen","Fun with Dick and Jane","George of the Jungle","Ghost Rider","Ghost Rider Spirit of Vengeance","Gone In Sixty Seconds","Good Morning Vietnam","Good Will Hunting","Gremlins","Guardians of the Galaxy","Hannibal","Harry Potter And The Chamber Of Secrets","Harry Potter And The Deathly Hallows Part 1","Harry Potter And The Deathly Hallows Part 2","Harry Potter And The Goblet Of Fire","Harry Potter And The Order Of The Phoenix","Harry Potter And The Prisoner Of Azkaban","Harry Potter and The Half Blood Prince","Home Alone","Home Alone 2 Lost In New York","Hook","Horton Hears A Who","How the Grinch Stole Christmas","Hulk","I Love You Phillip Morris","Idiocracy","Incredible Hulk","Independence Day Resurgence","Inglourious Basterds","Inside Out","Insomnia","Interstellar","Iron Man 2","Iron Man","Jack","Jack Reacher Never Go Back","Jackie Brown","Jason Bourne","Jingle All the Way","Joe Dirt 2","Jumanji","Jurassic World","Kick-Ass 2","Kill Bill Vol 1","Kill Bill Vol 2","Kingsman The Secret Service","Lady and the Tramp","Liar Liar","Life Animated","Little Nicky","London Has Fallen","Lost in Translation","Lucy","Man Of Steel","Man On The Moon","Man-Thing","Max Steel","Moscow on the Hudson","Mrs. Doubtfire","National Lampoon's Christmas Vacation","Natural Born Killers","O Brother Where Art Thou","Once Bitten","One Hour Photo","Patch Adams","Peter Pan","Piper","Pixels","Plex","Polar Express","Popeye","Project Almanac","Pulp Fiction","Punisher War Zone","RV","Ratatouille","Reservoir Dogs","Rudolph, the Red-Nosed Reindeer","Sausage Party","Sherlock Holmes A Game Of Shadows","Sherlock Holmes","Sin City","Sleepy Hollow","Snowden","Spider-Man 2","Spider-Man 3","Star Trek - Beyond","Star Trek - Into Darkness","Storks","Suicide Squad","Sully","Tangled","Teenage Mutant Ninja Turtles","The Accountant","The Adjustment Bureau","The Amazing Spider-Man","The Avengers","The Birdcage","The Cable Guy","The Campaign","The Dark Knight Rises","The Devil's Advocate","The Fast and the Furious","The Fast and the Furious - Tokyo Drift","The Fisher King","The Good Dinosaur","The Goonies","The Green Mile","The Hateful Eight","The Internship","The Interview","The Iron Giant","The Lion King","The Little Mermaid","The Majestic","The Martian","The Mask","The Matrix","The Matrix Reloaded","The Matrix Revolutions","The NeverEnding Story","The Neverending Story II","The Nightmare Before Christmas","The Number 23","The Prestige","The Punisher","The Purge Election","The Secret Life of Pets","The Silence Of The Lambs","The Sixth Sense","The Sword In The Stone","The Theory of Everything","The Truman Show","Thor - The Dark World","Thor","Toys","Trading Places","Trolls","True Romance","Up","VeggieTales Saint Nicholas - A Story of Joyful Giving!","WALL-E","War Dogs","Warcraft","What Dreams May Come","Wreck It Ralph","Yes Man"]

movies.each do |movie|
  request = RestClient.get(url, {params: {t: movie, r: :json, plot: :short, apikey: '<your api key>'}})
  movie_json = JSON.parse(request.body, object_class: OpenStruct)
  puts "#{movie_json.Title} = #{movie_json.Year.to_i} #{movie_json.Released == 'N/A' ? nil: Date.parse(movie_json.Released) } #{movie_json.Runtime.to_i}"
  Movie.create(
    title: movie_json.Title,
    year:  movie_json.Year.to_i,
    released: movie_json.Released == 'N/A' ? nil: Date.parse(movie_json.Released),
    runtime: movie_json.Runtime.to_i,
    plot: movie_json.Plot
  )
end
```
* Add searchkick gem to Gemfile

* Add searchkick to Movie model

```ruby
# models/movie.rb

class Move < ApplicationRecord
  searchkick
end
```

* Add data to the search index

```ruby
# Rails console
Movie.reindex

#terminal

rake searchkick:reindex CLASS=Movie
```

* Add search to controllers

```ruby
# controllers/movies_controller.rb

def index
  search = params[:term].present? ? params[:term] : nil
  @movies = if search
    # Movie.where("title LIKE ? OR plot LIKE ?", "%#{search}%", "%#{search}%")
    # Movie.search(search, where: {year: { gt: 2000 } }, fields: [:title])
    # Movie.search(search, , debug: true)
    Movie.search(search, where: {year: { gt: 2000 } },
                         fields: [:title, :polt]
                       )
  else
    @movies = Movie.all
  end
end
```

* Add typeahead.js to do instance search / autocomplete

```ruby
# https://github.com/ankane/searchkick#instant-search--autocomplete
class MoviesController < ApplicationController
  def autocomplete
    render json: Movie.search(params[:query], {
      fields: ["title^5", "director"],
      match: :word_start,
      limit: 10,
      load: false,
      misspellings: {below: 5}
    }).map(&:title)
  end
end

class Movie < ApplicationRecord
  searchkick word_start: [:title, :director]
end
```
* Add new routes for movies#autocomplete

```ruby
resources :movies do
  collection do
    get :autocomplete
  end
end
```

* Add javascript to handle search box

```JavaScript
$(document).on('turbolinks:load',function(){
  var movies = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: '/movies/autocomplete?query=%QUERY',
      wildcard: '%QUERY'
    }
  });
  // alert('hello from movies.js');
  // console.log(movies);
  $('#movies_search').typeahead({
      hint: true,
      highlight: true,
      minLength: 3
    },
    {
      source: movies
  });
})
```
