const questions = {
  Q1: {
    text: "Q1. 七対子（ﾁｰﾄｲﾂ）ですか？",
    choices: [
      { label: "はい", next: "RESULT", points: 25 },
      { label: "いいえ", next: "Q2" }
    ],
	image:"/mahjangScoreCalc/images/chitoitsu.png",
  },
  Q2: {
    text: "Q2. 平和（ﾋﾟﾝﾌ）ですか？",
    choices: [
      { label: "はい", next: "Q2_1" },
      { label: "いいえ", next: "Q3", points:20 }
    ],
	image:"/mahjangScoreCalc/images/pinfu.png",
  },
  Q2_1: {
    text: "Q2-1. アガリ方はなんですか？",
    choices: [
      { label: "ツモ", next: "RESULT", points: 20 },
      { label: "ロン", next: "RESULT", points: 30 }
    ]
  },
  Q3: {
    text: "Q3. 雀頭が役牌ですか？",
    choices: [
      { label: "はい", next: "Q4", points: 2 },
      { label: "いいえ", next: "Q4" }
    ],
	image:"/mahjangScoreCalc/images/yakuhai.jpg",
  },
  Q4: {
    text: "Q4. 待ちの形はﾘｬﾝﾒﾝ・ｼｬﾝﾎﾟﾝですか？",
    choices: [
      { label: "はい", next: "Q5"},
      { label: "いいえ", next: "Q5", points: 2 },
    ],
	image:"/mahjangScoreCalc/images/machi.png", // 画像URL（`public/images` に配置）
  },
  Q5: {
    text: "Q5. アガリ方はどちらですか？",
    choices: [
      { label: "ツモ", next: "Q6", points: 2 },
      { label: "ロン", next: "Q5_1" }
    ]
  },
  Q5_1: {
    text: "Q5-1. 鳴きましたか？(暗槓は除く）",
    choices: [
      { label: "はい", next: "Q6"},
      { label: "いいえ（門前）", next: "Q6", points: 10  }
    ],
	image:"/mahjangScoreCalc/images/ponChiKan.png", 
  },
    Q6: {
    text: "Q6. 面子は順子（ｼｭﾝﾂ）「のみ」ですか？",
    choices: [
        { label: "はい", next: "Q6_1" },
        { label: "いいえ", next: "Q7_1_1" } // 
    ],
	image:"/mahjangScoreCalc/images/kotsuSyuntsu.jpg", 
    },
    Q6_1: {
    text: "Q6_1. チーしましたか？",
    choices: [
        { label: "はい", next: "RESULT", points: 30, override: true }, // 例外的な処理フラグ
        { label: "いいえ", next: "RESULT", points: 0 }
    ],
	image:"/mahjangScoreCalc/images/ponChiKan.png", 
    },
	// 刻子1組目
	Q7_1_1: {
	  text: "Q7-1-1. 刻子（1組目）はポンしましたか？",
	  choices: [
	    { label: "はい", next: "Q7_1_2", isPon: true },
	    { label: "いいえ", next: "Q7_1_2", isPon: false },
	    { label: "刻子は1組もない", next: "Q8_1_1" }
	  ],
	  image:"/mahjangScoreCalc/images/kotsuSyuntsu.jpg", 
	},
	Q7_1_2: {
	  text: "Q7-1-2. 刻子（1組目）の牌は？",
	  choices: [
	    { label: "2〜8の数牌", pointsByPon: { true: 2, false: 4 }, next: "Q7_2_1" },
	    { label: "1, 9, 字牌", pointsByPon: { true: 4, false: 8 }, next: "Q7_2_1" }
	  ]
	},
	
	// 刻子2組目
	Q7_2_1: {
	  text: "Q7-2-1. 刻子（2組目）はポンしましたか？",
	  choices: [
	    { label: "はい", next: "Q7_2_2", isPon: true },
	    { label: "いいえ", next: "Q7_2_2", isPon: false },
	    { label: "刻子はこれ以上ない", next: "Q8_1_1" }
	  ],
	  image:"/mahjangScoreCalc/images/kotsuSyuntsu.jpg", 
	},
	Q7_2_2: {
	  text: "Q7-2-2. 刻子（2組目）の牌は？",
	  choices: [
	    { label: "2〜8の数牌", pointsByPon: { true: 2, false: 4 }, next: "Q7_3_1" },
	    { label: "1, 9, 字牌", pointsByPon: { true: 4, false: 8 }, next: "Q7_3_1" }
	  ]
	},
	
	// 刻子3組目
	Q7_3_1: {
	  text: "Q7-3-1. 刻子（3組目）はポンしましたか？",
	  choices: [
	    { label: "はい", next: "Q7_3_2", isPon: true },
	    { label: "いいえ", next: "Q7_3_2", isPon: false },
	    { label: "刻子はこれ以上ない", next: "Q8_1_1" }
	  ],
	  image:"/mahjangScoreCalc/images/kotsuSyuntsu.jpg", 
	},
	Q7_3_2: {
	  text: "Q7-3-2. 刻子（3組目）の牌は？",
	  choices: [
	    { label: "2〜8の数牌", pointsByPon: { true: 2, false: 4 }, next: "Q7_4_1" },
	    { label: "1, 9, 字牌", pointsByPon: { true: 4, false: 8 }, next: "Q7_4_1" }
	  ]
	},
	
	// 刻子4組目
	Q7_4_1: {
	  text: "Q7-4-1. 刻子（4組目）はポンしましたか？",
	  choices: [
	    { label: "はい", next: "Q7_4_2", isPon: true },
	    { label: "いいえ", next: "Q7_4_2", isPon: false },
	    { label: "刻子はこれ以上ない", next: "Q8_1_1" }
	  ],
	  image:"/mahjangScoreCalc/images/kotsuSyuntsu.jpg", 
	},
	Q7_4_2: {
	  text: "Q7-4-2. 刻子（4組目）の牌は？",
	  choices: [
	    { label: "2〜8の数牌", pointsByPon: { true: 2, false: 4 }, next: "RESULT" },
	    { label: "1, 9, 字牌", pointsByPon: { true: 4, false: 8 }, next: "RESULT" }
	  ]
	},
	// 槓子1組目
	Q8_1_1: {
	  text: "Q8-1-1. 槓子（1組目）は暗槓ですか？",
	  choices: [
	    { label: "はい（暗槓）", next: "Q8_1_2", isAnkan: true },
	    { label: "いいえ（明槓）", next: "Q8_1_2", isAnkan: false },
	    { label: "槓子は1組もない", next: "RESULT" }
	  ],
	  image:"/mahjangScoreCalc/images/kantsu.png", 
	},
	Q8_1_2: {
	  text: "Q8-1-2. 槓子（1組目）の牌は？",
	  choices: [
	    { label: "2〜8の数牌", pointsByAnkan: { true: 16, false: 8 }, next: "Q8_2_1" },
	    { label: "1, 9, 字牌", pointsByAnkan: { true: 32, false: 16 }, next: "Q8_2_1" }
	  ]
	},
	
	// 槓子2組目
	Q8_2_1: {
	  text: "Q8-2-1. 槓子（2組目）は暗槓ですか？",
	  choices: [
	    { label: "はい（暗槓）", next: "Q8_2_2", isAnkan: true },
	    { label: "いいえ（明槓）", next: "Q8_2_2", isAnkan: false },
	    { label: "槓子はこれ以上ない", next: "RESULT" }
	  ],
	  image:"/mahjangScoreCalc/images/kantsu.png", 
	},
	Q8_2_2: {
	  text: "Q8-2-2. 槓子（2組目）の牌は？",
	  choices: [
	    { label: "2〜8の数牌", pointsByAnkan: { true: 16, false: 8 }, next: "Q8_3_1" },
	    { label: "1, 9, 字牌", pointsByAnkan: { true: 32, false: 16 }, next: "Q8_3_1" }
	  ]
	},
	
	// 槓子3組目
	Q8_3_1: {
	  text: "Q8-3-1. 槓子（3組目）は暗槓ですか？",
	  choices: [
	    { label: "はい（暗槓）", next: "Q8_3_2", isAnkan: true },
	    { label: "いいえ（明槓）", next: "Q8_3_2", isAnkan: false },
	    { label: "槓子はこれ以上ない", next: "RESULT" }
	  ],
	  image:"/mahjangScoreCalc/images/kantsu.png", 
	},
	Q8_3_2: {
	  text: "Q8-3-2. 槓子（3組目）の牌は？",
	  choices: [
	    { label: "2〜8の数牌", pointsByAnkan: { true: 16, false: 8 }, next: "Q8_4_1" },
	    { label: "1, 9, 字牌", pointsByAnkan: { true: 32, false: 16 }, next: "Q8_4_1" }
	  ]
	},
	
	// 槓子4組目
	Q8_4_1: {
	  text: "Q8-4-1. 槓子（4組目）は暗槓ですか？",
	  choices: [
	    { label: "はい（暗槓）", next: "Q8_4_2", isAnkan: true },
	    { label: "いいえ（明槓）", next: "Q8_4_2", isAnkan: false },
	    { label: "槓子はこれ以上ない", next: "RESULT" }
	  ],
	  image:"/mahjangScoreCalc/images/kantsu.png", 
	},
	Q8_4_2: {
	  text: "Q8-4-2. 槓子（4組目）の牌は？",
	  choices: [
	    { label: "2〜8の数牌", pointsByAnkan: { true: 16, false: 8 }, next: "RESULT" },
	    { label: "1, 9, 字牌", pointsByAnkan: { true: 32, false: 16 }, next: "RESULT" }
	  ]
	}

};

export default questions;