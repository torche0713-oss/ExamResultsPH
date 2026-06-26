// ─── Realistic Filipino names, schools, regions ───
const _first = ['Maria','Juan','Jose','Antonio','Carlos','Miguel','Isabella','Sofia','Angela','Patricia','Gabriel','Rafael','Luis','Andres','Diego','Marco','Paolo','Vincent','Christian','Michael','Eduardo','Fernando','Ricardo','Emilio','Ramon','Pedro','Manuel','Francisco','Jorge','Raul','Cristina','Carmen','Ana','Teresa','Rosa','Elena','Luz','Gloria','Lourdes','Fe','Liza','Maricar','Diana','Jasmine','Grace','Angelica','Kathryn','Michelle','Irene','Bianca'];
const _last = ['Santos','Reyes','Cruz','Garcia','Mendoza','Lopez','Villanueva','Flores','Gonzales','Dela Cruz','Ramos','Fernandez','Torres','Rivera','Castillo','Salvador','Diaz','Romero','Aquino','Navarro','Palma','Valdez','Ocampo','De Leon','Marcos','Aguilar','Miranda','Soriano','Mercado','Delgado','Velasco','Rosario','Villa','Manalaysay','Magtoto','Dimagiba','Panganiban','Lansangan','Tiangco','Bautista','Alcantara','Vergara','Sarmiento','Lazaro','Villegas','Hernandez','Jimenez','Nazareno','Quijano','Arellano'];
const _schools = [
  {name:'University of the Philippines - Diliman',reg:'NCR'},
  {name:'Polytechnic University of the Philippines',reg:'NCR'},
  {name:'University of Santo Tomas',reg:'NCR'},
  {name:'De La Salle University',reg:'NCR'},
  {name:'Ateneo de Manila University',reg:'NCR'},
  {name:'University of the Philippines - Manila',reg:'NCR'},
  {name:'University of the East',reg:'NCR'},
  {name:'Far Eastern University',reg:'NCR'},
  {name:'University of the Philippines - Los Banos',reg:'Region IV-A'},
  {name:'University of San Carlos',reg:'Region VII'},
  {name:'Ateneo de Zamboanga University',reg:'Region IX'},
  {name:'Mindanao State University',reg:'Region X'},
  {name:'Saint Louis University',reg:'CAR'},
  {name:'Central Philippine University',reg:'Region VI'},
  {name:'Xavier University',reg:'Region X'},
  {name:'University of the Immaculate Conception',reg:'Region XI'},
  {name:'University of San Agustin',reg:'Region VI'},
  {name:'Mariano Marcos State University',reg:'Region I'},
  {name:'Bicol University',reg:'Region V'},
  {name:'Palawan State University',reg:'Region IV-B'},
  {name:'Don Mariano Marcos Memorial State University',reg:'Region I'},
  {name:'Cebu Normal University',reg:'Region VII'},
  {name:'University of Southeastern Philippines',reg:'Region XI'},
  {name:'Western Mindanao State University',reg:'Region IX'},
  {name:'Tarlac State University',reg:'Region III'},
  {name:'Bulacan State University',reg:'Region III'},
  {name:'University of Rizal System',reg:'Region IV-A'},
  {name:'Pangasinan State University',reg:'Region I'},
  {name:'Cagayan State University',reg:'Region II'},
  {name:'Isabela State University',reg:'Region II'}
];

function rand(max) { return Math.floor(Math.random() * max); }
function pick(arr) { return arr[rand(arr.length)]; }

function genNames(count) {
  const used = new Set();
  const result = [];
  while (result.length < count) {
    const name = pick(_first) + ' ' + pick(_last);
    if (!used.has(name)) { used.add(name); result.push(name); }
  }
  return result;
}

function genPassers(count, schoolPool, baseRating) {
  const names = genNames(count);
  const passers = [];
  for (let i = 0; i < count; i++) {
    const school = schoolPool[i % schoolPool.length];
    passers.push({
      rank: i + 1,
      name: names[i],
      school: school.name,
      region: school.reg,
      rating: (baseRating - i * 0.35 - Math.random() * 0.5).toFixed(1) + '%'
    });
  }
  return passers;
}

function genTopnotchers(names, schools, count) {
  const list = [];
  const medals = ['🥇','🥈','🥉','🏅','🏅','🏅','🏅','🏅','🏅','🏅','🏅','🏅'];
  for (let i = 0; i < count; i++) {
    const s = schools[i];
    list.push({
      name: names[i],
      school: s.name,
      rating: (98.5 - i * 0.9 - Math.random() * 0.3).toFixed(1) + '%',
      medal: medals[i] || '🏅'
    });
  }
  return list;
}

