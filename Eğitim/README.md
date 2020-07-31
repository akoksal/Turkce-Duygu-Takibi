# Eğitim

Bu bölümde hem ön eğitim (pretraining) aşaması için hem de ince ayar (finetuning) aşaması için gerekli kodlar paylaşıldı.

### Kodlar
*[İnce Ayar.ipynb](https://github.com/akoksal/Turkce-Duygu-Takibi/blob/master/Eg%CC%86itim/%C4%B0nce%20Ayar.ipynb)*: Farklı transformer modelleri, optimizerlar, eğitim oranları ve weight decayler için verilen bir konfigürasyon için BOUN Twitter veri seti üzerinden model eğitiliyor.

*[İnce Ayar Analizleri.ipynb](https://github.com/akoksal/Turkce-Duygu-Takibi/blob/master/Eg%CC%86itim/%C4%B0nce%20Ayar%20Analizleri.ipynb)*: Belirtilen farklı konfigürasyonların karşılaştırılması ve detaylı analizinin paylaşıldığı notebook. 

*[Ön Eğitim - Sınıflandırma.ipynb](https://github.com/akoksal/Turkce-Duygu-Takibi/blob/master/Eg%CC%86itim/%C3%96n%20E%C4%9Fitim%20-%20S%C4%B1n%C4%B1fland%C4%B1rma.ipynb)*: Emojileri kullanarak yapılan emoji kategorilerini tahmin eden ilk ön eğitim tekniği. Detaylı açıklaması için notebook'a veya aşağıya bakabilirsiniz.

*[Ön Eğitim - Eşli Sınıflandırma.ipynb](https://github.com/akoksal/Turkce-Duygu-Takibi/blob/master/Eg%CC%86itim/%C3%96n%20E%C4%9Fitim%20-%20E%C5%9Fli%20S%C4%B1n%C4%B1fland%C4%B1rma.ipynb)*: Emojileri kullanarak yapılan ikili sınıflandırma yapan ikinci ön eğitim tekniği. Detaylı açıklaması için notebook'a veya aşağıya bakabilirsiniz.


## İnce Ayar

Bu çalışmada çeşitli transformer modellerini farklı ince ayar (finetuning) eğitim senaryoları için **doğrulama setindeki doğruluk skoru** üzerinden karşılaştırdık. Toplamda 216 farklı senaryo karşılaştırılmıştır.

### 1. Transformers 

Kullanılan transformer modelleri:
* [Multilingual BERT](https://github.com/google-research/bert) : Multilingual BERT, Google tarafından 104 dil için Wikipedia üzerinden eğitilmiş bir modeldir.
* [BerTurk](https://huggingface.co/dbmdz/bert-base-turkish-cased) : Stefan Schweter tarafından 35 GB'lık çeşitli Türkçe kaynaklardan oluşturularak eğitilmiş, BERT'in base modeli ile aynı büyüklüğe sahip bir modeldir.
* [Distilled (Damıtılmış) BerTurk](https://huggingface.co/dbmdz/distilbert-base-turkish-cased) : Yukarıdaki transformer modelinin, distillation [1] tekniğiyle başarımı ciddi seviyede korunarak, damıtılmış bir halidir.


Modellerin karşılaştırması:

|                   | Katman Sayısı | Kafa Sayısı | Saklı Katman Büyüklüğü | Toplam Parametre Sayısı |
|-------------------|:-------------:|:-----------:|:----------------------:|:-----------------------:|
| Multilingual BERT |       12      |      12     |           768          |           110M          |
| BerTurk           |       12      |      12     |           768          |           110M          |
| Distilled BerTurk |       6       |      12     |           768          |           66M           |

### 2. İyileştirici (Optimizer)

Çeşitli optimizerlar bu çalışmada denenmiştir:
* [AdamW](https://arxiv.org/pdf/1711.05101.pdf)
* [Adam](https://arxiv.org/pdf/1412.6980.pdf)
* [SGD](https://projecteuclid.org/euclid.aoms/1177729392)


### 3. Öğrenme Oranı & Kilo Kaybı (?) (Learning Rate & Weight Decay)

1e-3, 1e-4, 1e-5, 1e-6 öğrenme oranları ve 0, 0.01, 0.1 weight decay değerleri ince ayar senaryolarında araştırılmıştır.

### 4. Ön İşleme

Her ne kadar derin öğrenme tekniklerinin popülerleşmesiyle ön işleme (preprocessing) tekniklerinin önemi azalsa da bu çalışmada basit bir şekilde URL silmenin etkisi de incelenmiştir.

En iyi sonuç alan modelin detayı:

* Transformer: **Distil BerTurk**
* Optimizer: **AdamW**
* Learning Rate: **0.00001**
* Weight Decay: **0.01**
* Ön işlem: **Url Silmek**

![](https://live.staticflickr.com/65535/50173524568_44e146ba0c_b.jpg)

Detaylı sonuçlar için: [İnce Ayar Analizleri.ipynb](https://github.com/akoksal/Turkce-Duygu-Takibi/blob/master/Eg%CC%86itim/%C4%B0nce%20Ayar%20Analizleri.ipynb)


## Ön Eğitim

Bu çalışmada ön eğitim (pretraining) aşaması olarak iki farklı yaklaşım izlenmiştir. Bu yaklaşımlarda çok sayıda emojili Türkçe twit verisi kullanılmıştır.

[**Mandalina Türkçe Emoji Veri Seti**](https://drive.google.com/file/d/1z9un8GnaHH2--07yS0O_4jM88vNG14nv/view?usp=sharing)

* 767.197 twit
* 67 emoji
* 8 emoji kategorisi

### 1. [Ön Eğitim - Sınıflandırma.ipynb](https://github.com/akoksal/Turkce-Duygu-Takibi/blob/master/Eg%CC%86itim/%C3%96n%20E%C4%9Fitim%20-%20S%C4%B1n%C4%B1fland%C4%B1rma.ipynb)
Verilen bir emojili twit için emojilerin çıkarılmış hali üzerinden emoji kategorisinin tahmin edilmesi hedeflenmiştir.

* Maskelenmiş Dil Modeli
* Emoji Kategori Tahmini

### 2. [Ön Eğitim - Eşli Sınıflandırma.ipynb](https://github.com/akoksal/Turkce-Duygu-Takibi/blob/master/Eg%CC%86itim/%C3%96n%20E%C4%9Fitim%20-%20E%C5%9Fli%20S%C4%B1n%C4%B1fland%C4%B1rma.ipynb)
Bu çalışmada ilk ön eğitim notebook'unda olduğu gibi maskeli dil modeli eğitilmekte ve ek olarak emoji sınıflandırmayı ise eşli bir şekilde yapıyoruz.

Bu yaklaşım yine BERT'te olan bir sonraki cümleyi sınıflandırmaya (next sentence prediction) benziyor. Burada ikili bir şekilde eşleştirdiğimiz emojileri siliniş twitlerden, bu iki twitin aynı emojiyi içerip içermediğini tahmin eden bir eşli sınıflandırma görevi oluşturmaktayız.

Örneğin,

Twit 1: Bu tam bir hayal kırıklığı 😦

Twit 2: Çok mutluyum 🙃

Twit 3: Sınav için çok stresliyim 😦

için

*("Bu tam bir hayal kırıklığı", "Çok mutluyum")* ikilisi farklı kategorilerden emojiler içerdiği için bunların farklı olduğunu modelimizin bu şekilde (0) ayırt etmesini istiyoruz.

*("Bu tam bir hayal kırıklığı", "Sınav için çok stresliyim")* ikilisi aynı kategoriden emojiler içerdiği için bunların aynı olduğunu modelimizin bu şekilde (1) ayırt etmesini istiyoruz.


![](https://live.staticflickr.com/65535/50174348517_25545f3bb8.jpg)

*** 
En iyi çıkan Distilled BerTurk modeli için emojili ön eğitimlerde istatistiksel olarak anlamlı bir gelişme gözlenmedi. Bunun, BOUN Twitter Verisinin potansiyel olarak içerdiği gürültülü (noisy) verilerden kaynaklandığını düşünüyoruz. Sorgu temelli yapılan çalışmalarda daha iyi sonuçlar gözlemlendi.
