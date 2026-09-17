export interface SampleFact {
  id: string;
  label: string;
  value: string;
  source: string;
  confidence: "High" | "Medium";
  status: "pending" | "confirmed";
}

export interface SampleTransaction {
  id: string;
  occurredAt: string;
  recipient: string;
  account: string;
  amount: string;
}

export const policeReportSample = {
  reportNo: "KUALA LUMPUR/12345/26",
  caseRef: "MOCK/JSJK/KS/001/26",
  date: "05/07/2026",
  time: "1045",
  station: "Balai Polis Kuala Lumpur",
  category: "Penipuan pelaburan dalam talian",
  loss: "RM48,750.00",
  complainant: "Nur Aina binti Rahman",
  phone: "017-777 1123",
  scamContact: "013-333 2300",
  website: "invest-pro-demo.example",
  recipientBank: "Bank Alfa Berhad",
  recipientAccount: "1234 5644 3200",
  recipientName: "Amir Hakim bin Salleh",
  narrative: [
    "Pada 05/07/2026 lebih kurang jam 0915, semasa pengadu berada di rumah di Kuala Lumpur, pengadu menerima mesej WhatsApp daripada nombor 013-333 2300.",
    "Individu tersebut memperkenalkan diri sebagai pegawai khidmat pelanggan sebuah platform pelaburan dan memaklumkan bahawa pengadu layak mengeluarkan keuntungan daripada akaun pelaburan.",
    "Pengadu diberikan pautan invest-pro-demo.example dan diarahkan membuat bayaran bagi tujuan pengesahan akaun serta pelepasan keuntungan.",
    "Pengadu membuat tiga pindahan wang melalui perbankan dalam talian ke akaun Bank Alfa Berhad nombor 1234 5644 3200 atas nama Amir Hakim bin Salleh.",
    "Selepas pindahan ketiga dibuat, paparan laman web menunjukkan keuntungan tetapi wang tidak boleh dikeluarkan. Individu berkenaan kemudian meminta satu lagi bayaran.",
    "Pengadu menghubungi pihak bank dan dimaklumkan supaya membuat laporan polis dengan segera.",
  ],
};

export const policeTransactions: SampleTransaction[] = [
  { id: "TX-01", occurredAt: "05/07/2026 0928", recipient: "Amir Hakim bin Salleh", account: "1234 5644 3200", amount: "RM15,000.00" },
  { id: "TX-02", occurredAt: "05/07/2026 0947", recipient: "Amir Hakim bin Salleh", account: "1234 5644 3200", amount: "RM18,750.00" },
  { id: "TX-03", occurredAt: "05/07/2026 1002", recipient: "Amir Hakim bin Salleh", account: "1234 5644 3200", amount: "RM15,000.00" },
];

export const extractedSampleFacts: SampleFact[] = [
  { id: "sample-fact-1", label: "Pengadu", value: "Nur Aina binti Rahman", source: "B. Maklumat Pengadu", confidence: "High", status: "pending" },
  { id: "sample-fact-2", label: "Kategori kejadian", value: "Penipuan pelaburan dalam talian", source: "A. Maklumat Laporan", confidence: "High", status: "pending" },
  { id: "sample-fact-3", label: "Jumlah kerugian", value: "RM48,750.00", source: "A. Maklumat Laporan / E. Rekod Transaksi", confidence: "High", status: "pending" },
  { id: "sample-fact-4", label: "Nombor WhatsApp suspek", value: "013-333 2300", source: "C. Butiran Kejadian", confidence: "High", status: "pending" },
  { id: "sample-fact-5", label: "Pautan laman web", value: "invest-pro-demo.example", source: "C. Butiran Kejadian", confidence: "High", status: "pending" },
  { id: "sample-fact-6", label: "Akaun penerima", value: "Bank Alfa Berhad 1234 5644 3200", source: "C. Butiran Kejadian / E. Rekod Transaksi", confidence: "High", status: "pending" },
  { id: "sample-fact-7", label: "Nama penerima", value: "Amir Hakim bin Salleh", source: "C. Butiran Kejadian", confidence: "High", status: "pending" },
  { id: "sample-fact-8", label: "Dokumen dikemukakan", value: "3 resit pindahan, 6 tangkap layar WhatsApp, 3 tangkap layar laman web", source: "F. Dokumen Dikemukakan", confidence: "Medium", status: "pending" },
];

export const chargeMinuteSample = {
  title: "Minit Cadangan Pertuduhan",
  section: "Seksyen 424B Kanun Keseksaan [Akta 574]",
  classification: "Penipuan kewangan dalam talian / akaun keldai",
  suspect: "Amir Hakim bin Salleh",
  recommendation:
    "Berdasarkan keterangan yang ada, dicadangkan agar B1 dituduh di bawah Seksyen 424B Kanun Keseksaan kerana bukti menunjukkan B1 telah memberikan kawalan akaun bank dan instrumen pembayarannya kepada orang lain tanpa kuasa yang sah atau maksud yang sah.",
  evidence: [
    "B1 mengaku menyerahkan kad debit, PIN, ID perbankan dalam talian dan telefon penerima OTP kepada individu dikenali sebagai Riz.",
    "Rekod bank mengesahkan akaun milik B1 menerima RM48,750.00 daripada A1 dan wang dipindahkan keluar dalam tempoh 32 minit.",
    "Analisis forensik H1 menyokong penyerahan kawalan akaun dan penerimaan bayaran RM800.00 oleh B1.",
    "B1 gagal mengemukakan kuasa atau maksud sah bagi penyerahan kawalan akaun kepada pihak ketiga.",
  ],
  beforeCharge:
    "Sebelum pertuduhan didaftarkan, Pegawai Penyiasat hendaklah mengesahkan lokasi dan tarikh penyerahan, rantaian jagaan H1 hingga H4, identiti pegawai pengesah bank serta teks peruntukan yang berkuat kuasa pada tarikh kesalahan.",
};
