import { useState, useRef } from "react";

const API_URL = "https://saber131-seaweed-disease-v2.hf.space";

// All 50 languages
const LANGUAGES = [
  // Original
  { code: "en", label: "English", dir: "ltr" },
  { code: "bn", label: "বাংলা", dir: "ltr" },
  // European
  { code: "sq", label: "Shqip", dir: "ltr" },       // Albanian
  { code: "eu", label: "Euskara", dir: "ltr" },      // Basque
  { code: "bg", label: "Български", dir: "ltr" },    // Bulgarian
  { code: "ca", label: "Català", dir: "ltr" },       // Catalan
  { code: "hr", label: "Hrvatski", dir: "ltr" },     // Croatian
  { code: "cs", label: "Čeština", dir: "ltr" },      // Czech
  { code: "da", label: "Dansk", dir: "ltr" },        // Danish
  { code: "nl", label: "Nederlands", dir: "ltr" },   // Dutch
  { code: "et", label: "Eesti", dir: "ltr" },        // Estonian
  { code: "fi", label: "Suomi", dir: "ltr" },        // Finnish
  { code: "fr", label: "Français", dir: "ltr" },     // French
  { code: "de", label: "Deutsch", dir: "ltr" },      // German
  { code: "el", label: "Ελληνικά", dir: "ltr" },     // Greek
  { code: "hu", label: "Magyar", dir: "ltr" },       // Hungarian
  { code: "is", label: "Íslenska", dir: "ltr" },     // Icelandic
  { code: "ga", label: "Gaeilge", dir: "ltr" },      // Irish
  { code: "it", label: "Italiano", dir: "ltr" },     // Italian
  { code: "lv", label: "Latviešu", dir: "ltr" },     // Latvian
  { code: "lt", label: "Lietuvių", dir: "ltr" },     // Lithuanian
  { code: "mk", label: "Македонски", dir: "ltr" },   // Macedonian
  { code: "no", label: "Norsk", dir: "ltr" },        // Norwegian
  { code: "pl", label: "Polski", dir: "ltr" },       // Polish
  { code: "pt", label: "Português", dir: "ltr" },    // Portuguese
  { code: "ro", label: "Română", dir: "ltr" },       // Romanian
  { code: "ru", label: "Русский", dir: "ltr" },      // Russian
  { code: "gd", label: "Gàidhlig", dir: "ltr" },     // Scots Gaelic
  { code: "sr", label: "Српски", dir: "ltr" },       // Serbian
  { code: "sk", label: "Slovenčina", dir: "ltr" },   // Slovak
  { code: "sl", label: "Slovenščina", dir: "ltr" },  // Slovenian
  { code: "es", label: "Español", dir: "ltr" },      // Spanish
  { code: "sv", label: "Svenska", dir: "ltr" },      // Swedish
  { code: "uk", label: "Українська", dir: "ltr" },   // Ukrainian
  // Asian & Middle Eastern
  { code: "ar", label: "العربية", dir: "rtl" },      // Arabic
  { code: "zh", label: "中文", dir: "ltr" },         // Chinese
  { code: "he", label: "עברית", dir: "rtl" },        // Hebrew
  { code: "hi", label: "हिन्दी", dir: "ltr" },       // Hindi
  { code: "id", label: "Indonesia", dir: "ltr" },    // Indonesian
  { code: "ja", label: "日本語", dir: "ltr" },        // Japanese
  { code: "ko", label: "한국어", dir: "ltr" },        // Korean
  { code: "ms", label: "Melayu", dir: "ltr" },       // Malay
  { code: "fa", label: "فارسی", dir: "rtl" },        // Persian
  { code: "tl", label: "Filipino", dir: "ltr" },     // Tagalog
  { code: "th", label: "ภาษาไทย", dir: "ltr" },      // Thai
  { code: "tr", label: "Türkçe", dir: "ltr" },       // Turkish
  { code: "vi", label: "Tiếng Việt", dir: "ltr" },   // Vietnamese
  // Other
  { code: "eo", label: "Esperanto", dir: "ltr" },    // Esperanto
  { code: "haw", label: "ʻŌlelo Hawaiʻi", dir: "ltr" }, // Hawaiian
  { code: "mi", label: "Māori", dir: "ltr" },        // Maori
  { code: "sw", label: "Kiswahili", dir: "ltr" },    // Swahili
];

