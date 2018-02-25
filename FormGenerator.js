var FormGenerator = Backbone.View.extend({
    tagName: 'form',
    model: {},
    options: {
        layout: []
    },
    events: {
        change: 'onChange',
        submit: 'onSubmit'
    },
    errors: {},

    initialize: function(options) {
        var systemKeys = ['model'];
        this.options = _.defaults(_.omit(options, systemKeys), this.options);
    },

    onChange: function(event) {
        var dataKey = event.target.name,
            value = event.target.value,
            errorMessage = this.model.preValidate(dataKey, value);
        this.model.set(dataKey, value);
        this.$el.find('.error-message[data-key="'+ dataKey +'"]').text(errorMessage || '');
        this.$el.find('.form-control[data-key="'+ dataKey +'"]').val(value);
    },

    onSubmit: function(event) {
        event.preventDefault();
        event.stopPropagation();
        console.log(this.model.toJSON());
    },

    setValidation: function(inputConfig, fieldValidation) {
        if (_.has(fieldValidation, 'required')) {
            inputConfig['required'] = true;
        }
        if (_.has(fieldValidation, 'rangeLength')) {
            inputConfig['maxlength'] = _.last(fieldValidation.rangeLength);
        }
        if (_.has(fieldValidation, 'range')) {
            inputConfig['min'] = _.first(fieldValidation.range);
            inputConfig['max'] = _.last(fieldValidation.range);
        }
        return inputConfig;
    },

    renderLabel: function(fieldSchema, fieldValidation) {
        var labelConfig = {
            for: fieldSchema.name,
            html: fieldSchema.label
        };
        if (fieldValidation.required) { labelConfig['class'] = 'required'; }
        return $('<label>', labelConfig);
    },

    renderError: function(dataKey) {
        return $('<div>', {
            class: 'error-message',
            html: this.errors[dataKey],
            'data-key': dataKey
        });
    },

    renderType_email: function(dataKey, value, fieldSchema, fieldValidation) {
        var $label = this.renderLabel(fieldSchema, fieldValidation);
        var $error = this.renderError(dataKey);
        var $input;
        var inputConfig = {
            type: 'email',
            class: 'form-control',
            name: dataKey,
            placeholder: fieldSchema.label,
            value: value,
            'data-key': dataKey
        };
        inputConfig = this.setValidation(inputConfig, fieldValidation);
        $input = $('<input>', inputConfig);
        return [$label, $input, $error];
    },

    renderType_integer: function(dataKey, value, fieldSchema, fieldValidation) {
        var $label = this.renderLabel(fieldSchema, fieldValidation);
        var $error = this.renderError(dataKey);
        var $input;
        var inputConfig = {
            type: 'number',
            class: 'form-control',
            name: dataKey,
            placeholder: fieldSchema.label,
            value: value,
            'data-key': dataKey,
            step: 1
        };
        inputConfig = this.setValidation(inputConfig, fieldValidation);
        $input = $('<input>', inputConfig);
        return [$label, $input, $error];
    },

    renderType_string: function(dataKey, value, fieldSchema, fieldValidation) {
        var $label = this.renderLabel(fieldSchema, fieldValidation),
            $error = this.renderError(dataKey),
            $input,
            inputConfig = {
                type: 'text',
                class: 'form-control',
                name: dataKey,
                placeholder: fieldSchema.label,
                'data-key': dataKey,
                value: value
            };
        inputConfig = this.setValidation(inputConfig, fieldValidation);
        $input = $('<input>', inputConfig);
        return [$label, $input, $error];
    },

    renderType: function(dataKey, value, fieldSchema, fieldValidation) {
        var methodKey = 'renderType_' + fieldSchema.type;
        return this[methodKey](dataKey, value, fieldSchema, fieldValidation);
    },

    renderCell: function(cell) {
        var fieldSchema = _.findWhere(this.model.schema.fields, { name: cell.dataKey }),
            fieldValidation = this.model.validation[cell.dataKey],
            value = this.model.get(cell.dataKey);
        return $('<div>', { class: ['form-group', cell.width].join(' ') })
                .append(this.renderType(cell.dataKey, value, fieldSchema, fieldValidation));
    },

    renderRow: function(row) {
        var $row = $('<div>', { class: 'form-row' });
        _.each(row, function(cell) {
            $row.append(this.renderCell(cell));
        }, this);
        return $row;
    },

    renderLayout: function() {
        var $container = $('<div>', { class: 'container' });
        _.each(this.options.layout, function(row) {
            $container.append(this.renderRow(row));
        }, this);
        return $container;
    },

    render: function() {
        var html = this.renderLayout();
        this.$el.html([
            '<div class="container"><h3>Form Generator</h3></div>',
            html,
            '<div class="container"><button type="submit">Submit</button></div>'
        ]);
        return this;
    }
});