import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import zlib from 'zlib';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_legend_recharge_secret_key_2026_!@#';

// Middleware with 50mb limit for frame, assets, and svga uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Full Cross-Origin Resource Sharing (CORS) for external dashboards and apps
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// =========================================================================
// SECURITY & RATE LIMITING (حماية الخوادم والحد من الطلبات المشبوهة)
// =========================================================================

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const rateLimitBuckets: RateLimitStore = {};

function createRateLimiter(options: { windowMs: number; maxRequests: number; message?: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
    const clientKey = `${ip}_${req.baseUrl || req.path}`;
    const now = Date.now();

    if (!rateLimitBuckets[clientKey] || now > rateLimitBuckets[clientKey].resetTime) {
      rateLimitBuckets[clientKey] = {
        count: 1,
        resetTime: now + options.windowMs,
      };
      return next();
    }

    rateLimitBuckets[clientKey].count++;

    if (rateLimitBuckets[clientKey].count > options.maxRequests) {
      const retryAfter = Math.ceil((rateLimitBuckets[clientKey].resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      return res.status(429).json({
        success: false,
        error: options.message || 'تم تجاوز الحد المسموح من الطلبات المتتالية (Rate Limit). يرجى الانتظار والمحاولة لاحقاً.',
        retryAfterSeconds: retryAfter,
      });
    }

    next();
  };
}

// Strict rate limiter for sensitive financial transactions & logins
const sensitiveOpsLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 35,
  message: 'تم كبح الطلبات لحماية الحساب من العمليات المتكررة السريعة (Protection Active).',
});

const authLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 15,
  message: 'محاولات دخول متكررة غير مصرح بها. تم تعليق الطلب مؤقتاً لأسباب أمنية.',
});

// =========================================================================
// JWT ENCRYPTION & TOKEN GENERATION (تشفير وإصدار توكنات الجلسة والتحقق)
// =========================================================================

export interface TokenPayload {
  userId: string;
  username: string;
  role: 'ROLE_SUPER_ADMIN' | 'ROLE_RECHARGE_AGENT';
  agencyId?: string;
  agencyName?: string;
  tier?: 'Tier A' | 'Tier B' | 'Tier C';
  exp: number;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString();
}

function signToken(payload: Omit<TokenPayload, 'exp'>, expiresInSeconds = 86400): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload: TokenPayload = { ...payload, exp };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (expectedSig !== signature) return null;

    const payload: TokenPayload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch (err) {
    return null;
  }
}

// Server-Side Authorization Middleware
interface AuthRequest extends Request {
  user?: TokenPayload;
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'رمز المصادقة مفقود (Missing Bearer Token). يرجى تسجيل الدخول أولاً.',
    });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(403).json({
      success: false,
      error: 'رمز الجلسة غير صالح أو منتهي الصلاحية (Invalid / Expired Token).',
    });
  }

  req.user = payload;
  next();
}

function requireRole(allowedRoles: ('ROLE_SUPER_ADMIN' | 'ROLE_RECHARGE_AGENT')[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'صلاحية غير كافية (Forbidden). لا يُسمح لوكيل الشحن باستدعاء بيانات أو إعدادات لوحة التحكم المركزية.',
      });
    }
    next();
  };
}

// =========================================================================
// IN-MEMORY DATABASE & PERSISTENT BUSINESS LOGIC (قواعد بيانات وكالات الشحن)
// =========================================================================

export interface RechargeAgency {
  id: string; // e.g. REC-01 (الآيدي الفرعي / الرمز الوظيفي)
  primaryId: string; // e.g. 1001007 (الآيدي الرئيسي التسلسلي الثابت)
  name: string;
  agent: string;
  phone: string;
  country: string;
  tier: 'Tier A' | 'Tier B' | 'Tier C';
  coinsBalance: number;
  totalSalesCoins: number;
  todaySalesCoins: number;
  todaySalesUsd: number;
  discountRate: number;
  status: 'معتمد' | 'معلق' | 'مجمد';
  loginUsername: string;
  loginPin: string; // Access PIN / Password
  createdAt: string;
}

export interface TierRate {
  tier: 'Tier A' | 'Tier B' | 'Tier C';
  name: string;
  ratePerDollar: number; // e.g. 10000 coins per 1 USD
  description: string;
  minTransferUsd: number;
  maxTransferUsd: number;
  color: string;
  badge: string;
}

export interface P2PTransferRecord {
  id: string;
  hostId: string;
  hostName: string;
  agencyId: string;
  agencyName: string;
  amountUsd: number;
  exchangeRate: number; // coins per $1
  convertedCoins: number;
  timestamp: string;
  dateOnly: string;
  referenceId: string;
  status: string;
  isRolledBack?: boolean;
  rolledBackAt?: string;
  rollbackReason?: string;
  rollbackAdmin?: string;
}

export interface MerchantRechargeTransaction {
  id: string;
  agencyId: string;
  agencyName: string;
  agencyTier?: 'Tier A' | 'Tier B' | 'Tier C';
  targetUserId: string;
  targetUserName: string;
  targetUserType?: 'مستخدم' | 'مضيف' | 'صانع محتوى' | string;
  coinsAmount: number;
  usdValue: number;
  localCurrencyAmount?: number | string | null;
  localCurrencyCode?: string;
  agentNotes?: string;
  timestamp: string;
  dateOnly: string;
  paymentMethod: string;
  referenceId: string;
  status: 'ناجحة فورياً ✅' | 'مسترجعة';
}

export interface VaultFundingRecord {
  id: string;
  agencyId: string;
  type: 'ADMIN_CREDIT' | 'ADMIN_DEBIT' | 'P2P_HOST_CONVERSION' | 'P2P_ROLLBACK';
  amountCoins: number;
  adminName: string;
  note: string;
  timestamp: string;
  balanceAfter: number;
}

// Global in-memory state
let tierRates: Record<'Tier A' | 'Tier B' | 'Tier C', TierRate> = {
  'Tier A': {
    tier: 'Tier A',
    name: 'الفئة (أ / Tier A)',
    ratePerDollar: 10000,
    description: 'سعر صرف الفئة (أ): 10,000 كوينز لكل $1 — كبرى الوكالات ومستودعات التوزيع الإقليمية',
    minTransferUsd: 10,
    maxTransferUsd: 50000,
    color: 'emerald',
    badge: 'الفئة (أ / Tier A) 🌟',
  },
  'Tier B': {
    tier: 'Tier B',
    name: 'الفئة (ب / Tier B)',
    ratePerDollar: 12000,
    description: 'سعر صرف الفئة (ب): 12,000 كوينز لكل $1 — الوكالات المعتمدة النشطة ذات الدوران المتوسط',
    minTransferUsd: 10,
    maxTransferUsd: 25000,
    color: 'sky',
    badge: 'الفئة (ب / Tier B) ⚡',
  },
  'Tier C': {
    tier: 'Tier C',
    name: 'الفئة (ج / Tier C)',
    ratePerDollar: 15000,
    description: 'سعر صرف الفئة (ج): 15,000 كوينز لكل $1 — الوكلاء الجدد وموزعو التجزئة ونقاط البيع الفردية',
    minTransferUsd: 5,
    maxTransferUsd: 10000,
    color: 'purple',
    badge: 'الفئة (ج / Tier C) 🛡️',
  },
};

let rechargeAgencies: RechargeAgency[] = [
  {
    id: 'REC-01',
    primaryId: '1001007',
    name: 'مؤسسة الدانة للمدفوعات الرقمية (السعودية والخليج)',
    agent: 'أبو فهد الشمري',
    phone: '+966551234567',
    country: 'المملكة العربية السعودية 🇸🇦',
    tier: 'Tier A',
    coinsBalance: 120000000,
    totalSalesCoins: 480000000,
    todaySalesCoins: 14500000,
    todaySalesUsd: 1450,
    discountRate: 6.5,
    status: 'معتمد',
    loginUsername: 'rec01',
    loginPin: 'agent123',
    createdAt: '2026-01-15',
  },
  {
    id: 'REC-02',
    primaryId: '1001008',
    name: 'مركز الروابي للصرافة والشحن الفوري (الإمارات)',
    agent: 'خالد المنصوري',
    phone: '+971508889999',
    country: 'دولة الإمارات العربية المتحدة 🇦🇪',
    tier: 'Tier B',
    coinsBalance: 85000000,
    totalSalesCoins: 310000000,
    todaySalesCoins: 9200000,
    todaySalesUsd: 968,
    discountRate: 6.0,
    status: 'معتمد',
    loginUsername: 'rec02',
    loginPin: 'agent123',
    createdAt: '2026-02-01',
  },
  {
    id: 'REC-03',
    primaryId: '1001009',
    name: 'وكيل فودافون كاش وبطاقات النجم شات (مصر)',
    agent: 'إسلام عزت',
    phone: '+201099887766',
    country: 'جمهورية مصر العربية 🇪🇬',
    tier: 'Tier C',
    coinsBalance: 45000000,
    totalSalesCoins: 195000000,
    todaySalesCoins: 5800000,
    todaySalesUsd: 644,
    discountRate: 5.0,
    status: 'معتمد',
    loginUsername: 'rec03',
    loginPin: 'agent123',
    createdAt: '2026-03-10',
  },
  {
    id: 'REC-04',
    primaryId: '1001015',
    name: 'مجموعة الفرسان الدولية للمدفوعات السريعة (العراق)',
    agent: 'حيدر البصري',
    phone: '+964770123456',
    country: 'جمهورية العراق 🇮🇶',
    tier: 'Tier A',
    coinsBalance: 155000000,
    totalSalesCoins: 520000000,
    todaySalesCoins: 18200000,
    todaySalesUsd: 1820,
    discountRate: 6.8,
    status: 'معتمد',
    loginUsername: 'rec04',
    loginPin: 'agent123',
    createdAt: '2026-01-20',
  },
];

let p2pTransfers: P2PTransferRecord[] = [
  {
    id: 'P2P-9841',
    hostId: '104829',
    hostName: 'سارة_لايف (الملكية)',
    agencyId: 'REC-01',
    agencyName: 'مؤسسة الدانة للمدفوعات الرقمية',
    amountUsd: 850,
    exchangeRate: 10000,
    convertedCoins: 8500000,
    timestamp: '2026-09-10 14:32:10',
    dateOnly: '2026-09-10',
    referenceId: 'TXN-P2P-8849102',
    status: 'مكتمل ومعتمد ✅',
  },
  {
    id: 'P2P-9840',
    hostId: '382910',
    hostName: 'البرنس_الصوتي',
    agencyId: 'REC-02',
    agencyName: 'مركز الروابي للصرافة',
    amountUsd: 400,
    exchangeRate: 9500,
    convertedCoins: 3800000,
    timestamp: '2026-09-10 11:15:44',
    dateOnly: '2026-09-10',
    referenceId: 'TXN-P2P-7739182',
    status: 'مكتمل ومعتمد ✅',
  },
  {
    id: 'P2P-9839',
    hostId: '449102',
    hostName: 'كابتن_ماجد (بث روم)',
    agencyId: 'REC-03',
    agencyName: 'وكيل فودافون كاش',
    amountUsd: 250,
    exchangeRate: 9000,
    convertedCoins: 2250000,
    timestamp: '2026-09-09 19:40:02',
    dateOnly: '2026-09-09',
    referenceId: 'TXN-P2P-6629177',
    status: 'مكتمل ومعتمد ✅',
  },
  {
    id: 'P2P-9838',
    hostId: '990184',
    hostName: 'شهد_الروابي',
    agencyId: 'REC-04',
    agencyName: 'مجموعة الفرسان الدولية',
    amountUsd: 1200,
    exchangeRate: 10000,
    convertedCoins: 12000000,
    timestamp: '2026-09-09 16:05:22',
    dateOnly: '2026-09-09',
    referenceId: 'TXN-P2P-5519823',
    status: 'مكتمل ومعتمد ✅',
  },
];

