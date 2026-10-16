"use client";

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@database/connection/supabase-admin';
import { useToast } from '@/hooks/use-toast';
import { 
  Globe, 
  Smartphone, 
  Laptop, 
  MapPin, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Check, 
  Users, 
  Eye, 
  Activity, 
  Calendar, 
  CalendarDays, 
  Filter, 
  Bot, 
  Wifi, 
  BarChart3, 
  Download, 
  ChevronLeft,
  ChevronRight, 
  ChevronDown,
  TrendingUp, 
  X,
  Target,
  Share2,
  Sparkles,
  Link2
} from 'lucide-react';
import { formatDistanceToNow, format, isToday as checkIsToday, isYesterday as checkIsYesterday } from 'date-fns';
import { exportToExcel } from '@/lib/exportExcel';

interface AnalyticsRecord {
  id: string;
  created_at: string;
  path: string;
  type: string;
  user_agent: string;
  ip_hash: string;
  session_id: string;
  ip_address?: string;
  city?: string;
  region?: string;
  country?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  referrer?: string;
  details?: {
    ip?: string;
    isAd?: boolean;
    trafficSource?: string;
    campaign?: {
      isAd?: boolean;
      adPlatform?: string;
      channelType?: string;
      campaignName?: string;
      campaignId?: string;
      adId?: string;
      adClickId?: string;
      keyword?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
      rawParams?: Record<string, string>;
    };
    locality?: {
      city?: string;
      region?: string;
      country?: string;
      postal?: string;
      latitude?: number;
      longitude?: number;
      timezone?: string;
      isp?: string;
      source?: string;
    };
    user?: {
      deviceType?: string;
      deviceLabel?: string;
      os?: string;
      osVersion?: string;
      browser?: string;
      browserVersion?: string;
      isBot?: boolean;
      screen?: string;
      viewport?: string;
      pixelRatio?: number;
      language?: string;
      referrer?: string;
      trafficSource?: string;
      fullUrl?: string;
      utm?: Record<string, string>;
      campaignParams?: Record<string, string>;
      network?: string;
    };
    timestamp?: string;
  };
}

interface DailyStats {
  dateKey: string;
  formattedDate: string;
  dayLabel: string;
  isToday: boolean;
  isYesterday: boolean;
  totalHits: number;
  uniqueIps: number;
  adCount: number;
  organicCount: number;
  directCount: number;
  topCity: string;
  topCityCount: number;
  mobilePercent: number;
  topPage: string;
  topSource: string;
  topCampaign: string;
  records: AnalyticsRecord[];
}

export type SortOption = 'latest' | 'most_hits' | 'least_hits' | 'ip_asc' | 'oldest';

interface IpStats {
  ip: string;
  totalHits: number;
  adHits: number;
  organicHits: number;
  directHits: number;
  city: string;
  region: string;
  country: string;
  isp: string;
  mapLink: string | null;
  devices: string[];
  browsers: string[];
  topLandingPage: string;
  firstSeen: string;
  lastSeen: string;
  campaigns: string[];
  latestRecord: AnalyticsRecord;
  records: AnalyticsRecord[];
}

