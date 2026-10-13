import { useNavigate, useLocation } from 'react-router';
import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

export function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as any)?.returnTo || '/home';
  const message = (location.state as any)?.message || 'تمت العملية بنجاح';

  useEffect(() => {
    const timer = setTimeout(() => { navigate(returnTo); }, 1800);
    return () => clearTimeout(timer);
  }, [navigate, returnTo]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6" dir="rtl">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-32 h-32 text-[#1B5E20]" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{message}</h1>
        <p className="text-gray-400 text-sm">جاري التحويل...</p>
      </div>
    </div>
  );
}
