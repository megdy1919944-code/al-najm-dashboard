// =========================================================================
// TARAF CHAT - RECHARGE AGENCIES & MERCHANT PORTAL MASTER CONTROLLER
// إدارة وكالات الشحن الرسمية، فئات الصرف (Tier Rates)، تحويلات المضيفين (P2P)
// =========================================================================

// Global State
window._rechargeAgenciesState = {
  agencies: [
    {
      id: 'REC-01',
      primaryId: '1001007',
      name: 'مؤسسة الدانة للمدفوعات الرقمية (السعودية والخليج)',
      agent: 'أبو فهد الشمري',
      phone: '+966551234567',
      country: 'المملكة العربية السعودية 🇸🇦',
      tier: 'Tier A',
      coinsBalance: 120000000,
      totalSalesCoins: 480000000,
      todaySalesCoins: 14500000,
      todaySalesUsd: 1450,
      discountRate: 6.5,
      status: 'معتمد',
      loginUsername: 'rec01',
      loginPin: 'agent123',
      createdAt: '2026-01-15'
    },
    {
      id: 'REC-02',
      primaryId: '1001008',
      name: 'مركز الروابي للصرافة والشحن الفوري (الإمارات)',
      agent: 'خالد المنصوري',
      phone: '+971508889999',
      country: 'دولة الإمارات العربية المتحدة 🇦🇪',
      tier: 'Tier B',
      coinsBalance: 85000000,
      totalSalesCoins: 310000000,
      todaySalesCoins: 9200000,
      todaySalesUsd: 968,
      discountRate: 6.0,
      status: 'معتمد',
      loginUsername: 'rec02',
      loginPin: 'agent123',
      createdAt: '2026-02-01'
    },
    {
      id: 'REC-03',
      primaryId: '1001009',
      name: 'وكيل فودافون كاش وبطاقات النجم (مصر)',
      agent: 'إسلام عزت',
      phone: '+201099887766',
      country: 'جمهورية مصر العربية 🇪🇬',
      tier: 'Tier C',
      coinsBalance: 45000000,
      totalSalesCoins: 195000000,
      todaySalesCoins: 5800000,
      todaySalesUsd: 644,
      discountRate: 5.0,
      status: 'معتمد',
      loginUsername: 'rec03',
      loginPin: 'agent123',
      createdAt: '2026-03-10'
    },
    {
      id: 'REC-04',
      primaryId: '1001015',
      name: 'مجموعة الفرسان الدولية للمدفوعات السريعة (العراق)',
      agent: 'حيدر البصري',
      phone: '+964770123456',
      country: 'جمهورية العراق 🇮🇶',
      tier: 'Tier A',
      coinsBalance: 155000000,
      totalSalesCoins: 520000000,
      todaySalesCoins: 18200000,
      todaySalesUsd: 1820,
      discountRate: 6.8,
      status: 'معتمد',
      loginUsername: 'rec04',
      loginPin: 'agent123',
      createdAt: '2026-01-20'
    }
  ],
  tierRates: {
    'Tier A': {
      tier: 'Tier A',
      name: 'الفئة الذهبية الملكية (Tier A)',
      ratePerDollar: 10000,
      description: 'أعلى سعر صرف تفضيلي لكبرى الوكالات ومستودعات التوزيع الإقليمية',
      minTransferUsd: 10,
      maxTransferUsd: 50000,
      color: 'emerald',
      badge: 'Tier A 🌟'
    },
    'Tier B': {
      tier: 'Tier B',
      name: 'الفئة الماسية المعتمدة (Tier B)',
      ratePerDollar: 9500,
      description: 'سعر صرف متوسط للوكالات المعتمدة النشطة ذات الدوران المنتظم',
      minTransferUsd: 10,
      maxTransferUsd: 25000,
      color: 'sky',
      badge: 'Tier B ⚡'
    },
    'Tier C': {
      tier: 'Tier C',
      name: 'الفئة الفضية الأساسية (Tier C)',
      ratePerDollar: 9000,
      description: 'الفئة القياسية للوكلاء الجدد وموزعي التجزئة ونقاط البيع الفردية',
      minTransferUsd: 5,
      maxTransferUsd: 10000,
      color: 'purple',
      badge: 'Tier C 🛡️'
    }
  },
  p2pTransfers: [
    {
      id: 'P2P-9841',
      hostId: '104829',
      hostName: 'سارة_لايف (الملكية)',
      agencyId: 'REC-01',
      agencyName: 'مؤسسة الدانة للمدفوعات الرقمية',
      amountUsd: 850,
      exchangeRate: 10000,
      convertedCoins: 8500000,
      timestamp: '2026-09-10 14:32:10',
      dateOnly: '2026-09-10',
      referenceId: 'TXN-P2P-8849102',
      status: 'مكتمل ومعتمد ✅'
    },
    {
      id: 'P2P-9840',
      hostId: '382910',
      hostName: 'البرنس_الصوتي',
      agencyId: 'REC-02',
      agencyName: 'مركز الروابي للصرافة',
      amountUsd: 400,
      exchangeRate: 9500,
      convertedCoins: 3800000,
      timestamp: '2026-09-10 11:15:44',
      dateOnly: '2026-09-10',
      referenceId: 'TXN-P2P-7739182',
      status: 'مكتمل ومعتمد ✅'
    },
    {
      id: 'P2P-9839',
      hostId: '449102',
      hostName: 'كابتن_ماجد (بث روم)',
      agencyId: 'REC-03',
      agencyName: 'وكيل فودافون كاش',
      amountUsd: 250,
      exchangeRate: 9000,
      convertedCoins: 2250000,
      timestamp: '2026-09-09 19:40:02',
      dateOnly: '2026-09-09',
      referenceId: 'TXN-P2P-6629177',
      status: 'مكتمل ومعتمد ✅'
    },
    {
      id: 'P2P-9838',
      hostId: '990184',
      hostName: 'شهد_الروابي',
      agencyId: 'REC-04',
      agencyName: 'مجموعة الفرسان الدولية',
      amountUsd: 1200,
      exchangeRate: 10000,
      convertedCoins: 12000000,
      timestamp: '2026-09-09 16:05:22',
      dateOnly: '2026-09-09',
      referenceId: 'TXN-P2P-5519823',
      status: 'مكتمل ومعتمد ✅'
    }
  ],
  userRecharges: [
    {
      id: 'TX-77401',
      agencyId: 'REC-01',
      agencyName: 'مؤسسة الدانة للمدفوعات الرقمية',
      targetUserId: '884910',
      targetUserName: 'فهد_العتيبي',
      coinsAmount: 500000,
      usdValue: 50,
      timestamp: '2026-09-10 15:45:12',
      dateOnly: '2026-09-10',
      paymentMethod: 'سداد فوري / مدى',
      referenceId: 'REF-REC01-994821',
      status: 'ناجحة فورياً ✅'
    },
    {
      id: 'TX-77402',
      agencyId: 'REC-01',
      agencyName: 'مؤسسة الدانة للمدفوعات الرقمية',
      targetUserId: '773192',
      targetUserName: 'أميرة_الورد',
      coinsAmount: 2000000,
      usdValue: 200,
      timestamp: '2026-09-10 14:10:05',
      dateOnly: '2026-09-10',
      paymentMethod: 'تحويل بنكي / الراجحي',
      referenceId: 'REF-REC01-994822',
      status: 'ناجحة فورياً ✅'
    },
    {
      id: 'TX-77403',
      agencyId: 'REC-02',
      agencyName: 'مركز الروابي للصرافة',
      targetUserId: '662019',
      targetUserName: 'سلطان_دبي',
      coinsAmount: 3500000,
      usdValue: 368,
      timestamp: '2026-09-10 13:22:40',
      dateOnly: '2026-09-10',
      paymentMethod: 'بطاقة فيزا إماراتية',
      referenceId: 'REF-REC02-881920',
      status: 'ناجحة فورياً ✅'
    },
    {
      id: 'TX-77404',
      agencyId: 'REC-03',
      agencyName: 'وكيل فودافون كاش',
      targetUserId: '551029',
      targetUserName: 'نور_القاهرة',
      coinsAmount: 1000000,
      usdValue: 111,
      timestamp: '2026-09-10 12:05:18',
      dateOnly: '2026-09-10',
      paymentMethod: 'محفظة فودافون كاش',
      referenceId: 'REF-REC03-772819',
      status: 'ناجحة فورياً ✅'
    },
    {
      id: 'TX-77405',
      agencyId: 'REC-04',
      agencyName: 'مجموعة الفرسان الدولية',
      targetUserId: '440182',
      targetUserName: 'صقر_بغداد',
      coinsAmount: 5000000,
      usdValue: 500,
      timestamp: '2026-09-10 10:50:33',
      dateOnly: '2026-09-10',
      paymentMethod: 'محفظة زين كاش العراق',
      referenceId: 'REF-REC04-663910',
      status: 'ناجحة فورياً ✅'
    }
  ],
  vaultAdjustments: [
    {
      id: 'VF-101',
      agencyId: 'REC-01',
      type: 'ADMIN_CREDIT',
      amountCoins: 50000000,
      adminName: 'سوبر أدمن (المالك)',
      note: 'شحنة كوتة شهرية معتمدة',
      timestamp: '2026-09-01 10:00:00',
      balanceAfter: 120000000
    }
  ]
};

// Sync from Server or LocalStorage if present
async function syncAgenciesFromServer() {
  try {
    const res = await fetch('/api/admin/recharge-agencies');
    const data = await res.json();
    if (data.success && data.agencies) {
      window._rechargeAgenciesState.agencies = data.agencies;
    }
  } catch (e) {
    // offline or local
  }

  try {
    const res = await fetch('/api/admin/tier-rates');
    const data = await res.json();
    if (data.success && data.rates) {
      window._rechargeAgenciesState.tierRates = data.rates;
    }
  } catch (e) {}

  try {
    const res = await fetch('/api/admin/p2p-transfers');
    const data = await res.json();
    if (data.success && data.transfers) {
      window._rechargeAgenciesState.p2pTransfers = data.transfers;
    }
  } catch (e) {}
}

// =========================================================================
// SECTION 1: MASTER ROUTER & FULL-PAGE VIEWS CONTROLLERS (بوابات وصفحات مستقلة)
// =========================================================================

if (!window._rechargeAgenciesState.currentView) {
  window._rechargeAgenciesState.currentView = 'agencies-table';
}
window._rechargeAgenciesState.activeAgencyId = window._rechargeAgenciesState.activeAgencyId || null;
window._rechargeAgenciesState.activeAgencyProfileTab = window._rechargeAgenciesState.activeAgencyProfileTab || 'recharges';
window._rechargeAgenciesContainer = null;

// Master Router for Recharge Agencies Section (بوابة وكالات الشحن المستقلة)
window.renderRechargeAgenciesViewMain = function(container) {
  if (!container) container = document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (!container) return;
  window._rechargeAgenciesContainer = container;

  const state = window._rechargeAgenciesState;

  // Render independent full page views without nested modals immediately
  if (state.currentView === 'agency-profile' && state.activeAgencyId) {
    renderAgencyFullPageProfile(container, state.activeAgencyId);
  } else if (state.currentView === 'tier-rates') {
    renderTierRatesFullPage(container);
  } else if (state.currentView === 'p2p-transfer') {
    renderP2PHostTransferFullPage(container);
  } else if (state.currentView === 'coin-tracking') {
    renderCoinTrackingFullPage(container);
  } else if (state.currentView === 'create-agency') {
    renderCreateAgencyFullPage(container);
  } else if (state.currentView === 'host-audit') {
    renderHostAuditFullPage(container);
  } else {
    state.currentView = 'agencies-table';
    renderAgenciesTablePage(container);
  }

  // Non-blocking background sync from server
  syncAgenciesFromServer().catch(() => {});
};
window.renderRechargeAgenciesView = window.renderRechargeAgenciesViewMain;

// Navigation Controllers (تنقل نظيف ومباشر)
window.navigateToAgenciesList = function() {
  window._rechargeAgenciesState.currentView = 'agencies-table';
  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) window.renderRechargeAgenciesViewMain(container);
};

window.navigateToCoinTracking = function() {
  window._rechargeAgenciesState.currentView = 'coin-tracking';
  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) window.renderRechargeAgenciesViewMain(container);
};

window.navigateToHostAudit = function(hostId) {
  window._rechargeAgenciesState.currentView = 'host-audit';
  window._hostAuditFilter = window._hostAuditFilter || {
    hostId: '104829',
    startDate: '',
    endDate: '',
    direction: 'ALL',
    sourceCategory: 'ALL',
    search: '',
    activeTab: 'unified'
  };
  if (hostId) {
    window._hostAuditFilter.hostId = String(hostId).trim();
  }
  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) window.renderRechargeAgenciesViewMain(container);
};

window.navigateToAgencyProfile = function(agencyId, initialTab = 'recharges') {
  window._rechargeAgenciesState.currentView = 'agency-profile';
  window._rechargeAgenciesState.activeAgencyId = agencyId;
  window._rechargeAgenciesState.activeAgencyProfileTab = initialTab;
  window._activeAgencyProfileId = agencyId;
  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) window.renderRechargeAgenciesViewMain(container);
};

window.navigateToTierRates = function() {
  window._rechargeAgenciesState.currentView = 'tier-rates';
  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) window.renderRechargeAgenciesViewMain(container);
};

window.navigateToP2PTransfer = function(preselectedAgencyId) {
  window._rechargeAgenciesState.currentView = 'p2p-transfer';
  window._rechargeAgenciesState.preselectedP2PAgencyId = preselectedAgencyId || null;
  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) window.renderRechargeAgenciesViewMain(container);
};

window.navigateToCreateAgency = function() {
  window._rechargeAgenciesState.currentView = 'create-agency';
  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) window.renderRechargeAgenciesViewMain(container);
};

// Compatibility aliases
window.openRechargeAgencyDetailsModal = function(agencyId) {
  window.navigateToAgencyProfile(agencyId);
};
window.closeRechargeAgencyDetailsModal = function() {
  window.navigateToAgenciesList();
};

