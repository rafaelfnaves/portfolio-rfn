import { expect, test } from "@playwright/test";

test("redirects / to the visitor's language, defaulting to pt-BR", async ({
  browser,
}) => {
  const pt = await browser.newContext({ locale: "pt-BR" });
  const ptPage = await pt.newPage();
  await ptPage.goto("/");
  await expect(ptPage).toHaveURL(/\/pt-BR$/);

  const en = await browser.newContext({ locale: "en-US" });
  const enPage = await en.newPage();
  await enPage.goto("/");
  await expect(enPage).toHaveURL(/\/en$/);
});

test("renders every section in Portuguese", async ({ page }) => {
  await page.goto("/pt-BR");

  await expect(
    page.getByRole("heading", { level: 1, name: "Rafael Naves" }),
  ).toBeVisible();
  await expect(
    page.getByText("Engenheiro de Software", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "LinkedIn de Rafael Naves" }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Habilidades" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Projetos" })).toBeVisible();
  await expect(page.getByTestId("project-row")).toHaveCount(3);
  await expect(
    page.getByRole("heading", { name: "Vamos conversar" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Enviar mensagem" }),
  ).toBeVisible();
});

test("renders English and keeps the section when switching language", async ({
  page,
}) => {
  await page.goto("/en#projects");
  await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.getByRole("link", { name: "Ler em português" }).click();

  await expect(page).toHaveURL(/\/pt-BR#projects$/);
  await expect(page.getByRole("heading", { name: "Projetos" })).toBeVisible();
});

test("theme toggle switches theme and survives a reload", async ({
  browser,
}) => {
  const context = await browser.newContext({ colorScheme: "light" });
  const page = await context.newPage();
  await page.goto("/en");
  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);

  await page.getByTestId("theme-toggle").click();
  await expect(html).toHaveClass(/dark/);

  await page.reload();
  await expect(html).toHaveClass(/dark/);
});
