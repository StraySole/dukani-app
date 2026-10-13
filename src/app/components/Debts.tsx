import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Users, X, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BottomNav } from './BottomNav';

export function Debts() {
  const navigate = useNavigate();
  const { customers, addCustomer, getTotalDebt, getCustomerDebt } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [error, setError] = useState('');

  const totalDebt = getTotalDebt();

  const handleAddCustomer = () => {
    if (!newName.trim()) { setError('من فضلك أدخل اسم العميل'); return; }
    addCustomer(newName.trim(), newPhone.trim());
    setNewName('');
    setNewPhone('');
    setError('');
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" dir="rtl">
      <div className="flex-1 pb-20">
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center border-b">
          <h2 className="text-xl font-semibold flex-1 text-center">الديون</h2>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Total Debt Card */}
          <div className="bg-red-500 rounded-2xl p-6 text-white">
            <p className="text-sm opacity-90 mb-2">إجمالي الديون</p>
            <p className="text-4xl font-bold">{totalDebt.toLocaleString('ar-EG')} ج.م</p>
          </div>

          {/* Add Customer Button */}
          <button
            onClick={() => setShowAdd(true)}
            className="w-full h-14 bg-[#1B5E20] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#145018] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة عميل جديد</span>
          </button>

          {/* Customers List */}
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">لا يوجد عملاء</p>
              <p className="text-gray-400 text-sm mt-1">اضغط الزر أعلاه لإضافة عميل</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-sm text-gray-600 font-semibold">العملاء ({customers.length})</h3>
              {customers.map(customer => {
                const debt = getCustomerDebt(customer.id);
                return (
                  <div
                    key={customer.id}
                    onClick={() => navigate(`/customer/${customer.id}`)}
                    className="bg-[#F5F5F5] rounded-xl p-4 cursor-pointer hover:bg-gray-200 transition-colors active:scale-95"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`text-2xl font-bold ${debt > 0 ? 'text-red-600' : 'text-[#1B5E20]'}`}>
                        {debt} ج.م
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{customer.name}</p>
                        {customer.phone && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 justify-end mt-0.5">
                            <span dir="ltr">{customer.phone}</span>
                            <Phone className="w-3.5 h-3.5" />
                          </p>
                        )}
                      </div>
                    </div>
                    {customer.transactions.length > 0 && (
                      <p className="text-xs text-gray-400 mt-2 text-right">
                        آخر معاملة: {new Date(customer.transactions[0].timestamp).toLocaleDateString('ar-EG')}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav />

      {/* Add Customer Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" dir="rtl">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowAdd(false); setError(''); }} />
          <div className="relative bg-white rounded-t-3xl px-6 pt-6 pb-10 space-y-5">
            <div className="flex items-center justify-between">
              <button onClick={() => { setShowAdd(false); setError(''); }} className="w-10 h-10 bg-[#F5F5F5] rounded-xl flex items-center justify-center">
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-xl font-semibold">إضافة عميل جديد</h3>
              <div className="w-10" />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">اسم العميل *</label>
              <input
                type="text"
                value={newName}
                onChange={e => { setNewName(e.target.value); setError(''); }}
                placeholder="مثال: محمد أحمد"
                className="w-full h-14 px-4 bg-[#F5F5F5] rounded-xl text-right text-lg outline-none focus:ring-2 focus:ring-[#1B5E20]"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">رقم الهاتف (اختياري)</label>
              <input
                type="tel"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
                className="w-full h-14 px-4 bg-[#F5F5F5] rounded-xl text-right text-lg outline-none focus:ring-2 focus:ring-[#1B5E20]"
                dir="rtl"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              onClick={handleAddCustomer}
              className="w-full h-14 bg-[#1B5E20] text-white rounded-xl text-xl font-semibold hover:bg-[#145018] transition-colors"
            >
              إضافة العميل
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
