/**
 * واجهة الوكالات والمضيفين المفصولة
 * Agencies & Hosts Module - Loaded On-Demand
 */

(function() {
  window.AdminViewLoader.registerView('agencies', {
    name: 'إدارة الوكالات والمضيفين',
    async render(container, params = {}) {
      container.innerHTML = `
        <div class="space-y-6 animate-fadeIn">
          <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-black">
                🏢
              </div>
              <div>
                <h2 class="text-base font-black text-slate-950">إدارة الوكالات والمضيفين</h2>
                <p class="text-xs text-slate-500 font-bold mt-0.5">متابعة تارجت الوكالات، نسب العمولات، واعتماد المضيفين</p>
              </div>
            </div>
            <button class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow-xs">
              + تسجيل وكالة جديدة
            </button>
          </div>

          <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-xs">
            <div class="overflow-x-auto">
              <table class="w-full text-right text-xs">
                <thead>
                  <tr class="bg-slate-100 text-slate-800 font-black border-b-2 border-slate-300">
                    <th class="py-2.5 px-3">كود الوكالة</th>
                    <th class="py-2.5 px-3">اسم الوكالة</th>
                    <th class="py-2.5 px-3">المدير / المسؤول</th>
                    <th class="py-2.5 px-3">عدد المضيفين</th>
                    <th class="py-2.5 px-3">الإنتاج الشهري 💎</th>
                    <th class="py-2.5 px-3">نسبة العمولة</th>
                    <th class="py-2.5 px-3">الحالة</th>
                    <th class="py-2.5 px-3 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 font-bold text-slate-900">
                  <tr class="hover:bg-[#dff0f5] transition">
                    <td class="py-2.5 px-3 font-mono text-emerald-700">AGC-101</td>
                    <td class="py-2.5 px-3 font-black">وكالة النسر الذهبي</td>
                    <td class="py-2.5 px-3">أحمد الهاشمي</td>
                    <td class="py-2.5 px-3">48 مضيف</td>
                    <td class="py-2.5 px-3 text-sky-600 font-black">12,500,000 💎</td>
                    <td class="py-2.5 px-3">20%</td>
                    <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px]">معتمدة ⭐</span></td>
                    <td class="py-2.5 px-3 text-center"><button class="px-2 py-1 bg-slate-100 rounded border border-slate-300 text-[10px]">تفاصيل</button></td>
                  </tr>
                  <tr class="hover:bg-[#dff0f5] transition">
                    <td class="py-2.5 px-3 font-mono text-emerald-700">AGC-102</td>
                    <td class="py-2.5 px-3 font-black">وكالة المملكة</td>
                    <td class="py-2.5 px-3">سعود الدوسري</td>
                    <td class="py-2.5 px-3">35 مضيف</td>
                    <td class="py-2.5 px-3 text-sky-600 font-black">8,900,000 💎</td>
                    <td class="py-2.5 px-3">18%</td>
                    <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px]">معتمدة ⭐</span></td>
                    <td class="py-2.5 px-3 text-center"><button class="px-2 py-1 bg-slate-100 rounded border border-slate-300 text-[10px]">تفاصيل</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }
  });

  window.AdminViewLoader.registerView('hosts', window.AdminViewLoader.viewCache['agencies']);
})();
