/**
 * GitHub:
 * https://github.com/TomWright/TribalWarsScripts
 */

if (typeof TomWrightTribalWars == 'undefined') {

    var TomWrightTribalWars = {};

    TomWrightTribalWars.loadedScripts = ["general.js"];

    TomWrightTribalWars.makeSetupTomWrightTribalWarsArray = function () {
        if (typeof window.setupTomWrightTribalWars != 'undefined') {
            if (! (window.setupTomWrightTribalWars instanceof Array)) {
                var setupFunc = window.setupTomWrightTribalWars;
                window.setupTomWrightTribalWars = [setupFunc];
            }
        } else {
            window.setupTomWrightTribalWars = [];
        }
    }

    TomWrightTribalWars.iterateThroughSetup = function () {
        this.executeNextSetupCallback();
    }

    TomWrightTribalWars.executeNextSetupCallback = function () {
        if (typeof window.setupTomWrightTribalWars != 'undefined' && window.setupTomWrightTribalWars instanceof Array) {
            var callback = window.setupTomWrightTribalWars.shift();
            if (callback) {
                callback();
            }
        }
    }

    TomWrightTribalWars.internalSetup = function (callback) {
        var self = this;
        callback = callback || function(){};
        this.makeSetupTomWrightTribalWarsArray();
        window.setupTomWrightTribalWars.push(function () {
            callback();
        });
        self.iterateThroughSetup();
    }

    TomWrightTribalWars.requireInternalScript = function (script, callback) {
        var self = this;
        callback = callback || function(){};

        self.includeInternalScript(script);

        var intervalId = window.setInterval(function() {
            if (self.hasLoadedScript(script)) {
                window.clearInterval(intervalId);
                callback();
            }
        }, 3);
    };

    TomWrightTribalWars.addLoadedScript = function (script) {
        if (! this.hasLoadedScript(script)) {
            this.loadedScripts.push(script);
        }
    };

    TomWrightTribalWars.hasLoadedScript = function (script) {
        return ((this.loadedScripts.indexOf(script)) >= 0);
    };

    TomWrightTribalWars.appendScriptToHead = function (scriptUrl, callback) {
        callback = callback || function(){};
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = scriptUrl;
        s.onload = callback;
        document.getElementsByTagName('head')[0].appendChild(s);
    };

    TomWrightTribalWars.includeInternalScript = function (scriptName, callback) {
        callback = callback || function(){};
        if (! this.hasLoadedScript(scriptName)) {
            this.appendScriptToHead('https://tw.tomwright.me/js/' + scriptName, callback);
        } else {
            callback();
        }
    };

    TomWrightTribalWars.showAlert = function (text, type, timer) {
        var timer = timer || 3000;
        var type = type || 'success';
        UI.InfoMessage(text, timer, type);
    };

    TomWrightTribalWars.showNotification = function (title, text, timer, pos) {
        var timer = timer || null;
        if (timer != null && timer < 1000) {
            timer = 1000;
        }
        var pos = pos || 'bottomRight';
        var div = document.createElement('div');
        var guid = TomWrightTribalWars.guid();

        div.style.width = '350px';
        div.style.height = 'auto';
        div.style.position = 'fixed';
        switch (pos) {
            case 'bottomLeft':
                div.style.left = '0';
                div.style.bottom = '30px';
                break;
            case 'bottomRight':
                div.style.right = '0';
                div.style.bottom = '30px';
                break;
            case 'topLeft':
                div.style.left = '0';
                div.style.top = '52px';
                break;
            case 'topRight':
                div.style.right = '0';
                div.style.top = '52px';
                break;
        }
        div.style.border = '1px solid #8c5f0d';
        div.style.backgroundColor = '#f4e4bc';
        div.style.zIndex = '100';
        div.style.padding = '5px';
        div.id = 'TomWrightTribalWarsNotification-' + guid;
        div.innerHTML = "<h1>" + title + "</h1><p>" + text + "</p><p><small>Click to hide</small></p>";

        document.getElementsByTagName('body')[0].appendChild(div);

        div.addEventListener('click', function (e) {
            TomWrightTribalWars.hideNotification(this.id);
        });

        if (timer != null) {
            setTimeout(function () {
                TomWrightTribalWars.hideNotification('TomWrightTribalWarsNotification-' + guid);
            }, timer);
        }
    };

    TomWrightTribalWars.hideNotification = function (id) {
        var div = document.getElementById(id);
        div.parentNode.removeChild(div);
    };

    TomWrightTribalWars.guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    TomWrightTribalWars.isCurrentScreen = function (screen, mode) {
        var mode = mode || '';
        if (game_data.screen != screen) {
            return false;
        } else if (mode.length > 0 && game_data.mode != mode) {
            return false;
        }
        return true;
    };

    TomWrightTribalWars.requireScreen = function (screen, mode) {
        var mode = mode || '';
        if (! this.isCurrentScreen(screen, mode)) {
            TomWrightTribalWars.goToScreen(screen, mode);
            return false;
        }
        return true;
    };

    TomWrightTribalWars.goToScreen = function (screen, mode, newWindow, params) {
        var mode = mode || '';
        var newWindow = newWindow || false;
        var link = game_data.link_base_pure + screen;
        params = params || {};
        if (mode.length > 0) {
            link += '&mode=' + mode;
        }
        for (var paramName in params) {
            link += '&' + paramName + '=' + params[paramName];
        }
        TomWrightTribalWars.showAlert('Going to the ' + screen + '...');

        if (newWindow) {
            window.open(link, '_blank');
        } else {
            window.location = link;
        }
    };

    TomWrightTribalWars.getContentOfElementById = function (elementId) {
        var element = document.getElementById(elementId);
        var result = null;
        if (element != null) {
            result = element.innerHTML;
        }
        return result;
    };

    TomWrightTribalWars.getServerTime = function () {
        return this.getContentOfElementById('serverTime');
    };

    TomWrightTribalWars.getServerDate = function () {
        return this.getContentOfElementById('serverDate');
    };

    TomWrightTribalWars.getServerDateTime = function () {
        return this.getServerTime() + ' ' + this.getServerDate();
    };

    TomWrightTribalWars.appendTextArea = function (afterClass, mode) {
        var textAreaHtml = "<textarea style='display: block; width: 300px; height: 200px;' class='inserted-text-area'></textarea>";
        return this.appendHtml(textAreaHtml, afterClass, mode);
    };

    TomWrightTribalWars.appendHtml = function (html, selector, mode) {
        mode = mode || 'insertAfter';
        var $element = $(html);
        $selector = $(selector);
        switch (mode) {
            case 'insertAfter':
                $element.insertAfter($selector);
                break;

            case 'appendChild':
                $selector.appendChild($element);
                break;

            case 'append':
                $selector.append($element);
                break;
        }
        return $element;
    };

    TomWrightTribalWars.loadUrlElement = function (url, id, data, complete) {
        var idHtml = '';
        complete = complete || function () {};
        data = data || '';
        if (id) {
            idHtml = ' id="' + id + '"';
        }
        var $element = this.appendHtml('<div ' + idHtml + ' style="display: none;"></div>', 'body', 'append');
        $element.load(url, data, complete);
        return $element;
    };

    TomWrightTribalWars.pad = function (num, size){ return ('00000000' + num).substr(-size); }

    TomWrightTribalWars.formatMinutesToHHMMSS = function (input) {
        var hours = input / 60;
        if (hours > 0) {
            hours = Math.floor(hours);
        }
        var minutes = input - (hours * 60);
        var floorMinutes = Math.floor(minutes);
        var seconds = Math.floor((minutes - floorMinutes) * 60);
        minutes = floorMinutes;
        console.log(hours, minutes, seconds);
        hours = TomWrightTribalWars.pad(hours, 2);
        minutes = TomWrightTribalWars.pad(minutes, 2);
        seconds = TomWrightTribalWars.pad(seconds, 2);
        
        return hours + ":" + minutes + ":" + seconds;
    }

    TomWrightTribalWars.findGetParameter = function (parameterName) {
        var result = null,
            tmp = [];
        var items = location.search.substr(1).split("&");
        for (var index = 0; index < items.length; index++) {
            tmp = items[index].split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        }
        return result;
    }

};