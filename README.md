# Share It

Share It — Simple JS library for create sharing buttons with counters. The JavaScript library is written **without using JQuery** or any other tools / frameworks.

How supported:

 - VKontakte
 - Facebook
 - LinkedIn
 - Google Plus
 - Twitter
 - Pinterest
 - Mail.ru
 - Odnoklassniki
 - Tumblr

You can see online demo - [https://distroid.github.io/share-it/](https://distroid.github.io/share-it/)

## Usage

Add HTML code to your page

```html
<div data-url="https://github.com/" class="share-it-buttons">
  <div class="vkontakte"></div>
  <div class="linkedin"></div>
  <div class="facebook"></div>
  <div class="twitter"></div>
  <div class="google-plus"></div>
  <div class="mailru"></div>
  <div class="odnoklassniki"></div>
  <div data-media="https://code-bit.com/social.png" class="pinterest"></div>
</div>
```

You can init widget by two ways:

1. Include JS script to footer your page or after widget code, widget will generate automatically.
2. Include JS script on `<HEAD>` with other scripts and for init widget use constructor.
```javascript
<script type="text/javascript">
    new window.ShareIt()
</script>
```

Widget theme — Minimal color

![enter image description here](https://code-bit.com/social.png?v=1.0.3)

## Options

For add parameters to widget need add attrubute `data-<parameter>`

### Base widget parameters

Can be redefined for specific button


 Parameter      | Values            | Description                                       | Default
----------------|:------------------|:--------------------------------------------------|:----------------
`url`           | string            | Page url                                          | window.location
`counters`      | true \| false     | Use sharing counters                              | true
`titles`        | true \| false     | Is add html attribute `title="Share to <social>"` | true
`description`   | string            | Page description                                  | page title

### Buttons parameters

You can use attribute `data-text="Button text"` for specific button for replace custom button text.

#### VKontakte

Parameter     | Values        | Description
--------------|:--------------|:------------------
`url`         | string        | Page url for share
`title`       | string        | Post title
`description` | string        | Post text
`image`       | string        | Url to image
`noparse`     | true \| false |
`no_vk_links` | integer [0,1] |

[See more](https://vk.com/dev/widget_share?f=4.%20%D0%94%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B8) in official documentation.

#### Facebook

Parameter     | Values        | Description
--------------|:--------------|:------------------
`url`         | string        | Page url for share
`title`       | string        | Post title
`description` | string        | Post text
`picture`     | string        | Url to image


[See more](https://developers.facebook.com/docs/plugins/share-button) in official documentation.

#### LinkedIn

Parameter     | Values        | Description
--------------|:--------------|:------------------
`url`         | string        | Page url for share
`title`       | string        | Post title
`description` | string        | Post text

#### Google Plus

Parameter     | Values        | Description
--------------|:--------------|:------------------
`url`         | string        | Page url for share

[See more](https://developers.google.com/+/plugins/share/#sharelink) in official documentation.

#### Twitter

Parameter     | Values        | Description
--------------|:--------------|:------------------
`url`         | string        | Page url for share
`title`       | string        | Post title
`description` | string        | Post text
`hashtags`    | string        | List of tags (example,demo)
`screen_name` | string        | Address the Tweet to a specific user.
`via`         | string        | Attribute the source of a Tweet to a Twitter username
`related`     | string        | List of accounts related to the content of the shared URI.


[See more](https://dev.twitter.com/web/tweet-button/parameters) in official documentation.

#### Pinterest

Parameter     | Values        | Description
--------------|:--------------|:---------------------------------
`media`       | string        | Url to image  (***requred***)
`description` | string        | Post text

#### Mail.ru

Parameter     | Values        | Description
--------------|:--------------|:------------------
`url`         | string        | Page url for share
`title`       | string        | Post title
`description` | string        | Post text
`image_url`   | string        | Url to image
`swfurl`      | string        | Url to Flash-movie
`width`       | string        | Video width
`height`      | string        | Video height

[See more](http://api.mail.ru/sites/plugins/share/extended/) in official documentation.

#### Odnoklassniki

Parameter     | Values        | Description
--------------|:--------------|:------------------
`url`         | string        | Page url for share
`title`       | string        | Post title
`description` | string        | Post text

#### Tumblr

Parameter     | Values        | Description
--------------|:--------------|:------------------
`url`         | string        | Page url for share
`title`       | string        | Post title

[See more](https://www.tumblr.com/docs/en/share_button) in official documentation.

## Contributions

1. Fork the project
2. Make your feature addition or bug fix
3. Send me a pull request on Github

For compilation in root folder use command:

`coffee --watch --compile --output lib/ src/`

And for create min JS files:

`gulp watch`

## License

Share-It is released under the [MIT License](http://www.opensource.org/licenses/MIT).