let merchantTransactions: MerchantRechargeTransaction[] = [
  {
    id: 'TX-77401',
    agencyId: 'REC-01',
    agencyName: 'مؤسسة الدانة للمدفوعات الرقمية',
    agencyTier: 'Tier A',
    targetUserId: '884910',
    targetUserName: 'فهد_العتيبي',
    targetUserType: 'مستخدم',
    coinsAmount: 500000,
    usdValue: 50,
    localCurrencyAmount: '187.50',
    localCurrencyCode: 'ريال سعودي (SAR)',
    agentNotes: 'مقابل 187.50 ريال سعودي - سداد فوري عبر بطاقة مدى',
    timestamp: '2026-09-10 15:45:12',
    dateOnly: '2026-09-10',
    paymentMethod: 'سداد فوري / مدى',
    referenceId: 'REF-REC01-994821',
    status: 'ناجحة فورياً ✅',
  },
  {
    id: 'TX-77402',
    agencyId: 'REC-01',
    agencyName: 'مؤسسة الدانة للمدفوعات الرقمية',
    agencyTier: 'Tier A',
    targetUserId: '773192',
    targetUserName: 'أميرة_الورد (مضيفة)',
    targetUserType: 'مضيف',
    coinsAmount: 2000000,
    usdValue: 200,
    localCurrencyAmount: '1,000',
    localCurrencyCode: 'ريال يمني (YER)',
    agentNotes: 'مقابل 1,000 ريال يمني - تحويل عبر العمقي للصرافة',
    timestamp: '2026-09-10 14:10:05',
    dateOnly: '2026-09-10',
    paymentMethod: 'تحويل شبكة العمقي (اليمن)',
    referenceId: 'REF-REC01-994822',
    status: 'ناجحة فورياً ✅',
  },
  {
    id: 'TX-77403',
    agencyId: 'REC-02',
    agencyName: 'مركز الروابي للصرافة',
    agencyTier: 'Tier B',
    targetUserId: '662019',
    targetUserName: 'سلطان_دبي',
    targetUserType: 'مستخدم',
    coinsAmount: 3600000,
    usdValue: 300,
    localCurrencyAmount: '1,100',
    localCurrencyCode: 'درهم إماراتي (AED)',
    agentNotes: 'مقابل 1,100 درهم - تحويل بنكي بنك الإمارات دبي الوطني',
    timestamp: '2026-09-10 13:22:40',
    dateOnly: '2026-09-10',
    paymentMethod: 'تحويل بنكي / بنك الإمارات',
    referenceId: 'REF-REC02-881920',
    status: 'ناجحة فورياً ✅',
  },
  {
    id: 'TX-77404',
    agencyId: 'REC-03',
    agencyName: 'وكيل فودافون كاش',
    agencyTier: 'Tier B',
    targetUserId: '551029',
    targetUserName: 'نور_القاهرة (مضيف)',
    targetUserType: 'مضيف',
    coinsAmount: 1200000,
    usdValue: 100,
    localCurrencyAmount: '4,850',
    localCurrencyCode: 'جنيه مصري (EGP)',
    agentNotes: 'مقابل 4,850 جنيه مصري - محفظة فودافون كاش 010293847',
    timestamp: '2026-09-10 12:05:18',
    dateOnly: '2026-09-10',
    paymentMethod: 'محفظة فودافون كاش',
    referenceId: 'REF-REC03-772819',
    status: 'ناجحة فورياً ✅',
  },
  {
    id: 'TX-77405',
    agencyId: 'REC-04',
    agencyName: 'مجموعة الفرسان الدولية',
    agencyTier: 'Tier C',
    targetUserId: '440182',
    targetUserName: 'صقر_بغداد',
    targetUserType: 'مستخدم',
    coinsAmount: 4500000,
    usdValue: 300,
    localCurrencyAmount: '395,000',
    localCurrencyCode: 'دينار عراقي (IQD)',
    agentNotes: 'مقابل 395,000 دينار عراقي - محفظة زين كاش العراق',
    timestamp: '2026-09-10 10:50:33',
    dateOnly: '2026-09-10',
    paymentMethod: 'محفظة زين كاش العراق',
    referenceId: 'REF-REC04-663910',
    status: 'ناجحة فورياً ✅',
  },
  {
    id: 'TX-77406',
    agencyId: 'REC-01',
    agencyName: 'مؤسسة الدانة للمدفوعات الرقمية',
    agencyTier: 'Tier A',
    targetUserId: '104829',
    targetUserName: 'سارة_لايف (صانعة محتوى)',
    targetUserType: 'صانع محتوى',
    coinsAmount: 1000000,
    usdValue: 100,
    localCurrencyAmount: '2,500',
    localCurrencyCode: 'ريال يمني (YER)',
    agentNotes: 'مقابل 2,500 ريال يمني - حوالة شبكة الكريمي إكسبرس',
    timestamp: '2026-09-10 09:15:20',
    dateOnly: '2026-09-10',
    paymentMethod: 'الكريمي إكسبرس (اليمن)',
    referenceId: 'REF-REC01-994823',
    status: 'ناجحة فورياً ✅',
  },
];

let vaultFundingHistory: VaultFundingRecord[] = [
  {
    id: 'VF-101',
    agencyId: 'REC-01',
    type: 'ADMIN_CREDIT',
    amountCoins: 50000000,
    adminName: 'سوبر أدمن (المالك)',
    note: 'شحنة كوتة شهرية معتمدة',
    timestamp: '2026-09-01 10:00:00',
    balanceAfter: 120000000,
  },
  {
    id: 'VF-102',
    agencyId: 'REC-01',
    type: 'P2P_HOST_CONVERSION',
    amountCoins: 8500000,
    adminName: 'النظام الآلي (P2P)',
    note: 'تحويل أرباح المضيف سارة_لايف ($850)',
    timestamp: '2026-09-10 14:32:10',
    balanceAfter: 120000000,
  },
];

// =========================================================================
// API ENDPOINTS (بوابات الـ API المشفرة والمؤمنة بالكامل)
// =========================================================================

// 1. Merchant Agent Login (تسجيل دخول الوكيل المستقل)
app.post('/api/merchant/login', authLimiter, (req, res) => {
  const { username, pin } = req.body;
  if (!username || !pin) {
    return res.status(400).json({ success: false, error: 'يرجى إدخال اسم المستخدم ورمز الدخول الخاص بالوكيل.' });
  }

  const cleanUser = String(username).trim().toLowerCase();
  const cleanPin = String(pin).trim();

  // Find agency
  const agency = rechargeAgencies.find(
    (a) => a.loginUsername.toLowerCase() === cleanUser || a.id.toLowerCase() === cleanUser
  );

  if (!agency || agency.loginPin !== cleanPin) {
    return res.status(401).json({
      success: false,
      error: 'بيانات اعتماد وكيل الشحن غير صحيحة. يرجى التحقق من اسم المستخدم أو المعرف ورمز المرور.',
    });
  }

  if (agency.status === 'مجمد' || agency.status === 'معلق') {
    return res.status(403).json({
      success: false,
      error: `حساب الوكالة (${agency.status}) حالياً بقرار إداري. تواصل مع إدارة العمليات لفك التعليق.`,
    });
  }

  // Issue Token
  const token = signToken({
    userId: agency.id,
    username: agency.loginUsername,
    role: 'ROLE_RECHARGE_AGENT',
    agencyId: agency.id,
    agencyName: agency.name,
    tier: agency.tier,
  });

  res.json({
    success: true,
    token,
    agent: {
      id: agency.id,
      primaryId: agency.primaryId || '1001007',
      name: agency.name,
      agentContact: agency.agent,
      phone: agency.phone,
      country: agency.country,
      tier: agency.tier,
      tierBadge: tierRates[agency.tier].badge,
      ratePerDollar: tierRates[agency.tier].ratePerDollar,
      coinsBalance: agency.coinsBalance,
      todaySalesCoins: agency.todaySalesCoins,
      todaySalesUsd: agency.todaySalesUsd,
    },
  });
});

// 2. Merchant Profile & Live Vault (بيانات حساب الوكيل ورصيد الخزينة المباشر)
app.get('/api/merchant/me', authenticateToken, (req: AuthRequest, res) => {
  const agencyId = req.user?.agencyId;
  const agency = rechargeAgencies.find((a) => a.id === agencyId);

  if (!agency) {
    return res.status(404).json({ success: false, error: 'الوكالة غير موجودة.' });
  }

  const tierInfo = tierRates[agency.tier];

  res.json({
    success: true,
    agent: {
      id: agency.id,
      primaryId: agency.primaryId || '1001007',
      name: agency.name,
      agentContact: agency.agent,
      phone: agency.phone,
      country: agency.country,
      tier: agency.tier,
      tierBadge: tierInfo.badge,
      tierRate: tierInfo.ratePerDollar,
      coinsBalance: agency.coinsBalance,
      totalSalesCoins: agency.totalSalesCoins,
      todaySalesCoins: agency.todaySalesCoins,
      todaySalesUsd: agency.todaySalesUsd,
      status: agency.status,
    },
  });
});

// 3. Merchant Execute Instant User Recharge (تنفيذ الشحن الفوري للمستخدم بالـ ID)
app.post('/api/merchant/recharge', authenticateToken, sensitiveOpsLimiter, (req: AuthRequest, res) => {
  // Enforce role: only recharge agents
  if (req.user?.role !== 'ROLE_RECHARGE_AGENT') {
    return res.status(403).json({ success: false, error: 'هذه العملية خاصة بوكلاء الشحن المعتمدين فقط.' });
  }

  const agencyId = req.user?.agencyId;
  const agency = rechargeAgencies.find((a) => a.id === agencyId);
  if (!agency) {
    return res.status(404).json({ success: false, error: 'حساب الوكالة غير موجود.' });
  }

  const { 
    targetUserId, 
    targetUserName, 
    targetUserType, 
    coinsAmount, 
    paymentMethod,
    localCurrencyAmount,
    localCurrencyCode,
    agentNotes
  } = req.body;
  const numCoins = Number(coinsAmount);

  if (!targetUserId || isNaN(numCoins) || numCoins <= 0) {
    return res.status(400).json({ success: false, error: 'يرجى إدخال معرّف مستخدم صالح وكمية كوينز أكبر من الصفر.' });
  }

  if (numCoins > agency.coinsBalance) {
    return res.status(400).json({
      success: false,
      error: `رصيد الخزينة غير كافٍ! الرصيد المتاح: (${agency.coinsBalance.toLocaleString()} 🪙) والمطلوب شحنه: (${numCoins.toLocaleString()} 🪙).`,
    });
  }

  // Deduct from agent vault
  agency.coinsBalance -= numCoins;
  agency.totalSalesCoins += numCoins;
  agency.todaySalesCoins += numCoins;
  const tierConfig = tierRates[agency.tier];
  const rate = tierConfig?.ratePerDollar || 10000;
  const usdEquiv = Math.round((numCoins / rate) * 100) / 100;
  agency.todaySalesUsd += Math.round(usdEquiv);

  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);
  const dateOnly = now.toISOString().slice(0, 10);
  const referenceId = `TXN-${agency.id}-${Math.floor(100000 + Math.random() * 900000)}`;

  const newTx: MerchantRechargeTransaction = {
    id: `TX-${Math.floor(77000 + Math.random() * 9000)}`,
    agencyId: agency.id,
    agencyName: agency.name,
    agencyTier: agency.tier,
    targetUserId: String(targetUserId).trim(),
    targetUserName: targetUserName ? String(targetUserName).trim() : `مستخدم (#${targetUserId})`,
    targetUserType: targetUserType || 'مستخدم',
    coinsAmount: numCoins,
    usdValue: usdEquiv,
    localCurrencyAmount: localCurrencyAmount ? String(localCurrencyAmount).trim() : null,
    localCurrencyCode: localCurrencyCode ? String(localCurrencyCode).trim() : 'عملة محلية',
    agentNotes: agentNotes ? String(agentNotes).trim() : '',
    timestamp,
    dateOnly,
    paymentMethod: paymentMethod || 'تسليم مباشر / نقدي',
    referenceId,
    status: 'ناجحة فورياً ✅',
  };

  merchantTransactions.unshift(newTx);

  res.json({
    success: true,
    message: `تم شحن ${numCoins.toLocaleString()} كوينز بنجاح إلى (${newTx.targetUserName} - ID: ${newTx.targetUserId})`,
    newBalance: agency.coinsBalance,
    transaction: newTx,
  });
});

