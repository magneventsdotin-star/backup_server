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
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { formatDistanceToNow, format, isToday as checkIsToday, isYesterday as checkIsYesterday } from 'date-fns';

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
  topCity: string;
  topCityCount: number;
  mobilePercent: number;
  topPage: string;
  topSource: string;
  records: AnalyticsRecord[];
}

export default function AnalyticsPage() {
  const [records, setRecords] = useState<AnalyticsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dateRangeDays, setDateRangeDays] = useState<number>(14);
  const [activeTab, setActiveTab] = useState<'daily' | 'stream'>('daily');
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRecords = async (showToast = false) => {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300);

      if (error) throw error;
      setRecords(data || []);
      if (showToast) {
        toast({ title: 'Refreshed', description: `Loaded ${data?.length || 0} recent visitor events.` });
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

  // Helper to safely extract record data
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
    const trafficSource = user.trafficSource || (record.referrer ? 'Referral' : 'Direct');
    const isBot = user.isBot || false;

    const createdAtDate = new Date(record.created_at);
    const dateKey = !isNaN(createdAtDate.getTime()) ? createdAtDate.toISOString().split('T')[0] : '';

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
      trafficSource,
      isBot,
      dateKey,
      createdAtDate
    };
  };

  // 1. Group records day-wise
  const dailyStatsList: DailyStats[] = useMemo(() => {
    const groups: Record<string, AnalyticsRecord[]> = {};

    records.forEach((r) => {
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

      // Top City
      const cityCounts: Record<string, number> = {};
      let mobileCount = 0;
      const pageCounts: Record<string, number> = {};
      const sourceCounts: Record<string, number> = {};

      dayRecords.forEach((r) => {
        const d = getRecordData(r);
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

      const mobilePercent = totalHits > 0 ? Math.round((mobileCount / totalHits) * 100) : 0;

      return {
        dateKey,
        formattedDate: format(sampleDate, 'MMMM d, yyyy'),
        dayLabel,
        isToday,
        isYesterday,
        totalHits,
        uniqueIps,
        topCity,
        topCityCount,
        mobilePercent,
        topPage,
        topSource,
        records: dayRecords
      };
    });
  }, [records]);

  // Filtered by dateRangeDays for the chart
  const chartDays = useMemo(() => {
    return dailyStatsList.slice(0, dateRangeDays).reverse();
  }, [dailyStatsList, dateRangeDays]);

  const maxHitsInChart = useMemo(() => {
    return Math.max(...chartDays.map((d) => d.totalHits), 1);
  }, [chartDays]);

  // 2. Filtered records for the visitor log stream
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
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
        r.path.toLowerCase().includes(q)
      );
    });
  }, [records, searchQuery, deviceFilter, selectedDate]);

  // Overall summary metrics
  const stats = useMemo(() => {
    const totalHits = records.length;
    const uniqueIps = new Set(records.map((r) => r.ip_address || r.details?.ip || r.ip_hash)).size;
    const todayStats = dailyStatsList.find((d) => d.isToday);
    const yesterdayStats = dailyStatsList.find((d) => d.isYesterday);

    return {
      totalHits,
      uniqueIps,
      todayHits: todayStats?.totalHits || 0,
      todayUnique: todayStats?.uniqueIps || 0,
      todayTopCity: todayStats?.topCity || '—',
      yesterdayHits: yesterdayStats?.totalHits || 0
    };
  }, [records, dailyStatsList]);

  // Export Daily Summary as CSV
  const exportCsv = () => {
    const headers = ['Date', 'Total Hits', 'Unique Visitors', 'Top City', 'Mobile %', 'Top Page', 'Top Source'];
    const rows = dailyStatsList.map((d) => [
      d.formattedDate,
      d.totalHits,
      d.uniqueIps,
      `"${d.topCity}"`,
      `${d.mobilePercent}%`,
      `"${d.topPage}"`,
      `"${d.topSource}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `magnevents_daily_traffic_${format(new Date(), 'yyyy-MM-dd')}.csv`);
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
            Visitor Intelligence & Day-by-Day Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time IP extraction, locality (city/region/country), and daily visitor trends
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

          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition shadow-sm"
            title="Download Day-wise CSV"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export CSV
          </button>

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

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Hits */}
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

        {/* Unique Visitors */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Unique Visitors</span>
            <Users className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.uniqueIps}</div>
          <p className="text-xs text-slate-400 mt-1">Across all logged days</p>
        </div>

        {/* Top Locality Today */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Top Locality (Today)</span>
            <MapPin className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 truncate" title={stats.todayTopCity}>
            {stats.todayTopCity}
          </div>
          <p className="text-xs text-slate-400 mt-1">Primary traffic region</p>
        </div>

        {/* Total Hits Recorded */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Hits Logged</span>
            <Eye className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalHits}</div>
          <p className="text-xs text-slate-400 mt-1">Total page view events</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
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
      </div>

      {/* TAB 1: DAY-WISE BREAKDOWN & TREND CHART */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* Daily Interactive Chart Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-amber-500" />
                  Daily Traffic Timeline (Page Hits vs Unique Visitors)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click on any day bar to filter and inspect all visitor logs for that date
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
                        title={`${day.dayLabel}: ${day.totalHits} Hits, ${day.uniqueIps} Unique IPs`}
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

          {/* Day-Wise Data Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Day-by-Day Traffic Breakdown
                </h3>
                <p className="text-xs text-slate-400">
                  Daily aggregates of visits, unique users, top cities, and landing pages
                </p>
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
                    <th className="py-3 px-4 text-center">Hits</th>
                    <th className="py-3 px-4 text-center">Unique Visitors</th>
                    <th className="py-3 px-4">Top Locality</th>
                    <th className="py-3 px-4">Device Split</th>
                    <th className="py-3 px-4">Top Landing Page</th>
                    <th className="py-3 px-4">Primary Source</th>
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
                          {/* Progress bar */}
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

                        {/* Top Source */}
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                          {day.topSource}
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

      {/* TAB 2: LIVE VISITOR STREAM */}
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

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by IP, City, Region, Country, Path, Browser..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
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

              {/* Day Selector dropdown */}
              <select
                value={selectedDate || ''}
                onChange={(e) => setSelectedDate(e.target.value || null)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">All Days</option>
                {dailyStatsList.map((d) => (
                  <option key={d.dateKey} value={d.dateKey}>
                    {d.dayLabel} ({d.totalHits} hits)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Visitor List Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Visitor Hits ({filteredRecords.length})
              </span>
              <span className="text-xs text-slate-400">
                Latest extracted logs
              </span>
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
                {filteredRecords.map((record) => {
                  const data = getRecordData(record);
                  const isExpanded = expandedId === record.id;

                  return (
                    <div key={record.id} className="p-4 hover:bg-slate-50/80 transition">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Left: IP & Locality */}
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

                            {/* ISP */}
                            {data.isp && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                <Wifi className="h-2.5 w-2.5 text-slate-400" />
                                {data.isp}
                              </span>
                            )}
                          </div>

                          {/* Visited URL & Source */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                            <span className="font-semibold text-slate-800 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-mono">
                              {record.path || '/'}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span>Source: <strong className="text-slate-700">{data.trafficSource}</strong></span>
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
          </div>
        </div>
      )}
    </div>
  );
}
