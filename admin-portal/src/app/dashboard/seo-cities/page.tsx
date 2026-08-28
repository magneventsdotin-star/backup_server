"use client";
import { useState, useEffect, useCallback } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Plus, Loader2, Globe, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@database/connection/supabase-admin';
import { useToast } from '@/hooks/use-toast';
import { useConfirm } from '@/components/ui/ConfirmProvider';

export default function SeoCities() {
  const { confirmAction } = useConfirm();
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const { toast } = useToast();

  const fetchCities = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase.from('seo_cities') as any).select('*').order('name');
      if (error) {
        if (error.code === '42P01') {
          console.warn('Table seo_cities does not exist yet.');
          setCities([]);
        } else {
          throw error;
        }
      } else {
        setCities(data || []);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const handleAddCity = async () => {
    if (!newCityName.trim()) return;
    try {
      const slug = newCityName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const { error } = await (supabase.from('seo_cities') as any).insert([{
        name: newCityName,
        slug,
        is_active: true
      }]);
      if (error) throw error;
      toast({ title: 'Added', description: 'City added successfully.' });
      setNewCityName('');
      setIsAdding(false);
      fetchCities();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      await (supabase.from('seo_cities') as any).update({ is_active: !current }).eq('id', id);
      fetchCities();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!await confirmAction('Admin Verification Required', 'Delete this city and all its blogs?', 'danger')) return;
    try {
      await (supabase.from('seo_cities') as any).delete().eq('id', id);
      toast({ title: 'Deleted', description: 'City removed.' });
      fetchCities();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0">
        <div className="section-header">
          <span className="section-label">SEO Engine</span>
          <h1 className="section-title text-slate-900">SEO Cities</h1>
          <p className="text-body mt-1 max-w-2xl font-medium">Manage cities for targeted SEO landing pages.</p>
        </div>
        <button
          className="w-full sm:w-auto h-11 px-6 rounded-xl bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-all font-bold text-[12px] uppercase tracking-wider flex items-center justify-center gap-2"
          onClick={() => setIsAdding(true)}
        >
          <Plus size={16} strokeWidth={3} />
          Add City
        </button>
      </div>

      {isAdding && (
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <input 
            type="text" 
            placeholder="City Name (e.g., Delhi)" 
            className="flex-1 h-10 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
            value={newCityName}
            onChange={(e) => setNewCityName(e.target.value)}
          />
          <button onClick={handleAddCity} className="h-10 px-6 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700">Save</button>
          <button onClick={() => setIsAdding(false)} className="h-10 px-6 rounded-lg border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50">Cancel</button>
        </div>
      )}

      <div className="luxe-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="pl-8 text-[11px] font-bold uppercase text-slate-500 w-[50%]">City</TableHead>
                <TableHead className="text-center text-[11px] font-bold uppercase text-slate-500 w-[25%]">Status</TableHead>
                <TableHead className="pr-8 text-center text-[11px] font-bold uppercase text-slate-500 w-[25%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} className="h-32 text-center"><Loader2 className="mx-auto animate-spin text-slate-300" /></TableCell></TableRow>
              ) : cities.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="h-32 text-center text-slate-400 font-medium">No cities added yet.</TableCell></TableRow>
              ) : (
                cities.map((city) => (
                  <TableRow key={city.id} className="hover:bg-slate-50/50">
                    <TableCell className="pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <Globe size={18} className="text-indigo-400" />
                        <div>
                          <p className="font-bold text-slate-900">{city.name}</p>
                          <p className="text-[11px] text-slate-400">/{city.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => toggleStatus(city.id, city.is_active)} className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${city.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        {city.is_active ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {city.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </TableCell>
                    <TableCell className="pr-8 text-center">
                       <button onClick={() => handleDelete(city.id)} className="p-2 text-slate-400 hover:text-rose-500 bg-white border border-slate-100 rounded-lg shadow-sm">
                          <Trash2 size={16} />
                       </button>
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
