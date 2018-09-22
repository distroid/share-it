window.ShareIt = class ShareIt
  constructor: () ->
    window.sharingButtons = {} if !window.sharingButtons?
    @clearWidgets()
    @init()

  # Basic button options
  options =
    'url'            : window.location.href.replace(window.location.hash, ''),
    'title'          : document.title,
    'counters'       : true,
    'titles'         : true,
    'window'         : false,
    'button_title'   : 'Share to '
    'scheme'         : window.location.protocol.replace(':', '')

  window.VK = {} unless window.VK?
  window.VK.Share =
    count: (idx, number) ->
      script = document.getElementById("vkontakte-#{idx}-init-script");
      script.remove() if script?
      createButtonCounter(document.getElementById("vkontakte-button-#{idx}"), number)

  window.ODKL =
    updateCount: (idx, number) ->
      script = document.getElementById("odnoklassniki-#{idx}-init-script");
      script.remove() if script?
      createButtonCounter(document.getElementById("odnoklassniki-button-#{idx}"), number)

  # Supported services
  services =
    'linkedin':
      'url'         : 'https://www.linkedin.com/shareArticle?url={{url}}&title={{title}}&summary={{description}}'
      'counter_url' : 'https://www.linkedin.com/countserv/count/share?format=jsonp&url={{url}}'
      'counter'     : 0
      'title'       : 'LinkedIn'
      'attributes'  : ['title', 'text', 'description']

    'vkontakte':
      'url'              : 'https://vk.com/share.php?url={{url}}&title={{title}}'
      'counter_url'      : 'https://vk.com/share.php?url={{url}}&act=count&index={{index}}'
      'counter'          : 0
      'title'            : 'ВКонтакте'
      'attributes'       : ['title', 'text']
      'skip_gen_callback': true

    'facebook':
      'url'         : 'https://www.facebook.com/sharer/sharer.php?u={{url}}&title={{title}}'
      'counter_url' : 'https://graph.facebook.com/?id={{url}}'
      'type'        : 'ajax'
      'title'       : 'Facebook'
      'attributes'  : ['title', 'text']
      'getter'      : (type, element, counterUrl, url) ->
        ajax.get(counterUrl, [], services[type]['callback'], true, element: element)
      'callback'    : (response, opt) ->
        response = JSON.parse(response || '{}')
        if response.share? && response.share.share_count?
          createButtonCounter(opt.element, response.share.share_count)

    'twitter':
      'url'         : 'https://twitter.com/intent/tweet?url={{url}}&text={{title}}'
      'counter_url' : 'https://opensharecount.com/count.json?url={{url}}'
      'counter'     : 0
      'type'        : 'ajax'
      'title'       : 'Twitter'
      'attributes'  : ['title', 'text']
      'getter'      : (type, element, counterUrl, url) ->
        ajax.get(counterUrl, [], services[type]['callback'], true, element: element)
      'callback'    : (response, opt) ->
        response = JSON.parse(response || '{}')
        if typeof response.count != 'undefined'
          createButtonCounter(opt.element, response.count)

    'google-plus':
      'url'         : 'https://plus.google.com/share?url={{url}}'
      'counter_url' : 'https://clients6.google.com/rpc'
      'type'        : 'ajax'
      'counter'     : 0
      'title'       : 'Google+'
      'attributes'  : ['title', 'text']
      'getter' : (type, element, counterUrl, url) ->
        params =
          'method'     : 'pos.plusones.get',
          'id'         : "#{type}-button-#{window.sharingButtons[type]}",
          'jsonrpc'    : '2.0',
          'key'        : 'p',
          'apiVersion' : 'v1'
          'params'     :
            'nolog'    : true
            'id'       : url
            'source'   : 'widget'
            'userId'   : '@viewer'
            'groupId'  : '@self'
        element.setAttribute('id', "#{type}-button-#{window.sharingButtons[type]}")
        ajax.post(services[type]['counter_url'], params, services[type]['callback'], true)
      'callback' : (response) ->
        response = JSON.parse(response || '{}')
        return unless response.result.metadata.globalCounts.count?
        createButtonCounter(document.getElementById(response.id), response.result.metadata.globalCounts.count)

    'pinterest':
      'url'         : 'https://pinterest.com/pin/create/button/?description={{title}}'
      'counter_url' : 'https://api.pinterest.com/v1/urls/count.json?url={{url}}'
      'counter'     : 0
      'title'       : 'Pinterest'
      'attributes'  : ['title', 'text']

    'mailru':
      'url'           : 'https://connect.mail.ru/share?url={{url}}&title={{title}}&description={{description}}'
      'counter_url'   : "#{options.scheme}://connect.mail.ru/share_count?callback=1&url_list={{url}}"
      'counter'       : 0
      'title'         : 'Mail.ru'
      'callback_param': 'func'
      'attributes'    : ['title', 'text', 'description']

    'odnoklassniki':
      'url'              : 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl={{url}}&st.title={{title}}&st.description={{description}}'
      'counter_url'      : "#{options.scheme}://connect.ok.ru/dk?st.cmd=extLike&ref={{url}}&uid={{index}}"
      'counter'          : 0
      'title'            : 'Odnoklassniki'
      'attributes'       : ['title', 'text']
      'skip_gen_callback': true

    'tumblr':
      'url'              : 'http://tumblr.com/widgets/share/tool?canonicalUrl={{url}}&title={{title}}'
      'counter_url'      : "#{options.scheme}://api.tumblr.com/v2/share/stats?url={{url}}"
      'counter'          : 0
      'title'            : 'Tumblr'
      'attributes'       : ['title', 'text']

  # Init methods for ajax
  ajax   = {}
  ajax.x = () ->
    return new XMLHttpRequest if XMLHttpRequest?
    versions = [
      'MSXML2.XmlHttp.6.0',
      'MSXML2.XmlHttp.5.0',
      'MSXML2.XmlHttp.4.0',
      'MSXML2.XmlHttp.3.0',
      'MSXML2.XmlHttp.2.0',
      'Microsoft.XmlHttp'
    ]

    xhr = null
    for i in versions
      try
        xhr = new ActiveXObject(versions[i])
        break
    return xhr

  ajax.send = (url, callback, method, data, sync, params) ->
    x = ajax.x()
    x.open(method, url, sync)
    x.onreadystatechange = () ->
      callback(x.responseText, params) if x.readyState == 4

    if method == 'POST'
      x.setRequestHeader('Content-type', 'application/json')

    x.send(data)

  ajax.get = (url, data, callback, sync, params) ->
    query = []
    for key of data
      query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))

    url += '?' + query.join('&') if query.length
    ajax.send(url, callback, 'GET', null, sync, params)

  ajax.post = (url, data, callback, sync, params) ->
    query = []
    ajax.send(url, callback, 'POST', JSON.stringify(data), sync, params)

  # Remove all already existing widgets
  clearWidgets: () ->
    return unless document.querySelectorAll(".share-it-widget")?
    for element in document.querySelectorAll(".share-it-widget")
      element.classList.remove("share-it-widget")

  # Init widgets
  init: () ->
    for typeService of services
      elements = document.querySelectorAll(".share-it-buttons .#{typeService}")
      continue unless elements.length
      @initTypeButtons(elements, typeService)

  # Init buttons by type
  initTypeButtons: (elements, type) ->
    for i in [0...elements.length]
      @button(elements.item(i), type)

  # Constructor for the button
  button: (element, type) ->
    return if !element? || element.classList.contains("share-it-widget")

    # Create icon
    img = document.createElement("span")
    img.className = 'share-icon'

    # Create button
    btn  = document.createElement("span")
    url  = @getShareUrl(type, element)
    text = document.createTextNode(element.dataset.text || services[type]['title'])
    btn.className = 'sharing-button'
    btn.appendChild(text)

    # Create widget - button and icon
    element.innerHTML = '';
    if element.parentElement.dataset.titles == 'true' || options.titles && !element.parentElement.dataset.titles?
      element.title = element.getAttribute('title') || options.button_title + services[type]['title']
    element.className += ' share-it-widget'
    windowOptions = @generateWindowOptions(element)
    element.onclick = () ->
      window.open(url, '', windowOptions);
    element.appendChild(img)
    element.appendChild(btn)

    shareUrl = element.dataset.url || element.parentElement.dataset.url || options.url
    if element.parentElement.dataset.counters == 'true' || options.counters && !element.parentElement.dataset.counters?
      window.sharingButtons[type] = 0 unless window.sharingButtons[type]?
      @createCounter(type, element, shareUrl)

  # Get url for share
  getShareUrl: (type, element, title) ->
    url = element.dataset.url || element.parentElement.dataset.url || options.url
    title = element.dataset.title || element.parentElement.dataset.title || options.title
    description = element.dataset.description || element.parentElement.dataset.description || title

    url = 'http://' + url if !/^(https?):\/\//i.test(url) && 'http://'.indexOf(url) == -1

    baseUrl = services[type]['url']
    baseUrl = baseUrl.replace('{{url}}', url) if url?
    baseUrl = baseUrl.replace('{{title}}', encodeURIComponent(title)) if title?
    baseUrl = baseUrl.replace('{{description}}', encodeURIComponent(description)) if description?

    # Add params to sharing url
    params = []
    for param of element.dataset
      continue if services[type]['attributes']? && param in services[type]['attributes']
      params.push([param, element.dataset[param]].join('='))

    baseUrl += '&' + params.join('&') if params.length
    return baseUrl

  # Create counter for the button
  createCounter: (type, element, url) ->
    return if !services[type]['counter_url']? || services[type]['counter_url'].length == 0

    url = 'http://' + url if !/^(https?):\/\//i.test(url) && 'http://'.indexOf(url) == -1

    counterUrl = services[type]['counter_url']
    counterUrl = counterUrl.replace('{{url}}', encodeURIComponent(url)) if url?

    window.sharingButtons[type]++
    if services[type]['type']? && services[type]['type'] == 'ajax'
      services[type]['getter'](type, element, counterUrl, url)
    else
      @createScript(type, element, counterUrl, url)

  # Create script for get sharing count
  createScript: (type, element, counterUrl, url) ->
    counterUrl = counterUrl.replace('{{index}}', window.sharingButtons[type])
    element.setAttribute('id', "#{type}-button-#{window.sharingButtons[type]}")

    # generate callback
    unless services[type]['skip_gen_callback']? && services[type]['skip_gen_callback']
      generateCallbackScript(type, window.sharingButtons[type], url)

    script      = document.createElement('script')
    script.type = 'text/javascript'
    script.id   = "#{type}-#{window.sharingButtons[type]}-init-script"

    param = if services[type]['callback_param']? then services[type]['callback_param'] else 'callback'

    script.setAttribute('src', "#{counterUrl}&#{param}=#{type}_#{window.sharingButtons[type]}_callback")
    element.appendChild(script)

  # Generate window options
  generateWindowOptions: (element) ->
    return '' unless options.window || element.parentElement.dataset.window == 'true'

    width = 626
    height = 436
    top = screen.height / 2 - (width / 2)
    left = screen.width / 2 - (height / 1.5)

    "toolbar=0,status=0,width=#{width},height=#{height},top=#{top},left=#{left}"

  # Generate button counter
  createButtonCounter = (element, count) ->
    return if count <= 0
    counter = document.createElement('span')
    counter.className = 'sharing-couter'
    counter.appendChild(document.createTextNode(count))
    element.appendChild(counter)

  # Generate callback for get sharing count
  generateCallbackScript = (type, number, url) ->
    script      = document.createElement('script')
    script.type = 'text/javascript'
    script.id   = "#{type}-#{number}-script"
    code        = [
      "function #{type}_#{number}_callback(data) {",
      "if (typeof data.response != 'undefined' && typeof data.response.note_count != 'undefined')"
      "{ data.count = data.response.note_count; }"
      "if (typeof data['#{url}'] != 'undefined' && typeof data['#{url}']['shares'] != 'undefined')"
      "{ data.count = data['#{url}']['shares']; }"
      "if (typeof data.count != 'undefined' && data.count > 0) {",
      "var counter = document.createElement('span'); counter.className = 'sharing-couter';",
      "counter.appendChild(document.createTextNode(data.count));",
      "document.getElementById('#{type}-button-#{number}').appendChild(counter); }",
      "document.getElementById('#{type}-#{number}-init-script').remove();",
      "document.getElementById('#{type}-#{number}-script').remove();}"
      ].join(" ")
    try
      script.appendChild(document.createTextNode(code));
      document.body.appendChild(script);
    catch e
      script.text = code;
      document.body.appendChild(script);

new ShareIt()
