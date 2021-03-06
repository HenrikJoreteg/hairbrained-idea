var View = require('ampersand-view');
var Model = require('ampersand-model');
var mixin = require('./mixin');

//mixin = { renderOnModelChange: function () {} };
var Person = Model.extend({
    props: {
        name: ['string', true, "Phil"],
        age: ['number', true, 28]
    }
});

var MySubview = View.extend(mixin, {
    template: function (view) {
        return "<div><h1>this is my subview " + view.anInteger + "</h1>Passed In: " + view.aPropFromAbove + "<input type='text'/>Name: " + view.model.name + ": " + view.model.age + "</div>";
    },
    session: {
        anInteger: ['number', true, 0],
        aPropFromAbove: ['string', true, 'default'],
        interval: ['number'],
    },
    initialize: function () {
        window.subviews = window.subviews || [];
        window.subviews.push(this);
        this.renderOnModelChange();
        this.on('change:anInteger', this.render);
        this.on('change:aPropFromAbove', this.render);
        this.interval = setInterval(function () {
            this.anInteger++;
        }.bind(this), 100);
    },
    remove: function () {
        clearInterval(this.interval);
        View.prototype.remove.call(this);
    }
});

var MyView = View.extend(mixin, {
    template: require('./template.jade'),
    components: {
        'my-subview': MySubview
    },
    props: {
        time: ['number', true, 0],
        someString: ['string', true, 'foo'],
        listOfThings: ['array', true]
    },
    initialize: function () {
        this.renderOnModelChange();
        this.on('change:listOfThings', this.render);
        this.on('change:someString', this.render);

        setInterval(function () {
            this.time = Date.now();
        }.bind(this), 10);

        setInterval(function () {
            this.someString += 'o';
        }.bind(this), 1000);

        this.listOfThings = [1,2,3];

        i = 3;
        setInterval(function () {
            i++;
            this.listOfThings = this.listOfThings.concat([i]);
        }.bind(this), 1000);
    }
});

var me = new Person();
setInterval(function () {
    me.age++;
}, 500);
var myv = new MyView({ model: me });
myv.render();
document.body.appendChild(myv.el);
