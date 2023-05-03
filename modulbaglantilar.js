var cihaz_ssid_no;
var cihaz_parola = "12345678";
var baglanilacak_wifi_ssid;
var baglanilacak_wifi_parola;
/*
1- fonksiyon modulekle - izinler alınırd
2- fonksiyon wifiara - wifi açık değilse açılır etraftaki bütün wifi ler bulunur
3- fonksiyon wifiliste
 */
function modulekle() {
    wifiara();
}
function wifiara() {
    if (WifiWizard2.isWifiEnabled()) {
        $.mobile.loading("show", {
            text: "Modüller aranıyor...",
            textVisible: true,
            theme: "b",
            html: ""
        });
        WifiWizard.startScan(() => { WifiWizard.getScanResults({ numLevels: false }, wifiliste, wifilistehata) }, wifiaramahata);
    }
}
function wifiliste(wifilist) {
    masterdivtemizle();
    if (wifilist.length > 0) { masterdivtemizle(); modulkayitustmenu1();modulkayitaltmenu(); }
    var kon = 0;
    for (var i = 0; i < wifilist.length; i++) {
        
        var cihazssid = wifilist[i].SSID;
        if (cihazssid.substr(0, 6) == "HONOFF") {
            var tip = cihaztipi(cihazssid);
            var r = "<a class='ui-btn ui-btn-up-b ui-grid-solo ui-icon-arrow-r ui-btn-icon-right' onclick='genelwifilistesi(\"" + cihazssid + "\")' id='" + cihazssid + "' data-icon='arrow-r' data-theme='a'>" + tip + "</a >";
            $('#masterdiv').append(r);
            $('#masterdiv').trigger('create');
            kon = kon + 1;
            $.mobile.loading("hide");
        }
    }
    if (kon == 0) {
        $.confirm({
            title: 'ZERUS UYARI!',
            content: 'Herhangi bir modül bulunamamıştır.',
            buttons: {
                Tamam: function () {
                    $.mobile.loading("hide");
                    anasayfa();
                }
            }
        });
    }
}
function genelwifilistesi(cihazssid) {
    cihaz_ssid_no = cihazssid;//genel değişkene kayıt olunacak modülü atadık
    var wifi_net = WifiWizard2.formatWifiConfig(cihaz_ssid_no, cihaz_parola, 'WPA');
    WifiWizard2.add(wifi_net);
        WifiWizard.startScan(() => {
            WifiWizard.getScanResults({ numLevels: false }, genelwifilistegoster, wifilistehata)
        }, wifiaramahata);

}
function genelwifilistegoster(sonuc) {
    masterdivtemizle();
    var kontrol = 0;
    $.mobile.loading( "show", {
  text: "Bağlanılacak Router veya Modem Aranıyor...",
  textVisible: true,
  theme: "b",
  html: ""
    });
    modulkayitustmenu2();
    var ul_l = '<div class="ui-field-contain"><label for="select-native-1">Wifi Listesi:</label>'
        + '<select name="select-native-1" id="wifiadi">'
        + '<option  value="agyok" selected="selected" > Direk Bağlantı(AĞ ve İnternet Yok)</option>';
    var r = "";
    for (var i = 0; i < sonuc.length; i++) {
        var cihazssid = sonuc[i].SSID;
        if (cihazssid.substr(0, 6) != "HONOFF") {//cihazları listenin içine döşedin
            kontrol = kontrol + 1;
            var r = r + "<option value='" + cihazssid + "'>" + cihazssid + "</option>";
        }
    }
    ul_l = ul_l + r + "</select>"
        + '<label for="text-parola">Şifre:</label><input class="input" placeholder="Wifi Şifresini Giriniz" type="text" name="text-parola" id="parola"></br>'
        + '<button class="ui-shadow ui-btn ui-corner-all" onclick="modulukaydet();">İLERİ</button></div>';
    if (kontrol > 0) {//eğer bağlanılacak modem veya router kontrolu yapar
        $.mobile.loading("hide");
    $('#masterdiv').append(ul_l);
    $('#masterdiv').trigger('create');
    }
    else {
        $.confirm({
            title: 'ZERUS UYARI!',
            content: 'Herhangi bir modem veya kablosuz aygıt bulunamadı...',
            buttons: {
                Tamam: function () {
                    $.mobile.loading("hide");
                    anasayfa();
                }
            }
        });
    }
}
function modulukaydet() {
    baglanilacak_wifi_ssid = document.getElementById("wifiadi").value;
    baglanilacak_wifi_parola = document.getElementById("parola").value;
    masterdivtemizle();
    $.mobile.loading("show", {
        text: "Entegrasyon sağlanıyor...",
        textVisible: true,
        theme: "b",
        html: ""
    });
    var platform = device.platform;
    switch (platform) {
        case 'Android':
            WifiWizard.listNetworks(kayitliaktifliste, function () { baglatiyap();});
            function kayitliaktifliste(as) {
                var cihazkayitlimi = 0;
                WifiWizard2.timeout(3000).then(function () {
                    for (var i = 0; i < as.length; i++){
                        var listeson = as[i].substring(1, as[i].length - 1);
                        if (cihaz_ssid_no == listeson) {
                            cihazkayitlimi = cihazkayitlimi + 1;
                        }
                    }
                    if (cihazkayitlimi > 0) {
                        WifiWizard2.disconnect(cihaz_ssid_no);
                        WifiWizard2.timeout(10000).then(function () {
                            baglatiyap();
                        });
                    } else {
                        baglatiyap();
                    }
                });
            }

                ; break;
        case 'iOS':
            var wifi_network = WifiWizard2.formatWifiConfig(s, p, 'WPA');
            WifiWizard2.add(wifi_network);
            WifiWizard2.iOSConnectNetwork(cihaz_ssid_no, p);
            //ios için buraya gelecek
            ; break;
    }
}
function baglatiyap() {
    var wifi_net = WifiWizard2.formatWifiConfig(cihaz_ssid_no, cihaz_parola, 'WPA');
    WifiWizard2.add(wifi_net);
    WifiWizard2.timeout(3000).then(function () {
        $.mobile.loading("hide");
        $.mobile.loading("show", {
            text: "Cihaz Kaydediliyor...",
            textVisible: true,
            theme: "b",
            html: ""
        });
        WifiWizard2.connect(cihaz_ssid_no, true, cihaz_parola, 'WPA');
        WifiWizard2.timeout(5000).then(function () {
            cihazkayit();
        });
    });
}

