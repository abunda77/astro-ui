import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq: React.FC = () => {
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-center text-blue-800 dark:text-blue-300">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h1>

        <div className="p-8 mb-8 rounded-lg shadow-lg bg-gradient-to-r from-gray-200 to-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-gray-800 dark:text-gray-200">
                Apa itu Bosque Properti?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-300">
                Bosque Properti adalah perusahaan pemasaran properti yang
                membantu Anda menemukan properti impian, baik untuk hunian
                maupun investasi. Kami menyediakan berbagai pilihan properti
                baru dan bekas dengan harga kompetitif.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-gray-800 dark:text-gray-200">
                Layanan apa saja yang ditawarkan Bosque Properti?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-300">
                Kami menawarkan layanan pemasaran properti, konsultasi properti,
                serta layanan tambahan seperti konsultasi interior dan renovasi
                tanpa biaya tambahan.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-gray-800 dark:text-gray-200">
                Bagaimana cara menghubungi Bosque Properti?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-300">
                Anda dapat menghubungi kami melalui nomor telepon yang tertera
                di halaman Kontak atau mengunjungi kantor kami di Jalan
                Boulevard Utara Podomoro Park Bandung, Ruko Neo Plaza Blok F
                no.06.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="text-center">
          <a
            href="/contact"
            className="inline-block px-6 py-3 text-lg font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600"
          >
            Hubungi Kami untuk Informasi Lebih Lanjut
          </a>
        </div>
      </div>
    </div>
  );
};

export default Faq;
