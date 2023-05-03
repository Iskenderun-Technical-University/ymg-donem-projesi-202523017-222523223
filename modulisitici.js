var isitici_kontrol_ver1 = 0;
var isitici_kontrol_ver2 = 0;
function isitici(modul_id, modul_ismi, modul_tip, modul_ip, modul_durum, modul_program, modul_surum, modul_deger, modul_server, modul_tetik, modul_wifi_adi) {
    var htmlmod = '<div data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">'
        + '<h4 onclick="onlinedurumisitici(\'' + modul_id + '\')">' + modul_ismi + '</h4>'
        + '<div class="ui-grid">'
        + '<form class="full-width-slider">'
        + '<input  type="range" name="' + modul_id + '" id="modul' + modul_id + '"  onchange="isiticidurumdegis(\'' + modul_id + '\');" value="0" min="0" max="255" data-highlight="true" data-theme="b" data-track-theme="b" data-show-value="false">'
        + '</form>'
        + '</div>'
        + '<div class="ui-grid-b">'
        + '<div class="ui-block-a">'
        + '<span><a onclick="modulisiticiayar(\'' + modul_id + '\')" style="background-color:transparent;color:black;border-color:#0071bc;" class="ui-btn ui-btn-inline ui-icon-gear ui-btn-icon-left">Ayar</a></span>'
        + '</div>'
        + '<div class="ui-block-b">'
        + '<span></span>'
        + '</div>'
        + '<div class="ui-block-c">'
        + '<a onclick="modulisiticiguncelle(\'' + modul_id + '\')" style="font-size:18px;font-weight: bold;" >Ver:' + modul_surum + '</a>'
        + '</div>'
        + '</div>'
        + '</div>';
    $('#masterdiv').append(htmlmod);
    $('#masterdiv').trigger('create');
}
function onlinedurumisitici(modul_id) {
    var mdurum = durumacikkapali[modul_id];
    if (mdurum != 1) {
        var dim_id = "#modul" + modul_id;
        $(dim_id).slider('disable');
        $(dim_id).slider('refresh');
        veritabani.vt.transaction(//veritabanından cihazı bul
            function (tx) {
                tx.executeSql(
                    "select * from cihaz where id=?",
                    [modul_id],
                    function (tx, results) {
                        var modul_ip = results.rows.item(0).modul_ip;
                        var modul_wifi_adi = results.rows.item(0).modul_wifi_adi;
                        var modul_server = "tcp://" + results.rows.item(0).modul_server;
                        var tel_seri_no = results.rows.item(0).tel_seri_no;
                        var modul_ssid = results.rows.item(0).modul_ssid;
                        var modul_mqtt_yol_publish = tel_seri_no + "/" + modul_ssid + "/PARAMETRE";
                        var modul_mqtt_yol_status = tel_seri_no + "/" + modul_ssid + "/STATUS";
                        if (modul_wifi_adi == "agyok") {
                            //ap modda çalışma işlemi
                        }
                        else {
                            if (WifiWizard2.isWifiEnabled()) {// wifi enabled ise
                                WifiWizard2.getConnectedSSID().then(function (SSID) {
                                    if (SSID == modul_wifi_adi) {//aynı ağa bağlıysak
                                        durumcekisitici(modul_ip).done((data) => {
                                            var dim = data["DIM"];
                                            $(dim_id).slider('enable');
                                            $(dim_id).val(dim).slider('refresh');
                                        }).fail(() => {// yerel ağda cihaz bulamazsak
                                            if (internetkontrol()) {
                                                isiticimqttdurumbul(dim_id, modul_server, tel_seri_no, modul_mqtt_yol_status, modul_mqtt_yol_publish);
                                            }//internet durum kontrol bit
                                            else {
                                                //hata verdi
                                                isiticihata('ZERUS UYARI!', 'Telefon herhangi bir internete bağlı değildir!', dim_id);
                                                $(dim_id).slider('disable');
                                                $(dim_id).slider('refresh');
                                            }

                                        });//fail bitiş
                                    }
                                    else {// başka bir ağa bağlıysak
                                        isiticimqttdurumbul(dim_id, modul_server, tel_seri_no, modul_mqtt_yol_status, modul_mqtt_yol_publish);
                                    }
                                }).cache(function (error) {//ssid ismini alamaz isek
                                    isiticimqttdurumbul(dim_id, modul_server, tel_seri_no, modul_mqtt_yol_status, modul_mqtt_yol_publish);
                                });
                            }
                            else {//wifi kapalıysa
                                if (internetkontrol()) {//internet varsa
                                    isiticimqttdurumbul(dim_id, modul_server, tel_seri_no, modul_mqtt_yol_status, modul_mqtt_yol_publish);
                                }
                                else {//internet yoksa
                                    isiticihata('ZERUS UYARI!', 'Telefon herhangi bir internete bağlı değildir!', dim_id);
                                    $(dim_id).slider('disable');
                                    $(dim_id).slider('refresh');
                                }
                            }
                        }
                    },
                    function (tx, error) {
                        uyari("Veri Güncelleme Hatası", error.message);

                    }
                );
            }
        );
        function durumcekisitici(modul_ip) {
            var modul_status_http = "http://" + modul_ip + "/parametre";
            return $.get(modul_status_http, { "timeout": 2000 });
        }
        durumacikkapali[modul_id] = 1;
    }
    else {
        durumacikkapali[modul_id] = 0;
    }
}
function isiticimqttdurumbul(dim_id, modul_server, tel_seri_no, modul_mqtt_yol_status, modul_mqtt_yol_publish) {
        var dongusay = 0;
        if (mqttconnect) {
            mqttsubscribe(modul_mqtt_yol_status);
        }
        else {
            mqttbaglan(modul_server, tel_seri_no, modul_mqtt_yol_status);
        }
        //mqtt servere bağlantı yap
        degergonder();
        function degergonder() {
            WifiWizard2.timeout(500).then(function () {// 500 ms sonra publish yap
                cordova.plugins.CordovaMqTTPlugin.publish({//publish basla
                    topic: modul_mqtt_yol_publish,
                    payload: "1&0&0",
                    qos: 0,
                    retain: false,
                    success: function (s) {
                        WifiWizard2.timeout(500).then(function () { degerbul(s); });
                    },
                    error: function (e) {
                        $(dim_id).slider('disable');
                        $(dim_id).slider('refresh');
                        anasayfa();
                    }
                })//publish bit
            });//timeout bit
        }
        function degerbul(s) {

            // var dongusay = 0;
            var degerler = [];
            cordova.plugins.CordovaMqTTPlugin.listen(modul_mqtt_yol_status, function (payload, params) {//mqtt sonuç bul
                degerler = payload.split("&");
                var dim = degerler[1];
                $(dim_id).slider('enable');
                $(dim_id).val(dim).slider('refresh');
                dongusay = 5;
            });
            if (dongusay < 5) {// 5 defa mqtt sorgular
                dongusay = dongusay + 1;
                WifiWizard2.timeout(300).then(function () { degergonder(); });
            }
        }
 
}
function isiticihata(baslik, mesaj, dim_id) {
    $.confirm({
        title: baslik,
        content: mesaj,
        buttons: {
            Tamam: function () {
                if (dim_id!=""){
                $(dim_id).slider('disable');
                $(dim_id).slider('refresh');
                }
                else {
                    anasayfa();
                }
            }
        }
    });
}
function isiticidurumdegis(modul_id) {
    WifiWizard2.timeout(3000).then(function () {//yarım saniye sonra değeri gönderir
        var dim_id = "#modul" + modul_id;
        var dim_degeri = $(dim_id).val();
        isitici_kontrol_ver2 = isitici_kontrol_ver1;
        isitici_kontrol_ver1 = dim_degeri;
        if (isitici_kontrol_ver1 != isitici_kontrol_ver2) {//kaydırma olayı başla kontrol için
            console.log("say");
        veritabani.vt.transaction(//veritabanından cihazı bul
            function (tx) {
                tx.executeSql(
                    "select * from cihaz where id=?",
                    [modul_id],
                    function (tx, results) {
                        var yerl_deger_http = "";
                        var mqtt_deger ="";
                        var modul_ip = results.rows.item(0).modul_ip;
                        var modul_wifi_adi = results.rows.item(0).modul_wifi_adi;
                        var modul_server = "tcp://" + results.rows.item(0).modul_server;
                        var tel_seri_no = results.rows.item(0).tel_seri_no;
                        var modul_ssid = results.rows.item(0).modul_ssid;
                        var modul_mqtt_yol_publish = tel_seri_no + "/" + modul_ssid + "/PARAMETRE";
                        //var modul_mqtt_yol_status = tel_seri_no + "/" + modul_ssid + "/STATUS";//sil
                        if (dim_degeri > 0) {
                            yerl_deger_http = "http://" + modul_ip + "/parametre?ONOFF=1&DIM=" + dim_degeri;
                            mqtt_deger = "0&1&" + dim_degeri;
                        }
                        else {
                            yerl_deger_http = "http://" + modul_ip + "/parametre?ONOFF=0&DIM=0";
                            mqtt_deger = "0&0&0";
                        }

                        if (modul_wifi_adi == "agyok") {

                        }
                        else {
                            if (WifiWizard2.isWifiEnabled()) {// wifi enabled ise
                                WifiWizard2.getConnectedSSID().then(function (SSID) {
                                    if (SSID == modul_wifi_adi) {//aynı ağa bağlıysak
                                        verihttpgonderisitici(yerl_deger_http).done((data) => {
                                            //İŞLEM TAMAMLANDI
                                            console.log("işlem tamam");
                                        }).fail(() => {// yerel ağda cihaz bulamazsak
                                            if (internetkontrol()) {
                                                if (mqttconnect == false) {
                                                    mqttduzbaglan(modul_server);
                                                }
                                                isiticimqttgonder(modul_mqtt_yol_publish, mqtt_deger);
                                            }//internet durum kontrol bit
                                            else {
                                                //hata verdi
                                                isiticihata('ZERUS UYARI!', 'Telefon herhangi bir internete bağlı değildir!', dim_id);
                                            }

                                        });//fail bitiş
                                    }
                                    else {// başka bir ağa bağlıysak
                                        if (mqttconnect == false) {
                                            mqttduzbaglan(modul_server);
                                        }
                                        isiticimqttgonder(modul_mqtt_yol_publish, mqtt_deger);
                                    }
                                }).cache(function (error) {//ssid ismini alamaz isek

                                });
                            }
                            else {//wifi kapalıysa
                                if (internetkontrol()) {//internet varsa
                                    if (mqttconnect == false) {
                                        mqttduzbaglan(modul_server);
                                    }
                                    isiticimqttgonder(modul_mqtt_yol_publish, mqtt_deger);
                                }
                                else {//internet yoksa
                                    isiticihata('ZERUS UYARI!', 'Telefon herhangi bir internete bağlı değildir!', dim_id);
                                }
                            }
                        }
                    },
                    function (tx, error) {
                        uyari("Veri Güncelleme Hatası", error.message);
                    }
                );
            }
        );
        }//kaydırma bitiş bekleme olayı bitiş

    });
    function verihttpgonderisitici(yerl_deger_http) {
        return $.get(yerl_deger_http, { "timeout": 2000 });
    }
    function isiticimqttgonder(modul_mqtt_yol_publish, mqtt_deger) {
        cordova.plugins.CordovaMqTTPlugin.publish({//publish basla
            topic: modul_mqtt_yol_publish,
            payload: mqtt_deger,
            qos: 0,
            retain: false,
            success: function (s) {
            },
            error: function (e) {
            }
        })//publish bit
    }

}
function modulisiticiayar(modul_id) {
    //üst menü ve ana div temizle
    masterdivtemizle();
    ustmenutemizle();
    //ilgili modülün bilgilerini çekerek işlem yap
    veritabani.vt.transaction(function (tx) {//veriyi çekiyoruz
        tx.executeSql("select * from cihaz where id=?",
            [modul_id],
            function (tx, results) {
                var modul_ismi = results.rows.item(0).modul_ismi;
                var modul_ip = results.rows.item(0).modul_ip;
                var modul_ssid = results.rows.item(0).modul_ssid;
                var modul_durum = results.rows.item(0).modul_durum;
                var modul_program = results.rows.item(0).modul_program;
                var modul_surum = results.rows.item(0).modul_surum;
                var modul_server = results.rows.item(0).modul_server;
                var modul_tetik = results.rows.item(0).modul_tetik;
                var modul_wifi_adi = results.rows.item(0).modul_wifi_adi;
                var kay_tel_ser_no = results.rows.item(0).tel_seri_no;
                var mev_tel_ser_no = device.serial;
                var sondurumbuton = "";
                if (kay_tel_ser_no != mev_tel_ser_no) { sondurumbuton = "disabled"; }
                if (modul_durum == 0) {
                    var ackapa_deger = '<option value="0" selected>Pasif</option><option value="1">Aktif</option>';
                }
                else {
                    var ackapa_deger = '<option value="0">Pasif</option><option value="1" selected>Aktif</option>';
                }

                var t = '<div class="ui-corner-all custom-corners">' +
                    '<div class="ui-bar ui-bar-a"><h5>AYARLAR</h5></div>' +
                    '<div class="ui-body ui-body-a">' +
                    '<div class="ui-grid-a">' +
                    '<div class="ui-field-contain">' +
                    '<label for="text-12">Modul İsmi:</label>' +
                    '<input type="text" id="modul_isim' + modul_id + '" name="text-12" id="text-12" value="' + modul_ismi + '" placeholder="' + modul_ismi + '">' +
                    '<button class="ui-btn ui-icon-check ui-btn-icon-left" onclick="isimdegis(\'' + modul_id + '\')">Değiştir</button>' +
                    '</div></div>' +
                    '<div class="ui-grid-a">' +
                    '<label for="sondurum' + modul_id + '">Mevcut Değerleri Koru:</label>' +
                    '<select ' + sondurumbuton + ' onchange="sondurum(\'' + modul_id + '\');" name="sondurum' + modul_id + '" id="sondurum' + modul_id + '" data-role="slider">' +
                    ackapa_deger + //burası yukarıdan degerleniyor+
                    '</select>' +
                    '</div>' +
                    '<div class="ui-grid-a"><button onclick="modulpaylas(\'' + modul_id + '\')" class="ui-btn ui-icon-forward ui-btn-icon-right">PAYLAŞ</button></div>' +
                    '<div class="ui-grid-a"><button onclick="modulsil(\'' + modul_id + '\')" class="ui-btn ui-icon-delete ui-btn-icon-right">SİL</button></div></div >' +
                    '<div id="paylas' + modul_id + '" class="ui-body ui-body-a"></div></div > ';
                $('#masterdiv').append(t);
                $('#masterdiv').trigger('create');
            },
            function (error) { uyari("Veritabanı Hatası", error.message); }
        );
    })

}