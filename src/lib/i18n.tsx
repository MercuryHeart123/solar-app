"use client";

import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

type TranslationParams = Record<string, string | number>;

const translations = {
    en: {
        "languageSwitcher.label": "Language",
        "languageSwitcher.option.en": "English",
        "languageSwitcher.option.th": "ไทย",
        "hero.badge": "Under one minute",
        "hero.title": "Quick solar readiness check",
        "hero.subtitle":
            "Answer four lightweight questions—no typing needed—and we’ll give you a personalized starting point for your solar journey.",
        "card.title": "Your household snapshot",
        "card.description":
            "Tap the options that fit best. You can tweak anything before submitting.",
        "progress.label": "Step {current} of {total}",
        "buttons.back": "Back",
        "buttons.next": "Next question",
        "buttons.submit": "Submit responses",
        "steps.overview.bill.title": "Bill",
        "steps.overview.bill.description": "Monthly spend",
        "steps.overview.residence.title": "Residence",
        "steps.overview.residence.description": "Home type",
        "steps.overview.household.title": "Household",
        "steps.overview.household.description": "People count",
        "steps.overview.appliances.title": "Appliances",
        "steps.overview.appliances.description": "Energy use",
        "steps.bill.heading": "{step}. Monthly electricity bill",
        "steps.bill.description":
            "Slide to match your average bill in Thai Baht (฿). This helps us estimate savings more precisely.",
        "steps.bill.estimatedSpendLabel": "Estimated monthly spend",
        "steps.bill.averageHomes": "Average homes",
        "steps.bill.sliderAria": "Monthly electricity bill in Thai Baht",
        "steps.residence.heading": "{step}. Residence type",
        "steps.residence.description":
            "Choose the option that best matches your roof situation and tell us where in Thailand you live.",
        "steps.residence.map.title": "Map your province",
        "steps.residence.map.description":
            "Click directly on the map or use the dropdown. We will highlight the province in deep green.",
        "steps.residence.map.dropdownLabel": "Province",
        "steps.residence.map.dropdownDescription":
            "Selecting your province helps us tailor the sunshine profile for your home.",
        "steps.residence.map.placeholder": "Choose a province",
        "steps.residence.map.noResults": "No province found",
        "steps.residence.form.title": "Residence style",
        "steps.household.heading": "{step}. People in the home",
        "steps.household.description":
            "Slide to adjust your household size. Most solar-ready homes fall between two and four residents.",
        "steps.household.summary.single": "{count} resident",
        "steps.household.summary.plural": "{count} residents",
        "steps.household.helper.small":
            "Smaller households still drive meaningful demand.",
        "steps.household.helper.medium":
            "Nice balance—perfect for solar comparisons.",
        "steps.household.helper.large":
            "Larger homes often unlock the best solar savings.",
        "steps.household.sliderLabel": "Household size",
        "steps.household.sliderAria": "Number of people in the home",
        "steps.household.sliderTypical": "Typical: {value}",
        "steps.appliances.heading": "{step}. Power-hungry appliances",
        "steps.appliances.description":
            "Slide each bar to match how many you rely on—leave it at zero if it rarely runs.",
        "steps.appliances.status.active": "In use",
        "steps.appliances.quantityLabel": "Quantity",
        "steps.appliances.sliderAria": "{appliance} quantity",
        "summary.bannerTitle": "Snapshot",
        "summary.bannerSubtitle": "Review before sending",
        "summary.monthlyBill": "Monthly bill",
        "summary.residence": "Residence",
        "summary.province": "Province",
        "summary.household": "Household size",
        "summary.appliances": "Appliances & quantities",
        "summary.cta":
            "Ready to go? Submit to receive a tailored solar savings estimate in your inbox.",
        "province.notSelected": "Not selected",
        "applianceSummary.empty": "No power-hungry appliances set yet.",
        "residence.options.house.label": "Single-family home",
        "residence.options.house.description":
            "Detached home with rooftop space.",
        "residence.options.townhouse.label": "Townhouse",
        "residence.options.townhouse.description":
            "Shared walls but your own roof.",
        "residence.options.apartment.label": "Apartment / Condo",
        "residence.options.apartment.description":
            "Shared building and common roof.",
        "appliances.options.ac": "Air conditioner unit",
        "appliances.options.heater": "Water heater",
        "appliances.options.laundry": "Washer & dryer pair",
        "appliances.options.fridge": "Refrigerator",
        "appliances.options.tv": "Smart TV / Home theater",
        "appliances.options.ev": "EV charger",
        "stepper.ariaLabel": "Survey progress",
        "map.loading": "Loading Thailand map…",
        "map.error": "Unable to load the Thailand map.",
        "map.ariaLabel": "Selectable map of Thailand",
        "map.captionSelected": "Province selected",
        "map.captionEmpty": "Select a province",
        "searchableSelect.clear": "Clear selection",
    },
    th: {
        "languageSwitcher.label": "ภาษา",
        "languageSwitcher.option.en": "English",
        "languageSwitcher.option.th": "ไทย",
        "hero.badge": "ใช้เวลาไม่ถึงหนึ่งนาที",
        "hero.title": "ตรวจสอบความพร้อมติดตั้งโซลาร์เซลล์อย่างรวดเร็ว",
        "hero.subtitle":
            "ตอบคำถามสั้น ๆ เพียงสี่ข้อโดยไม่ต้องพิมพ์ แล้วเราจะให้จุดเริ่มต้นเฉพาะสำหรับเส้นทางพลังงานแสงอาทิตย์ของคุณ",
        "card.title": "ภาพรวมครัวเรือนของคุณ",
        "card.description":
            "เลือกตัวเลือกที่ตรงที่สุด และยังสามารถปรับแก้ได้ก่อนส่ง",
        "progress.label": "ขั้นตอน {current} จาก {total}",
        "buttons.back": "ย้อนกลับ",
        "buttons.next": "คำถามถัดไป",
        "buttons.submit": "ส่งคำตอบ",
        "steps.overview.bill.title": "ค่าไฟ",
        "steps.overview.bill.description": "ค่าใช้จ่ายรายเดือน",
        "steps.overview.residence.title": "ที่อยู่อาศัย",
        "steps.overview.residence.description": "ประเภทบ้าน",
        "steps.overview.household.title": "สมาชิกครัวเรือน",
        "steps.overview.household.description": "จำนวนคน",
        "steps.overview.appliances.title": "เครื่องใช้ไฟฟ้า",
        "steps.overview.appliances.description": "การใช้พลังงาน",
        "steps.bill.heading": "{step}. ค่าไฟฟ้ารายเดือน",
        "steps.bill.description":
            "เลื่อนแถบเพื่อให้ตรงกับค่าไฟเฉลี่ยของคุณในหน่วยบาท (฿) เพื่อช่วยให้เราประเมินการประหยัดได้แม่นยำยิ่งขึ้น",
        "steps.bill.estimatedSpendLabel": "ค่าใช้จ่ายรายเดือนโดยประมาณ",
        "steps.bill.averageHomes": "บ้านทั่วไป",
        "steps.bill.sliderAria": "ค่าไฟฟ้ารายเดือน (บาท)",
        "steps.residence.heading": "{step}. ประเภทที่อยู่อาศัย",
        "steps.residence.description":
            "เลือกตัวเลือกที่ตรงกับลักษณะหลังคาของคุณ และบอกเราว่าคุณอาศัยอยู่จังหวัดใดในประเทศไทย",
        "steps.residence.map.title": "เลือกจังหวัดจากแผนที่",
        "steps.residence.map.description":
            "คลิกเลือกจากแผนที่หรือใช้แบบรายการ จากนั้นเราจะไฮไลต์จังหวัดด้วยสีเขียวเข้ม",
        "steps.residence.map.dropdownLabel": "จังหวัด",
        "steps.residence.map.dropdownDescription":
            "การเลือกจังหวัดช่วยให้เราปรับข้อมูลแสงแดดให้เหมาะกับบ้านของคุณ",
        "steps.residence.map.placeholder": "เลือกจังหวัด",
        "steps.residence.map.noResults": "ไม่พบจังหวัด",
        "steps.residence.form.title": "รูปแบบที่อยู่อาศัย",
        "steps.household.heading": "{step}. จำนวนผู้อยู่อาศัย",
        "steps.household.description":
            "เลื่อนเพื่อปรับจำนวนสมาชิกในบ้าน ส่วนใหญ่บ้านที่พร้อมติดตั้งโซลาร์จะมี 2–4 คน",
        "steps.household.summary.single": "{count} ผู้อยู่อาศัย",
        "steps.household.summary.plural": "{count} ผู้อยู่อาศัย",
        "steps.household.helper.small":
            "แม้บ้านขนาดเล็กก็ยังสร้างความต้องการพลังงานที่สำคัญได้",
        "steps.household.helper.medium":
            "สมดุลพอดี เหมาะสำหรับเปรียบเทียบโซลาร์",
        "steps.household.helper.large":
            "บ้านขนาดใหญ่มีแนวโน้มประหยัดพลังงานแสงอาทิตย์ได้มากที่สุด",
        "steps.household.sliderLabel": "ขนาดครัวเรือน",
        "steps.household.sliderAria": "จำนวนคนที่อยู่ในบ้าน",
        "steps.household.sliderTypical": "ค่าเฉลี่ย: {value}",
        "steps.appliances.heading": "{step}. เครื่องใช้ไฟฟ้าที่ใช้พลังงานสูง",
        "steps.appliances.description":
            "ปรับแถบแต่ละรายการตามจำนวนที่คุณใช้งาน หากใช้น้อยให้ปล่อยไว้ที่ศูนย์",
        "steps.appliances.status.active": "ใช้งานอยู่",
        "steps.appliances.quantityLabel": "จำนวน",
        "steps.appliances.sliderAria": "จำนวน {appliance}",
        "summary.bannerTitle": "ภาพรวม",
        "summary.bannerSubtitle": "ตรวจสอบก่อนส่ง",
        "summary.monthlyBill": "ค่าไฟรายเดือน",
        "summary.residence": "ที่อยู่อาศัย",
        "summary.province": "จังหวัด",
        "summary.household": "ขนาดครัวเรือน",
        "summary.appliances": "เครื่องใช้ไฟฟ้าและจำนวน",
        "summary.cta":
            "พร้อมดำเนินการหรือยัง? ส่งเพื่อรับประมาณการประหยัดพลังงานแสงอาทิตย์ที่เหมาะกับคุณในอีเมล",
        "province.notSelected": "ยังไม่ได้เลือก",
        "applianceSummary.empty":
            "ยังไม่ได้เลือกเครื่องใช้ไฟฟ้าที่ใช้พลังงานสูง",
        "residence.options.house.label": "บ้านเดี่ยว",
        "residence.options.house.description": "บ้านแยกหลังพร้อมพื้นที่หลังคา",
        "residence.options.townhouse.label": "ทาวน์เฮาส์",
        "residence.options.townhouse.description":
            "มีผนังร่วมแต่มีหลังคาของตัวเอง",
        "residence.options.apartment.label": "อพาร์ตเมนต์ / คอนโด",
        "residence.options.apartment.description":
            "อาคารรวมที่ใช้หลังคาร่วมกัน",
        "appliances.options.ac": "เครื่องปรับอากาศ",
        "appliances.options.heater": "เครื่องทำน้ำอุ่น",
        "appliances.options.laundry": "เครื่องซักผ้าและอบผ้า",
        "appliances.options.fridge": "ตู้เย็น",
        "appliances.options.tv": "ทีวีอัจฉริยะ / โฮมเธียเตอร์",
        "appliances.options.ev": "เครื่องชาร์จรถยนต์ไฟฟ้า",
        "stepper.ariaLabel": "ความคืบหน้าแบบสอบถาม",
        "map.loading": "กำลังโหลดแผนที่ประเทศไทย…",
        "map.error": "ไม่สามารถโหลดแผนที่ประเทศไทยได้",
        "map.ariaLabel": "แผนที่ประเทศไทยแบบเลือกได้",
        "map.captionSelected": "เลือกจังหวัดแล้ว",
        "map.captionEmpty": "เลือกจังหวัด",
        "searchableSelect.clear": "ล้างการเลือก",
    },
} as const;

