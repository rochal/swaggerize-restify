'use strict';

var test = require('tape'),
    restifyroutes = require('../lib/restifyroutes'),
    restify = require('restify');

test('express routes', function (t) {

    t.test('test api', function (t) {
        t.plan(3);

        var server = restify.createServer();
	var server2 = restify.createServer();

        restifyroutes(server, {
            api: require('./fixtures/defs/pets.json'),
            routes: [
                {
                    method: 'get',
                    path: '/pets/:id',
                    validators: [],
                    handler: function (req, res) {}
                }
            ]
        });

        t.strictEqual(Object.keys(server.routes).length, 2, '2 routes added.');
	t.ok(Boolean(server.routes.getv1petstoreapidocs), 'api-docs added.');
	t.ok(Boolean(server.routes.getv1petstorepetsid), 'hello added.');
    });

    t.test('test no handlers', function (t) {
        t.plan(2);

	var server = restify.createServer();

        restifyroutes(server, {
            api: require('./fixtures/defs/pets.json'),
            validators: [],
            routes: []
        });

	t.strictEqual(Object.keys(server.routes).length, 1, 'only api-docs route added.');
	t.ok(Boolean(server.routes.getv1petstoreapidocs), 'api-docs added.');
    });

    t.test('test middlewares in handler', function (t) {
        t.plan(4);

	var server = restify.createServer();

        restifyroutes(server, {
            api: require('./fixtures/defs/pets.json'),
            routes: [
                {
                    method: 'get',
                    path: '/pets',
                    validators: [],
                    handler: [
                        function m1(req, res, next) {},
                        function (req, res) {}
                    ]
                }
            ]
        });

        t.strictEqual(Object.keys(server.routes).length, 2, '2 routes added.');
	t.ok(server.routes.getv1petstorepets, '/pets added.');
	t.strictEqual(Object.keys(server.routes.getv1petstorepets).length, 2, '/pets has middleware.');
	t.ok(server.routes.getv1petstorepets[0].name, 'm1', '/pets has middleware named m1.');
    });
});