function cihazkayit() {
    modulkayitustmenu3();
    if (baglanilacak_wifi_ssid == "agyok") {agyokkayit()}
    else { agvarkayit()}
}
function agyokkayit(){}
function agvarkayit() {
    $.mobile.loading("hide");
    masterdivtemizle();
    $.mobile.loading("show", {
        text: "Cihaz Kayıt Son Adım...",
        textVisible: true,
        theme: "b",
        html: ""
    });

    var modul_ssid = cihaz_ssid_no;
    var modul_ismi = "ZerUs" + isim_olustur();
    var modul_tip = cihaztipi(cihaz_ssid_no);
    var modul_ip = "";
    var modul_durum = 0;
    var modul_program = "";
    var modul_surum = "";
    var modul_deger = 0;//modülün dim değeri yeterlidir
    var modul_server = modul_server_adi;
    var modul_tetik = "0";
    var modul_wifi_adi = baglanilacak_wifi_ssid;
    var tel_seri_no = device.serial;
    var tel_surum = device.version;
    var diger = "";
    //
    WifiWizard2.getConnectedSSID().then(function (SSID) { kayit_bit(); }).cache(function (error) { baglatiyap(); });
    function kayit_bit(){
    var cihazkaydet = "http://192.168.4.1/wifisave?s=" + baglanilacak_wifi_ssid + "&p=" + baglanilacak_wifi_parola + "&m=" + modul_server_adi + "&pr=" + port_no + "&t=" + tel_seri_no;
    var cihazbilgileri = "http://192.168.4.1/status";
    var cihazkayitkapa = "http://192.168.4.1/close";

    window.setTimeout(wifisave(), 3000);
    var kayitkontrol = 0;
    function wifisave() {
        $.ajax({
            type: 'GET',
            url: cihazkaydet,
            timeout:5000,
            success: function () {
                window.setTimeout(cihazbilgi(), 2000);
            },
            error: function () {
                kayitkontrol = kayitkontrol + 1;
                if (kayitkontrol>4){
                    $.confirm({ title: 'Cihazı resetleyerek kapatıp açınız ve telefonunuzun wifi listesinden silerek tekrardan tanıtınız...', buttons: { Tamam: function () { anasayfa(); } } });
                }
                else {
                    console.log("wifisave tekrardan" + kayitkontrol);
                    WifiWizard2.reconnect(cihaz_ssid_no);
                    WifiWizard2.timeout(4000).then(function () {
                        wifisave();
                    });
                }
            }
        });
    }
    function cihazbilgi() {
        $.ajax({
            type: 'GET',
            url: cihazbilgileri,
            timeout: 5000,
            success: function (data) {
                window.setTimeout(cihazikapa(data), 2000);
            },
            error: function () {
                WifiWizard2.reconnect(cihaz_ssid_no);
                WifiWizard2.timeout(5000).then(function () {
                    wifisave();
                });
            }
        });
    }
        function cihazikapa(data) {
            $.ajax({
                type: 'GET',
                url: cihazkayitkapa,
                timeout: 5000,
                success: function () {
                    modul_surum = data["Cihaz_VER"];
                    modul_ip = data["Station_IP"];
                    $.mobile.loading("hide");
                    //veritabanından kontrol ediyoruz
                    veritabani.vt.transaction(function (tx) {//veriyi çekiyoruz
                        tx.executeSql("select * from cihaz WHERE modul_ssid=? ",
                            [modul_ssid],
                            function (tx, results) {
                                var verivarmi = results.rows.length;
                                if (verivarmi > 0) {
                                    masterdivtemizle();
                                    cihazvt.modulSilSSID(modul_ssid);
                                    console.log("Modül silinip eklendi tekrardan:" + modul_ssid + "-" + modul_ismi + "-" + modul_tip + "-" + modul_ip + "-" + modul_durum + "-" + modul_program + "-" + modul_surum + "-" + modul_deger + "-" + modul_server + "-" + modul_tetik + "-" + modul_wifi_adi + "-" + tel_seri_no + "-" + tel_surum + "-" + diger);
                                    cihazvt.modulEkle(modul_ssid, modul_ismi, modul_tip, modul_ip, modul_durum, modul_program, modul_surum, modul_deger, modul_server, modul_tetik, modul_wifi_adi, tel_seri_no, tel_surum, diger);
                                    modul_kayit_isim_degis(modul_ismi, modul_ssid);
                                }
                                else {
                                    console.log("Modül ilk defa eklendi:" + modul_ssid + "-" + modul_ismi + "-" + modul_tip + "-" + modul_ip + "-" + modul_durum + "-" + modul_program + "-" + modul_surum + "-" + modul_deger + "-" + modul_server + "-" + modul_tetik + "-" + modul_wifi_adi + "-" + tel_seri_no + "-" + tel_surum + "-" + diger);
                                    cihazvt.modulEkle(modul_ssid, modul_ismi, modul_tip, modul_ip, modul_durum, modul_program, modul_surum, modul_deger, modul_server, modul_tetik, modul_wifi_adi, tel_seri_no, tel_surum, diger);
                                    modul_kayit_isim_degis(modul_ismi, modul_ssid);
                                }
                            },
                            function (error) { veritabanieklemehatasi(); }
                        );
                    });
                },
                error: function () {
                    WifiWizard2.reconnect(cihaz_ssid_no);
                    WifiWizard2.timeout(5000).then(function () {
                        wifisave();
                    });
                }
            });
        }
    }
}

