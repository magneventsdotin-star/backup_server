"use client";
import { useConfirm } from '@/components/ui/ConfirmProvider';

import { useState, useEffect, useCallback } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Plus, Loader2, FileText, Pencil, Trash2, Image as ImageIcon, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@database/connection/supabase-admin';
import { useToast } from '@/hooks/use-toast';
import { BlogEditorModal } from '@/components/blog/BlogEditorModal';

export default function BlogManagement() {
  const { confirmAction } = useConfirm();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const { toast } = useToast();

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase.from('blogs') as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01' || error.message?.includes('find the table') || error.code?.startsWith('PGRST')) {
          console.warn('Table blogs does not exist yet.');
          setBlogs([]);
        } else {
          throw error;
        }
      } else {
        setBlogs(data || []);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      const { error } = await (supabase.from('blogs') as any).update({ is_published: !current }).eq('id', id);
      if (error) throw error;
      fetchBlogs();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update status.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!await confirmAction('Admin Verification Required', 'Are you sure you want to delete this blog post?', 'danger')) return;
    try {
      const { error } = await (supabase.from('blogs') as any).delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Blog post has been removed.' });
      fetchBlogs();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleSavePost = async (data: any) => {
    try {
      // Create a slug from title if not editing
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      if (editingPost) {
        const { error } = await (supabase.from('blogs') as any).update({
          title: data.title,
          subtitle: data.subtitle,
          image_url: data.image_url,
          content: data.content,
          slug: editingPost.slug || slug
        }).eq('id', editingPost.id);
        
        if (error) throw error;
        toast({ title: 'Updated', description: 'Blog post updated successfully.' });
      } else {
        const { error } = await (supabase.from('blogs') as any).insert([{
          title: data.title,
          subtitle: data.subtitle,
          image_url: data.image_url,
          content: data.content,
          slug,
          is_published: true
        }]);
        
        if (error) throw error;
        toast({ title: 'Created', description: 'New blog post created.' });
      }
      
      fetchBlogs();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      throw error;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0">
        <div className="section-header">
          <span className="section-label">Content Management</span>
          <h1 className="section-title text-slate-900">
            Blog Posts
          </h1>
          <p className="text-body mt-1 max-w-2xl font-medium">Manage main blog posts that appear on the user-facing website.</p>
        </div>
        <button
          className="w-full sm:w-auto h-11 px-6 rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-200/50 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-[12px] uppercase tracking-wider flex items-center justify-center gap-2"
          onClick={() => { setEditingPost(null); setIsModalOpen(true); }}
        >
          <Plus size={16} strokeWidth={3} />
          Create Blog Post
        </button>
      </div>

      <div className="luxe-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="pl-8 h-14 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-[40%]">Blog Content</TableHead>
                <TableHead className="h-14 text-center text-[11px] font-bold uppercase tracking-widest text-slate-500 w-[15%]">Status</TableHead>
                <TableHead className="h-14 pr-8 text-center text-[11px] font-bold uppercase tracking-widest text-slate-500 w-[25%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-64 text-center">
                     <Loader2 className="h-8 w-8 animate-spin text-slate-200 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-64 text-center">
                     <div className="opacity-40">
                        <FileText size={32} className="mx-auto mb-2" />
                        <p className="font-bold text-slate-400">No blog posts found</p>
                     </div>
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-12 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0 flex items-center justify-center">
                           {blog.image_url || blog.img ? (
                             <img src={blog.image_url || blog.img} className="w-full h-full object-cover" />
                           ) : (
                             <ImageIcon size={16} className="text-slate-300"  />
                           )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-[14px]">{blog.title}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{blog.subtitle}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${blog.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {blog.is_published ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                          {blog.is_published ? 'Published' : 'Draft'}
                        </span>
                        
                        <button
                          onClick={() => toggleStatus(blog.id, blog.is_published)}
                          className={`inline-flex items-center justify-center w-24 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm ${
                            blog.is_published 
                              ? 'bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50' 
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
                          }`}
                        >
                          {blog.is_published ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="pr-8">
                       <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => window.open(`https://magnevents.in/blog-post/${blog.slug || blog.id}`, '_blank')}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-100 hover:border-indigo-600 hover:text-indigo-600 text-slate-400 transition-colors shadow-sm"
                            title="View on site"
                          >
                             <ExternalLink size={14} />
                          </button>
                          <button 
                            onClick={() => { setEditingPost(blog); setIsModalOpen(true); }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors bg-white border border-slate-100 shadow-sm"
                          >
                             <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors bg-white border border-slate-100 shadow-sm"
                          >
                             <Trash2 size={14} />
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

      <BlogEditorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSavePost} 
        initialData={editingPost} 
      />
    </div>
  );
}
