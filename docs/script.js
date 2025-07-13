
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

    const kasanData = [
        {
            id: 'base_day_service_normal',
            name: '通所介護基本料（通常規模型）',
            description: '通常規模型事業所における基本的な介護サービスに対する報酬です。',
            conditions: {
                facilityType: ['day-service'],
                scale: '通常規模型',
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "557単位/回",
        },
        {
            id: 'base_day_service_large1',
            name: '通所介護基本料（大規模型I）',
            description: '大規模型I事業所における基本的な介護サービスに対する報酬です。',
            conditions: {
                facilityType: ['day-service'],
                scale: '大規模型I',
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "545単位/回",
        },
        {
            id: 'base_day_service_large2',
            name: '通所介護基本料（大規模型II）',
            description: '大規模型II事業所における基本的な介護サービスに対する報酬です。',
            conditions: {
                facilityType: ['day-service'],
                scale: '大規模型II',
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "534単位/回",
        },
        {
            id: 'base_home_rehab',
            name: '訪問リハビリテーション基本料',
            description: '理学療法士、作業療法士、言語聴覚士が居宅を訪問してリハビリテーションを提供した場合の基本報酬です。',
            conditions: {
                facilityType: ['home-rehab'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "307単位/回（20分ごと）",
        },
        {
            id: 'gensan_large_scale',
            name: '【減算】事業所規模による減算',
            description: '事業所規模が通常規模型でないため、一部の加算が減算対象となる場合があります。',
            isGensan: true,
            conditions: {
                facilityType: ['day-service'],
                scale: ['大規模型I', '大規模型II'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
            unitCount: "一部の加算が減算対象",
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
        },
    ];

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        displayResults();
    });

    searchForm.addEventListener('reset', () => {
        resultsList.innerHTML = '<p class="no-results">条件を選択して検索してください。</p>';
        facilityScaleDisplay.textContent = '';
    });

    function displayResults() {
        resultsList.innerHTML = '';

        const userInputs = {
            selectedFacilityType: facilityTypeSelect.value,
            selectedFeatures: Array.from(featureCheckboxes).filter(c => c.checked).map(c => c.value),
            selectedStaffingSystem: staffingSystemSelect.value,
            selectedCareLevel: careLevelSelect.value,
            userCount: parseInt(userCountInput.value, 10),
            selectedLocation: locationSelect.value,
        };
        userInputs.facilityScale = getFacilityScale(userInputs.userCount);

        const matchingKasans = kasanData.filter(kasan => checkAllConditions(kasan, userInputs));

        if (matchingKasans.length > 0) {
            matchingKasans.forEach(kasan => {
                const kasanDiv = document.createElement('div');
                kasanDiv.classList.add('result-item');
                if (kasan.isGensan) {
                    kasanDiv.classList.add('gensan-item');
                }
                kasanDiv.innerHTML = `
                    <h3>${kasan.name}</h3>
                    <p>単位数: ${kasan.unitCount || '不明'}</p>
                    <p>${kasan.description}</p>
                `;
                resultsList.appendChild(kasanDiv);
            });
        } else {
            resultsList.innerHTML = '<p class="no-results">該当する加算は見つかりませんでした。</p>';
        }
    }

    function checkAllConditions(kasan, userInputs) {
        const { conditions } = kasan;
        const { selectedFacilityType, facilityScale, userCount, selectedFeatures, selectedStaffingSystem, selectedCareLevel, selectedLocation } = userInputs;

        if (conditions.facilityType && conditions.facilityType.length > 0 && !conditions.facilityType.includes(selectedFacilityType)) {
            return false;
        }

        if (kasan.id.startsWith('base_day_service')) {
            return !isNaN(userCount) && userCount > 0 && conditions.scale === facilityScale;
        } else if (kasan.id.startsWith('base_home_rehab')) {
            return selectedFacilityType === 'home-rehab';
        }

        if (kasan.isGensan) {
            return Array.isArray(conditions.scale) && conditions.scale.includes(facilityScale);
        }

        if (conditions.features && conditions.features.length > 0) {
            if (!conditions.features.every(f => selectedFeatures.includes(f))) return false;
        }

        if (conditions.staffingSystem && conditions.staffingSystem.length > 0 && !conditions.staffingSystem.includes(selectedStaffingSystem)) {
            return false;
        }

        if (conditions.careLevel && conditions.careLevel.length > 0 && !conditions.careLevel.includes(selectedCareLevel)) {
            return false;
        }

        if (conditions.userCount && (isNaN(userCount) || userCount < conditions.userCount)) {
            return false;
        }

        if (conditions.location && conditions.location.length > 0 && !conditions.location.includes(selectedLocation)) {
            return false;
        }

        return !kasan.id.startsWith('base_');
    }

    function getFacilityScale(userCount) {
        if (isNaN(userCount) || userCount <= 0) return null;
        if (userCount <= 750) return '通常規模型';
        if (userCount <= 900) return '大規模型I';
        return '大規模型II';
    }

    function updateUserScaleDisplay() {
        const userCount = parseInt(userCountInput.value, 10);
        const scale = getFacilityScale(userCount);
        facilityScaleDisplay.textContent = scale ? `事業所規模: ${scale}` : '';
    }
});
