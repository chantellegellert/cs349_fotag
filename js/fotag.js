'use strict';


// This should be your main point of entry for your app

window.addEventListener('load', function() {
    var modelModule = createModelModule();
    var viewModule = createViewModule();
    var pictureContainer = document.getElementById('pictureThingy');



    var dropButtonContainer = document.getElementById('dropButton');
    dropButtonContainer.addEventListener('click', function(){
        var captureButton = document.getElementById('file-chooserButton');
        captureButton.click();
    });

    //create instance of image collection view to work with rendering the view yay
    var instanceImageCollectionView = new viewModule.ImageCollectionView();
    instanceImageCollectionView.setImageRendererFactory(new viewModule.ImageRendererFactory());


    //image collect view knows about image collection Model
    //image collect view needs to know about the database
    //call loader
    var imageCollectionModel = modelModule.loadImageCollectionModel();
    instanceImageCollectionView.setImageCollectionModel(imageCollectionModel);
    imageCollectionModel.addListener(instanceImageCollectionView.collectionAddHandler.bind(instanceImageCollectionView));


    //after read from database
    instanceImageCollectionView.setToView(viewModule.GRID_VIEW);

    //take in all parameters and put them into the right order
    var collectionStoreCallBack= function(eventType, imageModelCollection, imageModel, eventDate){
        modelModule.storeImageCollectionModel(imageModelCollection);
    }.bind(imageCollectionModel);
    imageCollectionModel.addListener(collectionStoreCallBack);


    //Tool bar
    var toolBarChangeHandler = function(toolbar, eventType, eventDate){
        if(eventType == "LIST_VIEW" || eventType == "GRID_VIEW") {
            instanceImageCollectionView.setToView(eventType);
        }

    };


    //Grab instance of tool bar
    var instanceOfToolBar = new viewModule.Toolbar();
    instanceOfToolBar.addListener(toolBarChangeHandler);
    instanceOfToolBar.addListener(instanceImageCollectionView.ratingChangeHandler.bind(instanceImageCollectionView));


    // Attach the file chooser to the page. You can choose to put this elsewhere, and style as desired
    var fileChooser = new viewModule.FileChooser();
    pictureContainer.appendChild(fileChooser.getElement());

    // Demo that we can choose files and save to local storage. This can be replaced, later
    fileChooser.addListener(function(fileChooser, files, eventDate) {

        _.each(
            files,
            function(file) {
                //var newDiv = document.createElement('div');
                //var fileInfo = "File name: " + file.name + ", last modified: " + file.lastModifiedDate;
                //newDiv.innerText = fileInfo;
                //pictureContainer.appendChild(newDiv);
                imageCollectionModel.addImageModel(
                    new modelModule.ImageModel(
                        '/images/' + file.name,
                        file.lastModifiedDate,
                        '',
                        0
                    ));
            }
        );
        //modelModule.storeImageCollectionModel(imageCollectionModel);
    });
    //// Demo retrieval
    //var storedImageCollection = modelModule.loadImageCollectionModel();
    //var storedImageDiv = document.createElement('div');
    //_.each(
    //    storedImageCollection.getImageModels(),
    //    function(imageModel) {
    //        var imageModelDiv = document.createElement('div');
    //        imageModelDiv.innerText = "ImageModel from storage: " + JSON.stringify(imageModel);
    //        storedImageDiv.appendChild(imageModelDiv);
    //    }
    //);
    //pictureContainer.appendChild(storedImageDiv);
});