/**
 * واجهة الإدارة المالية والشحن المفصولة
 * Finance & Recharges Module - Loaded On-Demand
 */

(function() {
  window.AdminViewLoader.registerView('finance', {
    name: 'الإدارة المالية والشحن',
    async render(container, params = {}) {
      container.innerHTML = `
        <div class="space-y-6 animate-fadeIn">
          <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-black">
                💰
              </div>
              <div>
                <h2 class="text-base font-black text-slate-950">الإدارة المالية وبوابات الشحن</h2>
                <p class="text-xs text-slate-500 font-bold mt-0.5">متابعة الإيرادات، طلبات سحب الأرباح، وتوليد بطاقات الشحن</p>
              </div>
            </div>
            <button class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-xs">
              + توليد أكواد شحن جديدة 💳
            </button>
          </div>

          <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-xs">
            <h3 class="text-sm font-black text-slate-950 mb-3">سجل عمليات الشحن المباشرة</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-right text-xs">
                <thead>
                  <tr class="bg-slate-100 text-slate-800 font-black border-b-2 border-slate-300">
                    <th class="py-2.5 px-3">رقم العملية</th>
                    <th class="py-2.5 px-3">المستفيد</th>
                    <th class="py-2.5 px-3">طريقة الدفع</th>
                    <th class="py-2.5 px-3">الكوينز 🟡</th>
                    <th class="py-2.5 px-3">المبلغ ($)</th>
                    <th class="py-2.5 px-3">التاريخ</th>
                    <th class="py-2.5 px-3">الحالة</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 font-bold text-slate-900">
                  <tr class="hover:bg-[#dff0f5] transition">
                    <td class="py-2.5 px-3 font-mono text-amber-700">TX-99881</td>
                    <td class="py-2.5 px-3">مجدي النجم (998877)</td>
                    <td class="py-2.5 px-3">بطاقة ائتمانية (Stripe)</td>
                    <td class="py-2.5 px-3 text-amber-700 font-black">+1,000,000 🟡</td>
                    <td class="py-2.5 px-3 text-emerald-700 font-black">$100.00</td>
                    <td class="py-2.5 px-3 text-slate-500">2026-09-20 12:30</td>
                    <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px]">ناجحة ✅</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }
  });

  window.AdminViewLoader.registerView('wallet', window.AdminViewLoader.viewCache['finance']);
})();
