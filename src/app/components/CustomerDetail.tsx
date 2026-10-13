import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowRight, Plus, DollarSign, X, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

type ModalType = 'debt' | 'payment' | null;

export function CustomerDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCustomer, addDebt, addPayment, deleteCustomer, getCustomerDebt } = useStore();

  const customer = getCustomer(id || '');

  const [modal, setModal] = useState<ModalType>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!customer) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-gray-500 text-lg">العميل غير موجود</p>
          <button onClick={() => navigate('/debts')} className="mt-4 h-12 px-6 bg-[#1B5E20] text-white rounded-xl font-semibold">
            رجوع
          </button>
        </div>
      </div>
    );
  }

  const debt = getCustomerDebt(customer.id);

  const handleSubmit = () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) { setError('من فضلك أدخل مبلغاً صحيحاً'); return; }
    if (modal === 'debt') addDebt(customer.id, amt, note || 'دين جديد');
    else if (modal === 'payment') addPayment(customer.id, amt, note || 'دفعة');
    setModal(null);
    setAmount('');
    setNote('');
    setError('');
  };

  const handleDelete = () => {
    deleteCustomer(customer.id);
    navigate('/debts');
  };

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString('ar-EG', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-white pb-6" dir="rtl">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center border-b">
        <button onClick={() => navigate('/debts')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F5F5F5] transition-colors">
          <ArrowRight className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold mr-4 flex-1">{customer.name}</h2>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-5 h-5 text-red-500" />
        </button>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Debt Card */}
        <div className={`rounded-2xl p-6 text-white ${debt > 0 ? 'bg-red-500' : 'bg-[#1B5E20]'}`}>
          <p className="text-sm opacity-90 mb-2">المبلغ المستحق</p>
          <p className="text-4xl font-bold">{debt} ج.م</p>
          {customer.phone && <p className="text-sm opacity-75 mt-2" dir="ltr">{customer.phone}</p>}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => { setModal('debt'); setError(''); setAmount(''); setNote(''); }}
            className="h-14 bg-red-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة دين</span>
          </button>
          <button
            onClick={() => { setModal('payment'); setError(''); setAmount(''); setNote(''); }}
            className="h-14 bg-[#1B5E20] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#145018] transition-colors"
          >
            <DollarSign className="w-5 h-5" />
            <span>تسجيل دفعة</span>
          </button>
        </div>

        {/* Transactions */}
        <div className="space-y-3">
          <h3 className="text-sm text-gray-600 font-semibold">سجل المعاملات ({customer.transactions.length})</h3>

          {customer.transactions.length === 0 ? (
            <div className="bg-[#F5F5F5] rounded-2xl p-8 text-center">
              <p className="text-gray-400">لا توجد معاملات بعد</p>
            </div>
          ) : (
            customer.transactions.map(t => (
              <div key={t.id} className="bg-[#F5F5F5] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className={`text-xl font-bold ${t.type === 'debt' ? 'text-red-600' : 'text-[#1B5E20]'}`}>
                    {t.type === 'debt' ? '+' : '-'}{t.amount} ج.م
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{t.note}</p>
                    <p className={`text-xs mt-0.5 ${t.type === 'debt' ? 'text-red-400' : 'text-green-600'}`}>
                      {t.type === 'debt' ? 'دين' : 'دفعة'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{formatDate(t.timestamp)}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Debt / Payment Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" dir="rtl">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-t-3xl px-6 pt-6 pb-10 space-y-5">
            <div className="flex items-center justify-between">
              <button onClick={() => setModal(null)} className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center">
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-xl font-semibold">
                {modal === 'debt' ? 'إضافة دين' : 'تسجيل دفعة'}
              </h3>
              <div className="w-10" />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">المبلغ (ج.م) *</label>
              <input
                type="number"
                value={amount}
                onChange={e => { setAmount(e.target.value); setError(''); }}
                placeholder="0"
                className="w-full h-14 px-4 bg-[#F5F5F5] rounded-xl text-center text-2xl font-bold outline-none focus:ring-2 focus:ring-[#1B5E20]"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">ملاحظة (اختياري)</label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder={modal === 'debt' ? 'مثال: بضاعة متنوعة' : 'مثال: دفعة نقدية'}
                className="w-full h-14 px-4 bg-[#F5F5F5] rounded-xl text-right text-lg outline-none focus:ring-2 focus:ring-[#1B5E20]"
                dir="rtl"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              onClick={handleSubmit}
              className={`w-full h-14 text-white rounded-xl text-xl font-semibold transition-colors ${modal === 'debt' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#1B5E20] hover:bg-[#145018]'}`}
            >
              {modal === 'debt' ? 'تسجيل الدين' : 'تسجيل الدفعة'}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" dir="rtl">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-xl font-semibold text-center">حذف العميل؟</h3>
            <p className="text-gray-500 text-center text-sm">سيتم حذف {customer.name} وجميع معاملاته</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="h-12 bg-[#F5F5F5] rounded-xl font-semibold text-gray-600">إلغاء</button>
              <button onClick={handleDelete} className="h-12 bg-red-500 text-white rounded-xl font-semibold">حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
