import { test, expect, devices } from "@playwright/test";

// Prueba de humo contra una URL (por defecto producción):
//   BASE_URL=http://localhost:3000 npm run test:e2e
const BASE = process.env.BASE_URL ?? "https://discap-anmalu.vercel.app";
test.use({ ...devices["iPhone 13"], defaultBrowserType: "chromium" });

test("la portada carga y lleva al traductor", async ({ page }) => {
  await page.goto(BASE);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("manos");
  await page.getByRole("link", { name: /Traductor/ }).first().click();
  await expect(page).toHaveURL(/traductor/);
});

test("«luz» se deletrea con foto y seña formal", async ({ page }) => {
  await page.goto(BASE + "/traductor");
  await page.getByLabel("Texto a traducir").fill("luz");
  await page.getByRole("button", { name: "Traducir" }).click();
  await expect(page.getByAltText(/haciendo la letra L/)).toBeVisible();
  await expect(page.getByAltText("Seña formal de la letra L")).toBeVisible();
});

test("«hola» tiene seña propia y muestra su video", async ({ page }) => {
  await page.goto(BASE + "/traductor");
  await page.getByLabel("Texto a traducir").fill("hola");
  await page.getByRole("button", { name: "Traducir" }).click();
  await expect(page.getByText("Seña propia: Hola")).toBeVisible();
  await expect(page.getByRole("button", { name: "Letra por letra" })).toBeVisible();
});

test("un video de expresiones reproduce", async ({ page }) => {
  await page.goto(BASE + "/expresiones");
  await page.getByRole("button", { name: /Hola/ }).first().click();
  const video = page.locator("video");
  await expect.poll(async () => video.evaluate(v => (v as HTMLVideoElement).readyState), { timeout: 20000 }).toBeGreaterThanOrEqual(2);
});

test("practicar muestra una seña y cuatro letras", async ({ page }) => {
  await page.goto(BASE + "/practicar");
  await expect(page.getByAltText("Seña para adivinar")).toBeVisible();
  await expect(page.getByRole("group", { name: "Opciones" }).getByRole("button")).toHaveCount(4);
});

test("la página «qué es» explica cómo usar la app", async ({ page }) => {
  await page.goto(BASE + "/sobre");
  await expect(page.getByRole("heading", { name: "¿Cómo se usa?" })).toBeVisible();
});

test("las lecciones se listan y se puede abrir una", async ({ page }) => {
  await page.goto(BASE + "/lecciones");
  await page.getByRole("button", { name: /Lección 1/ }).click();
  await expect(page.getByRole("tab", { name: /Ver/ })).toBeVisible();
  await expect(page.locator("video")).toBeVisible();
});

test("privacidad y docentes existen", async ({ page }) => {
  await page.goto(BASE + "/privacidad");
  await expect(page.getByRole("heading", { name: "Privacidad" })).toBeVisible();
  await page.goto(BASE + "/docente");
  await expect(page.getByRole("link", { name: /Tarjetas del abecedario/ })).toBeVisible();
});

test("el buzón de ideas se ve", async ({ page }) => {
  await page.goto(BASE + "/ideas");
  await expect(page.getByRole("heading", { name: "Buzón de ideas" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Enviar/ })).toBeDisabled();
});
