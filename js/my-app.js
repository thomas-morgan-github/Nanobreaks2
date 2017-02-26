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




// Splash on load --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

setTimeout(function() {
   $('#splash').hide();
}, 2000); // <-- time in milliseconds



// Global variable to store JSONP data from dealchecker 
var localData;



// Function to store JSONP in global variable --------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function jsonCallback (data) {
	localData = data; 
}

jsonCallback();




// Navigation bar Left panel script ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

$('.menu-icon-nav').on('click', function() { 
	$(this).toggleClass('close-panel open-panel');
});



// function for removing active class from nav 
function activeNavRemove() { 
	$(".content-block p").each(function () {
    	$(this).removeClass("active-nav");
	});
}





// function to check if users email is valid on login page 
function userLoginCallback(data) { 

	if ( data == '123578') { 
		console.log('valid email');
		$('#email-login').addClass('valid');
		$('#email-fail').removeClass('invalidEmail');

	} 

	else { 
		$('#email-fail').addClass('invalidEmail');
	}

}







/* login-page --------------------------------------------------------------------------------------------------------- */ 


$$(document).on('pageInit', '.page[data-page="login"]', function(e) {



	// Account validation ---------------------------------------------------------

	$('input#email-login').on('blur',  function() { 

		var emailInput = $('input#email-login').val();

		var my_script = document.createElement('script');
		my_script.setAttribute('src','https://www.dealchecker.co.uk/user/user-exists/' + emailInput + '-jsonp.html?callback=userLoginCallback');
		document.head.appendChild(my_script);

		userLoginCallback();

	}); 




});



$('#login-button-container').on('click', function() { 
	
	if ( $('#email-login').hasClass('valid') ) { 
		$("a#login-button").attr("href", "#home");
	}

});











/* home-page --------------------------------------------------------------------------------------------------------- */ 
$$(document).on('pageInit', '.page[data-page="home"]', function(e) {

		activeNavRemove();

		$('.content-block p').eq(0).addClass('active-nav');
				
	    // Sort by Price - return best deals 
	    localData.sort(function(a, b) {
		    var a1= a.price, b1= b.price;
		    if(a1== b1) return 0;
		    return a1> b1? 1: -1;
		   
		});


	    // store best price deal object in database in variable
	    var todaysBestDeal = localData[0];
  	
	    console.log(todaysBestDeal);

	    myApp.addNotification({
	        title: 'Todays best deal provided by ' + todaysBestDeal.clientName,
	        subtitle: todaysBestDeal.destination + " " + todaysBestDeal.accommodation  + " " + '<div class="todays-best-deals-price-container">'  + "£" + todaysBestDeal.price + "pp " + '</div>' +  '<span class="star-rating">' + todaysBestDeal.rating +  '</span>' ,
	        message: 'Hello, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut posuere erat. Pellentesque id elementum urna, a aliquam ante. Donec vitae volutpat orci. Aliquam sed molestie risus, quis tincidunt dui.',
	        media: '<img width="44" height="44" style="border-radius:100%" src="img/deal-of-the-day.jpg">'
	    });



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



});





// Script that runs on every other time the home page is loaded 
myApp.onPageReinit('home', function (page) {
   

	activeNavRemove();


	$('.content-block p').eq(0).addClass('active-nav');


});


	






 /* Search-page --------------------------------------------------------------------------------------------------------- */ 


