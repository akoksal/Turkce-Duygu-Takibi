## Sunucu Endpoint Dokümantasyonu

### Operation Endpoint
Sorgulama operasyonlarıyla ilgili işlemlerden sorumludur.

- **GET** `/operation` : 
    - Sistemde başlatılmış bütün operasyonları gönderir.
- **GET** `/operation/completed` : 
    - Başarıyla sonuçlanmış operasyonları gönderir.
- **GET** `/operation/query/{query}` : 
    - **Parametre:** *query*
    - *query* parametresine ait operasyonu gönderir.
- **GET** `/operation/id/{id}` : 
    - **Parametre:** *id*
    - *id* parametresine ait operasyonu gönderir.
- **POST** `/operation/start/` :
    - **body:** {`query` : "<sonucu istenen sorgu>"}
    - Verilen `query` sorgusuyla bir operasyon başlatır.

### Result Endpoint
Sorgulama sonuçlarıyla ilgili işlemlerden sorumludur.

- **GET** `/result/query/{query}` : 
    - **Parametre:** *query*
    - *query* parametresine ait operasyon sonuçlarını gönderir.
- **GET** `/result/id/{id}` : 
    - **Parametre:** *id*
    - *id* parametresine ait operasyon sonuçlarını gönderir.
- **GET** `/result/volume/query/{query}` : 
    - **Parametre:** *query*
    - *query* parametresine ait operasyonun hacim (volume) bilgisini gönderir.
- **GET** `/result/volume/id/{id}` : 
    - **Parametre:** *id*
    - *id* parametresine ait operasyonun hacim (volume) gönderir.
