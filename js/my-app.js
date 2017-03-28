// Initialize your app
var myApp = new Framework7({

	// cache: false,  disable caching 

	onAjaxStart: function (xhr) { 
		myApp.showIndicator();
	},
	onAjaxComplete: function (xhr) { 
		myApp.hideIndicator();
	}


});


var $$ = Dom7;

// Init main view
var mainView = myApp.addView('.view-main', { 
	domCache: true,
});






// Script to alter app depending on if its been loaded beofre by users device ---------------------------------------------------------------------------------------------------------------------------------

// Check if apps run once before if so take action 
var applaunchCount = window.localStorage.getItem('launchCount');

//Check if it already exists or not
if(applaunchCount){

	// Load Home page and skip walkthrough if app has already been opened before by user 
 	mainView.router.load({pageName: 'home'});


   //This is a second time launch, and count = applaunchCount
   $('.search-bg-page .popup-wrappr').remove();

   $('.best-deals-page .popup-wrappr').remove();

   $('.swiper-container.walkthrough').remove();

  
} else {
  //Local storage is not set, hence first time launch. set the local storage item
  window.localStorage.setItem('launchCount',1);

  //Do the other stuff related to first time launch
}



// check if app has active network connection 

document.addEventListener("offline", onOffline, false);
 
function onOffline() {
    // Handle the offline event 
   alert("Device not connected to internet, reconnect to the internet to use application");
}

// document.addEventListener("online", onOnline, false);
 
// function onOnline() {
//     // Handle the online event 
//        alert("Device connected to internet, full use of application enabled");

// }









// Global variable to store JSONP data returnded from dealchecker API , variable containes all of deal data avaliable on API ---------------------------------------------------------------------------------------------------------------
var localData;


// Function to store JSONP in global variable 
function jsonCallback (data) {
	localData = data; 
}

jsonCallback();










// Navigation script ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// on click of close icon close navigation
$('.nav-close').on('click', function (e) {
    myApp.closePanel();
});


// Hide splash screen after specified time
setTimeout(function() {
	navigator.splashscreen.hide();
}, 1000); 


$('.menu-icon-nav').on('click', function() { 
	$(this).toggleClass('close-panel open-panel');
});



// function for removing active class from nav 
function activeNavRemove() { 
	$(".content-block p").each(function () {
    	$(this).removeClass("active-nav");
	});
}





// global functions ------------------------------------------------------------------------------------


// Function to loop through all deals on page and add class to change star image sprite depending on the deals rating 
function starRating() { 

 	// add star rating class depending on deals rating 
    $('.star-rating').each(function(i,e) {
        var rating = $(this).text();
        if( rating == 1 ) {
           $(elem).addClass('rating-1').html('');
        } else if (rating == 2) {
           $(e).addClass('rating-2').html('');
        } else if(rating == 3) {
           $(e).addClass('rating-3').html('');
        } else if( rating == 4) {
           $(e).addClass('rating-4').html('');
        } else if( rating == 5) {
           $(e).addClass('rating-5').html('');
        }
    });

}





// global variable 

// variable to store href path to supplier logo depending on client name of deal, variable used to store supplier logo href path. Varible is used on the best deals page and search page so declared globally for use on both pages. Variable used in image src on append deals function, priceLowToHigh , priceHighToLow,  ratingSort functions    
var supplierLogo; 






/* login-page --------------------------------------------------------------------------------------------------------- */ 


// function to check dealchecker database to see if users email is valid on login page if not show error
function userLoginCallback(data) { 

	if ( data == '123578') { 
		$('#email-login').addClass('valid');
		$('#email-fail').removeClass('invalidEmail');
	} 

	else { 
		$('#email-fail').addClass('invalidEmail');
	}

}




$$(document).on('pageInit', '.page[data-page="login"]', function(e) {


	// check users login email address input value against emails stored in dealchecker database, Account validation ---------------------------------------------------------

	$('input#email-login').on('blur',  function() { 

		var emailInput = $('input#email-login').val();

		// Create script that uses jsonp request to check if email address user entered exists it database  
		var my_script = document.createElement('script');
		my_script.setAttribute('src','https://www.dealchecker.co.uk/user/user-exists/' + emailInput + '-jsonp.html?callback=userLoginCallback');
		document.head.appendChild(my_script);

		userLoginCallback();

	}); 




});


// Check if input has class then add href to login button
$('#login-button-container').on('click', function() { 
	if ( $('#email-login').hasClass('valid') ) { 
		$("a#login-button").attr("href", "#home");
	}
});










/* home-page --------------------------------------------------------------------------------------------------------- */ 
$$(document).on('pageInit', '.page[data-page="home"]', function(e) {

	activeNavRemove();
	$('.content-block p').eq(0).addClass('active-nav');
			
    // Sort deal data by Price - order by cheapest price
    localData.sort(function(a, b) {
	    var a1= a.price, b1= b.price;
	    if(a1== b1) return 0;
	    return a1> b1? 1: -1;
	});



    // store best price deal object in database in variable
    var todaysBestDeal = localData[0];
	

    // Cheapest deal Notification that shows on home page load
    myApp.addNotification({
        title: 'Todays best deal provided by ' + todaysBestDeal.clientName,
        subtitle: '<div class="todays-deal-destinations">' + todaysBestDeal.destination + '</div>' +  ", " + todaysBestDeal.accommodation  + " " + '<div class="todays-best-deals-price-container">'  + "£" + todaysBestDeal.price + "pp " + '</div>' +  '<span class="star-rating">' + todaysBestDeal.rating +  '</span>' + '<a class="view-todays-deal" href="#best-deals" > ' +  '<span class="view-deal-button">' + "View deal" +  '</span>' +  '<span class="blue-arrow-notifcation">  <svg version="1.1" id="blue-arrow-n" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="7px" height="8px" viewBox="0 0 9 10" style="enable-background:new 0 0 9 10;" xml:space="preserve"><path class="blue-arrow" d="M2.2,8.5c-0.3,0.3-0.3,0.7,0,1c0.3,0.3,0.8,0.3,1.1,0l4.3-4.1c0.3-0.3,0.3-0.7,0-1L3.3,0.4	C3,0.1,2.5,0.1,2.2,0.4s-0.3,0.7,0,1L6,5L2.2,8.5z"/></g></svg>  </span>'  + '</a>'   ,
        message: 'Hello, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut posuere erat. Pellentesque id elementum urna, a aliquam ante. Donec vitae volutpat orci. Aliquam sed molestie risus, quis tincidunt dui.',
        media: '<img width="44" height="44" style="border-radius:100%" src="img/todays-deal-img.svg">'
    });


    // Star raying function that adds star icon depending on deal rating
    starRating();


    // on click remove notification
    $('.view-todays-deal .view-deal-button').on('click', function() { 
    	$('.notifications').remove();
    });

});





// Script that runs on every other time the home page is loaded -----------------------------------------------------------
myApp.onPageReinit('home', function (page) {
   
	activeNavRemove();
	$('.content-block p').eq(0).addClass('active-nav');

});


	









 /* Search-page --------------------------------------------------------------------------------------------------------- */ 


// Script for search form submit ( has to be outside of search page js, as its a global variable thats used on the search deal landing page ) ----------------------------------------------------------------------------------------------------------------------

// Global variables 
var departure;
var destination;
var date;


// assign users search page values to variables  
var searchPageContainer = $('.search-bg-page');

searchPageContainer.find('.save-storage-data').on('click', function (e) {
	
	e.preventDefault();

	departure = $(searchPageContainer).find("#departing #autocomplete-dropdown-all").val();
	destination = $(searchPageContainer).find("#travel #autocomplete-dropdown-all").val();
	date = $(searchPageContainer).find("#calendar-default").val();

});




