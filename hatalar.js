function networkhata() { }//ağ hatası
function wifiaramahata(){}//wifi arama hatası
function wifilistehata(){}//wifi listesini gösterme hatası
function wifiacmahata(){}//telefonun wifi yi aktif yapma hatası
function mod_bag_hata() { $.mobile.loading("hide");}//module wifiden bağlanma hatası
function tel_net_ek_hata() { $.mobile.loading("hide");}//telefonun wifi listesine modulü ekleme hatası
function mssidalhata(){}//mevcut ssid ismini alma hatası
function modul_hata_kayit_tekrar() { }//modül önceden kayıt yapılmış anasayfaya gönder
function veritabanieklemehatasi(){}//modül eklerken veritabanına ekleme hatası
function wifiparolayanlis() {
    $.confirm({
        title: 'ZERUS UYARI!',
        content: 'Wifi Şifresini yanlış girdiniz lütfen en baştan tekrar deneyiniz',
        buttons: {
            Tamam: function () {
                $.mobile.loading("hide");
                anasayfa();
            }
        }
    });
}