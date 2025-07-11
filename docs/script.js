
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const facilityTypeSelect = document.getElementById('facility-type');
    const featureCheckboxes = document.querySelectorAll('input[name="features"]');
    const staffingSystemSelect = document.getElementById('staffing-system');
    const careLevelSelect = document.getElementById('care-level');
    const userCountInput = document.getElementById('user-count');
    const locationSelect = document.getElementById('location');
    const resultsList = document.getElementById('results-list');
    const facilityScaleDisplay = document.getElementById('facility-scale-display');

    userCountInput.addEventListener('input', updateUserScaleDisplay);

    // 加算データ（簡略化された例）
    const kasanData = [
        {
            id: 'base_day_service_normal',
            name: '通所介護基本料（通常規模型）',
            description: '通常規模型事業所における基本的な介護サービスに対する報酬です。',
            conditions: {
                facilityType: ['day-service'],
                scale: '通常規模型',
            },
            unitCount: "557単位/回", // 例：要介護3、7-8時間の場合
        },
        {
            id: 'base_day_service_large1',
            name: '通所介護基本料（大規模型I）',
            description: '大規模型I事業所における基本的な介護サービスに対する報酬です。',
            conditions: {
                facilityType: ['day-service'],
                scale: '大規模型I',
            },
            unitCount: "545単位/回", // 例：要介護3、7-8時間の場合
        },
        {
            id: 'base_day_service_large2',
            name: '通所介護基本料（大規模型II）',
            description: '大規模型II事業所における基本的な介護サービスに対する報酬です。',
            conditions: {
                facilityType: ['day-service'],
                scale: '大規模型II',
            },
            unitCount: "534単位/回", // 例：要介護3、7-8時間の場合
        },
        {
            id: 'base_home_rehab',
            name: '訪問リハビリテーション基本料',
            description: '理学療法士、作業療法士、言語聴覚士が居宅を訪問してリハビリテーションを提供した場合の基本報酬です。',
            conditions: {
                facilityType: ['home-rehab'],
            },
            unitCount: "307単位/回（20分ごと）",
        },
        {
            id: 'kasan1',
            name: '個別機能訓練加算(I)',
            description: '機能訓練指導員を配置し、個別機能訓練計画に基づき訓練を行った場合に算定。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata', 'day-service', 'short-stay'],
                features: ['rehab_equipment'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "225単位/日",
            details: [
                '個別機能訓練計画の作成と実施',
                '機能訓練指導員（理学療法士、作業療法士、言語聴覚士、看護職員、柔道整復師、あん摩マッサージ指圧師）の配置',
                '利用者ごとの目標設定と評価',
            ],
        },
        {
            id: 'kasan2',
            name: '認知症専門ケア加算(I)',
            description: '認知症ケアに関する専門的な研修を修了した職員が、認知症高齢者に対して専門的なケアを行った場合に算定。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata', 'group-home'],
                features: ['dementia_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "3単位/日",
            details: [
                '認知症介護実践リーダー研修修了者を1名以上配置',
                '認知症ケアに関する専門的なチームによるケア',
                '認知症行動・心理症状（BPSD）への対応',
            ],
        },
        {
            id: 'kasan3',
            name: '夜間看護体制加算',
            description: '夜間における看護職員の配置を手厚くした場合に算定。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata'],
                features: ['night_shift', 'nurse_stationed'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "10単位/日",
            details: [
                '夜間（22時～翌6時）に看護職員を1名以上配置',
                '緊急時の対応体制の整備',
                '利用者への巡回、体位変換、排泄介助など',
            ],
        },
        {
            id: 'kasan4',
            name: '介護福祉士配置等加算(I)',
            description: '介護福祉士の配置割合が一定以上の場合に算定。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata', 'day-service', 'home-visit', 'short-stay', 'group-home'],
                features: [],
                staffingSystem: ['care_worker_70'],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "39単位/日",
        },
        {
            id: 'kasan5',
            name: '医療連携強化加算',
            description: '地域の医療機関との連携を強化し、利用者の急変時等に対応できる体制を整備している場合に算定。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata', 'short-stay'],
                features: ['medical_cooperation'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "50単位/日",
        },
        {
            id: 'kasan6',
            name: '口腔衛生管理体制加算',
            description: '歯科医師または歯科衛生士との連携により、口腔衛生管理体制を整備している場合に算定。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata', 'day-service', 'short-stay'],
                features: ['oral_hygiene'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "30単位/月",
        },
        {
            id: 'kasan7',
            name: '栄養マネジメント加算',
            description: '管理栄養士を配置し、入所者ごとの栄養ケア計画を作成・実施している場合に算定。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata', 'short-stay'],
                features: ['nutrition_management'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "14単位/日",
        },
        {
            id: 'kasan8',
            name: '看取り介護加算',
            description: '人生の最終段階にある利用者に対し、看取り介護計画に基づき、看取りを行った場合に算定。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata', 'group-home', 'short-stay'],
                features: ['mitori_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "1440単位/回",
        },
        {
            id: 'kasan9',
            name: 'ICT活用加算',
            description: '介護記録や情報共有にICTを積極的に活用し、業務効率化を図っている場合に算定。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata', 'day-service', 'home-visit', 'short-stay', 'group-home', 'syotaki', 'home-rehab'],
                features: ['ict_utilization'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "10単位/月",
        },
        {
            id: 'kasan10',
            name: '24時間対応体制加算',
            description: '利用者からの緊急連絡に24時間対応し、必要に応じて訪問できる体制を整備している場合に算定。',
            conditions: {
                facilityType: ['home-visit', 'home-nursing', 'syotaki'],
                features: ['24h_support'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "300単位/月",
        },
        {
            id: 'kasan11',
            name: '重症者等対応加算',
            description: '医療依存度の高い利用者（人工呼吸器装着者、気管切開者等）を受け入れている場合に算定。',
            conditions: {
                facilityType: ['home-nursing', 'iryouin', 'ryoyogata'],
                features: ['severe_case_support'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "200単位/日",
        },
        {
            id: 'kasan12',
            name: '精神科訪問看護基本加算',
            description: '精神疾患を持つ利用者に対し、専門的な知識を持つ看護師が訪問看護を提供した場合に算定。',
            conditions: {
                facilityType: ['home-nursing'],
                features: ['mental_health_support'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "500単位/回",
        },
        {
            id: 'kasan13',
            name: '地域加算',
            description: '地域区分に応じて、基本サービス費に一定割合を乗じて算定。',
            conditions: {
                facilityType: [],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: ['level_1', 'level_2', 'level_3', 'level_4', 'level_5', 'level_6', 'level_7', 'other'],
            },
            unitCount: "地域区分による",
        },
        {
            id: 'kasan14',
            name: 'サービス提供体制強化加算(I)',
            description: '介護福祉士の配置割合が一定以上の場合に算定（介護福祉士50%以上）。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata', 'day-service', 'home-visit', 'short-stay', 'group-home', 'syotaki', 'home-rehab'],
                features: [],
                staffingSystem: ['care_worker_50'],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "18単位/日",
        },
        {
            id: 'kasan15',
            name: 'サービス提供体制強化加算(II)',
            description: '勤続年数の長い介護福祉士の配置割合が一定以上の場合に算定（勤続7年以上の介護福祉士が25%以上）。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata', 'day-service', 'home-visit', 'short-stay', 'group-home', 'syotaki', 'home-rehab'],
                features: [],
                staffingSystem: ['long_term_75'],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "12単位/日",
        },
        {
            id: 'kasan16',
            name: '個別入浴加算',
            description: '利用者個別の入浴設備と体制を整備している場合に算定。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata', 'day-service', 'short-stay'],
                features: ['individual_bath'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "50単位/回",
        },
        {
            id: 'kasan17',
            name: '看護職員体制強化加算',
            description: '看護職員の配置を手厚くし、質の高い看護を提供できる体制を整備している場合に算定。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata'],
                features: [],
                staffingSystem: ['nurse_enhanced'],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "10単位/日",
            details: [
                '常勤看護職員の配置基準の強化',
                '認定看護師または専門看護師の配置',
                '医療処置が必要な利用者への対応強化',
            ],
        },
    ];

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        displayResults();
    });

    searchForm.addEventListener('reset', () => {
        resultsList.innerHTML = '<p class="no-results">条件を選択して検索してください。</p>';
    });

    function displayResults() {
        resultsList.innerHTML = ''; // Clear previous results
        const selectedFacilityType = facilityTypeSelect.value;
        const selectedFeatures = Array.from(featureCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        const selectedStaffingSystem = staffingSystemSelect.value;
        const selectedCareLevel = careLevelSelect.value;
        const userCount = parseInt(userCountInput.value, 10);
        const selectedLocation = locationSelect.value;

        // 利用者数が入力されている場合のみ、事業所規模を計算
        const facilityScale = !isNaN(userCount) && userCount > 0 ? getFacilityScale(userCount) : null;

        const matchingKasans = kasanData.filter(kasan => {
            const conditions = kasan.conditions;

            // --- フィルタリングロジック ---

            // 1. 施設種別が一致しないものは除外 (必須条件)
            if (conditions.facilityType.length > 0 && !conditions.facilityType.includes(selectedFacilityType)) {
                return false;
            }

            // 2. 事業所規模のチェック (通所介護の場合のみ適用)
            if (selectedFacilityType === 'day-service') {
                // 規模の条件を持つ加算（基本料など）の場合、計算された規模と一致しなければ除外
                if (conditions.scale && conditions.scale !== facilityScale) {
                    return false;
                }
            } else {
                // 通所介護以外が選択されている場合、通所介護の基本料はすべて除外
                if (kasan.id.startsWith('base_day_service')) {
                    return false;
                }
            }
            
            // 訪問リハビリが選択されている場合、訪問リハビリ以外の基本料は除外
            if (selectedFacilityType === 'home-rehab') {
                if (kasan.id.startsWith('base_') && !kasan.id.startsWith('base_home_rehab')) {
                    return false;
                }
            }


            // 3. 施設の特徴が一致しないものは除外
            if (conditions.features.length > 0) {
                for (const feature of conditions.features) {
                    if (!selectedFeatures.includes(feature)) {
                        return false;
                    }
                }
            }

            // 4. 職員配置体制が一致しないものは除外
            if (conditions.staffingSystem.length > 0 && !conditions.staffingSystem.includes(selectedStaffingSystem)) {
                return false;
            }

            // 5. 要介護度が一致しないものは除外
            if (conditions.careLevel.length > 0 && !conditions.careLevel.includes(selectedCareLevel)) {
                return false;
            }

            // 6. 利用者数の下限チェック
            if (conditions.userCount !== null && conditions.userCount !== undefined) {
                if (isNaN(userCount) || userCount < conditions.userCount) {
                    return false;
                }
            }

            // 7. 所在地のチェック
            if (conditions.location.length > 0 && !conditions.location.includes(selectedLocation)) {
                return false;
            }

            // すべてのチェックを通過したものを返す
            return true;
        });

        if (matchingKasans.length > 0) {
            matchingKasans.forEach(kasan => {
                const kasanDiv = document.createElement('div');
                kasanDiv.classList.add('result-item');
                kasanDiv.innerHTML = `
                    <h3>${kasan.name}</h3>
                    <p>単位数: ${kasan.unitCount || '不明'}</p>
                    <p>${kasan.description}</p>
                `;
                if (kasan.details) {
                    kasanDiv.innerHTML += `
                        <h4>詳細:</h4>
                        <ul>
                            ${kasan.details.map(detail => `<li>${detail}</li>`).join('')}
                        </ul>
                    `;
                }
                resultsList.appendChild(kasanDiv);
            });
        } else {
            resultsList.innerHTML = '<p class="no-results">該当する加算は見つかりませんでした。</p>';
        }
    }

    function getFacilityScale(userCount) {
        if (userCount <= 750) {
            return '通常規模型';
        } else if (userCount <= 900) {
            return '大規模型I';
        } else {
            return '大規模型II';
        }
    }

    function updateUserScaleDisplay() {
        const userCount = parseInt(userCountInput.value, 10);
        if (isNaN(userCount) || userCount <= 0) {
            facilityScaleDisplay.textContent = '';
            return;
        }

        const scale = getFacilityScale(userCount);
        facilityScaleDisplay.textContent = `事業所規模: ${scale}`;
    }
});
