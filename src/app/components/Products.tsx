import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Pencil, Trash2, Package, Minus, X, Check, Search, ScanLine, Loader2 } from 'lucide-react';
import { useStore, Product } from '../context/StoreContext';
import { BottomNav } from './BottomNav';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

// قاعدة البيانات المحلية المدمجة للمنتجات المصرية الشائعة (تعمل بدون إنترنت وتمنع أخطاء المسار)
const EGYPTIAN_PRODUCTS_DB = [
  { barcode: '6221003090013', name: 'حليب جهينة 1 لتر', defaultPrice: 45 },
  { barcode: '6222001150012', name: 'شيبسي عائلي طماطم', defaultPrice: 10 },
  { barcode: '6223004120015', name: 'جبنة تتراباك عبور لاند 500جم', defaultPrice: 30 },
  { barcode: '6221148201019', name: 'مكرونة الملكة 400جم', defaultPrice: 22 },
  { barcode: '6221016020010', name: 'زيت عافية ذرة 800مل', defaultPrice: 95 },
  { barcode: '6224001230018', name: 'سكر المصريين 1كجم', defaultPrice: 35 },
  { barcode: '6221155112233', name: 'شاي العروسة 250جم', defaultPrice: 60 }
];

function NumInput({ label, value, onChange, min = 0, step = 1 }: { label: string; value: number; onChange: (v: number) => void; min?: number; step?: number }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2 text-right">{label}</label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center hover:bg-gray-300 transition-colors flex-shrink-0"
        >
          <Minus className="w-5 h-5" />
        </button>
        <input
          type="number"
          value={value}
          onChange={e => onChange(Math.max(min, Number(e.target.value) || 0))}
          className="flex-1 h-12 bg-[#F5F5F5] rounded-xl text-center text-xl font-semibold outline-none focus:ring-2 focus:ring-[#1B5E20]"
        />
        <button
          onClick={() => onChange(value + step)}
          className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center hover:bg-gray-300 transition-colors flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function Products() {
  const navigate = useNavigate();
  const { products, updateProduct, deleteProduct, addProduct } = useStore();
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editQty, setEditQty] = useState(0);
  const [editBoxes, setEditBoxes] = useState(0);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setEditName(p.name);
    setEditPrice(p.price);
    setEditQty(p.quantity);
    setEditBoxes(p.boxes);
  };

  const saveEdit = () => {
    if (!editingProduct) return;
    if (!editName.trim()) return;
    updateProduct(editingProduct.id, {
      name: editName.trim(),
      price: editPrice,
      quantity: editQty,
      boxes: editBoxes,
    });
    setEditingProduct(null);
  };

  const confirmDelete = (id: number) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  // نظام المسح الذكي والهجين (محلي سريع + سحابي عند توفر الإنترنت)
  const handleSmartScan = async () => {
    try {
      const permission = await BarcodeScanner.checkPermission({ force: true });
      if (!permission.granted) {
        alert('يرجى السماح بالتطبيق باستخدام الكاميرا لمسح الباركود');
        return;
      }

      document.querySelector('body')?.classList.add('barcode-scanner-active');
      setIsScanning(true);
      const result = await BarcodeScanner.scan();
      document.querySelector('body')?.classList.remove('barcode-scanner-active');
      setIsScanning(false);

      if (result.barcodes && result.barcodes.length > 0) {
        const scannedCode = result.barcodes[0].rawValue;

        // 1. البحث محلياً أولاً بدون إنترنت
        const localFound = EGYPTIAN_PRODUCTS_DB.find(p => p.barcode === scannedCode);
        if (localFound) {
          addProduct({
            name: localFound.name,
            price: localFound.defaultPrice,
            quantity: 10,
            boxes: 1,
          });
          alert(`✨ تم العثور على المنتج محلياً وإضافته:\n${localFound.name}`);
          return;
        }

        // 2. التحقق من الإنترنت
        if (!navigator.onLine) {
          alert(`الباركود (${scannedCode}) غير موجود محلياً ولا يوجد اتصال بالإنترنت. يرجى إضافته يدوياً.`);
          navigate('/add-product');
          return;
        }

        // 3. الاستعلام السحابي الحي
        setIsScanning(true);
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${scannedCode}.json`, {
          headers: { 'User-Agent': 'DukaniApp/1.0' }
        });
        const data = await response.json();
        setIsScanning(false);

        if (data.status === 1 && data.product) {
          const productName = data.product.product_name || data.product.product_name_ar || 'منتج جديد';
          addProduct({
            name: productName,
            price: 10,
            quantity: 10,
            boxes: 1,
          });
          alert(`🌐 تم الجلب من السحابة وإضافة المنتج:\n${productName}`);
        } else {
          alert(`الباركود (${scannedCode}) غير مسجل. يرجى إضافته يدوياً.`);
          navigate('/add-product');
        }

      }
    } catch (error) {
      document.querySelector('body')?.classList.remove('barcode-scanner-active');
      setIsScanning(false);
      console.error('Smart Scan Error:', error);
      alert('حدث خطأ أثناء فحص الباركود.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" dir="rtl">
      <div className="flex-1 pb-20">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/add-product')}
              className="w-10 h-10 bg-[#1B5E20] rounded-xl flex items-center justify-center hover:bg-[#145018] transition-colors"
              title="إضافة يدوية"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleSmartScan}
              disabled={isScanning}
              className="h-10 px-3 bg-amber-600 text-white rounded-xl flex items-center gap-1.5 hover:bg-amber-700 transition-colors text-sm font-semibold disabled:opacity-50"
            >
              {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
              <span>{isScanning ? 'جاري البحث...' : 'مسح باركود ذكي'}</span>
            </button>
          </div>
          <h2 className="text-xl font-semibold">المنتجات</h2>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full h-12 pr-4 pl-12 bg-[#F5F5F5] rounded-xl text-right outline-none focus:ring-2 focus:ring-[#1B5E20]"
              dir="rtl"
            />
          </div>

          {/* Count */}
          <p className="text-sm text-gray-500 text-right">{filtered.length} منتج</p>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">لا توجد منتجات</p>
              <p className="text-gray-400 text-sm mt-1">اضغط زر + أو مسح الباركود الذكي لإضافة أول منتج</p>
            </div>
          )}

          {/* Product List */}
          <div className="space-y-3">
            {filtered.map(product => (
              <div key={product.id} className="bg-[#F5F5F5] rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(product)}
                      className="w-10 h-10 bg-[#1B5E20] rounded-xl flex items-center justify-center hover:bg-[#145018] transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product.id)}
                      className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{product.name}</p>
                    <p className="text-[#1B5E20] font-bold mt-0.5">{product.price} ج.م</p>
                  </div>
                </div>
                <div className="flex justify-end gap-4 text-sm text-gray-500 border-t border-gray-200 pt-2">
                  <span>كراتين: <span className="font-semibold text-gray-700">{product.boxes}</span></span>
                  <span>الكمية: <span className="font-semibold text-gray-700">{product.quantity}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />

      {/* Edit Bottom Sheet */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" dir="rtl">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditingProduct(null)} />
          <div className="relative bg-white rounded-t-3xl px-6 pt-6 pb-8 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <button onClick={saveEdit} className="w-10 h-10 bg-[#1B5E20] rounded-xl flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </button>
              <h3 className="text-xl font-semibold">تعديل المنتج</h3>
              <button onClick={() => setEditingProduct(null)} className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2 text-right">اسم المنتج</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full h-14 px-4 bg-[#F5F5F5] rounded-xl text-right text-lg outline-none focus:ring-2 focus:ring-[#1B5E20]"
                dir="rtl"
              />
            </div>

            <NumInput label="السعر (ج.م)" value={editPrice} onChange={setEditPrice} min={0} />
            <NumInput label="الكمية (قطعة)" value={editQty} onChange={setEditQty} min={0} />
            <NumInput label="عدد الكراتين" value={editBoxes} onChange={setEditBoxes} min={0} />

            <button
              onClick={saveEdit}
              className="w-full h-14 bg-[#1B5E20] text-white rounded-xl text-xl font-semibold hover:bg-[#145018] transition-colors"
            >
              حفظ التعديلات
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" dir="rtl">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-xl font-semibold text-center">حذف المنتج؟</h3>
            <p className="text-gray-500 text-center text-sm">هل أنت متأكد من حذف هذا المنتج؟</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="h-12 bg-[#F5F5F5] rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors">إلغاء</button>
              <button onClick={() => confirmDelete(deleteConfirm)} className="h-12 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
