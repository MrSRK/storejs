var app = angular.module('app', ['colorpicker.module', 'wysiwyg.module'])

app.controller('MyCtrl', function($scope) {
    $scope.data = {
        text: "hello"
    }
    $scope.disabled = false;
    $scope.menu = [
        ['placeholder'],
        ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'],
        ['format-block'],
        ['font'],
        ['font-size'],
        ['font-color', 'hilite-color'],
        ['remove-format'],
        ['ordered-list', 'unordered-list', 'outdent', 'indent'],
        ['left-justify', 'center-justify', 'right-justify'],
        ['code', 'quote', 'paragraph'],
        ['link', 'image'],
    ];
    $scope.placeholderOptions = [
        {
            value: '',
            name: 'Insert Placeholder'
        },
        {
            value: '[candidate-full-name]',
            name: 'Candidate Full Name'
        },
        {
            value: '[candidate-first-name]',
            name: 'Candidate First Name'
        },
        {
            value: '[candidate-last-name]',
            name: 'Candidate Last Name'
        },
        {
            value: '[sender-full-name]',
            name: 'Sender Full Name'
        },
        {
            value: '[sender-first-name]',
            name: 'Sender First Name'
        },
        {
            value: '[sender-last-name]',
            name: 'Sender Last Name'
        },
        {
            value: '[location]',
            name: 'Location'
        },
        {
            value: '[position]',
            name: 'Position'
        },
    ];

    $scope.setDisabled = function() {
        $scope.disabled = !$scope.disabled;
    }
})