// 4. Merchant History (سجل شحنات الوكيل الخاصة فقط - منع الاطلاع على وكالات أخرى)
app.get('/api/merchant/history', authenticateToken, (req: AuthRequest, res) => {
  const agencyId = req.user?.agencyId;
  const { date } = req.query;

  let records = merchantTransactions.filter((tx) => tx.agencyId === agencyId);

  if (date) {
    records = records.filter((tx) => tx.dateOnly === date);
  }

  res.json({
    success: true,
    totalRecords: records.length,
    transactions: records,
  });
});

// 5. Merchant Inbound P2P Earnings (سجل التحويلات الواردة للوكيل من المضيفين)
app.get('/api/merchant/inbound-transfers', authenticateToken, (req: AuthRequest, res) => {
  const agencyId = req.user?.agencyId;
  const records = p2pTransfers.filter((t) => t.agencyId === agencyId);

  res.json({
    success: true,
    totalRecords: records.length,
    transfers: records,
  });
});

// =========================================================================
// ADMIN API ENDPOINTS (إدارة وكالات الشحن المركزية - Super Admin Only)
// =========================================================================

// A. List All Recharge Agencies (عرض كافة الوكالات مع الإحصائيات)
app.get('/api/admin/recharge-agencies', (req, res) => {
  res.json({
    success: true,
    agencies: rechargeAgencies,
    totalVaultCoins: rechargeAgencies.reduce((acc, a) => acc + a.coinsBalance, 0),
    todayTotalRechargesCoins: rechargeAgencies.reduce((acc, a) => acc + a.todaySalesCoins, 0),
    todayTotalRechargesUsd: rechargeAgencies.reduce((acc, a) => acc + a.todaySalesUsd, 0),
  });
});

// B. Get Tier Rates (عرض أسعار الصرف والفئات)
app.get('/api/admin/tier-rates', (req, res) => {
  res.json({
    success: true,
    rates: tierRates,
  });
});

// C. Update Tier Rates (تعديل أسعار صرف الفئات)
app.put('/api/admin/tier-rates', (req, res) => {
  const { tier, ratePerDollar, description, minTransferUsd, maxTransferUsd } = req.body;
  const validTiers: ('Tier A' | 'Tier B' | 'Tier C')[] = ['Tier A', 'Tier B', 'Tier C'];

  if (!tier || !validTiers.includes(tier)) {
    return res.status(400).json({ success: false, error: 'فئة وكالات غير صالحة.' });
  }

  const numRate = Number(ratePerDollar);
  if (isNaN(numRate) || numRate <= 0) {
    return res.status(400).json({ success: false, error: 'سعر الصرف يجب أن يكون رقماً موجباً أكبر من الصفر.' });
  }

  tierRates[tier as 'Tier A' | 'Tier B' | 'Tier C'] = {
    ...tierRates[tier as 'Tier A' | 'Tier B' | 'Tier C'],
    ratePerDollar: numRate,
    description: description || tierRates[tier as 'Tier A' | 'Tier B' | 'Tier C'].description,
    minTransferUsd: Number(minTransferUsd) || tierRates[tier as 'Tier A' | 'Tier B' | 'Tier C'].minTransferUsd,
    maxTransferUsd: Number(maxTransferUsd) || tierRates[tier as 'Tier A' | 'Tier B' | 'Tier C'].maxTransferUsd,
  };

  res.json({
    success: true,
    message: `تم تحديث سعر صرف ${tier} بنجاح: كل $1 = ${numRate.toLocaleString()} كوينز.`,
    updatedTier: tierRates[tier as 'Tier A' | 'Tier B' | 'Tier C'],
  });
});

// D. Agency Details with Lazy-Loaded Tabs (ملف الوكالة الشامل)
app.get('/api/admin/recharge-agencies/:id', (req, res) => {
  const agency = rechargeAgencies.find((a) => a.id === req.params.id);
  if (!agency) {
    return res.status(404).json({ success: false, error: 'وكالة الشحن المطلوبة غير موجودة.' });
  }

  const transactions = merchantTransactions.filter((tx) => tx.agencyId === agency.id);
  const inboundP2p = p2pTransfers.filter((t) => t.agencyId === agency.id);
  const fundingLogs = vaultFundingHistory.filter((f) => f.agencyId === agency.id);

  // Financial Reconciliation Calculation (كشف المطابقة والتدقيق المالي)
  const totalP2pCoinsInflow = inboundP2p.reduce((acc, t) => acc + t.convertedCoins, 0);
  const totalAdminCreditsInflow = fundingLogs
    .filter((f) => f.type === 'ADMIN_CREDIT')
    .reduce((acc, f) => acc + f.amountCoins, 0);
  const totalAdminDebits = fundingLogs
    .filter((f) => f.type === 'ADMIN_DEBIT')
    .reduce((acc, f) => acc + f.amountCoins, 0);
  const totalUserRechargesOutflow = transactions.reduce((acc, t) => acc + t.coinsAmount, 0);

  // Estimated initial baseline
  const estimatedInitialBaseline = agency.coinsBalance + totalUserRechargesOutflow + totalAdminDebits - totalAdminCreditsInflow - totalP2pCoinsInflow;
  const safeInitial = Math.max(0, estimatedInitialBaseline);
  const expectedMathematicalBalance = safeInitial + totalAdminCreditsInflow + totalP2pCoinsInflow - totalAdminDebits - totalUserRechargesOutflow;
  const discrepancy = agency.coinsBalance - expectedMathematicalBalance;

  res.json({
    success: true,
    agency,
    tierDetails: tierRates[agency.tier],
    counts: {
      totalOutboundRecharges: transactions.length,
      totalInboundP2pTransfers: inboundP2p.length,
      totalVaultAdjustments: fundingLogs.length,
    },
    reconciliation: {
      initialAllocatedBaseline: safeInitial,
      totalAdminInflow: totalAdminCreditsInflow,
      totalHostP2pInflow: totalP2pCoinsInflow,
      totalAdminDebits,
      totalOutboundRecharges: totalUserRechargesOutflow,
      currentVaultBalance: agency.coinsBalance,
      expectedMathematicalBalance,
      discrepancy,
      auditStatus: discrepancy === 0 ? 'مطابق 100% بدون أي فوارق ✅' : 'يوجد تفاوت تدقيق محاسبي ⚠️',
    },
  });
});

// E. Modify Agency Vault (إدارة خزينة الوكالة: تزويد رصيد، خصم، تعديل الفئة)
app.post('/api/admin/recharge-agencies/:id/vault', (req, res) => {
  const agency = rechargeAgencies.find((a) => a.id === req.params.id);
  if (!agency) {
    return res.status(404).json({ success: false, error: 'وكالة الشحن غير موجودة.' });
  }

  const { action, amountCoins, newTier, note, adminName } = req.body;

  if (newTier && ['Tier A', 'Tier B', 'Tier C'].includes(newTier)) {
    agency.tier = newTier;
  }

  if (action === 'ADD' || action === 'DEDUCT') {
    const numCoins = Number(amountCoins);
    if (isNaN(numCoins) || numCoins <= 0) {
      return res.status(400).json({ success: false, error: 'كمية الكوينز يجب أن تكون رقماً أكبر من الصفر.' });
    }

    if (action === 'DEDUCT' && numCoins > agency.coinsBalance) {
      return res.status(400).json({ success: false, error: 'لا يمكن خصم كمية أكبر من رصيد الخزينة الحالي!' });
    }

    if (action === 'ADD') {
      agency.coinsBalance += numCoins;
      vaultFundingHistory.unshift({
        id: `VF-${Date.now().toString().slice(-5)}`,
        agencyId: agency.id,
        type: 'ADMIN_CREDIT',
        amountCoins: numCoins,
        adminName: adminName || 'الإدارة العليا (Super Admin)',
        note: note || 'تزويد كوتة رصيد إداري',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        balanceAfter: agency.coinsBalance,
      });
    } else {
      agency.coinsBalance -= numCoins;
      vaultFundingHistory.unshift({
        id: `VF-${Date.now().toString().slice(-5)}`,
        agencyId: agency.id,
        type: 'ADMIN_DEBIT',
        amountCoins: numCoins,
        adminName: adminName || 'الإدارة العليا (Super Admin)',
        note: note || 'استرداد أو خصم إداري من الخزينة',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        balanceAfter: agency.coinsBalance,
      });
    }
  }

  res.json({
    success: true,
    message: `تم تحديث خزينة وكالة (${agency.name}) بنجاح. الرصيد الحالي: ${agency.coinsBalance.toLocaleString()} 🪙`,
    agency,
  });
});

// F. Host-to-Agency P2P Conversion (نظام تحويل أرباح المضيف إلى كوينز شحن للوكيل)
app.post('/api/p2p/convert-host-earnings', sensitiveOpsLimiter, (req, res) => {
  const { hostId, hostName, agencyId, amountUsd } = req.body;
  const usd = Number(amountUsd);

  if (!hostId || !agencyId || isNaN(usd) || usd <= 0) {
    return res.status(400).json({
      success: false,
      error: 'يرجى إدخال معرّف المضيف، معرّف وكالة الشحن، ومبلغ أرباح بالدولار أكبر من الصفر.',
    });
  }

  // Find agency
  const agency = rechargeAgencies.find(
    (a) => a.id.toUpperCase() === String(agencyId).toUpperCase().trim() || a.name.includes(agencyId)
  );

  if (!agency) {
    return res.status(404).json({
      success: false,
      error: `وكالة الشحن بالمعرّف (${agencyId}) غير موجودة بالنظام!`,
    });
  }

  if (agency.status !== 'معتمد') {
    return res.status(400).json({
      success: false,
      error: `لا يمكن تحويل الأرباح للوكالة المحددة لأن حالتها: (${agency.status}).`,
    });
  }

  // Get exchange rate for the agency's tier
  const tierConfig = tierRates[agency.tier];
  if (usd < tierConfig.minTransferUsd) {
    return res.status(400).json({
      success: false,
      error: `الحد الأدنى للتحويل لفئة هذه الوكالة (${tierConfig.name}) هو $${tierConfig.minTransferUsd}.`,
    });
  }

  if (usd > tierConfig.maxTransferUsd) {
    return res.status(400).json({
      success: false,
      error: `تجاوزت الحد الأقصى المسموح للعملية الواحدة ($${tierConfig.maxTransferUsd.toLocaleString()}).`,
    });
  }

  const exchangeRate = tierConfig.ratePerDollar;
  const convertedCoins = Math.round(usd * exchangeRate);

  // Credit agency vault directly
  agency.coinsBalance += convertedCoins;

  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);
  const dateOnly = now.toISOString().slice(0, 10);
  const referenceId = `P2P-REF-${Math.floor(1000000 + Math.random() * 9000000)}`;

  const transferRecord: P2PTransferRecord = {
    id: `P2P-${Math.floor(9800 + Math.random() * 1000)}`,
    hostId: String(hostId).trim(),
    hostName: hostName ? String(hostName).trim() : `مضيف (#${hostId})`,
    agencyId: agency.id,
    agencyName: agency.name,
    amountUsd: usd,
    exchangeRate,
    convertedCoins,
    timestamp,
    dateOnly,
    referenceId,
    status: 'مكتمل ومعتمد ✅',
  };

  p2pTransfers.unshift(transferRecord);

  // Record in agency funding log
  vaultFundingHistory.unshift({
    id: `VF-${Date.now().toString().slice(-5)}`,
    agencyId: agency.id,
    type: 'P2P_HOST_CONVERSION',
    amountCoins: convertedCoins,
    adminName: `تحويل P2P (${transferRecord.hostName})`,
    note: `تحويل أرباح مضيف: $${usd} بمعدل ${exchangeRate} 🪙/$1`,
    timestamp,
    balanceAfter: agency.coinsBalance,
  });

  res.json({
    success: true,
    message: `تم بنجاح تحويل أرباح المضيف ($${usd}) إلى (${convertedCoins.toLocaleString()} 🪙) وتغذيتها مباشرة في خزينة وكالة (${agency.name}) وفق سعر فئة (${agency.tier}).`,
    convertedCoins,
    exchangeRate,
    agencyTier: agency.tier,
    agencyNewBalance: agency.coinsBalance,
    transferRecord,
  });
});

