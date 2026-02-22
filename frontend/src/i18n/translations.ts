/**
 * Internationalization translations for Xingolak frontend
 *
 * Structure mirrors backend/src/itzuli_nlp/core/i18n.py
 * Supports all languages available in the Itzuli API: en, eu, es, fr
 */

import { LanguageCode } from '../types/alignment'

export type TranslationKey =
  // App header and navigation
  | 'app.subtitle'
  | 'app.loading.subtitle'
  // Mode toggle
  | 'mode.analyze_new_text'
  | 'mode.browse_examples'
  // Translation input form
  | 'input.source_language'
  | 'input.target_language'
  | 'input.source_text_placeholder'
  | 'input.analyze_button'
  | 'input.analyzing_button'
  // Example selection
  | 'examples.choose_sentence'
  | 'examples.choose_sentence_aria'
  // Loading states
  | 'loading.analyzing_translation'
  | 'loading.loading_alignment_data'
  | 'loading.processing_text'
  | 'loading.loading_examples'
  | 'loading.step_translating'
  | 'loading.step_analyzing'
  | 'loading.step_generating_alignments'
  | 'loading.time_estimate'
  // Error messages
  | 'error.prefix'
  | 'error.try_again'
  // Helper messages
  | 'help.enter_text'
  | 'help.select_example'
  // Language names (for dropdowns)
  | 'lang.eu'
  | 'lang.es'
  | 'lang.en'
  | 'lang.fr'
  // Visualization layer labels
  | 'layer.lexical'
  | 'layer.grammatical_relations'
  | 'layer.features'
  // Alignment visualization
  | 'viz.source'
  | 'viz.translation'
  | 'viz.layers'
  | 'viz.alignment_count'

export type Translations = {
  [K in LanguageCode]: {
    [Key in TranslationKey]: string
  }
}

