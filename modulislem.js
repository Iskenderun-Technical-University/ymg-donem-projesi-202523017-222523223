var durumacikkapali = [];
var kaydirmabeklet = 0;
function anaekranlistebasla() {
    masterdivtemizle();
    veritabani.vt.transaction(//
        function (tx) {
            tx.executeSql(
                "select * from cihaz",
                [],
                function (tx, results) {
                    anaekranliste(results);
                },
                function (tx, error) {
                    console.log("Veri Sıralama Hatası:", error.message);

                }
            );
        }
    );
}
function anaekranliste(results) {
    var luzunluk = results.rows.length;
    if (luzunluk > 0) {
        for (var i = 0; i < luzunluk; i++) {
            var modul_id = results.rows.item(i).id;
            var modul_ismi = results.rows.item(i).modul_ismi;
            var modul_tip = results.rows.item(i).modul_tip;
            var modul_ip = results.rows.item(i).modul_ip;
            var modul_durum = results.rows.item(i).modul_durum;
            var modul_program = results.rows.item(i).modul_program;
            var modul_surum = results.rows.item(i).modul_surum;
            var modul_deger = results.rows.item(i).modul_deger;
            var modul_server = results.rows.item(i).modul_server;
            var modul_tetik = results.rows.item(i).modul_tetik;
            var modul_wifi_adi = results.rows.item(i).modul_wifi_adi;
            switch (modul_tip) {
                case 'ISITICI': isitici(modul_id, modul_ismi, modul_tip, modul_ip, modul_durum, modul_program, modul_surum, modul_deger, modul_server, modul_tetik, modul_wifi_adi); 
                    break;
            }

        }
    }
}
function isimdegis(modul_id) {//modül ismini değiştirmek
    var mid = "modul_isim" + modul_id;
    var modul_yeni_isim = document.getElementById(mid).value;
    if (modul_yeni_isim == "") {
        modul_yeni_isim = "İSİMSİZ";
    }
    cihazvt.modulIsimDegis(modul_id, modul_yeni_isim);
    anasayfa();
}
function sondurum(modul_id) {//modül son durumunu korusun elektrik gidince
    var sondurum_id = "#sondurum" + modul_id;
    var sondurum_degeri = $(sondurum_id).val();
    veritabani.vt.transaction(function (tx) {//veriyi çekiyoruz
        tx.executeSql("select * from cihaz where id=?",
            [modul_id],
            function (tx, results) {
                var modul_ip = results.rows.item(0).modul_ip;
                var modul_ssid = results.rows.item(0).modul_ssid;
                var tel_seri_no = results.rows.item(0).tel_seri_no;
                var modul_server = "tcp://" + results.rows.item(0).modul_server;
                var yeni_deger = sondurum_degeri;
                var modul_mqtt_yol_publish = tel_seri_no + "/" + modul_ssid + "/PARAMETRE";
                var sondurum_http = "http://" + modul_ip + "/parametre?SD=" + sondurum_degeri;
                var modul_wifi_adi = results.rows.item(0).modul_wifi_adi;
                var mqtt_sd_deg = "";
                if (yeni_deger == 1) { mqtt_sd_deg = "3&0&0"; } else { mqtt_sd_deg = "4&0&0";}
                if (modul_wifi_adi == "agyok") {
                    // ap modda çalışma işlemi
                }
                else {
                    if (WifiWizard2.isWifiEnabled()) {// wifi enabled ise
                        WifiWizard2.getConnectedSSID().then(function (SSID) {
                            if (SSID == modul_wifi_adi) {//aynı ağa bağlıysak
                                durumdegishttp(sondurum_http).done((data) => {
                                    cihazvt.modulSondurumDegis(modul_id, yeni_deger);
                                }).fail(() => {// yerel ağda cihaz bulamazsak
                                    if (WifiWizard2.isConnectedToInternet()) {
                                        durumdegismqtt(modul_server, tel_seri_no, modul_mqtt_yol_publish, mqtt_sd_deg);
                                    }//internet durum kontrol bit
                                    else {
                                        //hata verdi
                                        isiticihata('ZERUS UYARI!', 'Telefon herhangi bir internete bağlı değildir!');
                                    }

                                });//fail bitiş
                            }
                            else {// başka bir ağa bağlıysak
                                durumdegismqtt(modul_server, tel_seri_no, modul_mqtt_yol_publish, mqtt_sd_deg);
                            }
                        }).cache(function (error) {//ssid ismini alamaz isek
                            durumdegismqtt(modul_server, tel_seri_no, modul_mqtt_yol_publish, mqtt_sd_deg);
                        });
                    }
                    else {//wifi kapalıysa
                        if (WifiWizard2.isConnectedToInternet()) {//internet varsa
                            durumdegismqtt(modul_server, tel_seri_no, modul_mqtt_yol_publish, mqtt_sd_deg);
                        }
                        else {//internet yoksa
                            isiticihata('ZERUS UYARI!', 'Telefon herhangi bir internete bağlı değildir!');
                        }
                    }
                    function durumdegishttp(sondurum_http) {//http üzerinden durum değişmek için son durumu
                        return $.get(sondurum_http, { "timeout": 2000 });
                    }
                    function durumdegismqtt(modul_server, tel_seri_no, modul_mqtt_yol_publish, mqtt_sd_deg) {//mqtt üzerinden durumu değişmek için
                        var dongusay = 0;
                        if (!mqttconnect) {
                            mqttduzbaglan()
                        }
                        degergonder();
                        //mqtt servere bağlantı yap
                        
                        function degergonder() {
                            WifiWizard2.timeout(500).then(function () {// 500 ms sonra publish yap
                                cordova.plugins.CordovaMqTTPlugin.publish({//publish basla
                                    topic: modul_mqtt_yol_publish,
                                    payload: mqtt_sd_deg,
                                    qos: 0,
                                    retain: false,
                                    success: function (s) {
                                        console.log("sondurum değşti");
                                        cihazvt.modulSondurumDegis(modul_id, yeni_deger);
                                    },
                                    error: function (e) {
                                        anasayfa();
                                    }
                                })//publish bit
                            });//timeout bit
                        }
                    }
                }

            },
            function (error) { uyari("Veritabanı Hatası", error.message); }
        );
    })

}
function modulpaylas(modul_id) {
    veritabani.vt.transaction(function (tx) {//veriyi çekiyoruz
        tx.executeSql("select * from cihaz where id=?",
            [modul_id],
            function (tx, results) {
                var modul_id = results.rows.item(0).id;//id no
                var modul_ssid = results.rows.item(0).modul_ssid;//
                var modul_ismi = results.rows.item(0).modul_ismi;//
                var modul_tip = results.rows.item(0).modul_tip;//
                var modul_ip = results.rows.item(0).modul_ip;//
                var modul_durum =0;//

                var modul_surum = results.rows.item(0).modul_surum;//
                var modul_deger = 0;//
                var modul_server = results.rows.item(0).modul_server;//
                var modul_tetik = results.rows.item(0).modul_tetik;//
                var modul_wifi_adi = results.rows.item(0).modul_wifi_adi;//
                var tel_seri_no = results.rows.item(0).tel_seri_no;//
                var tel_surum = "";//
                var diger = results.rows.item(0).diger;//

                var paylasid = "#paylas" + modul_id;
                var paylasim = modul_ssid + "," + modul_ismi + "," + modul_tip + "," + modul_ip + "," + modul_durum + ","+ modul_surum + "," + modul_server + "," + modul_wifi_adi + "," + tel_seri_no ;
                // console.log(paylasim);
                jQuery(paylasid).qrcode({
                    text: paylasim
                });
            },
            function (error) {  }//veritabanı hatası ver
        );
    })
}
function modulsil(modul_id) {
    $.confirm({
        title: 'Silmek İstediğinize Eminmisiniz?',
        content: 'Silme işlemi gerçekleşiyor',
        type: 'red',
        buttons: {
            ok: {
                text: "SİL!",
                btnClass: 'btn-primary',
                keys: ['enter'],
                action: function () {
                    silcalis(modul_id);
                }
            },
            cancel: function () {
                anasayfa();
            }
        }
    });
    function silcalis(modul_id) {
        veritabani.vt.transaction(
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
                        if (modul_wifi_adi == "agyok") {
                            //ap modda çalışma işlemi
                        }
                        else{
                        if (WifiWizard2.isWifiEnabled()) {// wifi enabled ise
                            WifiWizard2.getConnectedSSID().then(function (SSID) {
                                if (SSID == modul_wifi_adi) {//aynı ağa bağlıysak
                                    modulresetle(modul_ip).done((data) => {
                                        cihazvt.modulSil(modul_id);
                                        anasayfa();
                                    }).fail(() => {// yerel ağda cihaz bulamazsak
                                        if (internetkontrol()) {
                                            modulsilmqtt(modul_mqtt_yol_publish);
                                            cihazvt.modulSil(modul_id);
                                        }//internet durum kontrol bit
                                        else {
                                            //hata verdi
                                            cihazvt.modulSil(modul_id);
                                            modulresethata('NAYA UYARI!', 'Telefon herhangi bir internete bağlı değildir! Cihazı manuel resetleyiniz!');
                                        }

                                    });//fail bitiş
                                }
                                else {// başka bir ağa bağlıysak
                                    modulsilmqtt(modul_mqtt_yol_publish);
                                    cihazvt.modulSil(modul_id);
                                }
                            }).cache(function (error) {//ssid ismini alamaz isek
                                modulsilmqtt(modul_mqtt_yol_publish);
                                cihazvt.modulSil(modul_id);
                            });
                        }
                        else {//wifi kapalıysa
                            if (internetkontrol()) {//internet varsa
                                modulsilmqtt(modul_mqtt_yol_publish);
                                cihazvt.modulSil(modul_id);
                            }
                            else {//internet yoksa
                                cihazvt.modulSil(modul_id);
                                modulresethata('ZERUS UYARI!', 'Telefon herhangi bir internete bağlı değildir! Cihazı manuel resetleyiniz!');
                            }
                            }
                        }
                    },
                    function (tx, error) {
                       //uyarı verdir
                    }
                );
            }
        );
    }

}
function modulresetle(modul_ip) {
    var modul_status_http = "http://" + modul_ip + "/reset";
    return $.get(modul_status_http, { "timeout": 2000 });
}
function modulsilmqtt(modul_mqtt_yol_publish) {
    if (mqttconnect) {
        cordova.plugins.CordovaMqTTPlugin.publish({//publish basla
            topic: modul_mqtt_yol_publish,
            payload: "2&0&0",
            qos: 0,
            retain: false,
            success: function (s) {
                anasayfa();
            },
            error: function (e) {
                modulresethata('NAYA UYARI!', 'Modül internete üzerinden resetleme yapılamadı! Cihazı manuel resetleyiniz!');
            }
        })//publish bit
    }
    else {
        mqttduzbaglan();
        window.setTimeout(() => {
            cordova.plugins.CordovaMqTTPlugin.publish({//publish basla
                topic: modul_mqtt_yol_publish,
                payload: "2&0&0",
                qos: 0,
                retain: false,
                success: function (s) {
                    anasayfa();
                },
                error: function (e) {
                    modulresethata('NAYA UYARI!', 'Modül internete üzerinden resetleme yapılamadı! Cihazı manuel resetleyiniz!');
                }
            })//publish bit
        }, 2000);
    }
}
function modulresethata(baslik, mesaj) {
    $.confirm({
        title: baslik,
        content: mesaj,
        buttons: {
            Tamam: function () {
                anasayfa();
            }
        }
    });
}

