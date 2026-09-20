// =========================================================================
// Super Legend & Gala Live Chat Admin - Initial Dataset & Storage State
// =========================================================================

// 1. بيانات مستويات VIP الإهداء والصلاحيات (vips_dedic - متطابق مع الصورة 1 و 3)
const INITIAL_VIPS = [
  {
    id: 1,
    level: 1,
    name: 'VIP1',
    image: `<svg class="w-16 h-16 drop-shadow-md mx-auto" viewBox="0 0 100 100" fill="none">
      <path d="M50 8L82 24V50C82 72 50 92 50 92C50 92 18 72 18 50V24L50 8Z" fill="url(#vip1-grad)" stroke="#34d399" stroke-width="2"/>
      <path d="M50 20L68 32V50C68 64 50 78 50 78C50 78 32 64 32 50V32L50 20Z" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
      <path d="M50 28V68M40 40H60" stroke="#a7f3d0" stroke-width="3" stroke-linecap="round"/>
      <defs>
        <linearGradient id="vip1-grad" x1="50" y1="8" x2="50" y2="92" gradientUnits="userSpaceOnUse">
          <stop stop-color="#10b981"/>
          <stop offset="1" stop-color="#047857"/>
        </linearGradient>
      </defs>
    </svg>`,
    badgeName: 'الدرع الزمردي المجنح',
    price: 1500000,
    validity: 30,
    activeOwners: 84
  },
  {
    id: 2,
    level: 2,
    name: 'VIP2',
    image: `<svg class="w-16 h-16 drop-shadow-md mx-auto" viewBox="0 0 100 100" fill="none">
      <path d="M50 6L86 22V52C86 75 50 94 50 94C50 94 14 75 14 52V22L50 6Z" fill="url(#vip2-grad)" stroke="#60a5fa" stroke-width="2"/>
      <path d="M30 42L50 24L70 42L62 68H38L30 42Z" fill="#1e3a8a" stroke="#93c5fd" stroke-width="2"/>
      <circle cx="50" cy="48" r="8" fill="#60a5fa"/>
      <defs>
        <linearGradient id="vip2-grad" x1="50" y1="6" x2="50" y2="94" gradientUnits="userSpaceOnUse">
          <stop stop-color="#3b82f6"/>
          <stop offset="1" stop-color="#1d4ed8"/>
        </linearGradient>
      </defs>
    </svg>`,
    badgeName: 'التاج الياقوتي الكريستالي',
    price: 3000000,
    validity: 30,
    activeOwners: 52
  },
  {
    id: 3,
    level: 3,
    name: 'VIP3',
    image: `<svg class="w-16 h-16 drop-shadow-md mx-auto" viewBox="0 0 100 100" fill="none">
      <path d="M50 5L90 22V54C90 78 50 96 50 96C50 96 10 78 10 54V22L50 5Z" fill="url(#vip3-grad)" stroke="#c084fc" stroke-width="2"/>
      <path d="M32 30L50 18L68 30L78 55L50 78L22 55L32 30Z" fill="#581c87" stroke="#facc15" stroke-width="2"/>
      <polygon points="50,30 55,42 67,42 57,50 61,62 50,54 39,62 43,50 33,42 45,42" fill="#facc15"/>
      <defs>
        <linearGradient id="vip3-grad" x1="50" y1="5" x2="50" y2="96" gradientUnits="userSpaceOnUse">
          <stop stop-color="#9333ea"/>
          <stop offset="0.7" stop-color="#6b21a8"/>
          <stop offset="1" stop-color="#eab308"/>
        </linearGradient>
      </defs>
    </svg>`,
    badgeName: 'أجنحة النسر الأرجواني الملكي',
    price: 4500000,
    validity: 30,
    activeOwners: 38
  },
  {
    id: 4,
    level: 4,
    name: 'VIP4',
    image: `<svg class="w-16 h-16 drop-shadow-md mx-auto" viewBox="0 0 100 100" fill="none">
      <path d="M50 4L92 22V56C92 80 50 98 50 98C50 98 8 80 8 56V22L50 4Z" fill="url(#vip4-grad)" stroke="#fef08a" stroke-width="2.5"/>
      <path d="M35 32L50 16L65 32L72 58L50 82L28 58L35 32Z" fill="#713f12" stroke="#fef08a" stroke-width="2"/>
      <circle cx="50" cy="46" r="14" fill="#ca8a04" stroke="#fef08a" stroke-width="2"/>
      <path d="M44 48L50 40L56 48L50 56L44 48Z" fill="#ffffff"/>
      <defs>
        <linearGradient id="vip4-grad" x1="50" y1="4" x2="50" y2="98" gradientUnits="userSpaceOnUse">
          <stop stop-color="#eab308"/>
          <stop offset="0.5" stop-color="#ca8a04"/>
          <stop offset="1" stop-color="#854d0e"/>
        </linearGradient>
      </defs>
    </svg>`,
    badgeName: 'التاج الإمبراطوري لأسد الذهب',
    price: 8000000,
    validity: 30,
    activeOwners: 21
  },
  {
    id: 5,
    level: 5,
    name: 'VIP5',
    image: `<svg class="w-16 h-16 drop-shadow-md mx-auto" viewBox="0 0 100 100" fill="none">
      <path d="M50 4L94 24V56C94 82 50 98 50 98C50 98 6 82 6 56V24L50 4Z" fill="url(#vip5-grad)" stroke="#f87171" stroke-width="2.5"/>
      <path d="M30 36L50 14L70 36L80 62L50 86L20 62L30 36Z" fill="#7f1d1d" stroke="#fca5a5" stroke-width="2"/>
      <polygon points="50,26 58,42 74,42 61,54 66,70 50,60 34,70 39,54 26,42 42,42" fill="#ef4444" stroke="#fef08a" stroke-width="1.5"/>
      <defs>
        <linearGradient id="vip5-grad" x1="50" y1="4" x2="50" y2="98" gradientUnits="userSpaceOnUse">
          <stop stop-color="#ef4444"/>
          <stop offset="0.6" stop-color="#b91c1c"/>
          <stop offset="1" stop-color="#450a0a"/>
        </linearGradient>
      </defs>
    </svg>`,
    badgeName: 'وسام الياقوت الإمبراطوري الملتهب',
    price: 12000000,
    validity: 30,
    activeOwners: 14
  },
  {
    id: 6,
    level: 6,
    name: 'VIP6',
    image: `<svg class="w-16 h-16 drop-shadow-md mx-auto" viewBox="0 0 100 100" fill="none">
      <path d="M50 2L96 24V58C96 84 50 100 50 100C50 100 4 84 4 58V24L50 2Z" fill="url(#vip6-grad)" stroke="#f472b6" stroke-width="3"/>
      <path d="M30 32L50 10L70 32L84 60L50 88L16 60L30 32Z" fill="#831843" stroke="#fbcfe8" stroke-width="2"/>
      <circle cx="50" cy="48" r="16" fill="url(#gem-grad)" stroke="#fef08a" stroke-width="2"/>
      <polygon points="50,38 54,46 63,46 56,52 59,60 50,55 41,60 44,52 37,46 46,46" fill="#fef08a"/>
      <defs>
        <linearGradient id="vip6-grad" x1="50" y1="2" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop stop-color="#ec4899"/>
          <stop offset="0.5" stop-color="#be185d"/>
          <stop offset="1" stop-color="#500724"/>
        </linearGradient>
        <linearGradient id="gem-grad" x1="34" y1="32" x2="66" y2="64" gradientUnits="userSpaceOnUse">
          <stop stop-color="#f43f5e"/>
          <stop offset="1" stop-color="#881337"/>
        </linearGradient>
      </defs>
    </svg>`,
    badgeName: 'التاج الأسطوري الملكي الأعلى',
    price: 20000000,
    validity: 30,
    activeOwners: 7
  }
];