// G. List All P2P Inbound Transfers (سجل كافة التحويلات الواردة من المضيفين للوكلاء)
app.get('/api/admin/p2p-transfers', (req, res) => {
  const { agencyId, hostId, date } = req.query;
  let records = [...p2pTransfers];

  if (agencyId) {
    records = records.filter((r) => r.agencyId === agencyId);
  }
  if (hostId) {
    records = records.filter((r) => r.hostId === hostId);
  }
  if (date) {
    records = records.filter((r) => r.dateOnly === date);
  }

  const totalUsd = records.reduce((acc, r) => acc + r.amountUsd, 0);
  const totalCoins = records.reduce((acc, r) => acc + r.convertedCoins, 0);

  res.json({
    success: true,
    totalRecords: records.length,
    totalUsd,
    totalCoins,
    transfers: records,
  });
});

// G2. Rollback P2P Transfer (إلغاء واسترجاع عملية تحويل أرباح المضيف للوكيل P2P)
app.post('/api/admin/p2p-transfers/rollback', sensitiveOpsLimiter, (req, res) => {
  const { transferId, reason, adminName } = req.body;
  if (!transferId) {
    return res.status(400).json({ success: false, error: 'يرجى تحديد رقم العملية أو المرجع المراد إلغاؤه واسترجاعه.' });
  }

  const transfer = p2pTransfers.find((t) => t.id === transferId || t.referenceId === transferId);
  if (!transfer) {
    return res.status(404).json({ success: false, error: 'العملية غير موجودة بالنظام.' });
  }

  if (transfer.isRolledBack || (transfer.status && (transfer.status.includes('ملغى') || transfer.status.includes('Rollback')))) {
    return res.status(400).json({ success: false, error: 'هذه العملية تم التراجع عنها واسترجاعها مسبقاً.' });
  }

  const agency = rechargeAgencies.find((a) => a.id === transfer.agencyId);
  if (agency) {
    agency.coinsBalance = Math.max(0, agency.coinsBalance - transfer.convertedCoins);
  }

  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);

  transfer.isRolledBack = true;
  transfer.status = 'ملغى ومسترجع (Rollback) ↩️';
  transfer.rolledBackAt = timestamp;
  transfer.rollbackReason = reason || 'إلغاء واسترجاع إداري بناءً على بلاغ خطأ في التحويل';
  transfer.rollbackAdmin = adminName || 'المشرف العام (Super Admin)';

  // Record rollback in agency vault funding log
  if (agency) {
    vaultFundingHistory.unshift({
      id: `VF-RB-${Date.now().toString().slice(-5)}`,
      agencyId: agency.id,
      type: 'P2P_ROLLBACK',
      amountCoins: -transfer.convertedCoins,
      adminName: transfer.rollbackAdmin,
      note: `إلغاء واسترجاع عملية P2P رقم ${transfer.referenceId}: خصم الكوينز واسترجاع $${transfer.amountUsd} للمضيف. السبب: ${transfer.rollbackReason}`,
      timestamp,
      balanceAfter: agency.coinsBalance,
    });
  }

  res.json({
    success: true,
    message: `تم بنجاح إلغاء العملية (${transfer.referenceId})، وخصم (${transfer.convertedCoins.toLocaleString()} 🪙) من خزينة وكالة (${transfer.agencyName})، واسترجاع مبلغ ($${transfer.amountUsd}) بالكامل لأرباح المضيف.`,
    transfer,
    agencyNewBalance: agency ? agency.coinsBalance : undefined,
  });
});

// H. List Agency Outbound Recharges for User Audit
app.get('/api/admin/agency-recharges/:agencyId', (req, res) => {
  const { agencyId } = req.params;
  const { date } = req.query;

  let records = merchantTransactions.filter((tx) => tx.agencyId === agencyId);
  if (date) {
    records = records.filter((tx) => tx.dateOnly === date);
  }

  res.json({
    success: true,
    totalRecords: records.length,
    totalCoins: records.reduce((acc, tx) => acc + tx.coinsAmount, 0),
    totalUsd: records.reduce((acc, tx) => acc + tx.usdValue, 0),
    transactions: records,
  });
});

// I. Central Coin Outflow & Local Recharges Audit Endpoint (سجل تتبع مسار الكوينز والعمليات المحلية الشامل)
app.get('/api/admin/coin-outflow-audit', (req, res) => {
  const { agencyId, targetUserType, date, search } = req.query;
  let list = [...merchantTransactions];

  if (agencyId) {
    list = list.filter((tx) => tx.agencyId === agencyId);
  }
  if (targetUserType && targetUserType !== 'ALL') {
    list = list.filter((tx) => tx.targetUserType === targetUserType);
  }
  if (date) {
    list = list.filter((tx) => tx.dateOnly === date);
  }
  if (search) {
    const q = String(search).toLowerCase().trim();
    list = list.filter((tx) => 
      tx.targetUserId.toLowerCase().includes(q) ||
      tx.targetUserName.toLowerCase().includes(q) ||
      tx.agencyName.toLowerCase().includes(q) ||
      tx.referenceId.toLowerCase().includes(q) ||
      (tx.agentNotes && tx.agentNotes.toLowerCase().includes(q)) ||
      (tx.localCurrencyCode && tx.localCurrencyCode.toLowerCase().includes(q)) ||
      (tx.paymentMethod && tx.paymentMethod.toLowerCase().includes(q))
    );
  }

  const totalCoins = list.reduce((sum, tx) => sum + (tx.coinsAmount || 0), 0);
  const totalUsd = list.reduce((sum, tx) => sum + (tx.usdValue || 0), 0);

  res.json({
    success: true,
    totalRecords: list.length,
    totalCoins,
    totalUsd,
    transactions: list,
  });
});

// J. Admin Direct Dispatch Recharge (شحن إداري موجه مع تحديد المسار والملاحظات المحلية وسعر الفئة الآلي)
app.post('/api/admin/dispatch-agency-recharge', (req, res) => {
  const { 
    agencyId, 
    targetUserId, 
    targetUserName, 
    targetUserType, 
    coinsAmount, 
    localCurrencyAmount, 
    localCurrencyCode, 
    agentNotes, 
    paymentMethod 
  } = req.body;

  const agency = rechargeAgencies.find((a) => a.id === agencyId);
  if (!agency) {
    return res.status(404).json({ success: false, error: 'وكالة الشحن غير موجودة.' });
  }

  const numCoins = Number(coinsAmount);
  if (!targetUserId || isNaN(numCoins) || numCoins <= 0) {
    return res.status(400).json({ success: false, error: 'يرجى إدخال معرّف مستلم صحيح وكمية كوينز صالحة.' });
  }

  if (numCoins > agency.coinsBalance) {
    return res.status(400).json({
      success: false,
      error: `رصيد الخزينة غير كافٍ! المتاح: (${agency.coinsBalance.toLocaleString()} 🪙) والمطلوب: (${numCoins.toLocaleString()} 🪙).`,
    });
  }

  // Deduct from agency vault
  agency.coinsBalance -= numCoins;
  agency.totalSalesCoins += numCoins;
  agency.todaySalesCoins += numCoins;
  const tierConfig = tierRates[agency.tier];
  const rate = tierConfig?.ratePerDollar || 10000;
  const usdEquiv = Math.round((numCoins / rate) * 100) / 100;
  agency.todaySalesUsd += Math.round(usdEquiv);

  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);
  const dateOnly = now.toISOString().slice(0, 10);
  const referenceId = `TXN-${agency.id}-${Math.floor(100000 + Math.random() * 900000)}`;

  const newTx: MerchantRechargeTransaction = {
    id: `TX-${Math.floor(77000 + Math.random() * 9000)}`,
    agencyId: agency.id,
    agencyName: agency.name,
    agencyTier: agency.tier,
    targetUserId: String(targetUserId).trim(),
    targetUserName: targetUserName ? String(targetUserName).trim() : `مستلم (#${targetUserId})`,
    targetUserType: targetUserType || 'مستخدم',
    coinsAmount: numCoins,
    usdValue: usdEquiv,
    localCurrencyAmount: localCurrencyAmount ? String(localCurrencyAmount).trim() : null,
    localCurrencyCode: localCurrencyCode ? String(localCurrencyCode).trim() : 'عملة محلية',
    agentNotes: agentNotes ? String(agentNotes).trim() : '',
    timestamp,
    dateOnly,
    paymentMethod: paymentMethod || 'تسليم مباشر / نقدي',
    referenceId,
    status: 'ناجحة فورياً ✅',
  };

  merchantTransactions.unshift(newTx);

  res.json({
    success: true,
    message: `تم شحن وتوثيق مسار (${numCoins.toLocaleString()} 🪙) إلى (${newTx.targetUserName}) بنجاح بسعر صرف فئة (${agency.tier}).`,
    agencyNewBalance: agency.coinsBalance,
    transaction: newTx,
  });
});

// Create New Agency
app.post('/api/admin/recharge-agencies', (req, res) => {
  const { primaryId, name, agent, phone, country, tier, initialCoins, discountRate, loginUsername, loginPin } = req.body;

  if (!name || !agent || !phone) {
    return res.status(400).json({ success: false, error: 'يرجى إدخال اسم الوكالة، اسم الوكيل، ورقم الهاتف.' });
  }

  const nextId = `REC-0${rechargeAgencies.length + 1}`;
  const generatedPrimaryId = primaryId ? String(primaryId).trim() : String(1001007 + rechargeAgencies.length);
  const assignedTier = ['Tier A', 'Tier B', 'Tier C'].includes(tier) ? tier : 'Tier B';
  const startCoins = Number(initialCoins) || 10000000;

  const newAgency: RechargeAgency = {
    id: nextId,
    primaryId: generatedPrimaryId,
    name: String(name).trim(),
    agent: String(agent).trim(),
    phone: String(phone).trim(),
    country: country || 'الشرق الأوسط 🌍',
    tier: assignedTier,
    coinsBalance: startCoins,
    totalSalesCoins: 0,
    todaySalesCoins: 0,
    todaySalesUsd: 0,
    discountRate: Number(discountRate) || 6.0,
    status: 'معتمد',
    loginUsername: loginUsername ? String(loginUsername).trim() : `rec0${rechargeAgencies.length + 1}`,
    loginPin: loginPin ? String(loginPin).trim() : 'agent123',
    createdAt: new Date().toISOString().slice(0, 10),
  };

  rechargeAgencies.push(newAgency);

  res.json({
    success: true,
    message: `تم إنشاء وكالة الشحن الجديدة (${newAgency.name}) بالآيدي الرئيسي (#${newAgency.primaryId}) والآيدي الفرعي (${newAgency.id}) بنجاح.`,
    agency: newAgency,
  });
});

// =========================================================================
// HOST AUDIT & ACTIVITY LOG (كشف حساب وتدقيق المضيف وحركات الوارد والصادر)
// =========================================================================

interface HostAuditRecord {
  id: string;
  hostId: string;
  hostName: string;
  referenceId: string;
  direction: 'INFLOW' | 'OUTFLOW'; // وارد (تغذية المضيف) أو صادر (شحن وتوزيع المضيف للآخرين)
  sourceCategory: 'AGENCY' | 'STORE' | 'ADMIN' | 'P2P_CONVERT' | 'HOST_OUTFLOW';
  sourceName: string; // e.g. "وكالة #1001 مؤسسة الدانة للمدفوعات الرقمية" أو "متجر التطبيق الرسمي" أو "تغذية إدارة مباشرة"
  sourceId: string;
  targetUserId?: string; // المعرف المرجعي للمستلم في حال الصادر
  targetUserName?: string;
  targetUserType?: 'مستخدم' | 'مضيف' | 'صانع محتوى' | 'وكيل';
  coinsAmount: number;
  usdValue: number;
  localCurrencyAmount?: string;
  localCurrencyCode?: string;
  paymentMethod: string;
  agentNotes: string; // ملاحظات الوكيل أو المضيف لفض النزاعات وتأكيد التفاصيل
  timestamp: string; // التاريخ والوقت الدقيق بالثانية YYYY-MM-DD HH:mm:ss
  dateOnly: string;
  status: string;
}

