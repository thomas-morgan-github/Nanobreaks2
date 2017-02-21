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




var localData;

// Function to store JSONP in global variable --------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function jsonCallback (data) {
	localData = data; 
}

jsonCallback();




// Navigation bar Left panel script ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

$('.content-block p').on('click', function(){
    $('p.active-nav').removeClass('active-nav');
    $(this).addClass('active-nav');
});


$('.menu-icon-nav').on('click', function() { 
	$(this).toggleClass('close-panel open-panel');
});


$('#nav-icon3').click(function(){
	$(this).toggleClass('open');
});



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

	$$('input#email-login').on('blur',  function() { 

		var emailInput = $$('input#email-login').val();

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

	$$(".content-block p").removeClass("active");
	$$('.content-block p').eq(0).addClass('active-nav');



});



















 /* Search-page --------------------------------------------------------------------------------------------------------- */ 


$$(document).on('pageInit', '.page[data-page="search"]', function(e) {

	// Make search page left panel navigation have active highlight in panel menu - remove it from home 
	$$(".content-block p").removeClass("active");
	$$('.content-block p').eq(1).addClass('active-nav');



	$$('.bottom-skip-bar').on('click', function(){ 
		$$(this).parent().parent().hide();
	});



	// Autocomplete drop downs for departing destination -------------------------------------2----------------------------------------------------------

	var autocompleteDropdownAjax = myApp.autocomplete ({

	  input: '#autocomplete-departing-dropdown-ajax',
	  openIn: 'dropdown',
	  preloader: true, //enable preloader
	  valueProperty: 'value', //object's "value" property name
	  textProperty: 'text', //object's "text" property name
	  limit: 300, //limit to 300 results
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
	  limit: 300, //limit to 20 results
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
	    rangePicker: true,
	    events: {
	  		from: today
		},

		 disabled: [new Date(2017, 2, 20), new Date(2017, 02, 23)],


		rangesClasses: [
	    //Add "day-october' class for all october dates
	    {
	        // string CSS class name for this range in "cssClass" property
	        cssClass: 'day-october', //string CSS class          
	    },
	],
	});       





	// Remove user departure search input if invalid 
	function invalidDeparture() { 
		
		for (i=0; i < localData.length; i++ ) { 
		 
		 	if( $$('#autocomplete-departing-dropdown-ajax').val() !== localData[i].departure + " " + localData[i].depAir ) { 
		 		$$('#autocomplete-departing-dropdown-ajax').val("");	
		 	}

		}

	}


	// Remove user destination search input if invalid 
	function invalidDestination () { 

		for (i=0; i < localData.length; i++ ) { 
		 
		 	if( $('autocomplete-destination-dropdown-ajax').val() !== localData[i].destination ) { 
		 		$('#autocomplete-destination-dropdown-ajax').val("");	
		 	}

		}

	}

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

		// If one of the search requirments are meet add href 
		if ( departingVal !== "" || destinationVal !== "" || dateVal !== "" ) { 
			$(".compare-button").attr("href", "#deal-landing");
		}


	});






// End of search page --------------------------------------------------------------------------------------------------------------------------------------------------------
});



// Script for search form submit ( has to be outside of search page js, as its a global variable thats used on the search deal landing page ) ----------------------------------------------------------------------------------------------------------------------


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









// Deal landing page -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