export const translations: Translations = {
  [LanguageCode.EN]: {
    // App header and navigation
    'app.subtitle': 'Translation Alignment Visualization for Basque',
    'app.loading.subtitle': 'Translation Alignment Visualization for English-Basque Translations',
    // Mode toggle
    'mode.analyze_new_text': 'Analyze New Text',
    'mode.browse_examples': 'Browse Examples',
    // Translation input form
    'input.source_language': 'Source Language',
    'input.target_language': 'Target Language',
    'input.source_text_placeholder': 'Enter text to analyze...',
    'input.analyze_button': 'Analyze Translation',
    'input.analyzing_button': 'Analyzing...',
    // Example selection
    'examples.choose_sentence': 'Choose Example Sentence',
    'examples.choose_sentence_aria':
      'Select an example sentence pair for translation alignment visualization',
    // Loading states
    'loading.analyzing_translation': 'Analyzing Translation',
    'loading.loading_alignment_data': 'Loading Alignment Data',
    'loading.processing_text': 'Processing your text through our AI pipeline...',
    'loading.loading_examples': 'Loading example sentence data...',
    'loading.step_translating': 'Translating with Itzuli API',
    'loading.step_analyzing': 'Analyzing with Stanza NLP',
    'loading.step_generating_alignments': 'Generating alignments with Claude',
    'loading.time_estimate': 'This may take 10-30 seconds depending on text complexity',
    // Error messages
    'error.prefix': 'Error:',
    'error.try_again': 'Try Again',
    // Helper messages
    'help.enter_text': 'Enter text above to begin analysis',
    'help.select_example': 'Select an example sentence to view alignment visualization',
    // Language names
    'lang.eu': 'Basque',
    'lang.es': 'Spanish',
    'lang.en': 'English',
    'lang.fr': 'French',
    // Visualization layer labels
    'layer.lexical': 'Lexical',
    'layer.grammatical_relations': 'Grammatical Relations',
    'layer.features': 'Features',
    // Alignment visualization
    'viz.source': 'Source',
    'viz.translation': 'Translation',
    'viz.layers': 'Layers',
    'viz.alignment_count': '{count} alignments',
  },
  [LanguageCode.EU]: {
    // App header and navigation
    'app.subtitle': 'Euskararen Itzulpen Lerrokatze Bistaratzailea',
    'app.loading.subtitle': 'Ingelesa-Euskera Itzulpenen Lerrokatze Bistaratzailea',
    // Mode toggle
    'mode.analyze_new_text': 'Testu Berria Aztertu',
    'mode.browse_examples': 'Adibideak Arakatu',
    // Translation input form
    'input.source_language': 'Jatorrizko Hizkuntza',
    'input.target_language': 'Helburu Hizkuntza',
    'input.source_text_placeholder': 'Aztertzeko testua idatzi...',
    'input.analyze_button': 'Itzulpena Aztertu',
    'input.analyzing_button': 'Aztertzen...',
    // Example selection
    'examples.choose_sentence': 'Adibide Esaldia Hautatu',
    'examples.choose_sentence_aria':
      'Itzulpen lerrokatze bistaratzailerako adibide esaldi parea hautatu',
    // Loading states
    'loading.analyzing_translation': 'Itzulpena Aztertzen',
    'loading.loading_alignment_data': 'Lerrokatze Datuak Kargatzen',
    'loading.processing_text': 'Zure testua gure AI bidaian prozesatzen...',
    'loading.loading_examples': 'Adibide esaldien datuak kargatzen...',
    'loading.step_translating': 'Itzuli API-arekin itzultzen',
    'loading.step_analyzing': 'Stanza NLP-arekin aztertzen',
    'loading.step_generating_alignments': 'Claude-rekin lerroak sortzen',
    'loading.time_estimate': 'Testu konplexutasunaren arabera 10-30 segundo har dezake',
    // Error messages
    'error.prefix': 'Errorea:',
    'error.try_again': 'Berriro Saiatu',
    // Helper messages
    'help.enter_text': 'Goiko testua idatzi analisia hasteko',
    'help.select_example': 'Adibide esaldi bat hautatu lerrokatze bistaratzailea ikusteko',
    // Language names
    'lang.eu': 'euskera',
    'lang.es': 'gaztelania',
    'lang.en': 'ingelesa',
    'lang.fr': 'frantsesa',
    // Visualization layer labels
    'layer.lexical': 'Lexikala',
    'layer.grammatical_relations': 'Harreman Gramatikalak',
    'layer.features': 'Ezaugarriak',
    // Alignment visualization
    'viz.source': 'Jatorria',
    'viz.translation': 'Itzulpena',
    'viz.layers': 'Geruzak',
    'viz.alignment_count': '{count} lerrokatze',
  },
  [LanguageCode.ES]: {
    // App header and navigation
    'app.subtitle': 'Visualización de Alineación de Traducción para Euskera',
    'app.loading.subtitle': 'Visualización de Alineación de Traducciones Inglés-Euskera',
    // Mode toggle
    'mode.analyze_new_text': 'Analizar Nuevo Texto',
    'mode.browse_examples': 'Explorar Ejemplos',
    // Translation input form
    'input.source_language': 'Idioma Origen',
    'input.target_language': 'Idioma Destino',
    'input.source_text_placeholder': 'Introduce texto para analizar...',
    'input.analyze_button': 'Analizar Traducción',
    'input.analyzing_button': 'Analizando...',
    // Example selection
    'examples.choose_sentence': 'Elegir Oración Ejemplo',
    'examples.choose_sentence_aria':
      'Selecciona un par de oraciones ejemplo para visualización de alineación de traducción',
    // Loading states
    'loading.analyzing_translation': 'Analizando Traducción',
    'loading.loading_alignment_data': 'Cargando Datos de Alineación',
    'loading.processing_text': 'Procesando tu texto a través de nuestro pipeline de IA...',
    'loading.loading_examples': 'Cargando datos de oraciones ejemplo...',
    'loading.step_translating': 'Traduciendo con API Itzuli',
    'loading.step_analyzing': 'Analizando con Stanza NLP',
    'loading.step_generating_alignments': 'Generando alineaciones con Claude',
    'loading.time_estimate':
      'Esto puede tomar 10-30 segundos dependiendo de la complejidad del texto',
    // Error messages
    'error.prefix': 'Error:',
    'error.try_again': 'Intentar de Nuevo',
    // Helper messages
    'help.enter_text': 'Introduce texto arriba para comenzar el análisis',
    'help.select_example': 'Selecciona una oración ejemplo para ver la visualización de alineación',
    // Language names
    'lang.eu': 'vasco',
    'lang.es': 'español',
    'lang.en': 'inglés',
    'lang.fr': 'francés',
    // Visualization layer labels
    'layer.lexical': 'Léxico',
    'layer.grammatical_relations': 'Relaciones Gramaticales',
    'layer.features': 'Características',
    // Alignment visualization
    'viz.source': 'Origen',
    'viz.translation': 'Traducción',
    'viz.layers': 'Capas',
    'viz.alignment_count': '{count} alineaciones',
  },
  [LanguageCode.FR]: {
    // App header and navigation
    'app.subtitle': "Visualisation d'Alignement de Traduction pour le Basque",
    'app.loading.subtitle': "Visualisation d'Alignement de Traductions Anglais-Basque",
    // Mode toggle
    'mode.analyze_new_text': 'Analyser Nouveau Texte',
    'mode.browse_examples': 'Parcourir Exemples',
    // Translation input form
    'input.source_language': 'Langue Source',
    'input.target_language': 'Langue Cible',
    'input.source_text_placeholder': 'Entrez le texte à analyser...',
    'input.analyze_button': 'Analyser Traduction',
    'input.analyzing_button': 'Analyse en cours...',
    // Example selection
    'examples.choose_sentence': 'Choisir Phrase Exemple',
    'examples.choose_sentence_aria':
      "Sélectionnez une paire de phrases exemple pour la visualisation d'alignement de traduction",
    // Loading states
    'loading.analyzing_translation': 'Analyse de Traduction',
    'loading.loading_alignment_data': "Chargement Données d'Alignement",
    'loading.processing_text': 'Traitement de votre texte via notre pipeline IA...',
    'loading.loading_examples': 'Chargement des données de phrases exemples...',
    'loading.step_translating': 'Traduction avec API Itzuli',
    'loading.step_analyzing': 'Analyse avec Stanza NLP',
    'loading.step_generating_alignments': "Génération d'alignements avec Claude",
    'loading.time_estimate': 'Cela peut prendre 10-30 secondes selon la complexité du texte',
    // Error messages
    'error.prefix': 'Erreur:',
    'error.try_again': 'Réessayer',
    // Helper messages
    'help.enter_text': "Entrez le texte ci-dessus pour commencer l'analyse",
    'help.select_example':
      "Sélectionnez une phrase exemple pour voir la visualisation d'alignement",
    // Language names
    'lang.eu': 'basque',
    'lang.es': 'espagnol',
    'lang.en': 'anglais',
    'lang.fr': 'français',
    // Visualization layer labels
    'layer.lexical': 'Lexical',
    'layer.grammatical_relations': 'Relations Grammaticales',
    'layer.features': 'Caractéristiques',
    // Alignment visualization
    'viz.source': 'Source',
    'viz.translation': 'Traduction',
    'viz.layers': 'Couches',
    'viz.alignment_count': '{count} alignements',
  },
}
