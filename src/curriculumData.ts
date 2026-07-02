export interface CurriculumOutcome {
  topic: string;
  term: "Term 1" | "Term 2" | "Term 3";
  objectives: string[];
  suggestedMaterials: string[];
  classroomActivities: string[];
}

export interface SubjectCurriculum {
  subject: string;
  gradeLabel: string;
  nerdcCode: string;
  outcomes: CurriculumOutcome[];
}

export const NERDC_CURRICULUM: SubjectCurriculum[] = [
  {
    subject: "Basic Science",
    gradeLabel: "JSS 1",
    nerdcCode: "NERDC-JSS1-SCI-01",
    outcomes: [
      {
        topic: "Living and Non-Living Things",
        term: "Term 1",
        objectives: [
          "State the characteristics of living things (MR NIGER D)",
          "Differentiate between plants and animals",
          "Identify non-living things in the local school environment"
        ],
        suggestedMaterials: [
          "School farm/garden plants",
          "Captured local insects in transparent jars",
          "Low-cost magnifying glasses made from water bottle domes"
        ],
        classroomActivities: [
          "Go on a 10-minute 'Nature Walk' around the school compound to find 5 living and 5 non-living things",
          "Explain the acronym 'MR NIGER D' (Movement, Respiration, Nutrition, Irritability, Growth, Excretion, Reproduction, Death)"
        ]
      },
      {
        topic: "Environmental Pollution",
        term: "Term 1",
        objectives: [
          "Define environmental pollution",
          "Identify major types of pollution (Air, Water, Land)",
          "List causes of soil erosion in Nigerian communities"
        ],
        suggestedMaterials: [
          "Muddy water samples",
          "Discarded plastic containers/nylon bags",
          "Pictures of erosion sites"
        ],
        classroomActivities: [
          "Demonstrate soil erosion by pouring water on sloped soil beds with and without grass cover",
          "Organize a class discussion on the local refuse management system in the community marketplace"
        ]
      },
      {
        topic: "Force and Energy",
        term: "Term 2",
        objectives: [
          "Define force and list its effects on objects",
          "Differentiate between contact and non-contact forces",
          "Identify local sources of energy"
        ],
        suggestedMaterials: [
          "Nylon rubber bands",
          "Rulers, stones, local timber blocks",
          "Magnetic speakers retrieved from old radios"
        ],
        classroomActivities: [
          "Demonstrate gravity by dropping dry leaves vs stones",
          "Stretching rubber bands to observe potential vs kinetic tension"
        ]
      }
    ]
  },
  {
    subject: "Mathematics",
    gradeLabel: "Primary 5",
    nerdcCode: "NERDC-P5-MTH-03",
    outcomes: [
      {
        topic: "Fractions (Addition and Subtraction)",
        term: "Term 1",
        objectives: [
          "Add and subtract fractions with like denominators",
          "Find Lowest Common Multiple (LCM) of simple whole numbers",
          "Apply fractions to sharing money (Naira) and food items"
        ],
        suggestedMaterials: [
          "Cardboard cutouts representing circular pizzas or loaves of agege bread",
          "Naira notes play money",
          "Beans or gravel stones for grouping"
        ],
        classroomActivities: [
          "Act out sharing a loaf of bread among 4 children",
          "Draw grid boxes on the blackboard to visually represent equivalent fractions"
        ]
      },
      {
        topic: "Quantitative Reasoning & Place Value",
        term: "Term 1",
        objectives: [
          "State the place values of digits up to 1,000,000",
          "Convert words to numbers and vice-versa",
          "Develop speed in simple arithmetic tricks"
        ],
        suggestedMaterials: [
          "Improvised abacus made with local broomsticks and bottle caps (cork)",
          "Decimal place value charts on cardboard"
        ],
        classroomActivities: [
          "Construct numbers using bottle caps on broomsticks to show Tens, Hundreds, and Thousands",
          "Spelling large numbers in local currency sums"
        ]
      }
    ]
  },
  {
    subject: "Agricultural Science",
    gradeLabel: "JSS 2",
    nerdcCode: "NERDC-JSS2-AGR-05",
    outcomes: [
      {
        topic: "Farm Tools (Characteristics and Uses)",
        term: "Term 1",
        objectives: [
          "Identify primary hand-held farming tools (Cutlass, Hoe, Spade, Hand-fork)",
          "Explain the maintenance of farm tools in sub-Saharan climates",
          "State safety rules for handling metal farming equipment"
        ],
        suggestedMaterials: [
          "Actual sample cutlass, hand trowel, and hoe from school farm",
          "Engine oil and rag for maintenance demos"
        ],
        classroomActivities: [
          "Demonstrate how to scrape rust and apply protective oil film to metal cutlasses",
          "Sketch primary farm tools with labels showing blades, shanks, and wooden handles"
        ]
      },
      {
        topic: "Crop Classification",
        term: "Term 2",
        objectives: [
          "Classify crops based on their uses (Cereals, Legumes, Roots, Tubers, Fibers)",
          "Identify crop life cycles (Annual, Biennial, Perennial)",
          "Explain the nutritional value of cassava, yam, and maize"
        ],
        suggestedMaterials: [
          "Real farm specimens: cassava tuber, yam pieces, dry maize cob, groundnuts",
          "Chart showing the parts of a flowering legume plant"
        ],
        classroomActivities: [
          "Group-sorting activity: classify mixed bag of seeds/tubers into appropriate categories",
          "Discuss local food processing forms, e.g., how cassava is processed into Garri, Fufu, and Starch"
        ]
      }
    ]
  },
  {
    subject: "English Language",
    gradeLabel: "SSS 2",
    nerdcCode: "NERDC-SSS2-ENG-08",
    outcomes: [
      {
        topic: "Parts of Speech (Active and Passive Voice)",
        term: "Term 1",
        objectives: [
          "Differentiate between active and passive sentences",
          "Identify agents in passive sentences",
          "Rewrite passages into formal passive text suitable for official report writing"
        ],
        suggestedMaterials: [
          "Laminated sentence cards with active/passive pairs",
          "Nigerian newspaper headlines"
        ],
        classroomActivities: [
          "Review classroom verbs: 'Chinedu kicked the ball' (Active) vs 'The ball was kicked by Chinedu' (Passive)",
          "Group rewriting of simple daily gossip stories into official police/news style reports using passive constructions"
        ]
      },
      {
        topic: "Comprehension & Vocabulary Acquisition",
        term: "Term 1",
        objectives: [
          "Scanning and skimming texts for main ideas",
          "Deducing meanings of words from sentence contexts",
          "Summarizing two-page essays into exact bullet points"
        ],
        suggestedMaterials: [
          "Extracts or photocopies of classic West African Literature (e.g. Chinua Achebe, Wole Soyinka, Flora Nwapa, Buchi Emecheta)",
          "Pocket dictionaries"
        ],
        classroomActivities: [
          "Speed reading competition: find 5 specific facts in a text within 2 minutes",
          "Guess-the-word context game: guessing blanked words based on adjacent verbs and prepositions"
        ]
      }
    ]
  },
  {
    subject: "Civic Education",
    gradeLabel: "Primary 6",
    nerdcCode: "NERDC-P6-CIV-02",
    outcomes: [
      {
        topic: "National Symbols and Unity",
        term: "Term 1",
        objectives: [
          "Identify Nigerian national symbols (National Flag, Coat of Arms, National Anthem, Pledge, Naira)",
          "Describe the history and meaning of the colors of the flag",
          "Recite the National Pledge and list values of unity"
        ],
        suggestedMaterials: [
          "Miniature Nigerian flag or color sketch",
          "A crisp Naira note showing the coat of arms",
          "Cardboard sketch of the Nigerian Coat of Arms"
        ],
        classroomActivities: [
          "Sing the national anthem together and dissect the words: 'Arise, O Compatriots, Nigeria's call obey...'",
          "Draw and color the flag. Explain why green represents agriculture and white represents peace."
        ]
      }
    ]
  }
];

export interface SavedLessonPlan {
  id: string;
  createdAt: string;
  grade: string;
  subject: string;
  topic: string;
  duration: string;
  materialsOption: string;
  contentMarkdown: string;
}

export interface SavedQuiz {
  id: string;
  createdAt: string;
  grade: string;
  subject: string;
  topic: string;
  questionCount: number;
  difficulty: string;
  style: string;
  data: {
    instructions: string;
    questions: Array<{
      number: number;
      questionText: string;
      options?: string[];
      correctOption?: string;
      sampleAnswer: string;
      learningOutcomeMatched?: string;
    }>;
    markingScheme: string;
  };
}
