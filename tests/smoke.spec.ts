import { test, expect, devices } from "@playwright/test";

// Prueba de humo contra una URL (por defecto producción):
//   BASE_URL=http://localhost:3000 npm run test:e2e
const BASE = process.env.BASE_URL ?? "https://discap-anmalu.vercel.app";
test.use({ ...devices["iPhone 13"] });

test("la portada carga y lleva al traductor", async ({ page }) => {
  await page.goto(BASE);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("manos");
  await page.getByRole("link", { name: /Traductor/ }).first().click();
  await expect(page).toHaveURL(/traductor/);
});

test("«hola» se deletrea con foto y seña formal", async ({ page }) => {
  await page.goto(BASE + "/traductor");
  await page.getByLabel("Texto a traducir").fill("hola");
  await page.getByRole("button", { name: "Traducir" }).click();
  const foto = page.getByAltText(/haciendo la letra H/);
  await expect(foto).toBeVisible();
  await expect(page.getByAltText("Seña formal de la letra H")).toBeVisible();
});

test("un video de expresiones reproduce", async ({ page }) => {
  await page.goto(BASE + "/expresiones");
  await page.getByRole("button", { name: /Hola/ }).first().click();
  const video = page.locator("video");
  await expect.poll(async () => video.evaluate(v => (v as HTMLVideoElement).readyState), { timeout: 20000 }).toBeGreaterThanOrEqual(2);
});

test("el buzón de ideas se ve", async ({ page }) => {
  await page.goto(BASE + "/ideas");
  await expect(page.getByRole("heading", { name: "Buzón de ideas" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Enviar/ })).toBeDisabled();
});
