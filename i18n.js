const translations = {
    en: {
        nav: { dashboard: "Dashboard", family: "Family", history: "History", statistics: "Statistics", settings: "Settings" },
        dashboard: {
            familyProgressToday: "Family Progress Today",
            nextPrayer: "Next Prayer",
            todaysPrayerWindows: "Today's Prayer Windows",
            startsAt: "Starts at ",
            start: "Start",
            end: "End",
            prayers: "Prayers",
            onTime: "On Time",
            late: "Late",
            pending: "Pending",
            missed: "Missed",
            completed: "Completed",
            completionRate: "Completion Rate",
            noPrayersMarked: "No prayers marked yet today",
            loadingPrayerTimes: "Loading prayer times...",
            usingFallbackTimes: "Using fallback prayer times"
        },
        prayer: {
            fajr: "Fajr", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha"
        },
        status: {
            upcoming: "Upcoming", active: "Active", completed: "Completed", missed: "Missed", pending: "Pending", onTime: "On time", late: "Late", loading: "Loading"
        },
        family: {
            title: "Family Members",
            markAsPrayed: "Mark as Prayed",
            prayerDetails: "Prayer Details",
            streak: "Streak",
            perfectDay: "Perfect Day",
            inProgress: "In Progress",
            notStarted: "Not Started",
            needsAttention: "Needs Attention",
            addNote: "Add Note",
            save: "Save",
            cancel: "Cancel",
            undo: "Undo",
            edit: "Edit",
            done: "Done",
            marked: "Marked"
        },
        history: {
            title: "Prayer History",
            subtitle: "Track prayer consistency by date, member, and status",
            dateRange: "Date Range",
            member: "Member",
            allFamily: "All Family",
            prayer: "Prayer",
            allPrayers: "All Prayers",
            status: "Status",
            allStatuses: "All Statuses",
            searchPlaceholder: "Search by member or note...",
            resetFilters: "Reset Filters",
            export: "Export",
            totalRecords: "Total Records",
            table: "Table",
            timeline: "Timeline",
            calendar: "Calendar",
            noRecords: "No prayer history found for this filter",
            to: "to"
        },
        stats: {
            title: "Statistics & Insights",
            today: "Today",
            thisWeek: "This Week",
            thisMonth: "This Month",
            allTime: "All Time",
            completionRate: "Completion Rate",
            onTimePercentage: "On-time Percentage",
            bestStreak: "Best Streak",
            mostConsistentMember: "Most Consistent Member",
            mostMissedPrayer: "Most Missed Prayer",
            prayerPerformance: "Prayer Performance",
            memberPerformance: "Member Performance",
            progressTrend: "Progress Trend"
        },
        settings: {
            title: "Settings",
            subtitle: "Manage prayer times, appearance, language, and data.",
            locLogic: "Location & Prayer Method",
            city: "City",
            country: "Country",
            prayerMethod: "Prayer Method",
            prayerSource: "Prayer Source",
            saveSettings: "Save Settings",
            appearanceLanguage: "Appearance & Language",
            language: "Language",
            theme: "Theme",
            lightMode: "Light Mode",
            darkMode: "Dark Mode",
            animations: "Animations",
            celebrations: "Celebrations",
            dataManagement: "Data Management",
            exportJson: "Export JSON",
            exportCsv: "Export CSV",
            importBackup: "Import Backup",
            clearAllData: "Clear All Data",
            warning: "This action cannot be undone",
            areYouSure: "Are you sure?",
            cancel: "Cancel",
            confirm: "Confirm",
            locHelper: "Used to calculate daily prayer times.",
            emptyCity: "Please enter a city.",
            emptyCountry: "Please enter a country."
        },
        modals: {
            verify: "Verify Identity",
            enterPass: "Enter password for",
            password: "Password",
            confirm: "Confirm",
            upcoming: "Upcoming",
            markDone: "Mark Done",
            startsAt: "Starts at",
            completedText: "Completed",
            prayersText: "prayers"
        },
        messages: {
            settingsSaved: "Settings saved successfully.",
            incorrectPass: "Incorrect password.",
            marked: "marked",
            dayRefreshed: "Day refreshed. Assalamu Alaikum!",
            fallback: "Could not load prayer times for this location. Using fallback times.",
            restored: "Backup restored successfully.",
            invalidBackup: "Invalid backup file.",
            resetWarn: "Are you sure you want to clear ALL prayer history? This cannot be undone.",
            resetDone: "All data has been reset.",
            mostMissed: "Most missed/late prayer is",
            highestRate: "has the highest on-time rate."
        }
    },
    tr: {
        nav: { dashboard: "Ana Sayfa", family: "Aile", history: "Geçmiş", statistics: "İstatistikler", settings: "Ayarlar" },
        dashboard: {
            familyProgressToday: "Bugünkü Aile İlerlemesi",
            nextPrayer: "Sonraki Namaz",
            todaysPrayerWindows: "Bugünün Namaz Vakitleri",
            startsAt: "Başlama zamanı ",
            start: "Başlangıç",
            end: "Bitiş",
            prayers: "Namazlar",
            onTime: "Vaktinde",
            late: "Geç",
            pending: "Beklemede",
            missed: "Kaçırıldı",
            completed: "Tamamlandı",
            completionRate: "Tamamlanma Oranı",
            noPrayersMarked: "Bugün henüz namaz işaretlenmedi",
            loadingPrayerTimes: "Namaz vakitleri yükleniyor...",
            usingFallbackTimes: "Yedek namaz vakitleri kullanılıyor"
        },
        prayer: {
            fajr: "Sabah", dhuhr: "Öğle", asr: "İkindi", maghrib: "Akşam", isha: "Yatsı"
        },
        status: {
            upcoming: "Yaklaşan", active: "Aktif", completed: "Tamamlandı", missed: "Kaçırıldı", pending: "Beklemede", onTime: "Vaktinde", late: "Geç", loading: "Yükleniyor"
        },
        family: {
            title: "Aile Üyeleri",
            markAsPrayed: "Kılındı İşaretle",
            prayerDetails: "Namaz Detayları",
            streak: "Seri",
            perfectDay: "Mükemmel Gün",
            inProgress: "Devam Ediyor",
            notStarted: "Başlanmadı",
            needsAttention: "Dikkat Gerekiyor",
            addNote: "Not Ekle",
            save: "Kaydet",
            cancel: "İptal",
            undo: "Geri Al",
            edit: "Düzenle",
            done: "Yapıldı",
            marked: "İşaretlendi"
        },
        history: {
            title: "Namaz Geçmişi",
            subtitle: "Tarih, üye ve duruma göre namaz tutarlılığını takip edin",
            dateRange: "Tarih Aralığı",
            member: "Üye",
            allFamily: "Tüm Aile",
            prayer: "Namaz",
            allPrayers: "Tüm Namazlar",
            status: "Durum",
            allStatuses: "Tüm Durumlar",
            searchPlaceholder: "Üye veya not ile ara...",
            resetFilters: "Filtreleri Sıfırla",
            export: "Dışa Aktar",
            totalRecords: "Toplam Kayıt",
            table: "Tablo",
            timeline: "Zaman Çizelgesi",
            calendar: "Takvim",
            noRecords: "Bu filtre için kayıt bulunamadı",
            to: "-",
            noData: "Veri Yok"
        },
        stats: {
            title: "İstatistikler",
            today: "Bugün",
            thisWeek: "Bu Hafta",
            thisMonth: "Bu Ay",
            allTime: "Tüm Zamanlar",
            completionRate: "Tamamlanma Oranı",
            onTimePercentage: "Vaktinde Oranı",
            bestStreak: "En İyi Seri",
            mostConsistentMember: "En İstikrarlı Üye",
            mostMissedPrayer: "En Çok Kaçırılan Namaz",
            prayerPerformance: "Namaz Performansı",
            memberPerformance: "Üye Performansı",
            progressTrend: "İlerleme Trendi"
        },
        settings: {
            title: "Ayarlar",
            subtitle: "Namaz vakitlerini, görünümü, dili ve verileri yönetin",
            locLogic: "Konum ve Namaz Vakti Yöntemi",
            city: "Şehir",
            country: "Ülke",
            prayerMethod: "Namaz Yöntemi",
            prayerSource: "Namaz Vakti Kaynağı",
            saveSettings: "Ayarları Kaydet",
            appearanceLanguage: "Görünüm ve Dil",
            language: "Dil",
            theme: "Tema",
            lightMode: "Açık Mod",
            darkMode: "Koyu Mod",
            animations: "Animasyonlar",
            celebrations: "Kutlamalar",
            dataManagement: "Veri Yönetimi",
            exportJson: "JSON Dışa Aktar",
            exportCsv: "CSV Dışa Aktar",
            importBackup: "Yedek İçe Aktar",
            clearAllData: "Tüm Verileri Sil",
            warning: "Bu işlem geri alınamaz",
            areYouSure: "Emin misiniz?",
            cancel: "İptal",
            confirm: "Onayla",
            locHelper: "Günlük namaz vakitlerini hesaplamak için kullanılır.",
            emptyCity: "Lütfen şehir girin.",
            emptyCountry: "Lütfen ülke girin."
        },
        modals: {
            verify: "Kimliği Doğrula",
            enterPass: "Şifrenizi girin:",
            password: "Şifre",
            confirm: "Onayla",
            upcoming: "Yaklaşan",
            markDone: "Kılındı İşaretle",
            startsAt: "Başlama:",
            completedText: "Tamamlandı",
            prayersText: "namaz"
        },
        messages: {
            settingsSaved: "Ayarlar başarıyla kaydedildi.",
            incorrectPass: "Hatalı şifre.",
            marked: "olarak işaretlendi:",
            dayRefreshed: "Gün yenilendi. Selamün Aleyküm!",
            fallback: "Bu konum için namaz vakitleri yüklenemedi. Yerel yedek vakitler kullanılıyor.",
            restored: "Yedek başarıyla geri yüklendi.",
            invalidBackup: "Geçersiz yedek dosyası.",
            resetWarn: "Tüm namaz geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
            resetDone: "Tüm veriler sıfırlandı.",
            mostMissed: "En çok kaçırılan/geciken namaz:",
            highestRate: "en yüksek vaktinde kılma oranına sahip."
        }
    },
    ar: {
        nav: { dashboard: "الرئيسية", family: "العائلة", history: "السجل", statistics: "الإحصائيات", settings: "الإعدادات" },
        dashboard: {
            familyProgressToday: "تقدم العائلة اليوم",
            nextPrayer: "الصلاة القادمة",
            todaysPrayerWindows: "أوقات الصلاة اليوم",
            startsAt: "تبدأ في ",
            start: "البداية",
            end: "النهاية",
            prayers: "صلوات",
            onTime: "في الوقت",
            late: "متأخرة",
            pending: "قيد الانتظار",
            missed: "فائتة",
            completed: "مكتملة",
            completionRate: "نسبة الإنجاز",
            noPrayersMarked: "لم يتم تسجيل أي صلاة اليوم بعد",
            loadingPrayerTimes: "جاري تحميل أوقات الصلاة...",
            usingFallbackTimes: "يتم استخدام أوقات صلاة احتياطية"
        },
        prayer: {
            fajr: "الفجر", dhuhr: "الظهر", asr: "العصر", maghrib: "المغرب", isha: "العشاء"
        },
        status: {
            upcoming: "قادمة", active: "نشطة", completed: "مكتملة", missed: "فائتة", pending: "قيد الانتظار", onTime: "في الوقت", late: "متأخرة", loading: "جاري التحميل"
        },
        family: {
            title: "أفراد العائلة",
            markAsPrayed: "تحديد كمصلى",
            prayerDetails: "تفاصيل الصلاة",
            streak: "المواظبة",
            perfectDay: "يوم مثالي",
            inProgress: "قيد الإنجاز",
            notStarted: "لم تبدأ",
            needsAttention: "بحاجة لاهتمام",
            addNote: "إضافة ملاحظة",
            save: "حفظ",
            cancel: "إلغاء",
            undo: "تراجع",
            edit: "تعديل",
            done: "تمت",
            marked: "تم التسجيل"
        },
        history: {
            title: "سجل الصلوات",
            subtitle: "تتبع المواظبة على الصلاة حسب التاريخ والفرد والحالة",
            dateRange: "نطاق التاريخ",
            member: "الفرد",
            allFamily: "كل العائلة",
            prayer: "الصلاة",
            allPrayers: "كل الصلوات",
            status: "الحالة",
            allStatuses: "كل الحالات",
            searchPlaceholder: "البحث حسب الفرد أو الملاحظة...",
            resetFilters: "إعادة ضبط الفلاتر",
            export: "تصدير",
            totalRecords: "إجمالي السجلات",
            table: "الجدول",
            timeline: "الجدول الزمني",
            calendar: "التقويم",
            noRecords: "لم يتم العور على سجلات صلاة",
            to: "إلى",
            noData: "لا بيانات"
        },
        stats: {
            title: "الإحصائيات والرؤى",
            today: "اليوم",
            thisWeek: "هذا الأسبوع",
            thisMonth: "هذا الشهر",
            allTime: "كل الوقت",
            completionRate: "نسبة الإنجاز",
            onTimePercentage: "نسبة الصلاة في الوقت",
            bestStreak: "أفضل مواظبة",
            mostConsistentMember: "العضو الأكثر التزاماً",
            mostMissedPrayer: "أكثر صلاة فائتة",
            prayerPerformance: "أداء الصلوات",
            memberPerformance: "أداء الأعضاء",
            progressTrend: "اتجاه التقدم"
        },
        settings: {
            title: "الإعدادات",
            subtitle: "إدارة أوقات الصلاة والمظهر واللغة والبيانات",
            locLogic: "الموقع وطريقة حساب الصلاة",
            city: "المدينة",
            country: "البلد",
            prayerMethod: "طريقة حساب الصلاة",
            prayerSource: "مصدر أوقات الصلاة",
            saveSettings: "حفظ الإعدادات",
            appearanceLanguage: "المظهر واللغة",
            language: "اللغة",
            theme: "المظهر",
            lightMode: "الوضع الفاتح",
            darkMode: "الوضع الداكن",
            animations: "الرسوم المتحركة",
            celebrations: "الاحتفالات",
            dataManagement: "إدارة البيانات",
            exportJson: "تصدير JSON",
            exportCsv: "تصدير CSV",
            importBackup: "استيراد نسخة احتياطية",
            clearAllData: "مسح كل البيانات",
            warning: "لا يمكن التراجع عن هذا الإجراء",
            areYouSure: "هل أنت متأكد؟",
            cancel: "إلغاء",
            confirm: "تأكيد",
            locHelper: "يُستخدم لحساب أوقات الصلاة اليومية.",
            emptyCity: "يرجى إدخال المدينة.",
            emptyCountry: "يرجى إدخال البلد."
        },
        modals: {
            verify: "التحقق من الهوية",
            enterPass: "أدخل كلمة المرور لـ",
            password: "كلمة المرور",
            confirm: "تأكيد",
            upcoming: "قادمة",
            markDone: "تمت",
            startsAt: "تبدأ في",
            completedText: "مكتملة",
            prayersText: "صلوات"
        },
        messages: {
            settingsSaved: "تم حفظ الإعدادات بنجاح.",
            incorrectPass: "كلمة المرور خاطئة.",
            marked: "سجل",
            dayRefreshed: "يوم جديد. السلام عليكم!",
            fallback: "تعذر تحميل أوقات الصلاة لهذا الموقع. استخدام أوقات محلية احتياطية.",
            restored: "تم استعادة النسخة الاحتياطية.",
            invalidBackup: "ملف احتياطي غير صالح.",
            resetWarn: "هل أنت متأكد أنك تريد مسح كل السجلات؟ لا يمكن التراجع عن هذا الإجراء.",
            resetDone: "تم مسح كل البيانات.",
            mostMissed: "أكثر صلاة متأخرة أو فائتة هي",
            highestRate: "لديه أعلى نسبة صلاة في الوقت."
        }
    }
};

