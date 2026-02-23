# Xingolak

## Euskararen Itzulpen Lerrokatze Bistaratzailea

[🇺🇸 English](README.md) | [🔴⚪🟢 Euskera](README.eu.md)

![Xingolak Demoa](resources/demo.gif)

**Xingolak** (euskeraz "xintak") aplikazio web interaktibo bat da, ingelera eta euskera itzulpenen artean hitzak eta egitura gramatikalak nola lerrokatzen diren bistaratzen duena. Itzulpena analisi linguistiko sakonarekin konektatuz, Xingolak ingelera eta euskerak esanahia adierazteko dituzten desberdintasun harrigarriak azaltzen ditu.

## Zer Egiten Du Xingolak-ek

Xingolak edozein ingelera testu hartzen du, euskerara itzultzen du, eta zehatz-mehatz erakusten dizu bi hizkuntzak nola dagozten maila linguistiko anitzetan. Ondoz ondoko itzulpen bat erakutsi beharrean, kontzeptu erlazionatuak konektatzen dituzten xinta animatuak marrazten ditu, honakoa ulertzen lagunduz:

- **Zein ingelera hitz dagokion zein euskera hitzei**
- **Nola transferitzen diren rol gramatikalak hizkuntzen artean**
- **Non berrantolatu den ingelera gramatika euskerazko hitzen artean**

Aplikazioak ingelera (hitz-ordena nagusiki darabilena) eta euskera (markatzaile morfologiko aberatsak eta hitz-orden malguak darabilena) arteko egitura-desberdintasun sakonak azaltzen ditu.

## Hiru Analisi Geruzen Ulermena

Xingolak itzulpen lerrokatze hiru maila linguistiko desberdinetan aztertzen ditu:

### 🟢 **Lexikala**

Lerrokatze lexikalek ingelera hitzen eta haien euskerazko baliokide zuzenen arteko hiztegi-mailako korrespondentzia erakusten dute. Geruza honek honakoa agerian uzten du:

- Oinarrizko hitz arteko itzulpenak
- Ingelera kontzeptuak euskerazko hitzei zuzenean dagozkien kasuak
- Hizkuntzen arteko hiztegiaren harremanak

### 🟣 **Harreman Gramatikalak**

Harreman gramatikalek hizkuntza bakoitzak esaldi-rolak eta harremanak nola markatzen dituen erakusten du. Geruza honek honakoa azaltzen du:

- Nola erabiltzen duen ingelesak hitz-ordena harremanak erakusteko (Subjektu-Aditz-Objektu)
- Nola erabiltzen dituen euskerak kasu-atzizkiak eta aditz-komunztadura horren ordez
- Hizkuntzek "nork zer egiten dion nori" adierazteko modu desberdinak

### 🟠 **Ezaugarriak**

Ezaugarriek informazio gramatikala nola banatzen den hitzen artean azaltzen dute. Geruza honek honakoa agerian uzten du:

- Nola zabaltzen diren ingelera denbora-markatzaileak euskerazko hitz anitzetan
- Non dauden definitutasuna, ukazioa eta komunztadura hizkuntza bakoitzean
- Hitz-formetan gordetako informazio gramatikala "ezkutuan"

## Nola Funtzionatzen Du

Xingolak AI bidezko pipeline sofistikatu bat darabil bistaratzaile hauek sortzeko:

```code
Ingelera Testua → Itzuli API → Stanza NLP → Claude AI → Bistaratzaile Interaktiboa
     ↓             ↓            ↓           ↓              ↓
  "Sarrera testua"  Itzulpena  Analisi    Lerrokatze    Xinta animatuak
                              Linguistikoa  Sorkuntza    eta interakzioak
```

