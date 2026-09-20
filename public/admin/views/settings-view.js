/**
 * واجهة الإعدادات والأمان المفصولة
 * Settings & System Config Module - Loaded On-Demand
 */

(function() {
  window.AdminViewLoader.registerView('settings', {
    name: 'إعدادات النظام والأمان',
    async render(container, params = {}) {
      container.innerHTML = `
        <div class="space-y-6 animate-fadeIn">
          <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center text-2xl font-black">
                ⚙️
              </div>
              <div>
                <h2 class="text-base font-black text-slate-950">إعدادات النظام والأمان</h2>
                <p class="text-xs text-slate-500 font-bold mt-0.5">التحكم في بوابات الدفع، مفاتيح الـ API، وسيرفرات الصوت Agora</p>
              </div>
            </div>
            <button class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs cursor-pointer shadow-xs">
              حفظ التعديلات 💾
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-xs space-y-3">
              <h3 class="text-xs font-black text-slate-900 border-b border-slate-200 pb-2">إعدادات السيرفر الصوتي (Agora WebRTC)</h3>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">Agora App ID</label>
                <input type="password" value="agora_live_stream_app_id_sample" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">Agora App Certificate</label>
                <input type="password" value="agora_cert_token_2026_secure" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold" />
              </div>
            </div>

            <div class="bg-white rounded-2xl border-2 border-slate-300 p-5 shadow-xs space-y-3">
              <h3 class="text-xs font-black text-slate-900 border-b border-slate-200 pb-2">إعدادات حماية الدخول والـ JWT</h3>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">JWT Secret Key</label>
                <input type="password" value="super_legend_recharge_secret_key_2026" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">جلسة تسجيل الدخول (ساعات)</label>
                <input type="number" value="72" class="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold" />
              </div>
            </div>
          </div>
        </div>
      `;
    }
  });
})();