function getSavedLanguage() {
    return localStorage.getItem('askarFamilyLanguage') || 'en';
}

let currentLanguage = getSavedLanguage();

function t(key) {
    const lang = currentLanguage || "en";
    const keys = key.split('.');
    let val = translations[lang];
    for (let k of keys) {
        if (val) val = val[k];
        else break;
    }
    if (val === undefined || typeof val !== 'string') {
        val = translations['en'];
        for (let k of keys) {
            if (val) val = val[k];
            else break;
        }
        if (val === undefined || typeof val !== 'string') {
            console.warn(`Missing key: ${key} in lang: ${lang}`);
            return key;
        }
    }
    return val;
}

function setLanguage(lang) {
    currentLanguage = lang;
    if (typeof appState !== 'undefined') appState.language = lang;
    localStorage.setItem('askarFamilyLanguage', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    applyTranslations();
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    if (typeof renderPage === 'function' && typeof appState !== 'undefined') {
        renderPage(appState.currentPage || "dashboard");
    }
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
    });
    const settingsLang = document.getElementById('setting-language');
    if (settingsLang) settingsLang.value = currentLanguage;
}

document.documentElement.lang = currentLanguage;
document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';

window.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.lang-btn');
            if (targetBtn) setLanguage(targetBtn.dataset.lang);
        });
    });
});
