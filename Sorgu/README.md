# Sorgu
Sorgulama için verilen herhangi bir sorgu metni için tüm twitleri çekip analiz eden ve bunları günlük hacim ve ortalama duygu skoruna göre raporlayan bir kod ekledik.

```script
./query.sh "sorgu metni" "sorgu.json" 
```

Bu şekilde çalıştırıldığında verilen sorgu metni için sorgu.json dosyasında 1250 twitin duygu değerleri paylaşılıyor. Ardından sorgu_volume.json dosyasında günlük hacim ve ortalama duygu skorları bulunan bir json dosyası oluşturuluyor.


## 1. [Twitter'dan Veri Çekme](https://github.com/akoksal/Turkce-Duygu-Takibi/blob/master/Sorgu/tweetscraper_bocek.py)
Twitter'dan veri çekmek için [TweetScraper kütüphanesini](https://github.com/jonbakerfish/TweetScraper/) Türkçe dili için sorgulamaya açık tuttuk. Daha fazla etki uyandıran twitleri yakalamak adına top_tweets bayrağını da kullandık. Sonuç olarak verilen bir sorgu için son bir aydaki trend olmuş 500 twiti ve yine son bir ay için her gün trende girmemiş 25 twiti çektik. 
## 2. [Çıkarım Yapma ve Hızlandırma](https://github.com/akoksal/Turkce-Duygu-Takibi/blob/master/Sorgu/onnx_tahmin.py)
Eğittiğimiz modelden verilen bir metin için duygu çıkarımı yapmak için bazı geliştirmeler yapmamız gerekti. Ekran kartlı sunucu maliyetleri CPUlu sunuculardan ciddi seviyede daha fazla olduğu için, CPU için bazı optimizasyonlar yapmamız gerekti.

[Eğitim](https://github.com/akoksal/Turkce-Duygu-Takibi/tree/master/Eg%CC%86itim) aşamasında elde ettiğimiz en iyi ve hızlı modeli (Distilled BerTurk) [ONNX](https://github.com/onnx/onnx) kütüphanesini kullanarak çıkarım modu için hazır hale getirdik. Karşılaştırmalarımıza göre 16 GB RAM ve 4 çekirdeğe sahip bir makinede ciddi hız artışı elde ettik. CPU üzerinde %40'a yakın hız artışı elde ettik ve bu da daha fazla twiti analiz edebilmemize imkan sağladı.

|                                  | PyTorch Eğitim Modu | Pytorch No Grad Modu | ONNX Çıkarım Modu |
|----------------------------------|:-------------------:|:--------------------:|:-----------------:|
| 1000 Twit için Duygu Tespit Hızı |      99.86 sn.      |       79.65 sn.      |     55.73 sn.     |
