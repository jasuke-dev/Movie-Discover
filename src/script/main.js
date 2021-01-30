function main(){
    let count=1
    const getReviews = (id)=>{
        $.ajax({
            url :`https://api.themoviedb.org/3/movie/${id}/reviews`,
            type : 'get',
            dataType : 'json',
            data:{
                'api_key' : '7f2a8c5c1abdc62ec1fd0c449693f1e8'
            },
            success:function(hasil){
                $('#button-mod').html(``)
                $.each(hasil.results,function(i,review){
                    $('#button-mod').prepend(`
                        <a class="btn btn-primary" href="${review.url}" role="button" target="_blank">Review ${i+1}</a>
                    `)   
                })
            }
        })
    }
    
    const first = (base)=>{
        $.ajax({
            url:`https://api.themoviedb.org/3/movie/${base}`,
            type:'get',
            dataType:'json',
            data:{
                'api_key':'7f2a8c5c1abdc62ec1fd0c449693f1e8',
                'language':'id'
            },
            success:function(hasil){
               let movies=hasil.results;
               renderMovie(movies)   
            }
        });
    }
    
    const renderMovie = (movies)=>{
        $('#movie-list').html('');
        $.each(movies,function(i,movie){
            console.log(movie)
            $('#movie-list').append(`
            <div class="card mb-3 mr-2" style="max-width: 540px;">
                <div class="row no-gutters">
                <div class="col-md-4">
                    <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" class="card-img" alt="${movie.title}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text">Popularity   :${movie.popularity}</p>
                    <p class="card-text">Vote Average   :${movie.vote_average}</p>
                    <p class="card-text">Vote Count   :${movie.vote_count}</p>
                    <p class="card-text">release Date   :${movie.release_date}</p>
                    <a href="#" class="card-link more-details" data-toggle="modal" data-target="#exampleModal" data-id="${movie.id}">More</a>
                    </div>
                </div>
                </div>
            </div>           
            `)
        })
    }
    const searchMovie = (movies)=>{
        $.ajax({
            url:'https://api.themoviedb.org/3/search/movie',
            type:'get',
            dataType:'json',
            data:{
                'api_key':'7f2a8c5c1abdc62ec1fd0c449693f1e8',
                'query':$('#input-search').val()  
            },
            success:function(hasil){
                if(!hasil.total_results==0){
                    let movies=hasil.results 
                    renderMovie(movies)
                    let judul=$('#input-search').val()
                    $('h1').html(`Results for ${judul}`) 
                    $('#input-search').val('')
                }else{
                    $('h1').html('')
                    $('#movie-list').html(`
                        <div>
                            <h3>not found</h3>
                        </div>
                    `)
                    $('#input-search').val('')
                }
            }
        })
        
    }
    const categoryMovie = (idCategory)=>{
        $.ajax({
            url:'https://api.themoviedb.org/3/discover/movie',
            type:'get',
            dataType:'json',
            data:{
                'api_key':'7f2a8c5c1abdc62ec1fd0c449693f1e8',
                'sort_by':'popularity.desc',
                'with_genres': idCategory
            },
            success:function(hasil){
                let movies=hasil.results 
                renderMovie(movies) 
            }
        })
    }

    first("upcoming")
    $('#btn-search').on('click',function(){
        searchMovie()
    })
    $('#input-search').on('keyup',function(kode){
        if(kode==13)searchMovie
    })
    $('.dropdown-item').on('click',function(){
        let menu = $(this).html()
        $('h1').html(menu)
        switch(menu.toLowerCase()){
            case "action":
                categoryMovie(28)
                break
            case "comedy":
                categoryMovie(35)
                break
            case "romance":
                categoryMovie(10749)
                break
            case "drama":
                categoryMovie(18)
                break
        }
    })
    $('.nav-link').on('click',function(){
        $('.nav-link').removeClass('active')
        $(this).addClass('active')

        let menu = $(this).html()
    
        if(menu.toLowerCase()=="upcoming"){
            $('h1').html(menu)
            first("upcoming")
        }else if(menu.toLowerCase()=="popular"){
            $('h1').html(menu)
            first("popular")
        }else{
            return
        }
    })
    $('.btn-switch').on('click',function(){
        
        if(count%2==0){
            $('.btn-switch').removeClass('dk')
            $('.btn-switch').addClass('wh')
            $('.navbar').removeClass('navbar-light bg-light')
            $('.navbar').addClass('navbar-dark bg-dark')
            count++
        }else{
            $('.btn-switch').removeClass('wh')
            $('.btn-switch').addClass('dk')
            $('.navbar').removeClass('navbar-dark bg-dark')
            $('.navbar').addClass('navbar-light bg-light')
            count++
        }
    })
    $('#movie-list').on('click','.more-details',function(){
        $.ajax({
            url:`https://api.themoviedb.org/3/movie/${$(this).data('id')}`,
            type:'get',
            dataType:'json',
            data:{                
                'api_key':'7f2a8c5c1abdc62ec1fd0c449693f1e8'
            },
            success:function(hasil){
            $('.modal-body').html(`
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-4">
                                <img src="https://image.tmdb.org/t/p/original${hasil.poster_path}" class="img-fluid">
                            </div>
                            <div class="col-md-8">
                                <ul class="list-group">
                                    <li class="list-group-item"><h3>${hasil.title}</h3></li>
                                    <li class="list-group-item genre">Genre : </li>
                                    <li class="list-group-item">Overview : ${hasil.overview}</li>
                                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                `)
            $.each(hasil.genres,function(i,genre){                
                $('.genre').append(`${genre.name} `)
            })
            getReviews(hasil.id)
            
            }
            
        })
    })
    
   
} 
export default main;   
