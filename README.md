# WinIBW-Notify - Notify instead of messageBox

Notify adds comfort and flexibility to your WinIBW messages. Works together with Pref messageSliderPosition.

Messages will always be added to the activeWindow message stack.

Examples
--------

Run all tests from the WinIBW4 Script Manager or a script:

```javascript
// prefs.messageSliderPosition =  0
// do not show any popups
Notify.info('Be informed!'); // No popup, adds info message to activeWindow's message stack

// prefs.messageSliderPosition =  1
// only show popups for errors
Notify.error('That\'s an error', -1); // pops up an the error message until notified via click

// prefs.messageSliderPosition =  2
// only show popups for errors and warnings
Notify.error('That\'s an error'); // pops up an the error message until notified via click
Notify.warning('I warn you'); // pops up an the warning message for two seconds
Notify.warning('I warned you', 4); // pops up an the warning message for four seconds

// prefs.messageSliderPosition =  3
// always popups
Notify.error('That\'s an error'); // pops up an the error message until notified via click
Notify.warning('I warn you', 0); // no popup, adds info message to activeWindow's message stack
```

You can also use the more basic function ```Notify.popup``` like

```javascript
Notify.popup('Be warned!', 'Warning', 'warning-icon', 10); // pops up a warning message for 10 seconds if prefs.messageSliderPosition is 2 or 3
```

Define default seconds by setting profile parameters like:

```
notify.defaultSecondsFor_message-icon = 0 // no popup
notify.defaultSecondsFor_warning-icon = 2 // two seconds
notify.defaultSecondsFor_error-icon = -1 // until notify by click
```