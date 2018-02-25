var data = {
    first_name: 'Yazmin',
    last_name: 'Ferry',
    age: '31',
    email: 'Dovie72@hotmail.com'
};

var user = new UserModel(data);

var layout = [
    [{
        dataKey: 'first_name',
        width: 'col-sm-3'
    }, {
        dataKey: 'last_name',
        width: 'col-sm-3'
    }],
    [{
        dataKey: 'age',
        width: 'col-sm-6'
    }],
    [{
        dataKey: 'email',
        width: 'col-sm-6'
    }]
];

var form = new FormGenerator({
    model: user,
    layout: layout
});
Backbone.Validation.bind(form);

$(document.body).html(
    form.render().el
);
