export type Modality = {
  name: string;
  slug: string;
  key: string;
  description: string;
  avgCostLow: number;
  avgCostHigh: number;
  duration: string;
  benefits: string[];
  idealFor: string;
  affiliateProduct: {
    name: string;
    url: string;
    description: string;
  };
};

export const modalities: Modality[] = [
  {
    name: "Swedish Massage",
    slug: "swedish-massage-near-me",
    key: "swedish",
    description:
      "The classic relaxation massage using long, flowing strokes, kneading, and circular movements on the superficial layers of muscle. Swedish massage promotes full-body relaxation, improves circulation, and reduces stress hormones. It is the most popular massage modality in the US and an excellent choice for first-time clients.",
    avgCostLow: 80,
    avgCostHigh: 150,
    duration: "60-90 minutes",
    benefits: [
      "Full-body relaxation",
      "Improved blood circulation",
      "Reduced stress and anxiety",
      "Better sleep quality",
      "Lowered cortisol levels",
    ],
    idealFor: "First-time massage clients, stress relief, general wellness maintenance",
    affiliateProduct: {
      name: "Bon Vital Massage Oil Kit",
      url: "https://www.amazon.com/dp/YOURCODE",
      description: "Professional-grade massage oils used by licensed therapists",
    },
  },
  {
    name: "Deep Tissue Massage",
    slug: "deep-tissue-massage-near-me",
    key: "deep_tissue",
    description:
      "A therapeutic massage technique that targets the deeper layers of muscle and connective tissue. Deep tissue massage uses slow, deliberate strokes and firm pressure to break up adhesions, relieve chronic muscle tension, and address knots. Particularly effective for chronic pain, injury recovery, and postural problems.",
    avgCostLow: 100,
    avgCostHigh: 180,
    duration: "60-90 minutes",
    benefits: [
      "Relief from chronic pain",
      "Breaks up scar tissue",
      "Reduces muscle tension and knots",
      "Improves range of motion",
      "Lowers blood pressure",
    ],
    idealFor: "Chronic pain sufferers, athletes, desk workers with postural issues",
    affiliateProduct: {
      name: "Theragun PRO Plus",
      url: "https://www.therabody.com/?ref=YOURCODE",
      description: "Professional percussion therapy device for between-session relief",
    },
  },
  {
    name: "Sports Massage",
    slug: "sports-massage-near-me",
    key: "sports",
    description:
      "A specialized massage modality designed for athletes and active individuals. Sports massage combines techniques from Swedish and deep tissue massage with stretching and joint mobilization to enhance athletic performance, prevent injuries, and speed recovery. Can be performed pre-event, post-event, or as maintenance between training sessions.",
    avgCostLow: 100,
    avgCostHigh: 200,
    duration: "60-90 minutes",
    benefits: [
      "Faster muscle recovery",
      "Improved flexibility and range of motion",
      "Reduced risk of injury",
      "Enhanced athletic performance",
      "Decreased muscle soreness",
    ],
    idealFor: "Athletes, runners, gym enthusiasts, anyone with an active lifestyle",
    affiliateProduct: {
      name: "Hyperice Normatec 3 Legs",
      url: "https://www.hyperice.com/?ref=YOURCODE",
      description: "Dynamic air compression recovery system for legs",
    },
  },
  {
    name: "Prenatal Massage",
    slug: "prenatal-massage-near-me",
    key: "prenatal",
    description:
      "A gentle, nurturing massage specifically adapted for the physical and emotional needs of pregnant women. Prenatal massage uses modified techniques and positioning (usually side-lying with bolster support) to safely address the unique discomforts of pregnancy including back pain, swollen ankles, sciatica, and hormonal stress.",
    avgCostLow: 90,
    avgCostHigh: 170,
    duration: "60-75 minutes",
    benefits: [
      "Reduced back and joint pain",
      "Decreased swelling in hands and feet",
      "Improved sleep quality",
      "Reduced anxiety and stress hormones",
      "Relief from sciatica and leg cramps",
    ],
    idealFor: "Pregnant women in their second and third trimesters",
    affiliateProduct: {
      name: "Boppy Side Sleeper Pregnancy Pillow",
      url: "https://www.amazon.com/dp/YOURCODE",
      description: "Comfortable pregnancy support pillow for better sleep",
    },
  },
  {
    name: "Hot Stone Massage",
    slug: "hot-stone-massage-near-me",
    key: "hot_stone",
    description:
      "A luxurious massage modality that incorporates smooth, heated basalt stones placed on key points of the body and used as massage tools. The deep, penetrating heat from the stones melts away muscle tension, increases circulation, and creates a profoundly relaxing experience. Hot stone massage is often combined with Swedish massage techniques.",
    avgCostLow: 110,
    avgCostHigh: 200,
    duration: "75-90 minutes",
    benefits: [
      "Deep muscle relaxation",
      "Improved circulation",
      "Reduced chronic pain",
      "Mental calm and stress relief",
      "Eased muscle stiffness",
    ],
    idealFor: "Anyone seeking deep relaxation, people with chronic muscle tension or fibromyalgia",
    affiliateProduct: {
      name: "Royal Massage Hot Stone Set",
      url: "https://www.amazon.com/dp/YOURCODE",
      description: "Professional basalt hot stone set with heater",
    },
  },
  {
    name: "Couples Massage",
    slug: "couples-massage-near-me",
    key: "couples",
    description:
      "A shared massage experience where two people receive simultaneous massages in the same room from two licensed therapists. Couples massage is popular for date nights, anniversaries, and bonding experiences. Each person can choose their own modality and pressure preference. Mobile couples massage brings this spa-quality experience directly to your home.",
    avgCostLow: 200,
    avgCostHigh: 400,
    duration: "60-90 minutes",
    benefits: [
      "Shared relaxation experience",
      "Strengthened emotional connection",
      "Reduced stress for both partners",
      "Convenient at-home spa experience",
      "Customizable for each person",
    ],
    idealFor: "Couples, friends, parent-child bonding, anniversary celebrations",
    affiliateProduct: {
      name: "Aromatherapy Candle Gift Set",
      url: "https://www.amazon.com/dp/YOURCODE",
      description: "Luxury soy candle set for creating a spa atmosphere at home",
    },
  },
  {
    name: "Lymphatic Drainage Massage",
    slug: "lymphatic-drainage-massage-near-me",
    key: "lymphatic",
    description:
      "A gentle, rhythmic massage technique designed to stimulate the lymphatic system and encourage the natural drainage of lymph fluid. Lymphatic drainage massage uses very light pressure and specific circular movements to reduce swelling, support immune function, and promote detoxification. Often recommended post-surgery or for conditions involving fluid retention.",
    avgCostLow: 100,
    avgCostHigh: 190,
    duration: "60-90 minutes",
    benefits: [
      "Reduced swelling and fluid retention",
      "Enhanced immune system function",
      "Post-surgical recovery support",
      "Detoxification and waste removal",
      "Reduced inflammation",
    ],
    idealFor: "Post-surgical patients, those with lymphedema, chronic swelling, or autoimmune conditions",
    affiliateProduct: {
      name: "Dry Brush Body Set",
      url: "https://www.amazon.com/dp/YOURCODE",
      description: "Natural bristle dry brush set for lymphatic stimulation between sessions",
    },
  },
  {
    name: "Trigger Point Therapy",
    slug: "trigger-point-therapy-near-me",
    key: "trigger_point",
    description:
      "A targeted massage technique that focuses on identifying and releasing trigger points — tight knots within muscle fibers that cause referred pain in other parts of the body. The therapist applies sustained pressure to these specific points, often followed by stretching and movement. Trigger point therapy is highly effective for chronic headaches, neck and shoulder pain, and myofascial pain syndrome.",
    avgCostLow: 100,
    avgCostHigh: 180,
    duration: "60-90 minutes",
    benefits: [
      "Targeted pain relief",
      "Reduced headache frequency",
      "Improved posture",
      "Release of chronic muscle knots",
      "Increased range of motion",
    ],
    idealFor: "People with chronic headaches, myofascial pain, neck and shoulder tension",
    affiliateProduct: {
      name: "Lacrosse Ball Massage Set",
      url: "https://www.amazon.com/dp/YOURCODE",
      description: "Self-massage trigger point release balls for home use",
    },
  },
];
