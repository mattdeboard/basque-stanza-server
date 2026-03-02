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
  | 'input.text_label'
  | 'input.text_placeholder'
  | 'input.characters_counter'
  | 'input.analyze_button'
  | 'input.analyzing_button'
  | 'input.validation_error_basque_required'
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
  | 'error.rate_limited'
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
  | 'layer.lexical_tooltip'
  | 'layer.grammatical_relations_tooltip'
  | 'layer.features_tooltip'
  // Alignment visualization
  | 'viz.source'
  | 'viz.translation'
  | 'viz.layers'
  | 'viz.alignment_count'
  | 'viz.source_language_label'
  | 'viz.target_language_label'
  // UI Controls
  | 'ui.close'
  | 'ui.close_drawer'
  | 'ui.swap_languages'
  | 'ui.swap_source_target_languages'
  // Accessibility
  | 'a11y.screen_reader_instructions'

export type Translations = {
  [K in LanguageCode]: {
    [Key in TranslationKey]: string
  }
}

export const translations: Translations = {
  [LanguageCode.EN]: {
    // App header and navigation
    'app.subtitle': 'Translation Alignment Visualization for Basque',
    'app.loading.subtitle': 'Translation Alignment Visualization for Basque',
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
    'error.rate_limited': "You've reached the daily limit of 10 analyses. Try again tomorrow.",
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
    'viz.source_language_label': 'Source Language',
    'viz.target_language_label': 'Target Language',
    // New input form translations
    'input.text_label': 'Enter text to translate and analyze',
    'input.text_placeholder': 'Type your sentence here...',
    'input.characters_counter': '{count}/500 characters',
    'input.validation_error_basque_required': 'Either source or target language must be Basque',
    // Layer tooltips
    'layer.lexical_tooltip':
      'What words mean — dictionary-level correspondences between English words and their direct Basque equivalents, if applicable',
    'layer.grammatical_relations_tooltip':
      'Who does what to whom — how English marks sentence roles through word order while Basque marks them through case suffixes and verb agreement',
    'layer.features_tooltip':
      'Where grammar hides — how tense, negation, definiteness, and agreement that live in one place in English get scattered across Basque words',
    // UI Controls
    'ui.close': 'Close',
    'ui.close_drawer': 'Close drawer',
    'ui.swap_languages': 'Swap languages',
    'ui.swap_source_target_languages': 'Swap source and target languages',
    // Accessibility
    'a11y.screen_reader_instructions':
      'Instructions: Use Tab to navigate between words. Press Enter or Space on any word to pin it and explore its alignment connections. Use arrow keys to navigate between analysis layers above.',
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
    'error.rate_limited': 'Eguneko 10 analisi mugara iritsi zara. Bihar saiatu berriro.',
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
    'viz.source_language_label': 'Jatorrizko Hizkuntza',
    'viz.target_language_label': 'Helburu Hizkuntza',
    // New input form translations
    'input.text_label': 'Itzultzeko eta aztertzeko testua idatzi',
    'input.text_placeholder': 'Zure esaldia hemen idatzi...',
    'input.characters_counter': '{count}/500 karaktere',
    'input.validation_error_basque_required':
      'Jatorri hizkuntza edo helburu hizkuntza euskera izan behar da',
    // Layer tooltips
    'layer.lexical_tooltip':
      'Hitzek zer esan nahi duten — ingelera hitzen eta haien euskerazko baliokideen arteko hiztegi-mailako korrespondentzia, aplikagarria bada',
    'layer.grammatical_relations_tooltip':
      'Nork zer egiten dion nori — nola markatzen dituen ingelesak esaldiko rolak hitz-ordenaren bidez euskerak kasuaren atzizkien eta aditz-komunztaduraren bidez',
    'layer.features_tooltip':
      'Non ezkutatzen den gramatika — nola denporan, ukazpen, definitutasun eta komunztadura ingelesean leku batean bizi direnak euskerazko hitzen artean barreiatu',
    // UI Controls
    'ui.close': 'Itxi',
    'ui.close_drawer': 'Tiradera itxi',
    'ui.swap_languages': 'Hizkuntzak trukatu',
    'ui.swap_source_target_languages': 'Jatorri eta helburu hizkuntzak trukatu',
    // Accessibility
    'a11y.screen_reader_instructions':
      'Argibideak: Erabili Tab hitzen artean nabigatzeko. Sakatu Enter edo Zuriunea edozein hitzetan ainguratu eta lerrokatze konexioak esploratzeko. Erabili geziak goiko analisi-geruzen artean nabigatzeko.',
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
    'error.rate_limited':
      'Has alcanzado el límite diario de 10 análisis. Inténtalo de nuevo mañana.',
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
    'viz.source_language_label': 'Idioma Origen',
    'viz.target_language_label': 'Idioma Destino',
    // New input form translations
    'input.text_label': 'Introduce texto para traducir y analizar',
    'input.text_placeholder': 'Escribe tu oración aquí...',
    'input.characters_counter': '{count}/500 caracteres',
    'input.validation_error_basque_required': 'El idioma origen o destino debe ser vasco',
    // Layer tooltips
    'layer.lexical_tooltip':
      'Lo que significan las palabras — correspondencias a nivel de diccionario entre palabras inglesas y sus equivalentes directos en vasco, si aplica',
    'layer.grammatical_relations_tooltip':
      'Quién hace qué a quién — cómo el inglés marca los roles de la oración a través del orden de palabras mientras el vasco los marca a través de sufijos de caso y concordancia verbal',
    'layer.features_tooltip':
      'Dónde se esconde la gramática — cómo el tiempo, negación, definitud y concordancia que viven en un lugar en inglés se dispersan entre las palabras vascas',
    // UI Controls
    'ui.close': 'Cerrar',
    'ui.close_drawer': 'Cerrar cajón',
    'ui.swap_languages': 'Intercambiar idiomas',
    'ui.swap_source_target_languages': 'Intercambiar idiomas origen y destino',
    // Accessibility
    'a11y.screen_reader_instructions':
      'Instrucciones: Use Tab para navegar entre palabras. Presione Enter o Espacio en cualquier palabra para anclarla y explorar sus conexiones de alineación. Use las flechas para navegar entre las capas de análisis de arriba.',
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
    'error.rate_limited':
      'Vous avez atteint la limite quotidienne de 10 analyses. Réessayez demain.',
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
    'viz.source_language_label': 'Langue Source',
    'viz.target_language_label': 'Langue Cible',
    // New input form translations
    'input.text_label': 'Entrez le texte à traduire et analyser',
    'input.text_placeholder': 'Tapez votre phrase ici...',
    'input.characters_counter': '{count}/500 caractères',
    'input.validation_error_basque_required': 'La langue source ou cible doit être le basque',
    // Layer tooltips
    'layer.lexical_tooltip':
      'Ce que les mots signifient — correspondances au niveau dictionnaire entre mots anglais et leurs équivalents basques directs, si applicable',
    'layer.grammatical_relations_tooltip':
      "Qui fait quoi à qui — comment l'anglais marque les rôles de phrase par l'ordre des mots tandis que le basque les marque par les suffixes de cas et l'accord verbal",
    'layer.features_tooltip':
      'Où se cache la grammaire — comment le temps, négation, définitude et accord qui vivent en un lieu en anglais se dispersent entre les mots basques',
    // UI Controls
    'ui.close': 'Fermer',
    'ui.close_drawer': 'Fermer le tiroir',
    'ui.swap_languages': 'Échanger les langues',
    'ui.swap_source_target_languages': 'Échanger langues source et cible',
    // Accessibility
    'a11y.screen_reader_instructions':
      "Instructions: Utilisez Tab pour naviguer entre les mots. Appuyez sur Entrée ou Espace sur n'importe quel mot pour l'épingler et explorer ses connexions d'alignement. Utilisez les flèches pour naviguer entre les couches d'analyse ci-dessus.",
  },
}
