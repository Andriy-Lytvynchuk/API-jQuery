$(document).ready(function(){

var searchTitle, searchURL = "";
var API = "https://www.omdbapi.com/?i=tt3896198&apikey=c46177da&s=";
// console.log(searchTitle);
var searchResAr = [];
var nominatedAr =[];
var maxNumRes, userNumChoice = 30;

// Toggle Sky image animation
$("#sky-anim-btn").click(function(){
    if ($("#sky-img").css("animation-play-state")=="running") {   
      $("#sky-img").css("animation-play-state", "paused") ;
        $("#sky-anim-btn").html("Animate");
     }  else { 
         $("#sky-img").css("animation-play-state", "running"); 
         $("#sky-anim-btn").html("Stop animation");
    }
}); 

//Find Array index by object property value
function findIndexByKeyValue(array, key, value) {
    for (var i = 0; i < array.length; i++) { 
        if (array[i][key] == value) {
            return i;
        }
    }
    return -1;
}

// ========================================================
//Search button listener 
$("#search_btn").click(function(){
    
    if ($("#search_input").val()==="") {
        $("#noInput").html("Please enter Movie Title");
        $("#noData").html("");
    } else {
        $("#load-img").css("display", "block");
        $("#descrip").hide();
        $("#noInput").html("");
        $("#noData").html("");
        searchTitle = $("#search_input").val(); 
        searchURL = encodeURIComponent(searchTitle).toLowerCase();  

        userNumChoice = parseInt($("#max-number").val());
        maxNumRes = (userNumChoice <= 30) ? (userNumChoice-1) : 30 ;
        // console.log("input:"+ $("#search_input").val());
        // console.log("searchURL inside:"+ searchURL);
        // console.log(userNumChoice);
        
        getData();
    }
    }); 

//Fetsh remote data ================================
function getData(){
 $.getJSON(API+searchURL, function() {
    
      $("#resultsH3 > span").empty();
      $("#resultsH3").append(`<span> for "${searchTitle}" </span>` ); 
      $("#search-list").empty();
      searchResAr =[]; //empty array
    }) // closing getJSON
     
    .done(function(data) {
       //console.log(data);  
      //Print from searchResAr ----
      $.each(data.Search, function(index, movie){  
        // movie.Id = index;
        searchResAr.push(movie);   
      
        //Nominate button id attr set to movie id in database (imdbID)
        $("#search-list").append(`
            <div class="movie-cont blue-box-shadow">                   
                <h4>${searchResAr[index].Title} (${searchResAr[index].Year})
                <button id="${searchResAr[index].imdbID}" class="nominate-btn">Nominate</button></h4>    
                <img src="${searchResAr[index].Poster}" alt="movie poster">          
            </div>                
        `) ;

        //Print from JSON ------
        // $("#search-list").append(`
        //     <li class="cont-flex">${index+1}. ${movie.Title} (${movie.Year}) 
        //         <button id="${index}" class="nominate-btn">Nominate</button>
        //     </li>                 
        // `) ;

        if ( index == maxNumRes ) {
            return false;
        }        
        }); // closing each loop
            //  console.log(searchResAr);
        $("#load-img").css("display", "none");

        if(searchResAr.length == 0){
            $("#noData").html("Did not find a match");
        }
    }) //closing .done 

    .fail(function() { $("#noData").html("Could not load remote data") ; }); 
}

// ========================================================
//"Nominate" button listener (Search results div on the left) 
$("#search-list").on("click", ".nominate-btn", function (){
    // $(this).css("background-color", "yellow");

    //Find in searchResAr movie to add to nominatedAr
    var movieDBid = $(this).attr("id");
    var ResArMovieIndex = findIndexByKeyValue(searchResAr, "imdbID", movieDBid);
    console.log("Search div movieDBid: "+ movieDBid); 
    console.log("ResArMovieIndex: "+ ResArMovieIndex);

    //Add movie to nominatedAr
    if (ResArMovieIndex >= 0) {
        nominatedAr.push(searchResAr[ResArMovieIndex]); 
    }   

    //Check number of elements in nominatedAr
    if (nominatedAr.length <= 5) {
        $(this).parents(".movie-cont").removeClass("blue-box-shadow").addClass("red-box-shadow");
        $(this).addClass("inactive-btn");
        $(".nominate-btn[id="+movieDBid+"]").prop('disabled', true);              
        printNominatedAr();              
     }
    if (nominatedAr.length == 5){
        $("#congrats").css("display", "block");
        $('html, body').animate({
            scrollTop: $("#search-list").offset().top+20 
        }, 200);
        $("#congrats").css("animation", "scale 0.7s linear 0.3s 3");        
    }
    if (nominatedAr.length > 5){
        alert("Oops! Only 5 movies can be nominated");
        nominatedAr.splice(5, nominatedAr.length);       
    }

    console.log("nominatedAr.length: "+nominatedAr.length);
    
    // console.log("nominatedAr Entire: \n"+ JSON.stringify(nominatedAr) );   
    // console.log("searchResAr at Nominat ID: \n"+ JSON.stringify(searchResAr[movieDBid]));  
    // console.log("searchResAr Entire: \n"+ JSON.stringify(searchResAr));  
}); //closing "Nominate" button listener

// ========================================================
//print Nominated Array
// button "id" attr set to movie DB id (imdbID)
function printNominatedAr(){
    $("#nominats-list").empty();
    if (nominatedAr.length > 0) {
        $.each(nominatedAr, function(index, movie){   
            $("#nominats-list").append(`
            <li class="nominats-list-item">
                <span>${index+1}. ${nominatedAr[index].Title} (${nominatedAr[index].Year}) </span>
                <button id="${nominatedAr[index].imdbID}" class="remove-btn">Remove</button>
            </li>  
            <hr>               
            `);
        }); //closing each loop
    }  
} 

// ========================================================
//"Remove" button listener (Nominations div on the right) 
$("#nominats-list").on("click", ".remove-btn", function (){
    $("#congrats").css("display", "none");

    var movieDBid = $(this).attr("id");
    var NominArMovieIndex = findIndexByKeyValue(nominatedAr, "imdbID", movieDBid);
    console.log("Nominations div movieDBid: "+ movieDBid); 
    console.log("NominArMovieIndex: "+ NominArMovieIndex);

    //Remove movie from nominatedAr and re-print list
    nominatedAr.splice(NominArMovieIndex, 1);
    printNominatedAr();

    // ----------------------------------------
    //Style Search results div on the left (id="search-list") 
    var SearchArMovieIndex = findIndexByKeyValue(searchResAr, "imdbID", movieDBid);
    if(SearchArMovieIndex >= 0) {
        var movieBorder = $(".nominate-btn[id="+movieDBid+"]").parents(".movie-cont");
        $('html, body').animate({
            scrollTop: movieBorder.offset().top-14 
        }, 300);

        // $(".nominate-btn[id="+movieDBid+"]")[0].scrollIntoView({
        //     behavior: "smooth",  block: "start"
        // });

        $(".nominate-btn[id="+movieDBid+"]").removeClass("inactive-btn");
        $(".nominate-btn[id="+movieDBid+"]").prop('disabled', false);

        // Blink removed movie border
        movieBorder.removeClass("red-box-shadow");

        var changeBordColor = ( setInterval(function (){
            movieBorder.toggleClass("red-box-shadow")}, 300));
        
        setTimeout(function(){
            clearInterval(changeBordColor);
            movieBorder.removeClass("red-box-shadow").addClass("blue-box-shadow");
        }, 2100);
    } //closing if 


    console.log("nominatedAr.length: "+nominatedAr.length);
    // console.log("movieDBid: "+ movieDBid); 
    // console.log("nominatedAr Entire: \n"+ JSON.stringify(nominatedAr) );   
    // console.log("searchResAr at Nominat ID: \n"+ JSON.stringify(searchResAr[movieDBid]));  
    // console.log("searchResAr Entire: \n"+ JSON.stringify(searchResAr));  
}); //closing "Nominate" button listener
    
});// closing doc ready funct



  