type Translations = typeof translations;
export type Language = keyof Translations;
export type TranslationKey = keyof Translations["en"];

type I18nContextValue = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKey, params?: TranslationParams) => string;
};

const I18N_CONTEXT = createContext<I18nContextValue | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "solar-app-language";

const isLanguage = (value: unknown): value is Language =>
    typeof value === "string" && value in translations;

const formatMessage = (
    template: string,
    params?: TranslationParams
): string => {
    if (!params) {
        return template;
    }

    return template.replace(/\{(\w+)\}/g, (_, token: string) => {
        const replacement = params[token];
        return replacement !== undefined ? String(replacement) : `{${token}}`;
    });
};

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window === "undefined") {
            return "en";
        }
        const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        return isLanguage(stored) ? stored : "en";
    });

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }, [language]);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const translate = useCallback(
        (key: TranslationKey, params?: TranslationParams) => {
            const dictionary = translations[language] ?? translations.en;
            const template =
                (dictionary as Record<TranslationKey, string>)[key] ??
                translations.en[key];

            if (!template) {
                return key;
            }

            return formatMessage(template, params);
        },
        [language]
    );

    const value = useMemo<I18nContextValue>(
        () => ({
            language,
            setLanguage,
            t: translate,
        }),
        [language, translate]
    );

    return (
        <I18N_CONTEXT.Provider value={value}>{children}</I18N_CONTEXT.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18N_CONTEXT);
    if (!context) {
        throw new Error("useI18n must be used within I18nProvider");
    }
    return context;
}