// 2. بيانات المستخدمين المتقدمة مع المعرفات الأساسية الموحدة (Primary System ID يبدأ من 1001001 بتسلسل تصاعدي)
const INITIAL_USERS = [
  {
    id: 1001001,
    primaryId: 1001001,
    specialId: '1001001',
    gameUuid: 'bec73d63-ed39-4d82-8419-4a7b51e021a8',
    displayName: 'الملك سلطان الفاتح (أبو أمجد)',
    phone: '+966501234567',
    email: 'sultan@gala.live',
    family: 'عائلة الملوك',
    coins: 48500000,
    diamonds: 124000,
    level: 85,
    vipLevel: 5,
    status: 'active',
    roles: ['AGENCY_MANAGER'],
    functionalRoleCode: 'MGR-9901',
    roleTitle: 'مدير عام الوكالات والمشرف الإداري الرئيسي 🔱'
  },
  {
    id: 1001002,
    primaryId: 1001002,
    specialId: '1001002',
    gameUuid: 'a4afd453-b019-4c77-9811-39dca41b5592',
    displayName: 'الأميرة ديانا (الكابتن)',
    phone: '+971509876543',
    email: 'diana@gala.live',
    family: 'عائلة النخبة',
    coins: 29800000,
    diamonds: 98500,
    level: 74,
    vipLevel: 4,
    status: 'active',
    roles: ['AGENCY_MANAGER'],
    functionalRoleCode: 'MGR-9902',
    roleTitle: 'مدير وكالات إقليمي معتمد 👑'
  },
  {
    id: 1001003,
    primaryId: 1001003,
    specialId: '1001003',
    gameUuid: 'b4339623-5d88-450a-9d21-f182c4aa0291',
    displayName: 'صقر قريش 🦅 (سالم الكعبي)',
    phone: '+96599112233',
    email: 'saqr@gala.live',
    family: 'عائلة الملوك',
    coins: 19400000,
    diamonds: 45000,
    level: 68,
    vipLevel: 3,
    status: 'active',
    roles: ['AGENCY_MANAGER'],
    functionalRoleCode: 'MGR-9903',
    roleTitle: 'مدير تنفيذي معتمد للوكالات'
  },
  {
    id: 1001004,
    primaryId: 1001004,
    specialId: '1001004',
    gameUuid: '6524c309-b286-4298-89fa-553b1b9e2810',
    displayName: 'عبدالله الشهري (نجم الشمال 🌟)',
    phone: '+966501112233',
    email: 'najm@gala.live',
    family: 'عائلة الأساطير',
    coins: 15200000,
    diamonds: 32000,
    level: 62,
    vipLevel: 3,
    status: 'active',
    roles: ['DELEGATE'],
    functionalRoleCode: 'DEL-401',
    roleTitle: 'مندوب استقطاب وكلاء معتمد 🌟'
  },
  {
    id: 1001005,
    primaryId: 1001005,
    specialId: '1001005',
    gameUuid: '5ff4a7bd-ce83-4f09-b7b6-12199fbdca43',
    displayName: 'سلطان القحطاني (عاشق الليل)',
    phone: '+966552223344',
    email: 'night@gala.live',
    family: 'عائلة الهيبة',
    coins: 8400000,
    diamonds: 18000,
    level: 51,
    vipLevel: 2,
    status: 'active',
    roles: ['DELEGATE'],
    functionalRoleCode: 'DEL-402',
    roleTitle: 'مندوب استقطاب وكلاء 🎯'
  },
  {
    id: 1001006,
    primaryId: 1001006,
    specialId: '1001006',
    gameUuid: '332db81f-64e6-432d-96ce-44ea68b9a101',
    displayName: 'مشعل العتيبي (Super VIP)',
    phone: '+966563334455',
    email: 'vip80000@gala.live',
    family: 'عائلة الملوك',
    coins: 95000000,
    diamonds: 350000,
    level: 99,
    vipLevel: 6,
    status: 'active',
    roles: ['DELEGATE'],
    functionalRoleCode: 'DEL-403',
    roleTitle: 'مندوب استقطاب وكلاء 🚀'
  },
  {
    id: 1001007,
    primaryId: 1001007,
    specialId: '1001007',
    gameUuid: '4142c864-7a8a-48a2-97dc-fa293c44e991',
    displayName: 'فهد الشمري (البرنس علاء)',
    phone: '+966547778899',
    email: 'prince@gala.live',
    family: 'عائلة النخبة',
    coins: 6100000,
    diamonds: 14200,
    level: 46,
    vipLevel: 2,
    status: 'active',
    roles: ['DELEGATE'],
    functionalRoleCode: 'DEL-404',
    roleTitle: 'مندوب استقطاب وكلاء إقليمي 💎'
  },
  {
    id: 1001008,
    primaryId: 1001008,
    specialId: '1001008',
    gameUuid: '6f06c105-d716-4078-a28b-b8f2c388279e',
    displayName: 'عمر الدوسري (الفاروق)',
    phone: '+966598881122',
    email: 'farooq@gala.live',
    family: 'عائلة الفرسان',
    coins: 4300000,
    diamonds: 9500,
    level: 39,
    vipLevel: 1,
    status: 'active',
    roles: ['DELEGATE'],
    functionalRoleCode: 'DEL-405',
    roleTitle: 'مندوب استقطاب وكلاء معتمد ⚡'
  },
  {
    id: 1001009,
    primaryId: 1001009,
    specialId: '1001009',
    gameUuid: 'fe3c5f98-f790-4532-a527-e549ba9c1182',
    displayName: 'ياسر المنصوري (مندوب دولي)',
    phone: '+971501234567',
    email: 'yasser@gala.live',
    family: 'عائلة الأساطير',
    coins: 7800000,
    diamonds: 21000,
    level: 54,
    vipLevel: 2,
    status: 'active',
    roles: ['DELEGATE'],
    functionalRoleCode: 'DEL-501',
    roleTitle: 'مندوب استقطاب وكلاء دولي 🌍'
  },
  {
    id: 1001010,
    primaryId: 1001010,
    specialId: '1001010',
    gameUuid: '07013021-b4f1-4f68-98e3-b3c95977a281',
    displayName: 'سلطان الدوسري (الوكيل الرسمي)',
    phone: '+966501845260',
    email: 'sultan_dosari@gala.live',
    family: 'عائلة الهيبة',
    coins: 14500000,
    diamonds: 80000,
    level: 65,
    vipLevel: 4,
    status: 'active',
    roles: ['OFFICIAL_AGENT'],
    functionalRoleCode: 'AG-101',
    roleTitle: 'وكيل رسمي معتمد (وكالة النخبة الملكية)'
  },
  {
    id: 1001011,
    primaryId: 1001011,
    specialId: '1001011',
    gameUuid: 'e8f07423-b750-4a84-90aa-9a9971bc3e12',
    displayName: 'فهد العنبي (الوكيل الرسمي)',
    phone: '+966553003211',
    email: 'fahad_anabi@gala.live',
    family: 'عائلة الفرسان',
    coins: 8200000,
    diamonds: 42000,
    level: 58,
    vipLevel: 3,
    status: 'active',
    roles: ['OFFICIAL_AGENT'],
    functionalRoleCode: 'AG-104',
    roleTitle: 'وكيل رسمي معتمد (وكالة الأساطير الذهبية)'
  },
  {
    id: 1001012,
    primaryId: 1001012,
    specialId: '1001012',
    gameUuid: 'd028d172-4074-4ec2-9e2c-3836371c1102',
    displayName: 'فيصل المطيري (الوكيل الرسمي)',
    phone: '+966542492751',
    email: 'faisal_mutairi@gala.live',
    family: 'عائلة النخبة',
    coins: 9200000,
    diamonds: 56000,
    level: 60,
    vipLevel: 3,
    status: 'active',
    roles: ['OFFICIAL_AGENT'],
    functionalRoleCode: 'AG-102',
    roleTitle: 'وكيل رسمي معتمد (وكالة صدى الخليج الدولية)'
  },
  {
    id: 1001013,
    primaryId: 1001013,
    specialId: '1001013',
    gameUuid: 'c1092834-8921-4f81-9b12-921839019283',
    displayName: 'محمود عبد الرازق (الوكيل الرسمي)',
    phone: '+201048196730',
    email: 'mahmoud_agency@gala.live',
    family: 'عائلة الأهرام',
    coins: 6100000,
    diamonds: 31000,
    level: 52,
    vipLevel: 2,
    status: 'active',
    roles: ['OFFICIAL_AGENT'],
    functionalRoleCode: 'AG-103',
    roleTitle: 'وكيل رسمي معتمد (وكالة الأهرام والبث المباشر)'
  },
  {
    id: 1001014,
    primaryId: 1001014,
    specialId: '1001014',
    gameUuid: 'd9201948-2819-4a92-8172-839102938172',
    displayName: 'ماجد العسيري (الوكيل الرسمي)',
    phone: '+966565521900',
    email: 'majed_asiri@gala.live',
    family: 'عائلة الصقور',
    coins: 6400000,
    diamonds: 35000,
    level: 54,
    vipLevel: 2,
    status: 'active',
    roles: ['OFFICIAL_AGENT'],
    functionalRoleCode: 'AG-105',
    roleTitle: 'وكيل رسمي معتمد (وكالة الصقور الملكية)'
  },
  {
    id: 1001015,
    primaryId: 1001015,
    specialId: '1001015',
    gameUuid: 'f8291049-3910-4820-b192-918273645102',
    displayName: 'سعد الشهراني (الوكيل الرسمي)',
    phone: '+966509901230',
    email: 'saad_shahrani@gala.live',
    family: 'عائلة المجد',
    coins: 11200000,
    diamonds: 62000,
    level: 63,
    vipLevel: 3,
    status: 'active',
    roles: ['OFFICIAL_AGENT'],
    functionalRoleCode: 'AG-106',
    roleTitle: 'وكيل رسمي معتمد (وكالة المجد الفضائية)'
  },
  {
    id: 1001016,
    primaryId: 1001016,
    specialId: '1001016',
    gameUuid: 'a7182930-4829-4102-9812-736291029384',
    displayName: 'تركي الشمري (وسيط معتمد)',
    phone: '+966501112233',
    email: 'turki_broker@gala.live',
    family: 'عائلة النخبة',
    coins: 4500000,
    diamonds: 22000,
    level: 48,
    vipLevel: 2,
    status: 'active',
    roles: ['BROKER'],
    functionalRoleCode: 'BRK-101-1',
    roleTitle: 'وسيط وكالة معتمد (BRK-101-1)'
  },
  {
    id: 1001017,
    primaryId: 1001017,
    specialId: '1001017',
    gameUuid: 'b8291039-4819-4910-a192-827361928374',
    displayName: 'عبدالله القحطاني (وسيط معتمد)',
    phone: '+966554443322',
    email: 'abdullah_broker@gala.live',
    family: 'عائلة النخبة',
    coins: 3800000,
    diamonds: 19000,
    level: 45,
    vipLevel: 2,
    status: 'active',
    roles: ['BROKER'],
    functionalRoleCode: 'BRK-101-2',
    roleTitle: 'وسيط وكالة معتمد (BRK-101-2)'
  },
  {
    id: 1001018,
    primaryId: 1001018,
    specialId: '1001018',
    gameUuid: 'c9182736-4829-4910-b283-718293049182',
    displayName: 'بندر الغامدي (وسيط معتمد)',
    phone: '+966567778899',
    email: 'bandar_broker@gala.live',
    family: 'عائلة النخبة',
    coins: 3100000,
    diamonds: 15000,
    level: 42,
    vipLevel: 1,
    status: 'active',
    roles: ['BROKER'],
    functionalRoleCode: 'BRK-101-3',
    roleTitle: 'وسيط وكالة معتمد (BRK-101-3)'
  },
  {
    id: 1001019,
    primaryId: 1001019,
    specialId: '1001019',
    gameUuid: 'd0192837-4829-4102-c394-829102938475',
    displayName: 'سالم العتيبي (وسيط معتمد)',
    phone: '+966542221100',
    email: 'salem_broker@gala.live',
    family: 'عائلة الخليج',
    coins: 4200000,
    diamonds: 21000,
    level: 47,
    vipLevel: 2,
    status: 'active',
    roles: ['BROKER'],
    functionalRoleCode: 'BRK-102-1',
    roleTitle: 'وسيط وكالة معتمد (BRK-102-1)'
  },
  {
    id: 1001020,
    primaryId: 1001020,
    specialId: '1001020',
    gameUuid: 'e1029384-5920-4102-d485-930192837465',
    displayName: 'حمد الهاجري (وسيط معتمد)',
    phone: '+96599112233',
    email: 'hamad_broker@gala.live',
    family: 'عائلة الخليج',
    coins: 3400000,
    diamonds: 16000,
    level: 43,
    vipLevel: 1,
    status: 'active',
    roles: ['BROKER'],
    functionalRoleCode: 'BRK-102-2',
    roleTitle: 'وسيط وكالة معتمد (BRK-102-2)'
  },
  {
    id: 1001021,
    primaryId: 1001021,
    specialId: '1001021',
    gameUuid: 'f2102938-6031-4213-e596-041283948576',
    displayName: 'أحمد صبري (وسيط معتمد)',
    phone: '+201012345678',
    email: 'ahmed_broker@gala.live',
    family: 'عائلة الأهرام',
    coins: 2900000,
    diamonds: 14000,
    level: 41,
    vipLevel: 1,
    status: 'active',
    roles: ['BROKER'],
    functionalRoleCode: 'BRK-103-1',
    roleTitle: 'وسيط وكالة معتمد (BRK-103-1)'
  },
  {
    id: 1001022,
    primaryId: 1001022,
    specialId: '1001022',
    gameUuid: 'a3210948-7142-4324-f607-152394059687',
    displayName: 'سارة الرياض (مضيفة مميزة)',
    phone: '+966542190831',
    email: 'sara_host@gala.live',
    family: 'عائلة النخبة',
    coins: 3400000,
    diamonds: 28000,
    level: 49,
    vipLevel: 2,
    status: 'active',
    roles: ['HOST'],
    functionalRoleCode: 'HOST-101-01',
    roleTitle: 'مضيفة بث مباشر معتمدة (HOST-101-01)'
  },
  {
    id: 1001023,
    primaryId: 1001023,
    specialId: '1001023',
    gameUuid: 'b4321059-8253-4435-0718-263405160798',
    displayName: 'صوت البادية (مضيف معتمد)',
    phone: '+966553109482',
    email: 'badiya_host@gala.live',
    family: 'عائلة النخبة',
    coins: 2800000,
    diamonds: 21000,
    level: 44,
    vipLevel: 1,
    status: 'active',
    roles: ['HOST'],
    functionalRoleCode: 'HOST-101-02',
    roleTitle: 'مضيف بث مباشر معتمد (HOST-101-02)'
  },
  {
    id: 1001024,
    primaryId: 1001024,
    specialId: '1001024',
    gameUuid: 'c5432160-9364-4546-1829-374516271809',
    displayName: 'كروان النخبة (مضيف معتمد)',
    phone: '+966562847190',
    email: 'karawan_host@gala.live',
    family: 'عائلة النخبة',
    coins: 3100000,
    diamonds: 25000,
    level: 46,
    vipLevel: 2,
    status: 'active',
    roles: ['HOST'],
    functionalRoleCode: 'HOST-101-03',
    roleTitle: 'مضيف بث مباشر معتمد (HOST-101-03)'
  },
  {
    id: 1001025,
    primaryId: 1001025,
    specialId: '1001025',
    gameUuid: 'd6543271-0475-4657-2930-485627382910',
    displayName: 'ليالي نجد (مضيفة معتمدة)',
    phone: '+966502847193',
    email: 'layali_host@gala.live',
    family: 'عائلة النخبة',
    coins: 2100000,
    diamonds: 17000,
    level: 39,
    vipLevel: 1,
    status: 'active',
    roles: ['HOST'],
    functionalRoleCode: 'HOST-101-04',
    roleTitle: 'مضيفة بث مباشر معتمدة (HOST-101-04)'
  },
  {
    id: 1001026,
    primaryId: 1001026,
    specialId: '1001026',
    gameUuid: 'e7654382-1586-4768-3041-596738493021',
    displayName: 'صقر الجزيرة (مضيف معتمد)',
    phone: '+966551850392',
    email: 'saqr_host@gala.live',
    family: 'عائلة النخبة',
    coins: 1950000,
    diamonds: 15000,
    level: 37,
    vipLevel: 1,
    status: 'active',
    roles: ['HOST'],
    functionalRoleCode: 'HOST-101-05',
    roleTitle: 'مضيف بث مباشر معتمد (HOST-101-05)'
  },
  {
    id: 1001027,
    primaryId: 1001027,
    specialId: '1001027',
    gameUuid: 'f8765493-2697-4879-4152-607849504132',
    displayName: 'أميرة الصمت (مضيفة معتمدة)',
    phone: '+966544910283',
    email: 'amira_host@gala.live',
    family: 'عائلة النخبة',
    coins: 2650000,
    diamonds: 20000,
    level: 43,
    vipLevel: 1,
    status: 'active',
    roles: ['HOST'],
    functionalRoleCode: 'HOST-101-06',
    roleTitle: 'مضيفة بث مباشر معتمدة (HOST-101-06)'
  },
  {
    id: 1001028,
    primaryId: 1001028,
    specialId: '1001028',
    gameUuid: '09876504-3708-4980-5263-718950615243',
    displayName: 'نسيم الجنوب (مضيف معتمد)',
    phone: '+966564109281',
    email: 'naseem_host@gala.live',
    family: 'عائلة النخبة',
    coins: 1400000,
    diamonds: 11000,
    level: 33,
    vipLevel: 1,
    status: 'active',
    roles: ['HOST'],
    functionalRoleCode: 'HOST-101-07',
    roleTitle: 'مضيف بث مباشر معتمد (HOST-101-07)'
  },
  {
    id: 1001029,
    primaryId: 1001029,
    specialId: '1001029',
    gameUuid: '10987615-4819-5091-6374-829061726354',
    displayName: 'أوتار الشرق (مضيف مباشر)',
    phone: '+966503859102',
    email: 'awtar_host@gala.live',
    family: 'عائلة النخبة',
    coins: 4100000,
    diamonds: 32000,
    level: 51,
    vipLevel: 2,
    status: 'active',
    roles: ['HOST'],
    functionalRoleCode: 'HOST-101-08',
    roleTitle: 'مضيف بث مباشر معتمد (HOST-101-08)'
  },
  {
    id: 1001030,
    primaryId: 1001030,
    specialId: '1001030',
    gameUuid: '21098726-5920-6102-7485-930172837465',
    displayName: 'ورد الجوري (مضيفة مباشرة)',
    phone: '+966555019284',
    email: 'ward_host@gala.live',
    family: 'عائلة النخبة',
    coins: 3200000,
    diamonds: 24000,
    level: 45,
    vipLevel: 2,
    status: 'active',
    roles: ['HOST'],
    functionalRoleCode: 'HOST-101-09',
    roleTitle: 'مضيفة بث مباشر معتمدة (HOST-101-09)'
  },
  {
    id: 1001031,
    primaryId: 1001031,
    specialId: '1001031',
    gameUuid: '32109837-6031-7213-8596-041283948576',
    displayName: 'فارس الظلام (مضيف معتمد)',
    phone: '+966542910482',
    email: 'fares_host@gala.live',
    family: 'عائلة الخليج',
    coins: 2900000,
    diamonds: 22000,
    level: 44,
    vipLevel: 1,
    status: 'active',
    roles: ['HOST'],
    functionalRoleCode: 'HOST-102-01',
    roleTitle: 'مضيف بث مباشر معتمد (HOST-102-01)'
  },
  {
    id: 1001032,
    primaryId: 1001032,
    specialId: '1001032',
    gameUuid: '43210948-7142-8324-9607-152394059687',
    displayName: 'دانة الخليج (مضيفة معتمدة)',
    phone: '+965993948192',
    email: 'dana_host@gala.live',
    family: 'عائلة الخليج',
    coins: 2400000,
    diamonds: 18000,
    level: 40,
    vipLevel: 1,
    status: 'active',
    roles: ['HOST'],
    functionalRoleCode: 'HOST-102-02',
    roleTitle: 'مضيفة بث مباشر معتمدة (HOST-102-02)'
  },
  {
    id: 1001033,
    primaryId: 1001033,
    specialId: '1001033',
    gameUuid: '54321059-8253-9435-0718-263405160798',
    displayName: 'ريم البوادي (مستخدمة نشطة)',
    phone: '+966549988112',
    email: 'reem_user@gala.live',
    family: 'عائلة الأساطير',
    coins: 850000,
    diamonds: 4200,
    level: 28,
    vipLevel: 1,
    status: 'active',
    roles: ['USER'],
    functionalRoleCode: null,
    roleTitle: 'مستخدمة أساسية'
  },
  {
    id: 1001034,
    primaryId: 1001034,
    specialId: '1001034',
    gameUuid: '65432160-9364-0546-1829-374516271809',
    displayName: 'كابتن ماجد (مستخدم مميز)',
    phone: '+966504433221',
    email: 'captain_majed@gala.live',
    family: 'عائلة الهيبة',
    coins: 1200000,
    diamonds: 6500,
    level: 32,
    vipLevel: 1,
    status: 'active',
    roles: ['USER'],
    functionalRoleCode: null,
    roleTitle: 'مستخدم أساسي'
  },
  {
    id: 1001035,
    primaryId: 1001035,
    specialId: '1001035',
    gameUuid: '76543271-0475-1657-2930-485627382910',
    displayName: 'مستخدم قياسي معتمد',
    phone: '+966599887766',
    email: 'user1001035@gala.live',
    family: 'عائلة النخبة',
    coins: 350000,
    diamonds: 1200,
    level: 18,
    vipLevel: 0,
    status: 'active',
    roles: ['USER'],
    functionalRoleCode: null,
    roleTitle: 'مستخدم أساسي'
  }
];

