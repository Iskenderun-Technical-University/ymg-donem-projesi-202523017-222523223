function senaryoekranlistele() {
}
function senaryoekle() {
    masterdivtemizle();
    veritabani.vt.transaction(function (tx) {//veriyi çekiyoruz
        tx.executeSql("select * from cihaz",
            [],
            function (tx, results) {
                var modul_id;
                var modul_ismi;
                var modul_tip;
                var resim_yolu;
                var luzunluk = results.rows.length;
                var cihaz_liste = '<ul data-role="listview" data-split-icon="gear" data-split-theme="a" data-inset="true">';
                for(var i = 0; i < luzunluk; i++){
                modul_id = results.rows.item(i).id;//id no
                modul_ismi = results.rows.item(i).modul_ismi;//
                modul_tip = results.rows.item(i).modul_tip;//
                switch (modul_tip) {//resim yolu seçilir
                    case "ISITICI": resim_yolu = '<img src="images/isitici.png">'; break;
                    case "ANAHTAR": resim_yolu = '<img src="images/anahtar.png">'; break;
                    case "PRİZ": resim_yolu = '<img src="images/priz.png">'; break;
                    case "DIMMER": resim_yolu = '<img src="images/dimmer.png">'; break;
                    case "SICAKLIKOLCER": resim_yolu = '<img src="images/sicaklikolcer.png">'; break;
                    case "PANJUR": resim_yolu = '<img src="images/panjur.png">'; break;
                }
                cihaz_liste = cihaz_liste + '<li><a onclick="senaryoekle1(\'' + modul_id + '\',\'' + modul_ismi + '\',\'' + modul_tip +'\')">'+resim_yolu+'<h2>'+modul_ismi+'</h2><p>'+modul_tip+'</p></a></li>';
                }
                cihaz_liste = cihaz_liste + '</ul>';
                    $('#masterdiv').append(cihaz_liste);
                    $('#masterdiv').trigger('create');
            },
            function (error) { }//veritabanı hatası ver
        );
    })
}
function senaryoekle1(modul_id_ana, modul_ismi_ana, modul_tip_ana) {
    masterdivtemizle();
    veritabani.vt.transaction(function (tx) {//veriyi çekiyoruz
        tx.executeSql("select * from cihaz",
            [],
            function (tx, results) {
                var modul_id;
                var modul_ismi;
                var modul_tip;
                var resim_yolu;
                var luzunluk = results.rows.length;
                var cihaz_liste = '<ul data-role="listview" data-split-icon="gear" data-split-theme="a" data-inset="true">';
                for (var i = 0; i < luzunluk; i++) {
                    modul_id = results.rows.item(i).id;//id no
                    modul_ismi = results.rows.item(i).modul_ismi;//
                    modul_tip = results.rows.item(i).modul_tip;//
                    switch (modul_tip) {//resim yolu seçilir
                        case "ISITICI": resim_yolu = '<img src="images/isitici.png">'; break;
                        case "ANAHTAR": resim_yolu = '<img src="images/anahtar.png">'; break;
                        case "PRİZ": resim_yolu = '<img src="images/priz.png">'; break;
                        case "DIMMER": resim_yolu = '<img src="images/dimmer.png">'; break;
                        case "SICAKLIKOLCER": resim_yolu = '<img src="images/sicaklikolcer.png">'; break;
                        case "PANJUR": resim_yolu = '<img src="images/panjur.png">'; break;
                    }
                    if (modul_id != modul_id_ana){
                        cihaz_liste = cihaz_liste + '<li><a href="#" onclick="senaryoekle2(\'' + modul_id_ana + '\',\'' + modul_ismi_ana + '\',\'' + modul_tip_ana + '\',\'' + modul_id + '\',\'' + modul_ismi + '\',\'' + modul_tip+'\')">' + resim_yolu + '<h2>' + modul_ismi + '</h2><p>' + modul_tip + '</p></a></li>';
                        }
                    }
                cihaz_liste = cihaz_liste + '</ul>';
                $('#masterdiv').append(cihaz_liste);
                $('#masterdiv').trigger('create');
            },
            function (error) { }//veritabanı hatası ver
        );
    })

}

function senaryoekle2(modul_id_ana, modul_ismi_ana, modul_tip_ana, modul_id_slave, modul_ismi_slave, modul_tip_slave) {
    masterdivtemizle();
    switch (modul_tip_ana) {
        case 'ISITICI': isiticisenaryosu(modul_id_ana, modul_ismi_ana, modul_tip_ana, modul_id_slave, modul_ismi_slave, modul_tip_slave); break;
        case "ANAHTAR": anahtarsenaryosu(modul_id_ana, modul_ismi_ana, modul_tip_ana, modul_id_slave, modul_ismi_slave, modul_tip_slave); break;
        case "PRİZ": prizsenaryosu(modul_id_ana, modul_ismi_ana, modul_tip_ana, modul_id_slave, modul_ismi_slave, modul_tip_slave); break;
        case "DIMMER": dimmersenaryosu(modul_id_ana, modul_ismi_ana, modul_tip_ana, modul_id_slave, modul_ismi_slave, modul_tip_slave); break;
        case "SICAKLIKOLCER": sicaklikolcersenaryosu(modul_id_ana, modul_ismi_ana, modul_tip_ana, modul_id_slave, modul_ismi_slave, modul_tip_slave) ; break;
        case "PANJUR": panjursenaryosu(modul_id_ana, modul_ismi_ana, modul_tip_ana, modul_id_slave, modul_ismi_slave, modul_tip_slave); break;
    }
}
function isiticisenaryosu(modul_id_ana, modul_ismi_ana, modul_tip_ana, modul_id_slave, modul_ismi_slave, modul_tip_slave) {
    var art = '<fieldset data-role="controlgroup" style="border:solid 1px;">' +
            '<legend>Tetikleyici ' + modul_ismi_ana + ' Isıtıcısı Açık/Kapalı durumunu seçiniz!</legend>' +
        '<label for="flip-checkbox-1">' + modul_tip_ana + '</label>' +
            '<input type="checkbox" data-role="flipswitch" name="flip-checkbox-1" id="' + modul_id_ana + '">' +
        '</fieldset>' +
        '<fieldset data-role="controlgroup" style="border:solid 1px;">' +
            '<legend>Tetiklenecek ' + modul_ismi_slave + ' durumunun nasıl çalışacağını aşağıdan seçiniz!</legend>' +
                '<input type="radio" name="deger" id="sec1" value="esit">' +
                '<label for="sec1">' + modul_ismi_ana + ' modülü ile eşlenik çalışsın</label>' +
                '<input type="radio" name="deger" id="sec2" value="ters">' +
                '<label for="sec2">' + modul_ismi_ana + ' modülü ile ters çalışsın</label>' +
        '</fieldset>' +
        '<fieldset data-role="controlgroup" style="border:solid 1px;">' +
        '<input type="text" name="senaryoadi" id="senaryoadi" value="Senaryo Adı">' +
        '<label for="senaryoadi">Senaryo Adını Giriniz</label>' +
        '<button class="ui-btn" onclick="senaryoisiticikayit()">KAYDET</button>'+
        '</fieldset>';
    $('#masterdiv').append(art);
    $('#masterdiv').trigger('create');
}
function senaryoisiticikayit() {
    $('input[name="deger"]:checked').each(function () {
        var i = this.value;
        //gurp adinı yazacaksın dizi olarak
        alert(i+"sonadim");

    });

    
}