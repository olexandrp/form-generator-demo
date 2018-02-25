_.extend(Backbone.Validation.patterns, {
    date: /\d{4}-\d{2}-\d{2}/
});

_.extend(Backbone.Validation.messages, {
    date: 'Date format YYYY-MM-DD'
});

var UserModel = Backbone.Model.extend({
    schema: {
        type: 'object',
        fields: [{
            name: 'first_name',
            type: 'string',
            label: 'First name'
        }, {
            name: 'last_name',
            type: 'string',
            label: 'Last name'
        }, {
            name: 'age',
            type: 'integer',
            label: 'Age'
        }, {
            name: 'email',
            type: 'email',
            label: 'Email'
        }]
    },
    validation: {
        first_name: {
            rangeLength: [3, 50],
            required: true
        },
        last_name: {
            rangeLength: [3, 50],
            required: false
        },
        age: {
            range: [13, 150],
            required: false
        },
        email: {
            pattern: 'email',
            required: true
        }
    }
});
