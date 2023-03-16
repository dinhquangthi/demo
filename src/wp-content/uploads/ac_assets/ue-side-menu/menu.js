
function UCSideMenu(menuWrapperID){
  
  var g_menuWrapper, g_menuID, g_objButtonToggle, g_objInputBox, g_isCloseOnOpen, g_isClickable;
  var g_pushOnOpen, g_pushOnOpenMobile, g_lastBodyPadding;
  var g_startExpanded;
  var g_dataLinkNum;
  
  
  function openNav() {
    
    var objBody = jQuery("body");
    var menuWidth = g_menuWrapper.width();
    
    objBody.addClass("menu-opened");
    
    if ( g_menuWrapper.hasClass("menu-right-close")) {
      
      function pushContentToLeft(){
        objBody.addClass("uc-menu-push");
        objBody.css("padding-right",menuWidth+"px");
      }
      
      g_menuWrapper.removeClass("menu-right-close");
      g_menuWrapper.addClass("menu-right-open");
      
      if(window.matchMedia("(min-width: 420px)").matches && g_pushOnOpen == true){
        pushContentToLeft();
      }
      
      if(window.matchMedia("(max-width: 420px)").matches && g_pushOnOpenMobile == true){
        pushContentToLeft();
      }
      
      g_lastBodyPadding = objBody.css("padding-right");
      
    } else if (g_menuWrapper.hasClass("menu-left-close")) {
      
      function pushContentToRight(){
        objBody.addClass("uc-menu-push");
        objBody.css("padding-left",menuWidth+"px");
      }
      
      g_menuWrapper.removeClass("menu-left-close");
      g_menuWrapper.addClass("menu-left-open");			
      
      if(window.matchMedia("(min-width: 420px)").matches && g_pushOnOpen == true){
        pushContentToRight();
      }
      
      if(window.matchMedia("(max-width: 420px)").matches && g_pushOnOpenMobile == true){
        pushContentToRight();
      }
      
      g_lastBodyPadding = objBody.css("padding-left");
      
    }
    
    g_objButtonToggle.addClass("uc-close-action");
    
  }
  
  /**
  * close the menu
  */
  function closeNav() {
    
    g_objButtonToggle.removeClass("uc-close-action");
    
    var objBody = jQuery("body");
    objBody.removeClass("menu-opened");
    
    if (g_menuWrapper.hasClass("menu-left-open")) {
      
      function lastBodyPaddingLeft() {
        objBody.css("padding-left",g_lastBodyPadding);
      }
      
      g_menuWrapper.toggleClass("menu-left-close");
      
      if(window.matchMedia("(min-width: 420px)").matches && g_pushOnOpen == true) {
        lastBodyPaddingLeft();
      }
      
      if(window.matchMedia("(max-width: 420px)").matches && g_pushOnOpenMobile == true) {
        lastBodyPaddingLeft();
      }
      
    } else if (g_menuWrapper.hasClass("menu-right-open")) {
      
      function lastBodyPaddingRight() {
        objBody.css("padding-right",g_lastBodyPadding);
      }
      
      g_menuWrapper.toggleClass("menu-right-close");
      
      if(window.matchMedia("(min-width: 420px)").matches && g_pushOnOpen == true){
        lastBodyPaddingRight();
      }
      
      if(window.matchMedia("(max-width: 420px)").matches && g_pushOnOpenMobile == true) {
        lastBodyPaddingRight();
      }
      
    }
    
    
  }
  
  
  function isMenuClosed(){
    
    var isClose = g_objButtonToggle.hasClass("uc-close-action");
    
    return(!isClose);
  }
  
  function onButtonToggleClick(){
    
    var isClose = g_objButtonToggle.hasClass("uc-close-action");
    
    if(isClose == true)
    closeNav();
    else
    openNav();
    
  }
  
  /**
  * collapse inner section
  */
  function collapseInnerSection(element){
    
    var sectionHeight = element.scrollHeight;
    
    var elementTransition = element.style.transition;
    element.style.transition = '';
    
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
    
    collapseInnerSection(section);
    
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
  * toggle menu item icon
  */
  function menuItemIconToggle(link){
    
    var objWrapper = jQuery("#"+menuWrapperID);
    
    //add icons to pointer elements
    var objPointer = jQuery(link).find(".uc-menu-item-pointer");
    var objExpandedIcon = objWrapper.find(".uc-side-menu-expand-icon");
    var objCollapsedIcon = objWrapper.find(".uc-side-menu-collapse-icon");

    if(!objExpandedIcon.length || !objCollapsedIcon)
    return(false);
    
    var expandedIconHtml = objExpandedIcon.html();
    var collapsedIconHtml = objCollapsedIcon.html();  
    
    if(jQuery(link).hasClass("collapsed") == true)
    objPointer.html(expandedIconHtml);
    
    if(jQuery(link).hasClass("expanded") == true)
    objPointer.html(collapsedIconHtml);
    
    
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
    
    menuItemIconToggle(link);
    
  }
  
  /**
  * if clicked link is an anchor then close nav
  */
  function closeNavOnAnchorLinkClick(objLink, event){
    
    var url = objLink.attr("href");
    url = jQuery.trim(url);
    
    if(!url)
    return(true);
    
    var objLinkIcon = objLink.find('.uc-menu-item-pointer');
    
    if(!objLinkIcon)
    return(true);
    
    var target = event.target;
    
    if(target == objLinkIcon[0])
    return(true);
    
    var objLinkParent = objLink.parent();
    
    if(g_isClickable == false){
      
      if(objLinkParent.hasClass('menu-item-has-children'))
      return(true)
      
      //check if clicked link is an anchor link 
      if (url.indexOf("#") > -1)
      closeNav();
      
    }else{
      
      //check if clicked link is an anchor link
      if (url.indexOf("#") > -1)
      closeNav();
      
    }
    
  }
  
  
  /**
  * on menu item click, if sub menu, open or close
  */
  function onMenuItemClick(event){
    
    
    /*return*/ openCloseItem(this,event);
    
    var objLink = jQuery(this);
    
    closeNavOnAnchorLinkClick(objLink, event)
    
  }
  
  /**
  * console log shorcut
  */
  function trace(str){
    
    console.log(str);
  }
  
  /**
  * do search
  */
  function doSearch(){
    
    if(!g_objInputBox)
    return(false);
    
    var searchString = g_objInputBox.val();
    
    searchString = jQuery.trim(searchString);
    
    if(!searchString)
    return(true);
    
    var urlBase = g_objInputBox.data("urlbase");
    var urlSearch = urlBase+"?s="+searchString;
    
    location.href = urlSearch;
    
  }
  
  
  /**
  * on input box key up - if enter clicked - go to search
  */
  function onInputBoxKeyUp(event){
    
    if(event.keyCode !== 13)
    return(true);
    
    doSearch();
  }
  
  /**
  * on menu body click - disable propogation
  */
  function onMenuBodyClick(event){
    
    event.stopPropagation();
  }
  
  /**
  * on body click - close the menu if needed
  */
  function onBodyClick(){
    
    var isClosed = isMenuClosed();
    
    if(isClosed == true)
    return(true);
    
    closeNav();
  }
  
  //on trigger link click
  
  function onLinkClick(e){
    
    var objLink = jQuery(this);
    
    var dataMenuName = g_menuWrapper.data('name');
    var dataLinkName = objLink.data('name');
    
    if(dataLinkName == undefined){
      return(false);
    }
    
    e.preventDefault();
    if(dataLinkName == dataMenuName){
      g_objButtonToggle.trigger("click");
    }else{
      return(false);
    }
  }
  
  /**
  * init open links
  */
  function initLinks(){
    
    var objLinks = jQuery('.ue-link-open-menu').not(".uc-link-inited");
    
    if(objLinks.length == 0){
      return(false);
    }
    
    var elementName = g_menuWrapper.data("name");
    
    jQuery.each(objLinks, function(index, linkElement){
      
      var objLink = jQuery(linkElement);
      
      var name = objLink.data("name");
      
      if(name != elementName)
      return(true);
      
      objLink.addClass("uc-link-inited");
      
      objLink.on("click", onLinkClick);
      
    });
    
    
  }
  
  
  /**
  * run the menu, init
  */
  function runMenu(){
    
    var objWrapper = jQuery("#"+menuWrapperID);  
    
    g_menuWrapper = objWrapper.find(".uc-side-menu-wrapper");
    g_isClickable = objWrapper.data("clickable");
    g_isCloseOnOpen = objWrapper.data("closeothers");
    
    var isCloseOnBody = objWrapper.data("closeonbody");
    var isOpenOnLoad = g_menuWrapper.data("openonload");
    
    g_pushOnOpen = objWrapper.data("push");
    g_pushOnOpenMobile = objWrapper.data("push-mobile")
    
    g_startExpanded = objWrapper.data("expand");
    
    var objButtonClose = g_menuWrapper.find(".uc-close-side-menu");
    
    g_objButtonToggle = objWrapper.find(".open_side_menu");
    
    g_objInputBox = g_menuWrapper.find("input[type='text']");
    
    g_menuID = menuWrapperID;
    
    if(g_menuWrapper.length == 0){
      console.log("menu with ID: "+menuWrapperID+" not found!");
      return(false);
    }
    
    if(objButtonClose.length == 0){
      console.log("The close button not found");
      return(false);
    }
    
    if(g_objButtonToggle.length == 0){
      console.log("The trigger button not found");
      return(false);
    }
    
    //collapse or expand all			
    
    g_menuWrapper.find("ul.uc-list-menu li a").each((i, item) => {
      
      if(item.nextElementSibling){
        
        var objItem = jQuery(item);
        objItem.append("<span class='uc-menu-item-pointer'></span>");
        
        if(g_startExpanded == false){
          
          collapseInnerSection(item.nextElementSibling);
          jQuery(item).addClass("collapsed");
          jQuery(item).removeClass("expanded");
          
        }else{
          
          jQuery(item).removeClass("collapsed");
          jQuery(item).addClass("expanded");
          
        }
        
        //add icons to pointer elements
        menuItemIconToggle(item);
        
      }
      
    });
    
    initLinks();
    
    //init events
    
    if(g_objInputBox.length == 0)
    g_objInputBox = null;
    
    if(g_objInputBox)
    g_objInputBox.on("keyup",onInputBoxKeyUp);
    
    var objButtonSearch = g_menuWrapper.find(".side-menu-search-button-search");
    objButtonSearch.on("click", doSearch);
    
    var objLinks = g_menuWrapper.find("ul.uc-list-menu li a");
    
    if(g_isClickable == false){
      objLinks.on("click", onMenuItemClick);
    }else{
      
      var objPointers = g_menuWrapper.find("ul.uc-list-menu li .uc-menu-item-pointer");
      
      //pointer click - toggle section      
      objPointers.on("click", function(event){
        
        event.preventDefault();
        
        var objLink = jQuery(this);
        var objParentLink = objLink.parent();
        
        toggleSection(objParentLink);

        menuItemIconToggle(objParentLink[0]);
        
      });
      
      //close nav if anchor link clicked
      objLinks.on("click", function(event){
        
        var objLink = jQuery(this);
        
        closeNavOnAnchorLinkClick(objLink, event);
        
      });
      
    }
    
    objButtonClose.on("click", closeNav);
    
    g_objButtonToggle.on("click", onButtonToggleClick);
    
    if(isCloseOnBody === true){
      
      var objOverlay = g_menuWrapper.find(".ue_side_menu_overlay");
      
      if(objOverlay.length)
      objOverlay.on("click", closeNav);
      else{
        g_menuWrapper.on("click", onMenuBodyClick);
        g_objButtonToggle.on("click", onMenuBodyClick);
        
        jQuery("body").on("click", onBodyClick);
      }			
      
    }
    
    if(isOpenOnLoad === true){
      g_objButtonToggle.trigger("click");
    }
  }
  
  runMenu();
  
}

