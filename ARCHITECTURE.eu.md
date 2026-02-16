# Arkitektura Dokumentazioa

[🇺🇸 English](ARCHITECTURE.md) | [🔴⚪🟢 Euskera](ARCHITECTURE.eu.md)

Dokumentu honek itzuli-stanza-mcp proiektuaren arkitekturaren ikuspegi osoa eskaintzen du.

## Proiektuaren Ikuspegi Orokorra

Euskal hizkuntzaren prozesamendu sistema bat da, Itzuli APIaren itzulpen gaitasunak eta Stanford-en Stanza liburutegiko analisi morfologiko zehatza konbinatzen dituena. Sistemak AI laguntzaileen integraziorako MCP (Model Context Protocol) zerbitzaria eskaintzen du, itzulpena eta analisi linguistikoa interfaze bakardun batean eskainiz.

## Proiektuaren Egitura

```code
itzuli_stanza_mcp/
├── itzuli_mcp_server.py   # Analisi morfologikoarekin itzulpena eskaintzen duen MCP zerbitzaria
├── services.py            # Itzuli eta Stanza koordinatzen dituen zerbitzu geruza
├── nlp.py                 # Stanza pipelinearen konfigurazioa eta testu prozesamendu logika
└── __init__.py
tests/
├── test_itzuli_mcp_server.py
└── __init__.py
pyproject.toml             # Proiektuaren dependentziak eta konfigurazioa
README.md                  # Erabiltzaile dokumentazioa
CLAUDE.md                  # Garapen gidalerroak
```

## Osagai Nagusiak

### 1. Itzulpen Zerbitzua (`itzuli_mcp_server.py`)

- **Teknologia**: FastMCP duen MCP (Model Context Protocol) zerbitzaria
- **Helburua**: AI laguntzaileen itzulpen eta analisi morfologiko konbinatua
- **Garraioa**: stdio
- **Autentifikazioa**: `ITZULI_API_KEY` ingurumen aldagaia behar du
- **Dependentziak**: koordinazio prozesurako `services.py`

### 2. Zerbitzu Koordinazio Geruza (`services.py`)

- **Helburua**: Itzuli eta Stanza zerbitzuak koordinatzen dituen funtzio geruza
- **Eredua**: Stanza pipeline caching atzeratua duten funtzio garbiak
- **Funtzioak**: `translate_with_analysis`, `get_quota`, `send_feedback`
- **Diseinua**: Egoera globalik gabe, kezken banaketa garbia

### 3. NLP Prozesamendu Modulua (`nlp.py`)

- **Teknologia**: Stanford Stanza liburutegia
- **Helburua**: Euskal hizkuntzaren prozesamendu eta ezaugarri ateratze
- **Pipeline**: tokenizazioa, POS etiketatua, lematizazioa
- **Ezaugarriak**: Ohartapen linguistikoen ezaugarri-mapa lagungarria

## Sistemaren Arkitektura

```code
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  MCP Bezeroa    │───▶│  MCP Zerbitzaria │───▶│  Zerbitzu Geruza │
│ (AI Laguntzailea)│    │    (stdio)       │    │ (koordinazioa)   │
└─────────────────┘    └──────────────────┘    └──────────────────┘
                                                        │
                              ┌─────────────────────────┼─────────────────────────┐
                              ▼                         ▼                         ▼
                   ┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
                   │  Itzuli API      │       │ Stanza Pipeline  │       │ Irteera Formatea │
                   │ (Itzulpena)      │       │   (Analisia)     │       │ (Markdown Taula) │
                   └──────────────────┘       └──────────────────┘       └──────────────────┘
```

## Datu Fluxua

### Itzulpen Fluxua

1. MCP bezeroak itzulpen tresna deitzen du
2. Zerbitzariak hizkuntza bikotea baliozkotzen du (euskera izan behar du)
3. Zerbitzu geruzak Itzuli APIa deitzen du itzulpenerako
4. Zerbitzu geruzak euskal testua zehazten du (jatorrizkoa edo itzulitakoa)
5. Zerbitzu geruzak euskal testua Stanza pipeline bidez prozesatzen du
6. Zerbitzu geruzak irteera konbinatua jatorria, itzulpena eta analisi taularekin formateatzen du
7. Formateatutako emaitza MCP bezeroari itzultzen zaio

## Kanpoko Integrazioak

### Itzuli API

- **Helburua**: Euskal itzulpen zerbitzua
- **Autentifikazioa**: API gakoa ingurumen aldagaien bidez
- **Onartutako Hizkuntzak**: Euskera ↔ Gaztelania, Ingelesa, Frantsesa
- **Erabilitako Amaiera-puntuak**: Itzulpena, kuota egiaztatzea, feedback bidalketa

### Stanford Stanza

- **Helburua**: Euskal analisi morfologikoa
- **Modeloa**: Aurre-entrenatutako euskal hizkuntza modeloa
- **Deskarga Estrategia**: Lehendik dauden baliabideak berrerabili
- **Prozesatzaileak**: tokenizazioa, pos, lemma

## Segurtasun Kontuan hartu beharrekoak

- API gakoa ingurumen aldagaietan gordetzen da (ez da kodean sartzen)
- Sarrera baliozkotasuna onartutako hizkuntza bikoteentzat
- Erroreen kudeaketak informazio ihesa saihesten du
- MCP zerbitzaria stdio bidez funtzionatzen du (ez du sare erakusketarik)

## Garapen Inguruna

### Dependentziak

- **Oinarrizkoa**: Stanza, Itzuli, MCP
- **Garapena**: pytest, ruff, anyio
- **Python Bertsioa**: ≥3.10

### Probak

- Proba sorta `tests/` direktorioan
- MCP zerbitzari funtzionalitateari ardazten zaio
- Exekutatu honekin: `pytest`

### Kode Kalitatea

- Ruff bidezko linting
- Type hint-ak aplikagarri denean
- Logging ingurumen aldagaien bidez konfiguratua

## Hedapena

### MCP Zerbitzaria

```bash
ITZULI_API_KEY=zure-gakoa uv run python -m itzuli_stanza_mcp.itzuli_mcp_server
```

## Etorkizuneko Kontuan hartu beharrekoak

- Testu anitzeko batch prozesamendu gehitzea kontuan hartu
- Maiztasunez analizatutako testuetarako cache geruza potentziala
- Itzuli APIak euskarria zabaltzen badu hizkuntza bikote gehigarriak
- Itzulpen soiletik analisi soilerako lan-fluxu bananduen tresnak

## Glosarioa

- **MCP**: Model Context Protocol - AI laguntzaileen tresna integrazioaren estandarra
- **Stanza**: Hizkuntza anitzeko testu analisiaren Stanford NLP liburutegia
- **Itzuli**: Euskal Gobernuaren itzulpen API ofiziala
- **Analisi Morfologikoa**: Hitzak haien osagai gramatikaletan zatitzea
- **Lematizazioa**: Hitzen oinarri/hiztegi forma aurkitzea
