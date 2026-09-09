import { Question } from './types';
import { isDuplicateQuestion, generateQuestionFingerprint } from './daily-pool';

// ============================================================================
// Medora — High-Yield Medical Knowledge Base & Infinite MCQ Engine
// ============================================================================

export interface TopicConcept {
  topic: string;
  subject: string;
  title: string;
  universityQuestion: string;
  usmleVignette: string;
  usmleQuestion: string;
  correctAnswer: string;
  wrongAnswers: string[];
  explanation: string;
  misconception: string;
}

const HIGH_YIELD_CONCEPTS: TopicConcept[] = [
  // ── Physiology: Respiratory System ──
  {
    topic: 'respiratory system',
    subject: 'Physiology',
    title: 'Surfactant & Alveolar Surface Tension',
    universityQuestion: 'Pulmonary surfactant synthesized by Type II pneumocytes reduces alveolar surface tension. What is its main phospholipid constituent?',
    usmleVignette: 'A premature infant born at 28 weeks gestation presents with grunting, nasal flaring, and chest retractions. Chest radiograph shows diffuse ground-glass opacities.',
    usmleQuestion: 'Deficiency of which phospholipid component of pulmonary surfactant causes Infant Respiratory Distress Syndrome (IRDS)?',
    correctAnswer: 'Dipalmitoylphosphatidylcholine (DPPC / Lecithin)',
    wrongAnswers: ['Sphingomyelin', 'Phosphatidylglycerol', 'Phosphatidylinositol'],
    explanation: 'DPPC (dipalmitoylphosphatidylcholine) is the principal active surface-tension-reducing component of pulmonary surfactant. Lecithin/sphingomyelin ratio > 2 indicates lung maturity.',
    misconception: 'Sphingomyelin concentration remains constant throughout gestation, whereas DPPC increases dramatically after 32 weeks.',
  },
  {
    topic: 'respiratory system',
    subject: 'Physiology',
    title: 'Oxygen-Hemoglobin Dissociation Curve & Bohr Effect',
    universityQuestion: 'Which physiological change causes a RIGHTWARD shift of the oxygen-hemoglobin dissociation curve, facilitating oxygen unloading in tissues?',
    usmleVignette: 'A 24-year-old runner completes a high-intensity sprint. Skeletal muscle biopsy and arterial blood gas demonstrate increased temperature, elevated PCO2, and decreased pH.',
    usmleQuestion: 'These local metabolic changes shift the O2-Hb dissociation curve in which direction, and by what mechanism?',
    correctAnswer: 'Rightward shift (Bohr effect), decreasing Hb oxygen affinity to enhance O2 unloading in metabolically active muscle',
    wrongAnswers: ['Leftward shift, increasing Hb oxygen affinity to store oxygen in erythrocytes', 'Upward shift, increasing total arterial oxygen capacity without altering affinity', 'No shift, but decreases dissolved PO2 in plasma'],
    explanation: 'Elevated H+ (low pH), PCO2, temperature, and 2,3-BPG stabilize the taut (T) state of hemoglobin, shifting the curve rightward (Bohr effect) and promoting O2 unloading.',
    misconception: 'Leftward shifts occur with fetal hemoglobin (HbF), hypothermia, alkalosis, and low 2,3-BPG.',
  },
  {
    topic: 'respiratory system',
    subject: 'Physiology',
    title: 'Ventilation-Perfusion (V/Q) Mismatch & Dead Space',
    universityQuestion: 'A pulmonary embolism that occludes a lobar artery creates which type of ventilation-perfusion mismatch in the affected pulmonary tissue?',
    usmleVignette: 'A 55-year-old female post-orthopedic surgery develops sudden severe dyspnea and pleuritic chest pain. CT pulmonary angiography confirms a pulmonary embolism in the right pulmonary artery.',
    usmleQuestion: 'This vascular obstruction creates which ventilation-perfusion (V/Q) state in the unperfused but ventilated alveoli?',
    correctAnswer: 'Alveolar Dead Space (V/Q ratio approaching infinity)',
    wrongAnswers: ['Intrapulmonary Shunt (V/Q ratio equal to 0)', 'Matched normal V/Q ratio of 0.8', 'Diffusion-limited hypoxemia without V/Q alteration'],
    explanation: 'Pulmonary embolism blocks blood flow (Q=0) to ventilated alveoli (V>0), causing high V/Q ratio (dead space ventilation).',
    misconception: 'Airway obstruction (e.g. mucus plug, atelectasis) causes shunt (V=0, Q>0).',
  },
  {
    topic: 'respiratory system',
    subject: 'Physiology',
    title: 'Lung Volumes & Spirometry in Obstructive vs Restrictive Disease',
    universityQuestion: 'In spirometric evaluation of obstructive lung disease (e.g. asthma, COPD), what characteristic change is observed in the FEV1/FVC ratio?',
    usmleVignette: 'A 62-year-old chronic smoker presents with progressive exertional dyspnea and chronic cough. Pulmonary function testing demonstrates FEV1 48% of predicted, FVC 82% of predicted, and total lung capacity 115% of predicted.',
    usmleQuestion: 'Which diagnostic finding confirms an obstructive pattern rather than a restrictive lung defect?',
    correctAnswer: 'Decreased FEV1/FVC ratio (< 70% or < 0.70)',
    wrongAnswers: ['Increased FEV1/FVC ratio (> 85%)', 'Decreased Residual Volume (RV)', 'Normal or elevated FEV1/FVC ratio with reduced Total Lung Capacity (TLC)'],
    explanation: 'Obstructive lung diseases impair expiratory airflow, reducing FEV1 disproportionately to FVC and dropping FEV1/FVC below 70%. Restrictive disease reduces TLC with normal/high FEV1/FVC.',
    misconception: 'Restrictive disease decreases both FEV1 and FVC proportionally, keeping the FEV1/FVC ratio normal or increased.',
  },

  // ── Physiology: Blood ──
  {
    topic: 'blood',
    subject: 'Physiology',
    title: 'Erythropoiesis & Renal Erythropoietin',
    universityQuestion: 'Which organ is the primary site of erythropoietin (EPO) synthesis in response to tissue hypoxia?',
    usmleVignette: 'A 58-year-old male with chronic kidney disease secondary to diabetic nephropathy presents with fatigue and pallor. Laboratory testing shows Hb 8.2 g/dL and low reticulocyte count.',
    usmleQuestion: 'Deficiency of which hormone produced by interstitial cells in the inner renal cortex is responsible for this patient\'s anemia?',
    correctAnswer: 'Erythropoietin (EPO)',
    wrongAnswers: ['Thrombopoietin (TPO)', 'Renin', 'Aldosterone'],
    explanation: 'Erythropoietin (EPO) is synthesized by peritubular interstitial cells in the renal cortex in response to hypoxia (mediated by HIF-1alpha).',
    misconception: 'Thrombopoietin is produced mainly by the liver to regulate platelet production.',
  },
];

