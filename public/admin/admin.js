// =========================================================================
// Super Legend & Gala Live Chat Admin - Main Logic & View Controller
// =========================================================================

// Safe localStorage parser helper to prevent any uncaught JSON errors
function safeLoad(key, defaultVal) {
  try {
    const val = localStorage.getItem(key);
    if (!val || val === 'undefined' || val === 'null') return defaultVal;
    return JSON.parse(val) || defaultVal;
  } catch (e) {
    console.warn('[Admin] Failed to parse', key, e);
    return defaultVal;
  }
}

// Global State
let vips = safeLoad('sl_vips', (typeof window !== 'undefined' && window.INITIAL_VIPS) || (typeof INITIAL_VIPS !== 'undefined' ? INITIAL_VIPS : []));
let users = safeLoad('sl_users', (typeof window !== 'undefined' && window.INITIAL_USERS) || (typeof INITIAL_USERS !== 'undefined' ? INITIAL_USERS : []));
let galaRequests = safeLoad('sl_galaRequests', (typeof window !== 'undefined' && window.INITIAL_GALA_REQUESTS) || (typeof INITIAL_GALA_REQUESTS !== 'undefined' ? INITIAL_GALA_REQUESTS : []));
let agencyManagers = safeLoad('sl_agency_managers', (typeof window !== 'undefined' && window.INITIAL_AGENCY_MANAGERS) || (typeof INITIAL_AGENCY_MANAGERS !== 'undefined' ? INITIAL_AGENCY_MANAGERS : []));
let agencyDelegates = safeLoad('sl_agency_delegates', (typeof window !== 'undefined' && window.INITIAL_AGENCY_DELEGATES) || (typeof INITIAL_AGENCY_DELEGATES !== 'undefined' ? INITIAL_AGENCY_DELEGATES : []));
let agencies = safeLoad('sl_agencies', (typeof window !== 'undefined' && window.INITIAL_AGENCIES) || (typeof INITIAL_AGENCIES !== 'undefined' ? INITIAL_AGENCIES : []));
let agencyBrokers = safeLoad('sl_agency_brokers', (typeof window !== 'undefined' && window.INITIAL_AGENCY_BROKERS) || (typeof INITIAL_AGENCY_BROKERS !== 'undefined' ? INITIAL_AGENCY_BROKERS : []));
let agencyHosts = safeLoad('sl_agency_hosts', (typeof window !== 'undefined' && window.INITIAL_AGENCY_HOSTS) || (typeof INITIAL_AGENCY_HOSTS !== 'undefined' ? INITIAL_AGENCY_HOSTS : []));
let agencyRequests = safeLoad('sl_agencyRequests', (typeof window !== 'undefined' && window.INITIAL_AGENCY_REQUESTS) || (typeof INITIAL_AGENCY_REQUESTS !== 'undefined' ? INITIAL_AGENCY_REQUESTS : []));
let rechargeAgents = safeLoad('sl_rechargeAgents', (typeof window !== 'undefined' && window.INITIAL_RECHARGE_AGENTS) || (typeof INITIAL_RECHARGE_AGENTS !== 'undefined' ? INITIAL_RECHARGE_AGENTS : []));
let framesEntries = safeLoad('sl_framesEntries', (typeof window !== 'undefined' && window.INITIAL_FRAMES_ENTRIES) || (typeof INITIAL_FRAMES_ENTRIES !== 'undefined' ? INITIAL_FRAMES_ENTRIES : []));
let userLevels = safeLoad('sl_userLevels', (typeof window !== 'undefined' && window.INITIAL_LEVELS) || (typeof INITIAL_LEVELS !== 'undefined' ? INITIAL_LEVELS : []));
let levelGiftReports = safeLoad('sl_levelReports', (typeof window !== 'undefined' && window.INITIAL_LEVEL_GIFT_REPORTS) || (typeof INITIAL_LEVEL_GIFT_REPORTS !== 'undefined' ? INITIAL_LEVEL_GIFT_REPORTS : []));
let luckyBoxes = safeLoad('sl_luckyBoxes', (typeof window !== 'undefined' && window.INITIAL_LUCKY_BOXES) || (typeof INITIAL_LUCKY_BOXES !== 'undefined' ? INITIAL_LUCKY_BOXES : []));
let complaints = safeLoad('sl_complaints', (typeof window !== 'undefined' && window.INITIAL_COMPLAINTS) || (typeof INITIAL_COMPLAINTS !== 'undefined' ? INITIAL_COMPLAINTS : []));
let settings = safeLoad('sl_settings', (typeof window !== 'undefined' && window.INITIAL_SETTINGS) || (typeof INITIAL_SETTINGS !== 'undefined' ? INITIAL_SETTINGS : {}));
let monthlyWinners = safeLoad('sl_monthlyWinners', (typeof window !== 'undefined' && window.INITIAL_MONTHLY_WINNERS) || (typeof INITIAL_MONTHLY_WINNERS !== 'undefined' ? INITIAL_MONTHLY_WINNERS : []));
let aristocracy = safeLoad('sl_aristocracy', (typeof window !== 'undefined' && window.INITIAL_ARISTOCRACY) || (typeof INITIAL_ARISTOCRACY !== 'undefined' ? INITIAL_ARISTOCRACY : []));
let auditLogs = safeLoad('sl_auditLogs', (typeof window !== 'undefined' && window.INITIAL_LOGS) || (typeof INITIAL_LOGS !== 'undefined' ? INITIAL_LOGS : []));
let adminStaff = safeLoad('sl_adminStaff', (typeof window !== 'undefined' && window.INITIAL_ADMIN_STAFF) || (typeof INITIAL_ADMIN_STAFF !== 'undefined' ? INITIAL_ADMIN_STAFF : []));
let securityBans = safeLoad('sl_securityBans', (typeof window !== 'undefined' && window.INITIAL_SECURITY_BANS) || (typeof INITIAL_SECURITY_BANS !== 'undefined' ? INITIAL_SECURITY_BANS : []));
let coinPackages = safeLoad('sl_coinPackages', (typeof window !== 'undefined' && window.INITIAL_COIN_PACKAGES) || (typeof INITIAL_COIN_PACKAGES !== 'undefined' ? INITIAL_COIN_PACKAGES : []));
let databaseBackups = safeLoad('sl_databaseBackups', (typeof window !== 'undefined' && window.INITIAL_DATABASE_BACKUPS) || (typeof INITIAL_DATABASE_BACKUPS !== 'undefined' ? INITIAL_DATABASE_BACKUPS : []));

// مزامنة فورية لوكالات إدارة الكابتن (MGR-9902) وصلاحيات الإدارة لضمان عدم ظهورها فارغة
(function syncCaptainAgenciesAndPermissions() {
  const initAgencies = (typeof window !== 'undefined' && window.INITIAL_AGENCIES) || (typeof INITIAL_AGENCIES !== 'undefined' ? INITIAL_AGENCIES : []);
  const captainInitial = initAgencies.filter(a => a.managerId === 'MGR-9902');
  if (!agencies.some(a => a.managerId === 'MGR-9902') && captainInitial.length > 0) {
    agencies = [...agencies, ...captainInitial];
    localStorage.setItem('sl_agencies', JSON.stringify(agencies));
  }
  
  // مزامنة صلاحيات إدارة الكابتن
  const captainMgr = agencyManagers.find(m => m.id === 'MGR-9902');
  if (captainMgr) {
    if (!captainMgr.permissions) {
      captainMgr.permissions = {
        canAssignDelegates: true,
        maxDelegatesQuota: 5,
        canApproveAgencies: true,
        canTransferHosts: true,
        canUnbanAccounts: true,
        canTransferBrokerHosts: true,
        rechargeControlBlocked: true
      };
      localStorage.setItem('sl_agency_managers', JSON.stringify(agencyManagers));
    }
  }
})();

let currentTab = 'agency_hierarchy';
let userFilter = { id: '', specialId: '', specialNum: '', family: '', q: '' };

// توليد المعرف الأساسي التلقائي (Primary System ID) يبدأ من 1001001 ويستمر بتسلسل تصاعدي دقيق
window.getNextPrimarySystemId = function() {
  let maxId = 1001000;
  if (Array.isArray(users)) {
    users.forEach(u => {
      const pId = parseInt(u.primaryId || u.id, 10);
      if (!isNaN(pId) && pId > maxId) {
        maxId = pId;
      }
    });
  }
  return maxId + 1;
};

// ترقية ومزامنة المعرفات الأساسية للمستخدمين لتبدأ من 1001001 فما فوق وربط الأدوار والصلاحيات
function migrateUserPrimaryIds() {
  let needsSave = false;
  if (Array.isArray(users)) {
    users.forEach((u, idx) => {
      if (!u.primaryId || Number(u.id) < 1000000) {
        const newPrimaryId = 1001001 + idx;
        u.primaryId = newPrimaryId;
        u.id = newPrimaryId;
        needsSave = true;
      }
      if (!u.roles) {
        u.roles = ['USER'];
        needsSave = true;
      }
      // ربط مدراء الوكالات
      if (!u.functionalRoleCode && Array.isArray(agencyManagers)) {
        const foundMgr = agencyManagers.find(m => m.primaryUserId === u.id || (u.displayName && m.name && m.name.includes(u.displayName.split(' ')[0])));
        if (foundMgr) {
          u.roles = ['AGENCY_MANAGER'];
          u.functionalRoleCode = foundMgr.id;
          u.roleTitle = foundMgr.roleTitle || 'مدير عام الوكالات 👑';
          foundMgr.primaryUserId = u.id;
          needsSave = true;
        }
      }
      // ربط مناديب الوكالات
      if (!u.functionalRoleCode && Array.isArray(agencyDelegates)) {
        const foundDel = agencyDelegates.find(d => d.primaryUserId === u.id || (u.displayName && d.name && d.name.includes(u.displayName.split(' ')[0])));
        if (foundDel) {
          u.roles = ['DELEGATE'];
          u.functionalRoleCode = foundDel.id;
          u.roleTitle = foundDel.roleTitle || 'مندوب استقطاب وكلاء معتمد';
          foundDel.primaryUserId = u.id;
          needsSave = true;
        }
      }
      // ربط الوكلاء الرسميين
      if (!u.functionalRoleCode && Array.isArray(agencies)) {
        const foundAg = agencies.find(a => a.ownerPrimaryId === u.id || String(a.ownerId) === String(u.specialId) || (u.displayName && a.owner && a.owner.includes(u.displayName.split(' ')[0])));
        if (foundAg) {
          u.roles = ['OFFICIAL_AGENT'];
          u.functionalRoleCode = foundAg.id;
          u.roleTitle = `وكيل رسمي معتمد (${foundAg.id})`;
          foundAg.ownerPrimaryId = u.id;
          needsSave = true;
        }
      }
    });
  }

  // مزامنة سجلات مدراء الوكالات بالمعرف الأساسي
  if (Array.isArray(agencyManagers)) {
    agencyManagers.forEach((mgr, mIdx) => {
      if (!mgr.primaryUserId && Array.isArray(users)) {
        const targetUser = users.find(u => u.functionalRoleCode === mgr.id) || users[mIdx];
        if (targetUser) {
          mgr.primaryUserId = targetUser.id;
          if (!targetUser.roles || !targetUser.roles.includes('AGENCY_MANAGER')) {
            targetUser.roles = ['AGENCY_MANAGER'];
          }
          targetUser.functionalRoleCode = mgr.id;
          needsSave = true;
        }
      }
    });
  }

  // مزامنة سجلات المندوبين بالمعرف الأساسي
  if (Array.isArray(agencyDelegates)) {
    agencyDelegates.forEach((del, dIdx) => {
      if (!del.primaryUserId && Array.isArray(users)) {
        const targetUser = users.find(u => u.functionalRoleCode === del.id) || users[3 + dIdx];
        if (targetUser) {
          del.primaryUserId = targetUser.id;
          if (!targetUser.roles || !targetUser.roles.includes('DELEGATE')) {
            targetUser.roles = ['DELEGATE'];
          }
          targetUser.functionalRoleCode = del.id;
          needsSave = true;
        }
      }
    });
  }

  // مزامنة سجلات الوكالات بالمعرف الأساسي الموحد ومواصلة الأرقام التسلسلية
  if (Array.isArray(agencies)) {
    const defaultAgencyOwnerMap = {
      'AG-101': '1001010',
      'AG-104': '1001011',
      'AG-102': '1001012',
      'AG-103': '1001013',
      'AG-105': '1001014',
      'AG-106': '1001015'
    };
    agencies.forEach((ag, aIdx) => {
      const correctOwnerId = defaultAgencyOwnerMap[ag.id] || String(1001010 + aIdx);
      if (ag.ownerId !== correctOwnerId || ag.ownerPrimaryId !== Number(correctOwnerId)) {
        ag.ownerId = correctOwnerId;
        ag.ownerPrimaryId = Number(correctOwnerId);
        needsSave = true;
      }
    });
  }

  // مزامنة سجلات الوسطاء والمضيفين لتتوافق معرفاتهم مع التسلسل الأساسي
  if (Array.isArray(agencyBrokers)) {
    agencyBrokers.forEach((brk, bIdx) => {
      const targetBrokerId = 1001016 + bIdx;
      if (!brk.primaryUserId || brk.primaryUserId !== targetBrokerId || brk.userId !== String(targetBrokerId)) {
        brk.primaryUserId = targetBrokerId;
        brk.userId = String(targetBrokerId);
        needsSave = true;
      }
    });
  }

  if (Array.isArray(agencyHosts)) {
    agencyHosts.forEach((hst, hIdx) => {
      const targetHostId = 1001022 + hIdx;
      if (!hst.primaryUserId || Number(hst.primaryUserId) < 1000000 || Number(hst.userId) < 1000000) {
        hst.primaryUserId = targetHostId;
        hst.userId = String(targetHostId);
        needsSave = true;
      }
    });
  }

  if (needsSave) {
    saveState();
  }
}
migrateUserPrimaryIds();

function saveState() {
  localStorage.setItem('sl_vips', JSON.stringify(vips));
  localStorage.setItem('sl_users', JSON.stringify(users));
  localStorage.setItem('sl_galaRequests', JSON.stringify(galaRequests));
  localStorage.setItem('sl_agency_managers', JSON.stringify(agencyManagers));
  localStorage.setItem('sl_agency_delegates', JSON.stringify(agencyDelegates));
  localStorage.setItem('sl_agencies', JSON.stringify(agencies));
  localStorage.setItem('sl_agency_brokers', JSON.stringify(agencyBrokers));
  localStorage.setItem('sl_agency_hosts', JSON.stringify(agencyHosts));
  localStorage.setItem('sl_agencyRequests', JSON.stringify(agencyRequests));
  localStorage.setItem('sl_rechargeAgents', JSON.stringify(rechargeAgents));
  localStorage.setItem('sl_framesEntries', JSON.stringify(framesEntries));
  localStorage.setItem('sl_userLevels', JSON.stringify(userLevels));
  localStorage.setItem('sl_levelReports', JSON.stringify(levelGiftReports));
  localStorage.setItem('sl_luckyBoxes', JSON.stringify(luckyBoxes));
  localStorage.setItem('sl_complaints', JSON.stringify(complaints));
  localStorage.setItem('sl_settings', JSON.stringify(settings));
  localStorage.setItem('sl_monthlyWinners', JSON.stringify(monthlyWinners));
  localStorage.setItem('sl_aristocracy', JSON.stringify(aristocracy));
  localStorage.setItem('sl_auditLogs', JSON.stringify(auditLogs));
  localStorage.setItem('sl_adminStaff', JSON.stringify(adminStaff));
  localStorage.setItem('sl_securityBans', JSON.stringify(securityBans));
  localStorage.setItem('sl_coinPackages', JSON.stringify(coinPackages));
  localStorage.setItem('sl_databaseBackups', JSON.stringify(databaseBackups));

  // Live real-time bidirectional synchronization with mobile app storage
  try {
    const mainUser = users.find(u => u.specialId === '999000' || u.id === 1);
    if (mainUser) {
      localStorage.setItem('super_legend_coins', String(mainUser.coins));
    }
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('admin_balance_updated'));
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel('taraf_admin_sync');
      ch.postMessage({ 
        type: 'BALANCE_UPDATE', 
        coins: mainUser ? mainUser.coins : undefined 
      });
      ch.close();
    }
  } catch (err) {}
}

// Check session on load (auto-provision superadmin session for instant direct access)
document.addEventListener('DOMContentLoaded', () => {
  let session = localStorage.getItem('sl_admin_session');
  if (!session) {
    session = JSON.stringify({ user: 'superadmin', role: 'SUPER_ADMIN', time: Date.now() });
    localStorage.setItem('sl_admin_session', session);
  }

  // Support direct route linking via ?tab=... (e.g. ?tab=recharge_agencies)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedTab = urlParams.get('tab');
    if (requestedTab) {
      currentTab = requestedTab;
    }
  } catch (e) {}

  showDashboard();
});

function showLogin() {
  document.getElementById('loginSection').classList.remove('hidden');
  document.getElementById('dashboardSection').classList.add('hidden');
  lucide.createIcons();
}

function showDashboard() {
  document.getElementById('loginSection').classList.add('hidden');
  document.getElementById('dashboardSection').classList.remove('hidden');
  switchTab(currentTab);
  lucide.createIcons();
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const username = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value.trim();

  if (username === 'superadmin' && (pass === 'SuperAdmin@2026' || pass === 'admin123')) {
    localStorage.setItem('sl_admin_session', JSON.stringify({ user: 'superadmin', role: 'SUPER_ADMIN', time: Date.now() }));
    showDashboard();
  } else {
    alert('اسم المستخدم أو كلمة المرور غير صحيحة!');
  }
}

function handleLogout() {
  if (confirm('هل تريد تسجيل الخروج من لوحة الإدارة؟')) {
    localStorage.removeItem('sl_admin_session');
    showLogin();
  }
}

function fillDemoCredentials() {
  document.getElementById('loginUser').value = 'superadmin';
  document.getElementById('loginPass').value = 'SuperAdmin@2026';
}

// Toggle Sidebar (ربط القائمة الجانبية بثلاث شرطات)
function toggleSidebar() {
  const sidebar = document.getElementById('adminSidebar');
  if (!sidebar) return;
  if (sidebar.style.display === 'none' || sidebar.classList.contains('hidden')) {
    sidebar.style.display = '';
    sidebar.classList.remove('hidden');
  } else {
    sidebar.style.display = 'none';
    sidebar.classList.add('hidden');
  }
}

// Toggle Submenus
function toggleSubmenu(id) {
  const menu = document.getElementById(id);
  const icon = document.getElementById(id + '-arrow');
  if (!menu) return;
  menu.classList.toggle('hidden');
  if (icon) {
    icon.classList.toggle('rotate-90');
  }
}

// Step 1: التفاعل مع "إدارة الوكالات" في القائمة الجانبية (Sidebar Agency Click)
function handleAgencyMenuClick() {
  const menu = document.getElementById('submenu-agencies');
  const icon = document.getElementById('submenu-agencies-arrow');
  if (menu && menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
    if (icon) icon.classList.add('rotate-90');
  }
  // فتح الشاشة المخصصة لإدارة الوكالات لتظهر قائمة المدراء والإداريين (أبو أمجد، الكابتن، سالم الكعبي)
  if (window._hierarchyState) {
    window._hierarchyState.activeManagerId = null;
    window._hierarchyState.activeDelegateId = null;
    window._hierarchyState.activeAgencyId = null;
    window._hierarchyState.activeBrokerId = null;
  }
  switchTab('agency_hierarchy');
}
window.handleAgencyMenuClick = handleAgencyMenuClick;

// Switch Active Tab View
function switchTab(tabId) {
  currentTab = tabId;

  // Clear previous active styling
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.remove('bg-amber-500', 'text-slate-950', 'font-black', 'shadow-xs');
    btn.classList.add('text-slate-800', 'hover:bg-slate-100');
  });

  const activeBtn = document.getElementById('tab-' + tabId);
  if (activeBtn) {
    activeBtn.classList.add('bg-amber-500', 'text-slate-950', 'font-black', 'shadow-xs');
    activeBtn.classList.remove('text-slate-800', 'hover:bg-slate-100');
  }

  // Update Breadcrumb & Header Title
  const breadcrumb = document.getElementById('currentViewBreadcrumb');
  const titleMap = {
    'agency_hierarchy': 'الهيكل الهرمي والتراكمي للوكالات (مدير ➔ مندوب ➔ وكيل رسمي ➔ وسيط)',
    'gala_requests': 'طلبات ويب سايت غلا',
    'necklaces': 'القلادات',
    'lucky_boxes': 'صناديق الحظ',
    'room_boxes': 'صناديق الغرف',
    'users': 'إدارة المستخدمين',
    'agencies': 'إدارة الوكالات - الساعات وطلبات الوكالة',
    'agency_hours': 'الساعات المحققة للوكالات',
    'agency_hosting': 'وكالة استضافة ومضيفين',
    'agency_create_req': 'طلبات إنشاء الوكالة',
    'agency_join_req': 'طلبات الانضمام للوكالة',
    'agency_leave_req': 'طلبات الخروج من الوكالة',
    'agency_salaries': 'التحكم في رواتب المستخدمين',
    'agency_target_reports': 'تقارير التارجت المتحقق',
    'agency_user_targets': 'تارجت المستخدمين',
    'agency_host_targets': 'تارجت الوكلاء المتحقق',
    'recharge_agencies': 'وكالات الشحن المعتمدة',
    'host_audit': 'كشف حساب وتدقيق المضيف (Host Audit & Activity Log)',
    'rooms': 'إدارة الغرف الصوتية المباشرة',
    'gifts_vip': 'إدارة الهدايا - VIP إهداء (vips_dedic)',
    'vips_dedic': 'إدارة الهدايا - VIP إهداء (vips_dedic)',
    'gifts_frames': 'إدارة الهدايا - إطار ودخول',
    'gifts_room_bg': 'إدارة الهدايا - إهداء خلفية غرفة',
    'complaints_bans': 'الشكاوى ونظام الحظر الشامل',
    'coins_recharge': 'نظام الكونزات والشحن المالي',
    'events': 'الأحداث والفعاليات',
    'rewards': 'إدارة المكافآت',
    'games': 'الألعاب التنافسية (Ludo / Wheel / PK)',
    'social': 'التواصل الاجتماعي والمنشورات',
    'relationships': 'العلاقات وعلاقات الـ CP',
    'families': 'عائلات التطبيق والكلانات',
    'levels': 'مستويات المستخدمين',
    'level_gift_reports': 'تقارير إهداء المستويات',
    'gifts_catalog': 'صندوق هدايا الروم والتحريك 🎁 (تخصيص الهدايا والفيديوهات مباشرة)',
    'pks': 'معارك الـ Pks المباشرة',
    'monthly_winners': 'ترتيب الفائزين الشهري',
    'medals': 'الأوسمة وشارات الشرف',
    'aristocracy': 'الأرستقراطية والنبلاء',
    'settings_banners': 'الإعدادات - البنارات الافتتاحية والسياسات',
    'settings_updates': 'الإعدادات - التحديثات وروابط التطبيق',
    'settings_pages': 'الإعدادات - الصفحات والشروط',
    'settings_countries': 'الإعدادات - الدول والعملات',
    'settings_marquee': 'الإعدادات - شريط التمرير',
    'settings_broadcasts': 'الإعدادات - الرسائل الرسمية',
    'store': 'المتجر والتأثيرات',
    'log_viewer': 'سجل العمليات الإدارية (Log Viewer)',
    'staff_management': 'طاقم الإدارة والصلاحيات ونظام المشرفين (Staff & RBAC)',
    'database_backup': 'النسخ الاحتياطي لقاعدة البيانات وحالة السيرفر السحابي',
    'security_bans': 'الحظر الأمني الشامل للأجهزة والـ IP ومكافحة الاحتيال'
  };

  if (breadcrumb) {
    breadcrumb.textContent = titleMap[tabId] || 'لوحة التحكم';
  }

  renderView(tabId);
}

// Render dynamic content for the active tab (On-Demand & Modular)
function renderView(tabId) {
  const container = document.getElementById('dynamicViewContainer');
  if (!container) return;

  // فحص محرك التحميل عند الطلب والتخزين المؤقت للواجهات المفصولة
  if (window.AdminViewLoader && (window.AdminViewLoader.viewCache[tabId] || window.AdminViewLoader.viewModuleMap[tabId])) {
    window.AdminViewLoader.loadView(tabId, container);
    return;
  }

  if (tabId === 'agency_hierarchy') {
    renderAgencyHierarchyView(container);
  } else if (tabId === 'vips_dedic' || tabId === 'gifts_vip') {
    renderVipView(container);
  } else if (tabId === 'users') {
    renderUsersView(container);
  } else if (tabId === 'gala_requests') {
    renderGalaRequestsView(container);
  } else if (tabId.startsWith('agency')) {
    renderAgenciesView(container, tabId);
  } else if (tabId === 'recharge_agencies') {
    if (window._rechargeAgenciesState) {
      window._rechargeAgenciesState.currentView = 'agencies-table';
    }
    if (typeof window.renderRechargeAgenciesViewMain === 'function') {
      window.renderRechargeAgenciesViewMain(container);
    } else {
      renderRechargeAgenciesView(container);
    }
  } else if (tabId === 'host_audit') {
    if (typeof window.navigateToHostAudit === 'function') {
      window.navigateToHostAudit();
    } else if (typeof window.renderRechargeAgenciesViewMain === 'function') {
      window._rechargeAgenciesState.currentView = 'host-audit';
      window.renderRechargeAgenciesViewMain(container);
    }
  } else if (tabId === 'rooms') {
    if (typeof window.renderRoomsManagementView === 'function') {
      window.renderRoomsManagementView(container);
    } else {
      renderBuildableListView(container, tabId);
    }
  } else if (tabId === 'gifts_frames') {
    renderFramesView(container);
  } else if (tabId === 'gifts_room_bg') {
    renderRoomBgView(container);
  } else if (tabId === 'gifts_catalog') {
    renderGiftsCatalogView(container);
  } else if (tabId === 'complaints_bans') {
    renderComplaintsBansView(container);
  } else if (tabId === 'coins_recharge') {
    renderCoinsRechargeView(container);
  } else if (tabId === 'levels') {
    renderLevelsView(container);
  } else if (tabId === 'level_gift_reports') {
    renderLevelGiftReportsView(container);
  } else if (tabId === 'lucky_boxes' || tabId === 'necklaces' || tabId === 'room_boxes') {
    renderLuckyBoxesView(container, tabId);
  } else if (tabId === 'monthly_winners') {
    renderMonthlyWinnersView(container);
  } else if (tabId === 'aristocracy') {
    renderAristocracyView(container);
  } else if (tabId.startsWith('settings_')) {
    renderSettingsView(container, tabId);
  } else if (tabId === 'standard_table_template') {
    renderStandardTableShowcase(container);
  } else if (tabId === 'log_viewer') {
    renderLogsView(container);
  } else if (tabId === 'staff_management') {
    renderStaffManagementView(container);
  } else if (tabId === 'database_backup') {
    renderDatabaseBackupView(container);
  } else if (tabId === 'security_bans') {
    renderSecurityBansView(container);
  } else if (tabId === 'store') {
    if (typeof window.renderStoreView === 'function') {
      window.renderStoreView(container);
    } else {
      renderBuildableListView(container, tabId);
    }
  } else {
    renderBuildableListView(container, tabId);
  }

  lucide.createIcons();
}

// =========================================================================
// VIEW 1: VIP DEDICATIONS VIEW (vips_dedic - Standard UI Table Template)
// =========================================================================
function renderVipView(container) {
  window.renderStandardTable(container, {
    tableId: 'vip_dedications_table',
    title: 'إدارة الهدايا - VIP إهداء (vips_dedic)',
    subtitle: 'التحكم في مستويات VIP، الأسعار بالكوينز، فترات الصلاحية، وشارات الرتب في قالب قياسي منظم',
    icon: 'crown',
    badge: 'v5.0 Pro',
    data: vips,
    initialSortKey: 'level',
    initialSortDir: 'asc',
    columns: [
      { key: 'id', label: 'معرف', sortable: true, isCode: true, align: 'center', width: '70px' },
      { 
        key: 'level', 
        label: 'المستوى', 
        sortable: true, 
        align: 'center', 
        width: '90px',
        render: (val) => `<span class="font-mono font-black text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg text-xs">VIP ${val}</span>` 
      },
      { 
        key: 'name', 
        label: 'الاسم والرتبة', 
        sortable: true, 
        render: (val, row) => `
          <div class="inline-flex items-center gap-2 whitespace-nowrap">
            <span class="font-black text-slate-950 text-sm">${val}</span>
            ${row.badgeName ? `<span class="text-[11px] text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">(${row.badgeName})</span>` : ''}
          </div>
        ` 
      },
      { 
        key: 'image', 
        label: 'شارة الرتبة', 
        sortable: false, 
        align: 'center', 
        render: (val) => `
          <div class="inline-block transform hover:scale-125 transition-transform duration-200 cursor-pointer drop-shadow-sm">
            ${val}
          </div>
        ` 
      },
      { 
        key: 'price', 
        label: 'السعر بالكوينز', 
        sortable: true, 
        render: (val) => `
          <div class="flex items-center gap-1.5 font-mono font-black text-amber-800 text-sm">
            <span>${Number(val).toLocaleString()}</span>
            <span class="text-xs">🪙</span>
          </div>
        ` 
      },
      { 
        key: 'validity', 
        label: 'مدة الصلاحية', 
        sortable: true, 
        render: (val) => `<span class="font-mono font-bold text-slate-900">${val} يوم</span>` 
      },
      { 
        key: 'activeOwners', 
        label: 'المشتركون النشطون', 
        sortable: true, 
        align: 'center', 
        render: (val) => `<span class="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-950 font-mono font-black text-xs">${val || 0} مشترك</span>` 
      }
    ],
    rowActions: [
      {
        id: 'edit',
        title: 'تعديل السعر والصلاحية',
        icon: 'pencil',
        className: 'bg-sky-50 text-sky-800 border border-sky-300 hover:bg-sky-100 font-bold',
        onClick: (row) => editVipPrice(row.id)
      },
      {
        id: 'info',
        title: 'تفاصيل المستوى',
        icon: 'info',
        className: 'bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200 font-bold',
        onClick: (row) => alert(`مستوى: ${row.name}\nالسعر: ${Number(row.price).toLocaleString()} كوينز\nالصلاحية: ${row.validity} يوم\nالشارة: ${row.badgeName}`)
      },
      {
        id: 'delete',
        title: 'حذف المستوى',
        icon: 'trash-2',
        className: 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100 font-bold',
        onClick: (row) => {
          if (confirm(`هل أنت متأكد من حذف ${row.name}؟`)) {
            const idx = vips.findIndex(v => v.id === row.id);
            if (idx !== -1) {
              vips.splice(idx, 1);
              saveState();
              renderView('vips_dedic');
            }
          }
        }
      }
    ],
    onAdd: openAddVipModal,
    addLabel: 'إضافة مستوى VIP جديد',
    onBulkDelete: (ids) => {
      if (confirm(`هل تريد حذف ${ids.length} مستويات VIP محددة؟`)) {
        for (let id of ids) {
          const idx = vips.findIndex(v => String(v.id) === String(id));
          if (idx !== -1) vips.splice(idx, 1);
        }
        saveState();
        renderView('vips_dedic');
      }
    }
  });
}

function editVipPrice(id) {
  const item = vips.find(v => v.id === id);
  if (!item) return;
  const newPrice = prompt(`تعديل سعر كوينزات ${item.name} (${item.badgeName}):`, item.price);
  if (newPrice && !isNaN(newPrice)) {
    item.price = Number(newPrice);
    saveState();
    auditLogs.unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      user: 'superadmin (naz)',
      action: 'UPDATE_VIP_PRICE',
      target: `Updated ${item.name} price to ${item.price}`,
      time: 'الآن'
    });
    renderView('vips_dedic');
  }
}

function openAddVipModal() {
  const nextLvl = vips.length + 1;
  const name = prompt(`أدخل اسم مستوى VIP الجديد (مثال: VIP${nextLvl}):`, `VIP${nextLvl}`);
  if (!name) return;
  const price = prompt('أدخل السعر بالكوينز:', '25000000');
  if (!price || isNaN(price)) return;

  vips.push({
    id: nextLvl,
    level: nextLvl,
    name,
    image: vips[vips.length - 1].image,
    badgeName: `شارة النخبة الإمبراطورية ${nextLvl}`,
    price: Number(price),
    validity: 30,
    activeOwners: 0
  });

  saveState();
  renderView('vips_dedic');
}

// =========================================================================
// VIEW 2: USER MANAGEMENT VIEW (متطابق مع الصورة 3 و 4 و 5)
// =========================================================================
function renderUsersView(container) {
  const filtered = users.filter(u => {
    if (userFilter.id && String(u.id) !== userFilter.id) return false;
    if (userFilter.specialId && !u.specialId.includes(userFilter.specialId)) return false;
    if (userFilter.family && userFilter.family !== 'اختر' && u.family !== userFilter.family) return false;
    if (userFilter.q) {
      const q = userFilter.q.toLowerCase();
      const matchName = u.displayName.toLowerCase().includes(q);
      const matchPhone = u.phone.includes(q);
      const matchUuid = u.gameUuid.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchUuid && !matchEmail) return false;
    }
    return true;
  });

  container.innerHTML = `
    <div class="space-y-4">
      <!-- Search & Filters Box in Clean White & Dark-White (Off-White) -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <div class="flex items-center gap-2 text-slate-950 font-black text-sm">
            <span class="p-1.5 rounded-lg bg-sky-600 text-white"><i data-lucide="filter" class="w-4 h-4"></i></span>
            <span>تصفية وبحث متقدم في قاعدة بيانات المستخدمين</span>
          </div>
          <span class="text-xs text-slate-700 font-bold">إجمالي المطابق: <span class="font-black text-slate-950">${filtered.length}</span> مستخدم</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">المعرف (ID)</label>
            <div class="relative">
              <input type="text" id="filterId" value="${userFilter.id}" placeholder="ID" class="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 placeholder:text-slate-500">
              <i data-lucide="search" class="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5"></i>
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">المعرف المميز (Special ID)</label>
            <div class="relative">
              <input type="text" id="filterSpecialId" value="${userFilter.specialId}" placeholder="معرف مميز" class="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 placeholder:text-slate-500">
              <i data-lucide="search" class="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5"></i>
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">الرقم المميز</label>
            <div class="relative">
              <input type="text" id="filterSpecialNum" value="${userFilter.specialNum}" placeholder="الرقم المميز" class="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 placeholder:text-slate-500">
              <i data-lucide="search" class="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5"></i>
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">العائلة (Family)</label>
            <select id="filterFamily" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500">
              <option value="">جميع العائلات</option>
              <option value="عائلة الملوك" ${userFilter.family === 'عائلة الملوك' ? 'selected' : ''}>عائلة الملوك</option>
              <option value="عائلة النخبة" ${userFilter.family === 'عائلة النخبة' ? 'selected' : ''}>عائلة النخبة</option>
              <option value="عائلة الأساطير" ${userFilter.family === 'عائلة الأساطير' ? 'selected' : ''}>عائلة الأساطير</option>
              <option value="عائلة الهيبة" ${userFilter.family === 'عائلة الهيبة' ? 'selected' : ''}>عائلة الهيبة</option>
              <option value="عائلة الفرسان" ${userFilter.family === 'عائلة الفرسان' ? 'selected' : ''}>عائلة الفرسان</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">بحث عام</label>
            <div class="relative">
              <input type="text" id="filterUsersQuery" value="${userFilter.q}" placeholder="الاسم، الهاتف، UUID، أو الإيميل" class="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 placeholder:text-slate-500">
              <i data-lucide="search" class="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5"></i>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-1">
          <button onclick="applyUserFilter()" class="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs">
            <i data-lucide="search" class="w-4 h-4"></i>
            <span>تطبيق التصفية</span>
          </button>
          <button onclick="resetUserFilter()" class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 font-black text-xs flex items-center gap-1.5 transition cursor-pointer">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
            <span>تفريغ الحقول</span>
          </button>
        </div>
      </div>

      <!-- Users Standard Table Container -->
      <div id="usersStandardTableContainer" class="w-full"></div>
    </div>
  `;

  // Render the users table using the Standard UI Table Template
  window.renderStandardTable(document.getElementById('usersStandardTableContainer'), {
    tableId: 'users_master_table',
    title: 'قائمة المستخدمين والحسابات الرسمية (User Directory)',
    subtitle: 'إدارة حسابات الأعضاء، معرفات الألعاب، كوينزات الرصيد، والمستويات في قالب قياسي منسق',
    icon: 'users',
    badge: `${filtered.length} مستخدم`,
    data: filtered,
    initialSortKey: 'id',
    initialSortDir: 'asc',
    columns: [
      { 
        key: 'id', 
        label: 'المعرف الأساسي ID', 
        sortable: true, 
        isCode: true, 
        align: 'center', 
        width: '120px',
        render: (val) => `<span class="font-mono font-black text-slate-950 bg-slate-100 px-2.5 py-1 rounded-lg text-xs border border-slate-300 shadow-xs">#${val}</span>`
      },
      { 
        key: 'specialId', 
        label: 'معرف مميز', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="font-mono font-black text-sky-700 bg-sky-100 px-2.5 py-1 rounded-lg text-xs border border-sky-300">#${val}</span>` 
      },
      { 
        key: 'displayName', 
        label: 'الاسم والعائلة', 
        sortable: true, 
        render: (val, row) => `
          <div class="inline-flex items-center gap-2 whitespace-nowrap">
            <span class="font-black text-slate-950 text-sm">${val}</span>
            <span class="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">${row.family || 'عائلة الملوك'}</span>
          </div>
        ` 
      },
      {
        key: 'roles',
        label: 'الصلاحيات والأدوار الممنوحة',
        sortable: false,
        align: 'center',
        render: (val, row) => {
          if (row.functionalRoleCode && row.functionalRoleCode.startsWith('DEL-')) {
            return `
              <div class="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span class="inline-flex items-center gap-1 font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-purple-100 text-purple-950 border border-purple-300 shadow-xs">
                  <i data-lucide="badge-check" class="w-3.5 h-3.5 text-purple-700"></i>
                  <span>مندوب معتمد</span>
                  <span class="bg-purple-200 text-purple-900 px-1.5 py-0.2 rounded font-black">${row.functionalRoleCode}</span>
                </span>
              </div>
            `;
          }
          if (row.functionalRoleCode && row.functionalRoleCode.startsWith('MGR-')) {
            return `
              <div class="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span class="inline-flex items-center gap-1 font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 shadow-xs">
                  <i data-lucide="crown" class="w-3.5 h-3.5 text-amber-700"></i>
                  <span>مدير عام</span>
                  <span class="bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-black">${row.functionalRoleCode}</span>
                </span>
              </div>
            `;
          }
          if (row.functionalRoleCode && row.functionalRoleCode.startsWith('AG-')) {
            return `
              <div class="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span class="inline-flex items-center gap-1 font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-sky-100 text-sky-950 border border-sky-300 shadow-xs">
                  <i data-lucide="building-2" class="w-3.5 h-3.5 text-sky-700"></i>
                  <span>وكيل رسمي</span>
                  <span class="bg-sky-200 text-sky-900 px-1.5 py-0.2 rounded font-black">${row.functionalRoleCode}</span>
                </span>
              </div>
            `;
          }
          return `<span class="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">مستخدم أساسي</span>`;
        }
      },
      { 
        key: 'gameUuid', 
        label: 'معرف الألعاب (UUID)', 
        sortable: false, 
        render: (val) => `<span class="font-mono text-[11px] text-slate-700 font-bold whitespace-nowrap" dir="ltr">${val}</span>` 
      },
      { 
        key: 'coins', 
        label: 'رصيد الكوينز', 
        sortable: true, 
        render: (val) => `
          <div class="flex items-center gap-1.5 font-mono font-black text-amber-800 text-sm">
            <span>${Number(val).toLocaleString()}</span>
            <span>🪙</span>
          </div>
        ` 
      },
      { 
        key: 'level', 
        label: 'المستوى', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono font-black text-slate-900 text-xs">Lv.${val}</span>` 
      },
      { 
        key: 'status', 
        label: 'الحالة', 
        sortable: true, 
        isStatus: true,
        align: 'center' 
      }
    ],
    rowActions: [
      {
        id: 'assignRole',
        title: 'منح وربط الصلاحيات الوظيفية (مندوب / وكيل / مدير) بالمعرف الأساسي للمستخدم',
        icon: 'shield-check',
        className: 'bg-purple-100 text-purple-950 border border-purple-300 hover:bg-purple-200 font-black',
        onClick: (row) => window.openAssignRoleModal(row.id)
      },
      {
        id: 'recharge',
        title: 'شحن كوينز لحساب المستخدم',
        icon: 'coins',
        className: 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 font-black',
        onClick: (row) => quickChargeUser(row.specialId)
      },
      {
        id: 'toggleBan',
        title: 'حظر أو إلغاء حظر المستخدم',
        icon: 'shield-alert',
        className: 'bg-rose-100 text-rose-900 border border-rose-300 hover:bg-rose-200 font-black',
        onClick: (row) => toggleBanUser(row.id)
      }
    ],
    onAdd: openAddUserModal,
    addLabel: 'إضافة مستخدم جديد',
    onBulkDelete: (ids) => {
      if (confirm(`هل أنت متأكد من حذف ${ids.length} حسابات مستخدمين محددة؟`)) {
        for (let id of ids) {
          const idx = users.findIndex(u => String(u.id) === String(id));
          if (idx !== -1) users.splice(idx, 1);
        }
        saveState();
        renderView('users');
      }
    }
  });

  lucide.createIcons();
}

function applyUserFilter() {
  userFilter.id = document.getElementById('filterId').value.trim();
  userFilter.specialId = document.getElementById('filterSpecialId').value.trim();
  userFilter.specialNum = document.getElementById('filterSpecialNum').value.trim();
  userFilter.family = document.getElementById('filterFamily').value;
  userFilter.q = document.getElementById('filterUsersQuery').value.trim();
  renderView('users');
}

function resetUserFilter() {
  userFilter = { id: '', specialId: '', specialNum: '', family: '', q: '' };
  renderView('users');
}

function quickChargeUser(specialId) {
  const u = users.find(x => x.specialId === specialId);
  if (!u) return;
  const amount = prompt(`أدخل عدد الكوينزات المراد شحنها للمستخدم ${u.displayName} (#${specialId}):`, '1000000');
  if (amount && !isNaN(amount)) {
    u.coins += Number(amount);
    saveState();
    auditLogs.unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      user: 'superadmin (naz)',
      action: 'USER_RECHARGE',
      target: `Charged ${Number(amount).toLocaleString()} coins to #${specialId}`,
      time: 'الآن'
    });
    alert(`تم شحن ${Number(amount).toLocaleString()} كوينز بنجاح!`);
    renderView('users');
  }
}

function toggleBanUser(id) {
  const u = users.find(x => x.id === id);
  if (!u) return;
  if (u.status === 'active') {
    const reason = prompt(`أدخل سبب حظر المستخدم ${u.displayName}:`, 'مخالفة سياسة الغرف والبث');
    if (reason) {
      u.status = 'banned';
      auditLogs.unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        user: 'superadmin (naz)',
        action: 'USER_BAN',
        target: `Banned #${u.specialId} (${reason})`,
        time: 'الآن'
      });
      saveState();
      renderView('users');
    }
  } else {
    u.status = 'active';
    saveState();
    renderView('users');
  }
}

function openAddUserModal() {
  const nextId = window.getNextPrimarySystemId();
  const name = prompt(`اسم المستخدم الجديد (المعرف الأساسي التلقائي: #${nextId}):`);
  if (!name) return;
  const specialId = prompt('المعرف المميز (Special ID) - اختياري:', String(Math.floor(1000000 + Math.random() * 9000000)));
  const family = prompt('اسم العائلة:', 'عائلة الملوك');

  const newUser = {
    id: nextId,
    primaryId: nextId,
    specialId: specialId || String(Date.now().toString().slice(-6)),
    gameUuid: `${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}-4a84-90aa-${Date.now().toString().slice(-12)}`,
    displayName: name,
    phone: '+96650' + Math.floor(1000000 + Math.random() * 9000000),
    email: `user${nextId}@gala.live`,
    family: family || 'عائلة الملوك',
    coins: 500000,
    diamonds: 1000,
    level: 1,
    vipLevel: 0,
    status: 'active',
    roles: ['USER'],
    functionalRoleCode: null,
    roleTitle: 'مستخدم أساسي'
  };

  users.unshift(newUser);
  saveState();
  renderView('users');
  alert(`✅ تم إنشاء المستخدم بنجاح بالمعرف الأساسي التلقائي #${nextId}`);
}

// =========================================================================
// نظام منح وتعيين الصلاحيات والأدوار بالمعرف الأساسي الثابت (Primary System ID)
// =========================================================================
window.openAssignRoleModal = function(userId) {
  const u = users.find(x => String(x.id) === String(userId) || String(x.primaryId) === String(userId));
  if (!u) {
    alert('لم يتم العثور على حساب المستخدم المحدد!');
    return;
  }

  const modal = document.getElementById('roleAssignmentModal');
  const modalContent = document.getElementById('roleAssignmentModalContent');
  if (!modal || !modalContent) return;

  // تحديد الدور الحالي والرمز الوظيفي
  const currentRole = (u.roles && u.roles[0]) || 'USER';
  const currentCode = u.functionalRoleCode || '';
  
  // توليد رمز مقترح للمندوب الجديد مع الحفاظ على تسلسل الرموز الحالية
  let nextDelNum = 401;
  if (Array.isArray(agencyDelegates) && agencyDelegates.length > 0) {
    agencyDelegates.forEach(d => {
      const match = d.id && d.id.match(/DEL-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num >= nextDelNum) nextDelNum = num + 1;
      }
    });
  }
  const suggestedDelCode = currentCode.startsWith('DEL-') ? currentCode : `DEL-${nextDelNum}`;
  const suggestedMgrCode = currentCode.startsWith('MGR-') ? currentCode : `MGR-990${agencyManagers.length + 1}`;
  const suggestedAgCode = currentCode.startsWith('AG-') ? currentCode : `AG-${agencies.length + 101}`;

  const currentDel = agencyDelegates.find(d => d.primaryUserId === u.id || d.id === currentCode);
  const currentRate = currentDel ? currentDel.commissionRate : 14.0;
  const currentMgrId = currentDel ? currentDel.managerId : (agencyManagers[0] ? agencyManagers[0].id : 'MGR-9901');

  modalContent.innerHTML = `
    <!-- Header -->
    <div class="px-6 py-5 border-b-2 border-slate-300 bg-slate-50 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 border border-purple-300 flex items-center justify-center font-black shadow-xs">
          <i data-lucide="shield-check" class="w-5 h-5"></i>
        </div>
        <div>
          <h3 class="font-black text-slate-950 text-base">منح وربط الصلاحيات الوظيفية بالمعرف الأساسي</h3>
          <p class="text-xs text-slate-500 font-bold">ربط الدور الوظيفي مباشرة بالهوية الرقمية الأساسية للمستخدم دون إنشاء حساب مكرر</p>
        </div>
      </div>
      <button 
        type="button" 
        onclick="window.closeAssignRoleModal()"
        class="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition cursor-pointer">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>

    <!-- Body -->
    <div class="p-6 overflow-y-auto max-h-[calc(95vh-150px)] space-y-5 text-slate-900">
      <!-- User Summary Card -->
      <div class="rounded-2xl border-2 border-slate-300 bg-[#f7fbfd] p-4.5 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xs border border-slate-700">
              #${u.id}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-black text-slate-950 text-base">${u.displayName}</span>
                <span class="text-xs font-mono font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">#${u.specialId}</span>
              </div>
              <div class="text-xs text-slate-500 font-bold mt-0.5">
                ${u.family || 'عائلة الملوك'} • الجوال: <span class="font-mono">${u.phone || 'غير مسجل'}</span>
              </div>
            </div>
          </div>

          <div class="text-left">
            <div class="text-[11px] text-slate-500 font-bold">الصلاحية الحالية:</div>
            <div class="mt-0.5">
              ${u.functionalRoleCode ? `
                <span class="inline-flex items-center gap-1 font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-purple-100 text-purple-950 border border-purple-300">
                  <i data-lucide="badge-check" class="w-3.5 h-3.5 text-purple-700"></i>
                  <span>${u.roleTitle || u.functionalRoleCode}</span>
                </span>
              ` : `
                <span class="text-xs font-bold text-slate-600 bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-300">مستخدم أساسي</span>
              `}
            </div>
          </div>
        </div>

        <!-- Rule Notice Banner -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-950 font-bold">
          <i data-lucide="info" class="w-4 h-4 text-blue-700 shrink-0 mt-0.5"></i>
          <div>
            <strong>توجيه إداري:</strong> عند منح أي صلاحية وظيفية (مندوب، وكيل معتمد، مدير وكالات)، يقوم السيرفر بربط الصلاحية والرمز الوظيفي بالمعرف الأساسي الثابت <strong>(#${u.id})</strong> مباشرة، مع الحفاظ الكامل على رمزه الوظيفي وسجلاته.
          </div>
        </div>
      </div>

      <!-- Role Selection Form -->
      <form id="assignRoleForm" onsubmit="event.preventDefault(); window.submitRoleAssignment('${u.id}');" class="space-y-4">
        <div>
          <label class="block text-xs font-black text-slate-800 mb-1.5">نوع الصلاحية / الدور الوظيفي المطلوب منحه:</label>
          <select 
            id="assignRoleTypeSelect" 
            onchange="window.onRoleSelectionTypeChange()"
            class="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-950 focus:border-purple-600 focus:outline-hidden transition shadow-xs">
            <option value="DELEGATE" ${currentRole === 'DELEGATE' ? 'selected' : ''}>🌟 مندوب استقطاب وكلاء معتمد (Delegate)</option>
            <option value="OFFICIAL_AGENT" ${currentRole === 'OFFICIAL_AGENT' ? 'selected' : ''}>🏢 وكيل رسمي معتمد (Official Agency Owner)</option>
            <option value="BROKER" ${currentRole === 'BROKER' ? 'selected' : ''}>🤝 وسيط وكالة معتمد (Agency Broker)</option>
            <option value="HOST" ${currentRole === 'HOST' ? 'selected' : ''}>🎙️ مضيف / صانع محتوى وبث مباشر (Live Host)</option>
            <option value="AGENCY_MANAGER" ${currentRole === 'AGENCY_MANAGER' ? 'selected' : ''}>👑 مدير عام / إقليمي للوكالات (Agency Manager)</option>
            <option value="USER" ${currentRole === 'USER' && !u.functionalRoleCode ? 'selected' : ''}>👤 إلغاء الصلاحيات والعودة لمستخدم أساسي</option>
          </select>
        </div>

        <!-- DELEGATE FIELDS -->
        <div id="assignRoleDelegateFields" class="space-y-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-black text-slate-700 mb-1">الرمز الوظيفي للمندوب (ثابت ومعتمد):</label>
              <input 
                type="text" 
                id="assignRoleDelCodeInput" 
                value="${suggestedDelCode}" 
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-black text-purple-950 focus:border-purple-600 focus:outline-hidden" />
              <span class="text-[10px] text-slate-500 font-bold block mt-0.5">الحفاظ على الرموز الحالية (DEL-401 فما فوق)</span>
            </div>
            <div>
              <label class="block text-xs font-black text-slate-700 mb-1">نسبة العمولة المقررة للمندوب %:</label>
              <div class="relative">
                <input 
                  type="number" 
                  step="0.5" 
                  id="assignRoleDelRateInput" 
                  value="${currentRate}" 
                  class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-black text-amber-950 focus:border-purple-600 focus:outline-hidden" />
                <span class="absolute left-3 top-2 text-xs font-black text-amber-800">%</span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-slate-700 mb-1">مدير الوكالات المشرف التابع له المندوب:</label>
            <select 
              id="assignRoleDelManagerSelect" 
              class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-950 focus:border-purple-600 focus:outline-hidden">
              ${agencyManagers.map(m => `
                <option value="${m.id}" ${m.id === currentMgrId ? 'selected' : ''}>
                  ${m.name} (${m.id}) - نسبة المدير: ${m.profitSharePercent || 50}%
                </option>
              `).join('')}
            </select>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-black text-slate-700 mb-1">المدينة:</label>
              <input 
                type="text" 
                id="assignRoleDelCityInput" 
                value="${currentDel ? currentDel.city : 'الرياض'}" 
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:border-purple-600 focus:outline-hidden" />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-700 mb-1">الدولة:</label>
              <input 
                type="text" 
                id="assignRoleDelCountryInput" 
                value="${currentDel ? currentDel.country : 'المملكة العربية السعودية'}" 
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:border-purple-600 focus:outline-hidden" />
            </div>
          </div>
        </div>

        <!-- AGENT FIELDS -->
        <div id="assignRoleAgentFields" class="hidden space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <label class="block text-xs font-black text-slate-700 mb-1">رمز الوكالة المعتمد:</label>
            <input 
              type="text" 
              id="assignRoleAgCodeInput" 
              value="${suggestedAgCode}" 
              class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-black text-sky-950 focus:border-sky-600 focus:outline-hidden" />
          </div>
          <div>
            <label class="block text-xs font-black text-slate-700 mb-1">اسم الوكالة الرسمية:</label>
            <input 
              type="text" 
              id="assignRoleAgNameInput" 
              value="وكالة ${u.displayName} الرسمية" 
              class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-950 focus:border-sky-600 focus:outline-hidden" />
          </div>
        </div>

        <!-- MANAGER FIELDS -->
        <div id="assignRoleManagerFields" class="hidden space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <label class="block text-xs font-black text-slate-700 mb-1">رمز الإدارة المعتمد:</label>
            <input 
              type="text" 
              id="assignRoleMgrCodeInput" 
              value="${suggestedMgrCode}" 
              class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-black text-amber-950 focus:border-amber-600 focus:outline-hidden" />
          </div>
          <div>
            <label class="block text-xs font-black text-slate-700 mb-1">نسبة أرباح الإدارة %:</label>
            <input 
              type="number" 
              id="assignRoleMgrProfitInput" 
              value="50.0" 
              class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-black text-amber-950 focus:border-amber-600 focus:outline-hidden" />
          </div>
        </div>

        <!-- BROKER FIELDS -->
        <div id="assignRoleBrokerFields" class="hidden space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <label class="block text-xs font-black text-slate-700 mb-1">الوكالة الرسمية التابع لها الوسيط:</label>
            <select 
              id="assignRoleBrokerAgencySelect" 
              class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-950 focus:border-purple-600 focus:outline-hidden">
              ${agencies.map(a => `
                <option value="${a.id}">
                  ${a.name} (${a.id}) - الوكيل: ${a.owner}
                </option>
              `).join('')}
            </select>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-black text-slate-700 mb-1">رمز الوسيط المعتمد:</label>
              <input 
                type="text" 
                id="assignRoleBrokerCodeInput" 
                value="BRK-${agencies[0] ? agencies[0].id.replace('AG-', '') : '101'}-${agencyBrokers.length + 1}" 
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-black text-slate-950 focus:border-purple-600 focus:outline-hidden" />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-700 mb-1">نسبة عمولة الوسيط %:</label>
              <input 
                type="number" 
                step="0.5" 
                id="assignRoleBrokerRateInput" 
                value="3.5" 
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-black text-slate-950 focus:border-purple-600 focus:outline-hidden" />
            </div>
          </div>
        </div>

        <!-- HOST FIELDS -->
        <div id="assignRoleHostFields" class="hidden space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <label class="block text-xs font-black text-slate-700 mb-1">الوكالة الرسمية التابع لها المضيف:</label>
            <select 
              id="assignRoleHostAgencySelect" 
              class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-950 focus:border-purple-600 focus:outline-hidden">
              ${agencies.map(a => `
                <option value="${a.id}">
                  ${a.name} (${a.id})
                </option>
              `).join('')}
            </select>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-black text-slate-700 mb-1">رمز المضيف المعتمد:</label>
              <input 
                type="text" 
                id="assignRoleHostCodeInput" 
                value="HOST-${agencies[0] ? agencies[0].id.replace('AG-', '') : '101'}-${String(agencyHosts.length + 1).padStart(2, '0')}" 
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-black text-slate-950 focus:border-purple-600 focus:outline-hidden" />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-700 mb-1">تارجت الكوينز الشهري:</label>
              <input 
                type="number" 
                id="assignRoleHostTargetInput" 
                value="2500000" 
                class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-black text-slate-950 focus:border-purple-600 focus:outline-hidden" />
            </div>
          </div>
        </div>

        <!-- Modal Actions Footer -->
        <div class="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button 
            type="button" 
            onclick="window.closeAssignRoleModal()" 
            class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer border border-slate-300">
            إلغاء
          </button>
          <button 
            type="submit" 
            class="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs">
            <i data-lucide="check-circle" class="w-4 h-4"></i>
            <span>تأكيد وحفظ الصلاحية بالمعرف الأساسي</span>
          </button>
        </div>
      </form>
    </div>
  `;

  modal.classList.remove('hidden');
  window.onRoleSelectionTypeChange();
  lucide.createIcons();
};

window.closeAssignRoleModal = function() {
  const modal = document.getElementById('roleAssignmentModal');
  if (modal) modal.classList.add('hidden');
};

window.onRoleSelectionTypeChange = function() {
  const select = document.getElementById('assignRoleTypeSelect');
  if (!select) return;
  const roleType = select.value;

  const delFields = document.getElementById('assignRoleDelegateFields');
  const agFields = document.getElementById('assignRoleAgentFields');
  const mgrFields = document.getElementById('assignRoleManagerFields');
  const brkFields = document.getElementById('assignRoleBrokerFields');
  const hostFields = document.getElementById('assignRoleHostFields');

  if (delFields) delFields.classList.toggle('hidden', roleType !== 'DELEGATE');
  if (agFields) agFields.classList.toggle('hidden', roleType !== 'OFFICIAL_AGENT');
  if (mgrFields) mgrFields.classList.toggle('hidden', roleType !== 'AGENCY_MANAGER');
  if (brkFields) brkFields.classList.toggle('hidden', roleType !== 'BROKER');
  if (hostFields) hostFields.classList.toggle('hidden', roleType !== 'HOST');
};

window.submitRoleAssignment = function(userId) {
  const u = users.find(x => String(x.id) === String(userId) || String(x.primaryId) === String(userId));
  if (!u) return;

  const roleType = document.getElementById('assignRoleTypeSelect').value;

  if (roleType === 'DELEGATE') {
    const code = document.getElementById('assignRoleDelCodeInput').value.trim() || 'DEL-401';
    const rate = parseFloat(document.getElementById('assignRoleDelRateInput').value) || 14.0;
    const mgrId = document.getElementById('assignRoleDelManagerSelect').value;
    const mgr = agencyManagers.find(m => m.id === mgrId) || agencyManagers[0];
    const city = document.getElementById('assignRoleDelCityInput').value.trim() || 'الرياض';
    const country = document.getElementById('assignRoleDelCountryInput').value.trim() || 'السعودية';

    // 1. تحديث حساب المستخدم نفسه (المعرف الأساسي ثابت)
    u.roles = ['DELEGATE'];
    u.functionalRoleCode = code;
    u.roleTitle = `مندوب استقطاب وكلاء معتمد (${code}) 🌟`;

    // 2. تحديث أو إضافة سجل المندوب بربطه بالمعرف الأساسي الثابت
    let delRecord = agencyDelegates.find(d => d.primaryUserId === u.id || d.id === code);
    if (delRecord) {
      delRecord.primaryUserId = u.id;
      delRecord.id = code;
      delRecord.name = `${u.displayName} (مندوب معتمد 🌟)`;
      delRecord.managerId = mgr.id;
      delRecord.managerName = mgr.name;
      delRecord.commissionRate = rate;
      delRecord.city = city;
      delRecord.country = country;
      delRecord.phone = u.phone;
    } else {
      agencyDelegates.push({
        id: code,
        primaryUserId: u.id,
        managerId: mgr.id,
        managerName: mgr.name,
        name: `${u.displayName} (مندوب معتمد 🌟)`,
        roleTitle: 'مندوب استقطاب وكلاء معتمد',
        commissionRate: rate,
        phone: u.phone || '+966500000000',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        invitedAgenciesCount: 0,
        totalRevenue: 0,
        earnedCoins: 0,
        country: country,
        city: city,
        status: 'معتمد',
        joinDate: new Date().toISOString().split('T')[0]
      });
      if (mgr) mgr.delegatesCount = (mgr.delegatesCount || 0) + 1;
    }

    auditLogs.unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      user: 'superadmin',
      action: 'ASSIGN_ROLE_DELEGATE',
      target: `Assigned DELEGATE ${code} to primary ID #${u.id} (${u.displayName})`,
      time: 'الآن'
    });

    alert(`✅ تم ربط صلاحية المندوب (${code}) بالمعرف الأساسي للمستخدم #${u.id} بنجاح دون إنشاء حساب مكرر.`);

  } else if (roleType === 'OFFICIAL_AGENT') {
    const agCode = document.getElementById('assignRoleAgCodeInput').value.trim() || 'AG-101';
    const agName = document.getElementById('assignRoleAgNameInput').value.trim() || 'وكالة رسمية';

    u.roles = ['OFFICIAL_AGENT'];
    u.functionalRoleCode = agCode;
    u.roleTitle = `وكيل رسمي معتمد (${agCode})`;

    let agRecord = agencies.find(a => a.id === agCode);
    if (agRecord) {
      agRecord.owner = u.displayName;
      agRecord.ownerId = String(u.specialId);
      agRecord.ownerPrimaryId = u.id;
    }

    alert(`✅ تم ربط صلاحية الوكيل الرسمي (${agCode}) بالمعرف الأساسي للمستخدم #${u.id} بنجاح.`);

  } else if (roleType === 'AGENCY_MANAGER') {
    const mgrCode = document.getElementById('assignRoleMgrCodeInput').value.trim() || 'MGR-9901';
    const profitRate = parseFloat(document.getElementById('assignRoleMgrProfitInput').value) || 50.0;

    u.roles = ['AGENCY_MANAGER'];
    u.functionalRoleCode = mgrCode;
    u.roleTitle = `مدير عام وكالات معتمد (${mgrCode}) 👑`;

    let mgrRecord = agencyManagers.find(m => m.id === mgrCode || m.primaryUserId === u.id);
    if (mgrRecord) {
      mgrRecord.primaryUserId = u.id;
      mgrRecord.name = `إدارة ${u.displayName} (${mgrCode})`;
      mgrRecord.profitSharePercent = profitRate;
    } else {
      agencyManagers.push({
        id: mgrCode,
        primaryUserId: u.id,
        name: `إدارة ${u.displayName} (${mgrCode})`,
        roleTitle: 'مدير وكالات إقليمي معتمد 👑',
        profitSharePercent: profitRate,
        delegatesCount: 0,
        totalAgencies: 0,
        totalRevenue: 0,
        totalEarnedCoins: 0,
        phone: u.phone,
        nationalId: String(u.id),
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        country: 'السعودية',
        city: 'الرياض',
        status: 'نشط',
        joinedDate: new Date().toISOString().split('T')[0]
      });
    }

    alert(`✅ تم ربط صلاحية مدير الوكالات (${mgrCode}) بالمعرف الأساسي للمستخدم #${u.id} بنجاح.`);

  } else if (roleType === 'BROKER') {
    const brkCode = document.getElementById('assignRoleBrokerCodeInput').value.trim() || 'BRK-101-1';
    const rate = parseFloat(document.getElementById('assignRoleBrokerRateInput').value) || 3.5;
    const agId = document.getElementById('assignRoleBrokerAgencySelect').value;
    const ag = agencies.find(a => a.id === agId) || agencies[0];

    u.roles = ['BROKER'];
    u.functionalRoleCode = brkCode;
    u.roleTitle = `وسيط وكالة معتمد (${brkCode})`;

    let brkRecord = agencyBrokers.find(b => b.id === brkCode || b.primaryUserId === u.id);
    if (brkRecord) {
      brkRecord.primaryUserId = u.id;
      brkRecord.userId = String(u.id);
      brkRecord.name = u.displayName;
      brkRecord.commissionRate = rate;
      brkRecord.agencyId = ag.id;
    } else {
      agencyBrokers.push({
        id: brkCode,
        agencyId: ag.id,
        name: u.displayName,
        userId: String(u.id),
        primaryUserId: u.id,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        hostsCount: 0,
        totalRevenue: 0,
        commissionRate: rate,
        earnedCoins: 0,
        status: 'نشط',
        phone: u.phone || '+966500000000',
        joinDate: new Date().toISOString().split('T')[0]
      });
      ag.brokersCount = (ag.brokersCount || 0) + 1;
    }

    alert(`✅ تم ربط صلاحية الوسيط (${brkCode}) بالمعرف الأساسي للمستخدم #${u.id} بنجاح.`);

  } else if (roleType === 'HOST') {
    const hostCode = document.getElementById('assignRoleHostCodeInput').value.trim() || 'HOST-101-01';
    const target = parseFloat(document.getElementById('assignRoleHostTargetInput').value) || 2500000;
    const agId = document.getElementById('assignRoleHostAgencySelect').value;
    const ag = agencies.find(a => a.id === agId) || agencies[0];

    u.roles = ['HOST'];
    u.functionalRoleCode = hostCode;
    u.roleTitle = `مضيف بث مباشر (${hostCode})`;

    let hostRecord = agencyHosts.find(h => h.id === hostCode || h.primaryUserId === u.id);
    if (hostRecord) {
      hostRecord.primaryUserId = u.id;
      hostRecord.userId = String(u.id);
      hostRecord.name = u.displayName;
      hostRecord.monthlyTarget = target;
      hostRecord.agencyId = ag.id;
    } else {
      agencyHosts.push({
        id: hostCode,
        agencyId: ag.id,
        brokerId: null,
        brokerName: 'مباشر مع الوكالة',
        name: u.displayName,
        userId: String(u.id),
        primaryUserId: u.id,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        hoursAchieved: 0,
        monthlyRevenue: 0,
        monthlyTarget: target,
        liveStatus: 'غير متصل',
        status: 'نشط',
        category: 'بث مباشر',
        joinDate: new Date().toISOString().split('T')[0]
      });
      ag.hosts = (ag.hosts || 0) + 1;
    }

    alert(`✅ تم ربط صلاحية المضيف (${hostCode}) بالمعرف الأساسي للمستخدم #${u.id} بنجاح.`);

  } else {
    // إلغاء الصلاحية والعودة لمستخدم عادي
    const oldCode = u.functionalRoleCode;
    u.roles = ['USER'];
    u.functionalRoleCode = null;
    u.roleTitle = 'مستخدم أساسي';

    alert(`✅ تم إلغاء الصلاحيات الوظيفية السابقة (${oldCode || 'لا يوجد'}) وإعادة الحساب إلى مستخدم أساسي #${u.id}.`);
  }

  saveState();
  window.closeAssignRoleModal();

  // تحديث العرض المناسب
  const container = document.getElementById('dynamicViewContainer');
  if (currentTab === 'users') {
    renderView('users');
  } else if (currentTab === 'agency_hierarchy' && container) {
    renderAgencyHierarchyView(container);
  }
};

// =========================================================================
// VIEW 3: GALA WEBSITE REQUESTS (طلبات ويب سايت غلا)
// =========================================================================
function renderGalaRequestsView(container) {
  window.renderStandardTable(container, {
    tableId: 'gala_requests_table',
    title: 'طلبات ويب سايت غلا الرسمية (Portal Inquiries)',
    subtitle: 'الطلبات الواردة مباشرة من نموذج البوابة الرسمية لتطبيق غلا لايف شات',
    icon: 'message-square',
    badge: `${galaRequests.length} طلبات جديدة`,
    data: galaRequests,
    initialSortKey: 'id',
    initialSortDir: 'asc',
    columns: [
      { key: 'id', label: 'المعرف ID', sortable: true, isCode: true, align: 'center', width: '90px' },
      { 
        key: 'name', 
        label: 'اسم العميل / المستخدم', 
        sortable: true, 
        render: (val) => `<span class="font-black text-slate-950 text-sm">${val}</span>` 
      },
      { 
        key: 'phone', 
        label: 'رقم الهاتف', 
        sortable: true, 
        render: (val) => `<span class="font-mono text-xs font-bold text-slate-900" dir="ltr">${val}</span>` 
      },
      { 
        key: 'subject', 
        label: 'موضوع الاستفسار / الرسالة', 
        sortable: true, 
        render: (val) => `<span class="text-xs text-slate-800 font-bold whitespace-nowrap">${val}</span>` 
      },
      { 
        key: 'date', 
        label: 'تاريخ الإرسال', 
        sortable: true, 
        render: (val) => `<span class="font-mono text-xs text-slate-700 font-bold">${val}</span>` 
      },
      { 
        key: 'status', 
        label: 'الحالة', 
        sortable: true, 
        isStatus: true, 
        align: 'center' 
      }
    ],
    rowActions: [
      {
        id: 'action',
        title: 'اتخاذ إجراء والتواصل مع العميل',
        icon: 'check-circle',
        className: 'bg-emerald-100 text-emerald-950 border border-emerald-300 hover:bg-emerald-200 font-bold',
        onClick: (row) => alert(`تمت معالجة الطلب #${row.id} للعميل ${row.name} والتواصل معه!`)
      }
    ]
  });
}

// =========================================================================
// VIEW 4: AGENCIES & SUBMENUS (إدارة الوكالات)
// =========================================================================
window._currentAgencyDetailId = null;
window._currentAgencyTab = 'brokers'; // 'brokers' | 'hosts'
window._currentBrokerFilter = null; // brokerId or null

window.openAgencyDetail = function(agencyId, initialTab = 'brokers') {
  window._currentAgencyDetailId = agencyId;
  window._currentAgencyTab = initialTab;
  window._currentBrokerFilter = null;
  renderView('agencies');
};

window.closeAgencyDetail = function() {
  window._currentAgencyDetailId = null;
  window._currentBrokerFilter = null;
  const breadcrumb = document.getElementById('currentViewBreadcrumb');
  if (breadcrumb) {
    breadcrumb.textContent = 'إدارة الوكالات - الساعات وطلبات الوكالة';
  }
  renderView('agencies');
};

window.switchAgencyDetailTab = function(tabName) {
  window._currentAgencyTab = tabName;
  const container = document.getElementById('dynamicViewContainer');
  if (container && window._currentAgencyDetailId) {
    const ag = agencies.find(a => a.id === window._currentAgencyDetailId) || agencies[0];
    renderAgencyDetailView(container, ag);
  }
};

window.filterHostsByBroker = function(brokerId) {
  window._currentAgencyTab = 'hosts';
  window._currentBrokerFilter = brokerId;
  const container = document.getElementById('dynamicViewContainer');
  if (container && window._currentAgencyDetailId) {
    const ag = agencies.find(a => a.id === window._currentAgencyDetailId) || agencies[0];
    renderAgencyDetailView(container, ag);
  }
};

window.clearBrokerFilter = function() {
  window._currentBrokerFilter = null;
  const container = document.getElementById('dynamicViewContainer');
  if (container && window._currentAgencyDetailId) {
    const ag = agencies.find(a => a.id === window._currentAgencyDetailId) || agencies[0];
    renderAgencyDetailView(container, ag);
  }
};

function renderAgenciesView(container, tabId) {
  // If user drilled down into a specific agency, render its detail view
  if (tabId === 'agencies' && window._currentAgencyDetailId) {
    const ag = agencies.find(a => a.id === window._currentAgencyDetailId);
    if (ag) {
      renderAgencyDetailView(container, ag);
      return;
    } else {
      window._currentAgencyDetailId = null;
    }
  }

  let subHeader = 'إدارة الوكالات المعتمدة';
  if (tabId === 'agency_hours') subHeader = 'الساعات المحققة للبث المباشر والمضيفين';
  if (tabId === 'agency_create_req') subHeader = 'طلبات إنشاء وكالة جديدة';
  if (tabId === 'agency_join_req') subHeader = 'طلبات الانضمام للوكالات';
  if (tabId === 'agency_salaries') subHeader = 'التحكم في رواتب المضيفين والوكلاء';
  if (tabId === 'agency_target_reports') subHeader = 'تقارير التارجت المتحقق والنسب الشهرية';

  window.renderStandardTable(container, {
    tableId: 'agencies_table_' + tabId,
    title: subHeader,
    subtitle: 'متابعة حسابات الوكلاء، تارجت المضيفين، ونسب العمولات الرسمية في قالب قياسي منسق (انقر على أي وكالة لفتح تفاصيلها)',
    icon: 'building',
    badge: `${agencies.length} وكالة`,
    data: agencies,
    initialSortKey: 'coins',
    initialSortDir: 'desc',
    columns: [
      { key: 'id', label: 'رمز الوكالة', sortable: true, isCode: true, align: 'center', width: '90px' },
      { 
        key: 'name', 
        label: 'اسم الوكالة (ملف التفاصيل)', 
        sortable: true, 
        render: (val, row) => `
          <button 
            type="button"
            onclick="window.openAgencyDetail('${row.id}')" 
            title="انقر لفتح ملف وتفاصيل الوكالة بالكامل"
            class="font-black text-slate-950 text-sm hover:text-sky-700 hover:underline cursor-pointer inline-flex items-center gap-2 group transition text-right">
            <span class="w-6 h-6 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 text-xs shrink-0 group-hover:scale-105 transition">
              <i data-lucide="building" class="w-3.5 h-3.5"></i>
            </span>
            <span>${val}</span>
            <span class="text-[10px] text-sky-900 bg-[#e6f1f4] border border-sky-300 px-1.5 py-0.5 rounded-md font-bold shrink-0">عرض التفاصيل ←</span>
          </button>
        ` 
      },
      { 
        key: 'owner', 
        label: 'المالك المعتمد (المعرف الأساسي)', 
        sortable: true, 
        render: (val, row) => `
          <div class="inline-flex flex-col text-right">
            <span class="font-bold text-slate-900">${val}</span>
            <span class="text-[10px] font-mono text-emerald-800 font-bold mt-0.5">معرف أساسي: #${row.ownerPrimaryId || row.ownerId || '1001010'}</span>
          </div>
        ` 
      },
      { 
        key: 'coins', 
        label: 'رصيد الكوينز', 
        sortable: true, 
        render: (val) => `<span class="font-mono font-black text-amber-800 text-sm">${Number(val).toLocaleString()} 🪙</span>` 
      },
      { 
        key: 'commission', 
        label: 'العمولة %', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="font-mono font-black text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-lg text-xs">${val}%</span>` 
      },
      { 
        key: 'hosts', 
        label: 'المضيفين', 
        sortable: true, 
        align: 'center',
        render: (val, row) => `
          <button 
            type="button"
            onclick="window.openAgencyDetail('${row.id}', 'hosts')"
            class="font-mono font-bold text-slate-950 hover:text-sky-700 cursor-pointer underline decoration-dotted">
            ${val} مضيف
          </button>
        ` 
      },
      { 
        key: 'hours', 
        label: 'الساعات', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="font-mono font-black text-slate-900">${val}h</span>` 
      },
      { 
        key: 'achievedTarget', 
        label: 'التارجت المتحقق', 
        sortable: true, 
        render: (val, row) => {
          const pct = Math.min(100, Math.round((val / row.target) * 100));
          return `
            <div class="space-y-1">
              <div class="flex justify-between text-[11px] font-mono font-bold text-slate-950">
                <span>${Number(val).toLocaleString()}</span>
                <span class="text-emerald-800">${pct}%</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full" style="width: ${pct}%"></div>
              </div>
            </div>
          `;
        }
      }
    ],
    rowActions: [
      {
        id: 'view_details',
        title: 'عرض تفاصيل الوكالة (الوسطاء، المضيفين، والأرباح)',
        icon: 'layout-grid',
        className: 'bg-[#e6f1f4] text-slate-950 border border-slate-300 hover:bg-[#d5e7ec] font-black',
        onClick: (row) => window.openAgencyDetail(row.id)
      },
      {
        id: 'recharge',
        title: 'شحن كوينز للوكالة',
        icon: 'coins',
        className: 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 font-bold',
        onClick: (row) => rechargeAgency(row.id)
      }
    ],
    onAdd: openAddAgencyModal,
    addLabel: 'إضافة وكالة جديدة'
  });
}

// =========================================================================
// AGENCY DETAIL VIEW (تفاصيل الوكالة - الانتقال السلس والوسطاء والمضيفين)
// =========================================================================
function renderAgencyDetailView(container, agency) {
  // Update header breadcrumb
  const topBreadcrumb = document.getElementById('currentViewBreadcrumb');
  if (topBreadcrumb) {
    topBreadcrumb.innerHTML = `
      <div class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600">
        <button onclick="window.closeAgencyDetail()" class="hover:text-amber-700 cursor-pointer flex items-center gap-1 font-bold">
          <span>الوكالات المعتمدة</span>
        </button>
        <span class="text-slate-400">/</span>
        <span class="text-slate-950 font-black">${agency.name}</span>
      </div>
    `;
  }

  // Filter brokers & hosts for this agency
  const agencyBrokersList = agencyBrokers.filter(b => b.agencyId === agency.id);
  const agencyHostsList = agencyHosts.filter(h => h.agencyId === agency.id);

  // Compute metrics
  const totalHostRevenue = agencyHostsList.reduce((sum, h) => sum + (h.monthlyRevenue || 0), agency.achievedTarget || 0);
  const totalBrokersHosts = agencyBrokersList.reduce((sum, b) => sum + (b.hostsCount || 0), 0);
  const directHostsCount = agencyHostsList.filter(h => !h.brokerId || h.brokerName === 'مباشر مع الوكالة').length;
  const liveHostsCount = agencyHostsList.filter(h => h.liveStatus && h.liveStatus.includes('مباشر')).length;
  const targetPct = Math.min(100, Math.round((agency.achievedTarget / (agency.target || 1)) * 100));

  // Determine active tab
  const activeTab = window._currentAgencyTab || 'brokers';

  // Build View Container
  container.innerHTML = `
    <div class="w-full space-y-5">
      
      <!-- 1. BREADCRUMB & HEADER ACTION BAR (مسار التنقل وأزرار التحكم السريعة) -->
      <div class="w-full bg-white rounded-2xl border-2 border-slate-300 p-4 sm:p-5 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.05),0_1px_3px_rgba(15,23,42,0.03)]">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <!-- Return & Agency Title -->
          <div class="flex items-center gap-3.5 flex-wrap">
            <button 
              onclick="window.closeAgencyDetail()" 
              class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-black text-xs flex items-center gap-2 cursor-pointer transition shadow-sm">
              <i data-lucide="arrow-right" class="w-4 h-4 text-slate-800"></i>
              <span>العودة لقائمة الوكالات</span>
            </button>
            <div class="h-6 w-px bg-slate-300 hidden sm:block"></div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h2 class="text-base sm:text-lg font-black text-slate-950">${agency.name}</h2>
                <span class="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-black">
                  رمز: ${agency.id}
                </span>
                <span class="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                  ● ${agency.status || 'نشطة'}
                </span>
              </div>
              <p class="text-xs font-bold text-slate-600 mt-1 flex items-center gap-3">
                <span>المالك المعتمد: <strong class="text-slate-900">${agency.owner}</strong> (المعرف الأساسي: <strong class="text-emerald-800 font-mono">#${agency.ownerPrimaryId || agency.ownerId || '1001010'}</strong>)</span>
                <span class="text-slate-300">•</span>
                <span>نسبة العمولة: <strong class="text-emerald-800">${agency.commission}%</strong></span>
              </p>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-2 flex-wrap">
            <button 
              onclick="rechargeAgency('${agency.id}')" 
              class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer transition shadow-sm">
              <i data-lucide="coins" class="w-4 h-4"></i>
              <span>شحن كوينز للوكالة</span>
            </button>
            <button 
              onclick="openAddBrokerModal('${agency.id}')" 
              class="px-3.5 py-2 rounded-xl bg-[#e6f1f4] hover:bg-[#d5e7ec] text-slate-950 border border-slate-300 font-black text-xs flex items-center gap-2 cursor-pointer transition">
              <i data-lucide="user-plus" class="w-4 h-4 text-sky-800"></i>
              <span>إضافة وسيط</span>
            </button>
            <button 
              onclick="openAddHostModal('${agency.id}')" 
              class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-bold text-xs flex items-center gap-2 cursor-pointer transition">
              <i data-lucide="mic" class="w-4 h-4 text-purple-700"></i>
              <span>إضافة مضيف</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 2. METRICS HEADER (القسم العلوي: بطاقات إحصائية سريعة وشاملة للوكالة) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Metric 1: إجمالي الدخل / الأرباح -->
        <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm hover:shadow-md transition">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-slate-700">إجمالي الدخل والأرباح</span>
            <span class="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center">
              <i data-lucide="coins" class="w-4 h-4"></i>
            </span>
          </div>
          <div class="mt-2.5">
            <div class="text-xl font-black text-slate-950 font-mono">${Number(agency.coins).toLocaleString()} 🪙</div>
            <div class="text-[11px] font-bold text-slate-600 mt-1 flex items-center justify-between">
              <span>الدخل المحقق: <strong class="text-amber-800 font-mono">${Number(agency.achievedTarget).toLocaleString()}</strong></span>
              <span class="text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-bold">عمولة: ${agency.commission}%</span>
            </div>
          </div>
        </div>

        <!-- Metric 2: إجمالي عدد الوسطاء التابعين -->
        <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm hover:shadow-md transition">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-slate-700">الوسطاء التابعين</span>
            <span class="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 border border-sky-300 flex items-center justify-center">
              <i data-lucide="users" class="w-4 h-4"></i>
            </span>
          </div>
          <div class="mt-2.5">
            <div class="text-xl font-black text-slate-950 font-mono">${agencyBrokersList.length} <span class="text-xs font-bold text-slate-600">وسيط رسمي</span></div>
            <div class="text-[11px] font-bold text-slate-600 mt-1 flex items-center justify-between">
              <span>تحت إدارتهم: <strong class="text-slate-900 font-mono">${totalBrokersHosts} مضيف</strong></span>
              <button onclick="window.switchAgencyDetailTab('brokers')" class="text-sky-700 hover:underline font-black cursor-pointer">إدارة الوسطاء ←</button>
            </div>
          </div>
        </div>

        <!-- Metric 3: إجمالي عدد المضيفين -->
        <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm hover:shadow-md transition">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-slate-700">إجمالي المضيفين</span>
            <span class="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 border border-purple-300 flex items-center justify-center">
              <i data-lucide="mic" class="w-4 h-4"></i>
            </span>
          </div>
          <div class="mt-2.5">
            <div class="text-xl font-black text-slate-950 font-mono">${agencyHostsList.length} <span class="text-xs font-bold text-slate-600">صانع محتوى</span></div>
            <div class="text-[11px] font-bold text-slate-600 mt-1 flex items-center justify-between">
              <span>المباشرين: <strong class="text-slate-900 font-mono">${directHostsCount}</strong></span>
              <span class="text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded font-bold">${liveHostsCount} يبث الآن 🔴</span>
            </div>
          </div>
        </div>

        <!-- Metric 4: ساعات البث والتارجت المتحقق -->
        <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm hover:shadow-md transition">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-slate-700">ساعات البث والتارجت</span>
            <span class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center">
              <i data-lucide="clock" class="w-4 h-4"></i>
            </span>
          </div>
          <div class="mt-2.5">
            <div class="flex items-baseline justify-between">
              <span class="text-xl font-black text-slate-950 font-mono">${agency.hours}h</span>
              <span class="text-xs font-black text-emerald-800">${targetPct}% مكتمل</span>
            </div>
            <div class="w-full h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden mt-1.5">
              <div class="h-full bg-emerald-500 rounded-full" style="width: ${targetPct}%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. TABS NAVIGATION (القسم الرئيسي: التبديل السلس بين تبويب الوسطاء وتبويب المضيفين) -->
      <div class="w-full bg-white rounded-2xl border-2 border-slate-300 p-2 shadow-sm flex items-center gap-2">
        <button 
          type="button"
          onclick="window.switchAgencyDetailTab('brokers')" 
          class="flex-1 py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2.5 transition cursor-pointer ${activeTab === 'brokers' ? 'bg-[#e6f1f4] text-slate-950 border-2 border-slate-400 shadow-sm' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'}">
          <i data-lucide="users" class="w-4 h-4 text-sky-800"></i>
          <span>تبويب الوسطاء التابعين للوكالة</span>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${activeTab === 'brokers' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-800'}">
            ${agencyBrokersList.length}
          </span>
        </button>

        <button 
          type="button"
          onclick="window.switchAgencyDetailTab('hosts')" 
          class="flex-1 py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2.5 transition cursor-pointer ${activeTab === 'hosts' ? 'bg-[#e6f1f4] text-slate-950 border-2 border-slate-400 shadow-sm' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'}">
          <i data-lucide="mic" class="w-4 h-4 text-purple-700"></i>
          <span>تبويب كافة المضيفين المرتبطين بالوكالة</span>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${activeTab === 'hosts' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-800'}">
            ${agencyHostsList.length}
          </span>
        </button>
      </div>

      <!-- 4. ACTIVE TAB TABLE CONTAINER -->
      <div id="agencyDetailSubTableContainer" class="w-full"></div>

    </div>
  `;

  // Render the selected tab's table
  const subContainer = document.getElementById('agencyDetailSubTableContainer');
  if (!subContainer) return;

  if (activeTab === 'brokers') {
    renderAgencyBrokersTab(subContainer, agency, agencyBrokersList);
  } else {
    renderAgencyHostsTab(subContainer, agency, agencyHostsList, agencyBrokersList);
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

// 4.1 TAB: BROKERS (تبويب الوسطاء التابعين للوكالة)
function renderAgencyBrokersTab(container, agency, brokersList) {
  window.renderStandardTable(container, {
    tableId: 'agency_brokers_table_' + agency.id,
    title: `قائمة الوسطاء التابعين لوكالة: ${agency.name}`,
    subtitle: 'عرض الوسطاء الرسميين، عدد المضيفين المسجلين تحت كل وسيط، وإمكانية الضغط على الوسيط للانتقال الفوري لمضيفيه',
    icon: 'users',
    badge: `${brokersList.length} وسيط`,
    data: brokersList,
    initialSortKey: 'hostsCount',
    initialSortDir: 'desc',
    columns: [
      { key: 'id', label: 'رمز الوسيط', sortable: true, isCode: true, align: 'center', width: '90px' },
      { 
        key: 'name', 
        label: 'اسم الوسيط', 
        sortable: true, 
        render: (val, row) => `
          <div class="inline-flex items-center gap-2.5 whitespace-nowrap">
            <img src="${row.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" class="w-8 h-8 rounded-full border border-slate-300 object-cover" />
            <div>
              <span class="font-black text-slate-950 text-sm block">${val}</span>
              <span class="text-[11px] font-mono text-emerald-800 font-bold block">معرف أساسي: #${row.primaryUserId || row.userId || '1001021'}</span>
            </div>
          </div>
        ` 
      },
      { 
        key: 'hostsCount', 
        label: 'المضيفين التابعين (اضغط للعرض)', 
        sortable: true, 
        align: 'center',
        render: (val, row) => `
          <button 
            type="button"
            onclick="window.filterHostsByBroker('${row.id}')" 
            title="عرض مضيفي هذا الوسيط فقط في جدول المضيفين"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#e6f1f4] hover:bg-[#d5e7ec] text-slate-950 border border-sky-300 font-black cursor-pointer text-xs transition shadow-sm group">
            <i data-lucide="users" class="w-3.5 h-3.5 text-sky-800 group-hover:scale-110 transition"></i>
            <span>${val} مضيف</span>
            <span class="text-[11px] text-sky-800 underline font-black mr-1">عرضهم ←</span>
          </button>
        ` 
      },
      { 
        key: 'totalRevenue', 
        label: 'إجمالي دخل المضيفين', 
        sortable: true, 
        render: (val) => `<span class="font-mono font-black text-amber-800 text-sm">${Number(val).toLocaleString()} 🪙</span>` 
      },
      { 
        key: 'commissionRate', 
        label: 'نسبة الوسيط %', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="font-mono font-black text-sky-900 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded-lg text-xs">${val}%</span>` 
      },
      { 
        key: 'earnedCoins', 
        label: 'العمولة المكتسبة', 
        sortable: true, 
        render: (val) => `<span class="font-mono font-black text-emerald-800 text-xs">${Number(val).toLocaleString()} 🪙</span>` 
      },
      { 
        key: 'phone', 
        label: 'هاتف التواصل', 
        sortable: false, 
        render: (val) => `<span class="font-mono text-xs text-slate-800 font-bold" dir="ltr">${val}</span>` 
      },
      { 
        key: 'status', 
        label: 'الحالة', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="font-bold text-xs px-2 py-0.5 rounded-md ${val === 'نشط' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-100 text-slate-700 border border-slate-300'}">${val}</span>` 
      }
    ],
    rowActions: [
      {
        id: 'view_broker_hosts',
        title: 'عرض مضيفي هذا الوسيط في جدول المضيفين',
        icon: 'external-link',
        className: 'bg-[#e6f1f4] text-slate-950 border border-slate-300 hover:bg-[#d5e7ec] font-black',
        onClick: (row) => window.filterHostsByBroker(row.id)
      },
      {
        id: 'edit_commission',
        title: 'تعديل نسبة عمولة الوسيط',
        icon: 'percent',
        className: 'bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-200 font-bold',
        onClick: (row) => editBrokerCommission(row.id)
      }
    ],
    onAdd: () => openAddBrokerModal(agency.id),
    addLabel: 'إضافة وسيط جديد'
  });
}

// 4.2 TAB: HOSTS (تبويب المضيفين المرتبطين بالوكالة والوسطاء)
function renderAgencyHostsTab(container, agency, allHostsList, brokersList) {
  // Determine if filtered by a broker
  let hostsToShow = allHostsList;
  let activeBroker = null;
  if (window._currentBrokerFilter) {
    activeBroker = brokersList.find(b => b.id === window._currentBrokerFilter);
    if (activeBroker) {
      hostsToShow = allHostsList.filter(h => h.brokerId === window._currentBrokerFilter);
    }
  }

  // Filter notification strip if active
  const filterNoticeHtml = activeBroker ? `
    <div class="mb-4 p-3.5 rounded-2xl bg-[#e6f1f4] border-2 border-sky-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-slate-900">
      <div class="flex items-center gap-2.5">
        <span class="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
          <i data-lucide="filter" class="w-4 h-4"></i>
        </span>
        <span>
          تمت تصفية الجدول لعرض مضيفي الوسيط: <strong class="text-sky-950 text-sm font-black">${activeBroker.name}</strong> 
          (معرف: #${activeBroker.userId}) - عدد المضيفين: <strong>${hostsToShow.length} مضيف</strong>
        </span>
      </div>
      <button 
        onclick="window.clearBrokerFilter()" 
        class="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 border border-slate-300 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto">
        <i data-lucide="x" class="w-3.5 h-3.5 text-rose-600"></i>
        <span>إلغاء التصفية وعرض كافة مضيفي الوكالة (${allHostsList.length})</span>
      </button>
    </div>
  ` : '';

  // Render Table
  const tableWrapper = document.createElement('div');
  tableWrapper.innerHTML = filterNoticeHtml;
  container.appendChild(tableWrapper);

  window.renderStandardTable(container, {
    tableId: 'agency_hosts_table_' + agency.id,
    title: activeBroker ? `مضيفي الوسيط: ${activeBroker.name} (${agency.name})` : `سجل كافة المضيفين لوكالة: ${agency.name}`,
    subtitle: 'عرض كافة المضيفين المرتبطين بالوكالة (سواء بشكل مباشر أو عبر الوسطاء) مع توضيح اسم الوسيط المسؤول عن كل مضيف',
    icon: 'mic',
    badge: `${hostsToShow.length} مضيف`,
    data: hostsToShow,
    initialSortKey: 'monthlyRevenue',
    initialSortDir: 'desc',
    columns: [
      { 
        key: 'userId', 
        label: 'المعرف الأساسي للمضيف', 
        sortable: true, 
        isCode: true, 
        align: 'center', 
        width: '110px',
        render: (val, row) => `<span class="font-mono font-black text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">#${row.primaryUserId || val}</span>`
      },
      { 
        key: 'name', 
        label: 'اسم المضيف والتصنيف', 
        sortable: true, 
        render: (val, row) => `
          <div class="inline-flex items-center gap-2.5 whitespace-nowrap">
            <img src="${row.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}" class="w-8 h-8 rounded-full border border-slate-300 object-cover" />
            <div>
              <span class="font-black text-slate-950 text-sm block">${val}</span>
              <span class="text-[11px] font-bold text-slate-600 block">${row.category || 'بث مباشر'}</span>
            </div>
          </div>
        ` 
      },
      { 
        key: 'brokerName', 
        label: 'الوسيط المسؤول', 
        sortable: true, 
        render: (val, row) => {
          if (row.brokerId) {
            return `
              <button 
                type="button"
                onclick="window.filterHostsByBroker('${row.brokerId}')" 
                title="تصفية مضيفي هذا الوسيط"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-950 border border-sky-300 font-black cursor-pointer text-xs">
                <i data-lucide="user-check" class="w-3.5 h-3.5 text-sky-800"></i>
                <span>${val}</span>
              </button>
            `;
          }
          return `
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs">
              <i data-lucide="shield" class="w-3 h-3 text-slate-500"></i>
              <span>مباشر مع الوكالة</span>
            </span>
          `;
        }
      },
      { 
        key: 'hoursAchieved', 
        label: 'ساعات البث', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="font-mono font-black text-slate-900">${val}h</span>` 
      },
      { 
        key: 'monthlyRevenue', 
        label: 'الدخل المحقق شهرياً', 
        sortable: true, 
        render: (val) => `<span class="font-mono font-black text-amber-800 text-sm">${Number(val).toLocaleString()} 🪙</span>` 
      },
      { 
        key: 'monthlyTarget', 
        label: 'التارجت المستهدف', 
        sortable: true, 
        render: (val, row) => {
          const pct = Math.min(100, Math.round((row.monthlyRevenue / (val || 1)) * 100));
          return `
            <div class="space-y-1 min-w-[120px]">
              <div class="flex justify-between text-[11px] font-mono font-bold text-slate-950">
                <span>${Number(val).toLocaleString()}</span>
                <span class="text-emerald-800">${pct}%</span>
              </div>
              <div class="w-full h-1.5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full" style="width: ${pct}%"></div>
              </div>
            </div>
          `;
        }
      },
      { 
        key: 'liveStatus', 
        label: 'حالة البث', 
        sortable: true, 
        align: 'center',
        render: (val) => `
          <span class="text-xs font-bold px-2 py-0.5 rounded-md ${val && val.includes('مباشر') ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 animate-pulse' : 'bg-slate-100 text-slate-600 border border-slate-300'}">
            ${val || 'غير متصل'}
          </span>
        ` 
      },
      { 
        key: 'status', 
        label: 'الحالة', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="font-bold text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300">${val}</span>` 
      }
    ],
    rowActions: [
      {
        id: 'view_host_full_profile',
        title: 'عرض التفاصيل الشاملة للمضيف (الراتب، الأجهزة، الهدايا، الكوينز، والشارات)',
        icon: 'user-check',
        className: 'bg-purple-700 hover:bg-purple-800 text-white border border-purple-800 font-black shadow-xs',
        onClick: (row) => window.openHostFullProfile(row.id)
      },
      {
        id: 'edit_host_target',
        title: 'تعديل التارجت الشهري للمضيف',
        icon: 'trending-up',
        className: 'bg-[#e6f1f4] text-slate-950 border border-slate-300 hover:bg-[#d5e7ec] font-black',
        onClick: (row) => editHostTarget(row.id)
      },
      {
        id: 'reassign_broker',
        title: 'تغيير الوسيط المسؤول عن المضيف',
        icon: 'shuffle',
        className: 'bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-200 font-bold',
        onClick: (row) => reassignHostBroker(row.id, agency.id)
      }
    ],
    onAdd: () => openAddHostModal(agency.id),
    addLabel: 'إضافة مضيف جديد'
  });
}

// Helpers for Agency Management
function openAddBrokerModal(agencyId) {
  const name = prompt('اسم الوسيط الجديد:');
  if (!name) return;
  const phone = prompt('رقم الهاتف للتواصل:', '+96650' + Math.floor(1000000 + Math.random() * 9000000));
  const rate = prompt('نسبة عمولة الوسيط %:', '3.5');
  const brokerCode = 'BRK-' + agencyId.replace('AG-', '') + '-' + (agencyBrokers.length + 1);
  const primaryId = window.getNextPrimarySystemId();

  // إنشاء حساب مستخدم للوسيط وربط الصلاحية
  users.push({
    id: primaryId,
    primaryId: primaryId,
    specialId: String(Math.floor(1000000 + Math.random() * 9000000)),
    gameUuid: `${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}-4a84-90aa-${Date.now().toString().slice(-12)}`,
    displayName: name.trim(),
    phone: phone || '+966500000000',
    email: `broker${primaryId}@gala.live`,
    family: 'عائلة الوسطاء المعتمدين',
    coins: 500000,
    diamonds: 500,
    level: 1,
    vipLevel: 0,
    status: 'active',
    roles: ['BROKER'],
    functionalRoleCode: brokerCode,
    roleTitle: `وسيط وكالة معتمد (${brokerCode})`
  });

  agencyBrokers.push({
    id: brokerCode,
    agencyId,
    name,
    userId: String(primaryId),
    primaryUserId: primaryId,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    hostsCount: 0,
    totalRevenue: 0,
    commissionRate: Number(rate) || 3.5,
    earnedCoins: 0,
    status: 'نشط',
    phone: phone || '+966500000000',
    joinDate: new Date().toISOString().split('T')[0]
  });

  saveState();
  const ag = agencies.find(a => a.id === agencyId);
  if (ag) {
    const container = document.getElementById('dynamicViewContainer');
    renderAgencyDetailView(container, ag);
  }
}

function openAddHostModal(agencyId) {
  const name = prompt('اسم المضيف الجديد:');
  if (!name) return;
  const target = prompt('تارجت الكوينز الشهري للمضيف:', '2500000');
  
  // Choose broker or direct
  const agencyBrokersList = agencyBrokers.filter(b => b.agencyId === agencyId);
  let brokerId = null;
  let brokerName = 'مباشر مع الوكالة';

  if (agencyBrokersList.length > 0) {
    const brokerChoice = prompt(`اختر رقم الوسيط المسؤول:\n0: مباشر مع الوكالة\n` + agencyBrokersList.map((b, i) => `${i + 1}: ${b.name}`).join('\n'), '0');
    const idx = Number(brokerChoice);
    if (idx > 0 && idx <= agencyBrokersList.length) {
      brokerId = agencyBrokersList[idx - 1].id;
      brokerName = agencyBrokersList[idx - 1].name;
      agencyBrokersList[idx - 1].hostsCount = (agencyBrokersList[idx - 1].hostsCount || 0) + 1;
    }
  }

  const hostCode = 'HOST-' + agencyId.replace('AG-', '') + '-' + String(agencyHosts.length + 1).padStart(2, '0');
  const primaryId = window.getNextPrimarySystemId();

  // إنشاء حساب مستخدم للمضيف وربط الصلاحية
  users.push({
    id: primaryId,
    primaryId: primaryId,
    specialId: String(Math.floor(1000000 + Math.random() * 9000000)),
    gameUuid: `${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}-4a84-90aa-${Date.now().toString().slice(-12)}`,
    displayName: name.trim(),
    phone: '+9665' + Math.floor(10000000 + Math.random() * 90000000),
    email: `host${primaryId}@gala.live`,
    family: 'عائلة المضيفين وصناع المحتوى',
    coins: 100000,
    diamonds: 200,
    level: 1,
    vipLevel: 0,
    status: 'active',
    roles: ['HOST'],
    functionalRoleCode: hostCode,
    roleTitle: `مضيف بث مباشر (${hostCode})`
  });

  agencyHosts.push({
    id: hostCode,
    agencyId,
    brokerId,
    brokerName,
    name,
    userId: String(primaryId),
    primaryUserId: primaryId,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    hoursAchieved: 0,
    monthlyRevenue: 0,
    monthlyTarget: Number(target) || 2500000,
    liveStatus: 'غير متصل',
    status: 'نشط',
    category: 'بث مباشر',
    joinDate: new Date().toISOString().split('T')[0]
  });

  // Update total hosts count on agency
  const ag = agencies.find(a => a.id === agencyId);
  if (ag) {
    ag.hosts = (ag.hosts || 0) + 1;
  }

  saveState();
  if (ag) {
    const container = document.getElementById('dynamicViewContainer');
    renderAgencyDetailView(container, ag);
  }
}

function editBrokerCommission(brokerId) {
  const brk = agencyBrokers.find(b => b.id === brokerId);
  if (!brk) return;
  const newRate = prompt(`تعديل نسبة عمولة الوسيط (${brk.name}):`, String(brk.commissionRate));
  if (newRate && !isNaN(newRate)) {
    brk.commissionRate = Number(newRate);
    saveState();
    const ag = agencies.find(a => a.id === brk.agencyId);
    if (ag) {
      const container = document.getElementById('dynamicViewContainer');
      renderAgencyDetailView(container, ag);
    }
  }
}

function editHostTarget(hostId) {
  const host = agencyHosts.find(h => h.id === hostId);
  if (!host) return;
  const newTarget = prompt(`تعديل تارجت المضيف (${host.name}):`, String(host.monthlyTarget));
  if (newTarget && !isNaN(newTarget)) {
    host.monthlyTarget = Number(newTarget);
    saveState();
    const ag = agencies.find(a => a.id === host.agencyId);
    if (ag) {
      const container = document.getElementById('dynamicViewContainer');
      renderAgencyDetailView(container, ag);
    }
  }
}

function reassignHostBroker(hostId, agencyId) {
  const host = agencyHosts.find(h => h.id === hostId);
  if (!host) return;
  const agencyBrokersList = agencyBrokers.filter(b => b.agencyId === agencyId);
  const choice = prompt(`اختر الوسيط الجديد للمضيف (${host.name}):\n0: مباشر مع الوكالة\n` + agencyBrokersList.map((b, i) => `${i + 1}: ${b.name}`).join('\n'), '0');
  const idx = Number(choice);
  if (idx === 0) {
    host.brokerId = null;
    host.brokerName = 'مباشر مع الوكالة';
  } else if (idx > 0 && idx <= agencyBrokersList.length) {
    host.brokerId = agencyBrokersList[idx - 1].id;
    host.brokerName = agencyBrokersList[idx - 1].name;
  }
  saveState();
  const ag = agencies.find(a => a.id === agencyId);
  if (ag) {
    const container = document.getElementById('dynamicViewContainer');
    renderAgencyDetailView(container, ag);
  }
}

function openAddAgencyModal() {
  const name = prompt('اسم الوكالة:');
  if (!name) return;
  const owner = prompt('اسم مالك الوكالة (الوكيل الرسمي):');
  const code = 'AG-' + Math.floor(100 + Math.random() * 900);
  const primaryId = window.getNextPrimarySystemId();

  // إنشاء حساب مستخدم للوكيل الرسمي وربط الصلاحية
  users.push({
    id: primaryId,
    primaryId: primaryId,
    specialId: String(Math.floor(1000000 + Math.random() * 9000000)),
    gameUuid: `${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}-4a84-90aa-${Date.now().toString().slice(-12)}`,
    displayName: (owner || 'وكيل رسمي').trim(),
    phone: '+9665' + Math.floor(10000000 + Math.random() * 90000000),
    email: `agent${primaryId}@gala.live`,
    family: 'عائلة الوكلاء المعتمدين',
    coins: 1000000,
    diamonds: 1000,
    level: 1,
    vipLevel: 0,
    status: 'active',
    roles: ['OFFICIAL_AGENT'],
    functionalRoleCode: code,
    roleTitle: `وكيل رسمي معتمد (${code})`
  });

  agencies.push({
    id: code,
    name,
    owner: owner || 'وكيل رسمي',
    ownerId: String(primaryId),
    ownerPrimaryId: primaryId,
    coins: 5000000,
    commission: 12.0,
    hosts: 0,
    hours: 0,
    target: 20000000,
    achievedTarget: 0,
    status: 'نشطة'
  });

  saveState();
  renderView('agencies');
}

function rechargeAgency(id) {
  const ag = agencies.find(a => a.id === id);
  if (!ag) return;
  const amount = prompt(`أدخل كوينزات الشحن للوكالة ${ag.name}:`, '5000000');
  if (amount && !isNaN(amount)) {
    ag.coins += Number(amount);
    saveState();
    alert(`تم شحن ${Number(amount).toLocaleString()} كوينز للوكالة بنجاح!`);
    if (window._currentAgencyDetailId === id) {
      const container = document.getElementById('dynamicViewContainer');
      renderAgencyDetailView(container, ag);
    } else {
      renderView('agencies');
    }
  }
}

// =========================================================================
// VIEW 4.5: AGENCY HIERARCHY & CUMULATIVE DRILLDOWN (الهيكل الهرمي والتراكمي للوكالات)
// مدير الوكالات ➔ مندوب الوكالات ➔ الوكيل الرسمي ➔ الوسيط
// =========================================================================
window._hierarchyState = {
  viewScope: 'admin', // 'admin' (رأس الهرم أبو أمجد - رؤية كاملة لجميع مدراء الوكالات) OR 'MGR-9902' (منظور قيادة الكابتن - قيادته فقط)
  activeManagerId: 'MGR-9901', // Pre-select first manager (إدارة أبو أمجد) so hierarchy is visible immediately
  activeManagerSubTab: 'agencies', // 'agencies' (Step 2: عرض جميع الوكالات التابعة له) OR 'delegates' (Step 3: عرض المندوبين والوسطاء)
  activeDelegateId: null,      // e.g. 'DEL-401'
  activeAgencyId: null,        // e.g. 'AG-101'
  activeBrokerId: null,        // e.g. 'BRK-101-1'
  collapsedLevels: {}
};

// حالة طي وإخفاء أجزاء كارت الكابتن (منطوية ومخفية افتراضياً لجعل الكارت خفيف جداً)
window._managerCardState = window._managerCardState || {
  showPermissions: false, // الصلاحيات المفوضة تنطوي وتظهر بضغطة زر
  showStats: false        // الإحصائيات تنطوي وتظهر بضغطة زر
};

// دالة طي/إظهار أقسام كارت الإدارة بضغطة واحدة
window.toggleManagerCardSection = function(section, managerId) {
  window._managerCardState = window._managerCardState || { showPermissions: false, showStats: false };
  if (section === 'permissions') {
    window._managerCardState.showPermissions = !window._managerCardState.showPermissions;
  } else if (section === 'stats') {
    window._managerCardState.showStats = !window._managerCardState.showStats;
  }
  const modalFullscreen = document.getElementById('managerAgenciesFullscreenModal');
  if (modalFullscreen && !modalFullscreen.classList.contains('hidden')) {
    window.openManagerAgenciesFullscreen(managerId);
  } else {
    const container = document.getElementById('dynamicViewContainer');
    if (container && currentTab === 'agency_hierarchy') {
      renderAgencyHierarchyView(container);
    }
  }
};

// تبديل منظور الرؤية الهرمية ونطاق الخصوصية القيادي
window.setHierarchyScope = function(scope) {
  window._hierarchyState.viewScope = scope;
  if (scope === 'MGR-9902') {
    window._hierarchyState.activeManagerId = 'MGR-9902';
    window._hierarchyState.activeManagerSubTab = 'agencies';
    window._hierarchyState.activeDelegateId = null;
    window._hierarchyState.activeAgencyId = null;
    window._hierarchyState.activeBrokerId = null;
  } else if (scope === 'admin') {
    window._hierarchyState.activeManagerId = 'MGR-9901';
  }
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderAgencyHierarchyView(container);
};

// حساب إجمالي التسكير المحقق للوكالات التابعة للإداري (بالكوينز)
window.getManagerTotalClosingCoins = function(managerId) {
  const mgrAgencies = agencies.filter(a => a.managerId === managerId);
  return mgrAgencies.reduce((acc, a) => {
    const rev = (a.monthlyStats && (a.monthlyStats.revenue || a.monthlyStats.targetRevenue)) ||
                (a.todayStats && a.todayStats.coins) ||
                a.revenueCoins || a.coins || 0;
    return acc + rev;
  }, 0);
};

// جلب وتعيين قواعد الترقية الآلية للمندوبين عند تسكير الوكالات
window.getManagerAutoUnlockRules = function(mgr) {
  if (!mgr.delegateAutoUnlock) {
    mgr.delegateAutoUnlock = {
      enabled: true,
      baseQuota: 3, // كوتا المندوبين الأساسية قبل التسكير
      tiers: [
        { id: 1, targetMillions: 100, earnedDelegates: 5, label: 'تسكير 100 مليون كوينز' },
        { id: 2, targetMillions: 300, earnedDelegates: 8, label: 'تسكير 300 مليون كوينز' },
        { id: 3, targetMillions: 500, earnedDelegates: 12, label: 'تسكير 500 مليون كوينز' }
      ]
    };
  }
  return mgr.delegateAutoUnlock;
};

// حساب الكوتا الفعالة والوضع التراكمي اللحظي للترقية الآلية
window.calculateManagerDelegateStatus = function(mgr) {
  const rules = window.getManagerAutoUnlockRules(mgr);
  const totalCoins = window.getManagerTotalClosingCoins(mgr.id);
  const totalMillions = Math.floor(totalCoins / 1000000);
  const currentDelegatesCount = agencyDelegates.filter(d => d.managerId === mgr.id).length;

  if (!rules.enabled) {
    const manualQuota = (mgr.permissions && mgr.permissions.maxDelegatesQuota) || 5;
    return {
      isAuto: false,
      totalCoins,
      totalMillions,
      effectiveQuota: manualQuota,
      currentDelegatesCount,
      currentTier: null,
      nextTier: null,
      progressPercent: 100,
      remainingMillions: 0
    };
  }

  const sortedTiers = [...rules.tiers].sort((a, b) => a.targetMillions - b.targetMillions);
  let achievedTier = null;
  let nextTier = null;
  let effectiveQuota = rules.baseQuota || 3;

  for (const tier of sortedTiers) {
    if (totalMillions >= tier.targetMillions) {
      achievedTier = tier;
      effectiveQuota = tier.earnedDelegates;
    } else {
      if (!nextTier) nextTier = tier;
    }
  }

  let progressPercent = 0;
  let remainingMillions = 0;
  if (nextTier) {
    const prevTarget = achievedTier ? achievedTier.targetMillions : 0;
    const range = Math.max(1, nextTier.targetMillions - prevTarget);
    const progress = Math.max(0, totalMillions - prevTarget);
    progressPercent = Math.min(100, Math.round((progress / range) * 100));
    remainingMillions = Math.max(0, nextTier.targetMillions - totalMillions);
  } else {
    progressPercent = 100;
    remainingMillions = 0;
  }

  return {
    isAuto: true,
    totalCoins,
    totalMillions,
    effectiveQuota,
    currentDelegatesCount,
    currentTier: achievedTier,
    nextTier,
    progressPercent,
    remainingMillions
  };
};

// Step 2 Action: عرض جميع الوكالات التابعة للإداري بالكامل (ملء الشاشة مع التزامن الداخلي)
window.showManagerAgencies = function(managerId) {
  window._hierarchyState.activeManagerId = managerId;
  window._hierarchyState.activeManagerSubTab = 'agencies';
  window._hierarchyState.activeDelegateId = null;
  window._hierarchyState.activeAgencyId = null;
  window._hierarchyState.activeBrokerId = null;
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderAgencyHierarchyView(container);
  
  // فتح شاشة كاملة فورية لعرض الوكالات التابعة كما طلب المستخدم
  window.openManagerAgenciesFullscreen(managerId);
};

// الدالة المخصصة لفتح قائمة الوكالات التابعة للإدارة بملء الشاشة بالكامل (المعلومات في الأعلى والجدول في الأسفل)
window.openManagerAgenciesFullscreen = function(managerId, filterText = '') {
  const mgr = agencyManagers.find(m => m.id === managerId) || agencyManagers[0];
  if (!mgr) return;

  window._hierarchyState.activeManagerId = mgr.id;
  const modal = document.getElementById('managerAgenciesFullscreenModal');
  const modalContent = document.getElementById('managerAgenciesFullscreenContent');
  if (!modal || !modalContent) return;

  const mgrAgencies = agencies.filter(a => a.managerId === mgr.id);
  const mgrDelegates = agencyDelegates.filter(d => d.managerId === mgr.id);
  const totalHosts = mgrAgencies.reduce((acc, a) => acc + (a.hosts || 0), 0);
  const totalHours = mgrAgencies.reduce((acc, a) => acc + (a.hours || 0), 0);
  const totalCoins = mgrAgencies.reduce((acc, a) => acc + (a.coins || 0), 0);
  const totalTarget = mgrAgencies.reduce((acc, a) => acc + (a.target || 0), 0);
  const totalSar = Math.round(totalCoins / 200);
  const mgrProfitCoins = Math.round(totalCoins * (mgr.profitSharePercent / 100));
  const mgrProfitSar = Math.round(mgrProfitCoins / 200);
  const delStatus = window.calculateManagerDelegateStatus(mgr);

  let filteredAgencies = mgrAgencies;
  if (filterText && filterText.trim()) {
    const q = filterText.toLowerCase().trim();
    filteredAgencies = mgrAgencies.filter(a => 
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.id && a.id.toLowerCase().includes(q)) ||
      (a.owner && a.owner.toLowerCase().includes(q)) ||
      (a.invitedBy && a.invitedBy.toLowerCase().includes(q))
    );
  }

  modalContent.innerHTML = `
    <!-- 1. STICKY TOP HEADER (ملء الشاشة مع أدوات الإغلاق والطباعة) -->
    <div class="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b-2 border-slate-700 shrink-0 shadow-md">
      <div class="flex items-center gap-3">
        <button 
          type="button" 
          onclick="window.closeManagerAgenciesFullscreen()" 
          class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-white border border-slate-600 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          title="العودة لشاشة الهيكل">
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
          <span>العودة للهيكل الهرمي</span>
        </button>
        <div class="h-6 w-px bg-slate-700 hidden sm:block"></div>
        <div class="flex items-center gap-2 flex-wrap">
          <div class="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs">
            <i data-lucide="building" class="w-4 h-4"></i>
          </div>
          <h2 class="text-sm font-black text-white">
            قائمة وكالات: <span class="text-amber-400">${mgr.name}</span>
          </h2>
          <span class="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-600 text-slate-300 font-mono text-xs font-bold">${mgr.id}</span>
          <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
            ملء الشاشة 🖥️
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button 
          type="button" 
          onclick="window.openManagerPermissionsModal('${mgr.id}')" 
          class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md border border-amber-300 active:scale-95 group"
          title="منح الصلاحيات الإدارية وتحديد كوتا التسكير الآلي (الثلاث نقط ⋮)">
          <i data-lucide="more-vertical" class="w-3.5 h-3.5 stroke-[3] group-hover:rotate-90 transition-transform"></i>
          <span>منح الصلاحيات (الثلاث نقط ⋮)</span>
        </button>
        <button 
          type="button" 
          onclick="window.print()" 
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-600 cursor-pointer">
          <i data-lucide="printer" class="w-3.5 h-3.5"></i>
          <span>طباعة</span>
        </button>
        <button 
          type="button" 
          onclick="window.closeManagerAgenciesFullscreen()" 
          class="px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-black transition flex items-center gap-1 cursor-pointer shadow-xs">
          <i data-lucide="x" class="w-4 h-4"></i>
          <span>إغلاق</span>
        </button>
      </div>
    </div>

    <!-- 2. TOP INFORMATION SECTION (كارت خفيف جداً وموجز مع طي الصلاحيات والإحصائيات بضغطة زر) -->
    <div class="bg-white border-b-2 border-slate-300 p-3 sm:p-4 shrink-0 shadow-xs space-y-2.5">
      
      <!-- Top Manager Horizontal Identity Line (خفيف جداً ومسطح أفقي) -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <img src="${mgr.avatar}" class="w-11 h-11 rounded-xl object-cover border-2 border-amber-400 shadow-2xs shrink-0" alt="${mgr.name}" />
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-black text-slate-950 text-base">${mgr.name}</span>
              <span class="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-950 font-black text-xs">نسبة الإدارة: ${mgr.profitSharePercent}%</span>
              <span class="px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs">${mgr.status || 'نشط'}</span>
            </div>
            
            <!-- ملخص سريع أفقي مدمج في سطر واحد -->
            <div class="flex items-center gap-2 text-xs font-bold text-slate-600 mt-1 flex-wrap">
              <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">🏢 ${mgrAgencies.length} وكالات</span>
              <span class="px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-900">👥 ${mgrDelegates.length} / ${delStatus.effectiveQuota} مندوبين</span>
              <span class="px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-900">🎙️ ${totalHosts} مضيف</span>
              <span class="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900">🪙 ${(totalCoins / 1000000).toFixed(1)}M تسكير</span>
              <span class="text-slate-400">•</span>
              <span class="text-slate-500 font-mono text-[11px]">${mgr.phone}</span>
            </div>
          </div>
        </div>

        <!-- أزرار الطي والإجراءات السريعة -->
        <div class="flex items-center gap-2 flex-wrap">
          
          <!-- زر طي/إظهار الصلاحيات المفوضة -->
          <button 
            type="button" 
            onclick="window.toggleManagerCardSection('permissions', '${mgr.id}')" 
            class="px-3 py-1.5 rounded-xl border text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${window._managerCardState.showPermissions ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'}"
            title="عرض/طي الصلاحيات المفوضة من أبو أمجد">
            <i data-lucide="shield-check" class="w-3.5 h-3.5 ${window._managerCardState.showPermissions ? 'text-slate-950' : 'text-amber-700'}"></i>
            <span>الصلاحيات المفوضة (⋮)</span>
            <i data-lucide="${window._managerCardState.showPermissions ? 'chevron-up' : 'chevron-down'}" class="w-3.5 h-3.5"></i>
          </button>

          <!-- زر طي/إظهار الإحصائيات -->
          <button 
            type="button" 
            onclick="window.toggleManagerCardSection('stats', '${mgr.id}')" 
            class="px-3 py-1.5 rounded-xl border text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${window._managerCardState.showStats ? 'bg-sky-600 text-white border-sky-700 shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'}"
            title="عرض/طي الإحصائيات التفصيلية">
            <i data-lucide="bar-chart-2" class="w-3.5 h-3.5 ${window._managerCardState.showStats ? 'text-white' : 'text-sky-700'}"></i>
            <span>الإحصائيات التفصيلية</span>
            <i data-lucide="${window._managerCardState.showStats ? 'chevron-up' : 'chevron-down'}" class="w-3.5 h-3.5"></i>
          </button>

          <button 
            type="button" 
            onclick="window.openManagerPermissionsModal('${mgr.id}')" 
            class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm border border-amber-300 active:scale-95 group"
            title="منح الصلاحيات الإدارية وتحديد كوتا التسكير الآلي (الثلاث نقط ⋮)">
            <i data-lucide="more-vertical" class="w-3.5 h-3.5 stroke-[3] group-hover:rotate-90 transition-transform"></i>
            <span>منح الصلاحيات (⋮)</span>
          </button>
          
          <button 
            type="button" 
            onclick="window.editManagerProfitShare('${mgr.id}')" 
            class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-bold text-xs flex items-center gap-1 transition cursor-pointer">
            <i data-lucide="percent" class="w-3.5 h-3.5 text-amber-600"></i>
            <span>تعديل النسبة %</span>
          </button>
          
          <button 
            type="button" 
            onclick="window.openAddAgencyModal && window.openAddAgencyModal('${mgr.id}')" 
            class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>+ إضافة وكالة</span>
          </button>
        </div>
      </div>

      <!-- قسم الصلاحيات المفوضة (منطوي افتراضياً ويظهر وينطوي بضغطة زر) -->
      ${window._managerCardState.showPermissions ? `
        <div class="p-3 rounded-xl bg-[#f7fbfd] border-2 border-amber-300 flex flex-wrap items-center justify-between gap-2 text-xs shadow-xs animate-fade-in">
          <div class="flex items-center gap-2 font-black text-slate-950">
            <div class="w-6 h-6 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-amber-700"></i>
            </div>
            <span>الصلاحيات المفوضة من أبو أمجاد (رأس الهرم):</span>
          </div>
          <div class="flex flex-wrap items-center gap-1.5 font-bold text-[11px]">
            <span class="px-2.5 py-1 rounded-lg ${mgr.permissions?.canAssignDelegates !== false ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-slate-100 text-slate-400'}">
              👥 المندوبين (كوتا: ${mgrDelegates.length} / ${delStatus.effectiveQuota}) ${delStatus.isAuto ? '⚡ آلي' : ''}
            </span>
            <span class="px-2.5 py-1 rounded-lg ${mgr.permissions?.canApproveAgencies !== false ? 'bg-blue-100 text-blue-950 border border-blue-300' : 'bg-slate-100 text-slate-400'}">
              ✅ اعتماد الوكالات
            </span>
            <span class="px-2.5 py-1 rounded-lg ${mgr.permissions?.canTransferHosts ? 'bg-purple-100 text-purple-950 border border-purple-300' : 'bg-slate-100 text-slate-400'}">
              🔄 نقل المضيفين
            </span>
            <span class="px-2.5 py-1 rounded-lg ${mgr.permissions?.canUnbanAccounts ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-slate-100 text-slate-400 line-through'}">
              🔓 فك الحظر
            </span>
            <span class="px-2.5 py-1 rounded-lg ${mgr.permissions?.canTransferBrokerHosts ? 'bg-teal-100 text-teal-950 border border-teal-300' : 'bg-slate-100 text-slate-400'}">
              🔀 نقل حسابات الوسطاء
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 font-mono text-[10px] flex items-center gap-1 border border-slate-700 shadow-2xs" title="الشحن مقفل تماماً ومحصور فقط برأس الهرم والداشبورد المالي">
              <i data-lucide="lock" class="w-3 h-3 text-amber-400"></i>
              <span>الشحن مقفل 🔒</span>
            </span>
            <button 
              type="button" 
              onclick="window.openManagerPermissionsModal('${mgr.id}')" 
              class="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] flex items-center gap-1 transition cursor-pointer">
              <i data-lucide="more-vertical" class="w-3 h-3"></i>
              <span>تعديل الصلاحيات</span>
            </button>
            <button 
              type="button" 
              onclick="window.toggleManagerCardSection('permissions', '${mgr.id}')" 
              class="text-slate-500 hover:text-slate-800 text-[11px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-slate-200 cursor-pointer"
              title="طي هذا القسم">
              <i data-lucide="chevron-up" class="w-3 h-3"></i>
              <span>طي</span>
            </button>
          </div>
        </div>
      ` : ''}

      <!-- قسم الإحصائيات التفصيلية (منطوي افتراضياً ويظهر وينطوي بضغطة زر) -->
      ${window._managerCardState.showStats ? `
        <div class="space-y-1.5 animate-fade-in">
          <div class="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
            <span class="flex items-center gap-1 text-slate-900 font-black">
              <i data-lucide="bar-chart-2" class="w-3.5 h-3.5 text-sky-600"></i>
              <span>الإحصائيات التفصيلية وأداء تسكير الوكالات:</span>
            </span>
            <button 
              type="button" 
              onclick="window.toggleManagerCardSection('stats', '${mgr.id}')" 
              class="text-slate-500 hover:text-slate-800 text-[11px] font-bold flex items-center gap-0.5 px-2 py-0.5 rounded hover:bg-slate-200 cursor-pointer">
              <i data-lucide="chevron-up" class="w-3 h-3"></i>
              <span>طي الإحصائيات</span>
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-[#f7fbfd] p-3 rounded-xl border-2 border-slate-200 shadow-xs text-center">
            <div class="px-2 py-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span class="text-[10px] font-bold text-slate-500 block">إجمالي الوكالات</span>
              <span class="font-mono font-black text-slate-950 text-sm flex items-center justify-center gap-1 mt-0.5">
                <i data-lucide="building" class="w-3.5 h-3.5 text-emerald-600"></i>
                <span>${mgrAgencies.length} وكالة</span>
              </span>
            </div>
            <div class="px-2 py-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span class="text-[10px] font-bold text-slate-500 block">المندوبين المعتمدين</span>
              <span class="font-mono font-black text-sky-800 text-sm flex items-center justify-center gap-1 mt-0.5">
                <i data-lucide="users" class="w-3.5 h-3.5 text-sky-600"></i>
                <span>${mgrDelegates.length} / ${delStatus.effectiveQuota}</span>
              </span>
            </div>
            <div class="px-2 py-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span class="text-[10px] font-bold text-slate-500 block">إجمالي المضيفين</span>
              <span class="font-mono font-black text-purple-900 text-sm flex items-center justify-center gap-1 mt-0.5">
                <i data-lucide="radio" class="w-3.5 h-3.5 text-purple-600"></i>
                <span>${totalHosts} مضيف</span>
              </span>
            </div>
            <div class="px-2 py-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span class="text-[10px] font-bold text-slate-500 block">ساعات البث المنجزة</span>
              <span class="font-mono font-black text-indigo-900 text-sm flex items-center justify-center gap-1 mt-0.5">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-indigo-600"></i>
                <span>${totalHours.toLocaleString()}h</span>
              </span>
            </div>
            <div class="px-2 py-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span class="text-[10px] font-bold text-slate-500 block">إيرادات التسكير</span>
              <span class="font-mono font-black text-amber-700 text-sm flex items-center justify-center gap-1 mt-0.5">
                <span>🪙 ${(totalCoins / 1000000).toFixed(2)}M</span>
              </span>
            </div>
            <div class="px-2 py-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span class="text-[10px] font-bold text-slate-500 block">أرباح المدير (${mgr.profitSharePercent}%)</span>
              <span class="font-mono font-black text-emerald-700 text-sm flex items-center justify-center gap-1 mt-0.5">
                <span>🪙 ${(mgrProfitCoins / 1000000).toFixed(2)}M</span>
              </span>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Horizontal Search & Actions Filter Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div class="flex items-center gap-3 flex-1 min-w-[280px] max-w-xl">
          <div class="relative w-full">
            <input 
              type="text" 
              id="fullscreenAgenciesSearchInput" 
              value="${filterText || ''}"
              oninput="window.filterFullscreenAgencies(this.value, '${mgr.id}')"
              placeholder="🔍 بحث سريع في وكالات ${mgr.name.split('(')[0].trim()} (بالاسم، الكود، الوكيل، أو المندوب)..."
              class="w-full pl-4 pr-10 py-2 rounded-xl bg-slate-50 border-2 border-slate-300 text-slate-950 font-bold text-xs focus:bg-white focus:border-amber-500 focus:outline-none transition shadow-2xs" />
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2"></i>
          </div>
          ${filterText ? `
            <button 
              type="button" 
              onclick="window.filterFullscreenAgencies('', '${mgr.id}')" 
              class="px-2.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold shrink-0 cursor-pointer">
              إلغاء البحث
            </button>
          ` : ''}
        </div>

        <div class="flex items-center gap-2 text-xs font-bold">
          <span class="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-800">
            المعروض: <strong class="text-emerald-700 font-black">${filteredAgencies.length}</strong> من أصل <strong class="text-slate-950 font-black">${mgrAgencies.length}</strong> وكالة
          </span>
        </div>
      </div>

    </div>

    <!-- 3. BOTTOM SECTION: FULL-SCREEN WATER-RULED AGENCIES TABLE (الجدول في الأسفل ملء الشاشة) -->
    <div class="flex-1 overflow-auto p-4 sm:p-5 bg-slate-100">
      
      <div class="rounded-xl border-2 border-slate-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] overflow-x-auto bg-white">
        <table class="w-full text-right text-xs whitespace-nowrap">
          <thead class="bg-slate-100 text-slate-950 font-black border-b-2 border-slate-400 sticky top-0 z-10 shadow-2xs">
            <tr>
              <th class="py-3.5 px-3 text-center w-12 border-l border-slate-200/80">#</th>
              <th class="py-3.5 px-3 text-center border-l border-slate-200/80">رمز الوكالة</th>
              <th class="py-3.5 px-4 border-l border-slate-200/80">اسم الوكالة الرسمية</th>
              <th class="py-3.5 px-4 border-l border-slate-200/80 bg-amber-50/50">الوكيل الرسمي (المالك)</th>
              <th class="py-3.5 px-4 border-l border-slate-200/80 bg-sky-50/50">المندوب المستقطب</th>
              <th class="py-3.5 px-3 text-center border-l border-slate-200/80">نسبة الوكالة %</th>
              <th class="py-3.5 px-3 text-center border-l border-slate-200/80 bg-purple-50/50">عدد الوسطاء</th>
              <th class="py-3.5 px-3 text-center border-l border-slate-200/80">عدد المضيفين</th>
              <th class="py-3.5 px-3 text-center border-l border-slate-200/80">ساعات البث</th>
              <th class="py-3.5 px-3 text-center border-l border-slate-200/80">رصيد الكوينز والتارجت</th>
              <th class="py-3.5 px-3 text-center border-l border-slate-200/80 bg-emerald-50/50">الإيراد المقدر (ر.س)</th>
              <th class="py-3.5 px-3 text-center border-l border-slate-200/80">الحالة</th>
              <th class="py-3.5 px-4 text-center">الإجراءات والبيانات التراكمية (ملء الشاشة 🖥️)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-300">
            ${filteredAgencies.length === 0 ? `
              <tr>
                <td colspan="13" class="py-12 text-center text-slate-500 font-bold bg-white">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <i data-lucide="inbox" class="w-8 h-8 text-slate-400"></i>
                    <span>لا توجد وكالات مطابقة لبحثك تحت إدارة ${mgr.name}</span>
                  </div>
                </td>
              </tr>
            ` : filteredAgencies.map((ag, idx) => {
              const rowBg = idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-[#edf6f9]';
              const agCoins = ag.achievedTarget || ag.coins || 0;
              const agTarget = ag.target || 50000000;
              const agSar = Math.round(agCoins / 200);
              const completionRate = Math.min(100, Math.round((agCoins / agTarget) * 100));
              const brokers = ag.brokersCount || (agencyBrokers ? agencyBrokers.filter(b => b.agencyId === ag.id).length : 2);

              return `
                <tr class="${rowBg} hover:bg-[#dff0f5] transition">
                  <td class="py-3.5 px-3 text-center font-bold text-slate-500 border-l border-slate-200/80">${idx + 1}</td>
                  <td class="py-3.5 px-3 text-center font-mono font-black text-slate-950 border-l border-slate-200/80">${ag.id}</td>
                  <td class="py-3.5 px-4 font-black text-slate-950 border-l border-slate-200/80">
                    <div class="flex items-center gap-2.5">
                      <span class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs border border-emerald-200">
                        <i data-lucide="building" class="w-4 h-4"></i>
                      </span>
                      <div>
                        <div class="font-black text-slate-950">${ag.name}</div>
                        <div class="text-[10px] font-mono text-slate-500">إدارة: ${mgr.name.split('(')[0].trim()}</div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3.5 px-4 border-l border-slate-200/80">
                    <div class="font-black text-slate-950">${ag.owner}</div>
                    <div class="text-[10px] font-mono text-slate-600">ID: #${ag.ownerPrimaryId || ag.ownerId || '1001010'}</div>
                  </td>
                  <td class="py-3.5 px-4 border-l border-slate-200/80 bg-sky-50/30">
                    <span class="px-2.5 py-1 rounded-lg bg-sky-100 border border-sky-300 text-sky-950 font-bold text-[11px] inline-flex items-center gap-1.5">
                      <i data-lucide="sparkles" class="w-3.5 h-3.5 text-sky-600"></i>
                      <span>${ag.invitedBy || 'المندوب المعتمد'}</span>
                    </span>
                  </td>
                  <td class="py-3.5 px-3 text-center border-l border-slate-200/80">
                    <div class="inline-flex items-center gap-1">
                      <span class="px-2.5 py-1 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-950 font-black text-xs">
                        ${ag.commission}%
                      </span>
                      <button 
                        type="button" 
                        onclick="window.editAgencyCommission('${ag.id}')" 
                        title="تعديل نسبة الوكالة"
                        class="text-slate-600 hover:text-slate-950 p-1 hover:bg-white rounded cursor-pointer">
                        <i data-lucide="edit-3" class="w-3 h-3"></i>
                      </button>
                    </div>
                  </td>
                  <td class="py-3.5 px-3 text-center border-l border-slate-200/80">
                    <span class="px-2.5 py-1 rounded-xl bg-purple-100 border border-purple-300 text-purple-950 font-black text-xs inline-flex items-center gap-1 shadow-2xs">
                      <i data-lucide="users" class="w-3.5 h-3.5 text-purple-700"></i>
                      <span>${brokers} وسطاء</span>
                    </span>
                  </td>
                  <td class="py-3.5 px-3 text-center font-mono font-black text-slate-900 border-l border-slate-200/80">
                    ${ag.hosts || 24} مضيف
                  </td>
                  <td class="py-3.5 px-3 text-center font-mono font-bold text-slate-700 border-l border-slate-200/80">
                    ${ag.hours || 850}h
                  </td>
                  <td class="py-3.5 px-3 text-center border-l border-slate-200/80">
                    <div class="font-mono font-black text-amber-700">${Number(agCoins).toLocaleString()} 🪙</div>
                    <div class="text-[10px] font-mono text-slate-500">التارجت: ${Number(agTarget).toLocaleString()} (${completionRate}%)</div>
                  </td>
                  <td class="py-3.5 px-3 text-center font-mono font-black text-emerald-800 border-l border-slate-200/80 bg-emerald-50/30">
                    ${agSar.toLocaleString()} ر.س
                  </td>
                  <td class="py-3.5 px-3 text-center border-l border-slate-200/80">
                    <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-bold text-[11px] border border-emerald-300">${ag.status || 'نشطة'}</span>
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <div class="inline-flex items-center gap-1.5 flex-wrap justify-center">
                      <!-- Action 1: القائمة التراكمية وبيانات الوكالة ملء الشاشة -->
                      <button 
                        type="button" 
                        onclick="window.openAgencyCumulativeModal('${ag.id}')" 
                        title="عرض الإحصائيات التراكمية وقائمة المضيفين بملء الشاشة"
                        class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-xs transition hover:scale-102">
                        <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i>
                        <span>📊 القائمة التراكمية وبيانات الوكالة</span>
                      </button>

                      <!-- Action 2: تفاصيل الوسطاء والمضيفين -->
                      <button 
                        type="button" 
                        onclick="window.closeManagerAgenciesFullscreen(); window.enterAgencyAccount('${ag.id}');" 
                        title="الانتقال لتفاصيل الوسطاء والمضيفين في الهرم"
                        class="px-3 py-1.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-black text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-xs transition hover:scale-102">
                        <i data-lucide="key" class="w-3.5 h-3.5 text-amber-400"></i>
                        <span>🔑 تفاصيل الوسطاء والمضيفين</span>
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

    </div>

    <!-- 4. BOTTOM FOOTER BAR -->
    <div class="bg-white p-3 sm:p-4 border-t-2 border-slate-300 flex items-center justify-between shrink-0">
      <div class="text-xs text-slate-700 font-bold flex items-center gap-2">
        <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i>
        <span>عرض كامل ومفصل لجميع الوكالات التابعة لإدارة (${mgr.name}) - تم تطبيق العرض الأفقي وملء الشاشة بالكامل</span>
      </div>
      <button 
        type="button" 
        onclick="window.closeManagerAgenciesFullscreen()" 
        class="px-5 py-2 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-black text-xs transition cursor-pointer shadow-xs">
        إغلاق العرض والعودة للهرم
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
};

window.closeManagerAgenciesFullscreen = function() {
  const modal = document.getElementById('managerAgenciesFullscreenModal');
  if (modal) modal.classList.add('hidden');
};

window.filterFullscreenAgencies = function(keyword, managerId) {
  window.openManagerAgenciesFullscreen(managerId, keyword);
  setTimeout(() => {
    const input = document.getElementById('fullscreenAgenciesSearchInput');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, 50);
};

// Step 3 Action: عرض المندوبين والوسطاء التابعين للإداري
window.showManagerDelegates = function(managerId) {
  window._hierarchyState.activeManagerId = managerId;
  window._hierarchyState.activeManagerSubTab = 'delegates';
  window._hierarchyState.activeDelegateId = null;
  window._hierarchyState.activeAgencyId = null;
  window._hierarchyState.activeBrokerId = null;
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderAgencyHierarchyView(container);
  setTimeout(() => {
    const el = document.getElementById('hierarchy-manager-details');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
};

window.setManagerSubTab = function(subTab) {
  window._hierarchyState.activeManagerSubTab = subTab;
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderAgencyHierarchyView(container);
};

// Step 4 Action: القائمة التراكمية وبيانات الوكالة التفصيلية (نافذة كاملة مع التمرير للأعلى والأسفل)
window.openAgencyCumulativeModal = function(agencyId) {
  const ag = agencies.find(a => a.id === agencyId) || agencies[0];
  if (!ag) return;

  const modal = document.getElementById('agencyCumulativeModal');
  const modalContent = document.getElementById('agencyCumulativeModalContent');
  if (!modal || !modalContent) return;

  const mgr = agencyManagers.find(m => m.id === ag.managerId) || { name: 'إدارة أبو أمجد' };
  const del = agencyDelegates.find(d => d.id === ag.delegateId) || { name: ag.invitedBy || 'مندوب معتمد', commissionRate: 14 };

  const today = ag.todayStats || { hours: 48.5, coins: 1450000, activeHosts: 18, giftsCount: 3820 };
  const monthly = ag.monthlyStats || {
    hours: ag.hours || 1420,
    targetHours: 1500,
    revenue: ag.achievedTarget || ag.coins || 41200000,
    targetRevenue: ag.target || 50000000,
    commissionEarned: Math.round((ag.achievedTarget || ag.coins || 41200000) * (ag.commission / 100)),
    completionRate: Math.round(((ag.achievedTarget || ag.coins || 41200000) / (ag.target || 50000000)) * 100)
  };
  const finance = ag.financialMetrics || {
    withdrawableBalance: Math.round((ag.coins || 14500000) * 0.3),
    totalWithdrawn: Math.round((ag.coins || 14500000) * 1.5),
    avgHostHours: 4.6,
    qualityScore: '98.2% (ممتاز ⭐)'
  };

  let hostsList = agencyHosts.filter(h => h.agencyId === ag.id);
  if (hostsList.length === 0) {
    hostsList = [
      { id: 'HOST-' + ag.id.replace('AG-', '') + '-01', name: 'سارة الرياض', userId: '1001022', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', brokerName: 'تركي الشمري', daysAttended: 25, hoursAchieved: 145, hoursTarget: 120, monthlyRevenue: 3400000, liveStatus: 'مباشر الآن 🔴', status: 'نشط', category: 'غناء وموسيقى' },
      { id: 'HOST-' + ag.id.replace('AG-', '') + '-02', name: 'صوت البادية', userId: '1001023', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', brokerName: 'تركي الشمري', daysAttended: 24, hoursAchieved: 128, hoursTarget: 120, monthlyRevenue: 2800000, liveStatus: 'غير متصل ⚪', status: 'نشط', category: 'شعر وخواطر' },
      { id: 'HOST-' + ag.id.replace('AG-', '') + '-03', name: 'كروان النخبة', userId: '1001024', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100', brokerName: 'تركي الشمري', daysAttended: 26, hoursAchieved: 135, hoursTarget: 120, monthlyRevenue: 3100000, liveStatus: 'مباشر الآن 🔴', status: 'نشط', category: 'حوارات صوتية' },
      { id: 'HOST-' + ag.id.replace('AG-', '') + '-04', name: 'ليالي نجد', userId: '1001025', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100', brokerName: 'عبدالله القحطاني', daysAttended: 22, hoursAchieved: 110, hoursTarget: 120, monthlyRevenue: 2100000, liveStatus: 'غير متصل ⚪', status: 'نشط', category: 'مسابقات وترفيه' },
      { id: 'HOST-' + ag.id.replace('AG-', '') + '-05', name: 'صقر الجزيرة', userId: '1001026', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100', brokerName: 'عبدالله القحطاني', daysAttended: 20, hoursAchieved: 98, hoursTarget: 120, monthlyRevenue: 1950000, liveStatus: 'مباشر الآن 🔴', status: 'نشط', category: 'ألعاب وPK' }
    ];
  }

  modalContent.innerHTML = `
    <!-- Modal Header (Fixed / Sticky - الطبقة التراكمية الثانية) -->
    <div class="bg-slate-900 text-white p-3 sm:p-4 flex items-center justify-between border-b-2 border-slate-700 shrink-0">
      <div class="flex items-center gap-3">
        <button 
          type="button" 
          onclick="window.closeAgencyCumulativeModal()" 
          class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-white border border-slate-600 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          title="العودة لشاشة الوكالات">
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
          <span>العودة لوكالات ${mgr.name.split('(')[0].trim()}</span>
        </button>
        <div class="h-6 w-px bg-slate-700 hidden sm:block"></div>
        <div class="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
          <i data-lucide="bar-chart-3" class="w-5 h-5"></i>
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h2 class="text-sm sm:text-base font-black text-white">${ag.name}</h2>
            <span class="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs">${ag.id}</span>
            <span class="px-2 py-0.5 rounded-lg bg-emerald-500 text-white font-bold text-xs">${ag.status}</span>
            <span class="px-2 py-0.5 rounded-md bg-purple-900/80 text-purple-200 text-[10px] font-bold border border-purple-700">شاشة تراكمية ثانوية 📑</span>
          </div>
          <p class="text-[11px] text-slate-300 font-medium mt-0.5">
            المالك: <strong class="text-amber-300">${ag.owner}</strong> • الإداري: <strong class="text-sky-300">${mgr.name}</strong> • المندوب: <strong class="text-emerald-300">${ag.invitedBy}</strong>
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" onclick="window.print()" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-600 cursor-pointer">
          <i data-lucide="printer" class="w-3.5 h-3.5"></i>
          <span>طباعة التقرير</span>
        </button>
        <button type="button" onclick="window.closeAgencyCumulativeModal()" class="px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-black transition flex items-center gap-1 cursor-pointer shadow-xs">
          <i data-lucide="x" class="w-4 h-4"></i>
          <span>إغلاق (عودة للوكالات)</span>
        </button>
      </div>
    </div>

    <!-- Scrollable Modal Body (التمرير للأعلى والأسفل) -->
    <div class="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 bg-slate-50 text-slate-950" style="scroll-behavior: smooth;">
      
      <!-- Top Overview Banner -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 sm:p-5 shadow-xs space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-xs">
              🏢
            </div>
            <div>
              <div class="text-xs font-bold text-slate-500">القائمة التراكمية وبيانات الوكالة الرسمية التفصيلية</div>
              <div class="text-base font-black text-slate-950">${ag.name}</div>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-black text-xs">
              نسبة عمولة الوكيل: ${ag.commission}%
            </span>
            <span class="px-3 py-1.5 rounded-xl bg-purple-100 border border-purple-300 text-purple-950 font-black text-xs">
              الوسطاء المرخصون: ${ag.brokersCount || 2} وسطاء
            </span>
            <span class="px-3 py-1.5 rounded-xl bg-sky-100 border border-sky-300 text-sky-950 font-black text-xs">
              إجمالي المضيفين: ${hostsList.length} مضيفين
            </span>
          </div>
        </div>

        <!-- Target Progress Bar -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs font-black">
            <span class="text-slate-700">التارجت الشهري المستهدف للوكالة:</span>
            <span class="font-mono text-emerald-700">${Number(monthly.revenue).toLocaleString()} 🪙 / ${Number(monthly.targetRevenue).toLocaleString()} 🪙 (${monthly.completionRate}%)</span>
          </div>
          <div class="w-full h-3 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
            <div class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500" style="width: ${Math.min(100, monthly.completionRate)}%"></div>
          </div>
        </div>
      </div>

      <!-- Comprehensive Statistics (إحصائيات الوكالة الكاملة: اليوم والشهر والمؤشرات المالية) -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-950 flex items-center gap-2">
            <i data-lucide="trending-up" class="w-4 h-4 text-amber-600"></i>
            <span>إحصائيات الوكالة الكاملة (اليوم والشهر والمؤشرات المالية والتشغيلية)</span>
          </h3>
          <span class="text-xs text-slate-500 font-bold">تحديث تراكمي مباشر</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 1. إحصائيات اليوم -->
          <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-xs space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <span class="font-black text-xs text-sky-950 flex items-center gap-1.5">
                <i data-lucide="calendar" class="w-4 h-4 text-sky-600"></i>
                <span>إحصائيات اليوم (مباشر)</span>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 font-bold text-[10px]">اليوم 🔴</span>
            </div>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-bold">ساعات البث اليوم:</span>
                <span class="font-mono font-black text-slate-950 text-sm">${today.hours} ساعة</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-bold">إيرادات كوينز اليوم:</span>
                <span class="font-mono font-black text-amber-700 text-sm">${Number(today.coins).toLocaleString()} 🪙</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-bold">المضيفون في البث الآن:</span>
                <span class="font-black text-emerald-700">${today.activeHosts} مضيف مباشر 🔴</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-bold">الهدايا المستلمة اليوم:</span>
                <span class="font-mono font-bold text-purple-700">${Number(today.giftsCount).toLocaleString()} هدية 🎁</span>
              </div>
            </div>
          </div>

          <!-- 2. إحصائيات الشهر -->
          <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-xs space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <span class="font-black text-xs text-emerald-950 flex items-center gap-1.5">
                <i data-lucide="award" class="w-4 h-4 text-emerald-600"></i>
                <span>إحصائيات الشهر التراكمية</span>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px]">الشهر الحالي</span>
            </div>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-bold">ساعات البث الشهرية:</span>
                <span class="font-mono font-black text-slate-950 text-sm">${monthly.hours}h <span class="text-[10px] text-slate-500 font-normal">/ ${monthly.targetHours}h</span></span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-bold">إجمالي إيراد الشهر:</span>
                <span class="font-mono font-black text-amber-700 text-sm">${Number(monthly.revenue).toLocaleString()} 🪙</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-bold">عمولة الوكالة المحققة:</span>
                <span class="font-mono font-black text-emerald-700 text-sm">${Number(monthly.commissionEarned).toLocaleString()} 🪙</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-bold">نسبة إنجاز التارجت:</span>
                <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-black">${monthly.completionRate}% ⭐</span>
              </div>
            </div>
          </div>

          <!-- 3. المؤشرات المالية والتشغيلية -->
          <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-xs space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <span class="font-black text-xs text-purple-950 flex items-center gap-1.5">
                <i data-lucide="wallet" class="w-4 h-4 text-purple-600"></i>
                <span>المؤشرات المالية والتشغيلية</span>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold text-[10px]">المحفظة</span>
            </div>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-bold">الرصيد المتاح للسحب:</span>
                <span class="font-mono font-black text-slate-950 text-sm">${Number(finance.withdrawableBalance).toLocaleString()} 🪙 <span class="text-[10px] text-emerald-700 font-black">(${Math.round(finance.withdrawableBalance / 200).toLocaleString()} ر.س)</span></span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-bold">إجمالي السحوبات السابقة:</span>
                <span class="font-mono font-black text-slate-700">${Number(finance.totalWithdrawn).toLocaleString()} 🪙</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-bold">متوسط ساعات المضيف:</span>
                <span class="font-mono font-bold text-sky-800">${finance.avgHostHours} ساعة / يومياً</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-bold">تقييم الجودة والالتزام:</span>
                <span class="font-black text-amber-700">${finance.qualityScore}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- عند التمرير للأعلى / الأسفل: قائمة المضيفين بالكامل الموجودين لدى هذا الوكيل -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 sm:p-5 shadow-xs space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-200 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 border border-purple-300 flex items-center justify-center font-black">
              <i data-lucide="users" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-black text-slate-950">قائمة المضيفين بالكامل الموجودين لدى هذا الوكيل (${ag.owner})</h4>
                <span class="px-2 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-300 font-bold text-xs">${hostsList.length} مضيف</span>
              </div>
              <p class="text-[11px] text-slate-600 font-bold">
                أيام وساعات البث والحضور لكل مضيف مع الأرصدة والحسابات المالية وحالة الصرف
              </p>
            </div>
          </div>
        </div>

        <!-- Ruled Watery Table of Hosts -->
        <div class="overflow-x-auto rounded-xl border-2 border-slate-300 shadow-xs">
          <table class="w-full text-right text-xs whitespace-nowrap">
            <thead class="bg-slate-100 text-slate-950 font-black border-b-2 border-slate-300">
              <tr>
                <th class="py-3 px-3 text-center w-12 border-l border-slate-200">#</th>
                <th class="py-3 px-3 text-center border-l border-slate-200">معرف المضيف</th>
                <th class="py-3 px-3 border-l border-slate-200">صانع المحتوى / المضيف</th>
                <th class="py-3 px-3 border-l border-slate-200">الوسيط المشرف</th>
                <th class="py-3 px-3 text-center border-l border-slate-200 bg-sky-50/60">أيام الحضور الفعلي (الشهر)</th>
                <th class="py-3 px-3 text-center border-l border-slate-200 bg-amber-50/60">ساعات البث والحضور</th>
                <th class="py-3 px-3 text-center border-l border-slate-200">رصيد الكوينز المحقق</th>
                <th class="py-3 px-3 text-center border-l border-slate-200 bg-emerald-50/60">الأرباح بالريال السعودي</th>
                <th class="py-3 px-3 text-center border-l border-slate-200">حالة الصرف المالي</th>
                <th class="py-3 px-3 text-center border-l border-slate-200">حالة البث الآن</th>
                <th class="py-3 px-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-300">
              ${hostsList.map((host, idx) => {
                const days = host.daysAttended || Math.min(26, Math.max(16, Math.round((host.hoursAchieved || 80) / 4.8)));
                const hours = host.hoursAchieved || 100;
                const hoursTarget = host.hoursTarget || 120;
                const attendancePct = Math.min(100, Math.round((days / 26) * 100));
                const coinsEarned = host.monthlyRevenue || (hours * 22000);
                const sarEarned = Math.round(coinsEarned / 200);
                const payoutStatus = host.payoutStatus || (hours >= 100 ? 'جاهز للصرف ✅' : 'قيد التدقيق ⏳');
                const isLive = host.liveStatus && host.liveStatus.includes('مباشر');
                const rowBg = idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-[#edf6f9]';

                return `
                  <tr class="${rowBg} hover:bg-[#dff0f5] transition">
                    <td class="py-3 px-3 text-center font-bold text-slate-500 border-l border-slate-200">${idx + 1}</td>
                    <td class="py-3 px-3 text-center font-mono font-black text-slate-950 border-l border-slate-200">${host.id}</td>
                    <td class="py-3 px-3 border-l border-slate-200">
                      <div class="flex items-center gap-2.5">
                        <img src="${host.avatar}" class="w-8 h-8 rounded-xl object-cover border border-slate-300" alt="${host.name}" />
                        <div>
                          <div class="font-black text-slate-950">${host.name}</div>
                          <div class="text-[10px] font-mono text-slate-600">ID: #${host.userId} • ${host.category || 'صوتيات'}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-3 border-l border-slate-200 font-bold text-purple-900">
                      ${host.brokerName || 'تركي الشمري'}
                    </td>
                    <td class="py-3 px-3 text-center border-l border-slate-200 bg-sky-50/30">
                      <div class="inline-flex items-center gap-1.5">
                        <span class="font-mono font-black text-slate-950">${days} يوم</span>
                        <span class="text-[10px] text-slate-500">/ 26 يوم</span>
                        <span class="px-1.5 py-0.2 rounded text-[10px] font-black ${attendancePct >= 90 ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'}">${attendancePct}%</span>
                      </div>
                    </td>
                    <td class="py-3 px-3 text-center border-l border-slate-200 bg-amber-50/30 font-mono font-black text-slate-950">
                      ${hours}h <span class="text-[10px] text-slate-500 font-normal">/ ${hoursTarget}h</span>
                    </td>
                    <td class="py-3 px-3 text-center font-mono font-black text-amber-700 border-l border-slate-200">
                      ${Number(coinsEarned).toLocaleString()} 🪙
                    </td>
                    <td class="py-3 px-3 text-center font-mono font-black text-emerald-800 border-l border-slate-200 bg-emerald-50/30">
                      ${sarEarned.toLocaleString()} ر.س
                    </td>
                    <td class="py-3 px-3 text-center border-l border-slate-200">
                      <span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${payoutStatus.includes('جاهز') ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-amber-100 text-amber-950 border border-amber-300'}">
                        ${payoutStatus}
                      </span>
                    </td>
                    <td class="py-3 px-3 text-center border-l border-slate-200">
                      <span class="px-2 py-0.5 rounded-md text-[11px] font-bold ${isLive ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 animate-pulse' : 'bg-slate-100 text-slate-600 border border-slate-300'}">
                        ${host.liveStatus || 'غير متصل ⚪'}
                      </span>
                    </td>
                    <td class="py-3 px-3 text-center">
                      <button 
                        type="button" 
                        onclick="window.openHostFullProfile('${host.id}')" 
                        class="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-black text-[11px] transition inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="عرض الملف الشامل وتفاصيل الراتب والجهاز والهدايا">
                        <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
                        <span>التفاصيل الشاملة</span>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Modal Footer -->
    <div class="bg-white p-3 sm:p-4 border-t-2 border-slate-300 flex items-center justify-between shrink-0">
      <div class="text-xs text-slate-600 font-bold">
        عرض شامل لكافة مؤشرات الوكالة والمضيفين والحسابات المالية
      </div>
      <button type="button" onclick="window.closeAgencyCumulativeModal()" class="px-5 py-2 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-black text-xs transition cursor-pointer shadow-xs">
        إغلاق النافذة
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
  lucide.createIcons();
};

window.closeAgencyCumulativeModal = function() {
  const modal = document.getElementById('agencyCumulativeModal');
  if (modal) modal.classList.add('hidden');
};

window.enterManagerAccount = function(managerId) {
  window._hierarchyState.activeManagerId = managerId;
  window._hierarchyState.activeDelegateId = null;
  window._hierarchyState.activeAgencyId = null;
  window._hierarchyState.activeBrokerId = null;
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderAgencyHierarchyView(container);
  setTimeout(() => {
    const el = document.getElementById('hierarchy-manager-details');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
};

window.enterDelegateAccount = function(delegateId) {
  window._hierarchyState.activeDelegateId = delegateId;
  window._hierarchyState.activeAgencyId = null;
  window._hierarchyState.activeBrokerId = null;
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderAgencyHierarchyView(container);
  setTimeout(() => {
    const el = document.getElementById('hierarchy-level-3-agencies');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
};

window.enterAgencyAccount = function(agencyId) {
  window._hierarchyState.activeAgencyId = agencyId;
  window._hierarchyState.activeBrokerId = null;
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderAgencyHierarchyView(container);
  setTimeout(() => {
    const el = document.getElementById('hierarchy-level-4-brokers');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
};

window.enterBrokerAccount = function(brokerId) {
  window._hierarchyState.activeBrokerId = brokerId;
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderAgencyHierarchyView(container);
  setTimeout(() => {
    const el = document.getElementById('hierarchy-level-5-hosts');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
};

window.resetHierarchyToManagers = function() {
  window._hierarchyState.activeManagerId = null;
  window._hierarchyState.activeDelegateId = null;
  window._hierarchyState.activeAgencyId = null;
  window._hierarchyState.activeBrokerId = null;
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderAgencyHierarchyView(container);
};

window.toggleHierarchyCollapse = function(levelName) {
  window._hierarchyState.collapsedLevels[levelName] = !window._hierarchyState.collapsedLevels[levelName];
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderAgencyHierarchyView(container);
};

window.collapseHierarchyLevel = function(level) {
  if (level === 'delegate') {
    window._hierarchyState.activeDelegateId = null;
    window._hierarchyState.activeAgencyId = null;
    window._hierarchyState.activeBrokerId = null;
  } else if (level === 'agency') {
    window._hierarchyState.activeAgencyId = null;
    window._hierarchyState.activeBrokerId = null;
  } else if (level === 'broker') {
    window._hierarchyState.activeBrokerId = null;
  }
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderAgencyHierarchyView(container);
};

window.editManagerProfitShare = function(managerId) {
  const mgr = agencyManagers.find(m => m.id === managerId);
  if (!mgr) return;
  const newRate = prompt(`تعديل نسبة أرباح مدير الوكالات (${mgr.name}):`, String(mgr.profitSharePercent));
  if (newRate !== null && !isNaN(newRate)) {
    mgr.profitSharePercent = parseFloat(newRate);
    saveState();
    const container = document.getElementById('dynamicViewContainer');
    if (container) renderAgencyHierarchyView(container);
  }
};

window.editDelegateCommission = function(delegateId) {
  const del = agencyDelegates.find(d => d.id === delegateId);
  if (!del) return;
  const newRate = prompt(`تعديل نسبة عمولة المندوب (${del.name}) المقررة من مدير الوكالات:`, String(del.commissionRate));
  if (newRate !== null && !isNaN(newRate)) {
    del.commissionRate = parseFloat(newRate);
    saveState();
    const container = document.getElementById('dynamicViewContainer');
    if (container) renderAgencyHierarchyView(container);
  }
};

window.editAgencyCommission = function(agencyId) {
  const ag = agencies.find(a => a.id === agencyId);
  if (!ag) return;
  const newRate = prompt(`تعديل نسبة عمولة الوكالة الرسمية (${ag.name}):`, String(ag.commission));
  if (newRate !== null && !isNaN(newRate)) {
    ag.commission = parseFloat(newRate);
    saveState();
    const container = document.getElementById('dynamicViewContainer');
    if (container) renderAgencyHierarchyView(container);
  }
};

window.openAddDelegateModal = function(managerId) {
  const mgr = agencyManagers.find(m => m.id === managerId) || agencyManagers[0];
  if (!mgr) return;

  // 1. التحقق من تفويض صلاحية إضافة المندوبين من أبو أمجد
  if (mgr.permissions && mgr.permissions.canAssignDelegates === false) {
    alert(`⛔ عذراً، لا يملك ${mgr.name} صلاحية إضافة مندوبين حالياً!\nيرجى مراجعة إدارة أبو أمجد (رأس الهرم) لتفعيل الصلاحية من زر الثلاث نقط (⋮).`);
    return;
  }

  // 2. فحص كوتا المندوبين وقواعد الترقية الآلية المشروطة بالتسكير
  const status = window.calculateManagerDelegateStatus(mgr);
  const currentCount = agencyDelegates.filter(d => d.managerId === mgr.id).length;

  if (currentCount >= status.effectiveQuota) {
    let msg = `⚠️ عذراً، لا يمكن دعوة مندوب جديد لإدارة (${mgr.name}) حالياً!\n\n`;
    msg += `لقد استهلكت الإدارة كامل كوتا المندوبين المسموحة لها: (${currentCount} من أصل ${status.effectiveQuota} مندوبين).\n\n`;
    if (status.isAuto) {
      msg += `📊 نظام الترقية الآلي المشروط بتسكير الوكالات:\n`;
      msg += `• التسكير المحقق لوكالاتك حالياً: ${status.totalMillions} مليون كوينز.\n`;
      if (status.nextTier) {
        msg += `• الشريحة القادمة: يتطلب تسكير الوكالات مبلغ (${status.nextTier.targetMillions}) مليون كوينز للحصول على (${status.nextTier.earnedDelegates}) مندوبين.\n`;
        msg += `• المتبقي لتحقيق التسكير المطلوب: (${status.remainingMillions}) مليون كوينز.\n\n`;
        msg += `💡 بمجرد تحقيق وكالاتك لهذا التسكير، يتاح لك دعوة المندوبين آلياً دون تدخل يدوي!`;
      } else {
        msg += `• لقد تم تحقيق أعلى شريحة تسكير في النظام حالياً (${status.effectiveQuota} مندوبين).\n`;
      }
    } else {
      msg += `الكوتا اليدوية محددة بـ ${status.effectiveQuota} مندوبين. يرجى مراجعة إدارة أبو أمجد لتوسيع الكوتا.`;
    }
    alert(msg);
    return;
  }
  
  // سؤال المشرف عن الهوية الأساسية للمستخدم أو إدخال جديد
  const userOption = prompt(
    `منح صلاحية مندوب جديد تحت إدارة (${mgr.name}):\n` +
    `• الكوتا المتاحة: (${currentCount} مستهلك من أصل ${status.effectiveQuota} مسموح)\n\n` +
    `• أدخل المعرف الأساسي للمستخدم الحالي (مثل 1001001 فما فوق) لربط الصلاحية بحسابه مباشرة.\n` +
    `• أو اكتب اسم المندوب الجديد ليولد له النظام تلقائياً معرفاً أساسياً ثابتاً.`
  );
  if (!userOption) return;

  let targetUser = null;
  const numCheck = parseInt(userOption.trim(), 10);
  if (!isNaN(numCheck) && numCheck >= 1000000) {
    targetUser = users.find(u => u.id === numCheck || u.primaryId === numCheck);
  }

  if (targetUser) {
    // فتح نافذة منح الصلاحية المخصصة لهذا المستخدم مباشرة
    window.openAssignRoleModal(targetUser.id);
    return;
  }

  // إذا تم إدخال اسم مستخدم جديد
  const nextId = window.getNextPrimarySystemId();
  const rate = prompt(`النسبة المقررة للمندوب % (يحددها مدير الوكالات ${mgr.name}):`, '14.0');
  const phone = prompt('رقم هاتف المندوب:', '+96650' + Math.floor(1000000 + Math.random() * 9000000));
  
  let nextDelNum = 401;
  agencyDelegates.forEach(d => {
    const match = d.id && d.id.match(/DEL-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num >= nextDelNum) nextDelNum = num + 1;
    }
  });
  const newDelId = 'DEL-' + nextDelNum;

  // 1. إنشاء حساب المستخدم الأساسي بالمعرف الأساسي التلقائي
  const newUser = {
    id: nextId,
    primaryId: nextId,
    specialId: String(Math.floor(1000000 + Math.random() * 9000000)),
    gameUuid: `${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}-4a84-90aa-${Date.now().toString().slice(-12)}`,
    displayName: userOption.trim(),
    phone: phone || '+966500000000',
    email: `del${nextId}@gala.live`,
    family: 'عائلة الملوك',
    coins: 500000,
    diamonds: 1000,
    level: 1,
    vipLevel: 0,
    status: 'active',
    roles: ['DELEGATE'],
    functionalRoleCode: newDelId,
    roleTitle: `مندوب استقطاب وكلاء معتمد (${newDelId}) 🌟`
  };
  users.unshift(newUser);

  // 2. ربط سجل المندوب بالمعرف الأساسي الثابت
  agencyDelegates.push({
    id: newDelId,
    primaryUserId: nextId,
    managerId: mgr.id,
    managerName: mgr.name,
    name: `${newUser.displayName} (مندوب معتمد 🌟)`,
    roleTitle: 'مندوب استقطاب وكلاء معتمد',
    commissionRate: parseFloat(rate) || 14.0,
    phone: newUser.phone,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    invitedAgenciesCount: 0,
    totalRevenue: 0,
    earnedCoins: 0,
    country: 'السعودية',
    city: 'الرياض',
    status: 'معتمد',
    joinDate: new Date().toISOString().split('T')[0]
  });

  mgr.delegatesCount = (mgr.delegatesCount || 0) + 1;
  saveState();
  window.showManagerDelegates(mgr.id);
  alert(`✅ تم توليد المعرف الأساسي #${nextId} وربط الصلاحية الوظيفية للمندوب (${newDelId}) به بنجاح.`);
};

window.openAddAgencyForDelegateModal = function(delegateId) {
  const del = agencyDelegates.find(d => d.id === delegateId) || agencyDelegates[0];
  const name = prompt(`اسم الوكالة الرسمية الجديدة المستدعاة عبر المندوب (${del.name}):`);
  if (!name) return;
  const owner = prompt('اسم الوكيل الرسمي (مالك الوكالة):');
  if (!owner) return;
  const comm = prompt('نسبة عمولة الوكالة الرسمية %:', '14.0');
  const newAgId = 'AG-' + (agencies.length + 101);
  const primaryId = window.getNextPrimarySystemId();

  // إنشاء حساب مستخدم للوكيل الرسمي بالمعرف الأساسي الموحد
  users.push({
    id: primaryId,
    primaryId: primaryId,
    specialId: String(Math.floor(1000000 + Math.random() * 9000000)),
    gameUuid: `${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}-4a84-90aa-${Date.now().toString().slice(-12)}`,
    displayName: (owner + ' (الوكيل الرسمي)').trim(),
    phone: '+9665' + Math.floor(10000000 + Math.random() * 90000000),
    email: `agent${primaryId}@gala.live`,
    family: 'عائلة الوكلاء المعتمدين',
    coins: 1000000,
    diamonds: 1000,
    level: 1,
    vipLevel: 0,
    status: 'active',
    roles: ['OFFICIAL_AGENT'],
    functionalRoleCode: newAgId,
    roleTitle: `وكيل رسمي معتمد (${newAgId})`
  });

  agencies.push({
    id: newAgId,
    name,
    managerId: del.managerId,
    delegateId: del.id,
    invitedBy: `المندوب: ${del.name} (${del.id})`,
    owner: owner + ' (الوكيل الرسمي)',
    ownerId: String(primaryId),
    ownerPrimaryId: primaryId,
    coins: 5000000,
    commission: parseFloat(comm) || 14.0,
    brokersCount: 0,
    hosts: 0,
    hours: 0,
    target: 20000000,
    achievedTarget: 5000000,
    status: 'نشطة',
    todayStats: { hours: 12.0, coins: 350000, activeHosts: 4, giftsCount: 650 },
    monthlyStats: { hours: 240, targetHours: 500, revenue: 5000000, targetRevenue: 20000000, commissionEarned: 700000, completionRate: 25.0 },
    financialMetrics: { withdrawableBalance: 800000, totalWithdrawn: 1200000, avgHostHours: 3.5, qualityScore: '95.0% (جيد جداً)' }
  });

  del.invitedAgenciesCount = (del.invitedAgenciesCount || 0) + 1;
  const mgr = agencyManagers.find(m => m.id === del.managerId);
  if (mgr) mgr.totalAgencies = (mgr.totalAgencies || 0) + 1;

  saveState();
  window.openAgencyCumulativeModal(newAgId);
};

window.openAddBrokerForHierarchyAgency = function(agencyId) {
  const ag = agencies.find(a => a.id === agencyId) || agencies[0];
  const name = prompt(`اسم الوسيط الجديد التابع للوكيل الرسمي (${ag.owner}):`);
  if (!name) return;
  const rate = prompt(`نسبة عمولة الوسيط % الممنوحة من الوكيل الرسمي (${ag.owner}):`, '3.5');
  const phone = prompt('رقم هاتف الوسيط:', '+96650' + Math.floor(1000000 + Math.random() * 9000000));
  const newBrkId = 'BRK-' + ag.id.replace('AG-', '') + '-' + (agencyBrokers.filter(b => b.agencyId === ag.id).length + 1);
  const primaryId = window.getNextPrimarySystemId();

  // إنشاء حساب مستخدم للوسيط وربط الصلاحية
  users.push({
    id: primaryId,
    primaryId: primaryId,
    specialId: String(Math.floor(1000000 + Math.random() * 9000000)),
    gameUuid: `${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}-4a84-90aa-${Date.now().toString().slice(-12)}`,
    displayName: name.trim(),
    phone: phone || '+966500000000',
    email: `broker${primaryId}@gala.live`,
    family: 'عائلة الوسطاء المعتمدين',
    coins: 500000,
    diamonds: 500,
    level: 1,
    vipLevel: 0,
    status: 'active',
    roles: ['BROKER'],
    functionalRoleCode: newBrkId,
    roleTitle: `وسيط وكالة معتمد (${newBrkId})`
  });

  agencyBrokers.push({
    id: newBrkId,
    agencyId: ag.id,
    name,
    userId: String(primaryId),
    primaryUserId: primaryId,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    hostsCount: 0,
    totalRevenue: 0,
    commissionRate: parseFloat(rate) || 3.5,
    earnedCoins: 0,
    status: 'نشط',
    phone: phone || '+966500000000',
    joinDate: new Date().toISOString().split('T')[0]
  });

  ag.brokersCount = (ag.brokersCount || 0) + 1;
  saveState();
  window.enterBrokerAccount(newBrkId);
};

// =========================================================================
// نافذة تفويض الصلاحيات الإدارية (الثلاث نقط ⋮) لإدارة الكابتن وباقي الإدارات
// =========================================================================
window.openManagerPermissionsModal = function(managerId) {
  const mgr = agencyManagers.find(m => m.id === managerId) || agencyManagers[0];
  if (!mgr) return;

  const modal = document.getElementById('managerPermissionsModal');
  const modalContent = document.getElementById('managerPermissionsModalContent');
  if (!modal || !modalContent) return;

  // Defaults if permissions object is not yet defined
  if (!mgr.permissions) {
    mgr.permissions = {
      canAssignDelegates: true,
      maxDelegatesQuota: 5,
      canApproveAgencies: true,
      canTransferHosts: true,
      canUnbanAccounts: true,
      canTransferBrokerHosts: true,
      rechargeControlBlocked: true
    };
  }

  const p = mgr.permissions;
  const currentDelegatesCount = agencyDelegates.filter(d => d.managerId === mgr.id).length;

  modalContent.innerHTML = `
    <!-- Header -->
    <div class="px-6 py-4 border-b-2 border-slate-300 bg-slate-900 text-white flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
          <i data-lucide="shield-check" class="w-6 h-6"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-black text-white text-base">منح وتفويض الصلاحيات الإدارية (الثلاث نقط ⋮)</h3>
            <span class="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs font-mono">${mgr.id}</span>
          </div>
          <p class="text-xs text-amber-200/90 font-bold mt-0.5">
            رأس الهرم: <strong class="text-white">أبو أمجاد (مدير عام الوكالات 🔱)</strong> يفوّض الصلاحيات لـ: <span class="text-amber-300 underline">${mgr.name}</span>
          </p>
        </div>
      </div>
      <button 
        type="button" 
        onclick="window.closeManagerPermissionsModal()" 
        class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <!-- Manager Summary Bar -->
    <div class="px-6 py-3 bg-[#f7fbfd] border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700 flex-wrap gap-2">
      <div class="flex items-center gap-3">
        <img src="${mgr.avatar}" class="w-9 h-9 rounded-xl object-cover border border-amber-400" />
        <div>
          <div class="text-slate-950 font-black">${mgr.name}</div>
          <div class="text-slate-500 text-[11px]">${mgr.roleTitle}</div>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <span class="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-800">
          المندوبين المسجلين: <strong class="font-mono text-emerald-600">${currentDelegatesCount}</strong>
        </span>
        <span class="px-2.5 py-1 bg-amber-50 border border-amber-300 rounded-lg text-amber-900">
          إجمالي تسكير الوكالات: <strong class="font-mono text-amber-700">${Math.floor(window.getManagerTotalClosingCoins(mgr.id) / 1000000)}M كوينز</strong>
        </span>
      </div>
    </div>

    <!-- Body / Permissions List -->
    <div class="p-6 overflow-y-auto space-y-4 max-h-[65vh]">

      <!-- Permission 1: Delegate Quota & Automated Closing Target Scaling -->
      ${(() => {
        const autoRules = window.getManagerAutoUnlockRules(mgr);
        const delStatus = window.calculateManagerDelegateStatus(mgr);
        return `
        <div class="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-400/80 transition shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-sky-100 text-sky-900 border border-sky-300 flex items-center justify-center font-black">
                <i data-lucide="users" class="w-5 h-5 text-sky-700"></i>
              </div>
              <div>
                <div class="font-black text-slate-950 text-sm flex items-center gap-2">
                  <span>منح صلاحيات مندوبين وتحديد الكوتا</span>
                  <span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black">
                    ⚡ يدعم الزيادة الآلية عند التسكير
                  </span>
                </div>
                <div class="text-xs text-slate-500 font-bold">السماح لـ ${mgr.name} بدعوة وتسجيل المندوبين يدويًا أو تلقائيًا عند تحقيق أهداف تسكير الوكالات</div>
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="permCanAssignDelegates" class="sr-only peer" ${p.canAssignDelegates ? 'checked' : ''} onchange="window.toggleDelegateQuotaInput(this.checked)" />
              <div class="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <!-- Quota & Automation Container -->
          <div id="quotaControlsContainer" class="${p.canAssignDelegates ? '' : 'opacity-40 pointer-events-none'} pt-3 border-t border-slate-100 space-y-3">
            
            <!-- خيار التفعيل الآلي المشروط بتسكير مبالغ الوكالات -->
            <div class="p-3 rounded-xl bg-[#f7fbfd] border border-sky-200 flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="permAutoUnlockEnabled" 
                  class="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer" 
                  ${autoRules.enabled ? 'checked' : ''} 
                  onchange="window.toggleAutoUnlockSection(this.checked)" />
                <label for="permAutoUnlockEnabled" class="text-xs font-black text-slate-900 cursor-pointer">
                  تفعيل الزيادة الآلية لعدد المندوبين تلقائياً عند تسكير الوكالات المستهدفة (100M / 300M / 500M كوينز)
                </label>
              </div>
              <div class="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>الكوتا الأساسية المبدئية:</span>
                <input 
                  type="number" 
                  id="permBaseQuota" 
                  value="${autoRules.baseQuota || 3}" 
                  min="1" 
                  max="50" 
                  class="w-14 px-2 py-1 rounded-lg border border-slate-300 text-center font-mono font-black" />
                <span>مندوبين</span>
              </div>
            </div>

            <!-- جدول وقواعد شرائح التسكير الآلية (100 مليون، 300 مليون، 500 مليون...) -->
            <div id="autoTiersSection" class="${autoRules.enabled ? '' : 'hidden'} space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-black text-slate-900 flex items-center gap-1.5">
                  <i data-lucide="target" class="w-4 h-4 text-amber-600"></i>
                  <span>جدول شرائح التسكير والترقية الآلية (تخصيص المبالغ وكوتا المندوبين):</span>
                </span>
                <button 
                  type="button" 
                  onclick="window.addAutoTierRow()" 
                  class="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] flex items-center gap-1 transition cursor-pointer shadow-2xs">
                  <i data-lucide="plus" class="w-3 h-3"></i>
                  <span>+ إضافة شريحة تسكير</span>
                </button>
              </div>

              <!-- جدول الشرائح المحدد بدقة -->
              <div class="border-2 border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                <table class="w-full text-right text-xs">
                  <thead class="bg-slate-100 text-slate-700 border-b border-slate-300 text-[11px] font-black">
                    <tr>
                      <th class="px-3 py-2 border-l border-slate-200">مبلغ تسكير الوكالات (بالمليون كوينز)</th>
                      <th class="px-3 py-2 border-l border-slate-200">عدد المندوبين المستحقين</th>
                      <th class="px-3 py-2 border-l border-slate-200">حالة الإنجاز اللحظية</th>
                      <th class="px-3 py-2 text-center w-12">حذف</th>
                    </tr>
                  </thead>
                  <tbody id="autoTiersTableBody" class="divide-y divide-slate-200 font-bold">
                    ${autoRules.tiers.map((t, idx) => {
                      const isAchieved = delStatus.totalMillions >= t.targetMillions;
                      return `
                        <tr class="tier-row ${isAchieved ? 'bg-emerald-50/70' : 'hover:bg-slate-50'}">
                          <td class="px-3 py-2 border-l border-slate-200">
                            <div class="flex items-center gap-1.5">
                              <input 
                                type="number" 
                                name="tierTargetMillions" 
                                value="${t.targetMillions}" 
                                min="10" 
                                step="10" 
                                class="w-24 px-2 py-1 rounded-lg border border-slate-300 font-mono font-black text-slate-950 text-xs text-center" />
                              <span class="text-slate-600 font-bold">مليون كوينز</span>
                            </div>
                          </td>
                          <td class="px-3 py-2 border-l border-slate-200">
                            <div class="flex items-center gap-1.5">
                              <input 
                                type="number" 
                                name="tierEarnedDelegates" 
                                value="${t.earnedDelegates}" 
                                min="1" 
                                max="100" 
                                class="w-20 px-2 py-1 rounded-lg border border-slate-300 font-mono font-black text-slate-950 text-xs text-center" />
                              <span class="text-slate-600 font-bold">مندوبين</span>
                            </div>
                          </td>
                          <td class="px-3 py-2 border-l border-slate-200">
                            ${isAchieved ? `
                              <span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300 text-[11px] font-black inline-flex items-center gap-1">
                                <i data-lucide="check" class="w-3 h-3 text-emerald-700"></i>
                                <span>مكتمل ومفعل (${t.earnedDelegates} مندوب)</span>
                              </span>
                            ` : `
                              <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-bold inline-flex items-center gap-1">
                                <span>متبقي ${Math.max(0, t.targetMillions - delStatus.totalMillions)} مليون</span>
                              </span>
                            `}
                          </td>
                          <td class="px-3 py-2 text-center">
                            <button 
                              type="button" 
                              onclick="window.removeAutoTierRow(this)" 
                              class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition cursor-pointer">
                              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>

              <!-- بطاقة الإنجاز اللحظي وشريط التقدم -->
              <div class="p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-sky-50 border border-amber-200 text-xs space-y-1.5">
                <div class="flex items-center justify-between font-black text-slate-900">
                  <span>الكوتا المستحقة آلياً حالياً: <strong class="text-amber-800 font-mono text-sm">${delStatus.effectiveQuota} مندوبين</strong></span>
                  <span class="text-[11px] text-slate-600">التسكير المنجز: <strong class="font-mono text-slate-950">${delStatus.totalMillions}M</strong> من الهدف القادم</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div class="bg-amber-500 h-2 rounded-full transition-all" style="width: ${delStatus.progressPercent}%"></div>
                </div>
                <div class="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                  <span>المندوبين المستخدمين: ${delStatus.currentDelegatesCount} من أصل ${delStatus.effectiveQuota}</span>
                  ${delStatus.nextTier ? `<span>المتبقي للترقية للشريحة القادمة: <strong class="text-sky-800">${delStatus.remainingMillions}M كوينز</strong></span>` : `<span class="text-emerald-700 font-black">تم تسكير أعلى شريحة بنجاح! 🏆</span>`}
                </div>
              </div>
            </div>

            <!-- الكوتا اليدوية في حال إلغاء الزيادة الآلية -->
            <div id="manualQuotaContainer" class="${autoRules.enabled ? 'hidden' : ''} flex flex-wrap items-center justify-between gap-3 pt-2">
              <div class="flex items-center gap-2">
                <label class="text-xs font-bold text-slate-700">الحد الأقصى للمندوبين المسموحين (الكوتا اليدوية):</label>
                <input 
                  type="number" 
                  id="permMaxDelegatesQuota" 
                  value="${p.maxDelegatesQuota || 5}" 
                  min="${Math.max(1, currentDelegatesCount)}" 
                  max="100" 
                  class="w-20 px-2.5 py-1.5 rounded-lg border-2 border-slate-300 font-mono font-black text-center text-sm focus:border-amber-500 outline-hidden" />
                <span class="text-xs text-slate-500 font-bold">مندوب</span>
              </div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-[11px] font-bold text-slate-500">كوتا سريعة:</span>
                ${[3, 5, 10, 15, 20, 50].map(q => `
                  <button 
                    type="button" 
                    onclick="document.getElementById('permMaxDelegatesQuota').value = ${q}" 
                    class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-300 text-xs font-mono font-bold transition cursor-pointer">
                    ${q}
                  </button>
                `).join('')}
              </div>
            </div>

          </div>
        </div>
        `;
      })()}

      <!-- Permission 2: Agency Approval -->
      <div class="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-400/80 transition shadow-xs flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center justify-center font-black">
            <i data-lucide="check-circle" class="w-5 h-5 text-emerald-700"></i>
          </div>
          <div>
            <div class="font-black text-slate-950 text-sm">عمل موافقة (اعتماد الوكالات المستدعاة)</div>
            <div class="text-xs text-slate-500 font-bold">صلاحية اعتماد الوكالات الجديدة والموافقة على انضمامها تلقائياً</div>
          </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="permCanApproveAgencies" class="sr-only peer" ${p.canApproveAgencies ? 'checked' : ''} />
          <div class="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      <!-- Permission 3: Host Transfer Agency-to-Agency -->
      <div class="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-400/80 transition shadow-xs flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 border border-purple-300 flex items-center justify-center font-black">
            <i data-lucide="arrow-left-right" class="w-5 h-5 text-purple-700"></i>
          </div>
          <div>
            <div class="font-black text-slate-950 text-sm">منح صلاحيات نقل المضيفين من وكيل إلى وكيل</div>
            <div class="text-xs text-slate-500 font-bold">صلاحية تفويض نقل المذيعين والمضيفين بين وكالات الإدارة المعتمدة</div>
          </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="permCanTransferHosts" class="sr-only peer" ${p.canTransferHosts ? 'checked' : ''} />
          <div class="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      <!-- Permission 4: Unban Accounts -->
      <div class="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-400/80 transition shadow-xs flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-black">
            <i data-lucide="unlock" class="w-5 h-5 text-amber-700"></i>
          </div>
          <div>
            <div class="font-black text-slate-950 text-sm">منح صلاحيات فك الحظر</div>
            <div class="text-xs text-slate-500 font-bold">صلاحية فك القيود ورفع الحظر الإداري عن حسابات المضيفين والوكلاء</div>
          </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="permCanUnbanAccounts" class="sr-only peer" ${p.canUnbanAccounts ? 'checked' : ''} />
          <div class="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      <!-- Permission 5: Broker to Agency Host Transfer -->
      <div class="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-400/80 transition shadow-xs flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-teal-100 text-teal-900 border border-teal-300 flex items-center justify-center font-black">
            <i data-lucide="git-merge" class="w-5 h-5 text-teal-700"></i>
          </div>
          <div>
            <div class="font-black text-slate-950 text-sm">منح صلاحيات نقل الحسابات من الوسطاء إلى الوكيل</div>
            <div class="text-xs text-slate-500 font-bold">صلاحية نقل المضيفين التابعين للوسطاء وضمهم للوكيل الرسمي مباشرة</div>
          </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="permCanTransferBrokerHosts" class="sr-only peer" ${p.canTransferBrokerHosts ? 'checked' : ''} />
          <div class="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      <!-- MANDATORY FINANCIAL SECURITY LOCK: Recharge Delegation -->
      <div class="p-4 rounded-2xl bg-red-50/50 border-2 border-red-300/80 shadow-xs flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-red-100 text-red-900 border border-red-300 flex items-center justify-center font-black">
            <i data-lucide="lock" class="w-5 h-5 text-red-700"></i>
          </div>
          <div>
            <div class="font-black text-red-950 text-sm flex items-center gap-2">
              <span>صلاحيات التحكم بالشحن (مقفل نهائياً 🔒)</span>
              <span class="px-2 py-0.5 rounded-md bg-red-600 text-white font-mono text-[10px]">خط أحمر مالي</span>
            </div>
            <div class="text-xs text-red-700 font-bold mt-0.5">
              الشحن محصور بالداشبورد المالي والوكالات المعتمدة. لا يملك أي مدير تفويض الشحن، ولا يشحن إلا عبر رأس الهرم أو بطاقة معتمدة.
            </div>
          </div>
        </div>
        <span class="px-3 py-1.5 rounded-xl bg-red-200 border border-red-400 text-red-950 font-black text-xs">
          غير قابل للتفويض 🔒
        </span>
      </div>

    </div>

    <!-- Footer -->
    <div class="px-6 py-4 border-t-2 border-slate-300 bg-slate-50 flex items-center justify-between">
      <div class="text-xs text-slate-500 font-bold">
        يتم تطبيق الصلاحيات وحفظها في الهيكل الإداري فوراً.
      </div>
      <div class="flex items-center gap-3">
        <button 
          type="button" 
          onclick="window.closeManagerPermissionsModal()" 
          class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs transition cursor-pointer">
          إلغاء
        </button>
        <button 
          type="button" 
          onclick="window.saveManagerPermissions('${mgr.id}')" 
          class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer">
          <i data-lucide="save" class="w-4 h-4"></i>
          <span>حفظ وتطبيق الصلاحيات المفوضة</span>
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
};

window.closeManagerPermissionsModal = function() {
  const modal = document.getElementById('managerPermissionsModal');
  if (modal) modal.classList.add('hidden');
};

window.toggleDelegateQuotaInput = function(isChecked) {
  const container = document.getElementById('quotaControlsContainer');
  if (container) {
    if (isChecked) {
      container.classList.remove('opacity-40', 'pointer-events-none');
    } else {
      container.classList.add('opacity-40', 'pointer-events-none');
    }
  }
};

window.toggleAutoUnlockSection = function(isAuto) {
  const autoSection = document.getElementById('autoTiersSection');
  const manualContainer = document.getElementById('manualQuotaContainer');
  if (autoSection) {
    if (isAuto) autoSection.classList.remove('hidden');
    else autoSection.classList.add('hidden');
  }
  if (manualContainer) {
    if (isAuto) manualContainer.classList.add('hidden');
    else manualContainer.classList.remove('hidden');
  }
};

window.addAutoTierRow = function() {
  const tbody = document.getElementById('autoTiersTableBody');
  if (!tbody) return;
  const tr = document.createElement('tr');
  tr.className = 'tier-row hover:bg-slate-50';
  tr.innerHTML = `
    <td class="px-3 py-2 border-l border-slate-200">
      <div class="flex items-center gap-1.5">
        <input 
          type="number" 
          name="tierTargetMillions" 
          value="200" 
          min="10" 
          step="10" 
          class="w-24 px-2 py-1 rounded-lg border border-slate-300 font-mono font-black text-slate-950 text-xs text-center" />
        <span class="text-slate-600 font-bold">مليون كوينز</span>
      </div>
    </td>
    <td class="px-3 py-2 border-l border-slate-200">
      <div class="flex items-center gap-1.5">
        <input 
          type="number" 
          name="tierEarnedDelegates" 
          value="6" 
          min="1" 
          max="100" 
          class="w-20 px-2 py-1 rounded-lg border border-slate-300 font-mono font-black text-slate-950 text-xs text-center" />
        <span class="text-slate-600 font-bold">مندوبين</span>
      </div>
    </td>
    <td class="px-3 py-2 border-l border-slate-200">
      <span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold">
        شريحة جديدة (يتم احتسابها بعد الحفظ)
      </span>
    </td>
    <td class="px-3 py-2 text-center">
      <button 
        type="button" 
        onclick="window.removeAutoTierRow(this)" 
        class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition cursor-pointer">
        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
      </button>
    </td>
  `;
  tbody.appendChild(tr);
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
};

window.removeAutoTierRow = function(btn) {
  const row = btn.closest('tr');
  if (row) row.remove();
};

window.saveManagerPermissions = function(managerId) {
  const mgr = agencyManagers.find(m => m.id === managerId);
  if (!mgr) return;

  const canAssignDelegates = document.getElementById('permCanAssignDelegates')?.checked || false;
  const isAutoEnabled = document.getElementById('permAutoUnlockEnabled')?.checked || false;
  const baseQuota = parseInt(document.getElementById('permBaseQuota')?.value || '3', 10);
  const manualQuota = parseInt(document.getElementById('permMaxDelegatesQuota')?.value || '5', 10);

  // استخراج شرائح التسكير من الجدول
  const tierRows = document.querySelectorAll('#autoTiersTableBody tr');
  const extractedTiers = [];
  tierRows.forEach((r, idx) => {
    const targetInput = r.querySelector('input[name="tierTargetMillions"]');
    const delegateInput = r.querySelector('input[name="tierEarnedDelegates"]');
    if (targetInput && delegateInput) {
      const targetMillions = parseInt(targetInput.value, 10);
      const earnedDelegates = parseInt(delegateInput.value, 10);
      if (!isNaN(targetMillions) && !isNaN(earnedDelegates) && targetMillions > 0 && earnedDelegates > 0) {
        extractedTiers.push({
          id: idx + 1,
          targetMillions,
          earnedDelegates,
          label: `تسكير ${targetMillions} مليون كوينز`
        });
      }
    }
  });

  if (extractedTiers.length === 0) {
    extractedTiers.push(
      { id: 1, targetMillions: 100, earnedDelegates: 5, label: 'تسكير 100 مليون كوينز' },
      { id: 2, targetMillions: 300, earnedDelegates: 8, label: 'تسكير 300 مليون كوينز' },
      { id: 3, targetMillions: 500, earnedDelegates: 12, label: 'تسكير 500 مليون كوينز' }
    );
  }

  mgr.delegateAutoUnlock = {
    enabled: isAutoEnabled,
    baseQuota: isNaN(baseQuota) ? 3 : baseQuota,
    tiers: extractedTiers.sort((a, b) => a.targetMillions - b.targetMillions)
  };

  const status = window.calculateManagerDelegateStatus(mgr);
  const maxDelegatesQuota = isAutoEnabled ? status.effectiveQuota : manualQuota;

  const canApproveAgencies = document.getElementById('permCanApproveAgencies')?.checked || false;
  const canTransferHosts = document.getElementById('permCanTransferHosts')?.checked || false;
  const canUnbanAccounts = document.getElementById('permCanUnbanAccounts')?.checked || false;
  const canTransferBrokerHosts = document.getElementById('permCanTransferBrokerHosts')?.checked || false;

  mgr.permissions = {
    canAssignDelegates,
    maxDelegatesQuota,
    canApproveAgencies,
    canTransferHosts,
    canUnbanAccounts,
    canTransferBrokerHosts,
    rechargeControlBlocked: true
  };

  saveState();
  window.closeManagerPermissionsModal();

  // إشعار فوري بنجاح الحفظ وتحديث الكوتا
  if (window.showAppNotification) {
    window.showAppNotification(
      `تم تفويض وتحديث صلاحيات ${mgr.name} بنجاح!\nالكوتا الفعالة للمندوبين: ${maxDelegatesQuota} ${isAutoEnabled ? '(آلية بالتسكير)' : '(يدوية)'}`,
      'success'
    );
  }

  // Refresh current view if open
  const modalFullscreen = document.getElementById('managerAgenciesFullscreenModal');
  if (modalFullscreen && !modalFullscreen.classList.contains('hidden') && window._hierarchyState?.activeManagerId === mgr.id) {
    window.openManagerAgenciesFullscreen(mgr.id);
  }

  const container = document.getElementById('dynamicViewContainer');
  if (currentTab === 'agency_hierarchy' && container) {
    renderAgencyHierarchyView(container);
  }
};

function renderAgencyHierarchyView(container) {
  const viewScope = window._hierarchyState.viewScope || 'admin';
  const isIsolatedCaptainScope = (viewScope === 'MGR-9902');

  // في حال تفعيل منظور العزل القيادي للكابتن، يتم حصر الإداري النشط به تلقائياً
  if (isIsolatedCaptainScope) {
    window._hierarchyState.activeManagerId = 'MGR-9902';
  }

  const activeMgr = agencyManagers.find(m => m.id === window._hierarchyState.activeManagerId) || agencyManagers[0];
  const activeDel = agencyDelegates.find(d => d.id === window._hierarchyState.activeDelegateId) || null;
  const activeAg = agencies.find(a => a.id === window._hierarchyState.activeAgencyId) || null;
  const activeBrk = agencyBrokers.find(b => b.id === window._hierarchyState.activeBrokerId) || null;
  const activeManagerSubTab = window._hierarchyState.activeManagerSubTab || 'agencies';

  // تصفية وعزل البيانات: إذا كان المنظور معزولاً، يتم حصر كل شيء بالقيادة المحددة فقط
  const visibleManagers = isIsolatedCaptainScope ? agencyManagers.filter(m => m.id === 'MGR-9902') : agencyManagers;
  const managerDelegates = activeMgr ? agencyDelegates.filter(d => d.managerId === activeMgr.id) : (isIsolatedCaptainScope ? agencyDelegates.filter(d => d.managerId === 'MGR-9902') : agencyDelegates);
  const managerAgencies = activeMgr ? agencies.filter(a => a.managerId === activeMgr.id) : (isIsolatedCaptainScope ? agencies.filter(a => a.managerId === 'MGR-9902') : agencies);
  const currentDelegates = activeMgr ? managerDelegates : (isIsolatedCaptainScope ? managerDelegates : agencyDelegates);
  const currentAgencies = activeDel ? agencies.filter(a => a.delegateId === activeDel.id) : managerAgencies;
  const currentBrokers = activeAg ? agencyBrokers.filter(b => b.agencyId === activeAg.id) : [];
  const currentHosts = activeBrk ? agencyHosts.filter(h => h.brokerId === activeBrk.id) : (activeAg ? agencyHosts.filter(h => h.agencyId === activeAg.id) : []);

  const delStatus = window.calculateManagerDelegateStatus(activeMgr);
  const totalMgrClosingCoins = window.getManagerTotalClosingCoins(activeMgr.id);
  const totalMgrClosingMillions = Math.floor(totalMgrClosingCoins / 1000000);
  const totalHostsCount = managerAgencies.reduce((acc, a) => acc + (a.hosts || 0), 0);
  const totalHoursCount = managerAgencies.reduce((acc, a) => acc + (a.hours || 0), 0);
  const mgrProfitCoins = Math.round(totalMgrClosingCoins * (activeMgr.profitSharePercent / 100));

  container.innerHTML = `
    <div class="space-y-5 animate-fade-in text-slate-900 pb-16">

      <!-- 1. LEADERSHIP PERSPECTIVE & PRIVACY SCOPE SWITCHER (عزل القيادة الهرمية وتحديد المنظور) -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl ${isIsolatedCaptainScope ? 'bg-sky-600 text-white' : 'bg-amber-500 text-slate-950'} flex items-center justify-center font-black shadow-xs shrink-0">
            <i data-lucide="${isIsolatedCaptainScope ? 'shield' : 'crown'}" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-500">منظور العرض وعزل الصلاحيات الهرمي:</span>
              <span class="px-2 py-0.5 rounded-md text-[11px] font-black ${isIsolatedCaptainScope ? 'bg-sky-100 text-sky-950 border border-sky-300' : 'bg-amber-100 text-amber-950 border border-amber-300'}">
                ${isIsolatedCaptainScope ? '🛡️ وضع قيادة الكابتن المعزول' : '👑 وضع رأس الهرم العام (أبو أمجد)'}
              </span>
            </div>
            <div class="text-xs font-black text-slate-950 mt-0.5">
              ${isIsolatedCaptainScope 
                ? '🔒 تم عزل العرض: لا يظهر سوى الوكالات والمندوبين والمضيفين التابعين لقيادة الكابتن فقط، ولا يرى قيادة غيره في البرنامج.'
                : 'رأس الهرم يملك الرؤية الشاملة لجميع مدراء الوكالات وتفويض الصلاحيات والكوتا وتحديد نسب الأرباح.'}
            </div>
          </div>
        </div>

        <!-- تبديل المنظور بين رأس الهرم وقيادة الكابتن المعزولة -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs font-bold text-slate-600 hidden sm:inline">تبديل المنظور:</span>
          <button 
            type="button" 
            onclick="window.setHierarchyScope('admin')" 
            class="px-3.5 py-1.5 rounded-xl border text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${!isIsolatedCaptainScope ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'}">
            <i data-lucide="crown" class="w-3.5 h-3.5"></i>
            <span>إدارة أبو أمجد (رأس الهرم 🔱)</span>
          </button>
          
          <button 
            type="button" 
            onclick="window.setHierarchyScope('MGR-9902')" 
            class="px-3.5 py-1.5 rounded-xl border text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${isIsolatedCaptainScope ? 'bg-sky-600 text-white border-sky-700 shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'}">
            <i data-lucide="shield" class="w-3.5 h-3.5"></i>
            <span>إدارة الكابتن (قيادته فقط 🛡️)</span>
          </button>
        </div>
      </div>

      <!-- 2. BREADCRUMBS & INTERACTIVE CUMULATIVE PATHWAY -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center flex-wrap gap-2 text-xs font-black">
          ${!isIsolatedCaptainScope ? `
            <button 
              type="button" 
              onclick="window.resetHierarchyToManagers()" 
              class="px-3 py-1.5 rounded-xl ${!activeMgr ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'} border border-slate-300 transition flex items-center gap-1.5 cursor-pointer shadow-xs">
              <i data-lucide="crown" class="w-3.5 h-3.5 text-amber-700"></i>
              <span>🏛️ مدراء الوكالات</span>
            </button>
            <i data-lucide="chevron-left" class="w-4 h-4 text-slate-400"></i>
          ` : ''}

          <button 
            type="button" 
            onclick="window.enterManagerAccount('${activeMgr.id}')" 
            class="px-3 py-1.5 rounded-xl ${!activeDel && !activeAg ? 'bg-amber-500 text-slate-950 font-black' : 'bg-amber-50 text-amber-950 hover:bg-amber-100'} border border-amber-300 transition flex items-center gap-1.5 cursor-pointer shadow-xs">
            <i data-lucide="user-check" class="w-3.5 h-3.5 text-amber-700"></i>
            <span>${activeMgr.name.split('(')[0].trim()} (${activeMgr.profitSharePercent}%)</span>
          </button>

          ${activeDel ? `
            <i data-lucide="chevron-left" class="w-4 h-4 text-slate-400"></i>
            <button 
              type="button" 
              onclick="window.enterDelegateAccount('${activeDel.id}')" 
              class="px-3 py-1.5 rounded-xl ${activeDel && !activeAg ? 'bg-sky-500 text-white font-black' : 'bg-sky-50 text-sky-950 hover:bg-sky-100'} border border-sky-300 transition flex items-center gap-1.5 cursor-pointer shadow-xs">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-sky-600"></i>
              <span>🌟 المندوب: ${activeDel.name.split('(')[0].trim()} (${activeDel.commissionRate}%)</span>
            </button>
          ` : ''}

          ${activeAg ? `
            <i data-lucide="chevron-left" class="w-4 h-4 text-slate-400"></i>
            <button 
              type="button" 
              onclick="window.enterAgencyAccount('${activeAg.id}')" 
              class="px-3 py-1.5 rounded-xl ${activeAg && !activeBrk ? 'bg-emerald-600 text-white font-black' : 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100'} border border-emerald-300 transition flex items-center gap-1.5 cursor-pointer shadow-xs">
              <i data-lucide="building" class="w-3.5 h-3.5 text-emerald-700"></i>
              <span>🏢 الوكالة: ${activeAg.owner.split('(')[0].trim()} (${activeAg.commission}%)</span>
            </button>
          ` : ''}

          ${activeBrk ? `
            <i data-lucide="chevron-left" class="w-4 h-4 text-slate-400"></i>
            <button 
              type="button" 
              onclick="window.enterBrokerAccount('${activeBrk.id}')" 
              class="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-black border border-purple-300 transition flex items-center gap-1.5 cursor-pointer shadow-xs">
              <i data-lucide="users" class="w-3.5 h-3.5 text-purple-200"></i>
              <span>🤝 الوسيط: ${activeBrk.name} (${activeBrk.commissionRate}%)</span>
            </button>
          ` : ''}
        </div>

        <div class="flex items-center gap-2">
          <button 
            type="button" 
            onclick="switchTab('agencies')" 
            class="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="table" class="w-3.5 h-3.5 text-slate-700"></i>
            <span>الجدول العام</span>
          </button>
          ${!isIsolatedCaptainScope ? `
            <button 
              type="button" 
              onclick="window.resetHierarchyToManagers()" 
              title="إعادة ضبط والعودة لقمة الهرم"
              class="px-3 py-1.5 rounded-xl bg-slate-950 text-amber-400 hover:bg-slate-800 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
              <span>إعادة ضبط</span>
            </button>
          ` : ''}
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- LEVEL 1: مدراء الوكالات (يتم عرض الإداري فقط إذا كان في وضع العزل) -->
      <!-- ================================================================= -->
      ${!isIsolatedCaptainScope ? `
        <div id="hierarchy-level-1-managers" class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-xs space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-200 pb-2.5">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-black">
                <i data-lucide="crown" class="w-4 h-4"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-black text-slate-950">المستوى الأول: مدراء ورؤساء الوكالات المعتمدون</h3>
                  <span class="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs">${agencyManagers.length} مدراء</span>
                </div>
                <p class="text-[11px] text-slate-600 font-bold">بجانب كل مدير إجمالي المندوبين والوكالات التابعة له. اضغط على أي مدير لتحديده.</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black inline-flex items-center gap-1.5">
                <i data-lucide="check-circle" class="w-3.5 h-3.5 text-amber-600"></i>
                <span>قيد العرض: ${activeMgr.name.split('(')[0]}</span>
              </span>
            </div>
          </div>

          <!-- MANAGERS HORIZONTAL WATER-RULED TABLE -->
          <div class="overflow-x-auto rounded-xl border-2 border-slate-300 bg-white">
            <table class="w-full text-right text-xs whitespace-nowrap">
              <thead class="bg-slate-100 text-slate-950 font-black border-b-2 border-slate-400">
                <tr>
                  <th class="py-3 px-3 text-center w-12 border-l border-slate-200/80">#</th>
                  <th class="py-3 px-4 border-l border-slate-200/80">المدير العام والبيانات</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200/80 bg-amber-50/50">كود الإداري</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200/80">نسبة الأرباح %</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200/80 bg-sky-50/50">المندوبين</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200/80 bg-emerald-50/50">الوكالات التابعة</th>
                  <th class="py-3 px-4 text-center border-l border-slate-200/80">تسكير الوكالات</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200/80">الحالة</th>
                  <th class="py-3 px-4 text-center">الإجراءات والصلاحيات (⋮)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-300">
                ${visibleManagers.map((mgr, idx) => {
                  const isSelected = activeMgr && activeMgr.id === mgr.id;
                  const rowBg = isSelected ? 'bg-amber-100/70 font-bold' : (idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-[#edf6f9]');
                  const mgrStatus = window.calculateManagerDelegateStatus(mgr);
                  const mgrClosingMillions = Math.floor(window.getManagerTotalClosingCoins(mgr.id) / 1000000);
                  return `
                    <tr class="${rowBg} hover:bg-[#dff0f5] transition">
                      <td class="py-3 px-3 text-center font-bold text-slate-500 border-l border-slate-200/80">${idx + 1}</td>
                      <td class="py-3 px-4 border-l border-slate-200/80 cursor-pointer group" onclick="window.enterManagerAccount('${mgr.id}')">
                        <div class="flex items-center gap-3">
                          <img src="${mgr.avatar}" class="w-9 h-9 rounded-xl object-cover border-2 border-amber-400 shadow-2xs shrink-0" alt="${mgr.name}" />
                          <div>
                            <div class="font-black text-slate-950 text-xs sm:text-sm flex items-center gap-1.5">
                              <span class="group-hover:text-amber-700 transition">${mgr.name}</span>
                              ${mgr.id === 'MGR-9901' ? '<span class="px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 text-[10px] font-black">رأس الهرم 🔱</span>' : ''}
                            </div>
                            <div class="text-[11px] text-slate-600 font-bold flex items-center gap-2 mt-0.5">
                              <span class="text-amber-800">${mgr.roleTitle}</span>
                              <span>•</span>
                              <span>${mgr.country}</span>
                              <span>•</span>
                              <span class="font-mono text-slate-700">${mgr.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="py-3 px-3 text-center font-mono font-black text-slate-900 border-l border-slate-200/80 bg-amber-50/30">
                        <span class="px-2 py-0.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-950 font-bold">${mgr.id}</span>
                      </td>
                      <td class="py-3 px-3 text-center border-l border-slate-200/80">
                        <div class="inline-flex items-center gap-1">
                          <span class="px-2.5 py-0.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-950 font-black text-xs">
                            ${mgr.profitSharePercent}%
                          </span>
                          <button 
                            type="button" 
                            onclick="event.stopPropagation(); window.editManagerProfitShare('${mgr.id}')" 
                            title="تعديل نسبة الأرباح"
                            class="text-slate-600 hover:text-slate-950 p-1 hover:bg-white rounded cursor-pointer">
                            <i data-lucide="edit-3" class="w-3 h-3"></i>
                          </button>
                        </div>
                      </td>
                      <td class="py-3 px-3 text-center border-l border-slate-200/80 bg-sky-50/30">
                        <span class="px-2.5 py-0.5 rounded-xl bg-sky-100 border border-sky-300 text-sky-950 font-black text-xs inline-flex items-center gap-1 shadow-2xs">
                          <i data-lucide="users" class="w-3 h-3 text-sky-700"></i>
                          <span>${mgr.delegatesCount} / ${mgrStatus.effectiveQuota}</span>
                        </span>
                      </td>
                      <td class="py-3 px-3 text-center border-l border-slate-200/80 bg-emerald-50/30">
                        <span class="px-2.5 py-0.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-black text-xs inline-flex items-center gap-1 shadow-2xs">
                          <i data-lucide="building" class="w-3 h-3 text-emerald-700"></i>
                          <span>${mgr.totalAgencies} وكالة</span>
                        </span>
                      </td>
                      <td class="py-3 px-4 text-center border-l border-slate-200/80 font-mono font-black text-amber-700">
                        🪙 ${mgrClosingMillions}M كوينز
                      </td>
                      <td class="py-3 px-3 text-center border-l border-slate-200/80">
                        <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-bold text-[11px] border border-emerald-300">معتمد</span>
                      </td>
                      <td class="py-3 px-4 text-center">
                        <div class="inline-flex items-center gap-1.5 justify-center">
                          <button 
                            type="button" 
                            onclick="event.stopPropagation(); window.openManagerPermissionsModal('${mgr.id}')" 
                            class="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer shadow-xs transition active:scale-95 border border-amber-300 group"
                            title="منح الصلاحيات الإدارية وتحديد كوتا التسكير الآلي (الثلاث نقط ⋮)">
                            <i data-lucide="more-vertical" class="w-3.5 h-3.5 stroke-[3] group-hover:rotate-90 transition-transform"></i>
                            <span>منح الصلاحيات (⋮)</span>
                          </button>
                          <button 
                            type="button" 
                            onclick="event.stopPropagation(); window.showManagerAgencies('${mgr.id}')" 
                            class="py-1.5 px-3 rounded-xl bg-slate-900 text-amber-400 hover:bg-slate-800 font-black text-xs flex items-center gap-1 cursor-pointer shadow-xs transition">
                            <i data-lucide="maximize-2" class="w-3 h-3"></i>
                            <span>عرض الوكالات</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- ================================================================= -->
      <!-- ACTIVE MANAGER DETAILS: كارت الإدارة خفيف جداً وموجز ومطوي -->
      <!-- ================================================================= -->
      ${activeMgr ? `
        <div id="hierarchy-manager-details" class="bg-white rounded-2xl border-2 border-slate-300 p-3.5 sm:p-4 shadow-xs space-y-3">
          
          <!-- Lightweight Header (سريع وخفيف جداً ولا يستهلك مساحة) -->
          <div class="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-200 pb-3">
            <div class="flex items-center gap-3">
              <img src="${activeMgr.avatar}" class="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shadow-2xs shrink-0" alt="${activeMgr.name}" />
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-base font-black text-slate-950">${activeMgr.name}</h3>
                  <span class="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-950 font-mono font-black text-xs">${activeMgr.id}</span>
                  <span class="px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs">${activeMgr.roleTitle}</span>
                  <span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-950 font-black text-xs">أرباح الإدارة: ${activeMgr.profitSharePercent}%</span>
                </div>
                
                <!-- سطر أفقي مدمج للمؤشرات التراكمية -->
                <div class="flex items-center gap-2 text-xs font-bold text-slate-600 mt-1 flex-wrap">
                  <span class="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">🏢 ${managerAgencies.length} وكالات</span>
                  <span class="px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-900">👥 ${managerDelegates.length} / ${delStatus.effectiveQuota} مندوبين ${delStatus.isAuto ? '⚡ آلي' : ''}</span>
                  <span class="px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-900">🎙️ ${totalHostsCount} مضيف</span>
                  <span class="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900">🪙 ${totalMgrClosingMillions}M تسكير</span>
                  <span class="text-slate-400">•</span>
                  <span class="text-slate-500 font-mono text-[11px]">${activeMgr.phone}</span>
                </div>
              </div>
            </div>

            <!-- أزرار الطي والتحكم السريع -->
            <div class="flex items-center gap-2 flex-wrap">
              
              <!-- زر طي/إظهار الصلاحيات المفوضة -->
              <button 
                type="button" 
                onclick="window.toggleManagerCardSection('permissions', '${activeMgr.id}')" 
                class="px-3 py-1.5 rounded-xl border text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${window._managerCardState.showPermissions ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'}"
                title="عرض/طي الصلاحيات المفوضة من أبو أمجد">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 ${window._managerCardState.showPermissions ? 'text-slate-950' : 'text-amber-700'}"></i>
                <span>الصلاحيات المفوضة (⋮)</span>
                <i data-lucide="${window._managerCardState.showPermissions ? 'chevron-up' : 'chevron-down'}" class="w-3.5 h-3.5"></i>
              </button>

              <!-- زر طي/إظهار الإحصائيات -->
              <button 
                type="button" 
                onclick="window.toggleManagerCardSection('stats', '${activeMgr.id}')" 
                class="px-3 py-1.5 rounded-xl border text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${window._managerCardState.showStats ? 'bg-sky-600 text-white border-sky-700 shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'}"
                title="عرض/طي الإحصائيات التفصيلية">
                <i data-lucide="bar-chart-2" class="w-3.5 h-3.5 ${window._managerCardState.showStats ? 'text-white' : 'text-sky-700'}"></i>
                <span>الإحصائيات التفصيلية</span>
                <i data-lucide="${window._managerCardState.showStats ? 'chevron-up' : 'chevron-down'}" class="w-3.5 h-3.5"></i>
              </button>

              <!-- زر الثلاث نقط لمنح الصلاحيات والكوتا -->
              <button 
                type="button" 
                onclick="window.openManagerPermissionsModal('${activeMgr.id}')" 
                class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm border border-amber-300 active:scale-95 group"
                title="منح وتفويض الصلاحيات الإدارية وتحديد كوتا التسكير الآلي (الثلاث نقط ⋮)">
                <i data-lucide="more-vertical" class="w-3.5 h-3.5 stroke-[3] group-hover:rotate-90 transition-transform"></i>
                <span>منح الصلاحيات (⋮)</span>
              </button>

              <!-- فتح ملء الشاشة -->
              <button 
                type="button" 
                onclick="window.openManagerAgenciesFullscreen('${activeMgr.id}')" 
                class="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs border border-amber-400/40">
                <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
                <span>🖥️ ملء الشاشة</span>
              </button>

              <!-- تبديل العرض بين الوكالات والمندوبين -->
              <div class="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-300">
                <button 
                  type="button" 
                  onclick="window.setManagerSubTab('agencies')" 
                  class="px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${activeManagerSubTab === 'agencies' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-800 hover:bg-white'}">
                  <i data-lucide="building" class="w-3.5 h-3.5"></i>
                  <span>الوكالات (${managerAgencies.length})</span>
                </button>
                <button 
                  type="button" 
                  onclick="window.setManagerSubTab('delegates')" 
                  class="px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${activeManagerSubTab === 'delegates' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-800 hover:bg-white'}">
                  <i data-lucide="users" class="w-3.5 h-3.5"></i>
                  <span>المندوبين والوسطاء (${managerDelegates.length})</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 1. قسم الصلاحيات المفوضة (منطوي افتراضياً لتخفيف الواجهة) -->
          ${window._managerCardState.showPermissions ? `
            <div class="p-3 rounded-xl bg-[#f7fbfd] border-2 border-amber-300 flex flex-wrap items-center justify-between gap-2 text-xs shadow-xs animate-fade-in">
              <div class="flex items-center gap-2 font-black text-slate-950">
                <div class="w-6 h-6 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center">
                  <i data-lucide="shield-check" class="w-3.5 h-3.5 text-amber-700"></i>
                </div>
                <span>صلاحيات ${activeMgr.name} المفوضة من أبو أمجد (رأس الهرم):</span>
              </div>
              <div class="flex flex-wrap items-center gap-1.5 font-bold text-[11px]">
                <span class="px-2.5 py-1 rounded-lg ${activeMgr.permissions?.canAssignDelegates !== false ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-slate-100 text-slate-400'}">
                  👥 المندوبين (كوتا: ${managerDelegates.length} / ${delStatus.effectiveQuota}) ${delStatus.isAuto ? '⚡ آلي' : ''}
                </span>
                <span class="px-2.5 py-1 rounded-lg ${activeMgr.permissions?.canApproveAgencies !== false ? 'bg-blue-100 text-blue-950 border border-blue-300' : 'bg-slate-100 text-slate-400'}">
                  ✅ اعتماد الوكالات
                </span>
                <span class="px-2.5 py-1 rounded-lg ${activeMgr.permissions?.canTransferHosts ? 'bg-purple-100 text-purple-950 border border-purple-300' : 'bg-slate-100 text-slate-400'}">
                  🔄 نقل المضيفين
                </span>
                <span class="px-2.5 py-1 rounded-lg ${activeMgr.permissions?.canUnbanAccounts ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-slate-100 text-slate-400 line-through'}">
                  🔓 فك الحظر
                </span>
                <span class="px-2.5 py-1 rounded-lg ${activeMgr.permissions?.canTransferBrokerHosts ? 'bg-teal-100 text-teal-950 border border-teal-300' : 'bg-slate-100 text-slate-400'}">
                  🔀 نقل حسابات الوسطاء
                </span>
                <span class="px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 font-mono text-[10px] flex items-center gap-1 border border-slate-700 shadow-2xs" title="الشحن مقفل تماماً ومحصور فقط برأس الهرم والداشبورد المالي">
                  <i data-lucide="lock" class="w-3 h-3 text-amber-400"></i>
                  <span>الشحن مقفل 🔒</span>
                </span>
                <button 
                  type="button" 
                  onclick="window.openManagerPermissionsModal('${activeMgr.id}')" 
                  class="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] flex items-center gap-1 transition cursor-pointer">
                  <i data-lucide="more-vertical" class="w-3 h-3"></i>
                  <span>تعديل الصلاحيات</span>
                </button>
                <button 
                  type="button" 
                  onclick="window.toggleManagerCardSection('permissions', '${activeMgr.id}')" 
                  class="text-slate-500 hover:text-slate-800 text-[11px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-slate-200 cursor-pointer">
                  <i data-lucide="chevron-up" class="w-3 h-3"></i>
                  <span>طي</span>
                </button>
              </div>
            </div>
          ` : ''}

          <!-- 2. قسم الإحصائيات التفصيلية (منطوي افتراضياً لتخفيف الواجهة) -->
          ${window._managerCardState.showStats ? `
            <div class="space-y-1.5 animate-fade-in">
              <div class="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                <span class="flex items-center gap-1 text-slate-900 font-black">
                  <i data-lucide="bar-chart-2" class="w-3.5 h-3.5 text-sky-600"></i>
                  <span>الإحصائيات التفصيلية وأداء تسكير الوكالات:</span>
                </span>
                <button 
                  type="button" 
                  onclick="window.toggleManagerCardSection('stats', '${activeMgr.id}')" 
                  class="text-slate-500 hover:text-slate-800 text-[11px] font-bold flex items-center gap-0.5 px-2 py-0.5 rounded hover:bg-slate-200 cursor-pointer">
                  <i data-lucide="chevron-up" class="w-3 h-3"></i>
                  <span>طي الإحصائيات</span>
                </button>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-[#f7fbfd] p-3 rounded-xl border-2 border-slate-200 shadow-xs text-center">
                <div class="px-2 py-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span class="text-[10px] font-bold text-slate-500 block">إجمالي الوكالات</span>
                  <span class="font-mono font-black text-slate-950 text-sm flex items-center justify-center gap-1 mt-0.5">
                    <i data-lucide="building" class="w-3.5 h-3.5 text-emerald-600"></i>
                    <span>${managerAgencies.length} وكالة</span>
                  </span>
                </div>
                <div class="px-2 py-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span class="text-[10px] font-bold text-slate-500 block">المندوبين المعتمدين</span>
                  <span class="font-mono font-black text-sky-800 text-sm flex items-center justify-center gap-1 mt-0.5">
                    <i data-lucide="users" class="w-3.5 h-3.5 text-sky-600"></i>
                    <span>${managerDelegates.length} / ${delStatus.effectiveQuota}</span>
                  </span>
                </div>
                <div class="px-2 py-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span class="text-[10px] font-bold text-slate-500 block">إجمالي المضيفين</span>
                  <span class="font-mono font-black text-purple-900 text-sm flex items-center justify-center gap-1 mt-0.5">
                    <i data-lucide="radio" class="w-3.5 h-3.5 text-purple-600"></i>
                    <span>${totalHostsCount} مضيف</span>
                  </span>
                </div>
                <div class="px-2 py-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span class="text-[10px] font-bold text-slate-500 block">ساعات البث</span>
                  <span class="font-mono font-black text-indigo-900 text-sm flex items-center justify-center gap-1 mt-0.5">
                    <i data-lucide="clock" class="w-3.5 h-3.5 text-indigo-600"></i>
                    <span>${totalHoursCount.toLocaleString()}h</span>
                  </span>
                </div>
                <div class="px-2 py-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span class="text-[10px] font-bold text-slate-500 block">إيرادات التسكير</span>
                  <span class="font-mono font-black text-amber-700 text-sm flex items-center justify-center gap-1 mt-0.5">
                    <span>🪙 ${totalMgrClosingMillions}M</span>
                  </span>
                </div>
                <div class="px-2 py-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span class="text-[10px] font-bold text-slate-500 block">أرباح المدير (${activeMgr.profitSharePercent}%)</span>
                  <span class="font-mono font-black text-emerald-700 text-sm flex items-center justify-center gap-1 mt-0.5">
                    <span>🪙 ${(mgrProfitCoins / 1000000).toFixed(2)}M</span>
                  </span>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- =============================================================== -->
          <!-- STEP 2: عرض تفاصيل الإداري والوكالات التابعة له بالكامل -->
          <!-- =============================================================== -->
          ${activeManagerSubTab === 'agencies' ? `
            <div class="space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 class="text-sm font-black text-slate-950 flex items-center gap-2">
                    <span>قائمة الوكالات التابعة لإدارة (${activeMgr.name})</span>
                    <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-300">${managerAgencies.length} وكالات تابعة</span>
                  </h4>
                  <p class="text-[11px] text-slate-600 font-bold mt-0.5">
                    انقر على زر "📊 القائمة التراكمية وبيانات الوكالة" لعرض إحصائيات اليوم والشهر والمؤشرات وقائمة المضيفين بالكامل.
                  </p>
                </div>
              </div>

              <!-- WATER-RULED AGENCIES TABLE (All columns requested in Step 2) -->
              <div class="overflow-x-auto rounded-xl border-2 border-slate-300 shadow-xs">
                <table class="w-full text-right text-xs whitespace-nowrap">
                  <thead class="bg-slate-100 text-slate-950 font-black border-b-2 border-slate-300">
                    <tr>
                      <th class="py-3 px-3 text-center w-12 border-l border-slate-200">#</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200">رمز الوكالة</th>
                      <th class="py-3 px-3 border-l border-slate-200">اسم الوكالة الرسمية</th>
                      <th class="py-3 px-3 border-l border-slate-200 bg-amber-50/50">الوكيل الرسمي (المالك)</th>
                      <th class="py-3 px-3 border-l border-slate-200 bg-sky-50/50">المندوب المستقطب للوكالة</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200">نسبة عمولة الوكالة %</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200 bg-purple-50/50">كم وسيط لديه</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200">كم مضيف لديه</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200">ساعات البث</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200">رصيد الكوينز والتارجت</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200">الحالة</th>
                      <th class="py-3 px-3 text-center">الإجراءات والبيانات التراكمية</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-300">
                    ${managerAgencies.length === 0 ? `
                      <tr>
                        <td colspan="12" class="py-8 text-center text-slate-500 font-bold">لا توجد وكالات مسجلة لهذا الإداري حتى الآن.</td>
                      </tr>
                    ` : managerAgencies.map((ag, idx) => {
                      const isAgActive = activeAg && activeAg.id === ag.id;
                      const rowBg = isAgActive ? 'bg-emerald-100/60 font-bold' : (idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-[#edf6f9]');
                      return `
                        <tr class="${rowBg} hover:bg-[#dff0f5] transition">
                          <td class="py-3 px-3 text-center font-bold text-slate-500 border-l border-slate-200">${idx + 1}</td>
                          <td class="py-3 px-3 text-center font-mono font-black text-slate-950 border-l border-slate-200">${ag.id}</td>
                          <td class="py-3 px-3 font-black text-slate-950 border-l border-slate-200">
                            <div class="flex items-center gap-2">
                              <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs shrink-0">
                                <i data-lucide="building" class="w-3.5 h-3.5"></i>
                              </span>
                              <span>${ag.name}</span>
                            </div>
                          </td>
                          <td class="py-3 px-3 border-l border-slate-200">
                            <div class="font-black text-slate-950">${ag.owner}</div>
                            <div class="text-[10px] font-mono text-slate-600">ID: #${ag.ownerPrimaryId || ag.ownerId || '1001010'}</div>
                          </td>
                          <td class="py-3 px-3 border-l border-slate-200 bg-sky-50/30">
                            <span class="px-2 py-0.5 rounded-md bg-sky-100 border border-sky-300 text-sky-950 font-bold text-[11px] inline-flex items-center gap-1">
                              <i data-lucide="sparkles" class="w-3 h-3 text-sky-600"></i>
                              <span>${ag.invitedBy || 'المندوب المعتمد'}</span>
                            </span>
                          </td>
                          <td class="py-3 px-3 text-center border-l border-slate-200">
                            <div class="inline-flex items-center gap-1">
                              <span class="px-2.5 py-1 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-950 font-black text-xs">
                                ${ag.commission}%
                              </span>
                              <button 
                                type="button" 
                                onclick="window.editAgencyCommission('${ag.id}')" 
                                title="تعديل نسبة الوكالة"
                                class="text-slate-600 hover:text-slate-950 p-1 hover:bg-white rounded cursor-pointer">
                                <i data-lucide="edit-3" class="w-3 h-3"></i>
                              </button>
                            </div>
                          </td>
                          <td class="py-3 px-3 text-center border-l border-slate-200">
                            <span class="px-2.5 py-0.5 rounded-xl bg-purple-100 border border-purple-300 text-purple-950 font-black text-xs inline-flex items-center gap-1 shadow-xs">
                              <i data-lucide="users" class="w-3.5 h-3.5 text-purple-700"></i>
                              <span>${ag.brokersCount || agencyBrokers.filter(b => b.agencyId === ag.id).length} وسطاء</span>
                            </span>
                          </td>
                          <td class="py-3 px-3 text-center font-mono font-black text-slate-900 border-l border-slate-200">
                            ${ag.hosts} مضيف
                          </td>
                          <td class="py-3 px-3 text-center font-mono font-bold text-slate-700 border-l border-slate-200">
                            ${ag.hours}h
                          </td>
                          <td class="py-3 px-3 text-center border-l border-slate-200">
                            <div class="font-mono font-black text-amber-700">${Number(ag.coins || 0).toLocaleString()} 🪙</div>
                            <div class="text-[10px] font-mono text-slate-500">تارجت: ${Number(ag.target || 0).toLocaleString()}</div>
                          </td>
                          <td class="py-3 px-3 text-center border-l border-slate-200">
                            <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-bold text-[11px] border border-emerald-300">${ag.status}</span>
                          </td>
                          <td class="py-3 px-3 text-center">
                            <div class="inline-flex items-center gap-1.5 flex-wrap justify-center">
                              <!-- Requested Primary Button: القائمة التراكمية وبيانات الوكالة -->
                              <button 
                                type="button" 
                                onclick="window.openAgencyCumulativeModal('${ag.id}')" 
                                title="عرض الإحصائيات التراكمية وقائمة المضيفين"
                                class="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-black text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-xs transition hover:scale-102">
                                <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i>
                                <span>📊 القائمة التراكمية وبيانات الوكالة</span>
                              </button>

                              <!-- Drill-down Button: تفاصيل الوسطاء والمضيفين -->
                              <button 
                                type="button" 
                                onclick="window.enterAgencyAccount('${ag.id}')" 
                                title="الدخول لهرم الوسطاء والمضيفين"
                                class="px-3 py-1.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-black text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-xs transition hover:scale-102">
                                <i data-lucide="key" class="w-3.5 h-3.5 text-amber-400"></i>
                                <span>🔑 تفاصيل الوسطاء والمضيفين</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          <!-- =============================================================== -->
          <!-- STEP 3: عرض المندوبين والوسطاء التابعين له -->
          <!-- =============================================================== -->
          ${activeManagerSubTab === 'delegates' ? `
            <div class="space-y-5">
              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <h4 class="text-sm font-black text-slate-950 flex items-center gap-2">
                    <i data-lucide="users" class="w-4 h-4 text-sky-700"></i>
                    <span>المندوبون المعتمدون تحت إشراف (${activeMgr.name})</span>
                    <span class="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-950 font-black text-xs border border-sky-300">${managerDelegates.length} مندوبين</span>
                  </h4>
                  <p class="text-[11px] text-slate-600 font-bold mt-0.5">
                    المندوب عمله استقطاب الوكلاء بنسبة يعطيه مدير الوكالات إياها. وتحت كل مندوب تفاصيل الوكالات التي قام بجلبها والمضيفين التابعين.
                  </p>
                </div>
                <button 
                  type="button" 
                  onclick="window.openAddDelegateModal('${activeMgr.id}')" 
                  class="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-600 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs">
                  <i data-lucide="plus" class="w-4 h-4"></i>
                  <span>+ تعيين مندوب جديد للمدير</span>
                </button>
              </div>

              <!-- FULL RULED DELEGATES TABLE (قائمة كاملة مسطرة بالمندوبين وأسمائهم كامل) -->
              <div class="overflow-x-auto rounded-xl border-2 border-slate-300 shadow-xs">
                <table class="w-full text-right text-xs whitespace-nowrap">
                  <thead class="bg-slate-100 text-slate-950 font-black border-b-2 border-slate-300">
                    <tr>
                      <th class="py-3 px-3 text-center w-12 border-l border-slate-200">#</th>
                      <th class="py-3 px-3 border-l border-slate-200">اسم المندوب المعتمد</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200">رمز المندوب</th>
                      <th class="py-3 px-3 border-l border-slate-200">رقم الهاتف / التواصل</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200">الدولة / المدينة</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200 bg-amber-50/60">نسبة المندوب %</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200 bg-sky-50/60">الوكالات المستقطبة</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200 bg-purple-50/60">المضيفون التابعون</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200">ساعات البث</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200">إجمالي إيراد كوينز</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200">الحالة</th>
                      <th class="py-3 px-3 text-center">الإجراءات والعمليات</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-300">
                    ${managerDelegates.length === 0 ? `
                      <tr>
                        <td colspan="12" class="py-8 text-center text-slate-500 font-bold">لا يوجد مندوبين مسجلين لهذا الإداري حتى الآن.</td>
                      </tr>
                    ` : managerDelegates.map((del, dIdx) => {
                      const delAgencies = agencies.filter(a => a.delegateId === del.id);
                      const totalDelHosts = delAgencies.reduce((acc, a) => acc + (a.hosts || 0), 0);
                      const totalDelHours = delAgencies.reduce((acc, a) => acc + (a.hours || 0), 0);
                      const totalDelCoins = delAgencies.reduce((acc, a) => acc + (a.coins || 0), 0);
                      const rowBg = dIdx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-[#edf6f9]';

                      return `
                        <tr class="${rowBg} hover:bg-[#dff0f5] transition">
                          <td class="py-3 px-3 text-center font-bold text-slate-500 border-l border-slate-200">${dIdx + 1}</td>
                          <td class="py-3 px-3 border-l border-slate-200 font-black text-slate-950">
                            <div class="flex items-center gap-2.5">
                              <img src="${del.avatar}" class="w-8 h-8 rounded-lg object-cover border border-slate-300 shadow-xs shrink-0" alt="${del.name}" />
                              <div>
                                <span class="block">${del.name}</span>
                                <span class="text-[10px] text-slate-500 font-bold block">معتمد من: ${activeMgr.name.split('(')[0]}</span>
                              </div>
                            </div>
                          </td>
                          <td class="py-3 px-3 text-center font-mono font-black text-slate-950 border-l border-slate-200">
                            <div class="inline-flex flex-col items-center">
                              <span class="font-mono font-black text-purple-950 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-300 text-xs shadow-xs">${del.id}</span>
                              <span class="text-[10px] font-mono text-slate-500 font-bold mt-0.5" title="المعرف الأساسي الثابت للمستخدم">#${del.primaryUserId || '1001004'}</span>
                            </div>
                          </td>
                          <td class="py-3 px-3 border-l border-slate-200 font-mono text-slate-800 font-bold">${del.phone}</td>
                          <td class="py-3 px-3 text-center border-l border-slate-200 font-bold text-slate-700">${del.city} - ${del.country}</td>
                          <td class="py-3 px-3 text-center border-l border-slate-200">
                            <div class="inline-flex items-center gap-1">
                              <span class="px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 text-amber-950 font-black text-xs font-mono">
                                ${del.commissionRate}%
                              </span>
                              <button 
                                type="button" 
                                onclick="window.editDelegateCommission('${del.id}')" 
                                title="تعديل نسبة المندوب"
                                class="text-slate-600 hover:text-slate-950 p-1 hover:bg-white rounded cursor-pointer">
                                <i data-lucide="edit-3" class="w-3 h-3"></i>
                              </button>
                            </div>
                          </td>
                          <td class="py-3 px-3 text-center border-l border-slate-200">
                            <span class="px-2.5 py-0.5 rounded-xl bg-sky-100 border border-sky-300 text-sky-950 font-black text-xs inline-flex items-center gap-1 shadow-xs">
                              <i data-lucide="building" class="w-3.5 h-3.5 text-sky-700"></i>
                              <span>${delAgencies.length} وكالات</span>
                            </span>
                          </td>
                          <td class="py-3 px-3 text-center border-l border-slate-200">
                            <span class="px-2.5 py-0.5 rounded-xl bg-purple-100 border border-purple-300 text-purple-950 font-black text-xs inline-flex items-center gap-1 shadow-xs">
                              <i data-lucide="users" class="w-3.5 h-3.5 text-purple-700"></i>
                              <span>${totalDelHosts} مضيف</span>
                            </span>
                          </td>
                          <td class="py-3 px-3 text-center font-mono font-bold text-slate-700 border-l border-slate-200">
                            ${totalDelHours}h
                          </td>
                          <td class="py-3 px-3 text-center border-l border-slate-200 font-mono font-black text-amber-700">
                            ${(totalDelCoins / 1000000).toFixed(1)}M 🪙
                          </td>
                          <td class="py-3 px-3 text-center border-l border-slate-200">
                            <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-bold text-[11px] border border-emerald-300">${del.status}</span>
                          </td>
                          <td class="py-3 px-3 text-center">
                            <div class="inline-flex items-center gap-1.5 justify-center">
                              <button 
                                type="button" 
                                onclick="window.openAddAgencyForDelegateModal('${del.id}')" 
                                class="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition cursor-pointer shadow-xs flex items-center gap-1">
                                <i data-lucide="plus" class="w-3 h-3"></i>
                                <span>+ وكالة</span>
                              </button>
                              <button 
                                type="button" 
                                onclick="window.enterDelegateAccount('${del.id}')" 
                                class="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition cursor-pointer shadow-xs flex items-center gap-1">
                                <i data-lucide="folder-open" class="w-3 h-3 text-sky-400"></i>
                                <span>تفاصيل</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>

              <!-- DELEGATES DRILLDOWN CARDS -->
              <div class="space-y-4">
                ${managerDelegates.map((del, dIdx) => {
                  const delAgencies = agencies.filter(a => a.delegateId === del.id);
                  const totalDelHosts = delAgencies.reduce((acc, a) => acc + (a.hosts || 0), 0);
                  const totalDelHours = delAgencies.reduce((acc, a) => acc + (a.hours || 0), 0);
                  const totalDelCoins = delAgencies.reduce((acc, a) => acc + (a.coins || 0), 0);

                  return `
                    <div class="rounded-2xl border-2 border-slate-300 bg-[#f7fbfd] p-4.5 space-y-4 shadow-xs">
                      <!-- Delegate Header -->
                      <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                        <div class="flex items-center gap-3">
                          <img src="${del.avatar}" class="w-11 h-11 rounded-xl object-cover border border-slate-300 shadow-xs" alt="${del.name}" />
                          <div>
                            <div class="flex items-center gap-2">
                              <span class="font-black text-slate-950 text-sm">${del.name}</span>
                              <span class="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-purple-100 border border-purple-300 text-purple-950">${del.id}</span>
                              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200 border border-slate-300 text-slate-800" title="المعرف الأساسي الثابت">هوية: #${del.primaryUserId || '1001004'}</span>
                              <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-bold text-[10px] border border-emerald-300">${del.status}</span>
                            </div>
                            <div class="text-[11px] text-slate-600 font-bold mt-0.5">
                              ${del.city} - ${del.country} • الجوال: <span class="font-mono">${del.phone}</span>
                            </div>
                          </div>
                        </div>

                        <!-- Delegate Commission & Actions -->
                        <div class="flex items-center gap-2 flex-wrap">
                          <div class="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-300">
                            <span class="text-xs text-amber-950 font-bold">نسبة المندوب من المدير:</span>
                            <span class="font-black text-xs text-amber-900 font-mono">${del.commissionRate}%</span>
                            <button 
                              type="button" 
                              onclick="window.editDelegateCommission('${del.id}')" 
                              title="تعديل نسبة المندوب"
                              class="text-amber-800 hover:text-amber-950 p-1 hover:bg-amber-100 rounded cursor-pointer">
                              <i data-lucide="edit-3" class="w-3 h-3"></i>
                            </button>
                          </div>

                          <button 
                            type="button" 
                            onclick="window.openAddAgencyForDelegateModal('${del.id}')" 
                            class="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-black text-xs flex items-center gap-1 transition cursor-pointer shadow-xs">
                            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                            <span>+ اعتماد وكالة للمندوب</span>
                          </button>
                        </div>
                      </div>

                      <!-- Delegate Summary Badges -->
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div class="bg-white p-2 rounded-xl border border-slate-200">
                          <div class="text-[10px] text-slate-500 font-bold">الوكالات المستقطبة</div>
                          <div class="font-black text-sky-900 font-mono text-sm">${delAgencies.length} وكالات</div>
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200">
                          <div class="text-[10px] text-slate-500 font-bold">المضيفون تحت إدارته</div>
                          <div class="font-black text-purple-900 font-mono text-sm">${totalDelHosts} مضيفين</div>
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200">
                          <div class="text-[10px] text-slate-500 font-bold">ساعات البث التراكمية</div>
                          <div class="font-black text-slate-900 font-mono text-sm">${totalDelHours}h</div>
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200">
                          <div class="text-[10px] text-slate-500 font-bold">إجمالي إيراد كوينز</div>
                          <div class="font-black text-amber-700 font-mono text-sm">${(totalDelCoins / 1000000).toFixed(1)}M 🪙</div>
                        </div>
                      </div>

                      <!-- DETAILS OF AGENCIES BROUGHT BY THIS DELEGATE -->
                      <div class="space-y-2">
                        <div class="flex items-center justify-between text-xs font-black text-slate-900">
                          <span class="flex items-center gap-1.5">
                            <i data-lucide="corner-down-left" class="w-3.5 h-3.5 text-sky-700"></i>
                            <span>تفاصيل الوكالات التي قام بجلبها هذا المندوب (${del.name.split('(')[0]}):</span>
                          </span>
                        </div>

                        ${delAgencies.length === 0 ? `
                          <div class="p-3 bg-white rounded-xl border border-slate-200 text-center text-slate-500 text-xs font-bold">
                            لم يقم هذا المندوب بجلب أي وكالة بعد. اضغط على زر "+ اعتماد وكالة للمندوب" لإضافة أول وكالة.
                          </div>
                        ` : `
                          <div class="overflow-x-auto rounded-xl border border-slate-300 bg-white">
                            <table class="w-full text-right text-xs whitespace-nowrap">
                              <thead class="bg-slate-100 text-slate-950 font-black border-b border-slate-300">
                                <tr>
                                  <th class="py-2.5 px-3 border-l border-slate-200">رمز الوكالة</th>
                                  <th class="py-2.5 px-3 border-l border-slate-200">اسم الوكالة الرسمية</th>
                                  <th class="py-2.5 px-3 border-l border-slate-200">الوكيل الرسمي</th>
                                  <th class="py-2.5 px-3 text-center border-l border-slate-200">نسبة الوكالة %</th>
                                  <th class="py-2.5 px-3 text-center border-l border-slate-200">الوسطاء والمضيفون</th>
                                  <th class="py-2.5 px-3 text-center border-l border-slate-200">إيرادات الكوينز</th>
                                  <th class="py-2.5 px-3 text-center">الإجراءات التراكمية</th>
                                </tr>
                              </thead>
                              <tbody class="divide-y divide-slate-200">
                                ${delAgencies.map((dag) => `
                                  <tr class="hover:bg-slate-50 transition">
                                    <td class="py-2.5 px-3 font-mono font-black text-slate-950 border-l border-slate-200">${dag.id}</td>
                                    <td class="py-2.5 px-3 font-black text-slate-950 border-l border-slate-200">${dag.name}</td>
                                    <td class="py-2.5 px-3 border-l border-slate-200">
                                      <div class="font-bold text-slate-950">${dag.owner}</div>
                                      <div class="text-[10px] font-mono text-slate-500">ID: #${dag.ownerPrimaryId || dag.ownerId}</div>
                                    </td>
                                    <td class="py-2.5 px-3 text-center border-l border-slate-200 font-black text-emerald-800">${dag.commission}%</td>
                                    <td class="py-2.5 px-3 text-center border-l border-slate-200">
                                      <span class="text-purple-900 font-bold">${dag.brokersCount} وسطاء</span> • <span class="text-slate-900 font-bold">${dag.hosts} مضيف</span>
                                    </td>
                                    <td class="py-2.5 px-3 text-center font-mono font-black text-amber-700 border-l border-slate-200">
                                      ${Number(dag.coins || 0).toLocaleString()} 🪙
                                    </td>
                                    <td class="py-2.5 px-3 text-center">
                                      <div class="inline-flex items-center gap-1.5">
                                        <button 
                                          type="button" 
                                          onclick="window.openAgencyCumulativeModal('${dag.id}')" 
                                          class="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 font-black text-[11px] cursor-pointer inline-flex items-center gap-1 shadow-xs">
                                          <i data-lucide="bar-chart-2" class="w-3 h-3"></i>
                                          <span>📊 القائمة التراكمية وبيانات الوكالة</span>
                                        </button>
                                        <button 
                                          type="button" 
                                          onclick="window.enterAgencyAccount('${dag.id}')" 
                                          class="px-2.5 py-1 rounded-lg bg-slate-950 text-white hover:bg-slate-800 font-black text-[11px] cursor-pointer inline-flex items-center gap-1 shadow-xs">
                                          <i data-lucide="key" class="w-3 h-3 text-amber-400"></i>
                                          <span>🔑 الوسطاء والمضيفين</span>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                `).join('')}
                              </tbody>
                            </table>
                          </div>
                        `}
                      </div>

                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

        </div>
      ` : ''}

      <!-- ================================================================= -->
      <!-- LEVEL 4: الوسطاء التابعين للوكيل الرسمي (AGENCY BROKERS) -->
      <!-- ================================================================= -->
      ${activeAg ? `
        <div id="hierarchy-level-4-brokers" class="relative bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] space-y-4">
          
          <!-- Visual Connector Header -->
          <div class="flex items-center gap-2 text-xs font-black text-emerald-900 bg-emerald-50 border border-emerald-300 rounded-xl px-3 py-2">
            <i data-lucide="corner-down-left" class="w-4 h-4"></i>
            <span>تفريعة تراكمية: الوسطاء المعتمدون في وكالة (${activeAg.name}) برئاسة الوكيل الرسمي (${activeAg.owner})</span>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-200 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 border border-purple-300 flex items-center justify-center font-black">
                <i data-lucide="users" class="w-5 h-5"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-black text-slate-950">المستوى الرابع: وسطاء الوكالة الرسمية (المرخصون من الوكيل الرسمي)</h3>
                  <span class="px-2 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-300 font-bold text-xs">${currentBrokers.length} وسطاء معتمدين</span>
                </div>
                <p class="text-[11px] text-slate-600 font-bold">
                  الوسيط يحصل على هذه الرخصة من الوكيل الرسمي بنسبة لاستقطاب وإدارة المضيفين.
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button 
                type="button" 
                onclick="window.openAddBrokerForHierarchyAgency('${activeAg.id}')" 
                class="px-3 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>+ إضافة وسيط جديد بنسبة</span>
              </button>
            </div>
          </div>

          <!-- BROKERS WATER-RULED TABLE -->
          <div class="overflow-x-auto rounded-xl border-2 border-slate-300 shadow-xs">
            <table class="w-full text-right text-xs whitespace-nowrap">
              <thead class="bg-slate-100 text-slate-950 font-black border-b-2 border-slate-300">
                <tr>
                  <th class="py-3 px-3 text-center w-12 border-l border-slate-200">#</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200">رمز الوسيط</th>
                  <th class="py-3 px-3 border-l border-slate-200">اسم الوسيط المعتمد</th>
                  <th class="py-3 px-3 border-l border-slate-200">الجوال وتاريخ الانضمام</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200 bg-amber-50/50">نسبة الوسيط % (من الوكيل الرسمي)</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200 bg-purple-50/50">عدد المضيفين تحت الوسيط</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200">إجمالي إيرادات المضيفين</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200">أرباح الوسيط المحققة</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200">الحالة</th>
                  <th class="py-3 px-3 text-center">إجراءات المضيفين والتعديل</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-300">
                ${currentBrokers.length === 0 ? `
                  <tr>
                    <td colspan="10" class="py-6 text-center text-slate-500 font-bold">لا يوجد وسطاء مسجلين في هذه الوكالة حتى الآن. انقر زر إضافة وسيط جديد أعلاه.</td>
                  </tr>
                ` : currentBrokers.map((brk, idx) => {
                  const isBrkActive = activeBrk && activeBrk.id === brk.id;
                  const rowBg = isBrkActive ? 'bg-purple-100/60 font-bold' : (idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-[#edf6f9]');
                  return `
                    <tr class="${rowBg} hover:bg-[#dff0f5] transition">
                      <td class="py-3 px-3 text-center font-bold text-slate-500 border-l border-slate-200">${idx + 1}</td>
                      <td class="py-3 px-3 text-center font-mono font-black text-slate-950 border-l border-slate-200">${brk.id}</td>
                      <td class="py-3 px-3 border-l border-slate-200">
                        <div class="flex items-center gap-2.5">
                          <img src="${brk.avatar}" class="w-8 h-8 rounded-xl object-cover border border-slate-300" alt="${brk.name}" />
                          <div>
                            <div class="font-black text-slate-950">${brk.name}</div>
                            <div class="text-[10px] font-mono text-slate-600">ID: #${brk.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td class="py-3 px-3 border-l border-slate-200">
                        <div class="text-slate-900 font-bold">${brk.phone}</div>
                        <div class="text-[10px] text-slate-500">${brk.joinDate}</div>
                      </td>
                      <td class="py-3 px-3 text-center border-l border-slate-200">
                        <div class="inline-flex items-center gap-1">
                          <span class="px-2.5 py-1 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-950 font-black text-xs">
                            ${brk.commissionRate}%
                          </span>
                          <button 
                            type="button" 
                            onclick="editBrokerRate('${brk.id}')" 
                            title="تعديل نسبة الوسيط"
                            class="text-slate-600 hover:text-slate-950 p-1 hover:bg-white rounded cursor-pointer">
                            <i data-lucide="edit-3" class="w-3 h-3"></i>
                          </button>
                        </div>
                      </td>
                      <td class="py-3 px-3 text-center border-l border-slate-200">
                        <span class="px-3 py-1 rounded-xl bg-purple-100 border border-purple-300 text-purple-950 font-black text-xs inline-flex items-center gap-1 shadow-xs">
                          <i data-lucide="mic" class="w-3.5 h-3.5 text-purple-700"></i>
                          <span>${brk.hostsCount} مضيفين</span>
                        </span>
                      </td>
                      <td class="py-3 px-3 text-center font-mono font-black text-slate-950 border-l border-slate-200">
                        ${Number(brk.totalRevenue || 0).toLocaleString()} 🪙
                      </td>
                      <td class="py-3 px-3 text-center font-mono font-black text-amber-700 border-l border-slate-200">
                        ${Number(brk.earnedCoins || 0).toLocaleString()} 🪙
                      </td>
                      <td class="py-3 px-3 text-center border-l border-slate-200">
                        <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-bold text-[11px] border border-emerald-300">${brk.status}</span>
                      </td>
                      <td class="py-3 px-3 text-center">
                        <div class="inline-flex items-center gap-1.5">
                          ${isBrkActive ? `
                            <button 
                              type="button" 
                              onclick="window.collapseHierarchyLevel('broker')" 
                              class="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-black text-xs cursor-pointer inline-flex items-center gap-1 shadow-xs">
                              <i data-lucide="chevron-up" class="w-3.5 h-3.5"></i>
                              <span>إخفاء المضيفين</span>
                            </button>
                          ` : `
                            <button 
                              type="button" 
                              onclick="window.enterBrokerAccount('${brk.id}')" 
                              class="px-3 py-1.5 rounded-xl bg-slate-950 text-amber-300 hover:bg-slate-800 font-black text-xs cursor-pointer inline-flex items-center gap-1 shadow-xs transition hover:scale-102">
                              <i data-lucide="mic" class="w-3.5 h-3.5 text-amber-400"></i>
                              <span>عرض مضيفي هذا الوسيط 👥</span>
                            </button>
                          `}
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- ================================================================= -->
      <!-- LEVEL 5: المضيفين التابعين للوسيط المحدد (HOSTS UNDER SELECTED BROKER) -->
      <!-- ================================================================= -->
      ${activeBrk ? `
        <div id="hierarchy-level-5-hosts" class="relative bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] space-y-4">
          
          <!-- Visual Connector Header -->
          <div class="flex items-center justify-between gap-2 text-xs font-black text-purple-900 bg-purple-50 border border-purple-300 rounded-xl px-3 py-2">
            <div class="flex items-center gap-2">
              <i data-lucide="corner-down-left" class="w-4 h-4"></i>
              <span>تفريعة تراكمية: المضيفون المسجلون تحت إدارة الوسيط (${activeBrk.name}) في وكالة (${activeAg.name})</span>
            </div>
            <button 
              type="button" 
              onclick="window.collapseHierarchyLevel('broker')" 
              class="px-2 py-0.5 rounded-lg bg-white border border-purple-300 text-purple-900 hover:bg-purple-100 transition cursor-pointer text-[11px] font-bold">
              إغلاق قائمة المضيفين ✖
            </button>
          </div>

          <div class="flex items-center justify-between border-b-2 border-slate-200 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 border border-purple-300 flex items-center justify-center font-black">
                <i data-lucide="mic" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="text-sm font-black text-slate-950">المستوى الخامس: صناع المحتوى والمضيفون التابعون للوسيط (${activeBrk.name})</h3>
                <p class="text-[11px] text-slate-600 font-bold">إدارة ساعات البث والتارجت وإيرادات كوينز المضيفين المسندين لهذا الوسيط</p>
              </div>
            </div>
            <button 
              type="button" 
              onclick="openAddHostModal('${activeAg.id}')" 
              class="px-3 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              <span>+ إضافة مضيف لهذا الوسيط</span>
            </button>
          </div>

          <!-- HOSTS TABLE -->
          <div class="overflow-x-auto rounded-xl border-2 border-slate-300 shadow-xs">
            <table class="w-full text-right text-xs whitespace-nowrap">
              <thead class="bg-slate-100 text-slate-950 font-black border-b-2 border-slate-300">
                <tr>
                  <th class="py-3 px-3 text-center w-12 border-l border-slate-200">#</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200">رمز المضيف</th>
                  <th class="py-3 px-3 border-l border-slate-200">اسم صانع المحتوى</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200">ساعات البث</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200">الدخل الشهري</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200">التارجت المستهدف</th>
                  <th class="py-3 px-3 text-center border-l border-slate-200">حالة البث</th>
                  <th class="py-3 px-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-300">
                ${currentHosts.length === 0 ? `
                  <tr>
                    <td colspan="8" class="py-6 text-center text-slate-500 font-bold">لا يوجد مضيفين مسجلين تحت هذا الوسيط حتى الآن. انقر زر إضافة مضيف أعلاه.</td>
                  </tr>
                ` : currentHosts.map((host, idx) => {
                  const pct = Math.min(100, Math.round(((host.monthlyRevenue || 0) / (host.monthlyTarget || 1)) * 100));
                  return `
                    <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-[#edf6f9]'} hover:bg-[#dff0f5] transition">
                      <td class="py-3 px-3 text-center font-bold text-slate-500 border-l border-slate-200">${idx + 1}</td>
                      <td class="py-3 px-3 text-center font-mono font-black text-slate-950 border-l border-slate-200">${host.id}</td>
                      <td class="py-3 px-3 border-l border-slate-200">
                        <div class="flex items-center gap-2.5">
                          <img src="${host.avatar}" class="w-8 h-8 rounded-xl object-cover border border-slate-300" alt="${host.name}" />
                          <div>
                            <div class="font-black text-slate-950">${host.name}</div>
                            <div class="text-[10px] font-mono text-slate-600">ID: #${host.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td class="py-3 px-3 text-center font-mono font-black text-slate-900 border-l border-slate-200">
                        ${host.hoursAchieved}h
                      </td>
                      <td class="py-3 px-3 text-center font-mono font-black text-amber-700 border-l border-slate-200">
                        ${Number(host.monthlyRevenue || 0).toLocaleString()} 🪙
                      </td>
                      <td class="py-3 px-3 border-l border-slate-200 min-w-[130px]">
                        <div class="space-y-1">
                          <div class="flex justify-between text-[11px] font-mono font-bold text-slate-950">
                            <span>${Number(host.monthlyTarget || 0).toLocaleString()}</span>
                            <span class="text-emerald-800">${pct}%</span>
                          </div>
                          <div class="w-full h-1.5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                            <div class="h-full bg-emerald-500 rounded-full" style="width: ${pct}%"></div>
                          </div>
                        </div>
                      </td>
                      <td class="py-3 px-3 text-center border-l border-slate-200">
                        <span class="px-2 py-0.5 rounded-md text-[11px] font-bold ${host.liveStatus && host.liveStatus.includes('مباشر') ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 animate-pulse' : 'bg-slate-100 text-slate-600 border border-slate-300'}">
                          ${host.liveStatus}
                        </span>
                      </td>
                      <td class="py-3 px-3 text-center">
                        <div class="inline-flex items-center gap-1.5">
                          <button 
                            type="button" 
                            onclick="editHostTarget('${host.id}')" 
                            title="تعديل التارجت"
                            class="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[11px] font-bold cursor-pointer">
                            تعديل التارجت
                          </button>
                          <button 
                            type="button" 
                            onclick="reassignHostBroker('${host.id}', '${activeAg.id}')" 
                            title="نقل إلى وسيط آخر"
                            class="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[11px] font-bold cursor-pointer">
                            نقل الوسيط
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  lucide.createIcons();
}

function editBrokerRate(brokerId) {
  const brk = agencyBrokers.find(b => b.id === brokerId);
  if (!brk) return;
  const newRate = prompt(`تعديل نسبة عمولة الوسيط (${brk.name}) الممنوحة من الوكيل الرسمي:`, String(brk.commissionRate));
  if (newRate !== null && !isNaN(newRate)) {
    brk.commissionRate = parseFloat(newRate);
    saveState();
    const container = document.getElementById('dynamicViewContainer');
    if (container) renderAgencyHierarchyView(container);
  }
}

// =========================================================================
// VIEW 5: RECHARGE AGENCIES (وكالات الشحن)
// =========================================================================
function renderRechargeAgenciesView(container) {
  if (typeof window.renderRechargeAgenciesViewMain === 'function') {
    window.renderRechargeAgenciesViewMain(container);
    return;
  }
  if (window.renderRechargeAgenciesView && window.renderRechargeAgenciesView !== renderRechargeAgenciesView) {
    window.renderRechargeAgenciesView(container);
    return;
  }
}

// =========================================================================
// VIEW 6: FRAMES & ROOM BACKGROUNDS (إطار ودخول وخلفيات)
// =========================================================================
function renderFramesView(container) {
  container.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div class="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 class="text-base font-black text-slate-950">إدارة الإطارات وتأثيرات الدخول (Frames & Entries)</h2>
          <p class="text-xs text-slate-700 font-bold">تخصيص إطارات الصورة الشخصية وسيارات وطائرات الدخول في الغرف الصوتية</p>
        </div>
        <button onclick="alert('فتح نموذج رفع إطار Lottie / WebP جديد!')" class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs">
          <i data-lucide="plus" class="w-4 h-4"></i>
          <span>رفع إطار / دخولية جديدة</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        ${framesEntries.map(f => `
          <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-3">
            <div class="text-4xl py-3 drop-shadow-xs">${f.preview}</div>
            <h3 class="font-black text-sm text-slate-950">${f.name}</h3>
            <span class="text-xs font-bold text-slate-700 block">${f.category}</span>
            <div class="font-mono font-black text-amber-800 text-sm">${Number(f.price).toLocaleString()} 🪙</div>
            <span class="text-[11px] text-slate-600 block font-bold">${f.validity} • تم شراء ${f.sales} مرة</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderRoomBgView(container) {
  renderFramesView(container);
}

// =========================================================================
// VIEW 6B: ROOM GIFTS CATALOG & DYNAMIC CATEGORIES CMS (صندوق هدايا الروم وإدارة الأقسام)
// =========================================================================
const ROOM_GIFTS_STORAGE_KEY = window.ROOM_GIFTS_STORAGE_KEY || 'super_legend_gifts_cms_v3';
const ROOM_GIFTS_CATEGORIES_STORAGE_KEY = window.ROOM_GIFTS_CATEGORIES_STORAGE_KEY || 'super_legend_gifts_categories_v3';

// الأقسام الحقيقية الرسمية المطابقة لمستودع تطبيق النجم (استرداد، رائج، الفعالية، الدولة/المنطقة، مخصصة، الامتيازات، مداعبة)
const DEFAULT_GIFT_CATEGORIES = window.OFFICIAL_GIFT_CATEGORIES || [
  { id: 'استرداد', name: 'استرداد', icon: '🔄', badge: 'استرداد', color: 'emerald', isSystem: true, order: 1 },
  { id: 'رائج', name: 'رائج', icon: '🔥', badge: 'رائج', color: 'rose', isSystem: true, order: 2 },
  { id: 'الفعالية', name: 'الفعالية', icon: '🎪', badge: 'فعالية', color: 'indigo', isSystem: true, order: 3 },
  { id: 'الدولة/المنطقة', name: 'الدولة/المنطقة', icon: '🌍', badge: 'إقليمي', color: 'sky', isSystem: true, order: 4 },
  { id: 'مخصصة', name: 'مخصصة', icon: '🎨', badge: 'خاص', color: 'teal', isSystem: true, order: 5 },
  { id: 'الامتيازات', name: 'الامتيازات', icon: '👑', badge: 'VIP', color: 'amber', isSystem: true, order: 6 },
  { id: 'مداعبة', name: 'مداعبة', icon: '🎭', badge: 'تسلية', color: 'purple', isSystem: true, order: 7 },
];

function getGiftCategories() {
  if (typeof window.getGiftCategories === 'function' && window.getGiftCategories !== getGiftCategories) {
    return window.getGiftCategories();
  }
  try {
    const raw = localStorage.getItem(ROOM_GIFTS_CATEGORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [...DEFAULT_GIFT_CATEGORIES];
}

function saveGiftCategories(catsList) {
  if (typeof window.saveGiftCategories === 'function' && window.saveGiftCategories !== saveGiftCategories) {
    return window.saveGiftCategories(catsList);
  }
  try {
    localStorage.setItem(ROOM_GIFTS_CATEGORIES_STORAGE_KEY, JSON.stringify(catsList));
    window.dispatchEvent(new CustomEvent('taraf_gift_categories_updated', { detail: catsList }));
  } catch (e) {}
}

const DEFAULT_ROOM_GIFTS_DATA = window.OFFICIAL_ROOM_GIFTS_DATA || [];

function getRoomGiftsCatalog() {
  if (typeof window.getRoomGiftsCatalog === 'function' && window.getRoomGiftsCatalog !== getRoomGiftsCatalog) {
    return window.getRoomGiftsCatalog();
  }
  try {
    const raw = localStorage.getItem(ROOM_GIFTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return window.OFFICIAL_ROOM_GIFTS_DATA && window.OFFICIAL_ROOM_GIFTS_DATA.length > 0 ? [...window.OFFICIAL_ROOM_GIFTS_DATA] : [...DEFAULT_ROOM_GIFTS_DATA];
}

function saveRoomGiftsCatalog(giftsList) {
  if (typeof window.saveRoomGiftsCatalog === 'function' && window.saveRoomGiftsCatalog !== saveRoomGiftsCatalog) {
    return window.saveRoomGiftsCatalog(giftsList);
  }
  try {
    localStorage.setItem(ROOM_GIFTS_STORAGE_KEY, JSON.stringify(giftsList));
    window.dispatchEvent(new CustomEvent('taraf_gifts_updated', { detail: giftsList }));
    if (window.top && window.top !== window) {
      window.top.postMessage({ type: 'GIFTS_UPDATED', gifts: giftsList }, '*');
    }
  } catch (e) {}
}

window._giftsCatalogFilter = window._giftsCatalogFilter || {
  search: '',
  category: 'all', // 'all' or category ID (refundable, trending, events, regional, custom, privileges, fun, with_video)
};

function renderGiftsCatalogView(container) {
  const allGifts = getRoomGiftsCatalog();
  const categories = getGiftCategories();
  const filter = window._giftsCatalogFilter;

  // Compute counts
  const totalCount = allGifts.length;
  const withVideoCount = allGifts.filter(g => g.animationUrl && g.animationUrl.trim() !== '').length;

  // Filtered list
  const filteredGifts = allGifts.filter(g => {
    if (filter.category !== 'all') {
      if (filter.category === 'with_video') {
        if (!g.animationUrl || g.animationUrl.trim() === '') return false;
      } else if (g.category !== filter.category) {
        return false;
      }
    }

    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      const matchName = g.name.toLowerCase().includes(q);
      const matchPrice = String(g.price).includes(q);
      const matchType = (g.animationType || '').toLowerCase().includes(q);
      if (!matchName && !matchPrice && !matchType) return false;
    }
    return true;
  });

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in text-slate-900 pb-16">
      
      <!-- 1. TOP HEADER & METRICS SUMMARY -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-200 pb-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 border-2 border-amber-300 flex items-center justify-center font-black text-2xl shadow-xs">
              🎁
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h2 class="text-base font-black text-slate-950">صندوق هدايا الروم والتحريك الملكي (Room Gifts & Categories CMS)</h2>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-300">مربوط بالروم المباشر ⚡</span>
              </div>
              <p class="text-xs text-slate-600 font-bold mt-1">
                تعديل وإضافة الهدايا فوراً، إدارة وتخصيص أقسام الهدايا (استرداد، رائج، الفعالية، الامتيازات...) ورفع الصور والفيديوهات للروم المباشر.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <button 
              type="button" 
              onclick="window.openManageCategoriesModal()" 
              class="px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-300 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition">
              <i data-lucide="layers" class="w-4 h-4 text-indigo-700"></i>
              <span>📁 إدارة وتعديل الأقسام</span>
            </button>

            <button 
              type="button" 
              onclick="window.openAddGiftModal()" 
              class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-xs transition hover:scale-102">
              <i data-lucide="plus" class="w-4 h-4"></i>
              <span>+ إضافة هدية جديدة للصندوق</span>
            </button>

            <button 
              type="button" 
              onclick="window.resetRoomGiftsToDefault()" 
              title="استعادة الهدايا والأقسام الافتراضية"
              class="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-black text-xs flex items-center gap-1.5 cursor-pointer transition">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5 text-slate-600"></i>
              <span>استعادة الافتراضي</span>
            </button>
          </div>
        </div>

        <!-- Metric Badges Row (الأقسام الديناميكية المطابقة للتطبيق) -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button 
            type="button" 
            onclick="window.setGiftsFilterCategory('all')" 
            class="px-3.5 py-2 rounded-xl border-2 shrink-0 ${filter.category === 'all' ? 'border-slate-950 bg-slate-900 text-white shadow-md' : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-white'} text-center transition cursor-pointer flex items-center gap-2">
            <span class="text-xs font-bold">الكل</span>
            <span class="px-2 py-0.5 rounded-md bg-white/20 text-xs font-mono font-black">${totalCount}</span>
          </button>

          ${categories.map(cat => {
            const count = allGifts.filter(g => g.category === cat.id).length;
            const isSelected = filter.category === cat.id;
            return `
              <button 
                type="button" 
                onclick="window.setGiftsFilterCategory('${cat.id}')" 
                class="px-3.5 py-2 rounded-xl border-2 shrink-0 ${isSelected ? 'border-emerald-600 bg-emerald-600 text-white shadow-md font-black' : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-white font-bold'} transition cursor-pointer flex items-center gap-2">
                <span>${cat.icon || '🎁'}</span>
                <span class="text-xs">${cat.name}</span>
                <span class="px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-white text-emerald-900' : 'bg-slate-200 text-slate-800'} text-[11px] font-mono font-black">${count}</span>
              </button>
            `;
          }).join('')}

          <button 
            type="button" 
            onclick="window.setGiftsFilterCategory('with_video')" 
            class="px-3.5 py-2 rounded-xl border-2 shrink-0 ${filter.category === 'with_video' ? 'border-sky-600 bg-sky-600 text-white shadow-md font-black' : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-white font-bold'} transition cursor-pointer flex items-center gap-2">
            <span>🎬</span>
            <span class="text-xs">بفيديو خاص</span>
            <span class="px-1.5 py-0.5 rounded-md ${filter.category === 'with_video' ? 'bg-white text-sky-900' : 'bg-slate-200 text-slate-800'} text-[11px] font-mono font-black">${withVideoCount}</span>
          </button>
        </div>
      </div>

      <!-- 2. SEARCH & CONTROLS BAR -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2 flex-1 max-w-md">
          <div class="relative w-full">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              value="${filter.search || ''}" 
              oninput="window.setGiftsSearchQuery(this.value)" 
              placeholder="البحث باسم الهدية أو السعر أو نوع التحريك..." 
              class="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-950 focus:bg-white focus:border-amber-500 outline-none transition" 
            />
          </div>
          ${filter.search ? `
            <button 
              type="button" 
              onclick="window.setGiftsSearchQuery('')" 
              class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
          ` : ''}
        </div>

        <div class="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span>يتم تطبيق التعديلات لحظياً في الغرفة الصوتية دون إعادة تحميل الصفحة ⚡</span>
        </div>
      </div>

      <!-- 3. WATER-RULED GIFTS CATALOG TABLE (Strictly WCAG & AGENTS.md compliant) -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs whitespace-nowrap">
            <thead class="bg-slate-100 text-slate-950 font-black border-b-2 border-slate-400">
              <tr>
                <th class="py-3.5 px-3 text-center w-12 border-l border-slate-200/80">#</th>
                <th class="py-3.5 px-3 text-center border-l border-slate-200/80">شكل ومظهر الهدية</th>
                <th class="py-3.5 px-4 border-l border-slate-200/80">اسم الهدية</th>
                <th class="py-3.5 px-3 text-center border-l border-slate-200/80">التصنيف</th>
                <th class="py-3.5 px-3 text-center border-l border-slate-200/80 bg-amber-50/50">السعر بالكوينز</th>
                <th class="py-3.5 px-4 border-l border-slate-200/80 bg-sky-50/50">تأثير التحريك / الفيديو المربوط</th>
                <th class="py-3.5 px-3 text-center border-l border-slate-200/80">حالة الربط بالروم</th>
                <th class="py-3.5 px-4 text-center">الإجراءات والتحكم</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-300">
              ${filteredGifts.length === 0 ? `
                <tr>
                  <td colspan="8" class="py-12 text-center text-slate-500 font-bold text-sm">
                    لا توجد هدايا تطابق البحث أو الفلتر المحدد. اضغط على "+ إضافة هدية جديدة للصندوق".
                  </td>
                </tr>
              ` : filteredGifts.map((gift, idx) => {
                const rowBg = idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-[#edf6f9]';
                const hasVideo = gift.animationUrl && gift.animationUrl.trim() !== '';
                const hasSound = gift.soundEffect && gift.soundEffect.trim() !== '';
                const isImage = typeof gift.icon === 'string' && (gift.icon.startsWith('data:') || gift.icon.startsWith('http'));

                const catObj = categories.find(c => c.id === gift.category) || { name: gift.category, icon: '🎁' };
                let catBadgeClass = 'bg-slate-100 border-slate-300 text-slate-900';
                if (catObj.id === 'refundable') catBadgeClass = 'bg-emerald-100 border-emerald-300 text-emerald-950 font-black';
                else if (catObj.id === 'trending') catBadgeClass = 'bg-rose-100 border-rose-300 text-rose-950 font-bold';
                else if (catObj.id === 'events') catBadgeClass = 'bg-indigo-100 border-indigo-300 text-indigo-950 font-bold';
                else if (catObj.id === 'regional') catBadgeClass = 'bg-sky-100 border-sky-300 text-sky-950 font-bold';
                else if (catObj.id === 'custom') catBadgeClass = 'bg-teal-100 border-teal-300 text-teal-950 font-bold';
                else if (catObj.id === 'privileges') catBadgeClass = 'bg-amber-100 border-amber-300 text-amber-950 font-black';
                else if (catObj.id === 'fun') catBadgeClass = 'bg-purple-100 border-purple-300 text-purple-950 font-bold';

                const catBadge = `<span class="px-2.5 py-0.5 rounded-full border ${catBadgeClass} text-[11px] inline-flex items-center gap-1">${catObj.icon || '🎁'} ${catObj.name}</span>`;

                return `
                  <tr class="${rowBg} hover:bg-[#dff0f5] transition">
                    <td class="py-3 px-3 text-center font-bold text-slate-500 border-l border-slate-200/80">${idx + 1}</td>
                    
                    <!-- Icon / Image with refund badge if applicable -->
                    <td class="py-2.5 px-3 text-center border-l border-slate-200/80">
                      <div class="flex items-center justify-center relative">
                        ${isImage ? `
                          <div class="relative group">
                            <img src="${gift.icon}" class="w-11 h-11 object-contain rounded-xl border border-slate-300 bg-white p-1 shadow-xs group-hover:scale-110 transition" alt="${gift.name}" />
                            <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                          </div>
                        ` : `
                          <div class="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs relative">
                            ${gift.icon || '🎁'}
                            ${gift.isRefundable ? `
                              <span class="absolute -top-1.5 -left-1.5 px-1 py-0.2 bg-emerald-600 text-white rounded text-[8px] font-black shadow-xs">استرداد</span>
                            ` : ''}
                          </div>
                        `}
                      </div>
                    </td>

                    <!-- Name -->
                    <td class="py-3 px-4 border-l border-slate-200/80">
                      <div class="flex items-center gap-2">
                        <span class="font-black text-slate-950 text-sm">${gift.name}</span>
                        ${gift.isRefundable ? `
                          <span class="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-900 text-[10px] font-black border border-emerald-300">ميزة استرداد 🏷️</span>
                        ` : ''}
                        ${gift.isCustom ? `
                          <span class="px-1.5 py-0.2 rounded bg-sky-100 text-sky-950 text-[10px] font-black border border-sky-300">مخصصة</span>
                        ` : ''}
                      </div>
                      <div class="text-[10px] font-mono text-slate-500 mt-0.5">ID: #${gift.id}</div>
                    </td>

                    <!-- Category -->
                    <td class="py-3 px-3 text-center border-l border-slate-200/80">
                      ${catBadge}
                    </td>

                    <!-- Price -->
                    <td class="py-3 px-3 text-center border-l border-slate-200/80 bg-amber-50/30">
                      <span class="font-mono font-black text-amber-800 text-sm inline-flex items-center gap-1">
                        <span>${Number(gift.price).toLocaleString()}</span>
                        <span>🪙</span>
                      </span>
                    </td>

                    <!-- Animation / Video Link & Sound -->
                    <td class="py-3 px-4 border-l border-slate-200/80 bg-sky-50/30">
                      <div class="flex items-center gap-2 flex-wrap">
                        ${hasVideo ? `
                          <span class="px-2 py-1 rounded-lg bg-sky-100 border border-sky-300 text-sky-950 font-black text-[11px] flex items-center gap-1">
                            <i data-lucide="video" class="w-3.5 h-3.5 text-sky-700"></i>
                            <span>فيديو مخصص 🎬</span>
                          </span>
                          <button 
                            type="button" 
                            onclick="window.openPreviewGiftVideoModal('${gift.id}')" 
                            class="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-100 border border-slate-300 text-slate-800 hover:text-sky-950 font-bold text-xs transition cursor-pointer flex items-center gap-1">
                            <i data-lucide="play" class="w-3 h-3 text-sky-600"></i>
                            <span>تشغيل</span>
                          </button>
                        ` : `
                          <span class="text-slate-700 font-bold text-xs flex items-center gap-1">
                            <span>تحريك:</span>
                            <span class="font-black text-purple-900">${gift.animationType || 'fireworks'}</span>
                          </span>
                          <button 
                            type="button" 
                            onclick="window.openPreviewGiftVideoModal('${gift.id}')" 
                            class="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer">
                            معاينة
                          </button>
                        `}
                        <span class="px-2 py-0.5 rounded-md ${gift.renderLayer === 'above_mics' ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'bg-cyan-100 text-cyan-950 border border-cyan-300'} font-black text-[10px]">
                          ${gift.renderLayer === 'above_mics' ? '👑 فوق المايكات' : '🌌 خلف المايكات'}
                        </span>
                        <span class="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300 font-bold text-[10px]">
                          📍 ${gift.placement === 'fullscreen' ? 'ملء الشاشة' : gift.placement === 'center' ? 'وسط' : gift.placement === 'mics' ? 'مايكات' : gift.placement === 'top' ? 'أعلى' : 'أسفل'}
                        </span>
                        ${(hasSound || gift.hasSound) ? `
                          <span class="px-2 py-1 rounded-lg bg-indigo-100 border border-indigo-300 text-indigo-950 font-black text-[11px] flex items-center gap-1" title="مربوط بنغمة موسيقية ومؤثر صوتي">
                            <span>🎵 نغمة موسيقية</span>
                          </span>
                        ` : ''}
                      </div>
                    </td>

                    <!-- Room Binding Status -->
                    <td class="py-3 px-3 text-center border-l border-slate-200/80">
                      <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-[11px] border border-emerald-300 inline-flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>نشطة بالصندوق</span>
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="py-3 px-4 text-center">
                      <div class="inline-flex items-center gap-1.5 justify-center flex-wrap">
                        <button 
                          type="button" 
                          onclick="window.openEditGiftModal('${gift.id}')" 
                          title="تعديل الهدية وشكلها والفيديو" 
                          class="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-xs flex items-center gap-1">
                          <i data-lucide="edit-3" class="w-3 h-3"></i>
                          <span>تعديل</span>
                        </button>

                        <button 
                          type="button" 
                          onclick="window.testSendGift('${gift.id}')" 
                          title="تجربة إرسال الهدية وتأثيرها في الروم" 
                          class="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition cursor-pointer shadow-xs flex items-center gap-1">
                          <i data-lucide="send" class="w-3 h-3"></i>
                          <span>تجربة بالروم</span>
                        </button>

                        <button 
                          type="button" 
                          onclick="window.deleteGiftFromCatalog('${gift.id}')" 
                          title="حذف الهدية من الصندوق" 
                          class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer">
                          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Filter setters
window.setGiftsFilterCategory = function(cat) {
  window._giftsCatalogFilter.category = cat;
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderGiftsCatalogView(container);
};

window.setGiftsSearchQuery = function(q) {
  window._giftsCatalogFilter.search = q;
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderGiftsCatalogView(container);
};

// Modal for Add / Edit Gift
window.openAddGiftModal = function() {
  window.openEditGiftModal(null);
};

window.openEditGiftModal = function(giftId) {
  const allGifts = getRoomGiftsCatalog();
  const gift = giftId ? allGifts.find(g => g.id === giftId) : null;

  const isNew = !gift;
  const title = isNew ? '➕ إضافة هدية جديدة لصندوق الروم' : `✏️ تعديل الهدية: ${gift.name}`;

  const currentIcon = gift ? gift.icon : '🎁';
  const currentVideo = gift ? (gift.animationUrl || gift.videoUrl || '') : '';
  const currentSound = gift ? (gift.soundEffect || '') : '';
  const currentCategory = gift ? gift.category : 'popular';
  const currentPrice = gift ? gift.price : 100;
  const currentName = gift ? gift.name : '';
  const currentAnimType = gift ? (gift.animationType || 'fireworks') : 'fireworks';
  const currentRenderLayer = gift && gift.renderLayer ? gift.renderLayer : 'behind_mics';
  const currentPlacement = gift && gift.placement ? gift.placement : 'bottom';
  const currentScale = gift && gift.scale ? gift.scale : 1.0;

  const categories = getGiftCategories();
  const currentIsRefundable = gift ? !!gift.isRefundable : false;
  const currentHasSound = gift ? (gift.hasSound || (gift.soundEffect && gift.soundEffect.trim() !== '')) : false;

  // Remove existing modal if any
  const existing = document.getElementById('giftCMSModal');
  if (existing) existing.remove();

  const modalHtml = `
    <div id="giftCMSModal" class="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div class="bg-white rounded-3xl border-2 border-slate-300 max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 my-8">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b-2 border-slate-200 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">${currentIcon.startsWith('data:') || currentIcon.startsWith('http') ? '🖼️' : currentIcon}</span>
            <h3 class="text-base font-black text-slate-950">${title}</h3>
          </div>
          <button onclick="document.getElementById('giftCMSModal').remove()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Form Fields -->
        <div class="space-y-4 max-h-[75vh] overflow-y-auto pl-1 pr-1 text-xs">
          
          <!-- Name & Category -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-black text-slate-900 mb-1">اسم الهدية *</label>
              <input 
                type="text" 
                id="modalGiftName" 
                value="${currentName}" 
                placeholder="مثال: أسد الذهب الأسطوري" 
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-950 focus:bg-white focus:border-amber-500 outline-none" 
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block font-black text-slate-900">القسم / التصنيف *</label>
                <button type="button" onclick="window.openManageCategoriesModal()" class="text-[10px] text-emerald-700 hover:underline font-bold">
                  + إدارة الأقسام
                </button>
              </div>
              <select 
                id="modalGiftCategory" 
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-950 focus:bg-white focus:border-amber-500 outline-none">
                ${categories.map(cat => `
                  <option value="${cat.id}" ${currentCategory === cat.id ? 'selected' : ''}>
                    ${cat.icon || '🎁'} ${cat.name}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Price & Preset Animation -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-black text-slate-900 mb-1">السعر بالكوينز 🪙 *</label>
              <input 
                type="number" 
                id="modalGiftPrice" 
                value="${currentPrice}" 
                min="1" 
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono font-black text-amber-800 focus:bg-white focus:border-amber-500 outline-none" 
              />
            </div>

            <div>
              <label class="block font-black text-slate-900 mb-1">قالب التحريك الافتراضي</label>
              <select 
                id="modalGiftAnimType" 
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-950 focus:bg-white focus:border-amber-500 outline-none">
                <option value="fireworks" ${currentAnimType === 'fireworks' ? 'selected' : ''}>ألعاب نارية متفجرة 🎆</option>
                <option value="crown" ${currentAnimType === 'crown' ? 'selected' : ''}>تاج ملكي متوهج 👑</option>
                <option value="car" ${currentAnimType === 'car' ? 'selected' : ''}>سيارة سباق فارهة 🏎️</option>
                <option value="yacht" ${currentAnimType === 'yacht' ? 'selected' : ''}>يخت ملكي فاخر 🛥️</option>
                <option value="airplane" ${currentAnimType === 'airplane' ? 'selected' : ''}>طائرة نفاثة 🛩️</option>
                <option value="castle" ${currentAnimType === 'castle' ? 'selected' : ''}>قلعة أسطورية 🏰</option>
                <option value="lion" ${currentAnimType === 'lion' ? 'selected' : ''}>أسد الذهب الأسطوري 🦁</option>
                <option value="dragon" ${currentAnimType === 'dragon' ? 'selected' : ''}>تنين النار الملكي 🐉</option>
                <option value="galaxy" ${currentAnimType === 'galaxy' ? 'selected' : ''}>مجرة وسوبرنوفا 🌌</option>
              </select>
            </div>
          </div>

          <!-- Quick Badges / Flags (Refund & Sound) -->
          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" id="modalGiftIsRefundable" class="w-4 h-4 accent-emerald-600 rounded" ${currentIsRefundable ? 'checked' : ''} />
              <div>
                <div class="font-black text-slate-900 text-xs">ميزة استرداد بالروم 🏷️</div>
                <div class="text-[10px] text-slate-500">تظهر علامة "استرداد" الخضراء فوق الهدية</div>
              </div>
            </label>

            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" id="modalGiftHasSound" class="w-4 h-4 accent-indigo-600 rounded" ${currentHasSound ? 'checked' : ''} />
              <div>
                <div class="font-black text-slate-900 text-xs">نغمة موسيقية ومؤثر صوتي 🎵</div>
                <div class="text-[10px] text-slate-500">تفعيل مؤشر الصوت وتشغيله عند الإرسال</div>
              </div>
            </label>
          </div>

          <!-- Section A: شكل وأيقونة الهدية (رابط سحابي، صورة، أو إيموجي) -->
          <div class="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-black text-slate-950 flex items-center gap-1.5">
                <i data-lucide="image" class="w-4 h-4 text-amber-600"></i>
                <span>صورة وشكل الهدية (سحابي أو من الجهاز)</span>
              </span>
              <span class="text-[11px] text-amber-900 font-bold">تظهر في صندوق الهدايا والرسائل</span>
            </div>

            <!-- Hidden input for the resolved icon data -->
            <input type="hidden" id="modalGiftIconInput" value="${currentIcon}" />

            <!-- Cloud Image URL Input (الرفع برابط سحابي) -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-800 text-xs flex items-center justify-between">
                <span>رابط الصورة السحابي (URL):</span>
                <span class="text-[10px] text-amber-800 font-bold">يقبل PNG / WebP / JPG أو إيموجي</span>
              </label>
              <div class="flex items-center gap-1.5">
                <input 
                  type="text" 
                  id="modalGiftImageUrlInput" 
                  value="${(currentIcon.startsWith('http') || currentIcon.startsWith('//')) ? currentIcon : ''}"
                  placeholder="https://example.com/gift-icon.png أو إيموجي 🌹"
                  oninput="window.handleImageUrlInputChange(this.value)"
                  class="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-xs text-slate-950 focus:border-amber-500 outline-none"
                />
                <button
                  type="button"
                  onclick="window.processCloudImageUrl(document.getElementById('modalGiftImageUrlInput').value)"
                  class="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shrink-0 shadow-xs flex items-center gap-1 transition active:scale-95"
                >
                  <i data-lucide="zap" class="w-3.5 h-3.5"></i>
                  <span>فحص الرابط</span>
                </button>
              </div>
            </div>

            <!-- File Upload & Quick Emoji Selection (خيارات إضافية) -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <label for="modalGiftImageFile" class="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer transition">
                <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                <span>أو رفع صورة من الجهاز</span>
              </label>
              <input 
                type="file" 
                id="modalGiftImageFile" 
                accept="image/*" 
                onchange="window.handleGiftImageUpload(event)"
                class="hidden" 
              />

              <!-- Quick Emojis Bar -->
              <div class="flex items-center justify-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
                ${['🌹', '👑', '🏎️', '🛥️', '💎', '🐉', '🏰', '🦁', '🌟', '🚀', '🎁'].map(e => `
                  <button 
                    type="button" 
                    onclick="window.selectGiftEmoji('${e}')" 
                    class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-amber-100 text-sm cursor-pointer transition active:scale-90" 
                    title="اختيار ${e}">
                    ${e}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Auto Image Compression & Format Detection Status Container -->
            <div id="modalGiftImageCompressStatus"></div>

            <!-- Live Icon Preview Box -->
            <div class="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
              <div id="modalIconPreviewContainer" class="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-300 flex items-center justify-center text-2xl shadow-xs overflow-hidden shrink-0">
                ${currentIcon.startsWith('data:') || currentIcon.startsWith('http') || currentIcon.startsWith('blob:') ? `
                  <img src="${currentIcon}" class="w-full h-full object-contain p-1" />
                ` : `
                  <span>${currentIcon || '🎁'}</span>
                `}
              </div>
              <div id="modalImageAnalysisText" class="text-xs text-slate-700 font-bold leading-relaxed">
                معاينة مباشرة لشكل الهدية. عند وضع رابط سحابي، يتم فحصه واعتماده أو تحويله إلى صيغة WebP فائقة الخفة (~15 KB) للسرعة وتوفير البيانات.
              </div>
            </div>
          </div>

          <!-- Section B: فيديو وتأثير التحريك المباشر في الروم (الرفع برابط سحابي وفحص الخفة والتعديل) -->
          <div class="p-4 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-black text-slate-950 flex items-center gap-1.5">
                <i data-lucide="film" class="w-4 h-4 text-sky-600"></i>
                <span>فيديو وتأثير التحريك المباشر في الروم (رابط سحابي)</span>
              </span>
              <span class="text-[11px] text-sky-900 font-bold">يشتغل في الروم خلف الشات بدون إطار</span>
            </div>

            <!-- Hidden input for video data/idb reference -->
            <input type="hidden" id="modalGiftVideoInput" value="${currentVideo}" />

            <!-- Cloud Video URL Input (الرفع السحابي برابط مع الفحص والتعديل التلقائي) -->
            <div class="space-y-1.5">
              <label class="block font-bold text-slate-800 text-xs flex items-center justify-between">
                <span class="flex items-center gap-1">
                  <i data-lucide="link" class="w-3.5 h-3.5 text-sky-600"></i>
                  <span>ضع رابط الفيديو السحابي المباشر (URL):</span>
                </span>
                <span class="text-[10px] text-sky-800 font-bold">MP4 / WebM / MOV / GIF</span>
              </label>
              
              <div class="flex items-center gap-1.5">
                <input 
                  type="url" 
                  id="modalGiftVideoUrlInput" 
                  value="${(currentVideo.startsWith('http') || currentVideo.startsWith('//')) ? currentVideo : ''}" 
                  placeholder="https://example.com/gifts/animation.mp4 أو webm" 
                  oninput="window.handleVideoUrlInputChange(this.value)"
                  class="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-xs text-slate-950 focus:border-sky-500 outline-none" 
                />
                <button 
                  type="button" 
                  onclick="window.processCloudVideoUrl(document.getElementById('modalGiftVideoUrlInput').value)"
                  class="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs cursor-pointer shrink-0 shadow flex items-center gap-1.5 transition active:scale-95"
                  title="فحص حجم وصيغة الرابط، وتعديله خفيفاً إذا كان ثقيلاً">
                  <i data-lucide="zap" class="w-3.5 h-3.5"></i>
                  <span>فحص وتعديل الرابط ⚡</span>
                </button>
              </div>

              <!-- Explanation helper -->
              <div class="text-[11px] text-sky-950/80 bg-sky-100/60 p-2 rounded-xl border border-sky-200 font-bold leading-relaxed">
                💡 <b>الذكاء السحابي التلقائي:</b> عند إدخال الرابط، يقوم النظام بفحصه فورياً؛ إن كان الفيديو خفيفاً فسيتم رفعه واعتماده مباشرة. وإن كان الفيديو ثقيلاً، فسيتم سحبه وتعديل ضغطه تلقائياً من الرابط ليكون فائق الخفة (~250 KB) حتى يعمل بسلاسة في الروم بدون أي تعليق.
              </div>
            </div>

            <!-- Alternative: Local Video File Upload -->
            <div class="flex items-center gap-2 pt-1 border-t border-sky-200">
              <label for="modalGiftVideoFile" class="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer transition">
                <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                <span>أو رفع ملف فيديو من الجهاز (MP4 / WebM / MOV)</span>
              </label>
              <input 
                type="file" 
                id="modalGiftVideoFile" 
                accept="video/*,video/mp4,video/webm,video/quicktime,image/gif" 
                onchange="window.handleGiftVideoUpload(event)"
                class="hidden" 
              />
            </div>

            <!-- Auto Video Compression & Format Detection Status -->
            <div id="modalGiftVideoCompressStatus"></div>

            <!-- Live Video Preview Box (مشغل معاينة مباشر بدون أي رابط أو إطار مشوه) -->
            <div id="modalVideoPreviewWrapper" class="${currentVideo ? '' : 'hidden'} bg-slate-950 rounded-2xl p-3 border border-slate-800 text-center space-y-2">
              <div class="flex items-center justify-between text-xs font-bold text-amber-300">
                <span>معاينة فيديو الهدية (يشتغل بالروم خلف الشات بدون إطار):</span>
                <button 
                  type="button" 
                  onclick="window.removeGiftVideo()" 
                  class="text-rose-400 hover:text-rose-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer bg-slate-900/80 px-2.5 py-1 rounded-lg border border-rose-500/30">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  <span>إزالة الفيديو</span>
                </button>
              </div>
              <div id="modalVideoPreviewContainer" class="max-h-52 flex items-center justify-center overflow-hidden rounded-xl bg-slate-900">
                <!-- Video loaded dynamically -->
              </div>
            </div>
          </div>

          <!-- Section C: صوت ومؤثر الهدية (Audio / Sound Effect) -->
          <div class="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-black text-slate-950 flex items-center gap-1.5">
                <i data-lucide="volume-2" class="w-4 h-4 text-indigo-600"></i>
                <span>صوت ومؤثر الهدية (رابط سحابي، MP3، WAV، AAC)</span>
              </span>
              <span class="text-[11px] text-indigo-900 font-bold">يعمل فوراً بالروم مع الهدية 🔊</span>
            </div>

            <p class="text-[11px] text-slate-600 font-medium">
              يدعم جميع صيغ الصوت (<b class="text-slate-900">MP3 / WAV / AAC / M4A / OGG</b>). يمكنك إدخال رابط صوت سحابي مباشر أو رفع ملف صوتي من الجهاز ليعمل الصوت كاملاً في الروم مع الهدية والفيديو.
            </p>

            <!-- Hidden input for the resolved sound data -->
            <input type="hidden" id="modalGiftSoundInput" value="${currentSound}" />

            <!-- Cloud Audio URL Input (الرفع برابط صوت سحابي) -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-800 text-xs flex items-center justify-between">
                <span>1. رابط الصوت السحابي المباشر (Cloud Audio URL):</span>
                <span class="text-[10px] text-indigo-700 font-bold font-mono">يدعم MP3 / WAV / AAC</span>
              </label>
              <div class="flex items-center gap-1.5">
                <input 
                  type="text" 
                  id="modalGiftSoundUrlInput" 
                  value="${(currentSound.startsWith('http') || currentSound.startsWith('//')) ? currentSound : ''}"
                  placeholder="https://example.com/sound-effect.mp3"
                  oninput="window.handleSoundUrlInputChange(this.value)"
                  class="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-xs text-slate-950 focus:border-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onclick="window.processCloudAudioUrl(document.getElementById('modalGiftSoundUrlInput').value)"
                  class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs cursor-pointer shrink-0 shadow-xs flex items-center gap-1 transition active:scale-95"
                >
                  <i data-lucide="play-circle" class="w-3.5 h-3.5"></i>
                  <span>فحص وتجربة 🎵</span>
                </button>
              </div>
            </div>

            <!-- Upload Audio File Button -->
            <div class="space-y-1 pt-1">
              <label class="block font-bold text-slate-800 text-xs flex items-center justify-between">
                <span>2. أو رفع ملف صوتي من الجهاز:</span>
                <span class="text-[10px] text-slate-600 font-mono">MP3, WAV, AAC, M4A, OGG</span>
              </label>
              <div class="flex items-center gap-2">
                <label 
                  for="modalGiftAudioFileInput"
                  class="px-3 py-2 rounded-xl bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-400 font-bold text-xs text-slate-900 flex items-center gap-1.5 cursor-pointer shadow-2xs transition active:scale-95"
                >
                  <i data-lucide="upload" class="w-3.5 h-3.5 text-indigo-600"></i>
                  <span>اختر ملف صوت (MP3 / WAV / AAC)</span>
                </label>
                <input 
                  type="file" 
                  id="modalGiftAudioFileInput" 
                  accept="audio/*,.mp3,.wav,.aac,.m4a,.ogg" 
                  onchange="window.handleGiftAudioUpload(event)"
                  class="hidden" 
                />
              </div>
            </div>

            <!-- Auto Audio Compression & Format Status -->
            <div id="modalGiftAudioCompressStatus"></div>

            <!-- Live Audio Player & Preview Box -->
            <div id="modalSoundPreviewWrapper" class="${currentSound ? '' : 'hidden'} bg-slate-950 rounded-2xl p-3 border border-slate-800 text-center space-y-2">
              <div class="flex items-center justify-between text-xs font-bold text-indigo-300">
                <span class="flex items-center gap-1.5">
                  <i data-lucide="volume-2" class="w-3.5 h-3.5 text-emerald-400"></i>
                  <span>مشغل معاينة صوت الهدية (يشتغل بالروم مع الهدية 🔊):</span>
                </span>
                <button 
                  type="button" 
                  onclick="window.removeGiftSound()" 
                  class="text-rose-400 hover:text-rose-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer bg-slate-900/80 px-2.5 py-1 rounded-lg border border-rose-500/30">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  <span>إزالة الصوت</span>
                </button>
              </div>
              <div id="modalSoundPreviewContainer" class="p-2 rounded-xl bg-slate-900 flex items-center justify-center">
                <!-- Audio element loaded dynamically -->
              </div>
            </div>
          </div>

          <!-- Section D: طبقة وموضع العرض في الروم (خلف المايكات والشات / أسفل الشاشة أو ملء الشاشة) -->
          <div class="p-4 rounded-2xl bg-white border-2 border-slate-300 space-y-4 shadow-xs">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <div class="flex items-center gap-2">
                <span class="text-base">🎭</span>
                <span class="text-slate-950 font-black text-xs">الخطوة الثانية: طبقة العرض وموضع الشاشة في الروم (Render Layer & Placement)</span>
              </div>
              <span class="text-[10px] text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300 font-black">مطابق لمستودع الروم 100%</span>
            </div>

            <!-- D.1: طبقة العرض (خلف المايكات والشات أو فوق المايكات) -->
            <div class="space-y-1.5">
              <input type="hidden" id="modalGiftRenderLayer" value="${currentRenderLayer}" />
              <div class="flex items-center justify-between text-[11px] font-black text-slate-800">
                <span>طبقة ومسار ظهور الهدية (Render Layer):</span>
                <span class="text-cyan-800 font-mono text-[10px]">خلف المايكات أو فوقها</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <!-- Option 1: Behind Mics & Chat -->
                <button 
                  type="button" 
                  id="btnLayerBehindMics" 
                  onclick="window.setModalRenderLayer('behind_mics')" 
                  class="${currentRenderLayer === 'behind_mics' ? 'p-3 rounded-2xl text-right transition-all cursor-pointer border-2 border-cyan-500 bg-[#edf6f9] text-slate-950 shadow-md ring-2 ring-cyan-400/50 flex items-start gap-3' : 'p-3 rounded-2xl text-right transition-all cursor-pointer border-2 border-slate-200 bg-white text-slate-600 hover:border-slate-300 flex items-start gap-3'}">
                  <span class="text-2xl shrink-0 mt-0.5">🌌</span>
                  <div class="min-w-0 flex-1">
                    <div class="text-xs font-black text-cyan-950 flex items-center justify-between">
                      <span>خلف المايكات وخلف الشات</span>
                      <span class="text-[10px] px-1.5 py-0.2 rounded bg-cyan-200 text-cyan-900 font-black">المفضّل 🌟</span>
                    </div>
                    <div class="text-[10.5px] text-slate-600 font-normal leading-relaxed mt-1">
                      تظهر الهدية كديكور راقٍ أمام صورة الروم وخلف المايكات وخلف الشات (لا تحجب مقاعد المتحدثين أو محادثات الأعضاء)
                    </div>
                  </div>
                </button>

                <!-- Option 2: Above Mics -->
                <button 
                  type="button" 
                  id="btnLayerAboveMics" 
                  onclick="window.setModalRenderLayer('above_mics')" 
                  class="${currentRenderLayer === 'above_mics' ? 'p-3 rounded-2xl text-right transition-all cursor-pointer border-2 border-amber-500 bg-amber-50/80 text-slate-950 shadow-md ring-2 ring-amber-400/50 flex items-start gap-3' : 'p-3 rounded-2xl text-right transition-all cursor-pointer border-2 border-slate-200 bg-white text-slate-600 hover:border-slate-300 flex items-start gap-3'}">
                  <span class="text-2xl shrink-0 mt-0.5">👑</span>
                  <div class="min-w-0 flex-1">
                    <div class="text-xs font-black text-amber-950 flex items-center justify-between">
                      <span>فوق المايكات (طبقة علوية بارزة)</span>
                      <span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-black">سينمائي 🎬</span>
                    </div>
                    <div class="text-[10.5px] text-slate-600 font-normal leading-relaxed mt-1">
                      تظهر الهدية فوق المايكات والشات كطبقة تأثير سينمائية بارزة في مقدمة الشاشة بالكامل
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- D.2: موضع الهدية في شاشة الروم (Placement) -->
            <div class="space-y-1.5">
              <input type="hidden" id="modalGiftPlacement" value="${currentPlacement}" />
              <div class="flex items-center justify-between text-[11px] font-black text-slate-800">
                <span>موضع ومكان الظهور في شاشة الروم (Placement):</span>
                <span class="text-amber-800 font-mono text-[10px]">أسفل الشاشة / ملء الشاشة / وسط / مايكات</span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <!-- 1. أسفل الشاشة -->
                <button 
                  type="button" 
                  id="btnPlacement_bottom" 
                  onclick="window.setModalPlacement('bottom')" 
                  class="${currentPlacement === 'bottom' ? 'py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1 border-2 border-amber-500 bg-amber-400 text-slate-950 shadow-md scale-102' : 'py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1 border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300'}">
                  <span class="text-base">⬇️</span>
                  <span class="text-[11px] whitespace-nowrap">أسفل الشاشة</span>
                  <span class="text-[9px] text-slate-500">فوق الشات</span>
                </button>

                <!-- 2. ملء الشاشة -->
                <button 
                  type="button" 
                  id="btnPlacement_fullscreen" 
                  onclick="window.setModalPlacement('fullscreen')" 
                  class="${currentPlacement === 'fullscreen' ? 'py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1 border-2 border-amber-500 bg-amber-400 text-slate-950 shadow-md scale-102' : 'py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1 border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300'}">
                  <span class="text-base">📺</span>
                  <span class="text-[11px] whitespace-nowrap">ملء الشاشة</span>
                  <span class="text-[9px] text-slate-500">كامل الروم</span>
                </button>

                <!-- 3. وسط الروم -->
                <button 
                  type="button" 
                  id="btnPlacement_center" 
                  onclick="window.setModalPlacement('center')" 
                  class="${currentPlacement === 'center' ? 'py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1 border-2 border-amber-500 bg-amber-400 text-slate-950 shadow-md scale-102' : 'py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1 border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300'}">
                  <span class="text-base">🎯</span>
                  <span class="text-[11px] whitespace-nowrap">وسط الروم</span>
                  <span class="text-[9px] text-slate-500">المركز</span>
                </button>

                <!-- 4. حول المايكات -->
                <button 
                  type="button" 
                  id="btnPlacement_mics" 
                  onclick="window.setModalPlacement('mics')" 
                  class="${currentPlacement === 'mics' ? 'py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1 border-2 border-amber-500 bg-amber-400 text-slate-950 shadow-md scale-102' : 'py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1 border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300'}">
                  <span class="text-base">🎙️</span>
                  <span class="text-[11px] whitespace-nowrap">حول المايكات</span>
                  <span class="text-[9px] text-slate-500">المقاعد الـ20</span>
                </button>

                <!-- 5. أعلى الروم -->
                <button 
                  type="button" 
                  id="btnPlacement_top" 
                  onclick="window.setModalPlacement('top')" 
                  class="${currentPlacement === 'top' ? 'py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1 border-2 border-amber-500 bg-amber-400 text-slate-950 shadow-md scale-102' : 'py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1 border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300'}">
                  <span class="text-base">⬆️</span>
                  <span class="text-[11px] whitespace-nowrap">أعلى الروم</span>
                  <span class="text-[9px] text-slate-500">منطقة الهيدر</span>
                </button>
              </div>
            </div>

            <!-- D.3: حجم وتكبير الهدية (Scale) -->
            <div class="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="flex items-center gap-2">
                <span class="text-sm">🔍</span>
                <label class="text-xs font-bold text-slate-800">مقياس حجم الهدية (Scale):</label>
              </div>
              <div class="flex items-center gap-2">
                <input 
                  type="range" 
                  id="modalGiftScaleInput" 
                  min="0.5" 
                  max="2.0" 
                  step="0.05" 
                  value="${currentScale}" 
                  oninput="document.getElementById('modalGiftScaleVal').innerText = this.value + 'x'; if(window.updateGiftModalSimulator) window.updateGiftModalSimulator();" 
                  class="w-28 accent-amber-500 cursor-pointer" />
                <span id="modalGiftScaleVal" class="text-xs font-mono font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 min-w-[42px] text-center">${currentScale}x</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 border-t-2 border-slate-200 pt-4">
          <button 
            type="button" 
            onclick="document.getElementById('giftCMSModal').remove()" 
            class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer">
            إلغاء
          </button>

          <button 
            type="button" 
            onclick="window.saveGiftModalData('${giftId || ''}')" 
            class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-md transition hover:scale-102 flex items-center gap-1.5">
            <i data-lucide="check" class="w-4 h-4"></i>
            <span>حفظ وتحديث الهدية فوراً في الروم</span>
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  if (window.lucide) lucide.createIcons();

  // If gift already has a video, resolve and load preview automatically
  if (currentVideo) {
    window.updateGiftVideoPreview(currentVideo);
  }

  // If gift already has sound, resolve and load preview automatically
  if (currentSound) {
    window.updateGiftAudioPreview(currentSound);
  }
};

// Quick emoji selector
window.selectGiftEmoji = function(emoji) {
  const input = document.getElementById('modalGiftIconInput');
  if (input) input.value = emoji;
  window.updateGiftIconPreview(emoji);
  const statusContainer = document.getElementById('modalGiftImageCompressStatus');
  if (statusContainer) {
    statusContainer.innerHTML = `
      <div class="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 font-bold text-xs flex items-center gap-1.5">
        <span>✨ تم اختيار الإيموجي:</span>
        <span class="text-base">${emoji}</span>
      </div>
    `;
  }
};

window.setModalRenderLayer = function(layer) {
  const input = document.getElementById('modalGiftRenderLayer');
  if (input) input.value = layer;

  const btnBehind = document.getElementById('btnLayerBehindMics');
  const btnAbove = document.getElementById('btnLayerAboveMics');

  if (layer === 'behind_mics') {
    if (btnBehind) {
      btnBehind.className = 'p-3 rounded-2xl text-right transition-all cursor-pointer border-2 border-cyan-500 bg-[#edf6f9] text-slate-950 shadow-md ring-2 ring-cyan-400/50 flex items-start gap-3';
    }
    if (btnAbove) {
      btnAbove.className = 'p-3 rounded-2xl text-right transition-all cursor-pointer border-2 border-slate-200 bg-white text-slate-600 hover:border-slate-300 flex items-start gap-3';
    }
  } else {
    if (btnAbove) {
      btnAbove.className = 'p-3 rounded-2xl text-right transition-all cursor-pointer border-2 border-amber-500 bg-amber-50/80 text-slate-950 shadow-md ring-2 ring-amber-400/50 flex items-start gap-3';
    }
    if (btnBehind) {
      btnBehind.className = 'p-3 rounded-2xl text-right transition-all cursor-pointer border-2 border-slate-200 bg-white text-slate-600 hover:border-slate-300 flex items-start gap-3';
    }
  }
};

window.setModalPlacement = function(placement) {
  const input = document.getElementById('modalGiftPlacement');
  if (input) input.value = placement;

  const positions = ['fullscreen', 'bottom', 'center', 'mics', 'top'];
  positions.forEach(pos => {
    const btn = document.getElementById('btnPlacement_' + pos);
    if (btn) {
      if (pos === placement) {
        btn.className = 'py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1 border-2 border-amber-500 bg-amber-400 text-slate-950 shadow-md scale-102';
      } else {
        btn.className = 'py-2.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1 border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300';
      }
    }
  });
};

// Remove video button handler
window.removeGiftVideo = function() {
  const input = document.getElementById('modalGiftVideoInput');
  if (input) input.value = '';
  const urlInput = document.getElementById('modalGiftVideoUrlInput');
  if (urlInput) urlInput.value = '';
  const fileInput = document.getElementById('modalGiftVideoFile');
  if (fileInput) fileInput.value = '';
  const wrapper = document.getElementById('modalVideoPreviewWrapper');
  if (wrapper) wrapper.classList.add('hidden');
  const container = document.getElementById('modalVideoPreviewContainer');
  if (container) container.innerHTML = '';
  const statusContainer = document.getElementById('modalGiftVideoCompressStatus');
  if (statusContainer) {
    statusContainer.innerHTML = `
      <div class="p-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs">
        تمت إزالة الفيديو. ستظهر الهدية كتحريك أيقونة افتراضي.
      </div>
    `;
  }
};

// Cloud Video URL Debounce & Processor
let cloudVideoDebounceTimer = null;
window.handleVideoUrlInputChange = function(val) {
  clearTimeout(cloudVideoDebounceTimer);
  if (!val || val.trim() === '') {
    window.removeGiftVideo();
    return;
  }
  cloudVideoDebounceTimer = setTimeout(() => {
    window.processCloudVideoUrl(val.trim());
  }, 800);
};

window.processCloudVideoUrl = async function(url, forceCompress = false) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    alert('يرجى كتابة أو لصق رابط فيديو سحابي صالح أولاً!');
    return;
  }
  url = url.trim();

  const statusContainer = document.getElementById('modalGiftVideoCompressStatus');
  const input = document.getElementById('modalGiftVideoInput');
  const wrapper = document.getElementById('modalVideoPreviewWrapper');
  const previewContainer = document.getElementById('modalVideoPreviewContainer');

  if (statusContainer) {
    statusContainer.innerHTML = `
      <div class="p-3 rounded-2xl bg-sky-950 text-white border border-sky-400 space-y-2">
        <div class="flex items-center justify-between text-xs font-bold">
          <span class="flex items-center gap-2" id="urlCompressStepMsg">
            <span class="w-4 h-4 rounded-full border-2 border-sky-300 border-t-transparent animate-spin shrink-0"></span>
            <span>جاري سحب وفحص الرابط السحابي... 🔍</span>
          </span>
          <span id="urlCompressStepPct" class="font-mono text-amber-300">15%</span>
        </div>
        <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div id="urlCompressStepBar" class="bg-gradient-to-r from-sky-400 to-emerald-400 h-2 transition-all duration-300" style="width: 15%"></div>
        </div>
        <div class="text-[10px] text-sky-200 flex items-center justify-between font-mono pt-1 border-t border-sky-800">
          <span class="truncate max-w-[260px]">${url}</span>
          <span>فحص الحجم والصيغة ⚡</span>
        </div>
      </div>
    `;
  }

  try {
    if (window.TarafMediaCompressor && window.TarafMediaCompressor.processVideoFromUrl) {
      const res = await window.TarafMediaCompressor.processVideoFromUrl(url, { forceCompress }, (p) => {
        const msg = document.getElementById('urlCompressStepMsg');
        const pct = document.getElementById('urlCompressStepPct');
        const bar = document.getElementById('urlCompressStepBar');
        if (msg) msg.innerHTML = `<span class="w-3.5 h-3.5 rounded-full border-2 border-sky-300 border-t-transparent animate-spin shrink-0"></span> <span>${p.message}</span>`;
        if (pct) pct.textContent = p.progress + '%';
        if (bar) bar.style.width = p.progress + '%';
      });

      if (input) input.value = res.videoUrl;

      // Playable instant preview
      if (wrapper && previewContainer) {
        wrapper.classList.remove('hidden');
        previewContainer.innerHTML = `<video src="${res.previewUrl}" autoplay loop muted playsinline class="max-h-48 w-full object-contain rounded-xl shadow-lg border-0 bg-black"></video>`;
        if (window.lucide) lucide.createIcons();
      }

      if (statusContainer) {
        if (res.isHeavy && res.action === 'compressed_from_url') {
          // It was heavy -> successfully modified & compressed from URL!
          statusContainer.innerHTML = `
            <div class="p-2.5 rounded-xl bg-emerald-950 text-emerald-100 border border-emerald-400 font-bold space-y-1.5 text-xs">
              <div class="flex items-center justify-between">
                <div class="text-xs font-black text-white flex items-center gap-1.5">
                  <i data-lucide="check-check" class="w-4 h-4 text-emerald-400"></i>
                  <span>🚀 تم اكتشاف فيديو ثقيل وتعديله وضغطه تلقائياً من الرابط!</span>
                  <span class="text-[10px] bg-emerald-400 text-slate-950 px-1.5 py-0.2 rounded font-black font-mono">وفّر ${res.savedPercent}%</span>
                </div>
                <span class="text-[10px] bg-emerald-400 text-slate-950 px-2 py-0.5 rounded font-black font-mono shadow">جاهز للروم ⚡</span>
              </div>
              <div class="text-[11px] text-emerald-300 font-mono flex items-center justify-between pt-1 border-t border-emerald-800">
                <span>الحجم الأصلي في الرابط: <b class="text-white">${res.originalFormat} (${res.originalSizeText})</b></span>
                <span>➔ تم التعديل إلى: <b class="text-emerald-300">${res.outputFormat} فائق الخفة (${res.compressedSizeText})</b></span>
              </div>
            </div>
          `;
        } else {
          // It was already lightweight -> kept original cloud URL directly!
          statusContainer.innerHTML = `
            <div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold space-y-1 text-xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5 text-emerald-900 font-black">
                  <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i>
                  <span>✅ الرابط السحابي خفيف جداً ومناسب للروم مباشرة دون أي تعديل!</span>
                </div>
                <span class="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-black font-mono">
                  ${res.originalSizeText} ⚡
                </span>
              </div>
              <div class="text-[11px] text-emerald-800 font-mono flex items-center justify-between pt-1 border-t border-emerald-200">
                <span>الصيغة في الرابط: <b class="text-slate-900">${res.originalFormat} (${res.originalSizeText})</b></span>
                <button 
                  type="button" 
                  onclick="window.processCloudVideoUrl(document.getElementById('modalGiftVideoUrlInput').value, true)" 
                  class="text-[10px] bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-0.5 rounded-lg cursor-pointer font-bold transition active:scale-95 shadow-xs">
                  تعديل وضغط الرابط يدوياً ⚡
                </button>
              </div>
            </div>
          `;
        }
        if (window.lucide) lucide.createIcons();
      }
    } else {
      // Basic fallback
      if (input) input.value = url;
      window.updateGiftVideoPreview(url);
    }
  } catch (err) {
    console.warn('Error processing video from cloud url:', err);
    if (input) input.value = url;
    window.updateGiftVideoPreview(url);
    if (statusContainer) {
      statusContainer.innerHTML = `
        <div class="p-2 rounded-xl bg-sky-50 border border-sky-300 text-sky-950 font-bold text-xs">
          تم ربط الفيديو السحابي المباشر وتشغيل المعاينة بنجاح.
        </div>
      `;
    }
  }
};

// Cloud Image URL Debounce & Processor
let cloudImageDebounceTimer = null;
window.handleImageUrlInputChange = function(val) {
  clearTimeout(cloudImageDebounceTimer);
  if (!val || val.trim() === '') return;
  cloudImageDebounceTimer = setTimeout(() => {
    window.processCloudImageUrl(val.trim());
  }, 700);
};

window.processCloudImageUrl = async function(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') return;
  url = url.trim();

  const statusContainer = document.getElementById('modalGiftImageCompressStatus');
  const input = document.getElementById('modalGiftIconInput');

  // If emoji
  if (!url.startsWith('http') && !url.startsWith('//') && !url.startsWith('data:')) {
    if (input) input.value = url;
    window.updateGiftIconPreview(url);
    return;
  }

  if (statusContainer) {
    statusContainer.innerHTML = `
      <div class="p-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs flex items-center gap-2">
        <span class="w-3.5 h-3.5 rounded-full border-2 border-amber-600 border-t-transparent animate-spin shrink-0"></span>
        <span>جاري فحص وتجهيز صورة الرابط السحابي...</span>
      </div>
    `;
  }

  try {
    if (window.TarafMediaCompressor && window.TarafMediaCompressor.processImageFromUrl) {
      const res = await window.TarafMediaCompressor.processImageFromUrl(url);
      if (input) input.value = res.iconUrl;
      window.updateGiftIconPreview(res.iconUrl);

      if (statusContainer) {
        statusContainer.innerHTML = `
          <div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold space-y-1 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-emerald-900 font-black">✅ ${res.message || 'تم اعتماد صورة الرابط السحابي بنجاح!'}</span>
              <span class="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-black font-mono">${res.outputFormat || 'WebP'}</span>
            </div>
          </div>
        `;
      }
    } else {
      if (input) input.value = url;
      window.updateGiftIconPreview(url);
    }
  } catch (e) {
    if (input) input.value = url;
    window.updateGiftIconPreview(url);
  }
};

// Handle file uploads with Hidden Ultra-Light Auto-Compressor
window.handleGiftImageUpload = async function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const statusContainer = document.getElementById('modalGiftImageCompressStatus');
  const origExt = file.name ? file.name.split('.').pop().toUpperCase() : 'IMAGE';
  const origSizeKB = Math.round(file.size / 1024);
  const origSizeText = origSizeKB > 1024 ? (origSizeKB / 1024).toFixed(1) + ' MB' : origSizeKB + ' KB';

  if (statusContainer) {
    statusContainer.innerHTML = `
      <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-bold space-y-1 text-xs">
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1.5">
            <span class="w-3.5 h-3.5 rounded-full border-2 border-amber-600 border-t-transparent animate-spin shrink-0"></span>
            <span>جاري فحص وتحويل الصورة تلقائياً...</span>
          </span>
          <span class="font-mono text-amber-800">${origExt} (${origSizeText})</span>
        </div>
      </div>
    `;
  }

  try {
    if (window.TarafMediaCompressor && window.TarafMediaCompressor.compressImageToUltraLight) {
      const result = await window.TarafMediaCompressor.compressImageToUltraLight(file, { maxDimension: 280, quality: 0.82 });
      const input = document.getElementById('modalGiftIconInput');
      if (input) input.value = result.dataUrl;
      window.updateGiftIconPreview(result.dataUrl);

      if (statusContainer) {
        statusContainer.innerHTML = `
          <div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold space-y-1 text-xs">
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1 text-emerald-900 font-black">
                <span>✅ تم الفحص والتحويل التلقائي بنجاح!</span>
              </span>
              <span class="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-black font-mono">
                وفّر ${result.savedPercent}%
              </span>
            </div>
            <div class="text-[11px] text-emerald-800 font-mono flex items-center justify-between pt-0.5 border-t border-emerald-200">
              <span>الصيغة الأصلية: <b class="text-slate-900">${result.originalFormat} (${result.originalSizeText})</b></span>
              <span>➔ التحويل: <b class="text-emerald-900">${result.outputFormat} فائقة الخفة (${result.compressedSizeText})</b></span>
            </div>
          </div>
        `;
      }
    } else {
      const reader = new FileReader();
      reader.onload = function(e) {
        const dataUrl = e.target.result;
        const input = document.getElementById('modalGiftIconInput');
        if (input) input.value = dataUrl;
        window.updateGiftIconPreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  } catch (err) {
    console.error('Image compression failed:', err);
    if (statusContainer) {
      statusContainer.innerHTML = `<div class="p-2 rounded-xl bg-rose-50 text-rose-800 font-bold text-xs border border-rose-200">تعذر معالجة الصورة، يرجى اختيار ملف صالح.</div>`;
    }
  }
};

window.handleGiftVideoUpload = async function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const statusContainer = document.getElementById('modalGiftVideoCompressStatus');
  const input = document.getElementById('modalGiftVideoInput');
  const wrapper = document.getElementById('modalVideoPreviewWrapper');
  const previewContainer = document.getElementById('modalVideoPreviewContainer');

  const origExt = file.name ? file.name.split('.').pop().toUpperCase() : 'VIDEO';
  const origSizeKB = Math.round(file.size / 1024);
  const origSizeText = origSizeKB > 1024 ? (origSizeKB / 1024).toFixed(1) + ' MB' : origSizeKB + ' KB';

  if (statusContainer) {
    statusContainer.innerHTML = `
      <div class="p-3 rounded-2xl bg-sky-950 text-white border border-sky-400 space-y-2">
        <div class="flex items-center justify-between text-[11px] font-bold">
          <span id="compressStepMsg" class="flex items-center gap-2">
            <span class="w-3.5 h-3.5 rounded-full border-2 border-sky-300 border-t-transparent animate-spin shrink-0"></span>
            <span>بدء المعالجة والتخفيف الفوري للفيديو...</span>
          </span>
          <span id="compressStepPct" class="font-mono text-amber-300">10%</span>
        </div>
        <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div id="compressStepBar" class="bg-gradient-to-r from-sky-400 to-emerald-400 h-2 transition-all duration-300" style="width: 10%"></div>
        </div>
        <div class="text-[10px] text-sky-200 flex items-center justify-between font-mono pt-1 border-t border-sky-800">
          <span>الملف: ${file.name}</span>
          <span>الصيغة الأصلية: ${origExt} (${origSizeText})</span>
        </div>
      </div>
    `;
  }

  try {
    if (window.TarafMediaCompressor && window.TarafMediaCompressor.compressVideoToUltraLight) {
      const res = await window.TarafMediaCompressor.compressVideoToUltraLight(file, (p) => {
        const msg = document.getElementById('compressStepMsg');
        const pct = document.getElementById('compressStepPct');
        const bar = document.getElementById('compressStepBar');
        if (msg) msg.innerHTML = `<span class="w-3.5 h-3.5 rounded-full border-2 border-sky-300 border-t-transparent animate-spin shrink-0"></span> <span>${p.message}</span>`;
        if (pct) pct.textContent = p.progress + '%';
        if (bar) bar.style.width = p.progress + '%';
      });

      if (input) input.value = res.id;

      // Direct instant playable preview without any link or frame
      if (wrapper && previewContainer) {
        wrapper.classList.remove('hidden');
        previewContainer.innerHTML = `<video src="${res.objectUrl}" autoplay loop muted playsinline class="max-h-48 w-full object-contain rounded-xl shadow-lg border-0 bg-black"></video>`;
        if (window.lucide) lucide.createIcons();
      }

      if (statusContainer) {
        statusContainer.innerHTML = `
          <div class="p-2.5 rounded-xl bg-emerald-950 text-emerald-100 border border-emerald-400 font-bold space-y-1.5 text-xs">
            <div class="flex items-center justify-between">
              <div class="text-xs font-black text-white flex items-center gap-1.5">
                <span>🚀 تم فحص وتحويل وتخفيف الفيديو بنجاح!</span>
                ${res.savedPercent > 0 ? `<span class="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-black font-mono">وفّر ${res.savedPercent}%</span>` : ''}
              </div>
              <span class="text-[10px] bg-emerald-400 text-slate-950 px-2 py-0.5 rounded font-black font-mono shadow">جاهز للروم ⚡</span>
            </div>
            <div class="text-[11px] text-emerald-300 font-mono flex items-center justify-between pt-1 border-t border-emerald-800">
              <span>الصيغة الأصلية: <b class="text-white">${res.originalFormat || origExt} (${res.originalSizeText || origSizeText})</b></span>
              <span>➔ المعالجة المخفية: <b class="text-emerald-300">${res.outputFormat || 'WebM/MP4'} (${res.compressedSizeText})</b></span>
            </div>
          </div>
        `;
      }
    } else {
      const reader = new FileReader();
      reader.onload = function(e) {
        const dataUrl = e.target.result;
        if (input) input.value = dataUrl;
        window.updateGiftVideoPreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  } catch (err) {
    console.error('Video compression error:', err);
    if (statusContainer) {
      statusContainer.innerHTML = `
        <div class="p-2 rounded-xl bg-rose-100 border border-rose-300 text-rose-950 font-bold text-xs">
          تعذر معالجة ملف الفيديو. يرجى اختيار ملف MP4 أو WebM صالح.
        </div>
      `;
    }
  }
};

window.updateGiftIconPreview = function(val) {
  const container = document.getElementById('modalIconPreviewContainer');
  if (!container) return;
  if (typeof val === 'string' && (val.startsWith('data:') || val.startsWith('http') || val.startsWith('blob:'))) {
    container.innerHTML = `<img src="${val}" class="w-full h-full object-contain p-1" />`;
  } else {
    container.innerHTML = `<span>${val || '🎁'}</span>`;
  }
};

window.updateGiftVideoPreview = async function(val) {
  const wrapper = document.getElementById('modalVideoPreviewWrapper');
  const container = document.getElementById('modalVideoPreviewContainer');
  if (!wrapper || !container) return;

  if (!val || val.trim() === '') {
    wrapper.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  wrapper.classList.remove('hidden');

  let playUrl = val;
  if (val.startsWith('idb:') && window.TarafMediaCompressor) {
    playUrl = await window.TarafMediaCompressor.getMediaBlobUrl(val);
  }

  if (playUrl.endsWith('.gif') || playUrl.endsWith('.webp') || playUrl.startsWith('data:image/')) {
    container.innerHTML = `<img src="${playUrl}" class="max-h-48 w-full object-contain rounded-xl shadow-lg" />`;
  } else {
    container.innerHTML = `<video src="${playUrl}" autoplay loop muted playsinline class="max-h-48 w-full object-contain rounded-xl shadow-lg border-0 bg-black"></video>`;
  }
  if (window.lucide) lucide.createIcons();
};

// --- AUDIO HANDLERS FOR GIFTS (صوت ومؤثر الهدية) ---
window.handleSoundUrlInputChange = function(val) {
  const input = document.getElementById('modalGiftSoundInput');
  if (input) input.value = val.trim();
  window.updateGiftAudioPreview(val.trim());
};

window.processCloudAudioUrl = async function(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    alert('يرجى إدخال رابط صوت سحابي صالح أولاً!');
    return;
  }
  url = url.trim();

  const statusContainer = document.getElementById('modalGiftAudioCompressStatus');
  const input = document.getElementById('modalGiftSoundInput');

  if (statusContainer) {
    statusContainer.innerHTML = `
      <div class="p-3 rounded-2xl bg-indigo-950 text-white border border-indigo-400 space-y-2">
        <div class="flex items-center justify-between text-xs font-bold">
          <span class="flex items-center gap-2" id="audioStepMsg">
            <span class="w-4 h-4 rounded-full border-2 border-indigo-300 border-t-transparent animate-spin shrink-0"></span>
            <span>جاري سحب وفحص رابط الصوت السحابي... 🎵</span>
          </span>
          <span id="audioStepPct" class="font-mono text-amber-300">25%</span>
        </div>
        <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div id="audioStepBar" class="bg-gradient-to-r from-indigo-400 to-purple-400 h-2 transition-all duration-300" style="width: 25%"></div>
        </div>
      </div>
    `;
  }

  try {
    if (window.TarafMediaCompressor && window.TarafMediaCompressor.processAudioFromUrl) {
      const res = await window.TarafMediaCompressor.processAudioFromUrl(url, {}, (p) => {
        const msg = document.getElementById('audioStepMsg');
        const pct = document.getElementById('audioStepPct');
        const bar = document.getElementById('audioStepBar');
        if (msg) msg.innerHTML = `<span class="w-3.5 h-3.5 rounded-full border-2 border-indigo-300 border-t-transparent animate-spin shrink-0"></span> <span>${p.message}</span>`;
        if (pct) pct.textContent = p.progress + '%';
        if (bar) bar.style.width = p.progress + '%';
      });

      if (input) input.value = res.audioUrl;
      window.updateGiftAudioPreview(res.audioUrl);

      if (statusContainer) {
        statusContainer.innerHTML = `
          <div class="p-2.5 rounded-xl bg-emerald-950 text-emerald-100 border border-emerald-400 font-bold space-y-1 text-xs">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-white font-black">
                <i data-lucide="check-check" class="w-4 h-4 text-emerald-400"></i>
                <span>🎵 تم اعتماد وفحص رابط الصوت بنجاح!</span>
              </div>
              <span class="text-[10px] bg-emerald-400 text-slate-950 px-2 py-0.5 rounded font-black font-mono shadow">جاهز للروم ⚡</span>
            </div>
            <div class="text-[11px] text-emerald-300 font-mono flex items-center justify-between pt-1 border-t border-emerald-800">
              <span>الصيغة: <b class="text-white">${res.originalFormat || 'AUDIO'}</b></span>
              <span>الرسالة: <b class="text-emerald-300">${res.message}</b></span>
            </div>
          </div>
        `;
        if (window.lucide) lucide.createIcons();
      }
    } else {
      if (input) input.value = url;
      window.updateGiftAudioPreview(url);
    }
  } catch (err) {
    console.warn('Audio url process err:', err);
    if (input) input.value = url;
    window.updateGiftAudioPreview(url);
  }
};

window.handleGiftAudioUpload = async function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const statusContainer = document.getElementById('modalGiftAudioCompressStatus');
  const input = document.getElementById('modalGiftSoundInput');

  const origExt = file.name ? file.name.split('.').pop().toUpperCase() : 'AUDIO';
  const origSizeKB = Math.round(file.size / 1024);
  const origSizeText = origSizeKB > 1024 ? (origSizeKB / 1024).toFixed(1) + ' MB' : origSizeKB + ' KB';

  if (statusContainer) {
    statusContainer.innerHTML = `
      <div class="p-3 rounded-2xl bg-indigo-950 text-white border border-indigo-400 space-y-2">
        <div class="flex items-center justify-between text-xs font-bold">
          <span class="flex items-center gap-2" id="audioUpStepMsg">
            <span class="w-4 h-4 rounded-full border-2 border-indigo-300 border-t-transparent animate-spin shrink-0"></span>
            <span>جاري فحص وتجهيز الملف الصوتي...</span>
          </span>
          <span id="audioUpStepPct" class="font-mono text-amber-300">20%</span>
        </div>
        <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div id="audioUpStepBar" class="bg-gradient-to-r from-indigo-400 to-purple-400 h-2 transition-all duration-300" style="width: 20%"></div>
        </div>
        <div class="text-[10px] text-indigo-200 flex items-center justify-between font-mono pt-1 border-t border-indigo-800">
          <span>الملف: ${file.name}</span>
          <span>الصيغة: ${origExt} (${origSizeText})</span>
        </div>
      </div>
    `;
  }

  try {
    if (window.TarafMediaCompressor && window.TarafMediaCompressor.compressAudioToUltraLight) {
      const res = await window.TarafMediaCompressor.compressAudioToUltraLight(file, {}, (p) => {
        const msg = document.getElementById('audioUpStepMsg');
        const pct = document.getElementById('audioUpStepPct');
        const bar = document.getElementById('audioUpStepBar');
        if (msg) msg.innerHTML = `<span class="w-3.5 h-3.5 rounded-full border-2 border-indigo-300 border-t-transparent animate-spin shrink-0"></span> <span>${p.message}</span>`;
        if (pct) pct.textContent = p.progress + '%';
        if (bar) bar.style.width = p.progress + '%';
      });

      if (input) input.value = res.id;
      window.updateGiftAudioPreview(res.objectUrl || res.id);

      if (statusContainer) {
        statusContainer.innerHTML = `
          <div class="p-2.5 rounded-xl bg-emerald-950 text-emerald-100 border border-emerald-400 font-bold space-y-1 text-xs">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-white font-black">
                <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>
                <span>✅ تم رفع واعتماد الصوت بنجاح (${origExt})!</span>
              </div>
              <span class="text-[10px] bg-emerald-400 text-slate-950 px-2 py-0.5 rounded font-black font-mono shadow">جاهز للروم ⚡</span>
            </div>
            <div class="text-[11px] text-emerald-300 font-mono flex items-center justify-between pt-1 border-t border-emerald-800">
              <span>الصيغة: <b class="text-white">${res.originalFormat} (${res.originalSizeText})</b></span>
              <span>الحالة: <b class="text-emerald-300">محفوظ بمستودع الوسائط الفوري</b></span>
            </div>
          </div>
        `;
        if (window.lucide) lucide.createIcons();
      }
    }
  } catch (err) {
    console.error('Audio upload error:', err);
    if (statusContainer) {
      statusContainer.innerHTML = `<div class="p-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 font-bold text-xs">تعذر معالجة الملف الصوتي. يرجى اختيار ملف MP3 أو WAV صالح.</div>`;
    }
  }
};

window.updateGiftAudioPreview = async function(val) {
  const wrapper = document.getElementById('modalSoundPreviewWrapper');
  const container = document.getElementById('modalSoundPreviewContainer');
  if (!wrapper || !container) return;

  if (!val || val.trim() === '') {
    wrapper.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  wrapper.classList.remove('hidden');

  let playUrl = val;
  if (val.startsWith('idb:') && window.TarafMediaCompressor) {
    playUrl = await window.TarafMediaCompressor.getMediaBlobUrl(val);
  }

  container.innerHTML = `
    <div class="w-full flex flex-col items-center gap-2">
      <audio controls src="${playUrl}" class="w-full max-w-md h-9 rounded-lg outline-none bg-slate-800 text-white" preload="metadata"></audio>
      <div class="text-[10px] text-slate-400 font-mono">🔊 يتم تشغيل هذا الصوت فوراً لجميع أعضاء الروم مع ظهور الهدية والفيديو</div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
};

window.removeGiftSound = function() {
  const input = document.getElementById('modalGiftSoundInput');
  const urlInput = document.getElementById('modalGiftSoundUrlInput');
  const fileInput = document.getElementById('modalGiftAudioFileInput');
  const wrapper = document.getElementById('modalSoundPreviewWrapper');
  const container = document.getElementById('modalSoundPreviewContainer');
  const statusContainer = document.getElementById('modalGiftAudioCompressStatus');

  if (input) input.value = '';
  if (urlInput) urlInput.value = '';
  if (fileInput) fileInput.value = '';
  if (wrapper) wrapper.classList.add('hidden');
  if (container) container.innerHTML = '';
  if (statusContainer) statusContainer.innerHTML = '';
};

// Save Gift Data
window.saveGiftModalData = function(giftId) {
  const nameInput = document.getElementById('modalGiftName');
  const catInput = document.getElementById('modalGiftCategory');
  const priceInput = document.getElementById('modalGiftPrice');
  const animTypeInput = document.getElementById('modalGiftAnimType');
  const iconInput = document.getElementById('modalGiftIconInput');
  const videoInput = document.getElementById('modalGiftVideoInput');
  const soundInput = document.getElementById('modalGiftSoundInput');
  const isRefundableInput = document.getElementById('modalGiftIsRefundable');
  const hasSoundInput = document.getElementById('modalGiftHasSound');
  const renderLayerInput = document.getElementById('modalGiftRenderLayer');
  const placementInput = document.getElementById('modalGiftPlacement');
  const scaleInput = document.getElementById('modalGiftScaleInput');

  const name = nameInput ? nameInput.value.trim() : '';
  const price = priceInput ? parseInt(priceInput.value, 10) : 100;
  const category = catInput ? catInput.value : 'popular';
  const animationType = animTypeInput ? animTypeInput.value : 'fireworks';
  const icon = iconInput ? iconInput.value.trim() : '🎁';
  const animationUrl = videoInput ? videoInput.value.trim() : '';
  const soundEffect = soundInput ? soundInput.value.trim() : '';
  const isRefundable = isRefundableInput ? isRefundableInput.checked : false;
  const hasSound = hasSoundInput ? hasSoundInput.checked : false;
  const renderLayer = renderLayerInput ? renderLayerInput.value : 'behind_mics';
  const placement = placementInput ? placementInput.value : 'bottom';
  const scale = scaleInput ? parseFloat(scaleInput.value) : 1.0;

  if (!name) {
    alert('يرجى كتابة اسم الهدية!');
    return;
  }
  if (!price || price <= 0) {
    alert('يرجى تحديد سعر صحيح بالكوينز!');
    return;
  }

  const allGifts = getRoomGiftsCatalog();

  if (giftId) {
    // Edit existing
    const idx = allGifts.findIndex(g => g.id === giftId);
    if (idx !== -1) {
      allGifts[idx] = {
        ...allGifts[idx],
        name,
        price,
        category,
        animationType,
        icon: icon || allGifts[idx].icon,
        animationUrl: animationUrl || undefined,
        videoUrl: animationUrl || allGifts[idx].videoUrl,
        soundEffect: soundEffect || undefined,
        isRefundable,
        hasSound,
        renderLayer,
        placement,
        scale,
        isCustom: true,
      };
    }
  } else {
    // Add new
    const newId = 'gift_custom_' + Date.now();
    let bgGradient = 'from-amber-500/25 to-yellow-500/10';
    if (category === 'popular' || category === 'trending') bgGradient = 'from-rose-500/25 to-pink-500/10';
    if (category === 'super' || category === 'fun') bgGradient = 'from-purple-600/30 to-indigo-500/15';
    if (category === 'refundable') bgGradient = 'from-emerald-500/25 to-teal-500/10';

    allGifts.unshift({
      id: newId,
      name,
      price,
      icon: icon || '🎁',
      category,
      bgGradient,
      animationType,
      animationUrl: animationUrl || undefined,
      videoUrl: animationUrl || undefined,
      soundEffect: soundEffect || undefined,
      isRefundable,
      hasSound,
      renderLayer,
      placement,
      scale,
      isCustom: true,
    });
  }

  saveRoomGiftsCatalog(allGifts);

  // Close modal
  const modal = document.getElementById('giftCMSModal');
  if (modal) modal.remove();

  // Re-render
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderGiftsCatalogView(container);

  // Notify success
  window.showAdminNotification ? window.showAdminNotification('تم حفظ الهدية وتحديث صندوق الروم بنجاح! 🎁', 'success') : alert('تم حفظ الهدية وتحديث صندوق الروم بنجاح! 🎁');
};

// ==========================================
// MANAGE CATEGORIES MODAL (إدارة الأقسام ديناميكياً)
// ==========================================
window.openManageCategoriesModal = function() {
  const existing = document.getElementById('giftCategoriesModal');
  if (existing) existing.remove();

  const categories = getGiftCategories();
  const allGifts = getRoomGiftsCatalog();

  const modalHtml = `
    <div id="giftCategoriesModal" class="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div class="bg-white rounded-3xl border-2 border-slate-300 max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 my-8">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b-2 border-slate-200 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">📑</span>
            <div>
              <h3 class="text-base font-black text-slate-950">إدارة وتعديل أقسام الهدايا</h3>
              <p class="text-xs text-slate-500">يمكنك إضافة أقسام جديدة، تعديل الأسماء والأيقونات، أو حذف أي قسم بسهولة</p>
            </div>
          </div>
          <button onclick="document.getElementById('giftCategoriesModal').remove()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Add New Category Form -->
        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
          <div class="font-black text-emerald-950 text-xs flex items-center gap-1.5">
            <i data-lucide="plus-circle" class="w-4 h-4 text-emerald-700"></i>
            <span>إضافة قسم هدايا جديد</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">اسم القسم (مثال: نادرة)</label>
              <input type="text" id="newCatName" placeholder="اسم القسم" class="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">رمز الأيقونة (إيموجي)</label>
              <input type="text" id="newCatIcon" placeholder="مثال: ✨ أو 🎁" class="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 text-center outline-none focus:border-emerald-500" />
            </div>
            <div class="flex items-end">
              <button 
                type="button" 
                onclick="window.addNewGiftCategory()" 
                class="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>إضافة القسم</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Categories List -->
        <div class="space-y-2 max-h-[50vh] overflow-y-auto pl-1 pr-1">
          <div class="text-xs font-black text-slate-800 flex items-center justify-between pb-1 border-b border-slate-200">
            <span>الأقسام الحالية المتاحة (${categories.length})</span>
            <button 
              type="button" 
              onclick="window.resetGiftCategoriesToDefault()" 
              class="text-[11px] text-amber-700 hover:text-amber-800 hover:underline font-bold cursor-pointer flex items-center gap-1">
              <i data-lucide="rotate-ccw" class="w-3 h-3"></i>
              <span>استعادة الأقسام الافتراضية الأصلية</span>
            </button>
          </div>

          <div class="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            ${categories.map((cat, idx) => {
              const count = allGifts.filter(g => g.category === cat.id).length;
              return `
                <div class="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                  <div class="flex items-center gap-2.5 flex-1 min-w-0">
                    <span class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0 border border-slate-200">
                      ${cat.icon || '🎁'}
                    </span>
                    <div class="min-w-0">
                      <div class="font-black text-slate-950 text-xs flex items-center gap-2">
                        <span id="catNameText_${cat.id}">${cat.name}</span>
                        <span class="px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200">
                          ${count} هدايا
                        </span>
                      </div>
                      <div class="text-[10px] font-mono text-slate-400">ID: ${cat.id}</div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-1.5 shrink-0">
                    <button 
                      type="button" 
                      onclick="window.promptEditCategory('${cat.id}')" 
                      class="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition cursor-pointer flex items-center gap-1">
                      <i data-lucide="edit-2" class="w-3 h-3"></i>
                      <span>تعديل</span>
                    </button>

                    <button 
                      type="button" 
                      onclick="window.deleteGiftCategory('${cat.id}')" 
                      class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs transition cursor-pointer"
                      title="حذف هذا القسم">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-3 border-t border-slate-200 flex justify-end">
          <button 
            type="button" 
            onclick="document.getElementById('giftCategoriesModal').remove()" 
            class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition cursor-pointer">
            إغلاق وتم
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  if (window.lucide) lucide.createIcons();
};

window.addNewGiftCategory = function() {
  const nameInput = document.getElementById('newCatName');
  const iconInput = document.getElementById('newCatIcon');
  if (!nameInput) return;

  const name = nameInput.value.trim();
  const icon = iconInput ? (iconInput.value.trim() || '🎁') : '🎁';

  if (!name) {
    alert('يرجى كتابة اسم القسم!');
    return;
  }

  const categories = getGiftCategories();
  const id = 'cat_' + Date.now().toString(36);

  categories.push({
    id,
    name,
    icon,
    color: 'emerald'
  });

  saveGiftCategories(categories);

  // Refresh modals & view
  window.openManageCategoriesModal();
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderGiftsCatalogView(container);

  window.showAdminNotification ? window.showAdminNotification(`تمت إضافة قسم "${name}" بنجاح! 📑`, 'success') : alert(`تمت إضافة قسم "${name}" بنجاح! 📑`);
};

window.promptEditCategory = function(catId) {
  const categories = getGiftCategories();
  const cat = categories.find(c => c.id === catId);
  if (!cat) return;

  const newName = prompt('أدخل الاسم الجديد للقسم:', cat.name);
  if (newName === null) return;
  const trimmedName = newName.trim();
  if (!trimmedName) {
    alert('اسم القسم لا يمكن أن يكون فارغاً!');
    return;
  }

  const newIcon = prompt('أدخل رمز الأيقونة (إيموجي):', cat.icon || '🎁');
  if (newIcon !== null) {
    cat.icon = newIcon.trim() || cat.icon;
  }
  cat.name = trimmedName;

  saveGiftCategories(categories);

  // Refresh
  window.openManageCategoriesModal();
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderGiftsCatalogView(container);

  window.showAdminNotification ? window.showAdminNotification(`تم تعديل قسم "${cat.name}" بنجاح!`, 'success') : alert(`تم تعديل قسم "${cat.name}" بنجاح!`);
};

window.deleteGiftCategory = function(catId) {
  const categories = getGiftCategories();
  if (categories.length <= 1) {
    alert('لا يمكن حذف القسم الأخير! يجب الإبقاء على قسم واحد على الأقل.');
    return;
  }

  const cat = categories.find(c => c.id === catId);
  if (!cat) return;

  if (!confirm(`هل أنت متأكد من حذف قسم "${cat.name}"؟\nسيتم نقل أي هدايا تابعة لهذا القسم تلقائياً إلى القسم الأول المتاح.`)) {
    return;
  }

  const remaining = categories.filter(c => c.id !== catId);
  const fallbackCatId = remaining[0].id;

  // Re-map any gifts belonging to deleted category
  const allGifts = getRoomGiftsCatalog();
  let updatedGiftsCount = 0;
  allGifts.forEach(g => {
    if (g.category === catId) {
      g.category = fallbackCatId;
      updatedGiftsCount++;
    }
  });

  saveRoomGiftsCatalog(allGifts);
  saveGiftCategories(remaining);

  if (window._giftsCatalogFilter && window._giftsCatalogFilter.category === catId) {
    window._giftsCatalogFilter.category = 'all';
  }

  // Refresh
  window.openManageCategoriesModal();
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderGiftsCatalogView(container);

  window.showAdminNotification ? window.showAdminNotification(`تم حذف قسم "${cat.name}" ونقل الهدايا بنجاح!`, 'info') : alert(`تم حذف قسم "${cat.name}" ونقل الهدايا بنجاح!`);
};

window.resetGiftCategoriesToDefault = function() {
  if (!confirm('هل أنت متأكد من استعادة الأقسام السبعة الافتراضية الأصلية كما في صور التطبيق؟')) {
    return;
  }

  saveGiftCategories([...DEFAULT_GIFT_CATEGORIES]);

  // Refresh
  window.openManageCategoriesModal();
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderGiftsCatalogView(container);

  window.showAdminNotification ? window.showAdminNotification('تمت استعادة الأقسام الافتراضية السبعة بنجاح! 🔄', 'success') : alert('تمت استعادة الأقسام الافتراضية السبعة بنجاح! 🔄');
};

// Delete Gift
window.deleteGiftFromCatalog = function(giftId) {
  const allGifts = getRoomGiftsCatalog();
  const gift = allGifts.find(g => g.id === giftId);
  if (!gift) return;

  if (!confirm(`هل أنت متأكد من حذف هدية "${gift.name}" من صندوق الروم؟`)) {
    return;
  }

  const updated = allGifts.filter(g => g.id !== giftId);
  saveRoomGiftsCatalog(updated);

  const container = document.getElementById('dynamicViewContainer');
  if (container) renderGiftsCatalogView(container);

  window.showAdminNotification ? window.showAdminNotification(`تم حذف هدية "${gift.name}" من الصندوق بنجاح!`, 'info') : alert(`تم حذف هدية "${gift.name}" من الصندوق بنجاح!`);
};

// Reset to Default
window.resetRoomGiftsToDefault = function() {
  if (!confirm('هل تريد استعادة قائمة الهدايا الافتراضية الأصلية؟ سيتم إرجاع جميع الهدايا القياسية.')) {
    return;
  }

  saveRoomGiftsCatalog([...DEFAULT_ROOM_GIFTS_DATA]);
  const container = document.getElementById('dynamicViewContainer');
  if (container) renderGiftsCatalogView(container);

  window.showAdminNotification ? window.showAdminNotification('تمت استعادة الهدايا الافتراضية بنجاح! 🔄', 'success') : alert('تمت استعادة الهدايا الافتراضية بنجاح! 🔄');
};

// Preview Video / Animation in Modal
window.openPreviewGiftVideoModal = async function(giftId) {
  const allGifts = getRoomGiftsCatalog();
  const gift = allGifts.find(g => g.id === giftId);
  if (!gift) return;

  const existing = document.getElementById('giftVideoPreviewModal');
  if (existing) existing.remove();

  const isImage = typeof gift.icon === 'string' && (gift.icon.startsWith('data:') || gift.icon.startsWith('http') || gift.icon.startsWith('blob:'));

  let resolvedVideoUrl = gift.animationUrl || '';
  if (resolvedVideoUrl.startsWith('idb:') && window.TarafMediaCompressor) {
    resolvedVideoUrl = await window.TarafMediaCompressor.getMediaBlobUrl(resolvedVideoUrl);
  }

  let resolvedSoundUrl = gift.soundEffect || '';
  if (resolvedSoundUrl.startsWith('idb:') && window.TarafMediaCompressor) {
    resolvedSoundUrl = await window.TarafMediaCompressor.getMediaBlobUrl(resolvedSoundUrl);
  }

  const isVideo = resolvedVideoUrl && (
    resolvedVideoUrl.startsWith('blob:') ||
    resolvedVideoUrl.startsWith('data:video/') ||
    resolvedVideoUrl.endsWith('.mp4') ||
    resolvedVideoUrl.endsWith('.webm') ||
    resolvedVideoUrl.endsWith('.mov') ||
    resolvedVideoUrl.includes('video')
  );

  const isAnimatedImg = resolvedVideoUrl && (
    resolvedVideoUrl.endsWith('.gif') ||
    resolvedVideoUrl.endsWith('.webp') ||
    resolvedVideoUrl.startsWith('data:image/') ||
    resolvedVideoUrl.startsWith('http')
  );

  const modalHtml = `
    <div id="giftVideoPreviewModal" class="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none" dir="rtl">
      <div class="relative bg-gradient-to-b from-slate-900 to-purple-950 rounded-3xl border-2 border-amber-400/80 p-6 shadow-[0_0_50px_rgba(234,179,8,0.3)] max-w-lg w-full text-center space-y-4 text-white animate-in zoom-in-95 duration-200">
        
        <!-- Close Button -->
        <button onclick="document.getElementById('giftVideoPreviewModal').remove()" class="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>

        <!-- Top Header Info -->
        <div class="flex items-center justify-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-white/10 border border-amber-300 flex items-center justify-center text-3xl shadow overflow-hidden">
            ${isImage ? `<img src="${gift.icon}" class="w-9 h-9 object-contain" />` : `<span>${gift.icon}</span>`}
          </div>
          <div class="text-right">
            <h3 class="text-base font-black text-amber-300">${gift.name}</h3>
            <div class="text-xs font-mono font-bold text-amber-400">${Number(gift.price).toLocaleString()} 🪙</div>
          </div>
        </div>

        <!-- Video / Animation Stage -->
        <div class="w-full min-h-[260px] max-h-[360px] rounded-2xl bg-black/50 border border-amber-400/30 flex items-center justify-center p-3 overflow-hidden">
          ${isVideo ? `
            <video src="${resolvedVideoUrl}" autoplay loop playsinline controls class="w-full h-full max-h-[320px] object-contain rounded-xl"></video>
          ` : isAnimatedImg ? `
            <img src="${resolvedVideoUrl}" class="w-full max-h-[300px] object-contain animate-bounce" />
          ` : `
            <div class="flex flex-col items-center justify-center py-8 space-y-3">
              <div class="text-7xl animate-bounce filter drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]">
                ${isImage ? `<img src="${gift.icon}" class="w-24 h-24 object-contain" />` : gift.icon}
              </div>
              <div class="text-sm font-black text-amber-300">قالب التحريك: ${gift.animationType || 'fireworks'}</div>
              <div class="text-xs text-purple-200 font-bold">تأثير ملء الشاشة الملكي عند إرسال الهدية في الروم ✨</div>
            </div>
          `}
        </div>

        ${resolvedSoundUrl ? `
          <div class="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-400/50 flex items-center justify-between gap-2 text-xs">
            <span class="flex items-center gap-1.5 text-indigo-200 font-bold">
              <i data-lucide="volume-2" class="w-4 h-4 text-emerald-400"></i>
              <span>صوت الهدية المرفق 🔊:</span>
            </span>
            <audio controls src="${resolvedSoundUrl}" class="h-8 max-w-[240px] outline-none"></audio>
          </div>
        ` : ''}

        <!-- Action inside modal -->
        <div class="flex items-center justify-between pt-2">
          <button 
            type="button" 
            onclick="window.testSendGift('${gift.id}'); document.getElementById('giftVideoPreviewModal').remove();" 
            class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs cursor-pointer shadow-md transition hover:scale-102 flex items-center justify-center gap-2">
            <i data-lucide="send" class="w-4 h-4"></i>
            <span>إرسال تجريبي ومحاكاة البث بالروم 🚀</span>
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  if (window.lucide) lucide.createIcons();
};

// Test Send Gift
window.testSendGift = async function(giftId) {
  const allGifts = getRoomGiftsCatalog();
  const gift = allGifts.find(g => g.id === giftId);
  if (!gift) return;

  let resolvedAnimUrl = gift.animationUrl || '';
  if (resolvedAnimUrl.startsWith('idb:') && window.TarafMediaCompressor) {
    const blobUrl = await window.TarafMediaCompressor.getMediaBlobUrl(resolvedAnimUrl);
    if (blobUrl) resolvedAnimUrl = blobUrl;
  }

  let resolvedSoundUrl = gift.soundEffect || '';
  if (resolvedSoundUrl.startsWith('idb:') && window.TarafMediaCompressor) {
    const blobUrl = await window.TarafMediaCompressor.getMediaBlobUrl(resolvedSoundUrl);
    if (blobUrl) resolvedSoundUrl = blobUrl;
  }

  const broadcastGift = {
    ...gift,
    animationUrl: resolvedAnimUrl,
    soundEffect: resolvedSoundUrl || undefined,
  };

  // Broadcast to main app / room if open
  if (window.top && window.top !== window) {
    window.top.postMessage({
      type: 'TEST_GIFT_SEND',
      gift: broadcastGift,
      senderName: 'الإدارة الملكية 👑',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      recipientLabel: 'جميع أعضاء الروم ✨',
    }, '*');
  }

  // Also dispatch window custom event
  window.dispatchEvent(new CustomEvent('taraf_test_gift_send', {
    detail: {
      type: 'TEST_GIFT_SEND',
      gift: broadcastGift,
      senderName: 'الإدارة الملكية 👑',
      recipientLabel: 'جميع أعضاء الروم ✨',
    }
  }));

  // Admin toast
  window.showAdminNotification ? 
    window.showAdminNotification(`🚀 تم إرسال هدية "${gift.name}" تجريبياً إلى الروم المباشر!`, 'success') : 
    alert(`🚀 تم إرسال هدية "${gift.name}" تجريبياً إلى الروم المباشر!`);
};

// =========================================================================
// VIEW 7: COMPLAINTS & BANS (الشكاوي والحظر)
// =========================================================================
function renderComplaintsBansView(container) {
  container.innerHTML = `
    <div class="space-y-4">
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div class="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
          <div>
            <h2 class="text-base font-black text-slate-950">مركز الشكاوى والتقارير الأمنية</h2>
            <p class="text-xs text-slate-700 font-bold">بلاغات المستخدمين الواردة من الغرف الصوتية والمحادثات الخاصة</p>
          </div>
          <span class="px-3 py-1 rounded-xl bg-rose-100 text-rose-900 border border-rose-300 font-black text-xs">${complaints.length} بلاغات نشطة</span>
        </div>

        <div class="space-y-2">
          ${complaints.map(c => `
            <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span class="font-black text-xs text-slate-950 block">من: ${c.reporter} ضد ${c.target}</span>
                <span class="text-xs text-rose-800 font-bold block mt-0.5">${c.reason}</span>
                <span class="text-[11px] text-slate-600 font-bold">${c.date}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-950 text-xs font-black">${c.status}</span>
                <button onclick="alert('تم اتخاذ الإجراء التأديبي اللازم!')" class="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition cursor-pointer shadow-xs">حظر المخالف</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// =========================================================================
// VIEW 8: COINS & RECHARGE (نظام الكونزات والشحن المالي المركزي ومزامنة الرصيد الحقيقي)
// =========================================================================
function renderCoinsRechargeView(container) {
  const currentAppCoins = Number(localStorage.getItem('super_legend_coins') || '100000');
  const conversionRate = settings.diamondConversionRate || 10;

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Top Live Recharge & Direct Balance Synchronization Box -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div class="flex items-center gap-2">
              <span class="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-black"><i data-lucide="coins" class="w-4 h-4"></i></span>
              <h2 class="text-base font-black text-slate-950">شحن فوري ومزامنة رصيد الحسابات السحابي</h2>
            </div>
            <p class="text-xs text-slate-600 font-bold mt-1">يتم تطبيق وتحديث الرصيد الفعلي في قاعدة البيانات وتطبيق الجوال فورياً دون تأخير</p>
          </div>
          <div class="flex items-center gap-2 bg-amber-50 border border-amber-300 px-3.5 py-2 rounded-xl text-xs">
            <span class="text-slate-700 font-bold">الرصيد الفعلي لتطبيق الجوال:</span>
            <span id="currentLiveAppCoinsDisplay" class="font-mono font-black text-amber-900 text-sm">${currentAppCoins.toLocaleString()} 🪙</span>
          </div>
        </div>

        <!-- Form for Instant Direct Recharge -->
        <div class="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div class="sm:col-span-4">
            <label class="block text-xs font-black text-slate-900 mb-1.5">اختر أو أدخل المعرف (ID أو Special ID)</label>
            <div class="relative">
              <input 
                type="text" 
                id="rechargeTargetInput" 
                value="999000" 
                placeholder="أدخل الـ ID مثلاً 999000" 
                class="w-full pl-3 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-950 focus:bg-white focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
              />
              <i data-lucide="user" class="w-4 h-4 text-slate-400 absolute right-2.5 top-3"></i>
            </div>
          </div>

          <div class="sm:col-span-4">
            <label class="block text-xs font-black text-slate-900 mb-1.5">كمية الكوينز المراد شحنها</label>
            <div class="relative">
              <input 
                type="number" 
                id="rechargeAmountInput" 
                value="1000000" 
                min="10000" 
                step="50000" 
                class="w-full pl-3 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-amber-900 focus:bg-white focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
              />
              <i data-lucide="coins" class="w-4 h-4 text-amber-500 absolute right-2.5 top-3"></i>
            </div>
          </div>

          <div class="sm:col-span-4">
            <button 
              id="btnExecuteDirectRecharge"
              onclick="handleExecuteDirectRecharge()"
              class="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black text-xs transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5 border border-amber-400"
            >
              <i data-lucide="zap" class="w-4 h-4 fill-slate-950"></i>
              <span>تنفيذ الشحن الفوري ومزامنة الرصيد ⚡</span>
            </button>
          </div>
        </div>

        <!-- Quick Amount Shortcuts -->
        <div class="mt-3 flex items-center gap-2 flex-wrap text-xs">
          <span class="text-slate-500 font-bold text-[11px]">مبالغ سريعة:</span>
          <button onclick="document.getElementById('rechargeAmountInput').value = '250000'" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 font-mono font-bold text-slate-800 text-[11px] cursor-pointer">+250,000</button>
          <button onclick="document.getElementById('rechargeAmountInput').value = '500000'" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 font-mono font-bold text-slate-800 text-[11px] cursor-pointer">+500,000</button>
          <button onclick="document.getElementById('rechargeAmountInput').value = '1000000'" class="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-300 font-mono font-black text-amber-900 text-[11px] cursor-pointer">+1,000,000 🪙</button>
          <button onclick="document.getElementById('rechargeAmountInput').value = '5000000'" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 font-mono font-bold text-slate-800 text-[11px] cursor-pointer">+5,000,000</button>
          <button onclick="document.getElementById('rechargeAmountInput').value = '10000000'" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 font-mono font-bold text-slate-800 text-[11px] cursor-pointer">+10,000,000 (ملكي)</button>
        </div>
      </div>

      <!-- Currency Conversion & Diamond Pricing Controls -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span class="text-xs font-black text-slate-900 block mb-1">معامل تحويل الماسات إلى كوينزات</span>
          <p class="text-[11px] text-slate-600 font-bold mb-3">القيمة التي يستلمها المذيع عند تحويل أرباحه</p>
          <div class="flex items-center gap-2">
            <input type="number" id="inputDiamondRate" value="${conversionRate}" class="w-24 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold text-xs text-slate-950" />
            <span class="text-xs font-bold text-slate-700">كوينز لكل 1 ماسة 💎</span>
            <button onclick="handleSaveConversionRate()" class="mr-auto px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer">حفظ</button>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span class="text-xs font-black text-slate-900 block mb-1">بونص الشحن المعتمد للوكلاء</span>
          <p class="text-[11px] text-slate-600 font-bold mb-3">نسبة الخصم الإضافية لوكلاء الشحن الرسميين</p>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 font-mono font-black text-xs text-emerald-900">+15% بونص فوري</span>
            <span class="text-[11px] text-slate-500 font-bold">مفعل سحابياً</span>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span class="text-xs font-black text-slate-900 block mb-1">إجمالي الحركات المالية للشحن</span>
          <p class="text-[11px] text-slate-600 font-bold mb-3">إحصائيات إجمالية لعمليات النظام</p>
          <div class="flex items-center justify-between">
            <span class="text-lg font-black text-slate-950 font-mono">18,450,000 🪙</span>
            <span class="text-[11px] px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-bold">اليوم</span>
          </div>
        </div>
      </div>

      <!-- Coin Packages Standard Table -->
      <div id="coinPackagesTableContainer" class="w-full"></div>

      <!-- Live Recharge Audit Records Table -->
      <div id="rechargeLogsTableContainer" class="w-full"></div>

    </div>
  `;

  // Render Coin Packages Table
  window.renderStandardTable(document.getElementById('coinPackagesTableContainer'), {
    tableId: 'coin_packages_table',
    title: 'باقات متجر الكوينزات المعتمدة (Coin Store Packages)',
    subtitle: 'قائمة باقات الشحن الرسمية، الأسعار بالدولار، ونسب البونص المعروضة للمستخدمين',
    icon: 'shopping-bag',
    badge: `${coinPackages.length} باقة`,
    data: coinPackages,
    initialSortKey: 'coins',
    initialSortDir: 'asc',
    columns: [
      { key: 'id', label: 'كود الباقة', sortable: true, isCode: true, align: 'center', width: '90px' },
      { 
        key: 'coins', 
        label: 'كمية الكوينز', 
        sortable: true, 
        render: (val) => `
          <div class="flex items-center gap-1.5 font-mono font-black text-amber-800 text-sm">
            <span>${Number(val).toLocaleString()}</span>
            <span>🪙</span>
          </div>
        ` 
      },
      { 
        key: 'priceUsd', 
        label: 'السعر بالدولار ($)', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="font-mono font-black text-slate-950 text-sm">$${Number(val).toFixed(2)}</span>` 
      },
      { 
        key: 'badge', 
        label: 'الشارة الترويجية', 
        sortable: false, 
        render: (val) => `<span class="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs">${val}</span>` 
      },
      { 
        key: 'bonus', 
        label: 'البونص الإضافي', 
        sortable: false, 
        render: (val) => `<span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-xs">${val}</span>` 
      },
      { 
        key: 'active', 
        label: 'الحالة', 
        sortable: true, 
        align: 'center',
        render: (val) => val 
          ? `<span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-xs">معروض للبيع</span>` 
          : `<span class="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-300 font-black text-xs">مخفي</span>` 
      }
    ],
    primaryAction: {
      label: 'إضافة باقة جديدة',
      icon: 'plus',
      onClick: () => openAddCoinPackageModal()
    },
    rowActions: [
      {
        id: 'toggleActive',
        title: 'تغيير حالة العرض',
        icon: 'eye',
        onClick: (row) => {
          row.active = !row.active;
          saveState();
          renderView('coins_recharge');
        }
      },
      {
        id: 'deletePkg',
        title: 'حذف الباقة',
        icon: 'trash-2',
        className: 'bg-rose-100 text-rose-900 border border-rose-300 hover:bg-rose-200',
        onClick: (row) => {
          if (confirm(`هل تريد بالتأكيد حذف الباقة ${row.id}؟`)) {
            coinPackages = coinPackages.filter(p => p.id !== row.id);
            saveState();
            renderView('coins_recharge');
          }
        }
      }
    ]
  });

  // Filter recharge logs
  const rechargeLogs = auditLogs.filter(l => l.action.includes('RECHARGE') || l.action.includes('COIN'));
  window.renderStandardTable(document.getElementById('rechargeLogsTableContainer'), {
    tableId: 'recharge_logs_table',
    title: 'سجل عمليات الشحن المباشرة المعتمدة (Live Audit Logs)',
    subtitle: 'حركات الشحن المالي المعتمدة المنفذة عبر لوحة الإدارة ومزامنتها الحية',
    icon: 'file-text',
    badge: `${rechargeLogs.length} حركة`,
    data: rechargeLogs.length > 0 ? rechargeLogs : auditLogs.slice(0, 10),
    columns: [
      { key: 'id', label: 'كود العملية', sortable: true, isCode: true, align: 'center', width: '100px' },
      { key: 'user', label: 'المنفذ', sortable: true },
      { key: 'action', label: 'نوع العملية', sortable: true, render: (v) => `<span class="font-mono font-bold text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-800">${v}</span>` },
      { key: 'target', label: 'التفاصيل والمستلم', sortable: false, render: (v) => `<span class="font-black text-slate-950 text-xs">${v}</span>` },
      { key: 'time', label: 'التوقيت', sortable: true, align: 'center', render: (v) => `<span class="text-xs text-slate-500 font-bold">${v}</span>` }
    ]
  });
}

function handleExecuteDirectRecharge() {
  const targetId = (document.getElementById('rechargeTargetInput')?.value || '').trim();
  const amount = Number(document.getElementById('rechargeAmountInput')?.value || '0');

  if (!targetId) {
    alert('الرجاء إدخال المعرف ID للمستخدم المستهدف');
    return;
  }
  if (!amount || isNaN(amount) || amount <= 0) {
    alert('الرجاء إدخال كمية كوينز صحيحة أكبر من الصفر');
    return;
  }

  let u = users.find(x => String(x.id) === targetId || x.specialId === targetId || x.specialId === targetId.replace('#', ''));
  if (u) {
    u.coins = (u.coins || 0) + amount;
  }

  if (targetId === '999000' || targetId === '1' || (u && (u.specialId === '999000' || u.id === 1))) {
    const current = Number(localStorage.getItem('super_legend_coins') || '100000');
    const nextCoins = current + amount;
    localStorage.setItem('super_legend_coins', String(nextCoins));
  }

  saveState();

  auditLogs.unshift({
    id: `REC-${Date.now().toString().slice(-5)}`,
    user: 'superadmin (naz)',
    action: 'LIVE_RECHARGE',
    target: `Charged ${amount.toLocaleString()} 🪙 to ID #${targetId}`,
    time: 'الآن'
  });
  saveState();

  alert(`✅ تم تنفيذ الشحن الفوري لـ #${targetId} بمقدار ${amount.toLocaleString()} كوينز!\nتمت المزامنة السحابية الحية مع تطبيق الجوال بنجاح ⚡`);
  renderView('coins_recharge');
}

function handleSaveConversionRate() {
  const rate = Number(document.getElementById('inputDiamondRate')?.value || '10');
  if (rate > 0) {
    settings.diamondConversionRate = rate;
    saveState();
    alert(`تم حفظ معدل التحويل: 1 ماسة = ${rate} كوينز بنجاح!`);
  }
}

function openAddCoinPackageModal() {
  const coinsStr = prompt('كمية الكوينز للباقة:', '2000000');
  if (!coinsStr || isNaN(Number(coinsStr))) return;
  const priceStr = prompt('السعر بالدولار ($):', '179.99');
  if (!priceStr || isNaN(Number(priceStr))) return;
  const badge = prompt('الشارة الترويجية (اختياري):', 'عرض مميز ⚡') || 'باقة معتمدة';
  const bonus = prompt('نسبة البونص (اختياري):', '+12% مجاناً') || '+10%';

  coinPackages.push({
    id: `PKG-${coinPackages.length + 1}`,
    coins: Number(coinsStr),
    priceUsd: Number(priceStr),
    badge: badge,
    bonus: bonus,
    active: true
  });
  saveState();
  renderView('coins_recharge');
}

// =========================================================================
// VIEW 9: STAFF MANAGEMENT (طاقم الإدارة والصلاحيات ونظام المشرفين - RBAC)
// =========================================================================
function renderStaffManagementView(container) {
  window.renderStandardTable(container, {
    tableId: 'admin_staff_table',
    title: 'طاقم الإدارة والصلاحيات المتقدمة (Staff & Permissions)',
    subtitle: 'إدارة حسابات المشرفين، صلاحيات الرقابة، والشحن المالي، والأمان في نظام الأدوار (RBAC)',
    icon: 'user-check',
    badge: `${adminStaff.length} إداري`,
    data: adminStaff,
    initialSortKey: 'id',
    initialSortDir: 'asc',
    columns: [
      { key: 'id', label: 'كود الإداري', sortable: true, isCode: true, align: 'center', width: '90px' },
      { 
        key: 'name', 
        label: 'الاسم والشخصية', 
        sortable: true, 
        render: (val, row) => `
          <div class="inline-flex items-center gap-2 whitespace-nowrap">
            <span class="font-black text-slate-950 text-sm">${val}</span>
            <span class="font-mono text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">@${row.username}</span>
          </div>
        `
      },
      { 
        key: 'role', 
        label: 'الرتبة والدور الإداري', 
        sortable: true, 
        render: (val) => `<span class="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs">${val}</span>` 
      },
      { 
        key: 'permissions', 
        label: 'نطاق الصلاحيات', 
        sortable: false, 
        render: (val) => `<span class="text-xs text-slate-800 font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">${val}</span>` 
      },
      { 
        key: 'status', 
        label: 'الحالة', 
        sortable: true, 
        align: 'center',
        render: (val) => val === 'نشط' 
          ? `<span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-xs">نشط ✓</span>` 
          : `<span class="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-300 font-black text-xs">معلق</span>` 
      },
      { 
        key: 'lastActive', 
        label: 'آخر نشاط', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="text-xs text-slate-500 font-bold font-mono">${val}</span>` 
      }
    ],
    primaryAction: {
      label: 'إضافة إداري جديد',
      icon: 'user-plus',
      onClick: () => openAddStaffModal()
    },
    rowActions: [
      {
        id: 'editPerms',
        title: 'تعديل الصلاحيات',
        icon: 'key',
        onClick: (row) => {
          const perms = prompt(`تعديل صلاحيات ${row.name}:`, row.permissions);
          if (perms) {
            row.permissions = perms;
            saveState();
            renderView('staff_management');
          }
        }
      },
      {
        id: 'toggleStaff',
        title: 'تفعيل / تعليق العضو',
        icon: 'power',
        onClick: (row) => {
          row.status = row.status === 'نشط' ? 'معلق' : 'نشط';
          saveState();
          renderView('staff_management');
        }
      }
    ]
  });
}

function openAddStaffModal() {
  const name = prompt('اسم الإداري الجديد:');
  if (!name) return;
  const role = prompt('المسمى الوظيفي:', 'مشرف غرف ودعم فني') || 'مشرف';
  const username = prompt('اسم المستخدم للدخول:', name.toLowerCase().replace(/\s+/g, '_')) || 'staff_user';
  const permissions = prompt('الصلاحيات:', 'مراقبة الغرف، الشكاوى، بلاغات المحتوى') || 'صلاحيات عامة';

  adminStaff.push({
    id: `ADM-${(adminStaff.length + 1).toString().padStart(2, '0')}`,
    name,
    role,
    username,
    permissions,
    status: 'نشط',
    lastActive: 'الآن'
  });
  saveState();
  renderView('staff_management');
}

// =========================================================================
// VIEW 10: DATABASE BACKUP & SERVER HEALTH (النسخ الاحتياطي والسيرفر)
// =========================================================================
function renderDatabaseBackupView(container) {
  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Server Health & Live Status Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span class="text-xs text-slate-500 font-bold block mb-1">حالة السيرفر وقاعدة البيانات</span>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-sm font-black text-emerald-700">متصل وسليم 100%</span>
          </div>
          <span class="text-[10px] text-slate-400 font-mono mt-1 block">Live Cloud Replica</span>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span class="text-xs text-slate-500 font-bold block mb-1">زمن الاستجابة (Latency)</span>
          <div class="text-lg font-black text-slate-900 font-mono">24 ms</div>
          <span class="text-[10px] text-emerald-600 font-bold">استجابة فائقة السرعة</span>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span class="text-xs text-slate-500 font-bold block mb-1">المستخدمون النشطون حالياً</span>
          <div class="text-lg font-black text-amber-800 font-mono">1,842 مستخدم</div>
          <span class="text-[10px] text-slate-500 font-bold">في الغرف الصوتية والألعاب</span>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span class="text-xs text-slate-500 font-bold block mb-1">تزامن التخزين السحابي</span>
          <div class="text-lg font-black text-indigo-700 font-mono">LocalStorage + Sync</div>
          <span class="text-[10px] text-indigo-600 font-bold">تحديث ثنائي الاتجاه نشط</span>
        </div>
      </div>

      <!-- Database Backups Standard Table Container -->
      <div id="databaseBackupsTableContainer" class="w-full"></div>

    </div>
  `;

  window.renderStandardTable(document.getElementById('databaseBackupsTableContainer'), {
    tableId: 'database_backups_table',
    title: 'سجل النسخ الاحتياطية لقاعدة البيانات (Database Snapshots)',
    subtitle: 'أرشيف النسخ الاحتياطية السحابية الكاملة للتطبيق، الحسابات، الوكالات، والأرصدة المالية',
    icon: 'database',
    badge: `${databaseBackups.length} نسخة مؤمنة`,
    data: databaseBackups,
    initialSortKey: 'date',
    initialSortDir: 'desc',
    columns: [
      { key: 'id', label: 'كود النسخة ID', sortable: true, isCode: true, align: 'center', width: '150px' },
      { 
        key: 'title', 
        label: 'الوصف ونوع النسخة', 
        sortable: true, 
        render: (val) => `<span class="font-black text-slate-950 text-xs">${val}</span>` 
      },
      { 
        key: 'size', 
        label: 'الحجم', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="font-mono font-bold text-slate-700 text-xs">${val}</span>` 
      },
      { 
        key: 'records', 
        label: 'إجمالي السجلات', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-900 border border-sky-200 font-mono font-bold text-xs">${val}</span>` 
      },
      { 
        key: 'date', 
        label: 'تاريخ وتوقيت الإنشاء', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="font-mono text-xs text-slate-600 font-bold">${val}</span>` 
      },
      { 
        key: 'status', 
        label: 'الحالة', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-xs">${val}</span>` 
      }
    ],
    primaryAction: {
      label: 'إنشاء نسخة احتياطية فورية (Snapshot)',
      icon: 'download-cloud',
      onClick: () => handleCreateManualBackup()
    },
    rowActions: [
      {
        id: 'downloadBackup',
        title: 'تحميل ملف النسخة (JSON)',
        icon: 'download',
        onClick: (row) => {
          downloadJson(`Taraf_Chat_Backup_${row.id}`, {
            snapshotId: row.id,
            timestamp: new Date().toISOString(),
            users,
            agencies,
            agencyManagers,
            agencyDelegates,
            agencyBrokers,
            agencyHosts,
            rechargeAgents,
            vips,
            coinPackages,
            settings
          });
        }
      },
      {
        id: 'restoreBackup',
        title: 'استعادة هذه النسخة',
        icon: 'rotate-ccw',
        className: 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200',
        onClick: (row) => {
          if (confirm(`هل أنت متأكد من استعادة النسخة الاحتياطية (${row.title})؟\nسيتم الحفاظ على التناسق ومزامنة البيانات مع السيرفر.`)) {
            alert('تم التحقق من سلامة الأرشيف واستعادة النسخة بنجاح ✓');
          }
        }
      }
    ]
  });
}

function handleCreateManualBackup() {
  const newId = `BCK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;
  const newBackup = {
    id: newId,
    title: `نسخة يدوية فورية - ${new Date().toLocaleDateString('ar-SA')}`,
    size: '48.9 MB',
    records: `${(users.length + agencies.length + auditLogs.length + 14200).toLocaleString()} سجل`,
    date: new Date().toLocaleString('ar-SA'),
    status: 'مكتملة ومؤمنة'
  };
  databaseBackups.unshift(newBackup);
  saveState();
  alert(`تم إنشاء النسخة الاحتياطية بنجاح بنظام اللقطة السريعة Snapshot:\nكود النسخة: ${newId}`);
  renderView('database_backup');
}

// =========================================================================
// VIEW 11: SECURITY BANS (الحظر الأمني الشامل للأجهزة والـ IP ومكافحة الاحتيال)
// =========================================================================
function renderSecurityBansView(container) {
  window.renderStandardTable(container, {
    tableId: 'security_bans_table',
    title: 'نظام الحظر الأمني الشامل (Hardware, IP & Account Ban)',
    subtitle: 'حظر بصمة الأجهزة (Device UUID)، نطاقات الـ IP، وتجميد الحسابات المخالفة تلقائياً',
    icon: 'shield-alert',
    badge: `${securityBans.length} حظر نشط`,
    data: securityBans,
    initialSortKey: 'date',
    initialSortDir: 'desc',
    columns: [
      { key: 'id', label: 'كود الحظر', sortable: true, isCode: true, align: 'center', width: '90px' },
      { 
        key: 'target', 
        label: 'الهدف المقيد', 
        sortable: true, 
        render: (val) => `<span class="font-mono font-black text-rose-900 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg text-xs" dir="ltr">${val}</span>` 
      },
      { 
        key: 'type', 
        label: 'نوع الحظر', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-900 border border-slate-300 font-bold text-xs">${val}</span>` 
      },
      { 
        key: 'reason', 
        label: 'السبب والمخالفة', 
        sortable: false, 
        render: (val) => `<span class="text-xs text-slate-800 font-bold">${val}</span>` 
      },
      { 
        key: 'bannedBy', 
        label: 'المسؤول المنفذ', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="text-xs font-bold text-slate-700">${val}</span>` 
      },
      { 
        key: 'date', 
        label: 'التاريخ', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="font-mono text-xs text-slate-600 font-bold">${val}</span>` 
      },
      { 
        key: 'status', 
        label: 'الحالة', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-300 font-black text-xs">${val}</span>` 
      }
    ],
    primaryAction: {
      label: 'إضافة حظر أمني جديد',
      icon: 'shield-ban',
      onClick: () => openAddSecurityBanModal()
    },
    rowActions: [
      {
        id: 'unban',
        title: 'إلغاء وفك الحظر',
        icon: 'unlock',
        className: 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200',
        onClick: (row) => {
          if (confirm(`هل تريد فك الحظر عن: ${row.target}؟`)) {
            securityBans = securityBans.filter(b => b.id !== row.id);
            saveState();
            renderView('security_bans');
          }
        }
      }
    ]
  });
}

function openAddSecurityBanModal() {
  const target = prompt('الهدف المراد حظره (Device UUID أو عنوان IP أو معرّف ID):');
  if (!target) return;
  const type = prompt('نوع الحظر (حظر جهاز UUID / حظر شبكة IP / حظر حساب):', 'حظر جهاز (UUID)') || 'حظر أمني';
  const reason = prompt('سبب الحظر:', 'مخالفة السياسات ومحاولة احتيال') || 'مخالفة أمنية';

  securityBans.unshift({
    id: `BAN-${Date.now().toString().slice(-4)}`,
    target,
    type,
    reason,
    bannedBy: 'سوبر أدمن (الرقابة)',
    date: new Date().toISOString().slice(0, 10),
    status: 'ساري ومفعل'
  });
  saveState();
  renderView('security_bans');
}

// =========================================================================
// VIEW 9: LEVELS & LEVEL GIFT REPORTS (مستويات المستخدمين)
// =========================================================================
function renderLevelsView(container) {
  window.renderStandardTable(container, {
    tableId: 'user_levels_table',
    title: 'مستويات المستخدمين ونقاط الخبرة (User Levels)',
    subtitle: 'جدول متطلبات المستوى، الشارات الشرفية، ومكافأة الدخول اليومية في قالب قياسي منسق',
    icon: 'award',
    badge: `${userLevels.length} مستويات`,
    data: userLevels,
    initialSortKey: 'level',
    initialSortDir: 'asc',
    columns: [
      { 
        key: 'level', 
        label: 'المستوى', 
        sortable: true, 
        align: 'center', 
        width: '90px',
        render: (val) => `<span class="font-mono font-black text-sky-900 bg-sky-100 border border-sky-300 px-2.5 py-1 rounded-lg text-xs">Lv.${val}</span>` 
      },
      { 
        key: 'title', 
        label: 'اللقب الشرفي', 
        sortable: true, 
        render: (val) => `<span class="font-black text-slate-950 text-sm">${val}</span>` 
      },
      { 
        key: 'exp', 
        label: 'نقاط الخبرة المطلوبة', 
        sortable: true, 
        render: (val) => `<span class="font-mono text-xs font-bold text-slate-700">${val}</span>` 
      },
      { 
        key: 'badge', 
        label: 'الشارة', 
        sortable: false, 
        align: 'center', 
        render: (val) => `<span class="text-lg">${val}</span>` 
      },
      { 
        key: 'dailyBonus', 
        label: 'المكافأة اليومية', 
        sortable: true, 
        render: (val) => `<span class="font-mono font-black text-amber-800 text-xs">${val}</span>` 
      }
    ]
  });
}

function renderLevelGiftReportsView(container) {
  window.renderStandardTable(container, {
    tableId: 'level_gift_reports_table',
    title: 'تقارير إهداء المستويات (Level Gifting Log)',
    subtitle: 'سجل عمليات ترقية وإهداء المستويات ونقاط الخبرة بين المستخدمين في قالب قياسي منسق',
    icon: 'gift',
    badge: `${levelGiftReports.length} تقارير`,
    data: levelGiftReports,
    initialSortKey: 'date',
    initialSortDir: 'desc',
    columns: [
      { key: 'sender', label: 'المرسل', sortable: true, render: (val) => `<span class="font-black text-slate-950 text-sm">${val}</span>` },
      { key: 'receiver', label: 'المستلم', sortable: true, render: (val) => `<span class="font-black text-slate-950 text-sm">${val}</span>` },
      { key: 'giftLevel', label: 'المستوى / الهدية', sortable: true, render: (val) => `<span class="font-bold text-sky-900 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded-lg text-xs">${val}</span>` },
      { key: 'coins', label: 'قيمة الكوينز', sortable: true, render: (val) => `<span class="font-mono font-black text-amber-800 text-sm">${Number(val).toLocaleString()} 🪙</span>` },
      { key: 'date', label: 'التاريخ والتوقيت', sortable: true, render: (val) => `<span class="font-mono text-xs font-bold text-slate-700">${val}</span>` }
    ]
  });
}

// =========================================================================
// VIEW 10: LUCKY BOXES & ROOM CHESTS (صناديق الحظ والغرف والقلادات)
// =========================================================================
function renderLuckyBoxesView(container, tabId) {
  container.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div class="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 class="text-base font-black text-slate-950">صناديق الحظ وصناديق الغرف التفاعلية</h2>
          <p class="text-xs text-slate-700 font-bold">إدارة نسب الفوز وجوائز الرومات الصوتية وسحب الكوينزات</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        ${luckyBoxes.map(b => `
          <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <span class="px-2 py-0.5 rounded font-mono font-black text-[11px] bg-purple-100 text-purple-950 border border-purple-300">${b.id}</span>
            <h3 class="font-black text-sm text-slate-950">${b.title}</h3>
            <span class="text-xs text-slate-700 font-bold block">${b.type}</span>
            <div class="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-mono font-black text-amber-800">
              تكلفة السحب: ${Number(b.cost).toLocaleString()} 🪙
            </div>
            <p class="text-[11px] text-slate-800 font-bold leading-relaxed">الجائزة الكبرى: ${b.topPrize}</p>
            <span class="text-[11px] text-emerald-800 font-black block">نسبة الحظ: ${b.dropRate}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// =========================================================================
// VIEW 11: MONTHLY WINNERS & ARISTOCRACY
// =========================================================================
function renderMonthlyWinnersView(container) {
  container.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div class="border-b border-slate-200 pb-3">
        <h2 class="text-base font-black text-slate-950">ترتيب الفائزين الشهري (Hall of Fame)</h2>
        <p class="text-xs text-slate-700 font-bold">لوحة شرف متصدري الدعم وتوزيع المكافآت الشهرية التلقائية</p>
      </div>

      <div class="space-y-3">
        ${monthlyWinners.map(w => `
          <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${w.rank === 1 ? 'bg-amber-500 text-slate-950 shadow-xs border border-amber-600' : 'bg-slate-200 text-slate-950 border border-slate-300'}">
                #${w.rank}
              </span>
              <div>
                <span class="font-black text-sm text-slate-950 block">${w.name} (#${w.id})</span>
                <span class="text-xs font-mono text-emerald-900 font-black">${w.score}</span>
              </div>
            </div>
            <div class="text-left">
              <span class="px-3 py-1 rounded-xl bg-amber-100 text-amber-950 border border-amber-300 font-black text-xs">${w.reward}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAristocracyView(container) {
  container.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div class="border-b border-slate-200 pb-3">
        <h2 class="text-base font-black text-slate-950">ألقاب ورتب الأرستقراطية الملكية (Aristocracy Titles)</h2>
        <p class="text-xs text-slate-700 font-bold">الرتب الشرفية للنبلاء والملوك ومزايا الغرف والحصانة</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${aristocracy.map(a => `
          <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div class="text-3xl mb-1">${a.badge}</div>
            <h3 class="font-black text-sm text-slate-950">${a.title}</h3>
            <div class="text-xs font-mono font-black text-amber-800">${a.price}</div>
            <p class="text-xs text-slate-800 leading-relaxed font-bold">${a.perks}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// =========================================================================
// VIEW 12: SETTINGS & SUBMENUS (الإعدادات، البنارات، التحديثات، شريط التمرير)
// =========================================================================
function renderSettingsView(container, tabId) {
  if (tabId === 'settings_marquee') {
    container.innerHTML = `
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div class="border-b border-slate-200 pb-3">
          <h2 class="text-base font-black text-slate-950">شريط التمرير الإخباري داخل التطبيق (Marquee Ticker)</h2>
          <p class="text-xs text-slate-700 font-bold">النص المتحرك الذي يظهر في أعلى الغرف الصوتية والشاشة الرئيسية</p>
        </div>
        <textarea id="marqueeInput" rows="4" class="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-sm font-bold text-slate-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500">${settings.marqueeTicker}</textarea>
        <button onclick="saveMarquee()" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-xs">
          حفظ وتحديث الشريط في جميع التطبيقات
        </button>
      </div>
    `;
  } else if (tabId === 'settings_updates') {
    container.innerHTML = `
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div class="border-b border-slate-200 pb-3">
          <h2 class="text-base font-black text-slate-950">إدارة إصدارات وتحديثات التطبيق (App Updates)</h2>
          <p class="text-xs text-slate-700 font-bold">التحكم برقم الإصدار ورابط التحديث المباشر للمستخدمين</p>
        </div>
        <div class="space-y-3 max-w-lg">
          <div>
            <label class="block text-xs font-black text-slate-950 mb-1">رقم الإصدار الأخير:</label>
            <input type="text" id="appVerInput" value="${settings.updates.appVersion}" class="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-950 focus:bg-white">
          </div>
          <div>
            <label class="block text-xs font-black text-slate-950 mb-1">رابط ملف APK المباشر:</label>
            <input type="text" id="apkUrlInput" value="${settings.updates.apkUrl}" class="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-950 focus:bg-white" dir="ltr">
          </div>
          <button onclick="alert('تم حفظ إعدادات التحديث السحابي!')" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition cursor-pointer shadow-xs">
            نشر التحديث للمستخدمين
          </button>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div class="border-b border-slate-200 pb-3">
          <h2 class="text-base font-black text-slate-950">البنارات الافتتاحية والصفحات (Banners & CMS)</h2>
          <p class="text-xs text-slate-700 font-bold">إدارة الشرائح الإعلانية والبنارات الترويجية في الشاشة الرئيسية</p>
        </div>
        <div class="space-y-3">
          ${settings.banners.map(b => `
            <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span class="font-black text-sm text-slate-950 block">${b.title}</span>
                <span class="text-xs text-sky-800 font-mono font-bold">${b.link}</span>
              </div>
              <span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-black">معروض حالياً</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

function saveMarquee() {
  const val = document.getElementById('marqueeInput').value.trim();
  settings.marqueeTicker = val;
  saveState();
  alert('تم حفظ ونشر شريط التمرير بنجاح على السيرفر السحابي!');
}

// =========================================================================
// VIEW 13: AUDIT LOGS VIEW (Log viewer)
// =========================================================================
function renderLogsView(container) {
  window.renderStandardTable(container, {
    tableId: 'audit_logs_table',
    title: 'سجل العمليات الإدارية المباشر (Audit Log Viewer)',
    subtitle: 'سجل تدقيق أمني غير قابل للحذف لجميع تحركات المشرفين والسوبر أدمن في قالب قياسي منسق',
    icon: 'activity',
    badge: `${auditLogs.length} سجلات`,
    data: auditLogs,
    initialSortKey: 'time',
    initialSortDir: 'desc',
    columns: [
      { key: 'id', label: 'المعرف', sortable: true, isCode: true, align: 'center', width: '90px' },
      { key: 'user', label: 'المسؤول', sortable: true, render: (val) => `<span class="font-black text-slate-950 text-sm">${val}</span>` },
      { 
        key: 'action', 
        label: 'نوع العملية', 
        sortable: true, 
        align: 'center',
        render: (val) => `<span class="px-2.5 py-1 rounded-lg bg-sky-100 border border-sky-300 text-sky-950 font-black text-xs">${val}</span>` 
      },
      { key: 'target', label: 'التفاصيل والهدف', sortable: true, render: (val) => `<span class="text-xs font-bold text-slate-800">${val}</span>` },
      { key: 'time', label: 'التوقيت', sortable: true, render: (val) => `<span class="font-mono text-xs font-bold text-slate-700">${val}</span>` }
    ]
  });
}

// =========================================================================
// VIEW 14: BUILDABLE LIST & CUSTOM CRUD SECTIONS (قائمة فارغة مجهزة للبناء)
// =========================================================================
const SECTION_CONFIG = {
  'rooms': {
    title: 'إدارة الغرف الصوتية المباشرة (Voice Rooms)',
    subtitle: 'التحكم في الغرف الصوتية المباشرة، المضيفين، الميكروفونات، والمشرفين',
    icon: 'mic',
    singular: 'غرفة صوتية',
    headers: ['معرف الغرفة', 'اسم الغرفة', 'المالك / المضيف', 'التصنيف', 'المتصلين الآن', 'الحالة'],
    initialData: [
      { id: 'ROOM-101', name: 'مجلس الطرب والأنس الخليجي', desc: 'الأمير فهد (990112)', category: 'طرب وموسيقى', value: '42 متصل', status: 'نشطة' },
      { id: 'ROOM-102', name: 'سوالف شباب وشيلات حماس', desc: 'الكابتن ناصر (550881)', category: 'دردشة عامة', value: '28 متصل', status: 'نشطة' },
      { id: 'ROOM-103', name: 'مسابقات وجوائز كوينز كبرى', desc: 'الإدارة الرسمية (1001)', category: 'ألعاب وفعاليات', value: '115 متصل', status: 'نشطة' }
    ]
  },
  'events': {
    title: 'الأحداث والفعاليات الرسمية (Events & Tournaments)',
    subtitle: 'جدول البطولات، المسابقات الأسبوعية، ومهرجانات شحن الكوينز',
    icon: 'calendar',
    singular: 'فعالية جديدة',
    headers: ['المعرف', 'عنوان الفعالية', 'الفترة الزمنية', 'التصنيف', 'المكافأة الكلية', 'الحالة'],
    initialData: [
      { id: 'EVT-2026-1', name: 'كرنفال ربيع غلا الذهبي', desc: '2026/09/01 - 2026/09/10', category: 'مهرجان شحن', value: '50,000,000 كوينز', status: 'نشطة' },
      { id: 'EVT-2026-2', name: 'بطولة لودو الكبرى للفرق', desc: '2026/09/15 - 2026/09/20', category: 'بطولة ألعاب', value: 'كأس + 10M كوينز', status: 'قادمة' }
    ]
  },
  'rewards': {
    title: 'إدارة المكافآت والحوافز (Rewards System)',
    subtitle: 'إعداد مكافآت تسجيل الدخول اليومي، مهام النشاط، ومكافآت الساعات',
    icon: 'award',
    singular: 'مكافأة جديدة',
    headers: ['المعرف', 'اسم المكافأة / المهمة', 'نوع المهمة', 'التصنيف', 'القيمة الممنوحة', 'الحالة'],
    initialData: [
      { id: 'RWD-01', name: 'مكافأة الدخول اليومي (اليوم 7)', desc: 'تسجيل دخول متتالي', category: 'كوينز + إطار', value: '25,000 كوينز', status: 'نشطة' },
      { id: 'RWD-02', name: 'مكافأة إرسال 10 هدايا في الروم', desc: 'مهمة يومية تفاعلية', category: 'نقاط EXP', value: '500 EXP', status: 'نشطة' }
    ]
  },
  'games': {
    title: 'الألعاب التنافسية (Games Management)',
    subtitle: 'إدارة ألعاب لودو، عجلة الحظ السحرية، دومينو، وتحديات الرومات',
    icon: 'gamepad-2',
    singular: 'لعبة جديدة',
    headers: ['المعرف', 'اسم اللعبة', 'نظام اللعب', 'التصنيف', 'الحد الأدنى للدخول', 'الحالة'],
    initialData: [
      { id: 'GAME-01', name: 'لودو سوبر ستار (Ludo Star)', desc: '4 لاعبين / فردي وزوجي', category: 'ألعاب طاولة', value: '5,000 كوينز', status: 'نشطة' },
      { id: 'GAME-02', name: 'عجلة الحظ الذهبية (Lucky Wheel)', desc: 'فردي تفاعلي بالكوينز', category: 'عجلة حظ', value: '1,000 كوينز', status: 'نشطة' },
      { id: 'GAME-03', name: 'صائد الكنوز وسحق الوحوش', desc: 'تحدي جماعي في الروم', category: 'أكشن ومغامرات', value: '10,000 كوينز', status: 'نشطة' }
    ]
  },
  'social': {
    title: 'التواصل الاجتماعي واللحظات (Social & Moments)',
    subtitle: 'إدارة منشورات المستخدمين، الصور، التعليقات، والرقابة التلقائية',
    icon: 'share-2',
    singular: 'منشور / محتوى',
    headers: ['المعرف', 'الناشر', 'محتوى المنشور', 'التصنيف', 'التفاعلات', 'الحالة'],
    initialData: [
      { id: 'SOC-8821', name: 'الملك_سلطان (991204)', desc: 'مرحباً بجميع أعضاء عائلة الملوك في غلا لايف!', category: 'نص وصورة', value: '184 إعجاب • 42 تعليق', status: 'نشطة' },
      { id: 'SOC-8822', name: 'أميرة_الورد (440192)', desc: 'شكراً لكل الداعمين في جولة الـ PK الأسطورية الليلة ❤️', category: 'نص', value: '290 إعجاب • 95 تعليق', status: 'نشطة' }
    ]
  },
  'relationships': {
    title: 'العلاقات والـ CP (Relationships & CP Couples)',
    subtitle: 'إدارة علاقات الشراكة، خواتم الزواج الافتراضي، وشارات الـ CP المميزة',
    icon: 'heart-handshake',
    singular: 'علاقة جديدة',
    headers: ['المعرف', 'الطرف الأول', 'الطرف الثاني', 'نوع العلاقة', 'مستوى الرابطة', 'الحالة'],
    initialData: [
      { id: 'CP-101', name: 'أحمد_الملك (88012)', desc: 'نورا_القمر (77091)', category: 'علاقة حب (CP Love)', value: 'المستوى 12 (خاتم ألماس)', status: 'نشطة' },
      { id: 'CP-102', name: 'صقر_الجزيرة (33091)', desc: 'فارس_الليل (22019)', category: 'صداقة وفية (Besties)', value: 'المستوى 8 (درع الصداقة)', status: 'نشطة' }
    ]
  },
  'families': {
    title: 'عائلات التطبيق والكلانات (Families & Clans)',
    subtitle: 'إدارة العائلات، الرتب، نسب الدعم، ورؤساء الكلانات',
    icon: 'shield',
    singular: 'عائلة جديدة',
    headers: ['معرف العائلة', 'اسم العائلة', 'قائد العائلة', 'التصنيف', 'عدد الأعضاء', 'الحالة'],
    initialData: [
      { id: 'FAM-01', name: 'عائلة الملوك (Royals)', desc: 'الملك_سلطان (991204)', category: 'العائلة الذهبية', value: '180/200 عضو', status: 'نشطة' },
      { id: 'FAM-02', name: 'عائلة النخبة (VIP Elite)', desc: 'الأسطورة_عمر (55112)', category: 'العائلة الفضية', value: '145/200 عضو', status: 'نشطة' }
    ]
  },
  'gifts_catalog': {
    title: 'كتالوج الهدايا وتأثيرات الرومات (Gifts Catalog)',
    subtitle: 'إدارة تصنيفات الهدايا العادية، الفاخرة، الرسوم المتحركة SVGA، ومؤثرات الصوت',
    icon: 'gift',
    singular: 'هدية جديدة',
    headers: ['المعرف', 'اسم الهدية', 'التصنيف', 'نوع التأثير', 'السعر (كوينز)', 'الحالة'],
    initialData: [
      { id: 'GIFT-01', name: 'الصاروخ الفضائي الخارق', desc: 'هدايا سوبر VIP مع صوت', category: 'SVGA Animation', value: '500,000 كوينز', status: 'نشطة' },
      { id: 'GIFT-02', name: 'قلب الحب المتوهج', desc: 'هدايا رومانسية متحركة', category: 'Lottie WebP', value: '10,000 كوينز', status: 'نشطة' },
      { id: 'GIFT-03', name: 'تاج الملوك المرصع بالألماس', desc: 'هدايا الرتب الكبرى ملء الشاشة', category: 'Full Screen FX', value: '1,000,000 كوينز', status: 'نشطة' }
    ]
  },
  'pks': {
    title: 'معارك وتحديات Pks المباشرة (PK Live Battles)',
    subtitle: 'مراقبة جولات التحدي المباشر بين المضيفين، مدة الجولة، وإجمالي نقاط الدعم',
    icon: 'swords',
    singular: 'تحدي PK',
    headers: ['المعرف', 'المضيف الأول (الغرفة 1)', 'المضيف الثاني (الغرفة 2)', 'مدة الجولة', 'النقاط المسجلة', 'الحالة'],
    initialData: [
      { id: 'PK-991', name: 'ماجد_الصوت (غرفة 102)', desc: 'سامي_الوتر (غرفة 108)', category: 'جولة 5 دقائق', value: '1.2M vs 980K نقاط', status: 'مكتملة' },
      { id: 'PK-992', name: 'عبير_الشام (غرفة 205)', desc: 'ريم_الخليج (غرفة 210)', category: 'جولة 10 دقائق', value: 'جارية الآن...', status: 'نشطة' }
    ]
  },
  'medals': {
    title: 'الأوسمة وشارات الشرف (Medals & Honor Badges)',
    subtitle: 'إدارة أوسمة الداعمين، أوسمة النجوم، والشارات التقديرية الحصرية',
    icon: 'medal',
    singular: 'وسام جديد',
    headers: ['المعرف', 'اسم الوسام', 'شروط المنح والاستحقاق', 'فترة الصلاحية', 'حاملي الوسام حالياً', 'الحالة'],
    initialData: [
      { id: 'MDL-01', name: 'وسام صقر غلا الذهبي', desc: 'شحن أكثر من 50 مليون كوينز', category: 'دائم', value: '38 مستخدم', status: 'نشطة' },
      { id: 'MDL-02', name: 'وسام نجم البث التنافسي', desc: 'تحقيق 100 ساعة بث شهرياً', category: '30 يوماً', value: '92 مضيف', status: 'نشطة' }
    ]
  },
  'store': {
    title: 'المتجر والأصول الرقمية (Store & Digital Assets)',
    subtitle: 'إدارة أسعار الثيمات، أرقام الآيدي المميزة، سيارات الدخول، والرتب',
    icon: 'shopping-bag',
    singular: 'منتج جديد بالمتجر',
    headers: ['المعرف', 'اسم العنصر / الأصل', 'القسم / النوع', 'فترة الصلاحية', 'السعر المعروض', 'الحالة'],
    initialData: [
      { id: 'STR-01', name: 'آيدي خماسي مميز (ID: 77777)', desc: 'أرقام نادرة للملف الشخصي', category: 'معرف ملكي', value: '5,000,000 كوينز', status: 'نشطة' },
      { id: 'STR-02', name: 'سيارة لامبورغيني دخول ناري', desc: 'تأثير دخول مميز للرومات', category: 'سيارات فاخرة', value: '2,500,000 كوينز', status: 'نشطة' }
    ]
  },
  'settings_pages': {
    title: 'إدارة الصفحات والشروط (CMS & Legal Pages)',
    subtitle: 'تعديل سياسة الخصوصية، شروط الخدمة، وإرشادات المحتوى والأمان',
    icon: 'file-text',
    singular: 'صفحة جديدة',
    headers: ['المعرف', 'عنوان الصفحة', 'الرابط الدائم (Slug)', 'اللغات المتاحة', 'تاريخ آخر تحديث', 'الحالة'],
    initialData: [
      { id: 'PG-01', name: 'سياسة الخصوصية وأمان البيانات', desc: '/privacy-policy', category: 'العربية / English', value: '2026/09/01', status: 'نشطة' },
      { id: 'PG-02', name: 'شروط وقوانين البث والدردشة', desc: '/terms-of-service', category: 'العربية / English', value: '2026/08/25', status: 'نشطة' }
    ]
  },
  'settings_broadcasts': {
    title: 'الرسائل والإشعارات الرسمية (Official Broadcasts)',
    subtitle: 'إرسال تنبيهات سحابية ورسائل نظام لجميع مستخدمي تطبيق غلا لايف',
    icon: 'send',
    singular: 'إشعار جديد',
    headers: ['المعرف', 'عنوان الإشعار', 'نص الرسالة المرسلة', 'الفئة المستهدفة', 'تاريخ الإرسال', 'الحالة'],
    initialData: [
      { id: 'NOTIF-01', name: 'بدء فعاليات كرنفال الكوينز السنوي', desc: 'ندعوكم للمشاركة في الفعاليات وربح مكافآت ضخمة في الغرف الصوتية!', category: 'جميع المستخدمين', value: '2026/09/03 14:00', status: 'نشطة' }
    ]
  }
};

// Retrieve buildable items for a specific section
function getBuildableItems(tabId) {
  const key = 'sl_buildable_' + tabId;
  const saved = localStorage.getItem(key);
  if (saved !== null) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  const config = SECTION_CONFIG[tabId];
  const initial = config && config.initialData ? config.initialData : [];
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

function saveBuildableItems(tabId, items) {
  localStorage.setItem('sl_buildable_' + tabId, JSON.stringify(items));
}

// Render dynamic buildable view (ملف خاص أو قائمة فارغة مجهزة للبناء عبر القالب القياسي)
function renderBuildableListView(container, tabId) {
  const config = SECTION_CONFIG[tabId] || {
    title: 'قائمة ' + (document.getElementById('currentViewBreadcrumb')?.textContent || tabId),
    subtitle: 'قائمة مخصصة مجهزة للبدء في بنائها وإضافة العناصر والسجلات مباشرة',
    icon: 'layers',
    singular: 'عنصر جديد',
    headers: ['المعرف', 'الاسم / العنوان', 'الوصف / التفاصيل', 'التصنيف', 'القيمة / التاريخ', 'الحالة'],
    initialData: []
  };

  const items = getBuildableItems(tabId);

  window.renderStandardTable(container, {
    tableId: 'tbl_' + tabId,
    title: config.title,
    subtitle: config.subtitle,
    icon: config.icon || 'layers',
    data: items,
    columns: [
      { key: 'id', label: config.headers[0] || 'المعرف', sortable: true, isCode: true, align: 'center', width: '90px' },
      { 
        key: 'name', 
        label: config.headers[1] || 'الاسم / العنوان', 
        sortable: true, 
        render: (val) => `<span class="font-black text-slate-950 text-xs">${val}</span>` 
      },
      { 
        key: 'desc', 
        label: config.headers[2] || 'الوصف / التفاصيل', 
        sortable: false, 
        render: (val) => `<span class="text-slate-700 text-xs font-bold">${val || '-'}</span>` 
      },
      { 
        key: 'category', 
        label: config.headers[3] || 'التصنيف', 
        sortable: true, 
        render: (val) => `<span class="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-950 font-black text-[11px]">${val || 'عام'}</span>` 
      },
      { 
        key: 'value', 
        label: config.headers[4] || 'القيمة / التاريخ', 
        sortable: true,
        render: (val) => `<span class="font-mono font-black text-slate-950">${val || '-'}</span>`
      },
      { 
        key: 'status', 
        label: config.headers[5] || 'الحالة', 
        sortable: true, 
        isStatus: true,
        align: 'center'
      }
    ],
    onAdd: () => openAddBuildableModal(tabId),
    addLabel: 'إضافة ' + (config.singular || 'عنصر جديد'),
    rowActions: [
      {
        id: 'toggle',
        title: 'تغيير الحالة (نشطة / متوقفة)',
        icon: 'refresh-cw',
        className: 'bg-slate-100 text-slate-800 hover:bg-amber-500 hover:text-slate-950 border border-slate-200',
        onClick: (row, idx) => toggleBuildableItemStatus(tabId, idx)
      },
      {
        id: 'delete',
        title: 'حذف العنصر نهائياً',
        icon: 'trash-2',
        className: 'bg-rose-100 text-rose-900 border border-rose-300 hover:bg-rose-600 hover:text-white',
        onClick: (row, idx) => deleteBuildableItem(tabId, idx)
      }
    ],
    onBulkDelete: (ids) => {
      if (confirm(`هل تريد بالتأكيد حذف ${ids.length} عناصر محددة؟`)) {
        let current = getBuildableItems(tabId);
        current = current.filter(item => !ids.includes(item.id));
        saveBuildableItems(tabId, current);
        renderView(tabId);
      }
    },
    customActionsHtml: `
      <button onclick="clearBuildableItems('${tabId}')" class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-800 hover:text-rose-900 border border-slate-200 hover:border-rose-300 font-bold text-xs transition cursor-pointer" title="تفريغ القائمة للبدء من الصفر">
        تفريغ القائمة
      </button>
      <button onclick="resetBuildableItems('${tabId}')" class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs transition cursor-pointer" title="استعادة أمثلة البيانات">
        استعادة أمثلة
      </button>
    `,
    emptyTitle: 'القائمة فارغة ومجهزة بالكامل للبناء',
    emptySubtitle: 'لا توجد عناصر مضافة حتى الآن في هذا القسم. استخدم زر الإضافة أعلاه للبدء في بنائها.'
  });
}

// =========================================================================
// STANDARD UI TABLE SHOWCASE & MASTER REFERENCE (قالب الجدول القياسي الموحد)
// =========================================================================
function renderStandardTableShowcase(container) {
  const showcaseData = [
    { id: 'USR-101', name: 'أحمد القحطاني', email: 'ahmed.q@example.com', role: 'مسؤول نظام', coins: 15400000, diamonds: 24000, joinDate: '2026-01-15', status: 'نشط' },
    { id: 'USR-102', name: 'سارة الشمري', email: 'sara.sh@example.com', role: 'مشرف غرف', coins: 8900000, diamonds: 12500, joinDate: '2026-02-10', status: 'نشط' },
    { id: 'USR-103', name: 'محمد الدوسري', email: 'mohammed.d@example.com', role: 'وكيل معتمد', coins: 42000000, diamonds: 95000, joinDate: '2025-11-20', status: 'نشط' },
    { id: 'USR-104', name: 'ريم العتيبي', email: 'reem.o@example.com', role: 'مستخدم VIP', coins: 3100000, diamonds: 4200, joinDate: '2026-03-01', status: 'قيد المراجعة' },
    { id: 'USR-105', name: 'خالد المطيري', email: 'khaled.m@example.com', role: 'مستخدم عادي', coins: 450000, diamonds: 800, joinDate: '2026-02-28', status: 'متوقفة' },
    { id: 'USR-106', name: 'فيصل الحربي', email: 'faisal.h@example.com', role: 'مشرف فعاليات', coins: 19800000, diamonds: 33000, joinDate: '2025-12-05', status: 'نشط' },
    { id: 'USR-107', name: 'نورة السبيعي', email: 'noura.s@example.com', role: 'مستخدم VIP', coins: 14200000, diamonds: 18000, joinDate: '2026-01-22', status: 'نشط' },
    { id: 'USR-108', name: 'سلطان العنزي', email: 'sultan.e@example.com', role: 'وكيل شحن', coins: 65000000, diamonds: 150000, joinDate: '2025-10-14', status: 'نشط' },
    { id: 'USR-109', name: 'عبير الغامدي', email: 'abeer.g@example.com', role: 'مستخدم عادي', coins: 120000, diamonds: 150, joinDate: '2026-03-02', status: 'قيد المراجعة' },
    { id: 'USR-110', name: 'ياسر الزهراني', email: 'yasser.z@example.com', role: 'مستخدم محظور', coins: 0, diamonds: 0, joinDate: '2026-01-08', status: 'متوقفة' },
    { id: 'USR-111', name: 'مها الشهري', email: 'maha.sh@example.com', role: 'مشرف عام', coins: 28500000, diamonds: 48000, joinDate: '2025-09-30', status: 'نشط' },
    { id: 'USR-112', name: 'بدر الرشيدي', email: 'badr.r@example.com', role: 'مستخدم VIP', coins: 7600000, diamonds: 9100, joinDate: '2026-02-14', status: 'نشط' },
  ];

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Specification & Highlights Banner -->
      <div class="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 shadow-xs">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2.5">
              <span class="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs">
                Standard UI Table Template
              </span>
              <span class="text-xs text-amber-900 font-mono font-black">Standard UI Template</span>
            </div>
            <h1 class="text-xl font-black text-slate-950">
              قالب الجدول القياسي الموحد لصفحات الويب الخارجية (Responsive)
            </h1>
            <p class="text-xs text-slate-700 max-w-3xl leading-relaxed font-bold">
              تم تصميم هذا القالب القياسي هندسياً ليتناسب تلقائياً مع مساحة صفحة الويب الخارجية بدون حواف مقطوعة، مع توفير تجربة بصرية مريحة واحترافية:
              عناوين بارزة مع فرز تلقائي، مسافات مريحة للصفوف، شريط بحث فوري، أزرار تحكم جماعية، ترقيم قياسي، وأزرار عمليات موحدة.
            </p>
          </div>

          <!-- Quick Metrics -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
              <span class="block text-[11px] text-slate-600 font-bold">التنسيق</span>
              <span class="text-sm font-black text-emerald-800">Responsive 100%</span>
            </div>
            <div class="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
              <span class="block text-[11px] text-slate-600 font-bold">المسافات (Padding)</span>
              <span class="text-sm font-black text-amber-800">14px - 16px</span>
            </div>
            <div class="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
              <span class="block text-[11px] text-slate-600 font-bold">الترتيب والفرز</span>
              <span class="text-sm font-black text-sky-800">ثنائي الاتجاه (⇅)</span>
            </div>
            <div class="p-3 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
              <span class="block text-[11px] text-slate-600 font-bold">إمكانية الاستخدام</span>
              <span class="text-sm font-black text-purple-800">جميع الأقسام</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Standard Table Instance -->
      <div id="standardDemoTableContainer" class="w-full"></div>

      <!-- Architectural Guidelines & Integration Card -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
          <div class="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-900 flex items-center justify-center font-black">
            <i data-lucide="maximize-2" class="w-4 h-4"></i>
          </div>
          <h3 class="font-black text-sm text-slate-950">التوافق التلقائي (Responsive Auto-Fit)</h3>
          <p class="text-xs text-slate-700 leading-relaxed font-bold">
            الجدول يتمدد تلقائياً ليشغل 100% من عرض مساحة العمل، ويتكيف فوراً عند فتح أو إغلاق القائمة الجانبية أو عند تدوير وتغيير حجم الشاشة.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
          <div class="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-900 flex items-center justify-center font-black">
            <i data-lucide="arrow-up-down" class="w-4 h-4"></i>
          </div>
          <h3 class="font-black text-sm text-slate-950">العناوين البارزة والترتيب (Sorting)</h3>
          <p class="text-xs text-slate-700 leading-relaxed font-bold">
            عناوين واضحة بخط عريض، مع إمكانية النقر على أي رأس عمود للترتيب تصاعدياً أو تنازلياً مع ظهور أيقونة اتجاه السهم بوضوح.
          </p>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
          <div class="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-900 flex items-center justify-center font-black">
            <i data-lucide="sliders" class="w-4 h-4"></i>
          </div>
          <h3 class="font-black text-sm text-slate-950">أزرار التحكم والتنقل (Controls & Pagination)</h3>
          <p class="text-xs text-slate-700 leading-relaxed font-bold">
            شريط بحث مباشر وسريع، أزرار تصدير JSON/CSV، اختيار عدد العناصر المعروضة (5, 10, 25, 50, 100)، وتنقل سلس بين الصفحات.
          </p>
        </div>

      </div>

    </div>
  `;

  // Render the demo table
  window.renderStandardTable(document.getElementById('standardDemoTableContainer'), {
    tableId: 'demo_standard_table',
    title: 'جدول المستخدمين القياسي الموحد (Live Standard Table)',
    subtitle: 'نموذج تطبيقي حي للقالب القياسي الموحد بكامل خصائص الفرز، البحث، الإجراءات، والترقيم',
    icon: 'users',
    badge: 'Standard Template v1.0',
    data: showcaseData,
    initialSortKey: 'coins',
    initialSortDir: 'desc',
    columns: [
      { key: 'id', label: 'المعرف ID', sortable: true, isCode: true, align: 'center', width: '90px' },
      { 
        key: 'name', 
        label: 'الاسم والمستخدم', 
        sortable: true, 
        render: (val, row) => `
          <div class="inline-flex items-center gap-2 whitespace-nowrap">
            <span class="font-black text-slate-950 text-xs">${val}</span>
            <span class="text-[11px] text-slate-600 font-bold">(${row.email})</span>
          </div>
        ` 
      },
      { 
        key: 'role', 
        label: 'الرتبة / الدور', 
        sortable: true, 
        render: (val) => `<span class="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-950 font-black text-[11px]">${val}</span>` 
      },
      { 
        key: 'coins', 
        label: 'رصيد الكوينز', 
        sortable: true, 
        render: (val) => `
          <div class="flex items-center gap-1.5 font-mono font-black text-amber-800 text-xs">
            <span>${Number(val).toLocaleString()}</span>
            <span>🪙</span>
          </div>
        ` 
      },
      { 
        key: 'diamonds', 
        label: 'الماس', 
        sortable: true, 
        render: (val) => `
          <div class="flex items-center gap-1.5 font-mono font-black text-sky-800 text-xs">
            <span>${Number(val).toLocaleString()}</span>
            <span>💎</span>
          </div>
        ` 
      },
      { 
        key: 'joinDate', 
        label: 'تاريخ الانضمام', 
        sortable: true, 
        render: (val) => `<span class="font-mono text-slate-700 font-bold text-xs">${val}</span>` 
      },
      { 
        key: 'status', 
        label: 'حالة الحساب', 
        sortable: true, 
        isStatus: true, 
        align: 'center' 
      }
    ],
    rowActions: [
      {
        id: 'view',
        title: 'عرض بيانات المستخدم',
        icon: 'eye',
        className: 'bg-slate-100 border border-slate-200 text-slate-950 hover:bg-slate-200',
        onClick: (row) => alert(`تفاصيل المستخدم:\nالاسم: ${row.name}\nالمعرف: ${row.id}\nالبريد: ${row.email}\nالرتبة: ${row.role}\nالرصيد: ${row.coins.toLocaleString()} كوينز`)
      },
      {
        id: 'edit',
        title: 'تعديل البيانات والرصيد',
        icon: 'pencil',
        className: 'bg-sky-100 border border-sky-300 text-sky-950 hover:bg-sky-200',
        onClick: (row) => {
          const newCoins = prompt(`تعديل رصيد كوينز ${row.name}:`, row.coins);
          if (newCoins && !isNaN(newCoins)) {
            row.coins = Number(newCoins);
            renderStandardTableShowcase(container);
          }
        }
      },
      {
        id: 'toggle',
        title: 'تبديل الحالة',
        icon: 'refresh-cw',
        className: 'bg-amber-100 border border-amber-300 text-amber-950 hover:bg-amber-200',
        onClick: (row) => {
          row.status = row.status === 'نشط' ? 'متوقفة' : 'نشط';
          renderStandardTableShowcase(container);
        }
      },
      {
        id: 'delete',
        title: 'حذف السجل',
        icon: 'trash-2',
        className: 'bg-rose-100 border border-rose-300 text-rose-950 hover:bg-rose-600 hover:text-white',
        onClick: (row, idx) => {
          if (confirm(`هل تريد بالتأكيد حذف ${row.name}؟`)) {
            showcaseData.splice(idx, 1);
            renderStandardTableShowcase(container);
          }
        }
      }
    ],
    onAdd: () => {
      const name = prompt('أدخل اسم المستخدم الجديد:');
      if (!name) return;
      const coins = prompt('أدخل رصيد الكوينز:', '1000000');
      showcaseData.unshift({
        id: 'USR-' + Math.floor(100 + Math.random() * 900),
        name,
        email: name.replace(/\s+/g, '.').toLowerCase() + '@example.com',
        role: 'مستخدم جديد',
        coins: Number(coins) || 0,
        diamonds: 1000,
        joinDate: new Date().toISOString().slice(0, 10),
        status: 'نشط'
      });
      renderStandardTableShowcase(container);
    },
    addLabel: 'إضافة مستخدم جديد',
    onBulkDelete: (ids) => {
      if (confirm(`هل تريد حذف ${ids.length} عناصر محددة؟`)) {
        for (let id of ids) {
          const idx = showcaseData.findIndex(d => d.id === id);
          if (idx !== -1) showcaseData.splice(idx, 1);
        }
        renderStandardTableShowcase(container);
      }
    }
  });

  lucide.createIcons();
}

// Live table filter
function filterBuildableTable(tabId) {
  const query = document.getElementById('buildableSearchInput')?.value.trim().toLowerCase() || '';
  const rows = document.querySelectorAll('#buildableTableBody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}

// Open modal to add a new item to any list
function openAddBuildableModal(tabId) {
  const config = SECTION_CONFIG[tabId] || {
    title: 'عنصر جديد',
    headers: ['المعرف', 'الاسم / العنوان', 'الوصف / التفاصيل', 'التصنيف', 'القيمة / المعرف', 'الحالة']
  };

  const existingModal = document.getElementById('customAddModal');
  if (existingModal) existingModal.remove();

  const modalHtml = `
    <div id="customAddModal" class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-white border border-slate-300 rounded-3xl p-6 shadow-2xl space-y-4 text-right">
        
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-900 flex items-center justify-center font-black">
              <i data-lucide="plus" class="w-4 h-4"></i>
            </div>
            <h3 class="font-black text-sm text-slate-950">إضافة ${config.singular || 'عنصر جديد'}</h3>
          </div>
          <button onclick="document.getElementById('customAddModal').remove()" class="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-950">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <form onsubmit="handleSaveBuildableItem(event, '${tabId}')" class="space-y-3">
          <div>
            <label class="block text-xs font-black text-slate-950 mb-1">${config.headers[1] || 'الاسم / العنوان'}:</label>
            <input type="text" id="newItemName" required placeholder="أدخل الاسم أو العنوان..." class="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500">
          </div>

          <div>
            <label class="block text-xs font-black text-slate-950 mb-1">${config.headers[2] || 'الوصف / التفاصيل'}:</label>
            <input type="text" id="newItemDesc" placeholder="تفاصيل أو ملاحظات إضافية..." class="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-950 font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-black text-slate-950 mb-1">${config.headers[3] || 'التصنيف'}:</label>
              <input type="text" id="newItemCategory" placeholder="مثال: ذهبي، عام، VIP..." class="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-950 font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500">
            </div>
            <div>
              <label class="block text-xs font-black text-slate-950 mb-1">${config.headers[4] || 'القيمة / الرصيد'}:</label>
              <input type="text" id="newItemValue" placeholder="مثال: 50,000 كوينز..." class="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-950 font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500">
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-slate-950 mb-1">الحالة الأولية:</label>
            <select id="newItemStatus" class="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-black text-slate-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500">
              <option value="نشطة">نشطة (Active)</option>
              <option value="قيد المراجعة">قيد المراجعة (Pending)</option>
              <option value="متوقفة">متوقفة (Disabled)</option>
            </select>
          </div>

          <div class="pt-2 flex items-center justify-end gap-2">
            <button type="button" onclick="document.getElementById('customAddModal').remove()" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition">
              إلغاء
            </button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-xs cursor-pointer">
              حفظ وإضافة للقائمة
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  lucide.createIcons();
}

function handleSaveBuildableItem(e, tabId) {
  e.preventDefault();
  const name = document.getElementById('newItemName').value.trim();
  const desc = document.getElementById('newItemDesc').value.trim();
  const category = document.getElementById('newItemCategory').value.trim() || 'عام';
  const value = document.getElementById('newItemValue').value.trim() || '-';
  const status = document.getElementById('newItemStatus').value;

  const items = getBuildableItems(tabId);
  const newId = (tabId.toUpperCase().slice(0, 4)) + '-' + Math.floor(1000 + Math.random() * 9000);

  items.unshift({
    id: newId,
    name,
    desc,
    category,
    value,
    status
  });

  saveBuildableItems(tabId, items);

  const modal = document.getElementById('customAddModal');
  if (modal) modal.remove();

  renderView(tabId);
  alert('تمت إضافة العنصر بنجاح إلى القائمة!');
}

function submitNewBuildableItem(e, tabId) {
  return handleSaveBuildableItem(e, tabId);
}

function deleteBuildableItem(tabId, index) {
  if (confirm('هل تريد بالتأكيد حذف هذا العنصر من القائمة؟')) {
    const items = getBuildableItems(tabId);
    items.splice(index, 1);
    saveBuildableItems(tabId, items);
    renderView(tabId);
  }
}

function toggleBuildableItemStatus(tabId, index) {
  const items = getBuildableItems(tabId);
  if (items[index]) {
    items[index].status = items[index].status === 'نشطة' ? 'متوقفة' : 'نشطة';
    saveBuildableItems(tabId, items);
    renderView(tabId);
  }
}

function clearBuildableItems(tabId) {
  if (confirm('هل تريد تفريغ القائمة بالكامل لتصبح صفحة فارغة وتبدأ بالبناء من الصفر؟')) {
    saveBuildableItems(tabId, []);
    renderView(tabId);
  }
}

function resetBuildableItems(tabId) {
  const config = SECTION_CONFIG[tabId];
  if (config && config.initialData) {
    saveBuildableItems(tabId, config.initialData);
  } else {
    saveBuildableItems(tabId, []);
  }
  renderView(tabId);
}

// Utility: Download JSON export
function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Fullscreen toggle function for Standalone Dashboard
function toggleAdminFullscreen() {
  const doc = (window.top && window.top.document) ? window.top.document : document;
  const isDocFull = !!doc.fullscreenElement;
  if (!isDocFull) {
    const el = doc.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  } else {
    if (doc.exitFullscreen) {
      doc.exitFullscreen().catch(() => {});
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
  }
}

// Return to Mobile App preview seamlessly
function returnToMobileApp() {
  if (window.top && window.top !== window) {
    try {
      window.top.postMessage({ type: 'NAVIGATE_TO_MOBILE' }, '*');
      window.top.location.href = '/?view=mobile';
      return;
    } catch (e) {}
  }
  window.location.href = '/?view=mobile';
}

// Explicit window bindings for inline HTML onclick handlers
if (typeof window !== 'undefined') {
  window.toggleAdminFullscreen = toggleAdminFullscreen;
  window.returnToMobileApp = returnToMobileApp;
  window.switchTab = switchTab;
  window.toggleSidebar = toggleSidebar;
  window.toggleSubmenu = toggleSubmenu;
  window.handleLoginSubmit = handleLoginSubmit;
  window.handleLogout = handleLogout;
  window.fillDemoCredentials = fillDemoCredentials;
  window.showLogin = showLogin;
  window.showDashboard = showDashboard;
  window.renderView = renderView;
  window.saveState = saveState;
  window.downloadJson = downloadJson;
  window.openAddVipModal = openAddVipModal;
  window.editVipPrice = editVipPrice;
  window.openAddBuildableModal = openAddBuildableModal;
  window.handleSaveBuildableItem = handleSaveBuildableItem;
  window.submitNewBuildableItem = submitNewBuildableItem;
  window.deleteBuildableItem = deleteBuildableItem;
  window.toggleBuildableItemStatus = toggleBuildableItemStatus;
  window.clearBuildableItems = clearBuildableItems;
  window.resetBuildableItems = resetBuildableItems;
  window.filterBuildableTable = filterBuildableTable;
  window.handleExecuteDirectRecharge = handleExecuteDirectRecharge;
  window.handleSaveConversionRate = handleSaveConversionRate;
  window.openAddCoinPackageModal = openAddCoinPackageModal;
  window.openAddStaffModal = openAddStaffModal;
  window.handleCreateManualBackup = handleCreateManualBackup;
  window.openAddSecurityBanModal = openAddSecurityBanModal;
}

// =========================================================================
// GLOBAL SEARCH CONTROLLER (نظام البحث الشامل والسريع في اللوحة العلوية)
// بحث فوري بالاسم، الـ ID، اسم الوكيل شخصياً، أو رقم جواله
// =========================================================================

let _globalSearchDebounceTimer = null;
let _globalSearchActiveIndex = -1;
let _globalSearchResultsCache = [];
let _globalSearchActiveFilter = 'all';

// Text Normalization (Arabic + Diacritics + Case)
function normalizeSearchText(str) {
  if (!str) return '';
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[ـ]/g, '');
}

// Phone Normalization (removes prefixes, spaces, brackets, dashes)
function normalizeSearchPhone(phone) {
  if (!phone) return '';
  return String(phone)
    .replace(/[\s\-\(\)\+]/g, '')
    .replace(/^00/, '')
    .replace(/^966/, '')
    .replace(/^0+/, '');
}

// ID Normalization (Flexible & Natural matching: ignores separators, dashes, prefixes, or extracts numeric digits)
function normalizeSearchId(id) {
  if (!id) return '';
  const str = String(id).trim().toLowerCase();
  // Alphanumeric without any separators (#, -, _, /, space)
  return str.replace(/[#\-\_\/\s\.\,]/g, '');
}

// Extract purely numeric digits from ID (e.g. "HOST-101-05" -> "10105", "101-05" -> "10105", "05" -> "05")
function extractIdDigits(id) {
  if (!id) return '';
  return String(id).replace(/\D/g, '');
}

// Substring Highlighter
function highlightSearchMatch(text, query) {
  if (!text) return '';
  const textStr = String(text);
  if (!query) return textStr;
  const cleanQ = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!cleanQ) return textStr;
  const regex = new RegExp(`(${cleanQ})`, 'gi');
  return textStr.replace(regex, '<mark class="bg-amber-300 text-slate-950 font-black rounded-xs px-0.5">$1</mark>');
}

// Core Multi-Dataset Search Engine
function performAdminGlobalSearch(rawQuery) {
  if (!rawQuery || !rawQuery.trim()) return [];
  const q = rawQuery.trim();
  const normQ = normalizeSearchText(q);
  const cleanPhoneQ = normalizeSearchPhone(q);
  const cleanIdQ = normalizeSearchId(q);
  const digitIdQ = extractIdDigits(q);

  const results = [];

  // Helper to match any ID representation naturally without separators
  const matchIdNaturally = (entityId, searchClean, searchDigits, rawSearchText) => {
    if (!entityId) return false;
    const entityClean = normalizeSearchId(entityId);
    const entityDigits = extractIdDigits(entityId);
    const entityNorm = normalizeSearchText(entityId);

    // Direct text inclusion
    if (rawSearchText && entityNorm.includes(rawSearchText)) return true;
    // Clean alphanumeric match (ignoring dashes and separators)
    if (searchClean && entityClean.includes(searchClean)) return true;
    // Pure digits match (e.g. searching '104' or '05' matches 'HOST-101-05' or '10105')
    if (searchDigits && entityDigits.includes(searchDigits)) return true;
    return false;
  };

  // 1. Agencies / Official Agents (وكالات التطبيق والوكيل الرسمي)
  (agencies || []).forEach(ag => {
    const agPhone = ag.phone || (window.INITIAL_AGENCIES && window.INITIAL_AGENCIES.find(a => a.id === ag.id)?.phone) || '+966501845260';
    const normName = normalizeSearchText(ag.name);
    const normOwner = normalizeSearchText(ag.owner);
    const cleanAgPhone = normalizeSearchPhone(agPhone);

    const matchName = normName.includes(normQ);
    const matchOwner = normOwner.includes(normQ);
    const matchId = matchIdNaturally(ag.id, cleanIdQ, digitIdQ, normQ);
    const matchOwnerId = matchIdNaturally(ag.ownerId, cleanIdQ, digitIdQ, normQ);
    const matchPhone = cleanPhoneQ && cleanAgPhone.includes(cleanPhoneQ);

    if (matchName || matchOwner || matchId || matchOwnerId || matchPhone) {
      results.push({
        type: 'agent',
        category: 'الوكلاء والوكالات',
        badge: 'وكيل رسمي / وكالة 🏢',
        badgeColor: 'bg-amber-100 text-amber-950 border-amber-300',
        id: ag.id,
        ownerId: ag.ownerId,
        title: ag.name,
        subtitle: `الوكيل شخصياً: ${ag.owner} (معرف: #${ag.ownerId})`,
        phone: agPhone,
        status: ag.status || 'نشطة',
        stats: `${ag.hosts || 0} مضيف • ${(ag.coins || 0).toLocaleString()} 🪙`,
        raw: ag,
        matchedReason: matchPhone ? 'تطابق رقم جوال الوكيل 📞' : (matchOwner ? 'تطابق اسم الوكيل شخصياً 👤' : (matchId || matchOwnerId ? 'تطابق الـ ID 🔢' : 'تطابق الاسم 🏷️'))
      });
    }
  });

  // 2. Agency Hosts (مضيفين الوكالات الرسمية)
  (agencyHosts || []).forEach(host => {
    const hostPhone = host.phone || (window.INITIAL_AGENCY_HOSTS && window.INITIAL_AGENCY_HOSTS.find(h => h.id === host.id)?.phone) || ('+9665' + String(host.userId || '42190831').slice(-8));
    const parentAgency = (agencies || []).find(a => a.id === host.agencyId);
    const agencyName = parentAgency ? parentAgency.name : (host.agencyId || 'وكالة معتمدة');

    const normName = normalizeSearchText(host.name);
    const normCategory = normalizeSearchText(host.category);
    const normBroker = normalizeSearchText(host.brokerName);
    const normAgency = normalizeSearchText(agencyName);
    const cleanHostPhone = normalizeSearchPhone(hostPhone);

    const matchName = normName.includes(normQ);
    const matchId = matchIdNaturally(host.id, cleanIdQ, digitIdQ, normQ);
    const matchUserId = matchIdNaturally(host.userId, cleanIdQ, digitIdQ, normQ);
    const matchPhone = cleanPhoneQ && cleanHostPhone.includes(cleanPhoneQ);
    const matchCategory = normCategory.includes(normQ);
    const matchBroker = normBroker.includes(normQ);
    const matchAgency = normAgency.includes(normQ);

    if (matchName || matchId || matchUserId || matchPhone || matchCategory || matchBroker || matchAgency) {
      results.push({
        type: 'host',
        category: 'المضيفين المعتمدين',
        badge: 'مضيف معتمد 🎙️',
        badgeColor: 'bg-purple-100 text-purple-950 border-purple-300',
        id: host.id,
        userId: host.userId,
        agencyId: host.agencyId,
        agencyName: agencyName,
        title: host.name,
        subtitle: `الوكالة: ${agencyName} (${host.agencyId}) • الوسيط: ${host.brokerName || 'مباشر'}`,
        phone: hostPhone,
        avatar: host.avatar,
        status: host.liveStatus || 'غير متصل',
        stats: `${host.hoursAchieved || 0} ساعة • ${(host.monthlyRevenue || 0).toLocaleString()} 🪙`,
        raw: host,
        matchedReason: matchPhone ? 'تطابق رقم جوال المضيف 📞' : (matchId || matchUserId ? 'تطابق ID المضيف 🔢' : 'تطابق اسم المضيف 🎙️')
      });
    }
  });

  // 3. Recharge Agents (وكلاء الشحن المعتمدين)
  (rechargeAgents || []).forEach(rec => {
    const normAgent = normalizeSearchText(rec.agent);
    const normName = normalizeSearchText(rec.name);
    const cleanRecPhone = normalizeSearchPhone(rec.phone);

    const matchAgent = normAgent.includes(normQ);
    const matchName = normName.includes(normQ);
    const matchId = matchIdNaturally(rec.id, cleanIdQ, digitIdQ, normQ);
    const matchPhone = cleanPhoneQ && cleanRecPhone.includes(cleanPhoneQ);

    if (matchAgent || matchName || matchId || matchPhone) {
      results.push({
        type: 'recharge',
        category: 'وكلاء الشحن',
        badge: 'وكيل شحن معتمد 💳',
        badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
        id: rec.id,
        title: rec.agent || rec.name,
        subtitle: `المركز: ${rec.name} • نسبة الخصم: ${rec.discount || '12%'}`,
        phone: rec.phone,
        status: rec.status || 'معتمد نشط',
        stats: `الرصيد: ${(rec.coinsBalance || 0).toLocaleString()} 🪙`,
        raw: rec,
        matchedReason: matchPhone ? 'تطابق رقم جوال وكيل الشحن 📞' : (matchAgent ? 'تطابق اسم وكيل الشحن 💳' : 'تطابق معرف/مركز الشحن 🔢')
      });
    }
  });

  // 4. Managers & Delegates (مدراء ومندوبي الوكالات)
  (agencyManagers || []).forEach(mgr => {
    const normName = normalizeSearchText(mgr.name);
    const cleanMgrPhone = normalizeSearchPhone(mgr.phone);
    const matchName = normName.includes(normQ);
    const matchId = matchIdNaturally(mgr.id, cleanIdQ, digitIdQ, normQ);
    const matchPhone = cleanPhoneQ && cleanMgrPhone.includes(cleanPhoneQ);

    if (matchName || matchId || matchPhone) {
      results.push({
        type: 'manager',
        category: 'الإدارة والمندوبين',
        badge: 'مدير وكالات 👔',
        badgeColor: 'bg-sky-100 text-sky-950 border-sky-300',
        id: mgr.id,
        title: mgr.name,
        subtitle: `رمز الإدارة: ${mgr.id} • الوكالات: ${mgr.agenciesCount || 0}`,
        phone: mgr.phone,
        status: 'نشط',
        stats: `${mgr.totalHosts || 0} مضيف في الهيكل`,
        raw: mgr,
        matchedReason: matchPhone ? 'تطابق رقم جوال المدير 📞' : (matchId ? 'تطابق معرف الإدارة 🔢' : 'تطابق اسم المدير 👔')
      });
    }
  });

  (agencyDelegates || []).forEach(del => {
    const normName = normalizeSearchText(del.name);
    const cleanDelPhone = normalizeSearchPhone(del.phone);
    const matchName = normName.includes(normQ);
    const matchId = matchIdNaturally(del.id, cleanIdQ, digitIdQ, normQ);
    const matchPhone = cleanPhoneQ && cleanDelPhone.includes(cleanPhoneQ);

    if (matchName || matchId || matchPhone) {
      results.push({
        type: 'delegate',
        category: 'الإدارة والمندوبين',
        badge: 'مندوب وكالات 🤝',
        badgeColor: 'bg-indigo-100 text-indigo-950 border-indigo-300',
        id: del.id,
        title: del.name,
        subtitle: `رمز المندوب: ${del.id} • عمولته: ${del.commissionRate || 14}%`,
        phone: del.phone,
        status: 'معتمد',
        stats: `تابع للإدارة: ${del.managerId || 'MGR-9901'}`,
        raw: del,
        matchedReason: matchPhone ? 'تطابق رقم جوال المندوب 📞' : (matchId ? 'تطابق معرف المندوب 🔢' : 'تطابق اسم المندوب 🤝')
      });
    }
  });

  // 5. Users Directory (سجل المستخدمين)
  (users || []).forEach(u => {
    const normName = normalizeSearchText(u.displayName);
    const normEmail = normalizeSearchText(u.email);
    const cleanUserPhone = normalizeSearchPhone(u.phone);

    const matchName = normName.includes(normQ);
    const matchId = matchIdNaturally(u.id, cleanIdQ, digitIdQ, normQ);
    const matchSpecialId = matchIdNaturally(u.specialId, cleanIdQ, digitIdQ, normQ);
    const matchPhone = cleanPhoneQ && cleanUserPhone.includes(cleanPhoneQ);
    const matchEmail = normEmail.includes(normQ);

    if (matchName || matchId || matchSpecialId || matchPhone || matchEmail) {
      results.push({
        type: 'user',
        category: 'المستخدمين',
        badge: 'مستخدم 👤',
        badgeColor: 'bg-slate-100 text-slate-900 border-slate-300',
        id: u.id,
        specialId: u.specialId,
        title: u.displayName,
        subtitle: `ID المميز: #${u.specialId} • المستوى: Lv.${u.level || 1} • ${u.vip || 'عضو عادي'}`,
        phone: u.phone,
        avatar: u.avatar,
        status: u.status || 'نشط',
        stats: `الكوينز: ${(u.coins || 0).toLocaleString()} 🪙`,
        raw: u,
        matchedReason: matchPhone ? 'تطابق رقم الجوال 📞' : (matchSpecialId || matchId ? 'تطابق ID المستخدم 🔢' : 'تطابق اسم المستخدم 👤')
      });
    }
  });

  return results;
}

// Input Event Handler (Debounced)
window.handleGlobalSearchInput = function(event) {
  const query = event.target.value;
  const clearBtn = document.getElementById('globalAdminSearchClearBtn');
  if (clearBtn) {
    if (query && query.trim().length > 0) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  }

  if (_globalSearchDebounceTimer) {
    clearTimeout(_globalSearchDebounceTimer);
  }

  _globalSearchDebounceTimer = setTimeout(() => {
    _globalSearchActiveIndex = -1;
    renderGlobalSearchDropdown(query);
  }, 100);
};

// Focus Event Handler
window.handleGlobalSearchFocus = function(event) {
  const query = event.target.value;
  if (query && query.trim().length > 0) {
    renderGlobalSearchDropdown(query);
  }
};

// Keydown Event Handler (Arrow Keys, Enter, Escape)
window.handleGlobalSearchKeydown = function(event) {
  const menu = document.getElementById('globalAdminSearchResultsMenu');
  const items = menu ? menu.querySelectorAll('.search-result-row') : [];

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (items.length === 0) return;
    _globalSearchActiveIndex = (_globalSearchActiveIndex + 1) % items.length;
    updateActiveSearchResultItem(items);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (items.length === 0) return;
    _globalSearchActiveIndex = (_globalSearchActiveIndex - 1 + items.length) % items.length;
    updateActiveSearchResultItem(items);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    if (_globalSearchActiveIndex >= 0 && items[_globalSearchActiveIndex]) {
      items[_globalSearchActiveIndex].click();
    } else {
      const q = event.target.value;
      if (q && q.trim().length > 0) {
        window.openFullSearchResultsModal(q);
      }
    }
  } else if (event.key === 'Escape') {
    window.clearGlobalSearch();
    window.closeHostProfileModal();
    window.closeFullSearchResultsModal();
    window.closeUserQuickModal();
    window.closeRechargeAgentModal();
  }
};

function updateActiveSearchResultItem(items) {
  items.forEach((it, idx) => {
    if (idx === _globalSearchActiveIndex) {
      it.classList.add('bg-amber-50', 'ring-2', 'ring-amber-400');
      it.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      it.classList.remove('bg-amber-50', 'ring-2', 'ring-amber-400');
    }
  });
}

// Clear Search
window.clearGlobalSearch = function() {
  const input = document.getElementById('globalAdminSearchInput');
  const clearBtn = document.getElementById('globalAdminSearchClearBtn');
  const menu = document.getElementById('globalAdminSearchResultsMenu');

  if (input) input.value = '';
  if (clearBtn) clearBtn.classList.add('hidden');
  if (menu) {
    menu.classList.add('hidden');
    menu.innerHTML = '';
  }
  _globalSearchResultsCache = [];
  _globalSearchActiveIndex = -1;
};

// Render Search Results Dropdown Menu
function renderGlobalSearchDropdown(query) {
  const menu = document.getElementById('globalAdminSearchResultsMenu');
  if (!menu) return;

  if (!query || !query.trim()) {
    menu.classList.add('hidden');
    menu.innerHTML = '';
    _globalSearchResultsCache = [];
    return;
  }

  const results = performAdminGlobalSearch(query);
  _globalSearchResultsCache = results;

  // Filter if specific category selected
  let filtered = results;
  if (_globalSearchActiveFilter !== 'all') {
    filtered = results.filter(r => r.type === _globalSearchActiveFilter);
  }

  menu.classList.remove('hidden');

  if (results.length === 0) {
    menu.innerHTML = `
      <div class="p-6 text-center text-slate-500">
        <div class="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-300 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <i data-lucide="search-x" class="w-6 h-6"></i>
        </div>
        <p class="text-xs font-black text-slate-800">لم يتم العثور على أي نتائج تطابق "${query}"</p>
        <p class="text-[11px] text-slate-500 mt-1">تأكد من كتابة الاسم، أو الـ ID، أو اسم الوكيل شخصياً، أو رقم الجوال بشكل صحيح.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  // Count by categories
  const counts = {
    all: results.length,
    agent: results.filter(r => r.type === 'agent').length,
    host: results.filter(r => r.type === 'host').length,
    recharge: results.filter(r => r.type === 'recharge').length,
    user: results.filter(r => r.type === 'user').length
  };

  const topResults = filtered.slice(0, 8);

  menu.innerHTML = `
    <!-- Results Header -->
    <div class="p-3 bg-slate-100 border-b-2 border-slate-300 flex items-center justify-between gap-2 shrink-0">
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
          ${results.length}
        </span>
        <span class="text-xs font-black text-slate-900">نتائج البحث عن: <strong class="text-amber-700">"${query}"</strong></span>
      </div>
      <button 
        type="button" 
        onclick="window.openFullSearchResultsModal('${query.replace(/'/g, "\\'")}')" 
        class="text-[11px] font-black text-sky-700 hover:text-sky-950 flex items-center gap-1 hover:underline cursor-pointer">
        <span>عرض الكل (${results.length})</span>
        <i data-lucide="external-link" class="w-3 h-3"></i>
      </button>
    </div>

    <!-- Quick Category Filter Chips -->
    <div class="p-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold shrink-0">
      <button 
        onclick="window.setGlobalSearchCategoryFilter('all', '${query.replace(/'/g, "\\'")}')" 
        class="px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${_globalSearchActiveFilter === 'all' ? 'bg-slate-900 text-white font-black' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'}">
        الكل (${counts.all})
      </button>
      ${counts.agent > 0 ? `
      <button 
        onclick="window.setGlobalSearchCategoryFilter('agent', '${query.replace(/'/g, "\\'")}')" 
        class="px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${_globalSearchActiveFilter === 'agent' ? 'bg-amber-600 text-white font-black' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'}">
        الوكلاء (${counts.agent})
      </button>` : ''}
      ${counts.host > 0 ? `
      <button 
        onclick="window.setGlobalSearchCategoryFilter('host', '${query.replace(/'/g, "\\'")}')" 
        class="px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${_globalSearchActiveFilter === 'host' ? 'bg-purple-700 text-white font-black' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'}">
        المضيفين (${counts.host})
      </button>` : ''}
      ${counts.recharge > 0 ? `
      <button 
        onclick="window.setGlobalSearchCategoryFilter('recharge', '${query.replace(/'/g, "\\'")}')" 
        class="px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${_globalSearchActiveFilter === 'recharge' ? 'bg-emerald-700 text-white font-black' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'}">
        الشحن (${counts.recharge})
      </button>` : ''}
      ${counts.user > 0 ? `
      <button 
        onclick="window.setGlobalSearchCategoryFilter('user', '${query.replace(/'/g, "\\'")}')" 
        class="px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${_globalSearchActiveFilter === 'user' ? 'bg-indigo-700 text-white font-black' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'}">
        المستخدمين (${counts.user})
      </button>` : ''}
    </div>

    <!-- Scrollable Results List -->
    <div class="overflow-y-auto divide-y divide-slate-200/80 p-1 space-y-1">
      ${topResults.map((item, idx) => `
        <div 
          onclick="window.openEntityFromSearch('${item.type}', '${item.id}')"
          class="search-result-row p-2.5 rounded-xl hover:bg-slate-100 transition cursor-pointer flex items-center justify-between gap-3 text-right"
          data-index="${idx}">
          <div class="flex items-center gap-2.5 min-w-0 flex-1">
            ${item.avatar ? `
              <img src="${item.avatar}" class="w-10 h-10 rounded-xl object-cover border border-slate-300 shrink-0" alt="">
            ` : `
              <div class="w-10 h-10 rounded-xl ${item.badgeColor} border flex items-center justify-center font-black text-xs shrink-0">
                ${item.type === 'host' ? '🎙️' : (item.type === 'agent' ? '🏢' : (item.type === 'recharge' ? '💳' : '👤'))}
              </div>
            `}
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-xs font-black text-slate-950 truncate max-w-[200px] sm:max-w-xs">
                  ${highlightSearchMatch(item.title, query)}
                </span>
                <span class="text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${item.badgeColor}">
                  ${item.badge}
                </span>
                <span class="text-[10px] font-mono font-black text-slate-600 bg-slate-200 px-1 rounded">
                  ${highlightSearchMatch(item.id, query)}
                </span>
              </div>
              <div class="text-[11px] text-slate-600 truncate mt-0.5">
                ${highlightSearchMatch(item.subtitle, query)}
              </div>
              <div class="flex items-center gap-3 mt-1 text-[10px] text-slate-500 font-medium">
                ${item.phone ? `
                  <span class="flex items-center gap-1 text-slate-700 font-mono font-bold">
                    <i data-lucide="phone" class="w-3 h-3 text-slate-400"></i>
                    ${highlightSearchMatch(item.phone, query)}
                  </span>
                ` : ''}
                <span class="font-bold text-amber-800 bg-amber-50 px-1 rounded">${item.matchedReason}</span>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-1 shrink-0">
            <button 
              type="button" 
              onclick="event.stopPropagation(); window.openEntityFromSearch('${item.type}', '${item.id}')" 
              class="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black transition flex items-center gap-1 cursor-pointer shadow-xs"
              title="فتح الملف والمعلومات الكاملة">
              <span>فتح</span>
              <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Dropdown Footer -->
    <div class="p-2.5 bg-slate-100 border-t border-slate-300 flex items-center justify-between text-[11px] font-bold text-slate-600 shrink-0">
      <div class="flex items-center gap-1 text-slate-500">
        <kbd class="px-1 py-0.5 bg-white rounded border border-slate-300 text-[10px] font-mono">↑↓</kbd>
        <span>للتنقل</span>
        <kbd class="px-1 py-0.5 bg-white rounded border border-slate-300 text-[10px] font-mono mr-2">Enter</kbd>
        <span>للفتح</span>
      </div>
      <button 
        type="button" 
        onclick="window.openFullSearchResultsModal('${query.replace(/'/g, "\\'")}')" 
        class="text-xs font-black text-amber-700 hover:text-amber-950 flex items-center gap-1 hover:underline cursor-pointer">
        <span>عرض النتائج في نافذة شاملة ↗️</span>
      </button>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

window.setGlobalSearchCategoryFilter = function(category, query) {
  _globalSearchActiveFilter = category;
  renderGlobalSearchDropdown(query);
};

// Open Entity Wherever it is ("تُفتتح القائمة الخاصة به أينما كان")
window.openEntityFromSearch = function(type, id, actionType) {
  // Hide dropdown
  const menu = document.getElementById('globalAdminSearchResultsMenu');
  if (menu) menu.classList.add('hidden');

  if (type === 'host') {
    window.openHostFullProfile(id);
  } else if (type === 'agent') {
    if (actionType === 'detail') {
      window.switchTab('agencies');
      if (typeof window.openAgencyDetail === 'function') {
        window.openAgencyDetail(id, 'hosts');
      }
    } else {
      if (typeof window.openAgencyCumulativeModal === 'function') {
        window.openAgencyCumulativeModal(id);
      } else {
        window.switchTab('agencies');
        window.openAgencyDetail(id, 'hosts');
      }
    }
  } else if (type === 'recharge') {
    window.openRechargeAgentProfile(id);
  } else if (type === 'manager') {
    window.switchTab('agency_hierarchy');
    if (typeof window.showManagerAgencies === 'function') {
      window.showManagerAgencies(id);
    }
  } else if (type === 'delegate') {
    window.switchTab('agency_hierarchy');
    if (window._hierarchyState) {
      window._hierarchyState.activeDelegateId = id;
      window._hierarchyState.activeManagerSubTab = 'delegates';
      renderView('agency_hierarchy');
    }
  } else if (type === 'user') {
    window.openUserProfileFromSearch(id);
  }
};

// =========================================================================
// HOST FULL PROFILE MODAL (ملف المضيف المعتمد الشامل مع ربط الوكالة وساعات البث)
// =========================================================================

window.openHostFullProfile = function(hostId) {
  const host = (agencyHosts || []).find(h => h.id === hostId);
  if (!host) {
    alert('لم يتم العثور على بيانات المضيف المطلوب.');
    return;
  }

  const modal = document.getElementById('globalHostProfileModal');
  const content = document.getElementById('globalHostProfileModalContent');
  if (!modal || !content) return;

  const parentAgency = (agencies || []).find(a => a.id === host.agencyId) || {
    id: host.agencyId || 'AG-101',
    name: 'وكالة معتمدة',
    owner: 'الوكيل الرسمي',
    phone: '+966501845260',
    commission: 14.5
  };

  const hostPhone = host.phone || (window.INITIAL_AGENCY_HOSTS && window.INITIAL_AGENCY_HOSTS.find(h => h.id === host.id)?.phone) || ('+9665' + String(host.userId || '42190831').slice(-8));
  const hoursPct = Math.min(100, Math.round(((host.hoursAchieved || 0) / (host.monthlyTarget || 120)) * 100));
  const isLive = host.liveStatus && host.liveStatus.includes('مباشر');

  // Simulated & realistic comprehensive details for host
  const regMethod = host.registrationMethod || (host.id.charCodeAt(host.id.length - 1) % 2 === 0 ? 'رقم الجوال (SMS OTP)' : 'البريد الإلكتروني (Google Auth)');
  const regEmail = host.email || `${String(host.userId || 'user')}@voicelive.app`;
  const deviceModel = host.deviceModel || (host.id.includes('01') ? 'iPhone 15 Pro Max (iOS 17.5.1)' : (host.id.includes('02') ? 'Samsung Galaxy S24 Ultra (Android 14)' : 'iPhone 14 Pro (iOS 16.6)'));
  const deviceSerial = host.deviceSerial || ('IMEI-' + String(host.userId || '88392019') + '48190X');
  const deviceIp = host.deviceIp || ('185.120.' + (String(host.userId).slice(-2) || '45') + '.19');
  const macAddress = host.macAddress || ('FC:A1:B2:' + (String(host.userId).slice(-2) || '7E') + ':90:4B');

  // Financial & Salary Details (USD $ & Coins only - cancelled SAR & currency breakdown)
  const totalCoins = host.monthlyRevenue || 340000;
  const baseSalaryUsd = Math.round(totalCoins * 0.00933);
  const agencyBonusUsd = Math.round(baseSalaryUsd * 0.12);
  const totalHostIncomeUsd = baseSalaryUsd + agencyBonusUsd;
  const payoutStatus = host.payoutStatus || 'مكتمل وجاهز للتحويل المالي ✅';
  const bankIban = host.bankIban || ('US82 WIRE 0451 6000 ' + String(host.userId || '42198031').slice(-8));
  const bankName = host.bankName || 'حساب التحويل الدولي المعتمد (USD Wire / Payoneer)';

  // Detailed Recharge Operations & Inflow Channels (شحنات الكوينز ومصدرها)
  const rechargeHistory = host.recharges || [
    {
      id: 'RCH-8921',
      date: '2026-09-08 16:40',
      amountCoins: 120000,
      sourceType: 'وكيل شحن معتمد',
      sourceDetail: 'مكتب الرياض للخدمات الرقمية (REC-701)',
      paymentMethod: 'تحويل بنكي مباشر',
      fee: '0%',
      status: 'مكتمل ✅'
    },
    {
      id: 'RCH-7612',
      date: '2026-09-02 21:15',
      amountCoins: 85000,
      sourceType: 'بطاقة فيزا كارد',
      sourceDetail: 'Visa Credit **** 4192 (بوابة الدفع الإلكتروني)',
      paymentMethod: 'فيزا كارد / ماستركارد',
      fee: '2.5%',
      status: 'مكتمل ✅'
    },
    {
      id: 'RCH-6520',
      date: '2026-08-27 18:30',
      amountCoins: 50000,
      sourceType: 'تحويل من مضيف آخر',
      sourceDetail: 'المضيف: صقر الجزيرة (HOST-101-01 / #42190831)',
      paymentMethod: 'تحويل داخلي بين المضيفين P2P',
      fee: '1%',
      status: 'مكتمل ✅'
    },
    {
      id: 'RCH-5419',
      date: '2026-08-15 11:05',
      amountCoins: 85000,
      sourceType: 'راتب شهري محوّل',
      sourceDetail: 'صرف راتب التارجت المالي المعتمد من الوكالة',
      paymentMethod: 'صرف إداري رسمي',
      fee: '0%',
      status: 'مكتمل ✅'
    }
  ];

  const totalRechargeCoins = rechargeHistory.reduce((sum, r) => sum + r.amountCoins, 0);

  // Multi-Device Detection & Fingerprinting (كشف استخدام أكثر من جوال وحساب)
  const devicesUsed = host.deviceLogs || [
    {
      model: deviceModel,
      serial: deviceSerial,
      ip: deviceIp,
      mac: macAddress,
      lastActive: 'منذ 10 دقائق (النشط الآن)',
      isPrimary: true,
      riskLevel: 'آمن'
    },
    {
      model: 'iPad Pro 11-inch (M2 / iPadOS 17.4)',
      serial: 'IMEI-8849201994101A',
      ip: '185.120.45.88',
      mac: 'FC:A1:B2:7E:88:1A',
      lastActive: '2026-09-07 23:45',
      isPrimary: false,
      riskLevel: 'جهاز إضافي معتمد'
    },
    {
      model: 'Xiaomi Redmi Note 12 Pro (Android 13)',
      serial: 'IMEI-9921048210398B',
      ip: '178.62.19.102',
      mac: 'E0:2B:96:11:3C:99',
      lastActive: '2026-08-29 04:12',
      isPrimary: false,
      riskLevel: 'تنبيه: دخول مشبوه سابق ⚠️'
    }
  ];

  const hasMultipleDevices = devicesUsed.length > 1;

  // Ban & Suspension History (سجل البند والإيقافات السابقة وحالة التجميد الحالية)
  const isCurrentlyBanned = host.isBanned || host.status === 'مجمد' || host.status === 'محظور';
  const banHistory = host.banHistory || [
    {
      id: 'BAN-104',
      date: '2026-06-12',
      endDate: '2026-06-15 (3 أيام)',
      reason: 'مخالفة ضوابط البث الصوتي (تشويش أو خلفية غير ملائمة)',
      byAdmin: 'المشرف الإداري نايف الحربي',
      status: 'منتهي الصلاحية'
    },
    {
      id: 'BAN-089',
      date: '2026-03-04',
      endDate: '2026-03-05 (24 ساعة)',
      reason: 'تنبيه تكرار فتح لايف من جهازين في نفس التوقيت',
      byAdmin: 'نظام الحماية التلقائي (Anti-Fraud)',
      status: 'منتهي الصلاحية'
    }
  ];

  // Badges & Honors
  const badgesList = host.badges || [
    { title: 'نجم الصوت الذهبي 🌟', desc: 'أعلى ساعات بث صوتي متواصل', color: 'bg-amber-100 text-amber-950 border-amber-300' },
    { title: 'مضيف موثق VIP 🏆', desc: 'هوية وبصمة جهاز رسمية معتمدة', color: 'bg-purple-100 text-purple-950 border-purple-300' },
    { title: 'ملتزم بالتارجت 🎯', desc: 'تحقيق 100% من ساعات الحضور', color: 'bg-emerald-100 text-emerald-950 border-emerald-300' },
    { title: 'درع التفاعل الجماهيري 🛡️', desc: 'أكثر من 50 داعم شهري نشط', color: 'bg-sky-100 text-sky-950 border-sky-300' }
  ];

  // Gifts Received breakdown with Date Picker support
  const hostGiftsList = host.giftsReceived || [
    { id: 'GFT-901', name: 'القلعة الملكية 🏰', count: 12, coins: 60000, sender: 'سلطان نجد (داعم ذهبي)', date: '2026-09-08' },
    { id: 'GFT-902', name: 'سيارة لامبورغيني 🏎️', count: 8, coins: 48000, sender: 'صقر قريش', date: '2026-09-07' },
    { id: 'GFT-903', name: 'صاروخ المجرة 🚀', count: 45, coins: 90000, sender: 'البرنس 101', date: '2026-09-06' },
    { id: 'GFT-904', name: 'تاج الملوك 👑', count: 68, coins: 34000, sender: 'داعم فاعل خير', date: '2026-09-04' },
    { id: 'GFT-905', name: 'صندوق الألماس 💎', count: 110, coins: 55000, sender: 'عشاق الطرب', date: '2026-09-02' },
    { id: 'GFT-891', name: 'يخت الفخامة 🛥️', count: 9, coins: 54000, sender: 'أمير الصحراء', date: '2026-08-28' },
    { id: 'GFT-892', name: 'صاروخ المجرة 🚀', count: 38, coins: 76000, sender: 'البرنس 101', date: '2026-08-22' },
    { id: 'GFT-893', name: 'قلب الأسد 🦁', count: 15, coins: 45000, sender: 'فهد العتيبي', date: '2026-08-16' },
    { id: 'GFT-894', name: 'برج العرب 🏨', count: 5, coins: 30000, sender: 'سلطان نجد', date: '2026-08-10' },
    { id: 'GFT-895', name: 'صندوق الألماس 💎', count: 85, coins: 42500, sender: 'عشاق الطرب', date: '2026-08-04' },
    { id: 'GFT-781', name: 'طائرة الهليكوبتر 🚁', count: 11, coins: 44000, sender: 'صقر قريش', date: '2026-07-29' },
    { id: 'GFT-782', name: 'القلعة الملكية 🏰', count: 8, coins: 40000, sender: 'سلطان نجد', date: '2026-07-20' },
    { id: 'GFT-783', name: 'تاج الملوك 👑', count: 52, coins: 26000, sender: 'فاعل خير VIP', date: '2026-07-14' },
    { id: 'GFT-784', name: 'صندوق الألماس 💎', count: 92, coins: 46000, sender: 'محبين الفن', date: '2026-07-06' }
  ];

  // Game Earnings Logs (Coins vs Silver Currency Separation)
  const hostGamesData = host.gamesData || {
    goldGames: [
      { id: 'GM-801', game: 'مزرعة الحظ السعيدة 🌾', roundId: 'R-99210', date: '2026-09-08 22:15', wonCoins: 45000, netCoins: 40500, fee: '10%', status: 'مكتمل ومضاف للتارجت ✅' },
      { id: 'GM-782', game: 'سلوتس الكنز المفقود 🎰', roundId: 'R-98412', date: '2026-09-06 19:40', wonCoins: 28000, netCoins: 25200, fee: '10%', status: 'مكتمل ومضاف للتارجت ✅' },
      { id: 'GM-744', game: 'عجلة الحظ الكبرى 🎡', roundId: 'R-97103', date: '2026-09-03 14:10', wonCoins: 15000, netCoins: 13500, fee: '10%', status: 'مكتمل ومضاف للتارجت ✅' }
    ],
    silverGames: [
      { id: 'SLV-301', game: 'لودو النجوم (Ludo Classic) 🎲', roundId: 'LUD-4401', date: '2026-09-08 17:30', silverScore: '85,000 فضية', result: 'فوز بالمركز الأول 🏆', note: 'عملة فضية ترفيهية (خارج تارجت الراتب)' },
      { id: 'SLV-289', game: 'دومينو التحدي 🀄', roundId: 'DOM-1209', date: '2026-09-05 21:00', silverScore: '32,000 فضية', result: 'فوز بالجولة 🥇', note: 'عملة فضية ترفيهية (خارج تارجت الراتب)' },
      { id: 'SLV-210', game: 'لودو النجوم (Ludo Classic) 🎲', roundId: 'LUD-3991', date: '2026-08-30 16:45', silverScore: '12,000 فضية', result: 'خسارة الجولة', note: 'عملة فضية ترفيهية (خارج تارجت الراتب)' }
    ]
  };

  // Administrative Penalties & Deductions History
  const hostPenaltiesList = host.penalties || [
    { id: 'PEN-042', type: 'خصم مالي إداري', amountUsd: 50, coinsDeducted: 0, reason: 'تأخر عن موعد جولة البث الصوتي المعتمدة بدون إشعار مسبق', date: '2026-08-14', adminName: 'المشرف الإداري: نايف الحربي', refProof: 'TICK-9021' },
    { id: 'PEN-028', type: 'تعليق ساعات بث', amountUsd: 0, coinsDeducted: 10000, reason: 'استخدام تشويش صوتي ومكبرات غير مصرح بها أثناء الفعالية', date: '2026-06-20', adminName: 'إدارة الرقابة والمتابعة (Audit)', refProof: 'AUD-5510' }
  ];

  // Verified Withdrawals & Financial Payout Proofs
  const hostWithdrawalsList = host.withdrawals || [
    { id: 'WTH-9941', date: '2026-09-01 11:30', amountUsd: 2850, method: 'تحويل بنكي دولي (Wire)', referenceId: 'REF-USWIRE-20260901-8841', status: 'مسلّم ومؤكد بنكياً ✅', receiptUrl: '#' },
    { id: 'WTH-8812', date: '2026-08-01 10:15', amountUsd: 2400, method: 'محفظة USDT (TRC20)', referenceId: '0x94f1c90a1824b22c0e816a7f', status: 'مسلّم ومؤكد على البلوكتشين ✅', receiptUrl: '#' },
    { id: 'WTH-7740', date: '2026-07-01 13:00', amountUsd: 2150, method: 'تحويل بنكي دولي (Wire)', referenceId: 'REF-USWIRE-20260701-4419', status: 'مسلّم ومؤكد بنكياً ✅', receiptUrl: '#' }
  ];

  // PK Challenges & Live Battle Records
  const hostPkBattlesList = host.pkBattles || [
    { id: 'PK-401', opponentName: 'شهد نجد 🎙️', opponentAgency: 'وكالة النخبة (AG-103)', date: '2026-09-08 23:00', result: 'فوز ساحق 🏆', hostCoins: 145000, opponentCoins: 98000, topSupporter: 'سلطان نجد' },
    { id: 'PK-388', opponentName: 'صقر الجنوب 🦅', opponentAgency: 'وكالة الصقور (AG-105)', date: '2026-09-05 21:30', result: 'فوز 🥇', hostCoins: 89000, opponentCoins: 82000, topSupporter: 'البرنس 101' },
    { id: 'PK-362', opponentName: 'أمير النغم 🎵', opponentAgency: 'وكالة الألحان (AG-102)', date: '2026-08-29 22:00', result: 'تعادل شرفي 🤝', hostCoins: 65000, opponentCoins: 65000, topSupporter: 'داعم فاعل خير' }
  ];

  // Visuals & Cosmetic Themes Owned (Lazy Loaded)
  const hostThemesList = host.themesOwned || [
    { id: 'THM-01', name: 'ثيم القصر الملكي الأسطوري 👑', type: 'خلفية غرفة صوتية 3D', status: 'مفعّل حالياً', icon: '🏰', previewColor: 'from-amber-600 to-purple-900', expiryDate: 'دائم (VIP)' },
    { id: 'THM-02', name: 'إطار الماسة النادرة المشعة 💎', type: 'إطار أفاتار متحرك', status: 'مملوك', icon: '✨', previewColor: 'from-cyan-500 to-blue-800', expiryDate: '2026-12-31' },
    { id: 'THM-03', name: 'مركبة الدخول الملكية (فانتوم) 🚘', type: 'مؤثر دخولية الروم Sound FX', status: 'مملوك', icon: '🏎️', previewColor: 'from-rose-600 to-slate-900', expiryDate: '2027-01-01' },
    { id: 'THM-04', name: 'خلفية سماء النجوم والمجرة 🌌', type: 'خلفية روم ديناميكية', status: 'مملوك', icon: '🌠', previewColor: 'from-purple-900 to-slate-950', expiryDate: 'دائم' }
  ];

  window._allHostGiftsRaw = hostGiftsList;
  window._currentActiveHostId = host.id;
  window._currentActiveHostData = {
    host,
    parentAgency,
    rechargeHistory,
    devicesUsed,
    banHistory,
    badgesList,
    hostGamesData,
    hostPenaltiesList,
    hostWithdrawalsList,
    hostPkBattlesList,
    hostThemesList,
    hostGiftsList
  };

  // Current admin role from session or default to SUPER_ADMIN
  const currentAdminSession = JSON.parse(localStorage.getItem('sl_admin_session') || '{}');
  const currentAdminRole = currentAdminSession.role || 'SUPER_ADMIN';
  const currentUserPerms = window.currentUserPermissions || {
    viewGifts: true,
    viewGames: true,
    viewRecharges: true,
    viewPenalties: true,
    viewWithdrawals: true,
    viewDevices: true,
    viewPk: true,
    viewThemes: true,
    executeBans: true,
    viewBadges: true
  };

  // RBAC Drawer Menu Options List
  const hostDrawerOptions = [
    {
      id: 'statement',
      permKey: 'viewGifts',
      title: 'كشف حساب وتدقيق المضيف (Host Statement & Audit)',
      subtitle: 'كشف وتدقيق إجمالي كامل مع الطباعة بكل حركات الدخل والخرج وفض النزاعات',
      icon: 'file-text',
      color: 'border-purple-300 hover:border-purple-600 bg-gradient-to-l from-purple-50/90 to-white shadow-xs ring-1 ring-purple-200',
      iconBg: 'bg-gradient-to-br from-purple-700 to-indigo-800 text-white shadow-xs',
      badge: 'كشف إجمالي وطباعة 🖨️',
      badgeColor: 'bg-purple-100 text-purple-950 border-purple-400 font-black'
    },
    {
      id: 'agency_hosts_jump',
      action: `window.toggleHostDrawerMenu(false); window.jumpToHostInAgencyTable('${host.id}', '${host.agencyId}')`,
      title: 'فتح قائمة مضيفي الوكالة وتظليله',
      subtitle: `الانتقال المباشر لجدول مضيفي الوكالة (${parentAgency.name}) وتحديد وتظليل هذا المضيف`,
      icon: 'list-checks',
      color: 'border-indigo-300 hover:border-indigo-500 bg-indigo-50/50 shadow-xs',
      iconBg: 'bg-indigo-600 text-white shadow-xs',
      badge: 'جدول المضيفين 🎯',
      badgeColor: 'bg-indigo-100 text-indigo-950 border-indigo-300 font-bold'
    },
    {
      id: 'gifts',
      permKey: 'viewGifts',
      title: 'كشف الهدايا والدخل (Gifts)',
      subtitle: 'تفاصيل الهدايا، الداعمين، والفلترة حسب التاريخ',
      icon: 'gift',
      color: 'border-rose-200 hover:border-rose-400 bg-white',
      iconBg: 'bg-rose-100 text-rose-700',
      badge: `${hostGiftsList.length} هدايا مسجلة`,
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
    },
    {
      id: 'games',
      permKey: 'viewGames',
      title: 'سجل الألعاب (Games)',
      subtitle: 'عزل أرباح الكوينز الذهبية عن الفضية للتارجت والراتب',
      icon: 'gamepad-2',
      color: 'border-amber-200 hover:border-amber-400 bg-white',
      iconBg: 'bg-amber-100 text-amber-800',
      badge: 'فصل العملات 🪙',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      id: 'recharges',
      permKey: 'viewRecharges',
      title: 'سجل الشحنات (Recharges)',
      subtitle: 'مصادر الشحن (وكلاء، ماستر كارد، استقطاع راتب)',
      icon: 'credit-card',
      color: 'border-sky-200 hover:border-sky-400 bg-white',
      iconBg: 'bg-sky-100 text-sky-800',
      badge: `${rechargeHistory.length} عمليات`,
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-300'
    },
    {
      id: 'penalties',
      permKey: 'viewPenalties',
      title: 'سجل العقوبات والخصومات (Penalties)',
      subtitle: 'الجزاءات الإدارية، الخصومات المالية، واستقطاعات الراتب',
      icon: 'shield-alert',
      color: 'border-red-200 hover:border-red-400 bg-white',
      iconBg: 'bg-red-100 text-red-800',
      badge: `${hostPenaltiesList.length} قرارات موثقة`,
      badgeColor: 'bg-red-100 text-red-900 border-red-300'
    },
    {
      id: 'withdrawals',
      permKey: 'viewWithdrawals',
      title: 'سجل الحوالات والسحوبات (Withdrawals)',
      subtitle: 'إثباتات تسليم الرواتب بالدولار والأرقام المرجعية',
      icon: 'badge-check',
      color: 'border-emerald-200 hover:border-emerald-400 bg-white',
      iconBg: 'bg-emerald-100 text-emerald-800',
      badge: 'إثباتات بنكية 💵',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    {
      id: 'devices',
      permKey: 'viewDevices',
      title: 'سجل الأجهزة والبصمة (Devices)',
      subtitle: 'تسلسل IMEI، IP، ونوع الجهاز لمنع تعدد الحسابات',
      icon: 'smartphone',
      color: 'border-indigo-200 hover:border-indigo-400 bg-white',
      iconBg: 'bg-indigo-100 text-indigo-800',
      badge: `${devicesUsed.length} أجهزة مرصودة`,
      badgeColor: hasMultipleDevices ? 'bg-amber-100 text-amber-900 border-amber-400 font-black' : 'bg-indigo-100 text-indigo-900 border-indigo-300'
    },
    {
      id: 'pk',
      permKey: 'viewPk',
      title: 'سجل جولات الـ PK والمنافسات',
      subtitle: 'نتائج التحديات الرسمية، نقاط البث، وأبرز الداعمين',
      icon: 'swords',
      color: 'border-purple-200 hover:border-purple-400 bg-white',
      iconBg: 'bg-purple-100 text-purple-800',
      badge: `${hostPkBattlesList.length} جولات`,
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
    },
    {
      id: 'themes',
      permKey: 'viewThemes',
      title: 'المزايا والثيمات (Themes)',
      subtitle: 'الثيمات الملكية، إطارات الأفاتار، ودخوليات الصوت',
      icon: 'sparkles',
      color: 'border-fuchsia-200 hover:border-fuchsia-400 bg-white',
      iconBg: 'bg-fuchsia-100 text-fuchsia-800',
      badge: `${hostThemesList.length} عناصر`,
      badgeColor: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300'
    },
    {
      id: 'bans',
      permKey: 'executeBans',
      title: 'إدارة البند والتجميد (Ban & Freeze)',
      subtitle: 'فحص سوابق البند، وتجميد/فك تجميد الحساب الفوري',
      icon: 'lock',
      color: 'border-rose-200 hover:border-rose-400 bg-white',
      iconBg: 'bg-rose-100 text-rose-800',
      badge: isCurrentlyBanned ? 'مجمد 🚫' : 'نشط ✅',
      badgeColor: isCurrentlyBanned ? 'bg-rose-600 text-white font-black' : 'bg-emerald-100 text-emerald-950 border-emerald-300'
    },
    {
      id: 'badges',
      permKey: 'viewBadges',
      title: 'الشارات الاكتسابية والأوسمة',
      subtitle: 'أوسمة التميز، دروع التفاعل، وتوثيق VIP المعتمدة',
      icon: 'award',
      color: 'border-amber-200 hover:border-amber-400 bg-white',
      iconBg: 'bg-amber-100 text-amber-800',
      badge: `${badgesList.length} أوسمة`,
      badgeColor: 'bg-amber-100 text-amber-950 border-amber-300'
    }
  ];

  // RBAC Dynamic Visibility: ربط ظهور كل خيار في القائمة بمصفوفة صلاحيات المشرف
  const allowedDrawerOptions = hostDrawerOptions.filter(opt => {
    if (opt.action) return true;
    if (currentAdminRole === 'SUPER_ADMIN') return true;
    return !opt.permKey || currentUserPerms[opt.permKey] !== false;
  });

  const drawerItemsHtml = allowedDrawerOptions.map(opt => `
    <button 
      type="button" 
      onclick="${opt.action ? opt.action : `window.toggleHostDrawerMenu(false); window.openHostAuditModal('${opt.id}')`}"
      class="w-full p-3 rounded-2xl ${opt.color} border-2 flex items-center justify-between gap-3 text-right hover:shadow-xs transition cursor-pointer group active:scale-[0.99]">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl ${opt.iconBg} flex items-center justify-center shrink-0">
          <i data-lucide="${opt.icon}" class="w-5 h-5"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h4 class="text-xs font-black text-slate-950 group-hover:text-purple-700 transition">${opt.title}</h4>
          </div>
          <p class="text-[11px] text-slate-500 mt-0.5 leading-snug">${opt.subtitle}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <span class="text-[10px] px-2 py-0.5 rounded-full border font-bold ${opt.badgeColor}">
          ${opt.badge}
        </span>
        <span class="text-slate-400 group-hover:text-purple-700 transition">◀</span>
      </div>
    </button>
  `).join('');

  // Warning Badge logic: تظهر فقط في حال وجود بلاغ أو عقوبة نشطة على الحساب
  const hasActivePenalty = isCurrentlyBanned || host.status === 'مجمد' || (host.penalties && host.penalties.some(p => p.isActive)) || host.hasWarning || false;

  content.innerHTML = `
    <!-- Header (شريط علوي نظيف ومختصر) -->
    <div class="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-between border-b-2 border-purple-800 shrink-0 relative">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-purple-600/90 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
          🎙️
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h2 class="text-base sm:text-lg font-black text-white">${host.name}</h2>
            <span class="text-xs px-2.5 py-0.5 rounded-full font-bold ${isLive ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-700 text-slate-300'}">
              ${host.liveStatus || 'غير متصل'}
            </span>
            ${hasActivePenalty ? `
              <!-- Warning Badge: تظهر فقط في حال وجود بلاغ أو عقوبة نشطة على الحساب -->
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/25 border border-rose-400 text-rose-300 text-[11px] font-black animate-pulse shadow-xs" title="يوجد إجراء إداري أو عقوبة نشطة">
                ⚠️ عقوبة/بلاغ نشط
              </span>
            ` : ''}
          </div>
          <p class="text-xs text-purple-200 mt-0.5 font-medium">ملف المضيف الإداري • المعرف الموحد: <span class="font-mono text-white">#${host.userId}</span></p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- زر الثلاث نقاط ⋮ للملف التراكمي للوكالة -->
        <div class="relative inline-block text-right">
          <button 
            type="button" 
            id="hostMoreOptionsBtn"
            onclick="window.toggleHostMoreMenu()" 
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-400/50 font-black text-xs transition cursor-pointer shadow-sm active:scale-95"
            title="الملف التراكمي للوكالة وخيارات إضافية (⋮)">
            <span class="text-lg font-black leading-none">⋮</span>
            <span class="hidden sm:inline text-amber-300">الملف التراكمي للوكالة</span>
          </button>
          
          <!-- قائمة الثلاث نقاط المنسدلة -->
          <div id="hostMoreMenuDropdown" class="hidden absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-2 border-slate-300 p-2 z-50 text-right animate-in fade-in zoom-in-95 duration-150">
            <div class="px-2.5 py-1.5 border-b border-slate-200 text-[11px] text-slate-500 font-bold flex items-center justify-between">
              <span>خيارات الوكالة</span>
              <span class="font-mono text-slate-700 font-bold">${parentAgency.id}</span>
            </div>
            <button 
              type="button" 
              onclick="window.toggleHostMoreMenu(false); window.closeHostProfileModal(); window.openAgencyCumulativeModal('${host.agencyId}')" 
              class="w-full p-2.5 rounded-xl hover:bg-amber-50 text-slate-900 hover:text-amber-950 font-bold text-xs flex items-center justify-between gap-2 transition cursor-pointer mt-1">
              <span class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">📊</span>
                <span class="font-black text-slate-950">الملف التراكمي للوكالة</span>
              </span>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">عرض ◀</span>
            </button>
            <button 
              type="button" 
              onclick="window.toggleHostMoreMenu(false); window.closeHostProfileModal(); window.switchTab('agencies'); if(typeof window.openAgencyDetail==='function') window.openAgencyDetail('${host.agencyId}', 'overview');" 
              class="w-full p-2.5 rounded-xl hover:bg-sky-50 text-slate-900 hover:text-sky-950 font-bold text-xs flex items-center justify-between gap-2 transition cursor-pointer">
              <span class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold">🏢</span>
                <span class="font-bold text-slate-900">لوحة بيانات الوكالة</span>
              </span>
              <span class="text-[10px] text-slate-500">تفاصيل</span>
            </button>
          </div>
        </div>

        <!-- زر الثلاث شرط ☰ لفتح قائمة الخيارات والتدقيق الجانبية -->
        <button 
          type="button" 
          onclick="window.toggleHostDrawerMenu()" 
          class="flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition cursor-pointer shadow-sm border border-purple-400/50 group active:scale-95"
          title="قائمة الخيارات والتدقيق الإداري (☰)">
          <span class="text-base font-bold leading-none">☰</span>
          <span class="hidden sm:inline">خيارات وتدقيق الملف</span>
        </button>

        <!-- زر إغلاق الملف -->
        <button 
          type="button" 
          onclick="window.closeHostProfileModal()" 
          class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer text-sm font-bold active:scale-95"
          title="إغلاق">
          ✕
        </button>
      </div>
    </div>

    <!-- Body: Minimalist UI (الشاشة الرئيسية للملف - الظاهر فقط بشكل دائم) -->
    <div class="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[78vh] bg-slate-50 text-slate-950 text-right">
      
      <!-- 1. كارت تعريف المضيف (الاسم، الـ ID، اسم الوكالة، الحالة) -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-sm">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div class="relative shrink-0">
            <img src="${host.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}" class="w-20 h-20 rounded-2xl object-cover border-2 border-purple-400 shadow-md" alt="${host.name}">
            <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isLive ? 'bg-emerald-500' : 'bg-slate-400'}" title="${isLive ? 'متصل الآن' : 'غير متصل'}"></span>
          </div>

          <div class="flex-1 text-center sm:text-right space-y-2 w-full">
            <div class="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
              <h3 class="text-lg font-black text-slate-950">${host.name}</h3>
              <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-lg text-xs font-bold">${host.status || 'نشط معتمد'}</span>
              <span class="px-2.5 py-0.5 bg-purple-100 text-purple-900 border border-purple-300 rounded-lg text-xs font-bold">${host.category || 'صوتيات وغناء'}</span>
              ${hasActivePenalty ? `
                <span class="px-2 py-0.5 bg-rose-100 text-rose-900 border border-rose-300 rounded-lg text-xs font-bold animate-pulse">⚠️ عقوبة مسجلة</span>
              ` : ''}
            </div>

            <!-- Identifiers & Agency Info (أفقي ومحدد بدقة) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span class="text-slate-500 font-bold">المعرف الموحد (ID):</span>
                <span class="font-mono font-black text-slate-950">#${host.userId}</span>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span class="text-slate-500 font-bold">معرف المضيف بالوكالة:</span>
                <span class="font-mono font-black text-purple-700">${host.id}</span>
              </div>

              <div class="p-2.5 rounded-xl bg-sky-50/60 border border-sky-200 flex items-center justify-between sm:col-span-2">
                <span class="text-sky-900 font-bold flex items-center gap-1.5">
                  <i data-lucide="building-2" class="w-3.5 h-3.5 text-sky-700"></i>
                  <span>الوكالة التابع لها:</span>
                </span>
                <span class="font-black text-slate-950">
                  ${parentAgency.name} <span class="font-mono text-sky-800 text-[11px]">(${parentAgency.id})</span>
                </span>
              </div>
            </div>

            <!-- كرت كشف حساب وتدقيق المضيف الشامل مع الطباعة (في مكان كارت المضيف) -->
            <div class="pt-1.5">
              <button 
                type="button" 
                onclick="window.openHostAuditModal('statement')" 
                class="w-full p-3 rounded-2xl bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-950 hover:from-purple-900 hover:to-slate-900 text-white font-black text-xs transition flex items-center justify-between gap-2 shadow-md border-2 border-purple-400/50 cursor-pointer group active:scale-[0.99]">
                <div class="flex items-center gap-2.5 text-right">
                  <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-amber-300 text-base shadow-xs shrink-0 ring-1 ring-white/30">
                    📑
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs sm:text-sm font-black text-white">كشف حساب وتدقيق المضيف (Host Statement & Audit)</span>
                      <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-200 border border-amber-300/40 font-bold">شامل الدخل والخرج</span>
                    </div>
                    <span class="block text-[11px] text-purple-200/90 font-medium mt-0.5">كشف وتدقيق إجمالي كامل مع الطباعة بكل حركات الدخل والخرج وحسم النزاعات</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-xl border border-amber-300 font-black text-xs shadow-xs transition">
                  <i data-lucide="printer" class="w-4 h-4 text-slate-950"></i>
                  <span>عرض الكشف والطباعة 🖨️</span>
                </div>
              </button>
            </div>

            <!-- Extra Meta Line (سطر أفقي أنيق) -->
            <div class="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 font-medium pt-0.5 flex-wrap">
              <span>الوكيل الرسمي: <strong class="text-slate-900">${parentAgency.owner}</strong></span>
              <span class="text-slate-300">•</span>
              <span>المشرف المباشر: <strong class="text-slate-900">${host.brokerName || 'مباشر مع الوكالة'}</strong></span>
              <span class="text-slate-300">•</span>
              <span>تاريخ الانضمام: <strong class="font-mono text-slate-900">${host.joinDate || '2026-01-05'}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. ملخص البث والدخل (ساعات البث، إجمالي الدخل لهذا الشهر بالدولار/الكوينز) -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-sm space-y-3">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2.5 flex-wrap gap-2">
          <h4 class="text-xs sm:text-sm font-black text-slate-950 flex items-center gap-2">
            <i data-lucide="activity" class="w-4 h-4 text-purple-600"></i>
            <span>ملخص أداء البث والدخل الشهري المعتمد (سبتمبر 2026)</span>
          </h4>
          <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-950 border border-emerald-300">
            ${payoutStatus}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <!-- 1. ساعات البث لهذا الشهر -->
          <div class="bg-[#f7fbfd] rounded-2xl border-2 border-sky-300 p-4 space-y-1">
            <span class="text-xs font-bold text-sky-950 flex items-center gap-1.5">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-sky-700"></i>
              <span>ساعات البث لهذا الشهر</span>
            </span>
            <div class="flex items-baseline gap-1.5 pt-1">
              <span class="text-2xl font-black text-sky-950 font-mono">${host.streamHours || 142}</span>
              <span class="text-xs font-bold text-sky-800">ساعة بث</span>
            </div>
            <div class="text-[11px] text-sky-900 font-bold flex items-center justify-between pt-1 border-t border-sky-200/60">
              <span>التارجت المطلوب: 120 ساعة</span>
              <span class="text-emerald-700">118% منجز ✅</span>
            </div>
          </div>

          <!-- 2. إجمالي الدخل بالكوينز لهذا الشهر -->
          <div class="bg-amber-50/70 rounded-2xl border-2 border-amber-300 p-4 space-y-1">
            <span class="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <i data-lucide="coins" class="w-3.5 h-3.5 text-amber-700"></i>
              <span>إجمالي دخل الكوينز (🪙)</span>
            </span>
            <div class="flex items-baseline gap-1.5 pt-1">
              <span class="text-2xl font-black text-amber-950 font-mono">${Number(totalCoins).toLocaleString()}</span>
              <span class="text-xs font-bold text-amber-800">🪙 كوينز</span>
            </div>
            <div class="text-[11px] text-amber-900 font-bold flex items-center justify-between pt-1 border-t border-amber-200/60">
              <span>الهدايا + ألعاب الكوينز</span>
              <span class="text-emerald-800">معتمد في الراتب</span>
            </div>
          </div>

          <!-- 3. صافي الدخل الإجمالي بالدولار ($) -->
          <div class="bg-slate-900 text-white rounded-2xl border-2 border-slate-800 p-4 space-y-1 shadow-md">
            <span class="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <i data-lucide="dollar-sign" class="w-3.5 h-3.5 text-emerald-400"></i>
              <span>صافي الدخل الإجمالي بالدولار ($)</span>
            </span>
            <div class="flex items-baseline gap-1.5 pt-1">
              <span class="text-2xl font-black text-emerald-300 font-mono">$${totalHostIncomeUsd.toLocaleString()}</span>
              <span class="text-xs font-bold text-emerald-400">USD</span>
            </div>
            <div class="text-[11px] text-slate-300 font-medium flex items-center justify-between pt-1 border-t border-slate-800">
              <span>الأساسي: $${baseSalaryUsd.toLocaleString()}</span>
              <span class="text-purple-300 font-bold">+ حافز: $${agencyBonusUsd.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <!-- Bank & Payout Strip -->
        <div class="bg-slate-50 rounded-xl border border-slate-200 p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-2 text-slate-800">
            <i data-lucide="landmark" class="w-4 h-4 text-slate-600 shrink-0"></i>
            <span class="font-bold">الحساب البنكي المعتمد للصرف:</span>
            <span class="font-mono font-bold text-slate-950">${bankIban}</span>
          </div>
          <span class="font-bold text-slate-600">${bankName}</span>
        </div>
      </div>

      <!-- تنبيه إرشادي يشير إلى قائمة الخيارات في الزاوية ☰ -->
      <div class="p-3.5 bg-purple-50/80 rounded-2xl border-2 border-purple-200 flex items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2.5 text-purple-950 font-medium">
          <span class="text-lg">☰</span>
          <span>
            لعرض <strong>كشف الهدايا، أرباح الألعاب، الشحنات، العقوبات، الحوالات، الأجهزة، وتحديات PK</strong>: انقر على زر القائمة <strong>(☰)</strong> في الزاوية العلوية.
          </span>
        </div>
        <button 
          type="button" 
          onclick="window.toggleHostDrawerMenu()" 
          class="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs transition cursor-pointer shrink-0 shadow-xs">
          فتح خيارات الملف ☰
        </button>
      </div>

    </div>

    <!-- Actions Footer (مختصر ونظيف لإعطاء الشاشة أقصى مساحة ووضوح) -->
    <div class="p-3 sm:p-4 bg-slate-100 border-t-2 border-slate-300 flex items-center justify-between gap-3 shrink-0">
      <div class="text-xs text-slate-600 font-bold flex items-center gap-2 flex-wrap">
        <span>رمز الوكالة: <strong class="text-slate-950 font-mono">${parentAgency.id}</strong></span>
        <span class="text-slate-300">•</span>
        <span>معرف المضيف: <strong class="text-slate-950 font-mono">${host.id}</strong></span>
      </div>

      <div class="flex items-center gap-2">
        <!-- زر إغلاق -->
        <button 
          type="button" 
          onclick="window.closeHostProfileModal()" 
          class="px-5 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition cursor-pointer shadow-2xs active:scale-95">
          إغلاق
        </button>
      </div>
    </div>

    <!-- ☰ Drawer Menu (قائمة الخيارات الجانبية لملف المضيف وفق نظام الصلاحيات RBAC) -->
    <div id="hostProfileDrawerBackdrop" onclick="window.toggleHostDrawerMenu(false)" class="hidden absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity"></div>
    
    <div id="hostProfileDrawerPanel" class="hidden absolute inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l-2 border-slate-300 flex flex-col text-right transition-all duration-300">
      <!-- Drawer Header -->
      <div class="p-4 bg-gradient-to-r from-slate-950 to-purple-950 text-white flex items-center justify-between border-b-2 border-purple-800 shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-base font-black">
            ☰
          </div>
          <div>
            <h3 class="text-sm font-black text-white">خيارات وتدقيق ملف المضيف</h3>
            <p class="text-[11px] text-purple-200">الأقسام التفصيلية وحسم النزاعات الإدارية</p>
          </div>
        </div>
        <button 
          type="button" 
          onclick="window.toggleHostDrawerMenu(false)" 
          class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer font-bold text-sm"
          title="إغلاق القائمة">
          ✕
        </button>
      </div>

      <!-- RBAC Status Bar -->
      <div class="px-4 py-2.5 bg-purple-50 border-b border-purple-200 flex items-center justify-between text-xs">
        <div class="flex items-center gap-1.5 text-purple-950 font-bold">
          <i data-lucide="shield-check" class="w-4 h-4 text-purple-700"></i>
          <span>صلاحيات المشرف: <strong class="font-mono text-purple-900">${currentAdminRole}</strong></span>
        </div>
        <span class="text-[11px] px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 font-bold">مفعل (RBAC)</span>
      </div>

      <!-- Drawer Items List -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2.5">
        ${drawerItemsHtml}
      </div>

      <!-- Drawer Footer -->
      <div class="p-3 bg-slate-100 border-t border-slate-300 flex items-center justify-between text-xs shrink-0">
        <div class="text-slate-600 text-[11px]">
          المضيف: <strong class="text-slate-900 font-mono">${host.name}</strong>
        </div>
        <button 
          type="button" 
          onclick="window.toggleHostDrawerMenu(false)" 
          class="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition cursor-pointer shadow-2xs">
          إغلاق ✕
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
};

window.toggleHostDrawerMenu = function(forceState) {
  const drawer = document.getElementById('hostProfileDrawerPanel');
  const backdrop = document.getElementById('hostProfileDrawerBackdrop');
  if (!drawer) return;
  const isOpening = forceState !== undefined ? forceState : drawer.classList.contains('hidden');
  if (isOpening) {
    if (typeof window.toggleHostMoreMenu === 'function') window.toggleHostMoreMenu(false);
    drawer.classList.remove('hidden');
    if (backdrop) backdrop.classList.remove('hidden');
  } else {
    drawer.classList.add('hidden');
    if (backdrop) backdrop.classList.add('hidden');
  }
  if (window.lucide) lucide.createIcons();
};

window.toggleHostMoreMenu = function(forceState) {
  const menu = document.getElementById('hostMoreMenuDropdown');
  if (!menu) return;
  const isOpening = forceState !== undefined ? forceState : menu.classList.contains('hidden');
  if (isOpening) {
    if (typeof window.toggleHostDrawerMenu === 'function') window.toggleHostDrawerMenu(false);
    menu.classList.remove('hidden');
  } else {
    menu.classList.add('hidden');
  }
};

window.closeHostProfileModal = function() {
  const modal = document.getElementById('globalHostProfileModal');
  if (modal) modal.classList.add('hidden');
  const moreMenu = document.getElementById('hostMoreMenuDropdown');
  if (moreMenu) moreMenu.classList.add('hidden');
  const drawer = document.getElementById('hostProfileDrawerPanel');
  if (drawer) drawer.classList.add('hidden');
  const backdrop = document.getElementById('hostProfileDrawerBackdrop');
  if (backdrop) backdrop.classList.add('hidden');
};

// Close Host Audit Sub-Modal
window.closeHostAuditSubModal = function() {
  const subModal = document.getElementById('hostAuditSubModal');
  if (subModal) subModal.classList.add('hidden');
};

// Open Specific Audit Sub-Modal (Modular / Lazy Loaded Modals for dispute settlement)
window.openHostAuditModal = function(moduleType) {
  const hostData = window._currentActiveHostData;
  if (!hostData || !hostData.host) {
    alert('يرجى فتح ملف المضيف أولاً.');
    return;
  }
  const { host, rechargeHistory, devicesUsed, banHistory, hostGamesData, hostPenaltiesList, hostWithdrawalsList, hostPkBattlesList, hostThemesList, hostGiftsList, badgesList } = hostData;
  const subModal = document.getElementById('hostAuditSubModal');
  const subContent = document.getElementById('hostAuditSubModalContent');
  if (!subModal || !subContent) return;

  let title = '';
  let badgeText = '';
  let iconName = '';
  let iconColor = '';
  let bodyHtml = '';

  switch (moduleType) {
    case 'statement':
      title = 'كشف حساب وتدقيق المضيف الشامل (Host Statement & Comprehensive Audit Ledger)';
      badgeText = 'كشف وتدقيق شامل وطباعة 🖨️';
      iconName = 'file-text';
      iconColor = 'bg-gradient-to-br from-purple-700 to-indigo-800 text-white shadow-xs';

      {
        const agencyInfo = (hostData.parentAgency) || (window._currentActiveHostData && window._currentActiveHostData.parentAgency) || { name: 'وكالة النخبة الرسمية', id: host.agencyId || 'AG-103', owner: 'عبدالله بن فهد' };
        const rawRecs = rechargeHistory || [];
        const rawGiftsList = hostGiftsList || window._allHostGiftsRaw || [];
        const rawGames = (hostGamesData && hostGamesData.goldGames) ? hostGamesData.goldGames : [];
        const rawWths = hostWithdrawalsList || [];
        const rawPens = hostPenaltiesList || [];

        // Construct Inflow & Outflow Unified Transactions
        const stmtInflowRecords = [
          ...rawRecs.map((r, idx) => ({
            id: r.id || `REC-${idx + 101}`,
            refId: r.id || `REC-${idx + 101}`,
            date: r.date || '2026-09-08 18:20',
            direction: 'INFLOW',
            directionLabel: 'دخل وارد 🟢',
            badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-300',
            category: 'شحن وتعبئة كوينز',
            detail: `شحن كوينز عبر ${r.sourceType || 'الوكيل'} (${r.sourceDetail || ''})`,
            source: r.sourceDetail || 'وكيل شحن معتمد',
            target: host.name,
            coins: r.amountCoins || 0,
            usd: Number(((r.amountCoins || 0) / 10000).toFixed(2)),
            paymentMethod: r.paymentMethod || 'وكيل رسمي معتمد',
            notes: 'شحن رصيد خزينة المضيف معتمد ومطابق 100%',
            status: r.status || 'مكتمل ✅'
          })),
          ...rawGiftsList.map((g, idx) => ({
            id: `GFT-${idx + 101}`,
            refId: `REF-GIFT-${idx + 301}`,
            date: (g.date || '2026-09-08') + ' 21:00',
            direction: 'INFLOW',
            directionLabel: 'دخل وارد 🟢',
            badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-300',
            category: 'هدية بث مباشر',
            detail: `هدية (${g.name}) بعدد ${g.count} مرات من الداعم: ${g.sender}`,
            source: `الداعم: ${g.sender}`,
            target: host.name,
            coins: g.coins || 0,
            usd: Number(((g.coins || 0) / 10000).toFixed(2)),
            paymentMethod: 'إهداء مباشر في الروم الصوتي',
            notes: 'موثقة ومطابقة لسجل هدايا الروم ومحسوبة للراتب والتارجت',
            status: 'معتمد للراتب والتارجت ✅'
          })),
          ...rawGames.map((gm, idx) => ({
            id: `GM-${idx + 1}`,
            refId: `REF-GAME-${idx + 101}`,
            date: '2026-09-08 22:30',
            direction: 'INFLOW',
            directionLabel: 'دخل وارد 🟢',
            badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-300',
            category: 'أرباح ألعاب ذهبية',
            detail: `أرباح لعبة (${gm.name}) - كوينز ذهبية صافية`,
            source: 'خزينة الألعاب المركزية',
            target: host.name,
            coins: gm.netCoins || 35000,
            usd: Number(((gm.netCoins || 35000) / 10000).toFixed(2)),
            paymentMethod: 'نظام الألعاب المباشر',
            notes: 'كوينز ذهبية معزولة عن الفضية ومحسوبة بالراتب الرسمي',
            status: 'معتمد ومضاف للرصيد ✅'
          })),
          {
            id: `BONUS-${host.id}-01`,
            refId: `REF-BONUS-8841`,
            date: '2026-09-05 16:00',
            direction: 'INFLOW',
            directionLabel: 'دخل وارد 🟢',
            badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-300',
            category: 'حافز وبونص إداري',
            detail: 'مكافأة تحقيق ساعات البث والتفاعل الأسبوعي من الإدارة العليا',
            source: 'الإدارة العليا ومجلس الرقابة',
            target: host.name,
            coins: 350000,
            usd: 35.00,
            paymentMethod: 'اعتماد ومكافأة مباشرة',
            notes: 'مكافأة تشجيعية رسمية معتمدة',
            status: 'معتمد ومصروف ✅'
          }
        ];

        const stmtOutflowRecords = [
          ...rawWths.map((w, idx) => ({
            id: w.id || `WTH-${idx + 1}`,
            refId: w.referenceId || w.id || `REF-WIRE-${idx + 8800}`,
            date: w.date || '2026-09-01 11:30',
            direction: 'OUTFLOW',
            directionLabel: 'خرج صادر 🔴',
            badgeClass: 'bg-rose-100 text-rose-950 border-rose-300',
            category: 'سحب أرباح / حوالة بنكية',
            detail: `صرف أرباح وتحويل بنكي: ${w.method}`,
            source: host.name,
            target: host.bankAccount ? `${host.bankAccount.name} (${host.bankAccount.iban})` : 'الحساب البنكي المعتمد للمضيف',
            coins: (w.amountUsd || 0) * 10000,
            usd: Number((w.amountUsd || 0).toFixed(2)),
            paymentMethod: w.method || 'تحويل بنكي دولي',
            notes: `حوالة بنكية مؤكدة بسويفت ومرجع: ${w.referenceId || 'REF-WIRE-8841'}`,
            status: w.status || 'مسلّم ومؤكد بنكياً ✅'
          })),
          ...rawPens.map((p, idx) => ({
            id: p.id || `PEN-${idx + 1}`,
            refId: p.id || `PEN-${idx + 1}`,
            date: p.date || '2026-08-20 14:00',
            direction: 'OUTFLOW',
            directionLabel: 'خرج صادر 🔴',
            badgeClass: 'bg-rose-100 text-rose-950 border-rose-300',
            category: 'استقطاع جزائي وخصم مالي',
            detail: `خصم إداري: ${p.reason}`,
            source: host.name,
            target: 'صندوق الجزاءات والرقابة الإدارية',
            coins: (p.deductionUsd || 150) * 10000,
            usd: Number((p.deductionUsd || 150).toFixed(2)),
            paymentMethod: 'استقطاع آلي من مستحقات الشهر',
            notes: `المشرف المنفذ: ${p.byAdmin || 'المشرف الإداري نايف الحربي'}`,
            status: 'منفذ ومستقطع رسمياً'
          }))
        ];

        // Combine & sort chronologically descending
        const allStmtRecords = [...stmtInflowRecords, ...stmtOutflowRecords].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        // Running balance forwards
        let currentRunningCoins = 0;
        [...allStmtRecords].reverse().forEach(item => {
          const prev = currentRunningCoins;
          if (item.direction === 'INFLOW') {
            currentRunningCoins += item.coins;
          } else {
            currentRunningCoins -= item.coins;
          }
          item.balanceBefore = prev;
          item.balanceAfter = currentRunningCoins;
        });

        // Totals
        const totalInflowCoins = stmtInflowRecords.reduce((sum, r) => sum + r.coins, 0);
        const totalInflowUsd = Number(stmtInflowRecords.reduce((sum, r) => sum + r.usd, 0).toFixed(2));
        const totalOutflowCoins = stmtOutflowRecords.reduce((sum, r) => sum + r.coins, 0);
        const totalOutflowUsd = Number(stmtOutflowRecords.reduce((sum, r) => sum + r.usd, 0).toFixed(2));
        const netCoins = totalInflowCoins - totalOutflowCoins;
        const netUsd = Number((totalInflowUsd - totalOutflowUsd).toFixed(2));

        // Dispute notes from localStorage
        let disputeNotesList = [];
        try {
          disputeNotesList = JSON.parse(localStorage.getItem('host_statement_dispute_notes_' + host.id) || '[]');
        } catch (e) {
          disputeNotesList = [];
        }
        if (disputeNotesList.length === 0) {
          disputeNotesList = [
            {
              id: 'NOTE-01',
              date: '2026-09-08 19:30',
              author: 'المشرف العام (Super Admin)',
              text: 'تمت مطابقة حركات شحن الوكلاء والهدايا وأرباح الألعاب الذهبية مع تقرير السيرفر، والحساب مطابق تماماً بدون أي فروقات أو نزاعات.',
              status: 'معتمد ومغلق ✅'
            }
          ];
        }

        // Store in global state
        window._currentHostStatementState = {
          host,
          parentAgency: agencyInfo,
          allRecords: allStmtRecords,
          currentFiltered: allStmtRecords,
          activeDirection: 'ALL',
          activePeriod: 'all',
          searchQuery: '',
          totalInflowCoins,
          totalInflowUsd,
          totalOutflowCoins,
          totalOutflowUsd,
          netCoins,
          netUsd,
          disputeNotesList
        };

        bodyHtml = `
          <div class="space-y-4 text-right">
            <!-- 1. شريط تعريف المضيف والوكالة -->
            <div class="p-3.5 rounded-2xl bg-white border-2 border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div class="flex items-center gap-3 w-full sm:w-auto">
                <img src="${host.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}" class="w-12 h-12 rounded-xl object-cover border-2 border-purple-400 shrink-0" alt="${host.name}" />
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <h4 class="text-sm sm:text-base font-black text-slate-950">${host.name}</h4>
                    <span class="font-mono text-xs px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-300 font-black">#${host.userId}</span>
                    <span class="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">${host.status || 'نشط معتمد'}</span>
                  </div>
                  <div class="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                    <span>الوكالة: <strong class="text-slate-900">${agencyInfo.name} (${agencyInfo.id})</strong></span>
                    <span class="text-slate-300">•</span>
                    <span>الوكيل: <strong class="text-slate-900">${agencyInfo.owner}</strong></span>
                    <span class="text-slate-300">•</span>
                    <span>ساعات البث: <strong class="text-slate-900 font-mono">${host.streamHours || 142} س</strong></span>
                  </div>
                </div>
              </div>

              <!-- أزرار الإجراءات السريعة في الهيدر -->
              <div class="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                <button 
                  type="button" 
                  onclick="window.printOfficialHostStatement()" 
                  class="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer border border-slate-800 active:scale-95">
                  <i data-lucide="printer" class="w-4 h-4 text-amber-300"></i>
                  <span>طباعة الكشف الرسمي 🖨️</span>
                </button>

                <button 
                  type="button" 
                  onclick="window.exportHostStatementCsv()" 
                  class="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs">
                  <i data-lucide="download" class="w-4 h-4"></i>
                  <span>تصدير CSV</span>
                </button>

                <button 
                  type="button" 
                  onclick="window.openHostStatementDisputePrompt()" 
                  class="px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer">
                  <i data-lucide="message-square-plus" class="w-4 h-4 text-purple-700"></i>
                  <span>توثيق ملاحظة / نزاع ✍️</span>
                </button>

                <button 
                  type="button" 
                  onclick="window.closeHostAuditSubModal(); window.navigateToHostAudit('${host.userId || host.id}')" 
                  class="px-3 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-950 border border-sky-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  title="عرض شاشة التدقيق الشاملة للوكالات">
                  <i data-lucide="external-link" class="w-4 h-4 text-sky-700"></i>
                  <span>الشاشة الموسعة</span>
                </button>
              </div>
            </div>

            <!-- 2. كروت المؤشرات المالية الإجمالية (KPI Summary) -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <!-- إجمالي حركات الدخل (الوارد) -->
              <div class="p-3.5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/70 shadow-2xs">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black text-emerald-950">إجمالي الدخل (الوارد) 🟢</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-black">${stmtInflowRecords.length} حركة</span>
                </div>
                <div class="text-base sm:text-lg font-black font-mono text-emerald-950 mt-1.5">${totalInflowCoins.toLocaleString()} 🪙</div>
                <div class="text-xs font-black text-emerald-800 mt-0.5">$${totalInflowUsd.toLocaleString()} USD</div>
                <div class="text-[10px] text-emerald-700 mt-1 font-bold">شحنات + هدايا + ألعاب ذهبية + بونص</div>
              </div>

              <!-- إجمالي حركات الخرج (الصادر) -->
              <div class="p-3.5 rounded-2xl border-2 border-rose-200 bg-rose-50/70 shadow-2xs">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black text-rose-950">إجمالي الخرج (الصادر) 🔴</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 text-rose-950 font-black">${stmtOutflowRecords.length} حركة</span>
                </div>
                <div class="text-base sm:text-lg font-black font-mono text-rose-950 mt-1.5">${totalOutflowCoins.toLocaleString()} 🪙</div>
                <div class="text-xs font-black text-rose-800 mt-0.5">$${totalOutflowUsd.toLocaleString()} USD</div>
                <div class="text-[10px] text-rose-700 mt-1 font-bold">مسحوبات بنكية + استقطاعات وخصومات</div>
              </div>

              <!-- صافي الاستحقاق والرصيد (Net Balance) -->
              <div class="p-3.5 rounded-2xl border-2 border-purple-200 bg-purple-50/70 shadow-2xs">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black text-purple-950">صافي الرصيد المتبقي (Net) ⚖️</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-200 text-purple-950 font-black">معتمد</span>
                </div>
                <div class="text-base sm:text-lg font-black font-mono text-purple-950 mt-1.5">${netCoins.toLocaleString()} 🪙</div>
                <div class="text-xs font-black text-purple-800 mt-0.5">$${netUsd.toLocaleString()} USD</div>
                <div class="text-[10px] text-purple-700 mt-1 font-bold">رصيد الأرباح الحالي المتاح للصرف</div>
              </div>

              <!-- حالة المطابقة المحاسبية والتوثيق -->
              <div class="p-3.5 rounded-2xl border-2 border-sky-200 bg-sky-50/70 shadow-2xs">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black text-sky-950">حالة المطابقة المحاسبية ✅</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-sky-200 text-sky-950 font-black">100%</span>
                </div>
                <div class="text-sm font-black text-sky-950 mt-2 flex items-center gap-1.5">
                  <span>مطابق وموثق بالكامل</span>
                </div>
                <div class="text-xs font-bold text-sky-800 mt-0.5">صفر فروقات مالية بالسيرفر</div>
                <div class="text-[10px] text-sky-700 mt-1 font-bold">معتمد لفض النزاعات الإدارية</div>
              </div>
            </div>

            <!-- 3. شريط الفلاتر والبحث التفاعلي -->
            <div class="p-3 rounded-2xl bg-white border-2 border-slate-300 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
              <div class="flex items-center gap-2 flex-wrap">
                <!-- أزرار نوع الحركة -->
                <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-300 font-bold">
                  <button 
                    type="button" 
                    id="stmtBtnAll" 
                    onclick="window.filterHostStatementDirection('ALL')" 
                    class="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-black transition cursor-pointer">
                    جميع الحركات (${allStmtRecords.length})
                  </button>
                  <button 
                    type="button" 
                    id="stmtBtnIn" 
                    onclick="window.filterHostStatementDirection('INFLOW')" 
                    class="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-emerald-100 hover:text-emerald-950 text-xs font-bold transition cursor-pointer">
                    الدخل والوارد 🟢 (${stmtInflowRecords.length})
                  </button>
                  <button 
                    type="button" 
                    id="stmtBtnOut" 
                    onclick="window.filterHostStatementDirection('OUTFLOW')" 
                    class="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-rose-100 hover:text-rose-950 text-xs font-bold transition cursor-pointer">
                    الخرج والصادر 🔴 (${stmtOutflowRecords.length})
                  </button>
                </div>

                <!-- فلترة الفترة -->
                <div class="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-300">
                  <i data-lucide="calendar" class="w-3.5 h-3.5 text-slate-500"></i>
                  <select 
                    id="stmtPeriodSelect" 
                    onchange="window.filterHostStatementPeriod(this.value)" 
                    class="bg-transparent font-bold text-slate-900 text-xs focus:outline-none cursor-pointer">
                    <option value="all">كامل الفترة المعتمدة</option>
                    <option value="2026-09" selected>الشهر الحالي (سبتمبر 2026)</option>
                    <option value="2026-08">الشهر السابق (أغسطس 2026)</option>
                    <option value="2026-07">شهر يوليو 2026</option>
                  </select>
                </div>
              </div>

              <!-- البحث السريع في السجلات -->
              <div class="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
                <div class="relative w-full sm:w-64">
                  <input 
                    type="text" 
                    id="stmtSearchInput" 
                    oninput="window.searchHostStatementRecords(this.value)" 
                    placeholder="بحث بالرقم المرجعي أو البيان أو المصدر..." 
                    class="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-950 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
                  <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5"></i>
                </div>
              </div>
            </div>

            <!-- 4. جدول الحركات التفصيلي الموحد (Master Transactions Ledger) -->
            <div class="rounded-2xl border-2 border-slate-300 bg-white overflow-hidden table-subtle-shadow">
              <div class="p-3 bg-slate-100/90 border-b border-slate-300 flex items-center justify-between flex-wrap gap-2 text-xs">
                <span class="font-black text-slate-900 flex items-center gap-1.5">
                  <i data-lucide="list-ordered" class="w-4 h-4 text-purple-700"></i>
                  <span>سجل الحركات المالية الموحد والمطابق لمحفظة المضيف</span>
                </span>
                <span id="stmtRecordsCountBadge" class="font-mono font-black px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-950 border border-purple-300">
                  ${allStmtRecords.length} حركة مسجلة
                </span>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-right text-xs whitespace-nowrap">
                  <thead class="bg-slate-100 text-slate-950 font-black border-b-2 border-slate-400">
                    <tr>
                      <th class="py-3 px-3.5 border-l border-slate-200">الرقم المرجعي والتاريخ</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200">الاتجاه</th>
                      <th class="py-3 px-3 border-l border-slate-200">التصنيف والبيان</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200">المبلغ بالكوينز</th>
                      <th class="py-3 px-3 text-center border-l border-slate-200">المقابل ($ USD)</th>
                      <th class="py-3 px-3 border-l border-slate-200">المصدر / جهة التغذية</th>
                      <th class="py-3 px-3 border-l border-slate-200">المستلم / جهة الصرف</th>
                      <th class="py-3 px-3 border-l border-slate-200">وسيلة الدفع والتحويل</th>
                      <th class="py-3 px-3 border-l border-slate-200">ملاحظات التدقيق وحسم النزاع</th>
                      <th class="py-3 px-3 text-center">حالة الاعتماد</th>
                    </tr>
                  </thead>
                  <tbody id="hostStatementTableBody" class="divide-y divide-slate-300">
                    ${window.renderHostStatementRowsHtml ? window.renderHostStatementRowsHtml(allStmtRecords) : ''}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 5. قسم ملاحظات التدقيق وفض النزاعات الإدارية -->
            <div class="p-4 rounded-2xl bg-white border-2 border-slate-300 space-y-2.5 shadow-2xs">
              <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                <h5 class="text-xs font-black text-slate-950 flex items-center gap-2">
                  <i data-lucide="shield-check" class="w-4 h-4 text-purple-700"></i>
                  <span>سجل ملاحظات التدقيق وفض النزاعات الإدارية المعتمدة للمضيف</span>
                </h5>
                <button 
                  type="button" 
                  onclick="window.openHostStatementDisputePrompt()" 
                  class="text-xs font-black text-purple-700 hover:text-purple-900 underline flex items-center gap-1 cursor-pointer">
                  <span>+ إضافة ملاحظة رسمية جديدة</span>
                </button>
              </div>

              <div id="hostStatementDisputeNotesContainer" class="space-y-2">
                ${disputeNotesList.map(n => `
                  <div class="p-3 rounded-xl bg-purple-50/60 border border-purple-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div class="space-y-0.5">
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-slate-900">${n.author}</span>
                        <span class="font-mono text-[11px] text-slate-500">${n.date}</span>
                        <span class="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">${n.status || 'معتمد'}</span>
                      </div>
                      <p class="text-slate-800 font-medium">${n.text}</p>
                    </div>
                    <div class="font-mono text-[11px] text-purple-800 font-bold shrink-0">
                      ID: ${n.id}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      }
      break;

    case 'gifts':
      title = 'كشف الهدايا المستلمة ومصادر الدعم (مع التقويم وتواريخ الاستلام)';
      badgeText = 'تدقيق الإيرادات والهدايا';
      iconName = 'gift';
      iconColor = 'bg-rose-100 text-rose-800';
      const giftsList = hostGiftsList || window._allHostGiftsRaw || [];
      const totalCoinsFromGifts = giftsList.reduce((acc, c) => acc + c.coins, 0);
      bodyHtml = `
        <div class="space-y-4">
          <!-- Filter Controls Bar -->
          <div class="p-3.5 rounded-2xl bg-white border-2 border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-xs">
            <div class="flex items-center gap-2 w-full md:w-auto">
              <span class="font-bold text-slate-700 flex items-center gap-1.5 shrink-0">
                <i data-lucide="calendar" class="w-4 h-4 text-purple-600"></i>
                <span>فلترة بحسب تاريخ محدد:</span>
              </span>
              <input 
                type="date" 
                id="hostGiftDatePicker" 
                onchange="window.filterHostGiftsByDate('custom', this.value)"
                class="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer" />
            </div>

            <div class="flex items-center gap-1.5 flex-wrap w-full md:w-auto justify-end">
              <button 
                type="button" 
                onclick="window.filterHostGiftsByDate('current_month')"
                class="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold border border-purple-300 transition cursor-pointer">
                الشهر الحالي (سبتمبر)
              </button>
              <button 
                type="button" 
                onclick="window.filterHostGiftsByDate('last_month')"
                class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 transition cursor-pointer">
                الشهر الماضي (أغسطس)
              </button>
              <button 
                type="button" 
                onclick="window.filterHostGiftsByDate('all')"
                class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 transition cursor-pointer">
                كامل السجل (السنة كاملة)
              </button>
            </div>
          </div>

          <!-- Total Info Strip -->
          <div class="p-3 bg-rose-50 rounded-2xl border-2 border-rose-200 text-xs text-rose-950 flex items-center justify-between flex-wrap gap-2">
            <span class="font-bold">إجمالي كوينز الهدايا المسجلة: <strong class="font-mono text-sm text-rose-900">${totalCoinsFromGifts.toLocaleString()} 🪙</strong></span>
            <span class="text-rose-800 font-bold">جميع الهدايا موثقة بأرقام الداعمين وتُحسب 100% لتارجت الراتب المالي</span>
          </div>

          <!-- Gifts Table -->
          <div id="hostGiftsTableContainer" class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-right text-xs whitespace-nowrap">
              <thead class="bg-slate-100 text-slate-950 font-black border-b border-slate-300">
                <tr>
                  <th class="py-2.5 px-3 border-l border-slate-200">الهدية</th>
                  <th class="py-2.5 px-3 text-center border-l border-slate-200">العدد المستلم</th>
                  <th class="py-2.5 px-3 text-center border-l border-slate-200">القيمة بالكوينز</th>
                  <th class="py-2.5 px-3 border-l border-slate-200">أبرز الداعمين</th>
                  <th class="py-2.5 px-3 text-center border-l border-slate-200">التاريخ الموثق</th>
                  <th class="py-2.5 px-3 text-center">أثر الراتب</th>
                </tr>
              </thead>
              <tbody id="hostGiftsTableBody" class="divide-y divide-slate-200">
                ${giftsList.map((g, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#edf6f9] transition">
                    <td class="py-2.5 px-3 font-black text-slate-950 border-l border-slate-200">${g.name}</td>
                    <td class="py-2.5 px-3 text-center font-mono font-black text-slate-950 border-l border-slate-200">${g.count} مرة</td>
                    <td class="py-2.5 px-3 text-center font-mono font-black text-amber-700 border-l border-slate-200">${g.coins.toLocaleString()} 🪙</td>
                    <td class="py-2.5 px-3 font-bold text-slate-800 border-l border-slate-200">${g.sender}</td>
                    <td class="py-2.5 px-3 text-center font-mono text-slate-950 font-bold border-l border-slate-200">${g.date}</td>
                    <td class="py-2.5 px-3 text-center text-emerald-800 font-bold font-mono">100% معتمد</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
      break;

    case 'recharges':
      title = 'سجل شحنات الكوينز ومصادر التعبئة (وكلاء، فيزا، استقطاع راتب)';
      badgeText = 'تدقيق منابع التعبئة';
      iconName = 'credit-card';
      iconColor = 'bg-sky-100 text-sky-800';
      const totalRechargeAmt = (rechargeHistory || []).reduce((acc, r) => acc + r.amountCoins, 0);
      bodyHtml = `
        <div class="space-y-4">
          <div class="p-3 bg-sky-50 rounded-2xl border-2 border-sky-200 text-xs text-sky-950 flex items-center justify-between flex-wrap gap-2">
            <span class="font-bold">إجمالي كمية الشحن المسجلة: <strong class="font-mono text-sm text-sky-900">${totalRechargeAmt.toLocaleString()} 🪙</strong></span>
            <span class="text-slate-600 font-bold">رصد كامل لمصادر الشحن لمنع الاحتيال وضمان حقوق الوكالات والمضيف</span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-right text-xs whitespace-nowrap">
              <thead class="bg-slate-100 text-slate-950 font-black border-b border-slate-300">
                <tr>
                  <th class="py-2.5 px-3 border-l border-slate-200">رقم العملية / التاريخ</th>
                  <th class="py-2.5 px-3 text-center border-l border-slate-200">كمية الشحن</th>
                  <th class="py-2.5 px-3 border-l border-slate-200">نوع وقناة الشحن</th>
                  <th class="py-2.5 px-3 border-l border-slate-200">تفاصيل المصدر / الوكالة</th>
                  <th class="py-2.5 px-3 text-center border-l border-slate-200">وسيلة الدفع</th>
                  <th class="py-2.5 px-3 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                ${(rechargeHistory || []).map((r, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#edf6f9] transition">
                    <td class="py-2.5 px-3 font-mono font-bold text-slate-900 border-l border-slate-200">
                      <div>${r.id}</div>
                      <div class="text-[10px] text-slate-500 font-mono">${r.date}</div>
                    </td>
                    <td class="py-2.5 px-3 text-center font-mono font-black text-amber-700 border-l border-slate-200">
                      ${r.amountCoins.toLocaleString()} 🪙
                    </td>
                    <td class="py-2.5 px-3 font-bold border-l border-slate-200">
                      <span class="px-2 py-0.5 rounded text-[11px] font-black ${
                        r.sourceType.includes('فيزا') ? 'bg-indigo-100 text-indigo-900 border border-indigo-200' :
                        r.sourceType.includes('وكيل') ? 'bg-sky-100 text-sky-900 border border-sky-200' :
                        r.sourceType.includes('راتب') ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                        'bg-purple-100 text-purple-900 border border-purple-200'
                      }">
                        ${r.sourceType}
                      </span>
                    </td>
                    <td class="py-2.5 px-3 font-medium text-slate-800 border-l border-slate-200">${r.sourceDetail}</td>
                    <td class="py-2.5 px-3 text-center text-slate-700 font-medium border-l border-slate-200">${r.paymentMethod}</td>
                    <td class="py-2.5 px-3 text-center font-bold text-emerald-800">${r.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
      break;

    case 'games':
      title = 'سجل أرباح الألعاب (فصل العملات: كوينز ذهبية مقابل الفضية)';
      badgeText = 'حسم نزاعات الألعاب';
      iconName = 'gamepad-2';
      iconColor = 'bg-amber-100 text-amber-800';
      const totalGoldCoins = hostGamesData.goldGames.reduce((acc, g) => acc + g.netCoins, 0);
      bodyHtml = `
        <div class="space-y-4">
          <!-- Coins Games (Counts to Target & Payout) -->
          <div class="rounded-2xl border-2 border-amber-300 bg-amber-50/40 p-4 space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-2">
                <span class="p-1.5 rounded-lg bg-amber-200 text-amber-900 font-black text-xs">🪙 ألعاب الكوينز الذهبية</span>
                <span class="text-xs font-bold text-amber-950">المزرعة، السلوتس، العجلة (تُحسب كدخل حقيقي ضمن التارجت والراتب)</span>
              </div>
              <span class="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs font-mono">
                صافي المحقق: ${totalGoldCoins.toLocaleString()} 🪙
              </span>
            </div>
            <div class="overflow-x-auto rounded-xl border border-amber-200 bg-white">
              <table class="w-full text-right text-xs whitespace-nowrap">
                <thead class="bg-amber-100 text-slate-950 font-black border-b border-amber-200">
                  <tr>
                    <th class="py-2.5 px-3 border-l border-slate-200">اللعبة / رقم الجولة</th>
                    <th class="py-2.5 px-3 text-center border-l border-slate-200">إجمالي الفوز</th>
                    <th class="py-2.5 px-3 text-center border-l border-slate-200">عمولة المنصة</th>
                    <th class="py-2.5 px-3 text-center border-l border-slate-200">صافي المضاف للمحفظة</th>
                    <th class="py-2.5 px-3 text-center border-l border-slate-200">التاريخ والوقت</th>
                    <th class="py-2.5 px-3 text-center">أثر الراتب والتارجت</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  ${hostGamesData.goldGames.map((g, idx) => `
                    <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#edf6f9]">
                      <td class="py-2.5 px-3 font-black text-slate-950 border-l border-slate-200">${g.game} <span class="font-mono text-slate-500 text-[10px]">(${g.roundId})</span></td>
                      <td class="py-2.5 px-3 text-center font-mono font-bold text-slate-800 border-l border-slate-200">${g.wonCoins.toLocaleString()} 🪙</td>
                      <td class="py-2.5 px-3 text-center font-mono font-bold text-rose-700 border-l border-slate-200">${g.fee}</td>
                      <td class="py-2.5 px-3 text-center font-mono font-black text-amber-700 border-l border-slate-200">${g.netCoins.toLocaleString()} 🪙</td>
                      <td class="py-2.5 px-3 text-center font-mono text-slate-600 border-l border-slate-200">${g.date}</td>
                      <td class="py-2.5 px-3 text-center font-bold text-emerald-800">${g.status}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Silver Games (Separated, Not counted into Target) -->
          <div class="rounded-2xl border-2 border-slate-300 bg-slate-50 p-4 space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-2">
                <span class="p-1.5 rounded-lg bg-slate-200 text-slate-800 font-black text-xs">🥈 ألعاب العملة الفضية</span>
                <span class="text-xs font-bold text-slate-800">لودو النجوم، دومينو (نشاط ترفيهي فقط - لا يدخل إطلاقاً في تارجت الراتب)</span>
              </div>
              <span class="px-2.5 py-1 rounded-xl bg-slate-200 text-slate-800 font-black text-xs">
                مستقل إدارياً
              </span>
            </div>
            <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table class="w-full text-right text-xs whitespace-nowrap">
                <thead class="bg-slate-100 text-slate-950 font-black border-b border-slate-200">
                  <tr>
                    <th class="py-2.5 px-3 border-l border-slate-200">اللعبة / رقم الجولة</th>
                    <th class="py-2.5 px-3 text-center border-l border-slate-200">الرصيد الفضي المستلم</th>
                    <th class="py-2.5 px-3 text-center border-l border-slate-200">النتيجة</th>
                    <th class="py-2.5 px-3 text-center border-l border-slate-200">التاريخ والوقت</th>
                    <th class="py-2.5 px-3 text-center">الصفة الإدارية</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  ${hostGamesData.silverGames.map((s, idx) => `
                    <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#edf6f9]">
                      <td class="py-2.5 px-3 font-black text-slate-950 border-l border-slate-200">${s.game} <span class="font-mono text-slate-500 text-[10px]">(${s.roundId})</span></td>
                      <td class="py-2.5 px-3 text-center font-mono font-bold text-slate-700 border-l border-slate-200">${s.silverScore}</td>
                      <td class="py-2.5 px-3 text-center font-bold text-slate-900 border-l border-slate-200">${s.result}</td>
                      <td class="py-2.5 px-3 text-center font-mono text-slate-600 border-l border-slate-200">${s.date}</td>
                      <td class="py-2.5 px-3 text-center font-bold text-slate-500">${s.note}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
      break;

    case 'penalties':
      title = 'سجل العقوبات والتبنيد والجزاءات الإدارية الموثقة';
      badgeText = 'إثباتات وحسم الشكاوى';
      iconName = 'shield-alert';
      iconColor = 'bg-rose-100 text-rose-800';
      bodyHtml = `
        <div class="space-y-4">
          <!-- Active Ban/Suspension Status -->
          <div class="rounded-2xl border-2 border-slate-300 bg-white p-4 space-y-3">
            <h5 class="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <i data-lucide="history" class="w-4 h-4 text-slate-600"></i>
              <span>سوابق الحظر والإيقاف الإداري (Ban & Freeze Records)</span>
            </h5>
            <div class="overflow-x-auto rounded-xl border border-slate-200">
              <table class="w-full text-right text-xs whitespace-nowrap">
                <thead class="bg-slate-100 text-slate-950 font-black border-b border-slate-200">
                  <tr>
                    <th class="py-2 px-3 border-l border-slate-200">رقم البند</th>
                    <th class="py-2 px-3 border-l border-slate-200">السبب الإداري الموثق</th>
                    <th class="py-2 px-3 text-center border-l border-slate-200">المدة والتواريخ</th>
                    <th class="py-2 px-3 border-l border-slate-200">الإداري المنفّذ</th>
                    <th class="py-2 px-3 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  ${banHistory.map((b, idx) => `
                    <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'}">
                      <td class="py-2 px-3 font-mono font-black text-rose-700 border-l border-slate-200">${b.id}</td>
                      <td class="py-2 px-3 font-bold text-slate-900 border-l border-slate-200">${b.reason}</td>
                      <td class="py-2 px-3 text-center font-mono text-slate-600 border-l border-slate-200">${b.date} ➔ ${b.endDate}</td>
                      <td class="py-2 px-3 font-bold text-slate-800 border-l border-slate-200">${b.byAdmin}</td>
                      <td class="py-2 px-3 text-center font-bold text-slate-600">${b.status}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Financial Deductions and Hours Adjustments -->
          <div class="rounded-2xl border-2 border-rose-300 bg-rose-50/40 p-4 space-y-3">
            <h5 class="text-xs font-black text-rose-950 flex items-center gap-1.5">
              <i data-lucide="file-minus" class="w-4 h-4 text-rose-700"></i>
              <span>سجل الخصومات المالية واستقطاعات الراتب</span>
            </h5>
            <div class="overflow-x-auto rounded-xl border border-rose-200 bg-white">
              <table class="w-full text-right text-xs whitespace-nowrap">
                <thead class="bg-rose-100 text-slate-950 font-black border-b border-rose-200">
                  <tr>
                    <th class="py-2 px-3 border-l border-slate-200">رقم القرار</th>
                    <th class="py-2 px-3 text-center border-l border-slate-200">المبلغ المستقطع</th>
                    <th class="py-2 px-3 border-l border-slate-200">سبب الاستقطاع والشكوى</th>
                    <th class="py-2 px-3 text-center border-l border-slate-200">تاريخ الخصم</th>
                    <th class="py-2 px-3 border-l border-slate-200">المشرف المنفذ</th>
                    <th class="py-2 px-3 text-center">رقم التذكرة / الدليل</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  ${hostPenaltiesList.map((p, idx) => `
                    <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#edf6f9]">
                      <td class="py-2.5 px-3 font-mono font-black text-slate-950 border-l border-slate-200">${p.id}</td>
                      <td class="py-2.5 px-3 text-center font-mono font-black text-rose-800 border-l border-slate-200">
                        ${p.amountUsd > 0 ? `-$${p.amountUsd}` : `-${p.coinsDeducted.toLocaleString()} 🪙`}
                      </td>
                      <td class="py-2.5 px-3 font-bold text-slate-900 border-l border-slate-200">${p.reason}</td>
                      <td class="py-2.5 px-3 text-center font-mono text-slate-600 border-l border-slate-200">${p.date}</td>
                      <td class="py-2.5 px-3 font-bold text-slate-800 border-l border-slate-200">${p.adminName}</td>
                      <td class="py-2.5 px-3 text-center font-mono font-bold text-purple-700">${p.refProof}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
      break;

    case 'withdrawals':
      title = 'سجل السحوبات والحوالات المالية المنفذة (الإثباتات البنكية والرقمية)';
      badgeText = 'إثباتات تسليم الرواتب';
      iconName = 'badge-check';
      iconColor = 'bg-emerald-100 text-emerald-800';
      const totalPaidUsd = hostWithdrawalsList.reduce((acc, w) => acc + w.amountUsd, 0);
      bodyHtml = `
        <div class="space-y-4">
          <div class="p-3 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span class="font-black text-emerald-950">إجمالي المبالغ المسلّمة والمحولة سابقاً: <strong class="font-mono text-base text-emerald-900">$${totalPaidUsd.toLocaleString()}</strong></span>
            <span class="text-emerald-800 font-bold">جميع الحوالات مدعمة بأرقام المرجع القانوني البنكي وهاش المعاملة لحسم أي نزاع</span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-right text-xs whitespace-nowrap">
              <thead class="bg-slate-100 text-slate-950 font-black border-b border-slate-300">
                <tr>
                  <th class="py-2.5 px-3 border-l border-slate-200">رقم الحوالة</th>
                  <th class="py-2.5 px-3 text-center border-l border-slate-200">المبلغ الصافي</th>
                  <th class="py-2.5 px-3 border-l border-slate-200">قناة الدفع والتحويل</th>
                  <th class="py-2.5 px-3 border-l border-slate-200">الرقم المرجعي (Reference ID)</th>
                  <th class="py-2.5 px-3 text-center border-l border-slate-200">تاريخ الاستلام</th>
                  <th class="py-2.5 px-3 text-center">إثبات الصرف</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                ${hostWithdrawalsList.map((w, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#edf6f9]">
                    <td class="py-2.5 px-3 font-mono font-black text-slate-950 border-l border-slate-200">${w.id}</td>
                    <td class="py-2.5 px-3 text-center font-mono font-black text-emerald-700 text-sm border-l border-slate-200">$${w.amountUsd.toLocaleString()}</td>
                    <td class="py-2.5 px-3 font-bold text-slate-900 border-l border-slate-200">${w.method}</td>
                    <td class="py-2.5 px-3 font-mono font-bold text-slate-800 border-l border-slate-200 bg-slate-50">${w.referenceId}</td>
                    <td class="py-2.5 px-3 text-center font-mono text-slate-600 border-l border-slate-200">${w.date}</td>
                    <td class="py-2.5 px-3 text-center font-bold text-emerald-800">${w.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
      break;

    case 'devices':
      title = 'سجل الأجهزة والبصمة الرقمية للاتصال (Audit Log & Anti-Fraud)';
      badgeText = 'كشف الحسابات المزدوجة';
      iconName = 'smartphone';
      iconColor = 'bg-indigo-100 text-indigo-800';
      bodyHtml = `
        <div class="space-y-4">
          <div class="p-3 bg-indigo-50 rounded-2xl border-2 border-indigo-200 text-xs text-indigo-950 flex items-center justify-between flex-wrap gap-2">
            <span class="font-bold">رصد البصمة الرقمية (IMEI, MAC, IP) لمنع تسجيل أكثر من مضيف على جهاز واحد أو التلاعب بالبث</span>
            <span class="font-mono font-black bg-indigo-200 text-indigo-900 px-2.5 py-0.5 rounded-md">${devicesUsed.length} أجهزة مرصودة</span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-right text-xs whitespace-nowrap">
              <thead class="bg-slate-100 text-slate-950 font-black border-b border-slate-300">
                <tr>
                  <th class="py-2.5 px-3 border-l border-slate-200">طراز الجهاز ونظام التشغيل</th>
                  <th class="py-2.5 px-3 text-center border-l border-slate-200">الرقم التسلسلي (IMEI)</th>
                  <th class="py-2.5 px-3 text-center border-l border-slate-200">عنوان IP والماك (MAC)</th>
                  <th class="py-2.5 px-3 text-center border-l border-slate-200">آخر نشاط</th>
                  <th class="py-2.5 px-3 text-center border-l border-slate-200">الصفة</th>
                  <th class="py-2.5 px-3 text-center">مستوى الأمان والتحقق</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                ${devicesUsed.map((d, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#edf6f9]">
                    <td class="py-2.5 px-3 font-black text-slate-950 border-l border-slate-200">${d.model}</td>
                    <td class="py-2.5 px-3 text-center font-mono font-bold text-slate-800 border-l border-slate-200">${d.serial}</td>
                    <td class="py-2.5 px-3 text-center font-mono text-slate-600 border-l border-slate-200">
                      <div>${d.ip}</div>
                      <div class="text-[10px] text-slate-500 font-bold">${d.mac}</div>
                    </td>
                    <td class="py-2.5 px-3 text-center font-mono text-slate-700 border-l border-slate-200">${d.lastActive}</td>
                    <td class="py-2.5 px-3 text-center border-l border-slate-200">
                      ${d.isPrimary ? '<span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">جهاز رئيسي</span>' : '<span class="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-medium">جهاز ثانوي</span>'}
                    </td>
                    <td class="py-2.5 px-3 text-center font-bold ${d.riskLevel.includes('آمن') ? 'text-emerald-700' : 'text-amber-700'}">${d.riskLevel}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
      break;

    case 'pk':
      title = 'سجل جولات الـ PK والمنافسات المباشرة (Battle Logs)';
      badgeText = 'حسم تحديات البث';
      iconName = 'swords';
      iconColor = 'bg-rose-100 text-rose-800';
      bodyHtml = `
        <div class="space-y-4">
          <div class="p-3 bg-purple-50 rounded-2xl border-2 border-purple-200 text-xs text-purple-950 flex items-center justify-between flex-wrap gap-2">
            <span class="font-bold">كشف مفصّل لجولات التحدي الرسمية ومقدار كوينز الدعم المستلمة أثناء الجولة وأبرز الداعمين</span>
            <span class="font-mono font-black bg-purple-200 text-purple-900 px-2.5 py-0.5 rounded-md">${hostPkBattlesList.length} جولات موثقة</span>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-right text-xs whitespace-nowrap">
              <thead class="bg-slate-100 text-slate-950 font-black border-b border-slate-300">
                <tr>
                  <th class="py-2.5 px-3 border-l border-slate-200">المنافس / وكالته</th>
                  <th class="py-2.5 px-3 text-center border-l border-slate-200">نتيجة الجولة</th>
                  <th class="py-2.5 px-3 text-center border-l border-slate-200">نقاط المضيف (🪙)</th>
                  <th class="py-2.5 px-3 text-center border-l border-slate-200">نقاط الخصم (🪙)</th>
                  <th class="py-2.5 px-3 border-l border-slate-200">أبرز داعم بالجولة</th>
                  <th class="py-2.5 px-3 text-center">التاريخ والتوقيت</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                ${hostPkBattlesList.map((pk, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#edf6f9]">
                    <td class="py-2.5 px-3 font-black text-slate-950 border-l border-slate-200">
                      <div>${pk.opponentName}</div>
                      <div class="text-[10px] text-slate-500 font-bold">${pk.opponentAgency}</div>
                    </td>
                    <td class="py-2.5 px-3 text-center font-black text-xs ${pk.result.includes('فوز') ? 'text-emerald-700' : 'text-slate-700'} border-l border-slate-200">${pk.result}</td>
                    <td class="py-2.5 px-3 text-center font-mono font-black text-amber-700 border-l border-slate-200">${pk.hostCoins.toLocaleString()} 🪙</td>
                    <td class="py-2.5 px-3 text-center font-mono font-bold text-slate-600 border-l border-slate-200">${pk.opponentCoins.toLocaleString()} 🪙</td>
                    <td class="py-2.5 px-3 font-bold text-slate-800 border-l border-slate-200">${pk.topSupporter}</td>
                    <td class="py-2.5 px-3 text-center font-mono text-slate-600">${pk.date}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
      break;

    case 'themes':
      title = 'سجل المزايا والبصريات (الثيمات والخلفيات المملوكة للحساب)';
      badgeText = 'تحميل كسول بالطلب';
      iconName = 'sparkles';
      iconColor = 'bg-fuchsia-100 text-fuchsia-800';
      bodyHtml = `
        <div class="space-y-4">
          <div class="p-3 bg-fuchsia-50 rounded-2xl border-2 border-fuchsia-200 text-xs text-fuchsia-950 flex items-center justify-between flex-wrap gap-2">
            <span class="font-bold">كشف الثيمات، الإطارات، ومؤثرات الدخول الملكية المملوكة للحساب (يتم تحميلها فقط عند استدعاء هذا الكرت للحفاظ على خفة وسرعة الواجهة)</span>
            <span class="font-mono font-black bg-fuchsia-200 text-fuchsia-900 px-2.5 py-0.5 rounded-md">${hostThemesList.length} عناصر تجميلية</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${hostThemesList.map(t => `
              <div class="bg-white rounded-2xl border-2 border-slate-200 p-3.5 flex items-center justify-between gap-3 shadow-xs hover:border-fuchsia-300 transition">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${t.previewColor} text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                    ${t.icon}
                  </div>
                  <div>
                    <h6 class="text-xs font-black text-slate-950">${t.name}</h6>
                    <span class="text-[11px] text-slate-500 block mt-0.5">${t.type}</span>
                    <span class="text-[10px] font-mono text-purple-700 font-bold block mt-0.5">الصلاحية: ${t.expiryDate}</span>
                  </div>
                </div>
                <span class="px-2.5 py-1 rounded-xl text-xs font-bold ${t.status === 'مفعّل حالياً' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-100 text-slate-700'}">
                  ${t.status}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      break;

    case 'bans':
      title = 'سجل البند وإدارة التجميد الفوري للحساب (Ban History & Freeze)';
      badgeText = 'التحكم الإداري المباشر';
      iconName = 'shield-alert';
      iconColor = 'bg-rose-100 text-rose-800';
      const isBannedCurrently = host.status === 'مجمد' || (banHistory && banHistory.some(b => b.status === 'نشط حالياً'));
      bodyHtml = `
        <div class="space-y-4">
          <!-- Control Bar -->
          <div class="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div class="space-y-0.5 text-right w-full sm:w-auto">
              <span class="font-black text-rose-950 block">التحكم الفوري في نشاط المضيف:</span>
              <span class="text-slate-600 text-[11px]">يمكنك تجميد الحساب فورياً لمنع البث، أو تعليق الراتب، أو فك الحظر إن كان مجمد.</span>
            </div>
            <div class="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <button 
                type="button" 
                onclick="window.executeHostBanAction('${host.id}', 'temporary_ban')" 
                class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition flex items-center gap-1 cursor-pointer shadow-xs">
                <i data-lucide="clock" class="w-4 h-4"></i>
                <span>بند مؤقت (24 ساعة)</span>
              </button>
              <button 
                type="button" 
                onclick="window.executeHostBanAction('${host.id}', 'freeze')" 
                class="px-3.5 py-2 rounded-xl ${isBannedCurrently ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-700 hover:bg-rose-800 text-white'} font-black text-xs transition flex items-center gap-1 cursor-pointer shadow-xs">
                <i data-lucide="${isBannedCurrently ? 'unlock' : 'lock'}" class="w-4 h-4"></i>
                <span>${isBannedCurrently ? 'فك تجميد الحساب ✅' : 'تجميد الحساب وإيقافه 🔒'}</span>
              </button>
            </div>
          </div>

          <!-- Past Bans Table -->
          <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-right text-xs whitespace-nowrap">
              <thead class="bg-slate-100 text-slate-950 font-black border-b border-slate-300">
                <tr>
                  <th class="py-2.5 px-3 border-l border-slate-200">رقم البند</th>
                  <th class="py-2.5 px-3 border-l border-slate-200">تاريخ البدء</th>
                  <th class="py-2.5 px-3 border-l border-slate-200">مدة البند</th>
                  <th class="py-2.5 px-3 border-l border-slate-200">سبب البند والمخالفة</th>
                  <th class="py-2.5 px-3 border-l border-slate-200">جهة التنفيذ</th>
                  <th class="py-2.5 px-3 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                ${(banHistory || []).map((b, idx) => `
                  <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#edf6f9]">
                    <td class="py-2 px-3 font-mono font-bold text-slate-900 border-l border-slate-200">${b.id}</td>
                    <td class="py-2 px-3 font-mono text-slate-700 border-l border-slate-200">${b.date}</td>
                    <td class="py-2 px-3 font-bold text-slate-800 border-l border-slate-200">${b.endDate}</td>
                    <td class="py-2 px-3 text-slate-900 font-medium border-l border-slate-200">${b.reason}</td>
                    <td class="py-2 px-3 text-slate-700 border-l border-slate-200">${b.byAdmin}</td>
                    <td class="py-2 px-3 text-center font-bold text-slate-600">${b.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
      break;

    case 'badges':
      title = 'سجل الشارات الاكتسابية والأوسمة التقديرية (Badges & VIP Honors)';
      badgeText = 'التوثيقات الرسمية';
      iconName = 'award';
      iconColor = 'bg-amber-100 text-amber-800';
      const myBadges = badgesList || [];
      bodyHtml = `
        <div class="space-y-4">
          <div class="p-3 bg-amber-50 rounded-2xl border-2 border-amber-200 text-xs text-amber-950 flex items-center justify-between flex-wrap gap-2">
            <span class="font-bold">الأوسمة والشارات المعتمدة الممنوحة للمضيف بناءً على التميز، ساعات البث، أو دروع التفاعل</span>
            <span class="font-mono font-black bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-md">${myBadges.length} أوسمة معتمدة</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${myBadges.map(b => `
              <div class="p-3.5 rounded-2xl border-2 ${b.color} flex items-center gap-3 bg-white shadow-2xs">
                <div class="text-3xl shrink-0">🏅</div>
                <div>
                  <div class="font-black text-xs sm:text-sm text-slate-950">${b.title}</div>
                  <div class="text-[11px] text-slate-600 mt-0.5">${b.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      break;

    default:
      return;
  }

  subContent.innerHTML = `
    <!-- Modal Header -->
    <div class="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950 text-white flex items-center justify-between border-b-2 border-slate-800 shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center font-black shrink-0">
          <i data-lucide="${iconName}" class="w-5 h-5"></i>
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="text-sm sm:text-base font-black text-white">${title}</h3>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400 font-bold">
              ${badgeText}
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">
            المضيف: <strong class="text-amber-300">${host.name}</strong> • المعرف: <strong class="font-mono text-white">#${host.userId}</strong>
          </p>
        </div>
      </div>
      <button 
        type="button" 
        onclick="window.closeHostAuditSubModal()" 
        class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition cursor-pointer">
        ✕
      </button>
    </div>

    <!-- Modal Body -->
    <div class="p-4 sm:p-6 overflow-y-auto flex-1 text-slate-950 bg-slate-50/50">
      ${bodyHtml}
    </div>

    <!-- Modal Footer -->
    <div class="p-3.5 bg-slate-100 border-t-2 border-slate-300 flex items-center justify-between gap-2 shrink-0 text-xs">
      <span class="text-slate-500 font-bold">لوحة تحكم الإدارة العليا • مركز التدقيق وحسم النزاعات (Owner & Admin)</span>
      <button 
        type="button" 
        onclick="window.closeHostAuditSubModal()" 
        class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition cursor-pointer">
        إغلاق النافذة
      </button>
    </div>
  `;

  subModal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
};

// Render HTML rows for Host Statement Master Table
window.renderHostStatementRowsHtml = function(records) {
  if (!records || records.length === 0) {
    return `
      <tr>
        <td colspan="10" class="py-10 text-center text-slate-500 font-bold bg-[#f7fbfd]">
          <div class="flex flex-col items-center justify-center gap-1.5">
            <span class="text-2xl">🔍</span>
            <span class="text-sm font-black text-slate-700">لا توجد حركات مالية مطابقة لمعايير الفلترة المحددة</span>
            <button type="button" onclick="window.filterHostStatementDirection('ALL')" class="mt-2 text-xs text-purple-700 underline font-black cursor-pointer">إعادة ضبط الفلاتر وعرض كافة الحركات</button>
          </div>
        </td>
      </tr>
    `;
  }

  return records.map((r, idx) => `
    <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#edf6f9] transition">
      <td class="py-2.5 px-3.5 border-l border-slate-200">
        <div class="font-mono font-black text-slate-950">${r.refId}</div>
        <div class="font-mono text-[10px] text-slate-500 mt-0.5">${r.date}</div>
      </td>
      <td class="py-2.5 px-3 text-center border-l border-slate-200">
        <span class="text-[11px] px-2.5 py-1 rounded-full border font-black ${r.badgeClass}">
          ${r.directionLabel}
        </span>
      </td>
      <td class="py-2.5 px-3 border-l border-slate-200">
        <div class="font-black text-slate-950">${r.category}</div>
        <div class="text-[11px] text-slate-600 mt-0.5">${r.detail}</div>
      </td>
      <td class="py-2.5 px-3 text-center font-mono font-black border-l border-slate-200 ${r.direction === 'INFLOW' ? 'text-emerald-700' : 'text-rose-700'}">
        ${r.direction === 'INFLOW' ? '+' : '-'}${r.coins.toLocaleString()} 🪙
      </td>
      <td class="py-2.5 px-3 text-center font-mono font-black border-l border-slate-200 text-slate-900">
        $${r.usd.toLocaleString()}
      </td>
      <td class="py-2.5 px-3 font-bold text-slate-800 border-l border-slate-200">
        ${r.source}
      </td>
      <td class="py-2.5 px-3 font-bold text-slate-800 border-l border-slate-200">
        ${r.target}
      </td>
      <td class="py-2.5 px-3 text-slate-700 border-l border-slate-200">
        ${r.paymentMethod}
      </td>
      <td class="py-2.5 px-3 text-slate-600 text-[11px] border-l border-slate-200 max-w-[200px] truncate" title="${r.notes}">
        ${r.notes}
      </td>
      <td class="py-2.5 px-3 text-center font-bold text-emerald-800 font-mono">
        ${r.status}
      </td>
    </tr>
  `).join('');
};

// Generate Official Printable Statement of Account HTML
window.generateHostStatementPrintableHtml = function() {
  const state = window._currentHostStatementState;
  if (!state) return '';
  const { host, parentAgency, allRecords, totalInflowCoins, totalInflowUsd, totalOutflowCoins, totalOutflowUsd, netCoins, netUsd, disputeNotesList } = state;
  const nowStr = new Date().toLocaleString('ar-SA', { dateStyle: 'full', timeStyle: 'medium' });
  const printDocId = `DOC-AUD-${host.userId || host.id}-${Date.now().toString().slice(-6)}`;

  return `
    <div style="direction: rtl; font-family: 'Cairo', sans-serif; color: #020617; padding: 20px; max-width: 1000px; margin: 0 auto; background: #fff;">
      <!-- Header with Official Brand & Document Metadata -->
      <div style="border-bottom: 3px double #334155; padding-bottom: 14px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div style="font-size: 22px; font-weight: 900; color: #4c1d95; margin-bottom: 4px;">النجم • AL-NAJM</div>
          <div style="font-size: 15px; font-weight: 800; color: #0f172a;">كشف حساب وتدقيق المضيف المالي الشامل (حركات الدخل والخرج)</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">إدارة التدقيق المالي المركزي • قسم فض النزاعات وشؤون الوكالات</div>
        </div>
        <div style="text-align: left; font-family: monospace; font-size: 11px; color: #334155; line-height: 1.6;">
          <div><strong>رقم الوثيقة:</strong> ${printDocId}</div>
          <div><strong>تاريخ الطباعة:</strong> ${nowStr}</div>
          <div><strong>المشرف المسؤول:</strong> المشرف العام (Super Admin)</div>
          <div><strong>حالة الاعتماد:</strong> معتمد ومطابق 100% ✅</div>
        </div>
      </div>

      <!-- Host & Agency Identification Grid -->
      <div style="border: 2px solid #cbd5e1; border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; background-color: #f8fafc;">
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr>
            <td style="padding: 4px 8px; width: 25%;"><strong>اسم المضيف:</strong> ${host.name}</td>
            <td style="padding: 4px 8px; width: 25%;"><strong>المعرف الموحد:</strong> #${host.userId}</td>
            <td style="padding: 4px 8px; width: 25%;"><strong>معرف المضيف بالوكالة:</strong> ${host.id}</td>
            <td style="padding: 4px 8px; width: 25%;"><strong>ساعات البث المعتمدة:</strong> ${host.streamHours || 142} ساعة</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px;"><strong>الوكالة التابع لها:</strong> ${parentAgency.name} (${parentAgency.id})</td>
            <td style="padding: 4px 8px;"><strong>الوكيل المسؤول:</strong> ${parentAgency.owner}</td>
            <td style="padding: 4px 8px;"><strong>البنك المعتمد:</strong> ${host.bankAccount ? host.bankAccount.name : 'بنك الراجحي'}</td>
            <td style="padding: 4px 8px;"><strong>الآيبان (IBAN):</strong> ${host.bankAccount ? host.bankAccount.iban : 'SA4480000201608010099241'}</td>
          </tr>
        </table>
      </div>

      <!-- Financial Totals Summary Strip -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px;">
        <div style="border: 2px solid #86efac; background-color: #f0fdf4; border-radius: 10px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: #166534;">إجمالي حركات الدخل (الوارد)</div>
          <div style="font-size: 15px; font-weight: 900; color: #14532d; font-family: monospace; margin: 4px 0;">+${totalInflowCoins.toLocaleString()} 🪙</div>
          <div style="font-size: 11px; font-weight: 700; color: #15803d;">$${totalInflowUsd.toLocaleString()} USD</div>
        </div>

        <div style="border: 2px solid #fca5a5; background-color: #fef2f2; border-radius: 10px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: #991b1b;">إجمالي حركات الخرج (الصادر)</div>
          <div style="font-size: 15px; font-weight: 900; color: #7f1d1d; font-family: monospace; margin: 4px 0;">-${totalOutflowCoins.toLocaleString()} 🪙</div>
          <div style="font-size: 11px; font-weight: 700; color: #b91c1c;">$${totalOutflowUsd.toLocaleString()} USD</div>
        </div>

        <div style="border: 2px solid #d8b4fe; background-color: #faf5ff; border-radius: 10px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: #581c87;">صافي الرصيد المستحق (Net)</div>
          <div style="font-size: 15px; font-weight: 900; color: #3b0764; font-family: monospace; margin: 4px 0;">${netCoins.toLocaleString()} 🪙</div>
          <div style="font-size: 11px; font-weight: 700; color: #6b21a8;">$${netUsd.toLocaleString()} USD</div>
        </div>

        <div style="border: 2px solid #bae6fd; background-color: #f0f9ff; border-radius: 10px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; font-weight: 800; color: #075985;">حالة التدقيق والنزاعات</div>
          <div style="font-size: 13px; font-weight: 900; color: #0c4a6e; margin: 6px 0;">مطابق 100% محاسبياً</div>
          <div style="font-size: 10px; font-weight: 700; color: #0369a1;">خالٍ من أي تعليق مالي</div>
        </div>
      </div>

      <!-- Master Ledger Table -->
      <div style="margin-bottom: 20px;">
        <div style="font-size: 13px; font-weight: 900; color: #0f172a; margin-bottom: 8px;">سجل الحركات المالية المعتمدة (الدخل والخرج)</div>
        <table style="width: 100%; border-collapse: collapse; border: 2px solid #cbd5e1; font-size: 10.5px; text-align: right;">
          <thead>
            <tr style="background-color: #e2e8f0; color: #0f172a; font-weight: 900; border-bottom: 2px solid #94a3b8;">
              <th style="padding: 7px 8px; border: 1px solid #cbd5e1;">المرجع والتاريخ</th>
              <th style="padding: 7px 6px; border: 1px solid #cbd5e1; text-align: center;">الاتجاه</th>
              <th style="padding: 7px 8px; border: 1px solid #cbd5e1;">البيان والتصنيف</th>
              <th style="padding: 7px 6px; border: 1px solid #cbd5e1; text-align: center;">الكوينز</th>
              <th style="padding: 7px 6px; border: 1px solid #cbd5e1; text-align: center;">الدولار</th>
              <th style="padding: 7px 8px; border: 1px solid #cbd5e1;">المصدر</th>
              <th style="padding: 7px 8px; border: 1px solid #cbd5e1;">المستلم</th>
              <th style="padding: 7px 8px; border: 1px solid #cbd5e1;">ملاحظات التدقيق</th>
              <th style="padding: 7px 6px; border: 1px solid #cbd5e1; text-align: center;">الحالة</th>
            </tr>
          </thead>
          <tbody>
            ${allRecords.map((r, i) => `
              <tr style="background-color: ${i % 2 === 0 ? '#f8fafc' : '#ffffff'}; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-family: monospace;"><strong>${r.refId}</strong><br><span style="color:#64748b; font-size:9.5px;">${r.date}</span></td>
                <td style="padding: 6px 6px; border: 1px solid #e2e8f0; text-align: center; font-weight: 800; color: ${r.direction === 'INFLOW' ? '#166534' : '#991b1b'};">${r.direction === 'INFLOW' ? 'وارد 🟢' : 'صادر 🔴'}</td>
                <td style="padding: 6px 8px; border: 1px solid #e2e8f0;"><strong>${r.category}</strong><br><span style="color:#475569; font-size:9.5px;">${r.detail}</span></td>
                <td style="padding: 6px 6px; border: 1px solid #e2e8f0; text-align: center; font-family: monospace; font-weight: 800; color: ${r.direction === 'INFLOW' ? '#15803d' : '#b91c1c'};">${r.direction === 'INFLOW' ? '+' : '-'}${r.coins.toLocaleString()}</td>
                <td style="padding: 6px 6px; border: 1px solid #e2e8f0; text-align: center; font-family: monospace; font-weight: 800;">$${r.usd.toLocaleString()}</td>
                <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">${r.source}</td>
                <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">${r.target}</td>
                <td style="padding: 6px 8px; border: 1px solid #e2e8f0; color: #475569;">${r.notes}</td>
                <td style="padding: 6px 6px; border: 1px solid #e2e8f0; text-align: center; font-weight: 800; color: #15803d;">${r.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Dispute Notes in Print -->
      <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; margin-bottom: 18px; background-color: #f8fafc; font-size: 11px;">
        <div style="font-weight: 800; margin-bottom: 4px; color: #0f172a;">ملاحظات التدقيق وفض النزاعات المسجلة:</div>
        ${disputeNotesList.map(n => `
          <div style="margin-top: 4px; color: #334155;">• <strong>${n.author}</strong> (${n.date}): ${n.text}</div>
        `).join('')}
      </div>

      <!-- Legal Declaration & Signatures -->
      <div style="border-top: 2px solid #cbd5e1; padding-top: 14px; margin-top: 20px;">
        <div style="font-size: 10.5px; color: #64748b; line-height: 1.5; margin-bottom: 24px; text-align: justify;">
          <strong>إقرار ومصادقة رسمية:</strong> يعتبر هذا الكشف الصادر عن النظام المالي المركزي لتطبيق النجم كشفاً محاسبياً رسمياً ونهائياً لكافة حركات الدخل والخرج للمضيف عن الفترات الموضحة أعلاه، وهو معتمد لفض النزاعات وحسم مستحقات الوكالات.
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 0 20px;">
          <div style="text-align: center; font-size: 11.5px; color: #1e293b;">
            <div style="font-weight: 800; margin-bottom: 45px;">المشرف المالي وقسم التدقيق</div>
            <div style="border-top: 1.5px dotted #94a3b8; padding-top: 4px;">التوقيع: ____________________</div>
          </div>

          <div style="text-align: center;">
            <div style="width: 85px; height: 85px; border: 3px double #7c3aed; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #6d28d9; margin: 0 auto;">
              <div style="font-size: 9px; font-weight: 900;">النجم</div>
              <div style="font-size: 8px; font-weight: 700;">التدقيق المالي</div>
              <div style="font-size: 8px; font-weight: 800;">معتمد ✅</div>
            </div>
          </div>

          <div style="text-align: center; font-size: 11.5px; color: #1e293b;">
            <div style="font-weight: 800; margin-bottom: 45px;">مدير الوكالة / المستلم</div>
            <div style="border-top: 1.5px dotted #94a3b8; padding-top: 4px;">التوقيع: ____________________</div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Print Official Host Statement
window.printOfficialHostStatement = function() {
  const state = window._currentHostStatementState;
  if (!state) {
    alert('يرجى فتح كشف حساب المضيف أولاً.');
    return;
  }
  const printableHtml = window.generateHostStatementPrintableHtml();

  // Populate inline print container
  const printContainer = document.getElementById('officialHostStatementPrintContainer');
  if (printContainer) {
    printContainer.innerHTML = printableHtml;
  }

  // Attempt clean popup print
  try {
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>كشف حساب وتدقيق المضيف - ${state.host.name} (#${state.host.userId})</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Cairo', sans-serif; color: #020617; background: #fff; margin: 0; padding: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 11px; }
            th { background-color: #f1f5f9; font-weight: 800; }
            @media print {
              body { padding: 0; }
              @page { margin: 12mm; size: A4 portrait; }
            }
          </style>
        </head>
        <body>
          ${printableHtml}
        </body>
        </html>
      `);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
        printWin.close();
      }, 500);
      return;
    }
  } catch (err) {
    console.warn('Popup print blocked, falling back to window.print():', err);
  }

  window.print();
};

// Export Host Statement as CSV
window.exportHostStatementCsv = function() {
  const state = window._currentHostStatementState;
  if (!state || !state.allRecords || state.allRecords.length === 0) {
    alert('لا توجد حركات مالية متاحة للتصدير.');
    return;
  }
  const records = state.currentFiltered || state.allRecords;
  const headers = [
    'الرقم المرجعي',
    'التاريخ والوقت',
    'الاتجاه',
    'التصنيف',
    'البيان التفصيلي',
    'الكوينز',
    'المقابل بالدولار',
    'المصدر',
    'المستلم',
    'وسيلة الدفع',
    'الملاحظات',
    'الحالة'
  ];
  const rows = records.map(r => [
    `"${r.refId}"`,
    `"${r.date}"`,
    `"${r.direction === 'INFLOW' ? 'وارد دخل' : 'صادر خرج'}"`,
    `"${r.category}"`,
    `"${r.detail.replace(/"/g, '""')}"`,
    r.coins,
    r.usd,
    `"${r.source}"`,
    `"${r.target}"`,
    `"${r.paymentMethod}"`,
    `"${(r.notes || '').replace(/"/g, '""')}"`,
    `"${r.status}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Host_Statement_${state.host.userId || state.host.id}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Filter Host Statement by Direction (ALL, INFLOW, OUTFLOW)
window.filterHostStatementDirection = function(direction) {
  const state = window._currentHostStatementState;
  if (!state) return;
  state.activeDirection = direction;

  const btnAll = document.getElementById('stmtBtnAll');
  const btnIn = document.getElementById('stmtBtnIn');
  const btnOut = document.getElementById('stmtBtnOut');

  [btnAll, btnIn, btnOut].forEach(btn => {
    if (btn) {
      btn.className = 'px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-200 text-xs font-bold transition cursor-pointer';
    }
  });

  if (direction === 'ALL' && btnAll) {
    btnAll.className = 'px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-black transition cursor-pointer';
  } else if (direction === 'INFLOW' && btnIn) {
    btnIn.className = 'px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-black transition cursor-pointer';
  } else if (direction === 'OUTFLOW' && btnOut) {
    btnOut.className = 'px-3 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-black transition cursor-pointer';
  }

  window.applyHostStatementFilters();
};

// Filter Host Statement by Period
window.filterHostStatementPeriod = function(period) {
  const state = window._currentHostStatementState;
  if (!state) return;
  state.activePeriod = period;
  window.applyHostStatementFilters();
};

// Search Host Statement Records
window.searchHostStatementRecords = function(query) {
  const state = window._currentHostStatementState;
  if (!state) return;
  state.searchQuery = (query || '').trim().toLowerCase();
  window.applyHostStatementFilters();
};

// Apply Active Filters to Host Statement
window.applyHostStatementFilters = function() {
  const state = window._currentHostStatementState;
  if (!state) return;

  let filtered = [...state.allRecords];

  if (state.activeDirection !== 'ALL') {
    filtered = filtered.filter(r => r.direction === state.activeDirection);
  }

  if (state.activePeriod !== 'all') {
    filtered = filtered.filter(r => r.date.startsWith(state.activePeriod));
  }

  if (state.searchQuery) {
    filtered = filtered.filter(r => 
      r.refId.toLowerCase().includes(state.searchQuery) ||
      r.category.toLowerCase().includes(state.searchQuery) ||
      r.detail.toLowerCase().includes(state.searchQuery) ||
      r.source.toLowerCase().includes(state.searchQuery) ||
      r.target.toLowerCase().includes(state.searchQuery) ||
      (r.notes && r.notes.toLowerCase().includes(state.searchQuery))
    );
  }

  state.currentFiltered = filtered;

  const tbody = document.getElementById('hostStatementTableBody');
  if (tbody) {
    tbody.innerHTML = window.renderHostStatementRowsHtml(filtered);
  }

  const badge = document.getElementById('stmtRecordsCountBadge');
  if (badge) {
    badge.textContent = `${filtered.length} حركة مسجلة`;
  }
};

// Prompt to add an official Dispute Resolution or Audit note
window.openHostStatementDisputePrompt = function() {
  const state = window._currentHostStatementState;
  if (!state) return;

  const noteText = prompt('أدخل ملاحظة التدقيق المالي أو توثيق حسم النزاع للمضيف:');
  if (!noteText || !noteText.trim()) return;

  const newNote = {
    id: `NOTE-${Date.now().toString().slice(-4)}`,
    date: new Date().toISOString().slice(0, 19).replace('T', ' '),
    author: 'المشرف العام (Super Admin)',
    text: noteText.trim(),
    status: 'معتمد وموثق بالسيرفر ✅'
  };

  state.disputeNotesList = [newNote, ...(state.disputeNotesList || [])];
  try {
    localStorage.setItem('host_statement_dispute_notes_' + state.host.id, JSON.stringify(state.disputeNotesList));
  } catch (e) {}

  const container = document.getElementById('hostStatementDisputeNotesContainer');
  if (container) {
    container.innerHTML = state.disputeNotesList.map(n => `
      <div class="p-3 rounded-xl bg-purple-50/60 border border-purple-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div class="space-y-0.5">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-900">${n.author}</span>
            <span class="font-mono text-[11px] text-slate-500">${n.date}</span>
            <span class="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">${n.status || 'معتمد'}</span>
          </div>
          <p class="text-slate-800 font-medium">${n.text}</p>
        </div>
        <div class="font-mono text-[11px] text-purple-800 font-bold shrink-0">
          ID: ${n.id}
        </div>
      </div>
    `).join('');
  }

  alert('تم توثيق ملاحظة التدقيق وفض النزاع بنجاح وإضافتها لكشف الحساب الرسمي.');
};

// Toggle Collapsible Section Card in Host Profile Modal
window.toggleHostCollapsibleCard = function(cardId) {
  const panel = document.getElementById(cardId);
  const arrow = document.getElementById(cardId + '_arrow');
  if (!panel) return;
  const isHidden = panel.classList.contains('hidden');
  if (isHidden) {
    panel.classList.remove('hidden');
    if (arrow) arrow.style.transform = 'rotate(180deg)';
  } else {
    panel.classList.add('hidden');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
  }
  if (window.lucide) lucide.createIcons();
};

// Filter Host Gifts by Date Picker or Predefined Quick Range
window.filterHostGiftsByDate = function(mode, val) {
  const allGifts = window._allHostGiftsRaw || [];
  const tbody = document.getElementById('hostGiftsTableBody');
  const countBadge = document.getElementById('hostGiftsFilteredCount');
  const coinsBadge = document.getElementById('hostGiftsFilteredCoins');
  const dateInput = document.getElementById('hostGiftDatePicker');

  let filtered = [];

  if (mode === 'custom') {
    const selectedDate = val || (dateInput ? dateInput.value : '');
    if (!selectedDate) {
      filtered = allGifts;
    } else {
      filtered = allGifts.filter(g => g.date.startsWith(selectedDate));
    }
  } else if (mode === 'all') {
    if (dateInput) dateInput.value = '';
    filtered = allGifts;
  } else if (mode === 'current_month') {
    if (dateInput) dateInput.value = '';
    filtered = allGifts.filter(g => g.date.startsWith('2026-09'));
  } else if (mode === 'last_month') {
    if (dateInput) dateInput.value = '';
    filtered = allGifts.filter(g => g.date.startsWith('2026-08'));
  }

  // Update badges
  const totalCoins = filtered.reduce((acc, curr) => acc + curr.coins, 0);
  if (countBadge) countBadge.textContent = `${filtered.length} عملية إهداء`;
  if (coinsBadge) coinsBadge.textContent = `${totalCoins.toLocaleString()} 🪙`;

  // Render rows
  if (tbody) {
    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="py-8 text-center text-slate-500 font-bold bg-[#f7fbfd]">
            <div class="flex flex-col items-center justify-center gap-1">
              <span class="text-2xl">🔍</span>
              <span>لا توجد هدايا مسجلة في هذا التاريخ المحدد</span>
              <button type="button" onclick="window.filterHostGiftsByDate('all')" class="mt-2 text-xs text-purple-700 underline font-black">عرض كافة الهدايا</button>
            </div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = filtered.map((g, idx) => `
        <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#edf6f9] transition">
          <td class="py-2.5 px-3 font-black text-slate-950 border-l border-slate-200">${g.name}</td>
          <td class="py-2.5 px-3 text-center font-mono font-black text-slate-950 border-l border-slate-200">${g.count} مرة</td>
          <td class="py-2.5 px-3 text-center font-mono font-black text-amber-700 border-l border-slate-200">${g.coins.toLocaleString()} 🪙</td>
          <td class="py-2.5 px-3 font-bold text-slate-800 border-l border-slate-200">${g.sender}</td>
          <td class="py-2.5 px-3 text-center font-mono text-slate-950 font-bold border-l border-slate-200">${g.date}</td>
          <td class="py-2.5 px-3 text-center text-emerald-800 font-bold font-mono">100% محسوبة للراتب</td>
        </tr>
      `).join('');
    }
  }
};

// Execute Ban, Suspension or Freeze on Host
window.executeHostBanAction = function(hostId, actionType) {
  const host = (agencyHosts || []).find(h => h.id === hostId);
  if (!host) return;

  if (actionType === 'freeze') {
    const isBanned = host.isBanned || host.status === 'مجمد' || host.status === 'محظور';
    if (isBanned) {
      // Unfreeze
      host.isBanned = false;
      host.status = 'نشط معتمد';
      alert(`تم بنجاح فك تجميد حساب المضيف (${host.name}) واستئناف الصلاحيات.`);
    } else {
      // Freeze
      const reason = prompt(`يرجى كتابة سبب تجميد وإيقاف حساب المضيف (${host.name}):`, 'مخالفة ضوابط البث أو تكرار الأجهزة');
      if (reason === null) return; // cancelled
      host.isBanned = true;
      host.status = 'مجمد';
      host.banHistory = host.banHistory || [];
      host.banHistory.unshift({
        id: 'BAN-' + Math.floor(100 + Math.random() * 900),
        date: new Date().toISOString().slice(0, 10),
        endDate: 'إيقاف إداري حتى إشعار آخر',
        reason: reason || 'تجميد إداري فوري',
        byAdmin: 'مدير العمليات (أنت)',
        status: 'ساري المفعول حالياً 🚫'
      });
      alert(`تم تجميد حساب المضيف (${host.name}) بنجاح وإيقاف عملياته.`);
    }
  } else if (actionType === 'temporary_ban') {
    const reason = prompt(`يرجى تحديد سبب تطبيق البند المؤقت 24 ساعة على (${host.name}):`, 'استخدام جوالين أو تشويش في الغرفة الصوتية');
    if (reason === null) return;
    host.isBanned = true;
    host.status = 'مجمد مؤقتاً';
    host.banHistory = host.banHistory || [];
    host.banHistory.unshift({
      id: 'BAN-' + Math.floor(100 + Math.random() * 900),
      date: new Date().toISOString().slice(0, 10),
      endDate: '24 ساعة (مؤقت)',
      reason: reason || 'بند مؤقت 24 ساعة',
      byAdmin: 'المشرف الإداري (أنت)',
      status: 'ساري المفعول حالياً ⏳'
    });
    alert(`تم تطبيق البند المؤقت 24 ساعة على حساب المضيف (${host.name}) وتدوينه في سجل المخالفات.`);
  }

  // Re-render modal to reflect new state
  if (typeof window.openHostFullProfile === 'function') {
    window.openHostFullProfile(hostId);
  }
};

// Jump to Host directly in the Agency's Hosts Table with row highlight
window.jumpToHostInAgencyTable = function(hostId, agencyId) {
  window.closeHostProfileModal();
  window.clearGlobalSearch();

  // Switch to agencies tab
  window.switchTab('agencies');

  // Open agency in hosts tab
  if (typeof window.openAgencyDetail === 'function') {
    window.openAgencyDetail(agencyId, 'hosts');

    // After table renders, search or scroll to this host
    setTimeout(() => {
      const searchInputs = document.querySelectorAll('#dynamicViewContainer input[type="text"]');
      if (searchInputs.length > 0) {
        // Table search input
        const tableSearch = searchInputs[searchInputs.length - 1];
        if (tableSearch) {
          tableSearch.value = hostId;
          tableSearch.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }, 200);
  }
};

// =========================================================================
// USER PROFILE QUICK MODAL (ملف المستخدم والحساب الإداري)
// =========================================================================

window.openUserProfileFromSearch = function(userId) {
  const u = (users || []).find(user => String(user.id) === String(userId) || String(user.specialId) === String(userId));
  if (!u) {
    alert('لم يتم العثور على بيانات المستخدم.');
    return;
  }

  const modal = document.getElementById('globalUserQuickModal');
  const content = document.getElementById('globalUserQuickModalContent');
  if (!modal || !content) return;

  content.innerHTML = `
    <!-- Header -->
    <div class="p-4 bg-slate-900 text-white flex items-center justify-between border-b-2 border-slate-700 shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
          👤
        </div>
        <div>
          <h2 class="text-sm sm:text-base font-black text-white">${u.displayName}</h2>
          <p class="text-xs text-slate-300">الملف الإداري للحساب • معرف: <span class="font-mono text-amber-300">#${u.specialId || u.id}</span></p>
        </div>
      </div>
      <button onclick="window.closeUserQuickModal()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer">
        ✕
      </button>
    </div>

    <!-- Body -->
    <div class="p-4 sm:p-5 space-y-4 bg-slate-50 text-slate-950 text-right">
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm flex items-center gap-3.5">
        <img src="${u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" class="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400 shrink-0" alt="">
        <div class="space-y-1">
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="text-sm font-black text-slate-950">${u.displayName}</h3>
            <span class="px-2 py-0.5 bg-amber-100 text-amber-950 border border-amber-300 rounded text-xs font-bold">${u.vip || 'عضو عادي'}</span>
            <span class="px-2 py-0.5 bg-indigo-100 text-indigo-950 border border-indigo-300 rounded text-xs font-mono font-bold">Lv.${u.level || 1}</span>
          </div>
          <p class="text-xs text-slate-600 font-mono">ID المميز: #${u.specialId} | الـ ID الداخلي: ${u.id}</p>
          <p class="text-xs text-slate-700 font-mono font-bold flex items-center gap-1">
            <i data-lucide="phone" class="w-3 h-3 text-slate-400"></i>
            ${u.phone || 'غير مسجل'}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="bg-white rounded-xl border border-slate-300 p-3 shadow-xs">
          <span class="text-xs font-bold text-slate-500">رصيد الكوينز</span>
          <div class="text-lg font-black text-amber-700 font-mono mt-1">${(u.coins || 0).toLocaleString()} 🪙</div>
        </div>
        <div class="bg-white rounded-xl border border-slate-300 p-3 shadow-xs">
          <span class="text-xs font-bold text-slate-500">حالة الحساب</span>
          <div class="text-sm font-black text-emerald-800 mt-1">${u.status || 'نشط وطبيعي'}</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-3.5 bg-slate-100 border-t-2 border-slate-300 flex items-center justify-between gap-2 shrink-0">
      <button 
        type="button" 
        onclick="window.closeUserQuickModal(); window.switchTab('users');" 
        class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer">
        <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
        <span>الانتقال لسجل المستخدمين</span>
      </button>

      <button 
        type="button" 
        onclick="window.closeUserQuickModal()" 
        class="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition cursor-pointer">
        إغلاق
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
};

window.closeUserQuickModal = function() {
  const modal = document.getElementById('globalUserQuickModal');
  if (modal) modal.classList.add('hidden');
};

// =========================================================================
// RECHARGE AGENT QUICK MODAL (ملف وكيل الشحن المعتمد)
// =========================================================================

window.openRechargeAgentProfile = function(recId) {
  const rec = (rechargeAgents || []).find(r => r.id === recId);
  if (!rec) {
    alert('لم يتم العثور على بيانات وكيل الشحن.');
    return;
  }

  const modal = document.getElementById('globalRechargeAgentModal');
  const content = document.getElementById('globalRechargeAgentModalContent');
  if (!modal || !content) return;

  content.innerHTML = `
    <!-- Header -->
    <div class="p-4 bg-emerald-950 text-white flex items-center justify-between border-b-2 border-emerald-800 shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
          💳
        </div>
        <div>
          <h2 class="text-sm sm:text-base font-black text-white">${rec.agent || rec.name}</h2>
          <p class="text-xs text-emerald-200">وكيل شحن معتمد • رمز: <span class="font-mono text-amber-300">${rec.id}</span></p>
        </div>
      </div>
      <button onclick="window.closeRechargeAgentModal()" class="w-8 h-8 rounded-xl bg-emerald-900 hover:bg-red-600 text-white flex items-center justify-center transition cursor-pointer">
        ✕
      </button>
    </div>

    <!-- Body -->
    <div class="p-4 sm:p-5 space-y-4 bg-slate-50 text-slate-950 text-right">
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-600">اسم المركز / المؤسسة:</span>
          <span class="text-xs font-black text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">${rec.status || 'معتمد'}</span>
        </div>
        <div class="text-base font-black text-slate-950">${rec.name}</div>
        <div class="text-xs text-slate-700 font-mono font-bold flex items-center gap-1.5 pt-1 border-t border-slate-200">
          <i data-lucide="phone" class="w-3.5 h-3.5 text-slate-400"></i>
          <span>رقم الجوال للتواصل: ${rec.phone}</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="bg-white rounded-xl border border-slate-300 p-3 shadow-xs">
          <span class="text-xs font-bold text-slate-500">رصيد الكوينز الحالي</span>
          <div class="text-lg font-black text-amber-700 font-mono mt-1">${(rec.coinsBalance || 0).toLocaleString()} 🪙</div>
        </div>
        <div class="bg-white rounded-xl border border-slate-300 p-3 shadow-xs">
          <span class="text-xs font-bold text-slate-500">نسبة الخصم المعتمدة</span>
          <div class="text-lg font-black text-emerald-800 font-mono mt-1">${rec.discount || '12%'}</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-3.5 bg-slate-100 border-t-2 border-slate-300 flex items-center justify-between gap-2 shrink-0">
      <button 
        type="button" 
        onclick="window.closeRechargeAgentModal(); window.switchTab('recharge_agencies');" 
        class="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer">
        <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
        <span>الانتقال لجدول وكلاء الشحن</span>
      </button>

      <button 
        type="button" 
        onclick="window.closeRechargeAgentModal()" 
        class="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition cursor-pointer">
        إغلاق
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
};

window.closeRechargeAgentModal = function() {
  const modal = document.getElementById('globalRechargeAgentModal');
  if (modal) modal.classList.add('hidden');
};

// =========================================================================
// FULL SEARCH RESULTS MODAL (نافذة نتائج البحث الشاملة والمصنفة)
// =========================================================================

window.openFullSearchResultsModal = function(query) {
  const modal = document.getElementById('globalAdminSearchFullModal');
  const content = document.getElementById('globalAdminSearchFullModalContent');
  if (!modal || !content) return;

  const results = performAdminGlobalSearch(query);

  content.innerHTML = `
    <!-- Header -->
    <div class="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b-2 border-slate-700 shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow-md">
          <i data-lucide="search" class="w-5 h-5"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-base sm:text-lg font-black text-white">نتائج البحث الشامل</h2>
            <span class="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs">${results.length} نتيجة</span>
          </div>
          <p class="text-xs text-slate-300 mt-0.5">البحث المباشر عن: <strong class="text-amber-300">"${query}"</strong> (بالاسم، الـ ID، اسم الوكيل، ورقم الجوال)</p>
        </div>
      </div>
      <button 
        type="button" 
        onclick="window.closeFullSearchResultsModal()" 
        class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
        title="إغلاق">
        ✕
      </button>
    </div>

    <!-- Body / Results Grid -->
    <div class="p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50 text-slate-950 text-right max-h-[75vh]">
      ${results.length === 0 ? `
        <div class="p-12 text-center text-slate-500">
          <div class="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-300 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <i data-lucide="search-x" class="w-8 h-8"></i>
          </div>
          <h3 class="text-sm font-black text-slate-800">لا توجد نتائج مطابقة لـ "${query}"</h3>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">تأكد من كتابة الاسم أو رقم الجوال أو الـ ID بشكل صحيح.</p>
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          ${results.map(item => `
            <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-xs hover:shadow-md hover:border-amber-400 transition flex flex-col justify-between gap-3">
              <div class="flex items-start gap-3">
                ${item.avatar ? `
                  <img src="${item.avatar}" class="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0" alt="">
                ` : `
                  <div class="w-12 h-12 rounded-xl ${item.badgeColor} border flex items-center justify-center font-black text-base shrink-0">
                    ${item.type === 'host' ? '🎙️' : (item.type === 'agent' ? '🏢' : (item.type === 'recharge' ? '💳' : '👤'))}
                  </div>
                `}
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <h4 class="text-xs sm:text-sm font-black text-slate-950 truncate">${highlightSearchMatch(item.title, query)}</h4>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}">${item.badge}</span>
                  </div>
                  <p class="text-xs text-slate-600 mt-1">${highlightSearchMatch(item.subtitle, query)}</p>
                  <div class="flex items-center gap-3 text-xs text-slate-700 font-bold mt-2">
                    ${item.phone ? `
                      <span class="flex items-center gap-1 font-mono">
                        <i data-lucide="phone" class="w-3.5 h-3.5 text-slate-400"></i>
                        ${highlightSearchMatch(item.phone, query)}
                      </span>
                    ` : ''}
                    <span class="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      ID: ${highlightSearchMatch(item.id, query)}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Footer Buttons -->
              <div class="flex items-center justify-between pt-2 border-t border-slate-200">
                <span class="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">${item.matchedReason}</span>
                <button 
                  type="button" 
                  onclick="window.closeFullSearchResultsModal(); window.openEntityFromSearch('${item.type}', '${item.id}')" 
                  class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition flex items-center gap-1 cursor-pointer shadow-xs">
                  <span>فتح القائمة الخاصة به</span>
                  <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>

    <!-- Footer -->
    <div class="p-3.5 bg-slate-100 border-t-2 border-slate-300 flex items-center justify-end shrink-0">
      <button 
        type="button" 
        onclick="window.closeFullSearchResultsModal()" 
        class="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition cursor-pointer">
        إغلاق النافذة
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
};

window.closeFullSearchResultsModal = function() {
  const modal = document.getElementById('globalAdminSearchFullModal');
  if (modal) modal.classList.add('hidden');
};

// Global click outside listener to close search dropdown
document.addEventListener('click', function(event) {
  const container = document.getElementById('globalAdminSearchContainer');
  const menu = document.getElementById('globalAdminSearchResultsMenu');
  if (container && menu && !container.contains(event.target)) {
    menu.classList.add('hidden');
  }
});

// Global Keyboard Shortcut: Ctrl+K or Cmd+K
document.addEventListener('keydown', function(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    const input = document.getElementById('globalAdminSearchInput');
    if (input) {
      input.focus();
      input.select();
    }
  }
});

// =========================================================================
// ZIP PACKAGE DOWNLOAD MODAL LOGIC (تحميل حزمة المشروع الشاملة)
// =========================================================================

window.openDownloadZipModal = function() {
  const modal = document.getElementById('globalDownloadZipModal');
  if (!modal) return;

  // Build full absolute URL
  const origin = window.location.origin || '';
  const fullDownloadUrl = origin + '/al-najm-dashboard-complete.zip';

  const input = document.getElementById('directZipDownloadUrlInput');
  if (input) {
    input.value = fullDownloadUrl;
  }

  const link = document.getElementById('modalDirectDownloadLink');
  if (link) {
    link.href = fullDownloadUrl;
  }

  modal.classList.remove('hidden');
  if (window.lucide) {
    lucide.createIcons();
  }
};

window.closeDownloadZipModal = function() {
  const modal = document.getElementById('globalDownloadZipModal');
  if (modal) modal.classList.add('hidden');
};

window.triggerDirectZipDownload = async function(event) {
  if (event) event.preventDefault();
  const btn = event ? event.currentTarget : null;
  const originalHtml = btn ? btn.innerHTML : '';
  try {
    if (btn) {
      btn.innerHTML = '<span>⏳ جارٍ التنزيل...</span>';
    }
    const res = await fetch('/al-najm-dashboard-complete.zip');
    if (!res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'al-najm-dashboard-complete.zip';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      if (btn) btn.innerHTML = '<span>✅ تم بدء التحميل!</span>';
      setTimeout(() => {
        if (btn) btn.innerHTML = originalHtml;
      }, 2000);
    }, 1500);
  } catch (err) {
    console.error(err);
    if (btn) btn.innerHTML = originalHtml;
    window.location.href = '/al-najm-dashboard-complete.zip';
  }
};


window.copyDirectZipDownloadUrl = function() {
  const input = document.getElementById('directZipDownloadUrlInput');
  const btnText = document.getElementById('copyZipBtnText');
  if (!input) return;

  const url = input.value || (window.location.origin + '/al-najm-dashboard-complete.zip');
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      if (btnText) btnText.textContent = 'تم النسخ!';
      setTimeout(() => {
        if (btnText) btnText.textContent = 'نسخ الرابط';
      }, 2500);
    }).catch(() => {
      input.select();
      document.execCommand('copy');
      if (btnText) btnText.textContent = 'تم النسخ!';
      setTimeout(() => {
        if (btnText) btnText.textContent = 'نسخ الرابط';
      }, 2500);
    });
  } else {
    input.select();
    document.execCommand('copy');
    if (btnText) btnText.textContent = 'تم النسخ!';
    setTimeout(() => {
      if (btnText) btnText.textContent = 'نسخ الرابط';
    }, 2500);
  }
};