export default function AnalyticsPage() {
  const [records, setRecords] = useState<AnalyticsRecord[]>([]);
  const [totalDbCount, setTotalDbCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all'); // all, ad, organic, direct, social
  const [uniqueIpOnly, setUniqueIpOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dateRangeDays, setDateRangeDays] = useState<number>(14);
  const [activeTab, setActiveTab] = useState<'stream' | 'ip-ranking' | 'daily'>('stream');
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportStatusText, setExportStatusText] = useState<string>('Exporting...');
  const [ipSearchQuery, setIpSearchQuery] = useState('');
  const [ipTableSort, setIpTableSort] = useState<'hits_desc' | 'hits_asc' | 'ads_desc' | 'recent' | 'ip_asc'>('hits_desc');
  const [ipCurrentPage, setIpCurrentPage] = useState<number>(1);
  const [ipItemsPerPage, setIpItemsPerPage] = useState<number>(25);
  const { toast } = useToast();

  const isLocalRecord = (r: AnalyticsRecord) => {
    const ip = r.ip_address || r.details?.ip || '';
    const city = r.city || r.details?.locality?.city || '';
    return (
      ip === '::1' ||
      ip === '127.0.0.1' ||
      ip === 'localhost' ||
      ip.startsWith('::ffff:127.0.0.1') ||
      city === 'Local Development'
    );
  };

  const fetchRecords = async (showToast = false) => {
    try {
      // 1. Fast initial fetch: Get exact DB count and the first batch of 1000 records in 1 parallel roundtrip
      const [countRes, firstChunkRes] = await Promise.all([
        supabase.from('analytics').select('*', { count: 'exact', head: true }),
        supabase
          .from('analytics')
          .select('*')
          .order('created_at', { ascending: false })
          .range(0, 999)
      ]);

      if (firstChunkRes.error) throw firstChunkRes.error;

      const totalCount = countRes.count ?? (firstChunkRes.data?.length || 0);
      setTotalDbCount(totalCount);

      const firstChunk = (firstChunkRes.data || []).filter((r: AnalyticsRecord) => !isLocalRecord(r));
      setRecords(firstChunk);
      setLoading(false);

      if (showToast) {
        toast({ 
          title: 'Refreshed Analytics', 
          description: `Loaded ${firstChunk.length} recent visitor logs (${totalCount} total in database).` 
        });
      }

      // 2. If there are older records in DB beyond the first 1000, fetch only the needed chunks in the background
      if (totalCount > 1000) {
        const remainingChunks: [number, number][] = [];
        const maxPreload = Math.min(totalCount, 5000);
        for (let from = 1000; from < maxPreload; from += 1000) {
          remainingChunks.push([from, Math.min(from + 999, maxPreload - 1)]);
        }

        if (remainingChunks.length > 0) {
          Promise.all(
            remainingChunks.map(([from, to]) =>
              supabase
                .from('analytics')
                .select('*')
                .order('created_at', { ascending: false })
                .range(from, to)
            )
          ).then((chunkResults: any[]) => {
            const moreRecords: AnalyticsRecord[] = chunkResults.flatMap((r: any) => r.data || []);
            if (moreRecords.length > 0) {
              setRecords((prev) => {
                const existingIds = new Set(prev.map((r) => r.id));
                const newItems = moreRecords.filter((r) => !existingIds.has(r.id) && !isLocalRecord(r));
                return [...prev, ...newItems];
              });
            }
          }).catch((err) => {
            console.error('Background analytics chunk loading error:', err);
          });
        }
      }
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      if (showToast) {
        toast({ variant: 'destructive', title: 'Error', description: err.message || 'Failed to fetch visitor logs' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Auto refresh interval (15s)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchRecords(false);
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIp(text);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  // Helper to extract rich visitor and ad/campaign data
  const getRecordData = (record: AnalyticsRecord) => {
    const ip = record.ip_address || record.details?.ip || 'N/A';
    const locality = record.details?.locality || {};
    const city = record.city || locality.city || 'Unknown City';
    const region = record.region || locality.region || '';
    const country = record.country || locality.country || '';
    const isp = locality.isp || '';
    const coords = locality.latitude && locality.longitude ? `${locality.latitude}, ${locality.longitude}` : null;
    const mapLink = coords ? `https://www.google.com/maps?q=${locality.latitude},${locality.longitude}` : null;

    const user = record.details?.user || {};
    const deviceType = record.device_type || user.deviceType || (record.user_agent?.includes('Mobile') ? 'Mobile' : 'Desktop');
    const deviceLabel = user.deviceLabel || (deviceType === 'Mobile' ? '📱 Mobile' : '💻 Desktop');
    const browser = record.browser || user.browser || 'Browser';
    const os = record.os || user.os || 'OS';
    const screen = user.screen || '';
    const language = user.language || '';
    const isBot = user.isBot || false;

    // Ad & Campaign Intelligence
    const campaignObj = record.details?.campaign || {};
    const userUtm = user.utm || user.campaignParams || {};
    const path = record.path || '/';

    const hasGclid = path.includes('gclid=') || !!campaignObj.adClickId || !!userUtm.gclid;
    const hasFbclid = path.includes('fbclid=') || !!userUtm.fbclid;
    const hasCampaignParam = path.includes('utm_campaign=') || path.includes('campaign_id=') || !!campaignObj.campaignName || !!userUtm.utm_campaign;
    const isPaidMedium = /cpc|ppc|paid|ad|meta_ad|google_ad/i.test(userUtm.utm_medium || userUtm.medium || campaignObj.utmMedium || '');

    const isAd = campaignObj.isAd === true || 
                 record.details?.isAd === true || 
                 hasGclid || 
                 hasFbclid || 
                 isPaidMedium || 
                 (hasCampaignParam && !record.referrer);

    const adPlatform = campaignObj.adPlatform || 
                       (hasGclid ? 'Google Ads' : hasFbclid ? 'Meta / Instagram Ads' : isAd ? 'Paid Campaign' : null);

    const campaignName = campaignObj.campaignName || userUtm.utm_campaign || userUtm.campaign || null;
    const campaignId = campaignObj.campaignId || userUtm.campaign_id || userUtm.utm_id || null;
    const adClickId = campaignObj.adClickId || userUtm.gclid || userUtm.fbclid || (hasGclid ? 'gclid detected' : null);
    const keyword = campaignObj.keyword || userUtm.utm_term || null;

    // Traffic Source Classification
    const rawSource = record.details?.trafficSource || user.trafficSource || (record.referrer ? 'Referral' : 'Direct');
    let channelCategory: 'ad' | 'organic' | 'social' | 'direct' | 'referral' = 'direct';
    let channelLabel = '🔗 Direct Visit';

    if (isAd) {
      channelCategory = 'ad';
      channelLabel = `🎯 ${adPlatform || 'Paid Ad'}${campaignName ? `: ${campaignName}` : ''}`;
    } else if (rawSource.toLowerCase().includes('google') || rawSource.toLowerCase().includes('bing') || rawSource.toLowerCase().includes('yahoo')) {
      channelCategory = 'organic';
      channelLabel = '🔍 Google Search (Organic)';
    } else if (rawSource.toLowerCase().includes('instagram') || rawSource.toLowerCase().includes('facebook') || rawSource.toLowerCase().includes('youtube') || rawSource.toLowerCase().includes('whatsapp') || rawSource.toLowerCase().includes('twitter') || rawSource.toLowerCase().includes('x.com')) {
      channelCategory = 'social';
      channelLabel = rawSource;
    } else if (rawSource.toLowerCase().includes('referral') || record.referrer) {
      channelCategory = 'referral';
      channelLabel = rawSource;
    }

    const createdAtDate = new Date(record.created_at);
    const dateKey = !isNaN(createdAtDate.getTime()) ? format(createdAtDate, 'yyyy-MM-dd') : '';

    return {
      ip,
      city,
      region,
      country,
      isp,
      coords,
      mapLink,
      deviceType,
      deviceLabel,
      browser,
      os,
      screen,
      language,
      trafficSource: channelLabel,
      channelCategory,
      isAd,
      adPlatform,
      campaignName,
      campaignId,
      adClickId,
      keyword,
      isBot,
      dateKey,
      createdAtDate
    };
  };

  // 1. Group records day-wise with Ad vs Organic breakdown
  const dailyStatsList: DailyStats[] = useMemo(() => {
    const groups: Record<string, AnalyticsRecord[]> = {};

    records.forEach((r) => {
      if (isLocalRecord(r)) return;
      const { dateKey } = getRecordData(r);
      if (!dateKey) return;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(r);
    });

    const sortedDateKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    return sortedDateKeys.map((dateKey) => {
      const dayRecords = groups[dateKey];
      const sampleDate = new Date(dateKey + 'T00:00:00');
      const isToday = checkIsToday(sampleDate);
      const isYesterday = checkIsYesterday(sampleDate);

      let dayLabel = format(sampleDate, 'EEE, MMM d');
      if (isToday) dayLabel = 'Today (' + format(sampleDate, 'MMM d') + ')';
      else if (isYesterday) dayLabel = 'Yesterday (' + format(sampleDate, 'MMM d') + ')';

      const totalHits = dayRecords.length;
      const uniqueIps = new Set(dayRecords.map((r) => r.ip_address || r.details?.ip || r.ip_hash)).size;

      let adCount = 0;
      let organicCount = 0;
      let directCount = 0;
      const cityCounts: Record<string, number> = {};
      let mobileCount = 0;
      const pageCounts: Record<string, number> = {};
      const sourceCounts: Record<string, number> = {};
      const campaignCounts: Record<string, number> = {};

      dayRecords.forEach((r) => {
        const d = getRecordData(r);
        if (d.isAd) {
          adCount++;
          if (d.campaignName) {
            campaignCounts[d.campaignName] = (campaignCounts[d.campaignName] || 0) + 1;
          }
        } else if (d.channelCategory === 'organic') {
          organicCount++;
        } else {
          directCount++;
        }

        if (d.city && d.city !== 'Unknown City' && d.city !== 'Local Development') {
          cityCounts[d.city] = (cityCounts[d.city] || 0) + 1;
        }
        if (d.deviceType.toLowerCase() === 'mobile') mobileCount++;
        const path = r.path || '/';
        pageCounts[path] = (pageCounts[path] || 0) + 1;
        sourceCounts[d.trafficSource] = (sourceCounts[d.trafficSource] || 0) + 1;
      });

      const sortedCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);
      const topCity = sortedCities[0] ? sortedCities[0][0] : '—';
      const topCityCount = sortedCities[0] ? sortedCities[0][1] : 0;

      const sortedPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]);
      const topPage = sortedPages[0] ? sortedPages[0][0] : '/';

      const sortedSources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]);
      const topSource = sortedSources[0] ? sortedSources[0][0] : 'Direct';

      const sortedCampaigns = Object.entries(campaignCounts).sort((a, b) => b[1] - a[1]);
      const topCampaign = sortedCampaigns[0] ? sortedCampaigns[0][0] : '—';

      const mobilePercent = totalHits > 0 ? Math.round((mobileCount / totalHits) * 100) : 0;

      return {
        dateKey,
        formattedDate: format(sampleDate, 'MMMM d, yyyy'),
        dayLabel,
        isToday,
        isYesterday,
        totalHits,
        uniqueIps,
        adCount,
        organicCount,
        directCount,
        topCity,
        topCityCount,
        mobilePercent,
        topPage,
        topSource,
        topCampaign,
        records: dayRecords
      };
    });
  }, [records]);

  // Chart data
  const chartDays = useMemo(() => {
    return dailyStatsList.slice(0, dateRangeDays).reverse();
  }, [dailyStatsList, dateRangeDays]);

  const maxHitsInChart = useMemo(() => {
    return Math.max(...chartDays.map((d) => d.totalHits), 1);
  }, [chartDays]);

  // All-time visit count per IP across all loaded records
  const ipHitCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach((r) => {
      if (isLocalRecord(r)) return;
      const data = getRecordData(r);
      const ip = data.ip;
      if (ip && ip !== 'N/A') {
        counts[ip] = (counts[ip] || 0) + 1;
      }
    });
    return counts;
  }, [records]);

  // Active visit count per IP within the currently selected date & filters
  const activeIpHitCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach((r) => {
      if (isLocalRecord(r)) return;
      const data = getRecordData(r);
      if (selectedDate && data.dateKey !== selectedDate) return;
      if (deviceFilter !== 'all') {
        if (deviceFilter === 'bot' && !data.isBot) return;
        if (deviceFilter === 'mobile' && data.deviceType.toLowerCase() !== 'mobile') return;
        if (deviceFilter === 'desktop' && data.deviceType.toLowerCase() !== 'desktop') return;
        if (deviceFilter === 'tablet' && data.deviceType.toLowerCase() !== 'tablet') return;
      }
      if (channelFilter !== 'all') {
        if (channelFilter === 'ad' && !data.isAd) return;
        if (channelFilter === 'organic' && data.channelCategory !== 'organic') return;
        if (channelFilter === 'social' && data.channelCategory !== 'social') return;
        if (channelFilter === 'direct' && (data.channelCategory !== 'direct' || data.isAd)) return;
      }
      const ip = data.ip;
      if (ip && ip !== 'N/A') {
        counts[ip] = (counts[ip] || 0) + 1;
      }
    });
    return counts;
  }, [records, selectedDate, deviceFilter, channelFilter]);

  // 2. Filtered and sorted records for the visitor log stream
  const filteredRecords = useMemo(() => {
    const list = records.filter((r) => {
      if (isLocalRecord(r)) return false;
      const data = getRecordData(r);
      const q = searchQuery.toLowerCase().trim();

      // Date filter
      if (selectedDate && data.dateKey !== selectedDate) {
        return false;
      }

      // Device filter
      if (deviceFilter !== 'all') {
        if (deviceFilter === 'bot' && !data.isBot) return false;
        if (deviceFilter === 'mobile' && data.deviceType.toLowerCase() !== 'mobile') return false;
        if (deviceFilter === 'desktop' && data.deviceType.toLowerCase() !== 'desktop') return false;
        if (deviceFilter === 'tablet' && data.deviceType.toLowerCase() !== 'tablet') return false;
      }

      // Channel / Ad filter
      if (channelFilter !== 'all') {
        if (channelFilter === 'ad' && !data.isAd) return false;
        if (channelFilter === 'organic' && data.channelCategory !== 'organic') return false;
        if (channelFilter === 'social' && data.channelCategory !== 'social') return false;
        if (channelFilter === 'direct' && (data.channelCategory !== 'direct' || data.isAd)) return false;
      }

      if (!q) return true;

      return (
        data.ip.toLowerCase().includes(q) ||
        data.city.toLowerCase().includes(q) ||
        data.region.toLowerCase().includes(q) ||
        data.country.toLowerCase().includes(q) ||
        data.isp.toLowerCase().includes(q) ||
        data.browser.toLowerCase().includes(q) ||
        data.os.toLowerCase().includes(q) ||
        data.trafficSource.toLowerCase().includes(q) ||
        (data.campaignName && data.campaignName.toLowerCase().includes(q)) ||
        (data.campaignId && data.campaignId.toLowerCase().includes(q)) ||
        (data.adClickId && data.adClickId.toLowerCase().includes(q)) ||
        r.path.toLowerCase().includes(q)
      );
    });

    // Unique IPs filter: keep only the latest visit for each unique IP
    let processed = list;
    if (uniqueIpOnly) {
      const seenIps = new Set<string>();
      processed = list.filter((r) => {
        const ipKey = r.ip_address || r.details?.ip || r.ip_hash || r.id;
        if (seenIps.has(ipKey)) return false;
        seenIps.add(ipKey);
        return true;
      });
    }

    // Sort records based on user selection (IP Hits, Date, IP Address, etc.)
    return [...processed].sort((a, b) => {
      const ipA = a.ip_address || a.details?.ip || 'N/A';
      const ipB = b.ip_address || b.details?.ip || 'N/A';
      const hitsA = activeIpHitCounts[ipA] || ipHitCounts[ipA] || 0;
      const hitsB = activeIpHitCounts[ipB] || ipHitCounts[ipB] || 0;

      if (sortBy === 'most_hits') {
        if (hitsB !== hitsA) return hitsB - hitsA;
        if (ipA !== ipB) return ipA.localeCompare(ipB);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }

      if (sortBy === 'least_hits') {
        if (hitsA !== hitsB) return hitsA - hitsB;
        if (ipA !== ipB) return ipA.localeCompare(ipB);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }

      if (sortBy === 'ip_asc') {
        if (ipA !== ipB) return ipA.localeCompare(ipB);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }

      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }

      // Default: 'latest' (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [records, searchQuery, deviceFilter, channelFilter, selectedDate, uniqueIpOnly, sortBy, activeIpHitCounts, ipHitCounts]);

  // Aggregated IP breakdown list
  const ipStatsList: IpStats[] = useMemo(() => {
    const groups: Record<string, AnalyticsRecord[]> = {};

    records.forEach((r) => {
      if (isLocalRecord(r)) return;
      const data = getRecordData(r);
      if (selectedDate && data.dateKey !== selectedDate) return;
      if (deviceFilter !== 'all') {
        if (deviceFilter === 'bot' && !data.isBot) return;
        if (deviceFilter === 'mobile' && data.deviceType.toLowerCase() !== 'mobile') return;
        if (deviceFilter === 'desktop' && data.deviceType.toLowerCase() !== 'desktop') return;
        if (deviceFilter === 'tablet' && data.deviceType.toLowerCase() !== 'tablet') return;
      }
      if (channelFilter !== 'all') {
        if (channelFilter === 'ad' && !data.isAd) return;
        if (channelFilter === 'organic' && data.channelCategory !== 'organic') return;
        if (channelFilter === 'social' && data.channelCategory !== 'social') return;
        if (channelFilter === 'direct' && (data.channelCategory !== 'direct' || data.isAd)) return;
      }

      const ip = data.ip;
      if (!groups[ip]) groups[ip] = [];
      groups[ip].push(r);
    });

    const entries = Object.entries(groups).map(([ip, ipRecords]) => {
      const sortedRecords = [...ipRecords].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const latestRecord = sortedRecords[0];
      const oldestRecord = sortedRecords[sortedRecords.length - 1];
      const latestData = getRecordData(latestRecord);

      let adHits = 0;
      let organicHits = 0;
      let directHits = 0;
      const deviceSet = new Set<string>();
      const browserSet = new Set<string>();
      const pathCounts: Record<string, number> = {};
      const campaignSet = new Set<string>();

      sortedRecords.forEach((r) => {
        const d = getRecordData(r);
        if (d.isAd) adHits++;
        else if (d.channelCategory === 'organic') organicHits++;
        else directHits++;

        if (d.deviceLabel) deviceSet.add(d.deviceLabel);
        if (d.browser) browserSet.add(d.browser);
        if (d.campaignName) campaignSet.add(d.campaignName);
        const p = r.path || '/';
        pathCounts[p] = (pathCounts[p] || 0) + 1;
      });

      const sortedPaths = Object.entries(pathCounts).sort((a, b) => b[1] - a[1]);
      const topLandingPage = sortedPaths[0] ? sortedPaths[0][0] : '/';

      return {
        ip,
        totalHits: sortedRecords.length,
        adHits,
        organicHits,
        directHits,
        city: latestData.city,
        region: latestData.region,
        country: latestData.country,
        isp: latestData.isp,
        mapLink: latestData.mapLink,
        devices: Array.from(deviceSet),
        browsers: Array.from(browserSet),
        topLandingPage,
        firstSeen: oldestRecord.created_at,
        lastSeen: latestRecord.created_at,
        campaigns: Array.from(campaignSet),
        latestRecord,
        records: sortedRecords
      };
    });

    return entries.sort((a, b) => b.totalHits - a.totalHits);
  }, [records, selectedDate, deviceFilter, channelFilter]);

  // Filtered and sorted IP stats for the IP breakdown tab
  const filteredIpStats = useMemo(() => {
    let list = ipStatsList;
    if (ipSearchQuery.trim()) {
      const q = ipSearchQuery.toLowerCase().trim();
      list = list.filter((item) => 
        item.ip.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.isp.toLowerCase().includes(q) ||
        item.topLandingPage.toLowerCase().includes(q) ||
        item.campaigns.some((c) => c.toLowerCase().includes(q))
      );
    }

    return [...list].sort((a, b) => {
      if (ipTableSort === 'hits_desc') return b.totalHits - a.totalHits;
      if (ipTableSort === 'hits_asc') return a.totalHits - b.totalHits;
      if (ipTableSort === 'ads_desc') return b.adHits - a.adHits;
      if (ipTableSort === 'recent') return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
      if (ipTableSort === 'ip_asc') return a.ip.localeCompare(b.ip);
      return b.totalHits - a.totalHits;
    });
  }, [ipStatsList, ipSearchQuery, ipTableSort]);

  // Pagination for Visitor Hits (default: 50 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);

  // Automatically reset to page 1 when search query, filter options, sort, or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, deviceFilter, channelFilter, selectedDate, uniqueIpOnly, itemsPerPage, sortBy]);

  useEffect(() => {
    setIpCurrentPage(1);
  }, [ipSearchQuery, ipTableSort, ipItemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / (itemsPerPage || 50)));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredRecords.length);

  const paginatedRecords = useMemo(() => {
    return filteredRecords.slice(startIndex, endIndex);
  }, [filteredRecords, startIndex, endIndex]);

  const handlePageChange = (newPage: number) => {
    const target = Math.max(1, Math.min(totalPages, newPage));
    setCurrentPage(target);
    const section = document.getElementById('visitor-hits-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Pagination & metrics for IP breakdown table
  const ipTotalPages = Math.max(1, Math.ceil(filteredIpStats.length / (ipItemsPerPage || 25)));
  const ipSafeCurrentPage = Math.min(Math.max(1, ipCurrentPage), ipTotalPages);
  const ipStartIndex = (ipSafeCurrentPage - 1) * ipItemsPerPage;
  const ipEndIndex = Math.min(ipStartIndex + ipItemsPerPage, filteredIpStats.length);

  const paginatedIpStats = useMemo(() => {
    return filteredIpStats.slice(ipStartIndex, ipEndIndex);
  }, [filteredIpStats, ipStartIndex, ipEndIndex]);

  const handleIpPageChange = (newPage: number) => {
    const target = Math.max(1, Math.min(ipTotalPages, newPage));
    setIpCurrentPage(target);
    const section = document.getElementById('ip-hits-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const totalHitsInIpView = useMemo(() => {
    return filteredIpStats.reduce((sum, item) => sum + item.totalHits, 0);
  }, [filteredIpStats]);

  const maxHitsInIpView = useMemo(() => {
    return filteredIpStats.length > 0 ? filteredIpStats[0].totalHits : 1;
  }, [filteredIpStats]);

  const repeatVisitorsCount = useMemo(() => {
    return filteredIpStats.filter((item) => item.totalHits > 1).length;
  }, [filteredIpStats]);

  // Overall summary metrics
  const stats = useMemo(() => {
    const totalHits = records.length;
    const uniqueIps = new Set(records.map((r) => r.ip_address || r.details?.ip || r.ip_hash)).size;
    const todayStats = dailyStatsList.find((d) => d.isToday);
    
    let totalAds = 0;
    records.forEach((r) => {
      const d = getRecordData(r);
      if (d.isAd) totalAds++;
    });

    const adPercentage = totalHits > 0 ? Math.round((totalAds / totalHits) * 100) : 0;

    return {
      totalHits,
      uniqueIps,
      todayHits: todayStats?.totalHits || 0,
      todayUnique: todayStats?.uniqueIps || 0,
      todayAds: todayStats?.adCount || 0,
      todayTopCity: todayStats?.topCity || '—',
      totalAds,
      adPercentage
    };
  }, [records, dailyStatsList]);

  // Helper to map record into a clean, rich Excel row
  const formatRecordForExcel = (r: AnalyticsRecord, customHitCounts?: Record<string, number>) => {
    const d = getRecordData(r);
    const hitCount = customHitCounts
      ? (customHitCounts[d.ip] || 1)
      : (activeIpHitCounts[d.ip] || ipHitCounts[d.ip] || 1);

    return {
      'Date & Time': format(new Date(r.created_at), 'yyyy-MM-dd HH:mm:ss'),
      'IP Address': d.ip,
      'IP Hit Count': hitCount,
      'City': d.city,
      'Region / State': d.region,
      'Country': d.country,
      'ISP / Carrier': d.isp,
      'Traffic Type': d.isAd ? 'Paid Ad' : d.channelCategory === 'organic' ? 'Organic Search' : d.channelCategory === 'social' ? 'Social Media' : 'Direct Visit',
      'Ad Platform': d.adPlatform || '—',
      'Campaign Name': d.campaignName || '—',
      'Campaign ID': d.campaignId || '—',
      'Ad Click ID': d.adClickId || '—',
      'Search Keyword': d.keyword || '—',
      'Visited Page': r.path || '/',
      'Device Type': d.deviceType,
      'Device Model': d.deviceLabel,
      'Browser': d.browser,
      'Operating System': d.os,
      'Screen Resolution': d.screen || '—',
      'Language': d.language || '—',
      'Referrer Source': d.trafficSource,
      'Full Referrer URL': d.channelCategory !== 'direct' ? (r.referrer || d.trafficSource) : 'Direct'
    };
  };

  // 1. Export All Loaded Visitor Logs (All Days & Requests)
  const handleExportAllVisitorLogsExcel = async () => {
    if (records.length === 0) {
      toast({ variant: 'destructive', title: 'No Data', description: 'No visitor logs to export.' });
      return;
    }
    setExportingExcel(true);
    setExportStatusText('Generating Excel...');
    try {
      const excelRows = records.map((r) => formatRecordForExcel(r, ipHitCounts));
      const dateStr = format(new Date(), 'yyyy-MM-dd');
      await exportToExcel(excelRows, `Magnevents_All_Visitor_Logs_${dateStr}`, 'All Visitor Logs');
      toast({ title: 'Excel Export Successful', description: `Exported all ${excelRows.length} visitor logs across all days to Excel (.xlsx).` });
    } catch (err: any) {
      console.error('Excel Export Error:', err);
      toast({ variant: 'destructive', title: 'Export Failed', description: err.message || 'Failed to generate Excel file' });
    } finally {
      setExportingExcel(false);
      setExportStatusText('Exporting...');
    }
  };

  // 2. Export Filtered View Logs to Excel (Matches active filter / selected day)
  const handleExportFilteredLogsExcel = async () => {
    if (filteredRecords.length === 0) {
      toast({ variant: 'destructive', title: 'No Data', description: 'No visitor logs match current filter.' });
      return;
    }
    setExportingExcel(true);
    setExportStatusText('Exporting View...');
    try {
      const excelRows = filteredRecords.map((r) => formatRecordForExcel(r));
      const dateStr = format(new Date(), 'yyyy-MM-dd');
      const suffix = selectedDate ? `_${selectedDate}` : '_Filtered';
      await exportToExcel(excelRows, `Magnevents_Visitor_Logs${suffix}_${dateStr}`, 'Visitor Logs');
      toast({ title: 'Excel Export Successful', description: `Exported ${excelRows.length} filtered visitor records to Excel (.xlsx).` });
    } catch (err: any) {
      console.error('Excel Export Error:', err);
      toast({ variant: 'destructive', title: 'Export Failed', description: err.message || 'Failed to generate Excel file' });
    } finally {
      setExportingExcel(false);
      setExportStatusText('Exporting...');
    }
  };

  // 3. Export Complete Database History (All Historical Records)
  const handleExportFullDatabaseExcel = async () => {
    setExportingExcel(true);
    setExportStatusText('Fetching DB...');
    toast({ title: 'Downloading All Records', description: 'Fetching complete visitor history from database...' });
    try {
      const { count } = await supabase.from('analytics').select('*', { count: 'exact', head: true });
      const total = count || records.length;
      const chunkSize = 1000;
      const numChunks = Math.min(Math.ceil(total / chunkSize), 25);
      
      const chunkPromises = [];
      for (let i = 0; i < numChunks; i++) {
        chunkPromises.push(
          supabase
            .from('analytics')
            .select('*')
            .order('created_at', { ascending: false })
            .range(i * chunkSize, (i + 1) * chunkSize - 1)
        );
      }
      const results = await Promise.all(chunkPromises);
      const allDbRecords = results.flatMap((r) => r.data || []);
      
      setExportStatusText('Building Excel...');
      const fullDbHitCounts: Record<string, number> = {};
      allDbRecords.forEach((r) => {
        const d = getRecordData(r);
        if (d.ip && d.ip !== 'N/A') {
          fullDbHitCounts[d.ip] = (fullDbHitCounts[d.ip] || 0) + 1;
        }
      });
      const excelRows = allDbRecords.map((r) => formatRecordForExcel(r, fullDbHitCounts));
      const dateStr = format(new Date(), 'yyyy-MM-dd');
      await exportToExcel(excelRows, `Magnevents_Complete_Database_Requests_${dateStr}`, 'All Requests');
      toast({ title: 'Complete Export Done', description: `Successfully exported ${excelRows.length} total visitor requests to Excel (.xlsx).` });
    } catch (err: any) {
      console.error('Full Database Export Error:', err);
      toast({ variant: 'destructive', title: 'Export Failed', description: err.message || 'Failed to export full database.' });
    } finally {
      setExportingExcel(false);
      setExportStatusText('Exporting...');
    }
  };

  // 4. Export Day-Wise Summary to Excel (.xlsx)
  const handleExportDailySummaryExcel = async () => {
    if (dailyStatsList.length === 0) {
      toast({ variant: 'destructive', title: 'No Data', description: 'No daily records to export.' });
      return;
    }
    setExportingExcel(true);
    setExportStatusText('Exporting Days...');
    try {
      const excelRows = dailyStatsList.map((d) => ({
        'Date': d.formattedDate,
        'Day': d.dayLabel,
        'Total Hits': d.totalHits,
        'Unique Visitors': d.uniqueIps,
        'Paid Ad Hits': d.adCount,
        'Organic Search Hits': d.organicCount,
        'Direct / Other Hits': d.directCount,
        'Top Locality': d.topCity,
        'Mobile %': `${d.mobilePercent}%`,
        'Desktop %': `${100 - d.mobilePercent}%`,
        'Top Visited Page': d.topPage,
        'Top Campaign': d.topCampaign
      }));

      const dateStr = format(new Date(), 'yyyy-MM-dd');
      await exportToExcel(excelRows, `Magnevents_Daily_Summary_${dateStr}`, 'Daily Summary');
      toast({ title: 'Excel Export Successful', description: 'Exported day-by-day analytics to Excel (.xlsx).' });
    } catch (err: any) {
      console.error('Excel Export Error:', err);
      toast({ variant: 'destructive', title: 'Export Failed', description: err.message || 'Failed to generate Excel file' });
    } finally {
      setExportingExcel(false);
      setExportStatusText('Exporting...');
    }
  };

  // 5. Export IP-Wise Hit Ranking to Excel (.xlsx)
  const handleExportIpBreakdownExcel = async () => {
    if (filteredIpStats.length === 0) {
      toast({ variant: 'destructive', title: 'No Data', description: 'No IP ranking data to export.' });
      return;
    }
    setExportingExcel(true);
    setExportStatusText('Exporting IPs...');
    try {
      const totalHits = filteredIpStats.reduce((sum, item) => sum + item.totalHits, 0);
      const excelRows = filteredIpStats.map((item, idx) => ({
        'Rank': `#${idx + 1}`,
        'IP Address': item.ip,
        'Total Hits': item.totalHits,
        '% of Traffic': `${totalHits > 0 ? ((item.totalHits / totalHits) * 100).toFixed(1) : 0}%`,
        'Paid Ad Hits': item.adHits,
        'Organic Search Hits': item.organicHits,
        'Direct / Other Hits': item.directHits,
        'City': item.city,
        'Region / State': item.region,
        'Country': item.country,
        'ISP / Carrier': item.isp || '—',
        'Devices Used': item.devices.join(', ') || '—',
        'Browsers': item.browsers.join(', ') || '—',
        'Top Visited Page': item.topLandingPage,
        'Associated Campaigns': item.campaigns.join(', ') || '—',
        'First Seen': format(new Date(item.firstSeen), 'yyyy-MM-dd HH:mm:ss'),
        'Last Seen': format(new Date(item.lastSeen), 'yyyy-MM-dd HH:mm:ss')
      }));

      const dateStr = format(new Date(), 'yyyy-MM-dd');
      await exportToExcel(excelRows, `Magnevents_IP_Wise_Hits_${dateStr}`, 'IP Hit Rankings');
      toast({ title: 'Excel Export Successful', description: `Exported IP hit rankings for ${excelRows.length} unique IPs.` });
    } catch (err: any) {
      console.error('IP Breakdown Export Error:', err);
      toast({ variant: 'destructive', title: 'Export Failed', description: err.message || 'Failed to export IP rankings' });
    } finally {
      setExportingExcel(false);
      setExportStatusText('Exporting...');
    }
  };

  // Export Daily Summary as CSV
  const exportCsv = () => {
    const headers = ['Date', 'Total Hits', 'Unique Visitors', 'Ad Hits', 'Organic/Direct Hits', 'Top City', 'Mobile %', 'Top Page'];
    const rows = dailyStatsList.map((d) => [
      d.formattedDate,
      d.totalHits,
      d.uniqueIps,
      d.adCount,
      d.organicCount + d.directCount,
      `"${d.topCity}"`,
      `${d.mobilePercent}%`,
      `"${d.topPage}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `magnevents_traffic_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Exported', description: 'Daily traffic report downloaded as CSV.' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-amber-500" />
            Visitor Intelligence & Ad Campaign Tracking
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time IP extraction, locality (city/region/country), and Ad vs Direct search attribution
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <input 
              type="checkbox" 
              checked={autoRefresh} 
              onChange={(e) => setAutoRefresh(e.target.checked)} 
              className="rounded text-amber-500 focus:ring-amber-400"
            />
            Auto-refresh (15s)
          </label>

          {/* Export Dropdown (Excel & CSV) */}
          <div className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              disabled={exportingExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-sm disabled:opacity-50"
              title="Download Data as Excel (.xlsx)"
            >
              <Download className={`h-3.5 w-3.5 ${exportingExcel ? 'animate-bounce' : ''}`} />
              <span>{exportingExcel ? exportStatusText : 'Export Excel'}</span>
              <ChevronDown className="h-3 w-3 text-emerald-200" />
            </button>

            {exportMenuOpen && (
              <div 
                className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1.5 animate-in fade-in slide-in-from-top-1"
                onMouseLeave={() => setExportMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                  <span>Excel & Data Reports</span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1 rounded font-bold">.XLSX</span>
                </div>

                {/* Option 1: All Loaded Visitor Logs */}
                <button
                  onClick={() => { setExportMenuOpen(false); handleExportAllVisitorLogsExcel(); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2.5 transition"
                >
                  <span className="p-1 rounded bg-emerald-100 text-emerald-700 font-mono text-[10px] font-bold">ALL</span>
                  <div>
                    <div className="font-bold">All Visitor Logs ({records.length} hits)</div>
                    <div className="text-[10px] text-slate-400 font-normal">All past days, IPs, ad tags & channels</div>
                  </div>
                </button>

                {/* Option 2: Filtered View */}
                <button
                  onClick={() => { setExportMenuOpen(false); handleExportFilteredLogsExcel(); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2.5 transition"
                >
                  <span className="p-1 rounded bg-amber-100 text-amber-700 font-mono text-[10px] font-bold">VIEW</span>
                  <div>
                    <div className="font-bold">Filtered View Logs ({filteredRecords.length})</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      {selectedDate ? `Date: ${selectedDate}` : 'Active search / filter view'}
                    </div>
                  </div>
                </button>

                {/* Option 3: Full Database History */}
                <button
                  onClick={() => { setExportMenuOpen(false); handleExportFullDatabaseExcel(); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-800 flex items-center gap-2.5 transition"
                >
                  <span className="p-1 rounded bg-blue-100 text-blue-700 font-mono text-[10px] font-bold">ALL DB</span>
                  <div>
                    <div className="font-bold">Whole History Export {totalDbCount ? `(${totalDbCount})` : ''}</div>
                    <div className="text-[10px] text-slate-400 font-normal">Every single visitor request in database</div>
                  </div>
                </button>

                {/* Option 4: IP-Wise Hit Ranking */}
                <button
                  onClick={() => { setExportMenuOpen(false); handleExportIpBreakdownExcel(); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2.5 transition"
                >
                  <span className="p-1 rounded bg-amber-100 text-amber-700 font-mono text-[10px] font-bold">IPS</span>
                  <div>
                    <div className="font-bold">IP-Wise Hit Ranking ({filteredIpStats.length} IPs)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Rank IPs by hits, ad attribution & location</div>
                  </div>
                </button>

                <div className="border-t border-slate-100 my-1" />

                {/* Option 5: Day-Wise Summary */}
                <button
                  onClick={() => { setExportMenuOpen(false); handleExportDailySummaryExcel(); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2.5 transition"
                >
                  <span className="p-1 rounded bg-emerald-100 text-emerald-700 font-mono text-[10px] font-bold">DAYS</span>
                  <div>
                    <div className="font-bold">Day-Wise Summary Excel</div>
                    <div className="text-[10px] text-slate-400 font-normal">Daily totals, hits & ad performance</div>
                  </div>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={() => { setExportMenuOpen(false); exportCsv(); }}
                  className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2.5 transition"
                >
                  <span className="p-1 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">CSV</span>
                  <span>Download as CSV</span>
                </button>
              </div>
            )}
          </div>

          {totalDbCount && (
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 hidden sm:inline-flex items-center gap-1">
              <span>{records.length} logs ({totalDbCount} total in DB)</span>
            </span>
          )}

          <button
            onClick={() => fetchRecords(true)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Top KPI Cards (Including Ad Campaign Tracking) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Traffic */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today&apos;s Traffic</span>
            <Calendar className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.todayHits}</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <span className="font-semibold text-emerald-600">{stats.todayUnique}</span> unique IPs today
          </div>
        </div>

        {/* Ad Campaign Traffic */}
        <div className="bg-white p-4 rounded-xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/40 shadow-sm">
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Target className="h-3.5 w-3.5 text-purple-600" /> Ad & Campaign Hits
            </span>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-950">{stats.totalAds}</div>
          <div className="flex items-center gap-1 text-xs text-purple-700 mt-1">
            <span>{stats.adPercentage}% of total traffic from ads</span>
          </div>
        </div>

        {/* Top Locality */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Top Locality (Today)</span>
            <MapPin className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 truncate" title={stats.todayTopCity}>
            {stats.todayTopCity}
          </div>
          <p className="text-xs text-slate-400 mt-1">Most frequent visitor city</p>
        </div>

        {/* Total Hits Recorded */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Unique Visitors</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.uniqueIps}</div>
          <p className="text-xs text-slate-400 mt-1">Across all logged days</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('stream')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition ${
            activeTab === 'stream'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="h-4 w-4" />
          Live Visitor Stream ({filteredRecords.length})
          {selectedDate && (
            <span className="text-[11px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-normal">
              Filtered: {selectedDate}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ip-ranking')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition ${
            activeTab === 'ip-ranking'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          IP-Wise Hit Breakdown ({filteredIpStats.length} Unique IPs)
        </button>

        <button
          onClick={() => setActiveTab('daily')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition ${
            activeTab === 'daily'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          Day-Wise Breakdown ({dailyStatsList.length} Days)
        </button>
      </div>

      {/* TAB 1: LIVE VISITOR STREAM */}
      {activeTab === 'stream' && (
        <div className="space-y-4">
          {/* Active Date Filter Banner if set */}
          {selectedDate && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                <Calendar className="h-4 w-4 text-amber-600" />
                <span>Showing visitor hits exclusively for date: <strong>{selectedDate}</strong></span>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-200/60 px-2 py-1 rounded"
              >
                <X className="h-3 w-3" /> Clear Date Filter (Show All)
              </button>
            </div>
          )}

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by IP, City, Region, Campaign, Ad Click ID, Path..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                  title="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Ad / Traffic Source Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="text-xs font-bold bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="all">All Traffic Sources</option>
                <option value="ad">🎯 Paid Ads Only</option>
                <option value="organic">🔍 Organic Search Only</option>
                <option value="direct">🔗 Direct Search / Visit</option>
                <option value="social">📱 Social Media Only</option>
              </select>

              {/* Device Filter */}
              <select
                value={deviceFilter}
                onChange={(e) => setDeviceFilter(e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="all">All Devices</option>
                <option value="mobile">📱 Mobile Only</option>
                <option value="desktop">💻 Desktop Only</option>
                <option value="tablet">📱 Tablet Only</option>
                <option value="bot">🤖 Bots Only</option>
              </select>

              {/* Unique IPs Filter Dropdown */}
              <select
                value={uniqueIpOnly ? 'unique' : 'all'}
                onChange={(e) => setUniqueIpOnly(e.target.value === 'unique')}
                className={`text-xs font-bold rounded-lg px-3 py-2 transition focus:outline-none focus:ring-2 shadow-xs cursor-pointer ${
                  uniqueIpOnly
                    ? 'bg-emerald-600 text-white border border-emerald-600 focus:ring-emerald-400'
                    : 'bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 text-emerald-900 focus:ring-emerald-400'
                }`}
                title="Filter by Unique IPs or show all hits"
              >
                <option value="all" className="bg-white text-slate-800">👥 All Visitor Hits</option>
                <option value="unique" className="bg-white text-slate-800">✨ Unique IPs Only</option>
              </select>

              {/* Day Selector */}
              <select
                value={selectedDate || ''}
                onChange={(e) => setSelectedDate(e.target.value || null)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">All Dates</option>
                {dailyStatsList.map((d) => (
                  <option key={d.dateKey} value={d.dateKey}>
                    {d.dayLabel} ({d.totalHits} hits)
                  </option>
                ))}
              </select>

              {/* Sort Selector: IP Hits & Date */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className={`text-xs font-bold rounded-lg px-3 py-2 transition focus:outline-none focus:ring-2 shadow-xs cursor-pointer ${
                  sortBy === 'most_hits'
                    ? 'bg-amber-500 text-slate-950 border border-amber-600 focus:ring-amber-400'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 focus:ring-amber-400'
                }`}
                title="Sort visitor data by IP hits or date"
              >
                <option value="latest">🕒 Sort: Latest Visits</option>
                <option value="most_hits">🔥 Sort: Most Hits by IP</option>
                <option value="least_hits">❄️ Sort: Fewest Hits by IP</option>
                <option value="ip_asc">🌐 Sort: IP Address (A-Z)</option>
                <option value="oldest">⏳ Sort: Oldest Visits First</option>
              </select>
            </div>
          </div>

          {/* Visitor List Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div id="visitor-hits-section" className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Visitor Hits ({filteredRecords.length})
                </span>
                {sortBy === 'most_hits' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    <TrendingUp className="h-3 w-3 text-amber-600" />
                    <span>🔥 Sorted: Most Hits by IP</span>
                    <button 
                      onClick={() => setSortBy('latest')} 
                      className="hover:text-amber-950 font-black ml-0.5 text-xs"
                      title="Reset to Latest"
                    >
                      ×
                    </button>
                  </span>
                )}
                {uniqueIpOnly && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span>✨ Unique IPs Only</span>
                    <button 
                      onClick={() => setUniqueIpOnly(false)} 
                      className="hover:text-emerald-950 font-black ml-0.5 text-xs"
                      title="Show all visitor hits"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                    <span>Search: {searchQuery}</span>
                    <button 
                      onClick={() => setSearchQuery('')} 
                      className="hover:text-blue-950 font-black ml-0.5 text-xs"
                      title="Clear search"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filteredRecords.length > 0 && (
                  <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full font-medium shadow-xs">
                    Page <strong className="text-slate-800">{safeCurrentPage}</strong> of <strong className="text-slate-800">{totalPages}</strong> ({startIndex + 1}–{endIndex})
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* 1-Click Toggle for Sort by IP Hits */}
                <button
                  onClick={() => setSortBy(sortBy === 'most_hits' ? 'latest' : 'most_hits')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border transition shadow-xs ${
                    sortBy === 'most_hits'
                      ? 'bg-amber-500 text-slate-900 border-amber-600'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                  title={sortBy === 'most_hits' ? 'Click to reset to Latest Visits' : 'Click to sort IP-wise by hit count'}
                >
                  <TrendingUp className="h-3 w-3 text-amber-600" />
                  <span>{sortBy === 'most_hits' ? 'Sorted by IP Hits' : 'Sort by IP Hits'}</span>
                </button>

                {/* Per Page Quick Selector */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-lg shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Per Page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                  </select>
                </div>

                {/* Quick Prev / Next Buttons */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePageChange(safeCurrentPage - 1)}
                      disabled={safeCurrentPage === 1}
                      title="Previous Page"
                      className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-slate-700 shadow-sm"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                      {safeCurrentPage}/{totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(safeCurrentPage + 1)}
                      disabled={safeCurrentPage === totalPages}
                      title="Next Page"
                      className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-slate-700 shadow-sm"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                <button
                  onClick={handleExportFilteredLogsExcel}
                  disabled={exportingExcel || filteredRecords.length === 0}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg transition disabled:opacity-50"
                  title="Export this visitor table to Excel"
                >
                  <Download className="h-3 w-3 text-emerald-700" />
                  <span>Download Table to Excel</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-amber-500" />
                Loading visitor logs...
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Globe className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                No visitor logs matched this filter.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {paginatedRecords.map((record) => {
                  const data = getRecordData(record);
                  const isExpanded = expandedId === record.id;
                  const activeHits = activeIpHitCounts[data.ip] || 1;
                  const totalHits = ipHitCounts[data.ip] || 1;
                  const isRepeat = totalHits > 1;

                  return (
                    <div key={record.id} className="p-4 hover:bg-slate-50/80 transition space-y-2">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Left: IP & Locality & AD BADGE */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* IP Badge */}
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded-md">
                              {data.ip}
                              <button
                                onClick={() => copyToClipboard(data.ip)}
                                title="Copy IP"
                                className="hover:text-amber-400 transition"
                              >
                                {copiedIp === data.ip ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                              </button>
                            </span>

                            {/* Prominent IP Hits Badge */}
                            <button
                              onClick={() => setSearchQuery(data.ip)}
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold transition border shadow-xs ${
                                isRepeat
                                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                              }`}
                              title={`This IP has generated ${activeHits} hit${activeHits === 1 ? '' : 's'}${selectedDate ? ` on ${selectedDate}` : ''} (${totalHits} total across all dates). Click to filter stream.`}
                            >
                              {isRepeat ? (
                                <TrendingUp className="h-3 w-3 text-amber-600" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                              )}
                              <span>{activeHits} {activeHits === 1 ? 'Hit' : 'Hits'}</span>
                              {selectedDate && totalHits !== activeHits && (
                                <span className="text-[10px] text-amber-700 font-normal">({totalHits} total)</span>
                              )}
                            </button>

                            {/* Locality Badge */}
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium rounded-md">
                              <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                              {[data.city, data.region, data.country].filter(Boolean).join(', ') || 'Unknown Locality'}
                            </span>

                            {/* Google Maps Link if coords exist */}
                            {data.mapLink && (
                              <a
                                href={data.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Map
                              </a>
                            )}

                            {/* Quick Filter IP Link */}
                            {searchQuery !== data.ip ? (
                              <button
                                onClick={() => setSearchQuery(data.ip)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-amber-700 hover:underline"
                                title="Filter stream to hits from this IP"
                              >
                                Filter IP
                              </button>
                            ) : (
                              <button
                                onClick={() => setSearchQuery('')}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"
                                title="Clear filter"
                              >
                                Filtered <X className="h-2.5 w-2.5" />
                              </button>
                            )}

                            {/* AD / TRAFFIC ORIGIN BADGE */}
                            {data.isAd ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-900 border border-purple-300 text-xs font-extrabold rounded-md shadow-sm">
                                <Target className="h-3.5 w-3.5 text-purple-700 animate-pulse" />
                                <span>PAID AD: {data.adPlatform || 'Campaign'}</span>
                              </span>
                            ) : data.channelCategory === 'organic' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold rounded-md">
                                <Search className="h-3 w-3 text-sky-600" />
                                <span>Organic Search</span>
                              </span>
                            ) : data.channelCategory === 'social' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-50 text-pink-800 border border-pink-200 text-xs font-semibold rounded-md">
                                <Share2 className="h-3 w-3 text-pink-600" />
                                <span>Social Media</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium rounded-md">
                                <Link2 className="h-3 w-3 text-slate-500" />
                                <span>Direct Search / Visit</span>
                              </span>
                            )}

                            {/* ISP */}
                            {data.isp && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                <Wifi className="h-2.5 w-2.5 text-slate-400" />
                                {data.isp}
                              </span>
                            )}
                          </div>

                          {/* Visited URL & Source Details */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                            <span className="font-semibold text-slate-800 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-mono">
                              {record.path || '/'}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span>Source: <strong className="text-slate-800">{data.trafficSource}</strong></span>
                            {data.screen && (
                              <>
                                <span className="text-slate-400">•</span>
                                <span>Screen: {data.screen}</span>
                              </>
                            )}
                            {data.language && (
                              <>
                                <span className="text-slate-400">•</span>
                                <span>Lang: {data.language}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Right: Device details & Time */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-1.5 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded-md">
                              {data.isBot ? (
                                <Bot className="h-3.5 w-3.5 text-purple-600" />
                              ) : data.deviceType.toLowerCase() === 'mobile' ? (
                                <Smartphone className="h-3.5 w-3.5 text-amber-600" />
                              ) : (
                                <Laptop className="h-3.5 w-3.5 text-blue-600" />
                              )}
                              {data.deviceLabel}
                            </span>

                            <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                              {data.browser} • {data.os}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>
                              {format(new Date(record.created_at), 'hh:mm:ss a')} • {formatDistanceToNow(new Date(record.created_at), { addSuffix: true })}
                            </span>
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : record.id)}
                              className="text-slate-400 hover:text-slate-600 text-[11px] underline"
                            >
                              {isExpanded ? 'Hide Raw' : 'JSON'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Prominent Ad / Campaign Bar if this visitor used an Ad */}
                      {data.isAd && (
                        <div className="bg-purple-50/70 border border-purple-200 rounded-lg p-2.5 text-xs text-purple-950 flex flex-wrap items-center gap-3">
                          <span className="font-extrabold uppercase text-[10px] tracking-wider bg-purple-200 text-purple-900 px-2 py-0.5 rounded">
                            Ad Intelligence
                          </span>

                          {data.adPlatform && (
                            <span>Platform: <strong>{data.adPlatform}</strong></span>
                          )}

                          {data.campaignName && (
                            <span>Campaign Name: <strong>{data.campaignName}</strong></span>
                          )}

                          {data.campaignId && (
                            <span className="flex items-center gap-1">
                              Campaign ID: <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-mono text-[11px] font-bold">{data.campaignId}</code>
                            </span>
                          )}

                          {data.adClickId && (
                            <span className="flex items-center gap-1">
                              Click ID: <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 font-mono text-[11px] truncate max-w-[150px] inline-block">{data.adClickId}</code>
                            </span>
                          )}

                          {data.keyword && (
                            <span>Search Keyword: <em>&ldquo;{data.keyword}&rdquo;</em></span>
                          )}
                        </div>
                      )}

                      {/* Expanded JSON inspector */}
                      {isExpanded && (
                        <div className="mt-3 p-3 bg-slate-900 rounded-lg text-slate-100 text-xs font-mono overflow-x-auto">
                          <pre>{JSON.stringify(record.details || record, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Pagination Bar */}
            {!loading && filteredRecords.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3.5 border-t border-slate-200 bg-slate-50/70 gap-4">
                <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                  <span>
                    Showing <strong className="font-bold text-slate-900">{startIndex + 1}</strong>–<strong className="font-bold text-slate-900">{endIndex}</strong> of <strong className="font-bold text-slate-900">{filteredRecords.length}</strong> visitor logs
                    {filteredRecords.length !== records.length && (
                      <span className="text-slate-400 font-normal ml-1">
                        (filtered from {records.length} total)
                      </span>
                    )}
                  </span>
                  <div className="h-4 w-px bg-slate-300 hidden sm:block" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Per page:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-sm"
                    >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={200}>200</option>
                    </select>
                  </div>
                </div>

                {/* Page Navigation Controls */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={safeCurrentPage === 1}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                    title="First Page"
                  >
                    First
                  </button>

                  <button
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm active:scale-95"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>

                  {/* Page Numbers */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => page === 1 || page === totalPages || Math.abs(page - safeCurrentPage) <= 1)
                        .map((page, idx, arr) => {
                          const prevPage = arr[idx - 1];
                          const showEllipsis = prevPage && page - prevPage > 1;
                          return (
                            <div key={page} className="flex items-center gap-1">
                              {showEllipsis && <span className="text-slate-400 text-xs px-1">...</span>}
                              <button
                                onClick={() => handlePageChange(page)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center ${
                                  safeCurrentPage === page
                                    ? 'bg-amber-500 text-slate-900 font-extrabold shadow-amber-500/20 ring-2 ring-amber-400'
                                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {page}
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  <button
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm active:scale-95"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={safeCurrentPage === totalPages}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                    title="Last Page"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: IP-WISE HIT BREAKDOWN */}
      {activeTab === 'ip-ranking' && (
        <div className="space-y-6">
          {/* Active Date Filter Banner if set */}
          {selectedDate && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                <Calendar className="h-4 w-4 text-amber-600" />
                <span>Aggregating IP hits exclusively for date: <strong>{selectedDate}</strong></span>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-200/60 px-2 py-1 rounded"
              >
                <X className="h-3 w-3" /> Clear Date Filter (Show All Dates)
              </button>
            </div>
          )}

          {/* IP Ranking Quick Stats / KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Unique IPs Tracked</span>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{filteredIpStats.length}</div>
              <p className="text-xs text-slate-400 mt-1">
                {selectedDate ? `On ${selectedDate}` : 'Across all loaded records'}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200 bg-gradient-to-br from-white to-amber-50/30 shadow-sm">
              <div className="flex items-center justify-between text-amber-700 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-amber-600" /> Top Hitting IP
                </span>
                <Sparkles className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-lg font-bold text-slate-900 font-mono truncate" title={filteredIpStats[0]?.ip || 'None'}>
                {filteredIpStats[0]?.ip || '—'}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-800 font-medium mt-1">
                <span className="font-extrabold text-amber-950">{filteredIpStats[0]?.totalHits || 0} hits</span>
                {totalHitsInIpView > 0 && filteredIpStats[0] && (
                  <span className="text-[11px] text-amber-700">
                    ({Math.round((filteredIpStats[0].totalHits / totalHitsInIpView) * 100)}% of traffic)
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Repeat Visitors</span>
                <Activity className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{repeatVisitorsCount}</div>
              <p className="text-xs text-slate-500 mt-1">
                {filteredIpStats.length > 0 
                  ? `${Math.round((repeatVisitorsCount / filteredIpStats.length) * 100)}% return with > 1 hit`
                  : '0%'}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/30 shadow-sm">
              <div className="flex items-center justify-between text-purple-700 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Target className="h-3.5 w-3.5 text-purple-600" /> Total Hits In View
                </span>
                <Globe className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-950">{totalHitsInIpView}</div>
              <p className="text-xs text-purple-700 mt-1">
                Avg {(totalHitsInIpView / Math.max(1, filteredIpStats.length)).toFixed(1)} hits per IP
              </p>
            </div>
          </div>

          {/* IP Table Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div id="ip-hits-section" className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-500" />
                  IP-Wise Traffic Breakdown & Frequency ({filteredIpStats.length} Unique IPs)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ranked by volume of requests generated per IP address with full geo and campaign attribution
                </p>
              </div>

              {/* IP Table Search & Sorting Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search in IP Table */}
                <div className="relative min-w-[200px] sm:min-w-[240px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search IP, city, ISP..."
                    value={ipSearchQuery}
                    onChange={(e) => setIpSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  {ipSearchQuery && (
                    <button
                      onClick={() => setIpSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Sort IP Table */}
                <select
                  value={ipTableSort}
                  onChange={(e) => setIpTableSort(e.target.value as any)}
                  className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-xs"
                >
                  <option value="hits_desc">🔥 Most Hits (High → Low)</option>
                  <option value="hits_asc">❄️ Fewest Hits (Low → High)</option>
                  <option value="ads_desc">🎯 Most Paid Ad Hits</option>
                  <option value="recent">🕒 Recently Active</option>
                  <option value="ip_asc">🌐 IP Address (A → Z)</option>
                </select>

                {/* Download IP Excel */}
                <button
                  onClick={handleExportIpBreakdownExcel}
                  disabled={exportingExcel || filteredIpStats.length === 0}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50 shadow-xs"
                  title="Download IP hit ranking to Excel (.xlsx)"
                >
                  <Download className="h-3.5 w-3.5 text-white" />
                  <span>Export IP Excel</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 text-center w-14">Rank</th>
                    <th className="py-3 px-4">IP Address & Network</th>
                    <th className="py-3 px-4 text-center">Hits Generated</th>
                    <th className="py-3 px-4">Traffic Type (Ads / Direct)</th>
                    <th className="py-3 px-4">Locality</th>
                    <th className="py-3 px-4">Device & OS</th>
                    <th className="py-3 px-4">Top Visited Page</th>
                    <th className="py-3 px-4">Last Active</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredIpStats.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                        <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        No IP records found matching current search.
                      </td>
                    </tr>
                  ) : (
                    paginatedIpStats.map((item, index) => {
                      const absoluteRank = ipStartIndex + index + 1;
                      const percentOfMax = Math.max(Math.round((item.totalHits / maxHitsInIpView) * 100), 4);
                      const percentOfTotal = totalHitsInIpView > 0 ? ((item.totalHits / totalHitsInIpView) * 100).toFixed(1) : '0';

                      return (
                        <tr key={item.ip} className="hover:bg-slate-50/80 transition">
                          {/* Rank */}
                          <td className="py-3.5 px-3 text-center">
                            {absoluteRank === 1 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-xs">
                                🥇 1
                              </span>
                            ) : absoluteRank === 2 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-bold text-xs">
                                🥈 2
                              </span>
                            ) : absoluteRank === 3 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-200 text-amber-900 font-bold text-xs">
                                🥉 3
                              </span>
                            ) : (
                              <span className="text-xs font-semibold text-slate-500">
                                #{absoluteRank}
                              </span>
                            )}
                          </td>

                          {/* IP Address & ISP */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {item.ip}
                              </span>
                              <button
                                onClick={() => copyToClipboard(item.ip)}
                                className="text-slate-400 hover:text-slate-700 p-0.5"
                                title="Copy IP"
                              >
                                {copiedIp === item.ip ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                              </button>
                            </div>
                            {item.isp && (
                              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                                <Wifi className="h-2.5 w-2.5 text-slate-400" />
                                <span className="truncate max-w-[180px]">{item.isp}</span>
                              </div>
                            )}
                          </td>

                          {/* Hits Generated */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-mono text-xs font-black shadow-xs ${
                                item.totalHits >= 10
                                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                                  : item.totalHits > 1
                                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {item.totalHits > 1 && <TrendingUp className="h-3 w-3 text-current" />}
                                {item.totalHits} {item.totalHits === 1 ? 'Hit' : 'Hits'}
                              </span>

                              {/* Hit Frequency Percentage Bar */}
                              <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1.5" title={`${percentOfTotal}% of all hits`}>
                                <div
                                  className={`h-full ${item.totalHits >= 10 ? 'bg-amber-500' : 'bg-blue-500'}`}
                                  style={{ width: `${percentOfMax}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                                {percentOfTotal}% traffic
                              </span>
                            </div>
                          </td>

                          {/* Traffic Origin */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1 text-xs">
                              {item.adHits > 0 && (
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded font-bold text-[11px]">
                                  <Target className="h-2.5 w-2.5 text-purple-600" />
                                  <span>{item.adHits} Paid Ads</span>
                                </div>
                              )}
                              {item.organicHits > 0 && (
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 rounded font-medium text-[11px] ml-1">
                                  <Search className="h-2.5 w-2.5 text-sky-600" />
                                  <span>{item.organicHits} Organic</span>
                                </div>
                              )}
                              {item.directHits > 0 && (
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded font-medium text-[11px] ml-1">
                                  <Link2 className="h-2.5 w-2.5 text-slate-500" />
                                  <span>{item.directHits} Direct</span>
                                </div>
                              )}
                              {item.campaigns.length > 0 && (
                                <div className="text-[10px] text-purple-700 font-semibold truncate max-w-[160px]">
                                  Campaign: {item.campaigns.join(', ')}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Locality */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                              <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                              <span>{[item.city, item.region, item.country].filter(Boolean).join(', ') || 'Unknown Locality'}</span>
                            </div>
                            {item.mapLink && (
                              <a
                                href={item.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline mt-0.5"
                              >
                                <ExternalLink className="h-2.5 w-2.5" />
                                View Map
                              </a>
                            )}
                          </td>

                          {/* Device & OS */}
                          <td className="py-3.5 px-4 text-xs text-slate-600">
                            <div className="flex flex-wrap items-center gap-1">
                              {item.devices.map((dev, i) => (
                                <span key={i} className="px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                                  {dev}
                                </span>
                              ))}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1 truncate max-w-[140px]">
                              {item.browsers.join(', ') || 'Browser'}
                            </div>
                          </td>

                          {/* Top Landing Page */}
                          <td className="py-3.5 px-4">
                            <code className="text-xs font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded truncate max-w-[140px] inline-block">
                              {item.topLandingPage}
                            </code>
                          </td>

                          {/* Last Active */}
                          <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                            <div className="font-semibold text-slate-800">
                              {formatDistanceToNow(new Date(item.lastSeen), { addSuffix: true })}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {format(new Date(item.lastSeen), 'MMM d, hh:mm a')}
                            </div>
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSearchQuery(item.ip);
                                setActiveTab('stream');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-md transition shadow-xs"
                              title={`View all ${item.totalHits} requests made by this IP`}
                            >
                              <span>Inspect Hits</span>
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination for IP Breakdown */}
            {filteredIpStats.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3.5 border-t border-slate-200 bg-slate-50/70 gap-4">
                <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                  <span>
                    Showing <strong className="font-bold text-slate-900">{ipStartIndex + 1}</strong>–<strong className="font-bold text-slate-900">{ipEndIndex}</strong> of <strong className="font-bold text-slate-900">{filteredIpStats.length}</strong> unique IPs
                  </span>
                  <div className="h-4 w-px bg-slate-300 hidden sm:block" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Per page:</span>
                    <select
                      value={ipItemsPerPage}
                      onChange={(e) => setIpItemsPerPage(Number(e.target.value))}
                      className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-sm"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                {/* Page Navigation Controls */}
                {ipTotalPages > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleIpPageChange(ipSafeCurrentPage - 1)}
                      disabled={ipSafeCurrentPage === 1}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Previous
                    </button>
                    <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                      {ipSafeCurrentPage} / {ipTotalPages}
                    </span>
                    <button
                      onClick={() => handleIpPageChange(ipSafeCurrentPage + 1)}
                      disabled={ipSafeCurrentPage === ipTotalPages}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                    >
                      Next <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DAY-WISE BREAKDOWN & TREND CHART */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* Daily Interactive Chart Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-amber-500" />
                  Daily Traffic Timeline (Total Hits vs Unique Visitors)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click on any day bar to filter and view all visitor logs and ad hits for that date
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg self-start">
                {[7, 14, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => setDateRangeDays(days)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                      dateRangeDays === days
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Last {days}d
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Bar Chart Visualization */}
            {chartDays.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No traffic data recorded in this period.
              </div>
            ) : (
              <div className="pt-4">
                <div className="h-48 flex items-end gap-2 sm:gap-4 border-b border-slate-200 pb-2 overflow-x-auto">
                  {chartDays.map((day) => {
                    const hitHeightPercent = Math.max((day.totalHits / maxHitsInChart) * 100, 6);
                    const uniqueHeightPercent = Math.max((day.uniqueIps / maxHitsInChart) * 100, 4);
                    const isSelected = selectedDate === day.dateKey;

                    return (
                      <div
                        key={day.dateKey}
                        onClick={() => {
                          setSelectedDate(isSelected ? null : day.dateKey);
                          setActiveTab('stream');
                        }}
                        className={`flex-1 min-w-[40px] flex flex-col items-center justify-end h-full group cursor-pointer transition-all ${
                          isSelected ? 'opacity-100 scale-105' : 'hover:opacity-90'
                        }`}
                        title={`${day.dayLabel}: ${day.totalHits} Hits, ${day.adCount} from Ads, ${day.uniqueIps} Unique IPs`}
                      >
                        {/* Bars container */}
                        <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-full">
                          {/* Hits Bar */}
                          <div
                            style={{ height: `${hitHeightPercent}%` }}
                            className={`w-3 rounded-t-md transition-all ${
                              isSelected
                                ? 'bg-amber-600 ring-2 ring-amber-400'
                                : day.isToday
                                ? 'bg-amber-500 group-hover:bg-amber-600'
                                : 'bg-slate-800 group-hover:bg-slate-900'
                            }`}
                          />
                          {/* Unique IPs Bar */}
                          <div
                            style={{ height: `${uniqueHeightPercent}%` }}
                            className="w-3 rounded-t-md bg-emerald-500/80 group-hover:bg-emerald-600 transition-all"
                          />
                        </div>

                        {/* Date label */}
                        <span className={`text-[10px] mt-2 whitespace-nowrap font-medium ${
                          day.isToday ? 'font-bold text-amber-600' : 'text-slate-500'
                        }`}>
                          {format(new Date(day.dateKey + 'T00:00:00'), 'MMM d')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Chart Legend */}
                <div className="flex items-center justify-end gap-4 pt-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-slate-800 inline-block" />
                    <span>Total Hits</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
                    <span>Today&apos;s Hits</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                    <span>Unique Visitors (IPs)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Day-Wise Data Table with Ad Attribution */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Day-by-Day Traffic Breakdown (Ads vs Direct)
                </h3>
                <p className="text-xs text-slate-400">
                  Daily aggregates of visits, ad clicks, unique users, top cities, and landing pages
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportDailySummaryExcel}
                  disabled={exportingExcel || dailyStatsList.length === 0}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg transition disabled:opacity-50"
                  title="Export Day-Wise Summary to Excel"
                >
                  <Download className="h-3 w-3 text-emerald-700" />
                  <span>Download Day-Wise Excel</span>
                </button>
              </div>

              {selectedDate && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">
                    Filtered to <strong>{selectedDate}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500 text-xs flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> Clear
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-center">Total Hits</th>
                    <th className="py-3 px-4 text-center">Unique Users</th>
                    <th className="py-3 px-4">Traffic Origin</th>
                    <th className="py-3 px-4">Top Locality</th>
                    <th className="py-3 px-4">Device Split</th>
                    <th className="py-3 px-4">Top Landing Page</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dailyStatsList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                        No traffic logged yet.
                      </td>
                    </tr>
                  ) : (
                    dailyStatsList.map((day) => (
                      <tr 
                        key={day.dateKey}
                        className={`hover:bg-slate-50/80 transition cursor-pointer ${
                          selectedDate === day.dateKey ? 'bg-amber-50/60 font-medium' : ''
                        }`}
                      >
                        {/* Date */}
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span>{day.dayLabel}</span>
                            {day.isToday && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                LIVE TODAY
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-normal">
                            {day.formattedDate}
                          </span>
                        </td>

                        {/* Total Hits */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2.5 py-1 bg-slate-900 text-white font-mono font-bold text-xs rounded-md">
                            {day.totalHits}
                          </span>
                        </td>

                        {/* Unique IPs */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold text-xs rounded-md">
                            {day.uniqueIps}
                          </span>
                        </td>

                        {/* Traffic Origin: Ads vs Direct */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2 text-xs">
                            {day.adCount > 0 ? (
                              <span className="inline-flex items-center gap-1 font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                                <Target className="h-3 w-3" />
                                {day.adCount} Ads
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs">0 Ads</span>
                            )}
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-600">
                              {day.organicCount + day.directCount} Direct/Search
                            </span>
                          </div>
                        </td>

                        {/* Top Locality */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 font-medium text-slate-800">
                            <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                            {day.topCity}
                            {day.topCityCount > 0 && (
                              <span className="text-[11px] text-slate-400 font-normal">
                                ({day.topCityCount})
                              </span>
                            )}
                          </span>
                        </td>

                        {/* Device Split */}
                        <td className="py-3.5 px-4 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <span>📱 {day.mobilePercent}%</span>
                            <span className="text-slate-300">•</span>
                            <span>💻 {100 - day.mobilePercent}%</span>
                          </div>
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                            <div 
                              className="h-full bg-amber-500" 
                              style={{ width: `${day.mobilePercent}%` }} 
                            />
                          </div>
                        </td>

                        {/* Top Page */}
                        <td className="py-3.5 px-4">
                          <code className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono truncate max-w-[150px] inline-block">
                            {day.topPage}
                          </code>
                        </td>

                        {/* Action: Drilldown */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDate(day.dateKey);
                              setActiveTab('stream');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-md transition shadow-sm"
                          >
                            Inspect Day
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
