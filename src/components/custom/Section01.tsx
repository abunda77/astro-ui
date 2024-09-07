import React from "react";
import { Check, Clock } from "lucide-react";

const Section01 = () => {
  const customerLogos3 = [
    { name: "CNN", logo: "images/cnn.png" },
    { name: "VICE", logo: "images/vice.png" },
    { name: "Bloomberg", logo: "images/bloomberg.png" },
    { name: "FASHIONISTA", logo: "images/fashionita.png" },
    { name: "NEW YORK POST", logo: "images/newyorktime.png" },
    // { name: "NEW YORK POST", logo: "images/newyorktime.png" },
  ];

  const customerLogos = [
    { name: "Agung Podomoro", logo: "images/agungpodomoro.webp" },
    { name: "Agusng Sedayu", logo: "images/agungsedayu.webp" },
    { name: "Damai Putra", logo: "images/damaiputra.png" },
    { name: "Duta Putra Land", logo: "images/dutaputraland.webp" },
    { name: "Sinarmas", logo: "images/sinarmas.webp" },
    { name: "Summarecon", logo: "images/sumamarecon.webp" },
  ];

  const customerLogos2 = [
    { name: "Kompas", logo: "images/kompas.png" },
    { name: "Media Indonesia", logo: "images/mediaindonesia.png" },
    { name: "RealEstate", logo: "images/realestate.webp" },
    { name: "Seputar Indonesia", logo: "images/seputarindonesia.webp" },
    { name: "Tech In Asia", logo: "images/techinasia.png" },
    { name: "WarnerMedia", logo: "images/warnermedia.png" },
  ];

  return (
    <section className="px-4 py-12 bg-gradient-to-t from-blue-100 via-blue-50 to-white dark:from-gray-100 dark:via-gray-50 dark:to-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* As seen on logos */}
        <div className="flex flex-col items-center mb-12">
          <p className="mb-1 text-2xl text-gray-500">As seen on:</p>
          {/* <div className="grid w-full max-w-6xl grid-cols-2 gap-1 sm:gap-8 sm:grid-cols-3 md:grid-cols-6 md:gap-x-2 md:gap-y-16"> */}
          <div className="flex flex-wrap items-center justify-center mt-2 space-x-4 space-y-8">
            {customerLogos2.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center justify-center"
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="object-contain h-8"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left column */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Mengapa Memilih bosqproperti.com?
            </h3>
            <ul className="space-y-2">
              {[
                "Database properti terlengkap",
                "Tim agen profesional berpengalaman",
                "Antarmuka website user-friendly",
                "Transaksi aman dan transparan",
                "Layanan pelanggan 24/7",
              ].map((item) => (
                <li key={item} className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Middle column */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Setiap Listing Properti di bosqproperti.com Meliputi:
            </h3>
            <ul className="space-y-2">
              {[
                "Foto-foto berkualitas tinggi dari berbagai sudut",
                "Tur virtual 360 derajat ",
                "Deskripsi properti yang detail dan informatif",
                "Informasi lengkap mengenai fasilitas",
                "Peta lokasi yang akurat dan interaktif",
              ].map((item) => (
                <li key={item} className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Keuntungan Pemasaran di bosqproperti.com:
            </h3>
            <ul className="space-y-2">
              {[
                "Target pasar luas",
                "Visibilitas online maksimal",
                "Laporan kinerja real-time",
                "Dukungan materi kreatif",
                "Fitur unggulan prioritas",
              ].map((item) => (
                <li key={item} className="flex items-center">
                  <Check className="mr-2 text-green-500" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reviews & examples */}
        <div className="mt-12 text-center">
          <h2 className="mb-4 text-2xl font-semibold">
            Testimoni & Pencapaian Kami
          </h2>
          <div className="text-4xl font-bold text-blue-500">1,345,567</div>
          <div className="text-3xl">Properti Terjual Melalui Platform Kami</div>
          <div className="mt-2 text-4xl">
            dengan <span className="font-bold text-green-500">98.7%</span>{" "}
            Tingkat Kepuasan Pelanggan!
          </div>
          <p className="mt-4 text-gray-600">
            Bergabunglah dengan ribuan pemilik properti yang telah sukses. Lihat
            contoh properti yang telah terjual dan testimoni pelanggan kami.
          </p>
        </div>

        {/* Customer logos */}
        <div className="flex flex-wrap items-center justify-center mt-12 space-x-4 space-y-4">
          {customerLogos.map((customer) => (
            <img
              key={customer.name}
              src={customer.logo}
              alt={`${customer.name} logo`}
              className="object-contain h-8"
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center mt-12 space-x-4 space-y-4">
          {customerLogos3.map((customer) => (
            <img
              key={customer.name}
              src={customer.logo}
              alt={`${customer.name} logo`}
              className="object-contain h-8"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section01;
