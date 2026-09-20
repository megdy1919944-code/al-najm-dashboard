/**
 * محرك التحميل عند الطلب والتخزين المؤقت للواجهات
 * Dynamic Hierarchical On-Demand View Loader with Memory Caching
 * -------------------------------------------------------------
 * يقوم بتحميل الواجهات فقط عند النقر عليها من القائمة الجانبية،
 * وتخزين هيكل الواجهة في الكاش الفوري (View Cache) لسرعة استجابة 0ms،
 * مع عرض هيكل تحميلي تفاعلي (Skeleton Structure) ومزامنة الإحصائيات الحية من السيرفر.
 */

(function() {
  window.AdminViewLoader = {
    // ذاكرة التخزين المؤقت للواجهات المحملة
    viewCache: {},
    // مسار ملفات الواجهات المفصولة
    viewsPath: '/admin/views/',
    // خريطة الواجهات المفصولة والملفات المسؤولة عنها
    viewModuleMap: {
      'overview': 'overview-view.js',
      'dashboard': 'overview-view.js',
      'store': 'store-view.js',
      'store_cms': 'store-view.js',
      'users': 'users-view.js',
      'users_list': 'users-view.js',
      'hosts': 'hosts-view.js',
      'agencies': 'agencies-view.js',
      'rooms': 'rooms-view.js',
      'finance': 'finance-view.js',
      'wallet': 'finance-view.js',
      'settings': 'settings-view.js'
    },
    // السجلات التي تم تحميل أكوادها مسبقاً
    loadedScripts: {},

    /**
     * عرض الهيكل الهرمي التفاعلي للتحميل (Skeleton Loader)
     */
    showSkeleton(container) {
      if (!container) return;
      container.innerHTML = `
        <div class="space-y-6 animate-pulse p-2">
          <!-- الهيكل الهرمي لبطاقات الإحصائيات العلوية -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="h-28 bg-white/80 rounded-2xl border border-slate-200 p-4 flex flex-col justify-between">
              <div class="flex justify-between items-center">
                <div class="h-4 bg-slate-200 rounded w-24"></div>
                <div class="w-8 h-8 rounded-xl bg-slate-100"></div>
              </div>
              <div class="h-8 bg-slate-200 rounded w-32 mt-2"></div>
            </div>
            <div class="h-28 bg-white/80 rounded-2xl border border-slate-200 p-4 flex flex-col justify-between">
              <div class="flex justify-between items-center">
                <div class="h-4 bg-slate-200 rounded w-24"></div>
                <div class="w-8 h-8 rounded-xl bg-slate-100"></div>
              </div>
              <div class="h-8 bg-slate-200 rounded w-32 mt-2"></div>
            </div>
            <div class="h-28 bg-white/80 rounded-2xl border border-slate-200 p-4 flex flex-col justify-between">
              <div class="flex justify-between items-center">
                <div class="h-4 bg-slate-200 rounded w-24"></div>
                <div class="w-8 h-8 rounded-xl bg-slate-100"></div>
              </div>
              <div class="h-8 bg-slate-200 rounded w-32 mt-2"></div>
            </div>
            <div class="h-28 bg-white/80 rounded-2xl border border-slate-200 p-4 flex flex-col justify-between">
              <div class="flex justify-between items-center">
                <div class="h-4 bg-slate-200 rounded w-24"></div>
                <div class="w-8 h-8 rounded-xl bg-slate-100"></div>
              </div>
              <div class="h-8 bg-slate-200 rounded w-32 mt-2"></div>
            </div>
          </div>

          <!-- الهيكل الهرمي لشريط الأدوات والبحث -->
          <div class="h-16 bg-white rounded-2xl border border-slate-200 p-3 flex items-center justify-between">
            <div class="h-10 bg-slate-100 rounded-xl w-64"></div>
            <div class="flex gap-2">
              <div class="h-10 bg-slate-100 rounded-xl w-24"></div>
              <div class="h-10 bg-slate-100 rounded-xl w-32"></div>
            </div>
          </div>

          <!-- الهيكل الهرمي لجدول أو مربعات المحتوى الرئيسي -->
          <div class="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div class="h-6 bg-slate-200 rounded w-48 mb-6"></div>
            <div class="h-12 bg-slate-100 rounded-xl w-full"></div>
            <div class="h-12 bg-slate-50 rounded-xl w-full"></div>
            <div class="h-12 bg-slate-100 rounded-xl w-full"></div>
            <div class="h-12 bg-slate-50 rounded-xl w-full"></div>
            <div class="h-12 bg-slate-50 rounded-xl w-full"></div>
          </div>
        </div>
      `;
    },

    /**
     * تحميل واجهة معينة عند الطلب (On-Demand)
     * @param {string} viewKey معرّف الواجهة (مثال: store, users, overview)
     * @param {HTMLElement} container عنصر الحاوية الذي ستوضع فيه الواجهة
     * @param {object} params معطيات إضافية اختيارية
     */
    async loadView(viewKey, container, params = {}) {
      if (!container) return;

      // 1. التحقق من وجود الواجهة مسبقاً في التخزين المؤقت (Memory Cache)
      if (this.viewCache[viewKey]) {
        container.innerHTML = '';
        if (typeof this.viewCache[viewKey].render === 'function') {
          await this.viewCache[viewKey].render(container, params);
          this.refreshLucideIcons();
          return;
        }
      }

      // 2. عرض الهيكل الهرمي المؤقت سريعاً للمستخدم أثناء التحميل
      this.showSkeleton(container);

      // 3. تحديد ملف الموديل المفصول المسؤول عن هذه الواجهة
      const scriptFile = this.viewModuleMap[viewKey] || `${viewKey}-view.js`;
      const scriptUrl = `${this.viewsPath}${scriptFile}`;

      try {
        // تحميل الملف فقط إن لم يكن تم تحميله مسبقاً
        if (!this.loadedScripts[scriptFile]) {
          await this.loadScriptAsync(scriptUrl);
          this.loadedScripts[scriptFile] = true;
        }

        // 4. استدعاء المعالج المسجل لهذه الواجهة
        if (this.viewCache[viewKey] && typeof this.viewCache[viewKey].render === 'function') {
          container.innerHTML = '';
          await this.viewCache[viewKey].render(container, params);
          this.refreshLucideIcons();
        } else if (typeof window[`render_${viewKey}_view`] === 'function') {
          container.innerHTML = '';
          await window[`render_${viewKey}_view`](container, params);
          this.refreshLucideIcons();
        } else {
          // محاولة استدعاء الدالة الكلاسيكية إن وجدت
          const legacyFn = window[viewKey] || window[`render_${viewKey}`] || window[`renderTab_${viewKey}`];
          if (typeof legacyFn === 'function') {
            container.innerHTML = '';
            legacyFn(container);
            this.refreshLucideIcons();
          }
        }
      } catch (err) {
        console.error(`خطأ أثناء تحميل الواجهة عند الطلب (${viewKey}):`, err);
        container.innerHTML = `
          <div class="p-8 text-center bg-white rounded-2xl border border-rose-200">
            <div class="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 text-xl font-bold">⚠️</div>
            <h3 class="text-sm font-black text-slate-900">تعذر تحميل الواجهة المطلوبة</h3>
            <p class="text-xs text-slate-500 mt-1">يرجى التأكد من اتصال السيرفر وإعادة المحاولة.</p>
            <button onclick="window.AdminViewLoader.loadView('${viewKey}', document.getElementById('dynamicViewContainer'))" class="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs">إعادة المحاولة 🔄</button>
          </div>
        `;
      }
    },

    /**
     * تسجيل واجهة في الكاش من قبل الملف المفصول
     */
    registerView(viewKey, definition) {
      this.viewCache[viewKey] = definition;
      console.log(`[ViewLoader] تم تسجيل وتخزين الواجهة في الكاش: ${viewKey}`);
    },

    /**
     * تحميل ملف JavaScript ديناميكياً عند الطلب
     */
    loadScriptAsync(src) {
      return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          return resolve();
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = (e) => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    },

    /**
     * تحديث أيقونات Lucide
     */
    refreshLucideIcons() {
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }
  };
})();
