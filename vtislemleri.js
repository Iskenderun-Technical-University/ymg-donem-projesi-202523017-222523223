var veritabani = {
    vt: null,
    createDatabase: function () {
        this.vt = window.openDatabase(
            "veritabani.db",
            "1.0.0",
            "Moduller",
            1000000
        );
        this.vt.transaction(
            function (tx) {
                //burada sql komutlarını çalıştır
                tx.executeSql(
                    "CREATE TABLE IF NOT EXISTS cihaz( id integer primary key autoincrement NOT NULL,modul_ssid text,modul_ismi text, modul_tip text, modul_ip text,modul_durum text, modul_program text, modul_surum text, modul_deger text, modul_server text, modul_tetik text, modul_wifi_adi text, tel_seri_no text, tel_surum text, diger text)",
                    [],
                    function (tx, results) {},
                    function (tx, error) {
                        console.log("Tablo Hatası:" + error.message);
                    }
                );
            },
            function (error) {
                console.log("Veritabanı hata:" + error.message);
            },
            function () {
                console.log("Veritabanı başarıyla oluşturuldu");
            }
        );
    }
}

var cihazvt = {
    modulEkle: function (modul_ssid, modul_ismi, modul_tip, modul_ip, modul_durum, modul_program, modul_surum, modul_deger, modul_server, modul_tetik, modul_wifi_adi, tel_seri_no, tel_surum, diger) {
        veritabani.vt.transaction(
            function (tx) {
                tx.executeSql(
                    "insert into cihaz(modul_ssid,modul_ismi,modul_tip,modul_ip,modul_durum,modul_program,modul_surum,modul_deger,modul_server,modul_tetik,modul_wifi_adi,tel_seri_no,tel_surum,diger) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [modul_ssid, modul_ismi, modul_tip, modul_ip, modul_durum, modul_program, modul_surum, modul_deger, modul_server, modul_tetik, modul_wifi_adi, tel_seri_no, tel_surum, diger],
                    function (tx, results) { console.log("Kayıt eklendi"); },
                    function (tx, error) { console.log("Tablo Ekleme Hatası:", error.message); }
                );
            },
            function (error) { },
            function () { }
        )
    },
    modulSilSSID: function (modul_ssid) {
        veritabani.vt.transaction(
            function (tx) {
                tx.executeSql(
                    "delete from cihaz where modul_ssid=?",
                    [modul_ssid],
                    function (tx, results) { console.log("Kayıt silindi"); },
                    function (tx, error) { console.log("Kayıt Silme Hatası:", error.message); }
                );
            },
            function (error) { },
            function () { }
        )
    },
    modulIsimDegisSSID: function (modul_ssid, modul_ismi) {
        veritabani.vt.transaction(
            function (tx) {
                tx.executeSql(
                    "update cihaz set modul_ismi=? where modul_ssid=?",
                    [modul_ismi, modul_ssid],
                    function (tx, results) { console.log(modul_ssid + " değişti  " + modul_ismi); },
                    function (tx, error) { console.log("Kayıt güncelleme Hatası:", error.message); }
                );
            },
            function (error) { },
            function () { }
        )
    },
    modulIsimDegis: function (modul_id, modul_ismi) {
        veritabani.vt.transaction(
            function (tx) {
                tx.executeSql(
                    "update cihaz set modul_ismi=? where id=?",
                    [modul_ismi, modul_id],
                    function (tx, results) { console.log(modul_id + " değişti  " + modul_ismi); },
                    function (tx, error) { console.log("Kayıt güncelleme Hatası:", error.message); }
                );
            },
            function (error) { },
            function () { }
        )
    },
    modulSondurumDegis: function (modul_id, modul_durum) {
        veritabani.vt.transaction(
            function (tx) {
                tx.executeSql(
                    "update cihaz set modul_durum=? where id=?",
                    [modul_durum, modul_id],
                    function (tx, results) { console.log(modul_id + " değişti  " + modul_durum); },
                    function (tx, error) { console.log("Kayıt güncelleme Hatası:", error.message); }
                );
            },
            function (error) { },
            function () { }
        )
    },
    modulSil: function (modul_id) {
        veritabani.vt.transaction(
            function (tx) {
                tx.executeSql(
                    "delete from cihaz where id=?",
                    [modul_id],
                    function (tx, results) { console.log(modul_id + "= Silme Tamam  "); anasayfa(); },
                    function (tx, error) { console.log("Kayıt silme Hatası:", error.message); }
                );
            },
            function (error) { },
            function () { }
        )
    }

}