"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var controlBubble,controlBar,u,timeoutID,_this=void 0,synth=window.speechSynthesis,ritmDisabledClassName="ritm-disabled",groupClassName="read-it-to-me-content-group",focusClassName="focusin",contentQueue=[],voices=[],ritmEnabled=!0,eventsBin={play:null,pause:null,cancel:null,toggle:null},setup=function(){0===(voices=synth.getVoices()).length&&void 0!==synth.onvoiceschanged&&(synth.onvoiceschanged=function(){voices=synth.getVoices()}),addReadItToMeElements(),attachEvents(),sessionStorage.getItem("readItToMeDisabled")&&(controlBar.querySelector("input.switch-input").checked=!1,toggleReadItToMe())},makeElemTabable=function(e){e.hasAttribute("tabindex")?e.classList.contains("ritm-do-not-strip-tabindex")||e.classList.add("ritm-do-not-strip-tabindex"):e.setAttribute("tabindex","0")},addReadItToMeElements=function(){var e=document.querySelectorAll(".".concat(groupClassName)),t=document.createElement("div");t.classList.add("read-this-to-me"),e.forEach(function(e){var n=t.cloneNode(!1);for(e.appendChild(n);e.firstChild!==n;)n.appendChild(e.firstChild)}),(controlBubble=document.createElement("div")).classList.add("read-it-to-me-control-bubble"),controlBubble.innerHTML='<p class="read-it-to-me-label"></p><button type="button" class="play-pause-resume"></button><button type="button" class="cancel-audio"><span class="visually-hidden">Cancel audio</a></button>',(controlBar=document.createElement("div")).classList.add("read-it-to-me-control-bar"),controlBar.setAttribute("tabindex","0"),controlBar.setAttribute("aria-describedby","ritm-sr-message"),controlBar.innerHTML='<div class="toggle-wrapper">\n                            <p class="visually-hidden" id="ritm-sr-message">Screen-reader users: there is a rudimentary "on-demand" read-aloud feature in use on this page called "Read-it-to-Me".  This new feature, which isn\'t meant as a screen-reader alternative, adds more tabable areas in the document which are great for keyboard users not using screen-readers, but are likely to be annoying for you. You can toggle off/on "Read-it-to-Me" using this checkbox.</p>\n                            <p class="read-it-to-me-label">Toggle Read-it-to-Me</p>\n                            <label class="switch" aria-label="Toggle Read-it-to-Me." aria-describedby="ritm-sr-message">\n                              <input type="checkbox" class="switch-input" checked>\n                              <span class="switch-outline"></span>\n                              <span class="switch-label" data-on="On" data-off="Off"></span>\n                              <span class="switch-handle"></span>\n                            </label>\n                          </div>\n                          <div class="cancel-audio-wrapper">\n                            <button type="button" class="btn btn-default btn-lg">Cancel audio</button>\n                          </div>';var n=document.body;n.insertBefore(controlBar,n.firstChild),n.appendChild(controlBubble)},attachControlBubbleToGroup=function(e){if(controlBubble.parentNode!==e)try{e.insertBefore(controlBubble,e.firstChild)}catch(e){}},moveControlBubbleToBody=function(){try{document.body.appendChild(controlBubble)}catch(e){}},clearStrayFocus=function(){var e=document.querySelector(".".concat(focusClassName));e&&e.classList.remove(focusClassName)},groupSelectorEnter=function(e){if(!ritmEnabled)return!1;clearStrayFocus();var t=e.target;t&&t.matches(".".concat(groupClassName))&&!t.querySelector(".read-it-to-me-control-bubble")&&attachControlBubbleToGroup(t)},groupSelectorLeave=function(e){if(!ritmEnabled)return!1;var t=e.relatedTarget?e.relatedTarget.closest(".".concat(groupClassName)):null;t?attachControlBubbleToGroup(t):moveControlBubbleToBody()},groupFocusInListener=function(e){if(!ritmEnabled)return!1;e.stopPropagation();var t,n=e.target,o=e.relatedTarget;if(n&&n.matches(".".concat(groupClassName))&&(t=!(!o||n.firstChild.querySelector("button")!==o),n.classList.contains(focusClassName)||n.classList.add(focusClassName),n.querySelector(".read-it-to-me-control-bubble")||attachControlBubbleToGroup(n),!t)){var a=window.scrollY;n.firstChild.querySelector("button").focus(),window.scroll(0,a)}},groupFocusOutListener=function(e){if(!ritmEnabled)return!1;e.stopPropagation();var t=e.target,n=e.relatedTarget;if(t&&n){if(t.matches(".".concat(groupClassName))&&n.matches(".read-it-to-me-control-bubble button")&&t.contains(n))return!1;if(t.matches(".read-it-to-me-control-bubble button")&&n.matches(".".concat(groupClassName))&&n.contains(t))return!1;if(t.matches(".read-it-to-me-control-bubble button")&&n.matches(".read-it-to-me-control-bubble button"))return!1;(t.matches(".".concat(groupClassName))?t:t.closest(".".concat(groupClassName))).classList.remove(focusClassName),moveControlBubbleToBody()}},toggleReadItToMe=function(e){var t=e?e.target:controlBar.querySelector("input.switch-input"),n=document.querySelectorAll(".".concat(groupClassName));t.checked?(ritmEnabled=!0,sessionStorage.removeItem("readItToMeDisabled"),n.forEach(function(e){e.classList.remove(ritmDisabledClassName),makeElemTabable(e)})):(ritmEnabled=!1,clearStrayFocus(),synth.cancel(),sessionStorage.setItem("readItToMeDisabled","1"),n.forEach(function(e){e.classList.add(ritmDisabledClassName),e.classList.contains("ritm-do-not-strip-tabindex")||e.removeAttribute("tabindex")})),e&&eventsBin.toggle&&eventsBin.toggle()},controlBarFocusIn=function(e){e.target&&controlBar.contains(e.target)&&(controlBar.classList.contains("control-bar-show")||showControlBar())},controlBarFocusOut=function(e){(e.relatedTarget&&!controlBar.contains(e.relatedTarget)||!e.relatedTarget)&&hideControlBar()},cancelAudio=function(){if(eventsBin.cancel)try{eventsBin.cancel()}catch(e){}controlBar.contains(_this)&&controlBar.focus(),controlBubble.contains(_this)&&controlBubble.focus(),cancel()},attachEvents=function(){controlBubble.querySelector("button.play-pause-resume").addEventListener("click",function(e){if(!ritmEnabled)return!1;e.stopPropagation();var t=e.target.closest(".".concat(groupClassName));contentGroupManager(t)}),controlBubble.querySelector("button.cancel-audio").addEventListener("click",cancelAudio),controlBar.querySelector("button").addEventListener("click",cancelAudio),controlBar.querySelector("input.switch-input").addEventListener("change",toggleReadItToMe),controlBar.addEventListener("focusin",controlBarFocusIn),controlBar.addEventListener("focusout",controlBarFocusOut),document.querySelectorAll(".".concat(groupClassName)).forEach(function(e){e.addEventListener("mouseenter",groupSelectorEnter),e.addEventListener("click",groupSelectorEnter),e.addEventListener("mouseleave",groupSelectorLeave),e.addEventListener("focusin",groupFocusInListener),e.addEventListener("focusout",groupFocusOutListener)}),synth.cancel()},contentGroupManager=function(e){e.classList.contains("read-it-to-me-play")||e.classList.contains("read-it-to-me-pause")?e.classList.contains("read-it-to-me-play")?(pause(),e.classList.toggle("read-it-to-me-play"),e.classList.toggle("read-it-to-me-pause")):e.classList.contains("read-it-to-me-pause")&&(resume(),e.classList.toggle("read-it-to-me-play"),e.classList.toggle("read-it-to-me-pause")):(contentQueue.push(e),document.querySelectorAll(".read-it-to-me-play").length>0||document.querySelectorAll(".read-it-to-me-pause").length>0?cancel():play(),e.classList.toggle("read-it-to-me-play"))},clearContentGroup=function(e){e.classList.remove("read-it-to-me-play"),e.classList.remove("read-it-to-me-pause")},showCancelButton=function(){controlBar.classList.add("show-ritm-cancel")},hideCancelButton=function(){controlBar.classList.remove("show-ritm-cancel")},showControlBar=function(){controlBar.classList.add("control-bar-show")},hideControlBar=function(){controlBar.classList.remove("control-bar-show")},getPlainTextWithPsuedoSemantics=function(e){var t=e.cloneNode(!0);return t.querySelectorAll("p, li, abbr, strong, em, h1, h2, h3, h4, h5, h6").forEach(function(e){var t=e.tagName.toUpperCase();if("P"===t)e.appendChild(document.createTextNode(". "));else if("ABBR"===t){var n=e.textContent.split("");e.textContent=n.join(".")}else"STRONG"===t||"EM"===t?(e.insertBefore(document.createTextNode(", "),e.firstChild),e.appendChild(document.createTextNode(", "))):"LI"===t?e.appendChild(document.createTextNode(", ")):"H1"!==t&&"H2"!==t&&"H3"!==t&&"H4"!==t&&"H5"!==t&&"H6"!==t||e.appendChild(document.createTextNode(", "))}),t.textContent},utteranceEnd=function(){contentQueue.length>0&&(clearContentGroup(contentQueue[0]),hideControlBar(),hideCancelButton(),contentQueue.shift()),contentQueue.length>0&&play(),timeoutID=null},play=function(){var e=getPlainTextWithPsuedoSemantics(contentQueue[0].querySelector(".read-this-to-me"));if((u=new SpeechSynthesisUtterance(e)).lang="en-US",u.rate=.8,voices.length>0)for(var t=0;t<voices.length;t++)if(0===voices[t].lang.indexOf("en")&&"Samantha"===voices[t].name){u.voice=voices[t];break}u.onend=utteranceEnd,u.onerror=function(){timeoutID||(timeoutID=window.setTimeout(utteranceEnd,100))},synth.speak(u),showCancelButton(),showControlBar(),eventsBin.play&&eventsBin.play()},pause=function(){synth.pause(),eventsBin.pause&&eventsBin.pause()},resume=function(){synth.resume()},cancel=function(){hideCancelButton(),synth.cancel()};function init(e){synth?(e&&document.querySelectorAll(e).length>0&&document.querySelectorAll(e).forEach(function(e){e.classList.add(groupClassName)}),document.querySelectorAll(".".concat(groupClassName)).forEach(function(e){makeElemTabable(e)}),document.querySelectorAll(".".concat(groupClassName))&&setup()):document.querySelectorAll(".".concat(groupClassName)).forEach(function(e){e.classList.remove(groupClassName,focusClassName)})}function isEnabled(){return ritmEnabled}function currentUtteranceIdentifier(){return!(!contentQueue[0]||!contentQueue[0].dataset.ritmOptionalTrackingIdentifier||""===contentQueue[0].dataset.ritmOptionalTrackingIdentifier)&&contentQueue[0].dataset.ritmOptionalTrackingIdentifier}function eventTracking(e){e&&(e.play&&"function"==typeof e.play&&(eventsBin.play=e.play),e.pause&&"function"==typeof e.pause&&(eventsBin.pause=e.pause),e.cancel&&"function"==typeof e.cancel&&(eventsBin.cancel=e.cancel),e.toggle&&"function"==typeof e.toggle&&(eventsBin.toggle=e.toggle))}exports.currentUtteranceIdentifier=currentUtteranceIdentifier,exports.eventTracking=eventTracking,exports.init=init,exports.isEnabled=isEnabled;
//# sourceMappingURL=read-it-to-me.cjs.js.map