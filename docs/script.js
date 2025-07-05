
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const facilityTypeSelect = document.getElementById('facility-type');
    const featureCheckboxes = document.querySelectorAll('input[name="features"]');
    const staffingSystemSelect = document.getElementById('staffing-system');
    const careLevelSelect = document.getElementById('care-level');
    const userCountInput = document.getElementById('user-count');
    const locationSelect = document.getElementById('location');
    const resultsList = document.getElementById('results-list');

    // 加算データ（簡略化された例）
    const kasanData = [
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
        },
        {
            id: 'kasan9',
            name: 'ICT活用加算',
            description: '介護記録や情報共有にICTを積極的に活用し、業務効率化を図っている場合に算定。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata', 'day-service', 'home-visit', 'short-stay', 'group-home', 'syotaki'],
                features: ['ict_utilization'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
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
        },
        {
            id: 'kasan14',
            name: 'サービス提供体制強化加算(I)',
            description: '介護福祉士の配置割合が一定以上の場合に算定（介護福祉士50%以上）。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata', 'day-service', 'home-visit', 'short-stay', 'group-home', 'syotaki'],
                features: [],
                staffingSystem: ['care_worker_50'],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'kasan15',
            name: 'サービス提供体制強化加算(II)',
            description: '勤続年数の長い介護福祉士の配置割合が一定以上の場合に算定（勤続7年以上の介護福祉士が25%以上）。',
            conditions: {
                facilityType: ['tokuyo', 'rouken', 'iryouin', 'ryoyogata', 'day-service', 'home-visit', 'short-stay', 'group-home', 'syotaki'],
                features: [],
                staffingSystem: ['long_term_75'],
                careLevel: [],
                userCount: null,
                location: [],
            },
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

        const matchingKasans = kasanData.filter(kasan => {
            const conditions = kasan.conditions;

            // 施設種別
            if (conditions.facilityType.length > 0 && !conditions.facilityType.includes(selectedFacilityType)) {
                return false;
            }

            // 施設の特徴
            if (conditions.features.length > 0) {
                for (const feature of conditions.features) {
                    if (!selectedFeatures.includes(feature)) {
                        return false;
                    }
                }
            }

            // 職員配置体制
            if (conditions.staffingSystem.length > 0 && !conditions.staffingSystem.includes(selectedStaffingSystem)) {
                return false;
            }

            // 要介護度 (ここでは単純に選択されていればOKとする)
            if (conditions.careLevel.length > 0 && !conditions.careLevel.includes(selectedCareLevel)) {
                return false;
            }

            // 利用者数 (ここでは単純に値が入力されていればOKとする)
            if (conditions.userCount !== null && (isNaN(userCount) || userCount <= 0)) {
                return false;
            }

            // 施設の所在地
            if (conditions.location.length > 0 && !conditions.location.includes(selectedLocation)) {
                return false;
            }

            return true;
        });

        if (matchingKasans.length > 0) {
            matchingKasans.forEach(kasan => {
                const kasanDiv = document.createElement('div');
                kasanDiv.classList.add('result-item');
                kasanDiv.innerHTML = `
                    <h3>${kasan.name}</h3>
                    <p>${kasan.description}</p>
                `;
                resultsList.appendChild(kasanDiv);
            });
        } else {
            resultsList.innerHTML = '<p class="no-results">該当する加算は見つかりませんでした。</p>';
        }
    }
});