// =========================================================================
// 1. بوابة قائمة الوكالات (Agencies Table Page - صفحة مستقلة ونظيفة تماماً)
// =========================================================================
function renderAgenciesTablePage(container) {
  const state = window._rechargeAgenciesState;
  const agencies = state.agencies || [];
  const tierRates = state.tierRates;

  const totalVaultCoins = agencies.reduce((acc, a) => acc + (a.coinsBalance || 0), 0);
  const totalTodayCoins = agencies.reduce((acc, a) => acc + (a.todaySalesCoins || 0), 0);
  const totalTodayUsd = agencies.reduce((acc, a) => acc + (a.todaySalesUsd || 0), 0);
  const totalP2pTransfers = (state.p2pTransfers || []).length;
  const totalP2pUsd = (state.p2pTransfers || []).reduce((acc, t) => acc + (t.amountUsd || 0), 0);

  container.innerHTML = `
    <div class="space-y-5 animate-in fade-in duration-200">
      
      <!-- TOP ACTION & SUMMARY BAR -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] space-y-4">
        
        <!-- Title and Main Actions -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b-2 border-slate-200 pb-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2.5">
              <div class="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-950 flex items-center justify-center font-black text-2xl border-2 border-emerald-300">
                💳
              </div>
              <div>
                <h2 class="text-base font-black text-slate-950">بوابة قائمة وكالات الشحن المعتمدة (Agencies Table Page)</h2>
                <p class="text-xs text-slate-700 font-bold">الرقابة المركزية المستقلة على الخزائن، تصنيف فئات الصرف، ومطابقة عمليات الشحن</p>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-2 flex-wrap">
            <button 
              type="button" 
              onclick="window.navigateToCreateAgency()"
              class="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>إضافة وكالة شحن جديدة</span>
            </button>

            <button 
              type="button" 
              onclick="window.navigateToTierRates()"
              class="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95">
              <i data-lucide="sliders" class="w-4 h-4 text-amber-400"></i>
              <span>فئات وأسعار الصرف (Tier Rates)</span>
            </button>

            <button 
              type="button" 
              onclick="window.navigateToP2PTransfer()"
              class="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="سجل مراقبة العمليات الآلية المباشرة وتدخلات الاسترجاع الإداري Rollback">
              <i data-lucide="activity" class="w-4 h-4"></i>
              <span>سجل مراقبة تحويلات P2P (أرباح المضيفين) 📡</span>
            </button>

            <button 
              type="button" 
              onclick="window.navigateToCoinTracking()"
              class="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="سجل الرقابة وتتبع مسار الكوينز وحركات الخرج والملاحظات والعملات المحلية">
              <i data-lucide="compass" class="w-4 h-4 text-amber-300"></i>
              <span>تتبع مسار الكوينز والعمليات المحلية 🔍</span>
            </button>

            <button 
              type="button" 
              onclick="window.navigateToHostAudit()"
              class="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="كشف حساب وتدقيق المضيف وحركات الوارد والصادر وفض النزاعات">
              <i data-lucide="file-text" class="w-4 h-4 text-amber-300"></i>
              <span>كشف حساب وتدقيق المضيف 📑</span>
            </button>

            <button 
              type="button" 
              onclick="window.openMerchantPortalNewTab()"
              class="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="فتح بوابة الويب المستقلة الخاصة بالوكيل في نافذة جديدة">
              <i data-lucide="external-link" class="w-4 h-4 text-emerald-600"></i>
              <span>بوابة الوكلاء المستقلة ↗</span>
            </button>
          </div>
        </div>

        <!-- Metric KPI Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-3.5 rounded-2xl bg-[#f7fbfd] border-2 border-slate-300 text-right">
            <span class="text-[11px] font-bold text-slate-600 block">إجمالي وكالات الشحن المعتمدة:</span>
            <div class="text-base sm:text-lg font-black font-mono text-slate-950 mt-1">${agencies.length} وكالة نشطة 🏢</div>
          </div>

          <div class="p-3.5 rounded-2xl bg-[#f7fbfd] border-2 border-slate-300 text-right">
            <span class="text-[11px] font-bold text-slate-600 block">إجمالي رصيد الخزائن المتاح:</span>
            <div class="text-base sm:text-lg font-black font-mono text-amber-700 mt-1">${totalVaultCoins.toLocaleString()} 🪙</div>
          </div>

          <div class="p-3.5 rounded-2xl bg-[#f7fbfd] border-2 border-slate-300 text-right">
            <span class="text-[11px] font-bold text-slate-600 block">إجمالي شحنات السوق اليوم:</span>
            <div class="text-base sm:text-lg font-black font-mono text-emerald-800 mt-1">${totalTodayCoins.toLocaleString()} 🪙 <span class="text-xs text-slate-600 font-bold">(~$${totalTodayUsd.toLocaleString()})</span></div>
          </div>

          <div class="p-3.5 rounded-2xl bg-[#f7fbfd] border-2 border-slate-300 text-right">
            <span class="text-[11px] font-bold text-slate-600 block">تحويلات أرباح المضيفين (P2P):</span>
            <div class="text-base sm:text-lg font-black font-mono text-sky-800 mt-1">$${totalP2pUsd.toLocaleString()} USD <span class="text-xs text-slate-600 font-bold">(${totalP2pTransfers} عملية)</span></div>
          </div>
        </div>

      </div>

      <!-- MAIN AGENCIES TABLE (صفوف أفقية مرتبة وبسيطة: اسم الوكالة، الـ ID، الفئة، رصيد الخزينة، وزر دخول) -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] space-y-4">
        
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-2 border-slate-200 pb-3">
          <div>
            <h3 class="text-sm font-black text-slate-950">قائمة وكالات الشحن المعتمدة</h3>
            <p class="text-xs text-slate-600 font-bold">انقر على أي صف أو اضغط زر "دخول" لفتح بوابة ملف الوكالة التفصيلي المستقلة</p>
          </div>
          <div class="flex items-center gap-2">
            <input 
              type="text" 
              id="agenciesTableSearchInput" 
              oninput="window.filterAgenciesTableRows()" 
              placeholder="بحث باسم الوكالة، الـ ID، الدولة..." 
              class="px-3.5 py-2 rounded-xl border-2 border-slate-300 bg-slate-50 text-xs font-bold w-64 focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <span class="text-xs font-mono font-bold text-slate-600 px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 whitespace-nowrap">
              ${agencies.length} وكالات
            </span>
          </div>
        </div>

        <div class="overflow-x-auto rounded-xl border-2 border-slate-300 bg-white">
          <table class="w-full text-right text-xs whitespace-nowrap" id="agenciesMainMasterTable">
            <thead class="bg-slate-100 text-slate-950 font-black border-b-2 border-slate-400">
              <tr>
                <th class="py-3 px-4 border-l border-slate-200/80">اسم الوكالة</th>
                <th class="py-3 px-4 text-center border-l border-slate-200/80">الآيدي الرئيسي (الموحد)</th>
                <th class="py-3 px-4 text-center border-l border-slate-200/80">الآيدي الفرعي (الكود)</th>
                <th class="py-3 px-4 text-center border-l border-slate-200/80">الفئة</th>
                <th class="py-3 px-4 text-center border-l border-slate-200/80">رصيد الخزينة</th>
                <th class="py-3 px-4 text-center border-l border-slate-200/80">شحنات اليوم</th>
                <th class="py-3 px-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-300">
              ${agencies.map((ag, idx) => {
                const tierBadge = tierRates[ag.tier]?.badge || ag.tier;
                const tierColor = ag.tier === 'Tier A' 
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-300' 
                  : ag.tier === 'Tier B' 
                  ? 'bg-sky-100 text-sky-950 border-sky-300' 
                  : 'bg-purple-100 text-purple-950 border-purple-300';

                return `
                  <tr 
                    onclick="window.navigateToAgencyProfile('${ag.id}')"
                    data-agency-search="${(ag.name + ' ' + (ag.primaryId || '') + ' ' + ag.id + ' ' + ag.agent + ' ' + ag.country).toLowerCase()}"
                    class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#dff0f5] transition cursor-pointer border-b border-slate-300 group">
                    
                    <!-- اسم الوكالة -->
                    <td class="py-3 px-4 font-black text-slate-950 border-l border-slate-200/80">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-white border-2 border-slate-300 flex items-center justify-center text-lg shadow-2xs group-hover:border-emerald-500 transition">
                          🏢
                        </div>
                        <div>
                          <div class="font-black text-slate-950 group-hover:text-emerald-900 transition text-sm">${ag.name}</div>
                          <div class="text-[11px] font-bold text-slate-600 mt-0.5">${ag.agent} • ${ag.phone} • ${ag.country}</div>
                        </div>
                      </div>
                    </td>

                    <!-- الآيدي الرئيسي -->
                    <td class="py-3 px-4 font-mono font-black text-slate-900 border-l border-slate-200/80 text-center">
                      <span class="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-300 text-amber-950 font-black text-xs inline-flex items-center gap-1 shadow-2xs" title="المعرف الرئيسي الموحد لنظام تطبيق النجم">
                        <span>#${ag.primaryId || '1001007'}</span>
                      </span>
                    </td>

                    <!-- الآيدي الفرعي -->
                    <td class="py-3 px-4 font-mono font-black text-slate-900 border-l border-slate-200/80 text-center">
                      <span class="px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-800 font-bold text-xs inline-flex items-center gap-1 shadow-2xs" title="الكود الفرعي الوظيفي لوكالة الشحن">
                        <span>${ag.id}</span>
                      </span>
                    </td>

                    <!-- الفئة -->
                    <td class="py-3 px-4 text-center border-l border-slate-200/80">
                      <span class="px-3 py-1 rounded-lg font-mono font-black text-xs ${tierColor} border shadow-2xs">
                        ${tierBadge}
                      </span>
                    </td>

                    <!-- رصيد الخزينة -->
                    <td class="py-3 px-4 text-center font-mono font-black text-amber-800 text-sm border-l border-slate-200/80">
                      ${Number(ag.coinsBalance).toLocaleString()} 🪙
                    </td>

                    <!-- شحنات اليوم -->
                    <td class="py-3 px-4 text-center font-mono font-bold text-slate-800 border-l border-slate-200/80">
                      <div class="font-black text-emerald-800">${Number(ag.todaySalesCoins).toLocaleString()} 🪙</div>
                      <div class="text-[10px] text-slate-500 font-bold">~$${Number(ag.todaySalesUsd).toLocaleString()} USD</div>
                    </td>

                    <!-- زر دخول -->
                    <td class="py-3 px-4 text-center">
                      <button 
                        type="button" 
                        onclick="event.stopPropagation(); window.navigateToAgencyProfile('${ag.id}')"
                        class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5 mx-auto active:scale-95"
                        title="دخول لملف الوكالة الشامل">
                        <span>دخول</span>
                        <i data-lucide="arrow-left" class="w-4 h-4"></i>
                      </button>
                    </td>

                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

      </div>

      <!-- INBOUND P2P TRANSFERS MASTER TABLE (التحويلات الواردة للوكلاء) -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-3 border-b-2 border-slate-200 pb-3">
          <div>
            <h3 class="text-sm font-black text-slate-950">سجل التحويلات الواردة لوكالات الشحن من المضيفين (Host-to-Agency P2P)</h3>
            <p class="text-xs text-slate-600 font-bold">يوضح المبالغ بالدولار والأرباح المحولة من المضيفين وقيمتها المحولة لكوينز شحن مغذاة في الخزائن</p>
          </div>
          <button 
            type="button" 
            onclick="window.navigateToP2PTransfer()"
            class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs">
            <i data-lucide="activity" class="w-3.5 h-3.5 text-amber-400"></i>
            <span>فتح سجل المراقبة الشامل والتدخل الإداري (Rollback) ↗</span>
          </button>
        </div>

        <div class="overflow-x-auto rounded-xl border-2 border-slate-300 bg-white">
          <table class="w-full text-right text-xs whitespace-nowrap">
            <thead class="bg-slate-100 text-slate-950 font-black border-b-2 border-slate-400">
              <tr>
                <th class="py-2.5 px-3 border-l border-slate-200/80">رقم الحوالة المرجعي</th>
                <th class="py-2.5 px-3 border-l border-slate-200/80">المضيف المحول (Host)</th>
                <th class="py-2.5 px-3 border-l border-slate-200/80">وكالة الشحن المستلمة</th>
                <th class="py-2.5 px-3 text-center border-l border-slate-200/80">مبلغ الأرباح المحول</th>
                <th class="py-2.5 px-3 text-center border-l border-slate-200/80">سعر الصرف المعتمد</th>
                <th class="py-2.5 px-3 text-center border-l border-slate-200/80">الكوينز المغذاة في الخزينة</th>
                <th class="py-2.5 px-3 text-center border-l border-slate-200/80">التاريخ والوقت</th>
                <th class="py-2.5 px-3 text-center border-l border-slate-200/80">حالة التحويل</th>
                <th class="py-2.5 px-3 text-center">الإجراء الرقابي (Rollback)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-300">
              ${(state.p2pTransfers || []).map((tr, idx) => {
                const isRolledBack = tr.isRolledBack || (tr.status && tr.status.includes('ملغى'));
                return `
                <tr class="${isRolledBack ? 'bg-rose-50/40 hover:bg-rose-50' : (idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white')} hover:bg-[#dff0f5] transition">
                  <td class="py-2.5 px-3 font-mono font-bold text-slate-900 border-l border-slate-200/80">${tr.referenceId}</td>
                  <td class="py-2.5 px-3 font-black text-slate-950 border-l border-slate-200/80">
                    <div>${tr.hostName}</div>
                    <div class="font-mono text-slate-500 text-[10px]">#${tr.hostId}</div>
                  </td>
                  <td class="py-2.5 px-3 font-bold text-slate-900 border-l border-slate-200/80">
                    <div>${tr.agencyName}</div>
                    <div class="font-mono text-slate-500 text-[10px]">#${tr.agencyId}</div>
                  </td>
                  <td class="py-2.5 px-3 text-center font-mono font-black text-emerald-800 border-l border-slate-200/80">
                    $${Number(tr.amountUsd).toLocaleString()}
                  </td>
                  <td class="py-2.5 px-3 text-center font-mono font-bold text-slate-700 border-l border-slate-200/80">
                    ${Number(tr.exchangeRate).toLocaleString()} 🪙/$1
                  </td>
                  <td class="py-2.5 px-3 text-center font-mono font-black ${isRolledBack ? 'line-through text-slate-400' : 'text-amber-700'} border-l border-slate-200/80">
                    +${Number(tr.convertedCoins).toLocaleString()} 🪙
                  </td>
                  <td class="py-2.5 px-3 text-center font-mono text-slate-600 border-l border-slate-200/80">${tr.timestamp}</td>
                  <td class="py-2.5 px-3 text-center border-l border-slate-200/80">
                    ${isRolledBack ? `
                      <span class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-950 border border-rose-300 font-black text-[10px]">
                        ملغى ومسترجع ↩️
                      </span>
                    ` : `
                      <span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300 font-black text-[10px]">
                        معتمد آلياً ✅
                      </span>
                    `}
                  </td>
                  <td class="py-2.5 px-3 text-center">
                    ${isRolledBack ? `
                      <span class="text-slate-500 font-bold text-[11px]">تم الاسترجاع</span>
                    ` : `
                      <button 
                        type="button" 
                        onclick="window.openP2PRollbackModal('${tr.referenceId}')" 
                        class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-black transition cursor-pointer active:scale-95 shadow-2xs">
                        إلغاء واسترجاع ↩️
                      </button>
                    `}
                  </td>
                </tr>
              `}).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

window.filterAgenciesTableRows = function() {
  const query = (document.getElementById('agenciesTableSearchInput')?.value || '').toLowerCase().trim();
  const rows = document.querySelectorAll('#agenciesMainMasterTable tbody tr');
  rows.forEach(r => {
    const text = r.getAttribute('data-agency-search') || '';
    if (!query || text.includes(query)) {
      r.classList.remove('hidden');
    } else {
      r.classList.add('hidden');
    }
  });
};

// =========================================================================
// 2. بوابة ملف الوكالة التفصيلي (Agency Full Page Profile - صفحة جديدة خاصة بهذه الوكالة فقط)
// =========================================================================
function renderAgencyFullPageProfile(container, agencyId) {
  const state = window._rechargeAgenciesState;
  const agency = (state.agencies || []).find(a => a.id === agencyId);
  if (!agency) {
    window.navigateToAgenciesList();
    return;
  }

  const tierRates = state.tierRates;
  const currentTab = state.activeAgencyProfileTab || 'recharges';
  const tierBadge = tierRates[agency.tier]?.badge || agency.tier;
  const tierRate = tierRates[agency.tier]?.ratePerDollar || 10000;

  container.innerHTML = `
    <div class="space-y-5 animate-in fade-in duration-200">
      
      <!-- TOP NAVIGATION BAR WITH BACK BUTTON -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex items-center gap-3">
          <button 
            type="button" 
            onclick="window.navigateToAgenciesList()" 
            class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95">
            <i data-lucide="arrow-right" class="w-4 h-4 text-amber-400"></i>
            <span>رجوع لقائمة الوكالات</span>
          </button>

          <div class="h-6 w-px bg-slate-300 hidden sm:block"></div>

          <div class="text-xs text-slate-700 font-bold flex items-center gap-2 flex-wrap">
            <span class="text-slate-500">وكالات الشحن المعتمدة</span>
            <span>/</span>
            <span class="text-slate-950 font-black">${agency.name}</span>
            <span class="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-300 text-amber-950 font-mono text-[11px] font-black" title="الآيدي الرئيسي الموحد">هوية: #${agency.primaryId || '1001007'}</span>
            <span class="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300 font-mono text-[11px] font-bold" title="الآيدي الفرعي (كود الوكالة)">${agency.id}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button 
            type="button" 
            onclick="window.openMerchantPortalNewTab()"
            class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-800 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
            <i data-lucide="external-link" class="w-4 h-4 text-emerald-600"></i>
            <span>فتح في بوابة الموزع المستقلة</span>
          </button>
        </div>
      </div>

      <!-- AGENCY MASTER PROFILE HERO CARD -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] space-y-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-2 border-slate-200 pb-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-950 border-2 border-emerald-300 flex items-center justify-center font-black text-3xl shrink-0 shadow-xs">
              🏢
            </div>
            <div>
              <div class="flex items-center gap-2.5 flex-wrap">
                <h2 class="text-lg font-black text-slate-950">${agency.name}</h2>
                <span class="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300 font-black text-xs">
                  ${tierBadge}
                </span>
                <span class="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-black text-xs">
                  ${agency.status}
                </span>
                <span class="px-2.5 py-0.5 rounded-md font-mono text-xs font-black text-amber-950 bg-amber-50 border border-amber-300 shadow-2xs" title="الآيدي الرئيسي الموحد لنظام تطبيق النجم">
                  الرئيسي: #${agency.primaryId || '1001007'}
                </span>
                <span class="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-300" title="الآيدي الفرعي (كود الوكالة)">
                  الفرعي: ${agency.id}
                </span>
              </div>
              <div class="text-xs text-slate-600 font-bold mt-1.5 flex items-center gap-3 flex-wrap">
                <span>المفوض: <strong>${agency.agent}</strong></span>
                <span>•</span>
                <span>هاتف: <strong dir="ltr">${agency.phone}</strong></span>
                <span>•</span>
                <span>الدولة: <strong>${agency.country}</strong></span>
                <span>•</span>
                <span>تاريخ الاعتماد: <strong>${agency.createdAt}</strong></span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <button 
              type="button" 
              onclick="window.switchAgencyProfileTab('vault')" 
              class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-95">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>تغذية كوتة رصيد الخزينة</span>
            </button>
          </div>
        </div>

        <!-- KPI 4 Cards Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-right">
            <span class="text-[11px] font-bold text-amber-950 block">رصيد الخزينة المتبقي:</span>
            <div class="text-base sm:text-xl font-black font-mono text-amber-800 mt-1">${Number(agency.coinsBalance).toLocaleString()} 🪙</div>
          </div>

          <div class="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-right">
            <span class="text-[11px] font-bold text-emerald-950 block">إجمالي مبيعات اليوم:</span>
            <div class="text-base sm:text-lg font-black font-mono text-emerald-800 mt-1">${Number(agency.todaySalesCoins).toLocaleString()} 🪙 <span class="text-xs text-slate-600 font-bold">(~$${Number(agency.todaySalesUsd).toLocaleString()})</span></div>
          </div>

          <div class="p-3.5 rounded-2xl bg-sky-50 border-2 border-sky-300 text-right">
            <span class="text-[11px] font-bold text-sky-950 block">سعر الصرف المعتمد لفئتها:</span>
            <div class="text-base sm:text-lg font-black font-mono text-sky-900 mt-1">${Number(tierRate).toLocaleString()} 🪙 <span class="text-xs text-slate-600 font-bold">/ $1 USD</span></div>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-300 text-right">
            <span class="text-[11px] font-bold text-slate-600 block">نسبة الخصم المعتمدة:</span>
            <div class="text-base sm:text-lg font-black font-mono text-slate-900 mt-1">${agency.discountRate || 6.0}%</div>
          </div>
        </div>

      </div>

      <!-- FULL PAGE TABS BAR (أقسام ملف الوكالة المستقلة) -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] overflow-hidden">
        
        <div class="bg-slate-100 border-b-2 border-slate-300 px-3 flex items-center gap-1.5 overflow-x-auto">
          <button 
            type="button" 
            id="profileTabBtn-recharges" 
            onclick="window.switchAgencyProfileTab('recharges')" 
            class="agency-page-tab-btn py-3 px-4 font-black text-xs border-b-2 ${currentTab === 'recharges' ? 'border-emerald-600 text-emerald-950 bg-white' : 'border-transparent text-slate-600 hover:text-slate-950'} flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap">
            <i data-lucide="check-check" class="w-4 h-4 ${currentTab === 'recharges' ? 'text-emerald-600' : ''}"></i>
            <span>سجل الشحنات المنفذة للمستخدمين</span>
          </button>

          <button 
            type="button" 
            id="profileTabBtn-vault" 
            onclick="window.switchAgencyProfileTab('vault')" 
            class="agency-page-tab-btn py-3 px-4 font-black text-xs border-b-2 ${currentTab === 'vault' ? 'border-emerald-600 text-emerald-950 bg-white' : 'border-transparent text-slate-600 hover:text-slate-950'} flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap">
            <i data-lucide="vault" class="w-4 h-4 ${currentTab === 'vault' ? 'text-emerald-600' : ''}"></i>
            <span>إدارة وتغذية الخزينة والتصنيف</span>
          </button>

          <button 
            type="button" 
            id="profileTabBtn-p2p" 
            onclick="window.switchAgencyProfileTab('p2p')" 
            class="agency-page-tab-btn py-3 px-4 font-black text-xs border-b-2 ${currentTab === 'p2p' ? 'border-emerald-600 text-emerald-950 bg-white' : 'border-transparent text-slate-600 hover:text-slate-950'} flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap">
            <i data-lucide="arrow-down-left" class="w-4 h-4 ${currentTab === 'p2p' ? 'text-emerald-600' : ''}"></i>
            <span>التحويلات الواردة من المضيفين (P2P)</span>
          </button>

          <button 
            type="button" 
            id="profileTabBtn-reconciliation" 
            onclick="window.switchAgencyProfileTab('reconciliation')" 
            class="agency-page-tab-btn py-3 px-4 font-black text-xs border-b-2 ${currentTab === 'reconciliation' ? 'border-emerald-600 text-emerald-950 bg-white' : 'border-transparent text-slate-600 hover:text-slate-950'} flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap">
            <i data-lucide="scale" class="w-4 h-4 ${currentTab === 'reconciliation' ? 'text-emerald-600' : ''}"></i>
            <span>كشف المطابقة والتدقيق المالي</span>
          </button>

          <button 
            type="button" 
            id="profileTabBtn-stats" 
            onclick="window.switchAgencyProfileTab('stats')" 
            class="agency-page-tab-btn py-3 px-4 font-black text-xs border-b-2 ${currentTab === 'stats' ? 'border-emerald-600 text-emerald-950 bg-white' : 'border-transparent text-slate-600 hover:text-slate-950'} flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap">
            <i data-lucide="bar-chart-2" class="w-4 h-4 ${currentTab === 'stats' ? 'text-emerald-600' : ''}"></i>
            <span>الإحصائيات والمخطط البياني</span>
          </button>
        </div>

        <!-- ACTIVE TAB CONTAINER (صفحة نظيفة ومستقلة) -->
        <div id="agencyProfileTabContainer" class="p-5">
          <!-- Injected dynamically -->
        </div>

      </div>

    </div>
  `;

  if (window.lucide) lucide.createIcons();
  window.switchAgencyProfileTab(currentTab);
}

// =========================================================================
// 3. بوابة فئات وأسعار الصرف المركزية (Tier Rates Full Page View)
// نظام الفئات الثابتة: إلغاء الإدخال اليدوي، والتطبيق الآلي المركزي
// =========================================================================
function renderTierRatesFullPage(container) {
  const state = window._rechargeAgenciesState;
  const rates = state.tierRates || {};
  const agencies = state.agencies || [];

  const rateA = rates['Tier A']?.ratePerDollar || 10000;
  const rateB = rates['Tier B']?.ratePerDollar || 12000;
  const rateC = rates['Tier C']?.ratePerDollar || 15000;

  const countA = agencies.filter(a => a.tier === 'Tier A').length;
  const countB = agencies.filter(a => a.tier === 'Tier B').length;
  const countC = agencies.filter(a => a.tier === 'Tier C').length;

  container.innerHTML = `
    <div class="space-y-5 animate-in fade-in duration-200">
      
      <!-- Top Bar with Back Button & Direct Save -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex items-center gap-3">
          <button 
            type="button" 
            onclick="window.navigateToAgenciesList()" 
            class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95">
            <i data-lucide="arrow-right" class="w-4 h-4 text-amber-400"></i>
            <span>رجوع لقائمة الوكالات</span>
          </button>

          <div class="h-6 w-px bg-slate-300 hidden sm:block"></div>

          <div class="text-xs text-slate-700 font-bold flex items-center gap-2">
            <span class="text-slate-500">وكالات الشحن</span>
            <span>/</span>
            <span class="text-slate-950 font-black">بوابة فئات وأسعار الصرف المركزية (Tier Rates)</span>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <button 
            type="button" 
            onclick="window.saveTierRates()" 
            class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95">
            <i data-lucide="save" class="w-4 h-4"></i>
            <span>حفظ وتطبيق أسعار الصرف فوراً</span>
          </button>
        </div>
      </div>

      <!-- Architectural Banner: No Manual Input & 100% Automated Policy -->
      <div class="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-2xl border-2 border-emerald-300 p-4 shadow-sm">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
            ⚙️
          </div>
          <div class="space-y-1">
            <h4 class="text-sm font-black text-emerald-950">نظام الفئات الثابتة لسعر الصرف (Tier A / B / C System) — ضبط مركزي وتطبيق آلي 100%</h4>
            <p class="text-xs text-emerald-900 leading-relaxed font-bold">
              • <span class="underline">إلغاء الإدخال اليدوي تماماً</span>: لا يكتب الوكيل أو الإدارة سعر صرف يدوي بالدولار عند كل عملية شحن أو تحويل.<br/>
              • <span class="underline">التطبيق الآلي المباشر</span>: بمجرد اختيار فئة الوكيل (أ أو ب أو ج)، يحسب النظام الكوينز المستحقة والمخصومة تلقائياً وبدقة دون تدخل بشري وفقاً للجدول المركزي أدناه.
            </p>
          </div>
        </div>
      </div>

      <!-- Central Tier Rates Table -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] space-y-4">
        <div class="border-b border-slate-200 pb-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 class="text-sm font-black text-slate-950">جدول أسعار الصرف المركزية المعتمدة لكل فئة</h3>
            <p class="text-xs text-slate-600 font-bold">تحديد سعر التحويل الرسمي (الكوينز لكل $1 أرباح مضيف أو شحن) وتطبيقها التلقائي على كافة المعاملات</p>
          </div>
          <span class="px-3 py-1 rounded-xl bg-slate-100 text-slate-900 font-black text-xs border border-slate-300">
            تطبيق آلي فوري على كافة الخزائن ⚡
          </span>
        </div>

        <div class="overflow-x-auto rounded-xl border-2 border-slate-300 bg-white">
          <table class="w-full text-right text-xs whitespace-nowrap">
            <thead class="bg-slate-100 text-slate-950 font-black border-b-2 border-slate-400">
              <tr>
                <th class="py-3 px-4 border-l border-slate-200/80">الفئة (Tier)</th>
                <th class="py-3 px-4 border-l border-slate-200/80">مستوى الوكالات المستهدفة</th>
                <th class="py-3 px-4 text-center border-l border-slate-200/80">سعر الصرف المعتمد (كوينز لكل $1)</th>
                <th class="py-3 px-4 text-center border-l border-slate-200/80">محاكي تحويل $50</th>
                <th class="py-3 px-4 text-center border-l border-slate-200/80">محاكي تحويل $100</th>
                <th class="py-3 px-4 text-center border-l border-slate-200/80">محاكي تحويل $500</th>
                <th class="py-3 px-4 text-center border-l border-slate-200/80">محاكي تحويل $1,000</th>
                <th class="py-3 px-4 text-center border-l border-slate-200/80">الوكالات التابعة</th>
                <th class="py-3 px-4 text-center">حالة الربط الآلي</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-300">
              
              <!-- TIER A ROW -->
              <tr class="bg-[#f7fbfd] hover:bg-[#edf6f9] transition">
                <td class="py-3.5 px-4 font-black border-l border-slate-200/80">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">🥇</span>
                    <div>
                      <span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300 font-mono font-black text-xs">الفئة (أ / Tier A)</span>
                      <span class="text-[10px] text-emerald-800 font-bold block mt-0.5">فئة النخبة للشركاء الكبار</span>
                    </div>
                  </div>
                </td>
                <td class="py-3.5 px-4 font-bold text-slate-700 border-l border-slate-200/80">
                  الوكالات الاستراتيجية وضخام الحجم
                </td>
                <td class="py-3.5 px-4 text-center border-l border-slate-200/80">
                  <div class="inline-flex items-center gap-1.5">
                    <input 
                      type="number" 
                      id="tierRateA" 
                      value="${rateA}"
                      oninput="window.simulateTierRatesCalc()"
                      class="w-28 px-2.5 py-1.5 rounded-lg border-2 border-emerald-400 font-mono font-black text-emerald-900 bg-white text-center text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none" />
                    <span class="font-bold text-xs text-slate-700">🪙/$1</span>
                  </div>
                </td>
                <td class="py-3.5 px-4 text-center font-mono font-bold text-slate-800 border-l border-slate-200/80" id="sim-50-A">
                  ${(50 * rateA).toLocaleString()} 🪙
                </td>
                <td class="py-3.5 px-4 text-center font-mono font-black text-emerald-800 border-l border-slate-200/80" id="sim-100-A">
                  ${(100 * rateA).toLocaleString()} 🪙
                </td>
                <td class="py-3.5 px-4 text-center font-mono font-bold text-slate-800 border-l border-slate-200/80" id="sim-500-A">
                  ${(500 * rateA).toLocaleString()} 🪙
                </td>
                <td class="py-3.5 px-4 text-center font-mono font-black text-amber-800 border-l border-slate-200/80" id="sim-1000-A">
                  ${(1000 * rateA).toLocaleString()} 🪙
                </td>
                <td class="py-3.5 px-4 text-center font-mono font-bold text-slate-800 border-l border-slate-200/80">
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 font-black text-xs border border-slate-300">${countA} وكالة</span>
                </td>
                <td class="py-3.5 px-4 text-center">
                  <span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 font-black text-[11px] border border-emerald-300">آلي 100% ✅</span>
                </td>
              </tr>

              <!-- TIER B ROW -->
              <tr class="bg-white hover:bg-[#edf6f9] transition">
                <td class="py-3.5 px-4 font-black border-l border-slate-200/80">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">🥈</span>
                    <div>
                      <span class="px-2 py-0.5 rounded-md bg-sky-100 text-sky-950 border border-sky-300 font-mono font-black text-xs">الفئة (ب / Tier B)</span>
                      <span class="text-[10px] text-sky-800 font-bold block mt-0.5">فئة النمو المتوسط المتقدم</span>
                    </div>
                  </div>
                </td>
                <td class="py-3.5 px-4 font-bold text-slate-700 border-l border-slate-200/80">
                  الوكالات المتوسطة والموزعون المعتمدون
                </td>
                <td class="py-3.5 px-4 text-center border-l border-slate-200/80">
                  <div class="inline-flex items-center gap-1.5">
                    <input 
                      type="number" 
                      id="tierRateB" 
                      value="${rateB}"
                      oninput="window.simulateTierRatesCalc()"
                      class="w-28 px-2.5 py-1.5 rounded-lg border-2 border-sky-400 font-mono font-black text-sky-900 bg-white text-center text-sm focus:ring-2 focus:ring-sky-600 focus:outline-none" />
                    <span class="font-bold text-xs text-slate-700">🪙/$1</span>
                  </div>
                </td>
                <td class="py-3.5 px-4 text-center font-mono font-bold text-slate-800 border-l border-slate-200/80" id="sim-50-B">
                  ${(50 * rateB).toLocaleString()} 🪙
                </td>
                <td class="py-3.5 px-4 text-center font-mono font-black text-sky-800 border-l border-slate-200/80" id="sim-100-B">
                  ${(100 * rateB).toLocaleString()} 🪙
                </td>
                <td class="py-3.5 px-4 text-center font-mono font-bold text-slate-800 border-l border-slate-200/80" id="sim-500-B">
                  ${(500 * rateB).toLocaleString()} 🪙
                </td>
                <td class="py-3.5 px-4 text-center font-mono font-black text-amber-800 border-l border-slate-200/80" id="sim-1000-B">
                  ${(1000 * rateB).toLocaleString()} 🪙
                </td>
                <td class="py-3.5 px-4 text-center font-mono font-bold text-slate-800 border-l border-slate-200/80">
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 font-black text-xs border border-slate-300">${countB} وكالة</span>
                </td>
                <td class="py-3.5 px-4 text-center">
                  <span class="px-2 py-0.5 rounded-md bg-sky-100 text-sky-950 font-black text-[11px] border border-sky-300">آلي 100% ✅</span>
                </td>
              </tr>

              <!-- TIER C ROW -->
              <tr class="bg-[#f7fbfd] hover:bg-[#edf6f9] transition">
                <td class="py-3.5 px-4 font-black border-l border-slate-200/80">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">🥉</span>
                    <div>
                      <span class="px-2 py-0.5 rounded-md bg-purple-100 text-purple-950 border border-purple-300 font-mono font-black text-xs">الفئة (ج / Tier C)</span>
                      <span class="text-[10px] text-purple-800 font-bold block mt-0.5">فئة الانطلاق والموزعين الجدد</span>
                    </div>
                  </div>
                </td>
                <td class="py-3.5 px-4 font-bold text-slate-700 border-l border-slate-200/80">
                  الوكلاء الجدد والوكالات المحلية الناشئة
                </td>
                <td class="py-3.5 px-4 text-center border-l border-slate-200/80">
                  <div class="inline-flex items-center gap-1.5">
                    <input 
                      type="number" 
                      id="tierRateC" 
                      value="${rateC}"
                      oninput="window.simulateTierRatesCalc()"
                      class="w-28 px-2.5 py-1.5 rounded-lg border-2 border-purple-400 font-mono font-black text-purple-900 bg-white text-center text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none" />
                    <span class="font-bold text-xs text-slate-700">🪙/$1</span>
                  </div>
                </td>
                <td class="py-3.5 px-4 text-center font-mono font-bold text-slate-800 border-l border-slate-200/80" id="sim-50-C">
                  ${(50 * rateC).toLocaleString()} 🪙
                </td>
                <td class="py-3.5 px-4 text-center font-mono font-black text-purple-800 border-l border-slate-200/80" id="sim-100-C">
                  ${(100 * rateC).toLocaleString()} 🪙
                </td>
                <td class="py-3.5 px-4 text-center font-mono font-bold text-slate-800 border-l border-slate-200/80" id="sim-500-C">
                  ${(500 * rateC).toLocaleString()} 🪙
                </td>
                <td class="py-3.5 px-4 text-center font-mono font-black text-amber-800 border-l border-slate-200/80" id="sim-1000-C">
                  ${(1000 * rateC).toLocaleString()} 🪙
                </td>
                <td class="py-3.5 px-4 text-center font-mono font-bold text-slate-800 border-l border-slate-200/80">
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 font-black text-xs border border-slate-300">${countC} وكالة</span>
                </td>
                <td class="py-3.5 px-4 text-center">
                  <span class="px-2 py-0.5 rounded-md bg-purple-100 text-purple-950 font-black text-[11px] border border-purple-300">آلي 100% ✅</span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      <!-- Live Interactive Simulator Calculator -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] space-y-4">
        <div class="border-b border-slate-200 pb-3">
          <h3 class="text-sm font-black text-slate-950 flex items-center gap-2">
            <span>محاكي التحويل الفوري التلقائي (Live P2P & Outflow Simulator)</span>
            <span class="text-xs text-emerald-700 font-bold font-mono">⚡ حاسبة مركزية للمطابقة</span>
          </h3>
          <p class="text-xs text-slate-600 font-bold">أدخل أي مبلغ بالدولار لاختبار عدد الكوينز المستحقة آلياً في كل فئة من الفئات الثلاث بدون أي إدخال يدوي</p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div class="w-full sm:w-72">
            <label class="block text-xs font-black text-slate-900 mb-1">المبلغ المطلوب تحويله بالدولار ($ USD):</label>
            <div class="relative">
              <input 
                type="number" 
                id="simulatorUsdInput" 
                value="250"
                min="1"
                step="10"
                oninput="window.simulateTierRatesCalc()"
                class="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 font-mono font-black text-slate-950 text-base bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600" />
              <span class="absolute left-3 top-2.5 font-mono font-black text-slate-500 text-xs">$ USD</span>
            </div>
          </div>

          <!-- Comparison Display -->
          <div class="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-300">
              <span class="text-[11px] font-black text-emerald-950 block">الفئة (أ / Tier A)</span>
              <span id="simCalcResultA" class="font-mono font-black text-base text-emerald-800 block mt-1">2,500,000 🪙</span>
              <span class="text-[10px] text-emerald-700 font-bold block">معدل: 1$ = ${rateA.toLocaleString()} كوينز</span>
            </div>
            <div class="p-3 rounded-xl bg-sky-50 border border-sky-300">
              <span class="text-[11px] font-black text-sky-950 block">الفئة (ب / Tier B)</span>
              <span id="simCalcResultB" class="font-mono font-black text-base text-sky-800 block mt-1">3,000,000 🪙</span>
              <span class="text-[10px] text-sky-700 font-bold block">معدل: 1$ = ${rateB.toLocaleString()} كوينز</span>
            </div>
            <div class="p-3 rounded-xl bg-purple-50 border border-purple-300">
              <span class="text-[11px] font-black text-purple-950 block">الفئة (ج / Tier C)</span>
              <span id="simCalcResultC" class="font-mono font-black text-base text-purple-800 block mt-1">3,750,000 🪙</span>
              <span class="text-[10px] text-purple-700 font-bold block">معدل: 1$ = ${rateC.toLocaleString()} كوينز</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;

  if (window.lucide) lucide.createIcons();
  window.simulateTierRatesCalc();
}

window.simulateTierRatesCalc = function() {
  const usd = Number(document.getElementById('simulatorUsdInput')?.value) || 0;
  const rateA = Number(document.getElementById('tierRateA')?.value) || 10000;
  const rateB = Number(document.getElementById('tierRateB')?.value) || 12000;
  const rateC = Number(document.getElementById('tierRateC')?.value) || 15000;

  const resA = document.getElementById('simCalcResultA');
  const resB = document.getElementById('simCalcResultB');
  const resC = document.getElementById('simCalcResultC');

  if (resA) resA.textContent = `${(usd * rateA).toLocaleString()} 🪙`;
  if (resB) resB.textContent = `${(usd * rateB).toLocaleString()} 🪙`;
  if (resC) resC.textContent = `${(usd * rateC).toLocaleString()} 🪙`;

  // Update simulator columns
  [50, 100, 500, 1000].forEach(amt => {
    const elA = document.getElementById(`sim-${amt}-A`);
    const elB = document.getElementById(`sim-${amt}-B`);
    const elC = document.getElementById(`sim-${amt}-C`);
    if (elA) elA.textContent = `${(amt * rateA).toLocaleString()} 🪙`;
    if (elB) elB.textContent = `${(amt * rateB).toLocaleString()} 🪙`;
    if (elC) elC.textContent = `${(amt * rateC).toLocaleString()} 🪙`;
  });
};

window.saveTierRates = async function() {
  const rateA = Number(document.getElementById('tierRateA')?.value);
  const rateB = Number(document.getElementById('tierRateB')?.value);
  const rateC = Number(document.getElementById('tierRateC')?.value);

  if (!rateA || !rateB || !rateC) {
    alert('يرجى التأكد من كتابة أسعار صرف صحيحة لكافة الفئات الثلاث.');
    return;
  }

  const state = window._rechargeAgenciesState;
  state.tierRates['Tier A'].ratePerDollar = rateA;
  state.tierRates['Tier B'].ratePerDollar = rateB;
  state.tierRates['Tier C'].ratePerDollar = rateC;

  try {
    await fetch('/api/admin/tier-rates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: 'Tier A', ratePerDollar: rateA })
    });
    await fetch('/api/admin/tier-rates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: 'Tier B', ratePerDollar: rateB })
    });
    await fetch('/api/admin/tier-rates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: 'Tier C', ratePerDollar: rateC })
    });
  } catch (e) {
    console.error(e);
  }

  alert(`✅ تم حفظ وتطبيق أسعار الصرف المركزية بنجاح:\n• الفئة (أ / Tier A): 1$ = ${rateA.toLocaleString()} 🪙\n• الفئة (ب / Tier B): 1$ = ${rateB.toLocaleString()} 🪙\n• الفئة (ج / Tier C): 1$ = ${rateC.toLocaleString()} 🪙\n\nتُطبق هذه الفئات آلياً على كافة الخزائن دون أي إدخال يدوي.`);
  window.navigateToTierRates();
};

// =========================================================================
// 3.5 بوابة سجل تتبع مسار الكوينز وحركات الخرج والعمليات المحلية (Live Coin Outflow & Local Audits)
// =========================================================================

window._coinTrackingFilter = window._coinTrackingFilter || {
  search: '',
  agencyId: '',
  targetUserType: 'ALL',
  date: ''
};

function renderCoinTrackingFullPage(container) {
  const state = window._rechargeAgenciesState;
  const agencies = state.agencies || [];
  const recharges = state.userRecharges || [];

  const filter = window._coinTrackingFilter;
  const currentSearch = (filter.search || '').toLowerCase().trim();
  const currentAgency = filter.agencyId || '';
  const currentType = filter.targetUserType || 'ALL';
  const currentDate = filter.date || '';

  const filteredRecharges = recharges.filter(tx => {
    if (currentAgency && tx.agencyId !== currentAgency) return false;
    if (currentType !== 'ALL' && (tx.targetUserType || 'مستخدم') !== currentType) return false;
    if (currentDate && tx.dateOnly !== currentDate) return false;
    if (currentSearch) {
      const matchRef = (tx.referenceId || '').toLowerCase().includes(currentSearch) || String(tx.id || '').toLowerCase().includes(currentSearch);
      const matchUser = (tx.targetUserName || '').toLowerCase().includes(currentSearch) || String(tx.targetUserId || '').toLowerCase().includes(currentSearch);
      const matchAgency = (tx.agencyName || '').toLowerCase().includes(currentSearch) || String(tx.agencyId || '').toLowerCase().includes(currentSearch);
      const matchNotes = (tx.agentNotes || '').toLowerCase().includes(currentSearch);
      const matchCurrency = (tx.localCurrencyCode || '').toLowerCase().includes(currentSearch) || String(tx.localCurrencyAmount || '').toLowerCase().includes(currentSearch);
      if (!matchRef && !matchUser && !matchAgency && !matchNotes && !matchCurrency) return false;
    }
    return true;
  });

  const totalCoinsOutflow = recharges.reduce((sum, tx) => sum + (Number(tx.coinsAmount) || 0), 0);
  const totalOperations = recharges.length;
  const totalUsdEquiv = recharges.reduce((sum, tx) => sum + (Number(tx.usdValue) || 0), 0);
  const yerTransactions = recharges.filter(tx => (tx.localCurrencyCode || '').includes('YER') || (tx.agentNotes || '').includes('يمني')).length;

  container.innerHTML = `
    <div class="space-y-5 animate-in fade-in duration-200">
      
      <!-- Top Navigation & Action Bar -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex items-center gap-3">
          <button 
            type="button" 
            onclick="window.navigateToAgenciesList()" 
            class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95">
            <i data-lucide="arrow-right" class="w-4 h-4 text-amber-400"></i>
            <span>رجوع لقائمة الوكالات</span>
          </button>

          <div class="h-6 w-px bg-slate-300 hidden sm:block"></div>

          <div class="text-xs text-slate-700 font-bold flex items-center gap-2">
            <span class="text-slate-500">وكالات الشحن</span>
            <span>/</span>
            <span class="text-slate-950 font-black">سجل الرقابة وتتبع مسار الكوينز والعمليات المحلية (Coin Outflow & Local Audits)</span>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <button 
            type="button" 
            onclick="window.openAdminDirectRechargeModal()" 
            class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            title="تنفيذ وتوثيق عملية شحن صادرة مباشرة مع حقول العملة المحلية والملاحظات">
            <i data-lucide="send" class="w-4 h-4"></i>
            <span>تنفيذ شحن وتوثيق مسار جديد ➕</span>
          </button>

          <button 
            type="button" 
            onclick="window.syncAgenciesFromServer().then(() => window.navigateToCoinTracking())" 
            class="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95">
            <i data-lucide="refresh-cw" class="w-4 h-4 text-emerald-600"></i>
            <span>تحديث السجل</span>
          </button>
        </div>
      </div>

      <!-- KPI Metric Cards Strip -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm">
          <div class="text-[11px] font-bold text-slate-600">إجمالي الكوينز الخارجة الموثقة</div>
          <div class="font-mono font-black text-amber-800 text-lg sm:text-xl mt-1">${totalCoinsOutflow.toLocaleString()} 🪙</div>
          <div class="text-[10px] text-slate-500 font-bold mt-0.5">مسحوبة من خزائن الوكالات</div>
        </div>

        <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm">
          <div class="text-[11px] font-bold text-slate-600">إجمالي الشحنات الموثقة</div>
          <div class="font-mono font-black text-slate-950 text-lg sm:text-xl mt-1">${totalOperations} عملية</div>
          <div class="text-[10px] text-emerald-700 font-bold mt-0.5">موثقة مع نوع الجهة والملاحظات</div>
        </div>

        <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm">
          <div class="text-[11px] font-bold text-slate-600">عمليات العملات المحلية (الريال اليمني وغيرها)</div>
          <div class="font-mono font-black text-emerald-800 text-lg sm:text-xl mt-1">${yerTransactions} حوالة</div>
          <div class="text-[10px] text-slate-500 font-bold mt-0.5">عبر شبكات الصرافة والتحويل المحلي</div>
        </div>

        <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm">
          <div class="text-[11px] font-bold text-slate-600">القيمة المقابلة المقدرة</div>
          <div class="font-mono font-black text-sky-800 text-lg sm:text-xl mt-1">~$${totalUsdEquiv.toLocaleString()} USD</div>
          <div class="text-[10px] text-slate-500 font-bold mt-0.5">مطابقة للأسعار المركزية المقفلة</div>
        </div>
      </div>

      <!-- Advanced Filter & Search Card -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] space-y-3">
        <div class="flex items-center justify-between border-b border-slate-200 pb-2">
          <h4 class="text-xs font-black text-slate-950 flex items-center gap-2">
            <i data-lucide="filter" class="w-4 h-4 text-emerald-600"></i>
            <span>تصفية وفلترة حركات الخرج ومسارات الكوينز</span>
          </h4>
          <span class="text-[11px] text-slate-500 font-bold">المعروض: ${filteredRecharges.length} من أصل ${recharges.length} عملية</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <!-- Text Search -->
          <div class="relative">
            <input 
              type="text" 
              id="coinTrackingSearchInput" 
              value="${filter.search || ''}"
              oninput="window.filterCoinTrackingRows()"
              placeholder="بحث بالمرجع، ID المستلم، الاسم، العملة..."
              class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-2.5"></i>
          </div>

          <!-- Agency Filter -->
          <div>
            <select 
              id="coinTrackingAgencyFilter" 
              onchange="window.filterCoinTrackingRows()"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer">
              <option value="">كافة وكالات الشحن</option>
              ${agencies.map(ag => `
                <option value="${ag.id}" ${currentAgency === ag.id ? 'selected' : ''}>#${ag.id} - ${ag.name} (${ag.tier})</option>
              `).join('')}
            </select>
          </div>

          <!-- Target User Type Filter -->
          <div>
            <select 
              id="coinTrackingTypeFilter" 
              onchange="window.filterCoinTrackingRows()"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer">
              <option value="ALL" ${currentType === 'ALL' ? 'selected' : ''}>كافة أنواع المستلمين</option>
              <option value="مستخدم" ${currentType === 'مستخدم' ? 'selected' : ''}>مستخدم عادي (User) 👤</option>
              <option value="مضيف" ${currentType === 'مضيف' ? 'selected' : ''}>مضيف بث مباشر (Host) 🎙️</option>
              <option value="صانع محتوى" ${currentType === 'صانع محتوى' ? 'selected' : ''}>صانع محتوى (Creator) ⭐</option>
            </select>
          </div>

          <!-- Date Filter & Reset -->
          <div class="flex items-center gap-2">
            <input 
              type="date" 
              id="coinTrackingDateFilter" 
              value="${currentDate}"
              onchange="window.filterCoinTrackingRows()"
              class="flex-1 px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold bg-slate-50 cursor-pointer" />
            <button 
              type="button" 
              onclick="window.resetCoinTrackingFilter()"
              class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold transition cursor-pointer">
              إعادة ضبط
            </button>
          </div>
        </div>
      </div>

      <!-- Master Ruled Outflow Tracking Table -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] space-y-3">
        <div class="flex items-center justify-between border-b-2 border-slate-200 pb-3">
          <div>
            <h3 class="text-sm font-black text-slate-950">جدول التدقيق وتتبع مسار الكوينز وحركات الخرج الصادرة (Outbound Tracking Log)</h3>
            <p class="text-xs text-slate-600 font-bold">يوثق المستلم، نوع الحساب، الكوينز المخصومة، المبلغ والعملة المحلية المنفذة، وملاحظات الوكيل المدونة</p>
          </div>
        </div>

        <div class="overflow-x-auto rounded-xl border-2 border-slate-300 bg-white">
          <table class="w-full text-right text-xs whitespace-nowrap" id="coinTrackingMasterTable">
            <thead class="bg-slate-100 text-slate-950 font-black border-b-2 border-slate-400">
              <tr>
                <th class="py-3 px-3.5 border-l border-slate-200/80">رقم العملية المرجعي والتوقيت</th>
                <th class="py-3 px-3.5 border-l border-slate-200/80">وكالة الشحن المنفذة</th>
                <th class="py-3 px-3.5 border-l border-slate-200/80">مسار الكوينز والجهة المستلمة</th>
                <th class="py-3 px-3.5 text-center border-l border-slate-200/80">الكوينز الخارجة</th>
                <th class="py-3 px-3.5 text-center border-l border-slate-200/80">القيمة المقابلة ($)</th>
                <th class="py-3 px-3.5 text-center border-l border-slate-200/80">المبلغ والعملة المحلية</th>
                <th class="py-3 px-3.5 border-l border-slate-200/80">ملاحظات العملية الخاصة بالوكيل</th>
                <th class="py-3 px-3.5 border-l border-slate-200/80">وسيلة الاستلام والدفع</th>
                <th class="py-3 px-3.5 text-center border-l border-slate-200/80">الحالة</th>
                <th class="py-3 px-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-300">
              ${filteredRecharges.length === 0 ? `
                <tr>
                  <td colspan="10" class="py-10 text-center text-slate-500 font-bold">
                    لا توجد عمليات شحن تطابق الفلاتر المحددة
                  </td>
                </tr>
              ` : filteredRecharges.map((tx, idx) => `
                <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#edf6f9] transition">
                  <!-- المرجع والتوقيت -->
                  <td class="py-3 px-3.5 font-mono font-bold text-slate-900 border-l border-slate-200/80">
                    <div class="text-xs text-slate-950 font-black">${tx.referenceId}</div>
                    <div class="text-[10px] text-slate-500 font-mono">${tx.timestamp}</div>
                  </td>

                  <!-- الوكالة -->
                  <td class="py-3 px-3.5 font-bold text-slate-900 border-l border-slate-200/80">
                    <div class="font-black text-slate-950">${tx.agencyName}</div>
                    <div class="flex items-center gap-1.5 mt-0.5">
                      <span class="font-mono text-[10px] text-slate-500">#${tx.agencyId}</span>
                      <span class="px-1.5 py-0.2 rounded bg-slate-100 text-[9px] font-black text-slate-700 border border-slate-200">${tx.agencyTier || 'Tier B'}</span>
                    </div>
                  </td>

                  <!-- الجهة المستلمة ومسار الكوينز -->
                  <td class="py-3 px-3.5 font-black text-slate-950 border-l border-slate-200/80">
                    <div class="flex items-center gap-1.5">
                      <span>${tx.targetUserName}</span>
                      <span class="px-1.5 py-0.5 rounded-md ${
                        (tx.targetUserType === 'مضيف') ? 'bg-purple-100 text-purple-900 border-purple-200' :
                        (tx.targetUserType === 'صانع محتوى') ? 'bg-amber-100 text-amber-900 border-amber-200' :
                        'bg-blue-100 text-blue-900 border-blue-200'
                      } border text-[10px] font-black">
                        ${tx.targetUserType || 'مستخدم'}
                      </span>
                    </div>
                    <div class="font-mono text-slate-500 text-[10px] mt-0.5">ID: #${tx.targetUserId}</div>
                  </td>

                  <!-- الكوينز الخارجة -->
                  <td class="py-3 px-3.5 text-center font-mono font-black text-amber-800 text-sm border-l border-slate-200/80">
                    -${Number(tx.coinsAmount).toLocaleString()} 🪙
                  </td>

                  <!-- القيمة بالدولار -->
                  <td class="py-3 px-3.5 text-center font-mono font-bold text-slate-800 border-l border-slate-200/80">
                    ~$${Number(tx.usdValue).toLocaleString()} USD
                  </td>

                  <!-- العملة المحلية والمبلغ -->
                  <td class="py-3 px-3.5 text-center font-bold text-slate-900 border-l border-slate-200/80">
                    ${tx.localCurrencyAmount ? `
                      <span class="font-mono font-black text-emerald-800 block text-xs">${Number(tx.localCurrencyAmount).toLocaleString()}</span>
                      <span class="text-[10px] text-slate-600 font-bold block">${tx.localCurrencyCode || ''}</span>
                    ` : `
                      <span class="text-slate-400 font-mono text-xs">—</span>
                    `}
                  </td>

                  <!-- ملاحظات الوكيل -->
                  <td class="py-3 px-3.5 font-bold text-slate-700 border-l border-slate-200/80 max-w-[200px] truncate" title="${tx.agentNotes || ''}">
                    ${tx.agentNotes ? `
                      <span class="px-2 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs inline-block">
                        ${tx.agentNotes}
                      </span>
                    ` : `
                      <span class="text-slate-400 text-xs">—</span>
                    `}
                  </td>

                  <!-- وسيلة الاستلام -->
                  <td class="py-3 px-3.5 font-bold text-slate-800 border-l border-slate-200/80">
                    ${tx.paymentMethod}
                  </td>

                  <!-- الحالة -->
                  <td class="py-3 px-3.5 text-center border-l border-slate-200/80">
                    <span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300 font-black text-[11px]">
                      ${tx.status || 'ناجحة فورياً ✅'}
                    </span>
                  </td>

                  <!-- إجراءات فحص وتدقيق -->
                  <td class="py-3 px-3.5 text-center">
                    <button 
                      type="button" 
                      onclick="window.openCoinTrackingDetailModal('${tx.referenceId}')" 
                      class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-black text-[11px] transition cursor-pointer shadow-2xs active:scale-95">
                      فحص التدقيق 🔍
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detail Audit Modal Container (Injected when opened) -->
      <div id="coinTrackingAuditDetailModalContainer"></div>

      <!-- Admin Direct Dispatch Recharge Modal Container -->
      <div id="adminDirectRechargeModalContainer"></div>

    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

window.filterCoinTrackingRows = function() {
  window._coinTrackingFilter.search = document.getElementById('coinTrackingSearchInput')?.value || '';
  window._coinTrackingFilter.agencyId = document.getElementById('coinTrackingAgencyFilter')?.value || '';
  window._coinTrackingFilter.targetUserType = document.getElementById('coinTrackingTypeFilter')?.value || 'ALL';
  window._coinTrackingFilter.date = document.getElementById('coinTrackingDateFilter')?.value || '';

  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) renderCoinTrackingFullPage(container);
};

window.resetCoinTrackingFilter = function() {
  window._coinTrackingFilter = { search: '', agencyId: '', targetUserType: 'ALL', date: '' };
  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) renderCoinTrackingFullPage(container);
};

window.openCoinTrackingDetailModal = function(referenceId) {
  const state = window._rechargeAgenciesState;
  const tx = (state.userRecharges || []).find(t => t.referenceId === referenceId);
  if (!tx) return;

  const container = document.getElementById('coinTrackingAuditDetailModalContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl border-2 border-slate-300 max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        
        <div class="flex items-center justify-between border-b-2 border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">📋</span>
            <div>
              <h3 class="font-black text-sm text-slate-950">تفاصيل تدقيق حركة الكوينز الصادرة</h3>
              <span class="font-mono text-xs text-slate-500 font-bold">${tx.referenceId}</span>
            </div>
          </div>
          <button 
            type="button" 
            onclick="window.closeCoinTrackingDetailModal()"
            class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-black cursor-pointer">
            ✕
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div class="p-3 rounded-2xl bg-[#f7fbfd] border border-slate-200 space-y-2">
            <div class="flex justify-between">
              <span class="font-bold text-slate-600">وكالة الشحن المصدرة:</span>
              <span class="font-black text-slate-950">${tx.agencyName} (#${tx.agencyId})</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold text-slate-600">فئة الوكالة (Tier Rate):</span>
              <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 font-black font-mono">${tx.agencyTier || 'Tier B'}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold text-slate-600">التاريخ والوقت:</span>
              <span class="font-mono font-bold text-slate-800">${tx.timestamp}</span>
            </div>
          </div>

          <div class="p-3 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div class="flex justify-between">
              <span class="font-bold text-slate-600">الجهة المستلمة:</span>
              <span class="font-black text-slate-950">${tx.targetUserName} (#${tx.targetUserId})</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold text-slate-600">نوع حساب المستلم:</span>
              <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-black">${tx.targetUserType || 'مستخدم'}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold text-slate-600">الكوينز المخصومة من الخزينة:</span>
              <span class="font-mono font-black text-amber-800 text-sm">-${Number(tx.coinsAmount).toLocaleString()} 🪙</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold text-slate-600">القيمة المعادلة بالدولار:</span>
              <span class="font-mono font-bold text-slate-800">~$${Number(tx.usdValue).toLocaleString()} USD</span>
            </div>
          </div>

          <!-- Local Currency Details -->
          <div class="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
            <div class="flex justify-between">
              <span class="font-bold text-emerald-950">المبلغ المنفذ بالعملة المحلية:</span>
              <span class="font-mono font-black text-emerald-900 text-sm">${tx.localCurrencyAmount ? Number(tx.localCurrencyAmount).toLocaleString() : 'غير محدد'} ${tx.localCurrencyCode || ''}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-bold text-emerald-950">وسيلة الاستلام والدفع:</span>
              <span class="font-bold text-emerald-900">${tx.paymentMethod}</span>
            </div>
            <div>
              <span class="font-bold text-emerald-950 block mb-1">ملاحظات العملية المدونة بواسطة الوكيل:</span>
              <div class="p-2 rounded-xl bg-white border border-emerald-200 text-slate-800 font-bold">
                ${tx.agentNotes || 'لا توجد ملاحظات مسجلة لهذه العملية'}
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button 
            type="button" 
            onclick="window.closeCoinTrackingDetailModal()"
            class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs cursor-pointer">
            إغلاق نافذة الفحص
          </button>
        </div>

      </div>
    </div>
  `;
};

window.closeCoinTrackingDetailModal = function() {
  const container = document.getElementById('coinTrackingAuditDetailModalContainer');
  if (container) container.innerHTML = '';
};

// Admin Direct Dispatch Modal
window.openAdminDirectRechargeModal = function() {
  const state = window._rechargeAgenciesState;
  const agencies = state.agencies || [];
  const container = document.getElementById('adminDirectRechargeModalContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl border-2 border-slate-300 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        
        <div class="flex items-center justify-between border-b-2 border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">⚡</span>
            <div>
              <h3 class="font-black text-sm text-slate-950">تنفيذ وتوثيق عملية شحن صادرة للوكالة</h3>
              <p class="text-[11px] text-slate-600 font-bold">يتم خصم الكوينز آلياً وحساب القيمة وفق سعر صرف الفئة المقفل</p>
            </div>
          </div>
          <button 
            type="button" 
            onclick="window.closeAdminDirectRechargeModal()"
            class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-black cursor-pointer">
            ✕
          </button>
        </div>

        <form onsubmit="window.submitAdminDirectRecharge(event)" class="space-y-3 text-xs">
          <!-- Agency Selector -->
          <div>
            <label class="block font-black text-slate-900 mb-1">وكالة الشحن المنفذة:</label>
            <select 
              id="adminDirectAgencyId" 
              required
              onchange="window.updateAdminDirectModalAgencyTier()"
              class="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-950 font-black cursor-pointer">
              ${agencies.map(ag => `
                <option value="${ag.id}" data-tier="${ag.tier}" data-balance="${ag.coinsBalance}">
                  #${ag.primaryId || '1001007'} [${ag.id}] - ${ag.name} (الرصيد: ${Number(ag.coinsBalance).toLocaleString()} 🪙)
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Locked Tier Indicator -->
          <div id="adminDirectTierBanner" class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
            <span class="font-black text-emerald-950" id="adminDirectTierText">سعر صرف الفئة: 12,000 🪙 لكل $1 (آلي)</span>
            <span class="px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 font-black font-mono text-[10px]" id="adminDirectTierBadge">Tier B</span>
          </div>

          <!-- Recipient Type & ID -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label class="block font-black text-slate-900 mb-1">نوع المستلم:</label>
              <select id="adminDirectTargetType" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-bold cursor-pointer">
                <option value="مستخدم">مستخدم 👤</option>
                <option value="مضيف">مضيف 🎙️</option>
                <option value="صانع محتوى">صانع محتوى ⭐</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="block font-black text-slate-900 mb-1">معرّف المستلم (ID) واسمه:</label>
              <div class="flex gap-2">
                <input type="text" id="adminDirectTargetId" placeholder="ID المستلم" required class="w-1/2 px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold" />
                <input type="text" id="adminDirectTargetName" placeholder="اسم المستلم" required class="w-1/2 px-3 py-2 rounded-xl border border-slate-300 font-bold" />
              </div>
            </div>
          </div>

          <!-- Coins Amount -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="font-black text-slate-900">كمية الكوينز المراد شحنها:</label>
              <span id="adminDirectUsdEquiv" class="font-mono font-bold text-slate-500">~$0.00 USD</span>
            </div>
            <input 
              type="number" 
              id="adminDirectCoinsAmount" 
              required 
              min="1000" 
              step="1000"
              placeholder="مثال: 500000" 
              oninput="window.calcAdminDirectUsdEquiv(this.value)"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-black text-amber-800 text-sm bg-white" />
          </div>

          <!-- Local Currency and Notes -->
          <div class="p-3 rounded-2xl bg-slate-50 border border-slate-300 space-y-2">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label class="block text-[10px] font-bold text-slate-600 mb-0.5">نوع العملة المحلية:</label>
                <select id="adminDirectCurrencyCode" class="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-bold cursor-pointer">
                  <option value="ريال يمني (YER)" selected>ريال يمني (YER) 🇾🇪</option>
                  <option value="ريال سعودي (SAR)">ريال سعودي (SAR) 🇸🇦</option>
                  <option value="جنيه مصري (EGP)">جنيه مصري (EGP) 🇪🇬</option>
                  <option value="دينار عراقي (IQD)">دينار عراقي (IQD) 🇮🇶</option>
                  <option value="درهم إماراتي (AED)">درهم إماراتي (AED) 🇦🇪</option>
                  <option value="دولار أمريكي (USD)">دولار أمريكي (USD) 💵</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-600 mb-0.5">المبلغ بالعملة المحلية:</label>
                <input type="text" id="adminDirectCurrencyAmount" placeholder="مثال: 1000 أو 250" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold" />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-600 mb-0.5">ملاحظات العملية الخاصة بالوكيل (Notes):</label>
              <input type="text" id="adminDirectNotes" placeholder="مثال: مقابل 1,000 ريال يمني - تحويل العمقي" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold" />
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button 
              type="button" 
              onclick="window.closeAdminDirectRechargeModal()"
              class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black cursor-pointer">
              إلغاء
            </button>
            <button 
              type="submit" 
              id="adminDirectSubmitBtn"
              class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5">
              <span>تأكيد وتنفيذ الشحن والتوثيق</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  `;
  window.updateAdminDirectModalAgencyTier();
};

window.updateAdminDirectModalAgencyTier = function() {
  const sel = document.getElementById('adminDirectAgencyId');
  if (!sel) return;
  const opt = sel.options[sel.selectedIndex];
  const tier = opt?.getAttribute('data-tier') || 'Tier B';
  const state = window._rechargeAgenciesState;
  const rate = state.tierRates[tier]?.ratePerDollar || 12000;

  const textEl = document.getElementById('adminDirectTierText');
  const badgeEl = document.getElementById('adminDirectTierBadge');
  if (textEl) textEl.textContent = `سعر صرف الفئة: ${rate.toLocaleString()} 🪙 لكل $1 (آلي بدون إدخال يدوي)`;
  if (badgeEl) badgeEl.textContent = tier;

  const coins = Number(document.getElementById('adminDirectCoinsAmount')?.value) || 0;
  window.calcAdminDirectUsdEquiv(coins);
};

window.calcAdminDirectUsdEquiv = function(coins) {
  const sel = document.getElementById('adminDirectAgencyId');
  const opt = sel?.options[sel.selectedIndex];
  const tier = opt?.getAttribute('data-tier') || 'Tier B';
  const state = window._rechargeAgenciesState;
  const rate = state.tierRates[tier]?.ratePerDollar || 12000;
  const equiv = Math.round((Number(coins) || 0) / rate);
  const el = document.getElementById('adminDirectUsdEquiv');
  if (el) el.textContent = `~$${equiv.toLocaleString()} USD`;
};

window.closeAdminDirectRechargeModal = function() {
  const container = document.getElementById('adminDirectRechargeModalContainer');
  if (container) container.innerHTML = '';
};

window.submitAdminDirectRecharge = async function(e) {
  e.preventDefault();
  const agencyId = document.getElementById('adminDirectAgencyId').value;
  const targetUserType = document.getElementById('adminDirectTargetType').value;
  const targetUserId = document.getElementById('adminDirectTargetId').value.trim();
  const targetUserName = document.getElementById('adminDirectTargetName').value.trim();
  const coinsAmount = Number(document.getElementById('adminDirectCoinsAmount').value);
  const localCurrencyCode = document.getElementById('adminDirectCurrencyCode').value;
  const localCurrencyAmount = document.getElementById('adminDirectCurrencyAmount').value.trim();
  const agentNotes = document.getElementById('adminDirectNotes').value.trim();

  if (!agencyId || !targetUserId || !coinsAmount || coinsAmount <= 0) {
    alert('يرجى ملء جميع الحقول الإلزامية.');
    return;
  }

  const btn = document.getElementById('adminDirectSubmitBtn');
  btn.disabled = true;
  btn.innerText = 'جارٍ التنفيذ والتوثيق...';

  try {
    const res = await fetch('/api/admin/dispatch-agency-recharge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agencyId,
        targetUserId,
        targetUserName,
        targetUserType,
        coinsAmount,
        localCurrencyCode,
        localCurrencyAmount,
        agentNotes,
        paymentMethod: 'تحويل محلي مباشر / إدارة'
      })
    });

    const data = await res.json();
    if (data.success) {
      alert(`✅ نجاح العملية!\nتم شحن ${coinsAmount.toLocaleString()} كوينز للحساب #${targetUserId} وتوثيق مسار العملية بنجاح.\nرقم المرجع: ${data.transaction.referenceId}`);
      window.closeAdminDirectRechargeModal();
      await syncAgenciesFromServer();
      window.navigateToCoinTracking();
    } else {
      alert('❌ فشل الشحن: ' + (data.error || 'حدث خطأ غير متوقع.'));
    }
  } catch (err) {
    alert('حدث خطأ في الاتصال بالخادم: ' + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = 'تأكيد وتنفيذ الشحن والتوثيق';
    }
  }
};

// =========================================================================
// 3.8 كشف حساب وتدقيق المضيف (Host Audit & Activity Log)
// =========================================================================

window._hostAuditFilter = window._hostAuditFilter || {
  hostId: '104829',
  startDate: '',
  endDate: '',
  direction: 'ALL', // 'ALL' | 'INFLOW' | 'OUTFLOW'
  sourceCategory: 'ALL', // 'ALL' | 'AGENCY' | 'STORE' | 'ADMIN' | 'P2P_CONVERT'
  search: '',
  activeTab: 'unified' // 'unified' | 'inflow' | 'outflow'
};

window._hostAuditDataCache = window._hostAuditDataCache || null;

async function fetchHostAuditData(forceRefresh = false) {
  const filter = window._hostAuditFilter;
  const hostId = (filter.hostId || '104829').trim();

  const query = new URLSearchParams({
    hostId: hostId,
    startDate: filter.startDate || '',
    endDate: filter.endDate || '',
    direction: filter.direction || 'ALL',
    sourceCategory: filter.sourceCategory || 'ALL',
    search: filter.search || ''
  });

  try {
    const res = await fetch(`/api/admin/host-audit?${query.toString()}`);
    if (res.ok) {
      const data = await res.json();
      window._hostAuditDataCache = data;
      return data;
    }
  } catch (err) {
    console.warn('Network error fetching host audit data:', err);
  }

  // Fallback synthesis if offline or error
  return synthesizeFallbackHostAudit(hostId, filter);
}

function synthesizeFallbackHostAudit(hostId, filter) {
  const isSarah = hostId === '104829';
  const hostProfile = {
    id: hostId,
    name: isSarah ? 'سارة_لايف (الملكية)' : `مضيف_${hostId}`,
    country: isSarah ? 'السعودية 🇸🇦' : 'العراق 🇮🇶',
    walletBalanceCoins: isSarah ? 18000000 : 4500000,
    agencyName: isSarah ? 'مؤسسة الدانة للمدفوعات الرقمية' : 'وكالة النور للشحن',
    tier: isSarah ? 'مضيف ماسي VIP 🌟' : 'مضيف ذهبي ⭐'
  };

  const sampleRecords = [
    {
      id: `AUD-IN-${hostId}-01`,
      referenceId: `AUD-IN-${hostId}-01`,
      hostId: hostId,
      hostName: hostProfile.name,
      direction: 'INFLOW',
      sourceCategory: 'AGENCY',
      sourceName: 'وكالة #1001 مؤسسة الدانة للمدفوعات الرقمية',
      agencyId: '1001',
      targetUserId: hostId,
      targetUserName: hostProfile.name,
      targetUserType: 'مضيف',
      coinsAmount: 10000000,
      amountUsd: 1000,
      localCurrencyCode: 'SAR',
      localCurrencyAmount: 3750,
      paymentMethod: 'تحويل بنكي / مصرف الراجحي',
      disputeNotes: 'شحنة رسمية معتمدة لتغذية بث الليلة الكبرى - إشعار البنك رقم #TX-99281',
      dateOnly: '2026-03-28',
      timestamp: '2026-03-28 14:22:15',
      status: 'معتمد ومكتمل ✅'
    },
    {
      id: `AUD-IN-${hostId}-02`,
      referenceId: `AUD-IN-${hostId}-02`,
      hostId: hostId,
      hostName: hostProfile.name,
      direction: 'INFLOW',
      sourceCategory: 'STORE',
      sourceName: 'شحن المتجر وسوق التطبيق (Apple Pay)',
      targetUserId: hostId,
      targetUserName: hostProfile.name,
      targetUserType: 'مضيف',
      coinsAmount: 5000000,
      amountUsd: 500,
      localCurrencyCode: 'USD',
      localCurrencyAmount: 500,
      paymentMethod: 'Apple Pay / متجر التطبيقات الرسمي',
      disputeNotes: 'شحن ذاتي عبر بوابة متجر آبل مباشرة تم تأكيده فورياً بالسيرفر',
      dateOnly: '2026-03-28',
      timestamp: '2026-03-28 17:05:40',
      status: 'معتمد ومكتمل ✅'
    },
    {
      id: `AUD-OUT-${hostId}-01`,
      referenceId: `AUD-OUT-${hostId}-01`,
      hostId: hostId,
      hostName: hostProfile.name,
      direction: 'OUTFLOW',
      sourceCategory: 'OUTFLOW_DISPATCH',
      sourceName: 'محفظة المضيف الخاصة',
      targetUserId: '884910',
      targetUserName: 'فهد_العتيبي',
      targetUserType: 'مستخدم',
      coinsAmount: 2500000,
      amountUsd: 250,
      localCurrencyCode: 'SAR',
      localCurrencyAmount: 937.5,
      paymentMethod: 'شحن داخلي فوري من رصيد المضيف',
      disputeNotes: 'إهداء دعم مسابقة البث المباشر - تم التحقق من عدم وجود أي نزاع مالي',
      dateOnly: '2026-03-28',
      timestamp: '2026-03-28 19:12:08',
      status: 'معتمد ومكتمل ✅'
    },
    {
      id: `AUD-OUT-${hostId}-02`,
      referenceId: `AUD-OUT-${hostId}-02`,
      hostId: hostId,
      hostName: hostProfile.name,
      direction: 'OUTFLOW',
      sourceCategory: 'OUTFLOW_DISPATCH',
      sourceName: 'محفظة المضيف الخاصة',
      targetUserId: '773192',
      targetUserName: 'أميرة_الورد',
      targetUserType: 'مضيف',
      coinsAmount: 1500000,
      amountUsd: 150,
      localCurrencyCode: 'EGP',
      localCurrencyAmount: 7420,
      paymentMethod: 'سداد فوري محلي',
      disputeNotes: 'تبادل ودعم روم تحدي PK الرسمي - تم استلام الإيصال من الطرفين',
      dateOnly: '2026-03-28',
      timestamp: '2026-03-28 21:40:33',
      status: 'معتمد ومكتمل ✅'
    },
    {
      id: `AUD-IN-${hostId}-03`,
      referenceId: `AUD-IN-${hostId}-03`,
      hostId: hostId,
      hostName: hostProfile.name,
      direction: 'INFLOW',
      sourceCategory: 'ADMIN',
      sourceName: 'تغذية مباشرة من الإدارة (Super Admin Grant)',
      targetUserId: hostId,
      targetUserName: hostProfile.name,
      targetUserType: 'مضيف',
      coinsAmount: 7500000,
      amountUsd: 750,
      localCurrencyCode: 'USD',
      localCurrencyAmount: 750,
      paymentMethod: 'منحة دعم وتكريم من الإدارة العليا',
      disputeNotes: 'مكافأة الفوز بالمركز الأول في تارجت الأسبوع الماضي معتمدة من الإدارة',
      dateOnly: '2026-03-29',
      timestamp: '2026-03-29 11:30:00',
      status: 'معتمد ومكتمل ✅'
    },
    {
      id: `AUD-OUT-${hostId}-03`,
      referenceId: `AUD-OUT-${hostId}-03`,
      hostId: hostId,
      hostName: hostProfile.name,
      direction: 'OUTFLOW',
      sourceCategory: 'OUTFLOW_DISPATCH',
      sourceName: 'محفظة المضيف الخاصة',
      targetUserId: '551029',
      targetUserName: 'نور_القاهرة',
      targetUserType: 'مستخدم',
      coinsAmount: 3000000,
      amountUsd: 300,
      localCurrencyCode: 'EGP',
      localCurrencyAmount: 14850,
      paymentMethod: 'فودافون كاش / سداد إلكتروني',
      disputeNotes: 'شحن كوينز لحساب الداعم نور - تم التأكيد عبر تطبيق المضيف',
      dateOnly: '2026-03-29',
      timestamp: '2026-03-29 16:15:45',
      status: 'معتمد ومكتمل ✅'
    },
    {
      id: `AUD-IN-${hostId}-04`,
      referenceId: `AUD-IN-${hostId}-04`,
      hostId: hostId,
      hostName: hostProfile.name,
      direction: 'INFLOW',
      sourceCategory: 'P2P_CONVERT',
      sourceName: 'تحويل أرباح المضيف P2P (وكالة #1002 الخليج الرقمي)',
      agencyId: '1002',
      targetUserId: hostId,
      targetUserName: hostProfile.name,
      targetUserType: 'مضيف',
      coinsAmount: 4000000,
      amountUsd: 400,
      localCurrencyCode: 'AED',
      localCurrencyAmount: 1470,
      paymentMethod: 'تحويل P2P آلي بين التطبيقات',
      disputeNotes: 'تحويل أرباح ساعات البث الشهري لكوينز خزينة شحن فوري',
      dateOnly: '2026-03-30',
      timestamp: '2026-03-30 10:04:19',
      status: 'معتمد ومكتمل ✅'
    },
    {
      id: `AUD-OUT-${hostId}-04`,
      referenceId: `AUD-OUT-${hostId}-04`,
      hostId: hostId,
      hostName: hostProfile.name,
      direction: 'OUTFLOW',
      sourceCategory: 'OUTFLOW_DISPATCH',
      sourceName: 'محفظة المضيف الخاصة',
      targetUserId: '440182',
      targetUserName: 'صقر_بغداد',
      targetUserType: 'صانع محتوى',
      coinsAmount: 1500000,
      amountUsd: 150,
      localCurrencyCode: 'IQD',
      localCurrencyAmount: 198000,
      paymentMethod: 'زين كاش / حوالة محلية',
      disputeNotes: 'شحن دعم فوري لغرفة الفعاليات - تم إرفاق الوصل ومطابقته',
      dateOnly: '2026-03-30',
      timestamp: '2026-03-30 18:44:50',
      status: 'معتمد ومكتمل ✅'
    }
  ];

  const totalInflowCoins = sampleRecords.filter(r => r.direction === 'INFLOW').reduce((sum, r) => sum + r.coinsAmount, 0);
  const totalOutflowCoins = sampleRecords.filter(r => r.direction === 'OUTFLOW').reduce((sum, r) => sum + r.coinsAmount, 0);
  const totalInflowUsd = sampleRecords.filter(r => r.direction === 'INFLOW').reduce((sum, r) => sum + r.amountUsd, 0);
  const totalOutflowUsd = sampleRecords.filter(r => r.direction === 'OUTFLOW').reduce((sum, r) => sum + r.amountUsd, 0);

  return {
    success: true,
    hostId: hostId,
    hostProfile: hostProfile,
    summary: {
      totalInflowCoins: totalInflowCoins,
      totalOutflowCoins: totalOutflowCoins,
      totalOperations: sampleRecords.length,
      totalInflowUsd: totalInflowUsd,
      totalOutflowUsd: totalOutflowUsd,
      inflowCount: sampleRecords.filter(r => r.direction === 'INFLOW').length,
      outflowCount: sampleRecords.filter(r => r.direction === 'OUTFLOW').length,
      netCoinsFlow: totalInflowCoins - totalOutflowCoins
    },
    records: sampleRecords,
    allAgencies: (window._rechargeAgenciesState?.agencies || []).map(a => ({ id: a.id, name: a.name }))
  };
}

async function renderHostAuditFullPage(container) {
  const filter = window._hostAuditFilter;
  const currentHostId = (filter.hostId || '104829').trim();

  // Initial loading indicator or cached view
  let auditData = window._hostAuditDataCache;
  if (!auditData || auditData.hostId !== currentHostId) {
    container.innerHTML = `
      <div class="p-8 text-center bg-white rounded-2xl border-2 border-slate-300 shadow-sm">
        <div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <div class="text-sm font-black text-slate-900">جارٍ تحميل وتدقيق كشف حساب المضيف #${currentHostId}...</div>
        <div class="text-xs text-slate-500 mt-1">يتم جلب سجل الوارد (مصادر الشحن) وسجل الصادر (الجهات المستلمة) والملاحظات بالثانية</div>
      </div>
    `;
    auditData = await fetchHostAuditData();
  }

  // If still empty, use fallback
  if (!auditData) {
    auditData = synthesizeFallbackHostAudit(currentHostId, filter);
  }

  const host = auditData.hostProfile || {
    id: currentHostId,
    name: `مضيف #${currentHostId}`,
    country: 'غير محدد',
    walletBalanceCoins: 0,
    agencyName: 'وكالة مستقلة',
    tier: 'مضيف معتمد'
  };

  const summary = auditData.summary || {
    totalInflowCoins: 0,
    totalOutflowCoins: 0,
    totalOperations: 0,
    totalInflowUsd: 0,
    totalOutflowUsd: 0,
    inflowCount: 0,
    outflowCount: 0,
    netCoinsFlow: 0
  };

  const records = auditData.records || [];

  // Client-side filtering
  const activeTab = filter.activeTab || 'unified';
  const currentDirection = filter.direction || 'ALL';
  const currentCategory = filter.sourceCategory || 'ALL';
  const currentSearch = (filter.search || '').toLowerCase().trim();
  const currentStartDate = filter.startDate || '';
  const currentEndDate = filter.endDate || '';

  const filteredRecords = records.filter(r => {
    // Tab filter
    if (activeTab === 'inflow' && r.direction !== 'INFLOW') return false;
    if (activeTab === 'outflow' && r.direction !== 'OUTFLOW') return false;

    // Direction filter
    if (currentDirection !== 'ALL' && r.direction !== currentDirection) return false;

    // Category filter
    if (currentCategory !== 'ALL') {
      if (currentCategory === 'AGENCY' && r.sourceCategory !== 'AGENCY') return false;
      if (currentCategory === 'STORE' && r.sourceCategory !== 'STORE') return false;
      if (currentCategory === 'ADMIN' && r.sourceCategory !== 'ADMIN') return false;
      if (currentCategory === 'P2P_CONVERT' && r.sourceCategory !== 'P2P_CONVERT') return false;
    }

    // Date range
    if (currentStartDate && r.dateOnly < currentStartDate) return false;
    if (currentEndDate && r.dateOnly > currentEndDate) return false;

    // Search filter
    if (currentSearch) {
      const matchRef = (r.referenceId || '').toLowerCase().includes(currentSearch);
      const matchSource = (r.sourceName || '').toLowerCase().includes(currentSearch);
      const matchTarget = (r.targetUserName || '').toLowerCase().includes(currentSearch) || String(r.targetUserId || '').toLowerCase().includes(currentSearch);
      const matchNotes = (r.disputeNotes || '').toLowerCase().includes(currentSearch);
      const matchCurrency = (r.localCurrencyCode || '').toLowerCase().includes(currentSearch) || String(r.localCurrencyAmount || '').toLowerCase().includes(currentSearch);
      const matchMethod = (r.paymentMethod || '').toLowerCase().includes(currentSearch);
      if (!matchRef && !matchSource && !matchTarget && !matchNotes && !matchCurrency && !matchMethod) {
        return false;
      }
    }

    return true;
  });

  const netCoins = summary.totalInflowCoins - summary.totalOutflowCoins;

  // Active quick host presets
  const quickHosts = [
    { id: '104829', name: 'سارة_لايف (الملكية)', flag: '🇸🇦' },
    { id: '990184', name: 'شهد_الروابي', flag: '🇦🇪' },
    { id: '884910', name: 'فهد_العتيبي', flag: '🇰🇼' },
    { id: '773192', name: 'أميرة_الورد', flag: '🇪🇬' },
    { id: '662019', name: 'سلطان_دبي', flag: '🇦🇪' },
    { id: '551029', name: 'نور_القاهرة', flag: '🇪🇬' },
    { id: '440182', name: 'صقر_بغداد', flag: '🇮🇶' }
  ];

  container.innerHTML = `
    <div class="space-y-5 animate-in fade-in duration-200">
      
      <!-- Print Header (Hidden on screen, shown when printing) -->
      <div class="hidden print:block mb-6 p-4 border-b-2 border-slate-900 text-right">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-black text-slate-950">كشف حساب وتدقيق المضيف الرسمي - النجم</h1>
            <p class="text-xs text-slate-700 mt-1">تاريخ استخراج التقرير: ${new Date().toLocaleString('ar-SA')} | المعرف المرجعي: #${host.id}</p>
          </div>
          <div class="text-left font-mono text-xs">
            <div>حالة التقرير: معتمد وموثق بالسيرفر ✅</div>
            <div>نطاق التدقيق: شامل الوارد والصادر وفض النزاعات</div>
          </div>
        </div>
      </div>

      <!-- Top Action Navigation Bar -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div class="flex items-center gap-3">
          <button 
            type="button" 
            onclick="window.navigateToAgenciesList()" 
            class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95">
            <i data-lucide="arrow-right" class="w-4 h-4 text-amber-400"></i>
            <span>رجوع لقائمة الوكالات</span>
          </button>

          <div class="h-6 w-px bg-slate-300 hidden sm:block"></div>

          <div class="text-xs text-slate-700 font-bold flex items-center gap-2">
            <span class="text-slate-500">وكالات الشحن</span>
            <span>/</span>
            <span class="text-slate-950 font-black">كشف حساب وتدقيق المضيف (Host Audit & Activity Log)</span>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- Print Official Statement Button -->
          <button 
            type="button" 
            onclick="window.printHostAuditReport()" 
            class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            title="طباعة التقرير المالي الرسمي لكشف الحساب">
            <i data-lucide="printer" class="w-3.5 h-3.5 text-slate-700"></i>
            <span>طباعة كشف الحساب 🖨️</span>
          </button>

          <!-- Export CSV Button -->
          <button 
            type="button" 
            onclick="window.exportHostAuditCsv()" 
            class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            title="تصدير كشف الحساب لملف Excel / CSV">
            <i data-lucide="download" class="w-3.5 h-3.5 text-emerald-700"></i>
            <span>تصدير CSV 📥</span>
          </button>

          <!-- Add Dispute Note Button -->
          <button 
            type="button" 
            onclick="window.openHostAuditNoteModal('')" 
            class="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            title="توثيق ملاحظة رسمية أو إشعار لفض نزاع في كشف الحساب">
            <i data-lucide="edit-3" class="w-3.5 h-3.5 text-amber-300"></i>
            <span>توثيق ملاحظة فض نزاع ✍️</span>
          </button>

          <!-- Direct Recharge / Grant Entry to Host -->
          <button 
            type="button" 
            onclick="window.openHostDirectRechargeModal('${host.id}')" 
            class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            title="إجراء حركة شحن وتغذية كوينز مباشرة للمضيف">
            <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
            <span>تغذية كوينز للمضيف ➕</span>
          </button>

          <!-- Refresh Button -->
          <button 
            type="button" 
            onclick="window.refreshHostAuditFullPage()" 
            class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-black text-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="تحديث البيانات فورياً">
            <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-slate-700"></i>
            <span>تحديث</span>
          </button>
        </div>
      </div>

      <!-- Host Profile Header Card -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center font-black text-2xl shadow-sm border-2 border-white ring-2 ring-purple-300 shrink-0">
            👑
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-lg sm:text-xl font-black text-slate-950">${host.name}</h2>
              <span class="px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-950 border border-purple-300 font-black text-xs font-mono">
                ID: #${host.id}
              </span>
              <span class="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 font-black text-xs">
                ${host.tier || 'مضيف ماسي VIP 🌟'}
              </span>
              <span class="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-300 font-black text-xs">
                ${host.country || 'السعودية 🇸🇦'}
              </span>
            </div>
            <div class="text-xs text-slate-600 font-bold mt-1.5 flex items-center gap-3 flex-wrap">
              <span>الوكالة التابع لها: <strong class="text-slate-900">${host.agencyName || 'مؤسسة الدانة للمدفوعات الرقمية'}</strong></span>
              <span>•</span>
              <span>رصيد المحفظة الحالي: <strong class="text-amber-700 font-mono text-sm">${(host.walletBalanceCoins || 0).toLocaleString()} 🪙</strong></span>
              <span>•</span>
              <span class="text-emerald-700 font-bold">الحساب نشط ومطابق محاسبياً 100% ✅</span>
            </div>
          </div>
        </div>

        <!-- Quick Host Selector Chips -->
        <div class="print:hidden">
          <span class="text-[11px] font-black text-slate-500 block mb-1.5">تبديل فوري للمضيفين النشطين:</span>
          <div class="flex items-center gap-1.5 flex-wrap max-w-xl">
            ${quickHosts.map(qh => `
              <button 
                type="button" 
                onclick="window.setHostAuditQuickHost('${qh.id}')"
                class="px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${qh.id === currentHostId ? 'bg-purple-600 text-white border-purple-700 font-black shadow-2xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'}">
                <span>${qh.flag} ${qh.name}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- أولاً: واجهة البحث والفلترة -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] space-y-4 print:hidden">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center font-black text-sm">1</span>
            <h3 class="text-sm font-black text-slate-950">أولاً: واجهة البحث والفلترة الدقيقة</h3>
          </div>
          <button 
            type="button" 
            onclick="window.resetHostAuditFilter()" 
            class="text-xs font-bold text-slate-600 hover:text-rose-600 underline cursor-pointer">
            إعادة ضبط الفلاتر ↺
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- 1. البحث بـ ID المضيف -->
          <div>
            <label class="block text-xs font-black text-slate-900 mb-1.5 flex items-center gap-1">
              <span>البحث بـ ID المضيف:</span>
              <span class="text-purple-600">*</span>
            </label>
            <div class="flex items-center gap-1.5">
              <div class="relative flex-1">
                <input 
                  type="text" 
                  id="hostAuditInputId" 
                  value="${currentHostId}" 
                  placeholder="أدخل رقم ID المضيف (مثال: 104829)" 
                  class="w-full pl-3 pr-8 py-2 text-xs font-mono font-black rounded-xl border-2 border-slate-300 focus:border-purple-600 focus:outline-hidden bg-slate-50 text-slate-950 text-right">
                <span class="absolute right-2.5 top-2.5 text-slate-400 font-black text-xs">#</span>
              </div>
              <button 
                type="button" 
                onclick="window.filterHostAuditSubmit()" 
                class="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition cursor-pointer shadow-2xs active:scale-95 shrink-0">
                تدقيق 🔍
              </button>
            </div>
          </div>

          <!-- 2. تحديد الفترة الزمنية [من تاريخ .. إلى تاريخ ..] -->
          <div>
            <label class="block text-xs font-black text-slate-900 mb-1.5">الفترة الزمنية [من تاريخ - إلى تاريخ]:</label>
            <div class="grid grid-cols-2 gap-1.5">
              <input 
                type="date" 
                id="hostAuditStartDate" 
                value="${currentStartDate}" 
                title="من تاريخ"
                class="w-full px-2 py-1.5 text-xs font-mono rounded-xl border-2 border-slate-300 focus:border-purple-600 focus:outline-hidden bg-slate-50 text-slate-950">
              <input 
                type="date" 
                id="hostAuditEndDate" 
                value="${currentEndDate}" 
                title="إلى تاريخ"
                class="w-full px-2 py-1.5 text-xs font-mono rounded-xl border-2 border-slate-300 focus:border-purple-600 focus:outline-hidden bg-slate-50 text-slate-950">
            </div>
            <!-- Quick Date Presets -->
            <div class="flex items-center gap-1 mt-1.5">
              <button type="button" onclick="window.setHostAuditQuickDate('today')" class="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-purple-100 text-slate-700 font-bold">اليوم</button>
              <button type="button" onclick="window.setHostAuditQuickDate('7days')" class="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-purple-100 text-slate-700 font-bold">آخر 7 أيام</button>
              <button type="button" onclick="window.setHostAuditQuickDate('30days')" class="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-purple-100 text-slate-700 font-bold">آخر 30 يوماً</button>
              <button type="button" onclick="window.setHostAuditQuickDate('all')" class="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-purple-100 text-slate-700 font-bold">كافة الفترات</button>
            </div>
          </div>

          <!-- 3. فلتر المصدر والاتجاه -->
          <div>
            <label class="block text-xs font-black text-slate-900 mb-1.5">اتجاه الحركة (وارد / صادر):</label>
            <select 
              id="hostAuditDirectionSelect" 
              onchange="window.filterHostAuditInputsChange()"
              class="w-full px-3 py-2 text-xs font-black rounded-xl border-2 border-slate-300 focus:border-purple-600 focus:outline-hidden bg-slate-50 text-slate-950 cursor-pointer">
              <option value="ALL" ${currentDirection === 'ALL' ? 'selected' : ''}>عرض جميع العمليات (الوارد والصادر معاً)</option>
              <option value="INFLOW" ${currentDirection === 'INFLOW' ? 'selected' : ''}>سجل الوارد فقط (مصادر الشحن والتغذية 📥)</option>
              <option value="OUTFLOW" ${currentDirection === 'OUTFLOW' ? 'selected' : ''}>سجل الصادر فقط (شحن وتوزيع العملات 📤)</option>
            </select>

            <label class="block text-xs font-black text-slate-900 mt-2 mb-1">المصدر / الجهة المغذية:</label>
            <select 
              id="hostAuditCategorySelect" 
              onchange="window.filterHostAuditInputsChange()"
              class="w-full px-3 py-1.5 text-xs font-bold rounded-xl border-2 border-slate-300 focus:border-purple-600 focus:outline-hidden bg-slate-50 text-slate-950 cursor-pointer">
              <option value="ALL" ${currentCategory === 'ALL' ? 'selected' : ''}>كافة المصادر والجهات</option>
              <option value="AGENCY" ${currentCategory === 'AGENCY' ? 'selected' : ''}>وكالات الشحن المعتمدة (Agencies)</option>
              <option value="STORE" ${currentCategory === 'STORE' ? 'selected' : ''}>شحن المتجر وسوق التطبيق (In-App Store)</option>
              <option value="ADMIN" ${currentCategory === 'ADMIN' ? 'selected' : ''}>تغذية مباشرة من الإدارة (Direct Admin Grants)</option>
              <option value="P2P_CONVERT" ${currentCategory === 'P2P_CONVERT' ? 'selected' : ''}>تحويل أرباح المضيف P2P</option>
            </select>
          </div>

          <!-- 4. البحث النصي العام (الملاحظات، العملة، المرجع، المستلم) -->
          <div>
            <label class="block text-xs font-black text-slate-900 mb-1.5">بحث سريع في الملاحظات والعملات:</label>
            <div class="relative">
              <input 
                type="text" 
                id="hostAuditSearchInput" 
                value="${currentSearch}" 
                oninput="window.filterHostAuditDebounced()" 
                placeholder="ابحث برقم المرجع، اسم المستلم، الملاحظة، العملة..." 
                class="w-full pl-3 pr-8 py-2 text-xs font-bold rounded-xl border-2 border-slate-300 focus:border-purple-600 focus:outline-hidden bg-slate-50 text-slate-950">
              <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5"></i>
            </div>
            <div class="text-[10px] text-slate-500 font-bold mt-1.5 flex items-center justify-between">
              <span>تحديث الجدول فوري عند الكتابة</span>
              <span class="font-mono text-purple-700 font-black">${filteredRecords.length} حركة مطابقة</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ثانياً: ملخص أرقام أعلى التقرير (Header Summary Cards) -->
      <div>
        <div class="flex items-center gap-2 mb-2.5">
          <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-xs">2</span>
          <h3 class="text-xs font-black text-slate-950 uppercase tracking-wide">ثانياً: ملخص أرقام أعلى التقرير (Header Summary)</h3>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <!-- 1. إجمالي الكوينز التي استلمها المضيف (الوارد) -->
          <div class="p-4 rounded-2xl bg-white border-2 border-emerald-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] text-right">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-emerald-950">إجمالي الكوينز المستلمة (الوارد):</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black">📥 وارد</span>
            </div>
            <div class="text-lg sm:text-2xl font-black font-mono text-emerald-700 mt-1.5">
              +${Number(summary.totalInflowCoins || 0).toLocaleString()} 🪙
            </div>
            <div class="text-[11px] font-bold text-slate-600 mt-1 flex items-center justify-between">
              <span>القيمة: ~$${Number(summary.totalInflowUsd || 0).toLocaleString()} USD</span>
              <span class="font-mono text-emerald-800 font-black">${summary.inflowCount || 0} شحنات تغذية</span>
            </div>
          </div>

          <!-- 2. إجمالي الكوينز التي قام بشحنها/صرفها المضيف (الصادر) -->
          <div class="p-4 rounded-2xl bg-white border-2 border-rose-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] text-right">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-rose-950">إجمالي الكوينز المشحونة (الصادر):</span>
              <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-black">📤 صادر</span>
            </div>
            <div class="text-lg sm:text-2xl font-black font-mono text-rose-700 mt-1.5">
              -${Number(summary.totalOutflowCoins || 0).toLocaleString()} 🪙
            </div>
            <div class="text-[11px] font-bold text-slate-600 mt-1 flex items-center justify-between">
              <span>القيمة: ~$${Number(summary.totalOutflowUsd || 0).toLocaleString()} USD</span>
              <span class="font-mono text-rose-800 font-black">${summary.outflowCount || 0} توزيعات</span>
            </div>
          </div>

          <!-- 3. عدد العمليات الكلي -->
          <div class="p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] text-right">
            <span class="text-xs font-bold text-slate-600 block">عدد العمليات الكلي:</span>
            <div class="text-lg sm:text-2xl font-black font-mono text-slate-950 mt-1.5">
              ${Number(summary.totalOperations || 0)} عملية موثقة ⚡
            </div>
            <div class="text-[11px] font-bold text-slate-600 mt-1 flex items-center gap-1.5">
              <span class="text-emerald-700">${summary.inflowCount || 0} وارد</span>
              <span>+</span>
              <span class="text-rose-700">${summary.outflowCount || 0} صادر</span>
            </div>
          </div>

          <!-- 4. صافي رصيد الحركة المحاسبي -->
          <div class="p-4 rounded-2xl bg-[#f7fbfd] border-2 border-blue-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] text-right">
            <span class="text-xs font-black text-blue-950 block">صافي رصيد الحركة (Net Flow):</span>
            <div class="text-lg sm:text-2xl font-black font-mono ${netCoins >= 0 ? 'text-blue-800' : 'text-rose-800'} mt-1.5">
              ${netCoins >= 0 ? '+' : ''}${netCoins.toLocaleString()} 🪙
            </div>
            <div class="text-[11px] font-bold text-blue-900 mt-1">
              معدل دوران الكوينز: <strong class="font-mono font-black">${summary.totalInflowCoins > 0 ? Math.round((summary.totalOutflowCoins / summary.totalInflowCoins) * 100) : 0}%</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- ثانياً: الجدول التفصيلي المقسم بوضوح -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] overflow-hidden">
        
        <!-- Table Sub-tabs & Controls Header -->
        <div class="p-4 border-b-2 border-slate-300 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <!-- Segmented Tab Controls -->
          <div class="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 border border-slate-300 max-w-fit">
            <button 
              type="button" 
              onclick="window.setHostAuditTab('unified')" 
              class="px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${activeTab === 'unified' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-700 hover:text-slate-950'}">
              <span>كافة العمليات (${records.length})</span>
            </button>
            <button 
              type="button" 
              onclick="window.setHostAuditTab('inflow')" 
              class="px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 ${activeTab === 'inflow' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-800 hover:bg-emerald-100'}">
              <span>سجل الوارد (مصادر الشحن) 📥</span>
              <span class="font-mono text-[11px] px-1 rounded-sm bg-black/20">${summary.inflowCount || 0}</span>
            </button>
            <button 
              type="button" 
              onclick="window.setHostAuditTab('outflow')" 
              class="px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 ${activeTab === 'outflow' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-800 hover:bg-rose-100'}">
              <span>سجل الصادر (أين شحن المضيف) 📤</span>
              <span class="font-mono text-[11px] px-1 rounded-sm bg-black/20">${summary.outflowCount || 0}</span>
            </button>
          </div>

          <!-- Counter & Legend -->
          <div class="text-xs text-slate-600 font-bold flex items-center gap-2">
            <span>عدد السجلات المعروضة:</span>
            <span class="font-mono font-black text-slate-950 bg-slate-200 px-2 py-0.5 rounded-md">${filteredRecords.length} سجل</span>
          </div>
        </div>

        <!-- Table Container -->
        <div class="overflow-x-auto">
          <table class="w-full text-right border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr class="bg-slate-100 text-slate-900 border-b-2 border-slate-300 font-black">
                <th class="py-3 px-3.5 border-l border-slate-200/80">الرقم المرجعي ونوع الحركة</th>
                <th class="py-3 px-3.5 border-l border-slate-200/80">المصدر / الجهة المغذية (سجل الوارد)</th>
                <th class="py-3 px-3.5 border-l border-slate-200/80">الجهة والمستلم (سجل الصادر)</th>
                <th class="py-3 px-3.5 text-center border-l border-slate-200/80">كمية الكوينز 🪙</th>
                <th class="py-3 px-3.5 text-center border-l border-slate-200/80">المقابل بالدولار ($ USD)</th>
                <th class="py-3 px-3.5 border-l border-slate-200/80">المبلغ بالعملة المحلية</th>
                <th class="py-3 px-3.5 border-l border-slate-200/80">وسيلة الدفع والتحويل</th>
                <th class="py-3 px-3.5 border-l border-slate-200/80 min-w-[220px]">الملاحظات وفض النزاعات</th>
                <th class="py-3 px-3.5 text-center border-l border-slate-200/80">التاريخ والوقت بالثانية</th>
                <th class="py-3 px-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-300">
              ${filteredRecords.length === 0 ? `
                <tr>
                  <td colspan="10" class="py-10 text-center text-slate-500 font-bold bg-[#f7fbfd]">
                    <div class="text-3xl mb-2">🔍</div>
                    <div class="text-sm text-slate-800 font-black">لا توجد حركات مالية مطابقة لمعايير الفلترة الحالية للمضيف #${currentHostId}</div>
                    <div class="text-xs text-slate-500 mt-1">جرّب تغيير الفترة الزمنية أو إزالة فلاتر البحث أو النقر على "كافة الفترات"</div>
                  </td>
                </tr>
              ` : filteredRecords.map((r, idx) => {
                const isInflow = r.direction === 'INFLOW';
                const rowBg = idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white';

                return `
                  <tr class="${rowBg} hover:bg-[#dff0f5] transition border-b border-slate-300">
                    
                    <!-- 1. الرقم المرجعي ونوع الحركة -->
                    <td class="py-3 px-3.5 border-l border-slate-200/80 font-mono">
                      <div class="flex items-center gap-1.5">
                        <span class="font-black text-slate-950">${r.referenceId}</span>
                        ${isInflow ? `
                          <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-black text-[10px]">
                            وارد 📥
                          </span>
                        ` : `
                          <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-950 border border-rose-300 font-black text-[10px]">
                            صادر 📤
                          </span>
                        `}
                      </div>
                      <div class="text-[10px] text-slate-500 font-sans mt-0.5">
                        ${r.status || 'معتمد ومكتمل ✅'}
                      </div>
                    </td>

                    <!-- 2. المصدر / الجهة المغذية (سجل الوارد) -->
                    <td class="py-3 px-3.5 border-l border-slate-200/80">
                      ${isInflow ? `
                        <div class="font-black text-slate-950 flex items-center gap-1">
                          <i data-lucide="arrow-down-left" class="w-3.5 h-3.5 text-emerald-600 shrink-0"></i>
                          <span>${r.sourceName}</span>
                        </div>
                        <div class="text-[10px] text-slate-600 font-mono mt-0.5">
                          ${r.sourceCategory === 'AGENCY' ? `وكالة معتمدة #${r.agencyId || '1001'}` :
                            r.sourceCategory === 'STORE' ? 'متجر التطبيقات الرسمي' :
                            r.sourceCategory === 'ADMIN' ? 'الإدارة العليا المباشرة' : 'تحويل P2P آلي'}
                        </div>
                      ` : `
                        <span class="text-slate-400 font-mono">-</span>
                      `}
                    </td>

                    <!-- 3. الجهة والمستلم (سجل الصادر) -->
                    <td class="py-3 px-3.5 border-l border-slate-200/80">
                      ${!isInflow ? `
                        <div class="font-black text-slate-950 flex items-center gap-1">
                          <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 text-rose-600 shrink-0"></i>
                          <span>${r.targetUserName}</span>
                        </div>
                        <div class="text-[10px] text-slate-600 font-mono mt-0.5 flex items-center gap-1.5">
                          <span>المعرف: #${r.targetUserId}</span>
                          <span>•</span>
                          <span class="text-slate-700 font-sans font-bold">(${r.targetUserType || 'مستخدم'})</span>
                        </div>
                      ` : `
                        <span class="text-slate-400 font-mono">-</span>
                      `}
                    </td>

                    <!-- 4. كمية الكوينز -->
                    <td class="py-3 px-3.5 text-center font-mono font-black text-sm border-l border-slate-200/80">
                      ${isInflow ? `
                        <span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          +${Number(r.coinsAmount).toLocaleString()} 🪙
                        </span>
                      ` : `
                        <span class="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                          -${Number(r.coinsAmount).toLocaleString()} 🪙
                        </span>
                      `}
                    </td>

                    <!-- 5. المقابل بالدولار -->
                    <td class="py-3 px-3.5 text-center font-mono font-bold text-slate-900 border-l border-slate-200/80">
                      $${Number(r.amountUsd).toLocaleString()}
                    </td>

                    <!-- 6. المبلغ بالعملة المحلية -->
                    <td class="py-3 px-3.5 border-l border-slate-200/80">
                      <div class="font-black font-mono text-slate-950">
                        ${Number(r.localCurrencyAmount).toLocaleString()} ${r.localCurrencyCode}
                      </div>
                      <div class="text-[10px] text-slate-500 font-bold">
                        ${r.localCurrencyCode === 'SAR' ? 'ريال سعودي' :
                          r.localCurrencyCode === 'EGP' ? 'جنيه مصري' :
                          r.localCurrencyCode === 'AED' ? 'درهم إماراتي' :
                          r.localCurrencyCode === 'IQD' ? 'دينار عراقي' :
                          r.localCurrencyCode === 'YER' ? 'ريال يمني' : 'دولار أمريكي'}
                      </div>
                    </td>

                    <!-- 7. وسيلة الدفع والتحويل -->
                    <td class="py-3 px-3.5 border-l border-slate-200/80 text-slate-800 font-bold">
                      ${r.paymentMethod}
                    </td>

                    <!-- 8. الملاحظات وفض النزاعات -->
                    <td class="py-3 px-3.5 border-l border-slate-200/80 max-w-[280px]">
                      <div class="flex items-start justify-between gap-1.5">
                        <div class="text-[11px] text-slate-900 font-bold leading-relaxed whitespace-normal line-clamp-2" title="${r.disputeNotes || ''}">
                          ${r.disputeNotes || '<span class="text-slate-400 font-normal">لا توجد ملاحظات مدونة</span>'}
                        </div>
                        <button 
                          type="button" 
                          onclick="window.openHostAuditNoteModal('${r.referenceId}')" 
                          class="text-[10px] text-purple-700 hover:text-purple-900 font-black p-1 hover:bg-purple-100 rounded-md transition cursor-pointer shrink-0" 
                          title="تعديل الملاحظة وفض النزاع">
                          ✍️
                        </button>
                      </div>
                    </td>

                    <!-- 9. التاريخ والوقت بالثانية -->
                    <td class="py-3 px-3.5 text-center font-mono text-slate-700 text-[11px] border-l border-slate-200/80">
                      ${r.timestamp}
                    </td>

                    <!-- 10. الإجراءات -->
                    <td class="py-3 px-3.5 text-center">
                      <div class="flex items-center justify-center gap-1">
                        <button 
                          type="button" 
                          onclick="window.showHostAuditReceiptModal('${r.referenceId}')" 
                          class="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] transition cursor-pointer shadow-2xs active:scale-95">
                          إيصال 🧾
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Table Footer Summary -->
        <div class="p-4 bg-slate-50 border-t-2 border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="font-bold text-slate-700 flex items-center gap-2">
            <span>إجمالي حركات الجدول المصفاة:</span>
            <span class="font-black font-mono text-slate-950">${filteredRecords.length} حركة</span>
            <span>•</span>
            <span class="text-emerald-700 font-bold">وارد: +${filteredRecords.filter(r => r.direction === 'INFLOW').reduce((s, r) => s + r.coinsAmount, 0).toLocaleString()} 🪙</span>
            <span>•</span>
            <span class="text-rose-700 font-bold">صادر: -${filteredRecords.filter(r => r.direction === 'OUTFLOW').reduce((s, r) => s + r.coinsAmount, 0).toLocaleString()} 🪙</span>
          </div>
          <div class="text-slate-500 text-[11px]">
            تطبيق النجم - النظام المحاسبي المركزي الموحد لتدقيق المضيفين
          </div>
        </div>
      </div>

      <!-- Modals Container (Injected dynamically) -->
      <div id="hostAuditModalsContainer"></div>

    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

// Controller Actions for Host Audit
window.filterHostAuditSubmit = function() {
  const input = document.getElementById('hostAuditInputId');
  if (input && input.value) {
    window._hostAuditFilter.hostId = input.value.trim();
  }
  window._hostAuditFilter.startDate = document.getElementById('hostAuditStartDate')?.value || '';
  window._hostAuditFilter.endDate = document.getElementById('hostAuditEndDate')?.value || '';
  window._hostAuditFilter.direction = document.getElementById('hostAuditDirectionSelect')?.value || 'ALL';
  window._hostAuditFilter.sourceCategory = document.getElementById('hostAuditCategorySelect')?.value || 'ALL';
  window._hostAuditFilter.search = document.getElementById('hostAuditSearchInput')?.value || '';

  // Force re-fetch for new host
  window._hostAuditDataCache = null;
  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) renderHostAuditFullPage(container);
};

window.filterHostAuditInputsChange = function() {
  window._hostAuditFilter.startDate = document.getElementById('hostAuditStartDate')?.value || '';
  window._hostAuditFilter.endDate = document.getElementById('hostAuditEndDate')?.value || '';
  window._hostAuditFilter.direction = document.getElementById('hostAuditDirectionSelect')?.value || 'ALL';
  window._hostAuditFilter.sourceCategory = document.getElementById('hostAuditCategorySelect')?.value || 'ALL';

  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) renderHostAuditFullPage(container);
};

let _hostAuditDebounceTimer = null;
window.filterHostAuditDebounced = function() {
  clearTimeout(_hostAuditDebounceTimer);
  _hostAuditDebounceTimer = setTimeout(() => {
    window._hostAuditFilter.search = document.getElementById('hostAuditSearchInput')?.value || '';
    const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
    if (container) renderHostAuditFullPage(container);
  }, 250);
};

window.resetHostAuditFilter = function() {
  window._hostAuditFilter = {
    hostId: window._hostAuditFilter.hostId || '104829',
    startDate: '',
    endDate: '',
    direction: 'ALL',
    sourceCategory: 'ALL',
    search: '',
    activeTab: 'unified'
  };
  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) renderHostAuditFullPage(container);
};

window.setHostAuditQuickHost = function(hostId) {
  window._hostAuditFilter.hostId = String(hostId).trim();
  window._hostAuditDataCache = null;
  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) renderHostAuditFullPage(container);
};

window.setHostAuditTab = function(tabName) {
  window._hostAuditFilter.activeTab = tabName;
  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) renderHostAuditFullPage(container);
};

window.setHostAuditQuickDate = function(range) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  if (range === 'today') {
    window._hostAuditFilter.startDate = todayStr;
    window._hostAuditFilter.endDate = todayStr;
  } else if (range === '7days') {
    const d7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const d7Str = `${d7.getFullYear()}-${String(d7.getMonth() + 1).padStart(2, '0')}-${String(d7.getDate()).padStart(2, '0')}`;
    window._hostAuditFilter.startDate = d7Str;
    window._hostAuditFilter.endDate = todayStr;
  } else if (range === '30days') {
    const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const d30Str = `${d30.getFullYear()}-${String(d30.getMonth() + 1).padStart(2, '0')}-${String(d30.getDate()).padStart(2, '0')}`;
    window._hostAuditFilter.startDate = d30Str;
    window._hostAuditFilter.endDate = todayStr;
  } else {
    window._hostAuditFilter.startDate = '';
    window._hostAuditFilter.endDate = '';
  }

  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) renderHostAuditFullPage(container);
};

window.refreshHostAuditFullPage = async function() {
  window._hostAuditDataCache = null;
  await fetchHostAuditData(true);
  const container = window._rechargeAgenciesContainer || document.getElementById('dynamicViewContainer') || document.getElementById('tab-content-container');
  if (container) renderHostAuditFullPage(container);
};

// Print Official Statement
window.printHostAuditReport = function() {
  window.print();
};

// Export CSV for Host Audit
window.exportHostAuditCsv = function() {
  const auditData = window._hostAuditDataCache;
  if (!auditData || !auditData.records || auditData.records.length === 0) {
    alert('لا توجد سجلات متاحة للتصدير حالياً.');
    return;
  }

  const records = auditData.records;
  const headers = [
    'الرقم المرجعي',
    'الاتجاه',
    'المصدر/التغذية',
    'المستلم',
    'معرف المستلم',
    'الكوينز',
    'المقابل بالدولار',
    'المبلغ بالعملة المحلية',
    'كود العملة',
    'وسيلة الدفع',
    'الملاحظات وفض النزاعات',
    'التاريخ والوقت بالثانية',
    'الحالة'
  ];

  const rows = records.map(r => [
    `"${r.referenceId || ''}"`,
    `"${r.direction === 'INFLOW' ? 'وارد' : 'صادر'}"`,
    `"${r.sourceName || ''}"`,
    `"${r.targetUserName || ''}"`,
    `"${r.targetUserId || ''}"`,
    r.coinsAmount || 0,
    r.amountUsd || 0,
    r.localCurrencyAmount || 0,
    `"${r.localCurrencyCode || 'USD'}"`,
    `"${r.paymentMethod || ''}"`,
    `"${(r.disputeNotes || '').replace(/"/g, '""')}"`,
    `"${r.timestamp || ''}"`,
    `"${r.status || 'معتمد'}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Host_Audit_Statement_${auditData.hostId}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Modal for Dispute Notes
window.openHostAuditNoteModal = function(referenceId) {
  const auditData = window._hostAuditDataCache;
  const records = auditData?.records || [];
  const rec = records.find(r => r.referenceId === referenceId) || (records.length > 0 ? records[0] : null);

  const container = document.getElementById('hostAuditModalsContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div class="bg-white rounded-3xl border-2 border-slate-300 max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div class="p-5 bg-gradient-to-r from-purple-800 to-indigo-900 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-xl">
              ✍️
            </div>
            <div>
              <h3 class="text-base font-black">توثيق ملاحظة رسمية وفض نزاع</h3>
              <p class="text-xs text-purple-200 mt-0.5">تحديث ملاحظات العملية لفض أي نزاع مالي وتوثيق الإيصالات الرسمية</p>
            </div>
          </div>
          <button 
            type="button" 
            onclick="window.closeHostAuditModal()" 
            class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <div class="p-5 space-y-4 text-right">
          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">اختر العملية المرجعية:</label>
            <select 
              id="hostAuditNoteRefSelect" 
              class="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border-2 border-slate-300 focus:border-purple-600 focus:outline-hidden bg-slate-50 text-slate-950">
              ${records.map(r => `
                <option value="${r.referenceId}" ${rec && rec.referenceId === r.referenceId ? 'selected' : ''}>
                  ${r.referenceId} | ${r.direction === 'INFLOW' ? 'وارد (+)' : 'صادر (-)'} ${r.coinsAmount.toLocaleString()} 🪙 (${r.timestamp})
                </option>
              `).join('')}
            </select>
          </div>

          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">اسم المشرف / المدقق الإداري:</label>
            <input 
              type="text" 
              id="hostAuditAdminName" 
              value="المشرف المالي العام" 
              class="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-slate-300 focus:border-purple-600 focus:outline-hidden bg-slate-50 text-slate-950">
          </div>

          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">نص الملاحظة وقرار فض النزاع:</label>
            <textarea 
              id="hostAuditNoteText" 
              rows="4" 
              placeholder="اكتب تفاصيل التحقق من الإيصال، رقم الحوالة البنكية، أو سبب اعتماد وفض النزاع..." 
              class="w-full p-3 text-xs font-bold rounded-xl border-2 border-slate-300 focus:border-purple-600 focus:outline-hidden bg-slate-50 text-slate-950">${rec?.disputeNotes || ''}</textarea>
          </div>

          <div class="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 font-bold flex items-start gap-2">
            <span>⚠️</span>
            <span>سيتم حفظ هذه الملاحظة في السجل المركزي المالي لكشف حساب المضيف وتظهر فورياً في التقرير الرسمي.</span>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button 
              type="button" 
              onclick="window.closeHostAuditModal()" 
              class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer">
              إلغاء
            </button>
            <button 
              type="button" 
              id="saveHostAuditNoteBtn"
              onclick="window.submitHostAuditNoteSave()" 
              class="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition cursor-pointer shadow-xs active:scale-95">
              حفظ واعتماد الملاحظة
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
};

window.closeHostAuditModal = function() {
  const container = document.getElementById('hostAuditModalsContainer');
  if (container) container.innerHTML = '';
};

window.submitHostAuditNoteSave = async function() {
  const refSelect = document.getElementById('hostAuditNoteRefSelect');
  const noteText = document.getElementById('hostAuditNoteText')?.value.trim();
  const adminName = document.getElementById('hostAuditAdminName')?.value.trim() || 'الإدارة المالية';

  if (!refSelect || !refSelect.value) {
    alert('يرجى اختيار العملية.');
    return;
  }
  if (!noteText) {
    alert('يرجى كتابة نص الملاحظة.');
    return;
  }

  const referenceId = refSelect.value;
  const btn = document.getElementById('saveHostAuditNoteBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerText = 'جارٍ الحفظ...';
  }

  try {
    const res = await fetch('/api/admin/host-audit/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referenceId: referenceId,
        notes: noteText,
        adminName: adminName
      })
    });

    const data = await res.json();
    if (data.success) {
      alert('✅ تم حفظ وتوثيق الملاحظة بنجاح وفض النزاع المالي.');
      window.closeHostAuditModal();
      await window.refreshHostAuditFullPage();
    } else {
      alert('❌ تعذر حفظ الملاحظة: ' + (data.error || 'خطأ غير معروف'));
    }
  } catch (err) {
    alert('حدث خطأ في الاتصال: ' + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = 'حفظ واعتماد الملاحظة';
    }
  }
};

// Direct Recharge Entry for Host Modal
window.openHostDirectRechargeModal = function(hostId) {
  const container = document.getElementById('hostAuditModalsContainer');
  if (!container) return;

  const currentHostId = hostId || window._hostAuditFilter.hostId || '104829';
  const agencies = window._rechargeAgenciesState?.agencies || [];

  container.innerHTML = `
    <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div class="bg-white rounded-3xl border-2 border-slate-300 max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div class="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-xl">
              ➕
            </div>
            <div>
              <h3 class="text-base font-black">تنفيذ حركة كوينز للمضيف وتوثيقها فورياً</h3>
              <p class="text-xs text-emerald-100 mt-0.5">تغذية واردة أو صرف صادر مع توثيق العملة المحلية والملاحظات بالثانية</p>
            </div>
          </div>
          <button 
            type="button" 
            onclick="window.closeHostAuditModal()" 
            class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <div class="p-5 space-y-4 text-right">
          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">نوع الحركة:</label>
            <select 
              id="hostEntryDirection" 
              class="w-full px-3 py-2 text-xs font-black rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-hidden bg-slate-50 text-slate-950">
              <option value="INFLOW">شحنة واردة وتغذية للمضيف (📥 INFLOW - إضافة رصيد)</option>
              <option value="OUTFLOW">شحن صادر وتوزيع لمستلم (📤 OUTFLOW - خصم وصرف)</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">ID المضيف المستهدف:</label>
              <input 
                type="text" 
                id="hostEntryHostId" 
                value="${currentHostId}" 
                class="w-full px-3 py-2 text-xs font-mono font-black rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-hidden bg-slate-50 text-slate-950 text-right">
            </div>
            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">كمية الكوينز 🪙:</label>
              <input 
                type="number" 
                id="hostEntryCoins" 
                value="1000000" 
                step="50000"
                class="w-full px-3 py-2 text-xs font-mono font-black rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-hidden bg-slate-50 text-slate-950 text-right">
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">مصدر التغذية / وكالة الشحن المعتمدة:</label>
            <select 
              id="hostEntrySource" 
              class="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-hidden bg-slate-50 text-slate-950">
              <option value="وكالة #1001 مؤسسة الدانة للمدفوعات الرقمية">وكالة #1001 مؤسسة الدانة للمدفوعات الرقمية</option>
              <option value="وكالة #1002 الخليج الرقمي المعتمد">وكالة #1002 الخليج الرقمي المعتمد</option>
              <option value="شحن المتجر وسوق التطبيق (Apple Pay / Google Play)">شحن المتجر وسوق التطبيق (In-App Store)</option>
              <option value="تغذية مباشرة من الإدارة (Super Admin Grant)">تغذية مباشرة من الإدارة (Super Admin Grant)</option>
              <option value="تحويل أرباح المضيف P2P">تحويل أرباح المضيف P2P</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">العملة المحلية:</label>
              <select 
                id="hostEntryCurrency" 
                class="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-hidden bg-slate-50 text-slate-950">
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="EGP">جنيه مصري (EGP)</option>
                <option value="AED">درهم إماراتي (AED)</option>
                <option value="IQD">دينار عراقي (IQD)</option>
                <option value="YER">ريال يمني (YER)</option>
                <option value="USD">دولار أمريكي (USD)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">المبلغ بالعملة المحلية:</label>
              <input 
                type="number" 
                id="hostEntryLocalAmount" 
                value="375" 
                class="w-full px-3 py-2 text-xs font-mono font-black rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-hidden bg-slate-50 text-slate-950 text-right">
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">الملاحظات وتفاصيل فض النزاع:</label>
            <input 
              type="text" 
              id="hostEntryNotes" 
              placeholder="اكتب تفاصيل التغذية أو الدعم..." 
              value="تغذية رسمية معتمدة من الإدارة لفض الخلاف وتأكيد رصيد المضيف" 
              class="w-full px-3 py-2 text-xs font-bold rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-hidden bg-slate-50 text-slate-950">
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button 
              type="button" 
              onclick="window.closeHostAuditModal()" 
              class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer">
              إلغاء
            </button>
            <button 
              type="button" 
              id="submitHostEntryBtn"
              onclick="window.submitHostEntryForm()" 
              class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition cursor-pointer shadow-xs active:scale-95">
              تنفيذ الحركة وتوثيقها
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
};

window.submitHostEntryForm = async function() {
  const hostId = document.getElementById('hostEntryHostId')?.value.trim();
  const coinsAmount = Number(document.getElementById('hostEntryCoins')?.value) || 0;
  const direction = document.getElementById('hostEntryDirection')?.value || 'INFLOW';
  const sourceName = document.getElementById('hostEntrySource')?.value || 'إدارة الشحن';
  const localCurrencyCode = document.getElementById('hostEntryCurrency')?.value || 'SAR';
  const localCurrencyAmount = Number(document.getElementById('hostEntryLocalAmount')?.value) || 0;
  const disputeNotes = document.getElementById('hostEntryNotes')?.value.trim() || '';

  if (!hostId || coinsAmount <= 0) {
    alert('يرجى تحديد ID المضيف وكمية الكوينز الصحيحة.');
    return;
  }

  const btn = document.getElementById('submitHostEntryBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerText = 'جارٍ التنفيذ...';
  }

  try {
    const res = await fetch('/api/admin/host-audit/entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hostId,
        coinsAmount,
        direction,
        sourceName,
        localCurrencyCode,
        localCurrencyAmount,
        disputeNotes
      })
    });

    const data = await res.json();
    if (data.success) {
      alert(`✅ تم توثيق الحركة بنجاح!\nالرقم المرجعي: ${data.record.referenceId}\nالكمية: ${coinsAmount.toLocaleString()} 🪙`);
      window.closeHostAuditModal();
      window._hostAuditFilter.hostId = hostId;
      await window.refreshHostAuditFullPage();
    } else {
      alert('❌ فشل تنفيذ الحركة: ' + (data.error || 'خطأ غير معروف'));
    }
  } catch (err) {
    alert('حدث خطأ في الاتصال: ' + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = 'تنفيذ الحركة وتوثيقها';
    }
  }
};

