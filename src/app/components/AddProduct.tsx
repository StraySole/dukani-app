import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Plus, Minus } from 'lucide-react';
import { useStore } from '../context/StoreContext';

function NumInput({ label, value, onChange, min = 0 }: { label: string; value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-2 mr-1">{label}</label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center hover:bg-gray-300 transition-colors flex-shrink-0"
        >
          <Minus className="w-5 h-5" />
        </button>
        <input
          type="number"
          value={value}
          onChange={e => onChange(Math.max(min, Number(e.target.value) || 0))}
          className="flex-1 h-14 bg-[#F5F5F5] rounded-xl text-center text-2xl font-semibold outline-none focus:ring-2 focus:ring-[#1B5E20]"
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center hover:bg-gray-300 transition-colors flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function AddProduct() {
  const navigate = useNavigate();
  const { addProduct } = useStore();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [boxes, setBoxes] = useState(0);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) { setError('من فضلك أدخل اسم المنتج'); return; }
    if (price <= 0) { setError('من فضلك أدخل سعراً صحيحاً'); return; }
    addProduct({ name: name.trim(), price, quantity, boxes });
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center border-b">
        <button onClick={() => navigate('/products')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F5F5F5] transition-colors">
          <ArrowRight className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold mr-4">منتج جديد</h2>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm text-gray-700 mb-2 mr-1">اسم المنتج</label>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            placeholder="مثال: أرز 1 كيلو"
            className="w-full h-14 px-4 bg-[#F5F5F5] rounded-xl text-right text-lg outline-none focus:ring-2 focus:ring-[#1B5E20]"
            dir="rtl"
          />
        </div>

        {/* Price */}
        <NumInput label="السعر (ج.م)" value={price} onChange={v => { setPrice(v); setError(''); }} min={0} />

        {/* Quantity */}
        <NumInput label="الكمية (عدد القطع)" value={quantity} onChange={setQuantity} min={0} />

        {/* Boxes */}
        <NumInput label="عدد الكراتين في المخزن" value={boxes} onChange={setBoxes} min={0} />

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 rounded-xl py-3">{error}</p>
        )}

        <button
          onClick={handleSave}
          className="w-full h-14 bg-[#1B5E20] text-white rounded-xl text-xl font-semibold hover:bg-[#145018] transition-colors"
        >
          حفظ المنتج
        </button>
      </div>
    </div>
  );
}
