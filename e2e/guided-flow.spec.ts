import { test, expect } from "@playwright/test";

// E2E-01/06: full guided flow on production preview with network blocked.
test.describe("guided demo flow (offline)", () => {
  test.beforeEach(async ({ context }) => {
    // Block all external requests; allow only localhost.
    await context.route(/^(?!http:\/\/localhost:4173).*$/, (route) => route.abort());
  });

  test("report → review → CCIS → graphs → minute → audit → reset", async ({ page }) => {
    await page.goto("/");
    // Login screen first
    await expect(page.getByRole("heading", { name: "JSJK Nexus" })).toBeVisible();
    await page.getByLabel(/ID Pegawai|Officer ID/).fill("demo-officer");
    await page.getByLabel(/Kata Laluan|Password/).fill("demo-pass");
    await page.getByRole("button", { name: /Log Masuk|Sign In/ }).click();
    await expect(page.getByText("SYNTHETIC DEMO DATA")).toBeVisible();

    // Queue
    await expect(page.getByText("IPRS-DEMO-2026-008721").first()).toBeVisible();
    await page.getByRole("button", { name: /Buka Laporan|Open/ }).click();

    // Analysis with skip
    await page.getByRole("button", { name: /Analisis Laporan|Analyse Report/ }).click();
    await page.getByRole("button", { name: /Langkau|Skip/ }).click();
    await expect(page.getByText("Fakta Diekstrak / Extracted Facts")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("DEMO-MY-24108")).toBeVisible();

    // Reject seeded error FACT-0471-06
    await page.getByRole("button", { name: "Reject FACT-0471-06" }).click();
    await page.getByRole("button", { name: "Simpan / Save" }).click();

    // Correct → but gate needs primary account confirmed or corrected; rejection passes gate-seeded
    // but gate-account needs confirmed. Re-confirm? Seeded rejected means gate-account unmet.
    // Instead undo: review again as confirmed with correction.
    await page.getByRole("button", { name: "Correct FACT-0471-06" }).click();
    await page.getByRole("textbox", { name: "Corrected value" }).fill("DEMO-MY-24018");
    await page.getByRole("button", { name: "Simpan / Save" }).click();

    // Flag ambiguous FACT-0471-15
    await page.getByRole("button", { name: "Flag FACT-0471-15" }).click();
    await page.getByRole("button", { name: "Simpan / Save" }).click();

    // Confirm loss FACT-0471-09 and a phone FACT-0471-04
    await page.getByRole("button", { name: "Confirm FACT-0471-09" }).click();
    await page.getByRole("button", { name: "Confirm FACT-0471-04" }).click();

    // CCIS gate now open
    const ccisBtn = page.getByRole("button", { name: "Cross-reference with CCIS" });
    await expect(ccisBtn).toBeEnabled();
    await ccisBtn.click();

    // Lands on intelligence
    await expect(page).toHaveURL(/#\/intelligence/, { timeout: 15000 });

    // Activity view default; check table equivalent
    await page.getByRole("button", { name: /Papar jadual|Show table/ }).click();
    await expect(page.getByText("Laporan iPRS dibuat")).toBeVisible();
    await page.getByRole("button", { name: /Papar graf|Show graph/ }).click();

    // Relationship view with CCIS content
    await page.getByRole("button", { name: /Peta Hubungan/ }).click();
    await expect(page.getByText(/Keserupaan analitik kuat/).first()).toBeVisible();

    // Money view reconciliation
    await page.getByRole("button", { name: /Jejak Wang/ }).click();
    await expect(page.getByText(/Unresolved RM3,500/)).toBeVisible();

    // Minute
    await page.goto("/#/minute");
    await page.getByRole("button", { name: /Jana Minit Draf|Generate Draft Minute/ }).click();
    await expect(page.getByText("Ringkasan Laporan Polis")).toBeVisible();
    await expect(page.getByText(/RM3,500/).first()).toBeVisible();

    // Edit one section
    await page.getByRole("button", { name: "Edit seksyen" }).first().click();
    await page.getByRole("textbox").first().fill("Ringkasan diedit oleh pegawai (demo).");
    await page.getByRole("button", { name: "Simpan / Save" }).click();
    await expect(page.getByText("Ringkasan diedit oleh pegawai (demo).")).toBeVisible();

    // Regenerate chronology section → new version
    await page.getByRole("button", { name: "Jana semula seksyen ini sahaja" }).nth(2).click();
    await expect(page.getByRole("combobox").first()).toContainText("v2");

    // Status change
    await page.getByLabel("Minute status").selectOption("ready_for_approval");

    // Architecture & audit
    await page.goto("/#/architecture");
    await expect(page.getByText(/standalone React demonstration/)).toBeVisible();
    await expect(page.getByText(/Simulated audit trail/)).toBeVisible();
    await expect(page.getByText("review_fact").first()).toBeVisible();

    // Reset
    page.on("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Reset Demo" }).click();
    await page.getByRole("button", { name: "Set Semula / Reset" }).click();
    await expect(page.getByText("SYNTHETIC DEMO DATA")).toBeVisible();
    await page.goto("/#/report");
    await expect(page.getByRole("button", { name: /Analisis Laporan|Analyse Report/ })).toBeVisible();
  });

  test("E2E-04: invalid saved state recovers to canonical", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Log Masuk|Sign In/ }).click();
    await page.evaluate(() => {
      localStorage.setItem("jsjk-nexus-demo-state-v1", JSON.stringify({ bogus: true }));
    });
    await page.reload();
    await expect(page.getByText(/canonical opening state was restored/)).toBeVisible();
    await expect(page.getByText("SYNTHETIC DEMO DATA")).toBeVisible();
  });
});
