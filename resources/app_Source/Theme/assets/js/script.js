/**
* Neo v1.0.0 by yokCreative
* Copyright 2013  
* 
*/



$(function () {
// Sidebar menu toggle

		$('.sidebar-nav li a').click(function (event) {
			 	 //  $(this).next()
				$(this).next().slideToggle('100');
				$('.sidebar-nav').find('a').not(this).next().slideUp('100');   
			});
			
// Stretch Columns to Full Height
	  $(".stretch-full-height").height($(document).height());
	  $(".sidebar-nav").height($("#page-content-wrapper").height());
	
// Rotate accordion icon
	  $('.accord-collapse').on('shown.bs.collapse', function(){
		$(this).parent().find(".icon-chevron-right").removeClass("icon-chevron-right").addClass("icon-chevron-down");
		  }).on('hidden.bs.collapse', 
		function(){
		$(this).parent().find(".icon-chevron-down").removeClass("icon-chevron-down").addClass("icon-chevron-right");
	  });
// Close panels
	 $('.close-panel').click(function() {
		 $(this).parent().parent().parent().slideToggle("slow");
	 
// List Strikethrough 		
	$('[type="checkbox"]').click(function(){
		var element = $(this).parent();
		if ($(this).is(':checked')) {
		   element.wrap('<del>');
		} else {
		   element.unwrap('<del>');
		}
	});

});
// Show first tab
  $(function () {
    $('.nav-tabs a:last-child').tab('show')
  })
  
  
// Show first pill
  $(function () {
    $('.nav-pills .active a').tab('show')
  })
  
});		
// Sidebar Menu Toggle

/* Initializing some of the plugins  */

// Easy Pie Charts
	var initPieChart = function() {
                $('.percentage').easyPieChart({
                    animate: 1000
                });
                $('.percentage-light').easyPieChart({
                    trackColor: '#a64077',
                    scaleColor: false,
                    lineCap: 'butt',
                    lineWidth: 15,
                    animate: 1000
                });

                $('.updateEasyPieChart').on('click', function(e) {
                  e.preventDefault();
                  $('.percentage, .percentage-light').each(function() {
                    var newValue = Math.round(100*Math.random());
                    $(this).data('easyPieChart').update(newValue);
                    $('span', this).text(newValue);
                  });
                });
            };
	

// Counters
	$({countNum: $('#new-users').text()}).animate({countNum: 1184}, {
		  duration: 3000,
		  easing:'linear',
		  step: function() {
			$('#new-users').text(Math.floor(this.countNum));
		  },
	
	});
	$({countNum: $('#new-comments').text()}).animate({countNum:581}, {
		  duration: 3500,
		  easing:'linear',
		  step: function() {
			$('#new-comments').text(Math.floor(this.countNum));
		  },
	
	});
	$({countNum: $('#new-subscribers').text()}).animate({countNum:392}, {
		  duration:4000,
		  easing:'linear',
		  step: function() {
			$('#new-subscribers').text(Math.floor(this.countNum));
		  },
	
	});
	$({countNum: $('#new-orders').text()}).animate({countNum:124}, {
		  duration:4500,
		  easing:'linear',
		  step: function() {
			$('#new-orders').text(Math.floor(this.countNum));
		  },
	
	});



 