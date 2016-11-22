/**
 * 纯js实现多div拖拽
 * @param bar, 拖拽触柄
 * @param target, 可拖动窗口
 * @param inWindow, 为true时只能在屏幕范围内拖拽
 * @param callback, 拖拽时执行的回调函数。包含两个参数，target的left和top
 * @returns {*}
 * @private
 */
var startDrag = function(bar, target, /* optional */inWindow, /* optional */callback) {
    (function(bar, target, callback) {
        var D = document,
            DB = document.body,
            params = {
                left: 0,
                top: 0,
                currentX: 0,
                currentY: 0
            };
        if(typeof bar == "string") {
            bar = D.getElementById(bar);
        }
        if(typeof target == "string") {
            target = D.getElementById(target);
        }
        bar.style.cursor="move";
        bindHandler(bar, "mousedown", function(e) {
            e.preventDefault();
            params.left = target.offsetLeft;
            params.top = target.offsetTop;
            if(!e){
                e = window.event;
                bar.onselectstart = function(){
                    return false;
                }
            }
            params.currentX = e.clientX;
            params.currentY = e.clientY;
            
            var stopDrag = function() {
                removeHandler(DB, "mousemove", beginDrag);
                removeHandler(DB, "mouseup", stopDrag);
            }, beginDrag = function(e) {
                var evt = e ? e: window.event,
                    nowX = evt.clientX, nowY = evt.clientY,
                    disX = nowX - params.currentX, disY = nowY - params.currentY,
                    left = parseInt(params.left) + disX,
                    top = parseInt(params.top) + disY;
                if(inWindow) {
                    var maxTop = DB.offsetHeight - target.offsetHeight,
                        maxLeft = DB.offsetWidth - target.offsetWidth;
                    if(top < 0) top = 0;
                    if(top > maxTop) top = maxTop;
                    if(left < 0) left = 0;
                    if(left > maxLeft) left = maxLeft;
                }
                target.style.left = left + "px";
                target.style.top = top + "px";

                if (typeof callback == "function") {
                    callback(left, top);
                }
            };
            
            bindHandler(DB, "mouseup", stopDrag);
            bindHandler(DB, "mousemove", beginDrag);
        });
        
        function bindHandler(elem, type, handler) {
            if (window.addEventListener) {
                //false表示在冒泡阶段调用事件处理程序
                elem.addEventListener(type, handler, false);
            } else if (window.attachEvent) {
                // IE浏览器
                elem.attachEvent("on" + type, handler);
            }
        }

        function removeHandler(elem, type, handler) {
            // 标准浏览器
            if (window.removeEventListener) {
                elem.removeEventListener(type, handler, false);
            } else if (window.detachEvent) {
                // IE浏览器
                elem.detachEvent("on" + type, handler);
            }
        }
        
    })(bar, target, inWindow, callback);
};