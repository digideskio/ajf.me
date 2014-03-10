(function () {
    'use strict';

    // .bind() shim for Opera Mini
    function bind (what, to) {
        if (what.hasOwnProperty('bind')) {
            return what.bind(to);
        } else {
            return function () {
                return what.apply(to, arguments);
            };
        }
    }

    // Object.keys() shim for Opera Mini
    if (!Object.hasOwnProperty('keys')) {
        Object.keys = function (obj) {
            var keys = [], name;
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    keys.push(name);
                }
            }
            return keys;
        };
    }

    var languages = {
            'en': 'English',
            'de': 'Deutsch',
            'es': 'Español',
            'fr': 'Français'
        },
        currentLanguage = 'en',
        strings = {
            description: {
                en: "Hello, I'm Andrea. I live in Scotland and this is my website. I put the things I make here.",
                de: "Hallo, ich bin Andrea. Ich wohne in Schottland und dies ist meine Webseite. Hier platziere ich die Dinge, die ich mache.",
                es: "Hola, soy Andrea. Vivo en Escocia y este es mi sitio web. Pongo aquí las cosas que hago.",
                fr: "Bonjour, je suis Andrea. J'habite en Écosse et c'est mon site web. Je mets ici les choses que je fais."
            },
            about_me: {
                en: "About me",
                de: "Über mich",
                es: "Acerca de mí",
                fr: "À propos de moi"
            },
            my_projects: {
                en: "My projects",
                de: "Meine Projekte",
                es: "Mis proyectos",
                fr: "Mes projets"
            },
            projects_developer: {
                en: "Projects I am a developer of",
                de: "Ich bin Entwickler für diese Projekte",
                es: "Soy un desarrollador de estos proyectos",
                fr: "Je suis un développeur pour ces projets" 
            },
            projects_contributor: {
                en: "Projects I contribute to",
                de: "Projekte, zu der ich beitrage",
                es: "Proyectos, a los que contribuyo",
                fr: "Projets auxquels je contribue" 
            },
            contact: {
                en: "Contact",
                de: "Kontakt",
                es: "Contacto",
                fr: "Contact"
            },
            see_also: {
                en: "See also",
                de: "Siehe auch",
                es: "Véase también",
                fr: "Voir aussi"
            },
            friends_websites: {
                en: "Websites of friends hosted by me:",
                de: "Webseiten meiner Freunde, die ich hoste:",
                es: "Sitios web de amigos que alojo:",
                fr: "Sites web de mes amis que j'héberge:"
            },
            bbcode: {
                en: "BBCode chat colour-coder",
                de: "BBCode Chat-Protokoll Farbcodierung",
                es: "Código BBCode de colores para registro de la charla",
                fr: "Code BBCode de colores pour journaux de chat"
            },
            websocket: {
                en: "WebSocket information page",
                de: "WebSocket Informationsseite",
                es: "Página de información acerca de WebSocket",
                fr: "Page d'information sur WebSocket"
            }
        },
        get = bind(document.getElementById, document);

    function switchLanguage(language) {
        currentLanguage = language;
        document.documentElement.lang = language;

        Object.keys(strings).forEach(function (string) {
            var element;

            element = get('text_' + string);
            element.innerHTML = '';
            element.appendChild(document.createTextNode(strings[string][language]));
        });

        updateLanguageList();
    }

    function updateLanguageList() {
        var switcher, ul;

        switcher = get('language_switcher');
        switcher.innerHTML = '';

        ul = document.createElement('ul');
        Object.keys(languages).forEach(function (language) {
            var li;

            li = document.createElement('li');
            li.lang = language;
            li.className = 'language';
            if (language === currentLanguage) {
                li.className += ' language_current';
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