// start of code for search page 
$$(document).on('pageInit', '.page[data-page="search"]', function(e) {

	activeNavRemove();
	$('.content-block p').eq(1).addClass('active-nav');


	// Hide search page information popup on click of skip button 
	$('.skip-nano-guide').on('click', function(){ 
		$(this).parent().parent().hide();
	});



	// Autocomplete drop downs for departing airport input field -----------------------------------------------------------------------------------------------

	var autocompleteDropdownAll = myApp.autocomplete({

	    input: '#departing #autocomplete-dropdown-all',
	    openIn: 'dropdown',
	    source: function (autocomplete, query, render) {
	        

	        var results = [];
	    	var destinationInputVal = $('#travel #autocomplete-dropdown-all').val();




			// if user has hasnt chose a destination, show all avaliable airports in API

	    	if ( destinationInputVal  == "" ) {


	    		var departureWithAirportCode = [];


				// loop through local data and add all depature airport and departure airport codes to empty array 
				for ( var i = 0 ; i < localData.length; i ++ ) { 
					departureWithAirportCode.push( localData[i].departureAirportName + " " + localData[i].depAir );
				}


				// Create empty array to hold only unique depature airport and departure airport code values 
				var uniqueDepartureAirportNames = [];


				// Loop through array and push only unique values - code to remove duplicate values
				for(var i in departureWithAirportCode){
				    if(uniqueDepartureAirportNames.indexOf(departureWithAirportCode[i]) === -1){
				        uniqueDepartureAirportNames.push(departureWithAirportCode[i]);
				    }
				}
			 

			    // loop through unique depature airport and departure airport code values and push to results array (show in input dropdown) if users inputed text matches array values 
			    for (var i = 0; i < uniqueDepartureAirportNames.length; i++) {
			       
			       	if (uniqueDepartureAirportNames[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(uniqueDepartureAirportNames[i]);
			    
			    }

			}




			// if user has selected a destination, show only departure airports avaliable to that destination

			var departureAirportAvaliableForDestination = [];
			var uniqueDepartureAirportAvaliableForDestination = [];

			// Loop through returned deal information from API and populate dropdown with departure airports that are avaliable for the destination selected by user 
			for ( var i = 0; i < localData.length; i ++ ) { 
				if ( destinationInputVal == localData[i].destination  ) { 
					departureAirportAvaliableForDestination.push( localData[i].departureAirportName + " " + localData[i].depAir );						
				}
			}

			// Loop through array and push only unique values - code to remove duplicate values
			for(var i in departureAirportAvaliableForDestination){
			    if(uniqueDepartureAirportAvaliableForDestination.indexOf(departureAirportAvaliableForDestination[i]) === -1){
			        uniqueDepartureAirportAvaliableForDestination.push(departureAirportAvaliableForDestination[i]);
			    }
			}


			// loop through unique departure airport and departure airport code values and push to results array (show in input dropdown) if users inputed text matches array values 
		    for (var i = 0; i < uniqueDepartureAirportAvaliableForDestination.length; i++) {
		       	if (uniqueDepartureAirportAvaliableForDestination[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(uniqueDepartureAirportAvaliableForDestination[i]);
		    }


	        // Render items by passing array with result items
	        render(results);


	    }



	});






// Autocomplete drop down for destination input field -----------------------------------------------------------------------------------------------


	var autocompleteDropdownAll = myApp.autocomplete({
	    
	    input: '#travel #autocomplete-dropdown-all',
	    openIn: 'dropdown',
	    source: function (autocomplete, query, render) {
	  
			
	    // Show all destinations if departure input field is empty

			var results = [];	 
	    	var departureAirport = $('#departing #autocomplete-dropdown-all').val();

			if (departureAirport == "") { 

				//  array to store all avaliable destinations from API
				var allDestinations = [];

				// Loop through returned API data and push all destinations to array 
				for ( var i = 0 ; i < localData.length; i ++ ) { 
					allDestinations.push(localData[i].destination);
				}

				// array to store all unique desinations
				var uniqueAllDestinations = [];

				// loop through all destinations and push only unique destination values to array 
				for(var i in allDestinations){
				    if(uniqueAllDestinations.indexOf(allDestinations[i]) === -1){
				        uniqueAllDestinations.push(allDestinations[i]);
				    }
				}
		
				// loop through unique destinations values and push to results array (show in input dropdown) if users inputed text matches array values 
			    for (var i = 0; i < uniqueAllDestinations.length; i++) {
			       	if (uniqueAllDestinations[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(uniqueAllDestinations[i]);
			    }


			}	


		// Show only avaliable destinations for selected departure airport ----------------------------------------------------------
		    
			var avaliableDestinations = [];
			var uniqueDestinationNames = [];
		
			// Check to see the departure airport selected by user, push only destination avaliable from the selected departure to array
			for ( var i = 0 ; i < localData.length; i ++ ) { 
		    	if (( departureAirport == localData[i].departureAirportName + " " + localData[i].departureAirportCode )) { 
		    		avaliableDestinations.push(localData[i].destination);
		    	}
		    }

    		// fill array with only unique avaliable destinations 
			for(var i in avaliableDestinations){
		        if( uniqueDestinationNames.indexOf(avaliableDestinations[i]) === -1){
		            uniqueDestinationNames.push(avaliableDestinations[i]);
		        }
		    }


    		// push unique avaliable destinations to destination dropdown
		    for (var i = 0; i < uniqueDestinationNames.length; i++) { 
		       	if (uniqueDestinationNames[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(uniqueDestinationNames[i]);
		    }


	        // Render items by passing array with result items
	        render(results);		  
		  
	    }

	});




	// Remove text from inputs on click of input cross icon 
	$('.remove-text.destination-text').on('click', function() { 
		$(this).prev().val('');
	});


	$('.remove-text.departing-text').on('click', function() { 
		$(this).prev().val('');
	});


	$('.remove-text.calender-text').on('click', function() { 
		$('#calendar-default').val('');
	});




	// Show hide drop down on click , remove place holder text ------------------------------------------------------------------------------------------

	$('input,textarea').focus(function()	{
		$(this).parent().addClass('active');
	    $(this).data('placeholder',$(this).attr('placeholder'))
	          .attr('placeholder','');
	}).blur(function(){
		$(this).attr('placeholder',$(this).data('placeholder'));
	});




	// Remove departure search input value entered by user if the text they have entered is not a valid departure airport name avaliable in the dealchecker API 
	function invalidDeparture() { 
		for (i=0; i < localData.length; i++ ) { 
		 	if( $$('#departing #autocomplete-dropdown-all').val() !== localData[i].departureAirportName + " " + localData[i].depAir ) { 
		 		$$('#departing #autocomplete-dropdown-all').val("");	
		 	}
		}
	}


	// Remove user destination search input if invalid destination that is not avaliable in the dealchecker API
	function invalidDestination() { 
		for (i=0; i < localData.length; i++ ) { 
		 	if( $('#travel #autocomplete-dropdown-all').val() !== localData[i].destination ) { 
		 		$('#travel #autocomplete-dropdown-all').val("");	
		 	}
		}
	}



	// on input blur check if departure and destination input is valid by calling invalidDeparture and invalidDestination functions 
	$('#departing input#autocomplete-dropdown-all').on('blur', invalidDeparture);
	$('#travel input#autocomplete-dropdown-all').on('blur', invalidDestination);




	// Start of calender scripting --------------------------------------------------
	var avaliableHolidayDates = [];
	var uniqueHolidayDates = [];


	// Dynamic calender - show deal data depending on user input - runs everytime user clicks on calender input field
	$('#calendar-default').on('click', function () { 

		// show all departure dates avaliable in delachecker API in calender if departure and destination input values are empty
		if ( $('#departing #autocomplete-dropdown-all').val() == ""  &&  $('#travel #autocomplete-dropdown-all').val() == "" )   { 
		
			// loop through API data and and store all avaliable departure dates in array 
			for ( var i = 0 ; i < localData.length; i ++ ) { 
				avaliableHolidayDates.push(localData[i].departureDate.substring(0,10) );
			}


			// Loop through all avaliable departure dates and push only unique dates to new array 
			for(var i in avaliableHolidayDates){
			    if(uniqueHolidayDates.indexOf(avaliableHolidayDates[i]) === -1){
			        uniqueHolidayDates.push(avaliableHolidayDates[i]);
			    }
			}
		}



		for ( var i = 0; i < localData.length; i ++ ) { 
			
		// Filter calender dates to show dates for the departure value the user has selected only 
			if  ( $('#departing #autocomplete-dropdown-all').val() == localData[i].departureAirportName + " " + localData[i].departureAirportCode  &&  $('#travel #autocomplete-dropdown-all').val() == "" )   { 
				
				// store avaliable  dates for the selected departure
				avaliableHolidayDates.push(localData[i].departureDate.substring(0,10) );
		
				// Store unique avaliable dates in array
				for(var i in avaliableHolidayDates){
				    if(uniqueHolidayDates.indexOf(avaliableHolidayDates[i]) === -1){
				        uniqueHolidayDates.push(avaliableHolidayDates[i]);
				    }
				}
			}



		// Filter calender dates to show  dates for the destination value the user has selected only
			if  (  $('#departing #autocomplete-dropdown-all').val() == "" &&  $('#travel #autocomplete-dropdown-all').val() == localData[i].destination )   { 

				// store avaliable dates for the selected destination
				avaliableHolidayDates.push(localData[i].departureDate.substring(0,10) );

				// Store unique avaliable dates in array
				for(var i in avaliableHolidayDates){
				    if(uniqueHolidayDates.indexOf(avaliableHolidayDates[i]) === -1){
				        uniqueHolidayDates.push(avaliableHolidayDates[i]);
				    }
				}
			}



		// Filter calender dates to show  dates for the users selected departure and destination 

			if  ( $('#departing #autocomplete-dropdown-all').val() == localData[i].departureAirportName + " " + localData[i].departureAirportCode &&  $('#travel #autocomplete-dropdown-all').val() == localData[i].destination )   { 

				// store avaliable dates for the selected destination
				avaliableHolidayDates.push(localData[i].departureDate.substring(0,10) );

				// Store unique avaliable dates in array
				for(var i in avaliableHolidayDates){
				    if(uniqueHolidayDates.indexOf(avaliableHolidayDates[i]) === -1){
				        uniqueHolidayDates.push(avaliableHolidayDates[i]);
				    }
				}

			}	
		}
	});






// Popup calender functionality 

$('#calendar-default').on('click', function () { 
	
	// add class to show calender on click of calender input field 	
	$('#calendar').addClass('show-calender');

	// Calender parameters defined here
	$('#calendar').datepicker({
		
		// show all months of the year
	    showOtherMonths: true,
	   	// set format for dates in the week 
	    dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	    // set date format for selected date shown in input field 
	    dateFormat : 'dd/mm/yyyy',
   

	    beforeShowDay: function(d) {
	        // normalize the date for searching in array
	        var dmy = "";
	        dmy += ("00" + d.getDate()).slice(-2) + "/";
	        dmy += ("00" + (d.getMonth() + 1)).slice(-2) + "/";
	        dmy += d.getFullYear();
	        if ($.inArray(dmy, uniqueHolidayDates) >= 0) {
	            return [true, ""];
	        }
	        else {
	            return [false, ""];
	        }

	    },

	  	onSelect: function (date) {
	       
	       $('#calendar-default').val(date.substring(0,10)).trigger('change');
	       $('#calendar').removeClass('show-calender');

	    }

	});


	// Check if close button exist if not add close button to calender 
	if ($('#close-calender').length == 0) {
    	$('#calendar').append('<div id="close-calender"> Close </div>');
	}
		

});




// Add click event to dynamically appended calender close button
$('body').on('click', '#close-calender', function() { 
	$('#calendar').removeClass('show-calender');
});





// Code to show hide input clearing icon on inputs, if input has value or not 

$('#departing input#autocomplete-dropdown-all').each(function() {
   var elem = $(this);

   // Save current value of element
   elem.data('oldVal', elem.val());

   // Look for changes in the value
   elem.bind("propertychange change click keyup input paste", function(event){
      // If value has changed...
      if (elem.data('oldVal') != elem.val()) {
       // Updated stored value
       elem.data('oldVal', elem.val());

       // Do action
      
       $('#departing .remove-text').show();

      }


	   if ( $('#calendar-default').val().length !== 0 ) { 
		  $('#calendar-default').val("");
	   }


   });
 });



$('#travel input#autocomplete-dropdown-all').each(function() {
   var elem = $(this);

   // Save current value of element
   elem.data('oldVal', elem.val());

   // Look for changes in the value
   elem.bind("propertychange change click keyup input paste", function(event){
      // If value has changed...
      if (elem.data('oldVal') != elem.val()) {
       // Updated stored value
       elem.data('oldVal', elem.val());

       // Do action
      
       $('#travel .remove-text').show();

     }


    if ( $('#calendar-default').val().length !== 0 ) { 
		$('#calendar-default').val("");
	}

   });


 });




$('input#calendar-default').each(function() {
   var elem = $(this);

   // Save current value of element
   elem.data('oldVal', elem.val());

   // Look for changes in the value
   elem.bind("propertychange change click keyup input paste", function(event){
      // If value has changed...
      if (elem.data('oldVal') != elem.val()) {
       // Updated stored value
       elem.data('oldVal', elem.val());

       // Do action 
       $('.leaving-container .remove-text').show();

     }
   });
 });





// onclick of input close button, then hide close button  
$('.remove-text').bind('click', function() {
    $(this).hide();
});




// Hide calender from view if either departing or departure input is clicked by user
$('#autocomplete-dropdown-all').on('click', function() { 
	if ( $('#calendar').hasClass('show-calender') ) { 
		$('#calendar').removeClass('show-calender');
	}
});






//  if one input field is not empty add href to button Search button, allowing user to make a search with there chosen requirments 

$('.compare-button').on('click', function () { 
	
	var departingVal = $('#departing input#autocomplete-dropdown-all').val();
	var destinationVal = $('#travel input#autocomplete-dropdown-all').val();
	var dateVal = $('#calendar-default').val();

	// If no values are inputted remove href from search button
	if ( departingVal  == "" &&  destinationVal == "" && dateVal == "" ) { 
		$(".compare-button").removeAttr('href');
	} 

	// If one of the search requirments are meet add href to search button, allowing user to make a search
	if ( departingVal !== "" || destinationVal !== "" || dateVal !== "" ) { 
		$(".compare-button").attr("href", "#deal-landing");
	}


});




// on click of input check all input fields, if a input is empty hide clear text icon button
$('input').on('click', function() { 
	if ( $(this).val("") ) { 
		$(this).next().hide();
	}
});





// End of search page --------------------------------------------------------------------------------------------------------------------------------------------------------
});








// Script that runs on every other time the searchpage is page is init\loaded - this is needed as framework7 caches pages 
myApp.onPageReinit('search', function (page) {
   
	activeNavRemove();
	// add class to nav to highlight that the user is on search page 
	$('.content-block p').eq(1).addClass('active-nav');


	// Remove all saved inputed search values 
	$('#departing #autocomplete-dropdown-all').val("");
	$('#travel #autocomplete-dropdown-all').val("");
	$('#calendar-default').val("");

	// remove cross icon from inputs 
	$('.remove-text').hide();


	// assign users search page values to variables  
	var searchPageContainer = $('.search-bg-page');

	// on search button click get store all values in input fields 
	searchPageContainer.find('.save-storage-data').on('click', function (e) {
		e.preventDefault();
		departure = $(searchPageContainer).find("#departing #autocomplete-dropdown-all").val();
		destination = $(searchPageContainer).find("#travel #autocomplete-dropdown-all").val();
		date = $(searchPageContainer).find("#calendar-default").val(); 
	});

});















// Deal landing page -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


$$(document).on('pageInit', '.page[data-page="deal-landing"]', function(e) {

	activeNavRemove();
	
	var supplierLogo; 


	// appends all html to deal, with specific deal details depending on users search choices 
	function appendInputedDataToDeal() { 
		
		$('.deal-landing-page #deals-container').append(


		    '<div class="deal-wrappr">' + 
		      '<div class="deal-info-container" style="background-image: url(' + localData[i].contentImage + '), url(img/no-image450x250.jpg);">' +  
		         
		        '<div class="result-price-container">' + 
		            '<span class="result-price">' + "fr" + " " + 
		              '<span class="pnd">' + "£" + '</span>' + 
		              '<span class="price-inner">'  + localData[i].price + '</span>' + " " 
		               + 'pp' + 
		            '</span>' + 
		        '</div>' + 

		        '<div class="deal-logo">' + 
		             '<img src="' +	supplierLogo + '" alt="' + '" />' + 
		        '</div>' + 

		        '<div class="inner-deal-summary-container">' + 
		            '<span class="accomodation">' +  localData[i].accommodation + '</span>'  + 
		            '<span class="destination-icon"> <svg version="1.1" id="destination-icon-red" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="28.4px" height="41.6px" viewBox="0 0 28.4 41.6" style="enable-background:new 0 0 28.4 41.6;" xml:space="preserve"><g><path class="destination-icon-white" d="M28.2,14.5c0-7.7-6.3-14-14-14s-14,6.3-14,14c0,10.9,14,26.4,14,26.4S28.2,25.4,28.2,14.5z M8,14.5	c0-3.4,2.8-6.2,6.2-6.2s6.2,2.8,6.2,6.2c0,3.4-2.8,6.2-6.2,6.2S8,18,8,14.5z"/></g></svg>  </span>' + 
		            '<span class="destination">' +  localData[i].destination  + '</span>' +  
		            '<span class="star-rating-container">' +  
		              '<span class="star-rating">' + localData[i].rating  +  '</span>' + 
	            	'</span>' +
 	          	'</div>' +

	        '</div>' + 

		    '<div class="result-bottom">' + 
		        '<div class="result-flight">' + 
		          
		          '<div class="result-outbound">' +
		            '<span class="result-dep-airport">' +  localData[i].depAir   + '</span>' +
		            '<div class="result-dep-dates-container">' + 
		              '<span class="dep-date">' +  localData[i].departureDate  + '</span>' +
		            '</div>' +
		          '</div>' +
		          
		          '<div class="result-return">' + '<svg version="1.1" id="plane-icon-blue" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="74.4px" viewBox="0 0 40 74.4" style="enable-background:new 0 0 40 74.4;" xml:space="preserve"><path id="Shape_8_copy_2" class="plane-icon" d="M39.3,16.8c0,1.8-2.7,2-2.7,2h-9.3L16.8,34.7h-3.2l3.1-15.9H7.4l-6.6,6.5l1.3-7.8v-1.3l-1.3-8l6.6,6.6h9.3L13.6,0.2h3.2l10.5,14.6h9.3C36.6,14.9,39.3,15,39.3,16.8z"/><path id="Shape_8_copy_2_1_" class="plane-icon" d="M4.1,53.4h9.3l10.5-14.6h3.2L24,53.4h9.3l6.6-6.6l-1.3,8v1.3l1.3,7.8l-6.6-6.5H24	l3.1,15.9h-3.2L13.4,57.4H4.1c0,0-2.7-0.2-2.7-2S4.1,53.4,4.1,53.4z"/></svg>' +
		            '<span class="result-return-airport">' + localData[i].destAir + '</span>' + 
		            '<div class="result-return-dates-container">' + 
		              '<span class="return-date">' + localData[i].returnDate + '</span>' + 
		            '</div>' +
		          '</div>' +

		        '</div>' + 

		        '<div class="result-price-and-button-container">' + 
		          '<a href="#" onclick="window.open(\' '  + localData[i].deepLink  + ' \' ,   \'_system\'  ); "> ' +
		            '<span class="view-deal-button">' + "View deal" + '<svg version="1.1" id="view-deals-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12.8px" height="13.4px" viewBox="0 0 12.8 13.4" style="enable-background:new 0 0 12.8 13.4;" xml:space="preserve"><path d="M0.9,12.4V1c0-0.3,0.2-0.5,0.4-0.7c0.3-0.2,0.6-0.1,0.9,0L12,6c0.3,0.1,0.4,0.4,0.4,0.6c0,0.3-0.2,0.5-0.4,0.7L2.3,13	c-0.1,0.1-0.3,0.1-0.5,0.2c-0.2,0-0.3,0-0.4-0.1C1.1,12.9,0.9,12.7,0.9,12.4z"/></svg>' +
				    '</span>' + 
		          '</a>' + 
		        '</div>' + 
		      
		      '</div>' +

		    '</div>'

		);



	 //  add supplier logo depending on supplier client name,  all possible supplier working with dealchecker
		if ( localData[i].clientName == "ebookersHolidayFeed"  ) { 

			supplierLogo = "img/ebookers.gif";

		} else if (localData[i].clientName == "Qwerty Travel") { 

			supplierLogo = "img/qwertyHolidays.gif";


		} else if (localData[i].clientName == "Holiday Place") { 

			supplierLogo = "img/holidayPlaceHolidays.gif";

		} else if (localData[i].clientName == "blueseaHolidays") { 

			supplierLogo = "img/blueseaHolidays.gif";

		} else if (localData[i].clientName == "onTheBeachHolidaysFeed") { 

			supplierLogo = "img/onTheBeachHolidays.gif";

		} else if (localData[i].clientName == "Iglu Ski") { 

			supplierLogo = "img/igluski.gif";

		}  else if (localData[i].clientName == "travelRepublic") { 

			supplierLogo = "img/ travelRepublic.gif";

		}  else if (localData[i].clientName == "skiHappyHolidays") { 

			supplierLogo = "img/skiHappyHolidays.gif";

		} else if (localData[i].clientName == "netflightsHolidays") { 

			supplierLogo = "img/netflightsHolidays.gif";

		} else if (localData[i].clientName == " jet2HolidaysHolidayDealsFeed") { 

			supplierLogo = "img/jet2HolidaysHolidayDealsFeed.gif";

		} else if (localData[i].clientName == "perfectHolidaysRTHoliday") { 

			supplierLogo = "img/ perfectHolidaysRTHolidays.gif";

		} else if (localData[i].clientName == "holidayGenieRTHolidays") { 

			supplierLogo = "img/holidayGenieRTHolidays.gif";

		} else if (localData[i].clientName == "goNorthCyprusRTHolidays") { 

		
			supplierLogo = "img/goNorthCyprusRTHolidays.gif";		

		}

			

		//hide logo if underfined
		$('.deal-logo img').error(function(){
		    $(this).parent().hide(); 
		});


	
	}







//  For loop containing conditions to display deals depending on user input   ------------------------------------------------------------------------------------------------------------------------------------------------------------------

	// loop through each object in returned data array 
	for( var i=0;  i < localData.length;  i++)  {
		
		// Departure and destination and date search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

		if ( ( localData[i].departureAirportName + " " + localData[i].departureAirportCode == departure ) && ( localData[i].destination == destination ) && ( localData[i].departureDate.substring(0,10) == date ) ) {  
			appendInputedDataToDeal();     
		}


		// Departure and destination only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

		else if ( (  localData[i].departureAirportName + " " + localData[i].departureAirportCode == departure ) && (  localData[i].destination == destination ) && (date == "") ) {
	 		appendInputedDataToDeal();
		}


		// Departure airport and date search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    
		
		else if ( (localData[i].departureDate.substring(0,10) == date) && ( localData[i].departureAirportName + " " + localData[i].departureAirportCode == departure ) && (destination == "") ) { 
	 		appendInputedDataToDeal();
		}



		// Destination and date search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    
		
		else if( ( localData[i].departureDate.substring(0,10) == date  ) && ( localData[i].destination == destination  ) && (departure == "")  ){ 	
	     	appendInputedDataToDeal();
	    }


		// Departure only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    
		
		else if( ( localData[i].departureAirportName + " " + localData[i].departureAirportCode == departure  ) && (date == "") && (destination == "") ){ 	
	     	appendInputedDataToDeal();
	    }


		// Destination only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

		else if( (localData[i].destination == destination ) && (date == "") && (departure == "") ) { 
			appendInputedDataToDeal();
		}



		// Date only search 
		else if( (localData[i].departureDate.substring(0,10) == date ) && (destination == "") && (departure == "") ) { 
			appendInputedDataToDeal();
		}

	}



 	// Add star rating class depending on deals rating 
    starRating();

    // code to display the users chosen destination and how many deals have be found for that destination 
	if (destination == "") { 
		$("#search-destination").html("");
	}
	else {  
	 	$("#search-destination").html("in" + " " + destination);
	}

	var DealCounter = $('.deal-landing-page #deals-container .deal-wrappr').length;
	$("#deal-count").html(DealCounter);



// closing brackets for deal landing scripts -------------------------------------------------------------------------------------------------------------------------------------------------------
});














// Script that runs on every other time the deallanding page is init\loaded  
myApp.onPageReinit('deal-landing', function (page) {
   

	activeNavRemove();


	// Hide previous searched deals on page load , so only new search deals show 
	$(".deal-landing-page #deals-container .deal-wrappr").each(function () {
	    $(this).remove();
	});




	function appendInputedDataToDeal() { 
		
		$('.deal-landing-page #deals-container').append(


		    '<div class="deal-wrappr">' + 
		      '<div class="deal-info-container" style="background-image: url(' + localData[i].contentImage + '), url(img/no-image450x250.jpg);">' +  
		         
		        '<div class="result-price-container">' + 
		            '<span class="result-price">' + "fr" + " " + 
		              '<span class="pnd">' + "£" + '</span>' + 
		              '<span class="price-inner">'  + localData[i].price + '</span>' + " " 
		               + 'pp' + 
		            '</span>' + 
		        '</div>' + 

		        '<div class="deal-logo">' + 
		            '<img src="'  + supplierLogo + '" alt="' + '" />' + 
		        '</div>' + 

		        '<div class="inner-deal-summary-container">' + 
		            '<span class="accomodation">' +  localData[i].accommodation + '</span>'  + 
		            '<span class="destination-icon"> <svg version="1.1" id="destination-icon-red" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="28.4px" height="41.6px" viewBox="0 0 28.4 41.6" style="enable-background:new 0 0 28.4 41.6;" xml:space="preserve"><g><path class="destination-icon-white" d="M28.2,14.5c0-7.7-6.3-14-14-14s-14,6.3-14,14c0,10.9,14,26.4,14,26.4S28.2,25.4,28.2,14.5z M8,14.5	c0-3.4,2.8-6.2,6.2-6.2s6.2,2.8,6.2,6.2c0,3.4-2.8,6.2-6.2,6.2S8,18,8,14.5z"/></g></svg>  </span>' + 
		            '<span class="destination">' +  localData[i].destination  + '</span>' +  
		            '<span class="star-rating-container">' +  
		              '<span class="star-rating">' + localData[i].rating  +  '</span>' + 
	            	'</span>' +
 	          	'</div>' +

	        '</div>' + 

		    '<div class="result-bottom">' + 
		        '<div class="result-flight">' + 
		          
		          '<div class="result-outbound">' +
		            '<span class="result-dep-airport">' +  localData[i].depAir   + '</span>' +
		            '<div class="result-dep-dates-container">' + 
		              '<span class="dep-date">' +  localData[i].departureDate  + '</span>' +
		            '</div>' +
		          '</div>' +
		          
		          '<div class="result-return">' + '<svg version="1.1" id="plane-icon-blue" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="74.4px" viewBox="0 0 40 74.4" style="enable-background:new 0 0 40 74.4;" xml:space="preserve"><path id="Shape_8_copy_2" class="plane-icon" d="M39.3,16.8c0,1.8-2.7,2-2.7,2h-9.3L16.8,34.7h-3.2l3.1-15.9H7.4l-6.6,6.5l1.3-7.8v-1.3l-1.3-8l6.6,6.6h9.3L13.6,0.2h3.2l10.5,14.6h9.3C36.6,14.9,39.3,15,39.3,16.8z"/><path id="Shape_8_copy_2_1_" class="plane-icon" d="M4.1,53.4h9.3l10.5-14.6h3.2L24,53.4h9.3l6.6-6.6l-1.3,8v1.3l1.3,7.8l-6.6-6.5H24	l3.1,15.9h-3.2L13.4,57.4H4.1c0,0-2.7-0.2-2.7-2S4.1,53.4,4.1,53.4z"/></svg>' +
		            '<span class="result-return-airport">' + localData[i].destAir + '</span>' + 
		            '<div class="result-return-dates-container">' + 
		              '<span class="return-date">' + localData[i].returnDate + '</span>' + 
		            '</div>' +
		          '</div>' +

		        '</div>' + 

		        '<div class="result-price-and-button-container">' + 
		          '<a href="#" onclick="window.open(\' '  + localData[i].deepLink  + ' \' ,   \'_system\'  ); "> ' +
		            '<span class="view-deal-button">' + "View deal" + '<svg version="1.1" id="view-deals-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12.8px" height="13.4px" viewBox="0 0 12.8 13.4" style="enable-background:new 0 0 12.8 13.4;" xml:space="preserve"><path d="M0.9,12.4V1c0-0.3,0.2-0.5,0.4-0.7c0.3-0.2,0.6-0.1,0.9,0L12,6c0.3,0.1,0.4,0.4,0.4,0.6c0,0.3-0.2,0.5-0.4,0.7L2.3,13	c-0.1,0.1-0.3,0.1-0.5,0.2c-0.2,0-0.3,0-0.4-0.1C1.1,12.9,0.9,12.7,0.9,12.4z"/></svg>' +
		          '</a>' + 
		        '</div>' + 
		      
		      '</div>' +

		    '</div>'

		);
	


	 //  add supplier logo depending on supplier client name,  all possible supplier working with dealchecker
		if ( localData[i].clientName == "ebookersHolidayFeed"  ) { 

			supplierLogo = "img/ebookers.gif";

		} else if (localData[i].clientName == "Qwerty Travel") { 

			supplierLogo = "img/qwertyHolidays.gif";


		} else if (localData[i].clientName == "Holiday Place") { 

			supplierLogo = "img/holidayPlaceHolidays.gif";

		} else if (localData[i].clientName == "blueseaHolidays") { 

			supplierLogo = "img/blueseaHolidays.gif";

		} else if (localData[i].clientName == "onTheBeachHolidaysFeed") { 

			supplierLogo = "img/onTheBeachHolidays.gif";

		} else if (localData[i].clientName == "Iglu Ski") { 

			supplierLogo = "img/igluski.gif";

		}  else if (localData[i].clientName == "travelRepublic") { 

			supplierLogo = "img/ travelRepublic.gif";

		}  else if (localData[i].clientName == "skiHappyHolidays") { 

			supplierLogo = "img/skiHappyHolidays.gif";

		} else if (localData[i].clientName == "netflightsHolidays") { 

			supplierLogo = "img/netflightsHolidays.gif";

		} else if (localData[i].clientName == " jet2HolidaysHolidayDealsFeed") { 

			supplierLogo = "img/jet2HolidaysHolidayDealsFeed.gif";

		} else if (localData[i].clientName == "perfectHolidaysRTHoliday") { 

			supplierLogo = "img/ perfectHolidaysRTHolidays.gif";

		} else if (localData[i].clientName == "holidayGenieRTHolidays") { 

			supplierLogo = "img/holidayGenieRTHolidays.gif";

		} else if (localData[i].clientName == "goNorthCyprusRTHolidays") { 

		
			supplierLogo = "img/goNorthCyprusRTHolidays.gif";		

		}

			

		// hide deal logo if url are underfined
		$('.deal-logo img').error(function(){
		    $(this).parent().hide(); 
		});


	}



//  For loop containing conditions to display deals depending on user input   ------------------------------------------------------------------------------------------------------------------------------------------------------------------

	// loop through each object in returned data array 
	for( var i=0;  i < localData.length;  i++)  {
		
			// Departure and destination and date search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

		if ( (  localData[i].departureAirportName + " " + localData[i].departureAirportCode == departure ) && (  localData[i].destination == destination )  && ( localData[i].departureDate.substring(0,10) == date ) ) {  

			appendInputedDataToDeal();     
		}


		// Departure and destination only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

		else if ( (  localData[i].departureAirportName + " " + localData[i].departureAirportCode == departure ) && (  localData[i].destination == destination ) && (date == "") ) {
	  
	 		appendInputedDataToDeal();
		}


		// Departure airport and date search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    
		
		else if ( (localData[i].departureDate.substring(0,10) == date) && ( localData[i].departureAirportName + " " + localData[i].departureAirportCode == departure ) && (destination == "") ) { 

	 		appendInputedDataToDeal();
		}


		// Destination and date search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    
		
		else if( ( localData[i].departureDate.substring(0,10) == date  ) && ( localData[i].destination == destination  ) && (departure == "")  ){ 	
		
	     	appendInputedDataToDeal();

	    }


		// Departure only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    
		
		else if( ( localData[i].departureAirportName + " " + localData[i].departureAirportCode == departure  ) && (date == "") && (destination == "") ){ 	

	     	appendInputedDataToDeal();
	    }


		// Destination only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

		else if( (localData[i].destination == destination ) && (date == "") && (departure == "") ) { 
	
			appendInputedDataToDeal();
		}



		// Date only search 
		else if( (localData[i].departureDate.substring(0,10) == date ) && (destination == "") && (departure == "") ) { 
			
			appendInputedDataToDeal();
		}
		// End of if else statement 


	}



 	// add star rating class depending on deals rating 
    starRating();



    // code to display the users chosen destination and how many deals have be found for that destination 
	if (destination == "") { 
		$("#search-destination").html("");
	}
	else {  
	 	$("#search-destination").html("in" + " " + destination);
	}

	// find amount of deal result found 
	var DealCounter = $('.deal-landing-page #deals-container .deal-wrappr').length;
	
	// add deal amount to html, showing user amount of deals found
	$("#deal-count").html(DealCounter);




});

// end of deal landing page -----------------------------------------------------




	










// Functions for best deals page -------------------------------------------------------------------------------------------------------


// function for sorting deals into lowest price and appending to html dynamically

function priceLowToHigh () { 

	console.log(localData);

	// Sort by Price - return best priced deals 
    localData.sort(function(a, b) {
	    var a1= a.price, b1= b.price;
	    if(a1== b1) return 0;
	    return a1> b1? 1: -1;
	   
	});


    // Remove all deals from previous search
	$(".best-deals-page #deals-container .deal-wrappr").each(function () {
	    $(this).remove();
	});



	// loop through each object in returned data array 
    for( var i=0;  i < localData.length;  i++) {
  	
       	$('.best-deals-page #deals-container').append(

		    '<div class="deal-wrappr">' + 
		      '<div class="deal-info-container" style="background-image: url(' + localData[i].contentImage + '),  url(img/no-image450x250.jpg); ">'  +  
		         
		         '<div class="result-price-container">' + 
		            '<span class="result-price">' + "fr" + " " + 
		              '<span class="pnd">' + "£" + '</span>' + 
		              '<span class="price-inner">'  + localData[i].price + '</span>' + " " 
		               + 'pp' + 
		            '</span>' + 
		          '</div>' + 

		          '<div class="deal-logo">' + 
		            '<img src="' +	supplierLogo + '" alt="' + '" />' + 
		          '</div>' + 

		          '<div class="inner-deal-summary-container">' + 
		            '<span class="accomodation">' +  localData[i].accommodation + '</span>'  +
		            '<span class="destination-icon"> <svg version="1.1" id="destination-icon-red" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="28.4px" height="41.6px" viewBox="0 0 28.4 41.6" style="enable-background:new 0 0 28.4 41.6;" xml:space="preserve"><g><path class="destination-icon-white" d="M28.2,14.5c0-7.7-6.3-14-14-14s-14,6.3-14,14c0,10.9,14,26.4,14,26.4S28.2,25.4,28.2,14.5z M8,14.5	c0-3.4,2.8-6.2,6.2-6.2s6.2,2.8,6.2,6.2c0,3.4-2.8,6.2-6.2,6.2S8,18,8,14.5z"/></g></svg>  </span>' + 
		            '<span class="destination">' +  localData[i].destination  + '</span>' +  
		            '<span class="star-rating-container">' +  
		              '<span class="star-rating">' + localData[i].rating  +  '</span>' + 
		            '</span>' +
		          '</div>' +



		          '<div class="social-popup ">' +

	                  '<a href="#" class="social-button" onclick="window.plugins.socialsharing.share( \' '   + localData[i].deepLink  + ' \'  )">' +

	                    '<span class="share-icon-container">' +
	                      
	                      '<svg version="1.1" class="share-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="49.7px" height="58.8px" viewBox="0 0 49.7 58.8" style="enable-background:new 0 0 49.7 58.8;" xml:space="preserve">' +

	                      '<path class="share-white-icon" d="M40,39.2c-2.1,0-4.1,0.7-5.8,2L19,32.8c0.3-0.9,0.5-2,0.5-3.1s-0.2-2.1-0.5-3.1l16-8.9c1.5,0.9,3.3,1.4,5,1.4  c5.2,0,9.5-4.3,9.5-9.5S45.2,0.2,40,0.2s-9.5,4.3-9.5,9.5c0,1.5,0.3,2.9,1,4.2l-15.3,8.6c-1.7-1.5-3.8-2.3-6.2-2.3  c-5.2,0-9.5,4.3-9.5,9.5s4.3,9.5,9.5,9.5c2.3,0,4.5-0.8,6.2-2.3l15,8.3c-0.4,1.1-0.7,2.3-0.7,3.5c0,5.2,4.3,9.5,9.5,9.5 s9.5-4.3,9.5-9.5S45.2,39.2,40,39.2z"/>' +
	                      
	                      '</svg>' +

	                    '</span>' +

	                    '<span class="share-title"> SHARE </span>' +
	                    
	                  '</a>' +
	   
	                '</div>' +


			   '</div>' + 

		      '<div class="result-bottom">' + 
		        '<div class="result-flight">' + 
		          
		          '<div class="result-outbound">' +
		            '<span class="result-dep-airport">' +  localData[i].depAir   + '</span>' +
		            '<div class="result-dep-dates-container">' + 
		              '<span class="dep-date">' +  localData[i].departureDate  + '</span>' +
		            '</div>' +
		          '</div>' +
		          
		          '<div class="result-return">' + '<svg version="1.1" id="plane-icon-blue" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="74.4px" viewBox="0 0 40 74.4" style="enable-background:new 0 0 40 74.4;" xml:space="preserve"><path id="Shape_8_copy_2" class="plane-icon" d="M39.3,16.8c0,1.8-2.7,2-2.7,2h-9.3L16.8,34.7h-3.2l3.1-15.9H7.4l-6.6,6.5l1.3-7.8v-1.3l-1.3-8l6.6,6.6h9.3L13.6,0.2h3.2l10.5,14.6h9.3C36.6,14.9,39.3,15,39.3,16.8z"/><path id="Shape_8_copy_2_1_" class="plane-icon" d="M4.1,53.4h9.3l10.5-14.6h3.2L24,53.4h9.3l6.6-6.6l-1.3,8v1.3l1.3,7.8l-6.6-6.5H24	l3.1,15.9h-3.2L13.4,57.4H4.1c0,0-2.7-0.2-2.7-2S4.1,53.4,4.1,53.4z"/></svg>' +
		            '<span class="result-return-airport">' + localData[i].destAir + '</span>' + 
		            '<div class="result-return-dates-container">' + 
		              '<span class="return-date">' + localData[i].returnDate + '</span>' + 
		            '</div>' +
		          '</div>' +

		        '</div>' + 

		        '<div class="result-price-and-button-container">' + 
		          '<a href="#" onclick="window.open(\' '  + localData[i].deepLink  + ' \' ,   \'_system\'  ); "> ' +
		            '<span class="view-deal-button">' + "View deal" + '<svg version="1.1" id="view-deals-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12.8px" height="13.4px" viewBox="0 0 12.8 13.4" style="enable-background:new 0 0 12.8 13.4;" xml:space="preserve"><path d="M0.9,12.4V1c0-0.3,0.2-0.5,0.4-0.7c0.3-0.2,0.6-0.1,0.9,0L12,6c0.3,0.1,0.4,0.4,0.4,0.6c0,0.3-0.2,0.5-0.4,0.7L2.3,13	c-0.1,0.1-0.3,0.1-0.5,0.2c-0.2,0-0.3,0-0.4-0.1C1.1,12.9,0.9,12.7,0.9,12.4z"/></svg>' +
		          '</a>' + 
		        '</div>' + 
		      
		      '</div>' +

		    '</div>'

		);

		
	 //  add supplier logo depending on supplier client name,  all possible supplier working with dealchecker
		if ( localData[i].clientName == "ebookersHolidayFeed"  ) { 

			supplierLogo = "img/ebookers.gif";

		} else if (localData[i].clientName == "Qwerty Travel") { 

			supplierLogo = "img/qwertyHolidays.gif";


		} else if (localData[i].clientName == "Holiday Place") { 

			supplierLogo = "img/holidayPlaceHolidays.gif";

		} else if (localData[i].clientName == "blueseaHolidays") { 

			supplierLogo = "img/blueseaHolidays.gif";

		} else if (localData[i].clientName == "onTheBeachHolidaysFeed") { 

			supplierLogo = "img/onTheBeachHolidays.gif";

		} else if (localData[i].clientName == "Iglu Ski") { 

			supplierLogo = "img/igluski.gif";

		}  else if (localData[i].clientName == "travelRepublic") { 

			supplierLogo = "img/ travelRepublic.gif";

		}  else if (localData[i].clientName == "skiHappyHolidays") { 

			supplierLogo = "img/skiHappyHolidays.gif";

		} else if (localData[i].clientName == "netflightsHolidays") { 

			supplierLogo = "img/netflightsHolidays.gif";

		} else if (localData[i].clientName == " jet2HolidaysHolidayDealsFeed") { 

			supplierLogo = "img/jet2HolidaysHolidayDealsFeed.gif";

		} else if (localData[i].clientName == "perfectHolidaysRTHoliday") { 

			supplierLogo = "img/ perfectHolidaysRTHolidays.gif";

		} else if (localData[i].clientName == "holidayGenieRTHolidays") { 

			supplierLogo = "img/holidayGenieRTHolidays.gif";

		} else if (localData[i].clientName == "goNorthCyprusRTHolidays") { 
		
			supplierLogo = "img/goNorthCyprusRTHolidays.gif";		

		}

			

		//hide logo if underfined
		$('.deal-logo img').error(function(){
		    $(this).parent().hide(); 
		});


    }	




    // add star rating class depending on deals rating 
    starRating();


  	// add class to remove margin from top deal 
    $('.best-deals-page #deals-container .deal-wrappr').eq(0).addClass('best');
   
    // add low price svg icon to lowest priced deal
    $('.deal-wrappr.best .result-price-container').prepend( '<svg version="1.1" id="banner-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"width="38.6px" height="55.4px" viewBox="0 0 38.6 55.4" style="enable-background:new 0 0 38.6 55.4;" xml:space="preserve"><path class="banner-icon" d="M19.5,12c-0.1,0-0.3,0-0.4,0c-2.1,0.2-4.1,2-3.9,4.7c0,0.2,0,0.4,0.1,0.7c-0.2,0-0.4,0-0.5,0c-0.6,0-1,0.6-1,1.1s0.6,1,1.1,1h0.6c0,0.4,0.1,0.8,0.1,1.1c0,0.9-0.2,1.6-0.9,2.6c-0.2,0.3-0.2,0.8-0.1,1.1s0.6,0.6,1,0.6h7.2c0.6,0,1.1-0.5,1.1-1.1s-0.5-1.1-1.1-1.1h-5.5c0.3-0.7,0.4-1.4,0.4-2.1c0-0.4,0-0.7-0.1-1.1h2.6c0.6,0,1.1-0.5,1.1-1.1s-0.5-1.1-1.1-1.1h-2.8c0-0.3,0-0.5-0.1-0.8l0,0c-0.1-1.6,0.9-2.3,2-2.4c0.6-0.1,1.1,0.1,1.5,0.4s0.7,0.7,0.8,1.5c0.1,0.6,0.6,1,1.2,1c0.6-0.1,1-0.6,1-1.2c-0.1-1.3-0.8-2.4-1.7-3C21.4,12.3,20.4,12,19.5,12z"/><path class="banner-icon" d="M15.9,39.6c0.6,0,1.2-0.1,1.8-0.3l-6.1,15.2c-0.2,0.5-0.8,0.5-1.1,0.1l-2.9-5.1c-0.1-0.2-0.3-0.2-0.5-0.2L1.7,51c-0.5,0.2-0.9-0.3-0.7-0.8l5.8-14.4c0.8,0.4,1.6,0.6,2.5,0.6c0.4,0,0.7-0.1,1.1-0.1h0.1l0.1,0.1C11.6,38.4,13.7,39.6,15.9,39.6z M32.2,35.9c-0.8,0.4-1.6,0.6-2.6,0.6c-0.4,0-0.7-0.1-1.1-0.1h-0.1l-0.1,0.1c-1.1,1.9-3.1,3.1-5.3,3.1c-0.6,0-1.2-0.1-1.8-0.3l6.1,15.3c0.2,0.5,0.8,0.5,1.1,0.1l2.9-5.1c0.1-0.2,0.3-0.2,0.5-0.2l5.4,1.7c0.5,0.2,0.9-0.3,0.7-0.8L32.2,35.9z"/><path class="banner-icon" d="M37.1,17.1c1.1,1,1.1,2.7,0,3.6l-0.7,0.6c-0.8,0.7-1.1,1.8-0.6,2.8l0.4,0.9c0.6,1.4-0.2,2.9-1.6,3.3l-0.9,0.2c-1,0.3-1.7,1.2-1.8,2.2l-0.1,0.9c-0.1,1.5-1.4,2.5-2.9,2.3L28,33.7c-1-0.2-2.1,0.3-2.6,1.2l-0.5,0.8c-0.7,1.3-2.4,1.6-3.6,0.8l-0.8-0.6c-0.8-0.6-2-0.6-2.8,0l-0.8,0.5c-1.2,0.8-2.9,0.5-3.5-0.8l-0.5-0.8c-0.5-0.9-1.5-1.4-2.5-1.2l-0.9,0.2C8,34,6.7,33,6.7,31.5l-0.1-0.9c-0.1-1.1-0.8-1.9-1.8-2.2l-0.9-0.2c-1.4-0.4-2.1-1.9-1.6-3.3L2.7,24c0.4-0.9,0.2-2.1-0.6-2.8l-0.7-0.6c-1.1-1-1.1-2.7,0-3.6l0.7-0.6c0.8-0.7,1.1-1.8,0.6-2.8l-0.4-0.9c-0.6-1.4,0.2-2.9,1.6-3.3l0.9-0.2C5.8,8.9,6.5,8,6.6,7l0.1-0.9c0.1-1.5,1.4-2.5,2.9-2.3L10.5,4c1,0.2,2.1-0.3,2.6-1.2L13.6,2c0.7-1.3,2.4-1.6,3.6-0.8L18,1.8c0.8,0.6,2,0.6,2.8,0l0.8-0.5c1.2-0.8,2.9-0.5,3.5,0.8l0.5,0.8c0.5,0.9,1.5,1.4,2.5,1.2L29,3.9c1.5-0.2,2.8,0.8,2.8,2.3l0.1,0.9C32,8.2,32.7,9,33.7,9.3l0.9,0.2c1.4,0.4,2.1,1.9,1.6,3.3l-0.4,0.9c-0.4,0.9-0.2,2.1,0.6,2.8L37.1,17.1z M31.1,18.9C31.1,12.3,25.8,7,19.2,7S7.3,12.3,7.3,18.9s5.3,11.9,11.9,11.9S31.1,25.5,31.1,18.9z"/></svg>' );



}





// function for filtering deals from highest price to lowest 

function priceHighToLow() { 

	// Sort by Price - return highest priced deals 
    localData.sort(function(a, b) {
	    var a1= a.price, b1= b.price;
	    if(a1== b1) return 0;
	    return a1< b1? 1: -1;
	});


    // Remove all deals from previous search
	$(".best-deals-page #deals-container .deal-wrappr").each(function () {
	    $(this).remove();
	});


	// loop through each object in returned data array 
    for( var i=0;  i < localData.length;  i++) {

       	$('.best-deals-page #deals-container').append(

		    '<div class="deal-wrappr">' + 
		      '<div class="deal-info-container" style="background-image: url(' + localData[i].contentImage + '),  url(img/no-image450x250.jpg); ">'  +  
		         
		         '<div class="result-price-container">' + 
		            '<span class="result-price">' + "fr" + " " + 
		              '<span class="pnd">' + "£" + '</span>' + 
		              '<span class="price-inner">'  + localData[i].price + '</span>' + " " 
		               + 'pp' + 
		            '</span>' + 
		          '</div>' + 

		          '<div class="deal-logo">' + 
		              '<img src="' +	supplierLogo + '" alt="' + '" />' + 
		          '</div>' + 

		          '<div class="inner-deal-summary-container">' + 
		            '<span class="accomodation">' +  localData[i].accommodation + '</span>'  + 
		            '<span class="destination-icon"> <svg version="1.1" id="destination-icon-red" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="28.4px" height="41.6px" viewBox="0 0 28.4 41.6" style="enable-background:new 0 0 28.4 41.6;" xml:space="preserve"><g><path class="destination-icon-white" d="M28.2,14.5c0-7.7-6.3-14-14-14s-14,6.3-14,14c0,10.9,14,26.4,14,26.4S28.2,25.4,28.2,14.5z M8,14.5	c0-3.4,2.8-6.2,6.2-6.2s6.2,2.8,6.2,6.2c0,3.4-2.8,6.2-6.2,6.2S8,18,8,14.5z"/></g></svg>  </span>' + 
		            '<span class="destination">' +  localData[i].destination  + '</span>' +
		            '<span class="star-rating-container">' +  
		              '<span class="star-rating">' + localData[i].rating  +  '</span>' + 
		            '</span>' +
		          '</div>' +

		      '</div>' + 

		      '<div class="result-bottom">' + 
		        '<div class="result-flight">' + 
		          
		          '<div class="result-outbound">' +
		            '<span class="result-dep-airport">' +  localData[i].depAir   + '</span>' +
		            '<div class="result-dep-dates-container">' + 
		              '<span class="dep-date">' +  localData[i].departureDate  + '</span>' +
		            '</div>' +
		          '</div>' +
		          
		          '<div class="result-return">' + '<svg version="1.1" id="plane-icon-blue" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="74.4px" viewBox="0 0 40 74.4" style="enable-background:new 0 0 40 74.4;" xml:space="preserve"><path id="Shape_8_copy_2" class="plane-icon" d="M39.3,16.8c0,1.8-2.7,2-2.7,2h-9.3L16.8,34.7h-3.2l3.1-15.9H7.4l-6.6,6.5l1.3-7.8v-1.3l-1.3-8l6.6,6.6h9.3L13.6,0.2h3.2l10.5,14.6h9.3C36.6,14.9,39.3,15,39.3,16.8z"/><path id="Shape_8_copy_2_1_" class="plane-icon" d="M4.1,53.4h9.3l10.5-14.6h3.2L24,53.4h9.3l6.6-6.6l-1.3,8v1.3l1.3,7.8l-6.6-6.5H24	l3.1,15.9h-3.2L13.4,57.4H4.1c0,0-2.7-0.2-2.7-2S4.1,53.4,4.1,53.4z"/></svg>' +
		            '<span class="result-return-airport">' + localData[i].destAir + '</span>' + 
		            '<div class="result-return-dates-container">' + 
		              '<span class="return-date">' + localData[i].returnDate + '</span>' + 
		            '</div>' +
		          '</div>' +

		        '</div>' + 

		        '<div class="result-price-and-button-container">' + 
		          '<a href="#" onclick="window.open(\' '  + localData[i].deepLink  + ' \' ,   \'_system\'  ); "> ' +
		            '<span class="view-deal-button">' + "View deal" + '<svg version="1.1" id="view-deals-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12.8px" height="13.4px" viewBox="0 0 12.8 13.4" style="enable-background:new 0 0 12.8 13.4;" xml:space="preserve"><path d="M0.9,12.4V1c0-0.3,0.2-0.5,0.4-0.7c0.3-0.2,0.6-0.1,0.9,0L12,6c0.3,0.1,0.4,0.4,0.4,0.6c0,0.3-0.2,0.5-0.4,0.7L2.3,13	c-0.1,0.1-0.3,0.1-0.5,0.2c-0.2,0-0.3,0-0.4-0.1C1.1,12.9,0.9,12.7,0.9,12.4z"/></svg>' +
		          '</a>' + 
		        '</div>' + 
		      
		      '</div>' +

		    '</div>'

		);



	
         //  add supplier logo depending on supplier client name,  all possible supplier working with dealchecker
		if ( localData[i].clientName == "ebookersHolidayFeed"  ) { 

			supplierLogo = "img/ebookers.gif";

		} else if (localData[i].clientName == "Qwerty Travel") { 

			supplierLogo = "img/qwertyHolidays.gif";


		} else if (localData[i].clientName == "Holiday Place") { 

			supplierLogo = "img/holidayPlaceHolidays.gif";

		} else if (localData[i].clientName == "blueseaHolidays") { 

			supplierLogo = "img/blueseaHolidays.gif";

		} else if (localData[i].clientName == "onTheBeachHolidaysFeed") { 

			supplierLogo = "img/onTheBeachHolidays.gif";

		} else if (localData[i].clientName == "Iglu Ski") { 

			supplierLogo = "img/igluski.gif";

		}  else if (localData[i].clientName == "travelRepublic") { 

			supplierLogo = "img/ travelRepublic.gif";

		}  else if (localData[i].clientName == "skiHappyHolidays") { 

			supplierLogo = "img/skiHappyHolidays.gif";

		} else if (localData[i].clientName == "netflightsHolidays") { 

			supplierLogo = "img/netflightsHolidays.gif";

		} else if (localData[i].clientName == " jet2HolidaysHolidayDealsFeed") { 

			supplierLogo = "img/jet2HolidaysHolidayDealsFeed.gif";

		} else if (localData[i].clientName == "perfectHolidaysRTHoliday") { 

			supplierLogo = "img/ perfectHolidaysRTHolidays.gif";

		} else if (localData[i].clientName == "holidayGenieRTHolidays") { 

			supplierLogo = "img/holidayGenieRTHolidays.gif";

		} else if (localData[i].clientName == "goNorthCyprusRTHolidays") { 

		
			supplierLogo = "img/goNorthCyprusRTHolidays.gif";		

		}

			

		//hide logo if underfined
		$('.deal-logo img').error(function(){
		    $(this).parent().hide(); 
		});

    }	

    // add star rating class depending on deals rating 
    starRating();

    

  	// add class to remove margin from top deal 
    $('.best-deals-page #deals-container .deal-wrappr').eq(0).addClass('top-margin').addClass('high-to-low');

    // Add highest price svg icon to first deal
    $('.deal-wrappr.high-to-low .result-price-container').prepend( '<svg version="1.1" id="high-to-low-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="43.8px" height="43.3px" viewBox="0 0 43.8 43.3" style="enable-background:new 0 0 43.8 43.3;" xml:space="preserve"><g transform="translate(0,-952.36218)"><path class="price-icon" d="M24.5,953.8c-0.2,0-0.5,0.1-0.6,0.3L3.1,974.9c-0.8,0.8-1.2,1.7-1.2,2.8c0,1,0.5,2,1.2,2.7L16,993.3c0.7,0.7,1.7,1.2,2.7,1.2s2-0.5,2.7-1.2l20.8-20.8c0.2-0.2,0.3-0.4,0.3-0.6V958c0-2.2-1.8-4.2-4.2-4.2L24.5,953.8L24.5,953.8z M40.7,957.9v13.5l-20.5,20.5c-0.4,0.4-0.9,0.7-1.4,0.7s-1-0.2-1.4-0.7L4.5,979c-0.5-0.5-0.6-0.9-0.6-1.4s0.2-1,0.6-1.5L25,955.6h13.5C39.7,955.6,40.7,956.7,40.7,957.9z M31.2,961.4c0,1.9,1.6,3.5,3.5,3.5s3.5-1.6,3.5-3.5s-1.6-3.5-3.5-3.5C32.8,957.9,31.2,959.5,31.2,961.4z M36.3,961.4c0,0.9-0.7,1.6-1.6,1.6c-0.9,0-1.6-0.7-1.6-1.6s0.7-1.6,1.6-1.6S36.3,960.5,36.3,961.4z"/></g><path class="price-icon" d="M16.1,27.6c0.7-0.5,1.3-1.1,1.8-1.7s0.7-1.3,0.7-2c0-0.2,0-0.5-0.1-0.7s-0.1-0.4-0.3-0.7H16v-1h1.5c0,0-0.1-0.2-0.3-0.6c-0.2-0.4-0.4-0.8-0.4-1c-0.1-0.2-0.1-0.4-0.2-0.7c0-0.3-0.1-0.5-0.1-0.8c0-1,0.4-1.9,1.2-2.7c0.8-0.8,2-1.2,3.6-1.2c1.5,0,2.6,0.4,3.3,1.2c0.7,0.8,1.1,1.9,1.2,3.4H24c0-1-0.2-1.7-0.7-2.3c-0.5-0.5-1.2-0.8-2.1-0.8s-1.6,0.2-2.1,0.7s-0.7,1.1-0.7,1.8c0,0.3,0.1,0.7,0.2,1c0.1,0.4,0.5,1,0.9,1.9h3.2v1h-2.8c0.1,0.3,0.1,0.5,0.1,0.7s0,0.3,0,0.5c0,0.7-0.2,1.3-0.6,1.9s-1,1.3-1.8,1.9c0.5-0.2,0.9-0.4,1.3-0.5s0.9-0.2,1.3-0.2c0.5,0,1.1,0.1,1.9,0.3c0.8,0.2,1.3,0.3,1.5,0.3c0.3,0,0.6-0.1,0.8-0.2c0.2-0.1,0.4-0.2,0.7-0.5l0.8,1.3c-0.4,0.3-0.7,0.5-1,0.7c-0.5,0.2-1,0.3-1.5,0.3c-0.4,0-1.1-0.2-2-0.5s-1.7-0.5-2.2-0.5s-1,0.1-1.4,0.3c-0.3,0.1-0.6,0.3-1,0.5L16.1,27.6z"/></svg>' );


}










// sort deals by highest rating functionality -------------------------------------------------------------------------------

function ratingSort() { 

	// Store deal data in rating variable 
   	var ratingData = localData;

	// Sort by rating - return highest rated deals 
    ratingData.sort(function(a, b) {
	    var a1= a.rating, b1= b.rating;
	    if(a1== b1) return 0;
	    return a1 < b1? 1: -1;
	   
	});


	// Hide previous searched deals 
	$(".best-deals-page #deals-container .deal-wrappr").each(function () {
	    $(this).remove();
	});


	// loop through each object in returned data array 
    for( var i=0;  i <  ratingData.length;  i++) {
  	

       	$('.best-deals-page #deals-container').append(

		    '<div class="deal-wrappr">' + 
		      '<div class="deal-info-container" style="background-image: url(' +  ratingData[i].contentImage + '),  url(img/no-image450x250.jpg); ">'  +  
		         
		         '<div class="result-price-container">' + 
		            '<span class="result-price">' + "fr" + " " + 
		              '<span class="pnd">' + "£" + '</span>' + 
		              '<span class="price-inner">'  +  ratingData[i].price + '</span>' + " " 
		               + 'pp' + 
		            '</span>' + 
		          '</div>' + 

		          '<div class="deal-logo">' + 
		              '<img src="' +	supplierLogo + '" alt="' + '" />' + 
		          '</div>' + 

		          '<div class="inner-deal-summary-container">' + 
		            '<span class="accomodation">' +   ratingData[i].accommodation + '</span>'  + 
		           	'<span class="destination-icon"> <svg version="1.1" id="destination-icon-red" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="28.4px" height="41.6px" viewBox="0 0 28.4 41.6" style="enable-background:new 0 0 28.4 41.6;" xml:space="preserve"><g><path class="destination-icon-white" d="M28.2,14.5c0-7.7-6.3-14-14-14s-14,6.3-14,14c0,10.9,14,26.4,14,26.4S28.2,25.4,28.2,14.5z M8,14.5	c0-3.4,2.8-6.2,6.2-6.2s6.2,2.8,6.2,6.2c0,3.4-2.8,6.2-6.2,6.2S8,18,8,14.5z"/></g></svg>  </span>' + 
		            '<span class="destination">' +  ratingData[i].destination  + '</span>' +  
		            '<span class="star-rating-container">' +  
		              '<span class="star-rating">' +  ratingData[i].rating  +  '</span>' + 
		            '</span>' +
		          '</div>' +

		      '</div>' + 

		      '<div class="result-bottom">' + 
		        '<div class="result-flight">' + 
		          
		          '<div class="result-outbound">' +
		            '<span class="result-dep-airport">' +   ratingData[i].depAir   + '</span>' +
		            '<div class="result-dep-dates-container">' + 
		              '<span class="dep-date">' +   ratingData[i].departureDate  + '</span>' +
		            '</div>' +
		          '</div>' +
		          
		          '<div class="result-return">' + '<svg version="1.1" id="plane-icon-blue" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="74.4px" viewBox="0 0 40 74.4" style="enable-background:new 0 0 40 74.4;" xml:space="preserve"><path id="Shape_8_copy_2" class="plane-icon" d="M39.3,16.8c0,1.8-2.7,2-2.7,2h-9.3L16.8,34.7h-3.2l3.1-15.9H7.4l-6.6,6.5l1.3-7.8v-1.3l-1.3-8l6.6,6.6h9.3L13.6,0.2h3.2l10.5,14.6h9.3C36.6,14.9,39.3,15,39.3,16.8z"/><path id="Shape_8_copy_2_1_" class="plane-icon" d="M4.1,53.4h9.3l10.5-14.6h3.2L24,53.4h9.3l6.6-6.6l-1.3,8v1.3l1.3,7.8l-6.6-6.5H24	l3.1,15.9h-3.2L13.4,57.4H4.1c0,0-2.7-0.2-2.7-2S4.1,53.4,4.1,53.4z"/></svg>' +
		            '<span class="result-return-airport">' +  ratingData[i].destAir + '</span>' + 
		            '<div class="result-return-dates-container">' + 
		              '<span class="return-date">' +  ratingData[i].returnDate + '</span>' + 
		            '</div>' +
		          '</div>' +

		        '</div>' + 

		        '<div class="result-price-and-button-container">' + 
		          '<a href="#" onclick="window.open(\' '  +  ratingData[i].deepLink  + ' \' ,   \'_system\'  ); "> ' +
		            '<span class="view-deal-button">' + "View deal" + '<svg version="1.1" id="view-deals-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12.8px" height="13.4px" viewBox="0 0 12.8 13.4" style="enable-background:new 0 0 12.8 13.4;" xml:space="preserve"><path d="M0.9,12.4V1c0-0.3,0.2-0.5,0.4-0.7c0.3-0.2,0.6-0.1,0.9,0L12,6c0.3,0.1,0.4,0.4,0.4,0.6c0,0.3-0.2,0.5-0.4,0.7L2.3,13	c-0.1,0.1-0.3,0.1-0.5,0.2c-0.2,0-0.3,0-0.4-0.1C1.1,12.9,0.9,12.7,0.9,12.4z"/></svg>' +
		          '</a>' + 
		        '</div>' + 
		      
		      '</div>' +

		    '</div>'

		);



	 //  add supplier logo depending on supplier client name,  all possible supplier working with dealchecker
		if ( localData[i].clientName == "ebookersHolidayFeed"  ) { 

			supplierLogo = "img/ebookers.gif";

		} else if (localData[i].clientName == "Qwerty Travel") { 

			supplierLogo = "img/qwertyHolidays.gif";


		} else if (localData[i].clientName == "Holiday Place") { 

			supplierLogo = "img/holidayPlaceHolidays.gif";

		} else if (localData[i].clientName == "blueseaHolidays") { 

			supplierLogo = "img/blueseaHolidays.gif";

		} else if (localData[i].clientName == "onTheBeachHolidaysFeed") { 

			supplierLogo = "img/onTheBeachHolidays.gif";

		} else if (localData[i].clientName == "Iglu Ski") { 

			supplierLogo = "img/igluski.gif";

		}  else if (localData[i].clientName == "travelRepublic") { 

			supplierLogo = "img/ travelRepublic.gif";

		}  else if (localData[i].clientName == "skiHappyHolidays") { 

			supplierLogo = "img/skiHappyHolidays.gif";

		} else if (localData[i].clientName == "netflightsHolidays") { 

			supplierLogo = "img/netflightsHolidays.gif";

		} else if (localData[i].clientName == " jet2HolidaysHolidayDealsFeed") { 

			supplierLogo = "img/jet2HolidaysHolidayDealsFeed.gif";

		} else if (localData[i].clientName == "perfectHolidaysRTHoliday") { 

			supplierLogo = "img/ perfectHolidaysRTHolidays.gif";

		} else if (localData[i].clientName == "holidayGenieRTHolidays") { 

			supplierLogo = "img/holidayGenieRTHolidays.gif";

		} else if (localData[i].clientName == "goNorthCyprusRTHolidays") { 

		
			supplierLogo = "img/goNorthCyprusRTHolidays.gif";		

		}

			

		//hide logo if underfined
		$('.deal-logo img').error(function(){
		    $(this).parent().hide(); 
		});



    }	

    // add star rating class depending on deals rating 
	starRating();


  	// add class to remove margin from top deal 
    $('.best-deals-page #deals-container .deal-wrappr').eq(0).addClass('rating').addClass('top-margin');

    // add highest rating icon to first deal 
    $('.deal-wrappr.rating .result-price-container').prepend('<svg version="1.1" id="deal-rating-star-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"width="47.5px" height="45.8px" viewBox="0 0 47.5 45.8" style="enable-background:new 0 0 47.5 45.8;" xml:space="preserve"><g transform="translate(0,-952.36218)"><path class="star-icon" d="M37.4,997.3c0.9-0.1,1.6-0.8,1.5-1.7c0-0.1,0-0.1,0-0.2L36,981.6l10.7-9.5c0.7-0.6,0.7-1.6,0.1-2.3c-0.3-0.3-0.6-0.5-1-0.5l-14.4-1.6l-6-12.8c-0.4-0.8-1.3-1.2-2.2-0.8c-0.4,0.2-0.7,0.4-0.8,0.8l-6,12.8L2,969.3c-0.9,0.1-1.6,0.9-1.5,1.8c0,0.4,0.2,0.7,0.5,1l10.7,9.5l-2.9,13.8c-0.2,0.9,0.4,1.7,1.3,1.9c0.4,0.1,0.8,0,1.1-0.2l12.6-6.9l12.6,6.9C36.8,997.3,37.1,997.4,37.4,997.3z M34.9,992.6l-10.2-5.7c-0.5-0.3-1.1-0.3-1.6,0l-10.2,5.7l2.4-11.2c0.1-0.6-0.1-1.1-0.5-1.5l-8.7-7.7l11.7-1.3c0.6-0.1,1.1-0.4,1.3-0.9l4.9-10.4l4.9,10.4c0.2,0.5,0.7,0.9,1.3,0.9l11.7,1.3l-8.7,7.7c-0.4,0.4-0.6,1-0.5,1.5C32.6,981.4,34.9,992.6,34.9,992.6z"/></g></svg>' );

   


}














// Best deals page --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



$$(document).on('pageInit', '.page[data-page="best-deals"]', function(e) {

	// on click of skip button on best deals popup guide hide it from showing again on load of best deal page 
	$('.skip-nano-guide').on('click', function(){ 
		$(this).parent().parent().hide();
	});
	

	activeNavRemove();
	$('.content-block p').eq(2).addClass('active-nav');


	// Call best priced function on load so user sees deal filtered by best priced deals on page load 
	priceLowToHigh();



	// filter deals functionality
	$('.toolbar.toolbar-bottom').on('click', function () {
	  myApp.modal({
	    title:  'Sort Deals',
	    text: '',
	    verticalButtons: true,
	    buttons: [
	      {
	        text: 'PRICE - LOW TO HIGH',
	        onClick: function() {
	          priceLowToHigh();
	          title:  'Sort & Filter',
	          myApp.alert('Deals sorted by best price!', '');

	        }
	      },

	       {
	        text: 'PRICE - HIGH TO LOW',
	        onClick: function() {
	          priceHighToLow();
	          myApp.alert('Deals price sorted by highest to lowest!', '');

	        }
	      },

	      {
	        text: 'HIGHEST RATING',
	        onClick: function() {
	          ratingSort();
	          myApp.alert('Deals sorted by highest rating!', '');

	        }
	      },

	       {
	        text: 'CANCEL',
	        close: true,
	      }, 
	    ]
	  })
	});    


   


// End of Best deals page -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
});






// Script that runs on every other time the best-deals page is init\loaded 
myApp.onPageReinit('best-deals', function (page) {
   

	activeNavRemove();
	$('.content-block p').eq(2).addClass('active-nav');



});








// Start of about page -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

$$(document).on('pageInit', '.page[data-page="about"]', function(e) {

	activeNavRemove();
	

});




// Script that runs every time after the about page is init\loaded 
myApp.onPageReinit('about', function (page) {
   

	activeNavRemove();



});










// Start of settings page -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

$$(document).on('pageInit', '.page[data-page="settings"]', function(e) {

	activeNavRemove();	
	$('.content-block p').eq(3).addClass('active-nav');



	// script to run video in settings on click  of about dealchecker link
	var myPhotoBrowserPopupDark = myApp.photoBrowser({
	    photos : [
	        {
	            html: '<iframe src="https://www.youtube.com/embed/gHo6Jh3eZM8" frameborder="0" allowfullscreen></iframe>',
	            caption: 'dealchecker | Price Comparison Travel Site (Official HD Video)'
	        },
	        
	    ],
	    theme: 'dark',
	    type: 'standalone'
	});
	$$('.pb-standalone-video').on('click', function () {
	    myPhotoBrowserPopupDark.open();
	});



});




// Script that runs every time after the settings page is init\loaded 
myApp.onPageReinit('settings', function (page) {
   
	activeNavRemove();

	$('.content-block p').eq(3).addClass('active-nav');


});
