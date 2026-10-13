import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Store, Mail, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [contactType, setContactType] = useState<'phone' | 'email'>('phone');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) navigate('/home');
  }, []);

  const handleLogin = () => {
    if (!name.trim()) { setError('من فضلك أدخل اسمك'); return; }
    if (!contact.trim()) { setError('من فضلك أدخل ' + (contactType === 'phone' ? 'رقم الهاتف' : 'البريد الإلكتروني')); return; }
    setUser({ name: name.trim(), contact: contact.trim(), contactType });
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6" dir="rtl">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-[#1B5E20] rounded-3xl flex items-center justify-center shadow-lg">
              <Store className="w-14 h-14 text-white" strokeWidth={2} />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#1B5E20]">دكاني</h1>
          <p className="text-gray-500">إدارة دكانك بسهولة</p>
        </div>

        <div className="space-y-5 pt-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-2 mr-1">اسمك</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              placeholder="مثال: محمد أحمد"
              className="w-full h-14 px-4 bg-[#F5F5F5] rounded-xl text-right text-lg outline-none focus:ring-2 focus:ring-[#1B5E20]"
              dir="rtl"
            />
          </div>

          {/* Toggle phone/email */}
          <div>
            <label className="block text-sm text-gray-700 mb-2 mr-1">تسجيل الدخول بـ</label>
            <div className="flex bg-[#F5F5F5] rounded-xl p-1 mb-3">
              <button
                onClick={() => { setContactType('phone'); setContact(''); setError(''); }}
                className={`flex-1 h-10 rounded-lg flex items-center justify-center gap-2 transition-colors ${contactType === 'phone' ? 'bg-[#1B5E20] text-white' : 'text-gray-500'}`}
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-semibold">رقم الهاتف</span>
              </button>
              <button
                onClick={() => { setContactType('email'); setContact(''); setError(''); }}
                className={`flex-1 h-10 rounded-lg flex items-center justify-center gap-2 transition-colors ${contactType === 'email' ? 'bg-[#1B5E20] text-white' : 'text-gray-500'}`}
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-semibold">البريد الإلكتروني</span>
              </button>
            </div>
            <input
              type={contactType === 'email' ? 'email' : 'tel'}
              value={contact}
              onChange={e => { setContact(e.target.value); setError(''); }}
              placeholder={contactType === 'phone' ? '01xxxxxxxxx' : 'example@email.com'}
              className="w-full h-14 px-4 bg-[#F5F5F5] rounded-xl text-right text-lg outline-none focus:ring-2 focus:ring-[#1B5E20]"
              dir={contactType === 'email' ? 'ltr' : 'rtl'}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full h-14 bg-[#1B5E20] text-white rounded-xl text-xl font-semibold hover:bg-[#145018] transition-colors mt-2"
          >
            دخول
          </button>

          <p className="text-center text-gray-400 text-sm">
            تجربة مجانية 30 يوم — بدون بطاقة بنكية
          </p>
        </div>
      </div>
    </div>
  );
}