// 3. طلبات موقع ويب سايت غلا (Gala Website Requests)
const INITIAL_GALA_REQUESTS = [
  {
    id: 'WEB-401',
    type: 'طلب اعتماد وكالة جديدة',
    name: 'أحمد الشيخ - وكالة النجوم الذهبية',
    phone: '+966504443322',
    subject: 'طلب ترخيص وكالة استضافة رسمية وتوثيق مضيفين',
    date: 'منذ 25 دقيقة',
    status: 'قيد الانتظار'
  },
  {
    id: 'WEB-402',
    type: 'حجز معرف مميز (VIP ID)',
    name: 'الشيخ منصور',
    phone: '+971501112233',
    subject: 'طلب شراء المعرف النادر 77777 وشحن 50 مليون كوينز',
    date: 'منذ ساعتين',
    status: 'قيد المراجعة'
  },
  {
    id: 'WEB-403',
    type: 'توثيق حساب رسمي',
    name: 'الإعلامية سارة كمال',
    phone: '+201122334455',
    subject: 'طلب شارة التوثيق الذهبية وربط حساب تيك توك الموثق',
    date: 'منذ 5 ساعات',
    status: 'مكتمل'
  }
];

// 4.0 مدراء ورؤساء الوكالات (Agency Managers / Directors)
const INITIAL_AGENCY_MANAGERS = [
  {
    id: 'MGR-9901',
    primaryUserId: 1001001,
    name: 'إدارة أبو أمجد (مدير عام الوكالات 🔱)',
    roleTitle: 'مدير عام الوكالات والمشرف الإداري الرئيسي 🔱',
    profitSharePercent: 55.0,
    delegatesCount: 5,
    totalAgencies: 6,
    totalRevenue: 52500000,
    totalEarnedCoins: 28875000,
    phone: '+966 55 123 4567',
    nationalId: '1098765432',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    country: 'المملكة العربية السعودية',
    city: 'الرياض',
    status: 'نشط',
    joinedDate: '2025-08-01'
  },
  {
    id: 'MGR-9902',
    primaryUserId: 1001002,
    name: 'إدارة الكابتن (مدير وكالات إقليمي 👑)',
    roleTitle: 'مدير وكالات إقليمي معتمد 👑',
    profitSharePercent: 50.0,
    delegatesCount: 3,
    totalAgencies: 4,
    totalRevenue: 28400000,
    totalEarnedCoins: 14200000,
    phone: '+966 50 998 8776',
    nationalId: '1088776655',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    country: 'المملكة العربية السعودية',
    city: 'جدة',
    status: 'نشط',
    joinedDate: '2025-10-15',
    permissions: {
      canAssignDelegates: true,
      maxDelegatesQuota: 5,
      canApproveAgencies: true,
      canTransferHosts: true,
      canUnbanAccounts: true,
      canTransferBrokerHosts: true,
      rechargeControlBlocked: true
    }
  },
  {
    id: 'MGR-9903',
    primaryUserId: 1001003,
    name: 'إدارة سالم الكعبي (رئيس الوكالات التنفيذي)',
    roleTitle: 'مدير تنفيذي معتمد للوكالات',
    profitSharePercent: 48.0,
    delegatesCount: 3,
    totalAgencies: 3,
    totalRevenue: 21500000,
    totalEarnedCoins: 10320000,
    phone: '+966 54 321 9876',
    nationalId: '1077665544',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    country: 'الإمارات',
    city: 'أبوظبي',
    status: 'نشط',
    joinedDate: '2025-11-20'
  }
];

