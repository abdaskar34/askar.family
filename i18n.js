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
            usingFallbackTimes: "Using fallback prayer times",
            currentTime: "Current Time",
            today: "Today",
            tomorrow: "Tomorrow",
            prayerSource: "Prayer Source"
        },
        prayer: {
            fajr: "Fajr", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha"
        },
        status: {
            upcoming: "Upcoming", active: "Active", completed: "Completed", missed: "Missed", pending: "Pending", onTime: "On time", late: "Late", loading: "Loading", fallback: "Using fallback prayer times", marked: "Marked"
        },
        family: {
            title: "Family Members",
            subtitle: "Track individual progress and streaks",
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
            done: "Completed",
            completed: "Completed",
            honestyReminder: "Honest confirmation before marking this prayer.",
            lastMarked: "Last marked: {prayer} at {time}",
            noActivity: "No prayer marked today",
            open: "Open",
            pendingOrMissed: "Pending/Missed",
            onTime: "On-time",
            late: "Late",
            motivationalNote: '"Establish prayer, for indeed prayer prevents immorality and wrongdoing." (Quran 29:45)'
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
            to: "to",
            noData: "No Data",
            statusDist: "Status Distribution",
            prayerPerf: "Prayer Performance",
            memberSummary: "Member Summary",
            consistencyHeatmap: "Family Consistency Heatmap",
            good: "Good",
            partial: "Partial",
            weak: "Weak",
            detailedRecords: "Detailed Records",
            date: "Date",
            time: "Time"
        },
        stats: {
            title: "Statistics & Insights",
            subtitle: "Visual prayer consistency overview",
            today: "Today",
            thisWeek: "This Week",
            thisMonth: "This Month",
            allTime: "All Time",
            overallPerf: "Overall Performance",
            memberComp: "Member Comparison",
            overallPerformance: "Overall Performance",
            memberComparison: "Member Comparison",
            prayerPerformance: "Prayer Performance",
            progressTrend: "Progress Trend",
            completionRate: "Completion Rate",
            onTimePercentage: "On-time Percentage",
            onTimeRate: "On-time Rate",
            totalCompleted: "Total Completed",
            totalMissed: "Total Missed",
            totalLate: "Total Late",
            noData: "No data yet",
            noDataDescription: "Start marking prayers to see statistics here.",
            goToFamily: "Go to Family",
            bestMember: "Best Member",
            bestPrayer: "Best Prayer",
            mostMissedPrayer: "Most Missed Prayer",
            familyAverage: "Family Average",
            onTime: "On Time",
            late: "Late",
            missed: "Missed",
            pending: "Pending",
            completed: "Completed"
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
            emptyCountry: "Please enter a country.",
            fallbackWarning: "Using fallback prayer times",
            resetPreferences: "Reset Preferences",
            enterPassToCont: "Enter password to continue",
            password: "Password",
            wrongPassword: "Wrong password",
            cloudDatabase: "Shared Cloud Database",
            sheetUrlLabel: "Google Sheets API URL",
            sheetUrlHelper: "Paste your deployed Google Apps Script Web App URL.",
            sheetPasscodeLabel: "API Passcode",
            sheetPasscodeHelper: "Enter the passcode configured in your Google Apps Script.",
            saveConnection: "Save & Connect",
            statusLabel: "Status:",
            statusDisconnected: "Disconnected",
            statusConnected: "Connected",
            statusSyncing: "Syncing...",
            statusError: "Sync Error",
            syncSuccess: "Successfully synchronized with Google Sheet",
            syncError: "Error syncing with cloud database",
            syncingText: "Syncing with Google Sheet...",
            lastSyncLabel: "Last Sync:"
        },
        modals: {
            confirm: "Confirm",
            upcoming: "Upcoming",
            markDone: "Mark Done",
            startsAt: "Starts at",
            completedText: "Completed",
            prayersText: "prayers"
        },
        messages: {
            settingsSaved: "Settings saved successfully.",
            marked: "marked",
            dayRefreshed: "Day refreshed. Assalamu Alaikum!",
            fallback: "Could not load prayer times for this location. Using fallback times.",
            restored: "Backup restored successfully.",
            invalidBackup: "Invalid backup file.",
            resetWarn: "Are you sure you want to clear ALL prayer history? This cannot be undone.",
            resetDone: "All data has been cleared",
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
            usingFallbackTimes: "Yedek namaz vakitleri kullanılıyor",
            currentTime: "Şu Anki Saat",
            today: "Bugün",
            tomorrow: "Yarın",
            prayerSource: "Namaz Vakti Kaynağı"
        },
        prayer: {
            fajr: "Sabah", dhuhr: "Öğle", asr: "İkindi", maghrib: "Akşam", isha: "Yatsı"
        },
        status: {
            upcoming: "Yaklaşan", active: "Aktif", completed: "Tamamlandı", missed: "Kaçırıldı", pending: "Beklemede", onTime: "Vaktinde", late: "Geç", loading: "Yükleniyor", fallback: "Yedek namaz vakitleri kullanılıyor", marked: "İşaretlendi"
        },
        family: {
            title: "Aile Üyeleri",
            subtitle: "Bireysel ilerlemeyi ve serileri takip edin",
            markAsPrayed: "Kılındı Olarak İşaretle",
            prayerDetails: "Namaz Detayları",
            streak: "Seri",
            perfectDay: "Mükemmel Gün",
            inProgress: "Devam Ediyor",
            notStarted: "Başlanmadı",
            needsAttention: "Dikkat Gerekli",
            addNote: "Not Ekle",
            save: "Kaydet",
            cancel: "İptal",
            undo: "Geri Al",
            edit: "Düzenle",
            done: "Tamamlanan",
            completed: "Tamamlandı",
            honestyReminder: "Bu namazı işaretlemeden önce samimi onay.",
            lastMarked: "Son işaretlenen: {prayer} {time}",
            noActivity: "Bugün namaz işaretlenmedi",
            open: "Aç",
            pendingOrMissed: "Kalan/Kaçan",
            onTime: "Vaktinde",
            late: "Geç",
            motivationalNote: '"Namazı kıl; şüphesiz namaz, kötülükten ve fenalıktan alıkoyar." (Ankebut 29:45)'
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
            noData: "Veri Yok",
            statusDist: "Durum Dağılımı",
            prayerPerf: "Namaz Performansı",
            memberSummary: "Üye Özeti",
            consistencyHeatmap: "Aile Tutarlılık Haritası",
            good: "İyi",
            partial: "Kısmi",
            weak: "Zayıf",
            detailedRecords: "Detaylı Kayıtlar",
            date: "Tarih",
            time: "Zaman"
        },
        stats: {
            title: "İstatistikler ve İçgörüler",
            subtitle: "Görsel namaz düzeni özeti",
            today: "Bugün",
            thisWeek: "Bu Hafta",
            thisMonth: "Bu Ay",
            allTime: "Tüm Zamanlar",
            overallPerf: "Genel Performans",
            memberComp: "Üye Karşılaştırması",
            overallPerformance: "Genel Performans",
            memberComparison: "Üye Karşılaştırması",
            prayerPerformance: "Namaz Performansı",
            progressTrend: "İlerleme Eğilimi",
            completionRate: "Tamamlanma Oranı",
            onTimePercentage: "Vaktinde Oranı",
            onTimeRate: "Vaktinde Kılma Oranı",
            totalCompleted: "Toplam Tamamlanan",
            totalMissed: "Toplam Kaçırılan",
            totalLate: "Toplam Geç",
            noData: "Henüz veri yok",
            noDataDescription: "İstatistikleri görmek için namazları işaretlemeye başlayın.",
            goToFamily: "Aileye Git",
            bestMember: "En İyi Üye",
            bestPrayer: "En İyi Namaz",
            mostMissedPrayer: "En Çok Kaçırılan Namaz",
            familyAverage: "Aile Ortalaması",
            onTime: "Vaktinde",
            late: "Geç",
            missed: "Kaçırıldı",
            pending: "Beklemede",
            completed: "Tamamlandı"
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
            emptyCountry: "Lütfen ülke girin.",
            fallbackWarning: "Yedek namaz vakitleri kullanılıyor",
            resetPreferences: "Tercihleri Sıfırla",
            enterPassToCont: "Devam etmek için şifreyi girin",
            password: "Şifre",
            wrongPassword: "Yanlış şifre",
            cloudDatabase: "Ortak Bulut Veritabanı",
            sheetUrlLabel: "Google E-Tablolar API URL'si",
            sheetUrlHelper: "Dağıtılan Google Apps Script Web Uygulaması URL'sini yapıştırın.",
            sheetPasscodeLabel: "API Geçiş Kodu",
            sheetPasscodeHelper: "Google Apps Script'inizde yapılandırılan geçiş kodunu girin.",
            saveConnection: "Kaydet ve Bağlan",
            statusLabel: "Durum:",
            statusDisconnected: "Bağlantı Yok",
            statusConnected: "Bağlandı",
            statusSyncing: "Eşitleniyor...",
            statusError: "Eşitleme Hatası",
            syncSuccess: "Google E-Tablo ile başarıyla eşitlendi",
            syncError: "Bulut veritabanıyla eşitlenirken hata oluştu",
            syncingText: "Google E-Tablo ile eşitleniyor...",
            lastSyncLabel: "Son Eşitleme:"
        },
        modals: {
            confirm: "Onayla",
            upcoming: "Yaklaşan",
            markDone: "Kılındı İşaretle",
            startsAt: "Başlama:",
            completedText: "Tamamlandı",
            prayersText: "namaz"
        },
        messages: {
            settingsSaved: "Ayarlar başarıyla kaydedildi.",
            marked: "olarak işaretlendi:",
            dayRefreshed: "Gün yenilendi. Selamün Aleyküm!",
            fallback: "Bu konum için namaz vakitleri yüklenemedi. Yerel yedek vakitler kullanılıyor.",
            restored: "Yedek başarıyla geri yüklendi.",
            invalidBackup: "Geçersiz yedek dosyası.",
            resetWarn: "Tüm namaz geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
            resetDone: "Tüm veriler silindi",
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
            usingFallbackTimes: "يتم استخدام أوقات صلاة احتياطية",
            currentTime: "الوقت الحالي",
            today: "اليوم",
            tomorrow: "غداً",
            prayerSource: "مصدر أوقات الصلاة"
        },
        prayer: {
            fajr: "الفجر", dhuhr: "الظهر", asr: "العصر", maghrib: "المغرب", isha: "العشاء"
        },
        status: {
            upcoming: "قادمة", active: "نشطة", completed: "مكتملة", missed: "فائتة", pending: "قيد الانتظار", onTime: "في الوقت", late: "متأخرة", loading: "جاري التحميل", fallback: "يتم استخدام أوقات صلاة احتياطية", marked: "تم التسجيل"
        },
        family: {
            title: "أفراد العائلة",
            subtitle: "تتبع تقدم الأفراد والمواظبة",
            markAsPrayed: "تمت الصلاة",
            prayerDetails: "تفاصيل الصلاة",
            streak: "المواظبة",
            perfectDay: "يوم مثالي",
            inProgress: "قيد التقدم",
            notStarted: "لم تبدأ",
            needsAttention: "يحتاج اهتمامًا",
            addNote: "إضافة ملاحظة",
            save: "حفظ",
            cancel: "إلغاء",
            undo: "تراجع",
            edit: "تعديل",
            done: "المكتمل",
            completed: "مكتمل",
            honestyReminder: "تأكيد صادق قبل تسجيل الصلاة.",
            lastMarked: "آخر تسجيل: {prayer} الساعة {time}",
            noActivity: "لم يتم تسجيل صلاة اليوم",
            open: "فتح",
            pendingOrMissed: "المتبقي/الفائت",
            onTime: "في الوقت",
            late: "متأخر",
            motivationalNote: '"أَقِمِ الصَّلَاةَ ۖ إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ" (العنكبوت 29:45)'
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
            noRecords: "لم يتم العثور على سجلات صلاة لهذه الفلاتر",
            to: "إلى",
            noData: "لا بيانات",
            statusDist: "توزيع الحالات",
            prayerPerf: "أداء الصلوات",
            memberSummary: "ملخص الأفراد",
            consistencyHeatmap: "خريطة المواظبة",
            good: "جيد",
            partial: "جزئي",
            weak: "ضعيف",
            detailedRecords: "سجلات مفصلة",
            date: "التاريخ",
            time: "الوقت"
        },
        stats: {
            title: "الإحصائيات والرؤى",
            subtitle: "نظرة مرئية على الالتزام بالصلاة",
            today: "اليوم",
            thisWeek: "هذا الأسبوع",
            thisMonth: "هذا الشهر",
            allTime: "كل الوقت",
            overallPerf: "الأداء العام",
            memberComp: "مقارنة الأفراد",
            overallPerformance: "الأداء العام",
            memberComparison: "مقارنة الأفراد",
            prayerPerformance: "أداء الصلوات",
            progressTrend: "اتجاه التقدم",
            completionRate: "نسبة الإنجاز",
            onTimePercentage: "نسبة الصلاة في الوقت",
            onTimeRate: "نسبة الصلاة في الوقت",
            totalCompleted: "إجمالي المكتمل",
            totalMissed: "إجمالي الفائت",
            totalLate: "إجمالي المتأخر",
            noData: "لا توجد بيانات بعد",
            noDataDescription: "ابدأ بتسجيل الصلوات لعرض الإحصائيات هنا.",
            goToFamily: "اذهب إلى العائلة",
            bestMember: "أفضل فرد",
            bestPrayer: "أفضل صلاة",
            mostMissedPrayer: "أكثر صلاة فائتة",
            familyAverage: "متوسط العائلة",
            onTime: "في الوقت",
            late: "متأخرة",
            missed: "فائتة",
            pending: "قيد الانتظار",
            completed: "مكتملة"
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
            emptyCountry: "يرجى إدخال البلد.",
            fallbackWarning: "يتم استخدام أوقات صلاة احتياطية",
            resetPreferences: "إعادة ضبط التفضيلات",
            enterPassToCont: "أدخل كلمة المرور للمتابعة",
            password: "كلمة المرور",
            wrongPassword: "كلمة المرور غير صحيحة",
            cloudDatabase: "قاعدة البيانات السحابية المشتركة",
            sheetUrlLabel: "رابط Google Sheets API",
            sheetUrlHelper: "الصق رابط تطبيق ويب Google Apps Script المفعّل.",
            sheetPasscodeLabel: "رمز المرور الخاص بالـ API",
            sheetPasscodeHelper: "أدخل رمز المرور الذي قمت بتكوينه في Google Apps Script.",
            saveConnection: "حفظ والاتصال",
            statusLabel: "الحالة:",
            statusDisconnected: "غير متصل",
            statusConnected: "متصل",
            statusSyncing: "جاري المزامنة...",
            statusError: "خطأ في المزامنة",
            syncSuccess: "تمت المزامنة بنجاح مع جدول بيانات Google",
            syncError: "خطأ أثناء المزامنة مع قاعدة البيانات السحابية",
            syncingText: "جاري المزامنة مع جدول بيانات Google...",
            lastSyncLabel: "آخر مزامنة:"
        },
        modals: {
            confirm: "تأكيد",
            upcoming: "قادمة",
            markDone: "تمت",
            startsAt: "تبدأ في",
            completedText: "مكتملة",
            prayersText: "صلوات"
        },
        messages: {
            settingsSaved: "تم حفظ الإعدادات بنجاح.",
            marked: "سجل",
            dayRefreshed: "يوم جديد. السلام عليكم!",
            fallback: "تعذر تحميل أوقات الصلاة لهذا الموقع. استخدام أوقات محلية احتياطية.",
            restored: "تم استعادة النسخة الاحتياطية.",
            invalidBackup: "ملف احتياطي غير صالح.",
            resetWarn: "هل أنت متأكد أنك تريد مسح كل السجلات؟ لا يمكن التراجع عن هذا الإجراء.",
            resetDone: "تم مسح جميع البيانات",
            mostMissed: "أكثر صلاة متأخرة أو فائتة هي",
            highestRate: "لديه أعلى نسبة صلاة في الوقت."
        }
    }
};

function getSavedLanguage() {
    return localStorage.getItem('askarFamilyLanguage') || 'en';
}

let currentLanguage = getSavedLanguage();

function humanizeKey(key) {
    return key
        .split(".")
        .pop()
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, c => c.toUpperCase());
}

function t(key) {
    const lang = currentLanguage || "en";
    const keys = key.split('.');
    let val = translations[lang];
    
    for (let k of keys) {
        if (val) val = val[k];
        else break;
    }
    
    if (val === undefined || typeof val !== 'string') {
        // Fallback to English
        val = translations['en'];
        for (let k of keys) {
            if (val) val = val[k];
            else break;
        }
        if (val === undefined || typeof val !== 'string') {
            console.warn(`Missing translation key: ${key} for language: ${lang}`);
            return humanizeKey(key);
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
    
    // Custom event to notify app.js to re-render dynamic content
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    
    // Re-render current page if app.js is ready
    if (typeof renderPage === 'function' && typeof appState !== 'undefined') {
        renderPage(appState.currentPage || "dashboard");
    }
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    
    // Update active state of language buttons
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
