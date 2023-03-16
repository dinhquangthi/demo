
function UCAccordionMenu(menuWrapperID){
	
	var g_menuWrapper, g_isCloseOnOpen = false, g_isCurrentParentItemOpened = false;
	
	
	/**
	* collapse inner section
	*/
	function collapseInnerSection(element, link){
		
		var sectionHeight = element.scrollHeight;
		
		var elementTransition = element.style.transition;
		element.style.transition = '';
		
		//check if parent link has same href as current window location href
		//if so, then set 'data-collapsed' attribute to 'false' and go to next link
		var currentLocation = window.location.href;
		var objLinkItemHref = jQuery(link).attr('href');
		
		if(currentLocation == objLinkItemHref && g_isCurrentParentItemOpened == false){
			
			element.setAttribute('data-collapsed', 'false');
			
			g_isCurrentParentItemOpened = true; 
			
			return(true)
		}
		
		
		requestAnimationFrame(function() {
			element.style.height = sectionHeight + 'px';
			element.style.transition = elementTransition;
			
			requestAnimationFrame(function() {	
				element.style.height = 0 + 'px';
				
			});
		});
		
		element.setAttribute('data-collapsed', 'true');
	}
	
	/**
	* expand the inner of the section
	*/
	function expandSectionInner(element){
		var sectionHeight = element.scrollHeight;
		
		element.style.height = sectionHeight + 'px';
		
		element.addEventListener('transitionend', function(e) {
			element.removeEventListener('transitionend', arguments.callee);
			element.style.height = null;
		});
		
		element.setAttribute('data-collapsed', 'false');
		
	}
	
	/**
	* expand section
	*/
	function expandSection(section, objLink){
		
		expandSectionInner(section);
		
		section.setAttribute('data-collapsed', 'false')
		objLink.removeClass("collapsed");
		objLink.addClass("expanded");
		
	}
	
	/**
	* collapse the section
	*/
	function collapseSection(section, objLink){
		
		collapseInnerSection(section, objLink);
		
		objLink.addClass("collapsed");
		objLink.removeClass("expanded");
	}
	
	/**
	* collapse all expanded sections
	*/
	function collapseAllExpanded(clickedItem){
		
		var clickedParentExpanded = jQuery(clickedItem).parents('.sub-menu').prev();    
    var clickedChildrenExpanded = jQuery(clickedItem).next().find('.expanded');   
    
    var objAllExpanded = g_menuWrapper.find(".expanded").not(clickedChildrenExpanded).not(clickedParentExpanded);
		
		if(objAllExpanded.length == false)
		return(false);
		
		jQuery.each(objAllExpanded, function(index, link){
			var objLink = jQuery(link);
			var section = link.nextElementSibling;
			
			collapseSection(section, objLink);
			
		});
	}
	
	/**
	* close or open link
	*/
	function toggleSection(objLink){
		
		var link = objLink[0];
		var section = link.nextElementSibling;
		
		var isCollapsed = section.getAttribute('data-collapsed') === 'true';
		
		if (isCollapsed) {		//expend current
			
			if(g_isCloseOnOpen == true)
			collapseAllExpanded(link);
			
			expandSection(section, objLink);
			
		} else {		//collapse current
			
			collapseSection(section,objLink);
		}
		
	}
	
	/**
	* open or close some item
	*/
	function openCloseItem(link, event){
		
		var section = link.nextElementSibling;
		
		if(!section)
		return(true);
		
		var objSection = jQuery(section);
		if(objSection.hasClass("sub-menu") == false)
		return(true);
		
		if(event)
		event.preventDefault();
		
		var objLink = jQuery(link);
		
		var isCollapsed = section.getAttribute('data-collapsed') === 'true';
		
		if (isCollapsed) {		//expend current
			
			if(g_isCloseOnOpen == true)
			collapseAllExpanded(link);
			
			expandSection(section, objLink);
			
		} else {		//collapse current
			
			collapseSection(section,objLink);
		}
		
	}
	
	
	/**
	* on menu item click, if sub menu, open or close
	*/
	function onMenuItemClick(event){
		
		openCloseItem(this, event);
		
	}
	
	
	/**
	* console log shorcut
	*/
	function trace(str){
		
		console.log(str);
	}
	
	
	/**
	* init from popups
	*/
	function checkInitFromPopups(){
		
		jQuery( document ).on( 'elementor/popup/show', (event) => {	
			runMenu();
		});
		
	}
	
	
	/**
	* expand current item tree
	*/
	function expandCurrentItemTree(){
		
		//disable transition
		
		var objCurrentItem = g_menuWrapper.find(".uc-list-menu ul .current-menu-item");
		
		if(objCurrentItem.length == 0)
		return(false);
		
		g_menuWrapper.addClass("uc-no-transition");
		
		setTimeout(function(){
			g_menuWrapper.removeClass("uc-no-transition");
		},300);
		
		var objParents = objCurrentItem.parents("li");
		
		if(objParents.length == 0)
		return(false);
		
		jQuery.each(objParents, function(index, parent){
			
			var objParent = jQuery(parent);
			var objLink = objParent.children("a");
			
			var link = objLink[0];
			
			openCloseItem(link);
			
		});
		
	}
	
	/**
	* run the menu, init
	*/
	function runMenu(){
		
		//init globals
		g_menuWrapper = jQuery("#"+menuWrapperID);
		
		g_isCloseOnOpen = g_menuWrapper.data("closeothers");
		g_isCloseOnOpen = (g_isCloseOnOpen == "yes");
		
		var isClickable = g_menuWrapper.data("clickable");
		
		if(g_menuWrapper.length == 0){
			console.log("menu with ID: "+menuWrapperID+" not found!");
			
			checkInitFromPopups();
			
			return(false);
		}
		
		//collapse all except the current
		
		g_menuWrapper.find("ul.uc-list-menu li a").each((i, item) => {
			
			if(item.nextElementSibling){
				
				var objItem = jQuery(item);
				var objItemPointer = objItem.find('.uc-menu-item-pointer');
				
				if(objItemPointer.length == 0)
				objItem.append("<span class='uc-menu-item-pointer'></span>"); 
				
				//check if parent link has same href as current window location href
				//if so, then open current accordion item
				var currentLocation = window.location.href;
				var objLinkItemHref = jQuery(item).attr('href');
				
				if(currentLocation == objLinkItemHref && g_isCurrentParentItemOpened == false){
					
					collapseInnerSection(item.nextElementSibling, item);
					
					item.nextElementSibling.style.display = "block";
					
					jQuery(item).addClass("expanded");
					jQuery(item).removeClass("collapsed");
					
					return(true);
					
				}
				
				collapseInnerSection(item.nextElementSibling, item);
				
				item.nextElementSibling.style.display = "block";
				
				jQuery(item).addClass("collapsed");
				jQuery(item).removeClass("expanded");
				
			}
			
		});
		
		//init events
		
		if(isClickable == false){
			
			g_menuWrapper.find("ul.uc-list-menu li a").on("click", onMenuItemClick);
			
		}else{
			
			//pointer click - toggle section
			
			g_menuWrapper.find("ul.uc-list-menu li .uc-menu-item-pointer").on("click", function(event){
				
				event.preventDefault();
				var objLink = jQuery(this).parent();
				toggleSection(objLink);
				
			});
			
		}
		
		
		//open the section with current item
		
		setTimeout(expandCurrentItemTree,100);

	}
	
	runMenu();

	//init from custom popup event
	jQuery(document).on('uc_burger_popup_open', function(){
      
		setTimeout(function(){
			runMenu();
		},50);

	});
	
}

