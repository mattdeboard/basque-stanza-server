import stanza

FRIENDLY_FEATS = {
    "en": {
        "Polarity=Neg": "negation",
        "Mood=Ind": "indicative mood",
        "Number[abs]=Plur": "plural obj",
        "Number[abs]=Sing": "singular obj",
        "Number[erg]=Sing": "singular sub",
        "Number[erg]=Plur": "plural sub",
        "Person[abs]=1": "1st person obj (me/us)",
        "Person[abs]=2": "2nd person obj (you)",
        "Person[abs]=3": "3rd person obj (it/them)",
        "Person[erg]=1": "1st person sub (I)",
        "Person[erg]=2": "2nd person sub (you)",
        "Person[erg]=3": "3rd person sub (he/she/it)",
        "VerbForm=Fin": "conjugated",
        "VerbForm=Inf": "infinitive/base form",
        "Aspect=Imp": "habitual/ongoing",
        "Aspect=Perf": "completed act",
        "Case=Abs": "absolutive (sub/obj)",
        "Case=Erg": "ergative (transitive sub)",
        "Case=Dat": "dative (indir obj)",
        "Case=Gen": "genitive",
        "Case=Loc": "locative",
        "Case=Ine": "inessive (inside/within)",
        "Definite=Def": "definite (the)",
        "Definite=Ind": "indefinite (a/an)",
        "Number=Plur": "plural",
        "Number=Sing": "singular",
    },
    "eu": {
        "Polarity=Neg": "ezeztapena",
        "Mood=Ind": "adierazpen modua",
        "Number[abs]=Plur": "objektu plurala",
        "Number[abs]=Sing": "objektu singularra",
        "Number[erg]=Sing": "subjektu singularra",
        "Number[erg]=Plur": "subjektu plurala",
        "Person[abs]=1": "1. pertsona obj (ni/gu)",
        "Person[abs]=2": "2. pertsona obj (zu/zuek)",
        "Person[abs]=3": "3. pertsona obj (hura/haiek)",
        "Person[erg]=1": "1. pertsona subj (nik)",
        "Person[erg]=2": "2. pertsona subj (zuk)",
        "Person[erg]=3": "3. pertsona subj (hark)",
        "VerbForm=Fin": "aditz jokatua",
        "VerbForm=Inf": "aditz jokatu gabea",
        "Aspect=Imp": "ohikoa/jarraian",
        "Aspect=Perf": "burutua",
        "Case=Abs": "absolutiboa (nor)",
        "Case=Erg": "ergatiboa (nork)",
        "Case=Dat": "datiboa (nori)",
        "Case=Gen": "genitiboa (noren)",
        "Case=Loc": "lekuzkoa",
        "Case=Ine": "inesiboa (non)",
        "Definite=Def": "mugatu (-a/-ak)",
        "Definite=Ind": "mugagabea",
        "Number=Plur": "plurala",
        "Number=Sing": "singularra",
    },
}

QUIRKS = {"en": {"euskal": "combining prefix"}, "eu": {"euskal": "konbinazio aurrizkia"}}


def create_pipeline():
    return stanza.Pipeline("eu", download_method=stanza.DownloadMethod.REUSE_RESOURCES, processors="tokenize,pos,lemma")


def rows_to_dicts(rows):
    return [{"word": word, "lemma": lemma, "feats": feats} for word, lemma, feats in rows]


def process_input(pipeline, input_text, language="en"):
    doc = pipeline(input_text)
    rows = []
    friendly_feats = FRIENDLY_FEATS.get(language, FRIENDLY_FEATS["en"])
    quirks = QUIRKS.get(language, QUIRKS["en"])

    for sent in doc.sentences:
        for word in sent.words:
            descs = []
            quirk = quirks.get(word.text.lower())
            if quirk:
                descs.append(quirk)
            elif word.feats:
                for feat in word.feats.split("|"):
                    friendly = friendly_feats.get(feat)
                    if friendly:
                        descs.append(friendly)
            rows.append((word.text, f"({word.lemma})", ", ".join(descs)))

    return rows


def print_table(rows):
    word_width = max(len(r[0]) for r in rows)
    lemma_width = max(len(r[1]) for r in rows)
    for word, lemma, feats in rows:
        line = f"  {word:<{word_width}}  {lemma:<{lemma_width}}"
        if feats:
            line += f"  — {feats}"
        print(line)


def print_json(rows):
    import json

    print(json.dumps(rows_to_dicts(rows), ensure_ascii=False, indent=2))