const TEXT = {
  en: {
    appSub: "Seaweed Disease Detector",
    uploadTitle: "Upload a seaweed image",
    uploadSub: "Drag & drop or click to browse",
    uploadFormat: "JPG, PNG supported",
    uploadWarn: "⚠️ Upload seaweed images only",
    chooseBtn: "Choose image",
    analyzeBtn: "Analyze image",
    changBtn: "Choose different image",
    loading: "Analyzing your seaweed image...",
    resultLabel: "Detection result",
    confidence: "% confidence",
    tryAgain: "Try another image",
    error: "Could not connect to the API. Please try again.",
    selectLang: "Select Language",
  },
  bn: {
    appSub: "সামুদ্রিক শৈবাল রোগ সনাক্তকারী",
    uploadTitle: "সামুদ্রিক শৈবালের ছবি আপলোড করুন",
    uploadSub: "ড্র্যাগ করুন বা ক্লিক করুন",
    uploadFormat: "JPG, PNG সমর্থিত",
    uploadWarn: "⚠️ শুধুমাত্র শৈবালের ছবি আপলোড করুন",
    chooseBtn: "ছবি বেছে নিন",
    analyzeBtn: "ছবি বিশ্লেষণ করুন",
    changBtn: "অন্য ছবি বেছে নিন",
    loading: "আপনার শৈবালের ছবি বিশ্লেষণ করা হচ্ছে...",
    resultLabel: "রোগ সনাক্তকরণ ফলাফল",
    confidence: "% নিশ্চিত",
    tryAgain: "আরেকটি ছবি চেষ্টা করুন",
    error: "এপিআই-এর সাথে সংযোগ হয়নি। আবার চেষ্টা করুন।",
    selectLang: "ভাষা বেছে নিন",
  },
  // Albanian
  sq: {
    appSub: "Detektor i Sëmundjeve të Algave",
    uploadTitle: "Ngarko një imazh të algave",
    uploadSub: "Zvarrit & lësho ose kliko për të shfletuar",
    uploadFormat: "JPG, PNG mbështeten",
    uploadWarn: "⚠️ Ngarko vetëm imazhe algash",
    chooseBtn: "Zgjidh imazh",
    analyzeBtn: "Analizë imazhin",
    changBtn: "Zgjidh imazh tjetër",
    loading: "Duke analizuar imazhin e algave tuaja...",
    resultLabel: "Rezultati i zbulimit",
    confidence: "% besim",
    tryAgain: "Provo imazh tjetër",
    error: "Nuk mund të lidhet me API-n. Ju lutemi provoni përsëri.",
    selectLang: "Zgjidh Gjuhën",
  },
  // Basque
  eu: {
    appSub: "Itsas Alga Gaixotasunen Detektagailua",
    uploadTitle: "Kargatu alga irudi bat",
    uploadSub: "Arrastatu & jaregin edo klikatu arakatzeko",
    uploadFormat: "JPG, PNG onartzen dira",
    uploadWarn: "⚠️ Kargatu alga irudiak soilik",
    chooseBtn: "Aukeratu irudia",
    analyzeBtn: "Aztertu irudia",
    changBtn: "Aukeratu irudi desberdina",
    loading: "Zure alga irudia aztertzen...",
    resultLabel: "Detekzio emaitza",
    confidence: "% konfiantza",
    tryAgain: "Saiatu irudi batekin",
    error: "Ezin da API-rekin konektatu. Mesedez, saiatu berriro.",
    selectLang: "Hizkuntza hautatu",
  },
  // Bulgarian
  bg: {
    appSub: "Детектор за болести по морски водорасли",
    uploadTitle: "Качете изображение на водорасли",
    uploadSub: "Плъзнете & пуснете или кликнете",
    uploadFormat: "JPG, PNG се поддържат",
    uploadWarn: "⚠️ Качвайте само изображения на водорасли",
    chooseBtn: "Изберете изображение",
    analyzeBtn: "Анализирай изображение",
    changBtn: "Изберете друго изображение",
    loading: "Анализира се вашето изображение на водорасли...",
    resultLabel: "Резултат от разпознаването",
    confidence: "% увереност",
    tryAgain: "Опитайте с друго изображение",
    error: "Не може да се свърже с API. Моля, опитайте отново.",
    selectLang: "Изберете Език",
  },
  // Catalan
  ca: {
    appSub: "Detector de Malalties d'Algues Marines",
    uploadTitle: "Puja una imatge d'alga",
    uploadSub: "Arrossega & deixa anar o fes clic per explorar",
    uploadFormat: "JPG, PNG compatibles",
    uploadWarn: "⚠️ Puja només imatges d'algues",
    chooseBtn: "Tria imatge",
    analyzeBtn: "Analitza la imatge",
    changBtn: "Tria una altra imatge",
    loading: "Analitzant la teva imatge d'alga...",
    resultLabel: "Resultat de detecció",
    confidence: "% de confiança",
    tryAgain: "Prova amb una altra imatge",
    error: "No s'ha pogut connectar amb l'API. Si us plau, torneu-ho a intentar.",
    selectLang: "Selecciona l'Idioma",
  },
  // Croatian
  hr: {
    appSub: "Detektor bolesti morskih algi",
    uploadTitle: "Učitajte sliku algi",
    uploadSub: "Povucite & ispustite ili kliknite za pregledavanje",
    uploadFormat: "JPG, PNG podržani",
    uploadWarn: "⚠️ Učitajte samo slike algi",
    chooseBtn: "Odaberi sliku",
    analyzeBtn: "Analiziraj sliku",
    changBtn: "Odaberi drugu sliku",
    loading: "Analiziranje vaše slike algi...",
    resultLabel: "Rezultat detekcije",
    confidence: "% pouzdanost",
    tryAgain: "Isprobajte drugu sliku",
    error: "Nije se moguće spojiti na API. Molimo pokušajte ponovno.",
    selectLang: "Odaberi Jezik",
  },
  // Czech
  cs: {
    appSub: "Detektor nemocí mořských řas",
    uploadTitle: "Nahrajte obrázek řasy",
    uploadSub: "Přetáhněte nebo klikněte pro procházení",
    uploadFormat: "JPG, PNG jsou podporovány",
    uploadWarn: "⚠️ Nahrajte pouze obrázky řas",
    chooseBtn: "Vybrat obrázek",
    analyzeBtn: "Analyzovat obrázek",
    changBtn: "Vybrat jiný obrázek",
    loading: "Analyzuji váš obrázek řasy...",
    resultLabel: "Výsledek detekce",
    confidence: "% jistota",
    tryAgain: "Zkuste jiný obrázek",
    error: "Nelze se připojit k API. Zkuste to prosím znovu.",
    selectLang: "Vyberte Jazyk",
  },
  // Danish
  da: {
    appSub: "Detektor for tangssygdomme",
    uploadTitle: "Upload et tangbillede",
    uploadSub: "Træk & slip eller klik for at gennemse",
    uploadFormat: "JPG, PNG understøttes",
    uploadWarn: "⚠️ Upload kun tangbilleder",
    chooseBtn: "Vælg billede",
    analyzeBtn: "Analysér billede",
    changBtn: "Vælg andet billede",
    loading: "Analyserer dit tangbillede...",
    resultLabel: "Detektionsresultat",
    confidence: "% sikkerhed",
    tryAgain: "Prøv et andet billede",
    error: "Kunne ikke oprette forbindelse til API'et. Prøv venligst igen.",
    selectLang: "Vælg Sprog",
  },
  // Dutch
  nl: {
    appSub: "Zeewier Ziektedetector",
    uploadTitle: "Upload een zeewierafbeelding",
    uploadSub: "Slepen & neerzetten of klikken om te bladeren",
    uploadFormat: "JPG, PNG ondersteund",
    uploadWarn: "⚠️ Upload alleen zeewierafbeeldingen",
    chooseBtn: "Kies afbeelding",
    analyzeBtn: "Analyseer afbeelding",
    changBtn: "Kies een andere afbeelding",
    loading: "Uw zeewierafbeelding analyseren...",
    resultLabel: "Detectieresultaat",
    confidence: "% betrouwbaarheid",
    tryAgain: "Probeer een andere afbeelding",
    error: "Kon geen verbinding maken met de API. Probeer het opnieuw.",
    selectLang: "Selecteer Taal",
  },
  // Estonian
  et: {
    appSub: "Merevetikate haiguste detektor",
    uploadTitle: "Laadi üles merevetika pilt",
    uploadSub: "Lohista & lase lahti või kliki sirvimiseks",
    uploadFormat: "JPG, PNG toetatud",
    uploadWarn: "⚠️ Lae üles ainult merevetika pilte",
    chooseBtn: "Vali pilt",
    analyzeBtn: "Analüüsi pilti",
    changBtn: "Vali teine pilt",
    loading: "Teie merevetika pildi analüüsimine...",
    resultLabel: "Tuvastamise tulemus",
    confidence: "% kindlus",
    tryAgain: "Proovi teist pilti",
    error: "API-ga ei saanud ühendust. Palun proovige uuesti.",
    selectLang: "Vali Keel",
  },
  // Finnish
  fi: {
    appSub: "Merilevän tautien tunnistin",
    uploadTitle: "Lataa merilevän kuva",
    uploadSub: "Vedä & pudota tai napsauta selataksesi",
    uploadFormat: "JPG, PNG tuettu",
    uploadWarn: "⚠️ Lataa vain merilevän kuvia",
    chooseBtn: "Valitse kuva",
    analyzeBtn: "Analysoi kuva",
    changBtn: "Valitse toinen kuva",
    loading: "Analysoidaan merilevän kuvaasi...",
    resultLabel: "Tunnistuksen tulos",
    confidence: "% varmuus",
    tryAgain: "Kokeile toista kuvaa",
    error: "API:iin ei saada yhteyttä. Yritä uudelleen.",
    selectLang: "Valitse Kieli",
  },
  // French
  fr: {
    appSub: "Détecteur de maladies des algues marines",
    uploadTitle: "Télécharger une image d'algue",
    uploadSub: "Glisser-déposer ou cliquer pour parcourir",
    uploadFormat: "JPG, PNG pris en charge",
    uploadWarn: "⚠️ Télécharger uniquement des images d'algues",
    chooseBtn: "Choisir une image",
    analyzeBtn: "Analyser l'image",
    changBtn: "Choisir une autre image",
    loading: "Analyse de votre image d'algue en cours...",
    resultLabel: "Résultat de détection",
    confidence: "% de confiance",
    tryAgain: "Essayer une autre image",
    error: "Impossible de se connecter à l'API. Veuillez réessayer.",
    selectLang: "Sélectionner la Langue",
  },
  // German
  de: {
    appSub: "Seetang-Krankheitsdetektor",
    uploadTitle: "Seetangbild hochladen",
    uploadSub: "Ziehen & ablegen oder klicken zum Durchsuchen",
    uploadFormat: "JPG, PNG unterstützt",
    uploadWarn: "⚠️ Nur Seetangbilder hochladen",
    chooseBtn: "Bild auswählen",
    analyzeBtn: "Bild analysieren",
    changBtn: "Anderes Bild auswählen",
    loading: "Ihr Seetangbild wird analysiert...",
    resultLabel: "Erkennungsergebnis",
    confidence: "% Vertrauen",
    tryAgain: "Ein anderes Bild ausprobieren",
    error: "Verbindung zur API nicht möglich. Bitte versuchen Sie es erneut.",
    selectLang: "Sprache auswählen",
  },
  // Greek
  el: {
    appSub: "Ανιχνευτής Ασθενειών Φυκιών",
    uploadTitle: "Ανεβάστε μια εικόνα φυκιών",
    uploadSub: "Σύρετε & αφήστε ή κάντε κλικ για αναζήτηση",
    uploadFormat: "JPG, PNG υποστηρίζονται",
    uploadWarn: "⚠️ Ανεβάστε μόνο εικόνες φυκιών",
    chooseBtn: "Επιλογή εικόνας",
    analyzeBtn: "Ανάλυση εικόνας",
    changBtn: "Επιλέξτε άλλη εικόνα",
    loading: "Ανάλυση της εικόνας φυκιών σας...",
    resultLabel: "Αποτέλεσμα ανίχνευσης",
    confidence: "% εμπιστοσύνη",
    tryAgain: "Δοκιμάστε άλλη εικόνα",
    error: "Δεν ήταν δυνατή η σύνδεση με το API. Παρακαλώ δοκιμάστε ξανά.",
    selectLang: "Επιλέξτε Γλώσσα",
  },
  // Hungarian
  hu: {
    appSub: "Tengeri alga betegség detektor",
    uploadTitle: "Töltsön fel egy alga képet",
    uploadSub: "Húzza & ejtse vagy kattintson a böngészéshez",
    uploadFormat: "JPG, PNG támogatott",
    uploadWarn: "⚠️ Csak alga képeket töltsön fel",
    chooseBtn: "Kép kiválasztása",
    analyzeBtn: "Kép elemzése",
    changBtn: "Más kép kiválasztása",
    loading: "Az alga képe elemzés alatt...",
    resultLabel: "Észlelési eredmény",
    confidence: "% bizalom",
    tryAgain: "Próbáljon meg egy másik képet",
    error: "Nem sikerült csatlakozni az API-hoz. Kérjük, próbálja újra.",
    selectLang: "Válasszon Nyelvet",
  },
  // Icelandic
  is: {
    appSub: "Þarasjúkdómagreini",
    uploadTitle: "Hladdu upp mynd af þara",
    uploadSub: "Dragðu & slepptu eða smelltu til að vafra",
    uploadFormat: "JPG, PNG stutt",
    uploadWarn: "⚠️ Hladdu aðeins upp myndum af þara",
    chooseBtn: "Veldu mynd",
    analyzeBtn: "Greindu mynd",
    changBtn: "Veldu aðra mynd",
    loading: "Greini þaramyndina þína...",
    resultLabel: "Niðurstaða greiningar",
    confidence: "% öryggi",
    tryAgain: "Prófaðu aðra mynd",
    error: "Gat ekki tengst API. Vinsamlegast reyndu aftur.",
    selectLang: "Veldu Tungumál",
  },
  // Irish
  ga: {
    appSub: "Braiteoir Galair Feamainne",
    uploadTitle: "Uaslódáil íomhá feamainne",
    uploadSub: "Tarraing & scaoil nó cliceáil le brabhsáil",
    uploadFormat: "JPG, PNG tacaithe",
    uploadWarn: "⚠️ Uaslódáil íomhánna feamainne amháin",
    chooseBtn: "Roghnaigh íomhá",
    analyzeBtn: "Anailís a dhéanamh ar íomhá",
    changBtn: "Roghnaigh íomhá eile",
    loading: "Ag anailísiú d'íomhá feamainne...",
    resultLabel: "Toradh braite",
    confidence: "% muinín",
    tryAgain: "Bain triail as íomhá eile",
    error: "Níorbh fhéidir ceangal le API. Déan iarracht eile le do thoil.",
    selectLang: "Roghnaigh Teanga",
  },
  // Italian
  it: {
    appSub: "Rilevatore di malattie delle alghe marine",
    uploadTitle: "Carica un'immagine di alga",
    uploadSub: "Trascina & rilascia o clicca per sfogliare",
    uploadFormat: "JPG, PNG supportati",
    uploadWarn: "⚠️ Carica solo immagini di alghe",
    chooseBtn: "Scegli immagine",
    analyzeBtn: "Analizza immagine",
    changBtn: "Scegli un'altra immagine",
    loading: "Analisi dell'immagine dell'alga in corso...",
    resultLabel: "Risultato del rilevamento",
    confidence: "% fiducia",
    tryAgain: "Prova un'altra immagine",
    error: "Impossibile connettersi all'API. Riprova.",
    selectLang: "Seleziona Lingua",
  },
  // Latvian
  lv: {
    appSub: "Jūraszāļu slimību detektors",
    uploadTitle: "Augšupielādēt jūraszāļu attēlu",
    uploadSub: "Velciet & nometiet vai noklikšķiniet, lai pārlūkotu",
    uploadFormat: "JPG, PNG atbalstīti",
    uploadWarn: "⚠️ Augšupielādējiet tikai jūraszāļu attēlus",
    chooseBtn: "Izvēlēties attēlu",
    analyzeBtn: "Analizēt attēlu",
    changBtn: "Izvēlēties citu attēlu",
    loading: "Analizē jūsu jūraszāļu attēlu...",
    resultLabel: "Noteikšanas rezultāts",
    confidence: "% pārliecība",
    tryAgain: "Izmēģiniet citu attēlu",
    error: "Nevarēja izveidot savienojumu ar API. Lūdzu, mēģiniet vēlreiz.",
    selectLang: "Izvēlieties Valodu",
  },
  // Lithuanian
  lt: {
    appSub: "Jūržolių ligų detektorius",
    uploadTitle: "Įkelkite jūržolių paveikslėlį",
    uploadSub: "Vilkite & numeskite arba spustelėkite naršyti",
    uploadFormat: "JPG, PNG palaikomi",
    uploadWarn: "⚠️ Įkelkite tik jūržolių paveikslėlius",
    chooseBtn: "Pasirinkti paveikslėlį",
    analyzeBtn: "Analizuoti paveikslėlį",
    changBtn: "Pasirinkti kitą paveikslėlį",
    loading: "Analizuojamas jūsų jūržolių paveikslėlis...",
    resultLabel: "Aptikimo rezultatas",
    confidence: "% pasitikėjimas",
    tryAgain: "Išbandykite kitą paveikslėlį",
    error: "Nepavyko prisijungti prie API. Bandykite dar kartą.",
    selectLang: "Pasirinkite Kalbą",
  },
  // Macedonian
  mk: {
    appSub: "Детектор за болести на морски алги",
    uploadTitle: "Прикачете слика на алги",
    uploadSub: "Повлечете & пуштете или кликнете за прелистување",
    uploadFormat: "JPG, PNG се поддржани",
    uploadWarn: "⚠️ Прикачете само слики на алги",
    chooseBtn: "Изберете слика",
    analyzeBtn: "Анализирај слика",
    changBtn: "Изберете друга слика",
    loading: "Анализирање на вашата слика на алги...",
    resultLabel: "Резултат на откривање",
    confidence: "% доверба",
    tryAgain: "Пробајте друга слика",
    error: "Не може да се поврзе со API. Ве молиме обидете се повторно.",
    selectLang: "Изберете Јазик",
  },
  // Norwegian
  no: {
    appSub: "Tang- og taresykdomsdetektor",
    uploadTitle: "Last opp et tangbilde",
    uploadSub: "Dra & slipp eller klikk for å bla gjennom",
    uploadFormat: "JPG, PNG støttes",
    uploadWarn: "⚠️ Last kun opp tangbilder",
    chooseBtn: "Velg bilde",
    analyzeBtn: "Analyser bilde",
    changBtn: "Velg et annet bilde",
    loading: "Analyserer tangbildet ditt...",
    resultLabel: "Deteksjonsresultat",
    confidence: "% sikkerhet",
    tryAgain: "Prøv et annet bilde",
    error: "Kunne ikke koble til API-et. Vær så snill å prøv igjen.",
    selectLang: "Velg Språk",
  },
  // Polish
  pl: {
    appSub: "Detektor chorób wodorostów",
    uploadTitle: "Prześlij zdjęcie wodorostu",
    uploadSub: "Przeciągnij & upuść lub kliknij, aby przeglądać",
    uploadFormat: "JPG, PNG obsługiwane",
    uploadWarn: "⚠️ Przesyłaj tylko zdjęcia wodorostów",
    chooseBtn: "Wybierz zdjęcie",
    analyzeBtn: "Analizuj zdjęcie",
    changBtn: "Wybierz inne zdjęcie",
    loading: "Analizowanie zdjęcia wodorostu...",
    resultLabel: "Wynik wykrywania",
    confidence: "% pewność",
    tryAgain: "Spróbuj z innym zdjęciem",
    error: "Nie udało się połączyć z API. Spróbuj ponownie.",
    selectLang: "Wybierz Język",
  },
  // Portuguese
  pt: {
    appSub: "Detector de doenças em algas marinhas",
    uploadTitle: "Carregar uma imagem de alga",
    uploadSub: "Arrastar & soltar ou clicar para navegar",
    uploadFormat: "JPG, PNG suportados",
    uploadWarn: "⚠️ Carregue apenas imagens de algas",
    chooseBtn: "Escolher imagem",
    analyzeBtn: "Analisar imagem",
    changBtn: "Escolher outra imagem",
    loading: "Analisando a sua imagem de alga...",
    resultLabel: "Resultado de detecção",
    confidence: "% confiança",
    tryAgain: "Tentar outra imagem",
    error: "Não foi possível conectar à API. Por favor, tente novamente.",
    selectLang: "Selecionar Idioma",
  },
  // Romanian
  ro: {
    appSub: "Detector de boli ale algelor marine",
    uploadTitle: "Încărcați o imagine cu algă",
    uploadSub: "Trageți & plasați sau faceți clic pentru a naviga",
    uploadFormat: "JPG, PNG acceptate",
    uploadWarn: "⚠️ Încărcați numai imagini cu alge",
    chooseBtn: "Alegeți imaginea",
    analyzeBtn: "Analizați imaginea",
    changBtn: "Alegeți altă imagine",
    loading: "Se analizează imaginea dvs. cu algă...",
    resultLabel: "Rezultatul detecției",
    confidence: "% încredere",
    tryAgain: "Încercați o altă imagine",
    error: "Nu s-a putut conecta la API. Vă rugăm să încercați din nou.",
    selectLang: "Selectați Limba",
  },
  // Russian
  ru: {
    appSub: "Детектор болезней морских водорослей",
    uploadTitle: "Загрузите изображение водоросли",
    uploadSub: "Перетащите или нажмите для просмотра",
    uploadFormat: "JPG, PNG поддерживаются",
    uploadWarn: "⚠️ Загружайте только изображения водорослей",
    chooseBtn: "Выбрать изображение",
    analyzeBtn: "Анализировать изображение",
    changBtn: "Выбрать другое изображение",
    loading: "Анализ вашего изображения водоросли...",
    resultLabel: "Результат обнаружения",
    confidence: "% уверенность",
    tryAgain: "Попробуйте другое изображение",
    error: "Не удалось подключиться к API. Пожалуйста, попробуйте снова.",
    selectLang: "Выберите Язык",
  },
  // Scots Gaelic
  gd: {
    appSub: "Lorgair Ghalar Feamainne",
    uploadTitle: "Lod suas dealbh feamainne",
    uploadSub: "Tarraing & leig às no briog airson brabhsadh",
    uploadFormat: "JPG, PNG air an taic",
    uploadWarn: "⚠️ Lod suas dealbhan feamainne a-mhàin",
    chooseBtn: "Tagh dealbh",
    analyzeBtn: "Mion-sgrùdaich dealbh",
    changBtn: "Tagh dealbh eile",
    loading: "A' mion-sgrùdadh do dhealbh feamainne...",
    resultLabel: "Toradh lorgaidh",
    confidence: "% cinnt",
    tryAgain: "Feuch dealbh eile",
    error: "Cha b' urrainn dèanamh ceangal ris an API. Feuch a-rithist.",
    selectLang: "Tagh Cànan",
  },
  // Serbian
  sr: {
    appSub: "Детектор болести морских алги",
    uploadTitle: "Отпремите слику алге",
    uploadSub: "Превуците & испустите или кликните за преглед",
    uploadFormat: "JPG, PNG су подржани",
    uploadWarn: "⚠️ Отпремајте само слике алги",
    chooseBtn: "Одаберите слику",
    analyzeBtn: "Анализирај слику",
    changBtn: "Одаберите другу слику",
    loading: "Анализирање ваше слике алге...",
    resultLabel: "Резултат откривања",
    confidence: "% поверење",
    tryAgain: "Испробајте другу слику",
    error: "Није могуће повезати се са API-јем. Покушајте поново.",
    selectLang: "Изаберите Језик",
  },
  // Slovak
  sk: {
    appSub: "Detektor chorôb morských rias",
    uploadTitle: "Nahrajte obrázok riasy",
    uploadSub: "Potiahnite & pustite alebo kliknite pre prehliadanie",
    uploadFormat: "JPG, PNG sú podporované",
    uploadWarn: "⚠️ Nahrajte iba obrázky rias",
    chooseBtn: "Vybrať obrázok",
    analyzeBtn: "Analyzovať obrázok",
    changBtn: "Vybrať iný obrázok",
    loading: "Analyzujem váš obrázok riasy...",
    resultLabel: "Výsledok detekcie",
    confidence: "% istota",
    tryAgain: "Skúste iný obrázok",
    error: "Nepodarilo sa pripojiť k API. Skúste to prosím znova.",
    selectLang: "Vyberte Jazyk",
  },
  // Slovenian
  sl: {
    appSub: "Zaznovalnik bolezni morskih alg",
    uploadTitle: "Naložite sliko alge",
    uploadSub: "Povlecite & spustite ali kliknite za brskanje",
    uploadFormat: "JPG, PNG so podprti",
    uploadWarn: "⚠️ Naložite samo slike alg",
    chooseBtn: "Izberi sliko",
    analyzeBtn: "Analiziraj sliko",
    changBtn: "Izberi drugo sliko",
    loading: "Analiziranje vaše slike alge...",
    resultLabel: "Rezultat zaznave",
    confidence: "% zaupanje",
    tryAgain: "Preizkusite drugo sliko",
    error: "Ni bilo mogoče vzpostaviti povezave z API-jem. Poskusite znova.",
    selectLang: "Izberite Jezik",
  },
  // Spanish
  es: {
    appSub: "Detector de enfermedades de algas marinas",
    uploadTitle: "Subir una imagen de alga",
    uploadSub: "Arrastra & suelta o haz clic para navegar",
    uploadFormat: "JPG, PNG compatibles",
    uploadWarn: "⚠️ Sube solo imágenes de algas",
    chooseBtn: "Elegir imagen",
    analyzeBtn: "Analizar imagen",
    changBtn: "Elegir una imagen diferente",
    loading: "Analizando tu imagen de alga...",
    resultLabel: "Resultado de detección",
    confidence: "% de confianza",
    tryAgain: "Intentar con otra imagen",
    error: "No se pudo conectar con la API. Por favor, inténtelo de nuevo.",
    selectLang: "Seleccionar Idioma",
  },
  // Swedish
  sv: {
    appSub: "Tångsjukdomsdetektor",
    uploadTitle: "Ladda upp en tångbild",
    uploadSub: "Dra & släpp eller klicka för att bläddra",
    uploadFormat: "JPG, PNG stöds",
    uploadWarn: "⚠️ Ladda bara upp tångbilder",
    chooseBtn: "Välj bild",
    analyzeBtn: "Analysera bild",
    changBtn: "Välj en annan bild",
    loading: "Analyserar din tångbild...",
    resultLabel: "Detektionsresultat",
    confidence: "% säkerhet",
    tryAgain: "Prova en annan bild",
    error: "Det gick inte att ansluta till API:et. Försök igen.",
    selectLang: "Välj Språk",
  },
  // Ukrainian
  uk: {
    appSub: "Детектор хвороб морських водоростей",
    uploadTitle: "Завантажте зображення водорості",
    uploadSub: "Перетягніть або натисніть для перегляду",
    uploadFormat: "JPG, PNG підтримуються",
    uploadWarn: "⚠️ Завантажуйте лише зображення водоростей",
    chooseBtn: "Вибрати зображення",
    analyzeBtn: "Аналізувати зображення",
    changBtn: "Вибрати інше зображення",
    loading: "Аналіз вашого зображення водорості...",
    resultLabel: "Результат виявлення",
    confidence: "% впевненість",
    tryAgain: "Спробуйте інше зображення",
    error: "Не вдалося підключитися до API. Будь ласка, спробуйте ще раз.",
    selectLang: "Виберіть Мову",
  },
  // Arabic
  ar: {
    appSub: "كاشف أمراض الطحالب البحرية",
    uploadTitle: "قم بتحميل صورة طحالب",
    uploadSub: "اسحب & أفلت أو انقر للتصفح",
    uploadFormat: "JPG, PNG مدعومان",
    uploadWarn: "⚠️ قم بتحميل صور الطحالب فقط",
    chooseBtn: "اختر صورة",
    analyzeBtn: "تحليل الصورة",
    changBtn: "اختر صورة مختلفة",
    loading: "جاري تحليل صورة طحالبك...",
    resultLabel: "نتيجة الكشف",
    confidence: "% ثقة",
    tryAgain: "جرب صورة أخرى",
    error: "تعذر الاتصال بالـ API. يرجى المحاولة مرة أخرى.",
    selectLang: "اختر اللغة",
  },
  // Chinese
  zh: {
    appSub: "海藻疾病检测器",
    uploadTitle: "上传海藻图片",
    uploadSub: "拖放或点击浏览",
    uploadFormat: "支持 JPG、PNG",
    uploadWarn: "⚠️ 仅上传海藻图片",
    chooseBtn: "选择图片",
    analyzeBtn: "分析图片",
    changBtn: "选择其他图片",
    loading: "正在分析您的海藻图片...",
    resultLabel: "检测结果",
    confidence: "% 置信度",
    tryAgain: "尝试其他图片",
    error: "无法连接到 API，请重试。",
    selectLang: "选择语言",
  },
  // Hebrew
  he: {
    appSub: "גלאי מחלות אצות ים",
    uploadTitle: "העלה תמונת אצה",
    uploadSub: "גרור & שחרר או לחץ לעיון",
    uploadFormat: "JPG, PNG נתמכים",
    uploadWarn: "⚠️ העלה תמונות אצות בלבד",
    chooseBtn: "בחר תמונה",
    analyzeBtn: "נתח תמונה",
    changBtn: "בחר תמונה אחרת",
    loading: "מנתח את תמונת האצה שלך...",
    resultLabel: "תוצאת זיהוי",
    confidence: "% ביטחון",
    tryAgain: "נסה תמונה אחרת",
    error: "לא ניתן להתחבר ל-API. אנא נסה שוב.",
    selectLang: "בחר שפה",
  },
  // Hindi
  hi: {
    appSub: "समुद्री घास रोग संसूचक",
    uploadTitle: "समुद्री घास की छवि अपलोड करें",
    uploadSub: "खींचें और छोड़ें या क्लिक करके ब्राउज़ करें",
    uploadFormat: "JPG, PNG समर्थित",
    uploadWarn: "⚠️ केवल समुद्री घास की छवियां अपलोड करें",
    chooseBtn: "छवि चुनें",
    analyzeBtn: "छवि विश्लेषण करें",
    changBtn: "अलग छवि चुनें",
    loading: "आपकी समुद्री घास की छवि का विश्लेषण हो रहा है...",
    resultLabel: "पहचान परिणाम",
    confidence: "% विश्वास",
    tryAgain: "दूसरी छवि आज़माएं",
    error: "API से कनेक्ट नहीं हो सका। कृपया पुनः प्रयास करें।",
    selectLang: "भाषा चुनें",
  },
  // Indonesian
  id: {
    appSub: "Detektor Penyakit Rumput Laut",
    uploadTitle: "Unggah gambar rumput laut",
    uploadSub: "Seret & lepas atau klik untuk menelusuri",
    uploadFormat: "JPG, PNG didukung",
    uploadWarn: "⚠️ Unggah gambar rumput laut saja",
    chooseBtn: "Pilih gambar",
    analyzeBtn: "Analisis gambar",
    changBtn: "Pilih gambar berbeda",
    loading: "Menganalisis gambar rumput laut Anda...",
    resultLabel: "Hasil deteksi",
    confidence: "% kepercayaan",
    tryAgain: "Coba gambar lain",
    error: "Tidak dapat terhubung ke API. Silakan coba lagi.",
    selectLang: "Pilih Bahasa",
  },
  // Japanese
  ja: {
    appSub: "海藻病気検出器",
    uploadTitle: "海藻の画像をアップロード",
    uploadSub: "ドラッグ＆ドロップまたはクリックして参照",
    uploadFormat: "JPG、PNG対応",
    uploadWarn: "⚠️ 海藻の画像のみアップロードしてください",
    chooseBtn: "画像を選択",
    analyzeBtn: "画像を分析",
    changBtn: "別の画像を選択",
    loading: "海藻の画像を分析中...",
    resultLabel: "検出結果",
    confidence: "% 信頼度",
    tryAgain: "別の画像を試す",
    error: "APIに接続できませんでした。もう一度お試しください。",
    selectLang: "言語を選択",
  },
  // Korean
  ko: {
    appSub: "해초 질병 감지기",
    uploadTitle: "해초 이미지 업로드",
    uploadSub: "드래그 & 드롭 또는 클릭하여 찾아보기",
    uploadFormat: "JPG, PNG 지원",
    uploadWarn: "⚠️ 해초 이미지만 업로드하세요",
    chooseBtn: "이미지 선택",
    analyzeBtn: "이미지 분석",
    changBtn: "다른 이미지 선택",
    loading: "해초 이미지를 분석하는 중...",
    resultLabel: "감지 결과",
    confidence: "% 신뢰도",
    tryAgain: "다른 이미지 시도",
    error: "API에 연결할 수 없습니다. 다시 시도해 주세요.",
    selectLang: "언어 선택",
  },
  // Malay
  ms: {
    appSub: "Pengesan Penyakit Rumpai Laut",
    uploadTitle: "Muat naik imej rumpai laut",
    uploadSub: "Seret & lepas atau klik untuk melayari",
    uploadFormat: "JPG, PNG disokong",
    uploadWarn: "⚠️ Muat naik imej rumpai laut sahaja",
    chooseBtn: "Pilih imej",
    analyzeBtn: "Analisis imej",
    changBtn: "Pilih imej lain",
    loading: "Menganalisis imej rumpai laut anda...",
    resultLabel: "Keputusan pengesanan",
    confidence: "% keyakinan",
    tryAgain: "Cuba imej lain",
    error: "Tidak dapat menyambung ke API. Sila cuba lagi.",
    selectLang: "Pilih Bahasa",
  },
  // Persian
  fa: {
    appSub: "تشخیص‌دهنده بیماری جلبک دریایی",
    uploadTitle: "یک تصویر جلبک آپلود کنید",
    uploadSub: "بکشید و رها کنید یا برای مرور کلیک کنید",
    uploadFormat: "JPG، PNG پشتیبانی می‌شوند",
    uploadWarn: "⚠️ فقط تصاویر جلبک آپلود کنید",
    chooseBtn: "انتخاب تصویر",
    analyzeBtn: "تحلیل تصویر",
    changBtn: "انتخاب تصویر دیگر",
    loading: "در حال تحلیل تصویر جلبک شما...",
    resultLabel: "نتیجه تشخیص",
    confidence: "% اطمینان",
    tryAgain: "تصویر دیگری امتحان کنید",
    error: "اتصال به API امکان‌پذیر نیست. لطفاً دوباره امتحان کنید.",
    selectLang: "انتخاب زبان",
  },
  // Tagalog
  tl: {
    appSub: "Detector ng Sakit ng Lumot Dagat",
    uploadTitle: "Mag-upload ng larawan ng lumot dagat",
    uploadSub: "I-drag & i-drop o mag-click para mag-browse",
    uploadFormat: "JPG, PNG sinusuportahan",
    uploadWarn: "⚠️ Mag-upload lamang ng mga larawan ng lumot dagat",
    chooseBtn: "Pumili ng larawan",
    analyzeBtn: "Suriin ang larawan",
    changBtn: "Pumili ng ibang larawan",
    loading: "Sinusuri ang iyong larawan ng lumot dagat...",
    resultLabel: "Resulta ng pagtuklas",
    confidence: "% kumpiyansa",
    tryAgain: "Subukan ang ibang larawan",
    error: "Hindi makakonekta sa API. Pakisubukan muli.",
    selectLang: "Pumili ng Wika",
  },
  // Thai
  th: {
    appSub: "เครื่องตรวจจับโรคสาหร่ายทะเล",
    uploadTitle: "อัพโหลดรูปภาพสาหร่าย",
    uploadSub: "ลากและวางหรือคลิกเพื่อเรียกดู",
    uploadFormat: "รองรับ JPG, PNG",
    uploadWarn: "⚠️ อัพโหลดเฉพาะรูปภาพสาหร่ายเท่านั้น",
    chooseBtn: "เลือกรูปภาพ",
    analyzeBtn: "วิเคราะห์รูปภาพ",
    changBtn: "เลือกรูปภาพอื่น",
    loading: "กำลังวิเคราะห์รูปภาพสาหร่ายของคุณ...",
    resultLabel: "ผลการตรวจจับ",
    confidence: "% ความมั่นใจ",
    tryAgain: "ลองรูปภาพอื่น",
    error: "ไม่สามารถเชื่อมต่อกับ API ได้ โปรดลองอีกครั้ง",
    selectLang: "เลือกภาษา",
  },
  // Turkish
  tr: {
    appSub: "Deniz Yosunu Hastalık Dedektörü",
    uploadTitle: "Deniz yosunu resmi yükle",
    uploadSub: "Sürükle & bırak veya taramak için tıkla",
    uploadFormat: "JPG, PNG destekleniyor",
    uploadWarn: "⚠️ Yalnızca deniz yosunu resimleri yükleyin",
    chooseBtn: "Resim seç",
    analyzeBtn: "Resmi analiz et",
    changBtn: "Farklı resim seç",
    loading: "Deniz yosunu resminiz analiz ediliyor...",
    resultLabel: "Tespit sonucu",
    confidence: "% güven",
    tryAgain: "Başka bir resim deneyin",
    error: "API'ye bağlanılamadı. Lütfen tekrar deneyin.",
    selectLang: "Dil Seç",
  },
  // Vietnamese
  vi: {
    appSub: "Máy dò bệnh tảo biển",
    uploadTitle: "Tải lên hình ảnh tảo biển",
    uploadSub: "Kéo & thả hoặc nhấp để duyệt",
    uploadFormat: "JPG, PNG được hỗ trợ",
    uploadWarn: "⚠️ Chỉ tải lên hình ảnh tảo biển",
    chooseBtn: "Chọn hình ảnh",
    analyzeBtn: "Phân tích hình ảnh",
    changBtn: "Chọn hình ảnh khác",
    loading: "Đang phân tích hình ảnh tảo biển của bạn...",
    resultLabel: "Kết quả phát hiện",
    confidence: "% độ tin cậy",
    tryAgain: "Thử hình ảnh khác",
    error: "Không thể kết nối với API. Vui lòng thử lại.",
    selectLang: "Chọn Ngôn ngữ",
  },
  // Esperanto
  eo: {
    appSub: "Detektilo de Malsanoj de Maralgo",
    uploadTitle: "Alŝutu bildon de maralgo",
    uploadSub: "Trenu & gutigi aŭ alklaku por foliumi",
    uploadFormat: "JPG, PNG subtenataj",
    uploadWarn: "⚠️ Alŝutu nur bildojn de maralgo",
    chooseBtn: "Elekti bildon",
    analyzeBtn: "Analizi bildon",
    changBtn: "Elekti alian bildon",
    loading: "Analizante vian bildon de maralgo...",
    resultLabel: "Rezulto de detekto",
    confidence: "% fido",
    tryAgain: "Provu alian bildon",
    error: "Ne eblis konektiĝi al la API. Bonvolu provi denove.",
    selectLang: "Elekti Lingvon",
  },
  // Hawaiian
  haw: {
    appSub: "Mea ʻike maʻi limu",
    uploadTitle: "Hoʻouka kiʻi limu",
    uploadSub: "Kaʻa & haʻalele a i ʻole kaomi e nānā",
    uploadFormat: "JPG, PNG kākoʻo ʻia",
    uploadWarn: "⚠️ Hoʻouka kiʻi limu wale nō",
    chooseBtn: "Koho kiʻi",
    analyzeBtn: "Nānā kiʻi",
    changBtn: "Koho kiʻi ʻē aʻe",
    loading: "Ke nānā nei i kāu kiʻi limu...",
    resultLabel: "Hopena ʻike",
    confidence: "% paulele",
    tryAgain: "Ho'āʻo i kiʻi ʻē aʻe",
    error: "ʻAʻole hiki ke hoʻohui i ka API. E ʻoluʻolu e hoʻāʻo hou.",
    selectLang: "Koho ʻŌlelo",
  },
  // Maori
  mi: {
    appSub: "Kaitirotiro Māuiuitanga Rimurimu",
    uploadTitle: "Tukiake tētahi āhua rimurimu",
    uploadSub: "Tō & tukua rānei pāwhiria ki te tirotiro",
    uploadFormat: "JPG, PNG tautokohia",
    uploadWarn: "⚠️ Tukiake āhua rimurimu anake",
    chooseBtn: "Kōwhiri āhua",
    analyzeBtn: "Tātari āhua",
    changBtn: "Kōwhiri āhua kē",
    loading: "E tātari ana i tō āhua rimurimu...",
    resultLabel: "Hua kitenga",
    confidence: "% pono",
    tryAgain: "Whakamātau āhua kē",
    error: "Kāore e taea te hono ki te API. Tēnā whakamātau anō.",
    selectLang: "Kōwhiri Reo",
  },
  // Swahili
  sw: {
    appSub: "Kichunguzi cha Magonjwa ya Mwani",
    uploadTitle: "Pakia picha ya mwani",
    uploadSub: "Buruta & acha au bonyeza kuvinjari",
    uploadFormat: "JPG, PNG zinakubaliwa",
    uploadWarn: "⚠️ Pakia picha za mwani tu",
    chooseBtn: "Chagua picha",
    analyzeBtn: "Changanua picha",
    changBtn: "Chagua picha nyingine",
    loading: "Inachunguza picha yako ya mwani...",
    resultLabel: "Matokeo ya ugunduzi",
    confidence: "% imani",
    tryAgain: "Jaribu picha nyingine",
    error: "Haikuweza kuunganika na API. Tafadhali jaribu tena.",
    selectLang: "Chagua Lugha",
  },
};

