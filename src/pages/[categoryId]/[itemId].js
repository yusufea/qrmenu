import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoIosPricetag } from "react-icons/io";
import en from "../../../locales/en";
import ar from "../../../locales/ar";
import tr from "../../../locales/tr";

export default function ItemPage() {
    const router = useRouter();
    const { categoryId, itemId } = router.query;
    const { locale } = router;
    const t = locale === "tr" ? tr : locale === "en" ? en : ar;

    const [item, setItem] = useState(null);
    const [categories, setCategories] = useState(null);
    const [restaurantId, setRestaurantId] = useState();



    const GetRestaurantCategories = async (restaurantId) => {
        axios.get(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/categories/${restaurantId}`).then(data => {
            setCategories(data.data)
        }).catch(error => console.log(error));
    }

    const GetItem = async (restaurantId, categoryId) => {
        axios.get(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/items/${restaurantId}/${categoryId}/${itemId}`).then(data => {
            setItem(data.data)
        }).catch(error => console.log(error));
    }

    useEffect(() => {
        const restaurantId = window.location.hostname.split('.')[0]; // Subdomain alınır
        setRestaurantId(restaurantId)
        if (restaurantId != undefined && categoryId != undefined) {
            GetItem(restaurantId, categoryId);
            GetRestaurantCategories(restaurantId);
        }
    }, [router.query]);

    if (!item) {
        return <div>Yükleniyor...</div>
    }

    const ReturnItemText = (category) => {
        if (!category) return ""; // Eğer kategori yoksa boş bir string döner

        // Öncelik sırasına göre kategori adını döndür
        if (locale === "tr") return category.name_tr; // En son yoksa boş döner
        if (locale === "en") return category.name_en ? category.name_en : category.name_tr;
        if (locale === "ar") return category.name_ar ? category.name_ar : category.name_en ? category.name_en : category.name_tr

        return ""; // Eğer hiçbir locale tanımlı değilse boş bir string döner
    }

    const ReturnDescriptionText = (item) => {
        if (!item) return ""; // Eğer kategori yoksa boş bir string döner

        // Öncelik sırasına göre kategori adını döndür
        if (locale === "tr") return item.description; // En son yoksa boş döner
        if (locale === "en") return item.description_en ? item.description_en : item.description;
        if (locale === "ar") return item.description_ar ? item.description_ar : item.description_en ? item.description_en : item.description

        return ""; // Eğer hiçbir locale tanımlı değilse boş bir string döner
    }


    const ReturnCategoryText = (category) => {
        if (!category) return ""; // Eğer kategori yoksa boş bir string döner

        // Öncelik sırasına göre kategori adını döndür
        if (locale === "tr") return category.name_tr; // En son yoksa boş döner
        if (locale === "en") return category.name_en ? category.name_en : category.name_tr;
        if (locale === "ar") return category.name_ar ? category.name_ar : category.name_en ? category.name_en : category.name_tr

        return ""; // Eğer hiçbir locale tanımlı değilse boş bir string döner
    }
    return (
        <div>
            <div>
                <h4 className="text-center text-black text-lg font-bold dark:text-white">{ReturnItemText(item)}</h4>
                <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2 flex flex-col gap-2">
                    <img className="border shadow-md w-full rounded-lg" src={item.image == undefined ? '/images/noimage.jpg' : item.image} />
                    <div className="flex items-center justify-center gap-2">
                        <IoIosPricetag className="w-7 h-7 text-black dark:text-white" />
                        <h6 className="text-black text-2xl dark:text-white font-bold">{item.price} ₺</h6>
                    </div>
                    <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-3 flex flex-col gap-2">
                        <p className="text-black text-lg dark:text-white break-all">
                            {ReturnDescriptionText(item)}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <h4 className="text-center text-black text-lg font-bold dark:text-white">{t.categories}</h4>
                <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2">
                    <main className="container flex flex-col gap-4 py-2">
                        <section id="categories">
                            <div className="horizontalProductList border-slate-500 shadow border flex flex-wrap justify-evenly items-center gap-1">
                                {categories?.map((item) => (
                                    <a
                                        key={item.id} // Eklenmesi gereken benzersiz bir anahtar
                                        className="homePageCategory flex-grow p-4 py-5 text-center shadow flex items-center justify-center relative overflow-hidden"
                                        style={{
                                            backgroundImage: `url(${item.image})`,
                                            minHeight: '120px', // Kapsayıcının en az yüksekliği
                                            backgroundSize: 'cover', // Arka planı kapsayıcıya sığdır
                                            backgroundPosition: 'center', // Arka planı ortala
                                        }}
                                        href={`/${locale}/${item.id}`}
                                    >
                                        <span className="absolute inset-0 bg-black opacity-50" /> {/* Siyah opak katman */}
                                        <span className="relative text-white z-10">{ReturnCategoryText(item)}</span> {/* Beyaz yazı */}
                                    </a>
                                ))}
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    )
}