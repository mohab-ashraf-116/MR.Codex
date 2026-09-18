import { useEffect, useRef, useState, useCallback } from 'react';
import {
  BookOpen, Code2, Brain, Database, Cpu, Globe2, Rocket,
  CheckCircle2, ArrowLeft, Menu, X, Send, Mail, Phone, MapPin,
  Users, Award, Sparkles, ShieldCheck, Clock, Star, Quote, Facebook,
  Sun, Moon, Languages,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Lang = 'ar' | 'en';
type Theme = 'light' | 'dark';

type Course = {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  icon: React.ComponentType<{ className?: string }>;
  duration: { ar: string; en: string };
  level: { ar: string; en: string };
  topics: { ar: string; en: string }[];
  accent: string;
};

const COURSES: Course[] = [
  {
    id: 'web-dev',
    title: { ar: 'تطوير الويب الكامل', en: 'Full-Stack Web Development' },
    description: {
      ar: 'من HTML إلى نشر تطبيقات حقيقية باستخدام React وNode.js مع قواعد بيانات فعلية.',
      en: 'From HTML to deploying real apps with React, Node.js, and live databases.',
    },
    icon: Code2,
    duration: { ar: '12 أسبوع', en: '12 weeks' },
    level: { ar: 'مبتدئ - متوسط', en: 'Beginner - Intermediate' },
    topics: [
      { ar: 'HTML & CSS', en: 'HTML & CSS' },
      { ar: 'JavaScript الحديث', en: 'Modern JavaScript' },
      { ar: 'React & Tailwind', en: 'React & Tailwind' },
      { ar: 'REST APIs', en: 'REST APIs' },
      { ar: 'نشر التطبيقات', en: 'App Deployment' },
    ],
    accent: 'from-sky-500 to-sky-700',
  },
  {
    id: 'ai-ml',
    title: { ar: 'أساسيات الذكاء الاصطناعي', en: 'AI & Machine Learning' },
    description: {
      ar: 'تفهم النماذج اللغوية وتعلم الآلة وبناء مشاريع ذكاء اصطناعي عمليّة خطوة بخطوة.',
      en: 'Understand language models, machine learning, and build practical AI projects step by step.',
    },
    icon: Brain,
    duration: { ar: '10 أسابيع', en: '10 weeks' },
    level: { ar: 'متوسط', en: 'Intermediate' },
    topics: [
      { ar: 'Python للذكاء الاصطناعي', en: 'Python for AI' },
      { ar: 'معالجة البيانات', en: 'Data Processing' },
      { ar: 'تعلّم الآلة', en: 'Machine Learning' },
      { ar: 'النماذج اللغوية', en: 'Language Models' },
      { ar: 'تطبيقات عملية', en: 'Practical Projects' },
    ],
    accent: 'from-amber-500 to-amber-700',
  },
  {
    id: 'databases',
    title: { ar: 'قواعد البيانات الحديثة', en: 'Modern Databases' },
    description: {
      ar: 'صمّم وأدر قواعد بيانات علائقية قوية مع PostgreSQL وSupabase وضبط الأداء.',
      en: 'Design and manage robust relational databases with PostgreSQL, Supabase, and performance tuning.',
    },
    icon: Database,
    duration: { ar: '8 أسابيع', en: '8 weeks' },
    level: { ar: 'مبتدئ - متوسط', en: 'Beginner - Intermediate' },
    topics: [
      { ar: 'SQL الأساسي', en: 'SQL Fundamentals' },
      { ar: 'تصميم المخططات', en: 'Schema Design' },
      { ar: 'PostgreSQL', en: 'PostgreSQL' },
      { ar: 'أمان البيانات', en: 'Data Security' },
      { ar: 'تحسين الأداء', en: 'Performance Tuning' },
    ],
    accent: 'from-emerald-500 to-emerald-700',
  },
  {
    id: 'python',
    title: { ar: 'البرمجة بلغة Python', en: 'Python Programming' },
    description: {
      ar: 'ابدأ رحلتك في عالم البرمجة بلغة سهلة وقوية تفتح لك أبواب التخصصات التقنية.',
      en: 'Start your coding journey with an easy yet powerful language that opens doors to tech careers.',
    },
    icon: Cpu,
    duration: { ar: '8 أسابيع', en: '8 weeks' },
    level: { ar: 'مبتدئ', en: 'Beginner' },
    topics: [
      { ar: 'أساسيات Python', en: 'Python Basics' },
      { ar: 'البرمجة كائنية التوجه', en: 'Object-Oriented Programming' },
      { ar: 'التعامل مع الملفات', en: 'File Handling' },
      { ar: 'المكتبات الشهيرة', en: 'Popular Libraries' },
      { ar: 'مشاريع تطبيقية', en: 'Applied Projects' },
    ],
    accent: 'from-sky-600 to-indigo-600',
  },
  {
    id: 'devops',
    title: { ar: 'العمليات السحابية و DevOps', en: 'Cloud & DevOps' },
    description: {
      ar: 'تعلّم نشر وإدارة التطبيقات في السحابة وأتمتة العمليات بأدوات حديثة وآمنة.',
      en: 'Learn to deploy and manage apps in the cloud, automate workflows with modern, secure tools.',
    },
    icon: Globe2,
    duration: { ar: '6 أسابيع', en: '6 weeks' },
    level: { ar: 'متوسط - متقدم', en: 'Intermediate - Advanced' },
    topics: [
      { ar: 'Linux والأساسيات', en: 'Linux Fundamentals' },
      { ar: 'Docker', en: 'Docker' },
      { ar: 'CI/CD', en: 'CI/CD' },
      { ar: 'المراقبة', en: 'Monitoring' },
      { ar: 'الأمان السحابي', en: 'Cloud Security' },
    ],
    accent: 'from-teal-500 to-teal-700',
  },
  {
    id: 'bac-first-year',
    title: { ar: 'معلوماتية الصف الأول بكالوريا', en: 'First-Year Baccalaureate ICT' },
    description: {
      ar: 'مراجعة مبسطة ومتكاملة لمفاهيم المعلوماتية والبرمجة المقررة في الصف الأول بكالوريا مع تمارين تطبيقية.',
      en: 'A clear, complete review of first-year baccalaureate ICT and programming concepts with practical exercises.',
    },
    icon: BookOpen,
    duration: { ar: '12 أسبوع', en: '12 weeks' },
    level: { ar: 'الصف الأول بكالوريا', en: 'First-Year Baccalaureate' },
    topics: [
      { ar: 'أساسيات الخوارزميات', en: 'Algorithm Fundamentals' },
      { ar: 'البرمجة والتفكير المنطقي', en: 'Programming & Logical Thinking' },
      { ar: 'تنظيم البيانات', en: 'Data Organization' },
      { ar: 'الشبكات والإنترنت', en: 'Networks & Internet' },
      { ar: 'تمارين واختبارات تطبيقية', en: 'Practice Exercises & Tests' },
    ],
    accent: 'from-cyan-500 to-cyan-700',
  },
  {
    id: 'bac-second-year',
    title: { ar: 'معلوماتية الصف الثاني بكالوريا', en: 'Second-Year Baccalaureate ICT' },
    description: {
      ar: 'تحضير مركز للصف الثاني بكالوريا يجمع بين فهم الدروس والتدريب على حل مسائل الامتحانات بثقة.',
      en: 'Focused second-year baccalaureate preparation combining lesson mastery with confident exam practice.',
    },
    icon: Award,
    duration: { ar: '14 أسبوع', en: '14 weeks' },
    level: { ar: 'الصف الثاني بكالوريا', en: 'Second-Year Baccalaureate' },
    topics: [
      { ar: 'الخوارزميات المتقدمة', en: 'Advanced Algorithms' },
      { ar: 'قواعد البيانات وSQL', en: 'Databases & SQL' },
      { ar: 'تحليل وتصميم الأنظمة', en: 'System Analysis & Design' },
      { ar: 'حل نماذج الامتحانات', en: 'Exam Model Solving' },
      { ar: 'مراجعة نهائية مكثفة', en: 'Intensive Final Review' },
    ],
    accent: 'from-blue-500 to-blue-700',
  },
  {
    id: 'ict-igcse',
    title: { ar: 'ICT لنظام IG', en: 'ICT for IG' },
    description: {
      ar: 'دروس وتدريبات عملية في ICT لطلاب نظام IG مع التركيز على المهارات المطلوبة والأسئلة الشائعة.',
      en: 'Practical ICT lessons and training for IG students, focused on required skills and common exam questions.',
    },
    icon: Globe2,
    duration: { ar: '10 أسابيع', en: '10 weeks' },
    level: { ar: 'طلاب IG', en: 'IG Students' },
    topics: [
      { ar: 'مكونات الحاسوب والبرمجيات', en: 'Computer Hardware & Software' },
      { ar: 'الشبكات وأمن المعلومات', en: 'Networks & Information Security' },
      { ar: 'قواعد البيانات', en: 'Databases' },
      { ar: 'تحليل البيانات والعروض', en: 'Data Analysis & Presentations' },
      { ar: 'تدريبات الامتحان', en: 'Exam Practice' },
    ],
    accent: 'from-violet-500 to-violet-700',
  },
  {
    id: 'ict-american',
    title: { ar: 'ICT للنظام الأمريكي', en: 'ICT for American System' },
    description: {
      ar: 'مسار عملي لطلاب النظام الأمريكي لتعلم مهارات التكنولوجيا والبرمجة والتطبيق على مشروعات مدرسية.',
      en: 'A practical track for American system students covering technology, programming, and school project skills.',
    },
    icon: Sparkles,
    duration: { ar: '10 أسابيع', en: '10 weeks' },
    level: { ar: 'طلاب النظام الأمريكي', en: 'American System Students' },
    topics: [
      { ar: 'مبادئ البرمجة', en: 'Programming Principles' },
      { ar: 'التفكير الحاسوبي', en: 'Computational Thinking' },
      { ar: 'تطبيقات الويب الأساسية', en: 'Web Applications Basics' },
      { ar: 'المواطنة والأمان الرقمي', en: 'Digital Citizenship & Safety' },
      { ar: 'مشروعات وتقييمات عملية', en: 'Projects & Practical Assessments' },
    ],
    accent: 'from-fuchsia-500 to-fuchsia-700',
  },
  {
    id: 'career',
    title: { ar: 'الاستعداد لسوق العمل', en: 'Career Readiness' },
    description: {
      ar: 'جهّز سيرتك الذاتية وملفك التقني واختبارك الفني وتمرّن على مقابلات حقيقية.',
      en: 'Prepare your CV, portfolio, technical tests, and practice real interview scenarios.',
    },
    icon: Rocket,
    duration: { ar: '4 أسابيع', en: '4 weeks' },
    level: { ar: 'جميع المستويات', en: 'All Levels' },
    topics: [
      { ar: 'بناء السيرة الذاتية', en: 'CV Building' },
      { ar: 'GitHub Portfolio', en: 'GitHub Portfolio' },
      { ar: 'المقابلات الفنية', en: 'Technical Interviews' },
      { ar: 'التفاوض على الراتب', en: 'Salary Negotiation' },
      { ar: 'التوجيه المهني', en: 'Career Guidance' },
    ],
    accent: 'from-rose-500 to-rose-700',
  },
];

const FEATURES = [
  {
    icon: Users,
    title: { ar: 'مجتمع تعليمي نشط', en: 'Active Learning Community' },
    text: { ar: 'انضم إلى مئات المتعلمين وتبادل الخبرات في رحلة تعلم جماعية.', en: 'Join hundreds of learners and share knowledge in a collaborative journey.' },
  },
  {
    icon: Award,
    title: { ar: 'شهادات معتمدة', en: 'Certified Credentials' },
    text: { ar: 'احصل على شهادة إتمام لكل دورة تضيفها إلى ملفك المهني.', en: 'Earn a completion certificate for each course to add to your professional profile.' },
  },
  {
    icon: Clock,
    title: { ar: 'مرونة في الوقت', en: 'Flexible Schedule' },
    text: { ar: 'تعلم وفق جدولك مع محتوى مسجل وجلسات مباشرة أسبوعية.', en: 'Learn on your schedule with recorded content and weekly live sessions.' },
  },
  {
    icon: ShieldCheck,
    title: { ar: 'محتوى عملي', en: 'Practical Content' },
    text: { ar: 'مشاريع حقيقية تعكس احتياجات سوق العمل الحالي بدلاً من النظري فقط.', en: 'Real projects reflecting current job market needs, not just theory.' },
  },
];

const STATS = [
  { value: '+500', label: { ar: 'طالب وطالبة', en: 'Students' } },
  { value: '+20', label: { ar: 'دورة تدريبية', en: 'Courses' } },
  { value: '+95%', label: { ar: 'نسبة رضا المتعلمين', en: 'Satisfaction Rate' } },
  { value: '+8', label: { ar: 'مسارات تعليمية', en: 'Learning Tracks' } },
];

const TESTIMONIALS = [
  {
    name: { ar: 'سارة محمد', en: 'Sarah Mohamed' },
    role: { ar: 'مطوّرة واجهات أمامية', en: 'Frontend Developer' },
    text: {
      ar: 'بدأت من الصفر والآن أعمل في شركة تقنية. الشرح عملي والمراحل مدروسة بعناية.',
      en: 'I started from zero and now work at a tech company. The teaching is practical and well-structured.',
    },
  },
  {
    name: { ar: 'أحمد عبد الله', en: 'Ahmed Abdullah' },
    role: { ar: 'طالب ذكاء اصطناعي', en: 'AI Student' },
    text: {
      ar: 'الدورات في الذكاء الاصطناعي ربطت بين النظرية والتطبيق بطريقة لم أجدها في مكان آخر.',
      en: 'The AI courses bridged theory and practice in a way I hadn\'t found anywhere else.',
    },
  },
  {
    name: { ar: 'ملحم خالد', en: 'Malham Khalid' },
    role: { ar: 'مهندس بيانات', en: 'Data Engineer' },
    text: {
      ar: 'مسار قواعد البيانات رفع مستواي في تصميم الأنظمة وتحسين الأداء بشكل واضح.',
      en: 'The databases track clearly improved my system design and performance optimization skills.',
    },
  },
];

const T = {
  nav: {
    home: { ar: 'الرئيسية', en: 'Home' },
    about: { ar: 'عن الأكاديمية', en: 'About' },
    courses: { ar: 'الدورات', en: 'Courses' },
    features: { ar: 'المميزات', en: 'Features' },
    testimonials: { ar: 'آراء الطلاب', en: 'Testimonials' },
    register: { ar: 'التسجيل', en: 'Register' },
  },
  hero: {
    badge: { ar: 'رحلتك في عالم التقنية تبدأ هنا', en: 'Your tech journey starts here' },
    title1: 'MR Codex Academy',
    title2: { ar: 'حيث يصبح المبتدئ', en: 'Where beginners become' },
    title3: { ar: 'محترفًا', en: 'professionals' },
    desc: {
      ar: 'أكاديمية متخصصة في تعليم البرمجة والذكاء الاصطناعي وتطوير الويب، بمنهج عملي ومشاريع حقيقية تأهّلك لسوق العمل من اليوم الأول.',
      en: 'An academy specialized in teaching programming, AI, and web development — with a practical curriculum and real projects that prepare you for the job market from day one.',
    },
    cta1: { ar: 'استكشف الدورات', en: 'Explore Courses' },
    cta2: { ar: 'سجّل الآن', en: 'Register Now' },
    floatCard: { ar: 'دعم متواصل', en: 'Continuous Support' },
    floatCardSub: { ar: 'طوال رحلة التعلم', en: 'Throughout your journey' },
  },
  about: {
    badge: { ar: 'عن الأكاديمية', en: 'About Us' },
    title: { ar: 'نُمكّن الجيل القادم من صنّاع التقنية', en: 'Empowering the next generation of tech makers' },
    p1: {
      ar: 'في MR Codex Academy نؤمن أن التعلم التقني يجب أن يكون عمليًا ومتدرجًا وممتعًا. صمّمنا مسارات تعليمية تأخذ بيدك من أول سطر برمجي حتى تكون قادرًا على بناء مشاريع حقيقية والتفاوض على وظيفتك الأولى.',
      en: 'At MR Codex Academy, we believe tech education should be practical, progressive, and enjoyable. We designed learning tracks that guide you from your first line of code to building real projects and landing your first job.',
    },
    p2: {
      ar: 'ندمج بين الأساسيات الأكاديمية الرصينة والمشاريع التطبيقية التي يحتاجها سوق العمل، مع متابعة شخصية لكل متعلم ومجتمع داعم يرافقك في كل خطوة.',
      en: 'We blend solid academic fundamentals with applied projects the job market demands, with personal follow-up for every learner and a supportive community at every step.',
    },
    exp: { ar: 'سنوات من الخبرة', en: 'Years of Experience' },
    items: [
      { t: { ar: 'منهج عملي حديث', en: 'Modern Practical Curriculum' }, d: { ar: 'يُحدَّث باستمرار', en: 'Constantly updated' } },
      { t: { ar: 'مجتمع داعم', en: 'Supportive Community' }, d: { ar: 'ومتابعة فردية', en: 'With individual follow-up' } },
      { t: { ar: 'مشاريع واقعية', en: 'Real-World Projects' }, d: { ar: 'تُضاف لملفك', en: 'Added to your portfolio' } },
      { t: { ar: 'تأهيل مهني', en: 'Career Preparation' }, d: { ar: 'للسوق والفريلانس', en: 'For jobs & freelancing' } },
    ],
  },
  courses: {
    badge: { ar: 'مساراتنا التعليمية', en: 'Our Learning Tracks' },
    title: { ar: 'دورات مصممة لتأهيلك فعليًا', en: 'Courses designed to truly qualify you' },
    desc: { ar: 'اختر المسار الذي يناسب أهدافك واضغط على البطاقة لاستعراض تفاصيل المنهج.', en: 'Choose the track that fits your goals and click the card to view curriculum details.' },
    learn: { ar: 'ماذا ستتعلم:', en: 'What you\'ll learn:' },
    show: { ar: 'عرض المنهج', en: 'View Curriculum' },
    hide: { ar: 'إخفاء التفاصيل', en: 'Hide Details' },
  },
  features: {
    badge: { ar: 'لماذا تختارنا', en: 'Why Choose Us' },
    title: { ar: 'مميزات تجعل رحلتك مختلفة', en: 'Features that make your journey different' },
    desc: { ar: 'أكثر من مجرد دورات: تجربة تعلم متكاملة تدعمك حتى تحقيق هدفك.', en: 'More than just courses: an integrated learning experience that supports you until you reach your goal.' },
  },
  testimonials: {
    badge: { ar: 'آراء طلابنا', en: 'Student Reviews' },
    title: { ar: 'قصص نجاح حقيقية', en: 'Real Success Stories' },
    desc: { ar: 'نفخر برحلة كل متعلم وصل إلى هدفه عبر الأكاديمية.', en: 'We\'re proud of every learner who reached their goal through the academy.' },
  },
  register: {
    title: { ar: 'ابدأ رحلتك التقنية اليوم', en: 'Start your tech journey today' },
    desc: {
      ar: 'املأ النموذج وسيتواصل معك فريقنا خلال 24 ساعة لاختيار المسار المناسب وبدء التعلم.',
      en: 'Fill out the form and our team will contact you within 24 hours to choose the right track and start learning.',
    },
    benefits: [
      { ar: 'استشارة مجانية لاختيار المسار', en: 'Free consultation to choose your track' },
      { ar: 'خصم خاص للمسجلين المبكرين', en: 'Special discount for early registrants' },
      { ar: 'تجربة تعليمية مرنة وعملية', en: 'Flexible and practical learning experience' },
    ],
    formTitle: { ar: 'نموذج التسجيل', en: 'Registration Form' },
    formHint: { ar: 'الحقول المطلوبة مشار إليها بـ *', en: 'Required fields are marked with *' },
    success: { ar: 'تم استلام طلبك بنجاح', en: 'Your request was submitted successfully' },
    successDesc: { ar: 'سنتواصل معك قريبًا لاستكمال التسجيل.', en: 'We\'ll contact you soon to complete registration.' },
    error: { ar: 'حدث خطأ أثناء الإرسال', en: 'An error occurred during submission' },
    errorDesc: { ar: 'يرجى المحاولة مرة أخرى بعد لحظات.', en: 'Please try again in a moment.' },
    name: { ar: 'الاسم الكامل *', en: 'Full Name *' },
    namePh: { ar: 'اكتب اسمك', en: 'Enter your name' },
    email: { ar: 'البريد الإلكتروني *', en: 'Email *' },
    phone: { ar: 'رقم الهاتف *', en: 'Phone Number *' },
    phonePh: '01xxxxxxxxx',
    course: { ar: 'الدورة المطلوبة *', en: 'Desired Course *' },
    selectCourse: { ar: 'اختر الدورة', en: 'Select a course' },
    message: { ar: 'رسالة (اختياري)', en: 'Message (optional)' },
    messagePh: {
      ar: 'أخبرنا عن أهدافك أو أي استفسار إضافي...',
      en: 'Tell us about your goals or any additional questions...',
    },
    submit: { ar: 'إرسال الطلب', en: 'Submit Request' },
    submitting: { ar: 'جارٍ الإرسال...', en: 'Sending...' },
    facebook: { ar: 'صفحتنا على فيسبوك', en: 'Our Facebook Page' },
    location: { ar: 'القاهرة، مصر - أونلاين عالميًا', en: 'Cairo, Egypt — Online Worldwide' },
  },
  footer: {
    desc: {
      ar: 'أكاديمية تقنية تعليمية تُمكّن الجيل القادم من احتراف البرمجة والذكاء الاصطناعي عبر منهج عملي ومتدرج.',
      en: 'A tech education academy empowering the next generation to master programming and AI through a practical, progressive curriculum.',
    },
    quickLinks: { ar: 'روابط سريعة', en: 'Quick Links' },
    courses: { ar: 'الدورات', en: 'Courses' },
    contact: { ar: 'تواصل معنا', en: 'Contact Us' },
    rights: { ar: 'جميع الحقوق محفوظة.', en: 'All rights reserved.' },
    designed: { ar: 'صُمّم بشغف للمتعلمين العرب', en: 'Designed with passion for Arab learners' },
    future: { ar: 'أكاديمية المستقبل', en: 'Academy of the Future' },
  },
};

const FB_URL = 'https://www.facebook.com/profile.php?id=61594150305177';
const HERO_IMG = 'https://images.pexels.com/photos/4816921/pexels-photo-4816921.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const ABOUT_IMG = 'https://images.pexels.com/photos/5212687/pexels-photo-5212687.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openCourse, setOpenCourse] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>('ar');
  const [theme, setTheme] = useState<Theme>('light');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    course: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const heroRef = useRef<HTMLDivElement>(null);

  const t = T;
  const tr = (v: { ar: string; en: string }) => v[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedLang = localStorage.getItem('lang') as Lang | null;
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle('lang-en', lang === 'en');
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    localStorage.setItem('lang', lang);
  }, [lang, isRtl]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = useCallback((id: string) => {
    setNavOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const toggleLang = () => setLang((p) => (p === 'ar' ? 'en' : 'ar'));
  const toggleTheme = () => setTheme((p) => (p === 'light' ? 'dark' : 'light'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    try {
      const { error } = await supabase.from('academy_registrations').insert({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        course: formData.course,
        message: formData.message.trim(),
      });
      if (error) throw error;
      setStatus('success');
      setFormData({ full_name: '', email: '', phone: '', course: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const updateField = (key: keyof typeof formData, value: string) => {
    setFormData((p) => ({ ...p, [key]: value }));
    if (status === 'error' || status === 'success') setStatus('idle');
  };

  const navLinks = [
    { id: 'home', label: tr(t.nav.home) },
    { id: 'about', label: tr(t.nav.about) },
    { id: 'courses', label: tr(t.nav.courses) },
    { id: 'features', label: tr(t.nav.features) },
    { id: 'testimonials', label: tr(t.nav.testimonials) },
    { id: 'register', label: tr(t.nav.register) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-200 overflow-x-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-lg shadow-sky-100/50 dark:shadow-slate-950/50 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('home')}>
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-slate-300 flex items-center justify-center shadow-lg shadow-amber-200/40 ring-1 ring-white/60">
              <span className="font-display font-bold text-white text-lg drop-shadow">CX</span>
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-lg text-slate-800 dark:text-white">MR Codex</div>
              <div className="text-[11px] tracking-wide text-sky-600 dark:text-sky-400 font-medium">{tr(t.footer.future)}</div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => handleNav(l.id)}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 right-0 w-0 group-hover:w-full h-0.5 bg-sky-500 transition-all duration-300" />
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-sky-100/60 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle language"
              title={isRtl ? 'English' : 'العربية'}
            >
              <Languages className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-sky-100/60 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
              title={theme === 'light' ? (isRtl ? 'الوضع الداكن' : 'Dark mode') : (isRtl ? 'الوضع الفاتح' : 'Light mode')}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => handleNav('register')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-sky-600 to-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-200/50 hover:shadow-sky-300/60 hover:-translate-y-0.5 transition-all"
            >
              {isRtl ? 'ابدأ التسجيل' : 'Start Registration'}
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleLang}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-sky-100/60 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle language"
            >
              <Languages className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-sky-100/60 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-sky-100/60 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setNavOpen((v) => !v)}
              aria-label="Menu"
            >
              {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {navOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-sky-100 dark:border-slate-800 mt-3">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleNav(l.id)}
                  className={`block w-full ${isRtl ? 'text-right' : 'text-left'} px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" ref={heroRef} className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 -left-24 w-96 h-96 bg-sky-200/40 dark:bg-sky-500/10 rounded-full blur-3xl animate-floaty" />
          <div className="absolute bottom-10 -right-24 w-96 h-96 bg-amber-100/50 dark:bg-amber-500/10 rounded-full blur-3xl animate-floaty" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-sky-100/40 dark:bg-sky-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className={`text-center ${isRtl ? 'lg:text-right' : 'lg:text-left'} animate-fade-up`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100/80 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-sm font-semibold mb-6 border border-sky-200/60 dark:border-sky-800/60">
              <Sparkles className="w-4 h-4" />
              {tr(t.hero.badge)}
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.15] text-balance text-slate-900 dark:text-white">
              <span className="gold-text animate-shimmer">{t.hero.title1}</span>
              <br />
              <span className="text-slate-800 dark:text-slate-200">{tr(t.hero.title2)}</span>
              <span className={theme === 'dark' ? 'silver-text-dark' : 'silver-text'}> {tr(t.hero.title3)}</span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {tr(t.hero.desc)}
            </p>

            <div className={`mt-8 flex flex-wrap gap-4 justify-center ${isRtl ? 'lg:justify-start' : 'lg:justify-start'}`}>
              <button
                onClick={() => handleNav('courses')}
                className="group px-7 py-3.5 rounded-xl bg-gradient-to-l from-sky-600 to-sky-500 text-white font-semibold shadow-xl shadow-sky-200/50 dark:shadow-sky-900/50 hover:-translate-y-1 hover:shadow-sky-300/60 transition-all flex items-center gap-2"
              >
                {tr(t.hero.cta1)}
                <ArrowLeft className={`w-5 h-5 group-hover:-translate-x-1 transition-transform ${isRtl ? '' : 'rotate-180'}`} />
              </button>
              <button
                onClick={() => handleNav('register')}
                className="px-7 py-3.5 rounded-xl bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-400 font-semibold border-2 border-sky-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-600 hover:bg-sky-50 dark:hover:bg-slate-700 transition-all"
              >
                {tr(t.hero.cta2)}
              </button>
            </div>

            <div className={`mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto lg:mx-0`}>
              {STATS.map((s) => (
                <div key={s.value} className={`text-center ${isRtl ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className="font-display font-bold text-2xl sm:text-3xl text-sky-700 dark:text-sky-400">{s.value}</div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{tr(s.label)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-sky-200/50 dark:shadow-sky-900/50 ring-1 ring-white/60 dark:ring-slate-700">
              <img
                src={HERO_IMG}
                alt="MR Codex Academy"
                className="w-full h-[420px] sm:h-[520px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/30 via-transparent to-transparent dark:from-sky-900/50" />
            </div>

            <div className={`absolute -top-6 ${isRtl ? '-right-6 sm:-right-8' : '-left-6 sm:-left-8'} animate-floaty`}>
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-500 to-slate-300 flex items-center justify-center shadow-2xl shadow-amber-300/50 ring-2 ring-white/70 dark:ring-slate-700 pulse-ring">
                <span className="font-display font-bold text-white text-2xl sm:text-3xl drop-shadow-lg">CX</span>
              </div>
            </div>

            <div className={`absolute -bottom-6 ${isRtl ? '-left-4 sm:-left-8' : '-right-4 sm:-right-8'} bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-sky-100 dark:shadow-sky-900/30 p-4 flex items-center gap-3 max-w-[240px] animate-floaty`} style={{ animationDelay: '1s' }}>
              <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{tr(t.hero.floatCard)}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{tr(t.hero.floatCardSub)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-sky-100 dark:shadow-sky-900/30 ring-1 ring-sky-100 dark:ring-slate-700">
                <img
                  src={ABOUT_IMG}
                  alt="MR Codex"
                  className="w-full h-[380px] sm:h-[460px] object-cover"
                  loading="lazy"
                />
              </div>
              <div className={`absolute -bottom-5 ${isRtl ? 'right-6' : 'left-6'} bg-gradient-to-l from-sky-600 to-sky-500 text-white rounded-2xl px-6 py-4 shadow-xl shadow-sky-200 dark:shadow-sky-900/50`}>
                <div className="font-display font-bold text-2xl">+5</div>
                <div className="text-xs text-sky-100">{tr(t.about.exp)}</div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-5 border border-amber-100 dark:border-amber-800/50">
                <BookOpen className="w-4 h-4" />
                {tr(t.about.badge)}
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight mb-5">
                {tr(t.about.title)}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                {tr(t.about.p1)}
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-7">
                {tr(t.about.p2)}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {t.about.items.map((item) => (
                  <div key={item.t.en} className="flex items-start gap-3 p-4 rounded-2xl bg-sky-50/70 dark:bg-slate-800 border border-sky-100 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm shrink-0">
                      <Star className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{tr(item.t)}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{tr(item.d)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-24 bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-sm font-semibold mb-5">
              <Code2 className="w-4 h-4" />
              {tr(t.courses.badge)}
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">
              {tr(t.courses.title)}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {tr(t.courses.desc)}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((c, i) => (
              <article
                key={c.id}
                className="group bg-white dark:bg-slate-800 rounded-3xl p-6 border border-sky-100/70 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:shadow-sky-100/60 dark:hover:shadow-sky-900/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
                onClick={() => setOpenCourse(openCourse === c.id ? null : c.id)}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.accent} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform`}>
                  <c.icon className="w-7 h-7 text-white" />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{tr(c.duration)}</span>
                  <span className="text-sky-300">•</span>
                  <span>{tr(c.level)}</span>
                </div>

                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">{tr(c.title)}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{tr(c.description)}</p>

                <div className={`overflow-hidden transition-all duration-500 ${openCourse === c.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pt-4 border-t border-sky-100 dark:border-slate-700">
                    <div className="text-xs font-semibold text-sky-700 dark:text-sky-400 mb-2">{tr(t.courses.learn)}</div>
                    <ul className="space-y-1.5">
                      {c.topics.map((tp) => (
                        <li key={tp.en} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          {tr(tp)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenCourse(openCourse === c.id ? null : c.id);
                  }}
                  className="mt-4 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 flex items-center gap-1.5 transition-colors"
                >
                  {openCourse === c.id ? tr(t.courses.hide) : tr(t.courses.show)}
                  <ArrowLeft className={`w-4 h-4 transition-transform ${openCourse === c.id ? 'rotate-90' : ''} ${isRtl ? '' : 'rotate-180'}`} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-5 border border-amber-100 dark:border-amber-800/50">
              <Sparkles className="w-4 h-4" />
              {tr(t.features.badge)}
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">
              {tr(t.features.title)}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">{tr(t.features.desc)}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title.en}
                className="group relative p-7 rounded-3xl bg-gradient-to-br from-sky-50 to-white dark:from-slate-800 dark:to-slate-800 border border-sky-100 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sky-100/50 dark:hover:shadow-sky-900/30 animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">{tr(f.title)}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tr(f.text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-sm font-semibold mb-5">
              <Quote className="w-4 h-4" />
              {tr(t.testimonials.badge)}
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">
              {tr(t.testimonials.title)}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">{tr(t.testimonials.desc)}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((tm, i) => (
              <div
                key={tm.name.en}
                className="bg-white dark:bg-slate-800 rounded-3xl p-7 border border-sky-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-sky-100/50 dark:hover:shadow-sky-900/30 transition-all animate-fade-up flex flex-col"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-sky-200 dark:text-sky-700 mb-3" />
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 flex-1">{tr(tm.text)}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-sky-50 dark:border-slate-700">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {tr(tm.name).charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{tr(tm.name)}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{tr(tm.role)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Register */}
      <section id="register" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden shadow-2xl shadow-sky-100 dark:shadow-sky-900/30 border border-sky-100 dark:border-slate-700">
            {/* Side panel */}
            <div className="lg:col-span-2 bg-gradient-to-br from-sky-600 via-sky-700 to-sky-800 p-8 sm:p-10 text-white relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 -right-10 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl" />

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 to-slate-300 flex items-center justify-center shadow-lg mb-6 ring-1 ring-white/30">
                  <span className="font-display font-bold text-white text-xl">CX</span>
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl mb-4 leading-tight">
                  {tr(t.register.title)}
                </h2>
                <p className="text-sky-100 leading-relaxed mb-8">
                  {tr(t.register.desc)}
                </p>

                <ul className="space-y-4">
                  {t.register.benefits.map((b) => (
                    <li key={b.en} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                      <span className="text-sm text-sky-50">{tr(b)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 pt-6 border-t border-white/15 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-sky-100">
                    <Mail className="w-4 h-4 text-amber-300" />
                    mohabashraf110@gmail.com
                  </div>
                  <div className="flex items-center gap-3 text-sm text-sky-100">
                    <Phone className="w-4 h-4 text-amber-300" />
                    +20 101 881 2803
                  </div>
                  <div className="flex items-center gap-3 text-sm text-sky-100">
                    <MapPin className="w-4 h-4 text-amber-300" />
                    {tr(t.register.location)}
                  </div>
                  <a
                    href={FB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm text-sky-50 transition-all"
                  >
                    <Facebook className="w-4 h-4 text-amber-300" />
                    {tr(t.register.facebook)}
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3 p-8 sm:p-10 bg-white dark:bg-slate-800">
              <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-1">{tr(t.register.formTitle)}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-7">{tr(t.register.formHint)}</p>

              {status === 'success' && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3 animate-fade-up">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">{tr(t.register.success)}</div>
                    <div className="text-sm text-emerald-700 dark:text-emerald-400 mt-0.5">{tr(t.register.successDesc)}</div>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 flex items-start gap-3 animate-fade-up">
                  <X className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-rose-800 dark:text-rose-300 text-sm">{tr(t.register.error)}</div>
                    <div className="text-sm text-rose-700 dark:text-rose-400 mt-0.5">{tr(t.register.errorDesc)}</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field
                    label={tr(t.register.name)}
                    value={formData.full_name}
                    onChange={(v) => updateField('full_name', v)}
                    type="text"
                    placeholder={tr(t.register.namePh)}
                    required
                    dark={theme === 'dark'}
                  />
                  <Field
                    label={tr(t.register.email)}
                    value={formData.email}
                    onChange={(v) => updateField('email', v)}
                    type="email"
                    placeholder="you@example.com"
                    required
                    dark={theme === 'dark'}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field
                    label={tr(t.register.phone)}
                    value={formData.phone}
                    onChange={(v) => updateField('phone', v)}
                    type="tel"
                    placeholder={t.register.phonePh}
                    required
                    dark={theme === 'dark'}
                  />
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{tr(t.register.course)}</label>
                    <select
                      required
                      value={formData.course}
                      onChange={(e) => updateField('course', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-sky-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all text-sm"
                    >
                      <option value="" disabled>{tr(t.register.selectCourse)}</option>
                      {COURSES.map((c) => (
                        <option key={c.id} value={tr(c.title)}>{tr(c.title)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{tr(t.register.message)}</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    rows={4}
                    maxLength={1000}
                    placeholder={tr(t.register.messagePh)}
                    className="w-full px-4 py-3 rounded-xl border border-sky-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-l from-sky-600 to-sky-500 text-white font-semibold shadow-lg shadow-sky-200/50 dark:shadow-sky-900/50 hover:shadow-sky-300/60 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {status === 'submitting' ? (
                    <>{tr(t.register.submitting)}</>
                  ) : (
                    <>
                      {tr(t.register.submit)}
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black text-slate-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-slate-300 flex items-center justify-center shadow-lg ring-1 ring-white/20">
                  <span className="font-display font-bold text-white text-lg">CX</span>
                </div>
                <div>
                  <div className="font-display font-bold text-white">MR Codex</div>
                  <div className="text-xs text-sky-400">{tr(t.footer.future)}</div>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {tr(t.footer.desc)}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">{tr(t.footer.quickLinks)}</h4>
              <ul className="space-y-2.5 text-sm">
                {navLinks.slice(0, 4).map((l) => (
                  <li key={l.id}>
                    <button onClick={() => handleNav(l.id)} className="text-slate-400 hover:text-sky-400 transition-colors">
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">{tr(t.footer.courses)}</h4>
              <ul className="space-y-2.5 text-sm">
                {COURSES.slice(0, 4).map((c) => (
                  <li key={c.id}>
                    <button onClick={() => handleNav('courses')} className={`text-slate-400 hover:text-sky-400 transition-colors ${isRtl ? 'text-right' : 'text-left'}`}>
                      {tr(c.title)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">{tr(t.footer.contact)}</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-sky-400" /> mohabashraf110@gmail.com</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-sky-400" /> +20 101 881 2803</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sky-400" /> {tr(t.register.location)}</li>
              </ul>
              <a
                href={FB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-sky-600/20 hover:bg-sky-600/40 text-sm text-sky-300 hover:text-white transition-all"
              >
                <Facebook className="w-4 h-4" />
                {tr(t.register.facebook)}
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} MR Codex Academy. {tr(t.footer.rights)}</p>
            <p className="text-xs">{tr(t.footer.designed)}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Field({
  label, value, onChange, type, placeholder, required, dark,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder?: string;
  required?: boolean;
  dark?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-sky-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
      />
    </div>
  );
}
