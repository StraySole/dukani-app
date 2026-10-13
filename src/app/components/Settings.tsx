import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, User, Phone, Mail, Crown, LogOut, Pencil } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function Settings() {
  const navigate = useNavigate();
  const { user, updateUser } = useStore();

  const [editingName, setEditingName] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [nameVal, setNameVal] = useState(user?.name || '');
  const [contactVal, setContactVal] = useState(user?.contact || '');
  const [contactType, setContactType] = useState<'email' | 'phone'>(user?.contactType || 'phone');

  const saveName = () => {
    if (nameVal.trim()) { updateUser({ name: nameVal.trim() }); }
    setEditingName(false);
  };

  const saveContact = () => {
    if (contactVal.trim()) { updateUser({ contact: contactVal.trim(), contactType }); }
    setEditingContact(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('dk_user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center border-b">
        <button onClick={() => navigate('/home')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F5F5F5] transition-colors">
          <ArrowRight className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold mr-4">الإعدادات</h2>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Profile section */}
        <div>
          <h3 className="text-sm text-gray-500 mb-3 font-semibold">معلومات الحساب</h3>
          <div className="space-y-3">
            {/* Name */}
            <div className="bg-[#F5F5F5] rounded-2xl p-4">
              {editingName ? (
                <div className="space-y-3">
                  <label className="block text-sm text-gray-600">الاسم</label>
                  <input
                    type="text"
                    value={nameVal}
                    onChange={e => setNameVal(e.target.value)}
                    className="w-full h-12 px-4 bg-white rounded-xl text-right text-lg outline-none focus:ring-2 focus:ring-[#1B5E20]"
                    dir="rtl"
                    autoFocus
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setEditingName(false)} className="h-10 bg-gray-200 rounded-xl text-gray-600 font-semibold">إلغاء</button>
                    <button onClick={saveName} className="h-10 bg-[#1B5E20] text-white rounded-xl font-semibold">حفظ</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button onClick={() => { setNameVal(user?.name || ''); setEditingName(true); }} className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
                    <Pencil className="w-4 h-4 text-[#1B5E20]" />
                  </button>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-500">الاسم</p>
                      <p className="font-semibold">{user?.name || '—'}</p>
                    </div>
                    <div className="w-10 h-10 bg-[#1B5E20] rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="bg-[#F5F5F5] rounded-2xl p-4">
              {editingContact ? (
                <div className="space-y-3">
                  <label className="block text-sm text-gray-600">طريقة التواصل</label>
                  <div className="flex bg-white rounded-xl p-1">
                    <button
                      onClick={() => setContactType('phone')}
                      className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-colors ${contactType === 'phone' ? 'bg-[#1B5E20] text-white' : 'text-gray-500'}`}
                    >
                      هاتف
                    </button>
                    <button
                      onClick={() => setContactType('email')}
                      className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-colors ${contactType === 'email' ? 'bg-[#1B5E20] text-white' : 'text-gray-500'}`}
                    >
                      إيميل
                    </button>
                  </div>
                  <input
                    type={contactType === 'email' ? 'email' : 'tel'}
                    value={contactVal}
                    onChange={e => setContactVal(e.target.value)}
                    className="w-full h-12 px-4 bg-white rounded-xl text-right text-lg outline-none focus:ring-2 focus:ring-[#1B5E20]"
                    dir={contactType === 'email' ? 'ltr' : 'rtl'}
                    autoFocus
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setEditingContact(false)} className="h-10 bg-gray-200 rounded-xl text-gray-600 font-semibold">إلغاء</button>
                    <button onClick={saveContact} className="h-10 bg-[#1B5E20] text-white rounded-xl font-semibold">حفظ</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button onClick={() => { setContactVal(user?.contact || ''); setContactType(user?.contactType || 'phone'); setEditingContact(true); }} className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
                    <Pencil className="w-4 h-4 text-[#1B5E20]" />
                  </button>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-500">{user?.contactType === 'email' ? 'البريد الإلكتروني' : 'رقم الهاتف'}</p>
                      <p className="font-semibold" dir={user?.contactType === 'email' ? 'ltr' : 'rtl'}>{user?.contact || '—'}</p>
                    </div>
                    <div className="w-10 h-10 bg-[#1B5E20] rounded-xl flex items-center justify-center">
                      {user?.contactType === 'email' ? <Mail className="w-5 h-5 text-white" /> : <Phone className="w-5 h-5 text-white" />}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div>
          <h3 className="text-sm text-gray-500 mb-3 font-semibold">الاشتراك</h3>
          <button
            onClick={() => navigate('/subscription')}
            className="w-full bg-gradient-to-l from-[#1B5E20] to-[#2E7D32] rounded-2xl p-5 flex items-center justify-between text-white hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">عرض الباقات</span>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80">الباقة الحالية</p>
              <p className="font-bold">تجريبي مجاني</p>
            </div>
          </button>
        </div>

        {/* App info */}
        <div>
          <h3 className="text-sm text-gray-500 mb-3 font-semibold">عن التطبيق</h3>
          <div className="bg-[#F5F5F5] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">الإصدار</span>
              <span className="font-semibold text-sm">1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">اسم التطبيق</span>
              <span className="font-semibold text-sm">دكاني</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full h-14 bg-red-50 text-red-600 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}