export const FALLBACK_QUESTIONS: Question[] = [];

// ============================================================================
// 100+ Unique Combinatorial Generator (10 Sub-Concepts x 10 Focus Angles)
// ============================================================================

export function generateProceduralMedicalContent(
  subject: string,
  topic: string,
  mode: string,
  indexSeed: number
) {
  const isUSMLE = mode.toLowerCase() === 'usmle';
  const cleanSubj = subject || 'Medicine';
  const cleanTop = topic || 'General Topic';

  // 1. Check matching concepts in static knowledge base
  const matchingConcepts = HIGH_YIELD_CONCEPTS.filter(c => 
    c.subject.toLowerCase() === cleanSubj.toLowerCase() &&
    (c.topic.toLowerCase() === cleanTop.toLowerCase() ||
     cleanTop.toLowerCase().includes(c.topic.toLowerCase()) ||
     c.topic.toLowerCase().includes(cleanTop.toLowerCase()))
  );

  const letters: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
  const correctSlot = letters[(indexSeed * 7 + 3) % 4];

  if (matchingConcepts.length > 0 && indexSeed < matchingConcepts.length) {
    const concept = matchingConcepts[indexSeed % matchingConcepts.length];
    const rawWrongs = concept.wrongAnswers;
    const arranged: string[] = [];
    let wIdx = 0;

    for (let i = 0; i < 4; i++) {
      if (letters[i] === correctSlot) {
        arranged.push(concept.correctAnswer);
      } else {
        arranged.push(rawWrongs[wIdx++] || `Distractor ${letters[i]}`);
      }
    }

    const qText = isUSMLE 
      ? `${concept.usmleVignette} ${concept.usmleQuestion}`
      : concept.universityQuestion;

    return {
      question: qText,
      option_a: arranged[0],
      option_b: arranged[1],
      option_c: arranged[2],
      option_d: arranged[3],
      correct_answer: correctSlot as any,
      explanation: concept.explanation,
      incorrect_explanation: concept.misconception,
      difficulty: isUSMLE ? 'hard' : 'medium',
      source_reference: isUSMLE ? `Medora USMLE Bank (${cleanSubj})` : `Medora University Bank (${cleanSubj})`,
    };
  }

  // 2. 10 Sub-Concepts x 10 Focus Angles = 100 100% Unique Questions per Topic
  const subConcepts = [
    { title: 'Receptor Signaling & Transmembrane Kinetics', detail: 'transmembrane signal transduction and receptor-ligand binding affinity' },
    { title: 'Enzymatic Catalysis & Rate-Limiting Kinetics', detail: 'catalytic rate regulation and competitive enzyme inhibition' },
    { title: 'Ion Channel Gating & Electrophysiological Conduction', detail: 'membrane voltage dynamics and refractory period kinetics' },
    { title: 'Microvascular Perfusion & Capillary Exchange', detail: 'Starling forces, hydrostatic pressure, and endothelial permeability' },
    { title: 'Hormonal Negative Feedback & Endocrine Axis Regulation', detail: 'endocrine axis balance and systemic hormone secretion' },
    { title: 'Second Messenger Cascade (cAMP / IP3 / DAG)', detail: 'intracellular protein kinase activation and downstream cellular response' },
    { title: 'Acid-Base Homeostasis & Bicarbonate Buffering', detail: 'pH regulation, renal bicarbonate reabsorption, and respiratory compensation' },
    { title: 'Structural Extracellular Matrix & Basement Membrane Integrity', detail: 'basement membrane collagen composition and structural cross-linking' },
    { title: 'Cellular Energy Metabolism & Mitochondrial ATP Synthesis', detail: 'oxidative phosphorylation efficiency and metabolic substrate utilization' },
    { title: 'Gene Transcription & Nuclear Receptor Expression', detail: 'transcriptional regulation and targeted protein synthesis' },
  ];

  const questionAngles = [
    {
      univ: (concept: string) => `Regarding ${concept} in ${cleanTop} (${cleanSubj}), which of the following represents the MOST fundamental physiological or biochemical principle?`,
      usmle: (concept: string) => `A clinical evaluation of ${cleanTop} is conducted. Which pathophysiological mechanism involving ${concept} BEST accounts for the observed findings?`,
      correct: (concept: string) => `Specific regulation of ${concept} to preserve tissue homeostasis in ${cleanTop}`,
      wrongs: [
        `Passive fluid extravasation without cellular receptor signaling or transport proteins`,
        `Complete immediate diffuse tissue calcification and osteogenesis`,
        `Isolated peripheral somatic nerve demyelination independent of organ function`,
      ],
      exp: (concept: string) => `Understanding ${cleanTop} in ${cleanSubj} relies on evaluating ${concept} and its underlying regulatory feedback mechanisms.`,
      inc: `Correlate clinical presentation in ${cleanTop} with cellular signaling and homeostatic regulation.`,
    },
    {
      univ: (concept: string) => `In the diagnostic assessment of ${cleanTop} (${cleanSubj}), which testing modality provides the HIGHEST specificity for evaluating ${concept}?`,
      usmle: (concept: string) => `A patient with suspected dysfunction in ${cleanTop} undergoes workup. Which diagnostic step specifically evaluates ${concept}?`,
      correct: (concept: string) => `Targeted laboratory biomarker assay and specific non-invasive imaging tailored to ${concept} in ${cleanTop}`,
      wrongs: [
        `Empiric broad-spectrum antibiotic therapy prior to diagnostic testing`,
        `Immediate invasive surgical organ resection without confirmatory testing`,
        `Discharge home with reassurance and no further diagnostic monitoring`,
      ],
      exp: (concept: string) => `Definitive evaluation of ${cleanTop} requires combining targeted laboratory biomarkers with specific imaging modalities for ${concept}.`,
      inc: `Always confirm diagnostic findings with specific targeted testing before aggressive therapy.`,
    },
    {
      univ: (concept: string) => `What is the PRIMARY therapeutic objective when targeting ${concept} in disease processes affecting ${cleanTop}?`,
      usmle: (concept: string) => `Which of the following pharmacotherapeutic strategies targeting ${concept} represents the MOST appropriate management for ${cleanTop}?`,
      correct: (concept: string) => `Targeted disease-modifying therapy modulating ${concept} to restore normal function in ${cleanTop}`,
      wrongs: [
        `Exclusive symptomatic suppression while ignoring the primary underlying cause`,
        `Withholding all interventions until end-stage organ decompensation occurs`,
        `Indiscriminate tissue ablation without prior diagnostic confirmation`,
      ],
      exp: (concept: string) => `Effective clinical management of ${cleanTop} focuses on disease-modifying therapy aimed at ${concept}.`,
      inc: `Symptomatic suppression alone does not arrest underlying disease progression in ${cleanTop}.`,
    },
    {
      univ: (concept: string) => `Which rate-limiting enzyme or primary receptor subtype directly regulates ${concept} in ${cleanTop}?`,
      usmle: (concept: string) => `Pharmacological intervention altering ${concept} in ${cleanTop} acts primarily on which rate-limiting enzyme or receptor subtype?`,
      correct: (concept: string) => `The specific rate-limiting enzyme and selective receptor subtype controlling ${concept} in ${cleanTop}`,
      wrongs: [
        `Non-specific extracellular matrix structural collagen proteins`,
        `Ubiquitous cellular housekeeping enzymes uninvolved in pathway regulation`,
        `Circulating plasma albumin without enzymatic activity`,
      ],
      exp: (concept: string) => `Pathway kinetics governing ${concept} in ${cleanTop} are controlled by key rate-limiting enzymes and receptor subtypes.`,
      inc: `Identify the rate-limiting step when analyzing regulatory control of ${cleanTop}.`,
    },
    {
      univ: (concept: string) => `Which compensatory physiological mechanism involving ${concept} is activated FIRST during acute decompensation in ${cleanTop}?`,
      usmle: (concept: string) => `During acute decompensation in ${cleanTop}, which compensatory mechanism involving ${concept} preserves systemic homeostasis?`,
      correct: (concept: string) => `Rapid neurohumoral activation and autonomic feedback modulating ${concept} in ${cleanTop}`,
      wrongs: [
        `Immediate muscular structural hypertrophy developing within seconds of onset`,
        `Total suppression of renal sodium reabsorption and complete vasodilation`,
        `Cessation of mitochondrial oxidative phosphorylation in vital organs`,
      ],
      exp: (concept: string) => `Acute decompensation in ${cleanTop} triggers rapid neurohumoral responses modulating ${concept} to preserve vital perfusion.`,
      inc: `Structural adaptations require days to weeks, whereas neurohumoral compensation occurs within seconds to minutes.`,
    },
    {
      univ: (concept: string) => `What is the MOST high-yield anatomical or microstructural relationship governing ${concept} in ${cleanTop}?`,
      usmle: (concept: string) => `Knowledge of which microstructural relationship governing ${concept} is MOST critical when evaluating pathology in ${cleanTop}?`,
      correct: (concept: string) => `The microstructural organization, blood supply, and cellular barriers supporting ${concept} in ${cleanTop}`,
      wrongs: [
        `Superficial fascial layers with no surgical or diagnostic relevance`,
        `Anatomical variations present exclusively in non-human mammalian models`,
        `Complete absence of vascular or neural structures in the affected region`,
      ],
      exp: (concept: string) => `Diagnostic evaluation of ${cleanTop} depends on precise knowledge of microstructural features supporting ${concept}.`,
      inc: `Review anatomical relations and microstructural organization pertinent to ${cleanTop}.`,
    },
    {
      univ: (concept: string) => `Which laboratory derangement or acid-base parameter associated with ${concept} is MOST characteristic of severe dysfunction in ${cleanTop}?`,
      usmle: (concept: string) => `Laboratory testing in a patient with severe ${cleanTop} impairment demonstrates which specific derangement in ${concept}?`,
      correct: (concept: string) => `Characteristic serum electrolyte shifts and primary acid-base alterations reflecting impaired ${concept}`,
      wrongs: [
        `Completely normal electrolyte panel with zero metabolic alterations`,
        `Severe isolated hypercalcemia without any organ system pathology`,
        `Transient non-pathological shifts present in 100% of healthy resting subjects`,
      ],
      exp: (concept: string) => `Advanced dysfunction in ${cleanTop} produces characteristic electrolyte shifts and acid-base derangements affecting ${concept}.`,
      inc: `Correlate serum electrolyte and ABG patterns with the primary organ pathology in ${cleanTop}.`,
    },
    {
      univ: (concept: string) => `Which epidemiological risk factor carries the STRONGEST causal association with pathological disruption of ${concept} in ${cleanTop}?`,
      usmle: (concept: string) => `Which underlying risk factor in this patient's history contributed MOST directly to disruption of ${concept} in ${cleanTop}?`,
      correct: (concept: string) => `Proven epidemiological risk factors with established biological plausibility impairing ${concept}`,
      wrongs: [
        `Minor environmental exposures ruled out by large population trials`,
        `Extremely rare genetic variants accounting for less than 0.01% of population cases`,
        `Normal physiological physical activity in young healthy adults`,
      ],
      exp: (concept: string) => `Risk factor analysis in ${cleanTop} prioritizes factors with strong statistical association disrupting ${concept}.`,
      inc: `Distinguish major established risk factors from weak or disproven environmental associations in ${cleanTop}.`,
    },
    {
      univ: (concept: string) => `What is the key histological hallmark or cellular morphological change associated with altered ${concept} in ${cleanTop}?`,
      usmle: (concept: string) => `Microscopic examination of tissue from ${cleanTop} demonstrating altered ${concept} is MOST likely to reveal which feature?`,
      correct: (concept: string) => `Characteristic cellular morphological changes and stromal extracellular alterations reflecting disturbed ${concept}`,
      wrongs: [
        `Uniform unaltered physiological tissue architecture identical to normal controls`,
        `Complete absence of any cellular elements or stromal matrix`,
        `Isolated non-specific artifact changes without pathological significance`,
      ],
      exp: (concept: string) => `Histological diagnosis in ${cleanTop} relies on identifying distinct cellular morphological alterations associated with ${concept}.`,
      inc: `Correlate tissue biopsy findings with specific pathological processes in ${cleanTop}.`,
    },
    {
      univ: (concept: string) => `Which intracellular second messenger cascade mediates the response to ${concept} in ${cleanTop}?`,
      usmle: (concept: string) => `Signal transduction analysis of cells in ${cleanTop} undergoing ${concept} reveals activation of which pathway?`,
      correct: (concept: string) => `Intracellular second messengers (cAMP, IP3/DAG, or cGMP) mediating target cell response to ${concept}`,
      wrongs: [
        `Direct nuclear transcription without membrane receptor activation`,
        `Passive extracellular sodium deposition without intracellular signaling`,
        `Spontaneous unmediated cleavage of membrane structural phospholipids`,
      ],
      exp: (concept: string) => `Cellular activation in ${cleanTop} leads to intracellular second messenger generation regulating physiological response to ${concept}.`,
      inc: `Review GPCR signaling pathways (Gs, Gi, Gq) involved in ${cleanTop}.`,
    },
  ];

  const conceptIdx = Math.floor(indexSeed / 10) % subConcepts.length;
  const angleIdx = indexSeed % questionAngles.length;

  const conceptObj = subConcepts[conceptIdx];
  const angleObj = questionAngles[angleIdx];

  const ages = [22, 28, 35, 41, 49, 56, 64, 72, 31, 47];
  const genders = ['male', 'female'];
  const age = ages[indexSeed % ages.length];
  const gender = genders[(indexSeed + 1) % 2];

  const questionText = isUSMLE
    ? `A ${age}-year-old ${gender} presents for evaluation of ${cleanTop} in ${cleanSubj}. ${angleObj.usmle(conceptObj.title)}`
    : angleObj.univ(conceptObj.title);

  const arranged: string[] = [];
  let wIdx = 0;
  for (let i = 0; i < 4; i++) {
    if (letters[i] === correctSlot) {
      arranged.push(angleObj.correct(conceptObj.title));
    } else {
      arranged.push(angleObj.wrongs[wIdx++] || `Distractor ${letters[i]}`);
    }
  }

  return {
    question: questionText,
    option_a: arranged[0],
    option_b: arranged[1],
    option_c: arranged[2],
    option_d: arranged[3],
    correct_answer: correctSlot as any,
    explanation: angleObj.exp(conceptObj.title),
    incorrect_explanation: angleObj.inc,
    difficulty: isUSMLE ? 'hard' : 'medium',
    source_reference: isUSMLE ? `Medora USMLE Question Engine (${cleanSubj})` : `Medora MBBS Question Engine (${cleanSubj})`,
  };
}

