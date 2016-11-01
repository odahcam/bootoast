# Bootify
## A [*Boot*][0]strap 3 Not[*ify*][1]ing Plugin
Floating page push notifications with **Bootstrap 3**.

[0]: getbootstrap.com.br
[1]: github.com/odahcam/bootify

### Default options

    {
        message: 'Helo!',
        type: 'info',
        position: 'bottom-center',
        icon: undefined,
        timeout: false,
        animationDuration: 300,
        dismissable: true
    }

#### Message

Any HTML String!

**AKA** content || text || message

#### Type

A raw string that can be any of Bootstrap 3 alert type classes without the `alert-` preffix:

 - info
 - success
 - warning
 - danger

#### Position

A raw string with two segments of align separated by hypehn: `vertical-horizontal`

##### Position Sinonymus

 - `'bottom' === 'bottom-center'`
 - `'left-bottom' === 'bottom-left'`
 - `'right-bottom' === 'bottom-right'`
 - `'top' === 'top-center'`
 - `'right-top' === 'top-right'`
 - `'left-top' === 'top-left'`
       
##### Position Supported

    [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-right'
    ]

#### Icon

An icon following the standard Bootstrap 3 glyphicons name without the `glyphicon-` preffix.

By default, if it's not defined, it will turn into an icon choosen by the type:

    {
        warning: 'exclamation-sign',
        success: 'ok-sign',
        danger: 'remove-sign',
        info: 'info-sign'
    }
    
    
    
#### Timeout

The time in seconds for hide the notification (`.alert` element).

If `false` or `0`, the notification will not auto-hide. 

#### Animation Duration

The notification hide animation duration in milliseconds (`ms`).

#### Dismissable

Shows or hides the dismiss &times; button. It can be `true` or `false`.

----

Good Luck.