function cihaztipi(cihazssid) {//cihazın tipini ekranda göstermek içindir
    var tip = cihazssid.substr(0, 8);
    switch (tip) {
        case 'HONOFF01': return "ISITICI"; break;
        case 'HONOFF02': return "LAMBA ANAHTARI"; break;
        case 'HONOFF03': return "PRİZ"; break;
        case 'HONOFF04': return "KUMANDALI ALET"; break;
    }
}
function isim_olustur() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function modul_kayit_isim_degis(eski_isim, cihaz_ssid_ismi) {
    $.confirm({
        title: 'Başarılı Kayıt...',
        content: '' +
        '<form action="" class="formName">' +
        '<div class="form-group">' +
        '<label>Modüle yeni isim verebilirsiniz!</label>' +
        '<input type="text" value="' + eski_isim +'" placeholder="' + eski_isim+'" class="modulyeniisim form-control" required />' +
        '</div>' +
        '</form>',
        buttons: {
            formSubmit: {
                text: 'Kaydet',
                btnClass: 'btn-blue',
                action: function () {
                    var yeni_isim = this.$content.find('.modulyeniisim').val();
                    cihazvt.modulIsimDegisSSID(cihaz_ssid_ismi, yeni_isim);
                    anasayfa();
                }
            }
        },
        onContentReady: function () {
            // bind to events
            var jc = this;
            this.$content.find('form').on('submit', function (e) {
                // if the user submits the form by pressing enter in the field.
                e.preventDefault();
                jc.$$formSubmit.trigger('click'); // reference the button and click it
            });
        }
    });
}