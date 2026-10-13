import { useNavigate } from 'react-router';
import { ArrowRight, Check, Crown } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'تجريبي',
    price: 'مجاناً',
    duration: '30 يوم',
    features: ['جميع المميزات الأساسية', 'حتى 100 منتج', 'عميل واحد مع ديون'],
    highlighted: false,
    color: 'border-gray-200',
  },
  {
    id: 'basic',
    name: 'أساسي',
    price: '29',
    duration: 'ج.م / شهرياً',
    features: ['منتجات غير محدودة', 'عملاء غير محدودين', 'تقارير مفصلة', 'نسخ احتياطي يومي'],
    highlighted: true,
    color: 'border-[#1B5E20]',
  },
  {
    id: 'wholesale',
    name: 'جملة',
    price: '59',
    duration: 'ج.م / شهرياً',
    features: ['كل مميزات الأساسي', 'إدارة الموردين', 'فواتير احترافية', 'دعم فني مباشر'],
    highlighted: false,
    color: 'border-gray-200',
  },
];

export function Subscription() {
  const navigate = useNavigate();

  const handleSubscribe = (planId: string) => {
    if (planId === 'free') { navigate('/home'); return; }
    navigate('/success', { state: { message: 'تم الاشتراك بنجاح!', returnTo: '/home' } });
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center border-b">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F5F5F5] transition-colors">
          <ArrowRight className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold mr-4">الباقات</h2>
      </div>

      <div className="px-6 py-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 bg-[#1B5E20] rounded-2xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">اختر الباقة المناسبة</h1>
          <p className="text-gray-500 text-sm">جميع الباقات تشمل تجربة مجانية 30 يوم</p>
        </div>

        <div className="space-y-4">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 border-2 ${plan.highlighted ? 'border-[#1B5E20] bg-green-50' : 'border-gray-200 bg-white'}`}
            >
              {plan.highlighted && (
                <div className="bg-[#1B5E20] text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                  الأكثر شعبية
                </div>
              )}
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">{plan.duration}</p>
                  {plan.id !== 'free' && (
                    <p className="text-3xl font-bold text-[#1B5E20]">{plan.price} <span className="text-sm font-normal text-gray-500">ج.م</span></p>
                  )}
                  {plan.id === 'free' && (
                    <p className="text-3xl font-bold text-[#1B5E20]">مجاناً</p>
                  )}
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>
              </div>

              <ul className="space-y-2 mb-5">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 justify-end">
                    <span className="text-sm">{feature}</span>
                    <Check className="w-5 h-5 text-[#1B5E20] flex-shrink-0" />
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full h-14 rounded-xl font-semibold text-lg transition-colors ${
                  plan.highlighted
                    ? 'bg-[#1B5E20] text-white hover:bg-[#145018]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plan.id === 'free' ? 'ابدأ التجربة' : 'اشترك الآن'}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 pb-4">
          بياناتك محفوظة بشكل آمن ولن تُفقد أبداً
        </p>
      </div>
    </div>
  );
}
