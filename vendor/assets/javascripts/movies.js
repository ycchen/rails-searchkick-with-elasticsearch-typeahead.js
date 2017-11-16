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

// var ready;
// ready = function() {
//     var movies = new Bloodhound({
//         datumTokenizer: function(d) {
//             console.log(d);
//             return Bloodhound.tokenizers.whitespace(d.title);
//         },
//         queryTokenizer: Bloodhound.tokenizers.whitespace,
//         remote: {
//             url: '../movies/autocomplete?query=%QUERY',
//             wildcard: '%QUERY'
//         }
//     });
//
//     var promise = movies.initialize();
//
//     promise
//         .done(function() { console.log('success!'); })
//         .fail(function() { console.log('err!'); });
//
//         $('#movies_search').typeahead(null, {
//             name: 'movies'
//             displayKey: 'title'
//             source: movies.ttAdapter()
//           });
// }
//
// $(document).ready(ready);
// $(document).on('page:load', ready);
