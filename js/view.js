'use strict';

/**
 * A function that creates and returns all of the model classes and constants.
 */
function createViewModule() {

    var LIST_VIEW = 'LIST_VIEW';
    var GRID_VIEW = 'GRID_VIEW';
    var RATING_CHANGE = 'RATING_CHANGE';

    /**
     * An object representing a DOM element that will render the given ImageModel object.
     */
    var ImageRenderer = function(imageModel) {
        // TODO

        var templateNode = document.getElementById("imageRenderTemplate");
        var templateNodeHTML = templateNode.innerHTML;
        this.element = document.createElement("div");

        this.element.setAttribute("align", "center");

        this.element.innerHTML = templateNodeHTML;

        this.picture = this.element.getElementsByClassName("picture");
        this.picture = this.picture[0];

        this.radioContainer = this.element.getElementsByClassName("star-rating");
        this.radioUpdateStar = this.element.querySelectorAll('[type=radio]');
        this.radioContainer = this.radioContainer[0];
        this.radioContainer.addEventListener('click', function(event){
            this.imageModel.setRating(event.target.value);

        }.bind(this));


        this.imageModel = imageModel;
    };

    _.extend(ImageRenderer.prototype, {

        /**
         * Returns an element representing the ImageModel, which can be attached to the DOM
         * to display the ImageModel.
         */
        getElement: function() {
            return this.element;
        },

        /**
         * Returns the ImageModel represented by this ImageRenderer.
         */
        getImageModel: function() {
            return this.imageModel;
        },

        /**
         * Sets the ImageModel represented by this ImageRenderer, changing the element and its
         * contents as necessary.
         */
        setImageModel: function(imageModel) {
            this.imageModel = imageModel;

            this.renderImageModel(imageModel);

            imageModel.addListener(this.modelChangeHandler.bind(this));
        },

        /**
         * Changes the rendering of the ImageModel to either list or grid view.
         * @param viewType A string, either LIST_VIEW or GRID_VIEW
         */
        setToView: function(viewType) {
            this.currentView = viewType;
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type it is
         * currently rendering.
         */
        getCurrentView: function() {
            return this.currentView;
        },

        renderImageModel: function(imageModel){
            this.picture.setAttribute("src", imageModel.path.substr(1));

            var ratings = this.element.getElementsByTagName("input");
            _.each(ratings,function(rating){
                rating.setAttribute("name", imageModel.path);
            }.bind(this));

            var dateDisplay = this.element.getElementsByClassName("date");
            dateDisplay = dateDisplay[0];

            var options = {month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric"};

            dateDisplay.innerHTML =  imageModel.modificationDate.toLocaleDateString("en-US", options);

            var pictureTitle = this.element.getElementsByClassName("post-title");
            pictureTitle = pictureTitle[0];
            pictureTitle.innerHTML = imageModel.path.substr(1);

            if(imageModel.rating != 0) {
                this.radioUpdateStar[imageModel.rating - 1].checked = true;
            }
        },

        modelChangeHandler: function(imageModel, eventTime){
            this.renderImageModel(imageModel);
        }

    });

    var FullImageRenderer = function(imageModel) {

        this.imageModel = imageModel;

        var overlayTemplateNode = document.getElementById("overlayTemp");
        var overlayTemplateNodeHTML = overlayTemplateNode.innerHTML;
        this.element = document.createElement("div");
        this.element.style.display = 'none';

        this.element.innerHTML = overlayTemplateNodeHTML;

        document.getElementById("bigPictureTemplateHolder").appendChild(this.element);

        this.overlayPicture = this.element.getElementsByClassName("overlayPicture");
        this.overlayPicture = this.overlayPicture[0];

        var closeButton = this.element.getElementsByClassName("close");
        closeButton = closeButton[0];
        closeButton.addEventListener('click',function(){
            var appContainerNode = document.getElementById("app-container");
            appContainerNode.classList.remove("opac");

            var toolbarNode = document.getElementById("toolbar");
            toolbarNode.classList.remove("opac");

            this.element.style.display = 'none';
            var getBody = document.getElementsByTagName('body')[0];
            getBody.classList.remove('noscroll');
        }.bind(this))


    };

    _.extend(FullImageRenderer.prototype, {

        /**
         * Returns an element representing the ImageModel, which can be attached to the DOM
         * to display the ImageModel.
         */
        getElement: function() {
            return this.element;
        },

        /**
         * Returns the ImageModel represented by this ImageRenderer.
         */
        getImageModel: function() {
            return this.imageModel;
        },

        /**
         * Sets the ImageModel represented by this ImageRenderer, changing the element and its
         * contents as necessary.
         */
        setImageModel: function(imageModel) {
            this.element.style.display = 'block';

            this.overlayPicture.setAttribute('src', imageModel.getPath().substr(1));

            var appContainerNode = document.getElementById("app-container");
            appContainerNode.classList.add("opac");

            var toolbarNode = document.getElementById("toolbar");
            toolbarNode.classList.add("opac");

            var getBody = document.getElementsByTagName('body')[0];
            getBody.classList.add('noscroll');

            var that = this;
            var totalWidth = function(){
                var y = window.innerHeight*.80 + "px";
                var x = window.innerWidth*.80 + "px";
                that.overlayPicture.style.maxHeight = y;
                that.overlayPicture.style.maxWidth = x;



                window.scrollTo(0,0);
            }
            totalWidth();
        },

        /**
         * Changes the rendering of the ImageModel to either list or grid view.
         * @param viewType A string, either LIST_VIEW or GRID_VIEW
         */
        setToView: function(viewType) {
            this.currentView = viewType;
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type it is
         * currently rendering.
         */
        getCurrentView: function() {
            return this.currentView;
        }
    });

    /**
     * A factory is an object that creates other objects. In this case, this object will create
     * objects that fulfill the ImageRenderer class's contract defined above.
     */
    var ImageRendererFactory = function() {
    };

    _.extend(ImageRendererFactory.prototype, {

        /**
         * Creates a new ImageRenderer object for the given ImageModel
         */
        createImageRenderer: function(imageModel) {
            var testImageRender = new ImageRenderer(imageModel);
            testImageRender.setImageModel(imageModel);
            return testImageRender;
        }
    });

    var FullImageRendererFactory = function() {

    };

    _.extend(FullImageRendererFactory.prototype, {
        createImageRenderer: function(imageModel) {
            return new FullImageRenderer();
        }
    });

    /**
     * An object representing a DOM element that will render an ImageCollectionModel.
     * Multiple such objects can be created and added to the DOM (i.e., you shouldn't
     * assume there is only one ImageCollectionView that will ever be created).
     */
    var ImageCollectionView = function() {

        this.isRendered = false;

        this.renderers =[];

        var instanceOfFullImageRendererFactory = new FullImageRendererFactory();
        this.instanceOfFullImageRenderer = instanceOfFullImageRendererFactory.createImageRenderer();


        function removejscssfile(filename, filetype){
            var removedelements=0
            var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist using
            var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
            var allsuspects=document.getElementsByTagName(targetelement)
            for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
                if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1){
                    allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
                    removedelements+=1
                }
            }
        };

        function loadjscssfile(filename, filetype){

            if (filetype=="css"){ //if filename is an external CSS file
                var fileref=document.createElement("link");
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", filename);
            }
            if (typeof fileref!="undefined")
                document.getElementsByTagName("head")[0].appendChild(fileref);
        };

        this.textFunction = function() {
            removejscssfile('css/media.css','css');
            loadjscssfile('css/viewtext.css','css');
        };

        this.mediaFunction = function() {
            removejscssfile('css/viewtext.css','css');
            loadjscssfile('css/media.css','css');

        };

        this.element = document.getElementById("imageCollectionViewNode");


        this.placeRendererForModel = function(model) {
            var imageRenderer = this.imageRendererFactory.createImageRenderer(model);
            imageRenderer.setToView(this.viewType);
            this.element.insertBefore(imageRenderer.getElement(), this.element.childNodes[0]);

            this.renderers.push(imageRenderer);

            var rendererElement = imageRenderer.getElement();
            var imageTag = rendererElement.querySelector('img');
            imageTag.addEventListener('click', function(){
                this.instanceOfFullImageRenderer.setImageModel(imageRenderer.getImageModel());
            }.bind(this))

            var grabButton = rendererElement.getElementsByClassName("removeButton");
            grabButton = grabButton[0];
            grabButton.addEventListener('click', function(event){
                var getImageModel = imageRenderer.getImageModel();
                this.imageCollectionModel.removeImageModel(getImageModel);
                this.element.removeChild(imageRenderer.getElement());
            }.bind(this));
        }
    };

    _.extend(ImageCollectionView.prototype, {
        collectionAddHandler: function(eventType, imageModelCollection, imageModel, eventDate){
            if(eventType.localeCompare('IMAGE_ADDED_TO_COLLECTION_EVENT') == 0) {
                this.placeRendererForModel(imageModel);
            }
        },


        /**
         * Returns an element that can be attached to the DOM to display the ImageCollectionModel
         * this object represents.
         */
        getElement: function() {
            return this.element;
        },

        /**
         * Gets the current ImageRendererFactory being used to create new ImageRenderer objects.
         */
        getImageRendererFactory: function() {
            return this.imageRendererFactory;
        },

        /**
         * Sets the ImageRendererFactory to use to render ImageModels. When a *new* factory is provided,
         * the ImageCollectionView should redo its entire presentation, replacing all of the old
         * ImageRenderer objects with new ImageRenderer objects produced by the factory.
         */
        setImageRendererFactory: function(imageRendererFactory) {
            this.imageRendererFactory = imageRendererFactory;
        },

        /**
         * Returns the ImageCollectionModel represented by this view.
         */
        getImageCollectionModel: function() {
            return this.imageCollectionModel;
        },

        /**
         * Sets the ImageCollectionModel to be represented by this view. When setting the ImageCollectionModel,
         * you should properly register/unregister listeners with the model, so you will be notified of
         * any changes to the given model.
         */
        setImageCollectionModel: function(imageCollectionModel) {
            this.imageCollectionModel = imageCollectionModel;
        },

        /**
         * Changes the presentation of the images to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW.
         */
        setToView: function(viewType) {
            this.viewType = viewType;

            if(this.isRendered == false){
                this.isRendered = true;
                var models = this.imageCollectionModel.getImageModels();
                _.each(models, this.placeRendererForModel.bind(this));
            } else {
                _.each(this.renderers, function(r) {
                    r.setToView(viewType);
                });
            }

            if(viewType == GRID_VIEW){
                this.mediaFunction();
            }else{
                this.textFunction();
            }


        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type is currently
         * being rendered.
         */
        getCurrentView: function() {
            return this.viewType;
        },

        ratingChangeHandler: function(toolbar, eventType, eventDate){
            if(eventType != "RATING_CHANGE") return;

            var currentRating = toolbar.getCurrentRatingFilter();

            _.each(this.renderers, function(render){

               var ratingOfModel =  render.getImageModel().getRating();
                if(ratingOfModel >= currentRating){
                    render.getElement().style.display = "block";
                }else{
                    render.getElement().style.display = "none";
                }
            }.bind(this));

        }

    });

    /**
     * An object representing a DOM element that will render the toolbar to the screen.
     */
    var Toolbar = function() {
        this.multButton = document.getElementById("nav_mult");
        this.multButton.addEventListener("click", function(){
            _.each(this.listeners, function(listener){
                listener(this, GRID_VIEW, new Date())
            }.bind(this));
            this.setToView(GRID_VIEW);
        }.bind(this));

        this.textButton = document.getElementById("nav_text");
        this.textButton.addEventListener("click", function(){
            _.each(this.listeners, function(listener){
                listener(this, LIST_VIEW, new Date())
            }.bind(this));
            this.setToView(LIST_VIEW);
        }.bind(this));

        this.starNav = document.getElementById("starNav");
        this.starNav.addEventListener('click', function(event){
            this.rating = event.target.value;
            this.currentlyClicked = event.target;
            _.each(this.listeners, function(listener){
                listener(this, RATING_CHANGE, new Date())
            }.bind(this))
        }.bind(this));

        this.clearStars = document.getElementById("clearStar");
        this.clearStars.addEventListener("click", function(){
            if(this.currentlyClicked != undefined){
                this.currentlyClicked.checked = false;
            }

            this.rating = 0;
            _.each(this.listeners, function(listener){
                listener(this, RATING_CHANGE, new Date())
            }.bind(this))
        }.bind(this));

        this.listeners = [];
        this.element = document.getElementById("toolbar");
    };

    _.extend(Toolbar.prototype, {
        /**
         * Returns an element representing the toolbar, which can be attached to the DOM.
         */
        getElement: function() {
            return this.element;
        },

        /**
         * Registers the given listener to be notified when the toolbar changes from one
         * view type to another.
         * @param listener_fn A function with signature (toolbar, eventType, eventDate), where
         *                    toolbar is a reference to this object, eventType is a string of
         *                    either, LIST_VIEW, GRID_VIEW, or RATING_CHANGE representing how
         *                    the toolbar has changed (specifically, the user has switched to
         *                    a list view, grid view, or changed the star rating filter).
         *                    eventDate is a Date object representing when the event occurred.
         */
        addListener: function(listener_fn) {

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from the toolbar.
         */
        removeListener: function(listener_fn) {
            this.listeners = _.without(this.listeners, listener_fn);
        },

        /**
         * Sets the toolbar to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW representing the desired view.
         */
        setToView: function(viewType) {
            this.viewType = viewType;
            if(viewType == GRID_VIEW){
                this.multButton.classList.add("active");
                this.textButton.classList.remove("active");
            }else{
                this.textButton.classList.add("active");
                this.multButton.classList.remove("active");
            }
        },

        /**
         * Returns the current view selected in the toolbar, a string that is
         * either LIST_VIEW or GRID_VIEW.
         */
        getCurrentView: function() {
            return this.viewType;
        },

        /**
         * Returns the current rating filter. A number in the range [0,5], where 0 indicates no
         * filtering should take place.
         */
        getCurrentRatingFilter: function() {
            return this.rating;
        },

        /**
         * Sets the rating filter.
         * @param rating An integer in the range [0,5], where 0 indicates no filtering should take place.
         */
        setRatingFilter: function(rating) {
            this.rating = rating;
        }
    });

    /**
     * An object that will allow the user to choose images to display.
     * @constructor
     */
    var FileChooser = function() {
        this.listeners = [];
        this._init();
    };

    _.extend(FileChooser.prototype, {
        // This code partially derived from: http://www.html5rocks.com/en/tutorials/file/dndfiles/
        _init: function() {
            var self = this;
            this.fileChooserDiv = document.createElement('div');
            var fileChooserTemplate = document.getElementById('file-chooser');
            this.fileChooserDiv.appendChild(document.importNode(fileChooserTemplate.content, true));
            var fileChooserInput = this.fileChooserDiv.querySelector('.files-input');
            fileChooserInput.addEventListener('change', function(evt) {
                var files = evt.target.files;
                var eventDate = new Date();
                _.each(
                    self.listeners,
                    function(listener_fn) {
                        listener_fn(self, files, eventDate);
                    }
                );
            });
        },

        /**
         * Returns an element that can be added to the DOM to display the file chooser.
         */
        getElement: function() {
            return this.fileChooserDiv;
        },

        /**
         * Adds a listener to be notified when a new set of files have been chosen.
         * @param listener_fn A function with signature (fileChooser, fileList, eventDate), where
         *                    fileChooser is a reference to this object, fileList is a list of files
         *                    as returned by the File API, and eventDate is when the files were chosen.
         */
        addListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from this object.
         * @param listener_fn
         */
        removeListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.removeListener: " + JSON.stringify(arguments));
            }
            this.listeners = _.without(this.listeners, listener_fn);
        }
    });

    // Return an object containing all of our classes and constants
    return {
        ImageRenderer: ImageRenderer,
        ImageRendererFactory: ImageRendererFactory,
        ImageCollectionView: ImageCollectionView,
        Toolbar: Toolbar,
        FileChooser: FileChooser,

        LIST_VIEW: LIST_VIEW,
        GRID_VIEW: GRID_VIEW,
        RATING_CHANGE: RATING_CHANGE
    };
}