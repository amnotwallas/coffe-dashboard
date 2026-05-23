import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Plus, Edit2, Trash2, X, Coffee, Cookie, Croissant, 
  Loader2, Star, Flame, Info, ChevronDown, ChevronUp,
  Scale, Activity
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../services/api';
import { toast } from 'sonner';

interface Customization {
  tipo: string;
  opciones: {
    nombre: string;
    extra_precio: number;
    valor: any;
  }[];
}

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  intensidad: number;
  imagenes: string[];
  icon: string;
  categoria: {
    id: number;
    nombre: string;
  };
  ingredientes: string[];
  valores_nutricionales: {
    calorias: number;
    proteinas: number;
    grasas: number;
    carbohidratos: number;
  };
  personalizaciones: Customization[] | null;
  reviews_count: number;
  rating_avg: number;
  disponible: boolean;
}

export function CatalogView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '1',
    intensidad: '3',
    calorias: '0',
    proteinas: '0',
    grasas: '0',
    ingredientes: '',
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getProducts();
      setProducts(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio.toString(),
        categoria_id: product.categoria.id.toString(),
        intensidad: product.intensidad.toString(),
        calorias: product.valores_nutricionales.calorias.toString(),
        proteinas: product.valores_nutricionales.proteinas.toString(),
        grasas: product.valores_nutricionales.grasas.toString(),
        ingredientes: product.ingredientes.join(', '),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria_id: '1',
        intensidad: '3',
        calorias: '0',
        proteinas: '0',
        grasas: '0',
        ingredientes: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        category_id: parseInt(formData.categoria_id),
        intensidad: parseInt(formData.intensidad),
        ingredientes: formData.ingredientes.split(',').map(i => i.trim()).filter(i => i !== ''),
        valores_nutricionales: {
          calorias: parseInt(formData.calorias),
          proteinas: parseFloat(formData.proteinas),
          grasas: parseFloat(formData.grasas),
          carbohidratos: 0
        },
        disponible: true,
        imagenes: ["https://the-casa-coffee-api.vercel.app//api/v1/media/products/espresso.png"]
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        toast.success('Producto actualizado');
      } else {
        await api.createProduct(payload);
        toast.success('Producto creado');
      }
      setIsDialogOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await api.deleteProduct(id);
      toast.success('Producto eliminado');
      fetchProducts();
    } catch (err: any) {
      toast.error('Error al eliminar');
    }
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.categoria.nombre)))];

  const filteredProducts = products.filter(p => 
    categoryFilter === 'all' || p.categoria.nombre === categoryFilter
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#482C20] tracking-tight">Catálogo</h1>
            <p className="text-muted-foreground mt-1 font-medium">Gestiona la carta de especialidad de Casa Chill</p>
          </div>
          <Button 
            onClick={() => handleOpenDialog()}
            className="bg-[#A78D7B] hover:bg-[#482C20] rounded-2xl px-6 h-12 shadow-lg shadow-[#A78D7B]/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Producto
          </Button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border/40 pb-8">
          {categories.map(cat => {
            const count = cat === 'all' ? products.length : products.filter(p => p.categoria.nombre === cat).length;
            const isActive = categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`flex items-center gap-3 px-7 py-3.5 rounded-2xl text-sm font-black transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#482C20] text-white shadow-xl shadow-[#482C20]/20 scale-105' 
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-[#482C20] hover:scale-102'
                }`}
              >
                {cat === 'all' ? 'Ver Todo' : cat}
                <span className={`px-2.5 py-1 rounded-lg text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-[#482C20]/10 text-[#482C20]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[450px] bg-muted animate-pulse rounded-[40px]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group"
              >
                <Card className="overflow-hidden border border-white/20 bg-card/80 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-500 rounded-[32px] group relative">
                  {/* Image Section */}
                  <div className="relative aspect-square overflow-hidden m-3 rounded-[24px]">
                    <img 
                      src={product.imagenes[0]} 
                      alt={product.nombre}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Glass Overlays */}
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-white/40 backdrop-blur-md border border-white/20">
                      <span className="text-[9px] font-black text-[#482C20] uppercase tracking-wider">
                        {product.categoria.nombre}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-white/40 backdrop-blur-md border border-white/20 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-black text-[#482C20]">{product.rating_avg}</span>
                    </div>
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button 
                        variant="secondary" 
                        size="icon"
                        className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-[#482C20] border-none shadow-lg"
                        onClick={(e) => { e.stopPropagation(); handleOpenDialog(product); }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        className="w-9 h-9 rounded-full bg-red-500/80 backdrop-blur-sm hover:bg-red-500 text-white border-none shadow-lg"
                        onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="px-5 pb-5 pt-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-[#482C20] font-black text-base leading-tight truncate">
                        {product.nombre}
                      </h3>
                      <span className="text-lg font-black text-[#A78D7B] tracking-tighter">${product.precio.toFixed(0)}</span>
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-snug mb-4 line-clamp-2 font-medium">
                      {product.descripcion}
                    </p>

                    {/* Expandable Details */}
                    <button 
                      onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
                      className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-[#A78D7B] hover:text-[#482C20] transition-colors border-y border-border/50 mb-4"
                    >
                      {expandedId === product.id ? (
                        <>Menos detalles <ChevronUp className="w-3 h-3" /></>
                      ) : (
                        <>Más detalles <ChevronDown className="w-3 h-3" /></>
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedId === product.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden space-y-6 pt-2"
                        >
                          <div className="grid grid-cols-4 gap-2">
                            <div className="bg-muted/40 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center border border-transparent">
                              <Flame className="w-3.5 h-3.5 text-orange-500 mb-1" />
                              <span className="text-[9px] font-bold text-foreground">{product.valores_nutricionales.calorias}</span>
                              <span className="text-[7px] text-muted-foreground uppercase font-black">Cal</span>
                            </div>
                            <div className="bg-muted/40 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center border border-transparent">
                              <Scale className="w-3.5 h-3.5 text-blue-500 mb-1" />
                              <span className="text-[9px] font-bold text-foreground">{product.valores_nutricionales.proteinas}g</span>
                              <span className="text-[7px] text-muted-foreground uppercase font-black">Prot</span>
                            </div>
                            <div className="bg-muted/40 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center border border-transparent">
                              <Activity className="w-3.5 h-3.5 text-emerald-500 mb-1" />
                              <span className="text-[9px] font-bold text-foreground">{product.valores_nutricionales.grasas}g</span>
                              <span className="text-[7px] text-muted-foreground uppercase font-black">Grasas</span>
                            </div>
                            <div className="bg-muted/40 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center border border-transparent">
                              <Coffee className="w-3.5 h-3.5 text-[#A78D7B] mb-1" />
                              <span className="text-[9px] font-bold text-foreground">{product.intensidad}/5</span>
                              <span className="text-[7px] text-muted-foreground uppercase font-black">Intens</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-2 block">Ingredientes Base</span>
                            <div className="flex flex-wrap gap-1.5">
                              {product.ingredientes.map(ing => (
                                <span key={ing} className="bg-muted px-2 py-0.5 rounded-md text-[10px] font-medium text-foreground border border-border/50">
                                  {ing}
                                </span>
                              ))}
                            </div>
                          </div>
                          {product.personalizaciones && (
                            <div>
                              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-2 block">Personalizaciones</span>
                              <div className="space-y-2">
                                {product.personalizaciones.map(p => (
                                  <div key={p.tipo} className="flex items-center justify-between text-[11px]">
                                    <span className="text-muted-foreground">{p.tipo}</span>
                                    <div className="flex gap-1">
                                      {p.opciones.map(opt => (
                                        <Badge key={opt.nombre} variant="secondary" className="text-[9px] px-1 py-0 h-4 font-normal">
                                          {opt.nombre} {opt.extra_precio > 0 && `+$${opt.extra_precio}`}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modernized Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-[#482C20]/20 backdrop-blur-md z-50 animate-in fade-in duration-300" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[48px] p-10 w-full max-w-2xl z-50 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <Dialog.Title className="text-2xl font-black text-[#482C20]">
                {editingProduct ? 'Editar Especialidad' : 'Nueva Especialidad'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-muted-foreground hover:text-[#482C20] transition-colors p-2 hover:bg-muted rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nombre</label>
                  <Input
                    placeholder="Ej: Latte Lavanda"
                    className="rounded-xl border-border/50 h-11"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Precio</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="rounded-xl border-border/50 h-11"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Categoría</label>
                  <select 
                    className="w-full h-11 rounded-xl border border-border/50 bg-transparent px-3 text-sm focus:ring-2 focus:ring-[#A78D7B]/20 transition-all outline-none"
                    value={formData.categoria_id}
                    onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                  >
                    <option value="1">Bebidas Calientes</option>
                    <option value="2">Bebidas Frías</option>
                    <option value="3">Panadería</option>
                    <option value="4">Postres</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Intensidad (1-5)</label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    className="rounded-xl border-border/50 h-11"
                    value={formData.intensidad}
                    onChange={(e) => setFormData({ ...formData, intensidad: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Calorías</label>
                  <Input
                    type="number"
                    className="rounded-xl border-border/50 h-11"
                    value={formData.calorias}
                    onChange={(e) => setFormData({ ...formData, calorias: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ingredientes (separados por coma)</label>
                <Input
                  placeholder="Espresso, Leche, Jarabe..."
                  className="rounded-xl border-border/50 h-11"
                  value={formData.ingredientes}
                  onChange={(e) => setFormData({ ...formData, ingredientes: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Descripción</label>
                <Textarea
                  placeholder="Describe la experiencia de sabor..."
                  className="rounded-2xl border-border/50 min-h-[100px]"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsDialogOpen(false)} 
                  className="flex-1 rounded-2xl h-12 font-bold"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-[#A78D7B] hover:bg-[#482C20] rounded-2xl h-12 font-bold shadow-lg shadow-[#A78D7B]/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingProduct ? 'Guardar Cambios' : 'Crear Producto')}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
