/**
 * Standard UI Table Template (قالب الجدول القياسي الموحد)
 * صُمم خصيصاً ليتناسب تلقائياً مع مساحة صفحة الويب الخارجية (Responsive)
 * يوفر تصميماً نظيفاً للصفوف، عناوين بارزة، مسافات مريحة (Padding)، وأزرار تحكم وترتيب واضحة.
 */

(function() {
  // Store state for tables (sorting, search, pagination, selection)
  const tableStates = {};

  function getTableState(tableId, defaultRowsPerPage = 10, defaultSortKey = null, defaultSortDir = 'asc') {
    if (!tableStates[tableId]) {
      tableStates[tableId] = {
        searchQuery: '',
        sortKey: defaultSortKey,
        sortDir: defaultSortDir,
        currentPage: 1,
        rowsPerPage: defaultRowsPerPage,
        selectedIds: new Set(),
        filterColumn: 'all',
      };
    }
    return tableStates[tableId];
  }

  /**
   * Main Standard Table Renderer
   * @param {HTMLElement|string} container - Target container element or selector
   * @param {Object} config - Configuration object
   */
  window.renderStandardTable = function(container, config) {
    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) return;

    const tableId = config.tableId || 'std_table_' + Math.random().toString(36).substring(2, 8);
    const state = getTableState(tableId, config.rowsPerPage || 10, config.initialSortKey, config.initialSortDir || 'asc');

    // 1. Process Filtering (Search Query)
    let processedData = [...(config.data || [])];

    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase().trim();
      processedData = processedData.filter(row => {
        return config.columns.some(col => {
          const val = row[col.key];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(q);
        });
      });
    }

    // 2. Process Sorting
    if (state.sortKey) {
      const colDef = config.columns.find(c => c.key === state.sortKey);
      processedData.sort((a, b) => {
        let valA = a[state.sortKey];
        let valB = b[state.sortKey];

        // Custom comparator if provided
        if (colDef && colDef.comparator) {
          const res = colDef.comparator(valA, valB, a, b);
          return state.sortDir === 'asc' ? res : -res;
        }

        // Numerical comparison
        if (typeof valA === 'number' && typeof valB === 'number') {
          return state.sortDir === 'asc' ? valA - valB : valB - valA;
        }

        // Date comparison if string format matches
        const dateA = Date.parse(valA);
        const dateB = Date.parse(valB);
        if (!isNaN(dateA) && !isNaN(dateB) && typeof valA === 'string' && valA.includes('-')) {
          return state.sortDir === 'asc' ? dateA - dateB : dateB - dateA;
        }

        // String comparison
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
        if (valA < valB) return state.sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return state.sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // 3. Process Pagination
    const totalItems = processedData.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / state.rowsPerPage));
    if (state.currentPage > totalPages) {
      state.currentPage = totalPages;
    }
    const startIndex = (state.currentPage - 1) * state.rowsPerPage;
    const endIndex = Math.min(startIndex + state.rowsPerPage, totalItems);
    const paginatedData = processedData.slice(startIndex, endIndex);

    // Check if all visible rows are selected
    const allVisibleSelected = paginatedData.length > 0 && paginatedData.every(r => state.selectedIds.has(r.id || r._id || r.key));

    // HTML Construction
    el.innerHTML = `
      <div id="${tableId}_wrapper" class="w-full space-y-4 transition-all duration-200">
        
        <!-- ============================================================= -->
        <!-- 1. STANDARD TOOLBAR & ACTION HEADER (ترويسة التحكم الموحدة بحدود واضحة)   -->
        <!-- ============================================================= -->
        <div class="w-full bg-white rounded-2xl border-2 border-slate-300 p-4 sm:p-5 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.05),0_1px_3px_rgba(15,23,42,0.03)]">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <!-- Title, Icon, Subtitle, & Badge (أفقي ومنظم) -->
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black shrink-0 border border-amber-300 shadow-xs">
                <i data-lucide="${config.icon || 'table'}" class="w-6 h-6"></i>
              </div>
              <div>
                <div class="flex items-center gap-2.5 flex-wrap">
                  <h2 class="text-base font-black text-slate-950 tracking-tight whitespace-nowrap">${config.title || 'جدول البيانات'}</h2>
                  <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black font-mono border border-amber-300 whitespace-nowrap">
                    ${totalItems} سجل
                  </span>
                  ${config.badge ? `
                    <span class="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-300 text-[11px] font-black whitespace-nowrap">
                      ${config.badge}
                    </span>
                  ` : ''}
                  <span class="text-slate-300 font-normal hidden lg:inline">|</span>
                  <span class="text-xs text-slate-600 font-bold whitespace-nowrap hidden lg:inline">${config.subtitle || 'إدارة واستعراض البيانات في قالب قياسي منسق لصفحة الويب'}</span>
                </div>
                <p class="text-xs text-slate-600 mt-1 line-clamp-1 font-bold lg:hidden">${config.subtitle || 'إدارة واستعراض البيانات في قالب قياسي منسق لصفحة الويب'}</p>
              </div>
            </div>

            <!-- Primary Toolbar Buttons -->
            <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              ${config.onAdd ? `
                <button onclick="window._stdTableAction('${tableId}', 'add')" class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer whitespace-nowrap">
                  <i data-lucide="plus-circle" class="w-4 h-4"></i>
                  <span>${config.addLabel || 'إضافة جديد'}</span>
                </button>
              ` : ''}

              <button onclick="window._stdTableAction('${tableId}', 'refresh')" class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap" title="تحديث البيانات">
                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                <span class="hidden sm:inline">تحديث</span>
              </button>

              <button onclick="window._stdTableAction('${tableId}', 'export')" class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap" title="تصدير كملف CSV أو JSON">
                <i data-lucide="download" class="w-4 h-4"></i>
                <span class="hidden sm:inline">تصدير</span>
              </button>

              ${config.customActionsHtml || ''}
            </div>
          </div>

          <!-- Secondary Toolbar: Live Search & Filters -->
          <div class="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <!-- Quick Search Input -->
            <div class="relative flex-1 max-w-md">
              <input 
                type="text" 
                id="${tableId}_searchInput"
                value="${state.searchQuery}"
                oninput="window._stdTableSearch('${tableId}', this.value)"
                placeholder="${config.searchPlaceholder || 'بحث فوري في جميع أعمدة الجدول...'}" 
                class="w-full pl-8 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-950 placeholder:text-slate-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
              >
              <i data-lucide="search" class="w-4 h-4 text-slate-500 absolute right-3.5 top-3"></i>
              ${state.searchQuery ? `
                <button onclick="window._stdTableSearch('${tableId}', '')" class="absolute left-3 top-3 text-slate-500 hover:text-slate-800">
                  <i data-lucide="x" class="w-3.5 h-3.5"></i>
                </button>
              ` : ''}
            </div>

            <!-- Active Records Info & Sort Status -->
            <div class="flex items-center gap-3 text-xs text-slate-700 font-bold whitespace-nowrap">
              ${state.sortKey ? `
                <div class="flex items-center gap-1 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                  <span>مرتب حسب:</span>
                  <span class="font-black text-amber-700">${config.columns.find(c => c.key === state.sortKey)?.label || state.sortKey}</span>
                  <span>(${state.sortDir === 'asc' ? 'تصاعدي ↑' : 'تنازلي ↓'})</span>
                  <button onclick="window._stdTableSort('${tableId}', null)" class="text-slate-500 hover:text-rose-600 mr-1" title="إلغاء الترتيب">✕</button>
                </div>
              ` : ''}

              <div>
                إجمالي المعروض: <span class="font-black font-mono text-slate-950">${paginatedData.length}</span> من <span class="font-black font-mono text-slate-950">${totalItems}</span>
              </div>
            </div>

          </div>

          <!-- Bulk Selection Bar (Conditional) -->
          ${state.selectedIds.size > 0 ? `
            <div class="mt-3 p-3 bg-amber-100 border border-amber-300 rounded-xl flex items-center justify-between text-xs animate-fadeIn">
              <div class="flex items-center gap-2 text-amber-950 font-black whitespace-nowrap">
                <i data-lucide="check-square" class="w-4 h-4"></i>
                <span>تم تحديد ${state.selectedIds.size} عنصر</span>
              </div>
              <div class="flex items-center gap-2 whitespace-nowrap">
                ${config.onBulkDelete ? `
                  <button onclick="window._stdTableBulkAction('${tableId}', 'delete')" class="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-black hover:bg-rose-700 transition flex items-center gap-1 cursor-pointer whitespace-nowrap">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    <span>حذف المحدد</span>
                  </button>
                ` : ''}
                ${config.onBulkStatus ? `
                  <button onclick="window._stdTableBulkAction('${tableId}', 'status')" class="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-black hover:bg-emerald-700 transition flex items-center gap-1 cursor-pointer whitespace-nowrap">
                    <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
                    <span>تغيير حالة المحدد</span>
                  </button>
                ` : ''}
                <button onclick="window._stdTableClearSelection('${tableId}')" class="px-2.5 py-1.5 rounded-lg bg-slate-200 text-slate-900 font-black hover:bg-slate-300 transition cursor-pointer whitespace-nowrap">
                  إلغاء التحديد
                </button>
              </div>
            </div>
          ` : ''}

        </div>

        <!-- ============================================================= -->
        <!-- 2. STANDARD RESPONSIVE TABLE (الجدول القياسي المنظم مع مستطيلات أفقية مائية مسطرة وحدود دقيقة) -->
        <!-- ============================================================= -->
        <div class="w-full bg-white rounded-2xl border-2 border-slate-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.03)] overflow-hidden transition-all duration-200 hover:shadow-[0_6px_28px_-4px_rgba(15,23,42,0.08),0_3px_8px_-1px_rgba(15,23,42,0.04)]">
          
          <div class="w-full overflow-x-auto">
            <table class="w-full text-right text-xs border-collapse whitespace-nowrap">
              
              <!-- Prominent Headers (العناوين البارزة مع ترويسة مائية محددة وحدود تسطير رأسية وأفقية) -->
              <thead class="bg-[#e6f1f4] text-slate-950 font-black border-b-2 border-slate-400 select-none">
                <tr>
                  <!-- Checkbox Column -->
                  <th class="py-4 px-4 w-12 text-center border-b-2 border-slate-400 border-l border-slate-300/80">
                    <input 
                      type="checkbox" 
                      ${allVisibleSelected ? 'checked' : ''}
                      onchange="window._stdTableToggleSelectAll('${tableId}', this.checked)"
                      class="w-4 h-4 rounded-md border-slate-300 text-amber-500 focus:ring-amber-500/20 cursor-pointer"
                      title="تحديد الكل"
                    >
                  </th>

                  <!-- Data Columns -->
                  ${config.columns.map(col => {
                    const isSorted = state.sortKey === col.key;
                    const sortIcon = isSorted 
                    ? (state.sortDir === 'asc' ? 'arrow-up' : 'arrow-down')
                    : 'arrow-up-down';
                    
                    const alignClass = col.align === 'center' ? 'text-center' : (col.align === 'left' ? 'text-left' : 'text-right');
                    const widthStyle = col.width ? `style="width: ${col.width}"` : '';

                    return `
                      <th ${widthStyle} class="py-4 px-4 ${alignClass} font-black text-slate-950 text-[12px] tracking-wide whitespace-nowrap border-b-2 border-slate-400 border-l border-slate-300/80">
                        ${col.sortable !== false ? `
                          <button 
                            onclick="window._stdTableSort('${tableId}', '${col.key}')" 
                            class="inline-flex items-center gap-1.5 hover:text-amber-600 transition cursor-pointer group focus:outline-hidden whitespace-nowrap"
                            title="ترتيب حسب ${col.label}"
                          >
                            <span>${col.label}</span>
                            <i data-lucide="${sortIcon}" class="w-3.5 h-3.5 ${isSorted ? 'text-amber-600' : 'text-slate-400 group-hover:text-amber-600'}"></i>
                          </button>
                        ` : `
                          <span class="whitespace-nowrap">${col.label}</span>
                        `}
                      </th>
                    `;
                  }).join('')}

                  <!-- Actions Header -->
                  ${config.actions || config.rowActions ? `
                    <th class="py-4 px-4 text-center font-black text-slate-950 text-[12px] w-28 whitespace-nowrap border-b-2 border-slate-400">
                      الإجراءات
                    </th>
                  ` : ''}
                </tr>
              </thead>

              <!-- Clean Data Rows (صفوف مسطرة أفقية كمستطيل ملون خفيف جداً بلون مائي خفيف وتسطير واضح) -->
              <tbody class="divide-y divide-slate-300 font-semibold text-slate-950">
                ${paginatedData.length === 0 ? `
                  <tr>
                    <td colspan="${config.columns.length + 2}" class="py-16 px-6 text-center border-b border-slate-300 bg-[#f7fbfd]">
                      <div class="max-w-md mx-auto space-y-3">
                        <div class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 border border-amber-300 mx-auto flex items-center justify-center">
                          <i data-lucide="inbox" class="w-7 h-7"></i>
                        </div>
                        <h3 class="text-sm font-black text-slate-950">لا توجد بيانات مطابقة</h3>
                        <p class="text-xs text-slate-600 font-bold leading-relaxed">
                          ${state.searchQuery ? `لم يتم العثور على نتائج للبحث عن "${state.searchQuery}". جرب كلمة بحث أخرى.` : (config.emptySubtitle || 'القائمة فارغة حالياً ومجهزة لإضافة بيانات جديدة.')}
                        </p>
                        ${config.onAdd ? `
                          <div class="pt-2">
                            <button onclick="window._stdTableAction('${tableId}', 'add')" class="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition cursor-pointer">
                              + إضافة عنصر جديد
                            </button>
                          </div>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                ` : paginatedData.map((row, index) => {
                  const rowId = row.id || row._id || row.key || index;
                  const isSelected = state.selectedIds.has(rowId);
                  const isEven = index % 2 === 1;
                  // مستطيل ملون خفيف جداً بلون مائي مع تمييز التسطير
                  const rowBg = isSelected ? 'bg-amber-100/75' : (isEven ? 'bg-[#edf6f9]' : 'bg-[#f7fbfd]');

                  return `
                    <tr class="border-b border-slate-300 hover:bg-[#dff0f5] transition-colors duration-150 ${rowBg}">
                      
                      <!-- Checkbox Cell -->
                      <td class="py-3.5 px-4 text-center whitespace-nowrap border-b border-slate-300 border-l border-slate-200/80">
                        <input 
                          type="checkbox" 
                          ${isSelected ? 'checked' : ''}
                          onchange="window._stdTableToggleSelect('${tableId}', '${rowId}')"
                          class="w-4 h-4 rounded-md border-slate-300 text-amber-500 focus:ring-amber-500/20 cursor-pointer"
                        >
                      </td>

                      <!-- Data Cells -->
                      ${config.columns.map(col => {
                        const val = row[col.key];
                        const alignClass = col.align === 'center' ? 'text-center' : (col.align === 'left' ? 'text-left' : 'text-right');

                        // If custom render function provided
                        if (col.render) {
                          return `<td class="py-3.5 px-4 ${alignClass} whitespace-nowrap border-b border-slate-300 border-l border-slate-200/80">${col.render(val, row, index)}</td>`;
                        }

                        // Default smart formatting
                        return `<td class="py-3.5 px-4 ${alignClass} text-slate-950 font-bold whitespace-nowrap border-b border-slate-300 border-l border-slate-200/80">${formatDefaultCell(val, col)}</td>`;
                      }).join('')}

                      <!-- Row Action Buttons -->
                      ${config.actions || config.rowActions ? `
                        <td class="py-3.5 px-4 text-center whitespace-nowrap border-b border-slate-300">
                          <div class="flex items-center justify-center gap-1.5 whitespace-nowrap">
                            ${(config.rowActions || []).map(act => `
                              <button 
                                onclick="window._stdTableRowAction('${tableId}', '${act.id}', ${index})"
                                class="p-1.5 rounded-lg ${act.className || 'bg-slate-100 text-slate-800 hover:bg-amber-500 hover:text-slate-950'} transition cursor-pointer border border-slate-200 shadow-xs" 
                                title="${act.title || act.label}"
                              >
                                <i data-lucide="${act.icon || 'edit-2'}" class="w-4 h-4"></i>
                              </button>
                            `).join('')}
                          </div>
                        </td>
                      ` : ''}

                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- ============================================================= -->
          <!-- 3. STANDARD PAGINATION & FOOTER (الترقيم والتنقل بين الصفحات مع إطار سفلي محدد) -->
          <!-- ============================================================= -->
          <div class="p-4 sm:p-5 border-t-2 border-slate-300 bg-[#f4f9fb] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-700 font-bold">
            
            <!-- Showing info & rows-per-page selector -->
            <div class="flex items-center gap-3 flex-wrap">
              <span>
                عرض <span class="font-black font-mono text-slate-950">${totalItems === 0 ? 0 : startIndex + 1}</span> إلى <span class="font-black font-mono text-slate-950">${endIndex}</span> من إجمالي <span class="font-black font-mono text-slate-950">${totalItems}</span> مدخلات
              </span>

              <div class="flex items-center gap-1.5 mr-2">
                <span>صفوف بالصفحة:</span>
                <select 
                  onchange="window._stdTableChangePageSize('${tableId}', this.value)"
                  class="bg-white border border-slate-300 rounded-lg px-2 py-1 font-black font-mono text-slate-950 focus:outline-hidden"
                >
                  <option value="5" ${state.rowsPerPage === 5 ? 'selected' : ''}>5</option>
                  <option value="10" ${state.rowsPerPage === 10 ? 'selected' : ''}>10</option>
                  <option value="25" ${state.rowsPerPage === 25 ? 'selected' : ''}>25</option>
                  <option value="50" ${state.rowsPerPage === 50 ? 'selected' : ''}>50</option>
                  <option value="100" ${state.rowsPerPage === 100 ? 'selected' : ''}>100</option>
                </select>
              </div>
            </div>

            <!-- Pagination Buttons -->
            <div class="flex items-center gap-1">
              <button 
                onclick="window._stdTableSetPage('${tableId}', 1)"
                ${state.currentPage === 1 ? 'disabled' : ''}
                class="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition text-slate-900"
                title="الصفحة الأولى"
              >
                <i data-lucide="chevrons-right" class="w-4 h-4"></i>
              </button>

              <button 
                onclick="window._stdTableSetPage('${tableId}', ${state.currentPage - 1})"
                ${state.currentPage === 1 ? 'disabled' : ''}
                class="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition font-black text-slate-900"
              >
                السابق
              </button>

              <!-- Page Number Chips -->
              <div class="flex items-center gap-1">
                ${generatePageNumbers(state.currentPage, totalPages).map(p => {
                  if (p === '...') {
                    return `<span class="px-2 text-slate-500 font-bold">...</span>`;
                  }
                  const isActive = p === state.currentPage;
                  return `
                    <button 
                      onclick="window._stdTableSetPage('${tableId}', ${p})"
                      class="w-8 h-8 rounded-lg font-black font-mono transition text-xs ${
                        isActive 
                          ? 'bg-amber-500 text-slate-950 shadow-xs shadow-amber-500/20' 
                          : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-900'
                      }"
                    >
                      ${p}
                    </button>
                  `;
                }).join('')}
              </div>

              <button 
                onclick="window._stdTableSetPage('${tableId}', ${state.currentPage + 1})"
                ${state.currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}
                class="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition font-black text-slate-900"
              >
                التالي
              </button>

              <button 
                onclick="window._stdTableSetPage('${tableId}', ${totalPages})"
                ${state.currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}
                class="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition text-slate-900"
                title="الصفحة الأخيرة"
              >
                <i data-lucide="chevrons-left" class="w-4 h-4"></i>
              </button>
            </div>

          </div>

        </div>
      </div>
    `;

    // Re-initialize Lucide Icons
    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    }

    // Attach configuration reference for event listeners
    window._stdTableConfigs = window._stdTableConfigs || {};
    window._stdTableConfigs[tableId] = {
      config,
      container: el,
      processedData
    };
  };

  // Helper: Default Smart Cell Formatter
  function formatDefaultCell(val, col) {
    if (val === null || val === undefined) return '<span class="text-slate-400">-</span>';

    // Status chips
    if (col.key === 'status' || col.isStatus) {
      const s = String(val).trim();
      let colorClass = 'bg-slate-100 text-slate-900 border border-slate-300';
      if (s === 'نشطة' || s === 'نشط' || s === 'مفعل' || s === 'منشورة' || s === 'مقبول') {
        colorClass = 'bg-emerald-100 text-emerald-950 border border-emerald-300';
      } else if (s === 'معلق' || s === 'قيد المراجعة' || s === 'قيد الانتظار' || s === 'قادمة') {
        colorClass = 'bg-amber-100 text-amber-950 border border-amber-300';
      } else if (s === 'متوقفة' || s === 'محظور' || s === 'مرفوض' || s === 'ملغي') {
        colorClass = 'bg-rose-100 text-rose-950 border border-rose-300';
      } else if (s === 'مكتملة' || s === 'مكتمل') {
        colorClass = 'bg-sky-100 text-sky-950 border border-sky-300';
      }
      return `<span class="px-2.5 py-1 rounded-lg text-xs font-black inline-block ${colorClass}">${s}</span>`;
    }

    // Number with formatting
    if (typeof val === 'number') {
      return `<span class="font-mono font-black text-slate-950">${val.toLocaleString()}</span>`;
    }

    // Currency values
    if (typeof val === 'string' && (val.includes('كوينز') || val.includes('🪙'))) {
      return `<span class="font-mono font-black text-amber-800">${val}</span>`;
    }

    // Code / IDs
    if (col.key === 'id' || col.key === '_id' || col.isCode) {
      return `<span class="font-mono font-black text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md text-[11px]">${val}</span>`;
    }

    return `<span class="text-slate-950 font-bold">${String(val)}</span>`;
  }

  // Helper: Pagination page numbers generator (with ellipsis ...)
  function generatePageNumbers(current, total) {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages = [];
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total);
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total);
    }
    return pages;
  }

  // =========================================================================
  // Global Event Handlers for Standard Table
  // =========================================================================
  window._stdTableSearch = function(tableId, query) {
    const state = getTableState(tableId);
    state.searchQuery = query;
    state.currentPage = 1;
    reRenderTable(tableId);
  };

  window._stdTableSort = function(tableId, colKey) {
    const state = getTableState(tableId);
    if (!colKey) {
      state.sortKey = null;
      state.sortDir = 'asc';
    } else if (state.sortKey === colKey) {
      state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      state.sortKey = colKey;
      state.sortDir = 'asc';
    }
    reRenderTable(tableId);
  };

  window._stdTableSetPage = function(tableId, page) {
    const state = getTableState(tableId);
    state.currentPage = page;
    reRenderTable(tableId);
  };

  window._stdTableChangePageSize = function(tableId, size) {
    const state = getTableState(tableId);
    state.rowsPerPage = parseInt(size, 10) || 10;
    state.currentPage = 1;
    reRenderTable(tableId);
  };

  window._stdTableToggleSelect = function(tableId, rowId) {
    const state = getTableState(tableId);
    if (state.selectedIds.has(rowId)) {
      state.selectedIds.delete(rowId);
    } else {
      state.selectedIds.add(rowId);
    }
    reRenderTable(tableId);
  };

  window._stdTableToggleSelectAll = function(tableId, checked) {
    const state = getTableState(tableId);
    const tableData = window._stdTableConfigs?.[tableId];
    if (!tableData) return;

    if (checked) {
      tableData.processedData.forEach(r => {
        const id = r.id || r._id || r.key;
        if (id !== undefined) state.selectedIds.add(id);
      });
    } else {
      state.selectedIds.clear();
    }
    reRenderTable(tableId);
  };

  window._stdTableClearSelection = function(tableId) {
    const state = getTableState(tableId);
    state.selectedIds.clear();
    reRenderTable(tableId);
  };

  window._stdTableAction = function(tableId, actionType) {
    const tableRef = window._stdTableConfigs?.[tableId];
    if (!tableRef) return;
    const { config } = tableRef;

    if (actionType === 'add' && config.onAdd) {
      config.onAdd();
    } else if (actionType === 'refresh') {
      if (config.onRefresh) {
        config.onRefresh();
      } else {
        reRenderTable(tableId);
      }
    } else if (actionType === 'export') {
      exportTableData(tableId);
    }
  };

  window._stdTableRowAction = function(tableId, actionId, rowIndex) {
    const tableRef = window._stdTableConfigs?.[tableId];
    if (!tableRef) return;
    const { config, processedData } = tableRef;
    const state = getTableState(tableId);
    const actualIndex = (state.currentPage - 1) * state.rowsPerPage + rowIndex;
    const row = processedData[actualIndex];

    const act = (config.rowActions || []).find(a => a.id === actionId);
    if (act && act.onClick) {
      act.onClick(row, actualIndex);
    }
  };

  window._stdTableBulkAction = function(tableId, actionType) {
    const tableRef = window._stdTableConfigs?.[tableId];
    if (!tableRef) return;
    const { config } = tableRef;
    const state = getTableState(tableId);
    const selectedIds = Array.from(state.selectedIds);

    if (actionType === 'delete' && config.onBulkDelete) {
      config.onBulkDelete(selectedIds);
      state.selectedIds.clear();
      reRenderTable(tableId);
    } else if (actionType === 'status' && config.onBulkStatus) {
      config.onBulkStatus(selectedIds);
      state.selectedIds.clear();
      reRenderTable(tableId);
    }
  };

  function exportTableData(tableId) {
    const tableRef = window._stdTableConfigs?.[tableId];
    if (!tableRef) return;
    const { config } = tableRef;
    const state = getTableState(tableId);

    const rows = config.data || [];
    const jsonStr = JSON.stringify(rows, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.tableId || 'table-export'}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function reRenderTable(tableId) {
    const tableRef = window._stdTableConfigs?.[tableId];
    if (tableRef) {
      window.renderStandardTable(tableRef.container, tableRef.config);
    }
  }

})();