const DISEASE_NAMES = {
  en: {
    "Healthy Seaweed": "Healthy Seaweed",
    "Ice- Ice Diseases": "Ice-Ice Disease",
    "Bleached": "Bleached Seaweed",
    "Epiphyte Infestation Diseases": "Epiphyte Infestation",
    "Diseased": "Diseased Seaweed",
    "Not a Seaweed": "Not a Seaweed",
  },
  bn: {
    "Healthy Seaweed": "সুস্থ শৈবাল",
    "Ice- Ice Diseases": "আইস-আইস রোগ",
    "Bleached": "বিবর্ণ শৈবাল",
    "Epiphyte Infestation Diseases": "এপিফাইট আক্রমণ",
    "Diseased": "রোগাক্রান্ত শৈবাল",
    "Not a Seaweed": "শৈবাল নয়",
  },
};

// For languages without specific disease translations, fallback to English
const getDiseaseNames = (lang) => DISEASE_NAMES[lang] || DISEASE_NAMES["en"];

const STATUS_COLORS = {
  "Healthy Seaweed":               "#1D9E75",
  "Ice- Ice Diseases":             "#E24B4A",
  "Bleached":                      "#BA7517",
  "Epiphyte Infestation Diseases": "#D85A30",
  "Diseased":                      "#534AB7",
  "Not a Seaweed":                 "#888888",
};

