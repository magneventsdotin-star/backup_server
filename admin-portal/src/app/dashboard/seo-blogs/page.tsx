"use client";
import { useState, useEffect, useCallback } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Loader2, FileText, Wand2, Trash2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@database/connection/supabase-admin';
import { useToast } from '@/hooks/use-toast';
import { useConfirm } from '@/components/ui/ConfirmProvider';

export default function SeoBlogs() {
  const { confirmAction } = useConfirm();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const fetchCities = async () => {
    try {
      const { data } = await (supabase.from('seo_cities') as any).select('id, name').order('name');
      setCities(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      let query = (supabase.from('seo_blogs') as any).select('*, seo_cities(name, slug)').order('created_at', { ascending: false });
      if (selectedCityId !== 'all') {
        query = query.eq('city_id', selectedCityId);
      }
      const { data, error } = await query;
      if (error && error.code !== '42P01') throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching seo blogs:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCityId]);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await (supabase.from('seo_blogs') as any).update({ status: newStatus }).eq('id', id);
      fetchBlogs();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!await confirmAction('Delete Confirmation', 'Are you sure you want to delete this SEO blog?', 'danger')) return;
    try {
      await (supabase.from('seo_blogs') as any).delete().eq('id', id);
      toast({ title: 'Deleted', description: 'SEO blog removed.' });
      fetchBlogs();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const generateBulkBlogs = async () => {
    if (selectedCityId === 'all') {
      toast({ variant: 'destructive', title: 'Select a City', description: 'Please select a specific city to generate blogs for.' });
      return;
    }
    const city = cities.find(c => c.id === selectedCityId);
    if (!await confirmAction('Generate Content', `Generate 10 AI SEO blogs for ${city?.name}? This may take a few minutes.`, 'default')) return;
    
    setGenerating(true);
    toast({ title: 'Generating...', description: 'Started AI generation for 10 blogs.' });
    
    try {
      const response = await fetch('/api/seo-engine/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityId: selectedCityId, count: 10 })
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to generate blogs');
      
      toast({ title: 'Success', description: `Successfully generated ${result.count || 10} blogs for ${city?.name}.` });
      fetchBlogs();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0">
        <div className="section-header">
          <span className="section-label">SEO Engine</span>
          <h1 className="section-title text-slate-900">Programmatic Blogs</h1>
          <p className="text-body mt-1 max-w-2xl font-medium">Manage AI-generated SEO blogs per city.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:outline-none focus:border-indigo-500 shadow-sm"
          >
            <option value="all">All Cities</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          
          <button
            onClick={generateBulkBlogs}
            disabled={generating || selectedCityId === 'all'}
            className="h-11 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
            Generate 10 Blogs
          </button>
        </div>
      </div>

      <div className="luxe-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="pl-8 text-[11px] font-bold uppercase text-slate-500 w-[40%]">Blog Info</TableHead>
                <TableHead className="text-center text-[11px] font-bold uppercase text-slate-500 w-[20%]">City</TableHead>
                <TableHead className="text-center text-[11px] font-bold uppercase text-slate-500 w-[20%]">Status</TableHead>
                <TableHead className="pr-8 text-center text-[11px] font-bold uppercase text-slate-500 w-[20%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="h-32 text-center"><Loader2 className="mx-auto animate-spin text-slate-300" /></TableCell></TableRow>
              ) : blogs.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="h-32 text-center text-slate-400 font-medium">No SEO blogs found. Select a city and generate some.</TableCell></TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id} className="hover:bg-slate-50/50">
                    <TableCell className="pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-violet-400 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 text-sm line-clamp-1" title={blog.title}>{blog.title}</p>
                          <p className="text-[11px] text-slate-400">/{blog.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold">
                        {blog.seo_cities?.name || 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => toggleStatus(blog.id, blog.status)} className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${blog.status === 'published' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>
                        {blog.status === 'published' ? <CheckCircle2 size={10} /> : <Loader2 size={10} className="opacity-50" />}
                        {blog.status}
                      </button>
                    </TableCell>
                    <TableCell className="pr-8 text-center">
                       <div className="flex items-center justify-center gap-2">
                          {blog.seo_cities?.slug ? (
                            <a 
                              href={`https://www.magnevents.in/city/${blog.seo_cities.slug}/blog/${blog.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-slate-400 hover:text-indigo-600 bg-white border border-slate-100 rounded-lg shadow-sm"
                              title="Preview Live Page"
                            >
                               <ExternalLink size={16} />
                            </a>
                          ) : (
                            <button 
                              className="p-2 text-slate-300 bg-slate-50 border border-slate-100 rounded-lg shadow-sm cursor-not-allowed"
                              title="Preview Unavailable"
                              disabled
                            >
                               <ExternalLink size={16} />
                            </button>
                          )}
                          <button onClick={() => handleDelete(blog.id)} className="p-2 text-slate-400 hover:text-rose-500 bg-white border border-slate-100 rounded-lg shadow-sm">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