// 4.0.1 مندوبو الوكالات (Agency Delegates - عملهم استقطاب الوكلاء بنسبة يحددها مدير الوكالات - مرتبطون بالمعرف الأساسي الثابت 1001001 فما فوق)
const INITIAL_AGENCY_DELEGATES = [
  {
    id: 'DEL-401',
    primaryUserId: 1001004,
    managerId: 'MGR-9901',
    managerName: 'إدارة أبو أمجد',
    name: 'مندوب 1: عبدالله الشهري (مندوب معتمد 🌟)',
    roleTitle: 'مندوب استقطاب وكلاء معتمد',
    commissionRate: 15.0, // النسبة التي يمنحها له مدير الوكالات
    phone: '+966 50 111 2233',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    invitedAgenciesCount: 2, // كم وكالة دعاها هذا المندوب
    totalRevenue: 22700000,
    earnedCoins: 3405000,
    country: 'السعودية',
    city: 'الرياض',
    status: 'معتمد',
    joinDate: '2026-01-05'
  },
  {
    id: 'DEL-402',
    primaryUserId: 1001005,
    managerId: 'MGR-9901',
    managerName: 'إدارة أبو أمجد',
    name: 'مندوب 2: سلطان القحطاني (مندوب وكلاء 🎯)',
    roleTitle: 'مندوب استقطاب وكلاء',
    commissionRate: 14.0,
    phone: '+966 55 222 3344',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    invitedAgenciesCount: 1,
    totalRevenue: 9200000,
    earnedCoins: 1288000,
    country: 'السعودية',
    city: 'الدمام',
    status: 'معتمد',
    joinDate: '2026-01-20'
  },
  {
    id: 'DEL-403',
    primaryUserId: 1001006,
    managerId: 'MGR-9901',
    managerName: 'إدارة أبو أمجد',
    name: 'مندوب 3: مشعل العتيبي (مندوب استقطاب 🚀)',
    roleTitle: 'مندوب استقطاب وكلاء',
    commissionRate: 12.5,
    phone: '+966 56 333 4455',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    invitedAgenciesCount: 1,
    totalRevenue: 6100000,
    earnedCoins: 762500,
    country: 'السعودية',
    city: 'مكة المكرمة',
    status: 'معتمد',
    joinDate: '2026-02-01'
  },
  {
    id: 'DEL-404',
    primaryUserId: 1001007,
    managerId: 'MGR-9901',
    managerName: 'إدارة أبو أمجد',
    name: 'مندوب 4: فهد الشمري (مندوب رسمي 💎)',
    roleTitle: 'مندوب استقطاب وكلاء إقليمي',
    commissionRate: 13.5,
    phone: '+966 54 777 8899',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    invitedAgenciesCount: 1,
    totalRevenue: 6400000,
    earnedCoins: 864000,
    country: 'السعودية',
    city: 'الخبر',
    status: 'معتمد',
    joinDate: '2026-02-10'
  },
  {
    id: 'DEL-405',
    primaryUserId: 1001008,
    managerId: 'MGR-9901',
    managerName: 'إدارة أبو أمجد',
    name: 'مندوب 5: عمر الدوسري (مندوب نشط ⚡)',
    roleTitle: 'مندوب استقطاب وكلاء معتمد',
    commissionRate: 14.0,
    phone: '+966 59 888 1122',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    invitedAgenciesCount: 1,
    totalRevenue: 8100000,
    earnedCoins: 1134000,
    country: 'السعودية',
    city: 'حائل',
    status: 'معتمد',
    joinDate: '2026-02-15'
  },
  {
    id: 'DEL-501',
    primaryUserId: 1001009,
    managerId: 'MGR-9902',
    managerName: 'إدارة الكابتن',
    name: 'مندوب 1: ياسر المنصوري (مندوب دولي)',
    roleTitle: 'مندوب استقطاب وكلاء إقليمي',
    commissionRate: 14.0,
    phone: '+971 50 123 4567',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    invitedAgenciesCount: 2,
    totalRevenue: 18200000,
    earnedCoins: 2548000,
    country: 'الإمارات',
    city: 'دبي',
    status: 'معتمد',
    joinDate: '2026-02-10'
  },
  {
    id: 'DEL-502',
    managerId: 'MGR-9902',
    managerName: 'إدارة الكابتن',
    name: 'مندوب 2: حاتم الحكيمي (مندوب معتمد)',
    roleTitle: 'مندوب استقطاب وكلاء معتمد',
    commissionRate: 12.0,
    phone: '+967 77 123 4567',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    invitedAgenciesCount: 2,
    totalRevenue: 10200000,
    earnedCoins: 1224000,
    country: 'اليمن',
    city: 'صنعاء',
    status: 'معتمد',
    joinDate: '2026-02-15'
  }
];

