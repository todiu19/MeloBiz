import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  headless: true,
});

for (const route of [
  { name: "home", path: "/" },
  { name: "industries", path: "/loai-hinh" },
  { name: "cafe", path: "/loai-hinh/quan-ca-phe" },
]) {
  for (const viewport of [
    { name: "mobile", width: 390, height: 1000 },
    { name: "desktop", width: 1440, height: 1200 },
  ]) {
    const page = await browser.newPage({ viewport });
    await page.goto(`http://localhost:3001${route.path}`, { waitUntil: "networkidle" });
    const metrics = await page.evaluate(() => ({
      innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      overflowers: [...document.querySelectorAll("*")]
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.right > innerWidth + 1 || rect.left < -1;
        })
        .slice(0, 20)
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName,
            className: element.className,
            left: Math.round(rect.left),
            right: Math.round(rect.right),
          };
        }),
    }));
    console.log(`${route.name}-${viewport.name}`, JSON.stringify(metrics));
    await page.screenshot({
      path: `layout-${route.name}-${viewport.name}.png`,
      fullPage: true,
    });
    await page.close();
  }
}

await browser.close();
