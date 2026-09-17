import { jsPDF } from "jspdf";
import { chargeMinuteSample, policeReportSample, policeTransactions } from "../../fixtures/sample-documents";

// A4 in points.
const PAGE_H = 841.89;
const MARGIN_L = 72;
const MARGIN_R = 72;
const MARGIN_TOP = 84;
const MARGIN_BOTTOM = 76;
const PAGE_W = 595.28;
const SIZE = 11;
const LINE_H = SIZE * 1.55;

class MinuteDoc {
  doc = new jsPDF({ unit: "pt", format: "a4" });
  y = MARGIN_TOP;

  private ensure(height: number) {
    if (this.y + height > PAGE_H - MARGIN_BOTTOM) {
      this.doc.addPage();
      this.y = MARGIN_TOP;
    }
  }

  private setFont(bold: boolean) {
    this.doc.setFont("helvetica", bold ? "bold" : "normal");
    this.doc.setFontSize(SIZE);
  }

  space(gap = LINE_H * 0.75) {
    this.y += gap;
  }

  line(text: string, opts: { bold?: boolean; underline?: boolean; x?: number } = {}) {
    const x = opts.x ?? MARGIN_L;
    this.setFont(opts.bold ?? false);
    this.ensure(LINE_H);
    this.doc.text(text, x, this.y);
    if (opts.underline) {
      this.doc.setLineWidth(0.8);
      this.doc.line(x, this.y + 2.4, x + this.doc.getTextWidth(text), this.y + 2.4);
    }
    this.y += LINE_H;
  }

  para(text: string, opts: { x?: number; width?: number; bold?: boolean; gap?: number } = {}) {
    const x = opts.x ?? MARGIN_L;
    const width = opts.width ?? PAGE_W - MARGIN_R - x;
    this.setFont(opts.bold ?? false);
    const lines = this.doc.splitTextToSize(text, width) as string[];
    const height = lines.length * LINE_H;
    this.ensure(height);
    this.doc.text(text, x, this.y, { maxWidth: width, align: "justify", lineHeightFactor: 1.55 });
    this.y += height + (opts.gap ?? LINE_H * 0.6);
  }

  heading(num: string, title: string) {
    this.ensure(LINE_H * 2.4);
    this.space(LINE_H * 0.5);
    this.setFont(true);
    this.doc.text(num, MARGIN_L, this.y);
    this.doc.text(title, MARGIN_L + 44, this.y);
    this.y += LINE_H * 1.5;
  }

  subheading(text: string) {
    this.ensure(LINE_H * 2);
    this.setFont(true);
    const x = MARGIN_L + 44;
    this.doc.text(text, x, this.y);
    this.doc.setLineWidth(0.8);
    this.doc.line(x, this.y + 2.4, x + this.doc.getTextWidth(text), this.y + 2.4);
    this.y += LINE_H * 1.4;
  }

  kv(label: string, value: string) {
    const xLabel = MARGIN_L + 62;
    const xColon = MARGIN_L + 158;
    const xValue = MARGIN_L + 172;
    const width = PAGE_W - MARGIN_R - xValue;
    this.setFont(false);
    const lines = this.doc.splitTextToSize(value, width) as string[];
    const height = lines.length * LINE_H;
    this.ensure(height);
    this.doc.text(label, xLabel, this.y);
    this.doc.text(":", xColon, this.y);
    this.doc.text(lines, xValue, this.y, { lineHeightFactor: 1.55 });
    this.y += height + LINE_H * 0.2;
  }

  bullet(text: string) {
    const xDot = MARGIN_L + 78;
    const xText = MARGIN_L + 100;
    const width = PAGE_W - MARGIN_R - xText;
    this.setFont(false);
    const lines = this.doc.splitTextToSize(text, width) as string[];
    const height = lines.length * LINE_H;
    this.ensure(height);
    this.doc.text("•", xDot, this.y);
    this.doc.text(text, xText, this.y, { maxWidth: width, align: "justify", lineHeightFactor: 1.55 });
    this.y += height + LINE_H * 0.35;
  }

  numbered(num: string, text: string, opts: { xNum?: number; xText?: number } = {}) {
    const xNum = opts.xNum ?? MARGIN_L + 44;
    const xText = opts.xText ?? MARGIN_L + 100;
    const width = PAGE_W - MARGIN_R - xText;
    this.setFont(false);
    const lines = this.doc.splitTextToSize(text, width) as string[];
    const height = lines.length * LINE_H;
    this.ensure(height);
    this.doc.text(num, xNum, this.y);
    this.doc.text(text, xText, this.y, { maxWidth: width, align: "justify", lineHeightFactor: 1.55 });
    this.y += height + LINE_H * 0.35;
  }
}

