<form role="form" class="reputation-for-posting-settings">
    <div class="row">
        <div class="col-sm-2 col-xs-12 settings-header">
            General Settings
        </div>
        <div class="col-sm-10 col-xs-12">
            <div class="form-group">
                <label>
                    Amount of Reputation to Award
                </label>
                <input id="reputationAwardAmount" name="reputationAwardAmount" type="number" class="form-control">
            </div>
        </div>
    </div>
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
<i class="material-icons">save</i>
</button>

<script>
require(['settings'], function(Settings) {
        Settings.load('reputation-for-posting', $('.reputation-for-posting-settings'));

        $('#save').on('click', function() {
                Settings.save('reputation-for-posting', $('.reputation-for-posting-settings'), function() {
                        app.alert({
type: 'success',
alert_id: 'reputation-for-posting-saved',
title: 'Settings Saved',
message: 'Please reload your NodeBB to apply these settings',
clickfn: function() {
socket.emit('admin.reload');
}
})
                        });
                });
        });
</script>
