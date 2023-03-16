function UCOnePageNavigation(){
	
	var g_objWrapper;
	var isInAnySectionInside = false;
	var activeSectionId = null;
	var sections, g_isEnableSnap, g_isEnableSnapMobile;

	var currentIndex  = 0;
	var isReloaded = true;
	var isAnimating = false;
	var stopAnimation = function() {
		setTimeout(function() {
			isAnimating = false;
		}, 400);
	};

	// scrolls to target section
	function scrollToSection(target){
		isAnimating = true;
        jQuery("html, body").animate({ scrollTop: target }, 700, stopAnimation);
	}

	// scrNav function 
	  // Change active dot according to the active section in the window
	function scrNav() {
		
		window.ucWasDotActive = false;
		isInAnySectionInside = false;
		activeSectionId=null;
		
	    jQuery(".elementor-section").each(function() {
	    	
			var e = jQuery(this);
			var sectionID = e.prop("id");

			if(!sectionID)
				return(true);

	      	var objLink = g_objWrapper.find('ul li > a[data-scroll="' + sectionID + '"]');
			if(objLink.length == 0)
				return(true);

			var isSectionInside = false;
			var offsetTop = e.offset().top;
			var windowHeight = jQuery(window).height();
			var windowScrollTop = jQuery(window).scrollTop();
			var sectionHeight = e.height();
				
			if(offsetTop - windowHeight / 2 < windowScrollTop && (offsetTop >= windowScrollTop || offsetTop + sectionHeight - windowHeight / 2 > windowScrollTop))
				isSectionInside = true;		
			isInAnySectionInside  = isInAnySectionInside||isSectionInside;	
			if(isSectionInside){
				activeSectionId=sectionID;
			}
			
			if(isSectionInside == true && window.ucWasDotActive == false){
                objLink.addClass("uc_active");
			    window.ucWasDotActive = true;
			}
			else{
				objLink.removeClass("uc_active");
			}	
		});
		
	  }

	function onUp(e){	
		
		if(!isInAnySectionInside){
         return
        }

		if (isAnimating) { // disables scroll when animating
           if(e.type != "touchmove"){ //touch event handle
                e.preventDefault();
            } 
			return;
          
		}
		var activeBulletIndex = jQuery('ul li a.uc_active').parent().index(); // finds active section in 'sections' array
		
        if (currentIndex < 0){
           return;
        }
                              
        if (sectionsAll.length == sections.length){ // manage behaviour when amount of snapped sections are equal to amount of all sections
			if (currentIndex <= 0 && activeBulletIndex == 0){
             	return;
        	}
		}

        currentIndex--;
        if(currentIndex < 0 && activeBulletIndex != 0){ // handle reload event
			var $previousSection = jQuery(sections[activeBulletIndex]);
			currentIndex = activeBulletIndex;
		}else{
            var $previousSection = jQuery(sections[currentIndex]);
		}
                           
        if (!sections[currentIndex]){ // when currentIndex is not found do nothing
            return;                  
        }                       
             
        var offsetTop = $previousSection.offset().top;
        if(e.type != "touchmove"){ //touch event handle
         	e.preventDefault();                  
        } 
		scrollToSection(offsetTop);
	}
                                      
	function onDown(e){                          		
		if(!isInAnySectionInside){
           	return
        }          

		if (isAnimating) { // disables scroll when animating
        	if(e.type != "touchmove"){ //touch event handle
                e.preventDefault();
            }  
          	return;
		}
        var activeBulletIndex = jQuery('ul li a.uc_active').parent().index(); // finds active section in 'sections' array
                              
        if (currentIndex + 1 > sections.length){
             return;
        }
		if (sectionsAll.length == sections.length){ // manage behaviour when amount of snapped sections are equal to amount of all sections
			isReloaded = false;
			if (currentIndex >= sections.length-1){
             	return;
        	}
		}
		
		if (isReloaded){
          currentIndex = -1;
		  isReloaded = false;
		}

        currentIndex++;
		if(currentIndex == 0 && activeBulletIndex != 0){  // handle reload event
			var $nextSection = jQuery(sections[activeBulletIndex]);
			currentIndex = activeBulletIndex;
		}else{
            var $nextSection = jQuery(sections[currentIndex]);
		}

		if (!sections[currentIndex]){ // when currentIndex is not found do nothing
            return;                  
        } 
		
        var offsetTop = $nextSection.offset().top;
        if(e.type != "touchmove"){ //touch event handle
         	e.preventDefault();                  
        } 
		scrollToSection(offsetTop);
	}
	
		function getAverage(elements, number){
            var sum = 0;
            var lastElements = elements.slice(Math.max(elements.length - number, 1));

            for(var i = 0; i < lastElements.length; i++){
                sum = sum + lastElements[i];
            }

            return Math.ceil(sum/number);
        }
	
	
	
	/**
	 * run the navigation
	 */
	function runNav(){
		
		//init globals
		var link = g_objWrapper.find('.uc_nav-menu li a.uc_dot');
		
		isInAnySectionInside = false;
		activeSectionId = null;
		sections = Array.from(link.map(index=>jQuery(link[index]).attr('href')));
		sectionsAll = Array.from(jQuery('.elementor-section'));
	
	   // Move to specific section when click on menu link
	   link.on('click', function(e) {
		  
			var target = jQuery(jQuery(this).attr('href'));
			var selectedIndex = jQuery(this).parent().index();
			scrollTo(target);
			jQuery(this).addClass('uc_active');
			currentIndex = selectedIndex;
			e.preventDefault();
	   });
		
		// Run the scrNav when scroll
	  jQuery(window).on('scroll', function(){
			 scrNav();
	  });
		
	  scrNav();

	  if(g_isEnableSnap == false)
		return(false);

	  if(window.matchMedia("(max-width: 767px)").matches && g_isEnableSnapMobile == false){
		  return(true);
	  }
	  
	  //run those only of the snap enabled
	  
	jQuery(window).on("keydown", function(e) {
		if(e.which == 38) 
			onUp(e);
		if(e.which == 40) 
			onDown(e);
	});

		/*
        * touch events
        */

        var touchStartY = 0;
        var touchStartX = 0;
        var touchEndY = 0;
        var touchEndX = 0;
		
		if(window.matchMedia("(max-width: 767px)").matches && g_isEnableSnapMobile == false){
		  return(true);
	    }
		
       	jQuery(document).on('touchmove', function(event){

              //preventing the easing on iOS devices

              var e = event.originalEvent;
              var xThreshold = 100;

              touchEndY = e.touches[0].pageY;
              touchEndX = e.touches[0].pageX;
              
              if( Math.abs(touchStartX - touchEndX) < (Math.abs(touchStartY - touchEndY) + xThreshold)){

                  if(touchStartY > touchEndY){
                      onDown(e);
                  } else {
                      onUp(e);
                  }
              }					
          });

          jQuery(document).on('touchstart', function(event){
              var e = event.originalEvent;
              touchStartY = e.touches[0].pageY;
              touchStartX = e.touches[0].pageX;
          });


        var prevTime = new Date().getTime();
        var scrollings = [];

		window.addEventListener('wheel',  function(e){
	
			var curTime = new Date().getTime();
			var value = e.wheelDelta || -e.deltaY || -e.detail;
			var delta = Math.max(-1, Math.min(1, value));
			var horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
	        var isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) || (Math.abs(e.deltaX ) < Math.abs(e.deltaY) || !horizontalDetection);

			if(scrollings.length > 149){
				scrollings.shift();
			}
			scrollings.push(Math.abs(value));

			var timeDiff = curTime-prevTime;
			prevTime = curTime;

			if(timeDiff > 200){
				scrollings = [];
			}

			var averageEnd = getAverage(scrollings, 10);
			var averageMiddle = getAverage(scrollings, 70);
			var isAccelerating = averageEnd >= averageMiddle;
		
		if(isAccelerating && isScrollingVertically){
			if (delta < 0) {
				onDown(e);
			}else {
				onUp(e);
			}
		}
		else{
			e.preventDefault();
		}
		return false;
		
		
		} ,{passive:false}
       
		);                  
	}

	
	/**
	 * init the object
	 */
	this.init = function(wrapperID){
		
		g_objWrapper = jQuery(wrapperID);
		
		if(g_objWrapper.length == 0)
			throw new Error("one page navigation not found");
		
		g_isEnableSnap = g_objWrapper.data("enablesnap");
        g_isEnableSnapMobile = g_objWrapper.data("enablesnap-mobile");                  	
		var isEditorMode = g_objWrapper.data("iseditormode");
		
		if(isEditorMode == "yes"){
			g_isEnableSnap = false;
			g_isEnableSnapMobile = false;
        }                  
		runNav();
	}
	
}