// 4. وكالات التطبيق (Agencies & Submenu items)
const INITIAL_AGENCIES = [
  {
    id: 'AG-101',
    name: 'وكالة النخبة الملكية للإنتاج والصوتيات',
    managerId: 'MGR-9901',
    delegateId: 'DEL-401',
    invitedBy: 'مندوب 1: عبدالله الشهري (DEL-401)',
    owner: 'سلطان الدوسري (الوكيل الرسمي)',
    ownerId: '1001010',
    ownerPrimaryId: 1001010,
    phone: '+966501845260',
    coins: 14500000,
    commission: 14.5, // نسبة الوكيل الرسمي
    brokersCount: 3,
    hosts: 48,
    hours: 1420,
    target: 50000000,
    achievedTarget: 41200000,
    status: 'نشطة',
    todayStats: { hours: 48.5, coins: 1450000, activeHosts: 18, giftsCount: 3820 },
    monthlyStats: { hours: 1420, targetHours: 1500, revenue: 41200000, targetRevenue: 50000000, commissionEarned: 5974000, completionRate: 82.4 },
    financialMetrics: { withdrawableBalance: 3450000, totalWithdrawn: 14200000, avgHostHours: 4.6, qualityScore: '98.2% (ممتاز ⭐)' }
  },
  {
    id: 'AG-104',
    name: 'وكالة الأساطير الذهبية',
    managerId: 'MGR-9901',
    delegateId: 'DEL-401',
    invitedBy: 'مندوب 1: عبدالله الشهري (DEL-401)',
    owner: 'فهد العنبي (الوكيل الرسمي)',
    ownerId: '1001011',
    ownerPrimaryId: 1001011,
    phone: '+966553003211',
    coins: 8200000,
    commission: 15.0,
    brokersCount: 2,
    hosts: 28,
    hours: 890,
    target: 25000000,
    achievedTarget: 21000000,
    status: 'نشطة',
    todayStats: { hours: 32.0, coins: 920000, activeHosts: 12, giftsCount: 2100 },
    monthlyStats: { hours: 890, targetHours: 1000, revenue: 21000000, targetRevenue: 25000000, commissionEarned: 3150000, completionRate: 84.0 },
    financialMetrics: { withdrawableBalance: 2100000, totalWithdrawn: 8400000, avgHostHours: 4.2, qualityScore: '96.5% (جيد جداً)' }
  },
  {
    id: 'AG-102',
    name: 'وكالة صدى الخليج الدولية',
    managerId: 'MGR-9901',
    delegateId: 'DEL-402',
    invitedBy: 'مندوب 2: سلطان القحطاني (DEL-402)',
    owner: 'فيصل المطيري (الوكيل الرسمي)',
    ownerId: '1001012',
    ownerPrimaryId: 1001012,
    phone: '+966542492751',
    coins: 9200000,
    commission: 12.0,
    brokersCount: 2,
    hosts: 34,
    hours: 980,
    target: 30000000,
    achievedTarget: 26800000,
    status: 'نشطة',
    todayStats: { hours: 38.0, coins: 1100000, activeHosts: 15, giftsCount: 2840 },
    monthlyStats: { hours: 980, targetHours: 1100, revenue: 26800000, targetRevenue: 30000000, commissionEarned: 3216000, completionRate: 89.3 },
    financialMetrics: { withdrawableBalance: 2800000, totalWithdrawn: 10200000, avgHostHours: 4.4, qualityScore: '97.8% (ممتاز)' }
  },
  {
    id: 'AG-103',
    name: 'وكالة الأهرام والبث المباشر',
    managerId: 'MGR-9901',
    delegateId: 'DEL-403',
    invitedBy: 'مندوب 3: مشعل العتيبي (DEL-403)',
    owner: 'محمود عبد الرازق (الوكيل الرسمي)',
    ownerId: '1001013',
    ownerPrimaryId: 1001013,
    phone: '+201048196730',
    coins: 6100000,
    commission: 10.0,
    brokersCount: 1,
    hosts: 22,
    hours: 740,
    target: 20000000,
    achievedTarget: 17500000,
    status: 'نشطة',
    todayStats: { hours: 24.5, coins: 780000, activeHosts: 9, giftsCount: 1950 },
    monthlyStats: { hours: 740, targetHours: 850, revenue: 17500000, targetRevenue: 20000000, commissionEarned: 1750000, completionRate: 87.5 },
    financialMetrics: { withdrawableBalance: 1650000, totalWithdrawn: 6800000, avgHostHours: 4.1, qualityScore: '95.0% (جيد جداً)' }
  },
  {
    id: 'AG-105',
    name: 'وكالة الصقور الملكية',
    managerId: 'MGR-9901',
    delegateId: 'DEL-404',
    invitedBy: 'مندوب 4: فهد الشمري (DEL-404)',
    owner: 'ماجد العسيري (الوكيل الرسمي)',
    ownerId: '1001014',
    ownerPrimaryId: 1001014,
    phone: '+966565521900',
    coins: 6400000,
    commission: 13.5,
    brokersCount: 2,
    hosts: 22,
    hours: 680,
    target: 20000000,
    achievedTarget: 16800000,
    status: 'نشطة',
    todayStats: { hours: 26.0, coins: 820000, activeHosts: 10, giftsCount: 1800 },
    monthlyStats: { hours: 680, targetHours: 800, revenue: 16800000, targetRevenue: 20000000, commissionEarned: 2268000, completionRate: 84.0 },
    financialMetrics: { withdrawableBalance: 1900000, totalWithdrawn: 5900000, avgHostHours: 4.0, qualityScore: '96.0% (جيد جداً)' }
  },
  {
    id: 'AG-106',
    name: 'وكالة المجد الفضائية الرسمية',
    managerId: 'MGR-9901',
    delegateId: 'DEL-405',
    invitedBy: 'مندوب 5: عمر الدوسري (DEL-405)',
    owner: 'سعد الشهراني (الوكيل الرسمي)',
    ownerId: '1001015',
    ownerPrimaryId: 1001015,
    phone: '+966509901230',
    coins: 11200000,
    commission: 16.0,
    brokersCount: 2,
    hosts: 36,
    hours: 1100,
    target: 35000000,
    achievedTarget: 31500000,
    status: 'نشطة',
    todayStats: { hours: 42.0, coins: 1320000, activeHosts: 16, giftsCount: 3100 },
    monthlyStats: { hours: 1100, targetHours: 1200, revenue: 31500000, targetRevenue: 35000000, commissionEarned: 5040000, completionRate: 90.0 },
    financialMetrics: { withdrawableBalance: 3100000, totalWithdrawn: 11500000, avgHostHours: 4.5, qualityScore: '98.0% (ممتاز ⭐)' }
  },
  // وكالات إدارة الكابتن (MGR-9902)
  {
    id: 'AG-201',
    name: 'وكالة القمة الدولية (إدارة الكابتن 👑)',
    managerId: 'MGR-9902',
    delegateId: 'DEL-501',
    invitedBy: 'مندوب 1: ياسر المنصوري (DEL-501)',
    owner: 'رائد الشريف (الوكيل الرسمي)',
    ownerId: '1001021',
    ownerPrimaryId: 1001021,
    phone: '+966509988771',
    coins: 11500000,
    commission: 15.0,
    brokersCount: 2,
    hosts: 32,
    hours: 940,
    target: 30000000,
    achievedTarget: 25400000,
    status: 'نشطة',
    todayStats: { hours: 38.5, coins: 1150000, activeHosts: 14, giftsCount: 2900 },
    monthlyStats: { hours: 940, targetHours: 1000, revenue: 25400000, targetRevenue: 30000000, commissionEarned: 3810000, completionRate: 84.6 },
    financialMetrics: { withdrawableBalance: 2450000, totalWithdrawn: 9800000, avgHostHours: 4.3, qualityScore: '97.5% (ممتاز ⭐)' }
  },
  {
    id: 'AG-202',
    name: 'وكالة درة الكابتن والبث المباشر',
    managerId: 'MGR-9902',
    delegateId: 'DEL-501',
    invitedBy: 'مندوب 1: ياسر المنصوري (DEL-501)',
    owner: 'طارق الزهراني (الوكيل الرسمي)',
    ownerId: '1001022',
    ownerPrimaryId: 1001022,
    phone: '+966509988772',
    coins: 8900000,
    commission: 14.0,
    brokersCount: 1,
    hosts: 24,
    hours: 810,
    target: 20000000,
    achievedTarget: 18200000,
    status: 'نشطة',
    todayStats: { hours: 31.0, coins: 890000, activeHosts: 11, giftsCount: 1950 },
    monthlyStats: { hours: 810, targetHours: 900, revenue: 18200000, targetRevenue: 20000000, commissionEarned: 2548000, completionRate: 91.0 },
    financialMetrics: { withdrawableBalance: 1850000, totalWithdrawn: 7200000, avgHostHours: 4.1, qualityScore: '96.0% (جيد جداً)' }
  },
  {
    id: 'AG-203',
    name: 'وكالة صقور الكابتن الذهبية',
    managerId: 'MGR-9902',
    delegateId: 'DEL-502',
    invitedBy: 'مندوب 2: حاتم الحكيمي (DEL-502)',
    owner: 'عادل السعيدي (الوكيل الرسمي)',
    ownerId: '1001023',
    ownerPrimaryId: 1001023,
    phone: '+967771234568',
    coins: 9500000,
    commission: 13.5,
    brokersCount: 2,
    hosts: 28,
    hours: 860,
    target: 25000000,
    achievedTarget: 22100000,
    status: 'نشطة',
    todayStats: { hours: 34.0, coins: 950000, activeHosts: 13, giftsCount: 2400 },
    monthlyStats: { hours: 860, targetHours: 950, revenue: 22100000, targetRevenue: 25000000, commissionEarned: 2983500, completionRate: 88.4 },
    financialMetrics: { withdrawableBalance: 2150000, totalWithdrawn: 8400000, avgHostHours: 4.2, qualityScore: '96.8% (ممتاز)' }
  },
  {
    id: 'AG-204',
    name: 'وكالة الأفق والصوتيات (إدارة الكابتن)',
    managerId: 'MGR-9902',
    delegateId: 'DEL-502',
    invitedBy: 'مندوب 2: حاتم الحكيمي (DEL-502)',
    owner: 'محمد الغامدي (الوكيل الرسمي)',
    ownerId: '1001024',
    ownerPrimaryId: 1001024,
    phone: '+966541239876',
    coins: 10200000,
    commission: 14.5,
    brokersCount: 1,
    hosts: 30,
    hours: 920,
    target: 28000000,
    achievedTarget: 24800000,
    status: 'نشطة',
    todayStats: { hours: 36.0, coins: 1020000, activeHosts: 15, giftsCount: 2600 },
    monthlyStats: { hours: 920, targetHours: 1000, revenue: 24800000, targetRevenue: 28000000, commissionEarned: 3596000, completionRate: 88.5 },
    financialMetrics: { withdrawableBalance: 2300000, totalWithdrawn: 9100000, avgHostHours: 4.4, qualityScore: '97.2% (ممتاز)' }
  }
];

