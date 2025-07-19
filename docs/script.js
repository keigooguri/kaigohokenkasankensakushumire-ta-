
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
        },
        // 特別養護老人ホーム（介護老人福祉施設）
        {
            id: 'tokuyo_shoki_kasan',
            name: '初期加算',
            description: '入所後30日以内に限り算定。',
            conditions: {
                facilityType: ['tokuyo'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_nichijo_keizoku_shien_kasan',
            name: '日常生活継続支援加算（Ⅰ・Ⅱ）',
            description: '入所者の日常生活継続支援を評価する加算。',
            conditions: {
                facilityType: ['tokuyo'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_jun_unit_care_kasan',
            name: '準ユニットケア加算',
            description: 'ユニット型施設に準じたケアを提供している場合に算定。',
            conditions: {
                facilityType: ['tokuyo'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_jakunen_ninchisho_ukeire_kasan',
            name: '若年性認知症入所者受入加算',
            description: '若年性認知症の入所者を受け入れている場合に算定。',
            conditions: {
                facilityType: ['tokuyo'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_shogaisha_seikatsu_shien_taisei_kasan',
            name: '障害者生活支援体制加算（Ⅰ・Ⅱ）',
            description: '障害者に対する生活支援体制を評価する加算。',
            conditions: {
                facilityType: ['tokuyo'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_mitori_kaigo_kasan',
            name: '看取り介護加算（Ⅰ・Ⅱ）',
            description: '人生の最終段階にある利用者に対し、看取り介護計画に基づき、看取りを行った場合に算定。',
            conditions: {
                facilityType: ['tokuyo'],
                features: ['mitori_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_yakkin_shokuin_haichi_kasan',
            name: '夜勤職員配置加算／夜間看護体制加算',
            description: '夜間における職員配置を手厚くした場合に算定。',
            conditions: {
                facilityType: ['tokuyo'],
                features: ['night_shift'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_zaikaku_fukki_shien_kasan',
            name: '在宅復帰・在宅療養支援機能加算（Ⅰ～Ⅲ）',
            description: '在宅復帰・在宅療養を支援する体制を評価する加算。',
            conditions: {
                facilityType: ['tokuyo'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_kyoryoku_iryo_kikan_renkei_kasan',
            name: '協力医療機関連携加算',
            description: '地域の協力医療機関との連携を評価する加算。',
            conditions: {
                facilityType: ['tokuyo'],
                features: ['medical_cooperation'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_tokubetsu_tsuin_soe_kasan',
            name: '特別通院送迎加算',
            description: '特別な通院送迎を行った場合に算定。',
            conditions: {
                facilityType: ['tokuyo'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_taisho_ji_joho_teikyo_kasan',
            name: '退所時情報提供・退所前後訪問指導加算',
            description: '退所時の情報提供や訪問指導を評価する加算。',
            conditions: {
                facilityType: ['tokuyo'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_eiyo_koku_kanri_kasan',
            name: '栄養マネジメント強化加算・口腔衛生管理加算（Ⅰ・Ⅱ）',
            description: '栄養マネジメントと口腔衛生管理を強化している場合に算定。',
            conditions: {
                facilityType: ['tokuyo'],
                features: ['nutrition_management', 'oral_hygiene'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_ninchisho_team_care_kasan',
            name: '認知症チームケア加算',
            description: '認知症ケアに関する専門チームによるケアを評価する加算。',
            conditions: {
                facilityType: ['tokuyo'],
                features: ['dementia_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_shinko_kansensho_shisetsu_ryoyo_hi',
            name: '新興感染症等施設療養費',
            description: '新興感染症発生時の施設療養を評価する加算。',
            conditions: {
                facilityType: ['tokuyo'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_kagakuteki_kaigo_suishin_kasan',
            name: '科学的介護推進体制加算／生産性向上推進体制加算',
            description: '科学的介護や生産性向上を推進する体制を評価する加算。',
            conditions: {
                facilityType: ['tokuyo'],
                features: ['ict_utilization'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_service_teikyo_taisei_kyoka_kasan',
            name: 'サービス提供体制強化加算',
            description: 'サービス提供体制を強化している場合に算定。',
            conditions: {
                facilityType: ['tokuyo'],
                features: [],
                staffingSystem: ['care_worker_50', 'care_worker_70', 'long_term_75'],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'tokuyo_kaigo_shokuin_shogu_kaizen_kasan',
            name: '介護職員等処遇改善加算',
            description: '介護職員の処遇改善を評価する加算。',
            conditions: {
                facilityType: ['tokuyo'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },

        // 介護老人保健施設（老健）
        {
            id: 'rouken_jiritsu_shien_sokushin_kasan',
            name: '自立支援促進加算',
            description: '利用者の自立支援を促進する取り組みを評価する加算。',
            conditions: {
                facilityType: ['rouken'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'rouken_zaikaku_fukki_shien_kasan',
            name: '在宅復帰・在宅療養支援機能加算（Ⅰ～Ⅵ）',
            description: '在宅復帰・在宅療養を支援する体制を評価する加算。',
            conditions: {
                facilityType: ['rouken'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'rouken_rehab_management_kasan',
            name: 'リハビリテーションマネジメント加算（A・B）',
            description: 'リハビリテーションのマネジメントを評価する加算。',
            conditions: {
                facilityType: ['rouken'],
                features: ['rehab_equipment'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'rouken_tanki_shuchu_rehab_kasan',
            name: '短期集中リハビリテーション実施加算',
            description: '短期集中的なリハビリテーションを実施した場合に算定。',
            conditions: {
                facilityType: ['rouken'],
                features: ['rehab_equipment'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'rouken_ninchisho_tanki_shuchu_rehab_kasan',
            name: '認知症短期集中リハビリテーション実施加算（Ⅰ・Ⅱ）',
            description: '認知症の利用者に対し、短期集中的なリハビリテーションを実施した場合に算定。',
            conditions: {
                facilityType: ['rouken'],
                features: ['rehab_equipment', 'dementia_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'rouken_kakaritsukei_renkei_yakuzaichosei_kasan',
            name: 'かかりつけ医連携薬剤調整加算',
            description: 'かかりつけ医との連携による薬剤調整を評価する加算。',
            conditions: {
                facilityType: ['rouken'],
                features: ['medical_cooperation'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'rouken_eiyo_koku_kanri_kasan',
            name: '栄養マネジメント加算／口腔衛生管理加算',
            description: '栄養マネジメントと口腔衛生管理を評価する加算。',
            conditions: {
                facilityType: ['rouken'],
                features: ['nutrition_management', 'oral_hygiene'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'rouken_haisetsu_jokusou_management_kasan',
            name: '排せつ支援・褥瘡マネジメント加算',
            description: '排せつ支援と褥瘡マネジメントを評価する加算。',
            conditions: {
                facilityType: ['rouken'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'rouken_kyoryoku_iryo_kikan_renkei_kasan',
            name: '協力医療機関連携加算',
            description: '地域の協力医療機関との連携を評価する加算。',
            conditions: {
                facilityType: ['rouken'],
                features: ['medical_cooperation'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'rouken_mitori_kaigo_kasan',
            name: '看取り介護加算',
            description: '人生の最終段階にある利用者に対し、看取り介護計画に基づき、看取りを行った場合に算定。',
            conditions: {
                facilityType: ['rouken'],
                features: ['mitori_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'rouken_taisho_ji_joho_teikyo_kasan',
            name: '退所時情報提供・退所前後訪問加算',
            description: '退所時の情報提供や訪問を評価する加算。',
            conditions: {
                facilityType: ['rouken'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'rouken_kagakuteki_kaigo_suishin_kasan',
            name: '科学的介護推進体制・生産性向上推進体制加算',
            description: '科学的介護や生産性向上を推進する体制を評価する加算。',
            conditions: {
                facilityType: ['rouken'],
                features: ['ict_utilization'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'rouken_service_teikyo_taisei_kyoka_kasan',
            name: 'サービス提供体制強化加算',
            description: 'サービス提供体制を強化している場合に算定。',
            conditions: {
                facilityType: ['rouken'],
                features: [],
                staffingSystem: ['care_worker_50', 'care_worker_70', 'long_term_75'],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'rouken_kaigo_shokuin_shogu_kaizen_kasan',
            name: '介護職員等処遇改善加算',
            description: '介護職員の処遇改善を評価する加算。',
            conditions: {
                facilityType: ['rouken'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },

        // 介護医療院
        {
            id: 'iryouin_shoki_kasan',
            name: '初期加算',
            description: '入所後30日以内に限り算定。',
            conditions: {
                facilityType: ['iryouin'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'iryouin_service_taisei_kyoka_kasan',
            name: 'サービス体制強化加算（Ⅰ）',
            description: 'サービス提供体制を強化している場合に算定。',
            conditions: {
                facilityType: ['iryouin'],
                features: [],
                staffingSystem: ['care_worker_50', 'care_worker_70', 'long_term_75'],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'iryouin_yakan_kinmu_kango_haichi_kasan',
            name: '夜間勤務等看護配置加算',
            description: '夜間における看護職員の配置を手厚くした場合に算定。',
            conditions: {
                facilityType: ['iryouin'],
                features: ['night_shift', 'nurse_stationed'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'iryouin_kyoryoku_iryo_kikan_renkei_kasan',
            name: '協力医療機関連携加算',
            description: '地域の協力医療機関との連携を評価する加算。',
            conditions: {
                facilityType: ['iryouin'],
                features: ['medical_cooperation'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'iryouin_taisho_ji_joho_teikyo_kasan',
            name: '退所時情報提供加算／退所時栄養情報連携加算',
            description: '退所時の情報提供や栄養情報連携を評価する加算。',
            conditions: {
                facilityType: ['iryouin'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'iryouin_jiritsu_shien_sokushin_kasan',
            name: '自立支援促進加算',
            description: '利用者の自立支援を促進する取り組みを評価する加算。',
            conditions: {
                facilityType: ['iryouin'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'iryouin_ninchisho_team_care_suishin_kasan',
            name: '認知症チームケア推進加算',
            description: '認知症ケアに関する専門チームによるケアを評価する加算。',
            conditions: {
                facilityType: ['iryouin'],
                features: ['dementia_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'iryouin_ryoyoshoku_keiko_iko_iji_kasan',
            name: '療養食・経口移行・経口維持加算（Ⅰ・Ⅱ）',
            description: '療養食の提供や経口移行・維持を評価する加算。',
            conditions: {
                facilityType: ['iryouin'],
                features: ['nutrition_management'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'iryouin_eiyo_koku_kanri_kasan',
            name: '栄養マネジメント強化加算・口腔衛生管理加算（Ⅱ）',
            description: '栄養マネジメントと口腔衛生管理を強化している場合に算定。',
            conditions: {
                facilityType: ['iryouin'],
                features: ['nutrition_management', 'oral_hygiene'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'iryouin_gaihaku_hiyo_taka_jushin_hiyo_anzen_taisei_kasan',
            name: '外泊時費用・他科受診時費用・安全対策体制加算',
            description: '外泊時や他科受診時の費用、安全対策体制を評価する加算。',
            conditions: {
                facilityType: ['iryouin'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'iryouin_shinko_kansensho_shisetsu_ryoyo_hi',
            name: '新興感染症等施設療養費',
            description: '新興感染症発生時の施設療養を評価する加算。',
            conditions: {
                facilityType: ['iryouin'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'iryouin_koreisha_shisetsu_kansentaisaku_kojo_kasan',
            name: '高齢者施設等感染対策向上加算',
            description: '高齢者施設等における感染対策の向上を評価する加算。',
            conditions: {
                facilityType: ['iryouin'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'iryouin_kagakuteki_kaigo_suishin_kasan',
            name: '科学的介護推進体制／生産性向上推進体制加算',
            description: '科学的介護や生産性向上を推進する体制を評価する加算。',
            conditions: {
                facilityType: ['iryouin'],
                features: ['ict_utilization'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'iryouin_kaigo_shokuin_shogu_kaizen_kasan',
            name: '介護職員等処遇改善加算',
            description: '介護職員の処遇改善を評価する加算。',
            conditions: {
                facilityType: ['iryouin'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },

        // 介護医療型医療施設（介護療養型医療施設・経過措置分）
        {
            id: 'ryoyogata_ryoyo_kino_kyoka_kasan',
            name: '療養機能強化型加算（Ⅰ・Ⅱ）',
            description: '療養機能の強化を評価する加算。',
            conditions: {
                facilityType: ['ryoyogata'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'ryoyogata_judo_ryoyo_kanri_kasan',
            name: '重度療養管理加算',
            description: '重度の利用者に対する療養管理を評価する加算。',
            conditions: {
                facilityType: ['ryoyogata'],
                features: ['severe_case_support'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        // 長期療養生活移行加算は2024年度改定で廃止
        {
            id: 'ryoyogata_yakan_kango_haichi_kasan',
            name: '夜間看護配置加算',
            description: '夜間における看護職員の配置を評価する加算。',
            conditions: {
                facilityType: ['ryoyogata'],
                features: ['night_shift', 'nurse_stationed'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'ryoyogata_service_taisei_kyoka_anzen_taisei_kasan',
            name: 'サービス体制強化加算・安全対策体制加算',
            description: 'サービス提供体制と安全対策体制を強化している場合に算定。',
            conditions: {
                facilityType: ['ryoyogata'],
                features: [],
                staffingSystem: ['care_worker_50', 'care_worker_70', 'long_term_75'],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'ryoyogata_eiyo_koku_keiko_iji_kasan',
            name: '栄養マネジメント・口腔衛生管理・経口維持加算',
            description: '栄養マネジメント、口腔衛生管理、経口維持を評価する加算。',
            conditions: {
                facilityType: ['ryoyogata'],
                features: ['nutrition_management', 'oral_hygiene'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'ryoyogata_ryoyoshoku_kasan',
            name: '療養食加算',
            description: '療養食の提供を評価する加算。',
            conditions: {
                facilityType: ['ryoyogata'],
                features: ['nutrition_management'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'ryoyogata_kagakuteki_kaigo_suishin_kasan',
            name: '科学的介護推進体制／生産性向上推進体制加算',
            description: '科学的介護や生産性向上を推進する体制を評価する加算。',
            conditions: {
                facilityType: ['ryoyogata'],
                features: ['ict_utilization'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'ryoyogata_kaigo_shokuin_shogu_kaizen_kasan',
            name: '介護職員等処遇改善加算',
            description: '介護職員の処遇改善を評価する加算。',
            conditions: {
                facilityType: ['ryoyogata'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },

        // 通所介護（デイサービス）
        {
            id: 'day_service_kobetsu_kino_kunren_kasan_1_i',
            name: '個別機能訓練加算(Ⅰ)イ',
            description: '機能訓練指導員を配置し、個別機能訓練計画に基づき訓練を行った場合に算定。',
            conditions: {
                facilityType: ['day-service'],
                features: ['rehab_equipment'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'day_service_kobetsu_kino_kunren_kasan_1_ro',
            name: '個別機能訓練加算(Ⅰ)ロ',
            description: '機能訓練指導員を配置し、個別機能訓練計画に基づき訓練を行った場合に算定。',
            conditions: {
                facilityType: ['day-service'],
                features: ['rehab_equipment'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'day_service_kobetsu_kino_kunren_kasan_2',
            name: '個別機能訓練加算(Ⅱ)',
            description: '機能訓練指導員を配置し、個別機能訓練計画に基づき訓練を行った場合に算定。',
            conditions: {
                facilityType: ['day-service'],
                features: ['rehab_equipment'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'day_service_nyuyoku_kaijo_kasan',
            name: '入浴介助加算（Ⅰ・Ⅱ）',
            description: '入浴介助を評価する加算。',
            conditions: {
                facilityType: ['day-service'],
                features: ['individual_bath'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'day_service_encho_kasan',
            name: '延長加算',
            description: 'サービス提供時間を延長した場合に算定。',
            conditions: {
                facilityType: ['day-service'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'day_service_chujudo_care_taisei_kasan',
            name: '中重度者ケア体制加算',
            description: '中重度の利用者に対するケア体制を評価する加算。',
            conditions: {
                facilityType: ['day-service'],
                features: [],
                staffingSystem: [],
                careLevel: ['care_level_3', 'care_level_4', 'care_level_5'],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'day_service_seikatsu_sodanin_haichi_kasan',
            name: '生活相談員配置等加算',
            description: '生活相談員の配置を評価する加算。',
            conditions: {
                facilityType: ['day-service'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'day_service_ninchisho_kasan_jakunen_ukeire_kasan',
            name: '認知症加算・若年性認知症受入加算',
            description: '認知症の利用者や若年性認知症の利用者を受け入れている場合に算定。',
            conditions: {
                facilityType: ['day-service'],
                features: ['dementia_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'day_service_seikatsu_kino_kojo_renkei_kasan',
            name: '生活機能向上連携加算（Ⅰ・Ⅱ）',
            description: '生活機能向上に向けた連携を評価する加算。',
            conditions: {
                facilityType: ['day-service'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'day_service_adl_iji_kasan',
            name: 'ADL維持等加算（Ⅰ・Ⅱ）',
            description: 'ADL（日常生活動作）の維持・向上を評価する加算。',
            conditions: {
                facilityType: ['day-service'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'day_service_eiyo_assessment_kasan',
            name: '栄養アセスメント加算／栄養改善加算',
            description: '栄養アセスメントや栄養改善を評価する加算。',
            conditions: {
                facilityType: ['day-service'],
                features: ['nutrition_management'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'day_service_koku_eiyo_screening_kasan',
            name: '口腔・栄養スクリーニング加算／口腔機能向上加算',
            description: '口腔・栄養スクリーニングや口腔機能向上を評価する加算。',
            conditions: {
                facilityType: ['day-service'],
                features: ['oral_hygiene', 'nutrition_management'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'day_service_kansensho_saigai_riyo_gen_kasan',
            name: '感染症・災害時利用減対応３％加算',
            description: '感染症や災害時の利用者減に対応する加算。',
            conditions: {
                facilityType: ['day-service'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'day_service_kagakuteki_kaigo_suishin_kasan',
            name: '科学的介護推進体制・生産性向上推進体制加算',
            description: '科学的介護や生産性向上を推進する体制を評価する加算。',
            conditions: {
                facilityType: ['day-service'],
                features: ['ict_utilization'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'day_service_service_teikyo_taisei_kyoka_kasan',
            name: 'サービス提供体制強化加算',
            description: 'サービス提供体制を強化している場合に算定。',
            conditions: {
                facilityType: ['day-service'],
                features: [],
                staffingSystem: ['care_worker_50', 'care_worker_70', 'long_term_75'],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'day_service_nakasangan_tokubetsu_chiiki_kasan',
            name: '中山間地域等小規模事業所加算・特別地域加算',
            description: '中山間地域等に所在する小規模事業所や特別地域を評価する加算。',
            conditions: {
                facilityType: ['day-service'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: ['level_7'], // 例として7級地を設定。必要に応じて調整。
            },
        },
        {
            id: 'day_service_kaigo_shokuin_shogu_kaizen_kasan',
            name: '介護職員等処遇改善加算',
            description: '介護職員の処遇改善を評価する加算。',
            conditions: {
                facilityType: ['day-service'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },

        // 訪問介護
        {
            id: 'home_visit_shokai_kasan',
            name: '初回加算',
            description: '初回訪問時に算定。',
            conditions: {
                facilityType: ['home-visit'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_visit_futari_homon_kasan',
            name: '２人の訪問介護員等による場合の加算',
            description: '２人の訪問介護員等で訪問した場合に算定。',
            conditions: {
                facilityType: ['home-visit'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_visit_kinkyu_homon_kasan',
            name: '緊急時訪問介護加算',
            description: '緊急時訪問を行った場合に算定。',
            conditions: {
                facilityType: ['home-visit'],
                features: ['24h_support'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_visit_seikatsu_kino_kojo_renkei_kasan',
            name: '生活機能向上連携加算',
            description: '生活機能向上に向けた連携を評価する加算。',
            conditions: {
                facilityType: ['home-visit'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_visit_koku_renkei_kyoka_kasan',
            name: '口腔連携強化加算',
            description: '口腔管理に係る連携を強化する加算。',
            conditions: {
                facilityType: ['home-visit'],
                features: ['oral_hygiene'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_visit_socho_yakan_shinya_kasan',
            name: '早朝・夜間・深夜加算',
            description: '早朝・夜間・深夜にサービス提供した場合に算定。',
            conditions: {
                facilityType: ['home-visit'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_visit_tokutei_jigyosho_kasan',
            name: '特定事業所加算（Ⅰ～Ⅲ）',
            description: '特定の要件を満たす事業所を評価する加算。',
            conditions: {
                facilityType: ['home-visit'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_visit_ninchisho_senmon_care_kasan',
            name: '認知症専門ケア加算',
            description: '認知症の利用者に対し、専門的なケアを行った場合に算定。',
            conditions: {
                facilityType: ['home-visit'],
                features: ['dementia_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_visit_nakasangan_tokubetsu_chiiki_homon_kasan',
            name: '中山間地域等小規模事業所加算／中山間地域居住者提供加算',
            description: '中山間地域等に所在する小規模事業所や中山間地域居住者へのサービス提供を評価する加算。',
            conditions: {
                facilityType: ['home-visit'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: ['level_7'], // 例として7級地を設定。必要に応じて調整。
            },
        },
        {
            id: 'home_visit_tokubetsu_chiiki_homon_kasan',
            name: '特別地域訪問介護加算',
            description: '特別地域での訪問介護を評価する加算。',
            conditions: {
                facilityType: ['home-visit'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: ['level_7'], // 例として7級地を設定。必要に応じて調整。
            },
        },
        {
            id: 'home_visit_service_teikyo_taisei_kyoka_kasan',
            name: 'サービス提供体制強化加算',
            description: 'サービス提供体制を強化している場合に算定。',
            conditions: {
                facilityType: ['home-visit'],
                features: [],
                staffingSystem: ['care_worker_50', 'care_worker_70', 'long_term_75'],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_visit_seisansei_kojo_shogu_kaizen_kasan',
            name: '生産性向上推進体制・介護職員等処遇改善加算',
            description: '生産性向上と介護職員の処遇改善を評価する加算。',
            conditions: {
                facilityType: ['home-visit'],
                features: ['ict_utilization'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },

        // 訪問看護（介護保険分）
        {
            id: 'home_nursing_kinkyu_homon_kango_kasan',
            name: '緊急訪問看護加算（Ⅰ・Ⅱ）',
            description: '緊急訪問看護を行った場合に算定。',
            conditions: {
                facilityType: ['home-nursing'],
                features: ['24h_support'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_nursing_yakan_socho_homon_kango_kasan',
            name: '夜間・早朝訪問看護加算',
            description: '夜間・早朝に訪問看護を行った場合に算定。',
            conditions: {
                facilityType: ['home-nursing'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_nursing_shinya_homon_kango_kasan',
            name: '深夜訪問看護加算',
            description: '深夜に訪問看護を行った場合に算定。',
            conditions: {
                facilityType: ['home-nursing'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_nursing_chojikan_homon_kango_kasan',
            name: '長時間訪問看護加算',
            description: '長時間訪問看護を行った場合に算定。',
            conditions: {
                facilityType: ['home-nursing'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_nursing_fukusumei_homon_kango_kasan',
            name: '複数名訪問看護加算',
            description: '複数名で訪問看護を行った場合に算定。',
            conditions: {
                facilityType: ['home-nursing'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_nursing_tokubetsu_chiiki_homon_kango_kasan',
            name: '特別地域訪問看護加算',
            description: '特別地域での訪問看護を評価する加算。',
            conditions: {
                facilityType: ['home-nursing'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: ['level_7'], // 例として7級地を設定。必要に応じて調整。
            },
        },
        {
            id: 'home_nursing_nanbyo_fukusukai_homon_kasan',
            name: '難病等複数回訪問加算',
            description: '難病等の利用者に対し、複数回訪問を行った場合に算定。',
            conditions: {
                facilityType: ['home-nursing'],
                features: ['severe_case_support'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_nursing_nyuyoji_kasan',
            name: '乳幼児加算',
            description: '乳幼児に対する訪問看護を評価する加算。',
            conditions: {
                facilityType: ['home-nursing'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_nursing_tokubetsu_kanri_kasan',
            name: '特別管理加算（Ⅰ・Ⅱ）',
            description: '特別な管理を要する利用者に対する訪問看護を評価する加算。',
            conditions: {
                facilityType: ['home-nursing'],
                features: ['severe_case_support'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_nursing_terminal_care_kasan',
            name: 'ターミナルケア加算',
            description: 'ターミナル期の利用者に対する訪問看護を評価する加算。',
            conditions: {
                facilityType: ['home-nursing'],
                features: ['mitori_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_nursing_service_teikyo_taisei_kyoka_kasan',
            name: 'サービス提供体制強化加算（医療機関系の場合）',
            description: '医療機関系の訪問看護ステーションにおけるサービス提供体制を強化している場合に算定。',
            conditions: {
                facilityType: ['home-nursing'],
                features: [],
                staffingSystem: ['nurse_enhanced'],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_nursing_senmon_kanri_kasan',
            name: '専門管理加算',
            description: '医療ニーズの高い利用者に対し、専門性の高い看護師が計画的な管理を行うことを評価する加算。',
            conditions: {
                facilityType: ['home-nursing'],
                features: ['nurse_stationed'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },

        // 短期入所生活介護（ショートステイ）
        {
            id: 'short_stay_shoki_kasan',
            name: '初期加算',
            description: '入所後30日以内に限り算定。',
            conditions: {
                facilityType: ['short-stay'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'short_stay_iryo_renkei_taisei_kasan',
            name: '医療連携体制加算',
            description: '医療機関との連携体制を評価する加算。',
            conditions: {
                facilityType: ['short-stay'],
                features: ['medical_cooperation'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'short_stay_mitori_renkei_taisei_kasan',
            name: '看取り連携体制加算',
            description: '看取りに関する連携体制を評価する加算。',
            conditions: {
                facilityType: ['short-stay'],
                features: ['mitori_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'short_stay_koku_renkei_kyoka_kasan',
            name: '口腔連携強化加算',
            description: '口腔管理に係る連携を強化する加算。',
            conditions: {
                facilityType: ['short-stay'],
                features: ['oral_hygiene'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'short_stay_nyuyoku_kaijo_kasan',
            name: '入浴介助加算',
            description: '入浴介助を評価する加算。',
            conditions: {
                facilityType: ['short-stay'],
                features: ['individual_bath'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'short_stay_kobetsu_kino_kunren_kasan',
            name: '個別機能訓練加算',
            description: '個別機能訓練を行った場合に算定。',
            conditions: {
                facilityType: ['short-stay'],
                features: ['rehab_equipment'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'short_stay_jakunen_ninchisho_ukeire_kasan',
            name: '若年性認知症受入加算',
            description: '若年性認知症の利用者を受け入れている場合に算定。',
            conditions: {
                facilityType: ['short-stay'],
                features: ['dementia_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'short_stay_service_teikyo_taisei_kyoka_kasan',
            name: 'サービス提供体制強化加算',
            description: 'サービス提供体制を強化している場合に算定。',
            conditions: {
                facilityType: ['short-stay'],
                features: [],
                staffingSystem: ['care_worker_50', 'care_worker_70', 'long_term_75'],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'short_stay_kagakuteki_kaigo_suishin_kasan',
            name: '科学的介護推進体制・生産性向上推進体制加算',
            description: '科学的介護や生産性向上を推進する体制を評価する加算。',
            conditions: {
                facilityType: ['short-stay'],
                features: ['ict_utilization'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'short_stay_kaigo_shokuin_shogu_kaizen_kasan',
            name: '介護職員等処遇改善加算',
            description: '介護職員の処遇改善を評価する加算。',
            conditions: {
                facilityType: ['short-stay'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },

        // 認知症対応型共同生活介護（グループホーム）
        {
            id: 'group_home_shoki_kasan',
            name: '初期加算',
            description: '入居後30日以内に限り算定。',
            conditions: {
                facilityType: ['group-home'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'group_home_mitori_kaigo_kasan',
            name: '看取り介護加算',
            description: '人生の最終段階にある利用者に対し、看取り介護計画に基づき、看取りを行った場合に算定。',
            conditions: {
                facilityType: ['group-home'],
                features: ['mitori_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'group_home_taikyo_ji_joho_teikyo_kasan',
            name: '退去時情報提供加算',
            description: '退去時の情報提供を評価する加算。',
            conditions: {
                facilityType: ['group-home'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'group_home_kyoryoku_iryo_kikan_renkei_kasan',
            name: '協力医療機関連携加算',
            description: '地域の協力医療機関との連携を評価する加算。',
            conditions: {
                facilityType: ['group-home'],
                features: ['medical_cooperation'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'group_home_ninchisho_team_care_suishin_kasan',
            name: '認知症チームケア推進加算',
            description: '認知症ケアに関する専門チームによるケアを評価する加算。',
            conditions: {
                facilityType: ['group-home'],
                features: ['dementia_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'group_home_eiyo_koku_kanri_kasan',
            name: '栄養マネジメント強化加算・口腔衛生管理加算',
            description: '栄養マネジメントと口腔衛生管理を強化している場合に算定。',
            conditions: {
                facilityType: ['group-home'],
                features: ['nutrition_management', 'oral_hygiene'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'group_home_service_teikyo_taisei_kyoka_kasan',
            name: 'サービス提供体制強化加算',
            description: 'サービス提供体制を強化している場合に算定。',
            conditions: {
                facilityType: ['group-home'],
                features: [],
                staffingSystem: ['care_worker_50', 'care_worker_70', 'long_term_75'],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'group_home_kagakuteki_kaigo_suishin_kasan',
            name: '科学的介護推進体制・生産性向上推進体制加算',
            description: '科学的介護や生産性向上を推進する体制を評価する加算。',
            conditions: {
                facilityType: ['group-home'],
                features: ['ict_utilization'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'group_home_koreisha_shisetsu_kansentaisaku_kojo_kasan',
            name: '高齢者施設等感染対策向上加算',
            description: '高齢者施設等における感染対策の向上を評価する加算。',
            conditions: {
                facilityType: ['group-home'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'group_home_kaigo_shokuin_shogu_kaizen_kasan',
            name: '介護職員等処遇改善加算',
            description: '介護職員の処遇改善を評価する加算。',
            conditions: {
                facilityType: ['group-home'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },

        // 小規模多機能型居宅介護
        {
            id: 'syotaki_shoki_kasan',
            name: '初期加算',
            description: '利用開始後30日以内に限り算定。',
            conditions: {
                facilityType: ['syotaki'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'syotaki_ninchisho_kasan',
            name: '認知症加算',
            description: '認知症の利用者を受け入れている場合に算定。',
            conditions: {
                facilityType: ['syotaki'],
                features: ['dementia_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'syotaki_yakkin_taisei_kasan',
            name: '夜勤体制加算',
            description: '夜間における職員配置を手厚くした場合に算定。',
            conditions: {
                facilityType: ['syotaki'],
                features: ['night_shift'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'syotaki_mitori_renkei_taisei_kasan',
            name: '看取り連携体制加算',
            description: '看取りに関する連携体制を評価する加算。',
            conditions: {
                facilityType: ['syotaki'],
                features: ['mitori_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'syotaki_kinkyu_homon_kasan',
            name: '緊急時訪問加算',
            description: '緊急時訪問を行った場合に算定。',
            conditions: {
                facilityType: ['syotaki'],
                features: ['24h_support'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'syotaki_service_teikyo_taisei_kyoka_kasan',
            name: 'サービス提供体制強化加算',
            description: 'サービス提供体制を強化している場合に算定。',
            conditions: {
                facilityType: ['syotaki'],
                features: [],
                staffingSystem: ['care_worker_50', 'care_worker_70', 'long_term_75'],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'syotaki_nakasangan_tokubetsu_chiiki_kasan',
            name: '中山間地域等小規模事業所加算・特別地域加算',
            description: '中山間地域等に所在する小規模事業所や特別地域を評価する加算。',
            conditions: {
                facilityType: ['syotaki'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: ['level_7'], // 例として7級地を設定。必要に応じて調整。
            },
        },
        {
            id: 'syotaki_kagakuteki_kaigo_suishin_kasan',
            name: '科学的介護推進体制・生産性向上推進体制加算',
            description: '科学的介護や生産性向上を推進する体制を評価する加算。',
            conditions: {
                facilityType: ['syotaki'],
                features: ['ict_utilization'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'syotaki_kaigo_shokuin_shogu_kaizen_kasan',
            name: '介護職員等処遇改善加算',
            description: '介護職員の処遇改善を評価する加算。',
            conditions: {
                facilityType: ['syotaki'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },

        // 訪問リハビリテーション
        {
            id: 'home_rehab_rehab_management_kasan',
            name: 'リハビリテーションマネジメント加算（イ・ロ）',
            description: 'リハビリテーションのマネジメントを評価する加算。',
            conditions: {
                facilityType: ['home-rehab'],
                features: ['rehab_equipment'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_rehab_tanki_shuchu_rehab_kasan',
            name: '短期集中リハビリテーション実施加算',
            description: '短期集中的なリハビリテーションを実施した場合に算定。',
            conditions: {
                facilityType: ['home-rehab'],
                features: ['rehab_equipment'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_rehab_ninchisho_tanki_shuchu_rehab_kasan',
            name: '認知症短期集中リハビリテーション実施加算',
            description: '認知症の利用者に対し、短期集中的なリハビリテーションを実施した場合に算定。',
            conditions: {
                facilityType: ['home-rehab'],
                features: ['rehab_equipment', 'dementia_care'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_rehab_iko_shien_kasan',
            name: '移行支援加算',
            description: '生活への移行支援を評価する加算。',
            conditions: {
                facilityType: ['home-rehab'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_rehab_taiin_kyodo_shido_kasan',
            name: '退院時共同指導加算',
            description: '退院時の共同指導を評価する加算。',
            conditions: {
                facilityType: ['home-rehab'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_rehab_service_teikyo_taisei_kyoka_kasan',
            name: 'サービス提供体制強化加算',
            description: 'サービス提供体制を強化している場合に算定。',
            conditions: {
                facilityType: ['home-rehab'],
                features: [],
                staffingSystem: ['care_worker_50', 'care_worker_70', 'long_term_75'],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_rehab_koku_renkei_kyoka_kasan',
            name: '口腔連携強化加算',
            description: '口腔管理に係る連携を強化する加算。',
            conditions: {
                facilityType: ['home-rehab'],
                features: ['oral_hygiene'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
        {
            id: 'home_rehab_nakasangan_tokubetsu_chiiki_kasan',
            name: '中山間地域等小規模事業所加算／居住者提供加算',
            description: '中山間地域等に所在する小規模事業所や居住者へのサービス提供を評価する加算。',
            conditions: {
                facilityType: ['home-rehab'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: ['level_7'], // 例として7級地を設定。必要に応じて調整。
            },
        },
        {
            id: 'home_rehab_tokubetsu_chiiki_homon_rehab_kasan',
            name: '特別地域訪問リハビリテーション加算',
            description: '特別地域での訪問リハビリテーションを評価する加算。',
            conditions: {
                facilityType: ['home-rehab'],
                features: [],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: ['level_7'], // 例として7級地を設定。必要に応じて調整。
            },
        },
        {
            id: 'home_rehab_kagakuteki_kaigo_suishin_kasan',
            name: '科学的介護推進体制・介護職員等処遇改善加算',
            description: '科学的介護や介護職員の処遇改善を評価する加算。',
            conditions: {
                facilityType: ['home-rehab'],
                features: ['ict_utilization'],
                staffingSystem: [],
                careLevel: [],
                userCount: null,
                location: [],
            },
        },
    ];

    const kasanUnits = {
        'base_day_service_normal': "557単位/回",
        'base_day_service_large1': "545単位/回",
        'base_day_service_large2': "534単位/回",
        'base_home_rehab': "307単位/回（20分ごと）",
        'gensan_large_scale': "一部の加算が減算対象",
        'day_service_kobetsu_kino_kunren_kasan_1_i': "56単位/日",
        'day_service_kobetsu_kino_kunren_kasan_1_ro': "85単位/日",
        'day_service_kobetsu_kino_kunren_kasan_2': "20単位/月",
        'kasan1': "225単位/日",
        'kasan2': "3単位/日",
        'kasan3': "10単位/日",
        'kasan4': "39単位/日",
        'kasan5': "50単位/日",
        'kasan6': "30単位/月",
        'kasan7': "14単位/日",
        'kasan8': "1440単位/回",
        'kasan9': "10単位/月",
        'kasan10': "300単位/月",
        'kasan11': "200単位/日",
        'kasan12': "500単位/回",
        'kasan13': "地域区分による",
        'kasan14': "18単位/日",
        'kasan15': "12単位/日",
        'kasan16': "50単位/回",
        'kasan17': "10単位/日",
    };

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
                    <p>単位数: ${kasanUnits[kasan.id] || '不明'}</p>
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

    function checkAllConditions(kasan, userInputs) {
        const { conditions } = kasan;
        const { selectedFacilityType, facilityScale, userCount, selectedFeatures, selectedStaffingSystem, selectedCareLevel, selectedLocation } = userInputs;

        // 基本サービス費の判定
        if (kasan.id.startsWith('base_')) {
            if (kasan.id.startsWith('base_day_service')) {
                return selectedFacilityType === 'day-service' && !isNaN(userCount) && userCount > 0 && conditions.scale === facilityScale;
            } else if (kasan.id.startsWith('base_home_rehab')) {
                return selectedFacilityType === 'home-rehab';
            }
            // その他の基本サービス費（もしあれば）
            return conditions.facilityType.includes(selectedFacilityType);
        }

        // 減算の判定
        if (kasan.isGensan) {
            return selectedFacilityType === 'day-service' && Array.isArray(conditions.scale) && conditions.scale.includes(facilityScale);
        }

        // その他の加算の判定
        let passed = true;

        if (conditions.facilityType && conditions.facilityType.length > 0 && !conditions.facilityType.includes(selectedFacilityType)) {
            passed = false;
        }

        if (passed && conditions.features && conditions.features.length > 0) {
            if (!conditions.features.every(f => selectedFeatures.includes(f))) passed = false;
        }

        if (passed && conditions.staffingSystem && conditions.staffingSystem.length > 0 && !conditions.staffingSystem.includes(selectedStaffingSystem)) {
            passed = false;
        }

        if (passed && conditions.careLevel && conditions.careLevel.length > 0 && !conditions.careLevel.includes(selectedCareLevel)) {
            passed = false;
        }

        if (passed && conditions.userCount && (isNaN(userCount) || userCount < conditions.userCount)) {
            passed = false;
        }

        if (passed && conditions.location && conditions.location.length > 0 && !conditions.location.includes(selectedLocation)) {
            passed = false;
        }

        return passed;
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
