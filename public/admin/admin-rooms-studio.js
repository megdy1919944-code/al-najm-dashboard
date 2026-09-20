/**
 * =========================================================================
 * AL-NAJM CLOUD DASHBOARD - LIVE ROOM STUDIO & MODERATION MODULE
 * (وحدة استوديو الرقابة المباشرة والصوت وفحص الصور - تحميل عند الطلب Lazy Loaded)
 * =========================================================================
 * هذا الملف مستقل بالكامل ويتم تحميله عند الطلب فقط لتسريع لوحة التحكم
 * وخفض استهلاك الذاكرة والشبكة.
 */

(function() {
  'use strict';

  // State & Cache
  const studioAudioStates = {};

  // Audio Monitoring Toggle
  window.toggleStudioAudioMonitoring = function(roomId) {
    const isCurrentlyMuted = studioAudioStates[roomId] === false;
    const newState = isCurrentlyMuted; // Toggle: if false, become true
    studioAudioStates[roomId] = newState;

    const btn = document.getElementById(`studioAudioToggleBtn_${roomId}`);
    const label = document.getElementById(`studioAudioToggleLabel_${roomId}`);
    
    if (btn && label) {
      if (newState) {
        btn.className = 'px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 text-white text-xs font-black transition cursor-pointer flex items-center gap-2 shadow-md active:scale-95';
        label.textContent = 'استماع الصوت: مفعّل 🟢';
        window.showAdminNotification ? window.showAdminNotification('تم تشغيل الاستماع الصوتي المباشر للغرفة 🔊', 'success') : null;
      } else {
        btn.className = 'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 text-xs font-black transition cursor-pointer flex items-center gap-2 shadow-md active:scale-95';
        label.textContent = 'استماع الصوت: متوقف 🔇';
        window.showAdminNotification ? window.showAdminNotification('تم كتم وإيقاف استماع الصوت مؤقتاً 🔇', 'info') : null;
      }
    }
  };

  window.updateStudioMonitorVolume = function(roomId, val) {
    const label = document.getElementById(`studioVolumeValue_${roomId}`);
    if (label) label.textContent = `${val}%`;
  };

  // Toggle Header Options Dropdown Menu (3 Stripes / Hamburger)
  window.toggleStudioOptionsMenu = function(force) {
    const dropdown = document.getElementById('studioHeaderMenuDropdown');
    if (!dropdown) return;
    if (force !== undefined) {
      if (force) {
        dropdown.classList.remove('hidden');
      } else {
        dropdown.classList.add('hidden');
      }
      return;
    }
    dropdown.classList.toggle('hidden');
  };

  // =========================================================================
  // LIVE 20-SEATS ROOM INSPECTION & CONTROLLER MODAL (غرفة المراقبة الحية)
  // =========================================================================
  window.openLiveRoomStudio = function(roomId) {
    const existing = document.getElementById('liveRoomStudioModal');
    if (existing) existing.remove();

    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const stats = window.getRoomSupportStats ? window.getRoomSupportStats(room) : { coins: 0, diamonds: 0, charm: 0, charmLevel: 1, topSupporter: { name: 'لا يوجد', amount: '0' }, dailyRank: 1 };

    const modalHtml = `
      <div id="liveRoomStudioModal" class="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto" dir="rtl">
        <div class="bg-white rounded-3xl border-2 border-slate-300 max-w-7xl w-[96vw] max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
          
          <!-- MODAL HEADER -->
          <div class="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b-2 border-slate-700 shrink-0">
            <div class="flex items-center gap-3">
              <div class="relative group cursor-pointer" onclick="window.openImageModerationBox('${room.image}', 'غلاف الغرفة', '${room.id}', '${room.title}', '${room.id}')" title="انقر لفحص وحظر صورة الغرفة">
                <img src="${room.image}" class="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500 shadow-md shrink-0 group-hover:scale-105 transition" alt="${room.title}" />
                <span class="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition">فحص 🔍</span>
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-base font-black text-white">${room.title}</h3>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-black flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>مراقبة البث الحية</span>
                  </span>
                  ${room.status === 'closed' ? '<span class="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black">مغلقة إدارياً 🛑</span>' : ''}
                </div>
                <div class="text-xs text-slate-300 flex items-center gap-3 mt-1">
                  <span>المضيف: <strong class="text-amber-400">${room.host}</strong> (${room.hostUserId || 'ID: 100291'})</span>
                  <span>الوكالة: <strong class="text-slate-200">${room.agencyName || 'مستقل'}</strong></span>
                  <span>${room.flag || '🌍'} ${room.countryName}</span>
                </div>
              </div>
            </div>

            <!-- Header Actions -->
            <div class="flex items-center gap-2">
              <!-- زر الثلاث شرطات (☰) وقائمة الخيارات الإدارية -->
              <div class="relative">
                <button 
                  type="button" 
                  id="studioHeaderMenuBtn"
                  onclick="window.toggleStudioOptionsMenu()"
                  class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-amber-400 text-amber-400 hover:text-white font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-xs active:scale-95"
                  title="قائمة الخيارات الإدارية الثلاث (☰)">
                  <i data-lucide="menu" class="w-4 h-4 text-amber-400"></i>
                  <span>خيارات الروم (☰)</span>
                  <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>

                <!-- Dropdown Menu -->
                <div 
                  id="studioHeaderMenuDropdown" 
                  class="hidden absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl border-2 border-slate-300 shadow-2xl p-2 z-[10000] text-slate-900 animate-in fade-in zoom-in-95 duration-150">
                  <div class="px-3 py-2 border-b border-slate-200 text-[11px] font-black text-slate-500">
                    الخيارات الإدارية السريعة
                  </div>
                  <div class="p-1 space-y-1">
                    <!-- 1. تغيير خلفية الروم -->
                    <button 
                      type="button" 
                      onclick="window.toggleStudioOptionsMenu(false); window.openChangeWallpaperModal('${room.id}')"
                      class="w-full p-2.5 rounded-xl hover:bg-[#edf6f9] border border-transparent hover:border-sky-300 flex items-center gap-3 transition text-right cursor-pointer group">
                      <div class="w-8 h-8 rounded-lg bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700 shrink-0 group-hover:scale-105 transition">
                        <i data-lucide="image" class="w-4 h-4"></i>
                      </div>
                      <div>
                        <div class="font-black text-xs text-slate-900">تغيير خلفية الروم</div>
                        <div class="text-[10px] text-slate-500 font-normal">اختيار من خلفيات فخمة أو رفع صورة</div>
                      </div>
                    </button>

                    <!-- 2. إلغاء خلفية مخالفة للقانون -->
                    <button 
                      type="button" 
                      onclick="window.toggleStudioOptionsMenu(false); window.reportAndResetIllegalWallpaper('${room.id}')"
                      class="w-full p-2.5 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-300 flex items-center gap-3 transition text-right cursor-pointer group">
                      <div class="w-8 h-8 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0 group-hover:scale-105 transition">
                        <i data-lucide="shield-alert" class="w-4 h-4"></i>
                      </div>
                      <div>
                        <div class="font-black text-xs text-rose-700">إلغاء خلفية مخالفة للقانون</div>
                        <div class="text-[10px] text-rose-600 font-normal">إلغاء فوري للخلفية وإعادة الافتراضية</div>
                      </div>
                    </button>

                    <!-- 3. استعراض الملف الشخصي للمتواجدين -->
                    <button 
                      type="button" 
                      onclick="window.toggleStudioOptionsMenu(false); window.openRoomAudienceInspector('${room.id}')"
                      class="w-full p-2.5 rounded-xl hover:bg-amber-50 border border-transparent hover:border-amber-300 flex items-center gap-3 transition text-right cursor-pointer group">
                      <div class="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 group-hover:scale-105 transition">
                        <i data-lucide="user-check" class="w-4 h-4"></i>
                      </div>
                      <div>
                        <div class="font-black text-xs text-slate-900">الملف الشخصي للمتواجدين</div>
                        <div class="text-[10px] text-slate-500 font-normal">عرض بروفايلات الحاضرين وإدارتهم</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Close studio modal button -->
              <button 
                type="button" 
                onclick="document.getElementById('liveRoomStudioModal').remove()" 
                class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer">
                <i data-lucide="x" class="w-5 h-5"></i>
              </button>
            </div>
          </div>

          <!-- ROOM LIVE METRICS & CHARM BAR (إحصائيات الدعم الكلي والجاذبية وأعلى الداعمين) -->
          <div class="px-4 py-2.5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b-2 border-slate-700 text-white flex items-center justify-between flex-wrap gap-3 shrink-0 shadow-sm">
            <div class="flex items-center gap-3 flex-wrap">
              <!-- 1. إحصائية الدعم الكلي بالكوينز والماسات -->
              <div class="flex items-center gap-2.5 bg-amber-500/15 border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-2xs">
                <span class="text-base">🪙</span>
                <div>
                  <div class="text-[10px] text-amber-300 font-bold">إجمالي الدعم الكلي داخل الروم</div>
                  <div class="font-black text-xs font-mono text-amber-300 flex items-center gap-2">
                    <span>${stats.coins.toLocaleString()} كوينز</span>
                    <span class="text-[10px] text-sky-300 font-bold bg-sky-950/70 px-1.5 py-0.2 rounded border border-sky-400/40 font-mono">💎 ${stats.diamonds.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <!-- 2. إحصائيات الجاذبية ومستوى الجاذبية -->
              <div class="flex items-center gap-2.5 bg-purple-500/15 border border-purple-500/40 px-3 py-1.5 rounded-xl shadow-2xs">
                <span class="text-base">✨</span>
                <div>
                  <div class="text-[10px] text-purple-300 font-bold">إحصائيات نقاط الجاذبية الكلية</div>
                  <div class="font-black text-xs font-mono text-purple-300 flex items-center gap-2">
                    <span>${stats.charm.toLocaleString()} نقطة</span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white font-black shadow-xs">Lv. ${stats.charmLevel}</span>
                  </div>
                </div>
              </div>

              <!-- 3. الداعم الأول في الروم -->
              <div class="flex items-center gap-2.5 bg-sky-500/15 border border-sky-500/40 px-3 py-1.5 rounded-xl shadow-2xs">
                <span class="text-base">👑</span>
                <div>
                  <div class="text-[10px] text-sky-300 font-bold">الداعم الأول في الروم</div>
                  <div class="font-black text-xs text-white flex items-center gap-1.5">
                    <span class="text-sky-200">${stats.topSupporter.name}</span>
                    <span class="font-mono text-amber-300 font-black text-xs">(${stats.topSupporter.amount})</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. ترتيب الغرفة اليومي في الدعم -->
            <div class="flex items-center gap-2">
              <div class="px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-2 shadow-inner">
                <span class="text-sm">🏆</span>
                <span>الترتيب اليومي:</span>
                <span class="text-amber-400 font-mono font-black text-xs">المركز #${stats.dailyRank} في الدعم</span>
              </div>
            </div>
          </div>

          <!-- LIVE AUDIO STREAM MONITORING BAR (شريط استماع الصوت المباشر بدون تعقيد تصميم) -->
          <div class="px-4 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b-2 border-slate-700 text-white flex items-center justify-between flex-wrap gap-3 shrink-0 shadow-inner">
            <div class="flex items-center gap-3 flex-wrap">
              <!-- Audio Toggle Button -->
              <button 
                type="button" 
                id="studioAudioToggleBtn_${room.id}"
                onclick="window.toggleStudioAudioMonitoring('${room.id}')"
                class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 text-white text-xs font-black transition cursor-pointer flex items-center gap-2 shadow-md active:scale-95">
                <i data-lucide="volume-2" class="w-4 h-4 text-white"></i>
                <span id="studioAudioToggleLabel_${room.id}">استماع الصوت: مفعّل 🟢</span>
              </button>

              <!-- Gift Launcher Button -->
              <button 
                type="button" 
                onclick="window.openStudioGiftLauncher('${room.id}')"
                class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-105 border-2 border-amber-300 text-slate-950 text-xs font-black transition cursor-pointer flex items-center gap-2 shadow-md active:scale-95">
                <span class="text-base">🎁</span>
                <span>إطلاق واختبار هدية في الروم</span>
              </button>

              <!-- Live Audio Waveform Animation -->
              <div class="flex items-center gap-1 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-700 shadow-inner">
                <div class="flex items-end gap-1 h-5 w-12 px-1">
                  <span class="w-1.5 bg-emerald-400 rounded-full animate-bounce h-3" style="animation-duration: 400ms;"></span>
                  <span class="w-1.5 bg-emerald-400 rounded-full animate-bounce h-5" style="animation-duration: 650ms;"></span>
                  <span class="w-1.5 bg-emerald-400 rounded-full animate-bounce h-2" style="animation-duration: 350ms;"></span>
                  <span class="w-1.5 bg-emerald-400 rounded-full animate-bounce h-4" style="animation-duration: 500ms;"></span>
                  <span class="w-1.5 bg-emerald-400 rounded-full animate-bounce h-3" style="animation-duration: 600ms;"></span>
                </div>
                <span class="text-[11px] font-bold text-emerald-400 mr-1">بث صوتي حي</span>
              </div>

              <!-- Current Active Speaker -->
              <div class="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                <span class="text-slate-400 font-bold">المتحدث الآن:</span>
                <span class="font-black text-amber-300 font-mono flex items-center gap-1">
                  <i data-lucide="mic" class="w-3.5 h-3.5 text-amber-400 animate-pulse"></i>
                  <span>${room.host} (المضيف)</span>
                </span>
              </div>
            </div>

            <div class="flex items-center gap-4 flex-wrap">
              <!-- Volume Control Slider -->
              <div class="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <i data-lucide="volume-1" class="w-4 h-4 text-slate-400"></i>
                <label for="studioVolumeSlider_${room.id}" class="text-[11px] text-slate-300 font-bold">مستوى الصوت:</label>
                <input 
                  type="range" 
                  id="studioVolumeSlider_${room.id}" 
                  min="0" 
                  max="100" 
                  value="80" 
                  oninput="window.updateStudioMonitorVolume('${room.id}', this.value)"
                  class="w-20 accent-emerald-500 cursor-pointer" />
                <span id="studioVolumeValue_${room.id}" class="text-[10px] font-mono text-emerald-300 font-bold">80%</span>
              </div>

              <div class="text-[10px] text-slate-400 hidden sm:flex items-center gap-1 font-mono">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-sky-400"></i>
                <span>مراقب خفي صامت (Silent Admin)</span>
              </div>
            </div>
          </div>

          <!-- MODAL BODY -->
          <div class="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-50/50 space-y-5">
            
            <!-- SECTION 1: AUDIENCE HORIZONTAL SCROLLER -->
            <div class="bg-white p-3.5 rounded-2xl border-2 border-slate-300 shadow-2xs">
              <div class="flex items-center justify-between mb-2.5">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
                  <h4 class="font-black text-xs text-slate-900">قائمة الحاضرين والمستمعين في الروم</h4>
                  <span class="px-2.5 py-0.5 rounded-full bg-sky-100 border border-sky-300 text-sky-950 font-mono font-bold text-[11px]">
                    ${(room.audience || []).length} عضو متواجد
                  </span>
                </div>
                
                <div class="flex items-center gap-1">
                  <button 
                    type="button" 
                    onclick="window.scrollStudioAudience('studioAudienceRow', -180)" 
                    class="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition cursor-pointer"
                    title="تمرير لليمين">
                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                  </button>
                  <button 
                    type="button" 
                    onclick="window.scrollStudioAudience('studioAudienceRow', 180)" 
                    class="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition cursor-pointer"
                    title="تمرير لليسار">
                    <i data-lucide="chevron-left" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>

              <!-- Scrollable Horizontal Strip -->
              <div 
                id="studioAudienceRow"
                onmousedown="window.initAudienceDragScroll(this, event)"
                class="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 select-none cursor-grab active:cursor-grabbing" 
                style="scrollbar-width: thin;">
                
                ${(room.audience || []).map(u => `
                  <div 
                    onclick="window.openRoomUserProfileModal('${room.id}', '${u.userId}', '${u.name}', '${u.avatar || ''}', ${u.vip || 0}, 'عضو مستمع')"
                    class="shrink-0 p-2.5 rounded-xl bg-[#f7fbfd] hover:bg-[#dff0f5] border border-slate-300 hover:border-sky-400 flex items-center gap-2.5 transition min-w-[220px] shadow-2xs group select-none cursor-pointer"
                    title="اضغط لعرض الملف الشخصي الكامل للعضو وإدارته">
                    <div class="relative shrink-0 group/img cursor-pointer" onclick="event.stopPropagation(); window.openImageModerationBox('${u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}', 'صورة مستخدم', '${u.userId}', '${u.name}', '${room.id}')" title="انقر لفحص وحظر الصورة">
                      <img 
                        src="${u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}" 
                        class="w-10 h-10 rounded-full object-cover border-2 border-slate-300 group-hover/img:border-rose-400 group-hover/img:scale-105 transition shadow-xs" 
                        alt="${u.name}" />
                      <span class="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] shadow-xs">
                        V${u.vip || 0}
                      </span>
                    </div>

                    <div class="min-w-0 flex-1">
                      <div class="font-black text-xs text-slate-950 truncate">${u.name}</div>
                      <div class="text-[10px] text-slate-500 font-mono">ID: ${u.userId}</div>
                    </div>

                    <div class="flex items-center gap-1 shrink-0" onclick="event.stopPropagation()">
                      <button 
                        type="button" 
                        onclick="window.kickUser24hFromStudio('${room.id}', '${u.userId}', '${u.name}')" 
                        class="p-1 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="طرد وحظر 24 ساعة">
                        <i data-lucide="user-x" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </div>
                `).join('')}

              </div>
            </div>

            <!-- ROOM STAGE CANVAS CONTAINER (يحتوي على طبقة الهدايا الخلفية، مصفوفة المقاعد والشات، وطبقة الهدايا العلوية) -->
            <div id="liveRoomStageCanvas_${room.id}" class="relative rounded-3xl overflow-hidden space-y-5">
              
              <!-- LAYER 1: BEHIND MICS & BEHIND CHAT GIFT LAYER (طبقة الهدايا خلف المايكات والشات وفوق الخلفية) -->
              <div id="studioBehindMicsGiftLayer_${room.id}" class="pointer-events-none absolute inset-0 z-0 overflow-hidden flex items-center justify-center"></div>

              <div class="relative z-10 space-y-5">
                <!-- SECTION 2: 20 SEATS MIC GRID -->
                <div class="bg-white/95 backdrop-blur-xs p-4 rounded-2xl border-2 border-slate-300 shadow-2xs space-y-3">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 font-bold">
                    <i data-lucide="mic" class="w-4 h-4"></i>
                  </div>
                  <div>
                    <h4 class="font-black text-xs text-slate-900">مصفوفة المايكات المباشرة (20 مقعد صوتي)</h4>
                    <span class="text-[10px] text-slate-500">تحكم فوري بالكتم، الإنزال، القفل، وتوجيه المتحدثين</span>
                  </div>
                </div>

                <!-- Global mic controls -->
                <div class="flex items-center gap-2">
                  <button 
                    type="button" 
                    onclick="window.muteAllSeatsInStudio('${room.id}')"
                    class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs">
                    <i data-lucide="mic-off" class="w-3.5 h-3.5"></i>
                    <span>كتم جميع المايكات 🔇</span>
                  </button>

                  <button 
                    type="button" 
                    onclick="window.unmuteAllSeatsInStudio('${room.id}')"
                    class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs">
                    <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                    <span>فتح المايكات 🎙️</span>
                  </button>
                </div>
              </div>

              <!-- 20-Seats Responsive Grid (5 columns x 4 rows on desktop) -->
              <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2.5 pt-2">
                ${(room.seats || []).map(seat => {
                  const isOccupied = seat.name && seat.name !== 'فارغ';
                  const isHost = seat.isHost || seat.id === 1;

                  return `
                    <div class="p-2 rounded-xl border-2 ${isHost ? 'bg-gradient-to-b from-amber-50 to-white border-amber-400' : isOccupied ? 'bg-[#f7fbfd] border-slate-300' : 'bg-slate-50/70 border-dashed border-slate-300'} flex flex-col items-center text-center relative group transition hover:shadow-xs">
                      
                      <!-- Seat Number Badge -->
                      <div class="w-full flex items-center justify-between text-[10px] font-mono px-1">
                        <span class="font-black ${isHost ? 'text-amber-800' : 'text-slate-500'}">#${seat.id}</span>
                        ${isHost ? '<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-black">المضيف 👑</span>' : ''}
                      </div>

                      <!-- Seat Avatar / Placeholder -->
                      <div class="my-1.5 relative ${isOccupied ? 'cursor-pointer group/avatar' : ''}" 
                        ${isOccupied ? `onclick="event.stopPropagation(); window.openImageModerationBox('${seat.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}', 'صورة متحدث على مايك', '${seat.userId || '100' + seat.id}', '${seat.name}', '${room.id}', ${seat.id})" title="انقر لفحص وحظر الصورة"` : ''}>
                        ${isOccupied ? `
                          <img 
                            src="${seat.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}" 
                            class="w-11 h-11 rounded-full object-cover border-2 ${isHost ? 'border-amber-500 ring-2 ring-amber-300' : 'border-slate-300'} group-hover/avatar:border-rose-400 group-hover/avatar:scale-105 transition shadow-xs" 
                            alt="${seat.name}" />
                          ${seat.isMuted ? '<span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px]">🔇</span>' : ''}
                        ` : seat.isLocked ? `
                          <div class="w-11 h-11 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-500">
                            <i data-lucide="lock" class="w-4 h-4"></i>
                          </div>
                        ` : `
                          <div class="w-11 h-11 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                            <i data-lucide="mic" class="w-4 h-4 text-slate-300"></i>
                          </div>
                        `}
                      </div>

                      <!-- Occupant Name or Empty -->
                      <div class="w-full">
                        <div class="font-black text-xs text-slate-900 truncate px-1" title="${seat.name || 'فارغ'}">
                          ${seat.name || 'فارغ'}
                        </div>
                        <div class="text-[9px] text-slate-400 font-mono">
                          ${isOccupied ? (seat.isMuted ? 'مكتوم 🔇' : 'يتحدث 🎙️') : (seat.isLocked ? 'مقفل 🔒' : 'متاح')}
                        </div>
                      </div>

                      <!-- Micro seat controls -->
                      <div class="flex items-center gap-1 mt-2 pt-1 border-t border-slate-200 w-full justify-center">
                        ${isOccupied ? `
                          <!-- Mute/Unmute -->
                          <button 
                            type="button" 
                            onclick="window.toggleSeatMute('${room.id}', ${seat.id})" 
                            class="p-1 rounded-md ${seat.isMuted ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'} transition cursor-pointer"
                            title="${seat.isMuted ? 'إلغاء الكتم' : 'كتم المايك'}">
                            <i data-lucide="${seat.isMuted ? 'mic-off' : 'mic'}" class="w-3 h-3"></i>
                          </button>

                          ${!isHost ? `
                            <!-- Kick / Down from mic -->
                            <button 
                              type="button" 
                              onclick="window.removeUserFromSeat('${room.id}', ${seat.id})" 
                              class="p-1 rounded-md bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
                              title="إنزال العضو من المايك">
                              <i data-lucide="arrow-down-circle" class="w-3 h-3"></i>
                            </button>
                          ` : ''}
                        ` : `
                          <!-- Lock/Unlock empty seat -->
                          <button 
                            type="button" 
                            onclick="window.toggleSeatLock('${room.id}', ${seat.id})" 
                            class="p-1 rounded-md ${seat.isLocked ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'} transition cursor-pointer"
                            title="${seat.isLocked ? 'فتح المقعد' : 'قفل المقعد'}">
                            <i data-lucide="${seat.isLocked ? 'lock' : 'unlock'}" class="w-3 h-3"></i>
                          </button>
                        `}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- SECTION 3: ROOM NOTICE & CHAT INSPECTION -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              <!-- Room Notice & Fast Setup Card -->
              <div class="bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-2xs space-y-4">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700 font-bold">
                    <i data-lucide="bell" class="w-4 h-4"></i>
                  </div>
                  <h4 class="font-black text-xs text-slate-900">إشعار ولوحة معلومات الغرفة</h4>
                </div>

                <div class="space-y-3">
                  <div>
                    <label class="block text-[11px] font-black text-slate-700 mb-1">نص إشعار الغرفة المعروض للحضور:</label>
                    <textarea 
                      id="studioNoticeInput" 
                      rows="3" 
                      class="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-sky-500 shadow-inner">${room.notice || 'أهلاً بكم في الغرفة الرسمية لنجم، نرجو الالتزام بقواعد الاحترام وحسن التواصل.'}</textarea>
                  </div>

                  <button 
                    type="button" 
                    onclick="window.saveStudioNotice('${room.id}')"
                    class="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs">
                    <i data-lucide="check" class="w-3.5 h-3.5"></i>
                    <span>تحديث وحفظ الإشعار فوراً</span>
                  </button>
                </div>

                <!-- Wallpaper quick controls -->
                <div class="pt-3 border-t border-slate-200">
                  <div class="text-[11px] font-black text-slate-700 mb-2">التحكم السريع في خلفية الروم:</div>
                  <div class="grid grid-cols-2 gap-2">
                    <button 
                      type="button" 
                      onclick="window.openChangeWallpaperModal('${room.id}')"
                      class="p-2 rounded-xl bg-slate-100 hover:bg-[#edf6f9] border border-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5">
                      <i data-lucide="image" class="w-3.5 h-3.5 text-sky-600"></i>
                      <span>تغيير الخلفية</span>
                    </button>

                    <button 
                      type="button" 
                      onclick="window.resetRoomWallpaper('${room.id}')"
                      class="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-slate-800 hover:text-rose-700 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5">
                      <i data-lucide="refresh-ccw" class="w-3.5 h-3.5"></i>
                      <span>إعادة للافتراضية</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Live Chat Feed & Management (2 Columns) -->
              <div class="lg:col-span-2 bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-2xs flex flex-col h-[400px]">
                <div class="flex items-center justify-between mb-2 shrink-0">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold">
                      <i data-lucide="message-square" class="w-4 h-4"></i>
                    </div>
                    <div>
                      <h4 class="font-black text-xs text-slate-900">شات ومحادثات الروم المباشرة</h4>
                      <span class="text-[10px] text-slate-500">مراقبة وفحص رسائل الأعضاء وتوجيه الإنذارات</span>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onclick="window.clearStudioChat('${room.id}')"
                    class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-slate-600 hover:text-rose-700 text-xs font-bold transition cursor-pointer flex items-center gap-1">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    <span>مسح الشات</span>
                  </button>
                </div>

                <!-- Chat Quick Announcement Preset Chips -->
                <div class="py-2 flex items-center gap-1.5 overflow-x-auto shrink-0 select-none" style="scrollbar-width: none;">
                  <span class="text-[10px] text-slate-500 font-bold shrink-0">قوالب سريعة:</span>
                  <button 
                    type="button" 
                    onclick="window.setStudioAdminQuickMsg('⚠️ تنبيه رسمي: نرجو من الجميع الالتزام بقوانين الروم والاحترام المتبادل')"
                    class="px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-[10px] font-bold shrink-0 cursor-pointer">
                    ⚠️ تنبيه بالقوانين
                  </button>
                  <button 
                    type="button" 
                    onclick="window.setStudioAdminQuickMsg('🎙️ تذكير: يرجى كتم المايك عند عدم التحدث لتفادي التشويش')"
                    class="px-2 py-0.5 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-950 text-[10px] font-bold shrink-0 cursor-pointer">
                    🎙️ كتم المايك
                  </button>
                  <button 
                    type="button" 
                    onclick="window.setStudioAdminQuickMsg('🛑 تحذير نهائي: يمنع تكرار المخالفات وسيتم تطبيق حظر 24 ساعة فوراً')"
                    class="px-2 py-0.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-950 text-[10px] font-bold shrink-0 cursor-pointer">
                    🛑 تحذير نهائي
                  </button>
                </div>

                <!-- Messages Feed Container -->
                <div class="overflow-y-auto space-y-2.5 flex-1 p-3 bg-slate-50/80 border border-slate-200 rounded-xl" id="studioChatFeed" style="scrollbar-width: thin;">
                  ${(room.chat || []).length === 0 ? `
                    <div class="text-center py-16 text-slate-400 text-xs font-bold flex flex-col items-center gap-2">
                      <span class="text-2xl">💬</span>
                      <span>لا توجد رسائل مسجلة بعد في هذه الغرفة</span>
                    </div>
                  ` : (room.chat || []).map(m => `
                    <div class="p-2.5 rounded-xl ${m.isSystem ? 'bg-amber-50 border-2 border-amber-300/80 text-amber-950 shadow-2xs' : 'bg-white border border-slate-200 text-slate-900 shadow-2xs hover:border-slate-300'} transition">
                      <div class="flex items-center justify-between text-[11px] mb-1">
                        <div class="flex items-center gap-1.5">
                          ${m.isSystem ? `
                            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                            <span class="font-black text-amber-900 flex items-center gap-1">
                              <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-amber-600"></i>
                              <span>${m.user}</span>
                            </span>
                          ` : `
                            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span class="font-black text-slate-950">${m.user}</span>
                            <span class="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-black">عضو</span>
                          `}
                        </div>
                        <span class="font-mono text-[10px] ${m.isSystem ? 'text-amber-800' : 'text-slate-400'} font-bold">${m.time}</span>
                      </div>
                      <div class="text-xs leading-relaxed font-bold ${m.isSystem ? 'text-amber-950 font-black' : 'text-slate-800'}">
                        ${m.text}
                      </div>
                    </div>
                  `).join('')}
                </div>

                <!-- Send Admin Announcement to Room -->
                <div class="mt-3 pt-3 border-t border-slate-200 flex items-center gap-2 shrink-0">
                  <input 
                    type="text" 
                    id="studioAdminMsgInput" 
                    placeholder="اكتب رسالة أو تحذيراً إدارياً للبث المباشر..." 
                    class="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 shadow-inner" 
                    onkeydown="if(event.key==='Enter') window.sendStudioAdminMessage('${room.id}')" />
                  
                  <button 
                    type="button" 
                    onclick="window.sendStudioAdminMessage('${room.id}')"
                    class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer transition flex items-center gap-1.5 shadow-xs shrink-0">
                    <span>إرسال</span>
                    <i data-lucide="send" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </div>
            </div>
              </div>

              <!-- LAYER 2: ABOVE MICS GIFT LAYER (طبقة الهدايا السينمائية العلوية فوق المايكات والشات) -->
              <div id="studioAboveMicsGiftLayer_${room.id}" class="pointer-events-none absolute inset-0 z-50 overflow-hidden flex items-center justify-center"></div>

            </div>
          </div>

          <!-- MODAL FOOTER -->
          <div class="p-4 bg-slate-100 border-t-2 border-slate-300 flex items-center justify-between shrink-0 flex-wrap gap-2">
            <div class="text-xs text-slate-600 font-bold flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full ${room.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
              <span>حالة الروم: <strong>${room.status === 'active' ? 'مفتوح ومتصل بالسيرفر' : 'مغلق إدارياً'}</strong></span>
            </div>

            <div class="flex items-center gap-2">
              <!-- Force Close Button -->
              <button 
                type="button" 
                onclick="window.toggleRoomForceClose('${room.id}'); window.openLiveRoomStudio('${room.id}');"
                class="px-4 py-2 rounded-xl ${room.status === 'closed' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'} font-black text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5">
                <i data-lucide="${room.status === 'closed' ? 'play' : 'power'}" class="w-4 h-4"></i>
                <span>${room.status === 'closed' ? 'إعادة فتح الروم 🟢' : 'إغلاق الغرفة وطرد الحضور 🛑'}</span>
              </button>

              <button 
                type="button" 
                onclick="document.getElementById('liveRoomStudioModal').remove()" 
                class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition cursor-pointer">
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) lucide.createIcons();
  };

  // =========================================================================
  // ACTIONS: SEATS & MODERATION
  // =========================================================================
  window.toggleSeatMute = function(roomId, seatId) {
    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room || !room.seats) return;

    const seat = room.seats.find(s => s.id === seatId);
    if (!seat) return;

    seat.isMuted = !seat.isMuted;
    if (window.saveActiveVoiceRooms) window.saveActiveVoiceRooms(rooms);

    if (window.sendRoomModerationCommand) {
      window.sendRoomModerationCommand(roomId, seat.isMuted ? 'mute_seat' : 'unmute_seat', seatId, { targetState: seat.isMuted });
    }

    window.openLiveRoomStudio(roomId);
    window.showAdminNotification ? window.showAdminNotification(`تم ${seat.isMuted ? 'كتم مايك 🔇' : 'إلغاء كتم مايك 🎙️'} مقعد ${seatId} (${seat.name}) لحظياً!`, 'info') : null;
  };

  window.removeUserFromSeat = function(roomId, seatId) {
    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room || !room.seats) return;

    const seat = room.seats.find(s => s.id === seatId);
    if (!seat) return;

    const prevName = seat.name;
    seat.name = 'فارغ';
    seat.avatar = null;
    seat.isMuted = false;
    if (window.saveActiveVoiceRooms) window.saveActiveVoiceRooms(rooms);

    if (window.sendRoomModerationCommand) {
      window.sendRoomModerationCommand(roomId, 'kick_user', seatId, { kickedName: prevName });
    }

    window.openLiveRoomStudio(roomId);
    window.showAdminNotification ? window.showAdminNotification(`تم إنزال "${prevName}" من المقعد ${seatId} وفصل المايك بنجاح!`, 'warning') : null;
  };

  window.toggleSeatLock = function(roomId, seatId) {
    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room || !room.seats) return;

    const seat = room.seats.find(s => s.id === seatId);
    if (!seat) return;

    seat.isLocked = !seat.isLocked;
    if (window.saveActiveVoiceRooms) window.saveActiveVoiceRooms(rooms);

    if (window.sendRoomModerationCommand) {
      window.sendRoomModerationCommand(roomId, 'lock_seat', seatId, { targetState: seat.isLocked });
    }

    window.openLiveRoomStudio(roomId);
    window.showAdminNotification ? window.showAdminNotification(`تم ${seat.isLocked ? 'قفل 🔒' : 'فتح 🔓'} المقعد ${seatId}`, 'info') : null;
  };

  window.muteAllSeatsInStudio = function(roomId) {
    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room || !room.seats) return;

    room.seats.forEach(s => {
      s.isMuted = true;
    });
    if (window.saveActiveVoiceRooms) window.saveActiveVoiceRooms(rooms);

    if (window.sendRoomModerationCommand) {
      window.sendRoomModerationCommand(roomId, 'mute_all', 0);
    }

    window.openLiveRoomStudio(roomId);
    window.showAdminNotification ? window.showAdminNotification('تم كتم صوت جميع المايكات في الروم بنجاح! 🔇', 'warning') : null;
  };

  window.unmuteAllSeatsInStudio = function(roomId) {
    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room || !room.seats) return;

    room.seats.forEach(s => {
      s.isMuted = false;
    });
    if (window.saveActiveVoiceRooms) window.saveActiveVoiceRooms(rooms);

    if (window.sendRoomModerationCommand) {
      window.sendRoomModerationCommand(roomId, 'unmute_all', 0);
    }

    window.openLiveRoomStudio(roomId);
    window.showAdminNotification ? window.showAdminNotification('تم فتح وتفعيل جميع المايكات في الروم! 🎙️', 'success') : null;
  };

  window.saveStudioNotice = function(roomId) {
    const input = document.getElementById('studioNoticeInput');
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;

    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      room.notice = val;
      if (window.saveActiveVoiceRooms) window.saveActiveVoiceRooms(rooms);
      if (window.sendRoomModerationCommand) {
        window.sendRoomModerationCommand(roomId, 'update_notice', 0, { message: val });
      }
      window.showAdminNotification ? window.showAdminNotification('تم حفظ وتحديث إشعار الروم وإرساله للمشتركين! 📢', 'success') : null;
    }
  };

  window.resetRoomWallpaper = function(roomId) {
    if (!confirm('هل أنت متأكد من إزالة خلفية الروم وإعادتها للخلفية الافتراضية؟')) return;

    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    room.image = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
    if (window.saveActiveVoiceRooms) window.saveActiveVoiceRooms(rooms);

    window.openLiveRoomStudio(roomId);
    const container = document.getElementById('dynamicViewContainer');
    if (container && window.renderRoomsManagementView) window.renderRoomsManagementView(container);

    window.showAdminNotification ? window.showAdminNotification('تمت إزالة الخلفية وتعيين الافتراضية بنجاح!', 'info') : null;
  };

  window.sendStudioAdminMessage = function(roomId) {
    const input = document.getElementById('studioAdminMsgInput');
    if (!input || !input.value.trim()) return;

    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    if (!room.chat) room.chat = [];
    room.chat.push({
      id: 'adm_' + Date.now(),
      user: '👑 تنبيه من الإدارة المركزية',
      text: input.value.trim(),
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      isSystem: true
    });
    input.value = '';

    if (window.saveActiveVoiceRooms) window.saveActiveVoiceRooms(rooms);
    window.openLiveRoomStudio(roomId);
  };

  window.clearStudioChat = function(roomId) {
    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    room.chat = [];
    if (window.saveActiveVoiceRooms) window.saveActiveVoiceRooms(rooms);
    window.openLiveRoomStudio(roomId);
    window.showAdminNotification ? window.showAdminNotification('تم مسح شات الروم بنجاح!', 'info') : null;
  };

  window.kickUser24hFromStudio = function(roomId, userId, userName) {
    if (!confirm(`هل أنت متأكد من طرد وحظر العضو "${userName}" (ID: ${userId}) لمدة 24 ساعة من هذه الغرفة؟`)) return;

    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    // Remove from audience
    if (room.audience) {
      room.audience = room.audience.filter(a => a.userId !== userId);
    }
    // Remove from seats if sitting
    if (room.seats) {
      room.seats.forEach(s => {
        if (s.name === userName) {
          s.name = 'فارغ';
          s.avatar = null;
          s.isMuted = false;
        }
      });
    }

    if (!room.chat) room.chat = [];
    room.chat.push({
      id: 'kick_' + Date.now(),
      user: 'نظام الحظر',
      text: `تم طرد وحظر ${userName} لمدة 24 ساعة بواسطة الإدارة 🚫`,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      isSystem: true
    });

    if (window.saveActiveVoiceRooms) window.saveActiveVoiceRooms(rooms);
    window.openLiveRoomStudio(roomId);
    window.showAdminNotification ? window.showAdminNotification(`تم طرد وحظر "${userName}" لمدة 24 ساعة بنجاح! 🚫`, 'error') : null;
  };

  // Drag Scroll and Preset Helpers
  window.scrollStudioAudience = function(elementId, distance) {
    const el = document.getElementById(elementId);
    if (el) el.scrollBy({ left: distance, behavior: 'smooth' });
  };

  window.initAudienceDragScroll = function(el, e) {
    if (e.target.closest('button')) return;
    let isDown = true;
    let startX = e.pageX - el.offsetLeft;
    let scrollLeft = el.scrollLeft;

    const onMouseMove = function(ev) {
      if (!isDown) return;
      ev.preventDefault();
      const x = ev.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = function() {
      isDown = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  window.setStudioAdminQuickMsg = function(msg) {
    const input = document.getElementById('studioAdminMsgInput');
    if (input) {
      input.value = msg;
      input.focus();
    }
  };

  // =========================================================================
  // WALLPAPER MODAL LOGIC
  // =========================================================================
  window.openChangeWallpaperModal = function(roomId) {
    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const existing = document.getElementById('changeRoomWallpaperModal');
    if (existing) existing.remove();

    const presets = [
      { name: 'قصر ملكي ذهبي', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
      { name: 'فضاء ونجوم نيون', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800' },
      { name: 'يخت بحري فاخر', url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800' },
      { name: 'استوديو كلاسيكي', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800' },
      { name: 'واحة الطبيعة', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' },
      { name: 'أضواء ناطحات السحاب', url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=800' }
    ];

    const modal = document.createElement('div');
    modal.id = 'changeRoomWallpaperModal';
    modal.className = 'fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center z-[10020] p-4 animate-in fade-in duration-200';
    modal.innerHTML = `
      <div class="bg-white rounded-3xl border-2 border-slate-300 max-w-xl w-full flex flex-col shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        <!-- Header -->
        <div class="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between border-b-2 border-slate-700">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-400 font-bold">
              <i data-lucide="image" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="font-black text-sm text-white">تغيير خلفية الغرفة</h3>
              <p class="text-[10px] text-slate-300 font-mono">${room.title} (ID: ${room.id})</p>
            </div>
          </div>
          <button 
            type="button" 
            onclick="document.getElementById('changeRoomWallpaperModal').remove()" 
            class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 space-y-4 overflow-y-auto max-h-[80vh]">
          <div>
            <label class="block text-xs font-black text-slate-800 mb-1.5">المعاينة المباشرة للخلفية:</label>
            <div class="relative h-40 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-inner group">
              <img 
                id="previewWallpaperImg" 
                src="${room.image}" 
                class="w-full h-full object-cover transition duration-300" 
                alt="Room Wallpaper Preview" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                <span class="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                  خلفية الغرفة الحالية
                </span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-slate-800 mb-1.5">اختر من الخلفيات الجاهزة الفاخرة:</label>
            <div class="grid grid-cols-3 gap-2">
              ${presets.map((p) => `
                <button 
                  type="button" 
                  onclick="window.selectWallpaperPreset('${p.url}')"
                  class="p-1.5 rounded-xl border-2 border-slate-200 hover:border-sky-500 bg-slate-50 hover:bg-sky-50/50 flex flex-col items-center gap-1 transition cursor-pointer group text-center">
                  <img src="${p.url}" class="w-full h-14 rounded-lg object-cover group-hover:scale-102 transition" alt="${p.name}" />
                  <span class="text-[10px] font-bold text-slate-800 truncate w-full">${p.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-slate-800 mb-1.5">أو أدخل رابط صورة مخصص (Direct Image URL):</label>
            <div class="flex items-center gap-2">
              <input 
                type="url" 
                id="customWallpaperUrlInput" 
                value="${room.image}" 
                placeholder="https://example.com/wallpaper.jpg" 
                class="flex-1 px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-300 text-slate-900 text-xs font-mono focus:bg-white focus:border-sky-500 outline-hidden transition" />
              <button 
                type="button" 
                onclick="window.previewCustomWallpaperInput()" 
                class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-800 text-xs font-black transition cursor-pointer shrink-0">
                معاينة 👁️
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-black text-slate-800 mb-1.5">أو رفع صورة مباشرة من جهازك:</label>
            <input 
              type="file" 
              accept="image/*" 
              id="uploadWallpaperFileInput"
              onchange="window.handleWallpaperFileUpload(event)"
              class="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-sky-100 file:text-sky-800 hover:file:bg-sky-200 cursor-pointer" />
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button 
            type="button" 
            onclick="document.getElementById('changeRoomWallpaperModal').remove()" 
            class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black transition cursor-pointer">
            إلغاء
          </button>
          <button 
            type="button" 
            onclick="window.saveRoomWallpaperChoice('${room.id}')" 
            class="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black transition cursor-pointer flex items-center gap-2 shadow-xs active:scale-95">
            <i data-lucide="check" class="w-4 h-4"></i>
            <span>حفظ وتطبيق الخلفية على الروم</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();
  };

  window.selectWallpaperPreset = function(url) {
    const img = document.getElementById('previewWallpaperImg');
    const input = document.getElementById('customWallpaperUrlInput');
    if (img) img.src = url;
    if (input) input.value = url;
  };

  window.previewCustomWallpaperInput = function() {
    const input = document.getElementById('customWallpaperUrlInput');
    const img = document.getElementById('previewWallpaperImg');
    if (input && img && input.value.trim()) {
      img.src = input.value.trim();
    }
  };

  window.handleWallpaperFileUpload = function(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      const url = evt.target.result;
      const img = document.getElementById('previewWallpaperImg');
      const input = document.getElementById('customWallpaperUrlInput');
      if (img) img.src = url;
      if (input) input.value = url;
    };
    reader.readAsDataURL(file);
  };

  window.saveRoomWallpaperChoice = function(roomId) {
    const input = document.getElementById('customWallpaperUrlInput');
    if (!input || !input.value.trim()) return;
    const newUrl = input.value.trim();

    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    room.image = newUrl;
    if (!room.chat) room.chat = [];
    room.chat.push({
      id: 'bg_' + Date.now(),
      user: 'نظام الغرفة الإداري',
      text: '🎨 قامت الإدارة بتحديث وتعيين خلفية جديدة فاخرة للغرفة.',
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      isSystem: true
    });

    if (window.saveActiveVoiceRooms) window.saveActiveVoiceRooms(rooms);
    if (window.sendRoomModerationCommand) {
      window.sendRoomModerationCommand(roomId, 'update_wallpaper', 0, { url: newUrl });
    }

    const modal = document.getElementById('changeRoomWallpaperModal');
    if (modal) modal.remove();

    window.openLiveRoomStudio(roomId);
    const container = document.getElementById('dynamicViewContainer');
    if (container && window.renderRoomsManagementView) window.renderRoomsManagementView(container);

    window.showAdminNotification ? window.showAdminNotification('تم حفظ وتطبيق خلفية الغرفة الجديدة بنجاح! 🎨', 'success') : null;
  };

  window.reportAndResetIllegalWallpaper = function(roomId) {
    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const confirmed = confirm(
      `⚠️ تحذير رقابي عاجل:\n\nهل أنت متأكد من إلغاء وحذف خلفية غرفة "${room.title}" فوراً لمخالفتها الآداب العامة والقوانين والسياسات؟\n\nسيتم إرجاع الخلفية الافتراضية الآمنة وإرسال إشعار رسمي فوري في شات الروم.`
    );
    if (!confirmed) return;

    room.image = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
    
    if (!room.chat) room.chat = [];
    room.chat.push({
      id: 'bg_ban_' + Date.now(),
      user: 'إدارة الرقابة والمحتوى',
      text: '⚠️ تنبيه نظامي: قامت الإدارة بإلغاء وحذف خلفية الغرفة فوراً لمخالفتها القوانين واللوائح التنظيمية.',
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      isSystem: true
    });

    if (window.saveActiveVoiceRooms) window.saveActiveVoiceRooms(rooms);
    if (window.sendRoomModerationCommand) {
      window.sendRoomModerationCommand(roomId, 'reset_wallpaper', 0, { reason: 'illegal_content' });
    }

    window.openLiveRoomStudio(roomId);
    const container = document.getElementById('dynamicViewContainer');
    if (container && window.renderRoomsManagementView) window.renderRoomsManagementView(container);

    window.showAdminNotification ? window.showAdminNotification('تم إلغاء الخلفية المخالفة وتعيين الخلفية الآمنة الافتراضية بنجاح 🛡️', 'error') : null;
  };

  // =========================================================================
  // AUDIENCE INSPECTOR MODAL
  // =========================================================================
  window.openRoomAudienceInspector = function(roomId) {
    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const existing = document.getElementById('roomAudienceInspectorModal');
    if (existing) existing.remove();

    const listeners = room.audience || [];
    const speakers = (room.seats || []).filter(s => s.name && s.name !== 'فارغ');

    const modal = document.createElement('div');
    modal.id = 'roomAudienceInspectorModal';
    modal.className = 'fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center z-[10020] p-4 animate-in fade-in duration-200';
    modal.innerHTML = `
      <div class="bg-white rounded-3xl border-2 border-slate-300 max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        <div class="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between border-b-2 border-slate-700">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 font-bold">
              <i data-lucide="users" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="font-black text-sm text-white">دليل المتواجدين في الغرفة</h3>
              <p class="text-[10px] text-slate-300">انقر على أي شخص لعرض ملفه الشخصي وإدارته</p>
            </div>
          </div>
          <button 
            type="button" 
            onclick="document.getElementById('roomAudienceInspectorModal').remove()" 
            class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          <div>
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-black text-xs text-slate-900 flex items-center gap-1.5">
                <span>🎙️ المتحدثون على المايكات</span>
                <span class="px-2 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold">${speakers.length}</span>
              </h4>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${speakers.map(s => `
                <div 
                  onclick="document.getElementById('roomAudienceInspectorModal').remove(); window.openRoomUserProfileModal('${room.id}', '${s.userId || '100' + s.id}', '${s.name}', '${s.avatar || ''}', ${s.vip || (s.isHost ? 5 : 1)}, '${s.isHost ? 'مضيف الروم الرئيسي' : 'متحدث مايك ' + s.id}', ${s.id})"
                  class="p-2.5 rounded-xl border border-slate-300 hover:border-amber-400 bg-white hover:bg-amber-50/40 flex items-center justify-between gap-2.5 transition cursor-pointer shadow-2xs group">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <img src="${s.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}" class="w-9 h-9 rounded-full object-cover border border-slate-300 group-hover:border-amber-400 shrink-0" />
                    <div class="min-w-0">
                      <div class="font-black text-xs text-slate-950 truncate">${s.name}</div>
                      <div class="text-[10px] text-slate-500 font-mono">${s.isHost ? '👑 المضيف' : 'مايك ' + s.id}</div>
                    </div>
                  </div>
                  <span class="px-2 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-black group-hover:bg-sky-600 group-hover:text-white transition shrink-0">
                    الملف الشخصي 👤
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2 pt-2 border-t border-slate-200">
              <h4 class="font-black text-xs text-slate-900 flex items-center gap-1.5">
                <span>👥 الحاضرون والمستمعون</span>
                <span class="px-2 py-0.2 rounded-full bg-sky-100 text-sky-900 border border-sky-300 text-[10px] font-mono font-bold">${listeners.length}</span>
              </h4>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${listeners.map(u => `
                <div 
                  onclick="document.getElementById('roomAudienceInspectorModal').remove(); window.openRoomUserProfileModal('${room.id}', '${u.userId}', '${u.name}', '${u.avatar || ''}', ${u.vip || 0}, 'عضو مستمع')"
                  class="p-2.5 rounded-xl border border-slate-300 hover:border-sky-400 bg-white hover:bg-sky-50/40 flex items-center justify-between gap-2.5 transition cursor-pointer shadow-2xs group">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <img src="${u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}" class="w-9 h-9 rounded-full object-cover border border-slate-300 group-hover:border-sky-400 shrink-0" />
                    <div class="min-w-0">
                      <div class="font-black text-xs text-slate-950 truncate">${u.name}</div>
                      <div class="text-[10px] text-slate-500 font-mono">ID: ${u.userId} • V${u.vip || 0}</div>
                    </div>
                  </div>
                  <span class="px-2 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-black group-hover:bg-sky-600 group-hover:text-white transition shrink-0">
                    الملف الشخصي 👤
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();
  };

  // =========================================================================
  // USER PROFILE MODAL
  // =========================================================================
  window.openRoomUserProfileModal = function(roomId, userId, userName, avatar, vip, roleTitle, seatId) {
    const existing = document.getElementById('userProfileInspectorModal');
    if (existing) existing.remove();

    const safeAvatar = avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
    const vipLevel = vip || 1;
    const richLevel = Math.min(99, vipLevel * 7 + 14);
    const charmLevel = Math.min(99, vipLevel * 6 + 18);
    const coinsBalance = (vipLevel * 25400 + 12000).toLocaleString();
    const diamondsBalance = (vipLevel * 14200 + 4500).toLocaleString();

    const modal = document.createElement('div');
    modal.id = 'userProfileInspectorModal';
    modal.className = 'fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center z-[10030] p-4 animate-in fade-in duration-200';
    modal.innerHTML = `
      <div class="bg-white rounded-3xl border-2 border-slate-300 max-w-lg w-full flex flex-col shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        <div class="relative h-28 bg-gradient-to-r from-slate-900 via-sky-900 to-indigo-950 p-3 flex justify-between items-start">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-[10px] font-black border border-white/30">
              ملف العضو الشخصي
            </span>
            <span class="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400 text-[10px] font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>متصل بالروم</span>
            </span>
          </div>
          <button 
            type="button" 
            onclick="document.getElementById('userProfileInspectorModal').remove()" 
            class="p-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white transition cursor-pointer">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="px-5 pb-4 -mt-12 relative flex items-end justify-between gap-3 border-b border-slate-200">
          <div class="flex items-end gap-3.5">
            <div class="relative">
              <img 
                src="${safeAvatar}" 
                class="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl bg-white" 
                alt="${userName}" />
              <span class="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] shadow-md border-2 border-white">
                VIP ${vipLevel}
              </span>
            </div>
            <div class="mb-1">
              <h3 class="text-base font-black text-slate-950 flex items-center gap-1.5">
                <span>${userName}</span>
                <span class="text-xs">👑</span>
              </h3>
              <div class="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                <span>ID: <strong class="text-slate-900">${userId}</strong></span>
                <button 
                  type="button" 
                  onclick="navigator.clipboard.writeText('${userId}'); window.showAdminNotification ? window.showAdminNotification('تم نسخ المعرّف بنجاح!', 'info') : null" 
                  class="p-0.5 text-sky-600 hover:text-sky-800 cursor-pointer" 
                  title="نسخ المعرّف">
                  <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
          </div>
          <span class="mb-1 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 text-xs font-black shrink-0">
            ${roleTitle || 'عضو في الغرفة'}
          </span>
        </div>

        <div class="p-5 space-y-4 overflow-y-auto max-h-[65vh]">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div class="p-2.5 rounded-xl bg-[#f7fbfd] border border-slate-200 text-center">
              <span class="text-[10px] text-slate-500 font-bold block">رصيد الكوينز</span>
              <span class="font-black text-xs text-amber-700 font-mono">🪙 ${coinsBalance}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-[#f7fbfd] border border-slate-200 text-center">
              <span class="text-[10px] text-slate-500 font-bold block">رصيد الماسات</span>
              <span class="font-black text-xs text-sky-700 font-mono">💎 ${diamondsBalance}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-[#f7fbfd] border border-slate-200 text-center">
              <span class="text-[10px] text-slate-500 font-bold block">مستوى الثراء</span>
              <span class="font-black text-xs text-emerald-700 font-mono">Lv. ${richLevel}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-[#f7fbfd] border border-slate-200 text-center">
              <span class="text-[10px] text-slate-500 font-bold block">مستوى الجاذبية</span>
              <span class="font-black text-xs text-purple-700 font-mono">Lv. ${charmLevel}</span>
            </div>
          </div>

          <div class="space-y-2 pt-2 border-t border-slate-200">
            <div class="text-xs font-black text-slate-900 mb-1">إجراءات الرقابة والإدارة السريعة:</div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button 
                type="button" 
                onclick="window.adminWarningToUser('${roomId}', '${userName}'); document.getElementById('userProfileInspectorModal').remove();" 
                class="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs">
                <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-amber-600"></i>
                <span>توجيه إنذار رسمي في الشات ⚠️</span>
              </button>

              <button 
                type="button" 
                onclick="document.getElementById('userProfileInspectorModal').remove(); window.kickUser24hFromStudio('${roomId}', '${userId}', '${userName}')" 
                class="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs">
                <i data-lucide="user-x" class="w-3.5 h-3.5 text-rose-600"></i>
                <span>طرد وحظر 24 ساعة من الروم 🚫</span>
              </button>
            </div>

            <button 
              type="button" 
              onclick="window.banUserAccountGlobal('${roomId}', '${userId}', '${userName}')" 
              class="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-rose-950 border border-slate-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs">
              <i data-lucide="shield-ban" class="w-3.5 h-3.5 text-rose-400"></i>
              <span>حظر الحساب كلياً وتجميده من المنصة ⛔</span>
            </button>
          </div>
        </div>

        <div class="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button 
            type="button" 
            onclick="document.getElementById('userProfileInspectorModal').remove()" 
            class="px-4 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-black transition cursor-pointer">
            إغلاق الملف
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();
  };

  // =========================================================================
  // SQUARE IMAGE INSPECTION & MODERATION BOX
  // =========================================================================
  window.openImageModerationBox = function(imageUrl, imageType, targetId, targetName, roomId, seatId) {
    const existing = document.getElementById('imageModerationInspectorModal');
    if (existing) existing.remove();

    const safeImg = imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
    const targetRoomId = roomId || targetId;

    const modal = document.createElement('div');
    modal.id = 'imageModerationInspectorModal';
    modal.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-[10050] p-4 animate-in fade-in duration-200';
    modal.innerHTML = `
      <div class="bg-white rounded-3xl border-2 border-slate-300 max-w-md w-full flex flex-col shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        <div class="p-4 bg-gradient-to-r from-slate-950 to-slate-900 text-white flex items-center justify-between border-b-2 border-slate-800">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400 font-bold">
              <i data-lucide="shield-alert" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="font-black text-sm text-white">مربع فحص ورقابة الصورة</h3>
              <p class="text-[10px] text-slate-300 font-mono">${imageType} • ${targetName}</p>
            </div>
          </div>
          <button 
            type="button" 
            onclick="document.getElementById('imageModerationInspectorModal').remove()" 
            class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="p-4 space-y-3.5">
          <div class="relative rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-950 shadow-inner flex items-center justify-center max-h-72">
            <img 
              src="${safeImg}" 
              id="inspectedModalImageTarget"
              class="w-full h-auto max-h-72 object-contain select-none" 
              alt="${targetName}" />
            <div class="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs border border-white/20 text-white text-[10px] font-black">
              ${imageType}
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-[#f7fbfd] border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span class="text-slate-500 font-bold block text-[10px]">المالك / الغرفة:</span>
              <strong class="text-slate-900 font-black">${targetName}</strong>
            </div>
            <div class="text-left font-mono">
              <span class="text-slate-500 font-bold block text-[10px]">المعرّف ID:</span>
              <span class="font-bold text-slate-800 text-xs">${targetId}</span>
            </div>
          </div>

          <div class="space-y-2">
            <button 
              type="button" 
              onclick="window.banAndResetViolatingImage('${safeImg.replace(/'/g, "\\'")}', '${imageType}', '${targetId}', '${targetName}', '${targetRoomId}', ${seatId || 'null'})"
              class="w-full p-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-98">
              <i data-lucide="ban" class="w-4 h-4"></i>
              <span>حظر الصورة واسترجاع صورة عادية افتراضية 🚫</span>
            </button>

            <div class="grid grid-cols-2 gap-2">
              <button 
                type="button" 
                onclick="window.adminWarningToUser('${targetRoomId}', '${targetName}'); document.getElementById('imageModerationInspectorModal').remove();"
                class="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs active:scale-95">
                <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-amber-600"></i>
                <span>توجيه إنذار رسمي ⚠️</span>
              </button>

              <button 
                type="button" 
                onclick="document.getElementById('imageModerationInspectorModal').remove(); window.kickUser24hFromStudio('${targetRoomId}', '${targetId}', '${targetName}')"
                class="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-slate-800 hover:text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs active:scale-95">
                <i data-lucide="shield-ban" class="w-3.5 h-3.5"></i>
                <span>طرد وحظر 24 ساعة</span>
              </button>
            </div>
          </div>
        </div>

        <div class="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span class="text-[11px] text-slate-500 font-bold">إذا كانت الصورة غير مخالفة، أغلق المربع</span>
          <button 
            type="button" 
            onclick="document.getElementById('imageModerationInspectorModal').remove()" 
            class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-2xs">
            <i data-lucide="check" class="w-3.5 h-3.5"></i>
            <span>الصورة سليمة (إغلاق)</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();
  };

  window.banAndResetViolatingImage = function(imageUrl, imageType, targetId, targetName, roomId, seatId) {
    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const defaultNormalUserAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
    const defaultNormalRoomCover = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400';

    if (imageType.includes('غلاف') || imageType.includes('خلفية') || targetId === room.id) {
      room.image = defaultNormalRoomCover;
      if (!room.chat) room.chat = [];
      room.chat.push({
        id: 'ban_img_' + Date.now(),
        user: 'إدارة الرقابة والمحتوى',
        text: `🚫 قامت الإدارة بحظر صورة غلاف الغرفة فوراً لمخالفتها الآداب والسياسات، وتم استرجاع الصورة الافتراضية العادية.`,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      });
      if (window.sendRoomModerationCommand) {
        window.sendRoomModerationCommand(roomId, 'reset_wallpaper', 0, { reason: 'banned_violating_image' });
      }
    } else {
      if (room.seats) {
        room.seats.forEach(s => {
          if (s.userId === targetId || (seatId && s.id === seatId) || s.name === targetName) {
            s.avatar = defaultNormalUserAvatar;
          }
        });
      }
      if (room.audience) {
        room.audience.forEach(u => {
          if (u.userId === targetId || u.name === targetName) {
            u.avatar = defaultNormalUserAvatar;
          }
        });
      }

      if (!room.chat) room.chat = [];
      room.chat.push({
        id: 'ban_avatar_' + Date.now(),
        user: 'إدارة الرقابة والمحتوى',
        text: `🚫 تنبيه رقابي: قامت الإدارة بحظر الصورة الشخصية للعضو "${targetName}" لمخالفتها اللوائح والآداب، وتم استرجاع صورة الحساب العادية.`,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      });

      if (window.sendRoomModerationCommand) {
        window.sendRoomModerationCommand(roomId, 'ban_user_avatar', 0, { targetId, targetName });
      }
    }

    if (window.saveActiveVoiceRooms) window.saveActiveVoiceRooms(rooms);

    const modal = document.getElementById('imageModerationInspectorModal');
    if (modal) modal.remove();

    window.openLiveRoomStudio(roomId);
    const container = document.getElementById('dynamicViewContainer');
    if (container && window.renderRoomsManagementView) window.renderRoomsManagementView(container);

    window.showAdminNotification ? window.showAdminNotification(`تم حظر الصورة بنجاح واسترجاع الصورة الافتراضية العادية! 🚫🛡️`, 'error') : null;
  };

  window.adminWarningToUser = function(roomId, userName) {
    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    if (!room.chat) room.chat = [];
    room.chat.push({
      id: 'warn_' + Date.now(),
      user: '👑 إنذار رقابي من الإدارة',
      text: `تنبيه وإنذار رسمي للعضو "${userName}": يرجى الالتزام بالآداب العامة وقوانين التطبيق فوراً.`,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      isSystem: true
    });

    if (window.saveActiveVoiceRooms) window.saveActiveVoiceRooms(rooms);
    window.openLiveRoomStudio(roomId);
    window.showAdminNotification ? window.showAdminNotification(`تم إرسال إنذار رسمي للعضو "${userName}" في شات الروم ⚠️`, 'warning') : null;
  };

  window.banUserAccountGlobal = function(roomId, userId, userName) {
    if (!confirm(`هل أنت متأكد من حظر حساب "${userName}" (ID: ${userId}) كلياً وتجميده من المنصة والتطبيق؟`)) return;

    const modal = document.getElementById('userProfileInspectorModal');
    if (modal) modal.remove();

    window.kickUser24hFromStudio(roomId, userId, userName);
    window.showAdminNotification ? window.showAdminNotification(`تم حظر وتجميد حساب "${userName}" كلياً بنجاح! ⛔`, 'error') : null;
  };

  // =========================================================================
  // LIVE ROOM GIFT LAUNCHER & LAYER SIMULATION (إطلاق واختبار الهدايا في الروم)
  // =========================================================================
  window.openStudioGiftLauncher = function(roomId) {
    const existing = document.getElementById('studioGiftLauncherModal');
    if (existing) existing.remove();

    const gifts = window.getRoomGiftsCatalog ? window.getRoomGiftsCatalog() : [];
    const categories = window.getGiftCategories ? window.getGiftCategories() : [
      { id: 'all', name: 'الكل', icon: '🎁' },
      { id: 'الفعالية', name: 'الفعالية', icon: '⚡' },
      { id: 'كلاسيك', name: 'كلاسيك', icon: '💎' },
      { id: 'VIP', name: 'VIP', icon: '👑' }
    ];

    const modalHtml = `
      <div id="studioGiftLauncherModal" class="fixed inset-0 z-[10005] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto" dir="rtl">
        <div class="bg-white rounded-3xl border-2 border-slate-300 max-w-4xl w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 my-6 max-h-[90vh] flex flex-col">
          
          <!-- Header -->
          <div class="flex items-center justify-between border-b-2 border-slate-200 pb-3 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 text-xl shadow-xs">
                🎁
              </div>
              <div>
                <h3 class="text-base font-black text-slate-950">صندوق هدايا الروم المباشر (إطلاق واختبار المؤثرات)</h3>
                <p class="text-xs text-slate-500 font-medium">اختبار عرض الهدية خلف المايكات أو فوقها بأسفل الشاشة أو ملء الشاشة مع الصوت</p>
              </div>
            </div>
            <button onclick="document.getElementById('studioGiftLauncherModal').remove()" class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Filter & Search Bar -->
          <div class="flex items-center justify-between flex-wrap gap-2.5 shrink-0 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
            <!-- Category Tabs -->
            <div class="flex items-center gap-1.5 overflow-x-auto select-none" id="studioGiftTabsRow" style="scrollbar-width: none;">
              <button 
                type="button" 
                onclick="window.filterStudioGifts('all')" 
                id="studioGiftTab_all" 
                class="studio-gift-tab px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs transition cursor-pointer shadow-xs whitespace-nowrap">
                <span>🎁 الكل</span>
              </button>
              ${categories.map(cat => `
                <button 
                  type="button" 
                  onclick="window.filterStudioGifts('${cat.id}')" 
                  id="studioGiftTab_${cat.id}" 
                  class="studio-gift-tab px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer border border-slate-200 whitespace-nowrap">
                  <span>${cat.icon || '🎁'} ${cat.name}</span>
                </button>
              `).join('')}
            </div>

            <!-- Search -->
            <div class="relative min-w-[200px] flex-1 sm:flex-initial">
              <input 
                type="text" 
                id="studioGiftSearchInput" 
                placeholder="بحث عن هدية بالاسم..." 
                oninput="window.searchStudioGifts(this.value)"
                class="w-full pl-3 pr-8 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-950 outline-none focus:border-amber-500 shadow-inner" />
              <span class="absolute right-2.5 top-2 text-slate-400 text-xs">🔍</span>
            </div>
          </div>

          <!-- Gifts Cards Grid -->
          <div id="studioGiftsGridContainer" class="overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1" style="scrollbar-width: thin;">
            ${gifts.map(g => {
              const isBehind = g.renderLayer === 'behind_mics';
              const isBottom = g.placement === 'bottom';
              const isFullscreen = g.placement === 'fullscreen';

              return `
                <div 
                  class="studio-gift-card p-3 rounded-2xl bg-[#f7fbfd] hover:bg-[#edf6f9] border-2 border-slate-300 hover:border-amber-400 transition-all shadow-xs flex flex-col justify-between group select-none"
                  data-category="${g.category || ''}"
                  data-name="${g.name || ''}">
                  
                  <div>
                    <!-- Card Top badges -->
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-[9px] px-1.5 py-0.5 rounded font-mono font-black ${isBehind ? 'bg-cyan-100 text-cyan-900 border border-cyan-300' : 'bg-amber-100 text-amber-900 border border-amber-300'}">
                        ${isBehind ? '🌌 خلف المايكات' : '👑 فوق المايكات'}
                      </span>
                      <span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-black">
                        ${isFullscreen ? '📺 ملء الشاشة' : isBottom ? '⬇️ أسفل' : '🎯 وسط'}
                      </span>
                    </div>

                    <!-- Gift Icon / Asset -->
                    <div class="flex items-center justify-center my-2 h-16 group-hover:scale-110 transition duration-200">
                      ${g.icon && (g.icon.startsWith('http') || g.icon.startsWith('data:image')) ? `
                        <img src="${g.icon}" class="w-14 h-14 object-contain filter drop-shadow-md" alt="${g.name}" />
                      ` : `
                        <span class="text-4xl filter drop-shadow-md">${g.icon || '🎁'}</span>
                      `}
                    </div>

                    <!-- Gift Name & Price -->
                    <div class="text-center">
                      <div class="font-black text-xs text-slate-950 truncate" title="${g.name}">${g.name}</div>
                      <div class="text-[11px] font-black text-amber-700 font-mono flex items-center justify-center gap-1 mt-0.5">
                        <span>🪙</span>
                        <span>${g.price} كوينز</span>
                      </div>
                    </div>
                  </div>

                  <!-- Launch Button -->
                  <div class="mt-3 pt-2 border-t border-slate-200/80">
                    <button 
                      type="button" 
                      onclick="window.triggerRoomGiftEffectInStudio(${JSON.stringify(g).replace(/"/g, '&quot;')}, '${roomId}')" 
                      class="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-95">
                      <span>إطلاق في الروم 🚀</span>
                    </button>
                  </div>

                </div>
              `;
            }).join('')}
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between border-t-2 border-slate-200 pt-3 shrink-0">
            <span class="text-xs text-slate-500 font-medium">إجمالي الهدايا المعتمدة: <strong>${gifts.length} هدية</strong></span>
            <button 
              type="button" 
              onclick="document.getElementById('studioGiftLauncherModal').remove()" 
              class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition cursor-pointer">
              إغلاق
            </button>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    if (window.lucide) lucide.createIcons();
  };

  window.filterStudioGifts = function(categoryId) {
    const tabs = document.querySelectorAll('.studio-gift-tab');
    tabs.forEach(t => {
      t.className = 'studio-gift-tab px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer border border-slate-200 whitespace-nowrap';
    });
    const activeTab = document.getElementById('studioGiftTab_' + categoryId);
    if (activeTab) {
      activeTab.className = 'studio-gift-tab px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs transition cursor-pointer shadow-xs whitespace-nowrap';
    }

    const cards = document.querySelectorAll('.studio-gift-card');
    cards.forEach(c => {
      const cardCat = c.getAttribute('data-category');
      if (categoryId === 'all' || cardCat === categoryId) {
        c.classList.remove('hidden');
      } else {
        c.classList.add('hidden');
      }
    });
  };

  window.searchStudioGifts = function(query) {
    const q = (query || '').toLowerCase().trim();
    const cards = document.querySelectorAll('.studio-gift-card');
    cards.forEach(c => {
      const name = (c.getAttribute('data-name') || '').toLowerCase();
      if (!q || name.includes(q)) {
        c.classList.remove('hidden');
      } else {
        c.classList.add('hidden');
      }
    });
  };

  // =========================================================================
  // EXECUTE GIFT EFFECT IN STUDIO STAGE (طبقة العرض خلف المايكات أو فوقها)
  // =========================================================================
  window.triggerRoomGiftEffectInStudio = function(gift, roomId) {
    if (!gift) return;

    // 1. Play synthesized audio preset
    if (window.playAppGiftSound && gift.hasSound !== false) {
      window.playAppGiftSound(gift.soundPreset || 'fanfare');
    }

    // 2. Identify target layer (behind mics & chat VS above mics & chat)
    const isBehind = gift.renderLayer === 'behind_mics';
    let targetLayer = isBehind 
      ? document.getElementById('studioBehindMicsGiftLayer_' + roomId) 
      : document.getElementById('studioAboveMicsGiftLayer_' + roomId);

    if (!targetLayer) {
      targetLayer = document.getElementById('studioAboveMicsGiftLayer_' + roomId) || document.body;
    }

    // 3. Setup placement styles
    const placement = gift.placement || 'bottom';
    const scale = gift.scale || 1.0;
    const durationSec = gift.durationSeconds || 4.5;

    let placementClass = 'items-center justify-center';
    if (placement === 'bottom') {
      placementClass = 'items-end justify-center pb-6';
    } else if (placement === 'fullscreen') {
      placementClass = 'items-center justify-center inset-0 w-full h-full bg-black/40 backdrop-blur-xs';
    } else if (placement === 'top') {
      placementClass = 'items-start justify-center pt-6';
    } else if (placement === 'mics') {
      placementClass = 'items-center justify-center -translate-y-12';
    }

    // 4. Construct Gift Element
    const effectId = 'studio_gift_effect_' + Date.now();
    const wrapper = document.createElement('div');
    wrapper.id = effectId;
    wrapper.className = `absolute inset-0 pointer-events-none flex flex-col ${placementClass} transition-all duration-300 animate-in zoom-in-90 fade-in select-none z-50`;

    let mediaHtml = '';
    const videoSrc = gift.videoUrl || gift.animationUrl;
    if (videoSrc) {
      mediaHtml = `
        <div class="relative flex flex-col items-center">
          <video 
            src="${videoSrc}" 
            autoplay 
            playsinline 
            loop 
            muted 
            class="max-h-[55vh] max-w-[85vw] object-contain filter drop-shadow-2xl rounded-2xl" 
            style="transform: scale(${scale});"></video>
        </div>
      `;
    } else if (gift.icon && (gift.icon.startsWith('http') || gift.icon.startsWith('data:image'))) {
      mediaHtml = `
        <div class="relative flex flex-col items-center animate-bounce">
          <img src="${gift.icon}" class="w-32 h-32 object-contain filter drop-shadow-2xl" style="transform: scale(${scale});" />
        </div>
      `;
    } else {
      mediaHtml = `
        <div class="relative flex flex-col items-center animate-pulse">
          <span class="text-7xl filter drop-shadow-2xl inline-block" style="transform: scale(${scale});">${gift.icon || '🎁'}</span>
        </div>
      `;
    }

    const badgeHtml = `
      <div class="mt-2 px-3.5 py-1.5 rounded-full bg-slate-950/90 text-amber-300 border-2 border-amber-400 font-black text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
        <span>🎁 ${gift.name}</span>
        <span class="text-white/70 font-mono text-[11px]">(${gift.price} كوينز)</span>
        <span class="text-[10px] px-1.5 py-0.2 rounded ${isBehind ? 'bg-cyan-900 text-cyan-200' : 'bg-amber-900 text-amber-200'} font-bold">
          ${isBehind ? 'خلف المايكات 🌌' : 'فوق المايكات 👑'}
        </span>
      </div>
    `;

    wrapper.innerHTML = mediaHtml + badgeHtml;
    targetLayer.appendChild(wrapper);

    // 5. Post live message into Room Chat
    const rooms = window.getActiveVoiceRooms ? window.getActiveVoiceRooms() : [];
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      if (!room.chat) room.chat = [];
      room.chat.push({
        id: 'gift_chat_' + Date.now(),
        user: '🎁 إشعار الهدية المباشرة',
        text: `أرسلت الإدارة هدية "${gift.name}" بقيمة ${gift.price} كوينز في الروم (${isBehind ? 'خلف المايكات' : 'فوق المايكات'})!`,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      });
      if (window.saveActiveVoiceRooms) window.saveActiveVoiceRooms(rooms);
    }

    // 6. Broadcast across channels (BroadcastChannel & window events)
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const tarafCh = new BroadcastChannel('taraf_rooms_channel');
        tarafCh.postMessage({ type: 'GIFT_SENT', gift, roomId, timestamp: Date.now() });
        setTimeout(() => tarafCh.close(), 100);
      } catch (e) {}
      try {
        const syncCh = new BroadcastChannel('super_legend_gifts_cms_sync_channel');
        syncCh.postMessage({ type: 'GIFT_TRIGGERED', payload: { gift, roomId }, timestamp: Date.now() });
        setTimeout(() => syncCh.close(), 100);
      } catch (e) {}
    }

    window.dispatchEvent(new CustomEvent('taraf_gift_sent', { detail: { gift, roomId } }));

    // 7. Auto cleanup
    setTimeout(() => {
      wrapper.classList.add('opacity-0', 'scale-95');
      setTimeout(() => wrapper.remove(), 400);
    }, durationSec * 1000);

    // 8. Notification
    window.showAdminNotification ? window.showAdminNotification(`تم إطلاق هدية "${gift.name}" في الروم بنجاح (${isBehind ? 'خلف المايكات' : 'فوق المايكات'})! 🎁`, 'success') : null;
  };

  // Mark module loaded
  window._adminRoomsStudioLoaded = true;
  console.log('⚡ [LazyLoad] admin-rooms-studio.js loaded successfully on-demand.');
})();
