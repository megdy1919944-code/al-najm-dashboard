// =========================================================================
// ADMIN ROOMS & LIVE STUDIO MODERATION MODULE
// نظام إدارة الغرف الصوتية والمراقبة الحية (تحكم المقاعد الـ 20 والمخالفات)
// =========================================================================

(function() {
  'use strict';

  const STORAGE_KEY_ROOMS = 'al_najm_admin_active_rooms_v1';

  // Initial Rooms seeded from actual app catalog
  const DEFAULT_ADMIN_ROOMS = [
    {
      id: 'room-1',
      title: 'وكالة شحن سوريا ألمانيا',
      host: 'وكالة شحن سوريا ألمانيا',
      hostUserId: '100291',
      agencyName: 'وكالة النجم للشحن المعتمد',
      listenersCount: 24,
      countryName: 'سوريا',
      countryCode: 'SY',
      flag: '🇸🇾',
      status: 'active', // active | warned | closed
      isLocked: false,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      notice: 'أهلاً وسهلاً بكم في روم وكالة الشحن المعتمدة - التزام بقوانين الروم 🌹',
      seats: generateInitialSeats([
        { id: 1, name: 'وكالة شحن سوريا', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', isMuted: false, isHost: true },
        { id: 2, name: 'أحمد السوري', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200', isMuted: false },
        { id: 3, name: 'سارة دمشق', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', isMuted: false },
        { id: 4, name: 'أبو فهد', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200', isMuted: true },
        { id: 5, name: 'فارغ', isLocked: true },
        { id: 6, name: 'نجم حلب', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', isMuted: false },
        { id: 7, name: 'فارغ', isLocked: false },
        { id: 8, name: 'لانا الكردي', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200', isMuted: false }
      ]),
      chat: [
        { id: 'm1', user: 'أحمد السوري', text: 'مساء الورد جميعاً 🌹', time: '18:40', isSystem: false },
        { id: 'm2', user: 'نظام الروم', text: 'انضم أبو فهد إلى الغرفة 👏', time: '18:41', isSystem: true },
        { id: 'm3', user: 'سارة دمشق', text: 'أهلاً وسهلاً بالجميع منورين الروم', time: '18:42', isSystem: false }
      ],
      audience: [
        { userId: '100291', name: 'وكالة شحن سوريا', vip: 8, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
        { userId: '204918', name: 'أحمد السوري', vip: 4, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' },
        { userId: '304912', name: 'سارة دمشق', vip: 3, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
        { userId: '409182', name: 'أبو فهد', vip: 6, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200' },
        { userId: '501928', name: 'ماجد الشام', vip: 1, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
        { userId: '601923', name: 'نور الهدى', vip: 2, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' }
      ]
    },
    {
      id: 'room-2',
      title: 'وكآلة آلأيهم MOE',
      host: 'وكآلة آلأيهم MOE',
      hostUserId: '100344',
      agencyName: 'وكالة آلأيهم للإنتاج والبث',
      listenersCount: 73,
      countryName: 'مصر',
      countryCode: 'EG',
      flag: '🇪🇬',
      status: 'active',
      isLocked: false,
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=400',
      notice: 'مسابقات وفقرات غنائية يومية وسحوبات كوينز مباشرة 🎁',
      seats: generateInitialSeats([
        { id: 1, name: 'آلأيهم MOE', avatar: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=200', isMuted: false, isHost: true },
        { id: 2, name: 'كريم الملك', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', isMuted: false },
        { id: 3, name: 'مريم القلوب', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', isMuted: false },
        { id: 4, name: 'فارغ', isLocked: false },
        { id: 5, name: 'حسام المصري', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200', isMuted: false }
      ]),
      chat: [
        { id: 'm10', user: 'كريم الملك', text: 'يلا شباب نجهز للـ PK القادم 🔥', time: '18:30', isSystem: false },
        { id: 'm11', user: 'آلأيهم MOE', text: 'حي الله كل الحضور الكرام', time: '18:32', isSystem: false }
      ],
      audience: [
        { userId: '100344', name: 'آلأيهم MOE', vip: 9, avatar: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=200' },
        { userId: '209384', name: 'كريم الملك', vip: 5, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
        { userId: '394829', name: 'مريم القلوب', vip: 4, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' }
      ]
    },
    {
      id: 'room-3',
      title: 'Ludo ابدأ الآن 🎲',
      host: 'لعبة لودو التنافسية',
      hostUserId: '100588',
      agencyName: 'وكالة الألعاب الترفيهية',
      listenersCount: 184,
      countryName: 'مصر',
      countryCode: 'EG',
      flag: '🇪🇬',
      status: 'active',
      isLocked: false,
      image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=400',
      notice: 'روم رسمي لبطولة اللودو - يمنع استخدام الألفاظ الخارجة 🎲',
      seats: generateInitialSeats([
        { id: 1, name: 'حكم البطولة', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', isMuted: false, isHost: true },
        { id: 2, name: 'اللاعب 1 (الأحمر)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200', isMuted: false },
        { id: 3, name: 'اللاعب 2 (الأخضر)', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200', isMuted: false },
        { id: 4, name: 'اللاعب 3 (الأصفر)', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200', isMuted: false },
        { id: 5, name: 'اللاعب 4 (الأزرق)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', isMuted: false }
      ]),
      chat: [
        { id: 'm20', user: 'حكم البطولة', text: 'الجولة ستبدأ خلال 30 ثانية ⏱️', time: '18:45', isSystem: true }
      ],
      audience: [
        { userId: '100588', name: 'حكم البطولة', vip: 7, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' }
      ]
    },
    {
      id: 'room-4',
      title: 'ما وراء الطبيعة 🔮',
      host: 'روم ما وراء الطبيعة 100700',
      hostUserId: '100700',
      agencyName: 'وكالة فرسان النجم',
      listenersCount: 72,
      countryName: 'مصر',
      countryCode: 'EG',
      flag: '🇪🇬',
      status: 'active',
      isLocked: false,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
      notice: 'قصص وروايات ومواضيع غامضة مع رواد الروم 🌌',
      seats: generateInitialSeats([
        { id: 1, name: 'الراوي الفلكي', avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=200', isMuted: false, isHost: true }
      ]),
      chat: [],
      audience: []
    },
    {
      id: 'room-5',
      title: 'سَنُقْرِئُكَ فَلَا تَنَسَىٰ...',
      host: 'وكالة الجابري',
      hostUserId: '100911',
      agencyName: 'وكالة الجابري المعتمدة',
      listenersCount: 42,
      countryName: 'الإمارات',
      countryCode: 'AE',
      flag: '🇦🇪',
      status: 'active',
      isLocked: false,
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=400',
      notice: 'روم للذكر والتلاوة والخواطر الإيمانية الهادئة 🕊️',
      seats: generateInitialSeats([
        { id: 1, name: 'وكالة الجابري', avatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=200', isMuted: false, isHost: true }
      ]),
      chat: [],
      audience: []
    },
    {
      id: 'room-6',
      title: 'وكاله ZEUS لتسجيل المضيفين ⚡',
      host: 'وكالة زيوس ZEUS',
      hostUserId: '100999',
      agencyName: 'وكالة ZEUS الدولية',
      listenersCount: 156,
      countryName: 'السعودية',
      countryCode: 'SA',
      flag: '🇸🇦',
      status: 'active',
      isLocked: false,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      notice: 'تجارب أداء واستقبال مضيفين ومذيعين جدد برواتب وحوافز فورية ⚡',
      seats: generateInitialSeats([
        { id: 1, name: 'زيوس ZEUS', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', isMuted: false, isHost: true },
        { id: 2, name: 'فهد الإدارة', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', isMuted: false },
        { id: 3, name: 'ميار الرياض', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', isMuted: false },
        { id: 4, name: 'متقدم جديد 1', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200', isMuted: true }
      ]),
      chat: [],
      audience: []
    }
  ];

  // Helper to generate 20 seats standard for Al-Najm voice room
  function generateInitialSeats(overrides) {
    const seats = [];
    for (let i = 1; i <= 20; i++) {
      const found = overrides ? overrides.find(o => o.id === i) : null;
      if (found) {
        seats.push({
          id: i,
          name: found.name || 'فارغ',
          avatar: found.avatar || null,
          isMuted: !!found.isMuted,
          isLocked: !!found.isLocked,
          isHost: !!found.isHost
        });
      } else {
        seats.push({
          id: i,
          name: 'فارغ',
          avatar: null,
          isMuted: false,
          isLocked: false,
          isHost: (i === 1)
        });
      }
    }
    return seats;
  }

  // Support & Charm Stats Calculator for Room
  function getRoomSupportStats(room) {
    if (!room) return { coins: 0, diamonds: 0, charm: 0, charmLevel: 1, topSupporter: { name: 'لا يوجد', amount: '0' }, dailyRank: 1 };
    const numId = parseInt(String(room.id).replace(/\D/g, '')) || 1;
    const coins = room.totalSupportCoins || (Math.max(1, room.listenersCount || 10) * 14500 + numId * 260000);
    const diamonds = room.totalSupportDiamonds || Math.round(coins * 0.5);
    const charm = room.charmPoints || Math.round(coins * 0.45);
    const charmLevel = room.charmLevel || Math.min(99, Math.floor(charm / 14000) + 20);
    const topSupporter = room.topSupporter || {
      name: (room.audience && room.audience[0] && room.audience[0].name) || 'سلطان الغرام 👑',
      amount: (Math.round(coins * 0.32)).toLocaleString() + ' 🪙',
      avatar: (room.audience && room.audience[0] && room.audience[0].avatar) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    };
    const dailyRank = room.dailyRank || numId;
    return { coins, diamonds, charm, charmLevel, topSupporter, dailyRank };
  }

  // Local state getter/setter
  function getActiveRooms() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ROOMS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(DEFAULT_ADMIN_ROOMS));
    return DEFAULT_ADMIN_ROOMS;
  }

  function saveActiveRooms(rooms) {
    try {
      localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
    } catch (e) {}
  }

  // Active filter state
  window._roomsFilter = {
    search: '',
    status: 'all',
    country: 'all'
  };

  // =========================================================================
  // MAIN VIEW RENDERER: renderRoomsManagementView
  // =========================================================================
  window.renderRoomsManagementView = function(container) {
    if (!container) return;

    const allRooms = getActiveRooms();
    const filter = window._roomsFilter;

    // Filter logic
    const filteredRooms = allRooms.filter(r => {
      if (filter.status !== 'all' && r.status !== filter.status) return false;
      if (filter.country !== 'all' && r.countryCode !== filter.country) return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchHost = r.host.toLowerCase().includes(q);
        const matchId = r.id.toLowerCase().includes(q) || (r.hostUserId && r.hostUserId.includes(q));
        const matchAgency = r.agencyName && r.agencyName.toLowerCase().includes(q);
        if (!matchTitle && !matchHost && !matchId && !matchAgency) return false;
      }
      return true;
    });

    const activeCount = allRooms.filter(r => r.status === 'active').length;
    const warnedCount = allRooms.filter(r => r.status === 'warned').length;
    const closedCount = allRooms.filter(r => r.status === 'closed').length;
    const totalListeners = allRooms.reduce((sum, r) => sum + (r.listenersCount || 0), 0);
    const totalGlobalSupport = allRooms.reduce((sum, r) => sum + getRoomSupportStats(r).coins, 0);

    const html = `
      <div class="space-y-6" dir="rtl">
        <!-- 1. HEADER & SUMMARY CARDS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Total Active Rooms -->
          <div class="p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-xs flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-slate-500">الغرف النشطة المفتوحة</div>
              <div class="text-2xl font-black text-slate-950 font-mono mt-1">${activeCount} <span class="text-xs text-emerald-700 font-bold">غرفة بث 🎙️</span></div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 text-xl shadow-2xs">
              <i data-lucide="radio" class="w-6 h-6 animate-pulse"></i>
            </div>
          </div>

          <!-- Total Support In Rooms (إجمالي دعم الرومات) -->
          <div class="p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-xs flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-amber-700">إجمالي دعم الغرف الكلي</div>
              <div class="text-xl font-black text-amber-950 font-mono mt-1">${totalGlobalSupport.toLocaleString()} <span class="text-xs text-amber-700 font-bold">🪙</span></div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700 text-xl shadow-2xs">
              <i data-lucide="coins" class="w-6 h-6"></i>
            </div>
          </div>

          <!-- Total Listeners -->
          <div class="p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-xs flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-slate-500">إجمالي الحضور اللحظي</div>
              <div class="text-2xl font-black text-slate-950 font-mono mt-1">${totalListeners.toLocaleString()} <span class="text-xs text-sky-700 font-bold">مستمع 👥</span></div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 text-xl shadow-2xs">
              <i data-lucide="users" class="w-6 h-6"></i>
            </div>
          </div>

          <!-- Warned Rooms -->
          <div class="p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-xs flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-slate-500">غرف تحت الإنذار</div>
              <div class="text-2xl font-black text-amber-950 font-mono mt-1">${warnedCount} <span class="text-xs text-amber-700 font-bold">إنذارات ⚠️</span></div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-xl shadow-2xs">
              <i data-lucide="alert-triangle" class="w-6 h-6"></i>
            </div>
          </div>

          <!-- Closed Rooms -->
          <div class="p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-xs flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-slate-500">غرف مغلقة إدارياً</div>
              <div class="text-2xl font-black text-rose-950 font-mono mt-1">${closedCount} <span class="text-xs text-rose-700 font-bold">موقوفة 🛑</span></div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 text-xl shadow-2xs">
              <i data-lucide="power" class="w-6 h-6"></i>
            </div>
          </div>
        </div>

        <!-- 2. CONTROLS BAR: SEARCH, FILTER & QUICK ACTIONS -->
        <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2 flex-1 max-w-md">
            <div class="relative w-full">
              <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"></i>
              <input 
                type="text" 
                id="roomsSearchInput" 
                value="${filter.search || ''}" 
                oninput="window.setRoomsSearch(this.value)"
                placeholder="بحث باسم الغرفة، المضيف، المعرف، أو الوكالة..." 
                class="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:bg-white focus:border-amber-500 outline-none transition" />
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <!-- Filter Status -->
            <select 
              id="roomsStatusFilter" 
              onchange="window.setRoomsFilterStatus(this.value)"
              class="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:bg-white outline-none cursor-pointer">
              <option value="all" ${filter.status === 'all' ? 'selected' : ''}>جميع الحالات (${allRooms.length})</option>
              <option value="active" ${filter.status === 'active' ? 'selected' : ''}>نشطة ومفتوحة 🟢</option>
              <option value="warned" ${filter.status === 'warned' ? 'selected' : ''}>عليها إنذار ⚠️</option>
              <option value="closed" ${filter.status === 'closed' ? 'selected' : ''}>مغلقة إدارياً 🔴</option>
            </select>

            <!-- Reset to Defaults -->
            <button 
              type="button" 
              onclick="window.resetRoomsToDefault()"
              class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              title="استعادة الغرف النشطة الافتراضية">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
              <span>استعادة الرومات</span>
            </button>
          </div>
        </div>

        <!-- 3. LIVE ROOMS TABLE -->
        <div class="bg-white rounded-3xl border-2 border-slate-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] overflow-hidden">
          <div class="p-4 sm:p-5 border-b-2 border-slate-300 bg-slate-50/70 flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-2.5">
              <span class="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-bold text-lg shadow-2xs">🎙️</span>
              <div>
                <h2 class="text-base font-black text-slate-950">قائمة الغرف الصوتية المباشرة والمراقبة الحية</h2>
                <p class="text-xs text-slate-600">يمكنك الدخول لأي غرفة لمراقبة المايكات الـ 20، كتم الأصوات، طرد المخالفين، أو إغلاق الروم</p>
              </div>
            </div>
            <div class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-black flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>رصد لحظي مباشر (20 Seats Engine)</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-right border-collapse">
              <thead>
                <tr class="bg-slate-100 text-slate-900 border-b-2 border-slate-300 text-xs font-black uppercase tracking-wider select-none">
                  <th class="py-3 px-4 border-l border-slate-200/80 text-center w-14">#</th>
                  <th class="py-3 px-4 border-l border-slate-200/80">الغرفة والبث</th>
                  <th class="py-3 px-4 border-l border-slate-200/80">المضيف والوكالة</th>
                  <th class="py-3 px-4 border-l border-slate-200/80 text-center">الدعم والجاذبية</th>
                  <th class="py-3 px-4 border-l border-slate-200/80 text-center">الحضور اللحظي</th>
                  <th class="py-3 px-4 border-l border-slate-200/80 text-center">المايكات (20)</th>
                  <th class="py-3 px-4 border-l border-slate-200/80 text-center">الحالة</th>
                  <th class="py-3 px-4 text-center">التحكم والإجراءات السريعة</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 text-xs font-medium">
                ${filteredRooms.length === 0 ? `
                  <tr>
                    <td colspan="8" class="py-12 text-center text-slate-500 font-bold">
                      <div class="text-3xl mb-2">🔍</div>
                      لا توجد غرف تطابق معايير البحث الحالية
                    </td>
                  </tr>
                ` : filteredRooms.map((room, idx) => {
                  const rowBg = idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-[#edf6f9]';
                  const occupiedSeats = (room.seats || []).filter(s => s.name && s.name !== 'فارغ').length;
                  const isClosed = room.status === 'closed';
                  const isWarned = room.status === 'warned';
                  const roomStats = getRoomSupportStats(room);

                  return `
                    <tr class="${rowBg} hover:bg-[#dff0f5] transition border-b border-slate-300">
                      <!-- Index -->
                      <td class="py-3 px-3 text-center border-l border-slate-200/80 font-mono text-slate-500 font-bold">
                        ${idx + 1}
                      </td>

                      <!-- Room Title & Image -->
                      <td class="py-3 px-4 border-l border-slate-200/80">
                        <div class="flex items-center gap-3">
                          <img 
                            src="${room.image}" 
                            class="w-12 h-12 rounded-2xl object-cover border-2 border-slate-300 shadow-2xs shrink-0" 
                            alt="${room.title}" />
                          <div class="min-w-0">
                            <div class="font-black text-slate-950 text-sm flex items-center gap-1.5 truncate">
                              <span>${room.title}</span>
                              ${room.isLocked ? '<span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-black">🔒 برمز</span>' : ''}
                            </div>
                            <div class="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                              <span>ID: ${room.id}</span>
                              <span>${room.flag || '🌍'} ${room.countryName || ''}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <!-- Host & Agency -->
                      <td class="py-3 px-4 border-l border-slate-200/80">
                        <div class="font-black text-slate-900 flex items-center gap-1.5">
                          <i data-lucide="crown" class="w-3.5 h-3.5 text-amber-600"></i>
                          <span>${room.host}</span>
                        </div>
                        <div class="text-[11px] text-slate-500 mt-0.5 truncate">
                          ${room.agencyName || 'مستقل'}
                        </div>
                      </td>

                      <!-- Support & Charm Stats Column (الدعم والجاذبية) -->
                      <td class="py-3 px-4 border-l border-slate-200/80 text-center whitespace-nowrap">
                        <div class="inline-flex flex-col items-center gap-1">
                          <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-950 font-black text-xs shadow-2xs" title="إجمالي كوينز الدعم داخل الروم">
                            <span>🪙</span>
                            <span class="font-mono">${roomStats.coins.toLocaleString()}</span>
                          </div>
                          <div class="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-900 font-mono" title="نقاط الجاذبية ومستوى الروم">
                            <span>✨ ${roomStats.charm.toLocaleString()}</span>
                            <span class="px-1.5 py-0.2 rounded-full bg-purple-100 border border-purple-300 text-purple-800 text-[10px] font-black">Lv.${roomStats.charmLevel}</span>
                          </div>
                        </div>
                      </td>

                      <!-- Listeners Count -->
                      <td class="py-3 px-4 border-l border-slate-200/80 text-center">
                        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-950 font-black text-xs">
                          <i data-lucide="users" class="w-3.5 h-3.5 text-sky-700"></i>
                          <span class="font-mono">${(room.listenersCount || 0).toLocaleString()}</span>
                        </div>
                      </td>

                      <!-- 20-Seats Gauge -->
                      <td class="py-3 px-4 border-l border-slate-200/80 text-center">
                        <div class="inline-flex flex-col items-center">
                          <span class="font-mono font-black text-slate-900 text-xs">${occupiedSeats} / 20 مقعد</span>
                          <div class="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1 border border-slate-300">
                            <div class="h-full bg-emerald-500 rounded-full" style="width: ${(occupiedSeats / 20) * 100}%"></div>
                          </div>
                        </div>
                      </td>

                      <!-- Status -->
                      <td class="py-3 px-4 border-l border-slate-200/80 text-center">
                        ${isClosed ? `
                          <span class="px-2.5 py-1 rounded-full bg-rose-100 text-rose-950 border border-rose-300 font-black text-[11px] inline-flex items-center gap-1">
                            <i data-lucide="power" class="w-3 h-3 text-rose-700"></i>
                            <span>مغلقة إدارياً</span>
                          </span>
                        ` : isWarned ? `
                          <span class="px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-black text-[11px] inline-flex items-center gap-1">
                            <i data-lucide="alert-triangle" class="w-3 h-3 text-amber-700"></i>
                            <span>تحت الإنذار</span>
                          </span>
                        ` : `
                          <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-black text-[11px] inline-flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            <span>نشطة ومباشرة</span>
                          </span>
                        `}
                      </td>

                      <!-- Quick Actions -->
                      <td class="py-3 px-4 text-center">
                        <div class="flex items-center justify-center gap-1.5 flex-wrap">
                          <!-- Enter Live Studio -->
                          <button 
                            type="button" 
                            onclick="window.openLiveRoomStudio('${room.id}')"
                            class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5">
                            <i data-lucide="headphones" class="w-3.5 h-3.5"></i>
                            <span>غرفة المراقبة الحية 🎧</span>
                          </button>

                          <!-- Warn -->
                          ${!isClosed ? `
                            <button 
                              type="button" 
                              onclick="window.toggleRoomWarning('${room.id}')"
                              class="p-1.5 rounded-lg ${isWarned ? 'bg-amber-600 text-white' : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'} transition cursor-pointer"
                              title="${isWarned ? 'إلغاء الإنذار' : 'إرسال إنذار رسمي للغرفة'}">
                              <i data-lucide="alert-circle" class="w-4 h-4"></i>
                            </button>
                          ` : ''}

                          <!-- Force Close / Reopen -->
                          <button 
                            type="button" 
                            onclick="window.toggleRoomForceClose('${room.id}')"
                            class="p-1.5 rounded-lg ${isClosed ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300'} transition cursor-pointer"
                            title="${isClosed ? 'إعادة فتح الغرفة' : 'إغلاق الغرفة فوراً وطرد الحضور'}">
                            <i data-lucide="${isClosed ? 'play' : 'power'}" class="w-4 h-4"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div class="p-4 bg-slate-50 border-t-2 border-slate-300 flex items-center justify-between text-xs text-slate-600 font-bold flex-wrap gap-2">
            <div>إجمالي الغرف المعروضة: <span class="font-mono text-slate-950 font-black">${filteredRooms.length}</span> من أصل <span class="font-mono text-slate-950 font-black">${allRooms.length}</span></div>
            <div class="flex items-center gap-2">
              <span>نظام الرقابة اللحظية للبث المباشر - تطبيق النجم</span>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) lucide.createIcons();
  };

  // Filter handlers
  window.setRoomsSearch = function(val) {
    window._roomsFilter.search = val;
    const container = document.getElementById('dynamicViewContainer');
    if (container) window.renderRoomsManagementView(container);
  };

  window.setRoomsFilterStatus = function(val) {
    window._roomsFilter.status = val;
    const container = document.getElementById('dynamicViewContainer');
    if (container) window.renderRoomsManagementView(container);
  };

  window.resetRoomsToDefault = function() {
    if (!confirm('هل تريد إعادة تعيين قائمة الغرف إلى الحالة الافتراضية؟')) return;
    saveActiveRooms(DEFAULT_ADMIN_ROOMS);
    const container = document.getElementById('dynamicViewContainer');
    if (container) window.renderRoomsManagementView(container);
    window.showAdminNotification ? window.showAdminNotification('تمت استعادة الغرف الافتراضية بنجاح!', 'info') : alert('تمت استعادة الغرف الافتراضية بنجاح!');
  };

  // =========================================================================
  // ACTIONS: WARNING & FORCE CLOSE
  // =========================================================================
  window.toggleRoomWarning = function(roomId) {
    const rooms = getActiveRooms();
    const r = rooms.find(x => x.id === roomId);
    if (!r) return;

    if (r.status === 'warned') {
      r.status = 'active';
      saveActiveRooms(rooms);
      window.showAdminNotification ? window.showAdminNotification(`تم إلغاء إنذار الغرفة "${r.title}" بنجاح!`, 'success') : alert('تم إلغاء الإنذار');
    } else {
      const reason = prompt('اكتب سبب الإنذار الرسمي الموجه للمالك والمشرفين:', 'مخالفة لائحة الصوتيات والآداب العامة');
      if (reason === null) return;
      r.status = 'warned';
      if (!r.chat) r.chat = [];
      r.chat.push({
        id: 'warn_' + Date.now(),
        user: '⚠️ إنذار رسمي من إدارة النجم',
        text: `تم توجيه إنذار رسمي للغرفة: ${reason}`,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      });
      saveActiveRooms(rooms);
      window.showAdminNotification ? window.showAdminNotification(`تم إرسال الإنذار للغرفة "${r.title}" فوراً! ⚠️`, 'warning') : alert('تم إرسال الإنذار');
    }

    const container = document.getElementById('dynamicViewContainer');
    if (container) window.renderRoomsManagementView(container);
  };

  window.toggleRoomForceClose = function(roomId) {
    const rooms = getActiveRooms();
    const r = rooms.find(x => x.id === roomId);
    if (!r) return;

    if (r.status === 'closed') {
      r.status = 'active';
      saveActiveRooms(rooms);
      window.showAdminNotification ? window.showAdminNotification(`تمت إعادة فتح الغرفة "${r.title}" بنجاح! 🟢`, 'success') : alert('تمت إعادة فتح الغرفة');
    } else {
      if (!confirm(`هل أنت متأكد من الإغلاق الإداري الفوري لغرفة "${r.title}"؟\nسيتم فصل البث وطرد جميع الحضور فوراً.`)) return;
      r.status = 'closed';
      r.listenersCount = 0;
      // Clear or mute seats
      (r.seats || []).forEach(s => {
        if (!s.isHost) {
          s.name = 'فارغ';
          s.avatar = null;
        }
        s.isMuted = true;
      });
      saveActiveRooms(rooms);
      window.showAdminNotification ? window.showAdminNotification(`تم إغلاق الغرفة "${r.title}" إدارياً بنجاح! 🛑`, 'error') : alert('تم إغلاق الغرفة');
    }

    const container = document.getElementById('dynamicViewContainer');
    if (container) window.renderRoomsManagementView(container);
  };

  // =========================================================================
  // REAL-TIME SERVER & BROADCAST COMMAND DISPATCHER
  // =========================================================================
  function sendRoomModerationCommand(roomId, action, seatId, extraData = {}) {
    try {
      fetch(`/api/rooms/${roomId}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, seatId, ...extraData })
      }).catch(() => {});
    } catch (e) {}

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('taraf_rooms_channel');
        bc.postMessage({ type: 'ROOM_MODERATION', roomId, action, seatId, ...extraData, timestamp: Date.now() });
        setTimeout(() => { try { bc.close(); } catch(e){} }, 50);
      }
    } catch (e) {}

    try {
      if (window.top && window.top !== window) {
        window.top.postMessage({ type: 'ROOM_MODERATION', roomId, action, seatId, ...extraData }, '*');
      }
    } catch (e) {}

    try {
      window.dispatchEvent(new CustomEvent('taraf_room_moderated', { detail: { roomId, action, seatId, ...extraData } }));
    } catch (e) {}
  }

  // Global exports for modular on-demand usage
  window.getActiveVoiceRooms = getActiveRooms;
  window.saveActiveVoiceRooms = saveActiveRooms;
  window.sendRoomModerationCommand = sendRoomModerationCommand;
  window.getRoomSupportStats = getRoomSupportStats;

  // =========================================================================
  // LAZY LOADED STUDIO & MODERATION MODULE (التحميل عند الطلب لتسريع الأداء)
  // =========================================================================
  let studioLoadingPromise = null;
  function loadStudioModuleOnDemand() {
    if (window._adminRoomsStudioLoaded) return Promise.resolve();
    if (studioLoadingPromise) return studioLoadingPromise;

    studioLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/admin/admin-rooms-studio.js';
      script.async = true;
      script.onload = () => {
        resolve();
      };
      script.onerror = (err) => {
        studioLoadingPromise = null;
        reject(err);
      };
      document.body.appendChild(script);
    });
    return studioLoadingPromise;
  }

  // Initial On-Demand Entry points (Will load admin-rooms-studio.js on demand)
  window.openLiveRoomStudio = function(roomId) {
    loadStudioModuleOnDemand().then(() => {
      if (typeof window.openLiveRoomStudio === 'function') {
        window.openLiveRoomStudio(roomId);
      }
    }).catch(err => {
      console.error('Error loading studio module:', err);
      window.showAdminNotification ? window.showAdminNotification('حدث خطأ أثناء تحميل استوديو المراقبة', 'error') : null;
    });
  };

  window.openImageModerationBox = function(imageUrl, imageType, targetId, targetName, roomId, seatId) {
    loadStudioModuleOnDemand().then(() => {
      if (typeof window.openImageModerationBox === 'function') {
        window.openImageModerationBox(imageUrl, imageType, targetId, targetName, roomId, seatId);
      }
    }).catch(err => {
      console.error('Error loading image moderation module:', err);
    });
  };

})();
