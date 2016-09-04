angular.module('sharingButton').controller('mainController', ['$scope', function($scope) {

    $scope.sharing = {
        'media': {
            'vkontakte': {
                'domain'     : 'vk.com',
                'title'      : 'ВКонтакте',
                'selected'   : true,
                'active_tab' : false,
                'options'    : {},
            },
            'linkedin': {
                'domain'     : 'linkedin.com',
                'title'      : 'LinkedIn',
                'selected'   : true,
                'active_tab' : false,
                'options'    : {},
            },
            'facebook': {
                'domain'     : 'www.facebook.com',
                'title'      : 'Facebook',
                'selected'   : true,
                'active_tab' : true,
                'options'    : {},
            },
            'twitter': {
                'domain'     : 'twitter.com',
                'title'      : 'Twitter',
                'selected'   : true,
                'active_tab' : false,
                'options'    : {},
            },
            'google-plus': {
                'domain'     : 'plus.google.com',
                'title'      : 'Google+',
                'selected'   : true,
                'active_tab' : false,
                'options'    : {},
            },
            'pinterest': {
                'domain'     : 'www.pinterest.com',
                'title'      : 'Pinterest',
                'selected'   : true,
                'active_tab' : false,
                'options'    : {},
            },
        },
        'options': {
            'url'      : '',
            'title'    : '',
            'counters' : true
        },
        'media_options': {
            'twitter' : {
                'title' : {'value': '', 'title': 'Page title', 'placeholder': 'The title of the page for a button'},
                'text'  : {'value': '', 'title': 'Button text', 'placeholder': 'It replaces the default button text'},
                'via'   : {'value': '', 'title': 'Twitter username', 'placeholder': 'Tweet to a Twitter username'},
                'hashtags' : {'value': '', 'title': 'Hashtags', 'placeholder': 'List of hashtags'},
            },
            'facebook' : {
                'title' : {'value': '', 'title': 'Page title', 'placeholder': 'The title of the page for a button'},
                'text'  : {'value': '', 'title': 'Button text', 'placeholder': 'It replaces the default button text'},
            },
            'google-plus' : {
                'title' : {'value': '', 'title': 'Page title', 'placeholder': 'The title of the page for a button'},
                'text'  : {'value': '', 'title': 'Button text', 'placeholder': 'It replaces the default button text'},
            },
            'vkontakte' : {
                'title' : {'value': '', 'title': 'Page title', 'placeholder': 'The title of the page for a button'},
                'text'  : {'value': '', 'title': 'Button text', 'placeholder': 'It replaces the default button text'},
                'image' : {'value': '', 'title': 'Photo url', 'placeholder': 'The url for image'},
                'description' : {'value': '', 'title': 'Description', 'placeholder': 'It replaces the default description text'},
            },
            'linkedin' : {
                'title' : {'value': '', 'title': 'Page title', 'placeholder': 'The title of the page for a button'},
                'text'  : {'value': '', 'title': 'Button text', 'placeholder': 'It replaces the default button text'},
                'description' : {'value': '', 'title': 'Description', 'placeholder': 'It replaces the default description text'},
            },
            'pinterest' : {
                'title' : {'value': '', 'title': 'Page title', 'placeholder': 'The title of the page for a button'},
                'text'  : {'value': '', 'title': 'Button text', 'placeholder': 'It replaces the default button text'},
                'media' : {'value': '', 'title': 'Photo url', 'placeholder': 'The url for image (required field)'},
            },
        },
        'block_options'   : {},
        'service_options' : {},
        'time_check'      : 1000,
        'stack'           : '',
        'stack_init'      : '',
        'code'            : '',
        'css_filename'    : 'style',
        'themes'          : [
            {'value': 'default',       'title': 'Default'},
            {'value': 'minimal-color', 'title': 'Minimal color'},
            {'value': 'minimal',       'title': 'Minimal'},
            {'value': 'transparent',   'title': 'Transparent'}
        ],
        'button_theme': 'default',
        'is_additional_options': false,
    };

    $scope.init_request_stack = function() {
        if ($scope.stack_init) {
            return;
        }
        $scope.stack = _.debounce(function() {
            $scope.$apply(function() {
                $scope.generate_block_options();
                $scope.generate_media_options();
                $scope.generate_code();
                $scope.reinit();
            });
        }, $scope.sharing.time_check);
        $scope.stack_init = true;
    };

    $scope.$watch("sharing.options", function() {
        $scope.init_request_stack();
        $scope.stack();
    }, true);

    $scope.$watch("sharing.media_options", function() {
        $scope.init_request_stack();
        $scope.stack();
    }, true);

    $scope.generate_code = function() {
        button_block_code           = document.createElement("div");
        button_block_code.className = 'share-it-buttons';

        for (param in $scope.sharing.options) {
            if ($scope.sharing.options[param] === null || $scope.sharing.options[param].length === 0) {
                continue;
            }
            button_block_code.dataset[param] = $scope.sharing.options[param];
        }

        for (media in $scope.sharing.media) {
            if ($scope.sharing.media[media].selected) {
                button_block_code.innerHTML += '\n\t';
                button                      = document.createElement("div");
                button.className            = media;

                for (attr in $scope.sharing.media[media].options) {
                    if ($scope.sharing.media[media].options[attr].length === 0) {
                        continue;
                    }
                    new_attr                 = attr.replace("data-", "");
                    button.dataset[new_attr] = $scope.sharing.media[media].options[attr];
                }

                button_block_code.appendChild(button);
            }
        }

        script      = document.createElement("script");
        script.type = 'text/javascript';
        script.src  = window.location.origin + url_prefix + js_path;

        link     = document.createElement("link");
        link.rel = 'stylesheet';
        filename = $scope.sharing.css_filename;
        if ($scope.sharing.button_theme !== 'default') {
            filename += "-" + $scope.sharing.button_theme;
        }
        link.href = window.location.origin + url_prefix + css_path + filename + ".css";

        button_block_code.innerHTML += '\n';

        $scope.sharing.code = link.outerHTML + '\n\n' + button_block_code.outerHTML + '\n\n' + script.outerHTML;
    };

    $scope.generate_media_options = function() {
        for (media in $scope.sharing.media) {
            media_options = {};
            for (attr in $scope.sharing.media_options[media]) {
                media_options["data-" + attr] = $scope.sharing.media_options[media][attr].value;
            }
            $scope.sharing.media[media].options = media_options;
        }
    };

    $scope.generate_block_options = function() {
        options     = $scope.sharing.block_options;
        new_options = {};
        for (attr in $scope.sharing.options) {
            options_attr = "data-" + attr;
            if (options[options_attr] != undefined && $scope.sharing.options[attr] == options[options_attr]) {
                continue;
            }
            else {
                new_options[options_attr] = $scope.sharing.options[attr];
            }
        }
        $scope.update_block_options(new_options);
    };

    $scope.check_counters = function() {
        $scope.update_block_options({"data-counters": $scope.sharing.options.counters});
        $scope.generate_code();
    };

    $scope.is_active_tab = function(type) {
        if (typeof $scope.sharing.media[type] !== 'undefined' && $scope.sharing.media[type].active_tab) {
            return "active";
        }
    };

    $scope.activate_tab = function(type) {
        if (typeof $scope.sharing.media[type] !== 'undefined') {
            for (media in $scope.sharing.media) {
                $scope.sharing.media[media].active_tab = false;
            }
            $scope.sharing.media[type].active_tab = true;
        }
    };

    $scope.selected_media = function(selected) {
        if (selected) {
            $scope.reinit();
        }
        $scope.generate_code();
    };

    $scope.change_styles = function() {
        filename = $scope.sharing.css_filename;
        if ($scope.sharing.button_theme !== 'default') {
            filename += "-" + $scope.sharing.button_theme;
        }

        style           = document.getElementById("button_styles");
        style.className = "remove_old_style";
        style.removeAttribute("id");

        element      = document.createElement("link");
        element.href = "." + css_path + filename + ".css";
        element.id   = "button_styles";
        element.rel  = "stylesheet";
        base = document.getElementsByTagName("head");
        base[0].appendChild(element);

        setTimeout(function() {
            styles = document.getElementsByClassName("remove_old_style");
            for (style in styles) {
                if (!styles.length) {
                    continue;
                }
                styles[0].remove();
            }
        }, 400);
    };

    $scope.$watch("sharing.button_theme", function() {
       $scope.generate_code();
       $scope.change_styles();
    }, true);

    $scope.update_block_options = function(options) {
        old_values                   = $scope.sharing.block_options;
        for (attr in old_values) {
            if (options[attr] != undefined) {
                continue;
            }
            options[attr] = old_values[attr];
        }
        $scope.sharing.block_options = options;
    };

    $scope.reinit = function() {
        setTimeout(function() { new window.ShareIt() });
    };

    $scope.generate_code();

}]);
