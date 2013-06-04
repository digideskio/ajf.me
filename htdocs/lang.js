(function () {
    'use strict';

    var languages = {
            'en': 'English',
            'es': 'Español',
            'de': 'Deutsch'
        },
        currentLanguage = 'en',
        strings = {
            description: {
                en: "Hello, I'm Andrea. I live in Scotland and this is my website. I put the things I make here.",
                es: "Hola, soy Andrea. Vivo en Escocia y este es mi sitio web. Pongo aquí las cosas que hago.",
                de: "Hallo, Ich bin Andrea. Ich wohne in Schottland und dies ist meine Webseite. Hier platziere ich die Dinge, die ich mache."
            },
            about_me: {
                en: "About me",
                es: "Acerca de mí",
                de: "Über mich"
            },
            my_projects: {
                en: "My projects",
                es: "Mis proyectos",
                de: "Meine Projekte"
            },
            contact: {
                en: "Contact",
                es: "Contacto",
                de: "Kontakt"
            },
            see_also: {
                en: "See also",
                es: "Véase también",
                de: "Siehe auch"
            },
            friends_websites: {
                en: "Websites of friends hosted by me:",
                es: "Sitios web de amigos que alojo:",
                de: "Webseiten meiner Freunde, die ich hoste:"
            },
            bbcode: {
                en: "BBCode chat colour-coder",
                es: "Código BBCode de colores para registro de la charla",
                de: "BBCode Chat-Protokoll Farbcodierung"
            },
            websocket: {
                en: "WebSocket information page",
                es: "Página de información acerca de WebSocket",
                de: "WebSocket Informationsseite"
            }
        },
        get = document.getElementById.bind(document);

    function switchLanguage(language) {
        currentLanguage = language;
        document.documentElement.lang = language;

        Object.keys(strings).forEach(function (string) {
            var element;

            element = get('text-' + string);
            element.innerHTML = '';
            element.appendChild(document.createTextNode(strings[string][language]));
        });

        updateLanguageList();
    }

    function updateLanguageList() {
        var switcher, ul;

        switcher = get('language-switcher');
        switcher.innerHTML = '';

        ul = document.createElement('ul');
        Object.keys(languages).forEach(function (language) {
            var li;

            li = document.createElement('li');
            li.lang = language;
            li.className = 'language';
            if (language === currentLanguage) {
                li.className += ' language-current';
            }
            (function (language) {
                li.onclick = function () {
                    switchLanguage(language);
                };
            }(language));
            li.appendChild(document.createTextNode(languages[language]));
            ul.appendChild(li);
        });
        switcher.appendChild(ul);
    }

    function usePreferredLanguage() {
        var preferences, preference, i;

        // Relies on SSI in document body:
        // <script>HTTP_ACCEPT_LANGUAGE = '<!--#echo var="HTTP_ACCEPT_LANGUAGE" -->';</script>
        if (!window.hasOwnProperty('HTTP_ACCEPT_LANGUAGE')) {
            return false;
        }
        if (!HTTP_ACCEPT_LANGUAGE) {
            return false;
        }

        // Split into different languages (header is of format lang1,lang2,lang3,...)
        preferences = HTTP_ACCEPT_LANGUAGE.split(',');

        // Sort by preference
        preferences.sort(function (q1, q2) {
            var qFactor;

            // get quality factors (header is of format lang;q=NUM,lang2;q=NUM2,...)
            q1 = q1.split(';q=')[1] || 1; // assume q=1 if unspecified
            q2 = q2.split(';q=')[1];

            return q2 - q1;
        });

        console.log(preferences);

        for (i = 0; i < preferences.length; i++) {
            preference = preferences[i];

            // Remove extra data (lang;stuff, we only want lang)
            preference = preference.split(';')[0];

            // If this language is available, use it
            if (languages.hasOwnProperty(preference)) {
                switchLanguage(preference);
                break;
            } else {
                // Split off country code, if any
                preference = preference.split('-')[0];

                // Try again
                if (languages.hasOwnProperty(preference)) {
                    switchLanguage(preference);
                    break;
                }
            }
        }
    }

    window.onload = function () {
        updateLanguageList();
        usePreferredLanguage();
    };
}());
