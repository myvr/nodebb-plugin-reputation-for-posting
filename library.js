(function(module) {
    "use strict";

    var async = module.parent.require('async'),
        db = module.parent.require('./database'),
        meta = module.parent.require('./meta'),
        user = module.parent.require('./user'),
        rewards = module.parent.require('./rewards');

    var plugin = {};

    plugin.init = function(params, callback) {
        var app = params.router,
            middleware = params.middleware;

        app.get('/admin/plugins/reputation-for-posting', middleware.admin.buildHeader, renderAdmin);
        app.get('/api/admin/plugins/reputation-for-posting', renderAdmin);

        callback();
    };

    function renderAdmin(req, res, next) {
        res.render('admin', {});
    }

    plugin.awardReputation = function(postData) {
        async.waterfall([
            function(next){
                meta.settings.get('reputation-for-posting', next);
            },
            function(settings, next) {
                user.incrementUserFieldBy(
                    postData.uid,
                    'reputation',
                    parseInt(settings.reputationAwardAmount, 10),
                    next
                );
            },
            function(newreputation, next) {
                db.sortedSetAdd('users:reputation', newreputation, postData.uid, next);
            },
            function(next) {
                rewards.checkConditionAndRewardUser(postData.uid, 'essentials/user.reputation', function(callback) {
                    user.getUserField(postData.uid, 'reputation', callback);
                }, next);
            }
        ], function(err) {
            if (err) {
                winston.error(err);
            }
        });
    };

    plugin.addAdminNavigation = function(header, callback) {
        header.plugins.push({
            route: '/plugins/reputation-for-posting',
            icon: 'fa-trophy',
            name: 'Reputation for Posting'
        });

        callback(null, header);
    };

    module.exports = plugin;
}(module));
