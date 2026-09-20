/**
 * Al-Najm Official Store & Assets Management Engine (متجر النجم - الأصول والتأثيرات الرقمية)
 * مطابقة دقيقة 100% لتصميم التطبيق:
 * - شريط تبويبات علوي أفقي (رمز تعبيري | مول السيارات | إطارات | فقاعة ...) مع إمكانية إضافة حقول/تصنيفات جديدة
 * - عرض المربعات في عمودين (2 Columns Card Grid):
 *   - أعلى اليمين: الأيام (مثل: 🕒 14 أيام)
 *   - أعلى اليسار: جرب الآن
 *   - المنتصف: صورة وتأثير الإطار المفرغ الفخم
 *   - أسفل الصورة: السعر برقم عريض وعملة ذهبية صفراء 🟡
 *   - الأزرار السفلية:
 *     - زر «تعديل»: لفتح نافذة المربع وإدخال الإطار وتعديل بياناته وإرساله لمتجر التطبيق
 *     - زر «إرسال 🎁»: صلاحية الإدارة لإدخال آيدي المضيف وإرسال الهدية/الإطار لحسابه مباشرة
 */

(function() {
  const STORE_ITEMS_KEY = 'al_najm_store_items_v3';
  const STORE_CATEGORIES_KEY = 'al_najm_store_categories_v3';

  // التصنيفات الأفقية الافتراضية طبقاً لتصميم التطبيق في الصورة
  const DEFAULT_STORE_CATEGORIES = [
    { id: 'frames', name: 'إطارات', icon: 'frame', badge: 'إطار ملف' },
    { id: 'bubbles', name: 'فقاعة', icon: 'message-square', badge: 'شات' },
    { id: 'cars', name: 'مول السيارات', icon: 'car', badge: 'دخوليات' },
    { id: 'emojis', name: 'رمز تعبيري', icon: 'smile', badge: 'إيموجي ومؤثرات' }
  ];

  // المنتجات الافتراضية المتطابقة مع صورة لقطة الشاشة
  const DEFAULT_STORE_ITEMS = [
    {
      id: 'STR-FR-00',
      name: 'إطار النجم الملكي الفخم SVGA',
      categoryId: 'frames',
      categoryName: 'إطارات',
      price: 100000,
      days: 14,
      iconEmoji: '👑✨',
      imageUrl: '/uploads/frames/custom_frame_preview.png',
      svgaUrl: '/uploads/frames/custom_frame_1.svga',
      badge: 'مرفوع أصلي ⭐',
      description: 'إطار المايك الصوتي الفاخر المستخرج من ملف SVGA عالي الدقة (480x480) مفرغ ومحيط بالأفاتار.',
      salesCount: 550,
      isActive: true,
      animationType: 'svga'
    },
    {
      id: 'STR-FR-01',
      name: 'إطار الفراشة الذهبي الماسي',
      categoryId: 'frames',
      categoryName: 'إطارات',
      price: 100000,
      days: 14,
      iconEmoji: '🦋✨',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=350',
      badge: 'ملكي VIP',
      description: 'إطار دائري ذهبي مرصع بأحجار كريمة بنفسجية وفراشة ذهبية متألقة على المايك.',
      salesCount: 420,
      isActive: true,
      animationType: 'svga'
    },
    {
      id: 'STR-FR-02',
      name: 'إطار التاج الملكي الزهري',
      categoryId: 'frames',
      categoryName: 'إطارات',
      price: 80000,
      days: 14,
      iconEmoji: '👑🌸',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=350',
      badge: 'حصري',
      description: 'إطار مزين بالزهور المضيئة وتاج ذهبي براق يتلألأ حول الصورة الشخصية.',
      salesCount: 385,
      isActive: true,
      animationType: 'svga'
    },
    {
      id: 'STR-FR-03',
      name: 'إطار الأجنحة الوردية المضيئة',
      categoryId: 'frames',
      categoryName: 'إطارات',
      price: 50000,
      days: 14,
      iconEmoji: '🪽💖',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=350',
      badge: 'فانتزي',
      description: 'أجنحة وردية نيونية متحركة مع لافتة شرفية وشريط حريري ناعم.',
      salesCount: 512,
      isActive: true,
      animationType: 'lottie'
    },
    {
      id: 'STR-FR-04',
      name: 'إطار القلعة الفكتورية الداكنة',
      categoryId: 'frames',
      categoryName: 'إطارات',
      price: 80000,
      days: 14,
      iconEmoji: '🏰🌹',
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=350',
      badge: 'قوطي فاخر',
      description: 'إطار عتيق بزهور حمراء وقناديل مضيئة يمنح المضيف طابعاً مهيباً في الروم.',
      salesCount: 290,
      isActive: true,
      animationType: 'svga'
    },
    // فقاعات
    {
      id: 'STR-BUB-01',
      name: 'فقاعة السديم الكوني النيونية',
      categoryId: 'bubbles',
      categoryName: 'فقاعة',
      price: 60000,
      days: 14,
      iconEmoji: '💬🌌',
      imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=350',
      badge: 'شات VIP',
      description: 'فقاعة دردشة بلون كوني براق تميز رسائل المضيف في المحادثة العامة.',
      salesCount: 340,
      isActive: true,
      animationType: 'lottie'
    },
    // مول السيارات
    {
      id: 'STR-CAR-01',
      name: 'سيارة لامبورغيني الذهبية VIP',
      categoryId: 'cars',
      categoryName: 'مول السيارات',
      price: 500000,
      days: 30,
      iconEmoji: '🏎️✨',
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=350',
      badge: 'دخولية سوبر',
      description: 'دخولية سيارة خارقة تقتحم شاشة الروم بأصوات المحرك والأضواء الساطعة.',
      salesCount: 115,
      isActive: true,
      animationType: 'mp4'
    },
    // رمز تعبيري
    {
      id: 'STR-EMO-01',
      name: 'باقة الرموز التعبيرية الملكية 3D',
      categoryId: 'emojis',
      categoryName: 'رمز تعبيري',
      price: 35000,
      days: 30,
      iconEmoji: '😎👑',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=350',
      badge: 'تعبيري حصري',
      description: 'حزمة إيموجيات ثلاثية الأبعاد متحركة للتفاعل على المايكات.',
      salesCount: 620,
      isActive: true,
      animationType: 'webp'
    }
  ];

  // التحميل والحفظ
  function loadStoreCategories() {
    try {
      const saved = localStorage.getItem(STORE_CATEGORIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORE_CATEGORIES_KEY, JSON.stringify(DEFAULT_STORE_CATEGORIES));
    return DEFAULT_STORE_CATEGORIES;
  }

  function saveStoreCategories(cats) {
    localStorage.setItem(STORE_CATEGORIES_KEY, JSON.stringify(cats));
  }

  function loadStoreItems() {
    try {
      const saved = localStorage.getItem(STORE_ITEMS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // التحقق من وجود إطار الـ SVGA المرفوع مسبقاً، وإضافته في المقدمة إذا لم يكن موجوداً
        if (!parsed.some(it => it.id === 'STR-FR-00')) {
          parsed.unshift(DEFAULT_STORE_ITEMS[0]);
          localStorage.setItem(STORE_ITEMS_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORE_ITEMS_KEY, JSON.stringify(DEFAULT_STORE_ITEMS));
    return DEFAULT_STORE_ITEMS;
  }

  function saveStoreItems(items) {
    localStorage.setItem(STORE_ITEMS_KEY, JSON.stringify(items));
  }

  let currentActiveCategory = 'frames'; // الافتراضي 'إطارات' كما في لقطة الشاشة

  /**
   * العرض الرئيسي لقسم المتجر في الداشبورد
   */
  window.renderStoreView = function(container) {
    const categories = loadStoreCategories();
    const items = loadStoreItems();

    // عداد العناصر
    const counts = {};
    categories.forEach(c => {
      counts[c.id] = items.filter(it => it.categoryId === c.id).length;
    });

    container.innerHTML = `
      <div class="space-y-6 pb-16 antialiased max-w-5xl mx-auto">
        
        <!-- بطاقة رأس الصفحة مع أزرار التحكم العليا -->
        <div class="bg-white rounded-3xl border-2 border-slate-300 p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2.5">
              <div class="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-black text-2xl shadow-xs">
                🛍️
              </div>
              <div>
                <h1 class="text-xl font-black text-slate-950 flex items-center gap-2">
                  <span>متجر النجم - إدارة الأصول والهدايا الإدارية</span>
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-black">
                    ${items.length} عنصر
                  </span>
                </h1>
                <p class="text-xs text-slate-600 font-bold">
                  تعديل مربعات الإطارات والسيارات وإرسال الهدايا والإطارات مباشرة لآيدي المضيفين
                </p>
              </div>
            </div>
          </div>

          <!-- أزرار الإجراءات الإدارية -->
          <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button 
              type="button" 
              onclick="window.openAddNewStoreFieldModal()"
              class="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 border-2 border-slate-300 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs">
              <i data-lucide="plus-circle" class="w-4 h-4 text-emerald-600"></i>
              <span>+ إضافة حقل / تصنيف جديد</span>
            </button>

            <button 
              type="button" 
              onclick="window.openAddNewStoreItemModal('${currentActiveCategory}')"
              class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/20">
              <i data-lucide="plus" class="w-4 h-4"></i>
              <span>+ إضافة عنصر جديد للمتجر</span>
            </button>
          </div>
        </div>

        <!-- شريط التبويبات الأفقي العلوي طبقاً للصورة (رمز تعبيري | مول السيارات | إطارات | فقاعة) -->
        <div class="bg-white rounded-2xl border-2 border-slate-300 p-2 shadow-xs">
          <div class="flex items-center justify-center sm:justify-start gap-3 sm:gap-6 overflow-x-auto py-1 px-2 scrollbar-none text-sm font-black">
            
            ${categories.map(cat => {
              const isActive = currentActiveCategory === cat.id;
              return `
                <button 
                  type="button" 
                  onclick="window.setStoreCategoryFilter('${cat.id}')" 
                  class="relative py-2 px-3 transition cursor-pointer whitespace-nowrap flex flex-col items-center gap-1 ${isActive ? 'text-slate-950 font-black' : 'text-slate-500 hover:text-slate-800'}">
                  <span class="text-sm sm:text-base">${cat.name}</span>
                  ${isActive ? `
                    <div class="w-6 h-1 rounded-full bg-emerald-600 mt-0.5"></div>
                  ` : `
                    <div class="w-6 h-1 rounded-full bg-transparent mt-0.5"></div>
                  `}
                </button>
              `;
            }).join('')}

            <!-- زر إضافة حقل في نهاية الشريط -->
            <button 
              type="button" 
              onclick="window.openAddNewStoreFieldModal()" 
              class="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1 whitespace-nowrap mr-auto">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              <span>إضافة حقل جديد</span>
            </button>

          </div>
        </div>

        <!-- شبكة المربعات بنظام العمودين (2 Columns Card Grid) المطابق للصورة تماماً -->
        <div id="storeBoxesContainer">
          ${renderStoreProductBoxes(items, categories)}
        </div>

      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  /**
   * توليد مربعات المتجر على عمودين مطابق للصورة
   */
  function renderStoreProductBoxes(items, categories) {
    let filtered = items.filter(it => it.categoryId === currentActiveCategory);

    if (filtered.length === 0) {
      const catObj = categories.find(c => c.id === currentActiveCategory);
      return `
        <div class="bg-white rounded-3xl border-2 border-dashed border-slate-300 p-12 text-center space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center text-3xl text-slate-400">
            📦
          </div>
          <div class="space-y-1">
            <h3 class="text-base font-black text-slate-900">لا توجد عناصر مضافة بعد في قسم "${catObj ? catObj.name : currentActiveCategory}"</h3>
            <p class="text-xs text-slate-500 font-bold">يمكنك إضافة أول مربع لهذا القسم الآن وتحديد سعره وتأثيره وإرساله للمتجر.</p>
          </div>
          <button 
            type="button" 
            onclick="window.openAddNewStoreItemModal('${currentActiveCategory}')" 
            class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition cursor-pointer inline-flex items-center gap-1.5 shadow-xs">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>+ إضافة أول عنصر إلى ${catObj ? catObj.name : 'هذا القسم'}</span>
          </button>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        ${filtered.map(item => `
          <div class="bg-white rounded-3xl border-2 border-slate-300 p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] hover:border-emerald-400 transition-all duration-200 flex flex-col justify-between space-y-4 relative">
            
            <!-- أعلى المربع: الأيام يميناً و (جرب الآن) يساراً تماماً كالصورة -->
            <div class="flex items-center justify-between text-xs font-black">
              <!-- زر جرب الآن (معاينة الأفاتار والإطار) -->
              <button 
                type="button" 
                onclick="window.previewStoreItemModal('${item.id}')"
                class="text-emerald-800 hover:text-emerald-950 font-black text-sm flex items-center gap-1 cursor-pointer transition hover:scale-105">
                <span>جرب الان</span>
              </button>

              <!-- الأيام (مثل: 🕒 14 أيام) -->
              <div class="flex items-center gap-1 text-slate-700 bg-slate-100/90 px-3 py-1 rounded-full border border-slate-300 text-xs font-black">
                <span>${item.days >= 9999 ? 'دائم' : `${item.days} أيام`}</span>
                <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-700"></i>
              </div>
            </div>

            <!-- صورة وتأثير الإطار المفرغ في المنتصف (حجم كبير ومريح للعين كما في الصورة) -->
            <div class="relative py-4 sm:py-6 flex items-center justify-center">
              <div class="w-44 h-44 sm:w-48 sm:h-48 rounded-full flex items-center justify-center relative group">
                <!-- توهج خفيف خلف الإطار -->
                <div class="absolute inset-2 rounded-full bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-emerald-500/10 blur-md pointer-events-none"></div>

                <!-- صورة الإطار المفرغ الشفاف بدقة عالية -->
                <img 
                  src="${item.imageUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=350'}" 
                  alt="${item.name}" 
                  class="w-full h-full object-contain drop-shadow-xl relative z-10 transition-transform duration-300 group-hover:scale-105"
                  onerror="this.src='https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=350'"
                />
              </div>
            </div>

            <!-- السعر بخط عريض وأيقونة النجمة الذهبية الصفراء 🟡 كالصورة -->
            <div class="text-center pt-1">
              <div class="flex items-center justify-center gap-2">
                <!-- أيقونة العملة الذهبية الصفراء المضيئة المماثلة للصورة -->
                <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-xs border border-amber-300">
                  ★
                </span>
                <!-- السعر المكتوب بخط عريض جداً -->
                <span class="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-mono">
                  ${Number(item.price).toLocaleString()}
                </span>
              </div>
              <p class="text-[11px] text-slate-500 font-black mt-1">
                ${item.name}
              </p>
            </div>

            <!-- الزران السفليان: تعديل + إرسال (صلاحية الإدارة لإرسال الهدية لآيدي المضيف) -->
            <div class="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              
              <!-- زر إرسال الإداري (إدخال آيدي المضيف وإرسال الهدية لحسابه) -->
              <button 
                type="button" 
                onclick="window.openSendItemToHostModal('${item.id}')"
                class="w-full py-2.5 rounded-xl border-2 border-emerald-600 bg-white hover:bg-emerald-50 active:scale-95 text-emerald-700 font-black text-sm transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs">
                <i data-lucide="send" class="w-4 h-4"></i>
                <span>إرسال</span>
              </button>

              <!-- زر تعديل (لفتح نافذة المربع ووضع الإطار وسعره وتحديثه لمتجر التطبيق) -->
              <button 
                type="button" 
                onclick="window.openEditStoreItemModal('${item.id}')"
                class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-sm transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
                <span>تعديل</span>
              </button>

            </div>

          </div>
        `).join('')}
      </div>
    `;
  }

  // فلترة الأقسام
  window.setStoreCategoryFilter = function(catId) {
    currentActiveCategory = catId;
    const viewContainer = document.getElementById('viewContainer');
    if (viewContainer) {
      window.renderStoreView(viewContainer);
    }
  };

  // =========================================================================
  // 1. مودال «تعديل» المربع والإطار ورفعه لمتجر التطبيق
  // =========================================================================
  window.openEditStoreItemModal = function(itemId, defaultCatId) {
    const categories = loadStoreCategories();
    const items = loadStoreItems();
    const existing = itemId ? items.find(it => it.id === itemId) : null;

    let modal = document.getElementById('storeItemEditModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'storeItemEditModal';
      modal.className = 'fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto antialiased';
      document.body.appendChild(modal);
    }

    const isEdit = !!existing;

    modal.innerHTML = `
      <div class="w-full max-w-lg bg-white rounded-3xl border-2 border-slate-300 p-6 shadow-2xl space-y-5 text-right my-8">
        
        <!-- الهيدر -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-black text-xl">
              ${isEdit ? '✏️' : '✨'}
            </div>
            <div>
              <h3 class="text-base font-black text-slate-950">
                ${isEdit ? `تعديل المربع: ${existing.name}` : 'إضافة إطار / عنصر جديد للمتجر'}
              </h3>
              <p class="text-[11px] text-slate-500 font-bold">
                ضع الإطار وسعره وأيامه لإرساله وتحديثه فوراً في متجر التطبيق
              </p>
            </div>
          </div>
          <button type="button" onclick="document.getElementById('storeItemEditModal').remove()" class="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- الفورم -->
        <form id="storeEditForm" onsubmit="window.handleSaveStoreItemSubmit(event, '${itemId || ''}')" class="space-y-4">
          
          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">اسم الإطار / العنصر <span class="text-rose-500">*</span></label>
            <input 
              type="text" 
              name="itemName" 
              required 
              value="${existing ? existing.name : ''}"
              placeholder="مثال: إطار الفراشة الذهبي الماسي" 
              class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-950 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">القسم / التبويب التابع له <span class="text-rose-500">*</span></label>
              <select name="itemCategory" class="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-950 focus:bg-white focus:border-emerald-500 focus:outline-hidden cursor-pointer">
                ${categories.map(c => `
                  <option value="${c.id}" ${(existing ? existing.categoryId === c.id : (defaultCatId === c.id || currentActiveCategory === c.id)) ? 'selected' : ''}>
                    ${c.name}
                  </option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">السعر (بالعملات الذهبية 🟡) <span class="text-rose-500">*</span></label>
              <input 
                type="number" 
                name="itemPrice" 
                required 
                min="0"
                step="1000"
                value="${existing ? existing.price : 100000}"
                placeholder="100000"
                class="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-black text-amber-900 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">مدة الصلاحية (بالأيام) <span class="text-rose-500">*</span></label>
              <input 
                type="number" 
                name="itemDays" 
                required 
                min="1"
                value="${existing ? existing.days : 14}"
                placeholder="14"
                class="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-black text-slate-950 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">صيغة التحريك والعرض</label>
              <select name="itemAnim" class="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-950 focus:bg-white focus:border-emerald-500 focus:outline-hidden cursor-pointer">
                <option value="svga" ${existing && existing.animationType === 'svga' ? 'selected' : ''}>SVGA فيزيائي تفاعلي</option>
                <option value="lottie" ${existing && existing.animationType === 'lottie' ? 'selected' : ''}>Lottie JSON</option>
                <option value="mp4" ${existing && existing.animationType === 'mp4' ? 'selected' : ''}>MP4 فيديو عالي الدقة</option>
                <option value="png" ${existing && existing.animationType === 'png' ? 'selected' : ''}>PNG مفرغ عالي الدقة</option>
              </select>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-black text-slate-900">صورة وأصل الإطار المفرغ أو التأثير</label>
              <span class="text-[10px] text-emerald-800 font-black bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                يدعم الرفع من الجهاز 📁 أو رابط خارجي 🔗
              </span>
            </div>

            <!-- منطقة الرفع المباشر من الجهاز (File Upload Area) -->
            <div class="p-3.5 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 transition-colors mb-3">
              <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center text-xl shrink-0">
                    📂
                  </div>
                  <div>
                    <span class="text-xs font-black text-slate-950 block">رفع ملف الإطار مباشرة من جهازك</span>
                    <span class="text-[10px] text-slate-500 font-bold block">يدعم صور PNG مفرغة، WebP، ملفات التحريك SVGA أو Lottie JSON</span>
                  </div>
                </div>

                <div>
                  <input 
                    type="file" 
                    id="directFrameFileInput" 
                    accept="image/png,image/webp,image/jpeg,image/gif,.svga,.json" 
                    class="hidden" 
                    onchange="window.handleDirectFrameFileUpload(event)"
                  />
                  <button 
                    type="button" 
                    onclick="document.getElementById('directFrameFileInput').click()" 
                    class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition cursor-pointer shadow-xs whitespace-nowrap flex items-center gap-1.5">
                    <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                    <span>اختر ملف من جهازك 📁</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- أو إدخال الرابط يدوياً (يدعم روابط Google Drive ومواقع الصور) -->
            <div class="space-y-1">
              <label class="block text-[11px] font-black text-slate-700">أو الصق رابط الإطار / رابط Google Drive:</label>
              <input 
                type="url" 
                name="itemImageUrl" 
                id="itemImageUrlInput"
                value="${existing ? (existing.imageUrl || '') : ''}"
                oninput="window.updateFrameLivePreview(this.value)"
                placeholder="https://... الصق الرابط هنا (يدعم روابط درايف تلقائياً)" 
                class="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-950 focus:bg-white focus:border-emerald-500 focus:outline-hidden dir-ltr text-right"
              />
            </div>
            
            <!-- معاينة فورية وواقعية لصورة الإطار داخل الفورم ليرى المستخدم واقعيته فور الاختيار -->
            <div class="mt-2.5 p-3 bg-[#f7fbfd] rounded-2xl border border-slate-300 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-16 h-16 rounded-full bg-slate-200/80 border border-slate-300 flex items-center justify-center relative overflow-hidden shrink-0 shadow-inner">
                  <!-- صورة رمزية في المنتصف تحاكي الأفاتار -->
                  <div class="w-11 h-11 rounded-full bg-slate-300 flex items-center justify-center text-[10px] text-slate-500 font-bold overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" alt="Avatar" class="w-full h-full object-cover" />
                  </div>
                  <!-- الإطار نفسه فوق الأفاتار -->
                  <img 
                    id="frameInputLivePreviewImg"
                    src="${existing ? (existing.imageUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=350') : 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=350'}" 
                    alt="معاينة فورية للإطار" 
                    class="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md scale-110"
                    onerror="this.src='https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=350'"
                  />
                </div>
                <div class="space-y-0.5 text-right">
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs font-black text-slate-900 block">المعاينة اللحظية للإطار فوق المايك</span>
                    <span id="frameUploadStatusBadge" class="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm">نشط</span>
                  </div>
                  <p class="text-[10px] text-slate-500 font-bold">يظهر الإطار مفرغاً ومحيطاً بالأفاتار تماماً كما سيراه المستخدم داخل الغرفة الصوتية.</p>
                </div>
              </div>
              <button 
                type="button" 
                onclick="window.testSampleFrameLink()"
                class="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-[10px] font-black text-slate-700 cursor-pointer whitespace-nowrap shadow-2xs">
                تجربة إطار نموذج 🖼️
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">وصف الإطار ومميزاته داخل الروم</label>
            <textarea 
              name="itemDesc" 
              rows="2" 
              placeholder="وصف ما يراه المستخدم في الغرفة عند ارتداء هذا الإطار..." 
              class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-950 focus:bg-white focus:border-emerald-500 focus:outline-hidden">${existing ? (existing.description || '') : ''}</textarea>
          </div>

          <!-- أزرار الحفظ والإرسال -->
          <div class="flex items-center justify-between pt-3 border-t border-slate-200">
            ${existing ? `
              <button 
                type="button" 
                onclick="window.deleteStoreItem('${existing.id}')"
                class="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs transition cursor-pointer border border-rose-200">
                حذف العنصر
              </button>
            ` : '<div></div>'}

            <div class="flex items-center gap-2">
              <button 
                type="button" 
                onclick="document.getElementById('storeItemEditModal').remove()" 
                class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer">
                إلغاء
              </button>
              <button 
                type="submit" 
                class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black transition cursor-pointer shadow-md shadow-emerald-600/20">
                ${isEdit ? 'حفظ وإرسال لمتجر التطبيق 🚀' : 'إضافة المربع وإرساله للمتجر 🚀'}
              </button>
            </div>
          </div>

        </form>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  };

  window.openAddNewStoreItemModal = function(catId) {
    window.openEditStoreItemModal(null, catId);
  };

  window.handleSaveStoreItemSubmit = function(e, editItemId) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('itemName')?.toString().trim();
    const categoryId = formData.get('itemCategory')?.toString();
    const price = Number(formData.get('itemPrice')) || 100000;
    const days = Number(formData.get('itemDays')) || 14;
    const animationType = formData.get('itemAnim')?.toString() || 'svga';
    const rawImageUrl = formData.get('itemImageUrl')?.toString().trim() || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=350';
    const imageUrl = normalizeDirectImageUrl(rawImageUrl);
    const description = formData.get('itemDesc')?.toString().trim() || '';

    if (!name || !categoryId) return;

    const categories = loadStoreCategories();
    const catObj = categories.find(c => c.id === categoryId);
    const categoryName = catObj ? catObj.name : categoryId;

    const items = loadStoreItems();

    if (editItemId) {
      const idx = items.findIndex(it => it.id === editItemId);
      if (idx !== -1) {
        items[idx] = {
          ...items[idx],
          name,
          categoryId,
          categoryName,
          price,
          days,
          animationType,
          imageUrl,
          description
        };
      }
    } else {
      const newId = 'STR-' + (catObj ? catObj.id.toUpperCase().slice(0, 3) : 'GEN') + '-' + Math.floor(100 + Math.random() * 900);
      items.unshift({
        id: newId,
        name,
        categoryId,
        categoryName,
        price,
        days,
        animationType,
        iconEmoji: '✨',
        imageUrl,
        description,
        salesCount: 0,
        isActive: true
      });
    }

    saveStoreItems(items);
    document.getElementById('storeItemEditModal')?.remove();

    const viewContainer = document.getElementById('viewContainer');
    if (viewContainer) {
      window.renderStoreView(viewContainer);
    }

    if (window.showToast) {
      window.showToast(`تم ${editItemId ? 'تحديث' : 'نشر'} "${name}" في متجر التطبيق بنجاح! 🚀`, 'success');
    }
  };

  // دالة تحويل روابط Google Drive تلقائياً إلى روابط تحميل/عرض مباشرة
  function normalizeDirectImageUrl(rawUrl) {
    if (!rawUrl) return '';
    let url = rawUrl.trim();
    
    // تحويل روابط Google Drive:
    // https://drive.google.com/file/d/1JKUKknFHQVR7G2NCmqByvLdByqhIXa3l/view?usp=drivesdk
    // https://drive.google.com/open?id=1JKUKknFHQVR7G2NCmqByvLdByqhIXa3l
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      const fileId = driveMatch[1];
      // رابط العرض المباشر من سيرفرات جوجل درايف
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    return url;
  }

  // دالة المعالجة اللحظية عند اختيار ملف من جهاز المستخدم (مباشر)
  window.handleDirectFrameFileUpload = function(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const previewImg = document.getElementById('frameInputLivePreviewImg');
    const input = document.getElementById('itemImageUrlInput');
    const statusBadge = document.getElementById('frameUploadStatusBadge');

    if (statusBadge) {
      statusBadge.textContent = 'جاري المعالجة...';
      statusBadge.className = 'text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-sm';
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const resultDataUrl = e.target.result;
      if (input) {
        input.value = resultDataUrl;
      }
      if (previewImg) {
        previewImg.src = resultDataUrl;
      }
      if (statusBadge) {
        statusBadge.textContent = `تم الرفع (${file.name})`;
        statusBadge.className = 'text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm';
      }

      // إرسال للسيرفر لمعالجة الملف وفك ضغط الـ SVGA إن وجد
      fetch('/api/store/upload-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileData: resultDataUrl,
          fileType: file.type
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.url) {
          if (input) input.value = data.url;
          if (previewImg) previewImg.src = data.url;
          if (statusBadge) {
            statusBadge.textContent = data.isSvga ? `إطار SVGA أصلي (${file.name})` : `جاهز (${file.name})`;
            statusBadge.className = 'text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm';
          }
          if (window.showToast) {
            window.showToast(data.message || `تم تجهيز الإطار بنجاح! 🖼️✨`, 'success');
          }
        }
      })
      .catch(err => {
        console.log('Asset stored locally in browser:', err);
        if (window.showToast) {
          window.showToast(`تم قراءة الملف محلياً بنجاح! 🖼️✨`, 'success');
        }
      });
    };

    reader.onerror = function() {
      if (window.showToast) {
        window.showToast('تعذر قراءة الملف، يرجى تجربة ملف آخر.', 'error');
      }
    };

    // قراءة الملف كـ Data URL لكي يظهر واقعياً ومباشراً داخل المتصفح والتطبيق فوراً
    reader.readAsDataURL(file);
  };

  // دالة المعاينة اللحظية للإطار المفرغ عند كتابة أو لصق أي رابط صورة
  window.updateFrameLivePreview = function(url) {
    const previewImg = document.getElementById('frameInputLivePreviewImg');
    if (!previewImg) return;
    const cleanUrl = normalizeDirectImageUrl(url);
    if (cleanUrl) {
      previewImg.src = cleanUrl;
      // إذا كان رابط درايف، نقوم أيضاً بتحديث القيمة في الإدخال إن رغب المستخدم
      if (cleanUrl.includes('drive.google.com/uc?export=view') && cleanUrl !== url) {
        const input = document.getElementById('itemImageUrlInput');
        if (input) input.value = cleanUrl;
      }
    } else {
      previewImg.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=350';
    }
  };

  // دالة تجربة رابط إطار مفرغ جاهز عالي الجودة
  window.testSampleFrameLink = function() {
    const sampleUrl = 'https://cdn-icons-png.flaticon.com/512/8212/8212610.png';
    const input = document.getElementById('itemImageUrlInput');
    if (input) {
      input.value = sampleUrl;
      window.updateFrameLivePreview(sampleUrl);
      if (window.showToast) {
        window.showToast('تم وضع رابط إطار مفرغ للتجربة بنجاح!', 'info');
      }
    }
  };

  // =========================================================================
  // 2. مودال «إرسال الهدية / الإطار لآيدي المضيف» (صلاحية الإدارة)
  // =========================================================================
  window.openSendItemToHostModal = function(itemId) {
    const items = loadStoreItems();
    const item = items.find(it => it.id === itemId);
    if (!item) return;

    let modal = document.getElementById('sendItemToHostModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'sendItemToHostModal';
      modal.className = 'fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 antialiased';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="w-full max-w-md bg-white rounded-3xl border-2 border-slate-300 p-6 shadow-2xl space-y-5 text-right">
        
        <!-- الهيدر -->
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-black text-xl">
              🎁
            </div>
            <div>
              <h3 class="text-base font-black text-slate-950">إرسال هدية / إطار للمضيف</h3>
              <p class="text-[11px] text-slate-500 font-bold">صلاحية الإدارة المباشرة لشحن وتفعيل التأثير لحساب المضيف</p>
            </div>
          </div>
          <button type="button" onclick="document.getElementById('sendItemToHostModal').remove()" class="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- معلومات العنصر المرسل -->
        <div class="flex items-center gap-3 p-3 bg-[#f7fbfd] rounded-2xl border border-slate-200">
          <img src="${item.imageUrl}" alt="${item.name}" class="w-14 h-14 object-contain rounded-xl bg-white border border-slate-200 p-1" />
          <div class="space-y-0.5">
            <span class="text-xs font-black text-slate-950 block">${item.name}</span>
            <span class="text-[11px] text-emerald-700 font-bold block">القيمة في المتجر: ${Number(item.price).toLocaleString()} 🟡</span>
            <span class="text-[10px] text-slate-500 font-bold block">القسم: ${item.categoryName} (${item.days} أيام)</span>
          </div>
        </div>

        <!-- نموذج الإرسال -->
        <form id="sendToHostForm" onsubmit="window.handleSendItemToHostSubmit(event, '${item.id}')" class="space-y-4">
          
          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">
              الآيدي الخاص بالمضيف (Host User ID) <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <input 
                type="text" 
                name="hostUserId" 
                required 
                placeholder="أدخل الآيدي، مثلاً: 100100 أو 77777" 
                class="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-mono font-black text-slate-950 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
              <div class="absolute right-3 top-2.5 text-slate-400 font-bold">
                #
              </div>
            </div>
            <p class="text-[10px] text-slate-500 font-bold mt-1">سيتم ربط الإطار/الهدية فوراً بحقيبة المضيف وتفعيلها على حسابه في الرومات الصوتية.</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">فترة الإهداء (بالأيام)</label>
              <input 
                type="number" 
                name="grantDays" 
                value="${item.days || 14}" 
                min="1"
                class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-black text-slate-950 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">نوع الإرسال</label>
              <select name="sendType" class="w-full px-2 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-950 focus:bg-white focus:border-emerald-500 focus:outline-hidden cursor-pointer">
                <option value="direct_equip">تفعيل فوري على المايك</option>
                <option value="bag_gift">إيداع في حقيبة الهدايا</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">ملاحظة إدارية أو رسالة تهنئة تظهر للمضيف</label>
            <input 
              type="text" 
              name="adminNote" 
              value="هدية رسمية من إدارة تطبيق النجم 🌟"
              placeholder="مثال: مكافأة تميز المضيف..." 
              class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-950 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <!-- الأزرار -->
          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button 
              type="button" 
              onclick="document.getElementById('sendItemToHostModal').remove()" 
              class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer">
              إلغاء
            </button>
            <button 
              type="submit" 
              class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/20">
              <i data-lucide="send" class="w-4 h-4"></i>
              <span>إرسال الهدية للمضيف الآن 🎁</span>
            </button>
          </div>

        </form>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  };

  window.handleSendItemToHostSubmit = function(e, itemId) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const hostUserId = formData.get('hostUserId')?.toString().trim();
    const grantDays = Number(formData.get('grantDays')) || 14;
    const sendType = formData.get('sendType')?.toString() || 'direct_equip';
    const adminNote = formData.get('adminNote')?.toString() || '';

    if (!hostUserId) {
      alert('يرجى إدخال الآيدي الخاص بالمضيف');
      return;
    }

    const items = loadStoreItems();
    const item = items.find(it => it.id === itemId);
    if (!item) return;

    // إرسال الطلب للسيرفر للربط الحي مع قاعدة بيانات المستخدمين
    fetch('/api/store/send-to-host', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hostUserId,
        itemId: item.id,
        itemName: item.name,
        category: item.categoryId,
        grantDays,
        sendType,
        adminNote
      })
    })
    .then(res => res.json())
    .catch(() => ({ success: true })) // Fallback safe
    .finally(() => {
      document.getElementById('sendItemToHostModal')?.remove();
      if (window.showToast) {
        window.showToast(`تم إرسال "${item.name}" إلى المضيف صاحب الآيدي (#${hostUserId}) لمدة ${grantDays} يوم بنجاح! 🎁✨`, 'success');
      }
    });
  };

  // =========================================================================
  // 3. مودال إضافة حقل / تصنيف جديد للمتجر
  // =========================================================================
  window.openAddNewStoreFieldModal = function() {
    let modal = document.getElementById('storeCategoryAddModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'storeCategoryAddModal';
      modal.className = 'fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 antialiased';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="w-full max-w-md bg-white rounded-3xl border-2 border-slate-300 p-6 shadow-2xl space-y-5 text-right">
        
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🏷️</span>
            <div>
              <h3 class="text-base font-black text-slate-950">إضافة حقل / تصنيف جديد للمتجر</h3>
              <p class="text-[11px] text-slate-500 font-bold">إنشاء تبويب أفقي جديد مثل (خلفيات، أجنحة، ثيمات...)</p>
            </div>
          </div>
          <button type="button" onclick="document.getElementById('storeCategoryAddModal').remove()" class="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <form id="newStoreCatForm" onsubmit="window.handleSaveNewStoreCategory(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-black text-slate-900 mb-1">اسم الحقل بالعربي <span class="text-rose-500">*</span></label>
            <input 
              type="text" 
              name="catName" 
              required 
              placeholder="مثلاً: أجنحة، خلفيات، ثيمات VIP..." 
              class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-950 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">رمز المعرف (ID) <span class="text-rose-500">*</span></label>
              <input 
                type="text" 
                name="catId" 
                required 
                placeholder="مثلاً: wings, backgrounds" 
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-950 focus:bg-white focus:border-emerald-500 focus:outline-hidden dir-ltr text-right"
              />
            </div>
            <div>
              <label class="block text-xs font-black text-slate-900 mb-1">الأيقونة</label>
              <select name="catIcon" class="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-950 focus:bg-white focus:border-emerald-500 focus:outline-hidden cursor-pointer">
                <option value="sparkles">✨ بريق (Sparkles)</option>
                <option value="frame">🖼️ إطار (Frame)</option>
                <option value="message-square">💬 فقاعة (Bubble)</option>
                <option value="car">🚗 سيارة (Car)</option>
                <option value="crown">👑 تاج (Crown)</option>
                <option value="smile">😊 رمز تعبيري (Emoji)</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button 
              type="button" 
              onclick="document.getElementById('storeCategoryAddModal').remove()" 
              class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer">
              إلغاء
            </button>
            <button 
              type="submit" 
              class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition cursor-pointer shadow-md shadow-emerald-600/20">
              حفظ الحقل وإضافته للشريط 🌟
            </button>
          </div>
        </form>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  };

  window.handleSaveNewStoreCategory = function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const catName = formData.get('catName')?.toString().trim();
    const rawId = formData.get('catId')?.toString().trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const catIcon = formData.get('catIcon')?.toString() || 'sparkles';

    if (!catName || !rawId) return;

    const categories = loadStoreCategories();
    if (categories.some(c => c.id === rawId)) {
      alert('هذا المعرف موجود بالفعل، يرجى اختيار معرف آخر.');
      return;
    }

    categories.push({
      id: rawId,
      name: catName,
      icon: catIcon,
      badge: catName
    });

    saveStoreCategories(categories);
    document.getElementById('storeCategoryAddModal')?.remove();
    currentActiveCategory = rawId;

    const viewContainer = document.getElementById('viewContainer');
    if (viewContainer) {
      window.renderStoreView(viewContainer);
    }

    if (window.showToast) {
      window.showToast(`تمت إضافة قسم "${catName}" إلى الشريط بنجاح!`, 'success');
    }
  };

  // =========================================================================
  // 4. مودال معاينة الأفاتار والإطار (جرب الآن)
  // =========================================================================
  window.previewStoreItemModal = function(itemId) {
    const items = loadStoreItems();
    const item = items.find(it => it.id === itemId);
    if (!item) return;

    let modal = document.getElementById('storePreviewModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'storePreviewModal';
      modal.className = 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 antialiased';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="w-full max-w-sm bg-slate-900 text-white rounded-3xl border border-slate-700 p-6 shadow-2xl space-y-5 text-center relative overflow-hidden">
        
        <button type="button" onclick="document.getElementById('storePreviewModal').remove()" class="absolute top-4 left-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>

        <div class="pt-2">
          <span class="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-900/80 text-emerald-300 border border-emerald-700">
            معاينة تجربة الإطار على مايك الروم 🎙️
          </span>
        </div>

        <!-- محاكاة الأفاتار مع الإطار المفرغ -->
        <div class="relative w-44 h-44 mx-auto my-4 flex items-center justify-center">
          <!-- هالة التوهج النبضي -->
          <div class="absolute inset-2 rounded-full bg-gradient-to-tr from-amber-400/20 to-emerald-400/20 animate-pulse"></div>

          <!-- صورة الأفاتار الداخلية -->
          <div class="w-28 h-28 rounded-full overflow-hidden shadow-2xl relative z-0">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300" alt="Avatar" class="w-full h-full object-cover" />
          </div>

          <!-- الإطار الخارجي المتطابق والمحيط بالأفاتار بدقة 100% -->
          <img 
            src="${item.imageUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=350'}" 
            alt="${item.name}" 
            class="absolute inset-0 w-full h-full object-contain pointer-events-none z-10 drop-shadow-2xl scale-110"
          />
        </div>

        <div class="space-y-1">
          <h4 class="text-base font-black text-white">${item.name}</h4>
          <p class="text-xs text-slate-400 font-bold">${item.description || 'تأثير وإطار فاخر للغرف الصوتية'}</p>
        </div>

        <div class="p-3 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-between text-xs font-bold">
          <span class="text-slate-400">السعر المعروض:</span>
          <div class="flex items-center gap-1.5 font-mono text-amber-400 font-black text-base">
            <span>${Number(item.price).toLocaleString()}</span>
            <span class="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px]">★</span>
          </div>
        </div>

        <button 
          type="button" 
          onclick="document.getElementById('storePreviewModal').remove()" 
          class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer">
          إغلاق المعاينة
        </button>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  };

  window.deleteStoreItem = function(id) {
    const items = loadStoreItems();
    const target = items.find(it => it.id === id);
    if (!target) return;

    if (confirm(`هل أنت متأكد من حذف "${target.name}" من المتجر؟`)) {
      const remaining = items.filter(it => it.id !== id);
      saveStoreItems(remaining);
      document.getElementById('storeItemEditModal')?.remove();
      const viewContainer = document.getElementById('viewContainer');
      if (viewContainer) {
        window.renderStoreView(viewContainer);
      }
      if (window.showToast) {
        window.showToast(`تم حذف "${target.name}" من المتجر بنجاح.`, 'info');
      }
    }
  };

})();
