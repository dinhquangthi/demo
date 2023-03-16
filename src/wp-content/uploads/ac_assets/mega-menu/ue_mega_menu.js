/*
* Mega Menu script made by Denis Odintsov for Unlimited Elements
*/

function ueMegaMenu(){
  
  var g_menu, g_menuSection, g_menuItem, g_menuListWrap, g_indicator, g_translateX, g_menuList, g_objBody, g_dataMenuOpen, g_objOverlay, g_menuWrapOffsetLeft, g_viewportWidth, g_dataPositionX, g_dataEditor, g_menuItemTitle, g_showErrors, g_offsetX, g_urlBase; 
  var g_classActive, g_classSection, g_menuActiveClass;
  var g_isDesktopViewport, g_isNotDesktopViewport, g_isCustomResponsiveViewport, g_isNotCustomResponsiveViewport;
  var g_arrItems;
  
  /*
  * apply template's styles to menu item's section 
  */
  function setTemplateStyle(){
    
    var objLayout = jQuery('.uc-template-wrapper .elementor');
    var objLayoutClass = objLayout.attr('class');
    
    g_menu.addClass(objLayoutClass);
  }
  
  /*
  * hide expand icon if no item section found
  */
  function hideIcon(objSection){
    
    if(g_indicator.length == 0)
    return(false);
    
    var objSectionArrow = objSection.find(".sub-arrow");
    var objSectionTitle = objSection.find('.uc-mega_menu_title');
    var dataClickable = objSectionTitle.data('clickable-link');
    
    if(dataClickable == false)
    return(false);
    
    if(dataClickable == true && g_dataMenuOpen == 'click')
    objSectionArrow.hide();
  }
  
  /*
  * clone sections and append to its parent item
  */
  function findSections(objSection, menuSectionParent, menuSectionItem, firstMenuSectionParent){     
    
    //use clone mentod id in editor and detach method if live page
    var clonedSectionItem;
    
    if(g_dataEditor == 'yes')
    clonedSectionItem = menuSectionItem.clone();
    
    if(g_dataEditor == 'no')
    clonedSectionItem = menuSectionItem.detach();
    
    menuSectionParent.html(clonedSectionItem);
    
    hideIcon(objSection);
    
    var objMenuSection = menuSectionParent.children();
    objMenuSection.addClass("uc-connected");
    
    if(!objMenuSection.hasClass("uc-connected"))
    return(true);
    
    setTimeout(function(){
      
      objMenuSection.css({
        'position': 'absolute',
        'visibility': 'hidden'
      });
      
      var dataOpenFirstItem = g_menuList.data('open-first');
      
      if(dataOpenFirstItem == false)
      return(false);
      
      var firstObjMenuSection = firstMenuSectionParent.children();
      
      firstObjMenuSection.css({
        'position': '',
        'visibility': 'visible'
      });
      
    }, 200)
  }
  
  /*
  * handle section find error 
  */
  function showHideErrors(objSection, menuSectionId, menuSectionParent, menuSectionItem) {
    
    if(g_showErrors == false)
    return(false);
    
    if(menuSectionItem.length > 0)
    return(false);
    
    var menuItemTitle = objSection.find('.uc-mega_menu_title');
    var menuItemTitleType = menuItemTitle.data('type');
    
    if(menuItemTitleType == 'link')
    return(false);
    
    objSection.addClass('section-error');
    menuSectionParent.addClass('section-error');
    
    menuSectionParent.html("<div class='uc-section-error'><div class='uc-error'>Couldn't find a section with id: '" + menuSectionId + "'</div></div>");
  }
  
  /*
  * handle debug hidden template / section
  */
  function debugHiddenElements() {
    
    if(g_dataEditor == 'no')
    return(false);
    
    //find template for debugging purposes
    var menuTemplate = jQuery(".uc-template-wrapper");
    var dataDebug = g_menu.data("debug");
    
    if(dataDebug == false)
    return(false);
    
    menuTemplate.css({'display': ''});
  }
  
  /*
  * set dropdown element full width and position in case custom width is grater than viewport width
  */
  function setFullWidth(menuSectionParent){
    
    menuSectionParent.css({
      'width': g_viewportWidth + 'px',
      'top': '100%',
      'left': - g_menuWrapOffsetLeft + 'px',
      'transform': 'translate(0, 0)',
      'right': 'unset'  
    });
    
    var menuItemParent = menuSectionParent.parents(".uc-mega_menu_list_item");
    
    //set static position to menu-item so dropdown is positioned relatively to menu-list-wrapper
    menuItemParent.css({
      'position': 'static'
    });    
  }
  
  /*
  * set dropdown element position left
  */
  function setScreenStartPos(menuSectionParent){
    
    menuSectionParent.css({
      'left': - g_menuWrapOffsetLeft + 'px',
      'transform': 'translate(0, 0)'         
    });
  }
  
  /*
  * set position / width
  */
  function setWidthType(widthType, widthTypeFull, widthTypeCustom, customWidthNumber, menuSectionParent, each){
    
    if(widthType == widthTypeFull){
      setScreenStartPos(menuSectionParent);
      menuSectionParent.css({'width': g_viewportWidth + 'px'});
      return(false);
    }
    
    if(widthType == widthTypeCustom){
      menuSectionParent.css({'width': customWidthNumber + 'px'});
    }
    
    if(customWidthNumber == '0' || customWidthNumber == '' || customWidthNumber >= g_viewportWidth){
      setFullWidth(menuSectionParent);
    }else{
      
      //set position relative back when dropdown again can be fully visible in the screen
      g_menuItem.eq(each).css({'position': 'relative'});
      
      //return values that were set before change of the width to full-width
      if (g_dataPositionX == "item_left"){
        menuSectionParent.css({
          'left': '0'
        });
      }
      
      if (g_dataPositionX == "item_right"){
        menuSectionParent.css({
          'left': 'unset',
          'right': '0'
        });
      }
      
      if (g_dataPositionX == "item_center"){
        menuSectionParent.css({
          'left': '50%',
          'right': 'unset'
        });
      }
      
    }
  }
  
  /*
  * set position / width for each type of width-type
  */
  function handleWidthType(){
    
    var menuItemsNumber = g_menuItem.length;
    
    for (let i=0; i<menuItemsNumber; i++){
      
      var menuSectionParent = g_menuItem.eq(i).find('.uc-mega_menu_section');
      
      var widthType = g_arrItems[i].dropdown_width;
      var customWidthNumber = g_arrItems[i].dropdown_width_number;
      
      setWidthType(widthType, 'full', 'custom', customWidthNumber, menuSectionParent, i);
      
      if(widthType == 'default'){
        
        var defaultWidthType = g_menuList.data('default-width-type');
        var defaultWidthNumber = g_menuList.data('default-width-number');
        
        setWidthType(defaultWidthType, 'default_full', 'default_custom', defaultWidthNumber, menuSectionParent, i)
      }
    }
  }
  
  /*
  * debug items ids
  */
  function showHideMenuItemsId(){
    
    var debugMenuItemsId = g_menu.data("items-id");
    
    if (debugMenuItemsId == false)
    return(false);
    
    //show all item ids
    g_menuListWrap.append("<div class='available_id_s'>Item Id's List<ul class='available_item_id_s_list'></ul></div>");
    
    var objItemIdList = g_menu.find(".available_item_id_s_list");
    var menuItemsNumber = g_menuItem.length;
    
    for(let i=0; i<=menuItemsNumber-1; i++){
      var objMenuItem = g_menuItem.eq(i);
      var objMenuItemDataId = objMenuItem.data("id");
      
      //if data-id attribute is empty, skip and go to next data-id
      if(!objMenuItemDataId){
        continue;
      }else{
        objItemIdList.append("<li>" + objMenuItemDataId + "</li>");
      }  
    }
  }
  
  /*
  * debug elements ids
  */
  function showHideElementsId(){
    
    var debugElementsId = g_menu.data("elements-id");
    
    if (debugElementsId == false)
    return(false);
    
    //show list of section's ids that can be connected to mega menu items
    g_menuListWrap.append("<div class='available_id_s'>Section Id's List<ul class='available_section_id_s_list'></ul></div>");
    
    var objSectionIdList = g_menu.find(".available_section_id_s_list");
    var availableSections = jQuery('section');
    
    availableSections.each(function(){
      
      var objSectionItem = jQuery(this);
      var objSectionItemId = objSectionItem.attr('id');
      var objSectionItemDisplay = objSectionItem.css('display');
      
      //watch only those sections that are displayed on the page
      if(objSectionItemDisplay == 'none')
      return(true);
      
      //if id attribute is empty, skip and go to next id
      if(!objSectionItemId){
        return(true);
      }
      
      //check if sections are connected to mega menu items
      if(objSectionItem.hasClass("uc-connected")){
        return(true);
      }else{
        //add section's id to the list
        objSectionIdList.append("<li>" + objSectionItemId + "</li>");
      }      
    });
  }
  
  /*
  * set overlay position to screen left
  */
  function setOverlayPosition(activeMenuItem){
    
    var dataOverlay = g_objOverlay.data('overlay');
    
    if(dataOverlay == false)
    return(false);
    
    if(g_isCustomResponsiveViewport.matches == true || !activeMenuItem.length)
    return(false);
    
    var g_menuListWrapOffsetTop = g_menuListWrap.offset().top;
    var g_menuListWrapOffsetHeight = g_menuListWrap.height();
    var documentOffsetHeight = jQuery(document).height();
    
    var g_objOverlayOffsetTop = g_menuListWrapOffsetTop + g_menuListWrapOffsetHeight;
    var g_objOverlayOffsetHeight = documentOffsetHeight - g_objOverlayOffsetTop;
    
    g_objOverlay.show();
    
    g_objOverlay.css({
      'width': g_viewportWidth + 'px',
      'left': - g_menuWrapOffsetLeft + 'px',
      'transform': 'translate(0, 0)',         
      'height': g_objOverlayOffsetHeight + 'px'
    });
    
  }
  
  /*
  * set active disresponsive height
  */
  function setDisactiveResponsiveHeight(){
    
    if(g_isNotCustomResponsiveViewport.matches == true)
    return(false);
    
    g_menuSection.css({'height': '0px'});
    
  }
  
  /*
  * set disactive responsive height for parent menu item	 
  */
  function setActiveResponsiveHeight(activeMenuItem){
    
    if(!activeMenuItem)
    return(false);
    
    var menuSectionActive = activeMenuItem.find(g_classSection);
    var menuSectionActiveChild = menuSectionActive.children();
    var menuSectionActiveHeight = menuSectionActiveChild.outerHeight();
    
    
    if(g_menuSection.hasClass(g_classActive)){
      setDisactiveResponsiveHeight();
      menuSectionActive.css({'height': menuSectionActiveHeight + 'px'});
    }else{
      setDisactiveResponsiveHeight();
    } 
  }
  
  /*
  *set active menu item icon
  */
  function setActiveArrow(activeItem){
    
    var indicatorActive = activeItem.find('.sub-arrow');
    var collapseIndicatorClass = '.uc_collapse_indicator';
    var objCollapseIndicator = jQuery(collapseIndicatorClass);
    
    if(objCollapseIndicator.length){
      var objCollapseIndicatorItem = objCollapseIndicator.parents('.uc-mega_menu_list_item');
      
      objCollapseIndicatorItem.find('.sub-arrow').html("<span class='uc_expand_indicator'></span>");
    }
    
    indicatorActive.html("<span class='uc_collapse_indicator'></span>");
  }
  
  /*
  * set disactive menu item icon
  */
  function setDisactiveArrow(){  
    
    var collapseIndicatorClass = '.uc_collapse_indicator';
    var objCollapseIndicator = jQuery(collapseIndicatorClass);
    
    if(objCollapseIndicator.length){
      var objCollapseIndicatorItem = objCollapseIndicator.parents('.uc-mega_menu_list_item');
      
      objCollapseIndicatorItem.find('.sub-arrow').html("<span class='uc_expand_indicator'></span>");
    }
    
  }
  
  /*
  * set top position 100% + padding-bottom of menu-list-wrapper
  */
  function setTopPosition(objElement){
    
    var activeMenuSection = objElement.find(g_classSection);
    var menuListPaddingBottom = g_menuList.css('padding-bottom');
    
    activeMenuSection.css({
      'top': 'calc(100% + ' + menuListPaddingBottom + ')'
    });
  }
  
  /*
  * handle positionX option
  */
  function isElementInViewportX(objElement) {
    
    var activeMenuSection = objElement.find(g_classSection);
    
    if(!activeMenuSection.length)
    return(true);
    
    var activeMenuSectionWidth = activeMenuSection.width();
    var elementPositionLeft = activeMenuSection.offset().left;
    var elementPositionRight = activeMenuSectionWidth + elementPositionLeft;
    
    var isInViewport;
    
    if (g_dataPositionX == "item_left"){
      var menuItemPositionLeft = objElement.offset().left;
      var elementPositionRight = activeMenuSectionWidth + menuItemPositionLeft + g_offsetX;
      var elementPositionLeft = activeMenuSection.offset().left;
      
      //if dropdown width == viewportwidth + width of a scroll bar
      if(activeMenuSectionWidth == g_viewportWidth)
      return(true);
      
      setTopPosition(objElement);
      
      if(elementPositionLeft < 0){
        g_translateX = 0 + 'px';        
      }else if(elementPositionRight >= g_viewportWidth){
        g_translateX = g_viewportWidth - elementPositionRight + g_offsetX + "px";
      }
      
      isInViewport = elementPositionLeft > 0 && elementPositionRight < g_viewportWidth;
      
      return(isInViewport);
    }
    
    if (g_dataPositionX == "item_right"){ 
      var menuItemPositionRight = objElement.offset().left + objElement.width();
      var elementPositionLeft = menuItemPositionRight - activeMenuSectionWidth + g_offsetX;
      var elementPositionRight = activeMenuSection.offset().left + activeMenuSectionWidth;
      
      //if dropdown width == viewportwidth + width of a scroll bar
      if(activeMenuSectionWidth == g_viewportWidth)
      return(true);
      
      setTopPosition(objElement);
      
      if(elementPositionLeft < 0){
        g_translateX = Math.abs(elementPositionLeft) + g_offsetX + "px";
      }else{
        g_translateX = 0 + 'px';        
      }
      
      isInViewport = elementPositionLeft > 0 && elementPositionLeft + g_offsetX > 0 && elementPositionRight < g_viewportWidth;
      
      return(isInViewport);
    } 
    
    if (g_dataPositionX == "item_center"){
      var menuItemPositionLeft = objElement.offset().left;
      var objElementWidth = objElement.width();
      var elementPositionCenter = menuItemPositionLeft + (objElementWidth / 2);
      var elementPositionLeft = elementPositionCenter - (activeMenuSectionWidth / 2) + g_offsetX;
      var elementPositionRight = elementPositionCenter + (activeMenuSectionWidth / 2) + g_offsetX;
      
      //if dropdown width == viewportwidth + width of a scroll bar
      if(activeMenuSectionWidth == g_viewportWidth)
      return(true);
      
      setTopPosition(objElement);
      
      if(elementPositionLeft < 0){
        g_translateX = '-' + (objElementWidth / 2) - menuItemPositionLeft + 'px';        
      }else if(elementPositionRight > g_viewportWidth){
        g_translateX = 'calc(-50% + ' + (g_viewportWidth - elementPositionRight + g_offsetX) + 'px)';
      }
      
      isInViewport = elementPositionLeft > 0 && elementPositionRight < g_viewportWidth;
      
      return(isInViewport);
    } 	 
  }
  
  /*
  * dropdown element style always visible
  */
  function setCssVisiblePositionX(activeMenuSection){
    
    activeMenuSection.css({
      "transform": "translate(" + g_translateX + ", 0)"
    });
  }     
  
  /*
  * set dropdown element position
  */
  function setVisiblePositionX(objElement){
    
    if(g_isCustomResponsiveViewport.matches == true)
    return(false);
    
    var activeMenuSection = objElement.find(g_classSection);
    var activeMenuSectionWidth = activeMenuSection.width();
    
    //if activeMenuSectionWidth is less than viewport width - return to original coordinates
    if(activeMenuSectionWidth > g_viewportWidth)
    return(false);
    
    activeMenuSection.css({
      "transform": "translate(" + g_offsetX + "px, 0)"
    });
    
    
    //if position_x is "item_center" than transform calculate with '-50%'
    if (g_dataPositionX == "item_center" && activeMenuSectionWidth < g_viewportWidth){
      activeMenuSection.css({
        "transform": "translate(calc(-50% + " + g_offsetX + "px), 0)"
      });
    }
    
    if(isElementInViewportX(objElement))
    return(false);
    
    //if dropdown does not fit in screen than change coordinates so it is always fully visible
    setCssVisiblePositionX(activeMenuSection);
  }
  
  /*
  * set dropdown cover element position
  */
  function setCoverPosition(menuSection, menuSectionChild){
    
    if(menuSection.length == 0)
    return(false);
    
    if(menuSectionChild.length == 0)
    return(false);
    
    var objCover = menuSection.next();
    var menuItem = menuSectionChild.parents('.uc-mega_menu_list_item');
    
    var objCoverHeight = menuSectionChild.outerHeight();
    var objCoverWidth = menuSection.width();
    var menuItemWidth = menuItem.width();
    
    var menuItemOffsetLeft = menuItem.offset().left;
    var menuSectionOffsetLeft = menuSection.offset().left;
    
    var menuItemOffsetRight = menuItemOffsetLeft + menuItemWidth;
    var menuSectionOffsetRight = menuSectionOffsetLeft + objCoverWidth;
    
    objCover.css({
      'width': objCoverWidth + 'px',
      'height': objCoverHeight + 'px'
    });
    
    if (menuItemOffsetLeft == menuSectionOffsetLeft){
      objCover.css({
        'left': '0px',
        'right': 'unset'
      });
    }
    
    if(menuItemOffsetRight == menuSectionOffsetRight){
      objCover.css({
        'left': 'unset',
        'right': '0px'
      });
    }
    
    if (menuItemOffsetLeft > menuSectionOffsetLeft){
      
      var menuItemSectionPositionDeviation = menuItemOffsetLeft - menuSectionOffsetLeft;
      
      objCover.css({
        'right': 'unset',
        'left': - menuItemSectionPositionDeviation + 'px'
      });
    }
    
    if (menuItemOffsetLeft < menuSectionOffsetLeft){
      
      var menuItemSectionPositionDeviation = menuSectionOffsetLeft - menuItemOffsetLeft;
      
      objCover.css({
        'right': 'unset',
        'left': menuItemSectionPositionDeviation + 'px'
      });
    }
    
    if(objCoverWidth == g_viewportWidth){
      
      objCover.css({
        'right': 'unset',
        'left': - g_menuWrapOffsetLeft + 'px'
      });
    }
  }
  
  /*
  * set active item
  */
  function setActive(activeMenuItem){    
    
    g_menuItem.removeClass(g_classActive);
    g_menuSection.removeClass(g_classActive);
    
    var activeMenuItemSection = activeMenuItem.find(g_classSection);
    
    activeMenuItem.addClass(g_classActive);
    activeMenuItemSection.addClass(g_classActive);
    
    setTimeout(function(){                                                
      activeMenuItemSection.children().css({
        'position': '',
        'visibility': 'visible'
      });
    },100);
    
    //add active class to menu if menu item section has children
    if(activeMenuItemSection.children().length){
      g_menu.addClass(g_menuActiveClass);
    }else{
      g_menu.removeClass(g_menuActiveClass);
    }
    
    if(g_isCustomResponsiveViewport.matches == true){
      setActiveResponsiveHeight(activeMenuItem);
    }
    
    setVisiblePositionX(activeMenuItem);
    handleWidthType();
    setTipPosition(activeMenuItemSection);
    setOverlayPosition(activeMenuItem);
    
    var menuSectionChild = activeMenuItemSection.children();
    
    setCoverPosition(activeMenuItemSection, menuSectionChild);
    scrollToHead(activeMenuItem);
  }
  
  /*
  * set disactive menu item
  */
  function setDisactive(){
    
    g_menuItem.removeClass(g_classActive);
    g_menuSection.removeClass(g_classActive);
    setDisactiveArrow();
    
    g_menuSection.children().css({
      'position': 'absolute',
      'visibility': 'hidden'
    });
    
    //remove active class from menu
    g_menu.removeClass(g_menuActiveClass);
    
    if(g_objOverlay.length)
    g_objOverlay.hide();
    
  }
  
  /*
  * create tip
  */
  function createTip(menuSectionParent){
    
    var isTipExist = menuSectionParent.data('tip');
    
    if(isTipExist == false)
    return(false);
    
    var offsetY = g_menuList.data("offset-y");
    
    //create padding for the tip
    if(offsetY < 14){
      menuSectionParent.css({'padding-top': '14px'})
    }else if(offsetY >= 14){
      menuSectionParent.css({'padding-top': offsetY + 'px'})
    }
    
    var objsection = menuSectionParent.find('.uc-connected');
    
    objsection.prepend('<div class="ue-tip"></div>');
    
    var objErrorTip;
    
    if(menuSectionParent.hasClass('section-error')){
      menuSectionParent.find('.uc-section-error').prepend('<div class="ue-tip"></div>');
      
      objErrorTip =  menuSectionParent.find('.ue-tip');
      
      objErrorTip.css({
        'border-top-color': '#cccccc',
        'border-left-color': '#cccccc'
      })
    }
    
    var objTip = menuSectionParent.find('.ue-tip');
    var menuSectionBgColor = objsection.css('background-color');
    var dataTipBgColor = menuSectionParent.data('bg-color');
    var dataTipMainColor = menuSectionParent.data('tip-color');
    
    var isMenuSectionBorderExist = parseInt(objsection.css('border-width')) > 0;
    var menuSectionBorderColor = objsection.css('border-color');
    
    if(menuSectionBgColor == 'rgba(0, 0, 0, 0)' && isMenuSectionBorderExist == false){
      objTip.css({
        'border-top-color': dataTipBgColor,
        'border-left-color': dataTipBgColor,
      });
    }
    
    if(isMenuSectionBorderExist == true){
      objTip.css({
        'border-top-color': menuSectionBorderColor,
        'border-left-color': menuSectionBorderColor,
      });
    }
    
    if(menuSectionBgColor != 'rgba(0, 0, 0, 0)' && isMenuSectionBorderExist == false){
      objTip.css({
        'border-top-color': menuSectionBgColor,
        'border-left-color': menuSectionBgColor,
      });
    }
    
    if(menuSectionParent.hasClass('section-error')){
      
      objErrorTip.css({
        'border-top-color': '#cccccc',
        'border-left-color': '#cccccc'
      })
    }
    
    if(dataTipMainColor != ''){
      objTip.css({
        'border-top-color': dataTipMainColor,
        'border-left-color': dataTipMainColor,
      });
    }
    
    if(menuSectionBgColor == 'rgba(0, 0, 0, 0)' && isMenuSectionBorderExist == false && dataTipBgColor == '' && dataTipMainColor == ''){
      objTip.css({
        'border-top-color': '#C9C9C9',
        'border-left-color': '#C9C9C9'
      });
    }
  } 
  
  /*
  * set position of the tip
  */
  function setTipPosition(menuSectionParent){
    
    if(menuSectionParent.length == 0)
    return(false);
    
    var objTip = menuSectionParent.find('.ue-tip');
    var objsection = menuSectionParent.find('.uc-connected');
    
    var menuSectionBgColor = objsection.css('background-color');
    var menuSectionBorderColor = objsection.css('border-color');
    var dataTipBgColor = menuSectionParent.data('bg-color');
    var dataTipMainColor = menuSectionParent.data('tip-color');
    
    var isMenuSectionBorderExist = parseInt(objsection.css('border-width')) > 0;
    
    var menuItem = menuSectionParent.parents('.uc-mega_menu_list_item');
    
    var menuItemWidth = menuItem.width();
    var objTipWidth = objTip.width();
    var menuSectionWidth = menuSectionParent.width();
    var menuItemCenter = menuItemWidth / 2;
    
    var menuItemOffsetLeft = menuItem.offset().left;
    var menuSectionOffsetLeft = menuSectionParent.offset().left;
    
    var menuItemOffsetRight = menuItemOffsetLeft + menuItemWidth;
    var menuSectionOffsetRight = menuSectionOffsetLeft + menuSectionWidth;
    
    var menuItemCenterOffsetLeft = menuItemOffsetLeft + menuItemCenter;
    
    if (menuItemOffsetLeft == menuSectionOffsetLeft){
      objTip.css({
        'left': (menuItemWidth / 2) + 'px',
        'right': 'unset'
      });
    }
    
    if(menuItemOffsetRight == menuSectionOffsetRight){
      objTip.css({
        'left': 'unset',
        'right': (menuItemWidth / 2) + 'px'
      });
    }
    
    if (menuSectionOffsetLeft < menuItemOffsetLeft && menuSectionOffsetRight > menuItemCenterOffsetLeft + objTipWidth){
      
      //find how much menuSectionOffsetLeft is less then menuItemOffsetLeft
      var menuItemSectionPositionDeviation = menuItemOffsetLeft - menuSectionOffsetLeft;
      
      objTip.css({
        'left': menuItemSectionPositionDeviation + (menuItemWidth / 2) + 'px',
        'right': 'unset'
      });
    }
    
    if (menuSectionOffsetLeft < menuItemOffsetLeft && menuSectionOffsetRight <= menuItemCenterOffsetLeft + objTipWidth){
      
      //find how much menuSectionOffsetLeft is less then menuItemOffsetLeft
      var menuItemSectionPositionDeviation = menuItemOffsetLeft - menuSectionOffsetLeft;
      
      objTip.css({
        'left': 'unset',
        'right': '0px',
        'transform': 'translate(0, -50%) rotate(0)',
        'border-top-color': 'transparent',
        'border-left-color': 'transparent'
      });
      
      //set right border color 
      if(menuSectionBgColor == 'rgba(0, 0, 0, 0)' && isMenuSectionBorderExist == false){
        objTip.css({
          'border-right-color': dataTipBgColor
        });
      }
      
      if(isMenuSectionBorderExist == true){
        objTip.css({
          'border-right-color': menuSectionBorderColor
        });
      }
      
      if(menuSectionBgColor != 'rgba(0, 0, 0, 0)' && isMenuSectionBorderExist == false){
        objTip.css({
          'border-right-color': menuSectionBgColor
        });
      }
      
      if (menuSectionParent.hasClass('section-error')){  
        var objErrorTip =  menuSectionParent.find('.ue-tip');
        
        objErrorTip.css({
          'border-right-color': '#cccccc',
        });
      }
      
      if(dataTipMainColor != ''){
        objTip.css({
          'border-right-color': dataTipMainColor
        });
      }
      
      if(menuSectionBgColor == 'rgba(0, 0, 0, 0)' && isMenuSectionBorderExist == false && dataTipBgColor == '' && dataTipMainColor == ''){
        objTip.css({
          'border-right-color': '#C9C9C9'
        });
      }
      
    }
    
    if (menuSectionOffsetLeft > menuItemOffsetLeft && menuSectionOffsetLeft < menuItemCenterOffsetLeft - objTipWidth){
      
      //find how much menuSectionOffsetLeft is grater then menuItemOffsetLeft
      var menuItemSectionPositionDeviation = menuSectionOffsetLeft - menuItemOffsetLeft;
      
      objTip.css({
        'left': (menuItemWidth / 2) - menuItemSectionPositionDeviation + 'px',
        'right': 'unset'
      });
    }
    
    if (menuSectionOffsetLeft > menuItemOffsetLeft && menuSectionOffsetLeft >= menuItemCenterOffsetLeft - objTipWidth){
      
      //find how much menuSectionOffsetLeft is grater then menuItemOffsetLeft
      var menuItemSectionPositionDeviation = menuSectionOffsetLeft - menuItemOffsetLeft;
      
      objTip.css({
        'left': '0px',
        'right': 'unset',
        'transform': 'translate(0, -50%) rotate(0)',
        'border-top-color': 'transparent'
      });
    }
  }
  
  /*
  * get menu item offset top position
  */
  function getScrollPos(){
    
    if(g_isNotCustomResponsiveViewport.matches == true)
    return(false);
    
    g_menuItem.each(function(){
      
      var objItem = jQuery(this);
      
      var menuItemOffsetTop = objItem.offset().top;
      
      objItem.attr('data-scrollpos', menuItemOffsetTop);
    });
  }
  
  /* 
  * check if element is in viewport
  */
  function isElementInViewport(element){
    
    var elementTop = element.offset().top;
    var viewportTop = jQuery(window).scrollTop();
    
    //check if beginning of the element is in viewport
    var isInViewport = elementTop > viewportTop;
    
    return(isInViewport);
  }
  
  /*
  * scroll to head
  */
  function scrollToHead(menuItem){
    
    if(g_isNotCustomResponsiveViewport.matches == true)
    return(false);
    
    var menuItemOffsetTop = menuItem.data('scrollpos');
    var menuItemSection = menuItem.find(g_classSection);
    
    //wait untill height transition is finished
    setTimeout(function(){
      
      if(isElementInViewport(menuItemSection) == true)
      return(false);
      
      g_menuListWrap.animate({
        scrollTop: menuItemOffsetTop
      }, 400);
    }, 400);
  }
  
  /*
  * hide arrows while animation is on
  */
  function showHideArrows(){
    
    if(g_indicator.length == 0)
    return(false);
    
    var dataAnimation = g_indicator.data('animate-arrows')
    
    if(dataAnimation == false)
    return(false);
    
    setTimeout(function(){
      g_indicator.css({'opacity': 1});
    }, 300)
  }
  
  /*
  * set class to menu item title when base url matches
  */
  function checkUrl(){
    
    var itemsNumber = g_menuItem.length;
    
    for(let i=0; i<itemsNumber; i++){
      var menuItemTitle = g_menuItem.eq(i).find('.uc-mega_menu_title');
      var menuItemUrl = menuItemTitle.attr('href');
      
      if(menuItemUrl == g_urlBase){
        menuItemTitle.addClass('uc-current-page');
      }
    }    
  }
  
  /*
  * show | hide section in editor
  */ 
  function hideSectionInEditor(menuSectionItem){
    
    if(g_dataEditor == false)
    return(false);
    
    
    if(menuSectionItem.hasClass('uc-connected') == true)
    return(false);
    
    var dataShowInEditor = g_menuList.data('show-section');
    
    if(dataShowInEditor == 'no'){
      menuSectionItem.css({
        'position': '',
        'visibility': 'visible'
      });
    }
    
    if(dataShowInEditor == 'message' || dataShowInEditor == 'hide'){
      menuSectionItem.css({
        'position': 'absolute',
        'visibility': 'hidden'
      });
    }
  }
  
  /*
  * open first item on mobile
  */
  function openFirstItem(){
    
    if(g_isNotCustomResponsiveViewport.matches == true)
    return(false);
    
    var firstItem = g_menuItem.eq(0);
    var firsItemTitle = firstItem.find('.uc-mega_menu_title');
    var dataFirstItemType = firsItemTitle.data('type');
    var dataFirstItemClickable = firsItemTitle.data('clickable-link');
    
    if(dataFirstItemType != 'section')
    return(false);
    
    if(dataFirstItemClickable != false)
    return(false);
    
    var dataOpenFirstItem = g_menuList.data('open-first');
    
    if(dataOpenFirstItem == false)
    return(false);
    
    setActive(firstItem);
    setActiveArrow(firstItem);
    
  }
  
  /*
  * define item type "section" behaviour
  */
  function handleItemTypeSection(){
    
    var menuSectionParentItem = g_menuSection.parents('.uc-mega_menu_list_item');
    
    menuSectionParentItem.each(function(){
      
      var objSection = jQuery(this); 
      var menuSectionId = objSection.data("id");
      var menuSectionItem = jQuery("#" + menuSectionId);
      var menuSectionParent = objSection.find(g_classSection);
      var firstMenuSectionParent = objSection.eq(0).find(g_classSection);
      
      setTemplateStyle();
      
      findSections(objSection, menuSectionParent, menuSectionItem, firstMenuSectionParent);
      
      showHideErrors(objSection, menuSectionId, menuSectionParent, menuSectionItem);
      debugHiddenElements();  
      
      
    }); 
    
    handleWidthType();
    showHideArrows();
    
    //set visible position of all dropdown sections and then create tip
    for(let i = 0; i < g_menuItem.length; i++){  
      
      var objMenuItem = g_menuItem.eq(i);
      var menuSection = objMenuItem.find(g_classSection);
      var menuSectionChild = menuSection.children();
      
      setVisiblePositionX(objMenuItem);
      
      createTip(menuSection);
      setTipPosition(menuSection);
      setCoverPosition(menuSection, menuSectionChild);
    }
    
    //handle debug mode   
    showHideMenuItemsId();
    showHideElementsId();
    
    if(g_isCustomResponsiveViewport.matches == true){
      g_menuListWrap.addClass('uc-mobile-mode');
    }else{
      g_menuListWrap.removeClass('uc-mobile-mode');
    }
    
    getScrollPos();
    checkUrl();
    
    openFirstItem();
  }
  
  /*
  * define item type "section" behaviour in editor
  */
  function handleItemTypeSectionInEditor(){
    
    g_menuItem.each(function(){
      
      var objSection = jQuery(this); 
      var menuSectionId = objSection.data("id");
      var menuSectionItem = jQuery("#" + menuSectionId);
      var menuSectionParent = objSection.find(g_classSection);
      
      
      showHideErrors(objSection, menuSectionId, menuSectionParent, menuSectionItem);
      debugHiddenElements();  
      
      hideSectionInEditor(menuSectionItem)
      
    }); 
    
    //handle debug mode   
    showHideMenuItemsId();
    showHideElementsId();
    
  }
  
  /*
  * handle click event
  */
  function menuItemClick(objTitle){
    
    var activeMenuItemClick = objTitle.parents('.uc-mega_menu_list_item');
    
    if(activeMenuItemClick.hasClass(g_classActive)){
      
      setDisactive();
      
      if(g_isCustomResponsiveViewport.matches == true)
      setDisactiveResponsiveHeight();
      
    }else{
      setActive(activeMenuItemClick);
      setActiveArrow(activeMenuItemClick);
    }
  }
  
  /*
  * close menu when anchor link click
  */
  function closeMenuOnAnchorClick(objTitle){
    
    var url = objTitle.attr('href');
    
    //if not anchor do nothing
    if (url.indexOf("#") == -1)
    return(false);
    
    setDisactive();
    
    if(g_isCustomResponsiveViewport.matches == false)
    return(false);
    
    setDisactiveResponsiveHeight();
    g_menuListWrap.removeClass(g_menuActiveClass);
    g_objBody.removeClass(g_menuActiveClass);
    g_menu.removeClass(g_menuActiveClass);   
    
  }
  
  /*
  * handle click event
  */
  function onMenuItemClick(e){
    
    var objTitle = jQuery(this);
    var isItemClickable = objTitle.data('clickable-link');
    var itemType = objTitle.data('type');
    var titleClass = 'uc-mega_menu_title';
    
    if (g_dataMenuOpen == 'hover'){      
      
      if(g_isDesktopViewport.matches == true && g_isCustomResponsiveViewport.matches == false && itemType != 'link' && isItemClickable == false)
      return(false);
      
      if(itemType != 'link' && isItemClickable == false){
        menuItemClick(objTitle);
        return(false);
      }
      
      if(g_isNotDesktopViewport.matches == true && isItemClickable == true){
        
        var objTarget = jQuery(e.target);
        var objTargetParent = objTarget.parent();
        
        if(objTargetParent.hasClass(titleClass) == false){
          
          menuItemClick(objTitle);
          return(false);
          
        }
        
        if(objTargetParent.hasClass(titleClass) == true)
        return(true)
        
      }
      
      if(g_isDesktopViewport.matches == true && isItemClickable == true)
      return(true);
      
      //close menu when anchor link click
      if(itemType == 'link'){
        
        closeMenuOnAnchorClick(objTitle);      
        
        //stop any further function execution
        return(true);
        
      }     
      
      menuItemClick(objTitle);
    }
    
    //close menu when anchor link click
    if(itemType == 'link'){
      
      closeMenuOnAnchorClick(objTitle);      
      
      //stop any further function execution
      return(true);
      
    }  
    
    if(g_isDesktopViewport.matches == true && isItemClickable == true)
    return(true);
    
    if(g_isNotDesktopViewport.matches == true && isItemClickable == true){
      
      var objTarget = jQuery(e.target);
      var objTargetParent = objTarget.parent();
      
      if(objTargetParent.hasClass(titleClass) == false){
        
        menuItemClick(objTitle);
        return(false);
        
      }
      
      if(objTargetParent.hasClass(titleClass) == true)
      return(true)
      
    }
    
    if(isItemClickable == false)
    menuItemClick(objTitle);
  }
  
  /*
  * handle click on body event
  */
  function setDisactiveOnbodyClick(event){
    
    if(g_menuItem.hasClass(g_classActive) == false)
    return(false);
    
    if(g_isCustomResponsiveViewport.matches == true)
    return(false);
    
    //exclude arrow indicator from this function to prevent closing dropdown after arrow click
    if(jQuery(event.target).hasClass('uc_expand_indicator'))
    return(false);
    
    if (!jQuery(event.target).closest(g_menuItem).length)
    setDisactive();
    
  }
  
  /*
  * handle body click event
  */
  function bodyClick(event){
    
    if (g_dataMenuOpen == 'hover'){
      
      if(g_isDesktopViewport.matches == true && g_isNotCustomResponsiveViewport.matches == true){
        return(false);
      }
      
      setDisactiveOnbodyClick(event);
    }
    
    setDisactiveOnbodyClick(event);
  }
  
  /*
  * close menu on mega-menu-inner-links link-item click
  */ 
  function onInnerLinkClick(){
    
    setDisactive();
    
    if(g_isCustomResponsiveViewport.matches == true){
      setDisactiveResponsiveHeight();
      g_menuListWrap.removeClass(g_menuActiveClass);
      g_objBody.removeClass(g_menuActiveClass);
      g_menu.removeClass(g_menuActiveClass);
    }
    
    openFirstItem();
  }
  
  /*
  * handle body click event
  */
  function handleMenuItemClick(){
    
    g_menuItemTitle.on("click", onMenuItemClick);
    
    jQuery(document).on('click', function(event) {
      
      bodyClick(event);
    });
    
  }
  
  /*
  * handle mouse enter event on menu item
  */
  function onMenuItemMouseEnter(){
    
    if(g_dataMenuOpen == 'click')
    return(false);
    
    if(g_isCustomResponsiveViewport.matches == true)
    return(false);
    
    var activeMenuItemHover = jQuery(this);
    setActive(activeMenuItemHover);
    setActiveArrow(activeMenuItemHover);
  }
  
  /*
  * set disactive menu item on mouseleave
  */
  function onMenuItemMouseLeave(){
    
    if(g_dataMenuOpen == 'click')
    return(false);
    
    if(g_isCustomResponsiveViewport.matches == true)
    return(false);
    
    setDisactive();
  }
  
  /*
  * handle hover event
  */
  function handleMenuItemHover(){
    
    g_menuItem.on('mouseenter', onMenuItemMouseEnter);
    
    g_menuListWrap.on('mouseleave', onMenuItemMouseLeave);
  }
  
  /*
  * handle mega-menu-inner-links link-item click
  */
  function handleMenuInnerLinksClick(){
    
    g_menuList.on('close_mega_menu', onInnerLinkClick);
  } 
  
  /*
  * handle menu item open option
  */
  function menuItemOpen(){
    
    handleMenuItemHover();
    handleMenuItemClick();
    handleMenuInnerLinksClick();
  }
  
  /*
  * define responsive mode behaviour 
  */
  function onBurgerMenuClick(){
    
    g_menuListWrap.addClass(g_menuActiveClass);
    g_objBody.addClass(g_menuActiveClass);
  }
  
  /*
  * close menu on click on the burger
  */
  function onCloseBurgerMenuBtnClick(){
    
    g_menuItem.removeClass(g_classActive);
    
    g_menuSection.removeClass(g_classActive);
    setDisactiveArrow();
    
    setDisactiveResponsiveHeight();
    g_menuListWrap.removeClass(g_menuActiveClass);
    g_objBody.removeClass(g_menuActiveClass);
    
    //remove active class from menu
    g_menu.removeClass(g_menuActiveClass);
    
    openFirstItem();
  }
  
  /*
  * remove from body and menu wrapper open class
  */
  function removeOpenClass(){
    
    if(g_menuListWrap.hasClass(g_menuActiveClass) == false)
    return(false);
    
    if(g_objBody.hasClass(g_menuActiveClass) == false)
    return(false);
    
    g_menuListWrap.removeClass(g_menuActiveClass);
    g_objBody.removeClass(g_menuActiveClass);
  }
  
  /*
  * handle resize event
  */
  function onWindowResize(){
    
    var activeMenuItem = g_menu.find('.uc-mega_menu_list_item.uc-active_item');
    
    //set height 0 except active section when resize from desktop to mobile
    if(g_isCustomResponsiveViewport.matches == true){
      
      //add responsive class to wrapper on mobile
      g_menuListWrap.addClass('uc-mobile-mode');
      
      setActiveResponsiveHeight(activeMenuItem);
      
      g_objOverlay.hide();
    }
    
    //remove menu / wrapper open class when breakpoint changes 
    if(g_isNotCustomResponsiveViewport.matches == true){
      
      removeOpenClass();
      
      //remove responsive class from wrapper 
      g_menuListWrap.removeClass('uc-mobile-mode');
      
      g_menuSection.css({'height': 'unset'});
    }
    
    //update viewport width var on scroll
    g_viewportWidth = jQuery(window).width();
    
    //update left position on scroll
    g_menuWrapOffsetLeft = g_menuListWrap.offset().left;  
    
    handleWidthType();
    
    //set visible position of all dropdown sections / set position of the tip
    for(let i = 0; i < g_menuItem.length; i++){  
      
      var objMenuItem = g_menuItem.eq(i);
      var menuSection = objMenuItem.find(g_classSection);
      var menuSectionChild = menuSection.children();
      
      setVisiblePositionX(objMenuItem);
      
      setTipPosition(menuSection);
      setCoverPosition(menuSection, menuSectionChild);
    }
    
    setOverlayPosition(activeMenuItem);
    
    getScrollPos();
    
    //handle sticky section bug protection
    setTimeout(onPageScroll,100);                                    
    
  }  
  
  /*
  * handle scroll event for sticky section protection
  */
  function onPageScroll(){
    
    var objParentSticky = g_menu.parents('.elementor-sticky');
    
    //only if .elementor-sticky exist
    if(!objParentSticky.length)
    return(false);
    
    var objActiveMenuSections = jQuery('.uc-mega_menu_section.uc-active_item');
    var visibleMenuSectionNum = objActiveMenuSections.length;
    
    //only if active menu item section exist
    if(!visibleMenuSectionNum)
    return(false);
    
    //only if active menu item section number grater than 1
    if(visibleMenuSectionNum == 1)
    return(false);
    
    objActiveMenuSections.each(function(index, el){
      
      //look for index 1 only
      if(index == 0)
      return(true);
      
      //hide opened section with opacity
      el.style.opacity = 0;   
      
      if(g_isNotCustomResponsiveViewport.matches == true)
      return(true)
      
      jQuery(this).removeClass('uc-active_item');                                 
      
    });
    
  }   
  
  /**
  * find focused item and trigger event
  */
  function findFocusedAndTrigger(e, eventToTrigger){
    
    //look at each title item
    g_menuItemTitle.each(function(){
      
      var objTitle = jQuery(this);
      
      //if not focused then skip
      if(!objTitle.is(':focus'))
      return(true);
      
      //if open menu type hover
      if(g_dataMenuOpen == 'hover')
      objTitle.trigger(eventToTrigger);
      
      var activeMenuItemClick = objTitle.parents('.uc-mega_menu_list_item');

      //if open menu type click
      //if enter - check if active and open if not
      if(g_dataMenuOpen == 'click' && e.keyCode == 13){        
        
        if(activeMenuItemClick.hasClass(g_classActive) == false){
          
          setActive(activeMenuItemClick);
          setActiveArrow(activeMenuItemClick);

        }
                
      }
      
      //if esc - check if active and close if opened
      if(g_dataMenuOpen == 'click' && e.keyCode == 27){
                
        if(activeMenuItemClick.hasClass(g_classActive) == false)
        return(true);
        
        setDisactive();
        
      }
      
      e.preventDefault();
      
    });  
    
  }
  
  /**
  * find focused item and trigger open
  */
  function findFocusedAndOpen(e){
    
    findFocusedAndTrigger(e, 'mouseenter');   
    
  }
  
  /**
  * find focused item and trigger close
  */
  function findFocusedAndClose(e){
    
    findFocusedAndTrigger(e, 'mouseleave');  
    
  }
  
  /**
  * open / close with key press
  */
  function onKeyDown(e){
    
    //do not listen on mobile devices
    if(g_isCustomResponsiveViewport.matches == true)
    return(true);
    
    //if pressed key is enter then trigger open
    if(e.keyCode == 13)
    findFocusedAndOpen(e);    
    
    //if pressed key is esc then trigger close
    if(e.keyCode == 27)
    findFocusedAndClose(e);    
    
  }
  
  
  /*
  * init menu
  */
  this.init = function(objMegaMenu, arrItems, urlAjax){
    
    //init globals
    g_menu = jQuery(objMegaMenu);
    g_menuSection = g_menu.find(".uc-mega_menu_section");
    g_menuList = g_menu.find(".uc-mega_menu_list");
    g_menuItem = g_menu.find(".uc-mega_menu_list_item");
    g_menuItemTitle = g_menu.find(".uc-mega_menu_title");
    g_menuListWrap = g_menu.find(".uc-mega_menu-wrapper");
    g_indicator = g_menuItem.find('.sub-arrow');
    g_objBody = jQuery("body");
    g_dataMenuOpen = g_menuList.data("menu-open");
    g_objOverlay = g_menu.find('.uc_mega_menu_overlay');
    g_menuWrapOffsetLeft = g_menuListWrap.offset().left;
    g_viewportWidth = jQuery(window).width();
    g_dataPositionX = g_menuList.data("position-x"); 
    g_dataEditor = g_menu.data("editor");
    g_showErrors = g_menu.data("errors");
    g_offsetX = g_menuList.data("offset-x");
    g_urlBase = urlAjax;
    
    g_menuActiveClass = "uc-menu-open";
    g_classSection = '.uc-mega_menu_section';
    g_classActive = 'uc-active_item';
    
    g_isDesktopViewport = window.matchMedia("(min-width: 1025px)");
    g_isNotDesktopViewport = window.matchMedia("(max-width: 1024px)");
    
    var customResponsiveBreakpoint = g_menuListWrap.data("responsive-breakpoint");
    
    g_isCustomResponsiveViewport = window.matchMedia("(max-width: " + customResponsiveBreakpoint + "px)");
    g_isNotCustomResponsiveViewport = window.matchMedia("(min-width: " + (customResponsiveBreakpoint + 1) + "px)");
    
    g_arrItems = arrItems;
    
    //remove any loader that was active
    var objLoaders = g_menu.find('.uc-mega-menu-item-loader');
    
    objLoaders.remove();
    
    //remove uc-arrow-hidden class from sub-arrows
    if(g_indicator.length)
    g_indicator.removeClass('uc-arrow-hidden');                                     
    
    //if in editor do nothing with sections
    if(g_dataEditor == 'no')                                     
    handleItemTypeSection();
    
    //if in editor debug sections
    if(g_dataEditor == 'yes')                                     
    handleItemTypeSectionInEditor();
    
    var burgerMenu = g_menu.find(".uc-mega_menu-burger");
    var closeBtn = g_menu.find(".uc-mega_menu-close-btn");
    
    //init events
    burgerMenu.on("click", onBurgerMenuClick);
    closeBtn.on("click", onCloseBurgerMenuBtnClick);
    
    //if in editor do not open dropdown
    if(g_dataEditor == 'yes')
    return(false);
    
    menuItemOpen();
    
    jQuery(window).on('resize', onWindowResize);
    
    jQuery(window).on('scroll', function(){       
      setTimeout(onPageScroll,100);
    });
    
    g_menuListWrap.on('scroll', function(){
      setTimeout(onPageScroll,100);
    });     
    
    jQuery(window).on("keydown", function(e){      
      onKeyDown(e);
    });
  }
}