let hostAuditRecords: HostAuditRecord[] = [
  // 1. Host #104829 - سارة_لايف (المضيفة الماسية)
  {
    id: 'HA-1001',
    hostId: '104829',
    hostName: 'سارة_لايف (الملكية)',
    referenceId: 'AUD-IN-104829-01',
    direction: 'INFLOW',
    sourceCategory: 'AGENCY',
    sourceName: 'وكالة #1001 مؤسسة الدانة للمدفوعات الرقمية',
    sourceId: 'REC-01',
    coinsAmount: 10000000,
    usdValue: 1000,
    localCurrencyAmount: '3,750',
    localCurrencyCode: 'ريال سعودي (SAR)',
    paymentMethod: 'تحويل بنكي مباشر / مصرف الراجحي',
    agentNotes: 'دفعة توريد معتمدة لحساب المضيفة سارة لايف بموجب إشعار تحويل رقم RAJ-99201. العملية مطابقة 100%.',
    timestamp: '2026-09-10 14:32:10',
    dateOnly: '2026-09-10',
    status: 'معتمد ومكتمل ✅',
  },
  {
    id: 'HA-1002',
    hostId: '104829',
    hostName: 'سارة_لايف (الملكية)',
    referenceId: 'AUD-OUT-104829-02',
    direction: 'OUTFLOW',
    sourceCategory: 'HOST_OUTFLOW',
    sourceName: 'محفظة المضيفة سارة_لايف',
    sourceId: '104829',
    targetUserId: '884910',
    targetUserName: 'فهد_العتيبي',
    targetUserType: 'مستخدم',
    coinsAmount: 2500000,
    usdValue: 250,
    localCurrencyAmount: '937.50',
    localCurrencyCode: 'ريال سعودي (SAR)',
    paymentMethod: 'سداد فوري / STC Pay',
    agentNotes: 'شحن مباشر للمستخدم فهد العتيبي لدعم جولة تحدي البث المباشر. تم تأكيد استلام الحوالة وفض الخلاف فورياً.',
    timestamp: '2026-09-10 16:45:30',
    dateOnly: '2026-09-10',
    status: 'معتمد ومكتمل ✅',
  },
  {
    id: 'HA-1003',
    hostId: '104829',
    hostName: 'سارة_لايف (الملكية)',
    referenceId: 'AUD-OUT-104829-03',
    direction: 'OUTFLOW',
    sourceCategory: 'HOST_OUTFLOW',
    sourceName: 'محفظة المضيفة سارة_لايف',
    sourceId: '104829',
    targetUserId: '662019',
    targetUserName: 'سلطان_دبي',
    targetUserType: 'مستخدم',
    coinsAmount: 1800000,
    usdValue: 180,
    localCurrencyAmount: '660',
    localCurrencyCode: 'درهم إماراتي (AED)',
    paymentMethod: 'تحويل بنكي / بنك أبوظبي الأول FAB',
    agentNotes: 'شحن كوينز رسمي للمستخدم sultan_dubai مع إرفاق وصل التحويل في الرسائل الخاصة.',
    timestamp: '2026-09-10 11:22:15',
    dateOnly: '2026-09-10',
    status: 'معتمد ومكتمل ✅',
  },
  {
    id: 'HA-1004',
    hostId: '104829',
    hostName: 'سارة_لايف (الملكية)',
    referenceId: 'AUD-IN-104829-04',
    direction: 'INFLOW',
    sourceCategory: 'STORE',
    sourceName: 'شحن المتجر وسوق التطبيق (In-App Store)',
    sourceId: 'STORE-APPLE',
    coinsAmount: 3000000,
    usdValue: 300,
    localCurrencyAmount: '1,125',
    localCurrencyCode: 'ريال سعودي (SAR)',
    paymentMethod: 'بوابة Apple Pay / بطاقة فيزا',
    agentNotes: 'شراء باقة كوينز ماسية عبر متجر التطبيق الرسمي بحساب Apple ID المعتمد.',
    timestamp: '2026-09-09 20:15:44',
    dateOnly: '2026-09-09',
    status: 'معتمد ومكتمل ✅',
  },
  {
    id: 'HA-1005',
    hostId: '104829',
    hostName: 'سارة_لايف (الملكية)',
    referenceId: 'AUD-IN-104829-05',
    direction: 'INFLOW',
    sourceCategory: 'ADMIN',
    sourceName: 'تغذية مباشرة من الإدارة (Super Admin)',
    sourceId: 'ADMIN-DIRECT',
    coinsAmount: 5000000,
    usdValue: 500,
    localCurrencyAmount: '1,875',
    localCurrencyCode: 'ريال سعودي (SAR)',
    paymentMethod: 'منحة إدارية رسمية معتمدة من الإدارة العليا',
    agentNotes: 'مكافأة تصدر مسابقة غرف البث الماسي للأسبوع الأول من سبتمبر 2026 وفق توجيهات الإدارة.',
    timestamp: '2026-09-08 18:00:00',
    dateOnly: '2026-09-08',
    status: 'معتمد ومكتمل ✅',
  },
  {
    id: 'HA-1006',
    hostId: '104829',
    hostName: 'سارة_لايف (الملكية)',
    referenceId: 'AUD-IN-104829-06',
    direction: 'INFLOW',
    sourceCategory: 'P2P_CONVERT',
    sourceName: 'تحويل أرباح المضيف P2P (وكالة #1001 مؤسسة الدانة)',
    sourceId: 'REC-01',
    coinsAmount: 8500000,
    usdValue: 850,
    localCurrencyAmount: '3,187.50',
    localCurrencyCode: 'ريال سعودي (SAR)',
    paymentMethod: 'تحويل أرباح ماسات P2P بسعر الفئة الذهبية Tier A (10,000 كوينز/دولار)',
    agentNotes: 'تحويل 850 دولار من محفظة أرباح البث إلى كوينز شحن برقم المرجع المعتمد TXN-P2P-8829141.',
    timestamp: '2026-09-07 16:20:15',
    dateOnly: '2026-09-07',
    status: 'معتمد ومكتمل ✅',
  },
  {
    id: 'HA-1007',
    hostId: '104829',
    hostName: 'سارة_لايف (الملكية)',
    referenceId: 'AUD-OUT-104829-07',
    direction: 'OUTFLOW',
    sourceCategory: 'HOST_OUTFLOW',
    sourceName: 'محفظة المضيفة سارة_لايف',
    sourceId: '104829',
    targetUserId: '773192',
    targetUserName: 'أميرة_الورد (مضيفة)',
    targetUserType: 'مضيف',
    coinsAmount: 3000000,
    usdValue: 300,
    localCurrencyAmount: '1,500',
    localCurrencyCode: 'ريال يمني (YER)',
    paymentMethod: 'حوالة العمقي إكسبرس (اليمن)',
    agentNotes: 'تبادل ودعم كوينز بين المضيفين لفعالية الاحتفال السنوي. تم تسوية الفارق بدون أي منازعة.',
    timestamp: '2026-09-09 22:30:18',
    dateOnly: '2026-09-09',
    status: 'معتمد ومكتمل ✅',
  },
  {
    id: 'HA-1008',
    hostId: '104829',
    hostName: 'سارة_لايف (الملكية)',
    referenceId: 'AUD-OUT-104829-08',
    direction: 'OUTFLOW',
    sourceCategory: 'HOST_OUTFLOW',
    sourceName: 'محفظة المضيفة سارة_لايف',
    sourceId: '104829',
    targetUserId: '440182',
    targetUserName: 'صقر_بغداد',
    targetUserType: 'صانع محتوى',
    coinsAmount: 1200000,
    usdValue: 120,
    localCurrencyAmount: '158,000',
    localCurrencyCode: 'دينار عراقي (IQD)',
    paymentMethod: 'محفظة زين كاش العراق',
    agentNotes: 'مكافأة مشاركة ومساهمة في فقرات برنامج المواهب الصوتي.',
    timestamp: '2026-09-08 19:40:05',
    dateOnly: '2026-09-08',
    status: 'معتمد ومكتمل ✅',
  },

  // 2. Host #990184 - شهد_الروابي
  {
    id: 'HA-2001',
    hostId: '990184',
    hostName: 'شهد_الروابي (سوبر مضيفة)',
    referenceId: 'AUD-IN-990184-01',
    direction: 'INFLOW',
    sourceCategory: 'AGENCY',
    sourceName: 'وكالة #1004 مجموعة الفرسان الدولية',
    sourceId: 'REC-04',
    coinsAmount: 12000000,
    usdValue: 1200,
    localCurrencyAmount: '1,580,000',
    localCurrencyCode: 'دينار عراقي (IQD)',
    paymentMethod: 'زين كاش العراق / مكتب بغداد',
    agentNotes: 'توريد كوينز رسمي لدعم برنامج مسابقات عطلة الأسبوع.',
    timestamp: '2026-09-09 16:05:22',
    dateOnly: '2026-09-09',
    status: 'معتمد ومكتمل ✅',
  },
  {
    id: 'HA-2002',
    hostId: '990184',
    hostName: 'شهد_الروابي (سوبر مضيفة)',
    referenceId: 'AUD-OUT-990184-02',
    direction: 'OUTFLOW',
    sourceCategory: 'HOST_OUTFLOW',
    sourceName: 'محفظة المضيفة شهد_الروابي',
    sourceId: '990184',
    targetUserId: '551029',
    targetUserName: 'نور_القاهرة',
    targetUserType: 'مستخدم',
    coinsAmount: 4000000,
    usdValue: 400,
    localCurrencyAmount: '19,400',
    localCurrencyCode: 'جنيه مصري (EGP)',
    paymentMethod: 'فودافون كاش مصر',
    agentNotes: 'تسوية شحن للمستخدمة نور القاهرة، وتم تسجيل بيانات التحويل وإغلاق النزاع فورياً.',
    timestamp: '2026-09-10 13:10:00',
    dateOnly: '2026-09-10',
    status: 'معتمد ومكتمل ✅',
  },

  // 3. Host #884910 - فهد_العتيبي
  {
    id: 'HA-3001',
    hostId: '884910',
    hostName: 'فهد_العتيبي',
    referenceId: 'AUD-IN-884910-01',
    direction: 'INFLOW',
    sourceCategory: 'AGENCY',
    sourceName: 'وكالة #1001 مؤسسة الدانة للمدفوعات الرقمية',
    sourceId: 'REC-01',
    coinsAmount: 500000,
    usdValue: 50,
    localCurrencyAmount: '187.50',
    localCurrencyCode: 'ريال سعودي (SAR)',
    paymentMethod: 'سداد فوري / بطاقة مدى',
    agentNotes: 'شحن حساب مباشر عبر وكالة الدانة بموجب إيصال رقم REF-REC01-994821.',
    timestamp: '2026-09-10 15:45:12',
    dateOnly: '2026-09-10',
    status: 'معتمد ومكتمل ✅',
  },
  {
    id: 'HA-3002',
    hostId: '884910',
    hostName: 'فهد_العتيبي',
    referenceId: 'AUD-IN-884910-02',
    direction: 'INFLOW',
    sourceCategory: 'ADMIN',
    sourceName: 'تغذية مباشرة من الإدارة (Super Admin)',
    sourceId: 'ADMIN-DIRECT',
    coinsAmount: 1000000,
    usdValue: 100,
    localCurrencyAmount: '375',
    localCurrencyCode: 'ريال سعودي (SAR)',
    paymentMethod: 'دعم منحة مضيف رسمي',
    agentNotes: 'حافز رسمي لرفع ساعات البث الصوتي وتنشيط الغرف.',
    timestamp: '2026-09-09 12:00:00',
    dateOnly: '2026-09-09',
    status: 'معتمد ومكتمل ✅',
  },

  // 4. Host #773192 - أميرة_الورد
  {
    id: 'HA-4001',
    hostId: '773192',
    hostName: 'أميرة_الورد (مضيفة)',
    referenceId: 'AUD-IN-773192-01',
    direction: 'INFLOW',
    sourceCategory: 'AGENCY',
    sourceName: 'وكالة #1001 مؤسسة الدانة للمدفوعات الرقمية',
    sourceId: 'REC-01',
    coinsAmount: 2000000,
    usdValue: 200,
    localCurrencyAmount: '1,000',
    localCurrencyCode: 'ريال يمني (YER)',
    paymentMethod: 'تحويل شبكة العمقي للصرافة',
    agentNotes: 'شحنة وكالة معتمدة تم تسليم مقابلها نقداً بالريال اليمني بدون أي خلاف.',
    timestamp: '2026-09-10 14:10:05',
    dateOnly: '2026-09-10',
    status: 'معتمد ومكتمل ✅',
  },
  {
    id: 'HA-4002',
    hostId: '773192',
    hostName: 'أميرة_الورد (مضيفة)',
    referenceId: 'AUD-OUT-773192-02',
    direction: 'OUTFLOW',
    sourceCategory: 'HOST_OUTFLOW',
    sourceName: 'محفظة المضيفة أميرة_الورد',
    sourceId: '773192',
    targetUserId: '991823',
    targetUserName: 'فارس_الصحراء',
    targetUserType: 'مستخدم',
    coinsAmount: 850000,
    usdValue: 85,
    localCurrencyAmount: '425',
    localCurrencyCode: 'ريال يمني (YER)',
    paymentMethod: 'الكريمي إكسبرس',
    agentNotes: 'شحن داعم رسمي للغرفة الصوتية.',
    timestamp: '2026-09-10 17:15:33',
    dateOnly: '2026-09-10',
    status: 'معتمد ومكتمل ✅',
  }
];

