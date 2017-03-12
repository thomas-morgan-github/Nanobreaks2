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





// Check if apps run once before if so take action 
var applaunchCount = window.localStorage.getItem('launchCount');

//Check if it already exists or not
if(applaunchCount){

	 // Load login page and skip walkthrough if app has already been opened before by user 
 	mainView.router.load({pageName: 'home'});


   //This is a second time launch, and count = applaunchCount
   $('.search-bg-page .popup-wrappr').remove();

   $('.best-deals-page .popup-wrappr').remove();

   $('.swiper-container.walkthrough').remove();

  


}else{
  //Local storage is not set, hence first time launch. set the local storage item
  window.localStorage.setItem('launchCount',1);

  //Do the other stuff related to first time launch
}




$('.nav-close').on('click', function (e) {
    myApp.closePanel();
});



// setTimeout(function() {
// 	navigator.splashscreen.hide();
// }, 2000); 




// Splash on load --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// setTimeout(function() {
//    $('#splash').hide();
// }, 2000); // <-- time in milliseconds



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
	        subtitle: '<div class="todays-deal-destinations">' + todaysBestDeal.destination + '</div>' +  ", " + todaysBestDeal.accommodation  + " " + '<div class="todays-best-deals-price-container">'  + "£" + todaysBestDeal.price + "pp " + '</div>' +  '<span class="star-rating">' + todaysBestDeal.rating +  '</span>' + '<a class="view-todays-deal" href="#best-deals" > ' +  '<span class="view-deal-button">' + "View deal" +  '</span>' +  '<span class="blue-arrow-notifcation">  <svg version="1.1" id="blue-arrow-n" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="7px" height="8px" viewBox="0 0 9 10" style="enable-background:new 0 0 9 10;" xml:space="preserve"><path class="blue-arrow" d="M2.2,8.5c-0.3,0.3-0.3,0.7,0,1c0.3,0.3,0.8,0.3,1.1,0l4.3-4.1c0.3-0.3,0.3-0.7,0-1L3.3,0.4	C3,0.1,2.5,0.1,2.2,0.4s-0.3,0.7,0,1L6,5L2.2,8.5z"/></g></svg>  </span>'  + '</a>'   ,
	        message: 'Hello, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut posuere erat. Pellentesque id elementum urna, a aliquam ante. Donec vitae volutpat orci. Aliquam sed molestie risus, quis tincidunt dui.',
	        media: '<img width="44" height="44" style="border-radius:100%" src="img/todays-deal-img.svg">'
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


	    $(' .view-todays-deal .view-deal-button').on('click', function() { 
	    	$('.notifications').remove();
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





	// Autocomplete drop downs for departing airport -----------------------------------------------------------------------------------------------

	var autocompleteDropdownAll = myApp.autocomplete({

	    input: '#departing #autocomplete-dropdown-all',
	    openIn: 'dropdown',
	    source: function (autocomplete, query, render) {
	        

	        var results = [];
	    	var destinationInputVal = $('#travel #autocomplete-dropdown-all').val();




// if theres no destination selected show all avaliable airports


	    	if ( destinationInputVal  == "" ) {


	    		var departureWithAirportCode = [];


				// loop through local data and add all depature airport and departure airport codes to empty array 
				for ( var i = 0 ; i < localData.length; i ++ ) { 
					departureWithAirportCode.push( localData[i].departure + " " + localData[i].depAir );
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

			}





// if theres a destination selected show only airports avalible to that destination


			var departureAirportAvaliableForDestination = [];
			var uniqueDepartureAirportAvaliableForDestination = [];


			for ( var i = 0; i < localData.length; i ++ ) { 

				if ( destinationInputVal == localData[i].destination  ) { 

					departureAirportAvaliableForDestination.push( localData[i].departure + " " + localData[i].depAir );						

				}

			}


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



	console.log(localData);




// Autocomplete drop downs for destination -----------------------------------------------------------------------------------------------


	var autocompleteDropdownAll = myApp.autocomplete({
	    
	    input: '#travel #autocomplete-dropdown-all',
	    openIn: 'dropdown',
	    source: function (autocomplete, query, render) {
	  

			var results = [];	 
	    	var departureAirport = $('#departing #autocomplete-dropdown-all').val();



			if (  departureAirport == "" ) { 

				var allDestinations = [];

				for ( var i = 0 ; i < localData.length; i ++ ) { 
					allDestinations.push(localData[i].destination);
				}

				var uniqueAllDestinations = [];

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





// Show only destinations avaliable for selected airport

		    
			var avaliableDestinations = [];
			var uniqueDestinationNames = [];
		



			for ( var i = 0 ; i < localData.length; i ++ ) { 


		    	if (( departureAirport == localData[i].departure + " " + localData[i].departureAirportCode )) { 

		    		avaliableDestinations.push(localData[i].destination);

		    				   
		    	}

		    }

		    	

    
			for(var i in avaliableDestinations){
		        if( uniqueDestinationNames.indexOf(avaliableDestinations[i]) === -1){
		            uniqueDestinationNames.push(avaliableDestinations[i]);
		        }
		    }


		    for (var i = 0; i < uniqueDestinationNames.length; i++) { 
		       	if (uniqueDestinationNames[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(uniqueDestinationNames[i]);
		    }



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

	departure = $(searchPageContainer).find("#departing #autocomplete-dropdown-all" ).val();
	destination = $(searchPageContainer).find("#travel #autocomplete-dropdown-all").val();
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


	// Remove all saved inputed search values 
	$('#autocomplete-dropdown-all').val("");
	$('#travel #autocomplete-dropdown-all').val("");
	$('#calendar-default').val("");
	$('#adults-dropdown').val("");
	$('#children-dropdown').val("");

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
		      '<div class="deal-info-container" style="background-image: url(' + localData[i].contentImage + '), url(img/no-image450x250.jpg);">' +  
		         
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
		            '<span class="destination-icon"> <svg version="1.1" id="destination-icon-red" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="28.4px" height="41.6px" viewBox="0 0 28.4 41.6" style="enable-background:new 0 0 28.4 41.6;" xml:space="preserve"><g><path class="destination-icon-white" d="M28.2,14.5c0-7.7-6.3-14-14-14s-14,6.3-14,14c0,10.9,14,26.4,14,26.4S28.2,25.4,28.2,14.5z M8,14.5	c0-3.4,2.8-6.2,6.2-6.2s6.2,2.8,6.2,6.2c0,3.4-2.8,6.2-6.2,6.2S8,18,8,14.5z"/></g></svg>  </span>' + 
		            '<span class="destination">' +  localData[i].destination  + '</span>' +  
		            '<span class="star-rating-container">' +  
		              '<span class="star-rating">' + localData[i].rating  +  '</span>' + 
	            	'</span>' +
	            	'<span class="adults-icon icon">  <svg version="1.1" id="adults-icon-search" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="31.5px" viewBox="0 0 48 31.5" style="enable-background:new 0 0 48 31.5;" xml:space="preserve"><path id="adults_2_" class="adult-icon" d="M36.5,19.8L36.5,19.8z M11.5,19.8L11.5,19.8z M0.6,31.2h31.5v-1.3c0.2-2.4-1-4.6-3.1-5.8c-2.3-1.4-4.7-2.7-7.1-3.9c-0.6-0.5-1-1.2-1-2c-0.1-0.3-0.1-0.6-0.1-0.8c3.5-3.1,2.8-9.7,2.8-9.7c-0.4-7.4-6.6-7.4-7.2-7.4c-0.6,0-6.8-0.1-7.2,7.4c0,0-0.7,6.6,2.8,9.7c0,0.3,0,0.5-0.1,0.8c0,0.8-0.4,1.5-1,2c0,0-3.8,1.8-7.1,3.9c-2.1,1.1-3.3,3.4-3.1,5.8v1.3H0.6z M32.1,30L32.1,30C32,29.9,32.1,29.9,32.1,30z M0.6,30L0.6,30z M29.6,17c0,0-2.5,1.2-4.9,2.7c1.4,0.7,3.4,1.8,5.3,3 c1.3,0.8,2.4,1.9,3.1,3.3c0,0,0,0.1,0.1,0.1h14.3v-1l0,0c0.2-2-0.8-3.9-2.6-4.8C43,19.1,41,18,39,17c-0.5-0.4-0.8-1-0.8-1.7 c-0.1-0.2-0.1-0.5-0.1-0.7c2.9-2.6,2.3-8.1,2.3-8.1c-0.3-6.2-5.5-6.2-6-6.1c-3.2-0.1-5.9,2.3-6,5.5c0,0.2,0,0.4,0,0.6  c0,0-0.6,5.5,2.3,8.1c0,0.2,0,0.5-0.1,0.7C30.5,16,30.1,16.6,29.6,17L29.6,17z M47.4,25.1L47.4,25.1z"/>   </svg></span>' +
                    '<span class="adults">' +  localData[i].adults  + '</span>' +
	            	'<svg version="1.1" id="children-icon-search" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="47.4px" height="41.9px" viewBox="0 0 47.4 41.9" style="enable-background:new 0 0 47.4 41.9;" xml:space="preserve"> <path id="Children_Icon_2_" class="children-icon" d="M30.8,41.8V30.2l-5.9-0.5c-0.2,0-0.4,0-0.6-0.1l0,0l0,0c-0.8-0.2-1.5-0.7-1.9-1.4l-2.3-4.5v17.9h-5.8v-8h-0.8v8H7.8V23.7l-2.3,4.5c-0.7,1.3-2.3,1.9-3.6,1.2s-1.8-2.3-1.1-3.6l4.6-8.9c0.1-0.2,0.2-0.3,0.3-0.4c0.4-1.2,1.6-2,2.9-2h10.9c1.3,0,2.4,0.8,2.9,2c0.1,0.1,0.2,0.3,0.3,0.4l4.4,8.5h13.6c1,0,1.8,0.6,2.1,1.5c0.1,0.1,0.1,0.2,0.2,0.3   l3.4,6.6c0.5,0.9,0.2,2.1-0.7,2.7c-0.9,0.5-2.1,0.2-2.7-0.7l-0.1-0.1l-1.7-3.4v9.5h-4.8v-6.5h-0.6v6.5  C35.6,41.8,30.8,41.8,30.8,41.8z M31.5,19c0-2.2,1.8-4,4-4s4,1.8,4,4s-1.8,4-4,4l0,0C33.3,23.1,31.5,21.3,31.5,19z M8.7,5.8   c0-3,2.4-5.4,5.4-5.4s5.4,2.4,5.4,5.4s-2.4,5.4-5.4,5.4l0,0C11.1,11.2,8.7,8.8,8.7,5.8z"/> </svg>' 
					+ '<span class="children">' +  localData[i].children  + '</span>' +
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
		 	$("#search-destination").html("in" + " " + destination + '<span class="refine"> , refine search to find more deals </span>'    );
		}

	}
	// end of for loop 


	   console.log(localData);

	
	var DealCounter = $('.deal-landing-page #deals-container .deal-wrappr').length;

	$("#deal-count").html(DealCounter);



// closing brackets for deal landing scripts -------------------------------------------------------------------------------------------------------------------------------------------------------
});
























// Script that runs on every other time the deallanding page is init\loaded  
myApp.onPageReinit('deal-landing', function (page) {
   

 	

	activeNavRemove();


	// Hide previous searched deals 
	$(".deal-landing-page #deals-container .deal-wrappr").each(function () {
	    $(this).remove();
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
		      '<div class="deal-info-container" style="background-image: url(' + localData[i].contentImage + '), url(img/no-image450x250.jpg);">' +  
		         
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
		            '<span class="destination-icon"> <svg version="1.1" id="destination-icon-red" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="28.4px" height="41.6px" viewBox="0 0 28.4 41.6" style="enable-background:new 0 0 28.4 41.6;" xml:space="preserve"><g><path class="destination-icon-white" d="M28.2,14.5c0-7.7-6.3-14-14-14s-14,6.3-14,14c0,10.9,14,26.4,14,26.4S28.2,25.4,28.2,14.5z M8,14.5	c0-3.4,2.8-6.2,6.2-6.2s6.2,2.8,6.2,6.2c0,3.4-2.8,6.2-6.2,6.2S8,18,8,14.5z"/></g></svg>  </span>' + 
		            '<span class="destination">' +  localData[i].destination  + '</span>' +  
		            '<span class="star-rating-container">' +  
		              '<span class="star-rating">' + localData[i].rating  +  '</span>' + 
	            	'</span>' +
	            	'<span class="adults-icon icon">  <svg version="1.1" id="adults-icon-search" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="31.5px" viewBox="0 0 48 31.5" style="enable-background:new 0 0 48 31.5;" xml:space="preserve"><path id="adults_2_" class="adult-icon" d="M36.5,19.8L36.5,19.8z M11.5,19.8L11.5,19.8z M0.6,31.2h31.5v-1.3c0.2-2.4-1-4.6-3.1-5.8c-2.3-1.4-4.7-2.7-7.1-3.9c-0.6-0.5-1-1.2-1-2c-0.1-0.3-0.1-0.6-0.1-0.8c3.5-3.1,2.8-9.7,2.8-9.7c-0.4-7.4-6.6-7.4-7.2-7.4c-0.6,0-6.8-0.1-7.2,7.4c0,0-0.7,6.6,2.8,9.7c0,0.3,0,0.5-0.1,0.8c0,0.8-0.4,1.5-1,2c0,0-3.8,1.8-7.1,3.9c-2.1,1.1-3.3,3.4-3.1,5.8v1.3H0.6z M32.1,30L32.1,30C32,29.9,32.1,29.9,32.1,30z M0.6,30L0.6,30z M29.6,17c0,0-2.5,1.2-4.9,2.7c1.4,0.7,3.4,1.8,5.3,3 c1.3,0.8,2.4,1.9,3.1,3.3c0,0,0,0.1,0.1,0.1h14.3v-1l0,0c0.2-2-0.8-3.9-2.6-4.8C43,19.1,41,18,39,17c-0.5-0.4-0.8-1-0.8-1.7 c-0.1-0.2-0.1-0.5-0.1-0.7c2.9-2.6,2.3-8.1,2.3-8.1c-0.3-6.2-5.5-6.2-6-6.1c-3.2-0.1-5.9,2.3-6,5.5c0,0.2,0,0.4,0,0.6  c0,0-0.6,5.5,2.3,8.1c0,0.2,0,0.5-0.1,0.7C30.5,16,30.1,16.6,29.6,17L29.6,17z M47.4,25.1L47.4,25.1z"/>   </svg></span>' +
	            	'<span class="adults">' +  localData[i].adults  + '</span>' +
	            	'<svg version="1.1" id="children-icon-search" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="47.4px" height="41.9px" viewBox="0 0 47.4 41.9" style="enable-background:new 0 0 47.4 41.9;" xml:space="preserve"> <path id="Children_Icon_2_" class="children-icon" d="M30.8,41.8V30.2l-5.9-0.5c-0.2,0-0.4,0-0.6-0.1l0,0l0,0c-0.8-0.2-1.5-0.7-1.9-1.4l-2.3-4.5v17.9h-5.8v-8h-0.8v8H7.8V23.7l-2.3,4.5c-0.7,1.3-2.3,1.9-3.6,1.2s-1.8-2.3-1.1-3.6l4.6-8.9c0.1-0.2,0.2-0.3,0.3-0.4c0.4-1.2,1.6-2,2.9-2h10.9c1.3,0,2.4,0.8,2.9,2c0.1,0.1,0.2,0.3,0.3,0.4l4.4,8.5h13.6c1,0,1.8,0.6,2.1,1.5c0.1,0.1,0.1,0.2,0.2,0.3   l3.4,6.6c0.5,0.9,0.2,2.1-0.7,2.7c-0.9,0.5-2.1,0.2-2.7-0.7l-0.1-0.1l-1.7-3.4v9.5h-4.8v-6.5h-0.6v6.5  C35.6,41.8,30.8,41.8,30.8,41.8z M31.5,19c0-2.2,1.8-4,4-4s4,1.8,4,4s-1.8,4-4,4l0,0C33.3,23.1,31.5,21.3,31.5,19z M8.7,5.8   c0-3,2.4-5.4,5.4-5.4s5.4,2.4,5.4,5.4s-2.4,5.4-5.4,5.4l0,0C11.1,11.2,8.7,8.8,8.7,5.8z"/> </svg>' +
	            	'<span class="children">' +  localData[i].children  + '</span>' +
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

	}
	// end of for loop 


	var DealCounter = $('.deal-landing-page #deals-container .deal-wrappr').length;

	$("#deal-count").html(DealCounter);




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
		      '<div class="deal-info-container" style="background-image: url(' + localData[i].contentImage + '),  url(img/no-image450x250.jpg); ">'  +  
		         
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
		            '<span class="destination-icon"> <svg version="1.1" id="destination-icon-red" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="28.4px" height="41.6px" viewBox="0 0 28.4 41.6" style="enable-background:new 0 0 28.4 41.6;" xml:space="preserve"><g><path class="destination-icon-white" d="M28.2,14.5c0-7.7-6.3-14-14-14s-14,6.3-14,14c0,10.9,14,26.4,14,26.4S28.2,25.4,28.2,14.5z M8,14.5	c0-3.4,2.8-6.2,6.2-6.2s6.2,2.8,6.2,6.2c0,3.4-2.8,6.2-6.2,6.2S8,18,8,14.5z"/></g></svg>  </span>' + 
		            '<span class="destination">' +  localData[i].destination  + '</span>' +  
		            '<span class="star-rating-container">' +  
		              '<span class="star-rating">' + localData[i].rating  +  '</span>' + 
		            '</span>' +
		           	'<span class="adults-icon icon">  <svg version="1.1" id="adults-icon-search" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="31.5px" viewBox="0 0 48 31.5" style="enable-background:new 0 0 48 31.5;" xml:space="preserve"><path id="adults_2_" class="adult-icon" d="M36.5,19.8L36.5,19.8z M11.5,19.8L11.5,19.8z M0.6,31.2h31.5v-1.3c0.2-2.4-1-4.6-3.1-5.8c-2.3-1.4-4.7-2.7-7.1-3.9c-0.6-0.5-1-1.2-1-2c-0.1-0.3-0.1-0.6-0.1-0.8c3.5-3.1,2.8-9.7,2.8-9.7c-0.4-7.4-6.6-7.4-7.2-7.4c-0.6,0-6.8-0.1-7.2,7.4c0,0-0.7,6.6,2.8,9.7c0,0.3,0,0.5-0.1,0.8c0,0.8-0.4,1.5-1,2c0,0-3.8,1.8-7.1,3.9c-2.1,1.1-3.3,3.4-3.1,5.8v1.3H0.6z M32.1,30L32.1,30C32,29.9,32.1,29.9,32.1,30z M0.6,30L0.6,30z M29.6,17c0,0-2.5,1.2-4.9,2.7c1.4,0.7,3.4,1.8,5.3,3 c1.3,0.8,2.4,1.9,3.1,3.3c0,0,0,0.1,0.1,0.1h14.3v-1l0,0c0.2-2-0.8-3.9-2.6-4.8C43,19.1,41,18,39,17c-0.5-0.4-0.8-1-0.8-1.7 c-0.1-0.2-0.1-0.5-0.1-0.7c2.9-2.6,2.3-8.1,2.3-8.1c-0.3-6.2-5.5-6.2-6-6.1c-3.2-0.1-5.9,2.3-6,5.5c0,0.2,0,0.4,0,0.6  c0,0-0.6,5.5,2.3,8.1c0,0.2,0,0.5-0.1,0.7C30.5,16,30.1,16.6,29.6,17L29.6,17z M47.4,25.1L47.4,25.1z"/>   </svg></span>' +
		            '<span class="adults">' +  localData[i].adults  + '</span>' +
		           	'<svg version="1.1" id="children-icon-search" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="47.4px" height="41.9px" viewBox="0 0 47.4 41.9" style="enable-background:new 0 0 47.4 41.9;" xml:space="preserve"> <path id="Children_Icon_2_" class="children-icon" d="M30.8,41.8V30.2l-5.9-0.5c-0.2,0-0.4,0-0.6-0.1l0,0l0,0c-0.8-0.2-1.5-0.7-1.9-1.4l-2.3-4.5v17.9h-5.8v-8h-0.8v8H7.8V23.7l-2.3,4.5c-0.7,1.3-2.3,1.9-3.6,1.2s-1.8-2.3-1.1-3.6l4.6-8.9c0.1-0.2,0.2-0.3,0.3-0.4c0.4-1.2,1.6-2,2.9-2h10.9c1.3,0,2.4,0.8,2.9,2c0.1,0.1,0.2,0.3,0.3,0.4l4.4,8.5h13.6c1,0,1.8,0.6,2.1,1.5c0.1,0.1,0.1,0.2,0.2,0.3   l3.4,6.6c0.5,0.9,0.2,2.1-0.7,2.7c-0.9,0.5-2.1,0.2-2.7-0.7l-0.1-0.1l-1.7-3.4v9.5h-4.8v-6.5h-0.6v6.5  C35.6,41.8,30.8,41.8,30.8,41.8z M31.5,19c0-2.2,1.8-4,4-4s4,1.8,4,4s-1.8,4-4,4l0,0C33.3,23.1,31.5,21.3,31.5,19z M8.7,5.8   c0-3,2.4-5.4,5.4-5.4s5.4,2.4,5.4,5.4s-2.4,5.4-5.4,5.4l0,0C11.1,11.2,8.7,8.8,8.7,5.8z"/> </svg>' +
	            	'<span class="children">' +  localData[i].children  + '</span>' +
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


    $('.deal-wrappr.best .result-price-container').prepend( '<svg version="1.1" id="banner-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"width="38.6px" height="55.4px" viewBox="0 0 38.6 55.4" style="enable-background:new 0 0 38.6 55.4;" xml:space="preserve"><path class="banner-icon" d="M19.5,12c-0.1,0-0.3,0-0.4,0c-2.1,0.2-4.1,2-3.9,4.7c0,0.2,0,0.4,0.1,0.7c-0.2,0-0.4,0-0.5,0c-0.6,0-1,0.6-1,1.1s0.6,1,1.1,1h0.6c0,0.4,0.1,0.8,0.1,1.1c0,0.9-0.2,1.6-0.9,2.6c-0.2,0.3-0.2,0.8-0.1,1.1s0.6,0.6,1,0.6h7.2c0.6,0,1.1-0.5,1.1-1.1s-0.5-1.1-1.1-1.1h-5.5c0.3-0.7,0.4-1.4,0.4-2.1c0-0.4,0-0.7-0.1-1.1h2.6c0.6,0,1.1-0.5,1.1-1.1s-0.5-1.1-1.1-1.1h-2.8c0-0.3,0-0.5-0.1-0.8l0,0c-0.1-1.6,0.9-2.3,2-2.4c0.6-0.1,1.1,0.1,1.5,0.4s0.7,0.7,0.8,1.5c0.1,0.6,0.6,1,1.2,1c0.6-0.1,1-0.6,1-1.2c-0.1-1.3-0.8-2.4-1.7-3C21.4,12.3,20.4,12,19.5,12z"/><path class="banner-icon" d="M15.9,39.6c0.6,0,1.2-0.1,1.8-0.3l-6.1,15.2c-0.2,0.5-0.8,0.5-1.1,0.1l-2.9-5.1c-0.1-0.2-0.3-0.2-0.5-0.2L1.7,51c-0.5,0.2-0.9-0.3-0.7-0.8l5.8-14.4c0.8,0.4,1.6,0.6,2.5,0.6c0.4,0,0.7-0.1,1.1-0.1h0.1l0.1,0.1C11.6,38.4,13.7,39.6,15.9,39.6z M32.2,35.9c-0.8,0.4-1.6,0.6-2.6,0.6c-0.4,0-0.7-0.1-1.1-0.1h-0.1l-0.1,0.1c-1.1,1.9-3.1,3.1-5.3,3.1c-0.6,0-1.2-0.1-1.8-0.3l6.1,15.3c0.2,0.5,0.8,0.5,1.1,0.1l2.9-5.1c0.1-0.2,0.3-0.2,0.5-0.2l5.4,1.7c0.5,0.2,0.9-0.3,0.7-0.8L32.2,35.9z"/><path class="banner-icon" d="M37.1,17.1c1.1,1,1.1,2.7,0,3.6l-0.7,0.6c-0.8,0.7-1.1,1.8-0.6,2.8l0.4,0.9c0.6,1.4-0.2,2.9-1.6,3.3l-0.9,0.2c-1,0.3-1.7,1.2-1.8,2.2l-0.1,0.9c-0.1,1.5-1.4,2.5-2.9,2.3L28,33.7c-1-0.2-2.1,0.3-2.6,1.2l-0.5,0.8c-0.7,1.3-2.4,1.6-3.6,0.8l-0.8-0.6c-0.8-0.6-2-0.6-2.8,0l-0.8,0.5c-1.2,0.8-2.9,0.5-3.5-0.8l-0.5-0.8c-0.5-0.9-1.5-1.4-2.5-1.2l-0.9,0.2C8,34,6.7,33,6.7,31.5l-0.1-0.9c-0.1-1.1-0.8-1.9-1.8-2.2l-0.9-0.2c-1.4-0.4-2.1-1.9-1.6-3.3L2.7,24c0.4-0.9,0.2-2.1-0.6-2.8l-0.7-0.6c-1.1-1-1.1-2.7,0-3.6l0.7-0.6c0.8-0.7,1.1-1.8,0.6-2.8l-0.4-0.9c-0.6-1.4,0.2-2.9,1.6-3.3l0.9-0.2C5.8,8.9,6.5,8,6.6,7l0.1-0.9c0.1-1.5,1.4-2.5,2.9-2.3L10.5,4c1,0.2,2.1-0.3,2.6-1.2L13.6,2c0.7-1.3,2.4-1.6,3.6-0.8L18,1.8c0.8,0.6,2,0.6,2.8,0l0.8-0.5c1.2-0.8,2.9-0.5,3.5,0.8l0.5,0.8c0.5,0.9,1.5,1.4,2.5,1.2L29,3.9c1.5-0.2,2.8,0.8,2.8,2.3l0.1,0.9C32,8.2,32.7,9,33.7,9.3l0.9,0.2c1.4,0.4,2.1,1.9,1.6,3.3l-0.4,0.9c-0.4,0.9-0.2,2.1,0.6,2.8L37.1,17.1z M31.1,18.9C31.1,12.3,25.8,7,19.2,7S7.3,12.3,7.3,18.9s5.3,11.9,11.9,11.9S31.1,25.5,31.1,18.9z"/></svg>' );



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
		      '<div class="deal-info-container" style="background-image: url(' + localData[i].contentImage + '),  url(img/no-image450x250.jpg); ">'  +  
		         
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
		            '<span class="destination-icon"> <svg version="1.1" id="destination-icon-red" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="28.4px" height="41.6px" viewBox="0 0 28.4 41.6" style="enable-background:new 0 0 28.4 41.6;" xml:space="preserve"><g><path class="destination-icon-white" d="M28.2,14.5c0-7.7-6.3-14-14-14s-14,6.3-14,14c0,10.9,14,26.4,14,26.4S28.2,25.4,28.2,14.5z M8,14.5	c0-3.4,2.8-6.2,6.2-6.2s6.2,2.8,6.2,6.2c0,3.4-2.8,6.2-6.2,6.2S8,18,8,14.5z"/></g></svg>  </span>' + 
		            '<span class="destination">' +  localData[i].destination  + '</span>' +
		            '<span class="star-rating-container">' +  
		              '<span class="star-rating">' + localData[i].rating  +  '</span>' + 
		            '</span>' +
		         	'<span class="adults-icon icon">  <svg version="1.1" id="adults-icon-search" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="31.5px" viewBox="0 0 48 31.5" style="enable-background:new 0 0 48 31.5;" xml:space="preserve"><path id="adults_2_" class="adult-icon" d="M36.5,19.8L36.5,19.8z M11.5,19.8L11.5,19.8z M0.6,31.2h31.5v-1.3c0.2-2.4-1-4.6-3.1-5.8c-2.3-1.4-4.7-2.7-7.1-3.9c-0.6-0.5-1-1.2-1-2c-0.1-0.3-0.1-0.6-0.1-0.8c3.5-3.1,2.8-9.7,2.8-9.7c-0.4-7.4-6.6-7.4-7.2-7.4c-0.6,0-6.8-0.1-7.2,7.4c0,0-0.7,6.6,2.8,9.7c0,0.3,0,0.5-0.1,0.8c0,0.8-0.4,1.5-1,2c0,0-3.8,1.8-7.1,3.9c-2.1,1.1-3.3,3.4-3.1,5.8v1.3H0.6z M32.1,30L32.1,30C32,29.9,32.1,29.9,32.1,30z M0.6,30L0.6,30z M29.6,17c0,0-2.5,1.2-4.9,2.7c1.4,0.7,3.4,1.8,5.3,3 c1.3,0.8,2.4,1.9,3.1,3.3c0,0,0,0.1,0.1,0.1h14.3v-1l0,0c0.2-2-0.8-3.9-2.6-4.8C43,19.1,41,18,39,17c-0.5-0.4-0.8-1-0.8-1.7 c-0.1-0.2-0.1-0.5-0.1-0.7c2.9-2.6,2.3-8.1,2.3-8.1c-0.3-6.2-5.5-6.2-6-6.1c-3.2-0.1-5.9,2.3-6,5.5c0,0.2,0,0.4,0,0.6  c0,0-0.6,5.5,2.3,8.1c0,0.2,0,0.5-0.1,0.7C30.5,16,30.1,16.6,29.6,17L29.6,17z M47.4,25.1L47.4,25.1z"/>   </svg></span>' +
		            '<span class="adults">' +  localData[i].adults  + '</span>' +
	            	'<svg version="1.1" id="children-icon-search" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="47.4px" height="41.9px" viewBox="0 0 47.4 41.9" style="enable-background:new 0 0 47.4 41.9;" xml:space="preserve"> <path id="Children_Icon_2_" class="children-icon" d="M30.8,41.8V30.2l-5.9-0.5c-0.2,0-0.4,0-0.6-0.1l0,0l0,0c-0.8-0.2-1.5-0.7-1.9-1.4l-2.3-4.5v17.9h-5.8v-8h-0.8v8H7.8V23.7l-2.3,4.5c-0.7,1.3-2.3,1.9-3.6,1.2s-1.8-2.3-1.1-3.6l4.6-8.9c0.1-0.2,0.2-0.3,0.3-0.4c0.4-1.2,1.6-2,2.9-2h10.9c1.3,0,2.4,0.8,2.9,2c0.1,0.1,0.2,0.3,0.3,0.4l4.4,8.5h13.6c1,0,1.8,0.6,2.1,1.5c0.1,0.1,0.1,0.2,0.2,0.3   l3.4,6.6c0.5,0.9,0.2,2.1-0.7,2.7c-0.9,0.5-2.1,0.2-2.7-0.7l-0.1-0.1l-1.7-3.4v9.5h-4.8v-6.5h-0.6v6.5  C35.6,41.8,30.8,41.8,30.8,41.8z M31.5,19c0-2.2,1.8-4,4-4s4,1.8,4,4s-1.8,4-4,4l0,0C33.3,23.1,31.5,21.3,31.5,19z M8.7,5.8   c0-3,2.4-5.4,5.4-5.4s5.4,2.4,5.4,5.4s-2.4,5.4-5.4,5.4l0,0C11.1,11.2,8.7,8.8,8.7,5.8z"/> </svg>' +
	            	'<span class="children">' +  localData[i].children  + '</span>' +
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
    $('.deal-wrappr').eq(0).addClass('top-margin').addClass('high-to-low');

    $('.deal-wrappr.high-to-low .result-price-container').prepend( '<svg version="1.1" id="high-to-low-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="43.8px" height="43.3px" viewBox="0 0 43.8 43.3" style="enable-background:new 0 0 43.8 43.3;" xml:space="preserve"><g transform="translate(0,-952.36218)"><path class="price-icon" d="M24.5,953.8c-0.2,0-0.5,0.1-0.6,0.3L3.1,974.9c-0.8,0.8-1.2,1.7-1.2,2.8c0,1,0.5,2,1.2,2.7L16,993.3c0.7,0.7,1.7,1.2,2.7,1.2s2-0.5,2.7-1.2l20.8-20.8c0.2-0.2,0.3-0.4,0.3-0.6V958c0-2.2-1.8-4.2-4.2-4.2L24.5,953.8L24.5,953.8z M40.7,957.9v13.5l-20.5,20.5c-0.4,0.4-0.9,0.7-1.4,0.7s-1-0.2-1.4-0.7L4.5,979c-0.5-0.5-0.6-0.9-0.6-1.4s0.2-1,0.6-1.5L25,955.6h13.5C39.7,955.6,40.7,956.7,40.7,957.9z M31.2,961.4c0,1.9,1.6,3.5,3.5,3.5s3.5-1.6,3.5-3.5s-1.6-3.5-3.5-3.5C32.8,957.9,31.2,959.5,31.2,961.4z M36.3,961.4c0,0.9-0.7,1.6-1.6,1.6c-0.9,0-1.6-0.7-1.6-1.6s0.7-1.6,1.6-1.6S36.3,960.5,36.3,961.4z"/></g><path class="price-icon" d="M16.1,27.6c0.7-0.5,1.3-1.1,1.8-1.7s0.7-1.3,0.7-2c0-0.2,0-0.5-0.1-0.7s-0.1-0.4-0.3-0.7H16v-1h1.5c0,0-0.1-0.2-0.3-0.6c-0.2-0.4-0.4-0.8-0.4-1c-0.1-0.2-0.1-0.4-0.2-0.7c0-0.3-0.1-0.5-0.1-0.8c0-1,0.4-1.9,1.2-2.7c0.8-0.8,2-1.2,3.6-1.2c1.5,0,2.6,0.4,3.3,1.2c0.7,0.8,1.1,1.9,1.2,3.4H24c0-1-0.2-1.7-0.7-2.3c-0.5-0.5-1.2-0.8-2.1-0.8s-1.6,0.2-2.1,0.7s-0.7,1.1-0.7,1.8c0,0.3,0.1,0.7,0.2,1c0.1,0.4,0.5,1,0.9,1.9h3.2v1h-2.8c0.1,0.3,0.1,0.5,0.1,0.7s0,0.3,0,0.5c0,0.7-0.2,1.3-0.6,1.9s-1,1.3-1.8,1.9c0.5-0.2,0.9-0.4,1.3-0.5s0.9-0.2,1.3-0.2c0.5,0,1.1,0.1,1.9,0.3c0.8,0.2,1.3,0.3,1.5,0.3c0.3,0,0.6-0.1,0.8-0.2c0.2-0.1,0.4-0.2,0.7-0.5l0.8,1.3c-0.4,0.3-0.7,0.5-1,0.7c-0.5,0.2-1,0.3-1.5,0.3c-0.4,0-1.1-0.2-2-0.5s-1.7-0.5-2.2-0.5s-1,0.1-1.4,0.3c-0.3,0.1-0.6,0.3-1,0.5L16.1,27.6z"/></svg>' );


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
		      '<div class="deal-info-container" style="background-image: url(' +  ratingData[i].contentImage + '),  url(img/no-image450x250.jpg); ">'  +  
		         
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
		           	'<span class="destination-icon"> <svg version="1.1" id="destination-icon-red" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="28.4px" height="41.6px" viewBox="0 0 28.4 41.6" style="enable-background:new 0 0 28.4 41.6;" xml:space="preserve"><g><path class="destination-icon-white" d="M28.2,14.5c0-7.7-6.3-14-14-14s-14,6.3-14,14c0,10.9,14,26.4,14,26.4S28.2,25.4,28.2,14.5z M8,14.5	c0-3.4,2.8-6.2,6.2-6.2s6.2,2.8,6.2,6.2c0,3.4-2.8,6.2-6.2,6.2S8,18,8,14.5z"/></g></svg>  </span>' + 
		            '<span class="destination">' +  ratingData[i].destination  + '</span>' +  
		            '<span class="star-rating-container">' +  
		              '<span class="star-rating">' +  ratingData[i].rating  +  '</span>' + 
		            '</span>' +
		            '<span class="adults-icon icon">  <svg version="1.1" id="adults-icon-search" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="31.5px" viewBox="0 0 48 31.5" style="enable-background:new 0 0 48 31.5;" xml:space="preserve"><path id="adults_2_" class="adult-icon" d="M36.5,19.8L36.5,19.8z M11.5,19.8L11.5,19.8z M0.6,31.2h31.5v-1.3c0.2-2.4-1-4.6-3.1-5.8c-2.3-1.4-4.7-2.7-7.1-3.9c-0.6-0.5-1-1.2-1-2c-0.1-0.3-0.1-0.6-0.1-0.8c3.5-3.1,2.8-9.7,2.8-9.7c-0.4-7.4-6.6-7.4-7.2-7.4c-0.6,0-6.8-0.1-7.2,7.4c0,0-0.7,6.6,2.8,9.7c0,0.3,0,0.5-0.1,0.8c0,0.8-0.4,1.5-1,2c0,0-3.8,1.8-7.1,3.9c-2.1,1.1-3.3,3.4-3.1,5.8v1.3H0.6z M32.1,30L32.1,30C32,29.9,32.1,29.9,32.1,30z M0.6,30L0.6,30z M29.6,17c0,0-2.5,1.2-4.9,2.7c1.4,0.7,3.4,1.8,5.3,3 c1.3,0.8,2.4,1.9,3.1,3.3c0,0,0,0.1,0.1,0.1h14.3v-1l0,0c0.2-2-0.8-3.9-2.6-4.8C43,19.1,41,18,39,17c-0.5-0.4-0.8-1-0.8-1.7 c-0.1-0.2-0.1-0.5-0.1-0.7c2.9-2.6,2.3-8.1,2.3-8.1c-0.3-6.2-5.5-6.2-6-6.1c-3.2-0.1-5.9,2.3-6,5.5c0,0.2,0,0.4,0,0.6  c0,0-0.6,5.5,2.3,8.1c0,0.2,0,0.5-0.1,0.7C30.5,16,30.1,16.6,29.6,17L29.6,17z M47.4,25.1L47.4,25.1z"/>   </svg></span>' +
		            '<span class="adults">' +  ratingData[i].adults  + '</span>' +
		            '<svg version="1.1" id="children-icon-search" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="47.4px" height="41.9px" viewBox="0 0 47.4 41.9" style="enable-background:new 0 0 47.4 41.9;" xml:space="preserve"> <path id="Children_Icon_2_" class="children-icon" d="M30.8,41.8V30.2l-5.9-0.5c-0.2,0-0.4,0-0.6-0.1l0,0l0,0c-0.8-0.2-1.5-0.7-1.9-1.4l-2.3-4.5v17.9h-5.8v-8h-0.8v8H7.8V23.7l-2.3,4.5c-0.7,1.3-2.3,1.9-3.6,1.2s-1.8-2.3-1.1-3.6l4.6-8.9c0.1-0.2,0.2-0.3,0.3-0.4c0.4-1.2,1.6-2,2.9-2h10.9c1.3,0,2.4,0.8,2.9,2c0.1,0.1,0.2,0.3,0.3,0.4l4.4,8.5h13.6c1,0,1.8,0.6,2.1,1.5c0.1,0.1,0.1,0.2,0.2,0.3   l3.4,6.6c0.5,0.9,0.2,2.1-0.7,2.7c-0.9,0.5-2.1,0.2-2.7-0.7l-0.1-0.1l-1.7-3.4v9.5h-4.8v-6.5h-0.6v6.5  C35.6,41.8,30.8,41.8,30.8,41.8z M31.5,19c0-2.2,1.8-4,4-4s4,1.8,4,4s-1.8,4-4,4l0,0C33.3,23.1,31.5,21.3,31.5,19z M8.7,5.8   c0-3,2.4-5.4,5.4-5.4s5.4,2.4,5.4,5.4s-2.4,5.4-5.4,5.4l0,0C11.1,11.2,8.7,8.8,8.7,5.8z"/> </svg>' +
	            	'<span class="children">' +  ratingData[i].children  + '</span>' +
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

    // add result icon to 
    $('.deal-wrappr.rating .result-price-container').prepend('<svg version="1.1" id="deal-rating-star-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"width="47.5px" height="45.8px" viewBox="0 0 47.5 45.8" style="enable-background:new 0 0 47.5 45.8;" xml:space="preserve"><g transform="translate(0,-952.36218)"><path class="star-icon" d="M37.4,997.3c0.9-0.1,1.6-0.8,1.5-1.7c0-0.1,0-0.1,0-0.2L36,981.6l10.7-9.5c0.7-0.6,0.7-1.6,0.1-2.3c-0.3-0.3-0.6-0.5-1-0.5l-14.4-1.6l-6-12.8c-0.4-0.8-1.3-1.2-2.2-0.8c-0.4,0.2-0.7,0.4-0.8,0.8l-6,12.8L2,969.3c-0.9,0.1-1.6,0.9-1.5,1.8c0,0.4,0.2,0.7,0.5,1l10.7,9.5l-2.9,13.8c-0.2,0.9,0.4,1.7,1.3,1.9c0.4,0.1,0.8,0,1.1-0.2l12.6-6.9l12.6,6.9C36.8,997.3,37.1,997.4,37.4,997.3z M34.9,992.6l-10.2-5.7c-0.5-0.3-1.1-0.3-1.6,0l-10.2,5.7l2.4-11.2c0.1-0.6-0.1-1.1-0.5-1.5l-8.7-7.7l11.7-1.3c0.6-0.1,1.1-0.4,1.3-0.9l4.9-10.4l4.9,10.4c0.2,0.5,0.7,0.9,1.3,0.9l11.7,1.3l-8.7,7.7c-0.4,0.4-0.6,1-0.5,1.5C32.6,981.4,34.9,992.6,34.9,992.6z"/></g></svg>' );

   


}




// filter deals functionality
$('.toolbar.toolbar-bottom').on('click', function () {
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
          myApp.alert('Deals price filtered by highest to lowest!', '');

        }
      },

      {
        text: 'HIGHEST RATING',
        onClick: function() {
          ratingSort();
          myApp.alert('Deals filtered by highest rating!', '');

        }
      },

       {
        text: 'CLOSE',
        onClick: function() {
          

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


});




// Script that runs every time after the settings page is init\loaded 
myApp.onPageReinit('settings', function (page) {
   
	activeNavRemove();

	$('.content-block p').eq(3).addClass('active-nav');


});
