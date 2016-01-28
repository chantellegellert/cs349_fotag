'use strict';

var expect = chai.expect;

describe('Provided unit tests', function() {
});


it('Model event dispatch test', function(){
    var clock = sinon.useFakeTimers(Date.now());

    var modelModule = createModelModule();
    var model = new modelModule.ImageModel("/images/GOPR0042-small.jpg", new Date, "I love ponies", 5);
    var spyListener = sinon.spy();

    model.addListener(spyListener);

    model.setRating(4);

    expect(spyListener.called, 'Spy should be called after changing rating on I love ponies').to.be.ok;
    expect(spyListener.callCount, 'Ponies should only be called once!').to.equal(1);
    expect(spyListener.calledWith(model, new Date), "validator listener argument verificaiton for ponies").to.be.true;
});


it('Model constructor test', function(){
  var clock = sinon.useFakeTimers(Date.now());
    var modelModule = createModelModule();

    var goodValues = {
        pathToFile: "/images/GOPR0042-small.jpg",
        modificationDate: new Date,
        caption: "I love ponies",
        rating: 5
    }

    var model = new modelModule.ImageModel(goodValues.pathToFile, goodValues.modificationDate, goodValues.caption, goodValues.rating);

    expect(model.getCaption(), "Caption is bad").to.equal(goodValues.caption);
    expect(model.getPath(), "Path is bad").to.equal(goodValues.pathToFile);
    expect(model.getRating(), "Rating is bad").to.equal(goodValues.rating);
    expect(model.getModificationDate(), "Date is bad").to.equal(goodValues.modificationDate);
});

it('Add and Remove Image Model handlers', function(){
    var clock = sinon.useFakeTimers(Date.now());

    var modelModule = createModelModule();
    var model = new modelModule.ImageModel("/images/GOPR0042-small.jpg", new Date, "I love ponies", 5);
    var modelCollection = new modelModule.ImageCollectionModel();

    var spyListener = sinon.spy();
    modelCollection.addListener(spyListener);

    modelCollection.addImageModel(model);

    expect(spyListener.called, 'Spy should be called after adding model into a collection of Models').to.be.ok;
    expect(spyListener.callCount, 'Ponies should only be called once!').to.equal(1);

    expect("IMAGE_ADDED_TO_COLLECTION_EVENT", modelCollection, model, new Date);

    var model2 = new modelModule.ImageModel("/images/GOPR0069-small.jpg", new Date, "I love ponies", 5);

    var spyListener2 = sinon.spy();
    modelCollection.addListener(spyListener2);
    modelCollection.removeListener(spyListener2);
    modelCollection.addImageModel(model2);

    expect(spyListener2.callCount, 'CaLl should not be called since removed listener').to.equal(0);

});


it('Changed the meta data, whenever change image in collection the collection should know', function(){
   var clock = sinon.useFakeTimers(Date.now());
    var modelModule = createModelModule();
    var model = new modelModule.ImageModel("/images/GOPR0042-small.jpg", new Date, "I love ponies", 5);
    var modelCollection = new modelModule.ImageCollectionModel();
    modelCollection.addImageModel(model);

    //now we make the spy
    var spyListener = sinon.spy();
    modelCollection.addListener(spyListener);

    model.setRating(4);

    expect(spyListener.called, 'Spy should be called after changing the meta data').to.be.ok;
    expect(spyListener.callCount, 'Spy should only be called once!').to.equal(1);
    expect("IMAGE_META_DATA_CHANGED_EVENT", modelCollection, model, new Date);
});


it('Store some values and local storage test', function(){
    var clock = sinon.useFakeTimers(Date.now());
    var modelModule = createModelModule();

    var goodValues = {
        pathToFile: "/images/GOPR0042-small.jpg",
        modificationDate: new Date(),
        caption: "I love ponies",
        rating: 5
    }

    var model = new modelModule.ImageModel(goodValues.pathToFile, goodValues.modificationDate, goodValues.caption, goodValues.rating);
    var modelCollection = new modelModule.ImageCollectionModel();
    modelCollection.addImageModel(model);

    modelModule.storeImageCollectionModel(modelCollection);

    var imageCollection = modelModule.loadImageCollectionModel();
    var images = imageCollection.getImageModels();
    images = images[0];

    expect(images.getCaption(), "Caption is bad").to.equal(goodValues.caption);
    expect(images.getPath(), "Path is bad").to.equal(goodValues.pathToFile);
    expect(images.getRating(), "Rating is bad").to.equal(goodValues.rating);

    expect(images.getModificationDate().getTime(), "Date is bad").to.equal(goodValues.modificationDate.getTime());
});