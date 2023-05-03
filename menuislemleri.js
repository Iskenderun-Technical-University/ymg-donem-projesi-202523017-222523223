function masterdivtemizle() {
    var myNode = document.getElementById("masterdiv");// masterdiv div içini temizle
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}
function ustmenutemizle() {
    var myNode = document.getElementById("ustmenu");//nav div içini temizle
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}
function altmenutemizle() {
    var myNode = document.getElementById("altmenu");//footer div içini temizle
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}
function masterdivtemizle() {
    var myNode = document.getElementById("masterdiv");//nav div içini temizle
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}
function ustmenuolustur() {
    ustmenutemizle();
    var ust_1 = ' <a onclick="anasayfa();" style="background-color:transparent;color:black;border-color:#0071bc;" class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-eye ui-btn-b">Cihazlar</a>'
        + '<a onclick="senaryo();" style="background-color:transparent;color:black;border-color:#0071bc;" class="ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-star ui-btn-b">Senaryo</a>';
    $('#ustmenu').append(ust_1);
    $('#ustmenu').trigger('create');
}
function altmenuolustur() {
    altmenutemizle();
    var alt_1 = '<div class="ui-block-a" style="text-align:center;"><a style="zoom: 140%;margin:auto;" onclick="anasayfa()" class="ui-btn ui-btn-b ui-icon-home ui-btn-icon-notext ui-corner-all">Anasayfa</a></div>'
            +'<div class="ui-block-b" style="text-align:center;" > <a style="zoom: 140%;margin:auto;" onclick="modulekle()" class="ui-btn ui-btn-b ui-icon-plus ui-btn-icon-notext ui-corner-all">Ekle</a></div >'
            +'<div class="ui-block-c" style="text-align:center;"><a style="zoom: 140%;margin:auto;" onclick="kullanici()" class="ui-btn ui-btn-b ui-icon-user ui-btn-icon-notext ui-corner-all">Kullanici</a></div>';
    $('#altmenu').append(alt_1);
    $('#altmenu').trigger('create');
}
function senaryoaltmenuolustur() {
    altmenutemizle();
    var alt_1 = '<div class="ui-grid-solo" style="text-align:center;" >'
        + '<a style="with:100%;zoom: 110%;margin:auto;" onclick="senaryoekle()" class="ui-btn ui-icon-plus ui-btn-icon-left ui-corner-all">Senaryo</a>'
        + '<a style="with:100%;zoom: 110%;margin:auto;" onclick="gruplandir()"  class="ui-btn ui-icon-plus ui-btn-icon-left ui-corner-all">Grupla_</a></div >';
    $('#altmenu').append(alt_1);
    $('#altmenu').trigger('create');
}
function modulkayitaltmenu(){
    altmenutemizle();
    var alt_1 = '<div class="ui-block-a" style="text-align:center;"></div>'
        + '<div class="ui-block-b" style="text-align:center;"><a style="zoom: 140%;margin:auto;" onclick="anasayfa()" class="ui-btn ui-btn-b ui-icon-home ui-btn-icon-notext ui-corner-all">Anasayfa</a></div >'
        + '<div class="ui-block-c" style="text-align:center;"></div>';
    $('#altmenu').append(alt_1);
    $('#altmenu').trigger('create');
}
function modulkayitustmenu1() {
    ustmenutemizle();
    var ust_1 = '<div class="ui-field-contain"><fieldset data-role="controlgroup" data-type="horizontal">'
        +'<img src="images/r1.png"><img src="images/yanok.png"><img src="images/2.png">'
        +'<img src="images/yanok.png"><img src="images/3.png"></fieldset></div>';
    $('#ustmenu').append(ust_1);
    $('#ustmenu').trigger('create');
}
function modulkayitustmenu2() {
    ustmenutemizle();
    var ust_1 = '<div class="ui-field-contain"><fieldset data-role="controlgroup" data-type="horizontal">'
        +'<img src="images/1.png"><img src="images/yanok.png"><img src="images/r2.png">'
        +'<img src="images/yanok.png"><img src="images/3.png"></fieldset></div>';
    $('#ustmenu').append(ust_1);
    $('#ustmenu').trigger('create');
}
function modulkayitustmenu3() {
    ustmenutemizle();
    var ust_1 = '<div class="ui-field-contain"><fieldset data-role="controlgroup" data-type="horizontal">'
        +'<img src="images/1.png"><img src="images/yanok.png"><img src="images/2.png">'
        +'<img src="images/yanok.png"><img src="images/r3.png"></fieldset></div>';
    $('#ustmenu').append(ust_1);
    $('#ustmenu').trigger('create');
}
function anasayfa() {
    durumacikkapali = [];
    $.mobile.loading("hide");
    ustmenuolustur();
    masterdivtemizle();
    altmenuolustur();
    anaekranlistebasla();
}
function senaryo() {
    masterdivtemizle();
    altmenutemizle();
    senaryoaltmenuolustur();
    senaryoekranlistele();
}