function genSchools(schoolPool, examinees, passRate) {
  return schoolPool.slice(0, 5).map((s, i) => {
    const ex = Math.floor(examinees / schoolPool.length * (1.5 - i * 0.15));
    const pass = Math.floor(ex * (passRate / 100) * (1 + (4 - i) * 0.02));
    return {
      rank: i + 1,
      name: s.name,
      examinees: ex,
      passed: pass,
      rate: (pass / ex * 100).toFixed(1) + '%'
    };
  });
}

const examTypes = {
  'let': { title: 'Licensure Exam for Professional Teachers', short: 'LET', category: 'Education', schoolsIdx: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14] },
  'cse': { title: 'Civil Service Exam (CSE-PPT)', short: 'CSE-PPT', category: 'Government', schoolsIdx: [0,1,2,3,4,6,8,9,12,15,16,17,18,19,20] },
  'nursing': { title: 'Nursing Licensure Exam', short: 'Nursing', category: 'Medical', schoolsIdx: [0,2,4,5,7,9,10,11,12,13,14,15,16,21,22] },
  'cpa': { title: 'Certified Public Accountant (CPA) Licensure Exam', short: 'CPA', category: 'Accountancy', schoolsIdx: [0,2,3,4,5,6,7,8,9,11,12,14,16,25,26] },
  'ale': { title: 'Architecture Licensure Exam (ALE)', short: 'ALE', category: 'Engineering', schoolsIdx: [0,2,3,4,8,9,11,12,14,16,17,18,19,22,24] },
  'napolcom': { title: 'NAPOLCOM Entrance Exam', short: 'NAPOLCOM', category: 'Government', schoolsIdx: [0,1,2,4,6,9,10,11,12,13,14,15,18,22,23] },
  'psychometrician': { title: 'Psychometrician Licensure Exam', short: 'Psychometrician', category: 'Medical', schoolsIdx: [0,2,3,4,5,6,7,8,9,10,11,12,13,14,15] },
  'socialworker': { title: 'Social Worker Licensure Exam', short: 'Social Worker', category: 'Education', schoolsIdx: [0,1,2,4,6,8,9,10,11,12,13,14,15,16,19] },
  'medtech': { title: 'Medical Technologist Licensure Exam', short: 'MedTech', category: 'Medical', schoolsIdx: [0,2,5,7,9,10,11,12,13,14,15,16,21,22,23] },
  'criminologist': { title: 'Criminologist Licensure Exam', short: 'Criminologist', category: 'Government', schoolsIdx: [0,1,3,6,9,10,11,12,14,15,16,18,19,22,24] },
  'electrical': { title: 'Electrical Engineering Licensure Exam', short: 'EE', category: 'Engineering', schoolsIdx: [0,1,2,3,4,6,8,9,11,12,14,16,17,18,19] },
  'mechanical': { title: 'Mechanical Engineering Licensure Exam', short: 'ME', category: 'Engineering', schoolsIdx: [0,1,2,3,6,8,9,11,12,14,16,17,19,24,25] },
  'civil': { title: 'Civil Engineering Licensure Exam', short: 'CE', category: 'Engineering', schoolsIdx: [0,1,2,3,6,8,9,11,12,14,16,17,19,24,25] },
  'pharmacy': { title: 'Pharmacist Licensure Exam', short: 'Pharmacy', category: 'Medical', schoolsIdx: [0,2,5,7,9,10,12,13,14,15,16,21,22,23,26] }
};

