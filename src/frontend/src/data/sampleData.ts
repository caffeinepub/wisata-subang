import type {
  Hotel,
  TourAgency,
  TourDestination,
  TourPackage,
} from "../backend";

export const SAMPLE_DESTINATIONS: Omit<
  TourDestination,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    name: "Pemandian Air Panas Sari Ater",
    description:
      "Resort pemandian air panas alami yang terkenal dengan kolam-kolam belerang yang menyehatkan di kaki Gunung Tangkuban Perahu. Nikmati kesegaran air panas alami sambil menikmati pemandangan hutan tropis yang menakjubkan.",
    category: "Wisata Alam",
    address: "Jl. Raya Ciater, Ciater, Subang",
    location: { latitude: -6.7167, longitude: 107.6167 },
    directions:
      "Dari Bandung: Ambil jalan tol Pasteur, lanjut ke Cimahi, kemudian menuju Lembang dan terus ke arah Subang via Ciater. Jarak sekitar 40 km dari Bandung.",
    rating: BigInt(48),
    featured: true,
    active: true,
  },
  {
    name: "Curug Cijalu",
    description:
      "Air terjun setinggi 40 meter yang tersembunyi di tengah hutan pinus hijau yang rimbun. Aliran air yang jernih dan segar menciptakan kolam alami di bawahnya, sempurna untuk berenang dan berfoto.",
    category: "Air Terjun",
    address: "Desa Cipancar, Serangpanjang, Subang",
    location: { latitude: -6.5833, longitude: 107.7667 },
    directions:
      "Dari pusat kota Subang, ambil jalan menuju Serangpanjang sekitar 15 km. Ikuti petunjuk arah ke Curug Cijalu, lanjutkan dengan berjalan kaki sekitar 30 menit.",
    rating: BigInt(45),
    featured: true,
    active: true,
  },
  {
    name: "Gunung Burangrang",
    description:
      "Gunung dengan ketinggian 2.064 mdpl yang menawarkan tantangan pendakian yang menarik. Puncaknya menawarkan pemandangan panorama Bandung dan sekitarnya yang memukau, terutama saat fajar.",
    category: "Wisata Alam",
    address: "Kecamatan Cisalak, Subang",
    location: { latitude: -6.75, longitude: 107.5833 },
    directions:
      "Dari Bandung melalui Lembang sekitar 30 km. Basecamp pendakian ada di Desa Legok Huni, Kabupaten Subang.",
    rating: BigInt(46),
    featured: true,
    active: true,
  },
  {
    name: "Terasering Ciater",
    description:
      "Pemandangan sawah bertingkat yang membentuk pola geometris indah di lereng bukit. Foto terbaik diambil saat pagi hari ketika kabut masih menyelimuti lembah dan padi berwarna hijau cerah.",
    category: "Wisata Alam",
    address: "Desa Ciater, Kecamatan Ciater, Subang",
    location: { latitude: -6.72, longitude: 107.62 },
    directions:
      "Sama dengan rute ke Sari Ater. Dari Bandung menuju Lembang kemudian Ciater. Area terasering berada di sekitar kawasan wisata Ciater.",
    rating: BigInt(44),
    featured: false,
    active: true,
  },
  {
    name: "Pantai Pondok Bali",
    description:
      "Pantai berpasir hitam yang eksotis dengan ombak Laut Jawa yang tenang. Terdapat fasilitas lengkap termasuk tempat bermain anak, gazebo, dan berbagai kuliner seafood segar di tepi pantai.",
    category: "Pantai",
    address: "Desa Mayangan, Legonkulon, Subang",
    location: { latitude: -6.1167, longitude: 107.6833 },
    directions:
      "Dari pusat kota Subang, ambil jalan menuju utara ke arah Pamanukan. Kemudian belok ke Legonkulon. Jarak sekitar 60 km dari kota Subang.",
    rating: BigInt(42),
    featured: false,
    active: true,
  },
  {
    name: "Kampung Cai Rancaupas",
    description:
      "Kawasan wisata alam terpadu yang menawarkan camping, outbound, peternakan rusa, arung jeram, dan banyak aktivitas seru lainnya. Cocok untuk wisata keluarga dan tim building korporat.",
    category: "Wisata Alam",
    address: "Jl. Raya Ciwidey, Rancabali, Subang",
    location: { latitude: -6.55, longitude: 107.75 },
    directions:
      "Dari Bandung melalui jalan tol dan keluar di Kopo, lanjut ke arah Ciwidey. Kampung Cai ada di kawasan Rancaupas yang dikelola Perum Perhutani.",
    rating: BigInt(43),
    featured: false,
    active: true,
  },
];