$$(document).on('pageInit', '.page[data-page="deal-landing"]', function(e) {


	$(".content-block p").removeClass("active");





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
		              '<span class="dep-time">' +  localData[i].departureTime + '</span>' +
		            '</div>' +
		          '</div>' +
		          
		          '<div class="result-return">' + 
		            '<span class="result-return-airport">' + localData[i].destAir + '</span>' + 
		            '<div class="result-return-dates-container">' + 
		              '<span class="return-date">' + localData[i].returnDate + '</span>' + 
		              '<span class="return-time">' +  localData[i].returnTime  + '</span>' +
		            '</div>' +
		          '</div>' +

		        '</div>' + 

		        '<div class="result-price-and-button-container">' + 
		         '<span class="result-price">' +  "fr" + " " +
		            '<span class="pnd">' + "£"  + '</span>' + 
		            '<span class="price-inner">' + localData[i].price + '</span>' + " " + 
		              "pp" +  
		          '</span>' + 
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

		// Date and departure airport search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    
		
		else if ( (localData[i].departureDate == date) && ( localData[i].departure + " " + localData[i].depAir == departure ) && (destination == "") ) { 
			console.log("date and departure, destination empty");
	 		appendInputedDataToDeal();
		}

		// Departure only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    
		
		else if( (  localData[i].departure + " " + localData[i].depAir == departure  ) && (date == "") && (destination == "") ){ 	
			console.log('departure only other fields are empty');

			console.log(localData[i]);
	     	appendInputedDataToDeal();

	    }

		// Destination only search ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------					    

		else if( (localData[i].destination == destination ) && (date == "") && (departure == "") ) { 
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
	// Closing bracket for for loop 




// closing brackets for deal landing scripts -------------------------------------------------------------------------------------------------------------------------------------------------------
});










// Best deals page --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



$$(document).on('pageInit', '.page[data-page="best-deals"]', function(e) {
	



	// Make best deals page have active highlight in panel menu - remove it from home 
	$(".content-block p").removeClass("active");
	$('.content-block p').eq(2).addClass('active-nav');

	


	$('.bottom-skip-bar').on('click', function(){ 
		$(this).parent().parent().hide();
	});



		
	// // Sort by Price - return best deals 
    localData.sort(function(a, b) {
	    var a1= a.price, b1= b.price;
	    if(a1== b1) return 0;
	    return a1> b1? 1: -1;
	   
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
		              '<span class="dep-time">' +  localData[i].departureTime + '</span>' +
		            '</div>' +
		          '</div>' +
		          
		          '<div class="result-return">' + 
		            '<span class="result-return-airport">' + localData[i].destAir + '</span>' + 
		            '<div class="result-return-dates-container">' + 
		              '<span class="return-date">' + localData[i].returnDate + '</span>' + 
		              '<span class="return-time">' +  localData[i].returnTime  + '</span>' +
		            '</div>' +
		          '</div>' +

		        '</div>' + 

		        '<div class="result-price-and-button-container">' + 
		         '<span class="result-price">' +  "fr" + " " +
		            '<span class="pnd">' + "£"  + '</span>' + 
		            '<span class="price-inner">' + localData[i].price + '</span>' + " " + 
		              "pp" +  
		          '</span>' + 
		          '<a href="">' + 
		            '<span class="view-deal-button">' + "View deal" +  '</span>' + 
		          '</a>' + 
		        '</div>' + 
		      
		      '</div>' +

		    '</div>'

			);



    }	






   // add star rating class depending on deals rating 
    $$('.star-rating').each(function(i,e) {
        var rating = $$(this).text();
        if( rating == 1 ) {
           $$(elem).addClass('rating-1').html('');
        } else if (rating == 2) {
           $$(e).addClass('rating-2').html('');
        } else if(rating == 3) {
            $$(e).addClass('rating-3').html('');
        } else if( rating == 4) {
           $$(e).addClass('rating-4').html('');
        } else if( rating == 5) {
            $$(e).addClass('rating-5').html('');
        }
    });




    // add class to remove margin from top deal 
    $('.deal-wrappr').eq(0).addClass('best');
   
 
    // Add client name to best deal header 
   	$('.best-price-supplier').html(localData[0].clientName);
      
		   

// End of Best deals page -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
});






// // Start of about page -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

$$(document).on('pageInit', '.page[data-page="about"]', function(e) {

	$(".content-block p").removeClass("active");
	





	

});








// Start of discover page -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

$$(document).on('pageInit', '.page[data-page="discover"]', function(e) {


	$(".content-block p").removeClass("active");
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