const examSchedule = [
  // 2026 exams
  {slug:'let-march-2026', type:'let', month:'March 2026', date:'March 2026', release:'March 28, 2026', passers:48392, examinees:64715, passRate:74.8, topCount:12, schoolCount:1842, status:'Released'},
  {slug:'ale-january-2026', type:'ale', month:'January 2026', date:'January 2026', release:'February 28, 2026', passers:2891, examinees:4201, passRate:68.8, topCount:6, schoolCount:198, status:'Released'},
  {slug:'napolcom-january-2026', type:'napolcom', month:'January 2026', date:'January 2026', release:'February 14, 2026', passers:12847, examinees:22105, passRate:58.1, topCount:8, schoolCount:680, status:'Released'},
  {slug:'cse-august-2026', type:'cse', month:'August 2026', date:'August 9, 2026', release:'Expected August 15, 2026', passers:0, examinees:0, passRate:0, topCount:0, schoolCount:0, status:'Upcoming'},
  {slug:'nursing-june-2026', type:'nursing', month:'June 2026', date:'June 7-8, 2026', release:'Expected July 2026', passers:0, examinees:0, passRate:0, topCount:0, schoolCount:0, status:'Upcoming'},
  {slug:'cpa-october-2026', type:'cpa', month:'October 2026', date:'October 4-6, 2026', release:'Expected December 2026', passers:0, examinees:0, passRate:0, topCount:0, schoolCount:0, status:'Upcoming'},
  // 2025 exams
  {slug:'nursing-june-2025', type:'nursing', month:'June 2025', date:'June 2025', release:'July 15, 2025', passers:18204, examinees:25418, passRate:71.6, topCount:8, schoolCount:487, status:'Released'},
  {slug:'cpa-october-2025', type:'cpa', month:'October 2025', date:'October 2025', release:'December 12, 2025', passers:4512, examinees:8912, passRate:50.6, topCount:5, schoolCount:312, status:'Released'},
  {slug:'psychometrician-august-2025', type:'psychometrician', month:'August 2025', date:'August 2025', release:'September 20, 2025', passers:5623, examinees:8912, passRate:63.1, topCount:4, schoolCount:264, status:'Released'},
  {slug:'socialworker-november-2025', type:'socialworker', month:'November 2025', date:'November 2025', release:'December 28, 2025', passers:3218, examinees:5210, passRate:61.8, topCount:3, schoolCount:156, status:'Released'},
  {slug:'let-september-2025', type:'let', month:'September 2025', date:'September 2025', release:'October 12, 2025', passers:45612, examinees:62100, passRate:73.4, topCount:11, schoolCount:1765, status:'Released'},
  {slug:'cse-march-2025', type:'cse', month:'March 2025', date:'March 2025', release:'April 8, 2025', passers:22341, examinees:38420, passRate:58.2, topCount:8, schoolCount:890, status:'Released'},
  {slug:'ale-june-2025', type:'ale', month:'June 2025', date:'June 2025', release:'July 20, 2025', passers:3102, examinees:4650, passRate:66.7, topCount:5, schoolCount:215, status:'Released'},
  {slug:'medtech-may-2025', type:'medtech', month:'May 2025', date:'May 2025', release:'June 18, 2025', passers:4278, examinees:6820, passRate:62.7, topCount:6, schoolCount:312, status:'Released'},
  {slug:'criminologist-september-2025', type:'criminologist', month:'September 2025', date:'September 2025', release:'October 25, 2025', passers:6842, examinees:11250, passRate:60.8, topCount:7, schoolCount:425, status:'Released'},
  // 2024 exams
  {slug:'let-september-2024', type:'let', month:'September 2024', date:'September 2024', release:'October 5, 2024', passers:41238, examinees:57800, passRate:71.3, topCount:10, schoolCount:1712, status:'Released'},
  {slug:'nursing-june-2024', type:'nursing', month:'June 2024', date:'June 2024', release:'July 28, 2024', passers:16847, examinees:24100, passRate:69.9, topCount:7, schoolCount:452, status:'Released'},
  {slug:'cse-march-2024', type:'cse', month:'March 2024', date:'March 2024', release:'April 20, 2024', passers:20184, examinees:35600, passRate:56.7, topCount:6, schoolCount:812, status:'Released'},
  {slug:'cpa-october-2024', type:'cpa', month:'October 2024', date:'October 2024', release:'December 10, 2024', passers:4238, examinees:8450, passRate:50.2, topCount:5, schoolCount:298, status:'Released'},
  {slug:'ale-january-2024', type:'ale', month:'January 2024', date:'January 2024', release:'February 25, 2024', passers:2756, examinees:4100, passRate:67.2, topCount:4, schoolCount:185, status:'Released'},
  {slug:'napolcom-january-2024', type:'napolcom', month:'January 2024', date:'January 2024', release:'February 10, 2024', passers:11560, examinees:20100, passRate:57.5, topCount:6, schoolCount:610, status:'Released'},
  {slug:'psychometrician-august-2024', type:'psychometrician', month:'August 2024', date:'August 2024', release:'September 18, 2024', passers:5210, examinees:8420, passRate:61.9, topCount:4, schoolCount:248, status:'Released'},
  {slug:'socialworker-november-2024', type:'socialworker', month:'November 2024', date:'November 2024', release:'December 22, 2024', passers:2987, examinees:4950, passRate:60.3, topCount:3, schoolCount:142, status:'Released'},
  {slug:'medtech-may-2024', type:'medtech', month:'May 2024', date:'May 2024', release:'June 15, 2024', passers:3982, examinees:6450, passRate:61.7, topCount:5, schoolCount:285, status:'Released'},
  {slug:'criminologist-september-2024', type:'criminologist', month:'September 2024', date:'September 2024', release:'October 28, 2024', passers:6240, examinees:10450, passRate:59.7, topCount:6, schoolCount:398, status:'Released'},
  // 2023 exams
  {slug:'let-march-2023', type:'let', month:'March 2023', date:'March 2023', release:'April 2, 2023', passers:38124, examinees:54200, passRate:70.3, topCount:9, schoolCount:1580, status:'Released'},
  {slug:'nursing-june-2023', type:'nursing', month:'June 2023', date:'June 2023', release:'July 25, 2023', passers:15420, examinees:22450, passRate:68.7, topCount:6, schoolCount:418, status:'Released'},
  {slug:'cse-august-2023', type:'cse', month:'August 2023', date:'August 2023', release:'September 12, 2023', passers:18942, examinees:33400, passRate:56.7, topCount:5, schoolCount:750, status:'Released'},
  {slug:'cpa-october-2023', type:'cpa', month:'October 2023', date:'October 2023', release:'December 8, 2023', passers:4012, examinees:8100, passRate:49.5, topCount:4, schoolCount:275, status:'Released'},
  {slug:'ale-june-2023', type:'ale', month:'June 2023', date:'June 2023', release:'July 22, 2023', passers:2610, examinees:3950, passRate:66.1, topCount:4, schoolCount:172, status:'Released'},
  {slug:'napolcom-january-2023', type:'napolcom', month:'January 2023', date:'January 2023', release:'February 12, 2023', passers:10230, examinees:18400, passRate:55.6, topCount:5, schoolCount:540, status:'Released'},
  {slug:'psychometrician-august-2023', type:'psychometrician', month:'August 2023', date:'August 2023', release:'September 22, 2023', passers:4850, examinees:8010, passRate:60.5, topCount:4, schoolCount:230, status:'Released'},
  {slug:'socialworker-november-2023', type:'socialworker', month:'November 2023', date:'November 2023', release:'December 20, 2023', passers:2760, examinees:4680, passRate:59.0, topCount:3, schoolCount:130, status:'Released'},
  {slug:'electrical-april-2023', type:'electrical', month:'April 2023', date:'April 2023', release:'May 28, 2023', passers:3650, examinees:6210, passRate:58.8, topCount:5, schoolCount:210, status:'Released'},
  {slug:'mechanical-february-2023', type:'mechanical', month:'February 2023', date:'February 2023', release:'March 25, 2023', passers:4210, examinees:7120, passRate:59.1, topCount:6, schoolCount:235, status:'Released'},
  {slug:'civil-may-2023', type:'civil', month:'May 2023', date:'May 2023', release:'June 30, 2023', passers:5210, examinees:8920, passRate:58.4, topCount:7, schoolCount:280, status:'Released'},
  // 2022 exams
  {slug:'let-september-2022', type:'let', month:'September 2022', date:'September 2022', release:'October 10, 2022', passers:36542, examinees:52100, passRate:70.1, topCount:8, schoolCount:1520, status:'Released'},
  {slug:'nursing-june-2022', type:'nursing', month:'June 2022', date:'June 2022', release:'July 20, 2022', passers:14180, examinees:21000, passRate:67.5, topCount:6, schoolCount:385, status:'Released'},
  {slug:'cse-march-2022', type:'cse', month:'March 2022', date:'March 2022', release:'April 15, 2022', passers:17210, examinees:31200, passRate:55.2, topCount:5, schoolCount:690, status:'Released'},
  {slug:'cpa-october-2022', type:'cpa', month:'October 2022', date:'October 2022', release:'December 5, 2022', passers:3810, examinees:7850, passRate:48.5, topCount:4, schoolCount:260, status:'Released'},
  {slug:'ale-january-2022', type:'ale', month:'January 2022', date:'January 2022', release:'February 20, 2022', passers:2450, examinees:3750, passRate:65.3, topCount:4, schoolCount:158, status:'Released'},
  {slug:'napolcom-january-2022', type:'napolcom', month:'January 2022', date:'January 2022', release:'February 8, 2022', passers:9450, examinees:17200, passRate:54.9, topCount:5, schoolCount:490, status:'Released'},
  {slug:'psychometrician-august-2022', type:'psychometrician', month:'August 2022', date:'August 2022', release:'September 15, 2022', passers:4520, examinees:7600, passRate:59.5, topCount:3, schoolCount:210, status:'Released'},
  {slug:'socialworker-november-2022', type:'socialworker', month:'November 2022', date:'November 2022', release:'December 18, 2022', passers:2510, examinees:4320, passRate:58.1, topCount:3, schoolCount:118, status:'Released'},
  {slug:'medtech-may-2022', type:'medtech', month:'May 2022', date:'May 2022', release:'June 12, 2022', passers:3650, examinees:6020, passRate:60.6, topCount:4, schoolCount:250, status:'Released'},
  {slug:'criminologist-september-2022', type:'criminologist', month:'September 2022', date:'September 2022', release:'October 30, 2022', passers:5810, examinees:9800, passRate:59.3, topCount:5, schoolCount:365, status:'Released'},
  {slug:'electrical-october-2022', type:'electrical', month:'October 2022', date:'October 2022', release:'November 30, 2022', passers:3340, examinees:5800, passRate:57.6, topCount:4, schoolCount:195, status:'Released'},
  {slug:'civil-may-2022', type:'civil', month:'May 2022', date:'May 2022', release:'June 28, 2022', passers:4810, examinees:8350, passRate:57.6, topCount:5, schoolCount:255, status:'Released'}
];