export const SAMPLE_HOTELS: Omit<Hotel, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Hotel Sari Ater",
    description:
      "Resort bintang empat di kawasan wisata air panas Ciater. Nikmati kolam renang air panas private, pemandangan hutan, dan fasilitas mewah di tengah alam Subang.",
    address: "Jl. Raya Ciater No. 1, Subang",
    phone: "+62-260-471700",
    website: "https://sariater.com",
    amenities: [
      "Kolam Renang Air Panas",
      "Restoran",
      "Spa",
      "WiFi",
      "Parkir",
      "AC",
    ],
    rating: BigInt(45),
    pricePerNight: 850000,
    active: true,
  },
  {
    name: "Grand Pasundan Hotel",
    description:
      "Hotel bintang tiga di pusat kota Subang dengan fasilitas modern dan pelayanan hangat ala Sunda. Lokasi strategis dekat pusat perbelanjaan dan perkantoran.",
    address: "Jl. Veteran No. 12, Subang Kota",
    phone: "+62-260-411234",
    website: "https://grandpasundan.com",
    amenities: ["Restoran", "Meeting Room", "WiFi", "AC", "TV", "Parkir"],
    rating: BigInt(40),
    pricePerNight: 450000,
    active: true,
  },
  {
    name: "Ciater Highland Resort",
    description:
      "Resort pegunungan eksklusif di ketinggian 1.200 mdpl dengan pemandangan kebun teh dan hutan pinus. Setiap chalet dilengkapi balkon dengan view alam yang memukau.",
    address: "Jl. Perkebunan Ciater, Subang",
    phone: "+62-260-472500",
    website: "https://ciaterresort.com",
    amenities: [
      "Chalet Private",
      "Air Panas",
      "Restoran",
      "Trekking Trail",
      "WiFi",
      "Fireplace",
    ],
    rating: BigInt(47),
    pricePerNight: 1200000,
    active: true,
  },
  {
    name: "Kampung Daun Culture Gallery & Cafe",
    description:
      "Penginapan unik bertema budaya Sunda dengan desain saung-saung tradisional di tepi sungai. Sajian kuliner Sunda otentik dan suasana alam yang tenang menjadi daya tarik utama.",
    address: "Jl. Sersan Bajuri, Ciater, Subang",
    phone: "+62-260-473300",
    website: "https://kampungdaun.com",
    amenities: [
      "Saung Private",
      "Restoran Tradisional",
      "Live Music",
      "WiFi",
      "Alam Terbuka",
    ],
    rating: BigInt(44),
    pricePerNight: 680000,
    active: true,
  },
];

export const SAMPLE_PACKAGES: Omit<
  TourPackage,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    name: "Paket Alam Subang 2D1N",
    description:
      "Paket wisata lengkap 2 hari 1 malam menjelajahi keindahan alam Subang. Termasuk kunjungan ke Sari Ater, Terasering Ciater, dan Gunung Burangrang dengan pemandu lokal berpengalaman.",
    price: 850000,
    duration: BigInt(2),
    maxParticipants: BigInt(20),
    inclusions: [
      "Penginapan 1 malam",
      "Makan 3x",
      "Transportasi AC",
      "Guide lokal",
      "Tiket masuk destinasi",
      "Asuransi perjalanan",
    ],
    active: true,
  },
  {
    name: "Paket Wisata Keluarga",
    description:
      "Paket wisata keluarga yang menyenangkan, dirancang khusus untuk kelompok keluarga dengan anak-anak. Meliputi wahana outbound, renang air panas, dan berbagai aktivitas seru bersama.",
    price: 650000,
    duration: BigInt(1),
    maxParticipants: BigInt(30),
    inclusions: [
      "Makan siang",
      "Tiket masuk semua wahana",
      "Pemandu wisata",
      "Dokumentasi foto",
      "Souvenir",
    ],
    active: true,
  },
  {
    name: "Paket Adventure Gunung",
    description:
      "Paket petualangan mendaki Gunung Burangrang bagi para pecinta alam. Dilengkapi dengan peralatan camping lengkap, porter berpengalaman, dan sunrise view yang spektakuler di puncak.",
    price: 950000,
    duration: BigInt(2),
    maxParticipants: BigInt(15),
    inclusions: [
      "Tenda & Sleeping Bag",
      "Makan 4x",
      "Porter",
      "Guide pendakian",
      "P3K",
      "Sertifikat pendakian",
    ],
    active: true,
  },
];

export const SAMPLE_AGENCIES: Omit<
  TourAgency,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    name: "Subang Tour",
    description:
      "Agen wisata lokal terpercaya yang berpengalaman lebih dari 10 tahun melayani wisatawan domestik dan mancanegara di Subang dan sekitarnya.",
    phone: "+62-812-3456-7890",
    email: "info@subang-tour.com",
    address: "Jl. Sudirman No. 45, Subang",
    services: ["City Tour", "Paket Alam", "Sewa Kendaraan", "Hotel Booking"],
    active: true,
  },
  {
    name: "Wisata Alam Subang",
    description:
      "Spesialis paket wisata alam dan petualangan di Subang. Menyediakan pemandu wisata terlatih dan peralatan outdoor berkualitas tinggi untuk pengalaman terbaik.",
    phone: "+62-821-9876-5432",
    email: "booking@wisataalam-subang.com",
    address: "Jl. Ciater Km 5, Subang",
    services: ["Hiking", "Camping", "Rafting", "Wisata Air Panas"],
    active: true,
  },
  {
    name: "Java Tour Indonesia",
    description:
      "Agen perjalanan profesional dengan jaringan luas di seluruh Jawa Barat. Menawarkan paket wisata premium dengan layanan concierge 24 jam.",
    phone: "+62-811-2345-6789",
    email: "contact@javatour.id",
    address: "Jl. Otto Iskandar Dinata No. 88, Subang",
    services: ["Paket Premium", "Wedding Tour", "Honeymoon", "Corporate Tour"],
    active: true,
  },
];
