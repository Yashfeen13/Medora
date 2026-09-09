// ============================================
// Medora — Constants & Subject Data
// ============================================

import { SubjectInfo } from './types';

// ── MBBS Subjects with topics ──
export const SUBJECTS: SubjectInfo[] = [
  {
    name: 'Anatomy',
    icon: '🦴',
    description: 'Study of the structure of the human body',
    color: '#3B82F6',
    topics: [
      'Upper Limb', 'Lower Limb', 'Thorax', 'Abdomen', 'Pelvis & Perineum',
      'Head & Neck', 'Neuroanatomy', 'Histology', 'Embryology', 'Back & Vertebral Column',
      'Surface Anatomy', 'Cross-Sectional Anatomy'
    ],
  },
  {
    name: 'Physiology',
    icon: '💓',
    description: 'Functions and mechanisms of the living body',
    color: '#EF4444',
    topics: [
      'General Physiology', 'Blood', 'Nerve & Muscle', 'Cardiovascular System',
      'Respiratory System', 'Renal Physiology', 'GI Physiology',
      'Endocrine System', 'Reproductive Physiology', 'Neurophysiology',
      'Special Senses', 'Exercise Physiology'
    ],
  },
  {
    name: 'Biochemistry',
    icon: '🧬',
    description: 'Chemical processes within living organisms',
    color: '#8B5CF6',
    topics: [
      'Amino Acids & Proteins', 'Enzymes', 'Carbohydrate Metabolism',
      'Lipid Metabolism', 'Nucleic Acids', 'Molecular Biology',
      'Vitamins & Minerals', 'Hormones', 'Organ Function Tests',
      'Clinical Biochemistry', 'Bioenergetics'
    ],
  },
  {
    name: 'Pharmacology',
    icon: '💊',
    description: 'Drug actions, uses, and side effects',
    color: '#F59E0B',
    topics: [
      'General Pharmacology', 'Autonomic Nervous System', 'Cardiovascular Drugs',
      'CNS Pharmacology', 'Analgesics & Anti-inflammatory', 'Antimicrobials',
      'Chemotherapy', 'Endocrine Pharmacology', 'GI Pharmacology',
      'Respiratory Pharmacology', 'Autacoids', 'Immunopharmacology'
    ],
  },
  {
    name: 'Pathology',
    icon: '🔬',
    description: 'Mechanisms and manifestations of disease',
    color: '#EC4899',
    topics: [
      'General Pathology', 'Inflammation & Repair', 'Hemodynamic Disorders',
      'Neoplasia', 'Genetic Disorders', 'Immunopathology',
      'Hematopathology', 'Cardiovascular Pathology', 'Respiratory Pathology',
      'GI Pathology', 'Hepatobiliary Pathology', 'Renal Pathology',
      'Endocrine Pathology', 'Neuropathology'
    ],
  },
  {
    name: 'Microbiology',
    icon: '🦠',
    description: 'Study of microorganisms and infectious diseases',
    color: '#10B981',
    topics: [
      'General Microbiology', 'Immunology', 'Bacteriology',
      'Virology', 'Mycology', 'Parasitology',
      'Hospital Infections', 'Sterilization & Disinfection',
      'Diagnostic Microbiology', 'Applied Microbiology'
    ],
  },
  {
    name: 'Forensic Medicine',
    icon: '⚖️',
    description: 'Application of medicine in legal contexts',
    color: '#6366F1',
    topics: [
      'Legal Procedures', 'Identification', 'Cause of Death',
      'Mechanical Injuries', 'Firearm Injuries', 'Asphyxia',
      'Poisoning', 'Sexual Offenses', 'Forensic Psychiatry',
      'Medical Ethics', 'Toxicology'
    ],
  },
  {
    name: 'Community Medicine',
    icon: '🏥',
    description: 'Preventive and social aspects of medicine',
    color: '#14B8A6',
    topics: [
      'Epidemiology', 'Biostatistics', 'Nutrition',
      'Maternal & Child Health', 'Communicable Diseases',
      'Non-Communicable Diseases', 'Health Programs',
      'Environmental Health', 'Occupational Health',
      'Demography', 'Health Education', 'Healthcare Management'
    ],
  },
  {
    name: 'Medicine',
    icon: '🩺',
    description: 'Diagnosis and treatment of internal diseases',
    color: '#0EA5E9',
    topics: [
      'Cardiovascular Medicine', 'Respiratory Medicine', 'Gastroenterology',
      'Nephrology', 'Neurology', 'Hematology',
      'Endocrinology', 'Rheumatology', 'Infectious Diseases',
      'Emergency Medicine', 'Critical Care', 'Clinical Immunology'
    ],
  },
  {
    name: 'Surgery',
    icon: '🔪',
    description: 'Operative treatment of diseases and injuries',
    color: '#F97316',
    topics: [
      'General Surgery', 'GI Surgery', 'Hepatobiliary Surgery',
      'Breast Surgery', 'Endocrine Surgery', 'Vascular Surgery',
      'Urology', 'Trauma Surgery', 'Surgical Infections',
      'Pre & Post Operative Care', 'Surgical Oncology'
    ],
  },
  {
    name: 'Pediatrics',
    icon: '👶',
    description: 'Medical care of infants, children, and adolescents',
    color: '#A855F7',
    topics: [
      'Neonatology', 'Growth & Development', 'Nutrition & Feeding',
      'Immunization', 'Infectious Diseases', 'Respiratory Disorders',
      'Cardiovascular Disorders', 'GI Disorders', 'Renal Disorders',
      'Hematological Disorders', 'Neurological Disorders', 'Pediatric Emergencies'
    ],
  },
  {
    name: 'Obstetrics & Gynecology',
    icon: '🤰',
    description: 'Pregnancy, childbirth, and female reproductive health',
    color: '#E11D48',
    topics: [
      'Normal Pregnancy', 'High-Risk Pregnancy', 'Labor & Delivery',
      'Postpartum Care', 'Contraception', 'Infertility',
      'Menstrual Disorders', 'Gynecological Infections',
      'Gynecological Tumors', 'Obstetric Emergencies'
    ],
  },
  {
    name: 'Ophthalmology',
    icon: '👁️',
    description: 'Diseases and surgery of the eye',
    color: '#06B6D4',
    topics: [
      'Anatomy of the Eye', 'Optics & Refraction', 'Conjunctiva & Cornea',
      'Lens & Cataract', 'Glaucoma', 'Retina & Vitreous',
      'Uveal Tract', 'Eyelids & Lacrimal', 'Squint',
      'Neuro-ophthalmology', 'Ocular Trauma'
    ],
  },
  {
    name: 'ENT',
    icon: '👂',
    description: 'Ear, nose, throat, and head-neck disorders',
    color: '#84CC16',
    topics: [
      'Ear Anatomy & Physiology', 'Hearing Loss', 'Otitis Media',
      'Nose & Paranasal Sinuses', 'Pharynx & Tonsils', 'Larynx',
      'Head & Neck Tumors', 'Salivary Glands', 'Tracheostomy',
      'ENT Emergencies', 'Audiology'
    ],
  },
  {
    name: 'Psychiatry',
    icon: '🧠',
    description: 'Mental health disorders and their treatment',
    color: '#7C3AED',
    topics: [
      'Classification of Mental Disorders', 'Schizophrenia', 'Mood Disorders',
      'Anxiety Disorders', 'Personality Disorders', 'Substance Use Disorders',
      'Child Psychiatry', 'Psychotherapy', 'Psychopharmacology',
      'Forensic Psychiatry', 'Emergency Psychiatry'
    ],
  },
  {
    name: 'Radiology',
    icon: '📡',
    description: 'Medical imaging for diagnosis and treatment',
    color: '#64748B',
    topics: [
      'X-Ray Basics', 'Chest Radiology', 'Abdominal Radiology',
      'Musculoskeletal Radiology', 'Neuroradiology', 'CT Scan',
      'MRI', 'Ultrasound', 'Interventional Radiology',
      'Radiation Safety', 'Contrast Media'
    ],
  },
  {
    name: 'Dermatology',
    icon: '🧴',
    description: 'Skin diseases and their management',
    color: '#FB923C',
    topics: [
      'Basic Skin Lesions', 'Bacterial Infections', 'Fungal Infections',
      'Viral Infections', 'Parasitic Infestations', 'Eczema & Dermatitis',
      'Papulosquamous Disorders', 'Vesiculobullous Diseases',
      'Connective Tissue Disorders', 'Skin Tumors', 'STIs'
    ],
  },
  {
    name: 'Orthopedics',
    icon: '🦿',
    description: 'Musculoskeletal system disorders and injuries',
    color: '#0D9488',
    topics: [
      'General Orthopedics', 'Fractures - Upper Limb', 'Fractures - Lower Limb',
      'Spine Disorders', 'Joint Disorders', 'Bone Tumors',
      'Infections of Bone & Joint', 'Congenital Disorders',
      'Sports Medicine', 'Orthopedic Emergencies', 'Rehabilitation'
    ],
  },
  {
    name: 'Anesthesiology',
    icon: '😷',
    description: 'Anesthesia, pain management, and critical care',
    color: '#6B7280',
    topics: [
      'Pre-Anesthetic Evaluation', 'General Anesthesia', 'Regional Anesthesia',
      'Local Anesthetics', 'Airway Management', 'Monitoring',
      'Pain Management', 'Critical Care', 'Resuscitation',
      'Anesthetic Complications', 'Fluid & Blood Transfusion'
    ],
  },
];

