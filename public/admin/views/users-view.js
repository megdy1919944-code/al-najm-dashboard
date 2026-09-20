/**
 * واجهة إدارة المستخدمين والرتب المفصولة
 * Users & Roles Module - Loaded On-Demand
 * ----------------------------------------------------
 * يتم تحميلها عند النقر على المستخدمين فقط مع كاش فوري.
 */

(function() {
  async function fetchUsersFromServer() {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Users API fallback:', e);
    }
    return [
      { id: 998877, name: 'مجدي النجم', role: 'مالك النظام (Super Admin)', coins: 5000000, diamonds: 250000, status: 'نشط', level: 99 },
      { id: 104422, name: 'المايسترو', role: 'مضيف معتمد', coins: 125000, diamonds: 8000, status: 'نشط', level: 42 },
      { id: 203311, name: 'سلطان الليل', role: 'مستخدم VIP', coins: 450000, diamonds: 15000, status: 'نشط', level: 56 },
      { id: 554433, name: 'سفير النجوم', role: 'وكيل معتمد', coins: 890000, diamonds: 45000, status: 'نشط', level: 68 },
      { id: 667788, name: 'أمير الصمت', role: 'مستخدم', coins: 12000, diamonds: 500, status: 'محظور مؤقتاً', level: 15 }
    ];
  }

  window.AdminViewLoader.registerView('users', {
    name: 'إدارة المستخدمين والحسابات',
    async render(container, params = {}) {
      const users = await fetchUsersFromServer();

      container.innerHTML = `
        <div class="space-y-6 animate-fadeIn">
          <!-- شريط الرأس والإحصائيات السريعة -->
          <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl font-black">
                👥
              </div>
              <div>
                <h2 class="text-base font-black text-slate-950">إدارة المستخدمين والحسابات</h2>
                <p class="text-xs text-slate-500 font-bold mt-0.5">التحكم في الرتب، الحظر، الأرصدة والتحقق من الهوية</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer transition shadow-xs">
                + إضافة مستخدم جديد
              </button>
            </div>
          </div>

          <!-- جدول المستخدمين القياسي الموحد -->
          <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-xs">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 border-b border-slate-200 pb-3">
              <input type="text" placeholder="بحث بالاسم أو الآيدي ID..." class="w-full sm:w-72 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-950 font-bold focus:bg-white focus:outline-hidden" />
              <div class="flex gap-2">
                <span class="text-xs font-black text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300">الإجمالي: ${users.length} مستخدم</span>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-right text-xs">
                <thead>
                  <tr class="bg-slate-100 text-slate-800 font-black border-b-2 border-slate-300">
                    <th class="py-2.5 px-3">الآيدي (ID)</th>
                    <th class="py-2.5 px-3">اسم الحساب</th>
                    <th class="py-2.5 px-3">الرتبة</th>
                    <th class="py-2.5 px-3">المستوى</th>
                    <th class="py-2.5 px-3">رصيد الكوينز 🟡</th>
                    <th class="py-2.5 px-3">الماس 💎</th>
                    <th class="py-2.5 px-3">الحالة</th>
                    <th class="py-2.5 px-3 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 font-bold text-slate-900">
                  ${users.map(u => `
                    <tr class="hover:bg-[#dff0f5] transition">
                      <td class="py-2.5 px-3 whitespace-nowrap font-mono text-amber-700">${u.id}</td>
                      <td class="py-2.5 px-3 whitespace-nowrap font-black">${u.name}</td>
                      <td class="py-2.5 px-3 whitespace-nowrap"><span class="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px]">${u.role}</span></td>
                      <td class="py-2.5 px-3 whitespace-nowrap">Lv.${u.level}</td>
                      <td class="py-2.5 px-3 whitespace-nowrap text-amber-600">${Number(u.coins).toLocaleString()}</td>
                      <td class="py-2.5 px-3 whitespace-nowrap text-sky-600">${Number(u.diamonds).toLocaleString()}</td>
                      <td class="py-2.5 px-3 whitespace-nowrap">
                        <span class="px-2 py-0.5 rounded-md text-[10px] ${u.status === 'نشط' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">${u.status}</span>
                      </td>
                      <td class="py-2.5 px-3 whitespace-nowrap text-center">
                        <button class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] border border-slate-300 ml-1">تعديل</button>
                        <button class="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-[10px] border border-amber-300">شحن</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }
  });

  window.AdminViewLoader.registerView('users_list', window.AdminViewLoader.viewCache['users']);
})();
