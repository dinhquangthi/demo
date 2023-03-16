!(function (e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        var t;
        (t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this), (t.Cocoen = e());
    }
})(function () {
    return (function e(t, n, i) {
        function s(o, a) {
            if (!n[o]) {
                if (!t[o]) {
                    var l = "function" == typeof require && require;
                    if (!a && l) return l(o, !0);
                    if (r) return r(o, !0);
                    var d = new Error("Cannot find module '" + o + "'");
                    throw ((d.code = "MODULE_NOT_FOUND"), d);
                }
                var h = (n[o] = { exports: {} });
                t[o][0].call(
                    h.exports,
                    function (e) {
                        var n = t[o][1][e];
                        return s(n ? n : e);
                    },
                    h,
                    h.exports,
                    e,
                    t,
                    n,
                    i
                    );
                }
                return n[o].exports;
            }
            for (var r = "function" == typeof require && require, o = 0; o < i.length; o++) s(i[o]);
            return s;
        })(
            {
                1: [
                    function (e, t, n) {
                        "use strict";
                        function i(e, t) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                        }
                        var s =
                        Object.assign ||
                        function (e) {
                            for (var t = 1; t < arguments.length; t++) {
                                var n = arguments[t];
                                for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
                            }
                            return e;
                        },
                        r = (function () {
                            function e(e, t) {
                                for (var n = 0; n < t.length; n++) {
                                    var i = t[n];
                                    (i.enumerable = i.enumerable || !1), (i.configurable = !0), "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
                                }
                            }
                            return function (t, n, i) {
                                return n && e(t.prototype, n), i && e(t, i), t;
                            };
                        })(),
                        o = (function () {
                            function e(t, n) {
                                i(this, e), (this.options = s({}, e.defaults, n)), (this.element = t || document.querySelector(".cocoen")), this.init();
                            }
                            return (
                                r(e, [
                                    {
                                        key: "init",
                                        value: function () {
                                            this.createElements(), this.addEventListeners(), this.dimensions();
                                        },
                                    },
                                    {
                                        key: "createElements",
                                        value: function () {
                                            var e = document.createElement("span");
                                            (e.className = this.options.dragElementSelector.replace(".", "")), this.element.appendChild(e);
                                            var t = document.createElement("div"),
                                            n = this.element.querySelector("img:first-child");
                                            t.appendChild(n.cloneNode(!0)),
                                            n.parentNode.replaceChild(t, n),
                                            (this.dragElement = this.element.querySelector(this.options.dragElementSelector)),
                                            (this.beforeElement = this.element.querySelector("div:first-child")),
                                            (this.beforeImage = this.beforeElement.querySelector("img"));
                                        },
                                    },
                                    {
                                        key: "addEventListeners",
                                        value: function () {
                                            this.element.addEventListener("click", this.onTap.bind(this)),
                                            this.element.addEventListener("mousemove", this.onMouseDrag.bind(this)),
                                            this.element.addEventListener("touchmove", this.onTouchDrag.bind(this)),
                                            this.dragElement.addEventListener("mousedown", this.onMouseDragStart.bind(this)),
                                            this.dragElement.addEventListener("touchstart", this.onTouchDragStart.bind(this)),
                                            this.dragElement.addEventListener("touchend", this.onDragEnd.bind(this)),               
                                            window.addEventListener("mouseup", this.onDragEnd.bind(this)),
                                            window.addEventListener("resize", this.dimensions.bind(this));
                                        },
                                    },
                                    {
                                        key: "dimensions",
                                        value: function () {
                                            (this.elementWidth = parseInt(window.getComputedStyle(this.element).width, 10)),
                                            (this.elementHeight = parseInt(window.getComputedStyle(this.element).height, 10)),
                                            (this.elementOffsetLeft = this.element.getBoundingClientRect().left + document.body.scrollLeft),
                                            (this.elementOffsetTop = window.pageYOffset + this.element.getBoundingClientRect().top + document.body.scrollTop),
                                            (this.beforeImage.style.width = this.elementWidth + "px"),
                                            (this.dragElementWidth = parseInt(window.getComputedStyle(this.dragElement).width, 10)),
                                            (this.dragElementHeight = parseInt(window.getComputedStyle(this.dragElement).height, 10)),
                                            (this.minLeftPos = this.elementOffsetLeft + 10),
                                            (this.minTopPos = this.elementOffsetTop + 10),
                                            (this.maxLeftPos = this.elementOffsetLeft + this.elementWidth - this.dragElementWidth - 10);
                                            (this.maxTopPos = this.elementOffsetTop + this.elementHeight - this.dragElementHeight - 10);
                                            (this.startX = 0);
                                            (this.startY = 0);            
                                        },
                                    },
                                    {
                                        key: "onTap",
                                        value: function (e) {    

                                            e.preventDefault();  
                                  
                                            if(this.options.direction == 'horizontal')
                                            (this.leftPos = e.pageX ? e.pageX : e.touches[0].pageX), this.requestDrag();

                                            if(this.options.direction == 'vertical')
                                            (this.topPos = e.pageY ? e.pageY : e.touches[0].pageY), this.requestDrag();


                                        },
                                    },
                                    {
                                        key: "onTouchDragStart",
                                        value: function (e) {
                                            if (e.touches == undefined){
                                                return;
                                            }  
                                            
                                            this.startX = e.touches[0].pageX;
                                            this.startY = e.touches[0].pageY;   

                                            e.preventDefault();
                                            
                                            if(this.options.direction == 'horizontal'){
                                                
                                                var t = e.pageX ? e.pageX : e.touches[0].pageX,
                                                n = this.dragElement.getBoundingClientRect().left + document.body.scrollLeft;

                                                (this.posX = n + this.dragElementWidth - t), (this.isDragging = !0);
                                                
                                            }
                                            
                                            if(this.options.direction == 'vertical'){
                                                
                                                var startY = e.pageY ? e.pageY : e.touches[0].pageY; //start Y position after mouse click on handle
                                                var dragElementTopPosition = window.pageYOffset + this.dragElement.getBoundingClientRect().top + document.body.scrollTop; //how much px dragged from top of page
                                                
                                                //find how much px was dragged from start drag 
                                                (this.posY = dragElementTopPosition + this.dragElementHeight - startY), (this.isDragging = !0);                                               
                                                
                                            }
                                            
                                        },
                                    },
                                    {
                                        key: "onMouseDragStart",
                                        value: function (e) {
                                            
                                            e.preventDefault();
                                            
                                            if(this.options.direction == 'horizontal'){
                                                
                                                var t = e.pageX ? e.pageX : e.touches[0].pageX,
                                                n = this.dragElement.getBoundingClientRect().left + document.body.scrollLeft;

                                                (this.posX = n + this.dragElementWidth - t), (this.isDragging = !0);
                                                
                                            }
                                            
                                            if(this.options.direction == 'vertical'){
                                                
                                                var startY = e.pageY ? e.pageY : e.touches[0].pageY; //start Y position after mouse click on handle
                                                var dragElementTopPosition = window.pageYOffset + this.dragElement.getBoundingClientRect().top + document.body.scrollTop; //how much px dragged from top of page
                                                
                                                //find how much px was dragged from start drag 
                                                (this.posY = dragElementTopPosition + this.dragElementHeight - startY), (this.isDragging = !0);                                               
                                                
                                            }
                                        },
                                    },                        
                                    {
                                        key: "onDragEnd",
                                        value: function (e) {              
                                            this.startX = 0;
                                            this.startY = 0;                  
                                            e.preventDefault(), (this.isDragging = !1);
                                        },
                                    },
                                    {
                                        key: "onTouchDrag",
                                        value: function (e) {
                                            
                                            if (e.touches == undefined){
                                                return;
                                            }
                                            
                                            /* check drag direction (higher then 1 means horizontal direction, else - vertical direction) */
                                            var deltaX = Math.abs((e.touches[0].pageX - this.startX) / e.touches[0].pageX);
                                            var deltaY = Math.abs((e.touches[0].pageY - this.startY) / e.touches[0].pageY);
                                            
                                            e.preventDefault();

                                            if(this.options.direction == 'horizontal'){
                                                
                                                if ((deltaX / deltaY) > 1 && e.cancelable)
                                                this.isDragging && ((this.moveX = e.pageX ? e.pageX : e.touches[0].pageX), (this.leftPos = this.moveX + this.posX - this.dragElementWidth), this.requestDrag());
                                                
                                            }
                                            
                                            //vertical direction
                                            if(this.options.direction == 'vertical'){
                                                
                                                if ((deltaX / deltaY) < 1 && e.cancelable)
                                                this.isDragging && ((this.moveY = e.pageY ? e.pageY : e.touches[0].pageY), (this.topPos = this.moveY + this.posY - this.dragElementHeight), this.requestDrag());
                                                
                                            }
                                        },
                                    },
                                    {
                                        key: "onMouseDrag",
                                        value: function (e) {    
                                            
                                            e.preventDefault();
                                            
                                            if(this.options.direction == 'horizontal')
                                            this.isDragging && ((this.moveX = e.pageX ? e.pageX : e.touches[0].pageX), (this.leftPos = this.moveX + this.posX - this.dragElementWidth), this.requestDrag());
                                            
                                            if(this.options.direction == 'vertical')
                                            this.isDragging && ((this.moveY = e.pageY ? e.pageY : e.touches[0].pageY), (this.topPos = this.moveY + this.posY - this.dragElementHeight), this.requestDrag());
                                            
                                        },
                                    },
                                    {
                                        key: "drag",
                                        value: function () {
                                            
                                            if(this.options.direction == 'horizontal'){
                                                
                                                this.leftPos < this.minLeftPos ? (this.leftPos = this.minLeftPos) : this.leftPos > this.maxLeftPos && (this.leftPos = this.maxLeftPos);
                                                
                                                var e = this.leftPos + this.dragElementWidth / 2 - this.elementOffsetLeft;
                                                
                                                e /= this.elementWidth;
                                                
                                                var t = 100 * e + "%";
                                                
                                                //posistion of the drag element for horizontal position
                                                (this.dragElement.style.left = t), (this.beforeElement.style.width = t), this.options.dragCallback && this.options.dragCallback(e);
                                                
                                            }
                                            
                                            if(this.options.direction == 'vertical'){
                                                
                                                this.topPos < this.minTopPos ? (this.topPos = this.minTopPos) : this.topPos > this.maxTopPos && (this.topPos = this.maxTopPos);
                                                
                                                var relativeTopPos = this.topPos + this.dragElementHeight / 2 - this.elementOffsetTop;
                                                
                                                relativeTopPos /= this.elementHeight; //index between 0 and 1
                                                
                                                var relativeTopPosPercents = 100 * relativeTopPos + "%";
                                                
                                                //posistion of the drag element for vertical position                                            
                                                (this.dragElement.style.top = relativeTopPosPercents), (this.beforeElement.style.height = relativeTopPosPercents), this.options.dragCallback && this.options.dragCallback(e);
                                                
                                            }
                                        },
                                    },
                                    {
                                        key: "requestDrag",
                                        value: function () {
                                            window.requestAnimationFrame(this.drag.bind(this));
                                        },
                                    },
                                ]),
                                e
                                );
                            })();
                            (o.defaults = { 
                                
                                dragElementSelector: ".cocoen-drag", 
                                dragCallback: null,
                                direction: 'vertical' 
                                
                            }), (t.exports = o);
                        },
                        {},
                    ],
                },
                {},
                [1]
                )(1);
            });
            