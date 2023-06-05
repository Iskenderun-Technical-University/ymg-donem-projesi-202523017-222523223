function internetkontrol() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = '2G';
    states[Connection.CELL_3G] = '3G';
    states[Connection.CELL_4G] = '4G';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'no';
    if (states[networkState] == 'no') {
        uyari("Naya Uyarı- İşlemleri yapınız", "Lütfen İnternet Bağlantınızı Açınız");
        return false;
    }
    
    else {
        return true;
    }
         if (states[networkState] == 'yes') {
        uyari("Naya Uyarı- İşlemleri yapınız", "Lütfen İnternet Bağlantınızı Açınız");
        return true;
    }
}
function izinler(){
    var permissions = cordova.plugins.permissions;

    var liste = [
        permissions.ACCESS_COARSE_LOCATION,
        permissions.ACCESS_FINE_LOCATION,
        permissions.ACCESS_NETWORK_STATE,
        permissions.CHANGE_NETWORK_STATE,
        permissions.INTERNET,
        permissions.ACCESS_WIFI_STATE,
        permissions.CHANGE_WIFI_STATE,
        permissions.FLASHLIGHT,
        permissions.CAMERA
    ];


    permissions.checkPermission(
        liste,
        (status) => {
            if (!status.checkPermission) {
                permissions.requestPermissions(
                    liste,
                    (success) => { },
                    (error) => { }
                );
            }
        },
        (error)=>{}
    );
   
}
