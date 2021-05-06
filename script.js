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

    //     $("#sky-img").css("animation-play-state", "paused");
    // }, function(){
    //     $("#sky-img").css("animation-play-state", "running");   
    // });

    // if ($("#sky-img").css("animation")=="rotate 800s linear infinite forwards") {   
    //     $("#sky-img").css("animation", "none") ;
    // } 
    //  else  {
    //     $("#sky-img").css("animation", "rotate 800s linear infinite forwards");
    //  }


//Search button listener -------------
$("#search_btn").click(function(){
    
    if ($("#search_input").val()==="") {
        $("#noInput").html("Please enter Movie Title");
    } else {
        $("#descrip").hide();
        $("#load-img").css("display", "block");
        $("#noInput").html("");
        $("#nodata").html("");
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

//Fetsh remote data ---------------------
function getData(){
    $.getJSON(API + searchURL, function(data) {
    //   console.log(data);  
      $("#resultsH3 > span").empty();
      $("#resultsH3").append(`<span> for "${searchTitle}" </span>` ); 
      $("#search-list").empty();
      searchResAr =[];
    
      //Print from searchResAr ----
       $.each(data.Search, function(index, movie){  
            movie.Id = index;
            searchResAr.push(movie);   

            $("#search-list").append(`
                <div class="movie-cont blue-box-shadow">                   
                    <h4>${searchResAr[index].Title} (${searchResAr[index].Year})
                    <button id="${searchResAr[index].Id}" class="nominate-btn">Nominate</button></h4>    
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
    //    console.log(searchResAr);
    $("#load-img").css("display", "none");
    }) // closing getJSON
    .fail(function() { $("#nodata").html("Could not load remote data") ; })
}

//"Nominate" button listener ---------------
$("#search-list").on("click", ".nominate-btn", function (){
    // $(this).css("background-color", "yellow");
    var nominBtnId = $(this).attr("id");
    
    nominatedAr.push(searchResAr[nominBtnId]); 

    if (nominatedAr.length <= 5) {
        $(this).parents(".movie-cont").removeClass("blue-box-shadow").addClass("red-box-shadow");
        $(this).addClass("inactive-btn");
        $(".nominate-btn[id="+nominBtnId+"]").prop('disabled', true);              
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
    
    //  console.log("nominBtnId: "+ nominBtnId); 
    // console.log("nominatedAr Entire: \n"+ JSON.stringify(nominatedAr) );   
    // console.log("searchResAr at Nominat ID: \n"+ JSON.stringify(searchResAr[nominBtnId]));  
    // console.log("searchResAr Entire: \n"+ JSON.stringify(searchResAr));  
}); //closing "Nominate" button listener

//print Nominated Array ------------------
function printNominatedAr(){
    $("#nominats-list").empty();
    if (nominatedAr.length > 0) {
        $.each(nominatedAr, function(index, movie){   
            $("#nominats-list").append(`
            <li class="nominats-list-item">
                <span>${index+1}. ${nominatedAr[index].Title} (${nominatedAr[index].Year}) </span>
                <button id="${nominatedAr[index].Id}" class="remove-btn">Remove</button>
            </li>  
            <hr>               
            `);
        }); //closing each loop
    }
   
} 

//"Remove" button listener ---------------
$("#nominats-list").on("click", ".remove-btn", function (){

    var removeBtnId = $(this).attr("id");
    var movieBorder = $(".nominate-btn[id="+removeBtnId+"]").parents(".movie-cont");

    $("#congrats").css("display", "none");

      $('html, body').animate({
        scrollTop: movieBorder.offset().top-14 
    }, 300);

    // $(".nominate-btn[id="+removeBtnId+"]")[0].scrollIntoView({
    //     behavior: "smooth",  block: "start"
    // });

    $(".nominate-btn[id="+removeBtnId+"]").removeClass("inactive-btn");

    // Blink removed movie border
    movieBorder.removeClass("red-box-shadow");

     var changeBordColor = ( setInterval(function (){
        movieBorder.toggleClass("red-box-shadow")}, 300));
    
    setTimeout(function(){
        clearInterval(changeBordColor);
        movieBorder.removeClass("red-box-shadow").addClass("blue-box-shadow");
    }, 2100);
 
    // var index = nominatedAr.findIndex(function (movie, index) {
    //      if(movie.Id == removeBtnId)  
    //      return true  
    // });  

    var index;
    nominatedAr.some(function (elem, i) {
        return elem.Id == removeBtnId ? (index = i, true) : false;
    });

    // alternative to above:
/*     function findIndexByKeyValue(array, key, value) {
        for (var i = 0; i < array.length; i++) { 
            if (array[i][key] == value) {
                return i;
            }
        }
        return -1;
    }
    var index = findIndexByKeyValue(a, 'Id', removeBtnId);
    console.log(index);
 */    


    // console.log("index: " + index);
    // console.log("nominatedAr: \n" + JSON.stringify(nominatedAr));

    nominatedAr.splice(index, 1);
    $(".nominate-btn[id="+removeBtnId+"]").prop('disabled', false);

    printNominatedAr();

    console.log("nominatedAr.length: "+nominatedAr.length);
    // console.log("removeBtnId: "+ removeBtnId); 
    // console.log("nominatedAr Entire: \n"+ JSON.stringify(nominatedAr) );   
    // console.log("searchResAr at Nominat ID: \n"+ JSON.stringify(searchResAr[nominBtnId]));  
    // console.log("searchResAr Entire: \n"+ JSON.stringify(searchResAr));  
}); //closing "Nominate" button listener
    
});// closing doc ready funct



  