# Veriler

Bu çalışmada duygu analizi için işaretlenmiş **Türkçe BOUN Veri Seti**'ni kullandık. Ardından, sonuçları iyileştirmek için Twitter’dan topladığımız **Mandalina Emoji Veri Seti**'ni tanıtıp kullanıyoruz.


## BOUN Twitter Veri Seti
BOUN Twitter veri seti, Türkçe duygu analizi konusunda 2018 yılında toplanmış bir veri setidir. Toplamda 7964 twitten ve 3 duygudan oluşuyor: Pozitif, Negatif, Nötr

|         | Eğitim Seti | Doğrulama Seti | Test Seti | Toplam |
|---------|:-----------:|:--------------:|:---------:|--------|
| Pozitif |     1691    |       188      |    469    |  2348  |
| Negatif |     1008    |       113      |    280    |  1401  |
| Nötr    |     3034    |       338      |    843    |  4215  |
| Toplam  |     5733    |       639      |    1592   |    X   |

İndirmek için [bu repoda](https://github.com/akoksal/BERT-Sentiment-Analysis-Turkish) paylaşılan [bu linki](https://drive.google.com/file/d/1jnIoobE2qHDO0FtveWjPIx2KSji35thI/view?usp=sharing) kullanabilirsiniz.

## Mandalina Emoji Veri Seti
Mandalina Emoji Veri Seti, Türkçe duygu analizi modellerin geliştirilmesi için uzak gözetimle (distant supervision) toplanmış bir veridir. [Unicode.org](https://unicode.org/emoji/charts/full-emoji-list.html)'da paylaşılan emojiler ve kategorileri üzerinden toplanan bu veride toplam 767.197 twit için 67 emoji ve 8 kategori bulunmaktadır. Verilerin dağılımı için: 


Örnek veri için *emoji_sample.csv* dosyasına bakabilirsiniz. Verinin tamamını indirmek için [buraya](https://drive.google.com/file/d/1z9un8GnaHH2--07yS0O_4jM88vNG14nv/view?usp=sharing) tıklayınız.

---
**Not**

Bu iki veri de Twitter üzerinden çekilmiştir. Twitter lisansı sebebiyle alakalı twitlerin sadece ID'si paylaşılabilmektedir. Twitter API ile bu ID'ler üzerinden twitleri çekebilirsiniz.

---