export function downloadChargeMinutePdf() {
  const m = new MinuteDoc();
  const reportNo = policeReportSample.reportNo; // KUALA LUMPUR/12345/26
  const caseRef = policeReportSample.caseRef.replace("MOCK/", ""); // JSJK/KS/001/26

  // Address block.
  m.line("YDH SAC Zulkifli bin Abdul Rahman", { bold: true });
  m.line("Pengarah", { bold: true });
  m.line("Integriti & Pematuhan Piawaian", { bold: true });
  m.line("Jabatan Siasatan Jenayah Komersil", { bold: true });
  m.line("Bukit Aman.", { bold: true, underline: true });
  m.space(LINE_H);

  m.para("Minit (5) adalah dirujuk.");
  m.para(
    `Ringkasan hasil siasatan berkait ${caseRef} bth ${policeReportSample.date} yang dibuka ke atas ${reportNo} dikemukakan untuk makluman dan arahan lanjut.`,
  );

  m.heading("2.1", "LAPORAN POLIS");
  m.kv("No. Laporan", `${reportNo}  Bth ${policeReportSample.date} Jam ${policeReportSample.time}Hrs`);
  m.kv("Kerugian", policeReportSample.loss);
  m.kv("Seksyen Kesalahan", chargeMinuteSample.section);

  m.heading("2.2", "PENGADU (A1)");
  m.kv("Nama", policeReportSample.complainant);
  m.kv("Kpt", "930715-14-5566");
  m.kv("Umur", "34 Tahun");
  m.kv("Pekerjaan", "Eksekutif Pemasaran");
  m.kv("Telefon", policeReportSample.phone);
  m.kv("Alamat", "Kuala Lumpur");

  m.heading("3.", "KETERANGAN KES");
  m.para(policeReportSample.narrative.join(" "), { x: MARGIN_L + 44 });

  m.heading("4.", "MODUS OPERANDI");
  m.para(
    "Menghubungi mangsa melalui WhatsApp dengan menyamar sebagai khidmat pelanggan platform pelaburan, memaparkan keuntungan palsu melalui laman invest-pro-demo.example dan mengarahkan pindahan wang ke akaun keldai.",
    { x: MARGIN_L + 44 },
  );

  m.heading("5.", "TANGKAPAN DAN RAMPASAN");
  m.subheading("5.1  OKT (B1)");
  m.kv("Nama", chargeMinuteSample.suspect);
  m.kv("Kpt", "940208-10-5121");
  m.kv("Umur", "32 Tahun");
  m.kv("Pekerjaan", "Juruteknik");
  m.kv("Rekod", "Tiada rekod jenayah lampau");
  m.space();
  m.bullet(`B1 merupakan pemegang berdaftar akaun ${policeReportSample.recipientBank} ${policeReportSample.recipientAccount}.`);
  m.bullet('Mengaku menyerahkan kad debit, PIN, ID perbankan dalam talian dan telefon penerima OTP kepada individu dikenali sebagai "Riz".');
  m.bullet("Mengaku menerima bayaran RM800.00 bagi penyerahan kawalan akaun tersebut.");
  m.space();

  m.subheading("5.2  RAMPASAN");
  m.numbered("5.2.1", "(1) Unit Telefon Bimbit Jenama Orbis X2 Ditanda H1");
  m.numbered("5.2.2", "(1) Unit Kad Debit Bank Alfa Berhad Ditanda H2");
  m.numbered("5.2.3", "(3) Keping Resit Pindahan Dalam Talian Ditanda H3");
  m.numbered("5.2.4", "(6) Keping Tangkap Layar WhatsApp Ditanda H4");

  m.heading("6.", "HASIL SIASATAN");
  const txLine = policeTransactions
    .map((t) => `${t.amount} jam ${t.occurredAt.split(" ")[1]}`)
    .join(", ");
  m.numbered(
    "6.1",
    `Semakan rekod bank mengesahkan akaun ${policeReportSample.recipientBank} ${policeReportSample.recipientAccount} menerima tiga (3) pindahan daripada A1 berjumlah ${policeReportSample.loss} (${txLine} pada ${policeReportSample.date}) dan wang dipindahkan keluar dalam tempoh 32 minit ke dua akaun hiliran. (Rujuk Folio D4)`,
  );
  m.numbered(
    "6.2",
    'Analisis forensik ke atas telefon H1 menemui perbualan Telegram antara B1 dan individu "Riz" yang mengandungi gambar kad debit, butiran perbankan dalam talian dan pengesahan bayaran RM800.00. (Rujuk Folio D5)',
  );
  m.numbered(
    "6.3",
    "Semakan CCIS mendapati akaun penerima yang sama muncul dalam tiga (3) laporan polis lain dengan kerugian terkumpul RM91,200.00 antara 03/07/2026 hingga 06/07/2026. (Rujuk Folio D6)",
  );
  m.numbered(
    "6.4",
    "Analisis data telco (CDR) mendapati nombor 013-333 2300 kerap bersambung ke BTS-KUL-0412, Jalan Cheras, Taman Pertama, Kuala Lumpur (72% daripada sesi yang diperhatikan). Anggaran kawasan sahaja dan memerlukan pengesahan telco. (Rujuk Folio D7)",
  );

  m.heading("7.", "LAPORAN");
  m.numbered("7.1", "Laporan pengesahan bank ke atas akaun penerima dan aliran keluar dana. Mohon YA merujuk Folio D4.");
  m.numbered("7.2", "Laporan Forensik ke atas telefon bimbit tandaan H1. Mohon YA merujuk Folio D5.");
  m.numbered("7.3", "Laporan padanan CCIS ke atas laporan berkaitan. Mohon YA merujuk Folio D6.");

  m.heading("8.", "CADANGAN");
  m.para(
    `Berdasarkan kepada keterangan yang ada, dicadangkan agar menuduh B1 di bawah ${chargeMinuteSample.section} kerana:`,
  );
  chargeMinuteSample.evidence.forEach((item, i) => {
    m.numbered(`8.${i + 1}`, item);
  });
  m.space();
  m.para(chargeMinuteSample.beforeCharge, { x: MARGIN_L + 44 });
  m.para("Kertas siasatan dimajukan cadangan pertuduhan untuk perhatian YDH Tuan jika bersetuju.");
  m.space(LINE_H);
  m.para("Sekian, terima kasih.");

  m.doc.save(`Minit-Cadangan-Pertuduhan-${caseRef.replaceAll("/", "-")}.pdf`);
}