// 4.1 وسطاء الوكالات الرسمية (Agency Brokers)
const INITIAL_AGENCY_BROKERS = [
  // وكالة النخبة الملكية (AG-101)
  {
    id: 'BRK-101-1',
    agencyId: 'AG-101',
    name: 'تركي الشمري',
    userId: '1001016',
    primaryUserId: 1001016,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
    hostsCount: 18,
    totalRevenue: 16500000,
    commissionRate: 4.0,
    earnedCoins: 660000,
    status: 'نشط',
    phone: '+966501112233',
    joinDate: '2025-11-12'
  },
  {
    id: 'BRK-101-2',
    agencyId: 'AG-101',
    name: 'عبدالله القحطاني',
    userId: '1001017',
    primaryUserId: 1001017,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60',
    hostsCount: 15,
    totalRevenue: 13200000,
    commissionRate: 3.5,
    earnedCoins: 462000,
    status: 'نشط',
    phone: '+966554443322',
    joinDate: '2025-12-01'
  },
  {
    id: 'BRK-101-3',
    agencyId: 'AG-101',
    name: 'بندر الغامدي',
    userId: '1001018',
    primaryUserId: 1001018,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
    hostsCount: 10,
    totalRevenue: 8700000,
    commissionRate: 3.5,
    earnedCoins: 304500,
    status: 'نشط',
    phone: '+966567778899',
    joinDate: '2026-01-10'
  },
  // وكالة صدى الخليج (AG-102)
  {
    id: 'BRK-102-1',
    agencyId: 'AG-102',
    name: 'سالم العتيبي',
    userId: '1001019',
    primaryUserId: 1001019,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
    hostsCount: 20,
    totalRevenue: 15400000,
    commissionRate: 3.8,
    earnedCoins: 585200,
    status: 'نشط',
    phone: '+966542221100',
    joinDate: '2025-10-15'
  },
  {
    id: 'BRK-102-2',
    agencyId: 'AG-102',
    name: 'حمد الهاجري',
    userId: '1001020',
    primaryUserId: 1001020,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60',
    hostsCount: 11,
    totalRevenue: 9800000,
    commissionRate: 3.5,
    earnedCoins: 343000,
    status: 'نشط',
    phone: '+96599112233',
    joinDate: '2025-12-20'
  },
  // وكالة الأهرام (AG-103)
  {
    id: 'BRK-103-1',
    agencyId: 'AG-103',
    name: 'أحمد صبري',
    userId: '1001021',
    primaryUserId: 1001021,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=60',
    hostsCount: 16,
    totalRevenue: 12100000,
    commissionRate: 3.0,
    earnedCoins: 363000,
    status: 'نشط',
    phone: '+201012345678',
    joinDate: '2025-11-01'
  }
];

// 4.2 مضيفين الوكالات الرسمية (Agency Hosts)
const INITIAL_AGENCY_HOSTS = [
  // مضيفين وكالة النخبة الملكية (AG-101)
  {
    id: 'HOST-101-01',
    agencyId: 'AG-101',
    brokerId: 'BRK-101-1',
    brokerName: 'تركي الشمري',
    name: 'سارة الرياض',
    userId: '1001022',
    primaryUserId: 1001022,
    phone: '+966542190831',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
    hoursAchieved: 145,
    monthlyRevenue: 3400000,
    monthlyTarget: 3000000,
    liveStatus: 'مباشر الآن 🔴',
    status: 'نشط',
    category: 'غناء وموسيقى',
    joinDate: '2026-01-05'
  },
  {
    id: 'HOST-101-02',
    agencyId: 'AG-101',
    brokerId: 'BRK-101-1',
    brokerName: 'تركي الشمري',
    name: 'صوت البادية',
    userId: '1001023',
    primaryUserId: 1001023,
    phone: '+966553109482',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
    hoursAchieved: 128,
    monthlyRevenue: 2800000,
    monthlyTarget: 2500000,
    liveStatus: 'غير متصل',
    status: 'نشط',
    category: 'شعر وخواطر',
    joinDate: '2026-01-12'
  },
  {
    id: 'HOST-101-03',
    agencyId: 'AG-101',
    brokerId: 'BRK-101-1',
    brokerName: 'تركي الشمري',
    name: 'كروان النخبة',
    userId: '1001024',
    primaryUserId: 1001024,
    phone: '+966562847190',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=60',
    hoursAchieved: 135,
    monthlyRevenue: 3100000,
    monthlyTarget: 2800000,
    liveStatus: 'مباشر الآن 🔴',
    status: 'نشط',
    category: 'حوارات صوتية',
    joinDate: '2026-01-18'
  },
  {
    id: 'HOST-101-04',
    agencyId: 'AG-101',
    brokerId: 'BRK-101-2',
    brokerName: 'عبدالله القحطاني',
    name: 'ليالي نجد',
    userId: '1001025',
    primaryUserId: 1001025,
    phone: '+966502847193',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60',
    hoursAchieved: 110,
    monthlyRevenue: 2100000,
    monthlyTarget: 2000000,
    liveStatus: 'غير متصل',
    status: 'نشط',
    category: 'مسابقات وترفيه',
    joinDate: '2026-01-22'
  },
  {
    id: 'HOST-101-05',
    agencyId: 'AG-101',
    brokerId: 'BRK-101-2',
    brokerName: 'عبدالله القحطاني',
    name: 'صقر الجزيرة',
    userId: '1001026',
    primaryUserId: 1001026,
    phone: '+966551850392',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60',
    hoursAchieved: 98,
    monthlyRevenue: 1950000,
    monthlyTarget: 2000000,
    liveStatus: 'مباشر الآن 🔴',
    status: 'نشط',
    category: 'ألعاب وPK',
    joinDate: '2026-02-01'
  },
  {
    id: 'HOST-101-06',
    agencyId: 'AG-101',
    brokerId: 'BRK-101-3',
    brokerName: 'بندر الغامدي',
    name: 'أميرة الصمت',
    userId: '1001027',
    primaryUserId: 1001027,
    phone: '+966544910283',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=60',
    hoursAchieved: 130,
    monthlyRevenue: 2650000,
    monthlyTarget: 2500000,
    liveStatus: 'غير متصل',
    status: 'نشط',
    category: 'بودكاست',
    joinDate: '2026-01-28'
  },
  {
    id: 'HOST-101-07',
    agencyId: 'AG-101',
    brokerId: 'BRK-101-3',
    brokerName: 'بندر الغامدي',
    name: 'نسيم الجنوب',
    userId: '1001028',
    primaryUserId: 1001028,
    phone: '+966564109281',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=60',
    hoursAchieved: 85,
    monthlyRevenue: 1400000,
    monthlyTarget: 1500000,
    liveStatus: 'مباشر الآن 🔴',
    status: 'نشط',
    category: 'عزف عود',
    joinDate: '2026-02-10'
  },
  {
    id: 'HOST-101-08',
    agencyId: 'AG-101',
    brokerId: null,
    brokerName: 'مباشر مع الوكالة',
    name: 'أوتار الشرق',
    userId: '1001029',
    primaryUserId: 1001029,
    phone: '+966503859102',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=60',
    hoursAchieved: 155,
    monthlyRevenue: 4100000,
    monthlyTarget: 3500000,
    liveStatus: 'مباشر الآن 🔴',
    status: 'نشط',
    category: 'طرب وفن',
    joinDate: '2025-12-10'
  },
  {
    id: 'HOST-101-09',
    agencyId: 'AG-101',
    brokerId: null,
    brokerName: 'مباشر مع الوكالة',
    name: 'ورد الجوري',
    userId: '1001030',
    primaryUserId: 1001030,
    phone: '+966555019284',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&auto=format&fit=crop&q=60',
    hoursAchieved: 140,
    monthlyRevenue: 3200000,
    monthlyTarget: 3000000,
    liveStatus: 'غير متصل',
    status: 'نشط',
    category: 'تفاعل وترفيه',
    joinDate: '2026-01-02'
  },
  // مضيفين وكالة صدى الخليج (AG-102)
  {
    id: 'HOST-102-01',
    agencyId: 'AG-102',
    brokerId: 'BRK-102-1',
    brokerName: 'سالم العتيبي',
    name: 'فارس الظلام',
    userId: '1001031',
    primaryUserId: 1001031,
    phone: '+966542910482',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
    hoursAchieved: 120,
    monthlyRevenue: 2900000,
    monthlyTarget: 2600000,
    liveStatus: 'مباشر الآن 🔴',
    status: 'نشط',
    category: 'ألعاب وPK',
    joinDate: '2025-11-20'
  },
  {
    id: 'HOST-102-02',
    agencyId: 'AG-102',
    brokerId: 'BRK-102-2',
    brokerName: 'حمد الهاجري',
    name: 'دانة الخليج',
    userId: '1001032',
    primaryUserId: 1001032,
    phone: '+965993948192',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
    hoursAchieved: 115,
    monthlyRevenue: 2400000,
    monthlyTarget: 2200000,
    liveStatus: 'غير متصل',
    status: 'نشط',
    category: 'شعر وأدب',
    joinDate: '2025-12-25'
  }
];