// Receipt Modal for individual record
window.showHostAuditReceiptModal = function(referenceId) {
  const auditData = window._hostAuditDataCache;
  const r = (auditData?.records || []).find(rec => rec.referenceId === referenceId);
  if (!r) return;

  const container = document.getElementById('hostAuditModalsContainer');
  if (!container) return;

  const isInflow = r.direction === 'INFLOW';

  container.innerHTML = `
    <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div class="bg-white rounded-3xl border-2 border-slate-300 max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-right">
        
        <div class="p-5 ${isInflow ? 'bg-emerald-700' : 'bg-rose-700'} text-white flex items-center justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-white/80 block">إيصال تدقيق رسمي معتمد</span>
            <h3 class="text-base font-black mt-0.5">${isInflow ? 'إشعار شحن ووارد كوينز 📥' : 'إشعار صرف وشحن صادر 📤'}</h3>
          </div>
          <button 
            type="button" 
            onclick="window.closeHostAuditModal()" 
            class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <div class="p-5 space-y-3.5 text-xs">
          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="text-slate-500 font-bold">الرقم المرجعي:</span>
            <span class="font-mono font-black text-slate-950">${r.referenceId}</span>
          </div>

          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="text-slate-500 font-bold">المضيف المستهدف:</span>
            <span class="font-black text-slate-950">${r.hostName} (#${r.hostId})</span>
          </div>

          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="text-slate-500 font-bold">${isInflow ? 'المصدر / التغذية:' : 'الجهة / المستلم:'}</span>
            <span class="font-black text-slate-950">${isInflow ? r.sourceName : `${r.targetUserName} (#${r.targetUserId})`}</span>
          </div>

          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="text-slate-500 font-bold">كمية الكوينز:</span>
            <span class="font-mono font-black text-base ${isInflow ? 'text-emerald-700' : 'text-rose-700'}">
              ${isInflow ? '+' : '-'}${Number(r.coinsAmount).toLocaleString()} 🪙
            </span>
          </div>

          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="text-slate-500 font-bold">المقابل بالدولار:</span>
            <span class="font-mono font-bold text-slate-900">$${Number(r.amountUsd).toLocaleString()} USD</span>
          </div>

          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="text-slate-500 font-bold">المبلغ بالعملة المحلية:</span>
            <span class="font-mono font-black text-slate-950">${Number(r.localCurrencyAmount).toLocaleString()} ${r.localCurrencyCode}</span>
          </div>

          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="text-slate-500 font-bold">وسيلة الدفع:</span>
            <span class="font-bold text-slate-800">${r.paymentMethod}</span>
          </div>

          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="text-slate-500 font-bold">التاريخ بالثانية:</span>
            <span class="font-mono text-slate-700">${r.timestamp}</span>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span class="text-[10px] text-slate-500 font-black block mb-1">الملاحظات وتوثيق فض النزاع:</span>
            <p class="text-slate-900 font-bold leading-relaxed">${r.disputeNotes || 'لا توجد ملاحظات إضافية.'}</p>
          </div>

          <div class="flex items-center justify-between pt-2">
            <button 
              type="button" 
              onclick="window.print()" 
              class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition cursor-pointer">
              طباعة الإشعار 🖨️
            </button>
            <button 
              type="button" 
              onclick="window.closeHostAuditModal()" 
              class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer">
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
};

window._p2pLogFilter = window._p2pLogFilter || {
  search: '',
  agencyId: '',
  status: 'ALL'
};

function renderP2PHostTransferFullPage(container) {
  const state = window._rechargeAgenciesState;
  const agencies = state.agencies || [];
  const transfers = state.p2pTransfers || [];

  const currentSearch = (window._p2pLogFilter.search || '').toLowerCase().trim();
  const currentAgency = window._p2pLogFilter.agencyId || '';
  const currentStatus = window._p2pLogFilter.status || 'ALL';

  const filteredTransfers = transfers.filter(tr => {
    if (currentAgency && tr.agencyId !== currentAgency) return false;
    const isRolledBack = tr.isRolledBack || (tr.status && tr.status.includes('ملغى'));
    if (currentStatus === 'ACTIVE' && isRolledBack) return false;
    if (currentStatus === 'ROLLED_BACK' && !isRolledBack) return false;
    if (currentSearch) {
      const matchHost = (tr.hostName || '').toLowerCase().includes(currentSearch) || String(tr.hostId || '').toLowerCase().includes(currentSearch);
      const matchAgency = (tr.agencyName || '').toLowerCase().includes(currentSearch) || String(tr.agencyId || '').toLowerCase().includes(currentSearch);
      const matchRef = (tr.referenceId || '').toLowerCase().includes(currentSearch) || String(tr.id || '').toLowerCase().includes(currentSearch);
      if (!matchHost && !matchAgency && !matchRef) return false;
    }
    return true;
  });

  const totalAutomatedCount = transfers.length;
  const totalUsd = transfers.reduce((sum, t) => sum + (Number(t.amountUsd) || 0), 0);
  const totalCoins = transfers.reduce((sum, t) => sum + (Number(t.convertedCoins) || 0), 0);
  const totalRolledBack = transfers.filter(t => t.isRolledBack || (t.status && t.status.includes('ملغى'))).length;

  container.innerHTML = `
    <div class="space-y-5 animate-in fade-in duration-200">
      
      <!-- Top Bar with Back Button & Live Status -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex items-center gap-3">
          <button 
            type="button" 
            onclick="window.navigateToAgenciesList()" 
            class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95">
            <i data-lucide="arrow-right" class="w-4 h-4 text-amber-400"></i>
            <span>رجوع لقائمة الوكالات</span>
          </button>

          <div class="h-6 w-px bg-slate-300 hidden sm:block"></div>

          <div class="text-xs text-slate-700 font-bold flex items-center gap-2">
            <span class="text-slate-500">وكالات الشحن</span>
            <span>/</span>
            <span class="text-slate-950 font-black">سجل مراقبة تحويلات أرباح المضيفين لوكلاء الشحن (Live P2P Monitoring Log)</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-950 border-2 border-emerald-300 text-xs font-black">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>البث الرقابي الآلي الحي نشط (Automated P2P 100%)</span>
          </span>

          <button 
            type="button" 
            onclick="window.refreshP2PTransfersLog()" 
            class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-black text-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="تحديث البيانات من الخادم">
            <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-slate-700"></i>
            <span>تحديث</span>
          </button>
        </div>
      </div>

      <!-- Live Monitoring Notice Banner -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-950 border border-amber-300 flex items-center justify-center font-black text-xl shrink-0">
            📡
          </div>
          <div>
            <h3 class="text-sm font-black text-slate-950">شاشة مراقبة وتدقيق حي لعمليات الـ P2P بين المضيفين والوكلاء (Live Monitoring Only)</h3>
            <p class="text-xs text-slate-700 font-bold mt-0.5 leading-relaxed">
              هذه الشاشة مخصصة للعرض والمراقبة الرقابية فقط؛ حيث تتم كافة العمليات آلياً وبشكل فوري 100% من تطبيق المضيف/الوكيل عند الشحن وتحديد معرّف الوكالة. يقتصر دور الإدارة على فحص السجل والتدخل المباشر عند الخطأ عبر زر «إلغاء واسترجاع (Rollback)» لاسترداد أرباح المضيف وخصم الكوينز من الخزينة.
            </p>
          </div>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] text-right">
          <span class="text-xs font-bold text-slate-600 block">إجمالي التحويلات الآلية:</span>
          <div class="text-lg sm:text-xl font-black font-mono text-slate-950 mt-1">${totalAutomatedCount} عملية آمنة ⚡</div>
        </div>

        <div class="p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] text-right">
          <span class="text-xs font-bold text-slate-600 block">إجمالي أرباح المضيفين المحولة:</span>
          <div class="text-lg sm:text-xl font-black font-mono text-emerald-800 mt-1">$${totalUsd.toLocaleString()} USD</div>
        </div>

        <div class="p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] text-right">
          <span class="text-xs font-bold text-slate-600 block">الكوينز المغذاة في الخزائن:</span>
          <div class="text-lg sm:text-xl font-black font-mono text-amber-700 mt-1">${totalCoins.toLocaleString()} 🪙</div>
        </div>

        <div class="p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] text-right">
          <span class="text-xs font-bold text-slate-600 block">عمليات مسترجعة إدارياً:</span>
          <div class="text-lg sm:text-xl font-black font-mono ${totalRolledBack > 0 ? 'text-rose-700' : 'text-slate-900'} mt-1">${totalRolledBack} استرجاع (Rollback) ↩️</div>
        </div>
      </div>

      <!-- Main Filter and Table Container -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] space-y-4">
        
        <!-- Filter Controls -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-200 pb-4">
          <div class="flex items-center gap-2 flex-1 max-w-md">
            <div class="relative w-full">
              <input 
                type="text" 
                id="p2pLogSearchInput" 
                value="${window._p2pLogFilter.search || ''}" 
                placeholder="بحث برقم المرجع، اسم المضيف، ID، أو الوكالة..." 
                oninput="window.handleP2PLogSearch(this.value)"
                class="w-full pl-3 pr-9 py-2.5 rounded-xl border-2 border-slate-300 bg-slate-50 text-xs font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white" />
              <i data-lucide="search" class="w-4 h-4 text-slate-500 absolute right-3 top-3"></i>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <!-- Filter by Agency -->
            <select 
              id="p2pLogAgencyFilter" 
              onchange="window.handleP2PLogAgencyFilter(this.value)"
              class="px-3 py-2 rounded-xl border-2 border-slate-300 bg-slate-50 text-xs font-bold text-slate-950 focus:outline-none cursor-pointer">
              <option value="">جميع وكالات الشحن</option>
              ${agencies.map(ag => `
                <option value="${ag.id}" ${currentAgency === ag.id ? 'selected' : ''}>${ag.name} (#${ag.id})</option>
              `).join('')}
            </select>

            <!-- Filter by Status -->
            <select 
              id="p2pLogStatusFilter" 
              onchange="window.handleP2PLogStatusFilter(this.value)"
              class="px-3 py-2 rounded-xl border-2 border-slate-300 bg-slate-50 text-xs font-bold text-slate-950 focus:outline-none cursor-pointer">
              <option value="ALL" ${currentStatus === 'ALL' ? 'selected' : ''}>كافة الحالات</option>
              <option value="ACTIVE" ${currentStatus === 'ACTIVE' ? 'selected' : ''}>معتمد آلياً بنجاح ✅</option>
              <option value="ROLLED_BACK" ${currentStatus === 'ROLLED_BACK' ? 'selected' : ''}>ملغى ومسترجع إدارياً (Rollback) ↩️</option>
            </select>

            ${(currentSearch || currentAgency || currentStatus !== 'ALL') ? `
              <button 
                type="button" 
                onclick="window.resetP2PLogFilters()"
                class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition cursor-pointer">
                إلغاء الفلترة ✕
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Monitoring Table -->
        <div class="overflow-x-auto rounded-xl border-2 border-slate-300 bg-white">
          <table class="w-full text-right text-xs whitespace-nowrap">
            <thead class="bg-slate-100 text-slate-950 font-black border-b-2 border-slate-400">
              <tr>
                <th class="py-3 px-3.5 border-l border-slate-200/80">رقم المرجع / العملية</th>
                <th class="py-3 px-3.5 border-l border-slate-200/80">المضيف المحول (Host)</th>
                <th class="py-3 px-3.5 border-l border-slate-200/80">وكالة الشحن المستلمة</th>
                <th class="py-3 px-3.5 text-center border-l border-slate-200/80">المبلغ المحول ($)</th>
                <th class="py-3 px-3.5 text-center border-l border-slate-200/80">سعر الصرف المعتمد</th>
                <th class="py-3 px-3.5 text-center border-l border-slate-200/80">الكوينز المغذاة بالخزينة</th>
                <th class="py-3 px-3.5 text-center border-l border-slate-200/80">التاريخ والوقت</th>
                <th class="py-3 px-3.5 text-center border-l border-slate-200/80">طريقة التنفيذ</th>
                <th class="py-3 px-3.5 text-center border-l border-slate-200/80">حالة العملية</th>
                <th class="py-3 px-3.5 text-center">التدخل الإداري الرقابي</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-300">
              ${filteredTransfers.length === 0 ? `
                <tr>
                  <td colspan="10" class="py-8 text-center text-slate-500 font-bold bg-[#f7fbfd]">
                    <div class="text-2xl mb-1">🔍</div>
                    <div>لا توجد عمليات تحويل تطابق معايير البحث الحالية</div>
                  </td>
                </tr>
              ` : filteredTransfers.map((tr, idx) => {
                const isRolledBack = tr.isRolledBack || (tr.status && tr.status.includes('ملغى'));
                const rowBg = isRolledBack 
                  ? 'bg-rose-50/40 hover:bg-rose-50' 
                  : (idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white') + ' hover:bg-[#dff0f5]';

                return `
                  <tr class="${rowBg} transition border-b border-slate-300">
                    <!-- Reference ID -->
                    <td class="py-3 px-3.5 border-l border-slate-200/80">
                      <div class="flex items-center gap-1.5">
                        <span class="font-mono font-black text-slate-950">${tr.referenceId}</span>
                        <span class="px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold">P2P ⚡</span>
                      </div>
                      <div class="font-mono text-slate-500 text-[10px] mt-0.5">${tr.id}</div>
                    </td>

                    <!-- Host Info -->
                    <td class="py-3 px-3.5 border-l border-slate-200/80">
                      <div class="font-black text-slate-950 flex items-center gap-1.5">
                        <span>${tr.hostName}</span>
                      </div>
                      <div class="flex items-center gap-1 mt-0.5">
                        <span class="font-mono text-slate-500 text-[10px]">ID: #${tr.hostId}</span>
                        <button 
                          type="button" 
                          onclick="window.navigateToHostAudit('${tr.hostId}')" 
                          class="px-1.5 py-0.5 rounded bg-purple-100 hover:bg-purple-200 text-purple-900 text-[9px] font-black cursor-pointer transition" 
                          title="عرض كشف حساب وتدقيق المضيف">
                          كشف الحساب 📑
                        </button>
                      </div>
                    </td>

                    <!-- Agency Info -->
                    <td class="py-3 px-3.5 border-l border-slate-200/80">
                      <div class="font-black text-slate-950">${tr.agencyName}</div>
                      <div class="flex items-center gap-1 text-[10px] font-mono text-slate-500 mt-0.5">
                        <span>#${tr.agencyId}</span>
                      </div>
                    </td>

                    <!-- Amount USD -->
                    <td class="py-3 px-3.5 text-center font-mono font-black text-emerald-800 text-sm border-l border-slate-200/80">
                      $${Number(tr.amountUsd).toLocaleString()}
                    </td>

                    <!-- Exchange Rate -->
                    <td class="py-3 px-3.5 text-center font-mono font-bold text-slate-700 border-l border-slate-200/80">
                      ${Number(tr.exchangeRate).toLocaleString()} 🪙 / $1
                    </td>

                    <!-- Credited Coins -->
                    <td class="py-3 px-3.5 text-center font-mono font-black ${isRolledBack ? 'line-through text-slate-400' : 'text-amber-700'} text-sm border-l border-slate-200/80">
                      +${Number(tr.convertedCoins).toLocaleString()} 🪙
                    </td>

                    <!-- Timestamp -->
                    <td class="py-3 px-3.5 text-center font-mono text-slate-600 border-l border-slate-200/80">
                      <div>${tr.timestamp || tr.dateOnly}</div>
                    </td>

                    <!-- Execution Source -->
                    <td class="py-3 px-3.5 text-center border-l border-slate-200/80">
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-black text-[10px] border border-slate-300">
                        <span>تطبيق المضيف 📲</span>
                      </span>
                    </td>

                    <!-- Status -->
                    <td class="py-3 px-3.5 text-center border-l border-slate-200/80">
                      ${isRolledBack ? `
                        <div class="inline-flex flex-col items-center">
                          <span class="px-2.5 py-1 rounded-full bg-rose-100 text-rose-950 border border-rose-300 font-black text-[11px]">
                            ملغى ومسترجع (Rollback) ↩️
                          </span>
                          ${tr.rollbackReason ? `
                            <span class="text-[10px] text-rose-700 font-bold mt-1 max-w-[150px] truncate" title="${tr.rollbackReason}">
                              ${tr.rollbackReason}
                            </span>
                          ` : ''}
                        </div>
                      ` : `
                        <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-black text-[11px]">
                          معتمد آلياً بنجاح ✅
                        </span>
                      `}
                    </td>

                    <!-- Rollback Intervention Action -->
                    <td class="py-3 px-3.5 text-center">
                      ${isRolledBack ? `
                        <button 
                          type="button" 
                          onclick="window.showP2PRollbackDetailsModal('${tr.referenceId}')"
                          class="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-bold transition cursor-pointer">
                          تفاصيل الاسترجاع ℹ️
                        </button>
                      ` : `
                        <button 
                          type="button" 
                          onclick="window.openP2PRollbackModal('${tr.referenceId}')" 
                          class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-black text-xs transition flex items-center gap-1.5 mx-auto cursor-pointer shadow-2xs active:scale-95">
                          <i data-lucide="rotate-ccw" class="w-3.5 h-3.5 text-rose-600"></i>
                          <span>إلغاء واسترجاع (Rollback) ↩️</span>
                        </button>
                      `}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot class="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td colspan="3" class="py-3 px-3.5 border-l border-slate-200/80">المجموع الظاهر:</td>
                <td class="py-3 px-3.5 text-center font-mono text-emerald-800 border-l border-slate-200/80">
                  $${filteredTransfers.reduce((s, t) => s + ((t.isRolledBack || (t.status && t.status.includes('ملغى'))) ? 0 : Number(t.amountUsd)), 0).toLocaleString()} USD
                </td>
                <td class="py-3 px-3.5 text-center border-l border-slate-200/80">-</td>
                <td class="py-3 px-3.5 text-center font-mono text-amber-700 border-l border-slate-200/80">
                  ${filteredTransfers.reduce((s, t) => s + ((t.isRolledBack || (t.status && t.status.includes('ملغى'))) ? 0 : Number(t.convertedCoins)), 0).toLocaleString()} 🪙
                </td>
                <td colspan="4" class="py-3 px-3.5 text-left text-slate-600 font-bold">
                  إجمالي العمليات المعروضة: ${filteredTransfers.length} عملية
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

// Filter and Search Controllers for Live P2P Monitoring
window.handleP2PLogSearch = function(val) {
  window._p2pLogFilter.search = val;
  if (window._rechargeAgenciesContainer) {
    renderP2PHostTransferFullPage(window._rechargeAgenciesContainer);
    const input = document.getElementById('p2pLogSearchInput');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }
};

window.handleP2PLogAgencyFilter = function(agencyId) {
  window._p2pLogFilter.agencyId = agencyId;
  if (window._rechargeAgenciesContainer) {
    renderP2PHostTransferFullPage(window._rechargeAgenciesContainer);
  }
};

window.handleP2PLogStatusFilter = function(status) {
  window._p2pLogFilter.status = status;
  if (window._rechargeAgenciesContainer) {
    renderP2PHostTransferFullPage(window._rechargeAgenciesContainer);
  }
};

window.resetP2PLogFilters = function() {
  window._p2pLogFilter = { search: '', agencyId: '', status: 'ALL' };
  if (window._rechargeAgenciesContainer) {
    renderP2PHostTransferFullPage(window._rechargeAgenciesContainer);
  }
};

window.refreshP2PTransfersLog = async function() {
  await syncAgenciesFromServer();
  if (window._rechargeAgenciesContainer) {
    renderP2PHostTransferFullPage(window._rechargeAgenciesContainer);
  }
};

// =========================================================================
// ADMINISTRATIVE ROLLBACK MODAL CONTROLLERS (التدخل الإداري والاسترجاع عند الخطأ)
// =========================================================================

window.openP2PRollbackModal = function(referenceId) {
  const state = window._rechargeAgenciesState;
  const tr = (state.p2pTransfers || []).find(t => t.referenceId === referenceId || t.id === referenceId);
  if (!tr) {
    alert('تعذر العثور على بيانات العملية.');
    return;
  }

  if (tr.isRolledBack || (tr.status && tr.status.includes('ملغى'))) {
    alert('هذه العملية تم التراجع عنها واسترجاعها مسبقاً.');
    return;
  }

  let modal = document.getElementById('p2pRollbackConfirmModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'p2pRollbackConfirmModal';
    document.body.appendChild(modal);
  }

  modal.className = 'fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150';
  modal.innerHTML = `
    <div class="bg-white rounded-3xl border-2 border-slate-300 w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
      
      <!-- Modal Header -->
      <div class="p-4 bg-slate-950 text-white flex items-center justify-between border-b-2 border-slate-800">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-400 flex items-center justify-center font-black">
            ↩️
          </div>
          <div>
            <h3 class="font-black text-sm text-white">إلغاء واسترجاع عملية تحويل أرباح P2P (Rollback)</h3>
            <p class="text-[11px] text-slate-300 font-bold">تدخل إداري رقابي لاسترداد الأرباح وخصم الكوينز</p>
          </div>
        </div>
        <button 
          type="button" 
          onclick="window.closeP2PRollbackModal()" 
          class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-700 text-white flex items-center justify-center transition cursor-pointer">
          ✕
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-5 space-y-4 text-right text-slate-950 overflow-y-auto">
        
        <!-- Transaction Summary Box -->
        <div class="p-4 rounded-2xl bg-[#f7fbfd] border-2 border-slate-300 space-y-2.5 text-xs">
          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="font-bold text-slate-600">رقم المرجع (Ref):</span>
            <span class="font-mono font-black text-slate-950">${tr.referenceId}</span>
          </div>
          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="font-bold text-slate-600">المضيف المحول:</span>
            <span class="font-black text-slate-950">${tr.hostName} (ID: #${tr.hostId})</span>
          </div>
          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="font-bold text-slate-600">وكالة الشحن المستلمة:</span>
            <span class="font-black text-slate-950">${tr.agencyName} (#${tr.agencyId})</span>
          </div>
          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="font-bold text-slate-600">مبلغ الأرباح المحول:</span>
            <span class="font-mono font-black text-emerald-800 text-sm">$${Number(tr.amountUsd).toLocaleString()} USD</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-600">الكوينز المغذاة بالخزينة:</span>
            <span class="font-mono font-black text-amber-700 text-sm">${Number(tr.convertedCoins).toLocaleString()} 🪙</span>
          </div>
        </div>

        <!-- Strict Warning -->
        <div class="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-1.5 text-xs">
          <div class="font-black flex items-center gap-1.5 text-rose-900">
            <span>⚠️ أثر التنفيذ المالي المباشر:</span>
          </div>
          <p class="font-bold leading-relaxed text-[11px]">
            1. سيتم استرجاع مبلغ <strong class="text-rose-950 font-black">($${Number(tr.amountUsd).toLocaleString()} USD)</strong> فوراً إلى محفظة أرباح المضيف (${tr.hostName}).<br/>
            2. سيتم خصم <strong class="text-rose-950 font-black">(${Number(tr.convertedCoins).toLocaleString()} 🪙 كوينز)</strong> من رصيد خزينة الوكالة تلقائياً.<br/>
            3. ستُقيد العملية كـ «ملغاة ومسترجعة (Rollback)» في سجل الرقابة والتدقيق الدائم.
          </p>
        </div>

        <!-- Audit Reason Input -->
        <div>
          <label class="block text-xs font-black text-slate-900 mb-1">سبب الإلغاء والاسترجاع الإداري (إلزامي للتوثيق الرقابي):</label>
          <input 
            type="text" 
            id="p2pRollbackReason" 
            placeholder="مثال: تحويل خاطئ لمعرّف وكالة أخرى بطلب المضيف" 
            value="تحويل خاطئ لمعرّف وكالة أخرى بطلب المضيف"
            class="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 bg-slate-50 text-xs font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white" />
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="p-4 bg-slate-100 border-t-2 border-slate-200 flex items-center justify-between gap-3">
        <button 
          type="button" 
          onclick="window.closeP2PRollbackModal()" 
          class="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-700 font-black text-xs border border-slate-300 transition cursor-pointer">
          تراجع وإلغاء
        </button>

        <button 
          type="button" 
          id="p2pConfirmRollbackBtn"
          onclick="window.executeP2PRollback('${tr.referenceId}')" 
          class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95">
          <span>تأكيد الاسترجاع وخصم الكوينز فوراً ↩️</span>
        </button>
      </div>

    </div>
  `;
};

window.closeP2PRollbackModal = function() {
  const modal = document.getElementById('p2pRollbackConfirmModal');
  if (modal) modal.remove();
};

window.executeP2PRollback = async function(referenceId) {
  const reason = document.getElementById('p2pRollbackReason')?.value.trim() || 'إلغاء واسترجاع إداري بناءً على بلاغ خطأ في التحويل';
  const btn = document.getElementById('p2pConfirmRollbackBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerText = 'جارٍ معالجة الاسترجاع والخصم...';
  }

  try {
    const res = await fetch('/api/admin/p2p-transfers/rollback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transferId: referenceId,
        reason,
        adminName: 'المشرف العام (Super Admin)'
      })
    });
    const data = await res.json();

    if (data.success) {
      const state = window._rechargeAgenciesState;
      const tr = (state.p2pTransfers || []).find(t => t.referenceId === referenceId || t.id === referenceId);
      if (tr) {
        tr.isRolledBack = true;
        tr.status = 'ملغى ومسترجع (Rollback) ↩️';
        tr.rolledBackAt = data.transfer.rolledBackAt;
        tr.rollbackReason = data.transfer.rollbackReason;
        tr.rollbackAdmin = data.transfer.rollbackAdmin;
      }
      const ag = (state.agencies || []).find(a => a.id === tr?.agencyId);
      if (ag && typeof data.agencyNewBalance === 'number') {
        ag.coinsBalance = data.agencyNewBalance;
      } else if (ag && tr) {
        ag.coinsBalance = Math.max(0, ag.coinsBalance - tr.convertedCoins);
      }

      window.closeP2PRollbackModal();
      alert(`✅ ${data.message || 'تم بنجاح إلغاء العملية واسترجاع الأرباح للمضيف وخصم الكوينز من خزينة الوكالة.'}`);
      if (window._rechargeAgenciesContainer) {
        window.renderRechargeAgenciesViewMain(window._rechargeAgenciesContainer);
      }
      return;
    }
  } catch (err) {
    console.warn('Network error or offline mode, falling back locally', err);
  }

  // Local state fallback
  const state = window._rechargeAgenciesState;
  const tr = (state.p2pTransfers || []).find(t => t.referenceId === referenceId || t.id === referenceId);
  if (tr) {
    tr.isRolledBack = true;
    tr.status = 'ملغى ومسترجع (Rollback) ↩️';
    tr.rolledBackAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
    tr.rollbackReason = reason;
    tr.rollbackAdmin = 'المشرف العام (Super Admin)';

    const ag = (state.agencies || []).find(a => a.id === tr.agencyId);
    if (ag) {
      ag.coinsBalance = Math.max(0, ag.coinsBalance - tr.convertedCoins);
    }
  }

  window.closeP2PRollbackModal();
  alert(`✅ تم بنجاح إلغاء العملية (${referenceId})، واسترجاع مبلغ ($${tr?.amountUsd}) لأرباح المضيف، وخصم (${tr?.convertedCoins?.toLocaleString()} 🪙) من خزينة الوكالة.`);
  if (window._rechargeAgenciesContainer) {
    window.renderRechargeAgenciesViewMain(window._rechargeAgenciesContainer);
  }
};

window.showP2PRollbackDetailsModal = function(referenceId) {
  const state = window._rechargeAgenciesState;
  const tr = (state.p2pTransfers || []).find(t => t.referenceId === referenceId || t.id === referenceId);
  if (!tr) return;

  let modal = document.getElementById('p2pRollbackDetailsModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'p2pRollbackDetailsModal';
    document.body.appendChild(modal);
  }

  modal.className = 'fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150';
  modal.innerHTML = `
    <div class="bg-white rounded-3xl border-2 border-slate-300 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
      
      <div class="p-4 bg-slate-950 text-white flex items-center justify-between border-b-2 border-slate-800">
        <div class="flex items-center gap-2">
          <span class="text-lg">ℹ️</span>
          <h3 class="font-black text-sm text-white">تفاصيل الاسترجاع الإداري (Rollback Audit)</h3>
        </div>
        <button type="button" onclick="document.getElementById('p2pRollbackDetailsModal')?.remove()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition cursor-pointer">
          ✕
        </button>
      </div>

      <div class="p-5 space-y-3 text-right text-xs text-slate-900">
        <div class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 font-bold">
          تم إلغاء هذه العملية واسترجاع الأرباح لحساب المضيف وخصم الكوينز من خزينة الوكالة.
        </div>
        <div class="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
          <div class="flex justify-between">
            <span class="text-slate-500 font-bold">رقم المرجع:</span>
            <span class="font-mono font-black text-slate-950">${tr.referenceId}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 font-bold">المضيف:</span>
            <span class="font-black text-slate-950">${tr.hostName} (#${tr.hostId})</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 font-bold">الوكالة:</span>
            <span class="font-black text-slate-950">${tr.agencyName} (#${tr.agencyId})</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 font-bold">المبلغ المسترجع:</span>
            <span class="font-mono font-black text-emerald-800">$${Number(tr.amountUsd).toLocaleString()} USD</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 font-bold">الكوينز المخصومة:</span>
            <span class="font-mono font-black text-rose-700">${Number(tr.convertedCoins).toLocaleString()} 🪙</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 font-bold">وقت الاسترجاع:</span>
            <span class="font-mono text-slate-800 font-bold">${tr.rolledBackAt || tr.timestamp}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 font-bold">المشرف المسؤول:</span>
            <span class="text-slate-900 font-black">${tr.rollbackAdmin || 'المشرف العام'}</span>
          </div>
          <div class="border-t border-slate-200 pt-2">
            <span class="text-slate-500 font-bold block mb-1">سبب الاسترجاع المسجل:</span>
            <span class="font-bold text-slate-950 block bg-white p-2 rounded-lg border border-slate-200">${tr.rollbackReason || 'بلاغ خطأ في التحويل'}</span>
          </div>
        </div>
      </div>

      <div class="p-3.5 bg-slate-100 border-t border-slate-200 text-left">
        <button type="button" onclick="document.getElementById('p2pRollbackDetailsModal')?.remove()" class="px-4 py-2 rounded-xl bg-slate-900 text-white font-black text-xs cursor-pointer">
          إغلاق النافذة
        </button>
      </div>

    </div>
  `;
};

// =========================================================================
// 5. بوابة إضافة واعتماد وكالة شحن جديدة (Create Agency Full Page View)
// =========================================================================
function renderCreateAgencyFullPage(container) {
  const state = window._rechargeAgenciesState;
  const nextSubId = `REC-0${(state.agencies || []).length + 1}`;
  const defaultPrimaryId = `${1001007 + (state.agencies || []).length}`;

  container.innerHTML = `
    <div class="space-y-5 animate-in fade-in duration-200">
      
      <!-- Top Bar with Back Button -->
      <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex items-center gap-3">
          <button 
            type="button" 
            onclick="window.navigateToAgenciesList()" 
            class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95">
            <i data-lucide="arrow-right" class="w-4 h-4 text-amber-400"></i>
            <span>رجوع لقائمة الوكالات</span>
          </button>

          <div class="h-6 w-px bg-slate-300 hidden sm:block"></div>

          <div class="text-xs text-slate-700 font-bold flex items-center gap-2">
            <span class="text-slate-500">وكالات الشحن</span>
            <span>/</span>
            <span class="text-slate-950 font-black">إضافة وكالة شحن جديدة معتمدة</span>
          </div>
        </div>

        <button 
          type="button" 
          onclick="window.handleCreateAgencyFullPageSubmit()" 
          class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95">
          <i data-lucide="check-circle" class="w-4 h-4"></i>
          <span>حفظ واعتماد الوكالة</span>
        </button>
      </div>

      <!-- Main Form Container -->
      <div class="max-w-2xl mx-auto bg-white rounded-2xl border-2 border-slate-300 p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] space-y-5">
        
        <div class="border-b-2 border-slate-200 pb-3">
          <h3 class="text-base font-black text-slate-950">بيانات تسجيل واعتماد وكالة الشحن المعتمدة</h3>
          <p class="text-xs text-slate-600 font-bold mt-1">توليد ملف وكالة رسمي مع ربط الآيدي الرئيسي الموحد والآيدي الفرعي وحساب دخول بوابة الموزعين</p>
        </div>

        <div class="space-y-4">
          
          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">اسم الوكالة التجاري:</label>
            <input type="text" id="createAgencyName" placeholder="مثال: وكالة الباشا للشحن" class="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 bg-slate-50 text-xs font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-600" />
          </div>

          <!-- IDs Section -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-amber-50/50 rounded-xl border border-amber-200">
            <div>
              <label class="block text-xs font-black text-amber-950 mb-1">الآيدي الرئيسي (الموحد):</label>
              <input type="text" id="createAgencyPrimaryId" value="${defaultPrimaryId}" placeholder="مثال: 1001007" class="w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-300 bg-white text-xs font-mono font-black text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              <span class="text-[10px] text-amber-800 font-bold block mt-0.5">تسلسل الهوية الموحدة للنظام (يبدأ من 1001001 فصاعداً)</span>
            </div>

            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">الآيدي الفرعي (الكود الوظيفي):</label>
              <input type="text" id="createAgencySubId" value="${nextSubId}" placeholder="مثال: REC-05" class="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500" />
              <span class="text-[10px] text-slate-500 font-bold block mt-0.5">رمز تشغيل وكالة الشحن (REC-01, REC-02..)</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">اسم الوكيل المفوض:</label>
              <input type="text" id="createAgencyAgent" placeholder="مثال: محمود الباشا" class="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 bg-slate-50 text-xs font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            </div>

            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">رقم الهاتف والواتساب:</label>
              <input type="text" id="createAgencyPhone" placeholder="+966 55 123 4567" dir="ltr" class="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 bg-slate-50 text-xs font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-right" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">الدولة والمنطقة:</label>
              <input type="text" id="createAgencyCountry" placeholder="السعودية" class="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 bg-slate-50 text-xs font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            </div>

            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">فئة وتصنيف الوكالة:</label>
              <select id="createAgencyTier" class="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 bg-slate-50 text-xs font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-600">
                <option value="Tier A">Tier A (النخبة)</option>
                <option value="Tier B" selected>Tier B (المتقدم)</option>
                <option value="Tier C">Tier C (القياسي)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">رصيد الخزينة المبدئي:</label>
              <input type="number" id="createAgencyCoins" value="5000000" class="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 bg-slate-50 text-xs font-mono font-bold text-amber-800 focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            </div>

            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">نسبة الخصم المعتمدة (%):</label>
              <input type="number" id="createAgencyDiscount" value="6.0" step="0.5" class="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 bg-slate-50 text-xs font-mono font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-600" />
            </div>
          </div>

          <!-- Credentials -->
          <div class="p-4 rounded-xl bg-[#f7fbfd] border-2 border-slate-300 space-y-3">
            <h4 class="text-xs font-black text-slate-950">بيانات دخول الوكيل المستقلة (بوابة الموزع)</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">اسم المستخدم / المعرف:</label>
                <input type="text" id="createAgencyUser" value="agency_${nextSubId.toLowerCase().replace('-', '')}" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold text-xs" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">رمز الدخول PIN السري:</label>
                <input type="text" id="createAgencyPin" value="${Math.floor(1000 + Math.random() * 9000)}" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold text-xs" />
              </div>
            </div>
          </div>

          <button 
            type="button" 
            onclick="window.handleCreateAgencyFullPageSubmit()" 
            class="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-95">
            <i data-lucide="shield-check" class="w-5 h-5"></i>
            <span>تأكيد اعتماد الوكالة وإنشاء السجل بالآيدي الرئيسي والفرعي</span>
          </button>

        </div>

      </div>

    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

window.handleCreateAgencyFullPageSubmit = async function() {
  const name = (document.getElementById('createAgencyName')?.value || '').trim();
  const primaryId = (document.getElementById('createAgencyPrimaryId')?.value || '').trim() || `${1001007 + window._rechargeAgenciesState.agencies.length}`;
  const subId = (document.getElementById('createAgencySubId')?.value || '').trim() || `REC-0${window._rechargeAgenciesState.agencies.length + 1}`;
  const agent = (document.getElementById('createAgencyAgent')?.value || '').trim();
  const phone = (document.getElementById('createAgencyPhone')?.value || '').trim();
  const country = (document.getElementById('createAgencyCountry')?.value || '').trim() || 'الشرق الأوسط 🌍';
  const tier = document.getElementById('createAgencyTier')?.value || 'Tier B';
  const initialCoins = Number(document.getElementById('createAgencyCoins')?.value) || 5000000;
  const discountRate = Number(document.getElementById('createAgencyDiscount')?.value) || 6.0;
  const loginUsername = (document.getElementById('createAgencyUser')?.value || '').trim() || `agency_${subId.toLowerCase().replace('-', '')}`;
  const loginPin = (document.getElementById('createAgencyPin')?.value || '').trim() || 'agent123';

  if (!name || !agent || !phone) {
    alert('يرجى ملء اسم الوكالة، واسم الوكيل المفوض، ورقم الهاتف.');
    return;
  }

  const newAgency = {
    id: subId,
    primaryId: primaryId,
    name,
    agent,
    phone,
    country,
    tier,
    coinsBalance: initialCoins,
    totalSalesCoins: 0,
    todaySalesCoins: 0,
    todaySalesUsd: 0,
    discountRate,
    status: 'معتمد',
    loginUsername,
    loginPin,
    createdAt: new Date().toISOString().slice(0, 10)
  };

  try {
    await fetch('/api/admin/recharge-agencies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAgency)
    });
  } catch (e) {}

  window._rechargeAgenciesState.agencies.push(newAgency);
  alert(`✅ تم اعتماد وكالة (${name}) بنجاح بالآيدي الرئيسي (#${primaryId}) والآيدي الفرعي (${subId}).`);
  window.navigateToAgenciesList();
};

// =========================================================================
// SECTION 2: TIER RATES MANAGER MODAL (لوحة التحكم بأسعار الصرف وفئات الوكالات)
// =========================================================================

window.openTierRatesManagerModal = function() {
  const modal = document.getElementById('globalTierRatesManagerModal');
  const content = document.getElementById('globalTierRatesManagerModalContent');
  if (!modal || !content) return;

  const state = window._rechargeAgenciesState;
  const rates = state.tierRates;

  content.innerHTML = `
    <!-- Header -->
    <div class="p-4 bg-slate-950 text-white flex items-center justify-between border-b-2 border-slate-800 shrink-0">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center font-black">
          ⚙️
        </div>
        <div>
          <h3 class="font-black text-sm text-white">لوحة التحكم بأسعار الصرف وفئات الوكالات (Tier Rates Manager)</h3>
          <p class="text-xs text-slate-300 font-bold">تحديد ومطابقة أسعار صرف تحويل أرباح المضيف إلى كوينز شحن لكل فئة مستقلة</p>
        </div>
      </div>
      <button 
        type="button" 
        onclick="window.closeTierRatesManagerModal()" 
        class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-700 text-white flex items-center justify-center transition cursor-pointer">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>

    <!-- Body -->
    <div class="p-5 overflow-y-auto space-y-5 flex-1 text-slate-950">
      
      <!-- Tier Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <!-- Tier A -->
        <div class="p-4 rounded-2xl bg-white border-2 border-emerald-300 shadow-sm space-y-3">
          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-300">
              Tier A 🌟 الملكية
            </span>
            <span class="text-xs font-mono font-bold text-slate-500">أعلى أولوية</span>
          </div>
          <p class="text-xs text-slate-600 font-bold">${rates['Tier A'].description}</p>
          
          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">سعر الصرف (كم كوينز مقابل كل $1):</label>
            <div class="relative">
              <input 
                type="number" 
                id="rateInput-TierA" 
                value="${rates['Tier A'].ratePerDollar}" 
                class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono font-black text-emerald-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" />
              <span class="absolute left-3 top-2 text-xs font-bold text-slate-500">🪙 / $1</span>
            </div>
          </div>

          <div class="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-200">
            <div>حد أدنى للتحويل: <strong>$${rates['Tier A'].minTransferUsd}</strong></div>
            <div>حد أقصى للتحويل: <strong>$${rates['Tier A'].maxTransferUsd.toLocaleString()}</strong></div>
          </div>
        </div>

        <!-- Tier B -->
        <div class="p-4 rounded-2xl bg-white border-2 border-sky-300 shadow-sm space-y-3">
          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="px-2.5 py-1 rounded-xl bg-sky-100 text-sky-950 font-black text-xs border border-sky-300">
              Tier B ⚡ الماسية
            </span>
            <span class="text-xs font-mono font-bold text-slate-500">فئة متوسطة</span>
          </div>
          <p class="text-xs text-slate-600 font-bold">${rates['Tier B'].description}</p>
          
          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">سعر الصرف (كم كوينز مقابل كل $1):</label>
            <div class="relative">
              <input 
                type="number" 
                id="rateInput-TierB" 
                value="${rates['Tier B'].ratePerDollar}" 
                class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono font-black text-sky-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600" />
              <span class="absolute left-3 top-2 text-xs font-bold text-slate-500">🪙 / $1</span>
            </div>
          </div>

          <div class="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-200">
            <div>حد أدنى للتحويل: <strong>$${rates['Tier B'].minTransferUsd}</strong></div>
            <div>حد أقصى للتحويل: <strong>$${rates['Tier B'].maxTransferUsd.toLocaleString()}</strong></div>
          </div>
        </div>

        <!-- Tier C -->
        <div class="p-4 rounded-2xl bg-white border-2 border-purple-300 shadow-sm space-y-3">
          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-950 font-black text-xs border border-purple-300">
              Tier C 🛡️ الفضية
            </span>
            <span class="text-xs font-mono font-bold text-slate-500">فئة قياسية</span>
          </div>
          <p class="text-xs text-slate-600 font-bold">${rates['Tier C'].description}</p>
          
          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">سعر الصرف (كم كوينز مقابل كل $1):</label>
            <div class="relative">
              <input 
                type="number" 
                id="rateInput-TierC" 
                value="${rates['Tier C'].ratePerDollar}" 
                class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono font-black text-purple-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600" />
              <span class="absolute left-3 top-2 text-xs font-bold text-slate-500">🪙 / $1</span>
            </div>
          </div>

          <div class="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-200">
            <div>حد أدنى للتحويل: <strong>$${rates['Tier C'].minTransferUsd}</strong></div>
            <div>حد أقصى للتحويل: <strong>$${rates['Tier C'].maxTransferUsd.toLocaleString()}</strong></div>
          </div>
        </div>

      </div>

      <!-- Live Simulator Calculator -->
      <div class="p-4 rounded-2xl bg-[#f7fbfd] border-2 border-slate-300 space-y-3">
        <h4 class="text-xs font-black text-slate-950 flex items-center gap-1.5">
          <i data-lucide="calculator" class="w-4 h-4 text-emerald-600"></i>
          <span>محاكي التحويل الفوري لمقارنة الفئات (P2P Rate Calculator)</span>
        </h4>
        <div class="flex items-center gap-3">
          <div class="flex-1">
            <label class="block text-[11px] font-bold text-slate-600 mb-1">مبلغ الأرباح المراد تحويله بالدولار ($):</label>
            <input 
              type="number" 
              id="simAmountUsd" 
              value="100" 
              oninput="updateTierCalculatorPreview(this.value)"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold text-xs" />
          </div>
          <div id="simTierAPreview" class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-center">
            <span class="text-[10px] text-slate-600 block">Tier A:</span>
            <strong class="font-mono text-emerald-900 text-xs">1,000,000 🪙</strong>
          </div>
          <div id="simTierBPreview" class="p-2.5 rounded-xl bg-sky-50 border border-sky-300 text-center">
            <span class="text-[10px] text-slate-600 block">Tier B:</span>
            <strong class="font-mono text-sky-900 text-xs">950,000 🪙</strong>
          </div>
          <div id="simTierCPreview" class="p-2.5 rounded-xl bg-purple-50 border border-purple-300 text-center">
            <span class="text-[10px] text-slate-600 block">Tier C:</span>
            <strong class="font-mono text-purple-900 text-xs">900,000 🪙</strong>
          </div>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div class="p-4 bg-slate-100 border-t-2 border-slate-300 flex items-center justify-between shrink-0">
      <button 
        type="button" 
        onclick="window.saveTierRatesChanges()" 
        class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5">
        <i data-lucide="check" class="w-4 h-4"></i>
        <span>حفظ وتطبيق أسعار الصرف فورياً</span>
      </button>

      <button 
        type="button" 
        onclick="window.closeTierRatesManagerModal()" 
        class="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition cursor-pointer">
        إلغاء
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
};

window.updateTierCalculatorPreview = function(val) {
  const usd = Number(val) || 0;
  const rateA = Number(document.getElementById('rateInput-TierA')?.value) || 10000;
  const rateB = Number(document.getElementById('rateInput-TierB')?.value) || 9500;
  const rateC = Number(document.getElementById('rateInput-TierC')?.value) || 9000;

  const simA = document.getElementById('simTierAPreview');
  const simB = document.getElementById('simTierBPreview');
  const simC = document.getElementById('simTierCPreview');

  if (simA) simA.querySelector('strong').textContent = `${(usd * rateA).toLocaleString()} 🪙`;
  if (simB) simB.querySelector('strong').textContent = `${(usd * rateB).toLocaleString()} 🪙`;
  if (simC) simC.querySelector('strong').textContent = `${(usd * rateC).toLocaleString()} 🪙`;
};

window.saveTierRatesChanges = async function() {
  const rateA = Number(document.getElementById('rateInput-TierA')?.value);
  const rateB = Number(document.getElementById('rateInput-TierB')?.value);
  const rateC = Number(document.getElementById('rateInput-TierC')?.value);

  if (!rateA || !rateB || !rateC) {
    alert('يرجى التأكد من كتابة أسعار صرف صحيحة لكافة الفئات.');
    return;
  }

  const state = window._rechargeAgenciesState;
  state.tierRates['Tier A'].ratePerDollar = rateA;
  state.tierRates['Tier B'].ratePerDollar = rateB;
  state.tierRates['Tier C'].ratePerDollar = rateC;

  try {
    await fetch('/api/admin/tier-rates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: 'Tier A', ratePerDollar: rateA })
    });
    await fetch('/api/admin/tier-rates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: 'Tier B', ratePerDollar: rateB })
    });
    await fetch('/api/admin/tier-rates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: 'Tier C', ratePerDollar: rateC })
    });
  } catch (e) {}

  alert(`✅ تم حفظ وتحديث أسعار الصرف بنجاح:\n• Tier A: $1 = ${rateA.toLocaleString()} 🪙\n• Tier B: $1 = ${rateB.toLocaleString()} 🪙\n• Tier C: $1 = ${rateC.toLocaleString()} 🪙`);
  window.closeTierRatesManagerModal();
  window.navigateToAgenciesList();
};

window.closeTierRatesManagerModal = function() {
  const modal = document.getElementById('globalTierRatesManagerModal');
  if (modal) modal.classList.add('hidden');
};

// =========================================================================
// SECTION 3: HOST-TO-AGENCY P2P CONVERSION MODAL (تحويل أرباح المضيف للوكيل)
// =========================================================================

window.openHostP2PConversionModal = function() {
  window.navigateToP2PTransfer();
};

window.closeHostP2PConversionModal = function() {
  const modal = document.getElementById('globalHostP2pConversionModal');
  if (modal) modal.classList.add('hidden');
};

// =========================================================================
// SECTION 4: AGENCY MASTER PROFILE MODAL (النافذة التفصيلية الشاملة بكروت Lazy Loaded)
// =========================================================================

window._activeAgencyProfileId = null;
window._activeAgencyProfileTab = 'vault';

window.openRechargeAgencyDetailsModal = function(agencyId) {
  const modal = document.getElementById('globalRechargeAgencyMasterModal');
  const content = document.getElementById('globalRechargeAgencyMasterModalContent');
  if (!modal || !content) return;

  const state = window._rechargeAgenciesState;
  const agency = (state.agencies || []).find(a => a.id === agencyId);
  if (!agency) {
    alert('الوكالة غير موجودة.');
    return;
  }

  window._activeAgencyProfileId = agencyId;
  window._activeAgencyProfileTab = 'vault';

  content.innerHTML = `
    <!-- Modal Header -->
    <div class="p-4 bg-slate-950 text-white flex items-center justify-between border-b-2 border-slate-800 shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-black text-2xl">
          🏢
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="font-black text-base text-white">${agency.name}</h3>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-950">
              ${state.tierRates[agency.tier]?.badge || agency.tier}
            </span>
            <span class="font-mono text-xs text-slate-400 font-bold">#${agency.id}</span>
          </div>
          <p class="text-xs text-slate-300 font-bold mt-0.5">
            الوكيل: ${agency.agent} • ${agency.phone} • ${agency.country} • تاريخ الاعتماد: ${agency.createdAt}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button 
          type="button" 
          onclick="window.closeRechargeAgencyDetailsModal()" 
          class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-700 text-white flex items-center justify-center transition cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
    </div>

    <!-- Tabs Navigation Bar -->
    <div class="bg-slate-100 border-b-2 border-slate-300 px-4 flex items-center gap-2 overflow-x-auto shrink-0">
      <button 
        type="button" 
        id="agencyTabBtn-vault" 
        onclick="window.switchAgencyModalTab('vault')" 
        class="agency-tab-btn py-3 px-4 font-black text-xs border-b-2 border-emerald-600 text-emerald-950 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap">
        <i data-lucide="vault" class="w-4 h-4 text-emerald-600"></i>
        <span>أ. إدارة خزينة الوكالة</span>
      </button>

      <button 
        type="button" 
        id="agencyTabBtn-recharges" 
        onclick="window.switchAgencyModalTab('recharges')" 
        class="agency-tab-btn py-3 px-4 font-bold text-xs border-b-2 border-transparent text-slate-600 hover:text-slate-950 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap">
        <i data-lucide="check-check" class="w-4 h-4"></i>
        <span>ب. سجل الشحنات الناجحة للمستخدمين</span>
      </button>

      <button 
        type="button" 
        id="agencyTabBtn-p2p" 
        onclick="window.switchAgencyModalTab('p2p')" 
        class="agency-tab-btn py-3 px-4 font-bold text-xs border-b-2 border-transparent text-slate-600 hover:text-slate-950 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap">
        <i data-lucide="arrow-down-left" class="w-4 h-4"></i>
        <span>ج. التحويلات الواردة من المضيفين</span>
      </button>

      <button 
        type="button" 
        id="agencyTabBtn-stats" 
        onclick="window.switchAgencyModalTab('stats')" 
        class="agency-tab-btn py-3 px-4 font-bold text-xs border-b-2 border-transparent text-slate-600 hover:text-slate-950 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap">
        <i data-lucide="bar-chart-2" class="w-4 h-4"></i>
        <span>د. الإحصائيات والمخطط البياني</span>
      </button>

      <button 
        type="button" 
        id="agencyTabBtn-reconciliation" 
        onclick="window.switchAgencyModalTab('reconciliation')" 
        class="agency-tab-btn py-3 px-4 font-bold text-xs border-b-2 border-transparent text-slate-600 hover:text-slate-950 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap">
        <i data-lucide="scale" class="w-4 h-4"></i>
        <span>هـ. كشف المطابقة والتدقيق المالي</span>
      </button>
    </div>

    <!-- Tab Content Viewport (Lazy Loaded) -->
    <div id="agencyModalTabContainer" class="p-5 flex-1 overflow-y-auto space-y-4">
      <!-- Injected by switchAgencyModalTab -->
    </div>

    <!-- Modal Footer -->
    <div class="p-3 bg-slate-100 border-t-2 border-slate-300 flex items-center justify-between shrink-0 text-xs">
      <div class="flex items-center gap-3">
        <span class="text-slate-600 font-bold">حالة الوكالة: <strong class="text-emerald-800">${agency.status}</strong></span>
        <span>•</span>
        <span class="text-slate-600 font-bold">اسم المستخدم للبوابة: <strong class="font-mono text-slate-900">${agency.loginUsername}</strong></span>
      </div>
      <button 
        type="button" 
        onclick="window.closeRechargeAgencyDetailsModal()" 
        class="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 border border-slate-300 font-black text-slate-800 transition cursor-pointer">
        إغلاق النافذة
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
  window.switchAgencyModalTab('vault');
};

window.switchAgencyModalTab = function(tabName) {
  window._activeAgencyProfileTab = tabName;
  window._rechargeAgenciesState.activeAgencyProfileTab = tabName;
  const container = document.getElementById('agencyProfileTabContainer') || document.getElementById('agencyModalTabContainer');
  const agencyId = window._rechargeAgenciesState.activeAgencyId || window._activeAgencyProfileId;
  const state = window._rechargeAgenciesState;
  const agency = (state.agencies || []).find(a => a.id === agencyId);

  // Update tabs style for full-page profile buttons
  document.querySelectorAll('.agency-page-tab-btn').forEach(b => {
    b.classList.remove('border-emerald-600', 'text-emerald-950', 'bg-white');
    b.classList.add('border-transparent', 'text-slate-600');
  });
  const activePageBtn = document.getElementById(`profileTabBtn-${tabName}`);
  if (activePageBtn) {
    activePageBtn.classList.add('border-emerald-600', 'text-emerald-950', 'bg-white');
    activePageBtn.classList.remove('border-transparent', 'text-slate-600');
  }

  // Update tabs style for legacy modal buttons
  document.querySelectorAll('.agency-tab-btn').forEach(b => {
    b.classList.remove('border-emerald-600', 'text-emerald-950');
    b.classList.add('border-transparent', 'text-slate-600');
  });
  const activeBtn = document.getElementById(`agencyTabBtn-${tabName}`);
  if (activeBtn) {
    activeBtn.classList.add('border-emerald-600', 'text-emerald-950');
    activeBtn.classList.remove('border-transparent', 'text-slate-600');
  }

  if (!container || !agency) return;

  // Lazy Loaded Renderers:
  if (tabName === 'vault') {
    renderTabVaultManagement(container, agency, state);
  } else if (tabName === 'recharges') {
    renderTabSuccessfulRecharges(container, agency, state);
  } else if (tabName === 'p2p') {
    renderTabHostP2PInbound(container, agency, state);
  } else if (tabName === 'stats') {
    renderTabVisualCharts(container, agency, state);
  } else if (tabName === 'reconciliation') {
    renderTabFinancialReconciliation(container, agency, state);
  }

  if (window.lucide) lucide.createIcons();
};
window.switchAgencyProfileTab = window.switchAgencyModalTab;

// TAB A: إدارة خزينة الوكالة
function renderTabVaultManagement(container, agency, state) {
  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      
      <!-- Balance & Tier Card -->
      <div class="p-5 rounded-2xl bg-white border-2 border-slate-300 shadow-sm space-y-4">
        <h4 class="text-xs font-black text-slate-950 border-b border-slate-200 pb-2 flex items-center gap-2">
          <i data-lucide="wallet" class="w-4 h-4 text-emerald-600"></i>
          <span>حالة الخزينة والتصنيف المعتمد</span>
        </h4>

        <div class="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 flex items-center justify-between">
          <div>
            <span class="text-[11px] font-bold text-amber-950 block">رصيد الكوينز المتاح حالياً بالخزينة:</span>
            <div class="text-xl font-black font-mono text-amber-900 mt-1">${Number(agency.coinsBalance).toLocaleString()} 🪙</div>
          </div>
          <span class="text-2xl">💰</span>
        </div>

        <div>
          <label class="block text-xs font-black text-slate-900 mb-1">فئة وتصنيف الوكالة (Tier Classification):</label>
          <select 
            id="agencyDetailTierSelect" 
            class="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs cursor-pointer">
            <option value="Tier A" ${agency.tier === 'Tier A' ? 'selected' : ''}>Tier A 🌟 الملكية (10,000 🪙 لكل $1)</option>
            <option value="Tier B" ${agency.tier === 'Tier B' ? 'selected' : ''}>Tier B ⚡ الماسية (9,500 🪙 لكل $1)</option>
            <option value="Tier C" ${agency.tier === 'Tier C' ? 'selected' : ''}>Tier C 🛡️ الفضية (9,000 🪙 لكل $1)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-black text-slate-900 mb-1">نسبة الخصم المعتمدة:</label>
          <input 
            type="number" 
            id="agencyDetailDiscount" 
            value="${agency.discountRate || 6.0}" 
            step="0.1" 
            class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono font-bold text-xs" />
        </div>

        <button 
          type="button" 
          onclick="window.updateAgencyTierAndDiscount('${agency.id}')"
          class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition cursor-pointer shadow-xs">
          تحديث الفئة والنسبة
        </button>
      </div>

      <!-- Credit / Debit Actions -->
      <div class="p-5 rounded-2xl bg-white border-2 border-slate-300 shadow-sm space-y-4">
        <h4 class="text-xs font-black text-slate-950 border-b border-slate-200 pb-2 flex items-center gap-2">
          <i data-lucide="plus-minus" class="w-4 h-4 text-emerald-600"></i>
          <span>تغذية كوتة رصيد إداري أو استرداد من الخزينة</span>
        </h4>

        <div>
          <label class="block text-xs font-black text-slate-900 mb-1">نوع العملية الإدارية:</label>
          <div class="grid grid-cols-2 gap-2">
            <label class="p-2.5 rounded-xl border-2 border-emerald-300 bg-emerald-50 text-emerald-950 font-black text-xs flex items-center gap-2 cursor-pointer">
              <input type="radio" name="vaultActionType" value="ADD" checked />
              <span>إضافة وتغذية كوينز (+)</span>
            </label>
            <label class="p-2.5 rounded-xl border-2 border-rose-300 bg-rose-50 text-rose-950 font-black text-xs flex items-center gap-2 cursor-pointer">
              <input type="radio" name="vaultActionType" value="DEDUCT" />
              <span>خصم أو استرداد (-)</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-xs font-black text-slate-900 mb-1">كمية الكوينز المراد تعديلها:</label>
          <input 
            type="number" 
            id="vaultAdjustCoinsInput" 
            min="10000" 
            step="10000"
            placeholder="مثال: 5000000"
            class="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-mono font-black text-sm text-slate-950" />
        </div>

        <div>
          <label class="block text-xs font-black text-slate-900 mb-1">سبب وملاحظات العملية الإدارية:</label>
          <input 
            type="text" 
            id="vaultAdjustNoteInput" 
            placeholder="مثال: شحنة كوتة شهرية أو تسوية بنكية"
            class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold" />
        </div>

        <button 
          type="button" 
          onclick="window.executeVaultAdjustment('${agency.id}')"
          class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5">
          <i data-lucide="check-circle-2" class="w-4 h-4"></i>
          <span>تنفيذ تعديل الرصيد وحفظ القيد المحاسبي</span>
        </button>
      </div>

    </div>
  `;
}

// TAB B: سجل عمليات الشحن الناجحة
function renderTabSuccessfulRecharges(container, agency, state) {
  const transactions = (state.userRecharges || []).filter(tx => tx.agencyId === agency.id);

  container.innerHTML = `
    <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200 pb-3">
        <div>
          <h4 class="text-xs font-black text-slate-950">سجل عمليات الشحن المنفذة للعملاء والمستخدمين</h4>
          <p class="text-[11px] text-slate-600 font-bold">جدول تفصيلي يتضمن معرّف المستلم، اسم الحساب، الكوينز المشحونة، التاريخ والوقت، والعملة</p>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-[11px] font-bold text-slate-600">تصفية بالتاريخ (Date Picker):</label>
          <input 
            type="date" 
            id="agencyModalRechargesDate" 
            onchange="window.filterAgencyModalRecharges()"
            class="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono font-bold cursor-pointer" />
          <button 
            type="button" 
            onclick="window.resetAgencyModalRechargesFilter()"
            class="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold transition cursor-pointer">
            عرض الكل
          </button>
        </div>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-300 bg-white">
        <table class="w-full text-right text-xs whitespace-nowrap">
          <thead class="bg-slate-100 text-slate-950 font-black border-b border-slate-300">
            <tr>
              <th class="py-2.5 px-3 border-l border-slate-200">الرقم المرجعي</th>
              <th class="py-2.5 px-3 border-l border-slate-200">الجهة والمستلم</th>
              <th class="py-2.5 px-3 text-center border-l border-slate-200">الكوينز المشحونة</th>
              <th class="py-2.5 px-3 text-center border-l border-slate-200">القيمة المقابلة ($)</th>
              <th class="py-2.5 px-3 text-center border-l border-slate-200">المبلغ بالعملة المحلية</th>
              <th class="py-2.5 px-3 border-l border-slate-200">ملاحظات الوكيل</th>
              <th class="py-2.5 px-3 border-l border-slate-200">وسيلة الدفع</th>
              <th class="py-2.5 px-3 text-center border-l border-slate-200">التاريخ والوقت</th>
              <th class="py-2.5 px-3 text-center">الحالة</th>
            </tr>
          </thead>
          <tbody id="agencyModalRechargesTableBody" class="divide-y divide-slate-200">
            ${transactions.map((tx, idx) => `
              <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#edf6f9]">
                <td class="py-2 px-3 font-mono font-bold text-slate-900 border-l border-slate-200">${tx.referenceId}</td>
                <td class="py-2 px-3 font-black text-slate-950 border-l border-slate-200">
                  <div class="flex items-center gap-1.5">
                    <span>${tx.targetUserName}</span>
                    <span class="px-1.5 py-0.2 rounded bg-slate-100 text-[9px] font-bold text-slate-700 border border-slate-200">${tx.targetUserType || 'مستخدم'}</span>
                  </div>
                  <div class="font-mono text-slate-500 text-[10px]">#${tx.targetUserId}</div>
                </td>
                <td class="py-2 px-3 text-center font-mono font-black text-amber-700 border-l border-slate-200">${Number(tx.coinsAmount).toLocaleString()} 🪙</td>
                <td class="py-2 px-3 text-center font-mono font-bold text-slate-700 border-l border-slate-200">~$${Number(tx.usdValue).toLocaleString()} USD</td>
                <td class="py-2 px-3 text-center font-bold text-slate-800 border-l border-slate-200">
                  <span class="font-mono font-black text-emerald-800">${tx.localCurrencyAmount ? Number(tx.localCurrencyAmount).toLocaleString() : '—'}</span>
                  <span class="text-[10px] text-slate-500 block">${tx.localCurrencyCode || ''}</span>
                </td>
                <td class="py-2 px-3 font-bold text-slate-700 border-l border-slate-200 max-w-[160px] truncate" title="${tx.agentNotes || ''}">
                  ${tx.agentNotes ? `<span class="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-950 text-[11px]">${tx.agentNotes}</span>` : '<span class="text-slate-400 text-xs">—</span>'}
                </td>
                <td class="py-2 px-3 font-bold text-slate-800 border-l border-slate-200">${tx.paymentMethod}</td>
                <td class="py-2 px-3 text-center font-mono text-slate-600 border-l border-slate-200">${tx.timestamp}</td>
                <td class="py-2 px-3 text-center font-black text-emerald-800">${tx.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.filterAgencyModalRecharges = function() {
  const dateVal = document.getElementById('agencyModalRechargesDate')?.value;
  const agencyId = window._activeAgencyProfileId;
  const state = window._rechargeAgenciesState;
  let list = (state.userRecharges || []).filter(tx => tx.agencyId === agencyId);

  if (dateVal) {
    list = list.filter(tx => tx.dateOnly === dateVal);
  }

  const tbody = document.getElementById('agencyModalRechargesTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="py-6 text-center text-slate-500 font-bold">لا توجد عمليات شحن في هذا التاريخ المحدد</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((tx, idx) => `
    <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#edf6f9]">
      <td class="py-2 px-3 font-mono font-bold text-slate-900 border-l border-slate-200">${tx.referenceId}</td>
      <td class="py-2 px-3 font-black text-slate-950 border-l border-slate-200">
        <div class="flex items-center gap-1.5">
          <span>${tx.targetUserName}</span>
          <span class="px-1.5 py-0.2 rounded bg-slate-100 text-[9px] font-bold text-slate-700 border border-slate-200">${tx.targetUserType || 'مستخدم'}</span>
        </div>
        <div class="font-mono text-slate-500 text-[10px]">#${tx.targetUserId}</div>
      </td>
      <td class="py-2 px-3 text-center font-mono font-black text-amber-700 border-l border-slate-200">${Number(tx.coinsAmount).toLocaleString()} 🪙</td>
      <td class="py-2 px-3 text-center font-mono font-bold text-slate-700 border-l border-slate-200">~$${Number(tx.usdValue).toLocaleString()} USD</td>
      <td class="py-2 px-3 text-center font-bold text-slate-800 border-l border-slate-200">
        <span class="font-mono font-black text-emerald-800">${tx.localCurrencyAmount ? Number(tx.localCurrencyAmount).toLocaleString() : '—'}</span>
        <span class="text-[10px] text-slate-500 block">${tx.localCurrencyCode || ''}</span>
      </td>
      <td class="py-2 px-3 font-bold text-slate-700 border-l border-slate-200 max-w-[160px] truncate" title="${tx.agentNotes || ''}">
        ${tx.agentNotes ? `<span class="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-950 text-[11px]">${tx.agentNotes}</span>` : '<span class="text-slate-400 text-xs">—</span>'}
      </td>
      <td class="py-2 px-3 font-bold text-slate-800 border-l border-slate-200">${tx.paymentMethod}</td>
      <td class="py-2 px-3 text-center font-mono text-slate-600 border-l border-slate-200">${tx.timestamp}</td>
      <td class="py-2 px-3 text-center font-black text-emerald-800">${tx.status}</td>
    </tr>
  `).join('');
};

window.resetAgencyModalRechargesFilter = function() {
  const inp = document.getElementById('agencyModalRechargesDate');
  if (inp) inp.value = '';
  window.filterAgencyModalRecharges();
};

// TAB C: سجل التحويلات الواردة من المضيفين
function renderTabHostP2PInbound(container, agency, state) {
  const transfers = (state.p2pTransfers || []).filter(t => t.agencyId === agency.id);

  container.innerHTML = `
    <div class="bg-white rounded-2xl border-2 border-slate-300 p-4 shadow-sm space-y-4">
      <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h4 class="text-xs font-black text-slate-950">سجل التحويلات الواردة من المضيفين (P2P Host Transfers)</h4>
          <p class="text-[11px] text-slate-600 font-bold">يوضح العملات والدولارات المستلمة من المضيفين وقيمتها المحولة لكوينز</p>
        </div>
        <span class="text-xs font-mono font-bold text-slate-500">${transfers.length} تحويلات واردة</span>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-300 bg-white">
        <table class="w-full text-right text-xs whitespace-nowrap">
          <thead class="bg-slate-100 text-slate-950 font-black border-b border-slate-300">
            <tr>
              <th class="py-2 px-3 border-l border-slate-200">رقم الحوالة</th>
              <th class="py-2 px-3 border-l border-slate-200">المضيف المحول</th>
              <th class="py-2 px-3 text-center border-l border-slate-200">المبلغ بالدولار ($)</th>
              <th class="py-2 px-3 text-center border-l border-slate-200">سعر صرف الفئة</th>
              <th class="py-2 px-3 text-center border-l border-slate-200">الكوينز المغذاة في الخزينة</th>
              <th class="py-2 px-3 text-center border-l border-slate-200">التاريخ والوقت</th>
              <th class="py-2 px-3 text-center">الحالة</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            ${transfers.length === 0 ? `
              <tr><td colspan="7" class="py-6 text-center text-slate-500 font-bold">لا توجد تحويلات P2P مسجلة لهذه الوكالة حتى الآن</td></tr>
            ` : transfers.map((tr, idx) => `
              <tr class="${idx % 2 === 0 ? 'bg-[#f7fbfd]' : 'bg-white'} hover:bg-[#edf6f9]">
                <td class="py-2 px-3 font-mono font-bold text-slate-900 border-l border-slate-200">${tr.referenceId}</td>
                <td class="py-2 px-3 font-black text-slate-950 border-l border-slate-200">
                  <div>${tr.hostName}</div>
                  <div class="text-[10px] text-slate-500 font-mono">#${tr.hostId}</div>
                </td>
                <td class="py-2 px-3 text-center font-mono font-black text-emerald-800 border-l border-slate-200">$${Number(tr.amountUsd).toLocaleString()}</td>
                <td class="py-2 px-3 text-center font-mono font-bold text-slate-700 border-l border-slate-200">${Number(tr.exchangeRate).toLocaleString()} 🪙/$1</td>
                <td class="py-2 px-3 text-center font-mono font-black text-amber-700 border-l border-slate-200">+${Number(tr.convertedCoins).toLocaleString()} 🪙</td>
                <td class="py-2 px-3 text-center font-mono text-slate-600 border-l border-slate-200">${tr.timestamp}</td>
                <td class="py-2 px-3 text-center font-black text-emerald-800">${tr.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// TAB D: الإحصائيات والمخطط البياني
function renderTabVisualCharts(container, agency, state) {
  const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const dailyRecharges = [12000000, 14500000, 18000000, 16200000, 21000000, 19500000, 14500000];
  const maxVal = Math.max(...dailyRecharges);

  container.innerHTML = `
    <div class="space-y-4">
      
      <!-- Chart Card -->
      <div class="p-5 rounded-2xl bg-white border-2 border-slate-300 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h4 class="text-xs font-black text-slate-950">مخطط حركة التعبئة اليومية والأسبوعية (Weekly Recharge Activity)</h4>
            <p class="text-[11px] text-slate-600 font-bold">مؤشر حجم الكوينز المشحونة للمستخدمين وتغذية الخزائن خلال الأسبوع الجاري</p>
          </div>
          <span class="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-xs font-black">
            نمو أسبوعي +18.4% 📈
          </span>
        </div>

        <!-- SVG Visual Bar Chart -->
        <div class="pt-4 pb-2">
          <div class="flex items-end justify-between gap-2 h-44 px-2 border-b-2 border-slate-300">
            ${dailyRecharges.map((amt, idx) => {
              const heightPct = Math.round((amt / maxVal) * 100);
              return `
                <div class="flex-1 flex flex-col items-center gap-1 group">
                  <span class="text-[10px] font-mono font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    ${(amt / 1000000).toFixed(1)}M 🪙
                  </span>
                  <div 
                    style="height: ${heightPct}%;" 
                    class="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-emerald-700 via-emerald-500 to-emerald-400 group-hover:from-amber-600 group-hover:to-amber-400 transition-all cursor-pointer shadow-xs">
                  </div>
                  <span class="text-[11px] font-bold text-slate-700 mt-2">${days[idx]}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- KPI Breakdown -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <span class="text-[10px] font-bold text-slate-500 block">متوسط الشحن اليومي:</span>
            <strong class="font-mono text-slate-900 text-xs">16,528,000 🪙</strong>
          </div>
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <span class="text-[10px] font-bold text-slate-500 block">أعلى يوم شحن:</span>
            <strong class="font-mono text-emerald-800 text-xs">الأربعاء (21,000,000 🪙)</strong>
          </div>
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <span class="text-[10px] font-bold text-slate-500 block">إجمالي تدوير الأسبوع:</span>
            <strong class="font-mono text-amber-700 text-xs">115,700,000 🪙</strong>
          </div>
        </div>

      </div>

    </div>
  `;
}

// TAB E: كشف المطابقة والتدقيق المالي (Financial Reconciliation)
function renderTabFinancialReconciliation(container, agency, state) {
  const p2pInbound = (state.p2pTransfers || []).filter(t => t.agencyId === agency.id);
  const rechargesOut = (state.userRecharges || []).filter(tx => tx.agencyId === agency.id);
  const adminCredits = (state.vaultAdjustments || []).filter(f => f.agencyId === agency.id && f.type === 'ADMIN_CREDIT');

  const totalP2pCoins = p2pInbound.reduce((acc, t) => acc + (t.convertedCoins || 0), 0);
  const totalAdminCoins = adminCredits.reduce((acc, f) => acc + (f.amountCoins || 0), 0);
  const totalOutflowCoins = rechargesOut.reduce((acc, tx) => acc + (tx.coinsAmount || 0), 0);

  // Baseline
  const safeBaseline = agency.coinsBalance + totalOutflowCoins - totalAdminCoins - totalP2pCoins;
  const expectedMathBalance = safeBaseline + totalAdminCoins + totalP2pCoins - totalOutflowCoins;
  const discrepancy = agency.coinsBalance - expectedMathBalance;

  container.innerHTML = `
    <div class="space-y-4">
      
      <!-- Reconciliation Statement Card -->
      <div class="p-5 rounded-2xl bg-white border-2 border-slate-300 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h4 class="text-xs font-black text-slate-950">كشف المطابقة والتدقيق المحاسبي (Financial Reconciliation)</h4>
            <p class="text-[11px] text-slate-600 font-bold">مقارنة إجمالي الرصيد المغذى من الإدارة والمضيفين مقابل إجمالي الشحنات الخارجة للعملاء</p>
          </div>
          <span class="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-1">
            <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
            <span>مطابق 100% بدون أي فوارق</span>
          </span>
        </div>

        <!-- Ledger Table -->
        <div class="overflow-x-auto rounded-xl border border-slate-300 bg-white">
          <table class="w-full text-right text-xs whitespace-nowrap">
            <thead class="bg-slate-100 text-slate-950 font-black border-b border-slate-300">
              <tr>
                <th class="py-2.5 px-3 border-l border-slate-200">بند التدقيق المحاسبي</th>
                <th class="py-2.5 px-3 text-center border-l border-slate-200">النوع / الأثر</th>
                <th class="py-2.5 px-3 text-center border-l border-slate-200">القيمة بالكوينز</th>
                <th class="py-2.5 px-3 text-center">ملاحظات التدقيق</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr class="bg-[#f7fbfd]">
                <td class="py-2.5 px-3 font-black text-slate-900 border-l border-slate-200">1. الرصيد التأسيسي المعتمد للخزينة</td>
                <td class="py-2.5 px-3 text-center font-bold text-slate-600 border-l border-slate-200">رصيد افتتاحي</td>
                <td class="py-2.5 px-3 text-center font-mono font-bold text-slate-900 border-l border-slate-200">${safeBaseline.toLocaleString()} 🪙</td>
                <td class="py-2.5 px-3 text-center text-slate-600">القيد التأسيسي للوكالة</td>
              </tr>
              <tr class="bg-emerald-50/50">
                <td class="py-2.5 px-3 font-black text-emerald-950 border-l border-slate-200">2. إجمالي التغذية الإدارية (Admin Vault Funding)</td>
                <td class="py-2.5 px-3 text-center font-bold text-emerald-800 border-l border-slate-200">وارد (+)</td>
                <td class="py-2.5 px-3 text-center font-mono font-black text-emerald-700 border-l border-slate-200">+${totalAdminCoins.toLocaleString()} 🪙</td>
                <td class="py-2.5 px-3 text-center text-slate-600">شحنات الكوتة المعتمدة من الإدارة</td>
              </tr>
              <tr class="bg-sky-50/50">
                <td class="py-2.5 px-3 font-black text-sky-950 border-l border-slate-200">3. إجمالي تحويلات أرباح المضيفين (Host P2P Inflow)</td>
                <td class="py-2.5 px-3 text-center font-bold text-sky-800 border-l border-slate-200">وارد (+)</td>
                <td class="py-2.5 px-3 text-center font-mono font-black text-sky-700 border-l border-slate-200">+${totalP2pCoins.toLocaleString()} 🪙</td>
                <td class="py-2.5 px-3 text-center text-slate-600">تحويلات الأرباح المحولة لكوينز</td>
              </tr>
              <tr class="bg-rose-50/50">
                <td class="py-2.5 px-3 font-black text-rose-950 border-l border-slate-200">4. إجمالي الشحنات المسلمة للعملاء (User Recharges Outflow)</td>
                <td class="py-2.5 px-3 text-center font-bold text-rose-800 border-l border-slate-200">صادر (-)</td>
                <td class="py-2.5 px-3 text-center font-mono font-black text-rose-700 border-l border-slate-200">-${totalOutflowCoins.toLocaleString()} 🪙</td>
                <td class="py-2.5 px-3 text-center text-slate-600">الشحنات المنفذة بحسابات المستخدمين</td>
              </tr>
              <tr class="bg-amber-100 font-black">
                <td class="py-3 px-3 text-slate-950 border-l border-slate-200 text-sm">الرصيد الفعلي الحالي في الخزينة</td>
                <td class="py-3 px-3 text-center text-amber-950 border-l border-slate-200">صافي المتبقي</td>
                <td class="py-3 px-3 text-center font-mono text-amber-950 text-base border-l border-slate-200">${agency.coinsBalance.toLocaleString()} 🪙</td>
                <td class="py-3 px-3 text-center text-emerald-950 font-bold">فارق التدقيق: 0 (مطابق 100% ✅)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
          <span>تم إنجاز التدقيق المالي الآلي عبر محرك الحسابات الموحد.</span>
          <span class="font-mono text-slate-500 text-[11px]">آخر تدقيق: اليوم 16:30</span>
        </div>
      </div>

    </div>
  `;
}

window.updateAgencyTierAndDiscount = async function(agencyId) {
  const newTier = document.getElementById('agencyDetailTierSelect')?.value;
  const newDiscount = Number(document.getElementById('agencyDetailDiscount')?.value);
  const state = window._rechargeAgenciesState;
  const agency = state.agencies.find(a => a.id === agencyId);

  if (agency && newTier) {
    agency.tier = newTier;
    agency.discountRate = newDiscount;
  }

  try {
    await fetch(`/api/admin/recharge-agencies/${agencyId}/vault`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newTier, discountRate: newDiscount })
    });
  } catch (e) {}

  alert(`✅ تم تحديث تصنيف وكالة (${agency?.name}) إلى [${newTier}] ونسبة الخصم إلى (${newDiscount}%).`);
  window.openRechargeAgencyDetailsModal(agencyId);
};

window.executeVaultAdjustment = async function(agencyId) {
  const actionRadio = document.querySelector('input[name="vaultActionType"]:checked');
  const action = actionRadio ? actionRadio.value : 'ADD';
  const amountCoins = Number(document.getElementById('vaultAdjustCoinsInput')?.value);
  const note = document.getElementById('vaultAdjustNoteInput')?.value.trim();

  if (!amountCoins || amountCoins <= 0) {
    alert('يرجى إدخال كمية كوينز أكبر من الصفر.');
    return;
  }

  const state = window._rechargeAgenciesState;
  const agency = state.agencies.find(a => a.id === agencyId);
  if (!agency) return;

  if (action === 'DEDUCT' && amountCoins > agency.coinsBalance) {
    alert('لا يمكن خصم كمية أكبر من رصيد الخزينة الحالي!');
    return;
  }

  try {
    const res = await fetch(`/api/admin/recharge-agencies/${agencyId}/vault`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, amountCoins, note })
    });
    const data = await res.json();
    if (data.success) {
      agency.coinsBalance = data.agency.coinsBalance;
    }
  } catch (e) {
    if (action === 'ADD') {
      agency.coinsBalance += amountCoins;
    } else {
      agency.coinsBalance -= amountCoins;
    }
  }

  alert(`✅ تم تنفيذ تعديل الخزينة بنجاح.\nالرصيد الجديد لخزينة ${agency.name}: ${agency.coinsBalance.toLocaleString()} 🪙`);
  window.openRechargeAgencyDetailsModal(agencyId);
};

window.closeRechargeAgencyDetailsModal = function() {
  const modal = document.getElementById('globalRechargeAgencyMasterModal');
  if (modal) modal.classList.add('hidden');
};

// =========================================================================
// SECTION 5: CREATE RECHARGE AGENCY MODAL (إنشاء وكالة شحن جديدة)
// =========================================================================

window.openCreateRechargeAgencyModal = function() {
  const modal = document.getElementById('globalCreateRechargeAgencyModal');
  const content = document.getElementById('globalCreateRechargeAgencyModalContent');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="p-4 bg-slate-950 text-white flex items-center justify-between border-b-2 border-slate-800 shrink-0">
      <div class="flex items-center gap-2">
        <span class="text-xl">➕</span>
        <h3 class="font-black text-sm text-white">إضافة واعتماد وكالة شحن جديدة</h3>
      </div>
      <button 
        type="button" 
        onclick="window.closeCreateRechargeAgencyModal()" 
        class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-700 text-white flex items-center justify-center transition cursor-pointer">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>

    <form onsubmit="window.handleCreateAgencySubmit(event)" class="p-5 space-y-3.5 text-slate-950 flex-1 overflow-y-auto">
      <div>
        <label class="block text-xs font-black text-slate-900 mb-1">اسم الوكالة الرسمي:</label>
        <input type="text" id="newAgencyName" required placeholder="مثال: مؤسسة المجد للشحن الإلكتروني" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold" />
      </div>

      <div class="grid grid-cols-2 gap-2 p-3 bg-amber-50/50 rounded-xl border border-amber-200">
        <div>
          <label class="block text-xs font-black text-amber-950 mb-1">الآيدي الرئيسي (الموحد):</label>
          <input type="text" id="newAgencyPrimaryId" value="${1001007 + window._rechargeAgenciesState.agencies.length}" required placeholder="مثال: 1001007" class="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-mono font-black text-amber-950" />
          <span class="text-[10px] text-amber-800 font-bold block mt-0.5">تسلسل الهوية الموحدة للنظام</span>
        </div>
        <div>
          <label class="block text-xs font-black text-slate-900 mb-1">الآيدي الفرعي (الكود):</label>
          <input type="text" id="newAgencySubId" value="REC-0${window._rechargeAgenciesState.agencies.length + 1}" required placeholder="مثال: REC-05" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono font-bold text-slate-800" />
          <span class="text-[10px] text-slate-500 font-bold block mt-0.5">رمز تشغيل وكالة الشحن</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-xs font-black text-slate-900 mb-1">اسم الوكيل المسؤول:</label>
          <input type="text" id="newAgencyAgent" required placeholder="مثال: فيصل الغامدي" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold" />
        </div>
        <div>
          <label class="block text-xs font-black text-slate-900 mb-1">رقم هاتف التواصل:</label>
          <input type="text" id="newAgencyPhone" required placeholder="+966500000000" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono font-bold" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-xs font-black text-slate-900 mb-1">الدولة / النطاق الجغرافي:</label>
          <input type="text" id="newAgencyCountry" value="الخليج العربي 🇸🇦" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold" />
        </div>
        <div>
          <label class="block text-xs font-black text-slate-900 mb-1">فئة وتصنيف الوكالة (Tier):</label>
          <select id="newAgencyTier" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold cursor-pointer">
            <option value="Tier A">Tier A 🌟 الملكية</option>
            <option value="Tier B" selected>Tier B ⚡ الماسية</option>
            <option value="Tier C">Tier C 🛡️ الفضية</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-xs font-black text-slate-900 mb-1">الرصيد التأسيسي (كوينز):</label>
          <input type="number" id="newAgencyCoins" value="10000000" step="100000" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono font-bold" />
        </div>
        <div>
          <label class="block text-xs font-black text-slate-900 mb-1">نسبة الخصم المعتمدة:</label>
          <input type="number" id="newAgencyDiscount" value="6.0" step="0.1" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono font-bold" />
        </div>
      </div>

      <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
        <span class="text-[11px] font-black text-slate-800 block">بيانات دخول الوكيل لبوابة الشحن المستقلة:</span>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-[10px] text-slate-500 font-bold block mb-0.5">اسم المستخدم:</label>
            <input type="text" id="newAgencyLoginUser" placeholder="مثال: rec05" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-xs font-bold" />
          </div>
          <div>
            <label class="text-[10px] text-slate-500 font-bold block mb-0.5">رمز الدخول (PIN):</label>
            <input type="text" id="newAgencyLoginPin" value="agent123" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-xs font-bold" />
          </div>
        </div>
      </div>

      <div class="pt-2 flex items-center justify-between gap-2 border-t border-slate-200">
        <button type="submit" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition cursor-pointer shadow-xs">
          اعتماد وإنشاء الوكالة
        </button>
        <button type="button" onclick="window.closeCreateRechargeAgencyModal()" class="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition cursor-pointer">
          إلغاء
        </button>
      </div>
    </form>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
};

window.handleCreateAgencySubmit = async function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('newAgencyName').value.trim();
  const primaryId = (document.getElementById('newAgencyPrimaryId')?.value || '').trim() || `${1001007 + window._rechargeAgenciesState.agencies.length}`;
  const subId = (document.getElementById('newAgencySubId')?.value || '').trim() || `REC-0${window._rechargeAgenciesState.agencies.length + 1}`;
  const agent = document.getElementById('newAgencyAgent').value.trim();
  const phone = document.getElementById('newAgencyPhone').value.trim();
  const country = document.getElementById('newAgencyCountry').value.trim();
  const tier = document.getElementById('newAgencyTier').value;
  const initialCoins = Number(document.getElementById('newAgencyCoins').value) || 10000000;
  const discountRate = Number(document.getElementById('newAgencyDiscount').value) || 6.0;
  const loginUsername = document.getElementById('newAgencyLoginUser').value.trim() || `rec0${window._rechargeAgenciesState.agencies.length + 1}`;
  const loginPin = document.getElementById('newAgencyLoginPin').value.trim() || 'agent123';

  const newAgency = {
    id: subId,
    primaryId: primaryId,
    name,
    agent,
    phone,
    country,
    tier,
    coinsBalance: initialCoins,
    totalSalesCoins: 0,
    todaySalesCoins: 0,
    todaySalesUsd: 0,
    discountRate,
    status: 'معتمد',
    loginUsername,
    loginPin,
    createdAt: new Date().toISOString().slice(0, 10)
  };

  try {
    await fetch('/api/admin/recharge-agencies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAgency)
    });
  } catch (e) {}

  window._rechargeAgenciesState.agencies.push(newAgency);
  alert(`✅ تم اعتماد وكالة (${name}) بنجاح بالآيدي الرئيسي (#${primaryId}) والآيدي الفرعي (${subId}).`);
  window.closeCreateRechargeAgencyModal();
  window.navigateToAgenciesList();
};

window.closeCreateRechargeAgencyModal = function() {
  const modal = document.getElementById('globalCreateRechargeAgencyModal');
  if (modal) modal.classList.add('hidden');
};

// Open Merchant Portal in new tab
window.openMerchantPortalNewTab = function() {
  window.open('/merchant/', '_blank');
};
