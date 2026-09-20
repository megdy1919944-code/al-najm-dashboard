/**
 * واجهة إدارة الغرف الصوتية المفصولة
 * Rooms & Live Audio Module - Loaded On-Demand
 */

(function() {
  window.AdminViewLoader.registerView('rooms', {
    name: 'إدارة الغرف الصوتية المباشرة',
    async render(container, params = {}) {
      container.innerHTML = `
        <div class="space-y-6 animate-fadeIn">
          <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-2xl font-black">
                🎙️
              </div>
              <div>
                <h2 class="text-base font-black text-slate-950">إدارة الغرف الصوتية المباشرة</h2>
                <p class="text-xs text-slate-500 font-bold mt-0.5">مراقبة البث المباشر، المايكات، وحظر الغرف المخالفة فورياً</p>
              </div>
            </div>
            <span class="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-300 text-xs font-black">
              342 غرفة نشطة الآن
            </span>
          </div>

          <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-xs">
            <div class="overflow-x-auto">
              <table class="w-full text-right text-xs">
                <thead>
                  <tr class="bg-slate-100 text-slate-800 font-black border-b-2 border-slate-300">
                    <th class="py-2.5 px-3">رقم الغرفة</th>
                    <th class="py-2.5 px-3">عنوان الغرفة</th>
                    <th class="py-2.5 px-3">صاحب الغرفة</th>
                    <th class="py-2.5 px-3">المايكات</th>
                    <th class="py-2.5 px-3">المستمعين</th>
                    <th class="py-2.5 px-3">الخلفية النشطة</th>
                    <th class="py-2.5 px-3">الحالة</th>
                    <th class="py-2.5 px-3 text-center">التحكم</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 font-bold text-slate-900">
                  <tr class="hover:bg-[#dff0f5] transition">
                    <td class="py-2.5 px-3 font-mono text-purple-700">#10294</td>
                    <td class="py-2.5 px-3 font-black">سهرات ليالي النجوم 🌟</td>
                    <td class="py-2.5 px-3">المايسترو (104422)</td>
                    <td class="py-2.5 px-3">8 / 10</td>
                    <td class="py-2.5 px-3 text-emerald-700 font-black">420 شخص</td>
                    <td class="py-2.5 px-3">قصر الملوك</td>
                    <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px]">بث مباشر 🎙️</span></td>
                    <td class="py-2.5 px-3 text-center">
                      <button class="px-2 py-1 bg-slate-100 rounded border border-slate-300 text-[10px] ml-1">دخول</button>
                      <button class="px-2 py-1 bg-rose-100 text-rose-800 rounded border border-rose-300 text-[10px]">إغلاق</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }
  });
})();
