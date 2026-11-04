"use client";

import { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory, updateCategory } from '@/app/actions/categories';

interface Category {
  id: number;
  name: string;
  createdAt: Date;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await getCategories();
    if (res.success && res.data) {
      setCategories(res.data as Category[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setSaving(true);
    setMessage(null);
    const res = await createCategory(newCategory);
    setSaving(false);

    if (res.success) {
      setNewCategory("");
      setMessage({ type: 'success', text: 'Category added successfully.' });
      fetchCategories();
    } else {
      setMessage({ type: 'error', text: res.error || 'An error occurred.' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editingName.trim()) return;

    setSaving(true);
    setMessage(null);
    const res = await updateCategory(editingId, editingName);
    setSaving(false);

    if (res.success) {
      setEditingId(null);
      setEditingName("");
      setMessage({ type: 'success', text: 'Category updated successfully.' });
      fetchCategories();
    } else {
      setMessage({ type: 'error', text: res.error || 'An error occurred.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category? (Randevu formundaki listeden kaldırılacak)")) return;
    
    setSaving(true);
    setMessage(null);
    const res = await deleteCategory(id);
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Category deleted successfully.' });
      fetchCategories();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to delete category.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {message && (
        <div className={`p-4 border text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-stone-900 font-bold">Category Management</h1>
          <p className="text-xs text-stone-500 mt-1">Randevu formundaki terapi alanlarını yönetin.</p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-sm rounded">
        <h2 className="text-xl font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">
          Add New Category
        </h2>
        <form className="flex gap-4" onSubmit={handleAdd}>
          <input 
            type="text" 
            required
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 bg-stone-50 border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-700 rounded" 
            placeholder="e.g. Wooden Houses" 
            disabled={saving}
          />
          <button 
            type="submit" 
            disabled={saving || !newCategory.trim()}
            className="px-8 py-3 bg-stone-900 text-white font-bold text-sm uppercase tracking-wider rounded hover:bg-amber-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {saving ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>

      <div className="bg-white border border-stone-200 shadow-sm overflow-x-auto rounded">
        {loading ? (
          <div className="text-center py-10 text-stone-500">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-10 text-stone-500">No categories found yet.</div>
        ) : (
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50 text-stone-900 uppercase tracking-wider font-bold border-b border-stone-200">
              <tr>
                <th className="px-6 py-4 w-2/3">Category Name</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-stone-900">
                    {editingId === cat.id ? (
                      <form onSubmit={handleUpdate} className="flex gap-2">
                        <input
                          type="text"
                          required
                          autoFocus
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 bg-white border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-700 rounded"
                        />
                        <button type="submit" disabled={saving} className="px-4 py-2 bg-stone-900 text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-amber-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
                        <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 bg-stone-200 text-stone-700 text-xs rounded hover:bg-stone-300">Cancel</button>
                      </form>
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap space-x-3">
                    {editingId !== cat.id && (
                      <>
                        <button 
                          onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }}
                          className="text-amber-700 hover:text-amber-900 font-medium cursor-pointer"
                          disabled={saving}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                          disabled={saving}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