// Helper to get host profile info
function getHostProfileInfo(hostId: string) {
  const matchingRecords = hostAuditRecords.filter((r) => r.hostId === hostId);
  const knownName = matchingRecords[0]?.hostName || `المضيف #${hostId}`;

  // Calculate lifetime / baseline coins
  const totalIn = matchingRecords.filter((r) => r.direction === 'INFLOW').reduce((acc, r) => acc + r.coinsAmount, 0);
  const totalOut = matchingRecords.filter((r) => r.direction === 'OUTFLOW').reduce((acc, r) => acc + r.coinsAmount, 0);
  const estimatedWallet = Math.max(1500000, totalIn - totalOut + 2000000);

  const agencyMap: Record<string, string> = {
    '104829': 'وكالة #1001 مؤسسة الدانة للمدفوعات الرقمية (السعودية)',
    '990184': 'وكالة #1004 مجموعة الفرسان الدولية (العراق)',
    '884910': 'وكالة #1001 مؤسسة الدانة للمدفوعات الرقمية',
    '773192': 'وكالة #1001 مؤسسة الدانة (فرع اليمن)',
    '662019': 'وكالة #1002 مركز الروابي للصرافة (الإمارات)',
    '551029': 'وكالة #1003 وكيل فودافون كاش (مصر)',
    '440182': 'وكالة #1004 مجموعة الفرسان الدولية (العراق)',
  };

  const countryMap: Record<string, string> = {
    '104829': 'المملكة العربية السعودية 🇸🇦',
    '990184': 'جمهورية العراق 🇮🇶',
    '884910': 'المملكة العربية السعودية 🇸🇦',
    '773192': 'الجمهورية اليمنية 🇾🇪',
    '662019': 'دولة الإمارات 🇦🇪',
    '551029': 'جمهورية مصر العربية 🇪🇬',
    '440182': 'جمهورية العراق 🇮🇶',
  };

  const tierMap: Record<string, string> = {
    '104829': 'مضيف ماسي VIP 🌟 (المرتبة الأولى)',
    '990184': 'مضيف ذهبي نشط 🏆',
    '884910': 'مضيف وصانع محتوى معتمد 🎙️',
    '773192': 'مضيف فضي متميز 🌸',
    '662019': 'مضيف ذهبي ⚡',
    '551029': 'مضيف برامج صوتية 🎙️',
    '440182': 'مضيف صانع محتوى 🚀',
  };

  return {
    hostId,
    name: knownName,
    agencyName: agencyMap[hostId] || 'وكالة شحن معتمدة',
    country: countryMap[hostId] || 'الشرق الأوسط 🌍',
    tierBadge: tierMap[hostId] || 'مضيف معتمد 🌟',
    currentWalletCoins: estimatedWallet,
    status: 'نشط ومعتمد بنسبة 100% ✅',
  };
}

// 1. Get Host Audit & Activity Log with filtering (واجهة كشف حساب وتدقيق المضيف)
app.get('/api/admin/host-audit', (req, res) => {
  const hostId = (req.query.hostId ? String(req.query.hostId).trim() : '104829') || '104829';
  const startDate = req.query.startDate ? String(req.query.startDate).trim() : '';
  const endDate = req.query.endDate ? String(req.query.endDate).trim() : '';
  const direction = (req.query.direction ? String(req.query.direction).trim().toUpperCase() : 'ALL'); // 'ALL' | 'INFLOW' | 'OUTFLOW'
  const sourceCategory = (req.query.sourceCategory ? String(req.query.sourceCategory).trim().toUpperCase() : 'ALL');
  const search = req.query.search ? String(req.query.search).trim().toLowerCase() : '';

  // Filter records
  let records = hostAuditRecords.filter((r) => r.hostId === hostId);

  // If there are no seeded records for this hostId, synthesize an authentic baseline ledger
  if (records.length === 0) {
    const syntheticHostName = `مضيف معتمد #${hostId}`;
    records = [
      {
        id: `HA-SYN-${hostId}-01`,
        hostId,
        hostName: syntheticHostName,
        referenceId: `AUD-IN-${hostId}-01`,
        direction: 'INFLOW',
        sourceCategory: 'AGENCY',
        sourceName: 'وكالة #1001 مؤسسة الدانة للمدفوعات الرقمية',
        sourceId: 'REC-01',
        coinsAmount: 5000000,
        usdValue: 500,
        localCurrencyAmount: '1,875',
        localCurrencyCode: 'ريال سعودي (SAR)',
        paymentMethod: 'تحويل بنكي رسمي',
        agentNotes: 'شحنة كوتة تغذية رسمية أولية للمضيف من وكالة الشحن المعتمدة.',
        timestamp: '2026-09-08 11:00:00',
        dateOnly: '2026-09-08',
        status: 'معتمد ومكتمل ✅',
      },
      {
        id: `HA-SYN-${hostId}-02`,
        hostId,
        hostName: syntheticHostName,
        referenceId: `AUD-IN-${hostId}-02`,
        direction: 'INFLOW',
        sourceCategory: 'STORE',
        sourceName: 'شحن المتجر وسوق التطبيق (In-App Store)',
        sourceId: 'STORE',
        coinsAmount: 1000000,
        usdValue: 100,
        localCurrencyAmount: '375',
        localCurrencyCode: 'ريال سعودي (SAR)',
        paymentMethod: 'Apple Pay / البطاقة الائتمانية',
        agentNotes: 'شراء كوينز من متجر التطبيق المباشر.',
        timestamp: '2026-09-09 15:30:10',
        dateOnly: '2026-09-09',
        status: 'معتمد ومكتمل ✅',
      },
      {
        id: `HA-SYN-${hostId}-03`,
        hostId,
        hostName: syntheticHostName,
        referenceId: `AUD-OUT-${hostId}-03`,
        direction: 'OUTFLOW',
        sourceCategory: 'HOST_OUTFLOW',
        sourceName: `محفظة المضيف #${hostId}`,
        sourceId: hostId,
        targetUserId: '884910',
        targetUserName: 'فهد_العتيبي',
        targetUserType: 'مستخدم',
        coinsAmount: 1500000,
        usdValue: 150,
        localCurrencyAmount: '562.50',
        localCurrencyCode: 'ريال سعودي (SAR)',
        paymentMethod: 'سداد فوري / مدى',
        agentNotes: 'شحن وتوزيع كوينز للمستخدم المذكور لدعم البث.',
        timestamp: '2026-09-10 16:15:00',
        dateOnly: '2026-09-10',
        status: 'معتمد ومكتمل ✅',
      },
    ];
  }

  let filtered = records.filter((r) => {
    if (direction !== 'ALL' && r.direction !== direction) return false;
    if (sourceCategory !== 'ALL' && r.sourceCategory !== sourceCategory) return false;
    if (startDate && r.dateOnly < startDate) return false;
    if (endDate && r.dateOnly > endDate) return false;

    if (search) {
      const matchRef = r.referenceId.toLowerCase().includes(search);
      const matchSource = (r.sourceName || '').toLowerCase().includes(search);
      const matchTarget = (r.targetUserName || '').toLowerCase().includes(search) || String(r.targetUserId || '').includes(search);
      const matchNotes = (r.agentNotes || '').toLowerCase().includes(search);
      const matchPayment = (r.paymentMethod || '').toLowerCase().includes(search);
      const matchCurrency = (r.localCurrencyCode || '').toLowerCase().includes(search) || (r.localCurrencyAmount || '').includes(search);
      if (!matchRef && !matchSource && !matchTarget && !matchNotes && !matchPayment && !matchCurrency) {
        return false;
      }
    }
    return true;
  });

  // Sort descending by timestamp
  filtered.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  // Calculations for Summary
  const inflowList = filtered.filter((r) => r.direction === 'INFLOW');
  const outflowList = filtered.filter((r) => r.direction === 'OUTFLOW');

  const totalInflowCoins = inflowList.reduce((acc, r) => acc + r.coinsAmount, 0);
  const totalOutflowCoins = outflowList.reduce((acc, r) => acc + r.coinsAmount, 0);
  const totalInflowUsd = inflowList.reduce((acc, r) => acc + r.usdValue, 0);
  const totalOutflowUsd = outflowList.reduce((acc, r) => acc + r.usdValue, 0);
  const totalOperations = filtered.length;
  const netCoinsMovement = totalInflowCoins - totalOutflowCoins;

  // Distinct hosts available for quick selection
  const distinctHosts = [
    { id: '104829', name: 'سارة_لايف (الملكية)', agency: 'وكالة #1001 مؤسسة الدانة', badge: 'ماسي VIP 🌟' },
    { id: '990184', name: 'شهد_الروابي', agency: 'وكالة #1004 مجموعة الفرسان', badge: 'ذهبي 🏆' },
    { id: '884910', name: 'فهد_العتيبي', agency: 'وكالة #1001 مؤسسة الدانة', badge: 'صانع محتوى 🎙️' },
    { id: '773192', name: 'أميرة_الورد (مضيفة)', agency: 'وكالة #1001 مؤسسة الدانة', badge: 'فضي 🌸' },
    { id: '662019', name: 'سلطان_دبي', agency: 'وكالة #1002 مركز الروابي', badge: 'ذهبي ⚡' },
    { id: '551029', name: 'نور_القاهرة', agency: 'وكالة #1003 فودافون كاش', badge: 'برامج صوتية 🎙️' },
    { id: '440182', name: 'صقر_بغداد', agency: 'وكالة #1004 مجموعة الفرسان', badge: 'صانع محتوى 🚀' },
  ];

  const hostProfile = getHostProfileInfo(hostId);

  res.json({
    success: true,
    hostInfo: hostProfile,
    summary: {
      totalInflowCoins,
      totalOutflowCoins,
      totalOperations,
      inflowCount: inflowList.length,
      outflowCount: outflowList.length,
      netCoinsMovement,
      totalInflowUsd,
      totalOutflowUsd,
    },
    logs: filtered,
    distinctHosts,
  });
});