// 5. طلبات الوكالات الفرعية (انضمام، إنشاء، خروج)
const INITIAL_AGENCY_REQUESTS = [
  {
    id: 'REQ-12',
    type: 'طلب انضمام مضيف لوكالة',
    host: 'ريم البوادي (#1001033)',
    agency: 'وكالة النخبة الملكية (AG-101)',
    date: 'اليوم 11:30 ص',
    status: 'بانتظار الموافقة'
  },
  {
    id: 'REQ-13',
    type: 'طلب خروج مضيف من وكالة',
    host: 'سلطان القحطاني (#1001005)',
    agency: 'وكالة صدى الخليج (AG-102)',
    date: 'أمس 04:15 م',
    status: 'قيد المراجعة الإدارية'
  },
  {
    id: 'REQ-14',
    type: 'طلب إنشاء وكالة استضافة',
    host: 'كابتن ماجد (#1001034)',
    agency: 'وكالة الأبطال الصاعدة',
    date: 'منذ يومين',
    status: 'تم القبول'
  }
];

// 6. وكالات الشحن الرسمية (Recharge Agencies)
const INITIAL_RECHARGE_AGENTS = [
  {
    id: 'REC-01',
    name: 'مؤسسة الدانة للمدفوعات الرقمية (السعودية)',
    agent: 'أبو فهد الشمري',
    phone: '+966551234567',
    coinsBalance: 120000000,
    totalSales: 480000000,
    discountRate: 6.5,
    status: 'معتمد'
  },
  {
    id: 'REC-02',
    name: 'مركز الروابي للصرافة والشحن (الإمارات)',
    agent: 'خالد المنصوري',
    phone: '+971508889999',
    coinsBalance: 85000000,
    totalSales: 310000000,
    discountRate: 6.0,
    status: 'معتمد'
  },
  {
    id: 'REC-03',
    name: 'وكيل فودافون كاش وبطاقات غلا (مصر)',
    agent: 'إسلام عزت',
    phone: '+201099887766',
    coinsBalance: 45000000,
    totalSales: 195000000,
    discountRate: 5.0,
    status: 'معتمد'
  }
];

// 7. إدارة الهدايا: إطار ودخول، إهداء خلفية غرفة
const INITIAL_FRAMES_ENTRIES = [
  {
    id: 'FR-01',
    name: 'إطار التنين الذهبي الناري المجنح',
    category: 'إطار صورة شخصية',
    preview: '🐲✨',
    price: 850000,
    validity: '30 يوم',
    sales: 142
  },
  {
    id: 'EN-01',
    name: 'دخولية سيارة رولز رويس فانتوم الملكية',
    category: 'تأثير دخول الغرفة',
    preview: '🚘👑',
    price: 3500000,
    validity: '30 يوم',
    sales: 89
  },
  {
    id: 'BG-01',
    name: 'خلفية قصر الأساطير الأندلسي الفاخر (3D)',
    category: 'خلفية غرفة صوتية',
    preview: '🏰🌙',
    price: 2200000,
    validity: 'دائم للغرفة',
    sales: 64
  }
];

// 8. مستويات المستخدمين وتقارير الإهداء
const INITIAL_LEVELS = [
  { level: 10, title: 'مبتدئ واعد', exp: '100,000 EXP', badge: '🥉 برونزي', dailyBonus: '5,000 كوينز' },
  { level: 30, title: 'نجم صاعد', exp: '1,500,000 EXP', badge: '🥈 فضي', dailyBonus: '25,000 كوينز' },
  { level: 50, title: 'أسطورة الساحة', exp: '8,000,000 EXP', badge: '🥇 ذهبي', dailyBonus: '100,000 كوينز' },
  { level: 75, title: 'أمير الرومات', exp: '25,000,000 EXP', badge: '💎 بلاتيني', dailyBonus: '350,000 كوينز' },
  { level: 100, title: 'القيصر الملكي الخالد', exp: '100,000,000 EXP', badge: '👑 ماسي أسطوري', dailyBonus: '1,000,000 كوينز' }
];

const INITIAL_LEVEL_GIFT_REPORTS = [
  { id: 'LGR-901', sender: 'الملك سلطان (#1001001)', receiver: 'الأميرة ديانا (#1001002)', giftLevel: '+5 مستويات', coins: 2500000, date: 'اليوم 01:14 م' },
  { id: 'LGR-902', sender: 'مشعل العتيبي (#1001006)', receiver: 'ريم البوادي (#1001033)', giftLevel: '+10 مستويات', coins: 6000000, date: 'أمس 09:40 م' }
];

// 9. القلادات، صناديق الحظ، وصناديق الغرف
const INITIAL_LUCKY_BOXES = [
  { id: 'BX-01', title: 'صندوق الحظ السوبر الألماسي', type: 'صندوق حظ مستخدم', cost: 10000, topPrize: 'سيارة لامبورغيني (30 يوم) + 1M كوينز', dropRate: '2.5%' },
  { id: 'BX-02', title: 'صندوق كنز الغرفة التفاعلي', type: 'صندوق رمي بالروم', cost: 50000, topPrize: 'مطر كوينزات 500,000 لجميع الحضور', dropRate: '100%' },
  { id: 'NC-01', title: 'قلادة قلب المحيط الفيروزية', type: 'قلادة شرفية', cost: 1200000, topPrize: 'بريق الاسم في الشات + إطار خاص', dropRate: 'مشتراة' }
];

// 10. الشكاوى والحظر
const INITIAL_COMPLAINTS = [
  { id: 'CMP-88', reporter: 'كابتن ماجد (#1001034)', target: 'سلطان القحطاني (#1001005)', reason: 'إزعاج صوتي متكرر بالروم العام', date: 'منذ ساعة', status: 'قيد التحقيق' },
  { id: 'CMP-89', reporter: 'الأميرة ديانا (#1001002)', target: 'مستخدم قياسي (#1001035)', reason: 'استخدام صورة غير لائقة ورسائل مزعجة', date: 'منذ 3 ساعات', status: 'تم حظر الحساب' }
];

// 11. إعدادات النظام (البنارات، التحديثات، الدول، الرسائل الرسمية، شريط التمرير)
const INITIAL_SETTINGS = {
  banners: [
    { id: 1, title: 'كرنفال رمضان وجوائز المليون كوينز', link: 'غرفة الفعاليات 100', active: true },
    { id: 2, title: 'بطولة الـ PK الشهرية الكبرى بين العائلات', link: 'شاشة PK', active: true }
  ],
  updates: {
    appVersion: 'v5.2.0',
    mandatoryUpdate: true,
    apkUrl: 'https://gala.live/download/gala-latest.apk',
    releaseNotes: 'إضافة متجر VIP الجديد، تحسين جودة الصوت فائق الوضوح، ودعم صناديق الغرف.'
  },
  countries: ['المملكة العربية السعودية', 'الإمارات العربية المتحدة', 'الكويت', 'مصر', 'سلطنة عمان', 'قطر', 'البحرين', 'العراق', 'الأردن'],
  marqueeTicker: 'مرحباً بكم في تطبيق سوبر ليجند - غلا لايف شات! انضموا لبطولة الـ PK الليلة الساعة 9 مساءً للحصول على جوائز أسطورية 🏆',
  officialBroadcasts: [
    { id: 1, title: 'تهنئة الفائزين بترتيب الهدايا الأسبوعي', date: '2026-09-01', audience: 'الكل' },
    { id: 2, title: 'تنبيه أمني بخصوص حماية الحسابات وكلمات المرور', date: '2026-08-28', audience: 'الكل' }
  ]
};

