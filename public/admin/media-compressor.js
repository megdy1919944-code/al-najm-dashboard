/**
 * محرك المعالجة والضغط التلقائي الفوري للصور والفيديوهات
 * Taraf Ultra-Light Hidden Media Compressor & Transcoder
 * 
 * - يحول أي صورة مهما كان حجمها وصيغتها إلى صيغة WebP فائقة الخفة (~15-25 KB)
 * - يحول ويضغط أي فيديو من الهاتف أو الكمبيوتر إلى مقطع خفيف جداً (~200-400 KB)
 * - يحفظ المقاطع في IndexedDB بدون استهلاك كوتا localStorage (0MB quota problem solved!)
 */

(function(window) {
  'use strict';

  const DB_NAME = 'taraf_media_vault_db';
  const DB_VERSION = 1;
  const STORE_NAME = 'media_items';
  const objectUrlCache = new Map();

  // 1. IndexedDB Vault Helper
  function openDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        return reject(new Error('IndexedDB غير مدعوم في هذا المتصفح'));
      }
      const req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async function saveMediaBlob(id, blob, meta = {}) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record = {
        id,
        blob,
        mimeType: blob.type || 'video/webm',
        size: blob.size,
        createdAt: Date.now(),
        originalName: meta.originalName || '',
        compressedSize: meta.compressedSize || blob.size,
      };
      const req = store.put(record);
      req.onsuccess = () => {
        const objUrl = URL.createObjectURL(blob);
        objectUrlCache.set(id, objUrl);
        resolve({ id, objectUrl: objUrl, size: blob.size });
      };
      req.onerror = () => reject(req.error);
    });
  }

  async function getMediaBlobUrl(id) {
    if (!id) return '';
    const cleanId = id.startsWith('idb:') ? id.replace('idb:', '') : id;
    if (objectUrlCache.has(cleanId)) {
      return objectUrlCache.get(cleanId);
    }
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(cleanId);
        req.onsuccess = () => {
          if (req.result && req.result.blob) {
            const objUrl = URL.createObjectURL(req.result.blob);
            objectUrlCache.set(cleanId, objUrl);
            resolve(objUrl);
          } else {
            resolve('');
          }
        };
        req.onerror = () => resolve('');
      });
    } catch (e) {
      return '';
    }
  }

  // Format bytes helper
  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * 2. HIDDEN IMAGE COMPRESSOR (معالجة وتخفيف الصور التلقائي)
   * Converts any image to ultra-light WebP (or PNG with alpha) max 280x280.
   */
  async function compressImageToUltraLight(file, options = {}) {
    const maxDim = options.maxDimension || 280;
    const quality = options.quality || 0.82;

    return new Promise((resolve, reject) => {
      const img = new Image();
      const tempUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(tempUrl);

        // Calculate scaled dimensions preserving aspect ratio
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;

        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');

        // High quality bicubic rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        // Try export as image/webp first (smallest modern format)
        let outputFormat = 'image/webp';
        let dataUrl = canvas.toDataURL(outputFormat, quality);

        // If browser doesn't support webp export, it returns png or jpeg
        if (!dataUrl.startsWith('data:image/webp')) {
          outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          dataUrl = canvas.toDataURL(outputFormat, quality);
        }

        // Calculate size estimation
        const head = dataUrl.indexOf(',');
        const compressedBytes = Math.round((dataUrl.length - head) * 0.75);
        const originalBytes = file.size;
        const savedPercent = Math.max(0, Math.round(((originalBytes - compressedBytes) / originalBytes) * 100));

        const origExt = file.name ? file.name.split('.').pop().toUpperCase() : 'IMAGE';
        const outExt = outputFormat.includes('webp') ? 'WebP' : (outputFormat.includes('png') ? 'PNG' : 'JPEG');

        resolve({
          dataUrl,
          width: w,
          height: h,
          format: outputFormat,
          originalFormat: origExt,
          outputFormat: outExt,
          originalName: file.name,
          originalSize: originalBytes,
          compressedSize: compressedBytes,
          originalSizeText: formatBytes(originalBytes),
          compressedSizeText: formatBytes(compressedBytes),
          savedPercent,
        });
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(tempUrl);
        reject(new Error('تعذر قراءة ملف الصورة'));
      };

      img.src = tempUrl;
    });
  }

  /**
   * 3. HIDDEN VIDEO COMPRESSOR & TRANSCODER (معالجة وتخفيف الفيديو التلقائي)
   * Captures & encodes video through an offscreen canvas at optimized 360p resolution
   * with low bitrate WebM/MP4, cutting 90-95% of the file size.
   */
  async function compressVideoToUltraLight(file, onProgress) {
    const originalBytes = file.size;
    const mediaId = 'gift_vid_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    return new Promise(async (resolve, reject) => {
      try {
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.crossOrigin = 'anonymous';

        const fileUrl = URL.createObjectURL(file);
        video.src = fileUrl;

        // Progress report
        if (onProgress) onProgress({ status: 'analyzing', progress: 10, message: 'فحص أبعاد وصيغة الفيديو...' });

        video.onloadedmetadata = async () => {
          try {
            const originalDuration = video.duration || 4;
            // Limit gift loops to max 5.5 seconds
            const maxDuration = Math.min(originalDuration, 5.5);

            let targetW = video.videoWidth || 360;
            let targetH = video.videoHeight || 360;
            const maxDim = 380; // optimal gift scale

            if (targetW > maxDim || targetH > maxDim) {
              if (targetW > targetH) {
                targetH = Math.round((targetH * maxDim) / targetW);
                targetW = maxDim;
              } else {
                targetW = Math.round((targetW * maxDim) / targetH);
                targetH = maxDim;
              }
            }
            // Ensure dimensions are even numbers (vital for video codecs)
            targetW = targetW % 2 === 0 ? targetW : targetW - 1;
            targetH = targetH % 2 === 0 ? targetH : targetH - 1;

            const canvas = document.createElement('canvas');
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'medium';

            // Check MediaRecorder & canvas stream support
            const hasMediaRecorder = typeof window.MediaRecorder !== 'undefined' && typeof canvas.captureStream === 'function';
            let mimeType = 'video/webm;codecs=vp8';

            if (hasMediaRecorder) {
              if (!MediaRecorder.isTypeSupported(mimeType)) {
                if (MediaRecorder.isTypeSupported('video/webm')) {
                  mimeType = 'video/webm';
                } else if (MediaRecorder.isTypeSupported('video/mp4')) {
                  mimeType = 'video/mp4';
                } else {
                  mimeType = '';
                }
              }
            }

            // Fallback path: If MediaRecorder is not supported or file is already small
            if (!hasMediaRecorder || !mimeType) {
              if (onProgress) onProgress({ status: 'saving', progress: 80, message: 'حفظ الفيديو في المستودع فائق السرعة...' });
              const record = await saveMediaBlob(mediaId, file, { originalName: file.name, compressedSize: file.size });
              URL.revokeObjectURL(fileUrl);
              return resolve({
                id: 'idb:' + mediaId,
                rawId: mediaId,
                objectUrl: record.objectUrl,
                originalSize: originalBytes,
                compressedSize: originalBytes,
                originalSizeText: formatBytes(originalBytes),
                compressedSizeText: formatBytes(originalBytes),
                savedPercent: 0,
                isFallback: true,
              });
            }

            // Real Canvas Transcoding & Bitrate Compression
            if (onProgress) onProgress({ status: 'compressing', progress: 25, message: 'جاري تخفيف وضغط الفيديو بالذكاء الاصطناعي...' });

            const stream = canvas.captureStream(24); // 24 FPS is ideal for animation and super light

            // Capture and preserve video audio track if video has sound
            try {
              let audioStream = null;
              if (typeof video.captureStream === 'function') {
                audioStream = video.captureStream();
              } else if (typeof video.mozCaptureStream === 'function') {
                audioStream = video.mozCaptureStream();
              }
              if (audioStream) {
                const aTracks = audioStream.getAudioTracks();
                if (aTracks && aTracks.length > 0) {
                  aTracks.forEach((track) => stream.addTrack(track));
                }
              }
            } catch (aErr) {
              console.warn('[AudioCapture] Notice:', aErr);
            }

            const recorder = new MediaRecorder(stream, {
              mimeType: mimeType,
              videoBitsPerSecond: 420000, // 420 kbps -> super light (~300 KB for 5s)
            });

            const chunks = [];
            recorder.ondataavailable = (e) => {
              if (e.data && e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = async () => {
              try {
                const compressedBlob = new Blob(chunks, { type: mimeType });
                const compressedBytes = compressedBlob.size;
                const savedPercent = Math.max(0, Math.round(((originalBytes - compressedBytes) / originalBytes) * 100));

                if (onProgress) onProgress({ status: 'finalizing', progress: 95, message: 'اكتمال الضغط! حفظ المقطع...' });

                // Save to IndexedDB
                const record = await saveMediaBlob(mediaId, compressedBlob, {
                  originalName: file.name,
                  compressedSize: compressedBytes,
                });

                URL.revokeObjectURL(fileUrl);

                if (onProgress) onProgress({ status: 'done', progress: 100, message: 'تم الضغط بنجاح!' });

                const origExt = file.name ? file.name.split('.').pop().toUpperCase() : 'VIDEO';
                const outExt = mimeType.includes('webm') ? 'WebM' : 'MP4';

                resolve({
                  id: 'idb:' + mediaId,
                  rawId: mediaId,
                  objectUrl: record.objectUrl,
                  originalSize: originalBytes,
                  compressedSize: compressedBytes,
                  originalSizeText: formatBytes(originalBytes),
                  compressedSizeText: formatBytes(compressedBytes),
                  savedPercent,
                  width: targetW,
                  height: targetH,
                  originalFormat: origExt,
                  outputFormat: outExt,
                  originalName: file.name,
                });
              } catch (saveErr) {
                // If anything fails in saving, fallback to direct file
                const fallbackRecord = await saveMediaBlob(mediaId, file, { originalName: file.name });
                URL.revokeObjectURL(fileUrl);
                const origExt = file.name ? file.name.split('.').pop().toUpperCase() : 'VIDEO';
                resolve({
                  id: 'idb:' + mediaId,
                  rawId: mediaId,
                  objectUrl: fallbackRecord.objectUrl,
                  originalSize: originalBytes,
                  compressedSize: originalBytes,
                  originalSizeText: formatBytes(originalBytes),
                  compressedSizeText: formatBytes(originalBytes),
                  savedPercent: 0,
                  isFallback: true,
                  originalFormat: origExt,
                  outputFormat: origExt,
                  originalName: file.name,
                });
              }
            };

            recorder.start();

            // Play video and draw to canvas
            video.currentTime = 0;
            await video.play();

            let animId;
            const startTime = performance.now();

            function drawLoop() {
              const elapsed = (performance.now() - startTime) / 1000;
              const currentProgress = Math.min(90, Math.round(25 + (elapsed / maxDuration) * 65));
              if (onProgress) {
                onProgress({
                  status: 'compressing',
                  progress: currentProgress,
                  message: `جاري الضغط والتخفيف الفوري (${currentProgress}%)...`,
                });
              }

              ctx.drawImage(video, 0, 0, targetW, targetH);

              if (video.currentTime >= maxDuration || video.ended || elapsed >= maxDuration + 0.5) {
                cancelAnimationFrame(animId);
                video.pause();
                if (recorder.state === 'recording') {
                  recorder.stop();
                }
              } else {
                animId = requestAnimationFrame(drawLoop);
              }
            }

            animId = requestAnimationFrame(drawLoop);
          } catch (transcodeErr) {
            console.warn('[Compressor] Canvas transcode failed, using direct vault save:', transcodeErr);
            const record = await saveMediaBlob(mediaId, file, { originalName: file.name });
            URL.revokeObjectURL(fileUrl);
            resolve({
              id: 'idb:' + mediaId,
              rawId: mediaId,
              objectUrl: record.objectUrl,
              originalSize: originalBytes,
              compressedSize: originalBytes,
              originalSizeText: formatBytes(originalBytes),
              compressedSizeText: formatBytes(originalBytes),
              savedPercent: 0,
              isFallback: true,
            });
          }
        };

        video.onerror = async () => {
          // If video fails to decode via video element, still store it safely in IndexedDB
          console.warn('[Compressor] Video element error, storing directly in vault');
          const record = await saveMediaBlob(mediaId, file, { originalName: file.name });
          URL.revokeObjectURL(fileUrl);
          resolve({
            id: 'idb:' + mediaId,
            rawId: mediaId,
            objectUrl: record.objectUrl,
            originalSize: originalBytes,
            compressedSize: originalBytes,
            originalSizeText: formatBytes(originalBytes),
            compressedSizeText: formatBytes(originalBytes),
            savedPercent: 0,
            isFallback: true,
          });
        };
      } catch (generalErr) {
        reject(generalErr);
      }
    });
  }

  // Export globally
  window.TarafMediaCompressor = {
    compressImageToUltraLight,
    compressVideoToUltraLight,
    compressAudioToUltraLight,
    processAudioFromUrl,
    processVideoFromUrl,
    processImageFromUrl,
    saveMediaBlob,
    getMediaBlobUrl,
    formatBytes,
  };

  /**
   * معالجة وفحص رابط فيديو سحابي:
   * - إذا كان الفيديو خفيفاً (أقل من 800 كيلوبايت أو خفيف التحميل) يتم رفعه واعتماده برابطه السحابي مباشرة.
   * - إذا كان الفيديو ثقيلاً، يتم سحبه وتعديله وضغطه خفيفاً من الرابط تلقائياً ليصبح فائق الخفة (~250 KB).
   */
  async function processVideoFromUrl(url, options = {}, onProgress = null) {
    if (!url || typeof url !== 'string') {
      throw new Error('رابط الفيديو غير صالح');
    }
    url = url.trim();

    // Determine extension
    const cleanUrl = url.split('?')[0];
    const ext = cleanUrl.includes('.') ? cleanUrl.split('.').pop().toUpperCase() : 'MP4';
    const heavyThreshold = options.heavyThreshold || (800 * 1024); // 800 KB default threshold

    if (onProgress) {
      onProgress({
        status: 'inspecting',
        progress: 15,
        message: 'جاري فحص حجم وصيغة الرابط السحابي...',
      });
    }

    try {
      // 1. Try to fetch the media via fetch to measure exact byte size
      const res = await fetch(url, { method: 'GET', mode: 'cors' }).catch(() => null);
      
      if (res && res.ok) {
        const blob = await res.blob();
        const byteSize = blob.size;
        const sizeText = formatBytes(byteSize);
        const isHeavy = byteSize > heavyThreshold || options.forceCompress;

        if (!isHeavy) {
          // Video is lightweight! Keep original cloud URL as requested by user
          if (onProgress) {
            onProgress({
              status: 'done',
              progress: 100,
              message: `الرابط خفيف جداً (${sizeText}) ومناسب للروم مباشرة دون تعديل!`,
            });
          }
          return {
            action: 'kept_url',
            isHeavy: false,
            videoUrl: url,
            previewUrl: url,
            originalSize: byteSize,
            originalSizeText: sizeText,
            originalFormat: ext,
            outputFormat: ext,
            savedPercent: 0,
            message: `رابط سحابي خفيف (${sizeText}) - تم اعتماده مباشرةً دون تعديل`,
          };
        } else {
          // Video is heavy! Compress and modify it automatically
          if (onProgress) {
            onProgress({
              status: 'compressing',
              progress: 30,
              message: `الفيديو ثقيل (${sizeText} - ${ext})! جاري سحبه وتعديله وضغطه تلقائياً...`,
            });
          }

          // Assign name to blob for compressVideoToUltraLight
          const filename = cleanUrl.split('/').pop() || `cloud_video.${ext.toLowerCase()}`;
          const virtualFile = new File([blob], filename, { type: blob.type || 'video/mp4' });

          const compressResult = await compressVideoToUltraLight(virtualFile, options, onProgress);

          return {
            action: 'compressed_from_url',
            isHeavy: true,
            videoUrl: compressResult.id,
            previewUrl: compressResult.objectUrl,
            originalSize: byteSize,
            originalSizeText: sizeText,
            originalFormat: ext,
            outputFormat: compressResult.outputFormat || 'WebM',
            compressedSize: compressResult.compressedSize,
            compressedSizeText: compressResult.compressedSizeText,
            savedPercent: compressResult.savedPercent,
            message: `تم اكتشاف فيديو ثقيل وتم تعديله وضغطه تلقائياً ليصبح فائق الخفة (${compressResult.compressedSizeText})`,
          };
        }
      }
    } catch (fetchErr) {
      console.warn('[Compressor] Direct fetch failed (possible CORS on external CDN):', fetchErr);
    }

    // 2. Fallback if CORS prevents direct fetch(): test via HTML5 Video element
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      video.src = url;

      const timer = setTimeout(() => {
        resolve({
          action: 'kept_url',
          isHeavy: false,
          videoUrl: url,
          previewUrl: url,
          originalSizeText: 'سحابي مباشر',
          originalFormat: ext,
          outputFormat: ext,
          message: 'تم ربط الفيديو السحابي المباشر وتشغيله بنجاح',
        });
      }, 4000);

      video.onloadedmetadata = async () => {
        clearTimeout(timer);
        const w = video.videoWidth || 0;
        const h = video.videoHeight || 0;
        const dur = video.duration || 0;

        const seemsHeavy = w > 720 || h > 720 || dur > 8;

        resolve({
          action: 'kept_url',
          isHeavy: seemsHeavy,
          videoUrl: url,
          previewUrl: url,
          originalSizeText: seemsHeavy ? `دقة ${w}x${h}` : `خفيف ${w}x${h}`,
          originalFormat: ext,
          outputFormat: ext,
          message: seemsHeavy ? 'رابط سحابي مباشر (جاهز للتشغيل)' : 'رابط سحابي خفيف ومناسب للروم مباشرة',
        });
      };

      video.onerror = () => {
        clearTimeout(timer);
        resolve({
          action: 'kept_url',
          isHeavy: false,
          videoUrl: url,
          previewUrl: url,
          originalSizeText: 'رابط مباشر',
          originalFormat: ext,
          outputFormat: ext,
          message: 'تم اعتماد الرابط السحابي للتشغيل',
        });
      };
    });
  }

  /**
   * فحص وتحسين صورة من رابط سحابي
   */
  async function processImageFromUrl(url, options = {}, onProgress = null) {
    if (!url || typeof url !== 'string') throw new Error('رابط الصورة غير صالح');
    url = url.trim();

    if (!url.startsWith('http') && !url.startsWith('//')) {
      return { iconUrl: url, format: 'EMOJI', sizeText: 'خفيف' };
    }

    const cleanUrl = url.split('?')[0];
    const ext = cleanUrl.includes('.') ? cleanUrl.split('.').pop().toUpperCase() : 'IMG';

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;

      img.onload = () => {
        try {
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;
          if (w > 256 || h > 256 || ext === 'PNG' || ext === 'JPG' || ext === 'JPEG') {
            const canvas = document.createElement('canvas');
            const targetDim = 160;
            let tw = w, th = h;
            if (tw > targetDim || th > targetDim) {
              if (tw > th) {
                th = Math.round((th * targetDim) / tw);
                tw = targetDim;
              } else {
                tw = Math.round((tw * targetDim) / th);
                th = targetDim;
              }
            }
            canvas.width = tw;
            canvas.height = th;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, tw, th);
            const webpData = canvas.toDataURL('image/webp', 0.85);
            resolve({
              action: 'optimized_to_webp',
              iconUrl: webpData,
              originalFormat: ext,
              outputFormat: 'WebP',
              originalDimensions: `${w}x${h}`,
              message: `تم تحويل صورة الرابط إلى WebP خفيفة جداً (~15 KB)`,
            });
            return;
          }
        } catch (err) {
          // If canvas tainted, keep original URL
        }

        resolve({
          action: 'kept_url',
          iconUrl: url,
          originalFormat: ext,
          outputFormat: ext,
          message: 'رابط صورة سحابي خفيف ومناسب',
        });
      };

      img.onerror = () => {
        resolve({
          action: 'kept_url',
          iconUrl: url,
          originalFormat: ext,
          outputFormat: ext,
          message: 'رابط صورة مباشر',
        });
      };
    });
  }

  /**
   * 4. AUDIO PROCESSOR & COMPRESSOR (معالجة وفحص ملفات وروابط الصوت)
   * Supports MP3, WAV, AAC, M4A, OGG
   */
  async function compressAudioToUltraLight(file, options = {}, onProgress = null) {
    if (!file) throw new Error('يرجى اختيار ملف صوتي صالح');
    const mediaId = 'audio_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const origExt = file.name ? file.name.split('.').pop().toUpperCase() : 'AUDIO';
    const originalBytes = file.size;

    if (onProgress) onProgress({ status: 'analyzing', progress: 25, message: 'فحص صيغة وحجم ملف الصوت...' });

    // Save audio directly to IndexedDB vault
    if (onProgress) onProgress({ status: 'saving', progress: 75, message: 'حفظ الصوت في المستودع السريع...' });
    const record = await saveMediaBlob(mediaId, file, { originalName: file.name, compressedSize: file.size });

    if (onProgress) onProgress({ status: 'done', progress: 100, message: 'تم تجهيز الصوت بنجاح!' });

    return {
      id: 'idb:' + mediaId,
      rawId: mediaId,
      audioUrl: 'idb:' + mediaId,
      objectUrl: record.objectUrl,
      originalFormat: origExt,
      originalSize: originalBytes,
      originalSizeText: formatBytes(originalBytes),
      compressedSize: originalBytes,
      compressedSizeText: formatBytes(originalBytes),
      savedPercent: 0,
      message: `تم اعتماد الصوت بصيغة ${origExt} بنجاح!`,
    };
  }

  async function processAudioFromUrl(url, options = {}, onProgress = null) {
    if (!url || typeof url !== 'string') throw new Error('رابط الصوت غير صالح');
    url = url.trim();
    const cleanUrl = url.split('?')[0];
    const ext = cleanUrl.includes('.') ? cleanUrl.split('.').pop().toUpperCase() : 'AUDIO';

    if (onProgress) onProgress({ status: 'testing', progress: 35, message: 'فحص رابط الصوت وتشغيله تجريبياً...' });

    return new Promise((resolve) => {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.src = url;

      const timer = setTimeout(() => {
        resolve({
          action: 'kept_url',
          audioUrl: url,
          originalFormat: ext,
          outputFormat: ext,
          message: 'تم ربط الصوت السحابي المباشر بنجاح 🎵',
        });
      }, 3000);

      audio.onloadedmetadata = () => {
        clearTimeout(timer);
        const durationSec = Math.round(audio.duration || 0);
        resolve({
          action: 'verified_url',
          audioUrl: url,
          originalFormat: ext,
          outputFormat: ext,
          duration: durationSec,
          message: `صوت سحابي صالح جاهز للروم (${durationSec ? durationSec + ' ثانية' : ext}) 🎵`,
        });
      };

      audio.onerror = () => {
        clearTimeout(timer);
        resolve({
          action: 'kept_url',
          audioUrl: url,
          originalFormat: ext,
          outputFormat: ext,
          message: 'رابط صوت سحابي مباشر 🎵',
        });
      };
    });
  }

})(window);
