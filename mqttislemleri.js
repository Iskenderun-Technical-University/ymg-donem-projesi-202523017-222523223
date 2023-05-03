var modul_server_adi = "naya.honoff.com";
var port_no = "1883";
var mqttconnect = false;
function mqttbaglan(modul_server, tel_seri_no, modul_mqtt_yol_status){
cordova.plugins.CordovaMqTTPlugin.connect({
    url: modul_server, //a public broker used for testing purposes only. Try using a self hosted broker for production.
    port: port_no,
    clientId: tel_seri_no,
    connectionTimeout: 3000,
    keepAlive: 60,
    success: function (s) {
        mqttconnect = true;
        mqttsubscribe(modul_mqtt_yol_status);
    },
    error: function (e) {
        mqttconnect = false;
    },
    onConnectionLost: function () {
        mqttconnect = false;
    }
    })
}
function mqttduzbaglan() {
    var tel_seri_no = device.serial;
    var modul_server = "tcp://" + modul_server_adi;
    cordova.plugins.CordovaMqTTPlugin.connect({
        url: modul_server, //a public broker used for testing purposes only. Try using a self hosted broker for production.
        port: port_no,
        clientId: tel_seri_no,
        connectionTimeout: 3000,
        keepAlive: 60,
        success: function (s) {
            mqttconnect = true;
        },
        error: function (e) {
            mqttconnect = false;
        },
        onConnectionLost: function () {
            mqttconnect = false;
        }
    })
}
function mqttdisconnect() {
    cordova.plugins.CordovaMqTTPlugin.disconnect({
        success: function (s) {
            mqttconnect = false;
        },
        error: function (e) {

        }
    })
}

function mqttsubscribe(modul_mqtt_yol_status) {
    cordova.plugins.CordovaMqTTPlugin.subscribe({
        topic: modul_mqtt_yol_status,//abone olunacak topik
        qos: 0,
        success: function (s) {

        },
        error: function (e) {

        }
    });
}