// 12. Pks وترتيب الفائزين والأوسمة والارستقراطية
const INITIAL_MONTHLY_WINNERS = [
  { rank: 1, name: 'الملك سلطان الفاتح', id: '1001001', score: '184,200,000 نقطة', reward: 'وسام القيصر + 10M كوينز' },
  { rank: 2, name: 'مشعل العتيبي', id: '1001006', score: '142,500,000 نقطة', reward: 'وسام الفاتح + 5M كوينز' },
  { rank: 3, name: 'الأميرة ديانا', id: '1001002', score: '98,000,000 نقطة', reward: 'وسام المجد + 2.5M كوينز' }
];

const INITIAL_ARISTOCRACY = [
  { title: 'الفارس (Knight)', price: '500,000 كوينز / شهر', badge: '⚔️', perks: 'إطار فارس، دخولية خيل، وتوهج الاسم' },
  { title: 'الفيكونت (Viscount)', price: '1,500,000 كوينز / شهر', badge: '🛡️', perks: 'دخولية عربة مدرعة، عدم الطرد من الرومات' },
  { title: 'الكونت (Count)', price: '4,000,000 كوينز / شهر', badge: '🦅', perks: 'شارة خاصة، مايك دائم، وإهداءات مخفضة' },
  { title: 'الدوق (Duke)', price: '8,000,000 كوينز / شهر', badge: '🦁', perks: 'دخولية طائرة هليكوبتر، إرسال رسائل عامة' },
  { title: 'الأمير الملكي (Prince)', price: '15,000,000 كوينز / شهر', badge: '👑', perks: 'حماية كاملة من الحظر بالغرف، صدى صوت خاص' },
  { title: 'الملك الإمبراطور (King)', price: '30,000,000 كوينز / شهر', badge: '⚜️', perks: 'رمز العرش الذهبي، قصر مخصص، وصلاحيات ملكية' }
];

// 13. سجل العمليات الإدارية (Audit Logs)
const INITIAL_LOGS = [
  { id: 'LOG-7721', user: 'superadmin (naz)', action: 'UPDATE_VIP_PRICE', target: 'VIP5 price set to 12,000,000', time: 'منذ 10 دقائق' },
  { id: 'LOG-7720', user: 'superadmin (naz)', action: 'USER_RECHARGE', target: 'Charged 5,000,000 coins to #1001001', time: 'منذ 34 دقيقة' },
  { id: 'LOG-7719', user: 'superadmin (naz)', action: 'AGENCY_APPROVE', target: 'Approved Agency AG-101', time: 'اليوم 09:20 ص' },
  { id: 'LOG-7718', user: 'superadmin (naz)', action: 'APPLY_BAN', target: 'Banned Device UUID for #1001035', time: 'أمس 11:45 م' }
];

// 14. طاقم الإدارة والصلاحيات (Admin Staff & RBAC)
const INITIAL_ADMIN_STAFF = [
  { id: 'ADM-01', name: 'مجدي (Megdy)', role: 'مالك التطبيق (Owner)', username: 'megdy_owner', permissions: 'جميع الصلاحيات المطلقة', status: 'نشط', lastActive: 'الآن' },
  { id: 'ADM-02', name: 'سوبر أدمن (Naz)', role: 'مدير العمليات العام', username: 'superadmin', permissions: 'إدارة شاملة، الشحن، الحظر، الوكالات', status: 'نشط', lastActive: 'منذ دقيقة' },
  { id: 'ADM-03', name: 'أبو أمجد (المالي)', role: 'المشرف المالي والشحن', username: 'finance_abu_amjed', permissions: 'شحن الحسابات، بونص الوكلاء، الرواتب', status: 'نشط', lastActive: 'منذ 15 دقيقة' },
  { id: 'ADM-04', name: 'الكابتن رعد (الأمني)', role: 'مدير الرقابة ومكافحة الاحتيال', username: 'security_raad', permissions: 'الحظر الشامل، مراقبة الغرف، الشكاوى', status: 'نشط', lastActive: 'منذ ساعة' }
];

// 15. الحظر الأمني الشامل للأجهزة والـ IP (Security Device & IP Bans)
const INITIAL_SECURITY_BANS = [
  { id: 'BAN-101', target: 'معرف جهاز: dev_uuid_89f3a', type: 'حظر جهاز (UUID)', reason: 'محاولة استغلال ثغرة شحن غير مصرح بها', bannedBy: 'الكابتن رعد', date: '2026-03-01', status: 'ساري ومفعل' },
  { id: 'BAN-102', target: 'عنوان IP: 185.190.22.41', type: 'حظر شبكة IP', reason: 'هجوم سبام وبوتات مزيفة', bannedBy: 'سوبر أدمن', date: '2026-02-28', status: 'ساري ومفعل' },
  { id: 'BAN-103', target: 'حساب المستخدم: #3730214', type: 'حظر حساب نهائي', reason: 'سلوك مسيء متكرر في الغرف الصوتية', bannedBy: 'أبو أمجد', date: '2026-02-25', status: 'ساري ومفعل' }
];

// 16. باقات متجر الكوينزات (Coins Packages)
const INITIAL_COIN_PACKAGES = [
  { id: 'PKG-1', coins: 500000, priceUsd: 49.99, badge: 'باقة المبتدئين', bonus: '+5% مجاناً', active: true },
  { id: 'PKG-2', coins: 1500000, priceUsd: 139.99, badge: 'الأكثر طلباً 🔥', bonus: '+10% مجاناً', active: true },
  { id: 'PKG-3', coins: 5000000, priceUsd: 449.99, badge: 'الباقة الملكية 👑', bonus: '+20% مجاناً', active: true },
  { id: 'PKG-4', coins: 12000000, priceUsd: 999.99, badge: 'باقة الأساطير ⚡', bonus: '+35% مجاناً', active: true }
];

// 17. النسخ الاحتياطي لقاعدة البيانات والسيرفر
const INITIAL_DATABASE_BACKUPS = [
  { id: 'BCK-20260307-AUTO', title: 'نسخة احتياطية سحابية تلقائية (شاملة)', size: '48.2 MB', records: '14,280 سجل', date: '2026-03-07 04:00 ص', status: 'مكتملة وناجحة' },
  { id: 'BCK-20260306-MANUAL', title: 'نسخة ما قبل ترقية نظام الوكالات التراكمي', size: '47.8 MB', records: '14,195 سجل', date: '2026-03-06 18:30 م', status: 'مكتملة ومؤمنة' },
  { id: 'BCK-20260301-MONTHLY', title: 'نسخة الإقفال المالي الشهري', size: '45.1 MB', records: '13,850 سجل', date: '2026-03-01 00:01 ص', status: 'مؤرشفة سحابياً' }
];

// Attach all to global window for foolproof access across scopes
if (typeof window !== 'undefined') {
  window.INITIAL_AGENCY_MANAGERS = INITIAL_AGENCY_MANAGERS;
  window.INITIAL_AGENCY_DELEGATES = INITIAL_AGENCY_DELEGATES;
  window.INITIAL_VIPS = INITIAL_VIPS;
  window.INITIAL_USERS = INITIAL_USERS;
  window.INITIAL_GALA_REQUESTS = INITIAL_GALA_REQUESTS;
  window.INITIAL_AGENCIES = INITIAL_AGENCIES;
  window.INITIAL_AGENCY_BROKERS = INITIAL_AGENCY_BROKERS;
  window.INITIAL_AGENCY_HOSTS = INITIAL_AGENCY_HOSTS;
  window.INITIAL_AGENCY_REQUESTS = INITIAL_AGENCY_REQUESTS;
  window.INITIAL_RECHARGE_AGENTS = INITIAL_RECHARGE_AGENTS;
  window.INITIAL_FRAMES_ENTRIES = INITIAL_FRAMES_ENTRIES;
  window.INITIAL_LEVELS = INITIAL_LEVELS;
  window.INITIAL_LEVEL_GIFT_REPORTS = INITIAL_LEVEL_GIFT_REPORTS;
  window.INITIAL_LUCKY_BOXES = INITIAL_LUCKY_BOXES;
  window.INITIAL_COMPLAINTS = INITIAL_COMPLAINTS;
  window.INITIAL_SETTINGS = INITIAL_SETTINGS;
  window.INITIAL_MONTHLY_WINNERS = INITIAL_MONTHLY_WINNERS;
  window.INITIAL_ARISTOCRACY = INITIAL_ARISTOCRACY;
  window.INITIAL_LOGS = INITIAL_LOGS;
  window.INITIAL_ADMIN_STAFF = INITIAL_ADMIN_STAFF;
  window.INITIAL_SECURITY_BANS = INITIAL_SECURITY_BANS;
  window.INITIAL_COIN_PACKAGES = INITIAL_COIN_PACKAGES;
  window.INITIAL_DATABASE_BACKUPS = INITIAL_DATABASE_BACKUPS;
  window.SECTION_CONFIG = typeof SECTION_CONFIG !== 'undefined' ? SECTION_CONFIG : {};
}