$$(document).on('pageInit', '.page[data-page="search"]', function(e) {



	activeNavRemove();
	

	$('.content-block p').eq(1).addClass('active-nav');


	$('.skip-nano-guide').on('click', function(){ 
		$(this).parent().parent().hide();
	});



	// Autocomplete drop downs for departing destination -------------------------------------2----------------------------------------------------------

	var autocompleteDropdownAjax = myApp.autocomplete ({

	  input: '#autocomplete-departing-dropdown-ajax',
	  openIn: 'dropdown',
	  preloader: true, //enable preloader
	  valueProperty: 'value', //object's "value" property name
	  textProperty: 'text', //object's "text" property name
	  limit: 1000, 
	  dropdownPlaceholderText: 'Search avaliable departure airports...',
	  expandInput: true, // expand input
	  source: function(autocomplete, query, render) {
	    var results = [];
	    var returned = [];
	    if (query.length === 0) {
	      render(results);
	      return;
	    }


	    // Show Preloader
	    autocomplete.showPreloader();

	    // Create empty array that will hold all departure airports and departure airport codes 
		var departureWithAirportCode = [];

		// loop through local data and add all depature airport and departure airport codes to empty array 
		for ( var i = 0 ; i < localData.length; i ++ ) { 
			departureWithAirportCode.push(localData[i].departure + " " + localData[i].depAir );
		}

		// Create empty array to hold only unique depature airport and departure airport code values 
		var uniqueDepartureAirportNames = [];

		for(var i in departureWithAirportCode){
		    if(uniqueDepartureAirportNames.indexOf(departureWithAirportCode[i]) === -1){
		        uniqueDepartureAirportNames.push(departureWithAirportCode[i]);
		    }
		}
	 

	    // loop through unique depature airport and departure airport code values and push to results array (show in input dropdown) if users inputed text matches array values 
	    for (var i = 0; i < uniqueDepartureAirportNames.length; i++) {
	       
	       	if (uniqueDepartureAirportNames[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(uniqueDepartureAirportNames[i]);
	    
	    }

	    // Hide Preoloader
	    autocomplete.hidePreloader();
	   
	    // Render items by passing array with result items
	    render(results);


	  }

	});




	// Autocomplete drop down for destination --------------------------------------------------------------------------------------------------------------------------------------------------------

	var autocompleteDropdownAjax = myApp.autocomplete ({
	  input: '#autocomplete-destination-dropdown-ajax',
	  openIn: 'dropdown',
	  preloader: true, //enable preloader
	  valueProperty: 'value', //object's "value" property name
	  textProperty: 'text', //object's "text" property name
	  limit: 1000, 
	  dropdownPlaceholderText: 'Search avaliable destinations...',
	  expandInput: true, // expand input

	  source: function(autocomplete, query, render) {
	    var results = [];
	    var returned = [];
	    if (query.length === 0) {
	      render(results);
	      return;
	    }

	    // Show Preloader
	    autocomplete.showPreloader();


	    // Create empty array that will hold all destination airports and destination airport codes 
	    var destinationOnly = [];

	    // loop through local data and add all depature airport and departure airport codes to empty array 
	    for ( var i = 0 ; i < localData.length; i ++ ) { 
	    	destinationOnly.push(localData[i].destination);
	    }



	    // Create empty array to hold only unique depature airport and departure airport code values 
	    var uniqueDestinationNames = [];


		for(var i in destinationOnly){
	        if( uniqueDestinationNames.indexOf(destinationOnly[i]) === -1){
	            uniqueDestinationNames.push(destinationOnly[i]);
	        }
	    }



	    // loop through unique destination values and push to results array (show in input dropdown) if users inputed text matches array values 
	    for (var i = 0; i <  uniqueDestinationNames.length; i++) {
	       
	       	if ( uniqueDestinationNames[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push( uniqueDestinationNames[i]);
	    
	    }


	    // Hide Preoloader
	    autocomplete.hidePreloader();
	   
	    // Render items by passing array with result items
	    render(results);

		
	  }
	});



	// Show hide drop down on click , remove place holder text ------------------------------------------------------------------------------------------

	$('input,textarea').focus(function()	{
		$(this).parent().addClass('active');
	    $(this).data('placeholder',$(this).attr('placeholder'))
	          .attr('placeholder','');
	}).blur(function(){
		$(this).attr('placeholder',$(this).data('placeholder'));
	});



	$('#adults-dropdown, #children-dropdown , #infants-dropdown').on('click', function () { 

		$(this).parents().addClass('active');

	});




	// Add dropdown values to input on click ---------------------------------------------------------------------------------------------------------

	$('li').on('click', function() { 
		var value = $(this).text();
		var input = $(this).parent().prev().prev().children();
	    input.html(value);
	    $(this).parents().eq(1).removeClass('active');	
	    return false;
	});

				

	// Script for calender --------------------------------------------------------------------------------------------------------------------------

	var today = new Date();
	
	var calendarDefault = myApp.calendar({
	    
	    input: '#calendar-default',
	    dateFormat: 'dd/mm/yyyy',
	    closeOnSelect: true,
	
	  
	    events: {
	  		from: today,
		},

		disabled: {
			to: today
		},



	});       

	


	// Remove user departure search input if invalid function
	function invalidDeparture() { 
		
		for (i=0; i < localData.length; i++ ) { 
		 
		 	if( $$('#autocomplete-departing-dropdown-ajax').val() !== localData[i].departure + " " + localData[i].depAir ) { 
		 		$$('#autocomplete-departing-dropdown-ajax').val("");	
		 	}

		}

	}


	// Remove user destination search input if invalid function
	function invalidDestination () { 

		for (i=0; i < localData.length; i++ ) { 
		 
		 	if( $('autocomplete-destination-dropdown-ajax').val() !== localData[i].destination ) { 
		 		$('#autocomplete-destination-dropdown-ajax').val("");	
		 	}

		}

	}

	// on input blur check if departure and destination input is valid 
	$('input#autocomplete-departing-dropdown-ajax').on('blur', invalidDeparture);
	$('input#autocomplete-destination-dropdown-ajax').on('blur', invalidDestination);


	$('.compare-button').on('click', function () { 
		
		var departingVal = $('#autocomplete-departing-dropdown-ajax').val();
		var destinationVal = $('#autocomplete-destination-dropdown-ajax').val();
		var dateVal = $('#calendar-default').val();

		// If no values are inputted 
		if ( departingVal  == "" &&  destinationVal == "" && dateVal == "" ) { 
			$(".compare-button").removeAttr('href');
		} 

		// If one of the search requirments are meet add href to deal landing page
		if ( departingVal !== "" || destinationVal !== "" || dateVal !== "" ) { 
			$(".compare-button").attr("href", "#deal-landing");
		}


	});






// End of search page --------------------------------------------------------------------------------------------------------------------------------------------------------
});







// Script for search form submit ( has to be outside of search page js, as its a global variable thats used on the search deal landing page ) ----------------------------------------------------------------------------------------------------------------------

// Global variables 
var departure;
var destination;
var date;
var deals;
var adults;
var children;
var infants;

var searchPageContainer = $('.search-bg-page');

searchPageContainer.find('.save-storage-data').on('click', function (e) {
	
	e.preventDefault();

	departure = $(searchPageContainer).find("#autocomplete-departing-dropdown-ajax" ).val();
	destination = $(searchPageContainer).find("#autocomplete-destination-dropdown-ajax").val();
	date = $(searchPageContainer).find("#calendar-default").val();
	deals = $(searchPageContainer).find("#best-deals").val();
	adults = $(searchPageContainer).find("#adults").val();
	children = $(searchPageContainer).find("#children").val();
	infants = $(searchPageContainer).find("#infants-input").val();

   
});






// Script that runs on every other time the searchpage is page is init\loaded 
myApp.onPageReinit('search', function (page) {
   

	activeNavRemove();


	$('.content-block p').eq(1).addClass('active-nav');

	


});













// Deal landing page -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


$$(document).on('pageInit', '.page[data-page="deal-landing"]', function(e) {


	activeNavRemove();
	


	// Code to create unique departure and departure airport codes -----------------------------------------------------------------------------------------------------------------------------------------------------------------

	// Create empty array that will hold all departure airports and departure airport codes 
	var departureWithAirportCode = [];

	// loop through local data and add all depature airport and departure airport codes to empty array 
	for ( var i = 0 ; i < localData.length; i ++ ) { 
		departureWithAirportCode.push(localData[i].departure + " " + localData[i].depAir );
	}

	// Create empty array to hold only unique departure airport and departure airport code values 
	var uniqueDepartureNames = [];


	for(var i in departureWithAirportCode){
	    if(uniqueDepartureNames.indexOf(departureWithAirportCode[i]) === -1){
	        uniqueDepartureNames.push(departureWithAirportCode[i]);
	    }
	}



	// Code to create unique destination values  ------------------------------------------------------------------------------------------------------------------

	// Create empty array that will hold all destination airports 
	var destinationOnly = [];

	// loop through local data and add all destination airport to empty array 
	for ( var i = 0 ; i < localData.length; i ++ ) { 
		destinationOnly.push(localData[i].destination);
	}


	// Create empty array to hold only unique destination values
	var uniqueDestinationNames = [];

	for(var i in destinationOnly)  {

	    if( uniqueDestinationNames.indexOf(destinationOnly[i]) === -1){
	        uniqueDestinationNames.push(destinationOnly[i]);
	    }

	}






	function appendInputedDataToDeal() { 
		
			$('.deal-landing-page #deals-container').append(


			    '<div class="deal-wrappr">' + 
			      '<div class="deal-info-container" style="background-image: url(' + localData[i].contentImage + '), url(https://static2.dealchecker.co.uk/10.9-2/images/ImageLibraries/Shared/no-image450x250.jpg);">' +  
			         
			         '<div class="result-price-container">' + 
			            '<span class="result-price">' + "fr" + " " + 
			              '<span class="pnd">' + "£" + '</span>' + 
			              '<span class="price-inner">'  + localData[i].price + '</span>' + " " 
			               + 'pp' + 
			            '</span>' + 
			          '</div>' + 

			          '<div class="deal-logo">' + 
			            '<img src="https://static2.dealchecker.co.uk/10.7-6' + localData[i].clientImage + '" alt="' + '" />' + 
			          '</div>' + 

			          '<div class="inner-deal-summary-container">' + 
			            '<span class="accomodation">' +  localData[i].accommodation + '</span>'  + 
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
		          
		          '<div class="result-return">' + 
		            '<span class="result-return-airport">' + localData[i].destAir + '</span>' + 
		            '<div class="result-return-dates-container">' + 
		              '<span class="return-date">' + localData[i].returnDate + '</span>' + 
		            '</div>' +
		          '</div>' +

		        '</div>' + 

		        '<div class="result-price-and-button-container">' + 
		          '<a href="">' + 
		            '<span class="view-deal-button">' + "View deal" +  '</span>' + 
		          '</a>' + 
		        '</div>' + 
		      
		      '</div>' +

		    '</div>'

		);


			
	}



//  For loop containing conditions to display deals depending on user input   ------------------------------------------------------------------------------------------------------------------------------------------------------------------

	// loop through each object in returned data array 
	for( var i=0;  i < localData.length;  i++)  {
		
		// Departure and destination and date search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

		if ( ( localData[i].departure + " " + localData[i].depAir == departure ) && ( localData[i].destination == destination ) && ( localData[i].departureDate == date ) ) {  
			console.log("departure and destination and date, full housee ");

			appendInputedDataToDeal();     
		}

		// Departure and destination only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

		else if ( (  localData[i].departure + " " + localData[i].depAir == departure ) && (  localData[i].destination == destination ) && (date == "") ) {
	    	console.log("departure and destination no date");
	 		appendInputedDataToDeal();
		}

		// Departure airport and date search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    
		
		else if ( (localData[i].departureDate == date) && ( localData[i].departure + " " + localData[i].depAir == departure ) && (destination == "") ) { 
			console.log("date and departure, destination empty");
	 		appendInputedDataToDeal();
		}

		// Departure only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    
		
		else if( (  localData[i].departure + " " + localData[i].depAir == departure  ) && (date == "") && (destination == "") ){ 	
			console.log('departure only other fields are empty');
	     	appendInputedDataToDeal();

	    }

		// Destination only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

		else if( (localData[i].destination == destination ) && (date == "") && (departure == "") ) { 
			console.log('destination only, other fields are empty');
			appendInputedDataToDeal();
		}

		// Date only search 
		else if( (localData[i].departureDate.substring(0,10) == date ) && (destination == "") && (departure == "") ) { 
			console.log('destination only, other fields are empty');
			appendInputedDataToDeal();
		}
		// End of if else statement 






		// code to manipulate deals ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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




		if (destination == "") { 
			$("#search-destination").html("");
		}
		else {  
		 	$("#search-destination").html("in" + " " + destination);
		}

		var DealCounter = $('.deal-wrappr').length;

		$("#deal-count").html(DealCounter);
	}
	// end of for loop 




// closing brackets for deal landing scripts -------------------------------------------------------------------------------------------------------------------------------------------------------
});














// Script that runs on every other time the deallanding page is init\loaded  
myApp.onPageReinit('deal-landing', function (page) {
   

	activeNavRemove();


	// Hide previous searched deals 
	$(".deal-landing-page #deals-container .deal-wrappr").each(function () {
	    $(this).hide();
	});




	// Code to create unique departure and departure airport codes -----------------------------------------------------------------------------------------------------------------------------------------------------------------

	// Create empty array that will hold all departure airports and departure airport codes 
	var departureWithAirportCode = [];

	// loop through local data and add all depature airport and departure airport codes to empty array 
	for ( var i = 0 ; i < localData.length; i ++ ) { 
		departureWithAirportCode.push(localData[i].departure + " " + localData[i].depAir );
	}

	// Create empty array to hold only unique departure airport and departure airport code values 
	var uniqueDepartureNames = [];


	for(var i in departureWithAirportCode){
	    if(uniqueDepartureNames.indexOf(departureWithAirportCode[i]) === -1){
	        uniqueDepartureNames.push(departureWithAirportCode[i]);
	    }
	}



	// Code to create unique destination values  ------------------------------------------------------------------------------------------------------------------

	// Create empty array that will hold all destination airports 
	var destinationOnly = [];

	// loop through local data and add all destination airport to empty array 
	for ( var i = 0 ; i < localData.length; i ++ ) { 
		destinationOnly.push(localData[i].destination);
	}


	// Create empty array to hold only unique destination values
	var uniqueDestinationNames = [];

	for(var i in destinationOnly)  {

	    if( uniqueDestinationNames.indexOf(destinationOnly[i]) === -1){
	        uniqueDestinationNames.push(destinationOnly[i]);
	    }

	}






	function appendInputedDataToDeal() { 
		
		$('.deal-landing-page #deals-container').append(


		    '<div class="deal-wrappr">' + 
		      '<div class="deal-info-container" style="background-image: url(' + localData[i].contentImage + '), url(https://static2.dealchecker.co.uk/10.9-2/images/ImageLibraries/Shared/no-image450x250.jpg);">' +  
		         
		         '<div class="result-price-container">' + 
		            '<span class="result-price">' + "fr" + " " + 
		              '<span class="pnd">' + "£" + '</span>' + 
		              '<span class="price-inner">'  + localData[i].price + '</span>' + " " 
		               + 'pp' + 
		            '</span>' + 
		          '</div>' + 

		          '<div class="deal-logo">' + 
		            '<img src="https://static2.dealchecker.co.uk/10.7-6' + localData[i].clientImage + '" alt="' + '" />' + 
		          '</div>' + 

		          '<div class="inner-deal-summary-container">' + 
		            '<span class="accomodation">' +  localData[i].accommodation + '</span>'  + 
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
		          
		          '<div class="result-return">' + 
		            '<span class="result-return-airport">' + localData[i].destAir + '</span>' + 
		            '<div class="result-return-dates-container">' + 
		              '<span class="return-date">' + localData[i].returnDate + '</span>' + 
		            '</div>' +
		          '</div>' +

		        '</div>' + 

		        '<div class="result-price-and-button-container">' + 
		          '<a href="">' + 
		            '<span class="view-deal-button">' + "View deal" +  '</span>' + 
		          '</a>' + 
		        '</div>' + 
		      
		      '</div>' +

		    '</div>'

		);
	
	}



//  For loop containing conditions to display deals depending on user input   ------------------------------------------------------------------------------------------------------------------------------------------------------------------

	// loop through each object in returned data array 
	for( var i=0;  i < localData.length;  i++)  {
		
		// Departure and destination and date search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

		if ( ( localData[i].departure + " " + localData[i].depAir == departure ) && ( localData[i].destination == destination ) && ( localData[i].departureDate == date ) ) {  
			console.log("departure and destination and date, full housee ");

			appendInputedDataToDeal();     
		}

		// Departure and destination only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

		else if ( (  localData[i].departure + " " + localData[i].depAir == departure ) && (  localData[i].destination == destination ) && (date == "") ) {
	    	console.log("departure and destination no date");
	 		appendInputedDataToDeal();
		}

		// Departure airport and date search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    
		
		else if ( (localData[i].departureDate == date) && ( localData[i].departure + " " + localData[i].depAir == departure ) && (destination == "") ) { 
			console.log("date and departure, destination empty");
	 		appendInputedDataToDeal();
		}

		// Departure only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    
		
		else if( (  localData[i].departure + " " + localData[i].depAir == departure  ) && (date == "") && (destination == "") ){ 	
			console.log('departure only other fields are empty');
	     	appendInputedDataToDeal();

	    }

		// Destination only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

		else if( (localData[i].destination == destination ) && (date == "") && (departure == "") ) { 
			console.log('destination only, other fields are empty');
			appendInputedDataToDeal();
		}

		// Date only search 
		else if( (localData[i].departureDate.substring(0,10) == date ) && (destination == "") && (departure == "") ) { 
			console.log('destination only, other fields are empty');
			appendInputedDataToDeal();
		}
		// End of if else statement 






		// code to manipulate deals ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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




		if (destination == "") { 
			$("#search-destination").html("");
		}
		else {  
		 	$("#search-destination").html("in" + " " + destination);
		}

		var DealCounter = $('.deal-wrappr').length;

		$("#deal-count").html(DealCounter);
	}
	// end of for loop 



});

// end of deal landing -----------------------------------------------------




	










// Functions for best deals page -------------------------------------------------------------------------------------------------------


// function for sorting deals into lowest price and appending to html dynamically

function priceLowToHigh () { 



	console.log('best price function loaded');

	// Sort by Price - return best priced deals 
    localData.sort(function(a, b) {
	    var a1= a.price, b1= b.price;
	    if(a1== b1) return 0;
	    return a1> b1? 1: -1;
	   
	});


    // add best priced deal supplier name to the best deal 
   	$('.best-result-inner').html('Best price for your Nano-break is from ' + '<span class="best-price-supplier">' +  localData[0].clientName + '</span>');


	$(".best-deals-page #deals-container .deal-wrappr").each(function () {
	    $(this).remove();
	});


	// loop through each object in returned data array 
    for( var i=0;  i < localData.length;  i++) {
  	


       	$('.best-deals-page #deals-container').append(



		    '<div class="deal-wrappr">' + 
		      '<div class="deal-info-container" style="background-image: url(' + localData[i].contentImage + '),  url(https://static2.dealchecker.co.uk/10.9-2/images/ImageLibraries/Shared/no-image450x250.jpg); ">'  +  
		         
		         '<div class="result-price-container">' + 
		            '<span class="result-price">' + "fr" + " " + 
		              '<span class="pnd">' + "£" + '</span>' + 
		              '<span class="price-inner">'  + localData[i].price + '</span>' + " " 
		               + 'pp' + 
		            '</span>' + 
		          '</div>' + 

		          '<div class="deal-logo">' + 
		            '<img src="https://static2.dealchecker.co.uk/10.7-6' + localData[i].clientImage + '" alt="' + '" />' + 
		          '</div>' + 

		          '<div class="inner-deal-summary-container">' + 
		            '<span class="accomodation">' +  localData[i].accommodation + '</span>'  + 
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
		          
		          '<div class="result-return">' + 
		            '<span class="result-return-airport">' + localData[i].destAir + '</span>' + 
		            '<div class="result-return-dates-container">' + 
		              '<span class="return-date">' + localData[i].returnDate + '</span>' + 
		            '</div>' +
		          '</div>' +

		        '</div>' + 

		        '<div class="result-price-and-button-container">' + 
		          '<a href="#" onclick="window.open(\' '  + localData[i].deepLink  + ' \' ,   \'_system\'  ); "> ' +
		            '<span class="view-deal-button">' + "View deal" +  '</span>' + 
		          '</a>' + 
		        '</div>' + 
		      
		      '</div>' +

		    '</div>'

		);

    }	

    // add star rating class depending on deals rating 
    $('.star-rating').each(function(i,e) {
        var rating = $$(this).text();
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


    $('.best-result-label').show();


    $('.best-result-inner').val('Best price for your Nano-break is from ');

  	// add class to remove margin from top deal 
    $('.deal-wrappr').eq(0).addClass('best');

}





// function for filtering deals from highest to lowest 

function priceHighToLow() { 



	console.log('price high to low function loaded');

	// Sort by Price - return best priced deals 
    localData.sort(function(a, b) {
	    var a1= a.price, b1= b.price;
	    if(a1== b1) return 0;
	    return a1< b1? 1: -1;
	   
	});


    // add best priced deal supplier name to the best deal 
   	$('.best-result-inner').html('Best price for your Nano-break is from ' + '<span class="best-price-supplier">' +  localData[0].clientName + '</span>');


	$(".best-deals-page #deals-container .deal-wrappr").each(function () {
	    $(this).remove();
	});


	// loop through each object in returned data array 
    for( var i=0;  i < localData.length;  i++) {
  	


       	$('.best-deals-page #deals-container').append(



		    '<div class="deal-wrappr">' + 
		      '<div class="deal-info-container" style="background-image: url(' + localData[i].contentImage + '),  url(https://static2.dealchecker.co.uk/10.9-2/images/ImageLibraries/Shared/no-image450x250.jpg); ">'  +  
		         
		         '<div class="result-price-container">' + 
		            '<span class="result-price">' + "fr" + " " + 
		              '<span class="pnd">' + "£" + '</span>' + 
		              '<span class="price-inner">'  + localData[i].price + '</span>' + " " 
		               + 'pp' + 
		            '</span>' + 
		          '</div>' + 

		          '<div class="deal-logo">' + 
		            '<img src="https://static2.dealchecker.co.uk/10.7-6' + localData[i].clientImage + '" alt="' + '" />' + 
		          '</div>' + 

		          '<div class="inner-deal-summary-container">' + 
		            '<span class="accomodation">' +  localData[i].accommodation + '</span>'  + 
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
		          
		          '<div class="result-return">' + 
		            '<span class="result-return-airport">' + localData[i].destAir + '</span>' + 
		            '<div class="result-return-dates-container">' + 
		              '<span class="return-date">' + localData[i].returnDate + '</span>' + 
		            '</div>' +
		          '</div>' +

		        '</div>' + 

		        '<div class="result-price-and-button-container">' + 
		          '<a href="#" onclick="window.open(\' '  + localData[i].deepLink  + ' \' ,   \'_system\'  ); "> ' +
		            '<span class="view-deal-button">' + "View deal" +  '</span>' + 
		          '</a>' + 
		        '</div>' + 
		      
		      '</div>' +

		    '</div>'

		);

    }	

    // add star rating class depending on deals rating 
    $('.star-rating').each(function(i,e) {
        var rating = $$(this).text();
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

    


    $('.best-result-label').hide();

  	// add class to remove margin from top deal 
    $('.deal-wrappr').eq(0).removeClass('rating').addClass('top-margin');

}
















// sort deals by rating functionality -------------------------------------------------------------------------------

function ratingSort () { 

	console.log('rating function loaded');

	// Store deal data in rating variable 
   	var ratingData = localData;

	// Sort by rating - return highest rated deals 
    ratingData.sort(function(a, b) {
	    var a1= a.rating, b1= b.rating;
	    if(a1== b1) return 0;
	    return a1 < b1? 1: -1;
	   
	});


    $('.best-result-inner').html('Highest rated deal for your Nano-break is from ' + '<span class="best-price-supplier">' +  ratingData[0].clientName + '</span>');



	// Hide previous searched deals 
	$(".best-deals-page #deals-container .deal-wrappr").each(function () {
	    $(this).remove();
	});


	// loop through each object in returned data array 
    for( var i=0;  i <  ratingData.length;  i++) {
  	


       	$('.best-deals-page #deals-container').append(



		    '<div class="deal-wrappr">' + 
		      '<div class="deal-info-container" style="background-image: url(' +  ratingData[i].contentImage + '),  url(https://static2.dealchecker.co.uk/10.9-2/images/ImageLibraries/Shared/no-image450x250.jpg); ">'  +  
		         
		         '<div class="result-price-container">' + 
		            '<span class="result-price">' + "fr" + " " + 
		              '<span class="pnd">' + "£" + '</span>' + 
		              '<span class="price-inner">'  +  ratingData[i].price + '</span>' + " " 
		               + 'pp' + 
		            '</span>' + 
		          '</div>' + 

		          '<div class="deal-logo">' + 
		            '<img src="https://static2.dealchecker.co.uk/10.7-6' +  ratingData[i].clientImage + '" alt="' + '" />' + 
		          '</div>' + 

		          '<div class="inner-deal-summary-container">' + 
		            '<span class="accomodation">' +   ratingData[i].accommodation + '</span>'  + 
		            '<span class="destination">' +   ratingData[i].destination  + '</span>' + 
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
		          
		          '<div class="result-return">' + 
		            '<span class="result-return-airport">' +  ratingData[i].destAir + '</span>' + 
		            '<div class="result-return-dates-container">' + 
		              '<span class="return-date">' +  ratingData[i].returnDate + '</span>' + 
		            '</div>' +
		          '</div>' +

		        '</div>' + 

		        '<div class="result-price-and-button-container">' + 
		          '<a href="#" onclick="window.open(\' '  +  ratingData[i].deepLink  + ' \' ,   \'_system\'  ); "> ' +
		            '<span class="view-deal-button">' + "View deal" +  '</span>' + 
		          '</a>' + 
		        '</div>' + 
		      
		      '</div>' +

		    '</div>'

		);

    }	

    // add star rating class depending on deals rating 
    $('.star-rating').each(function(i,e) {
        var rating = $$(this).text();
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




    $('.best-result-label').hide();

  	// add class to remove margin from top deal 
    $('.deal-wrappr').eq(0).addClass('rating').addClass('top-margin');


   

}




// filter deals functionality
$('#filter-best-deals').on('click', function () {
  myApp.modal({
    title:  'Sort & Filter',
    text: '',
    verticalButtons: true,
    buttons: [
      {
        text: 'PRICE - LOW TO HIGH',
        onClick: function() {
          priceLowToHigh();
          title:  'Sort & Filter',
          myApp.alert('Deals filtered by best price!', '');

        }
      },

       {
        text: 'PRICE - HIGH TO LOW',
        onClick: function() {
          priceHighToLow();
          myApp.alert('Deals filtered by high to low price!', '');

        }
      },

      {
        text: 'HIGHEST RATING',
        onClick: function() {
          ratingSort();
          myApp.alert('Deals filtered by highest rating!', '');

        }
      },
      
    ]
  })
});    










// Best deals page --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



$$(document).on('pageInit', '.page[data-page="best-deals"]', function(e) {

	
	$('.skip-nano-guide').on('click', function(){ 
		$(this).parent().parent().hide();
	});
	

	activeNavRemove();
	$('.content-block p').eq(2).addClass('active-nav');


	// Call best priced function on load so user sees deal filtered by best priced deals on page load 
	priceLowToHigh();


   
   
 	
 	

   


// End of Best deals page -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
});






// Script that runs on every other time the best-deals page is init\loaded 
myApp.onPageReinit('best-deals', function (page) {
   

	activeNavRemove();
	$('.content-block p').eq(2).addClass('active-nav');



});


















// Start of discover page -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

$$(document).on('pageInit', '.page[data-page="discover"]', function(e) {



	activeNavRemove();

	$('.content-block p').eq(3).addClass('active-nav');



// Attraction nav ------------------------------------------------------------------

	$('#attraction-nav span').on('click', function() { 
		
		$(this).parent().children().removeClass('active-destination');
		$(this).addClass('active-destination');

	});


// London -----------------------------------------------------------------------


	$('.london').on('click', function () { 
			    	
		$("#london-attractions").removeClass("hide-attractions");
		$("#paris-attractions , #rome-attractions , #amsterdam-attractions , #new-york-attractions").addClass("hide-attractions");

	}); 




// Paris ------------------------------------------------------------------------
	
	
	$('.paris').on('click', function () { 
	
		$("#paris-attractions").removeClass("hide-attractions");
		$("#london-attractions , #rome-attractions , #amsterdam-attractions , #new-york-attractions").addClass("hide-attractions");

	});



 // Amsterdam ------------------------------------------------------------------------


	$('.amsterdam').on('click', function() { 

		$("#amsterdam-attractions").removeClass("hide-attractions");
		$("#london-attractions , #rome-attractions , #paris-attractions , #new-york-attractions").addClass("hide-attractions");
	
	});




// Rome ------------------------------------------------------------------------
	

	$('.rome').on('click', function() { 
		$("#rome-attractions").removeClass("hide-attractions");
		$("#london-attractions , #amsterdam-attractions , #paris-attractions , #new-york-attractions").addClass("hide-attractions");
	});
	


 

// New York ------------------------------------------------------------------------
	


	$('.new-york').on('click', function () { 

		$("#new-york-attractions").removeClass("hide-attractions");
		$("#london-attractions , #amsterdam-attractions , #paris-attractions , #rome-attractions").addClass("hide-attractions");
	
	});
	



});






// Script that runs on every other time the discover page is init\loaded 
myApp.onPageReinit('discover', function (page) {
   
	activeNavRemove();
	$('.content-block p').eq(3).addClass('active-nav');



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
	
	$('.content-block p').eq(4).addClass('active-nav');


});




// Script that runs every time after the settings page is init\loaded 
myApp.onPageReinit('settings', function (page) {
   
	activeNavRemove();

	$('.content-block p').eq(4).addClass('active-nav');


});