export default function App() {
  const [lang, setLang] = useState("en");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();
  const t = TEXT[lang] || TEXT["en"];
  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const isRTL = currentLangObj.dir === "rtl";

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", image);
      const res = await fetch(`${API_URL}/predict`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(t.error);
    }
    setLoading(false);
  };

  const reset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    inputRef.current.value = "";
  };

  const barColor = result ? (STATUS_COLORS[result.disease] || "#888") : "#888";
  const diseaseNames = getDiseaseNames(lang);
  const diseaseName = result ? (diseaseNames[result.disease] || result.disease) : "";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ minHeight: "100vh", width: "100%", background: "#f0f4f0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: "2rem 1rem", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: "1.5rem", textAlign: "center" }}>
          <div style={{ width: 44, height: 44, background: "#1D9E75", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: 22 }}>🌿</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#111" }}>SeaHealth AI</div>
          <div style={{ fontSize: 13, color: "#888" }}>{t.appSub}</div>

          {/* Language Selector Dropdown */}
          <div style={{ position: "relative", marginTop: 4 }}>
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", background: "white", border: "1.5px solid #1D9E75",
                borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer",
                color: "#1D9E75", minWidth: 140, justifyContent: "space-between",
              }}>
              <span>{currentLangObj.label}</span>
              <span style={{ fontSize: 10, opacity: 0.7 }}>{showLangDropdown ? "▲" : "▼"}</span>
            </button>

            {showLangDropdown && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
                background: "white", border: "1px solid #e0e0e0", borderRadius: 14, zIndex: 100,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)", maxHeight: 280, overflowY: "auto",
                minWidth: 200, padding: "6px 0",
              }}>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setShowLangDropdown(false); }}
                    style={{
                      display: "block", width: "100%", textAlign: "left", padding: "8px 16px",
                      background: lang === l.code ? "#E8F7F2" : "transparent",
                      border: "none", cursor: "pointer", fontSize: 13,
                      color: lang === l.code ? "#1D9E75" : "#333",
                      fontWeight: lang === l.code ? 600 : 400,
                    }}>
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Backdrop to close dropdown */}
        {showLangDropdown && (
          <div
            onClick={() => setShowLangDropdown(false)}
            style={{ position: "fixed", inset: 0, zIndex: 99 }}
          />
        )}

        {/* Upload zone */}
        {!preview && (
          <div
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            style={{ background: dragging ? "#E1F5EE" : "white", border: `2px dashed ${dragging ? "#1D9E75" : "#ccc"}`, borderRadius: 20, padding: "3rem 2rem", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 8 }}>{t.uploadTitle}</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>{t.uploadSub}</div>
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 6 }}>{t.uploadFormat}</div>
            <div style={{ fontSize: 12, color: "#E24B4A", marginBottom: 20 }}>{t.uploadWarn}</div>
            <button
              onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}
              style={{ padding: "11px 28px", background: "#1D9E75", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%" }}>
              {t.chooseBtn}
            </button>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />

        {/* Preview */}
        {preview && !result && !loading && (
          <div>
            <img src={preview} alt="Preview" style={{ width: "100%", borderRadius: 20, border: "0.5px solid #eee", maxHeight: 300, objectFit: "cover" }} />
            <button onClick={analyze} style={{ width: "100%", marginTop: 14, padding: 16, background: "#1D9E75", color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
              {t.analyzeBtn}
            </button>
            <button onClick={reset} style={{ width: "100%", marginTop: 8, padding: 10, background: "transparent", color: "#aaa", border: "none", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
              {t.changBtn}
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 15, color: "#888" }}>{t.loading}</div>
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 8 }}>First request may take up to 60 seconds...</div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div>
            <img src={preview} alt="Preview" style={{ width: "100%", borderRadius: 20, border: "0.5px solid #eee", maxHeight: 240, objectFit: "cover", marginBottom: 16 }} />
            <div style={{ background: "white", border: "0.5px solid #eee", borderRadius: 20, padding: "1.75rem" }}>
              <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{t.resultLabel}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#111", marginBottom: 6 }}>{diseaseName}</div>
              <div style={{ fontSize: 15, color: "#888", marginBottom: 16 }}>{result.confidence}{t.confidence}</div>
              <div style={{ background: "#f2f2f2", borderRadius: 100, height: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${result.confidence}%`, background: barColor, borderRadius: 100, transition: "width 1s ease" }} />
              </div>
            </div>
            <button onClick={reset} style={{ width: "100%", marginTop: 12, padding: 10, background: "transparent", color: "#aaa", border: "none", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
              {t.tryAgain}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ marginTop: 12, padding: "14px 18px", background: "#FCEBEB", border: "0.5px solid #f7c1c1", borderRadius: 12, fontSize: 14, color: "#A32D2D" }}>
            {error}
          </div>
        )}

      </div>
    </div>
  );
}
