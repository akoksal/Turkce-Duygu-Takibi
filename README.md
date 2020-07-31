[![sentmon](https://github.com/akoksal/Turkce-Duygu-Takibi/blob/medya/logo.png)](http://sentmon.herokuapp.com/)
### Türkçe Duygu Takip Sistemi
[![Python 3.7](https://img.shields.io/badge/python-3.7-blue.svg)](https://www.python.org/downloads/release/python-370/) [![Node version](https://badgen.net/badge/node/6.14.5/red?icon=npm&label)](https://nodejs.org/en/download/)  [![Pg version](https://badgen.net/badge/postgresql/12/blue?icon=postgresql)](https://www.postgresql.org/download/) [![Website](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](http://sentmon.herokuapp.com)


Sentmon, Türkçe Twitter paylaşımlarının içeriklerinin analizini kullanıcılara sunan online bir Doğal Dil İşleme aracıdır. Sorgulanan özneyle ilgili sosyal medya kullanıcılarının tutumu hakkında bir fikir vermesi amaçlanmıştır. Kendi özel sorgunuzla arama yapabilir, duygusal puanlamanın zaman içerisindeki değişimini inceleyebilir ve belirli günlerde öne çıkan twitleri Sentmon aracılığıyla görüntüleyebilirsiniz!


***


#### Problem Tanımı
Verilen bir metin için, bu metnin içerdiği duyguyu üç sınıf içerisinden (pozitif, negatif, nötr) tahmin etmeyi hedefler. Basitçe bir sınıflandırma problemidir. Bu senaryoda ise aynı zamanda verilen bir sorguyu içeren metinlerin zaman içerisindeki değişimi incelenmek istenmektedir. Ayrıca emoji içeren metinler kullanılarak problemin başarısını arttırılması hedeflenmektedir.

***

#### Katkılarımız
**Veri** : 67 farklı emoji ve 8 farklı duygu kategorisi için 767.197 Türkçe twit açık bir şekilde paylaşıldı. [İndirme linki](https://drive.google.com/file/d/1z9un8GnaHH2--07yS0O_4jM88vNG14nv/view?usp=sharing) ve [Detaylar](https://github.com/akoksal/Turkce-Duygu-Takibi/tree/master/Veriler)

![](https://live.staticflickr.com/65535/50173104533_c91a57f27e.jpg)

**Kapsamlı Üst Değişken Araması** : Multilingual BERT, BerTurk ve Damıtılmış (Distilled) BerTurk için 216 farklı senaryoyu dikkate alan kapsamlı bir üst değişken araması ve [detaylı analizi](https://github.com/akoksal/Turkce-Duygu-Takibi/blob/master/Eg%CC%86itim/%C4%B0nce%20Ayar%20Analizleri.ipynb)

![](https://live.staticflickr.com/65535/50173524568_44e146ba0c_z.jpg)

**Emoji Tabanlı İki Farklı Ön Eğitim** : Transformer modellerinin, dil modelleriyle beraber ön eğitimi için iki farklı yaklaşımın sunulması ve bunların [ayrıntılı açıklaması](https://github.com/akoksal/Turkce-Duygu-Takibi/tree/master/Eg%CC%86itim#%C3%B6n-e%C4%9Fitim)

![](https://live.staticflickr.com/65535/50174348517_25545f3bb8.jpg)

**Hızlandırılmış Modeller** :  Geliştirilen modellerin ONNX formatında ekran kartsız serverlarda da hızlıca çalışmasıyla ortaya çıkan işlenmiş modellerin açık bir şekilde paylaşılması. [İndirme linki](https://drive.google.com/file/d/1NWlShIdsEb543J6yIPCyKsANAHCwSR8X/view?usp=sharing) ve [Detaylar](https://github.com/akoksal/Turkce-Duygu-Takibi/tree/master/Sorgu)

**Site** : Geliştirdiğimiz en hızlı ve en iyi sonuç veren modellerle Türkçe, açık kaynaklı ve ücretsiz ilk duygu analizi takip sistemi sitesi: [sentmon.herokuapp.com](http://sentmon.herokuapp.com/)

***

## Takım

[![Abdullatif](https://github.com/akoksal/Turkce-Duygu-Takibi/blob/medya/abdullatif.png)](https://github.com/akoksal)[![Erkam](https://github.com/akoksal/Turkce-Duygu-Takibi/blob/medya/erkam.png)](https://github.com/erkams)[![Alperen](https://github.com/akoksal/Turkce-Duygu-Takibi/blob/medya/alperen.png)](https://github.com/ayakut16)[![Melih](https://github.com/akoksal/Turkce-Duygu-Takibi/blob/medya/melih.png)](https://github.com/melihmutlu)



*Bu proje [Açık Hackathon](https://www.acikhack.com/)'a katılmak amacıyla :tangerine:Mandalina ekibi tarafından geliştirilmiştir.*
