Readme for the WEB CHAT application (http://www.sandorsjavascript.club/).

creator: Sandor Deli

Purpose of the application:
    The application is bare bones of a webchat application and a homework as well.

Description
	- The applications domain is: http://www.sandorsjavascript.club/ feel free to visit it. 
	- The application has two main pages:
        (To create two pages was not in the homework, but since I have never created a webchat, but I was really curious about it, I was interested in how it works on the backend, so I created a backend for it, out of fun and curiosity)
            - A webchat which communicates with a server provided by Docler Holding
                - link: /docler-server-webchat
            - A webchat communicating with a server created by Sandor Deli
                - link: /own-server-webchat
            - Both pages/sub applications provide:
         	 - a chat window, where the user can enter his username, a message and click on send.
                 - if he/she clicks on send, then the message is sent to the server.
                 - /own-server-webchat will respond on a send message with a standard reply and broadcast the chat message   to further clients which have opened the same page.
	- the webchat has a home page as well at: /
        - The whole application consits of a backend and a frontend, it doesnt feature any database.

DEPLOYMENT
	- Application is deployed on a Digital Ocean (https://digitalocean.com) Vps server, on Ubuntu 18.04.2 x64.
	- No ssl certificate has been created, to secure the connection, the requested 0.9 version of socket.io had some issues with ssl connection and I should't upgrade it.
	- Node version: 10.0.0
	- pm2 is the main process manager 

FRONT END
	- Technologies: html, css, vanilla javascript
	- Dependencies: socket.io

    - The Website has 5 Pages:
    	- /  (homepage)
        - /docler-server-webchat
        - /own-server-webchat
        - /404
        - /501
    
    - On the front end BEM architecture has been used to give a structure to the front end codebase.
        - BEM intro: http://getbem.com/introduction/
        - BEM class naming: http://getbem.com/naming/
        - Reason for use: for this application to use BEM is maybe an overkill, but as applications are scaling out BEM comes in really handy because:
            - It creates independent components, which are not dependent on their environment, and so a component can be easily plugged in and out from their html/css/javascript environment.
            - Basically it modularizes the html and css part of the application from which the whole front-end codebase will be much more composable, understandable and scalable.
            - So the pages are consisting of bem Blocks and the pages functionality is created by util functions and bem blocks. 
        
        - Typed of BEM Blocks:
            - positioning Blocks (Blocks which are positiong and other Block)
            - Blocks which are creating a visually visible item

        - The functionality of the BEM blocks are residing in their corresponding javascript file, where the main trigger function/factory function/constructor function is attached to the window object (after a name clash check), to expose the functionality to the global namespace. This way other functions call them on demand.

        - Bem Blocks in the application
            - webchat:
                - html: /app/views/partials/_webchat.ejs
                - css: /public/css/styles.css
                - js: /public/js/bem/webchat.js
                - description: The ‘webchat’ block has the aforementioned html, css and js files. This block creates the actual web chat window. It’s form is created obviously by the html and css files. It’s functionality doesn’t feature any socket.io related thing, just inserting user or partner message and returning the users message and name. About it’s functionality you can read more in: /public/js/webchat.js

            - centered-widget
                - html: <div class="centered-widget"> ... </div>
                - css: /public/css/styles.css
                - js: doesnt have any
                - descritpion: This Block is of type 'positioning block'. It centers the Bem blocks on the page.
                
        - Util Functions
            - in: /app/public/js
            - the util functions are functions, which are triggering/managing the javascript of BEM blocks or creating functionalities which are not related to a bem block
            - util functions in the application:
                'set-up-webchat.js':
                    - /app/public/js/set-up-webchat.js
                    - Manages the webchat functionality
                    - please read more about it in it’s file

        - right now the javascript of a page is triggered in its html-s last script tag. Reason is that, based on the ‘pageId’ variable - which is available just on the backend, in the templating engine - needs to be decided, that function which is triggering a certain functionality, with what kind of parameters needs to be called.
	- script tags are in /app/views/partials

    Webchat Functionality:
        in the script tag: /app/views/partials/_scripts the 'setUpWebchat' util function is called, which manages then the javascript of 'webchat' bem block

    configuration: 
        - in /app/config/assets/config.json
        - for the front end the configuration contains two important things:
        title of the page. it is read in the controller, from where it is passed into the templating engine, which writes it into the head tag
        id of the page: same as title

BACKEND
	- techologies: node.js
	- dependencies: dotenv, ejs, socket.io
    - deployed on digital ocean vps, with pm2 and Nginx.

    - The backend is pure node.js based on MVC and REST API architecture.
    - Since there is no database the MVC doesn’t feature any model
    - Servers overall functionality looks the following way:
        1. The request comes, which is passed into the router
        2. the router routes the requests to it’s corresponding controller
        3. Then controllers are managing the satisfaction of the request, by doing it themselves (if it is not a big task) or by calling widgets from the /app/widgets folder

    - The Router:
        - the router is in: /app/router/router.js which, is a really basic router.
        - If an error has happened on the server, then the router redirects to /501 and the error gets logged.
        - If the router didn’t find the requested page, then it redirects to /401
        - errors in the controllers are catched by the router, which passes the error to the error handler widget: /app/widgets/error-handler

    - Configuration: 
        - in: /app/config/assets/config.json
        - All variables, which are characteristic not, the current call, but the current state of the application, are stored in the config
            - routes
            - pageId
            - pageTitle
            - error messages
        - The configuration can be read just by top level modules like:
            - router
            - controllers
            - widgets
            To submodules the configuration is passed down by it's top level module. This way it is easier to determine, that what kind of configuration is need to the whole module to work.


    - Path management
	    - There are certain modules in any applications which are/can be called everywhere in the application.
        - In my application these are: 
            1. configuration, 
            2. modules in /app/widgets 
	    - in /app/app.js the uppermentioned modules are linked into the top level node_modules folder and so they can be called like ‘var moduleName = require(‘module-name’)’ everywhere in the application.
        - This is done by the module-linker widget (/app/widgets/module-linker/module-linker.js), which is called /app/app.js, as mentioned above

    Thank you for reading.


        
