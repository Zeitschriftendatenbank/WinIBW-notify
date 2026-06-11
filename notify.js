var Notify = {
    _sh: null,
    default_error_seconds: -1,
    default_warning_seconds: 2,
    default_info_seconds: 2,
    _defaultSeconds: function(typeName){
                var defaultSeconds;
        switch (getProfileInt('prefs', 'messageSliderPosition', 0)) {
            case 0: // do not show popup, only append to message stack
                defaultSeconds = 0;
                break;
            case 2: // do only show popup for warnings and errors
                defaultSeconds = (typeName === 'error-icon') ? this.default_error_seconds : 
                    (typeName === 'warning-icon') ? this.default_warning_seconds : 0;
                break;
            case 3: // show popup for all types
                defaultSeconds = (typeName === 'error-icon') ? this.default_error_seconds : 
                    (typeName === 'warning-icon') ? this.default_warning_seconds : 
                        (typeName === 'message-icon' || typeName === 'question-icon') ? this.default_info_seconds : 0;
                break;
            default: // do only show popup for errors
                defaultSeconds = (typeName === 'error-icon') ? this.default_error_seconds : 0;
        }
        return defaultSeconds;
    },
    _getShell: function () {
        if (this._sh) return this._sh;
        if (typeof ActiveXObject !== 'undefined') {
            try {
                this._sh = new ActiveXObject('WScript.Shell');
            } catch (e) {
                this._sh = null;
            }
        }
        return this._sh;
    },
    popup: function (text, header, type, seconds) {
        var icons_numbers = { 'message-icon': 64, 'warning-icon': 48, 'error-icon': 16, 'question-icon': 32 };
        var numbers_icons = { 64: 'message-icon', 48: 'warning-icon', 16: 'error-icon', 32: 'question-icon' };
        var icon_code = { 'message-icon': 3, 'warning-icon': 2, 'error-icon': 1, 'question-icon': 3 };
        var icon, code;

        var typeName;
        switch (typeof type) {
            case 'string':
                typeName = type;
                icon = icons_numbers[typeName] || 64;
                code = icon_code[typeName] || 3;
                break;
            case 'number':
                typeName = numbers_icons[type] || 'message-icon';
                icon = icons_numbers[typeName] || 64;
                code = icon_code[typeName] || 3;
                break;
            default:
                typeName = 'message-icon';
                icon = 64;
                code = 3;
        }

        var defaultSeconds;
        switch (typeName) {
            case 'error-icon':
            case 'question-icon':
                defaultSeconds = getProfileInt('notify', 'defaultSecondsFor' + typeName, this.default_error_seconds);
                break;
            case 'warning-icon':
                defaultSeconds = getProfileInt('notify', 'defaultSecondsFor' + typeName, this.default_warning_seconds);
                break;
            default:
                defaultSeconds = getProfileInt('notify', 'defaultSecondsFor' + typeName, this.default_info_seconds);
        }

        if (typeof seconds !== 'number') {
            seconds =  this._defaultSeconds(typeName);
        }


        // always append message to message stack of active window
        activeWindow.appendMessage(text, code);
        // Behavior:
        //  - seconds === -1 => show a messageBox (must be clicked to close)
        //  - seconds === 0 => no popup (only append to message stack)
        //  - seconds > 0 => show a timed popup for `seconds` seconds (if WScript.Shell available)

        if (seconds === -1) {
            // show modal messageBox that requires user to click to dismiss
            messageBox(header || 'Notification', text, icon);
        } else if (typeof seconds === 'number' && seconds > 0) {
            var sh = this._getShell();
            if (sh) {
                // Popup(text, seconds, title, type)
                sh.Popup(text, seconds, header || 'Notification', icon);
                return;
            }
            // fallback when WScript.Shell not available: show messageBox (will require click)
            messageBox(header || 'Notification', text, icon);
        }
    },
    error: function (text, seconds) {
        this.popup(text, 'Error', 'error-icon', seconds);
    },
    warning: function (text, seconds) {
        this.popup(text, 'Warning', 'warning-icon', seconds);
    },
    info: function (text, seconds) {
        this.popup(text, 'Information', 'message-icon', seconds);
    }
};