// Build full exam data
window.examData = {};
examSchedule.forEach(sch => {
  const type = examTypes[sch.type];
  const pool = type.schoolsIdx.map(i => _schools[i]);
  const topCount = sch.topCount || 5;
  const topNames = genNames(topCount);
  const topSchools = pool.slice(0, topCount);

  const passerCount = Math.min(sch.passers || 100, 50);
  const passers = sch.passers > 0 ? genPassers(passerCount, pool, 92) : [];

  window.examData[sch.slug] = {
    slug: sch.slug,
    title: type.title,
    short: type.short,
    month: sch.month,
    releaseDate: sch.release,
    category: type.category,
    status: sch.status,
    examDate: sch.date,
    passers: sch.passers,
    examinees: sch.examinees,
    topnotchersCount: topCount,
    schoolsCount: sch.schoolCount,
    passRate: sch.passRate > 0 ? sch.passRate.toFixed(1) + '%' : 'Pending',
    passRateValue: sch.passRate,
    summary: sch.passers > 0
      ? sch.passers.toLocaleString() + ' out of ' + sch.examinees.toLocaleString() + ' examinees passed the ' + sch.month + ' ' + type.title + '.'
      : 'Results for the ' + sch.month + ' ' + type.title + ' are pending release.',
    source: type.category === 'Government'
      ? 'https://www.csc.gov.ph'
      : 'https://www.prc.gov.ph/examination-result',
    breadcrumb: type.short + ' ' + sch.month,
    topnotchers: sch.passers > 0 ? genTopnotchers(topNames, topSchools, topCount) : [],
    schools: sch.passers > 0 ? genSchools(pool, sch.passers, sch.passRate) : [],
    passersList: passers,
    oathTaking: sch.status === 'Released'
      ? (sch.month.includes('March') || sch.month.includes('January') ? '1 month after release' : '2-4 weeks after release')
      : 'TBA',
    oathTakingVenues: type.category === 'Government' ? 'CSC/NAPOLCOM regional offices' : 'PRC regional offices',
    faqs: []
  };

  // Add FAQs
  const faqs = [
    { q: 'How do I verify my rating?', a: 'Visit the PRC LERIS portal at prc.gov.ph/leris. Log in with your account and navigate to "Verification of Rating."' },
    { q: 'What is the passing rate for this exam?', a: 'The passing rate is ' + (sch.passRate > 0 ? sch.passRate.toFixed(1) + '%.' : 'not yet available. Check back after the results are released.') },
    { q: 'When is the oath-taking?', a: window.examData[sch.slug].oathTaking },
    { q: 'Can I retake the exam if I failed?', a: 'Yes. You may reapply for the next scheduled exam. Check the exam schedule page for upcoming dates.' }
  ];
  window.examData[sch.slug].faqs = faqs;
});