// ── Preparation Modes ──
export const PREPARATION_MODES = [
  {
    id: 'university' as const,
    title: 'University Preparation',
    description: 'Practice standard MBBS university-level MCQs and strengthen your core concepts.',
    icon: '🎓',
    color: '#3B82F6',
    features: ['Core MBBS concepts', 'Direct knowledge-based questions', 'Basic to intermediate difficulty'],
  },
  {
    id: 'usmle' as const,
    title: 'USMLE Preparation',
    description: 'Practice more challenging, conceptual and clinically oriented questions designed for USMLE-style preparation.',
    icon: '🏆',
    color: '#14B8A6',
    features: ['Clinical scenarios & vignettes', 'Application-based reasoning', 'Higher difficulty'],
  },
];

// ── Motivational Messages ──
export const CORRECT_MESSAGES = [
  "Excellent work! 🎉",
  "You're getting stronger! 💪",
  "Great job! Keep it up! ⭐",
  "Keep going! You're on fire! 🔥",
  "Perfect! You nailed it! 🎯",
  "Outstanding! 🌟",
  "Brilliant answer! 🧠",
  "You really know your stuff! 📚",
  "Impressive knowledge! 👏",
  "That's the right diagnosis! ✅",
];

export const INCORRECT_MESSAGES = [
  "Don't worry — this is a learning opportunity. 📖",
  "Let's understand this concept together. 🤝",
  "Almost there! You'll get it next time. 💡",
  "Now you know what to review. 📝",
  "Every mistake makes you stronger. 💪",
  "Learning from mistakes is the best medicine! 🩺",
  "Not quite — let's fix the concept. 🔧",
  "Keep going — you're still learning! 🌱",
];

// ── Helper Functions ──
export function getRandomMessage(isCorrect: boolean): string {
  const messages = isCorrect ? CORRECT_MESSAGES : INCORRECT_MESSAGES;
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getSubjectByName(name: string): SubjectInfo | undefined {
  return SUBJECTS.find(s => s.name === name);
}

export function getTopicsForSubject(subjectName: string): string[] {
  const subject = getSubjectByName(subjectName);
  return subject?.topics || [];
}