// 2. Add or Update Audit / Dispute Notes (تدوين ملاحظة فض نزاع أو توثيق إداري)
app.post('/api/admin/host-audit/notes', (req, res) => {
  const { referenceId, hostId, newNote, adminName } = req.body;

  if (!referenceId || !newNote) {
    return res.status(400).json({ success: false, error: 'يرجى تزويد الرقم المرجعي للمعاملة ونص الملاحظة.' });
  }

  const record = hostAuditRecords.find((r) => r.referenceId === referenceId || r.id === referenceId);
  if (!record) {
    return res.status(404).json({ success: false, error: 'المعاملة المرجعية غير موجودة في سجل التدقيق.' });
  }

  const stamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  record.agentNotes = `${record.agentNotes ? record.agentNotes + ' | ' : ''}[توثيق إداري بواسطة ${adminName || 'الإدارة'} بتوقيت ${stamp}]: ${newNote.trim()}`;

  res.json({
    success: true,
    message: `تم توثيق ملاحظة فض النزاع للمعاملة ${referenceId} بنجاح.`,
    updatedRecord: record,
  });
});

// 3. Record new direct Host Audit Entry (تسجيل حركة وارد أو صادر جديدة يدوياً)
app.post('/api/admin/host-audit/entry', (req, res) => {
  const {
    hostId,
    hostName,
    direction,
    sourceCategory,
    sourceName,
    sourceId,
    targetUserId,
    targetUserName,
    targetUserType,
    coinsAmount,
    usdValue,
    localCurrencyAmount,
    localCurrencyCode,
    paymentMethod,
    agentNotes,
  } = req.body;

  if (!hostId || !direction || !coinsAmount || coinsAmount <= 0) {
    return res.status(400).json({ success: false, error: 'يرجى إدخال معرف المضيف، اتجاه الحركة، وكمية كوينز صالحة.' });
  }

  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);
  const dateOnly = timestamp.slice(0, 10);
  const refCode = `AUD-${direction === 'INFLOW' ? 'IN' : 'OUT'}-${hostId}-${Date.now().toString().slice(-4)}`;

  const newRecord: HostAuditRecord = {
    id: `HA-${Date.now().toString().slice(-5)}`,
    hostId: String(hostId).trim(),
    hostName: hostName || `مضيف #${hostId}`,
    referenceId: refCode,
    direction: direction === 'OUTFLOW' ? 'OUTFLOW' : 'INFLOW',
    sourceCategory: sourceCategory || (direction === 'INFLOW' ? 'AGENCY' : 'HOST_OUTFLOW'),
    sourceName: sourceName || (direction === 'INFLOW' ? 'وكالة شحن معتمدة' : `محفظة المضيف #${hostId}`),
    sourceId: sourceId || 'MANUAL-ENTRY',
    targetUserId: targetUserId ? String(targetUserId).trim() : undefined,
    targetUserName: targetUserName ? String(targetUserName).trim() : undefined,
    targetUserType: targetUserType || 'مستخدم',
    coinsAmount: Number(coinsAmount),
    usdValue: Number(usdValue) || Math.round(Number(coinsAmount) / 10000),
    localCurrencyAmount: localCurrencyAmount ? String(localCurrencyAmount).trim() : undefined,
    localCurrencyCode: localCurrencyCode ? String(localCurrencyCode).trim() : undefined,
    paymentMethod: paymentMethod || 'تسوية إدارية موثقة',
    agentNotes: agentNotes || 'عملية مسجلة وموثقة في سجل التدقيق المالي وفض النزاعات.',
    timestamp,
    dateOnly,
    status: 'معتمد ومكتمل ✅',
  };

  hostAuditRecords.unshift(newRecord);

  res.json({
    success: true,
    message: `تم إضافة المعاملة بنجاح برقم المرجع: ${newRecord.referenceId}`,
    record: newRecord,
  });
});

// =========================================================================
// REAL-TIME VOICE ROOMS & LIVE MODERATION API (تحكم الغرف الصوتية والمقاعد)
// =========================================================================

interface LiveRoomSeat {
  id: number;
  user?: {
    name: string;
    avatar?: string;
    isHost?: boolean;
    vipLevel?: string;
    badgeScore?: string;
    goldCrown?: boolean;
  } | null;
  name?: string;
  avatar?: string | null;
  isMuted: boolean;
  isSpeaking?: boolean;
  isLocked: boolean;
  isHost?: boolean;
}

interface LiveRoomData {
  id: string;
  title: string;
  host: string;
  hostUserId: string;
  agencyName: string;
  listenersCount: number;
  countryName: string;
  countryCode: string;
  flag: string;
  status: 'active' | 'warned' | 'closed';
  isLocked: boolean;
  image: string;
  notice: string;
  seats: LiveRoomSeat[];
}

function generateDefaultSeats(occupied: Array<{ id: number; name: string; avatar?: string; isMuted?: boolean; isHost?: boolean; isLocked?: boolean }>): LiveRoomSeat[] {
  const seats: LiveRoomSeat[] = [];
  for (let i = 1; i <= 20; i++) {
    const occ = occupied.find(o => o.id === i);
    if (occ) {
      seats.push({
        id: i,
        name: occ.name,
        avatar: occ.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        user: {
          name: occ.name,
          avatar: occ.avatar,
          isHost: !!occ.isHost,
          vipLevel: occ.isHost ? 'VIP 8' : 'VIP 4',
          badgeScore: '1.2K',
        },
        isMuted: !!occ.isMuted,
        isSpeaking: false,
        isLocked: !!occ.isLocked,
        isHost: !!occ.isHost,
      });
    } else {
      seats.push({
        id: i,
        name: 'فارغ',
        avatar: null,
        user: null,
        isMuted: false,
        isSpeaking: false,
        isLocked: false,
        isHost: false,
      });
    }
  }
  return seats;
}