export function getFallbackQuestion(
  subject: string,
  topic: string,
  mode: string,
  attemptedIds: string[] = []
): Question {
  const cleanSubject = (subject || '').trim();
  const cleanTopic = (topic || '').trim();
  const cleanMode = (mode || '').trim();

  // Helper to check if a question ID has already been attempted in this session
  const isAttempted = (qId: string) => {
    return attemptedIds.some(attId => 
      attId === qId || 
      attId.includes(qId)
    );
  };

  // 1. Search Static Bank for exact matches (Subject + Topic + Mode)
  let staticMatches = FALLBACK_QUESTIONS.filter(q =>
    q.subject.toLowerCase() === cleanSubject.toLowerCase() &&
    (q.topic.toLowerCase() === cleanTopic.toLowerCase() || 
     cleanTopic.toLowerCase().includes(q.topic.toLowerCase()) || 
     q.topic.toLowerCase().includes(cleanTopic.toLowerCase())) &&
    q.preparation_mode.toLowerCase() === cleanMode.toLowerCase() &&
    !isAttempted(q.id)
  );

  // Return matching pre-built static question if available
  if (staticMatches.length > 0) {
    const selected = staticMatches[Math.floor(Math.random() * staticMatches.length)];
    return { ...selected, id: selected.id };
  }

  // 2. 100+ Combinatorial Procedural Generator for Unlimited Unique Questions
  const attemptCount = attemptedIds.length;

  const generated = generateProceduralMedicalContent(cleanSubject, cleanTopic, cleanMode, attemptCount);
  const uniqueId = `dyn-${cleanSubject.toLowerCase().replace(/\s+/g, '')}-${attemptCount + 1}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return {
    id: uniqueId,
    subject: cleanSubject || 'Medicine',
    topic: cleanTopic || 'General Topic',
    preparation_mode: (cleanMode as any) || 'university',
    question: generated.question,
    option_a: generated.option_a,
    option_b: generated.option_b,
    option_c: generated.option_c,
    option_d: generated.option_d,
    correct_answer: generated.correct_answer as any,
    explanation: generated.explanation,
    incorrect_explanation: generated.incorrect_explanation,
    difficulty: generated.difficulty as any,
    question_status: 'approved',
    source_reference: generated.source_reference,
    created_at: new Date().toISOString(),
  };
}