1. **Itzulpena**: Zure ingelera testua euskerara itzultzen da [Itzuli API](https://itzuli.eus) erabiliz
2. **Analisi Linguistikoa**: Bi testuak [Stanford-eko Stanza NLP](https://stanfordnlp.github.io/stanza/) erabiliz aztertzen dira egitura gramatikalak identifikatzeko
3. **Lerrokatze Sorkuntza**: Claude AI-ak bi egitura linguistikoak aztertzen ditu lerrokatze zehatzak sortzeko
4. **Bistaratzea**: Web interfazeak konexio hauek erakusten dituzten xinta interaktiboak renderizatzen ditu

## Ezaugarri Nagusiak

### 🎯 **Hitz Interaktiboen Arakatzea**

- **Hover egin** edozein hitzen gainean haren konexioak argitara emateko
- **Klik egin** hitz bat ainguratzeko eta haren lerrokatze xeheak esploratzeko
- **Aldatu geruzak** harreman linguistiko mota desberdinak ikusteko

### 🌍 **Interfaze Eleanitza**

Interfaze osoa lau hizkuntza hauetan dago eskuragarri:

- **English** - Funtzionalitate osoa
- **Euskera (Basque)** - Hizkuntza natiboko interfazea
- **Español (Spanish)** - Gaztelaniako lokalizazio osoa
- **Français (French)** - Frantsesezko itzulpen osoa

### 📱 **Diseinu Erantzulea**

- Mahaigaineko eta mugikorreko gailuetan funtzionatzen du ondo
- Esaldi-egitura konplexuak kudeatzen dituen diseinu moldakorra
- Harreman linguistikoak azaltzen dituzten animazio leunak

### ♿ **Erabilerraztasun Ezaugarriak**

- Pantaila-irakurle laguntza osoa aria etiketa zehatzez
- Elementu interaktibo guztientzako teklatuz nabigazio
- Bistaratzaile kontraste handiko aukerak

## Hasteko

### Beharrezko API Gakoak

Xingolak exekutatzeko, bi API hauetarako sarbidea beharko duzu:

#### 1. **Itzuli API Gakoa**

Itzuli API-ak Ingelesa ↔ Euskera kalitate handiko itzulpena eskaintzen du.

- **Zure gakoa lortu**: Bisitatu [itzuli.vicomtech.org/en/api/](https://itzuli.vicomtech.org/en/api/) eta bete formularioa API sarbidea eskatzeko
- **Erabilpena**: Ingelera eta euskera arteko itzulpenak
- **Kostua**: Prezioen xehetasunak ez daude publikoki eskuragarri - jarri haiekin harremanetan API eskaera formularioaren bidez informaziorako

#### 2. **Claude API Gakoa**

Claude AI-ak bistaratze hauek bultzatzen dituzten lerrokatze linguistiko sofistikatuak sortzen ditu.

- **Zure gakoa lortu**: Erregistratu [console.anthropic.com](https://console.anthropic.com) gunean
- **Erabilpena**: Analisi linguistikoa eta lerrokatze sorkuntza
- **Kostua**: Egiaztatu uneko prezioak [anthropic.com](https://www.anthropic.com/pricing) gunean

### Instalazioa eta Konfigurazioa

1. **Klonatu biltegia**:

```bash
git clone https://github.com/your-repo/itzuli-stanza-mcp
cd itzuli-stanza-mcp
```

1. **Konfiguratu backend-a**:

```bash
cd backend
# Jarraitu backend/README.eu.md-ko konfigurazio xehetasunei
```

1. **Konfiguratu frontend-a**:

```bash
cd frontend
npm install
npm run dev
```

1. **Konfiguratu zure API gakoak** backend dokumentazioko konfigurazio gidei jarraituz.

## Proiektuaren Egitura

```code
itzuli-stanza-mcp/
├── frontend/          # Xingolak web aplikazioa (TypeScript + React)
└── backend/           # NLP prozesatze pipeline-a (Python)
    ├── core/          # Oinarrizko itzulpen eta analisi workflow-ak
    ├── alignment_server/  # HTTP API frontend integraziorako
    └── mcp_server/    # Claude MCP zerbitzari integrazioa
```

## Dokumentazioa

- **[Backend Konfigurazioa](backend/README.eu.md)** - Python backend konfigurazio gida osoa
- **[Sistemaren Arkitektura](backend/ARCHITECTURE.eu.md)** - Arkitektura teknikoa xehetasunez
- **[Backend Setup (English)](backend/README.md)** - Ingelesezko konfigurazio gida
- **[Architecture (English)](backend/ARCHITECTURE.md)** - Ingelesezko arkitektura dokumentazioa

## Izenaren Inguruan

**Xingolak** (ahoskatzen "shin-go-lak") euskeraz "xintak" esan nahi du, hizkuntzetan zehar kontzeptu erlazionatuak konektatzen dituzten xintaren metafora bisuala islatuz. Izenak interfazearen diseinu bisuala eta esanahi-sistema linguistiko desberdinen arteko konexio linguistikoen kontzeptual ideia biak jasotzen ditu.