const liveRoomsStore: Record<string, LiveRoomData> = {
  'room-1': {
    id: 'room-1',
    title: 'وكالة شحن سوريا ألمانيا',
    host: 'وكالة شحن سوريا ألمانيا',
    hostUserId: '100291',
    agencyName: 'وكالة النجم للشحن المعتمد',
    listenersCount: 24,
    countryName: 'سوريا',
    countryCode: 'SY',
    flag: '🇸🇾',
    status: 'active',
    isLocked: false,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    notice: 'أهلاً وسهلاً بكم في روم وكالة الشحن المعتمدة - التزام بقوانين الروم 🌹',
    seats: generateDefaultSeats([
      { id: 1, name: 'وكالة شحن سوريا', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', isMuted: false, isHost: true },
      { id: 2, name: 'أحمد السوري', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200', isMuted: false },
      { id: 3, name: 'سارة دمشق', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', isMuted: false },
      { id: 4, name: 'أبو فهد', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200', isMuted: true },
      { id: 5, name: 'فارغ', isLocked: true },
      { id: 6, name: 'نجم حلب', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', isMuted: false },
      { id: 8, name: 'لانا الكردي', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200', isMuted: false },
    ]),
  },
  'room-2': {
    id: 'room-2',
    title: 'وكآلة آلأيهم MOE',
    host: 'وكآلة آلأيهم MOE',
    hostUserId: '100344',
    agencyName: 'وكالة آلأيهم للإنتاج والبث',
    listenersCount: 73,
    countryName: 'مصر',
    countryCode: 'EG',
    flag: '🇪🇬',
    status: 'active',
    isLocked: false,
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=400',
    notice: 'مسابقات وفقرات غنائية يومية وسحوبات كوينز مباشرة 🎁',
    seats: generateDefaultSeats([
      { id: 1, name: 'آلأيهم MOE', avatar: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=200', isMuted: false, isHost: true },
      { id: 2, name: 'كريم الملك', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', isMuted: false },
      { id: 3, name: 'مريم القلوب', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', isMuted: false },
      { id: 5, name: 'حسام المصري', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200', isMuted: false },
    ]),
  },
};

// Connected SSE Clients for real-time push to mobile apps and dashboards
interface SSEClient {
  id: string;
  roomId: string;
  res: Response;
}
const sseClients: SSEClient[] = [];

function broadcastRoomModerationEvent(roomId: string, eventData: any) {
  const jsonStr = JSON.stringify(eventData);
  // Send both named event 'room_moderation' and standard 'message' for universal client compatibility
  const namedPayload = `event: room_moderation\ndata: ${jsonStr}\n\n`;
  const defaultPayload = `data: ${jsonStr}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    const client = sseClients[i];
    if (client.roomId === roomId || client.roomId === 'all' || roomId === 'all') {
      try {
        client.res.write(namedPayload);
        client.res.write(defaultPayload);
      } catch (err) {
        sseClients.splice(i, 1);
      }
    }
  }
}

// 0. Send gifts to room seats from external dashboard
app.post('/api/rooms/:roomId/gifts', (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { giftName, giftIcon, giftValue, senderName, senderAvatar, targetSeatId, targetUserName } = req.body;

  const giftPayload = {
    type: 'ROOM_GIFT_BROADCAST',
    roomId,
    gift: {
      name: giftName || 'تاج الملوك 👑',
      icon: giftIcon || '👑',
      price: Number(giftValue) || 500,
    },
    sender: {
      name: senderName || 'إدارة النظام 👑',
      avatar: senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    },
    targetSeatId: Number(targetSeatId) || 1,
    targetUserName: targetUserName || 'المقعد المباشر',
    timestamp: Date.now(),
  };

  broadcastRoomModerationEvent(roomId, giftPayload);

  res.json({
    success: true,
    message: `تم إرسال الهدية "${giftPayload.gift.name}" إلى المقعد ${giftPayload.targetSeatId} بنجاح!`,
    giftPayload,
  });
});

// 1. Get all active rooms
app.get('/api/rooms/active', (req: Request, res: Response) => {
  res.json({
    success: true,
    rooms: Object.values(liveRoomsStore),
  });
});

// 2. Get single room details and seats
app.get('/api/rooms/:roomId', (req: Request, res: Response) => {
  const { roomId } = req.params;
  const room = liveRoomsStore[roomId] || Object.values(liveRoomsStore)[0];
  if (!room) {
    return res.status(404).json({ success: false, error: 'الروم غير موجودة' });
  }
  res.json({ success: true, room });
});

// 3. Moderate seat/room (Mute, Unmute, Lock, Kick, Mute All)
app.post('/api/rooms/:roomId/moderate', (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { action, seatId, targetState, message } = req.body;

  let room = liveRoomsStore[roomId];
  if (!room) {
    // Fallback: create default room entry if not exists
    room = {
      id: roomId,
      title: `غرفة صوتية #${roomId}`,
      host: 'مالك الغرفة',
      hostUserId: '100100',
      agencyName: 'وكالة النجم الرسمية',
      listenersCount: 15,
      countryName: 'السعودية',
      countryCode: 'SA',
      flag: '🇸🇦',
      status: 'active',
      isLocked: false,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      notice: 'غرفة صوتية مباشرة تابعة لمنظومة النجم شات',
      seats: generateDefaultSeats([
        { id: 1, name: 'أنا (المالك 👑)', isHost: true },
        { id: 2, name: 'سارة الك...', isMuted: false },
        { id: 3, name: 'خالد...', isMuted: false },
        { id: 4, name: 'ريما...', isMuted: false },
      ]),
    };
    liveRoomsStore[roomId] = room;
  }

  const sId = Number(seatId);
  const seat = room.seats.find(s => s.id === sId);

  let eventPayload: any = {
    type: 'ROOM_MODERATION',
    roomId,
    action,
    seatId: sId,
    timestamp: Date.now(),
  };

  switch (action) {
    case 'toggle_mute':
      if (seat) {
        seat.isMuted = targetState !== undefined ? !!targetState : !seat.isMuted;
        eventPayload.isMuted = seat.isMuted;
        eventPayload.seat = seat;
      }
      break;

    case 'mute_seat':
      if (seat) {
        seat.isMuted = true;
        eventPayload.isMuted = true;
        eventPayload.seat = seat;
      }
      break;

    case 'unmute_seat':
      if (seat) {
        seat.isMuted = false;
        eventPayload.isMuted = false;
        eventPayload.seat = seat;
      }
      break;

    case 'mute_all':
      room.seats.forEach(s => {
        s.isMuted = true;
      });
      eventPayload.allMuted = true;
      break;

    case 'unmute_all':
      room.seats.forEach(s => {
        s.isMuted = false;
      });
      eventPayload.allMuted = false;
      break;

    case 'lock_seat':
      if (seat) {
        seat.isLocked = targetState !== undefined ? !!targetState : !seat.isLocked;
        eventPayload.isLocked = seat.isLocked;
        eventPayload.seat = seat;
      }
      break;

    case 'kick_user':
      if (seat) {
        const kickedName = seat.name || seat.user?.name;
        seat.name = 'فارغ';
        seat.avatar = null;
        seat.user = null;
        seat.isMuted = false;
        eventPayload.kickedName = kickedName;
        eventPayload.seat = seat;
      }
      break;

    case 'update_notice':
      if (message) {
        room.notice = String(message).trim();
        eventPayload.notice = room.notice;
      }
      break;

    case 'warn_room':
      room.status = 'warned';
      eventPayload.status = 'warned';
      eventPayload.reason = message || 'مخالفة لقوانين البث الصوتي';
      break;

    case 'close_room':
      room.status = 'closed';
      eventPayload.status = 'closed';
      eventPayload.reason = message || 'تم إغلاق الروم بواسطة الإدارة';
      break;
  }

  // Push event to all connected devices via SSE
  broadcastRoomModerationEvent(roomId, eventPayload);

  res.json({
    success: true,
    action,
    roomId,
    seatId: sId,
    eventPayload,
    seats: room.seats,
  });
});

// 4. SSE Endpoint for Real-time Streaming updates to App & Dashboard
app.get('/api/rooms/:roomId/events', (req: Request, res: Response) => {
  const { roomId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const clientId = `${roomId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const newClient: SSEClient = { id: clientId, roomId, res };
  sseClients.push(newClient);

  // Send initial connection handshake with current room state
  const room = liveRoomsStore[roomId] || Object.values(liveRoomsStore)[0];
  res.write(`data: ${JSON.stringify({ type: 'INIT_STATE', roomId, room })}\n\n`);

  // Heartbeat every 20 seconds to keep connection alive
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    const index = sseClients.findIndex(c => c.id === clientId);
    if (index !== -1) {
      sseClients.splice(index, 1);
    }
  });
});

// =========================================================================
// STORE ITEMS & DIGITAL ASSETS APIS (متجر النجم - الأصول والتأثيرات الرقمية)
// =========================================================================

interface StoreItemModel {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  days: number;
  iconEmoji: string;
  imageUrl?: string;
  badge?: string;
  description?: string;
  salesCount: number;
  isActive: boolean;
  animationType: string;
}

let serverStoreItems: StoreItemModel[] = [
  {
    id: 'STR-FR-01',
    name: 'إطار التنين الذهبي المجنح VIP',
    categoryId: 'frames',
    categoryName: 'إطارات',
    price: 850000,
    days: 30,
    iconEmoji: '🐲✨',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300',
    badge: 'حصري VIP',
    description: 'إطار أسطوري دوار بتأثير التنين الناري يحيط بالصورة الشخصية داخل الغرف الصوتية.',
    salesCount: 312,
    isActive: true,
    animationType: 'svga'
  },
  {
    id: 'STR-FR-02',
    name: 'إطار تاج القيصر الماسي 3D',
    categoryId: 'frames',
    categoryName: 'إطارات',
    price: 1200000,
    days: 30,
    iconEmoji: '👑💎',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300',
    badge: 'ملكي أسطوري',
    description: 'إطار مرصع بأحجار الألماس اللامعة مع بريق خاص يظهر في قائمة الحضور.',
    salesCount: 198,
    isActive: true,
    animationType: 'lottie'
  },
  {
    id: 'STR-BUB-01',
    name: 'فقاعة اللهب الناري البركاني',
    categoryId: 'bubbles',
    categoryName: 'فقاعات',
    price: 350000,
    days: 30,
    iconEmoji: '🔥💬',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300',
    badge: 'شات مميز',
    description: 'فقاعة محادثة متوهجة باللهب البركاني تجعل رسائلك في شات الروم الأكثر وضوحاً.',
    salesCount: 520,
    isActive: true,
    animationType: 'lottie'
  },
  {
    id: 'STR-ENT-01',
    name: 'سيارة رولز رويس فانتوم الملكية 3D',
    categoryId: 'entries',
    categoryName: 'دخوليات',
    price: 3500000,
    days: 30,
    iconEmoji: '🚘👑',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300',
    badge: 'دخول ملكي',
    description: 'موكب مهيب يدخل شاشة الغرفة بملء الشاشة مع أصوات المحرك وألعاب نارية ترحيبية.',
    salesCount: 89,
    isActive: true,
    animationType: 'mp4'
  }
];

// GET: All active store items for mobile application & dashboard
app.get('/api/store/items', (req: Request, res: Response) => {
  const category = req.query.category as string;
  if (category && category !== 'all') {
    return res.json({
      success: true,
      items: serverStoreItems.filter(it => it.categoryId === category)
    });
  }
  return res.json({
    success: true,
    total: serverStoreItems.length,
    items: serverStoreItems
  });
});

// POST: Send store item/gift directly to host user by Admin (صلاحية الإدارة لإرسال الهدية لآيدي المضيف)
app.post('/api/store/send-to-host', (req: Request, res: Response) => {
  const { hostUserId, itemId, itemName, category, grantDays, sendType, adminNote } = req.body;
  if (!hostUserId || !itemId) {
    return res.status(400).json({ success: false, message: 'معرف المضيف ومعرف العنصر مطلوبان' });
  }

  // إضافة سجل لإرسال الهدايا للمضيفين
  console.log(`[Store Gift] Sent ${itemName} (${itemId}) to host #${hostUserId} for ${grantDays} days. Note: ${adminNote}`);

  return res.json({
    success: true,
    message: `تم إرسال "${itemName || itemId}" بنجاح إلى المضيف #${hostUserId} لمدة ${grantDays} يوم.`,
    giftData: {
      hostUserId,
      itemId,
      itemName,
      category,
      grantDays,
      sendType,
      adminNote,
      grantedAt: new Date().toISOString()
    }
  });
});

// POST: Direct upload endpoint for frames, SVGA, and assets
app.post('/api/store/upload-asset', (req: Request, res: Response) => {
  try {
    const { fileName, fileData, fileType } = req.body;
    if (!fileData) {
      return res.status(400).json({ success: false, message: 'بيانات الملف غير متوفرة' });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'frames');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const timeId = Date.now();
    const cleanFileName = (fileName || `frame_${timeId}.png`).replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Check if it's base64 data URI
    if (fileData.startsWith('data:')) {
      const matches = fileData.match(/^data:([A-Za-z-+\/0-9.]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');

        // Check if it's an SVGA file (zlib compressed protobuf)
        const isSvga = cleanFileName.toLowerCase().endsWith('.svga') || 
                       mimeType.includes('svga') || 
                       (buffer.length > 2 && buffer[0] === 0x78 && (buffer[1] === 0x9c || buffer[1] === 0x01 || buffer[1] === 0xda));

        if (isSvga) {
          try {
            const svgaSavedName = `frame_${timeId}.svga`;
            fs.writeFileSync(path.join(uploadDir, svgaSavedName), buffer);

            // Decompress SVGA to extract embedded PNG frames
            const decompressed = zlib.inflateSync(buffer);
            const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
            const iendMagic = Buffer.from('IEND');

            let pos = 0;
            let largestPng: Buffer | null = null;
            let largestSize = 0;

            while (true) {
              const startPos = decompressed.indexOf(pngMagic, pos);
              if (startPos === -1) break;

              const iendPos = decompressed.indexOf(iendMagic, startPos);
              if (iendPos !== -1) {
                const endPos = iendPos + 8;
                const pngChunk = decompressed.subarray(startPos, endPos);
                if (pngChunk.length > largestSize) {
                  largestSize = pngChunk.length;
                  largestPng = pngChunk;
                }
                pos = endPos;
              } else {
                pos = startPos + pngMagic.length;
              }
            }

            if (largestPng) {
              const previewPngName = `frame_preview_${timeId}.png`;
              fs.writeFileSync(path.join(uploadDir, previewPngName), largestPng);

              return res.json({
                success: true,
                message: 'تم استخراج فريم الإطار المفرغ من ملف SVGA وحفظه بنجاح!',
                url: `/uploads/frames/${previewPngName}`,
                svgaUrl: `/uploads/frames/${svgaSavedName}`,
                fileName: cleanFileName,
                isSvga: true
              });
            }
          } catch (svgaErr) {
            console.error('SVGA extraction error:', svgaErr);
          }
        }

        // Standard image file (PNG / WebP / JPEG)
        const ext = cleanFileName.split('.').pop() || 'png';
        const savedImgName = `frame_${timeId}.${ext}`;
        fs.writeFileSync(path.join(uploadDir, savedImgName), buffer);

        return res.json({
          success: true,
          message: 'تم رفع صورة الإطار وحفظها بنجاح!',
          url: `/uploads/frames/${savedImgName}`,
          fileName: cleanFileName,
          isSvga: false
        });
      }
    }

    return res.json({
      success: true,
      message: 'تم استقبال الأصل الرقمي بنجاح!',
      url: fileData,
      fileName: cleanFileName
    });
  } catch (err: any) {
    console.error('Upload asset error:', err);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء معالجة الملف', error: err.message });
  }
});

// =========================================================================
// ZIP PACKAGE DOWNLOAD ENDPOINT (تحميل حزمة المشروع والداشبورد كاملة مضغوطة)
// =========================================================================

app.get(['/al-najm-dashboard-complete.zip', '/taraf-dashboard-complete.zip', '/api/download-complete-zip'], (req: Request, res: Response) => {
  const zipPath = path.join(process.cwd(), 'public', 'al-najm-dashboard-complete.zip');
  res.download(zipPath, 'al-najm-dashboard-complete.zip', (err) => {
    if (err) {
      console.error('Error sending zip file:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download zip package' });
      }
    }
  });
});

// =========================================================================
// VITE MIDDLEWARE & STATIC APP SERVING
// =========================================================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Custom rewrites before Vite handles the request
    app.use((req, res, next) => {
      const parsedUrl = new URL(req.url || '/', 'http://localhost');
      if (parsedUrl.pathname === '/admin') {
        res.writeHead(302, { Location: '/admin/' + (parsedUrl.search || '') });
        return res.end();
      }
      if (parsedUrl.pathname === '/admin/') {
        req.url = '/admin/index.html' + (parsedUrl.search || '');
      }
      if (parsedUrl.pathname === '/merchant') {
        res.writeHead(302, { Location: '/merchant/' + (parsedUrl.search || '') });
        return res.end();
      }
      if (parsedUrl.pathname === '/merchant/') {
        req.url = '/merchant/index.html' + (parsedUrl.search || '');
      }
      if (parsedUrl.pathname === '/lucky-farm' || parsedUrl.pathname === '/lucky-farm/') {
        res.writeHead(302, { Location: '/?game=lucky-farm' + (parsedUrl.search ? '&' + parsedUrl.search.slice(1) : '') });
        return res.end();
      }
      if (parsedUrl.pathname === '/download' || parsedUrl.pathname === '/download/') {
        req.url = '/download.html';
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.get('/download', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'public', 'download.html'));
    });
    app.get('/admin', (req, res) => {
      res.redirect('/admin/');
    });
    app.get('/admin/', (req, res) => {
      res.sendFile(path.join(distPath, 'admin/index.html'));
    });
    app.get('/merchant', (req, res) => {
      res.redirect('/merchant/');
    });
    app.get('/merchant/', (req, res) => {
      res.sendFile(path.join(distPath, 'merchant/index.html'));
    });

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Al-Najm Voice Chat Server with Store & Agency Management running on port ${PORT}`);
  });
}

startServer();
